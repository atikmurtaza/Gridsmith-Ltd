# Design Spec — Gridsmith Digital

Inherits `_shared/00-FOUNDATION.md` §3. Digital theme only.

---

## 1. Art direction

**Concept: engineered clarity.**

Digital sells software. The interface must read as *built*, not *decorated*. Light canvas, near-black ink, one saturated blue used sparingly as a signal. Monospace carries structural weight — labels, data, prices, stack names. Layout is exposed and systematic: visible column rules, 1px borders, no ornament.

The site is the primary case study (R4.6, persona P4). Every decision optimises for a technical evaluator opening devtools. That means: minimal DOM, no unnecessary wrappers, semantic markup, and a visual result that looks considered rather than expensive.

**Reference register:** technical documentation done well, Swiss grid systems, terminal interfaces, engineering spec sheets, Linear and Vercel's restraint without their homogeneity.
**Explicitly not:** gradient hero blobs, floating 3D shapes, "AI purple", glassmorphism, isometric illustrations of people using laptops.

## 2. Theme tokens

```css
[data-division="digital"] {
  --canvas:         #FAFAF9;
  --canvas-raised:  #FFFFFF;
  --canvas-sunken:  #F0F0EE;

  --ink:            #0A0A0A;
  --ink-muted:      #52525B;
  --ink-subtle:     #686871;   /* was #71717A — see §2 */

  --accent:         #1B5FFF;
  --accent-hover:   #0E4BE0;
  --accent-2:       #0033AA;   /* the second colour surface — navy */
  --accent-ink:     #FFFFFF;

  --line:           #E4E4E2;
  --line-strong:    #C9C9C6;

  --font-display:   "GT America Mono", "JetBrains Mono", ui-monospace, monospace;
  --font-body:      "Inter", system-ui, sans-serif;
  --font-mono:      "JetBrains Mono", ui-monospace, monospace;

  --radius-default: 2px;
}
```

**Contrast verification (WCAG 2.2 AA):**

| Pair | Measured | Pass |
|---|---|---|
| `--ink` on `--canvas` | 18.96:1 | AAA |
| `--ink-muted` on `--canvas` | 7.40:1 | AAA |
| `--ink-subtle` on `--canvas` | 5.28:1 | AA at any size |
| `--accent` on `--canvas` | 4.87:1 | AA (AAA for large) |
| `--accent` on `--canvas-raised` | 5.09:1 | AA |
| `--accent-ink` on `--accent` | 5.09:1 | AA |
| `--line-strong` on `--canvas` | 1.59:1 | **Decorative borders only — never a sole information carrier** |

**The accent rows were materially overstated** and were corrected at A-03 from
measurement. Electric blue `#1B5FFF` gives 4.87:1 on the canvas, not 6.8:1, and white on
blue gives 5.09:1, not 7.0:1. Every row still passes AA, but the accent clears the 4.5:1
floor by 0.37 rather than by 2.3. **Treat the accent as having no contrast headroom**: it
cannot be darkened toward the canvas, and `--accent-hover` `#0E4BE0` must stay at least as
dark as it is.

The last row is a real constraint: `--line-strong` cannot be used to indicate state (e.g. a selected estimator option) without a second, non-colour cue.

## 3. Typography

Digital is the one division where **the display face is monospace**. This is the identity move — headings that read as code, body that reads as prose.

| Role | Font | Size | Weight | Tracking | Leading |
|---|---|---|---|---|---|
| Display / hero | Mono | `--text-3xl` | 500 | `-0.02em` | 1.08 |
| H1 | Mono | `--text-2xl` | 500 | `-0.015em` | 1.12 |
| H2 | Mono | `--text-xl` | 500 | `-0.01em` | 1.2 |
| H3 | Body (Inter) | `--text-lg` | 600 | `-0.01em` | 1.3 |
| Body | Body | `--text-base` | 400 | `0` | 1.6 |
| Lead | Body | `--text-lg` | 400 | `-0.01em` | 1.5 |
| Eyebrow | Mono | `--text-xs` | 500 | `0.1em` upper | 1 |
| Data / price | Mono | `--text-sm`→`--text-2xl` | 500 | `0` | 1.2 |
| Code | Mono | `--text-sm` | 400 | `0` | 1.6 |

Mono at display sizes is unforgiving — hero headlines must be short. **Hard limit: 6 words in any `--text-3xl` mono heading.** Longer headlines drop to Inter.

Measure: `--measure-narrow` (52ch) for body. Mono headings may run wider.

## 4. Layout system

- 12-column grid, visible 1px `--line` column rules on `--canvas-sunken` sections
- Content blocks are **bordered boxes**, 1px `--line`, 2px radius — the "spec sheet" motif
- Section rhythm `--space-24` / `--space-32`
- Frequent use of **two-column definition layouts**: mono label left, prose right. This is the dominant content pattern and should feel like reading good documentation.

