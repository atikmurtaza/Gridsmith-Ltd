# Project Tracker — Gridsmith Press

**Status:** `TODO` · `WIP` · `BLOCKED` · `REVIEW` · `DONE` · **Priority:** P0 blocks launch · P1 desirable · P2 post-launch

Assumes the shared foundation (`master/PROJECT-TRACKER.md` Epic A) is `DONE`, including
`A-GATE`.

---

## Epic P — Press shell

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| P-01 | Apply Press theme, verify contrast | P0 | 0.5d | A-03 | TODO | Dev | 17px floor for `--ink-subtle` |
| P-02 | Serif type, 17px/1.7/52ch base | P0 | 0.5d | P-01 | TODO | Dev | Check on real copy |
| P-03 | Margin-note component | P0 | 1d | P-01 | TODO | Dev | Mobile collapses inline |
| P-04 | Header, footer, mobile nav | P0 | 1d | A-05 | TODO | Dev | Books + Packages in nav |
| P-05 | Split sticky mobile bar | P0 | 0.5d | P-04 | TODO | Dev | Prices in the bar |
| P-06 | `/press/` hub | P0 | 2d | P-04 | TODO | Dev | |
| P-07 | Service page template | P0 | 2d | A-06 | TODO | Dev | Time commitment + revisions |
| P-08 | Case study template | P0 | 1.5d | A-06 | TODO | Dev | Book ref required |

## Epic R — Trust architecture *(build before selling pages)*

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| R-01 | `book` schema + hard validations | P0 | 1d | A-06 | TODO | Dev | retailers ≥1, consent = true |
| R-02 | `/press/books` shelf + filters | P0 | 2d | R-01 | TODO | Dev | Fixed 2:3, zero CLS |
| R-03 | `/press/books/[slug]` detail | P0 | 1d | R-02 | TODO | Dev | `Book` schema.org |
| R-04 | Retailer link-check cron | P0 | 1d | R-01 | TODO | Dev | Weekly + Slack alert |
| R-05 | Broken-link degradation to text | P0 | 0.5d | R-04 | TODO | Dev | Never a dead link |
| R-06 | `/press/rights` page | P0 | 1d | P-07 | TODO | Dev | |
| R-07 | **Rights wording legal sign-off** | P0 | — | R-06 | TODO | Atik + solicitor | **HARD GATE** |
| R-08 | "What we are and are not" module | P0 | 1d | P-03 | TODO | Dev | Three-way honest comparison |
| R-09 | Commercial expectations statement | P0 | 0.5d | P-03 | TODO | Dev | Undesigned, before pricing |
| R-10 | `publishingPackage` schema | P0 | 1d | A-06 | TODO | Dev | Price required; no POA path |
| R-11 | `/press/packages` matrix | P0 | 2d | R-10 | TODO | Dev | Real table; exclusions equal weight |
| R-12 | Packages mobile: pinned column | P0 | 0.5d | R-11 | TODO | Dev | |
| R-13 | Named distribution module | P0 | 0.5d | P-03 | TODO | Dev | Names platforms honestly |
| R-15 | `publishingPlatform` schema | P0 | 0.5d | A-06 | TODO | Dev | `specCheckedOn` required |
| R-16 | `/press/platforms` compliance page | P0 | 1.5d | R-15 | TODO | Dev | Incl. "could you do it yourself" |
| R-17 | **Six ownership facts module** | P0 | 1d | P-03 | TODO | Dev | Each with a contract clause |
| R-18 | ISBN / publisher-of-record explainer | P0 | 0.5d | R-17 | TODO | Dev | Author is publisher; no imprint |
| R-14 | Credentials strip | P0 | 0.5d | P-04 | TODO | Dev | Imprint, ISBN prefix, company no., titles count |

