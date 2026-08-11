# Validation Report v2 — Gridsmith Websites

**Scope:** 43 files — 4 workstreams (master + three divisions) × 8 files, 4 shared, 7 legal.
**Supersedes v1.** All v1 defects closed; v1 gaps resolved or accepted with a recorded decision.

---

## 1. Changes since v1

| Change | Status |
|---|---|
| Master layer commissioned as a fourth workstream | Done — `master/`, 8 files. Owns the shared foundation, header, footer, consent, canonical case study route |
| Gridsmith Studio → **Gridsmith Digital** | Done — renamed across all files, routes, tokens, schemas, tables and requirement IDs (`FR-S*` → `FR-DG*`) |
| Response commitment set to next business day | Done — single source of truth in `companyDetails.responseCommitment`, propagated to every flow and tracker |
| ALLi dropped | Done — removed everywhere; Press credibility rebalanced onto first-party evidence |
| Canonical six-stage process adopted | Done — `_shared/00-PROCESS.md`; replaces Design's 5-step, Digital's 6-stage and Press's 8-stage |
| G-04 Design drawing estimator | Done — added as P0 (`FR-D21`), with a calibration gate |
| Seed content policy | Done — `00-FOUNDATION.md` §7, with production build enforcement |
| Legal drafts | Done — `_legal/`, 7 documents, drafted against law in force August 2026 |

## 2. v1 items — closed

| ID | Item | Resolution |
|---|---|---|
| D-01 | No consent management | Closed. Full spec at `master/TECH-SPEC.md` §4; self-hosted, deny-by-default |
| D-02 | Upload/link contradiction | Closed. Both flows now links; matches schemas and the IP-handling rationale |
| D-03 | No redirect plan | Closed. Owned by master, `master/IMPLEMENTATION-PLAN.md` Phase 4 |
| G-01 | Speed-to-lead unowned | **Resolved by decision, not by build.** Commitment set at next business day. See §4 |
| G-02 | Digital weak on sample work | Open — see §5 |
| G-03 | ALLi timing | Closed by removal — see §4 |
| G-04 | Design self-serve weakest | Closed. Drawing estimator added as P0 |
| S-01 | Master layer unspecified | Closed. Fourth workstream commissioned |

## 3. Domain architecture — confirmed

**One domain. One application. One deployment.**

```
gridsmith.uk/            master layer
gridsmith.uk/design/     Gridsmith Design
gridsmith.uk/digital/    Gridsmith Digital
gridsmith.uk/press/      Gridsmith Press
```

Not separate websites, not subdomains. Four route groups in one Next.js application, each with its own theme applied by a `data-division` attribute set server-side.

**Why not separate sites:** three codebases triple maintenance, split SEO authority three ways, make cross-division case studies impossible to render, and give the group no coherent centre. Every argument for the master brand is an argument against separate sites.

**Why not subdomains:** `design.gridsmith.uk` is treated by search engines as a substantially separate property. You would build domain authority three times instead of once. Path-based keeps one authority pool while still allowing each division a completely distinct visual identity — which the design specs demonstrate is achievable.

Division domains (`gridsmithdesign.uk` and equivalents) are registered defensively and 301 to their path. Never hosted separately.

## 4. Decisions recorded, with their costs

Both of these are the founder's call and both are defensible. Recording the trade-offs so they are visible later rather than rediscovered.

### 4.1 Next-business-day response
R2 finds that responding within 5 minutes makes a lead **21x** more likely to qualify. The commitment is now *as soon as we can, and always by the end of the next business day*.

**Cost:** most of that 21x multiplier. On a site converting at 4%, this is plausibly the largest single lever left unpulled.

**Why it is still right:** an unmet promise costs more than a modest one, and the specs previously guaranteed only that an alert would arrive — nothing guaranteed a human would act. Promising 5 minutes without a rota would have been theatre.

**Enforcement:** the wording lives once in `companyDetails.responseCommitment` and renders everywhere. Tracker item `H-07` audits all four route groups for any template promising faster. Revisit when the rota can be staffed — even weekday-hours-only same-day would recover a meaningful share.

### 4.2 No third-party accreditation for Press
ALLi is removed. R6-Press established that authors are explicitly taught to check independent ratings, so this removes the one external credibility signal.

