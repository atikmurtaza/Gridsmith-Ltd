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
| **"Digital marketing support"** (§4, §8) | Decomposed per §3 | **RESOLVED at `GS-P04`** — the owner confirms campaign management. It is a cross-division *engagement*, not a service and not a discipline: §13 |
| **Google Ads setup or support** (FAQ, §7) | None | **Still open — `GS-O012`.** `GS-P04` confirmed campaign management and explicitly did NOT infer this from it |
| **Google Business Profile Support** (§4) | None | **Still open — `GS-O012`**, for the same reason as the row above |
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
| Campaign strategy and coordination | **Master** | — orchestration, not production |
| Campaign management | **Master** | — orchestration, not production |
| Visual campaign creative | Design | Marketing and campaign creative (`brand-visual`) |
| Advertising creative | Design | Marketing and campaign creative (`brand-visual`) |
| Social and content creative | Design | Social/content creative (`brand-visual`) |
| Written campaign copy | Press | Sales/campaign copywriting (`writing`) |
| Content programmes | Press | Ongoing content programmes (`content-promotion`) |
| Content SEO | Press | Content SEO (`content-promotion`) |
| Landing pages | Digital | Website design and development (`web`) |
| Technical SEO | Digital | Technical SEO (`operate-improve`) |
| Tracking and integration infrastructure | Digital | API integrations (`automation-intelligence`) |
| Reporting and measurement infrastructure | Digital | Data/reporting systems (`automation-intelligence`) |

**What the owner did *not* confirm, and what was therefore not written.** Campaign management is
one capability; it is not a licence to infer a channel roster from it. Google Ads/PPC management,
Meta/Facebook/Instagram advertising, social media management, Google Business Profile work, email
marketing and media buying are **absent from the catalogue**, and `check:service-content` refuses
any seeded record that claims one (`UNCONFIRMED_CHANNEL_SERVICES`, proven by deliberate failure).

The live `gridsmith.uk` advertises three of them. That is not authority — §4, and
`LIVE-SITE-EXTRACT.md` §4, §7, §8 — so they were not preserved on its say-so. They are
**`GS-O012`**, a deliberately narrow follow-up rather than a vague residue of `GS-O011`.

The Design service *Campaign & Social Creative* states the boundary in its own exclusions:
*"Gridsmith does not run ad accounts, set budgets or buy media."*

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

### The count — **6 located, 12 stated. Unresolved, and not invented.**

`GS-O011` states there are **12** reviews relevant to Gridsmith. The repository's authoritative
source data — the dated verbatim transcription in `scripts/seed-content.mjs` — holds **6**, and
the development dataset holds the same 6.

The six missing reviews were **not** created. Transcribing them from a live third-party page would
mean publishing review text that has never been through the dated, owner-verifiable transcription
this repository requires, and `CLAUDE.md` #2 and the protocol's *Owner facts* rule both forbid it.
The decision applies in full to all 12; it has been **implemented on the 6 that exist**, and the
remaining 6 are **`GS-O013`**.

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
