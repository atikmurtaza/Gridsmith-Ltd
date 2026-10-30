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
import { createServer, request } from 'node:http';
import { createHash } from 'node:crypto';

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
  ['3.4.17', '3.4.17', true], ['10.7.3', '10.7.4', false], ['10.7.4', '10.7.4', true],
  ['6.16.0', '6.16.1', false], ['6.16.1', '6.16.1', true]]) {
  assert.equal(atLeast(v, min), want, `comparator ${v} >= ${min}`);
}

const problems = [];
const EXPECT = [['@lhci/cli', 'tmp', '0.2.6'], ['external-editor', 'tmp', '0.2.6'], ['@lhci/cli', 'uuid', '11.1.1'],
  ['typeid-js', 'uuid', '11.1.1'], ['get-uri', 'basic-ftp', '6.2.1'],
  ['@portabletext/markdown', 'markdown-it', '14.3.3'], ['@sanity/cli-build', 'vite', '8.2.4'],
  ['isomorphic-dompurify', 'dompurify', '3.4.17'], ['socks', 'ip-address', '10.7.4'],
  ['next', 'next', '15.5.28'], ['eslint-config-next', 'eslint-config-next', '15.5.28'],
  ['zod', 'zod', '4.6.6'], ['sanity', 'zod', '4.6.6'], ['chromium-bidi', 'zod', '4.6.6'],
  ['lighthouse', 'puppeteer-core', '25.14.0'], ['puppeteer', 'puppeteer-core', '25.14.0'],
  ['express', 'body-parser', '1.20.9'], ['express', 'qs', '6.16.1'], ['body-parser', 'qs', '6.16.1'],
  ['get-it', 'undici', '7.30.1'], ['@module-federation/dts-plugin', 'undici', '7.30.1'],
  ['jsdom', 'undici', '7.30.1'], ['@actions/github', 'undici', '6.29.1'], ['@actions/http-client', 'undici', '6.29.1']];
for (const [consumer, dep, min] of EXPECT) {
  const v = versionOf(consumer, dep);
  console.log(`  ${consumer} -> ${dep}@${v} (needs >=${min})`);
  if (!atLeast(v, min)) problems.push(`${consumer} resolves ${dep}@${v}, below the fixed ${min}`);
}

// Every installed copy, wherever it is nested: the lockfile is what `npm ci` installs.
const MINIMUM = { tmp: '0.2.6', uuid: '11.1.1', 'basic-ftp': '6.2.1', 'markdown-it': '14.3.3', vite: '8.2.4',
  dompurify: '3.4.17', 'ip-address': '10.7.4', next: '15.5.28', 'eslint-config-next': '15.5.28', 'body-parser': '1.20.9', undici: '7.30.1',
  zod: '4.6.6', puppeteer: '25.14.0', 'puppeteer-core': '25.14.0', qs: '6.16.1' };
// Lockfile v3 records `name` only when the folder differs (an npm alias), which overrides do not reach.
const packageName = (path, entry) => entry.name ?? path.split('node_modules/').pop();
const lockProblems = (packages) => Object.entries(packages).flatMap(([path, entry]) => {
  const name = packageName(path, entry);
  if (name === 'extract-zip') return [`${path} retains unpatched extract-zip`];
  const minimum = name === 'undici' && entry.version?.startsWith('6.') ? '6.29.1' : MINIMUM[name];
  return minimum && entry.version && !atLeast(entry.version, minimum) ? [`${path} is ${name}@${entry.version}, below the fixed ${minimum}`] : [];
});
assert.equal(lockProblems({ 'node_modules/x/node_modules/tmp': { version: '0.1.0' }, 'node_modules/uuid': { version: '11.1.1' } }).length, 1,
  'lock check must report a nested vulnerable copy');
assert.equal(lockProblems({ 'node_modules/x/node_modules/tmp-legacy': { name: 'tmp', version: '0.0.33' } }).length, 1,
  'lock check must report an npm-aliased vulnerable copy');
