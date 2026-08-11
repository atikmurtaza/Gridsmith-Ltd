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

**Implemented at A-04 as four root layouts** — there is no `app/layout.tsx`. Only a root
layout may render `<html>`/`<body>`, and a single one has no way to know which division it
is serving without opting out of static rendering. See `master/TECH-SPEC.md` §3.

Verified rather than asserted, by `scripts/check-theme-flash.mjs`: `data-division` is
present and correct in each route's prerendered HTML, the stylesheet is render-blocking
ahead of `<body>`, and **no client chunk references `data-division` at all** — so no code
path exists that could set it late. A flash is impossible rather than merely unobserved.

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

### `--line` and `--line-strong` are decorative in every theme

Swept at A-05 across all four themes and all three surfaces (`--canvas`,
`--canvas-raised`, `--canvas-sunken`) — twelve combinations per token:

| Token | Measured range | WCAG 1.4.11 (3:1) |
|---|---|---|
| `--line` | 1.12 – 1.34:1 | fails everywhere |
| `--line-strong` | **1.45 – 1.79:1** | **fails everywhere** |
| `--ink-subtle` | 4.18 – 5.19:1 | passes everywhere |
| `--ink-muted` | 6.64 – 7.83:1 | passes everywhere |
| `--accent` | 4.46 – 19.17:1 | passes everywhere |

This was first found as a Design-theme defect. It is not division-specific, so the rule
lives here rather than in one division's `DESIGN.md`.

**The rule.** WCAG 1.4.11 requires 3:1 for anything that identifies a user interface
component or one of its states. Neither line token can carry that anywhere.

| Job | Token |
|---|---|
| Border that identifies a control, or marks one of its states | **`--ink-subtle`** — the lightest token clearing 3:1 on every surface, so it reads as a hairline without failing |
| A state that needs more weight than a hairline | `--accent` or `--ink` |
| Separators, card edges, table rules, decorative hairlines | `--line` / `--line-strong` — unrestricted, they carry no information |

**Colour is never the only signal.** WCAG 1.4.1 is separate from 1.4.11 and a compliant
contrast ratio does not satisfy it. Every state must carry **at least one non-colour
cue** alongside any colour change — a border-width step, a background step, a glyph or
shape change, a text label, or the corresponding ARIA state. Digital's "three-cue
selected state" is this rule stated locally; it applies to all four divisions.

`scripts/check-contrast.mjs` gates this as a **permission matrix**: every foreground token
against every surface in every theme — 101 combinations — with the role each may carry
derived from its own measured ratio. A token that claims a stronger job than its
measurement supports fails the build, and a deliberate downgrade has to be recorded with
its reason rather than omitted.

It was previously a three-token list covering `--ink`, `--ink-muted` and `--ink-subtle`.
The sweep above measured nine tokens; the gate checked three. `--accent` was one of the
six left out, and the range published two paragraphs up — 4.46:1 at its worst — is Digital's
`--accent` on `--canvas-sunken`, below the 4.5:1 body-text floor, reachable through any
`Prose` link in a sunken `Section` or a hovered secondary button inside `EmptyState`. The
measurement existed and was simply not applied, which is the same defect as the
`--ink-subtle` restriction it sits next to. Digital's `--canvas-sunken` moved from
`#F0F0EE` to `#F3F3F1` (4.58:1) under the Q-M13 rule that the buffer is the point.

A per-token list is what produces that class of defect. The matrix is the fix; the token
value was only the instance.

## 4. Division theme summary

| Token | Design | Digital | Press |
|---|---|---|---|
| Character | Precision instrument | Engineered clarity | Editorial authority |
| `--canvas` | `#0C0C0D` (dark) | `#FAFAF9` (light) | `#FBF9F4` (warm paper) |
| `--ink` | `#F5F5F4` | `#0A0A0A` | `#1A1815` |
| `--accent` | `#E8A33D` amber | `#1B5FFF` electric blue | `#2E4A3A` deep green |
| `--font-display` | Inter | JetBrains Mono | Source Serif 4 |
| `--font-body` | Inter | Inter | Source Serif 4 |
| `--radius-default` | `0` | `2px` | `2px` |
| Motif | Drawing-sheet grid, title blocks, revision marks | Terminal blocks, monospace data, 1px rules | Book object, margin notes, drop caps |

**Typefaces, decided at A-03 (`Q-M10`).** The originally specified display faces — Neue
Haas Grotesk Display, GT America Mono and Freight Text — are all commercially licensed and
no licence is held. The open equivalents already named as fallbacks in the specification
are used instead: **Inter**, **JetBrains Mono** and **Source Serif 4**, self-hosted through
`next/font`.

