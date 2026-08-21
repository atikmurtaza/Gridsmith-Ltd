#!/usr/bin/env node
/**
 * check-schemas
 *
 * **The CMS schema is the one layer in this repository that no other gate can see.**
 *
 * `next build` never compiles `sanity/schemas/` — the Studio is a separate application and
 * the app reads Sanity over HTTP. So a typo in a `type:`, a `reference` to a document type
 * that does not exist, or a missing `isSeed` fails for an editor opening the Studio and for
 * nothing in CI. Four division workstreams build on this layer; it is the worst possible
 * place for a silent break.
 *
 * It imports the registry rather than parsing it, which is what makes the last assertion
 * possible: `validation` is a function, and calling it with a recording stand-in for Sanity's
 * `Rule` is the only way to establish that `service.pricingModel` is actually required rather
 * than merely documented as required.
 */
import { readFileSync } from 'node:fs';
import { CANONICAL_PROCESS } from '../lib/process/canonical.ts';
import { schemaTypes } from '../sanity/schemas/index.ts';

/**
 * **Hardcoded, deliberately — and this is the `check:tokens` side of the division CLAUDE.md
 * draws.** The question here is *does the schema layer declare the right types?*, so the
 * declarations are the subject and the expectation must come from outside them. Read off
 * `_shared/SCHEMA-CORE.md` §1–§2 plus `master/SCHEMA.md` (`processStep`, `companyDetails`).
 *
 * Deleting a type from the registry fails this list. Deriving the list from the registry
 * would delete the expectation along with the subject and stay green having measured less.
 */
const EXPECTED_OBJECTS = [
  'deliverable',
  'metric',
  'ctaBlock',
  'seoBlock',
  'pricingBlock',
  'protectedImage',
  'protectedVideo',
  'processStep',
  'groupSection',
  'continuityRow',
  'legalClause',
];
const EXPECTED_DOCUMENTS = [
  'service',
  'project',
  'faq',
  'testimonial',
  'post',
  'teamMember',
  'groupPage',
  'continuityExample',
  'legalDocument',
  'companyDetails',
];

/**
 * **Closed lists whose closure is the guarantee, not a convenience** (`N-03`).
 *
 * `groupPage.slug` is *singleton-per-slug*: exactly two documents may exist, because a third
 * slug is a route that no code renders — and the failure is silent, a published document with
 * no page.
 *
 * `groupSection.layout` is closed because `master/SCHEMA.md` §2 says `sunken-plain` "is a
 * layout value rather than a styling decision so it cannot be prettified by a later content
 * edit". The limits block is deliberately undesigned as an honesty device; a free-text field
 * lets a content edit choose a prettier treatment, which is the outcome being guarded against.
 *
 * Both are asserted here rather than trusted to the field's `options.list`, which Sanity treats
 * as a Studio affordance and does **not** enforce on write.
 */
const CLOSED_LISTS = [
  // Every closed field declares `options.list` — on a slug it renders nothing and exists so
  // this gate has a subject to compare against. Asserting only that a custom rule *exists*
  // proved the rule was there, not what it accepted, and widening the slug set passed silently.
  ['groupPage', 'slug', ['approach', 'about'], (v) => ({ current: v })],
  ['groupSection', 'layout', ['prose', 'two-column', 'sunken-plain', 'process', 'continuity'], (v) => v],
  // `L-01`. Same shape and same reason as `groupPage.slug`: a slug with no route is a
  // published document that renders nowhere, silently.
  ['legalDocument', 'slug', ['privacy', 'cookies', 'terms', 'client-terms', 'accessibility'], (v) => ({ current: v })],
];

/**
 * Sanity's built-in types. A field may name one of these without the registry defining it.
 *
 * Listed rather than pattern-matched: an unknown type name is exactly the defect this gate
 * exists to catch, so anything not registered and not on this list has to be a failure. If a
 * legitimate built-in is missing here it will surface as a loud, specific failure on the
 * commit that first uses it — which is the right way round.
 */
const BUILT_IN = new Set([
  'array', 'block', 'boolean', 'date', 'datetime', 'document', 'file', 'geopoint', 'image',
  'number', 'object', 'reference', 'slug', 'string', 'text', 'url', 'crossDatasetReference',
  'email', 'globalDocumentReference',
]);

const problems = [];

