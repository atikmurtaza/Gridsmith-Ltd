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
| 3 | A-03 | ⚑ Four theme files — **incl. master (was M-01)** | P0 | 1.5d | A-02 | DONE | Dev | 29 contrast pairs measured; 2 AA failures in Design fixed, 25 published ratios corrected. Fonts scoped per route group. `check:contrast` gate added |
| 4 | A-04 | Four route groups + `data-division` | P0 | 1d | A-03 | DONE | Dev | Four **root** layouts (no `app/layout.tsx`) — the only way to set `data-division` on `<body>` per group without forcing dynamic rendering. `check:theme` gate |
| 5 | A-05 | ⚑ **24** shared primitives | P0 | 4d | ⚑ **A-04** | DONE | Dev | 21 Server, 3 Client (`Tabs`, `RevealOnScroll`, `StickyCta`). `Accordion` is native `<details>` |
| 5 | A-05a | ⚑ `/_kitchen-sink` route | P0 | 0.5d | A-05 | DONE | Dev | 23 primitives × 4 themes (`Media` excluded — see below); 5.7KB gz delta, budgeted at 7KB. Ids scoped per theme frame. `noindex`. Directory is `%5Fkitchen-sink` — a literal `_` prefix is a Next private folder and produces no route. Prod exclusion at A-12 |
| 6 | **A-GATE** | ⚑ **Epic A exit gate** | P0 | 0.5d | A-05a, A-10b | TODO | Dev | **Nothing downstream starts until green** — see below |
| 6 | A-10b | ⚑ CI gates — Lighthouse CI + axe + responsive | P0 | 0.5d | A-05a | **BLOCKED** | Dev | Re-based to mobile/4G with Core Web Vitals asserted; **now fails on Digital — `Q-M16`**. axe extended with DOM-integrity assertions axe-core cannot make. `check:responsive` added |
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
- [ ] Correct at 375px, 768px, 1440px — **gated by `check:responsive`**, not by eye
- [ ] Keyboard navigable end to end
- [ ] Zero hardcoded colours (A-10a green)
- [ ] `rules-compliance` — **fresh context**, zero findings
- [ ] `accessibility-audit` — **fresh context**, zero findings

Both subagents run from `.claude/agents/`. The fresh context is the point: the model
that just wrote 24 primitives is the worst available reviewer of them.

**Criterion 2 used to be a manual check, which made it a claim.** At the audit it could
only be recorded as "not established" — neither passed nor failed, the least useful state
a gate criterion can occupy. `scripts/check-responsive.mjs` now asserts no horizontal
overflow across 5 routes × 3 widths, and a route that fails to load is a measurement
failure rather than a pass.

**Ten gates, and `npm run verify` runs all ten.** It ran five and said nothing about the
other five — the three needing a build and the two needing a server. CI ran everything, so
merges were safe; a developer running the script named "verify" got half the coverage with
no indication of it, which is the same unearned confidence as a gate that measures nothing.

**A-10b — two assertions are ratcheted, with owners.** Lighthouse accessibility is
asserted at its final spec value now and passes. Two are pinned below 1.0 because
reaching 1.0 requires something that must not be invented:

| Category | Now | Blocked on | Raises at |
|---|---|---|---|
| SEO | 0.90 | `meta-description` on every page. Comes from `seoBlock.metaDescription`; writing placeholder copy to go green would be fabricated content | `N-01` |
| Best practices | 0.96 | `errors-in-console` — `/favicon.ico` 404s on every route. Needs a real brand mark | `Q-M15` |

Both still catch regressions below today's level, which is different from a gate that
measures nothing — re-confirmed at the Epic A audit, where every route measured exactly
0.90 and exactly 0.96 with one weight-1 audit failing in each category. Neither may be
lowered further.

**A-10b was re-based at the Epic A audit, and it now fails.** Three defects, all the same
class — a gate that was not measuring what its specification said it measured:

| Was | Now | Why |
|---|---|---|
| `preset: 'desktop'` — no CPU throttle, 10Mbps | mobile, 4G simulate, 4× CPU | FOUNDATION §8 gate 2 specifies 4G throttling. Desktop measured the easy case |
| No metric assertions at all | LCP, CLS and TBT asserted per route | `PROJECT-RULES.md` §8 named LHCI as the enforcement for LCP/INP/CLS. Lighthouse was collecting all three and nothing read them |
| `numberOfRuns: 1` | 3, asserting the median | Assertions pinned to an exact measured value with one cold run and no median |

