#!/usr/bin/env node
/**
 * check-service-content — the `GS-P04` content-foundation gate.
 *
 * It answers three questions, and **it names which one it answered**, because a gate with more
 * than one assertion has more than one green and `CLAUDE.md` records what happens when a
 * write-up reports the wrong one (`K-13`: "axe is clean" was true about violations and silent
 * about incompletes, and the gate was red for two sessions).
 *
 * | # | Question | Subject | Runs |
 * |---|---|---|---|
 * | 1 | Does the seeded content represent every approved service, exactly once? | `scripts/service-content.mjs` | always |
 * | 2 | Does the Digital Marketing decomposition resolve to approved services? | `lib/services/catalogue.ts` | always |
 * | 3 | Do the review titles carry no identifying fragment? | `scripts/seed-content.mjs` | always |
 * | 4 | Is the owner review document still the copy it transcribed? | `GS-P05-OWNER-CONTENT-REVIEW.md` | always |
 * | 5 | Does the **dataset** agree with all of them? | the live development dataset | `--dataset` only |
 *
 * ## Why 4 is opt-in, and why that is not a silent skip
 *
 * 1–3 are static and run offline, which is what CI has. 4 needs a network and names a dataset,
 * and `CLAUDE.md` is explicit that *"a gate that can skip its subject silently must treat that
 * skip as a hard failure"* — so it does not skip: without `--dataset` the gate **says in its own
 * summary that the dataset was not measured**, and with `--dataset` a failure to reach it is a
 * hard failure rather than a pass. The two modes report different sentences on purpose.
 *
 * ## Why 4 exists at all
 *
 * Because the committed records and the dataset are two artefacts that must agree, and **only
 * one of them reaches a reader**. That is `01-VALIDATION-REPORT.md` §21's class exactly — the
 * `seed-legal.mjs` divergence, where eleven review rounds checked a document the public never
 * received. Asserting the source alone would repeat it. `--dataset` reads the dataset the way
 * the site reads it: unauthenticated, no token.
 *
 * The expectation for 1 comes from `lib/services/catalogue.ts`, which is **not** the subject —
 * the subject is `service-content.mjs`. Deleting a record fails the gate instead of shrinking
 * its own expectation (`CLAUDE.md`, "an expectation derived from its own subject").
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  APPROVED_SERVICES,
  DIGITAL_MARKETING_ENGAGEMENT,
  UNCONFIRMED_CHANNEL_SERVICES,
} from '../lib/services/catalogue.ts';
import { SANITY_API_VERSION, SANITY_PROJECT_ID, PRODUCTION_DATASET } from '../sanity/project.ts';
import { SERVICES } from './service-content.mjs';
import { anonymityProblems, coverageProblems, engagementProblems } from './service-content-rules.mjs';
import { contentHash } from './owner-content-review.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const withDataset = process.argv.includes('--dataset');
const DATASET = 'development';

const problems = [];
const say = (line) => console.log(line);

/* -- 1. Coverage ---------------------------------------------------------- */

const coverage = coverageProblems({
  approved: APPROVED_SERVICES,
  services: SERVICES,
  unconfirmed: UNCONFIRMED_CHANNEL_SERVICES,
});
problems.push(...coverage);

const recordCount = Object.values(SERVICES).flat().length;
say(
  `coverage:   ${APPROVED_SERVICES.length} approved service(s) across ${recordCount} record(s) ` +
    `(${Object.entries(SERVICES).map(([d, r]) => `${d} ${r.length}`).join(', ')}) — ` +
    `${coverage.length === 0 ? 'each covered exactly once' : `${coverage.length} problem(s)`}`,
);

/* -- 2. The Digital Marketing decomposition ------------------------------- */

const engagement = engagementProblems({
  engagement: DIGITAL_MARKETING_ENGAGEMENT,
  approved: APPROVED_SERVICES,
});
problems.push(...engagement);
say(
  `engagement: ${DIGITAL_MARKETING_ENGAGEMENT.length} Digital Marketing activit(ies) — ` +
    `${engagement.length === 0 ? 'every one resolves to an approved service or to master orchestration' : `${engagement.length} problem(s)`}`,
);

