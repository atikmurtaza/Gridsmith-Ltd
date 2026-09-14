/**
 * `S-01` — seeds the **development** dataset with structurally complete, visibly fake content
 * for every document type that exists (`FOUNDATION` §7).
 *
 * ## What is real here, and what is not
 *
 * **Everything written by this script carries `isSeed: true` and a `[SEED]` marker in its
 * rendered text — with one deliberate exception.** The six `testimonial` documents are real,
 * public Freelancer reviews reproduced verbatim, attributed, and carrying `sourceUrl` so a
 * reader can check them. They are `isSeed: false` and `verified: true`, and they must never be
 * reworded: a paraphrased review is an invented one.
 *
 * `continuityExample` is **not seeded and cannot be**. Its `verified` field is hard-true
 * (`N-05`), so a placeholder would have to assert that someone confirmed a story that did not
 * happen. The component renders its empty state until `Q-M6` supplies a real one.
 *
 * ## No prices and no case studies — `GS-P03`
 *
 * `GS-D002` removed every price field from the schema and `GS-D001` removed every public portfolio
 * route, so this script writes neither. Services follow the approved capability groups in
 * `lib/services/architecture.ts`. **The development dataset still holds the pre-`GS-P03` seed**
 * (priced services, 24 seed projects) until someone authorised re-runs this script *and* deletes
 * the orphaned seed documents it no longer writes — `createOrReplace` never removes anything.
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
import { SANITY_API_VERSION, SANITY_PROJECT_ID } from '../sanity/project.ts';
import { CANONICAL_PROCESS } from '../lib/process/canonical.ts';
import { LEGAL_DOCUMENTS } from './seed-legal.mjs';

const DATASET = 'development';

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

/**
 * Division detail per stage, keyed by canonical title — rule 3 of `00-PROCESS.md`. The
 * **names come from the constant**, never from this file, so a seed record cannot introduce a
 * seventh stage or reword one of the six.
 */
const processFor = (division) =>
  CANONICAL_PROCESS.map((stage, i) => ({
    _type: 'processStep',
    ...key(i),
    number: stage.number,
    title: stage.title,
    description: stage.description,
    divisionDetail: `${S} What this stage looks like on a ${division} engagement. Replace before launch.`,
  }));

const seo = (title, description) => ({ _type: 'seoBlock', metaTitle: title, metaDescription: description });

// ---------------------------------------------------------------------------
// Services — placeholders inside the approved capability groups (`GS-P03`)
// ---------------------------------------------------------------------------

/**
 * `[title, capabilityGroup, searchIntent, problem, [deliverables], [collaborators]]`.
 *
 * **Every title is `[SEED]`.** These exercise the architecture — every group of every division,
 * cross-division collaborators, the technical publication gate — and describe no real offer. The
 * approved service inventory is `_shared/SERVICE-ARCHITECTURE.md`; real copy replaces these by
 * deletion, never by editing. Technical records are published here and carry
 * `professionalScopeConfirmed: false`, which is allowed off production and refused on it.
 */