## Epic N — Path Finder & conversion

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| N-01 | `pathFinderConfig` schema | P0 | 1d | A-06 | TODO | Dev | |
| N-02 | **ETH-04 schema validator** | P0 | 0.5d | N-01 | TODO | Dev | ≥2 honest outcomes, no CTA on them |
| N-03 | `recommend.ts` pure function | P0 | 2d | N-01 | TODO | Dev | All 6 outcomes reachable, unit tested |
| N-04 | **ETH-04 verification run** | P0 | 0.5d | N-03 | TODO | Dev | **HARD GATE — 3 scenarios** |
| N-05 | Static SSR decision table | P0 | 1d | N-01 | TODO | Dev | Works with JS off |
| N-06 | Path Finder island, 5 steps | P0 | 3d | N-03 | TODO | Dev | JS delta ≤40KB gz; fieldsets |
| N-07 | Result view; CTA suppressed on honest outcomes | P0 | 1d | N-06 | TODO | Dev | No button on E/F |
| N-08 | `press_path_results` + audit column | P0 | 0.5d | A-07 | TODO | Dev | `is_gridsmith_outcome` |
| N-09 | `/press/assessment` page | P0 | 1.5d | P-07 | TODO | Dev | Priced, sample linked |
| N-10 | Sample report, signed URL delivery | P0 | 1d | N-09 | TODO | Dev | 72h expiry |
| N-11 | `/press/ghostwriting` w/ hours per stage | P0 | 1.5d | P-07 | TODO | Dev | Persona P2's decisive detail |
| N-12 | `contentProgrammeTier` + page | P0 | 1.5d | A-06 | TODO | Dev | Excludes rendered |
| N-21 | `marketingPackage` schema | P0 | 0.5d | A-06 | TODO | Dev | `outcomeStatement` required |
| N-22 | `/press/book-marketing` page | P0 | 1.5d | N-21 | TODO | Dev | Never bundled; no-outcome prominent |
| N-13 | Contact flow, 4 segments | P0 | 2.5d | A-08 | TODO | Dev | Memoir gate on acknowledgement |
| N-16 | **Consumer vs business terms routing** | P0 | 1d | N-13 | TODO | Dev | Segment determines which terms apply |
| N-17 | **14-day cancellation notice** in consumer flow | P0 | 0.5d | N-16 | TODO | Dev | Before pricing, plain language |
| N-18 | **Early-start express request checkbox** | P0 | 1d | N-16 | TODO | Dev | Unbundled, never pre-ticked |
| N-19 | `consumer_consents` table + timestamped record | P0 | 0.5d | N-18 | TODO | Dev | Evidence of the express request |
| N-20 | Confirmation email repeats the notice verbatim | P0 | 0.5d | N-18 | TODO | Dev | |
| N-14 | Path Finder → contact prefill | P1 | 0.5d | N-07, N-13 | TODO | Dev | |
| N-15 | Cross-division prompt, confirmation only | P1 | 0.5d | N-13 | TODO | Dev | Never mid-funnel |

## Epic O — Content

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| O-01 | **Obtain author consent for ≥12 titles** | P0 | — | — | TODO | Atik | **MOVED TO STAGE 0.** Press is already trading, so the shelf must be complete at the week-12 cutover, and consent has a multi-week external lead time |
| O-02 | Publish 12 books with retailer links | P0 | 2d | R-01, O-01 | TODO | Content | Every link verified |
| O-03 | 10 service pages | P0 | 5d | P-07 | TODO | Content | |
| O-04 | 8 case studies, each linked to a title | P0 | 5d | P-08 | TODO | Content | |
| O-05 | Package matrix populated | P0 | 2d | R-10 | TODO | Content | Every exclusion stated |
| O-12 | Platform spec content, 5 platforms | P0 | 1.5d | R-15 | TODO | Content | Verified against live specs |
| O-13 | Marketing package content | P0 | 1d | N-21 | TODO | Content | No-outcome statement on each |
| O-06 | 18 FAQs | P0 | 1.5d | A-06 | TODO | Content | Vanity-press Q first, open |
| O-07 | **Vanity-press answer external review** | P0 | — | O-06 | TODO | External | Credibility check |
| O-08 | Rights & royalties copy | P0 | 0.5d | R-07 | TODO | Content | Post legal sign-off |
| O-09 | Commercial expectations copy | P0 | 0.5d | R-09 | TODO | Content | No hedging |
| O-10 | 3 insight articles | P1 | 2d | A-06 | TODO | Content | |
| O-11 | Proofread everything | P0 | 1d | O-* | TODO | Content | |

