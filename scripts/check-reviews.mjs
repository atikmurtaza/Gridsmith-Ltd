#!/usr/bin/env node
/**
 * check-reviews — the `GS-P05` Freelancer review-integration gate.
 *
 * It answers four questions and **names which one it answered**, because a gate with more than
 * one assertion has more than one green, and `CLAUDE.md` records what happens when a write-up
 * reports the wrong one (`K-13`).
 *
 * | # | Question | Subject | Runs |
 * |---|---|---|---|
 * | 1 | Does the transformation strip every identifying project title? | `lib/reviews/freelancer.ts` | always |
 * | 2 | Does a rendered review carry no client company, amount, currency or project link? | `lib/reviews/freelancer.ts` | always |
 * | 3 | Does the request carry no credential, cookie or session? | `lib/reviews/freelancer.ts` | always |
 * | 4 | Does the **live Freelancer API** still agree with all three? | `www.freelancer.com/api` | `--live` only |
 *
 * ## Why 4 is opt-in, and why that is not a silent skip
 *
 * 1–3 are static and offline, which is what CI has. 4 needs a network and a third party's
 * availability. `CLAUDE.md` is explicit that *"a gate that can skip its subject silently must
 * treat that skip as a hard failure"*, so it does not skip: without `--live` the summary
 * **says the live API was not measured**, and with `--live` a failure to reach it is a hard
 * failure rather than a pass. The two modes print different sentences on purpose.
 *
 * ## What 4 exists to catch, specifically
 *
 * Freelancer's documentation states that `GET /projects/0.1/reviews/` requires an OAuth token
 * with `basic` and `fln:project_manage`. Measured on 16 September 2026 it answers `200`
 * **unauthenticated** with the full public set. The site depends on the measured behaviour, not
 * the documented one, and that divergence is the single largest risk in this integration. This
 * is the check that notices if it closes — and it fails loudly rather than letting the review
 * block quietly empty out.
 *
 * ## What this gate does NOT assert, stated so a green is read correctly
 *
 * It cannot establish that a review body is free of information the *reviewer's own profile
 * does not disclose*. `withholdReason` tests a body against the company Freelancer publishes for
 * that reviewer; a client naming an employer that is not on their profile is not detectable by
 * any automatic rule and is not claimed to be. `--live` therefore **reports** the withheld count
 * rather than asserting it is zero.
 *
 * It is also not `check:service-content`'s question 3. That one's subject is the six review
 * literals hardcoded in `scripts/seed-content.mjs`; this one's subject is the transformation
 * that produces titles from the API. Disjoint subjects, deliberately — neither duplicates the
 * other, and both consume the same `IDENTIFYING_TITLE_FRAGMENTS` denylist so they cannot
 * disagree about what "identifying" means.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  CATEGORIES,
  FREELANCER_PROFILE,
  FREELANCER_USER_ID,
  jobsByReview,
  parsePayload,
  reviewsUrl,
  toReviews,
} from '../lib/reviews/freelancer.ts';
import { IDENTIFYING_TITLE_FRAGMENTS, anonymityProblems } from './service-content-rules.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const live = process.argv.includes('--live');
const problems = [];
const say = (line) => console.log(line);

/* -- 1. The category vocabulary carries no identifying fragment ------------- */

/**
 * The vocabulary is a **closed list of thirteen labels**, so every value the pipeline can ever
 * emit is enumerable and every one is checked here — not a sample, and not the ones that
 * happen to be in use. A fourteenth label added carelessly is caught before it renders.
 */
const vocabulary = CATEGORIES.map((c, i) => ({ id: `CATEGORIES[${i}]`, projectTitle: c.label }));
problems.push(...anonymityProblems(vocabulary));
say(
  `  1. vocabulary: ${vocabulary.length} category label(s) checked against ` +
    `${IDENTIFYING_TITLE_FRAGMENTS.length} identifying fragment(s)`,
);

/* -- 2. A rendered review carries none of the forbidden fields -------------- */

