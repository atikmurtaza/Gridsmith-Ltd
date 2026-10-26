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

/** The 43 presentation rows must resolve to the 14 canonical Press records. */
export function pressCatalogueProblems(territories, services) {
  const problems = [];
  if (territories?.length !== 6) problems.push(`PRESS CATALOGUE: expected 6 territories, got ${territories?.length ?? 0}`);
  const rows = (territories ?? []).flatMap((t) => [...t.primary, ...t.supporting].map((item) => ({ ...item, territory: t })));
  if (rows.length !== 43) problems.push(`PRESS CATALOGUE: expected 43 rows, got ${rows.length}`);
  const bySlug = new Map();
  for (const service of services ?? []) {
    if (bySlug.has(service.slug)) problems.push(`PRESS SERVICE: duplicate slug ${service.slug}`);
    bySlug.set(service.slug, service);
  }
  const linkedServices = new Map();
  for (const row of rows) {
    const service = bySlug.get(row.slug);
    if (!service) problems.push(`PRESS CATALOGUE: ${row.name} points to missing ${row.slug}`);
    if (!['service', 'capability', 'coordinated', 'conditional'].includes(row.kind)) {
      problems.push(`PRESS CATALOGUE: ${row.name} has unknown kind ${row.kind}`);
    }
    if (row.kind === 'service') {
      if (service?.group !== row.territory.group) problems.push(`PRESS CATALOGUE: ${row.name} is in the wrong territory`);
      linkedServices.set(row.slug, (linkedServices.get(row.slug) ?? 0) + 1);
    }
    if (row.kind === 'conditional' && !row.note) problems.push(`PRESS CATALOGUE: ${row.name} needs its qualification`);
  }
  for (const service of services ?? []) {
    if (linkedServices.get(service.slug) !== 1) problems.push(`PRESS CATALOGUE: ${service.slug} needs exactly one service row`);
  }
  return problems;
}

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
        problems.push(
          `UNCONFIRMED CHANNEL: ${record.slug} claims "${channel}" as a service record, and no ` +
            'approved catalogue entry carries it (GS-O012, narrowed at GS-O013)',
        );
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

/* -- GS-P06: the positions the owner struck -------------------------------- */

/**
 * **Copy positions struck by `GS-O013`, and the gate that keeps them struck.**
 *
 * `GS-O013` approved the 46-record catalogue **with remediation**: six statements the site was
 * about to publish were wrong, over-promised, or written at the reader. Deleting them is one
 * commit's work; keeping them deleted is not. Every one of these was a sentence somebody wrote
 * in good faith, and the same reasoning that produced it the first time produces it again —
 * *"say plainly that the client owns the code"* is a natural thing for a truthful agency to
 * write, and it is exactly the absolute wording the owner removed.
 *
 * **So this is regression coverage over a permanent committed subject** — `service-content.mjs`,
 * which is the canonical copy and the artefact the owner reviewed. `CLAUDE.md`: a fix is not
 * fixed until a gate can reach a committed subject.
 *
 * ## One pattern per rule, deliberately
 *
 * No rule below carries an alternation over its subject, because `CLAUDE.md` requires every
 * branch of a multi-branch assertion to get its own deliberate-failure proof, and a half-firing
 * alternation reports success from the limb you happened to exercise (`check:rls`, twice). Where
 * a struck position has two natural phrasings it is **two rules with two ids**, so the self-test
 * specimen for each one names which rule it fired.
 *
 * ## The ceiling, stated so a green is read correctly
 *
 * This asserts that **these specific struck phrasings** do not stand. It cannot assert that the
 * copy is good, that a summary is client-centred, or that a new absolute promise written in
 * different words is caught — §8's tone remediation in particular is editorial judgement and no
 * regex holds it. A green line here means *the struck wording is gone*, which is the same
 * ceiling `check:legal:parity` and `check:struck` state for themselves.
 */
