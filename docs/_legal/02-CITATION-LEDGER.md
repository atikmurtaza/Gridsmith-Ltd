# 02 — Citation Ledger

**Date checked: 25 August 2026.** All primary sources fetched on that date from `legislation.gov.uk`
(current in-force text unless stated) and `w3.org`.

**This is not legal advice.** It is a register of obligations with primary citations, assembled so a
solicitor can check the drafts against the instruments rather than against a summary of them. Nothing
here is a legal opinion on whether Gridsmith Ltd complies.

---

## Method

1. **A secondary source finds the primary source. It never states what the law says.** Law-firm
   briefings and ICO guidance were used only to locate an instrument, section, or commencement date.
   Every "what it requires" field below was written after reading the primary text at the URL cited.
2. **No primary citation, no entry.** Anything that could not be reached or verified is in
   §COULD NOT VERIFY, with what was tried.
3. **In-force version checked.** `legislation.gov.uk` serves original and as-amended text; each entry
   records the amendment position observed on 25 Aug 2026.
4. **`00-LEGAL-BASIS.md` was treated as an unverified assertion, not a source.** Its §2 claim — DUAA
   2025 main provisions commenced 5 Feb 2026, direct-complaints duty 19 June 2026 — **was independently
   verified and is correct**: SI 2026/82 reg. 2 (5 Feb 2026, incl. s.112) and reg. 3 (19 June 2026,
   s.103 and Sch. 10). See `L-DUAA-COMMENCEMENT`.
5. **The six legal drafts were not read.** This ledger is the standard they are to be measured against.

### Audience key

The build serves two audiences through one set of routes (`01-FACTUAL-INVENTORY.md` §5.1):
**Press is consumer-facing**; **Design and Digital are largely B2B**; `/`, `/contact` and every
`/legal/*` page mix both. Where an obligation lands differently, the entry says so rather than
collapsing to the stricter standard.

---

## A. Data protection — UK GDPR and DPA 2018

### L-DUAA-COMMENCEMENT — the amendment baseline

| | |
|---|---|
| **instrument** | Data (Use and Access) Act 2025 (c. 18) |
| **provision** | s. 142 (commencement); The Data (Use and Access) Act 2025 (Commencement No. 6 and Transitional and Saving Provisions) Regulations 2026, SI 2026/82, regs. 2 and 3 |
| **in-force version** | As made; checked 25 Aug 2026 |
| **what it requires** | Not an obligation — the dating baseline for every UK GDPR / DPA / PECR entry below. SI 2026/82 reg. 2 brought a block of Part 5 into force on **5 February 2026**, including s. 112 (terminal-equipment storage). Reg. 3 brought **s. 103 (complaints by data subjects) and Sch. 10 into force on 19 June 2026**. Both dates confirmed against the SI itself. |
| **primary source** | https://www.legislation.gov.uk/uksi/2026/82/made · https://www.legislation.gov.uk/ukpga/2025/18/contents |
| **applies to** | all |
| **engaged here because** | Every draft under audit was written before or across these dates; `PRIVACY-POLICY.md` and `COOKIE-POLICY.md` were last touched 21 Aug 2026 (§0 file listing). |
| **status in this build** | n/a — baseline |

### L-GDPR-6 — lawful basis

