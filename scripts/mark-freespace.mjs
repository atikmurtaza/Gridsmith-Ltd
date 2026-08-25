#!/usr/bin/env node
/**
 * mark-freespace — where does a page leave room? The free-space map.
 *
 * Built to route a travelling homepage mark (variant B) and kept after that mark was rejected,
 * because the map is evidence about the **layout** rather than about the mark: it is what any
 * future proposal for a floating, sticky or parallaxed element has to answer. What it found on
 * `/` is recorded in `docs/_shared/01-VALIDATION-REPORT.md` §18 and `docs/master/DESIGN.md` §4.
 *
 * The JSON is not committed — it is ~3MB and it is only true of the layout that produced it.
 * Re-run it; that is the point of it being a script.
 *
 * The travelling mark's whole problem is *where it is allowed to be*. That is a property of
 * the page, not of the mark, and it differs per viewport: at 1440 the narrow container leaves
 * two tall gutters that exist for the whole scroll; at 375 there are no gutters at all and the
 * only free space is the vertical gaps between blocks. Guessing a transform list and then
 * screenshotting three positions would find a path that happens to work at three positions.
 *
 * So this measures instead. For each viewport width it walks the whole scroll range in fixed
 * steps and, at each step, builds an occupancy map of the *viewport* from the real ink boxes of
 * every visible text run on the page (Range.getClientRects over text nodes — line boxes, not
 * element boxes, so a short line in a wide block does not claim the whole block). The output is
 * a per-step grid plus, for each step, the largest free rectangle. That is the corridor the
 * path has to stay inside.
 *
 * It reports on whatever route it is pointed at. An out-of-flow element does not change where
 * anything else is, so the map of a page is the same with or without one on it.
 *
 * Usage: MARK_ROUTE=work node scripts/mark-freespace.mjs [--json out.json]   (MARK_ROUTE omitted = `/`)
 * Expects a server already running at AXE_BASE_URL (default http://127.0.0.1:3000).
 */
import { writeFileSync } from 'node:fs';
import { launch } from './browser-launch.mjs';

const BASE_URL = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';
/**
 * The route to measure: MARK_ROUTE, **without** a leading slash, which this adds.
 *
 * Neither a positional argument nor a slash-bearing value survives MSYS/Git Bash, which
 * rewrites both into Windows paths before node sees them. `mark-freespace.mjs
 * /gridsmith-mark-b` silently measured `/` and reported it under the other route's name; the
 * tell was a document height identical to the homepage's on a page that renders one fewer
 * in-flow element. A slashless value cannot be mangled.
 */
const path = process.env.MARK_ROUTE ? `/${process.env.MARK_ROUTE.replace(/^\/+/, '')}` : '/';
const jsonFlag = process.argv.indexOf('--json');
const WIDTHS = [375, 768, 1440];
/** Viewport heights paired with each width — the common device shapes, not arbitrary. */
const HEIGHTS = { 375: 812, 768: 1024, 1440: 900 };
/** Scroll sampling step in CSS px. 24px is finer than any element this page lays out. */
const STEP = 24;
/** Clearance around text. "Never crowds text" is not "never intersects text". */
const CLEARANCE = 16;
/** Occupancy grid resolution, in cells across and down the viewport. */
const COLS = 24;
const ROWS = 24;

/**
 * Collect the ink boxes of every visible text run, in viewport coordinates.
 *
 * Runs in the page. Text nodes rather than elements: an element box for a `<p>` spans the
 * container width even when its last line is three words long, and that phantom occupancy is
 * exactly the free space the mark most wants to use.
 */
const TEXT_RECTS = (excludeSel) => {
  const out = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.nodeValue || !n.nodeValue.trim()) continue;
    const el = n.parentElement;
    if (!el) continue;
    if (excludeSel && el.closest(excludeSel)) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;
    // .sr-only and friends: clipped to nothing, present in the a11y tree, not on screen.
    if (el.closest('.sr-only, [hidden]')) continue;
    /* Fixed and sticky chrome is excluded, and the reason is occlusion rather than
       convenience. The travelling mark sits at z-index 1; the consent bar is fixed, opaque and
       at z-index 90, so the mark passing under it is *hidden by* it in exactly the way passing
       off the viewport edge is. Counting it as text to avoid would reserve the bottom 82px of
       every 1440 viewport, and about 200px of every 375 one, against a bar that paints over the
       mark anyway — and at 375 that band is the difference between a path existing and not.
       Anything fixed but transparent would break this reasoning, so it is asserted below. */
    let chrome = false;
    for (let a = el; a && a !== document.body; a = a.parentElement) {
      const ps = getComputedStyle(a).position;
      if (ps === 'fixed' || ps === 'sticky') {
        const bg = getComputedStyle(a).backgroundColor;
        const alpha = bg.startsWith('rgba') ? Number(bg.split(',')[3]) : 1;
        if (alpha >= 0.99) chrome = true;
        break;
      }
    }
    if (chrome) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    for (const r of range.getClientRects()) {
      if (r.width < 1 || r.height < 1) continue;
      out.push([r.left, r.top, r.right, r.bottom]);
    }
  }
  return out;
};

