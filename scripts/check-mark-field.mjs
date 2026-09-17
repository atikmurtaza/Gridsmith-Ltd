#!/usr/bin/env node
/**
 * check-mark-field — the Master background mark behaves as specified, at every width and
 * under reduced motion. `GS-R001-R`.
 *
 * The subject is `components/master/BackgroundMark.tsx` on the served `/`. It is a **fixed,
 * decorative, scroll-driven layer behind the homepage**, and every property that makes it
 * acceptable is invisible in a screenshot:
 *
 *  1. it renders at all, with all **14** pieces — 6 rods and 8 spheres;
 *  2. it is **absent below 768px** (`display: none`), where `01-VALIDATION-REPORT.md` §18
 *     measured no region of this page free of text at any scroll position;
 *  3. it is **static at 768–1023px** and under `prefers-reduced-motion: reduce` — a composed
 *     mark, not a slowed one;
 *  4. it is **animated at 1024px and above, and the timeline is live** — see below;
 *  5. it never produces horizontal overflow at any scroll position;
 *  6. it is out of the accessibility tree, holds no focusable element, and takes no pointer.
 *
 * ## Why assertion 4 reads a rendered transform and not the animation's own report
 *
 * **This gate exists because of a defect that reported itself healthy.** The first build used
 * `animation-timeline: scroll()`, which means `scroll(nearest)` — resolved against the nearest
 * ancestor **scroll container**. `.field` is `position: fixed`, and a fixed element does not
 * scroll with any ancestor, so it has no nearest scroll container and the timeline resolved to
 * nothing. The animation never advanced.
 *
 * Everything an implementer would naturally check said it was working:
 *
 * | Probe | Reported |
 * |---|---|
 * | `CSS.supports('animation-timeline: scroll()')` | `true` |
 * | `getComputedStyle(piece).animationName` | `gsFieldPiece` |
 * | `getComputedStyle(piece).animationTimeline` | `scroll()` |
 * | `piece.getAnimations().length` | `1` |
 * | `.playState` | `running` |
 * | `.effect.getKeyframes()` | the three correct transforms |
 * | **rendered `transform` at 50% scroll** | **`none`** |
 *
 * Only the last row is the truth, and `animation.currentTime === null` is the only diagnostic
 * that names the cause. **A screenshot cannot see this either**, because at scroll 0 the
 * correct state *is* `none` — the composed mark. So this gate scrolls and reads the matrix.
 *
 * Note the trap in reading the matrix after a programmatic scroll: a scroll-driven animation is
 * sampled off the main thread, so `getComputedStyle` immediately after `scrollTo` returns the
 * **previous** frame — `01-VALIDATION-REPORT.md` §18.1, where it cost a session. Two
 * `requestAnimationFrame`s, every time.
 *
 * ## Proving it
 *
 * `--selftest` is not available here and would be dishonest if it were: every assertion is
 * about a **served page**, and a pure-function self-test would be asserting against a fixture
 * this file invented. The deliberate-failure proof is recorded in
 * `docs/_shared/GS-R001-R-REMEDIATION.md` §5.2, and each assertion was made to fire by
 * mutating the committed subject and restoring it from bytes captured beforehand.
 *
 * Expects a server already running at AXE_BASE_URL (default http://127.0.0.1:3000).
 */
import { launch } from './browser-launch.mjs';

const BASE_URL = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';
const ROUTE = '/';

/** The 14 pieces of the mark — 6 `<rect>` rods and 8 `<circle>` spheres. */
const EXPECTED_PIECES = 14;

/**
 * The canonical static brand asset — the owner's vector, `GS-R001-R`.
 *
 * Hardcoded, on `check:tokens`' side of the division `CLAUDE.md` draws: the question is *does
 * the header serve the approved logo*, so the expectation must come from outside the thing
 * being checked. Reading the path out of the stylesheet would pass whatever the stylesheet said.
 */
const LOGO_ASSET = '/brand/gridsmith-logo.svg';

/**
 * `[width, height, reducedMotion, expectRendered, expectAnimated]`.
 *
 * 1023 and 1024 are both here on purpose: a breakpoint asserted on one side only is a
 * breakpoint nobody has shown to be where it says it is.
 */
const CASES = [
  [375, 812, false, false, false],
  [767, 900, false, false, false],
  [768, 1024, false, true, false],
  [1023, 800, false, true, false],
  [1024, 800, false, true, true],
  [1440, 900, false, true, true],
  [1440, 900, true, true, false],
];

const browser = await launch();
const problems = [];
const rows = [];

