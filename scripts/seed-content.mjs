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
 * ## Why the numbers are all zeros
 *
 * `PROJECT-RULES.md` §5 — *never a plausible figure*. `project.metrics` requires at least one
 * quantified metric, so every seed case study necessarily carries an invented one; they are
 * written `[SEED] 00%` per `FOUNDATION` §7.6. `pricingBlock.fromAmount` is a **number**, so it
 * cannot hold a marker — it is `0`, which renders `£0,000`, and the `INDICATIVE` badge and note
 * carry the marker instead. A seed price a reader could mistake for a quote is the failure this
 * avoids; an obviously zeroed one is not.
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

/** Every seed price is zeroed and badged. `variables` has a `min(2)` rule — SCHEMA-CORE §2. */
const pricing = (model, variables, unit) => ({
  _type: 'pricingBlock',
  model,
  currency: 'GBP',
  fromAmount: 0,
  toAmount: model === 'range' ? 0 : undefined,
  unit,
  includes: [`${S} Placeholder inclusion`, `${S} Placeholder inclusion`],
  variables,
  note: `${S} INDICATIVE — this is a placeholder, not a quotation. Real pricing is set before launch.`,
});

const cta = (label, href, style = 'primary') => ({ _type: 'ctaBlock', label, href, style });
const seo = (title, description) => ({ _type: 'seoBlock', metaTitle: title, metaDescription: description });

// ---------------------------------------------------------------------------
// Services — 10 per division (FOUNDATION §7, "realistic nav and cross-link density")
// ---------------------------------------------------------------------------

