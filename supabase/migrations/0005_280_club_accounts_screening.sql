-- Auric 280 Club: customer accounts, saved children, health screening,
-- coach reviews, consent records and optional permissions.
-- Also: 12 adults per class and no fixed limit on children.
-- Run after 0004.

-- ---------------------------------------------------------------------------
-- 12 places, no child cap
-- ---------------------------------------------------------------------------

alter table club_classes alter column capacity set default 12;
update club_classes set capacity = 12 where capacity = 10 and starts_at > now();

alter table club_bookings drop constraint if exists club_bookings_children_check;
alter table club_bookings add constraint club_bookings_children_check check (children >= 0);
alter table club_waitlist drop constraint if exists club_waitlist_children_check;
alter table club_waitlist add constraint club_waitlist_children_check check (children >= 0);

-- ---------------------------------------------------------------------------
-- Customers (one per verified email) and their saved details
-- ---------------------------------------------------------------------------

create table if not exists club_customers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  phone text,
  adult_confirmed_at timestamptz,           -- confirmed they are 18 or over
  emergency_name text,
  emergency_relationship text,
  emergency_phone text,
  care_notes text,                          -- private: who may collect/care for children, restrictions
  profile_completed_at timestamptz,
  last_sign_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists club_customers_email on club_customers (lower(email));

-- Every change to a profile or children list keeps the previous version.
create table if not exists club_customer_history (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references club_customers(id) on delete restrict,
  changed_by text not null,                 -- 'customer' or a coach's email
  reason text not null,                     -- e.g. 'profile', 'children'
  snapshot jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists club_customer_history_customer on club_customer_history (customer_id, created_at);

create table if not exists club_children (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references club_customers(id) on delete restrict,
  name text not null,
  age text not null,                        -- free text so "8 months" works for babies
  relationship text not null,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists club_children_customer on club_children (customer_id);

-- ---------------------------------------------------------------------------
-- Consents and permissions (append-only; the latest row per kind is current)
-- health    = explicit consent to process health answers (required for screening)
-- photo       = optional photography permission (the adult)
-- child_photo = optional photography permission for the children they bring
-- marketing = optional marketing emails
-- ---------------------------------------------------------------------------

create table if not exists club_consents (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references club_customers(id) on delete restrict,
  kind text not null check (kind in ('health', 'photo', 'child_photo', 'marketing')),
  granted boolean not null,
  version text not null,
  statement text not null,
  source text not null,                     -- 'booking', 'account' or 'coach'
  ip text,
  created_at timestamptz not null default now()
);
create index if not exists club_consents_customer on club_consents (customer_id, kind, created_at desc);

-- ---------------------------------------------------------------------------
-- Health screening (immutable submissions) and coach reviews
-- kind = 'full'       a complete questionnaire
-- kind = 'no_change'  a returning customer confirmed nothing has changed
-- ---------------------------------------------------------------------------

create table if not exists club_screenings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references club_customers(id) on delete restrict,
  kind text not null check (kind in ('full', 'no_change')),
  questionnaire_version text not null,
  answers jsonb,                            -- {"q1":"no",...} for full submissions
  details text,
  contact_privately boolean not null default false,
  change_answer text check (change_answer in ('no', 'yes', 'unsure')),
  base_screening_id uuid references club_screenings(id),
  needs_review boolean not null default true,
  source text not null,                     -- 'booking' or 'account'
  ip text,
  created_at timestamptz not null default now()
);
create index if not exists club_screenings_customer on club_screenings (customer_id, created_at desc);

create table if not exists club_screening_reviews (
  id uuid primary key default gen_random_uuid(),
  screening_id uuid not null references club_screenings(id) on delete restrict,
  customer_id uuid not null references club_customers(id) on delete restrict,
  status text not null check (status in (
    'submitted', 'awaiting_discussion', 'awaiting_clinical_evidence',
    'suitable', 'suitable_with_adjustments', 'deferred')),
  reviewer_email text not null,
  questionnaire_version text not null,
  discussion text,
  adjustments text,
  clinical_evidence text,
  follow_up_date date,
  created_at timestamptz not null default now()
);
create index if not exists club_screening_reviews_screening on club_screening_reviews (screening_id, created_at desc);
create index if not exists club_screening_reviews_customer on club_screening_reviews (customer_id, created_at desc);

-- Who looked at health information, and when.
create table if not exists club_access_log (
  id bigint generated always as identity primary key,
  actor_email text not null,
  action text not null,
  customer_id uuid references club_customers(id),
  screening_id uuid references club_screenings(id),
  created_at timestamptz not null default now()
);

-- Records are kept as read-only versions rather than overwritten.
create or replace function club_block_changes() returns trigger
language plpgsql as $$
begin
  raise exception '% records are read-only', tg_table_name;
end;
$$;

drop trigger if exists club_screenings_read_only on club_screenings;
create trigger club_screenings_read_only before update or delete on club_screenings
  for each row execute function club_block_changes();
drop trigger if exists club_screening_reviews_read_only on club_screening_reviews;
create trigger club_screening_reviews_read_only before update or delete on club_screening_reviews
  for each row execute function club_block_changes();
drop trigger if exists club_consents_read_only on club_consents;
create trigger club_consents_read_only before update or delete on club_consents
  for each row execute function club_block_changes();
drop trigger if exists club_customer_history_read_only on club_customer_history;
create trigger club_customer_history_read_only before update or delete on club_customer_history
  for each row execute function club_block_changes();
drop trigger if exists club_access_log_read_only on club_access_log;
create trigger club_access_log_read_only before update or delete on club_access_log
  for each row execute function club_block_changes();

-- ---------------------------------------------------------------------------
-- One-time sign-in codes (customers and coaches). Only a hash is stored.
-- ---------------------------------------------------------------------------

create table if not exists club_auth_codes (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  purpose text not null check (purpose in ('customer', 'coach')),
  code_hash text not null,
  attempts int not null default 0,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists club_auth_codes_lookup on club_auth_codes (lower(email), purpose, created_at desc);

-- ---------------------------------------------------------------------------
-- Bookings: link to the customer and keep what was accepted at the time
-- ---------------------------------------------------------------------------

alter table club_bookings
  add column if not exists customer_id uuid references club_customers(id),
  add column if not exists details_snapshot jsonb,       -- contact + emergency details at booking
  add column if not exists children_snapshot jsonb,      -- children attending this session
  add column if not exists waiver_acknowledged boolean,
  add column if not exists privacy_version text,
  add column if not exists health_consent_version text,
  add column if not exists permissions_snapshot jsonb,
  add column if not exists screening_id uuid references club_screenings(id),
  add column if not exists health_check text check (health_check in ('first', 'no_change', 'updated'));
create index if not exists club_bookings_customer on club_bookings (customer_id);

alter table club_waitlist add column if not exists customer_id uuid references club_customers(id);

-- ---------------------------------------------------------------------------
-- Lock down: only the website's server (service role) can reach any of this.
-- ---------------------------------------------------------------------------

alter table club_customers enable row level security;
alter table club_customer_history enable row level security;
alter table club_children enable row level security;
alter table club_consents enable row level security;
alter table club_screenings enable row level security;
alter table club_screening_reviews enable row level security;
alter table club_access_log enable row level security;
alter table club_auth_codes enable row level security;

revoke all on club_customers, club_customer_history, club_children, club_consents, club_screenings,
  club_screening_reviews, club_access_log, club_auth_codes from anon, authenticated;

grant select, insert, update, delete on club_customers, club_customer_history, club_children,
  club_consents, club_screenings, club_screening_reviews, club_access_log, club_auth_codes to service_role;
