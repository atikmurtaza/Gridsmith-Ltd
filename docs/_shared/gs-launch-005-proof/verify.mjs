/** Owned loopback Apache proof. Never a hosted verifier or installation script. */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { request } from 'node:http';
import { createRequire } from 'node:module';
import { gzipSync } from 'node:zlib';
import { launch } from '../../../scripts/browser-launch.mjs';
import { readArtifact, inspectOperatorError } from '../../../scripts/check-static-artifact.mjs';

const root = 'build/gs-launch-005', base = 'http://127.0.0.1:3354';
mkdirSync(root, { recursive: true });
const sha = b => createHash('sha256').update(b).digest('hex');
const docker = (...args) => execFileSync('docker', args, { encoding: 'utf8', windowsHide: true });
assert.equal(docker('inspect', '--format', '{{index .Config.Labels "gridsmith.task"}}', 'gs-launch005-proof').trim(), 'GS-LAUNCH-005');
const shell = command => docker('exec', 'gs-launch005-proof', 'sh', '-c', command);
const operator = readArtifact('ops/hostinger-error');
assert.deepEqual(inspectOperatorError(operator), []);
const expected = operator.get('error.html');
const files = readArtifact('build/production-rehearsal');
const originalRules = files.get('.htaccess');
assert(originalRules.includes('Require all denied'));
const identity = JSON.parse(files.get('__deployment.json'));
assert.equal(identity.deployable, false); assert.equal(identity.rehearsal, true);
const evidence = { phase: 'GS-LAUNCH-005', at: new Date().toISOString(), localOnly: true,
  apache: shell('apache2 -v').trim(), operatorIdentity: JSON.parse(operator.get('identity.json')),
  artifact: { sourceSha: identity.sourceSha, sourceModified: identity.sourceModified,
    artifactIdentity: identity.artifactIdentity, deployable: identity.deployable, fileCount: files.size }, cases: [], browser: [] };
