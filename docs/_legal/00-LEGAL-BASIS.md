# UK Legal Basis — requirements map

**Everything in `_legal/` is a solicitor-ready draft, not legal advice.** It is written to be reviewed, amended and adopted by a qualified UK solicitor before deployment. Nothing here should go live unreviewed. `legalDocument.solicitorApproved` gates production publication for exactly this reason.

Prepared August 2026 against the law then in force.

---

## 1. What applies to Gridsmith Ltd

| Area | Instrument | What it requires |
|---|---|---|
| Company disclosure | Companies Act 2006 §§82–83 + Company, LLP and Business (Names and Trading Disclosures) Regulations 2015 | Registered name, company number, place of registration and registered office on the website and on all business letters, order forms and invoices — **including where trading as Gridsmith Design / Digital / Press** |
| E-commerce disclosure | Electronic Commerce (EC Directive) Regulations 2002 | Name, geographic address, email, VAT number if registered, clear pricing |
| Services disclosure | Provision of Services Regulations 2009 | Prices or the method of calculating them, complaints handling, insurance details on request |
| Data protection | UK GDPR + Data Protection Act 2018, **as amended by the Data (Use and Access) Act 2025** | Lawful basis, privacy notice, data subject rights, records, **and a formal complaints procedure** |
| Cookies / tracking | PECR 2003, **as amended by DUAA 2025** | Consent before non-essential storage; **fines now up to £17.5m or 4% of global turnover** |
| Consumer contracts | Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 | Pre-contract information and a **14-day cancellation right** for distance contracts with consumers |
| Consumer service quality | Consumer Rights Act 2015 | Reasonable care and skill; unfair terms test; cannot be excluded |
| B2B contract fairness | Unfair Contract Terms Act 1977 | Liability limitations must satisfy the reasonableness test |
| Copyright / IP | Copyright, Designs and Patents Act 1988, **s.90(3)** | **Assignment of copyright must be in writing and signed by the assignor** |
| Late payment (B2B) | Late Payment of Commercial Debts (Interest) Act 1998 | Statutory interest at 8% + Bank of England base, plus a fixed recovery sum |
| Accessibility | Equality Act 2010 | Reasonable adjustments; WCAG 2.2 AA is the recognised benchmark |

## 2. What changed in 2026 and what it means here

The Data (Use and Access) Act 2025 received Royal Assent on 19 June 2025. Its main data protection provisions came into force on **5 February 2026**, with the direct complaints requirement following on **19 June 2026**. It amends UK GDPR, the DPA 2018 and PECR — it does not replace them.

Three consequences for this build:

### 2.1 PECR fines are now aligned with UK GDPR
The PECR ceiling moved from £500,000 to **£17.5m or 4% of global annual turnover**, and the previous requirement to prove substantial damage and distress has been removed. Cookie compliance has moved from a website housekeeping item to a material financial risk. This is the strongest single justification for the consent architecture specified in `master/TECH-SPEC.md` §4.

### 2.2 New cookie exemptions exist but do not help here
The DUAA introduced narrow PECR exemptions, including analytics used **solely for aggregate statistics**. Commentary in 2026 is not uniform on scope, and an opt-out is still required even where an exemption applies.

**Position adopted: continue to require consent for GA4 and PostHog.** Reasoning:
- GA4 transmits data to a third party and supports non-aggregate use — it does not sit comfortably inside "solely for aggregate statistics"
- PostHog session replay is plainly not aggregate statistics
- The exemptions are narrow and untested, and the downside of getting it wrong is now 4% of turnover
- Strictly necessary cookies (`gs_consent`, session, CSRF) remain exempt, as they always were

If a solicitor advises that first-party aggregate-only analytics can be deployed without consent, that is a decision to take deliberately — it would improve measurement coverage materially. It should not be assumed.

### 2.3 A formal data protection complaints procedure is now required
In force from 19 June 2026. Gridsmith must be able to receive, acknowledge and respond to data protection complaints, and the privacy notice must describe the process. Drafted at `PRIVACY-POLICY.md` §12.

## 3. The consumer/business split — the most important structural point

**Gridsmith Press sells to consumers.** Individual authors and memoir clients are almost always consumers, not businesses. That changes the legal position substantially and cannot be handled with a single set of business terms.