export const STRUCK_COPY_RULES = [
  {
    id: 'MEDIA-BUYING-DENIAL',
    pattern: /(?:does not|do not|doesn.t|don.t|never)\s+(?:\S+\s+){0,3}buy(?:ing|s)?\s+media\b/i,
    why:
      'GS-O013: denying media buying contradicts the paid-channel capabilities confirmed at ' +
      'GS-O012 — managing a Google Ads or a Meta account is placing paid media.',
  },
  {
    id: 'MEDIA-BUYING-NOT-UNDERTAKEN',
    pattern: /\bmedia buying is (?:not|never)\b/i,
    why: 'GS-O013: the same struck position in its other phrasing.',
  },
  {
    id: 'AD-ACCOUNT-DENIAL',
    pattern: /(?:does not|do not|doesn.t|don.t|never)\s+(?:\S+\s+){0,3}run\s+(?:\S+\s+){0,2}ad(?:vertising)?\s+accounts?\b/i,
    why:
      'GS-O012 confirmed Google Ads, Meta and social account management. This exclusion was ' +
      'corrected once at GS-P05 and struck outright at GS-O013.',
  },
  {
    id: 'HOSTING-RESALE-PROHIBITION',
    pattern: /\bresell(?:s|ing)?\s+hosting\b/i,
    why:
      'GS-O013: a permanent rule against reselling hosting forecloses managed-hosting ' +
      'arrangements the owner has not ruled out. Hosting is project-specific and set by the ' +
      'written agreement.',
  },
  {
    id: 'ACCESSIBILITY-CATEGORICAL',
    pattern: /\b(?:no one|no-one|nobody)\b[^.;]{0,40}\bcertif/i,
    why:
      'GS-O013: "no one can certify accessibility" is categorical and false — conformance ' +
      'certification exists. The scoped statement is that it is not included unless scoped.',
  },
  {
    id: 'COMBATIVE-ANYONE-HONEST',
    pattern: /\banyone\b[^.;]{0,40}\b(?:honest(?:ly)?|being straight)/i,
    why:
      'GS-O013: "not offered by anyone honestly" attacks the market instead of stating the ' +
      'limitation. Gridsmith states its own position without implying competitors lie.',
  },
  {
    id: 'COMBATIVE-ANYONE-PROMISE',
    pattern: /\banyone.{0,3}s (?:gift|control) to promise\b/i,
    why: 'GS-O013: the same register — a rhetorical flourish where a plain limitation belongs.',
  },
  {
    id: 'OWNERSHIP-ABSOLUTE-CODE',
    pattern: /\b(?:source )?code\b[^.;]{0,40}\b(?:are|is) yours\b/i,
    why:
      'GS-O013: ownership, source-code handover, account access and infrastructure ' +
      'arrangements are defined in the written project agreement, not promised in marketing ' +
      'copy. An absolute here is a contractual statement nobody drafted.',
  },
  {
    id: 'OWNERSHIP-ABSOLUTE-ACCOUNTS',
    pattern: /\baccounts?\b[^.;]{0,40}\b(?:are|is) yours\b/i,
    why: 'GS-O013: the same absolute, applied to hosting, domain, CMS and publisher accounts.',
  },
  {
    id: 'OWNERSHIP-ABSOLUTE-HELD-IN-YOUR-NAME',
    pattern: /\b(?:are|is)(?:\s+\S+){0,3}\s+held in your name\b/i,
    why:
      'GS-O013: an unconditional statement that every account is in the client\u2019s name. The ' +
      'preference may be stated; the guarantee may not.',
  },
  {
    id: 'CONTINUITY-QUOTED-AS-FURTHER-WORK',
    pattern: /\bquoted as further work\b/i,
    why:
      'GS-O013: later amendments, extensions and ongoing support can be scoped as further work ' +
      '**or an ongoing engagement**. "Quoted as further work" recognises only the first.',
  },
];

/**
 * A floor on how much copy was read, hardcoded from **outside** the subject.
 *
 * Without it this whole assertion is an absence with no cause: a traversal that walked nothing
 * would report zero problems and print a clean line, which is `CLAUDE.md`'s "count that was
 * never counted" exactly. The number is the order of magnitude, not the exact total, so ordinary
 * editing does not touch it and a broken walk still cannot pass.
 */
export const MIN_COPY_STRINGS = 600;

/**
 * Every struck phrasing is absent from the canonical copy — `GS-O013`.
 *
 * @param {object} input
 * @param {Record<string, object[]>} input.services  `SERVICES`, keyed by division
 * @param {Record<string, Record<string, string>>} input.process  `PROCESS_DETAIL`
 * @param {typeof STRUCK_COPY_RULES} [rules]
 * @returns {{problems: string[], scanned: number}} `scanned` is the number of strings read
 */
export function struckCopyProblems({ services, process: processDetail }, rules = STRUCK_COPY_RULES) {
  const problems = [];
  /** @type {{where: string, text: string}[]} */
  const strings = [];

  const walk = (value, where) => {
    if (typeof value === 'string') strings.push({ where, text: value });
    else if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${where}[${i}]`));
    else if (value && typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) walk(v, `${where}.${k}`);
    }
  };

  for (const [division, records] of Object.entries(services ?? {})) {
    for (const record of records ?? []) walk(record, `${division}/${record?.slug ?? '?'}`);
  }
  walk(processDetail ?? {}, 'PROCESS_DETAIL');

  if (strings.length < MIN_COPY_STRINGS) {
    problems.push(
      `ZERO-SUBJECT: ${strings.length} copy string(s) read, expected at least ` +
        `${MIN_COPY_STRINGS}. The walk is empty or mis-rooted; nothing was measured.`,
    );
  }

  for (const rule of rules) {
    for (const { where, text } of strings) {
      const hit = text.match(rule.pattern);
      if (!hit) continue;
      problems.push(
        `STRUCK COPY: ${rule.id} stands at ${where}\n      "${hit[0]}"\n      ${rule.why}`,
      );
    }
  }

  return { problems, scanned: strings.length };
}
