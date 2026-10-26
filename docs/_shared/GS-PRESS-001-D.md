# GS-PRESS-001-D — Press service architecture and content

**Authority:** owner visually approved `GS-PRESS-001-R3` on 26 September 2026 and authorised this architecture/content implementation. R3's Publishing Desk, hero loop, six chapter compositions, palette, type and motion are frozen. This record supersedes the Press inventory and group labels in `SERVICE-ARCHITECTURE.md` §2; the older 4/13/22 figures remain its historical `GS-P03` baseline. Release-candidate verification, production publication and Path Finder activation are outside this phase.

## Decision

| Model | Territories/groups | Canonical service pages | Approved capabilities in `lib/services/catalogue.ts` |
|---|---:|---:|---:|
| Previous Press model | 4 | 13 | 22 |
| Formalised Press model | 6 | 14 | 29 |

The R1 prototype's 43 catalogue entries are presentation rows: **14 service links, 19 component capabilities, 9 conditional support entries and 1 coordinated specialism**. They are not 43 service records. Every row points to one of the 14 records, and `check:service-content` rejects missing links, duplicate service rows, invalid kinds, missing conditional qualifications and territory mismatches. `components/divisions/press/catalogue.ts` is the presentation metadata; `scripts/service-content.mjs` supplies repository service content; `lib/services/catalogue.ts` lists approved capability coverage. The checks bind all three rather than letting an unrelated prototype list drift.

The six groups retain the existing `writing`, `editorial`, `publishing` and `content-promotion` keys where their meanings remain accurate. Their public labels change. `book-production` and `audiobook` are added. This limits the development CMS migration to two moved existing records and one new record; the other 11 records keep their group keys.

## Canonical routes and migration of all 13 existing services

All old URLs remain valid; **no redirects are required**. The route template remains `/press/services/[slug]`, with static params and metadata read from published Sanity `service` records. The one new route requires a published development record before served verification.

| Territory | Canonical service | Slug | Decision from previous model | Previous route | Primary capabilities |
|---|---|---|---|---|---|
| Writing & Development | Ghostwriting | `ghostwriting` | KEEP | same | interviews, outline, staged manuscript drafts |
| Writing & Development | Book Writing & Development | `book-writing-and-development` | KEEP | same | concept, structure, drafting, author consultation |
| Writing & Development | Website & Campaign Copywriting | `website-and-business-copywriting` | KEEP | same | website, sales and campaign copy |
| Writing & Development | Thought Leadership, Whitepapers & Reports | `thought-leadership-and-reports` | KEEP | same | thought leadership, whitepapers, reports |
| Editing | Manuscript Assessment | `manuscript-assessment` | KEEP; prototype calls this critique | same | whole-manuscript assessment and recommendation |
| Editing | Manuscript Development & Structural Editing | `manuscript-development` | KEEP | same | developmental and structural work |
| Editing | Copy Editing & Proofreading | `copy-editing-and-proofreading` | KEEP, EXPAND | same | line, copy and mechanical editing; final proofread as a separate scoped stage |
| Book Design & Production | Typesetting & Formatting | `typesetting-and-formatting` | MOVE from Publishing | same | interior layout, print/eBook files, print specification and coordination |
| Book Design & Production | Cover Design Coordination | `cover-design-coordination` | MOVE from Publishing | same | brief and coordination; Gridsmith Design owns visual artwork |
| Publishing & Distribution | Publishing Preparation & Distribution Setup | `publishing-preparation` | KEEP, EXPAND | same | metadata, ISBN guidance, accounts, submission and release preparation |
| Audiobooks | Audiobook Production Support | `audiobook-production-support` | NEW | none | audio script, production plan, narration and supplier coordination, file preparation |
| Marketing & Content | Content Programmes | `content-programmes` | KEEP | same | editorial plan and ongoing written content |
| Marketing & Content | Content SEO | `content-seo` | KEEP | same | search-informed editorial briefs, writing and optimisation |
| Marketing & Content | Book Marketing Support | `book-marketing-support` | KEEP, EXPAND | same | descriptions, bios, launch and written promotional material |

The existing 13 map one-to-one to the rows bearing their old slugs. No existing route is split or deleted. The copy-editing route can be enquired about for a line edit, copy edit, mechanical edit or proofread; the page explains that they are distinct stages and scopes. Manuscript critique is the existing assessment service. Author consultation is a component of writing/development, not a thin page. One audiobook page contains the production steps and their conditional qualifications.

