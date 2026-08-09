# Shared Foundation — Architecture & Design Tokens

Read this before any division file. The three division sites are **three themed sections of one application**, not three codebases.

---

## 1. Architectural decision

**One domain. One Next.js application. Four route groups. One deployment.**

`gridsmith.uk` is the only site. The divisions are sections of it, not separate
websites:

```
gridsmith.uk/            → master layer (homepage, about, approach, work, insights)
gridsmith.uk/design/     → Gridsmith Design
gridsmith.uk/digital/    → Gridsmith Digital
gridsmith.uk/press/      → Gridsmith Press
```

Division domains are registered defensively and **301 to their path**. They are never
hosted separately:

```
gridsmithdesign.uk   → gridsmith.uk/design/
gridsmithdigital.uk  → gridsmith.uk/digital/
gridsmithpress.uk    → gridsmith.uk/press/
```

The specification previously said "`gridsmithdesign.uk` and equivalents" and never named
the other two. All three are enumerated here so that the redirect implementation has a
complete list rather than an inference.

Rationale: the group structure decision is a single legal entity with a master brand. Three separate codebases would triple maintenance, split SEO authority, and make cross-division case studies impossible to render. Route groups give each division a fully distinct visual identity while sharing primitives, the portfolio database, the lead pipeline and the deployment.

```
app/
  (marketing)/
    page.tsx                     → gridsmith.uk
    about/  approach/  work/  insights/  contact/
  (design)/design/               → Gridsmith Design
  (digital)/digital/               → Gridsmith Digital
  (press)/press/                 → Gridsmith Press
  api/
    lead/route.ts
    revalidate/route.ts
components/
  primitives/                    ← shared, theme-agnostic
  divisions/design|digital|press/ ← division-specific compositions
lib/
  cms/  analytics/  leads/  schema/
styles/
  tokens.css                     ← base layer
  themes/design.css|digital.css|press.css
```

Theming is applied by a `data-division` attribute on `<body>`, set by the route group layout. Division themes override CSS custom properties only — never component logic.

## 2. Stack (fixed for all three)

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js 15, App Router, TypeScript strict** — pinned, not `15+` | SSG/ISR is non-negotiable for the SEO surface (R1, R3). See the version note below |
| Styling | **Tailwind CSS v4 + CSS custom properties** | Token-driven theming without a JS runtime |
| CMS | **Sanity** | Structured content, portable text, real relations |
| Lead store | **Supabase** (Postgres) | Already in the stack; RLS; direct SQL for reporting |
| Email | **Resend** | Transactional + notification |
| Hosting | **Vercel** | ISR, edge, preview deployments |
| Analytics | **GA4 + PostHog** | PostHog for funnels/session replay; GA4 for channel attribution |
| Forms | Server Actions + Zod | No client-side form library; less JS (R5 MX) |
| Motion | **CSS transitions and animations only** | JS budget discipline |

**Next.js version — pinned to 15, measured at A-01.** The original `15+` allowed Next 16,
which npm resolves by default. Measured on an empty App Router page rendering a single
element, gzipped, module scripts only (`noModule` legacy polyfills excluded):

| Build | First Load JS |
|---|---|
| Next 15 + React 18 | **100.2KB gz** |
| Next 15 + React 19 | **100.2KB gz** |
| Next 16 + React 19 | **129.5KB gz** |

React 19 costs nothing; **Next 16 adds ~29KB gz to the floor**, which puts an empty page
over every budget in `CLAUDE.md` §Performance budgets before a token or primitive exists.
Verified against both build backends — webpack measured 127.0KB on Next 16, so it is not
a Turbopack artifact.

Consequence: **do not upgrade to Next 16 without re-measuring.** Node 22 LTS is the target
runtime; Node 20 passed end-of-life in April 2026.

### Budgeting on the delta, not the total

The floor above is a constant the project does not control. Budgets are therefore set on
**JS added above the floor**:

