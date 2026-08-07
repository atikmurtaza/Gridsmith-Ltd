# Tech Spec — Gridsmith Design

Inherits `_shared/00-FOUNDATION.md` §2 stack. This document covers only what is specific to the Design route group.

---

## 1. Route map

| Route | Render | Revalidate | Notes |
|---|---|---|---|
| `/design` | SSG + ISR | 3600s | Hub |
| `/design/brand-visual` | SSG + ISR | 3600s | Track A |
| `/design/technical-engineering` | SSG + ISR | 3600s | Track B |
| `/design/services/[slug]` | SSG, `generateStaticParams` | 3600s | ~10 pages |
| `/design/work` | SSG shell + client filter | 1800s | Filters via URL params, not state-only |
| `/design/work/[slug]` | SSG | 3600s | Shared with master `/work` |
| `/design/design-desk` | SSG | 3600s | Retainer offer |
| `/design/estimate` | Client island on SSG shell | 3600s | Drawing estimator (Track B) |
| `/design/estimate/[id]` | SSR, `no-store` | — | Shareable result, `noindex` |
| `/design/samples` | Server Component + Server Action | — | Gated request |
| `/design/contact` | Server Component + Server Action | — | `dynamic = 'force-dynamic'` |

Filter state lives in the URL (`?track=technical&service=cad&industry=mep`) so filtered views are shareable, indexable and back-button-correct.

## 2. Track fork implementation

```ts
// lib/track.ts
export type Track = 'brand-visual' | 'technical-engineering';

// Set on selection; read in root layout via cookie (not localStorage) so the
// server can render the correct ordering — avoids a client-side layout shift.
// Cookie: gs_design_track, 90 days, SameSite=Lax, no PII.
```

Server reads the cookie in `app/(design)/design/layout.tsx` and passes `preferredTrack` down. The hub reorders its content blocks accordingly. **The fork itself is always rendered** — never hidden from returning visitors, since buyers change roles and referrals arrive on old links.

## 3. Content model source

Sanity. Document types consumed by this route group: `service`, `project`, `faq`, `drawingType`, `retainerTier`, `sampleAsset`, `post`. Full field definitions in `SCHEMA.md`.

GROQ queries live in `lib/cms/queries/design.ts`. All queries are typed via `sanity-codegen`; **no untyped `any` from the CMS layer** (enforced in `PROJECT-RULES.md`).

## 4. Sample pack delivery

```
POST /api/samples  (Server Action)
  → Zod validate {name, email, company, role, discipline}
  → Supabase insert into leads (type='sample_request', division='design')
  → Generate 3 signed URLs from Supabase Storage bucket `design-samples`
     · expiry 72h, single-use token recorded in sample_grants
  → Resend email with links
  → Slack #gridsmith-leads
```
Rate limit: 3 requests per email per 30 days, 10 per IP per day (Upstash Redis). Sample PDFs must be redacted and watermarked at upload time, not at request time.

## 5. Media protection (FR-D23)

- All portfolio imagery served through Next `<Image>` from Sanity CDN at max 1600px
- `oncontextmenu` suppressed on `Media` primitive; `user-select: none` on media wrappers
- Watermark baked into the asset at CMS ingest via Sanity asset pipeline — not a CSS overlay, which is trivially removed
- No original filenames in URLs
- `Content-Disposition: inline` enforced; no `download` attributes anywhere

This is deterrence, not DRM. Documented as such so nobody assumes it is stronger than it is.

## 6. Performance budget

| Metric | Budget | Enforcement |
|---|---|---|
| LCP | ≤2.0s (4G, Moto G4) | Lighthouse CI, blocks merge |
| INP | ≤200ms | Lighthouse CI |
| CLS | ≤0.05 | Lighthouse CI |
| JS (marketing routes) | ≤120KB gz | `@next/bundle-analyzer` + size-limit CI |
| JS (`/design/work` with filters) | ≤160KB gz | as above |
| JS (`/design/estimate`) | ≤150KB gz | as above |
| Fonts | ≤2 families, ≤4 weights, `woff2`, `font-display: swap`, self-hosted, preloaded | manual review |
| Images | AVIF with WebP fallback, explicit dimensions on 100% | lint rule |

