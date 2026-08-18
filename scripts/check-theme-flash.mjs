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
 *   2. The stylesheet <link> appears in <head>, ahead of <body>. It is render-blocking,
 *      so the theme rules are parsed before anything paints.
 *   3. No client chunk references `data-division` at all. There is no code path that
 *      could set, change or re-set it after hydration — so there is nothing that could
 *      produce a flash later either.
 *
 * (3) is the load-bearing one. (1) and (2) say the first paint is right; (3) says
 * nothing subsequently makes it wrong.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

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
 * `/press`, which ships Source Serif and no Inter. No route ships all three.
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
  press: ['Source Serif 4', 'JetBrains Mono'],
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

  // 2. stylesheet render-blocking, ahead of <body>
  const headEnd = html.indexOf('</head>');
  const firstSheet = html.indexOf('rel="stylesheet"');
  if (firstSheet === -1) {
    problems.push(`${route}: no stylesheet link — theme CSS is not render-blocking`);
  } else if (headEnd !== -1 && firstSheet > headEnd) {
    problems.push(`${route}: stylesheet link appears after </head>, so it does not block paint`);
  }

  // 2b. only this division's typefaces are declared — M-08.
  const sheets = [...html.matchAll(/href="\/_next\/static\/css\/([^"]+)"/g)].map((m) => m[1]);
  if (sheets.length === 0) {
    problems.push(`${route}: no /_next/static/css sheet to read — the @font-face sweep measured nothing`);
    continue;
  }
  const faces = new Set();
  for (const sheet of sheets) {
    const cssFile = join(CSS_DIR, sheet);
    if (!existsSync(cssFile)) {
      problems.push(`${route}: links ${sheet}, which is not in ${CSS_DIR} — cannot read its @font-face rules`);
      continue;
    }
    for (const block of readFileSync(cssFile, 'utf8').matchAll(/@font-face\s*\{[^}]*\}/g)) {
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
