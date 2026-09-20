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
 * | 9 | **The fallback is never the LCP element** — CI measured mobile LCP 3,385ms when the fallback was a background image that appeared after the capability check. |
 * | 10 | **Is the scene unobscured by the page's own surfaces?** (R1 — the owner could not see it on mobile behind full-width veils, nor at the bottom behind the footer.) The share of the scene's visible gold that survives with the page's backgrounds drawn — text made transparent, so dimming behind glyphs is not counted against it. Measured at every chapter and at the very bottom, footer included. |
 * | 11 | **Does the exploded chapter open the mark into the frame?** (R1) The rendered gold's bounding box at the exploded chapter against the hero's. |
 * | 8 | **Software WebGL is declined** — on this GPU-less browser, `/` without the test opt-in falls back, and the page carries no long main-thread task (CI measured TBT 41,960ms before this existed). |
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
  [1280, 720],
  [1024, 768],
  [768, 1024],
  // R1: the owner's phone widths.
  [430, 932],
  [412, 915],
  [390, 844],
  [375, 812],
  [360, 800],
  [320, 568],
];
/** Share of the scene's visible gold that must survive the page's own backgrounds (question 10). */
const UNOBSCURED_FLOOR = 0.6;
/** The exploded chapter's rendered gold must span at least this multiple of the hero's (question 11). */
const EXPLODED_SPAN = 1.5;
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
// `protocolTimeout`: software rendering competes with the browser's own protocol traffic; the
// default 180s was enough by hand and not under the proof harness (`Network.enable timed out`).
const browser = await launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'], protocolTimeout: 600_000 });
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
      let x0 = width, y0 = height, x1 = 0, y1 = 0;
      for (let p = 0; p < mask.length; p++) if (mask[p]) { const x = p % width, y = (p / width) | 0; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      const bbox = x1 >= x0 ? ((x1 - x0) * (y1 - y0)) / (width * height) : 0;
      return { gold: gold / (width * height), mask: Array.from(mask), p98, bbox };
    },
    pngBase64,
    boxes,
  );
}

async function openHome(width, height, { reduced = false, noWebGL = false, optIn = true } = {}) {
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
  // `?scene=software`: this runner has no GPU, and the scene declines software WebGL for real
  // visitors (GS-R001-M — TBT 41,960ms when it did not). The opt-in lets the gate see the scene
  // it exists to measure; the no-WebGL case below measures what a GPU-less visitor gets.
  await page.evaluateOnNewDocument(() => {
    window.__lcpInScene = null;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__lcpInScene = !!e.element?.closest?.('[data-master-scene]');
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    window.__longTasks = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__longTasks += Math.max(0, e.duration - 50);
    }).observe({ type: 'longtask', buffered: true });
  });
  // `load`, then the scene's own render attribute below — not `networkidle0`. The first version
  // waited for network idle, and with the canvas hidden (the question-3 probe) the page never
  // reached it: the gate crashed on a navigation timeout and measured nothing, which the proof
  // harness correctly reported as NOT RUN rather than as a reading.
  const res = await page.goto(`${BASE_URL}/${optIn ? '?scene=software' : ''}`, { waitUntil: 'load', timeout: 60000 });
  if (!res || ![200, 304].includes(res.status())) throw new Error(`/ returned ${res?.status()}`);
  await page
    .waitForFunction(() => document.querySelector('[data-master-scene]')?.dataset.render, { timeout: 15000 })
    .catch(() => {});
  return page;
}

