-- A-07 — close an RLS bypass through `v_lead_funnel`.
--
-- **Found by querying the result as `anon`, not by reading the SQL.** `0001` created the view
-- exactly as `_shared/SCHEMA-CORE.md` §4 specifies it, and the specification is incomplete in
-- a way that is invisible in its own text.
--
-- A Postgres view runs with the privileges of its **owner** unless `security_invoker` is set.
-- The owner is `postgres`, which is not subject to row-level security. Supabase grants `anon`
-- and `authenticated` SELECT on everything in `public` by default, and PostgREST exposes
-- views alongside tables. So the view read `leads` as `postgres` and handed the result to
-- whoever asked.
--
-- Measured before this migration, with one qualified lead in the table and the publishable
-- key as the only credential:
--
--   GET /rest/v1/leads?select=full_name,email  -> 200 []                      (RLS working)
--   GET /rest/v1/v_lead_funnel?select=*        -> 200 [{division, leads: 1,   (RLS bypassed)
--                                                       qualified: 1, ...}]
--
-- Aggregates, not names — but lead volume, qualification rate and AI-referral share by week
-- is commercially sensitive, and the mechanism would leak whatever a future view selects.
-- `SCHEMA-CORE.md` §3's comment "reads are service-role only" was true of the table and false
-- of the database.
--
-- Two changes, because either alone leaves a hole: `security_invoker` makes the view obey the
-- caller's RLS, and revoking the default grants means it is not reachable from the browser at
-- all. Reporting runs service-role, which bypasses RLS by design and is unaffected.

alter view v_lead_funnel set (security_invoker = true);

revoke all on v_lead_funnel from anon, authenticated;
