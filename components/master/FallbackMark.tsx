/**
 * The Master fallback mark — `GS-R001-M`. The logo drawn as inline vector shapes, shown when the
 * WebGL scene declines (no WebGL, software WebGL, a slow draw, a failed import).
 *
 * **Why shapes and not the owner's SVG file.** The first fallback was
 * `background-image: url('/brand/gridsmith-logo.svg')`. A background image is an LCP candidate,
 * and on a GPU-less device the fallback appears only after the idle-time capability check — so
 * it became the page's *late* largest paint: CI measured **mobile LCP 3,385ms** against an
 * 1,800ms budget. Vector shapes are never LCP candidates and need no request.
 *
 * The geometry is the owner's, transcribed from `public/brand/gridsmith-logo.svg` (the same
 * numbers `sceneModel.ts` uses): 8 spheres of radius 75, 6 bars 76 wide, in the file's own
 * viewBox. The polish is simplified — one gradient per shape in the stage's gold tokens — because
 * the full file's twelve-stop gradients and specular layers are hex colours, which belong in the
 * asset, not in a component.
 *
 * Server Component, passed to `MasterScene` as children, so it costs nothing in the JS bundle.
 */
const SPHERES = [
  [475, 482], [856, 482], [475, 845], [856, 845],
  [675, 684], [1060, 684], [675, 1044], [1060, 1044],
];
/** `[x, y, width, height]` — the SVG's own `cylinder-1` … `cylinder-6`. */
const BARS = [
  [475, 444, 381, 76], [437, 482, 76, 363], [475, 807, 381, 76],
  [675, 646, 385, 76], [1022, 684, 76, 360], [675, 1006, 385, 76],
];

const stop = (offset: string, token: string) => (
  <stop offset={offset} style={{ stopColor: `var(${token})` }} />
);

export function FallbackMark() {
  return (
    <svg viewBox="307.5 303 920 920" focusable="false">
      <defs>
        <linearGradient id="gs-fb-h" x1="0" y1="0" x2="0" y2="1">
          {stop('0', '--gold-deep')}
          {stop('0.2', '--gold-hi')}
          {stop('0.45', '--gold')}
          {stop('0.6', '--gold-deep')}
          {stop('0.85', '--gold')}
          {stop('1', '--gold-deep')}
        </linearGradient>
        <linearGradient id="gs-fb-v" x1="0" y1="0" x2="1" y2="0" href="#gs-fb-h" />
        <radialGradient id="gs-fb-s" cx="0.36" cy="0.27" r="0.76">
          {stop('0', '--gold-hi')}
          {stop('0.3', '--gold')}
          {stop('0.65', '--gold-deep')}
          {stop('0.9', '--gold')}
          {stop('1', '--gold-deep')}
        </radialGradient>
      </defs>
      {BARS.map(([x, y, w, h]) => (
        <rect key={`${x},${y}`} x={x} y={y} width={w} height={h} fill={`url(#gs-fb-${w > h ? 'h' : 'v'})`} />
      ))}
      {SPHERES.map(([cx, cy]) => (
        <circle key={`${cx},${cy}`} cx={cx} cy={cy} r="75" fill="url(#gs-fb-s)" />
      ))}
    </svg>
  );
}
