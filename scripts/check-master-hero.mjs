#!/usr/bin/env node
/**
 * check-master-hero — the Master hero holds its composition across desktop sizes and zoom levels.
 * `GS-R001-M` R1.
 *
 * The owner tested `/` on a laptop and an external display at several browser zoom levels. At
 * 80–90% zoom on the larger display — a WIDER effective viewport — the headline broke into about
 * six lines, the column left dead space beside it, and the CTA fell below the fold. Measured
 * before the fix, over the matrix below: a fixed 665px column, a headline that grew with the
 * viewport (4 lines at 1280, 7 from 1745 up), the column's left edge drifting to 984px, and the
 * CTA below the fold at 8 of 13 sizes.
 *
 * Browser zoom is a change of effective CSS viewport, so it is tested as one: 1920×1080 at 80%,
 * 90% and 110% is 2400×1350, 2133×1200 and 1745×982; 2560×1440 at 80% and 90% is 3200×1800 and
 * 2844×1600; a 1536×864 laptop at 125% is 1229×691. No zoom is detected anywhere — the layout
 * has to hold, and this is what says whether it does.
 *
 * | # | Question, at every size |
 * |---|---|
 * | 1 | No horizontal overflow. |
 * | 2 | The headline is contained — inside its column and inside the viewport. |
 * | 3 | The headline sets in 2–5 lines. Not a fixed count: perceptual consistency. |
 * | 4 | **"Discuss Your Requirements" is fully visible in the first screen**, before any scroll. |
 * | 5 | The column uses the frame: it starts within the left 12% and reaches past 40% of the width — a column pinned to a fixed width leaves dead space on wide screens and fails this. |
 * | 6 | The mark is visible beside the copy: gold in the right half of the first screen. |
 *
 * Nothing here freezes a pixel position; every threshold is a proportion.
 *
 * Proven red, branch by branch, in `docs/_shared/GS-R001-M-MASTER-REDESIGN.md` §R1.
 * Expects a server already running at AXE_BASE_URL (default http://127.0.0.1:3000).
 */
import { launch } from './browser-launch.mjs';

const BASE_URL = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';
/** Hardcoded: the owner's desktop matrix, then zoom-equivalent effective viewports. */
const SIZES = [
  [1280, 720], [1366, 768], [1440, 900], [1536, 864], [1600, 900], [1920, 1080], [2048, 1152], [2560, 1440],
  [1229, 691], [1745, 982], [2133, 1200], [2400, 1350], [2844, 1600], [3200, 1800],
];
const LINES = [2, 5];
const LEFT_MAX = 0.12;
const RIGHT_MIN = 0.4;
const MARK_FLOOR = 0.03;

const browser = await launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'], protocolTimeout: 600_000 });
const decoder = await browser.newPage();
const problems = [];
const rows = [];

/** Gold share of the right half of a screenshot, content hidden. */
const goldRight = (b64) =>
  decoder.evaluate(async (b64) => {
    const img = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
    const c = new OffscreenCanvas(img.width, img.height);
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const half = Math.floor(img.width / 2);
    const { data } = ctx.getImageData(half, 0, img.width - half, img.height);
    let gold = 0;
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      if (r > 70 && r >= g && g > b && r - b > 30) gold++;
    }
    return gold / (data.length / 4);
  }, b64);

for (const [w, h] of SIZES) {
  const tag = `${w}x${h}`;
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.setCookie({ name: 'gs_consent', value: '1', url: BASE_URL });
  // `?scene=software`: this browser has no GPU; see check-master-scene.mjs.
  const res = await page.goto(`${BASE_URL}/?scene=software`, { waitUntil: 'load', timeout: 60000 });
  if (!res || ![200, 304].includes(res.status())) throw new Error(`/ returned ${res?.status()}`);
  await page.waitForFunction(() => document.querySelector('[data-master-scene]')?.dataset.render, { timeout: 30000 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 1500));

  const m = await page.evaluate(() => {
    const h1 = document.querySelector('#hero-title');
    const col = h1?.parentElement;
    const cta = [...document.querySelectorAll('main a')].find((a) => /Discuss Your Requirements/i.test(a.textContent ?? ''));
    if (!h1 || !col || !cta) return null;
    const r = h1.getBoundingClientRect();
    const c = col.getBoundingClientRect();
    const b = cta.getBoundingClientRect();
    // Lines from the text's own line boxes, not from height ÷ line-height.
    const range = document.createRange();
    range.selectNodeContents(h1);
    const tops = new Set([...range.getClientRects()].map((q) => Math.round(q.top)));
    return {
      overflow: document.documentElement.scrollWidth - innerWidth,
      scrollY,
      lines: tops.size,
      font: parseFloat(getComputedStyle(h1).fontSize),
      contained: r.left >= c.left - 1 && r.right <= c.right + 1 && r.right <= innerWidth && r.left >= 0 && h1.scrollWidth <= h1.clientWidth + 1,
      colLeft: c.left / innerWidth,
      colRight: c.right / innerWidth,
      cta: { top: b.top, bottom: b.bottom },
    };
  });
  if (!m) {
    problems.push(`${tag}: the hero headline, its column or the CTA is missing — nothing was measured`);
    await page.close();
    continue;
  }
  await page.addStyleTag({ content: 'main, header, footer { opacity: 0 !important; }' });
  const mark = await goldRight(await page.screenshot({ encoding: 'base64' }));

  if (m.overflow > 0) problems.push(`1 ${tag}: ${m.overflow}px of horizontal overflow`);
  if (!m.contained) problems.push(`2 ${tag}: the headline is not contained in its column and the viewport`);
  if (m.lines < LINES[0] || m.lines > LINES[1]) problems.push(`3 ${tag}: the headline sets in ${m.lines} lines (expected ${LINES[0]}–${LINES[1]}) at ${m.font}px`);
  if (m.scrollY !== 0 || m.cta.top < 0 || m.cta.bottom > h) problems.push(`4 ${tag}: the CTA spans ${Math.round(m.cta.top)}–${Math.round(m.cta.bottom)}px in a ${h}px first screen — not fully visible without scrolling`);
  if (m.colLeft > LEFT_MAX || m.colRight < RIGHT_MIN) problems.push(`5 ${tag}: the copy column runs ${(m.colLeft * 100).toFixed(0)}%–${(m.colRight * 100).toFixed(0)}% of the width — dead space beside a constrained column`);
  if (mark < MARK_FLOOR) problems.push(`6 ${tag}: the mark covers ${(mark * 100).toFixed(1)}% of the right half — not visibly beside the copy`);
  rows.push(`  ${tag.padEnd(10)} ${String(Math.round(m.font)).padStart(4)}px ${m.lines} lines  column ${(m.colLeft * 100).toFixed(0)}–${(m.colRight * 100).toFixed(0)}%  CTA bottom ${Math.round(m.cta.bottom)}/${h}  mark ${(mark * 100).toFixed(1)}%`);
  await page.close();
}
await browser.close();

console.log('check-master-hero: headline size, lines, column span, CTA against the first screen, mark\n');
for (const r of rows) console.log(r);
if (rows.length !== SIZES.length) problems.push(`measured ${rows.length} of ${SIZES.length} sizes — an unmeasured size is not a pass`);
if (problems.length) {
  console.error(`\ncheck-master-hero: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`\ncheck-master-hero: ${SIZES.length} sizes — contained, 2–5 lines, CTA in the first screen, the column using the frame, the mark beside it\n`);
