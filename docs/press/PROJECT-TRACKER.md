# Project Tracker — Gridsmith Press

**Status:** `TODO` · `WIP` · `BLOCKED` · `REVIEW` · `DONE` · **Priority:** P0 blocks launch · P1 desirable · P2 post-launch

Assumes the shared foundation (`master/PROJECT-TRACKER.md` Epic A) is `DONE`, including
`A-GATE`.

> **Epics P and K were re-derived from disk on 3 September 2026, and the answer is the opposite
> of Epic U's.** Both were written before Epic M shipped, so the same rot was assumed. Across the
> 30 rows: **2 SATISFIED, 6 PARTIAL, 20 VALID, 2 STALE.** Satisfied-or-stale is **4 of 30 (13%)**,
> so these are still a work queue — unlike Epic U, where the shared master layer had quietly
> built the shell rows out from under the tracker.
>
> The reason is structural rather than lucky. Epic M built *the frame*; Epics P and K are almost
> entirely **Press's own domain objects** — books, packages, path-finder outcomes, consumer
> consent records — and nothing shared could have built them. So the rot concentrates exactly
> where the frame reaches: **Epic P, the shell epic, is 3 of 8** (`P-01` and `P-04` satisfied,
> `P-08` stale). **Epic K is 1 of 22.**
>
> **Three `Depends` were wrong** — `P-05` (add `R-11`), `K-09` and `K-11` (`P-07` -> `A-06`) — and
> one row instructs work the architecture forbids (`P-08` against `N-10`). **`K-17` is the finding
> that matters**: it points at UI copy more generous than the reviewed consumer terms.

---