for (const [width, height, reduced, expectRendered, expectAnimated] of CASES) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  if (reduced) {
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  }
  await page.goto(BASE_URL + ROUTE, { waitUntil: 'networkidle0' });

  const r = await page.evaluate(async () => {
    const d = document.documentElement;
    // **Selected by class alone, deliberately.** The first version of this selector was
    // `[class*="field"][aria-hidden="true"]`, which made the aria-hidden assertion below
    // UNREACHABLE: removing the attribute stopped the element matching, so the gate reported
    // "not in the document" instead of "not aria-hidden". It was still a red — the hollow-
    // subject guard caught it — but the branch it was supposed to prove had never run. That is
    // `A-GATE-4-3`, found by proving this gate rather than by reading it.
    const field = document.querySelector('div[class*="field"]');
    if (!field) return { found: false };

    const svg = field.querySelector('svg');
    const display = getComputedStyle(field).display;
    const cs = getComputedStyle(field);
    const pieces = field.querySelectorAll('rect, circle').length;

    // Scroll to the midpoint, where the dispersed keyframe sits, and wait two frames: a
    // scroll-driven animation is sampled off the main thread and a synchronous read returns
    // the previous position (01-VALIDATION-REPORT.md §18.1).
    const max = d.scrollHeight - innerHeight;
    window.scrollTo(0, Math.round(max * 0.5));
    await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));

    const piece = field.querySelector('rect');
    const transformAt50 = piece ? getComputedStyle(piece).transform : null;
    const anim = piece ? piece.getAnimations()[0] : null;
    const timelineActive = anim ? anim.currentTime !== null : false;

    // Overflow is checked across the whole document, not only at the midpoint: a dispersed
    // piece leaving the viewBox would widen the page at one scroll position and no other.
    let overflow = false;
    let widest = d.scrollWidth;
    for (let p = 0; p <= 1.0001; p += 0.1) {
      window.scrollTo(0, Math.round(max * p));
      await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
      if (d.scrollWidth > d.clientWidth) overflow = true;
      if (d.scrollWidth > widest) widest = d.scrollWidth;
    }

    window.scrollTo(0, 0);
    await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
    const transformAt0 = piece ? getComputedStyle(piece).transform : null;

    return {
      found: true,
      display,
      pieces,
      transformAt0,
      transformAt50,
      timelineActive,
      overflow,
      widest,
      clientWidth: d.clientWidth,
      ariaHidden: field.getAttribute('aria-hidden'),
      svgRole: svg ? svg.getAttribute('role') : null,
      pointerEvents: cs.pointerEvents,
      position: cs.position,
      overflowStyle: cs.overflow,
      zIndex: cs.zIndex,
      focusables: field.querySelectorAll('a,button,input,select,textarea,[tabindex],[contenteditable]').length,
      // The header logo — GS-R001-R. It is a CSS background on `.wordmark::before`, which is
      // exactly the shape of asset nothing else can see: check-axe resolves same-origin LINKS,
      // not stylesheet URLs, so a wrong path here would be a header with no logo and every
      // gate green. Read the computed background-image and the reserved box.
      logo: (() => {
        const w = document.querySelector('header a[href="/"]');
        if (!w) return { found: false };
        const cs = getComputedStyle(w, '::before');
        const box = { w: parseFloat(cs.inlineSize || cs.width), h: parseFloat(cs.blockSize || cs.height) };
        return { found: true, image: cs.backgroundImage, box };
      })(),
    };
  });

  const label = `${width}px${reduced ? ' reduced-motion' : ''}`;
  await page.close();

  if (!r.found) {
    problems.push(`${label}: the background mark is not in the document at all — nothing was measured.`);
    rows.push({ width, reduced, state: 'MISSING' });
    continue;
  }

  const rendered = r.display !== 'none';
  // `none` is the identity transform here: the markup carries the COMPOSED position, so an
  // animation that never runs leaves the mark assembled. A matrix means it moved.
  const moved = r.transformAt50 !== 'none' && r.transformAt50 !== 'matrix(1, 0, 0, 1, 0, 0)';

  if (rendered !== expectRendered) {
    problems.push(
      `${label}: field display is ${JSON.stringify(r.display)}; expected it to be ` +
        `${expectRendered ? 'rendered' : 'display:none'}.`,
    );
  }
  if (rendered && r.pieces !== EXPECTED_PIECES) {
    problems.push(
      `${label}: ${r.pieces} piece(s) in the field, expected ${EXPECTED_PIECES} — 6 rods and ` +
        '8 spheres. A missing piece is a mark that is no longer the logo.',
    );
  }
  if (rendered && moved !== expectAnimated) {
    problems.push(
      expectAnimated
        ? `${label}: the mark did NOT move at 50% scroll (transform ${JSON.stringify(r.transformAt50)}, ` +
          `timeline ${r.timelineActive ? 'active' : 'INACTIVE'}). An inactive scroll timeline ` +
          'reports playState "running" and renders nothing — this is the assertion that catches it.'
        : `${label}: the mark moved at 50% scroll (${JSON.stringify(r.transformAt50)}) and must ` +
          'be static here. Reduced motion and narrow widths get a composed mark, not a slow one.',
    );
  }
  if (rendered && expectAnimated && !r.timelineActive) {
    problems.push(`${label}: the scroll timeline is inactive — currentTime is null.`);
  }
  if (rendered && r.transformAt0 !== 'none' && r.transformAt0 !== 'matrix(1, 0, 0, 1, 0, 0)') {
    problems.push(
      `${label}: the mark is NOT composed at scroll 0 (${JSON.stringify(r.transformAt0)}). ` +
        'Every state must resolve to the assembled logo; a scattered first paint is the ' +
        'entrance animation DESIGN.md §6 prohibits.',
    );
  }
  if (r.overflow) {
    problems.push(
      `${label}: horizontal overflow — widest scrollWidth ${r.widest} against clientWidth ` +
        `${r.clientWidth}, found while scrolling the full document.`,
    );
  }
  // The logo is asserted at every width, including the two where the background field does not
  // render: the header is on every route at every size, and this is the only gate that reads it.
  if (!r.logo || !r.logo.found) {
    problems.push(`${label}: no header wordmark link — the logo could not be measured.`);
  } else {
    if (!r.logo.image || r.logo.image === 'none') {
      problems.push(
        `${label}: the header logo has no background-image (got ${JSON.stringify(r.logo.image)}). ` +
          'The canonical brand asset does not resolve.',
      );
    } else if (!r.logo.image.includes(LOGO_ASSET)) {
      problems.push(
        `${label}: the header logo is ${JSON.stringify(r.logo.image)}, which is not ` +
          `${LOGO_ASSET}. The owner-supplied vector is the canonical asset (GS-R001-R).`,
      );
    }
    if (!(r.logo.box.w > 0) || !(r.logo.box.h > 0)) {
      problems.push(
        `${label}: the header logo box is ${r.logo.box.w}x${r.logo.box.h} — a zero box reserves ` +
          'no space and paints nothing, which reads exactly like a logo that is simply absent.',
      );
    } else if (Math.abs(r.logo.box.w - r.logo.box.h) > 0.5) {
      problems.push(
        `${label}: the header logo box is ${r.logo.box.w}x${r.logo.box.h}, not square. The ` +
          "supplied viewBox is 1:1 and the mark must never be stretched.",
      );
    }
  }

  if (rendered) {
    if (r.ariaHidden !== 'true') problems.push(`${label}: field is not aria-hidden.`);
    if (r.svgRole !== 'presentation') problems.push(`${label}: svg role is ${JSON.stringify(r.svgRole)}, not "presentation".`);
    if (r.pointerEvents !== 'none') problems.push(`${label}: pointer-events is ${r.pointerEvents} — it can take a click.`);
    if (r.position !== 'fixed') problems.push(`${label}: position is ${r.position}, not fixed — it would participate in layout.`);
    if (r.overflowStyle !== 'hidden') problems.push(`${label}: overflow is ${r.overflowStyle}, not hidden — a dispersed piece could widen the page.`);
    if (r.focusables !== 0) problems.push(`${label}: ${r.focusables} focusable element(s) inside a decorative layer.`);
  }

  rows.push({
    width,
    reduced,
    display: r.display,
    pieces: rendered ? r.pieces : 0,
    animated: rendered ? moved : false,
    timeline: rendered ? (r.timelineActive ? 'active' : 'inactive') : '—',
    overflow: r.overflow,
  });
}

