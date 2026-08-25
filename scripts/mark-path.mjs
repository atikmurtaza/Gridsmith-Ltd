#!/usr/bin/env node
/**
 * mark-path — solves a floating element's keyframes from the measured free-space maps.
 *
 * Kept after the travelling mark it was written for was rejected (`01-VALIDATION-REPORT.md`
 * §18), because its **negative** result is the reusable part: run against `/` it reports NO PATH
 * at any size at any of the three breakpoints under a speed cap of 5x scroll rate or below. That
 * is a statement about the page, not about the mark, and it is the answer the next proposal for
 * a floating element has to overturn with a measurement rather than a mockup.
 *
 * Input is `mark-freespace.mjs`'s JSON: for each of 375/768/1440, the real ink boxes of every
 * visible text run in the viewport, at every 24px of scroll, over the whole document.
 *
 * ## What is being solved, and why the obvious formulation did not work
 *
 * CSS interpolates linearly between keyframes, so the constraint is not "each keyframe sits in
 * free space" — it is **every point on the interpolated path clears text at the scroll position
 * where the mark is there**. The first version of this file solved that directly, as a DP over
 * (placement × keyframe) with an admissibility test per segment. It reported no feasible path
 * at any breakpoint and any size, which was an artefact twice over:
 *
 *  - the free test read a 24×24 occupancy grid, which at 1440 inflates every text run by up to
 *    60px in each direction. Fixed by testing the raw rects.
 *  - the placement lattice was one grid cell, ~37px vertically. The corridors this page leaves
 *    between paragraphs are of that order, so the lattice could not *express* a path through
 *    them, and the DP's "infeasible" meant "not on this lattice". Refining the lattice makes
 *    the DP quadratic in a number several times larger, which is where the approach stopped
 *    paying for itself.
 *
 * So the search is local instead. The free regions move at exactly one pixel per pixel of
 * scroll, which means the good paths are the ones that *ride* a gap rather than cross the page,
 * and a walk that steps from each sample to the next — nearest free position to where it
 * already is, biased toward a lane that alternates across the scroll so the mark keeps
 * travelling — finds them directly. The dense trajectory is then reduced to keyframes and the
 * **interpolation** is re-verified against every sample; the keyframe count rises until it
 * passes, and the size falls until a walk exists at all.
 *
 * Local search cannot prove infeasibility and does not claim to. The claim it makes is the one
 * that matters: this trajectory, interpolated as CSS will interpolate it, clears every text run
 * at every sampled scroll position. `check-mark-overlap.mjs` then re-establishes that against
 * the rendered page, from the browser's own geometry, sharing no code with this file — and it
 * caught this file being right about a path the browser was not drawing. See §18.1.
 *
 * Usage: node scripts/mark-path.mjs <freespace.json>
 */
import { readFileSync } from 'node:fs';

const report = JSON.parse(readFileSync(process.argv[2], 'utf8'));

/** Base mark width per breakpoint — must match the media queries in markTravel.module.css. */
const BASE_W = { 375: 200, 768: 280, 1440: 360 };
const ASPECT = 320 / 1200;
/** Scale ladder, tried largest first: the mark is as big as the page's whitespace allows. */
const SCALES = [1.2, 1, 0.85, 0.7, 0.6, 0.5, 0.42, 0.35, 0.28, 0.22];
/**
 * The size the mark is at each point of the scroll, as a multiple of the ladder scale.
 *
 * Design intent rather than a solver output, and the solver is bound by it: large at the top
 * where the mark is doing the hero's job, small through the dense middle of the page where the
 * whitespace is at its thinnest, large again at the end where it lands assembled. Feeding it in
 * as a schedule rather than searching over size keeps the size legible — a solver free to pick
 * a size per keyframe produced a mark that flickered between two sizes several times a screen,
 * which reads as a rendering fault rather than as a shape moving toward the reader.
 */
const SIZE_SCHEDULE = [1, 0.62, 0.86, 0.62, 1];
const CLEARANCE = Number(process.env.MARK_CLEARANCE ?? report.clearance);
/** Search step for the walk, in px. Finer than the corridors this page leaves. */
const STEP = 4;
/** Minimum total travel, in viewport heights, before a path counts as travelling at all. */
const MIN_TRAVEL = Number(process.env.MARK_MIN_TRAVEL ?? 8);
/**
 * Lane-bias strengths, tried in order. The bias is what makes the mark cross the page rather
 * than track one corridor for the whole document; too much of it walks the mark into a corner
 * it cannot leave, so it is a ladder rather than a constant.
 */
