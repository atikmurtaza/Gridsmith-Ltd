import { CHAPTERS, KEYS_NARROW, KEYS_WIDE, ROD_RADIUS, SPHERE_RADIUS, pose, type Vec3 } from './sceneModel';

/**
 * The Master scene renderer — `GS-R001-M`. Loaded by `MasterScene` with a dynamic `import()`
 * after first paint, so none of it is on the homepage's initial JS or its LCP path.
 *
 * ## Why a ray tracer in one fragment shader, and not Three.js
 *
 * The mark is eight spheres and six cylinders. Both have exact ray intersections, so the whole
 * scene is fourteen analytic tests per pixel — no meshes, no tessellation, no environment
 * texture, no post-processing pass. What that buys over the owner's earlier Three.js build
 * (`gridsmith-working`: drei `Environment`, bloom, 32-segment spheres) is **exact silhouettes at
 * any zoom and true inter-reflection** — a sphere mirrors its neighbours, which a rasterised
 * scene needs cube-map probes for — at a few kilobytes instead of ~150KB gz of library.
 * `GS-R001-M` §8 authorised Three.js if justified; for this geometry it is not.
 *
 * ## It renders when something changes
 *
 * Scroll and pointer set targets; a damped loop runs until the pose settles and then stops.
 * The only continuous motion is a slow sway on the hero and closing chapters, capped at 30fps.
 * `requestAnimationFrame` already stops in a background tab. Resolution is capped by pixel
 * count and backs off if frames run long.
 *
 * Returns a disposer, or `null` if WebGL is unavailable or the shader does not compile — the
 * caller then shows the static fallback.
 */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uDist, uTanHalf, uExposure, uShade, uEdge, uLight, uGlow, uAA;
uniform vec2 uCentre;
uniform vec3 uS[8];
uniform vec3 uA[6];
uniform vec3 uB[6];
uniform vec3 uBg, uHi, uGold, uDeep;
const float RS = ${SPHERE_RADIUS.toFixed(5)};
const float RR = ${ROD_RADIUS.toFixed(5)};

float sph(vec3 ro, vec3 rd, vec3 c, inout float tm, inout vec3 n) {
  vec3 oc = ro - c;
  float b = dot(oc, rd);
  float h = b * b - dot(oc, oc) + RS * RS;
  if (h < 0.0) return 0.0;
  float t = -b - sqrt(h);
  if (t > 0.001 && t < tm) { tm = t; n = (oc + t * rd) / RS; return 1.0; }
  return 0.0;
}

// Capped cylinder, after Inigo Quilez.
float cyl(vec3 ro, vec3 rd, vec3 a, vec3 b, inout float tm, inout vec3 n) {
  vec3 ba = b - a, oc = ro - a;
  float baba = dot(ba, ba), bard = dot(ba, rd), baoc = dot(ba, oc);
  float k2 = baba - bard * bard;
  float k1 = baba * dot(oc, rd) - baoc * bard;
  float k0 = baba * dot(oc, oc) - baoc * baoc - RR * RR * baba;
  float h = k1 * k1 - k2 * k0;
  if (h < 0.0) return 0.0;
  h = sqrt(h);
  float t = (-k1 - h) / k2;
  float y = baoc + t * bard;
  if (y > 0.0 && y < baba) {
    if (t > 0.001 && t < tm) { tm = t; n = (oc + t * rd - ba * y / baba) / RR; return 1.0; }
    return 0.0;
  }
  t = ((y < 0.0 ? 0.0 : baba) - baoc) / bard;
  if (abs(k1 + k2 * t) < h && t > 0.001 && t < tm) { tm = t; n = ba * sign(y) / sqrt(baba); return 1.0; }
  return 0.0;
}

float trace(vec3 ro, vec3 rd, out vec3 n) {
  float tm = 1e9;
  float hit = 0.0;
  n = vec3(0.0);
  for (int i = 0; i < 8; i++) hit = max(hit, sph(ro, rd, uS[i], tm, n));
  for (int i = 0; i < 6; i++) hit = max(hit, cyl(ro, rd, uA[i], uB[i], tm, n));
  return hit > 0.5 ? tm : -1.0;
}

// A dark studio: one large key softbox, a vertical strip, a warm floor bounce. The softboxes
// are the same device the supplied logo uses for its highlights.
vec3 env(vec3 d) {
  float c = cos(uLight), s = sin(uLight);
  d.xz = mat2(c, -s, s, c) * d.xz;
  vec3 col = uDeep * (0.05 + 0.05 * d.y);
  float key = dot(d, normalize(vec3(-0.6, 0.62, 0.5)));
  col += uHi * 1.7 * pow(smoothstep(0.55, 0.985, key), 2.2);
  col += uGold * 0.35 * smoothstep(0.0, 0.9, key);
  col += uHi * 1.5 * smoothstep(0.1, 0.0, abs(d.x - 0.78)) * smoothstep(-0.4, 0.3, d.y) * step(-0.2, d.z);
  col += uGold * 0.45 * smoothstep(0.05, -0.6, d.y);
  col += uHi * 0.3 * exp(-abs(d.y + 0.05) * 16.0);
  return col;
}

