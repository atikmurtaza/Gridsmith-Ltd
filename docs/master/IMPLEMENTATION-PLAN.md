# Implementation Plan — Gridsmith Master Layer

The master layer is built **alongside the shared foundation, before the first division**. It cannot be added afterwards without rework: the header, footer, consent banner, case study canonical route, statutory disclosure and seed-enforcement all sit at this level, and every division depends on them.

**Revised group build order:** Foundation + Master → Design → Digital → Press.

---

## Phase 0 — Shared foundation (Week 1–2) · *unchanged from the Design plan, now owned here*

Tasks 0.1–0.10 as specified in `design/IMPLEMENTATION-PLAN.md`, plus two additions:

| # | Task | DoD |
|---|---|---|
| 0.11 | **Consent management** — banner, Consent Mode v2, script gating | No non-essential cookie fires before consent; verified in devtools |
| 0.12 | **Seed enforcement** — `isSeed` field, seed script, production build check | Deliberately publishing a seed record fails the production build |

## Phase 1 — Master shell (Week 3)

| # | Task | Depends on | DoD |
|---|---|---|---|
| 1.1 | Master theme; `--accent` = ink; division accents as variables | 0.2 | Amber constraint documented and lint-checked |
| 1.2 | Root layout with `data-division` set server-side | 0.3 | Zero theme flash between route groups |
| 1.3 | **Header** with per-division navigation switching | 0.4 | Wordmark always returns to `/` |
| 1.4 | **Footer** with division switcher and statutory block | 1.3 | Renders from `companyDetails` singleton |
| 1.5 | `companyDetails` singleton | 0.5 | Company number, registered office, response commitment |
| 1.6 | Consent banner UI — Accept and Reject visually identical | 0.11 | Keyboard escapable; no layout shift; accessibility reviewed |
| 1.7 | 404 and 500 pages | 1.3 | 500 works with JS disabled |

## Phase 2 — Master pages (Week 4–5)

| # | Task | Depends on | DoD |
|---|---|---|---|
| 2.1 | Homepage, 9 blocks | 1.3 | Division routing above the second viewport on all breakpoints |
| 2.2 | **Division routing block** | 2.1 | Three real `<a>` cards; "not sure" path not subordinate |
| 2.3 | `groupPage` schema + `/approach` | 0.5 | All 8 blocks incl. the limits section |
| 2.4 | `continuityExample` schema + component | 2.3 | `verified` hard-true; min 4 rows; min 2 divisions |
| 2.5 | Canonical six-stage process component | 0.5 | Validator rejects non-canonical stage titles |
| 2.6 | `/about` incl. group structure disclosure | 1.5 | States plainly that the three are trading divisions |
| 2.7 | `/work` master grid, cross-division sorted first | 0.5 | Division badges; URL-state filters |
| 2.8 | **Canonical `/work/[slug]`** case study route | 2.7 | Division routes link here; no duplicate detail routes |
| 2.9 | `/contact` master flow | 0.7 | "More than one" and "Not sure" equally weighted |
| 2.10 | Confirmation screen with the response commitment | 1.5, 2.9 | Renders from `companyDetails.responseCommitment` |
| 2.11 | `/insights` hub | 0.5 | Division filter |

## Phase 3 — Legal & compliance (Week 5–6) · *parallel with Phase 2*

| # | Task | Depends on | DoD |
|---|---|---|---|
| 3.1 | `legalDocument` schema with clause anchors | 0.5 | `solicitorApproved` gates production |
| 3.2 | Legal page template — TOC, anchors, print stylesheet | 3.1 | Every clause has a stable `#anchor` |
| 3.3 | Load drafts from `_legal/` | 3.2 | Four documents published to staging |
| 3.4 | **Solicitor review** | 3.3 | **HARD GATE — no legal page ships unapproved** |
| 3.5 | Statutory disclosure verification | 1.4 | Companies Act items present on every page |
| 3.6 | ICO registration check | — | Registration number recorded in `companyDetails` |
| 3.7 | `consent_events` audit table | 0.11 | Choice demonstrable, no PII stored |

## Phase 4 — Migration & SEO (Week 6)

