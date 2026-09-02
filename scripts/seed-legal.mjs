/**
 * The seven legal documents, **transcribed from `docs/_legal/`** — one draft per slug.
 *
 * ## This file is a transcription, not a draft
 *
 * Until 29 August 2026 it was a second, shorter, independently-written document set. Nobody
 * was comparing the two, and they diverged: `07-STATE-REPORT.md` F-1 to F-7 record seven live
 * divergences, of which the worst were the served consumer terms sitting at a superseded
 * instrument and the served privacy policy asserting as fact four things the draft marks `[TK]`
 * precisely because they could not be established.
 *
 * So the rule for this file is one rule:
 *
 * > **Every seeded paragraph is a transcription of operative prose in the matching
 * > `docs/_legal/*.md` draft**, with markdown emphasis (`**`, backticks) removed, bullets
 * > flattened one bullet to one paragraph, and nothing else changed — no word added, none
 * > reordered. `scripts/legal-parity-rules.mjs` explains why the word sequence is the unit.
 *
 * What is deliberately NOT transcribed is a draft's editorial apparatus: the identity header,
 * revision notes and anything addressed to the reviewer rather than to the reader. None of
 * those is a term.
 *
 * `scripts/check-legal-parity.mjs` enforces the rule against the **served pages**, not against
 * this file. See its docstring for why that direction was chosen.
 *
 * ## The 2 September 2026 set — version 2.0, and why every document was replaced at once
 *
 * The previous drafts carried nine rounds of internal review and a large apparatus of `[TK]`
 * and `[DECISION REQUIRED]` markers standing inside operative prose. They were replaced
 * wholesale by the revised set the owner adopted on 2 September 2026, with two owner
 * clarifications applied to the revised text before transcription:
 *
 * **VAT.** Gridsmith Ltd is not registered. The conditional clauses are kept rather than
 * deleted — they remain true after registration — and each now states plainly that no VAT is
 * charged today and what changes if that alters. **No price anywhere in the UI may be
 * presented as VAT-exclusive**; that half of the rule is enforced in
 * `sanity/schemas/objects.ts`, not here, because it is a property of the price component
 * rather than of a clause.
 *
 * **The registered office.** SI 2015/17 reg. 25(2) is a *website* obligation and is satisfied
 * by the statutory block in `components/chrome/Footer.tsx`, which renders on every page. So the
 * address appears **once per instrument**, in the party-identification block where a contract
 * needs it — consumer terms clause 18, privacy policy clause 15, MSA clause 19 — and in no
 * document header. The other three instruments say "Bolton, United Kingdom" and rely on the
 * footer. Minimising the repetition was the point; removing the disclosure was not.
 *
 * ## `solicitorApproved` is still false on all seven
 *
 * A revised draft set is not a reviewed one. `master/SCHEMA.md` makes `solicitorApproved` what
 * gates publication, `L-04` is the hard gate, and `check-legal-parity.mjs` branch D fails if a
 * served page ever stops carrying the unapproved-draft banner.
 */

const S = '[SEED - SOLICITOR REVIEW REQUIRED]';

const blocks = (prefix, paragraphs) =>
  paragraphs.map((text, i) => ({
    _type: 'block',
    _key: `${prefix}-b${i}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${prefix}-s${i}`, text, marks: [] }],
  }));

const REVIEWED_BY = 'Internal — revised set adopted 2 September 2026. Not reviewed by a solicitor.';

/** Every document in this set carries the same version and effective date. */
const META = { version: '2.0', revised: '2026-09-02' };

/**
 * @param {string} slug
 * @param {string} title
 * @param {string} summary
 * @param {Array<[string, string, string, string[], string?]>} clauses
 *   `[number, heading, basis, paragraphs, anchorOverride?]`. The override exists for one
 *   reason: an anchor that is already cited must not move. `anchorId` is contract-facing —
 *   `master/SCHEMA.md` makes renumbering a version bump plus a redirect, never an edit — and
 *   `/press` links into `#clause-10-1` on the consumer terms, asserted by
 *   `scripts/check-consumer-terms.mjs`. No override is in use today: the consumer terms number
 *   their Press sub-clauses 10.1 to 10.3, so the derived anchor is already `clause-10-1`.
 */
const doc = (slug, title, summary, clauses) => ({
  _id: `seed-legal-${slug}`,
  _type: 'legalDocument',
  slug: { _type: 'slug', current: slug },
  title,
  version: META.version,
  effectiveFrom: META.revised,
  lastReviewed: META.revised,
  reviewedBy: REVIEWED_BY,
  solicitorApproved: false,
  summary: `${S} ${summary}`,
  clauses: clauses.map(([number, heading, basis, paragraphs, anchorOverride], i) => ({
    _type: 'legalClause',
    _key: `${slug}-c${i}`,
    number,
    heading,
    // Contracts cite these. Renumbering is a version bump plus a redirect, never an edit.
    anchorId: anchorOverride ?? `clause-${number.replace(/\./g, '-')}`,
    basis,
    body: blocks(`${slug}${i}`, paragraphs),
  })),
  isSeed: true,
});

// ---------------------------------------------------------------------------
// docs/_legal/PRIVACY-POLICY.md
// ---------------------------------------------------------------------------

