#!/usr/bin/env node
/**
 * check-service-role-key
 *
 * design/PROJECT-RULES.md §1.6 — the Supabase service-role key must never reach the
 * client. It bypasses row-level security, so a single leak exposes every lead in the
 * database.
 *
 * Two checks: the key must not appear in a client component, and it must never be
 * given a NEXT_PUBLIC_ prefix anywhere (which would inline it into the bundle).
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, posix, sep } from 'node:path';

// `scripts/` is in scope: the seed, import and image-ingest scripts are exactly where a
// service-role key is most tempting, and it was the one tree this gate did not read.
// `lib/` arrives at A-07 and is promoted into this list in that commit — see
// PENDING_ROOTS below, which fails if it appears without being promoted.
const ROOTS = ['app', 'components', 'scripts'];
const PENDING_ROOTS = { lib: 'A-07 — Supabase client, lead pipeline, consent' };
const SOURCE = /\.(?:ts|tsx|js|jsx|mjs|cjs)$/;
const KEY = ['SUPABASE', 'SERVICE', 'ROLE', 'KEY'].join('_');
const PUBLIC_PREFIXED = /NEXT_PUBLIC_[A-Z0-9_]*SERVICE_ROLE[A-Z0-9_]*/g;

const toPosix = (p) => p.split(sep).join(posix.sep);

/** A missing root is a narrowed sweep reported as a clean one. Fail instead. */
function sourceFiles() {
  for (const [root, when] of Object.entries(PENDING_ROOTS)) {
    if (existsSync(root)) {
      console.error(`\ncheck-service-role-key: "${root}/" now exists (${when}) but is not in ROOTS.`);
      console.error('Promote it — that tree is where the service-role key will actually live.\n');
      process.exit(1);
    }
  }

  const out = [];
  for (const root of ROOTS) {
    if (!existsSync(root)) {
      console.error(`\ncheck-service-role-key: root "${root}/" does not exist — it was not scanned.\n`);
      process.exit(1);
    }
    for (const entry of readdirSync(root, { recursive: true, withFileTypes: true })) {
      if (!entry.isFile() || !SOURCE.test(entry.name)) continue;
      out.push(toPosix(relative('.', join(entry.parentPath ?? root, entry.name))));
    }
  }
  return out.sort();
}

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
const files = sourceFiles();

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const client = isClientComponent(source);

  source.split(/\r?\n/).forEach((line, i) => {
    if (client && line.includes(KEY)) {
      violations.push({ file, line: i + 1, why: `${KEY} referenced in a client component` });
    }
    PUBLIC_PREFIXED.lastIndex = 0;
    let m;
    while ((m = PUBLIC_PREFIXED.exec(line)) !== null) {
      violations.push({ file, line: i + 1, why: `${m[0]} — NEXT_PUBLIC_ inlines this into the bundle` });
    }
  });
}

if (violations.length === 0) {
  console.log(`check-service-role-key: clean (${files.length} files)`);
  process.exit(0);
}

console.error(`\ncheck-service-role-key: ${violations.length} violation(s)\n`);
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  ${v.why}`);
}
console.error('\nService-role access belongs in a Server Action or route handler, never in a client component.\n');
process.exit(1);