**Consequence:** Press now carries its **entire** credibility load on first-party evidence — the books shelf with live retailer links, named clients with recorded consent, published pricing, published exclusions, the rights page, and the honest Path Finder outcomes.

Every one of those becomes load-bearing. There is no external badge compensating if one weakens. In practice this raises the priority of: `O-01` (author consent for 12+ titles), `R-04` (link checking), and `N-04` (the ETH-04 verification gate).

**Open question for you:** was ALLi dropped because you do not want a trade body at all, or because you do not want that one? The Independent Publishers Guild is the obvious UK alternative. If the answer is "no trade body", the above stands and should be worked hard.

## 5. Open items

### O-01 · Digital sample work — still thin (was G-02)
Design has the sample pack, Press has the books shelf and sample assessment. Digital's only sample artifact is the redacted Diagnostic deliverable, on one page. R4.2 finds sample work is the fastest vetting method in all three markets.
**Recommendation:** `/digital/samples` with a redacted Diagnostic output and a real technical spec. ~1.5 days. Not a launch blocker.

### O-02 · No real cross-division project exists
`/approach` argues that one company across three disciplines beats three vendors. The evidence for that is cross-division case studies. Right now there are none, and three seed ones will carry the argument at launch.
**This is a business priority, not a build task.** Winning one genuine cross-division engagement does more for the master brand than any amount of copywriting. Until then, `continuityExample.verified` will be hard to satisfy honestly — and the schema is deliberately built so it cannot be faked.

### O-03 · Group timeline is not stated anywhere
Each workstream's plan is honest in isolation. Nobody has written down that master (8 weeks) + Design (10) + Digital (9) + Press (10) sequentially is roughly **nine months for one developer**, not ten weeks.
**Decision needed:** sequence all four, or bring in help, or launch master + one division and add the others. Launching master + Press first is the strongest option — Press has the most existing revenue, the most existing proof, and the least invented content.

## 6. Legal findings — new, and material

### L-01 · Consumer law applies to Press and was not addressed — **severity: high**
Individual authors and memoir clients are **consumers**. The Consumer Rights Act 2015 and the Consumer Contracts Regulations 2013 apply, and business terms cannot lawfully be used with them.

Most significantly: **a consumer has 14 days to cancel a distance contract.** Canonical process stage 3 starts work on receipt of initial payment, which will usually fall inside that window. Without an express request to start early, a consumer can cancel on day 13 with the work nearly done and be entitled to a full refund.

**Resolved in this revision:** `FR-P24`–`FR-P26` added, `ETH-08` added, `consumer_consents` table added, tracker items `N-16`–`N-20` added, and `_legal/CONSUMER-TERMS.md` §6 drafts the mechanism. The checkbox must be separate, unbundled, never pre-ticked, and recorded with a timestamp.

This was the single most valuable finding of the legal pass and it would have been expensive to discover in a dispute.

### L-02 · PECR penalties increased 35-fold
The Data (Use and Access) Act 2025, in force from 5 February 2026, raised the PECR ceiling from £500,000 to £17.5m or 4% of global turnover. Cookie compliance is now a material financial risk rather than housekeeping. The consent architecture from v1 was already correct; its justification is now much stronger.

### L-03 · New cookie exemptions exist — position taken not to rely on them
The DUAA introduced narrow exemptions including analytics used solely for aggregate statistics. Commentary in 2026 is not uniform on scope, and an opt-out is required regardless.

**Position:** continue requiring consent for GA4 and PostHog. GA4 involves a third party; session replay is not aggregate statistics; the exemptions are untested and the downside is 4% of turnover. Flagged for the solicitor at `_legal/00-LEGAL-BASIS.md` §6 Q1 — if they advise otherwise, measurement coverage improves materially.

### L-04 · Data protection complaints procedure now mandatory
In force 19 June 2026 — already live. Drafted at `PRIVACY-POLICY.md` §12 with a 5-working-day acknowledgement and 30-day response.

### L-05 · Copyright assignment must be in writing and signed
CDPA 1988 s.90(3). Digital's ownership guarantee and Design's deliverable assignment both depend on it. Drafted at `MSA-BUSINESS.md` §8.3 and flagged for the solicitor given contracts are executed electronically.

