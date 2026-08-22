# Division palettes — published hex values

Every value on this page is measured, not designed-and-hoped. The measurements are
reproduced by `npm run check:contrast` on every commit; where this page and that gate
disagree, **the gate is right and this page is wrong** (CLAUDE.md, *How to work*).

This file exists for two audiences: the stylesheets, which take the tokens, and Atik, who
needs the hex values for social profiles, letterheads and anything outside the repo.

---

## Why there is a palette at all

The three division accents were demoted to `role: 'decor'` at V3 because they fail WCAG AA
**as text** on a dark canvas. That was correct and it is unchanged — `--accent-design` is
2.16:1 on master's white and `lint:colors` still refuses to let anything paint text with it.

What never followed was the other half. A colour used as a **surface**, with a foreground
chosen to sit on it, clears AA comfortably: the same amber measures **9.07:1** with
`#0C0C0D` on top of it. Nothing in the token layer had ever offered a division a surface
colour, so the accents survived only as 1px rules, and a visitor could not derive a palette
from any page on the site. For a studio selling design work that is a failure of the thing
being sold.

Every colour below went through the contrast matrix. No rule was relaxed to admit one.

---

## The shape of each palette

| Role | Token | What it is |
|---|---|---|
| Primary surface | `--accent` | The full-strength division colour, as a fill |
| Secondary surface | `--accent-2` | A lightness shift of the same hue — the quieter block |
| Foreground for both | `--accent-ink` | One token, because one value clears AA on both — measured |

`--accent-2` is derived from `--accent` by a lightness shift at **constant hue and
saturation**, so the second surface is the same colour rather than a second colour.

There is no separate `--accent-2-ink`. It would have held the same value as `--accent-ink`
in all four themes, and a token that can never differ from another token is a synonym.

---

## Gridsmith Design — amber

Drafting pencil and warning tape, on a near-black drawing sheet.

| Role | Hex | Foreground on it | Measured |
|---|---|---|---|
| Primary surface `--accent` | **#E8A33D** | #0C0C0D | **9.07:1** |
| Secondary surface `--accent-2` | **#BD7A16** | #0C0C0D | **5.55:1** |
| Canvas | #0C0C0D | — | — |
| Foreground `--accent-ink` | **#0C0C0D** | — | — |

`--accent-2` measures 5.55:1 against the canvas and 1.63:1 against `--accent`: far enough
from the sheet to read as a block, far enough from the accent to read as a different one.

## Gridsmith Digital — electric blue

A spec sheet: the accent for the statement, navy for the header rule.

| Role | Hex | Foreground on it | Measured |
|---|---|---|---|
| Primary surface `--accent` | **#1B5FFF** | #FFFFFF | **5.09:1** |
| Secondary surface `--accent-2` | **#0033AA** | #FFFFFF | **10.22:1** |
| Canvas | #FAFAF9 | — | — |
| Foreground `--accent-ink` | **#FFFFFF** | — | — |

Digital is the one division whose secondary surface is *darker* than its primary. The
accent is already light enough that a lighter sibling would not survive white text.

## Gridsmith Press — deep green

Cloth binding, on warm paper. Not celebratory.

| Role | Hex | Foreground on it | Measured |
|---|---|---|---|
| Primary surface `--accent` | **#2E4A3A** | #FBF9F4 | **9.25:1** |
| Secondary surface `--accent-2` | **#426953** | #FBF9F4 | **5.91:1** |
| Canvas | #FBF9F4 | — | — |
| Foreground `--accent-ink` | **#FBF9F4** | — | — |

## Gridsmith Ltd (master) — no colour

Master's accent is ink and stays ink. If the master brand claimed a fourth colour the three
divisions would become sub-brands of a fourth brand, and the divisions would stop reading as
distinct against it.

| Role | Hex | Foreground on it | Measured |
|---|---|---|---|
| Primary surface `--accent` | **#0F0F0F** | #FFFFFF | **19.17:1** |
| Secondary surface `--accent-2` | **#3A3A3A** | #FFFFFF | **11.37:1** |
| Canvas | #FFFFFF | — | — |
| Foreground `--accent-ink` | **#FFFFFF** | — | — |

Master's palette is a lightness pair, not a hue pair. It is declared anyway, in the same
three token names, so a shared component can use a colour surface on any of the four themes
without asking which one it is on.

---

## The division colours as fills, anywhere

Three theme-invariant pairs. They are the same on all four themes, exactly like the accents
they pair with, so a division block looks the same wherever it is rendered — the master
homepage's routing cards, a division badge, the footer switcher.

| Token | Fill | Ink token | Ink | Measured |
|---|---|---|---|---|
| `--accent-design` | **#E8A33D** | `--accent-design-ink` | **#0C0C0D** | **9.07:1** |
| `--accent-digital` | **#1B5FFF** | `--accent-digital-ink` | **#FFFFFF** | **5.09:1** |
| `--accent-press` | **#2E4A3A** | `--accent-press-ink` | **#FBF9F4** | **9.25:1** |

**The `decor` role on the three accents is unchanged.** It says they may never be a
*foreground*, which is what 2.16:1 on white actually means. These three inks are what makes
using them as *backgrounds* checkable rather than asserted.

---

## For a social profile

Pick the division, take the primary surface as the brand colour and the foreground as the
text over it. Every one of these pairs is AA at any size.

| | Brand colour | Text on it |
|---|---|---|
| Gridsmith Ltd | `#0F0F0F` | `#FFFFFF` |
| Gridsmith Design | `#E8A33D` | `#0C0C0D` |
| Gridsmith Digital | `#1B5FFF` | `#FFFFFF` |
| Gridsmith Press | `#2E4A3A` | `#FBF9F4` |

Secondary, where a profile wants a banner behind the avatar:

| | Banner | Text on it |
|---|---|---|
| Gridsmith Ltd | `#3A3A3A` | `#FFFFFF` |
| Gridsmith Design | `#BD7A16` | `#0C0C0D` |
| Gridsmith Digital | `#0033AA` | `#FFFFFF` |
| Gridsmith Press | `#426953` | `#FBF9F4` |

---

## Where the colour is actually used

A palette nobody puts on a surface is the state this file exists to end.

| Surface | Where |
|---|---|
| `--accent-2` band | The hero on `/design`, `/digital`, `/press` — `Section surface="accent"` |
| `--accent` band | The closing call-to-action on all three — `.ctaBand` |
| `--accent` fill | `Button variant="primary"`, everywhere |
| `--accent-ink` fill | `Button variant="inverse"` — the button that sits on a band |
| Division fills | The three routing cards on `/`, and the homepage mark |

A band re-points the ink ramp (`--ink`, `--ink-muted`, `--ink-subtle`) at `--accent-ink`
rather than overriding each descendant's `color`. Every one of those is measured against
the theme's canvases and none against a fill, so letting them through would put unmeasured
foregrounds on a coloured surface — which is the defect the accents were demoted for.
See `components/primitives/structure.module.css`.
