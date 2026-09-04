#!/usr/bin/env node
/**
 * check-press-type — `P-02`.
 *
 * press/DESIGN.md §3 and press/PROJECT-RULES.md §3: **Press body copy is 17px minimum, 1.7
 * leading, 52ch measure.** `PROJECT-RULES.md` is binding for the workstream, and Press is the
 * division whose product is reading, so these are brand constraints rather than preferences.
 *
 * ## Why this gate exists
 *
 * All three numbers were in four documents and in no assertion, which under `CLAUDE.md` makes
 * them unverified numbers — and all three were false on disk when `P-02` was re-derived:
 * `globals.css` set no `font-size` on `body` at all (so every division rendered the UA default
 * 16px), `body` carried `--leading-normal` = 1.55 rather than the 1.7 `--leading-relaxed` holds,
 * and `Prose` defaulted to `--measure` = 68ch with 52ch an opt-in per call site.
 *
 * ## What it asks, and of whom
 *
 * **It asks the served page, not the stylesheet.** The 17px reading is the one that makes this
 * necessary: `--text-base` is `clamp(1rem, 0.97rem + 0.15vw, 1.0625rem)`, which is 16.0px at
 * 375px and reaches 17px only near 1440px. A source check that found the token named would have
 * called that a pass; only a computed style at a real viewport width can tell 16.08px from 17px.
 * Same reasoning as `check-axe`'s route probe: the question is whether the rule REACHES the
 * rendered page, so the expectation may not be read out of the file being checked.
 *
 * The 52ch measure is likewise measured in the page's own font, not converted with an assumed
 * ratio: a `52ch`-wide probe span is inserted inside each body-copy block and its `offsetWidth`
 * is the comparison. `ch` is the advance of `0` in the element's own computed face, so this is
 * correct for Source Serif without this file knowing anything about Source Serif.
 *
 * ## The subject, and why it is reachable
 *
 * `Prose` emits `data-prose` (see `Prose.tsx`). CSS module class names are hashed, so `.prose`
 * is not selectable from outside the build; the attribute is the stable handle. `/press` carries
 * one `Prose` — the rights statement — which is a production route, not a specimen page.
 *
 * **Zero subjects is a hard failure, not a pass.** Today `/press` is the only Press route on
 * disk. When `P-06`, `K-09` or `K-11` land, add them to `ROUTES`: the measure assertion is
 * per-block, so a route with no `Prose` contributes nothing to it and would otherwise be
 * audited by the body assertions alone without anyone noticing.
 *
 * ## The ceiling
 *
 * This asserts the three numbers on the routes listed below. It does not assert that every
 * Press body-copy block goes through `Prose` — a future block that sets its own `max-width`
 * from `--measure` is outside the subject set and this gate will not see it. `P-03`'s margin
 * note is the first candidate; route it through `Prose` or extend the selector here.
 *
 * Expects a server already running at BASE_URL (`npm run start`).
 */
import { launch } from './browser-launch.mjs';

const BASE_URL = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';

/** Press routes. See "The subject" above before adding or removing one. */
const ROUTES = ['/press', '/press/contact'];

/** The three widths the Definition of Done names — the same set as `check-responsive`. */
const WIDTHS = [375, 768, 1440];

/** press/DESIGN.md §3 · press/PROJECT-RULES.md §3. */
const MIN_FONT_PX = 17;
const MIN_LEADING = 1.7;
const MAX_MEASURE_CH = 52;

/**
 * Sub-pixel tolerance only. A browser reports `max()` of `1.0625rem` as exactly 17px and the
 * leading as 28.9px over 17px, which is 1.7 to fifteen places; this absorbs the last bit of
 * float, never a design decision. 0.05 would let 16.96px through and is deliberately not used.
 */
const EPS = 0.005;

const browser = await launch();
const problems = [];
let bodyChecks = 0;
let measureChecks = 0;

