#!/usr/bin/env node
/**
 * check-master-scene — the Master scene is visible, moves, stays readable and degrades. `GS-R001-M`.
 *
 * Replaces `check:mark:field`, whose subject (`BackgroundMark`) the owner rejected at `GS-O008`.
 * The owner's complaint about that layer was not that it was broken — every gate on it was
 * green — but that it was **hard to notice, hidden behind most sections and static in
 * feeling**. So this gate asks those questions, from **rendered pixels**, at every chapter:
 *
 * | # | Question |
 * |---|---|
 * | 1 | Is the layer decorative — `aria-hidden`, nothing focusable, no pointer events, outside `<main>`? |
 * | 2 | Did WebGL start (`data-render="ready"`)? |
 * | 3 | **Is the mark visible at every chapter?** Gold pixels, measured with the page's content hidden, above a floor. |
 * | 4 | **Does it move with the page?** Consecutive chapters must differ; under reduced motion, hero and close must not. |
 * | 5 | **Is every line of text readable over it?** Each text element's own colour against the 98th-percentile luminance of the rendered scene behind it. |
 * | 6 | No horizontal overflow at any chapter. |
 * | 7 | **Fallback** — with WebGL unavailable, the owner's static logo is shown and the page is intact. |
 *
 * ## Why question 5 exists, and why axe cannot answer it
 *
 * Text on `/` sits over a `<canvas>`. axe cannot compute a background it cannot see and
 * reports those nodes *incomplete*, correctly. This measures what axe declines to: the
 * screenshot is taken twice, once as served and once with every glyph made transparent, and
 * each text box is compared against the second. The 98th percentile rather than the maximum,
 * so a single anti-aliased pixel of a bar's edge does not decide a paragraph.
 *
 * ## Proving it
 *
 * Each question is proven red in `docs/_shared/GS-R001-M-MASTER-REDESIGN.md` §8 by mutating
 * the committed subject and restoring from captured bytes. Question 3's floor is a count, and
 * it was proven to move to zero by hiding the canvas — a measured absence, not an assumed one.
 *
 * Expects a server already running at AXE_BASE_URL (default http://127.0.0.1:3000).
 */
import { launch } from './browser-launch.mjs';

const BASE_URL = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';
const CHAPTERS = ['hero', 'studios', 'context', 'process', 'reviews', 'close'];
/** Hardcoded, not read from the source: the widths the owner asked to see (§22). */
const VIEWPORTS = [
  [2560, 1440],
  [1440, 900],
  [1024, 768],
  [768, 1024],
  [375, 812],
];
/** Share of the viewport that must be gold at each chapter for the mark to count as visible. */
const VISIBLE_FLOOR = 0.01;
/** Consecutive chapters must differ by at least this share of the viewport. */
const MOTION_FLOOR = 0.02;
const SETTLE_MS = 1800;
/**
 * Hides the page's content so only the scene is measured. **`opacity`, not `visibility`** —
 * the first version used `visibility: hidden`, and descendants that declare `visibility:
 * visible` (the nav, the kicker, the button) stayed on screen and were counted as the mark.
 * It read as the scene moving under reduced motion, 2.12%, when the scene was identical.
 */
const HIDE_CONTENT = 'main, header, footer { opacity: 0 !important; }';

// Chrome no longer falls back to SwiftShader for WebGL on its own; a runner without a GPU needs
// it named. It is software rendering, which is slow but exact, and that is all a gate needs.
const browser = await launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const decoder = await browser.newPage();

const problems = [];
const log = [];

/** Decode a PNG screenshot in a CSP-free page and hand back what the questions need. */
async function analyse(pngBase64, boxes) {
  return decoder.evaluate(
    async (b64, boxes) => {
      const img = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
      const c = new OffscreenCanvas(img.width, img.height);
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const { data, width, height } = ctx.getImageData(0, 0, img.width, img.height);
      const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      const L = (i) => 0.2126 * lin(data[i]) + 0.7152 * lin(data[i + 1]) + 0.0722 * lin(data[i + 2]);
      let gold = 0;
      const mask = new Uint8Array(width * height);
      for (let p = 0, i = 0; p < width * height; p++, i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (r > 70 && r >= g && g > b && r - b > 30) { gold++; mask[p] = 1; }
      }
      const p98 = boxes.map(([x, y, w, h]) => {
        const ls = [];
        for (let yy = Math.max(0, y); yy < Math.min(height, y + h); yy++)
          for (let xx = Math.max(0, x); xx < Math.min(width, x + w); xx++) ls.push(L((yy * width + xx) * 4));
        ls.sort((a, b) => a - b);
        return ls.length ? ls[Math.floor(ls.length * 0.98)] : 0;
      });
      return { gold: gold / (width * height), mask: Array.from(mask), p98 };
    },
    pngBase64,
    boxes,
  );
}

