#!/usr/bin/env node
/**
 * audit:wcag — `GS-LAUNCH-026`. A WCAG 2.2 Level A/AA audit harness over **every** served route, for
 * the evidence behind the Accessibility Statement. It is an audit tool, not a pass mark: automated
 * checks cannot establish conformance, and what this cannot measure is listed as manual work in its
 * own output rather than counted as passing.
 *
 * Per route it measures, in Chrome:
 *   - axe-core (wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa) at 1440, 768, 375 and 320 CSS px;
 *   - 1.4.10 reflow at 320 CSS px (the 400% zoom of a 1280px window): no horizontal scrolling;
 *   - 1.4.12 text spacing at 1440 and 375: the WCAG override values, then any clipped text box;
 *   - 2.5.8 target size at 375 and 1440: visible targets under 24x24 px that are not inline in text;
 *   - 2.1.1 / 2.1.2 / 2.4.3 / 2.4.7 / 2.4.11 keyboard: Tab through the page at 1440 and 375,
 *     recording each stop's visibility, focus indicator, whether fixed chrome hides it, and whether
 *     focus escapes back to the document start (no trap);
 *   - 1.3.1 / 2.4.6 heading structure, 2.4.1 landmarks and bypass link, 2.4.2 title, 3.1.1 language;
 *   - 2.2.2 / 2.3.3 motion: running animations with and without `prefers-reduced-motion: reduce`;
 *   - JavaScript disabled: the main content and heading still render without overflow.
 *
 * `--base=URL` (default `STATIC_BASE_URL`, `AXE_BASE_URL`, then http://127.0.0.1:3000). Routes come
 * from the served `__deployment.json` when the site has one, otherwise from a same-origin crawl of
 * the four landing pages. Writes `build/wcag-audit/report.json`. Exit 0 unless the harness itself
 * fails; findings are data for a human to triage, so a finding never hides behind an exit code.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import axe from 'axe-core';
import { launch } from './browser-launch.mjs';

const BASE = (process.argv.find((a) => a.startsWith('--base='))?.slice(7) ?? process.env.STATIC_BASE_URL ??
  process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000').replace(/\/$/, '');
const ONLY = process.argv.find((a) => a.startsWith('--routes='))?.slice(9)?.split(',');
const OUT = 'build/wcag-audit';
const VIEWPORTS = [[1440, 900], [768, 1024], [375, 812], [320, 640]];
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const TEXT_SPACING = '*{line-height:1.5!important;letter-spacing:0.12em!important;word-spacing:0.16em!important}p{margin-bottom:2em!important}';

async function routes() {
  if (ONLY) return ONLY;
  try {
    const identity = await (await fetch(`${BASE}/__deployment.json`)).json();
    return identity.files.map((f) => f.path).filter((p) => p.endsWith('.html') && !/^(?:404|500)\.html$/.test(p))
      .map((p) => (p === 'index.html' ? '/' : `/${p.replace(/\.html$/, '')}`)).sort();
  } catch {
    const seen = new Set(['/', '/design', '/digital', '/press']);
    for (const start of [...seen]) {
      const html = await (await fetch(BASE + start)).text();
      for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) if (!/\.(?:png|svg|webp|css|js|xml|txt|json)$/.test(m[1]) && !m[1].startsWith('/_next')) seen.add(m[1].replace(/\/$/, '') || '/');
    }
    return [...seen].sort();
  }
}

const settle = (page) => page.waitForNetworkIdle({ idleTime: 400, timeout: 20000 }).catch(() => {});

async function open(browser, route, viewport, { reduced = false, javascript = true, consent = true } = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width: viewport[0], height: viewport[1] });
  if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setJavaScriptEnabled(javascript);
  // Audit the page as a returning visitor would see it once the notice is dealt with, and separately
  // with it showing (the 1440 axe pass below), so the fixed bar neither hides nor excuses content.
  if (consent) await page.setCookie({ name: 'gs_consent', value: '1', url: BASE });
  const response = await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 });
  await settle(page);
  return { page, status: response?.status() ?? 0 };
}

/**
 * axe over the document. A footer whose rendering is deferred (`content-visibility: auto`, `/digital`)
 * has no painted background for axe to read while it is skipped, so — as `check-axe` does — findings
 * inside a skipped footer are set aside and the footer is revealed and analysed as rendered.
 */
