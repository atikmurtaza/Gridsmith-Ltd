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
 * | 12 | **Does the mark stay out from behind the footer?** (`GS-MASTER-001-F` — on phones the settled close sat behind the footer's contact and navigation text.) Across the close → footer handoff and at the bottom, the share of the footer's text boxes the bare scene paints gold. |
 * | 13 | **Is the scene's ring still through the reviews?** (`GS-MASTER-001-F` — two rings turning at once.) The bare scene a tenth of a chapter either side of the reviews pose, compared. |
 * | 14 | **Is every line readable over the fallback, all the way down?** (`GS-MASTER-001-RC` — 5 asks this of the WebGL scene, which dims behind text; the static fallback cannot, and while it stayed fixed every line of the page scrolled across its highlights at about 1:1, 44–60 text boxes per phone size. 7 only looked at the hero.) Question 5's method, without WebGL, at 25 scroll positions top to bottom. |
 *
 * ## Between the chapters, not only at them — `GS-MASTER-001-F`
 *
 * `GS-INT-001` watched gold cross the review controls, phone links and the footer **in transit**:
 * every settled pose was dimmed correctly and every reading here was green. So legibility (5) and
 * overflow (6) are asked at a third and two thirds of the way between every pair of chapters, and
 * the handoff (12) at a third and two thirds of the way from the settled close to the bottom — the
 * positions the scroll passes through, each held until its pose is the one that position has.
 * Visibility (3), motion (4), unobscured (10) and the exploded span (11) stay questions about the
 * settled poses: in transit the mark passes behind dense copy and the review cards for a moment,
 * which is travel, not the defect those questions exist for. The first run asked 3 and 10 in
 * transit too and went red on exactly that; those readings are what decided the split.
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
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const BASE_URL = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';
const CHAPTERS = ['hero', 'studios', 'context', 'process', 'reviews', 'close'];
/**
 * `MASTER_SCENE_VIEWPORTS=360x740,1440x900` narrows a run to those viewports — for the proof
 * harness only, where each probe reruns the gate. A filtered run says so on its last line, so it
 * cannot be read as the full gate.
 */
const ONLY = process.env.MASTER_SCENE_VIEWPORTS?.split(',') ?? null;
/** Fractions of the way between two chapter poses at which transit is sampled. */
const BETWEEN = [1 / 3, 2 / 3];
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
  // GS-MASTER-001-F: the short phone GS-INT-001 measured.
  [360, 740],
  [320, 568],
];
/** Share of the scene's visible gold that must survive the page's own backgrounds (question 10). */
const UNOBSCURED_FLOOR = 0.6;
/** The exploded chapter's rendered gold must span at least this multiple of the hero's (question 11). */
const EXPLODED_SPAN = 1.5;
/** Share of the footer's text boxes the bare scene may paint gold at the handoff (question 12). */
const FOOTER_GOLD_MAX = 0.02;
/** Share of the viewport that may change across ±0.1 chapter at the reviews ring (question 13). */
const STILL_MAX = 0.01;
/** Share of the viewport that must be gold at each chapter for the mark to count as visible. */
const VISIBLE_FLOOR = 0.01;
/** Consecutive chapters must differ by at least this share of the viewport. */
const MOTION_FLOOR = 0.02;
const SETTLE_MS = 1800;
/**
 * Hide every descendant explicitly: root opacity flattens the review drum's preserve-3d
 * compositor group. A root-only visibility rule leaked descendants declaring visible.
 */
const HIDE_CONTENT = 'main, header, footer, :is(main, header, footer) * { visibility: hidden !important; }';
/**
 * The scene with its text dimming removed at the source. The renderer dims the scene behind every
 * element in its text selector, and hiding the content leaves those boxes in place — so a
 * bare capture reads dimmed gold as no gold exactly where text is. Questions 12 and 13 ask about the
 * gold itself there, so the renderer's test affordance is switched on (`data-scene-undim` on
 * <html>, acknowledged as `data-undimmed` on the canvas) and a scroll event makes it redraw.
 *
 * Found by proof, twice. The first question 12 read the dimmed scene: 0.0% everywhere, and 0.0%
 * for the probe that held the mark behind the footer — the footer's text boxes are where the
 * dimming is. The second removed the dimming by scaling every text box to nothing, which also
 * hid the footer from the renderer's footer-aware lift, so the lift under test stopped acting and
 * the gate measured a page no visitor gets. The affordance touches the dimming and nothing else.
 */