| | |
|---|---|
| **instrument** | UK GDPR (Regulation (EU) 2016/679 as retained and amended) |
| **provision** | Art. 6(1) — in particular 6(1)(b) (steps at the data subject's request prior to entering a contract) and 6(1)(f) (legitimate interests) |
| **in-force version** | Retained EU law as amended to 5 Feb 2026; checked 25 Aug 2026 |
| **what it requires** | Processing is lawful only to the extent at least one Art. 6(1) condition is met. The controller must identify which, before processing. |
| **primary source** | https://www.legislation.gov.uk/eur/2016/679/article/6 |
| **applies to** | all |
| **engaged here because** | Inventory §3.1 — the lead form collects `full_name`, `email`, `company`, `phone` and free-text `message` (up to 5000 chars) and writes them to `leads`; §3.4 — the record is transmitted to Resend and (if enabled) Slack. |
| **status in this build** | **cannot tell.** Nothing in the inventory records a documented lawful basis; `lib/leads/schema.ts:20-24` states a data-minimisation policy, not a basis. |

### L-GDPR-5-1e — storage limitation

| | |
|---|---|
| **instrument** | UK GDPR |
| **provision** | Art. 5(1)(e); accountability at Art. 5(2) |
| **in-force version** | As amended to 5 Feb 2026; checked 25 Aug 2026 |
| **what it requires** | Personal data must be kept in identifiable form no longer than is necessary for the purposes for which it is processed. Art. 5(2) makes the controller responsible for, and required to demonstrate, compliance. |
| **primary source** | https://www.legislation.gov.uk/eur/2016/679/article/5 |
| **applies to** | all |
| **engaged here because** | Inventory §3.4 — **"Retention: NOT IMPLEMENTED."** No purge, anonymisation or scheduled delete over `leads` exists anywhere in the repository; the only cron is `/api/rls-drift`. OQ-9. |
| **status in this build** | **not satisfied.** Lead data accumulates indefinitely with no defined period and no deletion mechanism. |

### L-GDPR-13 — information to be provided (privacy notice content)

| | |
|---|---|
| **instrument** | UK GDPR |
| **provision** | Art. 13(1) and 13(2) |
| **in-force version** | **As amended by DUAA 2025 with effect from 5 Feb 2026 and 19 June 2026**; checked 25 Aug 2026 |
| **what it requires** | Where data is obtained from the data subject, the controller must provide at the time of collection: identity and contact details of the controller (and representative / DPO where applicable); purposes and legal basis; the legitimate interests where 6(1)(f) is relied on; recipients or categories of recipient; the fact of any third-country transfer and the safeguard relied on. Art. 13(2) adds: retention period or the criteria for determining it; the rights of access, rectification, erasure, restriction, objection and portability; the right to withdraw consent; **the right to make a complaint to the controller under DPA 2018 s. 164A** (a UK addition, in force 19 June 2026); the right to complain to the Commissioner; whether provision is statutory or contractual and the consequences of not providing; and the existence of automated decision-making. |
| **primary source** | https://www.legislation.gov.uk/eur/2016/679/article/13 |
| **applies to** | all |
| **engaged here because** | Inventory §3 — data is obtained directly from the data subject at `/contact`. |
| **status in this build** | **not satisfied in at least three respects, from the inventory alone**: no retention period exists to state (§3.4); the Slack recipient is undocumented (§1.4); processor regions are unestablished (OQ-1 to OQ-4), so the transfer disclosure cannot be accurate. The s. 164A complaint right is new since the drafts were last touched. |

### L-GDPR-RIGHTS — data subject rights

| | |
|---|---|
| **instrument** | UK GDPR |
| **provision** | Arts. 15 (access), 16 (rectification), 17 (erasure), 18 (restriction), 20 (portability), 21 (objection); Art. 12 (modalities, and the one-month response period) |
| **in-force version** | As amended to 5 Feb 2026; checked 25 Aug 2026 |
| **what it requires** | The controller must facilitate the exercise of these rights and respond without undue delay and in any event within one month of receipt (Art. 12(3)), extendable by two further months where necessary given complexity and number of requests. Information is provided free of charge save for manifestly unfounded or excessive requests. |
| **primary source** | https://www.legislation.gov.uk/eur/2016/679/article/12 · https://www.legislation.gov.uk/eur/2016/679/article/15 · https://www.legislation.gov.uk/eur/2016/679/article/17 |
| **applies to** | all |
| **engaged here because** | Inventory §3.1 — identifiable records are held in `leads` with `id`, `email` and `created_at`. |
| **status in this build** | **cannot tell.** No erasure mechanism exists (§3.4), so an Art. 17 request would have to be executed by hand against Supabase; nothing in the inventory records a process. |

### L-DPA-164A — the DUAA direct-complaints duty

| | |
|---|---|
| **instrument** | Data Protection Act 2018, s. 164A, inserted by Data (Use and Access) Act 2025 s. 103 |
| **provision** | DPA 2018 s. 164A; DUAA 2025 s. 103 and Sch. 10 |
| **in-force version** | **In force 19 June 2026** — SI 2026/82 reg. 3; checked 25 Aug 2026 |
| **what it requires** | A controller must **facilitate the making of data protection complaints**, "by taking steps such as providing a complaint form which can be completed electronically and by other means"; must **acknowledge receipt within 30 days**; and must **without undue delay take appropriate steps to respond** and inform the complainant of the outcome, including making appropriate inquiries and keeping the complainant informed of progress. No small-organisation exemption. Art. 13(2) requires the existence of this right to be stated in the privacy notice (see `L-GDPR-13`). |
| **primary source** | https://www.legislation.gov.uk/ukpga/2025/18/section/103/enacted · https://www.legislation.gov.uk/uksi/2026/82/made |
| **applies to** | all |
| **engaged here because** | Gridsmith Ltd is a controller for the `leads` data (inventory §3). The duty commenced **after** the 21 Aug 2026 revision date of the current privacy draft. |
| **status in this build** | **not satisfied.** Inventory §5.1 lists every route; there is **no complaints route and no electronic complaint form**. `/contact` is a sales enquiry form whose `message` field is deliberately withheld from the notification email (§3.4) — it is not a complaints channel. |

### L-GDPR-32 — security of processing

| | |
|---|---|
| **instrument** | UK GDPR |
| **provision** | Art. 32(1) |
| **in-force version** | As amended to 5 Feb 2026; checked 25 Aug 2026 |
| **what it requires** | Appropriate technical and organisational measures to ensure a level of security appropriate to the risk, having regard to the state of the art, costs, and the nature, scope, context and purposes of processing — including as appropriate pseudonymisation and encryption, ongoing confidentiality/integrity/availability/resilience, restoration after incident, and **a process for regularly testing, assessing and evaluating the effectiveness** of the measures. |
| **primary source** | https://www.legislation.gov.uk/eur/2016/679/article/32 |
| **applies to** | all |
| **engaged here because** | Inventory §3.4 — RLS verified live as anon-insert-only on `leads`, no anon SELECT/UPDATE/DELETE, the analytics view revoked and `security_invoker`; a daily `/api/rls-drift` cron re-tests it (`vercel.json:4-9`). That cron is a concrete instance of the Art. 32(1)(d) testing limb. |
| **status in this build** | **satisfied in substantial part, with one gap.** No honeypot, rate limit or CAPTCHA on the public write path (§3.3) — an availability/abuse exposure on the one endpoint anon may write to. |

### L-GDPR-28 — processors

| | |
|---|---|
| **instrument** | UK GDPR |
| **provision** | Art. 28(1) and 28(3) |
| **in-force version** | As amended to 5 Feb 2026; checked 25 Aug 2026 |
| **what it requires** | A controller may use only processors providing sufficient guarantees. Processing by a processor must be governed by a contract **binding on the processor** setting out the subject-matter, duration, nature and purpose, type of personal data, categories of data subject, and the controller's rights — and containing the specific stipulations in Art. 28(3)(a)–(h), including that the processor acts only on documented instructions, assists with data subject rights and Arts. 32–36, and deletes or returns the data at the end of provision. |
| **primary source** | https://www.legislation.gov.uk/eur/2016/679/article/28 |
| **applies to** | all |
| **engaged here because** | Inventory §1.1 — Supabase, Vercel and Resend all receive lead personal data; §1.4 — **Slack is a live code path transmitting an enquirer's full name** and appears in no documentation. |
| **status in this build** | **cannot tell.** No DPA is recorded in the repository for any processor (OQ-1, OQ-4, OQ-6). |

### L-GDPR-44A — international transfers

| | |
|---|---|
| **instrument** | UK GDPR, Chapter V **as restructured by DUAA 2025** |
| **provision** | Art. 44A (general principles, **inserted 5 Feb 2026**); Art. 45A (transfers approved by regulations); **Art. 45B (the data protection test)**; Art. 46 (appropriate safeguards, substantially amended 5 Feb 2026); Art. 49 (derogations). **Old Arts. 44 and 45 were omitted on 5 Feb 2026.** |
| **in-force version** | Chapter V as amended by DUAA 2025 with effect from 19 June 2025 (partial) and 5 Feb 2026 (full); checked 25 Aug 2026 |
| **what it requires** | A transfer to a third country may take place only where approved by regulations under Art. 45A, or subject to appropriate safeguards under Art. 46, or within an Art. 49 derogation. Art. 45B replaces the old adequacy test with **the "data protection test"**: whether the standard of protection in the receiving country or for the receiving organisation **is not materially lower than** the standard under the UK GDPR and DPA 2018. |
| **primary source** | https://www.legislation.gov.uk/eur/2016/679/chapter/V |
| **applies to** | all |
| **engaged here because** | Inventory §1.1 — the region of **Sanity (OQ-1), Supabase (OQ-2), Vercel (OQ-3) and Resend (OQ-4) is unestablished**, and OQ-2 states explicitly that the live Supabase project's region "must not be assumed to be EU". PostHog is the one processor pinned EU-only in code (`lib/analytics/posthog-region.ts:15-19`). |
| **status in this build** | **cannot tell — and it is the largest single unknown.** Any transfer clause in the drafts naming "adequacy decisions" or Art. 45 is citing text that was **omitted on 5 Feb 2026**. |

### L-GDPR-30 — records of processing

| | |
|---|---|
| **instrument** | UK GDPR |
| **provision** | Art. 30(1) and the Art. 30(5) exemption |
| **in-force version** | As amended to 5 Feb 2026; checked 25 Aug 2026. `legislation.gov.uk` shows an outstanding unapplied amendment to Art. 30(4) from SI 2026/386 — see COULD NOT VERIFY §CNV-2. |
| **what it requires** | A controller must maintain a record of processing activities: contact details; purposes; categories of data subject and of personal data; categories of recipient including those in third countries; third-country transfers and their safeguards; envisaged erasure time limits; and a general description of the Art. 32(1) security measures. Art. 30(5) **exempts** an organisation employing fewer than 250 persons **unless** the processing is likely to result in a risk to rights and freedoms, **is not occasional**, or involves Art. 9 or Art. 10 data. |
| **primary source** | https://www.legislation.gov.uk/eur/2016/679/article/30 |
| **applies to** | all |
| **engaged here because** | Gridsmith Ltd is plainly under 250 employees, but lead capture is a **continuous, automated, always-on** process (§3.4 — every submission writes a row and fires a notification), which is not "occasional". The exemption therefore does not obviously apply. |
| **status in this build** | **not satisfied / cannot tell.** No ROPA exists in the repository; the inventory itself is the closest thing to one. |

### L-DPA-FEE — the data protection fee

| | |
|---|---|
| **instrument** | Data Protection (Charges and Information) Regulations 2018, SI 2018/480 |
| **provision** | reg. 2 (duty to pay), reg. 3 (amount), Sch. 1 (tiers) |
| **in-force version** | As made and amended; checked 25 Aug 2026 |
| **what it requires** | A data controller must pay a charge to the Information Commissioner unless all of its processing is exempt processing, and must pay within the first 21 days of each charge period. Reg. 2 also requires the controller to state its staff-number band (≤10 / 11–250 / >250) and turnover band (≤£632,000 / £632,000–£36m / >£36m) and whether it is a public authority. |
| **primary source** | https://www.legislation.gov.uk/uksi/2018/480/regulation/2/made |
| **applies to** | all |
| **engaged here because** | Inventory §6.1 — `icoRegistration` **exists in the Sanity schema and is never populated or rendered anywhere** (`sanity/schemas/companyDetails.ts:47`). OQ-16 asks directly whether the company is registered and paying the fee. |
| **status in this build** | **cannot tell.** This is a fact about the company, not the codebase, but the site has a field for it and shows nothing. |

---

## B. PECR — cookies and electronic mail

### L-PECR-6 — storage of and access to information on terminal equipment

| | |
|---|---|
| **instrument** | Privacy and Electronic Communications (EC Directive) Regulations 2003, SI 2003/2426 |
| **provision** | **reg. 6 as substituted, and new Sch. A1, by Data (Use and Access) Act 2025 s. 112 and Sch. 12** |
| **in-force version** | **In force 5 February 2026** (SI 2026/82 reg. 2); checked 25 Aug 2026 |
| **what it requires** | reg. 6(1) now states the prohibition directly: a person **must not store information, or gain access to information stored, in the terminal equipment of a subscriber or user** — unless a Sch. A1 exception applies. New Sch. A1 sets out the exceptions: **para. 2** consent (clear and comprehensive information given, consent obtained, capable of being signified by browser or other application settings); **para. 3** transmission of a communication; **para. 4** strictly necessary for an information society service requested by the user (examples include security of the terminal equipment, fraud and fault prevention, and authentication records); **para. 5 statistical purposes** — permitted for improving the service, but only with clear information and **"a simple means of objecting, free of charge"**, and the data must not be shared except for improvement purposes; **para. 6 appearance and functionality** — adapting the site to the user's preferences, on the same information-plus-objection conditions; **para. 7** determining geographic position in response to an emergency assistance request. Conditions need be satisfied only on first use for recurring uses. DUAA also inserted reg. 6A, a Secretary of State power to add further exceptions by SI. |
| **primary source** | https://www.legislation.gov.uk/ukpga/2025/18/section/112/enacted · https://www.legislation.gov.uk/ukpga/2025/18/schedule/12/enacted · https://www.legislation.gov.uk/uksi/2003/2426/regulation/6 |
| **applies to** | all — reg. 6 is not limited to individual subscribers |
| **engaged here because** | Inventory §2 — **exactly one cookie exists in every state**, `gs_consent`, first-party, `Max-Age` 365 days, recording which categories were granted. §2.2 — after Accept, `googletagmanager.com` and `eu.i.posthog.com` scripts are injected; before any choice, **zero third-party requests**. §1.3 — those scripts are **never initialised**, so **no analytics cookie is set in any state**. |
| **status in this build** | **satisfied on the evidence, and the position is stronger than the drafts are likely to claim.** No non-essential storage occurs at all today. `gs_consent` itself is defensible under Sch. A1 para. 4 (strictly necessary to give effect to the user's own choice). **Two live questions**: (a) the para. 5 and para. 6 exceptions are new since 5 Feb 2026 and change what a cookie policy should say about analytics — OQ-7; (b) reg. 6 catches *access to* stored information, not only cookies, so the injected scripts are within scope the moment they initialise. |

### L-PECR-6-CONSENT — the standard of consent

| | |
|---|---|
| **instrument** | PECR 2003 reg. 2(1) (definition of consent, referring to UK GDPR) with UK GDPR Arts. 4(11) and 7 |
| **provision** | UK GDPR Art. 4(11), Art. 7(3) |
| **in-force version** | As amended to 5 Feb 2026; checked 25 Aug 2026 |
| **what it requires** | Consent must be freely given, specific, informed and unambiguous, by a statement or clear affirmative action. Art. 7(3): the data subject has the right to withdraw consent at any time, and **it must be as easy to withdraw as to give**. |
| **primary source** | https://www.legislation.gov.uk/eur/2016/679/article/4 · https://www.legislation.gov.uk/eur/2016/679/article/7 |
| **applies to** | all |
| **engaged here because** | Inventory §4.2 — Accept and Reject share one CSS class and one width (`ConsentBanner.tsx:176, 179`); every category defaults to denied; nothing is stored until a button is pressed; per-category granularity exists one level in via Preferences; withdrawal is a persistent footer control, `Cookie preferences`, verified in the live footer. |
| **status in this build** | **satisfied on parity, granularity and withdrawal.** One live issue: §4.1 — **`ad_storage` and `functionality_storage` are offered as toggles but no code branches on them**; only `analytics_storage` gates anything. Offering a control that does nothing is a representation to the visitor (OQ-10) and bears on "informed". |

### L-PECR-CONSENT-EVIDENCE — demonstrating consent

| | |
|---|---|
| **instrument** | UK GDPR |
| **provision** | Art. 7(1) |
| **in-force version** | As amended to 5 Feb 2026; checked 25 Aug 2026 |
| **what it requires** | "Where processing is based on consent, the controller **shall be able to demonstrate** that the data subject has consented to processing of his or her personal data." |
| **primary source** | https://www.legislation.gov.uk/eur/2016/679/article/7 |
| **applies to** | all |
| **engaged here because** | Inventory §4.3 — the consent record holds **the granted category names only, with no timestamp, no version, and no record of the banner text shown**, in a cookie in the visitor's own browser which they can delete. **`consent_events` does not exist**; `L-07` is SPECIFIED-BUT-NOT-BUILT. "There is therefore no evidence of consent retained anywhere." OQ-11. |
| **status in this build** | **not satisfied** as a matter of demonstrability. Note the mitigation: because nothing consent-gated actually collects data today (§1.3), there is currently no consent-based processing to demonstrate. That changes the day GA4 or PostHog is initialised. |

### L-PECR-22 — electronic mail for direct marketing

| | |
|---|---|
| **instrument** | PECR 2003 |
| **provision** | reg. 22(1)–(3); reg. 22(3A) and 22(5) inserted 5 Feb 2026 by DUAA 2025 |
| **in-force version** | As amended 5 Feb 2026; checked 25 Aug 2026 |
| **what it requires** | reg. 22(1): the regulation applies to unsolicited direct-marketing electronic mail **"to individual subscribers"**. reg. 22(2): no transmission unless the recipient has previously notified the sender of consent. reg. 22(3) — the **soft opt-in** — permits it where the sender obtained the contact details **in the course of the sale or negotiations for the sale of a product or service to that recipient**, the marketing is of **similar** products and services only, and the recipient was given **"a simple means of refusing (free of charge except for the costs of the transmission of the refusal)"** at the time the details were collected **and in every subsequent message**. New reg. 22(3A) creates a parallel charity exemption. |
| **primary source** | https://www.legislation.gov.uk/uksi/2003/2426/regulation/22 |
| **applies to** | **This is a real consumer/B2B divergence.** reg. 22 binds only for **individual subscribers** — which for Press's author audience means most recipients, and for a sole trader using a personal address may also. Marketing to a **corporate subscriber** (Design/Digital's typical buyer) falls outside reg. 22, though the sender's identity and a valid address are still required by reg. 23, and UK GDPR still applies to the personal data. |
| **engaged here because** | Inventory §3.1 — `email` is captured on every submission; §3.2 — the schema carries latent `source`/`medium`/`campaign` columns. Nothing in the inventory shows a marketing consent checkbox on the form or any mailing list. |
| **status in this build** | **not engaged today** — no marketing send exists. **It becomes engaged the moment enquirer emails are used for anything other than replying to the enquiry**, and the soft opt-in in reg. 22(3) is not available for an enquiry that did not become a negotiation for a sale. |

---

## C. Identification and trading disclosures

### L-CA-82 / L-TDR-24 — disclosure of registered name on the website

| | |
|---|---|
| **instrument** | Companies Act 2006, s. 82; Company, Limited Liability Partnership and Business (Names and Trading Disclosures) Regulations 2015, SI 2015/17 |
| **provision** | CA 2006 s. 82 (the power); **SI 2015/17 reg. 24** |
| **in-force version** | As made; checked 25 Aug 2026 |
| **what it requires** | reg. 24: **"Every company shall disclose its registered name on its websites."** The same duty applies to business letters, notices and other official publications, order forms, invoices, receipts and demands for payment. |
| **primary source** | https://www.legislation.gov.uk/uksi/2015/17/regulation/24/made · https://www.legislation.gov.uk/ukpga/2006/46/section/82 |
| **applies to** | all |
| **engaged here because** | Inventory §6.1 — the live footer renders "Gridsmith Ltd" on every page, from the Sanity `companyDetails` singleton, and a missing singleton fails the build. |
| **status in this build** | **satisfied.** Note §6.1 also lists three trading names (Gridsmith Design / Digital / Press); s. 1202–1206 CA 2006 (business names) is not separately entered because the registered name is disclosed alongside them. |

### L-TDR-25 — particulars to be disclosed on the website

| | |
|---|---|
| **instrument** | SI 2015/17 |
| **provision** | **reg. 25** |
| **in-force version** | As made; checked 25 Aug 2026 |
| **what it requires** | On business letters, order forms **and websites**, a company must disclose: **the part of the United Kingdom in which it is registered**; **its registered number**; **the address of its registered office**; plus, where applicable, exemption from using "limited", CIC status, and investment-company status. If any share-capital amount is stated, it must be paid-up share capital. |
| **primary source** | https://www.legislation.gov.uk/uksi/2015/17/regulation/25/made |
| **applies to** | all |
| **engaged here because** | Inventory §6.1 — the live footer renders, verbatim: "Gridsmith Ltd · registered in England & Wales · company number 17050842 · registered office 30 Briarfield Road, Farnworth, Bolton, BL4 0HD". All four particulars are present. |
| **status in this build** | **satisfied as to the required particulars.** Caveat from OQ-15: the number and address sit in a file named `seed-company-details.mjs` alongside a value explicitly marked `[SEED]`, so the file itself does not distinguish verified from placeholder values. Correctness of the disclosed particulars is an owner confirmation, not a code fact. |

### L-ECOM-6 — electronic commerce general information

| | |
|---|---|
| **instrument** | Electronic Commerce (EC Directive) Regulations 2002, SI 2002/2013 |
| **provision** | **reg. 6(1) and reg. 6(2)** |
| **in-force version** | As made and amended; checked 25 Aug 2026 |
| **what it requires** | reg. 6(1): a service provider must make the following **"easily, directly and permanently accessible"** to recipients and enforcement authorities — the name of the service provider; the geographic address at which it is established; **details including an electronic mail address which make it possible to contact it rapidly and communicate in a direct and effective manner**; trade register and registration number; supervisory authority particulars where authorisation is required; regulated-profession particulars; and **where the provider undertakes an activity subject to VAT, its VAT identification number**. reg. 6(2): **where prices are referred to, they must be indicated clearly and unambiguously and in particular must indicate whether they are inclusive of tax and delivery costs.** |
| **primary source** | https://www.legislation.gov.uk/uksi/2002/2013/regulation/6/made |
| **applies to** | **all — this regulation is not consumer-only.** It is the reason the VAT-treatment obligation on prices reaches the B2B divisions as well as Press. |
| **engaged here because** | Inventory §6.1 — name, address and `contact@gridsmith.uk` are rendered on every page. **§6.3 — the rendered VAT number is the placeholder `[SEED] GB123456789`.** §5.3 — `components/content/Price.tsx` renders prices on all three division landing pages and **"No VAT treatment is stated anywhere"** — no "inc. VAT", no "exc. VAT", no footnote. |
| **status in this build** | **not satisfied, twice.** (1) reg. 6(1)(g): the site publishes a **fabricated VAT number** on every page. If the company is not VAT-registered the correct action is to publish none, not a placeholder — and a false VAT number is a worse defect than a missing one. (2) reg. 6(2): prices are displayed with no tax indication, across **every** division. `sanity/schemas/objects.ts:75-79` already records this as gap `M-P2-3`. |

---

## D. Consumer law — Press primarily; the mixed routes secondarily

### L-CRA-49 — reasonable care and skill

| | |
|---|---|
| **instrument** | Consumer Rights Act 2015 |
| **provision** | s. 48 (scope), **s. 49** |
| **in-force version** | As amended; checked 25 Aug 2026 |
| **what it requires** | s. 48: applies to a contract for a trader to supply a service to a consumer. s. 49: every such contract is **treated as including a term that the trader must perform the service with reasonable care and skill**. |
| **primary source** | https://www.legislation.gov.uk/ukpga/2015/15/part/1/chapter/4 |
| **applies to** | **consumer only.** Engaged by Press (individual authors — inventory §5.1: "Your book, published properly, and still yours"). Not engaged by a Design or Digital contract with a business customer. |
| **engaged here because** | Inventory §5.2 — the seeded `client-terms` document **already cites CRA 2015 s. 50** at `seed-legal.mjs:230`, so the consumer regime is acknowledged in the build. §5.1 — `/press` sells to individuals. |
| **status in this build** | **cannot tell** from the inventory (the drafts were not read), but §5.2 records the structural problem: **one `Client Terms` route serves two drafts and mixes Companies Act and Consumer Rights Act bases in a single instrument.** OQ-13. |

### L-CRA-50 — pre-contract information becomes a term

| | |
|---|---|
| **instrument** | Consumer Rights Act 2015 |
| **provision** | **s. 50** |
| **in-force version** | As amended; checked 25 Aug 2026 |
| **what it requires** | Anything said or written to the consumer, by or on behalf of the trader, **about the trader or the service** is a term of the contract if the consumer takes it into account when deciding to enter the contract, or when making any decision about the service after entering it. |
| **primary source** | https://www.legislation.gov.uk/ukpga/2015/15/part/1/chapter/4 |
| **applies to** | consumer only — Press |
| **engaged here because** | This is the sharpest consumer-law hook in the whole build. Inventory §6.5: **`[SEED]` content is live on the running site today** — case-study metrics render as `[SEED] 00%`, selected work is `[SEED]`-prefixed, team members are `[SEED] Placeholder Name`, prices are `£0,000`. §6.2: the response commitment — "always by the end of the next business day" — is rendered on `/contact`. Every one of those is a written statement about the trader or the service that a consumer may take into account. |
| **status in this build** | **not satisfied while seed content is live.** The mitigation is real but partial: `check:launch-content` refuses a `production` dataset carrying `[SEED]` markers or an empty VAT number (§6.3, §6.5). The response commitment is genuine and single-sourced. |

### L-CRA-51 / L-CRA-52 — price and time where not fixed

| | |
|---|---|
| **instrument** | Consumer Rights Act 2015 |
| **provision** | s. 51 (reasonable price), s. 52 (reasonable time) |
| **in-force version** | As amended; checked 25 Aug 2026 |
| **what it requires** | Where the contract does not fix the price (or a way of determining it), the consumer must pay **only a reasonable price**. Where it does not fix the time, the trader must perform **within a reasonable time**. |
| **primary source** | https://www.legislation.gov.uk/ukpga/2015/15/part/1/chapter/4 |
| **applies to** | consumer only — Press |
| **engaged here because** | Inventory §5.3 — **every price on the site carries an unconditional `INDICATIVE` badge** (`Price.tsx:61`) and lead words "From" / "Typically" / "Day rate from". No price on the site is a fixed offer. |
| **status in this build** | **satisfied by design, with a consequence to state.** Indicative pricing means s. 51 supplies the default for any Press engagement not separately quoted — so the drafts must not imply the indicative figure is binding on the consumer. |

### L-CRA-57 — liability that cannot be excluded

| | |
|---|---|
| **instrument** | Consumer Rights Act 2015 |
| **provision** | **s. 57**; and Part 2 (ss. 61–76) on unfair terms |
| **in-force version** | As amended; checked 25 Aug 2026 |
| **what it requires** | A term is **not binding** to the extent that it would exclude or restrict the trader's liability under s. 49 (reasonable care and skill) or s. 50 (information binding as a term), or would prevent the consumer recovering the price paid. Part 2 additionally makes an unfair term in a consumer contract non-binding and requires transparency. |
| **primary source** | https://www.legislation.gov.uk/ukpga/2015/15/part/1/chapter/4 |
| **applies to** | consumer only — Press |
| **engaged here because** | Inventory §5.2 — a single `client-terms` instrument serves both audiences. **A liability cap drafted for a B2B MSA and applied to a consumer author is void to that extent under s. 57**, and this is exactly the collapse the one-route/two-drafts problem creates. OQ-13. |
| **status in this build** | **not satisfied structurally.** One route cannot carry both a valid B2B cap and a CRA-compliant consumer position. |

### L-CCR-13 — pre-contract information for distance contracts

| | |
|---|---|
| **instrument** | Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, SI 2013/3134 |
| **provision** | **reg. 13** with **Sch. 2**; reg. 14 (contracts concluded by electronic means); reg. 16 (confirmation on a durable medium) |
| **in-force version** | As made and amended; checked 25 Aug 2026 |
| **what it requires** | Before a consumer is bound by a distance contract, the trader must give the Sch. 2 information in a clear and comprehensible way — including the main characteristics, the trader's identity, geographical address and contact details, **the total price inclusive of taxes** (or the manner in which it will be calculated where it cannot be calculated in advance), arrangements for payment and performance, the complaints-handling policy, and **the existence and conditions of the right to cancel with the model cancellation form**. reg. 14 requires that where the contract is concluded electronically and places the consumer under an obligation to pay, the order button be labelled unambiguously. reg. 16 requires confirmation on a durable medium. |
| **primary source** | https://www.legislation.gov.uk/uksi/2013/3134/contents |
| **applies to** | **consumer only, and only where the contract is a distance or off-premises contract.** For Press, an engagement negotiated and signed remotely by an individual author is a distance contract. |
| **engaged here because** | Inventory §5.1 — `/press` is consumer-facing and its call to action is "Tell us about the book"; §5.1 — `/contact` is one form for all three divisions, so the consumer author and the business buyer travel the identical flow. |
| **status in this build** | **cannot tell** — the contracting flow after the enquiry is outside the repository. The inventory establishes that nothing on the site distinguishes a consumer author from a business buyer at any point. |

### L-CCR-29 — the right to cancel

| | |
|---|---|
| **instrument** | SI 2013/3134 |
| **provision** | **reg. 29** (right to cancel), reg. 30 (14-day period), **reg. 31 (period extended by up to 12 months for breach of the information requirement)**, reg. 36 (supply of a service in the cancellation period, and the express request needed to start early) |
| **in-force version** | As made and amended; checked 25 Aug 2026 |
| **what it requires** | The consumer may cancel a distance or off-premises contract within 14 days without giving reason. **If the trader did not give the cancellation information required by reg. 13, the period is extended — by up to 12 months (reg. 31).** Under reg. 36 a service may not begin within the cancellation period unless the consumer has made an express request; if the consumer then cancels, they pay a proportionate amount for what was supplied. |
| **primary source** | https://www.legislation.gov.uk/uksi/2013/3134/contents |
| **applies to** | consumer only — Press |
| **engaged here because** | Same as `L-CCR-13`. Ghostwriting and publishing services are precisely the case reg. 36 addresses: work usually starts before day 14. |
| **status in this build** | **cannot tell.** Flagged because reg. 31's 12-month extension is the most expensive consequence in this section and follows automatically from a reg. 13 omission. |

### L-CCR-40 — additional payments

| | |
|---|---|
| **instrument** | SI 2013/3134 |
| **provision** | **reg. 40**; reg. 41 (helpline charges above basic rate) |
| **in-force version** | As made; checked 25 Aug 2026 |
| **what it requires** | An additional payment beyond the main contractual obligation requires the consumer's **express consent**; consent inferred from a default option the consumer must reject (a pre-ticked box) does not count, and any such payment is recoverable. |
| **primary source** | https://www.legislation.gov.uk/uksi/2013/3134/regulation/40 |
| **applies to** | consumer only — Press |
| **engaged here because** | Inventory §5.3 — pricing is indicative with "What moves it: …" modifiers, i.e. the final figure moves upward from the displayed one. Any such uplift charged to a consumer needs express consent. |
| **status in this build** | **cannot tell** — no checkout exists (§7: estimator NOT BUILT). Recorded so the estimator is not built with a default-on option. |

---

## E. DMCCA 2024 — pricing and reviews

### L-DMCC-230 — total price in an invitation to purchase (drip pricing)

| | |
|---|---|
| **instrument** | Digital Markets, Competition and Consumers Act 2024 (c. 13) |
| **provision** | **s. 230** (material information in an invitation to purchase); with s. 226 (misleading actions) and s. 227 (misleading omissions) |
| **in-force version** | Part 4 Chapter 1 **in force 6 April 2025**; checked 25 Aug 2026 |
| **what it requires** | Where a commercial practice indicates a product's characteristics and price so as to enable the consumer to decide whether to purchase, the trader must give the material information listed in s. 230 unless already apparent from context — including **the total price of the product**, or where it cannot reasonably be calculated in advance, **how it will be calculated**; and where additional charges or taxes cannot reasonably be calculated in advance, **the fact that they may be payable**. Information enabling the price to be calculated must be given **"as much prominence as any information"** about the base price. Also required: trader identity, business address, email and service address, delivery charges, the right of withdrawal or cancellation, and any departure from published complaint-handling practice. |
| **primary source** | https://www.legislation.gov.uk/ukpga/2024/13/section/230 |
| **applies to** | **consumer only** (Part 4 is the consumer regime, replacing CPUT 2008). For Press. Design and Digital are reached by `L-ECOM-6` reg. 6(2) instead. |
| **engaged here because** | Inventory §5.3 — `/press` renders prices through `Price.tsx` with **no VAT treatment stated**, and the prominence rule bites on the `INDICATIVE` badge and the "What moves it: …" line: those are the price-calculation information, and s. 230 requires them to be as prominent as the figure itself. OQ-14. |
| **status in this build** | **not satisfied on the tax limb.** A consumer-facing price with no statement of whether tax is included, and no statement that further charges may be payable, is the exact omission s. 230 names. Partially mitigated: the `INDICATIVE` badge is unconditional and rendered adjacent to the amount. |

### L-DMCC-SCH20-13 — consumer reviews

| | |
|---|---|
| **instrument** | DMCCA 2024 |
| **provision** | **Sch. 20 para. 13** (banned practices — consumer reviews); s. 225 (banned practices are unfair in all circumstances, with no average-consumer transactional test) |
| **in-force version** | In force 6 April 2025; checked 25 Aug 2026 |
| **what it requires** | Unfair in all circumstances: submitting or commissioning a **fake consumer review** — one that "purports to be, but is not, based on a person's genuine experience"; concealing that a review was **incentivised or commissioned**; publishing reviews in a misleading way, including **"failing to publish, or removing from publication, negative consumer reviews whilst publishing positive ones"** or giving greater prominence to positive ones; **failing to take reasonable and proportionate steps** to prevent the publication of fake, concealed-incentive or false reviews; and offering services to facilitate any of these. |
| **primary source** | https://www.legislation.gov.uk/ukpga/2024/13/schedule/20 |
| **applies to** | consumer only — but the testimonials block appears on the **master** homepage, which mixes both audiences (inventory §5.1), so the consumer regime reaches it. |
| **engaged here because** | Inventory §6.5 — testimonials are the **one exception** to seed content: `components/master/Testimonials.tsx:16` states six are **real public Freelancer reviews**. OQ-20 asks whether the reviewers consented and whether the attributions are accurate. |
| **status in this build** | **cannot tell — and this is the highest-risk single item in the ledger relative to how little the build says about it.** Two distinct exposures: (a) whether the six shown are a **selected** subset with negative reviews omitted — that is the para. 13 prominence limb, and it is a selection decision no gate can see; (b) accuracy of attribution. Consent to be quoted is a separate question (see `L-GDPR-6` — a named reviewer is personal data). |

---

## F. Accessibility

### L-EQA-29 — services: the duty not to discriminate

| | |
|---|---|
| **instrument** | Equality Act 2010 |
| **provision** | **s. 29**, in particular s. 29(7)(a) |
| **in-force version** | As amended; checked 25 Aug 2026 |
| **what it requires** | A person concerned with the provision of a service to the public must not discriminate against, harass or victimise a person requiring the service, including in the terms on which it is provided or by not providing it. **s. 29(7)(a): "A duty to make reasonable adjustments applies to — (a) a service-provider."** |
| **primary source** | https://www.legislation.gov.uk/ukpga/2010/15/section/29 |
| **applies to** | all — service provision to the public, consumer and business alike |
| **engaged here because** | The site is the public-facing service channel for all three divisions (inventory §5.1). |
| **status in this build** | **cannot tell** — a discrimination question, not a codebase one. |

### L-EQA-20 — reasonable adjustments

| | |
|---|---|
| **instrument** | Equality Act 2010 |
| **provision** | **s. 20** (the three requirements) and **Sch. 2** (application to services); **s. 20(7)** (no charging) |
| **in-force version** | As amended; checked 25 Aug 2026 |
| **what it requires** | The three requirements: to take reasonable steps to avoid the substantial disadvantage caused by a provision, criterion or practice; by a physical feature; and to provide an auxiliary aid. **Sch. 2 para. 2(2) makes the services duty anticipatory** — references to a disabled person are to "disabled persons generally", not to a particular customer, so the provider must anticipate needs rather than wait for a request. s. 20(7): the provider is not entitled to require the disabled person to pay the costs of complying. |
| **primary source** | https://www.legislation.gov.uk/ukpga/2010/15/section/20 · https://www.legislation.gov.uk/ukpga/2010/15/schedule/2 |
| **applies to** | all |
| **engaged here because** | Inventory §6.4 — automated gates cover axe over 14 routes × 3 viewports × 2 consent phases, contrast, headings, responsive/target size, theme, and two-axis Lighthouse. |
| **status in this build** | **partially satisfied, with two named gaps.** (1) **"The screen-reader pass has never happened"** — `05-HANDOVER.md:79` is explicit that the gates "do not cover announcement, and no lab check does"; no AT testing of any kind (magnifier, voice control, switch) is referenced anywhere. OQ-19. (2) **Four of the five legal routes are not audited** — `/legal/cookies`, `/legal/terms`, `/legal/client-terms` and `/legal/accessibility` are absent from `check-axe.mjs:48-74`; only `/legal/privacy` is covered. OQ-18. |

### L-WCAG-22 — what legal status WCAG actually has here

| | |
|---|---|
| **instrument** | Web Content Accessibility Guidelines (WCAG) 2.2 — **W3C Recommendation** |
| **provision** | Conformance Level AA (all Level A and Level AA success criteria satisfied) |
| **in-force version** | W3C Recommendation; this version 12 December 2024 (`REC-WCAG22-20241212`), superseding the 5 October 2023 Recommendation; checked 25 Aug 2026 |
| **what it requires** | Level AA conformance requires that the page satisfy all Level A and Level AA success criteria, or that a conforming alternate version is provided. |
| **primary source** | https://www.w3.org/TR/WCAG22/ |
| **applies to** | all |
| **engaged here because** | `CLAUDE.md` states "WCAG 2.2 AA is the floor"; `ACCESSIBILITY-STATEMENT.md` is one of the five published legal routes (inventory §5.2). |
| **status in this build** | **This entry exists to state the status precisely, because it is easy to get wrong in a public statement.** **WCAG 2.2 is not a statutory standard for a private-sector service in the UK.** It is a W3C Recommendation — a technical specification, not law. The Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 bind WCAG-level conformance to public sector bodies only, and **Gridsmith Ltd is not one**. The actual legal duty on this site is `L-EQA-20`: an **anticipatory** duty to take reasonable steps to avoid substantial disadvantage. WCAG 2.2 AA is the recognised benchmark by which "reasonable steps" is conventionally evidenced — a voluntary commitment whose value is evidential. It follows that (a) the accessibility statement should describe WCAG 2.2 AA as the standard the company **has adopted**, not one it is **required** to meet; and (b) **a claim of AA conformance made without the screen-reader pass having happened is a statement about the service under `L-CRA-50` and, for consumers, potentially `L-DMCC-230`'s sibling s. 226 misleading-action provision.** Automated tooling does not establish AA. |

---

## G. VAT display — the divergence

### L-VAT-CONSUMER — prices shown to consumers

| | |
|---|---|
| **instrument** | DMCCA 2024 s. 230; SI 2013/3134 reg. 13 and Sch. 2; SI 2002/2013 reg. 6(2) |
| **provision** | See `L-DMCC-230`, `L-CCR-13`, `L-ECOM-6` |
| **in-force version** | DMCCA Part 4 in force 6 Apr 2025; others as amended; checked 25 Aug 2026 |
| **what it requires** | The price presented to a consumer must be **the total price inclusive of taxes**, or state how it will be calculated where it cannot be calculated in advance, with equal prominence for the calculation information. |
| **primary source** | https://www.legislation.gov.uk/ukpga/2024/13/section/230 · https://www.legislation.gov.uk/uksi/2013/3134/contents |
| **applies to** | **consumer only — Press** |
| **engaged here because** | Inventory §5.3 — `/press` is consumer-facing and renders prices through the same `Price.tsx` as the B2B divisions, with no net/gross field in `pricingBlock` (`objects.ts:81-95`). |
| **status in this build** | **not satisfied.** `M-P2-3` is NOT BUILT (§7). |

### L-VAT-B2B — prices shown to business customers

| | |
|---|---|
| **instrument** | SI 2002/2013 reg. 6(2); Value Added Tax Act 1994 and the VAT Regulations 1995 for invoicing |
| **provision** | **reg. 6(2)** is the operative display rule |
| **in-force version** | As made and amended; checked 25 Aug 2026 |
| **what it requires** | reg. 6(2): prices must be indicated **clearly and unambiguously** and **must in particular indicate whether they are inclusive of tax and delivery costs.** There is **no requirement that a B2B price be VAT-inclusive** — the requirement is that the treatment be **stated**. A tax-exclusive price is permitted; a price with no stated treatment is not. |
| **primary source** | https://www.legislation.gov.uk/uksi/2002/2013/regulation/6/made |
| **applies to** | **business — Design and Digital.** Note reg. 6 itself is not consumer-limited, so it also backstops the Press position. |
| **engaged here because** | Inventory §5.3 — no VAT treatment is stated on any price on any division landing page. |
| **status in this build** | **not satisfied.** **This is the divergence in one line: Press prices must be *inclusive*; Design and Digital prices need only be *labelled*. Both are currently *unlabelled*, so both fail — but they fail differently and the fix is not the same clause.** Collapsing to "all prices exc. VAT" would fix Design and Digital and break Press. |

---

## H. Website terms

### L-ECOM-9-11 — contract formation by electronic means

| | |
|---|---|
| **instrument** | SI 2002/2013 |
| **provision** | regs. 9, 11, 12 |
| **in-force version** | As made; checked 25 Aug 2026 |
| **what it requires** | Where a contract is to be concluded by electronic means, the service provider must, before the order is placed, state the technical steps to conclude the contract, whether the concluded contract will be filed and accessible, the technical means for identifying and correcting input errors, and the languages offered; and must acknowledge receipt of the order without undue delay. **regs. 9(1) and 11(1)(b) may be excluded by agreement where the parties are not consumers.** |
| **primary source** | https://www.legislation.gov.uk/uksi/2002/2013/regulation/9/made |
| **applies to** | **This is a divergence**: mandatory for consumers (Press), disapplicable by agreement between businesses (Design, Digital). |
| **engaged here because** | Inventory §7 — the estimator is NOT BUILT, so no contract is concluded on the site today. |
| **status in this build** | **not engaged today.** Recorded because the estimator would engage it. |

---

## COULD NOT VERIFY

**CNV-1 — ICO statutory guidance positions.** The task permits ICO guidance as a primary source "where
it is the regulator's published position". No ICO guidance page was fetched during this pass, so **no
entry in this ledger rests on ICO guidance** — every entry above cites statute or the W3C
Recommendation. Consequence: the ledger does not record the ICO's post-DUAA position on the new PECR
Sch. A1 para. 5 statistical-purposes exception, which is the single point where a regulator view would
most change what `COOKIE-POLICY.md` should say. **Recommend Pass 3 fetch the ICO's current cookies
guidance before drafting the cookie policy.**

**CNV-2 — Art. 30(4) UK GDPR.** `legislation.gov.uk` records an **outstanding, unapplied** amendment to
Art. 30(4) from SI 2026/386 (the DUAA consequential-amendments regulations). The consolidated text does
not yet show it. `L-GDPR-30` therefore cites Art. 30(1) and 30(5), which are consolidated and were read,
and does not rely on 30(4).

**CNV-3 — PECR reg. 23 (identity and address in marketing mail).** Referenced inside `L-PECR-22` as the
provision that still binds for corporate subscribers, but **the text of reg. 23 was not retrieved** — the
fetch returned reg. 22 only. Pass 3 must read
`https://www.legislation.gov.uk/uksi/2003/2426/regulation/23` before drafting any marketing clause.

**CNV-4 — Price Marking Order 2004.** Considered as a candidate primary source for consumer VAT display
and **not cited**, because it is directed at products offered to consumers and its application to
professional services of the kind Press sells was not established from primary text within this pass.
`L-VAT-CONSUMER` rests on DMCCA s. 230 and CCRs Sch. 2 instead, both of which were read.

**CNV-5 — VAT invoicing detail.** `L-VAT-B2B` cites VATA 1994 and the VAT Regulations 1995 by name for
invoicing but **the specific regulation (reg. 14, invoice content) was not fetched**. The display
obligation in that entry rests entirely on the e-commerce reg. 6(2) text, which was read. Any invoicing
clause in the drafts needs its own citation.

**CNV-6 — DMCCA s. 226/227 text.** Referenced in `L-DMCC-230` and `L-WCAG-22` as the misleading
actions/omissions provisions. Their commencement (6 Apr 2025) is verified and s. 230 was read in full,
but **ss. 226 and 227 were not individually fetched.** Cite them only after reading.

**CNV-7 — Companies Act 2006 s. 82 text.** The empowering section is named in `L-CA-82` but the
obligation cited and read is in SI 2015/17 regs. 24–25. s. 82 itself was not fetched.

---

## Engaged obligations with no clause anywhere in the build

These are engaged by the facts in `01-FACTUAL-INVENTORY.md` and have **no implementation** — distinct
from "the drafts may not mention it", which Pass 3 determines. Ordered by how badly the gap is likely to
be missing from the drafts.

1. **`L-DPA-164A` — the direct-complaints duty.** In force **19 June 2026**, after every draft's last
   revision. Requires an electronic complaint form, a 30-day acknowledgement, and a response duty.
   **Inventory §5.1 lists every route: there is no complaints route.** Also requires a corresponding
   line in the privacy notice under the amended Art. 13(2). **Most likely to be entirely absent.**

2. **`L-GDPR-44A` — Chapter V as restructured.** Arts. 44 and 45 were **omitted on 5 Feb 2026**. Any
   draft clause referring to "adequacy decisions" or Art. 45 cites repealed text, and the applicable
   test is now **Art. 45B's "data protection test"**. Compounded by four unestablished processor regions
   (OQ-1 to OQ-4).

3. **`L-ECOM-6` reg. 6(1)(g) — the fabricated VAT number.** `[SEED] GB123456789` renders in the footer
   of **every page of the running site**. This is not a missing disclosure; it is a false one, and it is
   the single most concrete defect in the ledger.

4. **`L-GDPR-5-1e` — retention.** No period, no job, no clause. A privacy notice cannot satisfy
   Art. 13(2)(a) without a period or criteria, and there is nothing to state. OQ-9.

5. **`L-VAT-CONSUMER` / `L-VAT-B2B` / `L-ECOM-6` reg. 6(2) — VAT treatment on prices.** Every price on
   every division fails, for two different reasons, needing two different fixes. `M-P2-3` NOT BUILT.

6. **`L-CRA-57` — one `Client Terms` route for two audiences.** A B2B liability cap applied to a Press
   author is void to that extent. This is a routing and instrument-structure defect, not a drafting one:
   **no additional clause can fix it while there is one slug.** OQ-13.

7. **`L-PECR-CONSENT-EVIDENCE` — no consent audit trail.** `consent_events` does not exist. Currently
   mitigated only by the fact that nothing consent-gated collects anything (§1.3); the mitigation
   evaporates the day GA4 or PostHog is initialised. OQ-11.

8. **`L-GDPR-28` / `L-GDPR-13` — Slack as an undocumented processor.** A live code path transmits an
   enquirer's **full name** to Slack the moment `SLACK_LEADS_WEBHOOK` is set. It appears in no
   documentation. OQ-6.

9. **`L-GDPR-30` — no ROPA.** The Art. 30(5) exemption probably does not apply, because lead capture is
   continuous rather than occasional.

10. **`L-DMCC-SCH20-13` — testimonial selection.** Six real reviews are shown. Whether negative ones
    were omitted is a decision no gate can observe and no clause can cure. OQ-20.

11. **`L-WCAG-22` / `L-EQA-20` — the accessibility statement's evidential base.** The screen-reader pass
    has never happened, and four of the five legal routes are outside the axe gate. Any statement of AA
    conformance is currently unearned, and saying so is itself a `L-CRA-50` statement.

---

*End of ledger. Pass 3 cites these ids inline in the drafts.*
