#!/usr/bin/env node
/** GS-R12-A11Y-FIX-001: native footer focus and live scene preference regressions.
 * Run against a local production build with AXE_BASE_URL and A11Y_EVIDENCE_DIR.
 * No Q5 estimator, screenshot mutations, full scene matrix or external requests.
 */
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { launch } from './browser-launch.mjs';

const base = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';
assert(['127.0.0.1', 'localhost', '[::1]'].includes(new URL(base).hostname), 'Loopback only');
const out = resolve(process.env.A11Y_EVIDENCE_DIR ?? 'build/master-accessibility');
mkdirSync(out, { recursive: true });
const results = [];
const save = (name, data) => writeFileSync(resolve(out, `${name}.json`), JSON.stringify(data, null, 2));
// Exercise actual WebGL on GPU-less Linux through the existing scene test affordance.
const browser = await launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
const frames = (page, count = 2) => page.evaluate(n => new Promise(done => {
  const tick = () => --n ? requestAnimationFrame(tick) : done();
  requestAnimationFrame(tick);
}), count);

async function open(viewport, route = '/', reduced = false) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width: viewport[0], height: viewport[1], deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduced ? 'reduce' : 'no-preference' }]);
  await page.setRequestInterception(true);
  page.on('request', r => ['data:', 'blob:'].includes(new URL(r.url()).protocol) || new URL(r.url()).origin === new URL(base).origin ? r.continue() : r.abort());
  page.on('pageerror', error => results.push({ error: error.message, route, viewport }));
  // Observe real resource allocation/release; do not change rendering or media-query results.
  await page.evaluateOnNewDocument(() => {
    window.__sceneResources = { programs: 0, deletedPrograms: 0, buffers: 0, deletedBuffers: 0, shaders: 0, deletedShaders: 0, draws: 0 };
    for (const [method, counter] of Object.entries({ createProgram: 'programs', deleteProgram: 'deletedPrograms', createBuffer: 'buffers', deleteBuffer: 'deletedBuffers', createShader: 'shaders', deleteShader: 'deletedShaders', drawArrays: 'draws' })) {
      const original = WebGLRenderingContext.prototype[method];
      WebGLRenderingContext.prototype[method] = function (...args) {
        window.__sceneResources[counter]++;
        return original.apply(this, args);
      };
    }
  });
  const response = await page.goto(base + route, { waitUntil: 'networkidle0' });
  assert.equal(response.status(), 200);
  await page.waitForFunction(() => !!document.documentElement.style.getPropertyValue('--consent-block-size'));
  await page.evaluate(() => document.fonts.ready);
  return { context, page };
}

async function tabTo(page, text) {
  for (let i = 0; i < 100; i++) {
    await page.keyboard.press('Tab');
    if (await page.evaluate(label => document.activeElement?.textContent?.trim() === label, text)) return;
  }
  throw Error(`Keyboard did not reach ${text}`);
}

async function focusState(page) {
  return page.evaluate(() => {
    const el = document.activeElement;
    const r = el.getBoundingClientRect();
    // GS-LAUNCH-026: a dismissed bar is hidden rather than removed; only a visible one can obscure.
    const bar = document.getElementById('gs-consent-heading')?.closest('[role="region"]');
    const b = bar?.checkVisibility() ? bar.getBoundingClientRect() : undefined;
    const css = getComputedStyle(el);
    const ring = parseFloat(css.outlineWidth) + parseFloat(css.outlineOffset);
    const points = [[r.left + 2, r.top + 2], [r.right - 2, r.top + 2], [r.left + 2, r.bottom - 2], [r.right - 2, r.bottom - 2], [r.left + r.width / 2, r.top + r.height / 2]];
    return {
      label: el.textContent, rect: r.toJSON(), bar: b?.toJSON(), focusVisible: el.matches(':focus-visible'),
      outline: { style: css.outlineStyle, width: css.outlineWidth, offset: css.outlineOffset, color: css.outlineColor },
      ringClear: r.top - ring >= 0 && r.left - ring >= 0 && r.right + ring <= innerWidth && r.bottom + ring <= (b?.top ?? innerHeight),
      hits: points.map(([x, y]) => { const hit = document.elementFromPoint(x, y); return { x, y, target: hit?.tagName, own: el === hit || el.contains(hit) }; }),
      scrollY, maxScroll: document.documentElement.scrollHeight - innerHeight, scrollWidth: document.documentElement.scrollWidth, width: innerWidth,
      reserve: getComputedStyle(document.documentElement).getPropertyValue('--consent-block-size'),
      footerPadding: getComputedStyle(document.querySelector('footer button').parentElement.parentElement).paddingBottom,
      footerHeight: document.querySelector('footer').getBoundingClientRect().height,
    };
  });
}

