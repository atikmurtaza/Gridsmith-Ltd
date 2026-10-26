/**
 * **The committed deliberate-failure probe for `check-bundle-size`'s shared-baseline
 * assertion** (`scripts/check-bundle-size.mjs`, the `shared > SHARED_BASELINE_BUDGET_KB`
 * branch). `G8` / `A-GATE-4-3`.
 *
 * The assertion's original proof pushed `shared` from 0.5 to 1.6KB against a budget that
 * equalled `FLOOR_TOLERANCE_KB`, so the floor check — arithmetically identical predicate,
 * ~70 lines earlier — exited first and the decomposition block never printed. The proof
 * observed a red build and credited the wrong gate. `R1` separated the constants; this is
 * the probe that lands in the window they opened.
 *
 * **Why it is a subject, structurally rather than from the gate's silence.** Both predicates
 * read the same quantity, `shared`:
 *
 *   floor check          fires at  shared > FLOOR_TOLERANCE_KB        (3.0KB)
 *   shared baseline      fires at  shared > SHARED_BASELINE_BUDGET_KB (2.9KB)
 *
 * so only `2.9 < shared <= 3.0` reaches the second without the first exiting. The payload
 * below is random hex — high-entropy, so its gzipped cost tracks its own length rather than
 * the surrounding chunk — and it is imported by `ConsentBanner`, the one Client Component
 * boundary in the shared layout, which every baseline route including `/_not-found` carries
 * its own copy of. `shared` is a minimum across those routes, so a cost on all of them moves it
 * by the full amount.
 *
 * **Calibrated to the window, and the window is narrow (0.1KB).** `GS-R12-PRODUCTION-READINESS-001`
 * (18 October 2026): baseline 2.8732KB; the old 1,480-character payload lifted `shared` to
 * 3.8986KB, past the floor tolerance, so the floor check fired and this assertion was never
 * reached. Measured on clean in-tree builds: 64 characters → 2.9494KB (used: ~49 B gz from
 * each edge), 80 → 2.9611KB, 160 → 3.0227KB. Re-measure and re-size whenever the baseline
 * moves; a probe outside the window proves the wrong gate.
 * GS-LAUNCH-002 remeasures the Next 15.5.28 framework floor independently (100.4 KB);
 * this 192-character specimen is recalibrated against that floor with the same 2.9 KB cap.
 *
 * **Which gate fired is then not a judgement call.** The floor check `process.exit(1)`s
 * before the decomposition block runs, so a run that prints the shared-baseline message is a
 * run in which the floor check did not fire. The message names `shared` and the budget.
 *
 * Re-run it:  NEXT_PUBLIC_BUNDLE_SIZE_PROBE=1 npm run build && node scripts/check-bundle-size.mjs
 *
 * Off, the ternary's condition is inlined to `undefined` at build and the payload is dropped
 * by the minifier, so this file costs nothing. Never deleted — a gate with no subject is
 * silent, which is worse than red or green (CLAUDE.md).
 */
const PAYLOAD =
  'f3382941a6f1a5612cc94f8a736129d5d2f21d3680558771233e6957666eb80ecc093af73babffa69a4214d5ac9689ab952e40dcb2960153a8b192eaa8c62ca57abda5cd1342befc0036948bafef963730261fa4855d2bb83f7a00cb92c3862e';

export const BUNDLE_SIZE_PROBE = process.env.NEXT_PUBLIC_BUNDLE_SIZE_PROBE ? PAYLOAD : '';