/**
 * **Every check counts its own iterations, and the summary prints those counters.**
 *
 * This file shipped the silent-insertion defect twice in one session, and an audit of all six
 * checks found the reason the second one survived: **three of the six printed a count derived
 * from the subject rather than from their own loop.** Emptying their input changed nothing in
 * the output — the type census still said "10 object type(s) and 9 document type(s)", the
 * `isSeed` line still said "all 8", and the field walk still claimed "every field type
 * resolved" — so the output could not distinguish *ran and passed* from *did not run*.
 *
 * A counter incremented inside the loop can only be non-zero if the loop executed. That is the
 * difference between a summary that reports and a summary that asserts, and it is what makes
 * `npm run check:schemas` output evidence rather than decoration.
 */
const counted = { expectations: 0, fields: 0, seedable: 0, stages: 0 };

const byName = new Map(schemaTypes.map((t) => [t.name, t]));
const documents = schemaTypes.filter((t) => t.type === 'document').map((t) => t.name);
const objects = schemaTypes.filter((t) => t.type === 'object').map((t) => t.name);

/** 1. The registry declares exactly the expected types — no more, no fewer. */
for (const name of EXPECTED_OBJECTS) {
  counted.expectations += 1;
  if (!objects.includes(name)) problems.push(`object type "${name}" is not registered`);
}
for (const name of EXPECTED_DOCUMENTS) {
  counted.expectations += 1;
  if (!documents.includes(name)) problems.push(`document type "${name}" is not registered`);
}
for (const name of [...objects, ...documents]) {
  if (![...EXPECTED_OBJECTS, ...EXPECTED_DOCUMENTS].includes(name)) {
    problems.push(
      `"${name}" is registered but not in this gate's expected list. If it is a new core type, ` +
        'add it here in the same commit; if it belongs to a division, it belongs in that ' +
        "division's schema file",
    );
  }
}

/**
 * 2. Every `type:` a field names resolves, and every `reference` points at a document type.
 *
 * The second half matters as much as the first: `to: [{ type: 'metric' }]` resolves — `metric`
 * is registered — and is still broken, because you cannot reference an object type. Sanity
 * reports that at Studio load, not at build.
 */
function walkFields(typeName, fields, path = '') {
  for (const field of fields ?? []) {
    counted.fields += 1;
    const where = `${typeName}${path}.${field.name ?? '(unnamed)'}`;
    if (!field.type) {
      problems.push(`${where} declares no type`);
      continue;
    }
    if (!BUILT_IN.has(field.type) && !byName.has(field.type)) {
      problems.push(`${where} has type "${field.type}", which is neither registered nor a built-in`);
    }
    for (const target of field.to ?? []) {
      if (!documents.includes(target.type)) {
        problems.push(
          `${where} references "${target.type}", which is not a document type — ` +
            'only documents can be referenced',
        );
      }
    }
    for (const member of field.of ?? []) {
      if (!member.type) {
        problems.push(`${where}[] declares no member type`);
        continue;
      }
      if (!BUILT_IN.has(member.type) && !byName.has(member.type)) {
        problems.push(`${where}[] has member type "${member.type}", which is neither registered nor a built-in`);
      }
      for (const target of member.to ?? []) {
        if (!documents.includes(target.type)) {
          problems.push(
            `${where}[] references "${target.type}", which is not a document type — ` +
              'only documents can be referenced',
          );
        }
      }
    }
    if (field.fields) walkFields(typeName, field.fields, `${path}.${field.name}`);
  }
}
for (const type of schemaTypes) walkFields(type.name, type.fields);

/**
 * 3. Every document type carries `isSeed` — `master/SCHEMA.md` §1, group-wide.
 *
 * `A-12`'s production build check reads this field to refuse a published placeholder. A
 * document type without it is invisible to that check: seed records of that type would
 * publish to production silently, which is the failure `FOUNDATION` §7 exists to prevent.
 *
 * `companyDetails` is exempt and is the only exemption. It is a singleton of statutory facts
 * with no seed variant — `check:launch` is what guards it, and it guards it harder.
 */
for (const name of documents) {
  if (name === 'companyDetails') continue;
  counted.seedable += 1;
  const type = byName.get(name);
  if (!type.fields?.some((f) => f.name === 'isSeed')) {
    problems.push(`document type "${name}" has no isSeed field — A-12's production check cannot see it`);
  }
}

