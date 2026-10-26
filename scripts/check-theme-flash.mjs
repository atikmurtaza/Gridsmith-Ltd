#!/usr/bin/env node
/**
 * check-theme-flash
 *
 * A-04 DoD · master/PROJECT-RULES.md §3 — "`data-division` is set server-side in each
 * route group layout. Never set it on the client — the theme must be correct in the
 * first paint."
 *
 * "No flash" is not something a screenshot can prove absent; a flash is a transient and
 * a passing screenshot only means you missed it. So this asserts the three structural
 * properties that make a flash impossible rather than merely unobserved:
 *
 *   1. `data-division` is present, and correct, in the prerendered HTML's <body> tag.
 *      The theme selector matches before a single byte of JavaScript runs.
 *   2. The stylesheet <link> or Next's inline CSS appears in <head>, ahead of <body>.
 *      Inline bytes match the emitted sheet; theme rules precede the first paint.
 *   3. No client chunk references `data-division` at all. There is no code path that
 *      could set, change or re-set it after hydration — so there is nothing that could
 *      produce a flash later either.
 *
 * (3) is the load-bearing one. (1) and (2) say the first paint is right; (3) says
 * nothing subsequently makes it wrong.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

function themeStyles(html, readCss) {
  const styles = [], problems = [];
  const headStart = html.indexOf('<head>');
  const headEnd = html.indexOf('</head>');
  const tags = /<link\b[^>]*rel="stylesheet"[^>]*>|<style\b[^>]*data-href="[^"]+"[^>]*>[\s\S]*?<\/style>/g;
  for (const match of html.matchAll(tags)) {
    const tag = match[0], href = /(?:data-)?href="([^"]+)"/.exec(tag);
    if (!href) continue;
    const sheets = href[1].split(/\s+/).map((url) => /^\/_next\/static\/css\/([^/]+\.css)$/.exec(url)?.[1]);
    if (sheets.some((sheet) => !sheet)) { problems.push('invalid Next stylesheet reference'); continue; }
    if (headStart < 0 || headEnd < 0 || match.index < headStart || match.index > headEnd) problems.push('theme CSS appears outside <head>');
    const contents = sheets.map(readCss);
    if (contents.some((css) => !css)) { problems.push('missing or empty stylesheet ' + href[1]); continue; }
    const css = contents.join('');
    if (tag.startsWith('<style')) {
      const inline = tag.slice(tag.indexOf('>') + 1, tag.lastIndexOf('</style>'));
      if (inline !== css) problems.push('inline CSS differs from emitted stylesheet ' + href[1]);
      styles.push(inline);
    } else styles.push(css);
  }
  if (styles.length === 0) problems.push('no Next theme stylesheet measured');
  return { styles, problems };
}

// Permanent positive/adverse specimens for both transports, proven on every gate run.
const specimenCss = '@font-face{font-family:"Inter"}';
const specimenRead = (name) => name === 'subject.css' ? specimenCss : null;
const specimenLink = '<link rel="stylesheet" href="/_next/static/css/subject.css">';
const specimenInline = '<style data-href="/_next/static/css/subject.css">' + specimenCss + '</style>';
for (const tag of [specimenLink, specimenInline]) {
  assert.deepEqual(themeStyles('<head>' + tag + '</head><body></body>', specimenRead).problems, []);
  assert(themeStyles('<head></head><body>' + tag + '</body>', specimenRead).problems.includes('theme CSS appears outside <head>'));
  assert(themeStyles('<head>' + tag.replace('subject.css', 'missing.css') + '</head>', specimenRead).problems.some((p) => p.includes('missing or empty')));
}
assert(themeStyles('<head>' + specimenInline.replace(specimenCss, '') + '</head>', specimenRead).problems.some((p) => p.includes('inline CSS differs')));
assert(themeStyles('<head><style>unrelated</style></head>', specimenRead).problems.includes('no Next theme stylesheet measured'));
assert(themeStyles('<head>' + specimenLink + '</head>', () => '').problems.some((p) => p.includes('missing or empty')));
assert(themeStyles(specimenInline + '<head></head>', specimenRead).problems.includes('theme CSS appears outside <head>'));
const mergedSpecimen = '<style data-href="/_next/static/css/subject.css /_next/static/css/second.css">' + specimenCss + '.second{display:block}</style>';
const mergedRead = (name) => name === 'second.css' ? '.second{display:block}' : specimenRead(name);
assert.deepEqual(themeStyles('<head>' + mergedSpecimen + '</head>', mergedRead).problems, []);
assert(themeStyles('<head>' + mergedSpecimen.replace('subject.css /_next/static/css/second.css', 'second.css /_next/static/css/subject.css') + '</head>', mergedRead).problems.some((p) => p.includes('inline CSS differs')));
assert(themeStyles('<head>' + specimenInline.replace('subject.css', '../subject.css') + '</head>', specimenRead).problems.includes('invalid Next stylesheet reference'));

const EXPECTED = [
  ['index', 'master'],
  ['design', 'design'],
  ['digital', 'digital'],
  ['press', 'press'],
];

/**
 * **The typefaces each route group is allowed to ship, hardcoded.**
 *
 * `M-08` was rowed on the claim that `styles/globals.css` is imported by all four root
 * layouts and therefore every route ships all three families' `@font-face` blocks — "22, of
 * which a division uses ≤8, ~29KB of render-blocking CSS at roughly a third useful". **That
 * was measured and it is false.** `next/font` emits its declarations into the importing
 * layout's own CSS, not into `globals.css`, so the served sheets already scope: 15
 * `@font-face` rules and 33,411 B on `/`, `/design` and `/digital`; 14 and 33,369 B on
 * `/press` was measured before R3 added Inter for editorial apparatus. No route ships all three.
 *
 * So the row's work is not a refactor — it is this list. Nothing asserted the scoping, which
 * is why a claim that it had been lost could stand unchallenged for two epics, and one shared
 * import in `globals.css` would still silently undo it.
 *
 * **Hardcoded, not derived from the layouts** (CLAUDE.md, the `check:tokens` division): the
 * question is whether the built CSS *declares* the right faces, and an expectation read off
 * the same layouts would move with any mistake made there. `next/font`'s metric-override
 * companions — `Inter Fallback` and so on — are the same family and are folded in.
 */
