/**
 * The Master scene model — `GS-R001-M`. Pure geometry and the scroll narrative, no WebGL.
 *
 * Kept apart from the renderer so its invariants can be asserted by a node self-test
 * (`scripts/check-master-scene.selftest.mjs`) without a browser: the closing pose is the
 * logo exactly, the hero pose is assembled, every rod keeps its length through every
 * formation, and the narrative is continuous.
 *
 * ## The geometry is the owner's vector, transcribed
 *
 * Every number below is read from `public/brand/gridsmith-logo.svg` — the file `GS-R001-R`
 * verified against the raster (shape IoU 0.9624, zero XOR pixels after two erosions). Eight
 * spheres of radius 75 and six bars 76 wide whose ends sit on sphere centres. World units are
 * SVG px / 150, centred on the mark's own bounding box, y up.
 */

export type Vec3 = [number, number, number];

const UNIT = 150;
const CENTRE_X = 767.5;
const CENTRE_Y = 763;
const at = (x: number, y: number): Vec3 => [(x - CENTRE_X) / UNIT, -(y - CENTRE_Y) / UNIT, 0];

export const SPHERE_RADIUS = 75 / UNIT;
export const ROD_RADIUS = 38 / UNIT;

/** `sphere-1` … `sphere-8`, in the SVG's own order. */
export const LOGO_SPHERES: Vec3[] = [
  at(475, 482), at(856, 482), at(475, 845), at(856, 845),
  at(675, 684), at(1060, 684), at(675, 1044), at(1060, 1044),
];

/** `cylinder-1` … `cylinder-6`, as the pair of sphere centres each bar spans. */
export const LOGO_RODS: [number, number][] = [
  [0, 1], [0, 2], [2, 3],
  [4, 5], [5, 7], [6, 7],
];

type Rod = { c: Vec3; d: Vec3; len: number };
export type Formation = { spheres: Vec3[]; rods: Rod[] };

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const scale = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
const len = (a: Vec3) => Math.hypot(a[0], a[1], a[2]);
const norm = (a: Vec3): Vec3 => scale(a, 1 / (len(a) || 1));
const mix = (a: Vec3, b: Vec3, t: number): Vec3 => add(a, scale(sub(b, a), t));
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export const ROD_LENGTHS = LOGO_RODS.map(([a, b]) => len(sub(LOGO_SPHERES[b], LOGO_SPHERES[a])));

function rodBetween(a: Vec3, b: Vec3): Rod {
  return { c: mix(a, b, 0.5), d: norm(sub(b, a)), len: len(sub(b, a)) };
}

/** The mark as drawn. */
const LOGO: Formation = {
  spheres: LOGO_SPHERES,
  rods: LOGO_RODS.map(([a, b]) => rodBetween(LOGO_SPHERES[a], LOGO_SPHERES[b])),
};

/**
 * The two interlocking halves drawn apart in depth. The mark is two brackets — spheres 1–4
 * with bars 1–3, spheres 5–8 with bars 4–6 — and this is the only formation that says so.
 */
const SPLIT: Formation = (() => {
  const shiftA: Vec3 = [-0.55, 0.3, 1.1];
  const shiftB: Vec3 = [0.55, -0.3, -1.1];
  const shift = (i: number) => (i < 4 ? shiftA : shiftB);
  return {
    spheres: LOGO_SPHERES.map((p, i) => add(p, shift(i))),
    rods: LOGO.rods.map((r, i) => ({ ...r, c: add(r.c, i < 3 ? shiftA : shiftB) })),
  };
})();

/**
 * The six bars laid end to end as one receding path — the process section's six stages. The
 * spheres become the joints; the eighth, which has no bar to carry, sits one step beyond the
 * end. Each bar keeps its logo length, so the path is built from the mark's own parts.
 */
const CHAIN_ORDER = [1, 0, 2, 3, 4, 5, 7];
const CHAIN_SPARE = 6;
const CHAIN: Formation = (() => {
  const nodes: Vec3[] = [[0, 0, 0]];
  for (let i = 0; i < 6; i++) {
    const dir = norm([1, i % 2 ? 0.16 : -0.16, -0.62]);
    nodes.push(add(nodes[i], scale(dir, ROD_LENGTHS[i])));
  }
  const spare = add(nodes[6], scale(norm([1, 0.16, -0.62]), 1.35));
  const mid = scale(add(nodes[0], spare), 0.5);
  const centred = nodes.map((n) => sub(n, mid));
  const spheres: Vec3[] = new Array(8);
  CHAIN_ORDER.forEach((s, i) => (spheres[s] = centred[i]));
  spheres[CHAIN_SPARE] = sub(spare, mid);
  return { spheres, rods: ROD_LENGTHS.map((_, i) => rodBetween(centred[i], centred[i + 1])) };
})();