for (const path of ['node_modules/extract-zip', 'node_modules/x/node_modules/extract-zip', 'node_modules/alias']) {
  assert.equal(lockProblems({ [path]: { name: 'extract-zip', version: '2.0.1' } }).length, 1);
}
const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8')).packages;
for (const [name, version] of [['markdown-it', '14.3.1'], ['vite', '8.2.1'], ['dompurify', '3.4.16'],
  ['ip-address', '10.7.3'], ['next', '15.5.27'], ['eslint-config-next', '15.5.27'], ['body-parser', '1.20.8'],
  ['undici', '6.29.0'], ['undici', '7.30.0'], ['zod', '3.25.76'], ['zod', '4.6.5'],
  ['puppeteer', '24.43.1'], ['puppeteer-core', '24.43.1'], ['qs', '6.16.0']]) {
  assert.equal(lockProblems({ [`node_modules/x/node_modules/${name}`]: { version } }).length, 1);
  assert.equal(lockProblems({ 'node_modules/aliased-tool': { name, version } }).length, 1);
}
for (const version of ['6.29.1', '7.30.1']) assert.deepEqual(lockProblems({ 'node_modules/undici': { version } }), []);
const copies = Object.entries(lock).filter(([path, entry]) => MINIMUM[packageName(path, entry)]).length;
problems.push(...lockProblems(lock));
console.log(`  package-lock: ${copies} installed copies of the remediated dependencies checked`);

// GHSA-6pq8-jhm2-2vcw: both comma branches previously threw when an input
// element shadowed toString with a non-callable value. Exercise each consumer.
for (const consumer of ['express', 'body-parser']) {
  const qs = from(consumer)('qs');
  for (const encodeValuesOnly of [false, true]) {
    assert.doesNotThrow(() => qs.stringify({ a: [{ toString: 'x' }] }, { arrayFormat: 'comma', encodeValuesOnly }));
    assert.equal(qs.stringify({ a: ['one', 'two'] }, { arrayFormat: 'comma', encodeValuesOnly }),
      encodeValuesOnly ? 'a=one,two' : 'a=one%2Ctwo');
  }
}
console.log('  Express/body-parser qs PASS: hostile toString and ordinary comma arrays, both encodeValuesOnly branches');

// GHSA-mrhx-c7xc-m3w5: bounded collections must reject before visiting their elements.
{
  const { z } = from('sanity')('zod');
  let visits = 0;
  const item = z.string().refine(() => { visits++; return true; });
  for (const schema of [z.array(item).max(2), z.array(item).length(2)]) {
    const result = schema.safeParse(['a', 'b', 'c']);
    assert.equal(result.success, false);
    assert.equal(result.error.issues.length, 1);
    assert.equal(result.error.issues[0].code, 'too_big');
    assert.equal(visits, 0, 'oversized array visited its elements');
  }
  for (const [schema, input] of [[z.set(z.string()).max(1), new Set([1, 2])],
    [z.map(z.string(), z.string()).max(1), new Map([[1, 1], [2, 2]])]]) {
    const result = schema.safeParse(input);
    assert.equal(result.success, false);
    assert.deepEqual(result.error.issues.map(issue => issue.code), ['too_big']);
  }
  assert.deepEqual(z.array(z.string()).overwrite(value => value.slice(0, 2)).max(2).parse(['a', 'b', 'c']), ['a', 'b']);
  // BiDi upgraded its own schemas to Zod 4; exercise that consumer rather than overriding Zod 3.
  const parser = await import(pathToFileURL(join(dirname(from('chromium-bidi').resolve('chromium-bidi')), 'protocol-parser/protocol-parser.js')));
  assert.deepEqual(parser.Browser.parseRemoveUserContextParameters({ userContext: 'test' }), { userContext: 'test' });
  assert.throws(() => parser.Browser.parseRemoveUserContextParameters({ userContext: 1 }), /Expected string|expected string/);
  assert.equal(versionOf('lighthouse', 'lighthouse'), '12.6.1', 'measurement engine must remain unchanged');
  console.log('  Zod 4 constrained collections and BiDi valid/invalid schema parsing PASS; Lighthouse engine unchanged');
}

