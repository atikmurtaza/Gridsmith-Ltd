/**
 * **The statutory record is complete for the dataset being built** (`M-05`).
 *
 * Two tiers, and the split is the point.
 *
 * *Always*, in every dataset: the singleton exists and the Companies Act fields carry a
 * value. Every page on the site renders the statutory footer, so an empty one is not a
 * degraded experience — it is a disclosure obligation unmet, and the build should not
 * produce it. This tier is what stops the gate being a no-op today. A check that only fires
 * on `production` would sit green and unexercised until the one build where it matters, and
 * a gate first exercised at launch is a gate nobody has run.
 *
 * *Only when the dataset is `production`*: every field in `LIVE_REQUIRED` is non-empty and
 * no field carries a `[SEED]` marker. Each of those is legitimately empty today — a required
 * field with a known-empty value, not an absent one, and the footer omits its line while it
 * is empty. What must not happen is that state reaching live.
 *
 * The assertions themselves are in `launch-content-rules.mjs`, so a committed self-test can
 * reach them without a network — see that file and `check-launch-content.selftest.mjs`.
 *
 * No token: both datasets are public. A fetch that fails is a hard failure rather than a
 * skip — the whole class of defect this repository keeps finding is a check that measured
 * nothing and reported clean.
 *
 * ## Seed enforcement — `A-12`, folded in here rather than given its own gate
 *
 * `TECH-SPEC.md` §6 sketches `scripts/check-no-seed-in-prod.ts`, and **its query counts almost
 * nothing**: `count(*[isSeed == true && published == true])`. Only `service` has a `published`
 * field — `project`, `faq`, `testimonial`, `post` and `teamMember` do not — so for five of the
 * six seedable types the predicate is `undefined == true` and the count comes back zero from a
 * dataset full of published seed records. In Sanity, "published" means the document id carries
 * no `drafts.` prefix, which is a different thing entirely. Hence
 * `!(_id in path("drafts.**"))`.
 *
 * It also keyed off a third environment variable, `NEXT_PUBLIC_ENV`. Three variables meaning
 * overlapping things is how `M-P1-2` happened. The dataset is already the single fact that
 * says "live", so this keys off the same `PRODUCTION_DATASET` as everything else here.
 *
 * **The count is asserted to be a number in every dataset**, not merely compared to zero on
 * production. A query that returns anything else — a null, an object, an error status — would
 * make `> 0` false and report clean, on the one check whose entire purpose is to stop
 * fabricated case studies reaching production.
 *
 * **`process.exitCode`, never `process.exit()`.** Calling `process.exit()` while undici's
 * connection pool is still open aborts the process on Windows — `Assertion failed:
 * !(handle->flags & UV_HANDLE_CLOSING)` — and an abort's exit status is not the 1 this gate
 * meant to return. Measured: the failing path reported 127. Setting `exitCode` and letting
 * the loop drain returns 1 on every platform.
 */
import { SANITY_API_VERSION, SANITY_PROJECT_ID, PRODUCTION_DATASET } from '../sanity/project.ts';
import { evaluate, ALWAYS_REQUIRED, LIVE_REQUIRED } from './launch-content-rules.mjs';

/**
 * ## Two modes, because there are two different questions — `M-P1-14`
 *
 * ### `--build`: is the dataset THIS BUILD is compiling against clean?
 *
 * This mode exists because **Vercel never ran this gate at all**. Vercel's build is
 * `vercel build` -> framework detection -> `npm run build` -> `next build`. `check:launch`
 * lived only in `verify:served`, which runs in CI and nowhere else. Production was protected
 * by an unrelated accident — `getCompanyDetails()` throwing on the empty `production`
 * dataset — and **a production dataset seeded with placeholder content would have satisfied
 * that throw and never met this gate.** The build would have gone green and published
 * `[SEED]` content. Same exclusion class as every other one in this repository, one layer
 * out: the gate covered CI's path, not the deploy's.
 *
 * It is now wired as `prebuild` in `package.json`, which npm runs before `build` — so it is
 * in the path that actually deploys, and it fires *before* `next build` reaches
 * `getCompanyDetails()`. That ordering is deliberate: on an empty or seeded production
 * dataset two things can now fail, and this one failing first is what makes it possible to
 * say which gate fired.
 *
 * ### Reading the dataset from `process.env` here is NOT the `M-P1-7` defect
 *
 * `M-P1-7` was a CI runner asserting about a *deployment* — a different machine, whose
 * `NEXT_PUBLIC_SANITY_DATASET` was `development` while the deployment's was `production`. The
 * premise was read from the wrong system, so the gate announced that the live-only assertions
 * did not apply and exited 0.
 *
 * In `--build` mode there is no other system. This process is a child of the same build that
 * is about to run `next build`, in the same environment, and `next.config.ts` reads the same
 * variable to decide what the app connects to. The build's own environment **is** the subject
 * here, not a guess about a remote one. That is the distinction "ask the system" turns on: ask
 * the system you are asserting about. In served mode the system is a running site, so the
 * dataset comes from its header; in build mode the system is this build.
 *
 * An unset variable is a hard failure, never a default. `sanity/env.ts` records why at length
 * (`M-P1-2`): a fallback to `development` on a host would publish a `[SEED]` VAT number.
 *
 * ### served (default): which dataset did the RUNNING SITE build against?
 *
 * Unchanged, and still what CI runs. The site emits `x-gridsmith-dataset` on every route
 * (`next.config.ts`). **A missing header is a hard failure, not a fall-back.** Falling back to
 * this process's environment is precisely `M-P1-7`; falling back to "assume development" would
 * be worse, because it turns the live tier off. A site that has stopped reporting is a subject
 * that has stopped being one.
 */
