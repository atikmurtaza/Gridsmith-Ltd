# A-GATE run 5 — scoped re-verification of R1–R5

**Date:** 14 August 2026 · **Branch:** `feat/a-01-a-10a-scaffold-ci` · **Runtime:** Node 24.15.0
· **Working tree:** clean at finish. All deliberate-failure edits reverted by copy-aside/copy-back.

Round 5 was scoped to the five fixes made after run 4 (`R1`–`R5`), not to Epic A and not to
the eight P2 items run 4 left open. Two passes, each in its own fresh context.
`npm run verify` is **green end to end** (exit 0, 14 gates; both Lighthouse axes skip on
Windows and are not evidence). `check-node-version` reconciles at **16 gates**.

**Findings are left as written.**

---

## Result

| Fix | What it was | Verdict |
|---|---|---|
| **R1** | shared-baseline assertion made reachable | **NOT CLEAN — 1 major + 2 major + 1 minor.** The assertion now works; the fix protecting it does not |
| **R2** | `Tabs.tsx:2` and the two documents | **CLEAN** |
| **R3** | `check:contrast` size pass given real power | **CLEAN** |
| **R4** | struck SSR claim removed from the probe | **CLEAN** |
| **R5** | two-checks relationship into the gate; `Specimen` recorded | **CLEAN**, one minor wording nit |

### What was proven, and how

Both passes were told to assume the fix was wrong. Three proofs are worth keeping because
they tested the thing rather than a proxy for it:

- **R1 fires alone.** Proven with a *real input* rather than a lowered threshold — a 500-char
  incompressible payload exported from `app/global-error.tsx`, landing in every route's
  boundary and putting the shared baseline at 0.8KB, inside the `0.7 < shared <= 1.0` window.
  The decomposition failed; **the floor check printed nothing** — the string "the cheapest
  route in the build measures" is absent from the run. With the floor check hard-disabled:
  same failure. With a clean input and the floor check still disabled: exit 0, so it is not
  always-on. The primitive half fires alone too, and while `/_kitchen-sink` stays inside its
  own route budget, so the `over` check is not doing the work either.
- **R3 has power the matrix structurally lacks.** The matrix loop reads only
  `styles/themes/*.css`; it never opens a stylesheet, so no `color:` declaration can produce a
  matrix problem at any ratio. Two rules appended to `styles/globals.css` — a decor token and
  an unruled token painted at `--text-xs` — produced two size-pass problems, **zero** matrix
  problems and zero drift. The pass fired alone.
- **R3's self-test asserts *which*, not *how many*.** One branch was broken while holding the
  count at 2 (the decor branch's message rewritten into the unruled branch's shape). It went
  red at `got 2`. A count-only assertion would have passed that input. And the
  `shippedDeclarations` capture order was proven load-bearing by moving it three lines: with
  `SIZE_SOURCES` emptied, capture-before-fixture exits 1, capture-after-fixture exits **0**.

`Specimen`'s accepted gap was verified by actually reverting it to `<p>`: **13 gates green
with the F2 regression in the tree.** The acceptance is honest.

---

## R1's findings — the fix has no gate

The pattern this epic keeps producing, one turn further on. `R1` fixed unreachable code by
making two constants distinct. **Nothing enforces the distinctness.** Setting
`SHARED_BASELINE_BUDGET_KB` back to `1.0` — the exact `A-GATE-4-3` state — produces
`check-bundle-size: all routes within their delta budget`, **exit 0**. Every gate green, the
defect reinstated, no output anywhere.

| ID | Severity | File:line | Finding |
|---|---|---|---|
| `A-GATE-5-1` | **major** | `check-bundle-size.mjs:315` vs `:36` | The entire fix is that two constants differ, and that constraint lives only in prose. Reverting it is silent. **A one-line `if (SHARED_BASELINE_BUDGET_KB >= FLOOR_TOLERANCE_KB) throw` closes it**, and the file already uses hardcoded self-assertions elsewhere |
| `A-GATE-5-2` | **major** | `:300` | The identity the window rests on — `cheapest = FLOOR_KB + shared`, i.e. that the baseline routes are the cheapest rows — is **asserted, never checked**. True today (verified: baselines 100.7KB, probe 101.0KB, kitchen sink 106.4KB). If any future route measures below the baseline set the equivalence quietly stops holding and the window stops meaning what the docstring says. CLAUDE.md's "assert the state" applied to a *premise* rather than a subject |
| `A-GATE-5-3` | **major** | `:330` | **A second input class it still cannot catch.** `Math.min(...baselineRows.map(r => r.delta))` means a cost paid by four of the five baseline routes moves neither `min` nor `cheapest`, at any size. **A chrome component imported by three of the four route-group layouts is exactly that shape, and it is what Epic M builds next.** The docstring records only the upside of `min`; the cost is not written down |
| `A-GATE-5-4` | minor | `:234` before `:321-355` | Above the window (`shared > 1.0`) the floor check exits first, so the **primitive-layer** assertion is skipped too. A build breaking both halves reports the generic message and no `M-06` numbers |
| `A-GATE-5-5` | minor | `:224-225` | *"it is 0.5KB of Master's 0.8KB of remaining headroom"* — both figures are right individually, but the shared baseline is not a part of the headroom; the headroom is what remains after it. Reads as arithmetic and is not |

`A-GATE-5-3` is the one that matters beyond bookkeeping: it is a live blind spot pointed
directly at the next epic's first work.

---

## New P2 items (do not fix — Epic M sweep)

Round 4 left eight P2s open. Round 5 adds three, bringing the P2 backlog to **eleven**:

| ID | File:line | Item |
|---|---|---|
| `A-GATE-5-6` | `page.probe.tsx:40-41` | Still says the route "must be excluded from the production build … at `A-12` — tracked there, not solved here". `c3e9ec17` already excluded it via `next.config.ts` `pageExtensions`. Stale in the good direction |
| `A-GATE-5-7` | `master/PROJECT-TRACKER.md:59` | The criterion-6 row still says the round-3 accessibility findings were "All fixed in `G1`–`G8`", which `A-GATE-4-1` disputes |
| `A-GATE-5-8` | `master/PROJECT-TRACKER.md:60` | "Criteria 5 and 6 have never been executed" sits directly under rows describing four completed runs |

`A-GATE-5-7` and `A-GATE-5-8` are the fourth and fifth instances of **documentation
outrunning the repo** (tracker `A-GATE-4-5`). The class is not closed.

Nothing gates the comment-accuracy class that `R2` fixed. `check-service-role-key.mjs:44` is
the only script parsing the `'use client'` directive and it asks a different question. Not
filed as a finding — no gate was claimed — but it is why `R2` recurred.

---

## Verdict

**Epic A still does not pass A-GATE.** Criteria 5 and 6 are worded "zero findings" with no
partial credit; round 5 returned five in `R1`'s area alone.

**But the shape has changed and it is worth being precise about how.** Rounds 1–4 kept
finding defects in *the work*. Round 5 found none in R2–R5 and none in R1's assertion itself
— it found that **the repair is undefended**. That is a narrower and more tractable class
than "the gate measures nothing", and `A-GATE-5-1` is a one-line fix.

**Recommended next action, and it is small:** close `A-GATE-5-1` (one line), `A-GATE-5-2`
(compare the two minima) and `A-GATE-5-3` (use `max` or per-route assertion instead of `min`,
or state why `min` is right and gate the consequence). Then round 6 scoped to those three.
`A-GATE-5-3` should not be carried into Epic M unresolved — it is blind to precisely the
thing `M-06` exists to measure.
