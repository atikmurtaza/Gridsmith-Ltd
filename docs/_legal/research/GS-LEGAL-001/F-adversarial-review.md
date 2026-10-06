# GS-LEGAL-001 — Agent F: adversarial client review

Date: 6 October 2026. Reviewer role: hostile but reasonable client, in three personas:

- **(a) UK consumer**: an individual author who commissions ghostwriting, editing or a memoir.
- **(b) UK small business**: commissions a website.
- **(c) Non-UK client**: an EU/US consumer author, or a foreign business.

This is not legal advice and not a solicitor review. It does not make any document "compliant".
It lists attacks a client could plausibly make. It sorts them into ones that are **legally risky**
(a term may be non-binding or unenforceable, or the wording may mislead) and ones that are only
**commercially unclear** (they invite a dispute, but the law is not engaged). Every proposed
wording below is marked **proposal** and is the reviewer's own text, offered for owner decision.

## 0. Scope, method and limits

- **Read in full:** `docs/_legal/CONSUMER-TERMS.md`, `MSA-BUSINESS.md`, `WEBSITE-TERMS.md`,
  `PRIVACY-POLICY.md` and `COOKIE-POLICY.md` (all v2.0, effective 2 Sep 2026), and
  `scripts/seed-legal.mjs` (the served text, including the `/legal/client-terms`
  disambiguation page).
- **Spot-read:**
  - the legal route `app/(marketing)/legal/[slug]/page.tsx`;
  - the Press rights copy (`components/divisions/press/PressHome.tsx` l. 285–305);
  - the Press enquiry flow (`components/divisions/press/PressContactFlow.tsx` l. 440–465);
  - the master contact page and form (`app/(marketing)/contact/page.tsx`,
    `components/leads/ContactForm.tsx`);
  - the cookie code (`lib/consent/state.ts`);
  - the citation ledger entries L-CRA-57, L-CRA-62, L-CCR-13, L-CCR-36, L-CCR-40, L-UCTA-11,
    L-UCTA-26-27 and L-CDPA-90-91.
- **Verification limit (stated, not hidden):** every WebFetch to legislation.gov.uk this session
  returned a tool session-limit error. **No statutory text was re-fetched on 6 Oct 2026.**
  - Each authority below gives its legislation.gov.uk URL (recorded 6 Oct 2026).
  - Each authority is marked **[ledger]** or **[reviewer knowledge]**:
    - **[ledger]** means the proposition matches the Gridsmith citation ledger, which was
      checked in Aug 2026.
    - **[reviewer knowledge]** means the proposition rests on the reviewer's own knowledge
      and has not been fetched.
  - Both kinds **must be re-verified** before adoption. Where an attack depends on a
    commencement date I could not confirm, it is marked **VERIFY**.
- Source type is "primary" unless stated otherwise. Retrieval date for every URL: 6 Oct 2026
  (recorded only; not re-fetched).

## 1. Served text vs drafts

`scripts/seed-legal.mjs` reproduces the operative prose of each draft word for word. I compared
it clause by clause: **no operative divergence**. The served pages do differ in five ways, and
the differences are visible to a client:

| # | Divergence | Effect on a client | Severity |
|---|---|---|---|
| S-1 | **Every clause renders a public "Basis: …" line.** The route prints it at `page.tsx` l. 190. The drafts have no basis lines; they exist only in the seed. | Any wrong citation is published on the page (see S-2 and S-3). Some lines also read as Gridsmith's legal position, for example that the MSA 9.4 portfolio clause is justified by "UK GDPR Art. 6(1)(f)". | medium |
| S-2 | The Website Terms cl. 3 basis cites the "Consumer Protection from Unfair Trading Regulations 2008". | My understanding is that DMCCA 2024 Part 4 Chapter 1 revoked these Regulations and replaced them from 6 Apr 2025 [reviewer knowledge; **VERIFY**]. Citing a revoked instrument on a legal page undermines credibility. | low–medium |
| S-3 | Two basis lines say "Rome I Regulation **as retained**" (Website cl. 13, MSA cl. 21). | Since 1 Jan 2024 this is "assimilated law" (Retained EU Law (Revocation and Reform) Act 2023) [reviewer knowledge; VERIFY]. Cosmetic. | low |
| S-4 | The documents use different names for each other. | The Consumer Terms cl. 1 call the business terms "Business Client Terms / Master Services Agreement". The Website Terms cl. 1 say "Business Client Terms" and "Consumer Client Terms". The served titles are "Client Terms for Business Clients — Master Services Agreement" and "Client Terms for Consumers". A client cannot be sure that all of these mean the same document. | low |
| S-5 | Every summary is prefixed "[SEED - SOLICITOR REVIEW REQUIRED]" and says the draft "has not been reviewed by a solicitor". The Press page says the terms are "awaiting solicitor review". | The brief says **no solicitor is being commissioned** at this stage, so "awaiting solicitor review" is no longer accurate (see D-3). | medium |

**Proposal (S-1):** either stop rendering `basis` publicly, or have each line re-verified by the
GS-LEGAL-001 statute workstreams before production. The conservative option is to stop
rendering it. The lines are reviewer apparatus; the drafts do not carry them, and the parity
gate does not check them.

## 2. Findings

Fields used for each finding:

- **Clause:** file, clause number and a quote of 15 words or fewer.
- **Persona:** a, b or c.
- **Affects:** C (consumer), B (B2B) or both.
- **Severity:** H, M or L.
- **Risk:** legal or commercial.
- **Authority:** the statute, URL and confidence.
- **Recommendation:** a proposal, or "no change" with the reason.

**OCR** means OWNER CONFIRMATION REQUIRED.

### A. Cross-cutting attacks (both client instruments)

**F-01 — The terms are never shown to be incorporated, and formation is one-sided.** H · both · legal

- **Clause:** CONSUMER cl. 3: "A contract is formed when we send you a written order
  confirmation". MSA cl. 1: "Each project consists of this MSA together with the relevant…".
  The Press form says: "Nothing is agreed until we send a written order confirmation."
- **Attack (a):** "Your own sending made the contract. I never saw or accepted your terms before
  you took my money." Neither document says the terms will be provided and accepted *before*
  acceptance or payment, nor how they are incorporated.
  - "Accepted quotation": accepted by whom? It is not said.
  - A Gridsmith term the consumer never received is open to a not-incorporated or s. 62
    unfairness challenge.
  - Under CRA s. 69, any doubt about meaning is resolved in the consumer's favour.
- **Attack (b):** "My purchase order says my standard terms apply. Yours don't say they prevail,
  and nothing says the MSA is part of the Scope." This is a battle of the forms, and there is no
  precedence-over-client-terms clause.
- **Authority:**
  - CCR 2013 reg. 13 and Sch. 2 (information before the consumer is bound) and reg. 16
    (confirmation on a durable medium): https://www.legislation.gov.uk/uksi/2013/3134
    [ledger L-CCR-13]
  - CRA 2015 s. 69: https://www.legislation.gov.uk/ukpga/2015/15/section/69 [reviewer knowledge]
  - Confidence: high on the gap; medium on the outcome.
- **Proposal (both instruments, new clause 1A):**

  > *"These terms form part of your contract only if we have given you a copy, or a link to the
  > version identified by number, before you accept the Scope or make any payment. The Scope will
  > name the version that applies. You accept the Scope by confirming in writing (email is
  > enough) or by signing it; we do not treat payment alone, or silence, as acceptance. No
  > payment is requested until the Scope and these terms have been accepted."*

  MSA only, add:

  > *"These terms and the Scope apply in place of any terms in a purchase order or similar
  > document from the client, unless both parties sign an agreed variation."*

  Also change the Press form copy from "until we send" to "until you have accepted a written
  scope and the applicable terms".

