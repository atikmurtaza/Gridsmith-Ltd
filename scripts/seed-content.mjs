/**
 * `S-01` — seeds the **development** dataset with structurally complete, visibly fake content
 * for every document type that exists (`FOUNDATION` §7).
 *
 * ## What is real here, and what is not — four tiers since `GS-R001-R`
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
 * 3. **Written copy, not yet owner-read** — the two `groupPage` documents (`/about`,
 *    `/approach`), rewritten at `GS-R001-R`. `isSeed: true` and **not** `[SEED]`-marked, for
 *    tier 2's reason: the flag means *this script owns it and it may not be promoted*, and the
 *    marker means *fabricated*. These sentences are written from the approved service
 *    architecture, the canonical process and the recorded commercial positions, and assert no
 *    company fact this programme has not already recorded.
 * 4. **Visibly fake placeholder** — `teamMember` and `faq`. `isSeed: true` and `[SEED]`-marked,
 *    because they *are* fabricated. **Neither is rendered by anything**: the team query and
 *    renderer were deleted at `GS-O004`, and `listFaqs` has no caller. They stay so the types
 *    have a subject and so `check:launch`'s seed tier has something to count.
 *
 * **The nine `post` documents are no longer in this list at all.** They were tier 4 — nine
 * `[SEED]`-marked articles, published. At `GS-R001-R` they are **editorial briefs** carrying
 * `status: 'brief'`, which no query serves; see the block above `BRIEFS`. The owner rejected
 * the previous nine, and the objection was the articles rather than the marker.
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
// Insights — editorial briefs, not articles (`GS-R001-R`)
// ---------------------------------------------------------------------------

/**
 * **Nine editorial briefs. None of them is an article and none of them is public.**
 *
 * `GS-R001` seeded nine `[SEED]`-marked posts and published all nine. The owner rejected them,
 * and the objection was not the marker: a generated article presented as a company's thinking
 * is fake whether or not it is labelled, and removing the label would have made it worse rather
 * than better. **So the fix is not to unmark them — it is to stop them being articles.**
 *
 * The owner writes Insights personally. What the CMS holds until then is the preparation: the
 * premise, who it is for, the question it answers, the points to make, a suggested order, and
 * the facts that have to be established before a word of it is true. Every brief carries
 * `status: 'brief'`, and `lib/sanity/queries.ts` serves only `status == "published"` — so
 * `/insights` shows its empty state and `/insights/<slug>` is not built at all.
 *
 * **The topics are the owner's**, supplied in the `GS-R001-R` brief. Titles are working titles
 * and are refined for clarity only; no subject was changed, added or dropped. Everything in a
 * `research` array is a **question**, never a claim — it is the list of things nobody has
 * established yet, which is the opposite of the nine articles this replaces.
 *
 * **A re-run of `npm run seed` rewrites these documents**, like every other `seed-` record.
 * Once the owner starts writing, the article belongs in a document the seed script does not
 * own — a new post created in the Studio, which carries no `seed-` id and is never a deletion
 * candidate. That is stated here because the alternative is discovering it after losing a draft.
 */
