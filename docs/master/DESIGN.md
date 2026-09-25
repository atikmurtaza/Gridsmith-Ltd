# Design Spec — Gridsmith Master Layer

Inherits `_shared/00-FOUNDATION.md` §3. This file defines the master theme and the rules that keep three division identities reading as one company.

---

## 1. Art direction

**Concept: the neutral frame.**

The master layer is not a fourth aesthetic competing with the three divisions. It is the frame they hang in. Where the divisions are characterful — Design's dark drawing sheet, Digital's engineered light, Press's warm paper — the master layer is **quiet, structural and confident enough not to decorate**.

Its job is to make three different-looking sections feel like one company. It does that through **shared structure, not shared colour**: the same grid, the same spacing rhythm, the same type scale, the same component shapes. A visitor should register the change of voice between divisions and never doubt they are still on the same site.

The founder's brief for the brand is "innovative and institutionally trustworthy — not a flashy startup, not a traditional consultancy." The master layer is where that is decided, because it is the layer everyone sees.

**Reference register:** institutional annual reports done well, museum identity systems, Swiss corporate design, the restraint of a serious holding company.
**Explicitly not:** conglomerate stock imagery, handshake photography, abstract network graphics, "innovation" gradients, hero video of an office.

## 2. Theme tokens

```css
[data-division="master"] {
  --canvas:         #FFFFFF;
  --canvas-raised:  #FAFAF9;
  --canvas-sunken:  #F4F4F2;

  --ink:            #0F0F0F;
  --ink-muted:      #52525B;
  --ink-subtle:     #686871;   /* was #71717A — see §2 */

  --accent:         #0F0F0F;   /* the master accent is ink — deliberate */
  --accent-hover:   #2A2A2A;
  --accent-2:       #3A3A3A;   /* the second colour surface — a lightness pair here */
  --accent-ink:     #FFFFFF;

  --line:           #E7E5E4;
  --line-strong:    #C7C4C1;

  --font-display:   "Neue Haas Grotesk Display", "Inter Display", system-ui, sans-serif;
  --font-body:      "Inter", system-ui, sans-serif;
  --font-mono:      "JetBrains Mono", ui-monospace, monospace;

  --radius-default: 2px;

  /* Division accents — used ONLY on division-referencing elements.
     Each now carries the foreground it takes when used as a FILL rather than a rule. */
  --accent-design:  #E8A33D;  --accent-design-ink:  #0C0C0D;
  --accent-digital: #35718A;  --accent-digital-ink: #FFFFFF;   /* GS-DIG-001-RC; was #1B5FFF */
  --accent-press:   #2E4A3A;  --accent-press-ink:   #FBF9F4;
}
```

**The master layer has no colour of its own.** Its accent is ink. This is the central identity decision: if the master brand claimed a fourth colour, the three divisions would become sub-brands of a fourth brand. With ink as the accent, the divisions supply the colour and the master supplies the structure — which is exactly the commercial relationship.

**(`GS-R001-M`: the routing cards no longer exist — `/` carries no division colour at all, and the paragraph below is kept as history.)** Division accents appear at master level in only three places: division routing cards, division badges on work cards, and the footer division switcher. **On the routing cards they are now a filled block rather than a 3px rule**, with `--accent-*-ink` as the foreground — see `docs/_shared/PALETTES.md`. The amber constraint is unchanged: it says the accent may never be a *foreground*, which is what 2.16:1 on white means, and it says nothing about the accent as a *surface*, where the same colour measures 9.07:1.

**Contrast verification:**

| Pair | Measured | Pass |
|---|---|---|
| `--ink` on `--canvas` | 19.17:1 | AAA |
| `--ink-muted` on `--canvas` | 7.73:1 | AAA |
| `--ink-subtle` on `--canvas` | 5.52:1 | AA at any size |
| `--accent-ink` on `--accent` | 19.17:1 | AAA |
| `--accent-design` on `--canvas` | 2.16:1 | **Decorative rules and badges only. Never text, never a sole state indicator** |
| `--accent-digital` on `--canvas` | 5.41:1 | AA **as a ratio; the role is decorative.** Division colour appears as a rule or a 1px badge border, never as text — §5, and the same constraint as the amber. All three accents are declared by every theme from V3, and two of them do not clear AA on Design's near-black canvas |
| `--accent-press` on `--canvas` | 9.74:1 | AAA **as a ratio; the role is decorative** — see the row above |
| `--line-strong` on `--canvas` | 1.74:1 | Decorative borders only |

