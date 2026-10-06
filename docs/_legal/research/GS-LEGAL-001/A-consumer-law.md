# GS-LEGAL-001 — Agent A: UK consumer law and the consumer client terms

**Workstream:** A (primary UK law and consumer). **Review date:** 6 October 2026. **Subject:**
`docs/_legal/CONSUMER-TERMS.md` v2.0 (effective 2 September 2026), read with `MSA-BUSINESS.md`,
`WEBSITE-TERMS.md`, `00-LEGAL-BASIS.md`, `02-CITATION-LEDGER.md` and `LEGAL-LAUNCH-CHECKLIST.md`.

This is a research record, not legal advice. Nobody has approved it as a solicitor would. It
does not say the consumer terms are "compliant" or "enforceable". It says what the current primary
text requires, where the draft departs from it, and which decisions only the owner can take.

---

## 0. Method, and what could not be verified

**How sources were read.** Primary legislation was read from legislation.gov.uk in its
*latest available (revised)* form. Each instrument was downloaded as XML (`/data.xml`), and the
amendment and commencement annotations were read alongside the text. Official guidance came
from GOV.UK through its content API and the published PDFs. At the time of this review the
WebSearch/WebFetch quota ran out. After that, the same sources were fetched directly with `curl`,
so no part of the legal content relies on memory.

| Instrument | Version read | Outstanding / unapplied changes noted on legislation.gov.uk |
|---|---|---|
| SI 2013/3134 (CCR) | latest revised, valid from **1 Jan 2026** (that date is DMCCA s. 288(9), which applies the CCR to *consumer savings schemes*. It does not apply to Gridsmith) | **DMCCA s. 279(4)–(6)** would insert a definition of "subscription contract" in reg. 5, a new reg. 7(4A) and a new reg. 27(3A). s. 279 is **not in force** (prospective) |
| Consumer Rights Act 2015 Pt 1 Chs 2–4, Pt 2, Sch 2 | latest revised | none affecting the provisions cited |
| DMCCA 2024 Pt 4 Ch 1 (ss. 225–230, 246), Ch 2 (s. 254), Ch 4 (s. 308), s. 279 | latest revised | see §3 |
| Rome I (Reg. 593/2008, assimilated) Arts 3, 6 | valid from 27 Feb 2025 | none |
| Civil Jurisdiction and Judgments Act 1982 ss. 15A, 15B, 15E | valid from 6 Apr 2025 | none |
| Provision of Services Regs 2009 (SI 2009/2999) regs 8, 9, 11, 12 | valid from 27 Feb 2025 | none |
| E-Commerce Regs 2002 (SI 2002/2013) regs 9, 11, 13 | valid from 7 May 2026 | none |
| ADR Regs 2015 (SI 2015/542) reg. 19 | **revoked 6 Apr 2026** (DMCCA Sch. 27 para. 10; SI 2026/284) | — |

**Official guidance read:** CMA37 *Unfair contract terms*, **updated 22 July 2026** after the CMA's
2026 consultation (paras 6.60–6.68 read in full). CMA209 *Price transparency* (PDF dated 13.2.26;
paras 4.16–4.19 read). CMA200 *Direct consumer enforcement guidance* (paras 7.22–7.23 read). The
GOV.UK news release of 9 August 2026 on the subscription regime.

**UNVERIFIED (not read at source in this review).** These are flagged wherever they are relied on:

- CJEU C-641/19 *PE Digital* (8 Oct 2020), on how to calculate the proportionate amount under
  Directive 2011/83 art. 14(3). It would be assimilated case law because it was decided before
  31 Dec 2020. Its holding is stated here from secondary knowledge only.
- Brussels Ia Arts 17–18 and the national consumer laws of other countries (foreign law, outside
  this workstream).
- Whether the UK's accession to the Hague Judgments Convention 2019 affects consumer judgments.
- The CMA's *Writing a fair contract for customers* (updated 22 July 2026): listed, not read.
- The status of DMCCA ss. 232–235 (private rights of redress). Their legislation.gov.uk pages carry
  only "not in force at Royal Assent", and SI 2025/272 reg. 2(3) expressly excepted them from the
  6 April 2025 commencement. No later commencement was found, so they are treated as **not in
  force** (medium confidence).

---

## 1. Key findings (one screen)

1. **The cancellation section (§6) states the right correctly at a high level but cannot work as
   written.** It names an express request and an acknowledgement. It never says how either is
   obtained, how the "proportionate amount" is worked out, when the refund is paid, or how. It
   also does not give the **model cancellation form**, which reg. 13(1)(b) requires. If the Sch. 2
   para. (l) or (n) information is not given, the consumer **owes nothing** for work done in the
   cancellation period (reg. 36(6)(a)). If para. (l) is missing, the period runs for **up to 12
   months more** (reg. 31). *High confidence.*
2. **§7 (ending a project after the period) makes the consumer's exit depend on "if we agree"**,
   and work done is valued on Gridsmith's own assessment ("reasonably carried out"). That points
   towards CRA Sch. 2 paras 4, 5, 7, 14 and 16, and to the "absolute discretion" example that
   CMA37 marks *unlikely to be fair* (para. 6.64 examples). The fix: give the consumer a right to
   end the contract, and value the work against a stage table agreed in the quotation. *Medium–high.*
3. **There is no clause on Gridsmith ending or suspending a consumer contract, and none on what
   happens to the consumer's money if it does.** Sch. 2 paras 4 and 7 make one-sided retention
   suspect. *Medium.*
