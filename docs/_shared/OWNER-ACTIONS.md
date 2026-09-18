# Owner actions

This register contains only decisions, evidence, credentials or external actions that require the
owner. Implementation remains agent work. Public prices and public portfolio/case-study content are
not requested under `GS-D001` and `GS-D002`.

## ACTIONABLE NOW

### `GS-O003` — Complete legal review and resolve launch actions

- **Status:** ACTIONABLE NOW
- **Why required:** the repository contains solicitor-ready drafts, not confirmed legal advice, and
  some historical clauses/copy assume public portfolio use or public prices.
- **Exact action:** send the legal set and `GS-D001`/`GS-D002` to a UK solicitor; resolve consumer
  cancellation, portfolio permission/defaults, pricing/quotation wording, liability and privacy
  actions without asking the coding agent to invent clauses.
- **What it blocks:** final public legal copy and consumer/commercial flows.
- **Evidence required:** dated written review and a closed decision list.

### `GS-O005` — Confirm professional-indemnity scope for engineering/CAD work

- **Status:** ACTIONABLE NOW
- **Why required:** engineering drawing claims and scope controls require a verified insurance and
  professional-review position.
- **Exact action:** obtain written broker/insurer confirmation of whether the policy covers the
  intended engineering/CAD services, exclusions and limits.
- **What it blocks:** affected Design claims and any higher-risk engineering launch content. Since
  `GS-P03` this is enforced: `check:launch` refuses a production dataset containing a published
  Technical-group service without `professionalScopeConfirmed`. That flag may be set only once this
  action and `GS-X002` are closed.
- **Evidence required:** written broker/insurer confirmation; do not put policy documents in source.

### `GS-O007` — Brand assets supplied; three small decisions remain

- **Status:** ACTIONABLE NOW — **narrowed three times.** `GS-R001` answered the URL-inventory and
  SEO-metadata limbs. `GS-R001-R` reduced the redirect limb to cutover hygiene **and closed the
  brand-asset limb**: the owner supplied the logo at the phase's owner gate on 17 September 2026.
- **Supplied, verified and in use.** `public/brand/` holds `gridsmith-logo.svg`,
  `gridsmith-logo.png` and `gridsmith-logo-3d.png`. All three are the **mark alone** — no
  wordmark, no lockup — and all three were measured against each other before any was used:
  content aspect ratios 1.0293 / 1.0302 / 1.0302, shape IoU 0.9624 (PNG vs SVG), and **zero XOR
  pixels surviving two erosions**, so the vector is the raster's geometry rather than an
  approximation. `GS-R001-R-REMEDIATION.md` §8 is the record.

  The **SVG** is the header logo on all 77 routes and the geometry source for the Master
  background animation. Neither PNG is modified; neither is currently rendered.
- **What remains, and it is three narrow decisions rather than an open action:**
  1. **The favicon.** `GS-R001-R` §22 says to keep the existing one and not to derive it from
     the logo. **There was never one** — the repository held zero image files before this phase.
     A favicon is its own design decision (a 24px-legible mark is not a scaled 1024px one), and
     nothing was created. Say whether you want one and supply it, or confirm none for now.
  2. **An Open Graph social card.** Now unblocked and not composed. A card needs a background,
     a decision about whether the wordmark appears, and safe margins — brand choices, not
     implementation ones. `gridsmith-logo-3d.png` is the right source when you take them.
     Until then Open Graph declares a title and a description and no image, which is honest.
  3. **The one redirect row**, below.
- **The redirect limb, reduced at `GS-R001-R` on the owner's commercial reading.** The owner
  confirms the current `gridsmith.uk` is a basic corporate presence used for social profile
  links, business and banking verification, and general online presence — **not** an actively
  promoted acquisition property, not a paid-ad landing environment, not a material
  lead-generation channel, and not known to carry valuable campaign traffic.

  **So a comprehensive legacy redirect programme is not a launch blocker.** What remains is
  lightweight release hygiene *at cutover*: re-read the eight live URLs, map the obvious and
  trivial equivalents, preserve the root domain, avoid known 404s. `redirects/legacy.json` stays
  empty and **no redirect is activated** — cutover is `GS-O009`.

  **The one row evidence cannot settle is still not settled, and is no longer urgent.** The live
  `/terms-and-conditions/` is a single instrument this build splits into `/legal/terms`,
  `/legal/business-client-terms` and `/legal/consumer-client-terms`; `LEGAL_DOCUMENT_SLUGS`
  already records that a redirect picking one target is wrong for half the people following it.
  `LIVE-SITE-EXTRACT.md` §13.3 sets out the options. Decide it at cutover.