const SERVICES = {
  design: [
    ['Brand Identity', 'brand-visual', 'brand identity designer uk', 'You have a business and no coherent visual identity — the logo, the deck and the website each look like a different company.', ['Logo suite and lockups', 'Colour and type system', 'Usage guidelines', 'Asset pack in working formats']],
    ['Graphic Design', 'brand-visual', 'graphic designer for business', 'You have content and no consistent layout system to put it in.', ['Layout system', 'Source files', 'Print-ready and screen exports']],
    ['Packaging Design', 'brand-visual', 'packaging designer uk', 'Your printer has rejected the artwork, or you have none to send.', ['Dieline-accurate artwork', 'Print-ready PDFs', 'Pre-flight check']],
    ['Digital Illustration', 'illustration', 'custom illustration uk', 'You need artwork made for the job rather than bought from a library.', ['Concept sketches', 'Final artwork in agreed formats']],
    ['Motion Graphics & Animation', 'motion', 'motion graphics studio uk', 'A still image cannot explain how the thing works.', ['Storyboard', 'Animated sequence at agreed length', 'Delivery masters for web and social']],
    ['3D Modelling & Rendering', '3d-visualisation', '3d product rendering service', 'You need to show a product that does not physically exist yet, or cannot be photographed economically.', ['3D model', 'Renders at agreed angles', 'Source scene file']],
    ['Product Visualisation', '3d-visualisation', 'product visualisation studio', 'Your product photography cannot show configurations, cutaways or finishes you do not yet hold in stock.', ['Render set', 'Material and finish variants', 'Exploded and cutaway views']],
    ['CAD Drafting', 'technical', 'cad drafting service uk', 'You have sketches, a survey or a physical part and need drawings prepared from them.', ['CAD model', '2D drawing set', 'Native and neutral file formats']],
    ['Engineering Drawings', 'technical', 'engineering drawing service', 'You need a dimensioned drawing set prepared to an agreed brief.', ['General arrangement drawings', 'Detail drawings', 'Revision-controlled issue set']],
    ['Technical Document Layout', 'technical', 'technical manual layout', 'Your manual or specification sheet is correct and hard to read.', ['Layout template', 'Typeset document', 'Print and screen exports'], ['press']],
  ],
  digital: [
    ['Website Design & Build', 'web', 'website design agency uk', 'Your site was built by someone who has moved on, and every change is a negotiation.', ['Design system and page templates', 'Built, responsive, accessible site', 'CMS the team can actually use', 'Handover documentation'], ['press', 'design']],
    ['Ecommerce', 'web', 'ecommerce developer uk', 'Your store works but the theme fights you every time you want to change something.', ['Store build or customisation', 'Product and collection templates', 'Checkout and app configuration']],
    ['CMS Implementation', 'web', 'cms implementation uk', 'You want to edit your own site without breaking it.', ['Content model', 'CMS configuration', 'Editor training']],
    ['Web Application Development', 'software', 'custom web application development', 'A spreadsheet is running a process that has outgrown it.', ['Scoped application', 'Authentication and roles', 'Data model and migrations', 'Deployment pipeline']],
    ['Internal Tools & Dashboards', 'software', 'internal business tools', 'The information you need is spread across systems nobody has joined up.', ['Scoped tool or dashboard', 'Data connections', 'Access controls']],
    ['Mobile App Development', 'apps-interactive', 'mobile app developer uk', 'You need the thing on a phone, in a store, without a team to maintain it.', ['Application build', 'Store submission assets', 'Release pipeline']],
    ['AI Integration', 'automation-intelligence', 'ai integration for business', 'You want a specific job done by a model, not a chatbot bolted onto the corner of a page.', ['Use-case definition and evaluation set', 'Integration into an existing system', 'Guardrails and logging']],
    ['Automation & Workflow', 'automation-intelligence', 'business process automation uk', 'The same file is being copied between the same three systems every week by a person.', ['Process map', 'Automated pipeline', 'Failure alerting']],
    ['Technical SEO & Performance', 'operate-improve', 'technical seo audit uk', 'The site is slow or hard to crawl, and you have been told conflicting things about why.', ['Technical audit against measured data', 'Prioritised fix list', 'Implementation of the fixes'], ['press']],
    ['Maintenance & Monitoring', 'operate-improve', 'website maintenance uk', 'Nobody currently owns the question of whether the site is up.', ['Hosting coordination', 'Updates and backups', 'Monitoring']],
  ],
  press: [
    ['Ghostwriting', 'writing', 'ghostwriter uk', 'The book is in your head and it has been there for three years.', ['Interview programme', 'Chapter-by-chapter drafts', 'Full manuscript to agreed length']],
    ['Website & Business Copywriting', 'writing', 'business copywriter uk', 'The words on the site were written by whoever was free.', ['Messaging framework', 'Page copy', 'One revision round'], ['digital']],
    ['Thought Leadership & Reports', 'writing', 'whitepaper writer uk', 'You have expertise and nothing published that shows it.', ['Outline and research plan', 'Draft document', 'Final edited copy']],
    ['Manuscript Assessment', 'editorial', 'manuscript assessment uk', 'You want to know whether it is any good before you spend anything else on it.', ['Written assessment', 'Structural recommendations', 'A recommendation that may be "not yet"']],
    ['Editing & Proofreading', 'editorial', 'manuscript editing service uk', 'The manuscript is done and you cannot see it clearly any more.', ['Developmental notes', 'Line and copy edit', 'Final proofread against proofs']],
    ['Book Publishing Preparation', 'publishing', 'self publishing services uk', 'You have a finished manuscript and no route to a printed, distributed book.', ['Publishing plan', 'Typeset interior', 'Cover-design coordination', 'Distribution setup'], ['design']],
    ['Ebook & Print Formatting', 'publishing', 'ebook formatting service', 'The inside looks like a word processor.', ['Typeset print interior', 'Reflowable ebook', 'Platform-ready files']],
    ['ISBN & Distribution Setup', 'publishing', 'isbn and book distribution uk', 'You do not know what an ISBN commits you to, or who ends up owning the listing.', ['Guidance on obtaining your own ISBN', 'Metadata and listing preparation', 'Distribution account setup in your name']],
    ['Content Programmes', 'content-promotion', 'content marketing programme uk', 'You publish when someone remembers to, which is never.', ['Editorial plan', 'Agreed cadence of pieces', 'Review each cycle']],
  ],
};

