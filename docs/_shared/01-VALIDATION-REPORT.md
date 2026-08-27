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

Every one of those becomes load-bearing. There is no external badge compensating if one weakens. In practice this raises the priority of: `O-01` (author consent for 12+ titles), `R-04` (link checking), and `K-04` (the ETH-04 verification gate).

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

**Resolved in this revision:** `FR-P24`–`FR-P26` added, `ETH-08` added, `consumer_consents` table added, tracker items `K-16`–`K-20` added, and `_legal/CONSUMER-TERMS.md` §6 drafts the mechanism. The checkbox must be separate, unbundled, never pre-ticked, and recorded with a timestamp.

This was the single most valuable finding of the legal pass and it would have been expensive to discover in a dispute.

### L-02 · PECR penalties increased 35-fold
The Data (Use and Access) Act 2025, in force from 5 February 2026, raised the PECR ceiling from £500,000 to £17.5m or 4% of total annual worldwide turnover, whichever is higher. **Cited 26 Aug 2026:** PECR reg. 31 and Sch. 1 para. 18(b)(ii), applying DPA 2018 s. 157(2)(a) and (5) — a reg. 6 breach is in the higher-maximum list. Full entry and the tiering at `_legal/02-CITATION-LEDGER.md` `L-PECR-PENALTY`. Cookie compliance is now a material financial risk rather than housekeeping. The consent architecture from v1 was already correct; its justification is now much stronger.

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

**That was right, and this section was over-broad — corrected.** The *build* is greenfield:
nothing migrates, no content, no functionality, no database, and there is no cutover in the
sense of moving a running system. But **Gridsmith Press does have a live site, it trades
throughout the build, and it is switched off at launch.** It therefore has indexed URLs
that 404 on day one unless they are mapped.

Five of the six findings below stand. **Finding #3 does not** — there is something to
crawl, and it is tracked as `G-08` (P1) in the master tracker. The correction is recorded
here rather than by rewriting the row, because the row is the reason the question looked
settled and a later session needs to see why it was reopened.

The six findings raised under the cutover assumption are recorded here **closed as not
applicable**, rather than deleted, so that a later session re-reading the specs does not
rediscover them and re-litigate a settled question. If a cutover of any kind is ever
contemplated, this is the checklist to reopen — every item was a real consequence of a
live site, correctly derived, and would apply again.

| # | Finding under the cutover assumption | Status |
|---|---|---|
| 1 | Stage 8 real-content load (week 21) contradicts a week-12 cutover: the production seed check blocks `isSeed` publishing and launch gates 6–7 need real content, so a trading site could not ship on seed | **N/A — greenfield.** Seed content ships at launch as originally specified; real content loads at Stage 8 |
| 2 | Defensive-domain 301s are described as a wildcard (`gridsmithdesign.uk/* → /design/*`); against a live property that would send every earning deep page to a path that does not exist, so a per-URL map would be required | **N/A — the division domains are parked, not trading.** The wildcard is correct for parked domains |
| 3 | `G-01` says "crawl existing site" (singular), as does launch gate 12's "the previous site" | **~~N/A~~ — WRONG, corrected.** There *is* one site to crawl: the existing Press property, which comes down at launch. `redirects/legacy.json` shipping empty and wired was the right call and makes this data rather than architecture. Tracked as `G-08`; inventory supplied by the founder before Stage 8 (`Q-M8`) |
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
| E12 | **A gate that cannot run locally at all** | After the move to Node 24, both Lighthouse axes fail on Windows: every audit completes, then `chrome-launcher`'s `destroyTmp` races Node 24's `fs.rmSync` cleaning up the temp Chrome profile and the process exits 1 with `EPERM`. **Deterministic across three consecutive runs, with an unchanged lockfile** — `npm ci` reinstalled the identical dependency tree, so the runtime is the only variable, and the same command passed repeatedly on Node 20 on the same machine. Not a site defect: the measurements are taken, only the cleanup fails, and `ubuntu-latest` is unaffected | **Made explicitly unavailable, not left failing** — `scripts/check-lhci.mjs` prints a loud `SKIPPED` and exits 0 on local Windows, and `with-server` repeats it in the run summary rather than leaving it in the scrollback. **The skip is guarded in both directions**: reaching it with `CI` truthy, or off Windows, is a hard failure, so it can never spread to the runner or become permanent by accident. Remove it when a `chrome-launcher` release fixes the race, and re-verify locally |
| E13 | **A destructive operation that inspected only its top level** | Removing Node 20 after the runtime move, `nvm uninstall` failed and I ran `Remove-Item -Recurse -Force` on the version directory. A top-level look had shown `node.exe` and `node_modules`, and that was treated as having looked at the subject. Inside `node_modules` was a global `@anthropic-ai/claude-code` install, which the recursive delete destroyed before erroring on a locked file | **Rule adopted** — see below. Damage was confined to a superseded npm-global copy already off PATH; the CLI in use is desktop-app managed and was untouched. Restored with `npm install -g @anthropic-ai/claude-code` under Node 24 |

### What this costs when it is missed

The Chrome instance cost one red CI run and an hour. **E1 is the expensive one.** Had it
gone unnoticed, every measurement in §11 and §12 — the bundle floor, the 5.7KB primitive
delta, every contrast ratio, both Lighthouse tables — would have been taken on a Node major
the project forbids, and the first person to notice would have had to decide whether to
re-derive all of them. A runtime mismatch does not announce itself; it produces plausible
numbers from the wrong machine.

**Consequence, deliberately accepted:** `npm ci` now fails on any machine not running Node
≥24.15.0, including the one this audit was performed on. That is the rule working. Install
Node 24 (`.nvmrc` names it, `engines` says `>=24.15.0 <25`, and CI runs 24) before running
the gates again. **This paragraph said "Node 22" until 12 August 2026** — the runtime was
raised to 24 mid-audit and this instruction was not, so anyone following it broke the
build. A floor in `engines` cannot catch that, which is why `scripts/check-node-version.mjs`
now asserts that `.nvmrc`, `engines` and `ci.yml` name the same major.

### Why E12 was skipped rather than left red

A check that is known to fail for a reason unrelated to the code is worse than one that
does not exist. It teaches everyone that red is sometimes fine, and the next failure —
the one that is about the code — inherits that permission. "Oh, that's just the EPERM
thing" is a sentence that eventually gets said about something real.

Explicit unavailability is the safer shape: the gate states that it did not run, names why,
names the condition under which it should be restored, and makes the summary say so out
loud. What it must never do is decay into a permanent exemption, which is why reaching the
skip path on CI or on a non-Windows platform is a hard failure rather than a no-op. A skip
that can spread is not a skip; it is a hole with a comment on it.

**Upstream, for whoever removes this:** the fault is in `chrome-launcher`'s `destroyTmp`
(`chrome-launcher.js:367`) calling `fs.rmSync` on the temp profile directory before Windows
has released Chrome's handles. It is not Lighthouse's own code and not this repository's.
Watch for a `chrome-launcher` release that adds retry/`maxRetries` handling there; when one
lands, delete `scripts/lhci-availability.mjs`'s Windows branch, run both axes locally, and
record the result here.

### E13 as a class — inspect the whole subject, not its top level

**A destructive operation must inspect its full subject, not its top level.**
`Remove-Item -Recurse -Force` after checking one directory level is the destructive
analogue of a gate that passes without measuring: the check ran, and the subject was never
examined. The recursion reaches everything; the inspection reached one level.

Before any recursive delete, **enumerate what is actually inside**. Global npm packages,
tool installs, credentials and lockfiles live *inside* `node_modules`, not beside it — a
directory listing that shows `node_modules` as a single entry has told you nothing about
330MB of content under it.

**Worked example.** Node 20's nvm directory listed as two entries: `node.exe` and
`node_modules`. That looked like an empty runtime. `node_modules` contained a global
`@anthropic-ai/claude-code` install — a 258MB binary — which the delete destroyed. The
damage was survivable because the CLI actually in use is managed by the desktop app and
lives elsewhere, but that was luck rather than diligence.

**The tell**: the same command run with the same flags is safe or catastrophic depending
entirely on what is underneath, and the operator cannot know which without looking. Any
step whose blast radius is invisible from where you are standing needs the enumeration
first.

