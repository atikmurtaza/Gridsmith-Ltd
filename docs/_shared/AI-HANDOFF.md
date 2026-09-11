# AI handoff

## Execution

- **Task ID:** `GS-P02`
- **Task:** Security migration replay and deployment-readiness verification
- **Agent/model:** Codex
- **Status:** VALIDATION COMPLETE; `GS-T004` ready for controlled activation and still open live
- **Date:** 12 September 2026

## Repository state

- **Starting commit:** `daf192f1a6ce16f49bc0525ede6262fc198fcf8d`
- **Ending commit:** the single GS-P02 documentation commit containing this handoff; use
  `git rev-parse HEAD`
- **Branch:** `main`, tracking `origin/main`
- **Starting working tree:** clean
- **Scope:** migration replay, effective access checks, Vercel environment/deployment inspection,
  served-header verification, activation planning and control documentation only
- **Pushed:** YES when the GS-P02 commit is present on `origin/main`

## Hard scope boundaries preserved

- The production GS-P01 migration was not applied.
- Production data, RLS, policies, grants, Auth and credentials were not changed.
- No Preview or production Vercel deployment was created, promoted or changed.
- No Vercel environment variable was added, changed, removed or revealed.
- Hostinger, DNS and `gridsmith.uk` were untouched.
- No product, service, legal or content implementation phase was started.

## Migration replay

An isolated local Supabase stack was created with dedicated ports and a unique temporary project
identifier. It did not use the production project, did not require a hosted branch or paid plan, and
did not affect existing CRM/attendance containers. Notification-provider variables were blank and
all inserted data was synthetic. The stack and its generated local credentials were destroyed after
verification.

The complete chain applied cleanly in order:

1. `0001_core.sql`
2. `0002_view_security_invoker.sql`
3. `0003_press_path_results.sql`
4. `20260911203125_gs_p01_security_hardening.sql`

A second run applied zero files, proving repeatability through the repository migration ledger and
SHA checks. A representative pre-GS-P01 database containing two synthetic compatible leads upgraded
successfully and retained both rows.

## Migration quality

- Every migration file and its ledger insert execute in one transaction. A per-file error rolls back
  both schema work and ledger entry, so partial application of that file is not retained.
- The GS-P01 SQL is not independently idempotent because its named constraints would collide on a
  manual second execution. The established runner is repeatable and rejects content/SHA drift.
- GS-P01 deliberately depends on the runner-created ledger, migrations `0001`–`0003`, and the
  `postgres` migration role used for default privileges.
- Adding validated constraints scans `leads` and holds an `ALTER TABLE` lock. No table rewrite is
  expected. Current production volume is 63 compatible rows, making a short controlled low-traffic
  window proportionate.
- No replay defect was found and no migration correction was required.

## Production compatibility and current live state

The verified Supabase project is `dqiutgmxillhsbzgnlsx` (`Gridsmith Project`) and remains
`ACTIVE_HEALTHY`.

Read-only aggregate checks found 63 production leads and zero violations for every proposed GS-P01
constraint. No lead contents were printed, copied or changed.

Production still records only migrations `0001`–`0003`. It remains intentionally pre-GS-P01:

- `_gridsmith_migrations` RLS is disabled;
- `anon`/`authenticated` grants remain on the reviewed objects;
- the anonymous lead-insert policy remains;
- the GS-P01 constraints and default-privilege revocations are not live.

Repository, replay and production states are deliberately reported separately in
`docs/_shared/GS-P02-SECURITY-MIGRATION-REPLAY.md`.

## Effective replay security

| Subject | Effective result after replay |
|---|---|
| `_gridsmith_migrations` | RLS on, zero policies, public reads/writes denied |
| `leads` | RLS on, zero policies, direct public reads/writes denied |
| `sample_grants` | RLS on, zero policies, direct public reads/writes denied |
| `events` and `events_id_seq` | RLS on table, zero policies, table and sequence public access denied |
| `press_path_results` | RLS on, zero policies, direct public reads/writes denied |
| Reporting views | `security_invoker=true`; public access denied |
| Future objects | default public table/sequence privileges revoked |

Direct anonymous and authenticated attempts failed with PostgreSQL `42501`. Anonymous PostgREST
reads/inserts returned `401`. The service role inserted and read a lead with `201` and `200`.

## Application boundary

The verified flow is:

public enquiry → Next.js Server Action → strict Zod parsing and 16 KiB payload limit → explicit
public-field mapping → server-only service-role client → `leads`.

Against the disposable backend, one synthetic form submission displayed the expected success state
and created exactly one lead. `status` retained its database default `new`; protected/internal fields
were not supplied through the public boundary. The row was deleted after inspection. Direct anonymous
insertion remained denied.

## Vercel readiness

