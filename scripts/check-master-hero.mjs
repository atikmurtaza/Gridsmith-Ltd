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
 * ## Phones and tablets — `GS-MASTER-001-F`
 *
 * Below 1024px the mark sits in a band above the copy, and `GS-INT-001` measured the cost: the H1
 * began at y489 (360), y545 (390), y573 (430) and y627 (768) — 61–66% of the way down the first
 * screen — and the CTA fell below it at every one. So the narrow sizes ask their own questions,
 * and 1 and 2 as above; 5 is desktop-only (there is no free column to use).
 *
 * | # | Question, below 1024px |
 * |---|---|
 * | 3 | The headline sets in 2–6 lines. |
 * | 4 | **The CTA is fully visible in the first screen** where the screen is 800px or taller; on a shorter phone it begins within a short scroll — its top edge inside 110% of the first screen. (`GS-INT-001` measured it near 123% on a 360×740 phone; at 360×740 the H1, intro and mark take the whole first screen, and the button follows directly.) |
 * | 6 | The mark is present **above** the copy: gold between the header and the kicker. |
 * | 7 | **The H1 arrives early**: it starts in the top 55% of the first screen and ends inside it. |
 *
 * At every size:
 *
 * | # | Question |
 * |---|---|
 * | 8 | **One H1, and it is the approved proposition**, character for character. |
 * | 9 | **The kicker reads as two units** — the company, then the studios — each on one line, never broken inside a unit. |
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
/** Hardcoded: the phone and tablet sizes `GS-INT-001` measured, and the owner's review sizes. */
const NARROW = [[360, 740], [390, 844], [430, 932], [768, 1024]];
const PROPOSITION = 'Most companies start over with every supplier. You shouldn’t have to.';
const LINES = [2, 5];
const LINES_NARROW = [2, 6];
/** GS-INT-001 measured 0.61–0.66 at every narrow size; the refinement has to land well above it. */
const H1_TOP_MAX = 0.55;
/** At or above this height the whole CTA fits a phone's first screen; below it, it begins within a short scroll. */
const CTA_FULL_MIN_H = 800;
const CTA_SHORT_SCROLL = 1.1;
const LEFT_MAX = 0.12;
const RIGHT_MIN = 0.4;
const MARK_FLOOR = 0.03;

const browser = await launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'], protocolTimeout: 600_000 });
const decoder = await browser.newPage();
const problems = [];
const rows = [];

/** Gold share of a region of a screenshot, content hidden — the right half by default. */
const goldIn = (b64, box = null) =>
  decoder.evaluate(async (b64, box) => {
    const img = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
    const c = new OffscreenCanvas(img.width, img.height);
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const half = Math.floor(img.width / 2);
    const [x, y, w, h] = box ?? [half, 0, img.width - half, img.height];
    if (w < 1 || h < 1) return 0;
    const { data } = ctx.getImageData(x, y, w, h);
    let gold = 0;
    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      if (r > 70 && r >= g && g > b && r - b > 30) gold++;
    }
    return gold / (data.length / 4);
  }, b64, box);

