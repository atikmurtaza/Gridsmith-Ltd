import styles from './master.module.css';

/**
 * The Master background mark — `GS-R001-R`, the owner-approved scroll narrative.
 *
 * A fixed, full-viewport layer behind the homepage carrying the Gridsmith mark as geometry:
 * eight spheres and six cylinders that sit composed at the top of the page, separate and
 * reorient as the reader scrolls, and recompose at the closing CTA.
 *
 * ## The geometry is the real logo, transcribed, not traced
 *
 * Every number in `SPHERES` and `RODS` below is copied from `public/brand/gridsmith-logo.svg`,
 * the vector the owner supplied as the authoritative source. That file is not an approximation:
 * it was verified against `gridsmith-logo.png` before a line of this was written, by rendering
 * both to alpha masks, normalising each to its own bounding box and comparing shape to shape.
 *
 * | Measurement | Result |
 * |---|---|
 * | Content aspect ratio | PNG **1.0293**, SVG **1.0302** — the same mark |
 * | Shape IoU, PNG vs SVG | **0.9624** |
 * | XOR area | 1.84% of frame, across 268 regions, largest 231px |
 * | XOR after two erosions | **0 pixels** — every disagreement is a sub-2px edge rim |
 *
 * A structural difference — a missing sphere, a rod in the wrong place, a changed proportion —
 * survives erosion as a solid blob. Nothing survived. So these coordinates *are* the brand
 * geometry, and nothing here was estimated by eye. **If the logo is ever redrawn, re-run that
 * comparison before changing these numbers.**
 *
 * ## What is reinterpreted, and what is not
 *
 * **The geometry is exact. The rendering is not the logo's.** The supplied mark is polished
 * gold with radial gradients, specular highlights and rim light; reproduced at full saturation
 * behind body copy it would be an unreadable page, and `GS-R001-R` §17 requires content
 * contrast to be maintained. So the pieces render as **hairline outlines on `--line`** — the
 * same 1px rule every border on this site is drawn with, and the same device `HeroMark` uses
 * for its drafting sheet.
 *
 * That is a presentation choice about a decorative background layer, not a recolouring of the
 * brand: **the static logo is served unmodified** from the supplied file, and this layer never
 * claims to be it. The thing that makes the mark recognisable here is the arrangement — eight
 * nodes, six rods, that interlock — and the arrangement is exact.
 *
 * ## Why this is CSS and ships zero JavaScript
 *
 * `HeroMark`'s docstring records the measurement and it is binding: GSAP core plus ScrollTrigger
 * took `/` from a 2.7KB delta to 48.8KB — **46.1KB gz of library against a 15KB budget** — and
 * `GS-R001-R` §16 restates that the earlier measurements remain binding. The reference page the
 * owner pointed at drives its version with **WebGL**, which is several times that again.
 *
 * `animation-timeline: scroll()` is a browser feature. The whole effect is the stylesheet, and
 * the entire homepage delta is unchanged at 1.9KB of 15KB.
 *
 * **One `@keyframes` block, fourteen elements.** Each piece carries its own `--dx`, `--dy` and
 * `--dr` as inline custom properties and shares `gsFieldPiece`, exactly as `HeroMark` shares
 * `markAssemble` across three blocks with `--fx`/`--fy`. Fourteen separate keyframe sets would
 * be fourteen times the CSS for the same three numbers.
 *
 * ## Four states, and every one of them resolves to the composed mark
 *
 * 1. **Desktop with scroll-timeline support** — the full narrative.
 * 2. **No scroll-timeline support** — the `@supports` guard means no animation is declared at
 *    all, and the markup below is already the *composed* state. This guard is load-bearing for
 *    the reason `check:mark:guard` exists: an unguarded `animation-timeline` is *dropped* by a
 *    browser that does not know it, leaving a named animation on the **document** timeline —
 *    which would play once, on load, behind the LCP viewport.
 * 3. **`prefers-reduced-motion: reduce`** — same, by the same mechanism. A static composed mark,
 *    not a slowed one.
 * 4. **Below 768px** — the layer is `display: none`. Not a compromise: at 375px there is no
 *    region of this page free of text at any scroll position (`01-VALIDATION-REPORT.md` §18
 *    measured it), so every pixel of geometry would sit under the reading column on the devices
 *    least able to spare the compositor work.
 *
 * ## Accessibility and interaction
 *
 * `aria-hidden` on the container and `role="presentation"` on the `<svg>`, so it is out of the
 * accessibility tree entirely; it carries no information the page does not state in words.
 * `pointer-events: none`, so it cannot take a click. Nothing in it is focusable, so it cannot
 * take focus. `position: fixed` with `z-index: 0` against content at `z-index: 1` — it never
 * participates in layout, so it cannot cause a shift, and it cannot occlude the review cylinder
 * or the consent bar, both of which sit above it.
 *
 * `overflow: hidden` on the container is what stops a dispersed piece producing horizontal
 * scroll; `check:responsive` asserts no overflow at 375/768/1440 and this is the element that
 * would break it.
 */

