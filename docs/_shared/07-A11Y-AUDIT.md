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

Pending.