- **Project:** `gridsmith-ltd` (`prj_kfFxGWf0ai1VYAGICYfVvNn0QYYN`)
- **Runtime:** Node `24.x`
- **Public Supabase variables:** present in Development, Preview and Production
- **Service-role Development:** absent
- **Service-role Preview:** absent
- **Service-role Production:** present
- **Secrets exposed:** none
- **Environment changes:** none

Development's public values point to the production Supabase project. Preview's stored target could
not be positively read through the authorised tooling, and no Supabase branch or second accessible
non-production project exists. Treat Preview as non-isolated until proved otherwise: do not submit
synthetic leads there and do not copy the production service-role key into Preview. Owner action
`GS-O010` requests a securely connected isolated backend and explicitly requires approval before any
paid infrastructure is enabled.

The latest GS-P01 production-target deployment is `ERROR`, consistent with the intentional empty
production Sanity dataset failure. No deployment was triggered. Production service-role presence is
ready, but production artifact readiness remains blocked by content and later release gates.

## Security headers

A clean build was served locally and actual responses on `/`, `/contact` and a 404 were checked.
CSP, Referrer-Policy, X-Content-Type-Options, framing policy, Permissions-Policy and HSTS were present;
`X-Powered-By` was absent. Browser verification showed meaningful content, no framework overlay and
no page/console errors. HSTS becomes effective on HTTPS; the real Sanity, Supabase and notification
origins still require final production verification.

## Controlled activation sequence

This is a future plan, not GS-P02 authority:

1. Satisfy the production-content and release gates; obtain explicit production deployment and
   migration approval.
2. Reconfirm Production presence/scope for the public Supabase variables and service-role secret
   without viewing or rotating values.
3. Prepare reviewed minimum recovery SQL and capture the pre-change ledger, grants, RLS and policies.
4. Deploy GS-P01's server-writer code while the old anonymous insert path still works.
5. Prove one authorised synthetic production submission uses the server writer and remove the probe.
6. In a short low-traffic window, run the repository migration runner; it must apply GS-P01 only.
7. Verify ledger/SHA, constraints, RLS, zero policies, revocations, anonymous denial and service-role
   persistence immediately.
8. Run and remove one authorised synthetic website probe; inspect runtime errors.
9. Close `GS-T004` only after production effective-access and application verification pass.

Rollback conditions and exact recovery boundaries are recorded in
`docs/_shared/GS-P02-SECURITY-MIGRATION-REPLAY.md`. The key rule is that old browser-only code must not
be restored while the database remains hardened. Prefer a server-writer repair/roll-forward; if app
rollback is unavoidable, restore only the reviewed former lead privilege/policy transactionally
before switching application traffic.

## Verification

| Check | Result |
|---|---|
| Complete clean migration replay | **PASS** — all four files applied in order |
| Runner repeatability | **PASS** — second run applied zero files |
| Representative upgrade | **PASS** — two synthetic rows retained |
| Production data compatibility | **PASS READ-ONLY** — 63/63 rows compatible |
| Effective access/RLS/grant probes | **PASS** |
| Application submission against disposable backend | **PASS**; synthetic row removed |
| `npm run verify:static` | **PASS** — 37-gate chain, including typecheck/lint/RLS/lead security |
| `npm run verify:build` | **PASS** — 69 pages, secrets/tokens/theme and 67 bundle budgets |
| Served header/browser checks | **PASS** on `/`, `/contact` and 404 |
| `npm audit --omit=dev` | **PASS** — zero vulnerabilities |
| GitHub CI for `daf192f1` | **PASS** — run `34647006964` |
| Hosted Preview E2E | **BLOCKED** — isolated backend not proved |
| Production migration/deployment | **NOT RUN** — prohibited in GS-P02 |

## Findings and programme state

- `GS-T004`: **READY FOR CONTROLLED ACTIVATION / OPEN IN PRODUCTION**.
- GS-P01 migration correction: **NOT REQUIRED**.
- New finding: Preview backend isolation is not proved; tracked as `GS-O010`.
- `GS-T005`: production Sanity/content path remains incomplete; the production-target build failure
  is expected until truthful real content is available.
- Notification retry/reconciliation and live delivery remain outside GS-P02.
- Overall production readiness remains **NOT READY**. Green replay, build and CI evidence do not prove
  owner acceptance, production content, external review, live deployment or cutover readiness.

## Remote changes

- **GitHub:** one GS-P02 documentation commit pushed to `main` when release checks complete
- **Supabase production:** none
- **Supabase non-production:** disposable local stack only; destroyed
- **Vercel:** none
- **Hostinger/DNS/`gridsmith.uk`:** none

## Recommended next phase

Proceed only after controller approval with the service-definition/content architecture work that
implements `GS-D001` and `GS-D002`. Keep `GS-T004` activation for a later explicitly authorised
production-release phase. Do not begin either phase from this handoff alone.
