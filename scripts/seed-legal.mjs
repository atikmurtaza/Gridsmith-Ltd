/**
 * The seven legal documents, **generated from `docs/_legal/` at import time** — one draft per
 * slug, including the client-terms applicability page.
 *
 * ## This file is no longer a transcription (`GS-LEGAL-001`, 6 October 2026)
 *
 * Until 6 October 2026 every clause here was a hand-made, word-for-word transcription of the
 * matching draft, and before 29 August 2026 it was an independently written second document
 * set that had drifted from the drafts (`07-STATE-REPORT.md` F-1 to F-7, `CLAUDE.md` on two
 * documents that must agree). The transcription rule closed that gap by discipline; this file
 * closes it by construction. `parseDraft` reads each draft and produces the clauses, so there
 * is one authored text and nothing to keep in step with it.
 *
 * What stays true: `scripts/check-legal-parity.mjs` still compares the **served pages** with the
 * drafts, because a correct seed proves nothing about a dataset that was never reseeded — the
 * other half of F-1.
 *
 * ## The draft format the parser accepts — and refuses
 *
 * - `# Title` — the document title.
 * - `**Version X.Y**` — required. `**Effective date: D Month YYYY**` once adopted, otherwise
 *   `**Draft date: D Month YYYY**`.
 * - Everything before the first numbered `##` heading is the identity header and is not served
 *   (the footer carries the statutory particulars on every page).
 * - `## N. Heading` / `## NA. Heading` / `### N.N Heading` — one served clause each. The anchor is
 *   `clause-` plus the number with dots as hyphens, so `10.1` is `#clause-10-1`, which `/press`
 *   links into and `scripts/check-consumer-terms.mjs` asserts.
 * - A paragraph, a list item, a hard-broken line (trailing backslash or two spaces) or a table row is one
 *   served paragraph. Table cells are joined with an em dash. Markdown emphasis and backticks
 *   are removed; no word is added or reordered.
 * - An unnumbered heading after the first clause, a duplicate clause number, or a missing
 *   title or version **throws**, so every importer (seed, migration, parity gate) fails loudly
 *   rather than serving a partial document.
 *
 * ## No public `Basis:` line
 *
 * The old transcription carried a hand-written citation per clause and the route printed it.
 * Two of those citations were stale on a public legal page (a revoked 2008 instrument; "retained"
 * EU law), and the drafts never carried them (`GS-LEGAL-001` F, S-1 to S-3). The citations now live
 * in the research record, `git:a7b931c10eb2a543bfa43e89954555fdadb7072d:docs/_archive/legal/pre-GS-LEGAL-FINAL-001/research/GS-LEGAL-001/`, where they are dated and sourced,
 * and the route no longer renders `basis`.
 *
 * ## Adoption state comes from the `GS-O003-R` register
 *
 * `adoptionState` is read from `docs/_legal/evidence/GS-O003-R-REGISTER.json`, the same file the production
 * migration reads. A register that says a document was adopted at a version the draft no longer
 * carries throws: a draft edited after adoption is not the adopted document.
 */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const read = (path) => readFileSync(path, 'utf8');

/**
 * slug → the `docs/_legal/` draft it is generated from.
 *
 * Exported for `scripts/check-legal-parity.mjs`, which uses it only to pair a route with a file.
 * Every public route has one canonical source, including the applicability page.
 */
export const LEGAL_DRAFT_SOURCES = {
  privacy: 'current/privacy-policy.md',
  cookies: 'current/cookie-policy.md',
  terms: 'current/website-terms.md',
  'client-terms': 'current/client-terms-applicability.md',
  'business-client-terms': 'current/client-terms-business.md',
  'consumer-client-terms': 'current/client-terms-consumers.md',
  accessibility: 'current/accessibility-statement.md',
};

const REGISTER = JSON.parse(read('docs/_legal/evidence/GS-O003-R-REGISTER.json'));

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
  'september', 'october', 'november', 'december'];

/** `6 October 2026` → `2026-10-06`; anything else → null. */
export function isoDate(text) {
  const m = String(text ?? '').match(/^\s*(\d{1,2}) ([A-Za-z]+) (\d{4})\s*$/);
  const month = m ? MONTHS.indexOf(m[2].toLowerCase()) : -1;
  if (month < 0) return null;
  return `${m[3]}-${String(month + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

const plain = (s) => s.replace(/\*\*/g, '').replace(/`/g, '').replace(/\s+/g, ' ').trim();

