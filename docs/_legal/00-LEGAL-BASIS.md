# UK Legal Basis — requirements map

**Everything in `_legal/` is a solicitor-ready draft, not legal advice.** It is written to be reviewed, amended and adopted by a qualified UK solicitor before deployment. Nothing here should go live unreviewed. `legalDocument.solicitorApproved` gates production publication for exactly this reason.

Prepared August 2026 against the law then in force.

> **[SEED - SOLICITOR REVIEW REQUIRED]**
> This map, and every draft it indexes, is prepared for a qualified UK solicitor to review, amend and
> adopt. It is not legal advice.

**Corrected 25 August 2026 against `02-CITATION-LEDGER.md`.** Pass 2 treated this file as an unverified
assertion rather than a source, and read the primary instruments directly. Where the two disagree, the
ledger wins and this file has been changed. The corrections are marked **[CORRECTED]** in place, so the
disagreement is visible rather than quietly resolved.

**What Pass 2 confirmed:** §2's commencement dates are **right**. DUAA 2025 main provisions commenced
**5 February 2026** (SI 2026/82 reg. 2, including s. 112) and the direct-complaints duty **19 June
2026** (reg. 3, s. 103 and Sch. 10). `L-DUAA-COMMENCEMENT`.

---

## 1. What applies to Gridsmith Ltd

