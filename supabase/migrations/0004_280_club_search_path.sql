-- Supabase installs pgcrypto (gen_random_bytes) in the "extensions" schema,
-- so the booking functions need it on their search path.

alter function club_reserve_place(uuid, text, text, text, int, text, text, int, text) set search_path = public, extensions;
alter function club_offer_spaces(uuid, int) set search_path = public, extensions;
alter function club_ensure_classes(date, int) set search_path = public, extensions;
alter function club_confirm_booking(uuid, text, text, int) set search_path = public, extensions;
alter function club_cancel_booking(text, int) set search_path = public, extensions;
alter function club_cancel_class(uuid, text) set search_path = public, extensions;
