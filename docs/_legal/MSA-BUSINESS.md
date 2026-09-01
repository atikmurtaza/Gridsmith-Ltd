# Master Services Agreement (Business Clients) — DRAFT for solicitor review

> **[SEED - SOLICITOR REVIEW REQUIRED]**
> This is a draft prepared for a qualified UK solicitor to review, amend and adopt. It is not legal
> advice and must not be used unreviewed. `legalDocument.solicitorApproved` gates publication.

**Status: DRAFT. Not for use until reviewed and adopted by a qualified UK solicitor.**

**Version 1.1 — revised 25 August 2026 against `02-CITATION-LEDGER.md`.** Every clause carries an
inline comment naming the ledger entry it implements, or is flagged as having none. Clauses added at
this revision are marked **NEW**.

**Version 1.2 — revised 26 August 2026, round 7.** Three citation defects corrected, each verified by
fetching the instrument rather than by accepting the finding that raised it: **6.4** (the 8% is
SI 2002/1675 art. 4, not the 1998 Act, and there are three fixed sums plus s. 5A(2A) recovery costs);
**8.3** (the clause assigns future copyright, which is CDPA s. 91, not s. 90(3) alone); **15.1** (the
excludable set is regs. 9(1), 9(2) and the whole of 11(1), and regs. 9(4) and 11(3) may already
exclude all of it). Two ledger entries were added to carry them — `L-LATE-PAYMENT` and
`L-CDPA-90-91` — closing the two `NO LEDGER ENTRY` flags those clauses stood under.

**Version 1.3 — revised 26 August 2026, round 8.** One correction, at **16.2**: its inline note told the
reader not to rely on clause 16.1 pending a reading of PECR reg. 23 that two other drafts already
recorded as done. reg. 23 was fetched and read at source in this round rather than the closure being
accepted from either record, and 16.1's basis holds. `CNV-3` is closed in the ledger with the same
reading. **The clause text is unchanged** — the defect was in the instruction attached to it, which
would have sent a solicitor to duplicate work or to conclude that 16.1 was unsound.

**Version 1.4 — revised 29 August 2026, round 12. UCTA 1977 read at source for the first time in this
project.** Clause 11 previously stood under a `NO LEDGER ENTRY` flag reading *"`00-LEGAL-BASIS.md`
section 1 asserts UCTA 1977 governs these limitations and Pass 2 raised no ledger entry for UCTA"* — an
instruction to a solicitor to supply the citation, carried through four revisions while the consumer
side of the same question was fully cited (`L-CRA-57`, `L-CRA-62`). `07-STATE-REPORT.md` §2.3 named it
the largest uncosted gap in the set. **ss. 1, 2, 3, 11, 13, 26, 27, Schedule 1 and Schedule 2 were
fetched and read at `legislation.gov.uk` on 29 August 2026**, and six ledger entries now carry them:
`L-UCTA-1`, `L-UCTA-SCH1`, `L-UCTA-2`, `L-UCTA-3`, `L-UCTA-11` and `L-UCTA-26-27`.

**No limit, cap, exclusion or figure in this agreement was changed.** What changed is that the
provisions governing them are now named, the burden is stated, and three clauses that were not
recognised as exclusions are flagged as ones. New or rewritten material is at **7.4**, **11.6**,
**11.7**, **11.8**, **12.3** and **Schedule A3**, marked **NEW** or **REVISED**. Two `NO LEDGER ENTRY`
flags are closed (clauses 11 and 12); one is **narrowed rather than closed** (clause 7).

For **business clients only**. Consumers — including most individual authors and memoir clients — are covered by `CONSUMER-TERMS.md`. Using this agreement with a consumer would breach the Consumer Rights Act 2015.

Clause numbers are stable. The website cites them by number (`digital/PRD.md` FR-DG06, `press/PRD.md` FR-P04), so renumbering requires a version bump and anchor redirects.

## Who this agreement governs

**This agreement governs business clients.** If you are a company, a partnership, a sole trader or
anyone else engaging Gridsmith Ltd for the purposes of a trade, business, craft or profession, these
are your terms.

**It does not govern consumers.** If you are an individual buying for purposes outside your trade,
business, craft or profession — which includes most individual authors and almost all memoir and
legacy clients of Gridsmith Press — these are **not** your terms. Yours are `CONSUMER-TERMS.md`, at
`/legal/consumer-client-terms`. Several clauses here, the liability cap at 11.3 in particular, would
not bind you: **section 57 of the Consumer Rights Act 2015** makes a term not binding on a consumer
to the extent it would exclude or restrict liability under sections 49 or 50.

If you are not sure which you are, `/legal/client-terms` sets out the difference and links to both.

> **[DECISION RECORDED] — owner, 26 August 2026. Option (a): split the routes.**
> <!-- L-CRA-57 -->
> This was a `[DECISION REQUIRED]`, and it was the structural defect in the whole `_legal/` set: five
> legal slugs, of which `client-terms` was one document serving **both** this MSA and
> `CONSUMER-TERMS.md`. The seeded document at that slug mixed bases from both regimes — clause 1.1 on
> the Companies Act, clause 2.1 on Consumer Rights Act 2015 s. 50 — so a Press author read a
> liability cap that **s. 57 makes not binding on them**, with nothing on the page saying so.
>
> **The reasoning for (a) over (b) and (c).** (b) — one combined instrument disapplying each failing
> clause for consumers — asks a single document to be two documents and is easy to get wrong in a way
> nobody notices until it is tested. (c) — publish the MSA and hand consumers their terms out of
> band — leaves the *published* document wrong for half its readers, which is the defect restated.
> Neither addresses the actual failure, which is not what the clauses say but **which reader arrives
> at them**. Only routing can answer that.
>
> **This document is now published at `/legal/business-client-terms`.** `CONSUMER-TERMS.md` is at
> `/legal/consumer-client-terms`. `/legal/client-terms` survives as a disambiguation page carrying no
> operative clause, rather than as a redirect: a redirect has to choose a target, and either choice
> silently lands one audience on the other audience's instrument. `scripts/check-consumer-terms.mjs`
> asserts against the served pages that no consumer-facing route links here.
>
> **Still for the solicitor:** this document retains consumer-facing material at 2.1, 6.1, 10.1 and
> 11.1 that the split makes redundant. No clause was amended when the routes were split — `CLAUDE.md`
> forbids drafting or amending clauses outside this review.