**Standing rule for this project.** No recursive delete outside the repository working tree
without telling the founder first and listing what it contains. Inside the repo, `.next/`
and `node_modules/` are regenerable and fine to remove without ceremony. Outside it — home
directories, tool installs, version-manager trees, anything under `AppData` or `Program
Files` — enumerate, report, and ask.

### §12 applied to the analyst — the TBT non-trend

§12 says a surprising measurement must be verified by a second, independent method before
being acted on. It was written about a tool. It applies at least as much to the person
reading the tool, and it was broken here by the person who wrote it.

Mobile TBT across CI runs on byte-identical pages: **83–86 → 87–98 → 104–107 → 81–86 →
88–93ms**. The first three were reported as "consistently in one direction… a Node 24
runtime characteristic rather than noise", which prompted an escalation from observation to
finding. The fourth and fifth points returned to and below baseline. The Node 24 spread
(81–107ms) **contains the Node 22 band entirely**. There was never a trend.

Three points ascending is not a trend; it is three points. The claim that it could not be
noise rested on "byte-identical pages", which rules out the *site* as the cause and says
nothing about the *machine* — and the machine was the variable nobody had recorded.

**What the data actually shows.** Under `devtools` throttling at 4× CPU, TBT is CPU-bound
and LCP is network-bound (fixed 1638kbps / 150ms RTT shaping). Shared CI runners vary in
CPU; the network shaping does not. TBT moving ±13ms around ~90ms while LCP holds within
11ms across five runs is the signature of runner variance, and it was visible in the
existing numbers before any new instrumentation.

**What was missing.** Nothing in the logs recorded the machine, so "did the host change or
did the site?" was unanswerable from the evidence — which is why a guess filled the gap.
`scripts/lhci-report.mjs` now prints Lighthouse's own host `benchmarkIndex` and the Chrome
user agent beside every metric table. A future TBT movement gets checked against the host's
measured speed instead of narrated.

**The rule, sharpened.** Before calling a sequence a trend, ask what would falsify it and
whether enough points exist to see that. Before attributing a change to a cause, name the
variables that were *not* held constant — here, the runner — rather than only the ones that
were. A confident causal story from three points is the analytic form of a gate that passes
without measuring.

### The launch model, and what it changed

**Decided:** everything goes live at once, after Stage 8, when real content is loaded.
Nothing ships partially. The existing Press site trades until launch and is switched off at
it.

This retires the staged-exposure plan (`02-BUILD-SEQUENCE.md` §1) and with it the entire
basis of the original build order, which sequenced Press first because Press was the most
*launchable*. With launch sequencing gone, order is proposed by **risk** instead — highest
unknowns and tightest gates earliest, so failures surface with time to absorb them. Proposed
order Master → Digital → Design → Press, pending confirmation.

**Confirmed differently, and the order in that sentence is superseded.** The founder
confirmed **Master → Digital → Press → Design** — `02-BUILD-SEQUENCE.md` §1 and
`05-HANDOVER.md` §8 both record it, and BUILD-SEQUENCE marks it "Confirmed by the founder".
Press is third so the section with real existing customers is not left in the tail. The
proposal is kept for the reasoning that produced it; **it is not the build order.**

**The one thing it does not change is Epic A**, which is why this was recorded rather than
acted on: Epic A's exit gate is unaffected by anything downstream of it, and A-GATE
criteria 5 and 6 are still outstanding.

Worth noting for the record that this is the second time a stated premise about the Press
site has moved — first "already live and trading", then "greenfield, no existing property",
now "greenfield build, live site that retires at launch". None of the three was a mistake by
the person stating it; the premise genuinely refined. The lesson is narrower and worth
keeping: **a premise recorded as settled should say what it is settled *about*.** §10
originally closed a question about migration and phrased the answer as a fact about the
world ("there is no existing property"), which is what made it wrong later. Scope the claim
to the decision it supports.

---

## 14. Gates whose subject could slip out from under them — the second sweep

**Date:** 12 August 2026 · **Runtime:** Node v24.15.0 · **Trigger:** `06-EPIC-A-AUDIT.md`

§11 named this class and recorded four instances closed. The Epic A audit found three
more, one of them *inside `check-axe`* — the gate written to close the class. So it is not
a defect list that was worked through once. **Treat it as a standing property of this gate
suite:** every gate is either given a required list it does not derive from its own
subject, or it is a gate that can pass having measured less than it claims.

All fourteen gates were swept against two questions: *does it derive its expectation from
the thing it is checking?* and *does it narrow its own subject?* Nine needed a change.

### What was wrong, and what it is now

| Gate | Defect | Fix |
|---|---|---|
| `lint:colors` | Named colours matched only **immediately after a colon**. `border: 1px solid red` — the codebase's own idiom — passed. `color-mix()` was absent from the colour-function list | Declaration-value mask spanning newlines; the word is flagged anywhere in a value and nowhere in a selector or comment. `color-mix` added |
| `lint:colors`, `lint:secrets` | `PENDING_ROOTS` named one absent tree (`lib`) while the docstring claimed "a new tree cannot arrive unscanned". `public/`, `lighthouse/` and every root-level config file were outside both sweeps | Inverted. `scripts/source-files.mjs` enumerates what is on disk and **fails on any top-level directory that is neither scanned nor excluded with a reason**. Root-level files are enumerated, not listed. 62 → 72 files |
| `check:tokens` | `declared` was scraped from `tokens.css` and checked against the build — expectation and subject were the same file, floor `length === 0`. Four tokens deleted, exit 0 | Hardcoded 39-token `REQUIRED` list, checked both directions, exactly as the 15-token theme `CONTRACT` already was |
| `check:tokens` | The duration-literal sweep read `app/` and `components/` but **not `styles/`** — the layer it protects | `styles/` added; `styles/tokens.css` exempted as the declaration site, same shape as the colour gate's token-layer exemption. 6 → 11 files |
| `check:contrast` | `EXPECTED_CELLS` computed from the `USE` table the loop iterates. `PAIRS` — the 29 published DESIGN.md figures — had **no count assertion at all** | Both are literals: `EXPECTED_PAIRS = 29`, `EXPECTED_CELLS = 101` |
| `check:axe` | One viewport (1280px), one state (scrolled to the foot). **No route was ever audited in the state a visitor first meets**, and 1280px is where `StickyCta` is `display: none` | 375/1280 × initial/scrolled. 5 → 24 analyses |
| `check:axe`, `check:responsive`, `size` | `/_not-found` appeared in **exactly one place in the repository** — an exemption in `check-bundle-size` | In all three route lists, with an expected HTTP status per route. Exemption deleted |
| `check:theme` | Matched the literal `data-division`. `el.dataset.division = 'press'` never emits that string, and the gate's own comment calls this check the load-bearing one | Both spellings |
| `lint:secrets` | Fired only when the file itself opened with `'use client'`. A plain module imported by a client component ships in the bundle unflagged; `next.config.ts` was outside the scanned trees, and its `env:` key inlines into every client bundle | Greps `.next/static/chunks` for the key — a leak is a property of the bundle, not a shape in the source. Moved to `verify:build`; a missing build directory is a hard failure |
| `check:node` | Its own message ends *"they are three statements of one fact and a split between them is what this check exists to prevent"*. It read `.nvmrc` and nothing else | Asserts `.nvmrc`, `package.json` engines and `ci.yml` name the same major |
| both Lighthouse axes | Neither asserted that the page **loaded**. A themeless Next 404 scores 1.0 accessibility and clears every LCP/CLS/TBT ceiling | `http-status-code` asserted on both |
| `size` | Downward floor drift caught at ±1KB; upward drift caught only once growth exceeded the *smallest budget* | Symmetric: the cheapest route in the build is the empirical floor. It does **not** diagnose the cause, because two different causes give an identical measurement |

### Proven by deliberate failure — every one, this session

CLAUDE.md: *"Every gate must be proven by deliberate failure before it is trusted, and the
proof recorded."* The audit's sharpest observation is that this had been satisfied
*formally*: `lint:colors` had a proof, and that proof used `color:` and a hex — **both of
which it already caught**. A proof that exercises only the forms a check catches proves
nothing. Each proof below uses a shape that previously escaped.