| # | Task | Depends on | DoD |
|---|---|---|---|
| 4.1 | Crawl existing site; export indexed URLs | — | Complete inventory |
| 4.2 | Build `redirects/legacy.json` | 4.1 | Zero unmapped URLs; none point to `/` or a 404 |
| 4.3 | Implement redirects | 4.2 | Tested against the full inventory |
| 4.4 | Sitemap, robots, `llms.txt` for all four groups | 2.* | Submitted to Search Console |
| 4.5 | Structured data pass | 2.* | `Organization` with `department` entries, not four orgs |
| 4.6 | Bulk import script `scripts/import-projects.ts` | 0.5 | 100 records imported in one pass in a test run |
| 4.7 | Image ingest pipeline — watermark, resize, AVIF | 4.6 | Runs on import, no manual asset prep |

4.6 and 4.7 are two days of work that will save several weeks when the real portfolio arrives. Build them before content entry, not after.

## Phase 5 — Seed content & validation (Week 7)

| # | Task | DoD |
|---|---|---|
| 5.1 | Seed script producing the volumes in `00-FOUNDATION.md` §7 | 24 projects, 3 cross-division, 3 confidential, etc. |
| 5.2 | Seed pricing with `INDICATIVE` badges | No seed figure renders without the badge |
| 5.3 | Seed imagery — abstract placeholders at correct aspect ratios | **No fabricated drawings, book covers or screenshots** |
| 5.4 | `?seed=hide` and env flag verified | Site demonstrable to a prospect with no placeholder work |
| 5.5 | Production seed check verified | Deliberate seed publish fails the build |
| 5.6 | 3 seed cross-division case studies | Exercises `/approach` evidence blocks |

## Phase 6 — Hardening & launch (Week 8)

| # | Task | DoD |
|---|---|---|
| 6.1 | Performance — homepage Lighthouse ≥98 | Consent banner included in the budget |
| 6.2 | Accessibility full pass, consent banner focus | Banner keyboard-escapable, announced, skip link unobstructed |
| 6.3 | All states implemented | Incl. seed-hidden mode |
| 6.4 | Cross-browser + device | |
| 6.5 | **Division routing user test, 10 users** | **GATE — ≥70% reach the correct division in one click** |
| 6.6 | Notification drill | <60s to Slack and email |
| 6.7 | Confirmation copy audit across all four groups | No template promises faster than next business day |
| 6.8 | PostHog funnels | 3 master funnels live |
| 6.9 | Launch | |

## Phase 7 — Post-launch

- **Monthly: `v_master_value`.** If generalist and multi-need leads stay near zero across two quarters, the ecosystem argument is not working. That is a strategy signal, not a design one — rethink before redesigning.
- Monthly: `v_routing_effectiveness` against the 70% target.
- Quarterly: legal document review; bump `lastReviewed` even when nothing changes.
- As real portfolio arrives: bulk import, then delete seed records (never edit seed into real).
- A/B queue: (1) hero copy, (2) division card descriptors, (3) "not sure" wording.

---

## Critical path

`0.1 → 0.11 (consent) → 1.2 (root layout) → 1.4 (footer/statutory) → 2.2 (routing) → 2.8 (canonical case study) → 3.4 (solicitor gate) → 4.3 (redirects) → 6.5 (routing test) → launch`

Divisions cannot start Phase 1 until master Phase 1 is complete — they inherit the header, footer and consent layer.

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Solicitor review delays launch | **High** | High | Send drafts in week 1, not week 5. It is the longest external lead time in the programme |
| Ecosystem argument reads as corporate filler | Medium | High | The continuity example must be real and specific; the limits section must be honest. Both are content problems, not design ones |
| No real cross-division projects exist yet | **High** | High | Seed 3 for launch; treat winning one as a business priority — it is the proof the whole model rests on |
| Master layer gets skipped to ship divisions faster | Medium | **Severe** | Header, footer, consent and canonical case study routes all live here. Skipping it means rebuilding all three divisions |
| Division accents used as text on white | Medium | Medium | Amber is 2.0:1. Lint rule + documented in DESIGN.md §2 |
| Response commitment drifts on some template | Medium | Medium | Single source of truth in `companyDetails`; audit task 6.7 |
| Redirect map incomplete | Medium | High | 4.1–4.3 with a zero-unmapped DoD |
