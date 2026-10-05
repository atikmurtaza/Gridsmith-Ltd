#!/usr/bin/env node
/**
 * check-reviews selftest — the permanent committed subject for the `GS-P05` review pipeline.
 *
 * **Value-based, deliberately.** Every case asserts what a rule function *returns*, so a case
 * that should fail cannot pass as an absence — `CLAUDE.md`, *"prefer a probe whose validity is
 * structural"*. A gate whose only evidence is "nothing was reported" cannot distinguish a
 * working rule from a rule that never ran; a gate that reads a value can.
 *
 * Every limb of `categorise`, `withholdReason` and `toReviews` is exercised **separately**,
 * including the ones that must return a falsy result, because a half-working predicate reports
 * success from whichever branch you happened to exercise (`check:rls` accepted an `anon` SELECT
 * policy twice for exactly that reason).
*/
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  CATEGORIES,
  FREELANCER_PROFILE,
  SOURCE_LABEL,
  categorise,
  jobsByReview,
  parsePayload,
  reviewsUrl,
  toReviews,
  withholdReason,
  WITHHELD_REVIEW_IDS,
  namedThirdParty,
} from '../lib/reviews/freelancer.ts';

let failures = 0;
let ran = 0;

const is = (name, actual, expected) => {
  ran += 1;
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    failures += 1;
    console.error(`  FAIL ${name}\n       expected ${e}\n       actual   ${a}`);
  }
};

/* -- categorise ------------------------------------------------------------ */

is('categorise: a specific tag wins', categorise(['Graphic Design', 'Logo Design'])?.label, 'Logo design');
is('categorise: list order decides, not payload order', categorise(['Logo Design', 'Graphic Design'])?.label, 'Logo design');
is('categorise: the broad tag alone still resolves', categorise(['Graphic Design'])?.label, 'Graphic design');
is('categorise: Shopify beats Web Design', categorise(['Web Design', 'Shopify'])?.label, 'Ecommerce theme development');
is('categorise: a game beats its animation tags', categorise(['Animation', '2D Animation', 'Game Design'])?.label, 'Game development');
is('categorise: division travels with the label', categorise(['Shopify'])?.division, 'digital');
is('categorise: an unknown tag yields nothing rather than a guess', categorise(['Underwater Basket Weaving']), null);
is('categorise: an empty list yields nothing', categorise([]), null);
is('categorise: a null input yields nothing', categorise(null), null);
is('categorise: a non-array input yields nothing', categorise('Logo Design'), null);
is('categorise: every label is unique', CATEGORIES.length, new Set(CATEGORIES.map((c) => c.label)).size);

/* -- withholdReason -------------------------------------------------------- */

is('withhold: a clean body publishes', withholdReason('Great work, delivered on time.', 'Acme Ltd'), null);
is(
  'withhold: a body naming the reviewer company is withheld',
  withholdReason('Great work for Acme Ltd throughout.', 'Acme Ltd'),
  'the body names the reviewer\'s own company ("Acme Ltd")',
);
is(
  'withhold: the company match is case-insensitive',
  typeof withholdReason('great work for acme ltd throughout.', 'Acme Ltd'),
  'string',
);
is('withhold: a URL is withheld', withholdReason('See https://example.com for more.'), 'the body contains a URL or email address');
is('withhold: a bare www host is withheld', withholdReason('Find us at www.example.com'), 'the body contains a URL or email address');
is('withhold: an email address is withheld', withholdReason('Reach me at a@b.co'), 'the body contains a URL or email address');
is('withhold: an empty body is withheld', withholdReason(''), 'the body is empty');
is('withhold: a whitespace body is withheld', withholdReason('   \n  '), 'the body is empty');
is('withhold: a null body is withheld', withholdReason(null), 'the body is empty');
is('withhold: a very short company is not matched', withholdReason('It is ok.', 'ok'), null);
is('withhold: no company supplied does not crash', withholdReason('Solid work.'), null);
/* -- GS-O015, both limbs, each broken on its own ---------------------------- */
//
// The owner's decision is that a review naming an identifiable third party is withheld by
// conservative deterministic rule where one can decide, and by human review where none can.
// Those are two limbs and CLAUDE.md is explicit that one firing is not evidence for the other,
// so each is driven on a body the OTHER limb publishes. Every case reads a returned reason.

