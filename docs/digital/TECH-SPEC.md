# Tech Spec — Gridsmith Digital

Inherits `_shared/00-FOUNDATION.md` §2. Digital-specific detail only.

---

## 1. Route map

| Route | Render | Revalidate | Notes |
|---|---|---|---|
| `/digital` | SSG + ISR | 3600s | Hub |
| `/digital/websites` `/software` `/products` `/ai-integration` | SSG + ISR | 3600s | 4 group landings |
| `/digital/services/[slug]` | SSG | 3600s | ~10 pages |
| `/digital/stack` | SSG | 86400s | Rarely changes |
| `/digital/diagnostic` | SSG | 3600s | Entry offer |
| `/digital/care` | SSG | 3600s | Retainer |
| `/digital/estimate` | Client island on SSG shell | 3600s | Estimator |
| `/digital/estimate/[id]` | SSR, `no-store` | — | Shareable result |
| `/digital/work` + `/work/[slug]` | SSG + client filter | 1800s | |
| `/digital/contact` | Server Component + Server Action | — | |

## 2. Estimator architecture

The estimator is the one place Digital spends its JS budget. Everything else is server-rendered.

```
/digital/estimate
  ├─ SSR shell: static pricing bands table (crawlable, works without JS)
  └─ Client island: <Estimator />  ~28KB gz
       ├─ config loaded from Sanity `estimatorConfig` at build time (no runtime fetch)
       ├─ pure calculation in lib/estimate/calculate.ts — no network round-trip
       ├─ result written to Supabase `digital_estimates` on completion (fire-and-forget)
       └─ returns a short id → /digital/estimate/[id]
```

**Calculation is a pure function, unit tested.** It runs client-side for instant feedback, then is re-run server-side on persistence so a tampered client cannot manufacture a price.

```ts
// lib/estimate/calculate.ts
export interface EstimateInput {
  projectType: 'marketing-site' | 'web-app' | 'internal-tool' | 'mvp' | 'ai-integration';
  scale: 'small' | 'medium' | 'large' | 'enterprise';
  designNeed: 'existing-brand' | 'refresh' | 'new-brand';
  contentStatus: 'ready' | 'partial' | 'none';
  integrations: string[];
  userRoles: number;
  urgency: 'standard' | 'compressed';
  support: 'none' | 'care-basic' | 'care-plus' | 'product-partner';
}

export interface EstimateResult {
  low: number; high: number; currency: 'GBP';
  breakdown: { label: string; low: number; high: number; note: string }[];
  confidence: 'high' | 'medium' | 'low';   // drives how wide the range is presented
  monthlyLow?: number; monthlyHigh?: number;
  assumptions: string[];
  excludes: string[];
}
```

`confidence` is surfaced to the user. When it is `low`, the UI says so plainly and widens the range. **Honest uncertainty is the trust mechanism** (R6-Digital: buyers screen for overpromising).

Result persistence: `/digital/estimate/[id]` renders from `digital_estimates`, expires from public view after 90 days, and is never indexed (`noindex`).

## 3. Live performance badge (FR-DG19)

```
Vercel Cron (daily) → CrUX API for gridsmith.co.uk
  → write to Supabase `site_vitals`
  → /digital/stack and the /digital hub render latest values, SSG-revalidated
```
Falls back to hiding the badge if data is stale >7 days. **Never display a stale or fabricated score** — for persona P4 this would be a fatal credibility failure.

## 4. Content model

Sanity types consumed: `service`, `project`, `faq`, `post`, `testimonial`, plus Digital-specific `estimatorConfig`, `techStackItem`, `carePlanTier`, `exclusion`. Definitions in `SCHEMA.md`.

## 5. Performance budget — raised

| Metric | Budget | Note |
|---|---|---|
| Lighthouse | **100 / 100 / 100** all templates | Launch gate (PRD §7) |
| LCP | ≤1.6s | Stricter than the shared 2.0s |
| INP | ≤150ms | |
| CLS | ≤0.02 | |
| Framework floor (reported, not budgeted) | 100.2KB gz | Next 15 + React 19 |
| **JS delta, marketing routes** | **≤15KB gz** (~115KB total) | Tightest delta in the programme |
| **JS delta, `/digital/estimate`** | **≤40KB gz** (~140KB total) | Estimator island included |

Light canvas helps here — no large dark hero imagery. Digital should lead with type and structure, not photography.

## 6. SEO & machine readability

| Template | Schema |
|---|---|
| Hub | `Organization` + `ProfessionalService` |
| Group landing | `Service` + `FAQPage` + `BreadcrumbList` |
| Service page | `Service` + `Offer` with `priceSpecification` |
| Stack page | `TechArticle` |
| Case study | `CreativeWork` + `SoftwareApplication` where applicable |
| Estimator | `WebApplication`; result pages `noindex` |

The static pricing table on `/digital/estimate` exists partly for crawlers — pricing must be machine-readable without executing JS (R5 MX).

## 7. Analytics

Shared taxonomy plus Digital-specific:

`estimator_start` · `estimator_step` `{step, input}` · `estimator_complete` `{low, high, projectType, confidence}` · `estimator_abandon` `{last_step}` · `estimator_share` · `estimate_to_lead` · `stack_view` · `diagnostic_view` · `care_tier_view` `{tier}` · `exclusions_view`

Funnels at launch:
1. Any → estimator start → complete → lead
2. Service page → Diagnostic → lead
3. Case study → Care Plan → lead

`estimator_abandon` by step is the most actionable diagnostic on the site. Review weekly for the first quarter.

## 8. Integrations

As per Design, plus:

| Service | Purpose | Failure mode |
|---|---|---|
| CrUX API | Live vitals badge | Hide badge; never show stale data |
| Cal.com | Booking link on confirmation only | Link, not embed — embeds cost 200KB+ |

## 9. Security

Shared baseline, plus:
- Estimator input validated server-side on persistence; client-computed price never trusted for any commercial purpose
- `digital_estimates` rows contain no PII until a lead is attached
- Estimate result pages are unguessable (nanoid 12) and `noindex`
- Stack page must not disclose client-specific infrastructure details

## 10. Accessibility

WCAG 2.2 AA. Digital-specific risks:
- **The estimator is the main risk.** Every step must be a real fieldset with a legend; progress announced via `aria-live`; the result announced on completion; full keyboard operation; no drag-only inputs (sliders must accept arrow keys and have a paired number input).
- Electric blue `#1B5FFF` on `#FAFAF9` = 6.8:1 — passes AA for text. On `--canvas-raised` re-verify.
- Code samples on the stack page need `aria-label` and must not be the only means of conveying information.
