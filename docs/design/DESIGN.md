# Design Spec — Gridsmith Design

Inherits `_shared/00-FOUNDATION.md` §3. This file defines the Design division theme only.

---

## 1. Art direction

**Concept: the precision instrument.**

The division sells both expressive brand work and exacting technical drawings. The unifying idea is not "creative" and not "engineering" — it is **precision as a craft**. The interface is built like a drawing sheet: a visible grid, hairline rules, title-block metadata, revision marks, coordinate labels. Expressive work is displayed *inside* that rigour, which makes the brand work look more considered and the technical work look less dry.

Dark canvas. Work is the light source. This is the only one of the three divisions on dark, because it is the only one whose primary content is imagery.

**Reference register:** technical drawing sheets, Braun/Rams product documentation, film title-sequence typography, architectural portfolio monographs.
**Explicitly not:** gradient meshes, glassmorphism, floating 3D blobs, generic "creative agency" energy.

## 2. Theme tokens

```css
[data-division="design"] {
  --canvas:         #0C0C0D;
  --canvas-raised:  #151517;
  --canvas-sunken:  #060607;

  --ink:            #F5F5F4;
  --ink-muted:      #A1A1A0;
  --ink-subtle:     #818180;   /* was #6B6B6A — 3.67:1, failed AA. See below */

  --accent:         #E8A33D;   /* amber — drafting pencil, warning tape */
  --accent-hover:   #F2B75C;
  --accent-ink:     #0C0C0D;

  --line:           #262628;
  --line-strong:    #3A3A3D;

  --font-display:   "Neue Haas Grotesk Display", "Inter Display", system-ui, sans-serif;
  --font-body:      "Inter", system-ui, sans-serif;
  --font-mono:      "JetBrains Mono", ui-monospace, monospace;

  --radius-default: 0;   /* zero radius everywhere — R5 tactile brutalism */
}
```

**Contrast verification (WCAG 2.2 AA):**

| Pair | Measured | Pass |
|---|---|---|
| `--ink` on `--canvas` | 17.92:1 | AAA |
| `--ink-muted` on `--canvas` | 7.56:1 | AAA |
| `--ink-subtle` on `--canvas` | 5.01:1 | AA — **body text only at ≥16px; never for small print** |
| `--accent` on `--canvas` | 9.07:1 | AAA |
| `--accent` on `--canvas-raised` | 8.46:1 | AAA |
| `--accent-ink` on `--accent` | 9.07:1 | AAA |
| `--line-strong` on `--canvas` | 1.72:1 | **Decorative only — never a component boundary or a state** |

**Two corrections made at A-03, both from measurement.** This table previously carried
figures that were not achievable with these colours.

- **`--ink-subtle` was `#6B6B6A`, published as 4.6:1. It measured 3.67:1** — below the
  4.5:1 AA floor for the body text this table permits it on. Now `#818180` at **5.01:1**.
  Deliberately not the bare minimum: `#7A7A79` would have cleared AA by 0.05, which any
  later adjustment to `--canvas` would erase. `#818180` is the first value on this
  theme's neutral ramp (`R=G=x, B=x-1`, the pattern of `--ink` and `--ink-muted`) to
  clear 5.0:1. Approved under `Q-M13`.
- **`--line-strong` was published as 3.1:1 "AA for UI borders". It measures 1.72:1** and
  never met 3:1. Reclassified as decorative, consistent with the other three themes, whose
  equivalents sit at 1.59–1.74. **A component boundary or state indicator needs 3:1 under
  WCAG 1.4.11 and must use `--ink-subtle` (4.55:1) instead** — this constrains input
  outlines, selected states and focus rings on the Design theme.

## 3. Typography

| Role | Font | Size | Weight | Tracking | Leading |
|---|---|---|---|---|---|
| Display / hero | Display | `--text-4xl` | 500 | `-0.03em` | 1.02 |
| H1 | Display | `--text-3xl` | 500 | `-0.025em` | 1.05 |
| H2 | Display | `--text-2xl` | 500 | `-0.02em` | 1.1 |
| H3 | Display | `--text-xl` | 500 | `-0.01em` | 1.2 |
| Body | Body | `--text-base` | 400 | `0` | 1.6 |
| Lead | Body | `--text-lg` | 400 | `-0.01em` | 1.5 |
| **Eyebrow** | **Mono** | `--text-xs` | 500 | `0.12em`, uppercase | 1 |
| **Metadata / spec** | **Mono** | `--text-sm` | 400 | `0.02em` | 1.4 |
| Caption | Mono | `--text-xs` | 400 | `0.02em` | 1.4 |

The neo-grotesque + monospace pairing is the R5 premium signal. **Mono is used for every piece of factual metadata** — dates, dimensions, standards, revision numbers, project codes, prices. This is what makes the technical work feel native and the brand work feel rigorous.

Measure: `--measure-narrow` (52ch) for all body copy. Never full-width paragraphs on a dark canvas — it destroys readability.

## 4. Layout system

- 12-column grid, `--gutter` 24px mobile / 32px desktop, max `--container` 1280px
- **The grid is visible.** A 1px `--line` vertical rule at each column boundary, rendered at 25% opacity on section backgrounds. This is the drawing-sheet motif and the single strongest identity move.
- Section rhythm: `--space-24` mobile, `--space-32` desktop
- Asymmetry is preferred — content anchored to columns 1–7 or 6–12, rarely centred

