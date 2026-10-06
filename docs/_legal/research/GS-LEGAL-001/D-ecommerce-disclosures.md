# GS-LEGAL-001 — D. E-commerce and company disclosures

Agent D. Review date and retrieval date for every source: **6 October 2026**. This is a review against
current UK legislation and official guidance. It is not legal advice. It does not say the site or the
documents are "compliant", "approved" or "enforceable". Wherever something is uncertain, this
document says so.

Scope: what UK law requires Gridsmith Ltd's website and its electronic contracting to disclose,
compared with (1) the **rendered staging site**, fetched by GET only on 6 Oct 2026 from
`https://mediumaquamarine-wallaby-594070.hostingersite.com` (response header
`x-gridsmith-sanity-dataset: production`, `x-robots-tag: noindex`), (2) the source
(`components/chrome/Footer.tsx`, `lib/company/companyDetails.ts`, `scripts/seed-company-details.mjs`)
and (3) the legal drafts in `docs/_legal/` and the served legal text in `scripts/seed-legal.mjs`.
No form was submitted. No production system was touched.

---

## 1. What the site actually shows (rendered, 6 Oct 2026)

| Route (HTTP) | Identity and contact text found |
|---|---|
| Footer, on every 200 route (`/`, `/about`, `/contact`, `/press/contact`, `/design`, `/design/services/brand-identity-systems`) | Brand block: "Gridsmith — One UK company. Design, Digital and Press are its trading divisions." · `contact@gridsmith.uk` (a `mailto:` link) · "WhatsApp or text +44 7405 448534" (a `wa.me` link, no `tel:`) · "We typically respond within 48 hours." Statutory line: **"Gridsmith Ltd · registered in England · company number 17050842 · registered office 30 Briarfield Road, Farnworth, Bolton, BL4 0HD"**. Legal links: Terms, Privacy, Cookies, Accessibility. JSON-LD `Organization` (legalName, identifier 17050842, email, telephone, PostalAddress, addressCountry GB). **No VAT line.** |
| `/` (200) | Body: "Gridsmith Design, Gridsmith Digital and Gridsmith Press are trading divisions of Gridsmith Ltd, registered in England as company number 17050842. They are not separate companies." |
| `/about` (200) | "Gridsmith Ltd is registered in England, company number 17050842. The full statutory details, including the registered office, are in the footer of every page." Also email, WhatsApp and text links, and social links. |
| `/contact` (200) | Form (JavaScript only); "You can email contact@gridsmith.uk instead"; "Or reach us directly": email, WhatsApp or text. **No privacy-notice link next to the form.** The only privacy link is in the footer. |
| `/press/contact` (200) | Four-step form; "What we do with what you send is in the privacy notice" links to `/legal/privacy`, **which returns 404**. |
| `/legal/terms`, `/legal/privacy`, `/legal/cookies`, `/legal/accessibility`, `/legal/business-client-terms`, `/legal/consumer-client-terms`, `/legal/client-terms` | **All return 404** (the generic 404 page, byte-identical to `/nope-xyz`). They are gated by `GS-O003`. On staging, every footer legal link is a dead link. |
| `/contact/thank-you` | HTTP 500 from the host's own error page. This is noted only. It is probably a client-side-only route on the static host and was not investigated. |

Source facts: `Footer.tsx` renders `legalName`, `placeOfRegistration`, `companyNumber`,
`registeredOffice` and an optional `tradingAddress`, which is empty. Everything comes from the
`companyDetails` singleton, and the build fails if the singleton is missing. `companyDetails.ts`
and `seed-company-details.mjs` state that **"Gridsmith is not registered" for VAT**, and there is no
`vatNumber` field. The seed sets `placeOfRegistration: 'England'` and gives the Companies House
register's address line as the reason. Public register (GET, 6 Oct 2026,
`find-and-update.company-information.service.gov.uk/company/17050842`): **GRIDSMITH LTD**, Private
limited Company, Active, incorporated 24 Feb 2026, registered office "30 Briarfield Road, Farnworth,
Bolton, England, BL4 0HD". The overview page does not show the registration jurisdiction.

---

## 2. Sources verified at source (all retrieved 6 Oct 2026)

