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

### `GS-O004` — Confirm operational company/contact facts

- **Status:** ACTIONABLE NOW
- **Why required:** public statutory and contact information must be accurate and reachable.
- **Exact information/action needed:** confirm the registered-office string and company number;
  create and test `contact@gridsmith.uk` if it remains the legal/privacy contact; confirm response
  commitment, public phone choice, business hours, ICO position and any publishable insurance facts.
- **What it blocks:** production company singleton, legal/privacy contact and human acceptance.
- **Evidence required:** authoritative records plus a successful inbound mailbox test.

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

### `GS-O015` — Decide whether two reviews naming a third party may be republished

- **Status:** ACTIONABLE NOW (new at `GS-P06`)
- **Why required:** `GS-O014` accepted publication of all twelve reviews, and the question it was
  asked was whether criticism **of Gridsmith** could be published. It can, and the 4.6 is on the
  homepage. `GS-P06` read all twelve bodies word for word and found a different question that
  nobody had been asked. Two of them name a **third-party development company** in terms Gridsmith
  would be republishing on its own site:
  - *"My app started life with the very disgraceful Varnika Software PVT in India…"* (id `22108992`)
  - *"…initially developed by Varnika Pvt in India which was a massive mistake."* (id `22100632`)

  The second also carries the client's own product name in the body. **Freelancer hosting a
  reviewer's words and Gridsmith reprinting them are different publications**, and this one is a
  legal position — `AI-DEVELOPMENT-PROTOCOL.md` puts a legal commitment nobody has taken into this
  register rather than into a build.
- **What was done meanwhile, so nothing is stuck:** the conservative default. The two are
  **withheld**, the homepage publishes **10 of 12**, no quotation was altered (editing one is not
  available and will not be offered), nothing was deleted, and `check:reviews --live` names both
  withheld reviews and the reason on every run. Nothing has reached the public: production content
  is gated and `gridsmith.uk` is untouched.
- **Exact action:** one sentence, either way.
  1. *"Publish them"* — the two ids come out of `WITHHELD_REVIEW_IDS` in
     `lib/reviews/freelancer.ts` and the block publishes twelve.
  2. *"Keep them withheld"* — nothing changes and this closes as implemented.
  3. If you want a solicitor's view first, it belongs with `GS-O003` rather than here.
- **What it blocks:** nothing. The homepage works either way. It must be closed before production
  release, because the answer decides what the site says about a named company.
- **Credentials required:** none. **Paid service required:** none.
- **Evidence required:** a dated written decision naming which of the two options.

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

## UPCOMING

### `GS-O007` — Supply production assets, SEO facts and redirect inventory

- **Status:** UPCOMING
- **Why required:** real brand assets, metadata and the existing Press URL inventory cannot be
  inferred safely.
- **Exact information/action needed:** approved logo/favicon/assets, SEO titles/descriptions where
  owner facts are needed, and the existing Press URL export before cutover.
- **What it blocks:** staging release candidate and launch-day redirects.
- **Evidence required:** approved files and URL inventory.

## BLOCKED/DEPENDENT

- `GS-O008` — approve a staging release candidate after `GS-P01` and service/content phases.
- `GS-O009` — authorise production deployment and DNS cutover only in a dedicated production-release
  phase after automated audit and human acceptance.

## COMPLETED

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
