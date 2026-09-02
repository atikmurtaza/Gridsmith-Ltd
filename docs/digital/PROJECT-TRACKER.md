# Project Tracker — Gridsmith Digital

**Status:** `TODO` · `WIP` · `BLOCKED` · `REVIEW` · `DONE` · **Priority:** P0 blocks launch · P1 desirable · P2 post-launch

Assumes the shared foundation (`master/PROJECT-TRACKER.md` Epic A) is `DONE`, including
`A-GATE`.

---

## Epic U — Digital shell

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| U-01 | Apply Digital theme, verify contrast | P0 | 0.5d | A-03 | **DONE** — satisfied by `A-03`/`A-04` | Dev | `styles/themes/digital.css` exists and `(digital)/layout.tsx` sets the group; `check:contrast` gates it. ⚠ **This row said `--line-strong` 2.1:1 until 2 September 2026 — a figure no gate produces and the DESIGN spec contradicts.** `check:contrast` asserts the literal **1.59:1** for Digital and classifies the token `decor`; `DESIGN.md` §2 says 1.59:1. The gate is the source of truth. The constraint itself is real and stronger than 2.1:1 implied: `--line-strong` may never be a sole information carrier, which is now enforced by `check:state-cues` rather than restated in prose. Third stale-row instance of the session, with `A-GATE` and the `noindex` description |
| U-02 | Mono display font loading | P0 | 0.5d | U-01 | **DONE** — satisfied by `M-08` | Dev | `(digital)/layout.tsx` loads JetBrains Mono as the display face and Inter as body. **Families: 2, satisfied. Weights: `≤4 weights total` is not a measurable claim as written and no gate counts it** — both faces are `next/font` variable fonts, so there is no discrete weight list to count. Recorded rather than worked around: inventing a way to count it would produce a number nothing measures, which is the defect `CLAUDE.md` names. If a static-weight face is ever added, the claim becomes measurable and should get a gate then |
| U-03 | **Data row component** | P0 | 1d | U-01 | **DONE** 2 Sep | Dev | `components/divisions/digital/DataRow.tsx` — a `<dl>`, mono label · mono value · body prose, zero client JS. **Not in `primitives/`**: `DESIGN.md` names four consumers and all four are Digital, so sharing is a guess until a second division asks. Specimen committed on `/_kitchen-sink` inside the digital frame, so `check-axe` reaches it — 60 analyses, zero violations. The three-cue rule it sits under now has a gate, `check:state-cues`, which **found a live colour-alone state on its first run** (`.breadcrumbCurrent`) |
| U-04 | Header, footer, mobile nav | P0 | ~~1d~~ **0.25d left** | A-05 | **DONE** — satisfied by `M-02`/`M-03`/`M-04`; residual `BLOCKED` | Dev | **Third row this stage the tracker did not know was already built.** `(digital)/layout.tsx` renders `RootShell`, which renders the skip link, `Header division="digital"` and the shared `Footer` — so /digital already has header, footer and statutory block, and there is no Digital-specific footer requirement in `APP-FLOW.md`. `check-axe` audits `/digital` (line 50) and `check-responsive` measures it at 375/768/1440 (line 30, `WIDTHS`), so the gates already reach the shell this row was to build. **Source-verified by reading the layout, `RootShell.tsx` and both gate route lists; not separately re-measured in this session — the numbers are the gates' own, not new readings.** **Residual, and it is blocked rather than outstanding:** `APP-FLOW.md` §7 specifies the Digital header as `Gridsmith · Digital · Websites · Software · Products · Work · Stack · [Estimate a project]`, and `nav.ts` holds `digital: []`. Every one of those targets is another row's route — Websites/Software/Products are `U-07`, Work is `W-01`, Stack is `T-02`, and the estimator CTA is `V-06`/`V-07`. None exists; `check-axe` resolves every same-origin link on every audited route, so adding any of them now fails the build. This is the same policy `nav.ts`'s own docstring already states for all three divisions. **"Mobile nav" is a hamburger in the spec and nothing here needs one yet.** With zero items the Digital header is the wordmark alone. The master header carries six items with `flex-wrap` and no hamburger, and passes `check-responsive` at 375px — so when Digital's six land, the wrap pattern is the **measured** precedent and a hamburger is a **projected** need, not an established one. Decide it at `U-07`, when there are items to collapse, and decide it against a 375px measurement rather than the spec line. **`FR-DG20` (trust footer: company number, registered office, IP/ownership statement, GDPR, security posture) is assigned to no row in the tracker.** Half is shipped by `M-04` (number, registered office, and more besides — the reg. 25(2) particulars in full). The other half is content this row cannot write: the IP/ownership statement is `T-03`'s module, GDPR is a link to `/legal/privacy-policy`, and "security posture" is unspecified `[TK]`. Filed as `M-P2-22` for the footer link groups — **closed 2 Sep (`7c069b0d`)**: the Company and Legal groups now render on every route, so GDPR-as-a-link-to-`/legal/privacy` is satisfied for `/digital` by the shared footer and is not this row's residual any more. The IP/ownership statement is still `T-03`'s and "security posture" is still unspecified `[TK]` |
| U-05 | Split sticky mobile CTA | P0 | 0.5d | U-04, **`V-06`** | **BLOCKED** | Dev | Estimate 60 / Talk 40 (`APP-FLOW.md` §7). **60% of this bar points at a route that does not exist.** There is no `/digital/estimate`; `V-06` (static SSR pricing bands) and `V-07` (the island) build it, and `check-axe` resolves every same-origin link on every audited route, so shipping the bar first fails the build. Talk resolves — `/contact` exists. The `StickyCta` primitive is already built (`A-05`) and is single-child; the 60/40 split is a Digital wrapper over it, not a change to the primitive. **Its only committed subject today is the specimen on `/_kitchen-sink`, which `check-responsive.mjs:202` warns is removed from the production build at `A-12`** — this row is the natural place to give that gate a real-route subject, and doing so is the point at which the hollow-subject risk closes. Dependency corrected from `U-04` alone to `U-04` + `V-06`. **Recorded 2 Sep: this is a SCHEDULED EXPIRY, not a discovered hollow subject, and it is the first of its kind in this build.** Every hollow-subject defect the programme has caught so far was found after the fact — a gate already auditing nothing, discovered by proof. `check-responsive.mjs:202` is the opposite: it names its own future emptiness in the failure message, sets `barsMeasured === 0` to exit 1 rather than pass, and names the row (`A-12`) that will remove its only subject. So the class divides in two, and the second half is cheap: **a gate whose subject has a known removal date can say so where the next reader will be standing.** The risk closes here, at `U-05`, when the 60/40 bar lands on `/digital` and the assertion gets a production-route subject; until then the scheduled expiry is the mitigation and `A-12` must not land first |
| U-06 | `/digital/` hub, 11 blocks | P0 | 2d | U-04 | TODO | Dev | Lighthouse 100/100/100. **`app/(digital)/digital/page.tsx` already exists and is NOT this row.** It is the Epic N/L/S shell landing page: 46 lines of copy handed to the shared `components/divisions/DivisionLanding.tsx`, which the other two divisions render too. Measured against `APP-FLOW.md` §3's eleven blocks — **5 present** (1 hero, 2 four service groups, 5 selected work, 6 process, 11 CTA band; it also renders a testimonials section the eleven do not list) and **6 absent**: 3 ownership guarantee (`T-03`), 4 live vitals badge (`T-07`/`T-08`), 7 what we don't do (`T-05`), 8 diagnostic offer (`T-09`), 9 Care Plan teaser (Epic W), 10 FAQ. **Every absent block is a Digital-specific differentiator that depends on another row**, which is why the shared shell has none of them, and the file's own docstring says so: *"This is the landing page, not the full hub."* Estimate stands at 2d — the 5 present blocks are generic and most will be replaced rather than kept |
| U-07 | 4 service group landings | P0 | 2d | U-06 | TODO | Dev | Visible price band each |
| U-08 | Service page template | P0 | 2d | A-06 | **NEXT — the first genuinely buildable Epic U row** | Dev | Pricing + client time commitment. **Named 2 Sep after reading every row's real blocker rather than its `Depends` column.** `U-05` is blocked on `V-06`, `U-04`'s residual on `U-07`/`W-01`/`T-02`/`V-06`, and `U-07` on `U-06`. **`U-06` looks unblocked and is not:** 5 of `APP-FLOW.md` §3's eleven blocks are shipped by the shared landing page and **all six absent ones belong to other rows** — ownership guarantee `T-03`, live vitals `T-07`/`T-08`, what-we-don't-do `T-05`, diagnostic offer `T-09`, Care Plan Epic W, FAQ unassigned. Building `U-06` now means building the five that already exist. `U-08` is the first row whose inputs are all present: `A-06` is `DONE`, `sanity/schemas/documents.ts` carries the `service` type with a **required** `pricingModel` (which is CLAUDE.md non-negotiable #3 enforced at the schema rather than by a reviewer), `lib/sanity/queries.ts` has `listServices`, and `seed-content.mjs` seeds ten Digital services. It needs a single-service query and a route, and it depends on `U-07` for **navigation into it**, not for existence — `APP-FLOW.md` line 11 gives the URL shape as `/digital/services/[slug]` alongside the group landings. **One thing to settle before writing the route:** the seeded services' `ctaPrimary`/`ctaSecondary` point at `/contact` and `/approach`, both of which exist, so the resolve pass is satisfied — but `APP-FLOW.md` §7's service-page CTA is *Estimate this*, which is `V-06`. Ship the CTA the seed carries and change it at `V-06`, rather than blocking a whole template on the estimator |
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
