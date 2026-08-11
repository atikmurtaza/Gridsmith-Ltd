#!/usr/bin/env node
/**
 * check-axe
 *
 * WCAG 2.2 AA is the floor — CLAUDE.md non-negotiable #10, Definition of Done "axe zero
 * violations".
 *
 * Runs the full axe-core ruleset against a real browser, which is a superset of the
 * accessibility audits Lighthouse performs. Both gates exist because they overlap rather
 * than duplicate: Lighthouse scores a curated subset and rolls it into a number, axe
 * reports every rule individually and does not average anything away.
 *
 * `/_kitchen-sink` is the important target — every primitive, every state, four themes.
 * The four route-group pages are checked too so a layout-level regression is caught.
 *
 * Expects a server already running at BASE_URL (`npm run start`).
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { AxePuppeteer } from '@axe-core/puppeteer';
import puppeteer from 'puppeteer';

/**
 * The axe source is read and passed in explicitly rather than left to the adapter.
 *
 * @axe-core/puppeteer resolves axe-core from its own `import.meta.url`, which is a
 * file:// URL — and this project's path contains a space, so the URL carries `%20` and
 * the resolved path does not exist. `fileURLToPath` decodes it. Without this the gate
 * throws MODULE_NOT_FOUND on any checkout under a path with a space in it.
 */
const require = createRequire(fileURLToPath(import.meta.url));
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const BASE_URL = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';

const ROUTES = ['/', '/design', '/digital', '/press', '/_kitchen-sink'];

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

/**
 * Three structural assertions axe cannot make.
 *
 * axe-core keeps `duplicate-id` and `duplicate-id-active` behind its `deprecated` tag, so
 * no combination of WCAG tags reaches them — `axe.getRules(TAGS)` returns `duplicate-id-aria`
 * and nothing else in that family. The kitchen sink served 80 duplicate id attributes,
 * one radio group spanning four theme frames and one exclusive `<details>` group doing
 * the same, and every axe run reported zero violations.
 *
 * "The gate has no rule for it" is not the same as "the page is fine", so the assertion
 * moves here rather than waiting for axe to grow one back.
 */
async function domIntegrity(page, route) {
  const found = await page.evaluate(() => {
    const frameOf = (el) => el.closest('[data-division]')?.dataset.division ?? '(root)';
    const problems = [];

    const byId = new Map();
    for (const el of document.querySelectorAll('[id]')) {
      byId.set(el.id, (byId.get(el.id) ?? 0) + 1);
    }
    for (const [id, n] of byId) {
      if (n > 1) problems.push(`duplicate id "${id}" × ${n}`);
    }

    const spread = (selector, attr, label) => {
      const frames = new Map();
      for (const el of document.querySelectorAll(selector)) {
        const name = el.getAttribute(attr);
        if (!name) continue;
        (frames.get(name) ?? frames.set(name, new Set()).get(name)).add(frameOf(el));
      }
      for (const [name, set] of frames) {
        if (set.size > 1) problems.push(`${label} "${name}" spans ${set.size} theme frames: ${[...set].join(', ')}`);
      }
    };

    // One `name` across two frames means one group across two themes: choosing in one
    // clears the other, and only the last `checked`/`open` in the document survives.
    spread('input[type="radio"]', 'name', 'radio group');
    spread('details[name]', 'name', 'exclusive details group');

    return problems;
  });

  if (found.length === 0) return 0;

  console.error(`  ${route.padEnd(16)} ${found.length} DOM integrity problem(s)`);
  for (const p of found.slice(0, 12)) console.error(`      ${p}`);
  if (found.length > 12) console.error(`      …and ${found.length - 12} more`);
  return found.length;
}

/**
 * `--no-sandbox` is required on GitHub's runners: the Chrome sandbox needs user
 * namespaces the container does not grant, and without it Chrome aborts on launch with a
 * stack trace rather than a readable error. `--disable-dev-shm-usage` avoids the 64MB
 * /dev/shm that makes it crash again later, under load rather than at startup.
 *
 * Both Lighthouse configs already passed these as `chromeFlags`; the two Puppeteer gates
 * did not, so they were the only two of the four browser launch sites that failed in CI —
 * and they failed 3 seconds into a step that passes in 20 locally.
 */
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
let total = 0;
let checked = 0;

try {
  for (const route of ROUTES) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    const response = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0' });

    // A route that did not load is a measurement failure, not zero violations. Reporting
    // "0 violations" for a 404 is precisely the unearned-confidence failure the gate
    // rules in CLAUDE.md exist to prevent.
    // 304 is a load, not a failure: puppeteer reuses its cache across pages in one
    // browser, so a revisited route legitimately returns Not Modified.
    if (!response || response.status() >= 400) {
      console.error(`\ncheck-axe: ${route} returned ${response ? response.status() : 'no response'}.`);
      console.error('Cannot audit this route. Fix the route or the base URL.\n');
      process.exit(1);
    }

    // Scroll to the foot before analysing. StickyCta only un-hides itself past 40% scroll
    // depth and RevealOnScroll only reveals on intersection, so an audit taken at scroll
    // position zero skips both — aria-hidden and inert subtrees are exactly what axe is
    // designed not to look at. Auditing the top of the page is auditing less of it.
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 400));
    });

    const { violations } = await new AxePuppeteer(page, axeSource).withTags(TAGS).analyze();
    checked += 1;

    const domProblems = await domIntegrity(page, route);
    total += domProblems;

    if (violations.length === 0) {
      if (domProblems === 0) console.log(`  ${route.padEnd(16)} clean`);
    } else {
      const count = violations.reduce((n, v) => n + v.nodes.length, 0);
      total += count;
      console.error(`  ${route.padEnd(16)} ${count} violation(s) across ${violations.length} rule(s)`);
      for (const v of violations) {
        console.error(`      [${v.impact ?? 'n/a'}] ${v.id} — ${v.help}`);
        for (const node of v.nodes.slice(0, 3)) {
          console.error(`        ${node.target.join(' ')}`);
        }
        if (v.nodes.length > 3) console.error(`        …and ${v.nodes.length - 3} more`);
      }
    }

    await page.close();
  }
} finally {
  await browser.close();
}

if (checked !== ROUTES.length) {
  console.error(`\ncheck-axe: audited ${checked} of ${ROUTES.length} routes. Nothing may be skipped.\n`);
  process.exit(1);
}

if (total > 0) {
  console.error(`\ncheck-axe: ${total} problem(s). WCAG 2.2 AA is the floor, not a target.\n`);
  process.exit(1);
}

console.log(`\ncheck-axe: ${checked} routes, zero violations (${TAGS.join(', ')})`);
console.log('check-axe: no duplicate ids, no radio or exclusive-details group spanning theme frames\n');
