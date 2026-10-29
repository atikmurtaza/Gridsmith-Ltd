#!/usr/bin/env node
/**
 * check-legal-adoption — the `GS-O003-R` gate (`GS-LEGAL-001`, 6 October 2026).
 *
 * `GS-O003` required solicitor approval before any legal document could be published. The owner
 * replaced it with an evidence-based review plus explicit owner adoption, recorded per document in
 * `docs/_legal/evidence/GS-O003-R-REGISTER.json`. This gate is the documentary half of that rule; the
 * research record (`git:a7b931c10eb2a543bfa43e89954555fdadb7072d:docs/_archive/legal/pre-GS-LEGAL-FINAL-001/research/GS-LEGAL-001/`) is the substantive half, and the owner's
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
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { ACTIVE_LEGAL_PROPOSAL, LEGAL_DOCUMENTS, LEGAL_DRAFT_SOURCES, legalProposalDocuments, parseDraft } from './seed-legal.mjs';
import {
  analyticsDisclosureProblems,
  crossRegisterProblems,
  draftProblems,
  instrumentProblems,
  parityProblems,
  registerProblems,
  stateProblems,
  coordinatedReviewProblems,
  directContactAccessibilityProblems,
  FORBIDDEN_CLAIMS,
  MARKERS,
} from './legal-adoption-rules.mjs';

/** Hardcoded — removing a source must fail, not measure less. */
const EXPECTED_DRAFTS = 7;
const EXPECTED_DOCUMENTS = 7;

const sha256 = (data) => createHash('sha256').update(data).digest('hex');
/**
 * The text an adoption covers: a draft's bytes, or, for the draftless disambiguation page, the
 * content the seed generates for it (title, version, effective date, summary, clauses).
 */
const adoptedTextSha = (doc, file) =>
  file
    ? sha256(readFileSync(`docs/_legal/${file}`))
    : sha256(JSON.stringify({ title: doc.title, version: doc.version, effectiveFrom: doc.effectiveFrom, summary: doc.summary, clauses: doc.clauses }));

const register = JSON.parse(readFileSync('docs/_legal/evidence/GS-O003-R-REGISTER.json', 'utf8'));
const problems = [];
const canonical = readdirSync('docs/_legal/current').sort();
const expectedFiles = Object.values(LEGAL_DRAFT_SOURCES).map((p) => p.replace('current/', '')).sort();
if (JSON.stringify(canonical) !== JSON.stringify(expectedFiles)) problems.push('current/ must contain exactly the seven canonical public texts');
const counted = { drafts: 0, documents: 0 };
const drafts = {};

for (const doc of LEGAL_DOCUMENTS) {
  const slug = doc.slug.current;
  counted.documents += 1;
  const file = LEGAL_DRAFT_SOURCES[slug];
  const entry = register.documents?.[slug];
  problems.push(...registerProblems(slug, entry, doc.version, file ? `docs/_legal/${file}` : null, adoptedTextSha(doc, file)));
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
problems.push(...coordinatedReviewProblems(drafts, readFileSync('docs/_legal/compliance/CONSUMER-CONTRACTING-WORKFLOW.md', 'utf8')));

// Facts from the source, not from the policies.
const consent = readFileSync('lib/consent/state.ts', 'utf8');
const cookieName = consent.match(/export const COOKIE = '([^']+)'/)?.[1];
const maxAge = consent.match(/const MAX_AGE = ([0-9 *]+);/)?.[1];
const cookieDays = maxAge ? maxAge.split('*').map((n) => Number(n.trim())).reduce((a, b) => a * b, 1) / 86400 : null;
if (!cookieName || !cookieDays) problems.push('lib/consent/state.ts: could not read the cookie name or lifetime — the parity check measured nothing');
const choiceAge = readFileSync('lib/consent/decision.ts', 'utf8').match(/export const CHOICE_MAX_AGE = ([0-9 *]+);/)?.[1];
const choiceDays = choiceAge ? choiceAge.split('*').map((n) => Number(n.trim())).reduce((a, b) => a * b, 1) / 86400 : null;
if (!choiceDays) problems.push('lib/consent/decision.ts: could not read the analytics choice lifetime — the disclosure check measured nothing');

