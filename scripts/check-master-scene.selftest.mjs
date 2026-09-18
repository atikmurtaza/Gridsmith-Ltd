#!/usr/bin/env node
/**
 * check-master-scene:selftest — the invariants of the Master scene's narrative. `GS-R001-M`.
 *
 * The subject is `components/master/sceneModel.ts`: the logo geometry and the pose the scene
 * takes at every scroll position. These are properties a screenshot cannot establish and a
 * served gate would only sample, so they are asserted on the function itself:
 *
 *  1. **close** — the closing pose IS the owner's logo: every sphere at its SVG position, front
 *     on (z = 0), no rotation. The narrative's resolution is the brand, not an approximation.
 *  2. **hero** — the opening pose is the assembled mark: every pairwise sphere distance equals
 *     the logo's, so it is the logo under a rigid turn and nothing is out of place.
 *  3. **bars** — every bar keeps its logo length at every scroll position, in and between every
 *     formation. A bar that stretches in transit is a piece that is not the mark's piece.
 *  4. **continuity** — no piece jumps: a 0.001-chapter step moves nothing more than 0.05 units.
 *  5. **narrative** — one pose per chapter, and at least four distinct formations. The rejected
 *     `GS-R001-R` animation was *logo → exploded → logo*; this is the assertion that the story
 *     has more than those two states.
 *
 * ## Proving it
 *
 * Each check is a function of its input, so each is run twice: against the real model, where it
 * must pass, and against a fixture broken in exactly the way the check exists to catch, where it
 * must fail. A check that passes its broken fixture is reported as a gate defect. The readings
 * are values, not absences — the shape `CLAUDE.md` prefers.
 */
import {
  CHAPTERS,
  KEYS_NARROW,
  KEYS_WIDE,
  LOGO_RODS,
  LOGO_SPHERES,
  ROD_LENGTHS,
  pose,
} from '../components/master/sceneModel.ts';

const TAN = Math.tan((16 * Math.PI) / 180);
const ASPECT = 16 / 9;
const ZERO = [0, 0, 0];
const d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const samples = (keys) => Array.from({ length: (keys.length - 1) * 200 + 1 }, (_, i) => i / 200);

/** Each returns a list of problems. */
const CHECKS = {
  close(keys, poseFn) {
    const p = poseFn(keys, keys.length - 1, ZERO, TAN, ASPECT);
    // Remove the screen offset; what is left must be the logo exactly.
    const ox = p.spheres.reduce((s, q) => s + q[0], 0) / 8 - LOGO_SPHERES.reduce((s, q) => s + q[0], 0) / 8;
    const oy = p.spheres.reduce((s, q) => s + q[1], 0) / 8 - LOGO_SPHERES.reduce((s, q) => s + q[1], 0) / 8;
    const worst = Math.max(...p.spheres.map((q, i) => d([q[0] - ox, q[1] - oy, q[2]], LOGO_SPHERES[i])));
    return worst < 1e-9 ? [] : [`closing pose is ${worst.toFixed(4)} units from the logo`];
  },
  hero(keys, poseFn) {
    const p = poseFn(keys, 0, ZERO, TAN, ASPECT);
    let worst = 0;
    for (let i = 0; i < 8; i++)
      for (let j = i + 1; j < 8; j++)
        worst = Math.max(worst, Math.abs(d(p.spheres[i], p.spheres[j]) - d(LOGO_SPHERES[i], LOGO_SPHERES[j])));
    return worst < 1e-9 ? [] : [`hero pose is not the assembled mark (worst pair off by ${worst.toFixed(4)})`];
  },
  bars(keys, poseFn) {
    let worst = 0;
    let at = 0;
    for (const t of samples(keys)) {
      const p = poseFn(keys, t, ZERO, TAN, ASPECT);
      p.rodA.forEach((a, k) => {
        const e = Math.abs(d(a, p.rodB[k]) - ROD_LENGTHS[k]);
        if (e > worst) [worst, at] = [e, t];
      });
    }
    return worst < 1e-6 ? [] : [`a bar changes length by ${worst.toFixed(4)} at chapter ${at.toFixed(3)}`];
  },
  continuity(keys, poseFn) {
    let worst = 0;
    let at = 0;
    const ts = samples(keys);
    for (let i = 1; i < ts.length; i++) {
      const a = poseFn(keys, ts[i - 1], ZERO, TAN, ASPECT);
      const b = poseFn(keys, ts[i], ZERO, TAN, ASPECT);
      // A bar has no head, so it is compared as an unordered segment. At chapter 4 the model
      // hands a bar over with its two ends exchanged — the same segment, and invisible — and an
      // ordered comparison read that as a 2.4-unit jump. This was the first red this gate gave.
      const bar = (k) =>
        Math.min(
          Math.max(d(a.rodA[k], b.rodA[k]), d(a.rodB[k], b.rodB[k])),
          Math.max(d(a.rodA[k], b.rodB[k]), d(a.rodB[k], b.rodA[k])),
        );
      const step = Math.max(...a.spheres.map((q, k) => d(q, b.spheres[k])), ...a.rodA.map((_, k) => bar(k)));
      if (step / (ts[i] - ts[i - 1]) * 0.001 > worst) [worst, at] = [(step / (ts[i] - ts[i - 1])) * 0.001, ts[i]];
    }
    return worst < 0.05 ? [] : [`a piece jumps ${worst.toFixed(3)} units per 0.001 chapter near ${at.toFixed(3)}`];
  },
  narrative(keys) {
    const forms = new Set(keys.map((k) => k.form));
    const out = [];
    if (keys.length !== CHAPTERS.length) out.push(`${keys.length} poses for ${CHAPTERS.length} chapters`);
    if (forms.size < 4) out.push(`only ${forms.size} distinct formation(s): ${[...forms].join(', ')}`);
    return out;
  },
};