/**
 * 4. **`service.pricingModel` is actually required** — CLAUDE.md non-negotiable #3, SC-6.
 *
 * *"Never publish a service page without pricing. Schema-enforced."* Nothing had ever checked
 * that the enforcement exists. `validation` is a function, so the only way to establish what
 * it does is to run it: `Rule` is replaced with a recorder that returns itself from every
 * method and logs the names, which is exactly how Sanity's fluent rules are used.
 */
function recordingRule() {
  const calls = [];
  const customFns = [];
  const rule = new Proxy(
    {},
    {
      get: (_t, prop) => {
        if (prop === Symbol.toPrimitive || typeof prop === 'symbol') return undefined;
        return (...args) => {
          calls.push(String(prop));
          if (String(prop) === 'custom' && typeof args[0] === 'function') customFns.push(args[0]);
          return rule;
        };
      },
    },
  );
  return { rule, calls, customFns };
}

function rulesFor(typeName, fieldName) {
  const field = byName.get(typeName)?.fields?.find((f) => f.name === fieldName);
  if (!field) {
    problems.push(`${typeName}.${fieldName} does not exist`);
    return [];
  }
  if (typeof field.validation !== 'function') {
    problems.push(`${typeName}.${fieldName} has no validation function`);
    return [];
  }
  const { rule, calls } = recordingRule();
  field.validation(rule);
  return calls;
}

const REQUIRED_FIELDS = [
  ['service', 'pricingModel', 'required', 'CLAUDE.md non-negotiable #3 / SC-6 — a service page cannot be published without pricing'],
  ['service', 'title', 'required', 'a service with no title cannot render'],
  ['project', 'metrics', 'min', 'SCHEMA-CORE §1 — at least one quantified metric'],
  ['protectedImage', 'alt', 'required', 'WCAG 1.1.1 — the CMS is the only place alt text can be enforced'],
  ['protectedVideo', 'alt', 'required', 'WCAG 1.1.1'],
  ['pricingBlock', 'variables', 'min', 'SCHEMA-CORE §2 — "what moves this number", min 2'],
  ['processStep', 'title', 'custom', 'the canonical six — _shared/00-PROCESS.md'],
  ['continuityExample', 'rows', 'min', 'master/SCHEMA.md §2 — at least four rows; two do not show continuity'],
  ['continuityExample', 'divisionsInvolved', 'min', 'at least two divisions, or it is not cross-division'],
  ['continuityExample', 'verified', 'custom', 'hard-true — required() alone would accept false'],
];

/**
 * **Rules that must accept one value and refuse another, run rather than counted** (`N-05`).
 *
 * `r.custom(v => v === true || 'message')` and `r.custom(() => true)` both *call* `.custom()`,
 * so the presence check above passes a rule that permits everything. `master/SCHEMA.md` §2
 * calls an invented continuity example "the most damaging possible piece of content on the
 * site", which is not a claim to leave resting on whether a function was invoked.
 */
const HARD_VALUES = [
  ['continuityExample', 'verified', [true], [false, undefined, 'true']],
];
for (const [typeName, fieldName, expected, why] of REQUIRED_FIELDS) {
  const calls = rulesFor(typeName, fieldName);
  if (calls.length > 0 && !calls.includes(expected)) {
    problems.push(
      `${typeName}.${fieldName} validation calls [${calls.join(', ')}] and never .${expected}() — ${why}`,
    );
  }
}

/**
 * 5. The closed lists are still closed, still hold the values they should, and are actually
 *    ENFORCED.
 *
 * Checked in both directions - a value added that is not expected, and an expected value that
 * has been dropped. A one-directional check passes a field someone widened, which is the
 * likelier accident.
 *
 * **`options.list` alone proves nothing.** Sanity treats it as a Studio affordance: it shapes
 * the dropdown and does not refuse a value written through the API. So the custom rule has to
 * be there too, and it is asserted by running the validation, the same way SC-6 is.
 *
 * **This block was written once and never inserted.** The constant was declared, the summary
 * line said "2 closed list(s) intact and enforced", and nothing iterated - a green result from
 * a check that did not exist. Found by proving the branch, not by reading the file.
 */
