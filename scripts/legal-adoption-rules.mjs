/**
 * The `GS-O003-R` adoption predicates, as pure functions (`GS-LEGAL-001`, 6 October 2026).
 *
 * `scripts/check-legal-adoption.mjs` feeds them the real register, drafts and site facts;
 * `scripts/check-legal-adoption.selftest.mjs` feeds them committed specimens, one per branch. Same
 * split, and the same reason, as `legal-parity-rules.mjs`: a predicate nobody has watched fire is
 * not one anybody should trust.
 *
 * ## What these assert, and what they cannot
 *
 * They assert that the register is coherent, that the drafts keep the positions the owner has
 * already decided (no automatic portfolio rights, the `GS-X002` Technical boundary, no stated VAT
 * status, consumer and business terms kept apart, a working consumer cancellation mechanism), that
 * the privacy and cookie policies name what the site actually does, that internal cross-references
 * resolve, and that nothing is `PUBLISHABLE` while it carries an open marker or no effective date.
 *
 * **They cannot assert that a clause is legally sound.** That is what the research record in
 * `git:a7b931c10eb2a543bfa43e89954555fdadb7072d:docs/_archive/legal/pre-GS-LEGAL-FINAL-001/research/GS-LEGAL-001/` is for, and adoption is the owner's act. A green run means
 * "the documents keep the decided positions and the register is honest", never "the documents are
 * right" — the same ceiling `check-legal-parity.mjs` states for itself.
 */

/** Hardcoded on purpose: an expectation read from its own subject cannot fail. */
export const COMPANY = {
  number: '17050842',
  office: '30 Briarfield Road, Farnworth, Bolton, BL4 0HD',
  email: 'contact@gridsmith.uk',
};

export const STATES = ['RESEARCHED', 'VERIFIED', 'OWNER_REVIEW_REQUIRED', 'OWNER_ADOPTED', 'PUBLISHABLE'];
const rank = (state) => STATES.indexOf(state);