async function toChapter(page, name) {
  await page.evaluate((n) => {
    if (n === 'bottom') return scrollTo(0, document.documentElement.scrollHeight);
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
  // `main` and, since R1 made it transparent over the scene on `/`, the footer.
  for (const root of [document.querySelector('body > header'), document.querySelector('main'), document.querySelector('body > footer')].filter(Boolean)) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
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
      // Only text that is actually painted on top at its own position. A review card turned away
      // from the reader is backface-hidden — its text has boxes and no pixels — and the first R1
      // run measured those at 1.00:1. Text covered by an opaque surface is question 10's subject.
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      if (!hit || !(el === hit || el.contains(hit) || hit.contains(el))) continue;
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
  let heroBox = null;
  const row = [];
  // `bottom` is the end of the page, footer in view — where the owner saw the mark cut off.
  for (const chapter of [...CHAPTERS, 'bottom']) {
    await toChapter(page, chapter);

    // A DOM rectangle and its background capture must describe the same pose.
    // Slow software-rendered captures can span the carousel's six-second dwell.
    // Use its shipped pause control; motion itself is checked by check:reviews:ui.
    if (chapter === 'reviews') {
      await page.evaluate(() => {
        const button = [...document.querySelectorAll('button')]
          .find((el) => el.textContent?.trim() === 'Pause rotation');
        if (!button) throw new Error('Review pause control missing');
        if (button.getAttribute('aria-pressed') !== 'true') button.click();
      });
      await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));
    }

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

    // 11 — the exploded chapter opens the mark into the frame.
    if (chapter === 'hero') heroBox = bare.bbox;
    if (chapter === 'context' && heroBox && bare.bbox < heroBox * EXPLODED_SPAN) {
      problems.push(`11 ${tag} context: the exploded mark spans ${(bare.bbox * 100).toFixed(1)}% of the frame against the hero's ${(heroBox * 100).toFixed(1)}% — not opened into the space`);
    }

    // 4 — moves between chapters. The bottom holds the close's pose on purpose, so it is exempt.
    if (previous && chapter !== 'bottom') {
      let diff = 0;
      for (let i = 0; i < bare.mask.length; i++) diff += bare.mask[i] !== previous[i];
      const share = diff / bare.mask.length;
      if (share < MOTION_FLOOR) problems.push(`4 ${tag} ${chapter}: only ${(share * 100).toFixed(2)}% of the frame changed since the previous chapter`);
    }
    previous = bare.mask;

    // 5 — every text box against the scene behind it, glyphs transparent.
    await page.addStyleTag({ content: ':is(header, main, footer) *, :is(header, main, footer) *::before, :is(header, main, footer) *::after { color: transparent !important; text-decoration-color: transparent !important; }' });
    const behind = await analyse(await page.screenshot({ encoding: 'base64' }), boxes.map((b) => b.box));

    // 10 — the page's own surfaces leave the scene visible. Same frame, text transparent: what is
    // left between the reader and the scene is backgrounds, veils and panels.
    let kept = 0;
    let seen = 0;
    for (let i = 0; i < bare.mask.length; i++) if (bare.mask[i]) { seen++; if (behind.mask[i]) kept++; }
    const unobscured = seen ? kept / seen : 1;
    if (seen && unobscured < UNOBSCURED_FLOOR) {
      problems.push(`10 ${tag} ${chapter}: only ${(unobscured * 100).toFixed(0)}% of the visible scene survives the page's own backgrounds — something opaque is covering it`);
    }
    await page.evaluate(() => document.querySelectorAll('style').forEach((s) => s.textContent.includes('color: transparent !important') && s.remove()));
    let worst = Infinity;
    boxes.forEach((b, i) => {
      const r = ratio(b.L, behind.p98[i]);
      if (r < worst) worst = r;
      if (r < b.min) problems.push(`5 ${tag} ${chapter}: "${b.text}" measures ${r.toFixed(2)}:1 over the scene, needs ${b.min}:1`);
    });
    row.push(`${chapter} ${(bare.gold * 100).toFixed(1)}%/${Math.round(unobscured * 100)}%/${boxes.length ? worst.toFixed(1) : '—'}`);
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
      // The logo's geometry as vector shapes — 8 spheres and 6 bars (`FallbackMark`).
      shapes: f ? `${f.querySelectorAll('circle').length}/${f.querySelectorAll('rect').length}` : '0/0',
      h1: document.querySelector('main h1')?.textContent ?? '',
    };
  });
  if (fb.state !== 'fallback') problems.push(`7: without WebGL data-render is "${fb.state}", not "fallback"`);
  await page.addStyleTag({ content: HIDE_CONTENT });
  const fbFrame = await analyse(await page.screenshot({ encoding: 'base64' }), []);
  await page.evaluate((h) => document.querySelectorAll('style').forEach((s) => s.textContent === h && s.remove()), HIDE_CONTENT);
  if (fb.display === 'none' || fb.shapes !== '8/6') problems.push(`7: without WebGL the fallback mark is not drawn (display ${fb.display}, ${fb.shapes} spheres/bars, expected 8/6)`);
  else if (fbFrame.gold < VISIBLE_FLOOR) problems.push(`7: without WebGL the fallback mark covers ${(fbFrame.gold * 100).toFixed(2)}% of the viewport — drawn and not seen`);
  // 9 — a fallback that arrives late must not become the page's largest paint.
  const lcpInScene = await page.evaluate(() => window.__lcpInScene);
  if (lcpInScene) problems.push('9: without WebGL the LCP element is inside the scene layer — the fallback arrives after the capability check and delays LCP');
  if (!fb.h1) problems.push('7: without WebGL the page lost its content');
  log.push(`  no WebGL   ${fb.state}, fallback ${fb.shapes} spheres/bars covering ${(fbFrame.gold * 100).toFixed(1)}%, LCP ${lcpInScene ? 'IN THE SCENE LAYER' : 'outside the scene layer'}`);
  await page.close();
}

// 8 — software WebGL declined for a real visitor.
{
  const page = await openHome(1440, 900, { optIn: false });
  await new Promise((r) => setTimeout(r, 4000));
  const sw = await page.evaluate(() => ({
    state: document.querySelector('[data-master-scene]')?.dataset.render,
    blocking: Math.round(window.__longTasks),
  }));
  if (sw.state !== 'fallback') problems.push(`8: without the opt-in, software WebGL left data-render "${sw.state}" — a GPU-less visitor gets the software scene`);
  if (sw.blocking > 200) problems.push(`8: ${sw.blocking}ms of main-thread blocking on / without a GPU — the page is not usable`);
  log.push(`  software   ${sw.state}, ${sw.blocking}ms blocking beyond 50ms per task`);
  await page.close();
}

await browser.close();

console.log('check-master-scene: gold share of viewport / share unobscured by the page / worst text contrast, per position\n');
for (const l of log) console.log(l);
if (problems.length > 0) {
  console.error(`\ncheck-master-scene: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`\ncheck-master-scene: ${VIEWPORTS.length} viewports × ${CHAPTERS.length} chapters, reduced motion, no-WebGL and software-WebGL — all 11 questions pass\n`);
