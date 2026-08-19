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
];
const EXPECTED_DOCUMENTS = [
  'service',
  'project',
  'faq',
  'testimonial',
  'post',
  'teamMember',
  'groupPage',
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

const byName = new Map(schemaTypes.map((t) => [t.name, t]));
const documents = schemaTypes.filter((t) => t.type === 'document').map((t) => t.name);
const objects = schemaTypes.filter((t) => t.type === 'object').map((t) => t.name);

/** 1. The registry declares exactly the expected types — no more, no fewer. */
for (const name of EXPECTED_OBJECTS) {
  if (!objects.includes(name)) problems.push(`object type "${name}" is not registered`);
}
for (const name of EXPECTED_DOCUMENTS) {
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

if (problems.length > 0) {
  console.error(`\ncheck-schemas: ${problems.length} problem(s)\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('');
  process.exit(1);
}

console.log(
  `check-schemas: ${objects.length} object type(s) and ${documents.length} document type(s), ` +
    'every field type resolved, every reference points at a document',
);
console.log(
  `check-schemas: ${CLOSED_LISTS.length} closed list(s) intact and enforced by a custom rule, ` +
    'not only by the Studio affordance',
);
console.log(
  `check-schemas: isSeed on all ${documents.length - 1} seedable document type(s); ` +
    `${REQUIRED_FIELDS.length} validation rule(s) asserted by running them, including SC-6`,
);