**F-02 — The version is never fixed, which works as a unilateral variation.** M · both · legal (consumer) / commercial (B2B)

- **Clause:** WEBSITE cl. 12: "We may update these terms." The client instruments say nothing
  about which version governs a running project.
- **Attack:** "Your Scope linked to /legal/consumer-client-terms. That page now shows v3.0 with
  new terms. Which governs my six-month project?"
  - An implied right to apply the live page would be grey-listed: unilateral alteration without
    a valid reason specified in the contract.
- **Authority:** CRA Sch. 2 Part 1 para. 11,
  https://www.legislation.gov.uk/ukpga/2015/15/schedule/2 [reviewer knowledge]. Confidence:
  medium.
- **Proposal:**

  > *"The version of these terms named in your Scope applies to that project for its whole
  > life. A later version applies to it only if you agree in writing."*

  Keep superseded versions accessible at a stable versioned URL. **OCR:** a versioned archive
  needs a build change.

**F-03 — "Work started" is undefined, so the refund trigger is vague.** H · both · legal (C) / commercial (B)

- **Clause:** CONSUMER cl. 6.1: "before we have started work". CONSUMER cl. 7 and MSA cl. 6.1:
  "before Gridsmith has begun work".
- **Attack:** "You call our two scoping calls and your 'research' started work, so you're
  keeping half my deposit."
  - The owner's stated intent is a refund where "no substantive work has been performed". The
    text does not say that.
  - It does not say whether quoting or scoping is free.
  - It does not fix a start date.
- **Authority:** CRA s. 68 (transparency) and s. 69 (contra proferentem),
  https://www.legislation.gov.uk/ukpga/2015/15/part/2 [reviewer knowledge]. Confidence: high
  that this is ambiguous.
- **Proposal (definition used in both):**

  > *"Work starts on the start date stated in the Scope or, if none is stated, on the date we
  > tell you in writing that work has begun. Discussing, quoting and preparing the Scope before
  > the contract is made are not chargeable and are not 'work' for the purposes of these
  > terms."*

**F-04 — The work-to-date deduction has no valuation method, and "outstanding balance" is open-ended.** H · both · legal (C) / commercial (B)

- **Clause:** CONSUMER cl. 7: "you will pay for work reasonably carried out". CONSUMER cl. 7 and
  MSA cl. 6.2: "any properly due outstanding balance remains payable".
- **Attack (a):** "Who values the work done, and how? Hourly? By milestone? At a share of the
  price? Does 'outstanding balance' mean I owe the rest of the full price even though you
  stopped?"
  - If a consumer who ends early is made to pay more than the value supplied plus unavoidable
    costs, the term risks being grey-listed:
    - para. 4: the trader keeps sums without a reciprocal obligation;
    - paras. 5–6: a disproportionately high sum is payable.
  - Under s. 69 the consumer's reading wins any ambiguity.
- **Attack (b):** "Your 'work reasonably performed' figure is your own unaudited number."
- **Authority:**
  - CRA s. 62 and Sch. 2 Part 1 paras. 4–6,
    https://www.legislation.gov.uk/ukpga/2015/15/schedule/2 [ledger L-CRA-62 (paras. 5–6);
    para. 4 reviewer knowledge]
  - CRA s. 69
  - Confidence: high on the ambiguity; medium on unfairness.
- **Proposal (both, replacing the cl. 7 and cl. 6.2 bullets):**

  > *"If the project ends early: (i) we will value work done using the stage or milestone values
  > in the Scope; if the Scope has none, as the part of the total price that fairly reflects the
  > work completed, measured against the whole of the agreed work; (ii) we will add only the
  > third-party costs allowed by clause [F-05]; (iii) we will send you an itemised statement;
  > (iv) we will refund anything you have paid above that figure within 14 days of the statement;
  > (v) if that figure is more than you have paid, you owe only the difference — never more than
  > the total price, and nothing for work not yet done."*

  **OCR:** the refund timing.

**F-05 — Third-party costs are a hidden charge.** H (C) / M (B) · both · legal (C)

- **Clause:** CONSUMER cl. 7: "third-party costs or commitments that we reasonably incurred".
  MSA cl. 6.2 has no authority requirement, while MSA cl. 6.1 requires "with the client's
  authority".
- **Attack:** "You never told me about a subcontractor commitment or an illustrator's
  cancellation fee. Now it is deducted from my refund."
  - For consumers, payments beyond the main obligation need **express consent**.
  - Pre-contract price information is binding.
  - Inside the MSA itself, 6.1 and 6.2 are inconsistent.
- **Authority:**
  - CCR reg. 40, https://www.legislation.gov.uk/uksi/2013/3134/regulation/40 [ledger L-CCR-40]
  - CRA s. 50 [ledger L-CRA-50]
  - Confidence: medium-high.
- **Proposal:**

  > *"We will pass on a third-party cost only if it was named (with an estimate) in the Scope, or
  > you approved it in writing before we committed to it, and we can show you the supplier's
  > charge."*

**F-06 — Deposits and "non-refundable" labels.** M · both · legal (C)

- **Clause:** none. Both instruments are silent on deposits. MSA cl. 1: "the Scope prevails over
  this MSA".
- **Attack:** "Your quote said '50% non-refundable deposit'. Your terms say unused money is
  refunded. Which wins?"
  - In the MSA, the Scope wins, so a single quotation line could remove the refund mechanism.
  - In the consumer terms there is no precedence rule.
  - A consumer deposit forfeited beyond actual cost is grey-list exposure.
- **Authority:** CRA Sch. 2 Part 1 paras. 4–5 (as F-04). Confidence: medium.
- **Proposal:**

  > *"Calling a payment a 'deposit' or 'booking fee' does not make it non-refundable. If the
  > project ends early, every payment is dealt with under clause [7 / 6]."*

  **OCR:** whether any business Scope may agree a genuinely non-refundable sum. The conservative
  answer is that it may only if the sum is stated and justified in the Scope; never for
  consumers.

**F-07 — Subcontracting, and the IP chain behind it, are not addressed.** M · both · legal (IP) / commercial

- **Clause:** none. The brief says Gridsmith may use subcontractors. MSA cl. 9.3: "the rights
  Gridsmith owns".
- **Attack (a, Press):** "I hired *you* to ghostwrite my memoir. Who actually wrote it, and did
  they see my family's private material?"
- **Attack (b):** "Your freelancer never assigned copyright to you. You 'own' nothing, so I get
  nothing."
- **Authority:** CDPA s. 90(3) (an assignment must be in writing, signed by the assignor),
  https://www.legislation.gov.uk/ukpga/1988/48/section/90 [ledger L-CDPA-90-91]. Confidence:
  high.
- **Proposal:**

  > *"We may use carefully selected subcontractors or specialists. We remain responsible for
  > their work, bind them to confidentiality at least as strict as ours, and obtain from them
  > the rights needed for us to transfer or license the deliverables to you as these terms
  > provide. [Press: We will tell you before anyone other than [named lead] writes material for
  > your book.]"*

  **OCR:** the Press disclosure wording.

**F-08 — The consumer terms have no confidentiality clause.** H (Press) · C · commercial (and trust)

- **Clause:** CONSUMER, whole document. Only the MSA has cl. 10.
- **Attack (a):** "I gave you my memoir: health history, family disputes. The consumer terms don't
  promise to keep it confidential, and they say nothing about whether you can disclose that you
  ghostwrote my book."
- **Authority:** an equitable duty of confidence probably exists anyway [reviewer knowledge]; the
  gap is about promises, not legality. Confidence: medium.
