#!/usr/bin/env node
/**
 * check:consent — `GS-LAUNCH-026`. The cookie notice or consent request, and the optional analytics
 * it governs, **measured by what the browser requests and stores**, never by what a toggle shows.
 *
 * It asks the served site which mode it is in (`data-consent-mode` on the bar), so one gate covers
 * both: the notice of an unconfigured build, and the consent request of a build given GA4 and/or
 * PostHog identifiers. CI runs the notice mode against the static owner-preview candidate and the
 * consent mode against a second, never-deployed build with test identifiers.
 *
 * **No request leaves for Google or PostHog.** Every request to their hosts is answered in the
 * browser: `gtag.js` and `array.js` by small stubs that behave as each library does where it matters
 * here — Google's `ga-disable-<id>` flag, PostHog's opt-out — and every collection endpoint by an
 * empty 204, recorded. `--live` instead lets the two real libraries load from their CDNs while still
 * refusing every collection request; it is how the Cookie Policy's cookie names were measured, and
 * it is not run in CI.
 *
 * Every scenario records what it measured; a scenario that measures nothing fails. Exit 1 on any
 * problem.
 */
import { launch } from './browser-launch.mjs';

const BASE_URL = process.env.AXE_BASE_URL ?? process.env.STATIC_BASE_URL ?? 'http://127.0.0.1:3000';
const LIVE = process.argv.includes('--live');
/**
 * `--probe=<name>` plants one defect in every page before the site's own scripts run, and the run
 * must then fail (`scripts/prove-consent.mjs` asserts which message fires). Each probe produces
 * the exact quantity its branch reads — a request, a ticked box, a hit, a cookie — so a green run
 * under a probe is a broken branch, not an inert probe.
 */
const PROBES = {
  // A tag that loads on page load, before any choice.
  preconsent: `addEventListener('DOMContentLoaded',()=>{const s=document.createElement('script');s.src='https://www.googletagmanager.com/gtag/js?id=G-PROBE00';document.head.appendChild(s)})`,
  // A provider ticked before the visitor touches anything.
  preticked: `addEventListener('DOMContentLoaded',()=>document.querySelectorAll('[data-consent-mode] input[type=checkbox]').forEach(b=>b.checked=true))`,
  // Withdrawal that leaves Google's opt-out flag unset, so the tag keeps collecting.
  'sticky-ga': `for(const id of ['G-GS026TEST0'])Object.defineProperty(window,'ga-disable-'+id,{get:()=>false,set:()=>{},configurable:false})`,
  // Withdrawal that cannot expire the provider's cookies.
  'keep-cookies': `{const d=Object.getOwnPropertyDescriptor(Document.prototype,'cookie');Object.defineProperty(document,'cookie',{get(){return d.get.call(this)},set(v){if(/^_ga[^=]*=;/.test(v))return;d.set.call(this,v)}})}`,
  // Withdrawal that PostHog ignores, so it keeps capturing in the open page.
  'sticky-posthog': `{let p;Object.defineProperty(window,'posthog',{configurable:true,get(){return p},set(v){p=v;if(v&&typeof v==='object')v.opt_out_capturing=function(){}}})}`,
  // A decision that never reaches the site's other open tabs.
  'no-broadcast': `window.BroadcastChannel=class{postMessage(){}close(){}}`,
  // An analytics identifier that outlives the decision allowing it.
  'long-cookies': `{const d=Object.getOwnPropertyDescriptor(Document.prototype,'cookie');Object.defineProperty(document,'cookie',{get(){return d.get.call(this)},set(v){d.set.call(this,/^_ga/.test(v)?v.replace(/Max-Age=\\d+/,'Max-Age=63072000'):v)}})}`,
};
const PROBE = process.argv.find((a) => a.startsWith('--probe='))?.slice('--probe='.length);
if (PROBE && !PROBES[PROBE]) throw new Error(`Unknown probe ${PROBE}; known: ${Object.keys(PROBES).join(', ')}`);
const ROUTES = ['/', '/about', '/design', '/digital', '/press', '/contact', '/legal/cookies'];
const STUDIOS = ['/design', '/digital', '/press', '/'];
const YEAR = 365 * 24 * 60 * 60;
// A consent choice lasts 180 days (`lib/consent/decision.ts`); a notice acknowledgement a year.
const CHOICE = 180 * 24 * 60 * 60;
const problems = [];
const receipt = { base: BASE_URL, live: LIVE, mode: null, providers: null, scenarios: {} };
const fail = (scenario, message) => problems.push(`${scenario}: ${message}`);
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));
/** Waits for a condition the real libraries reach on their own schedule (they batch); at most `ms`. */
const until = async (condition, ms = 10000) => { for (const end = Date.now() + ms; !condition() && Date.now() < end;) await sleep(100); };
/** A collection request as host, path and the event fields that say what and where — test identifiers only. */
const brief = (url) => {
  try {
    const u = new URL(url);
    return `${u.host}${u.pathname}${['en', 'dl'].map((k) => (u.searchParams.has(k) ? ` ${k}=${u.searchParams.get(k)}` : '')).join('')}`;
  } catch { return url.slice(0, 120); }
};