- **Answered at `GS-R001` and unchanged:** the eight-URL inventory, read from the live site's own
  `wp-sitemap.xml` and recorded in `LIVE-SITE-EXTRACT.md` §13; and per-route SEO titles,
  descriptions, canonicals, Open Graph and `Organization` structured data (`G-04`).

### `GS-O010` — Provide an isolated Supabase target for Vercel Preview

- **Status:** ACTIONABLE NOW
- **Why required:** GS-P02 could not prove that Preview is separated from the production Supabase
  project. The organisation has no Supabase branch and no second accessible non-production project,
  so a Preview submission could reach production data.
- **Exact action:** choose and provision a clearly non-production Supabase branch/project without
  silently enabling a paid plan; then set Preview's public Supabase variables and a distinct Preview
  service-role secret through the secure Vercel dashboard. Never paste either service-role secret
  into chat, documentation, source or a `NEXT_PUBLIC_` variable.
- **What it blocks:** safe hosted Preview end-to-end testing of the server-only lead writer. Until
  closed, do not submit test leads in Preview and do not copy the production service-role secret into
  Preview.
- **Evidence required:** non-production project reference and lifecycle state, secure Vercel
  presence/scope confirmation, and an authorised synthetic Preview submission proved to land only in
  that isolated target. If provisioning would add cost, obtain explicit approval before enabling it.

## BLOCKED/DEPENDENT

- `GS-O008` — **ACTIONABLE NOW, and it is the live owner task. `AWAITING OWNER RE-REVIEW.`**
  A staging release candidate exists and was reviewed once: `GS-R001` produced it,
  `RC TECHNICALLY PASS`, and **the owner did not accept the experience.** Eleven findings were
  recorded and `GS-R001-R` implements them — see `GS-R001-R-REMEDIATION.md`.

  **This action is not closeable by an agent and was not closed by that phase.** What it needs
  is a second reading of all four sections by a person. The one item deliberately left
  unfinished is the **Master background logo animation**, which is blocked on the final logo
  asset (`GS-O007`) rather than on effort — building it from an asset nobody has supplied would
  mean inventing brand geometry.

  **What to look at, and what is knowingly absent:** `GS-R001-R-REMEDIATION.md` §1 and §7.

  **Update, 18 September 2026 — `GS-R001-M`.** The owner reviewed the Master homepage again and
  **rejected its visual direction**: the grid, the three coloured division boxes and the
  `GS-R001-R` line-art background animation. `GS-R001-M` redesigned the Master homepage only — a
  gold stage derived from the logo, a WebGL scene of the mark that travels through six chapters,
  a typographic studio index, still reviews. **`GS-O008` stays OPEN — AWAITING OWNER RE-REVIEW of
  the redesigned `/`.** Record: `GS-R001-M-MASTER-REDESIGN.md`. Three decisions ride on that
  review: (1) extend the gold stage to `/about`, `/approach`, `/contact` and `/insights`, or keep
  it on `/` only; (2) whether the Master stage and Design's dark canvas read as too close; (3)
  whether the reviews chapter shows enough of the mark.
- `GS-O009` — authorise production deployment and DNS cutover only in a dedicated production-release
  phase after automated audit and human acceptance.

- `GS-O018` — **Press capability gaps from Book Publishers Den (owner-associated business).**
  Raised at `GS-R001-M`, **not blocking**, for a future Press content phase. Capability evidence
  only — `GS-R001-M-MASTER-REDESIGN.md` §10.1. Decide: add *line editing* and *metadata / listing
  guidance* as named services; whether *translation / bilingual proofreading* is offered, and in
  which languages; whether Gridsmith coordinates *print-on-demand / printing*; whether
  *audiobook production* is offered and what Gridsmith itself provides versus coordinates; whether
  *email marketing* is a confirmed channel; and whether *podcast / guest outreach* is offered
  **without** a placement promise. No price, guarantee, testimonial or identity from that business
  may be imported.
