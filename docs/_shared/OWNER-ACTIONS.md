# Owner actions

This register contains only decisions, evidence, credentials or external actions that require the
owner. Implementation remains agent work. Public prices and public portfolio/case-study content are
not requested under `GS-D001` and `GS-D002`.

## ACTIONABLE NOW

### `GS-O001` — Put the intended Supabase projects in the required state

- **Status:** ACTIONABLE NOW — `SUPABASE_OWNER_ACTION_REQUIRED`
- **Why required:** the connected integration does not expose projects named Gridsmith or Pyramid
  Design, so an agent cannot positively identify the authorised targets.
- **Exact action:** sign in to the Supabase Dashboard with the account/organisation that owns both
  projects. On the organisation Projects page, record the exact project name and project reference
  for each. Open the `Pyramid Design` project, go to **Project Settings -> General**, choose
  **Pause project**, and confirm only after verifying its project reference. Return to the Projects
  page, open the paused `Gridsmith` project, choose **Resume project**, and confirm. Do not delete,
  transfer, reset, upgrade or change billing. Do not alter schema, data, Auth, RLS or credentials.
- **What it blocks:** remote Gridsmith Supabase inspection and any later database-dependent phase.
- **Evidence required:** screenshot or dashboard record showing exact names/references and final
  states: Gridsmith active; Pyramid Design paused.

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

- `GS-D001` — public portfolio policy approved 11 September 2026.
- `GS-D002` — bespoke quotation policy approved 11 September 2026.
- Single-launch policy retained: Master, Design, Digital and Press launch together.

## SUPERSEDED

- Public price collection as a launch dependency: Design prices, Design Desk prices, Digital base
  bands/calibration prices, Press packages, assessments, revisions and marketing-package prices.
- Public portfolio collection as a launch dependency: eight Design case studies, eight Digital case
  studies, twelve Press titles, public covers, retailer links and author consent for those surfaces.