/**
 * A draft → `{ title, version, effective, drafted, clauses: [{ number, heading, paragraphs }] }`.
 *
 * @param {string} markdown
 * @param {string} [name] for error messages
 */
export function parseDraft(markdown, name = 'draft') {
  const lines = markdown.replace(/\r/g, '').split('\n');
  const title = lines.find((l) => /^# /.test(l))?.slice(2).trim();
  const version = markdown.match(/^\*\*Version ([0-9]+\.[0-9]+)\*\*/m)?.[1];
  const effectiveText = markdown.match(/^\*\*Effective date: ([^*]+)\*\*/m)?.[1];
  const draftedText = markdown.match(/^\*\*(?:Draft|Review) date: ([^*]+)\*\*/m)?.[1];
  const effectiveOnPublication = effectiveText === 'On first publication with the replacement website at gridsmith.uk';
  if (!title) throw new Error(`${name}: no "# Title" line`);
  if (!version) throw new Error(`${name}: no "**Version X.Y**" line`);
  const effective = effectiveText ? isoDate(effectiveText) : null;
  const drafted = draftedText ? isoDate(draftedText) : null;
  if (effectiveText && !effective && !effectiveOnPublication) throw new Error(`${name}: unreadable effective date "${effectiveText}"`);
  if (draftedText && !drafted) throw new Error(`${name}: unreadable draft date "${draftedText}"`);
  if (!effective && !drafted) throw new Error(`${name}: no effective or draft date`);

  const clauses = [];
  let current = null;
  let para = [];
  let inTable = false;
  const flush = () => {
    if (para.length) current.paragraphs.push(plain(para.join(' ')));
    para = [];
  };

  for (const line of lines) {
    const heading = line.match(/^(?:##|###) ([0-9]+[A-Z]?(?:\.[0-9]+)*)\.? (.+)$/);
    if (heading) {
      if (current) flush();
      inTable = false;
      if (clauses.some((c) => c.number === heading[1])) throw new Error(`${name}: clause ${heading[1]} appears twice`);
      current = { number: heading[1], heading: plain(heading[2]), paragraphs: [] };
      clauses.push(current);
      continue;
    }
    if (!current) continue; // identity header
    if (/^#{1,6} /.test(line)) throw new Error(`${name}: unnumbered heading inside the document: "${line}"`);
    if (!line.trim()) {
      flush();
      inTable = false;
      continue;
    }
    if (/^\s*\|/.test(line)) {
      flush();
      const cells = line.trim().replace(/^\||\|$/g, '').split('|').map(plain);
      if (inTable && cells.every((c) => /^:?-+:?$/.test(c))) continue; // separator row
      inTable = true;
      current.paragraphs.push(cells.filter(Boolean).join(' — '));
      continue;
    }
    const hardBreak = /(?: {2}|\\)$/.test(line); // a markdown hard break ends the paragraph
    const text = line.replace(/\\$/, '');
    const item = text.match(/^(?:[-*]|\d+\.) (.*)$/);
    if (item) {
      flush();
      para.push(item[1]);
    } else {
      para.push(text);
    }
    if (hardBreak) flush();
  }
  if (current) flush();
  if (clauses.length === 0) throw new Error(`${name}: no numbered clause`);
  return { title, version, effective, drafted, effectiveOnPublication, clauses };
}

const blocks = (prefix, paragraphs) =>
  paragraphs.map((text, i) => ({
    _type: 'block',
    _key: `${prefix}-b${i}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${prefix}-s${i}`, text, marks: [] }],
  }));

/** Register entry → the state the page shows, refusing an adoption the draft no longer matches. */
function adoption(slug, version) {
  const entry = REGISTER.documents?.[slug];
  if (!entry) throw new Error(`GS-O003-R register has no entry for ${slug}`);
  const adopted = entry.state === 'OWNER_ADOPTED' || entry.state === 'PUBLISHABLE';
  if (adopted && entry.ownerAdoptedVersion !== version) {
    throw new Error(
      `${slug}: the register records adoption of version ${entry.ownerAdoptedVersion}, but the draft is ` +
        `at ${version}. A draft changed after adoption is not the adopted document.`,
    );
  }
  return {
    adoptionState: entry.state,
    ownerAdoptedOn: adopted ? entry.ownerAdoptedOn : null,
    reviewedBy: adopted ? `Adopted by Gridsmith Ltd on ${entry.ownerAdoptedOn}` : 'Under review by Gridsmith Ltd',
  };
}

const shape = (slug, { title, version, effective, drafted, effectiveOnPublication = false, clauses }, summary) => ({
  _id: `seed-legal-${slug}`,
  _type: 'legalDocument',
  slug: { _type: 'slug', current: slug },
  title,
  version,
  effectiveFrom: effectiveOnPublication ? null : effective ?? drafted,
  effectiveOnPublication,
  lastReviewed: drafted ?? effective,
  ...adoption(slug, version),
  summary,
  clauses: clauses.map(({ number, heading, paragraphs }, i) => ({
    _type: 'legalClause',
    _key: `${slug}-c${i}`,
    number,
    heading,
    // Contracts cite these. Renumbering is a version bump plus a redirect, never an edit.
    anchorId: `clause-${number.replace(/\./g, '-')}`,
    body: blocks(`${slug}${i}`, paragraphs),
  })),
  isSeed: true,
});

export function assertAdoptedSource(slug, entry, markdown) {
  if (['OWNER_ADOPTED', 'PUBLISHABLE'].includes(entry?.state) &&
      createHash('sha256').update(markdown).digest('hex') !== entry.ownerAdoptedSha256) {
    throw new Error(`${slug}: canonical source differs from the exact owner-adopted text`);
  }
}

const fromDraft = (slug, summary) => {
  const file = LEGAL_DRAFT_SOURCES[slug];
  const markdown = read(`docs/_legal/${file}`);
  assertAdoptedSource(slug, REGISTER.documents?.[slug], markdown);
  return shape(slug, parseDraft(markdown, file), summary);
};

const privacy = fromDraft(
  'privacy',
  'How Gridsmith Ltd collects and uses personal data through this website, enquiries and client work: who processes it, where, for how long, and how to exercise your rights.',
);

const cookies = fromDraft(
  'cookies',
  'The essential acknowledgement cookie and the separate consent, provider and deletion controls required before optional analytics can begin.',
);

const terms = fromDraft(
  'terms',
  'The terms for using gridsmith.uk. Paid work is governed by a written quotation and the client terms, not by these.',
);

const businessClientTerms = fromDraft(
  'business-client-terms',
  'The terms for paid work for businesses and anyone buying for a trade, business, craft or profession. Each project is defined by a written Scope that is accepted before any payment is requested.',
);

const consumerClientTerms = fromDraft(
  'consumer-client-terms',
  'The terms for paid work for individuals buying outside a trade, business, craft or profession: how a quotation is accepted, your 14-day right to cancel, and what you pay if a project ends early. Consumer law gives you rights these terms cannot take away.',
);

const accessibility = fromDraft(
  'accessibility',
  'How accessible gridsmith.uk is, what has and has not been tested, the known limitations, and how to ask for help or an alternative format.',
);

/**
 * `/legal/client-terms` — the disambiguation page, and the reason there is no redirect.
 *
 * The old path was published and is cited. It must not 404, and it must not be redirected: a
 * redirect has to choose a target, and either choice silently delivers one audience the other
 * audience's instrument. So the path survives carrying no operative clause. It says which
 * document governs whom, and the "other documents" list at the foot of the page links to both.
 *
 * It now has a canonical source and the same word-for-word parity coverage as the six
 * instruments. The old hand-authored seed content is retained in Git history.
 */
const clientTermsDisambiguation = fromDraft('client-terms',
  'Which client terms apply depends on the purpose of your purchase, including whether an individual is buying wholly or mainly outside a trade, business, craft or profession. Your quotation identifies the applicable version.');

export const LEGAL_DOCUMENTS = [
  privacy,
  cookies,
  terms,
  clientTermsDisambiguation,
  businessClientTerms,
  consumerClientTerms,
  accessibility,
];
