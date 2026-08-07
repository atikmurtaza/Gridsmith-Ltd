# Accessibility Statement — DRAFT for review

**Version:** 1.0 · **Last tested:** `[TK]` · **Status: DRAFT**

---

## 1. Our commitment

Gridsmith Ltd is committed to making gridsmith.co.uk usable by as many people as possible, including people using screen readers, keyboard-only navigation, magnification, or reduced-motion settings.

We treat accessibility as part of building the site properly, not as an adjustment made afterwards. Under the Equality Act 2010 we have a duty to make reasonable adjustments, and we take WCAG 2.2 Level AA as the benchmark for meeting it.

## 2. Conformance status

This website aims to conform to **WCAG 2.2 Level AA**.

Status: `[TK — one of: fully conformant / partially conformant, with known issues listed at §4]`

## 3. What we have done

- All content reachable and operable by keyboard alone, with a visible focus indicator on every interactive element
- Semantic HTML throughout — real headings, lists, tables, buttons and links
- Text contrast verified at 4.5:1 minimum, and 3:1 for interface components
- Data tables (the drawing matrix, the publishing packages comparison) built as real tables with row and column headers, not as visual grids
- All interactive tools — the project estimator, the drawing estimator, the publishing path finder — built as real form fieldsets, fully keyboard operable, with progress and results announced to assistive technology
- Meaningful alternative text on all images
- Motion limited to opacity and transform, and disabled entirely when `prefers-reduced-motion` is set
- Pricing and key information readable without JavaScript
- Automated testing on every code change, plus manual keyboard and screen reader testing before release

## 4. Known limitations

`[TK — list honestly. An accessibility statement claiming perfection is less credible than one that names its gaps and gives a date for fixing them.]`

Likely candidates to assess and record:
- Third-party embedded content, if any is introduced
- Complex data tables on very small screens
- PDF documents provided for download

## 5. Feedback

If you encounter a barrier, tell us: `[TK email]`.

Please include the page, what you were trying to do, and the assistive technology you were using. We will acknowledge within **5 working days** and tell you what we intend to do and when.

If you need information from this site in another format — large print, plain text, or read aloud — ask and we will provide it.

## 6. Testing

- Automated: axe on every build
- Manual: keyboard-only navigation, NVDA on Windows, VoiceOver on macOS and iOS
- Last full manual test: `[TK]`
- Next scheduled review: `[TK — every 6 months]`

---

**`[TK]` items:** conformance status, known limitations, contact email, test dates.
