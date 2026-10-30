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
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import {
  danglingReferences,
  draftProblems,
  instrumentProblems,
  parityProblems,
  registerProblems,
  crossRegisterProblems,
  stateProblems,
  coordinatedReviewProblems,
  requiredPrerequisites,
  directContactAccessibilityProblems,
} from './legal-adoption-rules.mjs';
import { parseDraft, assertAdoptedSource, assertNoSelfLink } from './seed-legal.mjs';
import { allLegalPublishable } from '../lib/legal/adoption.ts';

const read = (f) => readFileSync(`docs/_legal/${f}`, 'utf8');
const consumer = read('current/client-terms-consumers.md');
const business = read('current/client-terms-business.md');
const privacy = read('current/privacy-policy.md');
const cookies = read('current/cookie-policy.md');
const website = read('current/website-terms.md');
const workflow = read('compliance/CONSUMER-CONTRACTING-WORKFLOW.md');
const coordinated = { privacy, cookies, terms: website, 'consumer-client-terms': consumer, 'business-client-terms': business };
const previous = f => read('evidence/GS-LAUNCH-014-superseded/' + f);
const previousConsumer = previous('client-terms-consumers.md');
const previousPrivacy = previous('privacy-policy.md');
const previousWorkflow = previous('CONSUMER-CONTRACTING-WORKFLOW.md');
const facts = { cookieName: 'gs_consent', cookieDays: 365, storageApis: [], contactMode: 'direct' };

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

