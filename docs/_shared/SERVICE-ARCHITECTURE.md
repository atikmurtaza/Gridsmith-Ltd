# Service architecture and commercial model — ADR `GS-P03`

**Status:** Accepted · **Date:** 14 September 2026 · **Phase:** `GS-P03`
**Authority:** owner decisions `GS-D001` (public portfolio policy) and `GS-D002` (bespoke
quotation), and the owner-approved division and service model supplied in the `GS-P03` brief.
**Supersedes:** SC-6 and the old CLAUDE.md non-negotiable #3 ("never publish a service page without
pricing"), every public price, band, package-price and estimator requirement, and every public
portfolio, case-study and title-catalogue launch requirement. The superseded wording is struck in
place and registered in `check:struck`; it has not been deleted.

This file records the durable architecture. It is **not** approved production copy: service
descriptions, process detail and capability content still come from the owner (`GS-O006`).

---

## 1. Decisions

1. **One company, three production media, one relationship layer.** Master owns the commercial
   relationship and is not a production studio. Design, Digital and Press own production by the
   primary output of the work.
2. **Services are content; capability groups are architecture.** Normal service additions and
   removals are CMS edits. Groups are a closed list in `lib/services/architecture.ts`, bound to a
   division, and enforced by the schema.
3. **No public prices anywhere in the model.** No price field exists on any CMS type, and
   `check:schemas` refuses one. Every public journey leads to a contextual enquiry and a bespoke
   quotation.
4. **No public portfolio dependency.** Public `/work` routes and portfolio blocks are removed.
   The `project`, `book` and `publishingPackage` types remain dormant for future consented use.
5. **Credibility comes from process transparency, capability depth and verifiable external
   evidence**, with an explicit, non-promissory statement that examples may be discussed
   privately where permitted.
6. **Technical Design services carry a production publication gate** pending professional-scope
   and PI confirmation.

## 2. Division model

### Master — relationship, not production

Owns the commercial relationship, continuity, strategy, discovery, orchestration, cross-division
programme management and the engagement/retainer model. It may present engagement structures —
a digital roadmap or discovery engagement, strategic advisory, multi-division programme
management, and ongoing relationship structures (operate / advance / partner style) — as
**relationship models, not a fourth delivery division**.

**Not built in `GS-P03`:** there is no CMS type or route for engagement models. They need approved
copy first; when they arrive they must not be modelled as `service` records, so that Master cannot
accumulate ordinary production services. Master's CTA is **Discuss Your Requirements**.

### Capability groups and approved service inventory

The service lists below are the owner-supplied inventory. Seed records in the development dataset
are placeholders against these groups, not this list.

| Division | Group (`key`) | Approved services |
|---|---|---|
| **Design** — primary output is a visual or technical visual artefact | Brand & Visual (`brand-visual`) | Brand identity systems · naming support where appropriately positioned · logo systems · brand guidelines · graphic design · print and digital collateral · packaging design · marketing and campaign creative · presentation design · document/report design · social/content creative · gaming/streamer creative |
| | Illustration (`illustration`) | Digital illustration · custom artwork · iconography · infographic/visual explanation · technical illustration |
| | Motion (`motion`) | Motion graphics · 2D animation · 3D animation · animated brand/content assets |
| | 3D & Visualisation (`3d-visualisation`) | 3D modelling · product visualisation · concept rendering · presentation renders. **Visualisation does not imply product engineering or design responsibility.** |
| | Technical (`technical`) — **publication gate** | CAD drafting · engineering drawings · schematics · technical illustration · technical-document layout · manuals/specification-sheet visual layout. See §8. |
| **Digital** — primary output is a functioning digital system | Web (`web`) | Website design and development · e-commerce · web applications · CMS implementation · content architecture · web UI/UX as part of functioning digital products |
| | Software (`software`) | Custom software · internal tools · business portals · dashboards · CRM/workflow systems |
| | Apps & Interactive (`apps-interactive`) | Mobile applications · progressive web applications where appropriate · game development |
| | Automation & Intelligence (`automation-intelligence`) | API integrations · systems integration · workflow automation · AI integrations · AI/agent workflows · data/reporting systems · analytics infrastructure where appropriate |
| | Operate & Improve (`operate-improve`) | Maintenance · hosting coordination · monitoring · performance optimisation · accessibility improvement · technical SEO · iterative product development |
| **Press** — primary output is written, editorial or publishing work | Writing (`writing`) | Ghostwriting · book writing/development · website copywriting · sales/campaign copy · thought leadership · whitepapers · industry/business reports |
| | Editorial (`editorial`) | Manuscript development · developmental/structural editing · copy editing · proofreading · manuscript assessment |
| | Publishing (`publishing`) | Publishing preparation · ebook/print formatting · platform-standard formatting · ISBN guidance/support · distribution/platform setup · typesetting coordination · cover-design coordination |
| | Content & Promotion (`content-promotion`) | Ongoing content programmes · content SEO · book marketing/support |