| Fix | Deliberate failure | Result |
|---|---|---|
| `lint:colors` value mask | `border: 1px solid red`, `outline: 2px dashed black`, `box-shadow: 0 0 0 1px navy`, `linear-gradient(to right, teal, gold)`, `color-mix(… white 20%)`, and `crimson` on the **continuation line** of a multi-line `transition:` | 8 violations, exit 1. `.gold { }` as a selector not flagged — no false positive |
| `check:tokens` required list | Deleted `--text-3xl` and `--shadow-2` from `tokens.css` — the two the audit used, chosen because one is FOUNDATION §3's named Tailwind-collision hazard and the other is CLAUDE.md's shadow ceiling | Named both, exit 1. Previously: "35 base tokens", exit 0 |
| `check:tokens` `styles/` root | `transition: opacity 450ms ease` in `styles/themes/press.css` | Flagged, exit 1. Previously outside the sweep entirely |
| `check:contrast` counts | Removed one published `PAIRS` row and one `USE` token | "measured 28 … expected 29" and "89 cells, expected 101", exit 1. Previously both counts fell together and it exited 0 |
| `check:axe` initial state | `aria-hidden={!visible}` restored on `StickyCta` with its links still focusable — the A-1 shape minus `inert` | `aria-hidden-focus` at **375px initial and 1280px initial only**. The old gate ran *scrolled* alone and would have been green |
| `check:axe` 375px | A contrast failure inside `@media (max-width: 767px)` | `color-contrast` at **375px only**. The old gate ran 1280px alone |
| `check:axe` route list | *(No injection needed.)* Adding `/_not-found` for the first time | 4 violations × 4 — `html-has-lang` (**Level A, WCAG 3.1.1**), `landmark-one-main`, `region`. See below |
| `check:responsive` reserve | Restored the modelled `calc(2.75rem + var(--space-6) + …)` | "a **95px** fixed bottom bar is covered by only **68px** of scroll-padding-block-end" — the exact discrepancy the audit found by hand, now measured by a gate |
| `check:node` three-way | `ci.yml` changed to `node-version: '22'` | "the runtime is declared in three places and they disagree", exit 1 |
| `size` upward drift | *(No injection needed.)* A root `not-found.tsx` importing the `Link` primitive | Every route 100.2 → 104.5KB, exit 1. See below |

Every temporary edit was made by copying the file aside and copying it back — never
`git checkout --`, which cost three files' worth of work last session (§13). The working
tree was verified clean against `git status` after each.

### Two live defects the fixes found immediately

**1. The 404 shipped without a `lang` attribute.** `/_not-found` had never been audited by
anything. The first axe run against it returned `html-has-lang` — **WCAG 3.1.1, Level A** —
plus no `main` landmark. With no `app/layout.tsx` (A-04: four root layouts), an unmatched
URL fell outside all four and got Next's default bare document. `app/global-not-found.tsx` (then `app/not-found.tsx`) now
renders the master shell itself; verified in a real browser as a single `<html lang="en-GB">`
carrying `data-division="master"`, one `<main>`, status 404. Two other arrangements were
built and measured first and are recorded in that file so nobody re-tries them.

**2. That fix then cost 4.3KB gz on every route in the site, and only the new symmetric
floor check said so.** The 404 imported the `Link` primitive, which wraps `next/link`, a
Client Component — and Next puts the root not-found boundary in **every** route's script
list. Every route went from 100.2KB to 104.5KB: **29% of Digital's entire 15KB delta
budget**, permanently, for a page almost nobody reaches. Every per-route budget still
passed, because 4.3KB is inside all of them. Replaced with a plain `<a>` (measured back to
exactly 100.2KB) and the ESLint rule scoped off for that one file, with the numbers, in
`eslint.config.mjs`.

Both are the same lesson from opposite ends: **a gate you have not run is not measuring
zero, it is measuring nothing.**

### One place the fix is deliberately partial

`RadioGroup` generates its DOM ids but **not** its `name`. On a radio, `name` is
simultaneously the form contract a Server Action reads and the attribute that makes the
options one group — generating it would break both. So `/_kitchen-sink` still scopes that
one prop per theme frame, and only that one. It is not a leftover workaround for a
primitive defect: four frames sharing `name="division"` genuinely *are* one radio group,
which is a fact about a page that renders the same form four times. `check-axe` asserts no
radio group spans more than one frame, which is what keeps the distinction honest.

### A fifteenth instance, found while pushing the fourteen

`with-server.mjs` polled until *something* answered 200 on port 3000 and then ran every
served gate against it. Another project’s dev server was on that port, and `check-axe`
reported two critical `label` violations and a missing `data-division` on `/` — against
an application that is not this one. A false red, which is the harmless direction.

**The dangerous direction is a stale `next start` of this app.** It answers 200 on every
route, serves the previous build, and turns all four served gates green against code that
is no longer in the tree. Nothing in the output would have said so.

The port is now a precondition checked before spawning, and `ready()` additionally
requires the response to contain `data-division=` — 200 is not enough, it has to be this
application. Proven by deliberate failure: with the foreign server up, the gate refuses to
run and names the port; on `VERIFY_PORT=3100` the same commands pass.

This is the same class as the other fourteen, and it was found by the class being fresh in
mind rather than by any check. That is the argument for treating it as a standing property
of the suite rather than a list that was worked through.

---

## 15. A seventh defect class — the exclusion that was correct when it was written

**21 Aug 2026. Found by CI's first completed run since 13 August, which was the same defect.**

### The fifth U+0008

A literal U+0008 sat at `.github/workflows/ci.yml:92`, inside the comment introducing
`check:control` — the gate written for this exact byte — put there by the same commit that
added the gate (`4e988114`). YAML 1.2 forbids C0 controls anywhere in the stream, comments
included, so GitHub could not parse the workflow. Every push from 13 to 21 August died at
startup in 0s with zero jobs, no annotation and no log. `npm run verify` passed locally the
whole time, so the tree read green.

Instances one to four are recorded at `M-P2-23`. This is the fifth, and the first that cost
anything.

### What makes it distinct

The first four were the byte defeating a *reader* — a regex that could never match, invisible
in every rendering anyone looks at. `check:control` was built to end that, and it did: it
would have caught this byte on sight.

**It never saw the file.** `sourceFiles`' `NOT_SOURCE` excludes `.github` with the reason
*"workflow YAML — no colours, no keys"*, and its extension set had no `yml`. Both were true
of the two gates that list was written for — `check-no-hardcoded-colors` and
`check-service-role-key`. Neither is true of a gate added afterwards that reads bytes rather
than meaning.

So the class is not "an exclusion was wrong". The class is:

> **An exclusion carries the reasons of the gates that existed when it was written. A gate
> added later inherits it silently, and the reason attached to it is no longer the whole
> question being asked.**

An exclusion is a *negative* assertion, and nothing ever re-examines one — a scanned tree
produces output that can be read, and an excluded tree produces nothing at all. `NOT_SOURCE`
even requires a written reason for each entry, which is the strongest form of the guard
anyone had thought to build, and it did not help: the reason was accurate and it was
answering a question no longer being asked.

### Same shape as the role-true-by-scope defect

`check:rls`'s unbounded role capture read `to anon using (true)` as the role `"anon using"`,
which matches no role name, so a deliberate `anon` SELECT policy passed. Both defects are a
**predicate that is true only within the scope it was written for, applied outside it and
still reporting cleanly.** There the scope was the shape of the SQL the author had in mind;
here it is the set of gates the exclusion was written for. In neither case does the check
fail — it succeeds, having narrowed its subject without saying so.

### The fix, and its limit

`sourceFiles` now takes `extraRoots`, so a gate opts into a tree the colour and secret sweeps
skip; `check:control` passes `['.github']` and its extension set covers `ya?ml` and `md`.
Proven by appending a probe line to `ci.yml`: 1 hit, exit 1; removed, 0 hits, exit 0 — the
count moves, so the file is genuinely reached.

**The limit is that this fixed the instance.** `NOT_SOURCE` still holds eleven entries whose
reasons were written for two gates, and nineteen gates now exist. Re-reading each exclusion
against each gate is the sweep this class calls for and it has not been done.

### The diagnosis before it — one signal, confidently wrong

The 20 August session diagnosed the outage and **cleared the file**. Its evidence was a
`workflow_dispatch` API call answering `422 Workflow does not have 'workflow_dispatch'
trigger`, reasoned as: GitHub must have parsed the file to enumerate its triggers, therefore
the file parses, therefore the cause is a billing or minutes block. That reasoning was
written up at length and acted on — the repository was made public to remove the limit, which
changed nothing.

