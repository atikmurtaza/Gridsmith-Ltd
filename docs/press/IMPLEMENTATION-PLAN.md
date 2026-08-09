# Implementation Plan — Gridsmith Press

Press inherits the shared foundation from `master/IMPLEMENTATION-PLAN.md` Phase 0 and
starts at its own Phase 1. It is built **first of the three divisions**, per
`_shared/02-BUILD-SEQUENCE.md`.

> ## Press is already live and trading — this is a cutover
>
> Everything below was written as a launch plan. It is not one. Gridsmith Press is a
> live, revenue-generating site, and Phase 6 moves it onto the new application. Three
> corrections apply until the cutover plan is written:
>
> 1. **Seed content cannot ship at cutover.** The production seed check blocks any
>    `isSeed` record from publishing, and the launch gates require real case studies with
>    metrics and pricing on every service page. Press's real content — books, packages,
>    pricing, client names — is a **week-12 blocker**, not a Stage-8 content-load task.
>    A live site cannot go backwards to less content than it has today.
> 2. **`O-01` (author consent, ≥12 titles) has moved to Stage 0.** It gates the books
>    shelf, the shelf carries most of Press's credibility, and consent has an external
>    lead time of weeks. Starting it at Phase 4 is too late.
> 3. **Phase 6 needs a rollback plan.** There isn't one anywhere in the specs. "Soft
>    launch to past clients" (6.4) also assumes past clients are not already using the
>    live site — they are.
>
> **The cutover plan is not written yet** and is pending the inventory of what is
> currently live. Do not infer it from this file, and do not treat Phase 6 as complete
> guidance for moving a trading site.

---

## Phase 1 — Press shell (Week 1–2)

| # | Task | Depends on | DoD |
|---|---|---|---|
| 1.1 | Press theme, contrast verified | Foundation | All pairs verified; 17px `--ink-subtle` floor enforced |
| 1.2 | Serif type loading, 17px/1.7/52ch base | 1.1 | Reading comfort checked on real content, not lorem |
| 1.3 | Margin-note component + mobile collapse | 1.1 | Collapses inline below the annotated paragraph |
| 1.4 | Header, footer, mobile nav | Foundation | Books and Packages in primary nav |
| 1.5 | Split sticky mobile bar | 1.4 | [Packages & prices] / [Start an assessment] |
| 1.6 | `/press/` hub | 1.4 | |
| 1.7 | Service page template | Foundation | `authorTimeCommitment` + `revisionPolicy` rendered |
| 1.8 | Case study template | Foundation | Book reference required |

## Phase 2 — Trust architecture (Week 3–4) · *built before anything that sells*

This ordering is deliberate. Press's conversion mechanism *is* the trust architecture. Building the sales pages first and adding trust later produces a vanity-press-shaped site that is then hard to reverse.

| # | Task | Depends on | DoD |
|---|---|---|---|
| 2.1 | `book` schema with hard validations | Foundation | `retailers` min 1 and `authorConsent` true both enforced |
| 2.2 | `/press/books` shelf + filters | 2.1 | Fixed 2:3, zero CLS, external links `rel="noopener"` |
| 2.3 | `/press/books/[slug]` detail | 2.2 | `Book` schema.org valid |
| 2.4 | **Retailer link-check cron** | 2.1 | Weekly; broken links degrade to text; Slack alert |
| 2.5 | **`/press/rights` page** | 1.7 | Wording matches the real author contract |
| 2.6 | Rights wording legal sign-off | 2.5 | **HARD GATE** |
| 2.7 | "What we are and are not" module | 1.3 | Honest three-way comparison |
| 2.8 | **Commercial expectations statement** | 1.3 | Plain prose, undesigned, appears before pricing |
| 2.9 | `publishingPackage` schema | Foundation | Price required, excludes min 3, `notFor` required |
| 2.10 | `/press/packages` full matrix | 2.9 | Real `<table>`; exclusions row equal weight; mobile pinned column |
| 2.11 | Named distribution module | 1.3 | Names KDP/IngramSpark/D2D and states authors could use them directly |
| 2.12 | Credentials strip | 1.4 | Imprint name, ISBN prefix, company number, titles published |

## Phase 3 — Conversion (Week 5–6)

