# AI handoff

## Execution

- **Task ID:** `GS-P03`
- **Task:** Service architecture and commercial-model reconciliation
- **Agent/model:** Claude Code (Opus 5)
- **Status:** COMPLETE IN REPOSITORY; production content, migration and deployment untouched
- **Date:** 14 September 2026

## Repository state

- **Starting commit:** `9a804c4f2305fed208007778264b9895a69e80a8`
- **Ending commit:** the GS-P03 commit containing this handoff; use `git rev-parse HEAD`
- **Branch:** `main`, tracking `origin/main`
- **Starting working tree:** clean, in sync with `origin/main`
- **Scope:** schemas, query layer, service/landing/master/contact UI, gates, seed script and
  documentation for `GS-D001`/`GS-D002` and the owner-approved service model
- **Pushed:** YES when the GS-P03 commit is present on `origin/main`

## Hard scope boundaries preserved

- No Supabase call of any kind; the GS-P01 production migration was not applied.
- No Sanity write. The development dataset was **read** by gates and builds; it was not re-seeded.
  The production dataset was not touched.
- No Vercel action, no deployment, no environment change.
- Hostinger, DNS and `gridsmith.uk` untouched; no redirect work.
- No legal clause drafted or amended. No company fact, price, client evidence, credential,
  turnaround or guarantee invented. No external profile link added.
- The GS-P01 lead-submission architecture was not redesigned; the Server Action maps one more named,
  schema-bounded field (`service_slug`).
- The contact form was never submitted during verification (Development points at production
  Supabase).

## What changed

### Architecture and CMS

- `lib/services/architecture.ts` (new): closed, division-bound capability groups; the
  professional-review group list; division CTA wording; `enquiryHref`/`readEnquiryContext`; the
  private-examples statement.
- `service` schema: removed `pricingModel`, `track`, `ctaPrimary`, `ctaSecondary`. Added
  `capabilityGroup` (required, closed, division-bound), `description`, `relatedServices`,
  `collaborators`, `ctaLabel` and `professionalScopeConfirmed` (Studio warning).
- Removed object types `pricingBlock` and `ctaBlock`.
- `publishingPackage`: removed `price`, `priceNote`, `priceIsFrom`, `scalingFactors` and
  `extraRevisionCost`. `excludes`, `notFor` and `revisionRounds` retained. Type dormant.
- `project.metrics` no longer requires a figure; `project` dormant. `book` unchanged and dormant.
- Query layer: service projections carry the new fields and no price; every project query removed,
  with a pointer to restore the confidentiality projection from `9a804c4f` if a route ever returns.

### UI and routes

- **Removed:** `components/content/Price.tsx`, `ProjectGrid.tsx`, `components/master/SelectedWork.tsx`,
  `/digital/estimate`, `/work`, `/work/[slug]`, and the master `Work` nav item.
- **Division landings:** services grouped by capability group, no prices; "Selected work" replaced by
  "Examples of our work" (the private-examples statement); CTA wording and destination per division.
  Verified external reviews retained.
- **Digital service page:** renders with no price; adds capability-group eyebrow, description,
  collaborators and related services; CTA with service context plus **Contact Gridsmith**.
- **Homepage:** selected-work block removed; CTA band button **Discuss Your Requirements**.
- **`/approach`:** cross-division project grid removed.
- **Contact form:** reads `division` and `service` after mount, preselects the division and submits
  a hidden `service_slug`; malformed context is dropped. Budget select remains non-price.
- **`/_master-sink`:** committed specimens for the grouped, flat and empty `ServiceList` branches.

### Gates

| Gate | Change |
|---|---|
| `check:schemas` | SC-6 assertions removed. **New:** a price-field walk over every field name, with its own specimens; `service.capabilityGroup` closed-list entry; 8 document-context cases proving the division limb and the technical warning limb |
| `check:launch` + selftest | **New technical publication gate**: unmeasured/non-number/no-group are failures in every dataset; unconfirmed published technical services refused on production. Specimens 11 → 16 |
| `check:lead-security` | **New:** 7 CTA-context round-trip/drop cases plus source assertions on the form and the Server Action |
| `check:vat` | Zero-price guard replaced with a served-text guard (`MIN_TEXT`), because zero prices is now correct; `/work` removed |
| `check:axe`, `check:responsive` | `/work`, `/work/[slug]`, `/digital/estimate` removed from `ROUTES` and `INCOMPLETE_ALLOWED` |
| `check-bundle-size` | `/digital/estimate` and `/design/estimate` budgets removed |
| `check:struck` + selftest | Four struck rules registered (`GS-D002-*`); every matching spec line annotated in place; specimens +5 |

### Seed and documentation

- `scripts/seed-content.mjs` rewritten to the capability groups with `[SEED]` services, collaborators
  and `professionalScopeConfirmed: false`; pricing, CTA blocks and all 24 seed projects removed.
  **Not run** (`GS-T007`).
- New ADR `docs/_shared/SERVICE-ARCHITECTURE.md`. Updated `PROJECT-STATUS.md`, `OWNER-ACTIONS.md`,
  `05-HANDOVER.md`, `02-BUILD-SEQUENCE.md`, `SCHEMA-CORE.md`, `PRE-DEPLOYMENT-CHECKLIST.md`,
  `CLAUDE.md`, all four `PROJECT-TRACKER.md` files, and the struck lines in `design/PROJECT-RULES.md`,
  `press/PROJECT-RULES.md`, `press/SCHEMA.md`, `digital/APP-FLOW.md` and both implementation plans.

## Verification

