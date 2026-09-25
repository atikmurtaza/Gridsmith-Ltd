/** GS-DIG-001 rendered invariants for /digital. It measures contrast, state, timing, motion
 * preferences and no-JS content; it does not claim aesthetic acceptance, which is the owner's.
 *
 * Why it exists: axe cannot resolve colour contrast on /digital. The persistent compass rail is
 * a positioned full-page layer (pointer-events: none, which axe's element stack ignores) and the
 * chapter copy veil is a pseudo-element, so axe returns "overlapped by another element" or "due
 * to a pseudo element" for the page's text. check-axe allows exactly those incompletes on
 * /digital only because this gate measures the rendered pixels under every visible text box at
 * every compass state — the same method as check:design:scene and Master's scene gate.
 *
 * --prove injects reversible browser-only faults and requires each assertion branch to fail.
 */
import { launch } from './browser-launch.mjs';

const base = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';
const PROVE = process.argv.includes('--prove');
// Owner-requested review sizes plus the smallest desktop that shows the map callouts and a
// narrow phone. Height matters: the map hold and the Final trigger are both height-relative.
const SIZES = [[1440, 900], [1280, 720], [1024, 768], [768, 1024], [390, 844], [360, 800]];
const DESTINATIONS = ['web', 'software', 'apps-interactive', 'automation-intelligence', 'operate-improve'];
const SERVICE_LINKS = 17;

const browser = await launch();
const decoder = await browser.newPage();
const errors = [];
const settle = (ms = 1500) => new Promise((r) => setTimeout(r, ms));

async function open(width, height, { reduced = false, saveData = false, js = true } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.setCookie({ name: 'gs_consent', value: '1', url: base });
  if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  if (saveData)
    await page.evaluateOnNewDocument(() =>
      Object.defineProperty(navigator, 'connection', { value: { saveData: true }, configurable: true }));
  if (!js) await page.setJavaScriptEnabled(false);
  page.on('pageerror', (e) => errors.push(`${width}x${height}: browser error ${e.message}`));
  const response = await page.goto(`${base}/digital`, { waitUntil: 'networkidle0' });
  if (![200, 304].includes(response?.status())) throw new Error(`/digital HTTP ${response?.status()}`);
  if (js) await page.waitForSelector('.dg-apertures[data-enhanced="true"]', { timeout: 10000 });
  return page;
}

