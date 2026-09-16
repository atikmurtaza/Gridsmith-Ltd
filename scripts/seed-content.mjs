/**
 * `S-01` — seeds the **development** dataset with structurally complete, visibly fake content
 * for every document type that exists (`FOUNDATION` §7).
 *
 * ## What is real here, and what is not — three tiers since `GS-P04`
 *
 * **Everything this script writes carries `isSeed: true` except the testimonials**, and
 * `isSeed` is the machine-enforced production block: `check:launch` refuses a production
 * dataset containing a published seed record, and that assertion has a committed specimen.
 * Non-negotiable #4 rests on the flag, not on a string.
 *
 * 1. **Real, not seed** — the six `testimonial` documents. Public Freelancer reviews reproduced
 *    verbatim, attributed, carrying `sourceUrl` so a reader can check them. `isSeed: false`,
 *    `verified: true`. **They must never be reworded**: a paraphrased review is an invented one.
 *    Their project titles were anonymised at `GS-P04` (`GS-O011`) — titles only; no quote was
 *    touched. See the block above `REVIEWS`.
 * 2. **Truthful development content** — the `service` documents, written at `GS-P04` against the
 *    owner-approved catalogue (`GS-O006`). `isSeed: true` and deliberately **not** `[SEED]`-marked:
 *    the marker means *fabricated*, this is not, and the phase's purpose was a foundation someone
 *    can review. The wording is still agent-authored and unapproved — `GS-O013`.
 * 3. **Visibly fake placeholder** — everything else: team, FAQs, posts, group pages. `isSeed: true`
 *    and `[SEED]`-marked in its rendered text, because it *is* fabricated.
 *
 * `continuityExample` is **not seeded and cannot be**. Its `verified` field is hard-true
 * (`N-05`), so a placeholder would have to assert that someone confirmed a story that did not
 * happen. The component renders its empty state until `Q-M6` supplies a real one.
 *
 * ## No prices and no case studies — `GS-P03`
 *
 * `GS-D002` removed every price field from the schema and `GS-D001` removed every public portfolio
 * route, so this script writes neither. Services follow the approved capability groups in
 * `lib/services/architecture.ts`.
 *
 * ## It deletes, since `GS-P04` — `GS-T007`
 *
 * `createOrReplace` never removes anything, so until `GS-P04` every record this script had
 * *stopped* writing stayed published: 30 pre-`GS-P03` priced services with no capability group
 * and 24 seed projects for deleted routes. Obsolete seed is now deleted in the same transaction,
 * **by provenance and never by type** — a candidate must carry both `isSeed: true` and an `_id`
 * beginning `seed-`, and a disagreement between the two markers stops the run. See the block
 * above the transaction.
 *
 * ## No image assets
 *
 * Nothing here uploads one. `FOUNDATION` §7.7 forbids fabricated drawings, covers and
 * screenshots, and the remaining permitted form — "neutral geometric placeholders at correct
 * aspect ratios" — is a *rendering* concern, not content. Components draw them from tokens, so
 * there is no asset to ingest, no LCP image to download, and nothing to delete when real work
 * arrives. `protectedImage.alt` is required, which an empty `media` array satisfies by being
 * empty rather than by carrying a placeholder alt that describes nothing.
 *
 * ## Dataset
 *
 * `development`, hardcoded, for the same reason `seed-company-details.mjs` hardcodes it: a seed
 * script that follows `NEXT_PUBLIC_SANITY_DATASET` is one mis-set variable away from putting
 * placeholder content into live. Run with `npm run seed`.
 */
import { rmSync } from 'node:fs';
import { createClient } from '@sanity/client';
import { SANITY_API_VERSION, SANITY_PROJECT_ID, PRODUCTION_DATASET } from '../sanity/project.ts';
import { CANONICAL_PROCESS } from '../lib/process/canonical.ts';
import { LEGAL_DOCUMENTS } from './seed-legal.mjs';
import { PROCESS_DETAIL, SERVICES } from './service-content.mjs';
import { anonymityProblems } from './service-content-rules.mjs';

const DATASET = 'development';

