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

**Status values.** `FIXED` requires a commit that exists, is an ancestor of `HEAD`, and
touches **every** file listed. `DEFERRED` and `OPEN` require no commit and must list none —
they are here so that an identifier cannot be quietly absent.

**Files must name where the fix's substance lives, never only the documents that describe
it.** A docs-only commit satisfying a fix claim is the exact failure this gate exists to
catch.

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
| `G7` | DEFERRED | — | — |
| `G8` | FIXED | scripts/check-bundle-size.mjs | 417e2661 |
| `R1` | FIXED | scripts/check-bundle-size.mjs | c24e9b37 |
| `R2` | FIXED | components/primitives/Tabs.tsx | 3d5157a0 |
| `R3` | FIXED | scripts/check-contrast.mjs | 1b96c4eb |
| `R4` | FIXED | app/(marketing)/gridsmith-error-probe/page.probe.tsx | c8ee3e96 |
| `R5` | FIXED | scripts/check-bundle-size.mjs | 83adf631 |
| `T1` | FIXED | scripts/check-bundle-size.mjs | 46204088 |
| `T2` | FIXED | scripts/check-bundle-size.mjs | 89029ffb |
| `T4` | FIXED | scripts/check-bundle-size.mjs | 46204088 |
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
- **An entry cannot cite its own commit.** The hash does not exist until the work is
  committed, so a fix that adds or changes this gate lands one commit before its own row. The
  gate makes that visible rather than allowing it to be forgotten: the moment a governed
  document mentions the identifier, the missing row fails the build. That is how `T3` — the
  commit introducing this ledger — was caught while being written, which is the behaviour
  wanted, so the sequencing is recorded rather than worked around.