const privacy = doc(
  'privacy',
  'Privacy Policy',
  'What Gridsmith Ltd does with personal data collected through this website, who processes it, how long it is kept and how to exercise your rights. Drafted against UK GDPR and the Data Protection Act 2018. This draft has not been reviewed by a solicitor.',
  [
    ['1', 'What this policy covers', 'UK GDPR Art. 13', [
      'Gridsmith Ltd is the controller of personal data described in this policy.',
      'This policy explains how we handle personal data when you:',
      'visit gridsmith.uk;',
      'contact us;',
      'ask for a quotation;',
      'become a client;',
      'communicate with us about a project; or',
      'raise a complaint.',
    ]],
    ['2', 'Information we collect', 'UK GDPR Art. 13(1)', [
      'Depending on your interaction with us, we may collect:',
      'your name;',
      'email address;',
      'telephone number where provided;',
      'company or organisation;',
      'the Gridsmith division or service you are interested in;',
      'your enquiry, project requirements, budget and timeline;',
      'correspondence and project communications;',
      'quotation, contract, invoice and payment records;',
      'project materials you choose to provide after contact;',
      'dates and records associated with enquiries and client work; and',
      'technical request information that our hosting provider processes in operating the website.',
      'We do not intentionally ask for special-category personal data through our general contact form.',
    ]],
    ['3', 'Why we use personal data', 'UK GDPR Art. 13(1)(c)', [
      'We use personal data to:',
      'respond to enquiries;',
      'prepare quotations, scopes and proposals;',
      'enter into and perform contracts;',
      'communicate about projects;',
      'provide support;',
      'issue and keep financial records;',
      'manage complaints;',
      'protect our systems and legal rights; and',
      'comply with legal obligations.',
    ]],
    ['4', 'Lawful bases', 'UK GDPR Art. 6', [
      'Depending on the purpose, we rely on one or more of:',
      'contract / steps before contract where you ask us to quote or provide services;',
      'legal obligation for accounting, tax and other legal records;',
      'legitimate interests in operating, securing and administering our business, responding to genuine enquiries and establishing or defending legal claims; and',
      'consent where consent is specifically required, such as certain direct marketing.',
      'Where you choose not to provide information that is necessary for a quotation or service, we may be unable to respond fully or perform the requested work.',
    ]],
    ['5', 'Website analytics', 'PECR reg. 6; UK GDPR Art. 6', [
      'We do not currently use Google Analytics, PostHog, advertising pixels, heatmaps or session-recording tools on gridsmith.uk.',
      'If this changes, we will update this policy and the Cookie Policy before or when the relevant technology is introduced and will use consent or another lawful mechanism where required.',
    ]],
    ['6', 'Service providers and recipients', 'UK GDPR Art. 13(1)(e) and Art. 28', [
      'We use service providers to operate the website and respond to enquiries. These currently include, where engaged by the relevant process:',
      'Vercel for website hosting and server execution;',
      'Supabase for database services;',
      'Resend for transactional email notifications;',
      'Sanity for website content management; and',
      'professional advisers such as accountants where necessary.',
      'These providers process only the information needed for the relevant function and are subject to their own contractual and data-protection obligations.',
      'We may also disclose information where required by law, to protect legal rights, or in connection with a genuine sale or reorganisation of the business.',
      'We do not sell personal data to advertisers or data brokers.',
    ]],
    ['7', 'International processing', 'UK GDPR Chapter V', [
      'Some technology providers may process data outside the United Kingdom.',
      'Where UK data-protection law requires a safeguard for an international transfer, we rely on the mechanism made available by applicable law and the relevant provider arrangements, such as an approved transfer mechanism, contractual safeguards or another permitted transfer basis.',
      'We periodically review the providers we use rather than promising a processing region that may change without our control.',
    ]],
    ['8', 'Retention', 'UK GDPR Art. 5(1)(e) and Art. 13(2)(a)', [
      'We keep personal data only for as long as reasonably necessary for the purpose for which it was collected, taking account of:',
      'whether an enquiry became a client project;',
      'whether follow-up is reasonably expected;',
      'contractual and warranty requirements;',
      'accounting and tax obligations;',
      'limitation periods and potential legal claims; and',
      'the need to resolve complaints.',
      'We do not currently operate an automated deletion schedule for general enquiries. We therefore use the criteria above and will review records periodically as the business systems mature.',
      'Accounting, contract and transaction records may be retained for the period reasonably required by applicable tax, accounting and legal-claims requirements.',
    ]],
    ['9', 'Security', 'UK GDPR Art. 32', [
      'We use reasonable technical and organisational measures appropriate to the size and nature of our business.',
      'No internet service can guarantee absolute security. If we become aware of a personal-data breach, we will assess and handle it in accordance with applicable law.',
    ]],
    ['10', 'Your rights', 'UK GDPR Arts. 15 to 21', [
      'Subject to applicable law, you may have rights to:',
      'obtain information about our use of your personal data;',
      'access personal data we hold about you;',
      'correct inaccurate data;',
      'request deletion;',
      'restrict processing;',
      'object to processing based on legitimate interests;',
      'receive certain data in a portable format; and',
      'withdraw consent where processing is based on consent.',
      'To exercise a right, email contact@gridsmith.uk. We may need information to verify your identity.',
      "You also have the right to complain to the UK Information Commissioner's Office.",
    ]],
    ['11', 'Marketing', 'PECR reg. 22', [
      'Submitting an enquiry does not automatically subscribe you to marketing.',
      'Where electronic marketing consent is required, we will obtain it or rely only on a lawful exception that applies to the particular communication.',
      'Every marketing email we send will identify the sender and provide a simple way to stop further marketing.',
    ]],
    ['12', 'Cookies and device storage', 'PECR reg. 6', [
      'Our current use of cookies and similar technologies is described in the Cookie Policy.',
    ]],
    ['13', 'Data-protection complaints', 'UK GDPR Art. 77; DPA 2018 s. 165', [
      'You may raise a complaint about our handling of personal data by emailing contact@gridsmith.uk with the subject “Data Protection Complaint”.',
      'We will:',
      'provide a clear route for the complaint;',
      'acknowledge receipt within 30 days;',
      'investigate the complaint appropriately; and',
      'communicate the outcome without undue delay.',
      "You may complain to the Information Commissioner's Office whether or not you first complain to us.",
    ]],
    ['14', 'Changes to this policy', 'UK GDPR Art. 12(1)', [
      'We may update this policy as our services, suppliers or legal obligations change. The version and effective date at the top show the policy currently in force.',
    ]],
    ['15', 'Contact', 'UK GDPR Art. 13(1)(a); Companies (Trading Disclosures) Regulations 2015 reg. 25(2)', [
      'Privacy enquiries and rights requests:',
      'Gridsmith Ltd',
      '30 Briarfield Road, Farnworth, Bolton, BL4 0HD',
      'contact@gridsmith.uk',
    ]],
  ],
);

// ---------------------------------------------------------------------------
// docs/_legal/COOKIE-POLICY.md
// ---------------------------------------------------------------------------

