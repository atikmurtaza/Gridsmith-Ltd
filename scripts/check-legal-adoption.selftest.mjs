#!/usr/bin/env node
/**
 * check-legal-adoption.selftest — every branch of `legal-adoption-rules.mjs`, made to fire.
 *
 * Each specimen is a real draft with one targeted mutation, and each case asserts the message the
 * branch returns — a value, not an absence — so a predicate that stops matching fails here rather
 * than reporting a clean run. The unmutated drafts are the control: they must return nothing,
 * which is what shows each mutation, and only the mutation, is what fired.
 *
 * Runs in `verify:static`.
 */
import { readFileSync } from 'node:fs';
import {
  danglingReferences,
  draftProblems,
  instrumentProblems,
  parityProblems,
  registerProblems,
  crossRegisterProblems,
  stateProblems,
} from './legal-adoption-rules.mjs';
import { parseDraft } from './seed-legal.mjs';

const read = (f) => readFileSync(`docs/_legal/${f}`, 'utf8');
const consumer = read('CONSUMER-TERMS.md');
const business = read('MSA-BUSINESS.md');
const privacy = read('PRIVACY-POLICY.md');
const cookies = read('COOKIE-POLICY.md');
const facts = { cookieName: 'gs_consent', cookieDays: 365, storageApis: [] };

let failures = 0;
let cases = 0;
const swap = (text, from, to) => {
  if (!text.includes(from)) throw new Error(`specimen anchor missing: ${from.slice(0, 60)}`);
  return text.replace(from, to);
};
const expect = (name, problems, pattern) => {
  cases += 1;
  const ok = pattern === null ? problems.length === 0 : problems.some((p) => pattern.test(p));
  if (!ok) {
    failures += 1;
    console.error(`  FAIL ${name}: expected ${pattern ?? 'no problems'}, got ${JSON.stringify(problems)}`);
  }
};
const all = (slug, md) => [...draftProblems(slug, md), ...instrumentProblems(slug, md)];

// Controls.
expect('consumer clean', all('consumer-client-terms', consumer), null);
expect('business clean', all('business-client-terms', business), null);
expect('parity clean', parityProblems(privacy, cookies, facts), null);

