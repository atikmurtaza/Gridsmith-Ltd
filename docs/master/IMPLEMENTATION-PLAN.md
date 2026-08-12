# Implementation Plan — Gridsmith Master Layer

The master layer is built **alongside the shared foundation, before the first division**. It cannot be added afterwards without rework: the header, footer, consent banner, case study canonical route, statutory disclosure and seed-enforcement all sit at this level, and every division depends on them.

**Group build order:** Foundation + Master → **Press** → Design → Digital.

Per `_shared/02-BUILD-SEQUENCE.md` and the validation report §5 O-03. An earlier
revision of this file said *Design → Digital → Press* and `design/IMPLEMENTATION-PLAN.md`
said Design carried the foundation; both predate the decision to launch Master + Press
first and were corrected at kickoff.

---

## Phase 0 — Shared foundation (Week 1–2) · *owned here; moved from the Design plan*

Task IDs are stable — Phases 1–6 below and the division plans reference them by number.
**The IDs are not the build order.** Build order is:

```
0.1 + 0.9a  →  0.2  →  0.3  →  0.4 + exit gate  →  0.5  →  0.6  →  0.7
            →  0.11 →  0.8  →  0.12 →  0.10
```

| # | Task | Output | DoD |
|---|---|---|---|
| 0.1 | Next.js 15 (pinned) + React 19 + TS strict + Tailwind v4 scaffold | Repo, CI, preview deploys | `main` deploys green to Vercel |
| 0.2 | Token layer + **four** theme files (master + three divisions) | `tokens.css`, `themes/*.css` | All four themes render the kitchen sink correctly |
| 0.3 | Route groups + `data-division` layout switching | `app/(marketing|design|digital|press)` | Navigating between groups swaps theme with zero flash |
| 0.4 | **24 shared primitives** + `/_kitchen-sink` | `components/primitives/*` | Zero hardcoded colours; **Epic A exit gate** — see below |
| 0.5 | Sanity project, core schemas, Studio deploy | CMS live | Core types from `SCHEMA-CORE.md` editable |
| 0.6 | Supabase project, `leads` + RLS + indexes | DB live | Anon can insert, cannot select — verified by test |
| 0.7 | Lead pipeline: Server Action → DB → Resend → Slack | `api/lead` | End-to-end notify measured **under 60s** |
| 0.8 | Analytics: GA4 + PostHog + AI-referral detection | `lib/analytics` | **Depends on 0.11.** No GA4/PostHog request exists pre-consent; `is_ai_referral` flags a test Perplexity referrer |
| 0.9a | CI gates — TS strict, ESLint, `no-hardcoded-colors`, service-role grep, `check-bundle-size` | `.github/workflows` | A deliberate hex fails the build |
| 0.9b | CI gates — Lighthouse CI + axe | `.github/workflows` | Runs against `/_kitchen-sink`; a deliberate regression is blocked |
| 0.10 | Legal pages + trust footer with company number | `/legal/*` | Companies Act disclosure verified present. **Blocked on Q-M1** |
| 0.11 | **Consent management** — banner, Consent Mode v2, script gating | `lib/consent`, `components/chrome` | No non-essential cookie fires before consent; verified in devtools |
| 0.12 | **Seed enforcement** — `isSeed`, seed script, production build check | `scripts/` | Deliberately publishing a seed record fails the production build |

**Why 0.9a is first and 0.11 precedes 0.8** — the two ordering decisions that are not
obvious from the dependency graph:

- `no-hardcoded-colors` has to exist before the first primitive, not after 24 of them.
  On day one it is free; retrofitted it is a 24-file cleanup. LHCI and axe (0.9b) need
  a page to measure, so they follow the kitchen sink.
- Consent is the substrate that *injects* GA4 and PostHog, so it cannot be retrofitted
  under analytics that already load. `master/PROJECT-RULES.md` §1.6 is explicit — *not
  loaded-and-suppressed, not injected*. Built in this order, 0.8's DoD is provable:
  zero network requests to GA4 before an affirmative choice.

**Phase 0 exit gate** — a themed placeholder page in each of the four route groups, a
working form landing in Supabase and Slack in under 60 seconds, CI blocking a deliberate
regression, and `/_kitchen-sink` clearing `rules-compliance` and `accessibility-audit`
from `.claude/agents/` **in a fresh context**, both with zero findings.

## Phase 1 — Master shell (Week 3)

| # | Task | Depends on | DoD |
|---|---|---|---|
| 1.1 | Master theme; `--accent` = ink; division accents as variables | 0.2 | Amber constraint documented. **Partly mechanised:** a lint rule can ban `--accent-design` in `color`/`fill`/`stroke`; it cannot detect a badge whose only state signal is an amber border. That half is manual review — do not record the gate as fully automated |
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
| Division accents used as text on white | Medium | Medium | Amber is 2.16:1 (check:contrast). Lint rule + documented in DESIGN.md §2 |
| Response commitment drifts on some template | Medium | Medium | Single source of truth in `companyDetails`; audit task 6.7 |
| Redirect map incomplete | Medium | High | 4.1–4.3 with a zero-unmapped DoD |
