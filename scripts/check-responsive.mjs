#!/usr/bin/env node
/**
 * check-responsive
 *
 * CLAUDE.md Definition of Done · master/PROJECT-RULES.md §10 — "Works at 375px, 768px,
 * 1440px" · A-GATE criterion 2.
 *
 * That criterion was a manual check, which means it was a claim. Nothing in the repo
 * measured it, and at the Epic A audit it could only be recorded as "not established" —
 * neither passed nor failed, which is the least useful state a gate criterion can be in.
 *
 * The assertion is horizontal overflow: at each breakpoint the document must be exactly
 * as wide as the viewport. A page one pixel wider than its viewport scrolls sideways on a
 * phone, and it is the single most common responsive defect and the easiest to miss on a
 * desktop monitor. Vertical scrolling is expected and ignored.
 *
 * Every route × every breakpoint is asserted, and a route that fails to load is a
 * measurement failure rather than a pass — the same rule the other gates now carry.
 *
 * Expects a server already running at BASE_URL (`npm run start`).
 */
import puppeteer from 'puppeteer';

const BASE_URL = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';

const ROUTES = ['/', '/design', '/digital', '/press', '/_kitchen-sink'];

/** The three widths the Definition of Done names, and nothing else. */
const WIDTHS = [375, 768, 1440];

const browser = await puppeteer.launch({ headless: true });
const problems = [];
let checks = 0;

try {
  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      const page = await browser.newPage();
      await page.setViewport({ width, height: 900 });

      const response = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0' });
      // 304 is a load, not a failure: puppeteer reuses its cache across pages in one
      // browser, so the second visit to a route legitimately returns Not Modified.
      if (!response || response.status() >= 400) {
        console.error(`\ncheck-responsive: ${route} returned ${response ? response.status() : 'no response'}.`);
        console.error('Cannot measure this route. Fix the route or the base URL.\n');
        process.exit(1);
      }

      // Scroll to the foot so anything that only appears further down the page — the
      // sticky bar, revealed content — is laid out before the measurement is taken.
      await page.evaluate(async () => {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise((r) => setTimeout(r, 300));
      });

      const measured = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        viewport: document.documentElement.clientWidth,
        // Name the widest offender so the fix does not start with a bisect.
        widest: (() => {
          let worst = null;
          for (const el of document.body.querySelectorAll('*')) {
            const r = el.getBoundingClientRect();
            const overflow = Math.round(r.right - document.documentElement.clientWidth);
            if (overflow > 0 && (!worst || overflow > worst.overflow)) {
              worst = {
                overflow,
                tag: el.tagName.toLowerCase(),
                cls: typeof el.className === 'string' ? el.className.slice(0, 60) : '',
              };
            }
          }
          return worst;
        })(),
      }));

      checks += 1;

      if (measured.doc > measured.viewport || measured.body > measured.viewport) {
        const culprit = measured.widest
          ? ` — widest overflow: <${measured.widest.tag} class="${measured.widest.cls}"> by ${measured.widest.overflow}px`
          : '';
        problems.push(
          `${route} @ ${width}px — document ${measured.doc}px, body ${measured.body}px, ` +
            `viewport ${measured.viewport}px${culprit}`,
        );
      }

      await page.close();
    }
  }
} finally {
  await browser.close();
}

const EXPECTED = ROUTES.length * WIDTHS.length;
if (checks !== EXPECTED) {
  console.error(`\ncheck-responsive: measured ${checks} of ${EXPECTED} route/width combinations. Nothing may be skipped.\n`);
  process.exit(1);
}

if (problems.length > 0) {
  console.error(`\ncheck-responsive: ${problems.length} horizontal overflow(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('\nA page wider than its viewport scrolls sideways. Fix the element, not the breakpoint.\n');
  process.exit(1);
}

console.log(
  `check-responsive: ${checks} combinations (${ROUTES.length} routes × ${WIDTHS.join('/')}px) — ` +
    'no horizontal overflow',
);