Measured at A-03 by `scripts/check-contrast.mjs`, which recomputes these from the theme
files on every CI run. Six of the eight figures above were wrong in the original table —
none changed a verdict. `--accent-digital` is the one worth noting: 5.09:1 rather than the
6.5:1 published, still AA but with less headroom than the number implied. **GS-DIG-001-RC:**
the shared Digital accent is now the current Digital signal `#35718A` (5.41:1, and 5.41:1 under
`--accent-digital-ink`), replacing the retired electric blue on every theme. Its only rendered use
is the footer division switcher's Digital rule.

The amber row is a real constraint. Design's accent works on its own dark canvas and fails on the master's white one. On master pages it may be a 2–3px rule or a badge background (with `--ink` text on it), never coloured text and never the only signal of a state.

### 2.1 The Master stage — `/` only (`GS-R001-M`)

**⚠ Owner decision, `GS-O008`.** The owner rejected the homepage and one limb was colour: the
"neutral frame" produced a white page of three coloured boxes and did not express Gridsmith's
own colour, which is the **polished gold of the mark**. The homepage now carries a stage palette
derived from `public/brand/gridsmith-logo.svg` — `styles/themes/master-stage.css`, applied through
`[data-stage="master"]`, which only `app/(marketing)/page.tsx` renders. Every other Master route
keeps the §2 tokens above, unchanged. `GS-R001-M-MASTER-REDESIGN.md` §4.2 gives each value's
source stop.

| Pair | Measured | Pass |
|---|---|---|
| `--ink` on `--canvas` | 17.19:1 | AAA |
| `--ink-muted` on `--canvas` | 10.68:1 | AAA |
| `--ink-subtle` on `--canvas` | 6.76:1 | AA |
| `--ink-subtle` on `--canvas-raised` | 6.39:1 | AA — the worst text cell on the stage |
| `--accent` (gold) on `--canvas` | 11.06:1 | AAA |
| `--accent-ink` on `--accent` | 11.06:1 | AAA — the gold button |
| `--accent-ink` on `--accent-2` | 5.16:1 | AA |
| `--line-strong` on `--canvas` | 2.00:1 | Decorative |

Measured by `check:contrast` as a fifth palette. **Text over the rendered scene** is a different
question — the background is a picture, not a token — and `check:master:scene` question 5
answers it from pixels.

## 3. Typography

| Role | Font | Size | Weight | Tracking | Leading |
|---|---|---|---|---|---|
| Display / hero | Display | `--text-4xl` | 500 | `-0.03em` | 1.02 |
| H1 | Display | `--text-3xl` | 500 | `-0.025em` | 1.06 |
| H2 | Display | `--text-2xl` | 500 | `-0.02em` | 1.12 |
| H3 | Display | `--text-xl` | 500 | `-0.01em` | 1.25 |
| Body | Body | `--text-base` | 400 | `0` | 1.6 |
| Lead | Body | `--text-lg` | 400 | `-0.01em` | 1.5 |
| Eyebrow | Mono | `--text-xs` | 500 | `0.12em` upper | 1 |
| Metadata | Mono | `--text-sm` | 400 | `0.02em` | 1.4 |
| Statutory disclosure | Mono | `--text-xs` | 400 | `0.02em` | 1.6 |

Measure: `--measure` (68ch) for master body copy — wider than the divisions, because master pages are argument-led prose rather than scannable spec content.

The mono-for-facts convention holds across all four layers. It is the strongest single device unifying the group.

## 4. Layout system

- 12-column grid, `--container` 1280px, `--gutter` 24/32
- Section rhythm `--space-24` / `--space-32`
- **The master layer does not use a visible column grid.** Design does; that is Design's identity. The master frame stays plain so the divisions can be distinctive.
- Asymmetric anchoring for prose blocks; centred only for the hero and CTA bands
- **There is no sustained whitespace on `/`, and this is measured.** The only regions free of
  text at *every* scroll position are two 60px gutters at 1440; at 768 and 375 there are none.
  Under a speed cap of 5x the scroll rate no path exists at any size at any breakpoint for an
  element travelling through the page. **Density is the design** — the whitespace is between
  blocks, not around them. Any proposal for a floating, sticky or parallaxed element over the
  reading column must overturn that map with a measurement, not a mockup:
  `npm run mark:measure` and `npm run mark:solve` regenerate it, `npm run mark:overlap` audits a
  candidate, and `_shared/01-VALIDATION-REPORT.md` §18 records what it cost to find out.