**The inference does not hold.** `workflow_dispatch` is registered from the **default
branch**, and `main` carries no workflow file at all. An unparsed file on a feature branch
returns exactly the same 422. The reply was consistent with both hypotheses and was read as
evidence for one.

**What settled it was a control**, not a better reading of the same signal: a minimal
hello-world workflow pushed to the same repository on the same commit succeeded in 7s
(`32431419718`) while `CI` failed in 0s (`32431418552`). One push, two workflows, one
variable — the file.

This belongs in this document because it is the analyst's version of §12 and §14: **a single
signal interpreted against a mental model produces a confident answer and no way to tell a
right one from a wrong one. A control produces a difference.** The cost of the wrong answer
was eight days of CI silence and one irreversible repository visibility change made for a
reason that turned out to be false.

---

## 16. `M-P2-35` — every exclusion, re-read against every gate

**21 Aug 2026.** §15 named the class and fixed one instance. This is the sweep.

Nineteen gates run. **Only three consult `NOT_SOURCE` at all**: `check:control`,
`check-no-hardcoded-colors`, `check-service-role-key`. The other sixteen carry their own
subject lists — globs, single files, or a directory they own — so `NOT_SOURCE` cannot hide
anything from them. That narrows the sweep to twelve entries × three gates, and it is the
first useful finding: the blast radius was smaller than "eleven exclusions, nineteen gates"
suggested, and it was still enough to take CI offline for eight days.

### The twelve entries

| Entry | Written for | Colours | Secrets | Bytes | Verdict |
|---|---|---|---|---|---|
| `.git` | both | ✓ | ✓ | ✓ | **correct** — not authored |
| `node_modules` | both | ✓ | ✓ | ✓ | **correct** — not authored |
| `.next` | both | ✓ | ✓ | ✓ | **correct**, and load-bearing: `check-service-role-key` and `check-tokens` sweep `.next` *deliberately*, by their own path. Excluding it from the source walk is what stops it being counted twice |
| `.lighthouseci` | both | ✓ | ✓ | ✓ | **correct** — gate output, gitignored |
| `.sanity` | both | ✓ | ✓ | ✓ | **correct** — CLI cache, gitignored |
| `.vercel` | both | ✓ | ✓ | ✓ | **correct** — CLI link state, gitignored |
| `.github` | both | ✓ | ✓ | **✗ was hiding the fifth U+0008** | **fixed** — `check:control` opts in |
| `docs` | both | ✓ | ✓ | **✗ was hiding a sixth** | **fixed** — see below |
| `public` | both | correct **by accident** | **correct by accident** | ✗ | **fixed** for bytes; see the two accidents below |
| `supabase` | both | ✓ | correct **by accident** | ✗ | **fixed** for bytes |
| `redirects` | both | ✓ | ✓ | ✗ | **fixed** for bytes — low stakes, but the reason given ("URL mapping data") answers the colour question, not the byte one |
| `.claude` | both | correct **by accident** | **correct by accident** | ✗ | **fixed** for bytes |

### The sixth U+0008, found by this sweep

`docs/master/PROJECT-TRACKER.md:2731`, inside the `M-P2-22` row — the row that **announces
`check:control` as the gate for this class** — quoting the `check-axe` defect verbatim with
the literal backspace still in it. `docs` is excluded, so nothing had ever looked. Escaped.

The count is the proof: `check:control` reported **0 in 135 files** with `docs` excluded
while the byte was sitting in it, and reports **0 in 203 files** now. A clean result from a
scan of 135 files and a clean result from a scan of 203 read identically in a log.

### Two exclusions that are correct by accident

Correct-by-accident matters because the next commit can end it without anyone noticing.

- **`public/` is excluded from `check-service-role-key`.** It holds one file today,
  `500.html`. It is the *most* dangerous tree in the repository for a leaked key — everything
  in it is served verbatim to anyone — and it is excluded with the reason *"served verbatim,
  never bundled"*, which is the argument for scanning it, restated as the argument against.
  It is clean today for two independent reasons that are both accidents: the tree holds one
  hand-written file, and the gate's extension set is `ts|tsx|js|jsx|mjs|cjs`, so a `.html`
  file would not match even if the tree were scanned. **Add one `.js` to `public/` and the
  gap is live.** Not fixed here because fixing it properly means changing what
  `check-service-role-key` considers source, which is a wider change than this sweep, and
  because the load-bearing `.next/static/chunks` sweep is unaffected. Logged as `M-P2-37`.
- **`.claude/` is excluded from both.** Agent definitions, never shipped, so a colour or a
  key there reaches no user. True — but the reason recorded is *"agent definitions"*, which
  is a description of the tree, not an argument about either question.

`supabase/` is the same shape for secrets: `.sql` is outside the gate's extension set, so
the exclusion is redundant rather than load-bearing there.

### Is this gateable?

**Partly, and the part that matters is not.**

What *can* be asserted mechanically already is: every top-level directory is either scanned
or excluded with a written reason — `sourceFiles` fails the build on an unclassified tree,
which is why no tree has ever arrived unscanned. That is the shape a gate can check.

What cannot be asserted is **whether a reason is still the whole question**. The reason is
prose written about the gates that existed at the time; "no colours, no keys" was true when
written, is true now, and was never the question `check:control` asks. Deciding that requires
knowing what each gate is for, and no check can hold that.

Two half-measures were considered and rejected as the kind of gate this document exists to
warn about:

1. *Require each `NOT_SOURCE` entry to name the gates its reason covers, and fail when a new
   gate appears.* This asserts that someone edited a list, not that they thought about it.
   The predictable outcome is a name appended to twelve entries in one commit.
2. *Scan the excluded trees anyway and warn.* That is not an exclusion; it deletes the
   feature and floods the log with `node_modules`.

**So: this is a periodic review, not a gate, and saying so is the honest answer.** The
structural mitigation actually taken is narrower and real — **an exclusion list should be
per-question, not per-repository.** `sourceFiles` now takes `extraRoots`, so a gate states
which trees it needs rather than inheriting a list assembled for someone else's question.
That does not prevent the class; it makes each gate's own answer visible at its own call
site, where the person adding a gate is already looking.

The review itself: **when a gate is added, re-read every exclusion against it.** That
sentence is the whole of the control, and it is worth exactly as much as the next person's
willingness to do it — which is the accurate valuation, and better than a green check that
implies more.

### §16 addendum — `M-P2-37` closed, and what the accident actually was

The `public/` exclusion is fixed, and the fix is wider than the exclusion: it is not that
one tree was missing from a list, it is that **`check-service-role-key` had no notion of a
served static asset at all.** Its three checks covered source and bundled output. A leak
reaches a browser by one of two routes — the bundler inlines it, or a file containing it is
returned verbatim — and only the first had a sweep.

That is why removing `public` from `NOT_SOURCE` would not have fixed it. The gate's `SOURCE`
regex is `ts|tsx|js|jsx|mjs|cjs`; `public/500.html` would still not have matched. **Two
independent narrowings, either of which alone hid the tree.** The correct-by-accident
verdict in the table above understated it: there were two accidents, and the sweep found one.

The new sweep therefore carries no extension filter. The chunk sweep filters to `.js`
because only scripts execute in a chunk directory; nothing analogous is true of a directory
whose entire contents are addressable by URL. Filtering there would have reproduced the
second accident inside the fix for the first.

Proven in all three directions the rule requires: a shaped key in `public/leak-probe.js`
fired one violation and exit 1; removing it returned clean and exit 0; emptying `public/`
and then deleting it both fail loudly rather than reporting a clean sweep of nothing.


---

## 17. `M-P1-12` — the class, found in the harness rather than in a gate

Every gate defect this programme has recorded lived inside a gate: a predicate that could
not match, a subject below the fold, a filter that swallowed a route, an expectation read
from its own subject, a summary line over a loop that did not exist. This one is in
`scripts/with-server.mjs` — the harness that starts the server and runs the five served
gates — and it is the same class one layer down: **a process reporting something other than
what happened.**

### What it was

`with-server` refuses to run when something is already listening on its port, because a
stale server answers every route and turns every served gate green against a build that is
not in the tree. The refusal is correct and it is not new. What it did on the way out was
exit **127**, printing a libuv assertion over its own message:

```
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 76
```