const FACES = {
  index: ['Inter', 'JetBrains Mono'],
  design: ['Inter', 'JetBrains Mono'],
  digital: ['Inter', 'JetBrains Mono'],
  press: ['Source Serif 4', 'Inter', 'JetBrains Mono'],
};

const APP_DIR = '.next/server/app';
const CSS_DIR = '.next/static/css';
const CHUNK_DIR = '.next/static/chunks';

if (!existsSync(APP_DIR)) {
  console.error('check-theme-flash: no build found. Run `npm run build` first.');
  process.exit(1);
}

const problems = [];

function findHtml(name) {
  for (const entry of readdirSync(APP_DIR, { recursive: true, withFileTypes: true })) {
    if (entry.isFile() && entry.name === `${name}.html`) {
      return join(entry.parentPath ?? APP_DIR, entry.name);
    }
  }
  return null;
}

for (const [route, division] of EXPECTED) {
  const file = findHtml(route);
  if (!file) {
    problems.push(`${route}: no prerendered HTML — the route is not static`);
    continue;
  }
  const html = readFileSync(file, 'utf8');

  // 1. correct division, server-rendered
  const body = html.match(/<body[^>]*>/);
  if (!body) {
    problems.push(`${route}: no <body> tag found`);
  } else if (!new RegExp(`data-division=["']${division}["']`).test(body[0])) {
    problems.push(`${route}: <body> is ${body[0]} — expected data-division="${division}"`);
  }

  // 2. first-paint CSS, including byte parity for Next's native inline transport.
  const result = themeStyles(html, (sheet) => {
    const cssFile = join(CSS_DIR, sheet);
    return existsSync(cssFile) ? readFileSync(cssFile, 'utf8') : null;
  });
  problems.push(...result.problems.map((problem) => route + ': ' + problem));
  // 2b. only this division's typefaces are declared — M-08.
  const faces = new Set();
  for (const css of result.styles) {
    for (const block of css.matchAll(/@font-face\s*\{[^}]*\}/g)) {
      const family = /font-family:\s*'?"?([^;'"}]+)/.exec(block[0]);
      if (family) faces.add(family[1].trim().replace(/ Fallback$/, ''));
    }
  }
  if (faces.size === 0) {
    problems.push(`${route}: no @font-face rule in any linked sheet — no typeface is declared at all`);
  }
  for (const face of faces) {
    if (!FACES[route].includes(face)) {
      problems.push(`${route}: declares @font-face for "${face}", which is not one of ${FACES[route].join(', ')} — the route group ships a typeface it does not use`);
    }
  }
  for (const face of FACES[route]) {
    if (!faces.has(face)) {
      problems.push(`${route}: declares no @font-face for "${face}", which it needs`);
    }
  }
}

// 3. nothing in the client bundle touches the attribute.
//
// This is the load-bearing check, and it used to be wrapped in `if (existsSync(...))` —
// so a renamed or missing chunk directory skipped it in silence and the gate still passed
// on the other two. A check that can be skipped is a check that will be.
//
// Two spellings, because the literal string was evadable and the gate's own comment calls
// this the load-bearing check. `el.setAttribute('data-division', …)` contains the string
// and was caught; `el.dataset.division = 'press'` sets the same attribute and never emits
// it. Minifiers keep property names, so the second pattern survives into the chunk.
const TOUCHES_ATTRIBUTE = [
  { re: /data-division/, how: 'references data-division' },
  { re: /\bdataset\s*\.\s*division\b/, how: 'sets el.dataset.division — the same attribute, spelled so a string search misses it' },
];

if (!existsSync(CHUNK_DIR)) {
  problems.push(`${CHUNK_DIR} does not exist — the client-chunk sweep could not run`);
} else {
  let scanned = 0;
  for (const entry of readdirSync(CHUNK_DIR, { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.js')) continue;
    scanned += 1;
    const file = join(entry.parentPath ?? CHUNK_DIR, entry.name);
    const source = readFileSync(file, 'utf8');
    for (const { re, how } of TOUCHES_ATTRIBUTE) {
      if (re.test(source)) {
        problems.push(`${entry.name}: client chunk ${how} — the theme must never be set on the client`);
      }
    }
  }
  if (scanned === 0) {
    problems.push(`${CHUNK_DIR} contains no .js files — nothing was swept for data-division`);
  }
}

if (problems.length > 0) {
  console.error(`\ncheck-theme-flash: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('');
  process.exit(1);
}

console.log(
  `check-theme-flash: ${EXPECTED.length} route groups — data-division server-rendered and correct, ` +
    'CSS render-blocking, zero client references',
);
console.log(
  `check-theme-flash: @font-face scoped per route group — ` +
    Object.entries(FACES).map(([r, f]) => `${r}: ${f.join(' + ')}`).join('; '),
);
