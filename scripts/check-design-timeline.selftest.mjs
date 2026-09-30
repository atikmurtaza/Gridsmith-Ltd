#!/usr/bin/env node
/**
 * check-design-timeline:selftest — the rhythm of the Design scroll story. `GS-DES-002`, rewritten
 * at `GS-DES-002-R1`.
 *
 * The subject is `components/divisions/design/designTimeline.ts`. Since R1 its scale is the page:
 * `p = i` is chapter i's copy settled, `i + HANDOFF` is that copy starting to leave, `i + 1` is the
 * next copy settled (the choreography measures those positions). So a question about time is a
 * question about where a change sits relative to the copy:
 *
 *  1. **placement** — every transformation sits inside a passing interval (copy leaving, next copy
 *     arriving), never inside a dwell: the scene never changes while the reader is being asked to
 *     read, and the copy never waits for the scene. This is the owner's GS-DES-002 finding as a
 *     number: content waited while unfinished animation ran.
 *  2. **resolved** — each finished artefact (the Brand 3D logo, the mascot, the coordinated
 *     building, the final 3D logo) is complete within 0.15 of its copy settling.
 *  3. **dwell** — each then holds, unchanged, for at least 0.3 of its chapter (60% of the dwell).
 *  4. **asset** — the supplied 3D logo resolves only over exact geometry (the procedural mark is
 *     complete when it starts), and the procedural structure is already under it when it dissolves.
 *  5. **continuity** — Brand → Motion never goes blank: 3D logo, mark, strokes or mascot is at least
 *     90% on screen at every sampled position; the strokes finish drawing the outline before the
 *     mascot starts to resolve.
 *
 * ## Proving it
 *
 * Each check runs on the real timeline, where it must pass, and on a fixture broken in exactly the
 * way it exists to catch, where it must fail: readings are values, not absences. Every branch has its
 * own broken fixture.
 */
import * as timeline from "../components/divisions/design/designTimeline.ts";

const MIN = { resolve: 0.15, dwell: 0.3 };
const range = (a, b, step = 0.002) => Array.from({ length: Math.round((b - a) / step) + 1 }, (_, i) => a + i * step);

/** The transformations of each passing interval, by the chapter that hands off. */
const handoffs = (t) => [
  [0, "Hero → Brand", [t.BRAND.enter, t.BRAND.guides, t.BRAND.g, t.BRAND.s, t.BRAND.nodes, t.BRAND.baseGold]],
  [1, "Brand → Motion", Object.values(t.MORPH)],
  [2, "Motion → Technical", [...Object.values(t.MOTION), t.TECHNICAL.enter, t.TECHNICAL.assemble]],
  [3, "Technical → Final", [t.FINAL.detailOut, t.FINAL.travel, t.FINAL.converge, t.FINAL.nodes]],
];

