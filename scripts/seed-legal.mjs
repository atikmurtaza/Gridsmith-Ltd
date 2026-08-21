/**
 * The five legal documents, drafted from **this build's actual facts** — the processors it
 * really uses, the cookie it really sets, the consent categories it really implements, and the
 * lead-form fields really defined in `lib/leads/schema.ts`.
 *
 * ## Two markers, two different meanings
 *
 * **`[SEED - SOLICITOR REVIEW REQUIRED]`** heads every document. `solicitorApproved` is
 * `false` on all five, which is what `master/SCHEMA.md` says gates publication: the production
 * build check treats an unapproved legal document the way it treats seed content. `L-04` is
 * the hard gate.
 *
 * **`[DECISION]`** marks a choice that belongs to the owner, not to a draft — retention
 * periods, liability caps, IP transfer point. Each carries a sensible default so the page
 * renders and the shape can be reviewed; none is a recommendation.
 *
 * ## Why every clause names its instrument
 *
 * `CLAUDE.md` #2 forbids invented clause references, and a privacy notice is mostly a list of
 * things a specific instrument requires you to say. Naming the instrument per clause makes the
 * solicitor's job a check rather than a rewrite, and makes it obvious when a clause is here
 * because it is required and when it is here because someone thought it sounded good.
 *
 * **The instruments cited are real and the citations are to articles and regulations, never to
 * page or paragraph numbers of a commentary.** Where this draft is uncertain which limb of an
 * instrument applies, it says so in the clause rather than guessing at a sub-paragraph.
 */

const S = '[SEED - SOLICITOR REVIEW REQUIRED]';
const D = '[DECISION]';

/**
 * Vercel's serverless function region for this project, as a fact rather than an assumption.
 *
 * MEASURED, not read from Vercel's docs: `x-vercel-id` on a response served through a Vercel
 * function reads `iad1:iad1::...` — edge and function both `iad1`, Washington D.C., USA. The
 * *edge* is global and is not a single region: the same header reads `lhr1` (London) when the
 * request originates in the UK, which is why the clause names the edge and the function region
 * separately rather than collapsing them into one place name.
 *
 * This is the processor's LOCATION and nothing more. Whether an Art. 46 mechanism is needed
 * and which one applies is a legal question for the L-01 review and is marked `[DECISION]` in
 * 4.2. Do not infer the answer from this constant.
 */
const VERCEL_FUNCTION_REGION = 'iad1 (Washington, D.C., United States)';

const blocks = (prefix, paragraphs) =>
  paragraphs.map((text, i) => ({
    _type: 'block',
    _key: `${prefix}-b${i}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${prefix}-s${i}`, text, marks: [] }],
  }));

/** `[number, heading, basis, [paragraphs]]` */
const doc = (slug, title, summary, clauses) => ({
  _id: `seed-legal-${slug}`,
  _type: 'legalDocument',
  slug: { _type: 'slug', current: slug },
  title,
  version: '0.1-draft',
  effectiveFrom: '2026-08-21',
  lastReviewed: '2026-08-21',
  reviewedBy: 'Internal — not reviewed by a solicitor',
  solicitorApproved: false,
  summary: `${S} ${summary}`,
  clauses: clauses.map(([number, heading, basis, paragraphs], i) => ({
    _type: 'legalClause',
    _key: `${slug}-c${i}`,
    number,
    heading,
    // Contracts cite these. Renumbering is a version bump plus a redirect, never an edit.
    anchorId: `clause-${number.replace(/\./g, '-')}`,
    basis,
    body: blocks(`${slug}${i}`, paragraphs),
  })),
  isSeed: true,
});

// ---------------------------------------------------------------------------