| Route group | Delta | ≈ total | What it buys |
|---|---|---|---|
| Master | ≤15KB gz | ~115KB | Consent banner 8KB + chrome |
| Digital | ≤15KB gz | ~115KB | Deliberately the tightest in the programme |
| Press | ≤20KB gz | ~120KB | Books shelf + filters |
| Design | ≤25KB gz | ~125KB | Work grid + drawing matrix + filters |
| Estimator / path-finder routes | ≤40KB gz | ~140KB | The interactive islands |

`scripts/check-bundle-size.mjs` reports floor, delta and total per route, and fails on
the **delta**. The floor is a declared constant in that script; re-baselining it is a
deliberate act and belongs in its own commit with the measurement in the message. If
every route fails at once by a similar amount, the floor moved — that is the signal the
separation exists to produce.

Budgeting on the total would have hidden the Next 16 regression as four unrelated feature
overruns instead of one framework fact.

**Explicitly rejected:** Vite SPA (no SSG — fatal for the organic-search strategy); WordPress (performance ceiling, security surface); any page-builder (defeats the premium-craft positioning per R4.6); **any animation library, Framer Motion included** — every motion spec in the four `DESIGN.md` files is reachable with CSS plus, at most, an `IntersectionObserver`, and a JS animation runtime does not survive Digital's 90KB budget or its 100/100/100 gate; any UI component library; any third-party CMP.

## 3. Base design tokens

```css
/* styles/tokens.css — base layer, division-agnostic */
:root {
  /* Spacing — 4px base, geometric */
  --space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
  --space-4: 1rem;     --space-6: 1.5rem;   --space-8: 2rem;
  --space-12: 3rem;    --space-16: 4rem;    --space-24: 6rem;
  --space-32: 8rem;    --space-48: 12rem;

  /* Type scale — 1.25 major third, fluid */
  --text-xs:   clamp(0.75rem, 0.73rem + 0.1vw, 0.8125rem);
  --text-sm:   clamp(0.875rem, 0.85rem + 0.12vw, 0.9375rem);
  --text-base: clamp(1rem, 0.97rem + 0.15vw, 1.0625rem);
  --text-lg:   clamp(1.25rem, 1.18rem + 0.35vw, 1.5rem);
  --text-xl:   clamp(1.5rem, 1.35rem + 0.75vw, 2rem);
  --text-2xl:  clamp(2rem, 1.7rem + 1.5vw, 3rem);
  --text-3xl:  clamp(2.5rem, 2rem + 2.5vw, 4.5rem);
  --text-4xl:  clamp(3rem, 2.2rem + 4vw, 6.5rem);

  --leading-tight: 1.05;  --leading-snug: 1.25;
  --leading-normal: 1.55; --leading-relaxed: 1.7;
  --measure: 68ch;        --measure-narrow: 52ch;

  /* Structure — R5: hairlines, not shadows */
  --border-hairline: 1px;
  --radius-none: 0;  --radius-sm: 2px;  --radius-md: 4px;
  --shadow-1: 0 1px 2px rgb(0 0 0 / 0.04);
  --shadow-2: 0 2px 8px rgb(0 0 0 / 0.06);
  /* No --shadow-3. If a design needs it, the design is wrong. */

  /* Motion — opacity and transform only */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast: 150ms;  --dur-base: 250ms;  --dur-slow: 400ms;

  --container: 1280px;
  --container-narrow: 800px;
  --grid-cols: 12;
  --gutter: var(--space-6);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;   /* added at A-02 */
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;          /* added at A-02 */
  }
}
```

**Two additions to the reduced-motion block, made at A-02.** `animation-duration` alone
does not stop an infinite animation — it loops, just very fast, which is worse than the
animation it replaced. `animation-iteration-count: 1` is what actually stops it.
`scroll-behavior: auto` cancels smooth scrolling, which is motion the original block
missed. Accessibility is non-negotiable #10, so this is a correction rather than an
embellishment.