const state = (page) => page.evaluate(() => {
  const s = document.querySelector('.dg-apertures');
  const links = [...s.querySelectorAll('.dg-compass-link')];
  const ring = s.querySelector('.dg-aperture-frame circle').getBoundingClientRect();
  return {
    mode: s.dataset.mode, active: s.dataset.active ?? null, motion: s.dataset.motion,
    instant: s.dataset.instant, ambient: s.dataset.ambient,
    gold: links.filter((l) => l.hasAttribute('data-active')).length,
    inert: s.querySelector('.dg-compass-nav').inert,
    ariaHidden: s.querySelector('.dg-compass-nav').getAttribute('aria-hidden'),
    labelsVisible: links.filter((l) => {
      const c = getComputedStyle(l.querySelector('.dg-compass-label'));
      return c.visibility === 'visible' && +c.opacity > .95;
    }).length,
    spin: getComputedStyle(s.querySelector('.dg-spin-one')).animationName,
    ring: [ring.width, ring.height],
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
});

// Scroll anchors for every compass state, as element + offset (in viewport heights). They are
// resolved at visit time, not up front: offscreen sections use content-visibility, so a section's
// final position is only known once the sections above it have rendered.
const anchors = () => {
  const out = [{ name: 'hero', sel: 'main.dg-home', off: 0, top: true, mode: 'hero' }];
  // Map: the reserved field's top has cleared the trigger line by a comfortable margin.
  out.push({ name: 'map', sel: '.dg-map-visual-space', off: -.1, mode: 'map' });
  DESTINATIONS.forEach((id, i) => {
    out.push({ name: `${id} header`, sel: `#${id}`, off: .1, mode: 'chapter', active: String(i + 1) });
    out.push({ name: `${id} services`, sel: `#${id} .dg-service-index`, off: -.3, mode: 'chapter', active: String(i + 1) });
  });
  out.push({ name: 'process', sel: '.dg-engagement', off: .1, mode: 'chapter', active: null });
  out.push({ name: 'final', sel: null, mode: 'final' });
  return out;
};

async function resolveY(page, anchor) {
  if (anchor.top) return 0;
  return page.evaluate(async ({ sel, off }) => {
    const el = document.querySelector(sel);
    const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    let y = 0;
    // Converge: scrolling near renders the sections above, which can move the target.
    for (let i = 0; i < 4; i++) {
      y = Math.max(0, el.getBoundingClientRect().top + scrollY + off * innerHeight);
      window.scrollTo(0, y);
      await frame();
    }
    return y;
  }, { sel: anchor.sel, off: anchor.off });
}

// Final is height- and layout-relative, so its anchor is found rather than computed: walk down
// from the CTA section until the instrument reports final, then a little past. The document
// bottom is not a subject — on a phone the CTA copy is off screen there and nothing is measured.
async function findFinal(page) {
  return page.evaluate(async () => {
    const s = document.querySelector('.dg-apertures');
    let y = document.querySelector('.dg-close').getBoundingClientRect().top + scrollY - innerHeight;
    const max = document.documentElement.scrollHeight;
    while (s.dataset.mode !== 'final' && y < max) {
      y += 24;
      window.scrollTo(0, y);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    }
    return y + innerHeight * .1;
  });
}

// Pixel contrast, as check:design:scene: record every visible, non-decorative text box, hide
// the glyphs, screenshot, and compare each text colour with the worst 2% of pixels under it.
async function textContrast(page) {
  await settle(700);
  const boxes = await page.evaluate(() => {
    const out = [];
    const root = document.querySelector('main.dg-home');
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode, el = node.parentElement;
      if (!node.textContent.trim() || el.closest('svg, [aria-hidden="true"], [inert]')) continue;
      if (!el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
      if (el.closest('details:not([open])') && !el.closest('summary')) continue;
      const c = getComputedStyle(el), range = document.createRange();
      range.selectNodeContents(node);
      for (const r of range.getClientRects()) {
        const left = Math.ceil(Math.max(r.left, 0)), top = Math.ceil(Math.max(r.top, 0));
        const right = Math.floor(Math.min(r.right, innerWidth)), bottom = Math.floor(Math.min(r.bottom, innerHeight));
        if (right - left < 2 || bottom - top < 2) continue;
        out.push({
          box: [left, top, right - left, bottom - top],
          rgb: c.color.match(/[\d.]+/g).slice(0, 3).map(Number),
          text: node.textContent.trim().slice(0, 40),
          min: parseFloat(c.fontSize) >= 24 || (parseFloat(c.fontSize) >= 18.66 && Number(c.fontWeight) >= 700) ? 3 : 4.5,
        });
      }
    }
    return out;
  });
  if (!boxes.length) return { boxes: 0, failures: ['no rendered text boxes measured'] };
  const hide = await page.addStyleTag({ content: 'main.dg-home *:not(svg):not(svg *){color:transparent!important;-webkit-text-fill-color:transparent!important;text-decoration-color:transparent!important;caret-color:transparent!important}' });
  const png = await page.screenshot({ encoding: 'base64' });
  await hide.evaluate((el) => el.remove());
  const failures = await decoder.evaluate(async (png, boxes) => {
    const img = await createImageBitmap(await (await fetch(`data:image/png;base64,${png}`)).blob());
    const canvas = new OffscreenCanvas(img.width, img.height), ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, img.width, img.height);
    const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    const lum = (rgb) => 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
    return boxes.flatMap(({ box: [x, y, w, h], rgb, text, min }) => {
      const values = [];
      for (let yy = Math.max(0, y); yy < Math.min(height, y + h); yy++)
        for (let xx = Math.max(0, x); xx < Math.min(width, x + w); xx++) {
          const i = (yy * width + xx) * 4;
          values.push(lum([data[i], data[i + 1], data[i + 2]]));
        }
      values.sort((a, b) => a - b);
      const fg = lum(rgb), bg = values[Math.floor(values.length * (fg > 0.5 ? 0.98 : 0.02))];
      const ratio = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
      return !values.length || ratio < min ? [`"${text}" ${ratio.toFixed(2)}:1, needs ${min}`] : [];
    });
  }, png, boxes);
  return { boxes: boxes.length, failures };
}