---

## 1. Parties and structure
<!-- L-CA-82 / L-TDR-24 — the ledger entry is compound and this clause cites both halves as of 29 August 2026, round 12. It read `L-CA-82` alone. **CNV-7 records that Companies Act 2006 s. 82's text was never fetched**: the obligation actually read and verified is SI 2015/17 reg. 24, and s. 82 is only the empowering power. Citing the unread half is the same defect round 9 fixed at MSA-BUSINESS.md 16.1 — a clause citing an id that does not discharge it. 07-STATE-REPORT.md F-12(a) named three files; there are four. -->
<!-- L-TDR-25 -->


1.1 This agreement is between **Gridsmith Ltd** (company number `[TK]`, registered office `[TK]`) and the client named in the Scope.

1.2 Gridsmith Ltd trades as Gridsmith Design, Gridsmith Digital and Gridsmith Press. These are **trading divisions of one company**, not separate legal entities. Whichever division delivers the work, the contracting party is Gridsmith Ltd.

1.3 Gridsmith may use affiliated production teams and subcontractors to deliver. **Gridsmith remains responsible to the client for all work**, and remains the client's sole point of contract.

## 2. Structure of the agreement
<!-- NO LEDGER ENTRY: order of precedence between contract documents is a drafting convention, not a statutory obligation. Retained. -->


2.1 The agreement comprises: this MSA · the Division Schedule for the relevant service · the signed Scope · any signed Change Order.

2.2 Order of precedence where terms conflict: signed Change Order → signed Scope → Division Schedule → this MSA.

## 3. The Scope
<!-- NO LEDGER ENTRY: scope definition and the exclusions rule are commercial terms. Retained. -->


3.1 No work begins until a written Scope is agreed and the initial payment received (canonical process stage 3).

3.2 The Scope states: deliverables · timeline · price and payment schedule · revision rounds included · client responsibilities and time commitment · assumptions · **exclusions**.

3.3 **Anything not stated in the Scope is not included.** Exclusions are listed for clarity and the absence of an item from the exclusions list does not imply inclusion.

## 4. Changes
<!-- NO LEDGER ENTRY: change control is a commercial term. Retained. -->


4.1 Changes to scope require a written Change Order stating the change, the price effect and the timeline effect.

4.2 Gridsmith is not obliged to perform work outside the Scope. Where it agrees to, the Change Order governs.

4.3 Where a client delay or a change to client-supplied materials causes rework, that rework is chargeable.

## 5. Client responsibilities
<!-- NO LEDGER ENTRY: client obligations, and the IP warranty and indemnity at 5.2, are commercial terms. Retained. 5.2 must never be applied to a consumer in this form — see CONSUMER-TERMS.md 9.3, which is deliberately softer. -->


5.1 The client will provide materials, information, access, approvals and feedback within the timescales in the Scope.

5.2 The client warrants that materials it supplies do not infringe third-party rights, and indemnifies Gridsmith against claims that they do.

5.3 **Where the client does not meet its time commitments, timelines extend accordingly.** Gridsmith will notify the client where a delay affects the schedule.

5.4 Where a project is suspended by client inaction for more than 30 days, Gridsmith may invoice work completed to date and reschedule remaining work subject to availability.

## 6. Fees and payment
<!-- L-VAT-B2B -->
<!-- L-ECOM-6 -->


6.1 Fees are as stated in the Scope, exclusive of VAT.
<!-- L-VAT-B2B — SI 2002/2013 reg. 6(2) does not require a B2B price to be VAT-inclusive; it requires
the treatment to be stated. "Exclusive of VAT" is a compliant statement here. The failure is on the
website, not in this clause: no price rendered by components/content/Price.tsx states any treatment at
all. See clause 6.7. -->

6.2 Standard payment structure: an initial payment before work begins, staged payments at agreed milestones, and the balance on delivery. The Scope states the actual split.

6.3 Invoices are payable within **14 days** unless the Scope states otherwise.

6.4 **Late payment.** Gridsmith may charge statutory interest and compensation under the Late Payment
of Commercial Debts (Interest) Act 1998. Statutory interest runs at **8% per annum above the Bank of
England official dealing rate**, that rate being the one in force on **30 June** (for interest that
starts to run between 1 July and 31 December) or **31 December** (for interest that starts to run
between 1 January and 30 June) immediately before the day the interest starts to run, as set by
article 4 of the Late Payment of Commercial Debts (Rate of Interest) (No. 3) Order 2002. In addition,
Gridsmith is entitled to **the fixed sum under section 5A(2) of that Act appropriate to the debt —
£40 for a debt under £1,000, £70 for a debt of £1,000 or more but under £10,000, and £100 for a debt
of £10,000 or more — and, under section 5A(2A), to any reasonable costs of recovering the debt to the
extent they exceed that fixed sum.**
<!-- L-LATE-PAYMENT — revised 26 August 2026, round 7. Three corrections, each verified at source:
(a) the 8% is NOT in the 1998 Act. s. 6 only empowers the Secretary of State to set the rate by
order; the rate is SI 2002/1675 art. 4. The clause previously attributed it to the Act.
(b) the rate is fixed by reference to the official dealing rate on 30 June / 31 December and holds
for six months. It is not the base rate on the day the invoice falls due, which is what "8% above the
Bank of England base rate" reads as.
(c) there is no "the fixed statutory recovery sum". s. 5A(2) sets THREE sums by debt band, and
s. 5A(2A) adds recovery costs above the fixed sum. The previous definite singular both mis-stated the
entitlement and gave away s. 5A(2A) by omission. -->

6.5 Gridsmith may suspend work where an invoice is more than 14 days overdue, having given 7 days' written notice.

6.6 Expenses (stock imagery, fonts, third-party licences, print, ISBNs, hosting) are charged at cost where identified in the Scope, and require written approval where not.

