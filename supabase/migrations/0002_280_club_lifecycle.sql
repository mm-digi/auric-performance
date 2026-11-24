-- Auric 280 Club: class schedule, payment confirmation and cancellation helpers.
-- Run after 0001_280_club_booking.sql.

-- ---------------------------------------------------------------------------
-- Make sure the next p_weeks Saturdays exist (07:30–08:30 UK time, handling
-- GMT/BST automatically). Never creates classes before p_first.
-- ---------------------------------------------------------------------------

create or replace function club_ensure_classes(p_first date, p_weeks int)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_today date := (now() at time zone 'Europe/London')::date;
  v_start date;
  i int;
begin
  -- Next Saturday on or after today (isodow 6 = Saturday).
  v_start := v_today + ((6 - extract(isodow from v_today)::int + 7) % 7);
  if v_start < p_first then v_start := p_first; end if;

  for i in 0 .. p_weeks - 1 loop
    insert into club_classes (starts_at, ends_at)
    values (
      ((v_start + i * 7) + time '07:30') at time zone 'Europe/London',
      ((v_start + i * 7) + time '08:30') at time zone 'Europe/London'
    )
    on conflict (starts_at) do nothing;
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- Mark a booking as paid. Returns:
--   confirmed  – booking is now confirmed (send the email)
--   already    – it was already confirmed (webhook retry; do nothing)
--   full       – the hold had lapsed and the class filled up meanwhile (refund)
--   not_found
-- ---------------------------------------------------------------------------

create or replace function club_confirm_booking(
  p_booking_id uuid,
  p_session_id text,
  p_payment_intent text,
  p_amount int
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking club_bookings%rowtype;
  v_class club_classes%rowtype;
  v_taken int;
begin
  select * into v_booking from club_bookings where id = p_booking_id;
  if not found then return 'not_found'; end if;

  select * into v_class from club_classes where id = v_booking.class_id for update;
  select * into v_booking from club_bookings where id = p_booking_id for update;

  if v_booking.status = 'confirmed' then return 'already'; end if;

  if v_booking.status <> 'pending' or v_booking.hold_expires_at <= now() then
    -- Paid after the hold lapsed: only keep it if there's still room.
    select count(*) into v_taken from club_bookings
      where class_id = v_class.id and id <> v_booking.id
        and (status = 'confirmed' or (status = 'pending' and hold_expires_at > now()));
    v_taken := v_taken + (select count(*) from club_waitlist
      where class_id = v_class.id and status = 'offered' and offer_expires_at > now());
    if v_class.status <> 'scheduled' or v_taken >= v_class.capacity
       or exists (select 1 from club_bookings where class_id = v_class.id
                  and lower(email) = lower(v_booking.email) and status = 'confirmed') then
      update club_bookings
         set status = 'expired', stripe_session_id = coalesce(p_session_id, stripe_session_id),
             stripe_payment_intent_id = p_payment_intent, amount_pence = p_amount
       where id = v_booking.id;
      return 'full';
    end if;
  end if;

  update club_bookings
     set status = 'confirmed',
         confirmed_at = now(),
         hold_expires_at = null,
         stripe_session_id = coalesce(p_session_id, stripe_session_id),
         stripe_payment_intent_id = p_payment_intent,
         amount_pence = p_amount
   where id = v_booking.id;
  return 'confirmed';
end;
$$;

-- ---------------------------------------------------------------------------
-- Customer cancellation. Full refund if cancelled at least p_cutoff_hours
-- before the class starts (24h = Friday 07:30 for a Saturday 07:30 class).
-- Returns: refund | no_refund | already | not_found | started
-- The app issues the Stripe refund and then records it.
-- ---------------------------------------------------------------------------

create or replace function club_cancel_booking(p_manage_token text, p_cutoff_hours int)
returns table (result text, booking_id uuid, class_id uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking club_bookings%rowtype;
  v_class club_classes%rowtype;
begin
  select * into v_booking from club_bookings where manage_token = p_manage_token for update;
  if not found then
    return query select 'not_found'::text, null::uuid, null::uuid; return;
  end if;
  if v_booking.status <> 'confirmed' then
    return query select 'already'::text, v_booking.id, v_booking.class_id; return;
  end if;
  select * into v_class from club_classes where id = v_booking.class_id;
  if v_class.starts_at <= now() then
    return query select 'started'::text, v_booking.id, v_booking.class_id; return;
  end if;

  update club_bookings
     set status = 'cancelled', cancelled_at = now(), cancelled_by = 'customer',
         refund_status = case
           when now() <= v_class.starts_at - make_interval(hours => p_cutoff_hours) then 'none'
           else 'not_eligible' end
   where id = v_booking.id;

  if now() <= v_class.starts_at - make_interval(hours => p_cutoff_hours) then
    return query select 'refund'::text, v_booking.id, v_booking.class_id;
  else
    return query select 'no_refund'::text, v_booking.id, v_booking.class_id;
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Coach cancels a class: everyone confirmed gets cancelled (and refunded by
-- the app), anyone on the waiting list is removed.
-- ---------------------------------------------------------------------------

create or replace function club_cancel_class(p_class_id uuid, p_reason text)
returns setof club_bookings
language plpgsql
security definer
set search_path = public
as $$
begin
  update club_classes
     set status = 'cancelled', cancelled_reason = p_reason, cancelled_at = now()
   where id = p_class_id;

  update club_waitlist set status = 'removed'
   where class_id = p_class_id and status in ('waiting', 'offered');

  update club_bookings set status = 'expired'
   where class_id = p_class_id and status = 'pending';

  return query
  update club_bookings
     set status = 'cancelled', cancelled_at = now(), cancelled_by = 'class_cancelled'
   where class_id = p_class_id and status = 'confirmed'
  returning *;
end;
$$;

revoke all on function club_ensure_classes(date, int) from public, anon, authenticated;
revoke all on function club_confirm_booking(uuid, text, text, int) from public, anon, authenticated;
revoke all on function club_cancel_booking(text, int) from public, anon, authenticated;
revoke all on function club_cancel_class(uuid, text) from public, anon, authenticated;
grant execute on function club_ensure_classes(date, int) to service_role;
grant execute on function club_confirm_booking(uuid, text, text, int) to service_role;
grant execute on function club_cancel_booking(text, int) to service_role;
grant execute on function club_cancel_class(uuid, text) to service_role;
