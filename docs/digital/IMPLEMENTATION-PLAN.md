# Implementation Plan — Gridsmith Digital

Digital inherits the shared foundation built during Design's Phase 0. It starts at its own Phase 1. If Digital is built first instead, prepend Design's Phase 0 (2 weeks).

**Recommended build order across the group: Design → Digital → Press.** Digital second because the estimator is the highest-risk single component in the whole programme and benefits from a settled foundation.

---

## Phase 1 — Digital shell (Week 1–2)

| # | Task | Depends on | DoD |
|---|---|---|---|
| 1.1 | Digital theme applied, contrast verified | Foundation | All pairs in `DESIGN.md` §2 verified, including the `--line-strong` constraint |
| 1.2 | Mono display type loaded, 6-word heading rule enforced in review | 1.1 | Two families max, four weights total |
| 1.3 | Header, footer, mobile nav, split sticky CTA | Foundation | Estimate/Talk split 60/40 |
| 1.4 | `/digital/` hub, 11 blocks | 1.3 | Lighthouse **100/100/100** |
| 1.5 | Four service group landings | 1.4 | Each with visible price band |
| 1.6 | Service page template | Foundation | Pricing required; `clientTimeCommitment` rendered |
| 1.7 | Case study template with before/after | Foundation | Metric enforced; stack rendered |
| 1.8 | **Data row component** | 1.1 | The dominant content primitive — get it right early |

## Phase 2 — Trust architecture (Week 3)

Built before the estimator, deliberately. The estimator only converts if the surrounding credibility exists.

| # | Task | Depends on | DoD |
|---|---|---|---|
| 2.1 | `techStackItem` schema + `/digital/stack` | Foundation | ≥15 items, honest `lockInRisk` values |
| 2.2 | **Ownership guarantee module** | 1.8 | Four commitments, each citing a real contract clause |
| 2.3 | `exclusion` schema + "What we don't do" | Foundation | ≥6 items, each with an `alternative` |
| 2.4 | Process module, 6 stages with durations + client time | 1.8 | Ramp period stated honestly (FR-DG12) |
| 2.5 | Live vitals badge + CrUX cron | Foundation | Hides on stale data — verified by forcing staleness |
| 2.6 | Diagnostic page, 9 blocks | 1.6 | Includes the "you can take the spec elsewhere" block |
| 2.7 | Sample Diagnostic deliverable, redacted | 2.6 | Real engagement output, not a mockup |

**Gate:** 2.2 cannot be marked done until the ownership wording is checked against the actual client contract. The site must not promise terms the contract does not grant.

## Phase 3 — Estimator (Week 4–5) · *highest risk*

| # | Task | Depends on | DoD |
|---|---|---|---|
| 3.1 | `estimatorConfig` schema + phase-sum validator | Foundation | Mis-summed config is rejected in the CMS |
| 3.2 | `calculate.ts` pure function | 3.1 | 100% branch coverage in unit tests |
| 3.3 | **Calibration against 10 historical projects** | 3.2 | **Range contains actual price in ≥8/10 — HARD GATE** |
| 3.4 | Static SSR pricing bands (no-JS fallback) | 1.5 | Full pricing readable with JS disabled |
| 3.5 | Estimator island, 6 steps | 3.2 | ≤150KB gz; keyboard operable; `aria-live` progress |
| 3.6 | Selected-state, three cues | 3.5 | Border + glyph + background — not colour alone |
| 3.7 | Result view: range, breakdown, confidence, exclusions | 3.5 | Exclusions at equal visual weight to price |
| 3.8 | Persistence + server-side recalculation | 3.2 | Client-tampered input cannot alter the stored price |
| 3.9 | Shareable result page `/digital/estimate/[id]` | 3.8 | Standalone-readable; `noindex`; 90-day expiry |
| 3.10 | Estimate → pre-filled contact flow | 3.8 | Collapses contact to 2 steps |
| 3.11 | Abandonment logging by step | 3.5 | Partial input captured |