async function visit(page, anchor) {
  const y = anchor.sel === null ? await findFinal(page) : await resolveY(page, anchor);
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await settle();
  return state(page);
}

// ---- 1. States and rendered contrast across the matrix ------------------------------------
async function matrix(width, height, { fault } = {}) {
  const page = await open(width, height);
  if (fault === 'contrast') await page.addStyleTag({ content: '#web-title{color:var(--digital-dark)!important}' });
  const found = [];
  let measured = 0;
  for (const anchor of anchors()) {
    const s = await visit(page, anchor);
    if (fault === 'process' && anchor.name === 'process')
      await page.evaluate(() => { const a = document.querySelector('.dg-apertures'); a.dataset.active = '5'; a.querySelector('.dg-compass-link-5').setAttribute('data-active', ''); });
    const t = fault === 'process' && anchor.name === 'process' ? await state(page) : s;
    const where = `${width}x${height} ${anchor.name}`;
    if (t.mode !== anchor.mode) found.push(`${where}: mode ${t.mode}, expected ${anchor.mode}`);
    if (anchor.mode === 'chapter' && (t.active !== anchor.active || t.gold !== (anchor.active ? 1 : 0)))
      found.push(`${where}: active ${t.active} (${t.gold} marked), expected ${anchor.active ?? 'neutral'}`);
    if (anchor.mode === 'chapter' && (!t.inert || t.ariaHidden !== 'true')) found.push(`${where}: background compass is interactive`);
    if (anchor.mode === 'map' && t.active !== null) found.push(`${where}: map not neutral (${t.active})`);
    if (anchor.mode === 'map' && width >= 1024 && t.labelsVisible !== 5) found.push(`${where}: ${t.labelsVisible}/5 map callouts visible`);
    if (Math.abs(t.ring[0] - t.ring[1]) > 1) found.push(`${where}: ring ${t.ring.join('x')} is not circular`);
    if (t.overflow > 0) found.push(`${where}: ${t.overflow}px horizontal overflow`);
    const contrast = await textContrast(page);
    measured += contrast.boxes;
    found.push(...contrast.failures.map((f) => `${where}: pixel contrast ${f}`));
  }
  if (measured < 100) found.push(`${width}x${height}: only ${measured} text boxes measured`);
  await page.close();
  return { found, measured };
}

// ---- 2. R3-G map timing under continuous scroll (desktop) ---------------------------------
async function mapTiming({ fault } = {}) {
  const page = await open(1440, 900);
  if (fault === 'late') await page.addStyleTag({ content: ".dg-apertures[data-mode='map'] .dg-compass-label{transition-delay:1500ms!important}" });
  const r = await page.evaluate(async () => {
    const s = document.querySelector('.dg-apertures');
    const labels = [...s.querySelectorAll('.dg-compass-label')];
    const end = document.querySelector('#web').getBoundingClientRect().top + scrollY;
    const cx = () => { const b = s.getBoundingClientRect(); return Math.abs(b.left + b.width / 2 - document.documentElement.clientWidth / 2); };
    let t0 = performance.now(), prev = t0, complete = 0, numbersOnly = 0, map = 0;
    for (;;) {
      const now = await new Promise((f) => requestAnimationFrame(f));
      const dt = now - prev; prev = now;
      const y = Math.min(end, (now - t0) / 1000 * 1000);
      window.scrollTo(0, y);
      if (s.dataset.mode === 'map') {
        map += dt;
        const min = Math.min(...labels.map((l) => +getComputedStyle(l).opacity));
        if (cx() < 36 && min >= .95) complete += dt;
        if (cx() < 36 && min < .3) numbersOnly += dt;
      }
      if (y >= end) break;
    }
    return { map, complete, numbersOnly };
  });
  await page.close();
  const found = [];
  if (r.map < 400) found.push(`map state lasted ${Math.round(r.map)}ms at 1000px/s`);
  if (r.complete < 250) found.push(`complete map visible ${Math.round(r.complete)}ms at 1000px/s (needs 250)`);
  if (r.numbersOnly > 100) found.push(`numbers-only map for ${Math.round(r.numbersOnly)}ms`);
  return { found, r };
}

