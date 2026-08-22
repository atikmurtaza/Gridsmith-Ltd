# Design Spec — Gridsmith Press

Inherits `_shared/00-FOUNDATION.md` §3. Press theme only.

---

## 1. Art direction

**Concept: the well-made book.**

Warm paper canvas, serif throughout, generous margins, a measure tuned for reading. The interface should feel like a considered publisher's catalogue — restrained, literate, physical. Book covers are the primary visual content and everything else steps back to let them work.

This division has an additional design constraint the others do not: **it must look like it is not selling to you.** R6-Press establishes that authors screen for hype. Aspirational stock photography, bestseller badges, glowing gradients, exuberant colour — all of these read as vanity press. Editorial restraint is not a stylistic preference here; it is the primary trust mechanism.

**Reference register:** literary publisher catalogues, Penguin and Faber's typographic discipline, well-set book interiors, university press websites.
**Explicitly not:** stacks of floating books, quill-and-parchment imagery, "bestseller" starbursts, smiling-author stock photography, gold foil effects, anything that implies guaranteed success.

## 2. Theme tokens

```css
[data-division="press"] {
  --canvas:         #FBF9F4;   /* warm paper */
  --canvas-raised:  #FFFFFF;
  --canvas-sunken:  #F2EFE7;

  --ink:            #1A1815;
  --ink-muted:      #57534E;
  --ink-subtle:     #6C6560;   /* was #78716C — see §2, the 17px floor went with it */

  --accent:         #2E4A3A;   /* deep green — cloth binding, not celebratory */
  --accent-hover:   #1F3428;
  --accent-2:       #426953;   /* the second colour surface — a lighter cloth */
  --accent-ink:     #FBF9F4;

  --line:           #E3DFD4;
  --line-strong:    #C8C2B2;

  --font-display:   "Freight Text Pro", "Source Serif 4", Georgia, serif;
  --font-body:      "Source Serif 4", Georgia, serif;
  --font-mono:      "JetBrains Mono", ui-monospace, monospace;

  --radius-default: 2px;
}
```

**Contrast verification (WCAG 2.2 AA):**

| Pair | Measured | Pass |
|---|---|---|
| `--ink` on `--canvas` | 16.84:1 | AAA |
| `--ink-muted` on `--canvas` | 7.25:1 | AAA |
| `--ink-subtle` on `--canvas` | 5.44:1 | AA at any size |
| `--accent` on `--canvas` | 9.25:1 | AAA |
| `--accent-ink` on `--accent` | 9.25:1 | AAA |
| `--ink` on `--canvas-sunken` | 15.42:1 | AAA |
| `--line-strong` on `--canvas` | 1.69:1 | **Decorative only — never a sole information carrier** |

Measured at A-03, and `--ink-subtle` re-measured at the run-3 fixes.

**The `--ink-subtle` 17px floor is gone, and this is not a relaxation.** The token was
`#78716C`, measuring 4.56:1 — clearing the AA body floor by 0.06 — and this table carried
a "17px minimum, never below" rule to compensate for the missing headroom. That rule was
prose no gate could enforce: `check:contrast` measures token-on-surface pairs and cannot
see the size of the declarations that use them (A11Y-22). The run-3 audit found the floor
breached 23 times per press frame on `/_kitchen-sink` by one 12px declaration, with every
gate green throughout.

A colour that needs a size rule to be legible is the wrong colour. `--ink-subtle` is now
`#6C6560`, measuring **5.44 / 5.73 / 4.98:1** on `--canvas` / `--canvas-raised` /
`--canvas-sunken`. It clears the body floor on every press surface with roughly half a
point of buffer, so no size rule is required — and `check:contrast` now enforces the
rendered-size rule directly rather than trusting this paragraph.

The warm canvas still costs roughly 2 points of contrast versus pure white; that is why
press needs a darker `--ink-subtle` than a white-canvas theme does. Body type remains
17px+ / 1.7 for reading comfort (§3) — that is a typographic choice, no longer a contrast
compensation, and the two must not be conflated again.

## 3. Typography

Press is serif-led — the only division where body copy is a serif. This requires a larger base size than the shared token default.

| Role | Font | Size | Weight | Tracking | Leading |
|---|---|---|---|---|---|
| Display / hero | Serif | `--text-3xl` | 400 | `-0.02em` | 1.08 |
| H1 | Serif | `--text-2xl` | 400 | `-0.015em` | 1.15 |
| H2 | Serif | `--text-xl` | 500 | `-0.01em` | 1.25 |
| H3 | Serif | `--text-lg` | 600 | `0` | 1.3 |
| **Body** | **Serif** | **17px minimum** | 400 | `0` | **1.7** |
| Lead | Serif | `--text-lg` | 400 | `-0.005em` | 1.55 |
| Eyebrow | Mono | `--text-xs` | 500 | `0.1em` upper | 1 |
| Metadata (ISBN, price, date) | Mono | `--text-sm` | 400 | `0.02em` | 1.4 |
| Pull quote | Serif italic | `--text-xl` | 400 | `-0.01em` | 1.4 |

Serif at 1.7 leading and 17px is a deliberate reading-comfort choice. Press pages are read, not scanned — Margaret reads the rights page carefully, and the type must support that.

**Measure: `--measure-narrow` (52ch) for all body copy, without exception.** A serif set beyond 60ch is genuinely harder to read and undermines the "we understand books" claim.

Mono is reserved for **factual data only**: ISBN, price, publication date, word count, page count, turnaround. The serif/mono contrast does the same job as in the other divisions — it marks what is verifiable.

## 4. Layout system