const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? walk(path) : /\.(tsx?|mjs)$/.test(name) ? [path] : [];
});
const storageApis = new Set();
for (const file of ['app', 'components', 'lib'].flatMap(walk)) {
  for (const m of readFileSync(file, 'utf8').matchAll(/\b(localStorage|sessionStorage|indexedDB)\s*[.([]/g)) storageApis.add(m[1]);
}
const contactMode = register.documents?.privacy?.contactMode ?? 'edge';
problems.push(...parityProblems(drafts.privacy ?? '', drafts.cookies ?? '', { cookieName, cookieDays, storageApis: [...storageApis], contactMode }));
if (contactMode === 'direct') problems.push(...directContactAccessibilityProblems(drafts.accessibility ?? ''));

/**
 * GS-LAUNCH-026: the active revision proposal meets every rule an adopted text meets before the owner
 * is asked to adopt it, describes the analytics it is written for, and — for each document it calls
 * presentation-only — serves exactly the words of the adoption it revises, clause by clause.
 */
let proposalSummary = '';
if (ACTIVE_LEGAL_PROPOSAL) {
  const dir = `docs/_legal/proposed/${ACTIVE_LEGAL_PROPOSAL}`;
  const tag = (list) => list.map((p) => `proposal ${ACTIVE_LEGAL_PROPOSAL} ${p}`);
  try {
    const proposed = legalProposalDocuments(ACTIVE_LEGAL_PROPOSAL);
    const manifest = JSON.parse(readFileSync(`${dir}/PROPOSAL.json`, 'utf8'));
    const texts = {};
    let presentationOnly = 0;
    for (const doc of proposed) {
      const slug = doc.slug.current, entry = manifest.documents[slug];
      const markdown = readFileSync(`${dir}/${entry.file}`, 'utf8');
      texts[slug] = markdown;
      problems.push(...tag(draftProblems(slug, markdown)), ...tag(instrumentProblems(slug, markdown)),
        ...tag(stateProblems(slug, 'OWNER_ADOPTED', markdown, entry.summary, null)));
      for (const re of FORBIDDEN_CLAIMS) if (re.test(entry.summary)) problems.push(...tag([`${slug}: summary makes a forbidden claim (${re})`]));
      if (entry.change === 'presentation-only') {
        presentationOnly += 1;
        const words = (md) => JSON.stringify(parseDraft(md).clauses.map((c) => [c.number, c.heading, c.paragraphs]));
        if (words(markdown) !== words(readFileSync(`docs/_legal/${LEGAL_DRAFT_SOURCES[slug]}`, 'utf8'))) {
          problems.push(...tag([`${slug}: classed presentation-only but its served words differ from the adopted ${entry.supersedes.version}`]));
        }
      } else if (entry.change !== 'substantive') problems.push(...tag([`${slug}: change must be presentation-only or substantive`]));
    }
    const workflow = readFileSync(`${dir}/${manifest.workflow.file}`);
    if (createHash('sha256').update(workflow).digest('hex') !== manifest.workflow.sha256) problems.push(...tag(['consumer workflow fingerprint mismatch']));
    problems.push(...tag(coordinatedReviewProblems(texts, workflow.toString('utf8'))));
    problems.push(...tag(parityProblems(texts.privacy, texts.cookies, { cookieName, cookieDays, storageApis: [...storageApis], contactMode })));
    // Written for the owner's intended launch: both providers offered.
    problems.push(...tag(analyticsDisclosureProblems(texts.cookies, texts.privacy, { ga4: true, posthog: true }, { choiceDays })));
    if (contactMode === 'direct') problems.push(...tag(directContactAccessibilityProblems(texts.accessibility)));
    proposalSummary = `; proposal ${ACTIVE_LEGAL_PROPOSAL}: ${proposed.length} documents (${presentationOnly} presentation-only, word-identical), not adopted`;
    if (proposed.length !== EXPECTED_DOCUMENTS) problems.push(...tag([`revises ${proposed.length} documents, expected ${EXPECTED_DOCUMENTS}`]));
  } catch (error) {
    problems.push(...tag([error.message]));
  }
}

if (counted.drafts !== EXPECTED_DRAFTS || counted.documents !== EXPECTED_DOCUMENTS) {
  problems.push(`measured ${counted.drafts} draft(s) and ${counted.documents} document(s), expected ${EXPECTED_DRAFTS} and ${EXPECTED_DOCUMENTS}`);
}

if (problems.length) {
  console.error(`\ncheck-legal-adoption: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exitCode = 1;
} else {
  const states = LEGAL_DOCUMENTS.map((d) => `${d.slug.current}=${register.documents[d.slug.current].state}`).join(', ');
  console.log(`check-legal-adoption: ${counted.drafts} drafts and ${counted.documents} documents keep the decided positions; register coherent (${states})${proposalSummary}`);
}