const privacy = doc(
  'privacy',
  'Privacy Policy',
  'What Gridsmith Ltd does with personal data collected through this website, who processes it, and how to exercise your rights. This draft has not been reviewed by a solicitor.',
  [
    ['1.1', 'Who we are', 'UK GDPR Art. 13(1)(a); Companies (Trading Disclosures) Regulations 2015 reg. 24–25', [
      'Gridsmith Ltd is the data controller for personal data collected through this website. The company is registered in England & Wales, company number 17050842, registered office 30 Briarfield Road, Farnworth, Bolton, BL4 0HD.',
      'Gridsmith Design, Gridsmith Digital and Gridsmith Press are trading divisions of Gridsmith Ltd. They are not separate companies and are not separate controllers; whichever division you deal with, the controller is Gridsmith Ltd.',
      'You can contact us about anything in this policy at contact@gridsmith.uk.',
    ]],
    ['1.2', 'Data protection registration', 'Data Protection (Charges and Information) Regulations 2018 reg. 2', [
      `${D} Gridsmith Ltd's registration with the Information Commissioner's Office is pending. The registration number is published here once issued (tracker row L-06). A controller processing personal data by automated means is required to pay a charge and be entered on the ICO's register unless an exemption applies; no exemption is being relied on.`,
    ]],
    ['2.1', 'What we collect when you contact us', 'UK GDPR Art. 13(1)(c) and Art. 5(1)(c)', [
      'The enquiry form collects: your name and email address, which are required; and optionally your company, role, telephone number, your message, an indicative budget band, an indicative timeline, which division or service your enquiry concerns, and the type of enquiry.',
      'It also records how you arrived: the referring page, the page you landed on, and any campaign parameters in the link you followed, together with a flag recording whether the referrer appears to be an AI assistant. This is used to understand which routes bring enquiries, not to identify you.',
      'We do not ask for and do not want special category data, financial details, or identity documents through this form.',
    ]],
    ['2.2', 'What we collect automatically', 'PECR reg. 6; UK GDPR Art. 13(1)(c)', [
      'With your consent, we collect analytics data about how pages on this site are used. Without your consent, we do not — no analytics script is loaded and no analytics cookie is set until you choose. This is described in full in the Cookie Policy.',
      'Our hosting provider processes server request logs, including IP addresses, as a necessary part of delivering the site and protecting it from abuse.',
    ]],
    ['3.1', 'Why we process it, and on what basis', 'UK GDPR Art. 6(1)(b) and Art. 6(1)(f); PECR reg. 6(2)', [
      'Responding to your enquiry and preparing a quotation: Article 6(1)(b), steps taken at your request prior to entering into a contract.',
      'Keeping a record of enquiries, and protecting the site from abuse: Article 6(1)(f), our legitimate interest in running the business and keeping the service available. We have considered your interests and rights and consider this proportionate because the data is limited to what you chose to send us.',
      'Analytics and any non-essential storage: your consent, given through the banner, and withdrawable at any time. Consent is the lawful basis for the processing as well as the basis for the storage access under PECR reg. 6.',
    ]],
    ['3.2', 'We do not sell or share your data for advertising', 'UK GDPR Art. 13(1)(e)', [
      'We do not sell personal data. We do not share it with advertising networks. The ad_storage consent category exists in our consent implementation because Google Consent Mode defines it, and it is set to denied and left denied; nothing on this site currently uses it.',
    ]],
    ['4.1', 'Processors we use', 'UK GDPR Art. 28 and Art. 13(1)(e)', [
      'Sanity (content management) — stores the website content, and stores no enquiry data.',
      'Supabase (database) — stores enquiries submitted through the form.',
      'Resend (transactional email) — delivers the notification email that tells us an enquiry has arrived.',
      `Hosting — Vercel Inc. The site is built and served by Vercel. Static content is delivered from Vercel's global edge network, which serves each visitor from the nearest location; serverless functions for this project run in Vercel's ${VERCEL_FUNCTION_REGION} region. ${D} The Art. 46 transfer mechanism relied on for Vercel must be confirmed by the solicitor review at L-01 and named here before publication — see 4.2.`,
      'Google Analytics 4 (analytics) — only after you consent.',
      'PostHog (product analytics) — only after you consent, and configured against PostHog\'s EU host.',
      'Each is engaged under that provider\'s standard data processing terms. Article 28(3) requires a written contract; the review at L-04 should confirm each provider\'s terms have been accepted in Gridsmith\'s name and are on file.',
    ]],
    ['4.2', 'International transfers', 'UK GDPR Art. 44–46', [
      `${D} Some of the providers above operate outside the UK. PostHog is configured against its EU host specifically so that product analytics data stays in the EU. Vercel serves this site from a global edge network and runs this project's serverless functions in the United States, so a transfer mechanism is required for it. For Vercel and for the remainder, the mechanism is the provider's standard contractual clauses or the UK Addendum, and the specific mechanism relied on for each provider must be confirmed and stated here before publication.`,
    ]],
    ['5.1', 'How long we keep it', 'UK GDPR Art. 5(1)(e) and Art. 13(2)(a)', [
      `${D} Enquiries that do not become work: kept for 24 months from the last contact, then deleted. Rationale: enquiries commonly return within a project cycle, and 24 months is short enough to be defensible and long enough to be useful.`,
      `${D} Enquiries that become work: kept for 6 years after the end of the engagement, to align with the limitation period for a simple contract under section 5 of the Limitation Act 1980 and with the record-keeping period in section 388 of the Companies Act 2006.`,
      `${D} Analytics data: retained for 14 months, the shortest retention Google Analytics 4 offers for event data.`,
      'Your consent choice is stored in your browser for 12 months, after which you will be asked again.',
    ]],
    ['6.1', 'Your rights', 'UK GDPR Art. 15–22 and Art. 13(2)(b)', [
      'You have the right to ask for a copy of your personal data, to have it corrected, to have it erased, to restrict or object to how we use it, and to receive it in a portable form. Where we rely on your consent, you can withdraw it at any time without affecting processing already carried out.',
      'Ask by emailing contact@gridsmith.uk. We will respond within one month, as Article 12(3) requires.',
    ]],
    ['6.2', 'Complaints', 'UK GDPR Art. 13(2)(d); Data Protection Act 2018 s. 165', [
      'If you are unhappy with how we have handled your data you can complain to the Information Commissioner\'s Office at ico.org.uk, or on 0303 123 1113. We would rather you told us first, but you do not have to.',
    ]],
    ['7.1', 'Automated decision-making', 'UK GDPR Art. 13(2)(f) and Art. 22', [
      'We do not make decisions about you by automated means that produce legal or similarly significant effects. The referral flag described at 2.1 classifies where a visit came from, not who you are, and no decision about your enquiry is taken from it.',
    ]],
    ['8.1', 'Changes to this policy', 'UK GDPR Art. 5(1)(a)', [
      'The version number and effective date at the top of this page change when the policy does. Previous versions are kept and are available on request.',
    ]],
  ],
);

