#!/usr/bin/env node
/**
 * check-fix-claims
 *
 * **Documentation outrunning the repo, made mechanical.** Five instances across three
 * audits — `master/PROJECT-TRACKER.md` § `A-GATE-4-5` — two of them logged in the same
 * session that wrote down the habit meant to prevent them. `Tabs.tsx` was recorded as fixed
 * in `G5`/`G6` while `git log` showed its last commit predated the whole range.
 *
 * ## What T3 asked for, and why it is not mechanisable as stated
 *
 * The brief was: *every claim of the form "fixed in &lt;file&gt;" in the trackers and
 * handover must correspond to a commit touching that file after the claim's round.* Three
 * things stop that being implementable against the documents as they exist:
 *
 *   1. **The claims do not name files.** They read "All fixed in `G5`/`G6`" and "all nine
 *      are now fixed" — a commit *group* and a *round*. The `Tabs.tsx` claim never mentioned
 *      `Tabs.tsx`. Extracting (claim → file) from that prose is natural-language inference,
 *      not parsing, and a gate built on it would be guessing.
 *   2. **"The claim's round" is not machine-readable.** Rounds are prose headings; there is
 *      no mapping from a round to a commit range or a date that a script can read.
 *   3. **A fix legitimately need not touch the file the finding names.** The stale
 *      `app/not-found.tsx` references were fixed by editing `eslint.config.mjs` and three
 *      documents; the file in the finding does not exist at all.
 *
 * Implementing it anyway would produce a gate that reports confidently on a subject it
 * cannot see — the failure this repository has now recorded nine times.
 *
 * ## The narrowest thing that IS mechanisable, and it is this
 *
 * **Make the fix claims carry the column the prose omits.** `_shared/FIX-LEDGER.md` records,
 * per finding identifier: a status, the files the fix's substance had to touch, and the
 * commit. This gate then checks the ledger against git, and checks the documents against the
 * ledger. It answers exactly one question — *does every identifier the documents discuss have
 * an accounted-for status, and does every claimed fix correspond to a real commit that
 * genuinely touched the named files* — which is the question all five instances failed.
 *
 * It would have caught the `Tabs.tsx` case: the entry names `components/primitives/Tabs.tsx`,
 * and no commit in the `G` range touched it.
 *
 * **It does not detect a commit that touched the file and got the fix wrong.** That is the
 * deliberate-failure proof's job. The two are complementary; neither substitutes for the
 * other, and this docstring says so rather than leaving it to be discovered.
 */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const LEDGER = 'docs/_shared/FIX-LEDGER.md';

/**
 * Documents whose fix claims this gate governs. A claim living anywhere else is out of
 * scope by construction — which is why the list is short and explicit rather than a glob.
 */
const GOVERNED = [
  'docs/_shared/05-HANDOVER.md',
  'docs/master/PROJECT-TRACKER.md',
  'docs/design/PROJECT-TRACKER.md',
  'docs/digital/PROJECT-TRACKER.md',
  'docs/press/PROJECT-TRACKER.md',
];

/**
 * The covered identifier space, matched only inside backticks so ordinary prose cannot
 * produce a false identifier. `A11Y-\d+` is deliberately NOT here — see the ledger's closing
 * section — and that exclusion is asserted below rather than merely documented.
 */
const ID_RE = /`(G\d+b?|R\d+|T\d+|A-GATE-\d+-\d+)`/g;

/**
 * How many rows the ledger must hold. **Hardcoded, deliberately.** Derived from the ledger
 * it would fall with the ledger: delete a row and both the measured and expected counts drop
 * together, green, having checked less. CLAUDE.md, "an expectation derived from its own
 * subject cannot fail when the subject is removed."
 *
 * Raise it in the same commit that adds rows, with the finding in the message.
 */
const EXPECTED_ROWS = 39;

const problems = [];

const ledgerText = readFileSync(LEDGER, 'utf8');