/** `[title, track, searchIntent, problem, [deliverables], pricingModel, [priceVariables]]` */
const SERVICES = {
  design: [
    ['Brand Identity', 'brand', 'brand identity designer uk', 'You have a business and no coherent visual identity — the logo, the deck and the website each look like a different company.', ['Logo suite and lockups', 'Colour and type system', 'Usage guidelines', 'Asset pack in working formats'], 'range', ['Number of applications', 'Whether existing assets are reusable', 'Rounds of revision agreed']],
    ['Logo Design', 'brand', 'logo design uk', 'You need one mark, done properly, in the formats a printer and a developer will both accept.', ['Concept routes', 'One developed mark', 'Vector and raster exports', 'Mono and reversed variants'], 'from', ['Number of concept routes', 'Whether guidelines are included']],
    ['Graphic Design', 'graphic', 'graphic designer for business', 'You have content and no consistent layout system to put it in.', ['Layout system', 'Source files', 'Print-ready and screen exports'], 'day-rate', ['Volume of artwork', 'Turnaround required', 'Whether copy is supplied']],
    ['3D Modelling & Rendering', '3d', '3d product rendering service', 'You need to show a product that does not physically exist yet, or cannot be photographed economically.', ['Production 3D model', 'Photoreal renders at agreed angles', 'Turntable frames', 'Source scene file'], 'range', ['Model complexity', 'Number of angles and materials', 'Render resolution']],
    ['Product Visualisation', '3d', 'product visualisation studio', 'Your product photography cannot show configurations, cutaways or finishes you do not yet hold in stock.', ['Configurable render set', 'Material and finish variants', 'Exploded and cutaway views'], 'range', ['Number of variants', 'Whether CAD is supplied', 'Output resolution']],
    ['CAD Drafting', 'cad', 'cad drafting service uk', 'You have sketches, a survey or a physical part and need drawings a manufacturer can work from.', ['Parametric CAD model', '2D drawing set', 'Native and neutral file formats'], 'day-rate', ['Part count', 'Tolerancing required', 'Source material quality']],
    ['Engineering Drawings', 'cad', 'engineering drawing service', 'You need a dimensioned, tolerated drawing set that a workshop will not send back with questions.', ['General arrangement drawings', 'Detail drawings', 'Bill of materials', 'Revision-controlled issue set'], 'range', ['Assembly complexity', 'Drawing standard required', 'Revision rounds']],
    ['Architectural Plans & Visualisation', 'architecture', 'architectural visualisation uk', 'You need plans drawn up and something a non-technical client can actually picture.', ['Plan, section and elevation set', 'Exterior and interior visuals', 'Export set for submission'], 'range', ['Floor area', 'Level of detail', 'Number of viewpoints']],
    ['Motion Graphics & Product Animation', 'motion', 'product animation studio', 'A still image cannot explain how the thing works.', ['Storyboard', 'Animated sequence at agreed length', 'Delivery masters for web and social'], 'range', ['Sequence length', 'Whether 3D assets exist', 'Sound design included or not']],
    ['Packaging & Print Artwork', 'graphic', 'packaging artwork designer', 'Your printer has rejected the artwork, or you have none to send.', ['Dieline-accurate artwork', 'Print-ready PDFs', 'Pre-flight check'], 'from', ['Number of SKUs', 'Print process and finishes']],
  ],
  digital: [
    ['Website Design & Build', 'web', 'website design agency uk', 'Your site was built by someone who has moved on, and every change is a negotiation.', ['Design system and page templates', 'Built, responsive, accessible site', 'CMS the team can actually use', 'Handover documentation'], 'range', ['Number of unique templates', 'Whether content is supplied', 'Integrations required']],
    ['Ecommerce & Shopify', 'web', 'shopify developer uk', 'Your store works but the theme fights you every time you want to change something.', ['Theme customisation or build', 'Product and collection templates', 'Checkout and app configuration'], 'range', ['Catalogue size', 'Theme condition', 'Apps and integrations']],
    ['WordPress Development', 'web', 'wordpress developer uk', 'You are on WordPress and want it fast and maintainable rather than replaced.', ['Custom theme or block set', 'Performance and security pass', 'Editor training'], 'range', ['Number of templates', 'Plugin footprint', 'Migration required or not']],
    ['Web Application Development', 'software', 'custom web application development', 'A spreadsheet is running a process that has outgrown it.', ['Scoped application', 'Authentication and roles', 'Data model and migrations', 'Deployment pipeline'], 'range', ['Number of user roles', 'Integration count', 'Data migration volume']],
    ['Mobile App Development', 'software', 'mobile app developer uk', 'You need the thing on a phone, in a store, without a team to maintain it.', ['Application build', 'Store submission assets', 'Release pipeline'], 'range', ['Platforms targeted', 'Offline requirements', 'Backend already exists or not']],
    ['AI Integration', 'ai', 'ai integration for business', 'You want a specific job done by a model, not a chatbot bolted onto the corner of a page.', ['Use-case definition and evaluation set', 'Integration into an existing system', 'Guardrails, logging and cost controls'], 'range', ['Task complexity', 'Data readiness', 'Accuracy threshold required']],
    ['Automation & Workflow', 'ai', 'business process automation uk', 'The same file is being copied between the same three systems every week by a person.', ['Process map', 'Automated pipeline', 'Failure alerting'], 'range', ['Number of systems', 'API availability', 'Volume and error tolerance']],
    ['SEO & Performance', 'growth', 'technical seo audit uk', 'The site is slow, or invisible, and you have been told conflicting things about why.', ['Technical audit against measured data', 'Prioritised fix list', 'Implementation of the fixes'], 'from', ['Site size', 'Whether implementation is included']],
    ['Hosting & Maintenance', 'support', 'website maintenance uk', 'Nobody currently owns the question of whether the site is up.', ['Managed hosting', 'Updates and backups', 'Monitoring and response'], 'retainer', ['Number of sites', 'Response time required', 'Update frequency']],
    ['Technical Consulting', 'support', 'technical consultant for startups', 'You need someone to tell you whether the quote you have been given is reasonable.', ['Written technical assessment', 'Options with trade-offs stated', 'Follow-up session'], 'day-rate', ['Scope of the review', 'Number of stakeholders']],
  ],
  press: [
    ['Book Publishing', 'publishing', 'self publishing services uk', 'You have a finished manuscript and no route to a printed, distributed book.', ['Structural and copy edit', 'Typeset interior', 'Cover design', 'Distribution setup'], 'range', ['Word count', 'Illustration and index requirements', 'Print specification']],
    ['Ghostwriting', 'writing', 'ghostwriter uk', 'The book is in your head and it has been there for three years.', ['Interview programme', 'Chapter-by-chapter drafts', 'Full manuscript to agreed length'], 'range', ['Target word count', 'Research depth', 'Interview hours required']],
    ['Editing & Proofreading', 'writing', 'manuscript editing service uk', 'The manuscript is done and you cannot see it clearly any more.', ['Developmental notes', 'Line and copy edit', 'Final proofread against proofs'], 'per-unit', ['Word count', 'Edit level required', 'Turnaround']],
    ['Cover Design & Typesetting', 'publishing', 'book cover design and typesetting', 'The inside looks like a word processor and the outside looks like nothing.', ['Cover to printer specification', 'Typeset interior with running heads', 'Print-ready and ebook files'], 'range', ['Page extent', 'Image handling', 'Number of formats']],
    ['ISBN & Distribution Setup', 'publishing', 'isbn and book distribution uk', 'You do not know what an ISBN commits you to, or who ends up owning the listing.', ['Guidance on obtaining your own ISBN', 'Metadata and listing preparation', 'Distribution account setup in your name'], 'fixed', ['Number of formats', 'Territories required']],
    ['Author Website & Platform', 'platform', 'author website design', 'Readers find the book and then find nowhere to go.', ['Author site', 'Mailing list integration', 'Book and event pages'], 'range', ['Number of titles', 'Commerce required or not', 'Content supplied or written']],
    ['Content Programmes', 'content', 'content marketing programme uk', 'You publish when someone remembers to, which is never.', ['Editorial plan', 'Agreed cadence of pieces', 'Performance review each cycle'], 'retainer', ['Pieces per month', 'Research depth', 'Whether distribution is included']],
    ['Copywriting', 'writing', 'business copywriter uk', 'The words on the site were written by whoever was free.', ['Messaging framework', 'Page copy', 'One revision round'], 'per-unit', ['Number of pages', 'Research and interviews required']],
    ['Ebook & Audiobook Production', 'publishing', 'ebook and audiobook production', 'The print book exists and the other two formats do not.', ['Reflowable ebook', 'Audiobook production management', 'Retailer-ready packages'], 'range', ['Page extent', 'Narration arrangement', 'Number of retailers']],
    ['Manuscript Assessment', 'writing', 'manuscript assessment uk', 'You want to know whether it is any good before you spend anything else on it.', ['Written assessment', 'Structural recommendations', 'A recommendation that may be "not yet"'], 'fixed', ['Word count', 'Turnaround']],
  ],
};