**Tailwind namespace collision — resolved at A-02.** Tailwind v4 defines its own
`--text-*`, `--leading-*`, `--radius-*` and `--ease-*` theme variables, and all fifteen
names collide with the scale above. Both sets were emitted to `:root`, and ours won only
because `tokens.css` is imported second — reordering two lines in `styles/globals.css`
would have silently reverted the type scale, radius scale and easing curve to Tailwind's
defaults, with nothing failing.

`styles/globals.css` therefore clears those four namespaces from Tailwind's theme, making
`tokens.css` the single definition. The corresponding Tailwind utilities (`text-3xl`,
`rounded-md`, `leading-snug`, `ease-out`) disappear with them, which is intended — a
utility silently carrying a different value from the token of the same name is precisely
the hazard. Primitives read `var(--text-3xl)`. Tailwind's spacing and layout utilities are
untouched.

`scripts/check-tokens.mjs` asserts all 39 base tokens survive into the built CSS. The
failure it exists for is silent: a broken import chain leaves every `var()` resolving to
nothing while the build still succeeds.

Every theme — the three divisions and master — must define exactly these, and only
these:

```css
--canvas  --canvas-raised  --canvas-sunken
--ink  --ink-muted  --ink-subtle
--accent  --accent-hover  --accent-ink
--line  --line-strong
--font-display  --font-body  --font-mono
--radius-default
```

**One exception, master only.** `themes/master.css` additionally defines
`--accent-design`, `--accent-digital` and `--accent-press`. The master layer has no
colour of its own, so it needs the division accents to render the three elements that
reference a division: routing cards, division badges, and the footer switcher
(`master/DESIGN.md` §2). No other theme defines them, and no division theme may
reference another division's accent.

## 4. Division theme summary

| Token | Design | Digital | Press |
|---|---|---|---|
| Character | Precision instrument | Engineered clarity | Editorial authority |
| `--canvas` | `#0C0C0D` (dark) | `#FAFAF9` (light) | `#FBF9F4` (warm paper) |
| `--ink` | `#F5F5F4` | `#0A0A0A` | `#1A1815` |
| `--accent` | `#E8A33D` amber | `#1B5FFF` electric blue | `#2E4A3A` deep green |
| `--font-display` | Neue Haas Grotesk Display / Inter Display | GT America Mono / JetBrains Mono | Freight Text / Source Serif 4 |
| `--font-body` | Inter | Inter | Source Serif 4 |
| `--radius-default` | `0` | `2px` | `2px` |
| Motif | Drawing-sheet grid, title blocks, revision marks | Terminal blocks, monospace data, 1px rules | Book object, margin notes, drop caps |

All three inherit the same spacing, type scale, grid and motion tokens. **A user moving between divisions should feel the same hand, different voice.**

## 5. Shared primitives (build once) — **24**

`Button` · `Link` · `Container` · `Grid` · `Section` · `Eyebrow` · `Heading` · `Prose` · `Card` · `Media` (watermarked, right-click disabled) · `Accordion` · `Tabs` · `Field` · `Select` · `RadioGroup` · `Stepper` · `Table` · `Badge` · `RevealOnScroll` · `StickyCta` · `Breadcrumb` · `Pagination` · `EmptyState` · `ErrorState`

All primitives consume tokens only. **No primitive may contain a hardcoded colour.** CI lint rule enforces this.

**The list above is authoritative; the count follows it.** Where an older file says
21, that number predates the addition of `Breadcrumb`, `Pagination`, `EmptyState` and
`ErrorState` and is wrong. `Marquee` was removed at kickoff — `design/PROJECT-RULES.md`
already prohibits marquee text on content sections, so the primitive had no compliant
caller in any of the four route groups.

## 6. Shared systems

### Lead pipeline (identical across divisions)
```
Form (Server Action + Zod)
  → Supabase `leads` insert
  → Resend: internal notification (<60s) + applicant auto-reply
  → Slack webhook #gridsmith-leads
```

**CRM sync is deferred, not dropped.** No CRM is named anywhere in the specification,
so no adapter is built — inventing an integration target is exactly the kind of
speculative work that rots. The `leads.crm_synced_at` column stays in the schema so
that adding a sync later is a migration-free change. Name the CRM and it becomes a
one-task addition.
**Response commitment (set by the founder, August 2026):** as soon as possible,
and **always by the end of the next business day.** The 60-second *notification*
requirement stands and is a launch gate. The 5-minute *human response* is not
committed to and the site must never imply it.

