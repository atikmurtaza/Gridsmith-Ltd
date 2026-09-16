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

Nothing speculative was added at `GS-P03`. **Advertising and paid-channel management entered the
model at `GS-P05`** — as cross-division *engagements* under Master, never as capability groups or
services (§13, `GS-O012`). **Paid media management and placement was added as a nineteenth
engagement row at `GS-P06`** (`GS-O013`), because the owner's remediation records that denying
media buying contradicts the channels already confirmed: managing a Google Ads or a Meta account
IS placing paid media. There is still no approved catalogue entry for standalone media buying and
none was added — the catalogue is 81 services, unchanged. §13.

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
| Social Media Design Support | Design — Brand & Visual (social/content creative) | Design output only. Social media **account management** is a separate cross-division engagement confirmed at `GS-P05`, not this Design capability |
| CRM & Workflow Setup · Email & Contact Form Automation · Online Booking & Enquiry Systems | Digital — Software / Automation & Intelligence | Maps directly |
| **"Digital marketing support"** (§4, §8) | Decomposed per §3 | **RESOLVED at `GS-P04`** — the owner confirms campaign management. It is a cross-division *engagement*, not a service and not a discipline: §13 |
| **Google Ads setup or support** (FAQ, §7) | Cross-division engagement — Master | **RESOLVED at `GS-P05`** — confirmed by the owner (`GS-O012`), not inferred from the live site. §13 |
| **Google Business Profile Support** (§4) | Digital — Operate & Improve (technical SEO) | **RESOLVED at `GS-P05`** — confirmed, and the one channel owned by a division. §13 |
| **Meta/Facebook/Instagram advertising · social media management · email marketing** (§4, §8) | Cross-division engagement — Master | **RESOLVED at `GS-P05`** (`GS-O012`) |
| **Media buying** | Cross-division engagement — Master | **RESOLVED at `GS-P06`** (`GS-O013`) as paid media management and placement *within managed advertising accounts*. It stays in `UNCONFIRMED_CHANNEL_SERVICES` on a narrower reading — no approved catalogue entry carries standalone media buying, so no service **record** may claim it. §13 |
| Pakistan governing law, refund copy, legacy emails | — | Already superseded by `docs/_legal/`; not a service question |

## 5. CMS and content model

### `service`

| Field | Purpose | Required |
|---|---|---|
| `title`, `slug`, `division` | Identity | Yes |
| `capabilityGroup` | Closed, division-bound group (§2) | Yes |
| `capabilities[]` | **`GS-P04`.** The approved services this record covers — names, not claims. Renders as *What this covers* | No |
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

### Development dataset — **reconciled at `GS-P04`; `GS-T007` CLOSED**

At `GS-P03` this dataset still held the pre-`GS-P03` seed — 30 priced services with no capability
group and 24 seed projects — because `seed-content.mjs` only `createOrReplace`d and re-running it
would have left the old records published alongside the new ones. That was `GS-T007`.

`GS-P04` closed it under the owner's explicit development-dataset authorisation. The seed script
now **deletes obsolete seed in the same transaction**, by provenance and never by type: a candidate
must carry both `isSeed: true` **and** an `_id` beginning `seed-`, and a disagreement between the
two markers stops the run rather than guessing which to believe. 46 obsolete documents were removed
(24 `project`, 22 `service`), 119 written, and the genuine records — `companyDetails`, the six
testimonials, Sanity's own `system.*` documents — match neither marker and were never candidates.

The run is idempotent: a second immediately afterwards deleted nothing and wrote the same 119.

| | Before `GS-P04` | After |
|---|---|---|
| Published documents | 140 | 132 |
| `service` | 30, none with a capability group, all with `pricingModel` | 46, all grouped, no price field exists |
| `project` | 24 | 0 |
| `testimonial` (genuine) | 6 | 6, titles anonymised |
| `companyDetails` (genuine) | 1 | 1 |
| Sanity `system.*` | 12 | 12 |
| Drafts | 0 | 0 |

`check:service-content --dataset` asserts the dataset against the approved catalogue by reading it
**unauthenticated, the way the site reads it** — not by re-reading the source that produced it.
That is `01-VALIDATION-REPORT.md` §21's rule: where two artefacts must agree and only one reaches a
reader, assert against the one that reaches the reader.

## 6. CTA model