- **Proposal (new consumer clause):**

  > *"We will keep your manuscript, notes and personal information confidential, use them only
  > for your project, and share them only with people working on it under clause [F-07]. We will
  > not say publicly that we worked on your project, or that any work was ghostwritten, without
  > your written permission."*

**F-09 — Use of AI tools is not addressed.** L–M · both · commercial; legal only if marketing implies otherwise

- **Attack (a/b):** "Did you use generative AI to write my book or code my site? Who owns that
  output, and was my manuscript put into a third-party model?"
  - Copyright in AI-assisted output may be thin (CDPA s. 9(3)) [reviewer knowledge].
  - "To the extent Gridsmith owns rights" then transfers less than the client assumes.
- **Proposal:** **OCR.**
  - The owner should decide a policy.
  - Then state it in one sentence, for example: *"We will not put your unpublished material into
    any AI service that may use it for training, and the Scope will say if AI tools are used to
    produce deliverables."*
  - Do not adopt this wording until the owner has decided.

### B. Consumer Client Terms (persona a; persona c where noted)

**C-01 — "Engineering … design services" contradicts the Technical boundary.** H · both (MSA cl. 12 too) · legal (misleading) and commercial

- **Clause:**
  - CONSUMER cl. 2: "engineering and technical drawing services".
  - CONSUMER cl. 9: "drawings or design services" and "perform the agreed design or drawing
    service".
  - MSA cl. 12: "engineering, technical, CAD or construction-related drawings or design services".
  - MSA cl. 12(2): "the design task Gridsmith has accepted".
- **Attack:** "Your own terms offer engineering design and talk about the design task you
  accepted. You *were* my designer." Owner policy (`GS-X002`) is the opposite:
  - drafting and documentation only;
  - no engineering design or calculation;
  - no certification or sign-off;
  - no responsible-designer role.

  An offer of a service the trader does not supply may also be a misleading action about the
  main characteristics of the service. A separate point for the Technical workstream: under the
  CDM Regulations 2015, someone who prepares drawings in the course of business may be a
  "designer" whatever the contract says [reviewer knowledge; **VERIFY**].
- **Authority:**
  - DMCCA 2024 s. 226 (misleading actions), https://www.legislation.gov.uk/ukpga/2024/13
    [reviewer knowledge]
  - CDM 2015 reg. 2, https://www.legislation.gov.uk/uksi/2015/51/regulation/2 [reviewer
    knowledge]
  - Confidence: high on the inconsistency; medium on the legal characterisation.
- **Proposal:**
  - In cl. 2, replace the bullet with *"technical drawing, drafting and documentation (within the
    limits in clause 9)"*.
  - Retitle cl. 9 "Technical drawing and documentation" and open it with:

  > *"Our technical services are drafting, technical illustration and documentation prepared
  > from information and instructions you or your advisers provide. They do not include
  > engineering design, calculations, certification, approval, stamping or regulated sign-off,
  > and we do not act as designer or responsible professional where the law or the project
  > requires a suitably qualified person; you must appoint one."*

  Make the same change to MSA cl. 12(2) ("drafting task" in place of "design task"). Owner/GS-X002
  confirmation required.

**C-02 — "You are responsible for reviewing… before relying on them."** M · C · legal

- **Clause:** CONSUMER cl. 9, third bullet.
- **Attack:** "I'm not an engineer. You're making me responsible for spotting your mistakes."
  - To the extent the bullet reduces liability for reasonable care and skill, it is not binding
    (s. 57(1)).
  - The saving sentence ("Nothing in this clause excludes…") helps, but the bullet still reads as
    a transfer of risk, which is a transparency problem.
- **Authority:** CRA s. 57, https://www.legislation.gov.uk/ukpga/2015/15/section/57 [ledger
  L-CRA-57]. Confidence: medium.
- **Proposal:**

  > *"Please check that the drawings reflect your instructions and measurements before you use
  > them. This is a practical step, not a transfer of responsibility: we remain responsible for
  > preparing them with reasonable care and skill."*

**C-03 — "Obtaining your agreement where required" leaves room for unagreed charges.** M-H · C · legal

- **Clause:** CONSUMER cl. 4: "obtaining your agreement where required".
- **Attack:** "So in some cases you can add a charge without my agreement, just by telling me?"
  An extra payment requires express consent.
- **Authority:** CCR reg. 40 [ledger L-CCR-40]. Confidence: high.
- **Proposal:**

  > *"We will not charge you anything beyond the agreed price unless you have agreed to that
  > specific charge in writing before it is incurred."*

**C-04 — Gridsmith alone decides what is "out of scope", and revision rounds are undefined.** M · both (MSA cl. 4) · commercial / transparency

- **Clause:** CONSUMER cl. 5: "If you request a material change…we may". MSA cl. 4: "A material
  change includes…".
- **Attack:** "You decided my third round of edits was a 'material change'. The scope said
  '2 rounds' and never defined a round."
- **Authority:** CRA s. 68 (transparency) [reviewer knowledge]. Confidence: medium.
- **Proposal:**

  > *"A revision round is one consolidated set of your comments on a draft and our response to
  > it. If we think a request is outside the Scope we will say so before doing it. If you
  > disagree, we will continue the in-scope work and nothing extra is charged unless you agree
  > in writing."*

**C-05 — The cancellation clause leaves the consumer guessing.** M · C · legal

- **Clause:** CONSUMER cl. 6: "Where your contract is a distance or off-premises service
  contract". CONSUMER cl. 18 (contact details) omits the published telephone number.
- **Attack:** "Is mine a distance contract? Where is the model cancellation form?" Sch. 2
  requires, before the contract:
  - the conditions and procedure for cancelling, **with the model cancellation form**; and
  - the trader's contact details, including a telephone number "where available". Gridsmith
    publishes +44 7405 448534 on the site.

  Failing to give cancellation information extends the cancellation period by up to 12 months
  (reg. 31). If work started without the information and request, the consumer may pay nothing
  (reg. 36(6)).
- **Authority:** CCR reg. 13, Sch. 2, reg. 31 and reg. 36(6),
  https://www.legislation.gov.uk/uksi/2013/3134/schedule/2 [ledger L-CCR-13; reg. 31 and
  Sch. 2(c) telephone wording are reviewer knowledge, **VERIFY**]. Confidence: medium-high.
- **Proposal:**

  > *"Because we normally agree projects by email, video call or online, most of our consumer
  > contracts are distance contracts with a 14-day cancellation right. Your order confirmation
  > will say whether you have that right and will include the model cancellation form."*

  Add the telephone number to cl. 18 if it is to be a contact route. **OCR:** whether the phone
  is an official contact route for contracts.

**C-06 — The "proportionate amount" has no stated basis.** M · C · legal

- **Clause:** CONSUMER cl. 6.2: "you will pay a proportionate amount for the service supplied".
- **Attack:** "Proportionate to what?" Reg. 36(4)–(5) fixes the measure: what was supplied
  compared with the full coverage of the contract, calculated on the total price (or market value
  if the price is excessive).
- **Authority:** CCR reg. 36, https://www.legislation.gov.uk/uksi/2013/3134/regulation/36 [ledger
  L-CCR-36]. Confidence: high.
- **Proposal:** add *"…calculated by reference to the total agreed price, in proportion to how
  much of the agreed service had been supplied when you told us you were cancelling."*

**C-07 — How to make the "express request" to start early is not stated.** L-M · C · legal

- **Clause:** CONSUMER cl. 6.2: "unless you have expressly asked us to begin early".
- **Attack:** "I said 'sounds good, go ahead' on a call. Was that my request? Did I acknowledge I
  would lose the right to cancel?" An off-premises request must be on a durable medium.
