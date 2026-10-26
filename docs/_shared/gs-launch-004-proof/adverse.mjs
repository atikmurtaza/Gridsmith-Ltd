/** Owned-container fault injection only; restore captured bytes in finally. */
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const root = 'build/gs-launch-004';
const results = [];
function docker(args, input) {
  const r = spawnSync('docker', ['exec', '-i', 'gs-launch004-proof', ...args], { input });
  assert.equal(r.status, 0, r.stderr.toString()); return r.stdout;
}
const original = new Map(['/proof/site/.htaccess', '/proof/co-located/.htaccess', '/proof/fallback/error.html']
  .map(path => [path, docker(['cat', path])]));
function put(path, bytes) { docker(['sh', '-c', 'cat > "$1"', 'sh', path], bytes); }
async function inspect(label, url, accessible, expectedStatus = 500) {
  const r = await fetch(url, { headers: { Accept: 'text/html' } }); const html = await r.text();
  writeFileSync(`${root}/${label}.html`, html);
  assert.equal(r.status, expectedStatus);
  assert.equal(/<html[^>]*\slang="en-GB"/.test(html) && /<main[\s>]/.test(html) && /<h1[\s>]/.test(html), accessible);
  results.push({ label, status: r.status, accessible, headers: Object.fromEntries(r.headers) });
}
try {
  put('/proof/co-located/.htaccess', Buffer.from('ErrorDocument 500 /500.html\nInvalidGsLaunch004Directive\n'));
  await inspect('colocated-broken-htaccess', 'http://127.0.0.1:3348/about', false);
  put('/proof/site/.htaccess', Buffer.from('InvalidGsLaunch004Directive\n'));
  await inspect('independent-broken-htaccess', 'http://127.0.0.1:3344/about', true);
  put('/proof/site/.htaccess', original.get('/proof/site/.htaccess'));
  docker(['rm', '/proof/fallback/error.html']);
  docker(['test', '!', '-e', '/proof/fallback/error.html']);
  await inspect('independent-missing-file', 'http://127.0.0.1:3344/induced-500', false);
  put('/proof/fallback/error.html', original.get('/proof/fallback/error.html'));
} finally {
  for (const [path, bytes] of original) { put(path, bytes); assert.deepEqual(docker(['cat', path]), bytes); }
  writeFileSync(`${root}/adverse-receipt.json`, JSON.stringify({ results, restoredBytes: true }, null, 2) + '\n');
}
await inspect('independent-restored', 'http://127.0.0.1:3344/induced-500', true);
writeFileSync(`${root}/adverse-receipt.json`, JSON.stringify({ results, restoredBytes: true }, null, 2) + '\n');
console.log('PASS: four fault/recovery assertions; three container subjects restored byte-identically');