// Limb 1 — manual. An id-only rule must fire on a body every other rule publishes, or a green
// would only mean another rule caught the body. Use clean synthetic quotations for the
// permanent IDs and a separate injected ID for the additional manual branch.
is(
  'withhold GS-O015 manual: an id on the list is withheld whatever the body says',
  withholdReason('Solid work.', null, 99999999, [99999999]),
  'a person read this review and withheld it (GS-O015, manual)',
);
is(
  'withhold GS-O015 manual: an id NOT on the list publishes the same body',
  withholdReason('Solid work.', null, 1, [99999999]),
  null,
);
is(
  'withhold H4-C: permanent IDs remain explicit, regardless of later source wording',
  WITHHELD_REVIEW_IDS,
  [22108992, 22100632],
);
for (const id of [22108992, 22100632]) {
  is(`withhold H4-C: permanent ${id} rejects a clean synthetic quotation`,
    withholdReason('Synthetic fixture: clear communication.', null, id),
    'a person read this review and withheld it (GS-O015, manual)');
  is(`withhold H4-C: an injected empty list cannot bypass permanent ${id}`,
    withholdReason('Synthetic fixture: clear communication.', null, id, []),
    'a person read this review and withheld it (GS-O015, manual)');
}
is('withhold H4-C: permanent list is frozen', Object.isFrozen(WITHHELD_REVIEW_IDS), true);

// Limb 2 — deterministic, driven independently with synthetic companies and non-denied IDs.
is(
  'namedThirdParty: a synthetic business with multiple corporate tokens is caught',
  namedThirdParty('Synthetic fixture: Example Software PVT delivered the earlier work.'),
  'Example Software PVT',
);
is(
  'namedThirdParty: a synthetic private company is caught',
  namedThirdParty('Synthetic fixture: Example Pvt delivered the earlier work.'),
  'Example Pvt',
);
is(
  'namedThirdParty: a business nobody has seen is caught too, which is the point of a rule',
  namedThirdParty('Previously we used Acme Technologies and it went badly.'),
  'Acme Technologies',
);
is(
  'namedThirdParty: our OWN name is not a third party',
  namedThirdParty('Gridsmith Ltd delivered exactly what we needed, on time.'),
  null,
);
is(
  'namedThirdParty: ordinary praise names no business',
  namedThirdParty('Great work, very responsive and professional throughout.'),
  null,
);
is(
  'namedThirdParty: a lowercase corporate word in ordinary prose is not a name',
  namedThirdParty('We had a limited budget and the company was great.'),
  null,
);
is(
  'withhold GS-O015 rule: the reason names the matched business',
  withholdReason('Previously we used Acme Technologies and it went badly.'),
  'the body names a third-party business ("Acme Technologies") — GS-O015',
);
is(
  'withhold GS-O015 rule: fires on a body with no URL, no email and no reviewer company',
  typeof withholdReason('Synthetic fixture: work started at Example Pvt.', null, 1),
  'string',
);

/* -- parsePayload ---------------------------------------------------------- */

const good = {
  status: 'success',
  result: {
    reviews: [
      { id: 1, from_user_id: 7, description: 'Excellent.', rating: 4.6, time_submitted: 1_780_000_000, status: 'active' },
    ],
    users: { 7: { public_name: 'Ada', username: 'ada99' } },
    projects: { 99: { jobs: [{ name: 'Logo Design' }] } },
    reviews_count: 1,
  },
};

