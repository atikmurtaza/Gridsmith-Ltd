#!/usr/bin/env node
/**
 * check-node-version
 *
 * Asserts that the Node actually executing matches the major in `.nvmrc`.
 *
 * `engine-strict` (added at E1) was not enough, for two separate reasons:
 *
 * 1. **It only fires during an install.** `npm ci` and `npm install` check `engines`;
 *    `npm run <anything>` does not. Once `node_modules` exists, every gate can be run on
 *    the wrong runtime forever without a word — which is exactly what happened through the
 *    whole Epic A audit.
 *
 * 2. **`engines` is a floor and `.nvmrc` is a pin, and nothing reconciles them.**
 *    A floor like `">=22.11.0"` is satisfied by Node 24 and by Node 26. So a machine
 *    running 24 while `.nvmrc` and CI say 22 passes `engine-strict` silently, and local and CI
 *    diverge by a major version with every check green. A floor cannot catch that; only a
 *    match can.
 *
 * The `.nvmrc` value is the single source of truth: CI reads it in spirit
 * (`node-version: '24'`), nvm reads it literally, and this makes the running process agree
 * with both or stop.
 *
 * Wired as `preinstall` so it fires before dependencies are fetched, and into
 * `verify:static` so it fires on every gate run whether or not anything is installed.
 */
import { readFileSync } from 'node:fs';

const read = (name) => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');

const wanted = read('.nvmrc').trim().replace(/^v/, '');
const wantedMajor = wanted.split('.')[0];
const actual = process.versions.node;
const actualMajor = actual.split('.')[0];

if (wantedMajor !== actualMajor) {
  console.error(`
check-node-version: this process is Node v${actual}, but .nvmrc pins Node ${wanted}.

  .nvmrc        ${wanted}
  running       v${actual}

Every gate in this repository measures something, and a measurement taken on the wrong
runtime is not the project's number. Fix the runtime, not this check.

  nvm use ${wantedMajor}            # nvm-windows / nvm
  nvm install ${wantedMajor}        # if that major is not installed yet

nvm installs into its own directory and does not touch Windows' installed-programs
database, so it is unaffected by an MSI refusing to downgrade.

If the project is deliberately moving to a different major, change .nvmrc, package.json
engines and .github/workflows/ci.yml together — they are three statements of one fact and
a split between them is what this check exists to prevent.
`);
  process.exit(1);
}

/**
 * The three statements of one fact, actually compared.
 *
 * The message below has always ended by telling the reader that `.nvmrc`, package.json
 * `engines` and ci.yml "are three statements of one fact and a split between them is what
 * this check exists to prevent". It was not preventing it. The gate read `.nvmrc` and
 * compared it to the running process, and nothing anywhere read the other two — so
 * `.nvmrc` could say 24 while CI ran 22 with every gate green, which is precisely the
 * local/CI divergence the file was written for. A gate whose docstring claims coverage it
 * does not have is worse than one that claims nothing, because the claim stops anyone
 * checking.
 */