const browser = await launch();
const report = { path, step: STEP, clearance: CLEARANCE, cols: COLS, rows: ROWS, widths: {} };

for (const width of WIDTHS) {
  const height = HEIGHTS[width];
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  const res = await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle0' });
  if (!res || ![200, 304].includes(res.status())) {
    throw new Error(`mark-freespace: ${path} at ${width} returned ${res ? res.status() : "no response"}`);
  }
  /* Loaded twice, deliberately.
     On a cold cache this route's Selected Work block measures 54px taller than it settles at,
     which moves the document height by the same amount and shifts every scroll position the
     path is expressed against. The solver and this gate disagreed by three scroll samples at
     768 for exactly that reason, and the disagreement showed up as 86 text overlaps in a path
     that was correct for the page it was fitted to. Both files reload before measuring so both
     measure the settled layout. */
  await page.reload({ waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const maxScroll = Math.max(0, docHeight - height);
  const samples = [];

  for (let y = 0; y <= maxScroll; y += STEP) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    const rects = await page.evaluate(TEXT_RECTS, null);
    // Rasterise into the occupancy grid, inflated by the clearance.
    const cw = width / COLS;
    const ch = height / ROWS;
    const grid = new Uint8Array(COLS * ROWS);
    for (const [l, t, r, b] of rects) {
      const c0 = Math.max(0, Math.floor((l - CLEARANCE) / cw));
      const c1 = Math.min(COLS - 1, Math.floor((r + CLEARANCE) / cw));
      const r0 = Math.max(0, Math.floor((t - CLEARANCE) / ch));
      const r1 = Math.min(ROWS - 1, Math.floor((b + CLEARANCE) / ch));
      for (let rr = r0; rr <= r1; rr++) for (let cc = c0; cc <= c1; cc++) grid[rr * COLS + cc] = 1;
    }
    samples.push({
      y,
      progress: maxScroll ? y / maxScroll : 0,
      free: largestFreeRect(grid, COLS, ROWS, cw, ch),
      grid: gridToString(grid, COLS, ROWS),
      /* The raw ink boxes, clipped to the viewport and rounded, are what the solver and the
         gate actually reason about. The grid above is a summary for reading; quantising a
         1440px viewport into 24 cells inflates every text run by up to 60px in each
         direction, and a path planned against that summary would be planned against a page
         with far less free space than the real one. */
      rects: rects
        .map(([l, t, r2, b]) => [
          Math.max(0, Math.floor(l)),
          Math.max(0, Math.floor(t)),
          Math.min(width, Math.ceil(r2)),
          Math.min(height, Math.ceil(b)),
        ])
        .filter(([l, t, r2, b]) => r2 > l && b > t && t < height && b > 0),
    });
  }
  report.widths[width] = { height, docHeight, maxScroll, samples };
  await page.close();
}

await browser.close();

/** Largest all-free axis-aligned rectangle in the grid, in CSS px. Histogram-in-stack, O(n). */
function largestFreeRect(grid, cols, rows, cw, ch) {
  const heights = new Int32Array(cols);
  let best = { area: 0, x: 0, y: 0, w: 0, h: 0 };
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) heights[c] = grid[r * cols + c] ? 0 : heights[c] + 1;
    const stack = [];
    for (let c = 0; c <= cols; c++) {
      const h = c === cols ? 0 : heights[c];
      let start = c;
      while (stack.length && stack[stack.length - 1][1] >= h) {
        const [s, sh] = stack.pop();
        const area = sh * (c - s);
        if (area > best.area) best = { area, c0: s, c1: c - 1, r0: r - sh + 1, r1: r };
        start = s;
      }
      stack.push([start, h]);
    }
  }
  if (!best.area) return { x: 0, y: 0, w: 0, h: 0, area: 0 };
  return {
    x: Math.round(best.c0 * cw),
    y: Math.round(best.r0 * ch),
    w: Math.round((best.c1 - best.c0 + 1) * cw),
    h: Math.round((best.r1 - best.r0 + 1) * ch),
    area: Math.round(best.area * cw * ch),
  };
}

function gridToString(grid, cols, rows) {
  const lines = [];
  for (let r = 0; r < rows; r++) {
    let s = '';
    for (let c = 0; c < cols; c++) s += grid[r * cols + c] ? '#' : '.';
    lines.push(s);
  }
  return lines;
}

if (jsonFlag !== -1 && process.argv[jsonFlag + 1]) {
  writeFileSync(process.argv[jsonFlag + 1], JSON.stringify(report, null, 1));
  console.log(`mark-freespace: wrote ${process.argv[jsonFlag + 1]}`);
}

for (const [width, w] of Object.entries(report.widths)) {
  console.log(`\n=== ${width}x${w.height}  doc ${w.docHeight}px  scrollable ${w.maxScroll}px  ${w.samples.length} samples`);
  for (const s of w.samples) {
    const f = s.free;
    console.log(
      `  y=${String(s.y).padStart(5)} p=${s.progress.toFixed(3)}  largest free ${String(f.w).padStart(4)}x${String(f.h).padStart(4)} at (${String(f.x).padStart(4)},${String(f.y).padStart(4)})`,
    );
  }
}