const BRIEFS = [
  {
    title: 'Why businesses outgrow disconnected digital suppliers',
    division: null,
    premise:
      'A supplier per medium works until the parts have to agree with each other. The cost is not any one supplier being bad — it is that every handover is a fresh explanation of the same business.',
    reader:
      'An owner-manager running three or four separate suppliers who suspects the coordination has quietly become their job',
    centralQuestion: 'Why does this get harder as the business grows rather than easier?',
    points: [
      'The failure is at the seams, not inside any one supplier',
      'Briefing cost is paid again at every handover and appears on no invoice',
      'Nobody owns the question that spans two suppliers, so it goes unasked',
      'Consolidating is not the only answer — continuity of context is the actual requirement',
      'What to do about it without firing anyone competent',
    ],
    structure: [
      'The symptom: work that is fine separately and wrong together',
      'Where the cost actually sits',
      'Why it scales badly',
      'What continuity would have to mean to fix it',
      'What to ask a supplier before you need the answer',
    ],
    research: [
      'What is a fair way to describe the coordination burden without citing a statistic we cannot source?',
      'Which Gridsmith engagements can be described at the pattern level without naming a client?',
    ],
  },
  {
    title: 'When custom software makes more sense than another subscription',
    division: 'digital',
    premise:
      'Off-the-shelf software is the right answer far more often than custom is. The interesting question is where the line sits, and it is not where either vendor says it is.',
    reader: 'A business paying for several tools, at least one of which nearly fits',
    centralQuestion: 'Is my problem a subscription problem or a build problem?',
    points: [
      'Start from what happens when a tool nearly fits: the workaround is the real cost',
      'Per-seat pricing changes the arithmetic at a specific headcount, not in general',
      'Integration is usually where the money goes, custom or not',
      'Custom carries a maintenance obligation that never ends; say so plainly',
      'The honest recommendation is often "keep the subscription and fix the join"',
    ],
    structure: [
      'Three situations where off-the-shelf is obviously right',
      'The workaround tax',
      'What custom actually commits you to',
      'A test to apply before asking anyone for a quote',
    ],
    research: [
      'How do we discuss total cost without publishing a price or implying a band?',
      'Which examples can be described generically without disclosing a client arrangement?',
    ],
  },
  {
    title: 'What you should actually own when you commission a website',
    division: 'digital',
    premise:
      'Most disputes about website ownership are not about intellectual property. They are about access — the domain, the DNS, the hosting account, the analytics property, the repository.',
    reader: 'Anyone about to sign for a website build, and anyone who already has one',
    centralQuestion: 'If this relationship ended tomorrow, what would I be left holding?',
    points: [
      'Separate the four things people conflate: copyright, licences, accounts, source code',
      'Accounts in the supplier’s name are the common failure and the easiest to avoid',
      'Some third-party licences genuinely cannot transfer — explain why rather than promise',
      'What a handover should contain, as a checklist',
      'Ask before signing, not at the end',
    ],
    structure: [
      'The question worth asking at the start',
      'Four things that get called ownership',
      'What can and cannot transfer, and why',
      'A handover checklist',
    ],
    research: [
      'Gridsmith’s position is set out in the written project agreement — what exactly does it say, so this describes it rather than a preference?',
      'Which licence categories are genuinely non-transferable, checked against a source rather than assumed?',
    ],
  },
  {
    title: 'Where AI automation genuinely helps a small business, and where it does not',
    division: 'digital',
    premise:
      'Automation pays where a task is repetitive, high in volume and tolerant of being wrong occasionally. Most of what is sold as AI automation fails at least one of those three.',
    reader: 'A small-business owner being pitched AI and unable to sort the useful pitches from the rest',
    centralQuestion: 'Which of these tasks is actually worth automating?',
    points: [
      'The three-part test: repetitive, high volume, tolerant of error',
      'Where error tolerance is zero, automation becomes a review burden rather than a saving',
      'Evaluation is the cost everyone forgets and the one that decides whether it worked',
      'Good fits, named concretely',
      'Bad fits, named just as concretely — including ones we get asked for',
    ],
    structure: [
      'A test you can apply in ten minutes',
      'Three things it does well',
      'Three things it does not',
      'What "it works" has to mean before you commit',
    ],
    research: [
      'What can be said about evaluation cost without inventing a figure or a ratio?',
      'Which categories of automation has Gridsmith actually delivered, per the approved catalogue?',
    ],
  },
  {
    title: 'Why accessibility belongs in the design, not in the fix list',
    division: 'digital',
    premise:
      'Retrofitting accessibility is expensive because the decisions that break it are structural — colour, hierarchy, interaction model — and structural decisions are cheap only while they are still decisions.',
    reader: 'Someone commissioning a site or product who has been told accessibility is a later phase',
    centralQuestion: 'What does doing this properly cost me, and when?',
    points: [
      'The expensive failures are design decisions, not code defects',
      'Contrast, focus order and non-colour cues cost nothing at the point they are chosen',
      'Automated testing finds a real but limited share — be specific about the limit rather than vague',
      'Legal exposure is real but is the weaker argument; lead with the better one',
      'What to ask for in a brief so it is not a later phase',
    ],
    structure: [
      'Why "we will fix it after" is a cost decision, not a scheduling one',
      'The decisions that matter, and when they are made',
      'What testing can and cannot tell you',
      'What to put in the brief',
    ],
    research: [
      'Which standard should be named, and what exactly does Gridsmith commit to under it, per the approved service copy?',
      'What share of issues does automated tooling detect, and is there a source we can cite rather than a number we half-remember?',
    ],
  },
  {
    title: 'Keeping a brand consistent when several specialists work on it',
    division: 'design',
    premise:
      'A guideline document is not what keeps a brand consistent. What keeps it consistent is that the decisions behind it are written down and the people applying it have someone to ask.',
    reader: 'A business whose designer, web developer and printer are three different people',
    centralQuestion: 'Why does my brand drift even though everyone has the guidelines?',
    points: [
      'Guidelines record outcomes; drift comes from the cases they did not anticipate',
      'The rules that break first: type scale, spacing, and the tone of the writing',
      'Print, screen and motion each expose a different gap',
      'The fix is a decision record and a named point of contact, not a longer PDF',
      'What a usable brand system contains beyond the logo files',
    ],
    structure: [
      'Where drift actually starts',
      'Three rules that break first, and why',
      'What guidelines cannot cover',
      'What to hand a new supplier on day one',
    ],
    research: [
      'What does Gridsmith Design actually deliver in a brand system, per the approved catalogue, so this is descriptive rather than aspirational?',
    ],
  },
  {
    title: 'What makes a technical drawing useful, beyond being accurate',
    division: 'design',
    premise:
      'An accurate drawing a workshop cannot quote from has failed at its job. Usefulness is about what the drawing decides for its reader, not only whether the dimensions are right.',
    reader: 'Someone commissioning drawings who has had a set come back with questions',
    centralQuestion: 'Why did an accurate drawing still come back with questions?',
    points: [
      'Accuracy and sufficiency are different properties',
      'What a fabricator needs decided before quoting: tolerances, finishes, materials, fixings',
      'Conventions exist so a reader does not have to ask; naming the standard used matters',
      'Revision control is part of usefulness — an undated drawing is a guess about which one is current',
      'Where visualisation ends and engineering responsibility begins',
    ],
    structure: [
      'The returned-with-questions problem',
      'What the reader has to be able to decide',
      'Conventions, and why naming the standard matters',
      'Revisions',
    ],
    research: [
      'Which drawing standards may be named, confirmed against a source rather than recalled?',
      'This touches the Technical group, gated on GS-O005 and GS-X002 — what may this say, and what must it not, before that gate clears?',
    ],
  },
  {
    title: 'What to prepare before you approach an editor',
    division: 'press',
    premise:
      'Most manuscripts reach an editor before the questions an editor cannot answer for you have been answered. Settling those makes the edit cheaper and better in the same move.',
    reader: 'A first-time author with a finished or nearly finished draft',
    centralQuestion: 'Is my manuscript ready to send to anyone yet?',
    points: [
      'Know which edit you are asking for: developmental, line, copy, proof — they are not stages of one thing',
      'Decisions only the author can make: audience, scope, and what the book is for',
      'What a sample edit tells you, and what it does not',
      'Word count, format and consistency decisions that cost the author nothing and the editor a lot',
      'When the honest answer is that it is not ready, and what to do then',
    ],
    structure: [
      'The four edits, and which one you need',
      'What only you can decide',
      'A pre-submission checklist',
      'What a sample edit is for',
    ],
    research: [
      'What does Gridsmith Press actually offer at each editorial level, per the approved catalogue?',
      'Press must be able to recommend against Gridsmith — how does that show up honestly here?',
    ],
  },
  {
    title: 'Publishing a book and marketing a book are two different problems',
    division: 'press',
    premise:
      'Publishing ends when the book is available. Marketing starts before that and does not end. Treating them as one project is why authors are surprised by the silence after launch.',
    reader: 'An author approaching publication, self-publishing or otherwise',
    centralQuestion: 'The book is out. Why is nothing happening?',
    points: [
      'The two have different timelines, different skills and different endpoints',
      'What publication delivers: availability, metadata, distribution',
      'What it does not deliver: readers',
      'Metadata and categories are where the two overlap, and they are decided early',
      'Being honest about what marketing can and cannot do for a first book',
    ],
    structure: [
      'The silence after launch',
      'What publication is for',
      'What marketing is for',
      'The overlap, and why it is decided before publication',
      'Expectations worth setting now',
    ],
    research: [
      'Which publishing and promotion services does Gridsmith Press actually provide, per the approved catalogue?',
      'What may be said about outcomes without implying a sales result nobody can promise?',
    ],
  },
];