const ANALYTICS = /(?:^|\.)(?:googletagmanager\.com|google-analytics\.com|analytics\.google\.com|posthog\.com)$/;
const isAnalytics = (url) => { try { return ANALYTICS.test(new URL(url).hostname); } catch { return false; } };
const isCollect = (url) => /\/g\/collect|\/collect\b|posthog\.com\/(?:e|i|batch|capture|track|engage|flags|decide|s)\b/.test(url);

/**
 * gtag.js as it behaves for this gate: config sets `_ga` and `_ga_<id>` for its `cookie_expires`
 * (Google's default is two years) and sends the page view; each queued event is a hit; every hit
 * honours `ga-disable-<id>`. The site sends client-side page views itself, so the stub does not.
 */
const GTAG_STUB = `(function(){var id=new URL(document.currentScript.src).searchParams.get('id');var w=window;
function off(){return w['ga-disable-'+id]===true}function hit(t){if(off())return;fetch('https://region1.google-analytics.com/g/collect?tid='+id+'&en='+t,{mode:'no-cors'})}
function set(c){if(off())return;var a='Max-Age='+((c&&c.cookie_expires)||63072000)+'; Path=/; SameSite=Lax';document.cookie='_ga=GA1.1.stub; '+a;document.cookie='_ga_'+id.slice(2)+'=GS1.1.stub; '+a}
var q=w.dataLayer||[];function run(e){if(e&&e[0]==='config'){set(e[2]);hit('page_view')}else if(e&&e[0]==='event')hit(e[1])}
for(var i=0;i<q.length;i++)run(q[i]);var push=q.push.bind(q);q.push=function(e){push(e);run(e)}})();`;

/**
 * array.js as it behaves for this gate: `opt_out_capturing_by_default` starts it opted out;
 * opting in sets `ph_<key>_posthog` for `cookie_expiration` days and sends the first page view;
 * a path change sends another; opt-out stops every capture.
 */
const POSTHOG_STUB = `(function(){var w=window;var p={__loaded:false,_out:false,_on:false,
init:function(k,o){this.__loaded=true;this.key=k;this.config=o||{};this._out=!!this.config.opt_out_capturing_by_default;if(!this._out)this.start()},
start:function(){if(this._on)return;this._on=true;document.cookie='ph_'+this.key+'_posthog=%7B%7D; Max-Age='+Math.round((this.config.cookie_expiration||365)*86400)+'; Path=/; SameSite=Lax';this.capture('$pageview')},
capture:function(e){if(this._out)return;fetch('https://eu.i.posthog.com/e/?ev='+encodeURIComponent(e),{method:'POST',mode:'no-cors',body:'{}'})},
opt_out_capturing:function(){this._out=true},opt_in_capturing:function(){this._out=false;this.start()},reset:function(){}};
w.posthog=p;var last=location.pathname;var ps=history.pushState;history.pushState=function(){ps.apply(this,arguments);if(location.pathname!==last){last=location.pathname;p.capture('$pageview')}}})();`;