const LANES = (process.env.MARK_LANES ?? '0.25,0.12,0.05,0').split(',').map(Number);
/**
 * Speed cap: how far the mark may move per 24px scroll sample, as a multiple of that scroll.
 *
 * This is the difference between a path and a strobe. Uncapped, the greedy walk escapes a dead
 * end by crossing the whole viewport between two adjacent samples — measured at 484px in 1.35%
 * of the scroll on the first 375 solution, which renders as the mark flickering from above the
 * fold to below it and back. The page's free regions move at exactly 1px per 1px of scroll, so
 * a cap near 1 keeps the mark travelling *with* the page; the ladder below tries the calmest
 * cap first and loosens only as far as it must.
 */
const SPEEDS = (process.env.MARK_SPEEDS ?? '1.25,1.75,2.5,3.5,5').split(',').map(Number);
const LOOK = Number(process.env.MARK_LOOK ?? 500);
/**
 * How much of its own height the mark may let hang off the top or bottom edge.
 *
 * Expressed as a fraction rather than a pixel slack, because the pixel version had no floor on
 * *visibility*: given unlimited slack the walk satisfies every constraint by parking the mark
 * off-screen, and the first solution that did so was on screen for 2.3% of the scroll at 375.
 * A path the reader never sees clears text perfectly. The ladder tries the least escape first.
 */
const EDGE_FRACTIONS = (process.env.MARK_EDGES ?? '0.25,0.45,0.65,0.8,0.95').split(',').map(Number);

for (const [widthKey, data] of Object.entries(report.widths)) {
  const width = Number(widthKey);
  const { height, samples } = data;
  const W0 = BASE_W[width];

  /** Mark size at sample `si`, from the schedule, in px. */
  const sizeAt = (base) => (si, n) => {
    const u = (si / (n - 1)) * (SIZE_SCHEDULE.length - 1);
    const i = Math.min(SIZE_SCHEDULE.length - 2, Math.floor(u));
    const f = SIZE_SCHEDULE[i] + (SIZE_SCHEDULE[i + 1] - SIZE_SCHEDULE[i]) * (u - i);
    const w = base * f;
    return { w, h: w * ASPECT, f };
  };

  let solved = null;
  /**
   * Search order is the preference order, and **calm outranks size**.
   *
   * Both other orderings were tried and both produced a worse mark. Size-first takes the
   * largest mark at any speed, and the speed it needs is a 480px jump between adjacent samples —
   * the strobe. Escape-first takes the mark that never leaves the viewport, and at 1440 that is
   * 79px wide with nothing at all at 375 or 768. Ordering by speed, then by how much of the
   * mark may hang off an edge, then by size, asks the question in the order a reader
   * experiences it: is the motion plausible, is the mark on screen, is it big enough.
   */
  const ladder = SPEEDS.flatMap((sp) =>
    EDGE_FRACTIONS.flatMap((e) => SCALES.flatMap((sc) => LANES.map((ln) => [e, sp, sc, ln]))),
  );
  for (const [edge, speed, scale, laneBias] of ladder) {
    const base = W0 * scale;
    const size = sizeAt(base);
    const walk = walkPath(samples, width, height, size, speed * report.step, edge, laneBias);
    if (!walk) continue;
    /* A stationary walk satisfies every constraint above and is not a travelling mark. Without
       this floor the search returns one: at 1440 the calmest admissible path was a 79px mark
       that moved 3px over the whole document. The floor is expressed against the viewport so it
       means the same thing at every breakpoint. */
    const distance = walk.slice(1).reduce((a, p, i) => a + Math.hypot(p.x - walk[i].x, p.y - walk[i].y), 0);
    if (distance < MIN_TRAVEL * height) continue;
    const keys = fit(walk, samples, width, height, size, edge);
    if (keys && verify(keys, samples, width, height, size, edge)) solved = { scale, base, size, keys, speed, edge };
    if (process.env.MARK_DEBUG) {
      console.error(`   ${width} base=${Math.round(base)} walk ok, fit ${keys ? keys.length : 'null'}, ${solved ? 'VERIFIED' : 'rejected'}`);
    }
    if (solved) break;
  }

  if (!solved) {
    console.log(`\n/* ${width}px — NO PATH at any size on the ladder. */`);
    continue;
  }

  const { base, size, keys, speed } = solved;
  const travelled = keys.slice(1).reduce((a, p, i) => a + Math.hypot(p.x - keys[i].x, p.y - keys[i].y), 0);
  console.log(`
/* ${width}px — ${keys.length} keyframes, base mark ${Math.round(base)}px wide, from`);
  console.log(`   ${samples.length} scroll samples.`);
  // How much of the scroll the mark is actually on screen for. A path that satisfies the
  // constraint by hiding above the fold satisfies nothing, so this is reported, not assumed.
  const onScreen = samples.filter((_, si) => {
    /* Interpolate against each sample's REAL scroll progress, not its index.
       The two differ: sampling runs `y <= maxScroll` in 24px steps, so the last sample sits
       short of the end and index/(n-1) stretches the path by up to a sample's worth of scroll.
       At the speeds the dense parts of this page force, that is not a rounding error — it was
       253 text overlaps at 768 in the first gate run, from a path the solver called clean. */
    let k = 0;
    while (k < keys.length - 2 && keys[k + 1].p < samples[si].progress) k++;
    const span = keys[k + 1].p - keys[k].p || 1;
    const t = (samples[si].progress - keys[k].p) / span;
    const y = keys[k].y + (keys[k + 1].y - keys[k].y) * t;
    return y + size(si, samples.length).h > 0 && y < height;
  }).length;
  console.log(`   Travels ${Math.round(travelled)}px through the viewport, visible for`);
  console.log(`   ${((onScreen / samples.length) * 100).toFixed(1)}% of the scroll. Clearance ${CLEARANCE}px, speed cap ${speed}x,`);
  console.log(`   up to ${Math.round(solved.edge * 100)}% of the mark may hang off an edge. */`);
  console.log(`@keyframes markTravel${width} {`);
  keys.forEach((p) => {
    const pct = (p.p * 100).toFixed(3).replace(/\.?0+$/, '');
    const f = size(p.i, samples.length).f.toFixed(3);
    console.log(`  ${pct}% { translate: ${Math.round(p.x)}px ${Math.round(p.y)}px; scale: ${f}; }`);
  });
  console.log('}');
}