- `GS-O019` — **Design capability gaps from MAD Alpha Designers (owner-associated business).**
  Raised at `GS-R001-M`, **not blocking**, for a future Design content phase — §10.2. Decide:
  whether *Gaming/streamer creative* should enumerate its deliverables (screens, alerts, panels,
  banners, cam frames, chat boxes, emotes, sub badges, intros/outros, animated overlays, logos,
  banners and emotes); and whether any work from that business is Gridsmith's to show (`GS-D001`
  requires permission). Its packages, money-back guarantee and volume claims may not be imported
  (`GS-D002`, non-negotiable #2).
- **Digital** — deliberately not researched. Owner: *"for digital i will tell later."*

## COMPLETED

- `GS-O020` — **CLOSED — PUBLISH, 18 September 2026 (owner decision, `GS-R001-M` R1).** The new
  Freelancer review — **James, 5 / 5, 17 September 2026, Illustration** — is approved for
  publication. `EXPECTED` in `scripts/check-reviews.mjs` moved 12 / 10 / 2 → **13 / 11 / 2** in the
  same commit, and `check:reviews --live` is green again. **This approval covers this review
  only**: the genuine-review and third-party filtering rules are unchanged, and the next new review
  turns the live check red again until a person decides it (`GS-O015`).

- `GS-O017` — **completed 18 September 2026 at `GS-R001-R`, on owner-supplied evidence.** The
  owner identified their earlier Gridsmith implementation,
  **`github.com/atikmurtaza/gridsmith-working`**, as the source of the configured social links.
  It was read **read-only**, and the links were taken from
  `app/src/components/Overlay.jsx`, where each is an **explicitly configured URL** rather than
  something inferred from the word "Gridsmith". Nothing else was taken from that repository.

  **Eight channels published, each resolved before publication:**

  | Platform | URL | Verified by |
  |---|---|---|
  | Facebook | `facebook.com/gridsmith` | rendered page — publishes **`contact@gridsmith.uk` and `07405 448534`**, the approved company email and number |
  | Instagram | `instagram.com/gridsmith_ltd` | rendered page — "Gridsmith Ltd (@gridsmith_ltd)", 36 followers |
  | LinkedIn | `linkedin.com/company/gridsmith` | HTTP 200, title `Gridsmith Ltd \| LinkedIn` |
  | X | `x.com/gridsmithltd` | rendered page — "Gridsmith Ltd (@GridsmithLtd)" |
  | TikTok | `tiktok.com/@gridsmithltd` | oEmbed `author_name: "Gridsmith"` |
  | YouTube | `youtube.com/@Gridsmithltd` | HTTP 200, title `Gridsmith - YouTube` |
  | Reddit | `reddit.com/user/Gridsmithltd` | HTTP 200; a control handle returns an 8KB stub against this account's 321KB page |
  | Freelancer | `freelancer.com/u/GridsmithLTD` | HTTP 200, `GridsmithLTD Profile` — already approved at `GS-O014` |

  **This evidence corrected a conclusion reached earlier in the same phase.** Before it arrived,
  a generic web search had found `facebook.com/gridsmith` and `linkedin.com/company/gridsmith`
  and attributed both to *Gridsmith Studio*, an unrelated surface-pattern designer in Seattle
  whose accounts are at different URLs entirely. The search was right that Gridsmith Studio
  exists and wrong about who owns these two URLs, and no further searching would have settled
  it. **A name is not an identity** — which is why the brief said not to infer accounts from
  the name, and why the owner's own repository was the only thing that could answer it.

  **Two configured links were NOT published, and both are reported rather than quietly dropped:**
  - **The Gmail compose link** to `contact.gridsmith@gmail.com`. That address is on
    `FORBIDDEN_EMAILS`: `GS-O004` approved `contact@gridsmith.uk` and nothing else, and
    `check:company` question 2 refuses the legacy one on every route. Being configured in an
    older build does not revive a superseded fact.
  - **The Reddit *share* permalink** `reddit.com/u/Gridsmithltd/s/CsBkRtMNP8`, which redirects
    to the profile carrying five `utm_*` tracking parameters. The canonical profile URL is
    published instead — a **normalisation of the same account**, not a substitution.

  **Facebook nearly went unpublished on a transport artefact, which is worth recording.** An
  anonymous `curl` returned **HTTP 400** on three URL forms — indistinguishable from a dead
  vanity URL, and the rule is to refuse a dead link. A real browser rendered the page normally:
  the 400 was a bot block. `CLAUDE.md` warns that a probe run over a transport the real client
  does not use can make a live thing look unreachable, and this would have removed a real
  account.

  **Implemented** in `lib/company/social.ts` (the list, the provenance and the per-channel
  evidence) and rendered by `components/content/Connect.tsx` on `/about`. **Gate-asserted:**
  `check:company` question 9 requires all eight on `/about` and refuses **any unapproved social
  host on any route**, so a later session cannot add an unverified account silently. Nine
  self-test cases, including one that refuses the Gridsmith Studio LinkedIn by name.

  **What closing this does not cover:** no social account is claimed to be active or maintained.
  X has 0 posts and Facebook 2 followers; the site links them, it does not describe them.

- `GS-O016` — **completed 17 September 2026 at `GS-R001-R`.** The owner confirms:
  **Gridsmith Ltd is currently registered with the Information Commissioner's Office and is
  paying the applicable data-protection fee.**

  Recorded as owner-supplied compliance evidence. **Nothing about it is published**, and that is
  deliberate on two counts. `GS-R001-R` §12 says not to turn ICO registration into marketing
  copy — it is a legal obligation most UK companies processing personal data have, not a
  differentiator, and the same reasoning that took the company-number card off `/about` applies
  to it. And `companyDetails.icoRegistration` **stays unset**, because the owner supplied the
  *position* and not the *number*: writing a number nobody supplied is the failure
  `AI-DEVELOPMENT-PROTOCOL.md` names, and the site making no claim either way remains the safe
  state.

  **What closing this does not cover, so that nothing is dropped.** The **registration number**,
  the **renewal date** and the **fee tier** were not supplied and were not invented. None is
  needed today because nothing renders any of them. If a later legal gate requires the number —
  most likely the `GS-O003` solicitor pass, which reads the privacy notice — it is one owner
  fact and one field, and this entry is where to start. **Closing this does not advance
  `GS-O003`**, and no broader privacy or legal readiness is marked complete from it.

  **Evidence:** the owner's statement in the `GS-R001-R` brief, 17 September 2026.

- `GS-O004` — **completed 16 September 2026 at `GS-R001`.** The owner supplied the operational
  company and contact facts, and they are implemented in the one canonical source
  (`companyDetails`) and asserted on the served pages by `check:company`.

  | Fact | Value | Where it is now |
  |---|---|---|
  | Registered name | `Gridsmith Ltd` | statutory footer, `/about`, `GroupStructure`, `Organization` JSON-LD |
  | Company number | `17050842` | the same four |
  | Registration wording | **`Registered in England`** | the footer renders *"registered in England"*. It was `England & Wales`, an agent-chosen seed value no owner and no register had confirmed |
  | Public email | `contact@gridsmith.uk` | footer, `/contact`, `/press/contact`, both form components, `/about`, JSON-LD. **The owner confirms the mailbox works and is authorised for publication** — this closes checklist row `A3` |
  | Public telephone | `+44 7405 448534` | footer, `/contact`, `/press/contact`, `/about`, JSON-LD. Displayed with separators, linked as `tel:+447405448534`, derived by `telHref` so the displayed and dialled numbers cannot differ |
  | Business hours | **none published** | the `businessHours` field is **removed** from the schema, the type, the projection and `/contact`, on the `vatNumber` precedent |
  | Response wording | *"We typically respond within 48 hours."* | `companyDetails.responseCommitment`, the single source. Presented as typical behaviour — **not a guarantee, not an SLA, not a maximum** |
  | Registered office | displayed **only** in the statutory footer and in the `_legal/` instruments | withdrawn from `/about`, where it was a second copy of a residential address on a marketing page |
  | Public team | **none** | `/about`'s roster, `listPublicTeam` and the `TeamMember` type are **deleted** |

  **Two facts were corroborated against the public Companies House register** on 16 September
  2026, read read-only, which closes checklist rows `A1` and `A2` that had been open since 7
  September as *"confirm against the register"*: the entry for `17050842` is `GRIDSMITH LTD`,
  **active**, incorporated 24 February 2026, registered office `30 Briarfield Road, Farnworth,
  Bolton, England, BL4 0HD`. Same premises as the seed and the **digit zero** in the postcode, so
  the live site's `BL4 **O**HD` is the malformed one, as `LIVE-SITE-EXTRACT.md` §11.3 suspected.
  The register's country component is `England`, which corroborates the owner's wording.

  **The public-team limb is the one that was not a formality.** The development dataset carried
  four `teamMember` records named `[SEED] Placeholder Name` with `isPublic: true`, and the served
  `/about` published all four under the heading *"Who you will work with"*. The schema defaults
  `isPublic` false and the seed overrode it on every record. Nothing in the source was wrong,
  which is why it survived an accessibility audit, a content audit and six phases. It is fixed by
  deletion rather than by a flag, and `check:company` question 6 asserts the absence on the page.

  **What closing this does not cover, so that nothing is dropped.** `piInsurer`, `piCoverLimit`
  and `icoRegistration` are still unset — the first two are `GS-O005`, and the ICO position is
  now its own row below rather than a clause inside a closed action.
- `GS-O015` — **completed 16 September 2026 at `GS-R001`, approved: keep them withheld.** The
  owner's decision is that the two genuine Freelancer reviews naming a third-party development
  company disparagingly remain **withheld**, and that they are not deleted at source, not
  altered, not paraphrased, not republished and not exposed through hidden page content. All of
  that is the state the site was already in and it is unchanged: nothing was ever published, no
  quotation was edited, and Freelancer still hosts both.

  **The implementation moved, and the move is the substance of the closure.** They were withheld
  by a hardcoded list of two review ids, which cannot reach a review nobody has seen. The owner's
  second requirement — that *future* reviews carrying equivalent statements about identifiable
  third parties are withheld automatically where a safe deterministic rule can decide, and
  otherwise enter a human-review state — is now implemented as those two limbs:

  1. **Deterministic.** `namedThirdParty` in `lib/reviews/freelancer.ts` withholds any body that
     names a business other than Gridsmith — a capitalised name followed by a corporate-form
     token. **It does not attempt to detect disparagement**, which is the classification the
     owner ruled out and which no rule does reliably; it detects that a business is *named*, and
     over-withholds by design. Measured against the live API: the same **10 published, 2
     withheld**, with each withheld review reported by the name it matched. A body naming a
     company nobody has seen is caught by the same rule.
  2. **Human review.** `WITHHELD_REVIEW_IDS` remains as the manual override for what no rule
     reaches — a third party named without a corporate form, *"my previous developer"* — and
     `check:reviews --live` now pins the review set a person has actually read (12 total, 10
     published, 2 withheld). **A changed set makes that gate red and names the difference**, so
     a new review cannot reach the homepage without someone having seen the run that reported
     it. It goes red on a welcome five-star review too; the action either way is to read it.

  **No sentiment or AI moderation system was built**, as instructed. Every limb is a regex or a
  list, and each is broken separately in `check:reviews:selftest` (66 cases) with the returned
  reason asserted. **Negative reviews about Gridsmith remain publishable** and are published —
  the rating on the homepage is not rounded up.
  **Evidence:** this entry, `check:reviews --live`, `check:reviews:selftest`, `check:reviews:ui`.

- `GS-O014` — **completed 16 September 2026 at `GS-P06`, approved WITH AMENDMENT.** The owner
  accepted Freelancer's API terms, accepted publication of every eligible genuine review including
  ones carrying legitimate criticism, and confirmed the attribution wording *"Verified review via
  Freelancer"* with a link to `https://www.freelancer.com/u/GridsmithLTD`.
  **Implemented:** `components/master/Testimonials.tsx` reads the official API through
  `lib/reviews/freelancer.ts`; genuine ratings, dates and bodies are rendered unaltered; the
  category comes from Freelancer's closed skill taxonomy and never from a project title; no
  Freelancer mark, logo or asset is used and no endorsement is implied.
  **The amendment is the load-bearing half.** Reviews appear on the **Master experience only**.
  Division-level review blocks were removed outright, because Freelancer's taxonomy does not map
  onto Design / Digital / Press — it had put a 3D-project review and a logo-design review on
  Press. No speculative division classification was built to replace it.
  `SERVICE-ARCHITECTURE.md` §18, §19, §20. Asserted by `check:reviews`, `check:reviews:live`,
  `check:reviews:selftest` (58 cases) and the new `check:reviews-ui` (ten questions over the
  served page), each proven by deliberate failure.
  **What closing this does not cover, so nothing is dropped:** the *number* published is 10 of 12
  pending `GS-O015`, which is a question this action was never asked. The reviewer-facing terms,
  the attribution and the Master-only placement are all implemented as approved.
- `GS-O013` — **completed 16 September 2026 at `GS-P06`, approved WITH REMEDIATION.** The owner
  approved the 46-record development service catalogue subject to corrections, and **the approval
  closes only because the corrections are implemented in the canonical content source**
  (`scripts/service-content.mjs`), not in a review document:
  - the **media-buying contradiction** removed — the site no longer denies a capability it sells;
    paid media management and placement is a nineteenth `DIGITAL_MARKETING_ENGAGEMENT` row;
  - **ownership absolutes** removed — source-code handover, account access and infrastructure
    arrangements are defined in the written project agreement, with Gridsmith's preference for
    client-controlled arrangements stated as a preference rather than a guarantee;
  - the **hosting-resale prohibition** removed — hosting coordination and management is
    project-specific, and no hosting product, SLA or price was invented;
  - the **categorical accessibility claim** removed — formal certification is not included unless
    explicitly scoped, and Gridsmith reports standards tested, evidence, findings and residual
    issues;
  - **combative guarantee language** professionalised, with every substantive limitation kept;
  - five **service summaries** rewritten from accusatory to client-centred, and the strong ones
    left alone;
  - **continuity wording** now recognises an ongoing engagement as well as further work.
  The architecture was **not** redesigned: 3 delivery divisions, Master as relationship layer, 46
  records, 81 approved capabilities, medium-based ownership, no public pricing, no estimator, no
  public portfolio, Technical Design still gated. `check:service-content` question 4 refuses
  eleven struck phrasings over 969 copy strings, each branch broken separately in the self-test,
  and `docs/_shared/GS-P05-OWNER-CONTENT-REVIEW.md` was regenerated so the approval attaches to
  the corrected wording rather than the reviewed-and-since-edited wording.
  **What closing this does not cover:** per-channel exclusions for the marketing capabilities
  still do not exist, and no channel may be published without its own boundary statement. That is
  now tracked under `GS-O007`'s production-content work rather than left inside a closed action.
- `GS-O012` — **completed 16 September 2026.** The owner confirmed that **eight** of the nine open
  channel/platform services are current Gridsmith capabilities: digital marketing strategy,
  campaign management, Google Ads / PPC management, Meta / Facebook / Instagram advertising
  management, social media account management, Google Business Profile setup and management, email
  marketing campaigns, and the campaign creative, landing-page, content-SEO and technical-SEO work
  already mapped at `GS-P04`.
  **Represented as the leanest extension of the existing model:** six new rows in
  `DIGITAL_MARKETING_ENGAGEMENT`, and nothing else. No fourth division, no capability group, no
  CMS type, no route, no orchestration engine. The cross-division managed services sit with
  Master, which `GS-P03` already defined as the orchestration layer; Google Business Profile sits
  with Digital because its confirmed scope is technical local-search configuration.
  `SERVICE-ARCHITECTURE.md` §13, asserted by `check:service-content` (18 activities, up from 12).
  **`Media buying` was NOT among the confirmed capabilities and is not inferred from its
  neighbours.** It remains the sole entry in `UNCONFIRMED_CHANNEL_SERVICES`, which is also what
  keeps that denylist non-empty and the assertion alive.
  **What this action does not cover, so that closing it drops nothing.** Confirming a capability is
  not approving copy for it: no channel has public wording, none was invented, and per-channel
  exclusions are needed before any channel page is published. That is `GS-O013`. One existing
  exclusion was corrected in the same commit because the confirmation made it false — Design's
  *Campaign & Social Creative* had said *"Gridsmith does not run ad accounts"*, which stopped being
  true the moment this closed.
- `GS-O006` — **completed 16 September 2026.** The owner approved **every** listed Design, Digital
  and Press service in the `GS-P04` brief: 81 services across the 14 capability groups, recorded
  verbatim in `lib/services/catalogue.ts` and in `SERVICE-ARCHITECTURE.md` §2 and §16. Adding or
  removing a service inside an approved group remains ordinary CMS content work and does not
  reopen this action.
  **What this action no longer covers, so that closing it drops nothing.** Its original wording
  also asked for approved *copy* per service. `GS-P04` wrote that copy — 46 development records
  covering all 81 — but it is **agent-authored and unread by the owner**, so copy acceptance moved
  to `GS-O013` rather than being closed with the list. Technical-group wording additionally waits
  on `GS-O005`/`GS-X002`, and Master engagement-model copy is still unwritten and unrequested.
- `GS-O011` — **completed 16 September 2026**, on both limbs.
  1. **Digital Marketing / campaign management is confirmed** and is represented as a
     **cross-division commercial engagement**, not a fourth production discipline, not a capability
     group, and not a CMS type. The medium-based `GS-P03` architecture is unchanged; Master's
     existing orchestration role carries campaign strategy and management, and the execution
     decomposes into capabilities the approved catalogue already holds.
     `SERVICE-ARCHITECTURE.md` §13. The platform-specific channel services were deliberately **not**
     inferred from the phrase and are `GS-O012`.
  2. **Identifiable project titles are anonymised on all 12 reviews.** Implemented on the **6**
     held in the repository at the time; no quote was altered, none had to be withheld, and no
     rating was invented. `SERVICE-ARCHITECTURE.md` §14.
     **Corrected at `GS-P05`, 16 September 2026 — the original wording of this line is preserved
     above and this is what it should have said.** It read *"the 6 missing from the stated count of
     12 were not fabricated and are `GS-O013`"*, which treated the repository's six as the evidence
     and the owner's twelve as the claim needing proof. That was backwards. **There are twelve, the
     owner was right, and six was the size of an incomplete ingestion rather than the size of the
     evidence.** Verified independently against the public profile and the official Freelancer API.
     Nothing is owed by the owner here, the anonymisation decision stands unchanged, and it now
     applies to all twelve mechanically — `SERVICE-ARCHITECTURE.md` §18 derives every category from
     Freelancer's own closed skill taxonomy rather than from a project title. What remains is a
     publication decision, `GS-O014`.
- `GS-O002` — completed 14 September 2026. The owner supplied the definitive division and service
  architecture — Master as relationship layer; Design, Digital and Press capability groups and
  services; cross-division boundaries; CTA directions — in the `GS-P03` brief. It is recorded in
  `docs/_shared/SERVICE-ARCHITECTURE.md` and enforced by `service.capabilityGroup`. Adding or
  removing an individual service inside an approved group is normal CMS content work and does not
  reopen this action. Approved *copy* for those services is `GS-O006`; the open legacy-service
  questions are `GS-O011`; engineering claims remain `GS-O005`/`GS-X002`.
- `GS-O001` — completed 11 September 2026. The Gridsmith Supabase project
  `dqiutgmxillhsbzgnlsx` was positively identified through the Supabase connector and verified
  `ACTIVE_HEALTHY` and queryable. It was already active, so no resume operation was required. The
  completion criterion is only: **Gridsmith Supabase project restored and verified available.**
  Lifecycle management of projects in other organisations is outside the Gridsmith production
  critical path; Pyramid Design is not part of this completion criterion.
- `GS-D001` — public portfolio policy approved 11 September 2026.
- `GS-D002` — bespoke quotation policy approved 11 September 2026.
- Single-launch policy retained: Master, Design, Digital and Press launch together.

## SUPERSEDED

- Public price collection as a launch dependency: Design prices, Design Desk prices, Digital base
  bands/calibration prices, Press packages, assessments, revisions and marketing-package prices.
- Public portfolio collection as a launch dependency: eight Design case studies, eight Digital case
  studies, twelve Press titles, public covers, retailer links and author consent for those surfaces.
- Implemented at `GS-P03` (14 September 2026): every price field, price renderer and the
  `/digital/estimate` price-band route removed; `/work` routes and all portfolio blocks removed.
  Nothing about prices or portfolio evidence is requested from the owner.
