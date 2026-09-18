#!/usr/bin/env node
/**
 * prove-master-scene — the deliberate-failure proof for the Master gates: `check:master:scene`,
 * `check:master:hero` and the review cylinder's questions in `check:reviews:ui`. `GS-R001-M`.
 *
 * Committed rather than run once and discarded (`CLAUDE.md`: proof artefacts are never deleted).
 * Each probe mutates one **built** artefact the served page is made from — the prerendered `/`
 * HTML, the scene chunk, or the page chunk — runs the gate it targets, records which questions
 * fired, and restores the file from bytes captured before the mutation, asserting SHA-256
 * identity. Mutating the build rather than the source is what makes these probes affordable, and
 * it is the served page every one of these gates reads.
 *
 * A probe passes only if its gate goes red **on the question it targets**. A red on another
 * question is a failed proof: a red build is not a red gate.
 *
 * Chunk edits are regular expressions over minified code, so a probe whose pattern no longer
 * matches reports **INERT** — never a pass. A run that never reached its gate reports **NOT RUN**
 * with what it received — never a reading.
 *
 * Owns `.next/` for the duration. Nothing else may read or write it while this runs.
 * Usage: npm run build && node scripts/prove-master-scene.mjs   (PROBE=<id> for one probe)
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
const re = (pattern, to) => (s) => s.replace(pattern, to);

const SCENE_GATE = 'node scripts/check-master-scene.mjs';
const HERO_GATE = 'node scripts/check-master-hero.mjs';
const REVIEWS_GATE = 'node scripts/check-reviews-ui.mjs';

const PROBES = [
  // check:master:scene
  { id: 's1', gate: SCENE_GATE, q: '1', file: HTML, what: 'aria-hidden removed from the layer', edit: (s) => s.replace('aria-hidden="true" data-master-scene', 'data-master-scene') },
  { id: 's2', gate: SCENE_GATE, q: '2', file: SCENE, what: 'shader made uncompilable', edit: (s) => s.replace('gl_FragColor', 'gl_FragColour') },
  { id: 's3', gate: SCENE_GATE, q: '3', file: HTML, what: 'canvas hidden', edit: style('[data-master-scene] canvas{visibility:hidden!important}') },
  { id: 's4', gate: SCENE_GATE, q: '4', file: SCENE, what: 'scroll no longer drives the pose', edit: (s) => s.replace('addEventListener("scroll"', 'addEventListener("scrollx"') },
  { id: 's4r', gate: SCENE_GATE, q: '4 reduced', file: PAGE, what: 'reduced-motion query ignored by the scene', edit: (s) => s.replace('matchMedia("(prefers-reduced-motion: reduce)").matches,allowSoftware', 'matchMedia("(prefers-reduced-motion: no-such)").matches,allowSoftware') },
  // Question 5's first probe moved the headline over the mark. Since R1 the renderer dims the scene
  // behind text wherever the text is, so that probe stopped being a subject — the class it tested
  // for was fixed. The valid probe now switches the dimming off: copy over the exploded pieces.
  { id: 's5', gate: SCENE_GATE, q: '5', file: SCENE, what: 'text dimming switched off (copy over the exploded pieces)', edit: (s) => s.replace('0.8 * att * cov', '0.0 * att * cov') },
  { id: 's6', gate: SCENE_GATE, q: '6', file: HTML, what: '3000px-wide, 20px-tall probe in main', edit: style('main::after{content:"";display:block;width:3000px;height:20px}') },
  { id: 's7', gate: SCENE_GATE, q: '7', file: HTML, what: 'fallback mark hidden', edit: style('[data-master-scene]>div{visibility:hidden!important}') },
  { id: 's8', gate: SCENE_GATE, q: '8', file: PAGE, what: 'software WebGL accepted for every visitor', edit: (s) => s.replace('get("scene")', 'get("scene")||"software"') },
  { id: 's9', gate: SCENE_GATE, q: '9', file: HTML, what: 'fallback turned back into a background image', edit: style('[data-master-scene]>div{background:url(/brand/gridsmith-logo.svg) no-repeat center/contain}[data-master-scene]>div svg{visibility:hidden}') },
  // R1 — what the owner reported.
  { id: 's10', gate: SCENE_GATE, q: '10', file: HTML, what: 'opaque full-width bands behind every section (the mobile veil, at full strength)', edit: style('main section>div{background:var(--canvas)!important}') },
  { id: 's11', gate: SCENE_GATE, q: '11', file: SCENE, what: 'the exploded formation collapsed back to the assembled scale', edit: re(/exploded:(\w+)\(2\.9,2\)/, 'exploded:$1(1,1)') },
  // check:master:hero — one probe per question.
  { id: 'h1', gate: HERO_GATE, q: '1', file: HTML, what: '3000px-wide, 20px-tall probe in the hero', edit: style('[data-chapter=hero]::after{content:"";display:block;width:3000px;height:20px}') },
  { id: 'h2', gate: HERO_GATE, q: '2', file: HTML, what: 'headline forced onto one unbroken line', edit: style('#hero-title{white-space:nowrap}') },
  { id: 'h3', gate: HERO_GATE, q: '3', file: HTML, what: 'headline pinned to a fixed large size (the pre-R1 six-line wrap)', edit: style('#hero-title{font-size:9rem!important}') },
  { id: 'h4', gate: HERO_GATE, q: '4', file: HTML, what: 'CTA pushed below the first screen', edit: style('#hero-title{margin-bottom:100vh!important}') },
  { id: 'h5', gate: HERO_GATE, q: '5', file: HTML, what: 'copy column pinned to the pre-R1 fixed 665px, centred in the frame', edit: style('[data-chapter=hero] div:has(>#hero-title){inline-size:665px!important;margin-inline:auto!important}') },
  { id: 'h6', gate: HERO_GATE, q: '6', file: HTML, what: 'mark hidden', edit: style('[data-master-scene]{visibility:hidden!important}') },
  // check:reviews:ui — the cylinder.
  { id: 'r3a', gate: REVIEWS_GATE, q: '3', file: PAGE, what: 'the cylinder no longer turns on its own', edit: re(/\},6e3\)/, '},6e8)') },
  { id: 'r3b', gate: REVIEWS_GATE, q: '3', file: PAGE, what: 'Pause rotation no longer pauses', edit: re(/if\((\w)\|\|(\w)\|\|(\w)\.matches\|\|(\w)<2\)return/, 'if($2||$3.matches||$4<2)return') },
  { id: 'r4a', gate: REVIEWS_GATE, q: '4', file: PAGE, what: 'Next no longer advances', edit: re(/onClick:\(\)=>(\w)\((\w)=>\2\+1\)/, 'onClick:()=>$1($2=>$2)') },
  { id: 'r4b', gate: REVIEWS_GATE, q: '4', file: HTML, what: 'the front card clipped to a fixed short height', edit: style('li[data-front]{height:8rem!important;min-height:0!important;overflow:hidden!important}') },
  { id: 'r11', gate: REVIEWS_GATE, q: '11', file: HTML, what: 'the cylinder flattened — every card faces the reader', edit: style('li:has(>figure>blockquote){transform:none!important}') },
];

const sha = (b) => createHash('sha256').update(b).digest('hex');
const results = [];
const ONLY = process.env.PROBE ?? null;
for (const p of PROBES.filter((x) => !ONLY || x.id === ONLY)) {
  const before = readFileSync(p.file);
  const mutated = p.edit(before.toString('utf8'));
  if (mutated === before.toString('utf8')) {
    results.push(`INERT   ${p.id} q${p.q}: ${p.what} — the edit matched nothing in ${p.file}; not a subject`);
    continue;
  }
  writeFileSync(p.file, mutated);
  // `with-server` refuses to start while the previous probe's server still holds the port —
  // correctly — and exits without running the gate. The first full run read that refusal as "the
  // gate stayed green"; a refusal is now retried for up to 150s, and a run that never reached its
  // gate is reported as NOT RUN, never as a reading.
  let out = '';
  try {
    for (let attempt = 0; attempt < 30; attempt++) {
      try {
        out = execSync(`node scripts/with-server.mjs "${p.gate}"`, { encoding: 'utf8', stdio: 'pipe' });
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
  const gateName = p.gate.split('/').pop().replace('.mjs', '');
  if (!out.includes(`${gateName}:`)) {
    results.push(`NOT RUN ${p.id} q${p.q}: ${p.what} — the gate never executed; this is not a reading. Received: ${out.trim().split('\n').filter((l) => !l.trim().startsWith('at ')).slice(-6).join(' | ').slice(0, 700)}`);
    continue;
  }
  // Only the problem list counts, and question numbers can be two digits. The gates' summary
  // rows start with viewport widths (`  2560x1440 …`), which the first parser misread as
  // question numbers — crediting reds that had not happened.
  const list = out.includes('problem(s)') ? out.slice(out.indexOf('problem(s)')).split('\n').slice(1) : [];
  const fired = [...new Set(list.map((l) => l.match(/^ {2}(\d+)( reduced)?[ :]/)).filter(Boolean).map((m) => m[1] + (m[2] ?? '')))];
  const ok = fired.includes(p.q);
  const example = list.find((l) => new RegExp(`^ {2}${p.q.replace(' ', ' ')}[ :]`).test(l))?.trim() ?? '(none)';
  results.push(`${ok ? 'RED    ' : 'MISSED '} ${p.id} q${p.q}: ${p.what} — fired ${fired.join(', ') || 'nothing'}; e.g. ${example.slice(0, 160)}`);
}
console.log(results.join('\n'));
if (results.some((r) => !r.startsWith('RED'))) process.exit(1);
console.log(`\nprove-master-scene: ${results.length} of ${results.length} probe(s) went red on their own question; every subject restored byte-identical`);
