# Project Tracker — Gridsmith Digital

**Status:** `TODO` · `WIP` · `BLOCKED` · `REVIEW` · `DONE` · **Priority:** P0 blocks launch · P1 desirable · P2 post-launch

Assumes the shared foundation (`master/PROJECT-TRACKER.md` Epic A) is `DONE`, including
`A-GATE`.

---

## Epic U — Digital shell

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| U-01 | Apply Digital theme, verify contrast | P0 | 0.5d | A-03 | TODO | Dev | Note `--line-strong` 2.1:1 constraint |
| U-02 | Mono display font loading | P0 | 0.5d | U-01 | TODO | Dev | ≤2 families, ≤4 weights total |
| U-03 | **Data row component** | P0 | 1d | U-01 | TODO | Dev | Dominant primitive |
| U-04 | Header, footer, mobile nav | P0 | 1d | A-05 | TODO | Dev | |
| U-05 | Split sticky mobile CTA | P0 | 0.5d | U-04 | TODO | Dev | Estimate 60 / Talk 40 |
| U-06 | `/digital/` hub, 11 blocks | P0 | 2d | U-04 | TODO | Dev | Lighthouse 100/100/100 |
| U-07 | 4 service group landings | P0 | 2d | U-06 | TODO | Dev | Visible price band each |
| U-08 | Service page template | P0 | 2d | A-06 | TODO | Dev | Pricing + client time commitment |
| U-09 | Case study template, before/after | P0 | 1.5d | A-06 | TODO | Dev | Stack rendered |

## Epic T — Trust architecture

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| T-01 | `techStackItem` schema | P0 | 0.5d | A-06 | TODO | Dev | |
| T-02 | `/digital/stack` page | P0 | 1.5d | T-01, U-03 | TODO | Dev | Grouped by category |
| T-03 | **Ownership guarantee module** | P0 | 1d | U-03 | TODO | Dev | Cites contract clauses |
| T-04 | Ownership wording legal check | P0 | — | T-03 | TODO | Atik | **GATE — must match contract** |
| T-05 | `exclusion` schema + "What we don't do" | P0 | 1d | A-06 | TODO | Dev | Deliberately plain styling |
| T-06 | Process module, 6 stages | P0 | 1d | U-03 | TODO | Dev | Ramp honesty (FR-DG12) |
| T-07 | CrUX cron + `site_vitals` | P1 | 1d | A-07 | TODO | Dev | Daily |
| T-08 | Live vitals badge | P1 | 0.5d | T-07 | TODO | Dev | Hides on stale — test this |
| T-09 | `/digital/diagnostic` page, 9 blocks | P0 | 1.5d | U-08 | TODO | Dev | |
| T-10 | Sample Diagnostic deliverable, redacted | P0 | 1d | T-09 | TODO | Content | Real output, not a mockup |

## Epic V — Estimator *(highest risk)*

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| V-01 | `estimatorConfig` schema | P0 | 1d | A-06 | TODO | Dev | |
| V-02 | Phase-sum custom validator | P0 | 0.5d | V-01 | TODO | Dev | Rejects mis-summed config |
| V-03 | `calculate.ts` pure function | P0 | 2d | V-01 | TODO | Dev | 100% branch coverage |
| V-04 | Gather 10 historical projects with final prices | P0 | — | — | TODO | Atik | **Start week 1** |
| V-05 | **Calibration run** | P0 | 1d | V-03, V-04 | TODO | Dev | **HARD GATE — ≥8/10 in range** |
| V-06 | Static SSR pricing bands | P0 | 1d | U-07 | TODO | Dev | Works with JS off |
| V-07 | Estimator island, 6 steps | P0 | 4d | V-03 | TODO | Dev | JS delta ≤40KB gz |
| V-08 | Three-cue selected state | P0 | 0.5d | V-07 | TODO | Dev | Not colour alone |
| V-09 | Result view | P0 | 2d | V-07 | TODO | Dev | Exclusions at equal weight |
| V-10 | Confidence indicator | P0 | 0.5d | V-09 | TODO | Dev | Words, never percentages |
| V-11 | `digital_estimates` table + RLS | P0 | 0.5d | A-07 | TODO | Dev | |
| V-12 | Server-side recalculation on persist | P0 | 1d | V-11 | TODO | Dev | Client price never trusted |
| V-13 | Shareable result `/estimate/[id]` | P0 | 1d | V-12 | TODO | Dev | Standalone-readable, `noindex` |
| V-14 | Estimate → pre-filled contact | P0 | 1d | V-13 | TODO | Dev | Collapses to 2 steps |
| V-15 | Abandonment logging | P1 | 0.5d | V-07 | TODO | Dev | Partial input captured |
| V-16 | Estimator keyboard + SR pass | P0 | 1d | V-09 | TODO | Dev | Fieldsets, legends, `aria-live` |

