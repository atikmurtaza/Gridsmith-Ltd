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

**Thirteen checks, and `npm run verify` runs all of them.** It once ran five and said
nothing about the other five — the three needing a build and the two needing a server. CI
ran everything, so merges were safe; a developer running the script named "verify" got half
the coverage with no indication of it, which is the same unearned confidence as a gate that
measures nothing. The two Lighthouse axes cannot run on Windows (VALIDATION §13 E12) and
say so loudly in the summary rather than failing quietly — CI runs them.

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

**A-10b was re-based at the Epic A audit, and then split in two.** The original gate was
doing two jobs and doing neither properly — it was a desktop-only run standing in for a
specification that says "on 4G throttle", asserting four category scores and no metric at
all while three spec files named it as the enforcement for LCP, INP and CLS.

| Axis | Conditions | Asserts | Question |
|---|---|---|---|
| **Desktop** | `preset: 'desktop'`, median of 3 | Category scores. Digital 100/100/100 | Is the craft claim honest? |
| **Mobile** | 4G, 4× CPU, `devtools` throttling, median of 3 | LCP, CLS, TBT directly. **Not** the performance score | Does it hold on a real phone? |

**Nothing was lowered.** A second axis was added. The mobile axis omits the performance
category on purpose: it is a weighted curve whose control points move between Lighthouse
versions, so pinning it fails builds for reasons no user experiences.

**INP is absent from both axes because no lab gate can produce it** — it is a field metric.
TBT is the proxy at the same ceiling. `_shared/01-VALIDATION-REPORT.md` §11.

**The throttling method was itself a defect.** See `Q-M16`: Lighthouse's default `simulate`
model attributes the webfont fetch to a `font-display: swap` text LCP and reports a 533ms
delay that does not exist. Under real throttling `/digital` measures FCP 1441ms = LCP
1441ms, performance 1.00. Verify what a measurement models before treating it as a fact.

**⚠ Open risk, recorded against Stage 3.** FOUNDATION §8.

### Measured on `ubuntu-latest` — CI run #3, median of 3, both axes green

These supersede the developer-machine figures, which were indicative only. **These are the
numbers the Stage 3 LCP budgets get set from.**

**Desktop** — `preset: 'desktop'`, simulate, 10240kbps / 40ms RTT / 1× CPU, Lighthouse 12.6.1

| route | perf | a11y | best-pr. | seo | LCP | CLS | TBT | FCP |
|---|---|---|---|---|---|---|---|---|
| `/` | **1.00** | 1.00 | 0.96 | 0.90 | 512ms | 0.000 | 0ms | 268ms |
| `/design` | **1.00** | 1.00 | 0.96 | 0.90 | 501ms | 0.000 | 0ms | 265ms |
| `/digital` | **1.00** | 1.00 | 0.96 | 0.90 | 441ms | 0.000 | 0ms | 267ms |
| `/press` | **1.00** | 1.00 | 0.96 | 0.90 | 503ms | 0.000 | 0ms | 265ms |

**Mobile** — 4G, devtools throttling, 1638.4kbps / 150ms RTT / 4× CPU, Lighthouse 12.6.1

| route | perf | a11y | best-pr. | seo | LCP | budget | CLS | TBT | FCP |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 0.99 | 1.00 | 0.96 | 0.90 | **1524ms** | 1800 | 0.000 | 85ms | 1524ms |
| `/design` | 0.99 | 1.00 | 0.96 | 0.90 | **1523ms** | 2000 | 0.000 | 86ms | 1523ms |
| `/digital` | 0.99 | 1.00 | 0.96 | 0.90 | **1520ms** | 1600 | 0.000 | 83ms | 1520ms |
| `/press` | 0.99 | 1.00 | 0.96 | 0.90 | **1526ms** | 2000 | 0.000 | 84ms | 1526ms |

Three things this run settles.

1. **LCP equals FCP exactly on all four mobile routes.** The Lantern artefact is confirmed
   independently on CI hardware, not just on one laptop. Under real throttling there is no
   FCP→LCP gap at all — see `_shared/01-VALIDATION-REPORT.md` §12.
2. **Mobile performance is 0.99 on every route, Digital included.** Had the mobile axis
   asserted the performance category, CI would be red right now on a page with one heading
   in it. The split was load-bearing rather than tidy-minded: the category score is a
   weighted curve, and the Vitals underneath it all pass comfortably.
