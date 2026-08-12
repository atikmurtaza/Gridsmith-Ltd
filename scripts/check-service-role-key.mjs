#!/usr/bin/env node
/**
 * check-service-role-key
 *
 * design/PROJECT-RULES.md §1.6 — the Supabase service-role key must never reach the
 * client. It bypasses row-level security, so a single leak exposes every lead in the
 * database.
 *
 * Three checks: the key must not appear in a client component, it must never be given a
 * NEXT_PUBLIC_ prefix anywhere (which would inline it into the bundle), and — the one
 * that actually matters — the string must not be present in the built client chunks.
 *
 * **A leak is a property of the bundle, not a shape in the source.** The first two checks
 * inspect source and can both be true while the key ships:
 *
 *  - The directive check fires only when the file itself opens with `'use client'`. A
 *    plain module imported by a client component is compiled into the client bundle and
 *    carries whatever it referenced. No directive, no flag.
 *  - `next.config.ts` was outside the scanned trees entirely, and Next's `env:` key
 *    inlines any variable it names into *every* client bundle.
 *
 * So the sweep of `.next/static/chunks` is the load-bearing one, and it is not optional:
 * a missing build directory is a hard failure here, not a skip. check-theme-flash already
 * proved this technique in this repository and calls it "the load-bearing one" for the
 * same reason. Because it needs a build, this gate runs in `verify:build` rather than
 * `verify:static`.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { sourceFiles } from './source-files.mjs';

const SOURCE = /\.(?:ts|tsx|js|jsx|mjs|cjs)$/;
const KEY = ['SUPABASE', 'SERVICE', 'ROLE', 'KEY'].join('_');
const PUBLIC_PREFIXED = /NEXT_PUBLIC_[A-Z0-9_]*SERVICE_ROLE[A-Z0-9_]*/g;
const CHUNK_DIR = '.next/static/chunks';

/** True if the file opens with a 'use client' directive, ignoring comments and blanks. */
function isClientComponent(source) {
  for (const raw of source.split(/\r?\n/)) {
    const line = raw.trim();
    if (line === '' || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
      continue;
    }
    return /^['"]use client['"]\s*;?$/.test(line);
  }
  return false;
}

const violations = [];
const files = sourceFiles('check-service-role-key', SOURCE);

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  // A Next config that names the key is a leak with no directive anywhere: `env:` inlines
  // it into every client bundle.
  const clientReachable = isClientComponent(source) || /^next\.config\./.test(file);

  source.split(/\r?\n/).forEach((line, i) => {
    if (clientReachable && line.includes(KEY)) {
      violations.push({
        file,
        line: i + 1,
        why: `${KEY} referenced in a file that compiles into the client bundle`,
      });
    }
    PUBLIC_PREFIXED.lastIndex = 0;
    let m;
    while ((m = PUBLIC_PREFIXED.exec(line)) !== null) {
      violations.push({ file, line: i + 1, why: `${m[0]} — NEXT_PUBLIC_ inlines this into the bundle` });
    }
  });
}

/**
 * The bundle sweep. Whatever the source looks like, this is what shipped.
 * Not wrapped in `existsSync` — a check that can skip its subject silently is worse than
 * no check, and this is the only one of the three that measures the actual risk.
 */
let chunks = 0;
if (!existsSync(CHUNK_DIR)) {
  console.error(`\ncheck-service-role-key: ${CHUNK_DIR} does not exist — the client bundle was not swept.`);
  console.error('Run `npm run build` first. This gate runs in verify:build, after the build, for that reason.\n');
  process.exit(1);
}
for (const entry of readdirSync(CHUNK_DIR, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.js')) continue;
  chunks += 1;
  if (readFileSync(join(entry.parentPath ?? CHUNK_DIR, entry.name), 'utf8').includes(KEY)) {
    violations.push({ file: `${CHUNK_DIR}/${entry.name}`, line: 0, why: `${KEY} is present in a client chunk — it shipped` });
  }
}
if (chunks === 0) {
  console.error(`\ncheck-service-role-key: ${CHUNK_DIR} contains no .js files — nothing was swept.\n`);
  process.exit(1);
}

if (violations.length === 0) {
  console.log(`check-service-role-key: clean (${files.length} source files, ${chunks} client chunks)`);
  process.exit(0);
}

console.error(`\ncheck-service-role-key: ${violations.length} violation(s)\n`);
for (const v of violations) {
  console.error(v.line ? `  ${v.file}:${v.line}  ${v.why}` : `  ${v.file}  ${v.why}`);
}
console.error('\nService-role access belongs in a Server Action or route handler, never in a client component.\n');
process.exit(1);