/**
 * **The production guard, asserted rather than assumed** — `GS-P04`.
 *
 * `DATASET` was already a hardcoded literal, for the reason the header gives: a seed script that
 * followed `NEXT_PUBLIC_SANITY_DATASET` is one mis-set variable away from writing placeholder
 * content into live. `GS-P04` added deletion to this script, which changes the cost of being
 * wrong from "extra documents" to "missing ones", so the literal is now compared against the
 * name that means live instead of being trusted because it looks right.
 *
 * It reads as unreachable code and that is the point: it is one edit away from being reachable,
 * and the edit that would reach it is exactly the edit nobody should make. `check:service-content`
 * proves the comparison fires by calling it with the production name.
 */
if (DATASET === PRODUCTION_DATASET) {
  console.error(
    `\nseed-content: refusing to run against "${DATASET}", which is the production dataset.` +
      '\nThis script creates, replaces AND DELETES documents. It exists for development only.\n',
  );
  process.exit(1);
}

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  console.error(
    '\nseed-content: SANITY_API_WRITE_TOKEN is not set. It lives in .env.local, which is\n' +
      'gitignored. Run via `npm run seed`, which passes --env-file=.env.local.\n',
  );
  process.exit(1);
}

const S = '[SEED]';
const slugOf = (s) => ({ _type: 'slug', current: s });
const key = (i) => ({ _key: `k${i}` });
const blocks = (...paragraphs) =>
  paragraphs.map((text, i) => ({
    _type: 'block',
    _key: `b${i}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `s${i}`, text, marks: [] }],
  }));

const seo = (title, description) => ({ _type: 'seoBlock', metaTitle: title, metaDescription: description });

const DIVISION_NAME = { design: 'Gridsmith Design', digital: 'Gridsmith Digital', press: 'Gridsmith Press' };

// ---------------------------------------------------------------------------
// Services — the owner-approved catalogue (`GS-O006`), written as development content
// ---------------------------------------------------------------------------

/**
 * Division detail per stage, keyed by canonical title — rule 3 of `00-PROCESS.md`. The
 * **names come from the constant**, never from this file, so a seed record cannot introduce a
 * seventh stage or reword one of the six. The detail itself is `PROCESS_DETAIL` in
 * `service-content.mjs`.
 *
 * **`duration` and `clientTime` are left unset on purpose.** `processStep` has both fields and
 * the service page renders them when present. A duration is an operational commitment, and no
 * owner fact supplies one — a plausible "2–3 weeks" would be precisely the invented figure
 * `CLAUDE.md` #2 forbids. The page reads correctly without them because every block is
 * conditional.
 */
const processFor = (division) =>
  CANONICAL_PROCESS.map((stage, i) => ({
    _type: 'processStep',
    ...key(i),
    number: stage.number,
    title: stage.title,
    description: stage.description,
    divisionDetail: PROCESS_DETAIL[division][stage.title],
  }));

/**
 * **These records carry `isSeed: true` and no `[SEED]` text marker, and that is deliberate.**
 *
 * The marker labels *visibly fabricated* text — a placeholder registered office, a
 * `[SEED] Placeholder Name`. This content is not fabricated: it describes services the owner
 * confirmed at `GS-O006` in plain factual terms, and the point of `GS-P04` is a foundation
 * someone can actually review. Marking truthful copy as fake makes the development site
 * unreadable and teaches a reviewer to ignore the marker where it still means something.
 *
 * What stops it reaching production is unchanged and is machine-enforced rather than textual:
 * `isSeed: true`, and `check:launch` refusing a production dataset that contains a published
 * seed record — an assertion with a committed specimen. Non-negotiable #4 is intact.
 * `scripts/service-content.mjs` documents the rules the copy itself was written under.
 */
const serviceDocs = Object.entries(SERVICES).flatMap(([division, rows]) =>
  rows.map((row, i) => ({
    _id: `seed-service-${division}-${row.slug}`,
    _type: 'service',
    title: row.title,
    slug: slugOf(row.slug),
    division,
    capabilityGroup: row.group,
    capabilities: row.covers,
    searchIntent: row.searchIntent,
    problem: row.summary,
    description: blocks(...row.description),
    deliverables: row.deliverables.map(([label, detail, included = true], j) => ({
      _type: 'deliverable',
      ...key(j),
      label,
      detail,
      included,
    })),
    process: processFor(division),
    collaborators: row.collaborators,
    // Every technical record is published here and unconfirmed, which is allowed off production
    // and refused on it. That combination is the subject `check:launch`'s technical limb needs.
    professionalScopeConfirmed: false,
    seo: seo(`${row.title} — ${DIVISION_NAME[division]}`, row.summary),
    order: i + 1,
    published: true,
    isSeed: true,
  })),
);

/**
 * `relatedServices` is a reference array, so it is resolved after the ids are known rather than
 * inline. A `related` slug naming a record that does not exist would write a dangling reference
 * that renders as nothing, so it is a hard failure instead.
 */
const serviceIdBySlug = new Map(
  Object.entries(SERVICES).flatMap(([division, rows]) =>
    rows.map((row) => [row.slug, `seed-service-${division}-${row.slug}`]),
  ),
);
const danglingRelated = [];
for (const [division, rows] of Object.entries(SERVICES)) {
  for (const row of rows) {
    const doc = serviceDocs.find((d) => d._id === `seed-service-${division}-${row.slug}`);
    doc.relatedServices = (row.related ?? []).map((slug, j) => {
      const id = serviceIdBySlug.get(slug);
      if (!id) danglingRelated.push(`${row.slug} -> ${slug}`);
      return { _type: 'reference', ...key(j), _ref: id ?? slug };
    });
  }
}
if (danglingRelated.length > 0) {
  console.error('\nseed-content: relatedServices names a slug no record defines:\n');
  for (const d of danglingRelated) console.error(`  ${d}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Testimonials — REAL. Verbatim, attributed, traceable. Never reworded, never [SEED].
// ---------------------------------------------------------------------------

const FREELANCER_PROFILE = 'https://www.freelancer.com/u/GridsmithLTD';

/**
 * Six public reviews from Gridsmith's Freelancer profile, transcribed **verbatim** on
 * 21 August 2026 — including the reviewers' own punctuation, capitalisation and typos.
 *
 * They are the only non-seed content this script writes. `verified: true` is defensible
 * because `sourceUrl` lets any reader check it; that is what the field is for.
 *
 * `authorCompany` is deliberately absent. Freelancer shows a first name and a handle, and
 * inferring an employer from that would be inventing an attribution.
 *
 * ## Project titles are anonymised — `GS-O011`, 16 September 2026
 *
 * The owner decided that identifiable project titles come off every review. They were the
 * source's own titles, which made each one searchable straight back to a single client
 * engagement, and `Artistic Logo Design for Casglu` named a client's brand outright — under
 * `GS-D001` that is identifiable client work published without permission.
 *
 * **The rule applied, mechanically:** strip every client name, brand name and product
 * identifier from the source title, keeping only the generic category of work; where stripping
 * leaves nothing meaningful, the title is omitted. `Ultra-Thin Wallet-Sized Wireless Charger
 * Design` reduces to "Design", which is not a category, so Stamos's review carries no title —
 * and an absent title costs nothing, because the quote, the name and the source link are what
 * make a review worth printing.
 *
 * **No quote was touched.** Every body below is byte-identical to the 21 August transcription,
 * and none of the six contains a client name, so nothing had to be withheld. The reviewers'
 * own names and public handles stay: they are the attribution that makes the review checkable
 * at the source, not client identities. Freelancer's star ratings were never transcribed and
 * the schema has no field for one, so none is stated — inventing a rating is inventing evidence.
 *
 * `check:service-content` refuses any of the removed fragments here or in the dataset.
 *
 * `[id, name, handle, categoryOfWork, division, quote]`
 */
const REVIEWS = [
  ['tom', 'Tom', '@tommyb3210', 'Ecommerce theme customisation', 'digital',
    "The work was completed to a high standard, and they were happy to make revisions where needed until everything was working exactly as expected. They were knowledgeable with Shopify and implemented the changes professionally and efficiently. Overall, I'm very happy with the service and wouldn't hesitate to work with them again on future Shopify projects. Highly recommended!"],
  ['elizabeth', 'Elizabeth', null, 'Logo design', 'design',
    "I didn't really have a very clear brief in mind, but GridsmithLTD managed to turn my vague idea into a selection of great logo choices for me to choose from, really added value with additional things I hadn't thought of an delivered back much more than my initial request. I would happily work with them again in future, they made the process incredibly smooth and efficient."],
  ['chad', 'Chad', null, '3D modelling', 'design',
    'He did 3D work for me. Very good work. I love it. I have more to do and when i have the budget im going to ask him to do it.'],
  // No category: the source title was a product identifier end to end, and the quote does not
  // say what the work was. Guessing one would be inventing a fact about a client engagement.
  ['stamos', 'Stamos', null, null, 'design',
    'Very flexible and understanding!'],
  ['stephanie', 'Stephanie', null, 'Photo editing', 'design',
    'They were very communicative and did an excellent job. On top of that, they were the first person for this project who was able to answer my questions and talk about their experience doing these types of projects which made me feel confident in hiring Gridsmith.'],
  ['b-edward', 'B-Edward', null, 'Presentation graphics', 'design',
    'Was relieved to find a professional who was able to"get" my thinking, anticipate my needs and execute my assignment so quickly!'],
];

const testimonialDocs = REVIEWS.map(([id, name, handle, projectTitle, division, quote]) => ({
  _id: `testimonial-freelancer-${id}`,
  _type: 'testimonial',
  quote,
  authorName: handle ? `${name} (${handle})` : name,
  authorRole: null,
  division,
  projectTitle,
  sourceUrl: FREELANCER_PROFILE,
  sourceLabel: 'Freelancer.com verified review',
  verified: true,
  isSeed: false,
}));

// ---------------------------------------------------------------------------
// Team — [SEED], and `isPublic` is the field that decides whether a person appears
// ---------------------------------------------------------------------------

/**
 * **Placeholder people, named as placeholders, and never public — `GS-O004`.**
 *
 * `Q-M9` is answered: the owner publishes **no** team members. The company is represented
 * institutionally, and there is no founder profile, employee profile or placeholder person on
 * the site. `/about`'s roster, `listPublicTeam` and the `TeamMember` type were deleted at
 * `GS-R001`, so nothing renders these at all.
 *
 * **`isPublic` was `true` here, and that is how four `[SEED] Placeholder Name` cards came to be
 * served on `/about` under the heading "Who you will work with".** The schema defaults the field
 * false and the docstring above it explains why — a person appearing on a public website is a
 * decision someone makes rather than the absence of one — and this seed overrode that default
 * on every record without saying so. The renderer is gone, which is the structural fix; this is
 * the second half, so that re-running the seed cannot recreate the condition for whatever reads
 * `teamMember` next.
 *
 * A seed team member whose name reads like a real person would be a fabricated credential on a
 * public site, which `CLAUDE.md` #2 forbids outright, so the names *are* the marker.
 */
const teamDocs = [
  ['founder', 'Founder & Director', ['design', 'digital', 'press'], 'Leads every engagement and is the point of contact on multi-division work.'],
  ['design-lead', 'Design Lead', ['design'], 'Brand, 3D and the engineering drawing set.'],
  ['digital-lead', 'Digital Lead', ['digital'], 'Web, software and AI integration.'],
  ['press-lead', 'Press Lead', ['press'], 'Editorial, production and author platforms.'],
].map(([id, role, divisions, bio], i) => ({
  _id: `seed-team-${id}`,
  _type: 'teamMember',
  name: `${S} Placeholder Name`,
  role,
  divisions,
  bio: `${S} ${bio} This is placeholder text for a person whose public listing has not been decided (Q-M9).`,
  credentials: [`${S} Placeholder credential`],
  // GS-O004: never. See the docstring above — this was `true`.
  isPublic: false,
  order: i + 1,
  isSeed: true,
}));

// ---------------------------------------------------------------------------
// FAQs — 15 per division (FOUNDATION §7 asks for 12–18)
// ---------------------------------------------------------------------------

const FAQ_TEMPLATES = [
  ['How long does a typical project take?', 'timelines'],
  ['What do you need from me before we start?', 'process'],
  ['How is a quote put together?', 'quotation'],
  ['Do I own the work when it is finished?', 'rights'],
  ['What happens if I need changes after delivery?', 'process'],
  ['Can you work with our existing suppliers?', 'process'],
  ['Do you take on small pieces of work?', 'scope'],
  ['What if my project spans more than one of your divisions?', 'group'],
  ['How do you handle confidential work?', 'legal'],
  ['What are your payment terms?', 'quotation'],
  ['Who will actually be doing the work?', 'process'],
  ['How do you keep me updated?', 'process'],
  ['What happens if the project stalls at my end?', 'process'],
  ['Can you take over work someone else started?', 'scope'],
  ['When would you tell me to go elsewhere?', 'honesty'],
];

const faqDocs = ['design', 'digital', 'press'].flatMap((division) =>
  FAQ_TEMPLATES.map(([question, category], i) => ({
    _id: `seed-faq-${division}-${i + 1}`,
    _type: 'faq',
    question: `${S} ${question}`,
    answer: blocks(
      `${S} Placeholder answer for "${question}" as it applies to Gridsmith ${division[0].toUpperCase()}${division.slice(1)}. ` +
        'Real answers are written before launch and are not generated from a template.',
    ),
    division,
    category,
    order: i + 1,
    isSeed: true,
  })),
);

// ---------------------------------------------------------------------------
// Posts — the /insights hub needs enough to exercise its grid and its empty state
// ---------------------------------------------------------------------------

const POSTS = [
  ['What an engineering drawing has to say before a workshop will quote it', 'design', 6],
  ['Renders are not photographs, and clients can tell', 'design', 4],
  ['Choosing between a rebuild and a rescue', 'digital', 7],
  ['What AI integration costs when you count the evaluation', 'digital', 8],
  ['Why your site is slow, measured rather than guessed', 'digital', 5],
  ['Keeping your own ISBN, and why it matters later', 'press', 6],
  ['Ghostwriting: what the interview programme actually involves', 'press', 9],
  ['A content programme nobody has time to run is not a programme', 'press', 5],
  ['One company, three studios: how work moves between them', null, 4],
];

const postDocs = POSTS.map(([title, division, readingTime], i) => ({
  _id: `seed-post-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60)}`,
  _type: 'post',
  title: `${S} ${title}`,
  slug: slugOf(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60)),
  division: division ?? undefined,
  excerpt: `${S} Placeholder standfirst. The article this describes has not been written.`,
  body: blocks(
    `${S} Placeholder body copy. Nothing here is a published position of Gridsmith Ltd.`,
    `${S} A second paragraph, so the article template is exercised with more than one block.`,
  ),
  author: `${S} Placeholder Name`,
  // Fixed dates, descending. Real dates arrive with real articles.
  publishedAt: new Date(Date.UTC(2026, 7, 20 - i)).toISOString(),
  readingTime,
  isSeed: true,
}));

// ---------------------------------------------------------------------------
// Group pages — the two `groupPage` slugs, and only those two
// ---------------------------------------------------------------------------

const section = (i, key_, heading, layout, ...paragraphs) => ({
  _type: 'groupSection',
  _key: `sec${i}`,
  key: key_,
  heading,
  layout,
  body: blocks(...paragraphs),
});

const groupPageDocs = [
  {
    _id: 'seed-grouppage-approach',
    _type: 'groupPage',
    slug: slugOf('approach'),
    title: 'How we work',
    intro: `${S} Placeholder introduction to the group's way of working.`,
    sections: [
      section(0, 'one-company', 'One company, three studios', 'prose',
        `${S} Placeholder. The divisions are trading divisions of one registered company, so one contract covers work that spans them.`),
      section(1, 'process', 'The six stages', 'process',
        `${S} The stage names below are fixed and come from the code, not from this document.`),
      section(2, 'continuity', 'A worked example', 'continuity',
        `${S} A real cross-division example is blocked on Q-M6 and cannot be seeded — a placeholder would have to claim it was verified.`),
      section(3, 'limits', 'When to use a specialist instead', 'sunken-plain',
        `${S} Placeholder for the honest-limits section (Q-M7). This block is deliberately undesigned; polishing it would sell the limits.`),
    ],
    isSeed: true,
  },
  {
    _id: 'seed-grouppage-about',
    _type: 'groupPage',
    slug: slugOf('about'),
    title: 'About Gridsmith',
    intro: `${S} Placeholder introduction to the company.`,
    sections: [
      section(0, 'structure', 'How the company is structured', 'prose',
        `${S} Placeholder. Gridsmith Ltd is one registered company; Design, Digital and Press are trading divisions of it.`),
      // **No 'people' section here.** It was excluded because `/about` rendered the roster
      // itself and two landmarks with one accessible name is axe `landmark-unique` — caught by
      // check:axe at Epic N. At `GS-O004` the roster is gone entirely and the reason has
      // changed with it: there are no public team members, so there is no people section to
      // duplicate. Do not add one back as prose either; `check:company` question 6 refuses
      // "Who you will work with" and "Meet the team" on the served page whatever renders them.
      section(2, 'verify', 'How to check us', 'prose',
        `${S} Placeholder. Company number and registered office are in the footer of every page.`),
    ],
    isSeed: true,
  },
];

// Legal documents (`seed-legal.mjs`) are drafted from this build's real facts and are
// imported at the top, with the rest.

// ---------------------------------------------------------------------------

const ALL = [
  ...serviceDocs,
  ...testimonialDocs,
  ...teamDocs,
  ...faqDocs,
  ...postDocs,
  ...groupPageDocs,
  ...LEGAL_DOCUMENTS,
];

/**
 * **Every document is asserted to carry the marker it claims.** A seed record that reached the
 * dataset without `isSeed: true` is invisible to `check:launch`'s production tier — the one
 * check standing between fabricated case studies and a live site. Failing here is cheap;
 * finding out at launch is not.
 */
/**
 * **No document id may contain a dot, and this is not a style rule.**
 *
 * Sanity treats an id containing `.` as a *private* document: readable with a token, invisible
 * to an unauthenticated query. The `drafts.` prefix is the familiar case; the behaviour is
 * general.
 *
 * The first version of this script used `seed.service.…` and `seed.legal.privacy`. All 125
 * documents wrote successfully, the script printed a correct count, and **every one of them was
 * invisible to the site** — which reads with no token, because both datasets are public. The
 * symptom was `/about`, `/approach` and all five `/legal/*` routes prerendering as 404s while
 * the build exited 0.
 *
 * It is worse than a broken page. `check:launch` counts published seed documents with an
 * unauthenticated query, and that count is the gate standing between fabricated case studies and
 * a live site. Dotted ids would have made it report **0 published seed document(s)** in a dataset
 * holding 125 of them — a green result from a check that could not see its subject, on the one
 * check whose entire purpose is to see it.
 */
const dotted = ALL.filter((d) => d._id.includes('.'));
if (dotted.length > 0) {
  console.error(
    `\nseed-content: ${dotted.length} document id(s) contain a dot. Sanity treats those as` +
      '\nprivate documents: readable with a token, invisible to the unauthenticated reads the' +
      '\nsite and check:launch both use. Use dashes.\n',
  );
  for (const d of dotted) console.error(`  ${d._id}`);
  process.exit(1);
}

const mismarked = ALL.filter((d) => d._type !== 'testimonial' && d.isSeed !== true);
if (mismarked.length > 0) {
  console.error(`\nseed-content: ${mismarked.length} document(s) are not marked isSeed: true\n`);
  for (const d of mismarked) console.error(`  ${d._id}`);
  process.exit(1);
}
const unsourced = testimonialDocs.filter((d) => !d.sourceUrl || d.isSeed !== false);
if (unsourced.length > 0) {
  console.error('\nseed-content: a testimonial is not traceable to a public source — see this file’s header.\n');
  process.exit(1);
}

/**
 * The `GS-O011` anonymity decision, asserted where the write happens rather than only in a gate.
 * `check:service-content` asserts the same thing over the committed source and over the dataset;
 * this catches it one step earlier, before an identifying title can be written at all.
 */
const identifying = anonymityProblems(
  testimonialDocs.map((d) => ({ id: d._id, projectTitle: d.projectTitle })),
);
if (identifying.length > 0) {
  console.error('\nseed-content: a testimonial still carries an identifying project title (GS-O011)\n');
  for (const problem of identifying) console.error(`  ${problem}`);
  process.exit(1);
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: DATASET,
  apiVersion: SANITY_API_VERSION,
  token,
  useCdn: false,
});

/**
 * ## Obsolete seed is deleted, and nothing else is — `GS-T007`, authorised at `GS-P04`
 *
 * `createOrReplace` never removes anything, so before `GS-P04` a re-run left every record the
 * script had *stopped* writing published alongside the new ones: the dataset held 30 pre-`GS-P03`
 * priced services with no capability group and 24 seed projects for routes that no longer exist.
 * That is what `GS-T007` was.
 *
 * **Deletion is by provenance, never by type.** A candidate must carry *both* independent seed
 * markers this repository has always written — `isSeed: true` **and** an `_id` beginning `seed-`.
 * Requiring both is the whole safety argument: either one alone could be wrong about a genuine
 * record, and a disagreement between them means the assumption behind this script no longer
 * holds, so the run stops rather than guessing which marker to believe.
 *
 * Everything else is left exactly where it is. The six Freelancer reviews are `isSeed: false`;
 * `companyDetails` is a genuine record written by `seed-company-details.mjs`; Sanity's own
 * `system.*` documents match neither marker. None of them is a candidate, and the query that
 * builds the candidate list cannot reach them.
 *
 * Idempotent: a second run finds no orphans, because the first run's write set is this run's.
 */
const writeIds = new Set(ALL.map((d) => d._id));
const existingSeed = await client.fetch(
  `*[coalesce(isSeed, false) == true && !(_id in path("drafts.**"))]{_id, _type}`,
);

const mismatched = existingSeed.filter((d) => !d._id.startsWith('seed-'));
if (mismatched.length > 0) {
  console.error(
    '\nseed-content: a document is marked isSeed: true but its id does not begin "seed-".' +
      '\nThe two provenance markers disagree, so obsolete seed cannot be told from genuine' +
      '\ncontent. Nothing was deleted and nothing was written. Resolve these by hand first.\n',
  );
  for (const d of mismatched) console.error(`  ${d._id} (${d._type})`);
  process.exit(1);
}

const orphans = existingSeed.filter((d) => !writeIds.has(d._id));

let tx = client.transaction();
for (const orphan of orphans) tx = tx.delete(orphan._id);
for (const doc of ALL) tx = tx.createOrReplace(doc);
await tx.commit();

if (orphans.length > 0) {
  const byType = orphans.reduce((acc, d) => ({ ...acc, [d._type]: (acc[d._type] ?? 0) + 1 }), {});
  console.log(`\nseed-content: deleted ${orphans.length} obsolete seed document(s) from "${DATASET}"`);
  for (const [type, n] of Object.entries(byType).sort()) console.log(`  ${String(n).padStart(3)}  ${type}`);
} else {
  console.log(`\nseed-content: no obsolete seed documents to delete from "${DATASET}"`);
}

const counts = ALL.reduce((acc, d) => ({ ...acc, [d._type]: (acc[d._type] ?? 0) + 1 }), {});
console.log(`\nseed-content: wrote ${ALL.length} document(s) to dataset "${DATASET}"`);
for (const [type, n] of Object.entries(counts).sort()) console.log(`  ${String(n).padStart(3)}  ${type}`);
console.log(
  `\n  ${testimonialDocs.length} testimonial(s) are REAL — verbatim Freelancer reviews, isSeed: false,` +
    '\n  sourceUrl set, project titles anonymised to a category of work (GS-O011).' +
    `\n  ${serviceDocs.length} service(s) are isSeed: true truthful development content (GS-O006), not [SEED]-marked.` +
    '\n  Everything else is isSeed: true and [SEED]-marked. continuityExample cannot be seeded (N-05).\n',
);

/**
 * **Read it back the way the site reads it - with no token.**
 *
 * The guard above catches the known cause. This catches the class: anything that makes a written
 * document unreadable by an unauthenticated client. Asking this process whether the write
 * succeeded answers a question about this process; the site is a different reader, and the only
 * way to establish what it will see is to be it.
 *
 * Same rule as `check:launch` reading the dataset from the served site's header rather than from
 * its own environment (`M-P1-7`), and as `check-axe` asking the probe route whether Resend is
 * configured rather than reading its own `process.env` (`A-08`). Ask the system.
 */
const publicRes = await fetch(
  `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${DATASET}` +
    `?query=${encodeURIComponent('count(*[_id in $ids])')}` +
    `&$ids=${encodeURIComponent(JSON.stringify(ALL.map((d) => d._id)))}`,
);
const visible = (await publicRes.json()).result;
if (visible !== ALL.length) {
  console.error(
    `\nseed-content: wrote ${ALL.length} document(s); an unauthenticated read sees ${visible}.` +
      '\nThe site reads with no token, so anything invisible here is invisible to every route' +
      '\nand to check:launch. Hard failure, not a warning.\n',
  );
  process.exit(1);
}
console.log(
  `  ${visible} of ${ALL.length} confirmed visible to an UNAUTHENTICATED read - the way the site reads`,
);

rmSync('.next/cache/fetch-cache', { recursive: true, force: true });
console.log('  cleared .next/cache/fetch-cache so the next build re-reads the dataset\n');
