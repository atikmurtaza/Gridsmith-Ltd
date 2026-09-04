#!/usr/bin/env node
/**
 * check-list-parity — every list a gate consults must agree with the gate's subject list.
 *
 * ## Why this gate exists
 *
 * `K-13` added `/press/contact` and `/press/contact/thank-you` to `check-axe`'s `ROUTES` and
 * not to its `INCOMPLETE_ALLOWED` entry. The shared consent banner's `color-contrast`
 * incomplete — allowed on all sixteen other routes — reported UNRESOLVED on eight
 * combinations, and `check:axe` was red for two sessions. The `K-13` write-up said *"axe is
 * clean on both new routes"*, which was true about violations and silent about incompletes:
 * the gate had been asked one question and its green read as an answer to another.
 *
 * **A subject added to one of a gate's lists and not to the others is invisible in the
 * source.** Nothing in `check-axe` relates the two lists, so nothing could say they had
 * diverged; the only report was a red run two sessions later, on a route the session that
 * added it was no longer looking at. This file is that missing relation, stated once.
 *
 * ## What it asks
 *
 * For each coupled pair in `REGISTRY`, it re-reads the gate's source, extracts the two lists
 * as sets of keys, and asserts the declared relation between them. It is a **static** check:
 * it never runs the gate it audits, and it makes no claim about what that gate measures.
 *
 * ## Direction, and the half that cannot be static
 *
 * The two directions are not symmetrical and only one of them is decidable here.
 *
 * - **Dependent -> subject** *is* decidable. A key in an allowlist, exclusion or baseline
 *   that names nothing in the subject list is dead: it can never be matched, so the decision
 *   it records has silently stopped applying. That is asserted below.
 * - **Subject -> dependent** is **not**, and deliberately so. Whether a newly added route
 *   *needs* an allowlist entry depends on what that route renders, which only a run can
 *   know. `K-13`'s defect is in this direction. What catches it is running the gate — which
 *   is exactly what happened, two sessions late.
 *
 * So this gate does not close the `K-13` hole; it closes the hole's mirror image, and states
 * the boundary rather than implying coverage it does not have. **The rule that closes `K-13`
 * is in `CLAUDE.md` and is procedural, not mechanical**: adding a subject to a gate is not
 * complete until every list that gate consults has been considered, and the gate re-run.
 *
 * ## The discovery guard — why the registry cannot rot
 *
 * A hand-maintained registry of coupled pairs is a hand-maintained record, and `CLAUDE.md`
 * is clear about what those are worth on their own. So the registry is not the only input:
 * every `scripts/check-*.mjs` is scanned for module-level lists bearing route-shaped keys,
 * and **a gate with two or more of them that is absent from `REGISTRY` is a hard failure.**
 * A new multi-list gate therefore cannot be added without a decision being written down
 * here — either a relation, or an explicit `unrelated` entry saying why the lists share no
 * key domain. `check-axe`'s `FOOTER_LEGAL_PATHS` is the standing example of the second: its
 * entries are link *targets* audited from every route, not routes this gate visits, and
 * asserting a subset relation there would be asserting a falsehood.
 *
 * ## The ceiling
 *
 * Route-shaped keys (`'/...'`) and token-shaped keys (`'--...'`) are what the extractor sees.
 * A gate coupling two lists over some other key domain — schema type names, rule ids — is
 * outside the discovery guard and can only be registered by hand. Registered pairs are
 * checked regardless of key shape; it is only *discovery* that is shape-bound. Said plainly
 * because a green line here otherwise reads as "no gate has divergent lists", and what it
 * means is **"no registered pair has diverged, and no gate has undeclared route-keyed lists."**
 *
 * `node scripts/check-list-parity.mjs --selftest` proves each branch against synthetic
 * sources and asserts the returned problem set, so validity is structural — every case reads
 * a return value rather than an absence.
 */
import { readFileSync, readdirSync } from 'node:fs';

/* --------------------------------------------------------------------------
 * Extraction
 * ------------------------------------------------------------------------ */

/**
 * Module-level `const NAME = [...]` / `{...}`, brace-balanced so a nested literal does not
 * end the capture early. Comments are stripped from the body before keys are read: several
 * of these lists carry example paths in their prose, and a commented-out route is not a
 * member of the list.
 */