| Area | Instrument | What it requires |
|---|---|---|
| Company disclosure <!-- L-CA-82 --><!-- L-TDR-24 --><!-- L-TDR-25 --> | SI 2015/17 **reg. 24** (registered name on websites) and **reg. 25** (part of the UK of registration, registered number, registered office address); Companies Act 2006 s. 82 is the empowering power | Registered name, company number, place of registration and registered office on the website and on all business letters, order forms and invoices — **including where trading as Gridsmith Design / Digital / Press**. **[CORRECTED]** the obligation read and cited is in regs. 24–25, not in s. 82 itself; s. 82's text was not fetched (`CNV-7`). **Status: satisfied** — the live footer renders all four particulars, subject to OQ-15 confirming the number and address are real |
| E-commerce disclosure <!-- L-ECOM-6 --> | SI 2002/2013 **reg. 6(1)** and **reg. 6(2)** | Name, geographic address, an email address allowing rapid and direct contact, registration number, and **the VAT number where the provider undertakes an activity subject to VAT**; and where prices are referred to they must be clear and unambiguous and **indicate whether they are inclusive of tax**. **[CORRECTED]** reg. 6 is **not consumer-only** — it is why the VAT-display obligation reaches Design and Digital too. **Status: not satisfied, twice** — the footer publishes the fabricated VAT number `[SEED] GB123456789`, and no price on the site states any tax treatment |
| Services disclosure | Provision of Services Regulations 2009 | Prices or the method of calculating them, complaints handling, insurance details on request. <!-- NO LEDGER ENTRY: Pass 2 raised no entry for the PSR 2009 and did not read it. **Treat this row as unverified.** The overlapping obligations that *are* cited sit in `L-ECOM-6`, `L-CCR-13` and `L-DMCC-230`. --> |
| Data protection <!-- L-GDPR-6 --><!-- L-GDPR-13 --><!-- L-GDPR-RIGHTS --><!-- L-GDPR-30 --><!-- L-DPA-164A --> | UK GDPR + Data Protection Act 2018, **as amended by the Data (Use and Access) Act 2025** | Lawful basis (Art. 6), privacy notice content (Art. 13), data subject rights (Arts. 12, 15–21), records of processing (Art. 30), security (Art. 32), processors (Art. 28), **and the direct-complaints duty at DPA 2018 s. 164A from 19 June 2026** |
| Storage limitation <!-- L-GDPR-5-1e --> | UK GDPR Art. 5(1)(e) with Art. 5(2) | **[NEW ROW]** Personal data must not be kept in identifiable form longer than necessary, and the controller must be able to demonstrate it. **Status: not satisfied** — no retention period, no purge job, nothing scheduled (`01-FACTUAL-INVENTORY.md` §3.4, OQ-9) |
| International transfers <!-- L-GDPR-44A --> | UK GDPR Chapter V **as restructured by DUAA 2025** — Arts. 44A, 45A, **45B**, 46, 49 | **[NEW ROW]** **Articles 44 and 45 were OMITTED on 5 February 2026.** Any draft citing "adequacy decisions" or Art. 45 cites repealed text. The test is now Art. 45B's *data protection test*: whether protection is **not materially lower** than the UK standard. **Status: cannot tell — the ledger's largest single unknown**, because four processor regions are unestablished (OQ-1 to OQ-4) |
| The ICO fee <!-- L-DPA-FEE --> | Data Protection (Charges and Information) Regulations 2018, SI 2018/480, regs. 2–3 and Sch. 1 | **[NEW ROW]** A controller must pay the data protection fee and notify its staff and turnover bands, unless all its processing is exempt. **Status: cannot tell** — `icoRegistration` exists in the CMS schema and is never populated or rendered (OQ-16) |
| Cookies / tracking <!-- L-PECR-6 --><!-- L-PECR-6-CONSENT --><!-- L-PECR-CONSENT-EVIDENCE --> | PECR 2003 **reg. 6 as substituted, with new Sch. A1**, by DUAA 2025 s. 112 and Sch. 12, in force 5 Feb 2026 | reg. 6(1) prohibits storing or accessing information on terminal equipment unless a Sch. A1 exception applies: para. 2 consent · para. 3 transmission · para. 4 strictly necessary · **para. 5 statistical purposes** · **para. 6 appearance and functionality** · para. 7 emergency location. **[CORRECTED]** the ceiling figure is flagged below |
| Marketing email <!-- L-PECR-22 --> | PECR 2003 reg. 22 (with reg. 22(3A) and 22(5) inserted 5 Feb 2026) | **[NEW ROW]** Binds only for **individual subscribers** — which for Press means most recipients. Marketing to a corporate subscriber falls outside reg. 22, though reg. 23 still requires sender identity and a valid address (`CNV-3`: reg. 23's text was not retrieved and must be read). **Status: not engaged today** — no marketing send exists |
| Consumer contracts <!-- L-CCR-13 --><!-- L-CCR-29 --><!-- L-CCR-40 --> | SI 2013/3134 regs. 13 and Sch. 2, 14, 16, **29–31**, 36, **40–41** | Pre-contract information and a **14-day cancellation right** for distance contracts with consumers. **[ADDED]** reg. 31: **if the reg. 13 cancellation information was not given, the period extends by up to 12 months** — the most expensive consequence in this section. reg. 40: an additional payment needs express consent, never a pre-ticked default |
| Consumer service quality <!-- L-CRA-49 --><!-- L-CRA-50 --><!-- L-CRA-51 --><!-- L-CRA-52 --><!-- L-CRA-57 --> | Consumer Rights Act 2015 ss. 48–52, **s. 57**, and Part 2 (ss. 61–76) | Reasonable care and skill (s. 49); **anything said or written about the trader or the service becomes a term if the consumer takes it into account (s. 50)**; a reasonable price and a reasonable time where none is fixed (ss. 51–52); **s. 57 makes any exclusion of s. 49 or s. 50 liability non-binding**. **[ADDED]** s. 50 is the sharpest hook in this build: `[SEED]` content is live on the running site today |
| Consumer pricing and reviews <!-- L-DMCC-230 --><!-- L-DMCC-SCH20-13 --> | Digital Markets, Competition and Consumers Act 2024, **s. 230** and **Sch. 20 para. 13**, Part 4 Ch. 1 in force **6 April 2025** | **[NEW ROW]** s. 230: an invitation to purchase must give the **total price** or how it will be calculated, with the calculation information as prominent as the base figure. Sch. 20 para. 13: fake reviews, concealed incentives, and **suppressing negative reviews while publishing positive ones**, are unfair in all circumstances. **[NOTE]** Part 4 replaced CPUT 2008; this row did not exist in version 1.0 at all |
| B2B contract fairness | Unfair Contract Terms Act 1977 | Liability limitations must satisfy the reasonableness test. <!-- NO LEDGER ENTRY: Pass 2 raised no entry for UCTA and did not read it. **Treat the reasonableness test as asserted, not verified**, and note that the consumer side is fully cited at `L-CRA-57` while the business side is not. --> |
| Copyright / IP | Copyright, Designs and Patents Act 1988, **s.90(3)** | **Assignment of copyright must be in writing and signed by the assignor.** <!-- NO LEDGER ENTRY: Pass 2 raised no CDPA entry and s. 90(3) was not read. `MSA-BUSINESS.md` clause 8.3 is drafted to satisfy it and Digital's whole ownership promise rests on it, so **this is an unverified citation carrying real weight**. The solicitor must confirm it, including whether it is satisfied by an electronically executed contract. --> |
| Late payment (B2B) | Late Payment of Commercial Debts (Interest) Act 1998 | Statutory interest at 8% + Bank of England base, plus a fixed recovery sum. <!-- NO LEDGER ENTRY: Pass 2 raised no entry and the Act was not read. `[TK — 8% and "a fixed recovery sum" are specific figures no gate covers. Per CLAUDE.md, a specific-looking number that nothing verifies is worse than no number. Confirm against the Act before MSA clause 6.4 is relied on.]` --> |
| Accessibility <!-- L-EQA-29 --><!-- L-EQA-20 --><!-- L-WCAG-22 --> | Equality Act 2010 **s. 29** and **s. 20 with Sch. 2** | Not to discriminate in providing a service, and an **anticipatory** duty to make reasonable adjustments — Sch. 2 para. 2(2) makes it owed to disabled people generally, not to a particular customer; s. 20(7) forbids charging for it. **[CORRECTED]** **WCAG 2.2 is a W3C Recommendation, not law, and not a statutory standard for a private-sector UK service** — the 2018 public-sector accessibility regulations do not bind Gridsmith Ltd. It is a benchmark the company has **adopted**, and its value is evidential. It follows that **a claim of AA conformance made without the screen-reader pass having happened is itself a statement about the service under CRA 2015 s. 50** |
| VAT on displayed prices <!-- L-VAT-CONSUMER --><!-- L-VAT-B2B --> | DMCCA 2024 s. 230 and SI 2013/3134 Sch. 2 for consumers; SI 2002/2013 reg. 6(2) for business | **[NEW ROW] The divergence in one line: Press prices must be *inclusive*; Design and Digital prices need only be *labelled*.** Both are currently *unlabelled*, so both fail — but they fail differently and the fix is not the same. Collapsing to "all prices exc. VAT" would fix Design and Digital and break Press. **[DECISION TAKEN 26 Aug 2026 — owner: option (c), per-division rendering (inclusive on `/press`, labelled-exclusive on `/design` and `/digital`), as the only option satisfying both requirements at once. `WEBSITE-TERMS.md` cl. 5A.]** `M-P2-3` is NOT BUILT — the decision is recorded, not implemented |

## 2. What changed in 2026 and what it means here

The Data (Use and Access) Act 2025 received Royal Assent on 19 June 2025. Its main data protection provisions came into force on **5 February 2026**, with the direct complaints requirement following on **19 June 2026**. It amends UK GDPR, the DPA 2018 and PECR — it does not replace them.

Three consequences for this build:

### 2.1 PECR fines are now aligned with UK GDPR

**[VERIFIED 26 August 2026 — the `[TK]` is closed. See `L-PECR-PENALTY`.]** <!-- L-PECR-PENALTY -->

**A breach of reg. 6 attracts the *higher* maximum: £17,500,000 or 4% of total annual worldwide
turnover, whichever is higher.** The route is PECR reg. 31 → PECR Sch. 1 (both substituted 5 Feb 2026
by DUAA 2025 s. 115(5) and Sch. 13, commenced by SI 2026/82 reg. 2) → Sch. 1 para. 18, which modifies
DPA 2018 s. 157. Para. 18(b)(ii) puts **"regulation 5, 6, 7, 8, 14, 19, 20, 21, 21A, 21B, 22, 23, 24
or 32B(4) or (5)"** into **s. 157(2)(a)** — the limb that carries the higher maximum. s. 157(5)
defines it. Every *other* PECR infringement falls to s. 157(2)(b), the standard maximum, £8.7m or 2%
(s. 157(6)).

<!-- PROVENANCE, because the number changed twice. Version 1.0 asserted £17.5m/4% with no citation.
Pass 4 (04-VERIFICATION-REPORT.md §2.1, §4.5) proposed correcting it to "£8.7m or 2%", reading para.
18(b)(ii) as modifying s. 157(2) as a whole. It modifies **paragraph (a) of** subsection (2), and
(2)(a) is the higher-maximum limb — so the proposed correction inverted the tiering. That correction
was REJECTED by the owner on 26 Aug 2026 on the separate ground that it substituted one uncited number
for another; reading the provision then showed it was also wrong on the merits. The figure now stands
on the primary text, not on either assertion. -->

The architectural conclusion never depended on the ceiling in any event: the consent
banner already places nothing before a choice, and that is the position `L-PECR-6` records as
satisfied.

### 2.2 New cookie exemptions exist — **[CORRECTED]** and the position is now an open decision
<!-- L-PECR-6 -->

Version 1.0 headed this section *"New cookie exemptions exist but do not help here"* and closed the
question in a paragraph. Two things have changed. The exception is **in force** (PECR Sch. A1 **para.
5**, 5 February 2026), and **the regulator has published its position on it** — which Pass 2 recorded
as the one gap where no primary source was reached (`CNV-1`). Pass 3 fetched it. The full conditions,
quoted, are in `COOKIE-POLICY.md` §4A, sourced to the ICO's *Guidance on the use of storage and access
technologies*, chapter "What are the exceptions?", retrieved 25 August 2026. **That is regulator
guidance, not statute.**

Three of version 1.0's four bullets survive contact with it, and one does not:

- *"PostHog session replay is plainly not aggregate statistics"* — **correct, and the ICO says so
  directly**: consent is required for *"logs or recordings of individual visitors to your website and
  the actions they took"*.
- *"GA4 transmits data to a third party"* — **this alone does not defeat the exception.** The ICO
  states plainly that you may *"use a third-party analytics provider"*. What matters is that the
  provider is engaged as a **processor, not a joint controller**, and that the output is aggregate.
  GA4's controller/processor position here is an account-settings question and is **unresolved**
  (OQ-5).
- *"the exemptions are narrow and untested"* — narrow, yes; untested, no longer. There is now
  published guidance to test a position against.
- *"an opt-out is still required even where an exemption applies"* — **correct**, and the ICO
  describes what it looks like: a toggle that may default **on** and can be turned off at any time.
- Strictly necessary storage remains exempt. **[CORRECTED]** the parenthetical *"(`gs_consent`,
  session, CSRF)"* is wrong on the facts: **there is no session cookie and no CSRF cookie on this
  site.** `gs_consent` is the only cookie that exists.