async function bareUndimmed(page, q, tag, problems) {
  const redraw = async () => {
    await page.evaluate(() => dispatchEvent(new Event('scroll')));
    await new Promise((r) => setTimeout(r, SETTLE_MS));
  };
  await page.evaluate(() => document.documentElement.setAttribute('data-scene-undim', ''));
  await page.addStyleTag({ content: HIDE_CONTENT });
  await redraw();
  const acknowledged = await page.evaluate(() => document.querySelector('[data-master-scene] canvas')?.hasAttribute('data-undimmed'));
  if (!acknowledged) problems.push(`${q} ${tag}: the renderer did not acknowledge data-scene-undim — the gold behind text was not measured`);
  const frame = await analyse(await page.screenshot({ encoding: 'base64' }), []);
  await page.evaluate((h) => {
    document.querySelectorAll('style').forEach((s) => s.textContent === h && s.remove());
    document.documentElement.removeAttribute('data-scene-undim');
  }, HIDE_CONTENT);
  // Let the renderer dim again before anything else is measured.
  await redraw();
  return frame;
}

// Chrome no longer falls back to SwiftShader for WebGL on its own; a runner without a GPU needs
// it named. It is software rendering, which is slow but exact, and that is all a gate needs.
// `protocolTimeout`: software rendering competes with the browser's own protocol traffic; the
// default 180s was enough by hand and not under the proof harness (`Network.enable timed out`).
const browser = await launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'], protocolTimeout: 600_000 });
const decoder = await browser.newPage();

const problems = [];
const log = [];

