-- A-07 — core tables, indexes and row-level security.
-- Source: _shared/SCHEMA-CORE.md §3. Reporting view: §4.
--
-- **Premise check, recorded rather than assumed.** §3 carries two figures and neither is
-- built to:
--
--   * `is_ai_referral` is commented "R1: 22% conversion premium". That figure is already
--     flagged unmeasured in FOUNDATION, which says it "must be measured, not assumed". The
--     column exists so it CAN be measured. Nothing here treats it as known.
--   * `notified_at - created_at` is the speed-to-lead metric with "alert if p95 exceeds 60
--     seconds". That is a target, not a measurement — nothing measures it yet and A-08 owns
--     it. The column exists; the alert does not, and this file does not pretend otherwise.
--
-- **The RLS shape has a consequence the spec does not state**, and it is the kind that is
-- discovered at runtime: with RLS enabled, an insert policy and NO select policy, an
-- `insert ... returning *` FAILS for anon — PostgREST's default `Prefer: return=representation`
-- makes every insert a read as well. The lead pipeline must insert with `returning=minimal`.
-- That is A-08's to honour; it is written here because this file is where the constraint is
-- created.

create type division_t    as enum ('design', 'digital', 'press', 'unsure');
create type lead_type_t   as enum ('enquiry', 'sample_request', 'estimate', 'assessment', 'newsletter');
create type lead_status_t as enum ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'spam');

create table leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  division        division_t not null,
  track           text,
  lead_type       lead_type_t not null default 'enquiry',
  service_slug    text,
  full_name       text not null,
  email           text not null,
  company         text,
  role            text,
  phone           text,
  message         text,
  budget_band     text,
  timeline        text,
  payload         jsonb not null default '{}'::jsonb,
  source          text,
  medium          text,
  campaign        text,
  referrer        text,
  landing_page    text,
  is_ai_referral  boolean not null default false,
  status          lead_status_t not null default 'new',
  notified_at     timestamptz,
  crm_synced_at   timestamptz,
  notes           text
);

create index leads_division_created_idx on leads (division, created_at desc);
create index leads_status_idx           on leads (status) where status = 'new';
create index leads_ai_referral_idx      on leads (is_ai_referral, created_at desc);
create index leads_payload_gin          on leads using gin (payload);

create table sample_grants (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references leads(id) on delete cascade,
  asset_key   text not null,
  token       text not null unique,
  expires_at  timestamptz not null,
  used_at     timestamptz,
  created_at  timestamptz not null default now()
);

create table events (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  session_id  text not null,
  event       text not null,
  division    division_t,
  props       jsonb not null default '{}'::jsonb
);
create index events_event_created_idx on events (event, created_at desc);

-- Row-level security.
--
-- **Enabled on every table, including the two the spec does not mention.** SCHEMA-CORE only
-- writes `alter table leads enable row level security`. A table without RLS is readable by
-- anon through PostgREST by default, so leaving `sample_grants` and `events` unguarded would
-- expose every download token and every session id — `sample_grants.token` is a bearer
-- credential with a 72h expiry. The spec's omission is not a decision to leave them open.
alter table leads         enable row level security;
alter table sample_grants enable row level security;
alter table events        enable row level security;

-- The only anon capability in the schema: submit a lead. `with check (true)` is deliberate —
-- a public contact form accepts submissions from people who are not authenticated and about
-- whom nothing is yet known. What makes that safe is the absence of everything else.
create policy "anon insert only" on leads for insert to anon with check (true);

-- **No select, update or delete policy for anon on any table, and no anon insert on the other
-- two.** With RLS enabled, absence is denial — reads are service-role only, which bypasses
-- RLS by design. Adding a select policy here would expose the lead table to the browser.
-- `sample_grants` and `events` are written server-side only.

create view v_lead_funnel as
select division,
       date_trunc('week', created_at) as week,
       count(*)                                                            as leads,
       count(*) filter (where status in ('qualified', 'proposal', 'won'))  as qualified,
       count(*) filter (where status = 'won')                              as won,
       count(*) filter (where is_ai_referral)                              as ai_referral_leads,
       avg(extract(epoch from (notified_at - created_at)))                 as avg_notify_seconds
from leads
where status <> 'spam'
group by 1, 2;