try {
  for (const path of ROUTES) {
    for (const width of WIDTHS) {
      const page = await browser.newPage();
      await page.setViewport({ width, height: 900 });

      const response = await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle0' });
      const status = response ? response.status() : 0;
      if (!(status === 200 || status === 304)) {
        console.error(`\ncheck-press-type: ${path} returned ${status || 'no response'}, expected 200.`);
        console.error('Cannot measure this route. Fix the route or the base URL.\n');
        process.exit(1);
      }

      const read = await page.evaluate((measureCh) => {
        const body = document.body;
        const cs = getComputedStyle(body);
        const fontPx = parseFloat(cs.fontSize);
        const lineHeightPx = parseFloat(cs.lineHeight);

        /**
         * The subject must assert that it is still the subject. `[data-division]` is set
         * server-side by `RootShell`; if it ever stopped being `press` this gate would be
         * measuring the master theme and calling it a Press pass.
         */
        const division = body.dataset.division ?? null;

        const blocks = [...document.querySelectorAll('[data-prose]')].map((el, i) => {
          const maxWidthPx = parseFloat(getComputedStyle(el).maxWidth);
          // `ch` resolved in the element's own computed face, so no ratio is assumed.
          const probe = document.createElement('span');
          probe.style.cssText =
            `width:${measureCh}ch;display:inline-block;position:absolute;visibility:hidden`;
          el.appendChild(probe);
          const chPx = probe.offsetWidth;
          probe.remove();
          return { i, maxWidthPx, chPx };
        });

        return { fontPx, lineHeightPx, division, blocks };
      }, MAX_MEASURE_CH);

      const where = `${path} @ ${width}px`;

      if (read.division !== 'press') {
        console.error(
          `\ncheck-press-type: ${where} renders with data-division="${read.division}", not "press".` +
            '\nThe theme this gate exists to measure is not on the page, so every reading below' +
            '\nwould be a reading of some other division reported as a Press pass.\n',
        );
        process.exit(1);
      }

      bodyChecks += 1;

      // ---- Branch 1: 17px minimum body size. ----
      if (!(read.fontPx >= MIN_FONT_PX - EPS)) {
        problems.push(
          `${where} — body font-size is ${read.fontPx.toFixed(2)}px, below the ${MIN_FONT_PX}px ` +
            'floor (press/DESIGN.md §3, PROJECT-RULES.md §3). Naming --text-base alone does not ' +
            'satisfy this: its clamp is 16px at 375px.',
        );
      }

      // ---- Branch 2: 1.7 leading. ----
      const leading = read.lineHeightPx / read.fontPx;
      if (!(leading >= MIN_LEADING - EPS)) {
        problems.push(
          `${where} — body line-height is ${leading.toFixed(3)} (${read.lineHeightPx.toFixed(2)}px ` +
            `over ${read.fontPx.toFixed(2)}px), below the ${MIN_LEADING} Press requires. ` +
            '--leading-normal is 1.55; --leading-relaxed is the 1.7 token.',
        );
      }

      // ---- Branch 3: 52ch measure on every body-copy block. ----
      for (const b of read.blocks) {
        measureChecks += 1;
        if (!(b.maxWidthPx <= b.chPx + 0.5)) {
          const ch = (b.maxWidthPx / (b.chPx / MAX_MEASURE_CH)).toFixed(1);
          problems.push(
            `${where} — body-copy block #${b.i} is ${b.maxWidthPx.toFixed(0)}px wide, which is ` +
              `${ch}ch in this face, above the ${MAX_MEASURE_CH}ch measure ` +
              '(press/DESIGN.md §3, "for all body copy, without exception"). ' +
              `${MAX_MEASURE_CH}ch here is ${b.chPx.toFixed(0)}px.`,
          );
        }
      }

      await page.close();
    }
  }
} finally {
  await browser.close();
}

/**
 * Both counts must be provable to move — `CLAUDE.md`: "any gate whose output is a count must be
 * provable to report zero". `bodyChecks` moves with `ROUTES × WIDTHS`; `measureChecks` moves
 * with the number of `Prose` blocks actually rendered, which is the one that can silently go to
 * zero, because a call site can drop a `Prose` without any route disappearing.
 */
const EXPECTED_BODY = ROUTES.length * WIDTHS.length;
if (bodyChecks !== EXPECTED_BODY) {
  console.error(
    `\ncheck-press-type: measured ${bodyChecks} of ${EXPECTED_BODY} route/width combinations. ` +
      'Nothing may be skipped.\n',
  );
  process.exit(1);
}

if (measureChecks === 0) {
  console.error(
    '\ncheck-press-type: no [data-prose] block was found on any Press route, so the 52ch measure' +
      '\nassertion measured nothing and would have reported success anyway.' +
      '\n\nEither a call site dropped its <Prose>, or Prose.tsx stopped emitting data-prose.' +
      '\nThe subject today is the rights statement on /press. Restore it or delete this' +
      '\nassertion deliberately — do not let it pass empty.\n',
  );
  process.exit(1);
}

if (problems.length > 0) {
  console.error(`\ncheck-press-type: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error(
    '\nPress body copy is 17px / 1.7 / 52ch. It is the division whose product is reading,' +
      '\nso this is the brand, not a preference — press/DESIGN.md §3.\n',
  );
  process.exit(1);
}

console.log(
  `check-press-type: ${bodyChecks} route/width combination(s) — body >=${MIN_FONT_PX}px at ` +
    `>=${MIN_LEADING} leading on every one`,
);
console.log(
  `check-press-type: ${measureChecks} body-copy block(s) measured — each within ${MAX_MEASURE_CH}ch, ` +
    'converted in the page own serif rather than by an assumed ratio',
);
