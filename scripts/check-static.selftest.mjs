/** Permanent H4-A positive and adversarial subjects; no app source mutation/network. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createStaticManifest, createLegalPreviewManifest, sitemapPaths, NOINDEX_PATHS } from '../lib/build/route-manifest.ts';
import { resolveBuildTarget } from '../lib/build/target.ts';
import { inspectStaticArtifact, inspectOperatorError, readArtifact } from './check-static-artifact.mjs';

const publication = JSON.parse(readFileSync('docs/_shared/GS-PROD-001-CMS-MANIFEST.json', 'utf8')).entries;
const documents = publication.filter((entry) => entry.eligible).map((entry) => ({
  _id: entry.id, _type: entry.type, _rev: 'specimen', slug: entry.slug,
  ...(entry.division ? { division: entry.division } : {}),
  ...(entry.type === 'service' ? { published: true } : {}), isSeed: false,
}));
let proofs = 0;
assert.equal(resolveBuildTarget(undefined), 'normal');
assert.equal(resolveBuildTarget('normal'), 'normal');
assert.equal(resolveBuildTarget('static'), 'static');
for (const value of ['', 'production', 'STATIC', ' static ', 'unexpected']) {
  assert.throws(() => resolveBuildTarget(value), /must be normal or static/); proofs++;
}
const manifest = createStaticManifest(documents, publication);
assert.equal(manifest.indexable, false);
assert.equal(manifest.routes.filter((route) => route.eligible && route.contentType === 'service').length, 44);
assert(!sitemapPaths(manifest).includes('/press/contact/thank-you'));
assert(!sitemapPaths(manifest).includes('/press/path-finder'));
assert(manifest.routes.filter((route) => route.gate).every((route) => !route.eligible));

const rejectContent = (change, message) => {
  const subjects = structuredClone(documents), inventory = structuredClone(publication);
  change(subjects, inventory);
  assert.throws(() => createStaticManifest(subjects, inventory), message); proofs++;
};
rejectContent((docs) => docs.push(docs[0]), /Duplicate CMS/);
rejectContent((docs) => { docs[0]._id = 'drafts.subject'; }, /Draft/);
rejectContent((docs) => { docs[0].isSeed = true; }, /Seed/);
rejectContent((docs) => { docs[0]._id = 'seed-subject'; }, /Seed/);
rejectContent((docs) => { docs[0]._rev = ''; }, /revision/);
rejectContent((docs) => docs.push({ _id: 'unreviewed', _type: 'service', _rev: 'specimen', published: true }), /outside/);
for (const entry of publication.filter((item) => item.type === 'service' && !item.eligible)) {
  rejectContent((docs) => docs.push({ _id: entry.id, _type: 'service', _rev: 'specimen',
    slug: entry.slug, division: entry.division, published: true }), /Gated service/);
}
const service = documents.findIndex((doc) => doc._type === 'service');
rejectContent((docs) => docs.splice(service, 1), /Required authorised/);
rejectContent((docs) => { docs[service]._type = 'post'; }, /Required authorised/);
rejectContent((docs) => { docs[service].slug = 'wrong-slug'; }, /Required authorised/);
rejectContent((docs) => { docs[service].division = 'unknown'; }, /Required authorised/);
rejectContent((docs) => { docs[service].published = false; }, /Required authorised/);
rejectContent((docs, inventory) => { inventory.find((item) => item.type === 'legalDocument').slug = '../escape'; }, /Invalid reviewed/);
rejectContent((docs) => docs.push({ _id: 'post-subject', _type: 'post', _rev: 'specimen', status: 'published', slug: '../escape' }), /Invalid published/);
rejectContent((docs) => docs.push(...['one', 'two'].map((id) => ({ _id: id, _type: 'post', _rev: 'specimen', status: 'published', slug: 'same-slug' }))), /Duplicate static/);
const article = createStaticManifest([...documents, { _id: 'post-subject', _type: 'post', _rev: 'specimen', status: 'published', slug: 'article-subject' }], publication);
assert(sitemapPaths(article).includes('/insights/article-subject'));
assert(!createStaticManifest([...documents, { _id: 'brief-subject', _type: 'post', _rev: 'specimen', status: 'brief', slug: 'brief-subject' }], publication).routes.some((route) => route.slug === 'brief-subject'));

const fixture = new Map();
const set = (files, name, value) => files.set(name, Buffer.from(value));
for (const route of manifest.routes.filter((item) => item.eligible)) {
  const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`;
  const form = ['/contact', '/press/contact'].includes(route.path) ? `<form data-edge-form="${route.path === '/contact' ? 'contact' : 'press'}"><noscript>JavaScript is required <a href="mailto:synthetic@example.invalid">Email</a></noscript></form>` : '';
  set(fixture, file, `<html lang="en"><head><title>Specimen</title><meta name="description" content="Specimen"><meta name="robots" content="noindex, nofollow"><link rel="canonical" href="http://localhost:3236${route.path === '/' ? '' : route.path}"></head><body><h1>${route.path === '/press/contact/thank-you' ? 'That has reached us' : 'Specimen'}</h1><script type="application/ld+json">{}</script>${form}<script src="/_next/static/specimen.js"></script></body></html>`);
}
set(fixture, '404.html', '<html><head><meta name="robots" content="noindex"></head><body><h1>Gridsmith — page not found</h1></body></html>');
set(fixture, '_next/static/specimen.js', '/* inert client specimen */');
set(fixture, 'robots.txt', 'User-Agent: *\nDisallow: /\n');
set(fixture, 'sitemap.xml', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
const inspect = (files = fixture, input = manifest, secrets = []) => inspectStaticArtifact(files, input, publication, secrets);
assert.deepEqual(inspect().problems, []);
const breakArtifact = (name, mutate, code, secrets = []) => {
  const files = new Map(fixture), input = structuredClone(manifest);
  mutate(files, input);
  const result = inspect(files, input, secrets);
  assert(result.problems.some((problem) => problem.startsWith(`${code}:`)), `${name}: ${code} did not fire`);
  proofs++;
};
const editHome = (files, before, after) => set(files, 'index.html', files.get('index.html').toString().replace(before, after));
breakArtifact('profile', (files, input) => { input.indexable = true; }, 'PROFILE');
breakArtifact('fixed expectation', (files, input) => { input.routes = input.routes.filter((route) => route.path !== '/about'); }, 'MANIFEST');
breakArtifact('publication expectation', (files, input) => { input.routes.find((route) => route.gate).eligible = true; }, 'PUBLICATION');
breakArtifact('missing service expectation', (files, input) => { input.routes = input.routes.filter((route) => route.contentType !== 'service'); }, 'PUBLICATION');
for (const entry of publication.filter((item) => !item.eligible && ['service', 'legalDocument'].includes(item.type))) {
  const path = entry.type === 'service' ? `${entry.division}/services/${entry.slug}.html` : `legal/${entry.slug}.html`;
  breakArtifact('each gated route', (files) => set(files, path, '<h1>Specimen</h1>'), 'GATED');
  for (const extension of ['txt', 'json', 'rsc']) breakArtifact('each gated sidecar',
    (files) => set(files, path.replace(/html$/, extension), 'private gated specimen'), 'GATED');
}
breakArtifact('route', (files) => files.delete('about.html'), 'ROUTE');
for (const [before, after] of [['<h1>', '<span>'], ['<title>Specimen</title>', ''], ['name="description"', 'name="other"'], ['http://localhost:3236', 'https://example.invalid']]) {
  breakArtifact('each SEO branch', (files) => editHome(files, before, after), 'SEO');
}
breakArtifact('noindex', (files) => editHome(files, 'noindex, nofollow', 'index, follow'), 'NOINDEX');
breakArtifact('structured', (files) => editHome(files, 'application/ld+json', 'text/plain'), 'STRUCTURED');
for (const name of ['contact.html', 'press/contact.html']) {
  for (const [before, after] of [['data-edge-form', 'data-other'], ['<form ', '<form action="/submit" '],
    ['JavaScript is required', 'Other'], ['mailto:', 'other:']]) breakArtifact('each functional form predicate',
    (files) => set(files, name, fixture.get(name).toString().replace(before, after)), 'FORM');
  breakArtifact('old form shell', (files) => set(files, name, fixture.get(name) + '<aside data-static-contact-shell></aside>'), 'FORM');
}
breakArtifact('missing confirmation', (files) => set(files, 'press/contact/thank-you.html', fixture.get('press/contact/thank-you.html').toString().replace('That has reached us', 'Other')), 'FORM');
breakArtifact('old confirmation shell', (files) => set(files, 'press/contact/thank-you.html', fixture.get('press/contact/thank-you.html') + '<aside data-static-contact-shell></aside>'), 'FORM');
for (const marker of ['$ACTION_ID_specimen', 'Next-Action', 'createServerReference(']) breakArtifact('each Server Action transport marker',
  (files) => set(files, '_next/static/specimen.js', marker), 'ACTION');
breakArtifact('404', (files) => files.delete('404.html'), '404');
breakArtifact('404 brand', (files) => set(files, '404.html', '<h1>Other</h1>noindex'), '404');
breakArtifact('robots', (files) => set(files, 'robots.txt', 'User-Agent: *\nAllow: /\n'), 'ROBOTS');
breakArtifact('robots missing', (files) => files.delete('robots.txt'), 'ROBOTS');
for (const text of ['synthetic \n', 'synthetic\t\r\n', 'synthetic\n\n']) {
  breakArtifact('each publication whitespace branch', files => set(files, 'data.txt', text), 'WHITESPACE');
}
breakArtifact('sitemap loc', (files) => set(files, 'sitemap.xml', '<urlset><url><loc>https://example.invalid/legal/privacy</loc></url></urlset>'), 'SITEMAP');
breakArtifact('sitemap missing', (files) => files.delete('sitemap.xml'), 'SITEMAP');
breakArtifact('extra HTML', (files) => set(files, 'unexpected.html', '<h1>Specimen</h1>'), 'EXTRA');
for (const name of ['api/specimen.json', 'gridsmith-lead-probe.html', '_kitchen-sink.html', '.env', 'package.json', '.next/server/index.js', 'node_modules/index.js']) {
  breakArtifact('each runtime path', (files) => set(files, name, '{}'), 'RUNTIME');
}
for (const marker of ['22108992', '22100632', 'Varnika']) breakArtifact('each withheld marker', (files) => set(files, 'data.txt', marker), 'WITHHELD');
for (const marker of ['SUPABASE_SERVICE_ROLE_KEY', 'GRIDSMITH_WORKER_TOKEN', 'RESEND_API_KEY', 'SANITY_API_WRITE_TOKEN', 'DIRECT_CONNECTION_STRING', 'VERCEL_TOKEN', 'FREELANCER_API_TOKEN', 'FREELANCER_API_SECRET', 'Freelancer-OAuth-V1', '-----BEGIN PRIVATE KEY-----', 'postgresql://specimen', 're_' + 'a'.repeat(24), 'sb_secret_' + 'a'.repeat(24)]) {
  breakArtifact('each secret marker', (files) => set(files, 'data.txt', marker), 'SECRET');
}
const jwt = (role) => 'eyJhbGciOiJIUzI1NiJ9.' + Buffer.from(JSON.stringify({ role })).toString('base64url') + '.specimen';
breakArtifact('privileged JWT', (files) => set(files, 'data.txt', jwt('service_role')), 'SECRET');
breakArtifact('binary exact value', (files) => set(files, 'asset.bin', 'local-test-sentinel'), 'SECRET', ['local-test-sentinel']);
const publicConfig = new Map(fixture);
set(publicConfig, 'public.txt', jwt('anon') + '\nhttps://example.supabase.co\nsb_publishable_specimen\nproduction');
assert.deepEqual(inspect(publicConfig).problems, []);
breakArtifact('runtime image', (files) => set(files, 'image.svg', '<image href="/_next/image?url=specimen"/>'), 'IMAGE');
for (const [file, content] of [['asset.css', 'body{background:url(/brand/missing.png)}'], ['asset.svg', '<image href="/brand/missing.png"/>']]) breakArtifact('asset branches', (files) => set(files, file, content), 'ASSET');
for (const content of ['<img src="/assets/missing.png">', '<img srcset="/brand/missing.png 1x">',
  '<link rel="manifest" href="/manifest.webmanifest">', '<link rel="stylesheet" href="missing.css">',
  '<video poster="/assets/missing.png"></video>', '<svg><use href="/assets/missing.svg#mark"/></svg>']) {
  breakArtifact('resource predicates', (files) => set(files, 'index.html', fixture.get('index.html') + content), 'ASSET');
}
breakArtifact('zero files', (files) => files.clear(), 'COUNT');
breakArtifact('zero JS', (files) => files.delete('_next/static/specimen.js'), 'CHUNKS');
breakArtifact('missing internal destination', (files) => set(files, 'index.html', fixture.get('index.html') + '<a href="/missing">Specimen</a>'), 'LINK');
breakArtifact('orphan internal fragment', (files) => set(files, 'index.html', fixture.get('index.html') + '<a href="/about#missing">Specimen</a>'), 'LINK');
for (const marker of ['ownerAdoptedSha256', 'adoptionAuthority', 'prerequisitesMet', 'ownerConfirmations']) {
  breakArtifact('internal legal register', (files) => set(files, 'private.json', marker), 'PRIVATE');
}
breakArtifact('CMS runtime transport', (files) => set(files, '_next/static/specimen.js', 'https://specimen.api.sanity.io/v2025-02-19/data/query/development'), 'CMS-RUNTIME');
const changedCount = new Map(fixture); changedCount.delete('about.html');
assert.equal(inspect(changedCount).fileCount, inspect().fileCount - 1);
assert.equal(inspect(changedCount).htmlRoutes, inspect().htmlRoutes - 1);
assert(inspect(changedCount).totalBytes < inspect().totalBytes);
console.log(`Static foundation selftest PASS: ${proofs} independent rejection proofs; positive/public-config/article/noindex subjects; file/route/byte counts moved.`);

const { hostingerRules, prepareHostingerText } = await import('../lib/build/hostinger.ts');
assert.equal(prepareHostingerText('index.html', '<blockquote><p>First\n \t\nLast</p></blockquote>'),
  '<blockquote><p>First\n&#32;&#9;\nLast</p></blockquote>');
assert.equal(prepareHostingerText('index.html', '<blockquote><p>First \r\nLast</p></blockquote>'),
  '<blockquote><p>First&#32;\r\nLast</p></blockquote>');
assert.equal(prepareHostingerText('robots.txt', 'User-Agent: *\nDisallow: /\n\n'), 'User-Agent: *\nDisallow: /\n');
assert.equal(prepareHostingerText('sheet.css', 'synthetic \n'), 'synthetic \n');
assert.equal(prepareHostingerText('index.html', '<pre>synthetic \n</pre>'), '<pre>synthetic \n</pre>');
const { REVIEW_STAGING_ORIGIN } = await import('../lib/reviews/public-model.ts');
assert.throws(() => hostingerRules('https://gridsmith.uk'), /Exact isolated/);
const hosting = hostingerRules(REVIEW_STAGING_ORIGIN);
assert(hosting.includes('noindex, nofollow, noarchive'));
assert(hosting.includes('R=404'));
assert(hosting.includes('max-age=31536000, immutable'));
assert(hosting.includes('Cache-Control \"no-cache\"'));
const preservesAssetBytes = rules => rules.includes('max-age=300, must-revalidate, no-transform');
assert(preservesAssetBytes(hosting));
assert.equal(preservesAssetBytes(hosting.replace(', no-transform', '')), false,
  'Image transformation opt-out must remain in the short asset cache policy');
const immutablePattern = hosting.match(/<FilesMatch "([^"]+)">\nHeader always set Cache-Control "public, max-age=31536000, immutable"/)?.[1];
assert(immutablePattern, 'Immutable asset rule must exist');
const immutable = new RegExp(immutablePattern);
for (const name of ['0123456789abcdef.css', '0123456789abcdef.js', 'chunk-0123456789abcdef.js',
  'chunk.0123456789abcdef.js', '0123456789abcdef-s.woff2']) {
  assert(immutable.test(name), `Immutable rule misses hashed asset ${name}`);
}
for (const name of ['theme.css', 'main.js', 'scene.glb', 'logo.svg', 'regular.woff2', 'index.html']) {
  assert(!immutable.test(name), `Unversioned asset made immutable: ${name}`);
}
const siblingRouteAllowed = (rules) => !rules.includes('RewriteCond %{REQUEST_FILENAME} !-d\nRewriteCond %{REQUEST_FILENAME}.html -f');
assert(siblingRouteAllowed(hosting),
  'HTML sibling routes must not be blocked by their existing asset/service directory');