## Epic P — Press shell

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| P-01 | Apply Press theme, verify contrast | P0 | 0.5d | A-03 | **SATISFIED** by `A-03`/`A-04` | Dev | `styles/themes/press.css` exists and `app/(press)/layout.tsx` sets the group; `check-contrast.mjs:25` has `press` in `THEMES` and `:91` holds its pair table, so the theme is gated. ⚠ **The note "17px floor for `--ink-subtle`" is stale.** `press.css:8-16` records that the floor went *with* `#78716C`: at `#6C6560` the token measures clear of the AA body floor without a size rule, and `DESIGN.md` §2 (line 60) says the removal "is not a relaxation". A colour that needs a size rule to be legible is the wrong colour. Same shape as `U-01` |
| P-02 | Serif type, 17px/1.7/52ch base | P0 | ~~0.5d~~ **0.4d left** | P-01 | **PARTIAL** | Dev | **The serif is done; none of the three numbers is.** `(press)/layout.tsx` loads Source Serif and `press.css:71` sets `--font-body` to it. But `tokens.css:23` makes `--text-base` `clamp(1rem, …, 1.0625rem)`, so body is **16px** at narrow viewports and reaches 17px only at the top of the clamp; `globals.css:38` sets `line-height: var(--leading-normal)` — **1.55, not the 1.7** that `--leading-relaxed` holds; and `Prose` defaults to `--measure` 68ch with `measure="narrow"` (52ch) opt-in per call site, against `DESIGN.md` §3's *"52ch for all body copy, without exception"*. `press.css` overrides none of the three. **No gate covers any of them**, so per `CLAUDE.md` they are unverified numbers — this row is where they become measured, and it should land a check with them |
| P-03 | Margin-note component | P0 | 1d | P-01 | **VALID** | Dev | Genuinely absent — `marginNote`/`MarginNote`/`margin-note` has **zero hits** across `components/`, `app/` and `styles/`. `DESIGN.md` §3 line 105 is the spec; mobile collapses inline. Depends `P-01` is true and satisfied |
| P-04 | Header, footer, mobile nav | P0 | ~~1d~~ **0.25d left** | A-05 | **SATISFIED** by `M-02`/`M-03`/`M-04`; residual `BLOCKED` | Dev | `(press)/layout.tsx` renders `RootShell`, which renders the skip link, `Header division="press"` and the shared `Footer` with the statutory block and the Company/Legal groups (`7c069b0d`). The gates already reach it: `check-axe.mjs:51` and `check-responsive.mjs:31` both list `/press`, and `lighthouse/routes.cjs:86` budgets it. **The residual is blocked, not outstanding**, and for the identical reason as `U-04`: `nav.ts:38` holds `press: []`, and the spec's Books and Packages targets are `R-02` and `R-11`, neither of which is a route. `check-axe` resolves every same-origin link on every audited route, so adding either now fails the build. **"Mobile nav" is a hamburger in the spec and nothing needs one yet** — with zero items the Press header is the wordmark alone, and the master header's six items wrap at 375px under `check-responsive`. Decide it when there are items, against a measurement |
| P-05 | Split sticky mobile bar | P0 | 0.5d | ~~P-04~~ **P-04, R-11** | **VALID — blocked** | Dev | `components/primitives/StickyCta.tsx` is built (`A-05`) and single-child; the split is a Press wrapper over it, not a change to the primitive. **Depends was true and incomplete.** "Prices in the bar" means the packages matrix, and there is no `/press/packages` — `R-11` builds it, `R-02` builds `/press/books`. Same correction, same cause and same evidence as `U-05`'s `U-04` → `U-04 + V-06`. **`StickyCta`'s only committed subject is the `/_kitchen-sink` specimen, which `check-responsive.mjs:202` warns is removed from the production build at `A-12`** — this row is Press's chance to give that assertion a production-route subject, exactly as `U-05` is Digital's |
| P-06 | `/press/` hub | P0 | 2d | P-04 | **PARTIAL** | Dev | **`app/(press)/press/page.tsx` exists and is not this row** — it is the Epic N/L/S shell landing page, `DivisionLanding` plus a `RightsStatement`, and **its own docstring says so**: *"This is the landing page, not the full hub."* It already ships the shell, the service groups, selected work, the CTA band and the rights block citing clause 10.1 of the consumer client terms. What the hub adds is Path Finder entry (`K-05`/`K-06`), the books shelf (`R-02`), the packages matrix (`R-11`) and the honest-comparison and ownership modules (`R-08`, `R-17`) — **every one of them another row's**, which is why the shared shell has none of them. Same reading as `U-06`; the estimate stands, because most of the present blocks are generic and will be replaced rather than kept |
| P-07 | Service page template | P0 | 2d | A-06 | **PARTIAL** | Dev | **The template exists and it is Digital's.** `U-08` built `app/(digital)/digital/services/[slug]/page.tsx` — Server Component, zero client JS, `notFound()` rather than rendering around a missing price, division as part of the lookup rather than a filter after it. There is **no `app/(press)/press/services`**; the whole of `app/(press)` is the layout and the landing page. So the *pattern* is proven and the *route* is not. **Neither Press-specific requirement is met by the Digital route**: it renders client time per step (FR-DG12), but **`revisions` does not exist in `sanity/schemas/` at all** — zero hits — so the revisions half is a schema change before it is a template change. Depends `A-06` is true |
| P-08 | Case study template | P0 | 1.5d | A-06 | **STALE** — see notes | Dev | **The row instructs building a thing the architecture says not to build.** `N-10` made `app/(marketing)/work/[slug]/page.tsx` the one case-study template every division links to rather than owning a copy, and its docstring gives the reason: three divisions publishing the same cross-division project under three paths is three URLs competing for one piece of work. It already serves Press projects — `project.divisions` is an array and the route's `generateStaticParams` builds every one. **The surviving residual is the note, not the task**: "Book ref required" needs a `book` document type, and `sanity/schemas/index.ts` registers none — that is `R-01`. Rewrite this row as *"add the book reference to the shared case-study template"*, depending on `R-01`, or close it into `R-01`. 1.5d is wrong for what is left |

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

