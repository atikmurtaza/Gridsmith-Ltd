# Gridsmith production programme status

**Programme:** controlled production readiness

**Status:** ACTIVE — GS-R001 produced a **staging release candidate** and closed the two owner
decisions it was given: `GS-O004` (company and contact facts) and `GS-O015` (third-party review
safety). Production migration, production content activation and deployment remain deferred

**Current task:** `GS-R001` / `GS-O008` — staging release candidate and human-acceptance
preparation. Evidence: `docs/_shared/GS-R001-STAGING-RC.md`

**Current commit:** `1ad462ff276c7d03079f5b9afbca908cbbfc0b24` at task start; the ending commit is
the GS-R001 commit containing this record (`git rev-parse HEAD`)

**Branch:** `main`, tracking `origin/main`. The candidate is cut on a **branch**, deliberately —
a branch push produces a Vercel *preview*, which builds against the `development` dataset and
reaches `READY`; a push to `main` produces a production-target build, which has ended `ERROR` on
the empty production Sanity dataset since `GS-P00` and is not a candidate anybody can evaluate

**Working tree:** clean at task start, 0 ahead / 0 behind, no unrelated owner work.

**CI/build:** local **45-gate** static chain, clean production build on a wiped `.next`, bundle
budgets, secrets lint and the full served chain pass. **Starting CI:** run `35084597904`
**`success`** on `1ad462ff`, verified before any work began. Lighthouse cannot run locally on
Windows and is CI's to answer — **and it answered.** Run `35144458922` went `failure` on the
first push: desktop `categories.seo` **0.66** against a `>= 0.9` floor, because `G-04` made every
page `noindex` and Lighthouse's `is-crawlable` is then correctly 0. The floor was **not** lowered
and the `noindex` was **not** removed: the category assertion now applies only to an indexable
build, and otherwise the eight substantive SEO audits are asserted individually at 1 with only
`is-crawlable` off — stricter than the floor it replaced. `GS-R001-STAGING-RC.md` §5.3.

**RC status:** **TECHNICALLY PASS.** **Production readiness: NOT READY.** They are different
statuses — `GS-R001-STAGING-RC.md` §8 lists the thirteen items still owed and who owns each.

**Last updated:** 16 September 2026 (`GS-R001`)

## Service architecture (GS-P03)

`docs/_shared/SERVICE-ARCHITECTURE.md` is the ADR and the service model.

- **Master** is the relationship layer, not a production studio. Engagement models are recorded but
  have no CMS type or route until approved copy exists.
- **Design:** Brand & Visual · Illustration · Motion · 3D & Visualisation · Technical.
- **Digital:** Web · Software · Apps & Interactive · Automation & Intelligence · Operate & Improve.
- **Press:** Writing · Editorial · Publishing · Content & Promotion.
- Capability groups are closed, division-bound architecture (`lib/services/architecture.ts`);
  individual services are CMS content.
- Cross-division boundaries (cover design, website copy, SEO, digital marketing) are recorded and
  enforced by the division-bound group rule.
- Contextual CTAs: **Discuss Your Requirements** / **Get a Design Quote** / **Discuss Your Project** /
  **Discuss Your Book or Content**, universal **Contact Gridsmith**. All reach the one enquiry form,
  carrying division and service context, through the unchanged GS-P01 server-only writer.

## Commercial-model state

