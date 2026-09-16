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

if (failures > 0) {
  console.error(`\ncheck-reviews selftest: ${failures} of ${ran} case(s) FAILED\n`);
  process.exit(1);
}
console.log(`\ncheck-reviews selftest: PASS — ${ran} case(s), every rule limb asserted by return value.\n`);
