# Fix ledger

**Machine-read by `scripts/check-fix-claims.mjs` (`npm run check:claims`). Edit the table,
not the prose, and read that gate's docstring before changing the format.**

This exists because **documentation outrunning the repo reached five instances across three
audits**, twice in the same session that recorded the habit meant to prevent it — see
`master/PROJECT-TRACKER.md` § `A-GATE-4-5`. A habit that fails while being written down is
not a habit problem.

The prose in the trackers and the handover says things like *"all nine are now fixed"* and
*"All fixed in `G5`/`G6`"*. Those sentences name a **round** and a **commit group**; they do
not name a **file**, which is why nobody noticed that `Tabs.tsx` had never been opened. This
table supplies the missing column, and the gate checks it against git.

**Status values.** `FIXED` requires a commit that exists, is an ancestor of `HEAD`,
**descends from the commit that added the report which raised the finding**, and touches
**every** file listed. `OPEN`, `DEFERRED` and `CEILING` require no commit and must list none —
they are here so that an identifier cannot be quietly absent.

`CEILING` is distinct from `OPEN` and the distinction matters: it marks a **recorded limit of
the approach that will never be fixed**, so it is not backlog. Filing a structural boundary as
`OPEN` puts permanent work on a list and implies the gate could one day close it. There is one
today — `A-GATE-7-6`.

`ACCEPTED` is a fourth, and it is not `CEILING`. A ceiling is a limit nobody chose; an accepted
risk is one **the owner weighed and decided to carry**, with the reasoning recorded and a named
condition for revisiting it. The distinction exists so that a later session cannot reopen a
decision as a bug: an accepted risk on an `OPEN` list looks like an oversight, and the next
person to read it will helpfully "fix" the thing that was declined. There is one today —
`M-P1-1`. An `ACCEPTED` row must carry no commit and no files, like the others.

**Files must name where the fix's substance lives, never only the documents that describe
it.** A docs-only commit satisfying a fix claim is the exact failure this gate exists to
catch. **Asserted, not merely stated** — a `FIXED` row whose files are all under `docs/` fails
(`A-GATE-6-5`, where this paragraph existed and enforced nothing).

**What is asserted is path shape, not substance** (`A-GATE-7-4`). A file list cannot show which
file carried the change, so a single incidental non-`docs/` entry disarms the check
(`A-GATE-7-3`), documentation outside `docs/` is invisible to it, and a code path whose diff is
comment-only reads as substance — `R5` is exactly that. Read the rule as a floor on the shape
of a claim, never as confirmation that the substance is where it says.