async function openPage(browser, { cookie, javascript = true, viewport = [1440, 900], reducedMotion = false, context: shared } = {}) {
  const context = shared ?? await browser.createBrowserContext();
  const page = await context.newPage();
  // The real PostHog drops every event from a browser that "looks like a bot": it reads the UA
  // string, the userAgentData brands and navigator.webdriver, and automated headless Chrome trips
  // all three (posthog-js 1.441.2, debug mode). Without this, `--live` would measure a PostHog that
  // never sends anything, and its withdrawal branches would prove nothing. Live mode only.
  if (LIVE) {
    await page.setUserAgent((await browser.userAgent()).replace('HeadlessChrome', 'Chrome'));
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false, configurable: true });
      const data = navigator.userAgentData;
      if (data) {
        const brands = data.brands.map((b) => ({ ...b, brand: b.brand.replace('HeadlessChrome', 'Google Chrome') }));
        Object.defineProperty(Navigator.prototype, 'userAgentData', { configurable: true,
          get: () => ({ brands, mobile: data.mobile, platform: data.platform, getHighEntropyValues: (h) => data.getHighEntropyValues(h), toJSON: () => ({ brands, mobile: data.mobile, platform: data.platform }) }) });
      }
    });
  }
  await page.setViewport({ width: viewport[0], height: viewport[1] });
  if (reducedMotion) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.setJavaScriptEnabled(javascript);
  if (PROBE) await page.evaluateOnNewDocument(PROBES[PROBE]);
  const log = { scripts: [], collect: [], retries: [], other: [] };
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const url = request.url();
    if (!isAnalytics(url)) return void request.continue();
    if (isCollect(url)) {
      // `--live` aborts every collection request, so PostHog retries each batch (`retry_count=N`),
      // and a batch captured before a withdrawal is retried after it (measured: posthog-js 1.441.2).
      // A retry carries no new event — new collection always leaves as a first attempt — so retries
      // are recorded apart and not counted as collection. In stub mode every request succeeds.
      if (LIVE && /[?&]retry_count=\d/.test(url)) log.retries.push(url);
      else log.collect.push(url);
      return void (LIVE ? request.abort() : request.respond({ status: 204, body: '' }));
    }
    log.scripts.push(url);
    if (LIVE) return void request.continue();
    if (/googletagmanager\.com\/gtag\/js/.test(url)) return void request.respond({ status: 200, contentType: 'application/javascript', body: GTAG_STUB });
    if (/posthog\.com\/static\/array\.js/.test(url)) return void request.respond({ status: 200, contentType: 'application/javascript', body: POSTHOG_STUB });
    log.other.push(url);
    return void request.abort();
  });
  if (cookie !== undefined) {
    await page.setCookie({ name: 'gs_consent', value: cookie, url: BASE_URL });
  }
  return { context, page, log };
}

const settle = (page, ms = 900) => page.waitForNetworkIdle({ idleTime: 300, timeout: 15000 }).catch(() => {}).then(() => sleep(ms));
const go = async (page, path) => { await page.goto(BASE_URL + path, { waitUntil: 'networkidle0' }); await settle(page); };
const state = (page) => page.evaluate(() => {
  const bar = document.getElementById('gs-consent-heading')?.closest('[role="region"]');
  return {
    visible: !!bar && bar.checkVisibility(),
    mode: bar?.getAttribute('data-consent-mode') ?? null,
    boxes: [...(bar?.querySelectorAll('input[type="checkbox"]') ?? [])].map((b) => ({ name: b.name, checked: b.checked })),
    buttons: [...(bar?.querySelectorAll('button') ?? [])].filter((b) => b.checkVisibility()).map((b) => b.textContent.trim()),
    local: Object.keys(localStorage), session: Object.keys(sessionStorage),
    consentSignals: (window.dataLayer ?? []).filter((e) => e && e[0] === 'consent').length,
    focused: document.activeElement?.id || document.activeElement?.tagName || null,
    status: document.querySelector('[data-consent-status]')?.textContent ?? null,
  };
});
const press = (page, action) => page.$eval(`[data-consent="${action}"]`, (b) => b.click());
const cookies = async (page) => (await page.cookies(BASE_URL)).map((c) => ({ name: c.name, value: c.value, expires: c.expires }));
const consentCookie = async (page) => (await cookies(page)).find((c) => c.name === 'gs_consent') ?? null;
const analyticsCookies = async (page) => (await cookies(page)).filter((c) => /^(?:_ga|ph_|__ph)/.test(c.name)).map((c) => c.name);
const lifetime = (c) => (c && c.expires > 0 ? Math.round(c.expires - Date.now() / 1000) : null);

