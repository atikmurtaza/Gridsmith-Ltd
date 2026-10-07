#!/usr/bin/env node
/**
 * check-legal-adoption — the `GS-O003-R` gate (`GS-LEGAL-001`, 6 October 2026).
 *
 * `GS-O003` required solicitor approval before any legal document could be published. The owner
 * replaced it with an evidence-based review plus explicit owner adoption, recorded per document in
 * `docs/_legal/GS-O003-R-REGISTER.json`. This gate is the documentary half of that rule; the
 * research record (`docs/_legal/research/GS-LEGAL-001/`) is the substantive half, and the owner's
 * adoption is the decision. See `legal-adoption-rules.mjs` for what a green run does and does not
 * mean.
 *
 * Static: it reads the register, the drafts, the seed generated from them, and the consent and
 * storage facts from the source. It runs in `verify:static`. `check-legal-parity.mjs` is the served
 * counterpart and answers a different question (is the page the draft?).
 *
 * Proven by deliberate failure: `check-legal-adoption.selftest.mjs` fires every branch against
 * committed specimens, and a count of zero documents is itself a failure here.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { LEGAL_DOCUMENTS, LEGAL_DRAFT_SOURCES } from './seed-legal.mjs';
import {
  crossRegisterProblems,
  draftProblems,
  instrumentProblems,
  parityProblems,
  registerProblems,
  stateProblems,
  FORBIDDEN_CLAIMS,
  MARKERS,
} from './legal-adoption-rules.mjs';

/** Hardcoded — removing a source must fail, not measure less. */
const EXPECTED_DRAFTS = 6;
const EXPECTED_DOCUMENTS = 7;

const register = JSON.parse(readFileSync('docs/_legal/GS-O003-R-REGISTER.json', 'utf8'));
const problems = [];
const counted = { drafts: 0, documents: 0 };
const drafts = {};

for (const doc of LEGAL_DOCUMENTS) {
  const slug = doc.slug.current;
  counted.documents += 1;
  const file = LEGAL_DRAFT_SOURCES[slug];
  const entry = register.documents?.[slug];
  problems.push(...registerProblems(slug, entry, doc.version, file ? `docs/_legal/${file}` : null));
  const served = doc.clauses.flatMap((c) => c.body.map((b) => b.children[0].text)).join('\n');
  if (!file) {
    // The disambiguation page has no draft: hold its served text to the claims and markers rules.
    const text = `${served}
${doc.summary}`;
    for (const re of FORBIDDEN_CLAIMS) if (re.test(text)) problems.push(`${slug}: makes a forbidden claim (${re})`);
    for (const re of MARKERS) if (re.test(text)) problems.push(`${slug}: carries an open marker ${re}`);
    continue;
  }
  counted.drafts += 1;
  const markdown = readFileSync(`docs/_legal/${file}`, 'utf8');
  drafts[slug] = markdown;
  problems.push(...draftProblems(slug, markdown));
  problems.push(...instrumentProblems(slug, markdown));
  for (const re of FORBIDDEN_CLAIMS) if (re.test(doc.summary)) problems.push(`${slug}: summary makes a forbidden claim (${re})`);
  problems.push(...stateProblems(slug, entry?.state, markdown, doc.summary, entry?.ownerAdoptedOn));
}

problems.push(...crossRegisterProblems(register.documents));

// Facts from the source, not from the policies.
const consent = readFileSync('lib/consent/state.ts', 'utf8');
const cookieName = consent.match(/export const COOKIE = '([^']+)'/)?.[1];
const maxAge = consent.match(/const MAX_AGE = ([0-9 *]+);/)?.[1];
const cookieDays = maxAge ? maxAge.split('*').map((n) => Number(n.trim())).reduce((a, b) => a * b, 1) / 86400 : null;
if (!cookieName || !cookieDays) problems.push('lib/consent/state.ts: could not read the cookie name or lifetime — the parity check measured nothing');

const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? walk(path) : /\.(tsx?|mjs)$/.test(name) ? [path] : [];
});
const storageApis = new Set();
for (const file of ['app', 'components', 'lib'].flatMap(walk)) {
  for (const m of readFileSync(file, 'utf8').matchAll(/\b(localStorage|sessionStorage|indexedDB)\s*[.([]/g)) storageApis.add(m[1]);
}
problems.push(...parityProblems(drafts.privacy ?? '', drafts.cookies ?? '', { cookieName, cookieDays, storageApis: [...storageApis] }));

if (counted.drafts !== EXPECTED_DRAFTS || counted.documents !== EXPECTED_DOCUMENTS) {
  problems.push(`measured ${counted.drafts} draft(s) and ${counted.documents} document(s), expected ${EXPECTED_DRAFTS} and ${EXPECTED_DOCUMENTS}`);
}

if (problems.length) {
  console.error(`\ncheck-legal-adoption: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exitCode = 1;
} else {
  const states = LEGAL_DOCUMENTS.map((d) => `${d.slug.current}=${register.documents[d.slug.current].state}`).join(', ');
  console.log(`check-legal-adoption: ${counted.drafts} drafts and ${counted.documents} documents keep the decided positions; register coherent (${states})`);
}