| | Business client | Consumer client |
|---|---|---|
| Governing terms | `MSA-BUSINESS.md` | `CONSUMER-TERMS.md` |
| Cancellation right | None implied | **14 days from contract formation** (CCR 2013) |
| Liability cap | Negotiable, subject to UCTA reasonableness | Tightly constrained; core rights cannot be excluded |
| Late payment | Statutory interest applies | Interest must be a genuine pre-estimate, not a penalty |
| Unfair terms | UCTA reasonableness test | CRA 2015 fairness test — much stricter |

### The 14-day problem — flagged for the solicitor

Canonical process stage 3 is *"Work begins after the project scope is confirmed and the agreed initial payment is received."* For a consumer distance contract, that will often fall inside the 14-day cancellation window.

Under CCR 2013, if a consumer wants work to start within the cancellation period, the trader must obtain their **express request** to begin early, and inform them that they will lose the cancellation right once the service is fully performed, and that they must pay a proportionate amount for work done if they cancel part-way.

Without that express request, a consumer can cancel on day 13 with work substantially complete and be entitled to a full refund.

**Required implementation** (already reflected in the Press flow and drafted at `CONSUMER-TERMS.md` §6):
- A separate, explicit checkbox at order confirmation — not bundled into "I accept the terms"
- Wording that states plainly what is being given up
- The confirmation email must repeat it
- A record of the request, timestamped, retained

This is a real commercial exposure on the highest-volume Press segment, and it is exactly the kind of thing that is cheap to fix now and expensive to discover later.

## 4. IP position — differs by division

| Division | Position | Mechanism |
|---|---|---|
| Digital | Client owns the code, data and infrastructure | **Written assignment clause, signed** (CDPA s.90(3)), conditional on payment in full |
| Design | Client owns the final approved deliverables; Gridsmith retains rejected concepts and working files unless bought out | Assignment of final deliverables; licence-back for portfolio use |
| Press | **Author retains 100% of rights and royalties throughout.** Gridsmith never takes an interest in the work | No assignment of the manuscript at any point; a licence only for production purposes |

Two things must line up before launch:

1. **Digital's ownership guarantee module** (`digital/PRD.md` FR-DG06) cites contract clauses. Those clauses must exist and say what the site says. `digital/PROJECT-TRACKER.md` T-04 is the gate.
2. **Press's rights page** (`press/PRD.md` FR-P04) does the same. `press/PROJECT-TRACKER.md` R-07 is the gate.

A site that promises ownership terms the contract does not grant is a misrepresentation, and in Press's case it is precisely the behaviour the market is screening for.

## 5. Documents in this folder

| File | Purpose | Audience |
|---|---|---|
| `WEBSITE-TERMS.md` | Terms of use for the website itself | Anyone visiting |
| `PRIVACY-POLICY.md` | UK GDPR privacy notice | Anyone whose data is processed |
| `COOKIE-POLICY.md` | PECR cookie disclosure | Anyone visiting |
| `ACCESSIBILITY-STATEMENT.md` | Equality Act position and WCAG conformance | Anyone |
| `MSA-BUSINESS.md` | Master services agreement + three division schedules | Business clients |
| `CONSUMER-TERMS.md` | Consumer terms incl. cancellation rights | Individual authors, memoir clients |

## 6. Questions for the solicitor

Send these with the drafts rather than waiting for them to come back:

1. Does the DUAA analytics exemption cover first-party GA4 in a configuration you would be comfortable with, or should consent be retained?
2. Is the early-start express-request mechanism at `CONSUMER-TERMS.md` §6 sufficient, and is the pro-rata calculation method defensible?
3. Are the liability caps at `MSA-BUSINESS.md` §11 reasonable under UCTA for the contract values involved?
4. Does the Digital assignment clause satisfy CDPA s.90(3) given contracts are executed electronically?
5. Should the three trading names be disclosed on invoices as "Gridsmith Ltd t/a Gridsmith Design", and is anything further required?
6. Do the Press packages need to be presented differently to consumers given CRA 2015 price transparency expectations?
7. Is a separate data processing agreement needed where Gridsmith processes client customer data (Digital builds, mailing lists)?
8. What is your view on the professional indemnity position for engineering drawings specifically?
