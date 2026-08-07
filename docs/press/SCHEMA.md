# Schema — Gridsmith Press

Core types in `_shared/SCHEMA-CORE.md`. This file defines Press-specific types, extensions, and data contracts.

---

## 1. `book` — the verification asset

The most important document type on the Press site. Every field exists to let a suspicious visitor verify a claim independently (R6-Press).

```ts
{
  name: 'book', type: 'document',
  fields: [
    { name: 'title',        type: 'string', validation: required },
    { name: 'slug',         type: 'slug' },
    { name: 'authorName',   type: 'string', validation: required },
    { name: 'authorIsClient', type: 'boolean' },
    { name: 'cover',        type: 'image', validation: required,
      options: { hotspot: false } },       // fixed 2:3, no cropping
    { name: 'subtitle',     type: 'string' },
    { name: 'category',     type: 'string', options: { list: [
        'Business','Memoir','Self-help','Technical','Fiction',
        'Academic','Children','History','Other' ]}},
    { name: 'formats',      type: 'array', of: [{type:'string'}] },  // paperback, hardback, ebook, audio
    { name: 'isbn13',       type: 'string' },
    { name: 'publishedDate',type: 'date', validation: required },
    { name: 'pageCount',    type: 'number' },
    { name: 'wordCount',    type: 'number' },
    { name: 'servicesUsed', type: 'array', of: [{type:'reference', to:'service'}] },
    { name: 'retailers',    type: 'array', of: [{ type: 'retailerLink' }],
      validation: r => r.min(1) },          // ≥1 verifiable link required
    { name: 'linkStatus',   type: 'string', options: {
        list: ['ok','broken','unchecked'] }, initialValue: 'unchecked', readOnly: true },
    { name: 'lastChecked',  type: 'datetime', readOnly: true },
    { name: 'caseStudy',    type: 'reference', to: 'project' },
    { name: 'testimonial',  type: 'reference', to: 'testimonial' },
    { name: 'authorConsent',type: 'boolean',
      validation: r => r.custom(v => v === true
        || 'Written author consent is required before publishing a title') },
    { name: 'featured',     type: 'boolean' },
    { name: 'published',    type: 'boolean' }
  ]
}

retailerLink {
  retailer: 'amazon-uk'|'amazon-us'|'waterstones'|'ingram'|'kobo'|'apple-books'|'bookshop-org'|'other',
  url: url (required),
  label: string
}
```

Two hard validations:
- `retailers` requires at least one entry. **A book cannot appear on the shelf without a way to verify it exists.** This is the entire purpose of the shelf.
- `authorConsent` must be true. Publishing a client's book as a credential without written permission is both an IP issue and, given ETH-06, a stated ethical commitment.

`linkStatus` and `lastChecked` are written by the weekly cron, read-only in the CMS.

## 2. `publishingPackage`

```ts
{
  name: 'publishingPackage', type: 'document',
  fields: [
    { name: 'title',       type: 'string' },       // "Complete", "Essential", "Editorial Only"
    { name: 'slug',        type: 'slug' },
    { name: 'strapline',   type: 'string' },
    { name: 'price',       type: 'number', validation: required },
    { name: 'priceNote',   type: 'string' },       // "for manuscripts up to 80,000 words"
    { name: 'priceIsFrom', type: 'boolean' },
    { name: 'scalingFactors', type: 'array', of: [{type:'string'}],
      validation: r => r.min(1) },                  // what changes the price — required
    { name: 'includes',    type: 'array', of: [{ type: 'packageLine' }],
      validation: r => r.min(5) },
    { name: 'excludes',    type: 'array', of: [{type:'string'}],
      validation: r => r.min(3) },                  // ETH-03 / FR-P06
    { name: 'revisionRounds', type: 'number', validation: required },
    { name: 'extraRevisionCost', type: 'number' },
    { name: 'typicalDuration', type: 'string' },
    { name: 'authorTimeCommitment', type: 'string', validation: required },
    { name: 'distributionPlatforms', type: 'array', of: [{type:'string'}] },
    { name: 'bestFor',     type: 'string' },
    { name: 'notFor',      type: 'string', validation: required },  // honesty requirement
    { name: 'recommended', type: 'boolean' },
    { name: 'order',       type: 'number' }
  ]
}

packageLine { label: string, detail: text, category: 'editorial'|'design'|'production'|'distribution'|'support' }
```

