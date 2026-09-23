/** Persistent outline geometry for the Design chapter handoffs. */
const line = (x: number, y: number, a: number, b: number) =>
  [x, y, x + (a - x) / 3, y + (b - y) / 3, x + 2 * (a - x) / 3, y + 2 * (b - y) / 3, a, b];

// Exact centres of the six existing 76-unit bars, after translate(110 95) scale(.5).
export const markCurves = [
  line(538, 336, 347.5, 336),
  line(347.5, 336, 347.5, 517.5),
  line(347.5, 517.5, 538, 517.5),
  line(447.5, 437, 640, 437),
  line(640, 437, 640, 617),
  line(640, 617, 447.5, 617),
];
// The roof, external perimeter and lowest floor plate form the six persistent edges.
export const buildingCurves = [
  line(495, 135, 273, 238),
  line(273, 238, 280, 620),
  line(280, 620, 504, 738),
  line(495, 135, 731, 246),
  line(731, 246, 721, 628),
  line(721, 628, 504, 738),
];
export const buildingNodeStarts = [[273, 238], [495, 135], [280, 620], [504, 738], [495, 135], [731, 246], [504, 738], [721, 628]];

export function interpolate(from: number[], to: number[], t: number) {
  return from.map((n, i) => n + (to[i] - n) * t);
}

export function outline(points: number[]) {
  let d = `M${points[0]} ${points[1]}`;
  for (let i = 2; i < points.length; i += 6) d += `C${points.slice(i, i + 6).join(" ")}`;
  return `${d}Z`;
}
export function letterOutline(shape: { from: number[]; to: number[] }, progress: number) {
  const ease = (a: number, b: number) => {
    const t = Math.max(0, Math.min(1, (progress - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  const engineered = [...shape.from];
  // First straighten the actual glyph's curves, keeping all shared cuts sealed.
  // Only then move its filled sections apart into the mark's bar arrangement.
  for (let i = 2; i < engineered.length; i += 6) {
    for (let control = 0; control < 2; control++) for (let axis = 0; axis < 2; axis++) {
      const start = shape.from[i - 2 + axis];
      const end = shape.from[i + 4 + axis];
      const index = i + control * 2 + axis;
      const straight = start + (end - start) * (control + 1) / 3;
      engineered[index] += (straight - engineered[index]) * 0.65 * ease(0, 0.4);
    }
  }
  return outline(interpolate(engineered, shape.to, ease(0.38, 1)));
}
export const curvePath = (points: number[]) => `M${points[0]} ${points[1]}C${points.slice(2).join(" ")}`;

/** A travelling fundamental with small harmonics, not a translated static path. */
export function travellingWave(phase: number, time: number, progress: number) {
  const chapter = Math.min(4, Math.floor(progress));
  const t = Math.max(0, Math.min(1, (progress - chapter - 0.6) / 0.4));
  const blend = t * t * (3 - 2 * t);
  const next = Math.min(4, chapter + 1);
  const centres = [420, 430, 440, 430, 450];
  const amplitudes = [105, 120, 135, 125, 95];
  const centre = centres[chapter] + (centres[next] - centres[chapter]) * blend;
  const amplitude = amplitudes[chapter] + (amplitudes[next] - amplitudes[chapter]) * blend;
  const y = (x: number) => {
    const theta = x * Math.PI * 2 / 680 - phase;
    const envelope = 0.76 + 0.24 * Math.sin(Math.PI * (x - 65) / 880);
    return centre + amplitude * envelope * (Math.sin(theta) + 0.18 * Math.sin(2 * theta + 0.55))
      + 8 * Math.sin(x / 240 - time * 0.23);
  };
  const slope = (x: number) => (y(x + 0.1) - y(x - 0.1)) / 0.2;
  const n = (v: number) => v.toFixed(2);
  let d = `M65 ${n(y(65))}`;
  for (let x = 65; x < 945; x += 40) {
    const end = x + 40;
    d += `C${n(x + 40 / 3)} ${n(y(x) + slope(x) * 40 / 3)} ${n(end - 40 / 3)} ${n(y(end) - slope(end) * 40 / 3)} ${end} ${n(y(end))}`;
  }
  return d;
}

// Landmarks follow the supplied 1405x1760 image and its internal .hs-fit transform.
// Outer hair/head, cheeks/jaw/ear; hairline; brows/visor; nose; mouth. No artwork is altered.
export const facePoints = [
  [499, 158], [401, 172], [330, 238], [322, 332], [341, 465], [378, 561],
  [466, 611], [549, 613], [614, 570], [666, 521], [669, 383], [623, 249],
  [393, 284], [491, 272], [588, 302],
  [344, 397], [419, 386], [484, 390], [552, 384], [623, 398],
  [351, 498], [419, 523], [455, 480], [488, 511], [534, 526], [617, 497],
  [459, 474], [460, 513], [480, 519],
  [437, 543], [473, 549], [516, 542],
];
export const architecturalPoints = [
  [495, 135], [384, 186], [273, 238], [280, 335], [280, 430], [280, 620],
  [504, 738], [612, 683], [721, 628], [721, 438], [731, 246], [613, 191],
  [385, 187], [495, 135], [612, 191],
  [280, 335], [388, 284], [495, 234], [608, 288], [721, 343],
  [280, 430], [392, 489], [504, 548], [612, 493], [721, 438], [721, 343],
  [495, 335], [495, 430], [504, 525],
  [280, 525], [504, 643], [721, 533],
];
export const faceLines = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
  [3, 12, 13, 14, 10],
  [15, 16, 17, 18, 19, 25, 24, 23, 22, 21, 20, 15],
  [17, 26, 27, 28], [29, 30, 31], [4, 20], [9, 25],
];
export const wirePath = (points: number[][]) => faceLines
  .map(indices => indices.map((i, n) => `${n ? 'L' : 'M'}${points[i]}`).join(' '))
  .join(' ');