## Epic K — Path Finder & conversion

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| K-01 | `pathFinderConfig` schema | P0 | 1d | A-06 | **VALID** | Dev | Absent — `sanity/schemas/index.ts` registers `objectTypes`, `groupSection`, `continuityRow`, `legalClause`, `coreDocumentTypes`, `groupPage`, `continuityExample`, `legalDocument` and `companyDetails`, and nothing else. Depends `A-06` true |
| K-02 | **ETH-04 schema validator** | P0 | 0.5d | K-01 | **VALID** | Dev | >=2 honest outcomes, no CTA on them. `scripts/check-schemas.mjs` is the host. ⚠ **Read `CLAUDE.md` before writing it**: that same file's `CLOSED_LISTS` shipped printing *"2 closed list(s) intact and enforced by a custom rule"* with **no loop over the constant** — the check-that-does-not-exist class, which produced its own evidence. This row's count must be provable to report zero |
| K-03 | `recommend.ts` pure function | P0 | 2d | K-01 | **VALID** | Dev | No `lib/path/` exists. A pure function is the `check-legal-parity.selftest.mjs` shape — assert the return value per branch, which is structurally immune to the inert-probe class |
| K-04 | **ETH-04 verification run** | P0 | 0.5d | K-03 | **VALID** | Dev | **HARD GATE — 3 scenarios.** Non-negotiable #9: the Path Finder must be able to recommend against Gridsmith |
| K-05 | Static SSR decision table | P0 | 1d | K-01 | **VALID** | Dev | Works with JS off. `V-06` is the precedent and it is exact: the JS-disabled half is its own statically-generated route, and `K-06`'s island mounts above it rather than replacing it |
| K-06 | Path Finder island, 5 steps | P0 | 3d | K-03 | **VALID** | Dev | Budget already provisioned — `check-bundle-size.mjs:179` holds `['/press/path-finder', 40]`, so the <=40KB gz ceiling is gated the day the route exists |
| K-07 | Result view; CTA suppressed on honest outcomes | P0 | 1d | K-06 | **VALID** | Dev | No button on E/F |
| K-08 | `press_path_results` + audit column | P0 | 0.5d | A-07 | **VALID** | Dev | `supabase/migrations/` holds `0001_core.sql` and `0002_view_security_invoker.sql`, whose tables are `leads`, `sample_grants` and `events` only. Depends `A-07` true. ⚠ **`M-P1-3`: the subject is the live database, not the migration** — `A-07`'s leak existed in the running system while the migration read correctly |
| K-09 | `/press/assessment` page | P0 | 1.5d | ~~P-07~~ **A-06** | **VALID — Depends corrected** | Dev | **`P-07` was a sequencing preference recorded as a blocker**, and `V-06` is the decided precedent: it was built directly on `A-06` and `listServices()` after exactly this correction, without waiting for `U-07`. A priced route needs the service records and a price, not another division's template row |
| K-10 | Sample report, signed URL delivery | P0 | ~~1d~~ **0.7d left** | K-09 | **PARTIAL** | Dev | **The table is shipped and it carries the expiry.** `supabase/migrations/0001_core.sql:58` creates `sample_grants` with a unique `token`, `expires_at`, `used_at` and a cascade to `leads`, RLS enabled — and its docstring already names `token` a bearer credential with a 72h expiry and says why the table is guarded although `SCHEMA-CORE` does not mention it. What is absent is the delivery: no route under `app/api/` but `rls-drift`, and no asset. Depends `K-09` true |
| K-11 | `/press/ghostwriting` w/ hours per stage | P0 | 1.5d | ~~P-07~~ **A-06** | **VALID — Depends corrected** | Dev | Same correction as `K-09`. **The mechanism is already proven**: the `service` schema carries `process` as `processStep[]`, and `U-08` renders client time per stage in the mono column beside duration. Persona P2's decisive detail has a working precedent, so what is left is the route and the content |
| K-12 | `contentProgrammeTier` + page | P0 | 1.5d | A-06 | **VALID** | Dev | Not in the schema registry. Excludes rendered |
| K-21 | `marketingPackage` schema | P0 | 0.5d | A-06 | **VALID** | Dev | Not in the schema registry. `outcomeStatement` required |
| K-22 | `/press/book-marketing` page | P0 | 1.5d | K-21 | **VALID** | Dev | Never bundled; no-outcome prominent |
| K-13 | Contact flow, 4 segments | P0 | ~~2.5d~~ **2d left** | A-08 | **PARTIAL** | Dev | `components/leads/ContactForm.tsx` exists and is a **single-step** form: division select, name, email, company, phone, message, budget band, timeline — backed by `lib/leads/{schema,action,submit,notify}.ts` and the `leads` table. **None of `APP-FLOW.md` §6 exists**: no four segments, no step-2 branch, no manuscript-link field, and the memoir branch's inline commercial-expectations statement (ETH-07) is `R-09`'s. The `leads` table needs no migration for it — `payload jsonb` and `leads_payload_gin` are already there for exactly this shape. Depends `A-08` true |
| K-16 | **Consumer vs business terms routing** | P0 | ~~1d~~ **0.7d left** | K-13 | **PARTIAL** | Dev | **Both destinations already exist.** `lib/legal/slugs.ts:40-42` ships `client-terms` (the disambiguation page), `business-client-terms` and `consumer-client-terms`, and all three serve from `app/(marketing)/legal/[slug]`. The owner decided that split on 26 August 2026. What is missing is the segment -> document routing inside the flow, and it cannot be built before `K-13`'s segments exist. Depends `K-13` true |
| K-17 | **14-day cancellation notice** in consumer flow | P0 | 0.5d | K-16 | **STALE** — do not build as specified | Dev | **The copy this row points at is the promise round 9 deliberately removed, and shipping it would repeat §21 exactly.** `APP-FLOW.md` §6 specifies the panel as *"You can cancel within 14 days for any reason and get a full refund."* `CONSUMER-TERMS.md` §6 — the reviewed document — reads *"**Where** your contract is a distance or off-premises service contract **and** the Consumer Contracts Regulations 2013 give you a cancellation right, you will **normally** have 14 days"*, with §6.1 refunding only where work has not started and §6.2 charging a proportionate amount once it has. Under `L-CRA-50` a statement about the service becomes a term of the contract, so the specified UI would **offer more than the reviewed contract gives** — non-negotiable #6, and the same shape as the seed script's surviving 14-day refund. **Second correction, the placement**: this note says *"Before pricing"*; `APP-FLOW.md` §6 puts the panel **at order confirmation, not enquiry**. Resolve both against `_legal/` before any code, and do not draft the clause here (`CLAUDE.md`: do not draft or amend clauses) |
| K-18 | **Early-start express request checkbox** | P0 | 1d | K-16 | **VALID** | Dev | Unbundled, never pre-ticked. Its wording is downstream of `K-17`'s correction — the acknowledgement has to match `CONSUMER-TERMS.md` §6.2, not the `APP-FLOW.md` mock |
| K-19 | `consumer_consents` table + timestamped record | P0 | 0.5d | K-18 | **VALID** | Dev | In neither migration. Evidence of the express request. `M-P1-3` applies — assert against the live database, not the migration |
| K-20 | Confirmation email repeats the notice verbatim | P0 | 0.5d | K-18 | **VALID** | Dev | `lib/leads/notify.ts` is the mechanism and it exists. *Verbatim* means verbatim against `K-17`'s corrected wording. This is a second delivered copy of a legal text, so the `check:legal:parity` reasoning applies: assert against what the reader receives |
| K-14 | Path Finder -> contact prefill | P1 | 0.5d | K-07, K-13 | **VALID** | Dev | Both Depends true |
| K-15 | Cross-division prompt, confirmation only | P1 | 0.5d | K-13 | **VALID** | Dev | Never mid-funnel |

