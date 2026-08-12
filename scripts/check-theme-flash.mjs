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

const APP_DIR = '.next/server/app';
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
