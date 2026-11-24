-- Newer Supabase projects don't grant table access to service_role
-- automatically. The website's server uses the secret key (service_role),
-- so give it access to the 280 Club tables and view.

grant usage on schema public to service_role;
grant select, insert, update, delete on club_classes, club_waitlist, club_bookings to service_role;
grant select on club_class_availability to service_role;
