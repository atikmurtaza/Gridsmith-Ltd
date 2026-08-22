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
 *   2. ~~**"The claim's round" is not machine-readable.**~~ **This was false and it was the
 *      load-bearing claim.** Every round has a committed report and the commit that added it
 *      is the boundary — see `ROUND_BOUNDARIES`. Asserting it cost six lines and passed every
 *      existing row unchanged, so the weaker gate bought nothing (`A-GATE-6-3`). Struck at
 *      `U1` rather than deleted, because the wrong argument is the reason the gate shipped
 *      weak and is worth more as a record than as a tidy paragraph.
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
 *
 * ## The ceiling — read this before trusting a green line from here
 *
 * Everything below narrows the set of *implausible* claims: a commit that does not exist, is
 * not on this branch, predates the audit, never touched the file, or is documents alone.
 * **None of it reaches whether the change did what it says**, because the ledger's status
 * column is written by the same person the ledger exists to check. Promoting an `OPEN` row to
 * `FIXED` against the current commit is accepted in one word and goes fully green
 * (`A-GATE-7-6`). Tightening further chases an asymptote.
 *
 * **A `FIXED` row is evidence that a claim is well-formed, not that it is true.** What
 * establishes that a fix occurred is the deliberate-failure proof. This is recorded in
 * `CLAUDE.md` beside the standing rules because it bounds the whole verification approach
 * rather than this script.
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
const ID_RE = /`(G\d+b?|R\d+|T\d+|U\d+|A-GATE-\d+-\d+)`/g;

/**
 * **The round each identifier belongs to, and the committed report that opens it.**
 *
 * `A-GATE-6-3`: the first version of this gate argued that "the claim's round is not
 * machine-readable — rounds are prose headings with no mapping to a commit range or a date".
 * **That was wrong, and it was the load-bearing claim.** Every round has a committed report
 * document, and the commit that ADDED that document is the round's boundary:
 * `git log --diff-filter=A -- <report>`. The round is readable from the identifier's prefix;
 * the boundary is readable from git. Nothing about the documents had to change.
 *
 * Getting that wrong bought a weaker gate. Without the constraint below, this file asserted
 * only *"the named file was touched at some point in history"* while its own docstring
 * claimed *"a commit that genuinely touched the named files"*. It accepted `R2` attributed to
 * the July commit that **created** `Tabs.tsx` — the natural misattribution for the very case
 * the gate was built on — and `T1` attributed to a different fix in the same file
 * (`A-GATE-6-4`).
 *
 * Order matters: longest prefix first, so `A-GATE-4-` is tested before any shorter key.
 */
const ROUND_BOUNDARIES = [
  ['A-GATE-4-', 'docs/_shared/09-A-GATE-RUN-4.md'],
  ['A-GATE-5-', 'docs/_shared/10-A-GATE-RUN-5.md'],
  ['A-GATE-6-', 'docs/_shared/11-A-GATE-RUN-6.md'],
  ['A-GATE-7-', 'docs/_shared/12-A-GATE-RUN-7.md'],
  ['G', 'docs/_shared/07-A11Y-AUDIT.md'],
  ['R', 'docs/_shared/09-A-GATE-RUN-4.md'],
  ['T', 'docs/_shared/10-A-GATE-RUN-5.md'],
  ['U', 'docs/_shared/11-A-GATE-RUN-6.md'],
  // `M-P1-*` is the pre-launch P1 list, whose register is BEFORE-LAUNCH.md. It differs from
  // the rows above in that no round *report* raised these findings — they accumulate from
  // sessions. The document that opens the list is still the right boundary and is still read
  // from git: a fix cannot predate the list it is filed against.
  //
  // **This entry exists so an `M-P1-` row can be VERIFIED. It is deliberately not accompanied
  // by an `M-P1-\d+` term in ID_RE, and that asymmetry is the point.** Widening ID_RE was
  // tried and reverted: it pulled 49 identifiers already discussed across the governed
  // documents into the covered space in one commit, each then demanding a status nobody in
  // that commit had audited. The only way to go green would have been to write 49 statuses
  // from prose, which is the guesswork this gate exists to remove — the T3 mistake with the
  // sign flipped, inventing rows instead of deleting a mention.
  //
  // So `M-P1-12` carries a row VOLUNTARILY and is verified like any other: commit exists, is
  // an ancestor, descends from BEFORE-LAUNCH.md's adding commit, touches the file it names,
  // and is not documents alone. Its siblings remain outside coverage, exactly as they were
  // before this commit — no obligation was created and none was removed. Bringing the rest of
  // `M-P1-` in is real work against the real list, not a regex edit. `M-P1-12`.
  ['M-P1-', 'docs/_shared/BEFORE-LAUNCH.md'],
];

