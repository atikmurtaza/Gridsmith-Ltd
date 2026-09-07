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
 *   shared baseline      fires at  shared > SHARED_BASELINE_BUDGET_KB (2.8KB)
 *
 * so only `2.8 < shared <= 3.0` reaches the second without the first exiting. The payload
 * below is 740 bytes of random hex — incompressible by construction, so its gzipped cost is
 * its own length and not a property of the surrounding chunk — and it is imported by
 * `ConsentBanner`, the one Client Component boundary in the shared layout, which every
 * baseline route including `/_not-found` carries its own copy of. `shared` is a minimum
 * across those routes, so a cost on all of them moves it by the full amount. Measured
 * baseline is 1.9KB; +1.0KB lands at 2.9KB, inside the window.
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
  'f3382941a6f1a5612cc94f8a736129d5d2f21d3680558771233e6957666eb80ecc093af73babffa69a4214d5ac9689ab952e40dcb2960153a8b192eaa8c62ca57abda5cd1342befc0036948bafef963730261fa4855d2bb83f7a00cb92c3862e959cf1ddff7f3e6a712ea4998a67cd611df68a41a69bae21471773d03e74deee418617da5f44d9756f7779c0189d1be7f307db3180fd3896024ba4acf44550324d059491ebc5d95eca55b13d1956dee8dd2b929726b946a6c0dab409f61c4366ed68e4d832beb533d1b68944b8046ea35259f486179938984aa6d91056b40a3970bcb36abc7d22769743a92049a3d76bee411b814fac4f9ecd7f684711c825ac96a88ab3091eca0e6b537db3925ddc88bba9b22d9a25b258ffba93fa20a4ac230e66f7702a990223048cc833fa1cdaf6a45f96d9bc434d1ef9fe55e1d90e0acee82bb0d578329833e5b63256abb6b5a94999af765b766daae89538ecd988594f098d704ba5e8c953faba0d877c5efa3774ea2afbf6d1b38d76fc39fce1f27465be4255e1cbf15d854e29cb686171c3047efbc4b024e2791fb99584afe6585f9aa613f07e48c690cebb0544a58810c0335d4e363aaeb36f2b369682c6b01919cd09d1d9a283aed61fef04923247e618a619d9fb7d83d2b12e695e6f67c3914422cc8bd563559e76dad5d8047fd24d62aed99dd68985d467ed0a710a60a245e0d153e3ae42a09c8cf10ba69dff2e4af15748989d69c1da066e66c277d17dbae36ae2493153b40fdfd08db3da7efa8881ffc44aca06072be960a3e31ecd75288c1308501b4ade38b4337b7446e338ab651a1260b1721b89c7696b4cbd4d877a8c1a139532378df56feddcda971633abcf65c34bc34d47854c28161c26c7370d0946c6fc7ca6f78be320d24f79e2e93049a385aed9bd7b03826dd56edff519dc1d4e4a8afa2b7421b8a4a046f8349e8058a11a307a30e2cb974e23d39d77f300b9411978c2e41f18725971f4e85b685b6c4638cf54307c4436af53a967bc1aa26c11a31ab8bb';

export const BUNDLE_SIZE_PROBE = process.env.NEXT_PUBLIC_BUNDLE_SIZE_PROBE ? PAYLOAD : '';
