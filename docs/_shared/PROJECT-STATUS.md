# Gridsmith production programme status

**Programme:** controlled production readiness

**Status:** ACTIVE — GS-P01 repository hardening complete; production activation remains deferred

**Current task:** `GS-P01` — dependency, database-boundary and application security hardening

**Current commit:** `b0f4fee7f3300f45d2bc663a2a73d48f43ac67a6` at task start; the ending
commit is the single GS-P01 commit containing this record

**Branch:** `main`, tracking `origin/main`

**Working tree:** clean at task start; GS-P01 files only after implementation

**CI/build:** local static, clean production build, secrets, bundle and served security-header
checks pass. GitHub CI is authoritative for the two Lighthouse axes skipped on Windows.

**Last updated:** 11 September 2026

## Supabase state

**Project:** `dqiutgmxillhsbzgnlsx` (`Gridsmith Project`)

**Lifecycle state:** `ACTIVE_HEALTHY`

**GS-P01 access:** read-only metadata, advisors and aggregate compatibility checks only. No
production schema, data, RLS, Auth or credential mutation occurred.

The repository now contains
`supabase/migrations/20260911203125_gs_p01_security_hardening.sql`. It revokes all direct
`anon`/`authenticated` privileges from the five reviewed public tables, drops the permissive lead
insert policy, enables RLS on the migration ledger, adds durable lead bounds, and prevents future
automatic public table/sequence grants. It has **not** been applied to production.

All 63 existing production leads passed aggregate, read-only compatibility checks for the proposed
constraints. This is not a clean migration replay. Docker is unavailable and the project has no
non-production Supabase branch, so replay/application remains a later controlled operation.

## Production state

| Control | State |
|---|---|
| Production readiness | **NOT READY** |
| Production deployment authorisation | **NOT AUTHORISED** |
| `gridsmith.uk` cutover | **PROHIBITED until a dedicated production-release phase** |
| Latest completed phase | `GS-P01` when its commit and push are complete |
| Next recommended phase | Service-definition/content architecture planning after controller approval |

## GS-P01 outcome

- `GS-T006`: **REMEDIATED** in the repository. Next.js moved from `15.5.23` to `15.5.25`,
  PostCSS resolves to `8.5.28`, Sharp resolves to `0.35.4`, and `npm audit --omit=dev` reports zero
  vulnerabilities.
- Lead intake: **REMEDIATED IN REPOSITORY**. The existing Server Action is the sole write boundary;
  it validates and explicitly maps public input before a server-only service-role insert. Direct
  anonymous table insertion is removed by the pending migration.
- `GS-T004`: **REMEDIATED IN REPOSITORY / OPEN IN PRODUCTION**. The migration-ledger exposure and
  broad public grants are fixed by the pending migration, but the live database is intentionally
  unchanged until a controlled migration phase.
- Security headers: **REMEDIATED IN REPOSITORY** with an enforced staged CSP, referrer/MIME/framing/
  permissions/HSTS policy and removal of `X-Powered-By`. Deployment verification remains later.
- Vercel credential presence: **UNVERIFIED** because CLI authentication was unavailable. The code
  requires `SUPABASE_SERVICE_ROLE_KEY` for public lead submission after the migration is applied;
  environment configuration and migration/deployment must be coordinated in a later release phase.
- Notification retry/reconciliation and live email delivery remain outside GS-P01 and were not
  changed.

## Authoritative decisions

- `GS-D001` — public portfolio evidence requiring unavailable client/author permission is not a
  production dependency. Public capability, methodology, process and division-structure content
  replace it. Permitted private examples may be discussed without promising disclosure.
- `GS-D002` — public fixed, starting, indicative, package or estimator-generated prices are not a
  production dependency. Public journeys lead to a bespoke quotation or consultation.

## Active blockers

### Owner blockers

- `GS-O002` — provide the definitive, truthful list of services Gridsmith offers.
- `GS-O003` — complete solicitor review and resolve legal launch actions.
- `GS-O004` — confirm operational/company facts and make required contact routes operational.
- `GS-O005` — confirm engineering/CAD professional-indemnity scope.

### Technical blockers

- `GS-T001` — public service rendering and CMS schemas currently require and display pricing; a
  later implementation phase must make price publication optional and replace price-first CTAs.
- `GS-T002` — the Digital estimator is price-producing by design; it must be removed, kept
  internal, deferred, or converted to non-price project scoping before production.
- `GS-T003` — public work/case-study/book surfaces and related launch gates still exist in code and
  older specifications; production content and navigation must not depend on them under `GS-D001`.
- `GS-T004` — apply and verify the GS-P01 Supabase migration in a controlled release sequence,
  coordinated with the server-only service-role environment and deployment. Until then the live
  migration ledger and broad grants retain their pre-GS-P01 state.
- `GS-T005` — the production Sanity dataset/content path remains incomplete and seed content must
  never be promoted as production content.
- Notification reconciliation and live RLS-drift scheduling/credential verification remain later
  operational work; GS-P01 did not broaden into those systems.

### External-review blockers

- `GS-X001` — solicitor review of the legal instruments and the impact of `GS-D001`/`GS-D002`.
- `GS-X002` — professional review appropriate to engineering/CAD claims and the drawing matrix.

### Human-acceptance blockers

- `GS-R001` — complete screen-reader, keyboard, responsive, cross-browser and content review on a
  staging release candidate.
- `GS-R002` — owner acceptance of all four sections together before production release.
- `GS-R003` — live post-cutover verification before any `PRODUCTION READY` declaration.

## Detailed registers

- Owner dependencies: `docs/_shared/OWNER-ACTIONS.md`
- Current phase handoff and verification: `docs/_shared/AI-HANDOFF.md`
- Permanent agent controls: `docs/_shared/AI-DEVELOPMENT-PROTOCOL.md`
- Dependency ordering: `docs/_shared/02-BUILD-SEQUENCE.md` (GS-P00 section is authoritative)
- Historical detail: division project trackers and `docs/_shared/05-HANDOVER.md`