| Ref | Instrument / provision | URL | Type | Status found |
|---|---|---|---|---|
| S1 | SI 2015/17 regs 20–28 | https://www.legislation.gov.uk/uksi/2015/17/regulation/20 … /28 | primary | In force. "No known outstanding effects" on the contents page. Modification notes on regs 21, 25, 27 (SI 2016/423; SI 2024/233 temporary restriction for rectified registered-office addresses) do not affect Gridsmith. |
| S2 | Companies Act 2006 ss. 82, 84, 1192, 1200–1202 | https://www.legislation.gov.uk/ukpga/2006/46/section/82 (and /84, /1192, /1200, /1201, /1202) | primary | In force |
| S3 | Company, LLP and Business (Names and Trading Disclosures) Regs 2014, SI 2014/3140 Sch. 1 (sensitive words) | https://www.legislation.gov.uk/uksi/2014/3140/schedule/1 | primary | Checked only for "Design", "Digital", "Press": **none are listed** |
| S4 | Electronic Commerce (EC Directive) Regs 2002, SI 2002/2013 regs 2, 6, 7, 8, 9, 11, 12, 13, 15 | https://www.legislation.gov.uk/uksi/2002/2013/regulation/6 (and others) | primary | In force. "No known outstanding effects" |
| S5 | Provision of Services Regs 2009, SI 2009/2999 regs 2, 7–13 | https://www.legislation.gov.uk/uksi/2009/2999/regulation/7 … /13 | primary | **In force, amended. Outstanding (not yet applied) changes from SI 2026/435, in force 1 Oct 2026** — see S6 |
| S6 | Provision of Services (Amendment and Transitional Provision) Regs 2026, SI 2026/435 | https://www.legislation.gov.uk/uksi/2026/435/made | primary | Made 15 Apr 2026, **in force 1 Oct 2026**. Replaces the definitions of "provider" and "recipient" (reg. 3) and omits PSR reg. 13 (reg. 5). Leaves the regs 7–12 information and complaints duties unchanged |
| S7 | ADR for Consumer Disputes (Competent Authorities and Information) Regs 2015, SI 2015/542 | https://www.legislation.gov.uk/uksi/2015/542/regulation/19 | primary | **Revoked 6 Apr 2026** by DMCCA 2024 s. 339(1), Sch. 27 para. 10; SI 2026/284 |
| S8 | DMCCA 2024 s. 308 (duty of trader to notify consumer of ADR arrangements), s. 310(8) | https://www.legislation.gov.uk/ukpga/2024/13/part/4/chapter/4 | primary | **In force 6 Apr 2026** (SI 2026/284) |
| S9 | Regulation (EU) 524/2013 (ODR), Art. 14 | https://www.legislation.gov.uk/eur/2013/524/article/14 | primary (assimilated) | **Revoked 31 Dec 2020** by SI 2018/1326 reg. 10 |
| S10 | Consumer Contracts Regs 2013, SI 2013/3134 Sch. 2; reg. 16; reg. 5 ("durable medium") | https://www.legislation.gov.uk/uksi/2013/3134/schedule/2 · /regulation/16 · /regulation/5 | primary | In force |
| S11 | Finance Act 2008 Sch. 41 para. 2 (unauthorised issue of an invoice showing VAT) | https://www.legislation.gov.uk/ukpga/2008/9/schedule/41/paragraph/2 | primary | In force (VATA 1994 s. 67, the former provision, is omitted) |
| G1 | GOV.UK "Running a limited company: signs, stationery and promotional material" | https://www.gov.uk/running-a-limited-company/signs-stationery-and-promotional-material | official guidance | Current |
| G2 | GOV.UK "Online and distance selling for businesses" (both pages) | https://www.gov.uk/online-and-distance-selling-for-businesses · /online-selling | official guidance | Current |
| G3 | GOV.UK "Register for VAT — when to register"; "How VAT works"; "Charge, reclaim and record VAT" | https://www.gov.uk/vat-registration/when-to-register · https://www.gov.uk/how-vat-works · https://www.gov.uk/charge-reclaim-record-vat | official guidance | Current. Registration threshold £90,000 taxable turnover; "You must register for VAT to start charging VAT" |

Not verified at source, and marked **UNVERIFIED** wherever relied on:
- Directive 2000/31/EC recital 18, which says an information society service covers services not remunerated by their recipients, such as online information or commercial communications.
- CJEU case law on whether a hyperlink to a website is a "durable medium" (*Content Services*, C-49/11).
- The Companies House "jurisdiction" field for 17050842. The public overview does not display it.

---

## 3. Requirement-by-requirement table

Key: **C** = compliant on the rendered evidence · **G** = gap · **P** = partial / judgement ·
**N/E** = not engaged · **OCR** = OWNER CONFIRMATION REQUIRED.

### 3.1 Companies Act trading disclosures (SI 2015/17, made under CA 2006 s. 82)

