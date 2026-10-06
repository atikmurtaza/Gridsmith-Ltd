#!/usr/bin/env node
/**
 * migrate-production-cms — the production CMS migration, **dry run by default** (`GS-PROD-001`).
 *
 * ## What it migrates, and from where
 *
 * The payload is built from the **repository sources**, never copied from `development`:
 * `companyDetails` from `seed-company-details.mjs`, the two `groupPage`s and the services from
 * `seed-content.mjs` / `service-content.mjs`. That is what keeps the one stale development string
 * (the About intro's "divisions", `GS-INT-002` F5) out of production — it exists only in the
 * development dataset, and nothing here reads that dataset.
 *
 * Every document gets a **production id** (`service-design-<slug>`, `grouppage-about`, …): no
 * `seed-` prefix, no dot, `isSeed: false`, references rewritten to the production ids. Excluded,
 * each with its gate in the manifest: the Technical services (`GS-X002`; the reference
 * to one from another service is dropped rather than left dangling), every `legalDocument` that
 * is not `PUBLISHABLE` in `docs/_legal/GS-O003-R-REGISTER.json` (`GS-O003-R`, which replaced the
 * solicitor-approval gate `GS-O003` on 6 October 2026 — an adopted document's payload is its
 * `seed-legal.mjs` transcription, held word for word to the draft by `check:legal:parity`),
 * and the types that never migrate (`faq`, `teamMember`, `post` briefs, `testimonial`).
 *
 * ## Modes
 *
 * | Invocation | Effect |
 * |---|---|
 * | *(none)* | Builds the payload, runs the preflight and the selftest, and asserts the committed manifest `docs/_shared/GS-PROD-001-CMS-MANIFEST.json` is what this source produces. Offline; writes nothing. In `verify:static`. |
 * | `--write-manifest` | Regenerates that manifest file (a deliberate act: it is the reviewed migration list). |
 * | `--read-production` | One unauthenticated read of the production dataset's document count. Read-only. |
 * | `--write` / `--rollback` | **The only modes that touch production.** Refused unless *all* of: `--dataset=production`, `GS_PRODUCTION_CMS_CONFIRM=write-production`, `SANITY_API_WRITE_TOKEN`, and `--backup=<file>` naming an existing export. Not run at `GS-PROD-001`. |
 *
 * `--write` is safe to re-run: it refuses a production dataset holding any document outside the
 * manifest, and `createOrReplace` on the manifest ids is idempotent. `--rollback` deletes exactly
 * the manifest's eligible ids and nothing else. Both read back unauthenticated afterwards.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createClient } from '@sanity/client';
import { PRODUCTION_DATASET, SANITY_API_VERSION, SANITY_PROJECT_ID } from '../sanity/project.ts';
import { LEGAL_DOCUMENT_SLUGS } from '../lib/legal/slugs.ts';
import { PROFESSIONAL_REVIEW_GROUPS } from '../lib/services/architecture.ts';
import { doc as companyDetails } from './seed-company-details.mjs';
import { LEGAL_DOCUMENTS } from './seed-legal.mjs';
import { groupPageDocs, serviceDocs } from './seed-content.mjs';

const MANIFEST = 'docs/_shared/GS-PROD-001-CMS-MANIFEST.json';
/** `GS-O003-R`: the owner-adoption register. Only the owner advances a document to OWNER_ADOPTED. */
export const LEGAL_REGISTER = JSON.parse(readFileSync('docs/_legal/GS-O003-R-REGISTER.json', 'utf8'));

/** A legal document reaches production only adopted, at the adopted version, and PUBLISHABLE. */
export function legalPublishable(slug, version) {
  const entry = LEGAL_REGISTER.documents?.[slug];
  return Boolean(entry && entry.state === 'PUBLISHABLE' && entry.ownerAdoptedOn && entry.ownerAdoptedVersion && entry.ownerAdoptedVersion === version);
}
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => args.find((a) => a.startsWith(`${name}=`))?.slice(name.length + 1);

/** Expected counts — written here, not derived from the payload, so a lost record fails. */
export const EXPECTED = { companyDetails: 1, groupPage: 2, service: { design: 13, digital: 17, press: 14 } };

/* -- Payload ----------------------------------------------------------------------------- */

const productionId = (seedId) => seedId.replace(/^seed-/, '');

