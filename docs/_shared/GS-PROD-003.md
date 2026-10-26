# GS-PROD-003 — Production database security parity and `GS-O005` resolution

**Date:** 2 October 2026 (UTC). **Result: OWNER ACTION REQUIRED.** No production write of any kind.
Runtime `1542f508` (CI `36992631037` success); starting docs `7969dcbd`; main `fbecbe01`; no runtime
source differs between `1542f508` and `7969dcbd`.

Two objectives, both stopped at a condition the phase brief made binding:

- **A — `GS-T004`:** the migration is eligible on its contents (security-only, non-destructive, 63/63
  rows compatible, only it is pending), **but the Production service-role credential cannot be
  verified** without a Production deployment, so it was not applied (`GS-O023`, new).
- **B — `GS-O005`:** classification **C — external/broker confirmation required**. Not closed;
  the three Technical services were not migrated.

## A1. Production service-role credential — not verifiable within scope

| Fact | Evidence |
|---|---|
| Entry | Vercel `gridsmith-ltd`, `SUPABASE_SERVICE_ROLE_KEY` id `xJHwimdj…`, target Production only, type **`sensitive`** |
| Last edit | `updatedAt` 1790933778164 (2 Oct ~09:36 UTC), by the owner, during `GS-O010-R2` |
| `PROJECT_URL` (Production) | also `sensitive` (`tUnXrSoH…`), unedited since creation |
| Readable? | **No.** Vercel sensitive values are write-only — no API, CLI or dashboard can return them, including to the owner |
| Server-side proof available? | **No.** The only READY production-target deployment is `dpl_3D4siJNy…` at `3fbc518f` (11 Aug, scaffold; its tree contains no lead, Supabase or action code). Every later production-target build is `ERROR`. A proof needs a new Production deployment, which this phase prohibits |

The preferred proof (a server-side read-only call using the Production-scoped configuration)
therefore has no execution surface. **No secret value was read, printed or stored. No Production
form submission and no lead was created.** Per the brief this stops `GS-T004` before migration.

**Consequence if the value were wrong, recorded so it is not over-weighted:** the anonymous
insert policy that 0004 removes has **no consumer** in any deployed or deployable build — `main`
(`fbecbe01`) and staging both write only through the service-role `submitLead` since `daf192f1`
(GS-P01), and the READY production deployment has no form. A wrong key makes the first
Production lead fail whether or not 0004 is applied; 0004 neither creates nor hides that risk.
The Vercel project has no custom domain; `gridsmith.uk` is on Hostinger.

## A2. Migration 0004 — exact effect

File `supabase/migrations/20260911203125_gs_p01_security_hardening.sql`, runner SHA
`bd761ff9b9e4` (repository = Preview ledger). Read in full.

| Statement | Effect | Class |
|---|---|---|
| `drop policy if exists "anon insert only" on public.leads` | removes the one public policy | SECURITY ONLY |
| `revoke all … from anon, authenticated` on `leads`, `sample_grants`, `events`, `press_path_results`, `_gridsmith_migrations`, sequence `events_id_seq` | removes public table/sequence privileges | SECURITY ONLY |
| `alter table _gridsmith_migrations enable row level security` | RLS on the ledger (no policy) | SECURITY ONLY |
| 17 × `alter table leads add constraint … check (…)` (bounds on name, email, 13 optional text columns, payload object, payload ≤16 KiB) | validated CHECK; scans, no rewrite, no row change | SCHEMA NON-DESTRUCTIVE |
| 2 × `alter default privileges for role postgres in schema public revoke all on tables/sequences from anon, authenticated` | future-object defaults | SECURITY ONLY |

No view, function, index, column, table, DML, `delete`/`update`/`truncate`, or drop other than the
policy. Nothing UNKNOWN or DESTRUCTIVE. `service_role` grants are untouched (it bypasses RLS).
Runner: one transaction per file with its ledger insert; the file is not idempotent alone, so it
must go through `scripts/migrate.mjs`, never pasted (`GS-P02`).

## A3. Preview (post-0004) — recomputed

`qfgpwumvvtizeamkynes`: ledger 0001–0004 with the repository SHAs; RLS on all 5 tables; **0
policies**; `anon`/`authenticated` table grants **0**; `service_role` full on 5 tables + 2 views;
`events_id_seq` ACL `postgres, service_role` only; `leads` constraints **18** (pkey + the 17
checks above, definitions identical to the file); `leads` indexes 5 (public schema 13); both views
`security_invoker=true`; `postgres` default ACL for tables/sequences without `anon`/`authenticated`;
leads 0.

## A4. Production pre-state (read-only, structural only)

`dqiutgmxillhsbzgnlsx` ACTIVE_HEALTHY, Postgres 17.6.