"Technical illustration" appears under both Illustration and Technical because the owner model
lists it in both; a record chooses one group. Client-facing *analytics infrastructure* is a Digital
capability and is unrelated to the deferred decision not to run analytics on this website.

Nothing speculative was added. Paid-media management, advertising management and media buying are
**not** in the model (§4).

## 3. Cross-division boundaries

| Work | Commercial journey / relationship | Execution discipline | Rule |
|---|---|---|---|
| Book cover design, publishing visuals | **Press** | **Design** | Press owns the client publishing engagement; Design owns the visual craft. Press lists cover-*design coordination*, not cover design. |
| Website copy | May originate in **Digital** | **Press** | Digital does not create a shadow copywriting capability. |
| SEO | Split | Split | **Digital:** technical SEO, crawl/indexing foundations, structured data, performance and site architecture. **Press:** SEO-informed writing, content strategy, editorial optimisation. No generic "SEO" service where the distinction matters. |
| "Digital marketing" | — | Decomposed | Campaign creative → Design · written content/copy → Press · content SEO → Press · technical SEO → Digital · landing pages/infrastructure → Digital. No broad "Digital Marketing" service. |
| Technical document layout | Design | Design, drawing on Press for editorial | Collaborator, not a second owner. |

**How the model enforces it:** `service.capabilityGroup` refuses a group from another division
(`check:schemas` proves both limbs), so Press cannot grow a web group and Digital cannot grow a
copywriting group. `service.collaborators` records a contributing division without moving the
relationship, and the Digital service page says so: *"Your engagement stays with Gridsmith
Digital."*

## 4. Legacy live-site mismatch — for redirect and content-transition planning

The live `gridsmith.uk` is reference material, not authority (`LIVE-SITE-EXTRACT.md` §4, §7, §8).
Nothing below changes the live site, DNS or redirects; that is a later release task.

| Legacy item | New owner | Treatment |
|---|---|---|
| Custom Website Development · Website Redesign & Optimization · E-Commerce Website Setup · Landing Page Development | Digital — Web | Maps directly |
| WordPress Development | Digital — Web (CMS implementation) | Platform-specific name not carried forward as its own service |
| UI/UX Design | Digital — Web | Only as part of functioning digital products; no standalone UI/UX service in the model |
| Search Engine Optimization (SEO) · On-Page & Technical SEO · Website Performance Optimization | Digital — Operate & Improve | Technical half only |
| Keyword Research & Strategy · Content Strategy | Press — Content & Promotion | Content half only |
| Brand Identity Support · Website Graphics & Visual Assets | Design — Brand & Visual | Maps directly |
| Social Media Design Support | Design — Brand & Visual (social/content creative) | Design output only; **not** social media management |
| CRM & Workflow Setup · Email & Contact Form Automation · Online Booking & Enquiry Systems | Digital — Software / Automation & Intelligence | Maps directly |
| **"Digital marketing support"** (§4, §8) | Decomposed per §3 | **Owner review** (`GS-O011`) — not carried forward as a service |
| **Google Ads setup or support** (FAQ, §7) | None | **Owner review** (`GS-O011`) — paid advertising is not in the approved model and is not silently preserved |
| **Google Business Profile Support** (§4) | None | **Owner review** (`GS-O011`) — not in the approved model |
| Pakistan governing law, refund copy, legacy emails | — | Already superseded by `docs/_legal/`; not a service question |

## 5. CMS and content model

### `service`

| Field | Purpose | Required |
|---|---|---|
| `title`, `slug`, `division` | Identity | Yes |
| `capabilityGroup` | Closed, division-bound group (§2) | Yes |
| `problem` (titled *Summary*) | Concise summary — the buyer's situation | No |
| `description` | Detailed description (portable text) | No |
| `searchIntent`, `seo` | SEO metadata | No |
| `deliverables[]` (`included` flag) | What is and is not included — exclusions render, never disappear | No |
| `process[]` | Division detail per canonical stage; stage names never come from the CMS | No |
| `relatedServices[]` | References to other published services | No |
| `collaborators[]` | Contributing divisions; relationship stays with `division` | No |
| `faqs[]` | FAQ references | No |
| `relatedProjects[]` | **Only** work Gridsmith holds written permission to publish (`GS-D001`) | No |
| `ctaLabel` | Overrides the division CTA wording; the destination is not editable | No |
| `professionalScopeConfirmed` | Technical group publication gate (§8) | Warning in Studio; enforced on production |
| `order`, `published`, `isSeed` | Ordering, availability, seed protection | — |