/**
 * All fourteen pieces standing on one circle, bars upright — the reviews section's ring, and
 * a deliberate echo of the review cylinder it replaces.
 */
const RING: Formation = (() => {
  const radius = 3.6;
  const slot = (k: number): Vec3 => {
    const a = (k / 14) * Math.PI * 2;
    return [Math.sin(a) * radius, 0, Math.cos(a) * radius];
  };
  const spheres: Vec3[] = new Array(8);
  CHAIN_ORDER.forEach((s, i) => (spheres[s] = slot(i * 2)));
  spheres[CHAIN_SPARE] = slot(13);
  return {
    spheres,
    rods: ROD_LENGTHS.map((l, i) => ({ c: slot(i * 2 + 1), d: [0, 1, 0] as Vec3, len: l })),
  };
})();

export const FORMATIONS = { logo: LOGO, split: SPLIT, chain: CHAIN, ring: RING } as const;
export type FormationName = keyof typeof FORMATIONS;

/**
 * One pose per homepage chapter, reached when that chapter's centre crosses the middle of the
 * viewport. `off` is the mark's centre as a fraction of the half-viewport, so the composition
 * holds at any aspect ratio. `shade` darkens the scene under the text column, which ends at
 * `edge` (0–1 across the viewport, >1 means the whole width).
 */
export type Key = {
  form: FormationName;
  rot: Vec3;
  off: [number, number];
  dist: number;
  exposure: number;
  shade: number;
  edge: number;
  light: number;
  glow: number;
};

export const CHAPTERS = ['hero', 'studios', 'context', 'process', 'reviews', 'close'] as const;

export const KEYS_WIDE: Key[] = [
  { form: 'logo', rot: [0.14, -0.55, 0.02], off: [0.5, 0.04], dist: 14, exposure: 1.0, shade: 0.55, edge: 0.5, light: 0, glow: 0.45 },
  { form: 'split', rot: [-0.18, 0.8, 0.1], off: [0.56, 0.0], dist: 14.5, exposure: 0.95, shade: 0.8, edge: 0.6, light: 0.9, glow: 0.3 },
  { form: 'logo', rot: [0.42, 1.25, 0.22], off: [0.42, -0.05], dist: 5.2, exposure: 0.85, shade: 0.85, edge: 0.62, light: 1.8, glow: 0.25 },
  { form: 'chain', rot: [0.3, -0.4, 0.0], off: [0.08, -0.6], dist: 16, exposure: 0.95, shade: 0.7, edge: 0.6, light: 2.6, glow: 0.2 },
  { form: 'ring', rot: [0.34, 0.0, 0.0], off: [-0.55, -0.86], dist: 27, exposure: 1.0, shade: 0.5, edge: 0.44, light: 3.4, glow: 0.3 },
  { form: 'logo', rot: [0, 0, 0], off: [0.52, 0.0], dist: 13, exposure: 1.1, shade: 0.5, edge: 0.48, light: 6.28, glow: 0.6 },
];

/**
 * Below 1024px there is no free column. The mark sits above the hero and closing copy, and
 * mid-page it travels between sections, where copy blocks carry the stage veil
 * (`--canvas-veil`) so text never sits on bare gold. Same story, same formations.
 */
export const KEYS_NARROW: Key[] = [
  { form: 'logo', rot: [0.12, -0.5, 0.02], off: [0.0, 0.4], dist: 28, exposure: 1.0, shade: 0.0, edge: 1.2, light: 0, glow: 0.4 },
  { form: 'split', rot: [-0.18, 0.8, 0.1], off: [0.15, 0.0], dist: 22, exposure: 0.6, shade: 0.0, edge: 1.2, light: 0.9, glow: 0.25 },
  { form: 'logo', rot: [0.42, 1.25, 0.22], off: [0.2, 0.0], dist: 9, exposure: 0.6, shade: 0.0, edge: 1.2, light: 1.8, glow: 0.2 },
  { form: 'chain', rot: [0.3, -0.4, 0.0], off: [0.0, 0.0], dist: 17, exposure: 0.6, shade: 0.0, edge: 1.2, light: 2.6, glow: 0.2 },
  { form: 'ring', rot: [0.3, 0.0, 0.0], off: [0.0, 0.0], dist: 17, exposure: 0.6, shade: 0.0, edge: 1.2, light: 3.4, glow: 0.2 },
  { form: 'logo', rot: [0, 0, 0], off: [0.0, 0.4], dist: 28, exposure: 1.0, shade: 0.0, edge: 1.2, light: 6.28, glow: 0.5 },
];