const cookies = doc(
  'cookies',
  'Cookie Policy',
  'What gridsmith.uk stores on your device, and why there is a notice rather than a consent banner. There is currently no analytics, advertising or session-recording technology on this site. This draft has not been reviewed by a solicitor.',
  [
    ['1', 'Our current position', 'PECR reg. 6', [
      'Gridsmith.uk does not currently use analytics, advertising, retargeting, heatmap or session-recording cookies or scripts.',
      'We currently use only limited first-party storage needed for the operation or presentation of the website.',
    ]],
    ['2', 'Cookie currently used', 'PECR reg. 6(2)', [
      'Cookie — Purpose — Duration — Provider.',
      'gs_consent — Records that the cookie notice has been seen or dismissed so it does not repeatedly interrupt the visit — Up to 365 days — Gridsmith Ltd.',
      'The cookie does not contain a marketing profile, analytics identifier or advertising identifier.',
    ]],
    ['3', 'Why we do not ask for analytics consent', 'PECR reg. 6(1) and reg. 6(4)', [
      'There is presently no analytics or advertising technology to accept or reject.',
      'The notice is therefore informational rather than an analytics-consent banner.',
    ]],
    ['4', 'Browser controls', 'PECR reg. 6(3)', [
      'You can remove or block cookies using your browser settings. If you remove the notice cookie, the website may show the cookie notice again.',
    ]],
    ['5', 'If we introduce analytics or other technologies', 'PECR reg. 6; UK GDPR Art. 6', [
      'If we introduce analytics, advertising or other non-essential storage/access technology, we will review the applicable UK Privacy and Electronic Communications rules and UK GDPR requirements before enabling it.',
      'Depending on the technology and purpose, we may need to obtain consent or provide a simple means of objection under an applicable statutory exception.',
      'We will update this policy to explain what is used, why it is used, who provides it and what controls are available.',
    ]],
    ['6', 'Changes', 'PECR reg. 6(2)', [
      "The website's actual behaviour should match this policy. We will update this policy when the technologies used by gridsmith.uk materially change.",
    ]],
    ['7', 'Contact', 'Electronic Commerce (EC Directive) Regulations 2002 reg. 6(1)(c)', [
      'Questions about cookies or privacy may be sent to contact@gridsmith.uk.',
    ]],
  ],
);

// ---------------------------------------------------------------------------
// docs/_legal/WEBSITE-TERMS.md
// ---------------------------------------------------------------------------

const terms = doc(
  'terms',
  'Website Terms of Use',
  'The terms on which gridsmith.uk may be used. They do not govern paid client work — that is the Business Client Terms or the Consumer Client Terms. This draft has not been reviewed by a solicitor.',
  [
    ['1', 'About these terms', 'Consumer Rights Act 2015 s. 62; common law', [
      'These terms govern the use of gridsmith.uk. They do not, by themselves, govern paid client projects. Paid work is governed by the applicable written quotation, scope, order confirmation and either our Business Client Terms or Consumer Client Terms.',
      'By using this website, you agree to use it lawfully and in accordance with these terms.',
    ]],
    ['2', 'About Gridsmith', 'Companies Act 2006 s. 82; Companies (Trading Disclosures) Regulations 2015 reg. 25(2)', [
      'Gridsmith Design, Gridsmith Digital and Gridsmith Press are trading divisions of Gridsmith Ltd and are not separate legal entities. Any contract entered into with one of those divisions is a contract with Gridsmith Ltd.',
    ]],
    ['3', 'Website content', 'Consumer Protection from Unfair Trading Regulations 2008; DMCCA 2024 Part 4 Chapter 1', [
      'We take reasonable care to keep information on this website accurate and current, but website content is provided for general information and may change.',
      'Portfolio work, sample work, indicative pricing, estimated timelines and examples do not constitute a binding quotation or guarantee. A binding project commitment is created only when we confirm a project in writing.',
      'Nothing on this website is professional engineering, legal, financial or other regulated advice to a website visitor. Engineering drawings or other technical materials displayed as portfolio examples must not be used for construction, manufacture, installation or other operational purposes.',
    ]],
    ['4', 'Intellectual property', 'Copyright, Designs and Patents Act 1988 ss. 1 to 4 and s. 29', [
      'Unless otherwise stated, website text, graphics, branding, layouts, code, illustrations and other content are owned by Gridsmith Ltd, its licensors or the relevant client.',
      'You may view and print reasonable extracts for your own private or internal business reference. You must not commercially reproduce, republish, sell, scrape at scale, or present website content as your own without permission, except where the law permits otherwise.',
      'Client portfolio material remains subject to the rights of the relevant client and is displayed only for portfolio or illustrative purposes.',
    ]],
    ['5', 'Prices and quotations', 'Electronic Commerce (EC Directive) Regulations 2002 reg. 6(2); DMCCA 2024 s. 230', [
      'Prices shown on this website are indicative unless expressly stated otherwise.',
      'Gridsmith Ltd is not currently registered for VAT and does not charge VAT. A price shown on this website is the amount charged. No price on this website is stated exclusive of VAT and no VAT is added to it at any later stage.',
      'For consumers, any final price we provide before an order is confirmed will include applicable taxes and mandatory charges.',
      'If Gridsmith Ltd becomes registered for VAT, this will change. VAT or other taxes would then be shown separately to business clients where applicable, consumer prices would continue to include them, and this document and the prices published on this website would be updated before any VAT was charged.',
    ]],
    ['6', 'Enquiries', 'Common law; UK GDPR Art. 9', [
      'Submitting an enquiry does not create a contract. We may decline an enquiry or request further information before providing a quotation or scope.',
      'Please do not send confidential, highly sensitive or special-category personal information through an open website form unless we have specifically asked you to do so.',
    ]],
    ['7', 'Third-party links', 'Common law', [
      'Links to third-party websites are provided for convenience. We do not control those websites and are not responsible for their content, availability, privacy practices or terms.',
      'Where we recommend or link to a third-party service as part of a paid project, any responsibility Gridsmith accepts for that recommendation will be set out in the project scope.',
    ]],
    ['8', 'Acceptable use', 'Computer Misuse Act 1990 ss. 1 to 3', [
      'You must not knowingly:',
      'interfere with the operation or security of the website;',
      'introduce malicious code;',
      'attempt unauthorised access to systems or data;',
      'submit unlawful, fraudulent or deliberately misleading information; or',
      'use automated systems in a way that materially disrupts the website.',
    ]],
    ['9', 'Website availability', 'Common law', [
      'We aim to keep the website available, but we do not guarantee uninterrupted or error-free access. We may update, suspend or withdraw parts of the website when reasonably necessary.',
    ]],
    ['10', 'Liability for website use', 'Unfair Contract Terms Act 1977 ss. 2 and 11; Consumer Rights Act 2015 s. 65', [
      'Nothing in these terms excludes or limits liability where the law does not permit us to do so, including liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation.',
      'For consumers, these terms do not affect statutory rights.',
      'For business users, Gridsmith is not responsible for indirect or consequential business loss arising solely from reliance on free, general website content where it would be reasonable to obtain project-specific advice or confirmation before acting.',
    ]],
    ['11', 'Privacy, cookies and accessibility', 'UK GDPR Art. 13; PECR reg. 6; Equality Act 2010 s. 20', [
      'Our handling of personal data is described in our Privacy Policy. Our use of cookies and similar storage is described in our Cookie Policy. Our current accessibility position is described in our Accessibility Statement.',
    ]],
    ['12', 'Changes', 'Common law', [
      'We may update these terms. The version and effective date shown at the top identify the terms currently published.',
    ]],
    ['13', 'Governing law', 'Rome I Regulation as retained; Consumer Rights Act 2015 s. 74', [
      'These terms are governed by the law of England and Wales.',
      'If you are a consumer resident in another part of the United Kingdom, nothing in this clause removes any right you have to bring proceedings in the courts available to you under applicable consumer law.',
    ]],
    ['14', 'Contact', 'Electronic Commerce (EC Directive) Regulations 2002 reg. 6(1)(c)', [
      'Questions about these terms may be sent to contact@gridsmith.uk.',
    ]],
  ],
);

