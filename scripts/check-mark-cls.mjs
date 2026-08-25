#!/usr/bin/env node
/**
 * check-mark-cls — cumulative layout shift on the homepage, while scrolling.
 *
 * Written for the travelling mark (variant B, since rejected and deleted — `01-VALIDATION-REPORT.md`
 * §18) and kept because its subject outlived it: `/` carries the shipped mark, `HeroMark`, whose
 * CLS claim rests on a fixed `aspect-ratio` box and is otherwise an argument. CLAUDE.md's rule is
 * that an asserted number is unverified until a gate measures it. So this measures.
 *
 * It is scroll-aware, which is the whole reason it is not just a Lighthouse run: the animation
 * is driven by scroll position, so a shift it caused would appear *at some scroll position*,
 * not on load. The page is scrolled its full length in viewport-height steps with a
 * `layout-shift` PerformanceObserver running, and every entry is summed regardless of
 * `hadRecentInput` — programmatic scrolling is not user input, and excluding entries on that
 * flag is how a scroll-driven shift hides from a CLS measurement.
 *
 * The budget on `/` is 0.03. The claim being checked is 0.0000.
 *
 * Expects a server already running at AXE_BASE_URL (default http://127.0.0.1:3000).
 */
import { launch } from './browser-launch.mjs';

const BASE_URL = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';
/** Extra routes may be added; `/` is the one with a mark on it. */
const ROUTES = (process.env.MARK_CLS_ROUTES ?? '/').split(',');
const VIEWPORTS = [
  [375, 812],
  [768, 1024],
  [1440, 900],
];
/** Anything above this is a failure. The budget is 0.05; the claim being checked is 0.0000. */
const CEILING = 0.00005;

const browser = await launch();
const rows = [];
let failures = 0;

for (const route of ROUTES) {
  for (const [width, height] of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.evaluateOnNewDocument(() => {
      window.__cls = 0;
      window.__shifts = [];
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__cls += entry.value;
          if (entry.value > 0) window.__shifts.push({ value: entry.value, time: Math.round(entry.startTime) });
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    const res = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0' });
    if (!res || ![200, 304].includes(res.status())) {
      console.error(`check-mark-cls: ${route} at ${width}px returned ${res ? res.status() : 'no response'}`);
      failures++;
      await page.close();
      continue;
    }
    await page.evaluate(() => document.fonts.ready);

    /* Deliberate-failure proof, on demand: MARK_CLS_PROBE=1 inserts a block at the top of the
       document that grows one frame later. A reading of 0.0000 is only evidence of no shift if
       this observer can report one, and "0.0000" is the easiest number in the world to print
       without measuring anything. With the probe on, every row must be FAIL. */
    if (process.env.MARK_CLS_PROBE === '1') {
      await page.evaluate(
        () =>
          new Promise((resolve) => {
            const d = document.createElement('div');
            d.style.height = '10px';
            document.body.insertBefore(d, document.body.firstChild);
            requestAnimationFrame(() => {
              d.style.height = '300px';
              requestAnimationFrame(() => requestAnimationFrame(resolve));
            });
          }),
      );
    }

    const maxScroll = await page.evaluate((h) => document.documentElement.scrollHeight - h, height);
    let steps = 0;
    for (let y = 0; y <= maxScroll + height; y += Math.round(height / 2)) {
      await page.evaluate(
        (yy) =>
          new Promise((resolve) => {
            window.scrollTo(0, yy);
            requestAnimationFrame(() => requestAnimationFrame(resolve));
          }),
        y,
      );
      steps++;
    }
    // And back to the top, because a shift can be one-directional.
    await page.evaluate(
      () =>
        new Promise((resolve) => {
          window.scrollTo(0, 0);
          requestAnimationFrame(() => requestAnimationFrame(resolve));
        }),
    );

    const { cls, shifts } = await page.evaluate(() => ({ cls: window.__cls, shifts: window.__shifts }));
    const ok = cls <= CEILING;
    if (!ok) failures++;
    rows.push(
      `  ${ok ? 'ok  ' : 'FAIL'} ${route.padEnd(20)} ${String(width).padStart(4)}px  CLS ${cls.toFixed(4)}  over ${steps} scroll steps${shifts.length ? `  (${shifts.length} shift entries)` : ''}`,
    );
    if (!ok) for (const s of shifts.slice(0, 5)) rows.push(`         shift ${s.value.toFixed(5)} at ${s.time}ms`);
    await page.close();
  }
}

await browser.close();
for (const r of rows) console.log(r);

if (rows.length === 0) {
  console.error('check-mark-cls: measured nothing. That is a failure, not a pass.');
  process.exit(1);
}
if (failures) {
  console.error(`\ncheck-mark-cls: ${failures} measurement(s) above ${CEILING}`);
  process.exit(1);
}
console.log(`\ncheck-mark-cls: ${rows.length} route/viewport combinations, all 0.0000.`);
