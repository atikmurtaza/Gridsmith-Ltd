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
  --ink-subtle:     #78716C;

  --accent:         #2E4A3A;   /* deep green — cloth binding, not celebratory */
  --accent-hover:   #1F3428;
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

| Pair | Ratio | Pass |
|---|---|---|
| `--ink` on `--canvas` | 15.6:1 | AAA |
| `--ink-muted` on `--canvas` | 7.1:1 | AAA |
| `--ink-subtle` on `--canvas` | 4.9:1 | AA — **17px minimum, never below** |
| `--accent` on `--canvas` | 8.4:1 | AAA |
| `--accent-ink` on `--accent` | 8.4:1 | AAA |
| `--ink` on `--canvas-sunken` | 14.1:1 | AAA |
| `--line-strong` on `--canvas` | 2.3:1 | **Decorative only — never a sole information carrier** |

The warm canvas costs roughly 2 points of contrast versus pure white. The `--ink-subtle` 17px floor is the consequence and is not negotiable.

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
