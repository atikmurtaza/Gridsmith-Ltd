/**
 * The `GS-P04` service-content assertions, as pure functions.
 *
 * Same shape and the same reason as `launch-content-rules.mjs` and `legal-parity-rules.mjs`:
 * a gate whose predicate can only be reached through a network fetch has no committed subject,
 * so the predicate lives here where `check-service-content.selftest.mjs` can call it directly
 * with values and assert what comes back.
 *
 * **These return values, not exit codes.** That is what makes the self-test a structurally valid
 * probe rather than an absence: a specimen that should fail produces a named problem string, and
 * "it did not fire" is then distinguishable from "nothing was injected" — the failure mode
 * `CLAUDE.md` describes under *"a probe that produces no red is not evidence about the gate"*.
 *
 * Nothing here reads the environment, the network or the clock.
 */
import { approvedKey, divisionOfGroup } from '../lib/services/catalogue.ts';

/**
 * The identifying fragments that must never appear in a testimonial's title metadata again —
 * `GS-O011`, owner decision of 16 September 2026 to anonymise identifiable project titles on
 * every Freelancer review.
 *
 * **Why the strings are here rather than deleted.** A denylist needs the thing it refuses. Each
 * fragment was a public Freelancer project title carried in `seed-content.mjs` until this phase
 * and is in this repository's git history regardless; keeping them in a gate that exists to
 * refuse them does not publish them, and removing them would leave the gate with nothing to
 * match — which is the "a gate with no subject is silent" failure, applied to a denylist.
 *
 * `Casglu` is the one that made the decision necessary: it is a client's brand name.
 */
export const IDENTIFYING_TITLE_FRAGMENTS = [
  'Casglu',
  'Shopify Theme Image',
  'Artistic Logo Design for',
  'Miniature Medieval Castle',
  'Ultra-Thin',
  'Wallet-Sized',
  'Wireless Charger',
  'Open Eyes',
  'Editable Circle Image',
];

/**
 * Review title metadata carries no identifying fragment.
 *
 * @param {{ id: string, projectTitle: string | null | undefined }[]} reviews
 * @returns {string[]} problems; empty means clean
 */
export function anonymityProblems(reviews) {
  const problems = [];
  if (!Array.isArray(reviews)) return ['reviews was not an array — nothing was measured'];
  if (reviews.length === 0) return ['no reviews were supplied — the anonymity assertion measured nothing'];
  for (const review of reviews) {
    const title = review?.projectTitle;
    if (title === null || title === undefined) continue;
    if (typeof title !== 'string') {
      problems.push(`${review?.id}: projectTitle is ${JSON.stringify(title)}, not a string or absent`);
      continue;
    }
    for (const fragment of IDENTIFYING_TITLE_FRAGMENTS) {
      if (title.toLowerCase().includes(fragment.toLowerCase())) {
        problems.push(`${review.id}: projectTitle "${title}" still carries the identifying fragment "${fragment}"`);
      }
    }
  }
  return problems;
}

/**
 * Every approved service is represented by exactly one seeded record, and no record claims
 * anything the owner did not approve.
 *
 * The four limbs are separately named so that a deliberate-failure proof can establish which
 * one fired — `CLAUDE.md`, *"every branch of a multi-branch assertion gets its own proof"*.
 *
 * @param {object} input
 * @param {readonly {group: string, name: string}[]} input.approved  the catalogue (the expectation)
 * @param {Record<string, {slug: string, title: string, group: string, covers: string[]}[]>} input.services
 *        the seeded records, keyed by division (the subject)
 * @param {readonly string[]} input.unconfirmed  channel services no record may claim
 * @returns {string[]} problems; empty means clean
 */
