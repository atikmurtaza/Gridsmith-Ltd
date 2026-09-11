# Gridsmith production programme status

**Programme:** controlled production readiness

**Status:** ACTIVE — GS-P02 validation complete; production migration and deployment remain deferred

**Current task:** `GS-P02` — security migration replay and deployment-readiness verification

**Current commit:** `daf192f1a6ce16f49bc0525ede6262fc198fcf8d` at task start; the ending
commit is the single GS-P02 documentation commit containing this record

**Branch:** `main`, tracking `origin/main`

**Working tree:** clean at task start; GS-P02 control documentation only after validation

**CI/build:** local static, typecheck, lint, clean production build, secrets, bundle and served
security-header checks pass. GitHub CI passed for the tested GS-P01 implementation commit.

**Last updated:** 12 September 2026

## Supabase state

**Project:** `dqiutgmxillhsbzgnlsx` (`Gridsmith Project`)

**Lifecycle state:** `ACTIVE_HEALTHY`

**GS-P02 production access:** read-only metadata, aggregate constraint-compatibility and environment
inspection only. No production schema, data, RLS, Auth or credential mutation occurred.

### Repository state

The repository contains the complete four-migration chain through
`20260911203125_gs_p01_security_hardening.sql`. It declares the intended server-only table model,
lead constraints, migration-ledger RLS and public grant revocations. The application validates and
maps public enquiry input before using a server-only service-role writer.

### Disposable replay state

GS-P02 replayed the complete migration chain in an isolated local Supabase stack. Clean replay,
runner repeatability, a representative pre-GS-P01 upgrade, effective role tests and the application
submission path all passed. The stack used synthetic data only, required no paid infrastructure and
was destroyed after verification. Full evidence is in
`docs/_shared/GS-P02-SECURITY-MIGRATION-REPLAY.md`.

### Production database state

Production still records only migrations `0001`–`0003`. The GS-P01 migration has not been applied:
the migration ledger does not yet have RLS, public grants remain, and the old anonymous lead-insert
policy remains. All 63 production leads passed read-only aggregate checks against the proposed
constraints. No personal lead contents were reproduced.

`GS-T004` is therefore **REMEDIATED IN REPOSITORY / OPEN IN PRODUCTION** and **READY FOR CONTROLLED
ACTIVATION**. It is not closed until production migration and effective-access verification occur in
an explicitly authorised release phase.

## Vercel state

**Project:** `gridsmith-ltd` (`prj_kfFxGWf0ai1VYAGICYfVvNn0QYYN`), Node `24.x`

- Public Supabase variables are present in Development, Preview and Production.
- `SUPABASE_SERVICE_ROLE_KEY` is present only in Production.
- No value was printed, copied or changed.
- Development points to the production Supabase project.
- Preview could not be positively tied to an isolated backend; there is no Supabase branch or second
  accessible non-production project. Treat it as non-isolated and do not submit Preview test leads.
- The latest GS-P01 production-target deployment is `ERROR`, consistent with the intentional failure
  caused by the empty production Sanity dataset.
- No Preview or production deployment was created, promoted or changed in GS-P02.

## Production state

| Control | State |
|---|---|
| Production readiness | **NOT READY** |
| `GS-T004` migration suitability | **READY FOR CONTROLLED ACTIVATION** |
| `GS-T004` live remediation | **OPEN — PRODUCTION UNCHANGED** |
| Production deployment authorisation | **NOT AUTHORISED** |
| `gridsmith.uk` cutover | **PROHIBITED until a dedicated production-release phase** |
| Latest completed phase | `GS-P02` when its commit and push are complete |
| Next recommended phase | Service-definition/content architecture work after controller approval |

## GS-P02 outcome

- Complete clean replay: **PASS**; all four migrations applied in order without SQL errors.
- Repeatability: **PASS**; the repository runner's second run applied zero migrations.
- Upgrade behaviour: **PASS** with two synthetic pre-GS-P01 rows retained.
- Existing data: **PASS read-only**; 63/63 production leads satisfy the proposed constraints.
- Effective security: **PASS in replay**; all five tables have RLS and zero policies, public table,
  sequence and view access is denied, and the service role can persist and read a lead.
- Application boundary: **PASS**; one synthetic local submission reached the disposable backend via
  the Server Action and protected fields remained server/database controlled. The row was removed.
- Migration quality: **PASS**; each file and ledger entry are transactional. The SQL is intentionally
  runner-repeatable rather than independently idempotent. Constraint validation takes an `ALTER
  TABLE` lock but no rewrite is expected at the current 63-row volume.
- Security headers: **PASS** on `/`, `/contact` and 404 responses with no visible browser breakage.
- Migration correction: **NOT REQUIRED**.
- Preview isolation: **NOT PROVED**; recorded as owner action `GS-O010`.

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
- `GS-O010` — provision and securely connect a clearly isolated non-production Supabase target for
  safe hosted Preview lead testing; approve any cost before enabling paid infrastructure.

### Technical blockers

- `GS-T001` — public service rendering and CMS schemas currently require and display pricing; a
  later implementation phase must make price publication optional and replace price-first CTAs.
- `GS-T002` — the Digital estimator is price-producing by design; it must be removed, kept internal,
  deferred, or converted to non-price project scoping before production.
- `GS-T003` — public work/case-study/book surfaces and related launch gates still exist in code and
  older specifications; production content and navigation must not depend on them under `GS-D001`.
- `GS-T004` — execute the reviewed activation sequence in an authorised controlled window: deploy and
  prove the server writer first, then migrate and verify production effective access.
- `GS-T005` — the production Sanity dataset/content path remains incomplete and seed content must
  never be promoted as production content.
- Notification reconciliation and live RLS-drift scheduling/credential verification remain later
  operational work; GS-P02 did not broaden into those systems.

### External-review blockers

- `GS-X001` — solicitor review of the legal instruments and the impact of `GS-D001`/`GS-D002`.
- `GS-X002` — professional review appropriate to engineering/CAD claims and the drawing matrix.

### Human-acceptance blockers

- `GS-R001` — complete screen-reader, keyboard, responsive, cross-browser and content review on a
  staging release candidate.
- `GS-R002` — owner acceptance of all four sections together before production release.
- `GS-R003` — live post-cutover verification before any `PRODUCTION READY` declaration.

## Detailed registers

- GS-P02 evidence and activation plan: `docs/_shared/GS-P02-SECURITY-MIGRATION-REPLAY.md`
- Owner dependencies: `docs/_shared/OWNER-ACTIONS.md`
- Current phase handoff and verification: `docs/_shared/AI-HANDOFF.md`
- Permanent agent controls: `docs/_shared/AI-DEVELOPMENT-PROTOCOL.md`
- Dependency ordering: `docs/_shared/02-BUILD-SEQUENCE.md` (GS-P00 section is authoritative)
- Historical detail: division project trackers and `docs/_shared/05-HANDOVER.md`
