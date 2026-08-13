# Accessibility audit — WCAG 2.2 AA

**Date:** 13 August 2026 · **Branch:** `feat/a-01-a-10a-scaffold-ci` · **Agent:**
`accessibility-audit`, read-only, fresh context, run alone.

This is the A-GATE criterion 6 run. It is deliberately split into **two narrow runs**
rather than one wide one, because four previous attempts died on scope rather than on
session budget: run 1 is the primitive layer, run 2 is the served routes and render
paths. Neither run may audit the other's subject.

**Nothing here is fixed.** The agent was instructed not to propose diffs. This file is
the record of what was found; what is done about each finding belongs in
`01-VALIDATION-REPORT.md`, as with `06-EPIC-A-AUDIT.md`.

---

## Run 1 — the primitive layer

**Scope:** the primitives in `components/primitives/` only, across all four themes,
against WCAG 2.2 AA and `docs/{master,design,digital,press}/DESIGN.md` §2 and §5. Routes,
render paths, gates and the kitchen sink page were explicitly excluded.

**Sources read:** all files in `components/primitives/`, `styles/tokens.css`, the four
theme files, and §2 + §5 of the four `DESIGN.md` files.

**Count correction: 24 primitives, not 23** — plus 5 co-located CSS modules (`structure`,
`content`, `interactive`, `states`, `motion`). 29 files read in full.

**Every contrast ratio below was recomputed from the resolved hex values.** No published
figure in any `DESIGN.md` was trusted, per the CLAUDE.md rule that a measurable number is
unverified until a gate measures it.

### Findings