export function coverageProblems({ approved, services, unconfirmed = [] }) {
  const problems = [];
  if (!Array.isArray(approved) || approved.length === 0) {
    return ['the approved catalogue was empty — the coverage assertion measured nothing'];
  }
  const records = Object.entries(services ?? {}).flatMap(([division, rows]) =>
    (rows ?? []).map((row) => ({ ...row, division })),
  );
  if (records.length === 0) {
    return ['no service records were supplied — the coverage assertion measured nothing'];
  }

  // Limb 1 — a record's group must belong to the record's own division.
  for (const record of records) {
    const division = divisionOfGroup(record.group);
    if (division === null) {
      problems.push(`DIVISION: ${record.slug} has capability group "${record.group}", which is not in the architecture`);
    } else if (division !== record.division) {
      problems.push(`DIVISION: ${record.slug} is a ${record.division} service in group "${record.group}", which belongs to ${division}`);
    }
  }

  // Limb 2 — slugs are unique across the whole set, because a slug is a URL.
  const seen = new Map();
  for (const record of records) {
    if (seen.has(record.slug)) {
      problems.push(`SLUG: "${record.slug}" is used by both the ${seen.get(record.slug)} and ${record.division} records`);
    } else {
      seen.set(record.slug, record.division);
    }
  }

  // Limb 3 — every claimed capability is an approved one, in the record's own group.
  const approvedKeys = new Set(approved.map(approvedKey));
  const coverCount = new Map();
  for (const record of records) {
    for (const name of record.covers ?? []) {
      const key = approvedKey({ group: record.group, name });
      if (!approvedKeys.has(key)) {
        problems.push(`UNAPPROVED: ${record.slug} claims "${name}" in group "${record.group}", which is not an approved service`);
        continue;
      }
      coverCount.set(key, [...(coverCount.get(key) ?? []), record.slug]);
    }
  }

  // Limb 4 — every approved service is covered exactly once.
  for (const entry of approved) {
    const key = approvedKey(entry);
    const covering = coverCount.get(key) ?? [];
    if (covering.length === 0) {
      problems.push(`UNCOVERED: no seeded service represents "${entry.name}" (${entry.group})`);
    } else if (covering.length > 1) {
      problems.push(`DUPLICATE: "${entry.name}" (${entry.group}) is claimed by ${covering.join(' and ')}`);
    }
  }

  // Limb 5 — no record claims a channel service the owner has not confirmed (`GS-O012`).
  for (const record of records) {
    const haystack = [record.title, ...(record.covers ?? [])].join(' ').toLowerCase();
    for (const channel of unconfirmed) {
      if (haystack.includes(channel.toLowerCase())) {
        problems.push(`UNCONFIRMED CHANNEL: ${record.slug} claims "${channel}", which no owner decision confirms (GS-O012)`);
      }
    }
  }

  return problems;
}

/**
 * The Digital Marketing decomposition resolves to real approved services — `GS-O011`.
 *
 * It is a documentation map rather than content, so the only way it can rot is by naming a
 * service the catalogue no longer has. That is exactly the dependent-list-to-subject relation
 * `check:lists` asserts elsewhere, and it is decidable here for the same reason.
 *
 * @param {object} input
 * @param {readonly {activity: string, owner: string, approved: {group: string, name: string} | null}[]} input.engagement
 * @param {readonly {group: string, name: string}[]} input.approved
 * @returns {string[]} problems; empty means clean
 */
export function engagementProblems({ engagement, approved }) {
  const problems = [];
  if (!Array.isArray(engagement) || engagement.length === 0) {
    return ['the Digital Marketing engagement map was empty — nothing was measured'];
  }
  const approvedKeys = new Set((approved ?? []).map(approvedKey));
  for (const row of engagement) {
    if (row.approved === null) {
      if (row.owner !== 'master') {
        problems.push(`ENGAGEMENT: "${row.activity}" names no approved service but is owned by ${row.owner}, not master — only orchestration may be unmapped`);
      }
      continue;
    }
    if (!approvedKeys.has(approvedKey(row.approved))) {
      problems.push(`ENGAGEMENT: "${row.activity}" maps to "${row.approved.name}" (${row.approved.group}), which is not an approved service`);
    }
    const division = divisionOfGroup(row.approved.group);
    if (division !== row.owner) {
      problems.push(`ENGAGEMENT: "${row.activity}" is owned by ${row.owner} but maps to a ${division} capability — the division-bound group rule would refuse it`);
    }
  }
  return problems;
}
