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

**Four root layouts, not one — corrected at A-04.** This section previously showed a
single `app/layout.tsx` receiving a `division` prop. App Router cannot do that: only a
root layout may render `<html>`/`<body>`, and a root layout has no access to the pathname.
Deriving it from `headers()` via middleware would opt every route out of static rendering
and destroy the SSG requirement in §1.

The supported shape is multiple root layouts — no `app/layout.tsx`, and one per route
group:

```
app/
  (marketing)/layout.tsx   → <body data-division="master">   + page.tsx      → /
  (design)/layout.tsx      → <body data-division="design">   + design/       → /design
  (digital)/layout.tsx     → <body data-division="digital">  + digital/      → /digital
  (press)/layout.tsx       → <body data-division="press">    + press/        → /press
```

```tsx
// app/(design)/layout.tsx — one of four roots
export default function DesignLayout({ children }: { children: ReactNode }) {
  return (
    <RootShell division="design" fontVariables={`${inter.variable} ${jetbrainsMono.variable}`}>
      {children}
    </RootShell>
  );
}
```

`components/chrome/RootShell.tsx` holds the shared document shell so the skip link,
header, footer and consent banner are added once rather than four times.

Two consequences, both of which the specs already wanted:

- **Navigation between route groups is a full document load.** That satisfies §9's
  "no page transition between route groups — the theme change *is* the transition", and
  it removes any window in which a client-side theme swap could occur.
- **Fonts scope naturally.** Each root layout imports only its own faces, so Source Serif
  never reaches Design or Digital.

**Division switcher placement rule:** footer only. A header-level division switcher pulls buyers sideways mid-funnel. The header shows the *current* division's navigation plus a wordmark link back to `/`.

Theme transition between route groups must be flash-free: `data-division` is set server-side in the route group layout, so the correct theme is present in the first paint. No client-side theme swap.

## 4. Consent management (FR-M14)

```
components/consent/ConsentBanner.tsx     2.0KB gz MEASURED at A-11; budget 3KB, rule <=8KB
lib/consent/                             the notice cookie. No categories, no Consent Mode bridge
```

**⚠ AMENDED 26 August 2026 — `M-P2-ANALYTICS`, owner decision OQ-7 option 2.** The analytics injection and all three consent categories are **removed** from the site. Nothing non-essential is stored or transmitted in any state, so PECR reg. 6(2) consent is not engaged and the banner is a **notice**: one control, no toggles, no Consent Mode signal. `gs_consent` remains, exempt under Sch. A1 para. 4, holding `1`. **Everything below describes the arrangement that returns with the analytics** — `docs/_shared/BEFORE-LAUNCH.md` item 22, whose prerequisites (`L-07` and the `dataLayer` shim defect) are conditions, not follow-ups. `docs/_legal/03-REVISION-LOG.md` round 10.

**Current:** no consent categories · no analytics of any kind · the notice is dismissed by one
control, which writes `gs_consent=1` (strictly necessary, 12 months, `SameSite=Lax`) · a footer link
labelled **"Cookie notice"** reopens it and stores nothing · a pre-removal `gs_consent` is read for
presence only and never rewritten.

**Superseded, and what returns with the analytics:**

- Default: `analytics_storage=denied`, `ad_storage=denied`, `functionality_storage=denied` — **removed.** If any category returns, only one that gates a real code path returns with it
- GA4 and PostHog scripts are **not injected** until consent is granted — not loaded-and-suppressed. **Now stronger: they are not injected at all**
- The Design division's `gs_design_track` preference cookie is gated on `functionality_storage` — **that cookie has never existed**
- Accept and Reject are equally prominent, both one click, no dark patterns — **binding again the moment there is anything to accept**
**The size figure here said `~6KB` and `PROJECT-RULES.md` §8 and `FOUNDATION` §5 both say
8KB.** `PROJECT-RULES.md` is binding (CLAUDE.md, "How to work"), so 8KB stands and this line
was corrected to match at `M-06`. **Neither number has ever been measured** — no banner
exists. 8KB is a *reservation*, and `check-bundle-size` now asserts that the master route
leaves room for it rather than printing it as though it had been weighed.

- **Server-side lead capture is unaffected** — forms work fully regardless of consent state, because processing an enquiry someone submitted is contract/legitimate interest, not analytics

Explicitly rejected: any third-party CMP. Typical CMPs add 60–100KB and render-blocking scripts, which breaks Digital's 100/100/100 gate.

## 5. Redirect map (FR-M17)

```js
// next.config.js
async redirects() {
  return [
    ...legacyRedirects,      // from redirects/legacy.json — generated from a crawl
    ...defensiveDomains,     // gridsmithdesign.uk/* → /design/*
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
| Framework floor (reported, not budgeted) | 100.2KB gz — Next 15 + React 19 |
| **JS delta, master routes** | **≤15KB gz** above the floor, consent banner included (~115KB total) |

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
