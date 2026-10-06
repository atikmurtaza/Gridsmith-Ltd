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
 * `docs/_legal/research/GS-LEGAL-001/` is for, and adoption is the owner's act. A green run means
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
  /enforceable in (?:every|all) circumstances?/i,
  /\bAI[- ](?:generated|drafted) (?:draft|document|terms)/i,
  /\bmerely an? (?:AI )?draft\b/i,
];

/** Open markers. None may survive into a PUBLISHABLE document. */
export const MARKERS = [/\[OWNER DECISION/, /\[TK\b/, /\[SEED/, /\[DECISION REQUIRED/];

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

/** Register coherence for one entry. */
export function registerProblems(slug, entry, draftVersion, expectedDraft) {
  const p = [];
  if (!entry) return [`${slug}: no entry in the GS-O003-R register`];
  if (!STATES.includes(entry.state)) p.push(`${slug}: unknown state ${JSON.stringify(entry.state)}`);
  if ((entry.draft ?? null) !== (expectedDraft ?? null)) {
    p.push(`${slug}: register draft ${JSON.stringify(entry.draft)} is not ${JSON.stringify(expectedDraft)}`);
  }
  const adopted = rank(entry.state) >= rank('OWNER_ADOPTED');
  if (adopted) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.ownerAdoptedOn ?? '')) p.push(`${slug}: ${entry.state} without an ownerAdoptedOn date`);
    if (entry.ownerAdoptedVersion !== draftVersion) {
      p.push(`${slug}: adopted version ${JSON.stringify(entry.ownerAdoptedVersion)} is not the draft's version ${draftVersion}`);
    }
  } else if (entry.ownerAdoptedOn != null || entry.ownerAdoptedVersion != null) {
    p.push(`${slug}: records an adoption date or version while at ${entry.state}; only the owner's adoption sets those`);
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
    if (!/no more than twelve such payments, all due within the 12 months beginning with the date of/.test(markdown)) {
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

/** Privacy and cookie policies against what the site does. `facts` comes from the source. */
export function parityProblems(privacy, cookies, facts) {
  const p = [];
  for (const provider of ['Hostinger', 'Supabase', 'Resend']) {
    if (!privacy.includes(provider)) p.push(`privacy: does not name ${provider}`);
  }
  if (!/Information Commission\b/.test(privacy)) p.push('privacy: does not name the Information Commission');
  if (!/Ireland/.test(privacy)) p.push('privacy: does not say where enquiries are stored');
  if (!cookies.includes(facts.cookieName)) p.push(`cookies: does not name the cookie the site sets (${facts.cookieName})`);
  if (!new RegExp(`\\b${facts.cookieDays} days\\b`).test(cookies)) p.push(`cookies: does not state the ${facts.cookieDays}-day duration the site sets`);
  if (facts.storageApis.length && !/local storage/i.test(cookies)) p.push('cookies: the site uses browser storage the policy does not mention');
  if (facts.storageApis.length && /do not use local storage/i.test(cookies)) {
    p.push(`cookies: says no local storage, but the source uses ${facts.storageApis.join(', ')}`);
  }
  return p;
}

/** Rules that apply only once a document is at or beyond a state. */
export function stateProblems(slug, state, markdown, summary, ownerAdoptedOn) {
  const p = [];
  const text = `${markdown}\n${summary ?? ''}`;
  if (rank(state) >= rank('VERIFIED')) {
    for (const re of [/\[TK\b/, /\[SEED/, /\[DECISION REQUIRED/]) if (re.test(text)) p.push(`${slug}: at ${state} but still carries ${re}`);
  }
  if (state === 'PUBLISHABLE') {
    for (const re of MARKERS) if (re.test(text)) p.push(`${slug}: PUBLISHABLE but carries an open marker ${re}`);
    const effective = headerDate(markdown, 'Effective date');
    if (!effective) p.push(`${slug}: PUBLISHABLE without an "Effective date" header`);
    else if (ownerAdoptedOn && effective < ownerAdoptedOn) p.push(`${slug}: effective ${effective} is before its adoption on ${ownerAdoptedOn}`);
    if (headerDate(markdown, 'Draft date')) p.push(`${slug}: PUBLISHABLE but still headed with a draft date`);
  }
  return p;
}