### L-06 · Website claims must not exceed contract terms
Two live exposures:
- Digital's ownership module says the client owns the code. `MSA-BUSINESS.md` Schedule B3 correctly excludes third-party and open-source components. **The site must say this too.** A blanket "you own everything" would be a misrepresentation.
- Press's rights page must say exactly what Schedule C1/C2 say. Also Schedule C6: using a Gridsmith ISBN prefix makes Gridsmith the publisher of record. The author may not expect that and must be told before signing.

Gates `T-04` (Digital) and `R-07` (Press) already exist for this. They are now the most important gates in the programme.

## 7. Criteria matrix — all four workstreams

| ID | Criterion | Master | Design | Digital | Press |
|---|---|---|---|---|---|
| SC-1 | Visitor→lead ≥4%, instrumented | ✅ | ✅ | ✅ | ✅ |
| SC-2 | Mobile conversion surface | ✅ | ✅ | ✅ | ✅ |
| SC-3 | AI-search segmented, structured data | ✅ | ✅ | ✅ | ✅ |
| SC-4 | Performance budget, CI-enforced | ✅ | ✅ | ✅ 100/100/100 | ✅ |
| SC-5 | Notification <60s; copy states the real commitment | ✅ | ✅ | ✅ | ✅ |
| SC-6 | Pricing on every service page | n/a | ✅ | ✅ | ✅ schema-enforced |
| SC-7 | Process on hub and service pages | ✅ | ✅ | ✅ | ✅ |
| SC-8 | Sample-work access path | n/a | ✅ | ⚠️ O-01 | ✅ |
| SC-9 | Paid entry offer as primary CTA | n/a | ✅ | ✅ | ✅ |
| SC-10 | Named standards, not adjectives | ✅ | ✅ | ✅ | ✅ first-party only |
| SC-11 | Self-serve path to decision | ✅ | ✅ estimator added | ✅ | ✅ |
| SC-12 | WCAG 2.2 AA verified | ✅ | ✅ | ✅ | ✅ |
| SC-13 | Premium direction, no soft-UI | ✅ | ✅ | ✅ | ✅ |
| SC-14 | Objection handling, schema-marked | ✅ | ✅ | ✅ | ✅ |

**✅ 49 · ⚠️ 1 · ❌ 0.**

## 8. Cross-file consistency — re-verified

| Check | Result |
|---|---|
| All Studio references renamed to Digital | ✅ (only "game studio" and "Sanity Studio" remain, correctly) |
| Cross-reference targets resolve | ✅ 4 shared files |
| Process stage counts consistent across four workstreams | ✅ all six, canonical |
| Response commitment consistent | ✅ single source, no template promises faster |
| Case study route canonicalised | ✅ `/work/[slug]` only; division routes are indexes |
| Performance budgets: division ≤ shared baseline | ✅ |
| Every P0 `FR-` has a tracker task | ✅ spot-checked all four workstreams |
| Hard gates appear in both plan and tracker | ✅ 9 gates |
| Legal clause references cited by the sites exist in the drafts | ✅ Schedules B1/B3, C1/C2/C6 |
| Seed enforcement present in schema, tech spec, plan and rules | ✅ |

## 9. Required actions before build starts

| # | Action | Owner | Blocks |
|---|---|---|---|
| 1 | **Send the `_legal/` drafts to your solicitor this week** | Atik | Every legal page; longest lead time in the programme |
| 2 | Decide the group build sequence (O-03) | Atik | Everything |
| 3 | Company number, registered office, ICO registration | Atik | Statutory footer, all four groups |
| 4 | PI insurance scope — confirm engineering drawings are covered | Atik + broker | Design launch |
| 5 | Business hours + phone for the confirmation screen | Atik | Contact flows |
| 6 | Author consent requests for 12+ titles | Atik | Press books shelf |
| 7 | 10 historical projects with final prices | Atik | Digital estimator calibration |
| 8 | 8 past drawing jobs with final prices | Atik | Design estimator calibration |
| 9 | Chartered engineer booked for the drawing matrix | Atik | Design launch |
| 10 | Crawl access to the existing site | Atik | Redirect map |
| 11 | The honest-limits content for `/approach` | Atik | Master launch |
| 12 | Decide: trade body for Press, or none (§4.2) | Atik | Press positioning |