| Control | State |
|---|---|
| Public price fields (`service.pricingModel`, `pricingBlock`, package prices) | **REMOVED**; `check:schemas` refuses any price field |
| Price renderers (`Price.tsx`, service cards, service page) | **REMOVED** |
| Digital estimator `/digital/estimate` | **REMOVED from launch**; non-price scoper deferred |
| Public portfolio (`/work`, homepage and landing work blocks, `/approach` grid) | **REMOVED** |
| `project`, `book`, `publishingPackage` types | **DORMANT** for future consented use |
| Press Path Finder | **UNCHANGED** |
| Technical Design publication gate | **ACTIVE** — production refuses unconfirmed technical services |
| Development Sanity dataset | **RECONCILED at GS-P04**, untouched by GS-P05 and by GS-P06. Neither made a Sanity call of any kind. The six genuine testimonial records remain and are no longer read by anything rendered |
| Per-service routes | **ALL THREE DIVISIONS** since GS-P04 — one shared template, 46 pages |
| Route count | **77**, unchanged by GS-P06. `/` is still prerendered static and now revalidates every 24 hours |
| Approved service catalogue | `lib/services/catalogue.ts` — 81 services, coverage gate-enforced |
| Digital Marketing / campaign management | **CONFIRMED** as a cross-division engagement; no fourth discipline, no new group, type or route |
| Marketing channel services | **CONFIRMED at GS-P05** (`GS-O012`) — 8 of 9; six new engagement rows, no new architecture |
| Paid media | **RESOLVED at GS-P06** (`GS-O013`) — denying media buying contradicted the channels already confirmed. One nineteenth engagement row; catalogue unchanged at 81; `Media buying` stays in `UNCONFIRMED_CHANNEL_SERVICES` on the narrower reading that no service **record** may claim it |
| Freelancer reviews | **12** available, **10 published**, 2 withheld. `GS-O015` **CLOSED at GS-R001**: the two stay withheld, and the withholding moved from a hardcoded id list to `namedThirdParty`, a deterministic rule that reaches reviews nobody has seen. `check:reviews --live` pins the set a person has read, so a new review makes it red rather than reaching the homepage unread |
| Freelancer review retrieval | **ACTIVATED at GS-P06** — official API, no credential, 24h cache, no stored copy, `/` revalidates daily. `GS-O014` closed |
| Freelancer review placement | **MASTER ONLY** (`GS-O014` amendment). Division review blocks removed; `TestimonialList`, both testimonial queries and the `TestimonialCard` type deleted. `check:reviews-ui` asserts presence on `/` and absence on all three divisions in one run |
| Master review presentation | 3D cylinder carousel, right to left, seamless, CSS only, zero client JS, pause control (WCAG 2.2 SC 2.2.2), flat grid under `prefers-reduced-motion` at full content parity |
| Service copy remediation | **IMPLEMENTED at GS-P06** in `scripts/service-content.mjs` — media-buying denial, ownership absolutes, hosting-resale prohibition, categorical accessibility claim, combative guarantees and five accusatory summaries. `check:service-content` question 4 refuses eleven struck phrasings |
| Base token layer | **41 tokens**, was 39 — `--dur-cycle` / `--dur-cycle-narrow` added for the ambient loop |
| Company and contact facts | **SUPPLIED AND IMPLEMENTED at `GS-R001` (`GS-O004`)** — `Gridsmith Ltd` · `17050842` · **registered in England** · `contact@gridsmith.uk` · `+44 7405 448534` · **no business hours** · *"We typically respond within 48 hours."* · registered office in the statutory footer and `_legal/` only · **no public team**. One source (`companyDetails`), asserted on the served pages by `check:company` |
| Public team members | **NONE.** `Q-M9` answered. `/about` was publishing four `[SEED] Placeholder Name` records because the seed set `isPublic: true`; the query, the type, the renderer and its CSS are deleted and the type is dormant |
| SEO surface | **BUILT at `GS-R001`** (`G-04`, `G-05`) — `robots.ts`, `sitemap.ts`, per-route canonicals, Open Graph, `Organization` JSON-LD. **Default is `Disallow: /`, an empty sitemap and `noindex` on every page**; indexing needs a Vercel production deployment **and** an explicit `NEXT_PUBLIC_SITE_URL` |
| Legacy URL inventory | **COLLECTED at `GS-R001`** (`G-01`) — **eight URLs**, read from the live site's own `wp-sitemap.xml`. Four are WordPress/theme defaults. `redirects/legacy.json` stays empty: cutover is prohibited and one row is an owner decision (`LIVE-SITE-EXTRACT.md` §13) |
| Gate count | **45**, was 43 — `check:company` (served, six questions) and `check:company:selftest` (35 cases) |
| Struck-rule registry | **16 rules**, was 13 — `GS-O004-BUSINESS-HOURS-FIELD`, `GS-O004-RESPONSE-GUARANTEE`, `GS-O004-PUBLIC-TEAM-ROSTER`, each annotated in place and specimen-proven |
| Freelancer review project titles | **ANONYMISED** — 6 by hand at GS-P04, and all 12 mechanically by the GS-P05 pipeline, from Freelancer's closed skill taxonomy. No quote altered |

## Development content state (GS-P04)

**Sanity project `spzu6y31`, dataset `development`** — positively identified before any mutation,
and distinct from the `production` dataset name the launch gate keys off.

| | Before | After |
|---|---|---|
| Published documents | 140 | 132 |
| `service` | 30, no capability group, all priced | 46, all grouped, no price field exists |
| `project` | 24 | 0 |
| `testimonial` (genuine, `isSeed: false`) | 6 | 6, titles anonymised |
| `companyDetails` (genuine) | 1 | 1 |
| Sanity `system.*` | 12 | 12 |
| Drafts | 0 | 0 |

46 obsolete seed documents were deleted **by provenance, never by type**: a candidate had to carry
both `isSeed: true` and an `_id` beginning `seed-`, and a disagreement between the two markers
stops the run. Genuine records match neither and were never candidates. The run is idempotent — a
second immediately afterwards deleted nothing and wrote the same 119.

