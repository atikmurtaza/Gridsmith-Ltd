# Implementation Plan — Gridsmith Design

Design is built **third**, after Foundation + Master and after Press, per
`_shared/02-BUILD-SEQUENCE.md`. It starts at its own Phase 1 and inherits a settled
foundation.

An earlier revision of this file had Design going first and carrying the shared
foundation. That is no longer true and the Phase 0 table has moved to
`master/IMPLEMENTATION-PLAN.md`, which owns it. Task IDs `0.1`–`0.12` are unchanged, so
existing references still resolve.

Estimates assume one full-time developer plus part-time design and content input. Multiply by 1.6 if part-time.

---

## Phase 0 — Shared foundation · *moved*

See `master/IMPLEMENTATION-PLAN.md` Phase 0. It is complete before Design starts.

## Phase 1 — Design skeleton (Week 3–4)

| # | Task | Depends on | DoD |
|---|---|---|---|
| 1.1 | Design theme applied and contrast-verified | 0.2 | All pairs in `DESIGN.md` §2 verified with a contrast tool |
| 1.2 | Header, footer, nav, mobile menu, sticky CTA | 0.4 | Keyboard navigable; sticky CTA appears at 40% scroll |
| 1.3 | `/design/` hub, all 9 blocks, static content | 1.2 | Lighthouse ≥95 on the hub |
| 1.4 | **Track fork component** + cookie persistence | 1.3 | Server-rendered correct ordering; no CLS; keyboard operable |
| 1.5 | Track A and Track B landing shells | 1.4 | Both routes render with placeholder content |
| 1.6 | Service page template | 0.5 | Renders from Sanity; pricing block cannot be empty |
| 1.7 | Case study template | 0.5 | Metric enforcement working; confidential guard verified |

## Phase 2 — Design conversion machinery (Week 5–6)

| # | Task | Depends on | DoD |
|---|---|---|---|
| 2.1 | `drawingType` schema + matrix component | 0.5, 1.5 | Real `<table>`; sticky header; mobile first-column pinned |
| 2.2 | Matrix filtering + `design_matrix_queries` logging | 2.1 | Filter state in URL; results announced via `aria-live` |
| 2.3 | Standards strip + controlled standards list | 2.1 | No free-text standards possible |
| 2.4 | QA process module | 1.5 | 5 named stages with sign-off roles |
| 2.5 | Pricing block component (all 6 models) | 1.6 | Renders per-drawing, per-sheet and day-rate variants |
| 2.6 | **Sample pack**: schema, storage, signed URLs, rate limit | 0.6, 0.7 | 72h expiry verified; single-use enforced; free-email blocked |
| 2.7 | Multi-step contact flow, track-aware, prefill via query params | 0.7 | Back preserves data; Zod discriminated union validates |
| 2.8 | Short-form variant for Track A | 2.7 | Reachable from Track A service pages |
| 2.9 | Design Desk page + `retainerTier` | 0.5 | Tiers render with `excludes` visible |

## Phase 3 — Portfolio & content (Week 7–8)

| # | Task | DoD |
|---|---|---|
| 3.1 | `/design/work` grid with URL-state filters | Shareable filtered URLs; canonical to unfiltered |
| 3.2 | Media protection: baked watermarks, context-menu suppression | Watermark present in the asset itself, not CSS |
| 3.3 | 10 service pages authored and published | Each has pricing, process, FAQs, ≥2 related projects |
| 3.4 | 8 case studies authored | Each has ≥1 quantified metric |
| 3.5 | Drawing matrix populated, ≥20 rows | **Reviewed by a chartered engineer — hard gate** |
| 3.6 | 12 FAQs + `FAQPage` schema | Validates in Rich Results Test |
| 3.7 | 3 sample drawings redacted, watermarked, uploaded | `redacted` and `watermarked` both true |
| 3.8 | 3 insight articles | `Article` schema valid |

## Phase 4 — Hardening (Week 9)

| # | Task | DoD |
|---|---|---|
| 4.1 | Full structured data pass | All templates validate |
| 4.2 | `llms.txt`, sitemap, robots, canonicals | Submitted to Search Console |
| 4.3 | Performance pass to budget | LCP ≤2.0s on 4G throttle, every template |
| 4.4 | Accessibility: axe + manual keyboard + NVDA/VoiceOver | Zero violations; manual pass documented |
| 4.5 | All states implemented (loading/empty/error/404/500) | Each demonstrable |
| 4.6 | Cross-browser + real device testing | Safari iOS, Chrome Android, Firefox, Edge |
| 4.7 | PostHog funnels configured | 3 funnels from `TECH-SPEC.md` §8 live |
| 4.8 | Load test on lead endpoint | 100 concurrent submissions, zero loss |

## Phase 5 — Launch & validate (Week 10)

| # | Task | DoD |
|---|---|---|
| 5.1 | User test track fork, 5 per buyer type | ≥80% self-select correctly — **blocks launch** |
| 5.2 | Speed-to-lead drill: submit → notification | Notification <60s verified; reply commitment is end of next business day |
| 5.3 | Redirects from defensive domains | `gridsmithdesign.co.uk` → `/design/` 301 |
| 5.4 | Analytics verification | Every event in the taxonomy fires once, correctly |
| 5.5 | Soft launch to 10 existing contacts | Feedback collected |
| 5.6 | Public launch | |

## Phase 6 — Post-launch optimisation (Week 11+, continuous)

- Week 2 post-launch: first conversion read. If under 2.5%, treat as a build defect and diagnose before adding content.
- Monthly: review `design_matrix_queries` for unserved disciplines → new service pages.
- Monthly: `is_ai_referral` cohort analysis. If AI referral converts above the 22% premium, prioritise machine-readability work.
- A/B queue: (1) track fork copy, (2) sample pack above vs below the matrix, (3) 4-step vs 3-step contact flow.

---

## Critical path

`0.1 → 0.2 → 0.4 → 1.4 (track fork) → 2.1 (matrix) → 2.6 (sample pack) → 3.5 (engineer review) → 5.1 (fork user test) → launch`

Two items are genuinely un-compressible and both are external dependencies: **3.5 chartered engineer review** and **5.1 user testing**. Book both in week 1, not week 8.

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Case studies not written in time | **High** | Blocks launch | Start week 1. This is the single most common cause of agency-site slippage |
| Drawing matrix contains a standards error | Medium | Severe, unrecoverable | Chartered engineer sign-off as a hard gate; controlled standards list |
| Track fork confuses rather than routes | Medium | High | User test before launch; fork must be scroll-skippable |
| Dark canvas fails contrast in edge components | Medium | Medium | Contrast verified per token pair in Phase 1, not at the end |
| Sample assets leak un-redacted client data | Low | **Severe** | Schema-level hard validation on `redacted`; manual review before upload |
| Scope creep into a client portal | Medium | High | Explicitly out of scope in PRD §8 |
