/**
 * The seven legal documents, **transcribed from `docs/_legal/`** — one draft per slug.
 *
 * ## This file is a transcription, not a draft
 *
 * Until 29 August 2026 it was a second, shorter, independently-written document set. Nobody
 * was comparing the two, and they diverged: `07-STATE-REPORT.md` F-1 to F-7 record seven live
 * divergences, of which the worst were the served consumer terms sitting at the pre-round-9
 * instrument (a flat 14-day right with no reg. 27(1) scope, and a reg. 34(6) refund concession
 * round 9 removed — a **binding over-promise nobody chose**) and the served privacy policy
 * asserting as fact four things the draft marks `[TK]` precisely because they could not be
 * established.
 *
 * So the rule for this file is now one rule:
 *
 * > **Every seeded paragraph is a transcription of operative prose in the matching
 * > `docs/_legal/*.md` draft**, with markdown emphasis (`**`, backticks) removed, bullets
 * > flattened, and nothing else changed. `[TK]` and `[DECISION REQUIRED]` markers that stand
 * > inside operative prose are **kept**, because a marker deleted in transcription is exactly
 * > how F-2 and F-3 happened.
 *
 * What is deliberately NOT transcribed is the drafts' editorial apparatus: revision notes,
 * `<!-- ledger -->` comments, `> For solicitor review` blocks, and `[DECISION REQUIRED]`
 * blocks addressed to the reviewer rather than to the reader. None of those is a term.
 *
 * `scripts/check-legal-parity.mjs` enforces the rule against the **served pages**, not against
 * this file. See its docstring for why that direction was chosen.
 *
 * ## Two markers, two different meanings
 *
 * **`[SEED - SOLICITOR REVIEW REQUIRED]`** heads every document. `solicitorApproved` is
 * `false` on all seven, which is what `master/SCHEMA.md` says gates publication: the production
 * build check treats an unapproved legal document the way it treats seed content. `L-04` is
 * the hard gate.
 *
 * **`[TK]`** is a fact nobody in the project has. **`[DECISION REQUIRED]`** is a choice the
 * owner or the solicitor has not made. Neither is a place where a judgement was quietly made,
 * and neither is filled in here.
 *
 * ## `effectiveFrom` is a schema date and the drafts have none
 *
 * Every draft states `Effective from: [TK]`. `legalDocument.effectiveFrom` is a required
 * `date`, so a marker cannot go in it. The field carries the draft's own revision date and
 * `reviewedBy` states that the effective date is `[TK]` — which is the honest form available
 * without a schema change. `07-STATE-REPORT.md` §2.2 lists the seven effective dates as an
 * owner item.
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

const REVIEWED_BY = 'Internal — not reviewed by a solicitor. Effective date [TK].';

/**
 * @param {string} slug
 * @param {{version: string, revised: string}} meta
 * @param {string} title
 * @param {string} summary
 * @param {Array<[string, string, string, string[], string?]>} clauses
 *   `[number, heading, basis, paragraphs, anchorOverride?]`. The override exists for one
 *   reason: an anchor that is already cited must not move. `anchorId` is contract-facing —
 *   `master/SCHEMA.md` makes renumbering a version bump plus a redirect, never an edit — and
 *   `/press` links into `#clause-10-1` on the consumer terms, asserted by
 *   `scripts/check-consumer-terms.mjs`. Deriving the anchor from the draft's own section
 *   number would silently move it to `clause-10` and leave that link resolving to the page
 *   and then to nothing, which is the failure mode a 404 would at least have announced.
 */