Trade-off accepted knowingly: R2 finds a 5-minute response makes a lead 21x more
likely to qualify. Committing to next business day forfeits most of that. The
correct response is not to promise more than the business can hold — a broken
response promise costs more than a slower honest one. Revisit when there is
capacity to staff a faster rota.

### Portfolio
Single Sanity `project` document type, `divisions[]` as a multi-select. Queried three ways: master `/work`, division `/[division]/work`, and auto-pulled by tag onto service pages.

### Consent management (UK GDPR / PECR) — **added at validation**

GA4, PostHog and the Design division's `gs_design_track` cookie are all non-essential
storage under PECR. They require prior consent.

```
Consent Mode v2 (Google) + a self-hosted banner
  · Default state: analytics_storage=denied, ad_storage=denied,
    functionality_storage=denied
  · No GA4, PostHog or preference cookie fires before an affirmative choice
  · Reject must be as easy as Accept — one click, equal prominence
  · Choice stored in a strictly-necessary first-party cookie, 12-month expiry
  · A persistent footer link reopens preferences
  · Server-side lead capture is a legitimate-interest/contract basis and is
    unaffected — forms work regardless of consent state
```

Implementation note: use a lightweight self-hosted banner (≤8KB), not a third-party
CMP. Commercial CMPs typically add 60–100KB and render-blocking scripts, which
breaks the performance budgets in §7 and, on Digital, the 100/100/100 launch gate.

Consequence for `is_ai_referral` tracking (R1): referrer classification for
consented sessions only. Expect a measurement gap and do not treat consented
volume as total volume.

### Migration & redirects — **added at validation**

Before any division goes live:
1. Crawl the existing Gridsmith site; export every indexed URL.
2. Map each to its new destination. Unmappable URLs go to the nearest division hub,
   never to the homepage and never to a 404.
3. Implement as 301s in `next.config.js`, version-controlled.
4. Preserve existing inbound-link equity — verify in Search Console post-launch.
5. Defensive domains (`gridsmithdesign.uk`, etc.) 301 to their path, not hosted.

A missing redirect map is the most common cause of an organic-traffic collapse
after a rebuild, and it is invisible until the rankings have already gone.

### Analytics events (shared taxonomy)
`page_view` · `division_view` · `service_view` · `case_study_view` · `estimator_start` · `estimator_complete` · `cta_click` · `form_step` · `form_submit` · `form_error` · `sample_request` · `outbound_click`

Every event carries `division`, `service_slug`, `traffic_source`, `is_ai_referral`.

### AI-referral detection
Referrer or UTM matching `chatgpt.com|perplexity.ai|gemini.google|claude.ai|copilot.microsoft` → flag `is_ai_referral=true`. Required by R1 (22% conversion premium — must be measured, not assumed).

## 7. Seed content policy — **added at revision**

Real portfolio and real pricing arrive after the build. The sites are therefore built
and validated against **seed content**: structurally realistic, visibly fake.

### Rules

1. **Seed content must be structurally complete.** Every field a real record would
   populate is populated. A seed project with no metric, no client display name and
   one image does not exercise the template and will hide layout defects that surface
   the day real content lands.
2. **Seed content must be visibly identifiable as placeholder.** Every seed record
   carries `isSeed: true`. The CMS lists seed records with a marker. Client names use
   an obviously fictional convention (`Northfield Engineering`, `Halcyon Press`) — never
   a real company name, never a plausible-but-unverifiable one.
3. **A `?seed=hide` query param and an env flag hide all seed content**, so the site can
   be demonstrated to a real prospect without placeholder work in it.
4. **Seed content cannot ship to production with `NEXT_PUBLIC_ENV=production`.**
   A build-time check fails the deploy if any `isSeed: true` record is published while
   the environment is production. This is the mechanism that stops fake case studies
   going live by accident — the single most damaging content failure available here.