/** Decode a PNG screenshot in a CSP-free page and hand back what the questions need. */
async function analyse(pngBase64, boxes, reviewMasks = [], reviewBoxes = []) {
  return decoder.evaluate(
    async (b64, boxes, reviewMasks, reviewBoxes) => {
      const img = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
      const c = new OffscreenCanvas(img.width, img.height);
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const { data, width, height } = ctx.getImageData(0, 0, img.width, img.height);
      const masks = await Promise.all(reviewMasks.map(async (b64) => {
        const img = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
        const canvas = new OffscreenCanvas(img.width, img.height);
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        return context.getImageData(0, 0, img.width, img.height).data;
      }));
      const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
      const L = (i) => 0.2126 * lin(data[i]) + 0.7152 * lin(data[i + 1]) + 0.0722 * lin(data[i + 2]);
      let gold = 0;
      const mask = new Uint8Array(width * height);
      for (let p = 0, i = 0; p < width * height; p++, i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (r > 70 && r >= g && g > b && r - b > 30) { gold++; mask[p] = 1; }
      }
      const p98 = boxes.map(([x, y, w, h], index) => {
        const ls = [];
        for (let yy = Math.max(0, y); yy < Math.min(height, y + h); yy++)
          for (let xx = Math.max(0, x); xx < Math.min(width, x + w); xx++) {
            const i = (yy * width + xx) * 4;
            // Perspective Range rectangles can extend beyond a clipped review card.
            // Two opposite text colours identify painted glyphs independently of
            // their real contrast; empty projected rectangles are not readable text.
            if (reviewBoxes[index] && masks.length === 2 &&
                ![0, 1, 2].every((c) => masks[1][i + c] - masks[0][i + c] > 16)) continue;
            ls.push(L(i));
          }
        ls.sort((a, b) => a - b);
        return ls.length ? ls[Math.floor(ls.length * 0.98)] : null;
      });
      let x0 = width, y0 = height, x1 = 0, y1 = 0;
      for (let p = 0; p < mask.length; p++) if (mask[p]) { const x = p % width, y = (p / width) | 0; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      const bbox = x1 >= x0 ? ((x1 - x0) * (y1 - y0)) / (width * height) : 0;
      return { gold: gold / (width * height), mask: Array.from(mask), p98, bbox };
    },
    pngBase64,
    boxes,
    reviewMasks,
    reviewBoxes,
  );
}

/** Measure only the glyph coverage of the perspective review cards. */
async function reviewGlyphMasks(page) {
  const masks = [];
  for (const colour of ['black', 'white']) {
    const style = await page.addStyleTag({ content: `[data-reviews-carousel] li * { color: ${colour} !important; }` });
    masks.push(await page.screenshot({ encoding: 'base64' }));
    await style.evaluate((el) => el.remove());
  }
  return masks;
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

/**
 * A chapter by name, `bottom`, or a position between two: `{ from, to, f }` is `f` of the way
 * from one chapter's pose to the next's, where the scene reads its position (`scene.ts`
 * `chapterAt`: the viewport's middle against each chapter's centre); `to: 'bottom'` runs from the
 * settled close to the end of the page.
 */
async function toChapter(page, pos) {
  await page.evaluate((p) => {
    const centre = (n) => {
      const r = document.querySelector(`[data-chapter="${n}"]`).getBoundingClientRect();
      return r.top + scrollY + Math.min(r.height, innerHeight) / 2 - innerHeight / 2;
    };
    const end = document.documentElement.scrollHeight - innerHeight;
    const at = (n) => (n === 'bottom' ? end : centre(n));
    if (typeof p === 'string') return scrollTo(0, at(p));
    scrollTo(0, at(p.from) + p.f * (at(p.to) - at(p.from)));
  }, pos);
  await new Promise((r) => setTimeout(r, SETTLE_MS));
}
const label = (pos) => (typeof pos === 'string' ? pos : `${pos.from}→${pos.to}@${pos.f.toFixed(2)}`);

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
    // GS-VIS-001-R1: text under an ancestor at opacity 0 is not painted (the review drum removes the
    // words of a label turned past 50°) — there is nothing on screen to measure. Any opacity above
    // zero is painted and measured as usual; the proof below holds both sides.
    let opacity = 1;
    for (let a = el; a && a !== root; a = a.parentElement) opacity *= Number(getComputedStyle(a).opacity);
    if (opacity === 0) continue;
    // ...and text beyond a sideways-clipping ancestor (the drum's stage) is not painted either: each
    // box is trimmed to the clip, so the background is sampled only where the glyphs actually are.
    let clip = null;
    for (let a = el.parentElement; a && a !== root; a = a.parentElement) {
      const ox = getComputedStyle(a).overflowX;
      if (ox === 'clip' || ox === 'hidden') { clip = a.getBoundingClientRect(); break; }
    }
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const raw of range.getClientRects()) {
      const left = clip ? Math.max(raw.left, clip.left) : raw.left;
      const right = clip ? Math.min(raw.right, clip.right) : raw.right;
      if (right - left < 2) continue;
      const r = { left, right, top: raw.top, bottom: raw.bottom, width: right - left, height: raw.height };
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
        review: !!el.closest('[data-reviews-carousel] li'),
        footer: !!el.closest('body > footer'),
        opacity,
      });
    }
  }
  }
  return out;
};

const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

// Prove both sides of the perspective-card correction without changing application CSS.
{
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.setContent('<style>body{background:var(--canvas);color:var(--ink);font:20px Arial} .clip{width:1px;height:1px;overflow:hidden} span{display:block;width:100px;height:24px}</style><main><div data-reviews-carousel><ul><li><span id="visible">Visible</span><div class="clip"><span id="clipped">Clipped</span></div></li></ul></div></main>');
  await page.evaluate(() => document.body.setAttribute('data-division', 'master'));
  await page.addStyleTag({ content: readFileSync('styles/themes/master.css', 'utf8') });
  const goodText = (await page.evaluate(TEXT_BOXES)).find((b) => b.text === 'Visible');
  const boxes = await page.$$eval('span', (els) => els.map((el) => {
    const r = el.getBoundingClientRect();
    return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)];
  }));
  const transparent = await page.addStyleTag({ content: 'span { color: transparent !important; }' });
  const background = await page.screenshot({ encoding: 'base64' });
  const masks = await reviewGlyphMasks(page);
  const sampled = await analyse(background, boxes, masks, [true, true]);
  await transparent.evaluate((el) => el.remove());
  const valid = goodText && sampled.p98[0] !== null && ratio(goodText.L, sampled.p98[0]) >= goodText.min;
  await page.addStyleTag({ content: '#visible { color: var(--canvas); }' });
  const brokenText = (await page.evaluate(TEXT_BOXES)).find((b) => b.text === 'Visible');
  const broken = brokenText && sampled.p98[0] !== null && ratio(brokenText.L, sampled.p98[0]) < brokenText.min;
  if (!valid || !broken || sampled.p98[1] !== null) throw new Error('Review glyph sampling proof failed');
  console.log('check-master-scene: visible text measured, clipped text excluded, low contrast proven red');
  await page.close();
}