**The production dataset was not read, not written and not contacted.**

## Supabase state

**Project:** `dqiutgmxillhsbzgnlsx` (`Gridsmith Project`) — unchanged by GS-P03, GS-P04, GS-P05,
GS-P06 and **GS-R001**, none of which made a Supabase call of any kind.

Production still records migrations `0001`–`0003`; the GS-P01 security migration is **not applied**.
`GS-T004` remains **REMEDIATED IN REPOSITORY / OPEN IN PRODUCTION / READY FOR CONTROLLED ACTIVATION**.
GS-P03 made no Supabase call. The lead schema, RLS and migrations are unchanged; the Server Action
additionally maps the already-existing, already-bounded `service_slug` column.

## Vercel state

**Project `gridsmith-ltd` has no custom domain and `live: false`.** `gridsmith.uk` points at
Hostinger, so **a production-target deployment cannot replace the live site**, and every one since
`GS-P00` has ended `ERROR` on the empty production Sanity dataset (`GS-T005`).

`GS-R001` cut the staging release candidate as a **branch preview**, which builds against the
`development` dataset and reaches `READY`. **Vercel Authentication is enabled for every deployment
except custom domains**, so the candidate answers 401 to a crawler; `app/robots.ts` serves
`Disallow: /` and every page carries `noindex, nofollow` as the second and third locks. All three
read one `INDEXABLE` constant, so they cannot disagree.

**The documented production switch is one variable:** `NEXT_PUBLIC_SITE_URL=https://gridsmith.uk`
on the Production environment. Until it is set on a production deployment nothing is indexable,
the sitemap is empty, and canonicals resolve to the deployment's own origin — which is correct for
a preview and avoids pointing production URLs at a site this build does not serve.

Preview remains non-isolated at the **database** level (`GS-O010`), which is why no synthetic lead
was submitted.

## Production state

| Control | State |
|---|---|
| Production readiness | **NOT READY** — distinct from the RC status, which is **TECHNICALLY PASS** |
| `GS-T004` live remediation | **OPEN — PRODUCTION UNCHANGED** |
| Production deployment authorisation | **NOT AUTHORISED** |
| `gridsmith.uk` cutover | **PROHIBITED until a dedicated production-release phase** |
| Latest completed phase | `GS-R001` when its commit and push are complete |
| Next recommended phase | See `AI-HANDOFF.md` — recommendation only |

## Authoritative decisions

- `GS-D001` — public portfolio evidence requiring unavailable client/author permission is not a
  production dependency. **Implemented at GS-P03.**
- `GS-D002` — public fixed, starting, indicative, package or estimator-generated prices are not a
  production dependency. **Implemented at GS-P03.**

## Active blockers

### Owner blockers

- `GS-O003` — complete solicitor review and resolve legal launch actions.
- `GS-O005` — confirm engineering/CAD professional-indemnity scope (now gate-enforced).
- `GS-O007` — **narrowed at GS-R001.** Approved logo/favicon/brand imagery, and a decision on the
  one redirect row evidence cannot settle. The URL inventory and the SEO metadata limbs are done.
- `GS-O010` — provision an isolated non-production Supabase target for Preview.
- `GS-O016` — **new at GS-R001.** Confirm the ICO registration position. It was a clause inside
  `GS-O004`'s original wording that the `GS-O004` brief did not answer, lifted out so closing that
  action could not silently close it. Blocks nothing; the site makes no claim either way.

### Technical blockers

- `GS-T004` — controlled production activation of the GS-P01 security migration.
- `GS-T005` — production Sanity dataset/content path incomplete; seed content must never be promoted.
- Notification reconciliation and live RLS-drift scheduling/credential verification remain later
  operational work.

### Closed in GS-R001

- `GS-O004` — **operational company and contact facts supplied, implemented and gate-asserted.**
  One canonical source, six surfaces, and **two facts corroborated against the public Companies
  House register**, which closes checklist rows `A1` and `A2` that had been open since 7 September
  as *"confirm against the register"*. The register gives `GRIDSMITH LTD`, **active**, incorporated
  24 February 2026, registered office `30 Briarfield Road, Farnworth, Bolton, England, BL4 0HD` —
  the same premises as the seed, with the **digit zero**, so the live site's `BL4 **O**HD` is the
  malformed one. **COMPLETED.**

  **Its load-bearing limb was the one nobody had asked about.** The served `/about` was publishing
  four people named `[SEED] Placeholder Name` under the heading *"Who you will work with"*. The
  schema defaults `isPublic` false and the seed set it `true` on all four records, so **nothing in
  the source was wrong** and six phases, an accessibility audit and a content audit went past it.
  `Q-M9` is answered — no public team — and it is enforced by deleting the query and the renderer
  rather than by a boolean anyone can flip.
