# Gridsmith production programme status

**Programme:** controlled production readiness

**Status:** ACTIVE — GS-P03 service architecture reconciled in repository; production migration,
production content and deployment remain deferred

**Current task:** `GS-P03` — service architecture and commercial-model reconciliation

**Current commit:** `9a804c4f2305fed208007778264b9895a69e80a8` at task start; the ending commit is
the GS-P03 commit containing this record (`git rev-parse HEAD`)

**Branch:** `main`, tracking `origin/main`

**Working tree:** clean at task start; GS-P03 implementation, gates and documentation only

**CI/build:** local static chain, clean production build, bundle budgets, secrets lint, served
accessibility/responsive/content gates and deliberate-failure proofs pass. GitHub CI for the GS-P03
commit is reported in `AI-HANDOFF.md`.

**Last updated:** 14 September 2026

## Service architecture (GS-P03)

`docs/_shared/SERVICE-ARCHITECTURE.md` is the ADR and the service model.

- **Master** is the relationship layer, not a production studio. Engagement models are recorded but
  have no CMS type or route until approved copy exists.
- **Design:** Brand & Visual · Illustration · Motion · 3D & Visualisation · Technical.
- **Digital:** Web · Software · Apps & Interactive · Automation & Intelligence · Operate & Improve.
- **Press:** Writing · Editorial · Publishing · Content & Promotion.
- Capability groups are closed, division-bound architecture (`lib/services/architecture.ts`);
  individual services are CMS content.
- Cross-division boundaries (cover design, website copy, SEO, digital marketing) are recorded and
  enforced by the division-bound group rule.
- Contextual CTAs: **Discuss Your Requirements** / **Get a Design Quote** / **Discuss Your Project** /
  **Discuss Your Book or Content**, universal **Contact Gridsmith**. All reach the one enquiry form,
  carrying division and service context, through the unchanged GS-P01 server-only writer.

## Commercial-model state

| Control | State |
|---|---|
| Public price fields (`service.pricingModel`, `pricingBlock`, package prices) | **REMOVED**; `check:schemas` refuses any price field |
| Price renderers (`Price.tsx`, service cards, service page) | **REMOVED** |
| Digital estimator `/digital/estimate` | **REMOVED from launch**; non-price scoper deferred |
| Public portfolio (`/work`, homepage and landing work blocks, `/approach` grid) | **REMOVED** |
| `project`, `book`, `publishingPackage` types | **DORMANT** for future consented use |
| Press Path Finder | **UNCHANGED** |
| Technical Design publication gate | **ACTIVE** — production refuses unconfirmed technical services |
| Development Sanity dataset | **STALE SEED** — not re-seeded (`GS-T007`) |

## Supabase state

**Project:** `dqiutgmxillhsbzgnlsx` (`Gridsmith Project`) — unchanged by GS-P03.

Production still records migrations `0001`–`0003`; the GS-P01 security migration is **not applied**.
`GS-T004` remains **REMEDIATED IN REPOSITORY / OPEN IN PRODUCTION / READY FOR CONTROLLED ACTIVATION**.
GS-P03 made no Supabase call. The lead schema, RLS and migrations are unchanged; the Server Action
additionally maps the already-existing, already-bounded `service_slug` column.

## Vercel state

No Vercel action was taken in GS-P03. The GS-P03 push to `main` may trigger Vercel's normal Git
integration; its outcome is reported in `AI-HANDOFF.md`. A production-target build is still expected
to fail on the empty production Sanity dataset (`GS-T005`). Preview remains non-isolated (`GS-O010`).

## Production state

| Control | State |
|---|---|
| Production readiness | **NOT READY** |
| `GS-T004` live remediation | **OPEN — PRODUCTION UNCHANGED** |
| Production deployment authorisation | **NOT AUTHORISED** |
| `gridsmith.uk` cutover | **PROHIBITED until a dedicated production-release phase** |
| Latest completed phase | `GS-P03` when its commit and push are complete |
| Next recommended phase | See `AI-HANDOFF.md` — recommendation only |

## Authoritative decisions

- `GS-D001` — public portfolio evidence requiring unavailable client/author permission is not a
  production dependency. **Implemented at GS-P03.**
- `GS-D002` — public fixed, starting, indicative, package or estimator-generated prices are not a
  production dependency. **Implemented at GS-P03.**

## Active blockers

### Owner blockers

- `GS-O003` — complete solicitor review and resolve legal launch actions.
- `GS-O004` — confirm operational/company facts and make required contact routes operational.
- `GS-O005` — confirm engineering/CAD professional-indemnity scope (now gate-enforced).
- `GS-O006` — approve production capability/process content (now actionable).
- `GS-O010` — provision an isolated non-production Supabase target for Preview.
- `GS-O011` — decide on legacy marketing services and testimonial project titles (new).

### Technical blockers

- `GS-T004` — controlled production activation of the GS-P01 security migration.
- `GS-T005` — production Sanity dataset/content path incomplete; seed content must never be promoted.
- `GS-T007` — development dataset still holds pre-GS-P03 seed (priced services without capability
  groups, 24 seed projects). Re-seeding requires deleting orphaned seed documents, which needs
  explicit authorisation because `seed-content.mjs` never deletes.
- Notification reconciliation and live RLS-drift scheduling/credential verification remain later
  operational work.

### Closed in GS-P03

- `GS-O002` — service inventory supplied and recorded. **COMPLETED.**
- `GS-T001` — pricing required by schema and renderers. **CLOSED in repository.**
- `GS-T002` — price-producing Digital estimator. **CLOSED** — route removed.
- `GS-T003` — public work/case-study/book surfaces and gates. **CLOSED in repository** — routes and
  blocks removed, types dormant, gate lists updated.

### External-review blockers

- `GS-X001` — solicitor review of the legal instruments and the impact of `GS-D001`/`GS-D002`.
- `GS-X002` — professional review appropriate to engineering/CAD claims and the drawing matrix.

### Human-acceptance blockers

- `GS-R001` — screen-reader, keyboard, responsive, cross-browser and content review on a staging
  release candidate.
- `GS-R002` — owner acceptance of all four sections together before production release.
- `GS-R003` — live post-cutover verification before any `PRODUCTION READY` declaration.

## Detailed registers

- Service model and reconciliation: `docs/_shared/SERVICE-ARCHITECTURE.md`
- GS-P02 evidence and activation plan: `docs/_shared/GS-P02-SECURITY-MIGRATION-REPLAY.md`
- Owner dependencies: `docs/_shared/OWNER-ACTIONS.md`
- Current phase handoff and verification: `docs/_shared/AI-HANDOFF.md`
- Permanent agent controls: `docs/_shared/AI-DEVELOPMENT-PROTOCOL.md`
- Dependency ordering: `docs/_shared/02-BUILD-SEQUENCE.md` (GS-P00 section is authoritative)
- Historical detail: division project trackers and `docs/_shared/05-HANDOVER.md`