const CHECKS = {
  placement(t) {
    const out = [];
    for (const [i, name, ranges] of handoffs(t)) {
      const start = Math.min(...ranges.map((r) => r[0]));
      if (start < i + t.HANDOFF - 0.02) out.push(`${name} starts at ${start}, inside the dwell (the copy leaves at ${i + t.HANDOFF}) — the scene changes while the reader is reading`);
    }
    return out;
  },
  resolved(t) {
    const R = t.RESOLVED;
    return [["the Brand 3D logo", R.brand, 1], ["the mascot", R.mascot, 2], ["the building", R.building, 3], ["the final 3D logo", R.final, 4]]
      .filter(([, at, i]) => at - i > MIN.resolve)
      .map(([what, at, i]) => `${what} resolves at ${at}, ${(at - i).toFixed(2)} after its copy settles (limit ${MIN.resolve})`);
  },
  dwell(t) {
    const R = t.RESOLVED;
    return [["the Brand 3D logo", R.brand, R.brandHandoff], ["the mascot", R.mascot, R.mascotHandoff], ["the building", R.building, R.buildingHandoff], ["the final 3D logo", R.final, 4 + t.HANDOFF]]
      .filter(([, from, to]) => to - from < MIN.dwell)
      .map(([what, from, to]) => `${what} holds ${(to - from).toFixed(2)} of a chapter (${from}–${to}, need ${MIN.dwell})`);
  },
  asset(t) {
    const out = [];
    const geometry = Math.max(t.BRAND.g[1], t.BRAND.s[1], t.BRAND.nodes[1]);
    if (t.BRAND.asset[0] < geometry) out.push(`the Brand 3D logo starts at ${t.BRAND.asset[0]}, before the exact geometry completes (${geometry})`);
    const finalGeometry = Math.max(t.FINAL.converge[1], t.FINAL.nodes[1]);
    if (t.FINAL.asset[0] < finalGeometry - 0.05) out.push(`the final 3D logo starts at ${t.FINAL.asset[0]}, before the building has converged (${finalGeometry})`);
    const v = t.handoffVisibility((t.MORPH.swap[0] + t.MORPH.swap[1]) / 2);
    if (v.asset < 0.99) out.push(`the mark is swapped for its strokes with the 3D logo at ${v.asset.toFixed(2)} — the swap is not under the logo`);
    const mid = t.handoffVisibility((t.MORPH.assetOut[0] + t.MORPH.assetOut[1]) / 2);
    if (mid.morph < 0.99) out.push(`the 3D logo dissolves with the structure at ${mid.morph.toFixed(2)} — nothing under it`);
    return out;
  },
  continuity(t) {
    const out = [];
    let worst = 1, at = 0;
    for (const p of range(1.0, 2.3)) {
      const v = t.handoffVisibility(p);
      const shown = Math.max(v.asset, v.mark, v.morph, v.mascot);
      if (shown < worst) [worst, at] = [shown, p];
    }
    if (worst < 0.9) out.push(`the Brand → Motion handoff drops to ${(worst * 100).toFixed(0)}% on screen at ${at.toFixed(3)} — a blank interval`);
    if (t.MORPH.mascot[0] < t.MORPH.arrange[1]) out.push(`the mascot starts resolving at ${t.MORPH.mascot[0]}, before the outline is drawn (${t.MORPH.arrange[1]}) — no construction-outline state`);
    return out;
  },
};

/** The module's own derivations, recomputed on a patched copy of its data. */
function fixture(patch) {
  const t = structuredClone({ HANDOFF: timeline.HANDOFF, BRAND: timeline.BRAND, MORPH: timeline.MORPH, MOTION: timeline.MOTION, TECHNICAL: timeline.TECHNICAL, FINAL: timeline.FINAL });
  patch(t);
  const s = timeline.smooth;
  const handoffVisibility = (p) => ({
    asset: s(t.BRAND.asset, p) * (1 - s(t.MORPH.assetOut, p)),
    mark: s(t.BRAND.enter, p) * (1 - s(t.MORPH.swap, p)),
    morph: s([t.MORPH.swap[0] - 0.01, t.MORPH.swap[0]], p) * (1 - s(t.MORPH.outlineOut, p)),
    mascot: s(t.MORPH.mascot, p) * (1 - s(t.MOTION.mascotOut, p)),
  });
  const RESOLVED = {
    brand: Math.max(t.BRAND.s[1], t.BRAND.g[1], t.BRAND.nodes[1], t.BRAND.asset[1]),
    brandHandoff: Math.min(t.MORPH.swap[0], t.MORPH.assetOut[0]),
    mascot: t.MORPH.mascot[1],
    mascotHandoff: t.MOTION.rig[0],
    building: Math.max(t.TECHNICAL.assemble[1], t.TECHNICAL.dimensions[1], t.TECHNICAL.roofGhost[1], t.TECHNICAL.water[1], t.TECHNICAL.electricalDim[1]),
    buildingHandoff: Math.min(t.FINAL.detailOut[0], t.FINAL.travel[0], t.FINAL.converge[0]),
    final: Math.max(t.FINAL.converge[1], t.FINAL.nodes[1], t.FINAL.asset[1]),
  };
  return { ...t, RESOLVED, handoffVisibility, ...(t.override ?? {}) };
}

