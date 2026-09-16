/**
 * The development service content foundation — `GS-P04`.
 *
 * ## Data, not a script
 *
 * `seed-content.mjs` writes these records and `check-service-content.mjs` asserts them. Neither
 * may import the other: the seed needs a write token and mutates a dataset, so a gate that
 * imported it would be a gate that reseeds. The records therefore live here, in a module that
 * touches no network, no environment and no clock.
 *
 * ## What this content is
 *
 * **Truthful development content, not approved production copy.** Every record carries
 * `isSeed: true`, which is the machine-enforced production block: `check:launch` refuses a
 * production dataset containing a published seed record, and that assertion has a committed
 * specimen. Non-negotiable #4 is intact and is enforced by the flag, not by a string.
 *
 * **The `[SEED]` text marker is deliberately not used here, and that is a change from
 * `GS-P03`.** The marker exists to label *visibly fabricated* text — a placeholder registered
 * office, a `[SEED] Placeholder Name`. This content is not fabricated: it describes services the
 * owner confirmed Gridsmith provides (`GS-O006`, 16 September 2026) in plain factual terms, and
 * the phase's purpose is a foundation someone can actually review. Marking truthful copy as fake
 * would make the development site unreadable and would teach a reviewer to ignore the marker.
 * What is still unapproved is the *wording*, which is agent-authored — that is `GS-O013`, and it
 * is an owner acceptance step, not a property of the text.
 *
 * ## The rules this content is written under
 *
 * - No price, band, range, package total or "from" figure anywhere (`GS-D002`).
 * - No client name, project, logo, screenshot, book title or cover (`GS-D001`).
 * - No turnaround, SLA, revision count, guaranteed outcome, client number, certification,
 *   regulatory status or years of experience. None of those is an owner fact we hold.
 * - **Technical (Design):** drafting and drawing preparation to an agreed brief only. Nothing
 *   states or implies certified engineering design, structural design or regulated professional
 *   responsibility (`SERVICE-ARCHITECTURE.md` §8). Publication to production stays gated on
 *   `GS-O005` / `GS-X002`.
 * - **3D & Visualisation:** visualisation never implies product-engineering responsibility.
 * - **Press:** no ownership, copyright, publishing-success, retailer-acceptance or distribution
 *   guarantee. Where a service touches rights or listings, the record says what Gridsmith does
 *   and what stays with the client.
 *
 * ## Granularity — 46 records for 81 approved services
 *
 * A record is a page, and 81 pages would mean pages like "Naming support" carrying three
 * sentences each. `covers` is what keeps the arithmetic honest: every approved service is named
 * by exactly one record, `check:service-content` proves it, and the names render on the page as
 * the service's capabilities. So the catalogue is fully represented and the page count is the
 * one a reader can use.
 *
 * `covers` entries are matched against `lib/services/catalogue.ts` by `group:name`, using the
 * record's own group. "Technical illustration" is in two groups on purpose and is covered twice.
 *
 * @typedef {[label: string, detail: string | null, included?: boolean]} Deliverable
 */

/**
 * Per-division process detail, keyed by canonical stage title. The six titles come from
 * `lib/process/canonical.ts` and never from here — rule 3 of `00-PROCESS.md`.
 *
 * **No duration and no client time are stated.** `processStep` has fields for both and they are
 * left empty: a duration is an operational commitment and Gridsmith has not supplied one. An
 * invented "2–3 weeks" would be exactly the fabricated fact this repository refuses.
 */
export const PROCESS_DETAIL = {
  design: {
    Consultation:
      'We look at what you already have — existing marks, files, print or manufacturing constraints — and establish what the work has to sit alongside.',
    'Planning & Scope':
      'The brief is written down: formats, quantities, the file types you need at the end, and what is outside the scope.',
    'Approval & Start':
      'Work starts once the written scope is agreed. Source material and any brand assets you hold are collected at this point.',
    'Design, Development & Updates':
      'Concepts first, then development of the direction you choose. Feedback happens at agreed points rather than continuously, so each round is a decision.',
    Delivery:
      'Final artwork in the agreed formats, with working files where the scope includes them.',
    Support:
      'Later amends, new formats and extensions of the system can be scoped as further work or as an ongoing engagement, whichever suits how you work.',
  },
  digital: {
    Consultation:
      'We look at the current system, who maintains it, where it is hosted and what actually needs to change.',
    'Planning & Scope':
      'Scope is written as what the system will do, what it will not do, and who owns each account and environment at the end.',
    'Approval & Start':
      'Work starts once scope is agreed. Repository, environment and access arrangements are settled first, on the terms the written agreement sets out.',
    'Design, Development & Updates':
      'Built in reviewable increments on an environment you can see, rather than revealed at the end.',
    Delivery:
      'Handover covers the running system, written documentation of how it is deployed, and the source-code and account arrangements the written agreement sets out.',
    Support:
      'Maintenance, monitoring and further development are scoped separately rather than assumed — as further work or as an ongoing engagement.',
  },
  press: {
    Consultation:
      'We read what exists — a manuscript, a draft, notes, or nothing yet — and establish what the piece is for and who reads it.',
    'Planning & Scope':
      'Scope is written as length, structure, the number of review rounds and what each round covers.',
    'Approval & Start':
      'Work starts once scope is agreed. Research material, interviews and source documents are arranged at this point.',
    'Design, Development & Updates':
      'Drafts are delivered in agreed stages so the direction can be corrected early rather than at the end.',
    Delivery:
      'Final text or production files in the agreed formats. Authorship and copyright arrangements are whatever the written agreement sets out.',
    Support:
      'Further rounds, later editions and ongoing programmes can be scoped as further work or as an ongoing engagement, whichever suits how you work.',
  },
};

/**
 * `SERVICES[division]` — the records, in the order they are presented within their division.
 *
 * `[slug, title, group, covers[], searchIntent, summary, description[], deliverables[], collaborators[], related[]]`
 */