6.7 **NEW — prices displayed on the website.** Prices shown on gridsmith.uk are indicative and are not
an offer. `[TK — the VAT treatment sentence, once the decision at WEBSITE-TERMS.md clause 5A is taken.
Today no price on the site states any VAT treatment, which fails SI 2002/2013 reg. 6(2) for Design and
Digital as well as for Press. M-P2-3 is NOT BUILT.]`
<!-- L-VAT-B2B -->
<!-- L-ECOM-6 -->
<!-- L-DMCC-230 — not engaged for a business client, but the same Price component renders to consumers
on /press, where s. 230 requires a tax-inclusive total. The fix differs by division; see
WEBSITE-TERMS.md clause 5A. -->

## 7. Delivery and acceptance
<!-- L-UCTA-3 — REVISED 29 August 2026, round 12. The previous flag read "NO LEDGER ENTRY: deemed
acceptance after 10 working days is a commercial term." **It is not only a commercial term.**
UCTA s. 13(1)(a) and (b) provide that, to the extent Part I prevents the exclusion or restriction of a
liability, it also prevents "making the liability or its enforcement subject to restrictive or onerous
conditions" and "excluding or restricting any right or remedy in respect of the liability". A clause
under which a deliverable is deemed accepted — and the non-conformity remedy at 7.3 therefore lost —
after 10 working days is both. Where the client deals on these written standard terms, 7.4 is
accordingly subject to the s. 3 requirement of reasonableness, and under s. 11(5) the burden of showing
it reasonable is Gridsmith's.
The consumer flag is retained and is unaffected: CRA 2015 Part 2 governs the consumer position and
CONSUMER-TERMS.md deliberately has no equivalent. -->


7.1 Gridsmith will deliver in accordance with the Scope.

7.2 The client has **10 working days** from delivery to notify Gridsmith in writing of any respect in which deliverables do not conform to the Scope.

7.3 Where a valid non-conformity is notified, Gridsmith will correct it at no charge.

7.4 **REVISED.** If no notice is given within 10 working days, or the client puts the deliverables into
use, they are deemed accepted. **Section 13(1) of the Unfair Contract Terms Act 1977 applies section 3
to a term which makes a liability or its enforcement subject to restrictive or onerous conditions, or
which excludes or restricts a remedy or a rule of evidence, so this clause and clause 11.5 are both
subject to the requirement of reasonableness where the client deals on these written standard terms.**

7.5 Revisions beyond the number stated in the Scope are chargeable at the rate stated in the Scope.

## 8. Intellectual property
<!-- L-CDPA-90-91 — added to the ledger 26 August 2026, round 7, closing the NO LEDGER ENTRY flag that
stood here. Both s. 90 and s. 91 were fetched and read at legislation.gov.uk on that date. The
electronic-execution question the previous flag raised is separate, is not answered by the citation,
and remains open at 8.3. -->


8.1 **Client materials** remain the client's property throughout.

8.2 **Background IP** — tools, frameworks, methods and components Gridsmith owned before the engagement or developed independently — remains Gridsmith's. Gridsmith grants a perpetual, non-exclusive, royalty-free licence to use it as embedded in the deliverables.

8.3 **Deliverables.** On payment in full, Gridsmith **assigns to the client, with full title guarantee,
all copyright and other intellectual property rights in the final approved deliverables.** This
assignment is made in writing and signed by or on behalf of Gridsmith, and takes effect on receipt of
final payment. Where a deliverable does not exist when this agreement is signed, this clause is an
agreement in relation to **future copyright** within the meaning of **section 91 of the Copyright,
Designs and Patents Act 1988**, made and signed by Gridsmith as prospective owner, so that the
copyright vests in the client on coming into existence without any further act of assignment. Where a
deliverable already exists, the assignment is made in writing and signed as **section 90(3)** of that
Act requires.
<!-- L-CDPA-90-91 — revised 26 August 2026, round 7. The previous clause cited s. 90(3) alone. s. 90(3)
governs an assignment of copyright THAT ALREADY EXISTS; this clause assigns rights in deliverables
that do not exist at signature, which is future copyright under s. 91. s. 91(1) also requires signed
writing, so the form was probably already adequate — but the section that makes the assignment bite
automatically on creation was not named. Both are now cited.
`[TK — two questions this citation does NOT answer, both for the solicitor: (i) whether an
electronically executed agreement is "signed" for s. 90(3) and s. 91(1); (ii) whether "other
intellectual property rights", which are not copyright, are validly assigned by these words — s. 90
and s. 91 govern copyright only, and registered designs, trade marks and patents each have their own
assignment formalities.]` -->

8.4 **Until payment in full**, the client has a licence to use the deliverables for review and approval only.

8.5 Division-specific IP terms are in the relevant Division Schedule and **prevail over this clause 8 where they differ**.

8.6 **Portfolio licence.** Gridsmith may display the work in its portfolio and marketing, and may name the client, unless the Scope records that the client has opted out. Gridsmith will not disclose confidential information in doing so. The client may withdraw this permission on written notice, and Gridsmith will remove the work within 30 days.

## 9. Confidentiality
<!-- NO LEDGER ENTRY: mutual confidentiality is a commercial term. Retained. -->


9.1 Each party will keep the other's confidential information confidential, use it only for the purposes of the agreement, and protect it with at least reasonable care.

9.2 This does not apply to information that is public, already known, independently developed, or required to be disclosed by law.

9.3 These obligations continue for 3 years after the agreement ends.

## 10. Data protection
<!-- L-GDPR-28 -->


10.1 Where Gridsmith processes personal data on the client's behalf, the client is controller and Gridsmith is processor, and the parties will enter a data processing agreement in the form at Schedule DP.

10.2 Each party will comply with applicable data protection law.

10.3 **NEW — sub-processors.** Where Gridsmith engages a sub-processor to process the client's personal
data, it will do so under a written contract imposing the Art. 28(3) obligations, and will inform the
client of intended additions or replacements so the client may object.
<!-- L-GDPR-28 — Art. 28(2) and 28(4). Stated honestly: `[TK — no DPA is recorded in the repository for
any processor Gridsmith itself uses (Supabase, Vercel, Resend, Sanity, and Slack if enabled). The
ledger records this as "cannot tell". Schedule DP cannot be completed until those exist.]` -->

