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

/**
 * `status` is asserted, not assumed. The 404 is a route like any other: `M-07` puts real
 * content there and `M-04`/`L-05` put the statutory company disclosure on *every* page,
 * which is a legal requirement rather than a footer decoration. Until now `_not-found`
 * appeared in exactly one place in the entire repository — an exemption in
 * check-bundle-size — so the one route that ships a legal obligation was the one route no
 * gate measured. A 404 has to be requested by fetching something that does not exist, and
 * a gate that treats every non-200 as a measurement failure cannot audit it; hence the
 * expected status rather than a blanket `>= 400`.
 */
const ROUTES = [
  { path: '/', status: 200 },
  { path: '/design', status: 200 },
  { path: '/digital', status: 200 },
  { path: '/press', status: 200 },
  { path: '/_kitchen-sink', status: 200 },
  { path: '/_gridsmith-404-probe', status: 404 },
];

/**
 * **The gate used to audit one state of one viewport, and call it the page.**
 *
 * 1280×900, scrolled to the document foot. The scroll was deliberate and correct — it
 * reaches StickyCta and RevealOnScroll, and auditing the top of a page is auditing less
 * of it. What nobody noticed is that it also means *no route is ever audited in the state
 * a visitor first meets*, and that the one width it used is the width where StickyCta is
 * `display: none`. So the bar was never evaluated in its real `position: fixed` form, at
 * any width, in any state.
 *
 * A Level A failure lived in that blind spot: four painted StickyCta specimens carrying
 * eight visible links that were simultaneously `inert` and `aria-hidden`. `inert` is
 * exactly what axe is built to skip, and scrolling to the foot flipped them live before
 * axe looked. **`check-axe` reporting `/_kitchen-sink` clean was a green result from a
 * check that did not measure the failing state** — the gate-blindness class, occurring
 * inside the gate written to close it.
 *
 * Both axes are now real: 375px is the width the Definition of Done names first and where
 * the mobile-only chrome exists at all, and scroll 0 is where every visitor starts.
 * Viewport-dependent WCAG 2.2 rules — `target-size` (2.5.8) most obviously — were being
 * evaluated at desktop width only.
 */
const VIEWPORTS = [
  { label: '375px', width: 375, height: 812 },
  { label: '1280px', width: 1280, height: 900 },
];

const PHASES = [
  { label: 'initial', scrollToFoot: false },
  { label: 'scrolled', scrollToFoot: true },
];

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

    // Every route must be themed. check-theme-flash asserts this from the prerendered
    // HTML for the four route groups, which is the right place for it — but it reads the
    // raw file, and the 404's raw file is a streaming shell that the parser resolves.
    // Reading the parsed DOM here is what covers the routes that gate cannot see, and it
    // is how a themeless page would be caught at all.
    //
    // **This assertion used to be `if (!document.body.dataset.division)` and nothing
    // else, and it was green while /_not-found rendered with no theme at all.** The
    // attribute was present — RootShell writes it server-side — but the stylesheet that
    // gives `[data-division]` any meaning was never linked on that route, so every token
    // was undefined. `outline: 2px solid var(--ink)` became invalid at computed-value
    // time, which discards the UA focus ring too: measured `outlineStyle: "none"`.
    //
    // Asserting the attribute tests the input to theming. Only a computed value tests the
    // result. That distinction is the fourth defect of this shape in this programme, and
    // the first to occur in a gate written to catch the third.
    if (!document.body.dataset.division) {
      problems.push('<body> carries no data-division — this page renders with no theme');
    }

    const bodyStyle = getComputedStyle(document.body);

    // An unlinked stylesheet makes every custom property resolve to the empty string.
    // This is the check that would have caught it: it needs no colour table and no
    // per-theme expectation, so it cannot drift from the tokens it is guarding.
    for (const token of ['--canvas', '--ink', '--line', '--accent']) {
      if (!bodyStyle.getPropertyValue(token).trim()) {
        problems.push(`${token} resolves to nothing — the token layer is not loaded on this route`);
      }
    }

    // And this is the check that catches the tokens being present but not reaching the
    // page. `--canvas` is read back through a probe so both sides are serialised by the
    // same engine — comparing a hex token to a computed colour triplet otherwise needs a
    // colour parser in the gate, which is a second thing to get wrong.
    const probe = document.createElement('span');
    probe.style.color = 'var(--canvas)';
    document.body.append(probe);
    const canvas = getComputedStyle(probe).color;
    probe.remove();

    if (bodyStyle.backgroundColor !== canvas) {
      problems.push(
        `body background is ${bodyStyle.backgroundColor} but --canvas is ${canvas} — ` +
          'the theme is declared and not applied',
      );
    }

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
let analyses = 0;