// GS-VIS-001-R1: prove the two painted-text refinements in TEXT_BOXES by value, both sides each —
// text under opacity 0 is skipped while faded-but-painted text (opacity 0.3) is still measured, and
// text running past a sideways clip is trimmed to the clip, not dropped and not measured beyond it.
{
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.setContent('<style>body{margin:0;font:20px Arial} span{white-space:nowrap}</style><main>' +
    '<div style="opacity:0"><span>Ghost</span></div>' +
    '<div style="opacity:0.3"><span>Faint</span></div>' +
    '<div style="overflow-x:clip;width:60px;margin-left:40px"><span>Edgeword continues past the clip</span></div>' +
    '</main>');
  const boxes = await page.evaluate(TEXT_BOXES);
  const ghost = boxes.find((b) => b.text === 'Ghost');
  const faint = boxes.find((b) => b.text === 'Faint');
  const edge = boxes.find((b) => b.text.startsWith('Edgeword'));
  const trimmed = edge && edge.box[0] >= 40 && edge.box[0] + edge.box[2] <= 101;
  if (ghost || !faint || faint.opacity !== .3 || !trimmed) {
    throw new Error(`Painted-text proof failed: ghost ${!!ghost} (want false), faint ${!!faint} (want true), edge ${JSON.stringify(edge?.box)} (want within 40–100)`);
  }
  console.log('check-master-scene: unpainted (opacity 0) text skipped, faded text still measured, clipped text trimmed to its clip');
  await page.close();
}
// Every descendant is hidden, including a child with its own visible declaration; 3D grouping
// and geometry remain intact. The original root-only visibility fault is a permanent subject.
{
  const page = await browser.newPage();
  await page.setContent('<main style="transform-style:preserve-3d"><p style="visibility:visible">Capture specimen</p></main>');
  const before = await page.$eval('p', el => el.getBoundingClientRect().toJSON());
  const faulty = await page.addStyleTag({ content: 'main{visibility:hidden!important}' });
  if (await page.$eval('p', el => getComputedStyle(el).visibility) !== 'visible') throw new Error('Visibility leak proof was inert');
  await faulty.evaluate(el => el.remove());
  await page.addStyleTag({ content: HIDE_CONTENT });
  const after = await page.$eval('p', el => ({ box: el.getBoundingClientRect().toJSON(), visibility: getComputedStyle(el).visibility, parentOpacity: getComputedStyle(el.parentElement).opacity }));
  if (after.visibility !== 'hidden' || after.parentOpacity !== '1' || JSON.stringify(before) !== JSON.stringify(after.box)) throw new Error('Bare-scene hiding proof failed');
  await page.close();
  console.log('check-master-scene: explicit descendant visibility hides the bare-scene subject without flattening or moving geometry');
}
if (process.argv.includes('--prove-review-mask-only')) {
  await browser.close();
  process.exit(0);
}

