# Tech Spec — Gridsmith Master Layer

Inherits `_shared/00-FOUNDATION.md` §2. Master-specific detail only.

---

## 1. Route map

| Route | Render | Revalidate | Notes |
|---|---|---|---|
| `/` | SSG + ISR | 1800s | Homepage |
| `/approach` | SSG + ISR | 3600s | The ecosystem argument |
| `/about` | SSG + ISR | 3600s | |
| `/work` | SSG shell + client filter | 1800s | All divisions |
| `/work/[slug]` | SSG | 3600s | **Canonical case study URL** |
| `/insights` | SSG + ISR | 1800s | |
| `/insights/[slug]` | SSG | 3600s | |
| `/contact` | Server Component + Server Action | — | |
| `/legal/[slug]` | SSG | 86400s | terms, privacy, cookies, accessibility |
| `/sitemap.xml` `/robots.txt` `/llms.txt` | Route handlers | 3600s | Cover all four groups |
| `/not-found` `/error` | Static | — | |

## 2. Case study canonicalisation — important

Case studies exist at `/work/[slug]` **only**. Division routes (`/design/work`, `/digital/work`, `/press/work`) are filtered *index* views that link to the canonical `/work/[slug]`.

This resolves a defect latent in the division specs, where each division implied its own case study detail route. Three URLs for one document would have split link equity and created duplicate content. Division index views carry `rel=canonical` to `/work` when unfiltered, and are `noindex` when filtered on more than one facet.

## 3. Header, footer and division switching

```tsx
// app/layout.tsx — root
// data-division is set by each route group's layout; the master layer uses "master"
<body data-division={division}>
  <SkipLink />
  <Header division={division} />
  {children}
  <Footer />          {/* division switcher lives here */}
  <ConsentBanner />
</body>
```

**Division switcher placement rule:** footer only. A header-level division switcher pulls buyers sideways mid-funnel. The header shows the *current* division's navigation plus a wordmark link back to `/`.

Theme transition between route groups must be flash-free: `data-division` is set server-side in the route group layout, so the correct theme is present in the first paint. No client-side theme swap.

## 4. Consent management (FR-M14)

```
components/consent/ConsentBanner.tsx     ~6KB gz, self-hosted
lib/consent/                             state, Consent Mode v2 bridge
```

- Default: `analytics_storage=denied`, `ad_storage=denied`, `functionality_storage=denied`
- GA4 and PostHog scripts are **not injected** until consent is granted — not loaded-and-suppressed
- The Design division's `gs_design_track` preference cookie is gated on `functionality_storage`
- Accept and Reject are equally prominent, both one click, no dark patterns
- Choice stored in `gs_consent` (strictly necessary, 12 months, `SameSite=Lax`)
- A footer link reopens preferences at any time
- **Server-side lead capture is unaffected** — forms work fully regardless of consent state, because processing an enquiry someone submitted is contract/legitimate interest, not analytics

Explicitly rejected: any third-party CMP. Typical CMPs add 60–100KB and render-blocking scripts, which breaks Digital's 100/100/100 gate.

## 5. Redirect map (FR-M17)

```js
// next.config.js
async redirects() {
  return [
    ...legacyRedirects,      // from redirects/legacy.json — generated from a crawl
    ...defensiveDomains,     // gridsmithdesign.co.uk/* → /design/*
  ];
}
```

Procedure: crawl the existing site → export every indexed URL → map each to a destination → unmappable URLs go to the nearest division hub, **never to `/` and never to a 404** → commit `redirects/legacy.json` → verify in Search Console post-launch.

## 6. Seed content enforcement

```ts
// scripts/check-no-seed-in-prod.ts — runs in CI on production builds
if (process.env.NEXT_PUBLIC_ENV === 'production') {
  const seeds = await sanity.fetch(`count(*[isSeed == true && published == true])`);
  if (seeds > 0) throw new Error(`${seeds} seed records published in production`);
}
```
This is a deploy-blocking check. Fabricated case studies reaching production is the most damaging content failure available to this project.

## 7. Performance budget

| Metric | Budget |
|---|---|
| Lighthouse performance, homepage | ≥98 |
| LCP | ≤1.8s |
| INP | ≤200ms |
| CLS | ≤0.03 |
| JS, master routes | ≤110KB gz (consent banner included) |
| `/work` with filters | ≤150KB gz |

## 8. SEO & machine readability

| Template | Schema |
|---|---|
| Homepage | `Organization` (with `legalName`, `vatID`, `address`, `sameAs`) + `WebSite` with `SearchAction` |
| `/about` | `Organization` + `AboutPage` |
| `/approach` | `WebPage` + `HowTo` for the six-stage process |
| `/work` | `ItemList` of `CreativeWork` |
| `/work/[slug]` | `CreativeWork` + `BreadcrumbList` |
| `/insights/[slug]` | `Article` |
| `/legal/[slug]` | `WebPage`, `noindex` optional per page |

`Organization.legalName` is `Gridsmith Ltd`. The three divisions are represented as `Organization.department` entries, not as separate `Organization` nodes — they are trading divisions, and marking them as separate organisations would be factually wrong in structured data.

`llms.txt` covers the whole site: what Gridsmith is, the four route groups, the service taxonomy, and the canonical case study path.

## 9. Analytics

Shared taxonomy plus master-specific:

`division_card_click` `{division}` · `approach_scroll_depth` `{pct}` · `cross_division_case_view` `{divisions[]}` · `multi_need_selected` · `consent_choice` `{accept|reject|custom}` · `legal_page_view` `{slug}` · `division_switch` `{from, to}`

Funnels:
1. `/` → division card → division hub → division lead
2. `/` → `/approach` → `/contact` → lead
3. `/work` → cross-division case study → `/contact` → lead

`multi_need_selected` is the metric that tells you whether the master brand is doing any commercial work at all. If it stays near zero, the ecosystem argument is not landing and the group structure is not earning its keep.

## 10. Accessibility

WCAG 2.2 AA. Master-specific:
- The consent banner must be keyboard-trappable-and-escapable, announced on load, and must not obscure the skip link
- Division cards are links, not click-handled divs, and are reachable in a single tab sequence
- `/legal/*` pages need a table of contents with in-page anchors and correct heading hierarchy — these documents are read by screen readers and referenced by clause number