### Data row
The recurring structural unit:
```
FRAMEWORK          Next.js 15         Chosen for SSG and route-level control
────────────────────────────────────────────────────────────────────────────
DATABASE           PostgreSQL         Your data, portable, no proprietary lock
```
Mono label · mono value · body rationale. Used on the stack page, pricing tables, estimator breakdown, and the ownership guarantee.

## 5. Components

| Component | Specification |
|---|---|
| **Button (primary)** | `--accent` fill, white text, 2px radius, mono uppercase `--text-sm` `0.06em`. Hover: `--accent-hover`. Focus: 2px `--ink` outline, 2px offset |
| **Button (secondary)** | 1px `--line-strong` border, `--ink` text, `--canvas-raised` fill. Hover: border `--accent`, text `--accent` |
| **Estimator step** | Full-width card, 1px `--line`, `--canvas-raised`. Progress rail above: 6 segments, filled `--accent`. Step number in mono `--ink-subtle` |
| **Estimator option** | Bordered tile. Selected: 2px `--accent` border **and** a filled check glyph **and** `--canvas-sunken` background — three cues, because `--line-strong` alone fails contrast (§2) |
| **Estimator result** | Large mono figures. Range shown as `£24,000 — £38,000` with an em dash, never a slash. Breakdown as data rows. "NOT INCLUDED" block at equal visual weight to the price, `--ink-muted`, 1px `--line-strong` top border |
| **Confidence indicator** | Three-segment bar + explicit word ("Medium confidence — this range will narrow after a Diagnostic"). Never a percentage — false precision |
| **Stack item** | Data row + expandable rationale. Logo optional and monochrome only |
| **Ownership guarantee** | Four bordered panels, each: mono heading, one-sentence commitment, the contract clause reference. Contract references make it verifiable rather than promotional |
| **Exclusion list** | Plain `<ul>`, mono bullets, `--ink-muted`. Deliberately undesigned — over-styling exclusions reads as spin |
| **Vitals badge** | Mono, three metrics with values and a timestamp. Hidden if stale |
| **Care tier card** | Includes and **excludes** in equal columns |
| **Sticky mobile bar** | Split [Estimate] 60% `--accent` / [Talk to us] 40% outline |

## 6. Motion

Minimal by doctrine. Digital's aesthetic argument is competence, and heavy motion undercuts it.

| Interaction | Spec |
|---|---|
| Scroll reveal | `opacity` only, 400ms, no translate. Digital reveals more quietly than Design |
| Estimator step transition | 200ms cross-fade + 8px translate. Height animated via `grid-template-rows` trick only — never `height: auto` transitions |
| Result reveal | 300ms fade, figure counts **not** animated |
| Button hover | 120ms colour |
| Data row expand | 200ms, `grid-template-rows` |

**Prohibited:** parallax, scroll-jacking, animated counters (especially on the price — it trivialises a serious number), typewriter effects, cursor followers.

## 7. Imagery

Digital uses very little imagery, deliberately.

- Product screenshots only — real interfaces from real work, in a plain browser frame, no floating device mockups on gradients
- Diagrams as SVG, drawn to the token system, never exported raster
- No photography of people. No stock. No office shots.
- Where an image would be decorative, use a data row or a diagram instead

## 8. Iconography

Lucide, 1.5px stroke, 20px and 24px only, `currentColor`. No filled variants.

## 9. Do / Don't

| Do | Don't |
|---|---|
| Use mono for headings, prices, labels, stack names | Use mono for paragraphs |
| Keep hero headlines to 6 words | Set long sentences in display mono |
| Show exclusions at equal weight to inclusions | Bury or style away the exclusions |
| Show real screenshots in plain frames | Use device mockups on gradient backgrounds |
| Say "Medium confidence" | Say "87% accurate" |
| Give selected states three cues | Rely on border colour alone |
| Let the site be the proof | Claim quality the site doesn't demonstrate |


### The colour surfaces — added with the palette work

| Pair | Measured | Pass |
|---|---|---|
| `--accent-ink` on `--accent` (primary surface) | 5.09:1 | AA |
| `--accent-ink` on `--accent-2` (secondary surface) | 10.22:1 | AA |

`--accent-2` is **#0033AA**, derived from `--accent` by a lightness shift at constant hue and
saturation. It carries `--accent-ink` (`#FFFFFF`) — one foreground clears AA on both surfaces,
measured, so there is no separate `--accent-2-ink`.

The division hero is a `--accent-2` band and the closing call-to-action is an `--accent`
band; the button on a band is `Button variant="inverse"`, because `.primary` there would be
the accent on its own second shade. Full published values: `docs/_shared/PALETTES.md`.