**The position is no longer "adopted". It is `[DECISION REQUIRED]`, and it is set out with its options
and consequences at `COOKIE-POLICY.md` §4A and `PRIVACY-POLICY.md` §11A.** The decision is linked to a
second one: relying on consent means Art. 7(1) demands we can **demonstrate** it, and today we cannot —
`consent_events` does not exist. Relying on para. 5 removes that problem for analytics.

**And note the fact that makes this cheap to decide now and expensive to decide later:** neither GA4
nor PostHog is initialised, so nothing is collected in any consent state today
(`01-FACTUAL-INVENTORY.md` §1.3). The decision must be made **before** the libraries are turned on.

### 2.3 A formal data protection complaints procedure is now required
<!-- L-DPA-164A -->

In force from **19 June 2026** — DPA 2018 s. 164A, inserted by DUAA 2025 s. 103 and Sch. 10, commenced
by SI 2026/82 reg. 3. Gridsmith must **facilitate the making of complaints**, "by taking steps such as
providing a complaint form which can be completed electronically and by other means"; **acknowledge
receipt within 30 days**; and without undue delay make appropriate inquiries, respond, keep the
complainant informed of progress and tell them the outcome. There is no small-organisation exemption.
Art. 13(2) separately requires the existence of the right to be stated in the privacy notice.

