# GS-LEGAL-001 — Evidence-based UK legal review, commercial terms, and `GS-O003-R`

**Date:** 6 October 2026. **Worktree:** `C:\Users\atikm\.codex\worktrees\gs-host-004\Gridsmith Ltd`,
branch `codex/gs-host-004`, parent `f2b7539d`. **Status of this record:** research and owner-decision
record. It is not legal advice, nobody has reviewed it as a solicitor would, and it does not say that
any document is compliant, approved, certified or enforceable in every circumstance.

## 1. The decision this phase implements

`GS-O003` required a solicitor to approve every legal document before publication. The owner decided
not to commission a solicitor at this stage. `GS-O003` is replaced by **`GS-O003-R` — legal evidence +
owner adoption gate**:

| State | Meaning |
|---|---|
| `RESEARCHED` | Drafted, with the research for each clause recorded |
| `VERIFIED` | Citations checked against current sources; site facts and cross-document checks pass |
| `OWNER_REVIEW_REQUIRED` | Only owner decisions remain |
| `OWNER_ADOPTED` | The owner has adopted this exact version (date and version recorded) |
| `PUBLISHABLE` | Adopted and passing `check:legal:adoption`; the only state the production migration admits |

Only the owner sets `OWNER_ADOPTED`, by recording `ownerAdoptedOn` and `ownerAdoptedVersion` in
`docs/_legal/GS-O003-R-REGISTER.json`. No script sets either. A draft edited after adoption no longer
matches the adopted version, and every importer of `scripts/seed-legal.mjs` then throws.

## 2. Method

Six independent review workstreams wrote one report each into this folder, working from the shared
brief (`00-BRIEF.md`). A seventh, **G**, cross-checked the redrafted set and did not draft it.

| ID | Workstream | Report |
|---|---|---|
| A | UK consumer law, consumer client terms, cancellation model | `A-consumer-law.md` |
| B | Business terms, liability, IP, data processing, insolvency, Technical boundary | `B-business-terms.md` |
| C | Privacy, cookies, marketing; factual parity with the code and staging | `C-privacy-cookies.md` |
| D | E-commerce, Companies Act and Provision of Services disclosures; VAT | `D-ecommerce-disclosures.md` |
| E | Competitor/peer commercial benchmark (commercial completeness only, never authority) | `E-competitor-benchmark.md` |
| F | Adversarial client review (consumer, business, overseas personas) | `F-adversarial-review.md` |
| G | Final independent cross-check of the redrafted set | `G-final-cross-check.md` |

Source hierarchy: current primary legislation (legislation.gov.uk, latest available, commencement
checked) → binding instruments → official guidance (CMA, ICO, GOV.UK, Companies House, HMRC) → case
law only where necessary → the Gridsmith citation ledger → owner commercial decisions → competitor
examples (completeness only). Every source below was retrieved on **6 October 2026** unless stated.
Propositions a workstream could not read at source are marked **UNVERIFIED** in its report and are not
relied on here without that label. Competitor wording was not copied.

## 3. The redrafted set

