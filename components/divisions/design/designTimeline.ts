/**
 * The Design scroll timeline — `GS-DES-002`, remapped at `GS-DES-002-R1`.
 *
 * ## The scale is the page, not a clock
 *
 * Each chapter's copy is in normal flow and sticky (design.css): it arrives with the scroll, holds
 * for its chapter's dwell, then leaves with the scroll while the next chapter's copy arrives below
 * it. `sceneChoreography` measures those positions and maps them to `p`:
 *
 *   p = i            copy i has arrived and settled
 *   p = i + HANDOFF  copy i starts leaving — the next copy is already on its way in
 *   p = i + 1        the next copy has settled
 *
 * So `[i, i + HANDOFF]` is a dwell and `[i + HANDOFF, i + 1]` is two pieces of copy passing each
 * other. Every transformation below is placed in a passing interval, and every finished artefact
 * resolves early in a dwell: the page moves the content, and the scene changes between content.
 * There is no copy envelope any more — no fade, no fixed copy waiting for an animation.
 *
 * Pure data and functions, so `scripts/check-design-timeline.selftest.mjs` asserts the rhythm
 * without a browser.
 */
type Range = readonly [number, number];

/** Fraction of a chapter's progress that is its dwell; the rest is the passing handoff. */
export const HANDOFF = 0.5;

/**
 * Brand: the G + S construct as the Brand copy arrives, the exact mark completes as it settles, and
 * the supplied 3D logo resolves over that exact geometry — then holds with the copy.
 */
export const BRAND = {
  enter: [0.5, 0.72] as Range,
  guides: [0.55, 0.7] as Range,
  g: [0.7, 1.0] as Range,
  s: [0.72, 1.02] as Range,
  nodes: [0.9, 1.02] as Range,
  baseGold: [0.78, 1.02] as Range,
  asset: [1.02, 1.12] as Range,
};

/**
 * Brand → Motion, while the copy passes: the 3D logo dissolves onto the same geometry drawn as
 * bars and spheres (swapped in under it), which thin to strokes and nodes and draw the mascot. The
 * dissolve and the thinning overlap, so a full-size flat mark is never on screen on its own.
 */
export const MORPH = {
  swap: [1.485, 1.5] as Range,
  assetOut: [1.5, 1.58] as Range,
  shrink: [1.52, 1.66] as Range,
  arrange: [1.64, 1.88] as Range,
  mascot: [1.88, 2.0] as Range,
  outlineOut: [1.98, 2.1] as Range,
};

/** Motion: the mascot holds with its copy; as the copy passes, its face becomes the plan. */
export const MOTION = {
  rig: [2.5, 2.58] as Range,
  // GS-DES-002-M1-RC-R1: the mascot yields as the Technical copy arrives (was [2.56, 2.66]: the H2
  // crossed it at 0.65 opacity — 2.54:1 on Linux at 2133×1200 @2.6). Same length, cross-fading the rig.
  mascotOut: [2.5, 2.6] as Range,
  faceToPlan: [2.6, 2.8] as Range,
};

/** Technical: a short construction while the copy arrives, then the coordinated building holds. */
export const TECHNICAL = {
  enter: [2.66, 2.82] as Range,
  assemble: [2.72, 2.9] as Range,
  // GS-DES-002-M1-R1: as the Technical copy crosses the building, its detail (floors, roof, columns,
  // linework) recedes behind the copy — the outline and rig stay — and returns before the dimensions.
  copyOver: [2.66, 2.76] as Range,
  copyClear: [2.84, 2.9] as Range,
  dimensions: [2.9, 2.97] as Range,
  roofGhost: [2.93, 3.0] as Range,
  electrical: [2.95, 3.03] as Range,
  electricalDim: [3.05, 3.1] as Range,
  water: [3.02, 3.1] as Range,
};

/**
 * Final: as the copy passes, the building compresses into the mark; once the final copy has settled
 * the 3D logo resolves on it, in full view — the scene recedes behind copy in transit.
 */
export const FINAL = {
  detailOut: [3.5, 3.62] as Range,
  travel: [3.5, 3.9] as Range,
  converge: [3.52, 3.9] as Range,
  nodes: [3.78, 3.9] as Range,
  asset: [3.98, 4.1] as Range,
};

export const smooth = ([a, b]: Range, p: number) => {
  const t = Math.max(0, Math.min(1, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** What of the Brand → Motion handoff is on screen: the 3D logo, the procedural mark, the strokes, the mascot. */
export const handoffVisibility = (p: number) => ({
  asset: smooth(BRAND.asset, p) * (1 - smooth(MORPH.assetOut, p)),
  mark: smooth(BRAND.enter, p) * (1 - smooth(MORPH.swap, p)),
  morph: smooth([MORPH.swap[0] - 0.01, MORPH.swap[0]], p) * (1 - smooth(MORPH.outlineOut, p)),
  mascot: smooth(MORPH.mascot, p) * (1 - smooth(MOTION.mascotOut, p)),
});

/**
 * Where each finished artefact is resolved and where it starts to hand off. A function, not a
 * constant, so the lazy chunk (8KB budget) does not carry what only the self-test reads.
 */
export const resolved = () => ({
  brand: Math.max(BRAND.s[1], BRAND.g[1], BRAND.nodes[1], BRAND.asset[1]),
  brandHandoff: Math.min(MORPH.swap[0], MORPH.assetOut[0]),
  mascot: MORPH.mascot[1],
  mascotHandoff: MOTION.rig[0],
  building: Math.max(TECHNICAL.assemble[1], TECHNICAL.copyClear[1], TECHNICAL.dimensions[1], TECHNICAL.roofGhost[1], TECHNICAL.water[1], TECHNICAL.electricalDim[1]),
  buildingHandoff: Math.min(FINAL.detailOut[0], FINAL.travel[0], FINAL.converge[0]),
  final: Math.max(FINAL.converge[1], FINAL.nodes[1], FINAL.asset[1]),
});