async function checkFocus(page, id) {
  const state = await focusState(page);
  save(id, state);
  await page.screenshot({ path: resolve(out, `${id}.png`), captureBeyondViewport: false });
  assert.equal(state.label.trim(), 'Cookie notice');
  assert(state.focusVisible && state.outline.style !== 'none' && parseFloat(state.outline.width) > 0, 'Visible keyboard focus style');
  assert(state.ringClear, 'Footer focus ring obscured');
  assert(state.hits.every(h => h.own), 'Footer control fails actual hit tests');
  assert.equal(state.scrollWidth, state.width, 'Horizontal overflow');
  return state;
}

async function consent(viewport, route) {
  const id = `focus-${viewport[0]}-${route.replaceAll('/', '') || 'master'}`;
  const { context, page } = await open(viewport, route);
  try {
    await tabTo(page, 'Cookie notice');
    await frames(page);
    await checkFocus(page, `${id}-open`);
    await page.keyboard.press('End');
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await frames(page);
    const atEnd = await checkFocus(page, `${id}-end`);
    assert(Math.abs(atEnd.scrollY - atEnd.maxScroll) <= 1, 'Actual maximum scroll');
    await tabTo(page, 'Got it');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => !document.getElementById('gs-consent-heading')?.closest('[role="region"]')?.checkVisibility());
    await tabTo(page, 'Cookie notice');
    await frames(page);
    const dismissed = await checkFocus(page, `${id}-dismissed`);
    assert.equal(dismissed.reserve.trim(), '', 'Notice reserve removed on dismissal');
    for (let i = 0; i < 2; i++) {
      await page.keyboard.press('Enter');
      await page.waitForSelector('#gs-consent-heading', { visible: true });
      await frames(page);
      const reopened = await checkFocus(page, `${id}-reopened-${i}`);
      // Press's live editorial demo changes page height; measure the shared footer itself.
      assert.equal(reopened.footerHeight, atEnd.footerHeight, 'No cumulative footer space');
      assert.equal(reopened.footerPadding, atEnd.footerPadding, 'No cumulative footer padding');
      await tabTo(page, 'Got it');
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => !document.getElementById('gs-consent-heading')?.closest('[role="region"]')?.checkVisibility());
      await tabTo(page, 'Cookie notice');
      await frames(page);
      assert.equal((await focusState(page)).footerHeight, dismissed.footerHeight, 'Dismissed footer restored');
    }
    // A width change changes real wrapping; a font-size change tests ResizeObserver without resize.
    await page.keyboard.press('Enter');
    await page.waitForSelector('#gs-consent-heading', { visible: true });
    await frames(page, 3);
    if (route === '/press' && viewport[0] === 390) {
      // Focus remains in the footer when a reader deliberately scrolls away with the keyboard.
      await page.keyboard.down('Control');
      await page.keyboard.press('Home');
      await page.keyboard.up('Control');
      await page.waitForFunction(() => scrollY === 0);
      const manual = await page.evaluate(async () => {
        const before = document.body.getBoundingClientRect().height;
        let min = before, max = before, jumped = false;
        for (let i = 0; i < 600; i++) {
          await new Promise(done => requestAnimationFrame(done));
          const height = document.body.getBoundingClientRect().height;
          min = Math.min(min, height); max = Math.max(max, height);
          jumped ||= scrollY > 1;
        }
        return { before, min, max, jumped, scrollY, focused: document.activeElement.textContent };
      });
      save(`${id}-manual-scroll`, manual);
      assert(manual.max - manual.min > 1, 'Natural Press reflow must reach the observer');
      assert.equal(manual.focused.trim(), 'Cookie notice');
      assert(!manual.jumped, 'Body reflow must not pull a manually scrolled reader back to footer');
      await page.keyboard.down('Control');
      await page.keyboard.press('End');
      await page.keyboard.up('Control');
      await frames(page, 3);
    }
    await page.setViewport({ width: viewport[0] === 320 ? 390 : 320, height: viewport[1], deviceScaleFactor: 1 });
    await frames(page, 3);
    await checkFocus(page, `${id}-resized`);
    await page.$eval('#gs-consent-heading', el => { el.style.fontSize = '125%'; });
    await frames(page, 3);
    const grown = await checkFocus(page, `${id}-height-change`);
    assert(Math.abs(parseFloat(grown.reserve) - grown.bar.height) <= 1, 'Measured reserve tracks content height');
  } finally { await context.close(); }
}