/** The mark's own centre, in the supplied file's coordinate space. Pieces disperse from here. */
const CENTRE = { x: 767.5, y: 763 };

/**
 * The field's viewBox, centred on `CENTRE` and a little over twice the mark's own 920 box.
 * The extra room is travel space: a piece that left the viewBox would be clipped by the SVG
 * root, which clips by default.
 */
const FIELD = { x: -232, y: -237, size: 2000 };

/** Sphere centres — `<use id="sphere-N">` transforms in the supplied SVG. `r` is its `circle`. */
const SPHERES = [
  { x: 475, y: 482 },
  { x: 856, y: 482 },
  { x: 475, y: 845 },
  { x: 856, y: 845 },
  { x: 675, y: 684 },
  { x: 1060, y: 684 },
  { x: 675, y: 1044 },
  { x: 1060, y: 1044 },
];
const SPHERE_R = 75;

/** Cylinders — the six `<rect id="cylinder-N">` elements, verbatim. */
const RODS = [
  { x: 475, y: 444, w: 381, h: 76 },
  { x: 437, y: 482, w: 76, h: 363 },
  { x: 475, y: 807, w: 381, h: 76 },
  { x: 675, y: 646, w: 385, h: 76 },
  { x: 1022, y: 684, w: 76, h: 360 },
  { x: 675, y: 1006, w: 385, h: 76 },
];

/**
 * Each piece moves **outward along its own line from the mark's centre**, which is what makes
 * this read as one object opening rather than as fourteen particles drifting. A random
 * direction per piece is the "generic SaaS blobs" failure `GS-R001-R` §15 rules out by name.
 *
 * `spread` varies per piece so the layers separate at different rates — depth, not disorder.
 * `rotate` is small and alternates in sign: enough to say the pieces are free, not enough to
 * read as tumbling.
 */
function disperse(cx: number, cy: number, i: number) {
  const dx = cx - CENTRE.x;
  const dy = cy - CENTRE.y;
  const len = Math.hypot(dx, dy) || 1;
  // 190–320 units of travel against a 735-unit mark: a clear separation, well short of a
  // scatter. The modulus gives a repeatable per-piece value with no randomness in a render.
  const spread = 190 + ((i * 47) % 130);
  return {
    '--dx': `${((dx / len) * spread).toFixed(1)}px`,
    '--dy': `${((dy / len) * spread).toFixed(1)}px`,
    '--dr': `${(i % 2 === 0 ? 1 : -1) * (3 + (i % 4))}deg`,
  } as React.CSSProperties;
}

export function BackgroundMark() {
  return (
    <div className={styles.field} aria-hidden="true">
      <svg
        className={styles.fieldSvg}
        viewBox={`${FIELD.x} ${FIELD.y} ${FIELD.size} ${FIELD.size}`}
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
        focusable="false"
      >
        {/* Rods first, so a sphere's outline sits over the rod it caps — the same stacking the
            supplied SVG uses, where `#cylinders` precedes `#spheres`. */}
        {RODS.map((r, i) => (
          <rect
            key={`rod-${r.x}-${r.y}`}
            className={styles.fieldPiece}
            style={disperse(r.x + r.w / 2, r.y + r.h / 2, i)}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
          />
        ))}
        {SPHERES.map((s, i) => (
          <circle
            key={`sphere-${s.x}-${s.y}`}
            className={styles.fieldPiece}
            style={disperse(s.x, s.y, i + RODS.length)}
            cx={s.x}
            cy={s.y}
            r={SPHERE_R}
          />
        ))}
      </svg>
    </div>
  );
}
