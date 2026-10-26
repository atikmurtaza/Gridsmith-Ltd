import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// This reader is deliberately limited to the Writing demonstration's solid paper layers.
// Compose ink AND backing through each opacity group, rather than fading ink onto faded paper.
export function writingState(selector) {
  const parseColor = value => {
    if (!/^rgba?\(/.test(value)) throw Error(`Unsupported Writing colour: ${value}`);
    const c = value.match(/[\d.]+/g).map(Number);
    return [c[0], c[1], c[2], c[3] ?? 1];
  };
  const over = (a, b) => {
    const alpha = a[3] + b[3] * (1 - a[3]);
    return [...a.slice(0, 3).map((v, i) => alpha ? (v * a[3] + b[i] * b[3] * (1 - a[3])) / alpha : 0), alpha];
  };
  const lum = rgb => rgb.slice(0, 3).map(v => (v /= 255) <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
    .reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
  const ratio = (a, b) => (Math.max(lum(a), lum(b)) + .05) / (Math.min(lum(a), lum(b)) + .05);
  const rows = [];
  for (const card of document.querySelectorAll(selector)) {
    const cs = getComputedStyle(card), rect = card.getBoundingClientRect();
    const animations = card.getAnimations().map(a => ({ property: a.transitionProperty, time: a.currentTime,
      progress: a.effect.getComputedTiming().progress, state: a.playState, delay: a.effect.getTiming().delay }));
    for (const el of card.querySelectorAll(':scope > span')) {
      const style = getComputedStyle(el), range = document.createRange();
      range.selectNodeContents(el);
      let fg = parseColor(style.color), bg = [0, 0, 0, 0], opacity = 1;
      const layers = [], unsupported = [];
      for (let a = el; a; a = a.parentElement) {
        const s = getComputedStyle(a), background = parseColor(s.backgroundColor);
        layers.push({ class: a.className, background: s.backgroundColor, opacity: +s.opacity });
        if (s.filter !== 'none' || s.backdropFilter !== 'none' || s.mixBlendMode !== 'normal' || s.backgroundImage !== 'none') unsupported.push(a.className);
        fg = over(fg, background); bg = over(bg, background);
        fg[3] *= +s.opacity; bg[3] *= +s.opacity; opacity *= +s.opacity;
      }
      fg = over(fg, [255, 255, 255, 1]); bg = over(bg, [255, 255, 255, 1]);
      const bounds = [...range.getClientRects()].map(r => r.toJSON());
      const inViewport = bounds.some(r => r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth);
      const visible = el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) && opacity > 0;
      const state = !visible ? 'hidden' : !inViewport ? 'not-painted-in-viewport' : animations.some(a => a.progress !== null && a.progress < 1) ? 'entering' : 'settled';
      const hits = [], clipped = [];
      if (visible && inViewport) {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const node = walker.currentNode;
          for (let i = 0; i < node.length; i++) {
            if (!node.textContent[i].trim()) continue;
            range.setStart(node, i); range.setEnd(node, i + 1);
            const r = range.getBoundingClientRect(), x = (r.left + r.right) / 2, y = (r.top + r.bottom) / 2;
            if (y < 0 || y > innerHeight) continue;
            if (r.left < 0 || r.right > innerWidth) clipped.push(node.textContent[i]);
            const hit = document.elementFromPoint(x, y);
            if (!el.contains(hit)) hits.push({ character: node.textContent[i], x, y, hit: hit?.className });
          }
        }
      }
      rows.push({ card: card.className, element: el.className, text: el.textContent, state, opacity,
        color: style.color, background: cs.backgroundColor, effectiveForeground: fg.slice(0, 3), effectiveBackground: bg.slice(0, 3),
        contrast: ratio(fg, bg), minimum: 4.5, rect: rect.toJSON(), bounds, translate: cs.translate, rotate: cs.rotate,
        animations, layers, unsupported, hits, clipped, semanticHidden: !!el.closest('[aria-hidden="true"]') });
    }
  }
  return { viewport: [innerWidth, innerHeight], dpr: devicePixelRatio, scroll: [scrollX, scrollY], rows };
}

