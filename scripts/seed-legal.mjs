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
 * - `[visible words](target)` in a paragraph or list item is a cross-reference (`GS-LAUNCH-026`). The
 *   visible words are served exactly as written and become a link only when the target is in
 *   `LEGAL_LINK_TARGETS`; any other target, a link in a heading or table, a repeated target in one
 *   paragraph, or a document linking to itself **throws**. The served text is identical to the
 *   same draft without the link syntax.
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

/** The only destinations a legal cross-reference may name: the seven documents, contact, the regulator. */
export const LEGAL_LINK_TARGETS = Object.freeze([
  ...Object.keys(LEGAL_DRAFT_SOURCES).map((slug) => `/legal/${slug}`),
  '/contact',
  'mailto:contact@gridsmith.uk',
  'https://ico.org.uk/',
]);
const LINK = /\[([^[\]\n]+)\]\(([^()\s]+)\)/g;

/**
 * One served paragraph: its words, and the character range of each allowlisted link within them.
 * Link syntax that does not parse, or names another destination, throws rather than serving
 * brackets or an unreviewed URL.
 */
function inline(source, name) {
  const s = plain(source);
  const links = [];
  let text = '';
  let at = 0;
  for (const m of s.matchAll(LINK)) {
    if (!LEGAL_LINK_TARGETS.includes(m[2])) throw new Error(`${name}: link target "${m[2]}" is not an approved legal cross-reference`);
    if (links.some((l) => l.href === m[2])) throw new Error(`${name}: "${m[2]}" is linked twice in one paragraph`);
    text += s.slice(at, m.index);
    links.push({ start: text.length, end: text.length + m[1].length, href: m[2] });
    text += m[1];
    at = m.index + m[0].length;
  }
  text += s.slice(at);
  if (/\]\(/.test(text)) throw new Error(`${name}: malformed link syntax in "${text.slice(0, 80)}"`);
  return { text, links };
}

/**
 * A draft → `{ title, version, effective, drafted, clauses: [{ number, heading, paragraphs }] }`.
 * A clause with cross-references also carries `links: [{ paragraph, start, end, href }]`.
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
    if (para.length) {
      const { text, links } = inline(para.join(' '), name);
      current.paragraphs.push(text);
      if (links.length) (current.links ??= []).push(...links.map((l) => ({ paragraph: current.paragraphs.length - 1, ...l })));
    }
    para = [];
  };
  const unlinked = (text, where) => {
    if (/\]\(/.test(text)) throw new Error(`${name}: links are not supported in ${where}: "${text.slice(0, 80)}"`);
    return plain(text);
  };

  for (const line of lines) {
    const heading = line.match(/^(?:##|###) ([0-9]+[A-Z]?(?:\.[0-9]+)*)\.? (.+)$/);
    if (heading) {
      if (current) flush();
      inTable = false;
      if (clauses.some((c) => c.number === heading[1])) throw new Error(`${name}: clause ${heading[1]} appears twice`);
      current = { number: heading[1], heading: unlinked(heading[2], 'a heading'), paragraphs: [] };
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
      const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => unlinked(cell, 'a table'));
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

/** One block per paragraph. A paragraph without links keeps the single-span shape it always had. */
const blocks = (prefix, paragraphs, links = []) =>
  paragraphs.map((text, i) => {
    const own = links.filter((l) => l.paragraph === i);
    const span = (n, part, marks = []) => ({ _type: 'span', _key: `${prefix}-s${i}${n ? `-${n}` : ''}`, text: part, marks });
    if (!own.length) return { _type: 'block', _key: `${prefix}-b${i}`, style: 'normal', markDefs: [], children: [span(0, text)] };
    const children = [];
    const markDefs = [];
    let at = 0;
    for (const l of own) {
      if (l.start > at) children.push(span(children.length, text.slice(at, l.start)));
      const key = `${prefix}-l${i}-${markDefs.length}`;
      markDefs.push({ _type: 'link', _key: key, href: l.href });
      children.push(span(children.length, text.slice(l.start, l.end), [key]));
      at = l.end;
    }
    if (at < text.length) children.push(span(children.length, text.slice(at)));
    return { _type: 'block', _key: `${prefix}-b${i}`, style: 'normal', markDefs, children };
  });

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