`price` is required and is a number, not a string. **There is no "POA" path in this schema.** FR-P06 is enforced structurally: a package without a price cannot exist.

`notFor` and `excludes` are required with minimums, for the same reason.

`revisionRounds` and `extraRevisionCost` are required because unexplained later fees are the specific vanity-press behaviour buyers are warned about (R6-Press).

## 3. `pathFinderConfig` — singleton

```ts
{
  name: 'pathFinderConfig', type: 'document', __experimental_singleton: true,
  fields: [
    { name: 'version',   type: 'number' },
    { name: 'questions', type: 'array', of: [{ type: 'pathQuestion' }],
      validation: r => r.length(5) },
    { name: 'outcomes',  type: 'array', of: [{ type: 'pathOutcome' }],
      validation: r => r.min(6) },
    { name: 'rules',     type: 'array', of: [{ type: 'pathRule' }] }
  ]
}

pathQuestion {
  key: string, question: string, helpText: text,
  options: [{ key, label, note }]
}

pathOutcome {
  key: 'full-package'|'ghostwriting'|'assessment-first'|'content-programme'
       |'self-service'|'not-ready',
  title: string,
  explanation: text,
  isGridsmithService: boolean,        // false for self-service and not-ready
  linkedService: reference → service, // null when isGridsmithService is false
  externalGuidance: text,             // required when isGridsmithService is false
  externalLinks: [{ label, url }],    // KDP, IngramSpark, Draft2Digital
  showCta: boolean                    // MUST be false when isGridsmithService is false
}

pathRule {
  conditions: [{ questionKey, operator: 'is'|'in'|'not', value }],
  outcome: string,
  priority: number
}
```

**Schema-level enforcement of ETH-04:**
```ts
// Custom validation on the outcomes array
validation: r => r.custom(outcomes => {
  const nonGridsmith = outcomes.filter(o => !o.isGridsmithService);
  if (nonGridsmith.length < 2)
    return 'At least two non-Gridsmith outcomes (self-service, not-ready) are required';
  if (nonGridsmith.some(o => o.showCta))
    return 'Non-Gridsmith outcomes must not display a CTA';
  if (nonGridsmith.some(o => !o.externalGuidance))
    return 'Non-Gridsmith outcomes require honest external guidance';
  return true;
})
```
This makes it structurally impossible to quietly remove the honest outcomes later, which is the realistic long-term risk once someone looks at the conversion numbers.

## 3a. `publishingPlatform`

Powers the platform compliance module (FR-P07a) — the concrete answer to "why not just upload it myself".

```ts
{
  name: 'publishingPlatform', type: 'document',
  fields: [
    { name: 'name',        type: 'string' },   // "Amazon KDP", "IngramSpark"
    { name: 'slug',        type: 'slug' },
    { name: 'reach',       type: 'string' },   // what it actually gets you
    { name: 'formats',     type: 'array', of: [{type:'string'}] },
    { name: 'specRequirements', type: 'array', of: [{ type: 'platformSpec' }],
      validation: r => r.min(4) },
    { name: 'commonRejectionReasons', type: 'array', of: [{type:'string'}] },
    { name: 'whatWeDo',    type: 'text', validation: required },
    { name: 'couldYouDoItYourself', type: 'text', validation: required },
    { name: 'authorAccountRequired', type: 'boolean', initialValue: true },
    { name: 'specCheckedOn', type: 'date', validation: required },
    { name: 'order',       type: 'number' },
    { name: 'active',      type: 'boolean' }
  ]
}

platformSpec { requirement: string, detail: text, category: 'interior'|'cover'|'metadata'|'account' }
```

`couldYouDoItYourself` is required and must be answered honestly — for most platforms the answer is "yes, and here is what it involves". Saying so is the move that makes the paid service credible rather than gatekept. `specCheckedOn` exists because platform specifications change; a stale date on a live page is a quality failure and should be surfaced in the CMS after 90 days.

## 3b. `marketingPackage`

Marketing is a **separate service**, never bundled (FR-P27).