try {
  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewport({ width: viewport.width, height: viewport.height });

      const response = await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle0' });

      // A route that did not load as expected is a measurement failure, not zero
      // violations. Reporting "0 violations" for a page that never rendered is precisely
      // the unearned-confidence failure the gate rules in CLAUDE.md exist to prevent.
      // 304 is a load, not a failure: puppeteer reuses its cache across pages in one
      // browser, so a revisited route legitimately returns Not Modified.
      const status = response ? response.status() : 0;
      const ok = status === route.status || (route.status === 200 && status === 304);
      if (!ok) {
        console.error(`\ncheck-axe: ${route.path} returned ${status || 'no response'}, expected ${route.status}.`);
        console.error('Cannot audit this route. Fix the route or the base URL.\n');
        process.exit(1);
      }

      for (const phase of PHASES) {
        if (phase.scrollToFoot) {
          // StickyCta only un-hides itself past 40% scroll depth and RevealOnScroll only
          // reveals on intersection, so an audit taken at scroll position zero never sees
          // either. The `initial` phase before this one is what sees everything else.
          await page.evaluate(async () => {
            window.scrollTo(0, document.body.scrollHeight);
            await new Promise((r) => setTimeout(r, 400));
          });
        }

        const where = `${route.path} @ ${viewport.label} ${phase.label}`;
        const { violations } = await new AxePuppeteer(page, axeSource).withTags(TAGS).analyze();
        analyses += 1;

        if (violations.length === 0) {
          console.log(`  ${where.padEnd(40)} clean`);
        } else {
          const count = violations.reduce((n, v) => n + v.nodes.length, 0);
          total += count;
          console.error(`  ${where.padEnd(40)} ${count} violation(s) across ${violations.length} rule(s)`);
          for (const v of violations) {
            console.error(`      [${v.impact ?? 'n/a'}] ${v.id} — ${v.help}`);
            for (const node of v.nodes.slice(0, 3)) {
              console.error(`        ${node.target.join(' ')}`);
            }
            if (v.nodes.length > 3) console.error(`        …and ${v.nodes.length - 3} more`);
          }
        }
      }

      // Ids and grouping attributes are properties of the served markup, not of scroll
      // position, so once per page load is the honest amount.
      total += await domIntegrity(page, `${route.path} @ ${viewport.label}`);

      await page.close();
    }
  }
} finally {
  await browser.close();
}

const EXPECTED = ROUTES.length * VIEWPORTS.length * PHASES.length;
if (analyses !== EXPECTED) {
  console.error(`\ncheck-axe: ran ${analyses} of ${EXPECTED} analyses. Nothing may be skipped.\n`);
  process.exit(1);
}

if (total > 0) {
  console.error(`\ncheck-axe: ${total} problem(s). WCAG 2.2 AA is the floor, not a target.\n`);
  process.exit(1);
}

console.log(
  `\ncheck-axe: ${analyses} analyses — ${ROUTES.length} routes × ` +
    `${VIEWPORTS.map((v) => v.label).join('/')} × ${PHASES.map((p) => p.label).join('/')} — ` +
    `zero violations (${TAGS.join(', ')})`,
);
console.log('check-axe: no duplicate ids, no radio or exclusive-details group spanning theme frames\n');