The licensed names are **not** left in the font stacks. Naming an unlicensed face means it
renders for the minority of visitors who happen to have it installed locally and not for
anyone else, which is worse than not naming it. Buying a licence later is a change to one
module in `styles/fonts/` — the theme files reference a CSS variable, not a family name.

**Font *files* are scoped per route group; `@font-face` *declarations* are not.** One
module per typeface in `styles/fonts/`, and a layout imports only the modules its division
uses, so the only `.woff2` a visitor downloads is the one its division renders — Press
fetches Source Serif and JetBrains Mono and never Inter. That part is real and measured:
`/digital` requests exactly one font file.

But every `@font-face` block lands in the shared stylesheet, because `styles/globals.css`
is imported by all four root layouts. So every route ships the CSS declarations for all
three families — 22 blocks, of which a given division uses at most 8 — and `/digital`
downloads Source Serif declarations it will never use. Roughly 29KB of CSS across three
render-blocking files, where the useful fraction is about a third.

The earlier wording here said loading was scoped and left the CSS implied. It overstated
what is true. Tracked at `M-08` (P2) — it is bytes on the critical path, not a correctness
problem, and the fix is per-route-group CSS entry points rather than one shared import.

JetBrains Mono reaches all four route groups deliberately, because monospace marks
verifiable facts everywhere. Each division stays within the two-family limit in
`design/PROJECT-RULES.md` §8.

### ⚠ `next/font`'s fallback metrics are load-bearing for **both** LCP and CLS

`next/font` generates a metric-matched fallback for each family and emits it alongside the
real face:

```css
@font-face{font-family:Inter Fallback;src:local("Arial");
  ascent-override:90.44%;descent-override:22.52%;line-gap-override:0.00%;size-adjust:107.12%}
```

With `font-display: swap` **and** those overrides, the fallback paint is already the final
layout. Two consequences, and they are the same mechanism seen from two directions:

- **CLS stays 0.000.** The swap changes glyph shapes, not metrics, so nothing moves.
- **LCP equals FCP.** Because the element's box does not change, the swap produces no new
  LCP candidate — the browser paints the heading once and never re-reports it. Measured on
  `/digital` under real 4G: FCP 1441ms, LCP 1441ms.

**Changing `font-display` away from `swap`, or dropping `next/font`'s fallback metric
generation, breaks both at once.** `block` gives invisible text until the font arrives and
moves LCP out by the font fetch; `optional` or a hand-written `@font-face` without
`size-adjust` reintroduces the metric mismatch and CLS with it. The two failures look
unrelated in a report and have one cause.

**No current gate catches this.** `check:contrast` and `check:tokens` do not read
`@font-face`; the mobile Lighthouse axis would catch the *consequence* on the routes it
visits, but only after the fact and only on those four URLs. Treat any change to
`styles/fonts/*` as **requiring both Lighthouse axes to be re-measured**, and say so in the
commit. `_shared/01-VALIDATION-REPORT.md` §12 is the reason this warning is written out
rather than assumed.

**Preload: deliberately absent, and conditionally fine.** Next emits no
`<link rel="preload" as="font">` for these faces, so the `.woff2` is discovered only after
CSS parse, behind three render-blocking stylesheets. That costs nothing *while* `swap` and
the fallback metrics hold, because the text is painted and final before the font arrives —
it is a later swap of glyph shapes, not a delayed paint. **It becomes load-bearing the
moment `font-display` changes**: under `block` or `optional` the font is on the critical
path and its late discovery goes straight into LCP. If that change is ever made, add the
preload in the same commit.

All three inherit the same spacing, type scale, grid and motion tokens. **A user moving between divisions should feel the same hand, different voice.**

## 5. Shared primitives (build once) — **24**

`Button` · `Link` · `Container` · `Grid` · `Section` · `Eyebrow` · `Heading` · `Prose` · `Card` · `Media` (watermarked, right-click disabled) · `Accordion` · `Tabs` · `Field` · `Select` · `RadioGroup` · `Stepper` · `Table` · `Badge` · `RevealOnScroll` · `StickyCta` · `Breadcrumb` · `Pagination` · `EmptyState` · `ErrorState`

All primitives consume tokens only. **No primitive may contain a hardcoded colour.** CI lint rule enforces this.

**Three are Client Components; twenty-one are not.** Built at A-05, and the split did not
land where the build order predicted:

| Client | Why no server or CSS construction exists |
|---|---|
| `Tabs` | The WAI-ARIA tabs pattern needs roving `tabindex` and arrow-key selection |
| `RevealOnScroll` | `IntersectionObserver` |
| `StickyCta` | Scroll depth against document height |