assert.equal(siblingRouteAllowed(hosting.replace('RewriteCond %{REQUEST_FILENAME}.html -f',
  'RewriteCond %{REQUEST_FILENAME} !-d\nRewriteCond %{REQUEST_FILENAME}.html -f')), false,
  'Injected directory exclusion must fail the sibling-route predicate');
console.log('Hostinger hash/cache predicates: 5 hashed and 6 unversioned names; sibling-route positive/adverse predicates PASS.');
console.log('Hostinger static config subject: exact-origin production rejection, noindex, gated 404 and explicit cache policies. Served behaviour remains a hosted gate.');

// R12: private preview has separate identities; all production exclusion proofs above still run.
const { legalPreviewProfile, legalPreviewProblems, servedLegalPreview } = await import('./legal-preview-rules.mjs');
const { LEGAL_DOCUMENTS } = await import('./seed-legal.mjs');
const register = JSON.parse(readFileSync('docs/_legal/evidence/GS-O003-R-REGISTER.json'));
assert.equal(legalPreviewProfile(undefined, 'production', REVIEW_STAGING_ORIGIN), false);
assert(legalPreviewProfile('adopted-development', 'development', 'http://localhost:3236'));
let previewProofs = 0;
assert(servedLegalPreview({ legalPreview: true, dataset: 'development' }, true));
assert.equal(servedLegalPreview({ legalPreview: false, dataset: 'production' }), false);
for (const [identity, required] of [[null, false], [null, true], [{ legalPreview: false }, true],
  [{ legalPreview: true, dataset: 'production' }, true], [{ legalPreview: true, dataset: 'production' }, false]]) {
  assert.throws(() => servedLegalPreview(identity, required), /must identify|R12 requires/); previewProofs++;
}
for (const [value, dataset, origin] of [
  ['adopted-development', 'production', REVIEW_STAGING_ORIGIN],
  ['adopted-development', 'development', REVIEW_STAGING_ORIGIN],
  ['adopted-development', 'development', 'https://gridsmith.uk'],
  ['adopted-development', 'development', 'https://unapproved.example.invalid'],
  ['adopted-development', 'development', REVIEW_STAGING_ORIGIN + '/'],
  ['true', 'development', REVIEW_STAGING_ORIGIN],
]) { assert.throws(() => legalPreviewProfile(value, dataset, origin), /Legal preview requires/); previewProofs++; }
const parity = (actual = LEGAL_DOCUMENTS, expected = LEGAL_DOCUMENTS, input = register,
  read = (path) => readFileSync(path)) => legalPreviewProblems(actual, expected, input, read);