**If 3.3 fails, the estimator does not ship.** Fall back to the static pricing bands (3.4) and recalibrate post-launch. A wrong estimator destroys more trust than no estimator creates.

## Phase 4 — Portfolio, Care, content (Week 6–7)

| # | Task | DoD |
|---|---|---|
| 4.1 | `/digital/work` grid + filters (service, industry, **stack**) | URL state; stack filter present for P4 |
| 4.2 | `carePlanTier` schema + `/digital/care` | Includes and excludes in equal columns |
| 4.3 | Contact flow, estimator-aware | 2-step when arriving from an estimate |
| 4.4 | 10 service pages authored | Each with pricing, stack, duration, client time commitment |
| 4.5 | 8 case studies authored | Before/after, ≥1 metric, named stack |
| 4.6 | Stack page content, ≥15 items | **At least 3 items must carry a non-`none` lock-in risk** or the page is not credible |
| 4.7 | 15 FAQs, objection-led | Sourced from real sales objections, not invented |
| 4.8 | 6+ exclusions with alternatives | |
| 4.9 | 3 insight articles | |

## Phase 5 — Hardening (Week 8)

| # | Task | DoD |
|---|---|---|
| 5.1 | Structured data all templates | Validates; result pages `noindex` |
| 5.2 | Performance to raised budget | **Lighthouse 100/100/100 every template** |
| 5.3 | Accessibility: axe + keyboard + screen reader, **estimator focus** | Estimator fully operable by keyboard and SR |
| 5.4 | JS-disabled verification | Pricing fully readable |
| 5.5 | All states implemented | Including expired-estimate and stale-vitals |
| 5.6 | Cross-browser + device | |
| 5.7 | PostHog funnels + `estimator_abandon` dashboard | 3 funnels live |
| 5.8 | Estimator load test | 200 concurrent completions |

## Phase 6 — Launch (Week 9)

| # | Task | DoD |
|---|---|---|
| 6.1 | Estimator user test, 8 buyers | ≥6 complete unaided; qualitative check that the range feels credible |
| 6.2 | Speed-to-lead drill | Notification <60s; reply by end of next business day |
| 6.3 | Ownership guarantee legal check | Signed off against contract |
| 6.4 | Analytics verification | |
| 6.5 | Soft launch | |
| 6.6 | Public launch | |

## Phase 7 — Post-launch (continuous)

- **Weekly for 12 weeks:** review `v_estimator_dropoff`. The step with the largest abandonment is the highest-ROI fix on the entire site.
- **Monthly:** recalibrate `estimatorConfig` against closed deals. Increment `version`. Never edit silently.
- **Monthly:** review `v_estimate_demand` for project types you are being asked for but do not have a service page for.
- **Quarterly:** re-audit `lockInRisk` values as the stack evolves.
- A/B queue: (1) estimator as header CTA vs contact, (2) result page CTA copy, (3) 6-step vs 4-step estimator.

---

## Critical path

`Foundation → 1.8 (data row) → 2.1/2.2 (trust) → 3.2 (calculate) → 3.3 (calibration gate) → 3.5 (island) → 5.2 (100/100/100) → 6.1 (user test) → launch`

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Estimator produces wrong numbers | **High** | **Severe** — worse than no estimator | 3.3 calibration hard gate; `confidence` surfaced; ranges honestly wide |
| Historical project data insufficient to calibrate | Medium | High | Start gathering in week 1; 10 projects minimum |
| Lighthouse 100 unachievable with the estimator island | Medium | Medium | Island is on `/digital/estimate` only; other routes stay clean |
| Stack page reads as marketing (all lock-in `none`) | Medium | High | 4.6 requires ≥3 honest non-`none` values |
| Ownership guarantee promises more than the contract | Medium | **Severe** — legal exposure | 6.3 legal check as launch gate |
| Estimator ranges too wide to be useful | Medium | Medium | Tune with `confidenceRules`; narrow ranges as data accumulates |
| Exclusions section makes the team uncomfortable and gets softened | **High** | High | It is a P0 requirement traced to R6-Digital. Softening it defeats its purpose |