## R1 prototype additions and capability decisions

The table lists every non-service row from the actual 43-entry R1/R2/R3 catalogue. `SERVICE` rows are the 14 canonical routes above. A destination is where an enquiry can read about the work; it does not turn the row into a separate service.

| Territory | Prototype entries | Decision | Canonical destination / qualification |
|---|---|---|---|
| Writing | Author & Manuscript Consultation; Manuscript Critique & Assessment | CAPABILITY; CAPABILITY | Book Writing & Development; Manuscript Assessment (also shown under Editing) |
| Editing | Line Editing; Mechanical Editing | CAPABILITY; CAPABILITY | Copy Editing & Proofreading; separate stages agreed in scope |
| Editing | Translation & Bilingual Proofreading | CONDITIONAL SUPPORT | Editing service; language, scope and suitable qualified resource availability must be confirmed |
| Production | Print & eBook Formatting; Print Production Coordination; Reflowable eBook Preparation; Print-ready File Preparation; Print Specification Guidance | CAPABILITY | Typesetting & Formatting; production coordination uses the agreed third-party supplier |
| Production | Illustration Coordination | COORDINATED SPECIALISM | Cover Design Coordination; Design creates visual artwork where included |
| Publishing | Metadata & ISBN Guidance; Release Preparation; Category & Keyword Guidance; Publishing File Checks | CAPABILITY | Publishing Preparation & Distribution Setup |
| Publishing | Print-on-Demand Coordination; Platform Readiness & Submission Support; Account & Platform Coordination | CONDITIONAL SUPPORT | Publishing Preparation & Distribution Setup; destination, scope and third-party availability decide what is possible |
| Audio | Script Preparation for Audio; Chapter & Track Preparation | CAPABILITY | Audiobook Production Support |
| Audio | Narration & Voice Coordination; Audio Editing & Mastering Coordination; Platform-ready Audio Preparation; Audio Distribution Guidance | CONDITIONAL SUPPORT | Audiobook Production Support; supplier, destination and project dependent |
| Marketing | Book Description & Launch Copy; Author Bio & Profile Copy; Email & Announcement Copy; Editorial Social Content | CAPABILITY | Book Marketing Support |
| Marketing | Press & Media Material | CONDITIONAL SUPPORT | Written material may be scoped; no media placement or coverage promise |

Additional requested distinctions are included within those destinations rather than new routes: print and hardback/paperback specifications, destination-specific formatting, metadata and platform upload support, reader-facing promotional copy, and editorial linking recommendations. No in-house printing, voice studio, voice roster, platform affiliation, universal language coverage, publicist representation or retailer placement is claimed. No requested capability is rejected as a subject for enquiry; unsupported unconditional versions of those claims are **not public**.

## Boundaries and public wording

- **Publishing:** Gridsmith prepares, guides, coordinates and, where scoped, helps with setup or submission. The written scope determines ISBN, imprint, publisher identity, accounts and rights arrangements. Platforms and retailers decide acceptance and distribution. Printers and print-on-demand suppliers produce physical books. No quality, turnaround, availability, sales or ranking result is promised.
- **Audiobooks:** one service page. Script and track preparation are Press work; narration, studio, editing/mastering and platform delivery may involve agreed suppliers. Resource availability and destination requirements are project specific. No platform affiliation or acceptance promise.
- **Marketing:** Press owns written/editorial material and content SEO. Design makes visual campaign assets. Digital implements landing pages, tracking and technical SEO. Master holds cross-channel strategy and account/programme management. A customer sees one scoped engagement rather than an internal ownership chart.
- **Cover and illustration:** Press coordinates within publishing work; Design owns the visual craft. A Press cover-coordination route is retained because it is a meaningful publishing engagement, not a second visual-design service.
- **Translation and bilingual proofing:** conditional support only. Neither a new route nor a claim of in-house or all-language coverage.

The consumer and business terms in `docs/_legal/` are draft instruments awaiting solicitor confirmation. The service copy makes no new contractual promise. It uses the B2-qualified account, ISBN, publisher and rights position and keeps engagement-specific decisions in the written scope. The public R3 rights passage remains unchanged. No Book Publishers Den portfolio, author identity, cover, client claim, result, testimonial, statistic or proprietary image is used.

## Landing, contact, process and SEO