| Surface | Primary | Destination |
|---|---|---|
| Master (homepage CTA band) | **Discuss Your Requirements** | `/contact` |
| Design landing | **Get a Design Quote** | `/contact?division=design` |
| Digital landing | **Discuss Your Project** | `/contact?division=digital` |
| **Any** service page | Record's `ctaLabel`, else the division's wording above | `/contact?division=<division>&service=<slug>` |
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
with their source link — the only verified external evidence in the repository. No new profile or
link was added. **Their quotes remain byte-identical to the 21 August 2026 transcription.** Their
project titles were anonymised at `GS-P04` under `GS-O011`; §14 is the record, including the count
discrepancy the owner's decision surfaced.

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
| Testimonials (verified Freelancer reviews) | **Retained**; project titles **anonymised at `GS-P04`** per `GS-O011` — §14 |

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

---

# `GS-P04` — approved content, Digital Marketing and service-page architecture

**Status:** Accepted · **Date:** 16 September 2026 · **Phase:** `GS-P04`
**Authority:** `GS-O006` (the owner approved every listed Design, Digital and Press service) and
`GS-O011` (campaign management confirmed; review project titles to be anonymised).
**Amends, does not replace,** the `GS-P03` ADR above. Every `GS-P03` decision still stands.

## 13. Digital Marketing — a cross-division engagement, not a fourth discipline

`GS-O011` confirms Gridsmith provides **campaign management**, so Digital Marketing may be said
client-facing. The question `GS-P04` had to answer was how to say it without corrupting the
medium-based division model, and the answer is the leanest one available: **nothing new was
built.**

No new division. No new capability group. No new CMS type. No new route. No orchestration
machinery. The engagement is a documented decomposition into capabilities the approved catalogue
already contains, held in `DIGITAL_MARKETING_ENGAGEMENT` in `lib/services/catalogue.ts` and
asserted by `check:service-content` so it cannot drift from the catalogue.

**The reason no new architecture is needed is that the orchestration layer already exists.**
§2 defines Master as the relationship, strategy, orchestration and cross-division programme
layer. Campaign strategy and campaign management are orchestration, so they sit exactly where
the model already put work of that kind.

| Activity | Owner | Approved capability that carries it |
|---|---|---|
| Digital marketing strategy | **Master** | — orchestration, not production |
| Campaign strategy and coordination | **Master** | — orchestration, not production |
| Campaign management | **Master** | — orchestration, not production |
| Google Ads / PPC management | **Master** | — cross-division managed service (`GS-O012`) |
| Meta / Facebook / Instagram advertising management | **Master** | — cross-division managed service (`GS-O012`) |
| Social media account management | **Master** | — cross-division managed service (`GS-O012`) |
| Email marketing campaigns | **Master** | — cross-division managed service (`GS-O012`) |
| Visual campaign creative | Design | Marketing and campaign creative (`brand-visual`) |
| Advertising creative | Design | Marketing and campaign creative (`brand-visual`) |
| Social and content creative | Design | Social/content creative (`brand-visual`) |
| Written campaign copy | Press | Sales/campaign copywriting (`writing`) |
| Content programmes | Press | Ongoing content programmes (`content-promotion`) |
| Content SEO | Press | Content SEO (`content-promotion`) |
| Landing pages | Digital | Website design and development (`web`) |
| Technical SEO | Digital | Technical SEO (`operate-improve`) |
| Google Business Profile setup and management | Digital | Technical SEO (`operate-improve`) |
| Tracking and integration infrastructure | Digital | API integrations (`automation-intelligence`) |
| Reporting and measurement infrastructure | Digital | Data/reporting systems (`automation-intelligence`) |

### The channels — confirmed at `GS-P05`, and why they added no architecture

`GS-P04` refused to infer a channel roster from the phrase "campaign management", and recorded
the gap as `GS-O012`. **The owner confirmed eight of the nine on 16 September 2026**, and they
are in the table above. Confirming them changed the *catalogue of engagements* and nothing else:
no fourth division, no capability group, no CMS type, no route, no orchestration engine.

**Why the channel rows sit with Master and map to no approved capability.** A capability group is
a *medium*. Running a Google Ads account or an email campaign is not a medium — it is the
coordination of several, and every piece of production work it commissions (creative, copy,
landing page, tracking) is already an approved capability under Design, Press or Digital. Filing
"Google Ads management" inside one division would put a cross-division engagement in a
division-bound group, which `engagementProblems` refuses by design and which a deliberate-failure
proof at `GS-P05` confirmed still fires. `master` + no mapped capability is the shape the model
has carried since `GS-P04` for exactly this.