- **Authority:** CCR reg. 36(1)–(2) [ledger]. Confidence: high.
- **Proposal:**

  > *"If you want us to start within the cancellation period, you must ask in writing (email is
  > fine). We will confirm the request and, where relevant, that you will lose the right to
  > cancel once the service is fully performed."*

**C-08 — Refund timing and method are missing.** M · C (and B) · legal (C)

- **Clause:** CONSUMER cl. 6.1: "subject to any statutory rules". CONSUMER cl. 7 and MSA cl. 6:
  no timing.
- **Attack:** "When do I get my money back, and how?" Reg. 34 requires reimbursement within
  14 days of being informed of the cancellation, by the same means of payment unless the consumer
  agrees otherwise.
- **Authority:** CCR reg. 34 [ledger L-CCR-32-35 (heading); detail is reviewer knowledge,
  **VERIFY**]. Confidence: medium-high.
- **Proposal:** replace "subject to any statutory rules…" with *"…within 14 days of your
  cancellation, using the payment method you used unless you agree otherwise."* Use the F-04
  timing for after-period ends.

**C-09 — The consumer cannot leave unless Gridsmith agrees.** H · C · legal

- **Clause:** CONSUMER cl. 7: "If we agree to end the project".
- **Attack:** "After 14 days I'm locked in until you consent? And if you refuse, do I owe the full
  price for work never done?"
  - The text gives no answer for the refusal case.
  - A lock-in combined with full-price exposure is a significant imbalance (s. 62(4)).
  - The wording also conflicts with cl. 7's own first line ("you may still ask us to stop").
  - Separately, the owner's refund intent assumes the client can withdraw.
- **Authority:** CRA s. 62 and Sch. 2 Part 1 paras. 4–6 [ledger L-CRA-62]. Confidence: medium.
- **Proposal:** *"You may end the project at any time by telling us in writing. The project ends
  on the day we receive your notice (or a later date you choose), and clause [F-04] applies."*

**C-10 — Moral rights, authorship credit and ghostwriting confidentiality.** M · both (Press) · legal (IP)

- **Clause:** CONSUMER cl. 10.2 and MSA cl. 13 (whose basis line cites CDPA s. 77) are silent.
  The Press page says "we agree authorship and credit in writing before work begins".
- **Attack (a/c):** "I want to publish as sole author. Can your writer later assert the right to
  be identified, or object to my edits as derogatory treatment?"
  - The right to be identified must be asserted (s. 78).
  - Moral rights can be waived only by an instrument in writing signed by the author (s. 87).
  - Gridsmith cannot waive its writers' rights for them. The Press page promises something the
    terms do not deliver.
- **Authority:** CDPA ss. 77, 78, 80 and 87, https://www.legislation.gov.uk/ukpga/1988/48
  [reviewer knowledge]. Confidence: medium-high.
- **Proposal (Press clause):**

  > *"For ghostwriting, the Scope records how authorship and credit will be stated. Unless the
  > Scope says otherwise, we will procure that each writer working on your book gives a signed
  > written waiver of the right to be identified as author and of the right to object to
  > derogatory treatment, so you may publish under your own name and edit freely."*

  **OCR.**

**C-11 — Clauses 10.2 and 12 contradict each other on IP.** M-H · C · legal

- **Clause:** CONSUMER cl. 10.2: "those rights will transfer to you on full payment". CONSUMER
  cl. 12: "to the extent stated in the scope".
- **Attack:** "My scope doesn't mention IP. Under cl. 12 nothing transfers, but under cl. 10.2
  everything does. Under s. 69 I take the reading most favourable to me." The result is that
  Gridsmith can no longer rely on the narrower reading.
- **Authority:** CRA s. 69 [reviewer knowledge]. Confidence: high.
- **Proposal:** in cl. 12, replace "to the extent stated in the scope" with *"unless the Scope
  expressly says a deliverable is licensed rather than transferred"*, to match cl. 10.2.

**C-12 — The assignment may not be legally effective without signed writing.** M · both · legal

- **Clause:** CONSUMER cl. 10.2 and cl. 12: "will transfer". MSA cl. 9.3: "On full payment,
  Gridsmith assigns". The consumer terms have no further-assurance sentence; the MSA has one.
- **Attack:** "A web page Gridsmith never signed can't assign copyright. I have, at best,
  equitable title, and I can't sue an infringer without joining you."
  - An assignment of copyright must be in writing signed by the assignor (s. 90(3)).
  - An assignment of future copyright also needs a signed agreement (s. 91).
- **Authority:** CDPA ss. 90–91 [ledger L-CDPA-90-91]. Confidence: medium-high.
- **Proposal:** both instruments, *"On full payment we will send you a short written confirmation
  of the assignment, signed (electronically is fine) on behalf of Gridsmith Ltd."* Copy the MSA's
  further-assurance sentence into the consumer terms.

**C-13 — No right to use deliverables before full payment.** M · both · commercial / legal

- **Clause:** CONSUMER cl. 10.2 and cl. 12, and MSA cl. 9.3: "on full payment".
- **Attack (a/b):** "We pay in instalments, and the site goes live before the last one. Am I
  infringing your copyright until then? Can a dispute over a small final balance hold my whole
  book hostage forever?"
- **Proposal:**

  > *"Until full payment, you may use deliverables you have paid for at each stage for the
  > purpose of the project. Ownership passes on full payment. A genuine dispute about part of a
  > payment does not stop you using work you have paid for."*

  **OCR:** whether stage-by-stage licensing fits the owner's payment models.

**C-14 — Press accounts "should" be in the client's name.** L-M · both · commercial

- **Clause:** CONSUMER cl. 10.3 and MSA cl. 13: "should be held in your name".
- **Attack:** "'Should' isn't a promise. My KDP account was opened under your login." The Press
  page also promises that the Scope will confirm ISBN holder and publisher of record; the terms
  do not.
- **Proposal:**

  > *"Publishing and distribution accounts will be opened in your name or transferred to you,
  > unless the Scope says otherwise. The Scope will state who holds any ISBN and who is named as
  > publisher. We will not keep your account passwords after the task that needed them."*

**C-15 — The background licence is vague.** M · C (Digital) · commercial

- **Clause:** CONSUMER cl. 12: "the rights reasonably necessary to use the final deliverable".
- **Attack:** "Can I move my site to another host, or have another developer edit it?" The term
  doesn't say.
- **Proposal:** align with the B-02 wording (irrevocable; includes modifying, hosting anywhere and
  letting others maintain it).

**C-16 — No ADR information in the complaints clause.** L-M · C · legal

- **Clause:** CONSUMER cl. 13.
- **Attack:** "If we deadlock, where do I go?" Where an internal complaint cannot be resolved, a
  trader may have to tell the consumer about an ADR entity and say whether it will use it.
  - The ADR Regulations 2015 reg. 19 did this.
  - The DMCCA 2024 Part 4 Chapter 4 replaces that regime.
  - Commencement status: **VERIFY** [reviewer knowledge].
- **Proposal:** **OCR**. Add the statutory ADR statement to the final complaint response once the
  current regime is confirmed. Do not name an ADR provider until chosen.

**C-17 — The force majeure clause gives no exit.** L-M · C (MSA cl. 18 the same) · commercial / legal

- **Clause:** CONSUMER cl. 15: "We are not responsible for delay caused by events…".
- **Attack:** "You've been 'delayed' for four months. Can I leave?" Nothing says so. Section 52
  (reasonable time) still applies.
- **Proposal:**

  > *"If a delay outside our control lasts more than [period agreed in the Scope or, if none, a
  > reasonable period], you may end the project and clause [F-04] applies, except that you will
  > not pay for costs caused by the delay."*

  **OCR:** the period. Do not invent a number.