export function extractLists(src) {
  const lists = new Map();
  const re = /^const ([A-Z][A-Z0-9_]*) = ([[{])/gm;
  let m;
  while ((m = re.exec(src)) !== null) {
    const open = m[2];
    const close = open === '[' ? ']' : '}';
    let depth = 0;
    let i = m.index + m[0].length - 1;
    for (; i < src.length; i += 1) {
      if (src[i] === open) depth += 1;
      else if (src[i] === close) {
        depth -= 1;
        if (depth === 0) break;
      }
    }
    const body = src.slice(m.index, i + 1).replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '');
    lists.set(m[1], {
      routes: new Set([...body.matchAll(/'(\/[A-Za-z0-9_\-/.]*)'/g)].map((x) => x[1])),
      tokens: new Set([...body.matchAll(/'(--[a-z0-9-]+)'/g)].map((x) => x[1])),
    });
  }
  return lists;
}

/** A bare `const NAME = '/path';` — `FOOTER_EXEMPT` is one, and it is a one-member list. */
function extractScalars(src) {
  return new Map(
    [...src.matchAll(/^const ([A-Z][A-Z0-9_]*) = '(\/[A-Za-z0-9_\-/.]*)';/gm)].map((x) => [
      x[1],
      new Set([x[2]]),
    ]),
  );
}

const keysOf = (lists, scalars, name, kind) => {
  const l = lists.get(name);
  if (l) return l[kind];
  return scalars.get(name) ?? null;
};

/* --------------------------------------------------------------------------
 * The registry
 * ------------------------------------------------------------------------ */

/**
 * Each entry states a relation that must hold between two lists in one gate.
 *
 * `subset`   — every key of `of` must appear in `in`. Use where `of` is an allowlist,
 *              exclusion or derived subject set over the subject list `in`.
 * `disjoint` — the two lists must share no key. Use where two lists partition one namespace
 *              and an overlap would mean two owners for one name.
 * `unrelated`— no relation. Required for a route-keyed list the discovery guard would
 *              otherwise flag; `why` is the decision.
 */
const REGISTRY = [
  {
    gate: 'check-axe.mjs',
    kind: 'subset',
    of: 'INCOMPLETE_ALLOWED',
    in: 'ROUTES',
    keys: 'routes',
    why:
      'The allowlist matches on rule + route + node. A route named here that the gate never ' +
      'visits is a decision that has stopped applying, and it reads as coverage. This is the ' +
      'K-13 pair.',
  },
  {
    gate: 'check-axe.mjs',
    kind: 'subset',
    of: 'FOOTER_EXEMPT',
    in: 'ROUTES',
    keys: 'routes',
    why:
      'FOOTER_EXEMPT is subtracted from ROUTES to build footeredRoutes. If it names a route ' +
      'ROUTES does not carry, the subtraction removes nothing and the exemption is silent — ' +
      'the gate would then require the footer on a route the exemption exists to excuse.',
  },
  {
    gate: 'check-axe.mjs',
    kind: 'unrelated',
    of: 'FOOTER_LEGAL_PATHS',
    keys: 'routes',
    why:
      'Link targets audited FROM every route, not routes this gate visits. None of the four ' +
      'is in ROUTES and none should be; a subset assertion here would assert a falsehood.',
  },
  {
    gate: 'check-bundle-size.mjs',
    kind: 'subset',
    of: 'BASELINE_ROUTES',
    in: 'REQUIRED',
    keys: 'routes',
    why:
      'The shared-baseline spread is computed over rows filtered to BASELINE_ROUTES. REQUIRED ' +
      'is the list whose absence is a hard failure, so a baseline route outside it can vanish ' +
      'from the build and leave the spread computed over fewer rows, silently.',
  },
  {
    gate: 'check-bundle-size.mjs',
    kind: 'unrelated',
    of: 'BUDGETS',
    keys: 'routes',
    why:
      'Budgets are written before their routes exist — /design/estimate and /press/path-finder ' +
      'are both unbuilt. A budget without a route is the intended state, and /_not-found is ' +
      'REQUIRED with no budget by the same deliberate asymmetry.',
  },
  {
    gate: 'check-tokens.mjs',
    kind: 'disjoint',
    of: 'REQUIRED',
    in: 'CONTRACT',
    keys: 'tokens',
    why:
      'REQUIRED is the base layer (styles/tokens.css); CONTRACT is what each theme file must ' +
      'declare. A name in both means two layers own one token, and whichever cascades last ' +
      'wins per theme — the divergence a themed site cannot show you.',
  },
  {
    gate: 'check-tokens.mjs',
    kind: 'disjoint',
    of: 'REQUIRED',
    in: 'SHARED_ACCENTS',
    keys: 'tokens',
    why: 'Same partition as CONTRACT: the division-reference accents live in the theme layer.',
  },
];

/* --------------------------------------------------------------------------
 * The audit
 * ------------------------------------------------------------------------ */

/**
 * @param sources Map<filename, source text>. Injected so the selftest can drive synthetic
 *   gates and read the returned problems, rather than reading an absence off a real run.
 */
export function audit(sources, registry = REGISTRY) {
  const problems = [];
  const counted = { pairs: 0, keys: 0, gatesScanned: 0, multiListGates: 0 };

  const parsed = new Map();
  for (const [file, src] of sources) {
    parsed.set(file, { lists: extractLists(src), scalars: extractScalars(src) });
    counted.gatesScanned += 1;
  }

  for (const rule of registry) {
    const p = parsed.get(rule.gate);
    if (!p) {
      problems.push(`${rule.gate}: registered in check-list-parity but not found in scripts/.`);
      continue;
    }
    const left = keysOf(p.lists, p.scalars, rule.of, rule.keys);
    if (left === null) {
      problems.push(
        `${rule.gate}: registered list ${rule.of} no longer exists. A registry entry whose ` +
          'subject has gone is a rule that cannot fire — rename it here or remove the entry ' +
          'deliberately.',
      );
      continue;
    }
    if (rule.kind === 'unrelated') continue;

    const right = keysOf(p.lists, p.scalars, rule.in, rule.keys);
    if (right === null) {
      problems.push(`${rule.gate}: registered list ${rule.in} no longer exists.`);
      continue;
    }
    if (left.size === 0) {
      problems.push(
        `${rule.gate}: ${rule.of} contributed no ${rule.keys} keys, so the ${rule.kind} ` +
          `assertion against ${rule.in} compared nothing and would have passed empty.`,
      );
      continue;
    }
    counted.pairs += 1;
    counted.keys += left.size;

    if (rule.kind === 'subset') {
      for (const k of left) {
        if (!right.has(k)) {
          problems.push(
            `${rule.gate}: ${rule.of} names ${k}, which is not in ${rule.in}. ${rule.why}`,
          );
        }
      }
    } else if (rule.kind === 'disjoint') {
      for (const k of left) {
        if (right.has(k)) {
          problems.push(`${rule.gate}: ${k} is in both ${rule.of} and ${rule.in}. ${rule.why}`);
        }
      }
    }
  }

  // Discovery guard. See "why the registry cannot rot" above.
  const registered = new Set(registry.map((r) => `${r.gate}::${r.of}`));
  for (const [file, p] of parsed) {
    const routeLists = [...p.lists].filter(([, v]) => v.routes.size > 0).map(([n]) => n);
    if (routeLists.length < 2) continue;
    counted.multiListGates += 1;
    for (const name of routeLists) {
      const known =
        registered.has(`${file}::${name}`) ||
        registry.some((r) => r.gate === file && r.in === name);
      if (!known) {
        problems.push(
          `${file}: ${name} is a route-keyed list in a gate that has ${routeLists.length} of ` +
            'them, and it is not registered in check-list-parity. Add a relation, or an ' +
            'unrelated entry saying which key domain it belongs to and why it is not the ' +
            "gate's subject.",
        );
      }
    }
  }

  return { problems, counted };
}

/* --------------------------------------------------------------------------
 * Selftest — one deliberate failure per branch, each naming its own case.
 * ------------------------------------------------------------------------ */

function selftest() {
  const cases = [];
  const t = (name, sources, registry, expect) =>
    cases.push({ name, sources: new Map(Object.entries(sources)), registry, expect });

  const SUBSET_RULE = [
    { gate: 'g.mjs', kind: 'subset', of: 'ALLOW', in: 'ROUTES', keys: 'routes', why: 'w' },
  ];
  const DISJOINT_RULE = [
    { gate: 'g.mjs', kind: 'disjoint', of: 'A', in: 'B', keys: 'tokens', why: 'w' },
  ];

  t('subset holds', { 'g.mjs': "const ROUTES = ['/a', '/b'];\nconst ALLOW = ['/a'];\n" }, SUBSET_RULE, null);
  t(
    'subset violated — the K-13 mirror',
    { 'g.mjs': "const ROUTES = ['/a'];\nconst ALLOW = ['/a', '/gone'];\n" },
    SUBSET_RULE,
    /ALLOW names \/gone, which is not in ROUTES/,
  );
  t(
    'scalar exemption resolves as a one-member list',
    { 'g.mjs': "const ROUTES = ['/a', '/b'];\nconst ALLOW = '/b';\n" },
    SUBSET_RULE,
    null,
  );
  t(
    'scalar exemption pointing outside the subject list',
    { 'g.mjs': "const ROUTES = ['/a'];\nconst ALLOW = '/b';\n" },
    SUBSET_RULE,
    /ALLOW names \/b, which is not in ROUTES/,
  );
  t(
    'disjoint violated',
    { 'g.mjs': "const A = ['--ink'];\nconst B = ['--ink', '--canvas'];\n" },
    DISJOINT_RULE,
    /--ink is in both A and B/,
  );
  t('disjoint holds', { 'g.mjs': "const A = ['--ink'];\nconst B = ['--canvas'];\n" }, DISJOINT_RULE, null);
  t(
    'registered list has gone',
    { 'g.mjs': "const ROUTES = ['/a'];\n" },
    SUBSET_RULE,
    /registered list ALLOW no longer exists/,
  );
  t(
    'registered gate has gone',
    { 'other.mjs': 'const X = 1;\n' },
    SUBSET_RULE,
    /registered in check-list-parity but not found/,
  );
  t(
    'empty dependent list is a failure, not a pass',
    { 'g.mjs': "const ROUTES = ['/a'];\nconst ALLOW = [];\n" },
    SUBSET_RULE,
    /ALLOW contributed no routes keys/,
  );
  t(
    'commented-out route is not a member',
    { 'g.mjs': "const ROUTES = ['/a'];\nconst ALLOW = [\n  '/a',\n  // '/gone',\n];\n" },
    SUBSET_RULE,
    null,
  );
  t(
    'discovery guard — unregistered second route-keyed list',
    { 'g.mjs': "const ROUTES = ['/a'];\nconst ALLOW = ['/a'];\nconst OTHER = ['/z'];\n" },
    SUBSET_RULE,
    /OTHER is a route-keyed list in a gate that has 3 of them/,
  );
  t(
    'discovery guard — an unrelated entry silences it',
    { 'g.mjs': "const ROUTES = ['/a'];\nconst ALLOW = ['/a'];\nconst OTHER = ['/z'];\n" },
    [...SUBSET_RULE, { gate: 'g.mjs', kind: 'unrelated', of: 'OTHER', keys: 'routes', why: 'w' }],
    null,
  );
  t('discovery guard does not fire on a single-list gate', { 'g.mjs': "const ROUTES = ['/a'];\n" }, [], null);
  t(
    'nested literal does not end the capture early',
    { 'g.mjs': "const ROUTES = [{ path: '/a', v: { x: 1 } }, { path: '/b' }];\nconst ALLOW = ['/b'];\n" },
    SUBSET_RULE,
    null,
  );

  let failed = 0;
  for (const c of cases) {
    const { problems } = audit(c.sources, c.registry);
    const joined = problems.join('\n');
    const ok = c.expect === null ? problems.length === 0 : c.expect.test(joined);
    if (!ok) {
      failed += 1;
      console.error(
        `  FAIL  ${c.name}\n        expected ${c.expect ?? 'no problems'}\n        got: ${joined || '(no problems)'}`,
      );
    }
  }
  if (failed > 0) {
    console.error(`\ncheck-list-parity selftest: ${failed} of ${cases.length} case(s) failed\n`);
    process.exit(1);
  }
  console.log(
    `check-list-parity selftest: ${cases.length} case(s) — each reads the returned problem set, ` +
      'so a broken comparator cannot pass as an absence',
  );
}

/* ------------------------------------------------------------------------ */

if (process.argv.includes('--selftest')) {
  selftest();
} else {
  const files = readdirSync('scripts').filter(
    (f) => /^check-.*\.mjs$/.test(f) && !f.includes('selftest') && f !== 'check-list-parity.mjs',
  );
  const sources = new Map(files.map((f) => [f, readFileSync(`scripts/${f}`, 'utf8')]));
  const { problems, counted } = audit(sources);

  if (counted.pairs === 0) {
    console.error(
      '\ncheck-list-parity: no coupled list pair was compared. The registry is empty or every' +
        '\nentry failed to resolve, so this run asserted nothing.\n',
    );
    process.exit(1);
  }

  if (problems.length > 0) {
    console.error(`\ncheck-list-parity: ${problems.length} problem(s)\n`);
    for (const p of problems) console.error(`  ${p}`);
    console.error(
      '\nA gate consults more than one list. Adding a subject to one of them is not the same' +
        '\nas adding it to the others, and the source cannot say they have diverged — that is' +
        '\nwhy this file exists. CLAUDE.md, "adding a subject to a gate".\n',
    );
    process.exit(1);
  }

  console.log(
    `check-list-parity: ${counted.pairs} coupled list pair(s) across ${counted.multiListGates} ` +
      `multi-list gate(s), ${counted.keys} key(s) compared, ${counted.gatesScanned} gate(s) scanned`,
  );
}