assert.deepEqual(parity(), []);
for (const [change, message] of [
  [(docs) => docs.pop(), /seven|missing/],
  [(docs) => docs.push(docs[0]), /seven|duplicate/],
  [(docs) => { docs[0].clauses[0].body[0].children[0].text += ' unapproved text'; }, /content mismatch/],
  [(docs) => { docs[0].version = '0.0'; }, /content mismatch/],
  [(docs) => { docs[0].adoptionState = 'PUBLISHABLE'; }, /content mismatch/],
]) {
  const docs = structuredClone(LEGAL_DOCUMENTS); change(docs);
  assert(parity(docs).some((problem) => message.test(problem))); previewProofs++;
}
const unadopted = structuredClone(register); unadopted.documents.privacy.state = 'OWNER_REVIEW_REQUIRED';
assert(parity(LEGAL_DOCUMENTS, LEGAL_DOCUMENTS, unadopted).some((p) => /not owner-adopted/.test(p))); previewProofs++;
assert(parity(LEGAL_DOCUMENTS, LEGAL_DOCUMENTS, register, () => Buffer.from('fingerprint specimen')).some((p) => /fingerprint mismatch/.test(p))); previewProofs++;
const devDocs = [...documents.map((doc) => ({ ...doc, _id: doc._id === 'companyDetails' ? doc._id : `seed-${doc._id}`, isSeed: true })),
  ...LEGAL_DOCUMENTS.map((doc) => ({ _id: doc._id, _type: doc._type, _rev: 'specimen', slug: doc.slug.current, isSeed: true }))];
const privateManifest = createLegalPreviewManifest(devDocs, publication);
assert.equal(privateManifest.dataset, 'development');
assert.equal(privateManifest.routes.filter((r) => r.eligible && r.contentType === 'legalDocument').length, 7);
assert.equal(manifest.routes.filter((r) => r.eligible && r.contentType === 'legalDocument').length, 0);
const privateFiles = new Map(fixture);
for (const route of privateManifest.routes.filter((r) => r.contentType === 'legalDocument')) {
  set(privateFiles, `${route.path.slice(1)}.html`, fixture.get('about.html').toString()
    .replace('http://localhost:3236/about', `http://localhost:3236${route.path}`) + '<p>ADOPTED, NOT YET PUBLISHED.</p>');
}
assert.deepEqual(inspectStaticArtifact(privateFiles, privateManifest, publication).problems, []);
assert(inspectStaticArtifact(privateFiles, manifest, publication).problems.some((p) => p.startsWith('GATED:'))); previewProofs++;
for (const change of [
  (m) => { m.dataset = 'production'; },
  (m) => { delete m.legalPreview; },
  (m) => { m.routes = m.routes.filter((r) => r.path !== '/legal/privacy'); },
]) {
  const input = structuredClone(privateManifest); change(input);
  assert(inspectStaticArtifact(privateFiles, input, publication).problems.length > 0); previewProofs++;
}
const noNotice = new Map(privateFiles);
set(noNotice, 'legal/privacy.html', noNotice.get('legal/privacy.html').toString().replace('ADOPTED, NOT YET PUBLISHED.', ''));
assert(inspectStaticArtifact(noNotice, privateManifest, publication).problems.some((p) => p.startsWith('LEGAL:'))); previewProofs++;
console.log(`R12 legal preview PASS: exact seven-document parity; ${previewProofs} adverse proofs; production still emits zero legal routes.`);

// GS-LAUNCH-001: a partial ordinary publication inventory must not export legal pages.
const legalPublication = publication.map((entry) => entry.type === 'legalDocument' ? { ...entry, eligible: true, gate: null } : entry);
const legalDocuments = legalPublication.filter((entry) => entry.eligible).map((entry) => ({
  _id: entry.id, _type: entry.type, _rev: 'atomic-specimen', slug: entry.slug,
  ...(entry.division ? { division: entry.division } : {}),
  ...(entry.type === 'service' ? { published: true } : {}), isSeed: false,
}));
assert.equal(createStaticManifest(legalDocuments, legalPublication).routes.filter((route) => route.eligible && route.contentType === 'legalDocument').length, 7);
for (let count = 1; count < 7; count++) {
  let seen = 0;
  const partial = legalPublication.map((entry) => entry.type === 'legalDocument' ? { ...entry, eligible: seen++ < count } : entry);
  assert.throws(() => createStaticManifest(legalDocuments, partial), /all seven canonical/);
}
const wrongLegal = legalPublication.map((entry) => entry.type === 'legalDocument' && entry.slug === 'privacy' ? { ...entry, slug: 'wrong-slug' } : entry);
assert.throws(() => createStaticManifest(legalDocuments, wrongLegal), /all seven canonical/);
const { listPublicReviews } = await import('../lib/reviews/source.ts');
assert.deepEqual(listPublicReviews(), []);
const { artifactNoReviewProblems } = await import('./review-public-rules.mjs');
assert.deepEqual(artifactNoReviewProblems(new Map([['index.html', Buffer.from('<h1>Gridsmith</h1>')]])), []);
assert(artifactNoReviewProblems(new Map([['index.html', Buffer.from('<div data-reviews-carousel>probe</div>')]])).some((problem) => problem.startsWith('REVIEWS_PRESENT')));
console.log('GS-LAUNCH-001: all-seven publication positive/partial/wrong-slug and review suppression proofs PASS.');

const allLegalManifest = createStaticManifest(legalDocuments, legalPublication);
const allLegalFixture = new Map(fixture);
for (const route of allLegalManifest.routes.filter((item) => item.contentType === 'legalDocument')) {
  allLegalFixture.set(route.path.slice(1) + '.html', Buffer.from(fixture.get('about.html').toString().replaceAll('/about', route.path)));
}
assert.deepEqual(inspectStaticArtifact(allLegalFixture, allLegalManifest, legalPublication).problems, []);
const partialArtifactManifest = structuredClone(allLegalManifest);
for (const route of partialArtifactManifest.routes.filter((item) => item.contentType === 'legalDocument' && item.slug !== 'privacy')) route.eligible = false;
assert(inspectStaticArtifact(allLegalFixture, partialArtifactManifest, legalPublication).problems.includes('LEGAL: legal output must include all seven canonical documents together'));
const { APPROVED_STAGING_REVIEWS } = await import('../lib/reviews/staging-approved.ts');
for (const path of ['index.html', 'payload.txt', 'api/reviews.json', '_next/static/chunks/data.js']) {
  assert(artifactNoReviewProblems(new Map([[path, Buffer.from(APPROVED_STAGING_REVIEWS[0].reviewText)]])).some((problem) => problem.startsWith('REVIEW_TEXT:')), path);
}
console.log('GS-LAUNCH-001: ordinary all-seven artifact control and partial-artifact rejection; four review-leak transports PASS.');