// The fixture derivation must be the module's — or every fixture below tests another timeline.
const real = fixture(() => {});
const shipped = timeline.resolved();
for (const k of Object.keys(shipped))
  if (Math.abs(real.RESOLVED[k] - shipped[k]) > 1e-12) throw new Error(`fixture derivation of ${k} disagrees with the module`);
for (const p of range(1.0, 2.3, 0.01))
  if (JSON.stringify(real.handoffVisibility(p)) !== JSON.stringify(timeline.handoffVisibility(p))) throw new Error(`fixture handoffVisibility disagrees with the module at ${p}`);

const BROKEN = [
  ["placement", "inside the dwell", (t) => { t.MORPH.arrange = [1.2, 1.88]; }],
  ["placement", "Motion → Technical starts", (t) => { t.MOTION.faceToPlan = [2.3, 2.8]; }],
  ["resolved", "the building resolves", (t) => { t.TECHNICAL.water = [3.3, 3.45]; }],
  ["resolved", "the Brand 3D logo resolves", (t) => { t.BRAND.asset = [1.3, 1.4]; }],
  ["dwell", "the mascot holds", (t) => { t.MOTION.rig = [2.2, 2.3]; }],
  ["dwell", "the final 3D logo holds", (t) => { t.FINAL.asset = [4.1, 4.25]; }],
  ["asset", "before the exact geometry", (t) => { t.BRAND.asset = [0.9, 1.0]; }],
  ["asset", "not under the logo", (t) => { t.MORPH.swap = [1.6, 1.62]; }],
  ["asset", "nothing under it", (t) => { t.MORPH.swap = [1.58, 1.6]; }],
  ["continuity", "blank interval", (t) => { t.override = { handoffVisibility: (p) => ({ asset: 1 - timeline.smooth([1.5, 1.55], p), mark: 0, morph: 0, mascot: timeline.smooth([1.7, 1.9], p) }) }; }],
  ["continuity", "no construction-outline", (t) => { t.MORPH.mascot = [1.7, 1.8]; }],
];

const problems = [];
for (const [name, check] of Object.entries(CHECKS)) for (const p of check(real)) problems.push(`${name}: ${p}`);
const proven = new Set();
for (const [name, message, patch] of BROKEN) {
  const got = CHECKS[name](fixture(patch));
  if (!got.some((m) => m.includes(message))) problems.push(`${name}/${message}: GATE DEFECT — the broken fixture did not produce "${message}" (got: ${got.join("; ") || "nothing"})`);
  else {
    proven.add(name);
    console.log(`  proof  ${`${name}/${message}`.padEnd(40)} red: ${got.find((m) => m.includes(message))}`);
  }
}
for (const name of Object.keys(CHECKS)) if (!proven.has(name)) problems.push(`${name}: no branch was proven red`);

const R = real.RESOLVED;
console.log(
  `\n  brand    3D logo ${R.brand} · holds to ${R.brandHandoff} (${(R.brandHandoff - R.brand).toFixed(2)})` +
    `\n  mascot   ${R.mascot} · holds to ${R.mascotHandoff} (${(R.mascotHandoff - R.mascot).toFixed(2)})` +
    `\n  building ${R.building} · holds to ${R.buildingHandoff} (${(R.buildingHandoff - R.building).toFixed(2)})` +
    `\n  final    3D logo ${R.final} · holds to ${4 + real.HANDOFF} (${(4 + real.HANDOFF - R.final).toFixed(2)})`,
);
if (problems.length) {
  console.error(`\ncheck-design-timeline: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log(`\ncheck-design-timeline: ${Object.keys(CHECKS).length} rhythm checks hold; ${BROKEN.length} broken fixtures, every branch red\n`);