async function poseState(page) {
  return page.evaluate(() => {
    const canvas = document.querySelector('[data-master-scene] canvas');
    const gl = canvas?.getContext('webgl');
    const program = gl?.getParameter(gl.CURRENT_PROGRAM);
    const pose = {};
    if (program) for (const name of [...Array.from({ length: 8 }, (_, i) => `uS[${i}]`), ...Array.from({ length: 6 }, (_, i) => `uA[${i}]`), ...Array.from({ length: 6 }, (_, i) => `uB[${i}]`), 'uCentre', 'uDist', 'uExposure', 'uShade', 'uEdge', 'uLight', 'uGlow']) {
      const value = gl.getUniform(program, gl.getUniformLocation(program, name));
      pose[name] = ArrayBuffer.isView(value) ? Array.from(value) : value;
    }
    return { pose, render: canvas?.parentElement.dataset.render, reduced: matchMedia('(prefers-reduced-motion: reduce)').matches, resources: { ...window.__sceneResources }, scrollY, time: performance.now() };
  });
}

async function pair(page, id) {
  const a = await poseState(page);
  await page.screenshot({ path: resolve(out, `${id}-a.png`), captureBeyondViewport: false });
  // Sixty browser paint opportunities observe motion over time; no wall-clock sleep/retry.
  await frames(page, 60);
  const b = await poseState(page);
  await page.screenshot({ path: resolve(out, `${id}-b.png`), captureBeyondViewport: false });
  save(id, { a, b });
  return [a, b];
}

async function motion(viewport) {
  const id = `motion-${viewport[0]}`;
  const initialVisit = await open(viewport, '/?scene=software', true);
  let initial;
  try {
    await initialVisit.page.waitForFunction(() => document.querySelector('[data-master-scene]')?.dataset.render === 'ready');
    const [first, still] = await pair(initialVisit.page, `${id}-initial-reduce`);
    initial = first;
    assert.deepEqual(initial.pose, still.pose, 'Initial reduced pose stays still');
    assert(Object.keys(initial.pose).length > 0, 'Actual WebGL uniforms required');
  } finally { await initialVisit.context.close(); }
  const { context, page } = await open(viewport, '/?scene=software');
  try {
    await page.waitForFunction(() => document.querySelector('[data-master-scene]')?.dataset.render === 'ready');
    for (let i = 0; i < 3; i++) {
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
      await frames(page, 3);
      const [normalA, normalB] = await pair(page, `${id}-normal-${i}`);
      assert.notDeepEqual(normalA.pose, normalB.pose, 'Normal scene motion restored');
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      await frames(page, 3);
      const [reducedA, reducedB] = await pair(page, `${id}-live-reduce-${i}`);
      assert.deepEqual(reducedA.pose, initial.pose, 'Live reduce restores approved hero pose');
      assert.deepEqual(reducedA.pose, reducedB.pose, 'Live reduce stays still');
      assert.equal(reducedB.resources.programs, initial.resources.programs, 'No renderer restart across toggles');
      assert.equal(reducedB.resources.draws, reducedA.resources.draws, 'No reduced render loop');
    }
    await page.evaluate(() => document.querySelector('[data-chapter="close"]').scrollIntoView());
    await frames(page, 3);
    const [scrolledA, scrolledB] = await pair(page, `${id}-reduced-scroll`);
    assert.deepEqual(scrolledA.pose, initial.pose, 'Scrolling preserves reduced hero pose');
    assert.deepEqual(scrolledB.pose, initial.pose, 'Scrolled reduced pose stays still');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
    await frames(page, 3);
    assert.notDeepEqual((await poseState(page)).pose, initial.pose, 'Normal chapter tracking restored');
  } finally { await context.close(); }
}

try {
  const cases = process.argv.includes('--manual-scroll-only') ? [{ id: 'consent 390 /press manual scroll', run: () => consent([390, 844], '/press') }] : process.argv.includes('--motion-only') ? [] : [[1440, 900], [390, 844], [320, 844]].flatMap(size => ['/', '/design', '/digital', '/press'].map(route => ({ id: `consent ${size[0]} ${route}`, run: () => consent(size, route) })));
  if (!process.argv.includes('--consent-only') && !process.argv.includes('--manual-scroll-only')) for (const size of [[1440, 900], [390, 844]]) cases.push({ id: `motion ${size[0]}`, run: () => motion(size) });
  for (const test of cases) {
    try { await test.run(); results.push({ test: test.id, passed: true }); console.log(`PASS ${test.id}`); }
    catch (error) { results.push({ test: test.id, passed: false, error: error.stack }); console.error(`FAIL ${test.id}: ${error.message}`); }
    save('results', results);
  }
} finally { await browser.close(); }
assert(results.length > 0 && results.every(r => r.passed), 'Targeted accessibility failures; see results.json');