| Document | Before | Now | Main changes |
|---|---|---|---|
| Client Terms for Consumers (`CONSUMER-TERMS.md`) | 2.0 | **3.0** | Contract formed only on written acceptance of an emailed quotation (payment or silence never acceptance; no payment before acceptance); quotation carries total price, third-party costs, stage table, cancellation information, the terms and the form; durable-medium confirmation before work; CCR cancellation rebuilt (period, how, refund in 14 days by the same means with no fee, goods clock, ancillary contracts); standard vs early start with the three statements; proportionate amount from the stage table; no charge where information or request missing; consumer right to end after 14 days paying only stage value + pre-approved unrecoverable supplier costs; Gridsmith pause/end rights with refund reciprocity; no non-refundable deposits; no unagreed extra charges; revision-round definition; GS-X002 boundary; IP transfer default with signed confirmation, interim use, subcontractor chain, background licence, AI disclosure; portfolio only with express written consent; confidentiality; ghostwriting waivers and credit; ISBN/publisher/accounts; domains/hosting/source code to the client; defects route separate from cancellation; force-majeure exit; transfer by Gridsmith with exit; Scottish/NI forum and home-law protection; model cancellation form |
| Client Terms for Business Clients (`MSA-BUSINESS.md`) | 2.0 | **3.0** | Formation and incorporation, battle of forms, precedence, marketplace terms, versioning; defaults where a Scope is silent; client-delay mechanism; disputed-scope rule; payment structures; neutral VAT; disputed invoices; 7-day suspension notice subject to insolvency law; statutory late-payment wording; objective cancellation valuation capped at the Scope price; no non-refundable advance; termination by Gridsmith (insolvency limb qualified for IA 1986 s. 233B; convenience exit with refund and handover); acceptance only for invoicing; irrevocable transferable background licence; assignment with signed confirmation, interim licence, subcontractor chain, moral rights, AI, open source; **portfolio only with express written consent**; non-infringement warranty; confidentiality duration; binding Data Processing Schedule (UK GDPR Art. 28(3)); GS-X002 boundary (no construction drawings); Press credit/waivers/ISBNs/accounts; Digital domains/backups/retainers; warranties incl. reasonable time; cap per Scope or 12 months for retainers, self-referential saver deleted; force-majeure long-stop; complaints (PSR reg. 12); deemed receipt; assignment, subcontracting, entire agreement, variation, e-signature, survival; pre-action negotiation |
| Website Terms (`WEBSITE-TERMS.md`) | 2.0 | **2.1** | Portfolio, indicative-price and client-portfolio wording removed (`GS-D001`/`GS-D002`); "no published prices"; neutral VAT; form wording; consistent document names; postal contact |
| Privacy Policy (`PRIVACY-POLICY.md`) | 2.0 | **2.1** | Hostinger (host, CDN, mailbox) replaces retired Vercel; Supabase Edge Functions + Ireland storage; Resend notification contents stated exactly; Sanity holds no visitor data; WhatsApp/text; Press answers and manuscript links; submission fingerprint; reviews section; purpose→basis table; transfers stated as fact with the safeguard left to the owner; Information Commission; s. 164A complaints with post and progress updates; marketing objection; no solely automated decisions |
| Cookie Policy (`COOKIE-POLICY.md`) | 2.0 | **2.1** | Set only on *Got it*; value `1`; PECR Sch. A1 para. 4 exemption named; no web storage; server sets no cookies; footer control; outbound links |
| Accessibility Statement | 2.0 | **2.1** | Identity header; enquiry forms need JavaScript, with the email alternative |
| `/legal/client-terms` (seed only) | 2.0 | **2.1** | CRA s. 57 overstatement corrected (F D-1) |

All drafts now carry the full identity block (legal form, England and Wales, number, registered
office) in the header, a **Draft date** rather than an effective date, and no public "Basis:" lines.
None contains a solicitor claim, an AI-draft disclaimer, a VAT status or a VAT number.

## 4. Citation matrix (load-bearing propositions)

Type: P = primary legislation, G = official guidance. Retrieved 6 Oct 2026. Report = where it was
read and reasoned.

