#!/usr/bin/env node
/**
 * h2-proxy — serves the built site over HTTP/2 so the mobile Lighthouse run measures the
 * protocol visitors actually get.
 *
 * **Why this exists: `M-P1-10`.** Mobile LCP was bimodal, ~1520ms or ~1970ms with nothing
 * between, on trees that were byte-identical. The cause was not the site. Every run issued
 * 15 requests over `http/1.1`, 7 of them render-critical (5 stylesheets + 2 fonts) and all
 * requested within 5ms of each other. Chrome's per-origin HTTP/1.1 connection limit is 6, so
 * exactly one was queued each run, and *which one lost the race* set the mode: a queued
 * stylesheet blocks render and costs ~525ms, a queued font is `display: optional` and costs
 * nothing. Straggler type predicted the mode 12 times out of 12.
 *
 * Vercel negotiates `h2` — measured by TLS ALPN against the preview host, not assumed. HTTP/2
 * multiplexes over one connection and has no 6-request limit, so **the contention cannot
 * arise for a visitor**. A budget asserted over HTTP/1.1 is asserting against a condition no
 * visitor will meet, which is why the harness moved rather than the ceilings.
 *
 * **`allowHTTP1` is false, deliberately.** If Chrome fails to negotiate h2 the connection
 * must fail, not quietly downgrade. A downgrade would put us back on HTTP/1.1 while every
 * report still said the run had happened — the silent-skip class this repository keeps
 * finding, and the one the artifact step in `ci.yml` had in its first version.
 *
 * `next start` is spawned from here so there is one process to stop, for the reason
 * `with-server.mjs` gives: an npm wrapper leaves the server orphaned on Windows.
 *
 * The certificate is generated per run into a temp dir and never committed. It is a
 * throwaway for 127.0.0.1; Chrome is given `--ignore-certificate-errors` in the Lighthouse
 * config, which is scoped to that headless instance.
 */
import { spawn, spawnSync } from 'node:child_process';
import http from 'node:http';
import http2 from 'node:http2';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const LISTEN = Number(process.env.H2_PORT ?? 3202);
const UPSTREAM = Number(process.env.H2_UPSTREAM_PORT ?? 3203);

// ---- certificate -----------------------------------------------------------------------
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gridsmith-h2-'));
const keyPath = path.join(dir, 'key.pem');
const certPath = path.join(dir, 'cert.pem');

const openssl = spawnSync('openssl', [
  'req', '-x509', '-newkey', 'rsa:2048', '-nodes',
  '-keyout', keyPath, '-out', certPath,
  '-days', '1', '-subj', '/CN=127.0.0.1',
  '-addext', 'subjectAltName=IP:127.0.0.1,DNS:localhost',
], { encoding: 'utf8' });

if (openssl.status !== 0) {
  console.error('h2-proxy: openssl failed to generate a certificate.');
  console.error(openssl.stderr || openssl.error?.message);
  process.exit(1);
}

// ---- upstream --------------------------------------------------------------------------
// maxSockets is set explicitly and high. The browser-side limit is the whole subject of
// M-P1-10; reintroducing one on the proxy->next hop would move the bottleneck rather than
// remove it, and would look identical in the reports.
const agent = new http.Agent({ keepAlive: true, maxSockets: 256 });

const next = spawn(
  process.execPath,
  [path.join('node_modules', 'next', 'dist', 'bin', 'next'), 'start', '-p', String(UPSTREAM)],
  { stdio: ['ignore', 'pipe', 'pipe'] },
);
next.stdout.on('data', (d) => process.stdout.write(`[next] ${d}`));
next.stderr.on('data', (d) => process.stderr.write(`[next] ${d}`));

const HOP_BY_HOP = new Set([
  'connection', 'keep-alive', 'proxy-connection', 'transfer-encoding', 'upgrade',
]);

const server = http2.createSecureServer({
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
  allowHTTP1: false,
});

server.on('stream', (stream, headers) => {
  const method = headers[':method'];
  const reqPath = headers[':path'];

  const outHeaders = {};
  for (const [k, v] of Object.entries(headers)) {
    if (k.startsWith(':') || HOP_BY_HOP.has(k)) continue;
    outHeaders[k] = v;
  }
  outHeaders.host = `127.0.0.1:${UPSTREAM}`;

  const upstream = http.request(
    { host: '127.0.0.1', port: UPSTREAM, method, path: reqPath, headers: outHeaders, agent },
    (res) => {
      const respond = { ':status': res.statusCode };
      for (const [k, v] of Object.entries(res.headers)) {
        if (HOP_BY_HOP.has(k)) continue;
        respond[k] = v;
      }
      try { stream.respond(respond); } catch { return; }
      res.pipe(stream);
    },
  );

  upstream.on('error', () => { try { stream.close(http2.constants.NGHTTP2_INTERNAL_ERROR); } catch {} });
  stream.on('error', () => {});
  stream.pipe(upstream);
});

// ---- readiness -------------------------------------------------------------------------
// Poll the upstream, then announce. LHCI's startServerReadyPattern watches for this line, so
// it must not be printed before the thing it claims is true.
const deadline = Date.now() + 90_000;
const poll = () => {
  const req = http.get({ host: '127.0.0.1', port: UPSTREAM, path: '/' }, (res) => {
    res.resume();
    server.listen(LISTEN, '127.0.0.1', () => {
      console.log(`h2-proxy: serving https://127.0.0.1:${LISTEN} over HTTP/2 -> next on ${UPSTREAM}`);
    });
  });
  req.on('error', () => {
    if (Date.now() > deadline) {
      console.error('h2-proxy: next did not become ready within 90s.');
      next.kill();
      process.exit(1);
    }
    setTimeout(poll, 300);
  });
};
poll();

const shutdown = () => { try { next.kill(); } catch {} try { server.close(); } catch {} process.exit(0); };
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
next.on('exit', (code) => { if (code) { console.error(`h2-proxy: next exited ${code}`); process.exit(code); } });