## Epic O — Content

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| O-01 | **Obtain author consent for ≥12 titles** | P0 | — | — | TODO | Atik | **Start week 1 — blocks the shelf** |
| O-02 | Publish 12 books with retailer links | P0 | 2d | R-01, O-01 | TODO | Content | Every link verified |
| O-03 | 10 service pages | P0 | 5d | P-07 | TODO | Content | |
| O-04 | 8 case studies, each linked to a title | P0 | 5d | P-08 | TODO | Content | |
| O-05 | Package matrix populated | P0 | 2d | R-10 | TODO | Content | Every exclusion stated |
| O-12 | Platform spec content, 5 platforms | P0 | 1.5d | R-15 | TODO | Content | Verified against live specs |
| O-13 | Marketing package content | P0 | 1d | K-21 | TODO | Content | No-outcome statement on each |
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
| Z-04 | JS-disabled verification | P0 | 0.5d | K-05 | TODO | Dev | Pricing + decision table readable |
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
| Q-P5 | Manuscript Assessment price + deliverable | Atik | K-09 |
| Q-P6 | Ghostwriting: real author hours per stage | Atik | K-11 |
| Q-P7 | Content Programme tiers, SLAs, notice | Atik | K-12 |
| Q-P8 | ~~Imprint / ISBN~~ **RESOLVED** — author's own ISBN, author is publisher of record, no Gridsmith imprint | — | — |
| Q-P11 | Marketing package contents and prices | Atik | K-21, K-22 |
| Q-P12 | Platform spec detail per platform — needs someone who has actually submitted to each | Atik | R-15, R-16 |
| Q-P10 | Pro-rata calculation method for early-start cancellation | Atik + solicitor | K-18 |

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
