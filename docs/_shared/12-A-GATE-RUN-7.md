# A-GATE run 7 — scoped re-verification of U1–U3

**Date:** 14 August 2026 · **Branch:** `feat/a-01-a-10a-scaffold-ci` · **Runtime:** Node 24.15.0
· **Working tree:** clean at finish. Single agent, one narrow run, one commit under review:
`c5993d3a`.

Scoped to `U1`, `U2` and `U3` and nothing else. `G1`–`G8`, `R1`–`R5`, `T1`/`T2`/`T4`, the
carried P2 backlog and the four run-6 findings deliberately left OPEN were all out of scope.
`npm run verify` green; `check-node-version` reconciles **17 gates**.

**Findings are left as written.**

---

## Result

All three fixes are **present, subject-backed, and proven red on their stated repro.** Each
also leaves a live evasion, and the gate as a whole accepts a fabricated fix claim in one
word.

| Fix | Does what it was specified to do | Findings |
|---|---|---|
| **U1** — round-boundary constraint | **yes** | `A-GATE-7-1` — one-sided |
| **U2** — `T3`'s own row | **yes** | `A-GATE-7-2` — closes the escape only for rowed identifiers |
| **U3** — docs-only rejection | **yes** | `A-GATE-7-3`, `A-GATE-7-4` |

### What was proven

**U1.** Every prefix in the ledger maps, and each resolves to the right report:
`07-A11Y-AUDIT.md → b4fb2d6e` (`G*`), `09-A-GATE-RUN-4.md → c24e9b37` (`R*`, `A-GATE-4-*`),
`10-A-GATE-RUN-5.md → c60fc8ac` (`T*`, `A-GATE-5-*`), `11-A-GATE-RUN-6.md → d197af0c` (`U*`,
`A-GATE-6-*`). All three misattributions run 6 demonstrated are now rejected:

```
R2 -> fe9be1bb (the commit that CREATED Tabs.tsx)   EXIT=1
R2 -> 84cc0c21 (unrelated, also touches Tabs.tsx)   EXIT=1
T1 -> 417e2661 (a different fix in the same file)   EXIT=1
```

All 26 FIXED rows pass unchanged, as predicted. **It cannot silently stop applying:** a
renamed report gives *"the temporal check cannot run, so it fails"* across all seven affected
rows, and an unmapped prefix fails by name. Deleting the report from the working tree is
correctly exit 0 — the boundary is a fact of history and `git log --diff-filter=A` still
resolves it. Recorded so nobody files it later.

**U2.** `T3` has its row (`FIX-LEDGER.md:44`), the handover names it again
(`05-HANDOVER.md:17`), and deleting the row fails **twice** — on `EXPECTED_ROWS` and on the
governed mention. **The residual-gap statement is exact:** every `ID_RE`-matching identifier
across all of `docs/**/*.md` was enumerated and diffed against the ledger, and the unrowed set
is precisely the seven claimed — `U1`, `U2`, `U3`, `A-GATE-6-3`, `6-4`, `6-5`, `6-7`. No
others.

**U3.** The exact `A-GATE-6-5` repro fails: `G1 | FIXED | docs/press/DESIGN.md | fe37bf37` →
exit 1.

---

## Findings