## 5. Components

| Component | Specification |
|---|---|
| **Division card** — ~~struck~~ superseded at `GS-R001-M`: the owner rejected the three coloured cards at `GS-O008`; `/` now uses the **studio index** in §5.1. The row below is kept as history | ~~Equal thirds. 1px `--line` border. 3px top rule~~ in that division's accent. Name in display, then **the approved services sentence in `--ink` and the character sentence in `--ink-muted`**. Hover/focus: `--canvas-raised` background, top rule animates left→right over `--dur-base`, siblings to **80%** opacity. **Corrected at `N-01` block 2**, in three places. It said 60%, which fails WCAG AA: `--ink-muted` composited on `--canvas` at 0.6 measures **2.90:1**, against a 4.5:1 floor. 0.8 measures **4.57:1** and is the lowest value on the scale that clears it. Nothing measured this until `check:contrast` grew an opacity pass in the same commit — no earlier check composited an alpha, and axe does not evaluate hover states. This row said *"descriptor in `--ink-muted`, three example services in mono"*: the approved copy supplies two sentences, and splitting them on commas yields three items for Design, four for Digital and a broken phrase for Press. Mono would be wrong regardless — the cross-theme convention is that monospace marks anything **verifiable**, and a services description is not. It also said `300ms`, which is not a token; `--dur-base` is 250ms and `--dur-slow` is 400ms, so the literal could not be honoured exactly by anything using the scale |
| **"Not sure" link** | Directly below the cards, `--text-lg`, `--ink`. **Not styled as secondary** — it is the highest-value path. **Ships as text, not a link, until `/contact` exists** (`N-01` block 2): `M-03` set the rule that only links whose routes exist are shipped, and `check-axe` fails the build on a same-origin link that 404s. The underline returns with the href, in the commit that adds `/contact` |
| **Work card** | Cover image, division badge(s), title, one-line summary. Multi-division projects show two or three badges — this is the proof, so make it visible |
| **Division badge** | Small mono uppercase label, 1px border in the division accent, `--ink` text on `--canvas`. Never coloured text (see §2 amber constraint) |
| **Process stage** | Numbered `01`–`06` mono, connected by a 1px `--line` vertical rule, stage title in display, canonical description in body, division detail in `--ink-muted` |
| **Continuity example** | Two-column: "Month 1" / "Month 18", same rows, concrete differences. Mono for figures. The single most important component on `/approach` |
| **Limits block** | Plain prose on `--canvas-sunken`, no icons, no illustration. Deliberately undesigned — the same principle as Press's expectations statement |
| **Statutory footer block** | Mono `--text-xs`, `--ink-subtle`, 1px `--line` top border, full width. Plain and permanent |
| **Consent banner** | Bottom-anchored bar, `--canvas-raised`, 1px top `--line-strong`. Accept and Reject as **visually identical buttons**, same size, same weight, side by side. A "Preferences" text link third. No colour hierarchy between accept and reject |
| **Legal page** | Sticky table of contents on desktop, numbered clauses with `#anchor` on each, print stylesheet |

The consent banner specification is a compliance requirement, not an aesthetic choice: making reject harder than accept is a recognised dark pattern and regulators treat it as invalid consent.

**⚠ AMENDED 26 August 2026 — `M-P2-ANALYTICS`.** The bar is unchanged in every respect that DESIGN owns — bottom-anchored, `--canvas-raised`, 1px top `--line-strong`, same button class, same treatment. What changed is its content: **one control, "Got it", and no toggles**, because there are no consent categories and nothing to accept or reject. The Preferences text link is gone with the panel it opened. **The Accept/Reject pair and its parity requirement return with the analytics**, sharing the same single class — `.choice` is kept unchanged for exactly that, and the CSS says so.

### 5.1 Homepage components (`GS-R001-M`)