for (const [w, h] of [...NARROW, ...SIZES]) {
  const tag = `${w}x${h}`;
  const narrow = w < 1024;
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
    const kicker = col?.querySelector('p');
    const header = document.querySelector('body > header');
    const cta = [...document.querySelectorAll('main a')].find((a) => /Discuss Your Requirements/i.test(a.textContent ?? ''));
    if (!h1 || !col || !cta || !kicker || !header) return null;
    const linesOf = (el) => {
      const q = document.createRange();
      q.selectNodeContents(el);
      return new Set([...q.getClientRects()].filter((x) => x.width > 0 && x.height > 0).map((x) => Math.round(x.top))).size;
    };
    // The kicker's text units — the rule between them is decoration and carries no text.
    const units = [...kicker.children].filter((el) => el.textContent.trim());
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
      h1s: document.querySelectorAll('h1').length,
      text: h1.textContent,
      top: r.top,
      bottom: r.bottom,
      units: units.map(linesOf),
      kickerRows: new Set(units.map((u) => Math.round(u.getBoundingClientRect().top))).size,
      band: [Math.round(header.getBoundingClientRect().bottom), Math.round(kicker.getBoundingClientRect().top)],
    };
  });
  if (!m) {
    problems.push(`${tag}: the hero headline, its column or the CTA is missing — nothing was measured`);
    await page.close();
    continue;
  }
  await page.addStyleTag({ content: 'main, header, footer { opacity: 0 !important; }' });
  // Wide: beside the copy, in the right half. Narrow: above it, between the header and the kicker.
  const mark = await goldIn(await page.screenshot({ encoding: 'base64' }), narrow ? [0, m.band[0], w, m.band[1] - m.band[0]] : null);
  const lines = narrow ? LINES_NARROW : LINES;
  const ctaFull = !narrow || h >= CTA_FULL_MIN_H;

  if (m.overflow > 0) problems.push(`1 ${tag}: ${m.overflow}px of horizontal overflow`);
  if (!m.contained) problems.push(`2 ${tag}: the headline is not contained in its column and the viewport`);
  if (m.lines < lines[0] || m.lines > lines[1]) problems.push(`3 ${tag}: the headline sets in ${m.lines} lines (expected ${lines[0]}–${lines[1]}) at ${m.font}px`);
  if (m.scrollY !== 0 || m.cta.top < 0 || (ctaFull ? m.cta.bottom > h : m.cta.top > h * CTA_SHORT_SCROLL)) problems.push(`4 ${tag}: the CTA spans ${Math.round(m.cta.top)}–${Math.round(m.cta.bottom)}px in a ${h}px first screen — ${ctaFull ? 'not fully visible without scrolling' : `not within a short scroll (top edge past ${CTA_SHORT_SCROLL * 100}% of the screen)`}`);
  if (!narrow && (m.colLeft > LEFT_MAX || m.colRight < RIGHT_MIN)) problems.push(`5 ${tag}: the copy column runs ${(m.colLeft * 100).toFixed(0)}%–${(m.colRight * 100).toFixed(0)}% of the width — dead space beside a constrained column`);
  if (mark < MARK_FLOOR) problems.push(`6 ${tag}: the mark covers ${(mark * 100).toFixed(1)}% of ${narrow ? 'the band above the copy' : 'the right half'} — not visibly ${narrow ? 'above' : 'beside'} it`);
  if (narrow && (m.top > h * H1_TOP_MAX || m.bottom > h)) problems.push(`7 ${tag}: the H1 spans ${Math.round(m.top)}–${Math.round(m.bottom)}px of a ${h}px first screen — it must start in the top ${Math.round(H1_TOP_MAX * 100)}% and end inside it`);
  if (m.h1s !== 1 || m.text !== PROPOSITION) problems.push(`8 ${tag}: ${m.h1s} H1(s), the first reading "${m.text}" — not the one approved proposition`);
  if (m.units.length !== 2 || m.units.some((n) => n !== 1) || m.kickerRows > 2) problems.push(`9 ${tag}: the kicker's ${m.units.length} unit(s) set in ${m.units.join('+')} line(s) — broken inside a unit`);
  rows.push(`  ${tag.padEnd(10)} ${String(Math.round(m.font)).padStart(4)}px ${m.lines} lines  H1 ${Math.round(m.top)}–${Math.round(m.bottom)} (starts at ${Math.round((m.top / h) * 100)}%)  CTA ${Math.round(m.cta.top)}–${Math.round(m.cta.bottom)}/${h}  kicker ${m.kickerRows} row(s)  mark ${(mark * 100).toFixed(1)}% of the ${narrow ? 'band above' : 'right half'}${narrow ? '' : `  column ${(m.colLeft * 100).toFixed(0)}–${(m.colRight * 100).toFixed(0)}%`}`);
  await page.close();
}
await browser.close();

console.log('check-master-hero: headline size, lines, H1 position, CTA against the first screen, kicker, mark, column\n');
for (const r of rows) console.log(r);
const ALL = NARROW.length + SIZES.length;
if (rows.length !== ALL) problems.push(`measured ${rows.length} of ${ALL} sizes — an unmeasured size is not a pass`);
if (problems.length) {
  console.error(`\ncheck-master-hero: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`\ncheck-master-hero: ${NARROW.length} phone/tablet and ${SIZES.length} desktop sizes — one approved H1, contained, early on phones, the CTA in the first screen, the kicker whole, the column using the frame, the mark beside or above the copy\n`);
