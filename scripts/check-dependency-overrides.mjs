#!/usr/bin/env node
/**
 * GS-R12-PRODUCTION-READINESS-001: the three scoped security overrides in package.json, checked
 * from each real consumer's own resolution and through the consumer's own call path.
 *
 *   tmp >=0.2.6   GHSA-ph9p-34f9-6g65, GHSA-52f5-9888-hmc6   @lhci/cli, external-editor
 *   uuid >=11.1.1 GHSA-w5hq-g745-h8pq                        @lhci/cli (v4), typeid-js (v7)
 *   basic-ftp >=6.2.1 GHSA-c475-qrg2-pj4r                    get-uri (proxy-agent's ftp: route)
 *
 * Versions are read through `createRequire` rooted at each consumer, so a nested copy that
 * escapes the override is what gets measured. Behaviour uses the consumers' public entry points;
 * the FTP case runs against a loopback mock server and asserts which commands it actually saw,
 * so a path that was never reached cannot pass as an absence. No network, no browser.
 */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const from = (pkg) => {
  const manifest = join(root, 'node_modules', pkg, 'package.json');
  // A consumer that is not where we look would make createRequire measure the root copy instead.
  assert(existsSync(manifest), `consumer ${pkg} is not installed at node_modules/${pkg}`);
  return createRequire(manifest);
};
const versionOf = (consumer, dep) => {
  let dir = from(consumer).resolve(dep);
  while (!existsSync(join(dir, 'package.json')) || JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')).name !== dep) {
    // An aliased or renamed package must fail here, not climb past the filesystem root forever.
    if (resolve(dir, '..') === dir) throw new Error(`no package.json named ${dep} above ${consumer}'s resolution`);
    dir = resolve(dir, '..');
  }
  return JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')).version;
};
const atLeast = (version, minimum) => {
  const a = version.split('.').map(Number); const b = minimum.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i];
  return true;
};

// The comparator is the gate's predicate; prove it can say no before trusting a yes.
for (const [v, min, want] of [['0.1.0', '0.2.6', false], ['0.0.33', '0.2.6', false], ['0.2.5', '0.2.6', false],
  ['10.0.0', '11.1.1', false], ['8.3.2', '11.1.1', false], ['5.3.1', '6.2.1', false], ['6.2.0', '6.2.1', false],
  ['0.2.7', '0.2.6', true], ['11.1.1', '11.1.1', true], ['6.2.3', '6.2.1', true], ['14.0.1', '11.1.1', true]]) {
  assert.equal(atLeast(v, min), want, `comparator ${v} >= ${min}`);
}

const problems = [];
const EXPECT = [['@lhci/cli', 'tmp', '0.2.6'], ['external-editor', 'tmp', '0.2.6'], ['@lhci/cli', 'uuid', '11.1.1'],
  ['typeid-js', 'uuid', '11.1.1'], ['get-uri', 'basic-ftp', '6.2.1']];
for (const [consumer, dep, min] of EXPECT) {
  const v = versionOf(consumer, dep);
  console.log(`  ${consumer} -> ${dep}@${v} (needs >=${min})`);
  if (!atLeast(v, min)) problems.push(`${consumer} resolves ${dep}@${v}, below the fixed ${min}`);
}

// Every installed copy, wherever it is nested: the lockfile is what `npm ci` installs.
const MINIMUM = { tmp: '0.2.6', uuid: '11.1.1', 'basic-ftp': '6.2.1' };
// Lockfile v3 records `name` only when the folder differs (an npm alias), which overrides do not reach.
const packageName = (path, entry) => entry.name ?? path.split('node_modules/').pop();
const lockProblems = (packages) => Object.entries(packages).flatMap(([path, entry]) => {
  const name = packageName(path, entry);
  return MINIMUM[name] && entry.version && !atLeast(entry.version, MINIMUM[name]) ? [`${path} is ${name}@${entry.version}, below the fixed ${MINIMUM[name]}`] : [];
});
assert.equal(lockProblems({ 'node_modules/x/node_modules/tmp': { version: '0.1.0' }, 'node_modules/uuid': { version: '11.1.1' } }).length, 1,
  'lock check must report a nested vulnerable copy');