const cookies = doc(
  'cookies',
  'Cookie Policy',
  'Every cookie and similar technology this site uses, what it does, how long it lasts, and how to change your mind. This draft has not been reviewed by a solicitor.',
  [
    ['1.1', 'Nothing non-essential runs before you choose', 'PECR reg. 6(1) and 6(2)', [
      'Regulation 6 permits storing information on your device, or gaining access to information already stored, only where you have been given clear information about the purpose and have given consent. The only exception is where the storage is strictly necessary to provide a service you have asked for.',
      'On this site that rule is implemented rather than described: on a first visit, with no interaction, no cookie is set and no request is made to any analytics provider. That is asserted on every audited route by an automated check that fails the build if a cookie appears.',
    ]],
    ['1.2', 'The strictly necessary cookie', 'PECR reg. 6(4)', [
      'gs_consent — records which consent categories you granted. Set only once you have made a choice. First-party, Path=/, SameSite=Lax, Secure over HTTPS, expires after 12 months. It holds a comma-separated list of granted category names, or the single character 0 if you granted none. It contains no identifier and nothing about you.',
      'This cookie is exempt from the consent requirement because it exists to record your consent decision; a site that had to ask permission to remember your refusal could not honour the refusal.',
    ]],
    ['2.1', 'The consent categories', 'PECR reg. 6(2); UK GDPR Art. 4(11)', [
      'analytics_storage — analytics about how the site is used. Defaults to denied.',
      'ad_storage — advertising storage. Defaults to denied, and nothing on this site currently uses it. It is declared because Google Consent Mode v2 defines the signal and omitting it would leave the signal unset rather than denied.',
      'functionality_storage — optional convenience storage. Defaults to denied.',
      'The defaults above are the state before you choose, not merely our intention: an automated check asserts that the unmade choice is transmitted as denied rather than left unset.',
    ]],
    ['2.2', 'What runs after you accept analytics', 'PECR reg. 6(2); UK GDPR Art. 6(1)(a)', [
      'Google Analytics 4 — sets first-party cookies in the _ga family. Google documents _ga as expiring after two years and _ga_<container-id> likewise. These are set by Google\'s script, not by us, so their exact names and durations follow Google\'s current implementation.',
      'PostHog — product analytics, loaded against PostHog\'s EU host so that the data stays in the EU. PostHog sets a first-party cookie in the ph_<key>_posthog family.',
      `${D} The measurement ID and project key are not yet issued (tracker row Q-M19), so today neither script loads even after an acceptance. The exact cookie names above must be confirmed against a real loaded session before this policy is published.`,
    ]],
    ['3.1', 'Changing your mind', 'PECR reg. 6(3); UK GDPR Art. 7(3)', [
      'There is a link in the footer of every page that reopens the consent choice. Withdrawing consent must be as easy as giving it, and reopening the same banner from the same place on every page is how that is met here.',
      'You can also delete cookies in your browser. Deleting gs_consent removes your recorded choice, and you will be asked again on your next visit.',
    ]],
    ['3.2', 'Refusing is a real option', 'PECR reg. 6(2); UK GDPR Recital 42', [
      'Accept and Reject are presented with the same prominence, the same size and the same visual treatment. Nothing on this site is withheld from a visitor who rejects.',
    ]],
    ['4.1', 'Enforcement', 'Data Protection Act 2018 Sch. 1 Pt. 6; PECR reg. 31 and Sch. 1', [
      'Breaches of PECR are enforced by the Information Commissioner. This site treats the requirement as non-negotiable and enforces it in the build rather than in a policy document, which is the only form of the rule that survives a redesign.',
    ]],
  ],
);