is('parse: a well-formed payload is accepted', parsePayload(good).success, true);
is('parse: a null payload is rejected', parsePayload(null).success, false);
is('parse: a non-object payload is rejected', parsePayload('nope').success, false);
is('parse: an error status is rejected', parsePayload({ status: 'error', result: { reviews: [] } }).success, false);
is('parse: a missing reviews array is rejected', parsePayload({ status: 'success', result: {} }).success, false);
is(
  'parse: a review missing its rating is rejected',
  parsePayload({ status: 'success', result: { reviews: [{ id: 1, from_user_id: 7, description: 'x', time_submitted: 1 }] } }).success,
  false,
);
is(
  'parse: a rating arriving as a string is rejected',
  parsePayload({
    status: 'success',
    result: { reviews: [{ id: 1, from_user_id: 7, description: 'x', rating: '5', time_submitted: 1 }] },
  }).success,
  false,
);
is('parse: zero reviews is valid, not an error', parsePayload({ status: 'success', result: { reviews: [] } }).success, true);

/* -- toReviews ------------------------------------------------------------- */

const parsedGood = parsePayload(good);
const one = toReviews(parsedGood.data, { 1: ['Logo Design'] });

// Filter-first public mapping: both permanent identities are tested together, then
// reordered and duplicated. Clean synthetic text proves identity (not a text rule) fired.
const permanentFixture = [22108992, 22100632, 1].map((id) => ({
  ...good.result.reviews[0], id, description: 'Synthetic fixture: clear communication.',
}));
for (const [label, reviews] of [
  ['both permanent exclusions', permanentFixture],
  ['reordered provider result', [...permanentFixture].reverse()],
  ['duplicate denied identities', [...permanentFixture, permanentFixture[0], permanentFixture[1]]],
]) {
  const mapped = toReviews(parsePayload({ ...good, result: { ...good.result, reviews } }).data);
  is(`map H4-C: ${label} cannot enter public output`, mapped.published.map((r) => r.id), [1]);
  is(`map H4-C: ${label} reports two distinct withheld identities`,
    mapped.withheld.map((r) => r.id).sort((a, b) => a - b), [22100632, 22108992]);
}

is('map: zero reviews maps to zero published', toReviews(parsePayload({ status: 'success', result: { reviews: [] } }).data).published.length, 0);
is('map: one review maps to one published', one.published.length, 1);
is('map: the body is preserved verbatim', one.published[0].quote, 'Excellent.');
is('map: the rating is preserved unrounded', one.published[0].rating, 4.6);
is('map: the date is the submission date', one.published[0].date, new Date(1_780_000_000 * 1000).toISOString().slice(0, 10));
is('map: the public name is the attribution', one.published[0].authorName, 'Ada');
is('map: the client company is never carried', one.published[0].authorCompany, null);
is('map: the source is the public profile', one.published[0].sourceUrl, FREELANCER_PROFILE);
is('map: the attribution label is the approved wording', one.published[0].sourceLabel, SOURCE_LABEL);
is('map: a categorised review carries its label', one.published[0].projectTitle, 'Logo design');
is('map: an uncategorised review carries no title rather than a guess', toReviews(parsedGood.data, {}).published[0].projectTitle, null);
is('map: an uncategorised review carries no division', toReviews(parsedGood.data, {}).published[0].division, null);

const withCompany = parsePayload({
  ...good,
  result: { ...good.result, reviews: [{ ...good.result.reviews[0], description: 'Great work for Acme Ltd.' }], users: { 7: { public_name: 'Ada', company: 'Acme Ltd' } } },
});
is('map: an unsafe body is withheld, not published', toReviews(withCompany.data, {}).published.length, 0);
is('map: an unsafe body is reported with its reason', toReviews(withCompany.data, {}).withheld.length, 1);

const duplicated = parsePayload({
  ...good,
  result: { ...good.result, reviews: [good.result.reviews[0], good.result.reviews[0]] },
});
is('map: a duplicate review id is published once', toReviews(duplicated.data, {}).published.length, 1);

const inactive = parsePayload({
  ...good,
  result: { ...good.result, reviews: [{ ...good.result.reviews[0], status: 'retracted' }] },
});
is('map: a non-active review is not published', toReviews(inactive.data, {}).published.length, 0);