| Severity | WCAG SC | file:line | Spec requires | Code does |
|---|---|---|---|---|
| Major | 2.4.7 Focus Visible | `components/primitives/Tabs.tsx:95-96` + `components/primitives/interactive.module.css:141` | A focusable element must have a visible focus indicator; the codebase's own treatment is `.focusable` (`interactive.module.css:14`) | The tabpanel takes `tabIndex={0}` when it holds nothing focusable, but is given `styles.tabpanel` only — `.tabpanel { padding-block-start: var(--space-6); }` and nothing else. No `.focusable`, no `:focus-visible` rule anywhere for it. This is the identical defect `Table.tsx:11-14` documents having fixed, and its claim "it was the one focusable element in the primitive layer drawing no focus ring" is false |
| Major | 1.4.3 Contrast (Minimum) | `components/primitives/content.module.css:166` | 4.5:1 for text under 18.66px | `.pageEllipsis { color: var(--ink-subtle) }` at `--text-sm` (14–15px) with no pinned background. On `--canvas-sunken` — reachable via `Section surface="sunken"` (`Section.tsx:15`, `structure.module.css:27`) — computed: **master 4.39:1, digital 4.35:1, press 4.18:1** (design 5.19:1 passes). `states.module.css:27-29` already records this exact restriction for `--ink-subtle`; it was not applied here |
| Major | 1.4.3 Contrast (Minimum) | `components/primitives/content.module.css:119-122` | 4.5:1 for text under 18.66px | `.breadcrumbList li + li::before { content: '/'; color: var(--ink-subtle) }` at `--text-xs` (12–13px), unpinned background. Same computed failures on `--canvas-sunken`: **master 4.39:1, digital 4.35:1, press 4.18:1** |
| Major | 1.4.3 / press DESIGN.md §2:51, §2:62 | `components/primitives/content.module.css:108, 121, 166` and `interactive.module.css:69` | press §2:51 — `--ink-subtle` is "17px minimum, never below"; §2:62 "genuinely not negotiable" (it clears AA by 0.06 at 4.56:1 on `--canvas`) | Three `--ink-subtle` text uses sit below 17px under the Press theme: breadcrumb separator at `--text-xs` (12.0px at 375px), `.pageEllipsis` at `--text-sm` (14.0px), `.control::placeholder` at `--text-base` (16.08px at 375px; reaches 17px only at ≥1440px). No theme override raises them |
| Major | 2.4.7 Focus Visible, 1.4.3 | `components/primitives/Breadcrumb.tsx:33` + `content.module.css:108-123` | Every interactive element in this layer receives `.focusable` (Button:22, Link:26, Field:50, Select:60, RadioGroup:75, Accordion:49, Tabs:78, Table:32) or an explicit rule (`.page:focus-visible`, content.module.css:150) | `<Link href={item.href}>{item.label}</Link>` — no `className` at all, and `content.module.css` declares no `.breadcrumb a` / `.breadcrumbList a` rule. Breadcrumb links are the only interactive elements in the primitive layer whose colour and focus ring are not defined by the primitive layer |
| Major | 1.3.1 Info and Relationships (F2) | `components/primitives/EmptyState.tsx:24`, `components/primitives/ErrorState.tsx:32` + `states.module.css:16-20` | 1.3.1 — text presented as a heading must be marked up as one | `<p className={styles.title}>` where `.title` is `--font-display` at `--text-lg`, sitting above body prose in a bordered panel. Neither component takes a heading-level prop, so a caller cannot correct it. A keyboard/screen-reader user navigating by headings passes straight over an empty-results state |
| Major | 3.3.1 / 2.4.3 (API) | `components/primitives/Field.tsx:45`, `Select.tsx:35`, `RadioGroup.tsx:40` | Focus must be movable to the first invalid field, and an error summary must be able to link to it | `const id = useId()` is generated internally and never exposed — there is no `id` prop, no ref forwarding, no `...rest`. A caller cannot render `<a href="#…">` to a field from an error summary, nor call `.focus()` on the first invalid control. `FieldError` is exported and takes an `id`, so the summary half of the pattern exists and the target half does not |
| Major | 1.3.1 / 4.1.2 (API) | `components/primitives/Container.tsx:12-22` | Two `nav` landmarks on one page must be distinguishable (`Breadcrumb.tsx:17` and `Pagination.tsx:27` both take an overridable `label` for exactly this reason) | `as` accepts `'nav' \| 'main' \| 'header' \| 'footer'` (line 19) but the prop type is only `width`, `as`, `className`, `children` — no `aria-label`, no `aria-labelledby`, no `id`, no rest spread. A `<nav>` or a duplicate `<header>` rendered through Container cannot be named; a `<main>` cannot be given a skip-link target |
| Major | press DESIGN.md §5:100 (a11y impact) | `components/primitives/content.module.css:32` | Press §5:100 — Book card carries "Retailer links as small underlined text" alongside the title | `.cardLinked :is(h1…h6) a::after { position: absolute; inset: 0 }`. The pseudo-element is positioned (`z-index: auto`), so it paints above non-positioned inline siblings: every other `<a>` or `<button>` in a `linked` card becomes unclickable by pointer while remaining in the tab order. The comment at lines 22-28 fixed which link wins the overlay but not that the overlay covers the others |
| Minor | 1.3.1 Info and Relationships | `content.module.css:117`, `content.module.css:133`, `interactive.module.css:143` | List semantics must survive styling | `list-style: none` on `.breadcrumbList`, `.paginationList` and `.stepper` with no `role="list"` on the `<ol>`. Safari/VoiceOver drops the list role and item count under `list-style-type: none` |
| Minor | 1.3.1 Info and Relationships | `components/primitives/Stepper.tsx:36` | A `nav` landmark identifies a set of navigation links | `<nav aria-label={label}>` wraps an `<ol>` of static `<span>`/`<p>` step markers. Stepper is documented as "presentational only" (line 7) and renders no links, so the landmark advertises navigation that is not there |
| Minor | 1.3.1 Info and Relationships | `components/primitives/Breadcrumb.tsx:28-31` | `aria-current="page"` marks the current page only | The branch is `isLast \|\| !item.href`, so a non-final crumb with no `href` renders with `styles.breadcrumbCurrent` — visually identical to the current page — but no `aria-current`. Visual and programmatic state disagree |
| Minor | 2.4.7 Focus Visible | `components/primitives/structure.module.css:44-48` | `.focusable:focus-visible` (interactive.module.css:14) is "one focus treatment for the whole system" | `.prose a` sets colour and underline but there is no `.prose a:focus-visible` rule, and Prose children come from portable text so they cannot carry `.focusable` (Prose.tsx:5-6). All long-form links fall back to the UA ring — visible, but outside the system's treatment |
| Minor | press DESIGN.md §5:98 | `components/primitives/interactive.module.css:26, 29, 30` | Press §5:98 — primary button is "serif `--text-base` weight 500, sentence case. Not uppercase — uppercase buttons read as sales pressure in this context" | `.button` is `font-family: var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase` unconditionally, with no override in `styles/themes/press.css`. Press buttons render mono uppercase. (`0.08em` is also Design's value applied globally; digital §5:106 asks for `0.06em`) |
| Minor | 1.4.11 Non-text Contrast | `components/primitives/content.module.css:30` | Card hover is a visible affordance | `.cardLinked:hover { border-color: var(--line-strong) }`, changing from `--line`. Computed delta between the two border colours: **master 1.38:1, design 1.33:1, digital 1.30:1, press 1.33:1** — the hover feedback is imperceptible. Not an SC failure (hover is not a required state indicator) but the declaration does nothing |
| Minor | 4.1.2 Name, Role, Value | `components/primitives/RadioGroup.tsx:49` | ARIA 1.2 removed `aria-invalid` from the global properties; `role="group"` (the mapping for `<fieldset>`) does not support it | `aria-invalid={error ? true : undefined}` on the `<fieldset>`. The error still reaches AT via `aria-describedby` (line 48), so nothing is lost, but the attribute is inert and may trip `aria-allowed-attr` |
| Minor | 4.1.2 Name, Role, Value | `components/primitives/RadioGroup.tsx:74, 79-83` | An option's hint should be announced once | The hint `<span id={`${id}-hint`}>` is nested inside the `<label>`, so it is part of the computed accessible name, and the input also carries `aria-describedby` pointing at the same node — the hint is announced twice, once as name and once as description |
| Minor | — (leak, no SC) | `components/primitives/StickyCta.tsx:82, 99-103` | The `--sticky-cta-block-size` reserve exists so a control near the foot is not scrolled under the bar (2.4.11) | `document.documentElement.style.setProperty(RESERVE_VAR, …)` is never removed. The `useEffect` cleanup detaches listeners and cancels the frame but leaves the custom property set, so the scroll reserve persists on any route where StickyCta has unmounted |
| Info | 2.4.7 / 2.4.11 | `components/primitives/motion.module.css:50-52` | — | `transition: … visibility var(--dur-base)` — on the visible→hidden direction CSS holds `visibility: visible` until 100% progress, so for 250ms the bar is `translateY(100%)` (off-viewport, `position: fixed`, unscrollable-to) yet still focusable. Transient and neutralised under `prefers-reduced-motion` by tokens.css:51-58 |
| Info | 1.4.3 Contrast (Minimum) | `components/primitives/interactive.module.css:46`, `structure.module.css:45` | 4.5:1 | Tightest passing margin in the system: `.link` / `.prose a` use `--accent`, which on Digital computes **4.87:1 on `--canvas`, 5.09:1 on `--canvas-raised`, 4.58:1 on `--canvas-sunken`**. The sunken case clears AA by 0.08. digital/DESIGN.md §2:60 already states the accent has no headroom; any surface change breaks this |
| Info | master DESIGN.md §5:108 | `components/primitives/Badge.tsx:19` | Master §5:108 — "Division badge: … 1px border in the division accent, `--ink` text on `--canvas`" | `tone?: 'default' \| 'accent'` resolves only to `--accent`, which on master is ink (`master.css:20`). `--accent-design` / `--accent-digital` / `--accent-press` (master.css:42-44) are unreachable through this primitive |
| Info | digital §5:107, press §5:99 | `components/primitives/interactive.module.css:41` | Digital §5:107 and press §5:99 both specify a `1px --line-strong` border and `--canvas-raised` fill for the secondary button | Code uses `border-color: var(--ink-subtle)` and `background: transparent`. The border change is **correct** — computed `--line-strong`: master 1.74/1.66/1.58, design 1.72/1.61/1.79, digital 1.59/1.66/1.49, press 1.69/1.78/1.55 on canvas/raised/sunken, none reaching 3:1 for 1.4.11. Only design/DESIGN.md §5:109 was updated; the digital and press tables are stale and per CLAUDE.md should have moved in the same commit |
| Info | 4.1.2 Name, Role, Value | `components/primitives/Table.tsx:34-38` | — | `caption` is used both as `aria-label` on the `role="region"` wrapper and as the `<caption>`, so the name is announced twice ("region, X" then "table, X"). Also `tabIndex={0}` is unconditional (documented at lines 16-17), adding a tab stop on tables that do not overflow |
| Info | 4.1.3 / 3.3.1 | `components/primitives/ErrorState.tsx:17` | The docstring (lines 5-7) says `announce={false}` is for content present at initial render | The default is `announce = true`, so the riskier case — a permanently-present `role="alert"` — is what a caller gets by omitting the prop |

### Unverified

Suspected but not confirmable from the files in scope. Each line states exactly what
would confirm it.

- `.sr-only` is used at `Link.tsx:34`, `Stepper.tsx:52` and `Table.tsx:38` but is defined
  nowhere in `components/primitives/` or the token/theme files. If it is missing or
  incorrectly implemented, the external-link suffix, the step prefixes and hidden captions
  render visibly. **Confirmed by** grepping `styles/globals.css` for `.sr-only`.
- 2.4.11 Focus Not Obscured for StickyCta depends on a
  `scroll-padding-block-end: var(--sticky-cta-block-size)` declaration that
  `StickyCta.tsx:65-67` says lives in `globals.css`. **Confirmed by** reading that rule in
  `styles/globals.css`.
- Breadcrumb link contrast per theme depends on whatever `globals.css` sets for a bare
  `<a>`. **Confirmed by** reading the base `a` rule; on the Design theme (`--canvas`
  `#0C0C0D`) a UA-default `#0000EE` would compute ≈1.29:1.
- **`axe` was not run.** It needs a rendered page, and every route, layout and the kitchen
  sink page are out of scope for this run. No raw axe output is included. Run 2 covers the
  rendered surface.

### Clean — no findings

9 of 24: Accordion · Button · Eyebrow · Grid · Heading · Link · Media · RevealOnScroll ·
Section.

### Result

**Not zero violations.** 10 Major, 8 Minor, 5 Info across 15 of the 24 primitives.
A-GATE criterion 6 is not met by this run.

---

## Run 2 — the served routes and render paths

**Scope:** `/`, `/design`, `/digital`, `/press`, `/_not-found` and `app/global-error.tsx`
only — landmarks, headings, `lang`, focus order, skip link, keyboard operability, plus
2.4.11, 3.2.6 and 2.1.4 where applicable. The primitives were explicitly excluded; where a
route defect originates inside a primitive it is left to run 1.

### Render chains — enumerated, not assumed

There is **no `app/layout.tsx`**. Each route group owns a root layout; `not-found` and
`global-error` supply their own document. `components/chrome/` contains exactly one file.
**`components/divisions/` does not exist.** No header, nav, footer, consent banner or
division switcher exists yet — the repository shape in CLAUDE.md describes the target, not
the tree.

| Route | Chain |
|---|---|
| `/` | `app/(marketing)/layout.tsx` → `components/chrome/RootShell.tsx` (`<html>`/`<body>`) → `app/(marketing)/page.tsx` → `components/primitives/Heading.tsx` |
| `/design` | `app/(design)/layout.tsx` → `RootShell.tsx` → `app/(design)/design/page.tsx` → `Heading` |
| `/digital` | `app/(digital)/layout.tsx` → `RootShell.tsx` → `app/(digital)/digital/page.tsx` → `Heading` |
| `/press` | `app/(press)/layout.tsx` → `RootShell.tsx` → `app/(press)/press/page.tsx` → `Heading` |
| `/_not-found` | `app/not-found.tsx` (own root, no group layout) → `RootShell.tsx` → `Container` / `Section` / `Heading` / `Prose` |
| error state | `app/global-error.tsx` — standalone, own `<html lang>`/`<body>`, raw elements, no stylesheet |

No `middleware.ts`, no `template.tsx`, no `error.tsx`, no `loading.tsx`, no `default.tsx`.
`next.config.ts` adds only redirects.

### axe — raw output

Run against the **prerendered HTML** in `.next/server/app/*.html` over `file://` with
`/_next/*` rewritten to disk so the real built CSS applied. No server. `global-error` has
no prerendered HTML (client boundary), so its markup was transcribed verbatim from source
and is labelled as such.

```
ROUTE: /          axe passes: 24 | incomplete: 1 | VIOLATIONS: 0    INCOMPLETE: color-contrast (1 nodes) h1
ROUTE: /design    axe passes: 24 | incomplete: 1 | VIOLATIONS: 0    INCOMPLETE: color-contrast (1 nodes) h1
ROUTE: /digital   axe passes: 24 | incomplete: 1 | VIOLATIONS: 0    INCOMPLETE: color-contrast (1 nodes) h1
ROUTE: /press     axe passes: 24 | incomplete: 1 | VIOLATIONS: 0    INCOMPLETE: color-contrast (1 nodes) h1
ROUTE: /_not-found                    axe passes: 28 | incomplete: 0 | VIOLATIONS: 0
ROUTE: app/global-error.tsx (TRANSCRIBED from source, not build output)
  axe passes: 15 | incomplete: 0 | VIOLATIONS: 1
  [serious] document-title - Documents must have <title> element to aid in navigation (wcag2a,wcag242)
      html :: Fix any of the following: |   Document does not have a non-empty <title> element

=== TOTAL AXE VIOLATIONS ACROSS ALL SURFACES: 1 ===
```

DOM facts confirmed on every surface: `htmlElementCount: 1`, `lang: "en-GB"`,
`mainCount: 1`, exactly one `h1`, `headingOrder: ["H1"]`, `landmarks: ["MAIN"]`,
`positiveTabindex: 0`, `textOutsideLandmark: []`. `/_not-found` merges its two raw
`<html>`/`<body>` start tags to one element as its source comment claims — verified,
`division: "master"`, `title: "Page not found — Gridsmith Ltd"`.

### Findings

| Severity | WCAG SC | file:line | Spec requires | Code does |
|---|---|---|---|---|
| Major | 2.4.2 Page Titled (A) | `app/global-error.tsx:41` | The error document, which replaces the root layout, carries a title describing its topic or purpose | Renders `<html lang="en-GB"><body>` with no `<title>`, and `'use client'` (line 1) forbids a `metadata` export, so the file has no way to set one. axe: `document-title`, serious. Best case Next leaves the crashed route's stale title, which does not describe "Something went wrong" |
| Major | 2.4.7 Focus Visible (AA) | `app/not-found.tsx:9` | `import '@/styles/globals.css'` puts tokens, all four themes and the global rules on `/_not-found`; the file's own comment (lines 26–29) states it "imports RootShell, the fonts and globals.css directly instead of inheriting them" | The build emits **one** stylesheet link for that route — `540c4a…css`, the CSS-modules chunk. `7c37b5…css` (tokens + themes + globals) and `081a0af…css` (fonts) are absent from the file entirely (grep count 0, including the flight payload). `--ink` is therefore undefined, so `outline: 2px solid var(--ink)` is invalid at computed-value time and resolves to `initial`. Measured on a probe element: `/` → `outlineStyle: "solid", 2px, rgb(15,15,15)`; `/_not-found` → **`outlineStyle: "none"`** — the invalid declaration also destroys the UA default ring. No SC fails on today's two paragraphs; any primitive placed there loses its focus indicator outright, and `M-07` is slated to add content |
| Minor | 2.2.2 support / 1.3.1 (A) | `styles/tokens.css:51`, `styles/globals.css:66` | The global `@media (prefers-reduced-motion: reduce)` reset and the `.sr-only` utility apply on every served route | Both live in `7c37b5…css`, which `/_not-found` does not load. Same root cause as the row above. Nothing animates and nothing uses `.sr-only` there today, so no current failure — but the site's only reduced-motion implementation and its only visually-hidden-text utility are silently off on a served route |
| Minor | 1.4.3 (AA) / 1.3.1 (A) presentation | `app/not-found.tsx:55` | `Heading level={1}` renders at `--text-2xl` (52px measured on `/`) | Renders at **16px**, identical to body text, because `--text-2xl` is undefined. `Section`/`Container` padding collapses to 0. Semantics are intact so no SC fails; the visual heading cue is gone. Same root cause |
| Info | 2.4.7 Focus Visible (AA) | `app/not-found.tsx:70` | — | The raw `<a href="/">` carries no author focus style (`.prose a`, in a primitive stylesheet, sets colour and underline only). It passes on the UA ring — measured `outlineStyle: "auto", rgb(16,16,16)`. Given the row above, that UA ring is the only thing keeping 2.4.7 alive on this route |
| Info | 3.1.1 Language of Page (A) | `app/not-found.tsx:33-37` | — | `lang="en-GB"` is correct, but only because Next's outer error shell emits `<html>` with **no** `lang`, letting the parser merge the inner attributes on. If Next ever emits `lang` on that shell, the merge keeps Next's value and the route silently loses `en-GB`. Verified correct today (`documentElement.lang === "en-GB"`) |
| Info | 2.4.1 Bypass Blocks (A) | `components/chrome/RootShell.tsx:25-26` | A skip link, per the brief | None exists (only reference is the "Epic M adds the skip link" comment at line 12). **Not a failure**: no header, nav or footer exists, so there is no repeated block to bypass. Becomes a Blocker the moment chrome lands |

### Coverage grid

```
/            — landmarks ✓ / headings ✓ / lang ✓ / focus order ✓ (0 tabbables) / skip link n/a / keyboard n/a
/design      — landmarks ✓ / headings ✓ / lang ✓ / focus order ✓ (0 tabbables) / skip link n/a / keyboard n/a
/digital     — landmarks ✓ / headings ✓ / lang ✓ / focus order ✓ (0 tabbables) / skip link n/a / keyboard n/a
/press       — landmarks ✓ / headings ✓ / lang ✓ / focus order ✓ (0 tabbables) / skip link n/a / keyboard n/a
/_not-found  — landmarks ✓ / headings ✓ / lang ✓ (Info row) / focus order ✓ (1 tabbable) / skip link n/a / keyboard ✓ (Major row: focus indicator)
global-error — landmarks ✓ / headings ✓ / lang ✓ / focus order ✓ (1 tabbable) / skip link n/a / keyboard ✓
```

`n/a` for skip link and keyboard means no repeated block and no interactive chrome exists
yet — **not** that the check was skipped. 2.4.11 Focus Not Obscured: n/a, no fixed or
sticky element renders on any of the six. 3.2.6 Consistent Help: n/a, no help affordance.
2.1.4 Character Key Shortcuts: n/a, no key handlers in any render path.

### Unverified

- **Whether Next injects a `<title>` when `global-error` renders server-side.** Confirm by
  forcing a throw in a route-group layout, running `next build && next start`, and reading
  `document.title` at the error document. If it inherits the crashed route's title the row
  stays Major (wrong title, 2.4.2); if it is empty it is a Blocker.
- **`color-contrast` incomplete on the `h1` of all four themed routes.** axe could not
  resolve a background. Confirm by running `check:contrast`, or by sampling the rendered
  pixel — out of this run's scope, and `check:contrast` covers the token pairs.

### Why the stylesheet defect is invisible to the gate

`scripts/check-axe.mjs:137-138` asserts `document.body.dataset.division` and, when it is
missing, reports *"this page renders with no theme"*. On `/_not-found` the attribute **is**
present — `RootShell.tsx:26` writes it — so the gate is green while the page renders with
no theme, because the stylesheet that gives `[data-division]` any meaning is never linked.
The assertion tests the attribute, not the computed style.

That is exactly the "green result from a check that measured nothing" pattern CLAUDE.md
names, and it is the fourth of that class. The source comment at `app/not-found.tsx:33-37`
records the four checks that pass straight through it.

### Result

**Not zero violations.** One axe violation (2.4.2 on the error boundary) plus one
demonstrated render-path defect that removes the focus ring, the reduced-motion reset,
`.sr-only` and the type scale from a served route. A-GATE criterion 6 is not met by this
run either.
