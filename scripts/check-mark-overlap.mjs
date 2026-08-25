#!/usr/bin/env node
/**
 * check-mark-overlap — does a floating element ever land on text, at any scroll position?
 *
 * **This gate has no standing subject, and that is deliberate rather than an oversight.** It
 * was written for the travelling homepage mark (variant B), which was measured, rejected and
 * deleted — see `01-VALIDATION-REPORT.md` §18. Nothing in the tree floats over the reading
 * column today, so there is nothing for it to audit, and a gate wired into `verify` with
 * nothing to reach is the silent-gate failure CLAUDE.md exists to prevent. So it is **not in
 * `verify` and not in CI**: it is a tool, kept because the next person to propose a floating,
 * sticky or parallaxed element should have to run it rather than argue about it.
 *
 * `MARK_ROUTE` is **required** — slashless, because a leading-slash value does not survive
 * MSYS/Git Bash, which rewrites it into a Windows path before node sees it. There is no
 * default, precisely so this cannot one day run green against a route that has no mark on it.
 *
 * ## What it asserts, when pointed at something
 *
 *  1. **No overlap** — at every 24px of scroll, at 375, 768 and 1440, the element's rect must
 *     not intersect any text run's, with clearance. Reported as a count, and the count is
 *     provable to move: `MARK_CLEARANCE=200` against a clean path reports thousands.
 *  2. **The subject is still the subject** — the element must be present, `position: fixed`,
 *     and must actually move. An element that stopped animating passes (1) trivially while
 *     measuring nothing. A total travel below `MARK_MIN_TRAVEL` viewport heights is a failure.
 *  3. **Zero samples is a failure**, never a pass.
 *
 * Opaque fixed chrome — the consent bar — is excluded from the text set: it paints over the
 * element at a higher z-index, so passing under it is occlusion rather than crowding. The
 * exclusion is computed here rather than assumed, and a transparent fixed ancestor counts as
 * text.
 *
 * ## The defect this file exists to remember
 *
 * A scroll-driven animation is sampled off the main thread, so a `getBoundingClientRect()`
 * taken synchronously after `scrollTo` returns the element's **previous** position. The first
 * run of this gate read the mark as frozen from scroll 336 onward and reported 253 text
 * overlaps against a path that was correct. See the two-frame wait below, and §18.1.
 *
 * Usage: MARK_ROUTE=some-route AXE_BASE_URL=http://127.0.0.1:3000 node scripts/check-mark-overlap.mjs
 */
import { launch } from './browser-launch.mjs';

const BASE_URL = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';
if (!process.env.MARK_ROUTE) {
  console.error(
    [
      'check-mark-overlap: MARK_ROUTE is required (slashless, e.g. MARK_ROUTE=my-route).',
      'There is no default: this gate has no standing subject, and a default would let it',
      'run green against a route with nothing to measure. See the docstring.',
    ].join('\n'),
  );
  process.exit(1);
}
const ROUTE = `/${process.env.MARK_ROUTE.replace(/^\/+/, '')}`;
const WIDTHS = [375, 768, 1440];
const HEIGHTS = { 375: 812, 768: 1024, 1440: 900 };
const STEP = 24;
/** The mark must clear text by this much. Matches the clearance the path was solved against. */
const CLEARANCE = Number(process.env.MARK_CLEARANCE ?? 16);
/** Minimum total travel, in viewport heights, before the mark counts as travelling. */
const MIN_TRAVEL = Number(process.env.MARK_MIN_TRAVEL ?? 1);

const PROBE = (markSelector) => {
  const mark = document.querySelector(markSelector);
  if (!mark) return { mark: null, rects: [] };
  const m = mark.getBoundingClientRect();
  const rects = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.nodeValue || !n.nodeValue.trim()) continue;
    const el = n.parentElement;
    if (!el) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;
    if (el.closest('.sr-only, [hidden]')) continue;
    let occluded = false;
    for (let a = el; a && a !== document.body; a = a.parentElement) {
      const ps = getComputedStyle(a).position;
      if (ps === 'fixed' || ps === 'sticky') {
        const bg = getComputedStyle(a).backgroundColor;
        const alpha = bg.startsWith('rgba') ? Number(bg.split(',')[3]) : 1;
        if (alpha >= 0.99) occluded = true;
        break;
      }
    }
    if (occluded) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    for (const r of range.getClientRects()) {
      if (r.width < 1 || r.height < 1) continue;
      rects.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom, text: n.nodeValue.trim().slice(0, 40) });
    }
  }
  return {
    mark: { left: m.left, top: m.top, right: m.right, bottom: m.bottom, position: getComputedStyle(mark).position },
    rects,
  };
};