/**
 * The assertion is over the **shape a review is rendered as**, driven through the real
 * transformation with a synthetic payload that carries every forbidden field populated. If a
 * later edit begins passing `paid_amount` or `company` through, this fires.
 *
 * The probe is a subject by construction: each forbidden value below is a distinctive string or
 * number present in the input, so "it did not appear in the output" is a measurement of the
 * transformation rather than an absence with no cause — `CLAUDE.md`, *"a probe has to satisfy
 * the gate's predicate"*.
 */
const FORBIDDEN = {
  company: 'Lime Assistive Technology Ltd',
  paid_amount: 4242,
  currency: 'GBP-PROBE-SIGIL',
  seo_url: 'projects/graphic-design/Some-Client-Project/',
  context_name: 'Artistic Logo Design for Casglu',
};

const probePayload = {
  status: 'success',
  result: {
    reviews: [
      {
        id: 1,
        from_user_id: 7,
        description: 'Clear communication and the work arrived as agreed.',
        rating: 5,
        time_submitted: 1_780_000_000,
        status: 'active',
        paid_amount: FORBIDDEN.paid_amount,
        bid_amount: FORBIDDEN.paid_amount,
        price_usd: FORBIDDEN.paid_amount,
        currency: { code: FORBIDDEN.currency },
        project_id: 99,
        review_context: { context_name: FORBIDDEN.context_name, seo_url: FORBIDDEN.seo_url },
      },
    ],
    users: { 7: { public_name: 'Probe', username: 'probeuser', company: FORBIDDEN.company } },
    projects: { 99: { jobs: [{ name: 'Logo Design' }] } },
    reviews_count: 1,
  },
};

const probeParsed = parsePayload(probePayload);
if (!probeParsed.success) {
  problems.push('2: the probe payload did not parse — the forbidden-field assertion measured nothing');
} else {
  const rendered = JSON.stringify(toReviews(probeParsed.data, jobsByReview(probePayload)).published);
  if (rendered === '[]') {
    problems.push('2: the probe produced no rendered review — the forbidden-field assertion measured nothing');
  }
  for (const [name, value] of Object.entries(FORBIDDEN)) {
    if (rendered.includes(String(value))) {
      problems.push(`2: a rendered review carries "${name}" (${value}) — it must never reach the page`);
    }
  }
  say(`  2. rendered shape: ${Object.keys(FORBIDDEN).length} forbidden field(s) absent from 1 rendered review`);
}

/* -- 3. The request carries no credential ---------------------------------- */

/**
 * Read from the URL the app actually builds and from the module source, not from a second
 * hand-written copy of either — the two artefacts would then have to agree and nothing would
 * assert that they did (`01-VALIDATION-REPORT.md` §21).
 */
const url = reviewsUrl();
const source = readFileSync(join(root, 'lib', 'reviews', 'freelancer.ts'), 'utf8');
const CREDENTIAL_MARKERS = ['Freelancer-OAuth-V1', 'oauth', 'access_token', 'credentials:', 'Cookie', 'Authorization'];
for (const marker of CREDENTIAL_MARKERS) {
  // `oauth` appears in prose explaining why none is sent; only code lines count.
  const hits = source
    .split('\n')
    .filter((l) => !l.trimStart().startsWith('*') && !l.trimStart().startsWith('//'))
    .filter((l) => l.toLowerCase().includes(marker.toLowerCase()));
  if (hits.length > 0) problems.push(`3: the module's code mentions "${marker}" — this request must carry no credential`);
}
if (!url.startsWith('https://')) problems.push('3: the request is not over https');
if (!url.includes(String(FREELANCER_USER_ID))) problems.push('3: the request does not filter to the Gridsmith account');
say(`  3. request: https, no credential marker in code, filtered to user ${FREELANCER_USER_ID}`);

/* -- 4. The live API ------------------------------------------------------- */

