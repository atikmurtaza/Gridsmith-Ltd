# Gridsmith production programme status

**Programme:** controlled production readiness

**Status:** ACTIVE — GS-P05 established an official, credential-free Freelancer review
integration (built, gated, **not activated**) and produced the owner content-review candidate;
production migration, production content activation and deployment remain deferred

**Current task:** `GS-P05` — Freelancer review integration investigation and owner content-review
candidate

**Current commit:** `a4cb3e9df9ae7f954956eb6fd9b30ca64c0f03f1` at task start; the ending commit is
the GS-P05 commit containing this record (`git rev-parse HEAD`)

**Branch:** `main`, tracking `origin/main`

**Working tree:** clean at task start; GS-P05 review module, gates, content-review generator,
one content correction and documentation only. **No component was rewired and no route changed.**

**CI/build:** local static chain, clean production build, bundle budgets, secrets lint, served
accessibility/responsive/content gates and deliberate-failure proofs pass. GitHub CI for the GS-P03
commit is reported in `AI-HANDOFF.md`.

**Last updated:** 16 September 2026 (`GS-P05`)

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
| Development Sanity dataset | **RECONCILED at GS-P04** and **untouched by GS-P05**, which made no Sanity call of any kind |
| Per-service routes | **ALL THREE DIVISIONS** since GS-P04 — one shared template, 46 pages |
| Approved service catalogue | `lib/services/catalogue.ts` — 81 services, coverage gate-enforced |
| Digital Marketing / campaign management | **CONFIRMED** as a cross-division engagement; no fourth discipline, no new group, type or route |
| Marketing channel services | **CONFIRMED at GS-P05** (`GS-O012`) — 8 of 9; six new engagement rows, no new architecture. `Media buying` still unconfirmed |
| Freelancer reviews | **12**, verified independently against the public profile and the official API. The repository's 6 were an incomplete ingestion, not the evidence |
| Freelancer review retrieval | **BUILT, NOT ACTIVATED** — official API, no credential, 24h cache, no stored copy. `GS-O014` |
| Freelancer review project titles | **ANONYMISED** — 6 by hand at GS-P04, and all 12 mechanically by the GS-P05 pipeline, from Freelancer's closed skill taxonomy. No quote altered |

## Development content state (GS-P04)

**Sanity project `spzu6y31`, dataset `development`** — positively identified before any mutation,
and distinct from the `production` dataset name the launch gate keys off.

| | Before | After |
|---|---|---|
| Published documents | 140 | 132 |
| `service` | 30, no capability group, all priced | 46, all grouped, no price field exists |
| `project` | 24 | 0 |
| `testimonial` (genuine, `isSeed: false`) | 6 | 6, titles anonymised |
| `companyDetails` (genuine) | 1 | 1 |
| Sanity `system.*` | 12 | 12 |
| Drafts | 0 | 0 |

46 obsolete seed documents were deleted **by provenance, never by type**: a candidate had to carry
both `isSeed: true` and an `_id` beginning `seed-`, and a disagreement between the two markers
stops the run. Genuine records match neither and were never candidates. The run is idempotent — a
second immediately afterwards deleted nothing and wrote the same 119.

**The production dataset was not read, not written and not contacted.**

## Supabase state

**Project:** `dqiutgmxillhsbzgnlsx` (`Gridsmith Project`) — unchanged by GS-P03, GS-P04 and
GS-P05, none of which made a Supabase call of any kind.

Production still records migrations `0001`–`0003`; the GS-P01 security migration is **not applied**.
`GS-T004` remains **REMEDIATED IN REPOSITORY / OPEN IN PRODUCTION / READY FOR CONTROLLED ACTIVATION**.
GS-P03 made no Supabase call. The lead schema, RLS and migrations are unchanged; the Server Action
additionally maps the already-existing, already-bounded `service_slug` column.

## Vercel state

No Vercel action was taken in GS-P03, GS-P04 or GS-P05. A push to `main` may trigger Vercel's
normal Git integration; its outcome is reported in `AI-HANDOFF.md`. A production-target build is still expected
to fail on the empty production Sanity dataset (`GS-T005`). Preview remains non-isolated (`GS-O010`).

## Production state

| Control | State |
|---|---|
| Production readiness | **NOT READY** |
| `GS-T004` live remediation | **OPEN — PRODUCTION UNCHANGED** |
| Production deployment authorisation | **NOT AUTHORISED** |
| `gridsmith.uk` cutover | **PROHIBITED until a dedicated production-release phase** |
| Latest completed phase | `GS-P05` when its commit and push are complete |
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
- `GS-O013` — accept the development service copy. **Narrowed at GS-P05**: the review-count limb
  is closed, and `docs/_shared/GS-P05-OWNER-CONTENT-REVIEW.md` is the artefact to read.
- `GS-O014` — accept Freelancer's API terms and decide what the reviews block publishes (new).
  **No credential and no paid service required.**
- `GS-O010` — provision an isolated non-production Supabase target for Preview.

### Technical blockers

- `GS-T004` — controlled production activation of the GS-P01 security migration.
- `GS-T005` — production Sanity dataset/content path incomplete; seed content must never be promoted.
- Notification reconciliation and live RLS-drift scheduling/credential verification remain later
  operational work.

### Closed in GS-P05

- `GS-O012` — eight of the nine marketing channel services confirmed as current capabilities and
  represented as six new `DIGITAL_MARKETING_ENGAGEMENT` rows; no new division, group, CMS type,
  route or orchestration. `Media buying` was not confirmed and is not inferred. **COMPLETED.**
- **The `GS-P04` 12-vs-6 review finding, corrected.** Twelve reviews verified independently
  against `freelancer.com/u/GridsmithLTD` and the official API. The repository's six were an
  incomplete ingestion, not the whole of the evidence, and the owner's figure was right. No owner
  action is owed; `GS-P04`'s record is preserved and annotated rather than overwritten.

### Closed in GS-P04

- `GS-O006` — every listed Design, Digital and Press service approved. **COMPLETED.** Copy
  acceptance moved to `GS-O013` rather than being closed with the list.
- `GS-O011` — Digital Marketing confirmed as a cross-division engagement; review project titles
  anonymised. **COMPLETED.** Narrow remainders are `GS-O012` and `GS-O013`.
- `GS-T007` — development dataset reconciled under the owner’s explicit authorisation: 46 obsolete
  seed documents deleted by provenance, 119 written, genuine records preserved, run idempotent.
  **CLOSED.**

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