5. **Seed prices use a distinct format** — every figure rendered with a visible
   `INDICATIVE` badge and a footnote. No seed price may appear without it.
6. **Seed metrics render as visibly fake, not as plausible numbers.** `project.metrics`
   requires at least one quantified metric, so every seed case study necessarily carries
   invented figures. They render with a `[SEED]` prefix and zeroed digits — `[SEED] 00%`,
   `[SEED] 00 days` — never a number a reader could mistake for a real outcome.

   Two mechanisms, doing two different jobs. The `isSeed` exemption stops the
   `content-integrity` agent flagging its own seed data every week until someone learns
   to ignore it. The visible marker is for the human reading staging, who has no access
   to the `isSeed` flag and would otherwise have no way to tell an invented metric from a
   real one. Neither substitutes for the other.
7. **Images are abstract or clearly generic.** No fabricated engineering drawings, no
   fabricated book covers, no fabricated screenshots of software that does not exist.
   Use neutral geometric placeholders at correct aspect ratios.

### Seed volume required to validate UI/UX

| Content type | Seed count | Why this number |
|---|---|---|
| Projects (across all divisions) | 24 | Exercises grid pagination, filter combinations, and the empty state |
| — with 1 metric | 8 | Minimum-content case study layout |
| — with 4+ metrics, 8+ images | 4 | Maximum-content case study layout |
| — cross-division (2+ divisions) | 3 | The multi-division badge and master `/work` grouping |
| — confidential (no client name) | 3 | The `clientDisplay` fallback path |
| Services | 10 per division | Realistic nav and cross-link density |
| Books (Press) | 12 | Shelf grid, filters, LCP under image load |
| Drawing types (Design) | 20 | Matrix scroll, sticky header, mobile pinned column |
| Stack items (Digital) | 15 | Category grouping on the stack page |
| FAQs | 12–18 per division | Accordion behaviour and schema output |
| Testimonials | 6 | |

Anything less and the templates are being validated against conditions that will not
occur in production.

### Scaling to real content

The portfolio is designed to grow without structural change:

- **No hardcoded counts anywhere.** Grids paginate at 24 with URL-state pagination.
- **Filters derive their options from the data**, not from a hardcoded list. Adding a
  new industry or discipline to a project makes it appear as a filter option
  automatically.
- **Adding a project requires no deploy** — Sanity publish triggers ISR revalidation.
- **Bulk import path:** a documented CSV/JSON → Sanity migration script lives in
  `scripts/import-projects.ts`, so 100 historical projects can be loaded in one pass
  rather than typed into the CMS one at a time. Build this before content entry starts,
  not after; it is two days of work that saves several weeks.
- **Image ingest is scripted too** — watermarking, resizing and AVIF conversion run at
  upload, so a bulk import does not require manual asset preparation.

### Replacing seed content

Seed records are deleted, not edited into real ones. Editing a seed record risks
carrying `isSeed: true` into production or leaving fragments of placeholder copy in a
real case study. The import script and the seed script are separate paths.

## 8. Universal launch gates

No division ships without all of these green:

1. Lighthouse ≥95 performance / ≥100 accessibility / ≥100 SEO on every template
2. LCP ≤2.0s, INP ≤200ms, CLS ≤0.05 on 4G throttle
3. WCAG 2.2 AA verified — axe clean + manual keyboard pass + screen reader pass
4. Lead notification measured under 60 seconds end to end; confirmation copy states the next-business-day commitment and nothing faster
5. All structured data validating in Google Rich Results Test
6. Minimum 4 published case studies with at least one quantified metric each
7. Pricing published on 100% of service pages
8. `Gridsmith Ltd` legal disclosure present in footer with company number
9. 404 / 500 / empty / loading states designed and implemented
10. Zero TypeScript errors, zero ESLint warnings, zero console errors in production
11. Consent banner live; no non-essential cookie fires before an affirmative choice
12. Redirect map complete and tested; zero unmapped indexed URLs from the previous site
