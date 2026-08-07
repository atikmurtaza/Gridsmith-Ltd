# Schema — Gridsmith Digital

Core types in `_shared/SCHEMA-CORE.md`. This file defines Digital-specific types, extensions, and the estimator data contract.

---

## 1. `estimatorConfig` — singleton

The estimator's entire pricing logic lives in the CMS, not in code. This means pricing can be re-tuned without a deploy — essential, because the estimator will need calibrating monthly for its first year.

```ts
{
  name: 'estimatorConfig', type: 'document', __experimental_singleton: true,
  fields: [
    { name: 'version',     type: 'number' },          // increment on any change
    { name: 'effectiveFrom', type: 'datetime' },
    { name: 'currency',    type: 'string', initialValue: 'GBP' },

    { name: 'projectTypes', type: 'array', of: [{ type: 'estimatorProjectType' }] },
    { name: 'scaleMultipliers', type: 'array', of: [{ type: 'estimatorMultiplier' }] },
    { name: 'designModifiers',  type: 'array', of: [{ type: 'estimatorModifier' }] },
    { name: 'contentModifiers', type: 'array', of: [{ type: 'estimatorModifier' }] },
    { name: 'integrationCosts', type: 'array', of: [{ type: 'estimatorLineItem' }] },
    { name: 'urgencyMultiplier', type: 'number', initialValue: 1.25 },
    { name: 'supportTiers',  type: 'array', of: [{ type: 'reference', to: 'carePlanTier' }] },

    { name: 'globalAssumptions', type: 'array', of: [{type:'string'}],
      validation: r => r.min(3) },
    { name: 'globalExclusions',  type: 'array', of: [{type:'string'}],
      validation: r => r.min(5) },   // R6-Digital: exclusions are a trust requirement
    { name: 'confidenceRules', type: 'array', of: [{ type: 'confidenceRule' }] }
  ]
}
```

### Supporting objects
```ts
estimatorProjectType {
  key: string,                    // 'marketing-site' | 'web-app' | ...
  label: string,
  baseLow: number, baseHigh: number,
  phases: [{ label, lowPct, highPct, note }],   // must sum to 100
  scaleQuestion: string,          // the contextual step-2 question
  scaleOptions: [{ key, label, multiplier }]
}

estimatorModifier  { key, label, lowDelta, highDelta, isPercent: boolean, note }
estimatorLineItem  { key, label, low, high, note, addsConfidenceRisk: boolean }
estimatorMultiplier{ key, label, factor }

confidenceRule {
  condition: string,   // 'unsure-count >= 2' | 'integrations includes custom-api'
  confidence: 'high' | 'medium' | 'low',
  rangeWidening: number   // e.g. 0.15 = widen the range by 15% each side
}
```

**Validation rule:** `phases` percentages must sum to 100 per project type. Enforced by a Sanity custom validator. A silently mis-summed config produces a wrong price, which is the failure mode PRD §9 says must not ship.

## 2. `techStackItem`

Powers `/digital/stack` (FR-DG07) — persona P2 and P4's decisive page.

```ts
{
  name: 'techStackItem', type: 'document',
  fields: [
    { name: 'name',      type: 'string' },        // "PostgreSQL"
    { name: 'category',  type: 'string', options: { list: [
        'Framework','Language','Database','Hosting','CMS','Auth',
        'Payments','Email','Analytics','AI/ML','Testing','CI/CD','Monitoring'
    ]}},
    { name: 'whyWeUseIt', type: 'text', validation: required },
    { name: 'whatItMeansForYou', type: 'text', validation: required },
      // client-facing consequence, e.g. "Your data is in standard Postgres.
      // Any developer can take it over. No proprietary format."
    { name: 'alternativesConsidered', type: 'array', of: [{type:'string'}] },
    { name: 'lockInRisk', type: 'string', options: {
        list: ['none','low','medium','high'] }, validation: required },
    { name: 'lockInExplanation', type: 'text' },   // required when risk != 'none'
    { name: 'url',       type: 'url' },
    { name: 'order',     type: 'number' },
    { name: 'active',    type: 'boolean' }
  ]
}
```

`lockInRisk` is the most important field on the site for persona P2. **Publishing an honest `medium` or `high` where it exists is the entire credibility of the ownership positioning.** A stack page where everything is `none` reads as marketing and will be disbelieved.

## 3. `carePlanTier`

```ts
{
  name: 'carePlanTier', type: 'document',
  fields: [
    { name: 'title',           type: 'string' },   // "Care", "Care+", "Product Partner"
    { name: 'monthlyPrice',    type: 'number' },
    { name: 'annualDiscount',  type: 'number' },
    { name: 'responseSla',     type: 'string' },   // "4 business hours, critical"
    { name: 'resolutionSla',   type: 'string' },
    { name: 'hoursIncluded',   type: 'number' },
    { name: 'rolloverPolicy',  type: 'string' },
    { name: 'includes',        type: 'array', of: [{type:'string'}], validation: r => r.min(4) },
    { name: 'excludes',        type: 'array', of: [{type:'string'}], validation: r => r.min(3) },
    { name: 'bestFor',         type: 'string' },
    { name: 'minimumTerm',     type: 'string' },
    { name: 'noticePeriod',    type: 'string' },
    { name: 'recommended',     type: 'boolean' },
    { name: 'order',           type: 'number' }
  ]
}
```
`excludes` has `min(3)` validation for the same reason as `globalExclusions`. A tier that excludes nothing is not a real tier.

## 4. `exclusion` — "What we don't do"