await browser.close();

console.table(rows);

// The hollow-subject guard. Every case reporting "not rendered" is indistinguishable from a
// component that was deleted, and this gate's headline output is a count.
const renderedCases = rows.filter((r) => r.display && r.display !== 'none').length;
if (renderedCases === 0) {
  problems.push(
    'the field rendered in 0 of the measured cases — either the component is gone or every ' +
      'case measured nothing. A gate whose subject never appears is silent, not green.',
  );
}
const animatedCases = rows.filter((r) => r.animated).length;
if (animatedCases === 0) {
  problems.push(
    'the mark moved in 0 of the measured cases. The animation is the subject; if it never ' +
      'moves, this run asserted only that a static SVG exists.',
  );
}

if (problems.length > 0) {
  console.error(`\ncheck-mark-field: ${problems.length} problem(s) against ${BASE_URL}\n`);
  for (const p of problems) console.error(`  ${p}\n`);
  process.exit(1);
}

console.log(
  `\ncheck-mark-field: PASS — ${CASES.length} case(s) over ${ROUTE}; ${EXPECTED_PIECES} pieces; ` +
    `rendered in ${renderedCases}, animated in ${animatedCases}, static in ` +
    `${renderedCases - animatedCases}; no horizontal overflow at any scroll position; ` +
    `aria-hidden, no focusables, no pointer events; the header logo resolves to ${LOGO_ASSET} ` +
    'in a square box at every width.',
);