`EmptyState` and `ErrorState` were expected to need client code and do not — they are
presentational. Where the platform had a native equivalent it was used instead of a
widget: **`Accordion` is `<details>`/`<summary>`**, `Select` is a native `<select>`, and
`RadioGroup` is a `<fieldset>` of real radios. Those three ship no JavaScript at all and
get their keyboard behaviour, state and announcements from the browser.

Measured on `/_kitchen-sink`, which renders every primitive four times: **5.7KB gz above
the framework floor**. That is the whole client cost of the primitive layer, against
Master's 15KB delta budget of which the consent banner already claims 8KB.

**That figure is now budgeted, not just printed.** `/_kitchen-sink` carries a 7KB delta
budget in `check-bundle-size.mjs` — Master's 15KB minus the banner's reserved 8KB, which
is the ceiling the M-06 arithmetic actually depends on. It was previously exempted from
budgeting, so the number every later stage builds on was measured, reported and enforced
by nothing.

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

### Lighthouse runs on two axes, and they answer different questions

One gate was doing two jobs and doing neither properly. It is split, and nothing is
lowered — a second axis is added.

| | Conditions | Asserts | Question it answers |
|---|---|---|---|
| **Desktop** | `preset: 'desktop'`, median of 3 | **Category scores.** Digital 100 performance, 100 accessibility, 100 SEO | *Is the craft claim honest?* A prospect deciding whether we can build their site runs Lighthouse on their own laptop. The score is the claim, so the score is the assertion |
| **Mobile** | 4G throttle, 4× CPU, median of 3 | **Core Web Vitals directly** — LCP, CLS, TBT. **Not** the performance category | *Does it hold on the device most people use?* Mobile carries most traffic at roughly half the conversion rate |

**The mobile axis does not assert the performance category on purpose.** It is a weighted
curve whose control points move between Lighthouse versions, so pinning it fails builds
for reasons no user experiences — a dependency bump re-scoring an unchanged page is not a
regression. The Vitals are the quantities these gates actually name, they are stable
across versions, and a failure in one points at a specific thing to fix.

**Throttling method is load-bearing on the mobile axis.** It uses `devtools` (real
throttling), not Lighthouse's default `simulate` (Lantern). Lantern estimates LCP as gated
on the resources the LCP element depends on, and for text with `font-display: swap` it
adds the webfont fetch to the estimate even though swap means the text has already
painted. Measured on `/digital`, median of 3, identical 4G profile:

| Method | FCP | LCP | Gap | Performance |
|---|---|---|---|---|
| `simulate` (Lantern) | 1363ms | 1896ms | 533ms | 0.99 |
| `devtools` (real) | 1441ms | **1441ms** | **0ms** | **1.00** |

The gap does not exist. Real Chrome paints the `h1` once and never re-reports, because
`next/font`'s fallback metrics (`size-adjust`, `ascent-override`) make the fallback paint
the final layout — which is also why CLS is 0. Asserting the simulated number would fail
builds for a delay no visitor experiences and send someone optimising an artefact.

### ⚠ Open risk against Stage 3 — every LCP budget in the programme is suspect

An **empty** page — one `h1`, 425 B of route JS, no image — measures **1441ms LCP** under
real 4G throttling. Digital's budget is 1600ms. That leaves roughly 160ms of headroom
before any real content exists, and Stage 3 pages carry hero imagery, work grids and book
covers, all of which produce a larger and later LCP element than a text node.

The floor is structural: TTFB plus three render-blocking stylesheets plus first paint. It
is not a feature overrun and it will not be optimised away by cutting a component.

**This is not Digital's problem alone.** Master's 1800ms and Design's and Press's 2000ms
sit on the same floor and were set, like Digital's, against desktop numbers that were
never the measurement these gates specify. Treat every LCP budget in `CLAUDE.md` as
unvalidated until a page with real content has been measured on the mobile axis. Raise it
at the first Stage 3 route rather than at `H-01`, when the fix would be cutting a page
feature to pay for a floor.

Recorded as `Q-M16`. The ceilings in `lighthouse/routes.cjs` are provisional.

---

No division ships without all of these green:

1. Lighthouse ≥95 performance / ≥100 accessibility / ≥100 SEO on every template — **desktop axis**
2. LCP ≤2.0s, CLS ≤0.05 on 4G throttle — **mobile axis**, asserted directly.
   **INP is not assertable in CI**: it is a field metric and a Lighthouse navigation run
   does not produce one. TBT is the lab proxy, set to each route's INP budget. Real INP
   comes from field data once there is traffic — `01-VALIDATION-REPORT.md` §11
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
