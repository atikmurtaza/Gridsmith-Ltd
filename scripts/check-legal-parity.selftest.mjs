#!/usr/bin/env node
/**
 * check-legal-parity.selftest
 *
 * **The permanent committed specimens for `check-legal-parity.mjs`'s predicates.**
 *
 * `CLAUDE.md`: *"A fix is not fixed until a permanent committed subject exists for a gate to
 * reach. Deliberate-failure proofs become committed specimens or committed probe routes. Proof
 * artefacts are never deleted after use."* The gate itself cannot host its own proof: it is a
 * top-level-`await` script that fetches before it asserts, so **the only subject its predicates
 * would ever have is whatever a running server happened to serve** — and a server that happens
 * to be right makes a broken predicate indistinguishable from a working one.
 *
 * Same split, and the same reason, as `check-launch-content.selftest.mjs`. Every function under
 * test lives in `legal-parity-rules.mjs` and decides on its arguments alone.
 *
 * **Every branch gets its own specimen.** `CLAUDE.md`: *"One branch firing is not evidence for
 * the others — and a partially-firing gate is more dangerous than a silent one, because it
 * produces green results that look earned."* `check:rls` accepted an `anon` SELECT policy twice
 * while its DELETE branch fired correctly the whole time, and reading the output was
 * indistinguishable from reading the output of a gate that worked.
 *
 * Runs in `verify:static`, where no server exists.
 */
import {
  containsRun,
  currentVersion,
  declaredVersions,
  draftClauseTokens,
  normaliseWords,
  tokenReached,
} from './legal-parity-rules.mjs';

let failures = 0;
let assertions = 0;

const check = (name, actual, expected) => {
  assertions += 1;
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    failures += 1;
    console.error(`  FAIL ${name}\n       expected ${e}\n       got      ${a}`);
  }
};

// ---------------------------------------------------------------------------
// normaliseWords — the comparison unit
// ---------------------------------------------------------------------------

check(
  'normaliseWords: markdown emphasis, backticks and punctuation are not content',
  normaliseWords('**Gridsmith Ltd**, company number `[TK]`.'),
  ['gridsmith', 'ltd', 'company', 'number', 'tk'],
);

check(
  'normaliseWords: a table row and a sentence built from its cells are the same words',
  normaliseWords('| **Vercel** | Website hosting | `[TK — OQ-3]` |'),
  normaliseWords('Vercel — Website hosting. [TK — OQ-3].'),
);

check(
  'normaliseWords: an HTML comment is draft apparatus and contributes nothing',
  normaliseWords('Kept. <!-- L-GDPR-13 — this note is not published --> Also kept.'),
  ['kept', 'also', 'kept'],
);

check(
  'normaliseWords: § and the word "section" are the same reference',
  normaliseWords('see §6A'),
  normaliseWords('see section 6A'),
);

check(
  'normaliseWords: the drafts’ revision markers are dropped from both sides',
  normaliseWords('**5.2 NEW — how you tell us**'),
  ['5', '2', 'how', 'you', 'tell', 'us'],
);

check(
  'normaliseWords: the ordinary lower-case word "new" survives — only the marker goes',
  normaliseWords('this does not cover new requirements'),
  ['this', 'does', 'not', 'cover', 'new', 'requirements'],
);

check(
  'normaliseWords: typographic quotes and dashes normalise',
  normaliseWords('the client’s own design check — verified'),
  ['the', 'client', 's', 'own', 'design', 'check', 'verified'],
);

// ---------------------------------------------------------------------------
// containsRun — branch B's predicate
//
// The failure this branch exists for is F-2: the served privacy policy stated a retention
// period as fact while the draft records retention as NOT IMPLEMENTED. The specimen is that
// sentence pair.
// ---------------------------------------------------------------------------

const DRAFT_RETENTION = normaliseWords(
  'Version 1.0 published a retention table. None of it was implemented, and most of it still ' +
    'is not. There is no purge, no anonymisation and no scheduled delete over the `leads` ' +
    'table anywhere in the repository.',
);

check(
  'containsRun: prose that IS in the draft passes',
  containsRun(DRAFT_RETENTION, normaliseWords('There is no purge, no anonymisation')),
  true,
);

check(
  'containsRun: F-2 — a retention promise the draft does not make is REJECTED',
  containsRun(DRAFT_RETENTION, normaliseWords('Enquiries are kept for 24 months, then deleted.')),
  false,
);

check(
  'containsRun: a single invented connective is enough to reject',
  containsRun(DRAFT_RETENTION, normaliseWords('There is definitely no purge')),
  false,
);

check(
  'containsRun: reordering is rejected — the run must be contiguous and in order',
  containsRun(DRAFT_RETENTION, normaliseWords('no anonymisation, no purge')),
  false,
);

check(
  'containsRun: a needle longer than the draft is rejected rather than throwing',
  containsRun(normaliseWords('short'), normaliseWords('a much longer piece of text')),
  false,
);

check('containsRun: the empty needle is vacuously contained', containsRun(['a'], []), true);

// ---------------------------------------------------------------------------
// currentVersion / declaredVersions — branch A and A2
//
// Specimen A2 is F-9 itself: WEBSITE-TERMS.md carried `**Version:** 1.1` while its own
// round-8 note two lines below announced 1.2, and no gate could see it.
// ---------------------------------------------------------------------------