const get = async (label, path, status, options = {}, origin = base) => {
  const { response, bytes } = await new Promise((resolve, reject) => {
    const req = request(origin + path, { method: options.method, headers: options.headers }, response => {
      const chunks = []; response.on('data', b => chunks.push(b)); response.on('error', reject);
      response.on('end', () => resolve({ response, bytes: Buffer.concat(chunks) }));
    });
    req.setTimeout(10000, () => req.destroy(new Error('Local HTTP proof timed out')));
    req.on('error', reject); req.end(options.body);
  });
  assert.equal(response.statusCode, status, label);
  const record = { label, path, method: options.method ?? 'GET', status: response.statusCode,
    headers: response.headers, bytes: bytes.length, sha256: sha(bytes) };
  evidence.cases.push(record);
  if (status >= 500) writeFileSync(`${root}/${label}.html.gz`, gzipSync(bytes));
  return { bytes, record };
};
const error = async (label, path = '/induced-500') => {
  const { bytes, record } = await get(label, path, 500);
  assert.deepEqual(bytes, expected);
  assert.equal(record.headers['cache-control'], 'no-store, max-age=0');
  assert.equal(record.headers['content-security-policy'], evidence.operatorIdentity.policy.contentSecurityPolicy);
  for (const [name, value] of Object.entries({ 'x-content-type-options': 'nosniff', 'x-frame-options': 'DENY',
    'referrer-policy': 'no-referrer', 'x-robots-tag': 'noindex, nofollow, noarchive',
    'permissions-policy': 'camera=(), geolocation=(), microphone=(), payment=(), usb=(), browsing-topics=()',
    'strict-transport-security': 'max-age=31536000' })) assert.equal(record.headers[name], value);
  assert(!record.headers.location); assert(!record.headers['set-cookie']);
};
try {
  await error('static-500');
  const head = await get('head-500', '/induced-500', 500, { method: 'HEAD' }); assert.equal(head.bytes.length, 0);
  assert.equal(head.record.headers['cache-control'], 'no-store, max-age=0');
  // Synthetic POST goes only to this local RewriteRule; it cannot reach intake or a worker.
  const post = await get('post-no-replay', '/induced-500', 500, { method: 'POST', body: 'synthetic=1' });
  assert.deepEqual(post.bytes, expected); assert(!post.record.headers.location);
  assert.equal(post.record.headers['cache-control'], 'no-store, max-age=0');
  for (const status of [502, 503, 504]) {
    const result = await get(`unmapped-${status}`, `/induced-${status}`, status);
    assert.notDeepEqual(result.bytes, expected); // Outer/provider templates are a different unresolved subject.
  }
  await get('rehearsal-still-denied', '/', 403, {}, 'http://127.0.0.1:3355');
  for (const [path, bytes] of files) {
    if (path === '.htaccess') continue;
    const result = await get(`file-${evidence.cases.length}`, '/' + path.split('/').map(encodeURIComponent).join('/'), 200);
    assert.deepEqual(result.bytes, bytes, path);
    assert.equal(result.record.headers['x-content-type-options'], 'nosniff');
    assert.equal(result.record.headers['x-frame-options'], 'DENY');
    assert.equal(result.record.headers['referrer-policy'], 'strict-origin-when-cross-origin');
    assert.match(result.record.headers['content-security-policy'], /frame-ancestors 'none'/);
    assert.equal(result.record.headers['strict-transport-security'], 'max-age=31536000');
    if (path.endsWith('.html')) assert.equal(result.record.headers['cache-control'], 'no-cache');
    if (path.endsWith('.js')) assert.match(result.record.headers['content-type'], /javascript/);
    if (path.endsWith('.css')) assert.match(result.record.headers['content-type'], /text\/css/);
    if (path.endsWith('.woff2')) assert.match(result.record.headers['content-type'], /(?:font\/woff2|application\/font-woff)/);
    if (/\.(?:svg|png|webp|glb)$/.test(path)) assert.match(result.record.headers['cache-control'], /no-transform/);
    if (/(?:[.-][a-f0-9]{8,}\.(?:js|css)|\/[a-f0-9]{8,}[^/]*\.woff2)$/.test(path)) assert.match(result.record.headers['cache-control'], /immutable/);
  }
  const manifest = JSON.parse(readFileSync('build/static-route-manifest.json'));
  for (const route of manifest.routes.filter(r => r.eligible)) {
    const name = route.path === '/' ? 'index.html' : route.path.slice(1) + '.html';
    assert.deepEqual((await get('route', route.path, 200)).bytes, files.get(name));
  }
  for (const path of ['/missing-gs-launch005', '/api/rls-drift', '/press/path-finder',
    ...manifest.routes.filter(r => !r.eligible && r.gate).map(r => r.path)]) {
    assert.deepEqual((await get('branded-404', path, 404)).bytes, files.get('404.html'));
  }
  for (const path of ['/index.php', '/folder/a.phtml', '/.htaccess', '/.env']) await get('security-denial', path, 403);
  await get('wrong-host', '/', 403, { headers: { Host: 'wrong.invalid' } });
  const slash = await get('slash-redirect', '/about/', 308);
  assert.equal(slash.record.headers.location, base + '/about');
  assert.equal((await get('legacy-redirect', '/privacy-policy/', 308)).record.headers.location, base + '/legal/privacy');
  const colocatedWorking = await get('colocated-working', '/induced-500', 500, {}, 'http://127.0.0.1:3356');
  assert.deepEqual(colocatedWorking.bytes, expected);
  // Sole mutation owner. Restore captured bytes, permissions and identity before browser work.
  const rules = Buffer.from(shell('cat /proof/site/.htaccess'));
  const fallback = Buffer.from(shell('cat /proof/fallback/error.html'));
  const colocated = shell('cat /proof/co-located/.htaccess');
  try {
    shell("printf 'InvalidGsLaunch005Directive\n' > /proof/site/.htaccess");
    await error('independent-broken-root', '/about');
    shell("printf 'InvalidGsLaunch005Directive\n' >> /proof/co-located/.htaccess");
    const broken = await get('colocated-broken-root', '/induced-500', 500, {}, 'http://127.0.0.1:3356');
    assert.notDeepEqual(broken.bytes, expected);
    shell('mv /proof/fallback/error.html /proof/fallback/held.html');
    const missing = await get('missing-independent-fallback', '/induced-500', 500);
    assert.notDeepEqual(missing.bytes, expected); assert(!missing.record.headers.location);
    shell('mv /proof/fallback/held.html /proof/fallback/error.html; chmod 000 /proof/fallback/error.html');
    const denied = await get('unreadable-independent-fallback', '/induced-500', 500);
    assert.notDeepEqual(denied.bytes, expected); assert(!denied.record.headers.location);
  } finally {
    execFileSync('docker', ['exec', '-i', 'gs-launch005-proof', 'sh', '-c', 'cat > /proof/fallback/error.html'], { input: fallback, windowsHide: true });
    shell('chmod 644 /proof/fallback/error.html');
    execFileSync('docker', ['exec', '-i', 'gs-launch005-proof', 'sh', '-c', 'cat > /proof/site/.htaccess'], { input: rules, windowsHide: true });
    execFileSync('docker', ['exec', '-i', 'gs-launch005-proof', 'sh', '-c', 'cat > /proof/co-located/.htaccess'], { input: colocated, windowsHide: true });
    assert.equal(sha(Buffer.from(shell('cat /proof/site/.htaccess'))), sha(rules));
    assert.equal(sha(Buffer.from(shell('cat /proof/fallback/error.html'))), sha(fallback));
    assert.equal(shell('stat -c %a /proof/fallback/error.html').trim(), '644');
  }
  await error('restored-500');
  assert.deepEqual((await get('restored-home', '/', 200)).bytes, files.get('index.html'));
  const browser = await launch();
  const require = createRequire(import.meta.url), axe = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  const semantics = page => page.evaluate(() => ({ lang: document.documentElement.lang, title: document.title,
    h1: document.querySelectorAll('h1').length, main: document.querySelectorAll('main').length,
    text: document.body.innerText, overflow: document.documentElement.scrollWidth > innerWidth }));
  try {
    for (const width of [320, 375, 768, 1440]) for (const js of [false, true]) {
      const page = await browser.newPage(), requests = [];
      page.on('request', r => requests.push({ url: r.url(), method: r.method(), type: r.resourceType() }));
      await page.setViewport({ width, height: 900 }); await page.setJavaScriptEnabled(js);
      await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
      assert.equal((await page.goto(base + '/induced-500', { waitUntil: 'networkidle0' })).status(), 500);
      const dom = await semantics(page);
      assert.equal(dom.lang, 'en-GB'); assert.equal(dom.title, 'Page unavailable — Gridsmith Ltd');
      assert.equal(dom.h1, 1); assert.equal(dom.main, 1); assert(!dom.overflow);
      assert.equal(requests.length, 1); assert.equal(requests[0].type, 'document');
      assert.equal((await page.cookies()).length, 0);
      const replay = await browser.newPage(); await replay.setViewport({ width, height: 900 });
      await replay.setContent(await page.content()); assert.deepEqual(await semantics(replay), dom);
      await replay.evaluate(axe);
      const audit = () => replay.evaluate(() => window.axe.run(document, { runOnly: { type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }));
      const result = await audit(); assert.equal(result.violations.length, 0); assert.equal(result.incomplete.length, 0);
      await replay.evaluate(() => document.documentElement.removeAttribute('lang'));
      const adverse = await audit(); assert(adverse.violations.some(v => v.id === 'html-has-lang'));
      writeFileSync(`${root}/axe-${width}-${js}.json.gz`, gzipSync(JSON.stringify({ result, adverse })));
      await replay.close();
      await page.keyboard.press('Tab');
      const focus = await page.evaluate(() => { const a = document.activeElement, r = a.getBoundingClientRect(), s = getComputedStyle(a);
        return { href: a.getAttribute('href'), visible: r.top >= 0 && r.bottom <= innerHeight && r.width > 0,
          outline: s.outlineStyle, outlineWidth: s.outlineWidth }; });
      assert.equal(focus.href, '/'); assert(focus.visible); assert.notEqual(focus.outline, 'none'); assert.notEqual(focus.outlineWidth, '0px');
      if (width === 375 && !js) await page.screenshot({ path: `${root}/error-no-js.png` });
      await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.keyboard.press('Enter')]);
      assert.equal(page.url(), base + '/');
      assert.equal(requests.filter(r => r.method !== 'GET').length, 0);
      const analyticsRequests = requests.filter(r => /(?:^|\.)(?:googletagmanager\.com|google-analytics\.com|posthog\.com)$/.test(new URL(r.url).hostname));
      assert.equal(analyticsRequests.length, 0);
      const reviewsPresent = await page.evaluate(() => Boolean(document.querySelector('[data-reviews-carousel], [data-review-key]')));
      assert.equal(reviewsPresent, false);
      evidence.browser.push({ width, javascript: js, reducedMotion: true, dom, focus,
        axeViolations: result.violations.length, axeIncompletes: result.incomplete.length, missingLanguageAdverse: true,
        keyboardRecovery: true, errorCookies: 0, analyticsRequests: analyticsRequests.length, reviewsPresent });
      await page.close();
    }
  } finally { await browser.close(); }
  // Original release bytes are never mutated by the simulator or adverse controls.
  const after = readArtifact('build/production-rehearsal'); assert.equal(after.size, files.size);
  for (const [path, bytes] of files) assert.deepEqual(after.get(path), bytes, path);
  evidence.result = 'PASS_LOCAL_SIMULATION_ONLY';
} finally {
  writeFileSync(`${root}/simulation.json`, JSON.stringify(evidence, null, 2) + '\n');
}
console.log(`GS-LAUNCH-005 local simulation PASS: ${evidence.cases.length} HTTP cases; ${evidence.browser.length} browser cases. Hostinger UNVERIFIED.`);