for (const [typeName, fieldName, expected, shape] of CLOSED_LISTS) {
  const field = byName.get(typeName)?.fields?.find((f) => f.name === fieldName);
  if (!field) {
    problems.push(`${typeName}.${fieldName} does not exist - its closed list cannot be checked`);
    continue;
  }
  const list = field.options?.list;
  if (!Array.isArray(list) && field.type !== 'slug') {
    problems.push(
      `${typeName}.${fieldName} has no options.list - the value set is open, and closure is ` +
        'the guarantee this field exists to provide',
    );
  } else if (Array.isArray(list)) {
    const actual = list.map((entry) => (typeof entry === 'string' ? entry : entry.value));
    for (const value of actual) {
      if (!expected.includes(value)) {
        problems.push(`${typeName}.${fieldName} allows "${value}", which is not in this gate's expected list`);
      }
    }
    for (const value of expected) {
      if (!actual.includes(value)) {
        problems.push(`${typeName}.${fieldName} no longer allows "${value}"`);
      }
    }
  }
  if (typeof field.validation !== 'function') {
    problems.push(`${typeName}.${fieldName} has no validation - options.list is not enforced on write`);
  } else {
    const { rule, calls, customFns } = recordingRule();
    field.validation(rule);
    if (!calls.includes('custom')) {
      problems.push(
        `${typeName}.${fieldName} never calls .custom() - options.list is a Studio affordance ` +
          'and does not refuse a value written through the API',
      );
    } else {
      /**
       * **The rule is run against values, not merely counted.**
       *
       * Asserting that `.custom()` is *called* proves a rule exists, not what it accepts —
       * and for a field with no `options.list` that was the entire closure claim. Widening
       * `GROUP_PAGE_SLUGS` from two entries to three passed silently until this ran, which
       * the branch proof found and reading the check did not.
       */
      const accepts = (value) => customFns.every((fn) => fn(shape(value), {}) === true);
      for (const value of expected) {
        if (!accepts(value)) problems.push(`${typeName}.${fieldName} refuses "${value}", which it must accept`);
      }
      const OUTSIDE = '__not-in-the-closed-list__';
      const refusals = customFns.map((fn) => fn(shape(OUTSIDE), {})).filter((r) => r !== true);
      if (refusals.length === 0) {
        problems.push(
          `${typeName}.${fieldName} accepts a value outside its list - the custom rule exists ` +
            'but does not close anything',
        );
      } else if (!Array.isArray(list)) {
        /**
         * **A field with no `options.list` states its accepted set in the rejection message,
         * and that message is the subject this compares against.**
         *
         * Sanity's `SlugOptions` has no `list` key, so there is nowhere else to read it from.
         * Asserting only that a custom rule *exists* proved the rule was there and not what it
         * allowed: widening `GROUP_PAGE_SLUGS` from two entries to three passed silently, which
         * the branch proof found and reading the check did not.
         */
        const message = String(refusals[0]);
        const enumerated = message.split('one of:')[1];
        if (!enumerated) {
          problems.push(
            `${typeName}.${fieldName} has no options.list, so its rejection message must ` +
              `enumerate the accepted set as "must be one of: a, b". Got: "${message}"`,
          );
        } else {
          const actual = enumerated.split(',').map((v) => v.trim()).filter(Boolean);
          for (const value of actual) {
            if (!expected.includes(value)) {
              problems.push(`${typeName}.${fieldName} accepts "${value}", which is not in this gate's expected list`);
            }
          }
          for (const value of expected) {
            if (!actual.includes(value)) problems.push(`${typeName}.${fieldName} no longer accepts "${value}"`);
          }
        }
      }
    }
  }
}

/**
 * 6. Hard-valued rules are RUN against values, not counted.
 *
 * **This block failed to insert twice before it ran** — the constant was declared, the summary
 * printed "1 hard-valued rule(s) run against 4 value(s)", and nothing iterated. Second
 * occurrence of that in this file in one session. It was found by proving the permissive-rule
 * branch, which is the argument for the rule in CLAUDE.md: a count is not evidence anything
 * counted, and this count is provable to report zero.
 */
for (const [typeName, fieldName, mustAccept, mustRefuse] of HARD_VALUES) {
  const field = byName.get(typeName)?.fields?.find((f) => f.name === fieldName);
  if (typeof field?.validation !== 'function') {
    problems.push(`${typeName}.${fieldName} has no validation — its hard value is not enforced`);
    continue;
  }
  const { rule, customFns } = recordingRule();
  field.validation(rule);
  if (customFns.length === 0) {
    problems.push(`${typeName}.${fieldName} never calls .custom() — required() alone accepts a falsy value`);
    continue;
  }
  const run = (value) => customFns.map((fn) => fn(value, {}));
  for (const value of mustAccept) {
    if (!run(value).every((r) => r === true)) {
      problems.push(`${typeName}.${fieldName} refuses ${JSON.stringify(value)}, which it must accept`);
    }
  }
  for (const value of mustRefuse) {
    if (run(value).every((r) => r === true)) {
      problems.push(
        `${typeName}.${fieldName} accepts ${JSON.stringify(value)} — the rule is present and ` +
          'permissive, which a presence check cannot see',
      );
    }
  }
}