| # | Task | Depends on | DoD |
|---|---|---|---|
| 3.1 | `pathFinderConfig` schema + ETH-04 validator | Foundation | Config with <2 honest outcomes is rejected |
| 3.2 | `recommend.ts` pure function | 3.1 | Unit tested; all 6 outcomes reachable |
| 3.3 | **ETH-04 verification run** | 3.2 | 3 scenarios that must return self-service / not-ready do so — **HARD GATE** |
| 3.4 | Static SSR decision table (no-JS) | 3.1 | All 6 outcomes + criteria readable without JS |
| 3.5 | Path Finder island, 5 steps | 3.2 | JS delta ≤40KB gz; fieldsets; `aria-live` |
| 3.6 | Result view, CTA suppressed on honest outcomes | 3.5 | No CTA button on self-service or not-ready |
| 3.7 | `press_path_results` + honesty audit column | Foundation | `is_gridsmith_outcome` written correctly |
| 3.8 | `/press/assessment` entry offer page | 1.7 | Priced; sample report linked |
| 3.9 | Sample assessment report, redacted | 3.8 | Real report, signed 72h URL |
| 3.10 | `/press/ghostwriting` with hour-by-stage commitments | 1.7 | Author time named at canonical stages 1, 4 and 5 |
| 3.11 | `contentProgrammeTier` + `/press/content-programmes` | Foundation | Excludes min 2 rendered |
| 3.12 | Contact flow, 4 segments | Foundation | Memoir branch blocks submit without `expectationsAcknowledged` |
| 3.13 | Path Finder → contact prefill | 3.6, 3.12 | |
| 3.14 | Cross-division prompt, confirmation screen only | 3.12 | Never mid-funnel |

## Phase 4 — Content (Week 7–8)

| # | Task | DoD |
|---|---|---|
| 4.1 | ≥12 books published to the shelf | Every one with consent recorded and ≥1 live retailer link |
| 4.2 | 10 service pages | Each with time commitment, revision policy, pricing |
| 4.3 | 8 case studies | Each linked to a real, purchasable title |
| 4.4 | Full package matrix populated | Every price, inclusion, exclusion, `notFor` |
| 4.5 | 18 FAQs | **"Are you a vanity press?" is first and open by default** |
| 4.6 | Vanity-press answer external review | Reviewed by someone outside the business for credibility |
| 4.7 | Rights & royalties copy | Signed off (2.6) |
| 4.8 | Commercial expectations copy | Plain, honest, no hedging |
| 4.9 | 3 insight articles | |
| 4.10 | Proofread everything | A typo on a publishing site is a category error |

## Phase 5 — Hardening (Week 9)

| # | Task | DoD |
|---|---|---|
| 5.1 | Structured data incl. `Book` on every title | Rich Results valid |
| 5.2 | Performance — books shelf is the risk route | LCP ≤2.0s with 12 covers |
| 5.3 | Accessibility full pass | Serif sizing, packages table, Path Finder |
| 5.4 | JS-disabled verification | Decision table + all pricing readable |
| 5.5 | All states | Incl. broken-link degradation |
| 5.6 | **All retailer links verified live** | Manual pass in addition to cron |
| 5.7 | Cross-browser + device | |
| 5.8 | PostHog funnels + honesty dashboard | `v_path_finder_honesty` visible |

## Phase 6 — Cutover (Week 10) · *not a launch — see the note at the top of this file*

| # | Task | DoD |
|---|---|---|
| 6.1 | Author user test, 6 participants incl. 2 first-time authors | Ask directly: "does this feel like a vanity press?" — **any yes blocks launch until addressed** |
| 6.2 | Speed-to-lead drill | Notification <60s; reply by end of next business day |
| 6.3 | Analytics verification | `retailer_click` and return-tracking working |
| 6.4 | Soft launch to past clients | They are the best credibility check |
| 6.5 | Public launch | |

## Phase 7 — Post-launch

- **Monthly: review `v_path_finder_honesty`.** If honest outcomes drop toward zero, investigate — either the config drifted or the traffic changed. Do not let it silently disappear.
- **Weekly for 8 weeks:** `v_verification_journey` — are people leaving to verify and returning? If they leave and don't return, the shelf is working and the rest of the site isn't.
- Monthly: broken-link report to zero.
- **No third-party accreditation is being pursued.** Press therefore carries its entire credibility load through first-party verifiable evidence: the books shelf with live retailer links, named clients with consent, published pricing, published exclusions, and the honest Path Finder outcomes. Every one of those must stay strong — there is no external badge compensating if one weakens.
- A/B queue: (1) expectations statement placement, (2) Path Finder entry position, (3) assessment vs packages as primary CTA.

---

## Critical path

`Foundation → 2.1 (books) → 2.5/2.6 (rights + legal gate) → 2.9/2.10 (packages) → 3.2 (recommend) → 3.3 (ETH-04 gate) → 4.1 (12 books) → 6.1 (vanity-press user test) → launch`

## Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Author consent not obtainable for enough titles | Medium | **High** — blocks the shelf | Start consent requests week 1; 12 titles minimum |
| Rights wording doesn't match the real contract | Medium | **Severe** — legal and trust | 2.6 hard gate before publication |
| Site still reads as a vanity press | Medium | **Severe** — the division fails | 6.1 user test asks the question directly |
| ETH-04 outcomes get quietly removed later for conversion | **High over time** | Severe | Schema-level validator + `v_path_finder_honesty` audit view |
| Expectations statement gets softened by commercial pressure | **High** | High | It is P0 and traced to R6-Press. Softening it removes the reason the site converts |
| Retailer links rot | High over time | Medium | Weekly cron + graceful degradation |
| Packages pricing gets replaced with "POA" | Medium | High | Price is `validation: required` in the schema — structurally blocked |
| Books shelf hurts LCP | Medium | Medium | 12 eager, rest lazy; fixed aspect ratios |
