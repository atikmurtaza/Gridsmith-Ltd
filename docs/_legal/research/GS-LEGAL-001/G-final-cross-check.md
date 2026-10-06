# GS-LEGAL-001 — Agent G: final independent cross-check

**Date and retrieval date for every source:** 6 October 2026. **Worktree:**
`C:\Users\atikm\.codex\worktrees\gs-host-004\Gridsmith Ltd` (uncommitted GS-LEGAL-001 working tree on
parent `f2b7539d`). **Subject:** the redrafted set: `CONSUMER-TERMS.md` 3.0, `MSA-BUSINESS.md` 3.0
("Client Terms for Business Clients"), `WEBSITE-TERMS.md` 2.1, `PRIVACY-POLICY.md` 2.1,
`COOKIE-POLICY.md` 2.1 and `ACCESSIBILITY-STATEMENT.md` 2.1. It also covers the `/legal/client-terms`
disambiguation text in `scripts/seed-legal.mjs`, the `GS-O003-R` register, `scripts/legal-adoption-rules.mjs`
and `GS-LEGAL-001-RECORD.md` §§4–7.

This is a research note. It is not legal advice and nobody has reviewed it as a solicitor would. It does
not say any document is compliant, approved or enforceable. Agent G did not draft the documents. This
note proposes minimal fixes and does not rewrite any document.

---

## 0. Method, and what could and could not be verified

**Primary law.** Each item below was fetched directly from legislation.gov.uk as `/data.xml` with
`curl`, which returns the "latest available" revised text. I read the operative words and the
version-date and prospective markers.