```ts
{
  name: 'exclusion', type: 'document',
  fields: [
    { name: 'statement',  type: 'string' },   // "We don't do SEO retainers."
    { name: 'reason',     type: 'text' },     // honest rationale
    { name: 'alternative',type: 'string' },   // who to go to instead
    { name: 'division',   type: 'string' },
    { name: 'order',      type: 'number' }
  ]
}
```
`alternative` is what turns this section from defensive into trust-building. Referring buyers elsewhere for work you don't do is the single strongest credibility signal available on a services site.

## 5. Extensions to core types

### `service` — Digital additions
| Field | Type | Purpose |
|---|---|---|
| `serviceGroup` | `'websites' \| 'software' \| 'products' \| 'ai-integration'` | Group landing routing |
| `estimatorProjectType` | string | Links the service page to the right estimator preset |
| `typicalStack[]` | ref → `techStackItem` | Shown on the service page |
| `typicalDuration` | string | Including ramp (FR-DG12) |
| `clientTimeCommitment` | string | Hours per week the client must give — an honesty signal |

### `project` — Digital additions
| Field | Type | Purpose |
|---|---|---|
| `stack[]` | ref → `techStackItem` | Portfolio filtering by stack (P4) |
| `beforeState` | portable text | The "before/after" case study format |
| `afterState` | portable text | |
| `buildDuration` | string | |
| `ongoingRelationship` | boolean | Evidence for Care Plan attach |
| `liveUrl` | url | Nullable |

## 6. Digital lead payload contract

```ts
export const digitalLeadPayload = z.object({
  serviceGroup: z.enum(['websites','software','products','ai-integration','unsure']),
  stage: z.enum(['exploring','defined-need','have-spec','need-to-start']),
  projectType: z.string().optional(),
  existingSystems: z.array(z.string()).optional(),
  teamSize: z.enum(['1-10','11-50','51-200','200+']).optional(),
  integrations: z.array(z.string()).optional(),
  supportInterest: z.enum(['none','care','care-plus','partner','unsure']),
  estimateId: z.string().length(12).optional(),      // links back to digital_estimates
  estimateLow: z.number().optional(),
  estimateHigh: z.number().optional(),
  wantsDiagnostic: z.boolean(),
  briefRefs: z.array(z.string().url()).max(5).optional()
});
```

Budget bands (`leads.budget_band`):
`under-5k` · `5k-15k` · `15k-40k` · `40k-100k` · `100k-plus` · `retainer-only` · `not-sure`

## 7. Supabase — Digital tables

```sql
create table digital_estimates (
  id            text primary key,               -- nanoid(12), unguessable
  created_at    timestamptz not null default now(),
  session_id    text,
  config_version int not null,                  -- which pricing config produced this
  input         jsonb not null,
  result_low    integer not null,
  result_high   integer not null,
  monthly_low   integer,
  monthly_high  integer,
  confidence    text not null check (confidence in ('high','medium','low')),
  completed     boolean not null default false, -- false = abandoned mid-flow
  last_step     integer,
  shared_count  integer not null default 0,
  lead_id       uuid references leads(id),
  expires_at    timestamptz not null default (now() + interval '90 days')
);

create index digital_est_created_idx   on digital_estimates (created_at desc);
create index digital_est_completed_idx on digital_estimates (completed, created_at desc);
create index digital_est_input_gin     on digital_estimates using gin (input);

alter table digital_estimates enable row level security;
create policy "anon insert" on digital_estimates for insert to anon with check (true);
create policy "anon read own by id" on digital_estimates for select to anon
  using (expires_at > now());   -- readable only by exact unguessable id

create table site_vitals (
  id          bigserial primary key,
  captured_at timestamptz not null default now(),
  origin      text not null,
  lcp_p75     numeric,
  inp_p75     numeric,
  cls_p75     numeric,
  source      text not null default 'crux'
);
```

`config_version` on every estimate is essential: when you retune pricing, you need to know which estimates were produced under which rules to interpret conversion data honestly.

## 8. Reporting views

```sql
-- Which project types the market is actually asking for, and at what scale.
create view v_estimate_demand as
select input->>'projectType' as project_type,
       input->>'scale'       as scale,
       count(*)                        as estimates,
       count(*) filter (where completed) as completed,
       count(lead_id)                  as converted,
       round(avg(result_low))          as avg_low,
       round(avg(result_high))         as avg_high,
       round(100.0 * count(lead_id) / nullif(count(*) filter (where completed),0), 1)
         as conversion_pct
from digital_estimates
group by 1,2 order by estimates desc;

-- Where the estimator loses people. Review weekly for the first quarter.
create view v_estimator_dropoff as
select last_step, count(*) as abandons
from digital_estimates where completed = false
group by 1 order by 1;
```

`v_estimate_demand` is a genuine strategic asset — it is continuously refreshed market research on what buyers want and what they expect to pay, gathered at zero marginal cost.

## 9. GROQ query contracts

```groq
// Stack page — grouped, honest lock-in disclosure included
*[_type == "techStackItem" && active == true] | order(category asc, order asc) {
  name, category, whyWeUseIt, whatItMeansForYou,
  alternativesConsidered, lockInRisk, lockInExplanation, url
}

// Estimator config — build-time only, never runtime
*[_type == "estimatorConfig"][0] {
  version, currency, projectTypes[]{...}, scaleMultipliers,
  designModifiers, contentModifiers, integrationCosts,
  urgencyMultiplier, globalAssumptions, globalExclusions, confidenceRules,
  "supportTiers": supportTiers[]->{title, monthlyPrice, hoursIncluded, responseSla}
}
```
