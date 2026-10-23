/** GS-LAUNCH-004 characterization and disposable Apache design proof; never a release gate. */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { launch } from '../../../scripts/browser-launch.mjs';

const mode = process.argv[2];
assert(['ssr', 'boundary'].includes(mode));
const root = 'build/gs-launch-004';
mkdirSync(root, { recursive: true });
const require = createRequire(import.meta.url);
const axe = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const evidence = { mode, at: new Date().toISOString(), cases: [] };
let axeRun = 0;
const facts = (html) => ({ lang: /<html[^>]*\slang="en-GB"/.test(html),
  h1: /<h1[\s>]/.test(html), main: /<main[\s>]/.test(html), shell: html.includes('id="__next_error__"') });
const accessible = (html) => { const f = facts(html); return f.lang && f.h1 && f.main && !f.shell; };
// Prove every semantic branch and the rejection predicate independently of the served subject.
const specimen = '<html lang="en-GB"><main><h1>Error</h1></main></html>';
assert(accessible(specimen));
for (const broken of [specimen.replace('lang="en-GB"', ''), specimen.replaceAll('main', 'div'),
  specimen.replaceAll('h1', 'h2'), specimen.replace('<html', '<html id="__next_error__"')]) assert(!accessible(broken));

async function response(label, url, options = {}) {
  const r = await fetch(url, { ...options, headers: { Accept: 'text/html', ...options.headers } });
  const html = await r.text();
  writeFileSync(`${root}/${label}.html`, html);
  const record = { label, url, status: r.status, headers: Object.fromEntries(r.headers),
    bytes: Buffer.byteLength(html), sha256: createHash('sha256').update(html).digest('hex'), facts: facts(html) };
  evidence.cases.push(record);
  return { ...record, html };
}
async function audit(page) {
  if (!page.isJavaScriptEnabled()) {
    const replay = await browser.newPage();
    await replay.setViewport(page.viewport());
    const before = await semantics(page);
    const html = (await page.content()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace('<head>', `<head><base href="${new URL(page.url()).origin}/">`);
    try {
      await replay.setContent(html, { waitUntil: 'networkidle0' });
      assert.deepEqual(await semantics(replay), before, 'Axe replay changed no-JS content or semantics');
      // A valid adverse subject in the same replay must reach the same audit.
      const language = await replay.evaluate(() => { const lang = document.documentElement.lang;
        document.documentElement.removeAttribute('lang'); return lang; });
      const adverse = await audit(replay);
      assert(adverse.violations.some(x => x.id === 'html-has-lang'));
      if (language) await replay.evaluate(lang => document.documentElement.lang = lang, language);
      return { ...await audit(replay), method: 'script-free no-JS DOM replay; semantic equality and missing-lang adverse proof' };
    } finally { await replay.close(); }
  }
  await page.evaluate(axe);
  const result = await page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: { type: 'tag',
      values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
    return r;
  });
  const rawFile = `axe-${mode}-${++axeRun}.json`;
  writeFileSync(`${root}/${rawFile}`, JSON.stringify(result) + '\n');
  return { rawFile, violations: result.violations.map(x => ({ id: x.id, impact: x.impact, targets: x.nodes.map(n => n.target) })),
    incomplete: result.incomplete.map(x => ({ id: x.id, targets: x.nodes.map(n => n.target) })) };
}
async function semantics(page) {
  return page.evaluate(() => ({ lang: document.documentElement.lang, h1: document.querySelectorAll('h1').length,
    main: document.querySelectorAll('main').length, title: document.title,
    text: document.body.innerText, overflow: document.documentElement.scrollWidth > innerWidth }));
}
const browser = await launch();
try {
  if (mode === 'ssr') {
    const base = 'http://127.0.0.1:3349';
    const r = await response('ssr-initial', `${base}/gridsmith-ssr-throw-probe`);
    assert.equal(r.status, 500);
    assert.deepEqual(r.facts, { lang: false, h1: false, main: false, shell: true });
    assert(!/deliberate server-render throw|\/work\/|Error:.*\bat\b/.test(r.html));
    for (const js of [false, true]) {
      const page = await browser.newPage();
      await page.setJavaScriptEnabled(js);
      const nav = await page.goto(`${base}/gridsmith-ssr-throw-probe`, { waitUntil: 'networkidle0' });
      if (js) await page.waitForSelector('main h1');
      const dom = await semantics(page), a11y = await audit(page);
      assert.equal(nav.status(), 500);
      if (js) {
        assert.equal(dom.lang, 'en-GB'); assert.equal(dom.h1, 1); assert.equal(dom.main, 1);
        assert.equal(a11y.violations.length, 0);
        await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Try again');
        await page.evaluate(() => document.activeElement.addEventListener('click', () => window.__gsRetryActivated = true, { once: true }));
        await page.keyboard.press('Enter');
        assert(await page.evaluate(() => window.__gsRetryActivated === true));
        await page.waitForSelector('main h1');
      } else {
        assert.equal(dom.lang, ''); assert.equal(dom.h1, 0); assert.equal(dom.main, 0);
        assert(a11y.violations.some(x => x.id === 'html-has-lang'));
      }
      await page.screenshot({ path: `${root}/ssr-${js ? 'hydrated' : 'no-js'}.png` });
      await page.goto(`${base}/about`, { waitUntil: 'networkidle0' });
      assert.equal((await semantics(page)).h1, 1);
      evidence.cases.push({ label: `ssr-js-${js}`, dom, a11y,
        recovery: js ? 'keyboard click observed; persistent boundary visible; /about navigation succeeds' : '/about navigation succeeds; no retry control exists' });
      await page.close();
    }
    const client = await browser.newPage();
    const nav = await client.goto(`${base}/gridsmith-error-probe`, { waitUntil: 'networkidle0' });
    await client.waitForSelector('main h1');
    const clientDom = await semantics(client);
    assert.equal(nav.status(), 200); assert.equal(clientDom.title, 'Something went wrong — Gridsmith Ltd');
    evidence.cases.push({ label: 'client-only-throw', status: nav.status(), dom: clientDom, a11y: await audit(client) });
    await client.close();
    const notFound = await response('normal-404', `${base}/gs-launch004-missing`);
    assert.equal(notFound.status, 404); assert(accessible(notFound.html));
  } else {
    const staticBase = 'http://127.0.0.1:3344', proxy = 'http://127.0.0.1:3345';
    const expected = readFileSync(new URL('./error.html', import.meta.url), 'utf8');
    for (const [label, url, status] of [
      ['static-500', `${staticBase}/induced-500`, 500],
      ['proxy-500', `${proxy}/gridsmith-ssr-throw-probe`, 500],
      ['proxy-unavailable', `${proxy}/upstream-unavailable`, 503],
      ['proxy-502', `${proxy}/upstream-502`, 502],
      ['proxy-503', `${proxy}/upstream-503`, 503],
      ['proxy-504', `${proxy}/upstream-504`, 504],
    ]) {
      // Distinguish actual connection refusal (503 here) from synthetic upstream 502/503/504.
      const r = await response(label, url);
      assert.equal(r.status, status); assert.equal(r.html, expected); assert(accessible(r.html));
      assert.equal(r.headers['cache-control'], 'no-store, max-age=0');
      assert.equal(r.headers['content-security-policy'], "default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'");
      assert.equal(r.headers['x-content-type-options'], 'nosniff'); assert.equal(r.headers['x-frame-options'], 'DENY');
      assert.equal(r.headers['referrer-policy'], 'no-referrer'); assert(!r.headers['set-cookie']);
      assert(!/::vercel|stack|digest|\/proof\/|\/work\//i.test(r.html));
      const head = await fetch(url, { method: 'HEAD', headers: { Accept: 'text/html' } });
      assert.equal(head.status, status); assert.equal(await head.text(), '');
      for (const width of [375, 768, 1440]) for (const js of [false, true]) {
        const page = await browser.newPage();
        const requests = [];
        page.on('request', request => requests.push({ url: request.url(), type: request.resourceType() }));
        await page.setViewport({ width, height: 900 }); await page.setJavaScriptEnabled(js);
        const nav = await page.goto(url, { waitUntil: 'networkidle0' });
        const dom = await semantics(page), a11y = await audit(page);
        assert.equal(nav.status(), status); assert.equal(dom.lang, 'en-GB'); assert.equal(dom.h1, 1); assert.equal(dom.main, 1);
        assert(!dom.overflow); assert.equal(a11y.violations.length, 0); assert.equal(a11y.incomplete.length, 0);
        assert.equal(requests.filter(x => x.type !== 'document').length, 0);
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => { const a = document.activeElement, r = a.getBoundingClientRect(), s = getComputedStyle(a);
          return { href: a.getAttribute('href'), visible: r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= innerHeight,
            outline: s.outlineStyle, outlineWidth: s.outlineWidth }; });
        assert.equal(focused.href, '/'); assert(focused.visible); assert.notEqual(focused.outline, 'none');
        if (width === 375 && !js) await page.screenshot({ path: `${root}/${label}-no-js.png` });
        await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.keyboard.press('Enter')]);
        assert.equal(new URL(page.url()).pathname, '/'); assert.equal((await semantics(page)).h1, 1);
        evidence.cases.push({ label: `${label}-${width}-js-${js}`, dom, a11y, focused, requests, recovery: 'keyboard homepage succeeds' });
        await page.close();
      }
    }
    for (const [label, base] of [['static-normal', staticBase], ['proxy-normal', proxy]]) {
      for (const path of ['/', '/about', '/design', '/digital', '/press']) {
        const r = await response(`${label}-${path.replaceAll('/', '') || 'home'}`, base + path);
        const text = label.startsWith('static')
          ? readFileSync(`build/production-rehearsal${path === '/' ? '/index' : path}.html`, 'utf8')
          : await (await fetch('http://127.0.0.1:3349' + path)).text();
        assert.equal(r.status, 200); assert.equal(r.html, text); assert(accessible(r.html));
      }
      const r = await response(`${label}-404`, base + '/gs-launch004-missing');
      assert.equal(r.status, 404); assert(accessible(r.html));
    }
    const rsc = await response('proxy-rsc', proxy + '/gridsmith-ssr-throw-probe', { headers: { RSC: '1', Accept: '*/*' } });
    const directRsc = await response('direct-rsc', 'http://127.0.0.1:3349/gridsmith-ssr-throw-probe', { headers: { RSC: '1', Accept: '*/*' } });
    // Separate RSC requests carry random metadata keys; compare the actual error records and protocol.
    const errors = text => [...text.matchAll(/^[0-9a-f]+:E(\{.*\})$/gm)].map(([, value]) => JSON.parse(value));
    assert.deepEqual(errors('b:E{"digest":"test"}\n'), [{ digest: 'test' }]); assert.deepEqual(errors('1:"normal"\n'), []);
    assert.equal(rsc.status, directRsc.status); assert(errors(rsc.html).length > 0);
    assert.deepEqual(errors(rsc.html), errors(directRsc.html));
    assert.match(rsc.headers['content-type'], /text\/x-component/);
    assert.equal(rsc.headers['content-type'], directRsc.headers['content-type']);
    evidence.cases.push({ label: 'rsc-protocol-comparison', status: rsc.status, errors: errors(rsc.html),
      comparison: 'status, content type and error records; request-specific metadata keys differ' });
    const api = await response('proxy-api-protocol', proxy + '/api/gs-launch004-protocol');
    const direct = await response('direct-api-protocol-subject', 'http://127.0.0.1:3349/gridsmith-ssr-throw-probe');
    assert.equal(api.status, 500); assert.equal(api.status, direct.status);
    assert.equal(api.headers['content-type'], direct.headers['content-type']);
    assert.deepEqual(api.facts, direct.facts); assert(api.facts.shell); assert.notEqual(api.html, expected);
    const noOverride = await response('apache-no-override', 'http://127.0.0.1:3347/induced-500');
    const missing = await response('apache-missing-fallback', 'http://127.0.0.1:3346/induced-500');
    for (const r of [noOverride, missing]) { assert.equal(r.status, 500); assert(!accessible(r.html)); }
    const coLocated = await response('apache-colocated-good', 'http://127.0.0.1:3348/induced-500');
    assert.equal(coLocated.status, 500); assert.equal(coLocated.html, expected);
  }
  evidence.outcome = 'PASS for named characterization/prototype assertions; no hosted or release acceptance';
} finally {
  await browser.close();
  writeFileSync(`${root}/${mode}-receipt.json`, JSON.stringify(evidence, null, 2) + '\n');
}
console.log(JSON.stringify({ mode, cases: evidence.cases.length, outcome: evidence.outcome }));
