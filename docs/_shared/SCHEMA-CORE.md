# Core Schema — shared across all three divisions

Authoritative definition of types used by every division. Each division's `SCHEMA.md` defines its own document types and the extensions it adds to these. Nothing here is duplicated per division — one CMS, one database.

---

## 1. Sanity — core document types

### `service`
```ts
{
  name: 'service', type: 'document',
  fields: [
    { name: 'title',        type: 'string', validation: required },
    { name: 'slug',         type: 'slug', options: { source: 'title' } },
    { name: 'division',     type: 'string', options: { list: ['design','digital','press'] } },
    { name: 'track',        type: 'string' },        // division-specific taxonomy
    { name: 'searchIntent', type: 'string' },        // the exact query this page targets
    { name: 'problem',      type: 'text', rows: 4 }, // the buyer's situation
    { name: 'deliverables', type: 'array', of: [{ type: 'deliverable' }] },
    { name: 'process',      type: 'array', of: [{ type: 'processStep' }] },
    { name: 'pricingModel', type: 'pricingBlock', validation: required },  // SC-6: never optional
    { name: 'faqs',         type: 'array', of: [{ type: 'reference', to: 'faq' }] },
    { name: 'relatedProjects', type: 'array', of: [{ type: 'reference', to: 'project' }] },
    { name: 'ctaPrimary',   type: 'ctaBlock' },
    { name: 'ctaSecondary', type: 'ctaBlock' },
    { name: 'seo',          type: 'seoBlock' },
    { name: 'order',        type: 'number' },
    { name: 'published',    type: 'boolean', initialValue: false }
  ]
}
```
`pricingModel` is `validation: required` at the schema level. This is how SC-6 is enforced structurally rather than by discipline — a service page physically cannot be published without pricing.

### `project` (portfolio / case study)
```ts
{
  name: 'project', type: 'document',
  fields: [
    { name: 'title',         type: 'string' },
    { name: 'slug',          type: 'slug' },
    { name: 'divisions',     type: 'array', of: [{type:'string'}] },  // multi — cross-division work is the best proof
    { name: 'track',         type: 'string' },
    { name: 'services',      type: 'array', of: [{ type:'reference', to:'service' }] },
    { name: 'clientName',    type: 'string' },       // nullable
    { name: 'clientDisplay', type: 'string' },       // "A UK M&E contractor" when NDA
    { name: 'confidential',  type: 'boolean' },
    { name: 'industry',      type: 'string' },
    { name: 'year',          type: 'number' },
    { name: 'summary',       type: 'text', rows: 2 },// card copy
    { name: 'challenge',     type: 'array', of: [{type:'block'}] },
    { name: 'approach',      type: 'array', of: [{type:'block'}] },
    { name: 'outcome',       type: 'array', of: [{type:'block'}] },
    { name: 'metrics',       type: 'array', of: [{ type:'metric' }],
      validation: r => r.min(1) },                   // ≥1 quantified metric enforced
    { name: 'media',         type: 'array', of: [{ type:'protectedImage' }, { type:'protectedVideo' }] },
    { name: 'coverImage',    type: 'protectedImage' },
    { name: 'testimonial',   type: 'reference', to: 'testimonial' },
    { name: 'featured',      type: 'boolean' },
    { name: 'seo',           type: 'seoBlock' }
  ]
}
```
When `confidential` is true, `clientName` is never returned by any public GROQ query. Enforced in the query layer, not the component layer.

### `faq`
`question` · `answer` (portable text) · `division` · `track` · `category` · `order`

### `testimonial`
`quote` · `authorName` · `authorRole` · `authorCompany` · `authorPhoto` · `project` (ref) · `division` · `verified` (bool)

### `post` (insights)
`title` · `slug` · `division` · `excerpt` · `body` · `author` · `publishedAt` · `updatedAt` · `readingTime` · `relatedServices[]` · `seo`

### `teamMember`
`name` · `role` · `division` · `bio` · `photo` · `credentials[]` · `linkedin`

## 2. Sanity — core object types

```ts
deliverable   { label: string, detail: text, included: boolean }
processStep   { number: number, title: string, description: text, duration: string }
metric        { label: string, value: string, context: string }
ctaBlock      { label: string, href: string, style: 'primary'|'secondary', prefill: object }
seoBlock      { metaTitle, metaDescription, ogImage, canonical, noIndex: boolean }

pricingBlock {
  model:      'fixed' | 'from' | 'range' | 'retainer' | 'per-unit' | 'day-rate',
  currency:   'GBP',
  fromAmount: number,
  toAmount:   number,
  unit:       string,          // 'project' | 'drawing' | 'sheet' | 'day' | 'month' | 'title'
  includes:   string[],
  variables:  string[],        // "what moves this number" — required, min 2
  note:       string
}

protectedImage {
  asset: image,
  alt: string (required),
  caption: string,
  watermarked: boolean (default true),
  displayMaxWidth: number (default 1600)
}
```

## 3. Supabase — core tables

```sql
create type division_t   as enum ('design','digital','press','unsure');
create type lead_type_t  as enum ('enquiry','sample_request','estimate','assessment','newsletter');
create type lead_status_t as enum ('new','contacted','qualified','proposal','won','lost','spam');

create table leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  division        division_t not null,
  track           text,
  lead_type       lead_type_t not null default 'enquiry',
  service_slug    text,
  full_name       text not null,
  email           text not null,
  company         text,
  role            text,
  phone           text,
  message         text,
  budget_band     text,
  timeline        text,
  payload         jsonb not null default '{}'::jsonb,  -- division-specific answers
  source          text,
  medium          text,
  campaign        text,
  referrer        text,
  landing_page    text,
  is_ai_referral  boolean not null default false,      -- R1: 22% conversion premium, must be measured
  status          lead_status_t not null default 'new',
  notified_at     timestamptz,                          -- R2: speed-to-lead measurement
  crm_synced_at   timestamptz,
  notes           text
);

create index leads_division_created_idx on leads (division, created_at desc);
create index leads_status_idx           on leads (status) where status = 'new';
create index leads_ai_referral_idx      on leads (is_ai_referral, created_at desc);
create index leads_payload_gin          on leads using gin (payload);

alter table leads enable row level security;
create policy "anon insert only" on leads for insert to anon with check (true);
-- No select policy for anon. Reads are service-role only.

create table sample_grants (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references leads(id) on delete cascade,
  asset_key   text not null,
  token       text not null unique,
  expires_at  timestamptz not null,
  used_at     timestamptz,
  created_at  timestamptz not null default now()
);

create table events (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  session_id  text not null,
  event       text not null,
  division    division_t,
  props       jsonb not null default '{}'::jsonb
);
create index events_event_created_idx on events (event, created_at desc);
```

`notified_at - created_at` is the speed-to-lead metric (R2). Alert if p95 exceeds 60 seconds.

## 4. Reporting views

```sql
create view v_lead_funnel as
select division, date_trunc('week', created_at) as week,
       count(*) as leads,
       count(*) filter (where status in ('qualified','proposal','won')) as qualified,
       count(*) filter (where status = 'won') as won,
       count(*) filter (where is_ai_referral) as ai_referral_leads,
       avg(extract(epoch from (notified_at - created_at))) as avg_notify_seconds
from leads where status <> 'spam'
group by 1,2;
```
