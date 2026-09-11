-- GS-P01 — close the public database boundary without changing the enquiry UX.
--
-- The application now writes leads through its server-only boundary. No browser needs direct
-- table access. The explicit revokes below matter independently of RLS: Supabase's default
-- public-schema grants currently give anon/authenticated every table privilege, so a future RLS
-- mistake must not automatically become a read/write breach.

drop policy if exists "anon insert only" on public.leads;

revoke all on table public.leads from anon, authenticated;
revoke all on table public.sample_grants from anon, authenticated;
revoke all on table public.events from anon, authenticated;
revoke all on table public.press_path_results from anon, authenticated;
revoke all on table public._gridsmith_migrations from anon, authenticated;
revoke all on sequence public.events_id_seq from anon, authenticated;

-- Migration bookkeeping is used only by scripts/migrate.mjs through the direct privileged
-- connection. It is not application data and has no public policy.
alter table public._gridsmith_migrations enable row level security;

-- Durable bounds for the public lead payload. Enums and NOT NULL already protect the closed and
-- required fields; these constraints add the limits that must remain true even if a caller bypasses
-- TypeScript. Full email validation stays in Zod because SQL regexes are a poor evolving product
-- contract, but the database rejects blank, oversized and obviously non-email values.
alter table public.leads
  add constraint leads_full_name_bounds check (
    full_name = btrim(full_name) and char_length(full_name) between 1 and 200
  ),
  add constraint leads_email_bounds check (
    email = btrim(email)
    and char_length(email) between 3 and 320
    and position('@' in email) > 1
    and email !~ '[[:space:]]'
  ),
  add constraint leads_track_bounds check (track is null or char_length(track) <= 80),
  add constraint leads_service_slug_bounds check (service_slug is null or char_length(service_slug) <= 200),
  add constraint leads_company_bounds check (company is null or char_length(company) <= 200),
  add constraint leads_role_bounds check (role is null or char_length(role) <= 120),
  add constraint leads_phone_bounds check (phone is null or char_length(phone) <= 40),
  add constraint leads_message_bounds check (message is null or char_length(message) <= 5000),
  add constraint leads_budget_band_bounds check (budget_band is null or char_length(budget_band) <= 80),
  add constraint leads_timeline_bounds check (timeline is null or char_length(timeline) <= 80),
  add constraint leads_source_bounds check (source is null or char_length(source) <= 120),
  add constraint leads_medium_bounds check (medium is null or char_length(medium) <= 120),
  add constraint leads_campaign_bounds check (campaign is null or char_length(campaign) <= 200),
  add constraint leads_referrer_bounds check (referrer is null or char_length(referrer) <= 500),
  add constraint leads_landing_page_bounds check (landing_page is null or char_length(landing_page) <= 500),
  add constraint leads_payload_object check (jsonb_typeof(payload) = 'object'),
  add constraint leads_payload_size check (octet_length(payload::text) <= 16384);

-- Keep broad defaults from silently reappearing on the next object created by the repository
-- migration role. Server-only access is granted deliberately per object.
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated;