Items 1, 4, 6, 9 and 10 all have external lead times and all sit on critical paths. Starting them this week is the highest-leverage scheduling decision available.

Item 10 is superseded — see §10 below. There is no existing site to crawl.

## 10. Greenfield confirmed — six cutover findings closed as not applicable

During A-01 the build was briefly told that Gridsmith Press was already live and trading.
That is **not the case**: the whole programme is greenfield. Every site launches new,
there is no existing property, and nothing is migrated.

The six findings raised under the cutover assumption are recorded here **closed as not
applicable**, rather than deleted, so that a later session re-reading the specs does not
rediscover them and re-litigate a settled question. If a cutover of any kind is ever
contemplated, this is the checklist to reopen — every item was a real consequence of a
live site, correctly derived, and would apply again.

| # | Finding under the cutover assumption | Status |
|---|---|---|
| 1 | Stage 8 real-content load (week 21) contradicts a week-12 cutover: the production seed check blocks `isSeed` publishing and launch gates 6–7 need real content, so a trading site could not ship on seed | **N/A — greenfield.** Seed content ships at launch as originally specified; real content loads at Stage 8 |
| 2 | Defensive-domain 301s are described as a wildcard (`gridsmithdesign.uk/* → /design/*`); against a live property that would send every earning deep page to a path that does not exist, so a per-URL map would be required | **N/A — the division domains are parked, not trading.** The wildcard is correct for parked domains |
| 3 | `G-01` says "crawl existing site" (singular), as does launch gate 12's "the previous site" | **N/A — nothing to crawl.** `G-01`/`G-02` are `BLOCKED` pending a separate decision; `redirects/legacy.json` ships empty so the mechanism exists and is testable |
| 4 | No rollback plan exists anywhere, and a cutover inverts the risk — it can lose traffic and revenue that already exist | **N/A — a first launch has no traffic to lose.** Worth revisiting only if a migration is ever planned |
| 5 | `L-03`/`L-04` assume first publication of terms; a trading entity has terms already in force and in-flight consumer engagements, and CRA/CCR 14-day rights would reach people already in the pipeline | **Partly retained.** The greenfield case removes the in-flight problem, but the question was already sent to the solicitor as `_legal/00-LEGAL-BASIS.md` §6 Q9. Left in place — it costs nothing to have answered and becomes live the moment there is a second version of the terms |
| 6 | `press/IMPLEMENTATION-PLAN.md` 6.4 "soft launch to past clients" assumes those clients are not already using the live site | **N/A — reads correctly as written** for a first launch |

`O-01` (author consent for ≥12 titles) returns to Stage 4 / Press Epic O, started week 1
for its external lead time, rather than being a Stage 0 blocker.

## 11. Epic A audit — gates that were not measuring their subject

Five findings, one class: **a gate whose specification named an enforcement the
implementation did not perform.** Four were fixed at the audit; the fifth cannot be fixed
and is recorded so nobody tries.

| # | Spec said | Gate did | Resolution |
|---|---|---|---|
| B1 | `check-bundle-size` enforces every route group's JS delta | Enumerated whatever HTML the build emitted. Deleting `digital.html` dropped the tightest-budgeted route and it reported "all routes within their delta budget", exit 0 | Required-route list. Swept all ten gates — **four** could measure less than they claimed |
| B2 | `check-contrast` gates the token/surface rules from FOUNDATION §3 | Covered three tokens; the A-05 sweep had measured nine. `--accent` measured 4.46:1 on Digital's `--canvas-sunken`, below the AA body floor, and the number was published in FOUNDATION §3 itself | Permission matrix — 101 cells, every token against every surface |
| B3 | "axe zero violations" covers the kitchen sink | axe-core keeps `duplicate-id` behind its `deprecated` tag, so no WCAG tag set reaches it. 80 duplicate ids, a radio group spanning four theme frames and an exclusive `details` group doing the same — all green | Ids scoped per frame; `check-axe` asserts the three conditions against the served DOM |
| B4 | `PROJECT-RULES.md` §8 (×4), `CLAUDE.md` and FOUNDATION §8 all name LHCI as the enforcement for LCP, INP and CLS | Asserted four category scores and no metric at all, on a desktop preset with no throttling, where the specs say 4G | Split into desktop and mobile axes; Vitals asserted directly on mobile — FOUNDATION §8 |
| **B4b** | **The same three files named LHCI as the enforcement for INP** | **No gate can do this and none ever could** | **See below** |

