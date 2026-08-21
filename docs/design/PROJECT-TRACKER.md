# Project Tracker — Gridsmith Design

**Status key:** `TODO` · `WIP` · `BLOCKED` · `REVIEW` · `DONE`
**Priority:** P0 blocks launch · P1 launch-desirable · P2 post-launch

Update `Status` and `Notes` in place. Do not delete rows — move them to `DONE`.

---

## Epic A — Shared foundation · *moved to `master/PROJECT-TRACKER.md`*

**Do not use the copy that used to live here.** It had drifted from master's and the two
had genuinely conflicting definitions — three theme files rather than four, and `A-11`
meaning *legal pages + trust footer* here while `A-11` means *consent management* in
master. A commit citing `A-11` would have been ambiguous, and a session reading this file
first would have built the wrong task.

`master/PROJECT-TRACKER.md` Epic A is the only version. Design's `B-*` rows that depend
on `A-03` resolve against it correctly — master's `A-03` builds all four themes,
including Design's.

## Epic B — Design shell

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| B-01 | Apply Design theme, verify contrast | P0 | 0.5d | A-03 | TODO | Dev | All pairs in DESIGN.md §2 |
| B-02 | Header + nav + mobile menu | P0 | 1d | A-05 | TODO | Dev | |
| B-03 | Footer + division switcher | P0 | 0.5d | A-11 | TODO | Dev | Switcher in footer, not header |
| B-04 | Sticky mobile CTA bar | P0 | 0.5d | B-02 | TODO | Dev | FR-D19 |
| B-05 | `/design/` hub, 9 blocks | P0 | 2d | B-02 | TODO | Dev | |
| B-06 | **Track fork component** | P0 | 2d | B-05 | TODO | Dev | Cookie-based, SSR-correct |
| B-07 | Track A landing | P0 | 1.5d | B-06 | TODO | Dev | Work-first ordering |
| B-08 | Track B landing | P0 | 2d | B-06 | TODO | Dev | 13 blocks |
| B-09 | Service page template | P0 | 2d | A-06 | TODO | Dev | Pricing required |
| B-10 | Case study template | P0 | 1.5d | A-06 | TODO | Dev | Metric + confidential guard |

## Epic C — Conversion machinery

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| C-01 | `drawingType` schema | P0 | 0.5d | A-06 | TODO | Dev | |
| C-02 | Drawing matrix component | P0 | 2d | C-01 | TODO | Dev | Real table, sticky header |
| C-03 | Matrix filtering + query logging | P1 | 1d | C-02 | TODO | Dev | URL state |
| C-04 | Standards strip + controlled list | P0 | 0.5d | C-01 | TODO | Dev | No free text |
| C-05 | QA process module | P0 | 1d | B-08 | TODO | Dev | 5 named stages |
| C-06 | Pricing block, 6 models | P0 | 1.5d | B-09 | TODO | Dev | SC-6 |
| C-07 | Sample pack: schema + storage | P0 | 1d | A-07 | TODO | Dev | Private bucket |
| C-08 | Sample pack: form + signed URLs | P0 | 1.5d | C-07 | TODO | Dev | 72h, single use |
| C-09 | Sample pack: rate limiting | P0 | 0.5d | C-08 | TODO | Dev | Upstash |
| C-10 | Sample pack: 3-day follow-up | P1 | 0.5d | C-08 | TODO | Dev | |
| C-11 | Multi-step contact flow | P0 | 3d | A-08 | TODO | Dev | Track-aware, prefill |
| C-12 | Short-form variant | P1 | 0.5d | C-11 | TODO | Dev | For Track A |
| C-13 | Design Desk page + tiers | P0 | 1.5d | A-06 | TODO | Dev | `excludes` visible |
| C-14 | **Drawing estimator** config schema | P0 | 0.5d | A-06 | TODO | Dev | Mirrors Digital `estimatorConfig` |
| C-15 | Drawing estimator calculation function | P0 | 1d | C-14 | TODO | Dev | Pure, unit tested |
| C-16 | Drawing estimator UI + result | P0 | 1.5d | C-15 | TODO | Dev | No email gate; JS delta ≤40KB gz |
| C-17 | Estimator calibration vs 8 past jobs | P0 | 0.5d | C-15 | TODO | Dev | **GATE — range contains actual in ≥6/8** |

## Epic D — Portfolio & media

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| D-01 | `/design/work` grid | P0 | 1.5d | B-10 | TODO | Dev | **First real exercise of the `Media` primitive** — see DoD below |
| D-02 | Filters with URL state | P0 | 1.5d | D-01 | TODO | Dev | Canonical to unfiltered |
| D-03 | Watermark baked at CMS ingest | P0 | 1d | A-06 | TODO | Dev | Not CSS overlay |
| D-04 | Context-menu + selection suppression | P1 | 0.5d | D-01 | TODO | Dev | Deterrence only |
| D-05 | Empty/loading states for grid | P0 | 0.5d | D-02 | TODO | Dev | |

