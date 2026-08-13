#!/usr/bin/env node
/**
 * check-headings
 *
 * WCAG 1.3.1 Info and Relationships, failure technique F2: text that is presented as a
 * heading must be marked up as one. A screen-reader or keyboard user navigating by
 * heading passes straight over a `<p>` that looks like a title.
 *
 * **This gate exists because the class was fixed per-instance twice.**
 *
 *   Round 4 (13 Aug) — `EmptyState` and `ErrorState` rendered their titles as
 *   `<p className={styles.title}>` in `--font-display` at `--text-lg`. Fixed by adding a
 *   `headingLevel` prop to both. Recorded as A11Y-2, closed.
 *
 *   Run 3 (this session) — the audit found `Specimen` on `/_kitchen-sink` doing exactly
 *   the same thing, 23 times per theme frame, on the one page built to exercise the
 *   primitives. `Stepper` was doing it too and nobody had looked.
 *
 * Two fixes of one class, neither of which left anything behind that could catch the
 * third. CLAUDE.md: *"Fix the class, not the instance"*, and *"a fix is not fixed until a
 * permanent committed subject exists for a gate to reach"*. The fixes are not the
 * deliverable here — this file is.
 *
 * **How a heading-like class is identified.** Not by name — `.title`, `.specimenName` and
 * `.stepTitle` share no naming convention, and a gate keyed on names is a gate that misses
 * the next one someone calls `.label`. It is identified by what the CSS actually does:
 * a rule that sets `font-family: var(--font-display)` is claiming the display face, which
 * in this system is what a heading looks like. That is a property of the design, not of a
 * naming habit, so a new pseudo-heading is caught the moment it is styled like one.
 *
 * axe cannot do this job. F2 is a judgement about intent — "is this text presented as a
 * heading" — and axe only reports `empty-heading` / `heading-order` for elements that
 * already ARE headings. A `<p>` styled like an h3 is invisible to it, which is why every
 * axe run was green across all 24 analyses while three of these were live.
 *
 * **What this gate does NOT catch, stated plainly so nobody reads a green line as
 * coverage it does not have.** A pseudo-heading styled in the *mono* face is invisible
 * here. `/_kitchen-sink`'s `.specimenName` — the third instance, and the one the run-3
 * audit actually found — is mono, uppercase, letter-spaced: visually identical to
 * `Eyebrow`, which is correctly *not* a heading. No static rule separates a section label
 * that should be a heading from one that should not; that is a structural judgement about
 * what the element labels, and the `accessibility-audit` agent is what makes it.
 *
 * So this gate covers the display-face shape completely and the mono shape not at all.
 * It is the half that can be mechanised. Do not widen it to "mono + uppercase" — that
 * flags every `Eyebrow` in the codebase and a gate that cries wolf gets bypassed, which
 * is worse than the gap.
 */
import { readFileSync, globSync } from 'node:fs';
import { basename, relative } from 'node:path';

/** Elements that can never carry a heading role by themselves. `<summary>` is absent
 *  deliberately: it has its own role, and Accordion's use of the display face on a
 *  `<summary>` is a disclosure control, not a pseudo-heading. */
const NON_HEADING_TAGS = ['p', 'span', 'div'];

const SOURCE_GLOBS = ['components/primitives/*.tsx', 'app/**/*.tsx'];
const CSS_GLOBS = ['components/primitives/*.module.css', 'app/**/*.module.css'];

/**
 * Classes whose rule block claims the display face, per stylesheet.
 * Keyed by the stylesheet's basename, which is how the importing .tsx names it.
 */
const headingLike = new Map();
for (const file of CSS_GLOBS.flatMap((g) => globSync(g))) {
  const css = readFileSync(file, 'utf8');
  const classes = new Set();
  for (const block of css.matchAll(/\.([a-zA-Z][\w-]*)\s*\{([^{}]*)\}/g)) {
    if (/font-family:\s*var\(--font-display\)/.test(block[2])) classes.add(block[1]);
  }
  if (classes.size > 0) headingLike.set(basename(file), classes);
}

const problems = [];
let filesScanned = 0;
let classesKnown = [...headingLike.values()].reduce((n, s) => n + s.size, 0);

for (const file of SOURCE_GLOBS.flatMap((g) => globSync(g))) {
  const src = readFileSync(file, 'utf8');

  // Which CSS modules this file imports, and under what local name.
  const imports = [...src.matchAll(/import\s+(\w+)\s+from\s+['"](.+?\.module\.css)['"]/g)];
  if (imports.length === 0) continue;
  filesScanned += 1;

  for (const [alias, spec] of imports.map((m) => [m[1], basename(m[2])])) {
    const classes = headingLike.get(spec);
    if (!classes) continue;

    for (const cls of classes) {
      // `<p className={styles.title}` and `<p className={`${styles.title} …`}` alike.
      const used = new RegExp(
        `<(${NON_HEADING_TAGS.join('|')})\\b[^>]*\\b${alias}\\.${cls}\\b`,
        'g',
      );
      for (const hit of src.matchAll(used)) {
        const line = src.slice(0, hit.index).split(/\r?\n/).length;
        problems.push(
          `${relative(process.cwd(), file)}:${line} — <${hit[1]}> carries .${cls}, which sets ` +
            `font-family: var(--font-display) in ${spec}. Text presented as a heading must be ` +
            `a heading (WCAG 1.3.1, F2).`,
        );
      }
    }
  }
}

/**
 * A gate that measured nothing is not a gate that passed — CLAUDE.md, and six recorded
 * instances of exactly that. Both halves of this gate's subject must exist: stylesheets
 * that claim the display face, and .tsx files that import them.
 */
if (classesKnown === 0) {
  problems.push(
    'no stylesheet declares `font-family: var(--font-display)` on any class. Either the ' +
      'display face moved to a different mechanism — in which case this gate needs ' +
      'rewriting, not deleting — or CSS_GLOBS no longer resolves. Measured nothing.',
  );
}
if (filesScanned === 0) {
  problems.push(
    'no .tsx file imports a CSS module. SOURCE_GLOBS no longer resolves; measured nothing.',
  );
}

if (problems.length > 0) {
  console.error(`\ncheck-headings: ${problems.length} pseudo-heading(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error(
    '\nRender a real heading element. The pattern used by EmptyState, ErrorState and\n' +
      'Stepper is a `headingLevel` prop defaulting to 3, with `2-6` allowed — level and\n' +
      'visual size are separate concerns and `Heading` exists to keep them separate.\n' +
      'If the element genuinely is not a heading, stop giving it the display face.\n',
  );
  process.exit(1);
}

console.log(
  `check-headings: ${classesKnown} display-face class(es) across ${headingLike.size} stylesheet(s), ` +
    `${filesScanned} component(s) scanned — no <${NON_HEADING_TAGS.join('>/<')}> serving as a heading`,
);