- 12-column grid, `--container` 1280px, but text blocks constrained to 52ch and often offset rather than centred
- Generous vertical rhythm: `--space-24` mobile, `--space-32` desktop — Press breathes more than the other two
- **Margin notes**: secondary information set in the outer columns at `--text-sm` `--ink-muted`, mirroring a printed book's marginalia. Used for clause references, footnotes, caveats. On mobile these collapse inline beneath the paragraph they annotate.
- Drop cap on the opening paragraph of long-form editorial pages only (rights, expectations, insights). Never on marketing pages.
- Rules are `--line` hairlines; sections separated by whitespace first, rules second.

## 5. Components

| Component | Specification |
|---|---|
| **Button (primary)** | `--accent` fill, `--accent-ink` text, 2px radius, serif `--text-base` weight 500, sentence case. **Not uppercase** — uppercase buttons read as sales pressure in this context |
| **Button (secondary)** | 1px `--line-strong`, `--ink` text, `--canvas-raised` fill |
| **Book card** | Fixed 2:3 cover container with a subtle 1px `--line` edge and `--shadow-1` only. Below: serif title, `--ink-muted` author, mono year/format. Retailer links as small underlined text. Hover: cover lifts 2px, 300ms. **No hover overlay on the cover** — obscuring a book cover is the wrong instinct here |
| **Ownership facts module** | Six rows, one per fact: copyright · royalties · ISBN · publisher of record · retail accounts · sales income. Serif statement left, mono clause reference right. 1px `--line` between rows. Deliberately quiet — a loud "YOU KEEP 100% OF RIGHTS!" banner would read as protesting too much. The quietness is what makes six consecutive claims believable |
| **Platform spec table** | Real `<table>`, one row per requirement, mono for specification values (trim sizes, DPI, colour profiles). `specCheckedOn` date shown in mono at the foot |
| **Packages table** | Real `<table>`. Serif labels, mono prices. Sticky header. `--canvas-raised` for the recommended column with a 2px `--accent` top rule **and** a text label — never colour alone. **Exclusions row present and equally weighted** |
| **Expectations statement** | Full-width `--canvas-sunken` band, serif `--text-lg`, no icon, no illustration. Plain prose. The absence of design here *is* the design |
| **Process stage** | Numbered mono, serif title, body at 52ch, duration and client time commitment in a mono margin note |
| **Path Finder step** | Serif question at `--text-xl`, options as bordered rows (not tiles) — reads as a form, not a game. Selected: 2px `--accent` border + check glyph + `--canvas-sunken` |
| **Path Finder result** | Full-width editorial layout. Where the outcome is self-service or not-ready, **no CTA button appears** — only the honest guidance and a link out |
| **Testimonial** | Serif italic pull quote, attribution in mono with role and book title. Photo optional, square, small |
| **FAQ** | Accordion, serif, 1px `--line` dividers. The vanity-press question is **first and open by default** |
| **Sticky mobile bar** | [Packages & prices] outline / [Start an assessment] `--accent`, split 50/50 |

## 6. Motion

The most restrained of the three divisions.

| Interaction | Spec |
|---|---|
| Scroll reveal | `opacity` only, 500ms, no translate |
| Book card hover | `translateY(-2px)`, 300ms |
| Accordion | 250ms via `grid-template-rows` |
| Path Finder step | 200ms cross-fade |
| Button hover | 150ms colour |

**Prohibited:** page-turn effects, book-opening animations, parallax, scroll-jacking, cursor followers, animated counters, confetti or celebration on form submit (ETH-01 — celebration is a sales tactic).

## 7. Imagery

- **Book covers are the imagery.** Real covers of real published titles, at high fidelity, in fixed 2:3 containers.
- Physical-book photography permitted only where it is genuinely Gridsmith-produced work, shot plainly. No styled flat-lays with coffee cups and reading glasses.
- **No author stock photography. No smiling-writer imagery. No aspirational lifestyle shots.** These are the single strongest vanity-press signal.
- No decorative illustration.
- Every cover: meaningful `alt` giving title and author.

## 8. Iconography

Minimal. Lucide, 1.5px stroke, 20px, `currentColor`. Icons appear only in functional UI (accordion chevrons, external-link markers, form validation). **No decorative icons in content sections** — a serif editorial page with icon bullets looks like a template.

## 9. Do / Don't

| Do | Don't |
|---|---|
| Set body at 17px+ / 1.7 / 52ch | Set serif text small, tight, or wide |
| Let book covers be the visual interest | Add hover overlays over covers |
| Use sentence case on buttons | Use uppercase CTAs |
| State the expectations plainly, undesigned | Illustrate or icon-ify the caveats |
| Show exclusions in the packages table | Hide exclusions in a footnote |
| Put the vanity-press FAQ first, open | Bury the uncomfortable question |
| Reserve mono for verifiable facts | Use mono decoratively |
| Keep motion nearly invisible | Animate anything book-shaped |
| Let a non-conversion be a good outcome | Add urgency, scarcity, or celebration |


### The colour surfaces — added with the palette work

| Pair | Measured | Pass |
|---|---|---|
| `--accent-ink` on `--accent` (primary surface) | 9.25:1 | AA |
| `--accent-ink` on `--accent-2` (secondary surface) | 5.91:1 | AA |

`--accent-2` is **#426953**, derived from `--accent` by a lightness shift at constant hue and
saturation. It carries `--accent-ink` (`#FBF9F4`) — one foreground clears AA on both surfaces,
measured, so there is no separate `--accent-2-ink`.

The division hero is a `--accent-2` band and the closing call-to-action is an `--accent`
band; the button on a band is `Button variant="inverse"`, because `.primary` there would be
the accent on its own second shade. Full published values: `docs/_shared/PALETTES.md`.
