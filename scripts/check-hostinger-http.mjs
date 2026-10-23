/** Actual served staging contract. GET-only: no forms, provider API or Production requests. */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { REVIEW_STAGING_ORIGIN } from '../lib/reviews/public-model.ts';
import { artifactReviewProblems, artifactNoReviewProblems } from './review-public-rules.mjs';

const localProduction = process.argv.includes('--local-production');
const origin = localProduction ? process.env.STATIC_BASE_URL : REVIEW_STAGING_ORIGIN;
if (localProduction) assert(/^http:\/\/(?:localhost|127\.0\.0\.1):\d+$/.test(origin), 'Production simulation is loopback only');
const local = JSON.parse(readFileSync(`${localProduction ? 'build/production-rehearsal' : 'out'}/__deployment.json`));
assert.equal(local.sourceModified, false, 'Only committed source may be deployed');
assert.equal(local.siteOrigin, localProduction ? 'https://gridsmith.uk' : origin);
if (localProduction) {
  assert.equal(local.contactMode, 'direct'); assert.equal(local.rehearsal, true); assert.equal(local.deployable, false);
}
const receipt = { phase: 'GS-HOST-H4-D-R1', origin, sourceSha: local.sourceSha,
  artifactIdentity: local.artifactIdentity, files: [], routes: [], checks: [] };
const get = async (path, options = {}) => {
  const started = performance.now();
  const response = await fetch(origin + path, { redirect: 'manual', signal: AbortSignal.timeout(30000), ...options });
  const bytes = Buffer.from(await response.arrayBuffer());
  return { response, bytes, elapsedMs: Math.round(performance.now() - started) };
};
const identity = await get('/__deployment.json');
assert.equal(identity.response.status, 200);
assert.deepEqual(JSON.parse(identity.bytes), local, 'Served deployment identity differs');
const headers = (response) => {
  if (!localProduction) assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('x-frame-options'), 'DENY');
  assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  assert.match(response.headers.get('content-security-policy') ?? '', /frame-ancestors 'none'/);
  assert.match(response.headers.get('content-security-policy') ?? '', localProduction ? /connect-src 'self'\s*;/ : /qfgpwumvvtizeamkynes\.supabase\.co/);
  assert.match(response.headers.get('strict-transport-security') ?? '', /max-age=31536000/);
  assert.match(response.headers.get('permissions-policy') ?? '', /camera=\(\)/);
};
headers(identity.response);
const served = new Map();
for (const file of local.files) {
  if (file.path === '.htaccess') continue; // Config is forbidden over HTTP, tested below.
  const path = '/' + file.path.split('/').map(encodeURIComponent).join('/');
  const { response, bytes, elapsedMs } = await get(path);
  assert.equal(response.status, 200, `Missing served artifact file: ${file.path}`);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256, `Served bytes differ: ${file.path}`);
  headers(response);
  const type = response.headers.get('content-type') ?? '';
  if (file.path.endsWith('.js')) assert.match(type, /(?:javascript|ecmascript)/);
  if (file.path.endsWith('.css')) assert.match(type, /text\/css/);
  if (file.path.endsWith('.woff2')) assert.match(type, /(?:font\/woff2|application\/font-woff)/);
  if (file.path.endsWith('.svg')) assert.match(type, /image\/svg\+xml/);
  const cache = response.headers.get('cache-control') ?? '';
  if (/\.(?:svg|png|jpe?g|webp|avif|glb|gltf|bin)$/.test(file.path)) assert.match(cache, /no-transform/, file.path);
  if (file.path.endsWith('.html') || /^(?:robots\.txt|sitemap\.xml)$/.test(file.path)) assert.match(cache, /no-cache/);
  if (/(?:[.-][a-f0-9]{8,}\.(?:js|css)|\/[a-f0-9]{8,}\.(?:js|css)|\/[a-f0-9]{8,}[^/]*\.woff2)$/.test(file.path)) assert.match(cache, /immutable/, file.path);
  served.set(file.path, bytes);
  receipt.files.push({ path: file.path, bytes: bytes.length, sha256: file.sha256,
    type, cache, encoding: response.headers.get('content-encoding'), elapsedMs });
}
assert.deepEqual(localProduction ? artifactNoReviewProblems(served) :
  artifactReviewProblems(served, JSON.parse(readFileSync('docs/_shared/GS-HOST-H4-D-REVIEW-BASELINE.json'))), []);
const manifest = JSON.parse(readFileSync('build/static-route-manifest.json'));
for (const route of manifest.routes.filter((row) => row.eligible)) {
  const { response, bytes, elapsedMs } = await get(route.path);
  assert.equal(response.status, 200, route.path); headers(response);
  assert.match(response.headers.get('content-type') ?? '', /text\/html/);
  assert.match(bytes.toString(), localProduction && route.sitemap ? /name="robots"[^>]*content="index, follow"/ : /name="robots"[^>]*noindex/);
  receipt.routes.push({ path: route.path, status: response.status, elapsedMs });
}
for (const path of ['/h4d-unknown-route', '/api/rls-drift', ...(!localProduction ? ['/privacy-policy/', '/terms-and-conditions/'] : []),
  ...manifest.routes.filter((row) => !row.eligible && row.gate).map((row) => row.path)]) {
  const { response, bytes } = await get(path);
  assert.equal(response.status, 404, path); headers(response);
  assert.match(bytes.toString(), /Gridsmith/);
  receipt.checks.push({ path, status: 404 });
}
if (localProduction) {
  for (const path of ['/induced-500']) {
    for (const method of ['GET', 'HEAD']) {
      const { response, bytes } = await get(path, { method });
      assert.equal(response.status, 500); assert.equal(response.headers.get('location'), null); headers(response);
      if (method === 'GET') assert.equal(createHash('sha256').update(bytes).digest('hex'), local.files.find(f => f.path === '500.html').sha256);
      else assert.equal(bytes.length, 0);
      receipt.checks.push({ path, method, status: 500, staticDocument: '500.html' });
    }
  }
  for (const [from, to] of [['/privacy-policy/', '/legal/privacy'], ['/terms-and-conditions/', '/legal/client-terms']]) {
    const { response } = await get(from); assert.equal(response.status, 308);
    assert.equal(new URL(response.headers.get('location'), origin).pathname, to);
    receipt.checks.push({ path: from, status: 308, destination: to });
  }
}
for (const path of ['/.htaccess', '/.git/config']) {
  const { response } = await get(path); assert([403, 404].includes(response.status), path);
  receipt.checks.push({ path, status: response.status });
}
const redirect = await get('/about/');
assert.equal(redirect.response.status, 308);
assert.equal(new URL(redirect.response.headers.get('location'), origin).href, origin + '/about');
receipt.checks.push({ path: '/about/', status: 308, destination: '/about', singleHop: true });
const encoded = await get('/', { headers: { 'Accept-Encoding': 'gzip, br' } });
assert.match(encoded.response.headers.get('content-encoding') ?? '', /gzip|br/);
receipt.compression = encoded.response.headers.get('content-encoding');
writeFileSync(localProduction ? 'build/gs-launch-007/local-http-receipt.json' : 'build/h4d-hosted-http-receipt.json', JSON.stringify({ ...receipt, localOnly: localProduction }, null, 2) + '\n');
console.log(`Hostinger HTTP PASS: exact identity; ${receipt.files.length} public file hashes; ${receipt.routes.length} routes; headers/cache/MIME/compression; gated and branded 404; single-hop staging redirect.`);
