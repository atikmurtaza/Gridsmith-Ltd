# Gridsmith production programme status

> **19 September 2026 — GS-R002 superseding status:** Design implementation is complete locally; staging CI/Preview verification is pending on `staging/gs-r002-design`, based on accepted `eda5f3ae`. **GS-O008 APPROVED** by the owner; minor Master polish deferred to final cross-division comparison. **GS-O020 CLOSED — PUBLISH** preserved. **GS-O019 resolved for capability detail**; two development-only service records expanded, no group/count change. Main remains `fbecbe01`; production remains NOT READY. The older GS-R001-M status below is historical. Current evidence: `GS-R002-DESIGN.md`.

**Programme:** controlled production readiness

**Status:** ACTIVE — **`GS-R001-M` is complete in the repository.** The owner reviewed the
`GS-R001-R` candidate and **rejected the Master homepage's visual direction** — the grid, the three
coloured division boxes and the line-art background animation. `GS-R001-M` redesigned the Master
homepage only. **`GS-O008` remains OPEN — AWAITING OWNER RE-REVIEW**, and is not closeable by an
agent.

**Current task:** `GS-R001-M` / `GS-O008` — Master experience redesign, **remediation round R1
complete**: fluid hero (3–4 lines and the CTA above the fold at 14 desktop/zoom sizes), an
exploded-view chapter, no opaque surface over the scene on `/` (footer, header and mobile veils
gone; the scene dims only behind text), the review cylinder restored and redesigned, `GS-O020`
closed as PUBLISH.
Evidence: `docs/_shared/GS-R001-M-MASTER-REDESIGN.md`

**Current commit:** `fbecbe01` at task start; the phase commit and CI are recorded in
`AI-HANDOFF.md`.

**Branches:** `staging/gs-r001-m-master-redesign` carries the candidate and is what Vercel builds
as a **preview**. **`main` was not pushed** this phase (it would start a production-target build);
it stays at `fbecbe01` until the owner accepts `/`.

**What `GS-R001-M` changed.** `/` is a **gold stage** derived from the owner's logo
(`styles/themes/master-stage.css`, measured as a fifth palette) with a **WebGL scene of the mark**
behind the whole page — the logo's eight spheres and six bars ray-traced as polished gold,
travelling through six chapters (declined on software WebGL, where the static logo shows): assembled → split into its two halves → a macro close-up of the
joint → the six bars laid end to end as the process → a ring for the reviews → reassembled
front-on at the close. **No dependency added** — no Three.js, no GSAP: a 5.2KB lazy renderer. The
three coloured cards became a typographic **studio index**; the review cylinder became still
reviews under a held heading; group structure merged into the continuity chapter; Latest insights
removed from Home. Design, Digital and Press untouched. No `GS-R001-R` content, legal, contact,
social or review-safety work reopened.

**Verification:** `verify:static` **47 gates PASS**; `verify:build` PASS on a wiped `.next`
(68 routes, `/` delta **4.4KB of 15KB**, lazy scene **5.2KB of 8KB**); `verify:served` PASS —
`check:axe` **zero violations, 0 unresolved**, `check:master:scene` **all 9 questions at 5 widths ×
6 chapters**, `check:mark:cls` **0.0000** at 375/768/1440. `npm audit --omit=dev`: 0
vulnerabilities. **CI `35318073725` `success`** on `e298f576` after two red runs whose findings
changed the design (software WebGL froze the page; an image fallback became a late LCP).
Lighthouse `/` on the GPU-less runner (the fallback path): desktop **1.00 / LCP 578ms / TBT 0ms**,
mobile **0.99 / LCP 1,631ms / TBT 88ms**, CLS 0.000 both.

**Staging:** `dpl_HbdjFaGDUSYsEJetzcb3oUuD224J` **READY** at
`gridsmith-ltd-git-staging-gs-r001-7c084d-atikmurtazas-projects.vercel.app` — SSO-protected,
`noindex`. `gridsmith.uk` unchanged on Hostinger.

**New owner actions:** `GS-O018` (Press capability gaps), `GS-O019` (Design capability gaps).
**`GS-O020` CLOSED — PUBLISH** at R1; the pinned review set is 13 / 11 / 2.

**RC status:** `GS-R001`'s **TECHNICALLY PASS** stands. **Production readiness: NOT READY.**

