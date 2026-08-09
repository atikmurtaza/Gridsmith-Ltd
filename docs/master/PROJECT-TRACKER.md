# Project Tracker — Gridsmith Master Layer

**Status:** `TODO` · `WIP` · `BLOCKED` · `REVIEW` · `DONE` · **Priority:** P0 blocks launch · P1 desirable · P2 post-launch

The master layer owns the shared foundation (Epic A, previously in the Design tracker) plus two additions.

---

## Epic A — Shared foundation *(moved here from Design)*

Build order agreed at kickoff and binding — the `#` column, not the ID order. Six
deviations from the original numbering are marked ⚑ and explained below the table.

| # | ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | A-01 | Next.js **15 (pinned)** + React 19 + TS strict + Tailwind v4 scaffold | P0 | 0.5d | — | DONE | Dev | Next 16 measured at +29KB gz — breaks every budget. See FOUNDATION §2 |
| 1 | A-10a | ⚑ CI gates — TS, ESLint, `no-hardcoded-colors`, service-role grep, `check-bundle-size` | P0 | 0.5d | A-01 | DONE | Dev | Ships with A-01. Deliberate hex fails the build. size-limit dropped — measured the wrong quantity |
| 2 | A-02 | Token layer `tokens.css` | P0 | 1d | A-01 | DONE | Dev | 39 base tokens, FOUNDATION §3. Tailwind namespace collision cleared; `check:tokens` gate added |
| 3 | A-03 | ⚑ Four theme files — **incl. master (was M-01)** | P0 | 1.5d | A-02 | TODO | Dev | Master proves the token contract for a theme with no colour |
| 4 | A-04 | Four route groups + `data-division` | P0 | 1d | A-03 | TODO | Dev | Zero theme flash; server-set |
| 5 | A-05 | ⚑ **24** shared primitives | P0 | 4d | ⚑ **A-04** | TODO | Dev | Was "21 / depends A-02". `Marquee` deleted |
| 5 | A-05a | ⚑ `/_kitchen-sink` route | P0 | 0.5d | A-05 | TODO | Dev | All 24 × 4 themes. `noindex`, excluded from prod build |
| 6 | **A-GATE** | ⚑ **Epic A exit gate** | P0 | 0.5d | A-05a, A-10b | TODO | Dev | **Nothing downstream starts until green** — see below |
| 6 | A-10b | ⚑ CI gates — Lighthouse CI + axe | P0 | 0.5d | A-05a | TODO | Dev | Needs a page to measure |
| 7 | A-06 | Sanity project + core schemas | P0 | 2d | — | REVIEW | Dev | Schemas written; **awaiting Sanity org (B4)** |
| 8 | A-07 | Supabase + `leads` + RLS | P0 | 1d | — | REVIEW | Dev | Migrations written; **awaiting Supabase project (B4)** |
| 9 | A-08 | Lead pipeline end-to-end | P0 | 1.5d | A-07 | TODO | Dev | Notify <60s. No CRM adapter — deferred, see D1 |
| 10 | A-11 | ⚑ **Consent management + script gating** | P0 | 2d | A-01 | TODO | Dev | **Precedes A-09.** No cookie before consent |
| 11 | A-09 | ⚑ Analytics + AI-referral detection | P0 | 1d | ⚑ **A-11** | TODO | Dev | Built on the consent layer, not gated afterwards |
| 12 | A-12 | **Seed enforcement + production build check** | P0 | 1d | A-06 | TODO | Dev | Seed publish fails prod build |

**The six deviations, and why:**

1. **A-10 split, A-10a moved to first.** `no-hardcoded-colors` must exist before the
   first primitive — free on day one, a 24-file cleanup after. LHCI and axe need a page,
   so they become A-10b behind the kitchen sink.
2. **M-01 folded into A-03.** A theme file is ~20 lines, and master is the theme that
   proves the "only these tokens" contract holds when a theme has no colour of its own.
   A-04's zero-flash DoD also needs four groups to test against, not three.
3. **A-05 depends on A-04, not A-02.** Its DoD is "renders correctly in all four themes",
   which is untestable before the themes and route groups exist.
4. **A-05a added.** `02-BUILD-SEQUENCE.md` calls the kitchen sink the highest-leverage
   discipline in the build and gates every page on it; it had no tracker task.
5. **A-11 before A-09 — canonical.** Consent is the substrate that *injects* GA4 and
   PostHog. Building analytics first and gating it afterwards is how a non-essential
   cookie ships firing before consent, against `PROJECT-RULES.md` §1.6 and a PECR ceiling
   of 4% of turnover. This order also makes A-09's DoD provable: zero GA4 requests
   pre-consent, demonstrated in devtools.
6. **A-GATE added** as an explicit task rather than a convention.

**A-GATE pass criteria** — all six, no partial credit:

- [ ] `/_kitchen-sink` renders all 24 primitives correctly in all four themes
- [ ] Correct at 375px, 768px, 1440px
- [ ] Keyboard navigable end to end
- [ ] Zero hardcoded colours (A-10a green)
- [ ] `rules-compliance` — **fresh context**, zero findings
- [ ] `accessibility-audit` — **fresh context**, zero findings