| # | Proposition | Clause(s) | Authority | URL | Type | Conf. | Report |
|---|---|---|---|---|---|---|---|
| 1 | Consumer = individual wholly or mainly outside trade; trader bears burden | Cons 1 | CRA 2015 s. 2(3)–(4); CCR reg. 4 | legislation.gov.uk/ukpga/2015/15/section/2 | P | High | A-01 |
| 2 | Pre-contract information incl. model cancellation form | Cons 3, 22 | CCR reg. 13(1)(a)–(b), Sch. 2, Sch. 3 Pt B | legislation.gov.uk/uksi/2013/3134/regulation/13 | P | High | A-04 |
| 3 | Pre-contract information becomes a term; changes need express agreement | Cons 3, 4 | CRA s. 50(3)–(4) | legislation.gov.uk/ukpga/2015/15/section/50 | P | High | A-05 |
| 4 | Durable-medium confirmation before performance | Cons 3 | CCR reg. 16 | legislation.gov.uk/uksi/2013/3134/regulation/16 | P | High | A-08, D C2 |
| 5 | 14-day period ends 14 days after the day of contract (services); goods clock | Cons 6.1 | CCR reg. 30(2)–(5) | …/uksi/2013/3134/regulation/30 | P | High | A-09 |
| 6 | Any clear statement; form optional; in time if sent | Cons 6.2 | CCR reg. 32(3), (5) | …/regulation/32 | P | High | A-11 |
| 7 | Refund within 14 days, same means, no fee | Cons 6.3 | CCR reg. 34(1), (4), (6)–(8) | …/regulation/34 | P | High | A-12 |
| 8 | Early start only on express request; proportionate amount on total price; nothing owed if info/request missing; loss of right on full performance with acknowledgement | Cons 6.4–6.6 | CCR reg. 36(1)–(6) | …/regulation/36 | P | High | A-13 |
| 9 | Ancillary contracts end at no cost | Cons 6.3 | CCR reg. 38 | …/regulation/38 | P | Medium | A-15 |
| 10 | No extra payment without prior express consent; no pre-ticked boxes | Cons 4 | CCR reg. 40 | …/regulation/40 | P | High | A-16 |
| 11 | Reasonable care and skill; information binding; remedies; refund within 14 days of agreement | Cons 2, 15 | CRA ss. 49–50, 54–56 | legislation.gov.uk/ukpga/2015/15/part/1/chapter/4 | P | High | A-17, A-18 |
| 12 | Liability that cannot be excluded | Cons 17 | CRA ss. 31, 47, 57, 65 | …/ukpga/2015/15/section/57 | P | High | A-19 |
| 13 | Fairness, transparency, contra proferentem; grey list | Cons 4–8, 18, 20 | CRA ss. 62–64, 68–69, Sch. 2 | …/ukpga/2015/15/part/2 | P | High | A-20 |
| 14 | Prepayments/deposits and cancellation charges | Cons 4, 7; Bus 6 | CMA37 (updated 22 Jul 2026) paras 6.60–6.64 | gov.uk/government/publications/unfair-contract-terms-cma37 | G | High | A-21, B §6 |
| 15 | Invitation to purchase: total price incl. unavoidable charges | Cons 3, 4 | DMCCA 2024 s. 230 (in force 6 Apr 2025) | legislation.gov.uk/ukpga/2024/13/section/230 | P | High | A-23 |
| 16 | Subscription regime not in force (Jan 2027 announced); a fixed-term plan paid in recurring instalments is within s. 254(2) | Cons 11 | DMCCA s. 254 (prospective); GOV.UK news 9 Aug 2026 | …/ukpga/2024/13/section/254 | P/G | High (status) | A-25 |
| 17 | ADR Regs revoked; s. 308 duty only if obliged | Cons 16; Bus 19 | SI 2015/542 revoked 6 Apr 2026; DMCCA s. 308 | …/ukpga/2024/13/section/308 | P | High | A-26, D A1–A2 |
| 18 | Consumer forum (Scotland/NI) | Cons 20 | CJJA 1982 s. 15B | legislation.gov.uk/ukpga/1982/27/section/15B | P | High | A-29 |
| 19 | Home-law protections for targeted foreign consumers | Cons 20 | Rome I (assimilated) Art. 6(2); CRA s. 74 | legislation.gov.uk/eur/2008/593/article/6 | P | High | A-28 |
| 20 | Complaints: respond quickly, best efforts (B2B and B2C) | Cons 16; Bus 19 | PSR 2009 reg. 12 | legislation.gov.uk/uksi/2009/2999/regulation/12 | P | High | D P13 |
| 21 | PI insurance disclosed only where legally required | (none stated) | PSR reg. 8(1)(n) | …/uksi/2009/2999/regulation/8 | P | High | A-27, D P11 |
| 22 | Terms storable and reproducible; email carve-out from regs 9(1)/11 | Cons 3; Bus 1 | E-Commerce Regs 2002 regs 9(3)–(4), 11(3) | legislation.gov.uk/uksi/2002/2013/regulation/9 | P | High | A-07, D E9–E11 |
| 23 | Website trading disclosures | Footer; headers | SI 2015/17 regs 24–25; E-Commerce reg. 6 | legislation.gov.uk/uksi/2015/17/regulation/25 | P | High | D D1–D4 |
| 24 | Reasonableness of B2B exclusions; burden on Gridsmith | Bus 15–16 | UCTA 1977 ss. 2, 3, 11(1), (4)–(5) | legislation.gov.uk/ukpga/1977/50/section/11 | P | High (law) | B §1, §3 |
| 25 | Statutory late-payment interest and compensation | Bus 5 | Late Payment of Commercial Debts (Interest) Act 1998 ss. 1, 5A; SI 2002/1675 | legislation.gov.uk/ukpga/1998/20 | P | High (structure) | B §5 |
| 26 | Insolvency termination clauses ineffective | Bus 7 | Insolvency Act 1986 s. 233B | legislation.gov.uk/ukpga/1986/45/section/233B | P | High | B §1(4) |
| 27 | Copyright assignment needs signed writing; future copyright | Cons 13; Bus 9.3 | CDPA 1988 ss. 90(3), 91 | legislation.gov.uk/ukpga/1988/48/section/90 | P | Medium-high | B, F C-12 |
| 28 | Moral rights waiver by signed instrument | Cons 10.2; Bus 9.3, 13 | CDPA ss. 77, 78, 80, 87 | legislation.gov.uk/ukpga/1988/48/section/87 | P | Medium-high | F C-10 |
| 29 | Computer-generated works / AI uncertainty | Cons 13; Bus 9.3 | CDPA ss. 9(3), 178 | legislation.gov.uk/ukpga/1988/48/section/9 | P | Medium | B OC-11 |
| 30 | Statutory designer duties cannot be contracted out | Cons 12; Bus 12 | CDM 2015 reg. 2; Building Regs 2010 reg. 2, 11F | legislation.gov.uk/uksi/2015/51/regulation/2 | P | High | B §1(2) |
| 31 | Processor contract terms | Bus 11, 23 | UK GDPR Art. 28(3)(a)–(h) | legislation.gov.uk/eur/2016/679/article/28 | P | High (read at source by G) | B §11, C L15, G |
| 32 | Privacy information incl. complaint to controller and to the Commission | Priv 1–15 | UK GDPR Art. 13 as amended (2)(ca), (2)(d) | legislation.gov.uk/eur/2016/679/article/13 | P | High | C L8 |
| 33 | Information Commission replaces the ICO (30 Sep 2026) | Priv 9, 13 | DUAA 2025 ss. 117–119; SI 2026/1015 | legislation.gov.uk/ukpga/2025/18/section/118 | P | High | C L9 |
| 34 | Controller complaints: acknowledge in 30 days, progress, outcome | Priv 13 | DPA 2018 s. 164A (in force 19 Jun 2026) | legislation.gov.uk/ukpga/2018/12/section/164A | P | High | C L10 |
| 35 | EEA (Ireland) adequate; other transfers need a safeguard | Priv 7 | UK GDPR Arts 45A–46; DPA 2018 Sch. 21 para. 5; SI 2023/1028 | legislation.gov.uk/ukpga/2018/12/schedule/21/paragraph/5 | P | High (law); facts owner | C L14 |
| 36 | Strictly necessary exemption for a record of selections | Cookie 2 | PECR reg. 6 (substituted 5 Feb 2026), Sch. A1 para. 4(2)(e)(ii); ICO guidance 29 Apr 2026 | legislation.gov.uk/uksi/2003/2426/schedule/A1 | P/G | Medium-high | C L1–L5 |
| 37 | Email marketing needs consent or soft opt-in offered at collection | Priv 11 | PECR reg. 22 | legislation.gov.uk/uksi/2003/2426/regulation/22 | P | High | C L7 |
| 38 | Electronic contracting: explicit acknowledgement of the obligation to pay; otherwise the consumer is not bound (no email carve-out) | Cons 3 | CCR reg. 14(2)–(5) | legislation.gov.uk/uksi/2013/3134/regulation/14 | P | High (text); medium (application to email) | A-06, G-01 |
| 39 | Deferred payment is exempt credit only within twelve payments, twelve months, no interest or charge | Cons 4; Bus 5 | FSMA 2000 (Regulated Activities) Order 2001 arts 60B, 60C(3), 60F(2) | legislation.gov.uk/uksi/2001/544/article/60F | P | High | G-03 |
| 40 | Right to object to direct marketing | Priv 10 | UK GDPR Art. 21(2)–(3) | legislation.gov.uk/eur/2016/679/article/21 | P | Medium (not re-fetched) | C L18 |