### INP cannot be asserted in lab conditions

INP is a **field** metric. It measures the latency of real interactions by real users
across a session. A Lighthouse *navigation* run loads a page and does not interact with it,
so it produces no INP value — there is nothing for an assertion to read. This is a property
of the metric, not a gap in the tooling, and no amount of configuration changes it.

**Total Blocking Time is the lab proxy** and is what CI asserts, with each route's TBT
ceiling set to that route's own INP budget: 200ms everywhere, 150ms on Digital. TBT
correlates with INP but is not the same quantity — it measures main-thread blocking during
load, not the responsiveness of a tap three minutes later.

**Real INP has to come from field data.** Nothing in CI stands in for that, and it must not
be recorded as if it did. Once there is traffic, INP comes from CrUX or from
PostHog/Vercel Analytics, consent permitting — which is itself a constraint worth noting,
because a consent-gated measurement covers consented sessions only (`_shared/00-FOUNDATION.md`
§6 makes the same point about `is_ai_referral`).

This entry exists because "the spec names an enforcement that does not exist" is the same
defect as B1–B4, and listing four of five would repeat the error the class describes.

### A sixth, found while diagnosing B4: the measurement method was mis-attributing

Lighthouse's default mobile throttling is `simulate` (Lantern), which models LCP as gated
on the resources the LCP element depends on. For text with `font-display: swap` it adds
the webfont fetch to the estimate, even though swap means the text has already painted in
the fallback face. Measured on `/digital`, median of 3, identical 4G profile:

| Method | FCP | LCP | Gap | Performance |
|---|---|---|---|---|
| `simulate` | 1363ms | 1896ms | 533ms | 0.99 |
| `devtools` | 1441ms | **1441ms** | **0ms** | **1.00** |

The gap is an artefact. `next/font`'s fallback metrics (`size-adjust`, `ascent-override`)
make the fallback paint the final layout, which is why CLS is 0 and why real Chrome never
re-reports LCP. Had this not been checked, the gate would have failed builds for a delay no
visitor experiences and someone would have spent a day optimising it. **Verify what a
measurement is modelling before treating its output as a fact about the site.**

## 12. A fifth defect class — the gate is right and the number is wrong

§11 lists four defects of one class: **the gate did not do what its specification said.**
Every one of them is findable by reading the spec next to the code. That is a comparison
between two documents, and it has a blind spot.

**A gate can measure correctly, faithfully, exactly as specified — and still produce a
number that is not true of the site,** because the *model* generating the number is wrong.
No amount of gate-versus-spec checking finds this. The gate matches its spec perfectly.
Only **number-versus-reality** finds it, and that means measuring the same quantity a
second time by an independent method.

### The rule

> **When a measurement is surprising, verify it by a second, independent method before
> acting on it.** A number that does not match your mental model of the system is either a
> real defect or a broken measurement, and the two are indistinguishable from inside the
> measurement. Acting on the first reading is how a team spends a week optimising an
> artefact.

"Surprising" is the trigger, and it is a low bar on purpose: a figure that seems too good,
a gap between two metrics that should be identical, a result that changes when nothing
changed, a budget that fails on an empty page.

### The worked example — Lantern vs devtools throttling

The Epic A audit found `/digital` reporting FCP 1363ms and LCP 1896ms. The page's only
content is one `h1`. Those should be the same paint, and a 533ms gap on a page with nothing
in it is exactly the kind of number that should stop someone.

It was investigated as a site defect — the working hypothesis was that the framework floor
plus webfont loading was pushing LCP out, and the instruction given was to treat the gap as
real. Both the hypothesis and the instruction were wrong, and everything about the gate was
correct: right URL, right throttle profile, right metric, right assertion, median of three.

