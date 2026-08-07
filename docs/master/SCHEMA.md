# Schema — Gridsmith Master Layer

Core types in `_shared/SCHEMA-CORE.md`. This file defines master-level types, the seed-content fields added group-wide, and the amendments the master layer makes to core types.

---

## 1. Group-wide amendments to core types — **applies to all four route groups**

### `isSeed` — added to every document type

```ts
{ name: 'isSeed', type: 'boolean', initialValue: false, readOnly: true,
  description: 'Placeholder content. Cannot be published in production.' }
```

Set by the seed script, never by hand. The production build fails if any `isSeed: true` document is published (`TECH-SPEC.md` §6). Applies to: `project`, `service`, `faq`, `testimonial`, `post`, `book`, `drawingType`, `techStackItem`, `publishingPackage`, `retainerTier`, `carePlanTier`, `contentProgrammeTier`, `sampleAsset`, `teamMember`.

### `processStep` — replaced

Supersedes the version in `SCHEMA-CORE.md`, per `_shared/00-PROCESS.md`.

```ts
processStep {
  number: number,            // 1–6
  title: string,             // MUST be one of the canonical six
  description: text,         // canonical description
  divisionDetail: text,      // per-division
  duration: string,          // per-service, optional
  clientTime: string         // per-service, optional
}
```

```ts
// Sanity validator — keeps three divisions aligned as content is edited over time
const CANONICAL = ['Consultation','Planning & Scope','Approval & Start',
                   'Design, Development & Updates','Delivery','Support'];
validation: r => r.custom(step =>
  CANONICAL.includes(step.title) ||
  `Process stage must be one of the canonical six (see _shared/00-PROCESS.md)`)
```

### `project` — additions for the master layer

| Field | Type | Purpose |
|---|---|---|
| `isCrossDivision` | boolean, computed | `divisions.length > 1`. Drives default sort on `/work` and the badge display |
| `masterFeatured` | boolean | Eligible for the homepage selected-work block |
| `continuityStory` | text | For a client served across divisions or over time — the evidence behind `/approach` |

`isCrossDivision` is derived, not hand-set. A GROQ projection computes it; the CMS does not expose it as an editable field.

## 2. Master-specific document types

### `groupPage` — singleton-per-slug for `/approach` and `/about`

```ts
{
  name: 'groupPage', type: 'document',
  fields: [
    { name: 'slug',      type: 'slug' },          // 'approach' | 'about'
    { name: 'title',     type: 'string' },
    { name: 'intro',     type: 'text' },
    { name: 'sections',  type: 'array', of: [{ type: 'groupSection' }] },
    { name: 'seo',       type: 'seoBlock' }
  ]
}

groupSection {
  key: string,
  heading: string,
  body: portableText,
  layout: 'prose' | 'two-column' | 'sunken-plain' | 'process' | 'continuity',
  projects: [reference → project]
}
```

`layout: 'sunken-plain'` is the deliberately-undesigned treatment used for the limits block on `/approach`, mirroring Press's expectations statement. It is a layout value rather than a styling decision so it cannot be prettified by a later content edit.

### `continuityExample` — the evidence for `/approach`

```ts
{
  name: 'continuityExample', type: 'document',
  fields: [
    { name: 'clientDisplay',  type: 'string' },      // anonymised is fine
    { name: 'rows', type: 'array', of: [{ type: 'continuityRow' }],
      validation: r => r.min(4) },
    { name: 'relationshipMonths', type: 'number' },
    { name: 'divisionsInvolved', type: 'array', of: [{type:'string'}],
      validation: r => r.min(2) },
    { name: 'verified', type: 'boolean',
      validation: r => r.custom(v => v === true
        || 'Continuity examples must be verified against real project records') }
  ]
}

continuityRow { label: string, monthOne: string, monthLater: string }
```

`divisionsInvolved` requires at least two, and `verified` must be true. The continuity principle is the group's entire commercial argument; illustrating it with an invented example would be the most damaging possible piece of content on the site.

### `legalDocument`

```ts
{
  name: 'legalDocument', type: 'document',
  fields: [
    { name: 'slug',        type: 'slug' },     // terms | privacy | cookies | accessibility
    { name: 'title',       type: 'string' },
    { name: 'version',     type: 'string' },
    { name: 'effectiveFrom', type: 'date', validation: required },
    { name: 'lastReviewed',  type: 'date' },
    { name: 'reviewedBy',    type: 'string' }, // 'Solicitor — [firm]' or 'Internal'
    { name: 'solicitorApproved', type: 'boolean', initialValue: false },
    { name: 'clauses',     type: 'array', of: [{ type: 'legalClause' }] },
    { name: 'previousVersions', type: 'array', of: [{type:'file'}] }
  ]
}

legalClause {
  number: string,        // '4.2'
  heading: string,
  body: portableText,
  anchorId: string       // '#clause-4-2' — contracts reference these
}
```

