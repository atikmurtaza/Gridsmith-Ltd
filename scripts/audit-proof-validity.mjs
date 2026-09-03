#!/usr/bin/env node
/**
 * audit-proof-validity
 *
 * **Audits the committed deliberate-failure proofs against the probe-validity rule**
 * (`CLAUDE.md`: *"A probe that produces no red is not evidence about the gate until the probe
 * is shown to be a subject the gate could have caught."*).
 *
 * It classifies each recorded proof by the reading its record actually took:
 *
 *   red            the gate fired and named the injection. The red IS the validity proof —
 *                  the injection reached the predicate. Sound with no further evidence.
 *   green + est.   the run produced no red from the assertion under test, AND the record
 *                  establishes the probe was a subject anyway — from a property of the probe,
 *                  not from the gate's silence. Sound, and usually a finding about the gate.
 *   green + unest. the run produced no red and nothing establishes the probe was a subject.
 *                  UNSOUND: the two readings (broken gate / inert probe) were never separated.
 *   declared       the record says the branch is unproven and does not claim it. Not a proof;
 *                  counted separately, never as sound and never as unsound.
 *
 * **This is a gate over a hand-maintained record and the limit is the standing one**
 * (`CLAUDE.md`: *"A gate over a hand-maintained record asserts that a plausible claim exists,
 * never that the work happened"*). REGISTER is transcribed from the committed prose named in
 * each row's `source`. It asserts the classification is consistent, not that the transcription
 * is complete. Adding a row is how the audit grows; nothing derives it.
 *
 * **The count is provable to report zero, and from the loop rather than from the subject.**
 * `--control` runs the identical loop over CONTROL — same rows, every `unestablished` promoted
 * to `established` — and prints a non-zero audited count with zero unsound. `--selfcheck`
 * asserts both directions: the real register reports > 0 unsound and the control reports 0,
 * over the same number of rows. A register emptied to reach zero fails `--selfcheck` on the
 * audited count.
 */

/** @typedef {{id:string,gate:string,source:string,probe:string,outcome:'red'|'green'|'declared',validity:'self-evident'|'established'|'unestablished',note:string}} Proof */

