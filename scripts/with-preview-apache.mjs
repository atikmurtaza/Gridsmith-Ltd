/** Linux-only acceptance of unchanged preview bytes through a disposable Apache TLS origin. */
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import https from 'node:https';
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { ownerPreviewIdentityAllowed } from '../lib/build/target.ts';

assert.equal(process.platform, 'linux', 'Apache acceptance requires Linux');
const directory = resolve('build/gs-launch-018'); mkdirSync(directory, { recursive: true });
const root = resolve('build/owner-preview-candidate');
const identityBytes = readFileSync(`${root}/__deployment.json`);
const identity = JSON.parse(identityBytes);
assert(ownerPreviewIdentityAllowed(identity) && identity.sourceModified === false);
assert.equal(spawnSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim(), identity.sourceSha);
const command = (bin, args) => {
  const result = spawnSync(bin, args, { encoding: 'utf8' });
  assert.equal(result.status, 0, `${bin}: ${result.stderr}`); return result.stdout.trim();
};
command('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', `${directory}/local.key`,
  '-out', `${directory}/local.pem`, '-days', '1', '-subj', '/CN=localhost', '-addext', 'subjectAltName=DNS:localhost']);
const modules = ['mpm_event', 'authz_core', 'authz_host', 'dir', 'mime', 'rewrite', 'headers', 'ssl', 'socache_shmcb', 'filter', 'deflate'];
writeFileSync(`${directory}/apache.conf`, `ServerRoot "/etc/apache2"
PidFile "${directory}/apache.pid"
DefaultRuntimeDir "${directory}"
ServerName localhost
Listen 127.0.0.1:3443
Listen 127.0.0.1:3238
${modules.map(name => `LoadModule ${name}_module /usr/lib/apache2/modules/mod_${name}.so`).join('\n')}
User ${command('id', ['-un'])}
Group ${command('id', ['-gn'])}
ErrorLog "${directory}/apache-error.log"
LogLevel warn
TypesConfig /etc/mime.types
ServerLimit 1
StartServers 1
ThreadsPerChild 25
MaxRequestWorkers 25
<Directory "${root}">
  Require all granted
  AllowOverride All
  Options FollowSymLinks
</Directory>
<VirtualHost 127.0.0.1:3443>
  SSLEngine on
  SSLCertificateFile "${directory}/local.pem"
  SSLCertificateKeyFile "${directory}/local.key"
  DocumentRoot "${root}"
  RewriteEngine On
  RewriteRule ^/induced-500$ - [R=500,L]
</VirtualHost>
<VirtualHost 127.0.0.1:3238>
  DocumentRoot "${root}"
</VirtualHost>
`);
const apache = spawn('/usr/sbin/apache2', ['-f', `${directory}/apache.conf`, '-DFOREGROUND'], { stdio: 'inherit' });
const agent = new https.Agent({ ca: readFileSync(`${directory}/local.pem`), keepAlive: true, maxSockets: 128 });
const servers = [];
const receipt = { sourceSha: identity.sourceSha, artifactIdentity: identity.artifactIdentity,
  candidateIdentitySha256: createHash('sha256').update(identityBytes).digest('hex'),
  runId: process.env.GITHUB_RUN_ID, platform: process.platform, checks: [] };
try {
  for (let attempt = 0; ; attempt++) {
    if (apache.exitCode !== null) throw new Error('Apache exited before readiness');
    try {
      const response = await new Promise((resolve, reject) => {
        https.get({ host: '127.0.0.1', port: 3443, servername: 'localhost', agent,
          headers: { Host: new URL(identity.siteOrigin).hostname }, path: '/__deployment.json' }, res => {
          res.resume(); res.on('end', () => resolve(res));
        }).on('error', reject);
      });
      assert.equal(response.statusCode, 200); break;
    } catch (error) { if (attempt >= 50) throw error; await new Promise(done => setTimeout(done, 100)); }
  }
  // Translate loopback transport only: preserve Apache status, bytes, headers and redirects.
  for (const port of [3236, 3200]) {
    const server = createServer((req, res) => {
      const upstream = https.request({ host: '127.0.0.1', port: 3443, servername: 'localhost', agent,
        path: req.url, method: req.method, headers: { ...req.headers, host: new URL(identity.siteOrigin).hostname } }, response => {
        res.writeHead(response.statusCode, response.headers); response.pipe(res);
      });
      upstream.on('error', error => { res.destroy(error); }); req.pipe(upstream);
    });
    await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
    servers.push(server);
  }
  for (const args of [
    ['scripts/check-hostinger-http.mjs', '--local-owner-preview'],
    ['scripts/check-static-ui.mjs', '--legal-preview'],
    ['scripts/check-lhci.mjs', 'desktop'], ['scripts/lhci-report.mjs', 'desktop'],
    ['scripts/check-lhci.mjs', 'mobile'], ['scripts/lhci-report.mjs', 'mobile'],
  ]) {
    const startedAt = new Date().toISOString();
    const child = spawn(process.execPath, args, { stdio: ['ignore', 'pipe', 'pipe'], env: {
      ...process.env, STATIC_BASE_URL: 'http://127.0.0.1:3236', GRIDSMITH_BUILD_TARGET: 'static' } });
    const chunks = [];
    for (const stream of [child.stdout, child.stderr]) stream.on('data', bytes => { chunks.push(bytes); process.stdout.write(bytes); });
    const exitCode = await new Promise((resolve, reject) => { child.once('error', reject); child.once('exit', resolve); });
    const log = Buffer.concat(chunks), logPath = `check-${receipt.checks.length}.log`;
    writeFileSync(`${directory}/${logPath}`, log);
    receipt.checks.push({ command: [process.execPath, ...args], startedAt, endedAt: new Date().toISOString(), exitCode,
      log: logPath, logSha256: createHash('sha256').update(log).digest('hex') });
    writeFileSync(`${directory}/acceptance.json`, JSON.stringify(receipt, null, 2) + '\n');
    assert.equal(exitCode, 0, `Acceptance failed: ${args.join(' ')}`);
  }
  assert.deepEqual(readFileSync(`${root}/__deployment.json`), identityBytes, 'Candidate changed during acceptance');
} finally {
  for (const server of servers) { server.closeAllConnections(); server.close(); }
  agent.destroy(); apache.kill('SIGTERM');
  for (const file of ['local.key', 'local.pem']) rmSync(`${directory}/${file}`, { force: true });
}
