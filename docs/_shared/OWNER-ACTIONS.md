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

### `GS-O014` — Accept Freelancer's API terms, and decide what the reviews block publishes

- **Status:** ACTIONABLE NOW (new at `GS-P05`)
- **Why required:** `GS-P05` built an automatic Freelancer review pipeline and **deliberately did
  not switch it on**. Two things stop an agent throwing that switch, and neither is technical.
  1. **The terms are a commercial commitment.** Freelancer's API T&Cs §4.1: *"Anyone who wants to
     access our API must agree to be bound by this API T&Cs."* Making `gridsmith.uk` depend on an
     API whose terms Gridsmith Ltd has not accepted is a legal position, and a coding agent must
     not take one on the company's behalf. **No credential and no paid service is involved** —
     the endpoint answers unauthenticated, so this is acceptance, not provisioning.
  2. **The block's contents change.** The site publishes six reviews today. The pipeline publishes
     all twelve, and **the twelfth is rated 4.6 and contains criticism** — it says communication
     *"could be much better"*. Publishing it is the right default for this site and it is still a
     decision about what the homepage says.
- **Exact information/action needed:** three answers.
  1. Read `https://www.freelancer.com/about/apiterms` and confirm Gridsmith Ltd accepts them.
     They are short; §5.1 (cache refresh at least every 24 hours) and §5.3 (no storing beyond
     that) are the two the architecture is built around, and it already complies with both.
  2. Confirm that all twelve reviews may be published, **including the 4.6**, or name any review
     to withhold. Withholding a specific review is a one-line denylist; editing one is not
     available and will not be offered.
  3. Confirm the attribution wording **"Verified review via Freelancer"**, shown per card with a
     link to `https://www.freelancer.com/u/GridsmithLTD`.
- **What it blocks:** switching the review block from the six hand-transcribed Sanity testimonials
  to the twelve live ones. Nothing else. The pipeline, its gate and its 55-case selftest are
  committed and green; activation is one line in `components/master/Testimonials.tsx` and one in
  `components/divisions/DivisionLanding.tsx`.
- **Credentials required:** **none.** Do not create a Freelancer OAuth application and do not
  generate a Personal Access Token for this. If Freelancer later begins enforcing the documented
  OAuth scopes, `check:reviews --live` goes red and the owner action at that point is recorded
  under *If the API ever requires a credential* below — it is not needed now and is not requested.
- **Paid service required:** none.
- **Evidence required:** a written owner decision on each of the three, dated.

#### If the API ever requires a credential — the shape of that action, recorded now so it is not improvised

Not actionable, and **not to be started**. Recorded because the divergence between Freelancer's
documentation and its behaviour is the integration's main risk, and the response to it should not
be designed while something is broken.

1. Freelancer would require an OAuth client created at `developers.freelancer.com` (production,
   not sandbox), with a redirect URI on a Gridsmith-controlled host.
2. Scopes: `basic` plus the advanced scope `fln:project_manage`.
3. A one-time consent at `https://accounts.freelancer.com/oauth/authorize`, exchanged at
   `https://accounts.freelancer.com/oauth/token` for an access token and a **refresh token**.
4. Access tokens expire after 2,592,000 seconds (30 days); the refresh token is what renews them
   unattended. A **Personal Access Token is not suitable** — one per environment, also 30 days,
   and no refresh, so it would need manual rotation every month for ever.
5. The client secret and refresh token would go into Vercel's encrypted environment variables as
   server-only values. **Never a `NEXT_PUBLIC_` variable, never in source, never pasted into
   chat or documentation.** The `client_id` and the redirect URI are safe to share; the
   `client_secret`, the authorisation `code`, the access token and the refresh token are not.

### `GS-O013` — Accept the development service copy

- **Status:** ACTIONABLE NOW (raised at `GS-P04`; **narrowed at `GS-P05`**)
- **What changed at `GS-P05`.** This action had two limbs and **the second is closed**. It asked
  the owner to supply six missing reviews or correct a count of 12. Neither was needed: there are
  twelve, the owner was right, and `GS-P05` verified it independently against both the public
  profile and the official API. `SERVICE-ARCHITECTURE.md` §14. **Do not ask the owner to prove the
  other six exist.** What remains of the review question is a publication decision, and that is
  `GS-O014`, not this.
- **Why the remaining limb is required:** `GS-O006` approved the *service list*. The 46 development
  service records are **agent-authored** from that list under the constraints in
  `scripts/service-content.mjs`. They are truthful and deliberately unpromissory, but no owner has
  read them, and `isSeed: true` keeps them off production until one does.
- **Exact information/action needed:** read **`docs/_shared/GS-P05-OWNER-CONTENT-REVIEW.md`** and
  approve, amend or reject the wording. It transcribes all 46 records verbatim — every summary,
  sentence, deliverable and exclusion — so **Sanity does not need to be opened**, and a response
  can be as coarse as *"Approve all Digital"* or as fine as *"Approve Design except the CAD
  Drafting summary"*. Three things in it are worth the attention specifically:
  - **the 35 published exclusions**, which are where each service states what Gridsmith does not
    undertake and therefore what a client cannot later say was promised;
  - **the 12 passages marked `⚠ VERIFY`**, which assert a named tool, a professional position or
    a standard — the sentences where being wrong would matter most;
  - **per-channel exclusions for the marketing capabilities confirmed at `GS-O012`**, which do not
    exist yet. `GS-P05` corrected one exclusion that the confirmation made false; no channel has
    published wording, and none may be published without its own boundary statement.
- **What it blocks:** promotion of any service content to production.
- **Evidence required:** an approved or amended content set. The document records the SHA-256 of
  the copy it transcribes and `check:service-content` fails if the two diverge, so an approval
  cannot silently attach to wording that has since changed.

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