Dark canvas note: OLED dark backgrounds with large hero imagery push LCP. Hero media must be ≤120KB and priority-loaded.

## 7. SEO & machine readability

Structured data per template:

| Template | Schema |
|---|---|
| Hub | `Organization` + `ProfessionalService` + `BreadcrumbList` |
| Track landing | `Service` + `BreadcrumbList` + `FAQPage` |
| Service page | `Service` with `offers.priceSpecification` + `FAQPage` |
| Case study | `CreativeWork` + `BreadcrumbList` |
| Insight | `Article` |

Additional MX requirements (R5):
- `llms.txt` at root describing division structure and service taxonomy
- Semantic HTML with real `<article>`, `<section>`, `<dl>` — no `<div>` soup
- The drawing-type matrix rendered as a real `<table>` with `<th scope>`, so AI crawlers and screen readers both parse it
- Canonical tags on all filtered portfolio views pointing to the unfiltered page

## 8. Analytics

Shared taxonomy from `00-FOUNDATION.md` §6, plus Design-specific:

`track_fork_select` `{track}` · `drawing_matrix_filter` `{discipline, software}` · `sample_request_start` · `sample_request_complete` · `design_desk_tier_view` `{tier}` · `pricing_table_view` `{service_slug}`

PostHog funnels configured at launch:
1. Hub → track fork → service page → contact submit
2. Track B landing → drawing matrix → sample request → contact submit
3. Any page → Design Desk → contact submit

## 9. Integrations

| Service | Purpose | Failure mode |
|---|---|---|
| Sanity | Content | ISR serves last good build; alert on webhook failure |
| Supabase | Leads, sample grants | **Form must not fail if Supabase is down** — fall back to Resend-only delivery and log to Sentry |
| Resend | Notification + auto-reply | Retry 3× exponential; alert on final failure |
| Slack | Lead alerts | Non-blocking, fire-and-forget |
| Upstash Redis | Rate limiting | Fail-open with logging (availability > abuse prevention here) |
| Sentry | Errors | — |

## 10. Security

- All form input Zod-validated server-side. Client validation is UX only, never trusted.
- Honeypot field + Cloudflare Turnstile on contact and sample forms. No visible CAPTCHA (R4.5 friction).
- Supabase RLS: anon key has `INSERT` only on `leads`; zero `SELECT`.
- CSP with nonce; no `unsafe-inline` in production.
- Signed URLs for all sample assets; storage bucket private.
- No PII in analytics events, URLs, or logs.

## 11. Environment

```
NEXT_PUBLIC_SITE_URL
SANITY_PROJECT_ID / SANITY_DATASET / SANITY_API_READ_TOKEN / SANITY_WEBHOOK_SECRET
NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY / LEAD_NOTIFY_EMAIL
SLACK_LEADS_WEBHOOK_URL
UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
TURNSTILE_SITE_KEY / TURNSTILE_SECRET_KEY
NEXT_PUBLIC_POSTHOG_KEY / NEXT_PUBLIC_GA4_ID
SENTRY_DSN
```
Service role key server-only. CI fails on any `SUPABASE_SERVICE_ROLE_KEY` reference inside `app/**/client` or any `'use client'` file.

## 12. Accessibility

WCAG 2.2 AA. Specific risks for this division:
- Dark canvas + amber accent: verify `#E8A33D` on `#0C0C0D` (passes at 8.9:1) but **amber on `--canvas-raised` must be re-checked**
- Drawing matrix table needs `caption`, `scope`, and a responsive strategy that does not become a scroll-trap on mobile
- Portfolio filters must be keyboard operable and announce result counts via `aria-live="polite"`
- Track fork must be reachable and operable by keyboard as the first interactive element after skip-link