/** Claims no document may make (owner instruction, GS-LEGAL-001). */
export const FORBIDDEN_CLAIMS = [
  /solicitor[- ]approved/i,
  /approved by (?:a |our )?solicitor/i,
  /reviewed by (?:a |our )?solicitor/i,
  /legally guaranteed/i,
  /fully compliant/i,
  /legally certified/i,
  // GS-LEGAL-001-R4: the owner's full list, and the obsolete solicitor gate (struck as
  // GS-O003-SOLICITOR-APPROVAL-GATE) reappearing in a document as a pending condition.
  /lawyer[- ]approved/i,
  /approved by (?:a |our )?lawyers?/i,
  /guaranteed (?:to be )?(?:compliant|enforceable)/i,
  /(?:pending|subject to|awaiting) (?:a |our )?solicitor(?:'s)? (?:review|approval|sign-off)/i,
  /enforceable in (?:every|all) circumstances?/i,
  /\bAI[- ](?:generated|drafted) (?:draft|document|terms)/i,
  /\bmerely an? (?:AI )?draft\b/i,
];

/** Open markers. None may survive into a PUBLISHABLE document. */
export const MARKERS = [/\[OWNER DECISION/, /\[TK\b/, /\[SEED/, /\[DECISION REQUIRED/];

/** Self-description an adopted document cannot carry. */
const ADOPTION_CONTRADICTION = /\b(?:not yet adopted|draft for (?:owner )?review|under review by Gridsmith)\b/i;

/** Text the drafts must never contain again: each was a defect found by GS-LEGAL-001. */
const VAT_STATUS = /(?:not (?:currently )?registered for VAT|is registered for VAT|\bGB ?\d{9}\b)/i;
const PORTFOLIO_AUTOMATIC = /may (?:identify|name) the client and (?:display|show)/i;
const TECHNICAL_WIDE = [
  /engineering (?:and technical )?(?:drawing|design) services/i,
  /(?:certification|sign-off)[^.]*\b(?:included only where|where expressly stated|where the (?:written )?scope (?:expressly )?says)/i,
];
const TECHNICAL_BOUNDARY = /certification, approval, stamping or sign-off/i;

/** `**Effective date: 6 October 2026**` → `2026-10-06`. */
export function headerDate(markdown, label) {
  const m = markdown.match(new RegExp(`^\\*\\*${label}: (\\d{1,2}) ([A-Za-z]+) (\\d{4})\\*\\*`, 'm'));
  if (!m) return null;
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  const i = months.indexOf(m[2].toLowerCase());
  return i < 0 ? null : `${m[3]}-${String(i + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

/** Clause numbers a draft declares as headings. */
export function clauseNumbers(markdown) {
  return [...markdown.matchAll(/^(?:##|###) ([0-9]+[A-Z]?(?:\.[0-9]+)*)\.? /gm)].map((m) => m[1]);
}

/**
 * Internal references — `section 21`, `clauses 6, 9 and 10`, `clause 9.3` — that name no clause in
 * the same document. References to other instruments are written by name, never by number.
 */
export function danglingReferences(markdown) {
  const numbers = new Set(clauseNumbers(markdown));
  const body = markdown.slice(markdown.search(/^## /m));
  const ref = /\b(?:sections?|clauses?) ((?:[0-9]+[A-Z]?(?:\.[0-9]+)*)(?:(?:, | and | or | to )[0-9]+[A-Z]?(?:\.[0-9]+)*)*)/g;
  const out = [];
  for (const m of body.matchAll(ref)) {
    for (const n of m[1].split(/, | and | or | to /)) {
      // A bare sub-number such as "6.5" inside section 6 is fine; so is the parent of a declared sub-clause.
      if (!numbers.has(n) && ![...numbers].some((x) => x.startsWith(`${n}.`))) out.push(n);
    }
  }
  return [...new Set(out)];
}

/**
 * Publication prerequisites (`GS-LEGAL-001-R4`). Adoption is the owner's act; publication is a
 * separate one. Every adopted entry lists what must be true before it may become `PUBLISHABLE`,
 * and `PUBLISHABLE` is refused while any listed prerequisite has no recorded evidence in
 * `prerequisitesMet`. Hardcoded expectations, because an expectation read from its own subject
 * cannot fail: the cookie policy must always carry the A-2 retest, and every adopted document must
 * carry the publication authority and the privacy co-requisite.
 *
 * GS-R16-001 (Option Q): publication and cutover are separate authorities. PUBLICATION-AUTHORITY
 * replaced CUTOVER-AUTHORITY here, so approving a document never authorises a gridsmith.uk,
 * WordPress or DNS change; the A-2 retest is evidenced on the stack serving the release and
 * repeated on gridsmith.uk in the cutover checklist.
 */
export const REQUIRED_PREREQUISITES = {
  all: ['PUBLICATION-AUTHORITY', 'PRIVACY-PUBLISHABLE'],
  cookies: ['A-2-COOKIE-RETEST'],
  // Privacy §6/§7 describe the Supabase Edge Function intake, which runs only on Preview until H4-B
  // is promoted; cutover authority alone does not make that true (R4 review M5).
  // HOSTINGER-PROCESSOR-CHAIN (R10, clarified R11): evidence of existing Art. 28 contractual coverage
  // for hosting/email, including authorised corporate service use under Hostinger's incorporated DPA.
  // Internal administrators need no separate processor agreement; R10's signature requirement is withdrawn.
  privacy: ['H4-B-INTAKE-PROMOTED', 'HOSTINGER-PROCESSOR-CHAIN'],
};

/** The prerequisites an adopted entry must list. Privacy does not list itself (R4 review L1). */
export function requiredPrerequisites(slug, contactMode = 'edge') {
  const all = slug === 'privacy' ? REQUIRED_PREREQUISITES.all.filter((id) => id !== 'PRIVACY-PUBLISHABLE') : REQUIRED_PREREQUISITES.all;
  // The legacy intake requirement survives for future forms; direct contact needs its own receipt.
  const specific = slug === 'privacy' && contactMode === 'direct'
    ? ['DIRECT-CONTACT-VERIFIED', 'HOSTINGER-PROCESSOR-CHAIN'] : REQUIRED_PREREQUISITES[slug] ?? [];
  return [...all, ...specific];
}

/**
 * Operational conditions an adopted text describes as already happening (GS-LEGAL-001-R6). Unlike a
 * publication prerequisite, which is met at PUBLISHABLE, these need recorded evidence before the owner
 * can adopt. Privacy §8 describes the retention reviews, which is true only once the routine operates
 * (`docs/_legal/compliance/RETENTION-ACTIVATION-CHECKLIST.md` Part F). The Hostinger processor chain
 * (`docs/_legal/compliance/PROCESSOR-REGISTER.md`) is a publication prerequisite from R10.
 */
export const REQUIRED_ADOPTION_EVIDENCE = {
  // HOSTINGER-PROCESSOR-CHAIN was adoption evidence from R6 to R9 and is a publication prerequisite from R10
  // (REQUIRED_PREREQUISITES.privacy): Privacy 2.3 §7 describes Hostinger's terms without claiming reliance,
  // so adoption no longer depends on it. Publication needs contractual coverage evidence, not a new signature.
  privacy: ['RETENTION-ROUTINE-OPERATING'],
};

/** sha256 hex, the form `ownerAdoptedSha256` records. */
const SHA256 = /^[0-9a-f]{64}$/;

/** Register coherence for one entry. */
/**
 * `contentSha` is the sha256 of the text the adoption covers: the draft file's bytes, or for the
 * draftless `/legal/client-terms` its generated content. Adoption is bound to that text, not only to
 * the version number, so an edit that keeps the version cannot keep the adoption (R4 review M1).
 */
export function registerProblems(slug, entry, draftVersion, expectedDraft, contentSha) {
  const p = [];
  if (!entry) return [`${slug}: no entry in the GS-O003-R register`];
  if (!STATES.includes(entry.state)) p.push(`${slug}: unknown state ${JSON.stringify(entry.state)}`);
  if (slug === 'privacy' && !['edge', 'direct'].includes(entry.contactMode ?? 'edge')) {
    p.push('privacy: unknown contactMode');
  }
  if ((entry.draft ?? null) !== (expectedDraft ?? null)) {
    p.push(`${slug}: register draft ${JSON.stringify(entry.draft)} is not ${JSON.stringify(expectedDraft)}`);
  }
  const adopted = rank(entry.state) >= rank('OWNER_ADOPTED');
  if (adopted) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.ownerAdoptedOn ?? '')) p.push(`${slug}: ${entry.state} without an ownerAdoptedOn date`);
    if (entry.ownerAdoptedVersion !== draftVersion) {
      p.push(`${slug}: adopted version ${JSON.stringify(entry.ownerAdoptedVersion)} is not the draft's version ${draftVersion}`);
    }
    if (!SHA256.test(entry.ownerAdoptedSha256 ?? '')) p.push(`${slug}: ${entry.state} without an ownerAdoptedSha256 of the adopted text`);
    else if (entry.ownerAdoptedSha256 !== contentSha) {
      p.push(`${slug}: the text is not the adopted text (sha256 ${String(contentSha).slice(0, 12)}… is not the adopted ${String(entry.ownerAdoptedSha256).slice(0, 12)}…); a changed document needs a new version and a new adoption`);
    }
  } else if (entry.ownerAdoptedOn != null || entry.ownerAdoptedVersion != null || entry.ownerAdoptedSha256 != null) {
    p.push(`${slug}: records an adoption date or version while at ${entry.state}; only the owner's adoption sets those`);
  }
  if (adopted) {
    // The owner's instruction is recorded with the adoption, so a state flipped by a script or an
    // agent without one is visible here rather than looking like an adoption.
    if (typeof entry.adoptionAuthority !== 'string' || entry.adoptionAuthority.trim().length < 10) {
      p.push(`${slug}: ${entry.state} without an adoptionAuthority recording the owner's instruction`);
    }
    const listed = new Set((entry.publicationPrerequisites ?? []).map((x) => x.id));
    const met = entry.prerequisitesMet ?? {};
    for (const id of REQUIRED_ADOPTION_EVIDENCE[slug] ?? []) {
      if (typeof met[id] !== 'string' || !met[id].trim()) {
        p.push(`${slug}: ${entry.state} without recorded evidence for ${id}, an operational condition the adopted text describes as true`);
      }
    }
    for (const id of requiredPrerequisites(slug, entry.contactMode)) {
      if (!listed.has(id)) p.push(`${slug}: adopted without the publication prerequisite ${id}`);
    }
    // GS-R16-001: publication approval must say, in its own words, that it is not cutover authority.
    const authority = (entry.publicationPrerequisites ?? []).find((item) => item?.id === 'PUBLICATION-AUTHORITY');
    if (authority && !/does not authorise[^.]*gridsmith[.]uk[^.]*WordPress[^.]*DNS/.test(authority.requirement ?? '')) {
      p.push(`${slug}: PUBLICATION-AUTHORITY must state that it does not authorise gridsmith.uk, WordPress or DNS changes`);
    }
  }
  if (entry.state === 'PUBLISHABLE') {
    const met = entry.prerequisitesMet ?? {};
    for (const pre of entry.publicationPrerequisites ?? []) {
      if (typeof met[pre.id] !== 'string' || !met[pre.id].trim()) {
        p.push(`${slug}: PUBLISHABLE while publication prerequisite ${pre.id} has no recorded evidence`);
      }
    }
  }
  return p;
}

/** Rules every draft keeps, whatever its state. */
export function draftProblems(slug, markdown) {
  const p = [];
  for (const re of FORBIDDEN_CLAIMS) if (re.test(markdown)) p.push(`${slug}: makes a forbidden claim (${re})`);
  if (VAT_STATUS.test(markdown)) p.push(`${slug}: states a VAT registration status or number, which the owner has not confirmed for publication`);
  if (!markdown.includes(COMPANY.number)) p.push(`${slug}: header does not carry company number ${COMPANY.number}`);
  const refs = danglingReferences(markdown);
  if (refs.length) p.push(`${slug}: refers to clause(s) ${refs.join(', ')} that the document does not have`);
  if (/Information Commissioner'?s Office/i.test(markdown)) p.push(`${slug}: names the Information Commissioner's Office, abolished on 30 September 2026`);
  if (/\bVercel\b/.test(markdown)) p.push(`${slug}: names Vercel, which no longer hosts the site`);
  if (/[Pp]rices? (?:shown|published) on this website/.test(markdown) && !/does not publish prices/.test(markdown)) {
    p.push(`${slug}: refers to prices shown on the website, which publishes none (GS-D002)`);
  }
  return p;
}

/** Positions specific to one instrument. */
export function instrumentProblems(slug, markdown) {
  const p = [];
  const clientTerms = slug === 'business-client-terms' || slug === 'consumer-client-terms';
  if (clientTerms) {
    if (PORTFOLIO_AUTOMATIC.test(markdown)) p.push(`${slug}: grants automatic portfolio or publicity rights`);
    if (!/express written consent/.test(markdown)) p.push(`${slug}: does not require express written consent for portfolio or publicity use`);
    for (const re of TECHNICAL_WIDE) if (re.test(markdown)) p.push(`${slug}: Technical wording wider than the GS-X002 boundary (${re})`);
    if (!TECHNICAL_BOUNDARY.test(markdown)) p.push(`${slug}: lacks the GS-X002 boundary (no certification, approval, stamping or sign-off)`);
    if (!/(?:payment on its own|payment alone)[^.]*(?:not|never)[^.]*acceptance|(?:not|never) treat payment on its own/i.test(markdown)) {
      p.push(`${slug}: does not say that payment alone is not acceptance`);
    }
    // RAO art. 60F(2): deferred payment stays exempt credit only within these limits (G-03). The
    // period is the statute's "12 months or less (beginning on the date of the agreement)", so the
    // looser "within 12 months of" that 3.0 used no longer passes (GS-LEGAL-001-R3, O-5(2)).
    // The "no interest or fee" limb is part of the same condition (art. 60F(2)); R3 review R3-07.
    if (!/no more than twelve such payments, all due within the 12 months beginning with the date of[^.]*no interest or fee/.test(markdown)) {
      p.push(`${slug}: allows payment after supply without the consumer-credit exemption limits`);
    }
  }
  if (slug === 'consumer-client-terms') {
    const required = [
      ['the cancellation form', /I\/We hereby give notice that I\/We cancel/],
      ['the acknowledgement of the obligation to pay (CCR reg. 14)', /accepting it means I must pay/],
      ['the express early-start request', /I ask Gridsmith Ltd to start work now/],
      ['the acknowledgement of payment on cancellation', /I will pay for the work carried out up to the time I tell Gridsmith Ltd/],
      ['the acknowledgement of loss of the right', /I will lose my right to cancel/],
      ['the stage table', /stage table/],
      ['a 14-day refund deadline', /refund[^.]*within 14 days/],
      ['a no-fee refund', /not charge you a fee/],
      ['a "sent in time" rule', /cancelled in time if you send/],
      ['the Press anchor 10.1', /^### 10\.1 /m],
    ];
    for (const [what, re] of required) if (!re.test(markdown)) p.push(`${slug}: missing ${what}`);
    if (/if we agree to end/i.test(markdown)) p.push(`${slug}: makes ending a project depend on Gridsmith's agreement`);
    if (/Late Payment of Commercial Debts/.test(markdown)) p.push(`${slug}: applies business late-payment law to consumers`);
    if (/total (?:aggregate )?liability[^.]*(?:will not|shall not) exceed/i.test(markdown)) p.push(`${slug}: imports a business liability cap`);
    if (/non-refundable deposit(?!s\.)/i.test(markdown) && !/do not take non-refundable deposits/.test(markdown)) {
      p.push(`${slug}: provides for a non-refundable deposit`);
    }
  }
  if (slug === 'business-client-terms') {
    if (!/Client Terms for Consumers/.test(markdown)) p.push(`${slug}: does not route consumers to the Client Terms for Consumers`);
    if (/applies only to the extent it is fair and reasonable/i.test(markdown)) p.push(`${slug}: keeps the self-referential "fair and reasonable" cap saver`);
    if (!/Data Processing Schedule/.test(markdown)) p.push(`${slug}: has no binding data processing terms (UK GDPR Art. 28)`);
  }
  return p;
}

/**
 * Each processor the site uses must be disclosed as a recipient — by name, or (`GS-LAUNCH-026`,
 * owner instruction) by its accurate category, which is what UK GDPR Art. 13(1)(e) asks for. A
 * policy that does neither still fails.
 */
const RECIPIENT_DISCLOSURE = {
  Hostinger: /\bHostinger\b|\b[Ww]ebsite and email hosting provider\b/,
  Supabase: /\bSupabase\b|\b[Dd]atabase (?:infrastructure )?providers?\b/,
  Resend: /\bResend\b|\b[Ee]mail delivery providers?\b/,
};

/** Privacy and cookie policies against what the site does. `facts` comes from the source. */
export function parityProblems(privacy, cookies, facts) {
  const p = [];
  for (const provider of facts.contactMode === 'direct' ? ['Hostinger'] : ['Hostinger', 'Supabase', 'Resend']) {
    if (!RECIPIENT_DISCLOSURE[provider].test(privacy)) p.push(`privacy: does not name ${provider} or disclose it by category`);
  }
  if (!/Information Commission\b/.test(privacy)) p.push('privacy: does not name the Information Commission');
  if (facts.contactMode === 'direct') {
    if (!/website has no enquiry form/.test(privacy) ||
        !/email or WhatsApp message/.test(privacy) || /\b(?:SMS|text[- ]message)/i.test(privacy)) p.push('privacy: direct-contact channels or no-form disclosure missing');
    if (/Supabase\*\* receives website enquiries|Resend\*\* sends internal enquiry notifications|enquiries are stored in Ireland|website and form providers|submission references used to prevent duplicates/.test(privacy)) {
      p.push('privacy: inactive website intake described as current processing');
    }
  } else if (!/Ireland/.test(privacy)) p.push('privacy: does not say where enquiries are stored');
  if (!cookies.includes(facts.cookieName)) p.push(`cookies: does not name the cookie the site sets (${facts.cookieName})`);
  if (!new RegExp(`\\b${facts.cookieDays} days\\b`).test(cookies)) p.push(`cookies: does not state the ${facts.cookieDays}-day duration the site sets`);
  if (facts.storageApis.length && !/local storage/i.test(cookies)) p.push('cookies: the site uses browser storage the policy does not mention');
  if (facts.storageApis.length && /do not use local storage/i.test(cookies)) {
    p.push(`cookies: says no local storage, but the source uses ${facts.storageApis.join(', ')}`);
  }
  return p;
}

/**
 * `GS-LAUNCH-026`: a build that offers optional analytics must serve policies that describe it. For
 * every offered provider the Cookie Policy must name the provider and its cookies and the Privacy
 * Policy must name the provider; neither may still call analytics planned or inactive; and, given
 * `facts.choiceDays` from the source (`lib/consent/decision.ts`), the Cookie Policy must state that
 * lifetime of an analytics choice. An unconfigured build asks nothing of either. Returns problem
 * strings; `[]` is a pass.
 */
export function analyticsDisclosureProblems(cookies, privacy, offered, facts = {}) {
  const p = [];
  const providers = [offered.ga4 && ['Google Analytics 4', /\b_ga\b/], offered.posthog && ['PostHog', /\bph_/]].filter(Boolean);
  for (const [name, cookie] of providers) {
    if (!cookies.includes(name) || !cookie.test(cookies)) p.push(`cookies: the build offers ${name} but the policy does not name it and its cookies`);
    if (!privacy.includes(name)) p.push(`privacy: the build offers ${name} but the policy does not name it`);
  }
  if (providers.length && facts.choiceDays && !new RegExp(`\\b${facts.choiceDays} days\\b`).test(cookies)) {
    p.push(`cookies: does not state the ${facts.choiceDays}-day lifetime of an analytics choice the site sets`);
  }
  if (providers.length && /planned future processing|(?:are|is) not (?:currently )?active/i.test(`${cookies}\n${privacy}`)) {
    p.push('cookies/privacy: the build offers analytics but a policy still describes it as planned or inactive');
  }
  return p;
}

/**
 * `GS-LAUNCH-026`: the register's own rule — real analytics identifiers need recorded activation
 * evidence (`ANALYTICS-READY`: provider terms, settings, retention, transfers), never only adopted
 * wording. An unconfigured build needs none. Returns problem strings; `[]` is a pass.
 */
export function analyticsReadinessProblems(register, offered) {
  if (!offered.ga4 && !offered.posthog) return [];
  return register?.documents?.privacy?.prerequisitesMet?.['ANALYTICS-READY']
    ? []
    : ['analytics: the register records no ANALYTICS-READY evidence for the privacy policy (docs/_legal/compliance/ANALYTICS-ACTIVATION.md)'];
}

/** Text checks complement the receipt; they cannot prove mailbox operation or historical erasure. */
export function directContactAccessibilityProblems(markdown) {
  return /website does not use enquiry forms/.test(markdown) &&
    /contact@gridsmith\.uk/.test(markdown) && /WhatsApp link/.test(markdown) && !/\b(?:SMS|text[- ]message)/i.test(markdown) &&
    !/enquiry forms need JavaScript/.test(markdown) ? [] : ['accessibility: direct-contact alternative does not match the no-form website'];
}

/** Event-based commencement keeps owner adoption separate from later cutover. */
export const effectiveOnPublication = (markdown) => /^\*\*Effective date: On first publication with the replacement website at gridsmith\.uk\*\*$/m.test(markdown);

/** Rules that apply only once a document is at or beyond a state. */
export function stateProblems(slug, state, markdown, summary, ownerAdoptedOn) {
  const p = [];
  const text = `${markdown}\n${summary ?? ''}`;
  if (rank(state) >= rank('VERIFIED')) {
    for (const re of [/\[TK\b/, /\[SEED/, /\[DECISION REQUIRED/]) if (re.test(text)) p.push(`${slug}: at ${state} but still carries ${re}`);
  }
  // GS-LEGAL-001-R4: no document is adopted while it still carries an open marker. The owner cannot
  // adopt a sentence that says "[OWNER DECISION: …]", and this is what keeps the privacy policy at
  // OWNER_REVIEW_REQUIRED until its factual markers are truly resolved.
  if (rank(state) >= rank('OWNER_ADOPTED')) {
    for (const re of MARKERS) if (re.test(text)) p.push(`${slug}: ${state} but carries an open marker ${re}`);
    if (headerDate(markdown, 'Draft date')) p.push(`${slug}: ${state} but still headed with a draft date`);
    if (!headerDate(markdown, 'Effective date') && !effectiveOnPublication(markdown)) p.push(`${slug}: ${state} without an "Effective date" header`);
    // An adopted document that still describes itself as unadopted contradicts its own register entry.
    if (ADOPTION_CONTRADICTION.test(text)) p.push(`${slug}: ${state} but its text says it is not adopted (${ADOPTION_CONTRADICTION})`);
  }
  if (state === 'PUBLISHABLE') {
    for (const re of MARKERS) if (re.test(text)) p.push(`${slug}: PUBLISHABLE but carries an open marker ${re}`);
    const effective = headerDate(markdown, 'Effective date');
    if (!effective && !effectiveOnPublication(markdown)) p.push(`${slug}: PUBLISHABLE without an "Effective date" header`);
    else if (effective && ownerAdoptedOn && effective < ownerAdoptedOn) p.push(`${slug}: effective ${effective} is before its adoption on ${ownerAdoptedOn}`);
    if (headerDate(markdown, 'Draft date')) p.push(`${slug}: PUBLISHABLE but still headed with a draft date`);
  }
  return p;
}

/**
 * Cross-entry coherence (GS-LEGAL-001-R4). `PRIVACY-PUBLISHABLE` is a prerequisite whose evidence
 * the register itself can check: recording it as met while the privacy entry is not PUBLISHABLE is
 * a contradiction, not evidence. Every other prerequisite is an external fact and is checked only for
 * a recorded reference (registerProblems).
 */
export function crossRegisterProblems(documents) {
  const p = [];
  const privacyState = documents?.privacy?.state;
  for (const [slug, entry] of Object.entries(documents ?? {})) {
    const met = entry?.prerequisitesMet ?? {};
    if (met['PRIVACY-PUBLISHABLE'] != null && privacyState !== 'PUBLISHABLE') {
      p.push(`${slug}: records PRIVACY-PUBLISHABLE as met while the privacy entry is ${privacyState}`);
    }
  }
  return p;
}

/** Final owner-review controls: public disclosures and the maintained email process must agree. */
export function coordinatedReviewProblems(drafts, workflow) {
  const p = [];
  const consumer = drafts['consumer-client-terms'] ?? '';
  const version = consumer.match(/^\*\*Version ([^*]+)\*\*/m)?.[1];
  const quotation = workflow.split('## 2. Quotation email and attachment')[1]?.split('## 3.')[0] ?? '';
  if (!version || !quotation.includes(`Client Terms for Consumers version ${version}`) || !workflow.includes(`Terms: Client Terms for Consumers ${version} (attached)`)) {
    p.push('consumer workflow: quotation and confirmation must name the current consumer version');
  }
  const statements = [...consumer.matchAll(/"(I (?:accept this quotation|ask Gridsmith Ltd|understand that)[^"]+)"/g)].map(m => m[1]);
  if (statements.length !== 4 || statements.some(s => !quotation.includes(`"${s}"`))) {
    p.push('consumer workflow: quotation must contain the exact acceptance and three early-service statements');
  }
  const normalise = s => s.replace(/\s+/g, ' ').trim();
  const form = consumer.split('## 22. Cancellation form')[1] ?? '';
  const workflowForm = workflow.split('## 4. Cancellation form')[1]?.split('~~~text\n')[1]?.split('~~~')[0] ?? '';
  if (!form.trim() || normalise(form) !== normalise(workflowForm)) p.push('consumer workflow: cancellation form differs from the consumer terms');
  if (!/we wait until its cancellation period has ended before supplying it/.test(consumer) || !/do not supply them before their cancellation period ends/.test(workflow)) {
    p.push('consumer workflow: separate digital content must wait until cancellation ends');
  }
  const sensitive = text => text.match(/Please do not send special-category information[^\n]+/)?.[0];
  if (!sensitive(drafts.privacy ?? '') || sensitive(drafts.privacy) !== sensitive(drafts.terms ?? '')) p.push('privacy and website terms: sensitive-data instructions must match');
  for (const [slug, text] of Object.entries(drafts)) {
    if (/temporary demonstration|temporary.domain|\bPreview\b|\bProduction\b|\bWordPress\b|\bcutover\b/.test(text)) p.push(`${slug}: public text contains internal release history or controls`);
    if (/acknowledge[^.\n]{0,100}(?:5|five) working days/i.test(text)) p.push(`${slug}: unnecessary fixed acknowledgement promise`);
    if (/client-terms$/.test(slug) && /\b(?:USA|Pakistan|United States)\b/.test(text)) p.push(`${slug}: outsourcing country list belongs in the privacy notice`);
  }
  return p;
}
