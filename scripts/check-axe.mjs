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
  // `global-not-found`'s subject: an unmatched URL. It cannot be a committed route — a
  // committed route would match and return 200 — so the path itself is the subject and
  // the asserted 404 is what proves it reached the right document.
  { path: '/_gridsmith-404-probe', status: 404 },
  // `global-error`'s subject: app/(marketing)/gridsmith-error-probe/page.tsx, a committed
  // route that throws after hydration. Until it existed, no gate in this repository
  // referenced global-error at all and its Level A fix was evidenced only by a docstring.
  //
  // `themed: false` because global-error is deliberately unthemed and deliberately
  // carries no `data-division` — setting it would put the literal string into a client
  // chunk and fail check-theme-flash's strongest assertion, which is that no client chunk
  // can set the theme after hydration. The reasoning is in the boundary's own docstring.
  // The HTML responds 200; the throw happens in the browser afterwards.
  //
  // `expect` is what stops this probe going hollow. Without it the gate would audit
  // whatever the route renders — and if the throw ever stopped firing, axe would cheerfully
  // report the fallback paragraph as clean while global-error went unmeasured again. A
  // subject that silently stops being the subject is the failure this whole rule exists to
  // prevent, so the boundary has to identify itself.
  {
    path: '/gridsmith-error-probe',
    status: 200,
    themed: false,
    expect: { title: 'Something went wrong — Gridsmith Ltd', h1: 'Something went wrong', lang: 'en-GB' },
  },
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
 * axe results come in three buckets, not two: `passes`, `violations`, and `incomplete` —
 * checks axe ran and could not resolve. This gate read `violations` alone, so every
 * `incomplete` was discarded without a word and the route printed `clean`.
 *
 * Eight of them were live: `color-contrast` on the `h1` of all four themed routes, at both
 * viewports. "axe could not determine whether this text meets 1.4.3" was being reported
 * as a pass. That is the same shape as a gate that measures nothing, one layer up — the
 * measurement was taken, declined, and thrown away.
 *
 * **So an incomplete now fails, unless it is listed here with a reason.** An allowlist
 * entry is a decision someone wrote down and can be re-examined; a silent discard is not.
 * Entries match on rule + route + exact node target, so allowlisting the h1 of the
 * placeholder pages cannot quietly cover a different element later.
 */
const INCOMPLETE_ALLOWED = [
  {
    rule: 'color-contrast',
    routes: ['/', '/design', '/digital', '/press'],
    target: 'h1',
    why:
      'These four routes are placeholders with no chrome: h1, main and body share one rect ' +
      'flush to the viewport edge, so axe cannot resolve a background box and reports ' +
      'elmPartiallyObscured with contrastRatio 0. Nothing obscures the h1 — elementsFromPoint ' +
      'at its centre returns H1 > MAIN > BODY > HTML, all position:static, only body painting. ' +
      'The token pairs are measured directly by check:contrast, which is the gate that owns ' +
      'this question. REMOVE THIS ENTRY at the first route with real chrome (Epic M): the ' +
      'condition that produces it disappears the moment a header exists.',
  },
];

/**
 * Every custom property the token layer declares, read off disk.
 *
 * Derived, not typed: a hardcoded list is an expectation that falls behind its subject,
 * and this gate exists because four hardcoded names covered only the theme layer. Reading
 * `styles/tokens.css` and the four theme files means a token added tomorrow is probed
 * tomorrow. Font-family tokens are excluded — they resolve to a stack containing a
 * `next/font` CSS variable that is empty until the font loads, which is a load-order fact
 * rather than a missing stylesheet, and `check-theme-flash` owns that question.
 *
 * **What deriving the list costs, stated because the proof found it.** This list comes
 * from the same files it is checking, so deleting `--text-2xl` from `tokens.css` deletes
 * the expectation along with the token and this probe stays green. That is the
 * expectation-derived-from-its-own-subject shape, and it is accepted here **because it is
 * not this probe's question.** Whether the token layer declares the right tokens is
 * `check:tokens`, which holds a hardcoded 39-token REQUIRED list for exactly that reason.
 * This probe answers a different one: *is the token layer reaching this route at all* —
 * the `/_not-found` defect, where every token was undefined because the stylesheet was
 * never linked. Against that, a derived list is correct and a hardcoded one would rot.
 *
 * Proven by deliberate failure on the real question: removing `import '@/styles/globals.css'`
 * from `app/(press)/layout.tsx` reports `--space-1`, `--text-xs`, `--text-2xl` and the rest
 * of the base layer resolving to nothing. The four-name probe this replaced saw none of
 * those — all four of its names lived in the theme layer.
 */