4. **§2 and §9 offer "engineering … drawing … design services", with certification and sign-off
   available "where the written scope expressly says so".** That contradicts the owner's
   `GS-X002` boundary. Under CRA s. 50, whatever the terms say about the service becomes a term
   if the consumer relies on it. *High (as a mismatch with the owner's stated position).*
5. **The VAT sentence is a factual claim, and the brief says VAT status is unknown.** If it is
   wrong, it is false information about price (CCR Sch. 2(f), CRA s. 50(3), DMCCA s. 226). **OWNER
   CONFIRMATION REQUIRED.**
6. **The subscription-contracts regime (DMCCA Pt 4 Ch 2) is not in force today.** GOV.UK announced
   on 9 Aug 2026 that it will start in **January 2027**. Any consumer maintenance, hosting,
   retainer or continuing-content plan that renews or continues automatically and can be ended by
   the consumer is likely to fall within s. 254(2) once it starts. *High that it is not in force;
   date per government announcement only.*
7. **Not every consumer contract is a distance contract.** Where Gridsmith meets a consumer in
   person away from "business premises", the contract can be **off-premises**. Failing to give the
   para. (l), (m) or (n) information for an off-premises contract is a **criminal offence**
   (reg. 19). The safe model, below, routes every consumer engagement through email, which works
   for both regimes. *High on the law; the facts are an owner question.*
8. **Foreign consumers:** choosing English law cannot remove a targeted consumer's home-country
   mandatory protections (Rome I Art 6(2)). A UK consumer domiciled in Scotland or Northern
   Ireland can sue in their own courts and can be sued only there (CJJA s. 15B). §17 is
   broadly consistent with this but incomplete. *High.*

---

## 2. Authorities register

Every entry was retrieved on **6 Oct 2026**. "P" = primary legislation; "G" = official guidance.

| ID | Topic | Clause(s) affected | Authority and exact provision | Source URL | Type | Conclusion | Conf. | Owner decision? |
|---|---|---|---|---|---|---|---|---|
| A-01 | Who is a consumer | §1 | CCR reg. 4; CRA s. 2(3) and **s. 2(4)** (the trader must prove someone is *not* a consumer) | legislation.gov.uk/uksi/2013/3134/regulation/4 · /ukpga/2015/15/section/2 | P | §1 reflects the definition correctly. Add a question at enquiry or quotation stage that records whether the client is buying for a business, because Gridsmith carries the burden of proof | High | No |
| A-02 | Distance / off-premises / on-premises | §3, §6 | CCR reg. 5: *distance contract* ("organised distance … service-provision scheme", "exclusive use of … distance communication up to and including" conclusion); *off-premises contract* limbs (a)–(d); *business premises* = "immovable **retail** premises" where the activity is carried on permanently; *on-premises* = neither | /uksi/2013/3134/regulation/5 | P | A website, email and video-call sale is a distance contract. A contract made or offered in person away from retail premises, or concluded by email "immediately after" an in-person approach (limb (c)), is off-premises. A contract concluded later by email after an earlier meeting may be **on-premises**, which carries **no** cancellation right but does carry the Sch. 1 information duty (reg. 9) | High (law); facts unknown | **Yes — O-A2** |
| A-03 | Exclusions | §6 | CCR reg. 6 (gambling, financial services, construction of new buildings, immovable property and others); reg. 27(3) (off-premises ≤ £42); **reg. 28(1)(b)** (goods "made to the consumer's specifications or … clearly personalised") | /regulation/6 · /27 · /28 | P | None of the reg. 6 exclusions covers design, digital or writing services. Reg. 28(1)(b) can take out personalised **goods** such as printed copies of the consumer's own book. It never takes out **services** | High; reg. 28(1)(b) for books: medium | **Yes — O-A3** |
| A-04 | Pre-contract information | §3, quotation | CCR **reg. 13(1)(a)** (Sch. 2 "in a clear and comprehensible manner"), **reg. 13(1)(b)** (if a right to cancel exists, "give or make available … a cancellation form as set out in part B of Schedule 3"); reg. 13(3) (model instructions satisfy paras (l), (m), (n)); reg. 10 (off-premises: on **paper** or, if the consumer agrees, another durable medium); reg. 8 ("made available" only if the consumer can reasonably be expected to know how to access it) | /regulation/13 · /10 · /8 · /schedule/2 · /schedule/3 | P | §3 promises the information but supplies none of it and does not attach the model form. Each quotation must carry the full list in §6 below | High | No |
| A-05 | Pre-contract information becomes a term | §3, quotation | **CRA s. 50(3)–(4)**: information given under CCR reg. 9, 10 or 13 "is to be treated as included as a term"; a change to it "is not effective unless expressly agreed" | /ukpga/2015/15/section/50 | P | The quotation's price, timing and cancellation information binds Gridsmith. Gridsmith cannot change any of it alone | High | No |
| A-06 | Order step for electronic contracting | §3 | CCR **reg. 14(2)–(5)**: directly before the order, show paras (a), (f), (g), (h), (s), (t); the consumer must "explicitly acknowledge" that the order implies an obligation to pay; any button must say "order with obligation to pay" or an unambiguous equivalent; otherwise "the consumer is not bound" | /regulation/14 | P | Applies if acceptance happens on a portal or e-signature page. Whether acceptance by plain email reply is "concluded by electronic means" is uncertain. The conservative course is to put the acknowledgement of the obligation to pay in the acceptance wording either way (see §7.3) | Medium | **Yes — O-A11** |
| A-07 | E-Commerce Regs | §3 | SI 2002/2013 regs 9(1), 9(3), 11(1); **regs 9(4) and 11(3)** exempt "contracts concluded exclusively by exchange of electronic mail"; reg. 13 (damages for breach) | /uksi/2002/2013/regulation/9 · /11 · /13 | P | Contracting by email removes the technical-steps and order-acknowledgement duties. Reg. 9(3) still applies: the terms must be provided in a form the consumer can store and reproduce, such as a PDF attachment | High | No |
| A-08 | Confirmation on a durable medium | §3 | CCR **reg. 16(1)–(5)**: confirmation on a durable medium, including all Sch. 2 information unless already given on a durable medium; "within a reasonable time … but in any event … **before performance begins**"; treated as provided once sent. Reg. 12 is the off-premises equivalent. Reg. 17 puts the burden of proving compliance with regs 10–16 on the trader | /regulation/16 · /12 · /17 | P | No clause and no process provides for this. It is required before any work starts | High | No |
| A-09 | Cancellation right and period | §6 | CCR **reg. 29(1)** (cancel "without giving any reason" and without liability except under regs 34(3), 34(9), 35(5), **36(4)**); **reg. 30(2)** (service contract: "end of 14 days after the day on which the contract is entered into"); reg. 30(3)–(6) (sales contract: from the goods coming into the consumer's possession, or the last item); reg. 5 (*sales contract* includes "any contract that has both goods and services as its object") | /regulation/29 · /30 | P | §6's "14 days from the day after the contract is made" matches reg. 30(2) for services. It is **wrong for any consumer contract that includes goods**, such as printed books: there the whole contract runs on the goods clock | High | **Yes — O-A3** |
| A-10 | Extension where information is missing | §6 | CCR **reg. 31(2)–(3)**: if the para. (l) information is given late, but within 12 months, the period ends 14 days after it is received; otherwise it ends **12 months after** the normal end date | /regulation/31 | P | Not mentioned in the draft. A process risk more than a drafting one | High | No |
| A-11 | Exercising the right | §6, §18 | CCR **reg. 32(3)** (model form *or* "any other clear statement"); **reg. 32(4)(b)** (a web cancellation form triggers acknowledgement "on a durable medium without delay"); **reg. 32(5)** (in time if *sent* before the period ends); reg. 32(6) (burden on the consumer) | /regulation/32 | P | §6 and §18 are compliant on method. Add the "sent in time" rule and the model form | High | No |
| A-12 | Refunds | §6.1, §6.2 | CCR **reg. 34(1)** (all payments); **34(4), (6)** (without undue delay and in any event within **14 days after the day the trader is informed**); **34(7)** (same means of payment unless the consumer expressly agrees otherwise); **34(8)** (no fee); 34(13) (these provisions are terms of the contract) | /regulation/34 | P | The draft gives no deadline, method or no-fee statement. This must be added | High | No |
| A-13 | Services started during the cancellation period | §6.2 | CCR **reg. 36(1)** (no start before the period ends unless the consumer "(a) has made an express request, and (b) in the case of an off-premises contract, has made the request on a durable medium"); **36(2)** (the right is lost only if the service is fully performed **and** performance began "(a) after a request … and (b) with the acknowledgement that the consumer would lose that right once the contract had been fully performed"); **36(4)** (pay an amount "for the period for which it is supplied, ending with the time when the trader is informed" and "in proportion to what has been supplied, in comparison with the full coverage of the contract"); **36(5)** (on "the total price agreed" or, if that is excessive, market value); **36(6)** (the consumer "bears no cost" if para. (l) or (n) information was not given, or if the service was not supplied in response to a para. (1) request) | /regulation/36 | P | §6.2 is right in principle and inoperable in practice. The model in §7 below supplies the missing mechanism | High | **Yes — O-A6, O-A7** |
| A-14 | Digital content | §11 | CCR **reg. 37** (digital content "not on a tangible medium": express consent **and** an acknowledgement that the right "will be lost". The right goes when supply *begins*, and the consumer owes nothing if consent or acknowledgement is missing, or the reg. 16(3) confirmation is missing); CRA **s. 33(1)**, **s. 33(4)** ("does not supply digital content … merely because the trader supplies a service by which digital content reaches the consumer"), ss. 34–37, 42–46, 47 | /regulation/37 · /ukpga/2015/15/part/1/chapter/3 | P | Bespoke design, writing and development commissioned by a consumer is best treated as a **service contract**, so reg. 36 applies, and the files delivered should be treated as also attracting the CRA digital-content standards (ss. 34–36) to the extent that they are digital content supplied for a price. Selling **ready-made** digital products (templates, e-books, fonts, presets) would be a reg. 37 contract with a different flow | Medium | **Yes — O-A4** |
| A-15 | Ancillary contracts | §10.3, §11 | CCR **reg. 38(1)–(3)** (cancelling ends ancillary contracts with the trader, or with a third party "on the basis of an arrangement between the third party and the trader", at no cost to the consumer; the trader must tell the third party) | /regulation/38 | P | This reaches hosting, domain or platform services that Gridsmith arranges under an arrangement with the provider. It does not reach a contract the consumer makes directly with a platform such as KDP | Medium | No |
| A-16 | Additional payments | §4, §5 | CCR **reg. 40(1)–(2), (4)** (no payment beyond the main price without "express consent" before the consumer is bound; a pre-ticked default is not consent; anything paid without consent must be repaid) | /regulation/40 | P | §4's "obtaining your agreement where required" is weaker than the rule. Say it without the qualifier. Extra work agreed *after* contract is a new agreement or variation, so put it in writing as a change quotation | High | No |
| A-17 | Reasonable care and skill; information binding; price; time | §2, §9, §11, §14 | CRA **s. 49(1)**, **s. 50(1)–(2)**, **s. 51** (reasonable price only where no price is fixed), **s. 52** (reasonable time where none is fixed) | /ukpga/2015/15/part/1/chapter/4 | P | §2 states s. 49. Because of s. 50, sales emails, the website and the quotation are part of the deal. Do not let the terms say more than the owner will deliver (see A-27). Every quotation should fix a time or say how it will be fixed | High | No |
| A-18 | Remedies | §13, §14 | CRA **s. 54(3)** (repeat performance, price reduction); **s. 55** (repeat "within a reasonable time and without significant inconvenience", at the trader's cost); **s. 56(1)–(6)** (reduction "may … be the full amount of the price"; refund within **14 days beginning with the day the trader agrees** the consumer is entitled to it; same means; no fee); **s. 54(6)–(7)** (other remedies: damages, recovery of money paid, specific performance, treating the contract as at an end) | as above | P | §13 refers to these remedies but does not explain them. Defects must be handled separately from change-of-mind cancellation (§7.8) | High | No |
| A-19 | Liability that cannot be excluded | §14, §9 | CRA **s. 57(1)–(5)**; **s. 31** (goods); **s. 47** (digital content); **s. 65** (death or personal injury from negligence) | as above | P | §14 is consistent. §9's "you are responsible for reviewing the deliverables … before relying on them" must not operate as a s. 57(4)(b) "restrictive or onerous condition" on a remedy | High | No |
| A-20 | Fairness test, grey list, transparency | §5, §7, §8, §15, §17 | CRA **s. 62(1), (4), (5)**; **s. 63(1)** (Sch. 2 is "indicative and non-exhaustive"); **s. 64(1)–(4)** (core-term exemption only if "transparent and prominent"); **s. 64(6)** (no exemption for a Sch. 2 term); **s. 68** (written terms must be transparent); **s. 69(1)** (the meaning most favourable to the consumer prevails); **s. 71** (the court considers fairness of its own motion); **Sch. 2 paras 2, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 18, 20** | /ukpga/2015/15/part/2 · /schedule/2 | P | See the clause table (§5) | High | Yes (various) |
| A-21 | CMA guidance on prepayments and cancellation charges | §6, §7 | CMA37 (updated 22 Jul 2026) **paras 6.60–6.62** (a "substantial prepayment entirely non-refundable … is more likely to be unfair"; a genuine deposit may be kept only if the circumstances are "clear and narrow" and it "will not normally be more than a small percentage of the price"); **6.63** (fees must reflect savings, mitigation and the benefit of early payment; no "excessive discretion"); **6.64** (a sliding scale is acceptable only if it is never disproportionate; example "unlikely to be fair": cancellation "in its absolute discretion" with expenses plus gross profit) | gov.uk/government/publications/unfair-contract-terms-cma37 | G | Supports the §7 redesign: a consumer right to end the contract, an objective stage value, no loss-of-profit charge by default, and no large non-refundable deposits | High (as guidance) | **Yes — O-A8, O-A10** |
| A-22 | Unfair commercial practices: in force | Website, quotations | DMCCA **s. 225** (prohibition; s. 225(4) limbs), **s. 226** (misleading actions, including "true" information presented misleadingly), **s. 227** (misleading omissions, including information given in an "unclear or untimely" way), **s. 230** (invitation to purchase), **s. 246** (average consumer). All **in force 6.4.2025** (SI 2025/272 reg. 2(3)), *except* ss. 232, 234 and 235 | /ukpga/2024/13/section/225 … /230, /246 · /uksi/2025/272/regulation/2 | P | See §3.2 | High | No |
| A-23 | Invitation to purchase: the quotation | Quotation, §4 | DMCCA **s. 230(2)** (main characteristics; total price; if the price cannot be calculated in advance, how it will be; trader identity; **business address**, which for a company is its registered or principal office; email; **existence of a cancellation right**; any departure from published practice on payment, delivery, performance or complaints); **s. 230(4)** (the total includes fees, taxes and charges the consumer "will necessarily incur"); **s. 230(5)** (calculation information "with as much prominence"); **s. 230(10)** (the definition) | /ukpga/2024/13/section/230 | P | The website shows no prices, so its pages are probably not invitations to purchase. **Each consumer quotation is one**, and must contain the s. 230(2) items. CMA209 paras 4.18–4.19 accept bespoke pricing, provided the total is given once it can be calculated | High | No |
| A-24 | CMA direct enforcement | All | DMCCA s. 182 (penalty with a final infringement notice): up to **£300,000 or, if higher, 10% of worldwide turnover** (CMA200 paras 7.22–7.23). In force 6.4.2025 (SI 2025/272 reg. 2(2) — Part 3) | gov.uk/government/publications/direct-consumer-enforcement-guidance-cma200 | P/G | Raises the stakes on CRA Part 2 and CCR breaches. CMA37 (2026) states it reflects these powers | High | No |
| A-25 | Subscription contracts | Retainers, maintenance | DMCCA **s. 254(1)–(4)** (definition: automatically recurring or continuing supply, recurring liability, and a consumer right to end); s. 254 and **s. 279** prospective, **not in force**; GOV.UK news 9 Aug 2026: "New rules will now come into force in January 2027" | /ukpga/2024/13/section/254 · /279 · gov.uk/government/news/pm-starts-roll-out-of-everyday-fixes-on-the-cost-of-living-ending-rip-off-discounts-and-subscription-traps | P/G | Not in force on 6 Oct 2026. Plan for it now. Once s. 264 and s. 279(6) commence, the CCR cancellation regime will **not** apply to new subscription contracts, and the DMCCA regime will apply instead | High (status); medium (date) | **Yes — O-A5** |
| A-26 | ADR and complaints | §13 | DMCCA **s. 308** (in force 6.4.2026 by SI 2026/284): when giving the outcome of a complaint, the trader must tell the consumer about any ADR scheme it is *obliged* to use. ADR Regs 2015 revoked 6.4.2026. PSR 2009 **reg. 12** (respond to complaints "as quickly as possible" and make "best efforts" to resolve them); CCR Sch. 2(k) and (x) | /ukpga/2024/13/section/308 · /uksi/2009/2999/regulation/12 | P | Gridsmith currently has no ADR obligation, so s. 308 asks for nothing until it joins a scheme. §13 is acceptable. Add the complaints policy to the pre-contract information | High | **Yes — O-A14** |
| A-27 | Provision of Services Regs | §2, §9, quotation | PSR 2009 **reg. 8(1)** (name, legal form, address and rapid contact, register and number, VAT number *where the activity is subject to VAT*, general terms, terms on courts and applicable law, main features); **reg. 8(1)(n)** (insurance details only where the provider "is subject to a requirement to hold" professional liability insurance); **reg. 9(1)(a)** (on request, the price, or the method of calculating it, or "a sufficiently detailed estimate"); **reg. 11** (in good time before the contract) | /uksi/2009/2999/regulation/8 · /9 · /11 | P | Gridsmith is under no statutory PI requirement, so it need not disclose insurance status. This is consistent with `GS-O005`. The VAT number duty applies only if Gridsmith is registered | High | O-A1 |
| A-28 | Governing law (consumers) | §17 | Rome I (assimilated) **Art 6(1)** (the law of the consumer's habitual residence applies if the professional pursues or "by any means, directs" activities there); **Art 6(2)** (a choice of law may not deprive the consumer of their home law's non-derogable protections); **Art 6(4)(a)** (not where the services are supplied "exclusively" outside the consumer's country of residence); CRA **s. 74** (CRA Part 2 applies despite a foreign choice of law where there is a close connection with the UK) | legislation.gov.uk/eur/2008/593/article/6 · /ukpga/2015/15/section/74 | P | Choosing English law is permissible but cannot remove the protection of the consumer's home law. Say so plainly | High | **Yes — O-A12** |
| A-29 | Jurisdiction (UK-domiciled consumers) | §17 | CJJA 1982 **s. 15B(2)** (the consumer may sue where the trader is domiciled or where the consumer is domiciled); **s. 15B(3)** (the trader may sue only in the consumer's part of the UK); **s. 15B(6)** (departure only by an agreement made after the dispute arises, or one that adds options for the consumer, or one where both parties are in the same part of the UK at the time of contracting); **s. 15E(1)** (the consumer-contract definition includes "directs such activities") | /ukpga/1982/27/section/15B · /15E | P | A clause giving English courts *exclusive* jurisdiction would not bind a Scottish or Northern Irish consumer. §17 rightly has none. Do not add one | High | No |
| A-30 | DUAA 2025 (note for Agent C) | §16 | SI 2026/82 **reg. 2** (main provisions from 5 Feb 2026) and **reg. 3** (s. 103 complaints and Sch. 10 from **19 June 2026**) | /uksi/2026/82 | P | The consumer terms should not restate data rights. They should keep the cross-reference to the Privacy Policy and the separate data-protection complaints route (DPA 2018 s. 164A), which §13 already does. Commencement re-verified; the substance is Agent C's | High | No |

---

## 3. Current-law status notes

### 3.1 CCR 2013: no DMCCA amendment in force today

The only DMCCA changes to the CCR are in **s. 279(3)–(6)**: a definition of *subscription
contract* in reg. 5, plus regs 7(4A) and 27(3A), which would switch Parts 2 and 3 off for subscription
contracts made after DMCCA ss. 256 and 264 commence. legislation.gov.uk shows s. 279 as
"not in force at Royal Assent" and lists the changes as unapplied. **On 6 Oct 2026 the CCR text
quoted above is the operative text.** The 1 Jan 2026 change in the version history is DMCCA
s. 288(9), which applies the CCR to consumer savings schemes and is irrelevant here.

The CCR still refers to the Consumer Protection from Unfair Trading Regulations 2008 in reg. 39
and Sch. 2(r). Those Regulations were replaced by DMCCA Pt 4 Ch 1 on 6 Apr 2025. The CCR text
on legislation.gov.uk has not been conformed. This affects nothing Gridsmith does: it has no code
of conduct, and inertia selling is not engaged.

**No anti-avoidance provision.** The CCR text, read in full, contains no express clause preventing
traders from contracting out. A term cutting down CCR rights would still be judged under CRA Part 2
(s. 62, and s. 73 does not protect it), and would risk a misleading-omission or misleading-action
finding (DMCCA ss. 226–227). Treat the CCR rights as **not excludable in practice**. *Medium–high.*

### 3.2 DMCCA Part 4 Chapter 1: in force since 6 April 2025

The prohibition on unfair commercial practices (s. 225), misleading actions and omissions
(ss. 226–227), material information in an invitation to purchase (s. 230) and the Sch. 20 banned
practices are all in force (SI 2025/272 reg. 2(3)). The consumer's private rights of redress
(ss. 232, 234, 235) were expressly excluded from that commencement, and no later commencement was
found (see §0).

Three points for Gridsmith:

- **Quoted, not published, prices.** A bespoke quotation is lawful. CMA209 para. 4.18 recognises
  that a bespoke product's price may not be calculable in advance. Once it can be calculated, the
  **total** must be given, including every fee or charge the consumer "will necessarily incur"
  (s. 230(4)). If third-party costs such as printing, ISBNs, stock licences or platform fees are
  passed on, either include them in the total or state them with "as much prominence" as the
  price (s. 230(5)). If they cannot be calculated, say they may be payable (CCR Sch. 2(g)).
- **Website statements.** Under s. 226 and CRA s. 50, website claims about the service — response
  times, what is included, ownership, "no hidden fees" — are both potential misleading actions and
  potential contract terms.
- **Indicative pricing.** None is shown today (`GS-D002`). If indicative prices return, CMA209
  para. 4.19 requires them to be "realistic, meaningful and attainable".

### 3.3 Subscription contracts: not in force; January 2027 announced

s. 254 is prospective on legislation.gov.uk. GOV.UK (9 Aug 2026): "New rules will now come into
force in January 2027." Gridsmith offerings that probably fall within **s. 254(2)** once the regime
starts are those that run automatically for an indefinite or fixed period, with the consumer
automatically liable for each payment and entitled to end the plan. Examples: a monthly
website-maintenance or hosting-management plan, a recurring content or book-marketing retainer, and
paid ongoing support. A one-off project paid in instalments is **not** a subscription. It is a
single supply with a payment schedule, and s. 254(2)(a) needs an "automatically recurring, or
continuing, supply". *Medium confidence on classification — the commencement regulations and
guidance have not been read.* **OWNER CONFIRMATION REQUIRED (O-A5).**

Until then, for any consumer contract of indeterminate duration or that renews automatically, give
CCR Sch. 2(h) (total cost per billing period), (s) (duration and termination conditions) and
(t) (minimum duration). CRA Sch. 2 paras 8, 9, 11 and 23 also apply.

---

## 4. Terms Gridsmith cannot exclude or restrict (consumer contracts)

| # | Right or liability | Authority | Effect of a term trying to exclude it |
|---|---|---|---|
| 1 | Service performed with reasonable care and skill | CRA s. 49; s. 57(1) | Not binding |
| 2 | Anything said or written about the trader or service that the consumer relies on is a term | CRA s. 50; s. 57(2) | Not binding (subject to qualifications made on the same occasion, s. 50(2)) |
| 3 | CCR pre-contract information is a term; changes need express agreement | CRA s. 50(3)–(4) | Changes not effective |
| 4 | Reasonable price where none is fixed; reasonable time where none is fixed | CRA ss. 51–52; s. 57(3) | Not binding to the extent it stops the consumer recovering the price |
| 5 | Repeat performance and price reduction (up to the full price); refund within 14 days of agreement; same means; no fee; other remedies including damages | CRA ss. 54–56; s. 57(4) | Not binding, and conditions that make remedies onerous are also not binding |
| 6 | Digital content: satisfactory quality, fit for purpose, as described, pre-contract information, right to supply; repair or replacement and price reduction; damage to device | CRA ss. 34–37, 41, 42–46; s. 47 | Not binding |
| 7 | Goods (if printed books or other goods are supplied): ss. 9–17, delivery (s. 28), risk (s. 29); the 30-day short-term right to reject (s. 22) | CRA s. 31 | Not binding |
| 8 | Liability for death or personal injury from negligence | CRA s. 65 | Cannot be excluded or restricted |
| 9 | Liability for fraud or fraudulent misrepresentation | Common law (not re-verified here) | Cannot be excluded |
| 10 | The 14-day cancellation right for distance and off-premises contracts, the information-failure extension, reimbursement (deadline, means, no fee), and no charge for work in the period unless the reg. 36 conditions are met | CCR regs 29–36; reg. 34(13) | Treat as mandatory (see §3.1) |
| 11 | No additional payment without prior express consent; a pre-ticked box is not consent | CCR reg. 40 | Payment not due; must be refunded |
| 12 | Consumer's choice of forum (UK-domiciled consumers) | CJJA s. 15B | Contrary agreement not effective except under s. 15B(6) |
| 13 | Home-country mandatory consumer protections for targeted foreign consumers | Rome I Art 6(2) | The choice of law cannot remove them |
| 14 | Fairness and transparency; the meaning most favourable to the consumer | CRA ss. 62, 68, 69 | Unfair or opaque terms not binding |

---

## 5. Clause-by-clause assessment of `CONSUMER-TERMS.md` v2.0

Key: **C** = compliant as drafted; **R** = risk (lawful in principle, but likely to be challenged
or ineffective); **N** = non-compliant or missing a mandatory element.

| Clause | Requirement | Current text (summary) | Rating | Required change | Authority |
|---|---|---|---|---|---|
| Header | Trader identity; geographical address; email; **telephone where available** (Sch. 2(b)–(c)); business address = registered office (DMCCA s. 230(7)); legal form (PSR reg. 8(1)(b)) | Name, number, "Bolton, United Kingdom", email; full address only in §18; no phone | R | Put the registered office and the published phone number (+44 7405 448534) in the header or in §18, and in every quotation. "Ltd, a private limited company registered in England and Wales" is enough for legal form | CCR Sch. 2(b),(c); DMCCA s. 230(2)(d)–(e); PSR reg. 8 |
| §1 Application | Consumer definition; the trader bears the burden | Matches CCR reg. 4 and CRA s. 2(3) | C | Optional: "If you tell us you are buying for a business, we will ask you to confirm this in writing." Keep a record | CRA s. 2(4) |
| §2 What we provide | Main characteristics; must match what is actually offered | Lists "engineering and technical drawing services"; promises reasonable care and skill | **R/N** | Replace the "engineering" bullet with the owner's limited description (drafting, technical illustration and documentation to the client's brief) **or** remove Technical services from consumer offering until `GS-X002` closes. A term promising a service the owner will not provide becomes binding under s. 50 | CRA s. 50; DMCCA s. 226; owner boundary `GS-X002` |
| §3 Forming the contract | Sch. 2 information before the consumer is bound; model form; durable-medium confirmation before work starts; if contracting online, reg. 14 | Says the information will be given; says nothing of confirmation, the model form, or how acceptance happens | N (by omission) | Name the mechanism: the contract forms when the consumer accepts the written quotation by reply email or signature. The quotation contains the Sch. 2 information, these terms and the model cancellation form. Gridsmith then sends a confirmation email before any work starts. See §7.3 | CCR regs 13, 14, 16; E-Commerce reg. 9(3); CRA Sch. 2 para. 10 |
| §4 Price and payment | Total price including taxes (Sch. 2(f)); additional charges or the fact they may be payable (Sch. 2(g)); payment arrangements (Sch. 2(j)); deposits (Sch. 2(u)); reg. 40 express consent | "Not currently registered for VAT … the price you are given is the total"; additional charges "where required" | **R** | (1) **O-A1:** confirm VAT status. The brief says it is unknown, and a wrong statement is false price information. (2) Say the agreed price will not rise if Gridsmith later registers for VAT during the contract. (3) Delete "where required": no extra charge without prior express agreement in writing. (4) Name third-party costs in the quotation, in the total or flagged with equal prominence | CCR Sch. 2(f),(g),(j),(u); reg. 40; CRA s. 50(3)–(4), Sch. 2 paras 14–15; DMCCA s. 230(4)–(5) |
| §5 Revisions and changes | No unilateral change to price or characteristics (Sch. 2 paras 11–14) | Changes outside scope need a new price and the consumer's agreement first | C | Add that a change quotation is sent on a durable medium and that silence is not agreement. Keep "statutory rights … unaffected" | CRA Sch. 2 paras 11–14; CCR reg. 40 |
| §6 (intro) Statutory cancellation | Conditions, time limit and procedure (Sch. 2(l)); the model form (reg. 13(1)(b)); a communication *sent* in time counts | "14 days from the day after the contract is made"; cancel by clear statement to email | **N** (incomplete) | Use the replacement wording in §8 below. Add: the goods/mixed-contract clock (or confirm no goods, O-A3); the model form in an annex; the "sent before the period ends" rule; the postal address as an alternative | CCR regs 13(1)(b), 30, 32(3), 32(5); Sch. 2(l); Sch. 3 |
| §6.1 No work started | Refund of all payments within 14 days of being informed; same means; no fee | "Refund … subject to any statutory rules" | N (incomplete) | State the 14-day deadline, same payment method unless agreed otherwise, and no fee. Remove the vague "subject to any statutory rules" (s. 68 transparency) | CCR reg. 34(1),(4),(6)–(8); CRA s. 68 |
| §6.2 Early start | Express request; on a durable medium for off-premises contracts; para. (n) information; acknowledgement for loss of the right; proportionate amount on the total price; no cost if conditions are unmet | States the principles; no mechanism, no calculation method; "where the law requires that request" | **N** | Use the §7 model and the §8 wording: separate unticked request and acknowledgements captured in writing; amount = the stage-table proportion of the agreed total price, up to the moment Gridsmith is told; refund of the balance within 14 days. Delete "where the law requires": the request is always needed to start inside the period | CCR reg. 36(1)–(6); Sch. 2(n),(o) |
| §6 (missing) | Sch. 2(o): circumstances in which the right is lost; reg. 37 (if digital content is ever sold); reg. 38 ancillary contracts | Partly present | R | Covered by the §8 wording | CCR Sch. 2(o); regs 37–38 |
| §7 After the period | No disproportionate sum; no retention of prepayments for services not supplied; no trader discretion over the amount; reciprocity | "If we agree to end the project": pay for work "reasonably carried out" and unrecoverable third-party costs; refund the rest; "any properly due outstanding balance remains payable" | **R** (likely unfair in part) | (1) Give the consumer a **right** to end the contract on notice, not one dependent on Gridsmith's agreement. (2) Value the work done against the **stage table** agreed in the quotation, with a stated objective method for a part-finished stage, not "reasonably carried out" in Gridsmith's assessment. (3) Third-party costs only if committed with the consumer's prior written agreement and genuinely non-recoverable after mitigation, with proof on request. (4) Replace "any properly due outstanding balance" with a precise statement: only the value of work done and those costs, less what has been paid. Nothing is owed for unperformed work. (5) Refund within 14 days. (6) Keep "not a penalty", but do not rely on the label: Sch. 2 paras 4–6 look at effect. See §7.7 | CRA s. 62, s. 68, s. 69, Sch. 2 paras 4, 5, 6, 7, 14, 16; CMA37 paras 6.60–6.64 |
| §8 Your responsibilities | Proportionate; no hidden sanction | Provide materials; lawful materials; delay moves the timetable | C | Optional: say that a long delay caused by the consumer allows either party to end the contract under §7. Do not add charges for delay without a stated, proportionate figure | CRA Sch. 2 paras 6, 18 |
| §9 Engineering and technical drawings | Must match the owner's boundary; must not condition the remedy for reasonable care and skill | "Agreed design or drawing service"; approvals, certification and sign-off "only where the written scope expressly says so"; the consumer must review "before relying on them" | **N vs owner policy; R legally** | Redraft to the `GS-X002` boundary: drafting, illustration and documentation to the consumer's brief only; Gridsmith does **not** provide engineering design, calculations, certification, approval, stamping or sign-off and is not responsible designer; the consumer must take qualified professional advice for those. Keep "nothing excludes liability the law does not allow us to exclude". A consumer review step must not be framed as a condition of remedies | CRA ss. 49, 50, 57(4)(b); DMCCA s. 226 |
| §10 Press | Ownership and payment terms must be clear and fair; s. 50 | Client retains existing work; bespoke rights transfer on full payment; no royalties | C (consumer-law view) | Confirm in quotations what is "licensed rather than transferred" (s. 64 transparency). Say what the consumer receives if the contract ends early (see §7.7(f)). Assignment formalities (CDPA ss. 90–91) belong to the IP workstream | CRA ss. 50, 62, 64, 68 |
| §11 Digital | Digital content standards; no misleading outcome claims; third-party subscriptions disclosed | Scope identifies third-party platforms; no guarantee of commercial results | C/R | Add: any third-party subscription the consumer must pay for is stated in the quotation with its cost (Sch. 2(g), s. 230(4)). Add a sentence keeping CRA digital-content rights for files supplied. Flag maintenance plans for O-A5 | CRA ss. 33–47; CCR Sch. 2(g),(h),(s),(v),(w); DMCCA s. 254 (prospective) |
| §12 IP | Transparent; consistent with §10 | Transfer on full payment "to the extent stated in the scope" | R | Make the default explicit — final bespoke deliverables transfer unless the quotation says otherwise — so the scope narrows the transfer only by express statement (s. 69). Out-of-scope items for this workstream: CDPA formalities, moral rights in ghostwriting | CRA ss. 68–69 |
| §13 Complaints | Complaints policy (Sch. 2(k)); prompt response (PSR reg. 12); ADR information if obliged (DMCCA s. 308); CRA remedies | Acknowledge in about 5 working days; substantive reply in a reasonable time; CRA rights unaffected | C | Add a short plain statement of the s. 54–56 remedies (§8 wording). Note: Gridsmith is not currently obliged to use any ADR scheme (O-A14) | PSR reg. 12; DMCCA s. 308; CRA ss. 54–56 |
| §14 Liability | No exclusion of ss. 49–52, s. 65; foreseeability is acceptable | Liable for foreseeable loss; nothing excludes non-excludable liability | C | No change required. Do **not** import the MSA cap | CRA ss. 57, 65 |
| §15 Events outside control | Must not leave the consumer bound without performance | Delay excused; Gridsmith will notify | R | Add: if the delay is long (owner to set a period, O-A15), the consumer may end the contract and receive a refund for anything not supplied | CRA Sch. 2 paras 2, 18 |
| §16 Personal data | Cross-reference | Privacy Policy; enquiry ≠ marketing consent | C | Agent C | DPA 2018 s. 164A; PECR reg. 22 |
| §17 General / law | Severance; waiver; governing law that does not deprive the consumer of protection | E&W law; other UK forums unaffected | R (incomplete) | Add: "If you live outside England and Wales, you also keep any protection given to you by the mandatory consumer laws of the country where you live, and you may bring proceedings where those laws allow." No exclusive-jurisdiction clause | Rome I Art 6(2); CJJA s. 15B; CRA s. 74 |
| §18 Contact and cancellation | Address for cancellation; the model form | Address and email; "no particular form" | N (form missing) | Add the Sch. 3 Part B model cancellation form as an annex, filled in with Gridsmith's details and with "goods" deleted unless goods are supplied | CCR reg. 13(1)(b); Sch. 3 Part B |
| **Missing** — termination and suspension by Gridsmith | Reciprocity; no retention of sums for services not supplied | None (the MSA has §7) | **N** (gap) | Add: Gridsmith may suspend after written notice for an undisputed overdue payment, and may end the contract for serious or persistent breach after a fair chance to remedy it. On any ending by Gridsmith that is not caused by the consumer, it refunds everything paid for work not delivered. **O-A15** | CRA Sch. 2 paras 4, 7, 8 |
| **Missing** — performance time | Sch. 2(j) time to perform; CRA s. 52 | Timetable "in the quotation" (§2) | R | Each quotation must state a timetable or how it is fixed | CCR Sch. 2(j); CRA ss. 50, 52 |
| **Missing** — in-flight contracts | New terms cannot be imposed on existing contracts without express agreement | — | R | Say in each quotation which version of the terms applies; existing engagements continue on their own terms (**O-A17**) | CRA s. 50(4); Sch. 2 para. 10 |

---

## 6. Mandatory pre-contract information for every consumer quotation

Give this on a durable medium (an email body or PDF attachment) **before the consumer accepts**.
Sources are CCR Sch. 2 (distance and off-premises) and DMCCA s. 230. Sch. 1 (on-premises) is a
subset.

| CCR Sch. 2 | Content for Gridsmith | Notes |
|---|---|---|
| (a) | Main characteristics: deliverables, exclusions, revision rounds, assumptions | Also DMCCA s. 230(2)(a), PSR reg. 8(1)(m) |
| (b) | Gridsmith Ltd (and the studio trading name) | s. 230(6) |
| (c) | Registered office 30 Briarfield Road, Farnworth, Bolton, BL4 0HD; phone +44 7405 448534; contact@gridsmith.uk | "Where available" — the phone number *is* published |
| (d), (e) | Not applicable unless acting for another trader, or the complaints address differs | Subcontractors do not trigger (d) |
| (f) | **Total price including taxes**, or how it is calculated | With the VAT statement only once O-A1 is confirmed |
| (g) | Third-party costs (printing, ISBNs, stock or font licences, hosting, platform fees, postage), or the fact they may be payable | s. 230(2)(g), (4)–(5): equal prominence |
| (h) | For an indeterminate or subscription arrangement: cost per billing period or monthly | Retainers and maintenance |
| (i) | Cost of the means of communication, if above basic rate | Not applicable |
| (j) | Payment schedule (as agreed for the project), delivery and performance arrangements, **timetable** | Use the owner's agreed structure; no invented policy |
| (k) | Complaints-handling policy (§13) | |
| **(l)** | Cancellation conditions, the 14-day period, how to cancel, the model form (Sch. 3 Part B) | **Its absence extends the period (reg. 31) and removes the right to charge for early work (reg. 36(6))** |
| (m) | Return costs, only if goods are supplied | Its absence puts return costs on the trader (reg. 35(5)–(6)) |
| **(n)** | That the consumer pays a proportionate amount if they cancel after asking for an early start | **Its absence makes early work free (reg. 36(6)(a))** |
| **(o)** | That the right is lost when the service is fully performed after the request and acknowledgement; any reg. 28 exclusion (personalised goods) | |
| (p) | Goods only: reminder of the legal duty to supply conforming goods | |
| (q) | After-sales support, guarantees, if any | e.g. a warranty period on a website build |
| (r) | Codes of conduct | None |
| (s), (t) | Duration and termination conditions; minimum duration | Retainers |
| (u) | Deposits, if any, and the precise conditions | See O-A10 |
| (v), (w) | Digital content functionality and compatibility | Websites, apps, files: platforms, browsers, formats |
| (x) | Out-of-court redress the trader is subject to | None at present |
| DMCCA s. 230(2)(h) | Existence of the cancellation right | Overlaps (l) |
| PSR reg. 8(1)(i)–(j) | The general terms (attach `CONSUMER-TERMS`) and the existence of the governing-law clause | Attach a PDF (E-Commerce reg. 9(3)) |
| PSR reg. 8(1)(g) | VAT number, only if registered | O-A1 |

---

## 7. The consumer cancellation model (proposal)

The sales process is quote → acceptance → payment → start. Each step below has its legal hook.
**These are proposals for owner adoption, not settled wording.**

### 7.1 Step 0 — classify at enquiry

- Ask once, and record: "Are you buying this for a business or for yourself personally?" Consumers
  go to `CONSUMER-TERMS`; businesses go to the MSA. The burden of proving non-consumer status is on
  Gridsmith (CRA s. 2(4)).
- **Channel rule (strongly recommended):** conclude every consumer contract by email or
  e-signature, never in person. Where there has been an in-person meeting outside retail
  premises, do **not** conclude the contract at, or "immediately after", that meeting (CCR reg. 5,
  off-premises limb (c)). Even so, apply the off-premises safeguards: email for every document and
  request, which is a durable medium (reg. 5). That one process satisfies regs 10, 12, 13, 16 and
  36(1)(b) together. If any off-premises contract is ever made, reg. 10(2) requires the information
  **on paper** unless the consumer agrees to email, and reg. 19 makes it an **offence** to omit
  (l), (m) or (n). **O-A2.**

### 7.2 Step 1 — the quotation (pre-contract information)

- Send by email, with a PDF: the full §6 list; `CONSUMER-TERMS` as a PDF; the filled-in model
  cancellation form; the **stage table** (§7.5); and the **start-date choice** (§7.4).
- The quotation is an invitation to purchase. DMCCA s. 230 applies, so the total price must
  include every unavoidable charge.

### 7.3 Step 2 — acceptance (the contract is formed)

The consumer accepts in writing: by reply email, an e-signature, or a portal button. Proposed
acceptance statement (also satisfies CCR reg. 14(3)–(4) if acceptance is online):

> **Proposed acceptance wording:** "I accept Gridsmith Ltd's quotation [reference] dated [date] and
> the Consumer Client Terms (version [x]). I understand that accepting means I agree to pay the total
> price of £[amount] on the payment schedule in the quotation."

If a button is used, label it **"Accept and agree to pay"** (reg. 14(4)'s "corresponding unambiguous
formulation"). Under reg. 14(5), getting this wrong means the consumer is not bound. **O-A11.**

### 7.4 Step 2 (same message) — choosing when work starts

The early-start choice is **separate** from acceptance. It is never pre-selected, never a condition
of acceptance, and never inside the general "I accept" sentence. Offer two options:

- **Option 1 — standard start:** work begins after the 14-day cancellation period ends on
  [date]. The consumer may cancel up to then for a full refund.
- **Option 2 — early start:** the consumer gives all three statements below. Each is a separate
  active choice: a separate sentence in the reply email that the consumer types or keeps, or a
  separate unticked checkbox on a portal. For an off-premises contract they **must** be on a
  durable medium (reg. 36(1)(b)); email achieves that.

> **Proposed express request (reg. 36(1)):**
> "I ask Gridsmith Ltd to start work on [project reference] now, before my 14-day cancellation period
> ends on [date]."
>
> **Proposed acknowledgement of payment on cancellation (reflects Sch. 2(n); reg. 36(4)):**
> "I understand that if I cancel during the 14-day cancellation period after work has started, I
> will have to pay for the work carried out up to the time I tell Gridsmith I am cancelling. This is
> worked out as a share of the total price of £[amount], using the stage table in my quotation."
>
> **Proposed acknowledgement of loss of the right (reg. 36(2)(b)), only where the whole service could
> be completed within 14 days; it is harmless to include it always:**
> "I understand that if Gridsmith completes all the work under this contract before my 14-day
> cancellation period ends, I will lose my right to cancel."

If Gridsmith ever sells ready-made **digital content** (O-A4), use reg. 37 wording instead:
"I agree that you may give me access to [product] now, and I understand that I will lose my right
to cancel once the download or access begins." The confirmation must then repeat both statements
(reg. 16(3)).

### 7.5 The proportionate amount: no Gridsmith discretion

Reg. 36(4)–(5) fixes the measure: the share of the **total agreed price** that matches "what has
been supplied, in comparison with the full coverage of the contract", up to the moment Gridsmith
**is informed**. If the total is excessive, the measure is market value. It is **not** "costs
incurred", "time spent" or "reasonable value" in Gridsmith's opinion.

Proposed method, stated in every quotation:

1. **Stage table.** The quotation divides the project into stages (for example brief and research,
   first concepts, development, final files). Each stage carries a stated percentage of the total
   price that reflects the share of the work it represents. The percentages are set per project.
   The owner should not adopt fixed policy percentages.
2. **Completed stages** count at their stated share.
3. **The stage in progress** counts in proportion to its stated measure of progress: number of
   items or chapters delivered, revision rounds used, or, where nothing else fits, the hours
   recorded against that stage's hours estimate given in the quotation. Whichever measure applies
   is named in the quotation in advance.
4. **Third-party costs** (printing, ISBNs, licences) are not separately chargeable inside the
   statutory period. Reg. 29(1) allows no liability beyond the reg. 36(4) amount. **Conservative
   recommendation:** do not commit non-refundable third-party costs during the 14 days, or buy them
   in the consumer's own name at their request after the period ends. **O-A9.** *(Whether an item
   bought for and delivered to the consumer counts as "supplied" is uncertain — medium/low.)*
5. **Transparency.** On cancellation, Gridsmith sends a written breakdown — stages complete, stage
   in progress, measure, amount — with the refund.
6. **Cross-check.** If the stage percentages front-load the price beyond the work actually
   involved, reg. 36(5)(b) and CRA s. 62 cap the charge at market value or fairness. Keep stage
   shares honest.

*Interpretation note (UNVERIFIED in this review):* the CJEU in *PE Digital* (C-641/19) is commonly
read as saying the proportion is time-based unless the contract expressly divides the service into
separately priced parts. A stage table priced in the contract is the practical way to rely on that
reading. Medium confidence.

### 7.6 Step 3 — confirmation, then payment, then start

- **Confirmation email (reg. 16):** sent after acceptance and **before any work**. It confirms the
  contract, the agreed total and schedule, attaches or refers to the Sch. 2 information already
  sent on a durable medium, records the start option chosen with the exact request and
  acknowledgement text and its timestamp, and attaches the model form.
- **Payment:** Gridsmith may ask for payment on the agreed schedule during the cancellation period.
  Nothing in the CCR prevents this, but the money stays refundable under reg. 34.
- **Start:** on the date after the period ends (Option 1), or on or after the date the early-start
  request was received (Option 2).
- **Records:** keep the quotation, the acceptance, the request and acknowledgements, the
  confirmation, and the dates. Reg. 17 puts the burden of proving compliance on Gridsmith.

### 7.7 What happens on cancellation, or when something goes wrong

| Situation | Result | Authority |
|---|---|---|
| Cancels within 14 days; no work started | Full refund of everything paid, within 14 days of being told, same payment method, no fee | CCR reg. 34 |
| Cancels within 14 days after a valid early start, with (l) and (n) given | Pays the §7.5 amount up to the moment of notice; balance refunded within 14 days | regs 34, 36(4)–(5) |
| Work started without a valid request | Consumer owes **nothing** for the work in the period; full refund | reg. 36(6)(b) |
| (l) or (n) information not given | Owes **nothing** for the work in the period; if (l) is missing, the right also runs up to 12 months longer | regs 31, 36(6)(a) |
| Fully performed within 14 days after request **and** acknowledgement | No cancellation right | reg. 36(2) |
| Fully performed after a request but **without** the acknowledgement | The right survives. If (l) and (n) were given, the reg. 36(4) amount is in proportion to what was supplied, which for full performance is arguably the whole price. If (l) or (n) is missing, the consumer pays nothing | regs 36(2), 36(4), 36(6) — *medium* |
| Contract includes printed copies (goods) | The whole period runs from delivery of the (last) goods. Return rules apply (reg. 35). Personalised goods may be excluded by reg. 28(1)(b) | regs 5, 28, 30(3)–(5), 35 — **O-A3** |

**(a)–(e) After the statutory period: ending the project for convenience (replacement for §7).**
The consumer has no statutory right to cancel for convenience. Gridsmith's terms may offer one, and
the owner's stated intent is to do so. CRA Sch. 2 paras 4–7 and CMA37 6.60–6.64 shape what that
offer may charge:

- **Fair to charge:** the agreed stage value of work completed, and the stage in progress by its
  stated measure (§7.5); non-refundable third-party costs committed **with the consumer's prior
  written agreement** that cannot be cancelled or recovered after reasonable mitigation, with
  evidence on request; where possible, the consumer receives the item paid for (an ISBN, a printed
  proof).
- **High risk (do not adopt without owner decision, O-A8):** loss of profit on unperformed work; a
  flat cancellation fee; a "non-refundable" deposit of more than a small sum (CMA37 6.62); any
  amount decided at Gridsmith's discretion.
- **Reciprocity:** if Gridsmith ends the contract, other than for the consumer's serious breach,
  it refunds everything paid for work not delivered (Sch. 2 paras 4, 7).
- **(f) Deliverables on early ending:** the consumer should receive the completed work they have
  paid for, with the rights in it, to the extent of payment. **Owner decision.**

### 7.8 Defective service: separate from change of mind

The terms must keep two routes apart. **Change of mind** follows §6 and §7. **Something wrong with
the work** follows CRA ss. 49–56. Faulty work is re-done free within a reasonable time; if it
cannot be, or is not re-done properly, the consumer is entitled to a price reduction, which can be
the full price, refunded within 14 days of agreement. Other remedies remain available. Nothing in
the change-of-mind deductions applies to a defect claim, and the stage-table charge never applies
where Gridsmith is in breach.

---

## 8. Proposed public wording (PROPOSAL — for owner review, not yet adopted)

> **6. Your right to cancel**
>
> **6.1 When you can cancel.** If you agree your contract with us without meeting us in person (for
> example by email, phone or video call), or in certain other situations away from our premises,
> you can cancel it within **14 days** without giving a reason. The 14 days start the day after we
> both agree the contract. *[If printed copies or other goods are included: "If your order includes
> printed copies or other goods, the 14 days start the day after you (or someone you name) receive
> the goods, or the last of them."]*
>
> **6.2 How to cancel.** Tell us clearly that you want to cancel — by email to contact@gridsmith.uk
> or by post to Gridsmith Ltd, 30 Briarfield Road, Farnworth, Bolton, BL4 0HD. You can use the
> cancellation form at the end of these terms, but you do not have to. You have cancelled in time
> if you **send** your message before the 14 days end.
>
> **6.3 Your refund.** We will refund what you have paid, less any amount you owe under 6.5, within
> **14 days** of the day you tell us you are cancelling. We will use the same payment method you
> used unless you agree otherwise, and we will not charge you a fee for the refund.
>
> **6.4 When we start work.** We will not start work during the 14 days unless you ask us to in
> writing. If you would rather we wait, we will start after the 14 days end.
>
> **6.5 If you ask us to start early and then cancel.** If you ask us to start during the 14 days
> and then cancel within them, you pay for the work carried out up to the time you tell us. We work
> this out as a share of the total price, using the stage table in your quotation, and we send you
> the calculation. You pay nothing for work done during the 14 days if we did not give you this
> information before you agreed the contract, or if you did not ask us in writing to start early.
>
> **6.6 When you lose the right to cancel.** If you asked us to start early and confirmed that you
> understood you would lose your right to cancel once the work is complete, and we complete all of
> the work within the 14 days, you can no longer cancel. *[If applicable: "Goods made to your
> specification or clearly personalised for you, such as printed copies of your book, cannot be
> returned for cancellation, though your other rights are unaffected."]*
>
> **7. Ending a project after the 14 days**
>
> **7.1** You can end a project at any time by telling us in writing.
>
> **7.2** You will pay for: (a) stages already completed, at the share of the total price shown for
> each stage in your quotation; (b) the stage in progress, in proportion to the progress measure
> named for that stage in your quotation; and (c) any costs we have paid to other suppliers for
> your project, with your prior written agreement, that we cannot cancel or recover. We will show
> you how each amount is worked out, give you evidence of supplier costs if you ask, and pass on to
> you anything those costs paid for.
>
> **7.3** You will not pay for work we have not done, and we do not charge a cancellation fee. If
> you have paid more than the amount in 7.2, we will refund the difference within 14 days. If you
> have paid less, you pay the difference.
>
> **7.4** You will receive the finished work you have paid for, *[and the rights in it as set out
> in section 12 — owner decision]*.
>
> **7.5** If we end a project and you were not seriously in breach of these terms, we will refund
> everything you have paid for work we have not delivered.
>
> **8A. If something is wrong with our work**
>
> This is separate from cancelling. We must do our work with reasonable care and skill, and as we
> described it. If we do not, tell us and we will put it right at no cost within a reasonable time.
> If we cannot, or do not do so properly, you can ask for a price reduction — which can be up to
> the full price — and we will refund it within 14 days of agreeing that you are entitled to it. You
> may also have other legal rights. Section 7 charges never apply where we are at fault.
>
> **Annex — Model cancellation form** *(CCR Sch. 3 Part B, adapted for services)*
>
> To: Gridsmith Ltd, 30 Briarfield Road, Farnworth, Bolton, BL4 0HD, contact@gridsmith.uk
> I/We hereby give notice that I/We cancel my/our contract for the supply of the following service:
> [ ] — Ordered on [ ] — Name of consumer(s) — Address of consumer(s) — Signature of consumer(s)
> (only if this form is sent on paper) — Date.
> *(If goods are supplied, restore "of sale of the following goods / received on" per Sch. 3
> Part B.)*

---

## 9. OWNER CONFIRMATION REQUIRED

Each item gives the options and the **conservative recommendation (★)**.

| ID | Question | Options | ★ Recommendation | Why it matters |
|---|---|---|---|---|
| **O-A1** | Is Gridsmith Ltd VAT-registered or liable to register? The terms say "not currently registered"; the brief says status is unknown | (a) confirm not registered; (b) registered — publish the number and quote VAT-inclusive totals | ★ Confirm with evidence before publishing any VAT sentence. If uncertain, remove the sentence and quote totals "including any VAT" | Sch. 2(f); PSR reg. 8(1)(g); CRA s. 50; DMCCA s. 226 |
| **O-A2** | Does Gridsmith ever meet consumers in person, sign in person, or have retail "business premises"? | (a) never — distance only; (b) sometimes | ★ Adopt the channel rule (§7.1): contracts by email only, with off-premises safeguards always applied | reg. 19 offence; reg. 10 paper rule |
| **O-A3** | Do any consumer contracts include **goods** (printed books, physical media, merchandise)? | (a) none; (b) yes — printing arranged by Gridsmith; (c) yes, but bought by the consumer directly from the printer | ★ (c) where possible: the consumer contracts directly with the printer. Otherwise add the goods clock, return rules, Sch. 2(m),(p) and the CRA goods rights, and treat reg. 28(1)(b) as **uncertain** for books — draft the right *in* | regs 5, 28, 30, 34(5), 35 |
| **O-A4** | Will Gridsmith sell ready-made digital products (templates, e-books, presets) to consumers? | (a) no; (b) yes | ★ (a) for now. If (b), build a separate reg. 37 checkout | reg. 37; CRA Ch. 3 |
| **O-A5** | Will there be consumer retainers, maintenance or hosting plans, or recurring content or marketing? | (a) none for consumers; (b) fixed-term, no auto-renewal; (c) rolling | ★ (a) or (b) until the regime starts (January 2027 announced). Any rolling plan needs a regime review before launch | DMCCA s. 254 (prospective); CCR Sch. 2(h),(s),(t) |
| **O-A6** | Default start policy | (a) always wait 14 days; (b) offer early start with the §7.4 statements | ★ (b), with (a) as the default unless the consumer actively asks | reg. 36 |
| **O-A7** | Adopt a **stage table** (per-project percentages and progress measures) in every consumer quotation? | (a) yes; (b) time-based pro rata only | ★ (a) — objective and transparent; avoids discretion | reg. 36(4)–(5); CRA Sch. 2 para. 16; s. 68 |
| **O-A8** | After the 14 days: charge anything beyond work done and committed third-party costs? | (a) no; (b) a disclosed sliding scale reflecting genuine pre-estimated loss | ★ (a). (b) only with documented cost evidence and prominent display (CMA37 6.64) | CRA Sch. 2 paras 5–6 |
| **O-A9** | Third-party costs during the 14-day period | (a) commit none; (b) commit with consumer consent in writing | ★ (a) | reg. 29(1) |
| **O-A10** | Deposits | (a) all prepayments refundable as in §§6–7; (b) a small booking deposit with narrow, stated forfeiture conditions | ★ (a). Never "non-refundable" for a substantial sum | CMA37 6.60–6.62; Sch. 2 para. 4 |
| **O-A11** | How consumers accept | (a) reply email; (b) e-signature or portal | ★ (a) or (b), with the §7.3 wording either way; button "Accept and agree to pay" | CCR reg. 14; E-Commerce regs 9(4), 11(3) |
| **O-A12** | Consumers outside the UK | (a) accept, with the §17 addition; (b) accept only from specified countries; (c) UK only | ★ (a) with the §17 addition, recognising that foreign mandatory law may add obligations (not reviewed here); avoid actively targeting a country without checking its rules | Rome I Art 6; foreign law UNVERIFIED |
| **O-A13** | Technical/engineering services for consumers | (a) not offered to consumers until `GS-X002` closes; (b) offered within the strict boundary | ★ (a); in any case remove "engineering" and the certification/sign-off possibility from §2 and §9 | CRA s. 50; DMCCA s. 226 |
| **O-A14** | Complaint handling; ADR | (a) no ADR scheme; (b) join an accredited scheme | ★ (a) is lawful today; keep a written complaints policy and answer promptly | PSR reg. 12; DMCCA s. 308 |
| **O-A15** | Gridsmith's own termination and suspension rights, and the long-delay period | Owner sets the notice and delay periods | ★ Add a reciprocal clause (§5 "Missing") | Sch. 2 paras 4, 7, 8, 18 |
| **O-A16** | What the consumer receives when a project ends early | (a) completed paid work with rights; (b) a licence only | ★ (a) | CRA s. 62; Sch. 2 para. 4 |
| **O-A17** | In-flight consumer engagements at cutover | (a) continue on existing terms; (b) re-paper by express agreement | ★ (a), with each new quotation naming the terms version | CRA s. 50(4); Sch. 2 para. 10 |

---

## 10. Notes for other workstreams

- **Agent C (privacy):** DUAA commencement re-verified (SI 2026/82 regs 2–3). The consumer terms
  should keep §16 as a cross-reference only. Early-start records and acceptance emails are personal
  data, so retention must be covered.
- **IP workstream:** CDPA ss. 90–91 formalities for consumer assignments, moral rights in
  ghostwriting, and subcontractor-created IP. §10.2 and §12 ("to the extent Gridsmith owns rights")
  depend on these.
- **MSA reviewer:** MSA §9.4 grants automatic portfolio rights. The brief's owner policy forbids
  this. This is outside the consumer terms (which have no portfolio clause, correctly), but noted
  here because it was found while reading.
- **Website copy:** under CRA s. 50 and DMCCA s. 226, every service description is potential
  contract content. Website and quotation claims must not exceed what the terms deliver
  (Technical especially).