const doc = (slug, meta, title, summary, clauses) => ({
  _id: `seed-legal-${slug}`,
  _type: 'legalDocument',
  slug: { _type: 'slug', current: slug },
  title,
  version: meta.version,
  effectiveFrom: meta.revised,
  lastReviewed: meta.revised,
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
// docs/_legal/PRIVACY-POLICY.md — version 1.3
// ---------------------------------------------------------------------------

const privacy = doc(
  'privacy',
  { version: '1.4', revised: '2026-08-29' },
  'Privacy Policy',
  'What Gridsmith Ltd does with personal data collected through this website, who processes it, and how to exercise your rights. Drafted against UK GDPR and the Data Protection Act 2018 as amended by the Data (Use and Access) Act 2025. This draft has not been reviewed by a solicitor.',
  [
    ['1', 'Who we are', 'UK GDPR Art. 13; Companies Act 2006 s. 82; Companies (Trading Disclosures) Regulations 2015 reg. 25', [
      'Gridsmith Ltd is the data controller for personal data collected through gridsmith.uk. We operate three trading divisions — Gridsmith Design, Gridsmith Digital and Gridsmith Press. All three are part of the same company, and personal data is held once by Gridsmith Ltd rather than separately by each division.',
      '[TK] company number, registered office and contact email — see WEBSITE-TERMS.md clause 1 and OQ-15.',
    ]],
    ['1A', 'ICO registration and the data protection fee', 'Data Protection (Charges and Information) Regulations 2018 reg. 2, reg. 3 and the Schedule', [
      '[TK — is Gridsmith Ltd registered with the Information Commissioner and paying the data protection fee, and what is the registration number? The icoRegistration field exists in the Sanity companyDetails schema (sanity/schemas/companyDetails.ts:47) and is never populated and never rendered anywhere on the site — 01-FACTUAL-INVENTORY.md §6.1, OQ-16.]',
      'Registration number: [TK]. Staff-number band and turnover band as notified to the Commissioner: [TK].',
    ]],
    ['2', 'What we collect', 'UK GDPR Art. 13', [
      'Enquiry data — Division, name, email, company, phone, message, engagement shape, timeline. When you submit an enquiry at /contact.',
      'Enquiry metadata — The date and time of your enquiry, and a record identifier we generate. Automatically, when the enquiry is stored.',
      'Communication data — Emails and messages between us. Throughout an enquiry or engagement.',
      'Client data — Contract, project and billing information. If you become a client.',
      'The database schema accepts several further fields that no form on this site sends. They are not listed in the table above because nothing on gridsmith.uk populates them. They are: track, service_slug, role, payload, source, medium, campaign, referrer, landing_page and is_ai_referral. Seven of them — role, source, medium, campaign, referrer, landing_page and is_ai_referral — are read by the server that handles enquiries from whatever is submitted to it, so a submission made by something other than our own form could supply them and they would be stored. track, service_slug and payload are not read by the server at all today.',
      'Nothing on this site fills any of those fields, and nothing derives them. We do not read your referring page or your landing page from your browser and we do not attach campaign identifiers to your enquiry.',
      'We do not capture your IP address or user-agent. The application reads neither (lib/leads/schema.ts:20-24). Our hosting provider’s own platform logging is separate — see §6B.',
      'We do not collect special category data, and we ask that you do not include it in free-text fields. The message field accepts up to 5,000 characters of free text and we cannot control what is written in it.',
      'We do not accept file uploads through this website. Where a brief, manuscript or drawing needs to be shared, we ask for a link. This is deliberate — it avoids us holding your intellectual property before there is a contract governing it.',
    ]],
    ['2A', 'Whether you have to give us this, and what happens if you do not', 'UK GDPR Art. 13(2)(e)', [
      'Nothing on this page is required of you by law. There is no statute that obliges you to give Gridsmith Ltd any personal data, and we are under no statutory duty to collect any from you before we may speak to you.',
      'You are not obliged to submit an enquiry at all. Using gridsmith.uk does not require you to provide any personal data. You can read every page on this site, including this one, without giving us anything.',
      'If you do send an enquiry, our form requires two things: your name and your email address. Everything else it asks — company, phone, your message, budget, timeline — is optional and the form will accept a submission without it. The consequence of not providing the two required fields is simply that the enquiry cannot be submitted and we will not receive it, because we would have no way to reply to you.',
      'Providing them is a contractual requirement only in this narrow sense: giving us a name and a reply address is necessary if you want us to take the step you have asked us to take — responding to your enquiry and, if it goes further, preparing a scope or proposal. That is the Art. 6(1)(b) basis in section 3. It is not a condition of anything else, and we do not make access to any part of this site depend on it.',
      'The consequence of not providing optional information is only that our reply is likely to be less useful — we will ask you for what we need instead. Withholding it has no other effect, and we do not treat a sparse enquiry differently.',
      '[TK — the equivalent statement for a client engagement, which this notice does not yet make. Once someone becomes a client, some information genuinely does become a contractual requirement (the details needed to invoice and deliver) and some becomes a statutory one (what HMRC requires to be kept in accounting records — §3’s Art. 6(1)(c) row). Neither can be written from this repository: no engagement process, invoicing flow or record-keeping policy exists in it. The owner and the solicitor must supply what is actually required of a client and what happens if a client declines to give it.]',
    ]],
    ['3', 'Lawful bases', 'UK GDPR Art. 6', [
      'Responding to an enquiry — Art. 6(1)(b), steps taken at your request before entering a contract; and, where an enquiry does not lead to a contract, Art. 6(1)(f) legitimate interests in responding to a request you made.',
      'Providing services under a contract — Art. 6(1)(b), performance of a contract.',
      'Marketing emails to existing clients about similar services — Art. 6(1)(f) plus the PECR reg. 22(3) soft opt-in. See section 3A; this is not available for a bare enquiry.',
      'Marketing emails to anyone else — Art. 6(1)(a), consent.',
      'Accounting and tax records — Art. 6(1)(c), legal obligation.',
      'Establishing or defending legal claims — Art. 6(1)(f), legitimate interests.',
      'Where we rely on legitimate interests, we have assessed that our interest in operating and improving a professional services business does not override your rights. [TK — that assessment (an LIA) does not exist in written form anywhere in the repository. Art. 5(2) accountability means it needs to.] You may object at any time — see §10.',
    ]],
    ['3A', 'Marketing', 'PECR reg. 22; PECR reg. 23', [
      'We do not currently send marketing email of any kind; no mailing list and no marketing send exists (01-FACTUAL-INVENTORY.md §3, §7). This section states the position that will apply if that changes.',
      'If you are an individual subscriber — which includes most Gridsmith Press authors, and a sole trader using a personal address — PECR reg. 22 applies. We will not send you marketing email unless you have consented, or unless the reg. 22(3) soft opt-in applies: we obtained your details in the course of a sale or negotiations for a sale to you, the marketing is of similar services, and you were given a simple free means of refusing at the time and in every message since.',
      'If you are a corporate subscriber — the typical Gridsmith Design or Gridsmith Digital buyer — reg. 22 does not bind, but we will still identify ourselves and give a valid address in every message, and UK GDPR continues to apply to your personal data.',
      'An enquiry that did not become a negotiation for a sale does not unlock the soft opt-in. Submitting the contact form is not consent to marketing and we will not treat it as such.',
    ]],
    ['4', 'How we use it', 'UK GDPR Art. 13', [
      'To respond to enquiries and provide the response we have committed to.',
      'To prepare scopes, estimates and proposals.',
      'To deliver services and support.',
      'To keep accounting records.',
      'To meet legal obligations.',
      'We do not sell personal data. We do not share it with advertisers. We do not use it to train any model.',
    ]],
    ['5', 'Automated decision-making', 'UK GDPR Art. 13 and Art. 22', [
      'We do not make decisions producing legal or similarly significant effects about you by automated means.',
    ]],
    ['6', 'Who we share it with', 'UK GDPR Art. 13, Art. 28 and Art. 44A', [
      'Vercel — Website hosting; your enquiry passes through the server action. Everything you submit, in transit; request metadata for every visitor. [TK — no region is pinned in vercel.json. OQ-3].',
      'Supabase — The enquiry database. Every field of your enquiry. [TK — OQ-2. The live project ref is dqiutgmxillhsbzgnlsx and its region is not established. It must not be assumed to be in the UK or EU.]',
      'Resend — The email that notifies us of your enquiry. This is the whole of it: the division; the enquiry type; the service you enquired about, where you named one; your name; your email address; your company, where you gave one; your phone number, where you gave one; and a record id. Your message is deliberately not included (lib/leads/notify.ts:62-79). [TK — OQ-4].',
      'Slack — Internal notification that an enquiry arrived. This is the whole of it: your full name, the division, and the enquiry type (lib/leads/notify.ts:128). [TK — OQ-6. See the decision below.]',
      '[DECISION REQUIRED] — Slack. lib/leads/notify.ts:125-133 is a live code path that transmits an enquirer’s full name to Slack. It is currently inert only because the SLACK_LEADS_WEBHOOK environment variable is unset; setting that variable makes Slack a processor immediately, with no code change and no further decision.',
      'Consequence of doing nothing: an undocumented processor is one environment variable away from live.',
      'Sanity — Content management for the site’s own pages. None. Read-only and server-side at build time. [TK — OQ-1].',
      'Our accountants — Bookkeeping and statutory accounts. Client billing data. [TK].',
      'Version 1.0 asserted regions — EU/UK region, EU region, EU/US, US — for six recipients. None of those was established. 01-FACTUAL-INVENTORY.md OQ-1 to OQ-4 record that the Sanity, Supabase, Vercel and Resend regions are all unestablished, and OQ-2 states explicitly that the Supabase region must not be assumed to be EU. Asserting a region we have not verified is exactly the misstatement the transfer disclosure exists to prevent, so each is now [TK].',
      'Removed at revision 1.1: the "delivery partners" row and its note. Version 1.0 stated "Gridsmith Ltd works with affiliated production entities outside the UK … This is a real transfer and cannot be omitted."',
      '[TK — nothing in the repository or the inventory establishes that such entities exist, who they are, what data reaches them, or where. It is retained as an open item rather than as an assertion, because a privacy notice must not describe a transfer it cannot particularise — and must not omit one that is real. The owner must confirm which it is.]',
    ]],
    ['6A', 'Analytics — there is none', 'PECR reg. 6; UK GDPR Art. 13', [
      'We do not use analytics. No Google Analytics, no PostHog, no product analytics, no heatmaps, no session recording, no advertising or retargeting pixel. Nothing on this site measures your visit, and no third-party request of any kind is made in any state — before the cookie notice, after dismissing it, or on any later visit.',
      'What was here before, and why it went. Version 1.1 and 1.2 described a site that requested two scripts when a visitor accepted — googletagmanager.com/gtag/js and eu.i.posthog.com/static/array.js — and recorded, accurately, that neither library was ever initialised: no gtag config call and no posthog.init() call existed, so no analytics cookie was set, no event was recorded and no identifier was created. Requesting a script nonetheless sends your IP address and browser user-agent to the host serving it, because every HTTP request does. So the arrangement disclosed something about every accepting visitor to two third parties and collected nothing in return. On 26 August 2026 the scripts and the consent categories were deleted rather than the libraries being switched on.',
      'Your IP address and user-agent are no longer sent to Google or to PostHog at all, in any state.',
      'There is no analytics dataset, no analytics retention period and no analytics processor, because there is nothing to retain and nobody to process it.',
      'There is no analytics consent to give or withdraw. §11A’s demonstrability question is not engaged.',
    ]],
    ['6B', 'Our hosting provider’s own logs', 'UK GDPR Art. 13 and Art. 30', [
      'Our application does not record your IP address or user-agent. Our hosting provider records request metadata as part of running the platform. [TK — what Vercel retains, in which region, and for how long. OQ-8. This is a disclosure we owe under Art. 13 and it cannot be written from the repository.]',
    ]],
    ['6C', 'International transfers', 'UK GDPR Art. 44A, Art. 45A, Art. 45B, Art. 46 and Art. 49', [
      'Articles 44 and 45 of the UK GDPR were omitted on 5 February 2026 by the DUAA 2025, and Chapter V was restructured. The applicable provisions are now Art. 44A (general principles), Art. 45A (transfers approved by regulations), Art. 45B (the "data protection test"), Art. 46 (appropriate safeguards, substantially amended) and Art. 49 (derogations).',
      'Where we transfer your personal data outside the United Kingdom, we do so only where the transfer is approved by regulations under Art. 45A, or subject to appropriate safeguards under Art. 46, or within an Art. 49 derogation. Art. 45B asks whether the standard of protection in the receiving country or for the receiving organisation is not materially lower than the UK standard.',
      '[TK — which mechanism is relied on, for which recipient. This cannot be completed until section 6’s regions are established. The ledger records this as the largest single unknown.]',
    ]],
    ['7', 'How long we keep it', 'UK GDPR Art. 5(1)(e) and Art. 13(2)(a)', [
      'Version 1.0 published a retention table. None of it was implemented, and most of it still is not.',
      '01-FACTUAL-INVENTORY.md §3.4: "Retention: NOT IMPLEMENTED." There is no purge, no anonymisation and no scheduled delete over the leads table anywhere in the repository. The only cron on the deployment is /api/rls-drift, which is a security check. Enquiry data currently accumulates indefinitely.',
      'Enquiries that do not become clients — [TK]. Nothing implemented. OQ-9.',
      'Client records — [TK]. Held outside this website.',
      'Contracts — [TK]. Held outside this website.',
      'Cookie-notice acknowledgement — 365 days. Implemented — it is the Max-Age on the gs_consent cookie in your own browser.',
      'Analytics — Not applicable. There is no analytics — see section 6A.',
      '[DECISION REQUIRED] — the enquiry retention period, and who builds the deletion. Art. 13(2)(a) requires this notice to state either a period or the criteria for determining one, and Art. 5(1)(e) requires data not to be kept longer than necessary.',
      'Consequence: option (a) is a build task nobody currently owns. Publishing this notice with a period in it, and no job, converts a build gap into a published misstatement.',
    ]],
    ['8', 'Security', 'UK GDPR Art. 32', [
      'Data is encrypted in transit.',
      'The enquiry database uses row-level security: the public website can insert an enquiry and cannot read one back. This was verified against the live database on 25 August 2026 — an anonymous read of the enquiry table returns no rows, and the analytics view is revoked.',
      'That security posture is re-tested automatically every day by a scheduled check, which is a concrete instance of the Art. 32(1)(d) duty to test the effectiveness of our measures.',
      'The website writes enquiries using a restricted publishable key, never a privileged service key.',
      'Access is limited to those who need it.',
      'Stated honestly: there is no honeypot, no rate limit and no CAPTCHA on the enquiry form (01-FACTUAL-INVENTORY.md §3.3). That is an availability and abuse exposure on the one endpoint an anonymous visitor can write to. [TK — whether to build one before launch.]',
    ]],
    ['9', 'Your rights', 'UK GDPR Arts. 12, 15–18, 20 and 21', [
      'You have the right to: be informed · access · rectification · erasure · restrict processing · data portability · object · not be subject to solely automated decision-making · withdraw consent at any time.',
      'To exercise any of these, contact [TK email]. We will respond without undue delay and in any event within one month of receiving your request, and we will tell you promptly if we need up to two further months because the request is complex or because we have received a number of requests.',
      'There is no charge unless a request is manifestly unfounded or excessive.',
    ]],
    ['10', 'Objecting to legitimate interests', 'UK GDPR Art. 21', [
      'If we rely on legitimate interests, you can object. For direct marketing, we will stop immediately and without question. For other purposes, we will stop unless we can demonstrate compelling grounds that override your rights.',
    ]],
    ['11', 'Cookies', 'PECR reg. 6', [
      'See our Cookie Policy. In short: exactly one cookie exists on this site, gs_consent, which records that you have seen the cookie notice so we do not show it again. Nothing non-essential is placed at any point, and there is no choice to make. The Cookie notice link in the footer of any page brings the notice back if you want to read it again; it stores nothing and switches nothing on or off.',
    ]],
    ['11A', 'Our record of your consent', 'UK GDPR Art. 7(1); PECR reg. 6', [
      'Version 1.0 said we keep "a random consent identifier, your choice, which categories you selected, and the version of this policy in force … for 24 months". No such record exists.',
      'What actually exists (01-FACTUAL-INVENTORY.md §4.3): a first-party cookie in your own browser recording that you have seen the cookie notice. No timestamp, no version, no identifier, and no server-side record. The consent_events table described in our internal specification has not been built.',
      'There are now no consent categories, so the cookie records no choice — it holds the single character 1. Cookies set before 26 August 2026 still carry the old category names; nothing reads them and they are not overwritten (COOKIE-POLICY.md §2).',
      '[DECISION REQUIRED] — consent evidence. Art. 7(1) requires a controller relying on consent to be able to demonstrate that consent was given.',
      '[STILL OPEN — 26 August 2026, revision 1.3.] Revision 1.3 removed the analytics libraries, so this site relies on consent for nothing and Art. 7(1) is not engaged today. That is not an answer to this decision and must not be recorded as one. The gap is unchanged: there is still no server-side consent record, and it becomes live again the moment anything non-essential returns.',
    ]],
    ['12', 'Complaints', 'Data Protection Act 2018 s. 164A, inserted by DUAA 2025 s. 103, in force 19 June 2026', [
      'Data protection complaints procedure — required since 19 June 2026.',
      'If you are unhappy with how we have handled your personal data:',
      '[TK — an electronic complaint form. s. 164A requires us to facilitate the making of complaints "by taking steps such as providing a complaint form which can be completed electronically and by other means". 01-FACTUAL-INVENTORY.md §5.1 lists every route on the site: there is no complaints route and no complaint form. /contact is a sales enquiry form, and its message field is deliberately withheld from the notification email — it is not a complaints channel. This is the ledger’s number-one unclaused obligation and it is a build task, not a drafting one.]',
      'Or email [TK email] with "Data protection complaint" in the subject, or write to us at our registered office.',
      'We will acknowledge receipt within 30 days — the statutory maximum. [DECISION REQUIRED] see below.',
      '[DECISION REQUIRED] — the acknowledgement window. s. 164A sets 30 days as the outer limit. Version 1.0 promised 5 working days.',
      'Whichever is chosen must match CONSUMER-TERMS.md §12 and ACCESSIBILITY-STATEMENT.md §5, which currently promise 5 working days each.',
      'We will then, without undue delay, make appropriate inquiries, take appropriate steps to respond, keep you informed of progress, and tell you the outcome.',
      'You can complain to the Information Commissioner’s Office at any time, and you do not have to come to us first. ICO: ico.org.uk · 0303 123 1113.',
    ]],
    ['12A', 'Our record of processing', 'UK GDPR Art. 30', [
      '[TK — no record of processing activities (ROPA) exists. 01-FACTUAL-INVENTORY.md is the closest thing to one. The Art. 30(5) exemption for organisations under 250 staff does not obviously apply here, because it is lost where processing "is not occasional", and lead capture is continuous and automated: every submission writes a row and fires a notification. A ROPA is an internal document and does not belong in this published notice — this section exists so the obligation is not lost, and should be deleted from the published version once the ROPA exists.]',
    ]],
    ['13', 'Changes', 'NO LEDGER ENTRY — supports the Art. 5(1)(a) transparency principle; Pass 2 raised no discrete obligation.', [
      'We will post any changes here with an updated version number and effective date. Material changes will be notified to clients directly.',
    ]],
  ],
);

// ---------------------------------------------------------------------------
// docs/_legal/COOKIE-POLICY.md — version 1.3
// ---------------------------------------------------------------------------

const cookies = doc(
  'cookies',
  { version: '1.3', revised: '2026-08-26' },
  'Cookie Policy',
  'Every cookie and similar technology this site uses, what it does, how long it lasts, and how to change your mind. Drafted against PECR 2003 reg. 6 as substituted, and new Schedule A1 as inserted, by the Data (Use and Access) Act 2025 s. 112 and Sch. 12 — in force 5 February 2026. This draft has not been reviewed by a solicitor.',
  [
    ['1', 'Our position', 'PECR reg. 6(1) and 6(2); UK GDPR Arts. 4(11) and 7(3)', [
      'We place no non-essential cookie, script or tracking technology on your device at all — not before a choice, not after one, and there is no choice to make. This site makes no third-party request of any kind, in any state — verified by reading the network log on the running site.',
      'We do not ask you to accept or reject cookies, because there is nothing to accept or reject. What appears at the foot of the page on your first visit is a notice, not a request: it tells you about the single cookie described at section 2 and offers one control, which dismisses it.',
    ]],
    ['2', 'Strictly necessary — no consent required', 'PECR Sch. A1 para. 4', [
      'gs_consent — Records that you have seen the cookie notice, so it is not shown again. 365 days. First-party.',
      'That is the complete list. There is no session cookie and no CSRF cookie on this site — version 1.0 listed __Host-session and csrf_token and neither exists.',
      'gs_consent is set with Path=/, SameSite=Lax, and Secure when the page is served over HTTPS. Its value is the single character 1. It carries no identifier, no timestamp and nothing about you.',
      'This cookie is exempt from the consent requirement under Schedule A1 paragraph 4 — it is strictly necessary for the service you requested, because it is the thing that stops the notice appearing on every page. It does not track you and it is not read by anyone else.',
      'If you visited before 26 August 2026 your browser may still hold a gs_consent whose value lists the old category names, or the single character 0. Those names now name nothing: no part of this site reads the value, only whether the cookie is there. We deliberately do not overwrite it — it is your own record of what you were shown — and it expires on its own within 12 months. Deleting it at any time does no more than bring the notice back once.',
    ]],
    ['3', 'Functional — consent required', 'PECR reg. 6', [
      'None, and no toggle either. Version 1.0 listed gs_design_track; it does not exist. No functional or preference cookie is set by this site in any state.',
      'The Preferences toggle (functionality_storage) has been removed at revision 1.3. Version 1.2 recorded it as offered, defaulting to denied, and controlling nothing — which was accurate and was the problem. A control that changes nothing is a representation to you about what you can control, so it is gone rather than explained.',
    ]],
    ['4', 'Analytics — what actually happens', 'PECR reg. 6; UK GDPR Art. 13', [
      'There is no analytics on this site. Not disabled, not consent-gated, not awaiting an identifier — removed. No Google Analytics, no PostHog, no product analytics, no heatmaps, no session recording, no pixel of any kind. Nothing measures your visit.',
      'Arrive for the first time — No third-party request. No cookie until you dismiss the notice.',
      'Dismiss the notice — gs_consent is set (§2). No third-party request.',
      'Do not dismiss it — Nothing is stored. The notice stays; nothing else changes.',
      'Return later — No third-party request, in any state.',
      'Why this changed, stated plainly rather than as a claim of virtue. Until 26 August 2026 this site loaded Google Analytics and PostHog when a visitor accepted, and neither library was ever initialised — no configuration call existed, so no cookie was set, no event was recorded and no identifier was created. But requesting a script sends your IP address and user-agent to the host that serves it, as every HTTP request does. So the arrangement transmitted something about every accepting visitor to two third parties and measured nothing in return. Version 1.2 recorded that as "a defect in the build, not a claim of virtue". The defect has been removed by deleting the scripts.',
      'Version 1.0 listed _ga, _ga_* and ph_* cookies with 24-month and 12-month durations. None of them ever existed on this site, and the code that could have created them is now gone too.',
    ]],
    ['4A', 'The 2026 statistical-purposes exception', 'PECR Sch. A1 para. 5', [
      'What the statute says. PECR Sch. A1 para. 5 permits storage or access without consent where the sole purpose is collecting information for statistical purposes about how the service or website is used, with a view to making improvements to it; the user must be given clear and comprehensive information about the purpose and "a simple means of objecting, free of charge"; and para. 5(1)(c) requires that the information collected is not shared with anyone except to help make those improvements.',
      '[DECISION REQUIRED] — consent, or the para. 5 exception, for analytics.',
      '[STILL OPEN, and deliberately deferred — 26 August 2026, revision 1.3.] The owner’s decision at §4B removed the analytics libraries rather than choosing between (a), (b) and (c), so this question is not answered and must not be read as answered. It becomes live again, and must be settled, before any analytics is re-introduced.',
    ]],
    ['4B', 'Toggles that control nothing', 'UK GDPR Art. 4(11) — informed consent', [
      'The banner offers three toggles: Analytics (analytics_storage), Advertising (ad_storage) and Preferences (functionality_storage). Only Analytics gates anything. No code branches on the other two (01-FACTUAL-INVENTORY.md §4.1). Nothing on this site sets an advertising cookie or a preference cookie, so there is currently nothing for them to gate.',
      '[DECISION TAKEN] — 26 August 2026. Option (a), and it reached all three. ad_storage and functionality_storage are removed from the banner and from the code. analytics_storage is removed with them, because the same reasoning had by then reached the third toggle: it gated two libraries that recorded nothing, so it too was a control that changed nothing a visitor would ever observe.',
      'The Consent Mode default-denied signal noted above is not sent, and does not need to be. That requirement exists so a Google tag reads denied before it runs. There is no Google tag: the injection is deleted.',
    ]],
    ['5', 'What we do not use', 'PECR reg. 6', [
      'No advertising or retargeting cookies.',
      'No cross-site tracking.',
      'No social media pixels.',
      'No fingerprinting.',
      'No third-party consent platform — our banner is our own code, served from our own domain.',
      'No third-party fonts. Our typefaces are served from our own servers; no request is made to Google Fonts or any other font host in any state.',
    ]],
    ['6', 'Changing your mind', 'UK GDPR Art. 7(3)', [
      'There is nothing to change your mind about, because nothing non-essential is set and no consent was given. The Cookie notice link in the footer of any page brings the notice back if you want to read it again; it stores nothing and switches nothing on or off.',
      'You can also block or delete cookies in your browser. Deleting gs_consent means the notice appears once more; nothing else depends on it.',
    ]],
    ['7', 'How we record your choice', 'UK GDPR Art. 7(1)', [
      'Version 1.0 said we keep "a random consent identifier, your choice, which categories you selected, and the version of this policy in force … for 24 months". We keep no such record.',
      'What exists is the gs_consent cookie in your own browser, holding the category names you granted, for 365 days. There is no timestamp, no policy version, no identifier, and no record on our servers. If you delete the cookie, no record of your choice exists anywhere.',
      'The cookie now records only that the notice was seen, so there is no choice to record: gs_consent holds the single character 1. Cookies written before 26 August 2026 still hold the old category names and are not overwritten — see section 2.',
      'Art. 7(1) is no longer engaged, and that is a consequence of section 4 rather than a fix for it. A controller must be able to demonstrate consent where it relies on consent; this site now relies on consent for nothing, because it does nothing that requires it. This does not close the underlying gap. [TK — the day anything non-essential returns, Art. 7(1) applies again and there is still no server-side consent record.]',
    ]],
    ['8', 'Contact', 'Electronic Commerce (EC Directive) Regulations 2002 reg. 6', [
      '[TK email] · Information Commissioner’s Office: ico.org.uk',
    ]],
  ],
);

// ---------------------------------------------------------------------------
// docs/_legal/WEBSITE-TERMS.md — version 1.2
// ---------------------------------------------------------------------------

const terms = doc(
  'terms',
  { version: '1.3', revised: '2026-08-29' },
  'Website Terms of Use',
  'These terms govern use of gridsmith.uk. They do not govern services we provide — those are covered by the Client Terms for Business Clients or the Client Terms for Consumers. This draft has not been reviewed by a solicitor.',
  [
    ['1', 'Who we are', 'Companies Act 2006 s. 82; Companies (Trading Disclosures) Regulations 2015 regs. 24–25; Electronic Commerce (EC Directive) Regulations 2002 reg. 6', [
      'This site is operated by Gridsmith Ltd, a company registered in England & Wales, company number [TK — 17050842 is seeded at scripts/seed-company-details.mjs but is not distinguished there from the values explicitly marked [SEED]; owner confirmation required, OQ-15], registered office [TK — 30 Briarfield Road, Farnworth, Bolton, BL4 0HD, same confirmation required, OQ-15].',
      'VAT. [TK — the site currently renders the fabricated value "[SEED] GB123456789" in the footer of every page (01-FACTUAL-INVENTORY.md §6.1). That is a false disclosure, and a false VAT number is a worse defect than a missing one. See the decision below.]',
      '[DECISION REQUIRED] — the VAT number. Options: (a) the company is VAT-registered: supply the real number, and it is disclosed here and in the footer under L-ECOM-6 reg. 6(1)(g); (b) the company is not VAT-registered: publish no VAT number at all and remove the field from companyDetails rendering. reg. 6(1)(g) requires the number only "where the provider undertakes an activity subject to VAT".',
      'Consequence of doing neither: the running site continues to publish a fabricated registration number on every page. check:launch-content blocks a production dataset carrying it, so this cannot ship — but it is live in development today.',
      'We trade as Gridsmith Design, Gridsmith Digital and Gridsmith Press. These are trading divisions of Gridsmith Ltd, not separate companies. Any contract you enter is with Gridsmith Ltd.',
      'Contact: [TK email — contact@gridsmith.uk is recorded as a real address at scripts/seed-company-details.mjs:44-49] · [TK phone — the companyDetails.contactPhone field exists in the Sanity schema and is never populated; there is no telephone route on the site today, OQ-17]',
    ]],
    ['2', 'Acceptance', 'NO LEDGER ENTRY — browsewrap acceptance is a common-law contract-formation point, not a statutory obligation.', [
      'By using this site you accept these terms. If you do not accept them, please do not use the site.',
    ]],
    ['3', 'Our content', 'NO LEDGER ENTRY — this clause asserts copyright subsistence and grants a limited licence; the CDPA ledger entry covers assignment and does not discharge it.', [
      'All content on this site — text, images, drawings, book covers, code, design and layout — is owned by Gridsmith Ltd or our clients, and is protected by copyright.',
      'You may view it and print or download extracts for your own non-commercial reference. You may not:',
      'reproduce, republish or redistribute it commercially;',
      'remove or alter any watermark, copyright notice or attribution;',
      'use it to train, fine-tune or evaluate any machine learning model without our written permission;',
      'systematically extract or scrape it.',
      'Portfolio and sample work is shown for assessment purposes. It remains the property of Gridsmith Ltd or the relevant client, and no licence to use it is granted by its appearance here.',
    ]],
    ['4', 'Sample materials', 'NO LEDGER ENTRY — no ledger obligation covers sample-pack supply. Retained as a contractual term.', [
      'Where we provide sample drawings, sample reports or other materials on request, they are supplied for the purpose of assessing our work only. They must not be reused, circulated, or presented as your own or anyone else’s work. Sample materials are redacted and watermarked, and access links expire.',
    ]],
    ['5', 'Estimating tools', 'Consumer Rights Act 2015 s. 51 and s. 52; Digital Markets, Competition and Consumers Act 2024 s. 230', [
      '[TK] — none of these tools exists. 01-FACTUAL-INVENTORY.md §7 records the estimator, the drawing estimator and the Press Path Finder as NOT BUILT. This clause must either be removed until they ship, or retained with the site not referring to them. A term describing a facility the site does not provide is itself a statement about the service.',
      'This site provides estimating and guidance tools, including a project estimator, a drawing estimator and a publishing path finder.',
      'Their output is indicative only. It is not a quotation, not an offer, and does not bind either of us. Actual pricing follows a consultation and a written scope. Ranges are based on typical projects and your actual project may fall outside them.',
      'We give no warranty that any estimate will match a final price.',
      'If you are a consumer, an indicative figure does not become the price you must pay, and it does not become a price ceiling in your favour either: where no price is agreed, the Consumer Rights Act 2015 s. 51 entitles you to pay only a reasonable price.',
    ]],
    ['5A', 'Prices shown on this site', 'Electronic Commerce (EC Directive) Regulations 2002 reg. 6; SI 2002/2013 reg. 6(2); Digital Markets, Competition and Consumers Act 2024 s. 230', [
      'Prices shown on this site carry an INDICATIVE badge and, where applicable, a "What moves it: …" line. [TK — VAT treatment sentence, per the decision below.]',
      '[DECISION TAKEN — option (c). Owner, 26 August 2026.] Was [DECISION REQUIRED]. The options and their consequences are left standing below so the solicitor can see what was weighed.',
      'Decided: option (c) — add the net/gross field to pricingBlock and render per division: inclusive on /press, labelled-exclusive on /design and /digital.',
      'Not implemented. This records the decision only. The rendering change is M-P2-3, a build task, and remains NOT BUILT — so both audiences still fail today, and the [TK] above stays open until it ships. The second-order point below is unaffected and still open: if the company is not VAT-registered there is no VAT to state and the correct label is different again.',
    ]],
    ['6', 'Enquiries', 'Electronic Commerce (EC Directive) Regulations 2002 regs. 9 and 11; Consumer Rights Act 2015 s. 50', [
      'Submitting an enquiry does not create a contract. It is an invitation for us to respond.',
      'Our response commitment: we will reply as soon as we can, and always by the end of the next business day. Business days are Monday to Friday excluding England and Wales bank holidays.',
      '[TK — business days is referred to here and the companyDetails.businessHours field is never populated (OQ-17). Either populate it or state the hours in this clause.]',
    ]],
    ['7', 'Accuracy', 'Consumer Rights Act 2015 s. 50; Digital Markets, Competition and Consumers Act 2024 s. 230', [
      'We take care to keep information on this site accurate and current, but we do not warrant that it is complete or error-free. Pricing, availability and service descriptions may change.',
      'Where content is marked as indicative, illustrative or placeholder, it should not be relied on.',
      '[TK] — this clause cannot do the work being asked of it. 01-FACTUAL-INVENTORY.md §6.5 records that [SEED] content is live on the running site today: case-study metrics render as [SEED] 00%, selected work is [SEED]-prefixed, team members are [SEED] Placeholder Name, prices are £0,000. Under L-CRA-50 each of those is a written statement about the trader or the service which a consumer may take into account, and a disclaimer does not undo it. The mitigation is check:launch-content, which refuses a production dataset carrying [SEED] markers — a build gate, not a term. This clause must not be relied on as the answer to seed content.',
    ]],
    ['8', 'Availability', 'NO LEDGER ENTRY — no statutory obligation governs uptime for a free marketing website. For consumers it is read subject to clause 11 and the CRA 2015.', [
      'We aim to keep the site available but do not guarantee uninterrupted access. We may suspend, withdraw or change any part of it without notice.',
    ]],
    ['9', 'Links', 'Digital Markets, Competition and Consumers Act 2024 Sch. 20 para. 13', [
      'Links to other websites are provided for convenience. We have no control over their content and accept no responsibility for it.',
      'Where we link to a retailer to allow you to verify a published book, we receive no commission. Those links exist so you can check our work independently.',
    ]],
    ['10', 'Your conduct', 'UK GDPR Art. 32', [
      'You must not misuse this site — no attempts to gain unauthorised access, no malicious code, no denial of service, no automated scraping, and no submission of false information through our forms.',
    ]],
    ['11', 'Liability', 'Unfair Contract Terms Act 1977 s. 2, s. 3 and s. 11; Consumer Rights Act 2015 s. 49 and s. 57', [
      'Nothing in these terms limits our liability for death or personal injury caused by negligence, for fraud or fraudulent misrepresentation, or for anything else that cannot lawfully be limited.',
      'If you are a business user, and subject to the paragraph above, we exclude liability for loss arising from use of this site, including loss of profit, business, data or goodwill, and any indirect or consequential loss.',
      'That exclusion is subject to the Unfair Contract Terms Act 1977. Section 2(1) makes an exclusion of liability for death or personal injury resulting from negligence ineffective, which is why the paragraph above it is not qualified. Section 2(2) subjects an exclusion of liability for any other loss or damage caused by negligence to the requirement of reasonableness. Section 3 subjects to the same requirement any term by which we exclude or restrict liability for our own breach where you deal on our written standard terms of business, and these terms are written standard terms of business.',
      'The reasonableness test is at section 11. Section 11(1) asks whether the term was a fair and reasonable one to be included having regard to the circumstances which were, or ought reasonably to have been, known to or in the contemplation of the parties when the contract was made. Section 11(5) places the burden of showing that a term satisfies the requirement on the party claiming that it does, which is us.',
      '[DECISION REQUIRED] — for the solicitor, added round 12: exclusion or cap? Section 11(5) puts the burden of justifying this term on us, and it is drafted as a total exclusion of business-user liability for site use. A total exclusion is the hardest form to defend under section 2(2), and the site is free, informational, and carries [SEED] content today (clause 7) — which is the factual matrix section 11(1) directs a court to. Options: (a) keep the exclusion and rely on the site being free; (b) recast it as a cap at a nominal sum, which is a restriction rather than an exclusion and engages the section 11(4) resources-and-insurance enquiry; (c) narrow it to specified heads of loss.',
      'Consequence of doing nothing: an unreasonable exclusion is ineffective in its entirety, so the exclusion that is hardest to defend is also the one that leaves us with nothing if it fails.',
      'If you are a consumer, nothing in these terms affects your statutory rights, and the exclusion in the paragraph above does not apply to you.',
    ]],
    ['12', 'Data protection', 'UK GDPR Art. 13; PECR reg. 6', [
      'See our Privacy Policy and Cookie Policy.',
    ]],
    ['12A', 'Data protection complaints', 'Data Protection Act 2018 s. 164A, in force 19 June 2026', [
      'Since 19 June 2026 we have been under a duty to facilitate the making of data protection complaints, to acknowledge receipt within 30 days, and to respond. The procedure is at Privacy Policy section 12.',
    ]],
    ['13', 'Changes', 'NO LEDGER ENTRY — unilateral variation of published website terms. For consumers it is assessed for fairness under CRA 2015 Part 2.', [
      'We may amend these terms. The version in force is the one published here at the time you use the site.',
    ]],
    ['14', 'Law and jurisdiction', 'NO LEDGER ENTRY — choice of law and jurisdiction, and the consumer protective jurisdiction rule.', [
      'These terms are governed by the law of England and Wales. The courts of England and Wales have exclusive jurisdiction, save that if you are a consumer resident elsewhere in the UK you may bring proceedings in your own jurisdiction.',
    ]],
    ['15', 'Accessibility', 'Equality Act 2010 s. 20 and s. 29', [
      'We have a duty under the Equality Act 2010 to make reasonable adjustments, and that duty is anticipatory — it is owed to disabled people generally, not only to someone who asks. Our current position, including what has and has not been tested, is set out in our Accessibility Statement.',
    ]],
  ],
);

// ---------------------------------------------------------------------------
// docs/_legal/MSA-BUSINESS.md — version 1.4
// ---------------------------------------------------------------------------

const businessClientTerms = doc(
  'business-client-terms',
  { version: '1.4', revised: '2026-08-29' },
  'Client Terms — Business Clients',
  'This agreement governs business clients. If you are a company, a partnership, a sole trader or anyone else engaging Gridsmith Ltd for the purposes of a trade, business, craft or profession, these are your terms. It does not govern consumers. If you are an individual buying for purposes outside your trade, business, craft or profession — which includes most individual authors and almost all memoir and legacy clients of Gridsmith Press — these are not your terms. Yours are the Client Terms for Consumers. Several clauses here, the liability cap at 11.3 in particular, would not bind you: section 57 of the Consumer Rights Act 2015 makes a term not binding on a consumer to the extent it would exclude or restrict liability under sections 49 or 50. This draft has not been reviewed by a solicitor.',
  [
    ['1', 'Parties and structure', 'Companies Act 2006 s. 82; Companies (Trading Disclosures) Regulations 2015 reg. 25', [
      '1.1 This agreement is between Gridsmith Ltd (company number [TK], registered office [TK]) and the client named in the Scope.',
      '1.2 Gridsmith Ltd trades as Gridsmith Design, Gridsmith Digital and Gridsmith Press. These are trading divisions of one company, not separate legal entities. Whichever division delivers the work, the contracting party is Gridsmith Ltd.',
      '1.3 Gridsmith may use affiliated production teams and subcontractors to deliver. Gridsmith remains responsible to the client for all work, and remains the client’s sole point of contract.',
    ]],
    ['2', 'Structure of the agreement', 'NO LEDGER ENTRY — order of precedence between contract documents is a drafting convention.', [
      '2.1 The agreement comprises: this MSA · the Division Schedule for the relevant service · the signed Scope · any signed Change Order.',
      '2.2 Order of precedence where terms conflict: signed Change Order → signed Scope → Division Schedule → this MSA.',
    ]],
    ['3', 'The Scope', 'NO LEDGER ENTRY — scope definition and the exclusions rule are commercial terms.', [
      '3.1 No work begins until a written Scope is agreed and the initial payment received (canonical process stage 3).',
      '3.2 The Scope states: deliverables · timeline · price and payment schedule · revision rounds included · client responsibilities and time commitment · assumptions · exclusions.',
      '3.3 Anything not stated in the Scope is not included. Exclusions are listed for clarity and the absence of an item from the exclusions list does not imply inclusion.',
    ]],
    ['4', 'Changes', 'NO LEDGER ENTRY — change control is a commercial term.', [
      '4.1 Changes to scope require a written Change Order stating the change, the price effect and the timeline effect.',
      '4.2 Gridsmith is not obliged to perform work outside the Scope. Where it agrees to, the Change Order governs.',
      '4.3 Where a client delay or a change to client-supplied materials causes rework, that rework is chargeable.',
    ]],
    ['5', 'Client responsibilities', 'NO LEDGER ENTRY — client obligations, and the IP warranty and indemnity at 5.2, are commercial terms. 5.2 must never be applied to a consumer in this form.', [
      '5.1 The client will provide materials, information, access, approvals and feedback within the timescales in the Scope.',
      '5.2 The client warrants that materials it supplies do not infringe third-party rights, and indemnifies Gridsmith against claims that they do.',
      '5.3 Where the client does not meet its time commitments, timelines extend accordingly. Gridsmith will notify the client where a delay affects the schedule.',
      '5.4 Where a project is suspended by client inaction for more than 30 days, Gridsmith may invoice work completed to date and reschedule remaining work subject to availability.',
    ]],
    ['6', 'Fees and payment', 'SI 2002/2013 reg. 6(2); Late Payment of Commercial Debts (Interest) Act 1998 ss. 5A(2) and 5A(2A); SI 2002/1675 art. 4', [
      '6.1 Fees are as stated in the Scope, exclusive of VAT.',
      '6.2 Standard payment structure: an initial payment before work begins, staged payments at agreed milestones, and the balance on delivery. The Scope states the actual split.',
      '6.3 Invoices are payable within 14 days unless the Scope states otherwise.',
      '6.4 Late payment. Gridsmith may charge statutory interest and compensation under the Late Payment of Commercial Debts (Interest) Act 1998. Statutory interest runs at 8% per annum above the Bank of England official dealing rate, that rate being the one in force on 30 June (for interest that starts to run between 1 July and 31 December) or 31 December (for interest that starts to run between 1 January and 30 June) immediately before the day the interest starts to run, as set by article 4 of the Late Payment of Commercial Debts (Rate of Interest) (No. 3) Order 2002. In addition, Gridsmith is entitled to the fixed sum under section 5A(2) of that Act appropriate to the debt — £40 for a debt under £1,000, £70 for a debt of £1,000 or more but under £10,000, and £100 for a debt of £10,000 or more — and, under section 5A(2A), to any reasonable costs of recovering the debt to the extent they exceed that fixed sum.',
      '6.5 Gridsmith may suspend work where an invoice is more than 14 days overdue, having given 7 days’ written notice.',
      '6.6 Expenses (stock imagery, fonts, third-party licences, print, ISBNs, hosting) are charged at cost where identified in the Scope, and require written approval where not.',
      '6.7 Prices displayed on the website. Prices shown on gridsmith.uk are indicative and are not an offer. [TK — the VAT treatment sentence, once the decision at WEBSITE-TERMS.md clause 5A is taken. Today no price on the site states any VAT treatment, which fails SI 2002/2013 reg. 6(2) for Design and Digital as well as for Press.]',
    ]],
    ['7', 'Delivery and acceptance', 'Unfair Contract Terms Act 1977 s. 3 and s. 13 — 7.4 is a time bar on a remedy and is assessed as an exclusion. The same mechanism applied to a consumer would be assessed under CRA 2015 Part 2 and is likely to fail.', [
      '7.1 Gridsmith will deliver in accordance with the Scope.',
      '7.2 The client has 10 working days from delivery to notify Gridsmith in writing of any respect in which deliverables do not conform to the Scope.',
      '7.3 Where a valid non-conformity is notified, Gridsmith will correct it at no charge.',
      '7.4 If no notice is given within 10 working days, or the client puts the deliverables into use, they are deemed accepted. Section 13(1) of the Unfair Contract Terms Act 1977 applies section 3 to a term which makes a liability or its enforcement subject to restrictive or onerous conditions, or which excludes or restricts a remedy or a rule of evidence, so this clause and clause 11.5 are both subject to the requirement of reasonableness where the client deals on these written standard terms.',
      '7.5 Revisions beyond the number stated in the Scope are chargeable at the rate stated in the Scope.',
    ]],
    ['8', 'Intellectual property', 'Copyright, Designs and Patents Act 1988 s. 90(3) and s. 91', [
      '8.1 Client materials remain the client’s property throughout.',
      '8.2 Background IP — tools, frameworks, methods and components Gridsmith owned before the engagement or developed independently — remains Gridsmith’s. Gridsmith grants a perpetual, non-exclusive, royalty-free licence to use it as embedded in the deliverables.',
      '8.3 Deliverables. On payment in full, Gridsmith assigns to the client, with full title guarantee, all copyright and other intellectual property rights in the final approved deliverables. This assignment is made in writing and signed by or on behalf of Gridsmith, and takes effect on receipt of final payment. Where a deliverable does not exist when this agreement is signed, this clause is an agreement in relation to future copyright within the meaning of section 91 of the Copyright, Designs and Patents Act 1988, made and signed by Gridsmith as prospective owner, so that the copyright vests in the client on coming into existence without any further act of assignment. Where a deliverable already exists, the assignment is made in writing and signed as section 90(3) of that Act requires.',
      '8.4 Until payment in full, the client has a licence to use the deliverables for review and approval only.',
      '8.5 Division-specific IP terms are in the relevant Division Schedule and prevail over this clause 8 where they differ.',
      '8.6 Portfolio licence. Gridsmith may display the work in its portfolio and marketing, and may name the client, unless the Scope records that the client has opted out. Gridsmith will not disclose confidential information in doing so. The client may withdraw this permission on written notice, and Gridsmith will remove the work within 30 days.',
    ]],
    ['9', 'Confidentiality', 'NO LEDGER ENTRY — mutual confidentiality is a commercial term.', [
      '9.1 Each party will keep the other’s confidential information confidential, use it only for the purposes of the agreement, and protect it with at least reasonable care.',
      '9.2 This does not apply to information that is public, already known, independently developed, or required to be disclosed by law.',
      '9.3 These obligations continue for 3 years after the agreement ends.',
    ]],
    ['10', 'Data protection', 'UK GDPR Art. 28; Art. 44A–49; Data Protection Act 2018 s. 164A', [
      '10.1 Where Gridsmith processes personal data on the client’s behalf, the client is controller and Gridsmith is processor, and the parties will enter a data processing agreement in the form at Schedule DP.',
      '10.2 Each party will comply with applicable data protection law.',
      '10.3 Sub-processors. Where Gridsmith engages a sub-processor to process the client’s personal data, it will do so under a written contract imposing the Art. 28(3) obligations, and will inform the client of intended additions or replacements so the client may object.',
      '10.4 International transfers. Where processing under this agreement involves a transfer of personal data outside the United Kingdom, that transfer is made only where approved by regulations under UK GDPR Art. 45A, or subject to appropriate safeguards under Art. 46, or within an Art. 49 derogation, applying the Art. 45B data protection test.',
      '10.5 Data protection complaints. A complaint about Gridsmith’s handling of personal data may be made under the procedure in the Privacy Policy, which Gridsmith is required to operate under DPA 2018 s. 164A.',
    ]],
    ['11', 'Liability', 'Unfair Contract Terms Act 1977 s. 2, s. 3, s. 11 and Sch. 2; Consumer Rights Act 2015 s. 57', [
      '11.1 Nothing limits liability for death or personal injury caused by negligence, fraud, or anything else that cannot lawfully be limited.',
      '11.2 Subject to 11.1, neither party is liable for indirect or consequential loss, loss of profit, revenue, business, anticipated savings, data or goodwill.',
      '11.3 Subject to 11.1, Gridsmith’s total aggregate liability under the agreement is limited to the greater of (a) the total fees paid under the relevant Scope and (b) £[TK].',
      '11.4 Gridsmith maintains professional indemnity insurance of £[TK]. Evidence available on request.',
      '11.5 Claims must be notified within 12 months of the client becoming aware of the circumstances giving rise to them.',
      '11.6 Unfair Contract Terms Act 1977 — which provisions apply. Section 2(1) makes an exclusion or restriction of business liability for death or personal injury resulting from negligence ineffective, and no contract term or notice can defeat it. That is why 11.1 is unqualified rather than a concession. Section 2(2) subjects an exclusion or restriction of liability for any other loss or damage caused by negligence to the requirement of reasonableness. Section 3 applies where the client deals on Gridsmith’s written standard terms of business, and subjects to the same requirement any term by which Gridsmith excludes or restricts liability for its own breach, or claims to be entitled to render a contractual performance substantially different from that which was reasonably expected of it, or to render no performance at all. This agreement is Gridsmith’s written standard terms of business unless the Scope records that its terms were individually negotiated, so section 3 applies to 11.2, 11.3, 11.5, 7.4 and 12.3.',
      '11.7 The reasonableness test. Section 11(1) asks whether the term was a fair and reasonable one to be included having regard to the circumstances which were, or ought reasonably to have been, known to or in the contemplation of the parties when the contract was made — as at contract date, not with hindsight from the loss. Section 11(4) provides that where a term restricts liability to a specified sum of money, regard is to be had in particular to the resources which Gridsmith could expect to be available to it for the purpose of meeting the liability should it arise, and to how far it was open to Gridsmith to cover itself by insurance. Section 11(5) places the burden of showing that a term satisfies the requirement of reasonableness on the party claiming that it does, which is Gridsmith.',
      '11.8 The cap and the insurance are one question, not two. Section 11(4)(b) directs attention to the professional indemnity cover at 11.4 when testing the cap at 11.3, so a cap set materially below the cover actually available is harder to defend than one set at it.',
      'For solicitor review: 11.3 must satisfy the UCTA 1977 reasonableness test, which 11.7 now states and 11.6 now routes. The statute is no longer the open question; its application is. A cap at fees paid may be unreasonable for a high-consequence deliverable such as an engineering drawing set used in construction, and a differentiated cap by division may be more defensible than a single figure. Please also settle the three points the statute does not answer: (i) whether Schedule 2’s guidelines are applied by analogy to a s. 3 case, which is authority and not statute; (ii) how far Schedule 1 para. 1(c) removes clause 11 from ss. 2 and 3 given clause 8; (iii) whether Schedule A3 defines the duty or excludes it — see the note there. [TK — both figures at 11.3 and 11.4 are owner items, and s. 11(4)(b) makes them one decision rather than two. The test cannot be applied to either until both exist.]',
    ]],
    ['12', 'Warranties', 'Unfair Contract Terms Act 1977 s. 3 — see 11.6. CRA 2015 ss. 49 and 57 make 12.3 void against a consumer.', [
      '12.1 Gridsmith warrants it will perform with reasonable care and skill, in accordance with good industry practice.',
      '12.2 Gridsmith warrants the deliverables will conform to the Scope in all material respects for 30 days from acceptance.',
      '12.3 Except as stated, all warranties implied by law are excluded to the extent permitted. Where the client deals on these written standard terms of business, that exclusion is subject to the requirement of reasonableness under section 3 of the Unfair Contract Terms Act 1977, and the burden of showing it reasonable is Gridsmith’s under section 11(5).',
      '12.4 Gridsmith does not warrant any commercial outcome. No representation is made about sales, revenue, rankings, traffic, audience or any other result.',
    ]],
    ['13', 'Term and termination', 'NO LEDGER ENTRY — termination is a commercial term.', [
      '13.1 The agreement runs until the Scope is completed, or until terminated.',
      '13.2 Either party may terminate on 30 days’ written notice.',
      '13.3 Either party may terminate immediately on material breach not remedied within 14 days of notice, or on insolvency.',
      '13.4 On termination, the client pays for all work completed and all committed third-party costs. Deliverables paid for in full are assigned under clause 8.3. Work not paid for is not licensed.',
      '13.5 Retainer and recurring services may be terminated on the notice period stated in the relevant Schedule.',
    ]],
    ['14', 'General', 'NO LEDGER ENTRY — boilerplate. 14.7 has a consumer counterpart which is deliberately non-exclusive.', [
      '14.1 Neither party is liable for failure caused by events beyond its reasonable control.',
      '14.2 Neither party may assign without the other’s written consent, except to a successor of its business.',
      '14.3 Nothing creates a partnership, joint venture or employment relationship.',
      '14.4 No third party may enforce this agreement under the Contracts (Rights of Third Parties) Act 1999.',
      '14.5 The agreement is the entire agreement between the parties on its subject matter.',
      '14.6 Variations must be in writing and signed.',
      '14.7 Governed by the law of England and Wales, with exclusive jurisdiction of the courts of England and Wales.',
    ]],
    ['15', 'Contracting by electronic means', 'Electronic Commerce (EC Directive) Regulations 2002 regs. 9 and 11', [
      '15.1 Where this agreement or any Scope or Change Order is concluded by electronic means, the parties, being neither of them a consumer, agree that regulations 9(1), 9(2) and 11(1) of the Electronic Commerce (EC Directive) Regulations 2002 do not apply. Regulation 9(3) — under which Gridsmith makes these terms available in a form the client can store and reproduce — continues to apply and is not excluded.',
      '15.2 Where this agreement, a Scope or a Change Order is concluded exclusively by exchange of electronic mail or by equivalent individual communications, regulations 9(1), 9(2) and 11(1) do not apply in any event, by operation of regulations 9(4) and 11(3). Clause 15.1 is agreed for the avoidance of doubt and does not imply that those regulations would otherwise bite.',
      '15.3 Gridsmith will nonetheless acknowledge receipt of any order placed electronically without undue delay, and will make the concluded agreement available to the client.',
    ]],
    ['16', 'Marketing', 'PECR reg. 22; PECR reg. 23', [
      '16.1 Where the client is a corporate subscriber, PECR reg. 22 does not restrict Gridsmith sending it marketing electronic mail. PECR reg. 23 applies regardless, and Gridsmith will accordingly, in every marketing message: not disguise or conceal the identity of the person on whose behalf it is sent; provide a valid address to which a request that such communications cease may be sent; and stop on request.',
      '16.2 Where an individual at the client is an individual subscriber — including a sole trader using a personal address — Gridsmith will send marketing electronic mail only with consent, or where the PECR reg. 22(3) soft opt-in conditions are met, and will give a simple free means of refusing in every message.',
    ]],
    ['A', 'Schedule A — Gridsmith Design', 'A2 standards are [TK]. A3 engages Unfair Contract Terms Act 1977 s. 13(1) — a duty-defining clause rather than an exclusion, and the boundary is for the solicitor.', [
      'A1 Deliverables. As stated in the Scope, itemised by asset or by drawing sheet.',
      'A2 Standards. Technical work is produced to the standards named in the Scope (for example BS 8888, BS EN ISO 128, relevant Eurocodes, RIBA Plan of Work stages). Where no standard is named, Gridsmith works to good industry practice.',
      'A3 Checking. Technical deliverables are subject to Gridsmith’s internal checking process before issue. This does not replace the client’s own design check, verification, or professional sign-off. The client remains responsible for verifying that deliverables are fit for its intended purpose.',
      '[DECISION REQUIRED] — for the solicitor, added round 12: does A3 define the duty Gridsmith undertakes, or exclude one it would otherwise owe? Section 13(1) of UCTA brings within section 2 a term which excludes or restricts the relevant obligation or duty, so if A3 falls the wrong side of that line it is subject to the section 2(2) reasonableness test rather than being a description of what was sold — and under section 11(5) the burden of showing it reasonable would be Gridsmith’s. Gridsmith produces drawings; it is not taking on design liability for the client’s engineering decisions. That distinction must be watertight and the PI insurance at 11.4 must match it.]',
      'A4 IP. On payment in full, final approved deliverables are assigned under clause 8.3. Working files, rejected concepts and source assets remain Gridsmith’s unless the Scope provides for their transfer.',
      'A5 Revisions. The Scope states the number of revision rounds. Further revisions are chargeable.',
      'A6 Design Desk retainer. Monthly fee, stated hours, stated turnaround SLA, stated rollover policy. Minimum term and notice period as stated. Unused hours do not carry beyond the stated rollover.',
    ]],
    ['B', 'Schedule B — Gridsmith Digital', 'NO LEDGER ENTRY — division schedule. B1 is assignment under clause 8.', [
      'B1 Ownership. On payment in full, the client owns: (a) the source code written for the project, assigned under clause 8.3; (b) all data in the systems built; (c) the accounts and infrastructure, or full administrative access to them.',
      'B2 Handover. On final payment Gridsmith transfers repository ownership, infrastructure access, environment variables (excluding Gridsmith’s own credentials), and documentation.',
      'B3 Third-party components. Deliverables include open-source and third-party components licensed under their own terms. Ownership under B1 does not extend to these. The Scope lists material third-party dependencies and any recurring licence costs.',
      'B4 Background IP. Gridsmith’s reusable frameworks and components are licensed under clause 8.2, not assigned. The Scope identifies where they are used.',
      'B5 Warranty. Gridsmith will correct defects notified within 90 days of acceptance at no charge, where the defect is a failure to conform to the Scope. This does not cover changes in third-party services, changes made by others, or new requirements.',
      'B6 Care Plan. Monthly fee, stated response and resolution SLAs, stated included hours, stated exclusions. Minimum term and notice period as stated.',
      'B7 No outcome warranty. Gridsmith does not warrant search rankings, traffic, conversion rates or commercial performance.',
    ]],
    ['C', 'Schedule C — Gridsmith Press', 'C7 UK GDPR Art. 6; C9 flagged against CRA 2015 s. 57; C10 DMCCA 2024 Sch. 20 para. 13', [
      'C1 Rights. The author retains 100% of the copyright in the work at all times. Gridsmith acquires no ownership interest in the manuscript, the finished book, or any derivative.',
      'C2 Royalties. The author receives 100% of royalties and sales income. Gridsmith takes no royalty, no commission on sales, and no share of income. Gridsmith is paid only the fees stated in the Scope.',
      'C3 Licence. The author grants Gridsmith a limited, non-exclusive, revocable licence to reproduce and adapt the work solely to produce the deliverables. It terminates on delivery, except for the portfolio licence at C7.',
      'C4 Deliverables. Cover design, interior design and typesetting produced by Gridsmith are assigned to the author on payment in full under clause 8.3.',
      'C5 Distribution. Where the Scope includes distribution setup, Gridsmith will prepare and submit the title to the platforms named in the Scope, to each platform’s current technical and content specifications. All publishing and retail accounts are established in the author’s name and under the author’s sole control. Gridsmith does not hold, operate or receive income through any account in its own name on the author’s behalf.',
      'C6 ISBN. The author is the publisher of record. The ISBN is registered to the author, not to Gridsmith, and Gridsmith operates no imprint. Where the Scope includes it, Gridsmith will assist the author in obtaining their own ISBN from the relevant national agency and in completing the associated metadata registration. The ISBN, and the publisher record attached to it, belong to the author permanently and are unaffected by the end of this agreement.',
      'C6.1 Platform compliance. Where the Scope names distribution platforms, Gridsmith will produce files meeting each platform’s published specification at the time of submission (trim sizes, bleed, spine calculation, cover template, colour profile, file format, metadata fields, category and keyword requirements). Platform specifications change; Gridsmith warrants compliance at the date of submission, not indefinitely.',
      'C6.2 Marketing. Book marketing is a separate service with its own Scope and fee. It is not included in any publishing package unless expressly stated. Clause C10 applies to it in full.',
      'C7 Portfolio. Gridsmith may display the published title in its portfolio and link to retail listings. Written author consent is obtained before any title is displayed and may be withdrawn on notice.',
      'C8 Editorial. Gridsmith advises; the author decides. Final content is the author’s, and the author is responsible for the accuracy and legality of the text.',
      'C9 Author warranties. The author warrants that the work is original, does not infringe copyright, is not defamatory, does not breach confidence or privacy, and does not contain unlawful material — and indemnifies Gridsmith accordingly.',
      'C10 No outcome warranty. Gridsmith makes no representation about sales, rankings, reviews, bestseller status or income — in respect of publishing services or marketing services. Services are supplied; commercial outcomes are not promised. This applies to marketing engagements without exception.',
      'C11 Revisions. The Scope states the revision rounds included. Further rounds are chargeable at the rate stated.',
      'C12 Content Programme. Monthly fee, stated output, stated turnaround, stated revision rounds, stated exclusions, minimum term and notice period.',
    ]],
    ['DP', 'Schedule DP — Data Processing', 'UK GDPR Art. 28; Art. 44A–49', [
      'To be drafted where Gridsmith processes personal data on the client’s behalf. Must cover: subject matter and duration · nature and purpose · types of data and categories of data subject · controller instructions · confidentiality · security measures · sub-processors and authorisation · assistance with data subject rights · breach notification · deletion or return on termination · audit rights · international transfers and the mechanism relied on.',
    ]],
  ],
);

// ---------------------------------------------------------------------------
// docs/_legal/CONSUMER-TERMS.md — version 1.3
// ---------------------------------------------------------------------------

const consumerClientTerms = doc(
  'consumer-client-terms',
  { version: '1.3', revised: '2026-08-26' },
  'Client Terms — Consumers',
  'These terms govern consumers — individuals buying for purposes outside their trade, business, craft or profession. In practice that is most individual authors and almost all memoir and legacy clients of Gridsmith Press. They do not govern business clients. If you are engaging us for a company, a partnership or your own trade or profession, these are not your terms — yours are the Client Terms for Business Clients. If you are not sure which you are, the Client Terms page sets out the difference and links to both. This draft has not been reviewed by a solicitor.',
  [
    ['1', 'Who we are', 'Companies (Trading Disclosures) Regulations 2015 reg. 24 and reg. 25; Electronic Commerce (EC Directive) Regulations 2002 reg. 6; CCR 2013 Sch. 2', [
      'Gridsmith Ltd, company number [TK], registered office [TK], trading as Gridsmith Press. Contact: [TK email] · [TK phone].',
    ]],
    ['2', 'Your statutory rights', 'Consumer Rights Act 2015 s. 49, s. 51, s. 52 and s. 57', [
      'Nothing in these terms affects your rights under the Consumer Rights Act 2015, the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, or any other consumer protection law.',
      'Under the Consumer Rights Act 2015 we must provide our services with reasonable care and skill, within a reasonable time, and at a reasonable price where none has been agreed. We cannot and do not exclude that.',
      'If we do not, you are entitled to ask us to perform the service again, or to a price reduction, depending on the circumstances.',
    ]],
    ['3', 'Before you order', 'CCR 2013 reg. 13 with Sch. 2; reg. 16; DMCCA 2024 s. 230', [
      'Before you place an order we will give you, in writing:',
      'a description of the services;',
      'the total price, including VAT and all charges — no fee will be introduced later that was not disclosed here;',
      'how and when you pay;',
      'how long the work will take;',
      'the number of revision rounds included, and the cost of further rounds;',
      'what is not included;',
      'your cancellation rights (§5 and §6);',
      'where you will not have a right to cancel at all, or could lose it, and in what circumstances — see §5A, §6(d) and §6A;',
      'where your order includes printed copies: that you will have to bear the cost of returning them if you cancel, and, where they cannot normally be returned by post, what that cost is; and a reminder that we are under a legal duty to supply goods that are in conformity with the contract;',
      'that if you ask us to start early and then cancel, you will be liable to pay us the reasonable costs described at §6(c);',
      'our complaints procedure (section 12);',
      'the model cancellation form, which is at the end of these terms;',
      'that where the contract is concluded electronically, we will confirm your order on a durable medium.',
    ]],
    ['4', 'The contract', 'Electronic Commerce (EC Directive) Regulations 2002 regs. 9, 11 and 12; CCR 2013 reg. 14 and reg. 16; Consumer Rights Act 2015 s. 50', [
      'The contract is formed when we confirm your order in writing. Before that point, a quotation or estimate is not binding on either of us.',
      'Any estimate produced by a tool on our website is indicative only and does not form part of the contract.',
      '[TK — no such tool exists. 01-FACTUAL-INVENTORY.md §7 records the Press Path Finder and every estimator as NOT BUILT. This sentence must go, or the tools must ship.]',
      '4.1 Ordering online. Where you place an order through our website: we will tell you the technical steps to conclude the contract, whether the concluded contract will be filed and whether it will be accessible, the technical means to identify and correct input errors before you order, and the languages the contract may be concluded in; any button that places you under an obligation to pay will be labelled unambiguously to say so; we will acknowledge your order without undue delay and confirm it on a durable medium.',
    ]],
    ['5', 'Your right to cancel', 'CCR 2013 regs. 27–35', [
      '5A Which contracts this right applies to, and what happens if yours is not one of them. The cancellation right in this section and in section 6 is given by the Consumer Contracts Regulations 2013, and those Regulations give it for two kinds of contract only:',
      'a distance contract — one agreed entirely at a distance, without us being in the same place at the same time: by email, by phone, through our website, or by post. In the ordinary case this is the contract you have with us, because that is how we work;',
      'an off-premises contract — one agreed while we were physically together somewhere that is not our own business premises. If we met you at home, or at a venue, and you signed there, this is yours. Some of §6 works differently for these — see §6(a).',
      'If your contract is neither — the Regulations call that an on-premises contract, meaning one agreed while we were physically together at our own business premises — then the Consumer Contracts Regulations give you no right to cancel, and §5 and §6 do not apply to you. Everything else in these terms still does, including your Consumer Rights Act 2015 rights at §2 and your right to end the contract under §14.2. We will tell you, before you order, which kind of contract yours is and whether you have a cancellation right, and we will not leave you to work it out from this page.',
      '5.0 How long you have, and it depends on what we are supplying.',
      'Services only — writing, editing, design, production work, and anything else in these terms that is work rather than a physical thing: the cancellation period ends 14 days after the day the contract is made.',
      'Printed copies, or any other physical goods — the period ends 14 days after the day the goods come into your physical possession (or the possession of someone other than the carrier whom you named to receive them). This is later than the services date, and often much later.',
      'If copies arrive on different days — because you ordered more than one thing, or because a single order is split across consignments — the period runs from the last delivery.',
      'If your order includes both work and printed copies, the Regulations treat the whole contract as a contract for goods. The single period for everything in it runs from delivery of the copies, on the rules just above — not from the day the contract was made.',
      'Anything we supply to you as a file rather than as a service or a physical thing — see section 6A, which is a different regime again.',
      'To cancel, tell us clearly — email [TK email] or write to us. You may use the model cancellation form at the end of these terms, but you do not have to.',
      'If you cancel, we will refund all payments received from you within 14 days of being told, using the same payment method, at no charge to you. Where the contract included printed copies, §5.3 sets out how that works.',
      '5.1 If we did not tell you about your cancellation right. If we failed to give you the cancellation information required by regulation 13 before you were bound, your cancellation period is extended — by up to 12 months.',
      '5.2 How you tell us, and when it counts. Any clear statement that you are cancelling is enough — the model form is offered for convenience and you never have to use it. If you send us your cancellation before the period ends, it is in time, even if it reaches us afterwards.',
      '5.3 Refunds, and what we may deduct. We refund everything you paid, and we never charge a fee for refunding you. Two qualifications, both from the Regulations:',
      'Delivery charges. If your order included delivery and you chose a more expensive kind than the cheapest standard delivery we offer, we refund the cheaper amount, not what you actually paid for delivery.',
      'Printed copies you have handled. If you return copies whose value has been reduced by handling going beyond what was necessary to see what they are, we may recover that reduction, up to the price — but not if we failed to give you the cancellation information at all, in which case we recover nothing.',
      'Where you are returning printed copies and we have not offered to collect them, our 14 days for refunding you run from when we get the copies back, or from when you show us you have sent them, whichever is sooner. In every other case they run from the day you told us you were cancelling.',
      '5.4 Returning printed copies. If you cancel after copies have reached you, send them back within 14 days of telling us. You pay the direct cost of returning them, and nothing else — unless we agreed to bear it, or unless we failed to tell you before you ordered that it would be yours to bear, in which case we bear it. If we offered to collect the copies, collection is ours to arrange and you pay nothing for it unless you agreed to.',
      '5.5 Other contracts that end with this one. If you cancel, any ancillary contract ends automatically at the same time, at no cost to you beyond the amounts §5.3, §5.4 and §6(c) describe. An ancillary contract is one for goods or services related to this one, supplied either by us or by someone else under an arrangement with us. Where a third party is involved, we tell them — that is our job, not yours.',
    ]],
    ['6', 'If you want us to start within the 14 days', 'CCR 2013 reg. 36', [
      'This section matters and we will draw your attention to it before you order.',
      'It applies only where §5A gives you a cancellation right. If your contract is an on-premises contract, there is nothing here for us to protect and nothing here for you to lose — we simply start when you ask us to. This section is about services; if we are supplying you a file rather than performing work, §6A applies instead and its rules are different.',
      'We know most people want work to begin promptly. But if we start during the cancellation period, the law requires us to make sure you understand what that means.',
      'If you ask us to begin during the cancellation period:',
      '(a) you must ask us expressly, and how you ask depends on which contract you have. Distance contract — you ask by ticking the specific box on the order confirmation. It is a separate box from accepting these terms, and we will not tick it for you. Off-premises contract — the law requires more, and it is for your protection: your request must be made on a durable medium. In practice that means on paper, or by email — something addressed to you, that you can keep, and that cannot be altered afterwards. A tick on a screen, a verbal yes, or a note we make ourselves is not enough, and if that is all we took, then in law you never made a request under this paragraph at all — with the consequence at (e). We will give you the request in the required form and keep a copy. Working out which form applies is our job, not yours.',
      '(a1) NEW (added round 8; mislabelled REVISED there — it has no predecessor) — and you must acknowledge, in the same step, that you will lose your right to cancel once we have fully performed the service. This is a second, separate confirmation from the request in (a). We will set it out in those words and we will not tick it for you either. If you have not given it, (d) below does not apply to you and you keep your right to cancel.',
      '(b) you still keep your right to cancel during the 14 days;',
      '(c) but if you cancel after we have started, you must pay a proportionate amount for the work done up to the point you told us — for the period the service was supplied, ending when you told us you were cancelling, and in proportion to what has been supplied against the full coverage of the contract. It is calculated on the total price agreed; if that price is excessive, it is calculated on the market value of the service supplied, judged against what other traders charge for the equivalent;',
      '(d) you lose the right to cancel only where all three of these are true: the service has been fully performed within the 14 days, and performance began after your express request under (a), and it began with your acknowledgement under (a1). If any one of them is missing, you keep the right to cancel. We will tell you when we consider the service fully performed;',
      '(e) and you pay nothing at all for the service supplied in the cancellation period, in full or in part, if any of these is true: we failed to give you the cancellation information the law requires before you were bound; or we failed to give you the information about this payment that the law requires before you were bound; or we supplied the service without your express request under (a) — and that includes an off-premises contract where we took your request in any form other than a durable medium. A request that misses the form the law sets is not a request for this purpose, however clearly you said yes. In any of those cases (c) does not apply to you at all — not in part, not proportionately, not at cost. You owe nothing.',
      'If you do not ask us to start early, we will begin after the 14 days have passed.',
      'We will confirm all of this in your order confirmation email, in writing, before any work starts.',
    ]],
    ['6A', 'If we supply you a file rather than perform a service', 'CCR 2013 reg. 37 and reg. 38', [
      'Most of what we do for you is work, and §6 governs it. Occasionally what you are buying may be digital content — data produced and supplied to you in digital form, not on a disc or any other physical thing. The Regulations treat that as a third case, and the rules are not the same:',
      'we must not begin supplying it inside the cancellation period unless you have expressly consented and have acknowledged that you will lose your right to cancel;',
      'if you gave both, your right to cancel goes as soon as supply begins — not, as under §6(d), only once the work is finished;',
      'if either was missing, you pay nothing at all for what was supplied. The same applies if we failed to give you the confirmation the Regulations require.',
    ]],
    ['7', 'Price and payment', 'CCR 2013 reg. 40 and reg. 41; DMCCA 2024 s. 230; Consumer Rights Act 2015 s. 51 and s. 62 with Sch. 2 Pt. 1 para. 6', [
      '7.1 The total price is stated in your order confirmation and includes VAT where applicable.',
      '7.2 No charge will be added that was not disclosed before you ordered. If the work you want changes, we will tell you the new price in writing and you decide whether to proceed.',
      '7.3 Payment is as set out in the order confirmation — usually an initial payment and a balance on delivery.',
      '7.4 If a payment is late we may charge interest at [TK]% above the Bank of England base rate. This reflects our actual cost and is not a penalty.',
      '7.5 No charge you did not agree to. We will not add any payment beyond what you agreed unless you have expressly agreed to it. We will never use a pre-ticked box or a default option you have to turn off, and if we ever charged you that way you would be entitled to the money back.',
    ]],
    ['8', 'What we will do', 'Consumer Rights Act 2015 s. 49 and s. 52', [
      '8.1 We will provide the services described in your order confirmation, with reasonable care and skill.',
      '8.2 We will keep you informed and give you the opportunities to review your work that are set out in the confirmation.',
      '8.3 We will tell you promptly if anything will take longer than expected, and why.',
      '8.4 We advise; you decide. The book is yours. Where we recommend an editorial change and you disagree, your decision stands.',
    ]],
    ['9', 'What we need from you', 'NO LEDGER ENTRY — the consumer’s own obligations are commercial terms, and are deliberately softer than the business Schedule C9.', [
      '9.1 Your manuscript, materials, feedback and approvals within the timescales agreed.',
      '9.2 If you cannot meet a timescale, tell us — we will reschedule where we can. Long delays may affect availability and we will be honest with you about that.',
      '9.3 You confirm that the work is yours, that it does not copy anyone else’s work, that it is not defamatory, and that it does not contain unlawful material.',
    ]],
    ['10', 'Your rights in your book', 'Copyright, Designs and Patents Act 1988 s. 90(3) and s. 91; Consumer Rights Act 2015 s. 50; DMCCA 2024 Sch. 20 para. 13', [
      '10.1 You keep 100% of the copyright in your work. We never own any part of it.',
      '10.2 You keep 100% of all royalties and sales income. We take no royalty, no commission, and no share of your sales. We are paid only the fees in your order confirmation.',
      '10.3 The cover and interior design. On payment in full, Gridsmith assigns to you all copyright and other intellectual property rights in the cover and interior design we produce for your book. This assignment is made in writing and signed by or on behalf of Gridsmith, and takes effect on receipt of final payment. Where that design does not exist when these terms are agreed, this clause is an agreement in relation to future copyright within the meaning of section 91 of the Copyright, Designs and Patents Act 1988, made and signed by Gridsmith as prospective owner, so that the copyright vests in you on coming into existence without any further act of assignment. Where the design already exists, the assignment is made in writing and signed as section 90(3) of that Act requires.',
      '10.4 We use your manuscript only to produce your book. That permission ends when we deliver.',
      '10.5 Where we set up distribution, the accounts are in your name and under your control, so your royalties are paid to you directly. We never hold an account on your behalf and we never receive your sales income.',
      '10.6 You are the publisher. Your ISBN is registered to you, not to us. We do not run an imprint and we do not put our name on your book as publisher. Where it is part of your order, we will help you obtain your own ISBN and complete the registration — but it is yours, permanently, and it stays yours whatever happens between us.',
      '10.7 Platform standards. Where your order includes publishing to particular platforms — Amazon KDP, IngramSpark, Draft2Digital, Apple Books, Kobo or others — we prepare your files to each platform’s current specification, so they are accepted first time. Platform requirements change over time; we guarantee they meet the specification on the day we submit.',
      '10.8 We will only show your book in our portfolio if you give us written permission, and you can withdraw that permission at any time.',
    // `/press` cites this anchor. It predates the section-level numbering and must not move.
    ], 'clause-10-1'],
    ['11', 'What we do not promise', 'Consumer Rights Act 2015 s. 50; DMCCA 2024 Sch. 20 para. 13', [
      'We will produce your book to a professional standard. We do not and cannot promise how it will sell.',
      'This applies equally if you buy book marketing from us. Marketing is a separate service with its own price, and buying it does not come with any promise of sales, reviews, rankings or coverage.',
      'We make no promise about sales figures, income, reviews, rankings, bestseller status, media coverage or any other commercial outcome. Most independently published books sell modestly. Anyone who tells you otherwise is not being straight with you.',
    ]],
    ['12', 'If something goes wrong', 'CCR 2013 Sch. 2; DMCCA 2024 s. 230; Data Protection Act 2018 s. 164A', [
      'Complaints procedure.',
      'Tell us: [TK email], or call [TK phone].',
      'We will acknowledge within 5 working days.',
      'We will investigate and respond within [TK] working days, explaining what we found and what we propose.',
      'If you are not satisfied, we will tell you what you can do next.',
      'Your rights under the Consumer Rights Act 2015 apply regardless of this procedure. You may also be able to use [TK — alternative dispute resolution provider, if we join one].',
      '12.1 Complaints about how we handle your personal data follow a separate statutory procedure set out in our Privacy Policy section 12. We must acknowledge such a complaint within 30 days and respond without undue delay.',
      '[DECISION REQUIRED] — the acknowledgement and response times in §12. Version 1.0 promised acknowledgement within 5 working days and a substantive response within [TK] working days.',
      'Whatever is chosen must match PRIVACY-POLICY.md §12 and ACCESSIBILITY-STATEMENT.md §5. Three documents currently promise 5 working days independently, which is three sources of truth for one commitment.',
    ]],
    ['13', 'Our responsibility to you', 'Consumer Rights Act 2015 s. 49 and s. 57; Unfair Contract Terms Act 1977 s. 2', [
      '13.1 If we fail to comply with these terms, we are responsible for loss or damage you suffer that is a foreseeable result of our breaking the contract or failing to use reasonable care and skill.',
      '13.2 We do not limit our liability in any way that the law does not allow. That includes death or personal injury caused by our negligence, fraud, and breach of your statutory rights.',
      '13.3 We are not responsible for losses that were not foreseeable when the contract was made.',
    ]],
    ['14', 'Ending the contract', 'CCR 2013 reg. 29', [
      '14.1 Your 14-day cancellation right is at §5 and §6.',
      '14.2 After that, either of us may end the contract by written notice. You pay for work done up to that point; we refund anything paid for work not done.',
      '14.3 If we end the contract because of something you have done, you pay for work done. If we end it for our own reasons, we will refund you in full for work not delivered and help you find another provider.',
    ]],
    ['15', 'Personal data', 'UK GDPR Art. 13; PECR reg. 22 and reg. 23; Data Protection Act 2018 s. 164A', [
      'We handle your data as described in our Privacy Policy. We do not sell it, do not share it with advertisers, and do not use your manuscript for any purpose other than producing your book.',
      '15.1 Marketing. As an individual you are an individual subscriber under PECR reg. 22. We will not send you marketing email unless you have consented, or unless we obtained your details in the course of negotiating a sale to you and the marketing is of similar services — and in every case there will be a simple, free way to refuse in every message.',
      'Every marketing message will also say plainly who it is from, and will give you a valid address you can use to tell us to stop.',
    ]],
    ['16', 'General', 'NO LEDGER ENTRY — boilerplate. 16.4 is deliberately non-exclusive as to jurisdiction, unlike the business counterpart.', [
      '16.1 We may transfer this contract to another business, but your rights are unaffected and we will tell you.',
      '16.2 If a court finds part of these terms unlawful, the rest continues to apply.',
      '16.3 If we do not insist on something immediately, we can still do so later.',
      '16.4 These terms are governed by the law of England and Wales. If you live in Scotland or Northern Ireland, you may bring proceedings there.',
    ]],
    ['17', 'Model Cancellation Form', 'CCR 2013 reg. 29; Sch. 2 requires the model cancellation form to be provided with the pre-contract information', [
      'Complete and return this form only if you wish to withdraw from the contract.',
      'To: Gridsmith Ltd, [TK address], [TK email]',
      'I/We hereby give notice that I/We cancel my/our contract for the supply of the following service:',
      'Ordered on / received on: ____________________',
      'Name of consumer: ____________________',
      'Address of consumer: ____________________',
      'Signature (only if on paper): ____________________',
      'Date: ____________________',
    ]],
  ],
);

// ---------------------------------------------------------------------------
// docs/_legal/ACCESSIBILITY-STATEMENT.md — version 1.2
// ---------------------------------------------------------------------------

const accessibility = doc(
  'accessibility',
  { version: '1.3', revised: '2026-08-29' },
  'Accessibility Statement',
  'What this site commits to, what is known not to conform, and how to tell us when we have got it wrong. This draft has not been reviewed by a solicitor.',
  [
    ['1', 'Our commitment', 'Equality Act 2010 s. 29; s. 20 with Sch. 2 para. 2(2); s. 20(7)', [
      'Gridsmith Ltd is committed to making gridsmith.uk usable by as many people as possible, including people using screen readers, keyboard-only navigation, magnification, or reduced-motion settings.',
      'We treat accessibility as part of building the site properly, not as an adjustment made afterwards.',
      'Under the Equality Act 2010 s. 29 we must not discriminate in providing a service to the public, and under s. 20 with Schedule 2 we owe a duty to make reasonable adjustments. That duty is anticipatory: Sch. 2 para. 2(2) means it is owed to disabled people generally, not only to someone who asks. We are not entitled to charge anyone for the cost of complying with it.',
    ]],
    ['2', 'Conformance status', 'WCAG 2.2 (W3C Recommendation — adopted, not statutory); Equality Act 2010', [
      'What WCAG’s status actually is here, stated precisely because it is easy to get wrong. WCAG 2.2 is a W3C Recommendation — a technical specification, not law. It is not a statutory standard for a private-sector service in the United Kingdom: the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 bind public sector bodies, and Gridsmith Ltd is not one. Our legal duty is the Equality Act duty at section 1. WCAG 2.2 Level AA is the standard we have adopted as the benchmark by which reasonable steps are conventionally evidenced — a voluntary commitment whose value is evidential.',
      'Status: [TK] — and it cannot honestly be stated as "conformant" today.',
      '[TK — the reason, stated plainly: WCAG 2.2 Level AA conformance requires that all Level A and Level AA success criteria are satisfied. Automated tooling cannot establish that. The screen-reader pass has never happened (section 6), and six of our seven legal pages are outside the automated audit (section 4). A claim of AA conformance made on this evidence would be unearned.]',
      '[DECISION REQUIRED] — what to publish as the conformance status. Options: (a) "Partially conformant with WCAG 2.2 Level AA", with §4’s known limitations listed and dated. Honest today, and the only option available without new testing. (b) "Conformant" — not available: it would be a false statement about the service under L-CRA-50, and for a consumer it engages the DMCCA 2024 misleading-action provisions (L-DMCC-230’s sibling s. 226). (c) Do the screen-reader pass and the outstanding route coverage first, then state the status the evidence supports. This is the only route to (a) becoming something stronger.',
    ]],
    ['3', 'What we have done — and what is evidenced', 'Equality Act 2010 s. 20', [
      'Automatically tested on every code change, blocking merge:',
      'axe-core across 15 routes — 11 public pages plus 4 internal test-harness routes — at 2 viewports (375px and 1280px) × 2 scroll states (initial and scrolled), 60 analyses in all, plus link resolution, computed theme and skip link.',
      'Contrast: 36 token pairs across 148 cells over four themes, checked against WCAG ratios.',
      'Heading structure.',
      'Responsive behaviour at 375 / 768 / 1440, including WCAG 2.2 target size and focus-not-obscured.',
      'Theme flash and token loading.',
      'Lighthouse on two axes — desktop category scores, and mobile LCP / CLS / TBT under 4G throttling.',
      'Legal-page parity — the seven /legal/* pages a visitor receives are compared against the drafts in docs/_legal/: same version, no published sentence the draft does not contain, no draft clause the page has dropped, and each page still announcing itself as an unreviewed draft.',
      'Design decisions that are true of the build:',
      'Semantic HTML — real headings, lists, tables, buttons and links.',
      'A visible focus indicator on every interactive element, verified by the automated focus checks.',
      'Motion limited to opacity and transform, and disabled entirely when prefers-reduced-motion is set.',
      'Colours are declared as tokens and never hardcoded; CI blocks a hardcoded colour.',
    ]],
    ['4', 'Known limitations', 'Equality Act 2010 s. 20; WCAG 2.2', [
      'Stated because a statement that names its gaps is worth more than one that claims perfection.',
      'No screen-reader testing has been carried out. See section 6. Announcement, reading order as spoken, and the consent banner’s behaviour under a screen reader are untested by anyone.',
      'No assistive-technology testing of any other kind — no magnifier, voice control or switch testing has been done.',
      'Six of our seven legal pages are outside the automated audit. The automated audit covers /legal/privacy and no other legal page. It does not cover /legal/cookies, /legal/terms, /legal/client-terms, /legal/business-client-terms, /legal/consumer-client-terms or /legal/accessibility — including this page. [TK — adding the six routes to the audit is a small change and should be done before this statement is published, so that the coverage claimed in section 3 is the coverage that exists. OQ-18.]',
      'Interaction-to-Next-Paint is not measured. It is a field metric and cannot be asserted in a lab run; we use Total Blocking Time as the proxy. Real INP has to come from field data we do not yet have.',
      '[TK — add anything found by the screen-reader pass when it happens, with a date for fixing it.]',
      'Candidates to assess if introduced later: third-party embedded content; complex data tables on very small screens; PDF documents provided for download.',
    ]],
    ['5', 'Feedback', 'Equality Act 2010 s. 20 and s. 20(7)', [
      'If you encounter a barrier, tell us: [TK email].',
      'Please include the page, what you were trying to do, and the assistive technology you were using.',
      '[DECISION REQUIRED] — the response time published here. Version 1.0 promised acknowledgement within 5 working days.',
      'CLAUDE.md requires one source of truth for response commitments, so (c) is inconsistent with the project’s own rule. Whatever is chosen must also match PRIVACY-POLICY.md §12 and CONSUMER-TERMS.md §12.',
      'If you need information from this site in another format — large print, plain text, or read aloud — ask and we will provide it. We will not charge you for it.',
    ]],
    ['6', 'Testing', 'Equality Act 2010 s. 20; WCAG 2.2', [
      'Automated: axe-core and the gates listed at section 3, on every build, blocking merge.',
      'Manual keyboard testing: [TK — date, and by whom.]',
      'Screen-reader testing: none. It has never been performed.',
      'This is stated plainly because the alternative is to imply it. docs/_shared/05-HANDOVER.md:79 records that it requires "a human with NVDA or VoiceOver" over the master pages and the consent banner, and that it never happened; and that the automated gates "cover focus order, target, paint, landmarks and roles; they do not cover announcement, and no lab check does."',
      'Last full manual test: none.',
      'Next scheduled review: [TK].',
      '[TK — when will the screen-reader pass happen, and who will do it? OQ-19. Until it does, section 2 cannot say more than "partially conformant", and section 3 cannot claim manual testing.]',
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
 * instrument. Its text is the owner's routing decision, recorded in `lib/legal/slugs.ts`,
 * `MSA-BUSINESS.md` §"Who this agreement governs" and `CONSUMER-TERMS.md` §"Who these terms
 * govern". `check-legal-parity.mjs` therefore cannot cover it, names it in every run as the
 * one uncovered slug, and `scripts/check-consumer-terms.mjs` is what guards the routing it
 * exists to perform.
 */
const clientTermsDisambiguation = doc(
  'client-terms',
  { version: '1.0', revised: '2026-08-26' },
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
