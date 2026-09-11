# Owner actions

This register contains only decisions, evidence, credentials or external actions that require the
owner. Implementation remains agent work. Public prices and public portfolio/case-study content are
not requested under `GS-D001` and `GS-D002`.

## ACTIONABLE NOW

### `GS-O002` — Provide the definitive Gridsmith service list

- **Status:** ACTIONABLE NOW
- **Why required:** public capability and quotation journeys must describe services truthfully; the
  older live-site list is reference material, not the final authority.
- **Exact information needed:** for Master, Design, Digital and Press, list each service Gridsmith
  actually offers, a plain description, principal deliverables, material exclusions, intended
  client type and the appropriate CTA wording.
- **What it blocks:** final information architecture, service content, quote/request flows and
  removal of unoffered seed services.
- **Evidence required:** owner-approved service inventory. No public price is required.

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
- **What it blocks:** affected Design claims and any higher-risk engineering launch content.
- **Evidence required:** written broker/insurer confirmation; do not put policy documents in source.

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

### `GS-O006` — Approve production capability/process content

- **Status:** UPCOMING; depends on `GS-O002`
- **Why required:** `GS-D001` replaces public portfolio proof with truthful capability, process,
  quality and methodology content.
- **Exact information/action needed:** approve final copy and identify any privately shareable
  examples without promising that every request can be fulfilled.
- **What it blocks:** production content acceptance.
- **Evidence required:** owner-approved content set.

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