```ts
{
  name: 'marketingPackage', type: 'document',
  fields: [
    { name: 'title',        type: 'string' },
    { name: 'price',        type: 'number', validation: required },
    { name: 'durationWeeks',type: 'number' },
    { name: 'activities',   type: 'array', of: [{type:'string'}], validation: r => r.min(4) },
    { name: 'deliverables', type: 'array', of: [{type:'string'}] },
    { name: 'excludes',     type: 'array', of: [{type:'string'}], validation: r => r.min(3) },
    { name: 'authorTimeCommitment', type: 'string', validation: required },
    { name: 'outcomeStatement', type: 'text', validation: r => r.required()
        .custom(v => (v||'').length > 40
          || 'A no-outcome statement is required on every marketing package') },
    { name: 'bestFor',      type: 'string' },
    { name: 'notFor',       type: 'string', validation: required },
    { name: 'order',        type: 'number' }
  ]
}
```

`outcomeStatement` is validated as required with a minimum length. Book marketing is the single easiest place in this business to drift into implied promises, and ETH-02 forbids it. Making the disclaimer a required, non-trivial field means it cannot be quietly dropped when a package is added later.

## 4. `contentProgrammeTier`

```ts
{
  name: 'contentProgrammeTier', type: 'document',
  fields: [
    { name: 'title',         type: 'string' },
    { name: 'monthlyPrice',  type: 'number', validation: required },
    { name: 'outputPerMonth',type: 'string' },   // "2 long-form articles + 1 report per quarter"
    { name: 'formats',       type: 'array', of: [{type:'string'}] },
    { name: 'turnaroundSla', type: 'string' },
    { name: 'revisionRounds',type: 'number' },
    { name: 'includes',      type: 'array', of: [{type:'string'}], validation: r => r.min(4) },
    { name: 'excludes',      type: 'array', of: [{type:'string'}], validation: r => r.min(2) },
    { name: 'minimumTerm',   type: 'string' },
    { name: 'noticePeriod',  type: 'string' },
    { name: 'bestFor',       type: 'string' },
    { name: 'recommended',   type: 'boolean' },
    { name: 'order',         type: 'number' }
  ]
}
```

## 5. Extensions to core types

### `service` — Press additions
| Field | Type | Purpose |
|---|---|---|
| `serviceGroup` | `'book-publishing' \| 'ghostwriting' \| 'content-programmes'` | Group routing |
| `authorTimeCommitment` | string (required) | Persona P2's decisive information |
| `revisionPolicy` | text (required) | R6-Press |
| `relatedBooks[]` | ref → `book` | Verifiable proof on the service page |
| `distributionPlatforms[]` | string | FR-P07 |

### `project` (case study) — Press additions
| Field | Type | Purpose |
|---|---|---|
| `book` | ref → `book` | Every Press case study must link to a real title |
| `authorSegment` | `'individual' \| 'business' \| 'memoir' \| 'corporate'` | |
| `manuscriptStartState` | string | "Rough 40k draft" — shows the real starting point |
| `durationWeeks` | number | |

**Validation:** a `project` with `divisions` containing `press` must have a `book` reference. A Press case study with no verifiable published book is exactly the kind of unfalsifiable claim the market screens for.

## 6. Press lead payload contract

```ts
const authorPayload = z.object({
  segment: z.literal('author'),
  manuscriptStage: z.enum(['idea','partial-draft','finished-draft','revised-draft']),
  genre: z.string(),
  wordCount: z.enum(['under-20k','20k-50k','50k-80k','80k-120k','120k-plus','unknown']),
  previouslyPublished: z.boolean(),
  triedElsewhere: z.string().optional(),
  manuscriptLink: z.string().url().optional(),   // link, never upload (TECH-SPEC §9)
  timeline: z.enum(['3-months','6-months','12-months','no-deadline'])
});

const businessPayload = z.object({
  segment: z.literal('business'),
  bookPurpose: z.enum(['credibility','lead-generation','speaking','internal','launch']),
  whoWrites: z.enum(['ghostwritten','i-write-you-edit','team-writes','undecided']),
  companyName: z.string(),
  approvalNeeded: z.boolean(),
  timeline: z.enum(['3-months','6-months','12-months','no-deadline'])
});

const memoirPayload = z.object({
  segment: z.literal('memoir'),
  manuscriptStage: z.enum(['idea','partial-draft','finished-draft']),
  intendedReadership: z.enum(['family-only','public','undecided']),
  expectationsAcknowledged: z.boolean(),   // ETH-07 — must be true to submit
  timeline: z.enum(['6-months','12-months','no-deadline'])
});

const contentPayload = z.object({
  segment: z.literal('content'),
  formats: z.array(z.string()).min(1),
  volumePerMonth: z.string(),
  turnaroundNeeded: z.string(),
  procurementProcess: z.boolean()
});

export const pressLeadPayload = z.discriminatedUnion('segment',
  [authorPayload, businessPayload, memoirPayload, contentPayload]);
```