const browser = await launch();
try {
  // Ask the system which mode it serves; never assume it from this process's environment.
  {
    const { context, page, log } = await openPage(browser);
    await go(page, '/');
    const s = await state(page);
    receipt.mode = s.mode;
    receipt.providers = s.boxes.map((b) => b.name);
    if (!s.mode) fail('discovery', 'no consent bar on / — nothing to measure');
    if (log.scripts.length || log.collect.length) fail('discovery', `analytics requested before any choice: ${[...log.scripts, ...log.collect].join(', ')}`);
    await context.close();
  }
  const consent = receipt.mode === 'consent';
  const offers = (name) => receipt.providers.includes(name);

  // 1 / 16. Fresh visits to every main route: nothing requested, nothing stored, nothing pre-ticked.
  for (const route of ROUTES) {
    const { context, page, log } = await openPage(browser);
    await go(page, route);
    const s = await state(page);
    const set = await cookies(page);
    receipt.scenarios[`fresh ${route}`] = { visible: s.visible, cookies: set.length, requests: log.scripts.length + log.collect.length };
    if (!s.visible) fail(`fresh ${route}`, 'request not shown on a first visit');
    if (set.length) fail(`fresh ${route}`, `cookies before a choice: ${set.map((c) => c.name).join(', ')}`);
    if (log.scripts.length || log.collect.length) fail(`fresh ${route}`, `analytics requested before a choice: ${[...log.scripts, ...log.collect].join(', ')}`);
    if (s.local.length || s.session.length) fail(`fresh ${route}`, `web storage before a choice: ${[...s.local, ...s.session].join(', ')}`);
    if (s.consentSignals) fail(`fresh ${route}`, 'a Consent Mode signal was queued before any choice');
    if (s.boxes.some((b) => b.checked)) fail(`fresh ${route}`, 'an optional provider is pre-ticked');
    if (consent && JSON.stringify(s.buttons) !== JSON.stringify(['Accept all', 'Reject optional', 'Customise'])) fail(`fresh ${route}`, `first-layer controls are [${s.buttons}]`);
    if (!consent && JSON.stringify(s.buttons) !== JSON.stringify(['Got it'])) fail(`fresh ${route}`, `notice controls are [${s.buttons}]`);
    await context.close();
  }

  if (consent) {
    // Reject is as easy as accept: same class, same rendered box, side by side.
    {
      const { context, page } = await openPage(browser);
      await go(page, '/');
      const look = await page.evaluate(() => ['accept', 'reject'].map((a) => {
        const b = document.querySelector(`[data-consent="${a}"]`); const r = b.getBoundingClientRect(); const c = getComputedStyle(b);
        return { cls: b.className, w: Math.round(r.width), h: Math.round(r.height), font: c.fontSize + c.fontWeight, bg: c.backgroundColor, fg: c.color, top: Math.round(r.top) };
      }));
      receipt.scenarios.prominence = look;
      const [a, r] = look;
      if (a.cls !== r.cls || a.h !== r.h || a.font !== r.font || a.bg !== r.bg || a.fg !== r.fg || a.top !== r.top) fail('prominence', `Accept and Reject differ: ${JSON.stringify(look)}`);
      await context.close();
    }

    // 2. Reject optional: one decision cookie, nothing else, across navigation and reload.
    {
      const { context, page, log } = await openPage(browser);
      await go(page, '/');
      await press(page, 'reject');
      await settle(page);
      const c = await consentCookie(page);
      const s = await state(page);
      for (const route of STUDIOS) await go(page, route);
      await page.reload({ waitUntil: 'networkidle0' }); await settle(page);
      const after = await state(page);
      receipt.scenarios.reject = { cookie: c?.value, lifetime: lifetime(c), requests: log.scripts.length + log.collect.length, status: s.status };
      if (!/^v2:g[0-]:p[0-]:\d{9,11}$/.test(c?.value ?? '') || /1/.test((c?.value ?? '').slice(0, 7))) fail('reject', `decision cookie is ${c?.value}`);
      if (Math.abs((lifetime(c) ?? 0) - CHOICE) > 120) fail('reject', `decision cookie lifetime ${lifetime(c)}s, expected ${CHOICE}s`);
      if (s.visible || after.visible) fail('reject', 'request still shown after rejecting');
      if (s.status !== 'Cookie preferences saved.') fail('reject', `no saved confirmation announced (${s.status})`);
      if (log.scripts.length || log.collect.length) fail('reject', `analytics requested after rejecting: ${[...log.scripts, ...log.collect].join(', ')}`);
      if ((await analyticsCookies(page)).length) fail('reject', 'analytics cookies after rejecting');
      await context.close();
    }

    // 3 / 7 / 8 / 9. Accept all: both providers start; navigation, reload and a new session keep the decision.
    let accepted = null;
    {
      const { context, page, log } = await openPage(browser);
      await go(page, '/');
      await press(page, 'accept');
      await settle(page, 1500);
      const c = await consentCookie(page);
      accepted = c?.value;
      const set = await analyticsCookies(page);
      const scriptsAfterAccept = log.scripts.length;
      for (const route of STUDIOS) {
        await go(page, route);
        if ((await state(page)).visible) fail('accept navigation', `request shown again on ${route}`);
      }
      // Recorded, not asserted: which web-storage keys the providers write is their behaviour, and
      // the Cookie Policy describes it from a `--live` receipt.
      const { local, session } = await state(page);
      receipt.scenarios.accept = { cookie: accepted, lifetime: lifetime(c), scripts: [...new Set(log.scripts.map((u) => new URL(u).hostname))], collect: log.collect.length, cookies: set, local, session };
      if (!/^v2:g[1-]:p[1-]:\d{9,11}$/.test(accepted ?? '')) fail('accept', `decision cookie is ${accepted}`);
      if (offers('ga4') && !log.scripts.some((u) => /gtag\/js/.test(u))) fail('accept', 'GA4 not loaded after accepting');
      if (offers('posthog') && !log.scripts.some((u) => /array\.js/.test(u))) fail('accept', 'PostHog not loaded after accepting');
      if (!scriptsAfterAccept) fail('accept', 'nothing was loaded after accepting');
      if (!log.collect.length) fail('accept', 'no collection was attempted after accepting — the scenario measured nothing');
      if (offers('ga4') && !set.some((n) => n === '_ga')) fail('accept', 'GA4 set no _ga cookie');
      if (offers('posthog') && !set.some((n) => /^ph_/.test(n))) fail('accept', 'PostHog set no ph_ cookie');
      // An identifier lasts no longer than the decision that allowed it (no renewal past it).
      const end = (await cookies(page)).find((x) => x.name === 'gs_consent')?.expires ?? 0;
      const outlive = (await cookies(page)).filter((x) => /^(?:_ga|ph_|__ph)/.test(x.name) && (x.expires <= 0 || x.expires > end + 120)).map((x) => x.name);
      receipt.scenarios.accept.outlive = outlive;
      if (outlive.length) fail('accept', `analytics cookies outlive the decision: ${outlive.join(', ')}`);
      await context.close();
    }
    {
      // A new browser session carrying the same decision: no request, providers start without asking.
      const { context, page, log } = await openPage(browser, { cookie: accepted });
      await go(page, '/press');
      const s = await state(page);
      receipt.scenarios['new session'] = { visible: s.visible, scripts: log.scripts.length };
      if (s.visible) fail('new session', 'a covered decision was asked again');
      if (!log.scripts.length) fail('new session', 'a covered grant did not start the providers');
      await context.close();
    }

    // 4. Customise: each provider alone.
    for (const only of receipt.providers) {
      const { context, page, log } = await openPage(browser);
      await go(page, '/');
      await press(page, 'customise');
      await page.click(`input[name="${only}"]`);
      await press(page, 'save');
      await settle(page, 1500);
      const c = await consentCookie(page);
      const other = receipt.providers.find((n) => n !== only);
      const scriptHosts = log.scripts.join(' ');
      receipt.scenarios[`customise ${only}`] = { cookie: c?.value, scripts: log.scripts.length };
      if (only === 'ga4' && (!/gtag\/js/.test(scriptHosts) || /array\.js/.test(scriptHosts))) fail('customise ga4', `loaded ${scriptHosts || 'nothing'}`);
      if (only === 'posthog' && (!/array\.js/.test(scriptHosts) || /gtag\/js/.test(scriptHosts))) fail('customise posthog', `loaded ${scriptHosts || 'nothing'}`);
      if (other && new RegExp(other === 'ga4' ? '^v2:g1' : '^v2:g.:p1').test(c?.value ?? '')) fail(`customise ${only}`, `the unchosen ${other} was granted: ${c?.value}`);
      await context.close();
    }

    // 5 / 6 / 10. Change and withdraw, by keyboard, from the footer: collection stops at once, cookies go.
    {
      const { context, page, log } = await openPage(browser, { cookie: accepted });
      await go(page, '/digital');
      if (!log.collect.length) fail('withdraw', 'the accepted state collected nothing — the scenario would measure nothing');
      // Keyboard: reach the footer control, open, and reject.
      await page.$eval('footer button', (b) => b.focus());
      const label = await page.evaluate(() => document.activeElement.textContent.trim());
      await page.keyboard.press('Enter');
      await sleep(200);
      const opened = await state(page);
      if (label !== 'Cookie settings') fail('withdraw', `footer control is labelled "${label}"`);
      if (!opened.visible || opened.focused === 'BODY') fail('withdraw', 'reopening did not show the choices and move focus to them');
      if (opened.boxes.some((b) => !b.checked)) fail('withdraw', 'reopened choices do not show the granted providers');
      const expanded = await page.$eval('[data-consent="customise"]', (b) => b.getAttribute('aria-expanded'));
      if (expanded !== 'true') fail('withdraw', 'reopened choices are not expanded');
      // Tab to "Reject optional" and press it.
      let reached = false;
      for (let i = 0; i < 12 && !reached; i++) {
        await page.keyboard.press('Tab');
        reached = await page.evaluate(() => document.activeElement?.getAttribute('data-consent') === 'reject');
      }
      if (!reached) fail('withdraw', 'Reject optional is not reachable by keyboard from the reopened request');
      await page.keyboard.press('Enter');
      await settle(page);
      const before = log.collect.length;
      const left = await analyticsCookies(page);
      const s = await state(page);
      // Same-page navigation (a new path: a hash alone is not a page view) and further page loads
      // must collect nothing more. The wait outlasts PostHog's 3 s send interval.
      await page.evaluate(() => history.pushState({}, '', '/digital/after-withdrawal'));
      await sleep(3500);
      for (const route of STUDIOS) await go(page, route);
      receipt.scenarios.withdraw = { label, collectBefore: before, collectAfter: log.collect.length - before, retries: log.retries.length, cookiesLeft: left, focusAfter: s.focused };
      if (log.collect.length !== before) fail('withdraw', `${log.collect.length - before} collection request(s) after withdrawing`);
      if (left.length) fail('withdraw', `analytics cookies remain after withdrawing: ${left.join(', ')}`);
      if (!/^v2:g[0-]:p[0-]:/.test((await consentCookie(page))?.value ?? '')) fail('withdraw', 'withdrawal not recorded');
      if (s.local.some((k) => /^(?:ph_|__ph)/.test(k)) || s.session.some((k) => /^(?:ph_|__ph)/.test(k))) fail('withdraw', 'PostHog storage keys remain');
      await context.close();
    }

    // 6. Withdrawal in one tab stops collection in the site's other open tabs, without a reload.
    {
      const a = await openPage(browser, { cookie: accepted });
      const b = await openPage(browser, { cookie: accepted, context: a.context });
      await go(a.page, '/digital');
      await go(b.page, '/press');
      // Real libraries batch: wait for the second tab's own page views to leave before withdrawing,
      // so anything sent afterwards was collected afterwards.
      await until(() => b.log.collect.length > 0);
      if (!b.log.collect.length) fail('other tab', 'the second tab collected nothing while granted — the scenario would measure nothing');
      await sleep(3500);
      await a.page.$eval('footer button', (x) => x.click());
      await sleep(300);
      await press(a.page, 'reject');
      await settle(a.page);
      await sleep(500);
      const before = b.log.collect.length;
      await b.page.evaluate(() => history.pushState({}, '', '/press/after-other-tab'));
      await sleep(5000);
      receipt.scenarios['other tab'] = { collectBefore: before, collectAfter: b.log.collect.length - before, after: b.log.collect.slice(before).map(brief), cookiesLeft: await analyticsCookies(b.page) };
      if (b.log.collect.length !== before) fail('other tab', `collection continued in another open tab after withdrawing: ${b.log.collect.length - before} request(s)`);
      await a.context.close();
    }

    // 5. Change one provider only: GA4 withdrawn, PostHog kept.
    if (offers('ga4') && offers('posthog')) {
      const { context, page, log } = await openPage(browser, { cookie: accepted });
      await go(page, '/');
      await page.$eval('footer button', (b) => b.click());
      await page.click('input[name="ga4"]');
      await press(page, 'save');
      await settle(page);
      const before = log.collect.filter((u) => /google-analytics/.test(u)).length;
      if (!before) fail('change', 'GA4 collected nothing before being withdrawn — the scenario would measure nothing');
      const posthogBefore = log.collect.filter((u) => /posthog/.test(u)).length;
      await page.evaluate(() => history.pushState({}, '', '/changed'));
      await until(() => log.collect.filter((u) => /posthog/.test(u)).length > posthogBefore);
      await sleep(1500);
      if (log.collect.filter((u) => /posthog/.test(u)).length === posthogBefore) fail('change', 'the kept provider sent nothing on a new page — the scenario would measure nothing');
      const gaAfter = log.collect.filter((u) => /google-analytics/.test(u)).length - before;
      const c = await consentCookie(page);
      const left = await analyticsCookies(page);
      receipt.scenarios.change = { cookie: c?.value, gaAfter, cookies: left };
      if (!/^v2:g0:p1:/.test(c?.value ?? '')) fail('change', `decision is ${c?.value}`);
      if (gaAfter) fail('change', 'GA4 collected after being withdrawn');
      if (left.some((n) => /^_ga/.test(n))) fail('change', 'GA4 cookies remain after withdrawal');
      if (!left.some((n) => /^ph_/.test(n))) fail('change', 'PostHog stopped although it was kept');
      await context.close();
    }

    // 15. Expired, malformed, partial and legacy decisions: asked again, nothing starts, leftovers removed.
    // `v2:g1:p1:1761600000` is a full grant made more than 180 days ago: lapsed, so no decision.
    for (const value of ['1', '0', 'analytics_storage%2Cad_storage', 'v2:g1:p1', 'v2:gx:p1:1761600000', 'v2:g-:p-:1761600000', 'v2:g1:p1:1761600000']) {
      const { context, page, log } = await openPage(browser, { cookie: value });
      await page.setCookie({ name: '_ga', value: 'GA1.1.left', url: BASE_URL });
      await go(page, '/about');
      const s = await state(page);
      const left = await analyticsCookies(page);
      receipt.scenarios[`stored ${value}`] = { visible: s.visible, scripts: log.scripts.length, cookies: left };
      if (!s.visible) fail(`stored ${value}`, 'request not shown for a decision that does not cover the offered providers');
      if (log.scripts.length || log.collect.length) fail(`stored ${value}`, 'analytics requested without a covering grant');
      if (left.length) fail(`stored ${value}`, `leftover analytics cookies not removed: ${left.join(', ')}`);
      await context.close();
    }
  } else {
    // Notice mode. 2. Got it: exactly one cookie, `1`, for a year; reload keeps it hidden; reopen works.
    const { context, page, log } = await openPage(browser);
    await go(page, '/');
    await press(page, 'ok');
    await settle(page);
    const c = await consentCookie(page);
    const set = await cookies(page);
    await page.reload({ waitUntil: 'networkidle0' }); await settle(page);
    const reloaded = await state(page);
    await page.$eval('footer button', (b) => b.click());
    const reopened = await state(page);
    receipt.scenarios.acknowledge = { cookie: c?.value, lifetime: lifetime(c), cookies: set.map((x) => x.name), reopened: reopened.visible };
    if (c?.value !== '1' || set.length !== 1) fail('acknowledge', `cookies after Got it: ${set.map((x) => `${x.name}=${x.value}`)}`);
    if (Math.abs((lifetime(c) ?? 0) - YEAR) > 120) fail('acknowledge', `lifetime ${lifetime(c)}s, expected ${YEAR}s`);
    if (reloaded.visible) fail('acknowledge', 'notice returned on reload');
    if (!reopened.visible) fail('acknowledge', 'footer control did not reopen the notice');
    if (log.scripts.length || log.collect.length) fail('acknowledge', 'analytics requested in notice mode');
    await context.close();
    for (const value of ['1', '0', '', 'analytics_storage%2Cad_storage%2Cfunctionality_storage']) {
      const legacy = await openPage(browser, { cookie: value });
      await go(legacy.page, '/press');
      const s = await state(legacy.page);
      const kept = await consentCookie(legacy.page);
      receipt.scenarios[`stored ${value || '(empty)'}`] = { visible: s.visible, kept: kept?.value };
      if (s.visible) fail(`stored ${value}`, 'an acknowledged notice was shown again');
      if ((kept?.value ?? null) !== value) fail(`stored ${value}`, `stored value rewritten to ${kept?.value}`);
      if (legacy.log.scripts.length || legacy.log.collect.length) fail(`stored ${value}`, 'analytics requested');
      await legacy.context.close();
    }
  }

  // 12. Mobile: the request fits, its controls meet 24px, nothing overflows.
  {
    const { context, page } = await openPage(browser, { viewport: [375, 812] });
    await go(page, '/');
    if (consent) await press(page, 'customise');
    const fit = await page.evaluate(() => {
      const bar = document.getElementById('gs-consent-heading').closest('[role="region"]');
      const controls = [...bar.querySelectorAll('button, input, a')].filter((e) => e.checkVisibility());
      return { overflow: document.documentElement.scrollWidth > innerWidth, small: controls.filter((e) => { const r = e.getBoundingClientRect(); return r.width < 24 || r.height < 24; }).map((e) => e.textContent.trim() || e.name),
        offscreen: controls.filter((e) => { const r = e.getBoundingClientRect(); return r.right > innerWidth || r.left < 0; }).length, count: controls.length };
    });
    receipt.scenarios.mobile = fit;
    if (!fit.count) fail('mobile', 'no controls measured');
    if (fit.overflow || fit.offscreen) fail('mobile', 'request overflows a 375px viewport');
    // Inline links are exempt from 2.5.8 only within a sentence; the policy link is one.
    if (fit.small.filter((n) => n !== 'Cookie Policy').length) fail('mobile', `targets under 24px: ${fit.small}`);
    await context.close();
  }

  // 11. Reduced motion changes nothing about the choice.
  {
    const { context, page, log } = await openPage(browser, { reducedMotion: true });
    await go(page, '/design');
    await press(page, consent ? 'reject' : 'ok');
    await settle(page);
    const s = await state(page);
    receipt.scenarios['reduced motion'] = { hidden: !s.visible };
    if (s.visible) fail('reduced motion', 'choice not applied under reduced motion');
    if (log.scripts.length || log.collect.length) fail('reduced motion', 'analytics requested');
    await context.close();
  }

  // 13. Without JavaScript: no request, no cookie, no analytics — and the request is not left unusable.
  {
    const { context, page, log } = await openPage(browser, { javascript: false });
    await page.goto(BASE_URL + '/', { waitUntil: 'networkidle0' });
    const visible = await page.evaluate(() => document.getElementById('gs-consent-heading')?.closest('[role="region"]')?.checkVisibility() ?? false);
    const set = await cookies(page);
    receipt.scenarios['no javascript'] = { visible, cookies: set.length, requests: log.scripts.length + log.collect.length };
    if (visible) fail('no javascript', 'a request that cannot work without JavaScript is shown');
    if (set.length || log.scripts.length || log.collect.length) fail('no javascript', 'something was stored or requested');
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify(receipt, null, 2));
if (problems.length) {
  console.error(`\ncheck-consent: ${problems.length} problem(s) against ${BASE_URL}\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`check-consent: ${receipt.mode} mode, providers [${receipt.providers.join(', ')}] — ${Object.keys(receipt.scenarios).length} scenario(s) measured; nothing requested or stored before a choice${receipt.mode === 'consent' ? '; withdrawal stops collection and clears cookies' : ''}`);
