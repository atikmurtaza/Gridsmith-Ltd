# Schema — Gridsmith Design

Core types in `_shared/SCHEMA-CORE.md`. This file defines Design-specific document types, the extensions Design adds to core types, and the Design lead payload contract.

---

## 1. Design-specific document type: `drawingType`

Powers the drawing-type matrix (FR-D07) — the single highest-value component on the Track B landing page, because it is how the buyer performs their capability check (R6-Design).

```ts
{
  name: 'drawingType', type: 'document',
  fields: [
    { name: 'title',       type: 'string' },   // "P&ID Diagram"
    { name: 'slug',        type: 'slug' },
    { name: 'discipline',  type: 'string', options: { list: [
        'Mechanical','Electrical','Structural','Architectural',
        'MEP','Process / Piping','Civil','Telecoms','Manufacturing'
    ]}},
    { name: 'category',    type: 'string', options: { list: [
        '2D Drafting','3D Modelling','Conversion','Documentation','Detailing','Visualisation'
    ]}},
    { name: 'software',    type: 'array', of: [{type:'string'}] },
      // AutoCAD, Revit, SolidWorks, Inventor, MicroStation, Civil 3D, Fusion 360
    { name: 'standards',   type: 'array', of: [{type:'string'}] },
      // BS 8888, BS EN ISO 128, Eurocodes, RIBA Plan of Work, ISO 19650, ASME Y14.5
    { name: 'typicalTurnaround', type: 'string' },   // "2–4 working days per sheet"
    { name: 'pricingUnit', type: 'string', options: { list: ['per drawing','per sheet','day rate'] } },
    { name: 'fromPrice',   type: 'number' },
    { name: 'inputsRequired', type: 'array', of: [{type:'string'}] },
      // "Marked-up PDF", "Site survey data", "Existing DWG", "Hand sketch"
    { name: 'notes',       type: 'text' },
    { name: 'sampleAsset', type: 'reference', to: 'sampleAsset' },
    { name: 'order',       type: 'number' },
    { name: 'published',   type: 'boolean' }
  ],
  preview: { select: { title: 'title', subtitle: 'discipline' } }
}
```

**Data integrity rule:** `standards` values must come from a controlled list maintained in `lib/cms/standards.ts`. Free-text standards references are prohibited — a wrong or invented standard code is the fastest way to lose a technical buyer permanently (PRD launch criteria).

## 2. Design-specific document type: `sampleAsset`

```ts
{
  name: 'sampleAsset', type: 'document',
  fields: [
    { name: 'title',        type: 'string' },
    { name: 'storageKey',   type: 'string' },   // Supabase Storage path, private bucket
    { name: 'discipline',   type: 'string' },
    { name: 'drawingTypes', type: 'array', of: [{type:'reference', to:'drawingType'}] },
    { name: 'standards',    type: 'array', of: [{type:'string'}] },
    { name: 'redacted',     type: 'boolean', validation: r => r.custom(v => v === true
        || 'Sample assets must be redacted before publication') },
    { name: 'watermarked',  type: 'boolean', validation: r => r.custom(v => v === true
        || 'Sample assets must be watermarked') },
    { name: 'whatToLookFor', type: 'text' },   // included in the delivery email
    { name: 'active',       type: 'boolean' }
  ]
}
```
Both `redacted` and `watermarked` are validated as hard-true. A sample asset cannot exist in a publishable state otherwise.

## 3. Design-specific document type: `retainerTier`

Powers the Design Desk page (FR-D15, objective O4).

```ts
{
  name: 'retainerTier', type: 'document',
  fields: [
    { name: 'title',          type: 'string' },   // "Desk 20"
    { name: 'division',       type: 'string' },
    { name: 'monthlyPrice',   type: 'number' },
    { name: 'hoursIncluded',  type: 'number' },
    { name: 'turnaroundSla',  type: 'string' },   // "2 working days, standard requests"
    { name: 'rolloverPolicy', type: 'string' },   // "Up to 20% rolls to the next month"
    { name: 'includes',       type: 'array', of: [{type:'string'}] },
    { name: 'excludes',       type: 'array', of: [{type:'string'}] },
    { name: 'bestFor',        type: 'string' },
    { name: 'minimumTerm',    type: 'string' },
    { name: 'recommended',    type: 'boolean' },
    { name: 'order',          type: 'number' }
  ]
}
```
`excludes` is deliberately a first-class field. R6-Digital finds that buyers actively screen for vague scope; publishing what is *not* included is a trust move, not a weakness.