**Google Business Profile is the one channel owned by a division**, because its confirmed scope is
setup and technical configuration of a local-search listing rather than campaign coordination.

### Media buying — the `GS-P05` reading, and the `GS-P06` correction

**`GS-P05` wrote:** *"Media buying is still not confirmed … buying inventory puts Gridsmith
between a client and a spend commitment, which is a different commercial position from managing a
campaign on a client's own account."* That reasoning is preserved because it is the record of what
was decided, and **`GS-O013` overturned it.**

The owner's remediation states the contradiction plainly: the site was denying media buying while
selling Google Ads and Meta account management, and running an ad account is placing paid media.
`GS-P05` had read the owner's silence at `GS-O012` as a refusal; it was silence.

**What changed, and what did not.**

- The **denial is struck from the copy.** Design's *Campaign & Social Creative* no longer says
  media buying is not undertaken; it draws the boundary at what that service is (creative
  production) rather than at what the company does. `check:service-content` question 4 refuses
  three separate phrasings of the old position and each is broken separately in the self-test.
- **One engagement row was added** — *Paid media management and placement within managed
  advertising accounts*, owned by `master`, mapped to no capability, for the reason every channel
  row is: running an account is the coordination of several media, not a medium.
  `DIGITAL_MARKETING_ENGAGEMENT` is **19**, was 18.
- **The catalogue did not move.** 81 approved services, unchanged. `GS-O013` confirms paid-media
  *management* and explicitly forbids materially expanding the catalogue, so there is no approved
  entry for standalone media buying and a service record claiming it would be a page for something
  the approval does not contain.
- `Media buying` therefore **stays** in `UNCONFIRMED_CHANNEL_SERVICES`, on that narrower reading,
  which also keeps the denylist non-empty and the assertion alive. `coverageProblems` limb 5
  reads a record's title and `covers` only, so no engagement activity is in its scope.

**The transferable part: silence is not a refusal.** `GS-P05` turned an unanswered item into a
published denial, and a denial is a claim about the company that has to be true. The safe handling
of an unconfirmed capability is to say nothing about it, not to say it is not offered.

**Confirming a capability is not approving copy for it.** No public wording exists for any channel
service and none was invented. Master engagement-model copy remains unwritten and unrequested, so
these are recorded capabilities with no page — the state campaign management has been in since
`GS-P04`. Per-channel exclusions are needed before any of them is published, and that sits with
the copy acceptance in `GS-O013`.

The live `gridsmith.uk` advertises three of them. That was never the authority — §4, and
`LIVE-SITE-EXTRACT.md` §4, §7, §8. The owner's direct confirmation is.

**One piece of copy was corrected because the confirmation made it false**, and it is worth
naming as a class rather than an incident. The Design service *Campaign & Social Creative* carried
the exclusion *"Gridsmith does not run ad accounts, set budgets or buy media."* That was accurate
when written and became a false statement about the company the moment `GS-O012` closed.

**`GS-P05` corrected half of it and left the other half standing.** The replacement kept *"media
buying is not something Gridsmith undertakes"*, which `GS-O013` then identified as the same
contradiction one clause smaller. It now draws the boundary at what the service is — creative
production — and says that running the campaign is a separate cross-division engagement. Neither
version denies a capability.

**An owner confirmation can invalidate existing copy, not only leave gaps in it.** A capability
decision is usually read as "what may we now add"; this one also asked "what did we already say
that is now wrong". Nothing automatic finds that — the exclusions are prose, and no gate knows
which of them contradict the engagement map. It was found by re-reading the exclusions against
the newly confirmed list, and that re-reading is the step to repeat the next time a capability is
confirmed.

## 14. Freelancer reviews — anonymisation, and a count discrepancy

**Decision (`GS-O011`):** identifiable project titles come off every review.

**The rule applied, mechanically:** strip every client name, brand name and product identifier
from the source's project title, keeping only the generic category of work. Where stripping
leaves nothing meaningful, the title is omitted.

| Review | Source title | After |
|---|---|---|
| Tom | Shopify Theme Image & Color Edits | Ecommerce theme customisation |
| Elizabeth | Artistic Logo Design for **Casglu** | Logo design |
| Chad | Miniature Medieval Castle Model | 3D modelling |
| Stamos | Ultra-Thin Wallet-Sized Wireless Charger Design | *(omitted)* |
| Stephanie | Open Eyes Photoshop Edit | Photo editing |
| B-Edward | Editable Circle Image in PowerPoint | Presentation graphics |