const browser = await launch();
const problems = [];
let samplesChecked = 0;

for (const width of WIDTHS) {
  const height = HEIGHTS[width];
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  const res = await page.goto(`${BASE_URL}${ROUTE}`, { waitUntil: 'networkidle0' });
  if (!res || ![200, 304].includes(res.status())) {
    problems.push(`${ROUTE} at ${width}px returned ${res ? res.status() : 'no response'}`);
    await page.close();
    continue;
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

  const selector = await page.evaluate(() => {
    const svg = [...document.querySelectorAll('svg')].find((s) => s.getAttribute('viewBox') === '0 0 1200 320');
    if (!svg) return null;
    return `.${svg.getAttribute('class').split(' ')[0]}`;
  });
  if (!selector) {
    problems.push(`${ROUTE} at ${width}px: no mark found — the gate has no subject`);
    await page.close();
    continue;
  }

  const maxScroll = await page.evaluate((h) => document.documentElement.scrollHeight - h, height);
  let travel = 0;
  let previous = null;
  let widthSamples = 0;
  let overlaps = 0;

  for (let y = 0; y <= maxScroll; y += STEP) {
    /* Two frames after the scroll, not zero.
       A scroll-driven animation is sampled off the main thread, so a `getBoundingClientRect()`
       taken synchronously after `scrollTo` returns the mark's *previous* position. That is not
       a subtle skew: the first run of this gate read the mark as frozen at its scroll-336
       position for the rest of the document and reported 253 text overlaps at 375 against a
       path that was correct. A gate reading stale geometry fails loudly here, but the same
       staleness in a screenshot would have been believed. */
    await page.evaluate(
      (yy) =>
        new Promise((resolve) => {
          window.scrollTo(0, yy);
          requestAnimationFrame(() => requestAnimationFrame(resolve));
        }),
      y,
    );
    const { mark, rects } = await page.evaluate(PROBE, selector);
    if (!mark) {
      problems.push(`${ROUTE} at ${width}px, scroll ${y}: the mark vanished mid-scroll`);
      break;
    }
    if (mark.position !== 'fixed') {
      problems.push(`${ROUTE} at ${width}px, scroll ${y}: mark is ${mark.position}, not fixed — the animation is not running`);
      break;
    }
    if (previous) travel += Math.hypot(mark.left - previous.left, mark.top - previous.top);
    previous = mark;
    widthSamples++;
    samplesChecked++;

    for (const r of rects) {
      if (
        mark.left < r.right + CLEARANCE &&
        mark.right > r.left - CLEARANCE &&
        mark.top < r.bottom + CLEARANCE &&
        mark.bottom > r.top - CLEARANCE
      ) {
        overlaps++;
        if (overlaps <= 5) {
          problems.push(
            `${ROUTE} at ${width}px, scroll ${y}: mark [${Math.round(mark.left)},${Math.round(mark.top)},${Math.round(mark.right)},${Math.round(mark.bottom)}] overlaps "${r.text}" [${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.right)},${Math.round(r.bottom)}]`,
          );
        }
      }
    }
  }

  if (widthSamples === 0) problems.push(`${ROUTE} at ${width}px: zero scroll samples measured`);
  if (travel < MIN_TRAVEL * height) {
    problems.push(
      `${ROUTE} at ${width}px: mark travelled ${Math.round(travel)}px over the whole scroll, under the ${MIN_TRAVEL} viewport-height floor — it is not travelling`,
    );
  }
  console.log(
    `  ${String(width).padStart(4)}px  ${String(widthSamples).padStart(4)} scroll samples  ${String(overlaps).padStart(4)} overlaps  ${Math.round(travel)}px travelled`,
  );
  await page.close();
}

await browser.close();

/* Problems are printed before the zero-sample check, not after.
   The two can fire on the same input and the first version exited on the zero-sample branch
   first: pointing the gate at `/`, whose mark is the shipped in-flow one, reported "measured
   nothing" and said nothing about the mark being static — crediting the wrong assertion for the
   red build. Establishing which one fired is the point of a deliberate-failure proof. */
if (problems.length) {
  console.error(`\ncheck-mark-overlap: ${problems.length} problem(s)\n`);
  for (const p of problems.slice(0, 40)) console.error(`  ${p}`);
  process.exit(1);
}

if (samplesChecked === 0) {
  console.error('check-mark-overlap: measured nothing. That is a failure, not a pass.');
  process.exit(1);
}

console.log(`\ncheck-mark-overlap: ${samplesChecked} scroll positions across ${WIDTHS.length} widths, no text overlapped.`);