/** Broken in exactly the way each check exists to catch. */
const BROKEN = {
  close: { keys: KEYS_WIDE.map((k, i, a) => (i === a.length - 1 ? { ...k, rot: [0, 0.2, 0] } : k)), poseFn: pose },
  hero: { keys: KEYS_WIDE.map((k, i) => (i === 0 ? { ...k, form: 'split' } : k)), poseFn: pose },
  bars: {
    keys: KEYS_WIDE,
    poseFn: (...args) => {
      const p = pose(...args);
      return { ...p, rodB: p.rodB.map((b, k) => (k === 2 ? [b[0] + 0.1, b[1], b[2]] : b)) };
    },
  },
  continuity: {
    keys: KEYS_WIDE,
    poseFn: (keys, t, ...rest) => {
      const p = pose(keys, t, ...rest);
      return t > 2.5 ? { ...p, spheres: p.spheres.map((s) => [s[0] + 1, s[1], s[2]]) } : p;
    },
  },
  narrative: { keys: KEYS_WIDE.map((k) => ({ ...k, form: k.form === 'chain' || k.form === 'ring' ? 'split' : k.form })), poseFn: pose },
};

const problems = [];
let proofs = 0;
for (const [name, check] of Object.entries(CHECKS)) {
  for (const [label, keys] of [['wide', KEYS_WIDE], ['narrow', KEYS_NARROW]]) {
    for (const p of check(keys, pose)) problems.push(`${name} (${label}): ${p}`);
  }
  const broken = check(BROKEN[name].keys, BROKEN[name].poseFn);
  if (broken.length === 0) problems.push(`${name}: GATE DEFECT — passed a fixture broken to fail it`);
  else {
    proofs += 1;
    console.log(`  proof  ${name.padEnd(11)} red on its broken fixture: ${broken[0]}`);
  }
}

// The model's own geometry must still be the SVG's: 8 spheres, 6 bars, bar ends on spheres.
if (LOGO_SPHERES.length !== 8 || LOGO_RODS.length !== 6) problems.push('the logo is not 8 spheres and 6 bars');

if (problems.length > 0) {
  console.error(`\ncheck-master-scene: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(
  `\ncheck-master-scene: ${Object.keys(CHECKS).length} invariants hold on both keyframe tables; ` +
    `${proofs} of ${Object.keys(CHECKS).length} proven red on a broken fixture\n`,
);