`Casglu` is a client's brand and is what made the decision necessary. Stamos's title was a
product identifier end to end, and the quote does not say what the work was, so a category would
have been a guess about a client engagement — it is omitted instead, which costs nothing: the
quote, the attribution and the source link are what make a review worth printing.

**No quote was altered.** All six bodies are byte-identical to the 21 August 2026 transcription,
and none contains a client name, so no review had to be withheld. Reviewer first names and public
handles remain: they are the attribution that makes a review checkable at its source, not client
identities. **No rating is stated** — Freelancer's stars were never transcribed and the schema has
no field for one; inventing a rating would be inventing evidence.

`check:service-content` refuses every removed fragment, in the source and in the dataset. Each
fragment on the denylist is proven to match, so a dead entry cannot sit there unexercised.

### The count — **RESOLVED at `GS-P05`. There are 12, and the owner was right.**

**`GS-P04`'s finding was correct about the data and wrong about what the data meant, and the
correction is recorded rather than quietly overwritten.** It reported *"the owner states 12;
authoritative source data holds 6"*, and `GS-O013` asked the owner to supply the other six or
correct the figure. Both halves were sound reasoning from what `GS-P04` could see. The reading
laid on top of them was not: **six was the size of an incomplete ingestion, not the size of the
evidence.** The owner challenged it, and the owner was right.

Verified independently on **16 September 2026**, two ways:

| Source | Reports |
|---|---|
| `https://www.freelancer.com/u/GridsmithLTD`, read unauthenticated | `5.0 · 12 Reviews` |
| `GET /projects/0.1/reviews/?to_users[]=92543257`, official API, unauthenticated | `reviews_count: 12`, twelve review objects |

All six transcribed in `seed-content.mjs` are in the twelve, matched by body. **Four of the six
differ from the API text only in whitespace** — the transcription collapsed runs of spaces the
reviewers themselves typed, so the API is not merely equivalent to the 21 August transcription, it
is *more* faithful than it. The six absent from the repository are Karl, Remy, a second review
from Tom and three from one repeat client.

**Nothing was invented to close the gap, and nothing needed to be.** The six were never missing
from Gridsmith's evidence — only from this repository's copy of it, which is the argument against
keeping a hand-maintained copy at all. §18 is what replaces it.

**What this changes about how a discrepancy is read.** `GS-P04` treated its own dataset as
authoritative and the owner's figure as the thing needing proof. The dataset was a *derived*
artefact — a hand transcription — and the authority was the platform. Where a stated figure and a
local record disagree, establish which of them is the source before deciding which one is wrong.

### The anonymisation decision survives the correction unchanged

`GS-O011` applies to all twelve and now genuinely can: §18's pipeline derives a category for every
review from Freelancer's own closed skill taxonomy and never reads a project title. The table above
records the six that were anonymised by hand; the other six have never been published anywhere on
this site and will be categorised by the same rule rather than by a second hand pass.

## 15. Service-page architecture — one template, three divisions

`GS-P03` left Digital as the only division with per-service routes, which made service discovery
inconsistent: a Design or Press visitor got a card with no page behind it. `GS-P04` gave all three
divisions the same route.

**One data-driven template, not three bespoke implementations, and not 46 page components.**

- `components/content/ServiceDetail.tsx` — the page body, division-parameterised.
- `components/content/servicePage.tsx` — a factory returning `generateStaticParams`,
  `generateMetadata` and the page component for a division.
- Three route files of six lines each: `/design/services/[slug]`, `/digital/services/[slug]`,
  `/press/services/[slug]`.

**Why one template is the right answer rather than a shortcut.** The *questions* a service page
answers do not vary by division — what the service is, what Gridsmith can do within it, how the
engagement runs, what it connects to, how to start a conversation. What varies is the voice, and
the voice is carried entirely by the theme the route group's root layout already set on
`<html data-division>`. The component names no colour, no typeface and no division-specific rule.
That is `CLAUDE.md`'s *"shared structure, not shared colour"*; three copies would have been three
pages drifting apart.

The page communicates, in order: capability group · title · summary and description ·
**what this covers** (the approved capabilities) · what you get · **what you do not get** ·
how it runs and what it asks of you · across Gridsmith (collaborators and related services) ·
contextual CTA plus **Contact Gridsmith**.

**It requires no price, no portfolio, no case study and no client evidence.** Every block is
conditional, so a record carrying only a title and a group renders a complete, honest page.

**Exclusions render; they never disappear.** On these pages the exclusions are load-bearing —
they are where Technical says it does not certify drawings and Press says it cannot promise a
retailer listing.