127 is the shell's *"command not found"*. A CI log ending in 127 reads as a broken
invocation, not as a gate declining to measure, and the sentence explaining the refusal is
buried underneath a C assertion. The failure was real; the report of it was wrong.

### What it was not

**It never exited 0, and `npm run verify` has always failed here.** It was first written up
in this session as *"exits 0, so verify reports success having measured nothing"* — which
would have made it the most serious gate defect on the list. That reading came from

```
npm run verify:served 2>&1 | tail -80
```

A shell pipeline's exit status is its **last stage**. `tail` succeeded, so the pipeline
reported 0 while the script reported 127. The number was real and it was a number about
`tail`.

This is worth more than the bug. `| tail`, `| head` and `| grep` are how a long gate run is
made readable, and every one of them replaces the status of the thing being measured with
the status of the thing doing the reading. It belongs beside the stale-build rule in
`CLAUDE.md`, and for the same reason: **the tell is not visible in the output, so the fix is
to remove the possibility.** Read an exit code from the process.

### The seventh instance of the class, written into the report describing the class

The code fence above holds `src\win\async.c`. Writing it produced a literal **U+0007 BEL**
where `\a` was intended, and `check:control` caught it in the same run that verified the fix.

That is the seventh instance of the escape-sequence-as-control-byte defect in this repository
(§15 was the fifth, §16 the sixth) and the first that is U+0007 rather than U+0008 — the byte
follows the letter, so the class is the escape, not the character. The mechanism is identical
every time: a backslash passing through one more layer of string processing than the author was
counting. Here it was a Python heredoc writing Markdown; before, a JavaScript regex. `\w`
survived because no such escape exists, `\a` did not, and both were in the same word.

**The first attempt to fix it produced three more.** The correction was written through the
same heredoc, so `\a` in the replacement text became BEL exactly as it had in the original —
one byte became three, and `check:control` reported 3 where it had reported 1. The fix that
worked does not write a backslash at all: it builds one from `chr(92)`, which no layer can
reinterpret.

It renders identically. Nothing in the diff looks wrong. Nothing in the rendered Markdown looks
wrong. `check:control` is the only reason none of the four is in the file — and the argument
for that gate is now made by it catching its own documentation twice, rather than by a
paragraph asserting it would.

### Two wrong diagnoses before the right one

Recorded because the wrong ones were the plausible ones.

| Hypothesis | Change | Result |
|---|---|---|
| `AbortSignal.timeout()` leaves an uncancelled libuv timer | explicit `AbortController` + `clearTimeout` | still 127 |
| the response body is an undrained stream holding a socket | `await res.arrayBuffer()`, then `await res.body.cancel()` | still 127, both ways |
| **undici's keep-alive socket** — `fetch` does not close the connection, and an abrupt exit while it is open aborts the process on Windows | replace the probe with a raw TCP `connect` that destroys its own socket | **exit 1, no assertion** |

### The part that was not the goal

A TCP probe answers the question the guard actually asks — *is anything bound to this port* —
and it is strictly more conservative than the HTTP probe it replaces. A listener that never
speaks HTTP still stops `next start` binding, and `fetch` could not see one: pointed at a
bare `net.createServer()`, the old probe reported the port free, spawned a server that could
not bind, and sat in `ready()`'s 90-second poll until the run was killed at five minutes. The
new probe refuses it in milliseconds.

So the fix removed a second defect nobody had reported, in a probe that had been read several
times without anyone noticing it could only detect listeners polite enough to answer.

### Proofs

Exit codes read from the process, never through a pipe.

| Case | Expected | Result |
|---|---|---|
| occupied port | refuse, exit 1 | exit 1, 0 commands run, 0 assertions, message intact |
| `npm run verify:served` on that port | fail | exit 1 |
| free port | proceed | exit 0, the command ran — the guard is reached, not always-on |
| bare TCP listener | refuse | exit 1, 0 commands run *(old probe: hung, killed at 5m)* |

The free-port row is the one that matters most. A guard that refuses everything would pass
the first two rows and be indistinguishable from a working one — the same shape as a count
that cannot be made to move.

### What surfaced it

Nothing systematic. A stale `next start` of this app happened to be holding 3000 during the
palette session on 22 August. The guard fired, correctly, and the exit code was noticed only
because the number looked wrong.

The same session then took the file's own advice — *"run on another port: VERIFY_PORT=3100"* —
and hit the guard again, on an **unrelated project's** Next server. Had the guard not existed,
`check-axe`, `check-launch`, `check-responsive` and both Lighthouse runs would have audited
that application and reported the results as this site's. That is not a hypothetical: it is
the 12 August incident in §13, repeated on the port this file recommended as the way around
it. The message now names a port with nothing on it and says what the risk is.

**Neither port collision was found by a check. Both were found by a guard firing and someone
reading the output.** There is no gate over the harness, and this is the argument for one
existing rather than a claim that one does.

## 18. The homepage mark, variant B — rejected on the measurement, and three defects found on the way

A second homepage mark was built alongside the shipped one: an inline SVG, out of flow,
travelling through the page's empty regions on a CSS scroll timeline and ending assembled. Zero
JS, `@supports`-guarded, reduced-motion-safe, CLS 0.0000 — every constraint met. It was
**rejected, and not on taste.**

### 18.0 The finding, which is about the layout and not about the mark

Where a floating element may go is a property of the page. `scripts/mark-freespace.mjs` measures
it: at every 24px of scroll, at 375, 768 and 1440, it records the ink boxes of every visible text
run (`Range.getClientRects()` — line boxes, not element boxes, so a paragraph whose last line is
three words long does not claim the whole container width). `scripts/mark-path.mjs` then solves
for a path whose **linear interpolation** clears all of it, because linear interpolation is what
CSS draws between keyframes.

On `/`:

| | Regions free at **every** scroll position |
|---|---|
| 1440 | two 60px gutters, and nothing else |
| 768 | none |
| 375 | none |

And under a speed cap of 5x the scroll rate or below — the mark moving no more than five pixels
per pixel of scroll, which is already fast — **there is no path at any size at any of the three
breakpoints.** The paths that do exist need caps of 7x to 20x and are 70/196/101px wide: at 1440
the largest admissible mark is a 101px sliver that hugs the left edge. A verified run of
`check-mark-overlap` against the best of them is clean over 1131 scroll positions, which is the
point — the constraint was satisfiable and the result was still not worth having.

**Density is the design.** The register is tactile brutalism with tight internal density and
generous whitespace *between* blocks, not around them, and the measurement is what that choice
looks like from the outside. This is a **layout decision, not a mark decision**: the next
proposal for a floating, sticky or parallaxed element on `/` does not need a new argument, it
needs to overturn this map. `npm run mark:measure` and `npm run mark:solve` regenerate it; the
JSON is deliberately not committed, because it is ~3MB and is only true of the layout that
produced it.

The scripts are kept for that reason. `check-mark-overlap.mjs` is kept as a **tool and not a
gate** — it has no standing subject now, it is out of `verify` and out of CI, and `MARK_ROUTE`
has no default so it cannot one day run green against a route with nothing on it.
`check-mark-cls.mjs` stays a real gate on `/`, whose subject outlived the variant.

### 18.1 The instrument lying about its own subject

`check-mark-overlap` reported **253 text overlaps at 375 against a path that was correct.**

A scroll-driven animation is sampled off the main thread. A `getBoundingClientRect()` taken
synchronously after `window.scrollTo` therefore returns the element's **previous** position, and
in this case returned the scroll-336 position for the entire rest of the document — the gate saw
a frozen mark, dragged it across the whole page in its arithmetic, and reported the collisions
that would have caused.

This is the fifth-class defect (§12: *the gate is right and the number is wrong*) with the
subject one layer further out. Every earlier instance measured the wrong thing about a real
subject; this measured a **stale** subject, which is worse, because the number it produced was a
plausible number of a real quantity. The fix is two `requestAnimationFrame`s after each scroll.

**The part worth keeping: it failed loudly here and would have been believed anywhere else.** A
screenshot taken the same way is stale in exactly the same way and says nothing about it. Any
instrument that reads geometry after a programmatic scroll of a scroll-driven animation is
reading the previous frame unless it waits, and screenshots are the common case.

### 18.2 The observer that had never been shown able to report

