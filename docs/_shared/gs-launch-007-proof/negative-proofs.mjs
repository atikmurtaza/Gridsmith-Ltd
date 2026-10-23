import assert from 'node:assert/strict';
import { existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { createHash } from 'node:crypto';
assert.equal(process.platform, 'linux');
assert(existsSync('/.dockerenv') && process.env.GS_LOCAL_PROOF === 'GS-LAUNCH-007');
assert.equal(process.cwd(), '/work/repo');
const base = 'build/gs-launch-007', site = `${base}/site`;
const rules = readFileSync(`${site}/.htaccess`), identity = readFileSync(`${site}/__deployment.json`);
assert(!existsSync(`${site}/__wrong.json`), 'Do not overwrite an existing proof file');
assert.equal(JSON.parse(identity).rehearsal, true);
assert.equal(JSON.parse(identity).deployable, false);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const errorHash = hash(readFileSync(`${site}/500.html`));
const wrongBodyHash = hash(readFileSync(`${site}/404.html`));
const records = [];
function prove(name, command, pattern) {
  const result = spawnSync(process.execPath, command, { encoding: 'utf8', env: { ...process.env,
    STATIC_BASE_URL: 'http://127.0.0.1:3236', GRIDSMITH_BUILD_TARGET: 'static', GRIDSMITH_PRODUCTION_REHEARSAL: '1' } });
  const log = (result.stdout ?? '') + (result.stderr ?? '');
  writeFileSync(`${base}/${name}.log`, log);
  assert.notEqual(result.status, 0, name); assert.match(log, pattern, name);
  if (name === 'http-body-adverse') {
    assert(log.includes(errorHash) && log.includes(wrongBodyHash), 'Expected the exact 404/500 body hash mismatch');
  }
  records.push({ name, exitCode: result.status, expectedFailure: pattern.source,
    sha256: createHash('sha256').update(log).digest('hex') });
}
const http = ['scripts/check-hostinger-http.mjs', '--local-production'];
try {
  for (const [name, changed, pattern] of [
    ['http-status-adverse', rules.toString().replace('^induced-500$ - [R=500,L]', '^induced-500$ - [R=503,L]'), /503 !== 500/],
    ['http-body-adverse', rules.toString().replace('ErrorDocument 500 /500.html', 'ErrorDocument 500 /404.html'), /ERR_ASSERTION/],
    ['http-head-adverse', rules.toString().replace('RewriteRule ^induced-500$', 'RewriteCond %{REQUEST_METHOD} =HEAD\nRewriteRule ^induced-500$ - [R=503,L]\nRewriteRule ^induced-500$'), /503 !== 500/],
    ['http-directory-adverse', rules.toString().replace('DirectorySlash Off', 'DirectorySlash On'), /301 !== 200/],
  ]) {
    assert.notEqual(changed, rules.toString()); writeFileSync(`${site}/.htaccess`, changed);
    prove(name, http, pattern); writeFileSync(`${site}/.htaccess`, rules);
  }
  const wrong = { ...JSON.parse(identity), artifactIdentity: '0'.repeat(64) };
  writeFileSync(`${site}/__deployment.json`, JSON.stringify(wrong));
  prove('lhci-artifact-adverse', ['scripts/check-lhci.mjs','desktop'], /STATIC_LIGHTHOUSE_ARTIFACT_IDENTITY/);
  writeFileSync(`${site}/__deployment.json`, identity);
  writeFileSync(`${site}/__wrong.json`, JSON.stringify(wrong));
  writeFileSync(`${site}/.htaccess`, rules.toString().replace('RewriteEngine On\n',
    'RewriteEngine On\nRewriteCond %{SERVER_PORT} =3200\nRewriteRule ^__deployment\\.json$ __wrong.json [L]\n'));
  prove('lhci-desktop-adverse', ['scripts/check-lhci.mjs','desktop'], /STATIC_LIGHTHOUSE_DESKTOP_IDENTITY/);
  writeFileSync(`${site}/.htaccess`, rules);
  const server = createServer(); await new Promise(resolve => server.listen(3202, '127.0.0.1', resolve));
  try { prove('lhci-mobile-adverse', ['scripts/check-lhci.mjs','mobile'], /STATIC_LIGHTHOUSE_MOBILE_PORT_OCCUPIED/); }
  finally { server.close(); }
} finally {
  writeFileSync(`${site}/.htaccess`, rules); writeFileSync(`${site}/__deployment.json`, identity);
  rmSync(`${site}/__wrong.json`, { force: true });
  assert.deepEqual(readFileSync(`${site}/.htaccess`), rules);
  assert.deepEqual(readFileSync(`${site}/__deployment.json`), identity);
  writeFileSync(`${base}/negative-receipt.json`, JSON.stringify(records,null,2));
}
assert.equal(records.length, 7);
console.log('Seven local HTTP/Lighthouse adverse cases rejected; captured simulation bytes restored.');