`components/content/DataRows.tsx` was promoted out of `components/divisions/digital/` in the same
change, on the condition its own docstring had set: *"if a second division genuinely wants it."*
Two now do. `components/divisions/digital/` is empty and gone.

## 16. The approved catalogue, and what is architecture

`lib/services/catalogue.ts` holds the **81 approved services** as `group` + `name`, transcribed
from the `GS-O006` approval. **It is a record of an owner decision, not architecture.** Nothing in
the schema, the query layer or any rendered component imports it, so adding or removing a service
inside an approved group remains ordinary CMS content work with no code change — the promise §1.2
makes and `GS-O006` was given.

It exists for the one question a CMS cannot answer about itself: *did the development content
foundation actually represent everything the owner approved?* The expectation therefore comes from
outside its subject, which is `CLAUDE.md`'s rule about an expectation derived from its own subject.

**81 approved services → 46 service records.** A record is a page, and 81 pages would mean pages
like *Naming support* carrying three sentences. `service.capabilities` (`covers` in the content
module) keeps the arithmetic honest: every approved service is named by exactly one record,
`check:service-content` proves it in both directions, and the names render on the page.

| Division | Records | Approved services covered |
|---|---|---|
| Design | 16 | 31 |
| Digital | 17 | 28 |
| Press | 13 | 22 |
| **Total** | **46** | **81** |

## 17. What the development content is, and what it still needs

**Truthful development content, `isSeed: true`, and deliberately *not* `[SEED]`-marked.**

The `[SEED]` text marker labels *visibly fabricated* text. This content is not fabricated: it
describes services the owner confirmed, in plain factual terms. Marking it fake would make the
development site unreadable and teach a reviewer to ignore the marker where it still means
something. What blocks production is unchanged and machine-enforced: `isSeed: true`, plus
`check:launch` refusing a production dataset containing a published seed record — an assertion
with a committed specimen. **Non-negotiable #4 is intact.**

What remains unapproved is the **wording**, which is agent-authored. That is **`GS-O013`**, and
closing `GS-O006` does not close it. `scripts/service-content.mjs` records the rules the copy was
written under: no price, no portfolio, no turnaround, no SLA, no revision count, no guaranteed
outcome, no client number, no certification, no regulatory status, no years of experience.

**Process detail** is per-division, keyed to the canonical six stages, and states no duration and
no client time — `processStep` has both fields and they are left empty, because a duration is an
operational commitment no owner fact supplies.

**Technical Design content exists and stays gated.** All three Technical records are published in
development with `professionalScopeConfirmed: false`; `check:launch` counts them and refuses them
on production. `GS-O005` and `GS-X002` are untouched and remain open.

## 18. Freelancer review retrieval — `GS-P05`, **activated at `GS-P06`**

**Decision:** reviews are read from Freelancer's official API at request time and cached for 24
hours. There is **no second copy** of them — not in Sanity, not in Supabase, not in a committed
fixture. Built at `GS-P05`; **wired into the Master homepage at `GS-P06`** when `GS-O014` closed,
and **deliberately nowhere else** — §19.

### Why the API, and not the profile page

`GS-P05` was told to establish an official route before considering anything else, and one exists:

| | |
|---|---|
| Endpoint | `GET https://www.freelancer.com/api/projects/0.1/reviews/` |
| Documented at | `developers.freelancer.com` → Projects → Reviews → *List Project Reviews* |
| Filter used | `to_users[]=92543257` (the Gridsmith account), `role=freelancer` |
| Pagination | `limit` / `offset`; twelve reviews fit one page of 100 |
| Rate limits | documented per endpoint, e.g. `50/60s` and `1000/3600s`, returned in `RateLimit-*` headers |
| Webhooks | **none documented anywhere in the API reference** — so synchronisation must be pull-based |
| Authentication | documented as OAuth `basic` + `fln:project_manage`; **observed to answer `200` unauthenticated** |

**No browser automation, no HTML scraping, no session reuse, no private endpoint.** The one thing
the public HTML page does that this does not is paginate: an anonymous visitor sees five reviews
and a *Show all 12* control that opens a sign-up modal. The API returns all twelve to the same
anonymous caller. Nothing here defeats that control — it is a growth prompt on a web page, and the
platform's own public API publishes the data it sits in front of. The request carries no
credential, no cookie and no session, and `check:reviews` question 3 asserts that it cannot.