/**
 * The walk: one position per scroll sample.
 *
 * At each step it takes the free position nearest to where it already is, with a small pull
 * toward an alternating target lane. The pull is what makes it travel rather than settle: with
 * "nearest free" alone the mark tracks one corridor for the whole document, which is the
 * shipped mark with extra steps.
 */
function walkPath(samples, width, height, size, maxStep, edge, laneBias) {
  const n = samples.length;
  /**
   * Horizontally the mark must stay wholly inside the viewport — a fixed box hanging off the
   * right edge is the classic way to grow the document and fail `check:responsive`.
   *
   * Vertically it may pass off the top or bottom edge, and that is a design decision the
   * measurement forced rather than a convenience. Without it there is no continuous corridor at
   * any size at 375 or 768, and none above ~100px at 1440: this page's text occupies the
   * viewport densely at nearly every scroll position, and a mark confined to it is either
   * stationary or trapped. Being allowed to leave gives the mark somewhere to be when the page
   * has no room for it, and reads as the mark moving through the page rather than hovering over
   * it. `EDGE` is the slack, in px, beyond each edge.
   */
  const free = (si, x, y) => {
    const { w, h } = size(si, n);
    if (x < 0 || x + w > width || y < -edge * h || y > height - (1 - edge) * h) return false;
    for (const [l, t, r2, b] of samples[si].rects) {
      if (x < r2 + CLEARANCE && x + w > l - CLEARANCE && y < b + CLEARANCE && y + h > t - CLEARANCE) return false;
    }
    return true;
  };

  // Lanes alternate left / right / left …, one swing per fifth of the document, so the mark
  // crosses the reading column four times over a full scroll instead of hugging one margin.
  const lane = (si) => {
    const phase = (si / n) * 5;
    const side = Math.floor(phase) % 2 === 0 ? 0 : width - size(si, n).w;
    // The vertical target sweeps top→bottom within each swing, so the mark is pulled across
    // the viewport as well as along it and cannot satisfy the bias by sitting in one corner.
    return { x: side, y: (phase % 1) * (height - size(si, n).h) };
  };

  /* Multi-start, because a greedy walk is sensitive to where it begins: removing obstacles can
     make it fail where it previously succeeded, which is not a property a solver should have.
     Sixteen starts spread evenly over the free set at scroll 0, first completed walk wins. */
  const starts = [];
  for (let y = 0; y + size(0, n).h <= height; y += STEP * 4) {
    for (let x = 0; x + size(0, n).w <= width; x += STEP * 4) if (free(0, x, y)) starts.push({ x, y });
  }
  if (!starts.length) return null;
  const picks = Array.from({ length: Math.min(16, starts.length) }, (_, i) =>
    starts[Math.floor((i * starts.length) / Math.min(16, starts.length))],
  );
  for (const start of picks) {
    const p = walkFrom(start);
    if (p) return p;
  }
  return null;

  function walkFrom(start) {
  const path = [start];
  for (let si = 1; si < n; si++) {
    const prev = path[si - 1];
    const target = lane(si);
    let best = null;
    let bestCost = Infinity;
    const reach = Math.min(LOOK, maxStep);
    for (let dy = -reach; dy <= reach; dy += STEP) {
      for (let dx = -reach; dx <= reach; dx += STEP) {
        if (Math.hypot(dx, dy) > maxStep) continue;
        const x = prev.x + dx;
        const y = prev.y + dy;
        if (!free(si, x, y)) continue;
        // Being off the edge is allowed but never preferred: the penalty is what keeps the
        // escape hatch an escape hatch rather than a place the optimiser parks the mark.
        const outside = Math.max(0, -y) + Math.max(0, y + size(si, n).h - height);
        const cost =
          0.2 * Math.hypot(dx, dy) +
          laneBias * (Math.abs(x - target.x) + 0.6 * Math.abs(y - target.y)) +
          3 * outside;
        if (cost < bestCost) {
          bestCost = cost;
          best = { x, y };
        }
      }
    }
    if (!best) return null;
    path.push(best);
  }
  return path;
  }
}