**[CORRECTED — the status.]** Version 1.0 said this was "drafted at `PRIVACY-POLICY.md` §12", which
was true and is not the same as satisfied. `01-FACTUAL-INVENTORY.md` §5.1 lists every route on the
site: **there is no complaints route and no electronic complaint form.** `/contact` is a sales enquiry
form whose message field is deliberately withheld from the notification email — it is not a complaints
channel. **This is the ledger's number-one unclaused obligation, and it is a build task, not a drafting
one.**

## 3. The consumer/business split — the most important structural point

**Gridsmith Press sells to consumers.** Individual authors and memoir clients are almost always consumers, not businesses. That changes the legal position substantially and cannot be handled with a single set of business terms.

> **[DECISION RECORDED] — owner, 26 August 2026. The routes were split.**
> <!-- L-CRA-57 -->
> `lib/legal/slugs.ts` declared **five** legal slugs, and **`MSA-BUSINESS.md` and `CONSUMER-TERMS.md`
> both mapped to the single `/legal/client-terms`**, whose seeded document mixed both regimes.
> **One route cannot carry both a valid B2B cap and a CRA-compliant consumer position**, and no
> additional clause could fix it while there was one slug — which is why this was never a drafting
> matter. Option **(a)** was taken: `/legal/business-client-terms` and `/legal/consumer-client-terms`
> carry the two instruments, each stating at the top who it governs and who it does not;
> `/legal/client-terms` survives as a disambiguation page with no operative clause, rather than as a
> redirect that would have to pick a target and be wrong for half its readers.
> `scripts/check-consumer-terms.mjs` asserts the routing against the served pages.
>
> **What remains of OQ-13 is `/contact`:** one form still serves all three divisions, so nothing in
> the enquiry flow identifies which regime a buyer is in before an order is confirmed
> (`press/PRD.md` FR-P24).

