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

const wanted = readFileSync(new URL('../.nvmrc', import.meta.url), 'utf8').trim().replace(/^v/, '');
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

console.log(`check-node-version: Node v${actual} matches .nvmrc (${wanted})`);