## 4. Extensions to core types

### `service` — Design additions
| Field | Type | Purpose |
|---|---|---|
| `track` | `'brand-visual' \| 'technical-engineering'` | Drives fork routing and filtering |
| `drawingTypes[]` | ref → `drawingType` | Technical services only |
| `standardsApplied[]` | string (controlled list) | Renders the standards strip |
| `softwareUsed[]` | string | |
| `sampleAvailable` | boolean | Shows the sample-pack CTA on this page |

### `project` — Design additions
| Field | Type | Purpose |
|---|---|---|
| `track` | same union | Portfolio filtering |
| `disciplines[]` | string | Track B filtering |
| `drawingCount` | number | Scale signal for technical case studies |
| `softwareUsed[]` | string | |
| `sheetSample` | `protectedImage` | Title-block-visible crop for technical proof |

## 5. Design lead payload contract

`leads.payload` is `jsonb`. Design writes one of two shapes, validated by Zod before insert.

```ts
// track = 'technical-engineering'
const technicalPayload = z.object({
  track: z.literal('technical-engineering'),
  discipline: z.enum(['mechanical','electrical','structural','architectural',
                      'mep','process','civil','telecoms','manufacturing','other']),
  drawingTypes: z.array(z.string()).min(1),
  estimatedSheets: z.enum(['1-5','6-20','21-50','50+','ongoing','unsure']),
  software: z.array(z.string()).optional(),
  standards: z.array(z.string()).optional(),
  deadline: z.enum(['within-1-week','2-4-weeks','1-3-months','flexible']),
  inputsAvailable: z.array(z.string()),
  engagementType: z.enum(['trial-package','project','retainer','unsure']),
  fileRefs: z.array(z.string().url()).max(5).optional()
});

// track = 'brand-visual'
const brandPayload = z.object({
  track: z.literal('brand-visual'),
  services: z.array(z.string()).min(1),
  projectType: z.enum(['new-brand','rebrand','campaign','ongoing','single-asset']),
  timeline: z.enum(['asap','1-month','2-3-months','flexible']),
  hasExistingBrand: z.boolean(),
  referenceLinks: z.array(z.string().url()).max(5).optional()
});

export const designLeadPayload = z.discriminatedUnion('track',
  [technicalPayload, brandPayload]);
```

Budget bands (`leads.budget_band`), differing by track:

| Track A (Brand & Visual) | Track B (Technical & Engineering) |
|---|---|
| `under-2k` | `trial-only` |
| `2k-6k` | `under-2k` |
| `6k-15k` | `2k-10k` |
| `15k-40k` | `10k-30k` |
| `40k-plus` | `30k-plus` |
| `retainer` | `retainer-monthly` |
| `not-sure` | `not-sure` |

Banded selection only — never free text (R3, APP-FLOW §6).

## 6. Additional Supabase objects

```sql
-- Track fork analytics: is the fork actually routing correctly? (Objective O2)
create table design_track_selections (
  id           bigserial primary key,
  created_at   timestamptz not null default now(),
  session_id   text not null,
  track        text not null check (track in ('brand-visual','technical-engineering')),
  entry_page   text,
  switched_from text                        -- non-null if the visitor changed track
);
create index design_track_sel_idx on design_track_selections (track, created_at desc);

-- Which drawing types buyers actually filter for. Drives the service-page roadmap.
create table design_matrix_queries (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  session_id  text not null,
  discipline  text,
  software    text,
  result_count int
);
```

`design_matrix_queries` is a deliberate strategic instrument, not vanity analytics: it tells you which disciplines the market is asking for that you do not yet have a service page for. Review monthly.

## 7. GROQ query contracts

```groq
// Drawing matrix — Track B landing
*[_type == "drawingType" && published == true] | order(discipline asc, order asc) {
  title, "slug": slug.current, discipline, category, software, standards,
  typicalTurnaround, pricingUnit, fromPrice, inputsRequired,
  "hasSample": defined(sampleAsset)
}

// Service page — confidential clients never leak
*[_type == "service" && division == "design" && slug.current == $slug][0] {
  ..., pricingModel,
  "projects": relatedProjects[]->{
    title, "slug": slug.current, summary, coverImage, year, metrics,
    "client": select(confidential == true => clientDisplay, clientName)
  },
  "faqs": faqs[]->{question, answer}
}
```

The `select(confidential ...)` guard sits in the query, so no component can accidentally render a protected client name.
