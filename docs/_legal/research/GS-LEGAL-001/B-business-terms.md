# GS-LEGAL-001 — Agent B: business client terms (`MSA-BUSINESS.md` v2.0)

Review date: **6 October 2026**. Reviewer: Agent B (B2B contract / liability / IP).
Subject: `docs/_legal/MSA-BUSINESS.md` **Version 2.0, effective 2 September 2026** (served at
`/legal/business-client-terms` from `scripts/seed-legal.mjs`; the served text matches the draft,
including §9.4 and §16 checked by grep). Read alongside `CONSUMER-TERMS.md`, `WEBSITE-TERMS.md`,
`00-LEGAL-BASIS.md`, `02-CITATION-LEDGER.md` §I, `03-REVISION-LOG.md` (MSA sections, rounds 3, 7,
8, 9, 12) and `LEGAL-LAUNCH-CHECKLIST.md`.

**What this is not.** This is a research review against current primary legislation and official
material. It is not legal advice, not solicitor review, and does not make any clause "enforceable"
or "compliant". Where enforceability turns on facts or on the reasonableness test, that is said.

**Important history finding.** Revision-log rounds 7–12 describe an MSA **v1.x** with numbered
clauses that no longer exist (6.4 late-payment figures, 7.4 deemed acceptance, 8.3 assignment,
11.3–11.8 cap/PI limit, 12.3 implied-warranty exclusion, 15 e-commerce, 16 marketing, Schedules
A–C). **v2.0 is a shorter rewrite**: it dropped the Schedules, the 12-month notification bar, the
e-commerce clause, the PI-limit `[TK]`, and changed the cap from a `[TK]` to "fees paid or
payable". Ledger entries `L-UCTA-*`, `L-LATE-PAYMENT`, `L-CDPA-90-91` still cite the old clause
numbers. Their legal content was re-verified below; their clause pointers are stale.

---

## 0. Method and source limits