**A service is publishable with no price, no portfolio relationship and no client evidence.**

**Removed:** `pricingModel` and the `pricingBlock` object (SC-6); `ctaPrimary`/`ctaSecondary` and
the `ctaBlock` object (an editable `href` could point a service CTA anywhere, including at a price
page); `track` (superseded by `capabilityGroup`).

**One page per record, not one rich-text document.** Structure lives in fields so that exclusions,
process and collaborators render consistently across divisions.

### Dormant types

| Type | State | Why kept |
|---|---|---|
| `project` | No route or query. `metrics` no longer requires a figure. | Future work with written permission. Restoring a route must restore the database-side `confidential` projection (last present at `9a804c4f`). |
| `book`, `retailerLink` | No route. `authorConsent` hard-true and `retailers` min 1 retained. | A future consented catalogue; the consent rules are exactly right for that. |
| `publishingPackage`, `packageLine` | No route. Price, price note, "from" flag, scaling factors and extra-revision cost removed. | Structured scope description if an approved package-shaped offer is ever published; `excludes` and `notFor` stay required. |

### Development dataset

The `development` Sanity dataset still holds the pre-`GS-P03` seed: priced services without
capability groups and 24 seed projects. It was **not** re-seeded: `seed-content.mjs` only
`createOrReplace`s, so re-running it would leave the old records published alongside the new ones.
Rendering is tolerant (records without a group render in a flat list; stored price fields are
never projected), and `/_master-sink` carries committed specimens of the grouped list. Re-seeding
requires deleting the orphaned seed documents and is recorded as `GS-T007`.

## 6. CTA model

| Surface | Primary | Destination |
|---|---|---|
| Master (homepage CTA band) | **Discuss Your Requirements** | `/contact` |
| Design landing | **Get a Design Quote** | `/contact?division=design` |
| Digital landing | **Discuss Your Project** | `/contact?division=digital` |
| Digital service page | Record's `ctaLabel`, else **Discuss Your Project** | `/contact?division=digital&service=<slug>` |
| Press landing | **Discuss Your Book or Content** | `/contact?division=press` |
| Universal secondary | **Contact Gridsmith** | `/contact` |

All CTAs feed the one enquiry form and the GS-P01 server-only lead writer, which was not redesigned.
The form reads the query after mount: the division is preselected (and remains changeable), and the
service travels as a hidden `service_slug`, mapped by name in the Server Action and bounded by
`leadSchema`. Malformed context is dropped. Without JavaScript the form works with nothing
preselected. `check:lead-security` asserts the round trip, the drops and both source mappings.

The Press contact flow (`/press/contact`) and the Path Finder are unchanged and remain reachable.

## 7. Credibility without a public portfolio

**A. Process transparency.** The canonical six stages (`_shared/00-PROCESS.md`) are retained rather
than replaced with generic names such as Discover/Define: they are an existing fixed, gated process
with per-division detail and client time. Each service record can explain, per stage, what happens,
what Gridsmith needs from the client (`clientTime`), outputs (`deliverables`) and support. No
operational promise has been added.

**B. Capability depth.** Pages demonstrate capability through description, deliverables,
exclusions, process, capability group and cross-division collaboration. Stacks, standards, QA,
accessibility/performance practice and ownership/handover content fit these fields and require owner
approval before publication. Pages must not become software-logo inventories.

**C. External / verifiable credibility.** The six existing, verbatim Freelancer reviews are preserved
unchanged, with their source link — the only existing verified external evidence in the repository.
No new profile or link was added. Whether their project titles should continue to be shown under
`GS-D001` is an owner question (`GS-O011`).

**Private examples statement** (division landings, `PRIVATE_EXAMPLES_NOTICE`):

> Some of our work cannot be shown publicly, either because we do not hold permission to publish it
> or because it is confidential. Relevant examples may be discussed privately where we are
> permitted to share them.

It does not claim all unshown work is confidential and does not promise that an example exists or
will be shared.

## 8. Technical Design safety

- **Claim ceiling.** Technical services describe drafting and drawing preparation to an agreed brief.
  Nothing may state or imply certified engineering design, structural design, or any regulated or
  professionally responsible engineering service unless later owner and professional evidence
  supports it. Seed technical copy was softened accordingly.
