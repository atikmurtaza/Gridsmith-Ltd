import { defineArrayMember, defineField, defineType } from 'sanity';
import {
  CAPABILITY_GROUPS,
  capabilityGroupRule,
  professionalScopeRule,
} from '../../lib/services/architecture.ts';

/**
 * Core document types — `SCHEMA-CORE.md` §1. **One CMS, one definition.** Each division's
 * `SCHEMA.md` adds its own document types and its extensions to these; nothing here is
 * duplicated per division.
 */

const DIVISIONS = ['design', 'digital', 'press'];

/**
 * **`isSeed` is added to every document type — `master/SCHEMA.md` §1, group-wide.**
 *
 * Set by the seed script, never by hand, which is what `readOnly` says. The production build
 * fails if any `isSeed: true` document is published (`TECH-SPEC.md` §6) — that check is
 * `A-12`, and this field is the thing it reads. Adding it per type rather than once means it
 * cannot be quietly missing from the type somebody adds next; `check:schemas` asserts every
 * document type carries it.
 */
const isSeed = defineField({
  name: 'isSeed',
  type: 'boolean',
  initialValue: false,
  readOnly: true,
  description: 'Placeholder content. Cannot be published in production.',
});

/**
 * A service — `GS-P03`, reconciled to `GS-D001`/`GS-D002` and `_shared/SERVICE-ARCHITECTURE.md`.
 *
 * **There is no price field, and `check:schemas` refuses one on any type.** SC-6 — "a service
 * page physically cannot be saved without pricing" — was superseded by `GS-D002`: Gridsmith
 * quotes bespoke work, so a public service leads to a contextual enquiry, not to a figure. The
 * old `pricingModel` was removed rather than made optional, because an optional price field is
 * an invitation to publish one.
 *
 * **Nothing about proof is required either.** `relatedProjects` stays optional for work
 * Gridsmith holds permission to publish; a service is publishable with none (`GS-D001`).
 *
 * `capabilityGroup` is a closed list owned by `lib/services/architecture.ts`, and the rule
 * refuses a group from another division. `ctaLabel` is copy; the CTA destination is not
 * editable — it is always the enquiry form, carrying this service as context.
 */
export const service = defineType({
  name: 'service',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'division', type: 'string', options: { list: DIVISIONS }, validation: (r) => r.required() }),
    defineField({
      name: 'capabilityGroup',
      type: 'string',
      description:
        'The approved capability group. A new service inside a group is content; a new group is an architecture decision (lib/services/architecture.ts).',
      options: {
        list: CAPABILITY_GROUPS.map((g) => ({ title: `${g.division} — ${g.label}`, value: g.key })),
      },
      validation: (r) => r.required().custom((value, context) => capabilityGroupRule(value, context)),
    }),
    defineField({ name: 'problem', type: 'text', rows: 4, title: 'Summary', description: "Concise summary — the buyer's situation." }),
    defineField({
      name: 'description',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      description: 'Detailed description. No prices, guarantees, turnaround promises or unconfirmed credentials.',
    }),
    defineField({
      name: 'capabilities',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description:
        'What Gridsmith can do within this service — the approved capabilities it covers (GS-O006). Plain names, not claims: no standards, certifications or credentials.',
    }),
    defineField({ name: 'searchIntent', type: 'string', description: 'The exact query this page targets.' }),
    defineField({ name: 'deliverables', type: 'array', of: [defineArrayMember({ type: 'deliverable' })] }),
    defineField({ name: 'process', type: 'array', of: [defineArrayMember({ type: 'processStep' })] }),
    defineField({
      name: 'relatedServices',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'service' }] })],
    }),
    defineField({
      name: 'collaborators',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { list: DIVISIONS },
      description:
        'Other divisions whose discipline this service draws on. The client relationship stays with this division.',
    }),
    defineField({
      name: 'faqs',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'faq' }] })],
    }),
    defineField({
      name: 'relatedProjects',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })],
      description: 'Optional. Only work Gridsmith holds written permission to publish (GS-D001).',
    }),
    defineField({
      name: 'ctaLabel',
      type: 'string',
      description: 'Overrides the division CTA wording. The destination is always the enquiry form.',
    }),
    defineField({
      name: 'professionalScopeConfirmed',
      type: 'boolean',
      initialValue: false,
      description:
        'Technical group only. Set only when professional scope and PI cover are confirmed in writing (GS-O005, GS-X002). Production refuses an unconfirmed published technical service.',
      validation: (r) => r.custom((value, context) => professionalScopeRule(value, context)).warning(),
    }),
    defineField({ name: 'seo', type: 'seoBlock' }),
    defineField({ name: 'order', type: 'number' }),
    defineField({ name: 'published', type: 'boolean', initialValue: false }),
    isSeed,
  ],
  preview: { select: { title: 'title', subtitle: 'division' } },
});