// ---------------------------------------------------------------------------
// docs/_legal/MSA-BUSINESS.md
// ---------------------------------------------------------------------------

const businessClientTerms = doc(
  'business-client-terms',
  'Client Terms for Business Clients — Master Services Agreement',
  'The agreement that governs paid work for business clients across all three divisions. It applies only where the client is buying for the purposes of a trade, business, craft or profession; individuals buying outside a business are on the Consumer Client Terms instead. This draft has not been reviewed by a solicitor.',
  [
    ['1', 'Application', 'Unfair Contract Terms Act 1977 s. 3 and s. 12', [
      'This Master Services Agreement ("MSA") applies only where the client is acting for purposes relating to a trade, business, craft or profession.',
      'Each project consists of this MSA together with the relevant written quotation, statement of work, scope, proposal, order confirmation or change order (the Scope).',
      'If there is a conflict, a signed or expressly accepted Change Order prevails over the Scope, and the Scope prevails over this MSA.',
    ]],
    ['2', 'Scope', 'Supply of Goods and Services Act 1982 s. 13', [
      'No work is required beyond the agreed Scope.',
      'The Scope should identify, as appropriate:',
      'deliverables;',
      'assumptions and exclusions;',
      'timetable;',
      'client dependencies;',
      'number of revision rounds;',
      'price and payment schedule;',
      'third-party costs;',
      'acceptance requirements; and',
      'any project-specific risk or liability terms.',
    ]],
    ['3', 'Client responsibilities', 'Common law; Copyright, Designs and Patents Act 1988 s. 16', [
      'The client will provide reasonably required materials, information, access, approvals and feedback.',
      'The client warrants that it has the right to provide materials it asks Gridsmith to use.',
      'Delays caused by missing information, access or approvals may extend the timetable.',
    ]],
    ['4', 'Changes and additional work', 'Common law of variation', [
      'Reasonable changes falling within the revision allowance stated in the Scope are included.',
      'A material change includes a change in direction, deliverables, technical requirements, quantity, platform, approved concept or other requirement that materially increases the work.',
      'Gridsmith is not required to perform material out-of-scope work without agreement.',
      'Where a requested change is material, Gridsmith may issue a Change Order or additional quotation stating the effect on price and timetable. Work on that change begins after acceptance.',
    ]],
    ['5', 'Fees, invoices and taxes', 'Late Payment of Commercial Debts (Interest) Act 1998; Value Added Tax Act 1994 s. 3 and Sch. 1', [
      'Fees and payment stages are stated in the Scope.',
      'Unless the Scope says otherwise, invoices are payable within 14 days.',
      'Gridsmith Ltd is not currently registered for VAT and does not charge VAT. A fee stated in the Scope is the amount payable, not an amount to which VAT is later added.',
      'If Gridsmith Ltd becomes registered for VAT, VAT and other applicable taxes will be added only where legally applicable and will be identified on the Scope or invoice.',
      'Gridsmith may suspend work on an overdue undisputed invoice after giving reasonable written notice.',
      'For qualifying business-to-business debts, Gridsmith reserves its statutory rights under the Late Payment of Commercial Debts (Interest) Act 1998 and related legislation.',
    ]],
    ['6', 'Cancellation and termination by the client', 'Common law; Unfair Contract Terms Act 1977 s. 3(2)(b)', [
      'The client may ask Gridsmith to stop a project at any time by written notice.',
    ]],
    ['6.1', 'Before work starts', 'Common law of restitution', [
      "If the client cancels before Gridsmith has begun work, Gridsmith will refund project payments received, less any non-refundable third-party cost already incurred with the client's authority.",
    ]],
    ['6.2', 'After work starts', 'Common law; Unfair Contract Terms Act 1977 s. 3', [
      'If the client cancels after work has started:',
      'the client must pay for work reasonably performed up to the effective cancellation date;',
      'the client must reimburse reasonable third-party costs and commitments incurred for the project that cannot be recovered;',
      'Gridsmith will refund any remaining amount already paid for work not performed; and',
      'if work performed and unavoidable committed costs equal or exceed payments already received, no refund is due and any properly due balance remains payable.',
      'Where a substantial proportion of the Scope has already been completed, the refundable balance may therefore be zero.',
      'This is a payment for work performed and committed cost, not a cancellation penalty.',
    ]],
    ['7', 'Termination by Gridsmith', 'Common law; Insolvency Act 1986', [
      'Gridsmith may terminate or suspend a Scope on written notice where the client:',
      'materially breaches the agreement and does not remedy the breach within a reasonable period after notice;',
      'repeatedly fails to provide information, access, approvals or payments required to continue;',
      'asks Gridsmith to do something unlawful; or',
      'becomes insolvent.',
      'If Gridsmith ends a project for its own convenience rather than client breach, the client will receive the completed work for which it has paid and a refund of amounts paid for work not performed.',
    ]],
    ['8', 'Delivery, review and acceptance', 'Supply of Goods and Services Act 1982 s. 13', [
      'Gridsmith will deliver in accordance with the Scope.',
      'The client must review deliverables promptly and identify material non-conformity with the Scope within 10 working days where reasonably possible.',
      'Gridsmith will correct a properly notified failure to conform with the Scope at no additional charge.',
      'Use of a deliverable or failure to comment within 10 working days may be evidence of acceptance of apparent conformity, but does not remove liability for latent defects or liability that cannot lawfully be restricted.',
    ]],
    // Heading only, because the draft's `## 9.` is a heading only — its operative prose is all
    // in 9.1 to 9.4. `body` is optional on `legalClause`; inventing a lead-in here would put a
    // sentence on the page that the reviewed draft does not have, which branch B would fail
    // and should fail.
    ['9', 'Intellectual property', 'Copyright, Designs and Patents Act 1988 ss. 11, 90 and 91', []],
    ['9.1', 'Client materials', 'Copyright, Designs and Patents Act 1988 s. 11', [
      "Client materials remain the client's property.",
    ]],
    ['9.2', 'Background IP', 'Copyright, Designs and Patents Act 1988 s. 90; licensing at common law', [
      'Gridsmith retains ownership of pre-existing or independently developed tools, frameworks, templates, methods, know-how and reusable components.',
      'Where background IP is embedded in a final deliverable, Gridsmith grants the client a perpetual, non-exclusive, royalty-free licence to use it as part of that deliverable for the agreed purpose.',
    ]],
    ['9.3', 'Bespoke final deliverables', 'Copyright, Designs and Patents Act 1988 s. 90(3) and s. 91', [
      'On full payment, Gridsmith assigns to the client the rights Gridsmith owns in bespoke final deliverables created specifically for the Scope, except for background IP and third-party material.',
      'The parties will sign or provide reasonable further documents needed to give effect to an agreed transfer of rights.',
      'Third-party, open-source, font, stock, platform and software components remain subject to their own licence terms.',
    ]],
    ['9.4', 'Portfolio use', 'Common law; UK GDPR Art. 6(1)(f)', [
      'Unless the Scope says otherwise, Gridsmith may identify the client and display non-confidential final work in its portfolio after public release. The client may request reasonable restrictions where confidentiality or commercial sensitivity requires them.',
    ]],
    ['10', 'Confidentiality', 'Equitable duty of confidence; Trade Secrets (Enforcement, etc.) Regulations 2018', [
      "Each party will keep the other's confidential information confidential, use it only for the project, and protect it with reasonable care.",
      'This does not apply to information that is public other than through breach, lawfully known already, independently developed, or required to be disclosed by law.',
    ]],
    ['11', 'Data protection', 'UK GDPR Art. 28; Data Protection Act 2018', [
      'Each party will comply with applicable data protection law.',
      'Where Gridsmith processes personal data solely on behalf of the client as a processor, the parties will put in place any data-processing terms required by law.',
      'Gridsmith may use reputable hosting, database, communications and other service providers to operate its business and deliver the Scope, subject to applicable data-protection requirements.',
    ]],
    ['12', 'Engineering and technical design services', 'Supply of Goods and Services Act 1982 s. 13; Unfair Contract Terms Act 1977 s. 2', [
      'Where Gridsmith Design provides engineering, technical, CAD or construction-related drawings or design services:',
      'Gridsmith is responsible for performing the agreed service with reasonable care and skill.',
      'The Scope defines the design task Gridsmith has accepted and any expressly excluded task.',
      "The client must review the deliverables and verify that they meet the client's intended use, site conditions, dimensions, inputs and project requirements before final reliance.",
      'Site surveys, intrusive investigation, statutory approvals, building control, planning services, specialist calculations, certification, inspection, construction supervision and independent professional sign-off are included only where expressly stated in the Scope.',
      'Preliminary, draft, review, marked-up or superseded drawings must not be treated as final issue drawings.',
      'Gridsmith may rely on information, dimensions and other inputs supplied by the client or its advisers unless the Scope requires Gridsmith to verify them.',
      'Nothing in this clause excludes responsibility that cannot lawfully be excluded.',
    ]],
    ['13', 'Gridsmith Press', 'Copyright, Designs and Patents Act 1988 ss. 11, 77 and 90', [
      "Gridsmith Press provides professional services on the client's behalf, which may include writing, proofreading, editing, formatting, design and publishing support.",
      "The client's existing manuscript, article, notes, concepts and other existing material remain the client's property.",
      "Gridsmith does not acquire ownership of the client's book or article and does not receive royalties or sales income unless a separate written agreement expressly says otherwise.",
      'To the extent Gridsmith owns copyright or other transferable rights in bespoke final material created specifically for the project, those rights are transferred under clause 9.3 on full payment.',
      "Publishing accounts should normally be in the client's name or under the client's control. The Scope will state any exception.",
    ]],
    ['14', 'Gridsmith Digital', 'Supply of Goods and Services Act 1982 s. 13; open-source licence terms', [
      'For websites, software and digital projects:',
      'the Scope identifies the bespoke deliverables;',
      'third-party and open-source components remain subject to their licences;',
      "client data remains the client's;",
      'infrastructure ownership or administrative access will be dealt with in the Scope;',
      'credentials belonging solely to Gridsmith need not be transferred; and',
      'Gridsmith does not warrant a particular search ranking, traffic level, conversion rate, revenue or other commercial result unless expressly guaranteed in writing.',
    ]],
    ['15', 'Warranties', 'Supply of Goods and Services Act 1982 s. 13; Unfair Contract Terms Act 1977 s. 3', [
      'Gridsmith warrants that it will perform the services with reasonable care and skill and that bespoke deliverables will materially conform to the agreed Scope at delivery.',
      'Except for express terms in the agreement, other terms are excluded only to the extent the law permits.',
      "The client acknowledges that creative, publishing, engineering and digital outcomes often depend on third parties, client decisions and circumstances outside Gridsmith's control.",
    ]],
    ['16', 'Liability', 'Unfair Contract Terms Act 1977 ss. 2, 3 and 11', [
      'Nothing in this agreement limits or excludes liability for:',
      'death or personal injury caused by negligence;',
      'fraud or fraudulent misrepresentation; or',
      'any other liability that cannot lawfully be limited or excluded.',
      "Subject to the above, Gridsmith's total aggregate liability arising from a Scope will not exceed the total fees paid or payable to Gridsmith under that Scope.",
      'The limitation applies only to the extent it is fair and reasonable and legally effective in the circumstances.',
      'Neither party is liable for indirect or consequential loss. Gridsmith is not liable for loss of profit, revenue, anticipated savings or business opportunity except to the extent such exclusion is not legally effective in the circumstances.',
      'A Scope may state a different liability allocation where the nature, value or risk of the project reasonably requires it.',
    ]],
    ['17', 'Third-party services', 'Unfair Contract Terms Act 1977 s. 3; common law', [
      "Where a Scope depends on a third-party platform, supplier, hosting service, software package or marketplace, Gridsmith is not responsible for changes, outages or decisions of that third party that are outside Gridsmith's reasonable control.",
      'Gridsmith remains responsible for its own work and for exercising reasonable care when selecting or configuring a third-party service within the agreed Scope.',
    ]],
    ['18', 'Force majeure', 'Common law', [
      'Neither party is liable for delay caused by an event outside its reasonable control, provided it informs the other party and takes reasonable steps to minimise the effect.',
    ]],
    ['19', 'Notices', 'Companies (Trading Disclosures) Regulations 2015 reg. 25(2); common law', [
      'Project notices and approvals may be given by email to the addresses normally used by the parties for the project, unless the Scope states otherwise.',
      'Formal notices to Gridsmith may be sent to Gridsmith Ltd, 30 Briarfield Road, Farnworth, Bolton, BL4 0HD, United Kingdom, or by email to contact@gridsmith.uk.',
    ]],
    ['20', 'General', 'Contracts (Rights of Third Parties) Act 1999 s. 1; common law', [
      'Neither party may transfer the agreement in a way that materially prejudices the other without reasonable notice, except as part of a genuine business reorganisation or sale.',
      'If a provision is unlawful or unenforceable, the remaining provisions continue.',
      'A failure to enforce a provision immediately is not a waiver.',
      'No person other than the parties has a right to enforce this agreement unless the Scope expressly says otherwise.',
    ]],
    ['21', 'Governing law and jurisdiction', 'Rome I Regulation as retained; Civil Jurisdiction and Judgments Act 1982', [
      'This agreement and any non-contractual dispute arising from it are governed by the law of England and Wales.',
      'The courts of England and Wales have exclusive jurisdiction, unless the parties agree another dispute-resolution process in writing.',
    ]],
  ],
);