## Epic Z — Hardening & launch

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| Z-01 | Structured data incl. `Book` | P0 | 1d | O-* | TODO | Dev | |
| Z-02 | Performance — books shelf | P0 | 1.5d | O-02 | TODO | Dev | LCP ≤2.0s with 12 covers |
| Z-03 | Accessibility full pass | P0 | 2d | O-* | TODO | Dev | Serif sizing, table, Path Finder |
| Z-04 | JS-disabled verification | P0 | 0.5d | N-05 | TODO | Dev | Pricing + decision table readable |
| Z-05 | All states | P0 | 1d | P-* | TODO | Dev | Incl. broken-link degradation |
| Z-06 | Manual retailer link verification | P0 | 0.5d | O-02 | TODO | Content | In addition to cron |
| Z-07 | Cross-browser + device | P0 | 1d | Z-02 | TODO | Dev | |
| Z-08 | PostHog funnels + honesty dashboard | P0 | 0.5d | A-09 | TODO | Dev | `v_path_finder_honesty` |
| Z-09 | **Author user test, 6 people** | P0 | — | O-* | TODO | External | **GATE — "does this feel like a vanity press?"** |
| Z-10 | Speed-to-lead drill | P0 | — | A-08 | TODO | Ops | Notification <60s; reply by end of next business day |
| Z-11 | Analytics verification | P0 | 0.5d | Z-08 | TODO | Dev | `retailer_click` + return tracking |
| Z-12 | Soft launch to past clients | P0 | — | Z-* | TODO | Ops | Best credibility check available |
| Z-13 | Public launch | P0 | — | Z-12 | TODO | Ops | |

## Blocked / decisions needed

| ID | Item | Needed from | Blocks |
|---|---|---|---|
| Q-P1 | Author consent for 12+ titles | Atik | O-01, O-02 |
| Q-P2 | Author contract — rights & royalties clauses | Atik + solicitor | R-06, R-07 |
| Q-P3 | Final package prices and inclusions | Atik | R-10, O-05 |
| Q-P4 | Revision rounds per package + extra cost | Atik | R-10 |
| Q-P5 | Manuscript Assessment price + deliverable | Atik | N-09 |
| Q-P6 | Ghostwriting: real author hours per stage | Atik | N-11 |
| Q-P7 | Content Programme tiers, SLAs, notice | Atik | N-12 |
| Q-P8 | ~~Imprint / ISBN~~ **RESOLVED** — author's own ISBN, author is publisher of record, no Gridsmith imprint | — | — |
| Q-P11 | Marketing package contents and prices | Atik | N-21, N-22 |
| Q-P12 | Platform spec detail per platform — needs someone who has actually submitted to each | Atik | R-15, R-16 |
| Q-P10 | Pro-rata calculation method for early-start cancellation | Atik + solicitor | N-18 |

## Metrics dashboard

| Metric | Target | Current |
|---|---|---|
| Visitor → lead | ≥4% | — |
| Sessions viewing rights/pricing/process | ≥55% | — |
| B2B & founder-book share of leads | ≥35% | — |
| Assessment share of leads | ≥30% | — |
| Content Programme enquiries | ≥15% | — |
| Cross-division flagged leads | ≥25% | — |
| **Path Finder honest-outcome rate** | >0%, monitored | — |
| Retailer click → return → convert | tracked | — |
| Broken retailer links | 0 | — |
| p95 speed-to-lead | <60s | — |