`check-mark-cls` printed `CLS 0.0000` for every route and viewport, and that was the correct
answer. It was also, at that moment, **unearned**: nothing had established that the
`PerformanceObserver` was wired up, that `layout-shift` entries were reaching the accumulator, or
that the accumulator was being read. A silent observer prints the same `0.0000`.

This is §14's rule — *any gate whose output is a count must be provable to report a different
number* — arriving in the one shape where the failure is invisible by construction, because the
success value of a CLS check **is** zero. Every other count in this repository can be seen to
move when the subject moves; this one looks identical whether it is working or dead.

`MARK_CLS_PROBE=1` inserts a block at the top of the document that grows one frame later. With
it on, every row reports 0.37/0.29/0.21 and fails. The probe is committed, in the gate, and named
in its docstring.

### 18.3 Route-level exclusion is not import-level exclusion

The variant lived at `/gridsmith-mark-b`, a `page.probe.tsx` route, absent from a production
build by the `pageExtensions` mechanism in §15/§16. Its component was rendered from a shared
`HomepageBody` behind `mark === 'travel'`.

`/` shipped **8.4KB of keyframes it never used**, and it survived a probe-excluded production
build.

CSS modules are collected at **import** time, not at render time. A static `import` in shared
code puts the stylesheet in the module graph of every route that imports that code, and no
amount of conditional rendering, dead-code elimination or route exclusion removes it: the route
was genuinely gone, and its stylesheet was genuinely still linked from `/` — the route with the
tightest budget on the site.

**This is the same shape as `Numeric` living in `Table.tsx`**: an exclusion that is correct at
the boundary it names and silent about the boundary that actually carries the cost. §15 and §16
swept exclusions against *gates*; this is an exclusion swept against the *module graph*, and the
rule generalises — **an exclusion is only as good as the graph it cuts.** Ask which graph, not
which route.

The fix was to pass the element in as a slot from the probe route so `/` never imports it, and
the proof was a probe-excluded build with no `markTravel` in any emitted stylesheet. The variant
is deleted now and the instance stands regardless of it.

---

## 19. `M-P1-14` — an eighth defect class: the gate covers CI's path, not the deploy's

Every exclusion swept in §15 and §16 was an exclusion *within* a build — a route left out, a
file filtered, a stylesheet still linked. §18 generalised it to the module graph. This one is a
layer further out again, and it is the largest: **the gate list and the deploy are two different
pipelines, and nothing asserted they were the same one.**

### 19.1 What Vercel actually runs

Asked of the system rather than inferred, per CLAUDE.md. `get_project` on
`prj_kfFxGWf0ai1VYAGICYfVvNn0QYYN` (team `team_OVquiVuYynOepnUnaMAgcQnP`) and the build log for
`dpl_Bvr712Dpw7PDTd6AAoYVudfKGKja` (commit `a322c272`) agree:

```
Running "vercel build"          Vercel CLI 59.3.0
Detected Next.js version: 15.5.23
Running "npm run build"
> next build
```

No Build Command was set in the dashboard — the log shows the framework default, and an
override would have printed the override string. **The repo and the dashboard did not disagree,
but nothing was stopping them from disagreeing**, which is the second half of the finding.

One cosmetic discrepancy worth recording rather than acting on: the project object reports
`"framework": null` while `vercel.json` declares `"framework": "nextjs"`. `vercel.json` wins and
detection worked, so this is a stale dashboard field, not a live fault.

### 19.2 The exclusion

`check:launch` is the gate behind non-negotiable #4, *never let seed content reach production*.
It lived in `verify:served` and in `ci.yml`. **`verify:served` runs in CI and nowhere else.**
Vercel's build is `next build`. So the deploy has never run the seed gate, on any deployment,
ever.

Production was not unprotected — it was protected by something else, which is worse, because
nobody chose it. Every `target: production` deployment since 19 Aug is `ERROR`, failing at

```
Error: No companyDetails document in dataset "production". Every page renders the
statutory footer, so the build cannot proceed without it.
```

thrown by `getCompanyDetails()` while prerendering `/_not-found`. That throw fires on an
**empty** dataset. **A production dataset seeded with placeholder content is not empty.** It
would have satisfied the throw, built green, and published `[SEED] GB123456789` as the
company's VAT registration number on every page — the precise outcome `check:launch`'s live
tier exists to prevent, defeated by an environment CI cannot see. Third time that sentence has
been written in this repository (`M-P1-2`, `M-P1-7`, now this).

### 19.3 The live tier had no subject at all

Separately, and just as bad. `check-launch-content.mjs` was a top-level-`await` script that
fetched before it asserted, so the only subject its assertions ever had was whatever the live
dataset happened to contain — and the live dataset has never held a `[SEED]` marker or a
published seed record. The zero-tolerance rule had **never been observed to fire**, while
printing `N published seed document(s) counted` on every run. CLAUDE.md names this exactly: *a
summary line is not evidence a check ran.*

### 19.4 The fix

| Where | What | Why there |
|---|---|---|
| `package.json` `prebuild` | `npm run check:launch:build` | npm runs `prebuild` before `build`, so it is in the path that actually deploys. Smallest hook that needs no new build wrapper |
| `vercel.json` `buildCommand` | `"npm run build"` | The npm lifecycle only fires when the build is entered through npm. A dashboard Build Command of `next build` would bypass `prebuild` silently; `vercel.json` takes precedence over the dashboard, so this pins it |
| `scripts/check-node-version.mjs` | asserts both of the above still exist | `walk()` follows `npm run` chains from `verify`. `prebuild` is an implicit lifecycle hook in no chain, so the parity gate would have gone on reporting that verify and CI run the same set while the deploy ran neither |
| `scripts/launch-content-rules.mjs` | `evaluate()`, pure | Splits the predicate from the fetch so a committed specimen can reach it |
| `scripts/check-launch-content.selftest.mjs` | 11 committed specimens | The permanent subject. Runs in `verify:static` and CI |

**`--build` mode reads `NEXT_PUBLIC_SANITY_DATASET`, and that is not a regression to
`M-P1-7`.** `M-P1-7` was a CI runner reading its *own* environment while asserting about a
*deployment* — two machines, two values. In `--build` mode there is no other system: the
process is a child of the build that is about to run `next build`, in the same environment
`next.config.ts` reads to decide what the app connects to. *Ask the system you are asserting
about.* Served mode still asks the running site's `x-gridsmith-dataset` header and is unchanged.

An unset variable is a hard failure in both modes, never a default.

### 19.5 Which gate fired — the window, established rather than assumed

Two things can now fail on a bad production dataset, so the proof had to land where only one
of them can. It does so by construction: `getCompanyDetails()` throws on a dataset with **no**
`companyDetails` singleton, and the seeded subject has a complete one. The ordering settles it
independently — `prebuild` runs to completion before `next build` starts, so `getCompanyDetails`
is never reached.

Subject: the `development` dataset, which holds **real seeded content** — 121 published seed
documents and `vatNumber: "[SEED] GB123456789"` — with `PRODUCTION_DATASET` in
`sanity/project.ts` temporarily redirected to it, then reverted. A scratch dataset could not be
used: the gate's `isLive` predicate keys off the literal name `production`, Sanity has no
rename, and writing `[SEED]` content into the real `production` dataset was out of scope by
instruction.

```
$ NEXT_PUBLIC_SANITY_DATASET=development npm run build

> gridsmith@0.1.0 prebuild
> npm run check:launch:build

check-launch-content: 2 problem(s) in dataset "development"
  (established from this build's NEXT_PUBLIC_SANITY_DATASET)

  vatNumber carries a [SEED] marker and the dataset is live: "[SEED] GB123456789"
  121 published seed document(s) in the live dataset. Fabricated case studies reaching
  production is the most damaging content failure available to this project (TECH-SPEC §6).
  ...

EXIT=1
```

Exit code read from the process, not through a pipe (`M-P1-12`). `grep -c "Creating an
optimized production build"` over the full log returns **0** — `next build` never started — and
`grep -c "No companyDetails document in dataset"` returns **0**, so the throw is confirmed
absent. **It is the seed gate that fired.**

### 19.6 The count moves

Same code path, same live tier, two real datasets:

| Dataset | `publishedSeeds` | Seed problem raised |
|---|---|---|
| `development` (redirected to live) | **121** | yes |
| `production` (live, empty) | **0** | no |

Specimens `MANY` (121), `ONE` (1) and `ZERO` (0) hold the same three points in the committed
subject, so the number is proven to move without needing a dataset to move.