// draftProblems — one branch each.
expect('forbidden claim', all('consumer-client-terms', consumer + '\nThese terms are solicitor approved.\n'), /forbidden claim/);
expect('VAT status', all('business-client-terms', swap(business, 'The Scope states whether VAT is added to the price.', 'Gridsmith Ltd is not currently registered for VAT.')), /VAT registration status/);
expect('VAT number', all('business-client-terms', business + '\nVAT number GB123456789\n'), /VAT registration status/);
expect('company number', all('consumer-client-terms', consumer.replaceAll('17050842', '00000000')), /company number/);
expect('dangling reference', all('consumer-client-terms', swap(consumer, 'the cancellation form in section 22', 'the cancellation form in section 42')), /refers to clause\(s\) 42/);
expect('regulator name', draftProblems('privacy', privacy + "\nComplain to the Information Commissioner's Office.\n"), /Information Commissioner's Office/);
expect('retired host', draftProblems('privacy', privacy + '\nVercel hosts the site.\n'), /Vercel/);
expect('website prices', draftProblems('terms', read('WEBSITE-TERMS.md').replace('This website does not publish prices.', 'Prices shown on this website are indicative.')), /prices shown/);

// instrumentProblems — shared client-terms branches.
expect('automatic portfolio', all('business-client-terms', business + '\nGridsmith may identify the client and display final work.\n'), /automatic portfolio/);
expect('no portfolio consent', all('consumer-client-terms', consumer.replaceAll('express written consent', 'consent')), /express written consent/);
expect('Technical wide', all('consumer-client-terms', consumer + '\nWe provide engineering and technical drawing services.\n'), /wider than the GS-X002/);
expect('Technical certification by scope', all('business-client-terms', business + '\nCertification is included only where the Scope says so.\n'), /wider than the GS-X002/);
expect('Technical boundary missing', all('business-client-terms', business.replaceAll('certification, approval, stamping or sign-off', 'sign-off')), /lacks the GS-X002 boundary/);
expect('payment as acceptance', all('consumer-client-terms', swap(consumer, 'We do not treat payment on its own, or silence, as acceptance.', 'Paying the first invoice is acceptance.')), /payment alone is not acceptance/);

// instrumentProblems — consumer.
expect('no obligation-to-pay acknowledgement', all('consumer-client-terms', consumer.replace('accepting it means I must pay', 'I accept')), /CCR reg\. 14/);
expect('no instalment limit (consumer)', all('consumer-client-terms', consumer.replace('no more than twelve such payments', 'any number of payments')), /consumer-credit exemption/);
expect('no instalment limit (business)', all('business-client-terms', business.replace('no more than twelve such payments', 'any number of payments')), /consumer-credit exemption/);
// GS-LEGAL-001-R3: the period must be the statutory "beginning with" form; 3.0's looser wording fails.
expect('loose instalment period (consumer)', all('consumer-client-terms', consumer.replace('within the 12 months beginning with', 'within 12 months of')), /consumer-credit exemption/);
expect('instalment interest allowed (consumer)', all('consumer-client-terms', consumer.replace(', and we charge no interest or fee for paying that way', '')), /consumer-credit exemption/);
expect('instalment interest allowed (business)', all('business-client-terms', business.replace(', with no interest or fee for paying that way', '')), /consumer-credit exemption/);
expect('loose instalment period (business)', all('business-client-terms', business.replace('within the 12 months beginning with', 'within 12 months of')), /consumer-credit exemption/);
expect('no cancellation form', all('consumer-client-terms', consumer.replace('I/We hereby give notice that I/We cancel', 'I cancel')), /cancellation form/);
expect('no express request', all('consumer-client-terms', consumer.replace('I ask Gridsmith Ltd to start work now', 'Start now')), /early-start request/);
expect('no payment acknowledgement', all('consumer-client-terms', consumer.replace('I will pay for the work carried out up to the time I tell Gridsmith Ltd', 'I may pay')), /payment on cancellation/);
expect('no loss acknowledgement', all('consumer-client-terms', consumer.replaceAll('I will lose my right to cancel', 'I lose out')), /loss of the right/);
expect('no stage table', all('consumer-client-terms', consumer.replaceAll('stage table', 'schedule')), /stage table/);
expect('no refund deadline', all('consumer-client-terms', consumer.replace(/refund([^.]*)within 14 days/g, 'refund$1promptly')), /14-day refund/);
expect('refund fee', all('consumer-client-terms', consumer.replace('not charge you a fee', 'charge an admin fee')), /no-fee refund/);
expect('sent in time', all('consumer-client-terms', consumer.replace('cancelled in time if you send', 'cancelled when we receive')), /sent in time/);
expect('Press anchor', all('consumer-client-terms', consumer.replace('### 10.1 Your existing work', '### 10.4 Your existing work')), /anchor 10\.1/);
expect('exit needs agreement', all('consumer-client-terms', consumer + '\nIf we agree to end the project, you pay.\n'), /depend on Gridsmith's agreement/);
expect('late payment law', all('consumer-client-terms', consumer + '\nLate Payment of Commercial Debts applies.\n'), /late-payment law/);
expect('liability cap', all('consumer-client-terms', consumer + '\nOur total liability will not exceed the price.\n'), /business liability cap/);
expect('non-refundable deposit', all('consumer-client-terms', consumer.replace('We do not take non-refundable deposits.', 'We take a non-refundable deposit of 30%.')), /non-refundable deposit/);

// instrumentProblems — business.
expect('no consumer routing', all('business-client-terms', business.replaceAll('Client Terms for Consumers', 'other terms')), /route consumers/);
expect('self-referential cap', all('business-client-terms', business + '\nThe limitation applies only to the extent it is fair and reasonable.\n'), /self-referential/);
expect('no DPA schedule', all('business-client-terms', business.replaceAll('Data Processing Schedule', 'data terms')), /Art\. 28/);

// parityProblems — each fact.
expect('provider missing', parityProblems(privacy.replaceAll('Hostinger', 'our host'), cookies, facts), /does not name Hostinger/);
expect('regulator missing', parityProblems(privacy.replaceAll('Information Commission', 'regulator'), cookies, facts), /Information Commission/);
expect('storage region missing', parityProblems(privacy.replaceAll('Ireland', 'Europe'), cookies, facts), /where enquiries are stored/);
expect('cookie name', parityProblems(privacy, cookies, { ...facts, cookieName: 'gs_other' }), /gs_other/);
expect('cookie lifetime', parityProblems(privacy, cookies, { ...facts, cookieDays: 180 }), /180-day/);
expect('undisclosed storage', parityProblems(privacy, cookies, { ...facts, storageApis: ['localStorage'] }), /says no local storage/);

// registerProblems.
const entry = { draft: 'docs/_legal/X.md', state: 'RESEARCHED', ownerAdoptedOn: null, ownerAdoptedVersion: null };
expect('register clean', registerProblems('x', entry, '1.0', 'docs/_legal/X.md'), null);
expect('register missing', registerProblems('x', undefined, '1.0', null), /no entry/);
expect('register unknown state', registerProblems('x', { ...entry, state: 'APPROVED' }, '1.0', 'docs/_legal/X.md'), /unknown state/);
expect('register wrong draft', registerProblems('x', entry, '1.0', 'docs/_legal/Y.md'), /register draft/);
expect('adopted without date', registerProblems('x', { ...entry, state: 'OWNER_ADOPTED', ownerAdoptedVersion: '1.0' }, '1.0', 'docs/_legal/X.md'), /without an ownerAdoptedOn/);
expect('adopted other version', registerProblems('x', { ...entry, state: 'PUBLISHABLE', ownerAdoptedOn: '2026-10-07', ownerAdoptedVersion: '0.9' }, '1.0', 'docs/_legal/X.md'), /adopted version/);
expect('adoption recorded early', registerProblems('x', { ...entry, ownerAdoptedOn: '2026-10-07' }, '1.0', 'docs/_legal/X.md'), /only the owner's adoption/);

// stateProblems.
// The draft date is matched by pattern, not by value: R3 moved the consumer draft to 7 October and a
// literal replace silently stopped producing an adopted specimen (a hollow subject). Assert it did.
const DRAFT_DATE = /^\*\*Draft date: [^*]+\*\*/m;
const toEffective = (md) => {
  const out = md.replace(DRAFT_DATE, '**Effective date: 8 October 2026**');
  if (out === md) throw new Error('selftest premise: specimen has no "**Draft date: …**" header to replace');
  return out;
};
// GS-LEGAL-001-R4: the consumer terms are now adopted and carry an effective date. State specimens
// are built from a draft-headed form so they do not depend on the register state of the real file.
const EFFECTIVE_DATE = /^\*\*Effective date: [^*]+\*\*/m;
const asDraft = (md) => md.replace(EFFECTIVE_DATE, '**Draft date: 6 October 2026**');
const consumerDraft = asDraft(consumer);
if (!DRAFT_DATE.test(consumerDraft)) throw new Error('selftest premise: consumer specimen has no date header at all');
const adoptedConsumer = toEffective(consumerDraft);
expect('publishable clean', stateProblems('c', 'PUBLISHABLE', adoptedConsumer, 'summary', '2026-10-07'), null);
expect('researched may carry markers', stateProblems('p', 'RESEARCHED', privacy, 's', null), null);
expect('publishable with owner marker', stateProblems('p', 'PUBLISHABLE', toEffective(privacy), 's', '2026-10-07'), /open marker/);
expect('verified with TK', stateProblems('c', 'VERIFIED', consumerDraft + '\n[TK: price]\n', 's', null), /\\\[TK/);
expect('verified with seed summary', stateProblems('c', 'OWNER_REVIEW_REQUIRED', consumerDraft, '[SEED] summary', null), /\\\[SEED/);
expect('publishable without effective date', stateProblems('c', 'PUBLISHABLE', consumerDraft, 's', '2026-10-07'), /without an "Effective date"/);
expect('effective before adoption', stateProblems('c', 'PUBLISHABLE', adoptedConsumer, 's', '2026-10-09'), /before its adoption/);
expect('draft date left on', stateProblems('c', 'PUBLISHABLE', adoptedConsumer + '\n**Draft date: 6 October 2026**\n', 's', '2026-10-07'), /draft date/);

// GS-LEGAL-001-R4 — adoption itself.
expect('adopted clean', stateProblems('c', 'OWNER_ADOPTED', adoptedConsumer, 's', '2026-10-07'), null);
expect('adopted with an open marker (the privacy guard)', stateProblems('p', 'OWNER_ADOPTED', toEffective(asDraft(privacy)), 's', '2026-10-07'), /OWNER_ADOPTED but carries an open marker/);
expect('adopted still headed with a draft date', stateProblems('c', 'OWNER_ADOPTED', consumerDraft, 's', '2026-10-07'), /OWNER_ADOPTED but still headed with a draft date/);
expect('adopted without an effective date', stateProblems('c', 'OWNER_ADOPTED', consumerDraft, 's', '2026-10-07'), /OWNER_ADOPTED without an "Effective date"/);
const PRE = (ids) => ids.map((id) => ({ id, requirement: id }));
const SHA = 'a'.repeat(64);
const adoptedEntry = { ...entry, state: 'OWNER_ADOPTED', ownerAdoptedOn: '2026-10-07', ownerAdoptedVersion: '1.0', ownerAdoptedSha256: SHA,
  adoptionAuthority: 'Owner instruction, test specimen', publicationPrerequisites: PRE(['CUTOVER-AUTHORITY', 'PRIVACY-PUBLISHABLE']), prerequisitesMet: {} };
expect('adopted register clean', registerProblems('x', adoptedEntry, '1.0', 'docs/_legal/X.md', SHA), null);
expect('adopted without authority', registerProblems('x', { ...adoptedEntry, adoptionAuthority: undefined }, '1.0', 'docs/_legal/X.md', SHA), /without an adoptionAuthority/);
expect('adopted with an empty authority', registerProblems('x', { ...adoptedEntry, adoptionAuthority: '  ' }, '1.0', 'docs/_legal/X.md', SHA), /without an adoptionAuthority/);
expect('adopted without cutover prerequisite', registerProblems('x', { ...adoptedEntry, publicationPrerequisites: PRE(['PRIVACY-PUBLISHABLE']) }, '1.0', 'docs/_legal/X.md', SHA), /CUTOVER-AUTHORITY/);
expect('cookies adopted without A-2', registerProblems('cookies', adoptedEntry, '1.0', 'docs/_legal/X.md', SHA), /A-2-PRODUCTION-COOKIE-RETEST/);
expect('cookies adopted with A-2 clean', registerProblems('cookies', { ...adoptedEntry, publicationPrerequisites: PRE(['CUTOVER-AUTHORITY', 'PRIVACY-PUBLISHABLE', 'A-2-PRODUCTION-COOKIE-RETEST']) }, '1.0', 'docs/_legal/X.md', SHA), null);
expect('publishable with an unmet prerequisite', registerProblems('x', { ...adoptedEntry, state: 'PUBLISHABLE', prerequisitesMet: { 'CUTOVER-AUTHORITY': 'owner, date' } }, '1.0', 'docs/_legal/X.md', SHA), /PRIVACY-PUBLISHABLE has no recorded evidence/);
expect('publishable with every prerequisite met', registerProblems('x', { ...adoptedEntry, state: 'PUBLISHABLE', prerequisitesMet: { 'CUTOVER-AUTHORITY': 'owner, date', 'PRIVACY-PUBLISHABLE': 'register, date' } }, '1.0', 'docs/_legal/X.md', SHA), null);
// R4 review M1 — adoption is bound to the adopted text, not only the version number.
expect('adopted text changed, same version', registerProblems('x', adoptedEntry, '1.0', 'docs/_legal/X.md', 'b'.repeat(64)), /not the adopted text/);
expect('adopted without a text hash', registerProblems('x', { ...adoptedEntry, ownerAdoptedSha256: undefined }, '1.0', 'docs/_legal/X.md', SHA), /without an ownerAdoptedSha256/);
expect('adopted with a malformed hash', registerProblems('x', { ...adoptedEntry, ownerAdoptedSha256: 'abc' }, '1.0', 'docs/_legal/X.md', 'abc'), /without an ownerAdoptedSha256/);
expect('hash recorded before adoption', registerProblems('x', { ...entry, ownerAdoptedSha256: SHA }, '1.0', 'docs/_legal/X.md', SHA), /only the owner's adoption/);
// R4 review M5/L1 — privacy, when adopted, needs the H4-B intake promoted and does not list itself.
expect('privacy adopted without the H4-B prerequisite', registerProblems('privacy', { ...adoptedEntry, publicationPrerequisites: PRE(['CUTOVER-AUTHORITY']) }, '1.0', 'docs/_legal/X.md', SHA), /H4-B-INTAKE-PROMOTED/);
expect('privacy adopted with its own prerequisites clean', registerProblems('privacy', { ...adoptedEntry, publicationPrerequisites: PRE(['CUTOVER-AUTHORITY', 'H4-B-INTAKE-PROMOTED']), prerequisitesMet: { 'RETENTION-ROUTINE-OPERATING': 'cleanup log, date', 'HOSTINGER-PROCESSOR-CHAIN': 'signed DPA, date' } }, '1.0', 'docs/_legal/X.md', SHA), null);
// R6 — Privacy 2.2 describes the retention routine as operating, so adoption needs evidence that it does.
expect('privacy adopted while the retention routine is not operating', registerProblems('privacy', { ...adoptedEntry, publicationPrerequisites: PRE(['CUTOVER-AUTHORITY', 'H4-B-INTAKE-PROMOTED']) }, '1.0', 'docs/_legal/X.md', SHA), /without recorded evidence for RETENTION-ROUTINE-OPERATING/);
expect('privacy adopted with empty retention evidence', registerProblems('privacy', { ...adoptedEntry, publicationPrerequisites: PRE(['CUTOVER-AUTHORITY', 'H4-B-INTAKE-PROMOTED']), prerequisitesMet: { 'RETENTION-ROUTINE-OPERATING': '  ' } }, '1.0', 'docs/_legal/X.md', SHA), /without recorded evidence for RETENTION-ROUTINE-OPERATING/);
expect('privacy adopted without the Hostinger processor chain', registerProblems('privacy', { ...adoptedEntry, publicationPrerequisites: PRE(['CUTOVER-AUTHORITY', 'H4-B-INTAKE-PROMOTED']), prerequisitesMet: { 'RETENTION-ROUTINE-OPERATING': 'cleanup log, date' } }, '1.0', 'docs/_legal/X.md', SHA), /without recorded evidence for HOSTINGER-PROCESSOR-CHAIN/);
expect('other documents need no retention evidence', registerProblems('terms', adoptedEntry, '1.0', 'docs/_legal/X.md', SHA), null);

// danglingReferences — lists and sub-clauses.
expect('reference list', danglingReferences('## 1. A\n## 2. B\nSee sections 1, 2 and 7.\n'), /^7$/);
expect('sub-clause parent', danglingReferences('## 6. A\n### 6.1 B\nSee section 6 and clause 6.1.\n'), null);

// GS-LEGAL-001-R4 — the owner's forbidden list, the obsolete solicitor gate, contradictory state.
expect('lawyer approved', all('consumer-client-terms', consumer + '\nThese terms are lawyer-approved.\n'), /forbidden claim/);
expect('approved by our lawyers', all('consumer-client-terms', consumer + '\nThese terms were approved by our lawyers.\n'), /forbidden claim/);
expect('guaranteed compliant', all('consumer-client-terms', consumer + '\nThis policy is guaranteed compliant.\n'), /forbidden claim/);
expect('guaranteed enforceable', all('consumer-client-terms', consumer + '\nEvery clause is guaranteed to be enforceable.\n'), /forbidden claim/);
expect('obsolete solicitor gate', all('consumer-client-terms', consumer + '\nThis version is subject to solicitor approval.\n'), /forbidden claim/);
expect('adopted but says not yet adopted', stateProblems('c', 'OWNER_ADOPTED', consumer + '\nThis version is not yet adopted.\n', 's', '2026-10-07'), /says it is not adopted/);
expect('adopted consumer draft clean', stateProblems('c', 'OWNER_ADOPTED', consumer, 's', '2026-10-07'), null);
// crossRegisterProblems — PRIVACY-PUBLISHABLE is checkable inside the register.
const docs = (privacyState, met) => ({ privacy: { state: privacyState }, terms: { state: 'PUBLISHABLE', prerequisitesMet: met } });
expect('privacy-publishable claimed while privacy unadopted', crossRegisterProblems(docs('OWNER_REVIEW_REQUIRED', { 'PRIVACY-PUBLISHABLE': 'yes' })), /while the privacy entry is OWNER_REVIEW_REQUIRED/);
expect('privacy-publishable claimed while privacy only adopted', crossRegisterProblems(docs('OWNER_ADOPTED', { 'PRIVACY-PUBLISHABLE': 'yes' })), /while the privacy entry is OWNER_ADOPTED/);
expect('privacy-publishable met for real', crossRegisterProblems(docs('PUBLISHABLE', { 'PRIVACY-PUBLISHABLE': 'register, date' })), null);
expect('privacy-publishable not claimed', crossRegisterProblems(docs('OWNER_REVIEW_REQUIRED', {})), null);
// The live register: Privacy not adopted, so the cross check must be clean today.
expect('live register cross-coherent', crossRegisterProblems(JSON.parse(readFileSync('docs/_legal/GS-O003-R-REGISTER.json', 'utf8')).documents), null);

// parseDraft — the generator the served pages come from refuses malformed drafts.
const head = '# T\n\n**Version 1.0**\\\n**Draft date: 6 October 2026**\n\n';
const throws = (name, md, pattern) => {
  cases += 1;
  try { parseDraft(md, 'specimen'); failures += 1; console.error(`  FAIL ${name}: did not throw`); }
  catch (e) { if (!pattern.test(e.message)) { failures += 1; console.error(`  FAIL ${name}: threw ${e.message}`); } }
};
{
  cases += 1;
  const d = parseDraft(head + '## 1. A\n\nOne\ntwo.\n\n- item\n\n| H | I |\n|---|---|\n| x | y |\n\nLine\\\nBreak\n\n### 1.1 B\n\nC.\n');
  const got = JSON.stringify(d.clauses.map((c) => [c.number, c.paragraphs]));
  const want = JSON.stringify([['1', ['One two.', 'item', 'H — I', 'x — y', 'Line', 'Break']], ['1.1', ['C.']]]);
  if (got !== want || d.version !== '1.0' || d.drafted !== '2026-10-06') { failures += 1; console.error(`  FAIL parse shape: ${got}`); }
}
throws('no version', '# T\n\n**Draft date: 6 October 2026**\n\n## 1. A\n\nx\n', /no "\*\*Version/);
throws('no date', '# T\n\n**Version 1.0**\n\n## 1. A\n\nx\n', /no effective or draft date/);
throws('duplicate clause', head + '## 1. A\n\nx\n\n## 1. B\n\ny\n', /appears twice/);
throws('unnumbered heading', head + '## 1. A\n\nx\n\n## Annex\n\ny\n', /unnumbered heading/);
throws('no clause', head + 'Just text.\n', /no numbered clause/);

if (failures) {
  console.error(`\ncheck-legal-adoption.selftest: ${failures} of ${cases} case(s) failed`);
  process.exitCode = 1;
} else {
  console.log(`check-legal-adoption.selftest: ${cases} case(s), every branch fired and every control stayed clean`);
}