**Last updated:** 18 September 2026 (`GS-R001-M`)

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
| Master review presentation | **Still reviews since `GS-R001-M`** — a held heading beside the list; nothing moves by itself, so SC 2.2.2 has no subject and there is no pause control. Verbatim, attribution on each, one profile link. `check:reviews:ui` questions 3, 4 and 9 rewritten |
| Service copy remediation | **IMPLEMENTED at GS-P06** in `scripts/service-content.mjs` — media-buying denial, ownership absolutes, hosting-resale prohibition, categorical accessibility claim, combative guarantees and five accusatory summaries. `check:service-content` question 4 refuses eleven struck phrasings |
| Brand assets | **SUPPLIED AND VERIFIED at `GS-R001-R` (`GS-O007`)** — `public/brand/` holds the owner's `gridsmith-logo.svg`, `gridsmith-logo.png` and `gridsmith-logo-3d.png`. All three are the **mark alone**; measured against each other before use (shape IoU 0.9624 PNG-vs-SVG, **zero XOR pixels surviving two erosions**). The **SVG** is the header logo on all 77 routes and the geometry source for the Master animation; neither PNG is modified and neither is rendered. **No favicon** — there never was one, and `GS-R001-R` §22 forbids deriving one |
| Master background mark | **REPLACED at `GS-R001-M`.** The `GS-R001-R` hairline layer was rejected at `GS-O008` and deleted. `/` now carries `MasterScene`: a fixed WebGL layer ray-tracing the logo's 8 spheres and 6 bars as polished gold, six chapter poses, lazy (5.2KB gz), renders only on change, reduced motion = one still hero frame, no-WebGL or software-only WebGL = the logo as inline vector shapes (never an LCP candidate). `aria-hidden`, no focusables, no pointer events, outside `<main>`. Gate: `check:master:scene` (9 questions, rendered pixels) and its self-test |
| Base token layer | **41 tokens**, was 39 — `--dur-cycle` / `--dur-cycle-narrow` added for the ambient loop |
| Company and contact facts | **SUPPLIED AND IMPLEMENTED at `GS-R001` (`GS-O004`)** — `Gridsmith Ltd` · `17050842` · **registered in England** · `contact@gridsmith.uk` · `+44 7405 448534` · **no business hours** · *"We typically respond within 48 hours."* · registered office in the statutory footer and `_legal/` only · **no public team**. One source (`companyDetails`), asserted on the served pages by `check:company` |
| Insights content model | **EDITORIAL BRIEFS since `GS-R001-R`.** `post.status` is a closed list (`brief`/`draft`/`published`) enforced on write; all three post queries filter `status == "published"` by **strict equality, never `coalesce`**. Nine briefs carry premise, reader, central question, arguments, structure and research questions. `/insights/[slug]` builds **zero** pages, so an unpublished post has no URL rather than a hidden one |
| Public contact channels | **EMAIL, WHATSAPP, SMS since `GS-R001-R`.** `tel:` is **prohibited on every route** and `telHref` is deleted; `whatsAppHref` and `smsHref` replace it, both derived from the displayed number. The statutory footer renders the number as **text**, because that block is a legal disclosure and not a contact surface. No hours, no SLA, no guarantee — `GS-O004` unchanged |
| Public team members | **NONE.** `Q-M9` answered. `/about` was publishing four `[SEED] Placeholder Name` records because the seed set `isPublic: true`; the query, the type, the renderer and its CSS are deleted and the type is dormant |
| SEO surface | **BUILT at `GS-R001`** (`G-04`, `G-05`) — `robots.ts`, `sitemap.ts`, per-route canonicals, Open Graph, `Organization` JSON-LD. **Default is `Disallow: /`, an empty sitemap and `noindex` on every page**; indexing needs a Vercel production deployment **and** an explicit `NEXT_PUBLIC_SITE_URL` |
| Legacy URL inventory | **COLLECTED at `GS-R001`** (`G-01`) — **eight URLs**, read from the live site's own `wp-sitemap.xml`. Four are WordPress/theme defaults. `redirects/legacy.json` stays empty: cutover is prohibited and one row is an owner decision (`LIVE-SITE-EXTRACT.md` §13) |
| Gate count (`GS-R001-M`) | **47** — `check:master:scene:selftest` added to the static chain; `check:master:scene` replaces `check:mark:field` in the served chain; `check:mark:guard` retired with its subject. `check:contrast` measures **5 palettes** (44 pairs, 185 cells); `check:struck` **19 rules / 38 specimens** (`GS-R001-M-DIVISION-CARDS`) |
| Gate count | **46** at `GS-R001-R`, was 45 — `check:mark:field` is new (7 viewport/motion cases over the background layer, reading the **rendered transform** rather than the animation's own report). `check:company` grew questions 7 and 8 rather than a new gate appearing over the same subject — `check:company` grew **questions 7 and 8** (call channel, placeholder markers in served text) rather than a 46th gate appearing over the same subject. Its self-test moved 35 → **57** cases. Question 8 found `/press/path-finder` serving `[SEED]`, a route no finding had raised |
| Legacy gate count note | **45**, was 43 — `check:company` (served, six questions) and `check:company:selftest` (35 cases) |
| Struck-rule registry | **18 rules**, was 16 — `GS-R001-R-CALL-CHANNEL` and `GS-R001-R-SEED-POSTS`, each annotated in place, specimen-proven, and each with its own deliberate-failure branch and a *not-a-subject* case. `ZERO-SUBJECT` count moved 16 → 18 |
| Previous struck-rule registry | **16 rules**, was 13 — `GS-O004-BUSINESS-HOURS-FIELD`, `GS-O004-RESPONSE-GUARANTEE`, `GS-O004-PUBLIC-TEAM-ROSTER`, each annotated in place and specimen-proven |
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
`development` dataset and reached **`READY`**: `dpl_J9Xwajt5jHME5tH7CqVcASvGzAa5`, target `null`,
at `gridsmith-ltd-git-staging-gs-r001-8a292a-atikmurtazas-projects.vercel.app`. The `main` push
produced production-target `dpl_FD1MW6Pj7bjar77Razf5aYsxrCbx`, state **`ERROR`** — `check:launch`
refusing the empty production dataset through the `prebuild` hook, which is `GS-T005` and is the
gate working. Nothing published. **Vercel Authentication is enabled for every deployment
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
- `GS-O007` — **brand-asset limb CLOSED at GS-R001-R.** The owner supplied the logo; it is
  verified, integrated and gate-asserted. Three narrow decisions remain: a favicon (there has
  never been one), an Open Graph card composition, and the one redirect row — now cutover
  hygiene rather than a blocker.
- `GS-O010` — provision an isolated non-production Supabase target for Preview.
- *(`GS-O017` was raised and closed inside `GS-R001-R` — see the closed list below.)*

### Technical blockers

- `GS-T004` — controlled production activation of the GS-P01 security migration.
- `GS-T005` — production Sanity dataset/content path incomplete; seed content must never be promoted.
- Notification reconciliation and live RLS-drift scheduling/credential verification remain later
  operational work.

### Closed in GS-R001-R

- `GS-O017` — **raised and closed in the same phase, on owner-supplied evidence.** The owner
  identified `github.com/atikmurtaza/gridsmith-working` — their own earlier implementation — as
  where the social links are configured. **Eight channels published**, each resolved before
  publication: Facebook, Instagram, LinkedIn, X, TikTok, YouTube, Reddit and Freelancer.
  **It corrected an earlier conclusion in the same phase**: a generic search had attributed
  `facebook.com/gridsmith` and `linkedin.com/company/gridsmith` to an unrelated Seattle design
  studio, and both are Gridsmith Ltd's. Two configured links were **not** published — a Gmail
  compose link to the superseded legacy address, and a Reddit share permalink carrying tracking
  parameters, normalised to the canonical profile. `check:company` question 9 asserts all eight
  on `/about` and refuses any unapproved social host on any route. **COMPLETED.**
- `GS-O016` — **the owner confirms Gridsmith Ltd is registered with the ICO and is paying the
  applicable data-protection fee.** Recorded as owner-supplied compliance evidence and
  **published nowhere**: `GS-R001-R` §12 forbids turning it into marketing copy, and
  `companyDetails.icoRegistration` stays **unset** because the owner supplied the position and
  not the number. The registration number, renewal date and fee tier were **not invented**; if
  a later legal gate needs the number it is one owner fact and one field. **This does not
  advance `GS-O003`** and no broader privacy readiness is marked complete from it. **COMPLETED.**

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