`expectationsAcknowledged` on the memoir branch is a required boolean. The form cannot submit without it. This is ETH-07 enforced in the data contract rather than left to UI discipline.

Budget bands:
`under-1k` · `1k-3k` · `3k-8k` · `8k-20k` · `20k-50k` · `50k-plus` · `monthly-retainer` · `not-sure`

## 7. Supabase — Press tables

```sql
create table press_path_results (
  id            text primary key,             -- nanoid(12)
  created_at    timestamptz not null default now(),
  session_id    text,
  config_version int not null,
  answers       jsonb not null,
  outcome       text not null,
  is_gridsmith_outcome boolean not null,      -- the ETH-04 audit column
  completed     boolean not null default false,
  last_step     integer,
  lead_id       uuid references leads(id),
  expires_at    timestamptz not null default (now() + interval '90 days')
);
create index press_path_outcome_idx on press_path_results (outcome, created_at desc);
create index press_path_honest_idx  on press_path_results (is_gridsmith_outcome, created_at desc);

-- Consumer cancellation compliance (CCR 2013 regs 36-37).
-- The record is the evidence that the express request was obtained.
create table consumer_consents (
  id                bigserial primary key,
  created_at        timestamptz not null default now(),
  lead_id           uuid references leads(id),
  client_email      text not null,
  segment           text not null check (segment in ('author','memoir')),
  terms_version     text not null,
  cancellation_notice_shown boolean not null,
  early_start_requested     boolean not null,
  early_start_wording_version text,
  requested_at      timestamptz
);
create index consumer_consents_email_idx on consumer_consents (client_email, created_at desc);

create table press_link_checks (
  id          bigserial primary key,
  checked_at  timestamptz not null default now(),
  book_slug   text not null,
  retailer    text not null,
  url         text not null,
  status_code integer,
  ok          boolean not null
);
create index press_link_book_idx on press_link_checks (book_slug, checked_at desc);

create table press_retailer_clicks (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  session_id  text not null,
  book_slug   text not null,
  retailer    text not null,
  returned    boolean not null default false   -- set true if the session continues after
);
```

## 8. Reporting views

```sql
-- The ETH-04 audit. If honest_outcomes is 0 over a meaningful sample,
-- the Path Finder is broken and must be fixed.
create view v_path_finder_honesty as
select date_trunc('month', created_at) as month,
       count(*) filter (where completed)                            as completions,
       count(*) filter (where completed and not is_gridsmith_outcome) as honest_outcomes,
       round(100.0 * count(*) filter (where completed and not is_gridsmith_outcome)
             / nullif(count(*) filter (where completed),0), 1)       as honest_pct
from press_path_results group by 1 order by 1 desc;

-- The trust journey: do people who leave to verify come back and convert?
create view v_verification_journey as
select date_trunc('week', c.created_at) as week,
       count(*)                                as retailer_clicks,
       count(*) filter (where c.returned)      as returned,
       count(distinct l.id)                    as leads_from_verifiers
from press_retailer_clicks c
left join leads l on l.payload->>'session_id' = c.session_id
group by 1 order by 1 desc;

-- Books shelf integrity
create view v_broken_links as
select distinct on (book_slug, retailer) book_slug, retailer, url, status_code, checked_at
from press_link_checks where ok = false
order by book_slug, retailer, checked_at desc;
```

`v_path_finder_honesty` is the most unusual view in the whole programme and the most important one on this division. It exists to make an ethical commitment measurable, so that its erosion is visible rather than silent.

## 9. GROQ query contracts

```groq
// Books shelf — only titles with consent and a working link
*[_type == "book" && published == true && authorConsent == true] | order(publishedDate desc) {
  title, "slug": slug.current, authorName, cover, category, formats,
  publishedDate, isbn13, linkStatus,
  "retailers": retailers[]{retailer, url, label},
  "hasCaseStudy": defined(caseStudy)
}

// Packages — pricing can never be null by schema, but assert anyway
*[_type == "publishingPackage"] | order(order asc) {
  title, "slug": slug.current, strapline, price, priceNote, priceIsFrom,
  scalingFactors, includes[]{label, detail, category}, excludes,
  revisionRounds, extraRevisionCost, typicalDuration, authorTimeCommitment,
  distributionPlatforms, bestFor, notFor, recommended
}
```