/**
 * Portfolio / case study — **dormant since `GS-P03`.** `GS-D001`: no public route renders this
 * type, and none may until publication permission exists for the work it would hold. The type is
 * kept so consented work has somewhere to go; restoring a public route must restore the
 * `confidential` projection guard described below (removed from `lib/sanity/queries.ts` with the
 * routes, recoverable from `9a804c4f`).
 *
 * `divisions` is an **array**, and that is the point of the type: cross-division work is the
 * best proof the group structure is real, so a project belongs to as many as it belongs to.
 * `isCrossDivision` is **not a field** — `master/SCHEMA.md` §1 is explicit that it is derived
 * (`count(divisions) > 1`) by a GROQ projection and never hand-set, so the CMS does not expose
 * it and there is nothing to fall out of sync.
 *
 * **`confidential` is enforced in the query layer, not here and not in components.** When it
 * is true, `clientName` must never be returned by a public GROQ query — the projection
 * substitutes `clientDisplay`. A component-level check would leak the name into the RSC
 * payload before anything decided not to render it.
 */
export const project = defineType({
  name: 'project',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({
      name: 'divisions',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { list: DIVISIONS },
      validation: (r) => r.min(1),
    }),
    defineField({ name: 'track', type: 'string' }),
    defineField({
      name: 'services',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'service' }] })],
    }),
    defineField({ name: 'clientName', type: 'string', description: 'Never rendered when confidential is true.' }),
    defineField({ name: 'clientDisplay', type: 'string', description: 'e.g. "A UK M&E contractor" when under NDA.' }),
    defineField({ name: 'confidential', type: 'boolean', initialValue: false }),
    defineField({ name: 'industry', type: 'string' }),
    defineField({ name: 'year', type: 'number' }),
    defineField({ name: 'summary', type: 'text', rows: 2, description: 'Card copy.' }),
    defineField({ name: 'challenge', type: 'array', of: [defineArrayMember({ type: 'block' })] }),
    defineField({ name: 'approach', type: 'array', of: [defineArrayMember({ type: 'block' })] }),
    defineField({ name: 'outcome', type: 'array', of: [defineArrayMember({ type: 'block' })] }),
    /**
     * **Optional since `GS-P03`.** This used to require at least one quantified metric, which
     * forced every seed case study to carry an invented figure. Under `GS-D001` this type is
     * dormant capability for work Gridsmith has permission to publish, and real permitted work
     * may have no measured outcome — a schema that demands one is a schema that asks for one to
     * be made up.
     */
    defineField({ name: 'metrics', type: 'array', of: [defineArrayMember({ type: 'metric' })] }),
    defineField({
      name: 'media',
      type: 'array',
      of: [defineArrayMember({ type: 'protectedImage' }), defineArrayMember({ type: 'protectedVideo' })],
    }),
    defineField({ name: 'coverImage', type: 'protectedImage' }),
    defineField({ name: 'testimonial', type: 'reference', to: [{ type: 'testimonial' }] }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
    // master/SCHEMA.md §1 — master-layer additions. `isCrossDivision` is deliberately absent.
    defineField({ name: 'masterFeatured', type: 'boolean', initialValue: false, description: 'Eligible for the homepage selected-work block.' }),
    defineField({ name: 'continuityStory', type: 'text', rows: 4, description: 'A client served across divisions or over time — the evidence behind /approach.' }),
    defineField({ name: 'seo', type: 'seoBlock' }),
    isSeed,
  ],
  preview: { select: { title: 'title', subtitle: 'industry' } },
});

export const faq = defineType({
  name: 'faq',
  type: 'document',
  fields: [
    defineField({ name: 'question', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'answer', type: 'array', of: [defineArrayMember({ type: 'block' })], validation: (r) => r.required() }),
    defineField({ name: 'division', type: 'string', options: { list: DIVISIONS } }),
    defineField({ name: 'track', type: 'string' }),
    defineField({ name: 'category', type: 'string' }),
    defineField({ name: 'order', type: 'number' }),
    isSeed,
  ],
  preview: { select: { title: 'question', subtitle: 'division' } },
});

/**
 * `verified` is a boolean an editor sets, and it means someone confirmed the person said
 * this. It is not decoration: `master/PROJECT-RULES.md` treats an unverifiable claim the same
 * way it treats an invented one.
 */