async function openHome(width, height, { reduced = false, noWebGL = false } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }]);
  if (noWebGL) {
    await page.evaluateOnNewDocument(() => {
      const real = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
        return /webgl/i.test(type) ? null : real.call(this, type, ...rest);
      };
    });
  }
  // The consent notice is fixed over the bottom of the viewport and is not the subject.
  await page.setCookie({ name: 'gs_consent', value: '1', url: BASE_URL });
  const res = await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  if (!res || ![200, 304].includes(res.status())) throw new Error(`/ returned ${res?.status()}`);
  await page
    .waitForFunction(() => document.querySelector('[data-master-scene]')?.dataset.render, { timeout: 15000 })
    .catch(() => {});
  return page;
}

async function toChapter(page, name) {
  await page.evaluate((n) => {
    const el = document.querySelector(`[data-chapter="${n}"]`);
    const r = el.getBoundingClientRect();
    scrollTo(0, r.top + scrollY + Math.min(r.height, innerHeight) / 2 - innerHeight / 2);
  }, name);
  await new Promise((r) => setTimeout(r, SETTLE_MS));
}

/** Text boxes in the viewport, with each one's own colour luminance and size. */
const TEXT_BOXES = () => {
  const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const out = [];
  const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.textContent.trim()) continue;
    const el = node.parentElement;
    // Visually hidden text (`.sr-only`) is not on screen and has no background to measure.
    const own = el.getBoundingClientRect();
    if (own.width <= 1 || own.height <= 1) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) {
      if (r.bottom < 0 || r.top > innerHeight || r.width < 2) continue;
      const cs = getComputedStyle(el);
      const [R, G, B] = cs.color.match(/\d+(\.\d+)?/g).map(Number);
      const size = parseFloat(cs.fontSize);
      const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
      out.push({
        box: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
        L: 0.2126 * lin(R) + 0.7152 * lin(G) + 0.0722 * lin(B),
        min: large ? 3 : 4.5,
        text: node.textContent.trim().slice(0, 40),
      });
    }
  }
  return out;
};

const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

for (const [width, height] of VIEWPORTS) {
  const tag = `${width}x${height}`;
  const page = await openHome(width, height);

  // 1 — decorative.
  const shape = await page.evaluate(() => {
    const layer = document.querySelector('[data-master-scene]');
    if (!layer) return null;
    return {
      hidden: layer.getAttribute('aria-hidden') === 'true',
      focusable: layer.querySelectorAll('a,button,input,select,textarea,[tabindex]').length,
      pointer: getComputedStyle(layer).pointerEvents,
      inMain: !!layer.closest('main'),
      state: layer.dataset.render ?? '(unset)',
    };
  });
  if (!shape) {
    problems.push(`1 ${tag}: the scene layer is not in the document`);
    await page.close();
    continue;
  }
  if (!shape.hidden) problems.push(`1 ${tag}: the scene layer is not aria-hidden`);
  if (shape.focusable) problems.push(`1 ${tag}: the scene layer holds ${shape.focusable} focusable element(s)`);
  if (shape.pointer !== 'none') problems.push(`1 ${tag}: the scene layer takes pointer events`);
  if (shape.inMain) problems.push(`1 ${tag}: the scene layer is inside <main>`);

  // 2 — started.
  if (shape.state !== 'ready') {
    problems.push(`2 ${tag}: data-render is "${shape.state}", not "ready" — WebGL did not start`);
    await page.close();
    continue;
  }

  let previous = null;
  const row = [];
  for (const chapter of CHAPTERS) {
    await toChapter(page, chapter);

    // 6 — overflow.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (overflow > 0) problems.push(`6 ${tag} ${chapter}: ${overflow}px of horizontal overflow`);

    const boxes = await page.evaluate(TEXT_BOXES);

    // The scene alone: content hidden, so gold text and the gold button cannot count as the mark.
    await page.addStyleTag({ content: HIDE_CONTENT });
    const bare = await analyse(await page.screenshot({ encoding: 'base64' }), []);
    await page.evaluate((h) => document.querySelectorAll('style').forEach((s) => s.textContent === h && s.remove()), HIDE_CONTENT);

    // 3 — visible.
    if (bare.gold < VISIBLE_FLOOR) {
      problems.push(`3 ${tag} ${chapter}: the mark covers ${(bare.gold * 100).toFixed(2)}% of the viewport, under the ${VISIBLE_FLOOR * 100}% floor — it is there and nobody would see it`);
    }

    // 4 — moves between chapters.
    if (previous) {
      let diff = 0;
      for (let i = 0; i < bare.mask.length; i++) diff += bare.mask[i] !== previous[i];
      const share = diff / bare.mask.length;
      if (share < MOTION_FLOOR) problems.push(`4 ${tag} ${chapter}: only ${(share * 100).toFixed(2)}% of the frame changed since the previous chapter`);
    }
    previous = bare.mask;

    // 5 — every text box against the scene behind it, glyphs transparent.
    await page.addStyleTag({ content: 'main *, main *::before, main *::after { color: transparent !important; text-decoration-color: transparent !important; }' });
    const behind = await analyse(await page.screenshot({ encoding: 'base64' }), boxes.map((b) => b.box));
    await page.evaluate(() => document.querySelectorAll('style').forEach((s) => s.textContent.includes('color: transparent !important') && s.remove()));
    let worst = Infinity;
    boxes.forEach((b, i) => {
      const r = ratio(b.L, behind.p98[i]);
      if (r < worst) worst = r;
      if (r < b.min) problems.push(`5 ${tag} ${chapter}: "${b.text}" measures ${r.toFixed(2)}:1 over the scene, needs ${b.min}:1`);
    });
    row.push(`${chapter} ${(bare.gold * 100).toFixed(1)}%/${boxes.length ? worst.toFixed(1) : '—'}`);
  }
  log.push(`  ${tag.padEnd(10)} ${row.join('  ')}`);
  await page.close();
}