/* -- 3. Review anonymity, over the committed source ------------------------ */

/**
 * The subject is the source text rather than the `REVIEWS` constant, because the constant is not
 * exported and importing `seed-content.mjs` would run it — it needs a write token and it now
 * deletes. Reading the file is the honest way to have a subject at all.
 *
 * **The parse asserts what it found.** A regex that matched nothing would report zero titles and
 * zero problems, which is the "count that was never counted" failure `CLAUDE.md` names: the
 * expected count is therefore hardcoded, from outside the file being read.
 */
const EXPECTED_REVIEWS = 6;
const seedSource = readFileSync(join(root, 'scripts', 'seed-content.mjs'), 'utf8');
const reviewBlock = seedSource.slice(
  seedSource.indexOf('const REVIEWS = ['),
  seedSource.indexOf('const testimonialDocs'),
);
const reviewRows = [...reviewBlock.matchAll(/^\s*\['([a-z-]+)',\s*'[^']*',\s*(?:null|'[^']*'),\s*(null|'[^']*')/gm)];

if (reviewRows.length !== EXPECTED_REVIEWS) {
  problems.push(
    `REVIEWS: parsed ${reviewRows.length} review row(s) from seed-content.mjs, expected ` +
      `${EXPECTED_REVIEWS}. Either the count changed — update this gate and the owner record — ` +
      'or the parse has stopped matching and is measuring nothing.',
  );
} else {
  const reviews = reviewRows.map((m) => ({
    id: m[1],
    projectTitle: m[2] === 'null' ? null : m[2].slice(1, -1),
  }));
  const named = reviews.filter((r) => r.projectTitle !== null).length;
  const identifying = anonymityProblems(reviews);
  problems.push(...identifying);
  // The count, not a fixed phrase. This line read "— no identifying fragment found"
  // unconditionally, and the deliberate-failure proof printed it above two problems saying the
  // opposite. A summary that cannot be wrong is not evidence the check ran (CLAUDE.md).
  say(
    `reviews:    ${reviews.length} review(s) in seed-content.mjs, ${named} carrying a category ` +
      `of work and ${reviews.length - named} deliberately without — ` +
      `${identifying.length === 0 ? 'no identifying fragment found' : `${identifying.length} identifying fragment(s) FOUND`}`,
  );
}

/* -- 4. The owner review document still transcribes this copy --------------- */

/**
 * `GS-P05`. `docs/_shared/GS-P05-OWNER-CONTENT-REVIEW.md` is what the owner reads to close
 * `GS-O013` — 46 records transcribed verbatim out of `service-content.mjs`, because reading 46
 * Sanity documents is not a review.
 *
 * Two artefacts that must agree, only one of which reaches the reader. That is
 * `01-VALIDATION-REPORT.md` §21 exactly, and what it costs here is specific: if the copy is
 * edited after the owner has read the document, the approval silently attaches to wording that
 * no longer exists. **A stale approval is worse than no approval**, because it looks settled and
 * nobody reopens it.
 *
 * Generating the document removes the drift; this assertion removes the *undetected* drift.
 * Regenerating with `npm run docs:content-review` is a deliberate act that reopens the review.
 */
const reviewDocPath = join(root, 'docs', '_shared', 'GS-P05-OWNER-CONTENT-REVIEW.md');
try {
  const reviewDoc = readFileSync(reviewDocPath, 'utf8');
  const recorded = reviewDoc.match(/\*\*Source SHA-256:\*\* `([0-9a-f]{64})`/)?.[1];
  const actual = contentHash();
  if (!recorded) {
    problems.push(
      'OWNER REVIEW: GS-P05-OWNER-CONTENT-REVIEW.md records no source hash — it cannot be shown ' +
        'to transcribe the current copy, so this assertion measured nothing.',
    );
  } else if (recorded !== actual) {
    problems.push(
      `OWNER REVIEW: service-content.mjs now hashes to ${actual.slice(0, 12)}\u2026 but the owner ` +
        `review document transcribes ${recorded.slice(0, 12)}\u2026. The copy changed after the ` +
        'document was written, so any approval against it is stale. Regenerate with ' +
        '`npm run docs:content-review`.',
    );
  }
  say(
    `ownerdoc:   the owner review document transcribes ` +
      `${recorded ? `${recorded.slice(0, 12)}\u2026` : 'NO HASH'}; service-content.mjs is ` +
      `${actual.slice(0, 12)}\u2026 \u2014 ${recorded === actual ? 'in agreement' : 'DIVERGED'}`,
  );
} catch {
  problems.push(
    'OWNER REVIEW: GS-P05-OWNER-CONTENT-REVIEW.md could not be read. It is the artefact ' +
      '`GS-O013` is answered against; a missing one is a hard failure, not a skip.',
  );
}

/* -- 5. The dataset, read the way the site reads it ----------------------- */

if (!withDataset) {
  say(
    `dataset:    NOT MEASURED. This run asserted the committed source only. ` +
      `Run \`npm run check:service-content:dataset\` to assert the "${DATASET}" dataset too.`,
  );
} else if (DATASET === PRODUCTION_DATASET) {
  problems.push(`DATASET: refusing to measure "${DATASET}" — that is the production dataset`);
} else {
  const query = async (groq) => {
    const url =
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${DATASET}` +
      `?query=${encodeURIComponent(groq)}`;
    const res = await fetch(url);
    if (res.status !== 200) throw new Error(`HTTP ${res.status} from the ${DATASET} dataset`);
    return (await res.json()).result;
  };

  try {
    const services = await query(
      '*[_type == "service" && published == true && !(_id in path("drafts.**"))]' +
        '{"slug": slug.current, "title": title, "group": capabilityGroup, "covers": capabilities, division}',
    );
    const reviews = await query(
      '*[_type == "testimonial" && !(_id in path("drafts.**"))]{"id": _id, projectTitle}',
    );
    const stragglers = await query(
      '*[coalesce(isSeed, false) == true && !(_id in path("drafts.**")) && !(_id match "seed-*")]{_id, _type}',
    );

    const byDivision = { design: [], digital: [], press: [] };
    for (const s of services) (byDivision[s.division] ??= []).push(s);

    problems.push(
      ...coverageProblems({
        approved: APPROVED_SERVICES,
        services: byDivision,
        unconfirmed: UNCONFIRMED_CHANNEL_SERVICES,
      }).map((p) => `DATASET ${p}`),
      ...anonymityProblems(reviews).map((p) => `DATASET ${p}`),
    );
    if (reviews.length !== EXPECTED_REVIEWS) {
      problems.push(
        `DATASET: ${reviews.length} testimonial(s) in "${DATASET}", expected ${EXPECTED_REVIEWS}`,
      );
    }
    for (const s of stragglers) {
      problems.push(
        `DATASET: ${s._id} (${s._type}) is marked isSeed but its id does not begin "seed-" — ` +
          'the two provenance markers disagree, so the reseed cannot tell it from a genuine record',
      );
    }
    say(
      `dataset:    "${DATASET}" read unauthenticated — ${services.length} published service(s), ` +
        `${reviews.length} testimonial(s), ${stragglers.length} provenance mismatch(es)`,
    );
  } catch (error) {
    problems.push(`DATASET: ${error.message} — nothing about the dataset was measured`);
  }
}

/* -- Result --------------------------------------------------------------- */

if (problems.length > 0) {
  console.error(`\ncheck-service-content: ${problems.length} problem(s)\n`);
  for (const problem of problems) console.error(`  ${problem}`);
  console.error('');
  process.exit(1);
}

say(
  `\ncheck-service-content: PASS — coverage, engagement map, review anonymity and owner-document parity` +
    `${withDataset ? ` and the "${DATASET}" dataset` : ' (source only; the dataset was not measured)'}\n`,
);