- **Publication gate.** Groups with `professionalReview: true` (today: `technical`) cannot be
  published to production without `professionalScopeConfirmed: true`:
  - the Studio shows a **warning**, so development and testing are not blocked;
  - `check:launch` (including its `--build` prebuild mode) counts published, unconfirmed technical
    services and **fails on the production dataset**. Committed specimens prove each limb.
- **Outstanding:** `GS-O005` (PI scope) and `GS-X002` (professional review). Setting the flag
  without that written evidence defeats the control; its field description says so.

## 9. Pricing reconciliation

| Item | Decision | State after `GS-P03` |
|---|---|---|
| `service.pricingModel` / `pricingBlock` | **Removed** | Fields and type deleted; `check:schemas` refuses any price field |
| Service-list and service-page price display (`Price.tsx`) | **Removed** | Component deleted; service pages no longer 404 without a price |
| Digital estimator — `/digital/estimate` static price bands (`V-06`) | **Removed from launch** | Route deleted. Its only function was publishing indicative bands. No price-producing island was ever built (`V-07`–`V-16`). |
| Digital estimator successor | **Deferred** | Contextual enquiry (division + service) is the launch scoping path. A non-price "Project Scoper" is an optional later enhancement if enquiry quality needs it; 40KB bundle budget reserved when built. |
| Design Desk pricing / drawing price estimator (`C-13`–`C-17`) | **Deferred / rescope** | Never built. No budget entry retained for `/design/estimate`. |
| Press packages, assessment and revision pricing (`publishingPackage`) | **Retained structurally, prices removed** | Five price fields removed; type dormant |
| Press contact flow budget question, contact form "rough budget" | **Retained as non-price scoping** | Shape-of-engagement options only |
| Press Path Finder | **Retained unchanged** | Non-price recommendation; honest outcomes and seed rules untouched |
| Legal instruments' pricing/quotation wording | **Not changed** | Solicitor review, `GS-O003` / `GS-X001` |
| Canonical process stage 2 ("pricing structure") | **Retained** | Describes the written scope and quotation, not a public price |

## 10. Portfolio reconciliation

| Surface | Decision |
|---|---|
| `/work`, `/work/[slug]` | **Removed**; master nav item removed. No empty portfolio page. |
| Homepage "Selected work" block | **Removed** |
| Division landing "Selected work" block | **Replaced** by the private-examples statement |
| `/approach` cross-division project grid | **Removed**; the page argues from structure and process |
| `project` CMS type | **Dormant**, retained for consented work |
| Press title catalogue (`book`, `/press/books` never built) | **Dormant**, consent validators retained |
| Representative engagements | **Deferred** (§11) |
| Testimonials (verified Freelancer reviews) | **Retained**; owner review of project titles `GS-O011` |

## 11. Representative engagements — later enhancement

Not built. Any future type must be a **separate document type from `project`**, and must:

- require a visible label from a closed list — `illustrative` / `representative` / `hypothetical`;
- have no client name, client logo, client asset, year or measured-outcome field;
- never be rendered by, linked from, or counted alongside project or testimonial surfaces;
- carry `isSeed` and be registered in `check:schemas` in the same commit.

No scenario content may be written without owner approval.

## 12. Dependency map

| Dependency (before) | Where it lived | After `GS-P03` |
|---|---|---|
| Price mandatory on a service | `service.pricingModel` required; `check:schemas` SC-6 assertion; `U-08` `notFound()` without price | Removed; inverted gate |
| Price rendered on every card and page | `Price.tsx`, `ServiceList`, `/digital/services/[slug]` | Removed |
| Public price bands | `/digital/estimate`; axe, responsive and bundle route lists | Route and list entries removed |
| Package total mandatory | `publishingPackage.price` + four siblings; `check:schemas` hard values | Removed |
| Case study with a metric mandatory | `project.metrics` min 1 | Optional; type dormant |
| Portfolio mandatory on landings/home/approach | `ProjectGrid`, `SelectedWork`, `DivisionLanding`, `/approach` | Removed or replaced |
| Work routes in navigation and gates | `nav.ts`; axe, responsive, VAT route lists | Removed |
| VAT gate required a price on the site | `check:vat` non-zero price guard | Replaced with a served-text guard |
| Editable CTA destinations | `ctaBlock` | Removed; destinations derived with context |
| Book catalogue, retailer links | `book` validators | Retained for future consented use; no route; not a launch dependency |