// GS-R12-PR-001 SEC-F6: next.config headers() do not apply to the static export, so the
// .htaccess is the only delivered security-header policy. Assert it offline, branch by branch.
const REQUIRED_HEADERS = { 'X-Content-Type-Options': /^nosniff$/, 'X-Frame-Options': /^DENY$/,
  'Referrer-Policy': /^strict-origin-when-cross-origin$/, 'Permissions-Policy': /camera=\(\).*geolocation=\(\).*microphone=\(\)/,
  // Numeric, not digit-shaped: at least one year (31536000 s); a zero-padded zero must not pass.
  'Strict-Transport-Security': { test: (v) => { const m = /^max-age=(\d+)(?:;|$)/.exec(v); return Boolean(m) && Number(m[1]) >= 31536000; } } };
const REQUIRED_CSP = ["default-src 'self'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'", "object-src 'none'"];
const headerProblems = (rules) => {
  const set = Object.fromEntries([...rules.matchAll(/^Header always set ([\w-]+) "([^"]*)"$/gm)].map(m => [m[1], m[2]]));
  const problems = Object.entries(REQUIRED_HEADERS).filter(([name, value]) => !value.test(set[name] ?? '')).map(([name]) => name);
  const csp = (set['Content-Security-Policy'] ?? '').split(';').map(d => d.trim());
  return [...problems, ...REQUIRED_CSP.filter(d => !csp.includes(d)).map(d => `CSP ${d}`)];
};
assert.deepEqual(headerProblems(hosting), []);
for (const [mutation, expected] of [[r => r.replace(/^Header always set Content-Security-Policy .*$/m, ''), "CSP frame-ancestors 'none'"],
  [r => r.replace("frame-ancestors 'none'; ", ''), "CSP frame-ancestors 'none'"], [r => r.replace("object-src 'none'; ", ''), "CSP object-src 'none'"],
  [r => r.replace(/^Header always set Strict-Transport-Security .*$/m, ''), 'Strict-Transport-Security'],
  [r => r.replace('max-age=31536000"', 'max-age=300"'), 'Strict-Transport-Security'],
  [r => r.replace('max-age=31536000"', 'max-age=000000000"'), 'Strict-Transport-Security'],
  [r => r.replace('"nosniff"', '"sniff"'), 'X-Content-Type-Options'], [r => r.replace('"DENY"', '"SAMEORIGIN"'), 'X-Frame-Options'],
  [r => r.replace(/^Header always set Referrer-Policy .*$/m, ''), 'Referrer-Policy'],
  [r => r.replace('microphone=(), ', ''), 'Permissions-Policy']]) {
  assert(headerProblems(mutation(hosting)).includes(expected), `Header mutation not caught: ${expected}`);
}
for (const longer of ['31556952', '31622400', '63072000']) {
  assert.deepEqual(headerProblems(hosting.replace('max-age=31536000"', `max-age=${longer}"`)), [], `HSTS ${longer} s is at least a year`);
}
console.log(`Hostinger security headers: ${Object.keys(REQUIRED_HEADERS).length} headers and ${REQUIRED_CSP.length} CSP directives asserted; 10 mutation proofs red, 3 longer HSTS values accepted.`);
console.log('Hostinger hash/cache predicates: 5 hashed and 6 unversioned names; sibling-route positive/adverse predicates PASS.');
console.log('Hostinger static config subject: exact-origin production rejection, noindex, gated 404 and explicit cache policies. Served behaviour remains a hosted gate.');


// GS-R13-PRODUCTION-PROFILE-001: the gridsmith.uk profile. Every reading below is a returned value,
// so a probe cannot be inert; each adverse case names the code it must produce.
const { createHash } = await import('node:crypto');
const { PRODUCTION_ORIGIN, PREVIEW_INTAKE_URL, productionInputProblems } = await import('../lib/build/production.ts');
const { productionHostingerRules } = await import('../lib/build/hostinger.ts');
const sha = (text) => createHash('sha256').update(text).digest('hex');
let productionProofs = 0;
const codes = (problems) => problems.map((problem) => problem.split(':')[0]);
// Staging delivery is byte-identical to its accepted pre-GS-R13 policy.
assert.equal(sha(hostingerRules(REVIEW_STAGING_ORIGIN)), '5f35938fdfa3ee6ddd714ab38afb8c29f91c6e73c6f83e8580b82f34d3bdd1a1');
assert.equal(sha(hostingerRules(REVIEW_STAGING_ORIGIN, 'development')), '0cbdf3c59729aff50209a899692288021774f5f1e438a312866fc50b6d509a23');
// GS-R14: the temporary domain against the recorded Production intake differs only in connect-src.
{
  const { PRODUCTION_INTAKE_URL } = await import('../lib/build/production.ts');
  const productionIntake = new URL(PRODUCTION_INTAKE_URL).origin, previewIntake = new URL(PREVIEW_INTAKE_URL).origin;
  const temporary = hostingerRules(REVIEW_STAGING_ORIGIN, 'production', productionIntake);
  assert.equal(temporary, hostingerRules(REVIEW_STAGING_ORIGIN).replace(`connect-src 'self' ${previewIntake};`, `connect-src 'self' ${productionIntake};`));
  assert(temporary.includes(`connect-src 'self' ${productionIntake};`) && !temporary.includes(previewIntake) && /X-Robots-Tag "noindex/.test(temporary));
  for (const origin of ['https://abcdefghijklmnopqrst.supabase.co', PRODUCTION_INTAKE_URL, 'https://example.invalid', productionIntake.replace('https:', 'http:')]) {
    assert.throws(() => hostingerRules(REVIEW_STAGING_ORIGIN, 'production', origin), /Preview or recorded Production intake/, origin);
  }
}

// Inputs. Today's repository state must refuse; a fully supplied specimen must not.
assert(productionInputProblems(PREVIEW_INTAKE_URL, publication, register).length > 0, 'Profile must refuse today');
const intake = 'https://abcdefghijklmnopqrst.supabase.co/functions/v1/gs-lead-intake';
const readyRegister = structuredClone(register);
// This synthetic positive control models future form-mode adoption, independently of today's direct mode.
readyRegister.documents.privacy.contactMode = 'edge';
readyRegister.documents.privacy.publicationPrerequisites = readyRegister.documents.privacy.publicationPrerequisites
  .map(item => item.id === 'DIRECT-CONTACT-VERIFIED' ? { ...item, id: 'H4-B-INTAKE-PROMOTED' } : item);
for (const slug of Object.keys(readyRegister.documents)) readyRegister.documents[slug].state = 'PUBLISHABLE';
const readyPublication = publication.map((entry) => entry.type === 'legalDocument'
  ? { ...entry, eligible: true, gate: null, reason: undefined } : entry);
const inputs = (url = intake, entries = readyPublication, input = readyRegister, expected = intake) =>
  productionInputProblems(url, entries, input, expected);
assert.deepEqual(inputs(), []);
const plainHttp = 'http://abcdefghijklmnopqrst.supabase.co/functions/v1/gs-lead-intake';
for (const [name, problems, code] of [
  ['no recorded intake', inputs(intake, readyPublication, readyRegister, null), 'INTAKE'],
  ['Preview recorded as production', inputs(PREVIEW_INTAKE_URL, readyPublication, readyRegister, PREVIEW_INTAKE_URL), 'INTAKE'],
  ['plain-HTTP recorded intake', inputs(plainHttp, readyPublication, readyRegister, plainHttp), 'INTAKE'],
  ['build intake differs', inputs(PREVIEW_INTAKE_URL), 'INTAKE'],
  // Called directly: `inputs(undefined)` would take the default and not be unset at all.
  ['build intake unset', productionInputProblems(undefined, readyPublication, readyRegister, intake), 'INTAKE'],
]) { assert.deepEqual(codes(problems), [code], name); productionProofs++; }
const adopted = structuredClone(readyRegister); adopted.documents.cookies.state = 'OWNER_ADOPTED';
assert.deepEqual(inputs(intake, readyPublication, adopted), ['LEGAL: cookies is not PUBLISHABLE (register OWNER_ADOPTED, migration eligible)']); productionProofs++;
const gatedEntry = readyPublication.map((entry) => entry.slug === 'terms' ? { ...entry, eligible: false } : entry);
assert.deepEqual(codes(inputs(intake, gatedEntry)), ['LEGAL']); productionProofs++;
assert.equal(inputs(undefined, publication, register, null).filter(p => /is not PUBLISHABLE/.test(p)).length, 7); productionProofs++;

// Rules. Positive policy, then each predicate is extracted from the rules and exercised.
const intakeOrigin = new URL(intake).origin;
const rules = productionHostingerRules(intakeOrigin);
assert.deepEqual(headerProblems(rules), []);
assert(!/noindex/i.test(rules) && !rules.includes('<IfModule mod_headers') && !rules.includes('qfgpwumvvtizeamkynes'));
assert(rules.includes(`connect-src 'self' ${intakeOrigin};`));
assert(rules.includes('RewriteRule ^privacy-policy/?$ /legal/privacy [R=308,L]'));
assert(rules.includes('RewriteRule ^terms-and-conditions/?$ /legal/client-terms [R=308,L]'));
const php = new RegExp(rules.match(/^RewriteRule (\S+) - \[F,L,NC\]$/m)[1], 'i');
for (const name of ['index.php', 'wp-login.php', 'wp-content/x.PHP', 'a.php7', 'b.phtml', 'c.phar', 'cgi-bin/x.cgi', 'index.php/extra']) {
  assert(php.test(name), `PHP denial misses ${name}`);
}
for (const name of ['php-guide.html', 'design/services/php', 'index.html', 'assets/phpstorm.svg']) {
  assert(!php.test(name), `PHP denial over-blocks ${name}`);
}
const lock = new RegExp(rules.match(/^RewriteCond %\{HTTP_HOST\} !(\S+) \[NC\]$/m)[1], 'i');
const www = new RegExp(rules.match(/^RewriteCond %\{HTTP_HOST\} (\^www\S+) \[NC\]$/m)[1], 'i');
assert(lock.test('gridsmith.uk') && lock.test('GRIDSMITH.UK'));
for (const host of ['www.gridsmith.uk', 'gridsmith.uk.example.invalid', 'evilgridsmith.uk', 'mediumaquamarine-wallaby-594070.hostingersite.com']) {
  assert(!lock.test(host), `Host lock admits ${host}`);
}
assert(www.test('www.gridsmith.uk') && !www.test('gridsmith.uk') && !www.test('www.gridsmith.uk.example.invalid'));
assert(rules.indexOf('^www\\.gridsmith') < rules.indexOf('!^gridsmith'), 'www must fold into the apex before the host lock');
for (const [origin, options, dataset] of [[new URL(PREVIEW_INTAKE_URL).origin, {}], [intakeOrigin, { rehearsal: true }],
  ['http://abcdefghijklmnopqrst.supabase.co', {}], [intake, {}], ['https://example.invalid', {}], [intakeOrigin, {}, 'development']]) {
  assert.throws(() => productionHostingerRules(origin, dataset ?? 'production', options), /Production rules require/); productionProofs++;
}
const rehearsalRules = productionHostingerRules(new URL(PREVIEW_INTAKE_URL).origin, 'production', { rehearsal: true });
assert(rehearsalRules.startsWith('# REHEARSAL') && /^Require all denied$/m.test(rehearsalRules));

// Artifact gate in production mode, over a fixture derived from the staging one.
const legalDocs = readyPublication.filter((entry) => entry.type === 'legalDocument')
  .map((entry) => ({ _id: entry.id, _type: 'legalDocument', _rev: 'specimen', slug: entry.slug, isSeed: false }));
const prodManifest = createStaticManifest([...documents, ...legalDocs], readyPublication, { indexable: true });
assert.equal(prodManifest.indexable, true);
assert.equal(prodManifest.routes.filter((route) => route.eligible && route.contentType === 'legalDocument').length, 7);
const prodFixture = new Map();
const keepsNoindex = new Set(prodManifest.routes.filter((route) => !route.sitemap).map((route) => `${route.path.slice(1)}.html`));
for (const [name, bytes] of fixture) {
  const text = bytes.toString().replaceAll('http://localhost:3236', PRODUCTION_ORIGIN);
  set(prodFixture, name, keepsNoindex.has(name) ? text : text.replace('noindex, nofollow', 'index, follow'));
}
for (const route of prodManifest.routes.filter((r) => r.contentType === 'legalDocument')) {
  set(prodFixture, `${route.path.slice(1)}.html`, prodFixture.get('about.html').toString()
    .replace(`${PRODUCTION_ORIGIN}/about`, `${PRODUCTION_ORIGIN}${route.path}`));
}
set(prodFixture, 'robots.txt', `User-Agent: *\nAllow: /\n\nSitemap: ${PRODUCTION_ORIGIN}/sitemap.xml\n`);
const sitemapXml = (paths) => '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
  paths.map((path) => `<url><loc>${new URL(path, PRODUCTION_ORIGIN)}</loc></url>`).join('') + '</urlset>';
set(prodFixture, 'sitemap.xml', sitemapXml(sitemapPaths(prodManifest)));
set(prodFixture, '.htaccess', rules);
set(prodFixture, '500.html', readFileSync('public/500.html'));
const inspectProd = (files = prodFixture, input = prodManifest, origin = PRODUCTION_ORIGIN) =>
  inspectStaticArtifact(files, input, readyPublication, [], origin).problems;
assert.deepEqual(inspectProd(), []);
assert(codes(inspectStaticArtifact(prodFixture, { ...prodManifest, indexable: false }, readyPublication).problems).includes('NOINDEX'));
const breakProd = (name, mutate, code) => {
  const files = new Map(prodFixture), input = structuredClone(prodManifest);
  const changedOrigin = mutate(files, input);
  const origin = typeof changedOrigin === 'string' ? changedOrigin : PRODUCTION_ORIGIN;
  assert(codes(inspectProd(files, input, origin)).includes(code), `${name}: ${code} did not fire`); productionProofs++;
};
const editProd = (files, name, before, after) => set(files, name, files.get(name).toString().replace(before, after));
breakProd('noindex in production', (f) => editProd(f, 'index.html', 'index, follow', 'noindex, nofollow'), 'INDEX');
breakProd('nofollow in production', (f) => editProd(f, 'index.html', 'index, follow', 'index, nofollow'), 'INDEX');
breakProd('robots meta missing', (f) => editProd(f, 'index.html', 'name="robots"', 'name="other"'), 'INDEX');
for (const path of NOINDEX_PATHS) {
  breakProd('deliberate noindex lost', (f) => editProd(f, `${path.slice(1)}.html`, 'noindex, nofollow', 'index, follow'), 'INDEX');
}
breakProd('staging canonical', (f) => editProd(f, 'about.html', `${PRODUCTION_ORIGIN}/about`, 'http://localhost:3236/about'), 'SEO');
breakProd('robots disallow', (f) => editProd(f, 'robots.txt', 'Allow: /', 'Disallow: /'), 'ROBOTS');
breakProd('robots sitemap line', (f) => editProd(f, 'robots.txt', 'Sitemap:', 'Other:'), 'ROBOTS');
breakProd('robots missing', (f) => f.delete('robots.txt'), 'ROBOTS');
breakProd('sitemap short', (f) => set(f, 'sitemap.xml', sitemapXml(sitemapPaths(prodManifest).slice(1))), 'SITEMAP');
breakProd('sitemap extra', (f) => set(f, 'sitemap.xml', sitemapXml([...sitemapPaths(prodManifest), '/press/contact/thank-you'])), 'SITEMAP');
breakProd('sitemap missing', (f) => f.delete('sitemap.xml'), 'SITEMAP');
breakProd('htaccess missing', (f) => f.delete('.htaccess'), 'HTACCESS');
breakProd('staging htaccess', (f) => set(f, '.htaccess', hostingerRules(REVIEW_STAGING_ORIGIN)), 'HTACCESS');
breakProd('PHP denial removed', (f) => set(f, '.htaccess', rules.replace(/^RewriteRule \S+ - \[F,L,NC\]\n/m, '')), 'HTACCESS');
breakProd('host lock removed', (f) => set(f, '.htaccess', rules.replace('RewriteCond %{HTTP_HOST} !^gridsmith\\.uk$ [NC]\n', '')), 'HTACCESS');
breakProd('CSP removed', (f) => set(f, '.htaccess', rules.replace(/^Header always set Content-Security-Policy .*\n/m, '')), 'HTACCESS');
breakProd('rehearsal rules', (f) => set(f, '.htaccess', rehearsalRules), 'REHEARSAL');
breakProd('rehearsal identity', (f) => set(f, '__deployment.json', JSON.stringify({ profile: 'production', rehearsal: true, deployable: false })), 'REHEARSAL');
breakProd('legal document gated', (f, m) => { m.routes.find((r) => r.path === '/legal/privacy').eligible = false; }, 'LEGAL');
breakProd('indexable off the production origin', () => 'http://localhost:3236', 'PROFILE');
assert.deepEqual(inspectProd(new Map([...prodFixture, ['__deployment.json', Buffer.from(JSON.stringify({ deployable: true }))]])), []);

// Reviews: production ships none (LEG-08). A client chunk may carry the component code unused.
assert.deepEqual(artifactNoReviewProblems(prodFixture), []);
const chunk = new Map(prodFixture); set(chunk, '_next/static/specimen.js', 'data-reviews-carousel');
assert.deepEqual(artifactNoReviewProblems(chunk), []);
for (const [name, file, content, code] of [['rendered card', 'index.html', '<li data-review-key="k"></li>', 'REVIEWS_PRESENT'],
  ['RSC payload', 'index.txt', 'data-reviews-carousel', 'REVIEWS_PRESENT'], ['provider id', 'data.txt', '22179079', 'PROVIDER_DATA'],
  ['source map', 'x.js.map', '{}', 'SOURCE_MAP']]) {
  const files = new Map(prodFixture); set(files, file, (files.get(file) ?? '') + content);
  assert(codes(artifactNoReviewProblems(files)).includes(code), `${name}: ${code} did not fire`); productionProofs++;
}
console.log(`GS-R13 production profile PASS: refuses today; staging policy byte-identical; ${productionProofs} adverse proofs.`);

// GS-LAUNCH-007: direct contact removes intake, never legal publication authority.
const { staticLighthouseProblems } = await import('../lib/build/production.ts');
const { createRequire } = await import('node:module');
const { ROUTES: lighthouseRoutes, selectStaticRoutes } = createRequire(import.meta.url)('../lighthouse/routes.cjs');
assert.equal(lighthouseRoutes.length, 11);
assert.equal(selectStaticRoutes(lighthouseRoutes, prodManifest).length, 11);
assert.equal(selectStaticRoutes(lighthouseRoutes, manifest, true).length, 10);
assert.throws(() => selectStaticRoutes(lighthouseRoutes, manifest, false), /Static Lighthouse route missing: \/legal\/privacy/);
assert.throws(() => selectStaticRoutes(lighthouseRoutes, { routes: [] }), /Static Lighthouse route missing: \//);
const indexingFixture = { routes: [{ path: '/', eligible: true, sitemap: true }, { path: '/insights', eligible: true, sitemap: false }] };
assert.deepEqual(selectStaticRoutes([{ path: '/' }, { path: '/insights' }], indexingFixture),
  [{ path: '/', indexable: true }, { path: '/insights', indexable: false }]);
assert.equal(selectStaticRoutes([{ path: '/insights' }], { routes: [{ ...indexingFixture.routes[1], sitemap: true }] })[0].indexable, true);
{
  const { runInNewContext } = await import('node:vm');
  const configSource = readFileSync('lighthouserc.desktop.cjs', 'utf8');
  const assertions = (manifest) => {
    const subject = { exports: {} };
    runInNewContext(configSource, { module: subject, process: { env: { GRIDSMITH_BUILD_TARGET: 'static' } }, require: name => {
      assert.equal(name, './lighthouse/routes.cjs');
      return { ORIGIN_DESKTOP: 'http://127.0.0.1:3200', ROUTES: selectStaticRoutes([{ path: '/' }, { path: '/insights' }], manifest), pattern: (_origin, path) => path };
    } });
    return JSON.parse(JSON.stringify(subject.exports.ci.assert.assertMatrix));
  };
  const [home, empty] = assertions(indexingFixture).map(row => row.assertions);
  assert.deepEqual(home['categories:seo'], ['error', { minScore: 0.9 }]);
  assert.equal(home['is-crawlable'], undefined);
  assert.equal(empty['categories:seo'], undefined);
  for (const audit of ['document-title', 'meta-description', 'canonical', 'crawlable-anchors', 'robots-txt', 'link-text', 'hreflang']) {
    assert.deepEqual(empty[audit], ['error', { minScore: 1 }], audit);
  }
  assert.equal(empty['is-crawlable'], 'off');
  const published = assertions({ routes: indexingFixture.routes.map(row => ({ ...row, sitemap: true })) })[1].assertions;
  assert.deepEqual(published['categories:seo'], ['error', { minScore: 0.9 }]);
  assert.equal(published['is-crawlable'], undefined);
}
const staticSubject = { profile: 'production', contactMode: 'direct', siteOrigin: PRODUCTION_ORIGIN, sourceModified: false };
assert.deepEqual(staticLighthouseProblems(staticSubject), []);
for (const identity of [null, {}, { ...staticSubject, profile: 'staging' }, { ...staticSubject, contactMode: 'edge' },
  { ...staticSubject, siteOrigin: REVIEW_STAGING_ORIGIN }, { ...staticSubject, sourceModified: true }]) {
  assert.deepEqual(staticLighthouseProblems(identity), ['STATIC_LIGHTHOUSE_SUBJECT']);
}
const directRegister = structuredClone(readyRegister);
directRegister.documents.privacy.contactMode = 'direct';
directRegister.documents.privacy.publicationPrerequisites = directRegister.documents.privacy.publicationPrerequisites
  .map(item => item.id === 'H4-B-INTAKE-PROMOTED' ? { ...item, id: 'DIRECT-CONTACT-VERIFIED' } : item);
directRegister.documents.privacy.prerequisitesMet['DIRECT-CONTACT-VERIFIED'] = 'Synthetic exact-source/contact/legal receipt; no real approval';
assert.deepEqual(productionInputProblems(undefined, readyPublication, directRegister, null, 'direct'), []);
assert.equal(productionInputProblems(undefined, publication, register, null, 'direct').length, 8);
assert.equal(productionInputProblems(undefined, publication, register, null, 'direct').filter(p => /is not PUBLISHABLE/.test(p)).length, 7);
assert(productionInputProblems(undefined, readyPublication, readyRegister, null, 'direct').some(p => /no explicit direct-contact/.test(p)));
for (const evidence of [undefined, '', '  ']) {
  const subject = structuredClone(directRegister);
  subject.documents.privacy.prerequisitesMet['DIRECT-CONTACT-VERIFIED'] = evidence;
  assert.deepEqual(productionInputProblems(undefined, readyPublication, subject, null, 'direct'),
    ['LEGAL: DIRECT-CONTACT-VERIFIED has no recorded owner/verification receipt']);
}
const wrongMode = structuredClone(directRegister); wrongMode.documents.privacy.contactMode = 'edge';
assert.deepEqual(productionInputProblems(undefined, readyPublication, wrongMode, null, 'direct'),
  ['LEGAL: Privacy has no explicit direct-contact processing mode']);
assert.deepEqual(productionInputProblems(intake, readyPublication, directRegister, intake, 'edge'),
  ['LEGAL: form activation requires form-mode Privacy and H4-B-INTAKE-PROMOTED']);
for (const url of [PREVIEW_INTAKE_URL, intake]) {
  assert.deepEqual(codes(productionInputProblems(url, readyPublication, directRegister, intake, 'direct')), ['INTAKE']);
}
const directFixture = new Map(prodFixture);
for (const name of ['contact.html', 'press/contact.html']) {
  set(directFixture, name, directFixture.get(name).toString().replace(/<form\b[^]*?<\/form>/,
    '<aside data-static-contact-shell><a href="mailto:contact@gridsmith.uk">Email</a><a href="https://wa.me/447405448534">WhatsApp</a></aside>'));
}
set(directFixture, 'press/contact/thank-you.html', directFixture.get('press/contact/thank-you.html').toString()
  .replaceAll('That has reached us', 'This website does not collect enquiries through a form'));
const directRules = productionHostingerRules(null);
assert(!/supabase|gs-lead-intake/.test(directRules));
assert(directRules.includes('ErrorDocument 500 /500.html'));
assert(/^Require all denied$/m.test(productionHostingerRules(null, 'production', { rehearsal: true })));
set(directFixture, '.htaccess', directRules);
const inspectDirect = (files, mode = 'direct') => inspectStaticArtifact(files, prodManifest, readyPublication, [], PRODUCTION_ORIGIN, mode).problems;
assert.deepEqual(inspectDirect(directFixture), []);
const internalCopy = new Map(directFixture);
set(internalCopy, 'about.html', internalCopy.get('about.html') + '<style>.sms { --label: "Text us" }</style><script type="application/json">{"historicNote":"WhatsApp or text"}</script>');
assert.deepEqual(inspectDirect(internalCopy), [], 'Internal style/data text is not a public contact invitation');

let directProofs = 0;
for (const [name, mutate, code] of [
  ['form', f => set(f, 'contact.html', f.get('contact.html') + '<form></form>'), 'CONTACT'],
  ['form outside contact routes', f => set(f, 'about.html', f.get('about.html') + '<form action="https://example.invalid/intake"></form>'), 'CONTACT'],
  ['shell', f => editProd(f, 'contact.html', 'data-static-contact-shell', 'data-other'), 'CONTACT'],
  ['email', f => editProd(f, 'contact.html', 'mailto:', 'other:'), 'CONTACT'],
  ['WhatsApp', f => editProd(f, 'press/contact.html', 'https://wa.me/', 'https://example.invalid/'), 'CONTACT'],
  ['email wrong recipient', f => editProd(f, 'contact.html', 'mailto:contact@gridsmith.uk', 'mailto:synthetic@example.invalid'), 'CONTACT'],
  ['WhatsApp wrong recipient', f => editProd(f, 'press/contact.html', 'wa.me/447405448534', 'wa.me/440000000000'), 'CONTACT'],
  ...['sms:+447405448534', 'sms:+440000000000', 'tel:+447405448534'].map(href =>
    [href, f => set(f, 'about.html', f.get('about.html') + `<a href="${href}">Contact</a>`), 'CONTACT']),
  ...['Text us', 'Send an SMS', 'WhatsApp or text', 'text-message links', 'Call us', 'Give us a call', 'Or call', 'Speak to us on', 'Call Gridsmith', 'Voice calls', 'Call +447405448534', 'Phone +44 7405 448534', 'Telephone: +44 7405 448534', 'Telephone: 07405 448534'].map(copy =>
    [copy, f => set(f, 'about.html', f.get('about.html') + `<p>${copy}</p>`), 'CONTACT']),
  ['metadata SMS', f => editProd(f, 'about.html', 'name="description" content="Specimen"', 'name="description" content="Text messages welcome"'), 'CONTACT'],
  ['single-quoted mixed-case SMS', f => set(f, '500.html', f.get('500.html') + "<a href = 'SmS:+447405448534'>Contact</a>"), 'CONTACT'],
  ['confirmation', f => editProd(f, 'press/contact/thank-you.html', 'This website does not collect enquiries through a form', 'That has reached us'), 'FORM'],
  ...['html', 'js', 'txt', 'json'].map(ext => [ext + ' intake leak', f => set(f, ext === 'html' ? 'contact.html' : 'leak.' + ext, (ext === 'html' ? f.get('contact.html') : '') + PREVIEW_INTAKE_URL), 'CONTACT']),
  ['missing error', f => f.delete('500.html'), '500'],
  ['title', f => editProd(f, '500.html', '<title>', '<other>'), '500'],
  ['noindex', f => editProd(f, '500.html', 'noindex', 'index'), '500'],
  ['obsolete platform marker', f => set(f, '500.html', f.get('500.html') + '::vercel:REQUEST_ID::'), '500'],
  ['false delivery assurance', f => set(f, '500.html', f.get('500.html') + 'nothing you sent has been lost'), '500'],
  ['language', f => editProd(f, '500.html', 'lang="en-GB"', 'data-lang="en-GB"'), '500'],
  ['main', f => editProd(f, '500.html', '<main ', '<section '), '500'],
  ['heading', f => editProd(f, '500.html', '<h1>', '<h2>'), '500'],
  ['recovery', f => editProd(f, '500.html', 'href="/"', 'href="#"'), '500'],
  ['error mapping', f => editProd(f, '.htaccess', 'ErrorDocument 500 /500.html', ''), 'HTACCESS'],
  ['directory redirect', f => editProd(f, '.htaccess', 'DirectorySlash Off', ''), 'HTACCESS'],
  ['directory indexing', f => editProd(f, '.htaccess', 'Options -Indexes -MultiViews', ''), 'HTACCESS'],
  ['rehearsal denial', f => set(f, '.htaccess', productionHostingerRules(null, 'production', { rehearsal: true })), 'REHEARSAL'],
]) {
  const files = new Map(directFixture); mutate(files);
  assert(codes(inspectDirect(files)).includes(code), `${name}: ${code} did not fire`); directProofs++;
}
assert(codes(inspectDirect(directFixture, 'unknown')).includes('CONTACT'));
console.log(`GS-LAUNCH-007 direct-contact/error PASS: ${directProofs + 1} adverse artifact proofs; seven legal refusals retained.`);

// GS-LAUNCH-017: owner authority displays repository legal texts on one non-indexable host only.
const { createOwnerPreviewManifest } = await import('../lib/build/route-manifest.ts');
const { ownerPreviewAllowed } = await import('../lib/build/target.ts');
assert(ownerPreviewAllowed('owner-preview', REVIEW_STAGING_ORIGIN, 'production'));
let ownerProofs = 0;
for (const args of [
  ['production', REVIEW_STAGING_ORIGIN, 'production'], ['owner-preview', PRODUCTION_ORIGIN, 'production'],
  ['owner-preview', REVIEW_STAGING_ORIGIN + '/', 'production'], ['owner-preview', REVIEW_STAGING_ORIGIN, 'development'],
  ['owner-preview', 'http://localhost:3236', 'production'], ['owner-preview', 'https://example.invalid', 'production'],
]) { assert(!ownerPreviewAllowed(...args)); ownerProofs++; }
assert(legalPreviewProfile('adopted-owner', 'production', REVIEW_STAGING_ORIGIN));
for (const [dataset, origin] of [['development', REVIEW_STAGING_ORIGIN], ['production', PRODUCTION_ORIGIN],
  ['production', 'http://localhost:3236'], ['production', REVIEW_STAGING_ORIGIN + '/']]) {
  assert.throws(() => legalPreviewProfile('adopted-owner', dataset, origin), /Legal preview requires/); ownerProofs++;
}
const ownerManifest = createOwnerPreviewManifest(documents, publication);
assert.equal(ownerManifest.dataset, 'production'); assert.equal(ownerManifest.indexable, false);
assert.equal(ownerManifest.routes.filter(r => r.eligible && r.contentType === 'legalDocument').length, 7);
assert(ownerManifest.routes.filter(r => r.contentType === 'legalDocument').every(r => r.sourceId === null && r.revision === null && !r.sitemap));
assert.throws(() => createOwnerPreviewManifest(documents, publication.filter(e => e.slug !== 'privacy')), /seven canonical/); ownerProofs++;
assert.throws(() => createOwnerPreviewManifest([{ ...documents[0], isSeed: true }, ...documents.slice(1)], publication), /Seed/); ownerProofs++;
const ownerRules = productionHostingerRules(null, 'production', { ownerPreview: true });
assert.deepEqual(headerProblems(ownerRules), []);
assert(!/supabase|Require all denied/.test(ownerRules));
assert.throws(() => productionHostingerRules(null, 'production', { ownerPreview: true, rehearsal: true }), /Owner preview/); ownerProofs++;
assert.throws(() => productionHostingerRules(intakeOrigin, 'production', { ownerPreview: true }), /Owner preview/); ownerProofs++;
const ownerFiles = new Map([...directFixture].map(([name, bytes]) => [name, Buffer.from(bytes.toString()
  .replaceAll(PRODUCTION_ORIGIN, REVIEW_STAGING_ORIGIN).replaceAll('content="index, follow"', 'content="noindex, nofollow"'))]));
set(ownerFiles, '.htaccess', ownerRules);
set(ownerFiles, 'robots.txt', 'User-Agent: *\nDisallow: /\n'); set(ownerFiles, 'sitemap.xml', '<urlset></urlset>');
for (const r of ownerManifest.routes.filter(r => r.contentType === 'legalDocument')) {
  const name = r.path.slice(1) + '.html'; set(ownerFiles, name, ownerFiles.get(name) + '<p>ADOPTED, NOT YET PUBLISHED.</p>');
}
const inspectOwner = (f = ownerFiles, m = ownerManifest, origin = REVIEW_STAGING_ORIGIN, mode = 'direct') =>
  inspectStaticArtifact(f, m, publication, [], origin, mode).problems;
assert.deepEqual(inspectOwner(), []);
for (const [change, code] of [
  [f => f.delete('legal/privacy.html'), 'ROUTE'], [f => f.delete('500.html'), '500'],
  [f => set(f, 'legal/privacy.html', f.get('legal/privacy.html').toString().replace('ADOPTED, NOT YET PUBLISHED.', '')), 'LEGAL'],
  [f => set(f, 'about.html', f.get('about.html') + '<form></form>'), 'CONTACT'],
  [f => set(f, '.htaccess', ownerRules.replace(/!\^mediumaquamarine[^ ]+/, '!^example.invalid$')), 'HTACCESS'],
  [f => set(f, '.htaccess', ownerRules.replace('RewriteRule ^ - [F,L]\n', '')), 'HTACCESS'],
  [f => set(f, '.htaccess', ownerRules.replace(/^RewriteRule \\\..*\[F,L,NC\]\n/m, '')), 'HTACCESS'],
  [f => set(f, '.htaccess', ownerRules.replace(/^Header always set X-Robots-Tag .*\n/m, '')), 'HTACCESS'],
  [f => set(f, '.htaccess', ownerRules.replace("connect-src 'self' ;", "connect-src 'self' https://example.supabase.co;")), 'HTACCESS'],
  [f => set(f, '.htaccess', ownerRules + 'Require all denied\n'), 'HTACCESS'],
  [f => set(f, '.htaccess', ownerRules + '<IfModule mod_headers.c>\n</IfModule>\n'), 'HTACCESS'],
  [f => set(f, '.htaccess', ownerRules.replace('DirectorySlash Off', 'DirectorySlash On')), 'HTACCESS'],
  [f => set(f, '.htaccess', ownerRules.replace('ErrorDocument 500 /500.html', '')), 'HTACCESS'],
]) { const files = new Map(ownerFiles); change(files); assert(codes(inspectOwner(files)).includes(code), code); ownerProofs++; }
assert(codes(inspectOwner(ownerFiles, ownerManifest, PRODUCTION_ORIGIN)).includes('PROFILE')); ownerProofs++;
assert(codes(inspectOwner(ownerFiles, ownerManifest, REVIEW_STAGING_ORIGIN, 'edge')).includes('CONTACT')); ownerProofs++;
const ownerIdentity = { profile: 'owner-preview', legalPreview: true, dataset: 'production', siteOrigin: REVIEW_STAGING_ORIGIN,
  sourceModified: false, contactMode: 'direct', intakeOrigin: null, rehearsal: false, deployable: false, releaseStatus: 'ACCEPTANCE_PENDING' };
assert(servedLegalPreview(ownerIdentity, true)); assert.deepEqual(staticLighthouseProblems(ownerIdentity), []);
for (const change of [{ dataset: 'development' }, { siteOrigin: PRODUCTION_ORIGIN }, { legalPreview: false }, { contactMode: 'edge' },
  { profile: 'staging' }, { intakeOrigin: intakeOrigin }, { rehearsal: true }, { deployable: true }, { releaseStatus: 'APPROVED' }]) {
  const input = { ...ownerIdentity, ...change };
  assert.throws(() => servedLegalPreview(input, true), /R12 requires/); ownerProofs++;
  if (input.profile === 'owner-preview') { assert.throws(() => servedLegalPreview(input), /R12 requires/); ownerProofs++; }
  assert.deepEqual(staticLighthouseProblems(input), ['STATIC_LIGHTHOUSE_SUBJECT']); ownerProofs++;
}
assert.deepEqual(staticLighthouseProblems({ ...ownerIdentity, sourceModified: true }), ['STATIC_LIGHTHOUSE_SUBJECT']); ownerProofs++;
assert.throws(() => servedLegalPreview({ ...ownerIdentity, dataset: 'development', siteOrigin: PRODUCTION_ORIGIN }, true), /R12 requires/); ownerProofs++;
const ownerPayload = [...ownerFiles].map(([path, bytes]) => ({ path, bytes: bytes.length, sha256: sha(bytes) }));
const finalOwnerIdentity = { ...ownerIdentity, phase: 'GS-LAUNCH-017', sourceSha: 'a'.repeat(40),
  files: ownerPayload, artifactIdentity: sha(JSON.stringify(ownerPayload)) };
const identifiedOwner = new Map(ownerFiles); set(identifiedOwner, '__deployment.json', JSON.stringify(finalOwnerIdentity));
const inspectIdentified = files => inspectStaticArtifact(files, ownerManifest, publication, [], REVIEW_STAGING_ORIGIN, 'direct', { requireIdentity: true }).problems;
assert.deepEqual(inspectIdentified(identifiedOwner), []);
assert(codes(inspectIdentified(ownerFiles)).includes('IDENTITY')); ownerProofs++;
for (const change of [i => { i.deployable = true; }, i => { i.releaseStatus = 'APPROVED'; }, i => { i.profile = 'production'; },
  i => { i.phase = 'other'; }, i => { i.sourceSha = 'missing'; }, i => { delete i.sourceModified; }, i => { delete i.files; },
  i => { i.files.pop(); }, i => { i.files[0] = i.files[1]; }, i => { i.files[0].path = '__deployment.json'; },
  i => { i.files[0].bytes++; }, i => { i.files[0].sha256 = '0'.repeat(64); }, i => { i.artifactIdentity = '0'.repeat(64); }]) {
  const input = structuredClone(finalOwnerIdentity); change(input);
  const files = new Map(identifiedOwner); set(files, '__deployment.json', JSON.stringify(input));
  assert(codes(inspectIdentified(files)).includes('IDENTITY')); ownerProofs++;
}
const malformedOwner = new Map(identifiedOwner); set(malformedOwner, '__deployment.json', '{');
assert(codes(inspectIdentified(malformedOwner)).includes('IDENTITY')); ownerProofs++;
assert(selectStaticRoutes(lighthouseRoutes, ownerManifest).every(r => r.indexable === false));
assert.equal(productionInputProblems(undefined, publication, register, null, 'direct').length, 8);
console.log(`GS-LAUNCH-017 owner preview PASS: 7 unchanged-source legal routes, direct contact and noindex; ${ownerProofs} named adverse proofs; production still refuses.`);

for (const path of ['/press/path-finder', '/press/gridsmith-path-probe']) {
  assert(!manifest.routes.some((route) => route.path === path));
  const leakedManifest = structuredClone(manifest);
  leakedManifest.routes.push({ ...manifest.routes[0], path, eligible: false });
  assert(inspectStaticArtifact(fixture, leakedManifest, publication).problems.some((p) => p.startsWith('EXCLUDED:')));
  for (const suffix of ['.html', '.txt', '/index.html']) {
    const leaked = new Map(fixture); leaked.set(path.slice(1) + suffix, Buffer.from('<h1>Path Finder specimen</h1>'));
    assert(inspectStaticArtifact(leaked, manifest, publication).problems.some((p) => p.startsWith('EXCLUDED:')));
  }
}
assert(!sitemapPaths(manifest).includes('/insights'));
assert(sitemapPaths(article).includes('/insights'));
console.log('GS-LAUNCH-002: both withheld Path Finder paths reject emitted artifacts.');

// Exercise the normal sitemap's empty/published article branches without a CMS connection.
{
  const { default: ts } = await import('typescript');
  const { runInNewContext } = await import('node:vm');
  let posts = [];
  const subject = { exports: {} };
  const imports = {
    '@/lib/legal/slugs': { LEGAL_DOCUMENT_SLUGS: [] },
    '@/lib/sanity/queries': { listServiceSlugs: async () => [], listPostSlugs: async () => posts },
    '@/lib/seo/site': { INDEXABLE: true, absolute: path => new URL(path, PRODUCTION_ORIGIN).href },
    '@/lib/build/target': { STATIC_BUILD: false },
    '@/lib/build/static-routes': {}, '@/lib/build/route-manifest': {},
  };
  const compiled = ts.transpileModule(readFileSync('app/sitemap.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  runInNewContext(compiled, { module: subject, exports: subject.exports, require: name => {
    assert(name in imports, `Unexpected sitemap dependency ${name}`); return imports[name];
  } });
  assert(!(await subject.exports.default()).some(row => row.url.endsWith('/insights')));
  posts = ['published-specimen'];
  const urls = (await subject.exports.default()).map(row => row.url);
  assert(urls.includes(`${PRODUCTION_ORIGIN}/insights`));
  assert(urls.includes(`${PRODUCTION_ORIGIN}/insights/published-specimen`));
}
console.log('GS-LAUNCH-002: normal sitemap empty/published Insights branches PASS.');

// GS-LAUNCH-005: all subjects are in memory; no proof mutates operator or release files.
const operatorFiles = readArtifact('ops/hostinger-error');
assert.deepEqual(inspectOperatorError(operatorFiles), []);
let operatorProofs = 0;
for (const [label, change, message] of [
  ['zero files', f => f.clear(), 'exactly two'],
  ['missing fallback', f => f.delete('error.html'), 'document bytes'],
  ['missing identity', f => f.delete('identity.json'), 'malformed or missing'],
  ['malformed identity', f => set(f, 'identity.json', '{'), 'malformed or missing'],
  ['extra file', f => set(f, 'unexpected.conf', ''), 'exactly two'],
  ['malformed HTML', f => set(f, 'error.html', '<html>broken'), 'document bytes'],
  ['inaccessible language', f => set(f, 'error.html', f.get('error.html').toString().replace('lang="en-GB"', '')), 'document bytes'],
  ['configuration drift', f => {
    const identity = JSON.parse(f.get('identity.json')); identity.policy.status = 200;
    set(f, 'identity.json', JSON.stringify(identity));
  }, 'configuration identity'],
  ['configuration hash drift', f => {
    const identity = JSON.parse(f.get('identity.json')); identity.configurationSha256 = '0'.repeat(64);
    set(f, 'identity.json', JSON.stringify(identity));
  }, 'configuration identity'],
]) {
  const files = new Map(operatorFiles); change(files);
  assert(inspectOperatorError(files).some(p => p.includes(message)), `${label}: expected assertion did not fire`);
  operatorProofs++;
}
for (const [name, bytes] of [
  ['ops/hostinger-error/error.html', Buffer.from('path-only specimen')],
  ['hostinger-error/identity.json', Buffer.from('path-only specimen')],
  ['__gs_error.html', Buffer.from('path-only specimen')],
  ['legal/fallback.html', operatorFiles.get('error.html')],
]) {
  const files = new Map(fixture); files.set(name, bytes);
  assert(inspect(files).problems.some(p => p.startsWith('OPERATOR_ERROR:')), name); operatorProofs++;
}
console.log(`GS-LAUNCH-005 operator error package PASS: 2 files; ${operatorProofs} named adverse proofs; no hosted acceptance.`);