const declarations = [
  ['package.json engines', JSON.parse(read('package.json')).engines?.node, /(\d+)/],
  ['.github/workflows/ci.yml', read('.github/workflows/ci.yml'), /node-version:\s*'?(\d+)/],
];

const split = [];
for (const [where, text, re] of declarations) {
  const found = typeof text === 'string' ? text.match(re)?.[1] : undefined;
  if (found === undefined) {
    split.push(`${where}: no Node major found — this check could not read it, so it did not check it`);
  } else if (found !== wantedMajor) {
    split.push(`${where}: Node ${found}, but .nvmrc pins ${wantedMajor}`);
  }
}

if (split.length > 0) {
  console.error(`\ncheck-node-version: the runtime is declared in three places and they disagree\n`);
  console.error(`  .nvmrc                     ${wantedMajor}`);
  for (const s of split) console.error(`  ${s}`);
  console.error(
    '\nChange all three together. A floor in `engines` is satisfied by any later major, so it' +
      '\ncannot catch this on its own — only a match can.\n',
  );
  process.exit(1);
}

/**
 * The gate list is declared twice, so the two declarations are compared.
 *
 * `npm run verify` and the step list in `.github/workflows/ci.yml` are two hand-kept
 * enumerations of the same fourteen gates, and nothing asserted they agree. They do today,
 * which is exactly why it looked fine. Add a gate to `verify:static` and forget `ci.yml`
 * and CI goes green having never run it — no error, no output, nothing missing from any
 * log. That is the same defect `lighthouse/routes.cjs` was created to remove ("two
 * hand-kept lists in one file… neither failure announces itself"), fixed in that one file
 * and left standing in the pair that actually decides merges.
 *
 * It has already bitten this repository once, in prose: `check:contrast` — the gate that
 * exists because 25 of 29 published contrast ratios were wrong — was missing from the
 * written list of gates in two documents for weeks.
 *
 * This gate is the natural home because it is already the one that asserts "two files
 * stating one fact must agree", and it already parses both files.
 */
const pkg = JSON.parse(read('package.json'));

/** Every leaf gate `npm run verify` reaches, following the verify:* chain. */
const reachable = new Set();
const walk = (name, seen = new Set()) => {
  if (seen.has(name)) return;
  seen.add(name);
  for (const [, called] of (pkg.scripts?.[name] ?? '').matchAll(/npm run ([\w:]+)/g)) {
    if (called.startsWith('verify')) walk(called, seen);
    else reachable.add(called);
  }
};
walk('verify');

// check:node reaches CI through `preinstall` on `npm ci`, not as its own step. That is a
// deliberate difference, and it is only sound while preinstall actually calls it.
if (!/check-node-version/.test(pkg.scripts?.preinstall ?? '')) {
  console.error('\ncheck-node-version: package.json preinstall no longer runs this check.\n');
  process.exit(1);
}
reachable.delete('check:node');

/**
 * Comment lines are stripped before this looks for gates.
 *
 * It matched `npm run <name>` anywhere in the file text, so **prose counted as a step**.
 * A comment added to `ci.yml` explaining that "`npm run verify` still passes locally"
 * registered `verify` as a CI gate missing from `verify`, and CI failed at `npm ci` on a
 * commit that changed no gate at all. Every workflow file in this repository carries long
 * explanatory comments by house style, so the trap was going to be stepped on again.
 *
 * Full-line comments only. A trailing `# not a gate` after a real `run:` keeps working,
 * and the `#` inside a quoted string on a step line is left alone.
 */
const workflow = read('.github/workflows/ci.yml')
  .split('\n')
  .filter((line) => !line.trimStart().startsWith('#'))
  .join('\n');
const inCI = new Set([...workflow.matchAll(/npm run ([\w:]+)/g)].map((m) => m[1]));
inCI.delete('start'); // the Lighthouse configs' own startServerCommand, not a gate

const missingFromCI = [...reachable].filter((g) => !inCI.has(g));
const missingFromVerify = [...inCI].filter((g) => !reachable.has(g));

if (missingFromCI.length > 0 || missingFromVerify.length > 0) {
  console.error('\ncheck-node-version: `npm run verify` and ci.yml do not run the same gates\n');
  for (const g of missingFromCI) console.error(`  ${g.padEnd(20)} in verify, NOT in ci.yml — CI has never run it`);
  for (const g of missingFromVerify) console.error(`  ${g.padEnd(20)} in ci.yml, NOT in verify — a local verify is not the full suite`);
  console.error(
    '\nBoth lists are hand-kept and neither failure announces itself. Add the gate to both,' +
      '\nor remove it from both.\n',
  );
  process.exit(1);
}

console.log(
  `check-node-version: Node v${actual} matches .nvmrc (${wanted}), package.json engines and ci.yml`,
);
console.log(
  `check-node-version: ${reachable.size + 1} gates, and \`npm run verify\` and ci.yml run the same set`,
);
