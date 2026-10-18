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
import { createServer } from 'node:net';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const from = (pkg) => createRequire(join(root, 'node_modules', pkg, 'package.json'));
const versionOf = (consumer, dep) => {
  const req = from(consumer);
  let dir = req.resolve(dep);
  while (!existsSync(join(dir, 'package.json')) || JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')).name !== dep) dir = resolve(dir, '..');
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

// get-uri's ftp: route over basic-ftp, against a loopback server that records what it was asked.
async function ftpCase(mode) {
  const seen = [];
  let pending = null;
  let dataSocket = null;
  const data = createServer((s) => { dataSocket = s; if (pending) { pending(); pending = null; } });
  await new Promise((r) => data.listen(0, '127.0.0.1', r));
  const control = createServer((c) => {
    c.write('220 gs mock\r\n');
    let buffer = '';
    c.on('data', (chunk) => {
      buffer += chunk;
      let at;
      while ((at = buffer.indexOf('\r\n')) >= 0) {
        const line = buffer.slice(0, at); buffer = buffer.slice(at + 2);
        const [cmd, ...rest] = line.split(' '); const arg = rest.join(' ');
        seen.push(cmd.toUpperCase());
        const send = (body) => { const go = () => { dataSocket.end(body, () => c.write('226 done\r\n')); }; c.write('150 opening\r\n'); if (dataSocket) go(); else pending = go; };
        switch (cmd.toUpperCase()) {
          case 'USER': c.write('331 password\r\n'); break;
          case 'PASS': c.write('230 in\r\n'); break;
          case 'FEAT': c.write(mode === 'mlsd' ? '211-Features:\r\n MLST type*;size*;modify*;\r\n211 End\r\n' : '211 End\r\n'); break;
          case 'TYPE': case 'STRU': case 'OPTS': c.write('200 ok\r\n'); break;
          case 'EPSV': dataSocket = null; c.write(`229 Entering Extended Passive Mode (|||${data.address().port}|)\r\n`); break;
          case 'PASV': { dataSocket = null; const p = data.address().port; c.write(`227 Entering Passive Mode (127,0,0,1,${p >> 8},${p & 255})\r\n`); break; }
          case 'MDTM':
            if (arg.endsWith('missing.txt')) c.write('550 not found\r\n');
            else if (mode === 'mdtm') c.write('213 20261018120000\r\n');
            else c.write('502 not implemented\r\n');
            break;
          case 'LIST': send('-rw-r--r-- 1 owner group 11 Oct 18 12:00 file.txt\r\n'); break;
          case 'MLSD': send('type=file;size=11;modify=20261018120000; file.txt\r\n'); break;
          case 'RETR': send('hello world'); break;
          case 'QUIT': c.end('221 bye\r\n'); break;
          default: c.write('502 not implemented\r\n');
        }
      }
    });
    c.on('error', () => {});
  });
  await new Promise((r) => control.listen(0, '127.0.0.1', r));
  const { getUri } = from('pac-proxy-agent')('get-uri');
  const port = control.address().port;
  try {
    if (mode === 'missing' || mode === 'list') {
      await assert.rejects(getUri(`ftp://127.0.0.1:${port}/pub/${mode === 'list' ? 'file' : 'missing'}.txt`), (e) => e.code === 'ENOTFOUND', `ftp ${mode} -> NotFound`);
    } else {
      const stream = await getUri(`ftp://127.0.0.1:${port}/pub/file.txt`);
      let text = '';
      for await (const chunk of stream) text += chunk;
      assert.equal(text, 'hello world', `ftp ${mode} content`);
      assert(stream.lastModified instanceof Date && !Number.isNaN(+stream.lastModified), `ftp ${mode} lastModified`);
    }
  } finally {
    control.close(); data.close();
  }
  return seen;
}
const mdtm = await ftpCase('mdtm');
assert(mdtm.includes('MDTM') && mdtm.includes('RETR') && !mdtm.includes('LIST'), `ftp MDTM path not reached: ${mdtm}`);
const mlsd = await ftpCase('mlsd');
assert(mlsd.includes('MDTM') && mlsd.includes('MLSD') && mlsd.includes('RETR'), `ftp MLSD fallback not reached: ${mlsd}`);
// Unix LIST is the advisory's parser. get-uri reads entry.modifiedAt, which basic-ftp sets only
// from MLSD (5.x and 6.x alike), so this branch parses the listing and then reports NotFound.
const list = await ftpCase('list');
assert(list.includes('MDTM') && list.includes('LIST') && !list.includes('RETR'), `ftp Unix LIST fallback not reached: ${list}`);
const missing = await ftpCase('missing');
assert(missing.includes('MDTM') && !missing.includes('RETR'), `ftp 550 path not reached: ${missing}`);
console.log(`  get-uri ftp: MDTM [${mdtm}] · MLSD fallback [${mlsd}] · Unix LIST fallback [${list}] · 550 [${missing}]`);

if (problems.length) {
  console.error(`check-dependency-overrides: ${problems.length} problem(s)\n${problems.map((p) => `  ${p}`).join('\n')}`);
  process.exit(1);
}
console.log(`check-dependency-overrides: ${EXPECT.length} consumer resolutions fixed; tmp, uuid, typeid-js and get-uri/basic-ftp behave through their consumers`);
