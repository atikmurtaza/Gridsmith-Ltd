import styles from './master.module.css';

/**
 * The homepage mark — `/`'s only piece of motion, and the one thing on the page that
 * demonstrates rather than describes.
 *
 * ## What it is
 *
 * Three colour blocks — Design amber, Digital blue, Press green — and a drafting grid.
 * At the top of the page the blocks sit apart across the sheet and the grid is unruled.
 * As the page scrolls the rules draw and the three blocks travel into a single joined bar.
 * It is the headline as geometry: *one company, three specialist studios*, assembling.
 *
 * ## Why it is CSS and not GSAP
 *
 * Measured, not assumed. GSAP core plus ScrollTrigger, imported by one `'use client'`
 * component doing one `gsap.to()` on this route, took `/` from a **2.7KB** delta to
 * **48.8KB** — 46.1KB gz of library against a 15KB budget on the route with the strictest
 * Lighthouse gate in the programme. `check-bundle-size` printed `OVER` on the only route
 * that had ever been comfortably inside its budget. There is no version of that trade that
 * is worth a scroll effect, and CLAUDE.md non-negotiable #8 answers it before the taste
 * question arises.
 *
 * This ships **zero bytes of JavaScript**. `animation-timeline: scroll()` is a browser
 * feature; the whole effect is the stylesheet.
 *
 * ## Three states, and none of them is broken
 *
 * 1. **Scroll-timeline support** — the blocks start apart and assemble as you scroll.
 * 2. **No support** — the `@supports` guard in `master.module.css` means no animation is
 *    declared at all, and the markup below is already the *assembled* state. An unsupported
 *    browser gets the finished mark, statically. This guard is load-bearing rather than
 *    defensive: an unguarded `animation-timeline` is simply *dropped* on a browser that does
 *    not know it, and the animation then runs on the document timeline — an entrance
 *    animation on above-the-fold content, which `DESIGN.md` §6 prohibits outright and which
 *    would put motion on the LCP viewport of the tightest route on the site.
 * 3. **`prefers-reduced-motion: reduce`** — same as (2), by the same mechanism.
 *
 * Every state resolves to the assembled mark. Nothing ends hidden, half-drawn, or apart —
 * the same rule `RevealOnScroll` follows and for the same reason.
 *
 * ## Cost
 *
 * `transform` only, per `PROJECT-RULES` §9 — and only on the three blocks. Nothing here is
 * a layout or paint trigger, nothing changes geometry, so CLS is untouched. Inline SVG, so
 * no request; it is not an LCP candidate, so the `h1` below it remains the LCP element.
 *
 * **The grid does not animate, and that was a correction rather than a simplification.** It
 * drew itself on, staggered, alongside the assembly. A screenshot at scroll 0 showed why
 * that was wrong: every element sits at its `from` keyframe simultaneously, so the mark
 * opened as three rectangles in empty white space. The sheet is the surface the work
 * happens on; it is there before the work is.
 *
 * `aria-hidden`, because it says exactly what the headline underneath it says and a screen
 * reader that announced both would be reading the sentence twice.
 */
const COLUMNS = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];

/**
 * Each block's resting x, and the offset it starts from before the sheet assembles.
 *
 * The resting positions are **on the grid** — 300, 500, 700, all column lines, three
 * two-column blocks meeting edge to edge and centred on the sheet. That is the whole
 * sentence the mark is making: the finished state is the one that lines up. The first
 * version landed on 356/520/684, which is three blocks that happen to be adjacent, and it
 * read as an accident rather than as a fit.
 *
 * The markup carries the resting position; the keyframe carries the offset. That ordering
 * is what makes the no-animation state the finished one rather than the scattered one.
 */
const BLOCKS = [
  { x: 300, fx: -260, fy: -60, fill: 'var(--accent-design)' },
  { x: 500, fx: -40, fy: 60, fill: 'var(--accent-digital)' },
  { x: 700, fx: 260, fy: -70, fill: 'var(--accent-press)' },
];

export function HeroMark() {
  return (
    <svg
      className={styles.mark}
      viewBox="0 0 1200 320"
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <g>
        {COLUMNS.map((x) => (
          <line key={`v${x}`} className={styles.markRule} x1={x} y1="0" x2={x} y2="320" />
        ))}
        {[0, 160, 320].map((y) => (
          <line key={`h${y}`} className={styles.markRule} x1="0" y1={y} x2="1200" y2={y} />
        ))}
      </g>
      {BLOCKS.map((b) => (
        <rect
          key={b.fill}
          className={styles.markBlock}
          style={{ '--fx': `${b.fx}px`, '--fy': `${b.fy}px` } as React.CSSProperties}
          x={b.x}
          y="80"
          width="200"
          height="160"
          fill={b.fill}
        />
      ))}
    </svg>
  );
}