| | Production now | Expected after 0004 (= Preview) |
|---|---|---|
| Ledger | 0001–0003, SHAs = repository | + `20260911203125…` `bd761ff9b9e4` |
| RLS | `events`, `leads`, `press_path_results`, `sample_grants` on; **`_gridsmith_migrations` off** | all 5 on |
| Policies | 1 — `leads` "anon insert only" (INSERT, `anon`) | 0 |
| `anon` / `authenticated` grants | all 7 privileges on all 5 tables; `events_id_seq` rwU | none |
| `service_role` | full on 5 tables + 2 views | unchanged |
| Views | 2, both `security_invoker=true` | unchanged |
| `leads` constraints | 1 (pkey) | 18 |
| Indexes | `leads` 5, public 13 | unchanged |
| Default ACL (`postgres`, tables/sequences) | includes `anon`, `authenticated` | without them |
| Functions (public) | 0 | 0 |
| Leads | **63**; latest `created_at` 11 Sep 2026 20:13 UTC | 63 |

Constraint compatibility, recomputed today by aggregate count: **0 violating rows for each of the
17 checks, 63/63 compatible** (matches `GS-P02`). Only 0004 is pending; 0001–0003 SHAs match, so
the runner would apply exactly one file.

## A5. Not executed

Backup: **not taken** — taken only when the migration is eligible to run, and it is not.
Migration: **not run.** Production post-state: unchanged from A4. Service-role runtime capability:
**not established** — needs either the cutover smoke test or a deliberate owner decision (`GS-O023`).

## B1. `GS-O005` — the authoritative requirement

`OWNER-ACTIONS.md`: *"Confirm professional-indemnity scope for engineering/CAD work"* — obtain
**written broker/insurer confirmation** of whether the policy covers the intended engineering/CAD
services, its exclusions and limits; policy documents stay out of source. Origin: `Q-M4` / `L-08`
(`01-VALIDATION-REPORT.md` row 4; `BEFORE-LAUNCH.md` §4 — general media/technology policies commonly
exclude engineering drawings and CAD, and Client Terms clause 8.1 is an open item until answered).
It is an **insurance-coverage** question, not a wording one. Enforcement since `GS-P03`:
`check:launch` refuses a production dataset holding a published Technical service without
`professionalScopeConfirmed`, and that flag may be set only after **both** `GS-O005` and
**`GS-X002`** (external professional review of engineering/CAD claims) close. `companyDetails.
piInsurer`/`piCoverLimit` are unset (`PRE-DEPLOYMENT-CHECKLIST.md` A6). No confirmation is recorded
anywhere in the repository.

## B2. Technical copy — claims review (`scripts/service-content.mjs`)

| Service | Offers | Explicitly excludes |
|---|---|---|
| `cad-drafting` | CAD models/drawings from supplied material; native + neutral formats; revision control | design intent, dimensions, tolerances, fitness for purpose, calculations, approval; certification, stamping, regulatory sign-off, responsible-designer role |
| `engineering-drawings` | GA, detail and schematic drawing preparation to the client's convention/standard | originating design, calculations, approval for construction/manufacture; certification, professional sign-off (refers to a qualified professional) |
| `technical-documentation` | template, layout, illustration, print/screen export of supplied content | accuracy of instructions, warnings, specifications and compliance statements |

No standards code, certification, regulated activity, structural responsibility, approval claim
or insurance commitment. The copy already meets the programme rule; **no copy or scope change
proposed.** The remaining question is whether insurance covers drafting/drawing preparation at all.

## B3. Classification and CMS

**C — EXTERNAL/BROKER CONFIRMATION REQUIRED** (with `GS-X002` also open). `GS-O005` stays OPEN.
No manifest change, no dry run of an extended manifest, no Sanity read/write: Production remains
**47** documents (Design 13 / Digital 17 / Press 14 services; Technical 0; legal 0). No
production-dataset build was needed.

## Owner actions

**`GS-O023` — Production service-role credential (new).** Choose one:

1. **Re-enter by construction (recommended).** Supabase → project **Gridsmith Project**
   (`dqiutgmxillhsbzgnlsx`) → Project Settings → API Keys → copy the `service_role` (legacy) or a
   secret key. Vercel → `gridsmith-ltd` → Settings → Environment Variables →
   `SUPABASE_SERVICE_ROLE_KEY` (**Production**) → Edit → paste → Save. Confirm in chat that the
   value came from that project. The runtime proof remains the cutover smoke test.
2. **Accept deferral explicitly.** State that `GS-T004` may run before the credential is proven,
   because no deployment consumes the anon policy and verification belongs to the cutover smoke
   test. The next phase then applies 0004 under A2–A4 with a fresh backup.

Either answer unblocks `GS-T004` in a new phase; neither is an agent decision.

**`GS-O005`** — ask the broker, in writing: *does the policy cover CAD drafting, preparation of
engineering drawings and schematics, and technical documentation layout, prepared to a client's
brief with no design, calculation or sign-off responsibility; what exclusions and limits apply?*
Record the answer (not the policy) in `OWNER-ACTIONS.md`. `GS-X002` must also close before the flag.

## Recorded only

Production Supabase (free plan) had been **paused** and was restored during `GS-O010-R2`; it was
ACTIVE_HEALTHY throughout this phase. No keep-alive, no upgrade — cutover-readiness item.

## Safety

No Production deployment, alias, DNS, env change, Supabase write, Sanity read/write, lead write or
form submission. Preview unchanged. No secret or PII in output (structural counts only). Main
untouched. Docs-only receipt.
