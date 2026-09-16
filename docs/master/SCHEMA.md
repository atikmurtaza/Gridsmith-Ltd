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

**Deviation, recorded at `L-01` and widened on 26 August 2026: the slug set is seven, not four.** The spec listed `terms |
privacy | cookies | accessibility`, and none of those is the contract a client signs. A fifth
slug `client-terms` carries the engagement terms. They are separated rather than folded into
`terms` because `anchorId` is contract-facing — the paragraph below requires a version bump and
a redirect to renumber one — and a consumer-facing website notice sharing an anchor space with a
B2B contract guarantees a collision. `check:schemas` holds them as a closed list, proven in
all four directions (widened, narrowed, permissive rule, absent rule).

**`client-terms` then became three slugs — owner's decision, 26 August 2026.** It served two
instruments, `_legal/MSA-BUSINESS.md` and `_legal/CONSUMER-TERMS.md`, and a liability cap drafted
for a business client is not binding on a consumer to the extent of **CRA 2015 s. 57** — so a Press
author read a cap that did not apply to them and had no way to tell. `business-client-terms` and
`consumer-client-terms` now carry the two instruments, and `client-terms` survives as a
disambiguation page: no operative clause, and no redirect, because a redirect has to pick a target
and either choice lands one audience silently on the other's terms. The routing is asserted against
the **served** pages by `scripts/check-consumer-terms.mjs`. See `lib/legal/slugs.ts` for the
decision and the reasoning.

`legalClause` also gains a `basis` string: the instrument the clause implements. `CLAUDE.md` #2
forbids invented clause references, and naming the instrument per clause makes it visible which
clauses are required by law and which are there because someone liked them.

`solicitorApproved` defaults false and gates publication in production: the build check treats an unapproved legal document the same way it treats seed content. Contracts and the site both cite `anchorId`, so clause numbering must not drift — renumbering requires a version bump and a redirect for the old anchor.

### `companyDetails` — singleton

```ts
{
  name: 'companyDetails', type: 'document', __experimental_singleton: true,
  fields: [
    { name: 'legalName',     type: 'string', initialValue: 'Gridsmith Ltd' },
    { name: 'companyNumber', type: 'string', validation: required },
    { name: 'placeOfRegistration', type: 'string', initialValue: 'England' },
    { name: 'registeredOffice', type: 'text', validation: required },
    // ~~{ name: 'vatNumber', type: 'string' }~~ **STRUCK 2 September 2026** — Gridsmith is
    // not VAT registered, so the field was removed from the schema, the projection, the
    // footer, `/about`, the seed and `check:launch`. Its absence is the decision, not an
    // omission: `sanity/schemas/companyDetails.ts` records it. `check:struck` holds the rule.
    { name: 'tradingNames',  type: 'array', of: [{type:'string'}] },
    { name: 'contactEmail',  type: 'string' },
    { name: 'contactPhone',  type: 'string' },
    { name: 'responseCommitment', type: 'string', validation: required },
    // ~~{ name: 'businessHours', type: 'string' }~~ **STRUCK 16 September 2026 (`GS-O004`)** —
    // the owner does not authorise published opening hours. The field was never populated and
    // every render site guarded it with `? :`, which is a surface waiting for a value rather
    // than a decision. Removed from the schema, the type, the projection and `/contact`, on the
    // `vatNumber` precedent directly above: a field that does not exist cannot be filled in the
    // Studio by someone who did not know. `check:company` question 5 asserts the absence on the
    // served pages. `check:struck` holds the rule.
    { name: 'piInsurer',     type: 'string' },
    { name: 'piCoverLimit',  type: 'string' },
    { name: 'icoRegistration', type: 'string' }       // data protection register number
  ]
}
```

Every statutory footer, every legal page header and every form confirmation renders from this singleton. **`responseCommitment` is stored once and rendered everywhere** — this is how a claim about response time is prevented from drifting into a faster one on some template nobody re-reads. It earned that design at `GS-O004`: the sentence changed in one place and six surfaces moved with it.

Current value: *"We typically respond within 48 hours."*

**It is a statement of typical behaviour, not a commitment.** `GS-O004` withdrew the previous
value — ~~*"We'll reply as soon as we can, and always by the end of the next business day"*~~,
**STRUCK 16 September 2026** — because the owner authorises no guaranteed response time and no
SLA, and *"always"* is an unqualified undertaking. Non-negotiable #5 forbids promising faster than the end of the next
business day; this is slower than that ceiling **and** is not a promise, so it satisfies the rule
twice over. `check:company` question 5 refuses guarantee wording, SLA wording, "ASAP" and
published opening hours on the served pages, each rule proven separately.

### `teamMember` — extended from core

Fields: `isPublic` (boolean, defaults false), `divisions[]`, `order`.

> **DORMANT. No team member is published — `GS-O004`, 16 September 2026.** The owner publishes
> no founder profile, no employee profiles and no placeholder staff; the company is represented
> institutionally. The row here used to read ~~*"Only `isPublic: true` members render on
> `/about`"*~~ — **STRUCK 16 September 2026** — and that was the whole control: a boolean,
> defaulting false, which the seed then set to `true` on four `[SEED] Placeholder Name` records. The served `/about` published four placeholder
> people under the heading "Who you will work with" and nothing in the source was wrong.
>
> `listPublicTeam`, the `TeamMember` type, the `/about` roster and its CSS are **deleted**;
> `scripts/seed-content.mjs` now writes `isPublic: false`. The type stays defined and dormant,
> like `project` and `book`. Restoring publication means writing a query, which is visible in a
> diff, rather than flipping a field, which is not. `check:company` question 6 asserts the
> absence on the served page.

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
  // ~~vatNumber~~ removed 2 September 2026 — see above; not VAT registered
  // ~~businessHours~~ removed 16 September 2026 (GS-O004) — see above; no published hours
  contactEmail, contactPhone, responseCommitment
}

// Legal page — production requires solicitor approval
*[_type == "legalDocument" && slug.current == $slug
  && (solicitorApproved == true || $allowUnapproved)][0] {
  title, version, effectiveFrom, lastReviewed,
  clauses[]{number, heading, body, anchorId}
}
```