const BUILD_MODE = process.argv.includes('--build');
const BASE_URL = process.env.AXE_BASE_URL ?? 'http://127.0.0.1:3000';

/** What the SITE (or, in build mode, THIS BUILD) says it is using. Never an assumption. */
let SANITY_DATASET;
/** How the dataset was established, for the summary line. Never omitted — see below. */
let SOURCE;

if (BUILD_MODE) {
  SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
  SOURCE = 'this build’s NEXT_PUBLIC_SANITY_DATASET';
  if (!SANITY_DATASET) {
    console.error(
      '\ncheck-launch-content --build: NEXT_PUBLIC_SANITY_DATASET is not set.' +
        '\n\nThis mode runs inside the build it is asserting about, so this variable is the' +
        '\nbuild’s own statement of which dataset it compiles against — the same one' +
        '\nnext.config.ts reads. There is deliberately no default (M-P1-2): a fallback to' +
        '\n"development" on a host would publish a [SEED] VAT number on every page.' +
        '\n\nFailing rather than guessing.\n',
    );
    process.exit(1);
  }
} else {
  const headRes = await fetch(BASE_URL, { method: 'HEAD' }).catch((e) => ({ ok: false, error: e }));
  SANITY_DATASET = headRes.headers?.get?.('x-gridsmith-dataset') ?? null;
  SOURCE = `the served site at ${BASE_URL}`;
  if (!SANITY_DATASET) {
    console.error(
      `\ncheck-launch-content: ${BASE_URL} did not report an x-gridsmith-dataset header, so this` +
        '\ngate cannot establish which dataset the site was built against. next.config.ts sets it' +
        '\non every route. Reading this process’s NEXT_PUBLIC_SANITY_DATASET instead is the' +
        '\ndefect M-P1-7 records, and assuming "development" would switch the live tier off.' +
        '\nFailing rather than measuring the wrong dataset.\n',
    );
    process.exit(1);
  }
}

const isLive = SANITY_DATASET === PRODUCTION_DATASET;

const query = (groq) =>
  `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}` +
  `?query=${encodeURIComponent(groq)}`;

/**
 * A fetch that rejects is a hard failure, and it is left to reject.
 *
 * An unreachable Sanity, a DNS failure or a severed network throws out of `await fetch`, the
 * rejection is unhandled, and Node exits non-zero with the cause printed. Catching it to
 * report "could not check" and carrying on is the silent-skip defect this whole file guards
 * against. Verified by deliberate failure at `M-P1-14` — see VALIDATION §14.
 */
const res = await fetch(query('*[_type == "companyDetails"][0]'));
const result = res.ok ? (await res.json()).result : null;

/**
 * **Counted unauthenticated, and that is a known limit rather than an oversight.**
 *
 * Sanity treats any document id containing a dot as private, so an unauthenticated count
 * cannot see one. A dataset holding 125 dotted seed records would report 0 here. The
 * mitigation is at the write side, where the ids are chosen: `seed-content.mjs` refuses to
 * publish any document whose `_id` contains a dot. The build has no token and both datasets
 * are public, so a read-side fix is not available to this mode. Recorded in VALIDATION §14.
 */
const seedRes = await fetch(query('count(*[isSeed == true && !(_id in path("drafts.**"))])'));
const publishedSeeds = seedRes.ok ? (await seedRes.json()).result : null;

const problems = evaluate({
  dataset: SANITY_DATASET,
  queryStatus: res.status,
  result,
  seedStatus: seedRes.status,
  publishedSeeds,
});

if (problems.length > 0) {
  console.error(`
check-launch-content: ${problems.length} problem(s) in dataset "${SANITY_DATASET}" (established from ${SOURCE})
`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('');
  process.exitCode = 1;
} else {
  console.log(
    `check-launch-content: ${SOURCE} reports dataset "${SANITY_DATASET}" — ${ALWAYS_REQUIRED.length} statutory field(s) present` +
      (isLive
        ? `, ${LIVE_REQUIRED.map(([f]) => f).join(' and ')} supplied, no [SEED] markers`
        : `; the live-only assertions (${LIVE_REQUIRED.map(([f]) => f).join(', ')}, no [SEED] markers) do not apply to "${SANITY_DATASET}" — the dataset the SYSTEM reported, not one this gate assumed`),
  );
  console.log(
    `check-launch-content: ${publishedSeeds} published seed document(s) counted` +
      (isLive
        ? ' — must be 0 on a live dataset, and is'
        : `; the zero-tolerance rule applies to "${PRODUCTION_DATASET}" only`),
  );
}