const terms = doc(
  'terms',
  'Terms of Use',
  'The terms on which you may use this website. These are not the terms on which we do work for clients — those are the Client Terms. This draft has not been reviewed by a solicitor.',
  [
    ['1.1', 'Who these terms are between', 'Electronic Commerce (EC Directive) Regulations 2002 reg. 6', [
      'This website is operated by Gridsmith Ltd, company number 17050842, registered in England & Wales, registered office 30 Briarfield Road, Farnworth, Bolton, BL4 0HD. Contact: contact@gridsmith.uk.',
      `${D} Gridsmith Ltd's VAT registration is in progress. The number shown in the site footer is a marked placeholder and is not a VAT registration number. It must be replaced with the number HMRC issues, or the line removed, before this site is published.`,
    ]],
    ['2.1', 'What is on this site', 'Consumer Protection from Unfair Trading Regulations 2008 reg. 5', [
      'The information here is provided in good faith and for general information. Descriptions of services, indicative prices and timescales are not offers capable of acceptance; work is done under a written scope agreed with you.',
      'Any price shown with an INDICATIVE badge is exactly that. It is a starting point for a conversation and is not a quotation.',
    ]],
    ['2.2', 'Placeholder content during build', 'Consumer Protection from Unfair Trading Regulations 2008 reg. 5', [
      'While this site is in development it carries content marked [SEED]. That content is structurally realistic and factually invented, and it is marked so that no reader can mistake it for a claim. It cannot reach the published site: the build refuses to deploy a production dataset containing it.',
    ]],
    ['3.1', 'Intellectual property in the site', 'Copyright, Designs and Patents Act 1988 s. 1 and s. 16', [
      'The design, text, images, code and structure of this site belong to Gridsmith Ltd or to its licensors. You may read it, print it and link to it. You may not copy it for commercial use without permission.',
      'Client work shown on this site remains the property of whoever owns it under the relevant engagement; it is shown here with permission or in a form agreed with the client.',
    ]],
    ['4.1', 'Acceptable use', 'Computer Misuse Act 1990 s. 1–3', [
      'Do not attempt to gain unauthorised access to this site or its supporting systems, interfere with its operation, or use it to transmit anything unlawful.',
      'Do not use the enquiry form to send unsolicited marketing.',
    ]],
    ['5.1', 'Availability', 'Unfair Contract Terms Act 1977 s. 2 and s. 3', [
      'We do not promise the site will be available uninterrupted. We do not exclude liability for death or personal injury caused by negligence, or for fraud — those exclusions are not permitted.',
      `${D} Subject to the paragraph above, our liability for any loss arising from your use of this website is excluded to the extent the law allows. This is a website-use exclusion only; the Client Terms deal separately, and differently, with liability for work.`,
    ]],
    ['6.1', 'Links to other sites', 'Electronic Commerce (EC Directive) Regulations 2002 reg. 17', [
      'Where this site links elsewhere, we do not control that site and are not responsible for its content. That includes the Freelancer.com profile linked from our testimonials, which is linked so you can verify the reviews rather than take our word for them.',
    ]],
    ['7.1', 'Governing law', 'Rome I Regulation as retained; Civil Jurisdiction and Judgments Act 1982', [
      `${D} These terms are governed by the law of England and Wales, and the courts of England and Wales have exclusive jurisdiction. If you are a consumer resident elsewhere in the UK, this does not deprive you of the protection of your local mandatory rules.`,
    ]],
  ],
);