| # | Authority | Requirement (paraphrased; short quotes) | Current rendered state | Result | Fix | Confidence | Owner? |
|---|---|---|---|---|---|---|---|
| D1 | SI 2015/17 reg. 24(2) | "Every company shall disclose its registered name on its websites." | "Gridsmith Ltd" in the footer statutory line on every 200 route, plus `/` and `/about` | **C** | None. The register's capitalisation (GRIDSMITH LTD) does not matter. | high | no |
| D2 | reg. 25(1)(c), (2)(a) | Part of the UK in which the company is registered, on its websites | "registered in England" | **P** | G1 tells companies to state where the company is registered as "England and Wales, Scotland or Northern Ireland". The registers are kept per jurisdiction, and the seed's own reason for "England" is the *address* line of the register entry, not the jurisdiction. "England" is unlikely to mislead anyone, but **"registered in England and Wales"** matches the guidance exactly. One content edit to `placeOfRegistration`, no code change. Owner to confirm against the certificate of incorporation. | medium | **OCR** (low stakes) |
| D3 | reg. 25(2)(b) | Registered number | "company number 17050842", matching the register | **C** | — | high | no |
| D4 | reg. 25(2)(c) | Registered office address | "30 Briarfield Road, Farnworth, Bolton, BL4 0HD", matching the register (which adds "England") | **C** | — | high | no |
| D5 | reg. 25(2)(d)–(f), 25(3) | "Limited" exemption, CIC, investment company; share capital, if stated, must be paid up | None apply. No share capital is stated. | **N/E** | Keep share capital off the site, or state paid-up capital only | high | no |
| D6 | reg. 20 | Must be "in characters that can be read with the naked eye" | Footer text, legible. The statutory block is not collapsed. | **C** | Keep it uncollapsed (the source comment already says so) | high | no |
| D7 | reg. 24(1)(a),(b),(e),(g); reg. 25(1)(a),(b) | Registered name on business letters, order forms, invoices, demands for payment and "all other forms of its business correspondence and documentation". Full reg. 25 particulars on business letters and **order forms** | **Not visible from the site.** Depends on the owner's email signature and the quotation/proposal/SOW, invoice and receipt templates | **OCR** | Put on every quote, SOW, proposal, change order, invoice and receipt, and in the email signature used for contracting: "Gridsmith Ltd, a private limited company registered in England and Wales, company number 17050842, registered office 30 Briarfield Road, Farnworth, Bolton, BL4 0HD". A quote the client signs or accepts is very likely an "order form". Where a document trades as "Gridsmith Design/Digital/Press", the registered name must still appear. | high (rule) / unknown (state) | **OCR** |
| D8 | reg. 26 | If a business letter names a director (other than in the text or as a signatory), **every** director must be named | Not visible | **OCR** | Either name no director in letterheads or footers, or name all of them | high | **OCR** |
| D9 | reg. 27 | Registered office, inspection place and records kept there, given on written request within **5 working days** | No process recorded | **G** (process) | Internal note: answer such requests from `contact@gridsmith.uk` within 5 working days | high | no |
| D10 | reg. 21 (and reg. 22(3)) | Registered name displayed **at the registered office** (reg. 21 has no home exception in its text). The home exception in reg. 22(3) covers *other* locations. G1 nonetheless says "If you're running your business from home, you do not need to display a sign there." | Off-site; not observable | **OCR** | Conservative and cheap: a small, permanently visible name label at 30 Briarfield Road. Otherwise rely on G1 and record the decision. This is a physical-sign duty, not a website duty. | medium (statute and guidance differ) | **OCR** |
| D11 | reg. 28; CA 2006 s. 84 | Breach of regs 20–27 without reasonable excuse is an offence by the company and every officer in default: level 3 fine, plus a daily default fine | — | context | — | high | no |

### 3.2 Trading names "Gridsmith Design / Digital / Press" (CA 2006 Part 41)