// ---------------------------------------------------------------------------
// docs/_legal/CONSUMER-TERMS.md
// ---------------------------------------------------------------------------

const consumerClientTerms = doc(
  'consumer-client-terms',
  'Client Terms for Consumers',
  'The terms that govern paid work for an individual buying outside a trade, business, craft or profession. Consumer law gives you rights that cannot be excluded, and this instrument is drafted on that basis. Business clients are on the Master Services Agreement instead. This draft has not been reviewed by a solicitor.',
  [
    ['1', 'Who these terms apply to', 'Consumer Rights Act 2015 s. 2(3)', [
      'These terms apply when an individual buys services from Gridsmith Ltd wholly or mainly for purposes outside their trade, business, craft or profession.',
      'If you are buying for a business or professional activity, our Business Client Terms / Master Services Agreement apply instead.',
      'These terms apply to services supplied by Gridsmith Design, Gridsmith Digital and Gridsmith Press.',
    ]],
    ['2', 'What we provide', 'Consumer Rights Act 2015 s. 49', [
      'The exact services, deliverables, price, expected timetable, revision allowance and exclusions will be set out in our written quotation, scope or order confirmation.',
      'Typical services include:',
      'graphic and visual design;',
      'engineering and technical drawing services;',
      'website, software and digital development;',
      'writing, editing, proofreading and publishing support; and',
      'related creative and technical services.',
      'We will perform services with reasonable care and skill.',
    ]],
    ['3', 'Forming the contract', 'Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 reg. 13 and Sch. 2', [
      'A website enquiry or initial discussion is not a contract.',
      'A contract is formed when we send you a written order confirmation, accepted quotation or agreed scope confirming the work and price, or when we otherwise confirm in writing that we have accepted your order.',
      'Before you are bound, we will provide the information required by applicable consumer law, including the main characteristics of the service, the total price or how it will be calculated, payment arrangements and applicable cancellation information.',
    ]],
    ['4', 'Price and payment', 'DMCCA 2024 s. 230; CCRs 2013 Sch. 2; Value Added Tax Act 1994 Sch. 1', [
      'The total price and payment schedule will be set out in writing before the order is confirmed. Gridsmith Ltd is not currently registered for VAT and does not charge VAT, so the price you are given is the total amount you pay. If Gridsmith Ltd becomes registered for VAT, consumer prices will include VAT where VAT is applicable.',
      'We will not add an additional charge without telling you what it is for and obtaining your agreement where required.',
      'Where a project changes materially because you request additional work, we will explain the effect on price and timetable before carrying out the additional work.',
    ]],
    ['5', 'Revisions and changes', 'Consumer Rights Act 2015 s. 49; common law of variation', [
      'Unless the scope says otherwise, the quoted fee includes only the work and revision rounds expressly described in the scope.',
      'We will make reasonable changes within the agreed revision allowance.',
      'If you request a material change to the agreed direction, additional deliverables, substantial reworking, or work outside the original scope, we may:',
      'explain why it is outside the agreed scope;',
      'provide an additional price or revised quotation; and',
      'continue with the additional work only after you agree.',
      'A request for additional work does not remove your statutory rights in relation to the original service.',
    ]],
    ['6', 'Your statutory cancellation rights', 'CCRs 2013 regs. 27 to 38', [
      'Where your contract is a distance or off-premises service contract and the Consumer Contracts Regulations 2013 give you a cancellation right, you will normally have 14 days from the day after the contract is made to cancel.',
      'You may cancel by sending a clear statement to contact@gridsmith.uk.',
    ]],
    ['6.1', 'If no work has started', 'CCRs 2013 reg. 34', [
      'If you validly cancel before we have started work, we will refund the amount you paid for that service, subject to any statutory rules that apply to your particular contract.',
    ]],
    ['6.2', 'If you ask us to start during the cancellation period', 'CCRs 2013 regs. 36 and 37', [
      'We will not begin a service during a statutory cancellation period unless you have expressly asked us to begin early where the law requires that request.',
      'If you validly cancel after work has started during that period, and the law allows us to charge for work already supplied, you will pay a proportionate amount for the service supplied up to the time you told us you were cancelling. We will refund the balance.',
      'If the service has been fully performed during the cancellation period, you will lose the statutory right to cancel only where the legal requirements for that loss of right have been satisfied, including any required express request and acknowledgement.',
      'Nothing in this section allows us to charge you where consumer law says no payment is due.',
    ]],
    ['7', 'Ending a project after the statutory cancellation period', 'Consumer Rights Act 2015 s. 62; common law', [
      'After any statutory cancellation period has expired, you may still ask us to stop a project.',
      'If we agree to end the project:',
      'you will pay for work reasonably carried out up to the effective cancellation date;',
      'you will also pay any third-party costs or commitments that we reasonably incurred for your project and cannot recover;',
      'we will refund any remaining amount paid for work that has not been carried out; and',
      'if the value of work already completed and unavoidable committed costs is equal to or greater than the amount you have paid, no refund will be due and any properly due outstanding balance remains payable.',
      'This means that where a substantial part of the agreed work has already been completed, the refundable balance may be small or zero. We do not charge a cancellation penalty merely for cancelling.',
      'This section does not affect any statutory remedy you have where we are in breach of contract.',
    ]],
    ['8', 'Your responsibilities', 'Consumer Rights Act 2015 s. 49; Copyright, Designs and Patents Act 1988 s. 16', [
      'You must provide information, content, access, instructions, feedback and approvals reasonably required for the project.',
      'You are responsible for ensuring that materials you provide may lawfully be used for the project.',
      'If your delay prevents us from progressing, the timetable may move accordingly.',
    ]],
    ['9', 'Engineering and technical drawings', 'Consumer Rights Act 2015 ss. 49 and 57', [
      'Where we provide engineering, technical or construction-related drawings or design services:',
      'we will perform the agreed design or drawing service with reasonable care and skill;',
      'the scope will state what we have and have not been engaged to do;',
      'you are responsible for reviewing the deliverables and confirming that they meet your intended requirements before relying on them;',
      'approvals, surveys, site verification, building control, planning approval, specialist calculations, certification and third-party professional sign-off are included only where the written scope expressly says so; and',
      'you must not use preliminary, draft, marked-up or unapproved drawings as final deliverables.',
      'Nothing in this clause excludes responsibility that the law does not allow us to exclude.',
    ]],
    ['10', 'Gridsmith Press', 'Copyright, Designs and Patents Act 1988 ss. 11 and 90', [
      'Gridsmith Press provides services on behalf of the client, including writing, editing, proofreading, formatting, design and publishing support.',
    ]],
    ['10.1', 'Your existing work', 'Copyright, Designs and Patents Act 1988 s. 11', [
      'Your manuscript, notes, articles, concepts and other material that existed before our work remain yours. Gridsmith does not acquire ownership merely because you provide them to us.',
    ]],
    ['10.2', 'Work created for you', 'Copyright, Designs and Patents Act 1988 s. 90(3)', [
      'Where we create bespoke text, design or other original final material specifically for your project, then to the extent Gridsmith owns rights in that material, those rights will transfer to you on full payment, except for:',
      'third-party material;',
      'fonts, stock assets and software licensed under separate terms;',
      "Gridsmith's pre-existing templates, tools, methods and reusable components; and",
      'anything the written scope expressly says is licensed rather than transferred.',
      'We will not claim royalties, sales income or ownership of your book or article merely because we supplied publishing, writing, proofreading or related services.',
    ]],
    ['10.3', 'Publishing accounts and royalties', 'Copyright, Designs and Patents Act 1988 s. 90; common law of agency', [
      'Unless the scope says otherwise, publishing and distribution accounts should be held in your name or under your control. Royalties and sales income belong to you. We are paid the service fees agreed with you.',
    ]],
    ['11', 'Digital and software services', 'Consumer Rights Act 2015 ss. 34 and 49', [
      'For websites, software and other digital work, the scope will identify the deliverables and any third-party platforms, licences, hosting or subscriptions.',
      'We do not guarantee a particular level of sales, traffic, search ranking, conversion, revenue or other commercial outcome unless an express written guarantee appears in the scope.',
    ]],
    ['12', 'Intellectual property generally', 'Copyright, Designs and Patents Act 1988 ss. 11, 90 and 91', [
      'Your existing materials remain yours.',
      'On full payment, Gridsmith will transfer to you the rights it owns in bespoke final deliverables created specifically for your project, to the extent stated in the scope.',
      'Gridsmith retains its pre-existing tools, know-how, reusable components, frameworks, methods and background material, while granting you the rights reasonably necessary to use the final deliverable for its intended purpose.',
      'Third-party and open-source material remains subject to its own licence terms.',
    ]],
    ['13', 'If something goes wrong', 'Consumer Rights Act 2015 ss. 54 to 56', [
      'Please contact contact@gridsmith.uk and explain the problem.',
      'We will acknowledge service complaints as soon as reasonably practicable and aim to do so within 5 working days. We will investigate and provide a substantive response within a reasonable time having regard to the issue.',
      'Your rights under the Consumer Rights Act 2015 apply regardless of this complaints procedure, including rights relating to reasonable care and skill, repeat performance and price reduction where applicable.',
      'Data-protection complaints are handled under the separate process in our Privacy Policy.',
    ]],
    ['14', 'Our responsibility to you', 'Consumer Rights Act 2015 ss. 57 and 65; Hadley v Baxendale', [
      'We are responsible for foreseeable loss or damage caused by our breach of contract or failure to use reasonable care and skill.',
      'Nothing in these terms excludes or limits liability where the law does not permit this, including liability for death or personal injury caused by negligence, fraud or fraudulent misrepresentation, or liability that cannot lawfully be restricted under consumer law.',
      'We are not responsible for losses that were not reasonably foreseeable when the contract was made.',
    ]],
    ['15', 'Events outside our reasonable control', 'Common law', [
      'We are not responsible for delay caused by events outside our reasonable control. If a material delay occurs, we will tell you and take reasonable steps to reduce its effect.',
    ]],
    ['16', 'Personal data', 'UK GDPR Art. 13; PECR reg. 22', [
      'We handle personal data in accordance with our Privacy Policy.',
      'We do not treat a general enquiry as consent to marketing.',
    ]],
    ['17', 'General', 'Consumer Rights Act 2015 ss. 67 and 74', [
      'If part of these terms is found unlawful or unenforceable, the remaining provisions continue to apply.',
      'If we do not enforce a term immediately, that does not mean we have waived it.',
      'These terms are governed by the law of England and Wales. If consumer law gives you rights to bring proceedings elsewhere in the UK, those rights are unaffected.',
    ]],
    ['18', 'Contact and cancellation notice', 'CCRs 2013 reg. 32; Companies (Trading Disclosures) Regulations 2015 reg. 25(2)', [
      'To cancel or contact us:',
      'Gridsmith Ltd',
      '30 Briarfield Road, Farnworth, Bolton, BL4 0HD',
      'contact@gridsmith.uk',
      'A cancellation does not need to use any particular form. A clear email identifying you, the project and your wish to cancel is sufficient.',
    ]],
  ],
);