**INP cannot be asserted in a lab run** — it is a field metric. Total Blocking Time is the
lab proxy and each route's TBT ceiling is set to its own INP budget (200ms, 150ms on
Digital). Real INP still has to be read from field data once there is traffic; nothing in
CI can stand in for that, and it should not be recorded as if it could.

Measured result, median of 3, mobile + 4G — see `Q-M16`. Master straddles its LCP
budget: two runs of the gate put the median at 1903ms and 1660ms respectively, so it
fails intermittently rather than cleanly, which is worse to diagnose later than a
consistent failure now:

| Route | Perf | LCP | Budget | CLS | TBT |
|---|---|---|---|---|---|
| `/` | 0.99 ✅ | **1660–1908ms** ⚠️ | 1800 | 0.000 ✅ | 41ms ✅ |
| `/design` | 0.99 ✅ | 1906ms ✅ | 2000 | 0.000 ✅ | 49ms ✅ |
| `/digital` | **0.99** ❌ | **1895ms** ❌ | 1600 | 0.000 ✅ | 37ms ✅ |
| `/press` | 0.99 ✅ | 1660ms ✅ | 2000 | 0.000 ✅ | 32ms ✅ |

**`Media` is out of scope for this gate, deliberately.** It is the one primitive
`/_kitchen-sink` does not render. `StickyCta` was the second — rendered once, outside the
four theme frames, so its colours were unverified on three of the four canvases and axe
never saw it there. It now renders in every frame, pinned in flow, with the live fixed
instance still at the foot of the page. "All 24 × 4" was the claim; 22 × 4 plus 1 × 1 plus
1 × 0 was the fact. Exercising it needs real assets, and fabricating
placeholder imagery to fill the gap would put invented visual content in the repo —
CLAUDE.md non-negotiable #2 outranks gate coverage. A-GATE therefore passes without
covering it, and that is the correct outcome rather than a hole to paper over. The debt is
settled at Design `D-01`, whose Definition of Done now carries the responsive, alt-text,
watermark, context-menu, explicit-dimensions and zero-CLS checks in full.

**Internal order within A-05** — each tier depends only on the one above.

Built in this order. The prediction that `'use client'` would first appear in the States
tier was wrong in both directions — States needs none, and `Tabs` in the Interactive tier
does. Recorded rather than reshuffled, because the tier order was about dependencies and
that part held.

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
| M-02 | Root layout, server-set `data-division` | P0 | 0.5d | A-04 | REVIEW | Dev | Shell built at A-04 (`components/chrome/RootShell.tsx`); remaining scope is skip link, header, footer, consent banner |
| M-03 | Header with per-division nav | P0 | 1.5d | A-05 | TODO | Dev | Wordmark → `/` |
| M-04 | Footer + division switcher + statutory block | P0 | 1d | M-03 | TODO | Dev | From `companyDetails` |
| M-05 | `companyDetails` singleton | P0 | 0.5d | A-06 | TODO | Dev | Response commitment stored once |
| M-06 | Consent banner UI | P0 | 1.5d | A-11 | TODO | Dev | Accept/Reject identical. **Measure the Master route delta here, not at H-01** — see below |
| M-07 | 404 + 500 pages | P0 | 1d | M-03 | TODO | Dev | 500 works without JS |

**M-06 also measures the Master delta.** Budget is 15KB. Known consumers: the consent
banner at ≤8KB spec'd, and the client primitive layer measured at 5.6KB on
`/_kitchen-sink`. That is 13.6KB of 15KB before the header and footer exist.

Header and footer are expected to be Server Components costing nothing, so the arithmetic
should hold — but expected is not measured. Taking the reading at M-06, the moment the
banner lands, means a surprise surfaces while the chrome is the only thing built. Waiting
until `H-01` would surface it after the whole of Stage 3 had been built on the assumption,
and the fix then is cutting a page feature to pay for a chrome overrun.