**D-01 Definition of Done — additions.** `Media` was built at A-05 but is the one
primitive `/_kitchen-sink` does not render: exercising it needs real assets, and
fabricating placeholder imagery to fill the gap would have put invented visual content in
the repo (CLAUDE.md non-negotiable #2). `A-GATE` therefore passes without covering it, by
design. D-01 is where that debt is settled, so its DoD explicitly includes:

- [ ] Correct at 375px, 768px and 1440px
- [ ] Meaningful `alt` text on every image — never empty, never the filename
- [ ] Watermark present **in the asset itself**, baked at ingest, not a CSS overlay
- [ ] Context-menu suppression working (the client-side half deferred from A-05, D-04)
- [ ] Explicit `width`/`height` on every image
- [ ] Zero CLS measured on the grid under image load

## Epic E — Content

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| E-01 | 5 Track A service pages | P0 | 3d | B-09 | TODO | Content | |
| E-02 | 5 Track B service pages | P0 | 3d | B-09 | TODO | Content | |
| E-03 | 4 Track A case studies | P0 | 3d | B-10 | TODO | Content | ≥1 metric each |
| E-04 | 4 Track B case studies | P0 | 3d | B-10 | TODO | Content | ≥1 metric each |
| E-05 | Drawing matrix, ≥20 rows | P0 | 2d | C-01 | TODO | Content | |
| E-06 | **Chartered engineer review of matrix** | P0 | — | E-05 | TODO | External | **HARD GATE — book week 1** |
| E-07 | 12 FAQs | P0 | 1d | A-06 | TODO | Content | 6 per track |
| E-08 | 3 sample drawings redacted + watermarked | P0 | 1d | C-07 | TODO | Content | Manual review before upload |
| E-09 | 3 insight articles | P1 | 2d | A-06 | TODO | Content | |
| E-10 | All copy proofread | P0 | 1d | E-01..E-09 | TODO | Content | R4.6: a typo is a trust defect |

## Epic F — Hardening & launch

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| F-01 | Structured data, all templates | P0 | 1d | E-* | TODO | Dev | |
| F-02 | `llms.txt` + sitemap + robots | P0 | 0.5d | F-01 | TODO | Dev | |
| F-03 | Performance pass to budget | P0 | 2d | E-* | TODO | Dev | LCP ≤2.0s |
| F-04 | Accessibility: axe + keyboard + SR | P0 | 2d | E-* | TODO | Dev | Manual pass documented |
| F-05 | All error/empty/404/500 states | P0 | 1d | B-* | TODO | Dev | |
| F-06 | Cross-browser + device testing | P0 | 1d | F-03 | TODO | Dev | |
| F-07 | PostHog funnels | P0 | 0.5d | A-09 | TODO | Dev | 3 funnels |
| F-08 | Lead endpoint load test | P1 | 0.5d | A-08 | TODO | Dev | 100 concurrent |
| F-09 | **Track fork user test, 10 users** | P0 | — | B-06 | TODO | External | **HARD GATE — ≥80% correct** |
| F-10 | Speed-to-lead live drill | P0 | — | A-08 | TODO | Ops | Notification <60s; reply by end of next business day |
| F-11 | Defensive domain 301s | P1 | 0.5d | — | TODO | Dev | |
| F-12 | Analytics verification sweep | P0 | 0.5d | F-07 | TODO | Dev | |
| F-13 | Soft launch, 10 contacts | P0 | — | F-* | TODO | Ops | |
| F-14 | Public launch | P0 | — | F-13 | TODO | Ops | |

## Blocked / decisions needed

| ID | Item | Needed from | Blocks |
|---|---|---|---|
| Q-01 | Confirm Track A vs Track B split, or test combined | Atik | B-06 |
| Q-02 | Real pricing figures per service | Atik + accountant | C-06, E-01, E-02 |
| Q-03 | Chartered engineer for matrix review | Atik | E-06 |
| Q-04 | Which 8 projects become launch case studies | Atik | E-03, E-04 |
| Q-05 | Design Desk tier structure and SLA commitments | Atik | C-13 |
| Q-06 | PI insurance scope — does it cover engineering drawings? | Broker | A-11 |

## Metrics dashboard (populate from launch)

| Metric | Target | Current |
|---|---|---|
| Visitor → lead | ≥4% | — |
| Track routing within 2 pageviews | ≥75% | — |
| Design Desk share of leads | ≥25% | — |
| Hub bounce | ≤35% | — |
| p95 speed-to-lead | <60s | — |
| LCP p75 | ≤2.0s | — |
| AI-referral share of organic | ≥8% by M6 | — |