/**
 * **The review set a human has actually read — `GS-O015`, `GS-R001`.**
 *
 * Hardcoded, and hardcoded is the point: an expectation read from the API cannot fail when the
 * API changes, which is the entire class `check:tokens` carries a literal `REQUIRED` list to
 * avoid. The API is the subject; this is the expectation.
 *
 * `GS-O015` requires that a review naming an identifiable third party is withheld by rule where
 * a rule can decide, and otherwise **enters a human-review state**. `namedThirdParty` is the
 * rule. This is the human-review state, and it is the whole of it: when Freelancer returns a set
 * that is not the one somebody read, this gate goes red and names the difference. A new review
 * cannot reach the homepage without a person having seen a run that reported it.
 *
 * **It goes red on a good change too** — a new five-star review moves `total` and `published`
 * just as a problematic one does, and that is not a defect in the assertion. The action either
 * way is the same: read the new body, then move these numbers in a commit. That is a person
 * deciding, which is what the owner asked for and what no predicate can do.
 *
 * Measured 16 September 2026: the API returns 12, ten are publishable, and two name
 * *Varnika Software PVT* / *Varnika Pvt* and are withheld by rule.
 *
 * **Moved to 13 / 11 / 2 on 18 September 2026 by owner decision `GS-O020: PUBLISH`.** One new
 * review arrived — James, 5/5, 17 September 2026, Illustration — and this gate went red until a
 * person had read it, which is what it is for. The owner read it and approved it. That approval
 * is for this review only: the next new review turns this red again and needs its own decision.
 */
const EXPECTED = { total: 13, published: 11, withheld: 2 };

let liveLine = '  4. live API: NOT MEASURED — run with --live to read www.freelancer.com';

if (live) {
  try {
    const response = await fetch(url, { headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const raw = await response.json();
    const parsed = parsePayload(raw);
    if (!parsed.success) throw new Error(`payload rejected: ${parsed.error.issues[0]?.message}`);

    const count = parsed.data.result.reviews_count;
    const { published, withheld } = toReviews(parsed.data, jobsByReview(raw));
    const returned = parsed.data.result.reviews.length;

    if (returned === 0) problems.push('4: the live API returned zero reviews — the live assertion measured nothing');
    if (typeof count === 'number' && count !== returned) {
      problems.push(`4: the API reports ${count} review(s) but returned ${returned} — the read is incomplete`);
    }
    problems.push(...anonymityProblems(published.map((r) => ({ id: r.id, projectTitle: r.projectTitle }))));

    for (const r of published) {
      if (r.authorCompany !== null) problems.push(`4: review ${r.id} carries a client company`);
      if (typeof r.rating !== 'number') problems.push(`4: review ${r.id} lost its rating`);
      if (r.quote.trim().length === 0) problems.push(`4: review ${r.id} has an empty body`);
      if (r.sourceUrl !== FREELANCER_PROFILE) problems.push(`4: review ${r.id} does not link to the public profile`);
    }

    const ids = published.map((r) => r.id);
    if (new Set(ids).size !== ids.length) problems.push('4: the published set contains a duplicate review id');

    // The human-review limb. See EXPECTED.
    for (const [key, actual] of [
      ['total', returned],
      ['published', published.length],
      ['withheld', withheld.length],
    ]) {
      if (actual !== EXPECTED[key]) {
        problems.push(
          `4: ${key} is ${actual}, and the review set a person last read had ${EXPECTED[key]}. ` +
            'GS-O015 puts a review no human has read into a human-review state rather than onto ' +
            'the homepage. Read the changed body, decide, then move EXPECTED in a commit — do ' +
            'not move it to make this green.',
        );
      }
    }

    liveLine =
      `  4. live API: ${returned} review(s) returned, reported count ${count}; ` +
      `${published.length} published, ${withheld.length} withheld, ` +
      `${published.filter((r) => r.projectTitle).length} categorised, ` +
      `${new Set(ids).size} distinct id(s)`;
    for (const w of withheld) say(`     withheld ${w.id}: ${w.reason}`);
  } catch (error) {
    problems.push(`4: the live Freelancer API could not be measured — ${error.message}`);
    liveLine = '  4. live API: FAILED';
  }
}
say(liveLine);

/* -- report ---------------------------------------------------------------- */

if (problems.length > 0) {
  console.error(`\ncheck-reviews: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('');
  process.exit(1);
}

console.log(
  `\ncheck-reviews: PASS — questions 1-3 answered${live ? ' and the live API agrees' : '; the live API was NOT measured'}.\n`,
);