/**
 * **A zero here means a check did not run, and that is a failure, not a clean result.**
 *
 * The three counters above are the ones that could previously not be made to report zero. If
 * any is zero the gate has measured nothing in that dimension, which is the state this file has
 * twice shipped while printing a confident summary.
 */
/**
 * 7. **The canonical six match `_shared/00-PROCESS.md`, which is the source of truth** (`N-06`).
 *
 * `lib/process/canonical.ts` is what renders and what the Sanity validator accepts. That file
 * is a *copy* of a table in a specification whose own header says the stages are FIXED and "not
 * open for revision, rewording or improvement by a later session". A copy with no check is a
 * second source of truth waiting to disagree with the first.
 *
 * **The expectation is the document and the subject is the code** — two different artefacts, so
 * this is not an expectation derived from its own subject. The document is parsed rather than
 * transcribed here for exactly that reason: transcribing it would make this file a third copy.
 *
 * Declaration, loop and counter are deliberately one hunk. The two silent insertions in this
 * file were both a loop whose anchor drifted while its constant and its summary line applied.
 */
const PROCESS_DOC = 'docs/_shared/00-PROCESS.md';
const docStages = [...readFileSync(PROCESS_DOC, 'utf8').matchAll(/^\|\s*(\d)\s*\|\s*\*\*([^*]+)\*\*/gm)].map(
  (m) => ({ number: Number(m[1]), title: m[2].trim() }),
);
counted.stages = 0;
if (docStages.length === 0) {
  problems.push(`${PROCESS_DOC}: no stage table rows matched — the canonical list was compared against nothing`);
}
for (const [i, stage] of docStages.entries()) {
  counted.stages += 1;
  const code = CANONICAL_PROCESS[i];
  if (!code) {
    problems.push(`${PROCESS_DOC} has stage ${stage.number} "${stage.title}" and the code has no ${i + 1}th stage`);
    continue;
  }
  if (code.title !== stage.title || code.number !== stage.number) {
    problems.push(
      `stage ${i + 1} is "${stage.number} ${stage.title}" in ${PROCESS_DOC} and ` +
        `"${code.number} ${code.title}" in lib/process/canonical.ts`,
    );
  }
}
if (CANONICAL_PROCESS.length !== docStages.length && docStages.length > 0) {
  problems.push(
    `lib/process/canonical.ts has ${CANONICAL_PROCESS.length} stages and ${PROCESS_DOC} has ` +
      `${docStages.length}`,
  );
}
// Rule 2: stage 6 always carries the qualifier, and it is a property rather than a formatting
// choice so a caller cannot drop it.
if (CANONICAL_PROCESS.at(-1)?.optional !== true) {
  problems.push('the last canonical stage is not marked optional — 00-PROCESS.md rule 2');
}

for (const [what, n] of Object.entries(counted)) {
  if (n === 0) problems.push(`the ${what} check iterated zero times — it did not run`);
}

if (problems.length > 0) {
  console.error(`\ncheck-schemas: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('');
  process.exit(1);
}

console.log(
  `check-schemas: ${counted.expectations} expected type(s) confirmed registered across ` +
    `${objects.length} object and ${documents.length} document type(s); ` +
    `${counted.fields} field(s) walked — every type resolved, every reference points at a document`,
);
console.log(
  `check-schemas: ${HARD_VALUES.length} hard-valued rule(s) run against ` +
    `${HARD_VALUES.reduce((n, [, , a, r]) => n + a.length + r.length, 0)} value(s) — accepted and refused, not merely present`,
);
console.log(
  `check-schemas: ${counted.stages} canonical process stage(s) matched against ${PROCESS_DOC}, ` +
    'the source of truth — names never travel through the CMS',
);
console.log(
  `check-schemas: ${CLOSED_LISTS.length} closed list(s) intact and enforced by a custom rule, ` +
    'not only by the Studio affordance',
);
console.log(
  `check-schemas: isSeed on all ${counted.seedable} seedable document type(s); ` +
    `${REQUIRED_FIELDS.length} validation rule(s) asserted by running them, including SC-6`,
);
