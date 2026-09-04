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
 * from `--measure` is outside the subject set and this gate will not see it.
 *
 * ## `P-03`'s margin note — branch 4, and why it is not measured as body copy
 *
 * The margin note is **not** body copy and is deliberately outside the 17px / 1.7 / 52ch
 * assertions: `DESIGN.md` §4 sets it at `--text-sm` `--ink-muted` in the outer column. That
 * exemption is exactly the shape that goes unmeasured, so it has its own branch rather than
 * no branch, asserting the three things §4 actually claims — smaller than body copy, muted,
 * and **in the outer column only where there is an outer column.**
 *
 * The degradation half is the one worth having. *"On mobile these collapse inline beneath the
 * paragraph they annotate"* is a geometric claim, and it is measured as one: below `1024px`
 * the note's left edge is flush with the annotated block's and its top is below that block's
 * bottom; at or above it, the note's left edge is beyond the block's right edge. A margin note
 * with no margin has to be a note, not a broken layout, and nothing but geometry can say which.
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
 * `P-03`. The width at which `pressMargin.module.css` opens its second column. A literal here
 * rather than a value scraped from that file: the stylesheet is the subject, and an expectation
 * read out of its own subject cannot fail when the subject changes — `CLAUDE.md`. Move the
 * media query and this must move in the same commit, which is the point.
 */
const MARGIN_NOTE_MIN_WIDTH = 1024;

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
let marginNoteChecks = 0;

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

        /**
         * Branch 4 — `P-03`. Two probes carry the expected size and colour so that this file
         * never has to know what `--text-sm` or `--ink-muted` resolve to in the Press theme:
         * the browser resolves them, in the note's own inherited context.
         */
        const nprobe = document.createElement('span');
        nprobe.style.cssText =
          'font-size:var(--text-sm);color:var(--ink-muted);position:absolute;visibility:hidden';
        body.appendChild(nprobe);
        const nprobeStyle = getComputedStyle(nprobe);
        const expectedNote = {
          fontPx: parseFloat(nprobeStyle.fontSize),
          color: nprobeStyle.color,
        };
        nprobe.remove();

        const notes = [...document.querySelectorAll('[data-margin-note]')].map((el, i) => {
          const ns = getComputedStyle(el);
          const annotated = el.previousElementSibling;
          const n = el.getBoundingClientRect();
          const a = annotated ? annotated.getBoundingClientRect() : null;
          return {
            i,
            fontPx: parseFloat(ns.fontSize),
            color: ns.color,
            hasAnnotated: Boolean(annotated),
            note: { left: n.left, top: n.top },
            annotated: a ? { left: a.left, right: a.right, bottom: a.bottom } : null,
          };
        });

        return { fontPx, lineHeightPx, division, blocks, notes, expectedNote };
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

      // ---- Branch 4: the margin note — `P-03`, press/DESIGN.md §4. ----
      for (const n of read.notes) {
        marginNoteChecks += 1;

        if (!n.hasAnnotated) {
          problems.push(
            `${where} — margin note #${n.i} has no preceding sibling, so there is nothing it ` +
              'annotates and the collapse assertion below has no reference. MarginNote renders ' +
              'the annotated block immediately before the note; something else is emitting ' +
              'data-margin-note.',
          );
          continue;
        }

        if (Math.abs(n.fontPx - read.expectedNote.fontPx) > EPS) {
          problems.push(
            `${where} — margin note #${n.i} is ${n.fontPx.toFixed(2)}px, not the ` +
              `${read.expectedNote.fontPx.toFixed(2)}px --text-sm resolves to here ` +
              '(press/DESIGN.md §4). Marginalia is secondary information and is set smaller ' +
              'than the body copy it sits beside.',
          );
        }

        if (n.color !== read.expectedNote.color) {
          problems.push(
            `${where} — margin note #${n.i} is ${n.color}, not the ${read.expectedNote.color} ` +
              '--ink-muted resolves to here (press/DESIGN.md §4).',
          );
        }

        if (width >= MARGIN_NOTE_MIN_WIDTH) {
          if (!(n.note.left >= n.annotated.right)) {
            problems.push(
              `${where} — margin note #${n.i} starts at x=${n.note.left.toFixed(0)}, which is ` +
                `not beyond the annotated block right edge at ${n.annotated.right.toFixed(0)}. ` +
                'At this width DESIGN.md §4 puts it in the OUTER COLUMN; it is overlapping or ' +
                'sitting inside the text column instead.',
            );
          }
        } else {
          if (Math.abs(n.note.left - n.annotated.left) > 1) {
            problems.push(
              `${where} — margin note #${n.i} starts at x=${n.note.left.toFixed(0)} and the ` +
                `block it annotates at x=${n.annotated.left.toFixed(0)}. Below ` +
                `${MARGIN_NOTE_MIN_WIDTH}px there is no outer column, so DESIGN.md §4 collapses ` +
                'it INLINE beneath the paragraph — flush left with it, not indented into a ' +
                'margin that is not there.',
            );
          }
          if (!(n.note.top >= n.annotated.bottom - 1)) {
            problems.push(
              `${where} — margin note #${n.i} has its top at y=${n.note.top.toFixed(0)}, above ` +
                `the annotated block bottom at ${n.annotated.bottom.toFixed(0)}. Collapsed, ` +
                'the note goes BENEATH the paragraph it annotates; this is the two-column rule ' +
                'still applying at a width with no margin, which is the broken-layout case.',
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

/**
 * `P-03`. Same reasoning as `measureChecks`: the note is rendered by one call site, and a call
 * site can drop it without any route disappearing. Branch 4 would then pass having measured
 * nothing, which is the case this whole file's docstring exists to refuse.
 */
if (marginNoteChecks === 0) {
  console.error(
    '\ncheck-press-type: no [data-margin-note] was found on any Press route, so the P-03' +
      '\nassertions measured nothing and would have reported success anyway.' +
      '\n\nThe subject today is the clause reference beside the rights statement on /press.' +
      '\nEither a call site dropped its <MarginNote>, or MarginNote.tsx stopped emitting the' +
      '\nattribute. Restore it or delete branch 4 deliberately — do not let it pass empty.\n',
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
console.log(
  `check-press-type: ${marginNoteChecks} margin note(s) measured — --text-sm and --ink-muted on ` +
    `every one, in the outer column at >=${MARGIN_NOTE_MIN_WIDTH}px and collapsed beneath the ` +
    'paragraph they annotate below it',
);