3. **Digital's headroom is ~80ms, not ~160ms.** CI is roughly 75ms slower than the dev
   machine, so the empty-page floor is 1520ms against a 1600ms ceiling. Every mobile LCP
   figure across all four route groups sits within 6ms of the others, which is the signature
   of a fixed floor rather than of per-route content.

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
| M-08 | Scope `@font-face` CSS per route group | **P2** | 0.5d | — | TODO | Dev | Font **files** are already scoped — `/digital` fetches one `.woff2`. The **declarations** are not: `styles/globals.css` is imported by all four root layouts, so every route ships all three families' `@font-face` blocks (22, of which a division uses ≤8). ~29KB of render-blocking CSS at roughly a third useful. Not a correctness problem, but it is bytes on the critical path and FOUNDATION §4 overstated the scoping until it was corrected. Fix is per-route-group CSS entry points instead of one shared import. **Re-measure both Lighthouse axes** — it touches the font layer, see FOUNDATION §4 |

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
| G-08 | **Map the existing Press site's URLs before it comes down** | **P1** | 1d | — | TODO | Dev | The one migration obligation that survives the greenfield decision. The existing Press site trades throughout the build and **is switched off at launch**, so every indexed URL 404s on day one unless mapped. **Data, not architecture** — `redirects/legacy.json` is committed empty and wired into `next.config.ts`, so this is populating a file the mechanism already reads. **Do not crawl or plan yet**: the founder supplies the URL inventory before Stage 8 (`Q-M8`). Unmappable URLs go to the nearest Press hub, never to `/` and never to a 404 (FOUNDATION §6). Verified at press `6.6` |

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
| ~~Q-M16~~ | **RESOLVED for the budgets; one observation stays open.** The mobile LCP ceilings are **measured, not provisional** — CI run #7 on `ubuntu-latest`, Node 24, median of 3, devtools throttling: 1522 / 1521 / 1522 / 1526ms across `/`, `/design`, `/digital`, `/press`. A 6ms spread on byte-identical empty pages is a fixed floor, not per-route content. **Digital has 78ms of headroom against its 1600ms ceiling.** The Lantern artefact that produced the original 533ms FCP→LCP gap is settled (VALIDATION §12) and LCP now equals FCP exactly on all four routes. **Still open, and carried into Stage 3:** (a) 78ms of LCP headroom is measured on a page containing one `h1` — hero imagery, work grids and book covers all produce a larger and later LCP element, so re-measure at the first Stage 3 route rather than at `H-01`, when the remedy would be cutting a page feature to pay for a floor; (b) **TBT is runner variance, not a Node 24 regression — corrected.** It was reported as a monotonic rise (83–86 → 87–98 → 104–107ms) on three runs; runs #9 and #10 came in at 81–86ms and 88–93ms, so the Node 24 spread (81–107ms) contains the Node 22 band entirely and there is no runtime effect. Under 4× CPU throttling TBT is CPU-bound and LCP is network-bound, which is why TBT moves ±13ms while LCP holds within 11ms. Lighthouse was 12.6.1 throughout, so no version drift. Digital's real headroom is ~55ms against a ±13ms band, on an empty page — re-measure at Epic M, and compare `benchmarkIndex` before reading any future TBT move as a code change | Atik | Stage 3 re-measure |
| Q-M1 | **Company number — still outstanding.** Registered office is confirmed: `30 Briarfield Road, Farnworth, Bolton, BL4 0HD`, England & Wales. Load into `companyDetails` at M-05. The number is the only missing field and it is statutory — `[TK]`, never guessed | Atik | M-05, L-05, 0.10 (number only) |
| Q-M15 | **No favicon or brand mark exists.** `/favicon.ico` 404s on every route; Lighthouse reports it as a console error and it holds best-practices at 0.96. A mark is a brand decision and is not being invented (`master/PROJECT-RULES.md` §11). Supply one — or confirm shipping without a favicon is acceptable and the assertion stays at 0.96 permanently | Atik | Lighthouse best-practices 1.0 |
| ~~Q-M12~~ | **RESOLVED — the metric changed, not the numbers.** JS is now budgeted on the delta above the framework floor, not the total: Master ≤15KB, Digital ≤15KB, Press ≤20KB, Design ≤25KB, estimator/path-finder ≤40KB. The floor (100.2KB) is reported separately so a dependency upgrade shows as a floor change rather than silently consuming feature allowance. **Digital's 100/100/100 gate is unchanged** — Lighthouse scores measured experience, and the 90KB figure was a badly-set proxy for it | Atik | ~~Digital launch~~ unblocked |
| ~~Q-M10~~ | **RESOLVED by default at A-03** — no licence held, so Inter / JetBrains Mono / Source Serif 4 are used, self-hosted via `next/font`. Licensed names deliberately left out of the font stacks. Buying a licence later changes one module in `styles/fonts/` | Atik | ~~A-03~~ |
| ~~Q-M13~~ | **RESOLVED.** Design `--ink-subtle` is `#818180` at **5.01:1** — the first value on the theme's neutral ramp clearing 5.0:1, chosen over the 4.55:1 minimum so a later `--canvas` adjustment cannot push it back under AA. `--line-strong` recorded as decorative-only in `design/DESIGN.md` §5; Button (secondary) moved to `--ink-subtle` because its resting border is what identifies it as a button | Atik | ~~Design theme~~ applied |
| ~~Q-M14~~ | **RESOLVED — CLAUDE.md was the file at fault, not FOUNDATION.** Both shadow tokens stay. The line now reads *"Depth comes primarily from 1px borders and background steps. `--shadow-2` is a hard ceiling; nothing beyond it."* Press book cards use `--shadow-1` by spec, and the Design and Digital rules already cap at `--shadow-2` | Atik | ~~A-05~~ |
| ~~Q-M11~~ | **PARTLY REOPENED — the greenfield decision was over-broad.** The build is greenfield: nothing migrates, no content, no functionality, no database, and there is no cutover. But **the existing Press site is live and trading and comes down at launch**, so it has indexed URLs that 404 on day one unless mapped. Five of the six findings in `_shared/01-VALIDATION-REPORT.md` §10 stand; finding #3 ("nothing to crawl") is wrong for Press and is corrected there. Tracked as `G-08` (P1) | Atik | `G-08` |
| Q-M2 | Solicitor engaged and drafts sent | Atik | L-04 |
| Q-M3 | ICO registration | Atik | L-06 |
| Q-M4 | PI insurance scope — engineering drawings covered? | Atik + broker | L-08 |
| Q-M5 | Business hours and phone number for the confirmation screen | Atik | N-12 |
| Q-M6 | A real continuity example — a client served across divisions or over time | Atik | N-05 |
| Q-M7 | The honest limits — when should someone use a specialist instead? | Atik | N-04 |
| Q-M8 | **Existing Press site URL inventory** — the indexed URLs that must be mapped before the site is switched off at launch. Founder supplies before Stage 8; no crawl or planning until then | Atik | `G-08` |
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