const briefSlug = (title) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

const postDocs = BRIEFS.map((b) => ({
  _id: `seed-post-${briefSlug(b.title)}`,
  _type: 'post',
  title: b.title,
  slug: slugOf(briefSlug(b.title)),
  division: b.division ?? undefined,
  // **Brief, never published.** This is the field the query predicate reads, so this is the
  // field that decides. Nothing else on the document is a publication signal.
  status: 'brief',
  brief: {
    _type: 'editorialBrief',
    premise: b.premise,
    reader: b.reader,
    centralQuestion: b.centralQuestion,
    arguments: b.points,
    structure: b.structure,
    research: b.research,
  },
  // No excerpt, no body, no author, no publishedAt. Each of those is the owner's to write, and
  // seeding a placeholder for any of them is how the nine `[SEED]` articles happened.
  isSeed: true,
}));

// Legal documents (`seed-legal.mjs`) are drafted from this build's real facts and are
// imported at the top, with the rest.

// ---------------------------------------------------------------------------

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

/**
 * **The two group pages, in public-ready copy — `GS-R001-R`.**
 *
 * They carried `[SEED]`-marked placeholder prose, and the owner's rejection of the staging
 * candidate named it first. **Removing the marker was not the fix.** A marker is a statement
 * about provenance; the problem was the sentences, which said nothing a reader could use and
 * which no marker would have made useful.
 *
 * So each section below is written copy, and it is written from things this repository already
 * establishes and the owner has already approved: the three divisions and their capability
 * groups (`_shared/SERVICE-ARCHITECTURE.md`), the canonical six stages
 * (`_shared/00-PROCESS.md`), the bespoke-quotation position (`GS-D002`) and the no-public-
 * portfolio position (`GS-D001`). **Nothing here asserts a fact about the company that is not
 * already recorded somewhere in this programme** — no history, no headcount, no offices, no
 * awards, no client names, no scale claim.
 *
 * `isSeed: true` stays, and it is not a contradiction. The flag means *written by the seed
 * script and owned by it*, which is exactly what this is; `check:launch` uses it to refuse
 * promotion to the production dataset, and that refusal is correct until the owner has read
 * these words. It is not a claim that the sentences are placeholders.
 *
 * **`/approach`'s structure is unchanged.** Its six stages are fixed by `_shared/00-PROCESS.md`
 * and are not reworded here; the owner's `Understand → Scope → Create → Review → Deliver →
 * Continue` reading is what the six already are, so it is explained rather than substituted.
 * What is added is the connective prose the page was missing between them.
 */