### Title block
Every major section carries a monospace title block in its top-left, mirroring a drawing sheet:
```
SEC.03 / SERVICES                    REV. 2026.08
```
Small, `--ink-subtle`, mono, uppercase. Repeated consistently, this does more identity work than any logo placement.

## 5. Components

| Component | Specification |
|---|---|
| **Button (primary)** | `--accent` fill, `--accent-ink` text, 0 radius, `--space-4` / `--space-8` padding, mono uppercase `--text-sm` `0.08em`. Hover: `--accent-hover`, no transform. Focus: 2px `--ink` outline, 2px offset |
| **Button (secondary)** | Transparent, 1px **`--ink-subtle`** border, `--ink` text. Hover: border `--accent`, text `--accent`. Focus: 2px `--ink` outline, 2px offset. *Was `--line-strong`, which is 1.72:1 — a secondary button's border is what identifies it as a button, so it needs 3:1 under WCAG 1.4.11* |
| **Track fork panel** | Full-height split, 1px `--line-strong` divider. Hover/focus: background `--canvas-raised`, accent 2px top rule animates in from left, sibling drops to 40% opacity |
| **Work card** | Image (4:3), 0 radius, 1px `--line` border. Below: mono eyebrow (year · track), display title, `--ink-muted` one-liner. Hover: border → `--accent`, image scale 1.02, 400ms `--ease-out` |
| **Drawing matrix** | Real `<table>`. Header row: mono uppercase, `--canvas-raised` background, sticky on scroll. Cells: 1px `--line` borders, `--space-3` padding. Alternating row tint at 2% white. Mobile: horizontal scroll inside a bordered container with a visible scroll affordance and the first column pinned |
| **Standards strip** | Horizontal row of mono badges, 1px `--line-strong` border, `--space-2`/`--space-4` padding, 0 radius. No logos — wordmarks only |
| **Process step** | Numbered `01`–`05` in mono `--text-2xl` `--ink-subtle`, connected by a 1px vertical `--line` rule. Title in display, body in `--measure-narrow` |
| **Pricing table** | Mono for all figures. 1px grid. "From" prefix in `--ink-subtle` `--text-xs`. A `--accent` left rule marks the recommended tier |
| **Sticky mobile CTA** | Full-width, `--canvas-raised`, 1px top `--line-strong`, safe-area inset padding. Appears after 40% scroll depth |
| **Media** | 0 radius, 1px `--line` border, watermark baked in, `user-select: none`, context menu suppressed |

**`--line-strong` is decorative-only in this theme.** At 1.72:1 on `--canvas` it cannot
carry information. Anything that identifies a control or one of its states needs 3:1 under
WCAG 1.4.11 and must use **`--ink-subtle` (5.01:1)** instead. That covers input and select
borders, and any resting border that is the only thing marking a control as a control.

Two clarifications on what this does *not* change:

- **Button focus is unaffected** — it already specifies a 2px `--ink` outline at 2px
  offset, which is 17.92:1.
- **Genuinely decorative rules stay on `--line-strong`**: the track-fork divider, the
  sticky-CTA top rule, and card and media borders. None of them is the sole signal that
  something is interactive.

One component in the table above did need changing rather than just noting: **Button
(secondary)** specified a 1px `--line-strong` border as its resting state, and that border
is the only thing identifying it as a button. Moved to `--ink-subtle`. Raised rather than
applied silently, since it is a visible change to a component spec.

## 6. Motion

Transform and opacity only. No layout-animating properties.

| Interaction | Spec |
|---|---|
| Scroll reveal | `opacity 0→1`, `translateY 16px→0`, 500ms `--ease-out`, 60ms stagger, `IntersectionObserver` threshold 0.15, **fires once** |
| Card hover | 400ms `--ease-out` |
| Button hover | 150ms colour only |
| Page transition | 200ms cross-fade only. **No route-change loaders** — SSG pages arrive fast enough that a loader makes it feel slower |
| Track fork | 250ms panel raise + accent rule wipe |

All motion respects `prefers-reduced-motion` (base token file handles this globally).

**Prohibited:** parallax, scroll-jacking, cursor followers, animated counters, marquee text on content sections, entrance animations on above-the-fold content (delays LCP).

## 7. Imagery

- Track A: full-bleed, high-saturation, work speaks
- Track B: drawings shown as **drawing sheets** — cropped to show title blocks, dimension lines, annotation. Do not crop these into "pretty abstract details"; the technical buyer wants to see whether the drafting is competent
- Every image: explicit `width`/`height`, AVIF, `alt` written for meaning not decoration
- No stock photography anywhere. If there is no real image, use type and grid instead

## 8. Iconography

Line icons only, 1.5px stroke, 24px grid, `currentColor`. Lucide as base set. No filled icons, no duotone, no illustration style.

## 9. Do / Don't

| Do | Don't |
|---|---|
| Use mono for every number and standard | Use mono for body copy |
| Keep radius at 0 | Introduce rounded cards "to soften it" |
| Let the grid show | Add decorative gradients or glows |
| Show real drawings with their title blocks | Abstract technical work into texture |
| Keep sections wide, text narrow | Set paragraphs full-bleed on dark |
| Use one accent | Introduce a second accent for Track A |
| Animate opacity and transform | Animate height, width, or scroll position |