/**
 * Line-simplify the dense walk into keyframes, under the constraint the walk was built for.
 *
 * Even subsampling does not work and the failure is instructive: a walk that clears everything
 * says nothing about the straight lines CSS draws between points taken from it, and at 151
 * evenly-spaced keyframes not one breakpoint verified. This instead extends each segment as far
 * as the *interpolated* line stays clear, then emits a keyframe at the last point that held —
 * so the keyframe count is an output of the page's geometry rather than a number to tune.
 */
function fit(path, samples, width, height, size, edge) {
  const n = samples.length;
  const clear = (a, b) => {
    for (let si = a; si <= b; si++) {
      const t = (si - a) / (b - a || 1);
      const x = path[a].x + (path[b].x - path[a].x) * t;
      const y = path[a].y + (path[b].y - path[a].y) * t;
      const { w, h } = size(si, n);
      if (x < -0.5 || x + w > width + 0.5 || y < -edge * h - 0.5 || y > height - (1 - edge) * h + 0.5) return false;
      for (const [l, t2, r2, b2] of samples[si].rects) {
        if (x < r2 + CLEARANCE && x + w > l - CLEARANCE && y < b2 + CLEARANCE && y + h > t2 - CLEARANCE) return false;
      }
    }
    return true;
  };
  const keys = [{ i: 0, p: samples[0].progress, ...path[0] }];
  let a = 0;
  while (a < path.length - 1) {
    let b = a + 1;
    while (b + 1 < path.length && clear(a, b + 1)) b++;
    if (!clear(a, b)) return null;
    keys.push({ i: b, p: samples[b].progress, ...path[b] });
    a = b;
  }
  return keys;
}

/**
 * Re-check the *interpolated* keyframe path against every sample.
 *
 * This is the step that makes the keyframe count meaningful: a walk that clears everything says
 * nothing about the straight lines CSS will draw between the keyframes taken from it.
 */
function verify(keys, samples, width, height, size, edge) {
  const n = samples.length;
  for (let si = 0; si < samples.length; si++) {
    /* Interpolate against each sample's REAL scroll progress, not its index.
       The two differ: sampling runs `y <= maxScroll` in 24px steps, so the last sample sits
       short of the end and index/(n-1) stretches the path by up to a sample's worth of scroll.
       At the speeds the dense parts of this page force, that is not a rounding error — it was
       253 text overlaps at 768 in the first gate run, from a path the solver called clean. */
    let k = 0;
    while (k < keys.length - 2 && keys[k + 1].p < samples[si].progress) k++;
    const span = keys[k + 1].p - keys[k].p || 1;
    const t = (samples[si].progress - keys[k].p) / span;
    const x = keys[k].x + (keys[k + 1].x - keys[k].x) * t;
    const y = keys[k].y + (keys[k + 1].y - keys[k].y) * t;
    const { w, h } = size(si, n);
    if (x < -0.5 || x + w > width + 0.5 || y < -edge * h - 0.5 || y > height - (1 - edge) * h + 0.5) return false;
    for (const [l, t2, r2, b] of samples[si].rects) {
      if (x < r2 + CLEARANCE && x + w > l - CLEARANCE && y < b + CLEARANCE && y + h > t2 - CLEARANCE) return false;
    }
  }
  return true;
}