| Check | Result |
|---|---|
| `npm run verify:static` (37-gate chain incl. typecheck, lint, colours, contrast, content, claims, schemas, RLS, lead security, all selftests, struck, lists) | **PASS** on a clean `.next` (the first run failed only on stale `.next/types` for the deleted routes; `.next` removed and re-run) |
| `npm run verify:build` (prebuild `check:launch --build`, clean `next build`, secrets, tokens, theme flash, bundle size) | **PASS** — 41 routes within delta budgets |
| `check:axe` | **PASS** — 68 analyses (17 routes × 2 viewports × 2 phases), 0 violations, 59 allowed incompletes, 0 unresolved, 35 link targets resolve |
| `check:responsive` | **PASS** — 45 combinations (15 routes × 375/768/1440px), no overflow |
| `check:security-headers`, `check:consumer-terms`, `check:legal:parity`, `check:press:type`, `check:path:live` | **PASS** |
| `check:vat` | **PASS** — 14 routes, 527,607 characters scanned, 0 price figures |
| `check:launch` (served) | **PASS** — dataset `development`; 0 unconfirmed technical services counted |
| Served GS-P03 assertions (scratch harness, not committed) | **PASS 14/14** — CTAs and destinations, no price/work on landings and service page, grouped specimens in architecture order, removed routes 404, Path Finder served, contact-form context preselected/carried/dropped in a real browser without submitting |
| `npm audit --omit=dev` | **PASS** — 0 vulnerabilities |
| `lint:secrets` | **PASS** — 177 source files, 39 client chunks |
| `git diff --check` / `--cached --check` | **PASS** |
| Lighthouse CI (desktop/mobile) | **NOT RUN locally** — the local chrome-launcher EPERM cleanup failure is known; CI is the arbiter |
| Manual screen-reader and cross-browser review | **NOT RUN** — `GS-R001` |

### Deliberate-failure proofs

Each proof was run alone. The subject's bytes were captured, the injection was confirmed to have
applied, the gate was run, and the original bytes were restored and verified by SHA-256 before the
next proof. Every result is a red that names its injection, so each probe is established as a subject.

| # | Gate | Injection | Named in the red |
|---|---|---|---|
| P1 | `check:schemas` | optional `price` field on `publishingPackage` | `publishingPackage.price is a price field` |
| P2 | `check:schemas` | `digital-marketing` group added to the architecture | `service.capabilityGroup allows "digital-marketing"` |
| P3 | `check:schemas` | division limb disabled | `service.capabilityGroup = "writing" on {"division":"digital"} … got true` |
| P4 | `check:schemas` | professional-scope rule made always-true | `service.professionalScopeConfirmed = undefined … got true` |
| P5 | `check:lead-security` | `service_slug` mapping removed from the Server Action | `the Server Action drops CTA service context` |
| P6 | `check:lead-security` | slug validation removed | `enquiry context for /contact?division=digital&service=Not+A+Slug` |
| P7 | `check:launch:selftest` | live technical limb disabled | `✗ TECHNICAL — an unconfirmed published technical service on a live dataset` |
| P8 | `check:struck` | annotation stripped from `digital/APP-FLOW.md:39` | `GS-D002-VISIBLE-PRICE-BAND STANDS at docs/digital/APP-FLOW.md:39` |
| P9 | `check:vat` (served) | `MIN_TEXT` raised above every route | `14 route(s) served under 100000000 characters of text: …` |

The committed, value-based specimens (launch selftest, struck selftest, schema price-field specimens
and document-context cases, lead-security context cases, master-sink `ServiceList` specimens) are
the permanent subjects; the mutation proofs above established that the assertions reach them.

## Findings and programme state

- **Closed:** `GS-O002` (completed), `GS-T001`, `GS-T002`, `GS-T003` (closed in repository).
- **Remaining:** `GS-T004`, `GS-T005`, `GS-O003`, `GS-O004`, `GS-O005`, `GS-O006` (now actionable),
  `GS-O007`, `GS-O010`, `GS-X001`, `GS-X002`, `GS-R001`–`GS-R003`.
- **New:**
  - `GS-T007` — the development dataset holds the pre-GS-P03 seed; re-seeding needs orphan deletion
    and explicit authorisation.
  - `GS-O011` — owner decision on legacy "digital marketing", Google Ads and Google Business Profile
    services, and on continued display of Freelancer project titles under `GS-D001`.
- **Recorded, not new IDs:** Design and Press still have no per-service routes (`B-09` and the Press
  equivalents); Master engagement models need approved copy before any CMS type (`GS-O006`); a
  non-price Digital Project Scoper and representative-engagement type are deferred enhancements
  (`SERVICE-ARCHITECTURE.md` §9, §11).
- **Production readiness:** **NOT READY.**

## Remote changes

- **GitHub:** the GS-P03 commit pushed to `main`.
- **Supabase:** none.
- **Sanity:** read-only queries against `development` by builds and gates; no writes; production untouched.
- **Resend:** the existing `check:axe` notification probe sent one development notification through
  Resend's shared sender to the account owner. This is established gate behaviour, not new in GS-P03;
  no lead row was written.
- **Vercel:** none initiated. The push may trigger the normal Git integration.
- **Hostinger/DNS/`gridsmith.uk`:** none.

## Recommended next phase

Recommendation only. A **content-population phase against the approved architecture** once
`GS-O006` copy (and `GS-O011` decisions) arrive: authorised development-dataset re-seed with orphan
deletion (`GS-T007`), real service records per capability group, and Design/Press per-service routes
if approved. Technical-group content stays gated on `GS-O005`/`GS-X002`. Keep `GS-T004` activation for a
separately authorised production-release phase. Do not begin either from this handoff alone.
