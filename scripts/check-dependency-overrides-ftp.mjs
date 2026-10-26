#!/usr/bin/env node
/**
 * Child of check-dependency-overrides.mjs: get-uri's ftp: route over the overridden basic-ftp,
 * against a loopback server. Runs in its own process so the parent can classify a native
 * node.exe crash separately from an assertion failure (see the parent). No network.
 */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createServer } from 'node:net';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const from = (pkg) => createRequire(join(root, 'node_modules', pkg, 'package.json'));

// get-uri's ftp: route over basic-ftp, against one loopback server pair that records what it is
// asked. One pair for all cases, the client's sockets drained between cases and the servers closed
// once: rapid per-case server churn crashed node.exe natively on Windows (0xC0000409), with
// basic-ftp 5.3.1 as well as 6.2.3, so it is a harness/platform fault, not the override.
const ftp = { mode: '', seen: [], pending: null, dataSocket: null, sockets: new Set() };
const track = (socket) => { ftp.sockets.add(socket); socket.on('error', () => {}); socket.on('close', () => ftp.sockets.delete(socket)); };
const data = createServer((s) => { track(s); ftp.dataSocket = s; if (ftp.pending) { ftp.pending(); ftp.pending = null; } });
await new Promise((r) => data.listen(0, '127.0.0.1', r));
const control = createServer((c) => {
  track(c);
  c.write('220 gs mock\r\n');
  let buffer = '';
  c.on('data', (chunk) => {
    buffer += chunk;
    let at;
    while ((at = buffer.indexOf('\r\n')) >= 0) {
      const line = buffer.slice(0, at); buffer = buffer.slice(at + 2);
      const [cmd, ...rest] = line.split(' '); const arg = rest.join(' ');
      ftp.seen.push(cmd.toUpperCase());
      const send = (body) => {
        const go = () => { ftp.dataSocket.end(body, () => { if (!c.destroyed) c.write('226 done\r\n'); }); };
        c.write('150 opening\r\n'); if (ftp.dataSocket) go(); else ftp.pending = go;
      };
      switch (cmd.toUpperCase()) {
        case 'USER': c.write('331 password\r\n'); break;
        case 'PASS': c.write('230 in\r\n'); break;
        case 'FEAT': c.write(ftp.mode === 'mlsd' ? '211-Features:\r\n MLST type*;size*;modify*;\r\n211 End\r\n' : '211 End\r\n'); break;
        case 'TYPE': case 'STRU': case 'OPTS': c.write('200 ok\r\n'); break;
        case 'EPSV': ftp.dataSocket = null; c.write(`229 Entering Extended Passive Mode (|||${data.address().port}|)\r\n`); break;
        case 'PASV': { ftp.dataSocket = null; const p = data.address().port; c.write(`227 Entering Passive Mode (127,0,0,1,${p >> 8},${p & 255})\r\n`); break; }
        case 'MDTM':
          if (arg.endsWith('missing.txt')) c.write('550 not found\r\n');
          else if (ftp.mode === 'mdtm') c.write('213 20261018120000\r\n');
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
});
await new Promise((r) => control.listen(0, '127.0.0.1', r));
const { getUri } = from('pac-proxy-agent')('get-uri');
const drain = async () => {
  // Let the client finish its own QUIT/close (bounded), then destroy anything left.
  for (let waited = 0; ftp.sockets.size && waited < 2000; waited += 20) await new Promise((r) => setTimeout(r, 20));
  for (const socket of ftp.sockets) socket.destroy();
};
async function ftpCase(mode) {
  Object.assign(ftp, { mode, seen: [], pending: null, dataSocket: null });
  const url = `ftp://127.0.0.1:${control.address().port}/pub/${mode === 'missing' ? 'missing' : 'file'}.txt`;
  try {
    if (mode === 'missing' || mode === 'list') {
      await assert.rejects(getUri(url), (e) => e.code === 'ENOTFOUND', `ftp ${mode} -> NotFound`);
    } else {
      const stream = await getUri(url);
      let text = '';
      for await (const chunk of stream) text += chunk;
      assert.equal(text, 'hello world', `ftp ${mode} content`);
      assert(stream.lastModified instanceof Date && !Number.isNaN(+stream.lastModified), `ftp ${mode} lastModified`);
    }
  } finally {
    await drain();
  }
  return ftp.seen;
}
let mdtm, mlsd, list, missing;
try {
  mdtm = await ftpCase('mdtm');
  assert(mdtm.includes('MDTM') && mdtm.includes('RETR') && !mdtm.includes('LIST'), `ftp MDTM path not reached: ${mdtm}`);
  mlsd = await ftpCase('mlsd');
  assert(mlsd.includes('MDTM') && mlsd.includes('MLSD') && mlsd.includes('RETR'), `ftp MLSD fallback not reached: ${mlsd}`);
  // Unix LIST is the advisory's parser. get-uri reads entry.modifiedAt, which basic-ftp sets only
  // from MLSD (5.x and 6.x alike), so this branch parses the listing and then reports NotFound.
  list = await ftpCase('list');
  assert(list.includes('MDTM') && list.includes('LIST') && !list.includes('RETR'), `ftp Unix LIST fallback not reached: ${list}`);
  missing = await ftpCase('missing');
  assert(missing.includes('MDTM') && !missing.includes('RETR'), `ftp 550 path not reached: ${missing}`);
} finally {
  await Promise.all([control, data].map((server) => new Promise((r) => server.close(() => r()))));
}
console.log(`  get-uri ftp: MDTM [${mdtm}] · MLSD fallback [${mlsd}] · Unix LIST fallback [${list}] · 550 [${missing}]`);