function readable(snapshot) {
  const rows = snapshot.rows.filter(r => ['entering', 'settled'].includes(r.state));
  assert(rows.length, 'Writing: no painted subjects');
  for (const r of rows) {
    assert.equal(r.unsupported.length, 0, `${r.element}: unsupported paper compositing`);
    assert(r.contrast >= r.minimum, `${r.card} ${r.element}: contrast ${r.contrast.toFixed(2)}:1 < ${r.minimum}:1`);
    assert(!r.semanticHidden, `${r.element}: meaningful text hidden from assistive technology`);
    assert(r.rect.left >= 0 && r.rect.right <= snapshot.viewport[0], `${r.card}: paper clipped by viewport`);
    assert.equal(r.clipped.length, 0, `${r.card} ${r.element}: horizontal clipping`);
    assert.equal(r.hits.length, 0, `${r.card} ${r.element}: text overlap/clipping`);
  }
}

// Permanent adverse specimen: restore the original opacity mechanism on the real DOM and scroll lifecycle.
const originalFade = `
.pr-src { transition-property: opacity, translate, rotate, border-color, background-color; }
.pr-ch { transition-property: opacity, translate, background-color; }
.pr-motion .pr-writing:not(.pr-entered) :is(.pr-src, .pr-ch) { opacity: 0; }
`;

export async function proveWritingContrast(browser) {
  const proof = await browser.newPage();
  try {
    await proof.setContent('<main><div class="paper"><span>Ink</span></div></main>');
    await proof.$eval('main', el => { el.style.background = 'white'; });
    await proof.$eval('.paper', el => { el.style.background = 'white'; el.style.color = 'black'; });
    const opaque = await proof.evaluate(writingState, '.paper');
    assert.equal(opaque.rows[0].contrast, 21, 'Writing: opaque composition proof');
    readable(opaque);
    for (const [change, message] of [
      [r => { r.rect.left = -1; }, /paper clipped/],
      [r => { r.rect.right = opaque.viewport[0] + 1; }, /paper clipped/],
      [r => { r.clipped = ['x']; }, /horizontal clipping/],
      [r => { r.hits = [{ hit: 'overlapping subject' }]; }, /text overlap/],
      [r => { r.unsupported = ['filter']; }, /unsupported paper/],
      [r => { r.semanticHidden = true; }, /assistive technology/],
    ]) {
      const bad = structuredClone(opaque); change(bad.rows[0]);
      assert.throws(() => readable(bad), message);
    }
    await proof.$eval('.paper', el => { el.style.opacity = '.5'; });
    const faded = await proof.evaluate(writingState, '.paper');
    assert.deepEqual(faded.rows[0].effectiveForeground, [127.5, 127.5, 127.5]);
    assert.deepEqual(faded.rows[0].effectiveBackground, [255, 255, 255]);
    assert.throws(() => readable(faded), /contrast .* < 4.5/);
    await proof.$eval('main', el => { el.style.background = 'black'; });
    const darkUnderlay = await proof.evaluate(writingState, '.paper');
    assert.deepEqual(darkUnderlay.rows[0].effectiveForeground, [0, 0, 0]);
    assert.deepEqual(darkUnderlay.rows[0].effectiveBackground, [127.5, 127.5, 127.5]);
    await proof.$eval('.paper', el => { el.style.opacity = '0'; });
    assert.equal((await proof.evaluate(writingState, '.paper')).rows[0].state, 'hidden');
    assert.throws(() => readable({ rows: [] }), /no painted/);
  } finally { await proof.close(); }
  console.log('Writing composition and geometry failure specimens PASS');
}

