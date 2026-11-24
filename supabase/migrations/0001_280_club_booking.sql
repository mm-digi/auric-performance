-- Auric 280 Club booking system
-- Run this once in the Supabase SQL editor (or with `supabase db push`).
-- Everything is only reachable with the service role key, which lives on the server.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists club_classes (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null unique,
  ends_at timestamptz not null,
  capacity int not null default 10 check (capacity > 0),
  price_pence int not null default 1000 check (price_pence >= 0),
  status text not null default 'scheduled' check (status in ('scheduled', 'cancelled')),
  cancelled_reason text,
  cancelled_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists club_waitlist (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references club_classes(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  children int not null default 0 check (children between 0 and 2),
  status text not null default 'waiting'
    check (status in ('waiting', 'offered', 'claimed', 'expired', 'removed')),
  offer_token text unique,
  offered_at timestamptz,
  offer_expires_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists club_waitlist_one_active_per_email
  on club_waitlist (class_id, lower(email))
  where status in ('waiting', 'offered');

create index if not exists club_waitlist_queue on club_waitlist (class_id, status, created_at);

create table if not exists club_bookings (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references club_classes(id) on delete restrict,
  name text not null,
  email text not null,
  phone text not null,
  children int not null default 0 check (children between 0 and 2),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled', 'expired')),
  hold_expires_at timestamptz,
  waiver_version text not null,
  waiver_accepted_at timestamptz not null default now(),
  waiver_ip text,
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  amount_pence int,
  confirmed_at timestamptz,
  refund_status text not null default 'none'
    check (refund_status in ('none', 'refunded', 'not_eligible', 'failed')),
  stripe_refund_id text,
  cancelled_at timestamptz,
  cancelled_by text check (cancelled_by in ('customer', 'admin', 'class_cancelled')),
  manage_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  waitlist_id uuid references club_waitlist(id),
  created_at timestamptz not null default now()
);

create unique index if not exists club_bookings_one_confirmed_per_email
  on club_bookings (class_id, lower(email))
  where status = 'confirmed';

create index if not exists club_bookings_class_status on club_bookings (class_id, status);

-- Lock everything down: no access for anon or signed-in users through the public API.
alter table club_classes enable row level security;
alter table club_waitlist enable row level security;
alter table club_bookings enable row level security;
revoke all on club_classes, club_waitlist, club_bookings from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Availability view
-- "taken" counts confirmed bookings, unexpired payment holds and unexpired
-- waiting-list offers, so a space offered to someone is not sold to someone else.
-- ---------------------------------------------------------------------------

create or replace view club_class_availability
with (security_invoker = true) as
select
  c.*,
  (
    (select count(*) from club_bookings b
      where b.class_id = c.id
        and (b.status = 'confirmed' or (b.status = 'pending' and b.hold_expires_at > now())))
    +
    (select count(*) from club_waitlist w
      where w.class_id = c.id and w.status = 'offered' and w.offer_expires_at > now())
  )::int as taken,
  (select count(*) from club_bookings b
    where b.class_id = c.id and b.status = 'confirmed')::int as confirmed,
  (select count(*) from club_waitlist w
    where w.class_id = c.id and w.status in ('waiting', 'offered'))::int as waiting
from club_classes c;

revoke all on club_class_availability from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Reserve a place (atomic). Locks the class row so two people can't take
-- the last space at the same time.
-- ---------------------------------------------------------------------------

create or replace function club_reserve_place(
  p_class_id uuid,
  p_name text,
  p_email text,
  p_phone text,
  p_children int,
  p_waiver_version text,
  p_ip text,
  p_hold_minutes int,
  p_offer_token text default null
)
returns table (result text, booking_id uuid, manage_token text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_class club_classes%rowtype;
  v_offer club_waitlist%rowtype;
  v_taken int;
  v_booking club_bookings%rowtype;
begin
  select * into v_class from club_classes where id = p_class_id for update;
  if not found then
    return query select 'not_found'::text, null::uuid, null::text; return;
  end if;
  if v_class.status <> 'scheduled' then
    return query select 'cancelled'::text, null::uuid, null::text; return;
  end if;
  if v_class.starts_at <= now() then
    return query select 'closed'::text, null::uuid, null::text; return;
  end if;

  update club_bookings set status = 'expired'
    where class_id = p_class_id and status = 'pending' and hold_expires_at <= now();
  update club_waitlist set status = 'expired'
    where class_id = p_class_id and status = 'offered' and offer_expires_at <= now();

  if exists (select 1 from club_bookings
             where class_id = p_class_id and lower(email) = lower(p_email) and status = 'confirmed') then
    return query select 'duplicate'::text, null::uuid, null::text; return;
  end if;

  -- Someone retrying checkout replaces their own earlier hold.
  update club_bookings set status = 'expired'
    where class_id = p_class_id and lower(email) = lower(p_email) and status = 'pending';

  if p_offer_token is not null then
    select * into v_offer from club_waitlist
      where offer_token = p_offer_token and class_id = p_class_id and status = 'offered'
      for update;
    if not found then
      return query select 'offer_invalid'::text, null::uuid, null::text; return;
    end if;
  end if;

  select count(*) into v_taken from club_bookings
    where class_id = p_class_id and status in ('confirmed', 'pending');
  v_taken := v_taken + (
    select count(*) from club_waitlist
    where class_id = p_class_id and status = 'offered'
      and (v_offer.id is null or id <> v_offer.id)
  );

  if v_taken >= v_class.capacity then
    return query select 'full'::text, null::uuid, null::text; return;
  end if;

  insert into club_bookings (
    class_id, name, email, phone, children, status, hold_expires_at,
    waiver_version, waiver_accepted_at, waiver_ip, amount_pence, waitlist_id
  ) values (
    p_class_id, p_name, lower(p_email), p_phone, p_children, 'pending',
    now() + make_interval(mins => p_hold_minutes),
    p_waiver_version, now(), p_ip, v_class.price_pence, v_offer.id
  )
  returning * into v_booking;

  if v_offer.id is not null then
    update club_waitlist set status = 'claimed' where id = v_offer.id;
  end if;

  return query select 'ok'::text, v_booking.id, v_booking.manage_token;
end;
$$;

-- ---------------------------------------------------------------------------
-- Offer free spaces to the waiting list, oldest first. Returns the people
-- who have just been offered a place so the app can email them.
-- ---------------------------------------------------------------------------

create or replace function club_offer_spaces(p_class_id uuid, p_offer_hours int)
returns setof club_waitlist
language plpgsql
security definer
set search_path = public
as $$
declare
  v_class club_classes%rowtype;
  v_taken int;
  v_free int;
  v_expires timestamptz;
begin
  select * into v_class from club_classes where id = p_class_id for update;
  if not found or v_class.status <> 'scheduled' then return; end if;

  update club_bookings set status = 'expired'
    where class_id = p_class_id and status = 'pending' and hold_expires_at <= now();
  update club_waitlist set status = 'expired'
    where class_id = p_class_id and status = 'offered' and offer_expires_at <= now();

  -- No point offering a place less than an hour before the class.
  if v_class.starts_at - interval '1 hour' <= now() then return; end if;

  select count(*) into v_taken from club_bookings
    where class_id = p_class_id and status in ('confirmed', 'pending');
  v_taken := v_taken + (select count(*) from club_waitlist
    where class_id = p_class_id and status = 'offered');
  v_free := v_class.capacity - v_taken;
  if v_free <= 0 then return; end if;

  v_expires := least(now() + make_interval(hours => p_offer_hours),
                     v_class.starts_at - interval '1 hour');

  return query
  update club_waitlist w
     set status = 'offered',
         offer_token = encode(gen_random_bytes(24), 'hex'),
         offered_at = now(),
         offer_expires_at = v_expires
   where w.id in (
     select id from club_waitlist
      where class_id = p_class_id and status = 'waiting'
      order by created_at
      limit v_free
      for update skip locked
   )
  returning w.*;
end;
$$;

revoke all on function club_reserve_place(uuid, text, text, text, int, text, text, int, text) from public, anon, authenticated;
revoke all on function club_offer_spaces(uuid, int) from public, anon, authenticated;
grant execute on function club_reserve_place(uuid, text, text, text, int, text, text, int, text) to service_role;
grant execute on function club_offer_spaces(uuid, int) to service_role;