Both subagents run from `.claude/agents/`. The fresh context is the point: the model
that just wrote 24 primitives is the worst available reviewer of them.

**Internal order within A-05** — each tier depends only on the one above, and
`'use client'` first appears in the last tier, so it stays isolated and auditable:

| Tier | Primitives |
|---|---|
| Structure | `Container` `Grid` `Section` `Prose` `Heading` `Eyebrow` |
| Content | `Card` `Badge` `Table` `Media` `Breadcrumb` `Pagination` |
| Interactive | `Button` `Link` `Field` `Select` `RadioGroup` `Accordion` `Tabs` `Stepper` |
| States | `EmptyState` `ErrorState` |
| Motion / chrome | `RevealOnScroll` `StickyCta` |

## Epic M — Master shell

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| M-01 | ~~Master theme; accent = ink~~ | P0 | — | — | MOVED | Dev | **Folded into A-03.** Amber 2.0:1 constraint enforced there |
| M-02 | Root layout, server-set `data-division` | P0 | 1d | A-04 | TODO | Dev | |
| M-03 | Header with per-division nav | P0 | 1.5d | A-05 | TODO | Dev | Wordmark → `/` |
| M-04 | Footer + division switcher + statutory block | P0 | 1d | M-03 | TODO | Dev | From `companyDetails` |
| M-05 | `companyDetails` singleton | P0 | 0.5d | A-06 | TODO | Dev | Response commitment stored once |
| M-06 | Consent banner UI | P0 | 1.5d | A-11 | TODO | Dev | Accept/Reject identical |
| M-07 | 404 + 500 pages | P0 | 1d | M-03 | TODO | Dev | 500 works without JS |

## Epic N — Master pages

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| N-01 | Homepage, 9 blocks | P0 | 2.5d | M-03 | TODO | Dev | Lighthouse ≥98 |
| N-02 | **Division routing block** | P0 | 1.5d | N-01 | TODO | Dev | Above second viewport |
| N-03 | `groupPage` schema | P0 | 0.5d | A-06 | TODO | Dev | |
| N-04 | `/approach`, 8 blocks | P0 | 2d | N-03 | TODO | Dev | Incl. limits section |
| N-05 | `continuityExample` schema + component | P0 | 1.5d | N-03 | TODO | Dev | `verified` hard-true |
| N-06 | Canonical process component + validator | P0 | 1d | A-06 | TODO | Dev | Six canonical titles only |
| N-07 | `/about` + structure disclosure | P0 | 1.5d | M-05 | TODO | Dev | |
| N-08 | `/work` master grid | P0 | 2d | A-06 | TODO | Dev | Cross-division sorted first |
| N-09 | **Canonical `/work/[slug]`** | P0 | 1.5d | N-08 | TODO | Dev | Divisions link here |
| N-10 | Division work routes → canonical links | P0 | 0.5d | N-09 | TODO | Dev | Removes duplicate-content risk |
| N-11 | `/contact` master flow | P0 | 2d | A-08 | TODO | Dev | "More than one" first-class |
| N-12 | Confirmation screen + commitment | P0 | 0.5d | M-05, N-11 | TODO | Dev | |
| N-13 | `/insights` hub | P1 | 1d | A-06 | TODO | Dev | |

## Epic L — Legal & compliance

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| L-01 | `legalDocument` schema + clause anchors | P0 | 1d | A-06 | TODO | Dev | `solicitorApproved` gate |
| L-02 | Legal page template, TOC, print CSS | P0 | 1d | L-01 | TODO | Dev | Stable `#anchor` per clause |
| L-03 | Load four drafts from `_legal/` | P0 | 0.5d | L-02 | TODO | Content | To staging |
| L-04 | **Solicitor review of all documents** | P0 | — | L-03 | TODO | Atik + solicitor | **HARD GATE — send week 1** |
| L-05 | Statutory disclosure verification | P0 | 0.5d | M-04 | TODO | Dev | Every page |
| L-06 | ICO registration + number recorded | P0 | — | — | TODO | Atik | |
| L-07 | `consent_events` audit table | P0 | 0.5d | A-11 | TODO | Dev | No PII |
| L-08 | PI insurance scope confirmation | P0 | — | — | TODO | Atik + broker | Must cover engineering drawings |

## Epic G — Migration & SEO

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| G-01 | Crawl existing site, export URLs | P0 | 0.5d | — | TODO | Dev | |
| G-02 | Build `redirects/legacy.json` | P0 | 1d | G-01 | TODO | Dev | Zero unmapped |
| G-03 | Implement + test redirects | P0 | 0.5d | G-02 | TODO | Dev | None to `/` or 404 |
| G-04 | Sitemap, robots, `llms.txt` | P0 | 1d | N-* | TODO | Dev | All four groups |
| G-05 | Structured data pass | P0 | 1d | N-* | TODO | Dev | `department`, not four orgs |
| G-06 | **Bulk import script** | P0 | 1.5d | A-06 | TODO | Dev | 100 records in one pass |
| G-07 | **Image ingest pipeline** | P0 | 1d | G-06 | TODO | Dev | Watermark, resize, AVIF |