const clientTerms = doc(
  'client-terms',
  'Client Terms',
  'The standard terms on which Gridsmith Ltd carries out work. Every clause here is a commercial decision as well as a legal one, and every one marked [DECISION] is the owner\'s to make. This draft has not been reviewed by a solicitor.',
  [
    ['1.1', 'One company, one contract', 'Companies Act 2006 s. 51; Companies (Trading Disclosures) Regulations 2015 reg. 24', [
      'You contract with Gridsmith Ltd. Gridsmith Design, Gridsmith Digital and Gridsmith Press are trading divisions of that one company and have no separate legal personality.',
      'Work spanning two or three divisions is one engagement, one scope document and one invoice. Nothing in this agreement requires you to contract separately with a division.',
    ]],
    ['2.1', 'How an engagement starts', 'Consumer Rights Act 2015 s. 50; common law offer and acceptance', [
      'We agree a written scope before work starts. The scope names the deliverables, the price or pricing model, the timeline and what we need from you. It is the six-stage process described on this site, and stage 3 — Approval & Start — is the point at which the contract is formed.',
      'Anything said in a conversation or an email that is not in the scope is not part of it. Changes to the scope are agreed in writing and may change the price and the date.',
    ]],
    ['2.2', 'What we need from you', 'Consumer Rights Act 2015 s. 51; Supply of Goods and Services Act 1982 s. 14', [
      'Timelines assume you provide materials, approvals and answers at the agreed points. Where you do not, the timeline moves; we will tell you by how much rather than absorbing it silently.',
      `${D} Where a project is paused at your end for more than 60 days, we may close it and invoice for work completed to that point. Re-opening it is a new scope.`,
    ]],
    ['3.1', 'Price, payment and VAT', 'Late Payment of Commercial Debts (Interest) Act 1998 s. 1 and s. 5A; Value Added Tax Act 1994 s. 1', [
      `${D} Payment terms: an agreed initial payment before work begins, the balance on delivery. Invoices are payable within 14 days.`,
      `${D} Late payment: statutory interest and the fixed sum for recovery costs under the Late Payment of Commercial Debts (Interest) Act 1998 apply to business clients. We would rather chase than charge.`,
      `${D} VAT: Gridsmith Ltd's VAT registration is in progress. Until it completes, prices carry no VAT. Once registered, prices quoted to business clients are exclusive of VAT and prices quoted to consumers are inclusive, and every quotation states which. This clause must be revisited on the day the registration number is issued.`,
    ]],
    ['4.1', 'Who owns the work', 'Copyright, Designs and Patents Act 1988 s. 11 and s. 90', [
      `${D} Copyright in the deliverables passes to you on payment of the final invoice, by written assignment under section 90(3). Until then we own it and you have a licence to review it. This is the default because it is the point at which the exchange is complete; the alternative — assignment on delivery — is available but must be priced differently.`,
      'We keep ownership of our own pre-existing tools, components, templates and know-how, and grant you a perpetual licence to use them as part of the deliverable. This is not a way of holding your work hostage: it means we do not have to reinvent a grid system for every client.',
      'Working files: source files are handed over where the scope says so. Where it does not, ask before the engagement ends rather than after.',
    ]],
    ['4.2', 'Publishing work', 'Copyright, Designs and Patents Act 1988 s. 77 and s. 85', [
      'We would like to show the work. Where you would rather we did not, say so and we will not — a confidential engagement is recorded as confidential and appears, if at all, without your name.',
    ]],
    ['5.1', 'Press: you keep your rights and your ISBN', 'Copyright, Designs and Patents Act 1988 s. 90 and s. 94', [
      'For publishing and writing work, you retain copyright in your book. We do not acquire a share of it, we do not take a royalty interest, and we do not become your publisher of record.',
      'Where an ISBN is needed, we help you obtain your own. An ISBN registered to us would make us the publisher on every retail listing for the life of the title, and that is not what you are buying.',
      'Ghostwriting: the finished manuscript is yours. Moral rights under section 77 are waived by us in your favour to the extent needed for you to be named as author, and that waiver is recorded in the engagement scope rather than assumed.',
    ]],
    ['6.1', 'Warranties and what we do not promise', 'Supply of Goods and Services Act 1982 s. 13; Consumer Rights Act 2015 s. 49', [
      'We will carry out the work with reasonable care and skill. That is a statutory term and we are not trying to exclude it.',
      'We do not warrant that a design will achieve a commercial result, that a website will rank, that a book will sell, or that a model output will be correct in every case. Where a deliverable has a measurable acceptance criterion, it is written into the scope.',
      `${D} Engineering drawings and CAD deliverables are prepared to the standard and tolerances stated in the scope. They are not a substitute for a competent person's design check, structural calculation or statutory approval, and we do not hold ourselves out as providing one. This clause interacts with the professional indemnity position at 8.1 and both should be reviewed together.`,
    ]],
    ['7.1', 'Liability', 'Unfair Contract Terms Act 1977 s. 2, s. 3 and s. 11; Consumer Rights Act 2015 s. 57 and s. 62', [
      'Nothing here excludes liability for death or personal injury caused by negligence, for fraud or fraudulent misrepresentation, or for anything else that cannot lawfully be excluded.',
      `${D} Subject to that, our total liability for any engagement is capped at the total fees paid by you for that engagement in the 12 months before the claim. This is the common default; it is not necessarily the right one where a deliverable carries downstream cost, and the review should test it against the engineering drawing work in particular.`,
      `${D} Neither party is liable for loss of profit, loss of business, loss of goodwill or indirect loss. Under section 11 of the Unfair Contract Terms Act 1977 this must be reasonable in the circumstances; it is stated here as a default and its reasonableness is a matter for review, not for a draft.`,
    ]],
    ['8.1', 'Insurance', 'Not a statutory requirement — a commercial commitment', [
      `${D} Professional indemnity cover is required and the scope of it is an open item (tracker row L-08). The cover must extend to engineering drawings and CAD work specifically; a general "media and technology" policy commonly excludes them, and that exclusion would sit directly across the highest-risk deliverable this company produces.`,
    ]],
    ['9.1', 'Confidentiality', 'Common law duty of confidence; UK GDPR Art. 28 where personal data is involved', [
      'Each party keeps the other\'s confidential information confidential, and uses it only for the engagement. Where we process personal data on your behalf as part of the work, a separate data processing agreement applies and Article 28(3) sets out what it must contain.',
    ]],
    ['10.1', 'Ending the engagement', 'Common law; Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 reg. 29–30', [
      `${D} Either party may end an engagement on 14 days' written notice. You pay for work completed and for anything we have committed to on your behalf. We hand over what has been paid for.`,
      'Consumers contracting at a distance have a statutory 14-day cancellation right. Where you ask us to start within that period, you agree we may, and you remain liable for the value of work done if you then cancel.',
    ]],
    ['11.1', 'Complaints and disputes', 'Alternative Dispute Resolution for Consumer Disputes Regulations 2015 reg. 19', [
      'Tell us. contact@gridsmith.uk, and we reply by the end of the next business day at the latest.',
      `${D} If we cannot resolve it, the parties will attempt mediation before issuing proceedings. Consumer clients must be told whether we use an ADR provider and, if so, which; that decision is outstanding.`,
    ]],
    ['12.1', 'Governing law', 'Rome I Regulation as retained', [
      `${D} The law of England and Wales governs this agreement, and the courts of England and Wales have exclusive jurisdiction.`,
    ]],
  ],
);

