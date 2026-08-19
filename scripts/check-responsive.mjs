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

/** Expected status per route — see the note in check-axe.mjs. The 404 is a real route. */
const ROUTES = [
  { path: '/', status: 200 },
  { path: '/design', status: 200 },
  { path: '/digital', status: 200 },
  { path: '/press', status: 200 },
  { path: '/_kitchen-sink', status: 200 },
  // Composed master components — a table and a numbered list, both of which are the shapes
  // that overflow at 375px if they are built wrong.
  { path: '/_master-sink', status: 200 },
  { path: '/_gridsmith-404-probe', status: 404 },
];

/** The three widths the Definition of Done names, and nothing else. */
const WIDTHS = [375, 768, 1440];

/**
 * Below this width StickyCta is `position: fixed` against the bottom edge and globals.css
 * reserves scroll padding so a focused control is not scrolled underneath it — WCAG 2.2
 * SC 2.4.11 Focus Not Obscured (Minimum). Matches the `max-width: 767px` media query.
 */
const FIXED_BAR_MAX_WIDTH = 767;

/** CI-safe flags — see the note in check-axe.mjs. Same launch, same requirement. */
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const problems = [];
let checks = 0;
/**
 * Zero is a failure, not a pass.
 *
 * This started as a counter that was merely *printed*, on the reasoning that the hard
 * requirement could wait for M-02 and the consent banner. That was wrong by one task:
 * **A-12 removes `/_kitchen-sink` from the production build**, and that page carries the
 * only `StickyCta` in the repository. So between A-12 and M-02 this assertion would have
 * had no subject at all and would still have printed a green line — a gate measuring
 * nothing, which is the exact class §14 of the validation report exists to close, written
 * into a fix for that class.
 *
 * Failing at zero forces the question to be answered rather than deferred: either a real
 * route carries a fixed bottom bar, or this assertion is deliberately removed by someone
 * who has read this comment.
 */
let barsMeasured = 0;

try {
  for (const route of ROUTES) {
    for (const width of WIDTHS) {
      const page = await browser.newPage();
      await page.setViewport({ width, height: 900 });

      const response = await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle0' });
      // 304 is a load, not a failure: puppeteer reuses its cache across pages in one
      // browser, so the second visit to a route legitimately returns Not Modified.
      const status = response ? response.status() : 0;
      if (!(status === route.status || (route.status === 200 && status === 304))) {
        console.error(`\ncheck-responsive: ${route.path} returned ${status || 'no response'}, expected ${route.status}.`);
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
          `${route.path} @ ${width}px — document ${measured.doc}px, body ${measured.body}px, ` +
            `viewport ${measured.viewport}px${culprit}`,
        );
      }

      /**
       * WCAG 2.2 SC 2.4.11. The reserve that keeps a focused control out from under a
       * fixed bottom bar has to be at least as tall as the bar. It was derived from a
       * model — "a 2.75rem control plus var(--space-3) top and bottom", 68px — which is
       * the bar's height only while its labels fit on one line. At 375px they wrap and
       * the bar is 95px. Nothing measured it, so nothing said so: "number ≠ reality"
       * (01-VALIDATION-REPORT §12) inside a fix written for an accessibility criterion.
       *
       * Found by computed style rather than by class name — CSS module classes are
       * hashed, and this way it covers the consent banner at M-02 and anything else
       * pinned to the bottom edge, without being told about them.
       */
      if (width <= FIXED_BAR_MAX_WIDTH) {
        const bar = await page.evaluate(() => {
          let tallest = 0;
          for (const el of document.body.querySelectorAll('*')) {
            const cs = getComputedStyle(el);
            if (cs.position !== 'fixed' || cs.display === 'none') continue;
            const r = el.getBoundingClientRect();
            // Anchored to the bottom edge, within a pixel of it.
            if (Math.abs(r.bottom - window.innerHeight) > 1) continue;
            tallest = Math.max(tallest, Math.round(r.height));
          }
          return {
            tallest,
            reserve: Math.round(
              parseFloat(getComputedStyle(document.documentElement).scrollPaddingBlockEnd) || 0,
            ),
          };
        });

        if (bar.tallest > 0) {
          barsMeasured += 1;
          if (bar.reserve < bar.tallest) {
            problems.push(
              `${route.path} @ ${width}px — a ${bar.tallest}px fixed bottom bar is covered by only ` +
                `${bar.reserve}px of scroll-padding-block-end. A control focused near the foot of the ` +
                'document scrolls under it (WCAG 2.2 SC 2.4.11).',
            );
          }
        }
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

if (barsMeasured === 0) {
  console.error(
    `\ncheck-responsive: no fixed bottom bar was found on any route below ${FIXED_BAR_MAX_WIDTH + 1}px,` +
      '\nso the WCAG 2.2 SC 2.4.11 scroll-reserve assertion measured nothing and would have' +
      '\nreported success anyway.' +
      '\n\nIts only subject today is the StickyCta on /_kitchen-sink, and A-12 removes that route' +
      '\nfrom the production build. If you are reading this at A-12: put a StickyCta on a real' +
      '\nroute, or delete this assertion deliberately. Do not let it pass empty.\n',
  );
  process.exit(1);
}

if (problems.length > 0) {
  console.error(`\ncheck-responsive: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('\nA page wider than its viewport scrolls sideways. Fix the element, not the breakpoint.\n');
  process.exit(1);
}

console.log(
  `check-responsive: ${checks} combinations (${ROUTES.length} routes × ${WIDTHS.join('/')}px) — ` +
    'no horizontal overflow',
);
console.log(
  `check-responsive: ${barsMeasured} fixed bottom bar(s) measured below ${FIXED_BAR_MAX_WIDTH + 1}px — ` +
    'each covered by at least its own height of scroll-padding-block-end (WCAG 2.2 SC 2.4.11)',
);