// ---- 2b. Lifecycle: anchor jump from the map, reverse scroll, resize across the breakpoint ---
async function lifecycle({ fault } = {}) {
  const page = await open(1440, 900);
  const found = [];
  await visit(page, anchors().find((a) => a.name === 'map'));
  // A real click on the map's 05 callout: the jump lands in never-rendered content.
  const target = await page.$('.dg-compass-link-5 .dg-compass-label');
  await target.click();
  await settle(1800);
  let s = await state(page);
  if (fault === 'stale') { await page.evaluate(() => { document.querySelector('.dg-apertures').dataset.active = '1'; }); s = await state(page); }
  if (s.mode !== 'chapter' || s.active !== '5') found.push(`anchor jump to 05: mode ${s.mode}, active ${s.active}`);
  // Reverse: back up to the hero, which must be interactive with a fresh sequence.
  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(1800);
  s = await state(page);
  if (s.mode !== 'hero' || s.inert || s.active === null) found.push(`reverse to hero: mode ${s.mode}, inert ${s.inert}, active ${s.active}`);
  // Resize across the stacked breakpoint inside a chapter; state must survive, nothing overflow.
  await visit(page, anchors().find((a) => a.name === 'software header'));
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await settle(1800);
  s = await state(page);
  // The phone layout is taller, so the same offset shows different content. The invariant is
  // no stale state: the instrument agrees with the chapter the content now puts at the 45% line.
  const expected = await page.evaluate((ids) => {
    let active = null;
    ids.forEach((id, i) => { if (document.getElementById(id).getBoundingClientRect().top <= innerHeight * .45) active = String(i + 1); });
    if (document.querySelector('.dg-engagement').getBoundingClientRect().top <= innerHeight * .45) active = null;
    return active;
  }, DESTINATIONS);
  if (s.mode !== 'chapter' || s.active !== expected || s.overflow > 0) found.push(`resize to 390 inside a chapter: mode ${s.mode}, active ${s.active}, content says ${expected}, overflow ${s.overflow}`);
  await page.close();
  return found;
}

// ---- 3. Live reduced motion and Save-Data --------------------------------------------------
async function preference(kind, { fault } = {}) {
  const page = await open(1440, 900, kind === 'reduced' ? { reduced: true } : { saveData: true });
  if (fault === 'spin') await page.addStyleTag({ content: '.dg-spin{animation:dg-spin 38s linear infinite!important}' });
  const found = [];
  const hero = await state(page);
  await settle(3400);
  const later = await state(page);
  if (hero.instant !== 'true' || hero.motion !== 'inactive') found.push(`${kind}: hero motion ${hero.motion}, instant ${hero.instant}`);
  if (later.active !== hero.active) found.push(`${kind}: hero autoplayed ${hero.active} → ${later.active}`);
  if (hero.spin !== 'none') found.push(`${kind}: ambient rotation ${hero.spin}`);
  const points = anchors();
  for (const anchor of points.filter((a) => ['map', 'web header', 'operate-improve header', 'process', 'final'].includes(a.name))) {
    const s = await visit(page, anchor);
    if (s.mode !== anchor.mode) found.push(`${kind} ${anchor.name}: mode ${s.mode}`);
    if (anchor.mode === 'chapter' && s.active !== anchor.active) found.push(`${kind} ${anchor.name}: active ${s.active}`);
    if (s.spin !== 'none') found.push(`${kind} ${anchor.name}: ambient rotation ${s.spin}`);
    if (anchor.mode === 'final') {
      await settle(3400);
      const f = await state(page);
      if (f.active !== s.active || f.motion !== 'inactive') found.push(`${kind} final autoplayed`);
    }
  }
  const nav = await page.evaluate(() => {
    const a = [...document.querySelectorAll('.dg-compass-link')].find((l) => l.dataset.destination === '3');
    a.click();
    return location.hash;
  });
  if (nav !== '#apps-interactive') found.push(`${kind}: compass link navigation reached ${nav}`);
  await page.close();
  return found;
}