Agent G's re-verification of these propositions, and any correction, is in `G-final-cross-check.md`
and summarised in §8.

## 5. Disposition of the review findings

| Finding | Where it is dealt with |
|---|---|
| B-1 / F B-01 / E R1 automatic portfolio rights | Bus 9.4 and Cons 14: express written consent only, withdrawable |
| A-4, B-2, F C-01 Technical wider than `GS-X002` | Bus 12 and Cons 12: boundary text; no construction drawings |
| A-1, F C-05–C-08 cancellation inoperable | Cons 3, 6, 22 |
| A-2, F C-09 exit only "if we agree" | Cons 7 |
| A-3, F C-18 no Gridsmith termination/suspension | Cons 8; Bus 7 |
| A-5, B-9, D §6 VAT stated as fact | Neutral wording in all three; owner reconfirms status (decision D-1) |
| B-3, F B-04 cap and self-referential saver | Bus 16: saver deleted; per-Scope / 12-month retainer cap (decision D-2) |
| B-4 insolvency termination | Bus 7 qualified "to the extent the law allows"; Bus 5 suspension likewise |
| B-5, F C-11–C-13, B-02 IP chain, interim use, background licence | Cons 13; Bus 9.2–9.3 |
| B-6, F B-11 data processing an agreement to agree | Bus 11 + Schedule (clause 23) |
| B-7, F F-01, F-02 formation, incorporation, versioning, battle of forms | Cons 3; Bus 1, 21 |
| F F-03, F-04 undefined start, no valuation | Cons 6.5, 7 (stage table); Bus 6.2 |
| F F-05, C-03 hidden third-party costs | Cons 3, 4, 7; Bus 2, 6 |
| F F-06, E R3 deposits | Cons 4 (none non-refundable); Bus 6.2 (reservation fee only if stated) |
| F F-07 subcontracting | Cons 2, 13; Bus 9.3, 21 |
| F F-08 consumer confidentiality | Cons 14 |
| F F-09, E G22 AI use | Cons 13; Bus 9.3 |
| F C-10, C-14, D-2 ghostwriting, ISBN, accounts | Cons 10; Bus 13 |
| F B-03 non-infringement | Bus 9.5; Cons 13 (reasonable care) |
| F B-12 domains/hosting | Cons 11; Bus 14 |
| F C-17 force majeure exit | Cons 18 (30 days); Bus 18 (60 days) |
| F C-20, B-16 overseas clients | Cons 20; Bus 22 (English courts unless agreed otherwise) |
| F S-1–S-3 public basis lines and stale citations | Route no longer renders `basis`; seed no longer carries it |
| F S-4 inconsistent document names | "Client Terms for Consumers" / "Client Terms for Business Clients" throughout |
| F S-5, D-2 "awaiting solicitor review" | Seed summaries/reviewedBy rewritten; Press copy changed (owner to approve, D-20) |
| F D-1 CRA s. 57 overstatement | `/legal/client-terms` 1.2 |
| F W-01, D E7 website portfolio and prices | Website 3–5 |
| C §2 privacy recipients, transfers, regulator, complaints, reviews, Press data | Privacy 1–15 |
| C cookie wording | Cookie 1–5 |
| C E2 / D: `/contact` had no privacy link | `components/leads/ContactForm.tsx` |
| C E4 / F25: "reply to the acknowledgement" (none is sent) | `ContactForm.tsx` confirmation copy |
| D P13 business complaints | Bus 19 |
| D P5 legal form | Draft headers (footer wording is decision D-17) |
| Left to the owner | §7 below |

