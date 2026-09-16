#!/usr/bin/env node
/**
 * owner-content-review — writes `docs/_shared/GS-P05-OWNER-CONTENT-REVIEW.md`.
 *
 * `GS-O013` asks the owner to accept, amend or reject the wording of 46 development service
 * records. Reading those in Sanity means opening 46 documents; reading them in
 * `scripts/service-content.mjs` means reading 1,090 lines of JavaScript. Neither is a review.
 *
 * ## It transcribes; it does not rewrite
 *
 * Every summary, sentence, deliverable and exclusion in the output is **copied from
 * `scripts/service-content.mjs` verbatim**. Nothing is paraphrased, shortened or improved for
 * the report. That is the whole point: the owner must approve the wording the site will carry,
 * and a report written in better prose than the content would collect approval for the report.
 *
 * ## Why it is generated rather than written
 *
 * Because a hand-written copy of the content would be `01-VALIDATION-REPORT.md` §21 exactly —
 * two authored artefacts that must agree, only one of which anybody reads. `seed-legal.mjs`
 * diverged from `docs/_legal/` across nine review rounds for precisely that reason. Generating
 * the document from the single source removes the possibility rather than policing it.
 *
 * ## The staleness guard
 *
 * The generated document records the SHA-256 of `scripts/service-content.mjs` at the moment it
 * was written, and `check:service-content` fails when the file no longer hashes to it. Without
 * that, editing a service after the owner has read the report would leave an approval attached
 * to wording that no longer exists — a stale approval being worse than none, because it looks
 * settled. Regenerate with `npm run docs:content-review` and the review is knowingly reopened.
 *
 * Usage: `npm run docs:content-review`
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PROCESS_DETAIL, SERVICES } from './service-content.mjs';
import { CAPABILITY_GROUPS, ENQUIRY_CTA, PRIVATE_EXAMPLES_NOTICE } from '../lib/services/architecture.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join('scripts', 'service-content.mjs');
const OUT = join('docs', '_shared', 'GS-P05-OWNER-CONTENT-REVIEW.md');

export const contentHash = () =>
  createHash('sha256').update(readFileSync(join(root, SOURCE))).digest('hex');

/**
 * Terms whose presence means a sentence asserts something **only the owner can confirm** — a
 * named tool Gridsmith must actually run, a professional or regulatory position, or a standard.
 *
 * Deliberately a small, explicit list rather than a cleverness. Its job is to put a reviewer's
 * eye on the handful of sentences where an agent could have written a capability Gridsmith does
 * not have, not to score the prose. A false positive costs one extra line to read; a missed
 * claim is a fabricated capability on a public site.
 */
const CLAIM_MARKERS = [
  'SolidWorks', 'Solidworks', 'Fusion', 'AutoCAD', 'Revit', 'Shopify', 'WooCommerce', 'WordPress',
  'Blender', 'KeyShot', 'Unity', 'Unreal', 'Figma', 'InDesign', 'Illustrator', 'Photoshop',
  'ISO', 'BS ', 'EN ', 'CE ', 'UKCA', 'GDPR', 'WCAG', 'ISBN', 'accredit', 'certifi', 'qualified',
  'chartered', 'insur', 'regulat', 'licens', 'registered with',
];

const escape = (s) => String(s).replace(/\|/g, '\\|');

const claimsIn = (text) => {
  const hits = new Set();
  for (const marker of CLAIM_MARKERS) if (text.includes(marker)) hits.add(marker.trim());
  return [...hits];
};

const groupsFor = (division) => CAPABILITY_GROUPS.filter((g) => g.division === division);
const DIVISION_TITLE = { design: 'DESIGN', digital: 'DIGITAL', press: 'PRESS' };

const lines = [];
const w = (s = '') => lines.push(s);

const totals = { records: 0, covers: 0, claims: 0, gated: 0, exclusions: 0 };

w('# `GS-P05` — owner content review candidate');
w();
w('**This is the actual development service copy, transcribed. It is not a second version of');
w('it.** Every summary, sentence, deliverable and exclusion below is copied verbatim from');
w(`\`${SOURCE.replace(/\\/g, '/')}\`, which is the single source the development dataset is`);
w('seeded from. Nothing here has been paraphrased, tidied or improved for the report — if it');
w('reads awkwardly, the site reads awkwardly, and that is what this document exists to surface.');
w();
w('**Generated, not written.** Regenerate with `npm run docs:content-review` after any content');
w('change. `check:service-content` fails while this document\'s recorded hash and the source');
w('disagree, so an approval cannot silently attach to wording that has since changed.');
w();
w(`**Source SHA-256:** \`${contentHash()}\``);
w();
w('---');
w();
w('## How to respond');
w();
w('You do not need to open Sanity, and you do not need to respond record by record. Any of');
w('these is enough to act on:');
w();
w('- `Approve all Design`');
w('- `Approve Digital except the CAD Drafting summary`');
w('- `Reject Press — Ghostwriting, rewrite the exclusions`');
w('- `Approve everything except the flagged claims`');
w();
w('**The exclusions are the part worth your time.** Each record ends with what Gridsmith does');
w('*not* undertake, marked `EXCLUDED`. Those lines are the ones that limit what a client can');
w('later say was promised, and they were written by an agent from the service list, not by you.');
w();
w('**Lines marked `⚠ VERIFY` assert something only you can confirm** — a named tool, a');
w('professional position, a standard. They are not necessarily wrong; they are the sentences');
w('where being wrong would matter most.');
w();
w('## What is deliberately absent, and is not an omission');
w();
w('| Absent | Why |');
w('|---|---|');
w('| Any price, band, range or "from" figure | `GS-D002` — public journeys lead to a bespoke quote |');
w('| Any client name, logo, project or case study | `GS-D001` — permission-dependent evidence is off the critical path |');
w('| Any turnaround, SLA, revision count or guarantee | Not an owner fact this repository holds |');
w('| Any years-of-experience or client-count figure | Same |');
w();
w('Where a public portfolio would have sat, the site carries this instead:');
w();
w(`> ${PRIVATE_EXAMPLES_NOTICE}`);
w();
w('---');
w();