The model was wrong. Lighthouse's default mobile throttling is `simulate` (Lantern), which
estimates timings from a dependency graph rather than observing them. Lantern treats the
LCP text node as depending on its webfont and adds the font fetch to the LCP estimate —
even though `font-display: swap` means the text has already painted in the fallback face
and the visitor is reading it.

Re-measured with `throttlingMethod: 'devtools'` — real Chrome, real throttling, same 4G
profile, same page, median of 3:

| Method | FCP | LCP | Gap | Performance |
|---|---|---|---|---|
| `simulate` (Lantern) | 1363ms | 1896ms | 533ms | 0.99 |
| `devtools` (observed) | 1441ms | **1441ms** | **0ms** | **1.00** |

The gap does not exist. Digital holds 100 under real mobile 4G. Two independent signals in
the original run already pointed at the model rather than the site, and neither was read
that way at the time: **Speed Index was identical to FCP** (nothing changed visually after
first paint, so nothing painted late), and **CLS was exactly 0.000** (the fallback paint
was already the final layout, so the swap could not have produced a new LCP candidate).

### What this costs when it is missed

Had this gone unverified: a CI gate failing on a delay no visitor experiences; a
performance budget lowered or a P0 feature cut to satisfy it; and an engineer spending days
preloading fonts and inlining CSS to move a number that was never measuring the site. The
budget change would have been recorded as a measured decision and inherited by all four
route groups.

### How to apply it

- Treat `simulate` and `devtools` as two instruments, not one with a flag. Where a lab
  number drives a decision, take it on both.
- Prefer the observed method when a metric feeds an assertion, and say why in the config —
  `lighthouserc.mobile.cjs` does.
- Cross-read metrics that constrain each other. FCP vs Speed Index vs LCP, or CLS vs a
  claimed layout shift, will often disagree with a broken model before a human does.
- A number nobody can explain is not evidence. Explain it or re-measure it.

This class is distinct from the four in §11 and is listed separately so it is not filed as
another instance of "the gate did not match the spec". It did.

## 13. A sixth defect class — the gate cannot run where it matters

§11 is *gate ≠ spec*, found by reading two documents together. §12 is *number ≠ reality*,
found by measuring twice by different methods. This one is neither.

**A gate can be correct, match its specification exactly, produce true numbers — and be
structurally unrunnable in the environment that actually decides.** It passes locally
because the developer's machine grants a capability the runner does not, and it reports
nothing at all when the runner denies it. Reading the gate will not find this. Re-measuring
will not find this. Only running the gate in the target environment finds it.

### The rule

> **CI is the source of truth for gate results. A local pass is a smoke test, not
> evidence.** Any gate that depends on an environment capability must assert that
> capability explicitly and fail loudly when it is absent — never assume it, and never let
> its absence read as a skip.

### The worked example

`check-axe` and `check-responsive` called `puppeteer.launch({ headless: true })` with no
arguments. Chrome's sandbox needs user namespaces that GitHub's runners do not grant, so
Chrome aborted on launch with a register dump instead of a readable error.

**Eleven of eleven gates were green on Windows. Two of them could never have executed on
`ubuntu-latest`.** The two Lighthouse configs already passed `--no-sandbox` as
`chromeFlags`, so of the four browser launch sites in the repository, exactly the two
without the flag were the two that failed — and the split was invisible until CI ran.

The audit that produced §11 and §12 was conducted entirely on a developer machine and
reported eleven green gates. That report was wrong about two of them, and no amount of
further local work would have revealed it.

### The sweep — every gate audited for environment assumptions

Prompted by the above, and covering more than the browser sandbox.