const HEADER_FORM = '**Version:** 1.3 · **Effective from:** `[TK]` · **Status: DRAFT**';
const F9_SPECIMEN =
  '**Version:** 1.1 · **Effective from:** `[TK]` · **Status: DRAFT**\n' +
  '**Version 1.2 — revised 26 August 2026, round 8.** No clause text changed.';
const NOTE_FORM =
  '**Version 1.1 — revised 25 August 2026.**\n' +
  '**Version 1.4 — revised 29 August 2026, round 12.**\n' +
  '**Version 1.2 — revised 26 August 2026, round 7.**';

check('currentVersion: the header form', currentVersion(HEADER_FORM), '1.3');
check('currentVersion: highest, not last, when notes are stacked', currentVersion(NOTE_FORM), '1.4');
check('currentVersion: 1.10 sorts above 1.9, not below it', currentVersion('**Version 1.9 —** x\n**Version 1.10 —** y'), '1.10');
check('currentVersion: a file declaring nothing returns null', currentVersion('no version here'), null);

check('declaredVersions: F-9 — the header is stale and the file knows better', declaredVersions(F9_SPECIMEN).header, '1.1');
check('declaredVersions: F-9 — and the file is really at 1.2', currentVersion(F9_SPECIMEN), '1.2');
check('declaredVersions: the note form has no header to check', declaredVersions(NOTE_FORM).header, null);

// ---------------------------------------------------------------------------
// draftClauseTokens — branch C's extraction
//
// Specimen: the shapes CONSUMER-TERMS.md §5 actually uses. F-1's missing pieces were §5A,
// §5.0, §5.2–§5.5 and §6A, and only one of those is a markdown heading.
// ---------------------------------------------------------------------------

const F1_SPECIMEN = [
  '## 5. Your right to cancel',
  '**5A NEW — which contracts this right applies to.**',
  '**5.0 NEW — how long you have.**',
  '**5.2 NEW — how you tell us, and when it counts.**',
  '## 6A. If we supply you a file rather than perform a service — NEW',
  '10.3 **REVISED — the cover and interior design.**',
  '<!-- 99.9 this lives in a comment and is not a clause -->',
  '1. Tell us: `[TK email]`.',
  '2. We will acknowledge within **5 working days**.',
].join('\n');

check(
  'draftClauseTokens: heading, bold lead-in and plain numbered forms are all found',
  draftClauseTokens(F1_SPECIMEN).map((t) => t.token),
  ['5', '6A', '5A', '5.0', '5.2', '10.3'],
);

check(
  'draftClauseTokens: a heading token is exact; an inline one is not',
  draftClauseTokens(F1_SPECIMEN).filter((t) => t.exact).map((t) => t.token),
  ['5', '6A'],
);

check(
  'draftClauseTokens: a bare numbered list item is NOT a clause — it would fail every document',
  draftClauseTokens(F1_SPECIMEN).some((t) => t.token === '1'),
  false,
);

check(
  'draftClauseTokens: a number inside an HTML comment is not a clause',
  draftClauseTokens(F1_SPECIMEN).some((t) => t.token === '99.9'),
  false,
);

// ---------------------------------------------------------------------------
// tokenReached — branch C's predicate
// ---------------------------------------------------------------------------

const inline = (token) => ({ token, exact: false });
const heading = (token) => ({ token, exact: true });

check('tokenReached: a served section covers its own sub-clauses', tokenReached(inline('5.0'), ['5']), true);
check('tokenReached: a served section covers a lettered lead-in inside it', tokenReached(inline('5A'), ['5']), true);
check('tokenReached: an exact match is reached', tokenReached(heading('6A'), ['6A']), true);
check(
  'tokenReached: F-1 — §6A is a section of its own, so a served clause 6 does NOT cover it',
  tokenReached(heading('6A'), ['5', '6', '7']),
  false,
);
check(
  'tokenReached: and that is the whole point of the exact flag — as an inline token it would',
  tokenReached(inline('6A'), ['5', '6', '7']),
  true,
);
check(
  'tokenReached: the boundary is not a digit — clause 1 must not swallow clause 11',
  tokenReached(inline('11'), ['1']),
  false,
);
check('tokenReached: nothing served reaches nothing', tokenReached(inline('5.0'), []), false);

// ---------------------------------------------------------------------------

if (failures > 0) {
  console.error(`\ncheck-legal-parity.selftest: ${failures} of ${assertions} assertion(s) failed\n`);
  process.exit(1);
}

if (assertions < 30) {
  // The count is asserted for the same reason the gate asserts its own: a self-test that
  // silently stopped running most of its cases would report clean.
  console.error(
    `\ncheck-legal-parity.selftest: only ${assertions} assertion(s) ran. Specimens have been ` +
      'removed — a shrinking self-test reports success by measuring less.\n',
  );
  process.exit(1);
}

console.log(
  `check-legal-parity.selftest: ${assertions} assertion(s) over committed specimens — ` +
    'F-1 (missing §6A), F-2 (an invented retention promise) and F-9 (a stale version header) ' +
    'each rejected by the branch that exists for it',
);