- `GS-O015` — **the two reviews stay withheld, and the withholding now reaches reviews nobody has
  seen. COMPLETED.** A hardcoded list of two ids became `namedThirdParty`, a deterministic rule
  that withholds any body naming a business other than Gridsmith. It does **not** attempt to
  detect disparagement — that is the unreliable classification the owner ruled out — so it
  over-withholds by design. Measured live: the same **10 published, 2 withheld**, each named by
  the business it matched, with no collateral withholding of the other ten. The manual list
  remains as the human-review limb for what no rule reaches, and `check:reviews --live` pins the
  set a person has read so a new review makes it red rather than reaching the homepage unread.

### Closed in GS-P06

- `GS-O013` — **approved with remediation, and closed because the remediation is implemented in
  the canonical content source**, not in a review document. Six classes of correction; the service
  architecture, the 46 records, the 81 capabilities, the no-pricing and no-portfolio positions and
  the Technical Design gate are all unchanged. **COMPLETED.**
- `GS-O014` — **approved with the Master-only amendment, and closed on verified implementation.**
  The pipeline is live on `/`, the division review blocks are gone, and the one-source property is
  real: the CMS reader, its type and its component were deleted in the same commit. **COMPLETED**,
  with the published *count* carried forward as `GS-O015` rather than silently absorbed.

### Closed in GS-P05

- `GS-O012` — eight of the nine marketing channel services confirmed as current capabilities and
  represented as six new `DIGITAL_MARKETING_ENGAGEMENT` rows; no new division, group, CMS type,
  route or orchestration. `Media buying` was not confirmed and is not inferred. **COMPLETED.**
- **The `GS-P04` 12-vs-6 review finding, corrected.** Twelve reviews verified independently
  against `freelancer.com/u/GridsmithLTD` and the official API. The repository's six were an
  incomplete ingestion, not the whole of the evidence, and the owner's figure was right. No owner
  action is owed; `GS-P04`'s record is preserved and annotated rather than overwritten.

### Closed in GS-P04

- `GS-O006` — every listed Design, Digital and Press service approved. **COMPLETED.** Copy
  acceptance moved to `GS-O013` rather than being closed with the list.
- `GS-O011` — Digital Marketing confirmed as a cross-division engagement; review project titles
  anonymised. **COMPLETED.** Narrow remainders are `GS-O012` and `GS-O013`.
- `GS-T007` — development dataset reconciled under the owner’s explicit authorisation: 46 obsolete
  seed documents deleted by provenance, 119 written, genuine records preserved, run idempotent.
  **CLOSED.**

### Closed in GS-P03

- `GS-O002` — service inventory supplied and recorded. **COMPLETED.**
- `GS-T001` — pricing required by schema and renderers. **CLOSED in repository.**
- `GS-T002` — price-producing Digital estimator. **CLOSED** — route removed.
- `GS-T003` — public work/case-study/book surfaces and gates. **CLOSED in repository** — routes and
  blocks removed, types dormant, gate lists updated.

### External-review blockers

- `GS-X001` — solicitor review of the legal instruments and the impact of `GS-D001`/`GS-D002`.
- `GS-X002` — professional review appropriate to engineering/CAD claims and the drawing matrix.

### Human-acceptance blockers

- `GS-R001` — **PARTIALLY DISCHARGED, 16 September 2026.** Keyboard, responsive (375/768/1440/wide),
  Chromium, content and accessibility-automation passes are done and recorded in
  `GS-R001-STAGING-RC.md` §7. **Three items remain and are not claimed as done: a real
  screen-reader pass, a physical-device touch pass, and Firefox/Safari** — none of those engines
  or tools is available in this environment, and `check:axe` passing is not a screen-reader test.
- `GS-R002` — owner acceptance of all four sections together before production release.
- `GS-R003` — live post-cutover verification before any `PRODUCTION READY` declaration.

## Detailed registers

- **Staging release-candidate evidence: `docs/_shared/GS-R001-STAGING-RC.md`**
- Service model and reconciliation: `docs/_shared/SERVICE-ARCHITECTURE.md`
- GS-P02 evidence and activation plan: `docs/_shared/GS-P02-SECURITY-MIGRATION-REPLAY.md`
- Owner dependencies: `docs/_shared/OWNER-ACTIONS.md`
- Current phase handoff and verification: `docs/_shared/AI-HANDOFF.md`
- Permanent agent controls: `docs/_shared/AI-DEVELOPMENT-PROTOCOL.md`
- Dependency ordering: `docs/_shared/02-BUILD-SEQUENCE.md` (GS-P00 section is authoritative)
- Historical detail: division project trackers and `docs/_shared/05-HANDOVER.md`