export const testimonial = defineType({
  name: 'testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'quote', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'authorName', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'authorRole', type: 'string' }),
    defineField({ name: 'authorCompany', type: 'string' }),
    defineField({ name: 'authorPhoto', type: 'image' }),
    defineField({ name: 'project', type: 'reference', to: [{ type: 'project' }] }),
    defineField({ name: 'division', type: 'string', options: { list: DIVISIONS } }),
    defineField({ name: 'verified', type: 'boolean', initialValue: false }),
    /**
     * **Where the reader can go and check it themselves.** `verified` is an editor's
     * assertion; these two are the reader's. The six testimonials on the site today are
     * public Freelancer reviews reproduced verbatim, and a quote a visitor cannot trace back
     * to its source is indistinguishable from one that was written in-house — which is the
     * failure mode `PROJECT-RULES.md` §5 treats the same as invention.
     *
     * Not `required`: a testimonial given directly to Gridsmith by email has no public URL,
     * and forcing one would push an editor to invent a plausible link.
     */
    defineField({ name: 'sourceUrl', type: 'url', description: 'Public page where this review can be read.' }),
    defineField({ name: 'sourceLabel', type: 'string', description: 'e.g. "Freelancer.com verified review".' }),
    /**
     * **A generalised category of work, never the source's own project title** — `GS-O011`,
     * owner decision of 16 September 2026. A verbatim Freelancer project title is searchable
     * straight back to one client engagement, and one of the six named a client's brand
     * outright, which under `GS-D001` is identifiable client work published without permission.
     *
     * Leave it empty rather than write something you are unsure of: the quote, the attribution
     * and the source link are what make a review worth printing, and none of them needs this.
     * `check:service-content` refuses any known identifying fragment here.
     */
    defineField({
      name: 'projectTitle',
      type: 'string',
      title: 'Category of work',
      description:
        'Generalised category only — no client, company, brand or product name, and never the source’s verbatim project title (GS-O011). Leave empty if generalising would leave nothing meaningful.',
    }),
    isSeed,
  ],
  preview: { select: { title: 'authorName', subtitle: 'authorCompany' } },
});

/**
 * Insights.
 *
 * **`author` is a string and `readingTime` is stored, and both are spec gaps rather than
 * decisions.** `SCHEMA-CORE.md` lists them as bare field names with no type. `author` could
 * reasonably be a reference to `teamMember`; `readingTime` could reasonably be computed from
 * `body` at query time rather than typed by hand. Both are logged as `M-P2-10` and the
 * conservative shape is used meanwhile: a string cannot dangle, and a stored number cannot be
 * wrong in a way nobody sees. `N-13` is the first row that renders either.
 */
export const post = defineType({
  name: 'post',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'division', type: 'string', options: { list: DIVISIONS } }),
    defineField({ name: 'excerpt', type: 'text', rows: 3 }),
    defineField({ name: 'body', type: 'array', of: [defineArrayMember({ type: 'block' })] }),
    defineField({ name: 'author', type: 'string' }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'updatedAt', type: 'datetime' }),
    defineField({ name: 'readingTime', type: 'number', description: 'Minutes.' }),
    defineField({
      name: 'relatedServices',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'service' }] })],
    }),
    defineField({ name: 'seo', type: 'seoBlock' }),
    isSeed,
  ],
  preview: { select: { title: 'title', subtitle: 'division' } },
});

/**
 * `divisions` and `isPublic` come from `master/SCHEMA.md`'s extension of the core type —
 * *"Adds `isPublic` (boolean), `divisions[]`, `order`. Only `isPublic: true` members render
 * on `/about`."* The core file says `division` singular; the extension supersedes it, and
 * implementing both would give the type two fields meaning one thing.
 *
 * `isPublic` defaults **false**. A person appearing on a public website is a decision someone
 * makes, not the absence of one.
 */
export const teamMember = defineType({
  name: 'teamMember',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', type: 'string' }),
    defineField({
      name: 'divisions',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { list: DIVISIONS },
    }),
    defineField({ name: 'bio', type: 'text', rows: 4 }),
    defineField({ name: 'photo', type: 'image' }),
    defineField({ name: 'credentials', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
    defineField({ name: 'linkedin', type: 'url' }),
    defineField({ name: 'isPublic', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', type: 'number' }),
    isSeed,
  ],
  preview: { select: { title: 'name', subtitle: 'role' } },
});

export const coreDocumentTypes = [service, project, faq, testimonial, post, teamMember];
