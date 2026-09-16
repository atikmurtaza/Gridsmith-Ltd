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

### `GS-O012` — Confirm or decline the platform-specific marketing channel services

- **Status:** ACTIONABLE NOW (new at `GS-P04`; the narrow remainder of `GS-O011`)
- **Why required:** `GS-O011` confirmed **campaign management**, which `GS-P04` implemented as a
  cross-division engagement (`SERVICE-ARCHITECTURE.md` §13). It did **not** confirm the individual
  channel and platform services, and the brief was explicit that they must not be inferred from the
  phrase. The live `gridsmith.uk` advertises three of them, but the live site is reference material
  rather than authority, so nothing was carried forward on its say-so.
- **Exact information/action needed:** for each of **Google Ads / PPC management**,
  **Meta / Facebook / Instagram advertising**, **social media management**, **Google Business
  Profile work**, **email marketing** and **media buying** — state whether Gridsmith sells it. For
  any it does, give the division, the scope, and what is excluded. For any it does not, no action
  is needed and the current position is already correct.
- **What it blocks:** nothing structural. It blocks only redirect planning for the legacy service
  pages and any future page naming a channel. `check:service-content` refuses a seeded record that
  claims one of these until this is answered.
- **Evidence required:** written owner decision per channel.

### `GS-O013` — Accept the development service copy, and resolve the review count

- **Status:** ACTIONABLE NOW (new at `GS-P04`)
- **Why required:** two things `GS-P04` could not close by itself.
  1. **Copy acceptance.** `GS-O006` approved the *service list*. The 46 development service records
     written at `GS-P04` are **agent-authored** from that list, under the constraints in
     `scripts/service-content.mjs`. They are truthful and deliberately unpromissory, but no owner
     has read them, and `isSeed: true` keeps them off production until one does.
  2. **The review count.** `GS-O011` states there are **12** Freelancer reviews. The repository's
     authoritative source — the dated verbatim transcription of 21 August 2026 — holds **6**, and
     so does the development dataset. The missing six were **not** invented, and must not be:
     review text has to come through the same dated transcription, not from a coding agent reading
     a live page.
- **Exact information/action needed:** (1) read the 46 service records on the development site and
  approve, amend or reject the wording per record — particularly the exclusions, which is where
  each service states what Gridsmith does *not* undertake. (2) Supply the six remaining reviews, or
  confirm that six is the correct number and the figure of 12 counted something else.
- **What it blocks:** promotion of any service content to production, and the completeness of the
  `GS-O011` anonymisation decision (which is fully implemented on the six that exist).
- **Evidence required:** an approved or amended content set; and either the additional review text
  with its source, or a written correction of the count.

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
  2. **Identifiable project titles are anonymised on all 12 reviews.** Implemented on the **6** that
     exist in authoritative source data; no quote was altered, none had to be withheld, and no
     rating was invented. The 6 missing from the stated count of 12 were not fabricated and are
     `GS-O013`. `SERVICE-ARCHITECTURE.md` §14.
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