**C-18 — Gridsmith has no right to suspend or end the project.** M · C · commercial (Gridsmith's exposure)

- **Clause:** CONSUMER, whole document. There is no termination or suspension by Gridsmith, and
  CONSUMER cl. 8 says only "the timetable may move".
- **Attack:** this works in the client's favour. A consumer can stop paying or vanish indefinitely,
  and Gridsmith has no stated remedy beyond the common law.
- **Proposal:** a balanced clause (**OCR**):

  > *"We may pause work if a payment is overdue or we need something from you, after telling you
  > in writing what is needed. If nothing is received within [period in Scope] after a further
  > written reminder, we may end the project; clause [F-04] then applies and we will return your
  > materials."*

  Any such clause must be mirrored by C-09 and must not create forfeiture.

**C-19 — Consumer status is classified by enquiry segment.** M · C · legal

- **Clause:** disambiguation page 1.2, "That is most individual authors…". Classification follows
  the Press form segment.
- **Attack (both directions):**
  - A self-publishing author selling commercially might be acting for a business. If Gridsmith
    then relies on the MSA, it must prove the person was *not* a consumer (s. 2(4)).
  - Conversely, a hobby author mislabelled "business" has consumer rights regardless of which
    document was sent.
- **Authority:** CRA s. 2(3)–(4), https://www.legislation.gov.uk/ukpga/2015/15/section/2
  [reviewer knowledge]. Confidence: medium-high.
- **Proposal:** **OCR**. The conservative rule is that individuals are put on the Consumer Terms
  unless they clearly contract through a business, and the Scope records the classification (as
  disambiguation 1.3 already promises).

**C-20 — Governing law is silent for clients outside the UK.** H (persona c, consumer) · C · legal

- **Clause:** CONSUMER cl. 17 ("These terms are governed by the law of England and Wales") and
  WEBSITE cl. 13 mention only "elsewhere in the UK".
- **Attack (EU consumer):**
  - If Gridsmith directs its activities to the consumer's country, a choice of English law
    cannot deprive the consumer of the mandatory protections of their home law (Rome I art. 6(2)).
  - The consumer may sue in their home courts. EU courts apply Brussels I recast arts. 17–19,
    under which jurisdiction agreements against consumers are largely ineffective.
  - In EU law, a choice-of-law term that leaves the consumer thinking only the chosen law applies
    can itself be unfair (CJEU C-191/15, *Amazon EU*).

  The clause says nothing about any of this, so it gives non-UK consumers an incomplete picture.
- **Authority:**
  - Rome I art. 6 (assimilated), https://www.legislation.gov.uk/eur/2008/593/article/6
  - CJEU C-191/15 (case; persuasive only in UK courts)
  - In UK courts, jurisdiction over non-UK consumers is governed by CJJA 1982 ss. 15B–15E (as
    inserted 2019)
  - All [reviewer knowledge; **VERIFY**]. Confidence: medium.
- **Proposal:**

  > *"If you live outside the United Kingdom, you also keep any protection that the law of your
  > country gives consumers and that cannot be excluded by agreement, and you may be able to bring
  > proceedings in your local courts."*

  **OCR:** whether Gridsmith actively markets to non-UK consumers. That fact drives the art. 6
  analysis.

**C-21 — Currency, bank charges and foreign taxes.** L-M · both (persona c) · commercial

- **Attack (c):** "Your quote was in GBP. My bank charged me £25 and you invoiced the shortfall.
  Who pays transfer fees? Who bears my country's withholding tax?"
- **Proposal:**

  > *"Prices are in pounds sterling unless the Scope says otherwise. Each party pays its own bank
  > charges. [B2B: The client pays any tax its own country requires it to withhold, grossed up so
  > that Gridsmith receives the invoiced amount, unless the Scope says otherwise.]"*

  **OCR** (with the accountant).

### C. Business Client Terms / MSA (persona b; persona c where noted)

**B-01 — The portfolio clause is automatic, against owner policy.** H · B · legal and commercial

- **Clause:** MSA cl. 9.4: "Gridsmith may identify the client and display non-confidential final
  work". The served basis line is "UK GDPR Art. 6(1)(f)".
- **Attack:** "I never agreed to be named. You put my unreleased rebrand in your portfolio the day
  it launched."
  - The clause directly contradicts the owner policy: no client name or work without explicit
    consent (brief; `GS-D001`).
  - Naming a sole trader is processing of personal data.
  - Cl. 10 ("use it only for the project") is in tension with cl. 9.4.
- **Authority:** owner policy (brief). UK GDPR art. 6(1)(f) balancing for sole traders
  [reviewer knowledge]. Confidence: high on the conflict.
- **Proposal (replace cl. 9.4):**

  > *"Gridsmith will not name the client, or show or describe the client's project, deliverables
  > or materials publicly, without the client's prior written permission for that specific use.
  > Permission may be withdrawn for future use at any time."*

**B-02 — The background IP licence is too narrow for software and websites.** H (Digital) · B · commercial

- **Clause:** MSA cl. 9.2: "licence to use it as part of that deliverable for the agreed purpose".
- **Attack:** "Your component library sits inside my site. The licence is 'perpetual' but
  revocable on its face (it doesn't say irrevocable). It isn't transferable if I sell my business
  and doesn't let my next developer modify it. 'Agreed purpose' is wherever the Scope happened to
  stop. I'm locked into you."
- **Proposal:**

  > *"…a perpetual, irrevocable, non-exclusive, royalty-free, worldwide licence to use, copy,
  > modify and maintain that background IP as part of the deliverable (and works derived from
  > it), to let contractors do so on the client's behalf, and to transfer the licence with the
  > deliverable. The client may not sell or license the background IP separately from the
  > deliverable."*

**B-03 — No title warranty and no IP infringement protection.** H · B (and C) · legal / commercial

- **Clause:** MSA cl. 9.3, cl. 15 and cl. 16.
- **Attack:** "Your designer used an unlicensed font and a scraped image. I received a claim. Your
  terms promise nothing about non-infringement, and any claim is capped at my fee."
- **Proposal:**

  > *"Gridsmith warrants that, so far as it knows after reasonable care, bespoke deliverables and
  > the materials it chooses to include do not infringe third-party rights, and that it has
  > obtained the licences it says it has. If a deliverable is found to infringe, Gridsmith will
  > at its cost replace or modify it, or obtain the needed licence."*

  **OCR:** whether infringement sits inside or outside the cap (B-04).

**B-04 — The liability cap is low, has no carve-outs, and relies on a self-referential saving.** M-H · B · legal (UCTA) / commercial

- **Clause:** MSA cl. 16: "total fees paid or payable to Gridsmith under that Scope" and "applies
  only to the extent it is fair and reasonable".
- **Attack (b):**
  - The cap is per Scope. A small Scope (one landing page) means a trivial cap, even for a data
    breach, a confidentiality breach, deliberate abandonment, or the B-03 infringement.
  - The cap is on written standard terms, so it must pass the reasonableness test (UCTA ss. 3 and
    11). For a cap to a specified sum, the court looks at resources and the availability of
    insurance (s. 11(4)). Choosing not to insure does not make insurance unavailable.
  - The "applies only to the extent it is fair and reasonable" wording invites an argument that
    the whole clause fails reasonableness and cannot be rewritten by the court.
  - The loss-of-profit and revenue exclusion runs only in Gridsmith's favour. For an e-commerce
    site, lost revenue *is* the direct loss.
- **Attack (c, foreign business):** UCTA ss. 2–7 may not operate where English law applies only
  by choice (s. 27(1)). But the clause's own "fair and reasonable" wording imports a contractual
  reasonableness test anyway. This works against Gridsmith, and is probably unintended.
- **Authority:** UCTA ss. 3, 11 and 27, https://www.legislation.gov.uk/ukpga/1977/50 [ledger
  L-UCTA-11, L-UCTA-26-27]. Confidence: medium.
- **Proposal:** **OCR (major commercial choice).** Options:
  1. **Keep the per-Scope cap.** Add a floor (*"the greater of the fees under that Scope and
     £[owner figure]"*). Carve out confidentiality, data-protection and IP-infringement breaches,
     and wilful abandonment, from the cap.
  2. **Keep the cap as it is** and accept the reasonableness risk.

  The conservative recommendation is option 1. Delete the "only to the extent…" sentence and rely
  on cl. 16's first paragraph and severance.

**B-05 — A Scope can quietly change the liability allocation.** M · B · legal / commercial

- **Clause:** MSA cl. 16: "A Scope may state a different liability allocation". MSA cl. 1: "the
  Scope prevails".
- **Attack:** "A one-line note in a quote reduced your liability to £100, and your MSA says the
  quote wins." A term the client was not specifically shown also weakens Gridsmith's UCTA
  "ought to have known" position.
- **Proposal:** *"A Scope may change clause 16 only in a separately headed 'Liability' section
  that the client has specifically accepted in writing."*

**B-06 — Termination by Gridsmith is loose, and a convenience right is implied but never
granted.** M · B · commercial

- **Clause:**
  - MSA cl. 7: "repeatedly fails to provide information… or payments" (no notice or cure);
    "becomes insolvent" (undefined).
  - MSA cl. 7: "If Gridsmith ends a project for its own convenience…". No clause grants that
    right.
- **Attack:** "Two late replies and you walked away. And can you just quit whenever you like?
  Who pays the extra cost of finishing elsewhere?"
- **Proposal:**
  - Add "…after written notice identifying the failure and a reasonable period to remedy it".
  - Define insolvency by reference to formal insolvency events.
  - Either delete the convenience sentence, or grant the right expressly with notice and handover
    of all work in progress (paid or not, pro rata): *"…and hand over all work in progress,
    which the client pays for under clause 6.2."* **OCR.**

**B-07 — "Ask Gridsmith to stop" is not the same as a right to terminate.** M · B · commercial

- **Clause:** MSA cl. 6: "The client may ask Gridsmith to stop a project…". "Effective
  cancellation date" is undefined.
- **Proposal:** *"The client may end a Scope at any time by written notice, effective on receipt
  or on a later date stated in the notice."* Then apply the F-04 wording.

**B-08 — The payment terms are unclear, and statutory interest may not apply abroad.** L-M · B (c) · commercial

- **Clause:** MSA cl. 5: "payable within 14 days" (from what?); "reasonable written notice"
  before suspension; "reserves its statutory rights under the Late Payment… Act".
- **Attack:**
  - "14 days from what: the invoice date or receipt?"
  - "Does the timetable extend while you are suspended?"
  - (c) The Late Payment Act may not apply where English law applies only by choice and there is
    no significant UK connection (s. 12) [reviewer knowledge; **VERIFY**]. The "reserved" right
    may then be empty.
- **Proposal:**
  - *"…within 14 days of the invoice date."*
  - *"Any suspension extends the timetable by at least the suspension period."*
  - **OCR:** a contractual interest rate for non-UK clients.

**B-09 — Acceptance and deemed approval.** L · B · commercial

- **Clause:** MSA cl. 8: "failure to comment within 10 working days may be evidence of
  acceptance". The "where reasonably possible" wording blurs the 10-day period.
- **Attack mostly fails.** The clause is evidential only, preserves latent defects, and is not a
  deemed-approval trap.
- **Proposal (optional):** add *"After a correction, the client has a further [10] working days to
  review the corrected item."*

**B-10 — Confidentiality is incomplete.** M · B · commercial

- **Clause:** MSA cl. 10: "use it only for the project".
- **Attack:**
  - There is no exception for disclosure to subcontractors or professional advisers, so
    Gridsmith breaches the clause each time it uses one.
  - There is no duration and no return or deletion on request.
  - It conflicts with cl. 9.4 (resolved by B-01).
- **Proposal:**

  > *"…may disclose it to its staff, subcontractors and professional advisers who need it for the
  > project and are bound by equivalent confidentiality. These obligations continue for [five]
  > years after the project ends, and indefinitely for trade secrets and personal data. On
  > request at the end of the project each party will return or delete the other's confidential
  > information, except copies it must keep by law."*

  **OCR:** the duration.

**B-11 — The data-processing terms are an agreement to agree.** M-H (Digital) · B · legal

- **Clause:** MSA cl. 11: "the parties will put in place any data-processing terms".
- **Attack:** "You host my site and its contact-form data, and run maintenance with access to my
  customer database. Art. 28 requires a binding contract with prescribed content *before* you
  process. Neither of us has one, so we're both exposed."
- **Authority:** UK GDPR art. 28(3), https://www.legislation.gov.uk/eur/2016/679/article/28
  [reviewer knowledge]. Confidence: high.
- **Proposal:** attach a short processing schedule (art. 28(3) content) that applies automatically
  whenever a Scope involves processing client personal data. The fallback is *"Gridsmith will not
  process the client's personal data as processor until the processing schedule is signed."*

**B-12 — Domains, hosting and credentials.** M-H · B (and C) · commercial

- **Clause:** MSA cl. 14: "credentials belonging solely to Gridsmith need not be transferred" and
  "infrastructure ownership… will be dealt with in the Scope".
- **Attack:** "My domain and hosting were bought under your account. The Scope was silent, so you
  say they're 'yours'." This is a classic small-business website dispute.
- **Proposal (default where the Scope is silent):**

  > *"Domains, hosting, repositories and third-party accounts bought or opened for the client's
  > project are registered to the client or, if that is not possible, transferred to the client
  > on request after payment of the related costs. Gridsmith hands over the access needed to run
  > the deliverable and keeps only its own internal tool credentials."*

**B-13 — The implied-terms exclusion is vague.** L · B · legal

- **Clause:** MSA cl. 15: "other terms are excluded only to the extent the law permits".
- **Attack:** "Does that exclude the implied term to perform within a reasonable time (SGSA
  s. 14)?" The wording is uncertain either way.
- **Proposal:** *"…but Gridsmith will perform within a reasonable time where the Scope fixes no
  date."*

**B-14 — Marketplace engagements (Freelancer.com).** M · B (c) · commercial / legal

- **Clause:** MSA cl. 17 mentions "marketplace". There is no precedence rule for platform terms.
- **Attack:** "I hired you through Freelancer. Its user agreement has its own IP-transfer,
  dispute and payment terms. Your MSA's cap and portfolio clause conflict with it. Which applies?"
- **Proposal:** **OCR.** State: *"Where a project is agreed and paid through an online
  marketplace, that marketplace's mandatory terms apply where they conflict with these terms;
  otherwise these terms apply."* The owner must check the actual platform terms. Competitor and
  platform text was not consulted here.

**B-15 — Assignment of the contract.** L-M · B · commercial

- **Clause:** MSA cl. 20: "except as part of a genuine business reorganisation or sale".
- **Attack:** "You can hand my contract and data to a buyer without asking me." At law, burdens
  cannot be transferred without consent (novation), so the clause over-promises to Gridsmith
  [reviewer knowledge].
- **Proposal:** *"Either party may assign its rights, but not transfer its obligations, without
  consent, except to a buyer of all or substantially all of its business that agrees in writing
  to be bound."* Combine with F-07 on subcontracting.

**B-16 — Exclusive English jurisdiction for foreign businesses.** M · B (c) · commercial / legal

- **Clause:** MSA cl. 21: "The courts of England and Wales have exclusive jurisdiction".
- **Attack (c, US client):** "You'd have to enforce an English judgment in Texas. And I'm not
  coming to Bolton over a £3,000 dispute."
  - The clause binds the client but may be practically unenforceable against it.
  - Whether the Hague 2005 and 2019 Conventions help depends on the client's country
    [reviewer knowledge; **VERIFY**].
- **Proposal:** **OCR.** Keep English law. Consider adding *"Gridsmith may also bring proceedings
  in the courts of the client's country"* (asymmetric, B2B only). Or decide that foreign projects
  are paid in advance by milestone, which is a commercial mitigation rather than a clause.

**B-17 — The notice rules have no deemed-receipt rule.** L · B · commercial

- **Clause:** MSA cl. 19.
- **Proposal:** *"An email notice is treated as received on the next business day after sending,
  unless the sender receives a delivery failure."*

### D. Website Terms, disambiguation page and public copy

**W-01 — The Website Terms describe a portfolio and prices that do not exist.** L-M · both · legal (misleading) / commercial

- **Clause:**
  - WEBSITE cl. 3: "Portfolio work, sample work, indicative pricing".
  - WEBSITE cl. 3: "Engineering drawings… displayed as portfolio examples".
  - WEBSITE cl. 4: "owned by Gridsmith Ltd, its licensors or the relevant client".
  - WEBSITE cl. 5: "Prices shown on this website are indicative".
- **Attack:** "Your terms imply that client work and prices are shown. The site says 'There is no
  public portfolio here'. Which is true?" `GS-D001` and `GS-D002` removed both. Describing
  non-existent content is low-risk, but it is inconsistent and invites a misleading-impression
  argument.
- **Proposal:** in cl. 5, *"This website does not publish prices. Every project is quoted."* Keep
  the VAT sentence. In cl. 3, delete the portfolio and engineering-drawing sentences, or reword to
  *"Examples and illustrations on this website are for general information only."* Delete
  "or the relevant client" and the last sentence of cl. 4.

**W-02 — Browse-wrap acceptance.** L · both

- **Clause:** WEBSITE cl. 1: "By using this website, you agree to use it lawfully…".
- **Attack fails in substance.** The obligations mostly restate the general law (computer misuse,
  copyright), and the cl. 10 business-reliance exclusion is narrow. If treated as a notice, it is
  tested under UCTA s. 11(3) [ledger L-UCTA-11]. No change.

**W-03 — "Open website form".** L · both · commercial

- **Clause:** WEBSITE cl. 6: "through an open website form".
- **Attack:** "Open? Is my enquiry public?" The forms POST over HTTPS to a Supabase function.
- **Proposal:** *"…through the website enquiry form, which is not designed for sensitive
  information,…"*

**W-04 — The business-reliance exclusion.** L · B

- **Clause:** WEBSITE cl. 10.
- **Attack fails.** It is limited to indirect loss from free general content where project advice
  was reasonable to seek. It is likely reasonable under UCTA s. 2(2) and s. 11 [ledger]. No
  change.

**D-1 — The disambiguation page misstates CRA s. 57.** M · C · legal (accuracy)

- **Clause:** `/legal/client-terms` 1.2: "the liability cap in the business terms would not bind
  you".
- **Attack (from Gridsmith's side, and a careful consumer's):**
  - The page says s. 57 makes a term non-binding to the extent it would "exclude or restrict"
    s. 49 or s. 50 liability. As recorded in the ledger, s. 57(1)–(2) bars *exclusion*.
    *Restriction* is barred only where it would stop the consumer recovering the price paid
    (s. 57(3)).
  - The MSA cap equals "fees paid or payable", so it does not fall below the price. Whether it
    would bind a consumer is a s. 62 fairness question, not an automatic s. 57 result.
  - The statement overstates consumer protection on a page labelled as legal information.
- **Authority:** CRA s. 57, https://www.legislation.gov.uk/ukpga/2015/15/section/57 [ledger
  L-CRA-57; **VERIFY** exact subsection wording]. Confidence: medium.