const serviceDocs = Object.entries(SERVICES).flatMap(([division, rows]) =>
  rows.map(([title, track, searchIntent, problem, deliverables, model, variables], i) => ({
    _id: `seed.service.${division}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    _type: 'service',
    title: `${S} ${title}`,
    slug: slugOf(title.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
    division,
    track,
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
    pricingModel: pricing(model, variables, model === 'per-unit' ? 'per 1,000 words' : undefined),
    ctaPrimary: cta('Tell us what you need', '/contact'),
    ctaSecondary: cta('See how we work', '/approach', 'secondary'),
    seo: seo(`${title} — Gridsmith ${division[0].toUpperCase()}${division.slice(1)}`, `${S} Placeholder meta description for ${title}.`),
    order: i + 1,
    published: true,
    isSeed: true,
  })),
);

// ---------------------------------------------------------------------------
// Projects — 24, to the distribution FOUNDATION §7 requires
// ---------------------------------------------------------------------------

/**
 * Fictional client names, per `FOUNDATION` §7.2 — *"an obviously fictional convention
 * (`Northfield Engineering`, `Halcyon Press`) — never a real company name, never a
 * plausible-but-unverifiable one."* Each is additionally `[SEED]`-prefixed where it renders.
 */
const CLIENTS = [
  'Northfield Engineering', 'Halcyon Press', 'Marlowe & Vale', 'Ashgrove Interiors',
  'Kestrel Instruments', 'Bramblewick Foods', 'Quillon Studios', 'Thornbury Marine',
  'Wrenhaven Labs', 'Silverbeck Group', 'Ossory Textiles', 'Pendrake Systems',
];

const INDUSTRIES = ['Manufacturing', 'Publishing', 'Professional services', 'Retail', 'Marine', 'Food & drink'];

/** `[title, divisions, track, confidential, metricCount]` */
const PROJECT_SPEC = [
  ['Instrument Housing Visualisation', ['design'], '3d', false, 1],
  ['Workshop Drawing Set Rebuild', ['design'], 'cad', false, 1],
  ['Identity for a Marine Refit Yard', ['design'], 'brand', false, 1],
  ['Packaging Range Artwork', ['design'], 'graphic', false, 1],
  ['Assembly Animation for a Trade Show', ['design'], 'motion', false, 1],
  ['Residential Extension Plan Set', ['design'], 'architecture', true, 1],
  ['Catalogue Layout System', ['design'], 'graphic', false, 1],
  ['Product Configurator Renders', ['design'], '3d', false, 1],
  ['Ecommerce Replatform', ['digital'], 'web', false, 4],
  ['Field Reporting Web Application', ['digital'], 'software', false, 4],
  ['Document Triage with a Language Model', ['digital'], 'ai', true, 4],
  ['Marketing Site Rebuild', ['digital'], 'web', false, 4],
  ['Quotation Workflow Automation', ['digital'], 'ai', false, 2],
  ['Technical SEO Recovery', ['digital'], 'growth', false, 2],
  ['Inventory Sync Integration', ['digital'], 'software', true, 2],
  ['Booking Platform for a Marina', ['digital'], 'web', false, 2],
  ['Founder Memoir, Ghostwritten', ['press'], 'writing', false, 2],
  ['Technical Handbook, Second Edition', ['press'], 'publishing', false, 2],
  ['Author Platform and Mailing List', ['press'], 'platform', false, 2],
  ['Quarterly Content Programme', ['press'], 'content', false, 2],
  ['Trade Title, Print and Ebook', ['press'], 'publishing', false, 2],
  // The three cross-division records — the best evidence the group structure is real.
  ['Brand, Website and Launch Book', ['design', 'digital', 'press'], 'brand', false, 3],
  ['Product Renders and Storefront', ['design', 'digital'], '3d', false, 3],
  ['Handbook and Companion Microsite', ['digital', 'press'], 'publishing', false, 3],
];

const METRIC_LABELS = [
  'Time to first draft', 'Pages delivered', 'Load time improvement', 'Support tickets after handover',
];

const projectDocs = PROJECT_SPEC.map(([title, divisions, track, confidential, metricCount], i) => {
  const client = CLIENTS[i % CLIENTS.length];
  return {
    _id: `seed.project.${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    _type: 'project',
    title: `${S} ${title}`,
    slug: slugOf(title.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
    divisions,
    track,
    // `confidential` is enforced in the query layer, never in a component — a component-level
    // check leaks the name into the RSC payload before anything decides not to render it.
    clientName: `${S} ${client}`,
    clientDisplay: confidential
      ? `${S} A UK ${INDUSTRIES[i % INDUSTRIES.length].toLowerCase()} business`
      : `${S} ${client}`,
    confidential,
    industry: INDUSTRIES[i % INDUSTRIES.length],
    year: 2026,
    summary: `${S} Placeholder card copy for ${title}. Replaced by a real case study before launch.`,
    challenge: blocks(`${S} The situation the client arrived with. Placeholder.`),
    approach: blocks(`${S} What was done, and why that rather than the obvious alternative. Placeholder.`),
    outcome: blocks(`${S} What changed for the client. Placeholder — no real outcome is claimed here.`),
    metrics: Array.from({ length: metricCount }, (_, m) => ({
      _type: 'metric',
      ...key(m),
      label: METRIC_LABELS[m % METRIC_LABELS.length],
      // FOUNDATION §7.6 — zeroed digits and a visible marker, never a plausible figure.
      value: `${S} 00%`,
      context: `${S} No real measurement is asserted by this figure.`,
    })),
    media: [],
    featured: i < 6,
    masterFeatured: divisions.length > 1 || i < 4,
    seo: seo(`${title} — Gridsmith`, `${S} Placeholder meta description.`),
    isSeed: true,
  };
});

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
  _id: `testimonial.freelancer-${id}`,
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
  _id: `seed.team.${id}`,
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
  ['How is pricing worked out?', 'pricing'],
  ['Do I own the work when it is finished?', 'rights'],
  ['What happens if I need changes after delivery?', 'process'],
  ['Can you work with our existing suppliers?', 'process'],
  ['Do you take on small pieces of work?', 'scope'],
  ['What if my project spans more than one of your divisions?', 'group'],
  ['How do you handle confidential work?', 'legal'],
  ['What are your payment terms?', 'pricing'],
  ['Who will actually be doing the work?', 'process'],
  ['How do you keep me updated?', 'process'],
  ['What happens if the project stalls at my end?', 'process'],
  ['Can you take over work someone else started?', 'scope'],
  ['When would you tell me to go elsewhere?', 'honesty'],
];

const faqDocs = ['design', 'digital', 'press'].flatMap((division) =>
  FAQ_TEMPLATES.map(([question, category], i) => ({
    _id: `seed.faq.${division}-${i + 1}`,
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
  _id: `seed.post.${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60)}`,
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
    _id: 'seed.groupPage.approach',
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
    _id: 'seed.groupPage.about',
    _type: 'groupPage',
    slug: slugOf('about'),
    title: 'About Gridsmith',
    intro: `${S} Placeholder introduction to the company.`,
    sections: [
      section(0, 'structure', 'How the company is structured', 'prose',
        `${S} Placeholder. Gridsmith Ltd is one registered company; Design, Digital and Press are trading divisions of it.`),
      section(1, 'people', 'Who you will work with', 'two-column',
        `${S} Placeholder. Public team listings are pending Q-M9.`),
      section(2, 'verify', 'How to check us', 'prose',
        `${S} Placeholder. Company number, registered office and VAT position are in the footer of every page.`),
    ],
    isSeed: true,
  },
];

// Legal documents (`seed-legal.mjs`) are drafted from this build's real facts and are
// imported at the top, with the rest.

// ---------------------------------------------------------------------------

const ALL = [
  ...serviceDocs,
  ...projectDocs,
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

rmSync('.next/cache/fetch-cache', { recursive: true, force: true });
console.log('  cleared .next/cache/fetch-cache so the next build re-reads the dataset\n');