export const SERVICES = {
  design: [
    {
      slug: 'brand-identity-systems',
      title: 'Brand Identity Systems',
      group: 'brand-visual',
      covers: ['Brand identity systems', 'Logo systems', 'Brand guidelines', 'Naming support'],
      searchIntent: 'brand identity design uk',
      summary: 'The logo, the deck and the website each look like a different company.',
      description: [
        'A brand identity system is the set of decisions that makes everything you produce recognisably yours: the mark and its variants, the type and colour rules, and the written guidance that lets someone else apply them without asking you first.',
        'We build the system and the guidelines together. A logo delivered on its own becomes inconsistent the first time a third party uses it, because nothing says how.',
        'Naming support is available within an identity engagement where a name is still open. We develop and test candidate names with you; establishing that a name is legally available is a trade mark search, which we do not carry out.',
      ],
      deliverables: [
        ['Logo suite and lockups', 'Primary mark plus the variants the system needs — horizontal, stacked, single-colour, small-size.'],
        ['Colour and typography system', 'Defined values, hierarchy and the rules for applying them.'],
        ['Written brand guidelines', 'How to use the system, and what not to do with it.'],
        ['Working and export files', 'Editable source files plus the formats your printers and platforms ask for.'],
        ['Trade mark searching and registration', 'A name developed with us still needs clearance and registration by a suitably qualified adviser.', false],
      ],
      collaborators: [],
      related: ['graphic-design-and-collateral', 'presentation-design'],
    },
    {
      slug: 'graphic-design-and-collateral',
      title: 'Graphic Design & Collateral',
      group: 'brand-visual',
      covers: ['Graphic design', 'Print and digital collateral', 'Document/report design'],
      searchIntent: 'graphic designer for business uk',
      summary: 'You have content and no consistent layout system to put it in.',
      description: [
        'Layout work for the material a business actually produces: brochures, one-pagers, reports, signage, adverts and the screen equivalents of all of them.',
        'Where a brand system already exists we work inside it. Where one does not, we agree a consistent set of layout rules as part of the first piece so the second piece is faster and looks related to the first.',
        'Long documents and reports are set as a template rather than a one-off, because a report is rarely published once.',
      ],
      deliverables: [
        ['Layout system or template', 'Grid, type hierarchy and component rules the document set reuses.'],
        ['Designed pieces', 'The items in the agreed scope, set and proofed.'],
        ['Print-ready and screen exports', 'Correct formats, bleed and colour space for the intended output.'],
        ['Source files', 'Editable files where the agreed scope includes them.'],
        ['Copywriting', 'Words are Gridsmith Press. We set the copy you supply, or Press writes it as part of the same engagement.', false],
      ],
      collaborators: ['press'],
      related: ['brand-identity-systems', 'presentation-design'],
    },
    {
      slug: 'packaging-design',
      title: 'Packaging Design',
      group: 'brand-visual',
      covers: ['Packaging design'],
      searchIntent: 'packaging designer uk',
      summary: 'Your printer has rejected the artwork, or there is none to send.',
      description: [
        'Packaging artwork prepared against the dieline and specification your converter or printer supplies, so what is sent is what they can produce.',
        'We work to the constraints of the actual print process — substrate, colour limits, varnish and cut tolerances — rather than designing first and discovering them afterwards.',
        'Regulatory content such as ingredient declarations, warnings and compliance marks is supplied and approved by you. We lay it out; we do not advise on whether it is correct.',
      ],
      deliverables: [
        ['Dieline-accurate artwork', 'Set to the cutter guide supplied by your converter.'],
        ['Print-ready files', 'Correct colour space, separations, bleed and marks for the agreed process.'],
        ['Pre-flight check', 'Artwork checked against the printer specification before it is issued.'],
        ['Regulatory and compliance review', 'Statutory label content is your responsibility and your adviser’s, not ours.', false],
      ],
      collaborators: [],
      related: ['brand-identity-systems', 'product-visualisation'],
    },
    {
      slug: 'campaign-and-social-creative',
      title: 'Campaign & Social Creative',
      group: 'brand-visual',
      covers: ['Marketing and campaign creative', 'Social/content creative'],
      searchIntent: 'campaign creative design agency uk',
      summary: 'A campaign is running and every asset was made by a different person.',
      description: [
        'The visual half of a campaign: adverts, social assets, banners, landing-page visuals and the sized variants each placement needs, made as one set so they read as one campaign.',
        'This is creative production. Where a campaign also needs written copy, content or technical work, those sit with Gridsmith Press and Gridsmith Digital and can run as one coordinated engagement — see the campaign engagement note on the Digital and Press pages.',
        'This page is the creative production. Running the campaign itself — the advertising accounts, the paid placements, the posting schedule — is a separate cross-division Gridsmith engagement rather than part of this service, and it is scoped and quoted on its own terms.',
      ],
      deliverables: [
        ['Campaign creative concept', 'The visual idea and how it holds together across placements.'],
        ['Asset set at required sizes', 'Each placement’s specification, produced as one consistent set.'],
        ['Editable templates', 'So routine variants can be produced without returning to us.'],
        ['Advertising account and paid-placement management', 'Not part of this creative service. Gridsmith does run campaigns and advertising accounts, as a separate cross-division engagement scoped with you.', false],
      ],
      collaborators: ['press', 'digital'],
      related: ['brand-identity-systems', 'motion-graphics'],
    },
    {
      slug: 'presentation-design',
      title: 'Presentation Design',
      group: 'brand-visual',
      covers: ['Presentation design'],
      searchIntent: 'presentation design agency uk',
      summary: 'The deck matters and it was built the night before.',
      description: [
        'Decks designed as a reusable system rather than a single file: a master template, slide layouts for the shapes you actually use, and the charts and diagrams that carry the argument.',
        'Delivered in the software you present from, so your team can keep building slides after the engagement ends.',
      ],
      deliverables: [
        ['Master template and slide layouts', 'Built in PowerPoint, Keynote or Google Slides as agreed.'],
        ['Designed slides in scope', 'The specific deck, set and proofed.'],
        ['Diagrams and data slides', 'Charts and explanatory diagrams drawn to the same system.'],
        ['Speaker notes and scripting', 'Writing the talk is Gridsmith Press.', false],
      ],
      collaborators: ['press'],
      related: ['graphic-design-and-collateral', 'iconography-and-infographics'],
    },
    {
      slug: 'gaming-and-streamer-creative',
      title: 'Gaming & Streamer Creative',
      group: 'brand-visual',
      covers: ['Gaming/streamer creative'],
      searchIntent: 'streamer branding designer',
      summary: 'Your channel looks like the default template it started as.',
      description: [
        'Channel and stream identity: overlays, scene frames, alerts, panels, emotes, thumbnails and the profile artwork that goes with them.',
        'Produced to the current specifications of the platforms you stream on, in the layered formats your broadcast software needs.',
      ],
      deliverables: [
        ['Channel identity', 'Logo, colour and type treatment for the channel.'],
        ['Stream graphics set', 'Overlays, scene frames, alerts and panels at platform specification.'],
        ['Emotes, badges and thumbnails', 'Produced at the sizes each platform requires.'],
        ['Source files', 'Layered files so routine edits can be made in-house.'],
      ],
      collaborators: [],
      related: ['brand-identity-systems', 'motion-graphics'],
    },
    {
      slug: 'illustration',
      title: 'Illustration',
      group: 'illustration',
      covers: ['Digital illustration', 'Custom artwork'],
      searchIntent: 'custom illustrator uk',
      summary: 'You need artwork made for the job rather than bought from a library.',
      description: [
        'Original illustration and artwork drawn to a brief — editorial images, character and concept work, covers, spot illustration and decorative work.',
        'Style is agreed at the sketch stage before any finished artwork is produced, because a finished illustration in the wrong register is a restart rather than an edit.',
      ],
      deliverables: [
        ['Concept sketches', 'Rough options against the brief, for direction.'],
        ['Final artwork', 'In the agreed media, resolution and formats.'],
        ['Layered or vector source', 'Where the agreed scope includes it.'],
        ['Usage rights', 'What you may do with the artwork is set by the written agreement, not assumed from this page.', false],
      ],
      collaborators: [],
      related: ['iconography-and-infographics', 'technical-illustration'],
    },
    {
      slug: 'iconography-and-infographics',
      title: 'Iconography & Infographics',
      group: 'illustration',
      covers: ['Iconography', 'Infographics / visual explanation'],
      searchIntent: 'infographic designer uk',
      summary: 'The explanation needs a picture and the picture does not exist.',
      description: [
        'Icon sets built as a system — one grid, one weight, one set of conventions — and explanatory graphics that make a process, a comparison or a set of figures legible.',
        'Infographics are drawn from data and copy you supply and approve. We do not source statistics, and we do not present a figure we cannot attribute to something you have given us.',
      ],
      deliverables: [
        ['Icon system', 'Consistent grid, weight and corner treatment across the set.'],
        ['Explanatory graphics', 'Diagrams, process visuals and data graphics as scoped.'],
        ['Vector source and web-ready exports', 'SVG plus the raster sizes required.'],
        ['Data research or verification', 'Figures and their sources are supplied and approved by you.', false],
      ],
      collaborators: ['press'],
      related: ['illustration', 'presentation-design'],
    },
    {
      slug: 'technical-illustration',
      title: 'Technical Illustration',
      group: 'illustration',
      covers: ['Technical illustration'],
      searchIntent: 'technical illustrator uk',
      summary: 'A photograph cannot show the part that matters.',
      description: [
        'Illustration of how something is assembled, fitted or used: exploded views, cutaways, callout diagrams and step sequences for manuals, instructions and product documentation.',
        'Drawn from source material you supply — drawings, CAD, photographs or samples — and checked back against it.',
        'This is illustration for explanation. Dimensioned drawing preparation is Technical, on the CAD drafting and engineering drawing pages, and carries its own scope note.',
      ],
      deliverables: [
        ['Exploded and cutaway views', 'Drawn to show assembly order and internal relationships.'],
        ['Step and callout sequences', 'Numbered to match the accompanying text.'],
        ['Line and shaded artwork', 'In the styles and formats the document needs.'],
        ['Technical accuracy sign-off', 'What the illustration depicts is verified against your source material by you.', false],
      ],
      collaborators: ['press'],
      related: ['technical-documentation', 'iconography-and-infographics'],
    },
    {
      slug: 'motion-graphics',
      title: 'Motion Graphics',
      group: 'motion',
      covers: ['Motion graphics', 'Animated brand/content assets'],
      searchIntent: 'motion graphics studio uk',
      summary: 'A still image cannot show how the thing works.',
      description: [
        'Animated graphics for explanation and identity: titles, lower thirds, logo animation, animated social and content assets, and short explanatory sequences.',
        'Storyboarded and approved before animation begins, because changing an idea on a board costs a conversation and changing it in a finished render costs the render.',
        'Delivered as masters plus the per-platform encodes you need.',
      ],
      deliverables: [
        ['Storyboard and timing', 'Approved before any animation is produced.'],
        ['Animated sequence', 'To the agreed length and specification.'],
        ['Delivery masters and platform encodes', 'Formats, aspect ratios and caption files as scoped.'],
        ['Music and stock licensing', 'Licences for third-party music or footage are bought in your name.', false],
      ],
      collaborators: [],
      related: ['animation', 'campaign-and-social-creative'],
    },
    {
      slug: 'animation',
      title: '2D & 3D Animation',
      group: 'motion',
      covers: ['2D animation', '3D animation'],
      searchIntent: 'animation studio uk',
      summary: 'The sequence needs to be animated, not assembled from clips.',
      description: [
        'Character and object animation in 2D and 3D — explainer sequences, product animation, animated scenes and short-form narrative work.',
        'The scope is agreed as a shot list and a duration before production, and approval happens at storyboard and at animatic, so the expensive stage begins on a decision rather than a guess.',
      ],
      deliverables: [
        ['Shot list and storyboard', 'The sequence, agreed before production.'],
        ['Animatic', 'Timing approved before final animation.'],
        ['Final animation', 'Rendered to the agreed specification.'],
        ['Project files', 'Where the agreed scope includes them.'],
      ],
      collaborators: [],
      related: ['motion-graphics', '3d-modelling'],
    },
    {
      slug: '3d-modelling',
      title: '3D Modelling',
      group: '3d-visualisation',
      covers: ['3D modelling'],
      searchIntent: '3d modelling service uk',
      summary: 'You need a digital model of something that exists only as a sketch or a sample.',
      description: [
        'Models built for visualisation, animation and presentation — products, parts, environments and props — from sketches, drawings, photographs or a physical sample.',
        'Modelling for visual output is not a manufacturing or engineering deliverable. Where you need a dimensioned, revision-controlled drawing set, that is CAD drafting and engineering drawings under Technical, and those carry their own scope conditions.',
      ],
      deliverables: [
        ['3D model', 'Built to the agreed level of detail for its intended output.'],
        ['Materials and scene setup', 'Where rendering is in scope.'],
        ['Source and exchange files', 'Native scene plus neutral formats as agreed.'],
        ['Manufacturing or engineering validation', 'A visualisation model is not checked for manufacture, fit, tolerance or performance.', false],
      ],
      collaborators: [],
      related: ['product-visualisation', 'cad-drafting'],
    },
    {
      slug: 'product-visualisation',
      title: 'Product Visualisation',
      group: '3d-visualisation',
      covers: ['Product visualisation', 'Concept rendering', 'Presentation renders'],
      searchIntent: 'product rendering service uk',
      summary: 'You need images of a product you cannot photograph yet.',
      description: [
        'Rendered images of products, concepts and proposals: configurations, finishes, cutaways and presentation views, produced from a model rather than a photograph.',
        'Useful where the product does not physically exist yet, where the variants outnumber what is economic to photograph, or where the view required is one a camera cannot take.',
        'A render shows an intended appearance. It is not evidence that a product can be manufactured, performs as shown, or complies with anything.',
      ],
      deliverables: [
        ['Render set', 'The agreed views, at the agreed resolution.'],
        ['Finish and configuration variants', 'Produced from one model where the scope includes them.'],
        ['Exploded and cutaway views', 'Where they are part of the agreed set.'],
        ['Engineering or performance claims', 'A visualisation implies no engineering responsibility for the product it depicts.', false],
      ],
      collaborators: [],
      related: ['3d-modelling', 'packaging-design'],
    },
    {
      slug: 'cad-drafting',
      title: 'CAD Drafting',
      group: 'technical',
      covers: ['CAD drafting'],
      searchIntent: 'cad drafting service uk',
      summary: 'You have sketches, a survey or a physical part and need them drawn up properly.',
      description: [
        'CAD models and drawings prepared from the material you supply — hand sketches, marked-up prints, measurements, scans or a sample part.',
        'This is drafting to an agreed brief: we prepare the drawings that represent your design. Design intent, dimensions, tolerances and fitness for purpose are yours or your engineer’s, and are checked and approved by you before issue.',
        'Gridsmith does not provide certified engineering design, structural design, or any service carrying regulated professional responsibility.',
      ],
      deliverables: [
        ['CAD model or drawing set', 'Prepared to the agreed standard and layer convention.'],
        ['Native and neutral file formats', 'Working files plus exchange formats such as STEP, DXF or PDF as agreed.'],
        ['Revision-controlled issues', 'Each issue identified and superseded cleanly.'],
        ['Engineering design responsibility', 'We draft to your brief. Design decisions, calculations, tolerances and approval remain yours or your engineer’s.', false],
        ['Certification, stamping or regulatory sign-off', 'Gridsmith does not certify drawings and does not act as a responsible designer.', false],
      ],
      collaborators: [],
      related: ['engineering-drawings', 'technical-documentation'],
    },
    {
      slug: 'engineering-drawings',
      title: 'Engineering Drawings & Schematics',
      group: 'technical',
      covers: ['Engineering drawings', 'Schematics'],
      searchIntent: 'engineering drawing preparation uk',
      summary: 'You need a dimensioned drawing set or a schematic prepared to an agreed brief.',
      description: [
        'Preparation of general arrangement and detail drawings, and of schematic diagrams, from the design information you supply.',
        'Drawings are prepared to the conventions and standard you specify, issued under revision control, and checked back against your source material.',
        'As with CAD drafting, this is drawing preparation. The design being drawn, and its correctness, remain yours or your engineer’s. Gridsmith does not provide certified engineering design, structural design or any regulated engineering service, and does not sign off drawings as a responsible designer.',
      ],
      deliverables: [
        ['General arrangement drawings', 'To the agreed sheet standard and scale.'],
        ['Detail drawings', 'Dimensioned and annotated from your supplied design information.'],
        ['Schematic diagrams', 'Drawn to the convention you specify.'],
        ['Revision-controlled issue set', 'With a revision history on each sheet.'],
        ['Design, calculation and approval', 'We do not originate the design, perform calculations, or approve the drawings for construction or manufacture.', false],
        ['Certification or professional sign-off', 'Not offered. Where a drawing must be certified, it goes to a suitably qualified professional.', false],
      ],
      collaborators: [],
      related: ['cad-drafting', 'technical-documentation'],
    },
    {
      slug: 'technical-documentation',
      title: 'Technical Documentation & Manuals',
      group: 'technical',
      covers: ['Technical document layout', 'Manuals/specification-sheet layout', 'Technical illustration'],
      searchIntent: 'technical manual layout uk',
      summary: 'Your manual is correct and nobody can follow it.',
      description: [
        'Layout and production of technical documents: manuals, installation and maintenance instructions, specification sheets and data sheets, with the illustration that goes inside them.',
        'Built as a template first — numbering, warning styles, table and callout conventions — so later revisions and additional documents stay consistent.',
        'We lay out and illustrate the technical content you supply and approve. The accuracy of instructions, warnings and specifications is yours.',
      ],
      deliverables: [
        ['Document template', 'Numbering, styles and conventions the document set reuses.'],
        ['Typeset document', 'Set, illustrated and proofed.'],
        ['Technical illustration within the document', 'Exploded views, callouts and step diagrams as required.'],
        ['Print and screen exports', 'Including a tagged PDF where the scope requires one.'],
        ['Technical accuracy and safety content', 'Instructions, warnings and compliance statements are authored and approved by you.', false],
      ],
      collaborators: ['press'],
      related: ['technical-illustration', 'engineering-drawings'],
    },
  ],

  digital: [
    {
      slug: 'website-design-build',
      title: 'Website Design & Build',
      group: 'web',
      covers: ['Website design and development', 'UI/UX for digital products'],
      searchIntent: 'website design agency uk',
      summary: 'Your site was built by someone who has moved on, and every change is a negotiation.',
      description: [
        'Design and build of a site you can run afterwards: a design system, the page templates your content actually needs, a content model your team can edit, and written documentation of how it is deployed.',
        'Interface and interaction design is part of the build rather than a separate product. We design the screens in the system being built, not in a prototype that then has to be reinterpreted.',
        'Accessibility and performance are part of the work, not an audit afterwards. This site is built the same way and its own budgets and accessibility checks run on every commit.',
      ],
      deliverables: [
        ['Design system and page templates', 'The components and layouts the site is assembled from.'],
        ['Built, responsive, accessible site', 'Tested at mobile, tablet and desktop widths and with a keyboard.'],
        ['CMS the team can use', 'A content model shaped around your content, not around the database.'],
        ['Handover documentation', 'How it is built, where it runs, and how to deploy a change.'],
        ['Account and hosting arrangements', 'Who holds the hosting, domain and CMS accounts is set out in the written project agreement. Where it suits the engagement we prefer to work in accounts you control.'],
        ['Written content', 'Copy is Gridsmith Press, either supplied by you or written as part of the same engagement.', false],
      ],
      collaborators: ['press', 'design'],
      related: ['cms-implementation', 'ecommerce', 'technical-seo'],
    },
    {
      slug: 'ecommerce',
      title: 'E-commerce',
      group: 'web',
      covers: ['E-commerce'],
      searchIntent: 'ecommerce developer uk',
      summary: 'The store works and the theme fights you every time you want to change something.',
      description: [
        'Online store build and customisation — new stores, replatforming, and work on an existing store that has outgrown its theme.',
        'Covers the product and collection templates, the checkout configuration, and the apps and integrations the store depends on.',
        'Payment, tax and shipping configuration is set up against the accounts and rates you provide. We do not advise on tax treatment or payment regulation.',
      ],
      deliverables: [
        ['Store build or customisation', 'On the platform you use or one agreed at consultation.'],
        ['Product and collection templates', 'Built for the catalogue you actually have.'],
        ['Checkout, payment and shipping configuration', 'Configured against your accounts and your rates.'],
        ['App and integration setup', 'The third-party pieces the store needs, in your accounts.'],
        ['Tax, payments and consumer-law advice', 'Configuration is ours; what is legally correct for your business is your adviser’s.', false],
      ],
      collaborators: ['design'],
      related: ['website-design-build', 'integrations'],
    },
    {
      slug: 'web-applications',
      title: 'Web Applications',
      group: 'web',
      covers: ['Web applications'],
      searchIntent: 'custom web application development uk',
      summary: 'A spreadsheet is running a process that has outgrown it.',
      description: [
        'Applications that run in a browser and do a specific job: scheduling, quoting, tracking, submissions, member areas and the internal processes a spreadsheet has stopped coping with.',
        'Built with authentication, roles and a real data model, deployed on infrastructure held in your accounts, with the migrations and the pipeline documented.',
        'Scope is agreed as what the application does and what it does not do, in writing, before the build starts.',
      ],
      deliverables: [
        ['Scoped application', 'The agreed functionality, built and deployed.'],
        ['Authentication and roles', 'Who can see and do what, defined with you.'],
        ['Data model and migrations', 'Versioned, so the schema has a history.'],
        ['Deployment pipeline', 'Reproducible deploys rather than manual uploads.'],
        ['Source code and accounts', 'In your repository and your hosting accounts.'],
      ],
      collaborators: [],
      related: ['custom-software', 'internal-tools-and-dashboards'],
    },
    {
      slug: 'cms-implementation',
      title: 'CMS Implementation & Content Architecture',
      group: 'web',
      covers: ['CMS implementation', 'Content architecture'],
      searchIntent: 'cms implementation uk',
      summary: 'You want to edit your own site without breaking it.',
      description: [
        'Content modelling and CMS setup: working out what your content actually is, shaping the editing experience around that, and configuring the system so an editor cannot accidentally break a layout.',
        'Content architecture is the part that is usually skipped. Structure decided up front — what is a field, what is a reference, what is a page — is what makes a site still editable in three years.',
        'Includes training for the people who will use it, because a CMS nobody was shown is a CMS nobody edits.',
      ],
      deliverables: [
        ['Content model', 'Types, fields and relationships, documented.'],
        ['CMS configuration', 'Editing interface shaped around the model.'],
        ['Migration of existing content', 'Where the agreed scope includes it.'],
        ['Editor training and written guidance', 'For the people who will actually use it.'],
      ],
      collaborators: ['press'],
      related: ['website-design-build', 'data-and-reporting'],
    },
    {
      slug: 'custom-software',
      title: 'Custom Software & Portals',
      group: 'software',
      covers: ['Custom software', 'Business portals'],
      searchIntent: 'custom software development uk',
      summary: 'No product on the market does the thing your business actually does.',
      description: [
        'Software built for one organisation’s process, including customer, member and partner portals where people outside the business need controlled access to something inside it.',
        'Scoped in writing and built in increments you can see running, so the direction is correctable while it is still cheap to correct.',
        'Source-code handover, account access and infrastructure arrangements are defined in the written project agreement. Handover includes documentation of how the system is built and deployed.',
      ],
      deliverables: [
        ['Scoped application', 'Built to the agreed functional scope.'],
        ['Access control', 'Roles and permissions defined with you.'],
        ['Integrations', 'To the systems it has to talk to, where in scope.'],
        ['Documentation and handover', 'Architecture, deployment and operational notes.'],
      ],
      collaborators: [],
      related: ['web-applications', 'internal-tools-and-dashboards'],
    },
    {
      slug: 'internal-tools-and-dashboards',
      title: 'Internal Tools & Dashboards',
      group: 'software',
      covers: ['Internal tools', 'Dashboards'],
      searchIntent: 'internal business tools developer',
      summary: 'The numbers you need are in four systems nobody has joined up.',
      description: [
        'Small tools and reporting dashboards for the jobs a business does repeatedly: internal admin screens, operational dashboards, and interfaces over data that currently only exists inside other systems.',
        'Built against the systems you already run rather than replacing them, and scoped tightly — an internal tool that tries to become a platform stops being worth its cost.',
      ],
      deliverables: [
        ['Scoped tool or dashboard', 'The specific job, built.'],
        ['Data connections', 'To the systems that hold the data, using their supported interfaces.'],
        ['Access controls', 'Who sees what, agreed with you.'],
        ['Documentation', 'What it reads, what it writes and how it is deployed.'],
      ],
      collaborators: [],
      related: ['data-and-reporting', 'custom-software'],
    },
    {
      slug: 'crm-and-workflow-systems',
      title: 'CRM & Workflow Systems',
      group: 'software',
      covers: ['CRM/workflow systems'],
      searchIntent: 'crm setup and workflow automation uk',
      summary: 'Enquiries arrive in three places and are tracked in none of them.',
      description: [
        'Setting up and connecting the systems that carry work through a business: enquiry capture, pipelines, assignment, statuses, notifications and handover between stages.',
        'Usually configuration and integration of platforms you already pay for, rather than new software. Where no platform fits the process, a custom workflow system is the alternative and is scoped as custom software.',
      ],
      deliverables: [
        ['Process map', 'The workflow as it actually runs, written down first.'],
        ['Configured system', 'Pipelines, stages, fields and permissions.'],
        ['Connections to your other systems', 'Forms, inboxes and downstream tools.'],
        ['Handover and training', 'For the team that operates it.'],
      ],
      collaborators: [],
      related: ['workflow-automation', 'integrations'],
    },
    {
      slug: 'mobile-applications',
      title: 'Mobile & Progressive Web Apps',
      group: 'apps-interactive',
      covers: ['Mobile applications', 'Progressive web applications'],
      searchIntent: 'mobile app developer uk',
      summary: 'It has to work on a phone, and you have no team to maintain it.',
      description: [
        'Mobile applications, and progressive web apps where an installable web application meets the requirement without the cost of app-store distribution.',
        'Which of the two is right is a consultation question — offline behaviour, device features, distribution and update cadence usually decide it, and the cheaper answer is often the right one.',
        'Publisher account arrangements are agreed in writing, and we prefer arrangements that keep the listing under your control. Store review outcomes are decided by Apple and Google and are not something Gridsmith can guarantee.',
      ],
      deliverables: [
        ['Application build', 'To the agreed platforms and functional scope.'],
        ['Store submission assets', 'Listing assets and metadata prepared for submission.'],
        ['Release pipeline', 'Reproducible builds and releases.'],
        ['Store account arrangements', 'Who holds the publisher accounts is agreed in writing. We prefer arrangements that keep the listing under your control.'],
        ['Guaranteed store approval', 'Review outcomes are the platforms’ decision, not ours.', false],
      ],
      collaborators: ['design'],
      related: ['web-applications', 'game-development'],
    },
    {
      slug: 'game-development',
      title: 'Game Development',
      group: 'apps-interactive',
      covers: ['Game development'],
      searchIntent: 'indie game developer uk',
      summary: 'You have a game concept and no one to build it.',
      description: [
        'Development of games and interactive experiences — browser, desktop and mobile — from an agreed design, including prototypes built to test whether a mechanic works before it is committed to.',
        'Art and animation can run alongside through Gridsmith Design; the engagement stays with Digital.',
      ],
      deliverables: [
        ['Playable prototype', 'Where the scope includes proving the mechanic first.'],
        ['Game build', 'To the agreed platforms and feature scope.'],
        ['Source project', 'In your repository.'],
        ['Publishing and marketing', 'Store publishing is scoped separately; audience and sales outcomes are not something we undertake.', false],
      ],
      collaborators: ['design'],
      related: ['mobile-applications', 'animation'],
    },
    {
      slug: 'integrations',
      title: 'API & Systems Integration',
      group: 'automation-intelligence',
      covers: ['API integrations', 'Systems integration'],
      searchIntent: 'api integration developer uk',
      summary: 'Two systems hold the same information and neither knows about the other.',
      description: [
        'Connecting systems so data moves between them without a person copying it: API integrations, webhooks, scheduled synchronisation and the error handling that makes the connection trustworthy.',
        'The part that matters is failure behaviour. An integration that works until it silently stops is worse than no integration, so alerting and retry behaviour are part of the build rather than an extra.',
      ],
      deliverables: [
        ['Integration mapping', 'What moves, in which direction, and what wins on conflict.'],
        ['Built integration', 'Using each system’s supported interfaces.'],
        ['Error handling and alerting', 'So a failure is visible rather than silent.'],
        ['Documentation', 'What it does, and what to check when it stops.'],
      ],
      collaborators: [],
      related: ['workflow-automation', 'data-and-reporting'],
    },
    {
      slug: 'workflow-automation',
      title: 'Workflow Automation',
      group: 'automation-intelligence',
      covers: ['Workflow automation'],
      searchIntent: 'business process automation uk',
      summary: 'The same file is copied between the same three systems every week by a person.',
      description: [
        'Automating the repeated manual steps in a business process — file handling, notifications, record creation, approvals and scheduled jobs.',
        'We map the process as it actually runs before automating it. Automating a broken process makes it fail faster, so the map frequently changes the scope.',
      ],
      deliverables: [
        ['Process map', 'The current process, documented and agreed.'],
        ['Automated pipeline', 'Built on your systems and accounts.'],
        ['Failure alerting', 'Notification when a run does not complete.'],
        ['Runbook', 'What to do when it needs human attention.'],
      ],
      collaborators: [],
      related: ['integrations', 'crm-and-workflow-systems'],
    },
    {
      slug: 'ai-integration',
      title: 'AI Integration & Agent Workflows',
      group: 'automation-intelligence',
      covers: ['AI integrations', 'AI agent/workflow development'],
      searchIntent: 'ai integration for business uk',
      summary: 'You want a specific job done by a model, not a chatbot bolted onto the corner of a page.',
      description: [
        'Integration of language models into systems that already exist, and agent workflows that carry out a defined task with defined limits on what they can reach and change.',
        'Work starts with the use case and an evaluation set — the examples that decide whether the output is acceptable. Without one, there is no way to tell an improvement from a change.',
        'Guardrails, logging and a human decision point where the output has consequences are part of the build. Where the work processes personal data, the lawful basis and the records are yours; we build to the arrangement you set.',
      ],
      deliverables: [
        ['Use-case definition and evaluation set', 'What good output is, written down and testable.'],
        ['Integration into an existing system', 'Rather than a separate tool nobody opens.'],
        ['Guardrails and logging', 'Bounded permissions, and a record of what was done.'],
        ['Documented limitations', 'Where the approach is unreliable, stated rather than smoothed over.'],
        ['Guaranteed accuracy', 'Model output is probabilistic. We build evaluation and review around that; we do not promise correctness.', false],
      ],
      collaborators: [],
      related: ['integrations', 'data-and-reporting'],
    },
    {
      slug: 'data-and-reporting',
      title: 'Data, Reporting & Analytics Infrastructure',
      group: 'automation-intelligence',
      covers: ['Data/reporting systems', 'Analytics infrastructure'],
      searchIntent: 'business reporting and analytics setup uk',
      summary: 'Every report is rebuilt by hand and no two of them agree.',
      description: [
        'Reporting pipelines and the analytics infrastructure underneath them: collecting data from the systems that hold it, defining the measures once, and producing reports that reconcile because they come from the same definitions.',
        'Analytics implementation here means your measurement — tags, events, consent handling and the data layer on your properties. It is client work, and it is unrelated to the separate decision about whether this website runs analytics of its own.',
        'Where measurement involves personal data or consent, we implement the arrangement your policy sets; we do not decide it for you.',
      ],
      deliverables: [
        ['Measure definitions', 'Agreed once, so reports reconcile.'],
        ['Data pipeline', 'Collection and transformation from the source systems.'],
        ['Reports or dashboards', 'The outputs in the agreed scope.'],
        ['Consent-aware tracking implementation', 'Built to your published policy and consent arrangement.'],
        ['Data protection advice', 'Lawful basis, policy wording and records of processing are yours and your adviser’s.', false],
      ],
      collaborators: [],
      related: ['internal-tools-and-dashboards', 'integrations'],
    },
    {
      slug: 'maintenance-and-monitoring',
      title: 'Maintenance, Hosting Coordination & Monitoring',
      group: 'operate-improve',
      covers: ['Website/software maintenance', 'Hosting coordination', 'Monitoring'],
      searchIntent: 'website maintenance and monitoring uk',
      summary: 'Nobody currently owns the question of whether it is up.',
      description: [
        'Ongoing care of a running site or application: updates, dependency and security patching, backups, uptime and error monitoring, and the hosting work the engagement needs.',
        'Hosting coordination and management covers configuration, deployment, maintenance and monitoring, and dealing with the host on your behalf. How the hosting is arranged and who holds the account is decided per project and set out in the written agreement; where it suits the engagement we prefer accounts you can access directly.',
        'What is covered, and how quickly we respond to what, is set out in the written agreement for the engagement rather than promised here.',
      ],
      deliverables: [
        ['Updates and patching', 'Dependencies and platform updates applied and tested.'],
        ['Backups', 'Configured, and restore tested rather than assumed.'],
        ['Uptime and error monitoring', 'With alerting to an agreed contact.'],
        ['Hosting coordination and management', 'Configuration, deployment and monitoring, on the arrangement agreed for the project.'],
        ['A standing service level', 'What is covered and how quickly we respond is set by the written agreement for the engagement, not promised here.', false],
      ],
      collaborators: [],
      related: ['performance-and-accessibility', 'technical-seo'],
    },
    {
      slug: 'performance-and-accessibility',
      title: 'Performance & Accessibility',
      group: 'operate-improve',
      covers: ['Performance optimisation', 'Accessibility improvements'],
      searchIntent: 'website performance and accessibility audit uk',
      summary: 'It is slow, or it is unusable with a keyboard, and you have been told conflicting things about why.',
      description: [
        'Measuring what a site actually does for real users and fixing what the measurements show: loading performance and interaction responsiveness, and accessibility against WCAG 2.2 AA.',
        'Findings come with the measurement that produced them. An audit that lists issues without the evidence is unarguable in both directions.',
        'Automated testing finds a minority of accessibility problems. Where a full conformance position is needed, manual and assistive-technology testing is scoped explicitly and its limits are stated.',
      ],
      deliverables: [
        ['Measured audit', 'Against real page loads and real assistive-technology behaviour, not a single score.'],
        ['Prioritised fix list', 'Ordered by user impact and effort.'],
        ['Implementation of the fixes', 'Where implementation is in scope.'],
        ['Regression checks', 'So the fixes stay fixed.'],
        ['Formal accessibility certification', 'Not included unless explicitly scoped. We report the standards tested, the evidence, the findings and the residual issues.', false],
      ],
      collaborators: [],
      related: ['technical-seo', 'maintenance-and-monitoring'],
    },
    {
      slug: 'technical-seo',
      title: 'Technical SEO',
      group: 'operate-improve',
      covers: ['Technical SEO'],
      searchIntent: 'technical seo audit uk',
      summary: 'The site is hard to crawl and you cannot get a straight answer about why.',
      description: [
        'The technical half of search: crawlability and indexing, site and URL architecture, structured data, redirects, canonicalisation, sitemaps and the page performance that search engines measure.',
        'The other half — what the pages say, and whether anyone wants to read them — is Gridsmith Press. Content SEO and editorial strategy sit there, and the two halves are frequently scoped as one engagement across both divisions.',
        'No ranking outcome is promised. Search results are decided by search engines.',
      ],
      deliverables: [
        ['Technical audit', 'Against crawl data and measured page performance.'],
        ['Prioritised fix list', 'With the evidence behind each item.'],
        ['Implementation', 'Where the fixes are in scope.'],
        ['Structured data and redirect mapping', 'Where the site needs them.'],
        ['Ranking or traffic guarantees', 'Gridsmith does not guarantee search rankings or traffic outcomes. We fix what is measurably wrong and show the measurement.', false],
      ],
      collaborators: ['press'],
      related: ['performance-and-accessibility', 'website-design-build'],
    },
    {
      slug: 'iterative-product-development',
      title: 'Iterative Product Development',
      group: 'operate-improve',
      covers: ['Iterative product development'],
      searchIntent: 'ongoing product development partner uk',
      summary: 'The thing is live and now it needs to keep changing.',
      description: [
        'Continuing development of a system that already exists, run as a sequence of agreed increments rather than a single project: prioritisation, build, release and review.',
        'Suited to products that are live and earning, where the next thing to build is a decision taken repeatedly rather than once at the start.',
        'Scope and commitment are set in the written agreement for the engagement.',
      ],
      deliverables: [
        ['Prioritised backlog', 'Maintained with you rather than handed over.'],
        ['Agreed increments', 'Built, reviewed and released.'],
        ['Release notes', 'What changed, each time.'],
        ['Review cycle', 'A point at which direction is reconsidered.'],
      ],
      collaborators: [],
      related: ['maintenance-and-monitoring', 'web-applications'],
    },
  ],

  press: [
    {
      slug: 'ghostwriting',
      title: 'Ghostwriting',
      group: 'writing',
      covers: ['Ghostwriting'],
      searchIntent: 'ghostwriter uk',
      summary: 'The book is in your head and it has been there for three years.',
      description: [
        'Writing a book, memoir, or long-form piece in your voice and under your name, from interviews, notes, recordings and whatever material already exists.',
        'The method is an interview programme and staged drafts: you hear the voice early and correct it while correcting is cheap.',
        'Authorship, credit and copyright are set by the written agreement for the engagement. We do not assume them, and this page does not set them.',
      ],
      deliverables: [
        ['Interview programme', 'Structured sessions, recorded and transcribed.'],
        ['Outline and sample chapter', 'Voice and structure agreed before the full draft.'],
        ['Staged drafts', 'Delivered in agreed parts rather than all at the end.'],
        ['Full manuscript', 'To the agreed length and scope.'],
        ['Publication or sales outcomes', 'Writing the book is what we undertake. What happens to it afterwards is not something anyone can promise.', false],
      ],
      collaborators: [],
      related: ['book-writing-and-development', 'manuscript-development'],
    },
    {
      slug: 'book-writing-and-development',
      title: 'Book Writing & Development',
      group: 'writing',
      covers: ['Book writing/development'],
      searchIntent: 'book development editor uk',
      summary: 'You know what the book is about and not what it is.',
      description: [
        'Developing a book from an idea into a workable shape and writing it — non-fiction, business books, guides and reference works — with you named as author and involved throughout.',
        'The development half is the part that decides whether the book works: what it argues, who it is for, what order it goes in, and what has to be cut.',
        'Where you intend to write it yourself, manuscript development under Editorial is the same thinking applied to your own draft.',
      ],
      deliverables: [
        ['Concept and audience definition', 'What the book is and who reads it.'],
        ['Structural outline', 'Chapter by chapter, agreed before drafting.'],
        ['Drafted chapters', 'In agreed stages.'],
        ['Revised manuscript', 'Through the agreed review rounds.'],
      ],
      collaborators: [],
      related: ['ghostwriting', 'publishing-preparation'],
    },
    {
      slug: 'website-and-business-copywriting',
      title: 'Website & Campaign Copywriting',
      group: 'writing',
      covers: ['Website copywriting', 'Sales/campaign copywriting'],
      searchIntent: 'business copywriter uk',
      summary: 'Your pages have been written a piece at a time and no longer say one thing.',
      description: [
        'Copy for websites, landing pages, campaigns, email and sales material — written from a messaging framework agreed first, so the pages say one consistent thing.',
        'Where the site is also being built or a campaign is also being designed, Press writes the words while Gridsmith Digital and Gridsmith Design do the build and the creative. It runs as one engagement; the copy is still written here.',
        'We write claims you can substantiate. Anything presented as a fact, figure or result has to come from you.',
      ],
      deliverables: [
        ['Messaging framework', 'What is said, to whom, in what order.'],
        ['Page or campaign copy', 'For the scoped pages and assets.'],
        ['Review rounds', 'The number agreed in the written scope.'],
        ['Substantiation of claims', 'Figures, results and credentials must be supplied and stood behind by you.', false],
      ],
      collaborators: ['digital', 'design'],
      related: ['thought-leadership-and-reports', 'content-seo'],
    },
    {
      slug: 'thought-leadership-and-reports',
      title: 'Thought Leadership, Whitepapers & Reports',
      group: 'writing',
      covers: ['Thought leadership', 'Whitepapers', 'Industry/business reports'],
      searchIntent: 'whitepaper and report writer uk',
      summary: 'You have the expertise and nothing published that demonstrates it.',
      description: [
        'Long-form business writing: positioning articles, whitepapers, industry reports and research write-ups, developed from your expertise through interviews and the material you hold.',
        'Where a report presents data, the data and its provenance come from you or from sources we agree and cite. We do not generate findings.',
        'Design and typesetting of the finished document runs through Gridsmith Design; the writing stays here.',
      ],
      deliverables: [
        ['Outline and research plan', 'Scope, sources and argument agreed first.'],
        ['Draft document', 'Written from interviews and supplied material.'],
        ['Final edited copy', 'Through the agreed review rounds.'],
        ['Source citations', 'Every figure traceable to something you can stand behind.'],
        ['Original research', 'We write up findings; we do not conduct the study.', false],
      ],
      collaborators: ['design'],
      related: ['website-and-business-copywriting', 'content-programmes'],
    },
    {
      slug: 'manuscript-assessment',
      title: 'Manuscript Assessment',
      group: 'editorial',
      covers: ['Manuscript assessment'],
      searchIntent: 'manuscript assessment uk',
      summary: 'You want to know whether it is any good before spending anything else on it.',
      description: [
        'A written assessment of a complete manuscript: what works, what does not, what it would take to fix, and whether that is worth doing.',
        'The recommendation is honest, and it includes the possibility that the answer is not yet, or not with us. An assessment that always recommends the next paid stage is worthless as an assessment.',
      ],
      deliverables: [
        ['Written assessment', 'Structure, voice, pacing, argument and audience fit.'],
        ['Structural recommendations', 'What to change, in priority order.'],
        ['A clear recommendation', 'Including "not yet", or that another route suits it better.'],
        ['Line editing', 'An assessment reads the whole and does not edit the sentences. That is copy editing.', false],
      ],
      collaborators: [],
      related: ['manuscript-development', 'copy-editing-and-proofreading'],
    },
    {
      slug: 'manuscript-development',
      title: 'Manuscript Development & Structural Editing',
      group: 'editorial',
      covers: ['Manuscript development', 'Developmental/structural editing'],
      searchIntent: 'developmental editor uk',
      summary: 'Your manuscript has reached the point where the structure needs another pair of eyes.',
      description: [
        'Developmental and structural editing: the level that changes what the book is, rather than how the sentences read — order, argument, pacing, what is missing and what has to go.',
        'Works from a full draft, or alongside one in progress where the structure needs settling before more is written.',
        'Structural work comes before copy editing. Copy editing a chapter that is later cut is wasted on both sides.',
      ],
      deliverables: [
        ['Developmental notes', 'On structure, argument and pacing.'],
        ['Revised structure', 'A working chapter plan for the rewrite.'],
        ['Editorial support through revision', 'Where the agreed scope includes it.'],
      ],
      collaborators: [],
      related: ['manuscript-assessment', 'copy-editing-and-proofreading'],
    },
    {
      slug: 'copy-editing-and-proofreading',
      title: 'Copy Editing & Proofreading',
      group: 'editorial',
      covers: ['Copy editing', 'Proofreading'],
      searchIntent: 'copy editing and proofreading uk',
      summary: 'It is done and you cannot see it clearly any more.',
      description: [
        'Copy editing for sense, consistency, grammar and style against an agreed style guide, and proofreading as the final pass against typeset proofs.',
        'They are separate stages and are normally done at separate times. Copy editing happens to the text; proofreading happens to the laid-out pages, and catches what layout introduced.',
      ],
      deliverables: [
        ['Copy edit', 'Tracked changes against an agreed style guide.'],
        ['Style sheet', 'Decisions recorded so later material stays consistent.'],
        ['Proofread against proofs', 'On the typeset pages, not the manuscript.'],
        ['Fact checking', 'Only where it is explicitly scoped and the sources are supplied.', false],
      ],
      collaborators: [],
      related: ['manuscript-development', 'typesetting-and-formatting'],
    },
    {
      slug: 'publishing-preparation',
      title: 'Publishing Preparation & Distribution Setup',
      group: 'publishing',
      covers: ['Publishing preparation', 'Distribution/platform setup', 'ISBN guidance/support'],
      searchIntent: 'self publishing support uk',
      summary: 'You have a finished manuscript and no route to a published book.',
      description: [
        'The production and administrative work between a finished manuscript and a book that exists: publishing plan, metadata, ISBN, and setting up the distribution and platform accounts.',
        'Account and ISBN arrangements are agreed in writing before anything is registered. An ISBN registered to a service provider records that provider as the publisher of your book, which is a consequence people discover late — so unless you decide otherwise, we set these up in your name.',
        'Acceptance by any retailer or distributor is their decision. We prepare and submit to their published requirements; we do not control the outcome, and no sales result is promised.',
      ],
      deliverables: [
        ['Publishing plan', 'Formats, channels and sequence.'],
        ['ISBN guidance', 'How to obtain your own, and what it commits you to.'],
        ['Metadata and listing preparation', 'Prepared to each platform’s specification.'],
        ['Distribution account setup', 'Set up on the arrangement agreed in writing — by default in your name, so the listing and the royalties stay with you.'],
        ['Retailer acceptance or sales outcomes', 'Listing decisions rest with the retailer and sales outcomes cannot be guaranteed.', false],
      ],
      collaborators: ['design'],
      related: ['typesetting-and-formatting', 'cover-design-coordination'],
    },
    {
      slug: 'typesetting-and-formatting',
      title: 'Typesetting & Formatting',
      group: 'publishing',
      covers: ['Typesetting', 'Ebook/print formatting', 'Platform-standard formatting'],
      searchIntent: 'book typesetting and ebook formatting uk',
      summary: 'The inside of the book looks like a word processor.',
      description: [
        'Typesetting the interior of a book and producing the files each channel requires: a print interior set for the trim size and binding, and a reflowable ebook that behaves correctly on the devices people read on.',
        'Files are built to the current published specifications of the platforms in scope and checked against their validators before submission.',
      ],
      deliverables: [
        ['Typeset print interior', 'Set for the agreed trim size, margins and binding allowance.'],
        ['Reflowable ebook', 'With a working table of contents and correct structural markup.'],
        ['Platform-ready files', 'Validated against each platform’s current requirements.'],
        ['Proof review', 'A proofreading pass on the typeset pages is scoped under Editorial.', false],
      ],
      collaborators: [],
      related: ['publishing-preparation', 'copy-editing-and-proofreading'],
    },
    {
      slug: 'cover-design-coordination',
      title: 'Cover Design Coordination',
      group: 'publishing',
      covers: ['Cover-design coordination'],
      searchIntent: 'book cover design uk',
      summary: 'The cover has to work as a thumbnail and as a printed object.',
      description: [
        'Gridsmith Press runs the publishing engagement and briefs the cover; Gridsmith Design does the visual work. That split is deliberate — the cover is a design problem, and the book is a publishing relationship.',
        'Coordination covers the brief, the category and format conventions the cover has to sit inside, the print specification from your printer, and the versions each channel needs.',
      ],
      deliverables: [
        ['Cover brief', 'Category conventions, format and requirements, written for the designer.'],
        ['Design coordination', 'Managed with Gridsmith Design through to approved artwork.'],
        ['Print-ready cover', 'Built to your printer’s spine and bleed specification.'],
        ['Channel variants', 'Ebook and print versions at the required specifications.'],
      ],
      collaborators: ['design'],
      related: ['publishing-preparation', 'typesetting-and-formatting'],
    },
    {
      slug: 'content-programmes',
      title: 'Content Programmes',
      group: 'content-promotion',
      covers: ['Ongoing content programmes'],
      searchIntent: 'content marketing programme uk',
      summary: 'You need a reliable content rhythm rather than occasional publishing.',
      description: [
        'Ongoing editorial work at an agreed cadence: an editorial plan, the pieces themselves, and a review at each cycle that decides what the next one contains.',
        'The cadence is whatever you can sustain and is agreed in the written scope. A programme that assumes more than a business can review is a programme that stops.',
      ],
      deliverables: [
        ['Editorial plan', 'Themes, formats and cadence.'],
        ['Pieces at the agreed cadence', 'Written and edited.'],
        ['Review each cycle', 'What worked, what the next cycle changes.'],
      ],
      collaborators: ['digital'],
      related: ['content-seo', 'thought-leadership-and-reports'],
    },
    {
      slug: 'content-seo',
      title: 'Content SEO',
      group: 'content-promotion',
      covers: ['Content SEO'],
      searchIntent: 'seo content strategy uk',
      summary: 'Your pages need a clear reader and a reason to rank for them.',
      description: [
        'The editorial half of search: what to write about, what a page is actually for, how it is structured, and optimisation of existing content that is close to useful and not quite there.',
        'The technical half — crawling, indexing, structured data, performance — is Gridsmith Digital. Neither half works alone, and they are commonly scoped together across the two divisions.',
        'No ranking or traffic outcome is promised.',
      ],
      deliverables: [
        ['Content and search strategy', 'What to write, and why that.'],
        ['Page-level briefs', 'Intent, structure and scope per piece.'],
        ['Optimisation of existing content', 'Rewrites and restructuring where scoped.'],
        ['Ranking guarantees', 'Not offered. Search results are the search engines’ decision.', false],
      ],
      collaborators: ['digital'],
      related: ['content-programmes', 'website-and-business-copywriting'],
    },
    {
      slug: 'book-marketing-support',
      title: 'Book Marketing Support',
      group: 'content-promotion',
      covers: ['Book marketing/support'],
      searchIntent: 'book marketing support uk',
      summary: 'Your book is ready for a structured launch and the content that supports it.',
      description: [
        'Written and editorial support around a book’s release: description and metadata copy, author platform material, announcement and outreach copy, and the supporting content a launch needs.',
        'This is the writing and editorial work. It is not publicity representation, and coverage, reviews, chart positions and sales figures cannot be guaranteed.',
      ],
      deliverables: [
        ['Book description and metadata copy', 'Written for the listing as well as for the reader.'],
        ['Author platform material', 'Bio, site copy and supporting pages.'],
        ['Launch and outreach copy', 'Announcements and approach material.'],
        ['Publicity representation', 'We do not act as a publicist or pitch media on your behalf.', false],
        ['Coverage, reviews or sales results', 'Coverage, reviews and sales outcomes cannot be guaranteed, and Gridsmith does not promise them.', false],
      ],
      collaborators: ['digital'],
      related: ['content-programmes', 'publishing-preparation'],
    },
  ],
};