- **Proposal:**

  > *"Consumer law gives you rights the business terms do not reflect: for example, a term cannot
  > exclude our duty to use reasonable care and skill, cannot stop you recovering the price you
  > paid where you are entitled to it, and is not binding if it is unfair (Consumer Rights Act
  > 2015, sections 57 and 62)."*

**D-2 — The Press rights summary promises more than the terms, and states a review status that
no longer holds.** M · C · legal (CRA s. 50)

- **Clause:** `PressHome.tsx` l. 285–305: "These summarise the draft client terms, which are
  awaiting solicitor review."
- **Attack:** "Your page promised that authorship and credit would be agreed in writing, and that
  the Scope would fix the ISBN and publisher. Clause 10 says neither, and I relied on the page."
  - Statements about the service that a consumer takes into account are binding terms (s. 50).
  - The summary is therefore enforceable even where the terms are silent. That is good for the
    client, but it means the terms and the page diverge.
  - "Awaiting solicitor review" is no longer accurate under the GS-LEGAL-001 approach.
- **Authority:** CRA s. 50 [ledger L-CRA-50]. Confidence: high.
- **Proposal:** add the C-10 and C-14 wording to clause 10 so that the summary is a true summary.
  Change "awaiting solicitor review" to wording the owner approves, for example: *"These summarise
  our client terms. The terms themselves govern."* Do not use "approved", "compliant" or similar.
  **OCR.**