assert.equal(lockProblems({ 'node_modules/x/node_modules/tmp-legacy': { name: 'tmp', version: '0.0.33' } }).length, 1,
  'lock check must report an npm-aliased vulnerable copy');
const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8')).packages;
const copies = Object.entries(lock).filter(([path, entry]) => MINIMUM[packageName(path, entry)]).length;
problems.push(...lockProblems(lock));
console.log(`  package-lock: ${copies} installed copies of tmp/uuid/basic-ftp checked`);

// tmp, as @lhci/cli's `open` command calls it.
{
  const tmp = from('@lhci/cli')('tmp');
  const file = tmp.fileSync({ postfix: '.html' });
  assert(file.name.endsWith('.html') && existsSync(file.name), 'lhci tmp.fileSync');
  file.removeCallback();
  assert(!existsSync(file.name), 'lhci tmp removeCallback');
}
// tmp, through external-editor's own constructor (tmpNameSync + write), then its cleanup.
{
  const { ExternalEditor } = from('inquirer')('external-editor');
  const editor = new ExternalEditor('gs-check', { postfix: '.txt' });
  assert(editor.tempFile.endsWith('.txt') && readFileSync(editor.tempFile, 'utf8') === 'gs-check', 'external-editor temp file');
  editor.cleanup();
  assert(!existsSync(editor.tempFile), 'external-editor cleanup');
}
// uuid, as @lhci/cli's collect/node-runner calls it.
assert.match(from('@lhci/cli')('uuid').v4(), /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/, 'lhci uuid.v4');
// uuid v7, through typeid-js in both module systems (Sanity CLI imports it).
{
  const cjs = from('@sanity/cli')('typeid-js');
  const id = cjs.typeid('trace');
  assert.match(id.toString(), /^trace_[0-9a-hjkmnp-tv-z]{26}$/, 'typeid-js v7 id');
  assert.equal(cjs.TypeID.fromString(id.toString()).toUUID(), id.toUUID(), 'typeid-js round trip');
  assert.match(id.toUUID(), /^[0-9a-f]{8}-[0-9a-f]{4}-7/, 'typeid-js uses uuid v7');
  const esm = await import(pathToFileURL(from('@sanity/cli').resolve('typeid-js').replace(/index\.js$/, 'index.mjs')).href);
  assert.match(esm.typeid('trace').toString(), /^trace_/, 'typeid-js ESM');
}

// get-uri's ftp: route runs in a child (check-dependency-overrides-ftp.mjs). On Windows, node.exe
// v24.15 occasionally dies natively (0xC0000409, about 1% of runs) during that loopback socket
// sequence — with basic-ftp 5.3.1 as well as 6.2.3, so it is a runtime fault, not the override.
// Exactly one re-run is allowed for exactly that Windows status, and it is reported. An assertion
// failure, any other status, or a second crash fails this gate.
const runFtp = () => spawnSync(process.execPath, [join(root, 'scripts', 'check-dependency-overrides-ftp.mjs')], { encoding: 'utf8', timeout: 120_000 });
const nativeCrash = (run) => process.platform === 'win32' && run.status !== null && (run.status >>> 0) === 0xc0000409;
let ftpRun = runFtp();
if (nativeCrash(ftpRun)) {
  console.log('  get-uri ftp: node.exe native crash 0xC0000409 (Windows runtime fault, not an assertion); re-running once');
  ftpRun = runFtp();
}
process.stdout.write(ftpRun.stdout ?? '');
process.stderr.write(ftpRun.stderr ?? '');
if (ftpRun.status !== 0) {
  problems.push(`get-uri ftp behaviour failed (status ${ftpRun.status === null ? ftpRun.signal : '0x' + (ftpRun.status >>> 0).toString(16)}${nativeCrash(ftpRun) ? ', native crash on both attempts' : ''})`);
}

if (problems.length) {
  console.error(`check-dependency-overrides: ${problems.length} problem(s)\n${problems.map((p) => `  ${p}`).join('\n')}`);
  process.exit(1);
}
console.log(`check-dependency-overrides: ${EXPECT.length} consumer resolutions fixed; tmp, uuid, typeid-js and get-uri/basic-ftp behave through their consumers`);