If the delta exceeds 15KB at M-06, stop and raise it rather than proceeding into Epic N.

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
| G-01 | Crawl existing site, export URLs | P0 | 0.5d | — | **BLOCKED** | Dev | **Deferred — greenfield, no existing site.** Unblocks only on a separate cutover decision |
| G-02 | Build `redirects/legacy.json` | P0 | 1d | G-01 | **BLOCKED** | Dev | **Deferred with G-01.** File committed empty (`[]`) and wired into `next.config.ts` so the mechanism is testable now |
| G-03 | Implement + test redirects | P0 | 0.5d | — | REVIEW | Dev | Mechanism wired against the empty map; defensive-domain 301s still to add. None to `/` or 404 |
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
| H-01 | Homepage performance ≥98 | P0 | 1.5d | N-01 | TODO | Dev | Lighthouse only — the JS delta is measured at M-06, before Stage 3 pages are built on it |
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
| Q-M16 | **Digital's 100 performance gate and two LCP budgets do not hold under the conditions the specs require.** Measured mobile + 4G, median of 3: Digital performance 0.99 against a 1.0 gate (all three runs); Digital LCP 1895ms against 1600ms; Master LCP oscillates either side of its 1800ms budget across runs. Design and Press pass. **These pages are empty** — one heading, 425 B of route JS — so this is the floor, not a feature overrun: FCP is 1.36s and the LCP element is the `<h1>`, which means the gap is the 100.2KB framework floor plus webfont loading, before a single block of real content exists. The budgets were set against desktop numbers that were never the specified measurement. Three options, all of them the founder's: (a) accept and fund the optimisation at `H-01` — font preloading and `size-adjust` are the obvious first moves and neither is invented content; (b) re-set Digital to 0.99 and the LCP budgets to what an empty page can actually reach, recording the reason as `Q-M12` did for the KB proxy; (c) keep the budgets and accept that CI is red until `N-01`. **No threshold has been lowered pending this decision** — CI fails today, deliberately | Atik | `H-01`, `N-01`, Digital launch |
| Q-M1 | **Company number — still outstanding.** Registered office is confirmed: `30 Briarfield Road, Farnworth, Bolton, BL4 0HD`, England & Wales. Load into `companyDetails` at M-05. The number is the only missing field and it is statutory — `[TK]`, never guessed | Atik | M-05, L-05, 0.10 (number only) |
| Q-M15 | **No favicon or brand mark exists.** `/favicon.ico` 404s on every route; Lighthouse reports it as a console error and it holds best-practices at 0.96. A mark is a brand decision and is not being invented (`master/PROJECT-RULES.md` §11). Supply one — or confirm shipping without a favicon is acceptable and the assertion stays at 0.96 permanently | Atik | Lighthouse best-practices 1.0 |
| ~~Q-M12~~ | **RESOLVED — the metric changed, not the numbers.** JS is now budgeted on the delta above the framework floor, not the total: Master ≤15KB, Digital ≤15KB, Press ≤20KB, Design ≤25KB, estimator/path-finder ≤40KB. The floor (100.2KB) is reported separately so a dependency upgrade shows as a floor change rather than silently consuming feature allowance. **Digital's 100/100/100 gate is unchanged** — Lighthouse scores measured experience, and the 90KB figure was a badly-set proxy for it | Atik | ~~Digital launch~~ unblocked |
| ~~Q-M10~~ | **RESOLVED by default at A-03** — no licence held, so Inter / JetBrains Mono / Source Serif 4 are used, self-hosted via `next/font`. Licensed names deliberately left out of the font stacks. Buying a licence later changes one module in `styles/fonts/` | Atik | ~~A-03~~ |
| ~~Q-M13~~ | **RESOLVED.** Design `--ink-subtle` is `#818180` at **5.01:1** — the first value on the theme's neutral ramp clearing 5.0:1, chosen over the 4.55:1 minimum so a later `--canvas` adjustment cannot push it back under AA. `--line-strong` recorded as decorative-only in `design/DESIGN.md` §5; Button (secondary) moved to `--ink-subtle` because its resting border is what identifies it as a button | Atik | ~~Design theme~~ applied |
| ~~Q-M14~~ | **RESOLVED — CLAUDE.md was the file at fault, not FOUNDATION.** Both shadow tokens stay. The line now reads *"Depth comes primarily from 1px borders and background steps. `--shadow-2` is a hard ceiling; nothing beyond it."* Press book cards use `--shadow-1` by spec, and the Design and Digital rules already cap at `--shadow-2` | Atik | ~~A-05~~ |
| ~~Q-M11~~ | **WITHDRAWN — the programme is greenfield.** No existing site, no cutover, nothing to migrate. The six findings raised under that assumption are recorded closed-not-applicable in `_shared/01-VALIDATION-REPORT.md` §10 rather than deleted | — | — |
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