// GHSA-27r3-jxmh-p828: send trailing bytes only after the decompressor has finished.
for (const secondConsumer of [false, true]) {
  const express = from('@lhci/cli')('express');
  const onFinished = from('express')('on-finished');
  const first = Buffer.concat([Buffer.from('789cab564a54b232ac0500082a0209', 'hex'), Buffer.from([0])]);
  const trailing = Buffer.alloc(1024);
  const expectedHash = createHash('sha256').update(first).update(trailing).digest('hex');
  let client, parsedBeforeTrailing = false;
  const server = createServer((req, res) => {
    const hash = createHash('sha256');
    if (secondConsumer) req.pipe(hash);
    express.json()(req, res, error => {
      assert.ifError(error);
      parsedBeforeTrailing = true;
      onFinished(req, () => {
        if (secondConsumer) res.setHeader('x-body-sha256', hash.read().toString('hex'));
        res.end(JSON.stringify(req.body));
      });
      client.end(trailing);
    });
  });
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const response = await new Promise((resolve, reject) => {
      client = request({ host: '127.0.0.1', port: server.address().port, method: 'POST', agent: false,
        headers: { 'content-type': 'application/json', 'content-encoding': 'deflate', 'content-length': first.length + trailing.length } }, res => {
        let body = '';
        res.setEncoding('utf8').on('data', chunk => { body += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, hash: res.headers['x-body-sha256'], body }));
        res.on('error', reject);
      });
      client.on('error', reject);
      client.setTimeout(5000, () => client.destroy(new Error('body-parser trailing-byte request did not finish')));
      client.write(first);
    });
    assert(parsedBeforeTrailing, 'fixture never reached the early decompressor completion');
    assert.deepEqual(response, { status: 200, hash: secondConsumer ? expectedHash : undefined, body: '{"a":1}' });
  } finally {
    client?.destroy();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
  console.log(`  LHCI Express/body-parser PASS: coordinated trailing bytes drained; second raw-body consumer=${secondConsumer}`);
}

// Exercise both installed Undici majors; the v7-only integrity bug must not be labelled a v6 finding.
for (const consumer of ['get-it', '@actions/github']) {
  const { fetch, Agent } = from(consumer)('undici');
  const { EventSourceStream } = from(consumer)('undici/lib/web/eventsource/eventsource-stream.js');
  for (const count of [1024, 1025]) {
    const parser = new EventSourceStream({ maxEventSize: 4096 });
    const events = [];
    const error = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => { parser.destroy(); reject(new Error('SSE bound fixture did not finish')); }, 5000);
      parser.on('data', event => events.push(event));
      parser.on('error', error => { clearTimeout(timer); resolve(error); });
      parser.on('end', () => { clearTimeout(timer); resolve(null); });
      parser.end(Buffer.from('data:\n'.repeat(count) + '\n'));
    });
    if (count === 1025) assert.match(error?.message ?? '', /EventSource message size exceeded/);
    else { assert.equal(error, null); assert.equal(events.length, 1); assert.equal(events[0].options.data.length, 1023); }
  }
  const body = 'security probe';
  const server = createServer((req, res) => {
    if (req.url === '/excess-encoding') {
      res.writeHead(200, { 'content-encoding': Array(6).fill('gzip').join(', '), 'content-length': '1' });
      res.flushHeaders(); res.socket.end();
    } else {
      if (req.url === '/identity') res.setHeader('content-encoding', Array(5).fill('identity').join(', '));
      res.end(body);
    }
  });
  const dispatcher = new Agent({ connect: { family: 4 } });
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${server.address().port}`;
    const options = { dispatcher, signal: AbortSignal.timeout(5000) };
    assert.equal(await (await fetch(url + '/identity', options)).text(), body);
    await assert.rejects(fetch(url + '/excess-encoding', options), error => /content-encoding/.test(error.cause?.message ?? ''));
    if (consumer === 'get-it') {
      const checksum = createHash('sha256').update(body).digest('base64');
      const wrong = createHash('sha256').update('wrong').digest('base64');
      for (const algorithm of ['SHA256', 'sHa256']) {
        assert.equal(await (await fetch(url, { ...options, integrity: `${algorithm}-${checksum}` })).text(), body);
        await assert.rejects(fetch(url, { ...options, integrity: `${algorithm}-${wrong}` }), error => /integrity mismatch/.test(error.cause?.message ?? ''));
      }
      const stronger = createHash('sha512').update('wrong').digest('base64');
      await assert.rejects(fetch(url, { ...options, integrity: `sha256-${checksum} SHA512-${stronger}` }), error => /integrity mismatch/.test(error.cause?.message ?? ''));
    }
  } finally {
    await dispatcher.close();
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
  console.log(`  ${consumer}/Undici PASS: bounded SSE, HTTP decoding and fetch/Agent; v7 mixed-case integrity checked where applicable`);
}

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
console.log(`check-dependency-overrides: ${EXPECT.length} consumer resolutions fixed; temporary files, IDs, FTP, Markdown, Vite, sanitization, IP parsing, Zod 4/BiDi, compressed HTTP and Undici exercised; no extract-zip or Zod 3`);