/** @type {Proof[]} */
const REGISTER = [
  // ---- 01-VALIDATION-REPORT.md §14, the ten-row table ----
  { id: 'V14-1', gate: 'lint:colors', source: 'VALIDATION §14', outcome: 'red', validity: 'self-evident',
    probe: '`border: 1px solid red` plus five other value-position shapes',
    note: '8 violations, exit 1. Each shape named.' },
  { id: 'V14-1b', gate: 'lint:colors', source: 'VALIDATION §14', outcome: 'green', validity: 'established',
    probe: '`.gold { }` as a selector, expected NOT to be flagged',
    note: 'Absence read as "no false positive". Valid: the same file in the same run produced 8 violations, so the sweep demonstrably reached it.' },
  { id: 'V14-2', gate: 'check:tokens', source: 'VALIDATION §14', outcome: 'red', validity: 'self-evident',
    probe: 'deleted --text-3xl and --shadow-2 from tokens.css', note: 'Named both, exit 1.' },
  { id: 'V14-3', gate: 'check:tokens', source: 'VALIDATION §14', outcome: 'red', validity: 'self-evident',
    probe: 'transition: opacity 450ms ease in styles/themes/press.css', note: 'Flagged, exit 1.' },
  { id: 'V14-4', gate: 'check:contrast', source: 'VALIDATION §14', outcome: 'red', validity: 'self-evident',
    probe: 'removed one PAIRS row and one USE token', note: 'Both counts named, exit 1.' },
  { id: 'V14-5', gate: 'check:axe (initial state)', source: 'VALIDATION §14', outcome: 'red', validity: 'self-evident',
    probe: 'aria-hidden={!visible} on StickyCta with links focusable', note: 'aria-hidden-focus at 375/1280 initial.' },
  { id: 'V14-6', gate: 'check:axe (375px)', source: 'VALIDATION §14', outcome: 'red', validity: 'self-evident',
    probe: 'a contrast failure inside @media (max-width: 767px)', note: 'color-contrast at 375px only.' },
  { id: 'V14-7', gate: 'check:axe (route list)', source: 'VALIDATION §14', outcome: 'red', validity: 'self-evident',
    probe: 'no injection — added /_not-found to ROUTES', note: '4 violations x 4; found a live Level A defect.' },
  { id: 'V14-8', gate: 'check:responsive (reserve)', source: 'VALIDATION §14', outcome: 'red', validity: 'self-evident',
    probe: 'restored the modelled scroll-padding calc()', note: '95px bar vs 68px padding, the hand-found discrepancy.' },
  { id: 'V14-9', gate: 'check:node', source: 'VALIDATION §14', outcome: 'red', validity: 'self-evident',
    probe: "ci.yml node-version: '22'", note: 'three-way disagreement, exit 1.' },
  { id: 'V14-10', gate: 'size (floor)', source: 'VALIDATION §14', outcome: 'red', validity: 'self-evident',
    probe: 'no injection — root not-found.tsx importing the Link primitive', note: '100.2 -> 104.5KB every route, exit 1.' },

  // ---- 09-A-GATE-RUN-4.md, the G-items ----
  { id: 'G1', gate: 'check:contrast drift + matrix', source: 'A-GATE run 4', outcome: 'red', validity: 'self-evident',
    probe: 'reverted --ink-subtle in four themes', note: 'Fires on revert; credited to the matrix, not the size pass.' },
  { id: 'G2a', gate: 'check:headings', source: 'A-GATE run 4', outcome: 'red', validity: 'self-evident',
    probe: 'reverted Stepper to a display-face <p>', note: 'Fires on revert.' },
  { id: 'G2b', gate: '(none — Specimen)', source: 'A-GATE run 4', outcome: 'declared', validity: 'unestablished',
    probe: 'n/a', note: "Ungated by design: Specimen's heading is mono and check:headings is display-face only. Declared, not claimed." },
  { id: 'G3', gate: 'check:axe .cardLinked', source: 'A-GATE run 4', outcome: 'red', validity: 'self-evident',
    probe: 'permanent linked-card specimen + broken selector, scrolled into view',
    note: 'The scroll-into-view is this rule applied: without it the specimen sat below a hit-tested fold and the gate reported clean (A11Y-32).' },
  { id: 'G4', gate: 'check:axe incomplete allowlist', source: 'A-GATE run 4', outcome: 'red', validity: 'self-evident',
    probe: 'a new incomplete not on the allowlist', note: 'Allowlist proven unable to swallow it.' },
  { id: 'G5', gate: 'check:axe global-error probe', source: 'A-GATE run 4', outcome: 'red', validity: 'self-evident',
    probe: "neutered the probe route's throw", note: 'Hollow-subject assertion fires; probe committed, non-_-prefixed.' },
  { id: 'G6a', gate: 'check:content', source: 'A-GATE run 4', outcome: 'green', validity: 'established',
    probe: 'three invented-content inputs that should fail it',
    note: "Absence read correctly as gate weakness, not as a pass. Validity established from the inputs' own form — each is invented money/codes by construction." },
  { id: 'G6b', gate: 'ESLint override', source: 'A-GATE run 4', outcome: 'red', validity: 'self-evident',
    probe: 'removed the inline disable', note: 'Override now load-bearing.' },
  { id: 'G8', gate: 'check-bundle-size shared-baseline', source: 'A-GATE run 4 / A-GATE-4-3', outcome: 'green', validity: 'unestablished',
    probe: 'imported Tabs into global-error, shared 0.5 -> 1.6KB',
    note: 'UNREACHABLE probe. The floor check has an arithmetically identical predicate and exits ~70 lines earlier; the decomposition block never printed. Recorded as A-GATE-4-3. Superseded by G8-2.' },
  { id: 'G8-2', gate: 'check-bundle-size shared-baseline', source: 'components/consent/bundle-size-probe.ts', outcome: 'red', validity: 'self-evident',
    probe: '740 bytes of random hex in the shared layout client boundary, NEXT_PUBLIC_BUNDLE_SIZE_PROBE=1',
    note: 'shared 1.9 -> 2.9KB, inside the 2.8 < shared <= 3.0 window R1 opened. ONE decomposition problem, and it is this branch: the floor check exits before the block prints, so a run that prints the message is a run in which the floor check did not fire. Off, shared measures 1.9KB — identical to the pre-probe build. The sound replacement for G8.' },
  { id: 'A-GATE-4-1', gate: 'check:contrast size pass', source: 'A-GATE run 4', outcome: 'green', validity: 'established',
    probe: 'TEST A: --accent-design at --text-xs, 1.96:1',
    note: 'EXIT=0, count unchanged. Validity established independently — the ratio was computed at 1.96:1, so the probe is a real failure the pass claims to catch. Correctly read as the pass having no independent power.' },

  // ---- master/PROJECT-TRACKER.md ----
  { id: 'SKIP-1', gate: 'check-axe domIntegrity', source: 'master tracker (skip link)', outcome: 'red', validity: 'self-evident',
    probe: 'deleted id="main" from /design', note: "Fired, but NOT isolated — axe's skip-link rule fired too. Recorded as overlap, not credited." },
  { id: 'SKIP-2', gate: 'check-axe domIntegrity', source: 'master tracker (skip link)', outcome: 'red', validity: 'self-evident',
    probe: 'a <button> inserted before the link in RootShell', note: 'This assertion only; axe clean. Isolated.' },
  { id: 'SKIP-3', gate: 'check-axe domIntegrity', source: 'master tracker (skip link)', outcome: 'red', validity: 'self-evident',
    probe: 'restored transition: transform 150ms on the skip link', note: 'Found a real live defect: focus landed while translated out of view.' },
  { id: 'SKIP-4', gate: 'check-axe domIntegrity', source: 'master tracker (skip link)', outcome: 'declared', validity: 'unestablished',
    probe: 'none — "link cannot take focus"', note: 'Declared unproven: no cheap subject produces it without tripping another row. Recorded, not claimed.' },
  { id: 'SEED-1', gate: 'seed-content dot-id guard', source: 'master tracker (S-01)', outcome: 'red', validity: 'self-evident',
    probe: 'reintroduced seed.post.…', note: '"9 document id(s) contain a dot".' },
  { id: 'SEED-2', gate: 'seed-content unauthenticated readback', source: 'master tracker (S-01)', outcome: 'red', validity: 'self-evident',
    probe: 'added a non-existent id to the expected set', note: 'Count named. Independently pre-verified with probeplain vs probe.seed.check.' },
  { id: 'CONSENT', gate: 'consent-removal branches', source: 'master tracker / REVISION-LOG r10 §6', outcome: 'red', validity: 'self-evident',
    probe: 'eight branches, each alone, .next removed and rebuilt each time', note: 'Eight distinct messages recorded.' },

  // ---- 7c069b0d, the footer legal-link gate ----
  { id: 'FOOT-1', gate: 'check-axe footer legal links', source: '7c069b0d', outcome: 'red', validity: 'self-evident',
    probe: 'dropped cookies from LEGAL_FOOTER_SLUGS', note: '"not linked from 13 of 14 route(s)" — 13 is the honest count.' },
  { id: 'FOOT-2', gate: 'check-axe footer legal links', source: '7c069b0d', outcome: 'red', validity: 'self-evident',
    probe: 'suppressed Footer for division digital only', note: '"1 of 14 route(s): /digital", three slugs.' },
  { id: 'FOOT-3', gate: 'check-axe FOOTER_EXEMPT hollow-subject', source: '7c069b0d', outcome: 'red', validity: 'self-evident',
    probe: 'pointed FOOTER_EXEMPT at /about, which does carry the footer', note: 'Fires on three paths. Count moves in both directions.' },

  // ---- ba6f6a36, V-06 ----
  { id: 'V06-AXE', gate: 'check-axe', source: 'ba6f6a36 / V-06', outcome: 'red', validity: 'self-evident',
    probe: 'h1 -> h3 on /digital/estimate', note: 'page-has-heading-one at the route by name.' },
  { id: 'V06-OVF-1', gate: 'check-responsive overflow', source: 'ba6f6a36 / V-06', outcome: 'green', validity: 'unestablished',
    probe: 'a 3000x0px div on /digital/estimate',
    note: 'THE EXEMPLAR. A zero-height box contributes no scrollable overflow, so the probe was inert and the green was indistinguishable from a broken gate. Superseded by V06-OVF-2.' },
  { id: 'V06-OVF-2', gate: 'check-responsive overflow', source: 'ba6f6a36 / V-06', outcome: 'red', validity: 'self-evident',
    probe: 'a 3000x20px div on /digital/estimate', note: 'Overflow line at all three widths. The sound replacement for V06-OVF-1.' },

  // ---- gates whose proof artefact is committed and structural ----
  { id: 'PARITY', gate: 'check:legal:parity', source: 'check-legal-parity.selftest.mjs', outcome: 'red', validity: 'self-evident',
    probe: "per-branch specimens asserting each rule function's return value",
    note: 'Structurally immune to this class: the reading is a value, not an absence.' },
  { id: 'LAUNCH', gate: 'check:launch', source: 'check-launch-content.selftest.mjs', outcome: 'red', validity: 'self-evident',
    probe: "per-branch specimens asserting each rule function's return value", note: 'Same shape as PARITY.' },
  { id: 'VAT', gate: 'check:vat-display', source: 'handover, 2 Sep box', outcome: 'red', validity: 'self-evident',
    probe: '13 committed specimens, predicate proven before it fetches anything', note: 'Self-proving predicate.' },
  { id: 'MARK-CLS', gate: 'check:mark:cls', source: 'check-mark-cls.mjs:61', outcome: 'red', validity: 'self-evident',
    probe: 'MARK_CLS_PROBE=1 inserts a block at the top of the document, on demand', note: 'Permanent, re-runnable, in-file probe.' },
  { id: 'MARK-OVL', gate: 'check:mark:overlap', source: 'check-mark-overlap.mjs:5', outcome: 'declared', validity: 'unestablished',
    probe: 'none standing', note: 'Declares it has no standing subject and says so deliberately. Not claimed as proven.' },

  // ---- known-defective proofs already recorded in CLAUDE.md ----
  { id: 'RLS-SELECT', gate: 'check:rls anon SELECT branch', source: 'CLAUDE.md / check-rls.mjs:82', outcome: 'green', validity: 'unestablished',
    probe: 'to anon using (true) — twice',
    note: 'Twice inert: an unbounded role capture read the role as "anon using"; the fix used a literal U+0008 for \\b. Both greens were read as passes while the DELETE branch fired correctly. Since fixed and re-proven per branch, but the two original proofs were unsound.' },
  { id: 'SCHEMAS-CL', gate: 'check:schemas CLOSED_LISTS', source: 'CLAUDE.md', outcome: 'green', validity: 'unestablished',
    probe: 'none — the summary line was taken as the evidence',
    note: 'The check declared CLOSED_LISTS, printed "2 closed list(s) intact and enforced", and contained no loop. There was no probe at all; the absence of red was the whole reading.' },
  { id: 'A11Y-29', gate: 'check:contrast size pass', source: 'CLAUDE.md / A11Y-29', outcome: 'green', validity: 'unestablished',
    probe: 'a subject inside the already-passing set',
    note: 'Shipped green with the predicate narrowed to the set that already passed. No input could reach the assertion — the unreachable form.' },
  { id: 'A11Y-32', gate: 'check-axe linked-card', source: 'CLAUDE.md / A11Y-32', outcome: 'green', validity: 'unestablished',
    probe: 'a deliberately broken selector, subject below the fold',
    note: 'elementFromPoint hit-tests the viewport; the subject was out of scope for the probe. Reported clean. The out-of-scope form.' },
];