/** Table rows: | `ID` | STATUS | files | commit | */
const rows = [...ledgerText.matchAll(/^\|\s*`([^`]+)`\s*\|\s*(\w+)\s*\|([^|]*)\|([^|]*)\|/gm)].map(
  (m) => ({
    id: m[1],
    status: m[2].trim(),
    files: m[3].trim() === '—' ? [] : m[3].split('·').map((f) => f.trim()).filter(Boolean),
    commit: m[4].trim() === '—' ? null : m[4].trim(),
  }),
);

if (rows.length !== EXPECTED_ROWS) {
  problems.push(
    `the ledger holds ${rows.length} rows, expected ${EXPECTED_ROWS}. Either a row was removed ` +
      '(say why, in the commit) or rows were added without raising EXPECTED_ROWS. A count that ' +
      'follows its own table cannot fail when the table shrinks.',
  );
}

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });

const known = new Set();
for (const row of rows) {
  known.add(row.id);

  if (/^A11Y-/.test(row.id)) {
    problems.push(
      `${row.id}: the A11Y-* identifiers are outside this gate's covered space by decision ` +
        '(FIX-LEDGER.md, closing section). Adding one here silently widens the boundary — ' +
        'widen ID_RE and the ledger prose deliberately, or leave it out.',
    );
    continue;
  }

  if (row.status === 'OPEN' || row.status === 'DEFERRED') {
    if (row.commit || row.files.length > 0) {
      problems.push(
        `${row.id} is ${row.status} but names a commit or files. An unfixed finding must claim ` +
          'neither — that is the whole distinction this column carries.',
      );
    }
    continue;
  }

  if (row.status !== 'FIXED') {
    problems.push(`${row.id}: unknown status "${row.status}". Use FIXED, OPEN or DEFERRED.`);
    continue;
  }

  if (!row.commit || row.files.length === 0) {
    problems.push(
      `${row.id} is FIXED but names ${!row.commit ? 'no commit' : 'no files'}. A fix claim ` +
        'without both is exactly the prose this ledger replaces.',
    );
    continue;
  }

  // The commit must exist and be reachable from HEAD. A claim citing a commit that was
  // rebased away, or that lives only on another branch, is a claim about nothing.
  try {
    git('merge-base', '--is-ancestor', row.commit, 'HEAD');
  } catch {
    problems.push(
      `${row.id} cites commit ${row.commit}, which is not an ancestor of HEAD. It does not ` +
        'exist, or it is not on this branch.',
    );
    continue;
  }

  const touched = new Set(
    git('show', '--name-only', '--format=', row.commit).split('\n').map((l) => l.trim()).filter(Boolean),
  );

  for (const file of row.files) {
    if (!touched.has(file)) {
      problems.push(
        `${row.id} claims a fix in ${file}, but commit ${row.commit} does not touch that file. ` +
          'This is the A-GATE-4-5 shape: a fix recorded against a file nothing changed.',
      );
    }
  }
}

// Every identifier the governed documents discuss must be accounted for. An identifier that
// appears in the tracker and nowhere in the ledger is a claim with no status at all.
let idsSeen = 0;
for (const doc of GOVERNED) {
  let text;
  try {
    text = readFileSync(doc, 'utf8');
  } catch {
    problems.push(
      `${doc} is in GOVERNED but could not be read. A governed document that vanished means ` +
        'this gate is checking less than it claims — repoint the list or restore the file.',
    );
    continue;
  }
  for (const m of text.matchAll(ID_RE)) {
    idsSeen += 1;
    if (!known.has(m[1])) {
      problems.push(
        `${doc} discusses \`${m[1]}\`, which has no row in the ledger. Every identifier this ` +
          'gate covers needs a status — FIXED with a commit and files, or OPEN/DEFERRED.',
      );
    }
  }
}

// A run that matched no identifiers measured nothing. The documents are full of them; zero
// means ID_RE stopped matching or GOVERNED stopped resolving, not that the docs went quiet.
if (idsSeen === 0) {
  problems.push(
    'no covered identifiers found in any governed document. Either ID_RE no longer matches the ' +
      'convention the docs use, or GOVERNED no longer resolves. Both mean this gate measured ' +
      'nothing while reporting a pass.',
  );
}

if (problems.length > 0) {
  console.error(`\ncheck-fix-claims: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error(
    '\nA fix list is a measurable claim and is unverified until something measures it.\n' +
      'Before writing "fixed", `git log --` the file (CLAUDE.md, "How to work").\n',
  );
  process.exit(1);
}

const fixed = rows.filter((r) => r.status === 'FIXED').length;
console.log(
  `check-fix-claims: ${rows.length} ledger entries (${fixed} FIXED, verified against git), ` +
    `${idsSeen} identifier mentions across ${GOVERNED.length} governed documents, all accounted for`,
);