/**
 * How many rows the ledger must hold. **Hardcoded, deliberately.** Derived from the ledger
 * it would fall with the ledger: delete a row and both the measured and expected counts drop
 * together, green, having checked less. CLAUDE.md, "an expectation derived from its own
 * subject cannot fail when the subject is removed."
 *
 * Raise it in the same commit that adds rows, with the finding in the message.
 */
const EXPECTED_ROWS = 59;

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

/**
 * The commit that added a round's report. Cached, because `git log` over the same handful of
 * paths once per row is pure waste.
 *
 * **A boundary that cannot be resolved is a hard failure, never a skipped assertion.** If the
 * report is renamed or its adding commit is unreachable, the temporal check silently stops
 * applying to every row of that round — a gate reporting a pass over an assertion it no longer
 * makes, which is the class this repository has recorded nine times.
 */
const boundaryCache = new Map();
function boundaryCommit(id) {
  const entry = ROUND_BOUNDARIES.find(([prefix]) => id.startsWith(prefix));
  if (!entry) return { error: `no round boundary is defined for the identifier prefix of ${id}` };
  const report = entry[1];
  if (boundaryCache.has(report)) return boundaryCache.get(report);

  let result;
  try {
    const raw = git('log', '--diff-filter=A', '--format=%H', '--', report).trim();
    const sha = raw.split(String.fromCharCode(10))[0].trim();
    result = sha
      ? { sha, report }
      : { error: `${report} has no adding commit in this history, so the round it opens has no boundary` };
  } catch {
    result = { error: `could not read the adding commit of ${report}` };
  }
  boundaryCache.set(report, result);
  return result;
}

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

  // CEILING is a recorded limit of the approach that will never be fixed — distinct from
  // OPEN, which asserts that someone should. Labelling a structural boundary as OPEN would
  // put permanent work on a backlog and imply the gate could one day close it.
  // ACCEPTED is a risk the owner has decided to carry, with the reasoning recorded. Distinct
  // from CEILING, which is a limit of the verification approach nobody chose, and from OPEN,
  // which asserts someone should act. Filing an accepted risk as OPEN invites a later session
  // to "fix" a thing that was weighed and declined; there is one today, M-P1-1.
  if (
    row.status === 'OPEN' ||
    row.status === 'DEFERRED' ||
    row.status === 'CEILING' ||
    row.status === 'ACCEPTED'
  ) {
    if (row.commit || row.files.length > 0) {
      problems.push(
        `${row.id} is ${row.status} but names a commit or files. An unfixed finding must claim ` +
          'neither — that is the whole distinction this column carries.',
      );
    }
    continue;
  }

  if (row.status !== 'FIXED') {
    problems.push(
      `${row.id}: unknown status "${row.status}". Use FIXED, OPEN, DEFERRED, CEILING or ACCEPTED.`,
    );
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

  // A fix claim satisfied entirely by the documents that describe it is the failure this
  // ledger exists to catch, and FIX-LEDGER.md said so in prose while asserting nothing
  // (`A-GATE-6-5`). Documents may accompany a fix; they may not BE it.
  if (row.files.every((f) => f.startsWith('docs/'))) {
    problems.push(
      `${row.id} is FIXED but every file it names is under docs/. A fix claim must name where ` +
        "the substance lives — the gate, component or stylesheet that changed. Documents may " +
        'accompany a fix; they cannot be the whole of it.',
    );
    continue;
  }

  // The fix must POSTDATE the report that raised the finding. Without this the check below
  // asks only "was this file ever touched by that commit", which any commit that happens to
  // touch the file satisfies — including the one that created it (`A-GATE-6-4`).
  const boundary = boundaryCommit(row.id);
  if (boundary.error) {
    problems.push(`${row.id}: ${boundary.error}. The temporal check cannot run, so it fails.`);
    continue;
  }
  try {
    git('merge-base', '--is-ancestor', boundary.sha, row.commit);
  } catch {
    problems.push(
      `${row.id} cites commit ${row.commit}, which does not descend from ${boundary.sha.slice(0, 8)} — ` +
        `the commit that added ${boundary.report}, i.e. the report that raised this finding. ` +
        'A fix cannot predate the audit that found it; this is a misattribution, not a fix.',
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
