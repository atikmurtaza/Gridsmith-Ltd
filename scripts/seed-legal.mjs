/**
 * The seven legal documents, drafted from **this build's actual facts** — the processors it
 * really uses, the cookie it really sets, the consent categories it really implements, and the
 * lead-form fields really defined in `lib/leads/schema.ts`.
 *
 * ## Two markers, two different meanings
 *
 * **`[SEED - SOLICITOR REVIEW REQUIRED]`** heads every document. `solicitorApproved` is
 * `false` on all seven, which is what `master/SCHEMA.md` says gates publication: the production
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
      'We collect no analytics data. There is no Google Analytics, no product analytics and no tracking script of any kind on this site, in any state — so nothing measures your visit and there is no analytics consent to give or withhold. This is described in full in the Cookie Policy.',
      'Our hosting provider processes server request logs, including IP addresses, as a necessary part of delivering the site and protecting it from abuse.',
    ]],
    ['3.1', 'Why we process it, and on what basis', 'UK GDPR Art. 6(1)(b) and Art. 6(1)(f); PECR reg. 6(2)', [
      'Responding to your enquiry and preparing a quotation: Article 6(1)(b), steps taken at your request prior to entering into a contract.',
      'Keeping a record of enquiries, and protecting the site from abuse: Article 6(1)(f), our legitimate interest in running the business and keeping the service available. We have considered your interests and rights and consider this proportionate because the data is limited to what you chose to send us.',
      'Non-essential storage: none is used, so no consent is sought and none is relied on. The one cookie this site sets is strictly necessary and exempt under PECR Schedule A1 paragraph 4 — see the Cookie Policy.',
    ]],
    ['3.2', 'We do not sell or share your data for advertising', 'UK GDPR Art. 13(1)(e)', [
      'We do not sell personal data. We do not share it with advertising networks. There is no advertising storage on this site and no consent category for it: the ad_storage signal was removed along with the analytics scripts on 26 August 2026, because a control that changes nothing misrepresents what you control.',
    ]],
    ['4.1', 'Processors we use', 'UK GDPR Art. 28 and Art. 13(1)(e)', [
      'Sanity (content management) — stores the website content, and stores no enquiry data.',
      'Supabase (database) — stores enquiries submitted through the form.',
      'Resend (transactional email) — delivers the notification email that tells us an enquiry has arrived.',
      `Hosting — Vercel Inc. The site is built and served by Vercel. Static content is delivered from Vercel's global edge network, which serves each visitor from the nearest location; serverless functions for this project run in Vercel's ${VERCEL_FUNCTION_REGION} region. ${D} The Art. 46 transfer mechanism relied on for Vercel must be confirmed by the solicitor review at L-01 and named here before publication — see 4.2.`,
      'Each is engaged under that provider\'s standard data processing terms. Article 28(3) requires a written contract; the review at L-04 should confirm each provider\'s terms have been accepted in Gridsmith\'s name and are on file.',
    ]],
    ['4.2', 'International transfers', 'UK GDPR Art. 44–46', [
      `${D} Some of the providers above operate outside the UK. Vercel serves this site from a global edge network and runs this project's serverless functions in the United States, so a transfer mechanism is required for it. For Vercel and for the remainder, the mechanism is the provider's standard contractual clauses or the UK Addendum, and the specific mechanism relied on for each provider must be confirmed and stated here before publication.`,
    ]],
    ['5.1', 'How long we keep it', 'UK GDPR Art. 5(1)(e) and Art. 13(2)(a)', [
      `${D} Enquiries that do not become work: kept for 24 months from the last contact, then deleted. Rationale: enquiries commonly return within a project cycle, and 24 months is short enough to be defensible and long enough to be useful.`,
      `${D} Enquiries that become work: kept for 6 years after the end of the engagement, to align with the limitation period for a simple contract under section 5 of the Limitation Act 1980 and with the record-keeping period in section 388 of the Companies Act 2006.`,
      'Analytics data: none. There is no analytics on this site, so there is nothing to retain and no retention period to state.',
      'The cookie recording that you have seen the cookie notice is stored in your browser for 12 months, after which the notice appears once more.',
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
      'On this site that rule is implemented rather than described: no cookie is set until you dismiss the cookie notice, and no request is made to any analytics provider in any state, before or after. Both are asserted in a real browser on every audited route by an automated check that fails the build if a cookie or a third-party request appears.',
    ]],
    ['1.2', 'The strictly necessary cookie', 'PECR reg. 6(4)', [
      'gs_consent — records that you have seen the cookie notice. Set only once you dismiss it. First-party, Path=/, SameSite=Lax, Secure over HTTPS, expires after 12 months. It holds the single character 1. It contains no identifier and nothing about you.',
      'This cookie is exempt from the consent requirement under Schedule A1 paragraph 4 because it is strictly necessary for a service you asked for: it is the thing that stops the notice appearing on every page.',
      'If you visited before 26 August 2026 your browser may still hold a gs_consent listing the consent categories that existed then. Nothing reads that value any more — only whether the cookie is present — and we do not overwrite it. It expires on its own.',
    ]],
    ['2.1', 'There are no consent categories', 'PECR reg. 6(2); UK GDPR Art. 4(11)', [
      'This site has no consent categories, because it has no non-essential storage to consent to. Until 26 August 2026 the banner offered three — analytics_storage, ad_storage and functionality_storage. Two of them gated nothing at all, and the third gated two analytics libraries that were loaded on acceptance and never started, so they recorded nothing while still disclosing your IP address and browser to their hosts. All three, and both libraries, were removed.',
      'A control that changes nothing is a statement to you about what you control. That is why they were removed rather than explained.',
    ]],
    ['2.2', 'What runs after you dismiss the notice', 'PECR reg. 6(2)', [
      'Nothing. Dismissing the notice sets gs_consent and makes no request to anybody. There is no analytics cookie on this site — no _ga, no _ga_ family, no PostHog cookie — and no localStorage or sessionStorage entry, in any state.',
      'This is asserted in a real browser on every build: after the notice is dismissed, the complete cookie list must be exactly gs_consent, storage must be empty, and no analytics host may be contacted.',
    ]],
    ['3.1', 'Changing your mind', 'PECR reg. 6(3); UK GDPR Art. 7(3)', [
      'There is nothing to change your mind about: no consent is sought and nothing non-essential is stored. A link in the footer of every page reopens the cookie notice if you want to read it again. It stores nothing and switches nothing on or off.',
      'You can also delete cookies in your browser. Deleting gs_consent means the notice appears once more on your next visit; nothing else depends on it.',
    ]],
    ['3.2', 'There is nothing to refuse', 'PECR reg. 6(2); UK GDPR Recital 42', [
      'Nothing on this site is withheld from you for declining anything, because you are not asked for anything. If non-essential storage is ever introduced, an Accept and a Reject will be presented with the same prominence, the same size and the same visual treatment, and that requirement is written into the build task that would introduce it.',
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

/**
 * ## The client terms are three documents, not one — owner's decision, 26 August 2026
 *
 * `client-terms` used to be a single slug carrying both `docs/_legal/MSA-BUSINESS.md` and
 * `docs/_legal/CONSUMER-TERMS.md`, and the seeded document mixed both regimes: clause 1.1 on
 * the Companies Act, clause 2.1 on Consumer Rights Act 2015 s. 50. **A liability cap drafted
 * for a business client is void against a consumer to the extent of CRA 2015 s. 57**, and a
 * Press author reading that page could not tell which half applied to them. The decision and
 * the reasoning are in `lib/legal/slugs.ts`.
 *
 * Each instrument now states, in its summary and therefore in the first prose on the page, who
 * it governs and who it does not. `client-terms` survives as a disambiguation page carrying no
 * operative clause — the old path must not 404, and it must not silently deliver either
 * instrument to the wrong reader.
 *
 * **The clause bodies below are unchanged.** `CLAUDE.md` forbids drafting or amending clauses.
 * This document still carries consumer-facing material at 2.1, 6.1, 10.1 and 11.1 that the
 * split makes redundant here; removing it is a drafting decision for the solicitor and is
 * recorded in `docs/_legal/03-REVISION-LOG.md` rather than taken in a seed script.
 */