| # | Authority | Finding | Confidence | Owner? |
|---|---|---|---|---|
| D12 | CA 2006 s. 1200(1) | Part 41 **Chapter 2** (ss. 1200–1206, which require the business-name user's name and an address for service on business letters, orders, invoices and demands, and on request (ss. 1201–1202)) **"applies to an individual or partnership carrying on business ... under a business name."** **It does not apply to a company.** For a company, the equivalent duty is SI 2015/17 reg. 24(1), which puts the registered name on all documents. So the ledger is right not to enter ss. 1202–1206, but for a different reason from the one it gives (`02-CITATION-LEDGER.md` L-TDR-24 says it is "because the registered name is disclosed alongside them"). | high | no |
| D13 | CA 2006 s. 1192(1); SI 2014/3140 Sch. 1 | Part 41 **Chapter 1** (sensitive words; misleading names) applies to "any person", companies included. "Design", "Digital" and "Press" do not appear in the sensitive-words schedule (S3). No approval is needed. | high (for those three words only) | no |
| D14 | SI 2015/17 reg. 24(1)(g) | Every document issued under a studio name must still carry "Gridsmith Ltd". The site does this: footer on every page, and the `/` sentence "trading divisions of Gridsmith Ltd ... They are not separate companies." This is good practice and avoids any suggestion of separate entities. | high | no |

### 3.3 Electronic Commerce Regulations 2002 (SI 2002/2013)

Applicability: reg. 6 applies to "a person providing an information society service". A business
website that promotes paid services is generally treated as one, even though visitors pay nothing
(Directive recital 18, **UNVERIFIED**). The conservative assumption, also taken by the existing
ledger, is that reg. 6 applies.

| # | Authority | Requirement | Current state | Result | Fix | Conf. | Owner? |
|---|---|---|---|---|---|---|---|
| E1 | reg. 6(1)(a) | Name of the provider, "easily, directly and permanently accessible" | "Gridsmith Ltd" in the footer on every page | **C** | — | high | no |
| E2 | reg. 6(1)(b) | Geographic address at which the provider is established | Registered office in the footer; `tradingAddress` empty (same premises) | **C**, provided the owner is in fact established there | If work is carried on from a different fixed address, set `tradingAddress` | medium | **OCR** (confirm establishment address = registered office) |
| E3 | reg. 6(1)(c) | Details "including his electronic mail address" enabling rapid, direct and effective contact | `contact@gridsmith.uk` on every page; WhatsApp/SMS number | **C** | — | high | no |
| E4 | reg. 6(1)(d) | Details of the trade register and the registration number | "registered in England · company number 17050842" | **P** (probably sufficient) | Name the register: "registered at Companies House in England and Wales, company number 17050842" | medium | no |
| E5 | reg. 6(1)(e),(f) | Supervisory authority; regulated profession | None. No authorisation scheme or regulated profession applies to the services described. Technical Design is expressly not engineering sign-off (`GS-X002`). | **N/E** | If a regulated activity is ever added, revisit | medium | no |
| E6 | reg. 6(1)(g) | VAT number "where the service provider undertakes an activity that is subject to value added tax" | No VAT number shown | **C only if not VAT-registered — OCR** | See §6 | high (rule) | **OCR** |
| E7 | reg. 6(2) | Where prices are referred to: clear, and stating whether they include tax and delivery | No prices on the site (`GS-D002`). **But** the website terms (served text, `seed-legal.mjs` l.306; `WEBSITE-TERMS.md` l.43, 47) say "A price shown on this website is the amount charged..." and "the prices published on this website would be updated". That wording assumes prices the site no longer publishes. | **N/E** for the site; **G** (inaccurate wording) in the website terms | Reword: "This website does not publish prices. Every engagement is quoted individually; the quotation states the total price and its tax treatment." | high | no (wording follows `GS-D002`) |
| E8 | reg. 7 | Commercial communications must be identifiable as such and identify the sender; promotional offers and competitions clearly identified | The site is plainly Gridsmith's own promotion; no offers or competitions; no marketing email exists (ledger L-PECR) | **C / N/E** | Read reg. 7 (and reg. 8, unsolicited email) before the first marketing email or promotion | high | no |
| E9 | reg. 9(1), (2) | Before an order is placed by electronic means: technical steps, whether the contract is filed and accessible, error correction, languages, codes of conduct | **Not engaged as described.** Forms are enquiries, not orders. Contracts are concluded by quote → acceptance, by email. **reg. 9(4)**: paras (1) and (2) "shall not apply to contracts concluded exclusively by exchange of electronic mail or by equivalent individual communications". | **N/E** — **conditional, see §4** | Keep acceptance by email or individual message, or provide the reg. 9(1) information if not (§4) | high (text) / medium (application) | **OCR** (acceptance method) |
| E10 | **reg. 9(3)** | "Where the service provider provides terms and conditions applicable to the contract to the recipient, the service provider shall make them available to him in a way that allows him to store and reproduce them." **Not removed by the email carve-out in reg. 9(4), and not excludable between businesses** | Legal pages **404 on staging**. Nothing yet shows how terms reach a client. | **G** (must be live and deliverable before production) | See §5: send the exact versioned terms as a PDF attachment or a downloadable PDF with the quote, and keep a print-friendly page | high | no |
| E11 | reg. 11(1) | Order placed "through technological means": acknowledge receipt without undue delay by electronic means; error-correction means. **reg. 11(3)**: not applicable to contracts concluded exclusively by email or equivalent individual communications | Same as E9 | **N/E** (conditional) | Same as E9 | medium | **OCR** |
| E12 | regs 13, 15 | Breach of regs 6, 7, 8, 9(1) and 11(1)(a) is actionable as breach of statutory duty. Failure on reg. 11(1)(b) error-correction lets the customer rescind | — | context | — | high | no |

### 3.4 Provision of Services Regulations 2009 (SI 2009/2999), as amended to 1 Oct 2026

Status: **still in force.** EU-exit amendments (SI 2018/1329) and SI 2025/82 have been applied.
**SI 2026/435 came into force on 1 Oct 2026** (five days before this review). Legislation.gov.uk
lists its effects as "not yet" applied to the revised text. For Part 2 it (i) redefines **"provider"**
as a person who provides or offers to provide a service *in the UK*, (ii) redefines **"recipient"**
as "a person in the United Kingdom who, for professional or non-professional purposes, uses, or
wishes to use, the service", and (iii) omits reg. 13 ("Application of this Part"). Regs 7–12 are
textually unchanged. **Consequence:** the duties below run to UK recipients, business and consumer
alike. On the new definition they probably do not run to recipients outside the UK. Giving overseas
clients the same information is harmless and is recommended.

| # | Authority | Requirement | Current state | Result | Fix | Conf. | Owner? |
|---|---|---|---|---|---|---|---|
| P1 | reg. 7(1),(2)(a) | Contact details to which recipients can send a complaint or request for information, including a postal address, fax **or** email | Email on every page; registered office | **C** | — | high | no |
| P2 | **reg. 7(2)(b)** | Contact details "must include in particular ... **a telephone number**" | +44 7405 448534 is published, but labelled "WhatsApp or text". `companyDetails.ts` says it is "not a voice-call channel", and there is no `tel:` link by owner decision `GS-R001-R` | **P / OCR** | The number is published, so the literal requirement is arguably met. But a number declared not to take calls fits poorly with a duty whose purpose is contact for complaints. Options: **(a)** keep as is, accepting the residual risk; **(b, conservative)** let the number accept calls or voicemail, with no hours and no response promise, and change the label to e.g. "Phone, WhatsApp or text" (a `tel:` link is not needed); **(c)** a separate voicemail-only number. Recommend (b). | medium | **OCR** |
| P3 | reg. 7(2)(c),(3) | Where the provider has an "official address" (one required by law for receiving notices — for a company, the registered office), that address | In the footer | **C** | — | high | no |
| P4 | reg. 8(1)(a),(c),(d) | Name; geographic address and rapid direct contact, including electronic; register and number | Footer | **C** (D2/E4 wording caveats) | — | high | no |
| P5 | **reg. 8(1)(b)** | "the provider's legal status and form" | Only implied by "Ltd" and "company number" | **P** | Add "a private limited company" to the statutory line, e.g. "Gridsmith Ltd, a private limited company registered in England and Wales, company number 17050842, registered office ...". This also covers SI 2015/17 and e-commerce reg. 6 in one sentence. | medium | no |
| P6 | reg. 8(1)(g) | VAT number where the activity is subject to VAT | None | see §6 | — | high | **OCR** |
| P7 | reg. 8(1)(i),(j) | The general terms and conditions used, and the existence of governing-law and jurisdiction terms. Under **reg. 11(b)** this must be available "in good time before the conclusion of the contract" | Terms exist in drafts (MSA §21; consumer §17) but **404 on staging** | **G** until live | The terms pages must be live in production **and** the quote must link to or attach the applicable terms before acceptance (§4–5) | high | no |
| P8 | reg. 8(1)(k) | Any after-sales guarantee not imposed by law | Drafts give no commercial guarantee | **N/E** | If a warranty period is offered in a Scope, state it there | medium | no |
| P9 | reg. 8(1)(l); reg. 9(1)(a) | Price, if pre-determined; otherwise **on request** the price, or the method of calculation, or "a sufficiently detailed estimate" | No public prices; every engagement is quoted | **C** (the quote is the reg. 9 response) | Quotes should be specific enough for the client to check the calculation | high | no |
| P10 | reg. 8(1)(m) | Main features of the service | Service pages; Scope | **C** | — | high | no |
| P11 | reg. 8(1)(n) | PI insurance information **only** where the provider "is subject to a requirement to hold" it | No legal requirement identified for these services. Consistent with `GS-O005` (no PI; insured status never advertised) | **N/E** | Do not mention insurance status | medium | no |
| P12 | reg. 9(1)(c),(d); reg. 10 | On request: linked activities and conflict measures; codes of conduct. A dispute-resolution procedure only if subject to a code or membership providing one | No code or trade-association membership known | **N/E** (on request) | If Gridsmith joins a trade body with an ADR scheme, disclose it | medium | **OCR** (confirm no memberships) |
| P13 | **reg. 12** | Respond to complaints "as quickly as possible" and use "best efforts to find a satisfactory solution" (except vexatious complaints). **Applies to business recipients as well as consumers** | Consumer terms §13 has a complaints process (acknowledge, aiming for 5 working days). **The MSA (business) has no complaints clause**, and there is no public complaints page | **P** | Add a short complaints paragraph to the MSA (and a one-line "Complaints: email contact@gridsmith.uk with 'Complaint' in the subject" on `/contact` or the legal hub). Internally, treat reg. 12 as the standard. | high | no |

### 3.5 Consumer ADR and ODR

| # | Authority | Finding | Conf. | Owner? |
|---|---|---|---|---|
| A1 | SI 2015/542 (incl. former reg. 19) | **Revoked 6 Apr 2026** (DMCCA 2024 Sch. 27 para. 10; SI 2026/284). The former duties — to name an ADR entity on the website where obliged to use one, and to tell a consumer at the end of an unresolved complaint whether the trader would use ADR — **no longer exist in that form**. | high | no |
| A2 | **DMCCA 2024 s. 308** (in force 6 Apr 2026; s. 310(8) excludes complaints received before then) | When a trader responds to a consumer's complaint about a consumer contract, it must, "when communicating the outcome", inform the consumer about any "ADR or other arrangement" available **by virtue of an obligation of the trader to participate** imposed by legislation, the consumer contract, or other contractual arrangements. Gridsmith has no such obligation on the facts supplied, so **nothing is required today**. If Gridsmith ever joins an ADR scheme, or promises ADR in its terms, the outcome letter must name it. s. 308(6) keeps other information duties. | high (text) / medium (no obligation — depends on facts) | **OCR** (confirm no ADR scheme membership) |
| A3 | Regulation (EU) 524/2013 Art. 14 | ODR-platform link duty **revoked 31 Dec 2020** (SI 2018/1326). **Do not add an ODR link.** It would point to an EU platform that is not part of UK law. | high | no |
| A4 | SI 2013/3134 Sch. 2(k), (x) | Pre-contract information for consumer distance contracts includes "where applicable, the trader's complaint handling policy" and "where applicable" any out-of-court redress mechanism "to which the trader is subject". The complaints policy exists (consumer terms §13). No ADR mechanism applies, so (x) is not applicable. Coordinate with the consumer workstream. | medium | no |

### 3.6 Consumer Contracts Regulations 2013: identity and address only (the consumer review covers the rest)

| # | Authority | Requirement | State | Result / fix | Conf. |
|---|---|---|---|---|---|
| C1 | Sch. 2(b),(c),(e) | Trader identity (e.g. trading name); geographic address; "where available" telephone, fax, email; a complaints address if different | The website has all of them, but **the duty attaches to the pre-contract information given before the consumer is bound** (regs 10/13 — consumer review) | Put the full identity block (D7 wording) and phone and email in every consumer quote or proposal, together with the consumer terms. On "where available" telephone, see P2. | medium |
| C2 | reg. 16 | Distance contract: confirmation **on a durable medium** before performance begins. "Durable medium" (reg. 5) is "paper or email, or any other medium that ... allows information to be addressed personally to the recipient" and allows unchanged reproduction | Not observable | **A link to a public web page is not personally addressed. Send the confirmation and terms by email (body or PDF attachment).** (The CJEU *Content Services* line is consistent: **UNVERIFIED**.) | high (definition) |

---

## 4. Is "quote → acceptance → payment" an electronic order process?

**Conclusion (medium-high confidence): as the brief describes it, Gridsmith does not run an
electronic order process of the kind regs 9(1), 9(2) and 11 regulate. Reg. 9(3) still applies, as
do the general information duties (e-commerce reg. 6; PSR regs 7–8, 11; CCR for consumers).**

1. The website forms are **enquiries**. They carry no price, terms or acceptance, and a submission
   creates no contract (consumer terms §: "A contract is formed when we send you a written order
   confirmation, accepted quotation or agreed scope..."). So no "order" is placed on the site.
2. The contract is concluded when the client accepts a written quotation, Scope or SOW, normally by
   reply email. **regs 9(4) and 11(3)** remove regs 9(1), 9(2) and 11(1) for "contracts concluded
   **exclusively** by exchange of electronic mail or by equivalent individual communications". This
   carve-out works for consumers as well as businesses. The agreement-to-exclude route applies only
   to non-consumers.
3. **The carve-out depends on the acceptance method.** It may stop applying if acceptance happens
   through a **click-to-accept proposal portal** (e.g. an "Accept proposal" button in proposal
   software), **an e-signature platform workflow**, or **an online checkout or payment link where
   paying is the acceptance**. Whether e-signature counts as an "equivalent individual communication"
   is not settled in the texts read (**UNVERIFIED**). A web checkout plainly is not one.
   **OWNER CONFIRMATION REQUIRED — how does the client accept?**
   - **Option A (recommended, conservative): acceptance by email reply**, or a signed PDF returned by email. Regs 9(1)/11 stay disengaged. Nothing more is needed under them.
   - **Option B: proposal/e-sign tool or payment-link acceptance.** Before acceptance, provide the reg. 9(1) information in the quote or tool: (a) the technical steps to conclude the contract; (b) whether Gridsmith files the concluded contract and whether the client can access it; (c) how to spot and correct input errors before accepting; (d) the language (English). Under reg. 11 also send an acknowledgement of receipt by email without undue delay. For consumers this cannot be excluded.
4. **What must be provided before acceptance**, whatever the method:
   - the identity block (D7 wording: name, legal form, place of registration, number, registered office), email and phone (SI 2015/17 reg. 25 on the order form; PSR reg. 8; CCR Sch. 2 for consumers);
   - the applicable terms (MSA or Consumer Terms, **named and versioned**), in storable and reproducible form (reg. 9(3); PSR reg. 8(1)(i)–(j) and reg. 11(b));
   - the scope, deliverables, total price **and its tax treatment** (PSR reg. 9(1)(a); for consumers, the total price inclusive of taxes, CCR Sch. 2(f));
   - the payment structure and any deposit conditions (CCR Sch. 2(j),(u));
   - for consumers, the cancellation information (consumer review);
   - the complaints route (PSR reg. 12; CCR Sch. 2(k)).
5. Payment is requested **after** acceptance (owner model). No payment page exists on the site, so
   e-commerce reg. 6(2) price rules and reg. 11 do not arise on the website itself.

---

## 5. How the terms must be made available

| Need | Authority | Recommendation |
|---|---|---|
| Storable and reproducible terms whenever terms are provided | e-commerce reg. 9(3) (not removed by the email carve-out; not excludable) | **(1)** Live HTML pages at `/legal/business-client-terms` and `/legal/consumer-client-terms` with a print stylesheet (the project already has one; `GS-SHARED-001-RC` mentions "print gold"). **(2)** A **PDF of each versioned instrument** (version and effective date in the file name and on the page), **attached to, or linked from, every quote/Scope**, with the quote naming the version. **(3)** The acceptance email states which version applies. G2 gives "downloaded and printed off" as the example. |
| Available in good time before the contract | PSR reg. 11(b); reg. 8(1)(i),(j) | Production cannot launch with the legal routes returning 404. At minimum, the terms must reach the client with the quote. |
| Consumer confirmation on a durable medium | CCR reg. 16; reg. 5 | Email confirmation with the terms as an attachment, or the full text in the email. A link alone is not enough. |
| Version traceability | evidential (no specific rule) | Keep a copy of each version sent. The website's "version and effective date at the top" approach is sound; do not overwrite old versions without keeping them. |
| Accessibility | Equality Act 2010 reasonable-adjustment duty (not re-verified here — **UNVERIFIED**; the accessibility workstream owns it) | HTML first, PDF as a copy rather than the only format. Offer the terms in another format on request. |

**Live before production (minimum):** `/legal/terms`, `/legal/privacy`, `/legal/cookies`,
`/legal/accessibility` (these are footer links, so the 404s are dead links in the e-commerce reg. 6
"permanently accessible" footer), and both client-terms instruments (linked from or attached to
quotes), or else delivered by PDF with every quote. `/press/contact` links to `/legal/privacy` from
the form, and `/contact` has **no** privacy link next to its form. The UK GDPR transparency point
belongs to the privacy workstream and is flagged only.

---

## 6. VAT — OWNER CONFIRMATION REQUIRED

**Facts.** The brief says VAT status is **unknown**. However the code (`companyDetails.ts`,
`seed-company-details.mjs`, `Footer.tsx` comments) and three served legal documents state it as fact:
"Gridsmith Ltd is not currently registered for VAT and does not charge VAT" (`WEBSITE-TERMS.md`
l.43; `MSA-BUSINESS.md` l.61; `CONSUMER-TERMS.md` l.45; `seed-legal.mjs` l.306, 391, 549). This
review could not confirm VAT status. HMRC's checker needs a number, and none is published.

**Law.**
- E-commerce reg. 6(1)(g) and PSR reg. 8(1)(g) require the VAT number **only** where the provider undertakes an activity subject to VAT, i.e. once registered. A non-registered business has **no duty to say anything** about VAT on its website (high confidence).
- A business must register when taxable turnover exceeds **£90,000** in the last 12 months, or is expected to exceed it in the next 30 days. Voluntary registration is possible below that (G3).
- "You must register for VAT to start charging VAT" (G3). An unregistered person who issues an invoice showing VAT incurs a penalty (FA 2008 Sch. 41 para. 2, S11).
- If registered: the VAT number on the website (reg. 6(1)(g)), quotes and invoices; consumer prices VAT-inclusive (CCR Sch. 2(f); DMCCA price rules — consumer review); business quotes may be VAT-exclusive if they say so.
- A false statement "not registered for VAT" in contract terms would be a factual misstatement. If the company is registered, the documents are wrong about the price the client pays. That is high exposure for consumers (misleading information) and a contract-construction problem for business clients ("the fee is the amount payable").

**Options.**
1. **Not registered (owner confirms):** keep the current clauses, but **fix the website-terms wording about prices "shown on this website"** (E7). Publish no VAT line. Set a turnover-monitoring reminder against the £90,000 threshold. Recommended if true.
2. **Registered:** add a `vatNumber` field and footer line ("VAT registration number GB…"); replace all three "not currently registered" clauses (consumer: prices include VAT; business: quotes state whether VAT is added); add the number to quotes and invoices. **Must be done before any client contracts on these terms.**
3. **Unknown or pending:** do **not** publish the "not currently registered" sentence until it is confirmed. Use neutral wording instead: "The quotation states the total price and whether VAT applies. Where VAT applies to a consumer, the price shown includes it."

**Conservative recommendation:** the owner confirms status in writing, recorded with the date in
`OWNER-ACTIONS.md`. Until then, treat the "not currently registered" clauses as **unconfirmed facts**
that block legal-document launch.

---

## 7. Missing or weak disclosures — summary of fixes (priority order)

1. **Legal routes live before production** (or terms delivered as PDF with every quote): e-commerce reg. 9(3); PSR regs 8(1)(i)–(j), 11. **High.**
2. **VAT status confirmation** before the three VAT clauses are published (§6). **High. OCR.**
3. **Business documents** (quotes, SOW, invoices, email signature) carry the full SI 2015/17 reg. 24–25 particulars; directors named all-or-none (D7, D8). **High rule; state unknown. OCR.**
4. **Acceptance method** confirmed as email or individual communication, or the reg. 9(1)/11 information is added (§4). **Medium. OCR.**
5. **Statutory line wording**: "Gridsmith Ltd, a private limited company registered in England and Wales (Companies House), company number 17050842, registered office 30 Briarfield Road, Farnworth, Bolton, BL4 0HD". This covers PSR reg. 8(1)(b), e-commerce reg. 6(1)(d) and G1 at once. It is one content edit (`placeOfRegistration`) plus a few words in `Footer.tsx`; check `check:company`/`check:launch` expectations before editing. **Medium.** (D2 OCR: confirm the jurisdiction on the certificate.)
6. **Telephone number for complaints** (PSR reg. 7(2)(b)): decide whether the published number accepts calls or voicemail (P2). **Medium. OCR.**
7. **Business complaints clause** in the MSA, and a visible complaints route (PSR reg. 12) (P13). **Medium.**
8. **Website terms** wording on "prices shown on this website" (E7). **Low–medium.**
9. **Registered-office name sign** (SI 2015/17 reg. 21) decision (D10). **Low. OCR.**
10. **Do not add** an ODR link or an ADR statement. Neither is required today (A1–A3). Add s. 308 wording to complaint outcome letters only if an ADR obligation is ever taken on.
11. Ledger correction: `L-TDR-24`'s reason for omitting CA 2006 ss. 1202–1206 should read "Chapter 2 of Part 41 applies only to individuals and partnerships (s. 1200(1))" (D12). `L-ECOM-6`'s status (fabricated VAT number, prices) is historical and is superseded by the current build.

## 8. Things this review did not establish

- The jurisdiction field on the Companies House record (only the overview page was read).
- Recital 18 of Directive 2000/31/EC and the *Content Services* CJEU case (**UNVERIFIED**; used only as supporting reasoning).
- The actual quote, invoice and email templates (not in the repository).
- Whether any trade-body membership, code of conduct or ADR scheme applies (owner fact).
- The `/contact/thank-you` HTTP 500 (observed, not investigated; outside this scope).