const RUN = ONLY ? VIEWPORTS.filter(([w, h]) => ONLY.includes(`${w}x${h}`)) : VIEWPORTS;
if (ONLY && RUN.length !== ONLY.length) throw new Error(`MASTER_SCENE_VIEWPORTS names a viewport the gate does not hold: ${ONLY}`);
for (const [w0, h0] of RUN) {
  const tag = `${w0}x${h0}`;
  const page = await openHome(w0, h0);

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

  // A DOM rectangle and its background capture must describe the same pose, and slow software
  // captures can span the carousel's continuous turn (GS-VIS-001). Paused once, by its own control, before any
  // position is measured — transit positions see the carousel too. Its motion is check:reviews:ui's.
  await page.evaluate(() => {
    const button = [...document.querySelectorAll('button')].find((el) => el.getAttribute('aria-label') === 'Pause review rotation');
    if (!button) throw new Error('Review pause control missing');
    if (button.getAttribute('aria-pressed') !== 'true') button.click();
  });

  // Every chapter, the transit between each pair, then the close → footer handoff and the bottom.
  const positions = [];
  CHAPTERS.forEach((c, i) => {
    positions.push(c);
    const next = CHAPTERS[i + 1] ?? 'bottom';
    for (const f of BETWEEN) positions.push({ from: c, to: next, f });
  });
  positions.push('bottom');

  const [width, height] = [w0, h0];
  let previous = null;
  let heroBox = null;
  let transitWorst = Infinity;
  let footerWorst = 0;
  const row = [];
  for (const pos of positions) {
    const name = label(pos);
    const settled = typeof pos === 'string';
    await toChapter(page, pos);

    // 6 — overflow.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (overflow > 0) problems.push(`6 ${tag} ${name}: ${overflow}px of horizontal overflow`);

    const boxes = await page.evaluate(TEXT_BOXES);

    // The scene alone: content hidden, so gold text and the gold button cannot count as the mark.
    await page.addStyleTag({ content: HIDE_CONTENT });
    const bare = await analyse(await page.screenshot({ encoding: 'base64' }), []);
    await page.evaluate((h) => document.querySelectorAll('style').forEach((s) => s.textContent === h && s.remove()), HIDE_CONTENT);

    // 3 — visible, at every settled pose. Not in transit: a mark passing behind dense copy or the
    // review cards for a moment is not the defect this asks about — transit is asked about
    // legibility (5), overflow (6) and the handoff (12). One exemption, by design: below 1024px
    // the close carries the mark up and away with its chapter (GS-MASTER-001-F), so at the bottom
    // of a phone there is deliberately none; question 12 asks the property that replaced it.
    const narrowBottom = pos === 'bottom' && width < 1024;
    if (settled && !narrowBottom && bare.gold < VISIBLE_FLOOR) {
      problems.push(`3 ${tag} ${name}: the mark covers ${(bare.gold * 100).toFixed(2)}% of the viewport, under the ${VISIBLE_FLOOR * 100}% floor — it is there and nobody would see it`);
    }

    // 11 — the exploded chapter (the studios, since GS-MASTER-001-F) opens the mark into the frame.
    if (pos === 'hero') heroBox = bare.bbox;
    if (pos === 'studios' && heroBox && bare.bbox < heroBox * EXPLODED_SPAN) {
      problems.push(`11 ${tag} studios: the exploded mark spans ${(bare.bbox * 100).toFixed(1)}% of the frame against the hero's ${(heroBox * 100).toFixed(1)}% — not opened into the space`);
    }

    // 4 — moves between chapters. The bottom holds the close's pose on purpose, so it is exempt.
    if (settled && pos !== 'bottom') {
      if (previous) {
        let diff = 0;
        for (let i = 0; i < bare.mask.length; i++) diff += bare.mask[i] !== previous[i];
        const share = diff / bare.mask.length;
        if (share < MOTION_FLOOR) problems.push(`4 ${tag} ${name}: only ${(share * 100).toFixed(2)}% of the frame changed since the previous chapter`);
      }
      previous = bare.mask;
    }

    // 12 — the handoff: the mark is not behind the footer's text. Gold measured in the undimmed
    // scene, inside the footer's own text boxes, from the settled close to the bottom.
    const footerBoxes = boxes.filter((b) => b.footer);
    if (footerBoxes.length && (pos === 'bottom' || pos.to === 'bottom')) {
      const scene = await bareUndimmed(page, 12, tag, problems);
      let area = 0;
      let gold = 0;
      for (const { box: [x, y, w, h] } of footerBoxes)
        for (let yy = Math.max(0, y); yy < Math.min(height, y + h); yy++)
          for (let xx = Math.max(0, x); xx < Math.min(width, x + w); xx++) {
            area++;
            gold += scene.mask[yy * width + xx];
          }
      const share = area ? gold / area : 0;
      footerWorst = Math.max(footerWorst, share);
      if (share > FOOTER_GOLD_MAX) problems.push(`12 ${tag} ${name}: the mark paints ${(share * 100).toFixed(1)}% of the footer's text boxes gold — it sits behind the footer`);
    }

    // 5 — every text box against the scene behind it, glyphs transparent.
    await page.addStyleTag({ content: ':is(header, main, footer) *, :is(header, main, footer) *::before, :is(header, main, footer) *::after { color: transparent !important; text-decoration-color: transparent !important; }' });
    const background = await page.screenshot({ encoding: 'base64' });
    const capturedBoxes = await page.evaluate(TEXT_BOXES);
    if (JSON.stringify(boxes.map(b => [b.text, b.box])) !== JSON.stringify(capturedBoxes.map(b => [b.text, b.box]))) {
      throw new Error(`5 ${tag} ${name}: text geometry changed during background capture`);
    }
    const masks = boxes.some((b) => b.review) ? await reviewGlyphMasks(page) : [];
    const behind = await analyse(background, boxes.map((b) => b.box), masks, boxes.map((b) => b.review));

    // 10 — the page's own surfaces leave the scene visible. Same frame, text transparent: what is
    // left between the reader and the scene is backgrounds, veils and panels.
    let kept = 0;
    let seen = 0;
    for (let i = 0; i < bare.mask.length; i++) if (bare.mask[i]) { seen++; if (behind.mask[i]) kept++; }
    const unobscured = seen ? kept / seen : 1;
    // Settled poses only: in transit the mark passes behind the review cards' own veils, which
    // are the cards, not a page surface hiding the scene.
    if (settled && seen && unobscured < UNOBSCURED_FLOOR) {
      problems.push(`10 ${tag} ${name}: only ${(unobscured * 100).toFixed(0)}% of the visible scene survives the page's own backgrounds — something opaque is covering it`);
    }
    await page.evaluate(() => document.querySelectorAll('style').forEach((s) => s.textContent.includes('color: transparent !important') && s.remove()));
    let worst = Infinity;
    boxes.forEach((b, i) => {
      if (b.opacity !== 1) problems.push(`5 ${tag} ${name}: "${b.text}" is painted at ${b.opacity} opacity — foreground contrast must include compositing`);
      if (behind.p98[i] === null) {
        if (!b.review) problems.push(`5 ${tag} ${name}: no background pixels for "${b.text}"`);
        return;
      }
      const r = ratio(b.L, behind.p98[i]);
      if (r < worst) worst = r;
      if (r < b.min) problems.push(`5 ${tag} ${name}: "${b.text}" measures ${r.toFixed(2)}:1 over the scene, needs ${b.min}:1`);
      // GS-HOST-H4-G: a question-5 failure keeps the exact frame and box it measured, so a reading
      // that only CI produces can be examined (uploaded by CI as master-scene-evidence). Evidence
      // only — nothing here changes what passes.
      if (r < b.min) {
        const dir = '.artifacts/master-scene';
        const stem = `${dir}/q5-${tag}-${name}-${i}`.replace(/[^\w./-]+/g, '_');
        mkdirSync(dir, { recursive: true });
        writeFileSync(`${stem}.png`, Buffer.from(background, 'base64'));
        writeFileSync(`${stem}.json`, JSON.stringify({ tag, position: name, text: b.text, box: b.box, L: b.L, min: b.min, ratio: r, p98: behind.p98[i] }, null, 2));
      }
    });
    if (settled) row.push(`${name} ${(bare.gold * 100).toFixed(1)}%/${Math.round(unobscured * 100)}%/${boxes.length ? worst.toFixed(1) : '—'}`);
    else transitWorst = Math.min(transitWorst, worst);
  }
  // A transit sample that measured no text says nothing about legibility in transit.
  if (transitWorst === Infinity) problems.push(`5 ${tag}: no text was measured at any transit position — the between-chapter samples measured nothing`);
  row.push(`transit ×${positions.filter((p) => typeof p !== 'string').length} worst ${transitWorst.toFixed(1)}`);
  row.push(`footer gold ${(footerWorst * 100).toFixed(1)}%`);

  // 13 — the ring is still: a tenth of a chapter either side of the reviews pose, bare scene compared.
  // Undimmed (see bareUndimmed): the dimming follows the copy, which moves with the scroll even
  // when the ring does not — the first run of this question measured the copy moving, 1.2–7.6%.
  const still = [];
  for (const pos of [{ from: 'process', to: 'reviews', f: 0.9 }, { from: 'reviews', to: 'close', f: 0.1 }]) {
    await toChapter(page, pos);
    still.push((await bareUndimmed(page, 13, tag, problems)).mask);
  }
  let turned = 0;
  for (let i = 0; i < still[0].length; i++) turned += still[0][i] !== still[1][i];
  const turnedShare = turned / still[0].length;
  if (turnedShare > STILL_MAX) problems.push(`13 ${tag} reviews: ${(turnedShare * 100).toFixed(2)}% of the frame changed across ±0.1 chapter at the ring — it turns with the scroll`);
  row.push(`ring moved ${(turnedShare * 100).toFixed(2)}%`);
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

// 14 — the fallback, read top to bottom. Question 5's method; the subject must be the fallback.
for (const [w, h] of [[1440, 900], [768, 1024], [390, 844]]) {
  const tag = `${w}x${h}`;
  const page = await openHome(w, h, { noWebGL: true });
  const state = await page.evaluate(() => document.querySelector('[data-master-scene]')?.dataset.render);
  // GS-VIS-001: the review cylinder turns continuously, so the text boxes and the background
  // capture below would describe different poses. Paused by its own control, as question 5 is.
  await page.evaluate(() => {
    const button = [...document.querySelectorAll('button')].find((el) => el.getAttribute('aria-label') === 'Pause review rotation');
    if (!button) throw new Error('Review pause control missing');
    if (button.getAttribute('aria-pressed') !== 'true') button.click();
  });
  if (state !== 'fallback') {
    problems.push(`14 ${tag}: without WebGL data-render is "${state}" — the fallback was not the subject`);
    await page.close();
    continue;
  }
  const end = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  let measured = 0;
  let worst = Infinity;
  for (let i = 0; i <= 24; i++) {
    const y = Math.round((end * i) / 24);
    await page.evaluate((y) => scrollTo(0, y), y);
    await new Promise((r) => setTimeout(r, 100));
    const boxes = await page.evaluate(TEXT_BOXES);
    const hide = await page.addStyleTag({ content: ':is(header, main, footer) *, :is(header, main, footer) *::before, :is(header, main, footer) *::after { color: transparent !important; text-decoration-color: transparent !important; }' });
    const background = await page.screenshot({ encoding: 'base64' });
    await hide.evaluate((el) => el.remove());
    const behind = await analyse(background, boxes.map((b) => b.box));
    boxes.forEach((b, k) => {
      if (behind.p98[k] === null) return;
      measured++;
      const r = ratio(b.L, behind.p98[k]);
      worst = Math.min(worst, r);
      if (r < b.min) problems.push(`14 ${tag} fallback @${y}px: "${b.text}" measures ${r.toFixed(2)}:1 over the fallback mark, needs ${b.min}:1`);
    });
  }
  if (!measured) problems.push(`14 ${tag}: no text measured over the fallback — an unmeasured page is not a pass`);
  log.push(`  fallback   ${tag} 25 positions, ${measured} text boxes, worst ${worst.toFixed(1)}:1`);
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
console.log(`\ncheck-master-scene: ${ONLY ? `FILTERED — ${RUN.length} of ${VIEWPORTS.length}` : VIEWPORTS.length} viewports × ${CHAPTERS.length} chapters and ${CHAPTERS.length * BETWEEN.length} transit positions, the footer handoff, the still ring, reduced motion, no-WebGL read top to bottom and software-WebGL — all 14 questions pass\n`);