| # | Assumption | Finding | Status |
|---|---|---|---|
| E1 | **Node major** | Local runs were on **v20.20.2** while `.nvmrc`, `engines` and CI all say 22, and §2 of FOUNDATION records Node 20 as end-of-life since April 2026. `engines` is advisory — npm ignores it without `engine-strict`. Every gate in the Epic A audit ran on a forbidden runtime and nothing said so | **Fixed** — `.npmrc` sets `engine-strict=true`; `npm ci` now refuses with `Required: {"node":">=22.11.0"} Actual: v20.20.2` |
| E2 | **Chrome sandbox** | 2 of 4 browser launch sites lacked `--no-sandbox` | **Fixed** — both Puppeteer gates now pass `--no-sandbox --disable-dev-shm-usage` |
| E3 | **Locale-dependent ordering** | `check-bundle-size` sorted routes with `localeCompare`, whose result depends on `LC_ALL` and on whether the Node build carries full ICU. Display order only — the over-budget test is order-independent — but a gate whose output shifts with the machine's locale makes laptop-vs-runner log diffs noisy | **Fixed** — codepoint comparison |
| E4 | **Line endings** | No `.gitattributes`. The repo relied on each machine's `core.autocrlf`; a contributor configured differently could commit CRLF, after which the same file differs by platform. All four scanning gates already split on `/\r?\n/` and would survive, which is why this had not bitten yet | **Fixed** — `.gitattributes` pins `* text=auto eol=lf` plus binary types |
| E5 | **Filesystem case sensitivity** | The highest-risk candidate, given this repo's `%5F` handling. Verified end to end: on disk `%5Fkitchen-sink`, referenced in HTML as `%255Fkitchen-sink`, and `decodeURIComponent` yields `%5Fkitchen-sink` with the hex digits' case preserved as literal characters. Exact match on a case-sensitive filesystem, and empirically confirmed — CI run #2 passed the bundle-size step on `ubuntu-latest` | **Clean** |
| E6 | **Path separators** | `check-bundle-size`, `check-no-hardcoded-colors` and `check-service-role-key` all normalise through a `toPosix` helper before matching; `check-tokens` uses `sep` for display only. No gate compares a raw platform path against a literal | **Clean** |
| E7 | **Environment variables** | Three are read — `AXE_BASE_URL` (×2) and `VERIFY_PORT` — and all three have defaults. No gate requires a variable that exists on a developer machine and not on a runner | **Clean** |
| E8 | **Number formatting** | Only `toFixed`, which is locale-independent. No `toLocaleString`, no `Intl` | **Clean** |
| E9 | **Working directory** | `with-server.mjs` spawns `node_modules/next/dist/bin/next` by relative path, so it assumes the repo root. npm scripts and the CI step both guarantee that; it would break only if invoked from elsewhere | **Noted, not fixed** — no caller can currently do it |
| E10 | **The runtime assertion itself** | E1's fix was `engine-strict`, and it is not enough. It fires only during an install — `npm run <anything>` never checks — so once `node_modules` exists every gate runs unchecked, which is exactly how the audit happened. Worse, **`engines` is a floor and `.nvmrc` is a pin**: `>=22.11.0` is satisfied by Node 24 and 26, so a machine on 24 while CI is on 22 passes `engine-strict` silently and diverges by a major with every check green | **Fixed** — `scripts/check-node-version.mjs` matches the running major against `.nvmrc`, wired as `preinstall` **and** into `verify:static` so it fires with or without an install. **A fix that does not cover its own originating case is a pattern worth checking for: `engine-strict` was adopted to close E1 and would not have caught the E1 scenario. When adopting a fix, verify it would have caught the specific defect that prompted it.** |
| E11 | **Orphaned MSI record** | Windows' installed-programs database carries a `Node.js 24.15.0` entry with an empty `InstallLocation` and no payload — `C:\Program Files\nodejs` does not exist. It is what makes the Node 22 MSI refuse ("a later version is already installed"), and it is unrelated to what actually runs, since PATH resolves solely to nvm's symlink | **Left alone, deliberately** — cosmetic, and `MsiExec /I` against a GUID whose payload is gone is risk for no gain. Recorded so the next person who meets the refusal does not spend an afternoon on it |

### What this costs when it is missed

The Chrome instance cost one red CI run and an hour. **E1 is the expensive one.** Had it
gone unnoticed, every measurement in §11 and §12 — the bundle floor, the 5.7KB primitive
delta, every contrast ratio, both Lighthouse tables — would have been taken on a Node major
the project forbids, and the first person to notice would have had to decide whether to
re-derive all of them. A runtime mismatch does not announce itself; it produces plausible
numbers from the wrong machine.

**Consequence, deliberately accepted:** `npm ci` now fails on any machine not running Node
≥22.11.0, including the one this audit was performed on. That is the rule working. Install
Node 22 (`.nvmrc` names it) before running the gates again.