### 19.7 Every branch, broken separately

| Branch | Message observed | Exit |
|---|---|---|
| `--build`, `NEXT_PUBLIC_SANITY_DATASET` unset | `NEXT_PUBLIC_SANITY_DATASET is not set … Failing rather than guessing.` | 1 |
| dataset does not exist | `returned 404 — nothing could be measured` **and** `the seed count query returned HTTP 404 — seed enforcement measured nothing` | 1 |
| served mode, nothing serving | `did not report an x-gridsmith-dataset header` | 1 |
| Sanity host unreachable | `TypeError: fetch failed` / `ENOTFOUND` — uncaught, deliberately | 1 |
| `prebuild` hook deleted | `package.json "prebuild" must run npm run check:launch:build` | 1 |
| `vercel.json` `buildCommand` set to `next build` | `vercel.json "buildCommand" must be exactly "npm run build"` | 1 |
| zero-tolerance rule loosened to `> 200` | 3 specimens red: `SEEDED`, `MANY`, `ONE` | 1 |
| a specimen deleted | `10 specimens, expected 11` | 1 |

The two deploy-wiring branches were broken one at a time and produced distinct messages —
neither is credited to the other.

**Clean case, end to end through the deploy command.** `rm -rf .next` then
`NEXT_PUBLIC_SANITY_DATASET=development npm run build` with `PRODUCTION_DATASET` restored:
prebuild reports `5 statutory field(s) present`, `121 published seed document(s) counted; the
zero-tolerance rule applies to "production" only`, `next build` runs, `Compiled successfully`,
**EXIT=0**. A gate that always fails is not a gate.

### 19.8 The dot-id trap, observed live

`production` reports **0** documents unauthenticated and **12** authenticated. All twelve are
Sanity system records — `_.groups.*`, `_.retention._maximum_project` — so there is no content
hiding there and no live defect. It is a clean demonstration that the mechanism
`05-HANDOVER.md` records is real and active in this project right now: **any id containing a
dot is invisible to the unauthenticated read this gate performs.**

The mitigation is at the write side and already existed: `scripts/seed-content.mjs` refuses to
publish any document whose `_id` contains a dot. A read-side fix is not available — the build
holds no Sanity token and both datasets are public by design. Recorded as a residual limit, not
closed.

### 19.9 What this changes about `M-P1-7`

The `ci.yml` comment at `M-P1-7` recorded a price paid: moving `check:launch` after the build
meant a missing singleton became "a build failure with a Sanity stack trace, which is worse
output for the same defect". `prebuild` gets that back without giving up the served check.
Against the empty `production` dataset the deploy build now stops with

```
no companyDetails document in dataset "production" — every page renders the statutory footer
```

instead of a prerender stack trace, and the served gate still runs in CI afterwards. The two
answer different questions and neither replaces the other.

### 19.10 Residual risk

1. **A clean *`production`-named* dataset has never been built end to end**, because
   `production` holds no `companyDetails` singleton and seeding it is owner work
   (`BEFORE-LAUNCH.md`). The live-clean predicate is covered by the committed `ZERO` specimen;
   the network path against a live-named dataset is covered only in its failing direction.
   Close this at the first real production seed. **Read §19.11 before treating §19.5–§19.7 as
   covering the whole gate.**
2. **The unauthenticated seed count cannot see a dotted id.** §19.8. Mitigated at the write
   side only.
3. **`vercel.json` pins the build command against a dashboard edit, not against a
   `vercel.json` edit.** Someone removing `buildCommand` restores dashboard precedence, and
   `check:node` is what catches that — a gate in the repo guarding a fact about the repo, which
   is sound, but it is CI catching it, and CI is not the deploy. There is no mechanism that
   makes Vercel refuse to build without the gate; that would need a Vercel-side deployment
   check, which is an owner decision. **Costed and closed as ACCEPTED at §20** — 27 Aug 2026.

### 19.11 The exact boundary of the `prebuild` proof — what it does *not* cover

Recorded here, at the proof, rather than only in `BEFORE-LAUNCH.md`, because §19 is what a
future reader finds first and §19.5–§19.7 read like a complete proof if this section is absent.

**Proven, and only this:**

| Claim | Established by | Direction |
|---|---|---|
| the hook is in the deploy's path | `prebuild` observed running under `npm run build`; `next build` observed never starting (§19.5) | — |
| the gate **rejects** a seeded live dataset | `NEXT_PUBLIC_SANITY_DATASET=development` with `PRODUCTION_DATASET` redirected — 121 real seed documents, over the network, EXIT=1 (§19.5) | **failing** |
| the gate **admits** a clean live dataset | the committed `ZERO` specimen, through `evaluate()` (§19.6) | **passing, in-process only** |
| each branch fires alone | eight branches, broken separately (§19.7) | mixed |
| the count reaches its subject | 121 vs 0 across two real datasets, and `MANY`/`ONE`/`ZERO` in the specimen set (§19.6) | — |

**Not proven, and this is the whole of the gap:**

- **The network path has never run in its passing direction against a dataset named
  `production`.** Every live-tier *pass* on record is either a specimen (no network, no Sanity,
  no dataset name) or a dataset named `development`, where `isLive` is false and the
  zero-tolerance rule is therefore skipped rather than satisfied. The one code path that
  matters at launch — **fetch a `production`-named dataset, find zero published seeds, find a
  complete `companyDetails`, and return exit 0** — has been exercised in neither half at once.
- The `ZERO` specimen covers the *predicate* on that path, not the *fetch* that feeds it. A
  GROQ query that silently returns an empty result for a reason unrelated to cleanliness — a
  wrong query shape, a filter that excludes everything, a projection that drops
  `isSeed` — is arithmetically indistinguishable, from inside `evaluate()`, from a genuinely
  clean dataset. §19.8's dotted-id case is one live instance of exactly that shape and is
  mitigated only at the write side.
- Nothing here says the *statutory-field* half passes against real content. It has only been
  run against seeded fields (`5 statutory field(s) present`, against `[SEED] GB123456789`).

**What would have to be observed to close it** — all in one run, on the first real production
seed (`BEFORE-LAUNCH.md` §16, blocked on the VAT number, item 2):

1. `NEXT_PUBLIC_SANITY_DATASET=production npm run build` on a clean `.next`, with
   `PRODUCTION_DATASET` at its real value — no redirect.
2. `prebuild` prints the live tier as **applying**, not skipped: the dataset is named
   `production`, `isLive` is true, and the zero-tolerance rule is reported as *in force*.
3. The seed count is **0** *and the query is shown to have reached content* — the same run must
   report a non-zero total document count, or the `0` is unfalsifiable. A count that cannot be
   shown to have measured anything is the defect class CLAUDE.md names; `ZERO` passing in a
   specimen file does not discharge it over the network.
4. The statutory fields are reported present with the **real** values, and no `[SEED]` marker
   anywhere in the output.
5. `next build` then starts and completes — `Compiled successfully`, **EXIT=0**, read from the
   process, not through a pipe (`M-P1-12`).

Until items 1–5 are observed together, read §19 as: **the seed gate is proven to fail, and
proven to be reached. It is not proven to pass over the network.** Both halves are needed; a
gate that always fails is not a gate (§19.7), and one that has only ever failed is not yet
known to be one either.

---

## 20. `M-P1-14` residual 3 — costed at the platform, and ACCEPTED

27 August 2026. §19.10 item 3 left one thing open: `vercel.json` pins the build command against
a *dashboard* edit, but nothing stops someone editing `vercel.json` itself, and the gate that
catches that (`check:node`) runs in CI, which is not the deploy. The question asked here is not
"how do we build one" but **what the platform can actually enforce, at this account's tier**.

### 20.1 The tier — asked of the system

`list_teams` on the Vercel API returns, for team `team_OVquiVuYynOepnUnaMAgcQnP`
("atikmurtaza's projects", slug `atikmurtazas-projects`):

```json
{ "name": "atikmurtaza's projects", "id": "team_OVquiVuYynOepnUnaMAgcQnP", "plan": "hobby" }
```

**`plan: "hobby"`, from the platform's own object, not from the owner's recollection.** Corroborated
by `get_project_deployment_protection` on `prj_kfFxGWf0ai1VYAGICYfVvNn0QYYN`:

```json
"passwordProtection": { "enabled": false }, "trustedIps": { "enabled": false },
"ssoProtection": { "enabled": true, "deploymentType": "all_except_custom_domains" }
```

`all_except_custom_domains` is Standard Protection — the only scope Hobby has. Both Enterprise-only
methods read `enabled: false`, which is what a Hobby project looks like from the outside.

**Recorded, not acted on:** Vercel's fair-use guidelines state the Hobby plan *"restricts users to
non-commercial, personal use only"* (`/docs/plans/hobby`, *Hobby billing cycle*). Gridsmith Ltd is a
trading company. That is an owner/commercial matter, outside this finding, but it is written down
here because it was met while establishing the tier.

### 20.2 The mechanisms, and when each runs

The distinction that decides this: a check that runs **after** the build has already produced and
published a deployment is a different guarantee from one that stops the build. For seed content the
difference is the entire point — by the time a post-build check runs, `[SEED] GB123456789` has been
rendered into static HTML and served from a generated URL.

| Mechanism | Runs | Can it assert "the seed gate ran"? | Can it stop a **production build**? | Plan |
|---|---|---|---|---|
| **`ignoreCommand`** (`vercel.json` / Ignored Build Step) | **before** the build | it can run any command and skip the build on exit 0 — but it is configured in `vercel.json`, the same file whose edit is the risk | it can *skip* a build, never fail one | all plans |
| **`prebuild`** (npm lifecycle — what is deployed today) | **before** `next build`, inside the build container | yes — it *is* the gate | **yes** | n/a, not a platform feature |
| **Build Output API** | *is* the build's output | no — a directory-structure specification, not a validator | no | all plans |
| **Deployment Checks** (GitHub / integration checks) | **after** the build is ready | only that some external check reported a status | **no** — it withholds the *alias* | not stated in the docs read |
| **Checks API** (marketplace integration) | **after** `deployment.ready` | as above, via an integration that would have to be built and published | no | requires an integration |
| **Deployment Protection** | at **request** time | no — access control on a served deployment | no | see below |
| **Sensitive environment variables** | at write / read time | no — hides values, asserts nothing about the build | no | not stated as plan-gated |

Sources, all fetched 27 Aug 2026:

- **Deployment Checks** — `/docs/deployment-checks`: *"Deployment Checks are conditions that must be
  met before promoting a production build to your production environment."* And: *"Vercel will hold
  each production deployment until all required checks pass before assigning it to your custom
  production domains."* The lifecycle is explicit — *"Production deployments will still be created,
  but will not be automatically assigned to your custom domains until all Deployment Checks are met."*
  It also documents its own bypass: *"You can bypass Deployment Checks by selecting Force Promote."*
- **Checks API** — `/docs/checks`: *"Checks are tests and assertions created and run after every
  successful deployment."* Its lifecycle runs `deployment.created` → build → `deployment.ready` →
  checks → *"Once all checks receive a `conclusion`, aliases will apply, and the deployment will go
  live"*. Creating one requires a native or connectable-account **integration** published to the
  marketplace.
- **Build Output API** — `/docs/build-output-api`: *"a file-system-based specification for a directory
  structure that can produce a Vercel deployment."* Aimed at framework authors. It is a shape the
  build emits; nothing in it validates content.
- **`ignoreCommand`** — `/docs/project-configuration/vercel-json`: *"Overrides the default Ignored
  Build Step command. Exiting with code 0 ignores the build, while code 1 continues it."*
- **Deployment Protection** — `/docs/deployment-protection`: *"On the Hobby plan, Vercel Authentication
  with Standard Protection is available. This protects your preview deployments and deployment URLs,
  but your production domain remains publicly accessible. To protect production domains, you need a Pro
  or Enterprise plan."* Methods: Vercel Authentication *"Available on all plans"*; Passport *"Available
  on the Enterprise plan"*; Password Protection *"Available on the Enterprise plan, or as a paid add-on
  for Pro plans"* (Advanced Deployment Protection, *"an additional $150 per month"*, and it must have
  been used *"a minimum of 30 days"* before it can be disabled); Trusted IPs *"Available on the
  Enterprise plan"*. Scopes: Standard Protection *"Available on all plans"*; All Deployments
  *"Available on Pro and Enterprise plans"*.
- **Sensitive environment variables** —
  `/docs/environment-variables/sensitive-environment-variables`: values are *"non-readable once
  created"*, with build-log redaction for values of 32 characters or longer. **No plan requirement is
  stated on that page**, and none is asserted here.

**One thing deliberately not stated: the plan requirement for Deployment Checks.** The
`/docs/deployment-checks` page names none, and the Hobby/Pro comparison table at `/docs/plans/hobby`
has no Deployment Checks row. Per instruction, no plan requirement is claimed that was not seen in a
source. What *is* in the sources is that neighbouring release-control features are Pro-and-above —
`vercel rollback` is documented as *"available for Pro or Enterprise plans"* and Rolling Releases
requires *"a Pro or Enterprise plan"* — so the surrounding surface is paid. That is an inference, and
it is marked as one rather than reported as a plan requirement.

### 20.3 The verdict — the plan is not what blocks this

**Even if Deployment Checks were free on Hobby, they would not close residual 3, and that is the
finding.** Three reasons, each from the sources above:

1. **Wrong side of the build.** The threat is a build that ran without the seed gate. A Deployment
   Check runs after that build has been created and is ready. The seeded HTML exists by then. It
   withholds the custom-domain alias; it does not withhold the build.
2. **It cannot see the premise.** A Deployment Check imports a *GitHub Actions status* or an
   integration's conclusion. That status is produced by CI — the very system §19 established is not
   the deploy. Wiring it up asserts "CI went green on this commit" one layer further out; it still
   cannot observe whether the Vercel build container ran `prebuild`. This is exactly the class
   CLAUDE.md names: *a gate that infers the state of a system it does not run in.*
3. **It documents its own bypass.** *Force Promote* is a button. A control a person can click past
   sits on the same footing as the repo-side gate it would be duplicating.

`ignoreCommand` runs on the right side of the build and is available on Hobby — but it lives in
`vercel.json`, so it is defeated by exactly the edit residual 3 describes, and it can only *skip* a
build, never fail one. A skipped build leaves the previous deployment live, which for a seeded
dataset is the wrong-shaped answer regardless.

**There is no mechanism at any tier — Hobby, Pro or Enterprise — that makes Vercel refuse to *build*
because a repository-side gate was removed from the repository.** The build command is defined by the
repository; a repository that no longer defines the gate is, from the platform's point of view, a
valid repository. The platform can gate *promotion*. It cannot gate *compilation* on the contents of
the file that describes compilation.

### 20.4 Recorded as ACCEPTED

**Residual 3 is ACCEPTED, not open.** It is not closeable at this tier, and — separately, and more
usefully — it is not closeable at any tier by the mechanism the original note imagined.

| | |
|---|---|
| **What remains possible** | A Deployment Check fed by the existing CI workflow would add a *promotion* gate on top of the *build* gate. It duplicates a signal that already blocks merge, sits on the wrong side of the build, and is Force-Promotable. Judged not worth its wiring today; revisit only if the release model changes — a promote step, or more than one committer |
| **What it would take to close properly** | Not a Vercel feature. It would take the gate not being editable in the same commit as the code: branch protection on `vercel.json` and `package.json` with a required reviewer — a GitHub-side control, on a repository with more than one person on it. A single-committer repository cannot have that property |
| **Compensating controls in force** | (a) `prebuild` in `package.json` — the gate is in the deploy's own path, §19.4; (b) `vercel.json` `buildCommand` pinned to `npm run build` — dashboard precedence removed, and Vercel's own build log confirms the npm lifecycle is entered, §19.1; (c) `check:node` asserts both artefacts still exist, and both of its branches were broken separately and produced distinct messages, §19.7 |
| **The honest size of what is left** | One person, editing two files in one commit, defeats it. That person is the owner. It is a self-sabotage scenario, not an attack surface and not an accident surface — every accidental path (a dashboard edit, a lost CI step, a bypassed npm lifecycle) is covered by (a)–(c) |
| **Review trigger** | A second committer, a move off Hobby, or any change to how production is released |

The value of writing this down is not the conclusion but the costing: **an accepted risk with its
reasoning on the page is a different object from an open one nobody has priced**, and the next reader
of §19.10 should not spend a session re-deriving that Deployment Checks are post-build.
