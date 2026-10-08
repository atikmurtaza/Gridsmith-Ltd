/** H4-A focused loopback proof. GET/navigation/client state only; never submit forms. */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { AxePuppeteer } from '@axe-core/puppeteer';
import { launch } from './browser-launch.mjs';
import { preparePress } from './press-contrast.mjs';
import { REVIEW_STAGING_ORIGIN } from '../lib/reviews/public-model.ts';
import { LEGAL_DOCUMENT_SLUGS } from '../lib/legal/slugs.ts';
import { servedLegalPreview } from './legal-preview-rules.mjs';

const normal = process.argv.includes('--normal');
const base = process.env.STATIC_BASE_URL ?? (normal ? 'http://127.0.0.1:3235' : 'http://127.0.0.1:3236');
const origin = new URL(base);
const hosted = base === REVIEW_STAGING_ORIGIN;
assert(hosted || ['localhost', '127.0.0.1'].includes(origin.hostname), 'Proof must use loopback or the exact authorised Hostinger staging origin');
const publication = JSON.parse(readFileSync('docs/_shared/GS-PROD-001-CMS-MANIFEST.json', 'utf8')).entries;
const services = ['design', 'digital', 'press'].map((division) => {
  const entry = publication.find((item) => item.type === 'service' && item.eligible && item.division === division);
  assert(entry); return `/${division}/services/${entry.slug}`;
});
const routes = ['/', '/design', '/digital', '/press', ...services, '/about', '/approach',
  '/contact', '/insights', '/press/contact', '/press/contact/thank-you', '/press/path-finder'];
// Ask the served artifact, not an optional runner-side manifest. R12 can never silently skip.
const deploymentResponse = normal ? null : await fetch(base + '/__deployment.json');
assert(normal || deploymentResponse.ok, 'Static artifact must identify its served profile');
const deployment = deploymentResponse ? await deploymentResponse.json() : null;
const legalPreview = normal ? false : servedLegalPreview(deployment, process.argv.includes('--legal-preview'));
const legalRoutes = legalPreview ? LEGAL_DOCUMENT_SLUGS.map((slug) => `/legal/${slug}`) : [];
routes.push(...legalRoutes);
const pause = (ms) => new Promise((done) => setTimeout(done, ms));
const browser = await launch();
const page = await browser.newPage();
const errors = [], failedRequests = [], badResponses = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('requestfailed', (request) => failedRequests.push(new URL(request.url()).pathname));
page.on('response', (response) => {
  const path = new URL(response.url()).pathname;
  if (response.status() >= 400 && path !== '/h4a-unknown-route') badResponses.push({ path, status: response.status() });
});
const receipt = { phase: 'GS-HOST-H4-D-R1', profile: hosted ? 'hosted' : normal ? 'normal' : 'static', pages: [],
  noJs: [], accessibility: [], realGpu: 'UNVERIFIED', server: normal ? 'Next runtime' : 'plain file server' };