| | Business client | Consumer client |
|---|---|---|
| Governing terms | `MSA-BUSINESS.md` | `CONSUMER-TERMS.md` |
| Route | `/legal/business-client-terms` | `/legal/consumer-client-terms` — **a separate page since 26 Aug 2026** |
| Cancellation right | None implied | **14 days from contract formation** (CCR 2013) |
| Liability cap | Negotiable, subject to UCTA reasonableness *(uncited — see §1)* | **Void to the extent it excludes s. 49 or s. 50 liability, or prevents recovery of the price paid — CRA 2015 s. 57** |
| Price display | Treatment must be **stated**; exclusive is permitted — SI 2002/2013 reg. 6(2) | Must be the **total inclusive of tax**, or state how it is calculated with equal prominence — DMCCA s. 230 |
| Marketing email | reg. 22 does not bind a corporate subscriber; reg. 23 still does | reg. 22 binds; soft opt-in only after a sale or negotiations for one |
| Electronic contracting | regs. 9(1) and 11(1)(b) excludable by agreement | **Mandatory — not excludable** |
| Late payment | Statutory interest applies | Interest must be a genuine pre-estimate, not a penalty |
| Unfair terms | UCTA reasonableness test | CRA 2015 fairness test — much stricter |

### The 14-day problem — flagged for the solicitor

Canonical process stage 3 is *"Work begins after the project scope is confirmed and the agreed initial payment is received."* For a consumer distance contract, that will often fall inside the 14-day cancellation window.

Under CCR 2013, if a consumer wants work to start within the cancellation period, the trader must obtain their **express request** to begin early, and inform them that they will lose the cancellation right once the service is fully performed, and that they must pay a proportionate amount for work done if they cancel part-way.

Without that express request, a consumer can cancel on day 13 with work substantially complete and be entitled to a full refund.

**[CORRECTED] "already reflected in the Press flow" is not true.** `01-FACTUAL-INVENTORY.md` §7
records the Press Path Finder and every division sub-route as **NOT BUILT**; there is no order
confirmation, no checkbox and no ordering flow of any kind on the site. The mechanism exists in the
draft and nowhere else. Add to it one consequence version 1.0 omitted: **`L-CCR-29` reg. 31 — if the
reg. 13 cancellation information was not given, the cancellation period extends by up to 12 months.**