10.4 **NEW — international transfers.** Where processing under this agreement involves a transfer of
personal data outside the United Kingdom, that transfer is made only where approved by regulations
under UK GDPR Art. 45A, or subject to appropriate safeguards under Art. 46, or within an Art. 49
derogation, applying the Art. 45B data protection test.
<!-- L-GDPR-44A — Chapter V as restructured by DUAA 2025 with effect from 5 February 2026. Articles 44
and 45 were OMITTED on that date: any clause referring to "adequacy decisions" or to Art. 45 cites
repealed text. `[TK — the regions of Supabase, Vercel, Resend and Sanity are all unestablished
(OQ-1 to OQ-4) and must not be assumed to be UK or EU.]` -->

10.5 **NEW — data protection complaints.** A complaint about Gridsmith's handling of personal data may
be made under the procedure in the Privacy Policy, which Gridsmith is required to operate under
DPA 2018 s. 164A.
<!-- L-DPA-164A — in force 19 June 2026, after this document's previous revision. `[TK — there is no
complaints route and no electronic complaint form on the site. 01-FACTUAL-INVENTORY.md section 5.1.]` -->

## 11. Liability
<!-- L-UCTA-1 -->
<!-- L-UCTA-2 -->
<!-- L-UCTA-3 -->
<!-- L-UCTA-11 -->
<!-- L-UCTA-SCH1 -->
<!-- The NO LEDGER ENTRY flag that stood here is CLOSED, 29 August 2026, round 12. It read:
"00-LEGAL-BASIS.md section 1 asserts UCTA 1977 governs these limitations and Pass 2 raised no ledger
entry for UCTA. Retained and flagged so the solicitor supplies the citation and applies the test."
The Act has now been read at source and six entries carry it. That flag asked for two things and only
one of them was ever a solicitor's job: supplying the citation was a research task this project could
do and had not done for four revisions; applying the test is a legal judgement on facts, and remains
open at 11.8. -->
<!-- L-CRA-57 — this clause is the reason this instrument must never reach a consumer: a cap on liability for want of reasonable care and skill is not binding on a consumer to that extent. -->


11.1 Nothing limits liability for death or personal injury caused by negligence, fraud, or anything else that cannot lawfully be limited.

11.2 Subject to 11.1, **neither party is liable for indirect or consequential loss, loss of profit, revenue, business, anticipated savings, data or goodwill.**

11.3 Subject to 11.1, Gridsmith's total aggregate liability under the agreement is limited to **the greater of (a) the total fees paid under the relevant Scope and (b) £`[TK]`**.

11.4 Gridsmith maintains professional indemnity insurance of £`[TK]`. Evidence available on request.

11.5 Claims must be notified within 12 months of the client becoming aware of the circumstances giving rise to them.

11.6 **NEW — Unfair Contract Terms Act 1977: which provisions apply.** Section 2(1) makes an exclusion
or restriction of business liability for death or personal injury resulting from negligence ineffective,
and no contract term or notice can defeat it. That is why 11.1 is unqualified rather than a concession.
Section 2(2) subjects an exclusion or restriction of liability for any other loss or damage caused by
negligence to the requirement of reasonableness. Section 3 applies where the client deals on Gridsmith's
written standard terms of business, and subjects to the same requirement any term by which Gridsmith
excludes or restricts liability for its own breach, or claims to be entitled to render a contractual
performance substantially different from that which was reasonably expected of it, or to render no
performance at all. **This agreement is Gridsmith's written standard terms of business unless the Scope
records that its terms were individually negotiated**, so section 3 applies to 11.2, 11.3, 11.5, 7.4
and 12.3.
<!-- L-UCTA-1 — s. 1(1)(a) defines "negligence" to include breach of a contractual obligation to
exercise reasonable care or skill. Clause 12.1 is exactly such an obligation, so a failure of it is
UCTA negligence and s. 2(2) governs any limit on it — **not only s. 3**. Both routes are stated because
they have different triggers: s. 2 needs no contract at all and no standard terms; s. 3 needs both. A
draft that named only s. 3 would lose the limb that survives an individually negotiated Scope. -->
<!-- L-UCTA-3 — the "unless the Scope records" conditional is deliberate. Whether the client "deals on
the other's written standard terms of business" is a question of fact per engagement, and asserting it
flatly would assert something no round has established. `[TK — nothing in the repository records
whether any Scope has ever varied these terms. If none ever has, the conditional is theoretical; if
some have, s. 3 does not reach those engagements and the reasonableness analysis differs between
clients on one instrument.]` -->

11.7 **NEW — the reasonableness test.** Section 11(1) asks whether the term was a fair and reasonable
one to be included **having regard to the circumstances which were, or ought reasonably to have been,
known to or in the contemplation of the parties when the contract was made** — as at contract date, not
with hindsight from the loss. Section 11(4) provides that where a term restricts liability to a
specified sum of money, regard is to be had in particular to the resources which Gridsmith could expect
to be available to it for the purpose of meeting the liability should it arise, and to how far it was
open to Gridsmith to cover itself by insurance. **Section 11(5) places the burden of showing that a term
satisfies the requirement of reasonableness on the party claiming that it does, which is Gridsmith.**
<!-- L-UCTA-11 — s. 11(3) states a DIFFERENT test for a non-contractual notice: whether it is fair and
reasonable to allow reliance on it, judged on the circumstances obtaining when the liability arose
rather than at contract date. It is not engaged by this agreement, which is a contract. It is the test
that governs WEBSITE-TERMS.md clause 11 if a browsewrap is a notice rather than a contract, and that
clause now says so. -->
<!-- L-UCTA-11 — **Schedule 2 is NOT cited here and that is deliberate.** Its opening words confine it
to "sections 6(1A), 7(1A) and (4), 20 and 21", and s. 11(2) directs regard to it "for the purposes of
section 6 or 7 above". Those are the supply-of-goods provisions, and Gridsmith supplies services — so
on the face of the Act **no clause in this agreement is within Schedule 2's terms at all**. The
guidelines are routinely applied by analogy to s. 3 cases, but that is authority, not statute, and
`CNV-8` records that **no round in this project has read any authority**. Reciting Schedule 2 here as
the applicable checklist would be a clause citing a provision that does not discharge it — the defect
round 9 fixed at 16.1 and round 8 identified at WEBSITE-TERMS.md clause 3. The guidelines are set out
in 02-CITATION-LEDGER.md `L-UCTA-11` for the solicitor instead. -->

11.8 **NEW — the cap and the insurance are one question, not two.** Section 11(4)(b) directs attention
to the professional indemnity cover at 11.4 when testing the cap at 11.3, so a cap set materially below
the cover actually available is harder to defend than one set at it.
<!-- **OWNER INSTRUCTION — 29 August 2026, and it is an instruction, not a note.**
The owner is obtaining the professional indemnity cover this week. When the cover is known, the cap
at 11.3 and the s. 11(4)(b) reasonableness argument are to be **set together, in one pass**.
**DO NOT PICK A FIGURE FOR 11.3 IN THE MEANTIME** — not a placeholder, not a "sensible default", not
a zeroed one. This is stated as a prohibition because the failure mode is specific and this
repository has already recorded it in the general form (`CLAUDE.md` non-negotiable #2, "never a
plausible figure"): a later session reads a `[TK]` next to a clause that will not render sensibly
without a number, judges the gap unhelpful, and supplies a plausible one. Here that would be worse
than unhelpful. **A cap chosen before the cover is known cannot be defended under s. 11(4)(b)**,
because the subsection directs the enquiry to the insurance — so an invented figure does not merely
sit in the document waiting to be replaced, it makes the clause harder to justify than leaving the
gap. The `[TK]` is the correct state of this clause until the owner's call lands.
-->
<!-- L-UCTA-11 — this is the substantive consequence of reading the Act, and it changes how the two
open figures should be settled. 11.3 and 11.4 have been carried as two independent owner `[TK]`s
through four revisions; s. 11(4)(b) makes them one decision, and the order matters — **the cover has to
be known before the cap can be chosen**, not after. Choosing the cap first is choosing the harder half
of a single question in the dark. -->
<!-- L-UCTA-SCH1 — note what does NOT save this clause. Schedule 1 para. 1(c) takes ss. 2 and 3 out of
a contract "so far as it relates to" the creation or transfer of a right or interest in intellectual
property, and clause 8 is an IP assignment. **The carve-out is "so far as it relates to", not "if it
contains"**: so far as 11.2 and 11.3 operate on liability for negligent performance of the services,
para. 1(c) does not touch them. Where exactly the line falls is a question of construction on
authority — `CNV-8` again — so nothing here is drafted on the footing that Schedule 1 saves it. A limit
drafted to survive the reasonableness test is unharmed by later discovering it never had to. -->

> **For solicitor review:** 11.3 must satisfy the UCTA 1977 reasonableness test, which 11.7 now states
> and 11.6 now routes. **The statute is no longer the open question; its application is.** A cap at
> fees paid may be unreasonable for a high-consequence deliverable such as an engineering drawing set
> used in construction, and a differentiated cap by division may be more defensible than a single
> figure. Please also settle the three points the statute does not answer: **(i)** whether Schedule 2's
> guidelines are applied by analogy to a s. 3 case, which is authority and not statute; **(ii)** how far
> Schedule 1 para. 1(c) removes clause 11 from ss. 2 and 3 given clause 8; **(iii)** whether Schedule A3
> defines the duty or excludes it — see the note there. `[TK — both figures at 11.3 and 11.4 are owner
> items, and s. 11(4)(b) makes them one decision rather than two. The test cannot be applied to either
> until both exist.]`

## 12. Warranties
<!-- L-UCTA-3 — REVISED 29 August 2026, round 12. The NO LEDGER ENTRY flag covered the whole clause and
is now narrowed to 12.1, 12.2 and 12.4, which are express warranties and are commercial terms.
**12.3 is not a commercial term — it is an exclusion**, and where the client deals on these written
standard terms it is a s. 3(2)(a) term subject to the requirement of reasonableness, with the burden on
Gridsmith under s. 11(5). Note the interaction with 12.1: s. 1(1)(a) makes breach of the
reasonable-care-and-skill warranty "negligence" for UCTA purposes, so an exclusion of implied terms
reaching that far would also engage s. 2(2). 12.3 is expressed "to the extent permitted", which is what
stops it doing so.
12.3 has no consumer counterpart and must not acquire one — CRA 2015 ss. 49 and 57 make it void against
a consumer, and UCTA ss. 2(4) and 3(3) put the consumer case outside UCTA entirely. -->


12.1 Gridsmith warrants it will perform with reasonable care and skill, in accordance with good industry practice.

12.2 Gridsmith warrants the deliverables will conform to the Scope in all material respects for 30 days from acceptance.

12.3 **REVISED.** Except as stated, all warranties implied by law are excluded to the extent permitted.
**Where the client deals on these written standard terms of business, that exclusion is subject to the
requirement of reasonableness under section 3 of the Unfair Contract Terms Act 1977, and the burden of
showing it reasonable is Gridsmith's under section 11(5).**

12.4 Gridsmith does not warrant any commercial outcome. **No representation is made about sales, revenue, rankings, traffic, audience or any other result.**

## 13. Term and termination
<!-- NO LEDGER ENTRY: termination is a commercial term. Retained. -->


13.1 The agreement runs until the Scope is completed, or until terminated.

13.2 Either party may terminate on 30 days' written notice.

13.3 Either party may terminate immediately on material breach not remedied within 14 days of notice, or on insolvency.

13.4 On termination, the client pays for all work completed and all committed third-party costs. Deliverables paid for in full are assigned under clause 8.3. Work not paid for is not licensed.

13.5 **Retainer and recurring services** may be terminated on the notice period stated in the relevant Schedule.

## 14. General
<!-- NO LEDGER ENTRY: boilerplate. Retained. 14.7 (governing law and exclusive jurisdiction) has a consumer counterpart at CONSUMER-TERMS.md 16.4 which is deliberately non-exclusive. -->


14.1 Neither party is liable for failure caused by events beyond its reasonable control.

14.2 Neither party may assign without the other's written consent, except to a successor of its business.

14.3 Nothing creates a partnership, joint venture or employment relationship.

14.4 No third party may enforce this agreement under the Contracts (Rights of Third Parties) Act 1999.

14.5 The agreement is the entire agreement between the parties on its subject matter.

14.6 Variations must be in writing and signed.

14.7 Governed by the law of England and Wales, with exclusive jurisdiction of the courts of England and Wales.

## 15. Contracting by electronic means — NEW
<!-- L-ECOM-9-11 -->

15.1 Where this agreement or any Scope or Change Order is concluded by electronic means, the parties,
**being neither of them a consumer**, agree that **regulations 9(1), 9(2) and 11(1)** of the
Electronic Commerce (EC Directive) Regulations 2002 do not apply. Regulation 9(3) — under which
Gridsmith makes these terms available in a form the client can store and reproduce — continues to
apply and is not excluded.

15.2 Where this agreement, a Scope or a Change Order is concluded **exclusively by exchange of
electronic mail or by equivalent individual communications**, regulations 9(1), 9(2) and 11(1) do not
apply in any event, by operation of regulations 9(4) and 11(3). Clause 15.1 is agreed for the
avoidance of doubt and does not imply that those regulations would otherwise bite.

15.3 Gridsmith will nonetheless acknowledge receipt of any order placed electronically without undue
delay, and will make the concluded agreement available to the client.
<!-- L-ECOM-9-11 — revised 26 August 2026, round 7. Two corrections, both verified by fetching regs. 9
and 11 in full:
(a) the excludable set is regs. 9(1), 9(2) and the WHOLE of 11(1). Each opens "Unless parties who are
not consumers have agreed otherwise", and in reg. 11 that conditional governs paragraph (1) entire —
the instrument draws no (a)/(b) division for this purpose. The clause previously named "9(1) and
11(1)(b)", which disapplied less than the parties can and cited a division that does not exist.
Reg. 9(3) carries no such conditional and is NOT excludable, so 15.1 now says so rather than leaving a
reader to infer the exclusion is wider than it is.
(b) reg. 9(4) and reg. 11(3) already disapply all three paragraphs for a contract concluded
exclusively by email — which is how Gridsmith in fact contracts (clause 3.1: work begins on a written
Scope; 01-FACTUAL-INVENTORY.md §7: nothing can be ordered on the website). Clause 15 is therefore
belt-and-braces over a carve-out that already applies.
`[DECISION REQUIRED — for the solicitor: whether clause 15 is worth keeping at all. It costs nothing
and covers the case where a Scope is agreed through some future non-email mechanism; but if every
Gridsmith contract is concluded by email, regs. 9(4) and 11(3) do the work and the clause is a
billable paragraph the statute did not require. Keeping it is defensible; keeping it without knowing
this is not.]`
These regulations are mandatory for consumers, which is why CONSUMER-TERMS.md has the opposite
provision. Not engaged on the website today: no contract is concluded there, because the estimator is
NOT BUILT. -->

## 16. Marketing — NEW
<!-- L-PECR-22 -->
<!-- L-PECR-23 -->

16.1 **REVISED.** Where the client is a **corporate subscriber**, PECR reg. 22 does not restrict
Gridsmith sending it marketing electronic mail. **PECR reg. 23 applies regardless**, and Gridsmith will
accordingly, in every marketing message: not disguise or conceal the identity of the person on whose
behalf it is sent; provide a valid address to which a request that such communications cease may be
sent; and stop on request.
<!-- L-PECR-23 — REVISED 26 August 2026, round 9. The undertaking in this clause is a **reg. 23**
obligation and the clause cited **`L-PECR-22`** for it, an entry whose provision field is
"reg. 22(1)–(3); reg. 22(3A) and 22(5)" and which states no reg. 23 requirement at all. reg. 23's
verified text sat in `CNV-3` — the ledger's COULD NOT VERIFY section — which is a good record and the
wrong citation home, because it is the section a solicitor reads to find out what was *not* established.
This is the same defect round 8 identified at `WEBSITE-TERMS.md` clause 3 and declined to commit: a
clause citing an id that does not discharge it.
`L-PECR-23` now exists and carries reg. 23(a)–(d) verbatim. **reg. 23 was fetched and read again at
source for it in this round** rather than promoted from `CNV-3` or from round 8's note in 16.2 —
so the "no individual-subscriber limitation" proposition this clause rests on has now been independently
derived from the instrument three times (round 8, `06-FINAL-VERIFICATION.md` §1.3, and round 9).
The wording is also tightened to track reg. 23(a) and (b) rather than paraphrasing them as "identify
itself and give a valid address": (b) requires a valid address **for a request that the communications
cease**, which is a narrower and more useful thing than a contact address, and the old wording did not
say so. reg. 23(c) and (d) — the SI 2002/2013 reg. 7 limbs — are recorded in `L-PECR-23` with a `[TK]`
noting that reg. 7 has not been read at source in any round; they are not drafted here because no
marketing send exists. -->

16.2 Where an individual at the client is an **individual subscriber** — including a sole trader using
a personal address — Gridsmith will send marketing electronic mail only with consent, or where the
PECR reg. 22(3) soft opt-in conditions are met, and will give a simple free means of refusing in every
message.
<!-- L-PECR-22 — the divergence stated to each standard rather than collapsed.
CNV-3 CLOSED, 26 August 2026, round 8. This note previously instructed the reader NOT to rely on 16.1
pending a reading of PECR reg. 23. **reg. 23 has now been fetched and read in full at source in this
round** — not taken from the round-7 record and not taken from `PRIVACY-POLICY.md` §3A, both of which
are drafts rather than instruments. It provides that a person shall neither transmit nor instigate the
transmission of direct-marketing electronic mail "(a) where the identity of the person on whose behalf
the communication has been sent has been disguised or concealed; (b) where a valid address to which the
recipient of the communication may send a request that such communications cease has not been
provided", plus two reg. 7 limbs. It opens "A person shall neither transmit …" and speaks of "the
recipient", and **carries no "individual subscriber" limitation** — unlike reg. 22, which reg. 22(1)
confines to individual subscribers. So it binds for corporate-subscriber marketing where reg. 22 does
not, which is precisely what 16.1 rests on. **16.1 is soundly based and may be relied on.**
Round 9: the reading above is re-derived and holds. **The citation is now `L-PECR-23`, at 16.1 where
the obligation is** — this note is left in place because it records how the proposition was reached,
but it is no longer the only place reg. 23's text lives. -->
<!-- Not engaged today: no marketing send of any kind exists (01-FACTUAL-INVENTORY.md sections 3 and 7). -->

---

# Schedule A — Gridsmith Design

**A1 Deliverables.** As stated in the Scope, itemised by asset or by drawing sheet.

**A2 Standards.**<!-- NO LEDGER ENTRY: BS 8888, BS EN ISO 128, Eurocodes and the RIBA Plan of Work are named as examples. `[TK — CLAUDE.md prohibits inventing standards codes; the solicitor and the technical lead must confirm each named standard is one Gridsmith actually works to, or the examples must be removed.]` --> Technical work is produced to the standards named in the Scope (for example BS 8888, BS EN ISO 128, relevant Eurocodes, RIBA Plan of Work stages). Where no standard is named, Gridsmith works to good industry practice.

**A3 Checking.**<!-- L-UCTA-2 — REVISED 29 August 2026, round 12. The previous flag read "NO LEDGER
ENTRY: allocation of design responsibility is a commercial and professional-liability term." That is
the characterisation Gridsmith wants to be right, and **whether it is right is exactly the question
s. 13(1) asks.** The closing words of s. 13(1) provide that "sections 2, 6 and 7 also prevent excluding
or restricting liability by reference to terms and notices which exclude or restrict the relevant
obligation or duty" — so a term purporting to define the duty narrowly, rather than to exclude
liability for breaching it, is still caught **if on its true construction it is doing the second thing**.
Note which sections that tail names: **ss. 2, 6 and 7, and NOT s. 3.** The route to A3 is therefore
s. 2(2), and citing s. 3 for it would be wrong.
This is the highest-consequence clause in the agreement — an engineering drawing set used in
construction is the deliverable 11.8 is about — and the distinction it turns on is decided on
authority, which `CNV-8` records nobody here has read. --> Technical deliverables are subject to Gridsmith's internal checking process before issue. **This does not replace the client's own design check, verification, or professional sign-off.** The client remains responsible for verifying that deliverables are fit for its intended purpose.

> **[DECISION REQUIRED] — for the solicitor, added round 12: does A3 define the duty Gridsmith
> undertakes, or exclude one it would otherwise owe?** Section 13(1) of UCTA brings within section 2 a
> term which "excludes or restricts the relevant obligation or duty", so if A3 falls the wrong side of
> that line it is subject to the section 2(2) reasonableness test rather than being a description of
> what was sold — and under section 11(5) the burden of showing it reasonable would be Gridsmith's.
> Gridsmith produces drawings; it is not taking on design liability for the client's engineering
> decisions. That distinction must be watertight and the PI insurance at 11.4 must match it.

**A4 IP.** On payment in full, final approved deliverables are assigned under clause 8.3. Working files, rejected concepts and source assets remain Gridsmith's unless the Scope provides for their transfer.

**A5 Revisions.** The Scope states the number of revision rounds. Further revisions are chargeable.

**A6 Design Desk retainer.** Monthly fee, stated hours, stated turnaround SLA, stated rollover policy. Minimum term and notice period as stated. Unused hours do not carry beyond the stated rollover.

> **For solicitor review:** A3 is important, and round 12 gave it a provision — see the
> `[DECISION REQUIRED]` above and `L-UCTA-2`. Gridsmith produces drawings; it is not taking on design
> liability for the client's engineering decisions. This distinction must be watertight and the PI
> insurance must match it.

# Schedule B — Gridsmith Digital

**B1 Ownership.**<!-- NO LEDGER ENTRY: assignment under clause 8. Retained. --> On payment in full, the client owns:
- (a) the source code written for the project, assigned under clause 8.3;
- (b) all data in the systems built;
- (c) the accounts and infrastructure, or full administrative access to them.

**B2 Handover.** On final payment Gridsmith transfers repository ownership, infrastructure access, environment variables (excluding Gridsmith's own credentials), and documentation.

**B3 Third-party components.** Deliverables include open-source and third-party components licensed under their own terms. Ownership under B1 does not extend to these. The Scope lists material third-party dependencies and any recurring licence costs.

**B4 Background IP.** Gridsmith's reusable frameworks and components are licensed under clause 8.2, not assigned. The Scope identifies where they are used.

**B5 Warranty.** Gridsmith will correct defects notified within **90 days** of acceptance at no charge, where the defect is a failure to conform to the Scope. This does not cover changes in third-party services, changes made by others, or new requirements.

**B6 Care Plan.** Monthly fee, stated response and resolution SLAs, stated included hours, stated exclusions. Minimum term and notice period as stated.

**B7 No outcome warranty.** Gridsmith does not warrant search rankings, traffic, conversion rates or commercial performance.

> **For solicitor review:** B1 is quoted on the website as an ownership guarantee. The website must not claim more than this clause gives. B3 in particular is a real limit on "you own everything" and the site must reflect it honestly.

# Schedule C — Gridsmith Press

**C1 Rights.**<!-- NO LEDGER ENTRY: author retains copyright. Retained. This is the clause the Press rights page cites, and the site must not claim more than it gives. --> **The author retains 100% of the copyright in the work at all times.** Gridsmith acquires no ownership interest in the manuscript, the finished book, or any derivative.

**C2 Royalties.** **The author receives 100% of royalties and sales income.** Gridsmith takes no royalty, no commission on sales, and no share of income. Gridsmith is paid only the fees stated in the Scope.

**C3 Licence.** The author grants Gridsmith a limited, non-exclusive, revocable licence to reproduce and adapt the work solely to produce the deliverables. It terminates on delivery, except for the portfolio licence at C7.

**C4 Deliverables.** Cover design, interior design and typesetting produced by Gridsmith are assigned to the author on payment in full under clause 8.3.

**C5 Distribution.** Where the Scope includes distribution setup, Gridsmith will prepare and submit the title to the platforms named in the Scope, to each platform's current technical and content specifications. **All publishing and retail accounts are established in the author's name and under the author's sole control.** Gridsmith does not hold, operate or receive income through any account in its own name on the author's behalf.

**C6 ISBN.** **The author is the publisher of record.** The ISBN is registered to the author, not to Gridsmith, and Gridsmith operates no imprint. Where the Scope includes it, Gridsmith will assist the author in obtaining their own ISBN from the relevant national agency and in completing the associated metadata registration. The ISBN, and the publisher record attached to it, belong to the author permanently and are unaffected by the end of this agreement.

**C6.1 Platform compliance.** Where the Scope names distribution platforms, Gridsmith will produce files meeting each platform's published specification at the time of submission (trim sizes, bleed, spine calculation, cover template, colour profile, file format, metadata fields, category and keyword requirements). Platform specifications change; Gridsmith warrants compliance at the date of submission, not indefinitely.

**C6.2 Marketing.** Book marketing is a **separate service** with its own Scope and fee. It is not included in any publishing package unless expressly stated. Clause C10 applies to it in full.

**C7 Portfolio.**<!-- L-GDPR-6 — naming an author is personal data; written consent is the basis relied on here. -->
<!-- L-DMCC-SCH20-13 — a curated portfolio is not a review, but selection that implies outcomes is adjacent to the prominence limb. --> Gridsmith may display the published title in its portfolio and link to retail listings. **Written author consent is obtained before any title is displayed** and may be withdrawn on notice.

**C8 Editorial.** Gridsmith advises; the author decides. Final content is the author's, and the author is responsible for the accuracy and legality of the text.

**C9 Author warranties.**<!-- L-CRA-57 — flagged: a warranty and indemnity of this width against a consumer author is assessed under CRA 2015 Part 2 and s. 57. Schedule C belongs to the BUSINESS agreement and must not reach a consumer; the consumer counterpart at CONSUMER-TERMS.md 9.3 is deliberately softer, and that asymmetry is intentional. --> The author warrants that the work is original, does not infringe copyright, is not defamatory, does not breach confidence or privacy, and does not contain unlawful material — and indemnifies Gridsmith accordingly.

**C10 No outcome warranty.**<!-- L-DMCC-SCH20-13 -->
<!-- L-CRA-50 — for a consumer this is the counterweight to anything said on the website about outcomes: what is said publicly becomes a term, so the terms and the site must agree. --> Gridsmith makes **no representation about sales, rankings, reviews, bestseller status or income** — in respect of publishing services or marketing services. Services are supplied; commercial outcomes are not promised. This applies to marketing engagements without exception.

**C11 Revisions.** The Scope states the revision rounds included. Further rounds are chargeable at the rate stated.

**C12 Content Programme.** Monthly fee, stated output, stated turnaround, stated revision rounds, stated exclusions, minimum term and notice period.

> **For solicitor review:** C1, C2 and C6 are the clauses the website's rights page cites. The page must say exactly what these say and nothing more. Note that Gridsmith operates **no imprint and takes no publisher record** — this is a service-only model and the terms should not contain any residual language implying otherwise. Please confirm C9 (author warranties and indemnity) is enforceable against a consumer author, since the equivalent in `CONSUMER-TERMS.md` §9.3 is softer.

# Schedule DP — Data Processing
<!-- L-GDPR-28 -->
<!-- L-GDPR-44A -->


To be drafted where Gridsmith processes personal data on the client's behalf. Must cover: subject matter and duration · nature and purpose · types of data and categories of data subject · controller instructions · confidentiality · security measures · sub-processors and authorisation · assistance with data subject rights · breach notification · deletion or return on termination · audit rights · international transfers and the mechanism relied on.

---

**`[TK]` items:** company number · registered office · liability cap figure (11.3) · PI insurance
limit (11.4) · the VAT treatment sentence (6.7) · a DPA
for every processor Gridsmith uses (10.3) · the region and transfer mechanism for each (10.4) · the
electronic complaint form (10.5) · confirmation of every standard named in A2 · whether an
electronically executed agreement is "signed" for CDPA s. 90(3) and s. 91(1), and whether "other
intellectual property rights" are validly assigned by clause 8.3's words.

**Closed at round 7, 26 August 2026:** the Late Payment rate and fixed sum (6.4) — now cited to
`L-LATE-PAYMENT`, SI 2002/1675 art. 4 and 1998 Act ss. 5A(2) and 5A(2A); and the CDPA citation for
clause 8.3 — now cited to `L-CDPA-90-91`, ss. 90(3) and **91**.

**`[DECISION REQUIRED]` items:** whether clause 15 is retained at all, given that regs. 9(4) and 11(3)
already exclude regs. 9(1), 9(2) and 11(1) for a contract concluded by email (15.2) · **NEW, round 12 —
whether Schedule A3 defines the duty Gridsmith undertakes or excludes one it would otherwise owe, which
decides whether UCTA s. 2(2) reaches it (Schedule A, A3)**.

**Added at version 1.4 (round 12), and all three are for the solicitor because the statute does not
answer them:** whether UCTA Schedule 2's guidelines are applied by analogy to a s. 3 case (11.7) ·
how far Schedule 1 para. 1(c) removes clause 11 from ss. 2 and 3, given that clause 8 is an IP
assignment (11.8) · whether any Scope has ever varied these terms, which decides whether the client
"deals on written standard terms of business" and therefore whether s. 3 is engaged at all (11.6).
**Also recorded: the liability cap (11.3) and the PI limit (11.4) are one decision, not two** —
s. 11(4)(b) directs the reasonableness enquiry to the insurance, so the cover has to be known before
the cap is chosen.

**Closed at round 7:** the one-slug/two-instruments problem set out at the head of this document was
`[DECISION REQUIRED]` and is now `[DECISION RECORDED]` — the owner split the routes on 26 August 2026.