- Primary texts were read on legislation.gov.uk on 6 Oct 2026 (WebFetch, then direct `curl` of the
  same pages after the web tool hit a session limit). Each page's own status line was recorded
  ("no known outstanding effects" / "up to date with all changes known to be in force on or before
  05/06 October 2026").
- Case law: only the UK Supreme Court's own press summary for *Cavendish v Makdessi* [2015] UKSC 67
  was read at source. Every other case named below is **UNVERIFIED (not read this session)** and is
  named only to show where the owner's later adviser should look. No conclusion here rests on an
  unread case alone.
- The pending **Commercial Payments Bill [HL]** was located on bills.parliament.uk by search, but
  the bill pages returned HTTP 403. Its content and stage come from a secondary source (Harper James,
  16 July 2026) and are marked accordingly. It is **not law** at the review date.

### Authority register (all retrieved 6 Oct 2026)

| ID | Authority | Exact provision | URL | Type | Status read |
|---|---|---|---|---|---|
| A1 | Unfair Contract Terms Act 1977 | s. 2(1)–(4) | https://www.legislation.gov.uk/ukpga/1977/50/section/2 | primary | no outstanding effects |
| A2 | UCTA 1977 | s. 3(1)–(3) | https://www.legislation.gov.uk/ukpga/1977/50/section/3 | primary | no outstanding effects |
| A3 | UCTA 1977 | s. 7(1A), (3A), (4), (4A) | https://www.legislation.gov.uk/ukpga/1977/50/section/7 | primary | no outstanding effects |
| A4 | UCTA 1977 | s. 11(1)–(5) | https://www.legislation.gov.uk/ukpga/1977/50/section/11 | primary | no outstanding effects |
| A5 | UCTA 1977 | s. 13(1)–(2) | https://www.legislation.gov.uk/ukpga/1977/50/section/13 | primary | no outstanding effects |
| A6 | UCTA 1977 | Sch. 1 para. 1(c) | https://www.legislation.gov.uk/ukpga/1977/50/schedule/1 | primary | up to date |
| A7 | Misrepresentation Act 1967 | s. 3 | https://www.legislation.gov.uk/ukpga/1967/7/section/3 | primary | no outstanding effects |
| A8 | Supply of Goods and Services Act 1982 | ss. 12, 13, 16 | https://www.legislation.gov.uk/ukpga/1982/29/section/13 (and /12, /16) | primary | in force E+W+NI; s. 12(1) excludes CRA Ch. 4 contracts |
| A9 | Late Payment of Commercial Debts (Interest) Act 1998 | ss. 2, 4, 5A, 8, 9, 12 | https://www.legislation.gov.uk/ukpga/1998/20/contents | primary | whole Act: no outstanding effects |
| A10 | Late Payment of Commercial Debts (Rate of Interest) (No. 3) Order 2002, SI 2002/1675 | art. 4 | https://www.legislation.gov.uk/uksi/2002/1675/article/4 | primary (SI) | read |
| A11 | Commercial Payments Bill [HL], Session 2026–27 | whole Bill | https://bills.parliament.uk/bills/4128 (403); summary https://harperjames.co.uk/news/uk-late-payment-reforms/ | secondary (bill not law) | committee stage HL from 21 Jul 2026 per secondary source |
| A12 | Copyright, Designs and Patents Act 1988 | ss. 9(3), 11, 78, 79, 81, 84, 87, 90, 91, 178 ("computer-generated"), 215 | https://www.legislation.gov.uk/ukpga/1988/48/section/91 (and siblings) | primary | each: no outstanding effects |
| A13 | Copyright and Rights in Databases Regulations 1997, SI 1997/3032 | regs. 14, 15 | https://www.legislation.gov.uk/uksi/1997/3032/regulation/14 | primary (SI) | no outstanding effects |
| A14 | Report on Copyright and Artificial Intelligence (DSIT/DCMS/IPO, 18 Mar 2026, under DUAA 2025 s. 136) | CGW section | https://www.gov.uk/government/publications/report-and-impact-assessment-on-copyright-and-artificial-intelligence | official guidance/policy (search-result summary only; full report not read) | proposal, not law |
| A15 | Contracts (Rights of Third Parties) Act 1999 | s. 1(1)–(3) | https://www.legislation.gov.uk/ukpga/1999/31/section/1 | primary | no outstanding effects |
| A16 | Electronic Communications Act 2000 | s. 7 | https://www.legislation.gov.uk/ukpga/2000/7/section/7 | primary | no outstanding effects |
| A17 | Law Commission, *Electronic execution of documents* (Law Com No 386, 2019); Govt response Mar 2020 | statement of the law | https://lawcom.gov.uk/project/electronic-execution-of-documents/ | official (law reform body) | project complete |
| A18 | Electronic Commerce (EC Directive) Regulations 2002, SI 2002/2013 | reg. 9(1)–(4) | https://www.legislation.gov.uk/uksi/2002/2013/regulation/9 | primary (SI) | no outstanding effects |
| A19 | UK GDPR | Art. 28(1)–(10) | https://www.legislation.gov.uk/eur/2016/679/article/28 | primary (assimilated) | no outstanding effects by UK legislation |
| A20 | Insolvency Act 1986 | s. 233B; Sch. 4ZZA | https://www.legislation.gov.uk/ukpga/1986/45/section/233B | primary | up to date to 6 Oct 2026; future changes may be commenced |
| A21 | Construction (Design and Management) Regulations 2015, SI 2015/51 | reg. 2(1) ("design", "designer", "structure"); reg. 9 | https://www.legislation.gov.uk/uksi/2015/51/regulation/2 | primary (SI) | reg. 9 no outstanding effects |
| A22 | Building Regulations 2010, SI 2010/2214 (England) | reg. 2 ("design work", "designer"); Part 2A regs. 11A, 11F (inserted 1 Oct 2023 by SI 2023/911) | https://www.legislation.gov.uk/uksi/2010/2214/regulation/11F | primary (SI) | up to date to 5–6 Oct 2026; future changes may be commenced |
| A23 | *Cavendish Square Holding BV v Makdessi; ParkingEye v Beavis* [2015] UKSC 67 | press summary paras on test [32], [152], [234–241], [255] | https://supremecourt.uk/uploads/uksc_2013_0280_press_summary_704e24a9f6.pdf | case (press summary only) | read |
| A24 | HCCH status table, 2019 Judgments Convention | UK row | https://www.hcch.net/en/instruments/conventions/status-table/?cid=137 | official (treaty depositary) | UK ratified 27 Jun 2024, in force 1 Jul 2025 |

---

## 1. Headline findings (ranked by exposure)

1. **§9.4 Portfolio use contradicts owner policy.** It grants Gridsmith an automatic right to name
   the client and show final work unless the Scope says otherwise. Owner policy (brief; `GS-D001`)
   is **no portfolio use without the client's explicit consent**. Must be inverted to opt-in.
   Confidence high. No owner decision needed: the policy already exists.
2. **§12 Technical is wider than the `GS-X002` boundary.** It speaks of "engineering ... design
   services", "the design task Gridsmith has accepted", and lists certification and independent
   sign-off as available "where expressly stated in the Scope". That implies Gridsmith can take
   on what the owner says it never does. Separately, and this is a fact no wording can fix,
   **statute can make Gridsmith a "designer" whatever the contract says.** CDM 2015 reg. 2(1)
   defines "design" to include drawings relating to a structure. It defines "designer" as anyone who,
   in the course of business, prepares or modifies a design. Building Regulations 2010 reg. 2
   defines "designer" by reference to "design work" (design of any building work), and reg. 11F
   imposes competence requirements. Construction-related drawing work therefore carries statutory
   duties that a contract can't remove. **OWNER CONFIRMATION REQUIRED** (OC-1).
3. **The liability cap (§16) is a reasonableness question, not a wording question.** "Total fees
   paid or payable under that Scope" is a common structure. Under UCTA s. 11(4), though, the court
   looks at Gridsmith's resources and how far it could have insured, and Gridsmith carries no PI
   cover. Gridsmith carries the burden (s. 11(5)). The self-referential saving sentence ("applies
   only to the extent it is fair and reasonable") adds nothing and may suggest that Gridsmith doubted the cap. **OWNER
   CONFIRMATION REQUIRED** (OC-2).
4. **§7 insolvency termination is partly ineffective by statute.** Insolvency Act 1986 s. 233B(3)
   provides that a supplier's right to terminate *because* a client company enters a relevant
   insolvency procedure "ceases to have effect". s. 233B(4) freezes earlier termination rights
   during the insolvency period. s. 233B(7) bars making new supply conditional on pre-insolvency
   arrears. Sch. 4ZZA, as read, contains no small-supplier exclusion. Confidence high.
5. **IP chain gaps (§9).** The clause has no duty on Gridsmith to obtain written assignments from
   subcontractors before it assigns to the client (CDPA s. 11(1), s. 90(3)). Drafts, unselected
   concepts, working and source files are not addressed. There is no interim licence before payment
   and no IP outcome on cancellation. Moral rights (s. 87 waivers, s. 78 assertion) are not
   addressed, which matters for ghostwriting. There is no AI-assisted-material position.
6. **Data protection (§11) is an agreement to agree.** UK GDPR Art. 28(3) requires a binding
   written contract containing the (a)–(h) terms *when processing happens*. A promise to "put in
   place any data-processing terms required by law" is not that contract.
7. **Missing boilerplate with real effect:** formation and exclusion of the client's own terms
   (battle of forms), entire agreement and non-reliance (Misrepresentation Act 1967 s. 3), variation
   in writing, survival, e-signature/counterparts, a subcontracting clause, and a clear assignment
   clause. §20's current assignment wording is vague.
8. **Late payment (§5) is broadly sound because it is minimal.** It reserves the statutory regime and
   substitutes no contractual rate, so the "substantial remedy" rule (s. 8–9) is not engaged. Keep it
   that way. The pending Commercial Payments Bill would make statutory interest non-excludable, and
   the current drafting is compatible with that.
9. **VAT statement (§5).** It says Gridsmith "is not currently registered for VAT". The brief records
   VAT status as **unknown**. A false statement in the contract would be a misrepresentation risk.
   **OWNER CONFIRMATION REQUIRED** (OC-9).

---

## 2. Clause-by-clause review

Format per clause: **Current** · **Assessment** · **Required change** · **Authority** ·
**Confidence** · **Owner decision?** All authorities were retrieved 6 Oct 2026 (see register §0).

### Header and §1 Application

- **Current.** Identifies Gridsmith Ltd, company 17050842, "Bolton", trading divisions. §1: the MSA
  applies only where the client acts for trade/business purposes. A project = MSA + Scope (quotation,
  SOW, proposal, order confirmation, change order). Precedence runs Change Order > Scope > MSA.
- **Assessment.**
  - (a) *Formation is not stated.* Nothing says when the contract is made, what counts as
    acceptance, or that the client must have the MSA before acceptance. Incorporation of standard
    terms requires reasonable notice before or at contract formation (general contract law; no
    statute read). The brief's commercial process (terms and scope accepted before any payment)
    should be written in.
  - (b) *Battle of forms.* Nothing excludes the client's purchase-order or supplier terms. In English
    law the last set of terms put forward and accepted by conduct tends to prevail. *Butler Machine
    Tool v Ex-Cell-O* [1979] and *Tekdata v Amphenol* [2009] EWCA Civ 1209 are **UNVERIFIED** here.
    An express exclusion is cheap protection, though it is not decisive if the client later sends a
    PO that Gridsmith accepts by performing.
  - (c) *Precedence.* "Scope prevails over this MSA" lets any loosely drafted quotation silently
    override the liability cap, IP or payment protections. A Scope should override the MSA only where
    it says expressly which MSA clause it varies.
  - (d) *Business status.* The client's status is a fact, not a label. An individual author may be a
    consumer even if they sign a "business" Scope: CRA 2015 s. 2(3), "wholly or mainly outside", is
    restated in `CONSUMER-TERMS.md` §1. The MSA cannot remove consumer rights from a consumer. Add a
    client confirmation of status, and an internal process: if in doubt, use the consumer terms.
  - (e) *E-commerce information.* SI 2002/2013 reg. 9(4) disapplies reg. 9(1)–(2) for contracts
    concluded exclusively by email. Reg. 9(3) (terms available in a form that can be stored and
    reproduced) **always applies** and cannot be excluded. v2.0 dropped the old clause 15. Nothing
    more is needed in the MSA if the MSA is sent as a PDF or stable versioned link with each Scope.
- **Required change.** Add a formation/incorporation clause, an exclusion of client terms, express-
  override-only precedence, and a business-status confirmation (Proposal P1).
- **Authority.** A18 reg. 9(3)–(4) (primary). CRA 2015 s. 2(3) via `CONSUMER-TERMS.md`; s. 2(3) was
  not re-fetched this session, so mark the citation **UNVERIFIED** this session (ledger
  `L-CRA-*` read it in Aug 2026).
- **Confidence.** High that the gaps exist; medium on the battle-of-forms law (cases unread).
- **Owner decision?** No (drafting). Process item: always send the versioned MSA with the Scope.

### §2 Scope

- **Current.** No work beyond the agreed Scope. The Scope "should identify, as appropriate" a list
  of matters including price/payment schedule, acceptance requirements and project-specific risk or
  liability terms.
- **Assessment.** Good structure. It matches the brief's model: no fixed percentages, the Scope
  records the arrangement. "Should ... as appropriate" is soft. If the Scope omits the payment
  structure, the only default is §5's 14 days. Add explicit defaults (Proposal P2): if no schedule,
  then invoicing on completion of each stated stage or monthly in arrears. Also have the Scope list
  third-party licences (fonts/stock/plugins) and who holds them, the AI-use position (see §9), and
  for Technical work the information sources relied on.
- **Authority.** Contract drafting; SGSA 1982 s. 15 (reasonable charge where no price is fixed) is
  **UNVERIFIED this session** (s. 13 and s. 16 were read).
- **Confidence.** High. **Owner decision?** No.

### §3 Client responsibilities and client delay

- **Current.** The client provides materials, information, access, approvals and feedback. It
  warrants rights in the materials it supplies. Delays "may extend the timetable".
- **Assessment.** Adequate as a minimum but weak on consequences. There is nothing on (i) Gridsmith
  not being liable for delay caused by the client, (ii) chargeable costs of re-mobilisation, or (iii)
  what happens when a project goes dormant (Gridsmith can't plan capacity and holds unpaid work).
  The client warranty has no remedy attached (see indemnities, §16).
- **Required change.** Proposal P3: the timetable extends day for day; Gridsmith is not liable for
  resulting delay. If the client's delay exceeds a period set in the Scope, or failing that a default
  (owner figure), Gridsmith may invoice work done to date. If the delay continues after written
  notice, Gridsmith may treat the project as cancelled under §6. Extra costs caused by client delay
  are payable only at rates stated in the Scope or by Change Order. **No unilateral new charges.**
- **Authority.** UCTA s. 3(2)(b) (A2): a term letting Gridsmith render performance "substantially
  different" or no performance is subject to reasonableness. Tie the dormancy right to client default
  and written notice to keep it defensible.
- **Confidence.** Medium-high. **Owner decision?** **Yes — OC-3**: the dormancy period (options 30 /
  60 / 90 days of client inactivity after written notice; conservative recommendation: 60 days plus
  a further 14 days' written notice).

### §4 Changes and additional work

- **Current.** Reasonable changes within the revision allowance are included. A material change is
  defined. Gridsmith is not required to do material out-of-scope work without agreement. Gridsmith
  "may issue a Change Order"; work begins after acceptance.
- **Assessment.** This meets the brief's rule: additional work only by agreed change, never by
  unilateral reclassification. Two gaps remain. (i) Nothing says what happens when the parties
  disagree whether a request is in scope. Gridsmith should continue in-scope work, and disputed work
  is not chargeable unless agreed. (ii) "Signed or expressly accepted" Change Order should be defined
  to include email acceptance, because that is how Gridsmith contracts.
- **Required change.** Proposal P4.
- **Authority.** Contract drafting. **Confidence.** High. **Owner decision?** No.

### §5 Fees, invoices, taxes, suspension, late payment

- **Current.** Fees and stages are in the Scope. Default 14 days. A VAT statement. Gridsmith may
  suspend work on an overdue undisputed invoice after reasonable written notice. "Reserves its
  statutory rights" under the 1998 Act "and related legislation".
- **Assessment.**
  - *Flexible structures.* Correctly left to the Scope. For clarity, name the permitted structures
    without fixing percentages (full upfront, deposit/balance, milestones, instalments, retainer,
    other agreed schedule). State that any advance payment is a payment on account of the price for
    the work. That ties advance payments to the §6 refund mechanism and avoids any "non-refundable"
    character by default. LPA 1998 s. 11 (treatment of advance payments) exists but was not read in
    full this session (**UNVERIFIED** detail).
  - *Late payment.* The Act applies to contracts for the supply of services where purchaser and
    supplier each act in the course of a business (s. 2(1)). Statutory interest runs from the day after
    the "relevant day": the agreed payment day, or failing one the last day of the 30-day period
    (s. 4). The rate is 8% a year over the official dealing rate in force on the preceding 30 June or
    31 December (SI 2002/1675 art. 4). Fixed compensation is £40 / £70 / £100 by band (s. 5A(2)),
    plus reasonable recovery costs above the fixed sum (s. 5A(2A), inserted by the Late Payment of
    Commercial Debts Regulations 2013 from 16 Mar 2013). The MSA substitutes no contractual rate, so
    s. 8 (statutory interest can be ousted or varied only by a "substantial remedy", defined in s. 9)
    is not engaged. **Recommendation: do not introduce a contractual interest rate.** A lower rate
    would risk being void under s. 8(4). The pending Bill (A11) would remove the ability to vary
    statutory interest at all. Stating the mechanism briefly in the clause helps clients, but **do
    not print a computed percentage**: it changes six-monthly.
  - *Conflict of laws for foreign clients.* s. 12(1): the Act does not apply where English law
    applies only by choice, there is no significant connection with England, and a foreign law would
    otherwise apply. Gridsmith performs in England, which is very likely a significant connection, so
    s. 12(1) should rarely bite. Rome I art. 4 (services → provider's habitual residence) was **not
    read this session** (**UNVERIFIED**).
  - *Suspension.* Reasonable and limited to undisputed sums. Add: the timetable extends, Gridsmith is
    not liable for delay caused by suspension, and work resumes on payment. Define "reasonable
    written notice" (owner figure, OC-4). **Insolvency overlay:** if the client is a company in a
    relevant insolvency procedure, s. 233B(7) bars making continued supply conditional on payment of
    pre-insolvency charges, and s. 233B(3) neutralises "any other thing" done because of the
    insolvency. Make the suspension right subject to that.
  - *Disputed invoices.* Add a short duty to raise disputes promptly with reasons and pay the
    undisputed part. That fits the direction of the pending Bill (secondary source: late or
    insufficient dispute notices would attract compensation).
  - *No set-off clause:* none present. Recommend **not** adding one. A no-set-off clause is
    treated as a restriction of remedy under UCTA s. 13(1)(b) and needs reasonableness. *Stewart
    Gill v Horatio Myer* [1992] is **UNVERIFIED** here.
  - *VAT.* See OC-9. The brief records VAT status as **unknown**.
- **Authority.** A9 ss. 2, 4, 5A, 8, 9, 12 (primary). A10 art. 4 (primary). A11 (secondary, bill).
  A20 s. 233B (primary). A5 s. 13 (primary).
- **Confidence.** High on the statutory figures and mechanism. Medium on the Bill's content/stage.
- **Owner decision?** **Yes — OC-4** (suspension notice period: 7 days recommended), **OC-9** (VAT
  fact).

### §6 Cancellation and termination by the client; refund calculation; deposits

- **Current.** The client may stop at any time by written notice. Before work starts: refund less
  authorised non-refundable third-party cost. After work starts: pay for work "reasonably
  performed", reimburse unrecoverable committed third-party costs, refund the balance; the refund
  may be zero. "Not a cancellation penalty."
- **Assessment.**
  - *Penalty doctrine.* Per the Supreme Court's own summary of *Makdessi* (A23), the rule "regulates
    only the contractual remedy available for the breach of primary contractual obligations", i.e.
    secondary obligations triggered by breach. The test is whether a provision imposes a detriment
    "out of all proportion to any legitimate interest of the innocent party" [32]. Lord Hodge [234–241]
    confirms it can apply to forfeiture of a non-refundable deposit "not reasonable as earnest
    money". §6 is drafted as the exercise of a **contractual right to stop**, not a breach, and its
    payment is measured by work done and costs committed. That is the safest position: it is
    primarily a price-for-work-done term, not a secondary obligation. Medium-high confidence. The
    characterisation would be tested if the client's "cancellation" were really a repudiation; keep
    the measure proportionate so that it survives either way.
  - *"Reasonably performed" is undefined.* This is the weakest point. It invites argument about
    value. A defensible proportional basis should be stated in an order of priority:
    1. completed milestones or stages at their Scope price;
    2. for a stage in progress, the proportion of that stage's deliverables completed. Where the
       Scope states a day or hourly rate, use time reasonably spent at that rate, capped at the stage
       price;
    3. non-cancellable third-party commitments incurred with the client's prior authority, net of
       anything recoverable;
    4. never more than the total Scope price.
    This is objective, evidenced by working records, and not discretionary. **No percentage is
    invented.**
  - *IP and deliverables on cancellation.* Not addressed. Paid-for completed work should be
    delivered and assigned (mirrors §7's convenience wording).
  - *Deposits.* There is no deposit clause, which is correct as a default. A **non-refundable
    deposit** in B2B is not automatically unlawful. It can be defended where it is (i) stated in the
    Scope before acceptance, (ii) modest, and (iii) linked to a real interest, such as reserving
    capacity and turning away other work. It is also safer framed as consideration for a primary
    obligation (a "reservation fee" payable for securing a start date) than as forfeiture on
    cancellation. Even so, *Makdessi* (Lord Hodge) shows an unreasonable deposit can be penal. It
    also conflicts with the owner's stated refund intent ("no substantive work → normally return the
    refundable amount"). **Conservative recommendation: do not use non-refundable deposits;** treat
    all advance payments as payments on account, refundable under §6's formula. If the owner wants a
    reservation fee for specific projects, include it only in the Scope, with its amount and
    rationale stated, and never in consumer Scopes.
- **Required change.** Proposal P6 (valuation basis; IP on cancellation; deposits).
- **Authority.** A23 (case, press summary). UCTA s. 3(2)(b) is not engaged (the client's own right).
- **Confidence.** Medium-high. **Owner decision?** **Yes — OC-5** (deposit policy: none [recommended]
  / reservation fee per Scope only).

### §7 Termination by Gridsmith

- **Current.** Gridsmith may terminate or suspend on written notice for unremedied material breach,
  repeated failure to provide information or payments, a request to act unlawfully, or insolvency.
  "If Gridsmith ends a project for its own convenience ..." the client receives paid completed work
  and a refund for work not performed.
- **Assessment.**
  - *Insolvency limb.* For a client **company** entering a relevant procedure (moratorium,
    administration, administrative receivership, CVA, liquidation, provisional liquidation, or a CA
    2006 s. 901C(1) order), s. 233B(3) makes the termination right "cease to have effect". Gridsmith
    may then terminate only with office-holder or company consent, or court permission on hardship
    (s. 233B(5)). Sch. 4ZZA lists financial-services and essential-supply exclusions; none fits
    Gridsmith. Redraft as "to the extent permitted by law" and do not rely on it.
  - *Convenience.* The clause assumes a convenience right that it never grants. A term entitling a
    party to render "no performance at all" is within UCTA s. 3(2)(b)(ii) and needs reasonableness
    where the client deals on Gridsmith's written standard terms (s. 3(1)). Either grant an express,
    fair right (written notice, deliverables plus assignment for paid work, refund of unearned sums,
    reasonable handover help) or delete it. The fair version is defensible and useful for a small
    business. Recommend the express version.
  - *Consequences of termination* (any cause) are missing: accrued rights, payment for work done,
    return of client materials, survival.
- **Required change.** Proposal P7.
- **Authority.** A20 s. 233B(2)–(7), Sch. 4ZZA (primary). A2 s. 3(2)(b)(ii) (primary).
- **Confidence.** High (s. 233B). Medium (reasonableness).
- **Owner decision?** **Yes — OC-6**: keep a convenience-termination right? (recommended: yes,
  with 14 days' written notice and the client protections above).

### §8 Delivery, review and acceptance

- **Current.** The client reviews promptly and identifies material non-conformity within 10 working
  days "where reasonably possible". Gridsmith corrects at no charge. Use, or silence for 10 working
  days, "may be evidence of acceptance of apparent conformity" but does not remove liability for
  latent defects or non-excludable liability.
- **Assessment.** This is a fair, non-trap formulation. It is evidential rather than extinguishing,
  and it carves out latent defects. UCTA s. 13(1) treats terms making liability "subject to
  restrictive or onerous conditions" or "excluding or restricting any right or remedy" as exclusions.
  A hard deemed-acceptance that extinguished claims would need reasonableness. The current soft form
  largely avoids that. The weakness is commercial: nothing ties acceptance to milestone invoicing or
  stage progression. A reasonable B2B deemed acceptance limited to **stage progression and
  invoicing** (not to waiving latent defects or the care-and-skill duty) is defensible, especially if
  triggered only after a written reminder.
- **Required change.** Proposal P8: acceptance for payment and progression after N working days plus
  a reminder notice; no effect on latent defects or §15 warranties.
- **Authority.** A5 s. 13(1)(a)–(b) (primary). A4 s. 11(1), (5) (primary).
- **Confidence.** Medium-high.
- **Owner decision?** **Yes — OC-7**: review period (10 working days recommended, as now) and reminder
  period (5 working days recommended).

### §9 Intellectual property

**§9.1 Client materials.** Remain the client's. Fine. Add a limited licence *to Gridsmith* to use
client materials for the project only, so that Gridsmith's use is authorised. Add a narrow client
indemnity for third-party claims caused by client materials (see §16; OC-8).

**§9.2 Background IP.**
- **Current.** Gridsmith retains tools, frameworks, templates, methods, know-how and reusable
  components. Embedded background IP is licensed "perpetual, non-exclusive, royalty-free ... as part
  of that deliverable for the agreed purpose".
- **Assessment.** Sound in principle. "Agreed purpose" is narrow: a client may later want to modify,
  host with another supplier, or sell the business. Licence the background IP to the extent needed
  to use, modify, maintain and exploit the deliverable, transferable with it, effective on payment
  for the deliverable. Excluding the right to extract and resell the background IP separately is
  fine.

**§9.3 Bespoke final deliverables.**
- **Current.** "On full payment, Gridsmith assigns to the client the rights Gridsmith owns in
  bespoke final deliverables ..., except for background IP and third-party material." A
  further-assurance sentence. Third-party/OSS/font/stock components stay on their own licences.
- **Assessment, point by point.**
  1. *First ownership.* The author is the first owner (CDPA s. 11(1)). Employees' works belong to the
     employer (s. 11(2)). **A subcontractor's or freelancer's work belongs to them** unless assigned.
     Design right: the designer is first owner, and the employer for employee designs (s. 215(1),
     (3)); the old commissioner rule is gone from the current text. Database right: the "maker" who
     takes the initiative and assumes the investment risk (SI 1997/3032 regs. 14–15). **"The rights
     Gridsmith owns" is honest but leaves the client exposed** if a subcontractor never assigned.
     Fix: Gridsmith must obtain written assignments (and, where needed, moral-rights waivers) from
     every subcontractor before using their work in a deliverable.
  2. *Formality.* An assignment of existing copyright must be "in writing signed by or on behalf of
     the assignor" (s. 90(3)). For future copyright, s. 91(1) vests the copyright automatically on
     creation, but **only if at that moment the assignee "would be entitled as against all other
     persons to require the copyright to be vested in him"**. A payment-conditional assignment means
     the client is not so entitled until payment, so s. 91 automatic vesting is doubtful. The
     assignment then operates on payment, as an assignment of existing copyright needing s. 90(3)
     signed writing. **Practical fix:** on full payment Gridsmith issues a short confirmatory
     assignment, e-signed by a director. Alternatively, Gridsmith e-signs the Scope that contains the
     present-tense conditional assignment.
  3. *Is email/e-sign "signed"?* The Law Commission's statement of the law (A17): an electronic
     signature is capable of executing a document provided the signer intends to authenticate it and
     any formalities are met. The Government accepted this in March 2020. ECA 2000 s. 7 (A16) makes
     e-signatures admissible in evidence. Neither is a statutory validity rule for s. 90(3)
     specifically. Confidence medium-high that a director's e-signature, or a typed name with intent
     to authenticate, suffices. **Do not rely on the client's click or email alone**: the signature
     must be the *assignor's* (Gridsmith's).
  4. *Other IP rights.* ss. 90–91 deal with copyright. Design right, database right and registered
     rights have their own provisions (not all read this session). Use wording that assigns "all
     copyright, design rights, database rights and other intellectual property rights" so far as
     assignable, and keep further assurance.
  5. *Drafts, unused concepts, working files, source.* Unaddressed. Owner choice (OC-10), with these
     defaults: final selected deliverables are assigned. Unselected concepts and rejected options stay
     Gridsmith's and are not used for another client in a way that reproduces the client's
     brand-specific elements (protects the client). Native and working files are delivered only if
     the Scope says so. **For Digital, bespoke source code written for the project should be a
     "deliverable" by default**: the site's own selling point is ownership (`00-LEGAL-BASIS.md` §2
     table: "Client owns the code").
  6. *Before payment.* No licence exists, so a client technically infringes by publishing an unpaid
     deliverable. Add a revocable, non-exclusive licence to use deliverables for review and, once a
     stage is paid, for that stage's purpose. Assignment follows on full payment.
  7. *Open source.* Add: Gridsmith identifies material OSS components and their licences on request
     or in handover notes, and avoids copyleft licences that would oblige the client to release its
     proprietary code, unless the Scope agrees otherwise. After handover the client is responsible
     for its own distribution compliance.
  8. *Fonts, stock, plugins, platforms.* The Scope should state who holds each licence and who pays.
     Licences bought for the client should be in the client's name where the licensor allows.
  9. *Moral rights.* A company has none. Individual authors (employees, subcontractors) do. Paternity
     must be asserted to bind (s. 78) and does not apply to computer programs or computer-generated
     works (s. 79(2)), nor, for employee works, to acts authorised by the copyright owner (s. 79(3)).
     The integrity right does not apply to computer programs or computer-generated works (s. 81(2)).
     Waiver needs "instrument in writing signed by the person giving up the right" (s. 87(2)).
     **Ghostwriting (Press):** the ghostwriter is an individual author. Gridsmith should hold a signed
     s. 87 waiver, or at least a non-assertion undertaking, from any individual ghostwriter,
     employee or subcontractor. The client is named as author with their consent (s. 84 protects
     the person to whom a work is falsely attributed, here the client, who consents).
  10. *AI-assisted material.* CDPA s. 9(3): for a computer-generated work, the author is the person
      who made the arrangements necessary for its creation. s. 178: "computer-generated" means
      generated by computer with "no human author". The provision is **in force unamended**, but
      the Government's 18 March 2026 report (A14) proposes **removing** protection for wholly
      computer-generated works while keeping it for AI-assisted works with human creative
      contribution. Whether a given AI-assisted output is original enough for copyright is
      **uncertain** (originality case law, e.g. *THJ v Sheridan* [2023] EWCA Civ 1354, is
      **UNVERIFIED** here). So: (i) do not warrant that AI-generated elements attract copyright;
      (ii) assign whatever rights exist; (iii) disclose AI use in the Scope as the owner's policy
      requires (OC-11); (iv) undertake not to put client confidential information into AI tools
      that use inputs for training without the client's consent; (v) Gridsmith remains responsible
      for checking AI-assisted output with reasonable care like any other work.
- **Authority.** A12 ss. 9(3), 11, 78, 79, 81, 84, 87, 90, 91, 178, 215 (primary). A13 regs. 14–15
  (primary). A16, A17 (primary/official). A14 (official policy, summary only).
- **Confidence.** High on statutory mechanics. Medium on the s. 91 conditional-vesting construction
  and on e-signature sufficiency. Low-medium on AI copyright status (policy in flux).
- **Owner decision?** **Yes — OC-10** (drafts/working files/source defaults), **OC-11** (AI-use
  disclosure policy).
- **UCTA overlay:** Sch. 1 para. 1(c) takes ss. 2–3 out of a contract "so far as it relates to" the
  creation or transfer of IP. Do **not** draft on the footing that this saves the liability cap,
  which operates on service performance (consistent with ledger `L-UCTA-SCH1`).

**§9.4 Portfolio use — MUST CHANGE.**
- **Current.** An automatic right to identify the client and display non-confidential final work
  after public release unless the Scope says otherwise; the client may ask for restrictions.
- **Assessment.** It directly conflicts with owner policy (no portfolio use without explicit client
  consent; no automatic portfolio rights) and with `GS-D001`. It also sits awkwardly with the
  §10 confidentiality clause and with the assignment: once rights are assigned, Gridsmith would need
  a licence back to reproduce the work anyway. The served page labels the basis "Common law; UK GDPR
  Art. 6(1)(f)", which is not a basis for a copyright licence. Data protection (names of individuals)
  is a separate question.
- **Required change.** Proposal P9.3: opt-in, written, revocable for future use, scoped consent.
- **Confidence.** High. **Owner decision?** No: the policy is set. Only the drafting is needed.

### §10 Confidentiality

- **Current.** Mutual duty to keep confidential, use only for the project, reasonable care. Standard
  exceptions.
- **Assessment.** Adequate core. Missing: a definition (at least "information marked or reasonably
  understood as confidential"), permitted disclosure to subcontractors and professional advisers who
  are bound by equivalent duties, duration and survival, and return or destruction on request
  (subject to legal retention and backups). Add that the existence and content of the engagement is
  confidential unless the client consents, which supports §9.4.
- **Required change.** Proposal P10. **Confidence.** High. **Owner decision?** No.

### §11 Data protection; subcontractors (processors)

- **Current.** Each party complies with data protection law. Where Gridsmith acts solely as a
  processor, "the parties will put in place any data-processing terms required by law". Gridsmith
  may use hosting and other providers.
- **Assessment.**
  - Art. 28(3) requires processing by a processor to be "governed by a contract or other legal act
    ... binding on the processor", setting out subject matter, duration, nature and purpose, data
    types and data-subject categories, and the controller's obligations and rights. It must stipulate
    (a)–(h): documented instructions, confidentiality of personnel, Art. 32 security, sub-processor
    conditions, assistance with rights requests, assistance with Arts. 32–36, deletion or return,
    audit information. It must be in writing, which may be electronic (Art. 28(9)). The **controller
    breaches Art. 28 if processing starts without it**, so business clients will expect Gridsmith to
    supply it.
  - Typical processor situations: Digital builds with access to client CRM, customer or form data;
    maintenance and hosting administration; Press handling third-party personal data in a client's
    manuscript at the client's direction. Memoir/ghostwriting interviews may make Gridsmith a
    controller or joint controller of interview data. That is fact-dependent, so flag it for Agent C
    or privacy review.
  - Sub-processors: Art. 28(2) needs prior specific or general written authorisation, with notice of
    changes and a chance to object. Art. 28(4): flow-down, and the initial processor "shall remain
    fully liable". §11's "may use reputable ... providers" does not meet Art. 28(2) unless framed as a
    general written authorisation with notice and objection.
- **Required change.** Proposal P11: a short Data Processing Schedule incorporated automatically
  whenever Gridsmith processes client personal data as processor, with the Scope filling in the
  particulars.
- **Authority.** A19 Art. 28(1)–(4), (9), (10) (primary; no outstanding effects by UK legislation).
- **Confidence.** High. **Owner decision?** Partly: OC-12, list the actual sub-processors used for
  client work (hosting, email, storage). That is a fact for the owner.

### §12 Engineering and technical design services — MUST CHANGE

- **Current.** Covers "engineering, technical, CAD or construction-related drawings or design
  services". Gridsmith performs "the agreed service" with reasonable care and skill. The Scope
  defines "the design task Gridsmith has accepted". The client verifies suitability. Surveys,
  approvals, building control, planning, specialist calculations, **certification, inspection,
  supervision and independent professional sign-off are included "only where expressly stated in
  the Scope"**. Drafts are not final. Gridsmith may rely on client inputs. Nothing excludes
  non-excludable responsibility.
- **Assessment.**
  1. *Conflict with `GS-X002`.* The boundary says Technical work **never** includes engineering
     design or calculations, certification, approval, stamping or regulated sign-off, or acting as
     responsible designer. §12 makes these available by Scope and calls the service "design". That
     is the mismatch `LEGAL-LAUNCH-CHECKLIST.md` (2 Oct 2026 note) already recorded ("§12 ... is
     broader than the intended public scope"). The fix is wording.
  2. *Statute can override the label.* CDM 2015 reg. 2(1): "design" includes "drawings, design
     details, specifications and bills of quantities ... relating to a structure". "Designer" means a
     person who "in the course or furtherance of a business ... prepares or modifies a design".
     Reg. 9 imposes designer duties: satisfy itself that the client knows its duties, eliminate or
     reduce foreseeable risks so far as reasonably practicable, and provide information. Building
     Regulations 2010 reg. 2: "designer" is anyone who in the course of a business "carries out any
     design work" (design of any building work). Reg. 11F requires competence ("organisational
     capability" for a company) for design work and designer duties (England; Part 2A in force
     1 Oct 2023). **A contract cannot switch these duties off.** Preparing construction drawings for a
     structure or for building work may therefore make Gridsmith a statutory designer regardless of
     the Scope saying "drafting only". Non-construction technical drawing (product, manufacturing,
     technical illustration, documentation) is outside these regimes.
  3. *UCTA.* s. 13(1) closing words: ss. 2, 6 and 7 also prevent excluding liability "by reference to
     terms ... which exclude or restrict the relevant obligation or duty". A clause *defining* a
     narrow duty may still be tested through s. 2 if it operates as an exclusion. Define the service
     positively and genuinely (what Gridsmith does), not as a long list of exclusions from a wider
     "design" service.
  4. *No PI cover.* Do not mention insurance in the clause (owner decision `GS-O005`). But the absence
     of cover is a fact the court weighs under s. 11(4)(b) for any cap applied to Technical work.
- **Required change.** Proposal P12 (rewrite).
- **Authority.** A21 reg. 2(1), reg. 9; A22 reg. 2, reg. 11A, reg. 11F; A5 s. 13(1); A4 s. 11(4).
- **Confidence.** High on the statutory definitions. Medium on how they apply to any particular
  drawing engagement (fact-dependent).
- **Owner decision?** **Yes — OC-1** (see §4 below).

### §13 Gridsmith Press

- **Current.** Service provider; client's existing material remains the client's; no ownership,
  royalties or sales income unless separately agreed; bespoke final material is transferred under
  §9.3 on full payment; publishing accounts normally in the client's name.
- **Assessment.** Consistent with `LEGAL-LAUNCH-CHECKLIST.md` Press rule. Add the ghostwriting
  moral-rights point (see §9.3 item 9). Add a client warranty that material it supplies is not
  defamatory or infringing, **with Gridsmith not responsible for legal (e.g. defamation) review
  unless the Scope says so**. Add that the client is the publisher of record and responsible for
  publication decisions. (Defamation Act 2013 was not read this session, so cite nothing.)
- **Confidence.** High. **Owner decision?** No.

### §14 Gridsmith Digital

- **Current.** Bespoke deliverables identified in the Scope; third-party/OSS licences; client data
  is the client's; infrastructure ownership and admin access in the Scope; Gridsmith's own
  credentials need not transfer; no guarantee of rankings, traffic, conversions or revenue.
- **Assessment.** Good. Add: on full payment, handover of client-owned accounts, credentials and
  repositories within a reasonable period; source code for bespoke work (OC-10); client is
  responsible for backups of its own data unless the Scope includes backup services; ongoing
  maintenance only under a separate retainer Scope. The "no commercial outcome" disclaimer is a
  description of the obligation, not an exclusion, and is fine.
- **Confidence.** High. **Owner decision?** OC-10.

### §15 Warranties

- **Current.** Reasonable care and skill. Bespoke deliverables "materially conform to the agreed
  Scope at delivery". Other terms excluded "only to the extent the law permits". An acknowledgement
  about third-party dependence.
- **Assessment.**
  - The express care-and-skill warranty mirrors SGSA 1982 s. 13, which applies to a "relevant
    contract for the supply of a service" (s. 12(1), which now excludes consumer contracts under CRA
    Ch. 4). s. 16(1): implied terms may be negatived or varied by express agreement, "subject to ...
    the 1977 Act". s. 16(2): an express term does not negative an implied term unless inconsistent
    with it. Because the express warranty matches s. 13, purporting to exclude s. 13 gains nothing
    and draws a UCTA s. 2(2)/s. 3 challenge. **Recommend: do not exclude s. 13**; exclude only other
    implied terms "to the extent permitted by law".
  - *Goods.* If Gridsmith supplies physical goods (printed books, proofs, merchandise), UCTA s. 7
    applies: title terms under SGSA s. 2 cannot be excluded (s. 7(3A)); quality, fitness and
    description terms only if reasonable (s. 7(1A)), where Sch. 2's guidelines **do** apply
    (s. 11(2)). Owner to confirm whether goods are ever supplied (OC-13).
  - "Materially conform ... at delivery" with no remedy sequence. Add: the first remedy is correction
    or re-performance within a reasonable time; if that fails, a price reduction or damages subject to
    §16. This does not extinguish rights, so it is low UCTA risk.
  - Add a correction-request window for **patent** defects? A hard bar would be a s. 13 exclusion
    needing reasonableness. Recommend no hard bar; §8's evidential window is enough.
- **Authority.** A8 ss. 12, 13, 16; A3 s. 7; A1 s. 2(2); A4 s. 11(2).
- **Confidence.** High. **Owner decision?** OC-13 (goods).

### §16 Liability; indemnities

- **Current.** (1) No limit for death or personal injury caused by negligence, fraud or fraudulent
  misrepresentation, or other non-excludable liability. (2) Gridsmith's aggregate liability "arising
  from a Scope" is capped at **total fees paid or payable under that Scope**. (3) "The limitation
  applies only to the extent it is fair and reasonable and legally effective". (4) Mutual exclusion
  of indirect/consequential loss. Gridsmith not liable for loss of profit, revenue, savings or
  opportunity "except to the extent such exclusion is not legally effective". (5) A Scope may state
  a different allocation.
- **Assessment.**
  - *Carve-outs.* Correct and consistent with UCTA s. 2(1) (absolute bar for death or personal injury
    from negligence) and the common-law rule that fraud cannot be excluded. Misrepresentation Act
    1967 s. 3 subjects exclusion of non-fraudulent misrepresentation liability to s. 11(1)
    reasonableness, so add an entire-agreement/non-reliance clause that expressly preserves fraud.
  - *Which UCTA tests apply.* Breach of the care-and-skill duty is "negligence" (UCTA s. 1(1)(a), per
    ledger `L-UCTA-1`; s. 1 not re-fetched this session). So the cap and exclusions are subject to
    **s. 2(2)** reasonableness. Where the client deals on Gridsmith's written standard terms, **s. 3**
    applies too. Reasonableness is judged at contract date on what the parties knew or should have
    known (s. 11(1)). For a cap to a specified sum, regard is had in particular to Gridsmith's
    resources and how far it could insure (s. 11(4)). **The burden is on Gridsmith** (s. 11(5)).
    Sch. 2 guidelines apply on their face only to ss. 6/7 (s. 11(2)). Courts use them by analogy
    (authority **UNVERIFIED** here).
  - *Is "fees paid or payable" reasonable?* Statute can't answer this. It depends on facts: (i) Scope
    value against foreseeable loss; (ii) whether the client is larger or more sophisticated and could
    negotiate (reported B2B decisions often uphold negotiated fee-based caps between substantial
    parties; **UNVERIFIED** here); (iii) whether the cap was brought to the client's attention;
    (iv) s. 11(4)(a) Gridsmith's resources as a small company, which supports a modest cap;
    (v) s. 11(4)(b) whether insurance was reasonably available. **Gridsmith has chosen not to carry
    PI cover**, so a court may ask whether cover was "open to" it. If it was available at reasonable
    cost, the absence of cover may weigh *against* a low cap. This is sharpest for Technical work
    and low-value Scopes (e.g. a £400 drawing relied on for construction).
  - *A single-figure risk:* "fees paid or payable" can be very small. Options: (A) keep as is;
    (B) the greater of fees under the Scope and a fixed floor (£X); (C) a multiple of fees (e.g. 1.5×
    or 2×); (D) for retainers, fees in the 12 months before the claim. A floor or multiple makes the
    cap easier to defend as reasonable but increases uninsured exposure. **This is the owner's
    commercial and risk choice.**
  - *Sentence (3) "applies only to the extent it is fair and reasonable".* A court tests the term as
    written. If unreasonable, it fails rather than being cut down (the "blue pencil" approach to
    UCTA caps; *Stewart Gill* **UNVERIFIED**). The sentence doesn't save an unreasonable cap. It reads
    as an admission of doubt and could confuse which figure applies. **Delete it**, and rely on the
    general severance clause plus the non-excludable carve-out.
  - *Loss-of-profit exclusion.* For a client, loss of profit from a defective website or late launch
    can be **direct** loss. Excluding it is a substantive exclusion needing reasonableness. Keep it
    (common in B2B), but it adds to the reasonableness burden. Consider limiting it to "whether
    direct or indirect" only if the cap is generous. Owner choice within OC-2.
  - *Missing:* (i) the client's obligation to pay fees must sit **outside** the cap; (ii) the cap
    should not limit liability for breach of confidentiality or data-protection obligations? That is
    commonly negotiated. Conservative for an uninsured supplier: keep these inside the cap but allow
    a separate figure in the Scope. (iii) Data-loss allocation for Digital: Gridsmith is not
    responsible for loss of client data that a reasonable backup would have prevented, unless backup
    is in scope.
  - *Indemnities.* **There are none.** That is favourable to an uninsured supplier. **Recommend
    Gridsmith gives no indemnity** (an uncapped IP indemnity is the classic uninsured exposure). If a
    client demands one, make it capped, limited to third-party IP claims about Gridsmith-created
    material, excluding client materials and modifications, with conduct-of-claims provisions.
    Consider a narrow **client** indemnity for third-party claims arising from client materials
    (§3/§9.1) or from the client's use of Technical drawings beyond the agreed purpose. Large clients
    may resist this; it is optional.
- **Required change.** Proposal P16.
- **Authority.** A1 ss. 2(1)–(3); A2 s. 3; A4 s. 11(1), (4), (5); A5 s. 13(1); A6 Sch. 1 para. 1(c);
  A7 s. 3.
- **Confidence.** High on the legal framework. **Low-medium on whether any particular cap would be
  upheld**: that is decided on facts and case law not read here.
- **Owner decision?** **Yes — OC-2** (cap basis and figure), **OC-8** (indemnities).

### §17 Third-party services

- **Current.** Gridsmith is not responsible for changes, outages or decisions of third-party
  platforms outside its reasonable control. It remains responsible for its own work and for
  reasonable care in selecting and configuring.
- **Assessment.** Balanced. It largely describes the obligation rather than excluding liability,
  and it preserves the care duty, so low UCTA risk. Add: third-party subscription costs and terms are
  the client's where the account is in the client's name. **Confidence.** High. **Owner decision?**
  No.

### §18 Force majeure

- **Current.** Neither party is liable for delay caused by events outside its reasonable control,
  provided it informs the other and mitigates.
- **Assessment.** Adequate but incomplete. It covers delay only, not non-performance. It has no
  long-stop termination right and doesn't say that payment obligations for work done continue. Add a
  long-stop: either party may terminate if an event lasts more than a set number of days (owner
  figure, suggest 60), with §6 payment-for-work-done consequences. **Confidence.** High. **Owner
  decision?** Minor (OC-14: long-stop days).

### §19 Notices

- **Current.** Project notices and approvals by email to the usual project addresses. Formal notices
  to the registered office or contact@gridsmith.uk.
- **Assessment.** Practical. Add: client formal-notice address (from the Scope); deemed receipt (an
  email sent before 5pm on a business day is received that day, otherwise the next business day,
  unless a bounce-back is received); formal notices of breach or termination should be marked as
  such. **Confidence.** High. **Owner decision?** No.

### §20 General (assignment, severance, waiver, third-party rights)

- **Current.** No transfer that "materially prejudices" the other party without reasonable notice,
  except as part of "a genuine business reorganisation or sale". Severance. No waiver. No third-party
  rights unless the Scope says otherwise.
- **Assessment.**
  - *Assignment.* Vague, and asymmetric in effect. At common law the benefit can be assigned but the
    burden can't be transferred without novation (consent). Standard and clearer: neither party may
    assign without the other's consent (not unreasonably withheld); Gridsmith may assign the benefit
    of receivables; either may transfer on a sale or reorganisation with notice, provided the
    transferee assumes the obligations.
  - *Subcontracting.* Not addressed; the brief says Gridsmith uses specialists. Add: Gridsmith may
    subcontract, remains responsible for subcontractors' work, and flows down confidentiality, IP
    assignment and (where relevant) Art. 28(4) data-protection terms.
  - *Third-party rights.* The clause is effective. CRTPA 1999 s. 1(1)(b) is displaced where "on a
    proper construction ... the parties did not intend the term to be enforceable by the third party"
    (s. 1(2)), and the express exclusion establishes that. Keep it.
  - *Severance and waiver.* Fine.
  - *Missing:* entire agreement plus non-reliance (subject to Misrepresentation Act 1967 s. 3
    reasonableness, so carve out fraud); variation only in writing, including email from an
    authorised person (*Rock Advertising v MWB* [2018] UKSC 24 on no-oral-modification clauses is
    **UNVERIFIED** here); survival; counterparts and electronic execution.
- **Authority.** A15 s. 1(1)–(3); A7 s. 3; A16/A17.
- **Confidence.** High. **Owner decision?** No.

### §21 Governing law and jurisdiction

- **Current.** Contract and non-contractual disputes are governed by the law of England and Wales.
  The courts of England and Wales have exclusive jurisdiction unless another process is agreed in
  writing.
- **Assessment.**
  - *For UK clients:* sound.
  - *For international business clients:* the choice of English law is generally respected for
    contractual obligations (Rome I as assimilated law, **not read this session, UNVERIFIED**).
    UCTA cannot be escaped by an overseas client for services contracts: s. 26 is goods-only (ledger
    `L-UCTA-26-27`), and s. 27(1) applies only where English law applies *only* by choice, which is
    unlikely when Gridsmith performs in England. **Enforcement is the practical issue.** An English
    judgment against a client abroad has to be enforced there. The UK is a contracting state to the
    **2019 Hague Judgments Convention** in its own right, in force for the UK **1 July 2025** (A24).
    That helps enforcement in other contracting states (EU members, Ukraine, Uruguay) but **not**, for
    example, the US (which has signed but per the table not ratified). The 2005 Hague Choice of Court
    Convention (exclusive jurisdiction clauses; UK party in its own right since 1 Jan 2021) is
    **UNVERIFIED** this session.
  - *Options for foreign clients* (OC-15): (A) keep English law and exclusive English courts
    (simplest; recommended default); (B) English law plus non-exclusive jurisdiction, or a unilateral
    option for Gridsmith to sue for debts in the client's home courts (asymmetric clauses are treated
    differently abroad, **UNVERIFIED**); (C) arbitration (e.g. LCIA, or a cheaper documents-only
    scheme) for high-value overseas Scopes. New York Convention enforcement is broader, but the cost
    is high. UCTA s. 13(2): arbitration is not itself an exclusion. **Conservative recommendation: (A)
    by default, with the Scope allowing (C) for high-value overseas projects.**
  - Add a short escalation step (good-faith discussion between named contacts within a set number of
    days) before proceedings, without preventing urgent relief.
- **Authority.** A24 (official); ledger `L-UCTA-26-27` (read Aug 2026); A5 s. 13(2).
- **Confidence.** Medium (foreign enforcement depends on the client's country).
- **Owner decision?** **Yes — OC-15.**

### Consistency checks against the other instruments

| Topic | MSA v2.0 | Consumer / Website terms | Finding |
|---|---|---|---|
| Portfolio | §9.4 automatic right | Website §3–4 refer to "portfolio work" and "client portfolio material" | Website terms imply public client portfolio material exists; owner policy and `GS-D001` say none is shown without consent. Flag to the website-terms reviewer. MSA must change (P9.3). |
| Technical scope | §12 broad "design services" | Consumer §9 also broad ("engineering ... design services", "specialist calculations, certification ... where scope says") | Same `GS-X002` defect in the consumer terms. Flag to the consumer reviewer; P12 is the model. |
| VAT | "not currently registered" | Same in consumer §4 and website §5 | One owner fact (OC-9) across three documents. |
| Refund model | Work-done + committed cost | Consumer §7 mirrors it (post-cancellation period) | Consistent. Consumer statutory rights are separate and correctly preserved there. |
| Late payment | Statutory B2B regime | Consumer: none | Correct split (LPA s. 2(1) is B2B only). |

---

## 3. Clauses whose enforceability depends on facts or reasonableness, not wording

| Clause | Why fact-dependent | Test | Who bears the burden |
|---|---|---|---|
| §16 cap (fees paid/payable) | Value vs loss, bargaining power, notice of the term, resources, insurability (no PI held) | UCTA s. 2(2), s. 3, s. 11(1), (4) | Gridsmith (s. 11(5)) |
| §16 indirect and loss-of-profit exclusion | Whether profit loss was the obvious direct loss; client sophistication | UCTA s. 2(2), s. 3 | Gridsmith |
| §8 acceptance/review window | If it operated to bar remedies | UCTA s. 13(1) + s. 11 | Gridsmith |
| §12 reliance on client inputs and client verification duty | Whether it defines the duty or excludes one; statutory designer status | UCTA s. 13(1) tail via s. 2; CDM 2015 / Building Regs 2010 apply regardless | Gridsmith (UCTA); statute not excludable |
| §15 exclusion of other implied terms | What is excluded; goods supplied? | SGSA s. 16; UCTA s. 2, 3, 7 | Gridsmith |
| §6 payment on cancellation | Characterised as price (primary) vs penalty (secondary on breach) | *Makdessi* test | Client must show penalty; Gridsmith must show the work valuation |
| §7 convenience termination | Fairness of notice and consequences | UCTA s. 3(2)(b)(ii) where on written standard terms | Gridsmith |
| §7 insolvency termination | Whether the client is a company in a relevant procedure | IA 1986 s. 233B | Statutory; not a reasonableness question |
| §9.3 IP assignment | Whether Gridsmith actually owns (subcontractor chain); whether "signed" | CDPA ss. 11, 90(3), 91(1) | Factual |
| §20/new entire-agreement clause | Exclusion of misrepresentation liability | Misrepresentation Act 1967 s. 3 → UCTA s. 11(1) | Gridsmith |
| §1 business status | Whether the individual client is actually a consumer | CRA 2015 s. 2(3) | Factual; consumer law prevails |
| §21 jurisdiction abroad | Client's country; treaty status | Hague 2019 (in force for UK 1 Jul 2025); local law | Factual |

---

## 4. OWNER CONFIRMATION REQUIRED

Each item lists options and the **conservative recommendation**.

| ID | Decision | Options | Conservative recommendation | Why it matters |
|---|---|---|---|---|
| **OC-1** | Technical (`GS-X002`) scope of work accepted | (a) Accept construction/building-related drawings and accept statutory "designer" duties (CDM 2015 reg. 9; Building Regs 2010 Part 2A, reg. 11F competence) with the capability that implies; (b) accept only non-construction technical drawing and documentation (product, manufacturing, illustration, manuals) until `GS-X002` closes; (c) accept construction-related drafting only where a named, appropriately qualified designer engaged by the client takes design responsibility and Gridsmith works to that designer's instructions | **(b)** until `GS-X002` closes, then (c) at most | Contract wording cannot remove statutory designer duties; Gridsmith holds no PI cover |
| **OC-2** | Liability cap basis and figure | (A) fees paid/payable under the Scope (current); (B) greater of fees and a fixed floor £X; (C) multiple of fees; (D) retainers: fees in the preceding 12 months; plus whether loss of profit stays excluded | (A) for Design/Digital/Press **plus (D) for retainers**; **for any Technical Scope, a Scope-specific cap agreed and highlighted before acceptance**; keep the loss-of-profit exclusion; **delete the self-referential sentence** | UCTA s. 11(4)–(5); no PI cover; burden on Gridsmith |
| **OC-3** | Client-delay / dormancy period | 30 / 60 / 90 days | 60 days of inactivity, then 14 days' written notice, then cancellation under §6 | Capacity and cash flow; s. 3(2)(b) fairness |
| **OC-4** | Suspension notice for overdue undisputed invoices | 3 / 7 / 14 days | 7 days' written notice | Clarity; insolvency overlay s. 233B(7) |
| **OC-5** | Deposit policy | (a) none: all advance payments are on account and refundable under §6; (b) reservation fee per Scope only | **(a)** | *Makdessi* (deposit "not reasonable as earnest money" can be penal); consistency with stated refund intent |
| **OC-6** | Gridsmith termination for convenience | keep (with notice and client protections) / delete | Keep: 14 days' notice, paid work delivered and assigned, unearned sums refunded, reasonable handover | UCTA s. 3(2)(b)(ii) |
| **OC-7** | Review/acceptance periods | review 5 / 10 / 15 working days; reminder 3 / 5 working days | 10 + 5 working days; acceptance only for payment and progression | UCTA s. 13(1) |
| **OC-8** | Indemnities | none / client-materials indemnity from client / capped Gridsmith IP indemnity on request | No Gridsmith indemnity by default; optional narrow client indemnity | Uninsured exposure |
| **OC-9** | **VAT registration fact** | registered / not registered | Confirm with records **before publication**; until confirmed, do not publish "not currently registered" | All three instruments assert a fact the brief records as unknown; a false statement is a misrepresentation risk |
| **OC-10** | Drafts, unused concepts, working/native files, source code | assign all / assign finals only, working files on request / finals + source for Digital | Finals assigned; Digital bespoke source code = deliverable; native/working files only if the Scope says; unused concepts retained but not reused in client-identifying form | Client expectation and Digital's "you own the code" positioning |
| **OC-11** | AI-use policy | disclose per Scope / blanket disclosure in MSA / client consent required for generative AI in deliverables | MSA-level disclosure plus a Scope field; no client confidential data into tools that train on inputs without consent; no warranty of copyright subsistence in AI-generated elements | CDPA s. 9(3)/s. 178 in force, proposed for removal (Mar 2026 report) |
| **OC-12** | Actual sub-processors for client work | list | Publish a list or name them in the Scope; general authorisation with 14 days' notice to object | Art. 28(2) |
| **OC-13** | Are physical goods ever supplied (printed books, proofs, merchandise)? | yes / no | If yes, add a goods clause (title not excludable, UCTA s. 7(3A)) | UCTA s. 7, Sch. 2 apply to goods |
| **OC-14** | Force-majeure long-stop | 30 / 60 / 90 days | 60 days | Certainty |
| **OC-15** | Governing law/forum for foreign clients | English courts exclusive / non-exclusive or asymmetric / arbitration | English law and courts by default; arbitration option per Scope for high-value overseas work | Hague 2019 coverage partial (no US) |

---

## 5. Proposed replacement wording (PROPOSALS ONLY — original drafting, not adopted)

> All text below is a **proposal** for the owner's consideration. It is original drafting (no
> competitor text used). It is not solicitor-reviewed, it does not make any term enforceable, and
> figures in `[square brackets]` are **owner decisions** (section 4). Clause numbers follow v2.0
> where possible.

**P1 — §1 Formation, incorporation and precedence (replace §1, paragraphs 2–3)**

> 1.2 A contract for a project is formed when the client accepts a Scope that refers to these terms,
> by signing it (including electronically), by confirming acceptance in writing (including by
> email), or by paying an amount the Scope asks for, whichever happens first. We provide these terms
> with every Scope before acceptance, in a form you can store and print.
>
> 1.3 The contract consists of these terms, the accepted Scope and any accepted Change Order. No
> other terms apply, including terms in the client's purchase order, supplier portal, invoice
> instructions or standard conditions, even if referred to later, unless we agree to them in a
> document that names them and is signed by one of our directors.
>
> 1.4 If documents conflict: an accepted Change Order prevails over the Scope for the matters it
> changes, and the Scope prevails over these terms **only where the Scope expressly names the
> clause of these terms it changes**. Otherwise these terms prevail.
>
> 1.5 By accepting a Scope under these terms the client confirms that it is acting for purposes of
> its trade, business, craft or profession. If the client is an individual acting wholly or mainly
> outside those purposes, our Consumer Client Terms apply instead, and nothing in these terms
> reduces any right the client has as a consumer.

**P2 — §2 Defaults where the Scope is silent (add)**

> 2.3 If the Scope does not state a payment schedule, we will invoice the price for each stage when
> that stage is delivered, or monthly in arrears for work charged by time. If the Scope does not
> state a revision allowance, it includes one round of reasonable revisions per deliverable.

**P3 — §3 Client delay (add)**

> 3.4 If the client does not provide something we reasonably need, the timetable moves by at least
> the length of the delay, and we are not responsible for the resulting delay.
>
> 3.5 If the project cannot progress for more than [60] days because we are waiting for the client,
> we may invoice for work done so far under clause 6.3. If the client still has not responded
> [14] days after we give written notice, we may treat the project as cancelled by the client under
> clause 6.
>
> 3.6 Additional costs caused by client delay are payable only at rates stated in the Scope or as
> agreed in a Change Order.

**P4 — §4 Disagreement about scope (add)**

> 4.5 A Change Order is accepted when the client signs it or confirms acceptance in writing,
> including by email. If the parties disagree whether a request is within the Scope, we will
> continue the work that is clearly within the Scope while we discuss it, and we will not charge for
> the disputed work unless the client agrees in writing.

**P5 — §5 Payment structures, late payment, suspension (replace paragraphs 1, 6 and 7; VAT text
subject to OC-9)**

> 5.1 The price and the payment arrangement for each project are set out in its Scope. The
> arrangement may be payment in full in advance, an advance payment followed by a balance,
> payments on reaching stated milestones, instalments, a periodic retainer, or another schedule we
> agree. Any payment made before the related work is done is a payment on account of the price of
> that work, and clause 6 governs any refund.
>
> 5.5 The client must tell us about any disputed invoice item promptly after receiving the invoice,
> with its reasons, and must pay the undisputed part by the due date.
>
> 5.6 If an undisputed amount is overdue, we may suspend work after giving at least [7] days'
> written notice. The timetable then moves by the period of suspension plus a reasonable restart
> period, and we are not responsible for the resulting delay. This clause applies subject to any
> legal restriction on suspending supply to a client in insolvency.
>
> 5.7 Late payment of a business debt carries statutory interest and compensation under the Late
> Payment of Commercial Debts (Interest) Act 1998. At the date of these terms that means interest at
> 8% a year above the Bank of England rate fixed on the preceding 30 June or 31 December, a fixed sum
> of £40, £70 or £100 depending on the size of the debt, and reasonable recovery costs above that
> sum.

**P6 — §6 Valuation on cancellation; IP; deposits (replace §6.2 bullets and add)**

> 6.3 If the client cancels after work has started, the client pays:
> (a) the Scope price of every stage or milestone completed before the cancellation takes effect;
> (b) for a stage in progress, a fair proportion of that stage's price reflecting the work actually
> done, measured where the Scope gives a day or hourly rate by the time reasonably spent at that
> rate, but never more than that stage's price; and
> (c) third-party costs that we committed to with the client's prior approval and cannot cancel or
> recover, less anything we do recover.
> The total under (a) to (c) will never exceed the total Scope price. We will refund any amount paid
> above that total within [14] days, and we will show how we calculated it on request.
>
> 6.4 We will deliver the work the client has paid for under clause 6.3 in its current state, and
> clause 9.3 applies to it once paid.
>
> 6.5 No payment is non-refundable merely because it was paid in advance. [If a Scope includes a
> reservation fee for holding a start date, the Scope will state its amount and what it is for.]

**P7 — §7 Termination by Gridsmith (replace insolvency and convenience paragraphs)**

> 7.1(d) the client is unable to pay its debts or enters an insolvency procedure, **to the extent
> the law allows us to end or suspend the contract for that reason**.
>
> 7.2 We may also end a project for our own reasons by giving [14] days' written notice. If we do,
> we will deliver and transfer under clause 9.3 the completed work the client has paid for, refund
> any amount paid for work not done, and give reasonable help to hand the work over to another
> supplier.
>
> 7.3 When a project ends for any reason: amounts due for work done remain payable; we will return
> or delete client materials on request (except copies we must keep by law or that are held in
> routine backups until overwritten); and clauses 6, 9, 10, 11, 16, 20 and 21 continue to apply.

**P8 — §8 Acceptance (replace last paragraph)**

> 8.4 If the client has not identified a material non-conformity within [10] working days of
> delivery, we may send a written reminder. If there is no response within a further [5] working
> days, the deliverable is treated as accepted **for the purposes of invoicing and moving to the
> next stage only**. This does not affect the client's rights for defects that could not reasonably
> have been found on review, or our duty under clause 15.

**P9.2 — §9.2 Background IP licence (replace second paragraph)**

> Where our background material forms part of a deliverable, we grant the client, from payment for
> that deliverable, a non-exclusive, perpetual, royalty-free licence to use, copy, modify, maintain
> and exploit it as part of that deliverable, and to let its contractors do so for the client. This
> licence passes with the deliverable if the client transfers it. It does not allow use of the
> background material separately from the deliverable.

**P9.3 — §9.3 Assignment mechanics, chain of title, drafts, AI, moral rights (replace)**

> 9.3.1 When the client has paid all sums due for a deliverable, we assign to the client all
> copyright, design rights, database rights and other intellectual property rights we own in the
> bespoke final deliverables created specifically for the project, other than background material
> and third-party material. On request we will confirm the assignment in a short document signed
> (including electronically) by one of our directors.
>
> 9.3.2 Before full payment, the client may use deliverables to review them and, once a stage has
> been paid, to use that stage's deliverables for the purpose stated in the Scope.
>
> 9.3.3 Where a subcontractor or other individual contributes to a deliverable, we will obtain
> from them, before their work is used, a written transfer of their rights to us so that clause 9.3.1
> can take effect. Where the Scope requires it, we will also obtain a written waiver of their moral
> rights or a written promise not to assert them.
>
> 9.3.4 Unless the Scope says otherwise: unselected concepts, drafts and alternatives remain ours, but
> we will not use them for anyone else in a form that reproduces the client's name, branding or
> confidential information; native and working files are supplied only where the Scope lists them;
> and for software and websites, the bespoke source code written for the project is a deliverable.
>
> 9.3.5 We will tell the client in the Scope or on delivery if we have used generative AI tools to
> create any part of a deliverable. The law on whether material created with AI tools is protected
> by copyright is unsettled, so we do not promise that such elements are protected. We assign any
> rights that do exist. We remain responsible for reviewing AI-assisted work with the same care as
> any other work, and we will not put the client's confidential information into an AI tool that
> uses inputs to train its models without the client's agreement.
>
> 9.3.6 Open-source and other third-party components remain under their own licences. We will
> identify any that impose obligations on the client and will not use a licence that would require
> the client to release its own confidential source code unless the Scope says we may.

**P9.4 — §9.4 Portfolio use (replace entirely)**

> 9.4 We will not name the client, describe the project or show any work created for the client
> in our portfolio, website, social media, proposals or marketing unless the client has given its
> express written consent. Consent may be limited to particular work, uses or timing. The client may
> withdraw it for future use at any time by telling us in writing. Without consent, the engagement
> and its deliverables are treated as the client's confidential information.

**P10 — §10 Confidentiality (add)**

> 10.3 Confidential information includes anything marked as confidential or that a reasonable
> person would understand to be confidential. Each party may share the other's confidential
> information with its employees, subcontractors and professional advisers who need it for the
> project and are bound by duties of confidence at least as strict as this clause. This clause
> continues for [5] years after the project ends, and indefinitely for trade secrets and personal
> data.

**P11 — §11 Data processing (replace second and third paragraphs)**

> 11.2 Where we process personal data on the client's behalf as its processor, the Data Processing
> Schedule applies automatically and forms part of the contract. The Scope will record the subject
> matter, duration, nature and purpose of the processing, the types of personal data and the
> categories of data subjects.
>
> 11.3 The client authorises us to use the sub-processors listed [in the Scope / at a stated
> location]. We will give at least [14] days' notice of any addition or replacement so the client
> can object. We will put equivalent data-protection terms in place with each sub-processor and
> remain responsible to the client for them.
>
> *Data Processing Schedule (outline only):* processing only on documented instructions (including
> on international transfers); confidentiality of authorised persons; security measures meeting UK
> GDPR Art. 32; sub-processor conditions as above; assistance with data-subject requests and with
> Arts. 32–36; deletion or return at the end, at the client's choice, subject to legal retention;
> information and audit co-operation; telling the client if an instruction appears unlawful; breach
> notification without undue delay. *(Mirrors Art. 28(3)(a)–(h). The full schedule should be drafted
> as its own document.)*

**P12 — §12 Technical drawing and documentation services (replace entirely)**

> 12.1 Gridsmith Design's technical services are limited to preparing drawings, technical
> illustrations, drafting and documentation **to the client's brief and from information the client
> or its advisers provide**, as described in the Scope.
>
> 12.2 We do not provide, and no Scope can add: engineering design or calculations; structural,
> fire, building-services or other specialist design; certification, approval, stamping or sign-off
> of any design or drawing; or the role of designer, principal designer or other person responsible
> for a design under any law or regulation. Where the work needs any of these, the client must
> appoint an appropriately qualified professional, and we will work to that professional's
> instructions where the Scope says so.
>
> 12.3 We will perform the technical services with reasonable care and skill. We will rely on the
> dimensions and information supplied unless the Scope asks us to check them, and we will tell the
> client if something supplied appears clearly wrong or incomplete.
>
> 12.4 Drawings marked as draft, preliminary, for comment or superseded must not be used for
> manufacture, construction, installation or approval. Only drawings issued as final under the
> Scope are deliverables.
>
> 12.5 [If OC-1 option (b) is chosen:] We do not accept work consisting of drawings or design
> details for construction work, a structure or building work within the meaning of construction
> health-and-safety or building-regulation legislation.
>
> 12.6 Nothing in this clause limits any responsibility that the law does not allow us to limit,
> including any duty the law places on us directly.

**P15 — §15 Warranties (replace paragraph 2 and add)**

> 15.2 Our obligation to perform the services with reasonable care and skill applies in full. Other
> terms that might be implied by law about the services are excluded to the extent the law allows.
>
> 15.3 If a deliverable does not conform to the Scope, or a service was not performed with reasonable
> care and skill, we will first correct or re-perform it at no charge within a reasonable time. If we
> cannot do so, the client may claim a fair price reduction or damages, subject to clause 16.

**P16 — §16 Liability (replace paragraphs 2–4; figures per OC-2)**

> 16.2 Subject to clause 16.1, our total liability to the client for all claims arising out of or in
> connection with a Scope, whether in contract, negligence or otherwise, will not exceed [the total
> fees paid and payable under that Scope] [for a retainer or other periodic Scope: the fees paid and
> payable in the 12 months before the event giving rise to the claim]. A different limit stated
> prominently in a Scope applies to that Scope instead.
>
> 16.3 Subject to clause 16.1, neither party is liable for any indirect or consequential loss, and we
> are not liable for loss of profit, revenue, business, anticipated savings or goodwill, whether
> direct or indirect.
>
> 16.4 Nothing in this clause limits the client's obligation to pay the price and other sums due
> under the contract.
>
> 16.5 Unless the Scope includes backup or data-management services, the client is responsible for
> keeping its own backups, and we are not liable for loss of data that a reasonable backup would have
> prevented.
>
> *[Delete v2.0 sentence "The limitation applies only to the extent it is fair and reasonable and
> legally effective in the circumstances."]*

**P18 — §18 Force majeure (add)**

> 18.2 This clause does not excuse payment for work already done. If an event outside a party's
> reasonable control prevents performance for more than [60] days, either party may end the project
> by written notice, and clause 6.3 applies as if the client had cancelled.

**P20 — §20 General (replace assignment paragraph; add)**

> 20.1 Neither party may transfer its rights or obligations without the other's written consent, which
> must not be unreasonably withheld. Either party may transfer the contract as part of a sale or
> reorganisation of its business by notice, if the transferee agrees in writing to perform it. We may
> use subcontractors and specialists. We remain responsible for their work, and we will bind them to
> confidentiality and to the transfer of intellectual property under clause 9.3.3.
>
> 20.5 The contract is the whole agreement between the parties about the project. Each party confirms
> that it has not relied on any statement that is not set out in the contract. This clause does not
> exclude liability for fraudulent misrepresentation.
>
> 20.6 A change to the contract is effective only if it is in writing, including email, and agreed
> by both parties.
>
> 20.7 The contract may be signed or accepted electronically, and in separate copies.

**P21 — §21 (add)**

> 21.2 Before starting court proceedings (except for urgent relief or to recover an undisputed debt),
> each party will tell the other in writing what the dispute is, and the parties' responsible
> contacts will try in good faith to resolve it within [20] working days. [A Scope may provide for
> arbitration instead of court proceedings.]

---

## 6. Items not verified this session (do not rely on without checking)

- Case law other than the *Makdessi* press summary: *Butler Machine Tool*, *Tekdata*, *Stewart
  Gill*, *Rock Advertising*, *THJ v Sheridan*, and B2B cap-reasonableness decisions. All
  **UNVERIFIED**.
- CRA 2015 s. 2(3) and UCTA s. 1(1) were not re-fetched this session (the ledger read them in Aug
  2026).
- Rome I (assimilated) art. 4; Hague 2005 Convention UK status; Defamation Act 2013; LPA 1998 s. 11
  detail; SGSA 1982 s. 15.
- Commercial Payments Bill: bill pages returned 403. Content and stage are from a secondary source
  only, so re-check before relying on it.
- The full text of the 18 March 2026 Copyright and AI report was not read (search-result summaries
  only).
- The current Bank Rate figure was deliberately not computed (it changes six-monthly for statutory
  interest purposes).

## 7. Ledger hygiene (for whoever next edits `02-CITATION-LEDGER.md` — not done here)

- `L-UCTA-*`, `L-LATE-PAYMENT` and `L-CDPA-90-91` point at v1.x clause numbers (6.4, 7.4, 8.3,
  11.x, 12.3, Schedules) that no longer exist in v2.0. Re-point them: late payment → §5, assignment →
  §9.3, cap → §16, acceptance → §8, Technical → §12.
- New entries would be needed for IA 1986 s. 233B, CDM 2015 reg. 2/9, Building Regs 2010
  reg. 2/11F, UK GDPR Art. 28 (business-terms use), CDPA ss. 9(3)/11/78/79/81/84/87/178/215,
  SI 1997/3032 regs. 14–15, LPA 1998 ss. 2/4/8/9/12, CRTPA 1999 s. 1, Misrepresentation Act 1967 s. 3,
  ECA 2000 s. 7 and Law Com 386.