**The documentation/behaviour divergence is the largest risk in this integration and is not
papered over.** The site would depend on measured behaviour rather than documented behaviour. If
Freelancer begins enforcing the documented scopes, the fetch returns nothing, the block stops
rendering, and `check:reviews --live` goes red. It cannot half-work, and it cannot take a page
down. Should that happen, the fallback is the documented OAuth path, which needs an owner action
and is written up in `OWNER-ACTIONS.md` rather than discovered under pressure.

### Why nothing is stored

Freelancer's API T&Cs decide this before engineering does:

- **§5.3** — *"You may not copy or store any Data … except to the extent permitted by these API T&Cs."*
- **§5.1** — *"Where Data is cached, you should refresh the cache at least every 24 hours."*

A `testimonial` document written into Sanity is a stored copy that never refreshes. A 24-hour
revalidating fetch cache is the form the terms describe. So **the cache is the storage layer**, and
`next: { revalidate: 86400 }` in `lib/reviews/freelancer.ts` is the term rather than a tuning knob.

It also removes a defect class outright. A CMS copy and a live source that must agree, with only
one of them reaching a reader, is `01-VALIDATION-REPORT.md` §21 exactly — the shape that let
`seed-legal.mjs` diverge from `docs/_legal/` across nine review rounds. With one source there is
nothing to diverge.

| Option considered | Rejected because |
|---|---|
| **A. Cached server-side retrieval** | **chosen** |
| B. Synchronise into Sanity | a permanent stored copy (§5.3); needs a write token, a scheduler and dedupe; re-creates the two-artefact defect; and makes genuine quotations editable, which is a liability rather than a feature |
| C. Synchronise into Supabase | same storage objection, plus a table, a migration, RLS and a scheduled writer for data that is already public |
| D. Committed last-known-good fixture | a permanent stored copy that by definition never refreshes; and a second artefact that must agree with the source |

### The shape

```
Freelancer API  →  fetch (24h revalidate)  →  zod validation  →  withhold unsafe bodies
                →  categorise from the skill taxonomy  →  TestimonialList
```

**Refresh** is Next's ISR revalidation. No cron, no GitHub Action, no webhook — there is no webhook
to use, a scheduled job would need somewhere to write, and Vercel Cron availability under the
eventual plan is unverified and was therefore not designed around. Reviews appear within 24 hours
of Freelancer publishing them, which is the requirement and also the term.

**Outage behaviour.** Next serves the previously cached entry when a revalidation fails, so the
last-known-good set keeps rendering. With nothing ever cached the function returns an empty list
and the block renders nothing — `Testimonials` already returns `null` on an empty list. Every
failure mode (network, non-200, malformed body, schema rejection) takes the same path. **A
Freelancer outage cannot take a page down.**

**Performance.** Zero client JavaScript and zero client-side fetching: the request happens on the
server during static generation and revalidation. No budget in `CLAUDE.md` moves.

### Anonymisation — structural, not careful

`GS-O011` applies to every review, including ones nobody has seen yet. The rule that makes that
possible is **where the category comes from**:

- **The source's project title is never read.** `review_context.context_name` is free text a
  client typed, and `Artistic Logo Design for Casglu` names a client's brand. No cleverness makes
  free text safe to generalise automatically, because the next title carries a name no rule
  anticipated.
- **The category is derived from `jobs[]`, Freelancer's own closed skill taxonomy.** A client's
  name cannot appear in a skill tag — not because a filter removes it, but because the field
  cannot contain it. Thirteen allowlisted labels, matched in **list order** so the same review
  always yields the same label whatever order the payload arrives in.
- **No match means no category and no division**, never a guess. `projectTitle` is optional,
  `TestimonialList` omits the line, and `listTestimonialsForDivision` already sorts non-matching
  divisions later rather than dropping them.

**Bodies are published verbatim or withheld whole — never edited.** A genuine quotation that
cannot be published is dropped and reported. Three deterministic rules: the reviewer's own company
name appears in the body (drawn from the same payload, so it needs no maintained list and covers
reviewers nobody has seen yet); the body contains a URL or email address; the body is empty.

**The stated ceiling:** the first rule can only see a company Freelancer actually publishes. A
client naming an employer that is not on their profile is not detectable by any automatic rule and
is not claimed to be — which is why `check:reviews --live` **reports** the withheld count rather
than asserting it is zero.

**Never rendered, and never even parsed:** `paid_amount`, `bid_amount`, `price_usd`, `currency`,
`project_id`, `review_context.seo_url` and the reviewer's `company`. A field that is not in the
schema cannot be rendered by a later accident. Two of the twelve reviewers publish a company name;
all twelve carry a project value. None reaches the site.