const groupPageDocs = [
  {
    _id: 'seed-grouppage-approach',
    _type: 'groupPage',
    slug: slugOf('approach'),
    title: 'How we work',
    intro:
      'Six stages, the same six whichever division does the work. The short version: we find out what you actually need before we tell you what it costs.',
    sections: [
      section(0, 'understand', 'We start with the requirement, not the service', 'prose',
        'Most enquiries arrive as a solution — a new website, a rebrand, a book. Sometimes that is right. Often the thing behind it is different enough that building what was asked for would be a waste of your money.',
        'So the first conversation is about the business and the problem, not about what we sell. It is also where we say if the work belongs somewhere other than Gridsmith. That happens, and telling you early is cheaper for both of us than telling you late.'),
      section(1, 'one-company', 'One company, three studios', 'prose',
        'Gridsmith Design, Gridsmith Digital and Gridsmith Press are trading divisions of Gridsmith Ltd, not separate companies. One contract covers work that spans them, and you are not managing three suppliers who have never spoken.',
        'Where a project needs two divisions, coordinating them is our job. You brief it once.'),
      section(2, 'scope', 'Everything is scoped for the specific job', 'prose',
        'There are no packages on this site and no price list, because we do not have work that comes in fixed sizes. What you get instead is a written scope: what is included, what is not, what we need from you and when.',
        'That document is where the disagreements happen, which is the right place for them. A scope you have read and questioned is worth more than a number you accepted quickly.'),
      section(3, 'process', 'The six stages', 'process',
        'These are the same six whatever the work is. Stage 1 is understanding, stage 2 is scoping, stages 3 and 4 are making it, stage 5 is delivering it, and stage 6 only happens if continuing makes sense for you.',
        'Review is not a stage of its own because it is not a moment — it runs through stage 4, at points agreed when the scope is written rather than whenever someone remembers.'),
      section(4, 'continuity', 'A worked example', 'continuity',
        'The clearest way to show what continuity is worth is a real relationship that moved between divisions. We will not illustrate it with an invented one.'),
      section(5, 'limits', 'When to use a specialist instead', 'sunken-plain',
        'Three divisions is not every discipline. If your work needs a structural engineer, a chartered accountant, a solicitor or a specialist agency with a decade in one narrow field, that is who you should be talking to, and we will say so.',
        'The same applies inside our own range. Some work is too small to justify what we would charge to scope it properly, and some is far enough outside what we do well that taking it would not be fair to you.'),
    ],
    isSeed: true,
  },
  {
    _id: 'seed-grouppage-about',
    _type: 'groupPage',
    slug: slugOf('about'),
    title: 'About Gridsmith',
    intro:
      'One company, three specialist divisions. Work with one of them or all three — it stays the same relationship either way.',
    sections: [
      section(0, 'structure', 'What Gridsmith is', 'prose',
        'Gridsmith Design handles brand and visual work, illustration, motion, 3D visualisation and technical drawing. Gridsmith Digital builds websites, software, apps and automation, and looks after them afterwards. Gridsmith Press covers writing, editorial, publishing, and the content and promotion around a book.',
        'All three are trading divisions of Gridsmith Ltd. Whichever one you deal with, your contract, your invoice and the company answerable to you are the same.',
        'Most clients arrive needing one division. Some need two — occasionally at the start, more often a year later. That second case is the one this structure exists for.'),
      section(1, 'why', 'Why it is built this way', 'prose',
        'Different outputs need different specialists. A brand identity, a production web application and a finished manuscript are genuinely different crafts, and treating them as one is how work ends up competent in a single discipline and thin everywhere else.',
        'The usual alternative is a supplier per medium: a designer who has never seen the site, a developer working from brand guidelines nobody explained, a writer briefed by neither. Nothing is wrong with any of them individually. What goes wrong is at the joins, and the coordination quietly becomes your job.',
        'So the specialists stay specialists, and the relationship does not restart when the medium changes.'),
      section(2, 'role', 'What we actually do', 'prose',
        'We work out what the requirement is, say which discipline it belongs to, scope it for your situation rather than from a menu, and run it through the division that does that kind of work. Where it spans two, joining them up is ours to do.',
        'Every engagement is quoted against its own scope. That is why there is no price list here: the number follows the requirement, and the requirement comes first.'),
      section(3, 'character', 'How we approach the work', 'prose',
        'Three things show up in everything we make. Design decisions are deliberate and can be explained — if we cannot say why something is the way it is, it is not finished. Technical work is built to be maintained by whoever comes next, including you. And the accessible version is the version we build, not an upgrade that arrives later.',
        'We would rather tell you something is a bad idea early than deliver it well and watch it fail.'),
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
    `\n  ${postDocs.length} post(s) are editorial BRIEFS (status: brief) and are not published (GS-R001-R).` +
    `\n  ${groupPageDocs.length} group page(s) carry written copy rather than [SEED] prose (GS-R001-R).` +
    '\n  teamMember and faq records stay isSeed: true and [SEED]-marked; nothing renders either.' +
    '\n  continuityExample cannot be seeded (N-05).\n',
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