expect('coordinated public texts and operational templates', coordinatedReviewProblems(coordinated, workflow), null);
expect('stale quotation version', coordinatedReviewProblems(coordinated, swap(workflow, 'Client Terms for Consumers version 3.4', 'Client Terms for Consumers version 3.1')), /current consumer version/);
expect('missing early-service request in quotation', coordinatedReviewProblems(coordinated, workflow.replace('"I ask Gridsmith Ltd to start work now', '"Please start')), /exact acceptance/);
expect('cancellation form omits digital content', coordinatedReviewProblems(coordinated, workflow.replace('following service/digital content:', 'following service:')), /form differs/);
expect('digital supply starts early', coordinatedReviewProblems({ ...coordinated, 'consumer-client-terms': consumer.replace('we wait until its cancellation period has ended before supplying it', 'we supply it immediately') }, workflow), /digital content must wait/);
expect('sensitive-data instructions diverge', coordinatedReviewProblems({ ...coordinated, terms: website.replace('Relevance to a project does not by itself authorise its use.', 'Relevance authorises use.') }, workflow), /sensitive-data instructions/);
expect('internal release detail resurfaces', coordinatedReviewProblems({ ...coordinated, privacy: privacy + '\nProduction scheduler history.' }, workflow), /internal release/);
expect('fixed response promise resurfaces', coordinatedReviewProblems({ ...coordinated, terms: website + '\nWe acknowledge within 5 working days.' }, workflow), /fixed acknowledgement/);
expect('country list resurfaces in client terms', coordinatedReviewProblems({ ...coordinated, 'business-client-terms': business + '\nAgencies in Pakistan.' }, workflow), /country list/);

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
expect('website prices', draftProblems('terms', read('current/website-terms.md').replace('This website does not publish prices.', 'Prices shown on this website are indicative.')), /prices shown/);

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
// GS-LAUNCH-026: an accurate recipient category is a disclosure; a vaguer word still is not.
// Every mention is replaced: the adopted text names the host three times, so one replacement is inert.
expect('provider disclosed by category', parityProblems(privacy.replaceAll('Hostinger', 'our website and email hosting provider'), cookies, facts), null);
expect('category too vague', parityProblems(privacy.replaceAll('Hostinger', 'a supplier'), cookies, facts), /does not name Hostinger or disclose it by category/);
expect('regulator missing', parityProblems(privacy.replaceAll('Information Commission', 'regulator'), cookies, facts), /Information Commission/);
expect('storage region missing', parityProblems(previousPrivacy.replaceAll('Ireland', 'Europe'), cookies, { ...facts, contactMode: 'edge' }), /where enquiries are stored/);
expect('cookie name', parityProblems(privacy, cookies, { ...facts, cookieName: 'gs_other' }), /gs_other/);
expect('cookie lifetime', parityProblems(privacy, cookies, { ...facts, cookieDays: 366 }), /366-day/);
expect('undisclosed storage', parityProblems(privacy, cookies + '\nWe do not use local storage.\n', { ...facts, storageApis: ['localStorage'] }), /says no local storage/);

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
// GS-LEGAL-001-R7: the real privacy draft lost its last marker, which made these specimens hollow; the
// two cases went red ("expected open marker, got []"). The marker is now injected, so the specimen stays a
// subject whatever the draft carries.
const privacyMarked = privacy.replace(/^## 6\. /m, '[OWNER DECISION: specimen marker]\n\n## 6. ');
if (!/\[OWNER DECISION/.test(privacyMarked)) throw new Error('selftest premise: privacy specimen carries no marker');
expect('researched may carry markers', stateProblems('p', 'RESEARCHED', privacyMarked, 's', null), null);
expect('publishable with owner marker', stateProblems('p', 'PUBLISHABLE', toEffective(asDraft(privacyMarked)), 's', '2026-10-07'), /open marker/);
expect('verified with TK', stateProblems('c', 'VERIFIED', consumerDraft + '\n[TK: price]\n', 's', null), /\\\[TK/);
expect('verified with seed summary', stateProblems('c', 'OWNER_REVIEW_REQUIRED', consumerDraft, '[SEED] summary', null), /\\\[SEED/);
expect('publishable without effective date', stateProblems('c', 'PUBLISHABLE', consumerDraft, 's', '2026-10-07'), /without an "Effective date"/);
expect('effective before adoption', stateProblems('c', 'PUBLISHABLE', adoptedConsumer, 's', '2026-10-09'), /before its adoption/);
expect('draft date left on', stateProblems('c', 'PUBLISHABLE', adoptedConsumer + '\n**Draft date: 6 October 2026**\n', 's', '2026-10-07'), /draft date/);

// GS-LEGAL-001-R4 — adoption itself.
expect('adopted clean', stateProblems('c', 'OWNER_ADOPTED', adoptedConsumer, 's', '2026-10-07'), null);
expect('adopted with an open marker (the privacy guard)', stateProblems('p', 'OWNER_ADOPTED', toEffective(asDraft(privacyMarked)), 's', '2026-10-07'), /OWNER_ADOPTED but carries an open marker/);
expect('adopted still headed with a draft date', stateProblems('c', 'OWNER_ADOPTED', consumerDraft, 's', '2026-10-07'), /OWNER_ADOPTED but still headed with a draft date/);
expect('adopted without an effective date', stateProblems('c', 'OWNER_ADOPTED', consumerDraft, 's', '2026-10-07'), /OWNER_ADOPTED without an "Effective date"/);
const PUBLICATION_TEXT = 'Owner authority to publish. It does not authorise any change to gridsmith.uk, WordPress or DNS.';
const PRE = (ids) => ids.map((id) => ({ id, requirement: id === 'PUBLICATION-AUTHORITY' ? PUBLICATION_TEXT : id }));
const SHA = 'a'.repeat(64);
const adoptedEntry = { ...entry, state: 'OWNER_ADOPTED', ownerAdoptedOn: '2026-10-07', ownerAdoptedVersion: '1.0', ownerAdoptedSha256: SHA,
  adoptionAuthority: 'Owner instruction, test specimen', publicationPrerequisites: PRE(['PUBLICATION-AUTHORITY', 'PRIVACY-PUBLISHABLE']), prerequisitesMet: {} };
expect('adopted register clean', registerProblems('x', adoptedEntry, '1.0', 'docs/_legal/X.md', SHA), null);
expect('adopted without authority', registerProblems('x', { ...adoptedEntry, adoptionAuthority: undefined }, '1.0', 'docs/_legal/X.md', SHA), /without an adoptionAuthority/);
expect('adopted with an empty authority', registerProblems('x', { ...adoptedEntry, adoptionAuthority: '  ' }, '1.0', 'docs/_legal/X.md', SHA), /without an adoptionAuthority/);
expect('adopted without publication-authority prerequisite', registerProblems('x', { ...adoptedEntry, publicationPrerequisites: PRE(['PRIVACY-PUBLISHABLE']) }, '1.0', 'docs/_legal/X.md', SHA), /PUBLICATION-AUTHORITY/);
expect('publication authority that reads as cutover authority', registerProblems('x', { ...adoptedEntry, publicationPrerequisites: [{ id: 'PUBLICATION-AUTHORITY', requirement: 'Owner authority to publish and to switch gridsmith.uk.' }, ...PRE(['PRIVACY-PUBLISHABLE'])] }, '1.0', 'docs/_legal/X.md', SHA), /does not authorise gridsmith[.]uk, WordPress or DNS/);
expect('cookies adopted without A-2', registerProblems('cookies', adoptedEntry, '1.0', 'docs/_legal/X.md', SHA), /A-2-COOKIE-RETEST/);
expect('cookies adopted with A-2 clean', registerProblems('cookies', { ...adoptedEntry, publicationPrerequisites: PRE(['PUBLICATION-AUTHORITY', 'PRIVACY-PUBLISHABLE', 'A-2-COOKIE-RETEST']) }, '1.0', 'docs/_legal/X.md', SHA), null);
expect('publishable with an unmet prerequisite', registerProblems('x', { ...adoptedEntry, state: 'PUBLISHABLE', prerequisitesMet: { 'PUBLICATION-AUTHORITY': 'owner, date' } }, '1.0', 'docs/_legal/X.md', SHA), /PRIVACY-PUBLISHABLE has no recorded evidence/);
expect('publishable with every prerequisite met', registerProblems('x', { ...adoptedEntry, state: 'PUBLISHABLE', prerequisitesMet: { 'PUBLICATION-AUTHORITY': 'owner, date', 'PRIVACY-PUBLISHABLE': 'register, date' } }, '1.0', 'docs/_legal/X.md', SHA), null);
// R4 review M1 — adoption is bound to the adopted text, not only the version number.
expect('adopted text changed, same version', registerProblems('x', adoptedEntry, '1.0', 'docs/_legal/X.md', 'b'.repeat(64)), /not the adopted text/);
expect('adopted without a text hash', registerProblems('x', { ...adoptedEntry, ownerAdoptedSha256: undefined }, '1.0', 'docs/_legal/X.md', SHA), /without an ownerAdoptedSha256/);
expect('adopted with a malformed hash', registerProblems('x', { ...adoptedEntry, ownerAdoptedSha256: 'abc' }, '1.0', 'docs/_legal/X.md', 'abc'), /without an ownerAdoptedSha256/);
expect('hash recorded before adoption', registerProblems('x', { ...entry, ownerAdoptedSha256: SHA }, '1.0', 'docs/_legal/X.md', SHA), /only the owner's adoption/);
// R4 review M5/L1 — privacy, when adopted, needs the H4-B intake promoted and does not list itself.
expect('privacy adopted without the H4-B prerequisite', registerProblems('privacy', { ...adoptedEntry, publicationPrerequisites: PRE(['PUBLICATION-AUTHORITY']) }, '1.0', 'docs/_legal/X.md', SHA), /H4-B-INTAKE-PROMOTED/);
expect('privacy adopted with its own prerequisites clean', registerProblems('privacy', { ...adoptedEntry, publicationPrerequisites: PRE(['PUBLICATION-AUTHORITY', 'H4-B-INTAKE-PROMOTED', 'HOSTINGER-PROCESSOR-CHAIN']), prerequisitesMet: { 'RETENTION-ROUTINE-OPERATING': 'cleanup log, date' } }, '1.0', 'docs/_legal/X.md', SHA), null);
// R6 — Privacy 2.2 describes the retention routine as operating, so adoption needs evidence that it does.
expect('privacy adopted while the retention routine is not operating', registerProblems('privacy', { ...adoptedEntry, publicationPrerequisites: PRE(['PUBLICATION-AUTHORITY', 'H4-B-INTAKE-PROMOTED', 'HOSTINGER-PROCESSOR-CHAIN']) }, '1.0', 'docs/_legal/X.md', SHA), /without recorded evidence for RETENTION-ROUTINE-OPERATING/);
expect('privacy adopted with empty retention evidence', registerProblems('privacy', { ...adoptedEntry, publicationPrerequisites: PRE(['PUBLICATION-AUTHORITY', 'H4-B-INTAKE-PROMOTED', 'HOSTINGER-PROCESSOR-CHAIN']), prerequisitesMet: { 'RETENTION-ROUTINE-OPERATING': '  ' } }, '1.0', 'docs/_legal/X.md', SHA), /without recorded evidence for RETENTION-ROUTINE-OPERATING/);
// R10 — the Hostinger chain moved from adoption evidence to a publication prerequisite.
expect('privacy adopted without listing the Hostinger chain prerequisite', registerProblems('privacy', { ...adoptedEntry, publicationPrerequisites: PRE(['PUBLICATION-AUTHORITY', 'H4-B-INTAKE-PROMOTED']), prerequisitesMet: { 'RETENTION-ROUTINE-OPERATING': 'cleanup log, date' } }, '1.0', 'docs/_legal/X.md', SHA), /adopted without the publication prerequisite HOSTINGER-PROCESSOR-CHAIN/);
expect('privacy publishable without Hostinger chain evidence', registerProblems('privacy', { ...adoptedEntry, state: 'PUBLISHABLE', publicationPrerequisites: PRE(['PUBLICATION-AUTHORITY', 'H4-B-INTAKE-PROMOTED', 'HOSTINGER-PROCESSOR-CHAIN']), prerequisitesMet: { 'RETENTION-ROUTINE-OPERATING': 'log', 'PUBLICATION-AUTHORITY': 'owner', 'H4-B-INTAKE-PROMOTED': 'phase' } }, '1.0', 'docs/_legal/X.md', SHA), /HOSTINGER-PROCESSOR-CHAIN has no recorded evidence/);
expect('privacy publishable with existing contractual coverage and every prerequisite met', registerProblems('privacy', { ...adoptedEntry, state: 'PUBLISHABLE', publicationPrerequisites: PRE(['PUBLICATION-AUTHORITY', 'H4-B-INTAKE-PROMOTED', 'HOSTINGER-PROCESSOR-CHAIN']), prerequisitesMet: { 'RETENTION-ROUTINE-OPERATING': 'log', 'PUBLICATION-AUTHORITY': 'owner', 'H4-B-INTAKE-PROMOTED': 'phase', 'HOSTINGER-PROCESSOR-CHAIN': 'R11 authorised corporate use, existing Terms and incorporated DPA, date' } }, '1.0', 'docs/_legal/X.md', SHA), null);
expect('other documents need no retention evidence', registerProblems('terms', adoptedEntry, '1.0', 'docs/_legal/X.md', SHA), null);

// GS-LAUNCH-011: synthetic receipts and text only; the actual register is never promoted.
const directEntry = { ...adoptedEntry, contactMode: 'direct',
  publicationPrerequisites: PRE(['PUBLICATION-AUTHORITY', 'DIRECT-CONTACT-VERIFIED', 'HOSTINGER-PROCESSOR-CHAIN']),
  prerequisitesMet: { 'RETENTION-ROUTINE-OPERATING': 'synthetic retention receipt' } };
assert.deepEqual(requiredPrerequisites('privacy'), ['PUBLICATION-AUTHORITY', 'H4-B-INTAKE-PROMOTED', 'HOSTINGER-PROCESSOR-CHAIN']);
assert.deepEqual(requiredPrerequisites('privacy', 'direct'), ['PUBLICATION-AUTHORITY', 'DIRECT-CONTACT-VERIFIED', 'HOSTINGER-PROCESSOR-CHAIN']);
expect('direct adoption can wait for publication evidence', registerProblems('privacy', directEntry, '1.0', 'docs/_legal/X.md', SHA), null);
expect('direct mode rejects legacy prerequisite', registerProblems('privacy', { ...directEntry,
  publicationPrerequisites: PRE(['PUBLICATION-AUTHORITY', 'H4-B-INTAKE-PROMOTED', 'HOSTINGER-PROCESSOR-CHAIN']) }, '1.0', 'docs/_legal/X.md', SHA), /DIRECT-CONTACT-VERIFIED/);
expect('unknown processing mode', registerProblems('privacy', { ...directEntry, contactMode: 'unknown' }, '1.0', 'docs/_legal/X.md', SHA), /unknown contactMode/);
const directMet = { ...directEntry.prerequisitesMet, 'PUBLICATION-AUTHORITY': 'synthetic owner authority',
  'DIRECT-CONTACT-VERIFIED': 'synthetic exact-source/contact/legal receipt', 'HOSTINGER-PROCESSOR-CHAIN': 'synthetic coverage receipt' };
for (const id of ['PUBLICATION-AUTHORITY', 'DIRECT-CONTACT-VERIFIED', 'HOSTINGER-PROCESSOR-CHAIN']) {
  for (const evidence of [undefined, '  ']) expect(`direct publication requires ${id}`, registerProblems('privacy', {
    ...directEntry, state: 'PUBLISHABLE', prerequisitesMet: { ...directMet, [id]: evidence } }, '1.0', 'docs/_legal/X.md', SHA), new RegExp(`${id} has no recorded evidence`));
}
expect('direct publication with synthetic complete evidence', registerProblems('privacy', { ...directEntry, state: 'PUBLISHABLE', prerequisitesMet: directMet }, '1.0', 'docs/_legal/X.md', SHA), null);
expect('direct mode still needs retention evidence', registerProblems('privacy', { ...directEntry, prerequisitesMet: {} }, '1.0', 'docs/_legal/X.md', SHA), /RETENTION-ROUTINE-OPERATING/);
expect('direct mode still needs adopted fingerprint', registerProblems('privacy', directEntry, '1.0', 'docs/_legal/X.md', 'b'.repeat(64)), /not the adopted text/);
const directPrivacy = 'Hostinger. Information Commission. The public website has no enquiry form. Contact links let you send an email or WhatsApp message through your chosen service.';
const directFacts = { ...facts, contactMode: 'direct' };
expect('synthetic direct privacy needs no fictitious intake region/provider', parityProblems(directPrivacy, cookies, directFacts), null);
expect('old adopted privacy is not direct-contact accurate', parityProblems(previousPrivacy, cookies, directFacts), /inactive website intake/);
for (const currentClaim of ['**Supabase** receives website enquiries', '**Resend** sends internal enquiry notifications',
  'enquiries are stored in Ireland', 'website and form providers', 'submission references used to prevent duplicates']) {
  expect(`direct privacy rejects ${currentClaim}`, parityProblems(directPrivacy + currentClaim, cookies, directFacts), /inactive website intake/);
}
for (const phrase of ['website has no enquiry form', 'email or WhatsApp message']) {
  expect(`direct privacy requires ${phrase}`, parityProblems(directPrivacy.replace(phrase, ''), cookies, directFacts), /direct-contact channels or no-form/);
}
for (const channel of ['SMS', 'text message', 'text-message']) {
  expect(`direct privacy rejects withdrawn ${channel}`, parityProblems(directPrivacy + ' ' + channel, cookies, directFacts), /direct-contact channels or no-form/);
}
expect('direct privacy still names hosting', parityProblems(directPrivacy.replace('Hostinger', ''), cookies, directFacts), /does not name Hostinger/);
const directAccessibility = 'Contact us by email at contact@gridsmith.uk, or through the WhatsApp link on our contact pages. The website does not use enquiry forms. Email remains available if a messaging service is unavailable or inaccessible.';
expect('direct accessibility specimen', directContactAccessibilityProblems(directAccessibility), null);
expect('old form accessibility refused', directContactAccessibilityProblems(previous('accessibility-statement.md')), /direct-contact alternative/);
for (const phrase of ['website does not use enquiry forms', 'contact@gridsmith.uk', 'WhatsApp link']) {
  expect(`direct accessibility requires ${phrase}`, directContactAccessibilityProblems(directAccessibility.replace(phrase, '')), /direct-contact alternative/);
}
for (const channel of ['SMS', 'text message', 'text-message']) {
  expect(`direct accessibility rejects withdrawn ${channel}`, directContactAccessibilityProblems(directAccessibility + ' ' + channel), /direct-contact alternative/);
}
// Exact proposals and predecessor snapshots remain permanent subjects after adoption.
const proposedPrivacy = read('proposed/GS-LAUNCH-013/privacy-policy-2.7.md');
const proposedAccessibility = read('proposed/GS-LAUNCH-013/accessibility-statement-2.4.md');
const proposedConsumer = read('proposed/GS-LAUNCH-013/client-terms-consumers-3.4.md');
assert.equal(proposedPrivacy, read('proposed/GS-LAUNCH-012/privacy-policy-2.7.md'));
assert.equal(proposedAccessibility, read('proposed/GS-LAUNCH-012/accessibility-statement-2.4.md'));
assert.equal(previousConsumer.split('WhatsApp or text').length - 1, 2);
assert.equal(proposedConsumer, previousConsumer.replace('**Version 3.3**', '**Version 3.4**')
  .replace('**Review date: 22 October 2026**', '**Review date: 25 October 2026**')
  .replaceAll('WhatsApp or text', 'WhatsApp'));
assert.match(proposedConsumer, /phone or video call/);
const previousRegister = JSON.parse(previous('GS-O003-R-REGISTER.json'));
const actualConsumerEntry = previousRegister.documents['consumer-client-terms'];
assert.throws(() => assertAdoptedSource('consumer-client-terms', actualConsumerEntry, proposedConsumer), /differs from the exact owner-adopted text/);
expect('Privacy 2.7 proposal direct parity', parityProblems(proposedPrivacy, cookies, directFacts), null);
expect('Accessibility 2.4 proposal direct parity', directContactAccessibilityProblems(proposedAccessibility), null);
for (const [slug, proposal] of [['privacy', proposedPrivacy], ['accessibility', proposedAccessibility], ['consumer-client-terms', proposedConsumer]]) {
  expect(`${slug} proposed draft rules`, draftProblems(slug, proposal), null);
  expect(`${slug} proposed instrument rules`, instrumentProblems(slug, proposal), null);
}
assert.match(proposedPrivacy, /historical/i);
for (const disclosure of ['Supabase', 'Resend', 'developer-created backups', 'provider-managed backups', 'owner or sales department', 'no current overseas access', 'require verification']) assert(proposedPrivacy.includes(disclosure), disclosure);
assert.match(proposedPrivacy, /not represented as automated/);
assert.match(proposedAccessibility, /comprehensive assistive-technology and screen-reader audit.*has not been completed/);
expect('proposed consumer cannot use current workflow version', coordinatedReviewProblems({ ...coordinated, privacy: proposedPrivacy, 'consumer-client-terms': proposedConsumer }, previousWorkflow), /current consumer version/);
expect('future workflow version-only correction suffices', coordinatedReviewProblems({ ...coordinated, privacy: proposedPrivacy, 'consumer-client-terms': proposedConsumer }, previousWorkflow.replaceAll('Consumers version 3.3', 'Consumers version 3.4').replaceAll('Consumers 3.3 (attached)', 'Consumers 3.4 (attached)')), null);
expect('contradictory direct accessibility refused', directContactAccessibilityProblems(directAccessibility + ' Our enquiry forms need JavaScript.'), /direct-contact alternative/);

// GS-LAUNCH-014: fixed owner hashes and predecessor evidence are independent expectations.
const currentRegister = JSON.parse(read('evidence/GS-O003-R-REGISTER.json'));
const approvedHashes = {
  privacy: '822dd473c253e7d031e18cf6c439ace13817f270d9fd9e1898d9b8c5fc4549a3',
  accessibility: '774b1e200e67d146b0375b12c3fd4fadb3aeb0e27b87ea53bd0b419557984708',
  'consumer-client-terms': 'a73f6df89b681721ebd97e841803327e8e91caabd1da0a90edbf204d590a0d5e',
};
assert.equal(createHash('sha256').update(previous('GS-O003-R-REGISTER.json')).digest('hex'), '4663ca333058dd5ee47dcf018571386be05737d7e53fa18c22956d114cee282e');
for (const [slug, e] of Object.entries(currentRegister.documents)) {
  const text = readFileSync(e.draft);
  assert.equal(createHash('sha256').update(text).digest('hex'), approvedHashes[slug] ?? previousRegister.documents[slug].ownerAdoptedSha256);
  assert(['OWNER_ADOPTED', 'PUBLISHABLE'].includes(e.state));
  expect(`${slug} current publication evidence`, registerProblems(slug, e,
    parseDraft(text.toString()).version, e.draft, createHash('sha256').update(text).digest('hex')), null);
  if (approvedHashes[slug]) {
    assert.equal(e.ownerAdoptedSha256, approvedHashes[slug]);
    assert.equal(e.ownerAdoptedOn, '2026-10-25');
    const old = previousRegister.documents[slug];
    const oldText = previous(old.draft.split('/').at(-1));
    assert.equal(createHash('sha256').update(oldText).digest('hex'), old.ownerAdoptedSha256);
    assert.throws(() => assertAdoptedSource(slug, old, text), /differs from the exact owner-adopted text/);
    assert.throws(() => assertAdoptedSource(slug, e, oldText), /differs from the exact owner-adopted text/);
  } else {
    const adoption = { ...e }, oldAdoption = { ...previousRegister.documents[slug] };
    for (const field of ['state', 'prerequisitesMet']) { delete adoption[field]; delete oldAdoption[field]; }
    assert.deepEqual(adoption, oldAdoption);
  }
}
assert.equal(currentRegister.previousAdoptionRegister, 'docs/_legal/evidence/GS-LAUNCH-014-superseded/GS-O003-R-REGISTER.json');
assert.equal(currentRegister.documents.privacy.contactMode, 'direct');
assert.equal(allLegalPublishable(Array(7).fill('OWNER_ADOPTED')), false);
expect('adopted workflow coordinated', coordinatedReviewProblems(coordinated, workflow), null);
expect('stale confirmation version', coordinatedReviewProblems(coordinated, swap(workflow, 'Consumers 3.4 (attached)', 'Consumers 3.3 (attached)')), /current consumer version/);
assert.equal(createHash('sha256').update(read('evidence/GS-LAUNCH-014-OWNER-AUTHORITY.md')).digest('hex'), '8c0596b49763c11ddd0dbaa5954718b883946a57cef3c61ebb132140ee662497');
const workflowBody = text => text.slice(text.indexOf('## 1. Operating rules'));
assert.equal(workflowBody(workflow), workflowBody(previousWorkflow)
  .replaceAll('Consumers version 3.3', 'Consumers version 3.4').replaceAll('Consumers 3.3', 'Consumers 3.4')
  .replaceAll('WhatsApp/text only', 'WhatsApp only').replaceAll('WhatsApp or text', 'WhatsApp'));
assert.equal(consumer, proposedConsumer);
assert.equal(privacy, proposedPrivacy);
assert.equal(read('current/accessibility-statement.md'), proposedAccessibility);

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
// The live register must stay coherent at either authorised publication stage.
expect('live register cross-coherent', crossRegisterProblems(JSON.parse(readFileSync('docs/_legal/evidence/GS-O003-R-REGISTER.json', 'utf8')).documents), null);

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
// GS-LAUNCH-026 cross-references: served words unchanged, every refusal by its own branch.
{
  cases += 1;
  const d = parseDraft(head + '## 1. A\n\nSee our [Privacy Policy](/legal/privacy) and **[contact@gridsmith.uk](mailto:contact@gridsmith.uk)**.\n');
  const got = JSON.stringify([d.clauses[0].paragraphs, d.clauses[0].links]);
  const want = JSON.stringify([['See our Privacy Policy and contact@gridsmith.uk.'], [
    { paragraph: 0, start: 8, end: 22, href: '/legal/privacy' }, { paragraph: 0, start: 27, end: 47, href: 'mailto:contact@gridsmith.uk' }]]);
  if (got !== want) { failures += 1; console.error(`  FAIL link parse shape: ${got}`); }
}
throws('unapproved link target', head + '## 1. A\n\nSee [x](https://example.com/).\n', /not an approved legal cross-reference/);
throws('repeated link target', head + '## 1. A\n\n[a](/contact) and [b](/contact).\n', /linked twice/);
throws('link in a heading', head + '## 1. [A](/contact)\n\nx\n', /links are not supported in a heading/);
throws('link in a table', head + '## 1. A\n\n| [a](/contact) | b |\n', /links are not supported in a table/);
throws('malformed link', head + '## 1. A\n\n[a](/contact space).\n', /malformed link syntax/);
{
  const clauses = parseDraft(head + '## 1. A\n\nRead the [Cookie Policy](/legal/cookies).\n').clauses;
  assert.throws(() => assertNoSelfLink('cookies', clauses), /links to itself/);
  assert.doesNotThrow(() => assertNoSelfLink('privacy', clauses));
  cases += 2;
}

// Owner adoption does not backdate the separately authorised cutover.
const boundText = 'Exact synthetic adopted text';
const boundEntry = { state: 'OWNER_ADOPTED', ownerAdoptedSha256: createHash('sha256').update(boundText).digest('hex') };
assert.doesNotThrow(() => assertAdoptedSource('specimen', boundEntry, boundText));
assert.throws(() => assertAdoptedSource('specimen', boundEntry, boundText + ' changed'), /differs from the exact owner-adopted text/);
assert.doesNotThrow(() => assertAdoptedSource('specimen', { state: 'OWNER_REVIEW_REQUIRED' }, boundText));
assert.equal(allLegalPublishable(Array(7).fill('PUBLISHABLE')), true);
assert.equal(allLegalPublishable(Array(6).fill('PUBLISHABLE')), false);
assert.equal(allLegalPublishable([...Array(6).fill('PUBLISHABLE'), 'OWNER_ADOPTED']), false);
cases += 6;
const publicationHeader = '**Effective date: On first publication with the replacement website at gridsmith.uk**';
const publicationParsed = parseDraft(consumer);
expect('publication trigger parsed', publicationParsed.effectiveOnPublication && publicationParsed.effective === null && publicationParsed.drafted === '2026-10-25' ? [] : ['bad commencement'], null);
expect('adopted before publication event', stateProblems('c', 'OWNER_ADOPTED', consumer, 's', '2026-10-22'), null);
expect('publishable commencement remains future', stateProblems('c', 'PUBLISHABLE', consumer, 's', '2026-10-22'), null);
throws('malformed commencement rejected', consumer.replace(publicationHeader, '**Effective date: whenever approved**'), /unreadable effective date/);

if (failures) {
  console.error(`\ncheck-legal-adoption.selftest: ${failures} of ${cases} case(s) failed`);
  process.exitCode = 1;
} else {
  console.log(`check-legal-adoption.selftest: ${cases} case(s), every branch fired and every control stayed clean`);
}