export function buildPayload() {
  const technical = serviceDocs.filter((d) => PROFESSIONAL_REVIEW_GROUPS.includes(d.capabilityGroup));
  const technicalIds = new Set(technical.map((d) => d._id));
  const entries = [];
  const docs = [];

  docs.push({ ...companyDetails });
  entries.push({ type: 'companyDetails', id: 'companyDetails', slug: null, source: 'scripts/seed-company-details.mjs', gate: null, eligible: true });

  for (const page of groupPageDocs) {
    docs.push({ ...page, _id: productionId(page._id), isSeed: false });
    entries.push({ type: 'groupPage', id: productionId(page._id), slug: page.slug.current, source: 'scripts/seed-content.mjs', gate: null, eligible: true });
  }

  for (const service of serviceDocs) {
    const id = productionId(service._id);
    const base = { type: 'service', id, slug: service.slug.current, division: service.division, group: service.capabilityGroup, source: 'scripts/service-content.mjs' };
    if (technicalIds.has(service._id)) {
      entries.push({ ...base, gate: 'GS-X002', eligible: false, reason: 'Technical group: limited professional scope not yet confirmed by review' });
      continue;
    }
    const related = (service.relatedServices ?? []).filter((r) => !technicalIds.has(r._ref));
    docs.push({
      ...service,
      _id: id,
      isSeed: false,
      relatedServices: related.map((r) => ({ ...r, _ref: productionId(r._ref) })),
    });
    const dropped = (service.relatedServices ?? []).length - related.length;
    entries.push({ ...base, gate: null, eligible: true, ...(dropped ? { droppedTechnicalRefs: dropped } : {}) });
  }

  for (const slug of LEGAL_DOCUMENT_SLUGS) {
    const seed = LEGAL_DOCUMENTS.find((d) => d.slug.current === slug);
    const state = LEGAL_REGISTER.documents?.[slug]?.state ?? 'missing from register';
    if (seed && legalPublishable(slug, seed.version)) {
      const { ownerAdoptedOn } = LEGAL_REGISTER.documents[slug];
      docs.push({ ...seed, _id: `legal-${slug}`, isSeed: false, adoptionState: 'PUBLISHABLE', ownerAdoptedOn });
      entries.push({ type: 'legalDocument', id: `legal-${slug}`, slug, source: 'scripts/seed-legal.mjs (owner-adopted)', gate: null, eligible: true });
    } else {
      entries.push({ type: 'legalDocument', id: `legal-${slug}`, slug, source: 'scripts/seed-legal.mjs', gate: 'GS-O003-R', eligible: false, reason: `Owner adoption outstanding (register state ${state})` });
    }
  }
  return { docs, entries };
}

/* -- Preflight --------------------------------------------------------------------------- */

const strings = (value, out = []) => {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => strings(v, out));
  return out;
};

/**
 * Brand copy says studio; only the legal relationship says "trading division(s) of Gridsmith Ltd"
 * (owner rule, `GS-PROD-001`). Body copy, so the exemption is the relationship phrase itself
 * rather than `check:company` question 10's exact metadata clause.
 */
const STATUTORY_RELATION = /\btrading divisions? of Gridsmith Ltd\b/gi;