const two = parsePayload({
  ...good,
  result: {
    ...good.result,
    reviews: [
      { id: 1, from_user_id: 7, description: 'Older.', rating: 5, time_submitted: 1_700_000_000, status: 'active' },
      { id: 2, from_user_id: 7, description: 'Newer.', rating: 5, time_submitted: 1_790_000_000, status: 'active' },
    ],
  },
});
is('map: the newest review sorts first', toReviews(two.data, {}).published.map((r) => r.id), [2, 1]);
is('map: a new review appears without any other change', toReviews(two.data, {}).published.length, 2);

/* -- jobsByReview ---------------------------------------------------------- */

const rawWithProject = {
  result: {
    reviews: [{ id: 1, project_id: 99 }],
    projects: { 99: { jobs: [{ name: 'Logo Design' }, { name: 'Graphic Design' }] } },
  },
};
is('jobs: tags are found through the project map', jobsByReview(rawWithProject)[1], ['Logo Design', 'Graphic Design']);
is('jobs: a missing project map yields an empty list', jobsByReview({ result: { reviews: [{ id: 1, project_id: 99 }] } })[1], []);
is('jobs: a malformed input does not throw', jobsByReview(null), {});

/* -- reviewsUrl ------------------------------------------------------------ */

is('url: is https', reviewsUrl().startsWith('https://www.freelancer.com/api/projects/0.1/reviews/'), true);
is('url: requests the reviews count so the read can be proven complete', reviewsUrl().includes('reviews_count=true'), true);
is('url: requests job details, which is where the category comes from', reviewsUrl().includes('project_job_details=true'), true);
is('url: carries no token parameter', /token|secret|key=/i.test(reviewsUrl()), false);

/* -- report ---------------------------------------------------------------- */

// Drive the actual --live gate over an offline fetch substitute. The explicit reached
// marker proves the injected response was consumed; red exit plus exact safe category
// proves the relevant failure branch ran. No real provider body or credential is used.
for (const [name, expression, category] of [
  ['malformed JSON', 'return new Response("SYNTHETIC_PRIVATE_SOURCE_NOT_JSON", {status:200})', 'malformed-json'],
  ['schema rejection', 'return new Response(JSON.stringify({status:"SYNTHETIC_PRIVATE_SOURCE_NOT_JSON"}), {status:200})', 'schema'],
  ['transport exception', 'throw new Error("SYNTHETIC_PRIVATE_SOURCE_NOT_JSON")', 'transport'],
  ['authentication rejection', 'return new Response("SYNTHETIC_PRIVATE_SOURCE_NOT_JSON", {status:401})', 'http-401'],
]) {
  const preload = `globalThis.__GRIDSMITH_SYNTHETIC_REVIEW_TRANSPORT__=true;globalThis.fetch=async()=>{process.stdout.write("H4C_SYNTHETIC_FETCH_REACHED\\n");${expression}};`;
  const result = spawnSync(process.execPath, ['--import', `data:text/javascript,${encodeURIComponent(preload)}`,
    fileURLToPath(new URL('./check-reviews.mjs', import.meta.url)), '--live'],
  { encoding: 'utf8', timeout: 15000, windowsHide: true });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  is(`logs H4-C: ${name} was actually injected`, output.includes('H4C_SYNTHETIC_FETCH_REACHED'), true);
  is(`logs H4-C: ${name} fails the actual gate`, result.status, 1);
  is(`logs H4-C: ${name} names the safe category`, output.includes(`${category}; source/error content suppressed`), true);
  is(`logs H4-C: ${name} does not expose private fixture`, output.includes('SYNTHETIC_PRIVATE_SOURCE_NOT_JSON'), false);
}

if (failures > 0) {
  console.error(`\ncheck-reviews selftest: ${failures} of ${ran} case(s) FAILED\n`);
  process.exit(1);
}
console.log(`\ncheck-reviews selftest: PASS — ${ran} case(s), every rule limb asserted by return value.\n`);