### Attribution

*"Verified review via Freelancer"* per card, plus a link to the public profile so a reader can
check it. It claims what the platform asserts by publishing the review and nothing more — no
endorsement, no partnership. **No Freelancer mark, logo or asset is used**: API T&Cs §2 defines
the brand and §8 leaves its use unpermitted, so it is not used. The reviewer's `public_name` is the
attribution, which is the same name Freelancer shows an anonymous visitor.

**Reviews are not portfolio.** Freelancer portfolio items remain unauthorised for reproduction on
`gridsmith.uk` and `GS-D001` is unchanged.

### One honest consequence the owner should decide on

Eleven of the twelve reviews are 5.0. **The twelfth is 4.6 and contains criticism** — it says
communication *"could be much better"*. An automatic pipeline publishes it with the rest, which is
the correct default for a site whose Press section is required to be able to recommend against
Gridsmith. It is still a change from the six hand-picked reviews published today, and it is a
decision, so it is named in `GS-O014` rather than shipped quietly.

### What is built, and what is deliberately not

| | |
|---|---|
| `lib/reviews/freelancer.ts` | the whole pipeline — request, validation, withholding, categorisation, mapping |
| `scripts/check-reviews.mjs` | four questions, `--live` reads the real API |
| `scripts/check-reviews.selftest.mjs` | 55 value-based cases, every rule limb broken separately |
| `scripts/check-reviews-ui.mjs` | **added at `GS-P06`** — ten questions over the SERVED page: Master renders the feed, no division does, the ring travels right to left, the pause control works, reduced motion is still and at content parity, nothing overflows, the link is reachable, no caption is identifying, the card is opaque, every `<time>` is a review date |
| `components/master/ReviewCylinder.tsx` | **added at `GS-P06`** — the Master presentation. §20 |

**The switch was thrown at `GS-P06`.** API T&Cs §4.1 requires anyone accessing the API to agree to
be bound by them, and accepting terms on Gridsmith Ltd's behalf is an owner act rather than an
agent's; `GS-O014` is that acceptance. `Testimonials` now reads the API, `DivisionLanding` renders
no reviews at all, and **the site carries one source**: `listTestimonials`,
`listTestimonialsForDivision`, the `TestimonialCard` type and `components/content/TestimonialList.tsx`
were all deleted in the same commit. The six `testimonial` documents remain in the **development**
dataset as historical development data — genuine records, `isSeed: false`, no longer read by
anything the site renders, and still asserted for anonymity by `check:service-content` question 3.
No Sanity call was made to retire them and none is needed.

### `GS-O015` — two reviews held back, and why that is not the owner being overruled

`GS-O014` accepted publication of all twelve. The question it was asked was whether criticism **of
Gridsmith** could be published; it can, and the 4.6 is on the page.

**Reading all twelve bodies at `GS-P06` — rather than running a rule over them — found a different
question.** Two of them name a third-party development company in terms Gridsmith would be
**republishing on its own homepage**: *"the very disgraceful Varnika Software PVT"* and *"initially
developed by Varnika Pvt in India which was a massive mistake"*. One also carries the client's own
product name in the body. Freelancer hosting a reviewer's words and Gridsmith reprinting them are
different publications with different exposure, and neither the automatic withholding rules nor
`GS-O014`'s wording reaches it: the rules test a body against the **reviewer's own** company, which
is the ceiling §18 already states.

Editing a quotation is not available. So the two options are publish whole or withhold whole, and
the conservative default was taken: `WITHHELD_REVIEW_IDS` in `lib/reviews/freelancer.ts` holds two
ids, the block publishes **10 of 12**, and `check:reviews --live` names each withheld review and
its reason on every run. **Emptying that array publishes them** — it is one owner sentence, and it
is `GS-O015`.

Note which way the default runs: nothing was deleted, no quotation was altered, and the reversible
option was the one that does not put an unreviewed legal position on a homepage.

## 19. Reviews are Master-only — `GS-O014`, the owner's amendment

**Decision:** the Freelancer feed appears on the Master experience and on no division page.

`GS-P04` and `GS-P05` ranked reviews onto division landings using a `division` field derived from
Freelancer's skill taxonomy. The owner's amendment records what that produced in practice: **a
3D-project review and a logo-design review both surfaced on Press.** The reviews were genuine and
the placement was not, and a real quote filed under the wrong studio is still a claim nobody can
check.