/** Every reason this payload must not reach production. An empty array is the only pass. */
export function preflightProblems(docs) {
  const problems = [];
  const ids = new Set(docs.map((d) => d._id));
  if (ids.size !== docs.length) problems.push('duplicate document ids');
  for (const d of docs) {
    if (d._id.startsWith('seed-')) problems.push(`${d._id}: seed id in a production payload`);
    if (d._id.includes('.')) problems.push(`${d._id}: dotted id (private to unauthenticated reads)`);
    if (d.isSeed !== false && d._type !== 'companyDetails') problems.push(`${d._id}: isSeed is ${d.isSeed}, must be false`);
    if (d._type === 'service' && PROFESSIONAL_REVIEW_GROUPS.includes(d.capabilityGroup)) {
      problems.push(`${d._id}: Technical service while GS-X002 is open`);
    }
    if (d._type === 'legalDocument' && (d.adoptionState !== 'PUBLISHABLE' || !legalPublishable(d.slug?.current, d.version))) {
      problems.push(`${d._id}: legal document not PUBLISHABLE in the GS-O003-R register`);
    }
    for (const { _ref } of d.relatedServices ?? []) {
      if (!ids.has(_ref)) problems.push(`${d._id}: reference to ${_ref}, which is not in the payload`);
    }
    for (const text of strings(d)) {
      if (/\[SEED/i.test(text)) problems.push(`${d._id}: carries a [SEED] marker`);
      const word = text.replace(STATUTORY_RELATION, '').match(/\b(?:divisions?|departments?)\b/i)?.[0];
      if (word) problems.push(`${d._id}: brand copy says "${word}" — ${JSON.stringify(text.slice(0, 90))}`);
    }
  }
  const count = (type, division) => docs.filter((d) => d._type === type && (!division || d.division === division)).length;
  if (count('companyDetails') !== EXPECTED.companyDetails) problems.push(`companyDetails: ${count('companyDetails')}, expected ${EXPECTED.companyDetails}`);
  if (count('groupPage') !== EXPECTED.groupPage) problems.push(`groupPage: ${count('groupPage')}, expected ${EXPECTED.groupPage}`);
  for (const [division, n] of Object.entries(EXPECTED.service)) {
    if (count('service', division) !== n) problems.push(`service/${division}: ${count('service', division)}, expected ${n}`);
  }
  const slugs = docs.filter((d) => d.slug).map((d) => `${d._type}/${d.division ?? ''}/${d.slug.current}`);
  if (new Set(slugs).size !== slugs.length) problems.push('duplicate slug within a type');
  return problems;
}

/** Each refusal branch, by return value — the reading is a value, never an absence. */
function selftest(docs) {
  const service = docs.find((d) => d._type === 'service' && d.relatedServices?.length);
  const page = docs.find((d) => d._type === 'groupPage');
  const swap = (target, patch) => docs.map((d) => (d === target ? { ...d, ...patch } : d));
  const cases = [
    ['seed id', swap(page, { _id: 'seed-grouppage-about' }), /seed id/],
    ['dotted id', swap(page, { _id: 'grouppage.about' }), /dotted id/],
    ['isSeed', swap(page, { isSeed: true }), /isSeed is true/],
    ['[SEED] marker', swap(page, { title: '[SEED] About' }), /\[SEED\] marker/],
    ['division copy', swap(page, { intro: 'One company, three specialist divisions.' }), /says "divisions"/],
    ['technical service', swap(service, { capabilityGroup: PROFESSIONAL_REVIEW_GROUPS[0] }), /Technical service/],
    ['unadopted legal document', [...docs, { _id: 'legal-privacy', _type: 'legalDocument', isSeed: false, slug: { current: 'privacy' }, version: '0.0', adoptionState: 'PUBLISHABLE' }], /not PUBLISHABLE in the GS-O003-R register/],
    ['legal document below PUBLISHABLE', [...docs, { _id: 'legal-privacy', _type: 'legalDocument', isSeed: false, slug: { current: 'privacy' }, version: '0.0', adoptionState: 'OWNER_ADOPTED' }], /not PUBLISHABLE in the GS-O003-R register/],
    ['dangling reference', swap(service, { relatedServices: [{ _type: 'reference', _key: 'k0', _ref: 'service-design-nowhere' }] }), /not in the payload/],
    ['lost record', docs.filter((d) => d !== service), /expected/],
  ];
  const failures = [];
  if (preflightProblems(docs).length !== 0) failures.push('the clean payload is not clean');
  if (preflightProblems(swap(page, { intro: 'All three are trading divisions of Gridsmith Ltd.' })).length !== 0) {
    failures.push('the statutory relationship sentence was refused');
  }
  for (const [label, mutated, expected] of cases) {
    if (!preflightProblems(mutated).some((p) => expected.test(p))) failures.push(`${label}: not refused`);
  }
  return { failures, cases: cases.length + 2 };
}

/* -- Run --------------------------------------------------------------------------------- */

const fail = (lines) => {
  console.error(`\nmigrate-production-cms: ${lines.length} problem(s)\n`);
  for (const line of lines) console.error(`  ${line}`);
  console.error('');
  process.exit(1);
};

const { docs, entries } = buildPayload();
const manifest = { generatedBy: 'scripts/migrate-production-cms.mjs', dataset: PRODUCTION_DATASET, eligible: entries.filter((e) => e.eligible).length, entries };
const manifestJson = `${JSON.stringify(manifest, null, 2)}\n`;

const problems = preflightProblems(docs);
const st = selftest(docs);
if (problems.length || st.failures.length) fail([...problems, ...st.failures.map((f) => `SELFTEST ${f}`)]);
if (manifest.eligible !== docs.length) fail([`manifest lists ${manifest.eligible} eligible, payload holds ${docs.length}`]);

if (flag('--write-manifest')) {
  writeFileSync(MANIFEST, manifestJson);
  console.log(`migrate-production-cms: wrote ${MANIFEST} — ${entries.length} entries, ${manifest.eligible} eligible`);
  process.exit(0);
}
if (!existsSync(MANIFEST) || readFileSync(MANIFEST, 'utf8') !== manifestJson) {
  fail([`${MANIFEST} is not what the repository source produces — regenerate with --write-manifest and review the diff`]);
}

const byType = docs.reduce((acc, d) => ({ ...acc, [d._type]: (acc[d._type] ?? 0) + 1 }), {});
const summary =
  `${docs.length} eligible (${Object.entries(byType).map(([t, n]) => `${t} ${n}`).join(', ')}); ` +
  `${entries.length - docs.length} gated (${entries.filter((e) => !e.eligible).map((e) => e.gate).filter((g, i, a) => a.indexOf(g) === i).join(', ')}); ` +
  `preflight clean; selftest ${st.cases} cases`;

const query = async (groq, token) => {
  const res = await fetch(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${PRODUCTION_DATASET}?query=${encodeURIComponent(groq)}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
  );
  if (res.status !== 200) throw new Error(`HTTP ${res.status} from ${PRODUCTION_DATASET}`);
  return (await res.json()).result;
};

/** After a request has been made, never `process.exit()`: on Windows it can abort mid-close. */
const report = (lines) => {
  console.error(`
migrate-production-cms: ${lines.length} problem(s)
`);
  for (const line of lines) console.error(`  ${line}`);
  console.error('');
  process.exitCode = 1;
};

/* -- Guarded production write / rollback. Not executed at GS-PROD-001. ------------------- */

async function guardedWriteOrRollback() {
  const write = flag('--write');
  const backup = option('--backup');
  const refusals = [];
  if (write && flag('--rollback')) refusals.push('--write and --rollback together');
  if (option('--dataset') !== PRODUCTION_DATASET) refusals.push(`--dataset=${PRODUCTION_DATASET} must be given explicitly`);
  if (process.env.GS_PRODUCTION_CMS_CONFIRM !== 'write-production') refusals.push('GS_PRODUCTION_CMS_CONFIRM=write-production is not set');
  if (!process.env.SANITY_API_WRITE_TOKEN) refusals.push('SANITY_API_WRITE_TOKEN is not set');
  if (!backup || !existsSync(backup)) refusals.push('--backup=<file> must name an existing export of the production dataset');
  if (refusals.length) return report(refusals.map((r) => `REFUSED: ${r}. Nothing was read or written.`));

  const token = process.env.SANITY_API_WRITE_TOKEN;
  const manifestIds = new Set(docs.map((d) => d._id));
  const present = await query('*[!(_id in path("_.**")) && !(_id in path("system.**"))]._id', token);
  const foreign = present.filter((id) => !manifestIds.has(id.replace(/^drafts\./, '')));
  if (foreign.length) return report(foreign.map((id) => `REFUSED: production holds ${id}, which is not in the manifest. Nothing was written.`));

  const client = createClient({ projectId: SANITY_PROJECT_ID, dataset: PRODUCTION_DATASET, apiVersion: SANITY_API_VERSION, token, useCdn: false });
  let tx = client.transaction();
  for (const d of docs) tx = write ? tx.createOrReplace(d) : tx.delete(d._id);
  await tx.commit();

  const visible = await query(`count(*[_id in ${JSON.stringify([...manifestIds])}])`);
  const seed = await query('count(*[coalesce(isSeed, false) == true])');
  const expected = write ? docs.length : 0;
  if (visible !== expected || seed !== 0) {
    return report([`read-back: ${visible} manifest document(s) visible (expected ${expected}), ${seed} seed document(s) (expected 0)`]);
  }
  console.log(`migrate-production-cms: ${write ? 'wrote' : 'rolled back'} ${docs.length} document(s) in "${PRODUCTION_DATASET}"; unauthenticated read-back ${visible}, seed 0.`);
}

if (flag('--read-production')) {
  const n = await query('count(*[!(_id in path("_.**")) && !(_id in path("system.**"))])');
  console.log(`migrate-production-cms: read-only — "${PRODUCTION_DATASET}" holds ${n} public document(s). Nothing written.`);
} else if (flag('--write') || flag('--rollback')) {
  await guardedWriteOrRollback();
} else {
  console.log(`migrate-production-cms: DRY RUN — ${summary}. Manifest in agreement. Nothing read or written.`);
}