receipt.legalPreview = legalPreview;
try {
  await page.setViewport({ width: 1440, height: 900 });
  for (const route of routes) {
    assert.equal((await page.goto(base + route, { waitUntil: 'networkidle0' })).status(), 200);
    const state = await page.evaluate(() => ({ title: document.title,
      h1: document.querySelector('h1')?.textContent?.trim(),
      ink: getComputedStyle(document.body).getPropertyValue('--ink').trim(),
      noindex: document.querySelector('meta[name=robots]')?.getAttribute('content'),
      lang: document.documentElement.lang, main: Boolean(document.querySelector('main#main')) }));
    assert(state.title && state.h1 && state.ink && /^en(?:-|$)/i.test(state.lang) && state.main,
      JSON.stringify({ route, state }));
    assert(state.noindex?.includes('noindex'));
    receipt.pages.push({ route, ...state });
  }
  receipt.legal = [];
  for (const route of legalRoutes) {
    for (const js of [true, false]) {
      const document = await browser.newPage();
      await document.setJavaScriptEnabled(js); await document.setCacheEnabled(false);
      await document.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      for (const width of [320, 390, 768, 1024, 1440]) {
        await document.setViewport({ width, height: 900 });
        assert.equal((await document.goto(base + route, { waitUntil: 'networkidle0' })).status(), 200);
        const state = await document.evaluate(() => {
          const clauses = [...document.querySelectorAll('main section[id^="clause-"]')];
          const anchors = [...document.querySelectorAll('main nav a[href^="#clause-"]')];
          return { h1: document.querySelectorAll('main h1').length,
            clauses: clauses.length, anchors: anchors.length,
            unique: new Set(clauses.map((el) => el.id)).size === clauses.length,
            links: anchors.every((el) => document.getElementById(el.getAttribute('href').slice(1))),
            headings: clauses.every((el) => el.querySelector('h2')),
            overflow: document.documentElement.scrollWidth > innerWidth + 1,
            banner: document.querySelector('main').textContent.includes('ADOPTED, NOT YET PUBLISHED.'),
            footer: Boolean(document.querySelector('footer')), header: Boolean(document.querySelector('header')) };
        });
        assert(state.h1 === 1 && state.clauses > 0 && state.anchors > 0 && state.unique && state.links &&
          state.headings && !state.overflow && state.banner && state.footer && state.header, `${route}/${width}/JS:${js} ${JSON.stringify(state)}`);
        if (width < 1024) {
          await document.focus('main details > summary'); await document.keyboard.press('Enter');
          assert(await document.$eval('main details', (el) => el.open));
          await document.keyboard.press('Tab');
        } else await document.focus('main nav a[href^="#clause-"]');
        const href = await document.evaluate(() => document.activeElement?.getAttribute('href'));
        assert(href?.startsWith('#clause-'), 'Keyboard did not reach legal contents');
        await document.keyboard.press('Enter');
        const target = await document.$eval(href, (el) => ({ top: el.getBoundingClientRect().top,
          heading: el.querySelector('h2')?.textContent }));
        assert(target.top >= 0 && target.top < 900 && target.heading, 'Legal anchor is hidden/outside viewport');
        receipt.legal.push({ route, js, width, ...state, anchor: href });
      }
      await document.close();
    }
  }
  // All rendered legal destinations and fragments must resolve; the adopted wording stays intact.
  receipt.legalLinks = 0;
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'networkidle0' });
    const links = await page.$$eval('a[href^="/legal/"]', (nodes) => nodes.map((el) => el.getAttribute('href')));
    if (legalPreview) for (const href of new Set(links)) {
      const target = new URL(href, base);
      assert(legalRoutes.includes(target.pathname), `Unknown legal destination ${href}`);
      const html = await (await fetch(target)).text();
      assert(html.includes('ADOPTED, NOT YET PUBLISHED.'));
      if (target.hash) assert(html.includes(`id="${target.hash.slice(1)}"`), `Orphan legal fragment ${href}`);
      receipt.legalLinks++;
    }
  }
  // The explicit software scene affordance proves hydration, not device GPU performance.
  await page.goto(base + '/?scene=software', { waitUntil: 'networkidle0' });
  await page.waitForSelector('[data-render="ready"]');
  receipt.master = 'software WebGL ready';
  assert.equal(await page.$$eval('[data-reviews-carousel] blockquote', (nodes) => nodes.length), 11);
  // GS-HOST-H4-G: the approved GS-VIS-001 cylinder turns continuously; its angle is the ring's
  // rotateY, and its controls are named by aria-label (the contract check:reviews:ui also reads).
  const reviewAngle = () => page.$eval('[data-reviews-carousel] ul',
    (el) => Number(/rotateY\((-?[\d.]+)deg\)/.exec(el.style.transform)?.[1]));
  const reviewButton = (name) => page.$eval('[data-reviews-carousel]', (el, label) =>
    [...el.querySelectorAll('button')].find((button) => button.getAttribute('aria-label') === label)?.focus(), name);
  await page.$eval('[data-reviews-carousel]', (el) => el.scrollIntoView({ block: 'center' }));
  const initialAngle = await reviewAngle(); await pause(3000);
  const turnedAngle = await reviewAngle();
  assert(Number.isFinite(initialAngle) && Number.isFinite(turnedAngle), 'Review cylinder exposes no rotateY angle');
  assert(Math.abs(turnedAngle - initialAngle) > 1, 'Continuous review rotation did not advance');
  await reviewButton('Pause review rotation');
  await page.keyboard.press('Enter'); await pause(1500);
  const pausedAngle = await reviewAngle(); await pause(3000);
  assert(Math.abs(await reviewAngle() - pausedAngle) < 0.01, 'Paused review cylinder kept turning');
  await reviewButton('Rotate reviews right');
  await page.keyboard.press('Enter'); await pause(1500);
  assert(Math.abs(await reviewAngle() - pausedAngle) > 1, 'Rotate reviews right did not turn the paused cylinder');
  receipt.reviews = { count: 11, continuousRotation: true, pause: true, arrows: true };

  await page.goto(base + '/design', { waitUntil: 'networkidle0' });
  await page.waitForSelector('[data-design-story][data-enhanced="true"]');
  const beforeChapter = await page.$eval('[data-design-story]', (el) => el.dataset.active);
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight * 0.55)); await pause(700);
  const afterChapter = await page.$eval('[data-design-story]', (el) => el.dataset.active);
  assert.notEqual(afterChapter, beforeChapter);
  receipt.design = { beforeChapter, afterChapter };
  const disclosure = await page.$('main details');
  assert(disclosure, 'Design service disclosure missing');
  await disclosure.evaluate((el) => { el.open = false; el.querySelector('summary').focus(); });
  await page.keyboard.press('Enter');
  assert(await disclosure.evaluate((el) => el.open));
  receipt.disclosure = true;
  const serviceLink = await page.$(`a[href="${services[0]}"]`);
  assert(serviceLink, 'Service navigation subject missing');
  await serviceLink.evaluate((el) => { const details = el.closest('details'); if (details) details.open = true; el.scrollIntoView({ block: 'center' }); });
  await serviceLink.click();
  await page.waitForFunction((path) => location.pathname === path, {}, services[0]);
  assert(await page.$('main h1')); receipt.navigation = services[0];

  await page.goto(base + '/digital', { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => document.querySelector('.dg-apertures')?.dataset.motion);
  const motionBefore = await page.$eval('.dg-apertures', (el) => el.dataset.motion);
  await page.click('.dg-motion-control');
  const motionAfter = await page.$eval('.dg-apertures', (el) => el.dataset.motion);
  assert.notEqual(motionBefore, motionAfter); receipt.digital = { motionBefore, motionAfter };

  await page.goto(base + '/press', { waitUntil: 'networkidle0' });
  await page.waitForSelector('.pr-home.pr-motion'); receipt.pressMotion = true;
  await page.goto(base + '/press/path-finder', { waitUntil: 'networkidle0' });
  assert.equal(await page.$eval('[data-path-step]', (el) => el.dataset.pathStep), '1');
  await page.$eval('main input[type=radio]', (el) => el.focus());
  await page.keyboard.press('Space');
  await page.waitForFunction(() => [...document.querySelectorAll('main button')].some((el) => el.textContent.trim() === 'Next' && !el.disabled));
  await page.$eval('main', (el) => [...el.querySelectorAll('button')].find((button) => button.textContent.trim() === 'Next').focus());
  await page.keyboard.press('Enter');
  await page.waitForSelector('[data-path-step="2"]'); receipt.pressPathFinder = '1 -> 2';

  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(base + '/', { waitUntil: 'networkidle0' });
  // GS-VIS-001-R1: reduced motion keeps the drum, still — nothing turns and there is nothing to pause.
  await page.$eval('[data-reviews-carousel]', (el) => el.scrollIntoView({ block: 'center' }));
  await pause(500);
  const stillAngle = await reviewAngle(); await pause(2500);
  assert(Number.isFinite(stillAngle), 'Reduced-motion review cylinder exposes no rotateY angle');
  assert(Math.abs(await reviewAngle() - stillAngle) < 0.01, 'Review cylinder turned on its own under reduced motion');
  assert.equal(await page.$eval('[data-reviews-carousel] button[data-pause]', (el) => getComputedStyle(el).display), 'none');
  await page.goto(base + '/digital', { waitUntil: 'networkidle0' });
  assert.equal(await page.$eval('.dg-apertures', (el) => el.dataset.motion), 'inactive');
  receipt.reducedMotion = 'still review cylinder without a pause control, and Digital reduced state';
  await page.emulateMediaFeatures([]);

  await page.goto(base + '/about', { waitUntil: 'networkidle0' });
  await page.bringToFront(); await page.evaluate(() => { window.focus(); document.activeElement?.blur(); });
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('href')), '#main');
  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'main'); receipt.keyboardSkip = true;

  // Native popover navigation works with the keyboard on the narrow layout.
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(base + '/about', { waitUntil: 'networkidle0' });
  await page.focus('button[popovertarget="site-menu"]');
  await page.keyboard.press('Enter');
  assert(await page.$eval('#site-menu', (el) => el.matches(':popover-open')));
  await page.keyboard.press('Tab');
  assert(await page.evaluate(() => Boolean(document.activeElement?.closest('#site-menu'))));
  await page.keyboard.press('Escape');
  assert(!(await page.$eval('#site-menu', (el) => el.matches(':popover-open'))));
  receipt.mobileMenuKeyboard = true;
  await page.setViewport({ width: 1440, height: 900 });

  assert.equal((await page.goto(base + '/h4a-unknown-route', { waitUntil: 'networkidle0' })).status(), 404);
  assert((await page.title()).toLowerCase().includes('not found')); receipt.local404 = 404;
  if (!normal) {
    const require = createRequire(fileURLToPath(import.meta.url));
    const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
    const rawAxe = [];
    for (const route of ['/', '/design', '/digital', '/press', ...services, '/about', '/approach', '/contact', '/insights', '/press/contact', '/press/contact/thank-you', ...legalRoutes]) {
      await page.goto(base + route, { waitUntil: 'networkidle0' });
      // Match the existing normal gate: audit each revealed, settled Press chapter,
      // rather than causing axe's scrolling to sample a first-entrance transition.
      if (route === '/press') {
        await preparePress(page);
        await page.click('.pr-desk-loop');
        await pause(2000);
        receipt.pressAxeState = await page.evaluate(() => ({
          stage: document.querySelector('[name="pr-desk"]:checked')?.value,
          paused: document.querySelector('.pr-desk-loop')?.getAttribute('aria-pressed'),
        }));
        assert.equal(receipt.pressAxeState.paused, 'true');
      }
      const result = await new AxePuppeteer(page, axeSource).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      rawAxe.push({ route, result });
      receipt.accessibility.push({ route, violations: result.violations.map((issue) => ({ id: issue.id, impact: issue.impact,
        nodes: issue.nodes.map((node) => node.target) })), incomplete: result.incomplete.map((issue) => issue.id) });
      if (legalRoutes.includes(route)) {
        await page.setViewport({ width: 390, height: 900 });
        const mobile = await new AxePuppeteer(page, axeSource).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
        rawAxe.push({ route, width: 390, result: mobile });
        receipt.accessibility.push({ route, js: true, width: 390, violations: mobile.violations.map((issue) => ({ id: issue.id, impact: issue.impact,
          nodes: issue.nodes.map((node) => node.target) })), incomplete: mobile.incomplete.map((issue) => issue.id) });
        await page.setViewport({ width: 1440, height: 900 });
      }
    }
    // No-JS reviews use the same full list, without duplicate fallback text.
    // No-JS never collects answers or invokes an endpoint.
    const noJs = await browser.newPage(); await noJs.setJavaScriptEnabled(false);
    await noJs.setCacheEnabled(false); // This route proof requires fresh 200 bodies, not cached 304 revalidation.
    for (const route of ['/', '/design', '/digital', '/press', ...services, '/about', '/approach', '/contact', '/insights', '/press/contact', '/press/contact/thank-you', ...legalRoutes]) {
      assert.equal((await noJs.goto(base + route, { waitUntil: 'networkidle0' })).status(), 200);
      if (route === '/') {
        const reviews = await noJs.$eval('[data-reviews-carousel]', (root) => ({
          count: root.querySelectorAll('blockquote').length,
          transform: getComputedStyle(root.querySelector('ul')).transform,
          cards: [...root.querySelectorAll('li')].every((card) => getComputedStyle(card).transform === 'none' && getComputedStyle(card).backfaceVisibility !== 'hidden'),
          links: root.querySelectorAll('a[href=\"https://www.freelancer.com/u/GridsmithLTD\"]').length,
        }));
        assert.equal(reviews.count, 11); assert.equal(reviews.links, 11);
        assert.equal(reviews.transform, 'none'); assert(reviews.cards);
        receipt.noJsReviews = reviews;
      }
      const state = await noJs.evaluate(() => ({ h1: Boolean(document.querySelector('h1')?.textContent.trim()),
        mainText: document.querySelector('main')?.textContent.trim().length ?? 0,
        navigation: document.querySelectorAll('header a[href]').length,
        disclosure: document.body.textContent.includes('Gridsmith Ltd'),
        overflow: document.documentElement.scrollWidth > innerWidth + 1 }));
      assert(state.h1 && state.mainText > 100 && state.navigation > 0 && state.disclosure);
      state.reflow = [];
      for (const width of [390, 768, 1440, 1920]) {
        await noJs.setViewport({ width, height: 900 });
        const overflow = await noJs.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
        assert(!overflow, `No-JS horizontal overflow: ${route} at ${width}px`);
        state.reflow.push({ width, overflow });
      }
      receipt.noJs.push({ route, ...state });
      if (legalRoutes.includes(route)) for (const width of [320, 1440]) {
        await noJs.setViewport({ width, height: 900 });
        // H4-E's established method: axe needs script execution, so audit an asserted replay
        // of the cold no-JS DOM. No application script is present or allowed to load.
        const originalText = await noJs.$eval('main', (el) => el.innerText);
        const rewriteScripting = (css) => css.replace(/\(scripting:\s*none\)/g, '(min-width: 0px)')
          .replace(/\(scripting:\s*enabled\)/g, '(max-width: 0px)');
        const html = rewriteScripting((await noJs.content()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<\/?noscript\b[^>]*>/gi, '').replace('<head>', `<head><base href="${base}/">`));
        const replay = await browser.newPage(); await replay.setViewport({ width, height: 900 });
        await replay.setRequestInterception(true);
        replay.on('request', async (request) => {
          if (request.resourceType() === 'script') return request.abort();
          if (request.resourceType() === 'stylesheet') {
            const response = await fetch(request.url());
            assert(response.ok, 'No-JS replay stylesheet missing');
            return request.respond({ status: 200, contentType: 'text/css', body: rewriteScripting(await response.text()) });
          }
          return request.continue();
        });
        await replay.setContent(html, { waitUntil: 'networkidle0' });
        assert.equal(await replay.$eval('main', (el) => el.innerText), originalText, 'No-JS replay changed visible legal content');
        if (!receipt.noJsAxeValidity) {
          await replay.evaluate(() => {
            const specimen = document.createElement('p'); specimen.id = 'r12-contrast-specimen';
            specimen.textContent = 'Deliberately unreadable verification specimen';
            specimen.style.cssText = 'color:var(--line);background:var(--canvas);padding:20px';
            document.querySelector('main').prepend(specimen);
            specimen.scrollIntoView();
          });
          const specimenState = await replay.$eval('#r12-contrast-specimen', (el) => ({
            color: getComputedStyle(el).color, background: getComputedStyle(el).backgroundColor,
            height: el.getBoundingClientRect().height, top: el.getBoundingClientRect().top,
          }));
          assert(specimenState.color !== specimenState.background && specimenState.height > 0 &&
            specimenState.top >= 0 && specimenState.top < 900, 'Contrast specimen must be visible and have distinct foreground/background');
          const proof = await new AxePuppeteer(replay, axeSource).withTags(['wcag2aa']).analyze();
          assert(proof.violations.some((issue) => issue.id === 'color-contrast' &&
            issue.nodes.some((node) => node.target.includes('#r12-contrast-specimen'))), 'No-JS axe replay did not reject its visible specimen');
          await replay.$eval('#r12-contrast-specimen', (el) => el.remove());
          receipt.noJsAxeValidity = 'Visible low-contrast specimen rejected in the same replay, then removed';
        }
        const result = await new AxePuppeteer(replay, axeSource).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
        rawAxe.push({ route, js: false, width, result });
        receipt.accessibility.push({ route, js: false, width, violations: result.violations.map((issue) => ({ id: issue.id, impact: issue.impact,
          nodes: issue.nodes.map((node) => node.target) })), incomplete: result.incomplete.map((issue) => issue.id) });
        await replay.close();
      }
    }
    await noJs.setViewport({ width: 375, height: 812 });
    await noJs.goto(base + '/about', { waitUntil: 'networkidle0' });
    await noJs.focus('button[popovertarget="site-menu"]');
    await noJs.keyboard.press('Enter');
    assert(await noJs.$eval('#site-menu', (el) => el.matches(':popover-open')));
    await noJs.focus('#site-menu a[href="/design"]');
    await noJs.keyboard.press('Enter');
    await noJs.waitForFunction(() => location.pathname === '/design');
    receipt.noJsMobileNavigation = true;
    await noJs.close();
    writeFileSync(`build/${hosted ? 'hosted' : 'static'}-axe-results.json`, JSON.stringify(rawAxe, null, 2) + '\n');
  }
  assert.deepEqual(errors, []); assert.deepEqual(failedRequests, []); assert.deepEqual(badResponses, []);
  receipt.browserErrors = errors; receipt.failedRequests = failedRequests; receipt.badResponses = badResponses;
  writeFileSync(`build/${hosted ? 'hosted' : normal ? 'normal' : 'static'}-ui-receipt.json`, JSON.stringify(receipt, null, 2) + '\n');
  assert.equal(receipt.accessibility.reduce((sum, row) => sum + row.violations.length, 0), 0,
    'Focused axe violations require triage; see the UI receipt');
  console.log(`${receipt.profile} browser proof PASS: ${receipt.pages.length} pages, scenes/reviews/PathFinder/navigation/reduced-motion/skip link/404.`);
  if (!normal) console.log(`Focused axe: ${receipt.accessibility.length} analyses, ${receipt.accessibility.reduce((sum, row) => sum + row.violations.length, 0)} violation rules; no-JS ${receipt.noJs.length} pages. Full AA acceptance not established.`);
} finally { await browser.close(); }