| ID | Severity | File:line | Finding |
|---|---|---|---|
| `A-GATE-7-1` | **major** | `check-fix-claims.mjs:222-239` | **The boundary constraint is one-sided.** It bounds a claim from below and not at all from above, so any post-boundary commit touching the named file passes — including a *different* finding's fix in the same file: `T1 → 89029ffb` (T2's commit) is **accepted, exit 0**. It is the run-6 attack moved forward in time. Compounding it, `09-A-GATE-RUN-4.md` was added by `c24e9b37`, which is *also* R1's fix commit, so `R1` and `A-GATE-4-3` cite their own boundary and pass by reflexivity — the run-4 rows get essentially no temporal constraint. `check-bundle-size.mjs` carries 8 of the 26 rows, so the post-boundary swap is trivially available. The narrowing is real (everything before the audit is rejected) but the window is **smaller, not empty**, and `c5993d3a`'s commit message — *"this is a misattribution, not a fix"* — reads stronger than the assertion is |
| `A-GATE-7-2` | **major** | `FIX-LEDGER.md:97-102` | **U2 closes the mention-escape only for identifiers that already have a row.** For those it is genuinely closed: deleting the row *and* the mention still trips `EXPECTED_ROWS`. For an identifier that never had a row the escape is open by default and needs no evasion — `A-GATE-6-3`/`6-4`/`6-5`/`6-7` are discussed only in `11-A-GATE-RUN-6.md` and `FIX-LEDGER.md`, neither governed, and the gate is green with no rows for them. The ledger frames the residual gap as **temporal** (a one-commit window); the never-rowed case is **spatial**. Directly caused by `A-GATE-6-6`, which was deliberately left open |
| `A-GATE-7-3` | **major** | `check-fix-claims.mjs:213` | **U3 is disarmed by a single incidental non-`docs/` entry.** The predicate is `every(f => f.startsWith('docs/'))`, so `docs/press/DESIGN.md · styles/themes/press.css` → exit 0 regardless of which file carried the substance. It is also blind to documentation outside `docs/` (`README.md`, `CLAUDE.md`, `redirects/legacy.json`) and to a code path whose diff is comment-only — which `R5`/`A-GATE-4-4` → `83adf631` actually is |
| `A-GATE-7-4` | minor | `FIX-LEDGER.md:20-23` | The ledger reads as though **substance** is checked. U3 asserts **path shape**, which is the most a file list can support. Say so |
| `A-GATE-7-5` | minor | `check-fix-claims.mjs:88-96` | `ROUND_BOUNDARIES` ordering (long keys first) is correct but not load-bearing — `A-GATE-4-1` does not `startsWith` `G`/`R`/`T`/`U`. Belt-and-braces; recorded so a later reader does not mistake it for a live constraint |

---

## `A-GATE-7-6` — not a defect. The ceiling of the approach

**Promoting any `OPEN` row to `FIXED` against the current commit is accepted in one word.**

```
| `A-GATE-6-2` | FIXED | scripts/check-fix-claims.mjs | c5993d3a |
check-fix-claims: 44 ledger entries (27 FIXED, verified against git) ... EXIT=0
```

Fully green. `EXPECTED_ROWS` unchanged (a status edit, not a row add), boundary satisfied
(`c5993d3a` descends from `d197af0c`), the file genuinely touched, docs-only check satisfied.
`A-GATE-6-2` is open and unfixed.

**This is not a bug with a fix. It is what a gate over a hand-maintained ledger can be.**

> **The gate asserts that a plausible commit exists. It never asserts that a fix occurred.**

Every strengthening in `T3`, `U1`, `U2` and `U3` narrows the set of *implausible* claims —
a commit that does not exist, that is not on this branch, that predates the audit, that never
touched the file, that touched only documents. **None of them can reach the question of
whether the change did what it says**, because the ledger's status column is written by the
same person the ledger exists to check. Tightening further chases an asymptote: each
increment removes another implausible claim and leaves the plausible-but-false one untouched.

What actually establishes that a fix occurred is the deliberate-failure proof — make the gate
go red, then green. The ledger and the proof are complementary and neither substitutes for the
other; the ledger's own closing section says as much about file-touching, and this is the
general form of it.

**Epic M must read the ledger knowing this.** A `FIXED` row is evidence that a claim is
*well-formed*, not that it is *true*. Recorded in `CLAUDE.md` beside the standing rules,
because it is the boundary of the whole verification approach rather than a property of one
script.

---

## Housekeeping

- `check-node-version: 17 gates, and npm run verify and ci.yml run the same set`.
- `VERIFY_PORT=3888 npm run verify` → exit 0. Lighthouse desktop and mobile SKIPPED on
  Windows (chrome-launcher / Node 24 EPERM race); not counted as evidence, CI is.
- `git status --porcelain` empty at finish.
- Out of scope, not investigated: `A-GATE-6-6` (`GOVERNED` omits the run reports) is the
  direct cause of `A-GATE-7-2` being wider than the ledger states, and `A-GATE-6-8` (`HEAD`
  accepted as a commit reference) compounds `A-GATE-7-6`.