const { default: assert } = await import('node:assert/strict');
// Permanent H4-D-R1 public-model adverse specimens, structurally measured.
const { APPROVED_STAGING_REVIEWS } = await import('../lib/reviews/staging-approved.ts');
const { publicReviewProblems } = await import('./review-public-rules.mjs');
const { stagingReviewsAllowed } = await import('../lib/reviews/public-model.ts');
const { readFileSync: readFrozenFile } = await import('node:fs');
const frozen = JSON.parse(readFrozenFile(new URL('../docs/_shared/GS-HOST-H4-D-REVIEW-BASELINE.json', import.meta.url)));
assert.deepEqual(publicReviewProblems(APPROVED_STAGING_REVIEWS, frozen), []);
for (const [code, mutate] of [
  ['COUNT', (rows) => rows.pop()],
  ['KEY', (rows) => { rows[1].key = rows[0].key; }],
  ['IDENTITY', (rows) => { rows[0].authorName = 'Synthetic Identity'; }],
  ['PROVENANCE', (rows) => { rows[0].sourceLabel = 'Synthetic'; }],
  ['PROVENANCE', (rows) => { rows[0].sourceUrl = 'https://example.invalid'; }],
  ['RATING', (rows) => { rows[1].rating = 5; }],
  ['TEXT', (rows) => { rows[0].reviewText += ' synthetic'; }],
  ['COUNTRY', (rows) => { rows[0].country = { code: 'XX' }; }],
]) {
  const rows = structuredClone(APPROVED_STAGING_REVIEWS); mutate(rows);
  assert(publicReviewProblems(rows, frozen).includes(code), code);
}
for (const site of ['https://gridsmith.uk', 'https://www.gridsmith.uk', 'https://evil.invalid', undefined]) {
  assert.equal(stagingReviewsAllowed('owner-staging', site), false);
}
assert.equal(stagingReviewsAllowed(undefined, 'https://example.hostingersite.com'), false);
assert.equal(stagingReviewsAllowed('owner-staging', 'http://localhost:3236'), true);
console.log('H4-D-R1 frozen public model PASS: 8 adverse field/count specimens, 5 closed production-boundary specimens.');

const { artifactReviewProblems } = await import('./review-public-rules.mjs');
const escapeReview = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
const publicFixture = new Map([['index.html', Buffer.from(APPROVED_STAGING_REVIEWS.map((row) =>
  `<li data-review-key=\"${row.key}\"><span aria-label=\"${row.rating} out of 5 stars\">${row.rating} / 5</span><blockquote><p>${escapeReview(row.reviewText)}</p></blockquote><figcaption><a href=\"${row.sourceUrl}\" target=\"_blank\" rel=\"noopener noreferrer\">${row.sourceLabel}<span class=\"sr-only\"> (opens in a new tab)</span></a></figcaption></li>`).join(''))]]);
assert.deepEqual(artifactReviewProblems(publicFixture, frozen), []);
for (const [before, after, code] of [
  ['rel=\"noopener noreferrer\"', '', 'LINK'],
  ['Verified Freelancer review', 'Synthetic Identity', 'CAPTION_IDENTITY'],
  ['4.6 out of 5 stars', '5 out of 5 stars', 'RATING'],
  ['review-01', 'missing-key', 'KEY'],
  ['<blockquote><p>', '<blockquote><p>synthetic ', 'TEXT'],
]) {
  const files = new Map(publicFixture); files.set('index.html', Buffer.from(files.get('index.html').toString().replace(before, after)));
  assert(artifactReviewProblems(files, frozen).includes(code), code);
}
for (const [path, text, code] of [['raw.json', '{\"from_user_id\":1}', 'PROVIDER_DATA'], ['client.js.map', 'synthetic', 'SOURCE_MAP']]) {
  const files = new Map(publicFixture); files.set(path, Buffer.from(text));
  assert(artifactReviewProblems(files, frozen).some((value) => value.startsWith(code)), code);
}
const inert = new Map(publicFixture); inert.set('drawing.svg', Buffer.from('053760000003181848172219113636_'));
assert.deepEqual(artifactReviewProblems(inert, frozen), []);
console.log('H4-D-R1 public artifact predicates PASS: 7 adverse subjects and benign SVG numeric subject.');