`solicitorApproved` defaults false and gates publication in production: the build check treats an unapproved legal document the same way it treats seed content. Contracts and the site both cite `anchorId`, so clause numbering must not drift — renumbering requires a version bump and a redirect for the old anchor.

### `companyDetails` — singleton

```ts
{
  name: 'companyDetails', type: 'document', __experimental_singleton: true,
  fields: [
    { name: 'legalName',     type: 'string', initialValue: 'Gridsmith Ltd' },
    { name: 'companyNumber', type: 'string', validation: required },
    { name: 'placeOfRegistration', type: 'string', initialValue: 'England & Wales' },
    { name: 'registeredOffice', type: 'text', validation: required },
    { name: 'vatNumber',     type: 'string' },        // null until registered
    { name: 'tradingNames',  type: 'array', of: [{type:'string'}] },
    { name: 'contactEmail',  type: 'string' },
    { name: 'contactPhone',  type: 'string' },
    { name: 'responseCommitment', type: 'string', validation: required },
    { name: 'businessHours', type: 'string' },
    { name: 'piInsurer',     type: 'string' },
    { name: 'piCoverLimit',  type: 'string' },
    { name: 'icoRegistration', type: 'string' }       // data protection register number
  ]
}
```

Every statutory footer, every legal page header and every form confirmation renders from this singleton. **`responseCommitment` is stored once and rendered everywhere** — this is how the next-business-day promise is prevented from drifting into a faster claim on some template nobody re-reads.

Current value: *"We'll reply as soon as we can, and always by the end of the next business day."*

### `teamMember` — extended from core

Adds: `isPublic` (boolean), `divisions[]`, `order`. Only `isPublic: true` members render on `/about`.

## 3. Supabase — master tables

```sql
-- Consent audit. UK GDPR requires being able to demonstrate consent was obtained.
create table consent_events (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  consent_id  text not null,          -- random id in the gs_consent cookie, not a person
  choice      text not null check (choice in ('accept','reject','custom')),
  categories  jsonb not null,
  policy_version text not null,
  user_agent_hash text                -- hashed, not stored raw
);
create index consent_events_id_idx on consent_events (consent_id, created_at desc);

-- Division routing effectiveness (objective M1)
create table division_routing (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  session_id  text not null,
  entry_page  text,
  division_clicked text,              -- null if they took the "not sure" path
  clicks_to_division integer,
  took_not_sure_path boolean not null default false
);
```

`consent_events` deliberately stores no personal data — a random consent id, the choice, the categories and the policy version. That is sufficient to demonstrate compliance and creates no new personal data to protect.

## 4. Reporting views

```sql
-- Is the master brand doing commercial work, or just routing traffic?
create view v_master_value as
select date_trunc('month', created_at) as month,
       count(*) filter (where division = 'unsure')                    as multi_or_unsure_leads,
       count(*)                                                        as all_leads,
       round(100.0 * count(*) filter (where division = 'unsure')
             / nullif(count(*),0), 1)                                  as pct_generalist
from leads where status <> 'spam' group by 1 order by 1 desc;

-- Routing effectiveness (M1 target ≥70%)
create view v_routing_effectiveness as
select date_trunc('week', created_at) as week,
       count(*)                                                as sessions,
       count(*) filter (where clicks_to_division <= 2)          as routed_fast,
       count(*) filter (where took_not_sure_path)               as chose_generalist,
       round(100.0 * count(*) filter (where clicks_to_division <= 2)
             / nullif(count(*),0), 1)                           as pct_routed_fast
from division_routing group by 1 order by 1 desc;
```

`v_master_value` is the honest test of whether the group structure earns its keep. If generalist and multi-need leads stay near zero over two quarters, the master layer is a routing page with expensive prose attached, and the ecosystem argument needs rethinking rather than redesigning.

## 5. GROQ query contracts

```groq
// Master /work — cross-division first, then featured, then recent
*[_type == "project" && published == true && (isSeed == false || $allowSeed)]
  | order(count(divisions) desc, masterFeatured desc, year desc) {
    title, "slug": slug.current, summary, coverImage, year, industry,
    divisions, "isCrossDivision": count(divisions) > 1,
    "client": select(confidential == true => clientDisplay, clientName),
    metrics[0...2]
  }

// Statutory footer — one source of truth
*[_type == "companyDetails"][0] {
  legalName, companyNumber, placeOfRegistration, registeredOffice,
  vatNumber, contactEmail, contactPhone, responseCommitment, businessHours
}

// Legal page — production requires solicitor approval
*[_type == "legalDocument" && slug.current == $slug
  && (solicitorApproved == true || $allowUnapproved)][0] {
  title, version, effectiveFrom, lastReviewed,
  clauses[]{number, heading, body, anchorId}
}
```
