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
  --ink-subtle:     #71717A;

  --accent:         #0F0F0F;   /* the master accent is ink — deliberate */
  --accent-hover:   #2A2A2A;
  --accent-ink:     #FFFFFF;

  --line:           #E7E5E4;
  --line-strong:    #C7C4C1;

  --font-display:   "Neue Haas Grotesk Display", "Inter Display", system-ui, sans-serif;
  --font-body:      "Inter", system-ui, sans-serif;
  --font-mono:      "JetBrains Mono", ui-monospace, monospace;

  --radius-default: 2px;

  /* Division accents — used ONLY on division-referencing elements */
  --accent-design:  #E8A33D;
  --accent-digital: #1B5FFF;
  --accent-press:   #2E4A3A;
}
```

**The master layer has no colour of its own.** Its accent is ink. This is the central identity decision: if the master brand claimed a fourth colour, the three divisions would become sub-brands of a fourth brand. With ink as the accent, the divisions supply the colour and the master supplies the structure — which is exactly the commercial relationship.

Division accents appear at master level in only three places: division routing cards, division badges on work cards, and the footer division switcher.

**Contrast verification:**

| Pair | Ratio | Pass |
|---|---|---|
| `--ink` on `--canvas` | 19.5:1 | AAA |
| `--ink-muted` on `--canvas` | 7.6:1 | AAA |
| `--ink-subtle` on `--canvas` | 5.1:1 | AA |
| `--accent-ink` on `--accent` | 19.5:1 | AAA |
| `--accent-design` on `--canvas` | 2.0:1 | **Decorative rules and badges only. Never text, never a sole state indicator** |
| `--accent-digital` on `--canvas` | 6.5:1 | AA |
| `--accent-press` on `--canvas` | 8.7:1 | AAA |
| `--line-strong` on `--canvas` | 2.4:1 | Decorative borders only |

The amber row is a real constraint. Design's accent works on its own dark canvas and fails on the master's white one. On master pages it may be a 2–3px rule or a badge background (with `--ink` text on it), never coloured text and never the only signal of a state.

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

## 5. Components

| Component | Specification |
|---|---|
| **Division card** | Equal thirds. 1px `--line` border. 3px top rule in that division's accent. Name in display, descriptor in `--ink-muted`, three example services in mono. Hover/focus: `--canvas-raised` background, top rule animates left→right 300ms, siblings to 60% opacity |
| **"Not sure" link** | Directly below the cards, `--text-lg`, underlined, `--ink`. **Not styled as secondary** — it is the highest-value path |
| **Work card** | Cover image, division badge(s), title, one-line summary. Multi-division projects show two or three badges — this is the proof, so make it visible |
| **Division badge** | Small mono uppercase label, 1px border in the division accent, `--ink` text on `--canvas`. Never coloured text (see §2 amber constraint) |
| **Process stage** | Numbered `01`–`06` mono, connected by a 1px `--line` vertical rule, stage title in display, canonical description in body, division detail in `--ink-muted` |
| **Continuity example** | Two-column: "Month 1" / "Month 18", same rows, concrete differences. Mono for figures. The single most important component on `/approach` |
| **Limits block** | Plain prose on `--canvas-sunken`, no icons, no illustration. Deliberately undesigned — the same principle as Press's expectations statement |
| **Statutory footer block** | Mono `--text-xs`, `--ink-subtle`, 1px `--line` top border, full width. Plain and permanent |
| **Consent banner** | Bottom-anchored bar, `--canvas-raised`, 1px top `--line-strong`. Accept and Reject as **visually identical buttons**, same size, same weight, side by side. A "Preferences" text link third. No colour hierarchy between accept and reject |
| **Legal page** | Sticky table of contents on desktop, numbered clauses with `#anchor` on each, print stylesheet |

The consent banner specification is a compliance requirement, not an aesthetic choice: making reject harder than accept is a recognised dark pattern and regulators treat it as invalid consent.

## 6. Motion

| Interaction | Spec |
|---|---|
| Scroll reveal | `opacity` + `translateY 12px`, 450ms `--ease-out`, 50ms stagger, once |
| Division card hover | 300ms — background, top-rule wipe, sibling dim |
| Route change between divisions | **No transition.** The theme change is the transition. Adding a fade on top makes it feel slow |
| Button hover | 150ms colour |

**Prohibited:** parallax, scroll-jacking, cursor followers, animated counters, hero video, entrance animation on above-the-fold content.

## 7. Imagery

- Work covers, pulled from the shared project database
- Team photography: plain, consistent treatment, real people, neutral background
- **No stock photography. No conglomerate abstractions. No office interiors. No handshakes.**
- Where an image would be decorative, use type, a rule, or nothing

## 8. Do / Don't

| Do | Don't |
|---|---|
| Keep the master accent as ink | Invent a fourth brand colour |
| Let divisions supply the colour | Tint master pages with a division accent |
| Put division routing above the second viewport | Bury it under the ecosystem argument |
| Give "not sure / more than one" equal weight | Style it as a fallback |
| Show multi-division badges prominently | Flatten a project to one division |
| Make Accept and Reject visually identical | Give Accept more prominence |
| Use amber as a rule or badge border | Use amber as text on white |
| State the limits plainly on `/approach` | Illustrate or soften them |