| ID | Status | Files | Commit |
|---|---|---|---|
| `G1` | FIXED | styles/themes/press.css · scripts/check-contrast.mjs | fe37bf37 |
| `G1b` | FIXED | styles/themes/master.css · styles/themes/design.css · styles/themes/digital.css · styles/themes/press.css · scripts/check-contrast.mjs | 99581130 |
| `G2` | FIXED | components/primitives/Stepper.tsx · scripts/check-headings.mjs · app/(marketing)/%5Fkitchen-sink/page.tsx | b7ec6137 |
| `G3` | FIXED | components/primitives/content.module.css · scripts/check-axe.mjs · app/(marketing)/%5Fkitchen-sink/page.tsx | 16620224 |
| `G4` | FIXED | scripts/check-axe.mjs | 0489b3a7 |
| `G5` | FIXED | app/(marketing)/gridsmith-error-probe/page.tsx · eslint.config.mjs | 980c4406 |
| `G5b` | FIXED | app/(marketing)/gridsmith-error-probe/page.probe.tsx · next.config.ts | c3e9ec17 |
| `G6` | FIXED | scripts/check-invented-content.mjs · app/(marketing)/%5Fkitchen-sink/page.tsx | 37838a29 |
| `G7` | FIXED | app/(digital)/digital/page.tsx · app/(press)/press/page.tsx · docs/digital/PROJECT-TRACKER.md · docs/press/PROJECT-TRACKER.md · docs/_shared/01-VALIDATION-REPORT.md | 3fee1602 |
| `G8` | FIXED | scripts/check-bundle-size.mjs | 417e2661 |
| `R1` | FIXED | scripts/check-bundle-size.mjs | c24e9b37 |
| `R2` | FIXED | components/primitives/Tabs.tsx | 3d5157a0 |
| `R3` | FIXED | scripts/check-contrast.mjs | 1b96c4eb |
| `R4` | FIXED | app/(marketing)/gridsmith-error-probe/page.probe.tsx | c8ee3e96 |
| `R5` | FIXED | scripts/check-bundle-size.mjs | 83adf631 |
| `T1` | FIXED | scripts/check-bundle-size.mjs | 46204088 |
| `T2` | FIXED | scripts/check-bundle-size.mjs | 89029ffb |
| `T3` | FIXED | scripts/check-fix-claims.mjs · docs/_shared/FIX-LEDGER.md | 8d94e6e2 |
| `T4` | FIXED | scripts/check-bundle-size.mjs | 46204088 |
| `U1` | FIXED | scripts/check-fix-claims.mjs | c5993d3a |
| `U2` | FIXED | scripts/check-fix-claims.mjs · docs/_shared/FIX-LEDGER.md | c5993d3a |
| `U3` | FIXED | scripts/check-fix-claims.mjs | c5993d3a |
| `A-GATE-4-1` | FIXED | scripts/check-contrast.mjs | 1b96c4eb |
| `A-GATE-4-3` | FIXED | scripts/check-bundle-size.mjs | c24e9b37 |
| `A-GATE-4-4` | FIXED | scripts/check-bundle-size.mjs | 83adf631 |
| `A-GATE-4-5` | FIXED | components/primitives/Tabs.tsx | 3d5157a0 |
| `A-GATE-4-6` | FIXED | app/(marketing)/gridsmith-error-probe/page.probe.tsx | c8ee3e96 |
| `A-GATE-4-2` | OPEN | — | — |
| `A-GATE-4-7` | OPEN | — | — |
| `A-GATE-4-8` | OPEN | — | — |
| `A-GATE-4-9` | OPEN | — | — |
| `A-GATE-4-10` | OPEN | — | — |
| `A-GATE-4-11` | OPEN | — | — |
| `A-GATE-4-12` | OPEN | — | — |
| `A-GATE-4-13` | OPEN | — | — |
| `A-GATE-5-1` | FIXED | scripts/check-bundle-size.mjs | 46204088 |
| `A-GATE-5-3` | FIXED | scripts/check-bundle-size.mjs | 89029ffb |
| `A-GATE-5-5` | FIXED | scripts/check-bundle-size.mjs | 46204088 |
| `A-GATE-5-2` | OPEN | — | — |
| `A-GATE-5-4` | OPEN | — | — |
| `A-GATE-5-6` | OPEN | — | — |
| `A-GATE-5-7` | OPEN | — | — |
| `A-GATE-5-8` | OPEN | — | — |
| `A-GATE-6-1` | OPEN | — | — |
| `A-GATE-6-2` | OPEN | — | — |
| `A-GATE-6-6` | OPEN | — | — |
| `A-GATE-6-3` | FIXED | scripts/check-fix-claims.mjs | c5993d3a |
| `A-GATE-6-4` | FIXED | scripts/check-fix-claims.mjs | c5993d3a |
| `A-GATE-6-5` | FIXED | scripts/check-fix-claims.mjs | c5993d3a |
| `A-GATE-6-7` | FIXED | scripts/check-fix-claims.mjs · docs/_shared/FIX-LEDGER.md | c5993d3a |
| `A-GATE-6-8` | OPEN | — | — |
| `A-GATE-7-1` | OPEN | — | — |
| `A-GATE-7-2` | OPEN | — | — |
| `A-GATE-7-3` | OPEN | — | — |
| `A-GATE-7-4` | OPEN | — | — |
| `A-GATE-7-5` | OPEN | — | — |
| `A-GATE-7-6` | CEILING | — | — |
| `M-P1-1` | ACCEPTED | — | — |
| `M-P1-12` | FIXED | scripts/with-server.mjs | a0e7db2a |
| `M-P1-14` | OPEN | — | — |
| `F-1` | FIXED | scripts/seed-legal.mjs · docs/_legal/CONSUMER-TERMS.md | 9da8f5c1 |
| `F-2` | FIXED | scripts/seed-legal.mjs · docs/_legal/PRIVACY-POLICY.md | 9da8f5c1 |
| `F-3` | FIXED | scripts/seed-legal.mjs | 9da8f5c1 |
| `F-4` | FIXED | scripts/seed-legal.mjs | 9da8f5c1 |
| `F-5` | FIXED | scripts/seed-legal.mjs | 9da8f5c1 |
| `F-6` | FIXED | scripts/seed-legal.mjs | 9da8f5c1 |
| `F-7` | FIXED | scripts/seed-legal.mjs · docs/_legal/COOKIE-POLICY.md | 9da8f5c1 |
| `F-8` | OPEN | — | — |
| `F-9` | FIXED | scripts/legal-parity-rules.mjs · docs/_legal/WEBSITE-TERMS.md | 9da8f5c1 |
| `F-10` | OPEN | — | — |
| `F-11` | OPEN | — | — |

**`M-P1-14` is `OPEN` because the work is in the working tree and uncommitted, not because it
is undone.** VALIDATION §19 records the deliberate-failure proof in full. Promote this row to
`FIXED` in the commit that lands it, naming
`package.json`, `vercel.json`, `scripts/check-launch-content.mjs`,
`scripts/launch-content-rules.mjs`, `scripts/check-launch-content.selftest.mjs`,
`scripts/check-node-version.mjs` and `.github/workflows/ci.yml`. Writing `FIXED` now would be
exactly the well-formed-but-false claim `A-GATE-7-6` records as this gate's ceiling.