### E. Privacy and Cookie policies (the parts a client relies on)

**P-01 — The recipient list is wrong.** M-H · both · legal (UK GDPR art. 13(1)(e))

- **Clause:** PRIVACY cl. 6: "Vercel for website hosting and server execution".
- **Attack:** "Who actually gets my data?" Against the facts in the brief:
  - **Vercel is retired.**
  - **Hostinger** (host, and holder of access logs) is missing.
  - **Sanity** receives no visitor or lead data (it is read at build time).
  - The **email mailbox provider** for `contact@gridsmith.uk` is not named.
  - The **WhatsApp/SMS route** (Meta and the mobile carrier) is not named. Clients are invited to
    use it.
- **Authority:** UK GDPR art. 13, https://www.legislation.gov.uk/eur/2016/679/article/13 [reviewer
  knowledge]. Confidence: high.
- **Proposal:** rewrite the list from facts: Hostinger (hosting and logs); Supabase (enquiry
  database and intake function, EU region); Resend (notification email); [mailbox provider]; Meta
  WhatsApp, only if you message us there; accountants. Remove Vercel; remove Sanity or describe it
  accurately. **OCR:** the mailbox provider and WhatsApp account type.

**P-02 — International transfers are vague.** M · both · legal (art. 13(1)(f))

- **Clause:** PRIVACY cl. 7: "Some technology providers may process data outside the United
  Kingdom."
- **Attack (c especially):** "Which providers, which countries, and on what safeguard?" The brief
  places Supabase in eu-west-1 (Ireland). The location of Resend's processing is not recorded.