const serviceDocs = Object.entries(SERVICES).flatMap(([division, rows]) =>
  rows.map(([title, capabilityGroup, searchIntent, problem, deliverables, collaborators = []], i) => ({
    _id: `seed-service-${division}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    _type: 'service',
    title: `${S} ${title}`,
    slug: slugOf(title.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
    division,
    capabilityGroup,
    searchIntent,
    problem: `${S} ${problem}`,
    deliverables: deliverables.map((label, j) => ({
      _type: 'deliverable',
      ...key(j),
      label,
      detail: `${S} Placeholder detail for "${label}".`,
      included: true,
    })),
    process: processFor(division),
    collaborators,
    professionalScopeConfirmed: false,
    seo: seo(`${title} — Gridsmith ${division[0].toUpperCase()}${division.slice(1)}`, `${S} Placeholder meta description for ${title}.`),
    order: i + 1,
    published: true,
    isSeed: true,
  })),
);

// ---------------------------------------------------------------------------
// Testimonials — REAL. Verbatim, attributed, traceable. Never reworded, never [SEED].
// ---------------------------------------------------------------------------

const FREELANCER_PROFILE = 'https://www.freelancer.com/u/GridsmithLTD';

/**
 * Six public reviews from Gridsmith's Freelancer profile, transcribed **verbatim** on
 * 21 August 2026 — including the reviewers' own punctuation and capitalisation.
 *
 * They are the only non-seed content this script writes. `verified: true` is defensible
 * because `sourceUrl` lets any reader check it; that is what the field is for.
 *
 * `authorCompany` is deliberately absent. Freelancer shows a first name and a handle, and
 * inferring an employer from that would be inventing an attribution.
 */
const REVIEWS = [
  ['tom', 'Tom', '@tommyb3210', 'Shopify Theme Image & Color Edits', 'digital',
    "The work was completed to a high standard, and they were happy to make revisions where needed until everything was working exactly as expected. They were knowledgeable with Shopify and implemented the changes professionally and efficiently. Overall, I'm very happy with the service and wouldn't hesitate to work with them again on future Shopify projects. Highly recommended!"],
  ['elizabeth', 'Elizabeth', null, 'Artistic Logo Design for Casglu', 'design',
    "I didn't really have a very clear brief in mind, but GridsmithLTD managed to turn my vague idea into a selection of great logo choices for me to choose from, really added value with additional things I hadn't thought of an delivered back much more than my initial request. I would happily work with them again in future, they made the process incredibly smooth and efficient."],
  ['chad', 'Chad', null, 'Miniature Medieval Castle Model', 'design',
    'He did 3D work for me. Very good work. I love it. I have more to do and when i have the budget im going to ask him to do it.'],
  ['stamos', 'Stamos', null, 'Ultra-Thin Wallet-Sized Wireless Charger Design', 'design',
    'Very flexible and understanding!'],
  ['stephanie', 'Stephanie', null, 'Open Eyes Photoshop Edit', 'design',
    'They were very communicative and did an excellent job. On top of that, they were the first person for this project who was able to answer my questions and talk about their experience doing these types of projects which made me feel confident in hiring Gridsmith.'],
  ['b-edward', 'B-Edward', null, 'Editable Circle Image in PowerPoint', 'design',
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
 * **Placeholder people, named as placeholders.** `Q-M9` — who appears publicly — is the
 * owner's decision and is not made here. A seed team member whose name reads like a real
 * person would be a fabricated credential on a public site, which `CLAUDE.md` #2 forbids
 * outright, so the names *are* the marker.
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
  isPublic: true,
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
      // **No 'people' section here, and that is a fix rather than an omission.** `/about`
      // renders the team roster itself, from `teamMember`, under the heading "Who you will
      // work with". A groupPage section with the same heading produced two <section> landmarks
      // with the same accessible name on one page — axe `landmark-unique`, moderate, and a
      // screen reader user hearing "Who you will work with, region" twice with different
      // content in each. Caught by check:axe at Epic N. The roster is code, so its heading is
      // code's to own; the CMS supplies the prose around it.
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

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: DATASET,
  apiVersion: SANITY_API_VERSION,
  token,
  useCdn: false,
});

let tx = client.transaction();
for (const doc of ALL) tx = tx.createOrReplace(doc);
await tx.commit();

const counts = ALL.reduce((acc, d) => ({ ...acc, [d._type]: (acc[d._type] ?? 0) + 1 }), {});
console.log(`\nseed-content: wrote ${ALL.length} document(s) to dataset "${DATASET}"`);
for (const [type, n] of Object.entries(counts).sort()) console.log(`  ${String(n).padStart(3)}  ${type}`);
console.log(
  `\n  ${testimonialDocs.length} testimonial(s) are REAL — verbatim Freelancer reviews, isSeed: false, sourceUrl set.` +
    `\n  Everything else is isSeed: true and [SEED]-marked. continuityExample cannot be seeded (N-05).\n`,
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
