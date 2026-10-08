/** Permanent H4-A positive and adversarial subjects; no app source mutation/network. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createStaticManifest, createLegalPreviewManifest, sitemapPaths } from '../lib/build/route-manifest.ts';
import { resolveBuildTarget } from '../lib/build/target.ts';
import { inspectStaticArtifact } from './check-static-artifact.mjs';

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
for (const marker of ['SUPABASE_SERVICE_ROLE_KEY', 'GRIDSMITH_WORKER_TOKEN', 'RESEND_API_KEY', 'SANITY_API_WRITE_TOKEN', 'DIRECT_CONNECTION_STRING', 'VERCEL_TOKEN', 'FREELANCER_API_TOKEN', 'FREELANCER_API_SECRET', 'Freelancer-OAuth-V1', '-----BEGIN PRIVATE KEY-----', 'postgresql://specimen', 're_' + 'a'.repeat(24)]) {
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
const register = JSON.parse(readFileSync('docs/_legal/GS-O003-R-REGISTER.json'));
assert.equal(legalPreviewProfile(undefined, 'production', REVIEW_STAGING_ORIGIN), false);
assert(legalPreviewProfile('adopted-development', 'development', REVIEW_STAGING_ORIGIN));
let previewProofs = 0;
assert(servedLegalPreview({ legalPreview: true, dataset: 'development' }, true));
assert.equal(servedLegalPreview({ legalPreview: false, dataset: 'production' }), false);
for (const [identity, required] of [[null, false], [null, true], [{ legalPreview: false }, true],
  [{ legalPreview: true, dataset: 'production' }, true], [{ legalPreview: true, dataset: 'production' }, false]]) {
  assert.throws(() => servedLegalPreview(identity, required), /must identify|R12 requires/); previewProofs++;
}
for (const [value, dataset, origin] of [
  ['adopted-development', 'production', REVIEW_STAGING_ORIGIN],
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
