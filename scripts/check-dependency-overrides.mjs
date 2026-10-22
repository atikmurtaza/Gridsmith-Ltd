#!/usr/bin/env node
/**
 * GS-R12 / GS-LAUNCH-002: the reviewed security overrides and patches, checked
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
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
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
  ['0.2.7', '0.2.6', true], ['11.1.1', '11.1.1', true], ['6.2.3', '6.2.1', true], ['14.0.1', '11.1.1', true],
  ['14.3.1', '14.3.3', false], ['14.3.3', '14.3.3', true], ['8.2.1', '8.2.4', false], ['8.2.4', '8.2.4', true],
  ['15.5.27', '15.5.28', false], ['15.5.28', '15.5.28', true], ['3.4.16', '3.4.17', false],
  ['3.4.17', '3.4.17', true], ['10.7.3', '10.7.4', false], ['10.7.4', '10.7.4', true]]) {
  assert.equal(atLeast(v, min), want, `comparator ${v} >= ${min}`);
}

const problems = [];
const EXPECT = [['@lhci/cli', 'tmp', '0.2.6'], ['external-editor', 'tmp', '0.2.6'], ['@lhci/cli', 'uuid', '11.1.1'],
  ['typeid-js', 'uuid', '11.1.1'], ['get-uri', 'basic-ftp', '6.2.1'],
  ['@portabletext/markdown', 'markdown-it', '14.3.3'], ['@sanity/cli-build', 'vite', '8.2.4'],
  ['isomorphic-dompurify', 'dompurify', '3.4.17'], ['socks', 'ip-address', '10.7.4'],
  ['next', 'next', '15.5.28'], ['eslint-config-next', 'eslint-config-next', '15.5.28']];
for (const [consumer, dep, min] of EXPECT) {
  const v = versionOf(consumer, dep);
  console.log(`  ${consumer} -> ${dep}@${v} (needs >=${min})`);
  if (!atLeast(v, min)) problems.push(`${consumer} resolves ${dep}@${v}, below the fixed ${min}`);
}

// Every installed copy, wherever it is nested: the lockfile is what `npm ci` installs.
const MINIMUM = { tmp: '0.2.6', uuid: '11.1.1', 'basic-ftp': '6.2.1', 'markdown-it': '14.3.3', vite: '8.2.4',
  dompurify: '3.4.17', 'ip-address': '10.7.4', next: '15.5.28', 'eslint-config-next': '15.5.28' };
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
for (const [name, version] of [['markdown-it', '14.3.1'], ['vite', '8.2.1'], ['dompurify', '3.4.16'],
  ['ip-address', '10.7.3'], ['next', '15.5.27'], ['eslint-config-next', '15.5.27']]) {
  assert.equal(lockProblems({ [`node_modules/x/node_modules/${name}`]: { version } }).length, 1);
  assert.equal(lockProblems({ 'node_modules/aliased-tool': { name, version } }).length, 1);
}
const copies = Object.entries(lock).filter(([path, entry]) => MINIMUM[packageName(path, entry)]).length;
problems.push(...lockProblems(lock));
console.log(`  package-lock: ${copies} installed copies of the remediated dependencies checked`);

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

// GS-LAUNCH-002: exercise the patched Markdown/Vite leaves through Sanity's real consumers.
{
  const { markdownToPortableText } = await import(pathToFileURL(from('@portabletext/editor').resolve('@portabletext/markdown')).href);
  const blocks = markdownToPortableText('**bold** [link](https://example.invalid)');
  assert(blocks.some(block => block.children?.some(span => span.text === 'bold' && span.marks.includes('strong'))));
  assert(blocks.some(block => block.markDefs?.some(mark => mark.href === 'https://example.invalid')));
  const { getStudioEnvironmentVariables } = await import(pathToFileURL(from('@sanity/cli').resolve('@sanity/cli-build/_internal/env')).href);
  const build = join(root, 'build'); mkdirSync(build, { recursive: true });
  const fixture = mkdtempSync(join(build, 'dependency-env-'));
  assert.equal(dirname(fixture), build, 'Synthetic environment cleanup must stay inside this checkout');
  try {
    writeFileSync(join(fixture, '.env.production'), 'SANITY_STUDIO_GS_LAUNCH_PATCH=synthetic-patch-proof\n');
    assert.equal(getStudioEnvironmentVariables({ envFile: { mode: 'production', envDir: fixture } }).SANITY_STUDIO_GS_LAUNCH_PATCH,
      'synthetic-patch-proof', 'Sanity must call the patched Vite loadEnv with the synthetic directory');
  } finally { rmSync(fixture, { recursive: true }); }
}

{
  const purifier = from('sanity')('isomorphic-dompurify');
  const safe = purifier.sanitize('<p>safe</p><img src="x" onerror="alert(1)"><script>alert(1)</script>');
  assert(safe.includes('<p>safe</p>') && !/onerror|<script/i.test(safe), 'Sanity sanitizer retains content and removes executable markup');
  const { Address4, Address6 } = from('socks')('ip-address');
  assert.equal(new Address4('192.0.2.1').correctForm(), '192.0.2.1');
  assert.equal(new Address6('2001:db8::1%proof').correctForm(), '2001:db8::1');
  assert.throws(() => new Address6('invalid'), 'SOCKS address parser must reject malformed input');
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
console.log(`check-dependency-overrides: ${EXPECT.length} consumer resolutions fixed; temporary files, IDs, FTP, Markdown, Vite, sanitization and IP parsing exercised`);