for (const division of ['design', 'digital', 'press']) {
  const records = SERVICES[division] ?? [];
  w(`# ${DIVISION_TITLE[division]}`);
  w();
  w(`**${records.length} service records.** Primary call to action on every page in this`);
  w(`division: **${ENQUIRY_CTA[division]}**, plus the universal **Contact Gridsmith**. Both reach`);
  w('the one enquiry form, carrying the division and service as context.');
  w();

  w('### Engagement wording, shown on every service page in this division');
  w();
  w('The six stage names are fixed programme-wide and are not up for review here; the sentence');
  w('under each one is. No duration and no client time commitment is stated anywhere — those');
  w('would be operational commitments nobody has given.');
  w();
  for (const [stage, detail] of Object.entries(PROCESS_DETAIL[division] ?? {})) {
    w(`- **${stage}** — ${detail}`);
  }
  w();

  for (const group of groupsFor(division)) {
    const inGroup = records.filter((r) => r.group === group.key);
    if (inGroup.length === 0) continue;
    w(`## ${group.label}`);
    if (group.professionalReview) {
      totals.gated += inGroup.length;
      w();
      w('> **PUBLICATION GATED.** Every record in this group is refused on production by');
      w('> `check:launch` until `professionalScopeConfirmed` is set, which may happen only once');
      w('> `GS-O005` (professional-indemnity scope) and `GS-X002` (professional review) are');
      w('> closed. Approving the wording here does **not** close either, and does not publish');
      w('> these pages. Read them as drafts held behind a gate.');
    }
    w();

    for (const r of inGroup) {
      totals.records += 1;
      totals.covers += r.covers.length;
      w(`### ${r.title}`);
      w();
      w(`\`/${division}/services/${r.slug}\``);
      w();
      w(`**Approved capabilities this page represents (${r.covers.length}):** ${r.covers.join(' · ')}`);
      w();
      w(`**Summary** *(the one line shown on cards and at the top of the page)*`);
      w();
      w(`> ${r.summary}`);
      w();
      w('**Description**');
      w();
      for (const p of r.description) {
        const claims = claimsIn(p);
        if (claims.length > 0) totals.claims += 1;
        w(`> ${p}${claims.length > 0 ? `\n>\n> ⚠ VERIFY — asserts: ${claims.join(', ')}` : ''}`);
        w('>');
      }
      lines.pop();
      w();
      w('**What this covers, as shown publicly**');
      w();
      w('| | Item | Detail |');
      w('|---|---|---|');
      for (const [label, detail, included] of r.deliverables) {
        const excluded = included === false;
        if (excluded) totals.exclusions += 1;
        const claims = claimsIn(`${label} ${detail ?? ''}`);
        if (claims.length > 0) totals.claims += 1;
        w(
          `| ${excluded ? '**EXCLUDED**' : 'Included'} | ${escape(label)} | ` +
            `${escape(detail ?? '—')}${claims.length > 0 ? ` <br>⚠ VERIFY — ${escape(claims.join(', '))}` : ''} |`,
        );
      }
      w();
      const related = (r.related ?? []).map((s) => `\`${s}\``).join(', ');
      const collaborators = (r.collaborators ?? []).map((d) => DIVISION_TITLE[d] ?? d).join(', ');
      w(`**Related services:** ${related || '—'}`);
      w();
      w(`**Cross-division work referenced:** ${collaborators || 'none'}`);
      w();
      w(`**Call to action:** ${ENQUIRY_CTA[division]}`);
      w();
      w('---');
      w();
    }
  }
}

w('# Totals');
w();
w('| | |');
w('|---|---|');
w(`| Service records presented | ${totals.records} |`);
w(`| Approved capabilities represented | ${totals.covers} |`);
w(`| Published exclusions to read | ${totals.exclusions} |`);
w(`| Passages flagged \`⚠ VERIFY\` | ${totals.claims} |`);
w(`| Records behind the Technical publication gate | ${totals.gated} |`);
w();
w('Approving this copy closes `GS-O013`\'s first limb only. It does not close `GS-O005`,');
w('`GS-X002`, or authorise promotion of anything to production.');
w();

/**
 * **The write happens only when this file is executed, never when it is imported.**
 *
 * `check-service-content.mjs` imports `contentHash` from here to assert that the generated
 * document still transcribes the current copy. Without this guard that import would *rewrite the
 * document it is about to check*, and the assertion could never fail — a gate that repairs its
 * own subject before measuring it is the "expectation derived from its own subject" failure with
 * an extra step. `seed-content.mjs` is kept out of that gate for the same reason, and this file
 * is the second instance of the same hazard.
 */
if (import.meta.main) {
  writeFileSync(join(root, OUT), lines.join('\n'), 'utf8');
  console.log(
    `owner-content-review: wrote ${OUT.replace(/\\/g, '/')} — ${totals.records} record(s), ` +
      `${totals.covers} capability reference(s), ${totals.exclusions} exclusion(s), ` +
      `${totals.claims} flagged passage(s), ${totals.gated} gated record(s).`,
  );
}