/** CONTROL: the identical rows with every `unestablished` promoted. Same length, by construction. */
const CONTROL = REGISTER.map((p) => ({ ...p, validity: p.validity === 'unestablished' ? 'established' : p.validity }));

/**
 * The loop. It never reads REGISTER — it is passed its subject, which is what lets --control
 * exercise the same predicate over a different one and makes a zero attributable to the loop.
 */
function audit(rows) {
  let audited = 0;
  let sound = 0;
  let unsound = 0;
  const declared = [];
  const unsoundRows = [];
  for (const p of rows) {
    if (p.outcome === 'declared') { declared.push(p); continue; }
    audited += 1;
    // A red result carries its own validity proof. A green needs the probe shown to be a subject.
    const ok = p.outcome === 'red' || p.validity === 'established';
    if (ok) sound += 1; else { unsound += 1; unsoundRows.push(p); }
  }
  return { audited, sound, unsound, declared, unsoundRows };
}

const mode = process.argv[2] ?? '';

if (mode === '--selfcheck') {
  const real = audit(REGISTER);
  const ctl = audit(CONTROL);
  const problems = [];
  if (real.audited === 0) problems.push('the register is empty — zero unsound would be vacuous');
  if (ctl.audited !== real.audited) problems.push('control audited a different number of rows');
  if (real.unsound === 0) problems.push('the register reports no unsound proofs — the predicate cannot be shown to fire');
  if (ctl.unsound !== 0) problems.push('the control reports unsound rows — the predicate cannot be shown to report zero');
  if (problems.length) {
    console.error('audit-proof-validity selfcheck FAILED:\n  ' + problems.join('\n  '));
    process.exit(1);
  }
  console.log(`audit-proof-validity selfcheck: ${real.audited} rows audited both ways; register ${real.unsound} unsound, control 0 unsound.`);
  console.log("The zero is produced by the loop's predicate over a non-empty subject, not by an empty subject.");
  process.exit(0);
}

const rows = mode === '--control' ? CONTROL : REGISTER;
const r = audit(rows);
console.log(`audit-proof-validity${mode === '--control' ? ' [CONTROL]' : ''}`);
console.log(`  proofs audited:  ${r.audited}`);
console.log(`  sound:           ${r.sound}`);
console.log(`  UNSOUND:         ${r.unsound}`);
console.log(`  declared unproven (not counted either way): ${r.declared.length}  [${r.declared.map((d) => d.id).join(', ') || '—'}]`);
if (r.unsoundRows.length) {
  console.log('\nUnsound — a green reading with nothing establishing the probe was a subject:');
  for (const p of r.unsoundRows) console.log(`  ${p.id.padEnd(12)} ${p.gate}\n      probe: ${p.probe}\n      ${p.note}`);
}
process.exit(0);