- **Proposal:** name each provider's location and safeguard. For example, *"Supabase (Ireland —
  covered by UK adequacy regulations for the EEA)"* [reviewer knowledge; VERIFY], and Resend
  [location and safeguard, **OCR**]. The current sentence ("rather than promising a processing
  region") reads as a refusal to inform.

**P-03 — Retention of client project material.** M · both · legal (art. 5(1)(e)) / commercial

- **Clause:** PRIVACY cl. 8: "We do not currently operate an automated deletion schedule…".
- **Attack (a):** "How long do you keep my manuscript and my family's private details after
  publication?"
- **Proposal:** **OCR**. Set owner-chosen periods for (i) unconverted enquiries and (ii) project
  materials after completion, with deletion on request subject to legal-records duties. Do not
  invent figures here.

**P-04 — Third parties' data inside client materials.** M · C (Press memoir) · legal

- **Attack:** "My memoir names living relatives. Are you controller or processor of their data?
  Who answers their access request?" Neither the consumer terms nor the privacy policy says.
- **Proposal:** **OCR**, for the privacy workstream: a short Press clause allocating roles for
  third-party personal data in manuscripts.

**P-05 — The master contact form has no privacy notice at the point of collection.** L-M · both · legal (art. 13 timing)

- **Finding:** `components/leads/ContactForm.tsx` and `app/(marketing)/contact/page.tsx` contain no
  privacy-notice link near the form. The Press form links "privacy notice" (`PressContactFlow.tsx`
  l. 448). The footer link may suffice, but parity with the Press form is the conservative course.
- **Proposal:** add the same sentence and link used on the Press form (a code change for another
  phase; not edited here).

**K-01 — The cookie notice.** L · both

- **Attack:** "Your cookie is called `gs_consent`, yet you say there is nothing to consent to."
  The code sets one first-party cookie with `Max-Age` 365 days (`lib/consent/state.ts` l. 39 and
  l. 59), matching the policy's "Up to 365 days". No `localStorage` or `sessionStorage` use was
  found in `app/`, `components/` or `lib/` (grep).
- **Attack fails** on substance. The name is cosmetic. Whether the dismissal cookie falls within
  the reg. 6(4) strict-necessity exemption, or any later DUAA 2025 exemption, is for the PECR
  workstream [**VERIFY**].

### F. Subscription and retainer contracts (foreseeable)

**R-01 — Consumer maintenance retainers.** M (if offered) · C · legal

- **Attack:** "I'm on a monthly website-care plan that renews automatically. Where are the
  reminders and the easy exit?" The DMCCA 2024 Part 4 Chapter 2 subscription-contract regime
  would apply to consumer auto-renewing contracts once commenced. Commencement: **VERIFY**
  [reviewer knowledge]. The terms say nothing about retainers.
- **Proposal:** **OCR**. Either do not offer consumer auto-renewing retainers, or have a separate
  subscription schedule drafted once the regime's commencement and content are verified.

## 3. Attacks that fail (recorded so they are not re-raised)

| Clause | Attack | Why it fails |
|---|---|---|
| CONSUMER cl. 14 | "Your liability clause hides a cap." | There is no cap. Liability is for foreseeable loss, and mandatory liability is preserved. It is consumer-favourable. Commercially it is uncapped exposure for Gridsmith, which is an **owner awareness** point, not a client attack. |
| CONSUMER cl. 5 | "You can force extra charges for changes." | Additional work proceeds "only after you agree", and statutory rights in the original service are preserved. (C-04 is a clarity point only.) |
| CONSUMER cl. 6.2, final sentence | "You'll charge me even when the CCRs say I owe nothing." | Expressly excluded: "Nothing in this section allows us to charge you…". |
| MSA cl. 8 | Deemed approval. | It is only "evidence", and latent defects are preserved. |
| MSA cl. 5 | "VAT will be added later." | It expressly says not, and future VAT is identified in advance. Website cl. 5 says the same. |
| MSA cl. 13 / CONSUMER cl. 10.2 | "You'll take my royalties." | Both expressly disclaim royalties and ownership of the book. |
| WEBSITE cl. 10 | "This excludes everything." | It is limited to business users, indirect loss and free general content. |
| COOKIE cl. 1–2 | "You track me." | The code matches the policy: one first-party cookie and no analytics. |
| All | Unilateral price variation. | No document allows Gridsmith to change an agreed price. Changes need agreement (CONSUMER cl. 4–5, MSA cl. 4). F-02 concerns *term* versions, not price. |

## 4. OWNER CONFIRMATION REQUIRED (consolidated)

| Ref | Decision | Options | Conservative recommendation |
|---|---|---|---|
| F-01 | Incorporation and acceptance mechanics | Written acceptance of Scope plus terms before payment / payment as acceptance | Written acceptance; never payment or silence |
| F-02 | Versioned archive of terms | Versioned URLs / PDF attached to each Scope | Both: name the version in the Scope and attach a PDF |
| F-04, C-08 | Refund timing after an early end | 14 days from statement / other | 14 days (mirrors the CCR reg. 34 rhythm) |
| F-06 | Any non-refundable sums (B2B only) | Never / stated and justified in Scope | Consumers never; B2B only if stated and justified |
| F-07 | Press disclosure of who writes | Disclose / not | Disclose before work starts |
| F-09 | AI-use policy | — | Decide, then state in one sentence |
| C-01 | Technical wording (GS-X002) | Adopt the boundary text in both instruments | Adopt |
| C-05 | Phone as a contract contact route | Yes / no | Include it, since it is published |
| C-10 | Moral-rights waivers from writers | Procure / not | Procure for ghostwriting |
| C-13 | Use before full payment | Stage licences / none | Stage licences |
| C-16 | ADR statement | Depends on regime verification | Include once verified |
| C-17, C-18 | Delay and dormancy periods | Scope-specific | Set per Scope; no default number invented here |
| C-19 | Consumer classification rule | Segment-based / individual-default | Individual-default |
| C-20 | Whether non-UK consumers are targeted | — | Add the "keep your home-law protections" sentence anyway |
| C-21 | Currency, bank charges, withholding | — | GBP; own charges; B2B gross-up (with accountant) |
| B-04, B-05 | Cap level and carve-outs | Per-Scope cap with floor and carve-outs / status quo | Floor plus carve-outs; highlighted Scope variations only |
| B-06 | Convenience termination | Delete / grant with handover | Delete |
| B-08 | Interest for non-UK B2B | Statutory / contractual rate | Contractual rate (owner and accountant) |
| B-10 | Confidentiality duration | — | Owner choice; indefinite for personal data |
| B-14 | Marketplace precedence | — | State it after checking the platform terms |
| B-16 | Foreign B2B disputes | Exclusive / asymmetric / payment-in-advance | Asymmetric clause plus milestone pre-payment |
| P-01 to P-04 | Privacy facts (mailbox, WhatsApp, Resend region, retention periods, memoir roles) | — | Supply facts; no invented periods |
| R-01 | Consumer auto-renewing retainers | Offer / not | Not, until the regime is verified |
| S-1, D-2 | Public "Basis" lines and "awaiting solicitor review" copy | Remove / re-verify | Remove basis lines; reword review status |

## 5. Priority order (strongest attacks first)

1. **B-01** — the MSA portfolio clause contradicts owner policy outright.
2. **C-01** — "engineering design" wording in both instruments contradicts GS-X002.
3. **F-03, F-04, C-09** — the start trigger is undefined, the work-to-date valuation has no
   method, and the consumer can leave only "if we agree". Together these undermine the owner's
   own refund intent and carry CRA Sch. 2 exposure.
4. **F-01** — incorporation and acceptance before payment is never stated.
5. **F-05, C-03** — undisclosed third-party costs and "agreement where required" (CCR reg. 40).
6. **B-02, B-03, B-12** — Digital lock-in (background licence, no infringement cover,
   domain and hosting ownership).
7. **C-11, C-12** — the consumer IP clauses contradict each other, and the assignments may lack
   s. 90(3) formality.
8. **F-08, C-10** — no consumer confidentiality, and ghostwriting moral rights unaddressed.
9. **P-01, D-1, D-2, S-1/S-2** — public accuracy defects: wrong recipients, the s. 57 overstatement,
   the Press summary versus clause 10, and stale or revoked basis citations.
10. **C-20, B-16, C-21** — the position of clients outside the UK is undocumented.