**The fix is not a better classifier.** Freelancer's taxonomy is a skills vocabulary for a
marketplace; it was never a map of Gridsmith's medium-based divisions, and inventing one would be
exactly the speculative metadata §18 built the pipeline to avoid — it would fail silently on the
next review nobody has seen. Master represents Gridsmith as a whole, so the complete eligible feed
belongs there and the division pages carry none.

This does **not** rule out division-level evidence from a properly curated source later. It rules
out *this* source being split three ways on a guess.

`check:reviews-ui` asserts both halves in one run, and that is deliberate: question 2 is an absence
over three routes, and what makes it a measurement rather than a hope is that **question 1 fires
the same selector against the same build and requires it to match**. A selector that had rotted
fails question 1 before question 2 can report a false clean.

## 20. The Master review experience — the cylinder, `GS-P06`

**Decision:** the reviews are presented as a continuously rotating 3D ring travelling right to
left, from the owner's reference (*Cylinder Carousel | Vengeance UI*).

**What was taken from the reference is the geometry**, which is the well-published CSS 3D ring:
children stacked in one grid cell, each turned `i × 360°/n` and pushed out by a radius derived from
the card width, with the container rotated by one infinite keyframe. **No third-party source was
copied.** The reference is an `<img>` carousel published with no licence statement on the page; it
keeps rotating under `prefers-reduced-motion` (its "reduced" mode only slows the turn to 128s); and
it has no pause control at all. Two of its three behaviours are things this site may not ship, so
where the reference and `CLAUDE.md` disagree, `CLAUDE.md` wins.

| Requirement | How |
|---|---|
| Right-to-left travel | `rotateY` runs **negative**; positive rotation carries the near arc to the right. Asserted by measuring a card's `left` twice, 1.2s apart |
| Seamless loop | one `to` of a full turn — the ring's state at 360° is identical to its state at 0°, so there is no boundary to reset across |
| Front card readable | the keyframes carry `translateZ(-radius)`, putting the front card at z = 0 at its true size. Without it the front card is a full radius nearer the camera and is magnified past the stage |
| Geometry follows the data | `--review-count` is the only thing passed in; the angular step and the radius derive from it, so a thirteenth review re-forms a true cylinder with no stylesheet edit |
| Zero client JS | everything is CSS. Master's JS delta is **1.9KB of 15KB**, unchanged by this block |
| Reduced motion | **the flat grid is the BASE and the cylinder is layered on top**, inside one `@media (prefers-reduced-motion: no-preference)` + `@supports (tan())` block. Content parity is structural — same DOM, same reviews, same order — rather than a second markup path that must be kept in step |
| Pause | WCAG 2.2 SC 2.2.2 is Level A and a hover pause does not satisfy it, so there is a real checkbox with a real label. Hover (behind `(hover: hover)`) and `:focus-within` pause it too |
| Keyboard | **no focusable element is ever carried behind the cylinder** — the cards hold no links. Rotation therefore cannot move focus, strand it on a back-facing card, or need a `tabindex`/`inert` sweep |
| Responsive | the card's width and height and the perspective adapt per breakpoint and the radius follows the width. §17's alternative — compressing desktop geometry — is what turns review text into decoration |

**The cards carry no link, and that is a change of position.** `TestimonialList` rendered the
source link per card and argued for it: a reader checking one quote should not have to work out
which footnote applies. That was right while reviews could have different sources. Every review
here resolves to the same URL, structurally — the pipeline never reads a per-project link — so
there is one destination and no footnote to match. What it buys is the whole rotating-focus
problem removed rather than managed.

**`--dur-cycle` and `--dur-cycle-narrow` were added to the token layer**, 39 base tokens → 41.
`check:tokens` refuses a duration literal outside the scale and its own message says a fourth
duration goes into `tokens.css` first; a continuous cycle measured in seconds is not a UI
transition and does not belong on `fast`/`base`/`slow`, so it is a separate pair.

**`check:axe` reports zero violations and 73 allowed `color-contrast` incompletes on `/`.** The ring
stacks every card in one grid cell — that is what a cylinder is — so axe cannot resolve a
background and says so in its own words. Two `INCOMPLETE_ALLOWED` entries cover them, and **both
premises those entries rest on are asserted elsewhere by value**: `check:reviews-ui` question 9
proves the card background is opaque, and question 10 proves every `<time>` on the route is a
review date. An allowlist whose stated reason nothing checks is a bypass with a comment.