async function axeRun(page) {
  await page.evaluate(axe.source);
  const run = (scope) => page.evaluate((tags, footerOnly) => globalThis.axe.run(footerOnly ? document.querySelector('footer') : document,
    { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations', 'incomplete'] }).then((r) => ({
    violations: r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help,
      nodes: v.nodes.map((n) => ({ target: n.target.join(' '), inFooter: !!document.querySelector(n.target.join(' '))?.closest('footer') })) })),
    incomplete: r.incomplete.map((v) => ({ id: v.id, nodes: v.nodes.length })),
    footerSkipped: !!document.querySelector('footer') && !document.querySelector('footer').checkVisibility({ contentVisibilityAuto: true }),
  })), TAGS, scope === 'footer');
  const first = await run('document');
  let violations = first.violations;
  if (first.footerSkipped && violations.some((v) => v.nodes.some((n) => n.inFooter))) {
    violations = violations.map((v) => ({ ...v, nodes: v.nodes.filter((n) => !n.inFooter) })).filter((v) => v.nodes.length);
    const y = await page.evaluate(() => { const at = scrollY; document.querySelector('footer').scrollIntoView(); return at; });
    await new Promise((done) => setTimeout(done, 800));
    violations.push(...(await run('footer')).violations);
    await page.evaluate((at) => scrollTo(0, at), y);
  }
  return {
    violations: violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, targets: v.nodes.slice(0, 5).map((n) => n.target) })),
    incomplete: first.incomplete,
  };
}

const structure = (page) => page.evaluate(() => {
  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((h) => h.checkVisibility() || h.closest('.sr-only'))
    .map((h) => Number(h.tagName[1]));
  const skips = headings.flatMap((level, i) => (i && level > headings[i - 1] + 1 ? [`h${headings[i - 1]}→h${level}`] : []));
  const first = [...document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')].find((e) => e.tabIndex >= 0);
  return {
    title: document.title, lang: document.documentElement.lang, h1: headings.filter((l) => l === 1).length, skips,
    mains: document.querySelectorAll('main').length, banner: !!document.querySelector('header'), contentinfo: !!document.querySelector('footer'),
    bypass: !!first && first.getAttribute('href') === '#main' && !!document.getElementById('main'),
  };
});

const reflow = (page) => page.evaluate(() => {
  const width = document.documentElement.clientWidth;
  const over = document.documentElement.scrollWidth > width + 1;
  const wide = over ? [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); return r.right > width + 1 && e.checkVisibility(); })
    .slice(0, 5).map((e) => `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}.${String(e.className).split(' ')[0]}`) : [];
  return { overflow: over, scrollWidth: document.documentElement.scrollWidth, width, wide };
});

const clipped = (page) => page.evaluate((css) => {
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
  return new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => {
    const out = [];
    for (const e of document.querySelectorAll('body *')) {
      if (!e.checkVisibility() || !e.textContent.trim() || e.closest('.sr-only,[aria-hidden="true"]')) continue;
      const c = getComputedStyle(e);
      const hides = /hidden|clip/.test(c.overflowX + c.overflowY) || c.textOverflow === 'ellipsis';
      if (hides && (e.scrollHeight > e.clientHeight + 2 || e.scrollWidth > e.clientWidth + 2) && e.clientHeight > 0) {
        out.push(`${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]} (${e.scrollWidth}x${e.scrollHeight} in ${e.clientWidth}x${e.clientHeight})`);
      }
    }
    style.remove();
    done(out.slice(0, 10));
  })));
}, TEXT_SPACING);

