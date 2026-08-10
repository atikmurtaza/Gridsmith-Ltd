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

const browser = await puppeteer.launch({ headless: true });
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
    if (!response || !response.ok()) {
      console.error(`\ncheck-axe: ${route} returned ${response ? response.status() : 'no response'}.`);
      console.error('Cannot audit this route. Fix the route or the base URL.\n');
      process.exit(1);
    }

    const { violations } = await new AxePuppeteer(page, axeSource).withTags(TAGS).analyze();
    checked += 1;

    if (violations.length === 0) {
      console.log(`  ${route.padEnd(16)} clean`);
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
  console.error(`\ncheck-axe: ${total} violation(s). WCAG 2.2 AA is the floor, not a target.\n`);
  process.exit(1);
}

console.log(`\ncheck-axe: ${checked} routes, zero violations (${TAGS.join(', ')})\n`);