vec3 shadeGold(vec3 rd, vec3 n, vec3 p) {
  vec3 r = reflect(rd, n);
  float f = pow(1.0 - max(dot(-rd, n), 0.0), 5.0);
  vec3 F = uGold + (1.0 - uGold) * f;
  vec3 n2;
  float t2 = trace(p + n * 0.002, r, n2);
  vec3 refl;
  if (t2 > 0.0) {
    // One bounce: a neighbour, lit by the environment, seen in gold.
    refl = env(reflect(r, n2)) * uGold * 0.85;
  } else {
    refl = env(r);
  }
  return refl * F + uDeep * 0.04;
}

vec3 sample(vec2 px) {
  vec2 uv = (px - 0.5 * uRes) / uRes.y;
  vec3 ro = vec3(0.0, 0.0, uDist);
  vec3 rd = normalize(vec3(uv * 2.0 * uTanHalf, -1.0));
  vec3 n;
  float t = trace(ro, rd, n);
  if (t < 0.0) return vec3(-1.0);
  vec3 c = shadeGold(rd, n, ro + rd * t);
  return 1.0 - exp(-c * uExposure);
}

void main() {
  vec2 px = gl_FragCoord.xy;
  vec3 c = sample(px);
  float cov = c.x < 0.0 ? 0.0 : 1.0;
  vec3 acc = max(c, 0.0);
  if (uAA > 0.5) {
    vec3 c2 = sample(px + vec2(0.5, 0.5));
    cov = 0.5 * cov + 0.5 * (c2.x < 0.0 ? 0.0 : 1.0);
    acc = acc + max(c2, 0.0);
    acc = cov > 0.0 ? acc / (2.0 * cov) : acc;
  }
  acc = pow(acc, vec3(1.0 / 2.2));

  vec2 q = px / uRes;
  vec2 ndc = q * 2.0 - 1.0;
  vec2 dc = (ndc - uCentre) * vec2(uRes.x / uRes.y, 1.0);
  vec3 bg = uBg + pow(uGold, vec3(1.0 / 2.2)) * uGlow * 0.16 * exp(-dot(dc, dc) * 1.6);

  vec3 col = mix(bg, acc, cov);
  float under = uEdge > 1.0 ? 1.0 : 1.0 - smoothstep(uEdge - 0.2, uEdge + 0.08, q.x);
  col = mix(col, bg * 0.9, uShade * under * cov);
  gl_FragColor = vec4(col, 1.0);
}
`;

/** `#rrggbb` → linear RGB. Colours come from the stage tokens; none is written here. */
function tokenLinear(style: CSSStyleDeclaration, name: string): Vec3 {
  const v = style.getPropertyValue(name).trim();
  const ch = (i: number) => {
    const c = parseInt(v.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return [ch(1), ch(3), ch(5)];
}
function tokenSrgb(style: CSSStyleDeclaration, name: string): Vec3 {
  const v = style.getPropertyValue(name).trim();
  return [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16) / 255) as Vec3;
}

const FOV_TAN_HALF = Math.tan((32 * Math.PI) / 180 / 2);

export function startScene(canvas: HTMLCanvasElement, opts: { reduced: boolean }): (() => void) | null {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const U = {
    res: u('uRes'), dist: u('uDist'), tan: u('uTanHalf'), exp: u('uExposure'), shade: u('uShade'),
    edge: u('uEdge'), light: u('uLight'), glow: u('uGlow'), aa: u('uAA'), centre: u('uCentre'),
    s: u('uS'), a: u('uA'), b: u('uB'),
  };

  const style = getComputedStyle(canvas);
  gl.uniform3fv(u('uBg'), tokenSrgb(style, '--canvas'));
  gl.uniform3fv(u('uHi'), tokenLinear(style, '--gold-hi'));
  gl.uniform3fv(u('uGold'), tokenLinear(style, '--gold'));
  gl.uniform3fv(u('uDeep'), tokenLinear(style, '--gold-deep'));
  gl.uniform1f(U.tan, FOV_TAN_HALF);

  // Below 1024px the copy runs the full width, so the stacked composition applies (home.module.css).
  const narrow = matchMedia('(max-width: 1023px)');
  const coarse = matchMedia('(pointer: coarse)');

  // Resolution: device pixels, capped by count, and reduced if frames run long.
  let quality = 1;
  let width = 0;
  let height = 0;
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    const cap = narrow.matches ? 700_000 : 1_900_000;
    const s = Math.min(dpr, Math.sqrt(cap / Math.max(cssW * cssH, 1))) * quality;
    width = Math.max(1, Math.round(cssW * s));
    height = Math.max(1, Math.round(cssH * s));
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.uniform2f(U.res, width, height);
    // Two samples when a device pixel is larger than half a CSS pixel's worth of detail.
    gl.uniform1f(U.aa, s < 1.5 && !narrow.matches ? 1 : 0);
  };

  // Chapter position from the sections' centres — 0 at the hero, 5 at the close.
  let centres: number[] = [];
  const measure = () => {
    centres = CHAPTERS.map((name) => {
      const el = document.querySelector<HTMLElement>(`[data-chapter="${name}"]`);
      if (!el) return NaN;
      const r = el.getBoundingClientRect();
      return r.top + scrollY + Math.min(r.height, innerHeight) / 2;
    });
  };
  const chapterAt = () => {
    const y = scrollY + innerHeight / 2;
    if (!(y > centres[0])) return 0;
    for (let i = 0; i < centres.length - 1; i++) {
      if (y < centres[i + 1]) return i + (y - centres[i]) / (centres[i + 1] - centres[i]);
    }
    return centres.length - 1;
  };

  let target = opts.reduced ? 0 : chapterAt();
  let current = target;
  let pointer: [number, number] = [0, 0];
  let tilt: [number, number] = [0, 0];
  let raf = 0;
  let last = 0;
  let lastDraw = 0;
  let slow = 0;

  const draw = (now: number) => {
    const keys = narrow.matches ? KEYS_NARROW : KEYS_WIDE;
    const sway = opts.reduced
      ? 0
      : (Math.max(0, 1 - current) + Math.max(0, current - 4)) * 0.09 * Math.sin(now / 2600);
    const extra: Vec3 = [tilt[1] * 0.1, tilt[0] * 0.16 + sway, 0];
    const p = pose(keys, current, extra, FOV_TAN_HALF, width / height);
    gl.uniform1f(U.dist, p.dist);
    gl.uniform1f(U.exp, p.exposure * 1.35);
    gl.uniform1f(U.shade, p.shade);
    gl.uniform1f(U.edge, p.edge);
    gl.uniform1f(U.light, p.light);
    gl.uniform1f(U.glow, p.glow);
    gl.uniform2f(U.centre, p.centre[0], p.centre[1]);
    gl.uniform3fv(U.s, p.spheres.flat());
    gl.uniform3fv(U.a, p.rodA.flat());
    gl.uniform3fv(U.b, p.rodB.flat());
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min((now - (last || now)) / 1000, 0.1);
    last = now;
    const k = 1 - Math.exp(-dt * 6);
    current += (target - current) * k;
    tilt = [tilt[0] + (pointer[0] - tilt[0]) * k, tilt[1] + (pointer[1] - tilt[1]) * k];
    const moving =
      Math.abs(target - current) > 0.0005 ||
      Math.abs(pointer[0] - tilt[0]) + Math.abs(pointer[1] - tilt[1]) > 0.001;
    const swaying = !opts.reduced && (current < 1 || current > 4);

    if (moving || now - lastDraw > 33) {
      const t0 = performance.now();
      draw(now);
      lastDraw = now;
      // Back off resolution if frames keep running long; never below 60%.
      if (performance.now() - t0 > 22 && ++slow > 20 && quality > 0.6) {
        quality -= 0.1;
        slow = 0;
        resize();
      }
    }
    if (moving || swaying) raf = requestAnimationFrame(frame);
    else last = 0;
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  const onScroll = () => {
    if (opts.reduced) return;
    target = chapterAt();
    kick();
  };
  const onPointer = (e: PointerEvent) => {
    if (opts.reduced || coarse.matches || e.pointerType !== 'mouse') return;
    pointer = [e.clientX / innerWidth - 0.5, e.clientY / innerHeight - 0.5];
    kick();
  };
  const onResize = () => {
    resize();
    measure();
    target = opts.reduced ? 0 : chapterAt();
    current = target;
    draw(performance.now());
    kick();
  };
  const onLost = (e: Event) => {
    e.preventDefault();
    cancelAnimationFrame(raf);
    canvas.dispatchEvent(new CustomEvent('gs-scene-lost', { bubbles: true }));
  };

  const ro = new ResizeObserver(onResize);
  ro.observe(document.body);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('pointermove', onPointer, { passive: true });
  canvas.addEventListener('webglcontextlost', onLost);

  resize();
  measure();
  target = current = opts.reduced ? 0 : chapterAt();
  draw(performance.now());
  kick();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    removeEventListener('scroll', onScroll);
    removeEventListener('pointermove', onPointer);
    canvas.removeEventListener('webglcontextlost', onLost);
    gl.deleteBuffer(buf);
    gl.deleteProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}