/** Lingers on each pose and moves between them: most of the scroll between two chapters is travel. */
const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export type Pose = {
  spheres: Vec3[];
  rodA: Vec3[];
  rodB: Vec3[];
  dist: number;
  exposure: number;
  shade: number;
  edge: number;
  light: number;
  glow: number;
  /** Where the mark's centre lands, in NDC — for the glow. */
  centre: [number, number];
};

function rotate(p: Vec3, [rx, ry, rz]: Vec3): Vec3 {
  let [x, y, z] = p;
  // X, then Y, then Z.
  [y, z] = [y * Math.cos(rx) - z * Math.sin(rx), y * Math.sin(rx) + z * Math.cos(rx)];
  [x, z] = [x * Math.cos(ry) + z * Math.sin(ry), -x * Math.sin(ry) + z * Math.cos(ry)];
  [x, y] = [x * Math.cos(rz) - y * Math.sin(rz), x * Math.sin(rz) + y * Math.cos(rz)];
  return [x, y, z];
}

/**
 * The pose at chapter position `p` (0 = hero … 5 = close, fractional between them).
 *
 * `extra` carries what is not scroll: the idle sway and the pointer tilt, both added to the
 * rotation and both zero under reduced motion. `tanHalf` and `aspect` place the mark by
 * screen fraction.
 */
export function pose(
  keys: Key[],
  p: number,
  extra: Vec3,
  tanHalf: number,
  aspect: number,
): Pose {
  const clamped = Math.min(Math.max(p, 0), keys.length - 1);
  const i = Math.min(Math.floor(clamped), keys.length - 2);
  const t = ease(clamped - i);
  const a = keys[i];
  const b = keys[i + 1];
  const fa = FORMATIONS[a.form];
  const fb = FORMATIONS[b.form];

  const ringWeight = (a.form === 'ring' ? 1 - t : 0) + (b.form === 'ring' ? t : 0);
  const rot: Vec3 = [
    lerp(a.rot[0], b.rot[0], t) + extra[0],
    lerp(a.rot[1], b.rot[1], t) + extra[1] + ringWeight * (clamped - 4) * 1.6,
    lerp(a.rot[2], b.rot[2], t) + extra[2],
  ];
  const dist = lerp(a.dist, b.dist, t);
  const halfH = dist * tanHalf;
  const offset: Vec3 = [
    lerp(a.off[0], b.off[0], t) * halfH * aspect,
    lerp(a.off[1], b.off[1], t) * halfH,
    0,
  ];
  const place = (q: Vec3) => add(rotate(q, rot), offset);

  const spheres = fa.spheres.map((s, k) => place(mix(s, fb.spheres[k], t)));
  const rodA: Vec3[] = [];
  const rodB: Vec3[] = [];
  fa.rods.forEach((ra, k) => {
    const rb = fb.rods[k];
    // A bar has no head: align the two axes before blending, so a bar never flips through zero.
    const db = dot(ra.d, rb.d) < 0 ? scale(rb.d, -1) : rb.d;
    const d = norm(mix(ra.d, db, t));
    const c = mix(ra.c, rb.c, t);
    const h = lerp(ra.len, rb.len, t) / 2;
    rodA.push(place(sub(c, scale(d, h))));
    rodB.push(place(add(c, scale(d, h))));
  });

  return {
    spheres,
    rodA,
    rodB,
    dist,
    exposure: lerp(a.exposure, b.exposure, t),
    shade: lerp(a.shade, b.shade, t),
    edge: lerp(a.edge, b.edge, t),
    light: lerp(a.light, b.light, t),
    glow: lerp(a.glow, b.glow, t),
    centre: [lerp(a.off[0], b.off[0], t), lerp(a.off[1], b.off[1], t)],
  };
}