const businessClientTerms = doc(
  'business-client-terms',
  'Client Terms — Business Clients',
  'These terms govern work done for BUSINESS clients — companies, partnerships, sole traders and anyone else buying for the purposes of their trade, business, craft or profession. They do NOT govern consumers. If you are an individual buying for yourself, including most individual authors and memoir clients of Gridsmith Press, these are not your terms: the Client Terms for Consumers are, and several clauses here would not bind you under the Consumer Rights Act 2015. Every clause marked [DECISION] is the owner\'s to make. This draft has not been reviewed by a solicitor.',
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

/**
 * The consumer instrument, seeded from `docs/_legal/CONSUMER-TERMS.md`.
 *
 * Clause numbers follow that draft's own section numbering so a link into a clause survives
 * the draft being adopted. `/press` links to `clause-10-1`, which is where the rights
 * statement on that page comes from — `CLAUDE.md` non-negotiable #6.
 */
const consumerClientTerms = doc(
  'consumer-client-terms',
  'Client Terms — Consumers',
  'These terms govern work done for CONSUMERS — individuals buying for purposes outside their trade, business, craft or profession. In practice that is most individual authors and almost all memoir and legacy clients of Gridsmith Press. They do NOT govern business clients: a company, partnership or sole trader buying for its business is covered by the Client Terms for Business Clients instead. This draft has not been reviewed by a solicitor.',
  [
    ['1.1', 'Who we are', 'Companies (Trading Disclosures) Regulations 2015 reg. 24 and reg. 25; Electronic Commerce (EC Directive) Regulations 2002 reg. 6; Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 Sch. 2', [
      'Gridsmith Ltd, company number 17050842, registered in England & Wales, registered office 30 Briarfield Road, Farnworth, Bolton, BL4 0HD, trading as Gridsmith Press. Contact: contact@gridsmith.uk.',
    ]],
    ['2.1', 'Your statutory rights', 'Consumer Rights Act 2015 s. 49, s. 51, s. 52 and s. 57', [
      'Nothing in these terms affects your rights under the Consumer Rights Act 2015, the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, or any other consumer protection law.',
      'Under the Consumer Rights Act 2015 we must provide our services with reasonable care and skill, within a reasonable time, and at a reasonable price where none has been agreed. We cannot and do not exclude that.',
      'If we do not, you are entitled to ask us to perform the service again, or to a price reduction, depending on the circumstances.',
    ]],
    ['5.1', 'Your right to cancel', 'Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 reg. 29 and reg. 31', [
      'You have the right to cancel this contract within 14 days without giving any reason. The cancellation period ends 14 days after the day the contract is made.',
      'To cancel, tell us clearly — email us or write to us. You may use the model cancellation form at the end of these terms, but you do not have to.',
      'If you cancel, we will refund all payments received from you within 14 days of being told, using the same payment method, at no charge to you.',
      'If we failed to give you the cancellation information required by regulation 13 before you were bound, your cancellation period is extended — by up to 12 months.',
    ]],
    ['6.1', 'If you want us to start within the 14 days', 'Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 reg. 36 and reg. 37', [
      'If you ask us to begin during the cancellation period, you must ask us expressly, by ticking the specific box on the order confirmation. It is a separate box from accepting these terms, and we will not tick it for you.',
      'You still keep your right to cancel during the 14 days. But if you cancel after we have started, you must pay a proportionate amount for the work done up to the point you told us — calculated as the proportion of the total service performed, against the total price.',
      'Once the service has been fully performed within the 14 days, you lose the right to cancel entirely. We will tell you when we consider the service fully performed.',
      'If you do not ask us to start early, we will begin after the 14 days have passed. We will confirm all of this in your order confirmation email, in writing, before any work starts.',
    ]],
    ['7.1', 'Price and payment', 'Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 reg. 13; Digital Markets, Competition and Consumers Act 2024 s. 230', [
      'The total price is stated in your order confirmation and includes VAT where applicable.',
      'No charge will be added that was not disclosed before you ordered. If the work you want changes, we will tell you the new price in writing and you decide whether to proceed.',
      'Payment is as set out in the order confirmation — usually an initial payment and a balance on delivery.',
    ]],
    ['10.1', 'Your rights in your book', 'Consumer Rights Act 2015 s. 50 — anything said on the Press pages becomes a term, so that page and this clause must not drift apart', [
      'You keep 100% of the copyright in your work. We never own any part of it.',
      'You keep 100% of all royalties and sales income. We take no royalty, no commission, and no share of your sales. We are paid only the fees in your order confirmation.',
      'The cover and interior design we produce become yours once you have paid in full. We use your manuscript only to produce your book, and that permission ends when we deliver.',
      'Where we set up distribution, the accounts are in your name and under your control, so your royalties are paid to you directly. We never hold an account on your behalf and we never receive your sales income.',
      'You are the publisher. Your ISBN is registered to you, not to us. We do not run an imprint and we do not put our name on your book as publisher. Where it is part of your order, we will help you obtain your own ISBN and complete the registration — but it is yours, permanently, and it stays yours whatever happens between us.',
    ]],
    ['11.1', 'What we do not promise', 'Consumer Rights Act 2015 s. 50; Digital Markets, Competition and Consumers Act 2024 Sch. 20 para. 13', [
      'We will produce your book to a professional standard. We do not and cannot promise how it will sell.',
      'This applies equally if you buy book marketing from us. Marketing is a separate service with its own price, and buying it does not come with any promise of sales, reviews, rankings or coverage.',
      'We make no promise about sales figures, income, reviews, rankings, bestseller status, media coverage or any other commercial outcome. Most independently published books sell modestly. Anyone who tells you otherwise is not being straight with you.',
    ]],
    ['13.1', 'Our responsibility to you', 'Consumer Rights Act 2015 s. 57 and s. 62; Unfair Contract Terms Act 1977 s. 2', [
      'If we fail to comply with these terms, we are responsible for loss or damage you suffer that is a foreseeable result of our breaking the contract or failing to use reasonable care and skill.',
      'We do not limit our liability in any way that the law does not allow. That includes death or personal injury caused by our negligence, fraud, and breach of your statutory rights.',
      'There is no cap on our liability to you in these terms. The cap in the Client Terms for Business Clients is a business term and does not apply to you — section 57 of the Consumer Rights Act 2015 would make it not binding on you in any event.',
      'We are not responsible for losses that were not foreseeable when the contract was made.',
    ]],
  ],
);

/**
 * `/legal/client-terms` — the disambiguation page, and the reason there is no redirect.
 *
 * The old path was published and is cited. It must not 404, and it must not be redirected: a
 * redirect has to choose a target, and either choice silently delivers one audience the other
 * audience's instrument — the same defect with an extra hop in front of it. So the path
 * survives carrying no operative clause. It says which document governs whom, and the "other
 * documents" list at the foot of the page links to both.
 */
const clientTermsDisambiguation = doc(
  'client-terms',
  'Client Terms — which ones apply to you',
  'There are two sets of client terms and this page is not either of them. It exists so that nobody reads the wrong one. Which applies to you depends on whether you are buying as a business or as an individual, and the difference is not cosmetic: consumer law gives you rights that cannot be excluded, and the business terms are drafted on the basis that you do not have them.',
  [
    ['1.1', 'If you are buying for a business', 'Unfair Contract Terms Act 1977 s. 3 and s. 11', [
      'If you are a company, a partnership, a sole trader or anyone else buying for the purposes of a trade, business, craft or profession, the Client Terms for Business Clients apply. They are at /legal/business-client-terms and are linked at the foot of this page.',
      'That is most Gridsmith Design and Gridsmith Digital work.',
    ]],
    ['1.2', 'If you are buying as an individual', 'Consumer Rights Act 2015 s. 2 and s. 57', [
      'If you are an individual buying for purposes outside your trade, business, craft or profession, you are a consumer and the Client Terms for Consumers apply. They are at /legal/consumer-client-terms and are linked at the foot of this page.',
      'That is most individual authors and almost all memoir and legacy clients of Gridsmith Press.',
      'The two documents are deliberately not interchangeable. Section 57 of the Consumer Rights Act 2015 makes a term not binding on a consumer to the extent it would exclude or restrict liability under sections 49 or 50, so the liability cap in the business terms would not bind you even if you had signed them.',
    ]],
    ['1.3', 'If you are not sure', 'Not a statutory requirement — a commercial commitment', [
      'Ask us before you order and we will tell you which one you are on and why. We will also say so in the scope or order confirmation, so that it is written down rather than assumed.',
    ]],
  ],
);

export const LEGAL_DOCUMENTS = [
  privacy,
  cookies,
  terms,
  clientTermsDisambiguation,
  businessClientTerms,
  consumerClientTerms,
  accessibility,
];