/** A page never links to itself: the reader is already there. */
export function assertNoSelfLink(slug, clauses) {
  if (clauses.some((c) => c.links?.some((l) => l.href === `/legal/${slug}`))) throw new Error(`${slug}: links to itself`);
}

const shape = (slug, { title, version, effective, drafted, effectiveOnPublication = false, clauses }, summary,
  state = adoption(slug, version)) => {
  assertNoSelfLink(slug, clauses);
  return {
    _id: `seed-legal-${slug}`,
    _type: 'legalDocument',
    slug: { _type: 'slug', current: slug },
    title,
    version,
    effectiveFrom: effectiveOnPublication ? null : effective ?? drafted,
    effectiveOnPublication,
    lastReviewed: drafted ?? effective,
    ...state,
    summary,
    clauses: clauses.map(({ number, heading, paragraphs, links }, i) => ({
      _type: 'legalClause',
      _key: `${slug}-c${i}`,
      number,
      heading,
      // Contracts cite these. Renumbering is a version bump plus a redirect, never an edit.
      anchorId: `clause-${number.replace(/\./g, '-')}`,
      body: blocks(`${slug}${i}`, paragraphs, links),
    })),
    isSeed: true,
  };
};

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

/**
 * `GS-LAUNCH-026`: the revision set offered for owner re-adoption, under `docs/_legal/proposed/`.
 * `null` once it is adopted (its files then replace `current/` under a new register entry) or
 * withdrawn. Only an owner-preview build may serve it; the production profile refuses it.
 */
export const ACTIVE_LEGAL_PROPOSAL = 'GS-LAUNCH-026';

const ORDER = LEGAL_DOCUMENTS.map((doc) => doc.slug.current);
const newer = (a, b) => {
  const [x, y] = a.split('.').map(Number), [p, q] = b.split('.').map(Number);
  return x > p || (x === p && y > q);
};

/**
 * The active proposal as served documents, in `LEGAL_DOCUMENTS` order, each at
 * `OWNER_REVIEW_REQUIRED` so the page says "NOT YET ADOPTED". Every file must match its manifest
 * hash and version, and every entry must revise the register's current adoption of that slug: a
 * proposal written against an adoption that has since changed throws instead of being shown.
 */
export function legalProposalDocuments(id) {
  if (!id || id !== ACTIVE_LEGAL_PROPOSAL) throw new Error(`Unknown legal proposal ${JSON.stringify(id)}`);
  const dir = `docs/_legal/proposed/${id}`;
  const manifest = JSON.parse(read(`${dir}/PROPOSAL.json`));
  if (manifest.proposal !== id || JSON.stringify(Object.keys(manifest.documents ?? {}).sort()) !== JSON.stringify([...ORDER].sort())) {
    throw new Error(`${id}: the proposal must revise exactly the seven legal documents`);
  }
  return ORDER.map((slug) => {
    const entry = manifest.documents[slug];
    const adopted = REGISTER.documents?.[slug];
    const markdown = read(`${dir}/${entry.file}`);
    const parsed = parseDraft(markdown, `${id}/${entry.file}`);
    if (createHash('sha256').update(markdown).digest('hex') !== entry.sha256 || parsed.version !== entry.version) {
      throw new Error(`${id}/${slug}: file does not match its recorded version and fingerprint`);
    }
    if (!['OWNER_ADOPTED', 'PUBLISHABLE'].includes(adopted?.state) || entry.supersedes?.version !== adopted.ownerAdoptedVersion ||
        entry.supersedes?.sha256 !== adopted.ownerAdoptedSha256 || !newer(entry.version, adopted.ownerAdoptedVersion)) {
      throw new Error(`${id}/${slug}: does not revise the register's current adoption`);
    }
    if (typeof entry.summary !== 'string' || !entry.summary.trim()) throw new Error(`${id}/${slug}: no summary`);
    return shape(slug, parsed, entry.summary,
      { adoptionState: 'OWNER_REVIEW_REQUIRED', ownerAdoptedOn: null, reviewedBy: 'Proposed revision under review by Gridsmith Ltd' });
  });
}
