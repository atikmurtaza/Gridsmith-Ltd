#!/usr/bin/env node
/** Actual scene/effect code with deterministic browser doubles: lifecycle, not raster evidence. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

function load(file, globals, imports = {}) {
  const compiled = { exports: {} };
  const code = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  vm.runInNewContext(code, { ...globals, module: compiled, exports: compiled.exports, require: name => {
    if (name in imports) return imports[name];
    assert(name.startsWith('.'), `Unexpected import ${name}`);
    return load(resolve(dirname(file), `${name}.ts`), globals, imports);
  } }, { filename: file });
  return compiled.exports;
}

const listeners = new Map();
const add = (name, fn) => { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); };
const remove = (name, fn) => listeners.get(name)?.delete(fn);
const fire = (name, event = {}) => { for (const fn of listeners.get(name) ?? []) fn(event); };
let rafId = 0, disposed = 0, observed = 0, draws = 0;
let invalidChapter = false, resizeCallback;
const frames = new Map(), uniforms = new Map(), created = [], deleted = [];
const gl = new Proxy({}, { get: (_, key) => {
  if (key === 'getExtension') return name => name === 'WEBGL_lose_context' ? { loseContext: () => disposed++ } : null;
  if (key === 'getParameter') return () => 'Hardware test double';
  if (key === 'getShaderParameter' || key === 'getProgramParameter') return () => true;
  if (key === 'getUniformLocation') return (_, name) => name;
  if (String(key).startsWith('uniform')) return (name, ...values) => {
    if (['uS', 'uA', 'uB'].includes(name)) assert(Array.from(values[0]).every(Number.isFinite), `${name} geometry must be finite with reviews withheld`);
    uniforms.set(name, JSON.stringify(values));
  };
  if (String(key).startsWith('create')) return () => { const value = {}; created.push(value); return value; };
  if (String(key).startsWith('delete')) return value => deleted.push(value);
  if (key === 'drawArrays') return () => draws++;
  return () => {};
} });
const layer = { dataset: {} };
const canvasToken = readFileSync(resolve('styles/themes/master-stage.css'), 'utf8').match(/--canvas:\s*([^;]+);/)[1];
const canvas = { parentElement: layer, clientWidth: 1440, clientHeight: 900, getContext: () => gl, toggleAttribute() {}, addEventListener: add, removeEventListener: remove, dispatchEvent: e => fire(e.type, e) };
const globals = {
  console, Float32Array, URLSearchParams, CustomEvent, location: { search: '' }, performance: { now: () => 100 },
  innerWidth: 1440, innerHeight: 900, devicePixelRatio: 1, scrollY: 4050,
  getComputedStyle: () => ({ getPropertyValue: () => canvasToken }),
  document: { body: {}, documentElement: { hasAttribute: () => false }, querySelector: selector => {
    const name = selector.match(/^\[data-chapter="([a-z]+)"\]$/)?.[1];
    if (invalidChapter && name === 'hero') return null;
    const centre = { hero: 500, studios: 1500, context: 2500, process: 3500, close: 5500 }[name];
    return centre === undefined ? null : { getBoundingClientRect: () => ({ top: centre - 450 - 4050, height: 900 }), querySelector: () => null };
  }, querySelectorAll: () => [] },
  matchMedia: () => ({ matches: false }), addEventListener: add, removeEventListener: remove,
  requestAnimationFrame: fn => { frames.set(++rafId, fn); return rafId; }, cancelAnimationFrame: id => frames.delete(id),
  ResizeObserver: class { constructor(callback) { resizeCallback = callback; } observe() { observed++; } disconnect() { observed--; } },
};
const { startScene } = load(resolve('components/master/scene.ts'), globals);
const scene = startScene(canvas, { reduced: false });
assert(['uS', 'uA', 'uB'].every(name => uniforms.has(name)), 'All real geometry uploads measured at the withheld review centre');
assert.equal(frames.size, 1, 'Normal starts one loop');
assert.equal(observed, 1, 'One size observer');
const resources = created.length;
assert.equal(resources, 4, 'Two shaders, program, buffer');
for (let i = 0; i < 10; i++) {
  scene.setReducedMotion(true);
  const pose = uniforms.get('uS');
  assert.equal(frames.size, 0, 'Reduce cancels loop');
  fire('pointermove', { pointerType: 'mouse', clientX: 1400, clientY: 800 });
  fire('scroll');
  assert.equal(uniforms.get('uS'), pose, 'Pointer/scroll leave reduced geometry still');
  assert.equal(frames.size, 0, 'Reduced events cannot restart loop');
  scene.setReducedMotion(false);
  scene.setReducedMotion(false);
  assert.equal(frames.size, 1, 'One loop after restore, including duplicate notification');
  assert.equal(created.length, resources, 'No resources allocated on toggles');
  assert.equal(observed, 1, 'No extra observers');
}
scene.dispose();
assert.equal(frames.size, 0);
assert.equal(observed, 0);
assert.equal(disposed, 1);
assert.deepEqual(new Set(deleted), new Set(created), 'Every renderer allocation released');
assert([...listeners.values()].every(set => set.size === 0), 'Every renderer listener removed');
const stoppedDraws = draws;
fire('scroll'); fire('pointermove');
assert.equal(draws, stoppedDraws, 'Disposed renderer stays stopped');

// Invoke the production React effect and its cleanup, with both MediaQueryList APIs.
for (const legacy of [false, true]) {
  for (const cancelBeforeImport of [false, true]) {
    let cleanup, idle, starts = 0, stops = 0;
    const changes = [], mediaListeners = new Set();
    const media = { matches: false };
    if (legacy) Object.assign(media, { addListener: fn => mediaListeners.add(fn), removeListener: fn => mediaListeners.delete(fn) });
    else Object.assign(media, { addEventListener: (_, fn) => mediaListeners.add(fn), removeEventListener: (_, fn) => mediaListeners.delete(fn) });
    const effectGlobals = { ...globals, navigator: { hardwareConcurrency: 8 }, matchMedia: () => media,
      window: { requestIdleCallback: fn => { idle = fn; return 1; }, cancelIdleCallback() {} } };
    const imports = { react: { useRef: () => ({ current: canvas }), useEffect: fn => { cleanup = fn(); } },
      'react/jsx-runtime': { jsx: () => ({}), jsxs: () => ({}) }, './home.module.css': {},
      './scene': { startScene: (_, options) => { starts++; changes.push(options.reduced); return { dispose: () => stops++, setReducedMotion: reduced => changes.push(reduced) }; } } };
    const { MasterScene } = load(resolve('components/master/MasterScene.tsx'), effectGlobals, imports);
    MasterScene({ fallback: null });
    assert.equal(mediaListeners.size, 1, 'Exactly one preference subscription');
    // Preference changes while the lazy import is pending must be used at renderer startup.
    idle(); media.matches = true;
    if (cancelBeforeImport) cleanup();
    await new Promise(done => setImmediate(done));
    if (cancelBeforeImport) assert.equal(starts, 0, 'No renderer after early unmount');
    else {
      assert.deepEqual(changes, [true]);
      for (const value of [false, true, false, true]) { media.matches = value; for (const fn of mediaListeners) fn(); }
      assert.deepEqual(changes, [true, false, true, false, true], 'Actual changes reach renderer');
      assert.equal(starts, 1, 'Effect never restarts renderer');
      cleanup(); assert.equal(stops, 1, 'Unmount disposes renderer once');
    }
    assert.equal(mediaListeners.size, 0, 'Unmount removes modern/legacy subscription');
    assert([...listeners.values()].every(set => set.size === 0), 'Component canvas listener removed');
  }
}
console.log('PASS renderer: 10 toggles, one loop/context/observer, still reduced events, full disposal');
console.log('PASS component: modern/legacy query changes, pending import, early and ready unmount');

invalidChapter = true;
assert.equal(startScene(canvas, { reduced: false }), null, 'Invalid startup geometry falls back');
assert.equal(observed, 0); assert.equal(frames.size, 0);
assert.deepEqual(new Set(deleted), new Set(created), 'Invalid startup releases every renderer allocation');
assert([...listeners.values()].every(set => set.size === 0));
invalidChapter = false;
const invalidated = startScene(canvas, { reduced: false });
let fallback = 0;
add('gs-scene-lost', () => fallback++);
invalidChapter = true; resizeCallback();
assert.equal(fallback, 1, 'Invalid resize invokes owned fallback');
assert.equal(observed, 0); assert.equal(frames.size, 0);
assert.deepEqual(new Set(deleted), new Set(created), 'Invalid resize releases every renderer allocation');
const stopped = draws; fire('scroll'); assert.equal(draws, stopped);
const cleanupCounts = [deleted.length, disposed, observed];
invalidated.dispose();
assert.deepEqual([deleted.length, disposed, observed], cleanupCounts, 'Repeated disposal does not repeat deletes, context loss or observer cleanup');
assert.deepEqual(new Set(deleted), new Set(created), 'Owner fallback cleanup is idempotent');
listeners.delete('gs-scene-lost');
assert([...listeners.values()].every(set => set.size === 0));
console.log('PASS invalid geometry: startup/resize fallback, complete resource cleanup and idempotent owner disposal');