| Instrument | Provisions read at source | Notes |
|---|---|---|
| CCR 2013 (SI 2013/3134) | regs 5 (definitions), 13, 14, 16, 29, 30, 31, 32, 34, 35, 36, 38; Sch 2 (f)–(s); Sch 3 Part B (the model form is an image on legislation.gov.uk, `uksi_20133134_en_sld_003`, and I read it) | Version valid from 1 Jan 2026. I fetched reg 28, but the XML parsed to metadata only, so **reg 28 is UNVERIFIED** in this note |
| CRA 2015 | ss 2, 50, 56, 57 (read in full); ss 55, 62, 64, 68, 69 and Sch 2 (fetched, not re-read line by line; I rely on Agent A's reading) | Version 30 Sep 2026 |
| DMCCA 2024 | s 230 (read); s 254 (read; marked **prospective**) | s 230's commencement (6 Apr 2025, SI 2025/272) is taken from Agent A and **not re-read** |
| CJJA 1982 | s 15B | Read |
| Rome I (assimilated) | Art 6 | Read |
| UCTA 1977 | s 11 (read); ss 2, 3 (fetched only) | — |
| Late Payment of Commercial Debts (Interest) Act 1998 | ss 4, 5A, 6 | Read |
| SI 2002/1675 | art 4 (rate) | Read. The URL redirects to the "made" version; no amendment was observed |
| CDPA 1988 | ss 87, 90, 91 | Read |
| Insolvency Act 1986 | s 233B | Read; version 1 Oct 2026 |
| UK GDPR | Art 13 (read in part, incl. (1)(f) and (2)(a)–(f)); Art 28 (read in full) | — |
| DPA 2018 | s 164A | Read |
| DUAA 2025 | s 118 | Read |
| SI 2026/1015 | reg 2 | Read: ss 117(4)(a), 118 and 119 in force 30 Sep 2026 |
| PECR 2003 | reg 6; Sch A1 paras 4–5 | Read |
| FSMA 2000 (Regulated Activities) Order 2001 | arts 60B, 60C, 60F, 60L (read); FSMA s 26A (read) | Art 60F version 15 Jul 2026, which includes SI 2025/859 |

**Not re-verified by me, and relied on only as other agents recorded it.** These are marked UNVERIFIED
where used:

- CMA37 (updated 22 Jul 2026) and CMA209 (Agent A);
- the GOV.UK news item of 9 Aug 2026 announcing the January 2027 start of the subscription regime (A);
- ICO cookie guidance (finalised 29 Apr 2026) and ICO complaints guidance (C);
- E-Commerce Regs 2002 and Provision of Services Regs 2009 (A, D);
- UK GDPR Arts 21 and 45A–46, DPA 2018 Sch 21 para 5, and SI 2023/1028 (C);
- CDM 2015 and Building Regs 2010 (B);
- FSMA ss 19, 23 and 26, the consequences for an unauthorised lender (not fetched);
- the Consumer Credit (Total Charge for Credit) Regulations (not fetched);
- all case law.

**Code facts** were read from source:

- `lib/consent/state.ts`, `components/consent/*`;
- `lib/leads/edge-worker.ts`, `supabase/functions/*`;
- `components/leads/ContactForm.tsx` (diff), `components/divisions/press/PressHome.tsx` (diff);
- `lib/services/catalogue.ts`;
- `scripts/seed-legal.mjs`. I ran its parser through `node` and confirmed that the backslash hard breaks
  render as separate lines in §21 and §22.

I ran `node scripts/check-legal-adoption.mjs` read-only. It passes, and all seven entries are at
`RESEARCHED`. That gate checks positions and markers. It does not check legal soundness, and the gate
says so itself.

**Files touched:** this file only. Nothing was committed, pushed or deployed, and no external system was
touched.

---

## 1. Summary

- **Defects: 1 High, 8 Medium, 17 Low** (table in §2). Owner-only items are listed separately in §4 and
  in Record §7.
- The redraft fixes most of what A–F raised. Specifically:
  - the consumer cancellation mechanism, the model form, refund timing, means and fee;
  - the consumer's right to end the contract;
  - Gridsmith's own termination right with a refund;
  - portfolio use by consent only;
  - the `GS-X002` boundary in both instruments;
  - the binding Art 28 schedule;
  - neutral VAT wording;
  - privacy recipients and the regulator's name.
- One load-bearing consumer-law gap remains. It is the **High** finding below: the acceptance step does
  not obtain the CCR reg 14(3) acknowledgement of the obligation to pay.
- Two consumer structures are not safe as drafted:
  - **instalments**, which raise a consumer-credit question;
  - **printed copies**, where goods turn the whole contract into a "sales contract".
- **Not found anywhere in the six drafts:**
  - any claim of solicitor approval or certification;
  - "legally guaranteed", "fully compliant" or "enforceable in every circumstance";
  - any AI-draft disclaimer;
  - any VAT status or number;
  - any automatic portfolio or publicity right.

---

## 2. Defects table

Severity: **H** high, **M** medium, **L** low. All URLs were retrieved on 6 Oct 2026. Quotes are 15
words or fewer.

| ID | Document / clause | Quote | Problem | Authority (URL) | Sev. | Proposed minimal fix |
|---|---|---|---|---|---|---|
| **G-01** | Consumer §3 (acceptance) and §6.1 | "You accept a quotation by confirming in writing that you accept it" | Every consumer contract is concluded "by email or electronic signature" (§6.1). Reg 14 applies to any distance contract "concluded by electronic means". **Unlike E-Commerce regs 9(4) and 11(3), it has no email carve-out.** Reg 14(3) requires the consumer, when placing the order, to explicitly acknowledge "that the order implies an obligation to pay". Reg 14(4) adds button wording. Reg 14(5) says that if the trader has not complied, "the consumer is not bound by the contract or order". The acceptance model obtains no such acknowledgement. Record D-10 assumes reg 14 bites only on a portal or payment link. That reading is not supported by the text. Agent A raised this as O-A11 with a "use the wording either way" recommendation, and it was not carried into the draft. Whether a plain email exchange is "concluded by electronic means" is unsettled (medium confidence). The cure costs one sentence, while the downside is a consumer who is not bound. | CCR reg 14(1)–(5): https://www.legislation.gov.uk/uksi/2013/3134/regulation/14 | **H** | In §3, require the acceptance to include an express acknowledgement, e.g. *"I accept this quotation and understand that accepting it means I must pay the total price."* Any e-signature or portal button must read "Accept and agree to pay" or "order with obligation to pay". Put the reg 14(2) items (characteristics, total price, extra costs, duration) directly above the acceptance line in every quotation template. Correct Record D-10 to match. |
| **G-02** | Consumer §6.1, §6.4, §6.6 (goods) | "If your contract includes printed copies or other goods, the 14 days instead end" | A contract with "both goods and services" is a **sales contract** (reg 5), so the whole period runs from delivery of the last goods (reg 30(3)–(4)). This causes three problems. (1) The "Standard start" option, which starts work "after the 14 days end", cannot work: printing comes after the work, so the period cannot end before the work starts. Every goods-inclusive contract is therefore forced into an early start. (2) The loss-of-right rule in reg 36(2), which §6.6 relies on, applies to "a service contract", which reg 5 defines as "other than a sales contract". A consumer could therefore cancel after receiving the books, paying the reg 36(4) proportion for the services. (3) Whether reg 28(1)(b) (personalised goods) helps is UNVERIFIED here. | CCR regs 5, 30(3)–(4), 36(1)–(2): https://www.legislation.gov.uk/uksi/2013/3134/regulation/5 · /30 · /36 | **M** | Owner decision D-11 (A's O-A3). Preferred: printed copies are bought by the consumer directly from the printer, or under a **separate** contract made after the services are complete, so §6 stays a service contract. If not, add a goods-specific clause: early start is necessary, the cancellation period runs to delivery, and returns follow reg 35. Delete the goods sentence if goods are never supplied. |
| **G-03** | Consumer §4 ("instalments"); Business §5 ("instalments") | "payments at stages, instalments or another schedule we agree with you" | Payment due **after** the related work has been supplied is deferred payment, i.e. "financial accommodation", which is credit. An individual, or a partnership of 2–3 persons, receiving credit from the supplier is party to a "credit agreement" (RAO art 60B(3)). If it is not exempt, it is a **regulated credit agreement**. **The exemption that fits is art 60F(2).** All of the following must be met: (a) a borrower-lender-supplier agreement for fixed-sum credit (Gridsmith is lender and supplier); (b) **no more than twelve** payments; (c) all made **within 12 months or less, beginning on the date of the agreement**; (d) credit "provided without interest or other charges"; (e) neither art 60F(7) nor (7A) applies. Para (7) covers land purchase, conditional sale, hire purchase and pledges. Para (7A)(a) covers lender ≠ supplier. Neither applies to Gridsmith. "Payment" means a payment of capital, or of interest or charges forming part of the total charge for credit (art 60F(8)). **Business clients:** art 60C(3) exempts business-purpose credit only if it **exceeds £25,000**. Smaller deferred payments from sole traders or small partnerships fall back on art 60F(2) too. The drafts impose no such limit. Long Press projects, where a balance is payable more than 12 months after the contract after work has been supplied, can fall outside the exemption. Consequences for an unauthorised lender (FSMA ss 19, 23, 26): **UNVERIFIED** (not fetched). Whether a short invoice window after each stage is "credit" at all is also **UNVERIFIED**. | RAO arts 60B, 60C(3), 60F(2), (7), (7A), (8): https://www.legislation.gov.uk/uksi/2001/544/article/60F · /60C · /60B | **M** | Add one constraint to both instruments, e.g. *"Where any payment falls due after the work it pays for has been supplied, there will be no more than twelve such payments, all due within 12 months of the date of the contract, and we charge no interest or fee for paying that way."* Alternatively, keep every payment at or before the work it pays for. Never add a late-payment fee or interest to consumer instalments without advice. |
| **G-04** | Consumer §11; Record §4 row 16 and D-12 | "agreed in writing for a fixed period … does not renew automatically" | s 254(2) also catches a **continuing supply "for a fixed period"** where the consumer automatically incurs "recurring liabilities for the continuing supply" and has "a right … to bring the contract to an end". Consumer §7 gives exactly that right. A fixed-term, non-renewing maintenance plan paid monthly is therefore within s 254(2) on its face. Avoiding auto-renewal does not take it out. s 255 (exclusions) is not read here. s 254 is **prospective** (not in force at 6 Oct 2026; January 2027 announced per A, **UNVERIFIED** by me). Record row 16 also lists "Bus 14", but Chapter 2 applies only to trader–consumer contracts (s 254(1)). | DMCCA s 254(1)–(4): https://www.legislation.gov.uk/ukpga/2024/13/section/254 | **M** (prospective) | Before commencement, have consumer maintenance paid as a single up-front sum, which removes the "recurring liabilities" element, or review it against Chapter 2 before offering it. Correct Record row 16 and D-12. |
| **G-05** | Consumer §8 (last paragraph) vs §8 paras 2–3 | "If we end a project and you were not seriously in breach" | The dormancy route (60 + 14 days) and the "repeatedly break" route both say §7 applies: the consumer pays the stage in progress, including work not delivered, plus approved third-party costs. The last paragraph says that where Gridsmith ends and the consumer was "not seriously in breach", **everything paid for work not delivered** is refunded. Silence is not a serious breach, and a repeated minor breach may not be either, so both outcomes apply to the same facts. s 69 will give the consumer the more favourable one. | CRA ss 68–69: https://www.legislation.gov.uk/ukpga/2015/15/section/69 | **M** | Confine the last paragraph to "for any other reason" (the own-reason limb only). Alternatively, state that the dormancy and breach routes are governed by §7 "notwithstanding the last paragraph". |
| **G-06** | Consumer §13; Business §9.3 | "On request, we will send you a short written confirmation of the transfer" | An assignment of copyright "is not effective unless it is in writing signed by or on behalf of the assignor" (s 90(3)). If Gridsmith never signs the Scope or quotation, and the client accepts only by email, legal title does not pass until the confirmation is signed. That happens only "on request". s 91(1) vesting of future copyright needs a signed agreement **and** an assignee entitled "as against all other persons". A payment-conditional transfer is doubtful on that limb (B's analysis). The client would hold equitable title only, and most would never think to ask. | CDPA ss 90(3), 91(1): https://www.legislation.gov.uk/ukpga/1988/48/section/90 · /91 | **M** | Change "On request" to "When you have paid in full, we will send you … signed on behalf of Gridsmith Ltd". Alternatively, have a director sign (including e-sign or a typed name with intent) every quotation or Scope that contains the transfer. |
| **G-07** | Business §6.1 | "If the client cancels before we have started work, we refund all payments" | "Started work" is still undefined (F F-03). Quoting, scoping or calls could be argued to be "work", which defeats the owner's refund intent ("no substantive work"). The consumer terms avoid this through the standard-start rule. The business terms do not. | Contract drafting; owner intent (brief) | **M** | Add: *"Work starts on the start date in the Scope or, if none, when we tell the client in writing that it has begun; discussing, quoting and preparing the Scope are not work."* |
| **G-08** | Privacy §8 | "We do not currently delete general enquiries automatically" | Art 13(2)(a) requires "the period for which the personal data will be stored, **or if that is not possible**, the criteria". A period is possible for enquiries. No deletion routine exists, and 63 production leads are held (C F16–F17). As drafted, this is accurate but sits on the weaker limb. | UK GDPR Art 13(2)(a): https://www.legislation.gov.uk/eur/2016/679/article/13 | **M** (owner, D-7) | Owner sets periods and a routine, e.g. non-converted enquiries for a stated number of months with a manual purge of `leads`, which cascades to the outbox, and the mailbox. Until then, keep the criteria and add an `[OWNER DECISION]` marker so the gate holds the document. |
| **G-09** | Business §3, §13; Consumer §9, §10 | "The client confirms that it has the right to let us use" | Neither instrument allocates responsibility for **content risk in Press work**. Specifically: defamation and privacy of named third parties (memoir), the client's responsibility for publication decisions, the absence of legal review, and Gridsmith's right to decline or stop unlawful content (E G18; B §13). This is not on the owner decision list (Record §7), so it is missed rather than deferred. The consumer §8 "unlawful" limb covers only requests to do something unlawful. | CRA Sch 2 (consumer indemnities, per E R19 and A, **UNVERIFIED** here) | **M** | Add a short owner-approved clause. B2B: client warranty plus an optional narrow indemnity. Consumer: a content-responsibility statement and a right to decline or pause, **no indemnity**. Add to Record §7. |
| G-10 | Business §5 | "base rate fixed on the preceding 30 June or 31 December" | The Order uses the official dealing rate "**in force on**" 30 June or 31 December "immediately before the day on which statutory interest starts to run". "Fixed on" misdescribes it. "Carries" is also unconditional, but the Act applies only between businesses (s 2) and may not apply to some foreign contracts (s 12, per B). | SI 2002/1675 art 4: https://www.legislation.gov.uk/uksi/2002/1675/article/4/made ; LPA s 5A | L | Replace with *"the Bank of England base rate in force on the 30 June or 31 December before interest starts to run"*. Change "carries" to "may carry … where the Act applies". |
| G-11 | Consumer §15 | "within 14 days of the day we agree that you are entitled" | s 56(4) says "within 14 days **beginning with** the day" the trader agrees. "Of" could be read one day later. The same-means and no-fee rules (s 56(5)–(6)) are omitted, although §6.3 states them for cancellation. | CRA s 56(4)–(6): https://www.legislation.gov.uk/ukpga/2015/15/section/56 | L | Use "within 14 days, beginning with the day we agree …, using the payment method you used and without any fee". |
| G-12 | Privacy §6 (Resend) | "the studio you chose. It does not contain your message or your other answers" | The notification also carries the enquiry type, the **service page the visitor came from** (`service_slug`) and a record reference (`lib/leads/edge-worker.ts`). | Art 13(1)(e) (accuracy) | L | "…and the studio and service you asked about, the type of enquiry and our reference…". |
| G-13 | Privacy §2 | "Our enquiry forms do not store your IP address or browser details." | True of the application tables. Supabase's own gateway and Edge Function logs are provider-side and their contents and retention are unknown (C F13). The sentence can be read as covering everything. | Art 13 transparency; C F13 | L | "Our enquiry database does not store…; our providers may keep technical request logs, as described in section 6." |
| G-14 | Business §12 | "we will work to that professional's instructions where the Scope says so" | This sits uneasily with the next paragraph ("We do not accept work consisting of drawings … for construction work"). Drafting to an engineer's instructions for a structure is the very case that may make Gridsmith a CDM/Building Regulations "designer" (B §12). The consumer version has no such sentence, so the two instruments differ. | CDM 2015 reg 2 (B; **UNVERIFIED** here) | L | Limit to "for work outside construction, a structure or building work", or delete pending D-4/`GS-X002`. Separately, the gated catalogue name "Engineering drawings" (`lib/services/catalogue.ts:77`) must be reconciled with "We do not provide engineering design" before Technical is published (CRA s 50; DMCCA s 226 per A). |
| G-15 | Business §21 (survival) | "Clauses 6, 9, 10, 11, 16, 21, 22 and 23 continue" | The list omits §5 (payment and late payment), §7's last paragraph (sums due; return or deletion of materials), §12 (no use of draft drawings) and §14 (accounts handover). | Drafting | L | Add 5, 7, 12 and 14, or say "and any other clause intended to continue". |
| G-16 | Business §23 with §11 and §16 | "the Scope records the subject matter, duration, nature and purpose" | Art 28(3) particulars live only in the Scope. A Scope that does not foresee processing leaves them unstated. Nothing says what happens if the client objects to a new sub-processor (Art 28(2)). §16's cap applies to the Art 28(4) "remain fully liable" flow-down, and how that reading interacts with the cap is **UNVERIFIED**. Item 4 says "equivalent" where Art 28(4) says "the same data protection obligations". | UK GDPR Art 28(2)–(4): https://www.legislation.gov.uk/eur/2016/679/article/28 | L | Add: particulars agreed in writing before processing starts if the Scope is silent. On objection, either party may end the affected services without charge. Use "the same data protection obligations". |
| G-17 | Website §6 vs Press form and Privacy §2 | "Please do not send confidential, highly sensitive or special-category personal information" | The Press enquiry flow invites a link to an unpublished manuscript, which is confidential by nature. Privacy §2 asks only that sensitive information be withheld "unless it is needed". The two instructions differ. | Consistency; Art 13 | L | Change the website to "…highly sensitive or special-category information…" (drop "confidential"), or carve out "a link to material we ask for". |
| G-18 | `/legal/client-terms` 1.2 (seed) | "That is most individual authors and almost all memoir and legacy clients" | Consumer status is a question of fact for each individual, and the trader bears the burden of proof (s 2(3)–(4)). A statistical generalisation on a legal page can mislead a commercially publishing author either way (F C-19). | CRA s 2(3)–(4): https://www.legislation.gov.uk/ukpga/2015/15/section/2 | L | Replace with *"For example, an author writing a family memoir is usually a consumer; an author running a publishing business usually is not."* |
| G-19 | Consumer §9; Business §3 | "the timetable moves by at least the length of the delay" | "At least" leaves the further extension open-ended and at Gridsmith's discretion. That is a transparency point for consumers (s 68). It is fine for business clients. | CRA s 68 | L | Consumer: "…by the length of the delay plus any reasonable restart time we tell you about in writing". |
| G-20 | Consumer header and §21 | "WhatsApp or text: +44 7405 448534" | The number is published but is declared not to be a voice channel. CCR Sch 2(c) ("telephone number … where available") and PSR reg 7(2)(b) (per D P2, **UNVERIFIED** here) | CCR Sch 2(c) | L (owner D-16) | Owner decision: accept calls or voicemail on the published number, or accept the risk. |
| G-21 | Business §7 | "repeatedly fails to provide information, access, approvals or payments" | There is no notice or cure step (F B-06). Pre-insolvency termination entitlements cannot be exercised during an insolvency period (s 233B(4)). Only the insolvency limb carries "to the extent the law allows". | IA 1986 s 233B(4): https://www.legislation.gov.uk/ukpga/1986/45/section/233B | L | Add "after written notice and a reasonable period to remedy", and apply "to the extent the law allows" to the whole clause. |
| G-22 | Consumer §3; Business §1–2 | (absent) | No quotation validity period (E G2). A quotation could be accepted months later at a stale price and capacity. | Commercial (E) | L (owner) | Each quotation states its validity. Add D-26 to Record §7. |
| G-23 | Business (no goods clause) | (absent) | If printed copies or proofs are supplied to business clients, UCTA s 7 applies. Title terms cannot be excluded, and the quality exclusions need to be reasonable (B OC-13). This is neither drafted nor on the owner list. | UCTA s 7 (B; not re-read) | L | Owner confirms whether goods are ever supplied. If so, add a short goods clause. |
| G-24 | Cookie §1 | "our web server does not set any cookies" | Verified on the **staging** host only (C F3). The production Hostinger/hCDN configuration (bot protection, challenge pages) is not yet tested (C D5). This is not on the Record §7 owner list. | Accuracy | L | Add a cutover action: `curl -I` and a browser check on gridsmith.uk before this document is marked `PUBLISHABLE`. |
| G-25 | Record §4 and §6 | — | Four errors. (1) Row 31 (Art 28) is marked "Medium (not re-fetched)". It is now read at source: upgrade to High. (2) Row 16 lists "Bus 14" (see G-04). (3) §6 omits these contractual defaults: Cons 7, 8, 18 and 20 refunds "within 14 days" (not statutory after the 14-day period), Bus 6.2 refund "within 14 days", and the Bus 2 default invoicing schedule. (4) D-10 misstates reg 14 (G-01). | — | L | Correct the Record (not a document under adoption). |
| G-26 | Consumer §20 | "you also keep any protection given to you by the mandatory consumer laws" | This is wider than Rome I Art 6, which applies only where Gridsmith pursues or directs activities to the consumer's country, and not to services supplied exclusively outside it (Art 6(4)(a)). Wider is consumer-favourable and becomes a term (s 50). It is a deliberate generosity rather than an error. | Rome I Art 6(1)–(4): https://www.legislation.gov.uk/eur/2008/593/article/6 | L | Keep it if intended (D-5). Otherwise add "where that law applies to your contract". |

**Counted:** H = 1 (G-01). M = 8 (G-02 to G-09). L = 17 (G-10 to G-26).

### Verified correct (no change needed)

Each of these was checked against the primary text read today:

- **Consumer §6.1.** "The 14 days end 14 days after the day your contract is made" matches reg 30(2) ("end of 14 days after the day on which the contract is entered into").
- **Consumer §6.2.** It is enough to send in time (reg 32(5)), and any clear statement will do (reg 32(3)).
- **Consumer §6.3.**
  - Refund within 14 days of being told (reg 34(6)), by the same means (reg 34(7)), with no fee (reg 34(8)).
  - Goods are returned within 14 days (reg 35(4)), and Gridsmith bears the return cost by agreement (reg 35(5)(a)).
  - Ancillary contracts end (reg 38).
- **Consumer §6.4.** The three statements meet reg 36(1)(a), Sch 2(n) and reg 36(2)(b). The request is "in writing", which is a durable medium for off-premises contracts (reg 36(1)(b); "durable medium" includes email, reg 5).
- **Consumer §6.5.**
  - The charge runs up to when Gridsmith is told (reg 36(4)(a)), in proportion to what has been supplied, measured against the total price (reg 36(4)(b), 36(5)(a)).
  - Nothing is owed where the (l)/(n) information or the request is missing (reg 36(6)). The draft's version is more generous than the statute.
- **Consumer §22.** It follows Sch 3 Part B: trader name, geographic address and email; the service/goods and ordered/received alternatives; signature only on paper. "Sent" replaces the model's "notified", which is harmless.
- **Consumer §15.** Repeat performance, then a price reduction that can be the full price (s 56(1)–(3)). The only exception is the G-11 wording.
- **Consumer §17.** Consistent with s 57 (exclusion barred; restriction barred where it prevents recovery of the price).
- **Consumer §20.** Matches CJJA s 15B(2)–(3): the consumer may sue at home, and the trader may sue only in the consumer's part of the UK. There is no exclusive-jurisdiction clause.
- **`/legal/client-terms` 1.2.** Now matches s 57(1)–(3).
- **Business §5.** £40/£70/£100 and reasonable recovery costs above the fixed sum match LPA s 5A(2)–(2A).
- **Business §5 and §7.** The insolvency qualifiers are consistent with s 233B(3) and (7).
- **Business §23.** Covers Art 28(3)(a)–(h) and the paragraph after (h): item 1 = (a), 2 = (b), 3 = (c), 4 = (d) with 28(2) and (4), 5 = (e), 6 = (f), 8 = (g), 9 = (h), 10 = the immediate-notice duty. Item 7 adds Art 33(2) breach notice.
- **Privacy §13.**
  - Acknowledgement within 30 days, progress updates, outcome without undue delay, and a postal route match DPA s 164A(2)–(5).
  - The "Information Commission" naming matches DUAA s 118 and SI 2026/1015 reg 2 (in force 30 Sep 2026).
  - Art 13(2)(ca) and (d) are satisfied.
- **Cookie §2.** The exemption matches PECR reg 6(1) ("Subject to Schedule A1") and Sch A1 para 4(1), (2)(e)(ii) ("maintaining a record of selections made on a website"). The cookie facts match `lib/consent/state.ts`: value `1`, `Max-Age` 365 days, written only on "Got it" (`ConsentBanner.tsx`), footer "Cookie notice" (`ConsentReopen.tsx`). No other `document.cookie`, `localStorage`, `sessionStorage` or `indexedDB` use was found in `app/`, `components/` or `lib/`.

---

## 3. Coverage of A–F findings

**Key:**

- **(a) fixed** — the redraft resolves it;
- **(b) owner** — deliberately left to an owner decision, with a Record §7 D-number;
- **(c) missed** — neither fixed nor recorded as an owner decision;
- **(a/c)** — partly fixed; see the G defect named in the row.

### Agent A (consumer)

| Finding | Status | Where / note |
|---|---|---|
| Key 1 (cancellation inoperable; form; refund; reg 31/36(6)) | (a) | Cons 3, 6, 22 |
| Key 2 (exit "if we agree") | (a) | Cons 7 |
| Key 3 (no Gridsmith termination or suspension) | (a/c) | Cons 8; internal conflict **G-05** |
| Key 4 (Technical vs `GS-X002`) | (a) | Cons 2, 12 |
| Key 5 / O-A1 (VAT) | (a)+(b) | Neutral wording; D-1 |
| Key 6 / O-A5 (subscriptions) | (a/c) | Cons 11; reasoning wrong for fixed-term plans, **G-04** |
| Key 7 / O-A2 (off-premises) | (a) | Email/e-sign channel rule (Cons 6.1); written request |
| Key 8 / O-A12 (foreign consumers) | (a)+(b) | Cons 20; D-5 |
| O-A3 (goods) | (b) but incoherent text | D-11; **G-02** |
| O-A4 (ready-made digital products) | not needed | None offered; no reg 37 flow needed until they are |
| O-A6, O-A7 (early start; stage table) | (a)+(b) | Cons 6.4–6.5; D-9 |
| O-A8, O-A9, O-A10 (charges; third-party costs; deposits) | (a) | Cons 4, 7 |
| **O-A11 (acceptance wording / reg 14)** | **(c)** | **G-01** |
| O-A13, O-A14, O-A15, O-A16, O-A17 | (a)/(b) | Cons 12, 16, 8, 7, 3; D-4, D-19, D-23 |
| §5 table: header phone, §3 confirmation, §4 reg 40, §9 review condition, §12 IP default, §15 FM exit | (a) | — |

### Agent B (business)

| Finding | Status | Where / note |
|---|---|---|
| 1 Portfolio | (a) | Bus 9.4 |
| 2 / OC-1 Technical | (a)+(b) | Bus 12; D-4; tension **G-14** |
| 3 / OC-2 cap and self-referential saver | (a)+(b) | Saver deleted; D-2 |
| 4 Insolvency | (a) | Bus 5, 7 (residual **G-21**) |
| 5 IP chain; interim licence; drafts; moral rights; AI | (a/c) | Bus 9; **G-06** |
| 6 Art 28 | (a) | Bus 11, 23 (residual **G-16**) |
| 7 Boilerplate | (a/c) | Bus 1, 21; survival list **G-15** |
| 8 Late payment | (a) | Bus 5; wording **G-10** |
| 9 / OC-9 VAT | (a)+(b) | D-1 |
| OC-3, OC-4, OC-6, OC-7, OC-14 (numbers; convenience exit) | (b) | §5 below; D-13, D-19 |
| OC-5 (deposits) | (a) | Bus 6 |
| OC-8 (indemnities) | **(c)** | Not drafted and not on the owner list. No Gridsmith indemnity, which matches B's recommendation; the client indemnity is undecided (**G-09**) |
| OC-10, OC-11, OC-12 | (a) | Bus 9.3, 14, 23 |
| OC-13 (goods) | **(c)** | **G-23** |
| OC-15 (foreign forum) | (a)+(b) | Bus 22; D-5 |
| §13 Press content warranty / no legal review | **(c)** | **G-09** |

### Agent C (privacy and cookies)

| Finding | Status | Where / note |
|---|---|---|
| Recipients (Vercel, Hostinger, Sanity, WhatsApp) | (a) | Priv 6; contents nuance **G-12** |
| Transfers (fact and safeguard) | (a)+(b) | Priv 7 marker; D-6 |
| Retention (D2) | (b) | D-7; **G-08** |
| Regulator name, s 164A, marketing objection, ADM, reviews (2A), Press answers, fingerprint, special category | (a) | Priv 2–13 |
| IP-storage statement | (a/c) | **G-13** |
| D1 Hostinger locations and log retention | (b) | Implied by D-6; not separately recorded |
| D3 DPAs; D11 fee | (b) | D-6, D-21 |
| D5 production cookie re-test | **(c)** | **G-24** |
| D6 (365-day justification record) | **(c)** | Not recorded; owner should note the reason |
| D8, D9, D10 (WhatsApp account type; accounting/bank providers; Art 30 record) | **(c)** | Not on Record §7. Internal accountability items; Priv 6 names only "professional advisers" |
| E1 (pin region) | (b) | D-6 |
| E2, E4 (`/contact` privacy link; acknowledgement copy) | (a) | `ContactForm.tsx` diff verified |
| E3 (forms not live before the privacy page) | (b) | Launch sequencing, outside the drafts |
| E5 (CSP `cdn.sanity.io`) | (c) | Code; outside the drafts |
| Cookie wording | (a) | Cookie 1–5 |

### Agent D (disclosures)

| Finding | Status | Where / note |
|---|---|---|
| D2 / P5 legal form and "England and Wales" | (a) in drafts; (b) footer | D-17 |
| D7, D8 business documents; directors | (b) | D-22 |
| D9 (reg 27, 5 working days) | (c) | Not recorded (process item) |
| D10 (registered-office sign) | (c) | Not recorded (process item) |
| E4 ("Companies House") | (c) | Cosmetic |
| E7 / website prices | (a) | Web 5 |
| E9–E11 acceptance method | (b) | D-10; but see **G-01** |
| E10 / P7 storable terms before contract | (a) | Cons 3; Bus 1 |
| P2 telephone | (b) | D-16; **G-20** |
| P13 business complaints | (a) | Bus 19 |
| A1–A3 ADR/ODR | (a) | Nothing added, correctly |
| §6 VAT | (a)+(b) | D-1 |

### Agent E (benchmark)

| Finding | Status | Where / note |
|---|---|---|
| G0 / R1 portfolio; G0a website portfolio/prices | (a) | — |
| G1, G3, G4, G5, G8, G10, G13, G14, G15, G16, G17, G20, G21, G22, G25 | (a) | — |
| **G2 quote validity** | (c) | **G-22** |
| **G6 instalments** | **(c)** | **G-03** |
| G7 retainers | (a/b) | Bus 14 (30 days); consumer D-12, **G-04**. Minimum term and unused hours not covered (Scope-level) |
| G9 cost of assessing change requests | (c) | Low; Scope-level |
| G11 withholding tax / gross-up | (c) | Bus 5 covers bank charges only |
| G12 defect-fix period | (c) | Scope-level; owner |
| **G18 content responsibility** | **(c)** | **G-09** |
| G19 Press no outcome guarantee | (a/c) | Bus 15; Cons 10.3 covers platform acceptance only; no consumer statement on agent/publisher acceptance or sales |
| G23 audiobook terms | (c) | Low until offered |
| G24 file retention | (a/c) | Bus 7 return/delete on request; no period |
| G27 B2B claims time bar | not adopted | Optional; correct not to apply to consumers |

### Agent F (adversarial)

| Finding | Status | Where / note |
|---|---|---|
| F-01, F-02 | (a) | — |
| **F-03 "work started" undefined** | **(a/c)** | Cons fixed through standard start; Bus 6.1 not fixed, **G-07** |
| F-04, F-05, F-06, F-08, F-09 | (a) | — |
| F-07 subcontracting | (a/c) | Cons 2, Bus 21 fixed. Press "tell you who writes" disclosure (OCR) neither drafted nor on the owner list |
| C-01 to C-11, C-13 to C-18, C-20 | (a) | — |
| C-12 s 90(3) | (a/c) | **G-06** |
| C-19 classification | (a/c) | **G-18** |
| C-21 currency and charges | (a/c) | Consumer GBP; no bank-charges statement for consumers (acceptable) |
| B-01 to B-03, B-05, B-07, B-09 to B-15, B-17 | (a) | — |
| B-04 (cap carve-outs) | (b) | D-2 |
| B-06 (notice/cure) | (a/c) | **G-21** |
| B-08 (non-UK interest) | (c) | Not on the owner list (L) |
| B-16 | (b) | D-5 |
| W-01, W-03, D-1 | (a) | — |
| D-2 | (a)+(b) | D-20 |
| P-01, P-05 | (a) | — |
| P-02, P-03 | (b) | D-6, D-7 |
| P-04 (third-party data in manuscripts) | (a/c) | Cons 9 sentence; controller/processor role not stated; overlaps **G-09** |
| R-01 | (b) | D-12; **G-04** |
| S-1 to S-5 | (a) | `Basis` no longer rendered; seed summaries and Press copy rewritten (diff verified) |

---

## 4. Every numeric default in the drafts (owner to confirm)

**Statutory (not choices):**

- consumer cancellation 14 days, refund 14 days and goods return 14 days (CCR regs 30, 34, 35);
- defect refund 14 days (CRA s 56(4));
- data complaint acknowledgement within 30 days (DPA s 164A(3));
- LPA 8% over reference rate and £40/£70/£100 (SI 2002/1675 art 4; LPA s 5A);
- art 60F limits if adopted under G-03: 12 payments, 12 months.

**Site setting:** `gs_consent` 365 days (Cookie §2).

**Drafting defaults (owner choices):**

| Document / clause | Number | What it governs |
|---|---|---|
| Cons 5; Bus 2 | 1 revision round per deliverable | Where the quotation or Scope is silent |
| Bus 2 | Stage invoiced on delivery, or monthly in arrears | Default payment schedule where the Scope is silent *(missing from Record §6)* |
| Cons 7 | 14 days | Refund after ending post-period *(contractual; missing from Record §6)* |
| Cons 8 | 7 days | Notice before pausing for unpaid sums |
| Cons 8 | 60 days, then 14 days | Waiting on the client, then ending |
| Cons 8 | 14 days | Cure period for breach; Gridsmith own-reason notice |
| Cons 8 | 14 days | Refund when Gridsmith ends *(missing from Record §6)* |
| Cons 16; Access 5 | 5 working days | Aim to acknowledge complaints and accessibility requests |
| Cons 18 | 30 days | Delay outside control before the consumer may end |
| Cons 18; Cons 20 | 14 days (18); none stated (20) | Refund after a force-majeure exit; Cons 20's refund on transfer has no stated period |
| Bus 3 | 60 days, then 14 days | Dormant project |
| Bus 5 | 14 days; 7 days | Invoice terms; suspension notice |
| Bus 6.2 | 14 days | Refund of overpayment *(missing from Record §6)* |
| Bus 7 | 14 days; 14 days | Remedy period; convenience notice |
| Bus 8 | 10 working days + 5 working days | Review, then reminder, then accepted for invoicing only |
| Bus 10 | 5 years | Confidentiality after the project |
| Bus 14 | 30 days | Ending support or retainer where the Scope is silent |
| Bus 16 | 12 months | Cap reference period for retainers |
| Bus 18 | 60 days | Force-majeure long-stop |
| Bus 20 | 5pm / 9am / second business day | Deemed receipt |
| Bus 22 | 20 working days | Pre-action negotiation |
| Bus 23 | 14 days | Sub-processor change notice |

I found no invented price, percentage or fixed payment schedule presented as policy. Stage shares are
expressly set per quotation.

---

## 5. Cross-document consistency (checked)

**Cross-references.** Every "section N" and "clause N" in the consumer and business terms resolves to the
right clause and says the right thing. Examples: Cons 2→12, 3→6/7/22, 6.2→21/22, 7→13, 13→11;
Bus 3/5→6, 6.2/7/13/21→9.3, 11→23, 15→16, 16→14, 18→6.2. The privacy cross-references (2A, 15) also
resolve. The gate's `danglingReferences` agrees.

**Agree across the documents:**

- **Payment is not acceptance:** Cons 3; Bus 1.
- **Portfolio use only with express written consent, withdrawable:** Cons 14; Bus 9.4. Website 4 claims
  no client material.
- **IP transfer on full payment, with interim use:** Cons 13; Bus 9.3. G-06 applies to both.
- **`GS-X002` boundary:** Cons 12; Bus 12; Website 3 (no reliance on drawings). G-14 is the one tension.
- **AI disclosure:** Cons 13; Bus 9.3, with identical substance.
- **Refund timing:** 14 days throughout.
- **Document names:** the four documents name each other the same way ("Client Terms for Consumers" /
  "Client Terms for Business Clients"), as does the disambiguation page.

**Separation of consumer and business mechanisms.**

- The consumer terms contain no Late Payment Act, no cap, no exclusive jurisdiction, no deemed
  acceptance and no non-refundable deposit.
- The business terms route consumers out (Bus 1).
- The `instrumentProblems` predicates enforce these points.

**Site facts.**

- Hostinger hosting, CDN and mailbox: MX per C F19.
- Supabase Edge Functions near the sender, storage in Ireland: Priv 6–7, matching C F9–F10.
- One Resend notification to Gridsmith only, with no acknowledgement to the enquirer: `edge-worker.ts`
  has a single `to`; nuance at G-12.
- WhatsApp/text: `wa.me` and `sms:`, no `tel:`.
- Freelancer reviews are staging-only: Priv 2A says "may show". Production use still needs Freelancer
  permission, which is a recorded production blocker.
- No analytics: Priv 5, Cookie 1.

No statement in the drafts lacks support from the code or from an owner-decision marker, apart from
G-12, G-13 and G-24.

---

## 6. Recommended register state per document

The register order is `RESEARCHED` → `VERIFIED` → `OWNER_REVIEW_REQUIRED`. I recommend no move to
`OWNER_ADOPTED` or `PUBLISHABLE`: only the owner can make that move.

| Document | Recommended state now | Why | To advance |
|---|---|---|---|
| Client Terms for Consumers 3.0 | **RESEARCHED** | Substantive defects remain: G-01 (H), G-02, G-03, G-04 (prospective), G-05, G-06 | Fix G-01, G-03, G-05 and G-06 (one sentence each). Resolve G-02 through D-11. Then OWNER_REVIEW_REQUIRED |
| Client Terms for Business Clients 3.0 | **RESEARCHED** | G-03 (sole traders), G-06, G-07, G-09 are drafting gaps; L items G-10, G-14, G-15, G-16, G-21 | Fix those, then OWNER_REVIEW_REQUIRED (D-2, D-4, D-13, D-19 and the others) |
| Website Terms 2.1 | **OWNER_REVIEW_REQUIRED** | Citations and facts check out; one L consistency point (G-17) the owner may accept or have reworded | Owner adopts, with or without G-17 |
| Privacy Policy 2.1 | **RESEARCHED**, close to VERIFIED | Two accuracy points (G-12, G-13; L) need wording. The rest are owner facts (D-6 markers; D-7 retention / G-08) | Fix G-12 and G-13, then OWNER_REVIEW_REQUIRED. The `[OWNER DECISION]` markers must be filled before PUBLISHABLE |
| Cookie Policy 2.1 | **OWNER_REVIEW_REQUIRED** | Law and code match. The production-host re-test (G-24) and the 365-day justification record (C D6) are owner or cutover items | Production `Set-Cookie` re-test before PUBLISHABLE |
| Accessibility Statement 2.1 | **OWNER_REVIEW_REQUIRED** | No defect found; it makes no conformance claim. The only open item is the 5-working-day aim | Owner confirms the number |
| `/legal/client-terms` 2.1 (seed only; not one of the six) | **OWNER_REVIEW_REQUIRED** | The s 57 statement now matches the statute; one L wording point (G-18) | Owner accepts or rewords G-18 |

---

## 7. Re-verification of fixes

**Date:** 6 October 2026. **Method:** I read the current drafts and the seed against §2 of this report.
I did not edit any draft. `check-legal-adoption` still passes, with all entries at `RESEARCHED`.

### Status of each defect

| Defect | Where | Status | Note |
|---|---|---|---|
| G-01 | Cons §3 | **FIXED** | Express "understand … I must pay the total price" acknowledgement. The "Accept and agree to pay" button covers e-signature and online acceptance. Main characteristics, total price, additional costs and duration are repeated directly above the place of acceptance, which covers reg 14(2) (a), (f), (g) and (s). Items (h) and (t) do not apply to fixed one-off projects. |
| G-22 | Cons §3; Bus §2 | **FIXED** | Quotation and Scope validity now listed. |
| G-03 | Cons §4 | **FIXED** | Matches art 60F(2)(b)–(d). Gridsmith is lender and supplier, so (7A) does not apply. See N-1. |
| G-02 | Cons §6.1, §6.3, §22 | **FIXED** | Services only and goods excluded. The goods clock, the return paragraph and the goods variant of the form have been removed. The form keeps the Sch 3 Part B elements for services. See N-3. |
| G-05 | Cons §8 | **FIXED** | The full refund is now confined to the own-reason limb. |
| G-19 | Cons §9 | **FIXED** | — |
| G-09 | Cons §9; Bus §13 | **FIXED** | No consumer indemnity. See N-2. |
| G-04 | Cons §11 | **FIXED** | A single payment before the period starts removes the s 254(2)(b) "recurring liabilities" limb. |
| G-06 | Cons §13; Bus §9.3 | **FIXED** | The signed confirmation is now sent on full payment, not "on request". |
| G-11 | Cons §15 | **FIXED** | "Beginning with the day", plus same means of payment and no fee (s 56(4)–(6)). |
| G-03 | Bus §5 | **FIXED** | Applied to individuals and partnerships. See N-1. |
| G-10 | Bus §5 | **FIXED** | "In force on … before interest starts to run" now matches SI 2002/1675 art 4. "May carry … where that Act applies" is correct. |
| G-07 | Bus §6.1 | **FIXED** | — |
| G-21 | Bus §7 | **FIXED** | "To the extent the law allows" now governs the whole clause, and a 14-day cure has been added for repeated failure. |
| G-16 | Bus §11, §23 | **FIXED** | Particulars are agreed before processing where the Scope is silent. An objection ends the affected services without charge. "The same data protection obligations" now matches Art 28(4). |
| G-14 | Bus §12 | **FIXED** | The professional-instructions sentence is deleted, so the business and consumer terms now agree. The catalogue name "Engineering drawings" remains a `GS-X002` publication point. |
| G-15 | Bus §21 | **FIXED** | Survival now covers clauses 5, 6, 7, 9, 10, 11, 12, 14, 16 and 21–23. |
| G-12 | Privacy §6 | **FIXED** | Matches `notificationEmail()` (studio, service, type, reference). |
| G-13 | Privacy §2 | **FIXED** | — |
| G-08 | Privacy §8 | **FIXED** (marker) | An `[OWNER DECISION]` marker now holds the section until periods and a deletion routine exist. |
| G-17 | Website §6 | **FIXED** | "Confidential" removed. |
| G-18 | Seed `/legal/client-terms` 1.2 | **FIXED** | Now an example-based test, not a statistic. |

### New problems found (all Low; none blocks owner review)

- **N-1. Instalment limit vs default schedules.**
  - Cons §4 and Bus §5 now *promise* no more than twelve post-supply payments, all within 12 months of the contract.
  - Bus §2's default ("monthly in arrears", or each stage invoiced on delivery) can breach that promise on a long engagement with an individual. So can a long Press stage plan for a consumer.
  - **Fix:** a quotation and Scope template rule. For individuals, keep every post-supply payment inside the limit, or take payment before each stage.
  - Separately, Bus §5 should also cover "an unincorporated body" (RAO art 60B(3) "relevant recipient of credit").
  - Whether ordinary payment on an invoice issued at delivery is "credit" at all remains **UNVERIFIED**. The constraint is the conservative course.
- **N-2. Responsibility for content Gridsmith itself writes.**
  - Bus §13 makes the client responsible for the lawfulness of content it "supplies **or approves**". Cons §9 says "you are responsible for that decision".
  - For ghostwritten text that Gridsmith writes, this could be read as shifting liability for Gridsmith's own negligent drafting. Business: UCTA ss 2(2) and 13(1). Consumer: CRA s 57, which would make that reading non-binding, so the issue there is transparency.
  - **Fix:** add *"This does not reduce our responsibility for our own work under clause 15 / section 15."*
- **N-3. Printing still appears in Cons §3.**
  - Cons §3 still lists "printing" among third-party costs. Cons §6.1 says printed copies may be bought "under a separate contract made after our services are complete". If that contract is with Gridsmith, it is a goods contract these terms do not cover, and it would need its own cancellation information.
  - **Fix:** say the separate printing contract is with the printer, or is made on separate terms.

### Updated recommended register states

This assumes the remaining items are owner decisions and the owner accepts or applies N-1 to N-3.

| Document | State | Remaining |
|---|---|---|
| Client Terms for Consumers 3.0 | **OWNER_REVIEW_REQUIRED** | D-numbers and the §4 numeric defaults; N-1, N-2, N-3 wording |
| Client Terms for Business Clients 3.0 | **OWNER_REVIEW_REQUIRED** | D-2 (cap), D-4, D-13 and the numbers; N-1, N-2 wording |
| Website Terms 2.1 | **OWNER_REVIEW_REQUIRED** | Adoption only |
| Privacy Policy 2.1 | **OWNER_REVIEW_REQUIRED** | Three `[OWNER DECISION]` markers (processor terms, transfer safeguard, retention) must be filled before `PUBLISHABLE` |
| Cookie Policy 2.1 | **OWNER_REVIEW_REQUIRED** | Production `Set-Cookie` re-test at cutover (G-24); a record of the reason for 365 days |
| Accessibility Statement 2.1 | **OWNER_REVIEW_REQUIRED** | Confirm the 5-working-day aim |
| `/legal/client-terms` 2.1 (seed) | **OWNER_REVIEW_REQUIRED** | Adoption only |

**Not re-checked in this pass:** the Record corrections listed in G-25 (row 16, row 31, D-10, the §6
omissions) and the remaining Low items that were not on the drafter's fix list (G-20, G-23, G-24,
G-26), which remain owner or cutover items.