// 4 — reduced motion: still, and still there.
{
  const page = await openHome(1440, 900, { reduced: true });
  const state = await page.evaluate(() => document.querySelector('[data-master-scene]')?.dataset.render);
  const frames = [];
  for (const chapter of ['hero', 'close']) {
    await toChapter(page, chapter);
    await page.addStyleTag({ content: HIDE_CONTENT });
    frames.push(await analyse(await page.screenshot({ encoding: 'base64' }), []));
    await page.evaluate((h) => document.querySelectorAll('style').forEach((s) => s.textContent === h && s.remove()), HIDE_CONTENT);
  }
  let diff = 0;
  for (let i = 0; i < frames[0].mask.length; i++) diff += frames[0].mask[i] !== frames[1].mask[i];
  const share = diff / frames[0].mask.length;
  if (state !== 'ready') problems.push(`4 reduced: data-render is "${state}" — reduced motion must keep the composition, not drop it`);
  if (frames[0].gold < VISIBLE_FLOOR) problems.push('4 reduced: the static composition is not visible');
  if (share > 0.005) problems.push(`4 reduced: ${(share * 100).toFixed(2)}% of the frame changed between hero and close — it moved`);
  log.push(`  reduced    hero ${(frames[0].gold * 100).toFixed(1)}%, close identical to ${(100 - share * 100).toFixed(2)}%`);
  await page.close();
}

// 7 — no WebGL.
{
  const page = await openHome(1440, 900, { noWebGL: true });
  const fb = await page.evaluate(() => {
    const layer = document.querySelector('[data-master-scene]');
    const f = layer?.firstElementChild;
    return {
      state: layer?.dataset.render,
      display: f && getComputedStyle(f).display,
      image: f && getComputedStyle(f).backgroundImage,
      h1: document.querySelector('main h1')?.textContent ?? '',
    };
  });
  if (fb.state !== 'fallback') problems.push(`7: without WebGL data-render is "${fb.state}", not "fallback"`);
  if (fb.display === 'none' || !/gridsmith-logo\.svg/.test(fb.image ?? '')) problems.push('7: without WebGL the static logo is not shown');
  if (!fb.h1) problems.push('7: without WebGL the page lost its content');
  log.push(`  no WebGL   ${fb.state}, ${/gridsmith-logo\.svg/.test(fb.image ?? '') ? 'owner logo shown' : 'NO LOGO'}`);
  await page.close();
}

await browser.close();

console.log('check-master-scene: gold share of viewport / worst text contrast over the scene, per chapter\n');
for (const l of log) console.log(l);
if (problems.length > 0) {
  console.error(`\ncheck-master-scene: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`\ncheck-master-scene: ${VIEWPORTS.length} viewports × ${CHAPTERS.length} chapters, reduced motion and no-WebGL — all 7 questions pass\n`);
