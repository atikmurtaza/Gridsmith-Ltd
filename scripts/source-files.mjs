#!/usr/bin/env node
/**
 * The subject list that check-no-hardcoded-colors and check-service-role-key both scan.
 *
 * Both gates used to carry their own `ROOTS` array plus a `PENDING_ROOTS` map naming
 * `lib` — one declared-but-absent tree — and the docstring on the first claimed "a new
 * tree cannot arrive unscanned". That was false. Only `lib` could not arrive unscanned.
 * `public/`, `lighthouse/` and every root-level source file — `next.config.ts`,
 * `eslint.config.mjs`, `lighthouserc.*.cjs`, `css.d.ts` — were outside both sweeps and
 * nothing would have said so. The authors had identified the class and then guarded one
 * instance of it, which is the exact failure CLAUDE.md "fix the class, not the instance"
 * describes.
 *
 * So the guard is inverted. Instead of naming the trees we expect to appear, this
 * enumerates what is actually on disk and requires every top-level directory to be
 * either scanned or explicitly excluded with a reason. A tree nobody anticipated — `lib`,
 * `public`, `sanity`, `supabase`, anything — fails the build on the commit that creates
 * it. A list of anticipated names can only ever guard the failures somebody thought of.
 *
 * Root-level files are enumerated rather than listed for the same reason: a new config
 * file at the repository root arrives scanned, without anyone remembering to add it.
 */
import { readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, posix, sep } from 'node:path';

/** Trees that are scanned. */
export const ROOTS = ['app', 'components', 'lib', 'lighthouse', 'sanity', 'scripts', 'styles'];

/**
 * Trees that are deliberately not source, each with the reason. Excluding one is a
 * decision someone wrote down; the alternative is a silent omission, which is the thing
 * this file exists to make impossible.
 */
const NOT_SOURCE = {
  '.claude': 'agent definitions',
  '.git': 'version control',
  '.github': 'workflow YAML — no colours, no keys',
  '.lighthouseci': 'gate output',
  '.next': 'build output — swept separately, by the gates that measure the bundle',
  '.sanity': 'Sanity CLI runtime cache — generated, gitignored, never edited',
  docs: 'the specs. Prose, and their numbers are enforced by check-contrast, not here',
  node_modules: 'dependencies',
  redirects: 'URL mapping data (JSON)',
};

const toPosix = (p) => p.split(sep).join(posix.sep);

/**
 * @param {string} gate  name used in failure messages
 * @param {RegExp} source  which filenames count as source for this gate
 */
export function sourceFiles(gate, source) {
  const top = readdirSync('.', { withFileTypes: true });

  const unclassified = top
    .filter((e) => e.isDirectory() && !ROOTS.includes(e.name) && !(e.name in NOT_SOURCE))
    .map((e) => e.name);

  if (unclassified.length > 0) {
    console.error(`\n${gate}: ${unclassified.length} top-level director(ies) are neither scanned nor excluded:\n`);
    for (const name of unclassified) console.error(`  ${name}/`);
    console.error(
      '\nAdd it to ROOTS in scripts/source-files.mjs, or to NOT_SOURCE with the reason.' +
        '\nA tree that is neither is a tree this gate silently does not cover.\n',
    );
    process.exit(1);
  }

  const out = [];

  // Root-level source files: next.config.ts, eslint.config.mjs, lighthouserc.*.cjs, …
  for (const entry of top) {
    if (entry.isFile() && source.test(entry.name)) out.push(entry.name);
  }

  for (const root of ROOTS) {
    if (!existsSync(root) || !statSync(root).isDirectory()) {
      console.error(`\n${gate}: root "${root}/" does not exist — it was not scanned.`);
      console.error('Remove it from ROOTS deliberately, or fix the path. Skipping it silently is not an option.\n');
      process.exit(1);
    }
    for (const entry of readdirSync(root, { recursive: true, withFileTypes: true })) {
      if (!entry.isFile() || !source.test(entry.name)) continue;
      out.push(toPosix(relative('.', join(entry.parentPath ?? root, entry.name))));
    }
  }

  if (out.length === 0) {
    console.error(`\n${gate}: matched zero files. Nothing was scanned, which is not the same as clean.\n`);
    process.exit(1);
  }

  return out.sort();
}
