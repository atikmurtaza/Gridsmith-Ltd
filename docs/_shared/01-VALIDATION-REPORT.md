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
gridsmith.co.uk/            master layer
gridsmith.co.uk/design/     Gridsmith Design
gridsmith.co.uk/digital/    Gridsmith Digital
gridsmith.co.uk/press/      Gridsmith Press
```

Not separate websites, not subdomains. Four route groups in one Next.js application, each with its own theme applied by a `data-division` attribute set server-side.

**Why not separate sites:** three codebases triple maintenance, split SEO authority three ways, make cross-division case studies impossible to render, and give the group no coherent centre. Every argument for the master brand is an argument against separate sites.

**Why not subdomains:** `design.gridsmith.co.uk` is treated by search engines as a substantially separate property. You would build domain authority three times instead of once. Path-based keeps one authority pool while still allowing each division a completely distinct visual identity — which the design specs demonstrate is achievable.

Division domains (`gridsmithdesign.co.uk` and equivalents) are registered defensively and 301 to their path. Never hosted separately.

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