## Epic S — Seed content

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| S-01 | Seed script, all volumes | P0 | 2d | A-12 | TODO | Dev | Per FOUNDATION §7 |
| S-02 | 24 seed projects incl. 3 cross-division, 3 confidential | P0 | 1d | S-01 | TODO | Content | |
| S-03 | Seed pricing with `INDICATIVE` badges | P0 | 0.5d | S-01 | TODO | Dev | No unbadged figure |
| S-03a | **Seed metrics render `[SEED] 00%`** | P0 | 0.5d | S-01 | TODO | Dev | Zeroed digits, never a plausible figure. Per FOUNDATION §7.6 |
| S-04 | Abstract placeholder imagery | P0 | 1d | S-01 | TODO | Design | **No fabricated drawings/covers/screenshots** |
| S-05 | `?seed=hide` + env flag | P1 | 0.5d | S-01 | TODO | Dev | Demo mode |
| S-06 | Production seed check verified | P0 | 0.5d | A-12 | TODO | Dev | Deliberate failure test |
| S-07 | 3 seed cross-division case studies | P0 | 1d | S-02 | TODO | Content | Evidence for `/approach` |

## Epic H — Hardening & launch

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| H-01 | Homepage performance ≥98 | P0 | 1.5d | N-01 | TODO | Dev | Banner in budget |
| H-02 | Accessibility pass incl. consent banner | P0 | 2d | M-06 | TODO | Dev | |
| H-03 | All states | P0 | 1d | N-* | TODO | Dev | Incl. seed-hidden |
| H-04 | Cross-browser + device | P0 | 1d | H-01 | TODO | Dev | |
| H-05 | **Division routing user test, 10 users** | P0 | — | N-02 | TODO | External | **GATE — ≥70% one click** |
| H-06 | Notification drill | P0 | — | A-08 | TODO | Ops | <60s |
| H-07 | **Confirmation copy audit, all four groups** | P0 | 0.5d | N-12 | TODO | Dev | Nothing faster than next business day |
| H-08 | PostHog funnels | P0 | 0.5d | A-09 | TODO | Dev | 3 master funnels |
| H-09 | Launch | P0 | — | H-* | TODO | Ops | |

## Blocked / decisions needed

| ID | Item | Needed from | Blocks |
|---|---|---|---|
| ~~Q-M1~~ | **RESOLVED.** Company number `17050842`; registered office `30 Briarfield Road, Farnworth, Bolton, BL4 0HD`; place of registration England & Wales. Populate `companyDetails` at M-05 — these render the statutory block, never hardcoded in a component | Atik | ~~M-05, L-05, 0.10~~ unblocked |
| ~~Q-M12~~ | **RESOLVED — the metric changed, not the numbers.** JS is now budgeted on the delta above the framework floor, not the total: Master ≤15KB, Digital ≤15KB, Press ≤20KB, Design ≤25KB, estimator/path-finder ≤40KB. The floor (100.2KB) is reported separately so a dependency upgrade shows as a floor change rather than silently consuming feature allowance. **Digital's 100/100/100 gate is unchanged** — Lighthouse scores measured experience, and the 90KB figure was a badly-set proxy for it | Atik | ~~Digital launch~~ unblocked |
| Q-M10 | Font licences — are Neue Haas Grotesk Display / GT America Mono / Freight Text held, or do we build on the open fallbacks (Inter / JetBrains Mono / Source Serif 4)? Blocks nothing before A-03; a later swap is a one-line `--font-display` change | Atik | A-03 |
| Q-M11 | **Gridsmith Press is already live and trading.** Stage 5 is a cutover of a revenue-generating site, not a launch. Cutover plan to be written into `master/IMPLEMENTATION-PLAN.md` before Stage 3 work begins | Atik | G-01, G-02, Stage 5 |
| Q-M2 | Solicitor engaged and drafts sent | Atik | L-04 |
| Q-M3 | ICO registration | Atik | L-06 |
| Q-M4 | PI insurance scope — engineering drawings covered? | Atik + broker | L-08 |
| Q-M5 | Business hours and phone number for the confirmation screen | Atik | N-12 |
| Q-M6 | A real continuity example — a client served across divisions or over time | Atik | N-05 |
| Q-M7 | The honest limits — when should someone use a specialist instead? | Atik | N-04 |
| Q-M8 | Existing site URL inventory / access to crawl | Atik | G-01 |
| Q-M9 | Public-facing team members | Atik | N-07 |

## Metrics dashboard

| Metric | Target | Current |
|---|---|---|
| Root sessions reaching a division ≤2 pageviews | ≥70% | — |
| `/approach` scroll depth ≥75% | ≥40% of sessions | — |
| Generalist / multi-need leads share | ≥15% | — |
| `/work` sessions viewing a cross-division case | ≥30% | — |
| Homepage bounce | ≤40% | — |
| Homepage Lighthouse performance | ≥98 | — |
| Consent accept rate | tracked, not targeted | — |
| Unmapped legacy URLs | 0 | — |
| Seed records in production | 0 | — |
