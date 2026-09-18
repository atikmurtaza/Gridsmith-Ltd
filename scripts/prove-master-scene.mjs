#!/usr/bin/env node
/**
 * prove-master-scene — the deliberate-failure proof for `check:master:scene`. `GS-R001-M`.
 *
 * Committed rather than run once and discarded (`CLAUDE.md`: proof artefacts are never deleted).
 * Each probe mutates one **built** artefact the served page is made from — the prerendered
 * `/` HTML, the scene chunk, or the page chunk — runs the gate, records which question fired,
 * and restores the file from bytes captured before the mutation, asserting SHA-256 identity.
 * Mutating the build rather than the source is what makes eight probes affordable, and it is
 * the served page the gate reads either way.
 *
 * A probe passes only if the gate goes red **on the question it targets**. A red on some other
 * question is reported as a failed proof: a red build is not a red gate.
 *
 * Owns `.next/` for the duration. Nothing else may read or write it while this runs.
 * Usage: npm run build && node scripts/prove-master-scene.mjs
 */
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const find = (dir, needle) =>
  readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.js'))
    .map((e) => join(e.parentPath, e.name))
    .find((f) => readFileSync(f, 'utf8').includes(needle));

const HTML = '.next/server/app/index.html';
const SCENE = find('.next/static/chunks', 'Capped cylinder, after Inigo Quilez');
const PAGE = readdirSync('.next/static/chunks/app/(marketing)')
  .filter((f) => f.startsWith('page-'))
  .map((f) => join('.next/static/chunks/app/(marketing)', f))[0];
const style = (css) => (s) => s.replace('</head>', `<style>${css}</style></head>`);

const PROBES = [
  { q: 1, file: HTML, what: 'aria-hidden removed from the layer', edit: (s) => s.replace('aria-hidden="true" data-master-scene', 'data-master-scene') },
  { q: 2, file: SCENE, what: 'shader made uncompilable', edit: (s) => s.replace('gl_FragColor', 'gl_FragColour') },
  { q: 3, file: HTML, what: 'canvas hidden', edit: style('[data-master-scene] canvas{visibility:hidden!important}') },
  { q: 4, file: SCENE, what: 'scroll no longer drives the pose', edit: (s) => s.replace('addEventListener("scroll"', 'addEventListener("scrollx"') },
  { q: '4 reduced', file: PAGE, what: 'reduced-motion query ignored', edit: (s) => s.replace('prefers-reduced-motion: reduce', 'prefers-reduced-motion: no-such') },
  { q: 5, file: HTML, what: 'hero heading moved over the mark', edit: style('main h1{transform:translateX(52vw)}') },
  { q: 6, file: HTML, what: '3000px-wide, 20px-tall probe in main', edit: style('main::after{content:"";display:block;width:3000px;height:20px}') },
  { q: 7, file: HTML, what: 'fallback logo removed', edit: style('[data-master-scene]>div{background:none!important}') },
  { q: 8, file: PAGE, what: 'software WebGL accepted for every visitor', edit: (s) => s.replace('get("scene")', 'get("scene")||"software"') },
];

const sha = (b) => createHash('sha256').update(b).digest('hex');
const results = [];
const ONLY = process.env.PROBE ? String(process.env.PROBE) : null;
for (const p of PROBES.filter((x) => !ONLY || String(x.q) === ONLY)) {
  const before = readFileSync(p.file);
  const mutated = p.edit(before.toString('utf8'));
  if (mutated === before.toString('utf8')) {
    results.push(`INERT  q${p.q}: ${p.what} — the edit matched nothing in ${p.file}; not a subject`);
    continue;
  }
  writeFileSync(p.file, mutated);
  // `with-server` refuses to start while the previous probe's server still holds the port —
  // correctly — and exits without running the gate. The first full run read that refusal as
  // "the gate stayed green" and reported question 3 MISSED; run alone, the same probe drove
  // the gold share to 0.00% and fired question 3 thirty times. So a refusal is retried, and a
  // run that never reached the gate is reported as NOT RUN, never as a gate result. The window
  // is 150s: after the shader probe the port stayed held for longer than 30s on Windows.
  let out = '';
  try {
    for (let attempt = 0; attempt < 30; attempt++) {
      try {
        out = execSync('node scripts/with-server.mjs "node scripts/check-master-scene.mjs"', { encoding: 'utf8', stdio: 'pipe' });
      } catch (e) {
        out = `${e.stdout ?? ''}${e.stderr ?? ''}`;
      }
      if (!out.includes('something is already listening')) break;
      execSync(process.platform === 'win32' ? 'ping -n 6 127.0.0.1 >NUL' : 'sleep 5');
    }
  } finally {
    writeFileSync(p.file, before);
  }
  if (sha(readFileSync(p.file)) !== sha(before)) throw new Error(`${p.file} was not restored byte-identical`);
  if (!out.includes('check-master-scene:')) {
    results.push(`NOT RUN q${p.q}: ${p.what} — the gate never executed; this is not a reading. Received: ${out.trim().split('\n').filter((l) => !l.trim().startsWith('at ')).slice(-8).join(' | ').slice(0, 900)}`);
    continue;
  }
  // Only the problem list counts. The gate's summary rows start with viewport widths
  // (`  2560x1440 …`, `  768x1024 …`), and the first version of this parser read their leading
  // digit as a question number — crediting 1, 2, 3 and 7 with reds they had not produced.
  const list = out.includes('problem(s)') ? out.slice(out.indexOf('problem(s)')).split('\n').slice(1) : [];
  const lines = list.map((l) => l.match(/^ {2}(\d)( reduced)?[ :]/)).filter(Boolean);
  const fired = [...new Set(lines.map((m) => m[1] + (m[2] ?? '')))];
  const target = String(p.q);
  const ok = fired.includes(target);
  const firstLine = list.find((l) => l.startsWith(`  ${target}${target.includes('reduced') ? ':' : ' '}`) || l.startsWith(`  ${target}:`))?.trim() ?? '(none)';
  results.push(`${ok ? 'RED   ' : 'MISSED'} q${target}: ${p.what} — fired ${fired.join(', ') || 'nothing'}; e.g. ${firstLine.slice(0, 150)}`);
}
console.log(results.join('\n'));
if (results.some((r) => !r.startsWith('RED'))) process.exit(1);
console.log(`\nprove-master-scene: ${results.length} of ${results.length} probe(s) went red on their own question; every subject restored byte-identical`);