## Epic W — Portfolio, Care, contact

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| W-01 | `/digital/work` grid | P0 | 1.5d | U-09 | TODO | Dev | |
| W-02 | Filters incl. **stack** filter | P0 | 1d | W-01 | TODO | Dev | Stack filter is for persona P4 |
| W-03 | `carePlanTier` schema | P0 | 0.5d | A-06 | TODO | Dev | `excludes` min 3 |
| W-04 | `/digital/care` page | P0 | 1.5d | W-03 | TODO | Dev | Equal columns |
| W-05 | Contact flow, estimator-aware | P0 | 2d | A-08, V-14 | TODO | Dev | |

## Epic X — Content

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| X-01 | 10 service pages | P0 | 5d | U-08 | TODO | Content | |
| X-02 | 8 case studies, before/after | P0 | 5d | U-09 | TODO | Content | ≥1 metric each |
| X-03 | Stack page content, ≥15 items | P0 | 2d | T-02 | TODO | Content | **≥3 non-`none` lock-in risks** |
| X-04 | 15 FAQs | P0 | 1.5d | A-06 | TODO | Content | From real objections |
| X-05 | 6+ exclusions with alternatives | P0 | 0.5d | T-05 | TODO | Content | Do not soften |
| X-06 | 3 insight articles | P1 | 2d | A-06 | TODO | Content | |
| X-07 | Proofread all copy | P0 | 1d | X-01..X-06 | TODO | Content | |

## Epic Y — Hardening & launch

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| Y-01 | Structured data | P0 | 1d | X-* | TODO | Dev | Result pages `noindex` |
| Y-02 | Performance to 100/100/100 | P0 | 2d | X-* | TODO | Dev | **Raised bar — launch gate** |
| Y-03 | Accessibility full pass | P0 | 2d | X-* | TODO | Dev | Estimator is the risk |
| Y-04 | JS-disabled verification | P0 | 0.5d | V-06 | TODO | Dev | Pricing readable |
| Y-05 | All states | P0 | 1d | S-* | TODO | Dev | Incl. expired estimate, stale vitals |
| Y-06 | Cross-browser + device | P0 | 1d | Y-02 | TODO | Dev | |
| Y-07 | PostHog funnels + dropoff dashboard | P0 | 0.5d | A-09 | TODO | Dev | |
| Y-08 | Estimator load test | P1 | 0.5d | V-12 | TODO | Dev | 200 concurrent |
| Y-09 | **Estimator user test, 8 buyers** | P0 | — | V-09 | TODO | External | **GATE — ≥6 complete unaided** |
| Y-10 | Speed-to-lead drill | P0 | — | A-08 | TODO | Ops | Notification <60s; reply by end of next business day |
| Y-11 | Analytics verification | P0 | 0.5d | Y-07 | TODO | Dev | |
| Y-12 | Soft launch | P0 | — | Y-* | TODO | Ops | |
| Y-13 | Public launch | P0 | — | Y-12 | TODO | Ops | |

## Blocked / decisions needed

| ID | Item | Needed from | Blocks |
|---|---|---|---|
| Q-DG1 | 10 historical projects with real final prices | Atik | V-04, V-05 |
| Q-DG2 | Confirm base price bands per project type | Atik | V-01 |
| Q-DG3 | Care Plan tiers, SLAs, notice periods | Atik | W-03 |
| Q-DG4 | Diagnostic price and deliverable list | Atik | T-09 |
| Q-DG5 | Client contract — ownership/IP clauses to cite | Atik + solicitor | T-03, T-04 |
| Q-DG6 | Which 8 projects become case studies | Atik | X-02 |
| Q-DG7 | Honest lock-in assessment per stack item | Atik + Dev | X-03 |
| Q-DG8 | The exclusions list — what you genuinely won't do | Atik | X-05 |

## Metrics dashboard

| Metric | Target | Current |
|---|---|---|
| Visitor → lead | ≥4% | — |
| Estimator start → complete | ≥60% | — |
| Estimator complete → lead | ≥35% | — |
| Diagnostic share of leads | ≥50% | — |
| Care Plan interest in enquiries | ≥40% | — |
| Lighthouse (all templates) | 100/100/100 | — |
| LCP p75 | ≤1.6s | — |
| p95 speed-to-lead | <60s | — |
| Estimate range accuracy vs closed deals | ≥80% | — |