// ---- 4. No-JS: the server HTML carries every essential route --------------------------------
function noJsProblems(html) {
  const count = (re) => (html.match(re) ?? []).length;
  const found = [];
  if (!/<h1[^>]*id="digital-title"/.test(html)) found.push('no-JS: hero heading missing');
  if (count(/<a class="dg-button" href="\/contact\?division=digital"/g) < 2) found.push('no-JS: hero and final enquiry CTAs missing');
  const map = html.match(/<nav class="dg-map-links"[\s\S]*?<\/nav>/)?.[0] ?? '';
  if ((map.match(/<a href="#/g) ?? []).length !== 5) found.push('no-JS: route map does not carry five links');
  for (const id of DESTINATIONS) if (!html.includes(`<section class="dg-chapter dg-chapter-${id}" id="${id}"`)) found.push(`no-JS: chapter ${id} missing`);
  const services = new Set(html.match(/href="\/digital\/services\/[a-z0-9-]+"/g) ?? []);
  if (services.size !== SERVICE_LINKS) found.push(`no-JS: ${services.size} service links, expected ${SERVICE_LINKS}`);
  if (count(/<section class="dg-engagement"/g) !== 1) found.push('no-JS: engagement route missing');
  if (!html.includes('id="close-title"')) found.push('no-JS: final CTA missing');
  return found;
}

try {
  const html = await (await fetch(`${base}/digital`)).text();
  if (PROVE) {
    const proofs = [
      ['contrast', async () => (await matrix(1440, 900, { fault: 'contrast' })).found.some((f) => f.includes('pixel contrast') && f.includes('Help people'))],
      ['process neutral', async () => (await matrix(1280, 720, { fault: 'process' })).found.some((f) => f.includes('process: active 5'))],
      ['map timing', async () => (await mapTiming({ fault: 'late' })).found.some((f) => f.includes('complete map'))],
      ['lifecycle state', async () => (await lifecycle({ fault: 'stale' })).some((f) => f.includes('anchor jump to 05'))],
      ['reduced-motion rotation', async () => (await preference('reduced', { fault: 'spin' })).some((f) => f.includes('ambient rotation'))],
      ['save-data rotation', async () => (await preference('save-data', { fault: 'spin' })).some((f) => f.includes('ambient rotation'))],
      ['no-JS links', async () => noJsProblems(html.replace(/href="\/digital\/services\/ecommerce"/g, 'href="/x"')).some((f) => f.includes('16 service links'))],
    ];
    for (const [name, proof] of proofs) {
      if (!(await proof())) errors.push(`proof did not go red: ${name}`);
      else console.log(`PROVEN RED ${name}`);
    }
  } else {
    let total = 0;
    for (const [w, h] of SIZES) {
      const { found, measured } = await matrix(w, h);
      total += measured;
      errors.push(...found);
      console.log(`${w}x${h}: ${measured} text boxes, states hero → map → 01–05 → process → final ${found.length ? 'FAILED' : 'ok'}`);
    }
    const timing = await mapTiming();
    errors.push(...timing.found);
    console.log(`map timing @1000px/s: map ${Math.round(timing.r.map)}ms, complete ${Math.round(timing.r.complete)}ms, numbers-only ${Math.round(timing.r.numbersOnly)}ms`);
    const life = await lifecycle();
    errors.push(...life);
    console.log(`lifecycle: ${life.length ? 'FAILED' : 'map anchor jump to 05, reverse to hero, resize 1440 → 390 inside 02'}`);
    for (const kind of ['reduced', 'save-data']) {
      const found = await preference(kind);
      errors.push(...found);
      console.log(`${kind}: ${found.length ? 'FAILED' : 'static instrument, no autoplay, no rotation, navigation works'}`);
    }
    const nojs = noJsProblems(html);
    errors.push(...nojs);
    console.log(`no-JS: ${nojs.length ? 'FAILED' : `hero, CTAs, 5 route links, 5 chapters, ${SERVICE_LINKS} service links, engagement, final`}`);
    console.log(`pixel contrast: ${total} text boxes measured across ${SIZES.length} sizes`);
  }
} finally {
  await browser.close();
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(PROVE ? 'check-digital-scene --prove: every branch proven red' : 'check-digital-scene: PASS — measured invariants; owner visual acceptance remains separate.');
