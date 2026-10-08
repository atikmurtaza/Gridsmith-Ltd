/** R12: private review is a build profile, never a publication state or CMS write. */
import { isDeepStrictEqual } from 'node:util';
import { createHash } from 'node:crypto';
import { stagingReviewsAllowed } from '../lib/reviews/public-model.ts';

export function legalPreviewProfile(value, dataset, origin) {
  if (value === undefined) return false;
  if (value !== 'adopted-development' || dataset !== 'development' ||
      !stagingReviewsAllowed('owner-staging', origin) || new URL(origin).origin !== origin) {
    throw new Error('Legal preview requires adopted-development, development dataset and an exact isolated staging origin');
  }
  return true;
}

/** The browser must ask the served system; missing identity is never a default profile. */
export function servedLegalPreview(deployment, required = false) {
  if (!deployment || typeof deployment !== 'object') throw new Error('Static artifact must identify its served profile');
  const preview = deployment.legalPreview === true;
  if ((required && !preview) || (preview && deployment.dataset !== 'development')) {
    throw new Error('R12 requires the served adopted-development artifact');
  }
  return preview;
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