const accessibility = doc(
  'accessibility',
  'Accessibility Statement',
  'What this site commits to, what is known not to conform, and how to tell us when we have got it wrong. This draft has not been reviewed by a solicitor.',
  [
    ['1.1', 'Our commitment', 'Equality Act 2010 s. 20 and s. 29; WCAG 2.2 Level AA', [
      'This site is built to meet WCAG 2.2 Level AA. That is the floor, not the target: where accessibility conflicts with a visual or commercial preference on this project, accessibility wins and the conflict gets raised rather than quietly resolved the other way.',
      'The duty to make reasonable adjustments under section 20 of the Equality Act 2010 applies to a service provider\'s website. This statement is not a legal disclaimer; it is a description of what has actually been done.',
    ]],
    ['2.1', 'How conformance is checked', 'WCAG 2.2; EN 301 549 clause 9 (referenced as the recognised harmonised standard)', [
      'Automated checks run on every build and block a merge: colour contrast is asserted as a permission matrix across every foreground token against every surface in every theme; heading structure, landmark structure, focus order, target size and duplicate IDs are checked on every audited route at three viewport widths; and axe reports zero violations.',
      'Automated testing cannot establish conformance on its own. It catches what it can measure, and announcement, focus management in context and the sense a screen reader makes of a page are not among them.',
    ]],
    ['2.2', 'What is known not to conform', 'WCAG 2.2 Success Criterion 3.1.1 (Level A)', [
      'When the server fails to render a page — an uncaught error, not a normal 404 — the framework serves a minimal error document that does not carry a lang attribute. That fails Success Criterion 3.1.1 at Level A. It affects only server-side crashes, is characterised by an automated check on every build so it cannot get worse unnoticed, and no application-level fix exists; the remedy is a hosting-level one and is an open decision.',
      'A screen reader pass by a human using NVDA or VoiceOver has not yet been carried out over the site chrome and the consent banner. It is a scheduled item, not an oversight, and this statement will be updated when it happens rather than before.',
    ]],
    ['3.1', 'Tell us', 'Equality Act 2010 s. 20(3)', [
      'If something on this site does not work for you, email contact@gridsmith.uk and say what you were trying to do. We reply by the end of the next business day at the latest, and a report about accessibility is treated as a defect, not as feedback.',
    ]],
    ['4.1', 'Preparation of this statement', 'WCAG 2.2', [
      `${D} This statement was prepared on 21 August 2026 from the gates that were passing on that date. It is a self-assessment. Whether a third-party audit is commissioned before launch is an open decision; a self-assessed statement is honest but it is not independent, and this statement says which it is.`,
    ]],
  ],
);

export const LEGAL_DOCUMENTS = [privacy, cookies, terms, clientTerms, accessibility];
