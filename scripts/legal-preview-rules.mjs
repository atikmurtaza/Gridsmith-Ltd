/** R12: private review is a build profile, never a publication state or CMS write. */
import { isDeepStrictEqual } from 'node:util';
import { createHash } from 'node:crypto';
import { REVIEW_STAGING_ORIGIN } from '../lib/reviews/public-model.ts';
import { ownerPreviewIdentityAllowed, productionIdentityAllowed } from '../lib/build/target.ts';
import { LEGAL_DOCUMENT_SLUGS } from '../lib/legal/slugs.ts';

/** Production must exercise the same seven legal routes as a legal preview. */
export function servedLegalRoutes(deployment, preview) {
  return preview || productionIdentityAllowed(deployment) ? LEGAL_DOCUMENT_SLUGS.map(slug => `/legal/${slug}`) : [];
}

export function legalPreviewProfile(value, dataset, origin) {
  if (value === undefined) return false;
  if (value === 'adopted-owner' && dataset === 'production' && origin === REVIEW_STAGING_ORIGIN) return true;
  if (value !== 'adopted-development' || dataset !== 'development' ||
      !/^http:\/\/(?:localhost|127\.0\.0\.1):[0-9]+$/.test(origin)) {
    throw new Error('Legal preview requires adopted-development on loopback, or adopted-owner with production content on the exact authorised temporary origin');
  }
  return true;
}

/** The browser must ask the served system; missing identity is never a default profile. */
export function servedLegalPreview(deployment, required = false) {
  if (!deployment || typeof deployment !== 'object') throw new Error('Static artifact must identify its served profile');
  const preview = deployment.legalPreview === true;
  const owner = ownerPreviewIdentityAllowed(deployment);
  if ((deployment.profile === 'owner-preview' && !owner) || (required && !preview) ||
      (preview && !owner && (deployment.dataset !== 'development' || deployment.profile !== undefined))) {
    throw new Error('R12 requires the served adopted-development artifact');
  }
  return preview;
}

/** Browser-side disclosure, scoped to visible labels in the document, not script/Flight text. */
export function readLegalPreviewDisclosure() {
  return [...document.querySelectorAll('main p > span')]
    .filter(el => ['NOT YET ADOPTED.', 'ADOPTED, NOT YET PUBLISHED.'].includes(el.textContent.trim()))
    .map(el => ({ text: el.textContent.trim(), visible: el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) &&
      !el.closest('[hidden], [aria-hidden="true"]') && el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0 }));
}

export function legalPreviewDisclosureValid(disclosure, expected) {
  return disclosure.length === 1 && disclosure[0].text === expected && disclosure[0].visible;
}

/** Full generated content, not a CMS assertion that it is approved. Order of object keys is immaterial. */
export function legalPreviewProblems(actual, expected, register, readDraft) {
  const problems = [];
  if (actual.length !== 7 || expected.length !== 7) problems.push('Legal preview requires exactly seven documents');
  for (const doc of expected) {
    const slug = doc.slug.current, entry = register.documents?.[slug];
    const matches = actual.filter((item) => item.slug?.current === slug);
    if (matches.length !== 1) { problems.push(`${slug}: missing or duplicate development document`); continue; }
    if (!entry || !['OWNER_ADOPTED', 'PUBLISHABLE'].includes(entry.state) ||
        entry.ownerAdoptedVersion !== doc.version) problems.push(`${slug}: exact version is not owner-adopted`);
    const source = entry?.draft ? readDraft(entry.draft) : JSON.stringify({ title: doc.title,
      version: doc.version, effectiveFrom: doc.effectiveFrom, summary: doc.summary, clauses: doc.clauses });
    if (createHash('sha256').update(source).digest('hex') !== entry?.ownerAdoptedSha256) {
      problems.push(`${slug}: adopted fingerprint mismatch`);
    }
    const found = matches[0];
    for (const field of Object.keys(doc)) {
      if (!isDeepStrictEqual(found[field], doc[field])) problems.push(`${slug}: development content mismatch (${field})`);
    }
  }
  return problems;
}
