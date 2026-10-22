/** Local artifact rendering, accessibility and legal identity; no HTTP server or provider calls. */
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import axe from 'axe-core';
import { launch } from './browser-launch.mjs';
import { LEGAL_DOCUMENTS } from './seed-legal.mjs';
import { bannerProblems } from './legal-parity-rules.mjs';

const browser = await launch();
const receipt = { input: 'built HTML rendered offline; HTTP, deployment and assistive technology unverified', pages: [] };
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900 });
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const url = new URL(request.url());
      const path = url.pathname.startsWith('/_next/static/') ? join('.next', url.pathname.slice('/_next/'.length)) : null;
      if (url.hostname !== 'artifact.invalid' || !path || !existsSync(path)) { void request.abort(); return; }
      const contentType = path.endsWith('.css') ? 'text/css' : path.endsWith('.woff2') ? 'font/woff2' : 'application/octet-stream';
      void request.respond({ status: 200, contentType, body: readFileSync(path) });
    });
    for (const doc of LEGAL_DOCUMENTS) {
      const slug = doc.slug.current;
      const html = readFileSync(`.next/server/app/legal/${slug}.html`, 'utf8');
      assert(html.includes('noindex'), `${slug}: private review must remain noindex`);
      assert.deepEqual(bannerProblems(`/legal/${slug}`, doc.adoptionState, html), [], `${slug}: adoption state`);
      assert(html.includes('Effective on first publication with the replacement website at gridsmith.uk'), `${slug}: commencement`);
      // Exclude application scripts; axe needs a live JS execution context for its own timers.
      const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
      await page.setContent(markup.replace('<head>', '<head><base href="https://artifact.invalid/">'), { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => document.fonts.status === 'loaded');
      assert.equal(await page.$eval('h1', (element) => element.textContent), doc.title);
      assert.equal(await page.$$eval('section[id^="clause-"]', (nodes) => nodes.length), doc.clauses.length);
      assert(await page.$eval('body', (element) => element.scrollWidth <= document.documentElement.clientWidth + 1), `${slug}: overflow at ${width}`);
      await page.evaluate(axe.source);
      const result = await page.evaluate(() => globalThis.axe.run({ runOnly: {
        type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'],
      } }));
      assert.deepEqual(result.violations.map((violation) => ({ id: violation.id, impact: violation.impact })), [], `${slug} ${width}`);
      receipt.pages.push({ slug, width, adoptionState: doc.adoptionState, clauses: doc.clauses.length, violations: result.violations.length });
    }
    await page.close();
  }
  console.log(JSON.stringify(receipt, null, 2));
} finally { await browser.close(); }