const declaredIn = (file) =>
  [...new Set([...readFileSync(file, 'utf8').matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)].map((m) => m[1]))]
    .filter((t) => !t.startsWith('--font-'));

/**
 * Base tokens apply everywhere; theme tokens are probed only on the division that
 * declares them.
 *
 * The union across all four themes is NOT the right list, and probing it says so loudly:
 * `--accent-design`, `--accent-digital` and `--accent-press` are declared by master alone
 * (master/PROJECT-RULES.md §1.1 — division accents appear on division cards, badges and
 * the footer switcher, all of which are master chrome). They correctly resolve to nothing
 * on `/design`, and a probe that flags that is reporting the design, not a defect.
 */
const TOKEN_NAMES = {
  base: declaredIn('styles/tokens.css'),
  byDivision: Object.fromEntries(
    ['master', 'design', 'digital', 'press'].map((d) => [d, declaredIn(`styles/themes/${d}.css`)]),
  ),
};

const tokenCount =
  TOKEN_NAMES.base.length +
  Math.min(...Object.values(TOKEN_NAMES.byDivision).map((t) => t.length));

if (TOKEN_NAMES.base.length === 0 || Object.values(TOKEN_NAMES.byDivision).some((t) => t.length === 0)) {
  console.error('check-axe: derived 0 token names from the base layer or a theme — the probe would measure nothing.');
  process.exit(1);
}

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
async function domIntegrity(page, route, themed = true, expect = null) {
  const found = await page.evaluate(({ tokenNames, themed, expect }) => {
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

    // A11Y-4 / A11Y-26 — the linked-card overlay must not cover its siblings.
    //
    // `.cardLinked`'s heading link paints an `::after` at `inset: 0` so the whole card is
    // one target. Every OTHER interactive element in the card has to be lifted above it,
    // or it is tabbable and focusable but cannot be clicked. axe cannot see this: it is
    // a paint-order fact, not a semantic one, and 24 green analyses coexisted with it.
    //
    // The overlay is on a pseudo-element, which `elementFromPoint` returns as its
    // originating element — so a covered control reports the TITLE LINK at its own centre.
    // That is the test, and it needs no knowledge of z-index values or stacking rules.
    //
    // **This has a permanent subject on /_kitchen-sink** — the "second link, button and
    // input" specimen — committed for exactly this reason. Before it existed the fix was
    // proven by a runtime injection that was then discarded, so the selector matched
    // nothing in CI and deleting it would have kept every gate green.
    for (const card of document.querySelectorAll('[class*="cardLinked"]')) {
      const titleLink = card.querySelector(':is(h1,h2,h3,h4,h5,h6) a');
      if (!titleLink) continue;
      for (const el of card.querySelectorAll('a, button, input, select, textarea, summary, [tabindex]')) {
        if (el === titleLink || titleLink.contains(el)) continue;
        // `elementFromPoint` hit-tests the VIEWPORT, not the document: an element below
        // the fold returns null and the check silently passes. That is how the first
        // version of this assertion reported clean against a deliberately broken
        // selector — the specimen sits far down /_kitchen-sink and was never in view.
        el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' });
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        if (!top) continue;
        if (top && top !== el && !el.contains(top) && titleLink.contains(top)) {
          problems.push(
            `linked-card overlay covers <${el.tagName.toLowerCase()}> in the ${frameOf(el)} frame — ` +
              'it is focusable but not clickable (A11Y-4)',
          );
        }
      }
    }

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
    // `themed: false` is the global-error boundary, which is deliberately unthemed and
    // carries no data-division by design. Everything above this line still applies to it —
    // ids, groups, the linked-card overlay — and the document-level assertions below run
    // for every route regardless.
    if (themed && !document.body.dataset.division) {
      problems.push('<body> carries no data-division — this page renders with no theme');
    }
    // The boundary must identify itself — see the ROUTES entry that sets this.
    if (expect) {
      if (document.title !== expect.title) {
        problems.push(`expected document.title "${expect.title}", got "${document.title}" — the render path this route exists to reach did not render`);
      }
      const h1 = document.querySelector('h1')?.textContent?.trim();
      if (h1 !== expect.h1) problems.push(`expected <h1> "${expect.h1}", got "${h1 ?? '(none)'}"`);
      if (document.documentElement.lang !== expect.lang) {
        problems.push(`expected lang "${expect.lang}", got "${document.documentElement.lang || '(none)'}" — WCAG 3.1.1, Level A`);
      }
      if (document.querySelectorAll('main').length !== 1) {
        problems.push(`expected exactly one <main>, found ${document.querySelectorAll('main').length}`);
      }
    }

    if (!themed) return problems;

    const bodyStyle = getComputedStyle(document.body);

    // An unlinked stylesheet makes every custom property resolve to the empty string.
    // This is the check that would have caught it: it needs no colour table and no
    // per-theme expectation, so it cannot drift from the tokens it is guarding.
    //
    // **It used to probe four hardcoded names — --canvas, --ink, --line, --accent — all
    // four of which live in styles/themes/*.css.** Nothing probed a value declared only in
    // styles/tokens.css, and `--text-2xl` is one of those: it is the token whose absence
    // rendered the 404's h1 at 16px in the original defect. The probe passed on the theme
    // layer and would have said nothing about the base layer. It was adequate only because
    // an @import bundles both into one emitted file — an accident of the build, not a
    // property of the check. Split the CSS output and the original defect reopens silently.
    //
    // The list is now every token name read off disk from tokens.css and the theme files,
    // passed in from Node. It cannot fall behind what exists, because it is derived from
    // what exists rather than typed here.
    const division = document.body.dataset.division;
    const probeList = [...tokenNames.base, ...(tokenNames.byDivision[division] ?? [])];
    if (probeList.length === tokenNames.base.length) {
      problems.push(`no theme token list for division "${division}" — nothing theme-specific was probed`);
    }
    for (const token of probeList) {
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
  }, { tokenNames: TOKEN_NAMES, themed, expect });

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
let incompleteAllowed = 0;
const allowedSeen = new Set();

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
        const { violations, incomplete } = await new AxePuppeteer(page, axeSource).withTags(TAGS).analyze();
        analyses += 1;

        // `incomplete` is axe saying "I could not determine a result here" — not "this
        // passed". It was destructured away and never printed, so eight unresolved
        // 1.4.3 evaluations were being reported as `clean` on every run. A result the
        // tool declined to give is not a pass, and discarding it silently is the same
        // unearned confidence as a gate that measures nothing.
        for (const inc of incomplete) {
          for (const node of inc.nodes) {
            const target = node.target.join(' ');
            const allowed = INCOMPLETE_ALLOWED.find(
              (a) => a.rule === inc.id && a.routes.includes(route.path) && a.target === target,
            );
            if (allowed) {
              incompleteAllowed += 1;
              // The reason is printed once at the end, not 24 times inline — a wall of
              // repeated prose is how a reader learns to scroll past this gate's output,
              // and the loud Lighthouse-skip banner has to stay readable.
              allowedSeen.add(allowed);
              console.log(`  ${where.padEnd(40)} incomplete ${inc.id} on ${target} — allowed`);
            } else {
              total += 1;
              console.error(
                `  ${where.padEnd(40)} UNRESOLVED ${inc.id} on ${target} — axe could not ` +
                  'determine a result and this combination is not in INCOMPLETE_ALLOWED',
              );
              const reason = node.any?.[0]?.message ?? node.all?.[0]?.message ?? '(no message)';
              console.error(`      ${reason}`);
            }
          }
        }

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
      total += await domIntegrity(page, `${route.path} @ ${viewport.label}`, route.themed !== false, route.expect ?? null);

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
console.log('check-axe: no duplicate ids, no radio or exclusive-details group spanning theme frames');
console.log(
  `check-axe: ${tokenCount}+ tokens probed for a computed value on every route ` +
    `(${TOKEN_NAMES.base.length} base + the division's own); ` +
    `${incompleteAllowed} axe incomplete(s) allowed, 0 unresolved`,
);
for (const a of allowedSeen) {
  console.log(`\n  ALLOWED INCOMPLETE — ${a.rule} on "${a.target}" at ${a.routes.join(', ')}\n    ${a.why}`);
}
console.log('');