// ---------------------------------------------------------------------------
// docs/_legal/ACCESSIBILITY-STATEMENT.md
// ---------------------------------------------------------------------------

const accessibility = doc(
  'accessibility',
  'Accessibility Statement',
  'What Gridsmith Ltd aims for on accessibility, what has and has not been tested, and how to ask for an adjustment. It deliberately does not claim formal WCAG 2.2 AA conformance. This draft has not been reviewed by a solicitor.',
  [
    ['1', 'Our approach', 'Equality Act 2010 s. 20', [
      'We want gridsmith.uk to be usable by as many people as reasonably possible, including people who use keyboard navigation, screen readers, magnification or reduced-motion settings.',
      'We treat accessibility as part of the design and development of the website.',
    ]],
    ['2', 'Current status', 'WCAG 2.2 Level AA; Equality Act 2010 s. 20', [
      'We aim to follow WCAG 2.2 Level AA where reasonably practicable.',
      'We are not currently claiming formal full conformance with WCAG 2.2 AA because the site continues to be developed and has not yet completed a comprehensive assistive-technology and screen-reader audit across every public route.',
    ]],
    ['3', 'Measures we take', 'WCAG 2.2 Level AA', [
      'Our development process includes measures such as:',
      'semantic page structure;',
      'keyboard accessibility;',
      'visible focus states;',
      'text and interface contrast checks;',
      'responsive layouts;',
      'reduced-motion consideration; and',
      'automated accessibility checks on selected routes.',
      'Automated testing does not detect every accessibility problem, so it is not treated as proof of full conformance.',
    ]],
    ['4', 'Known limitations', 'Equality Act 2010 s. 20(6)', [
      'Because the website is still being developed, some routes or components may not yet have received the same depth of manual or assistive-technology testing.',
      'If we identify a material accessibility issue, we will aim to correct it as part of normal site development.',
    ]],
    ['5', 'Requesting an adjustment or reporting a problem', 'Equality Act 2010 s. 20(3)', [
      'If you cannot access information or use a feature of the website, email contact@gridsmith.uk and tell us:',
      'which page or feature caused the problem;',
      'what you were trying to do; and',
      'any format or adjustment that would help.',
      'We aim to acknowledge accessibility enquiries within 5 working days and will respond substantively as soon as reasonably practicable.',
    ]],
    ['6', 'Alternative formats', 'Equality Act 2010 s. 20(6)', [
      'Where reasonably possible, we can provide important information in an alternative accessible format or through another reasonable method.',
    ]],
    ['7', 'Legal position', 'Equality Act 2010 s. 29', [
      'Nothing in this statement limits duties that apply to Gridsmith Ltd under the Equality Act 2010 or other applicable law.',
    ]],
    ['8', 'Review', 'Equality Act 2010 s. 20', [
      'We will review this statement as the site develops and after significant accessibility testing or redesign work.',
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
 *
 * **This is the one legal document with no `docs/_legal/` draft**, because it is not an
 * instrument. Its text is the owner's routing decision, recorded in `lib/legal/slugs.ts`.
 * `check-legal-parity.mjs` therefore cannot cover it, names it in every run as the one
 * uncovered slug, and `scripts/check-consumer-terms.mjs` is what guards the routing it exists
 * to perform.
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

/**
 * slug → the `docs/_legal/` draft it is transcribed from.
 *
 * **Exported for `scripts/check-legal-parity.mjs`, which does NOT use it as its expectation.**
 * The gate reads the version out of the draft's own header and out of the served page, and
 * compares those two. This map only says which file pairs with which route — a routing fact,
 * not a claim about either side. `null` means there is no draft; see
 * `clientTermsDisambiguation`.
 */
export const LEGAL_DRAFT_SOURCES = {
  privacy: 'PRIVACY-POLICY.md',
  cookies: 'COOKIE-POLICY.md',
  terms: 'WEBSITE-TERMS.md',
  'client-terms': null,
  'business-client-terms': 'MSA-BUSINESS.md',
  'consumer-client-terms': 'CONSUMER-TERMS.md',
  accessibility: 'ACCESSIBILITY-STATEMENT.md',
};