**Required implementation** (drafted at `CONSUMER-TERMS.md` §6; **not built**):
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

| File | Purpose | Audience | Route |
|---|---|---|---|
| `WEBSITE-TERMS.md` | Terms of use for the website itself | Anyone visiting — **both audiences** | `/legal/terms` |
| `PRIVACY-POLICY.md` | UK GDPR privacy notice | Anyone whose data is processed | `/legal/privacy` |
| `COOKIE-POLICY.md` | PECR cookie disclosure | Anyone visiting | `/legal/cookies` |
| `ACCESSIBILITY-STATEMENT.md` | Equality Act position; WCAG 2.2 AA as an **adopted** benchmark, not a legal standard | Anyone | `/legal/accessibility` |
| `MSA-BUSINESS.md` | Master services agreement + three division schedules | Business clients | `/legal/business-client-terms` |
| `CONSUMER-TERMS.md` | Consumer terms incl. cancellation rights | Individual authors, memoir clients | `/legal/consumer-client-terms` |
| *(no draft — CMS only)* | Disambiguation. No operative clause; says which of the two above governs a reader, and links to both | Anyone unsure | `/legal/client-terms` |

**Three audit documents sit alongside them and are not published:** `01-FACTUAL-INVENTORY.md` (the
facts of the build), `02-CITATION-LEDGER.md` (31 obligations with primary citations — **the standard
the drafts are measured against**) and `03-REVISION-LOG.md` (what Pass 3 changed and why).

**Only `/legal/privacy` is covered by the accessibility gate.** The other **six** legal routes are
absent from `check-axe.mjs` (OQ-18) — the split added two more uncovered routes, and the two client
terms are the documents a buyer is most likely to read end to end.

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
9. **`L-DPA-164A` — the complaints duty came into force on 19 June 2026, after every draft was last
   revised, and there is no complaints route on the site.** What is the minimum acceptable
   implementation: a dedicated form, or a documented email route with a stated acknowledgement time?
10. **`L-GDPR-44A` — Chapter V was restructured on 5 February 2026 and Arts. 44 and 45 were omitted.**
   Four processor regions are unestablished. What must be established, and in what order, before the
   privacy notice can state a transfer position at all?
11. **`L-ECOM-6` — the site publishes a fabricated VAT number on every page.** Confirm that the
   correct action where the company is not VAT-registered is to publish none rather than a placeholder.
12. **`L-VAT-CONSUMER` / `L-VAT-B2B` — the VAT display split.** Confirm that Press prices must be
   inclusive while Design and Digital need only be labelled, and that a single site-wide "exc. VAT"
   label would fix the latter and break the former.
13. **`L-GDPR-5-1e` — there is no retention period and no deletion mechanism for enquiry data.** What
   period, or what criteria, would you advise, given the notice must state one under Art. 13(2)(a)?
14. **`L-DMCC-SCH20-13` — six real public reviews are displayed.** Is showing a selected subset, with
   any negative reviews not shown, capable of engaging the prominence limb, and what record should be
   kept of the selection?
15. **`L-WCAG-22` — the screen-reader pass has never happened.** Confirm that the accessibility
   statement should say "partially conformant" and name its gaps, rather than claim conformance on
   automated evidence.
9. **Transition of terms for in-flight engagements — Gridsmith Press is already trading.**
   The new site publishes new terms, but there are live client relationships governed by
   whatever is in force today, and consumer engagements part-way through delivery at the
   moment of cutover. Specifically:
   - New terms cannot be imposed retroactively on an existing contract. What is the
     correct mechanism — express agreement to varied terms, run-off on the old terms
     until each engagement completes, or something else?
   - The CRA 2015 / CCR 2013 14-day cancellation position at §3 and
     `CONSUMER-TERMS.md` §6 was drafted for new consumers. **Does it apply to consumers
     already in the pipeline at cutover**, and if so does the express-early-start request
     need to be obtained retrospectively from them?
   - Does publishing new terms on the site create any implication that they govern
     existing work, and how should the site avoid that?

   This was identified during the build, not in the original drafting pass. It is a
   consequence of Press being a live trading site rather than a new one.
