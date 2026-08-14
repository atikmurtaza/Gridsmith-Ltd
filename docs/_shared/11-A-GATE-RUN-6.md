# A-GATE run 6 — scoped re-verification of T1–T4

**Date:** 14 August 2026 · **Branch:** `feat/a-01-a-10a-scaffold-ci` · **Runtime:** Node 24.15.0
· **Working tree:** clean at finish, no probe component left behind.

Scoped to the four fixes made after run 5. Two narrow passes — `T1`/`T2`/`T4` (one file), then
`T3` alone — after a combined run died on the account session limit. `npm run verify` green;
`check-node-version` reconciles **17 gates** between `npm run verify` and `ci.yml`.

**Findings are left as written.**

---

## Result

| Fix | Verdict |
|---|---|
| **T1** — constants' distinctness guard | **CLEAN** |
| **T4** — the headroom wording | **CLEAN** |
| **T2** — baseline spread assertion | **2 minor.** The assertion fires correctly; its edges do not |
| **T3** — `check:claims`, gate 17 | **5 major + 1 minor.** The gate works; the argument it rests on does not |

**Epic A does not pass A-GATE.**

### T1 — clean, and the hoist is load-bearing as claimed

The guard fires on **equality**, not merely greater-than (`0.9999` → exit 0, `1.0` → exit 1,
`1.5` → exit 1), and **no build state reaches a measurement before it**. Verified across four
states that would each otherwise own the exit — `.next/` absent, a required route's HTML
removed, `FLOOR_KB = 0` firing both the floor check and every route budget — each run twice,
once with the guard satisfied to confirm the earlier check really does fire, once violated. In
every violated case the guard's message is the only output. It precedes the `existsSync`
check, so the hoist does what it was moved to do.

### T4 — clean

`shared 0.5KB`, `M-06 projection 14.2KB of 15KB — 0.8KB headroom`. The old text made 0.5 a
subset of 0.8, which is false; the new text says the 0.8 is what remains after it. `0.5` and
`5.8` are each independently rounded, which is why they appear not to sum — worth knowing
before anyone re-derives from them.

---

## T2 — the assertion is right, the edges are not

Reproduced independently with a different payload: spread `0.4KB`, naming `/design`,
`/digital`, `/press` at 0.9KB against `/` and `/_not-found` at 0.5KB, exit 1. The same build
against the pre-T2 code is **silent, exit 0**, with `shared`, the primitive layer, every route
budget and the floor check unmoved. The assertion is the only thing in the file that sees a
subset cost.

| ID | Severity | File:line | Finding |
|---|---|---|---|
| `A-GATE-6-1` | minor | `check-bundle-size.mjs:386,392` | **`BASELINE_ROUTES` reads its expectation out of itself.** The presence guard compares `baselineRows.length` to `BASELINE_ROUTES.length` — CLAUDE.md's "expectation derived from its own subject", exactly. Demonstrated on the same defective build: shrink the list to the two routes that did not gain the cost and it goes **green**, spread 0.0 across 2 routes, no gate objecting. **The docstring actively instructs this edit** as the legitimate response to "a route grew a feature", and nothing distinguishes that from silencing the message. At one member the spread is 0 by construction and both decomposition assertions go vacuous. Live, not theoretical: these five are placeholders and Epic M gives them content, so the list only shrinks |
| `A-GATE-6-2` | minor | `check-bundle-size.mjs:71-74` | **The tolerance's stated reason does not describe what is measured.** It justifies 0.1KB as absorbing rounding because "`/_not-found` renders a little more markup". The gate measures gzipped JS chunks referenced by the HTML, not the HTML. All five baseline routes reference an **identical** five-script set, so their deltas are bit-identical and the spread is exactly 0.0 — nothing is being rounded. The magnitude is harmless (≈102 bytes, below any real component); the defence is the same class `T4` had just repaired one docstring above |

---

## T3 — the gate works; the argument it rests on is wrong

Every self-assertion holds. Confirmed red: the `Tabs.tsx` misattribution; a deleted row
against the hardcoded `EXPECTED_ROWS`; an identifier discussed but unlisted; a broken `ID_RE`
and a broken `GOVERNED` (both "measured nothing while reporting a pass"); `FIXED` without a
commit or without files; `OPEN` naming a commit; an `A11Y-` row; a non-ancestor commit. All 25
`FIXED` rows were checked against `git show --name-only` and none is a false attribution.

**But the central claim is false, and it is the load-bearing one.**