| Component | Specification |
|---|---|
| **Chapter label** | Mono `--text-xs` uppercase: gold two-digit number, a 2rem gold hairline, label in `--ink-muted`. One per chapter; it is the page's sense of progress |
| **Studio index** | Replaces the division cards. An `<ol>`, hairline `--line-strong` between rows, no box and no fill. Per row: gold mono number, the studio name at `--text-2xl` weight 500 as the one link (its pseudo-element makes the row the hit area), the approved services line in `--ink`, the character line in `--ink-muted`. Hover/focus: a gold hairline draws along the row's foot (`transform`, `--dur-slow`), the name lightens to `--accent-hover`, the arrow moves into place. No division colour on `/` |
| **Stage rail** | The six canonical stage names on one hairline, each with a gold joint (the mark's sphere at bullet scale) and a mono number. Names only — descriptions are `/approach`'s |
| **Review cylinder** (R1) | ~~Review list — held heading beside a list; no card, no carousel~~ superseded at R1: the owner rejected it as reading like articles. A CSS 3D ring of cards (`ReviewCarousel`): 20rem cards (16rem below 768px) on `--canvas-veil` with a hairline, the front card's rule in gold; rating and date in gold mono, the review verbatim at `--text-sm`, name, category and attribution. A card **grows to fit its whole review** — nothing is truncated and no card is a scroll region. Steps forward every 6s; pauses on hover or focus; **Pause rotation** (`aria-pressed`, heavier border and weight when pressed); Previous / Next; "Review n of N" live only while the reader is interacting. Under reduced motion or without CSS `tan()`: a still grid of the same cards, controls hidden |
| **Text attenuation** (R1) | ~~Stage veil — copy blocks on `--canvas-veil` below 1024px~~ superseded at R1: the owner could not see the scene behind the full-width bands. The renderer receives the rectangles of the text blocks on screen (up to 32, feathered 18px) and dims the gold **only behind text**, at every width. No section, band or footer on `/` paints an opaque surface while the scene runs |
| **Hero** (R1) | Full-width frame with fluid gutters (`clamp(1.5rem, 6vw, 9rem)`), no 1280px container — **the same frame for every chapter on `/`, and for the header and footer on `/` only**, so the page has one left edge. Header and footer are transparent on `/` while the scene runs. Column `48vw` at ≥1024px. Headline sized by its own column and capped by the viewport height — `clamp(2.5rem, min(11cqi, 9svh), 11rem)` — so it sets in 3–4 lines at any width and the whole hero, CTA included, fits the first screen. `check:master:hero` measures it over 14 desktop and zoom-equivalent viewports |

## 6. Motion

| Interaction | Spec |
|---|---|
| Scroll reveal | `opacity` + `translateY 12px`, 450ms `--ease-out`, 50ms stagger, once |
| Division card hover | `--dur-base` — background, top-rule wipe, sibling dim to 80%. Was `300ms`, which is not on the duration scale, and 60%, which fails AA; see §5 |
| Route change between divisions | **No transition.** The theme change is the transition. Adding a fade on top makes it feel slow |
| Button hover | 150ms colour |

**Prohibited:** ~~parallax,~~ scroll-jacking, cursor followers, animated counters, hero video, entrance animation on above-the-fold content.

**⚠ Amended at `GS-R001-M` by owner decision, `/` only.** The owner authorised camera and pointer
parallax for the Master environment. What `/` does: the WebGL scene responds to scroll position
(chapters) and, on a fine pointer, tilts by at most ~0.1 rad; a slow sway on the hero and close.
**Still prohibited everywhere, including `/`:** scroll-jacking (scrolling stays native — the scene
reads `scrollY` and never writes it), cursor followers, and entrance animation on above-the-fold
*content*. The scene's canvas fades in by opacity when it first renders; it is decoration behind
the content, the `h1` does not move, and it is not the LCP element. Under
`prefers-reduced-motion` the scene renders once in its hero pose and never moves.

## 7. Imagery

- Work covers, pulled from the shared project database
- Team photography: plain, consistent treatment, real people, neutral background
- **No stock photography. No conglomerate abstractions. No office interiors. No handshakes.**
- Where an image would be decorative, use type, a rule, or nothing

## 8. Do / Don't

| Do | Don't |
|---|---|
| Keep the master accent as ink — **except on `/`, which carries the gold stage (§2.1, owner decision at `GS-R001-M`)** | Invent a fourth brand colour — gold is not a fourth colour, it is the mark's |
| Let divisions supply the colour | Tint master pages with a division accent |
| Put division routing above the second viewport | Bury it under the ecosystem argument |
| Give "not sure / more than one" equal weight | Style it as a fallback |
| Show multi-division badges prominently | Flatten a project to one division |
| Make Accept and Reject visually identical | Give Accept more prominence |
| Use amber as a rule or badge border | Use amber as text on white |
| State the limits plainly on `/approach` | Illustrate or soften them |