## 6. Numbers the drafts use that the owner must confirm

Statutory figures (not choices): 14-day cancellation and refund periods (CCR); twelve payments within 12 months for deferred payment (RAO art. 60F(2)); 30-day data-complaint
acknowledgement ceiling (DPA s. 164A); statutory late-payment interest and £40/£70/£100 (LPA 1998);
`gs_consent` 365 days (the site's own setting).

Drafting defaults (owner choices, each reviewable):

| Where | Number | Purpose |
|---|---|---|
| Cons 5; Bus 2 | 1 revision round per deliverable | Default only where a quotation is silent |
| Cons 8 | 7 days | Notice before pausing for an unpaid amount |
| Cons 8 | 60 days + 14 days | Waiting on the client, then written notice, before ending |
| Cons 8 | 14 days | To put right a serious breach; Gridsmith's own-reason notice |
| Cons 16; Accessibility 5 | 5 working days | Aim for acknowledging complaints/accessibility requests (unchanged from v2.0) |
| Cons 18 | 30 days | Delay outside control before the consumer may end |
| Cons 7, 8, 18, 20 | 14 days | Refund deadlines after the statutory period (contractual, not statutory) |
| Bus 6.2 | 14 days | Refund of overpayment on cancellation |
| Bus 2 | per stage on delivery / monthly in arrears | Default invoicing where a Scope is silent |
| Bus 5 | 14 days; 7 days | Invoice terms; suspension notice |
| Bus 3 | 60 days + 14 days | Dormant project |
| Bus 7 | 14 days; 14 days | Remedy period; Gridsmith convenience notice |
| Bus 8 | 10 + 5 working days | Review, then reminder, then accepted for invoicing only |
| Bus 10 | 5 years | Confidentiality after the project |
| Bus 14 | 30 days | Ending support/retainers where the Scope is silent |
| Bus 16 | 12 months | Cap reference period for retainers |
| Bus 18 | 60 days | Force-majeure long-stop |
| Bus 20 | 5pm / 9am / 2 business days | Deemed receipt |
| Bus 22 | 20 working days | Pre-action negotiation |
| Bus 23 | 14 days | Notice of a new sub-processor |

## 7. Critical owner decisions

Each is listed with options and the conservative recommendation (★). Nothing here is decided for the
owner; the drafts implement ★ where a choice was unavoidable, and say so.

| ID | Decision | Options | ★ Recommendation | Why |
|---|---|---|---|---|
| D-1 | **VAT status** | (a) not registered — confirm in writing with date; (b) registered — publish the number on the site, quotes and invoices | Confirm in writing. The drafts no longer state a status, so no document changes either way; the footer's "no VAT number" is right only if (a) | CCR Sch. 2(f); E-Commerce reg. 6(1)(g); PSR reg. 8(1)(g) |
| D-2 | **B2B liability cap** | fees under the Scope (drafted); greater of fees and a floor; multiple; Scope-specific | Drafted cap + 12 months for retainers; a prominent Scope-specific cap for any Technical or high-value work | UCTA s. 11(4)–(5); no PI cover |
| D-3 | **Deposits / advance payments** | all refundable per terms (drafted); small reservation fee stated in a Scope (B2B only) | As drafted; never "non-refundable" for consumers | CMA37 6.60–6.62 |
| D-4 | **Technical scope** | no construction-related drawings (drafted); accept under a named qualified designer after `GS-X002` | As drafted until `GS-X002` closes; decide whether Technical is offered to consumers at all | CDM 2015; Building Regs 2010; CRA s. 50 |
| D-5 | **International clients** | accept with home-law sentence (consumers) and English courts (business) — drafted; restrict countries | As drafted; GBP; check any country you actively target | Rome I Art. 6; Hague 2019 partial |
| D-6 | **Privacy facts** | confirm DPAs accepted (Hostinger, Supabase, Resend); name the transfer safeguard per provider; Resend sending region; optionally pin Edge Functions to an EU/UK region | Accept the providers' DPAs, then fill the two `[OWNER DECISION]` markers in Privacy 6–7 | UK GDPR Arts 13(1)(e)–(f), 28, 44–46 |
| D-7 | **Retention** | criteria only (drafted, true today); fixed periods with a deletion routine | Set periods (e.g. enquiries 12 months; client records about 6 years) only once a deletion routine exists; review the 63 Production leads now | Art. 5(1)(e); Art. 13(2)(a) |
| D-8 | **Marketing** | none (drafted); opt-in or soft opt-in offered at collection | None until the forms offer a refusal or opt-in | PECR reg. 22 |
| D-9 | **Early start and stage table** | offer early start with the three statements (drafted) or always wait 14 days | As drafted, with standard start as default; every consumer quotation template must carry the stage table, the statements and the form | CCR reg. 36 |
| D-10 | **How clients accept** | reply email / e-signature (drafted); portal or payment-link acceptance | Email or e-signature. CCR reg. 14 has no email carve-out, so every consumer acceptance carries the obligation-to-pay acknowledgement and any button reads "Accept and agree to pay" (drafted, G-01); a portal or payment link also needs the E-Commerce reg. 9(1)/11 information | CCR reg. 14; E-Commerce regs 9, 11 |
| D-11 | **Goods (printed copies)** | services only — client buys from the printer or under a separate later contract (drafted, G-02); supply goods under the same contract | As drafted. Supplying goods makes the contract a sales contract (cancellation runs to delivery; no loss of right on full performance), so it needs a redraft; for business clients a goods clause (UCTA s. 7) | CCR regs 5, 30, 36; UCTA s. 7 |
| D-12 | **Consumer retainers / maintenance** | fixed term, single up-front payment, no auto-renewal (drafted, G-04); recurring payments | As drafted: a fixed-term plan paid in instalments is within s. 254(2) once in force (January 2027 announced) | DMCCA s. 254 |
| D-13 | **Gridsmith own-reason termination** | keep with refund and handover (drafted); delete | Keep (B) — F preferred deletion for B2B | UCTA s. 3(2)(b) |
| D-14 | **AI disclosure** | per quotation/on delivery (drafted); client consent first | As drafted | CDPA s. 9(3); transparency |
| D-15 | **Ghostwriting waivers** | procure signed waivers by default (drafted) | As drafted — needs writer agreements that provide them | CDPA s. 87 |
| D-16 | **Complaints telephone** | keep WhatsApp/text only; accept calls/voicemail on the published number | Accept calls or voicemail, no hours or response promise | PSR reg. 7(2)(b) |
| D-17 | **Footer statutory line** | "registered in England" (current); "a private limited company registered in England and Wales" | Change the site line (content edit, gate expectations checked) in a site phase | SI 2015/17 reg. 25; PSR reg. 8(1)(b) |
| D-18 | **Marketplace (Freelancer) projects** | marketplace terms prevail where they cannot be varied (drafted) | Check the platform's terms before relying on it | F B-14 |
| D-19 | **Numbers in §6** | confirm or change each | Confirm | Transparency |
| D-20 | **Site copy changed in this phase** | approve or revise: Press rights note; `/contact` privacy line; `/contact` confirmation wording | Approve | CRA s. 50; UK GDPR Art. 13 |
| D-21 | **Data protection fee** | registered / exempt / register | Check the public register and register if not exempt | DP (Charges and Information) Regs 2018 |
| D-22 | **Business documents** | quotations, invoices, signature carry full particulars; name all directors or none | Do both | SI 2015/17 regs 24–26 |
| D-23 | **In-flight engagements** | continue on their own terms; re-paper | Continue; every new quotation names the version | CRA s. 50(4) |
| D-24 | **Development dataset reseed** | authorise reseeding the seven development legal documents now; wait for adoption | Authorise now (development only). Until then `check:legal:parity` against the development dataset is red by construction | Served parity |
| D-26 | **Quotation validity** | each quotation/Scope states how long it stays open (drafted) | Set a standard period in the templates | E G2 |
| D-27 | **Press content responsibility** | client decides and is responsible; no legal review; right to decline (drafted, no indemnity); add a narrow B2B indemnity | As drafted; any B2B indemnity only by owner choice, never for consumers | E G18, R19; G-09 |
| D-28 | **Instalments** | limits drafted to RAO art. 60F(2); alternatively keep every payment at or before the work it pays for | As drafted; never add interest or fees to deferred consumer payments without advice | RAO art. 60F |
| D-29 | **Production cookie re-test** | re-test gridsmith.uk at cutover (`curl -I` and a browser) before the Cookie Policy is `PUBLISHABLE` | Do it; amend if Hostinger security features set cookies | G-24, C D5 |
| D-30 | **Engineering drawings naming** | the gated catalogue name "Engineering drawings" vs "we do not provide engineering design" | Reconcile in `GS-X002` before Technical is published | G-14; CRA s. 50 |
| D-25 | **Adoption itself** | adopt each document version (date + version in the register) | Adopt only after D-1, D-6 and the G findings are closed | `GS-O003-R` |

## 8. Agent G cross-check

`G-final-cross-check.md`: 1 high, 8 medium, 17 low defects on the first pass. High: G-01 (CCR reg. 14 obligation-to-pay acknowledgement missing). Medium: G-02 goods, G-03 instalments/consumer credit, G-04 consumer maintenance under s. 254(2), G-05 contradictory refund in consumer §8, G-06 assignment confirmation only on request, G-07 business "started work" undefined, G-08 retention period, G-09 Press content responsibility. All drafting defects G-01 to G-22 were fixed in the drafts as G proposed; G-08, G-20, G-22–G-24 and G-26 are owner decisions (D-7, D-16, D-26, D-11, D-29, D-5); G-25 corrected this record. Forbidden content: none found. Cross-references: all resolve. G's re-verification of the fixes is §7 of its report.

## 9. Code, gates and records changed

- `lib/legal/adoption.ts` — the five states. `docs/_legal/GS-O003-R-REGISTER.json` — per-document state.
- `sanity/schemas/legalDocument.ts`, `lib/sanity/queries.ts` — `adoptionState` and `ownerAdoptedOn`
  replace `solicitorApproved`.
- `app/(marketing)/legal/[slug]/page.tsx` — "NOT YET ADOPTED" banner below `PUBLISHABLE`; "Draft dated"
  instead of "Effective" until adopted; no public `Basis:` line.
- `scripts/seed-legal.mjs` — generated from the drafts by `parseDraft` (one authored text); adoption
  state from the register; throws on an adoption the draft no longer matches.
- `scripts/migrate-production-cms.mjs` — legal documents admitted only at `PUBLISHABLE` at the adopted
  version; preflight and selftest cases; manifest regenerated (7 legal entries gated `GS-O003-R`).
- `scripts/check-legal-parity.mjs` — banner branch reads the register; the `Basis:` exemption removed.
- **New** `scripts/check-legal-adoption.mjs` + `legal-adoption-rules.mjs` + selftest (56 cases), in
  `verify:static` and CI.
- `scripts/struck-rules.mjs` — `GS-O003-SOLICITOR-APPROVAL-GATE`, 11 corpus lines struck in place.
- `components/leads/ContactForm.tsx`, `components/divisions/press/PressHome.tsx` — D-20.
- `docs/_legal/LEGAL-LAUNCH-CHECKLIST.md`, `docs/_shared/OWNER-ACTIONS.md`, `CLAUDE.md` and status
  banners updated.

## 10. Verification and results

- **Register:** all seven documents at **`OWNER_REVIEW_REQUIRED`** on Agent G's re-verification
  (`G-final-cross-check.md` §7). None is `OWNER_ADOPTED`; none is published. G's three late wording
  points (N-1 instalment limit vs default invoicing and unincorporated bodies, N-2 "does not reduce our
  responsibility for our own work", N-3 printing removed from consumer third-party costs) were applied
  after its pass and are covered by the gates below, not by a further independent pass.
- **Static:** `verify:static` PASS (typecheck, lint, every static gate). `check:legal:adoption` PASS
  (6 drafts, 7 documents, register coherent); its selftest 65/65, each branch shown red on a mutated
  copy of the real drafts, and two rule predicates broken on purpose turned the selftest red (restored
  byte-identical). `check:struck` PASS with `GS-O003-SOLICITOR-APPROVAL-GATE` (11 lines annotated);
  struck selftest 42/42 including the new branch. Migration dry run: 47 eligible, 10 gated (`GS-X002`,
  `GS-O003-R`), manifest regenerated and in agreement.
- **Served parity, simulated:** the real `check:legal:parity` against pages rendered from the generated
  seed: 6 documents, 107 clauses, 429 paragraphs matched, 107 clause tokens reachable. Proven red
  separately on a missing banner (branch D), a dropped clause 6.5 (C), an added word (B) and a stale
  version (A).
- **Served parity, development dataset:** **red by construction** (246 problems: every page still
  serves v2.0) until the development legal documents are reseeded — owner decision D-24. No Sanity write
  was made in this phase.
- **Rendered checks (local dev server, development dataset, read-only):** `/contact` shows the privacy
  link inside the form and no longer promises an acknowledgement email; `/press` shows the new rights
  note; legal pages show "NOT YET ADOPTED", "Draft dated" and no `Basis:` line. axe (WCAG 2.2 A/AA
  tags): 0 violations on `/contact` at 375 and 1440, `/press` at 1440 and `/legal/consumer-client-terms`
  at 375. `check:consumer-terms` PASS (clause-10-1 anchor kept).
- **Observed in passing (not this phase):** on Hostinger staging, unknown paths under `/contact/` and
  `/about/` return HTTP 500 instead of 404 (`/contact/thank-you`, `/about/xyz`); other sections 404
  correctly. Raised as a separate task; no redeploy made.
- **Not done, by instruction:** no publication, no `OWNER_ADOPTED`, no Sanity/Supabase/Hostinger/DNS/
  Vercel/main change, no push, no H4-H.

## 11. GS-LEGAL-001-R2 follow-up (7 October 2026)

`R2-OWNER-DECISION-PACK.md` in this folder supersedes §7 **as the owner's working list**. §7 stays as
the record of what GS-LEGAL-001 recommended, and five of its entries are corrected there:

- **D-1:** the owner stated "not VAT registered" on 2 September 2026 (`f666202`).
- **D-11:** the draft no longer says "or under a separate later contract". Consumer 6.1 now reads
  "buy them directly from the printer, on the printer's terms".
- **D-16:** the ★ ("accept calls or voicemail") is withdrawn because it would reverse `GS-R001-R`.
- **D-17:** `GS-O004` chose "Registered in England"; the certificate decides.
- **D-21:** answered by `GS-O016`.

N-1 to N-3 (§10) were independently verified: no defect, with two low contractual gaps in N-1 and
proposed wording. Nothing was adopted, published or deployed; no draft was edited.

## 12. GS-LEGAL-001-R3 (7 October 2026)

The owner's answers to `R2-OWNER-DECISION-PACK.md` §4 are applied, and the record of that is
`R3-OWNER-DECISIONS-APPLIED.md`. In summary:

- **Client terms:** Client Terms for Consumers and for Business Clients move to **3.1**. The changes are
  O-5 (1)–(4), the option E liability cap and the direct-to-printer model.
- **Operational documents** under `docs/_legal/operations/`: the retention schedule is adopted but not
  yet operating; the consumer contracting workflow is adopted; the rights-chain requirements cover P-2.
- **C-3:** verified as "registered in England and Wales".
- **Privacy** stays 2.1 with its three markers, pending owner account checks and the retention routine
  operating.
- **States:** all seven remain `OWNER_REVIEW_REQUIRED`; none is adopted.