export async function checkPressWriting(browser, base, { output = process.env.PRESS_WRITING_OUTPUT, baseline = false } = {}) {
  if (output) mkdirSync(output, { recursive: true });
  const results = [], version = await browser.version();
  await proveWritingContrast(browser);
  const save = (name, value) => { if (output) writeFileSync(join(output, name + '.json'), JSON.stringify(value, null, 2)); };
  async function capture(page, selector, id) {
    const before = await page.evaluate(writingState, selector);
    const prefix = selector.startsWith('.pr-src') ? 'pr-src' : 'pr-ch';
    assert.deepEqual(before.rows.map(r => r.element), prefix === 'pr-src'
      ? ['pr-src-n', 'pr-src-kind', 'pr-src-text'] : ['pr-ch-n', 'pr-ch-title', 'pr-ch-from'], 'Writing: missing text subject');
    const png = await page.screenshot({ encoding: 'base64', captureBeyondViewport: false });
    const after = await page.evaluate(writingState, selector);
    assert.deepEqual(after, before, 'Writing: capture state changed');
    // Raster corroboration uses the unmodified screenshot, never a synthetic marker or hash.
    const raster = await page.evaluate(async ({ png, rows }) => {
      const bitmap = await createImageBitmap(new Blob([Uint8Array.from(atob(png), c => c.charCodeAt(0))], { type: 'image/png' }));
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height), ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0);
      const pixels = ctx.getImageData(0, 0, bitmap.width, bitmap.height).data;
      return rows.map(row => {
        const colors = new Map();
        for (const r of row.bounds) for (let y = Math.max(0, Math.ceil(r.top)); y < Math.min(bitmap.height, Math.floor(r.bottom)); y++)
          for (let x = Math.max(0, Math.ceil(r.left)); x < Math.min(bitmap.width, Math.floor(r.right)); x++) {
            const i = (y * bitmap.width + x) * 4, rgb = [...pixels.slice(i, i + 3)], key = rgb.join(',');
            colors.set(key, (colors.get(key) ?? 0) + 1);
          }
        const ranked = [...colors].sort((a, b) => b[1] - a[1]);
        const paper = ranked[0]?.[0].split(',').map(Number);
        const delta = row.effectiveForeground.map((v, i) => v - row.effectiveBackground[i]);
        const denominator = delta.reduce((s, v) => s + v * v, 0);
        const ink = ranked.map(([key]) => {
          const rgb = key.split(',').map(Number);
          const coverage = rgb.reduce((s, v, i) => s + (v - row.effectiveBackground[i]) * delta[i], 0) / denominator;
          const error = Math.max(...rgb.map((v, i) => Math.abs(v - (row.effectiveBackground[i] + coverage * delta[i]))));
          return { rgb, coverage, error };
        }).filter(p => p.coverage >= .4 && p.coverage <= 1.05 && p.error <= 8);
        return { element: row.element, paper, inkPixels: ink.length, pixels: ranked.reduce((sum, r) => sum + r[1], 0) };
      });
    }, { png, rows: before.rows });
    if (output) writeFileSync(join(output, id + '.png'), Buffer.from(png, 'base64'));
    const receipt = { browser: version, ...before, raster };
    save(id, receipt);
    return receipt;
  }
  async function run(width, height, group, index, mode, adverse) {
    const context = await browser.createBrowserContext(), page = await context.newPage();
    const selector = `.${group}-${index}`, id = `${width}-${group}-${index}-${mode}${adverse ? '-adverse' : ''}`;
    try {
      await page.setViewport({ width, height, deviceScaleFactor: 1 });
      await page.setCookie({ name: 'gs_consent', value: '1', url: base });
      await page.setRequestInterception(true);
      page.on('request', r => new URL(r.url()).origin === new URL(base).origin || /^(data|blob):/.test(r.url()) ? r.continue() : r.abort());
      if (mode === 'reduced') await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      if (mode === 'no-JS') await page.setJavaScriptEnabled(false);
      assert.equal((await page.goto(base + '/press', { waitUntil: 'networkidle0' })).status(), 200);
      await page.evaluate(() => document.fonts.ready);
      assert.deepEqual(await page.$$eval(`.${group}`, es => es.map(e => e.className)), Array.from({ length: 5 }, (_, i) => `${group} ${group}-${i + 1}`));
      if (adverse) await page.addStyleTag({ content: originalFade });
      // Let initial enhancement finish offscreen; this is not an entrance sample.
      if (mode === 'motion') await new Promise(r => setTimeout(r, 2200));
      await page.evaluate(source => { window.__writingState = new Function('return (' + source + ')')(); }, writingState.toString());
      const observed = await page.evaluate(async ({ selector, mode }) => {
        const target = document.querySelector(selector), section = target.closest('.pr-writing');
        const initialEntered = section.classList.contains('pr-entered');
        target.scrollIntoView({ block: 'center', behavior: 'instant' });
        const frames = [];
        if (mode === 'no-JS') return { initialEntered, frame: 0, frames: [window.__writingState(selector)] };
        for (let frame = 0; frame < 300; frame++) {
          await new Promise(r => requestAnimationFrame(r));
          const snapshot = window.__writingState(selector); frames.push(snapshot);
          const movement = target.getAnimations().find(a => a.transitionProperty === 'translate');
          const progress = movement?.effect.getComputedTiming().progress;
          if (mode !== 'motion' || (section.classList.contains('pr-entered') && progress > .2 && progress < .65)) {
            document.getAnimations().forEach(a => a.pause());
            return { initialEntered, frame, progress, frames };
          }
        }
        throw Error('Writing: natural nonzero entrance not reached within 300 frames');
      }, { selector, mode });
      save(id + '-frames', observed);
      const entering = await capture(page, selector, id);
      if (mode !== 'motion') {
        assert.equal(await page.$eval('.pr-home', el => el.classList.contains('pr-motion')), false, 'Writing: static mode enhanced');
        assert(entering.rows.every(r => !r.animations.length && r.translate === 'none' && r.rotate === 'none'), 'Writing: static mode moved');
      }
      if (mode === 'motion') {
        assert.equal(observed.initialEntered, false, 'Writing: entrance was already settled');
        assert(observed.progress > 0 && observed.progress < 1, 'Writing: zero/settled entrance');
      }
      if (adverse || baseline) {
        assert.throws(() => readable(entering), /contrast .* < 4.5/, 'Original visible opacity must fail the contrast assertion');
      } else {
        for (const frame of observed.frames) readable(frame);
        readable(entering);
        assert(entering.rows.every(r => r.opacity === 1), 'Writing: fractional ink/paper opacity');
        for (const pixel of entering.raster) {
          const row = entering.rows.find(r => r.element === pixel.element);
          assert(pixel.pixels > 0 && pixel.inkPixels > 0, `${id} ${pixel.element}: painted ink not corroborated`);
          assert(pixel.paper && pixel.paper.every((v, i) => Math.abs(v - row.effectiveBackground[i]) <= 3), `${id}: paper/background mismatch`);
        }
      }
      if (mode === 'motion' && !adverse && !baseline) {
        const remaining = await page.evaluate(async selector => {
          document.getAnimations().forEach(a => a.play());
          const frames = [], target = document.querySelector(selector);
          for (let i = 0; i < 300; i++) {
            await new Promise(r => requestAnimationFrame(r));
            frames.push(window.__writingState(selector));
            if (!target.getAnimations().length) return frames;
          }
          throw Error('Writing: entrance did not finish within 300 frames');
        }, selector);
        save(id + '-remaining-frames', remaining);
        for (const frame of remaining) readable(frame);
        await page.evaluate(() => document.getAnimations().forEach(a => a.pause()));
        const settled = await capture(page, selector, id + '-settled');
        readable(settled);
        assert(settled.rows.every(r => r.state === 'settled' && r.opacity === 1), 'Writing: did not settle');
      }
      results.push({ id, pass: true, minimum: Math.min(...entering.rows.map(r => r.contrast)), adverse: adverse || baseline });
    } catch (error) {
      results.push({ id, pass: false, error: error.stack });
    } finally {
      await context.close();
      save('writing-results', { browser: version, results });
      const result = results.at(-1);
      console.log(`Writing ${id}: ${result.pass ? 'PASS' : result.error}`);
    }
  }
  for (const [width, height] of [[1440, 900], [390, 844], [320, 844]]) {
    for (const group of ['pr-src', 'pr-ch']) {
      if (baseline) await run(width, height, group, 3, 'motion', false);
      else {
        for (let i = 1; i <= 5; i++) for (const mode of ['motion', 'reduced', 'no-JS']) await run(width, height, group, i, mode, false);
        await run(width, height, group, 3, 'motion', true);
      }
    }
  }
  save('writing-results', { browser: version, results });
  assert(results.length === (baseline ? 6 : 96), 'Writing: incomplete matrix');
  assert(results.every(r => r.pass), 'Writing: contrast/geometry regression (see writing-results.json)');
  return results;
}