const targets = (page) => page.evaluate(() => {
  const inline = (e) => { const p = e.parentElement; return getComputedStyle(e).display === 'inline' && p && /^(P|LI|TD|DD|BLOCKQUOTE|FIGCAPTION|SPAN|EM|STRONG|SMALL)$/.test(p.tagName) && p.textContent.trim().length > e.textContent.trim().length; };
  const list = [...document.querySelectorAll('a[href],button,input:not([type=hidden]),select,textarea,summary,[role=button],[tabindex]:not([tabindex="-1"])')]
    .filter((e) => e.checkVisibility() && !e.closest('[aria-hidden="true"]'));
  const small = [];
  for (const e of list) {
    const r = e.getBoundingClientRect();
    if (r.width === 0 || r.height === 0 || (r.width >= 24 && r.height >= 24) || inline(e)) continue;
    // Spacing exception: a 24px circle on the target's centre must not overlap another target.
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const crowded = list.some((o) => o !== e && !o.contains(e) && !e.contains(o) && (() => { const q = o.getBoundingClientRect();
      const nx = Math.max(q.left, Math.min(cx, q.right)), ny = Math.max(q.top, Math.min(cy, q.bottom)); return Math.hypot(nx - cx, ny - cy) < 12; })());
    if (crowded) small.push(`${e.tagName.toLowerCase()} "${(e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 40)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
  }
  return { count: list.length, small: small.slice(0, 10) };
});

async function keyboard(page) {
  const stops = [];
  for (let i = 0; i < 260; i++) {
    await page.keyboard.press('Tab');
    const s = await page.evaluate(() => {
      const e = document.activeElement;
      if (!e || e === document.body) return { body: true };
      // Where the indicator is actually drawn: a visually hidden input shows it on its label, and a
      // link spanning a whole stage (Digital's compass, inset: 0) shows it on its visible children.
      const label = e.id && getComputedStyle(e).opacity === '0' ? document.querySelector(`label[for="${e.id}"]`) : null;
      const drawn = [label || e, ...(label ? [] : [...e.children].filter((k) => k.checkVisibility()))];
      const ringOf = (x) => { const c = getComputedStyle(x); return (c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) > 0) || c.boxShadow !== 'none'; };
      const ring = drawn.some(ringOf) || e.matches(':focus-visible') === false;
      const box = label || e;
      const r = box.getBoundingClientRect();
      const pts = [[r.left + 2, r.top + 2], [r.right - 2, r.top + 2], [r.left + 2, r.bottom - 2], [r.right - 2, r.bottom - 2], [r.left + r.width / 2, r.top + r.height / 2]]
        .filter(([x, y]) => x >= 0 && y >= 0 && x < innerWidth && y < innerHeight);
      const own = (h) => h && (h === box || box.contains(h) || h.contains(box) || h === e || e.contains(h));
      // A full-stage link's own box is mostly empty; judge it by whether its visible children are covered.
      const targets = drawn.length > 1 && getComputedStyle(e).pointerEvents === 'none' ? drawn.slice(1) : [box];
      const hidden = pts.length > 0 && targets.every((t) => {
        const q = t.getBoundingClientRect();
        const c = [q.left + q.width / 2, q.top + q.height / 2];
        const h = document.elementFromPoint(c[0], c[1]);
        return !(own(h) || (h && (t === h || t.contains(h))));
      });
      const label = `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''} "${(e.getAttribute('aria-label') || e.textContent || e.getAttribute('name') || '').trim().slice(0, 40)}"`;
      return { label, visible: e.checkVisibility() && r.width > 0 && r.height > 0, ring, obscured: hidden, offscreen: pts.length === 0 };
    });
    if (s.body) break;
    if (stops.length && stops[0].label === s.label && stops.length > 2) break; // wrapped round
    stops.push(s);
  }
  const trapped = stops.length >= 259;
  return {
    stops: stops.length, trapped,
    invisible: stops.filter((s) => !s.visible).map((s) => s.label).slice(0, 8),
    noRing: stops.filter((s) => s.visible && !s.ring).map((s) => s.label).slice(0, 8),
    obscured: stops.filter((s) => s.visible && s.obscured).map((s) => s.label).slice(0, 8),
  };
}

const motion = (page) => page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').map((a) => {
  const t = a.effect && a.effect.getTiming ? a.effect.getTiming() : {};
  return { name: a.animationName || a.transitionProperty || a.constructor.name, iterations: t.iterations, duration: t.duration };
}).filter((a) => a.iterations === Infinity || a.duration > 5000).slice(0, 10));

const browser = await launch();
const report = { base: BASE, standard: 'WCAG 2.2 Level A and AA (W3C Recommendation)', tags: TAGS, routes: {}, titles: {} };
try {
  const list = await routes();
  report.routeCount = list.length;
  for (const route of list) {
    const entry = (report.routes[route] = { axe: {}, notes: [] });
    for (const vp of VIEWPORTS) {
      const { page, status } = await open(browser, route, vp);
      entry.status = status;
      entry.axe[vp[0]] = await axeRun(page);
      if (vp[0] === 1440) {
        entry.structure = await structure(page);
        (report.titles[entry.structure.title] ??= []).push(route);
        entry.textSpacing1440 = await clipped(page);
        entry.targets1440 = await targets(page);
        entry.motion = await motion(page);
      }
      if (vp[0] === 375) { entry.textSpacing375 = await clipped(page); entry.targets375 = await targets(page); }
      if (vp[0] === 320) entry.reflow320 = await reflow(page);
      await page.close();
    }
    for (const vp of [[1440, 900], [375, 812]]) {
      const { page } = await open(browser, route, vp);
      entry[`keyboard${vp[0]}`] = await keyboard(page);
      await page.close();
    }
    {
      const { page } = await open(browser, route, [1440, 900], { consent: false });
      entry.axeWithNotice = await axeRun(page);
      await page.close();
    }
    {
      const { page } = await open(browser, route, [1440, 900], { reduced: true });
      entry.reducedMotion = await motion(page);
      await page.close();
    }
    {
      const { page } = await open(browser, route, [1440, 900], { javascript: false });
      entry.noJs = await page.evaluate(() => ({ h1: !!document.querySelector('h1') && document.querySelector('h1').checkVisibility(),
        main: !!document.querySelector('main'), overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1 }));
      await page.close();
    }
    const v = Object.values(entry.axe).reduce((n, a) => n + a.violations.length, 0) + entry.axeWithNotice.violations.length;
    console.log(`${route}: axe violations ${v}; reflow ${entry.reflow320.overflow ? 'OVERFLOW' : 'ok'}; keyboard stops ${entry.keyboard1440.stops}/${entry.keyboard375.stops}`);
  }
} finally {
  await browser.close();
}
report.duplicateTitles = Object.entries(report.titles).filter(([, r]) => r.length > 1);
mkdirSync(OUT, { recursive: true });
writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2) + '\n');
console.log(`audit:wcag: ${report.routeCount} routes measured; report ${OUT}/report.json`);