| ID | Severity | File:line | Finding |
|---|---|---|---|
| `A-GATE-6-3` | **major** | `check-fix-claims.mjs:19-21` | **Obstacle 2 — "the claim's round is not machine-readable" — is untrue of the documents as they exist.** Every round has a committed report, and the commit that added it *is* the boundary: `07-A11Y-AUDIT.md → b4fb2d6e` (`G*`), `09-A-GATE-RUN-4.md → c24e9b37` (`R*`, `A-GATE-4-*`), `10-A-GATE-RUN-5.md → c60fc8ac` (`T*`, `A-GATE-5-*`). The round is readable from the identifier prefix; the boundary from `git log --diff-filter=A -- <report>`. **I argued the brief was not mechanisable on a point where it was.** |
| `A-GATE-6-4` | **major** | `check-fix-claims.mjs:151-162` | **No temporal constraint, so the gate asserts less than its docstring says.** It claims "a real commit that genuinely touched the named files"; it actually asserts "the file was touched at some point in history". Three false claims it **accepts** with a full green line: `R2` → the July commit that *created* `Tabs.tsx`; `R2` → an unrelated Epic-A commit that also touches it; `T1` → a different fix in the same file. For the very case the gate was built on, the first is the natural misattribution. Adding `git merge-base --is-ancestor <round-boundary> <cited-commit>` rejects it — and **passes all 25 existing rows with zero churn**, so it was available for free |
| `A-GATE-6-5` | **major** | `FIX-LEDGER.md:20-22` | **"Files must name where the fix's substance lives, never only the documents that describe it… the exact failure this gate exists to catch" is documented and not asserted.** `G1 \| FIXED \| docs/press/DESIGN.md \| fe37bf37` → exit 0. The `A11Y-` exclusion two bullets later *is* asserted, so the distinction was understood and not applied here |
| `A-GATE-6-6` | **major** | `check-fix-claims.mjs:54-60` | **`GOVERNED` omits the run reports** — `09-A-GATE-RUN-4.md` and `10-A-GATE-RUN-5.md`, which carry 33 identifiers and are where findings actually live. The next run report is ungoverned by default, so coverage is evaded by writing the claim in the report rather than the tracker |
| `A-GATE-6-7` | **major** | `FIX-LEDGER.md:79-84` | **Hollow subject, and I built it deliberately.** Coverage triggers only on a backticked mention in a governed document. `T3` has no ledger row *and* no governed mention. The ledger records that the gate "caught its own author mid-commit" — and the resolution shipped in `8d94e6e2` was **to stop mentioning the identifier**, not to add the row. So the gate is silent on the fix it ships with, and the general escape is: delete the mention. The limitation was written up as a virtue |
| `A-GATE-6-8` | minor | `check-fix-claims.mjs:142` | `HEAD` is accepted as a commit reference (`G4 → HEAD` → exit 0). Require a 7–40 character hex hash |

Attacks that correctly failed: a lowercase status; `PARTLY FIXED` (row goes invisible, caught
by `EXPECTED_ROWS`); an indented or reformatted row; a wrong file separator. Un-backticked
identifiers do slip `ID_RE`, but the three that occur sit adjacent to backticked mentions of
the same id, so nothing is currently uncovered by that route.

One note on the ledger, not a false row: `R5`/`A-GATE-4-4` → `83adf631` names a `.mjs` path
whose diff is **comment-only**. The finding was a missing docstring so the substance is
genuinely there — but a `.mjs` path reads as code and the gate cannot tell the difference.

---

## What this run is really saying

`T1` and `T4` are clean. `T2`'s assertion is correct and proven; its two findings are about
the list it reads and the sentence defending its tolerance.

`T3` is the one to take seriously, and not because the gate is broken — it fires on nine
distinct false inputs and its ledger is truthful. **It is that the gate was scoped by an
argument that was wrong on the point that mattered, and the wrongness bought a weaker gate.**
The stronger version costs about six lines and passes every existing row unchanged. Two of the
six findings (`A-GATE-6-5`, `A-GATE-6-7`) are the same shape as the class this epic has
recorded nine times: a limit that was written down instead of asserted, and — in `A-GATE-6-7`
— a limitation resolved by removing the thing that revealed it.

**Recommended next action:** close `A-GATE-6-3`/`6-4` (the round-boundary assertion, the
substantive one), `6-5` (reject docs-only file lists), `6-6` (govern the run reports), `6-7`
(give `T3` a row and stop relying on mentions for coverage), `6-8` (hex hash), and `6-1`/`6-2`
(tie `BASELINE_ROUTES` to `REQUIRED` or assert a minimum membership; correct the tolerance's
stated reason). Then round 7 scoped to those. None is large; `6-4` is the only one that
changes what a gate asserts.