The approved R3 landing composition, six chapters, hero and interactions remain intact. Catalogue labels stay in their established places; the obsolete proposed-addition daggers and legend are removed, and the one short explanation now says each row leads to its covering service. All 43 links have a canonical slug. The six process names still come from `lib/process/canonical.ts` exactly; supporting lines were not renamed.

The existing `check:press:type` initially failed because its P-03 margin-note branch had zero rendered subjects: R3 replaced the old rights-block layout and no Press route now renders `MarginNote`. That retired branch was removed deliberately; body size, leading and prose measure still run. The audiobook page was added to its route set. The updated gate passed 12 route/width combinations and 45 prose blocks. No margin note or other R3 visual was restored to satisfy an obsolete check. ESLint now excludes the ignored `.next-press` build output left by R3 prototyping, just as it already excluded `.next`.

The source inventory also classifies `.next-press` as generated output. The bundle gate's two-member baseline now compares the featureless `/press/services/publishing-preparation` page with `/_not-found`: the R3 landing has client interactions and is measured against its unchanged 20 KB route ceiling instead. The measured baseline spread is 0.2 KB within its unchanged 0.3 KB tolerance; `/press` measures 3.9 KB against 20 KB. This changes the gate's subject, not its budget.

General enquiry remains `/contact?division=press`. Specialist enquiry remains `/press/contact`; it now offers a broad editing/production/publishing/audio segment with four work types and a short source-material description, alongside the existing author, business, memoir-gated and content branches. This uses the existing server action and lead pipeline. The purpose-neutral segment links to the terms disambiguation page. Path Finder remains withheld and carries no data to the contact form.

The new audiobook service receives a distinct title and summary as its Sanity SEO fields. The 13 retained routes keep their individual titles and descriptions, updated only where their content changed. `/press` already describes the broader offer. No fabricated structured data, keyword list or redirect is added.

## CMS and migration boundary

Sanity's `service.capabilityGroup` list derives from the six-group code model; no new type or field is needed. `scripts/service-content.mjs` and the generated `GS-P05-OWNER-CONTENT-REVIEW.md` contain the repository-local content. `scripts/seed-content.mjs --press-only` is the narrowly guarded, **development-only, non-deleting** write path: it checks the expected 13 existing Press seed IDs and replaces those records plus creates the new audiobook seed record. It refuses unexpected records and never touches other divisions or the production dataset. The ordinary full seed path is not used in this phase because it deletes obsolete documents.

**Development migration executed 26 September 2026:** `--press-only` wrote 14 Press seed service documents, deleted 0 and left other divisions untouched. An unauthenticated `check:service-content:dataset` read then found 47 published services across the three divisions, six testimonial documents and zero provenance mismatches; coverage passed. This is development-only content, still marked `isSeed: true`.

Production Sanity is unchanged. Before a later production release, migrate the approved Press service documents: preserve the 13 slugs, move the two production records to `book-production`, update the remaining copy/capability data, create the audiobook record, verify the published set and `isSeed` policy, and only then test the new route on protected staging. This is a future controlled migration, not a permission to publish seed data. Solicitor-dependent terms and owner copy acceptance remain separate gates. RC responsive, axe, Lighthouse, security and protected Preview verification remain pending.

## Targeted verification and visual freeze

The approved R3 composition, chapter backgrounds, hero loop, typography and motion remain intact. The only visible adjustment made for this phase is a heavier selected-state weight on the desk pause control and current chapter navigation item, so those states do not depend on colour alone. The theme gate now recognises R3's intentional Inter face for editorial apparatus. Neither adjustment changes the service chapter compositions.

On 26 September 2026, `verify:static` passed, including TypeScript, ESLint, schema, service-content, contact, colour, contrast and state-cue checks. A fresh `npm run build` passed and generated all 14 Press service routes. The built theme, token, secret and bundle gates passed; `/press` measured 3.9 KB against its 20 KB route budget. With the production server running, `check:press:type` passed 12 route/width combinations and 45 prose blocks, `check:legal:parity` matched 94 served clauses, and `check:service-content:dataset` passed against the unauthenticated development dataset. Focused browser smoke covered `/press`, all 14 service routes, `/press/contact`, the general Press enquiry route and all 43 landing catalogue links. `git diff --check` passed.

These are local architecture/content checks. The full responsive, axe, Lighthouse and security matrices, protected staging Preview, production CMS migration and cutover belong to `GS-PRESS-001-RC`; none is claimed complete here.
