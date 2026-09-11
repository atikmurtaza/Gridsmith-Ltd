# Gridsmith production programme status

**Programme:** controlled production readiness

**Status:** ACTIVE — Supabase availability verified; implementation not authorised by this task

**Current task:** `GS-O001-R2` — restore and verify availability of the Gridsmith Supabase project

**Current commit:** `a5d7773f45567b18ed858ab4c25193949b33498d` at task start; the ending commit is the single `GS-O001-R2` documentation commit containing this record

**Branch:** `main`, tracking `origin/main`

**Working tree:** clean at task start; GS-O001-R2 documentation changes only

**CI/build:** see `AI-HANDOFF.md` for the GS-O001-R2 verification record; no application build or
integration test is required for documentation-only lifecycle verification

**Last updated:** 11 September 2026

## Supabase state

**Project:** `dqiutgmxillhsbzgnlsx` (`Gridsmith Project`)

**Lifecycle state:** `ACTIVE_HEALTHY`

**Identity:** verified by exact project reference through the Supabase connector; repository records
name the same reference.

**Reachability:** PASS — connector project lookup, project URL lookup and read-only database metadata
query succeeded. Expected Supabase schemas and the repository's migrated public tables were present.
The project was already active, so no resume or other lifecycle mutation occurred.

`GS-O001`: **COMPLETE**. The generic Supabase project-switching blocker is removed. Lifecycle
management of projects in other organisations is outside the Gridsmith production critical path.

## Production state

| Control | State |
|---|---|
| Production readiness | **NOT READY** |
| Production deployment authorisation | **NOT AUTHORISED** |
| `gridsmith.uk` cutover | **PROHIBITED until a dedicated production-release phase** |
| Latest completed phase | `GS-P00` when its commit and push are complete |
| Next recommended phase | `GS-P01` — security and operational hardening that does not depend on owner service content |

## Authoritative decisions

- `GS-D001` — public portfolio evidence requiring unavailable client/author permission is not a
  production dependency. Public capability, methodology, process and division-structure content
  replace it. Permitted private examples may be discussed without promising disclosure.
- `GS-D002` — public fixed, starting, indicative, package or estimator-generated prices are not a
  production dependency. Public journeys lead to a bespoke quotation or consultation.

See the full decision record and affected historical requirements in `AI-HANDOFF.md` and the
GS-P00 reconciliation notes at the top of each project tracker.

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
- `GS-T004` — security/operations findings remain open, including security headers, public lead
  boundary hardening, durable notification reconciliation and live RLS-drift credentials/checks.
  Read-only verification on 11 September 2026 additionally found RLS disabled on
  `public._gridsmith_migrations`; do not enable it without first defining and validating the intended
  access/policy model in `GS-P01`.
- `GS-T005` — the production Sanity dataset/content path remains incomplete and seed content must
  never be promoted as production content.
- `GS-T006` — the production dependency audit reports 3 vulnerabilities: 1 critical in the
  installed Next.js dependency path and 2 high in transitive PostCSS/Sharp paths. Remediate and
  re-run the audit in a dedicated hardening phase; do not apply an unreviewed bulk audit fix.

### External-review blockers

- `GS-X001` — solicitor review of the legal instruments and the impact of `GS-D001`/`GS-D002`.
- `GS-X002` — professional review appropriate to engineering/CAD claims and the drawing matrix.

### Content blockers

- `GS-O002` — definitive services and truthful capability/process copy.
- Real production company, contact, legal, SEO and accessibility content listed in
  `OWNER-ACTIONS.md`; no public portfolio or public pricing content is requested.

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