## What this gate does not cover, stated rather than left to be discovered

- **`A11Y-1` … `A11Y-32` are outside the covered identifier space, deliberately.** They
  predate run 3 and their fixes are spread across sessions whose commits were not recorded
  per-finding. Retro-fitting them would mean reconstructing attributions from prose, which is
  the same guesswork this gate exists to remove. The exclusion is asserted in the gate, not
  merely mentioned here: adding an `A11Y-` row fails, so the boundary cannot drift silently.
- **A commit touching a file does not prove it fixed anything.** This gate detects the
  *"never touched at all"* case — which is what happened to `Tabs.tsx` — and cannot detect a
  commit that touched the file and got the fix wrong. That is what the deliberate-failure
  proof is for, and the two are complementary rather than substitutes.
- **`OPEN` and `DEFERRED` are unverified by construction.** The gate checks only that the
  identifier is accounted for, not that the status is honest.
- **An entry cannot cite its own commit, and that is the one residual gap.** A commit cannot
  contain its own hash, so a fix lands one commit before its row can name it. **The correct
  response is to add the row in the next commit, never to stop mentioning the identifier.**

  The first version of this section got that wrong. `T3` — the change introducing this
  ledger — was caught by the gate while being written, and the fix shipped was to delete the
  identifier from the handover so nothing demanded a row. That left the gate silent on the
  very change it shipped with, and it published a general escape hatch: coverage triggers on a
  backticked mention in a governed document, so removing the mention removes the obligation.
  A limitation was written up as a virtue (`A-GATE-6-7`). `T3` now has its row, and the
  handover names it again.

  **What is genuinely irreducible, stated so nobody re-derives it:** between a fix commit and
  the commit that adds its row, that one identifier is unrowed. `U1`, `U2`, `U3` and the run-6
  findings they close were in that window and are now rowed against `c5993d3a`. It is a
  one-commit window on a known list, not an open-ended hole; closing it would need the gate to
  read the working tree rather than history, which is a different gate answering a different
  question.

- **The obligation to have a row is triggered spatially, not universally** (`A-GATE-7-2`).
  Coverage fires on a backticked mention in one of the five `GOVERNED` documents. An identifier
  that has never had a row and is discussed only elsewhere — a run report, this ledger —
  creates no obligation and the gate stays green. For an identifier that *does* have a row the
  escape is closed: deleting the row and the mention together still trips `EXPECTED_ROWS`.
  Widening `GOVERNED` to the run reports is `A-GATE-6-6`, open.

- **The ceiling, and it is the important one.** Everything above narrows the set of
  *implausible* claims. **None of it reaches whether the change did what it says**, because the
  status column is written by the person this ledger exists to check — promoting an `OPEN` row
  to `FIXED` against the current commit is accepted in one word and goes fully green
  (`A-GATE-7-6`). **A `FIXED` row is evidence that a claim is well-formed, not that it is
  true.** What establishes that a fix occurred is the deliberate-failure proof. Recorded in
  `CLAUDE.md` beside the standing rules, because it bounds the approach rather than this
  script.


## The `F-*` rows — `07-STATE-REPORT.md`'s twelve findings

Added 29 August 2026. The boundary is the commit that added the report itself, exactly as
`M-P1-` uses `BEFORE-LAUNCH.md`, and — like `M-P1-` — **`F-\d+` is deliberately absent from
`ID_RE`**. The identifiers are discussed in prose across the legal set, and widening the covered
space would demand a status for every mention from whoever next edits a draft. These rows are
here because there was something to file.

**`F-12` has no row, and the reason is a property of this gate rather than an oversight.** Its
fix — four drafts citing `L-CA-82` alone where the ledger entry is compound and `CNV-7` records
that s. 82's text was never fetched — is **genuinely documents-only**, and a `FIXED` row whose
files are all under `docs/` fails by construction (`A-GATE-6-5`). That rule is right and should
not be softened to admit this: it exists because a docs-only commit satisfying a fix claim is the
exact failure the ledger was built to catch, and the cost of keeping it sharp is that a real
documentation fix cannot be claimed here. `F-12` is recorded in `_legal/03-REVISION-LOG.md`
round 12 §5 instead, and the sweep it describes went to four files where the report named three.

**`F-10` and `F-11` are `OPEN`, not `CEILING`, and the distinction is load-bearing.** Both are
over-promises *inside* a reviewed draft — `CONSUMER-TERMS.md` §5's headline refund is more
generous than the §5.3 it defers to, and §5.0's digital-content bullet points at a period §6A
does not state. `check:legal:parity` is green over both and correct to be green, because it
asserts that the page matches the draft and it does. **The gate's blindness to them is the
CEILING; the findings themselves are OPEN**, and they close when a solicitor rules on the
drafting. Filing them as `CEILING` would say nobody should act, which is wrong — someone should.

**`F-8` is `OPEN` and belongs to the owner**: the footer publishes a fabricated VAT number, which
is a `companyDetails` value and a registration fact, not a legal-draft one.
