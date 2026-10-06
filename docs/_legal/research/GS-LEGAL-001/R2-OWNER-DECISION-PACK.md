# GS-LEGAL-001-R2 — Owner decision pack and final independent legal check

**Date:** 7 October 2026. **Branch:** `claude/sweet-mendel-11qvli`, fast-forwarded to
`staging/gs-legal-001` HEAD `02e69715` (see §1). **Status:** research and owner-decision record. It is
not legal advice, nobody has reviewed it as a solicitor would, and it does not say that any document is
compliant, approved, certified or enforceable in every circumstance. **Nothing in this phase adopted,
published, deployed or reseeded anything, and H4-H was not started.**

Read with `GS-LEGAL-001-RECORD.md` (§6 numbers, §7 decisions D-1 to D-30) and
`CLOUD-CONTINUATION.md` (the phase brief this pack answers, items 1–7).

## 0. What the owner needs to do

§4 is the whole ask. Everything else in this pack is the evidence behind it or a ready-made template the
owner adopts with a decision in §4.

The thirty register items and one new item (N-4) reduce to:

- **five decisions** (§4.1):
  - O-1 retention;
  - O-2 provider facts;
  - O-3 the consumer contracting workflow;
  - O-4 the business liability cap;
  - O-5 four small wording changes this check proposes.
- **five one-line confirmations** (§4.2): VAT, the phone channel, the registration wording, the drafted
  numbers, and Press copy. Each already has an owner answer or a safe default.
- **three operational preconditions** (§4.3), **two later-phase authorisations** (§4.4) and **one
  deferred item** (§4.5).
- **adoption itself** (§4.6), last, per document.

Several register recommendations were overtaken by owner decisions the register did not cite: VAT
(2 Sep), the ICO fee (`GS-O016`), "Registered in England" (`GS-O004`) and "not a call line"
(`GS-R001-R`). §3 corrects them.

The independent check of N-1 to N-3 found no defect, and two low contractual gaps in N-1 (§2). The
final check of this pack is §8.

## 1. Checkout verification

| Check | Result |
|---|---|
| Handoff's branch | `staging/gs-legal-001` |
| GitHub HEAD of that branch (GitHub API, 7 Oct 2026) | `02e69715ab7b335540d574f77ca371d2bf04edaf` |
| Local HEAD after `git merge --ff-only origin/staging/gs-legal-001` | `02e69715ab7b335540d574f77ca371d2bf04edaf` — identical |
| Handoff's own description | GS-LEGAL-001 work `53cc4f67`; "this file is the commit after it" = `fc87b080` |
| Difference between `fc87b080` and `02e69715` | One commit, 16 seconds later: `style(legal): drop trailing blank line in the GS-LEGAL-001 record` — one blank line removed from `GS-LEGAL-001-RECORD.md`, nothing else |
| Starting state of this cloud checkout | **Not** on the handoff HEAD: the session branch `claude/sweet-mendel-11qvli` started at `main` (`fbecbe01`), 76 commits behind. `main` is an ancestor of `staging/gs-legal-001`, so the branch was fast-forwarded with no merge and no rewrite |

Conclusion: the work below is on the exact GitHub HEAD of `staging/gs-legal-001`. The one commit past
the handoff's named commit is whitespace-only.

**Network limit in this session.** The environment's egress policy refuses `www.legislation.gov.uk`
and `ico.org.uk` (HTTP 403 at the proxy, for both `curl` and `WebFetch`). Primary legislation could
not be re-read at source here. Every legal proposition below therefore says whether it rests on (a) the
A–G reports' recorded reading of the primary text on 6 October 2026, (b) an official secondary source
seen in this session only as a web-search result summary (GOV.UK pages and law-firm briefings; WebFetch
was also refused for gov.uk), or (c) is **UNVERIFIED** in this phase.

## 2. Independent verification of N-1, N-2, N-3

A fresh agent that had not drafted or reviewed the set checked the three changes made after Agent G's
last pass. It read both drafts in full, G's report, and the generated served text: it imported
`scripts/seed-legal.mjs`, which has no side effects, and confirmed each sentence word for word in
`LEGAL_DOCUMENTS`. It also grepped `app/`, `components/`, `lib/` and `sanity/` for any hand-written copy.
**Its network was more limited than this session's: WebFetch failed on every host, gov.uk included, so
its legal readings are search-result summaries plus G's recorded primary readings, at medium confidence
at most.**

| Change | Where (served text identical) | Verdict | Finding |
|---|---|---|---|
| **N-1** RAO art. 60F(2) deferred-payment limit | Cons 4 ¶2; Bus 5 ¶1 (individual, partnership or other unincorporated body); Bus 2 last ¶ (default schedule "within the limit … where it applies") | **CONFIRMED WITH NOTE** | **The law is right as far as could be checked.** Credit regulation reaches individuals and art. 60L "relevant recipients" (2–3-partner partnerships not all bodies corporate; unincorporated bodies not entirely of bodies corporate), so limited companies and LLPs are outside. The draft's "a partnership or another unincorporated body" is **wider** than art. 60L, which only limits Gridsmith's own flexibility. SI 2025/859 (deferred-payment-credit regulation from 15 July 2026) adds art. 60F(7A), which disapplies para. (2) only where lender and supplier are different persons. Credit Gridsmith gives on its own services appears to stay exempt (search summaries of Walker Morris, Lewis Silkin, CMS and the HMT draft SI; G read the 15 July 2026 text at source). **Two contractual gaps, both low:** (a) **Bus 2:** time-charged work in arrears for an individual or small partnership running past month 12 cannot meet the limit, and the clause gives no fallback; (b) **both drafts:** early-ending balancing payments (Cons 7 "you pay the difference", via Cons 8; Bus 3, 6.2, 7, 18) could fall after month 12 or be a thirteenth payment. Whether a contingent termination payment counts under art. 60F(2) is **UNVERIFIED**. Wording: "within 12 months **of** the date" is looser than the statute's "12 months or less (beginning on the date of the agreement)" |
| **N-2** "This does not reduce our responsibility for our own work" | Cons 9 last ¶; Bus 13 ¶4 | **CONFIRMED WITH NOTE** | Present, consistent with Cons 15, 17 and Bus 15–17, and no consumer indemnity (G-09/D-27 respected). It lowers rather than raises the risk under CRA ss. 57, 62, 68 and UCTA ss. 2(2), 13(1). **Ambiguity:** "This" can be read as pointing only to the sentence before it (decline or pause), not to the whole paragraph. In the business version that matters for "content it supplies **or approves**". G's proposed text tied it to the remedies clauses; the draft dropped that link. For consumers CRA s. 69 resolves the doubt in their favour; for business clients it does not |
| **N-3** printing out of consumer third-party costs; services only | Cons 3 bullet 3 (ISBNs, licences, hosting, platform fees); Cons 6.1 ¶2 ("buy them directly from the printer, on the printer's terms") | **CONFIRMED WITH NOTE** | No goods clock, return paragraph or goods variant of the form remains. Consistent with G-02/D-11 (services only keeps reg. 30(2) timing and the reg. 36(2) loss-of-right rule). **Recharge route:** Cons 3's cost list is non-exhaustive ("such as") and Cons 7(3) allows "costs we have paid to other suppliers", so printing bought by Gridsmith and recharged, with copies passing through it, would bring goods back in. That needs a template rule (§7.1) rather than a redraft. **Site copy:** `components/divisions/press/PressHome.tsx:159,176–177` speaks of "the printing supplier agreed in the scope", whom Gridsmith "coordinate[s] … with". That is compatible with direct purchase but does not say so; it is an owner copy point (folded into D-20). **Record drift:** `GS-LEGAL-001-RECORD.md` D-11 still reads "or under a separate later contract", which the draft no longer says |

**Proposed wording (proposals only; no draft was edited in this phase):**

- **Bus 2**, after "…for work charged by time": "Where the limit on deferred payments in clause 5
  applies, any stage or month whose payment would otherwise fall due outside that limit is invoiced in
  advance instead."
- **Cons 4 and Bus 5:** "all due within 12 months of the date of" → "all due within the 12 months
  beginning with the date of".
- **Balancing payments.** Either adopt the template rule in §7.1 (once twelve deferred payments or 12
  months are reached, every further stage is paid in advance, so a balancing payment can never be a
  thirteenth deferred payment), or add an express sentence. The template rule needs no redraft and is
  recommended.
- **Cons 9:** "Nothing in this paragraph reduces our responsibility for our own work, including under
  sections 15 and 17." **Bus 13:** "Nothing in this paragraph reduces our responsibility for the work we
  create, subject to clause 16."

If the owner accepts these, the consumer and business drafts move to 3.1 **before** adoption. The
adoption gate then requires the register entries and `check:legal:adoption` to agree with 3.1, and the
manifest to be regenerated (`CLOUD-CONTINUATION.md`).

**In passing (not N-1 to N-3):**

1. **Digital content (CCR reg. 37) is no longer addressed in Consumer 3.0.** Cons 6.1 says "services
   only" and Cons 11 applies the CRA digital-content standards. That matches A-14's position: bespoke
   work commissioned by a consumer is a service, so reg. 36 governs. A ready-made product (template,
   e-book, font, preset) would be a reg. 37 contract with a different consent and acknowledgement.
   This is recorded as **N-4** in §3.
2. **Business terms and goods (G-23):** Bus 13 lists book production and has no goods clause. This is
   D-11's business limb and is still open.
3. Record §10 says N-1 to N-3 are "covered by the gates below". The gates check position and parity,
   not substance. This section is the independent pass the handoff asked for.

## 3. Classification of D-1 to D-30

A separate agent swept the repository for evidence on every D-item. It was read-only and not used for
drafting. This session then spot-checked the four findings that change the register (D-1, D-16, D-17,
D-21) against the cited sources: commit `f666202`'s message, `lib/company/companyDetails.ts`,
`docs/_shared/OWNER-ACTIONS.md` (`GS-O016`, `GS-O004`) and `docs/_shared/GS-R001-R-REMEDIATION.md` §3.

**Classes:** **OA** owner answered (an owner decision is already recorded) · **IF** implementation fact
(the code or systems settle it) · **LR** legal requirement (only one lawful option) · **SD** safe
conservative default (already drafted; needs no answer unless the owner wants something different) ·
**OD** genuine owner decision · **EX** external evidence required (a fact only the owner or a third party
can supply).

**What the register missed.** It did not cite four owner decisions already on record. In three of
them its recommendation would reverse or ignore the existing answer:

- **D-1 VAT.** The owner stated on 2 September 2026 that Gridsmith Ltd is not VAT registered (commit
  `f666202`), and `companyDetails.ts` builds on that. The GS-LEGAL-001 brief called the status
  "unknown".
- **D-16 phone.** `GS-R001-R` (17 September) decided the published number is **not a voice-call
  channel**; `tel:` links are refused by `check:company`. The register's ★ ("accept calls or voicemail")
  would reverse that without citing it.
- **D-17 registration wording.** `GS-O004` (16 September) chose "Registered in England", taken from
  the Companies House register entry, whose "England" is the **address** line, not the jurisdiction
  (D report, D2). The six drafts now say "registered in England and Wales", which D2 recommends as
  matching Companies House guidance exactly.
- **D-21 data-protection fee.** `GS-O016` (17 September): registered and paying the fee.

**Reading "owner's v2.0 set".** Commit `f666202` records the owner's own revised legal text of
2 September 2026, which became the v2.0 drafts. That shows what the owner chose then. **It is not
adoption under `GS-O003-R`**, which did not exist until 6 October.

| ID | Decision | Class | Evidence and reason | Owner action |
|---|---|---|---|---|
| D-1 | VAT status | **OA** (+ re-confirm) | Owner, 2 Sep 2026 (`f666202`): not registered; `lib/company/companyDetails.ts:6`; `check-vat-display.mjs`. A tracker note of 18 Aug (`master/PROJECT-TRACKER.md` Q-M1) said registration was "in progress", hence the re-confirmation. The drafts are VAT-neutral either way | One-line confirmation in §4 (C-1) |
| D-2 | B2B liability cap | **OA** (base) + **SD** (retainer limb) | The fees-under-the-Scope cap was in the owner's v2.0 text; the 12-month retainer limb is new. No PI cover (`GS-O005`, `GS-O024`) | Choose an option in §6 (O-4) |
| D-3 | Deposits / advance payments | **SD** + **LR** (consumer) | Matches the owner's stated refund intent (`00-BRIEF.md`). "Never non-refundable" for consumers is strongly indicated (CMA37 6.60–6.62; CRA s. 62); A-21 records that a small genuine deposit can be kept only in clear and narrow circumstances | None |
| D-4 | Technical scope | **EX** (`GS-X002`) + **SD** (boundary) + **OD** (consumer limb, deferrable) | Technical is unpublished and gated by `check:launch` and the migration. The drafted "no construction drawings" boundary is not yet reflected in the `GS-X002` review pack or in `service-content.mjs:426` | Deferred (§4.5) |
| D-5 | International clients | **OA** + **LR** | The owner's business model (`00-BRIEF.md`) accepts overseas clients; the home-law sentence follows Rome I Art. 6(2) | None |
| D-6 | Processor terms and transfers | **EX** + **LR** | No DPA acceptance recorded for any processor (`02-CITATION-LEDGER.md`, `06-FINAL-VERIFICATION.md`); Edge Functions not region-pinned; Resend region unknown. Art. 28 terms are mandatory | Provider facts in §4 (O-2) |
| D-7 | Retention | **OD** + **IF** | No deletion routine exists; 63 Production leads plus an off-repository `pg_dump` backup (`GS-PROD-003-R1.md`) are held | Adopt §5 (O-1) |
| D-8 | Marketing | **IF** + **SD** | No form offers opt-in or refusal (`PressContactFlow.tsx`). For **individual subscribers**, PECR reg. 22 therefore leaves "none" as the only lawful option today. Email to corporate subscribers is outside reg. 22 (reg. 23 still applies; `00-LEGAL-BASIS.md` `L-PECR-22`), so B2B marketing would be an owner choice. The draft's "none" is the safe default | None |
| D-9 | Early start, stage table, templates | **SD** + **LR** (template content) | No quotation template existed anywhere in the repo; §7 supplies one | Adopt §7 (O-3) |
| D-10 | How clients accept | **SD** + **LR** + **IF** | No portal, e-signature or payment-link integration exists; the reg. 14 acknowledgement is mandatory | Covered by O-3 |
| D-11 | Goods (printed copies) | **SD** | Services only, consistent with published Press copy. The record's "or under a separate later contract" is stale (§2, N-3). Business limb (G-23): applying the same rule (client buys print directly) avoids the need for a goods clause | Covered by O-3 (template rule) and C-5 (Press copy) |
| D-12 | Consumer retainers / maintenance | **SD** | Fixed term, single payment, no auto-renewal; DMCCA s. 254 announced for January 2027 | None |
| D-13 | Gridsmith own-reason termination | **OA** (business) + **SD** (consumer limb) | The business limb was in the owner's v2.0 text. The consumer limb (Cons 8 ¶4, with full refund and keep-paid-work) is new; v2.0 had no consumer equivalent (A §5) | None (Confirmation C-4 covers its 14-day notice) |
| D-14 | AI disclosure | **SD** | — | None |
| D-15 | Ghostwriting waivers | **SD** + **EX** | The terms promise signed waivers from each writer. No writer agreements exist in the repo. Moral rights belong to the individual author even where Gridsmith owns the copyright, subject to the employee-works exceptions (CDPA ss. 77, 79(3), 81–82, 87; *recorded by B/F, not re-read here*). If the owner is not employed by Gridsmith Ltd, Gridsmith does not own the owner's copyright without a signed assignment (s. 90(3)) | Operational precondition in §4 (P-2) |
| D-16 | Complaints telephone | **OA** (`GS-R001-R`) | Default: keep the number as "WhatsApp or text", which the drafts already say. The register's ★ is withdrawn. Residual risk: CCR Sch. 2(c) asks for a telephone number "where available", and the PSR reg. 7(2)(b) point is UNVERIFIED (G). Low | Confirmation C-2 |
| D-17 | Statutory registration wording | **OA** (`GS-O004`) + **EX** (certificate) | The footer says "registered in England"; the six drafts say "registered in England and Wales". Under SI 2015/17 reg. 25, D rates "England" a partial match (medium) and recommends "England and Wales", confirmed against the certificate (D report, D2). The two should match | Confirmation C-3 |
| D-18 | Marketplace projects | **SD** + **EX** | Freelancer terms on project contracting and off-platform payment are unread (only review use was read at H4-C) | Operational precondition P-3 |
| D-19 | Numbers in §6 | **SD** (four are **OA** from v2.0: 5 working days for complaints/accessibility, 14-day invoices, 10 working days review) | The rest are drafted defaults | Confirmation C-4 |
| D-20 | Site copy changed in GS-LEGAL-001 | **LR/IF** (privacy link; no acknowledgement promise) + **OD** (Press sentence) | `ContactForm.tsx` fixes correct a false statement and add the Art. 13 link. The Press "summarise our client terms" sentence and the printing copy (§2, N-3) are owner copy | Confirmation C-5 |
| D-21 | Data-protection fee | **OA** (`GS-O016`) | Registered and paying; the number is not supplied and is not needed by any document | None |
| D-22 | Particulars on business documents | **LR** | SI 2015/17 regs 24–26. The §7.2 template and the §7.3 signature block carry name, legal form, part of the UK (per C-3), number and registered office, and name no director, which reg. 26 permits | None (built into §7) |
| D-23 | In-flight engagements | **LR** + owner fact | Existing contracts continue on their own terms (CRA s. 50(4)); new quotations name the version | None (for information: list any live engagements when adopting) |
| D-24 | Development dataset reseed | **IF** (phase authorisation) | Not a legal or commercial choice; development reseeds have precedent (`07-STATE-REPORT.md` §2.1). Served parity stays red until it runs | Authorisation A-1 |
| D-25 | Adoption | **OD** | By construction: only the owner records `ownerAdoptedOn`/`ownerAdoptedVersion` | Final step, §4 |
| D-26 | Quotation validity | **SD** | A field in every quotation (§7.2); a standard period is a convenience | Covered by O-3 |
| D-27 | Press content responsibility | **SD** | No indemnity; a B2B indemnity only by later owner choice | None |
| D-28 | Instalments | **LR** | RAO art. 60F(2) conditions; see §2 N-1 for the two template rules | None (built into §7) |
| D-29 | Production cookie re-test | **EX** | A cutover test (`curl -I` and a browser on gridsmith.uk) before the Cookie Policy is `PUBLISHABLE` | Authorisation A-2, at cutover |
| D-30 | "Engineering drawings" naming | **EX** (`GS-X002`) | The name is owner-approved (`GS-O006`); its reconciliation belongs in the `GS-X002` review | None now |
| **N-4** (new) | Ready-made digital products | **SD** | Not sold today; Consumer 3.0 is services only. Selling templates, e-books or presets would need a reg. 37 flow and a redraft | None unless such products are planned |

**Count, by primary class (first listed), across 31 items (D-1 to D-30 and N-4):** 7 OA, 12 SD, 4 LR,
4 EX, 2 IF, 2 OD. Counting limbs as well, only **four genuine OD items** remain: the D-4 consumer limb
(deferrable), D-7, the D-20 Press sentence and D-25. On top of those are the commercial choices in O-3
and O-4, and the provider evidence in O-2. Every OA or SD item that still needs a word from the owner is
bundled into the confirmations in §4.

**Record hygiene found in passing (not changed here except as stated in §9):**

- `OWNER-ACTIONS.md` said "decide D-1–D-25", but the register runs to D-30. **Corrected in this phase:**
  the `GS-O003-R` entry now points at §4 of this pack (§9).
- `03-REVISION-LOG.md` and `07-STATE-REPORT.md` use an **older D-1…D-11 numbering with different
  meanings** (there D-1 is the VAT number and D-5 retention), so the IDs can be confused.
- Stale lines remain in `BEFORE-LAUNCH.md` §2 (VAT), `PRE-DEPLOYMENT-CHECKLIST.md` A7 (ICO) and
  `01-FACTUAL-INVENTORY.md` (VAT; Supabase region).
- The Freelancer review-permission blocker (H4-C-R1) is a legal and commercial production blocker that
  sits outside this register. It bears on Privacy §2A only in that §2A says reviews "may" be shown.

## 4. The decisions the owner actually has to make

Each item gives the recommended answer (★). Answering with ★ is enough; any other answer is also valid
and changes what the next phase does. **Nothing here is decided on the owner's behalf.**

### 4.1 Decisions

| # | Decision | Options | ★ Recommendation | Blocks |
|---|---|---|---|---|
| **O-1** | **Retention (D-7)** | (a) adopt the §5 schedule and the §5.2 monthly routine, review the 63 leads per §5.3, then replace the Privacy §8 marker with §5.4; (b) different periods (state them); (c) criteria only, as drafted, with the marker replaced by a review commitment | **(a)** | Privacy |
| **O-2** | **Processor and transfer facts (D-6, R12–R14)** | Supply from the provider accounts: (1) Hostinger, Supabase and Resend data-processing terms accepted on the accounts used — yes/no for each; (2) the transfer safeguard each relies on (UK adequacy, UK–US data bridge certification, or the UK IDTA/Addendum in its terms); (3) Resend's sending region and log retention; (4) Hostinger's access-log retention; (5) Supabase backup retention on the plan used; (6) Supabase platform, API and Edge Function log retention (these logs hold IP addresses); (7) Hostinger mailbox backup retention; (8) confirmation that `SLACK_LEADS_WEBHOOK` is unset in every deployed environment (`lib/leads/notify.ts:54`), since otherwise Slack is an unlisted recipient | Supply all eight. The two Privacy markers (§6, §7) and R12–R14 are then filled from the answers and nothing else | Privacy |
| **O-3** | **Consumer contracting workflow (D-9, D-10, D-26, D-11, D-28)** | (a) adopt §7 as the only way consumer contracts are made: email/e-signature acceptance, standard start by default, stage table in every quotation, the confirmation email before work, and the template rules (no printing bought and recharged; after twelve deferred payments or 12 months, payment in advance); (b) adopt with changes; (c) offer no early start (standard start only) | **(a)**, with a standard quotation-validity period the owner chooses | Consumer terms (the terms promise these steps; they cannot be adopted without a way to keep them) |
| **O-4** | **Business liability cap (D-2)** | §6 options A–E | **A + E**, with D used case by case. A is the owner's existing v2.0 choice; E is one added sentence | Business terms |
| **O-5** | **Wording changes proposed by this check** | Accept or reject each: (1) Bus 2 fallback for the deferred-payment limit; (2) "within the 12 months beginning with" in Cons 4 / Bus 5; (3) N-2 tie-in sentences in Cons 9 / Bus 13; (4) cap option E (if O-4 = A + E). Any accepted change moves Consumer or Business to **3.1** before adoption | Accept (1)–(4). (2) and the balancing-payment point are also covered operationally by O-3's template rule, so rejecting (2) is low risk | Consumer and business terms |

### 4.2 One-line confirmations (say "confirmed" or give the change)

C-1 to C-4 each have a recorded owner answer or a safe default. C-5 is a small owner copy decision
(D-20, OD) together with a new proposal arising from N-3.

| # | Confirm | Default if confirmed |
|---|---|---|
| **C-1** | Gridsmith Ltd is **still not VAT registered** (D-1; owner statement 2 Sep 2026) | Nothing changes; documents stay VAT-neutral; quotations say no VAT is charged |
| **C-2** | The published number stays **WhatsApp or text only**, not a call line (D-16; `GS-R001-R`) | Documents unchanged; the register's "accept calls" ★ is withdrawn |
| **C-3** | The statutory registration wording, taken from the **certificate of incorporation** (D-17): "England" (`GS-O004`, current footer) or "England and Wales" (current draft headers) | Whichever the certificate says is used in both; the other side is aligned in its own phase (footer = site phase; drafts = text edit before adoption) |
| **C-4** | The drafted numbers in `GS-LEGAL-001-RECORD.md` §6 (D-19) | Kept as drafted |
| **C-5** | Site copy (D-20): the Press sentence "These summarise our client terms, which govern if anything here differs"; and the Press printing copy, proposed as "Printing is done by a printer you contract with and pay directly; we coordinate the specification with them" | Press sentence approved; printing copy changed in a later site phase (not done here) |

### 4.3 Operational preconditions (not decisions; true before the first contract on the new terms)

| # | Precondition | Why |
|---|---|---|
| **P-1** | The §5.2 monthly routine is running before Privacy §8 says it is | Otherwise the published sentence is false |
| **P-2** | A signed moral-rights waiver from every person who writes ghostwritten text, including the owner personally; and, if the owner is not employed by Gridsmith Ltd, a signed assignment to Gridsmith Ltd of copyright in work the owner creates (D-15; CDPA s. 90(3)) | Cons 10.2, 13 and Bus 9.3, 13 promise the waivers and the transfer chain |
| **P-3** | Before moving any Freelancer project off-platform, read the platform's terms on that (D-18) | Bus 1 relies on them where they cannot be varied |

### 4.4 Authorisations for later phases (not legal decisions)

| # | Authorise | Effect |
|---|---|---|
| **A-1** | A development-dataset reseed of the seven legal documents (D-24), once the versions to be adopted are final | `check:legal:parity` turns green against development; no production effect |
| **A-2** | The production cookie re-test at cutover (D-29) | Required before the Cookie Policy is `PUBLISHABLE` |

### 4.5 Deferred (does not block adoption)

- **D-4 consumer limb:** whether Technical drawing work is offered to consumers at all. Consumer §12
  already limits it, and Technical is unpublished until `GS-X002` closes. Decide in `GS-X002`.

### 4.6 Adoption order and per-document readiness

Adoption (D-25) comes last and is per document and per version. The owner records `ownerAdoptedOn` and
`ownerAdoptedVersion` in `docs/_legal/GS-O003-R-REGISTER.json`; no script or agent sets them.

| Document | Version now | What must be answered first | Version at adoption |
|---|---|---|---|
| Website Terms | 2.1 | C-1, C-3 | 2.1 (or 2.2 if C-3 changes the header) |
| Cookie Policy | 2.1 | C-3; A-2 before `PUBLISHABLE` | 2.1 / 2.2 |
| Accessibility Statement | 2.1 | C-3, C-4 (its 5 working days) | 2.1 / 2.2 |
| `/legal/client-terms` (seed) | 2.1 | — | 2.1 |
| Client Terms for Business Clients | 3.0 | C-1–C-4, O-4, O-5 | 3.0, or 3.1 if O-5 is accepted **or** C-3 changes the header |
| Client Terms for Consumers | 3.0 | C-1–C-5, O-3, O-5 | 3.0, or 3.1 if O-5 is accepted **or** C-3 changes the header |
| Privacy Policy | 2.1 | C-3, O-1, O-2, P-1, and R17 handled | 2.2 (the three markers are replaced, so the text changes) |

Any text change before adoption is made in `docs/_legal/` (never in the seed). It then needs
`check:legal:adoption`, regeneration of the migration manifest (`--write-manifest`, because the manifest
embeds the register state), and, once A-1 runs, served parity.

## 5. Retention schedule (proposal for D-7)

**What the law fixes and what it leaves to the owner.** UK GDPR Art. 5(1)(e) requires personal data to
be kept no longer than necessary for its purpose, and Art. 13(2)(a) requires the privacy notice to state
the period or the criteria for it. The law sets no period for enquiries or client records; the controller
chooses and must be able to justify it (ICO storage-limitation guidance, seen in this session only as a
search-result summary; the page itself is blocked here). Two external periods anchor the proposal:

- **Company and tax records:** keep for **6 years from the end of the last company financial year they
  relate to**, longer for transactions spanning accounting periods or for a late Company Tax Return
  (GOV.UK, *Running a limited company: company and accounting records*, seen as a search-result summary). The
  Companies Act 2006 s. 388 minimum for a private company is shorter (3 years), so the HMRC period
  governs.
- **Limitation of claims:** 6 years for contract and most tort claims (Limitation Act 1980 ss. 2, 5);
  latent-damage negligence runs 3 years from knowledge, with a 15-year longstop (ss. 14A–14B); 12 years
  for a deed (s. 8).

*Both bullets are **UNVERIFIED in this repository**: no A–G report or ledger entry records s. 388 or the
Limitation Act. They are stated from search-result summaries only (GOV.UK, HMRC CH14600, law-firm
briefings) and should be read at source before anything relies on the exact periods.*

### 5.1 The schedule

Periods are proposals. Each is the shortest that still serves the stated purpose; the owner may choose
longer only with a reason that can be written down.

| # | Data | Where it lives today | Proposed period | Trigger (clock starts) | Why this period | Action at end |
|---|---|---|---|---|---|---|
| R1 | **Enquiry that did not become a project** (lead row: name, email, phone, company, message, budget band, timeline, Press answers, manuscript link) | Supabase `public.leads` (Ireland) | **12 months** | `created_at`, extended only where `notes` records a later contact date (the table has no last-contact column; adding `last_contact_at` is a later, separately authorised task) | Lets a stalled enquiry be picked up and a quotation be re-issued; nothing in law needs longer | Delete the row (where the outbox exists, its row cascades — R10) |
| R2 | **Enquiry marked spam / abusive** | `public.leads` with `status = 'spam'` | **30 days** | Date marked | Time to confirm the classification | Delete |
| R3 | **Internal notification email** (name, email, company, phone, studio, enquiry type, reference) | `contact@gridsmith.uk` mailbox (Hostinger) | **Same as the lead it announces** (R1, R2 or R4) | As the lead | It duplicates the lead; keeping it longer defeats R1 | Delete from inbox and from mailbox trash |
| R4 | **Enquiry that became a project** | `public.leads` | **Move into the client record (R5), then delete the lead row within 30 days of contract** | Contract date | The client record is the authoritative copy | Delete lead row |
| R5 | **Client contract record**: quotation, acceptance, early-start statements and timestamps, confirmation email, change quotations, cancellation notices and calculations, signed IP-transfer confirmation, delivery records | Mailbox and the business's document store | **6 years after the end of the financial year in which the project ended** | Project end (final delivery, cancellation or termination) | Covers HMRC's 6 years and the 6-year contract limitation period; CCR reg. 17 puts the burden of proving the pre-contract steps on Gridsmith | Delete, except R7 items |
| R6 | **Accounting records**: invoices, receipts, payment records | Accounting system / bank | **6 years from the end of the last financial year they relate to** (longer where GOV.UK says so) | Financial year end | HMRC requirement | Delete |
| R7 | **Title documents**: signed IP-transfer confirmations, writers' moral-rights waivers, subcontractor assignments, portfolio consents | Document store | **For as long as the rights or the consent are relied on, plus 6 years** | End of reliance (e.g. consent withdrawn, Gridsmith ceases trading) | They prove the chain of title Gridsmith promises the client (Cons 13; Bus 9.3) and the consent it relies on (Cons 14; Bus 9.4) | Delete |
| R8 | **Project working files and client materials** | Working storage | **Return or delete within 90 days of project end**, unless the quotation or Scope says otherwise or the client asks Gridsmith to keep them | Project end | Purpose ends at handover; R5 keeps what proves the contract | Delete; keep only what R5/R7 require |
| R9 | **Complaints and rights requests** (including DPA 2018 s. 164A data complaints) | Mailbox | **With the client record (R5) if there is one; otherwise 2 years after closure** | Closure | Evidence of how it was handled; 2 years is an owner choice, no statutory period | Delete |
| R10 | **Duplicate-detection fingerprint and outbox state** (`request_digest`, attempts, timestamps) | `gridsmith_private.notification_outbox` — **Supabase Preview only today**; Production once H4-B is promoted (`AI-HANDOFF.md` H4-B: "Production migration plan NOT applied"). The 63 Production leads have no outbox row | **Deleted with the lead** (cascade); `sent` rows may be pruned after 30 days | Lead deletion / send | Only needed to stop duplicate submissions | Cascade or prune. Preview holds only synthetic or probe rows; delete them under R2's routine |
| R11 | **Press Path Finder results** | `public.press_path_results` (column `expires_at` = 90 days) | **90 days**, as the table already declares | Creation | Already the designed period | **No write path exists today** (0 rows recorded 2 Oct; nothing reads `expires_at`). If one is built: (a) the 90-day job must exist before results are written; (b) `lead_id references leads(id)` has **no on-delete action**, so linked results must be deleted or nulled before their lead, or the foreign key migrated to `on delete set null` |
| R12 | **Hosting access logs** (IP address, browser details) | Hostinger | **Provider's period** | — | Not under Gridsmith's control | **External evidence required:** record Hostinger's period, then state it in Privacy §8 |
| R13 | **Email-delivery logs** of the notification | Resend | **Provider's period** | — | As R12 | **External evidence required:** record Resend's log retention for the plan used |
| R14 | **Database backups** | Supabase | **Provider's backup cycle** | — | Deletions reach backups when the backup rotates | **External evidence required:** record the plan's backup retention |
| R15 | `gs_consent` cookie | Visitor's browser | **365 days** (the site's own setting, `lib/consent/state.ts`) | Set on *Got it* | Already stated in the Cookie Policy | Expires in the browser |
| R16 | **WhatsApp / text messages**, including WhatsApp cloud chat backups | Owner's phone; the backup provider | **As R1** for an enquiry; **as R5** where it forms part of a project record | As R1/R5 | Same purpose as email | Delete the chat (and it leaves the backup when the backup rotates) |
| R17 | **Manual database exports (`pg_dump`) and any restore-test database** | Owner's machine, outside the repository (`GS-PROD-003-R1.md` §7: `%USERPROFILE%\gridsmith-backups\supabase-production-*.dump`, holding all 63 leads) | **Delete when superseded.** Re-take or delete after each §5.2 deletion run; delete any restore-test database when the test ends | Each deletion run | Otherwise deleted leads survive in the export and Privacy §8 becomes untrue | Delete the file |
| R18 | **Other mailbox correspondence** (direct email enquiries, Sent items) | `contact@gridsmith.uk` | **As R1** for an enquiry; **as R5** for a project | As R1/R5 | Same purpose | Delete, including Sent and trash |
| R19 | **Freelancer review text** shown on the site | Sanity CMS | **While displayed**, and until removal on request (Privacy §2A) | — | Already stated in §2A | Delete the document |
| R20 | `public.events`, `public.sample_grants` | Supabase | **No data held** (0 rows on 2 Oct; no writer since analytics were removed) | — | — | If a writer is ever added, schedule it first |

### 5.2 Deletion routine (the condition the draft attaches to fixed periods)

Privacy §8's marker asks for periods **and** a deletion routine, and `GS-LEGAL-001-RECORD.md` D-7
recommends stating periods only once a routine exists. The smallest routine that makes the schedule
true:

1. **Monthly, first working day** — the owner (or a later scripted task) runs a read-only count of
   leads past R1/R2/R4, records the count, then deletes them and records the number deleted. The R1
   clock is `created_at`, unless `notes` records a later contact (R1). The same session clears R3/R18
   mail past its period from the mailbox, Sent items and trash, and re-takes or deletes any R17 export.
2. **Quarterly** — prune R10 outbox rows (and R11 rows, once a writer exists; they must go before their lead — see R11); confirm R8 project
   files for projects ended more than 90 days ago have been returned or deleted.
3. **Annually, after the financial year end** — delete R5/R6 records whose 6-year period has ended.
4. **Log** — a one-line entry per run (date, counts, who ran it) kept with the R9 records, which is the
   evidence Art. 5(2) accountability asks for.

Automating step 1 (for example a scheduled database job) is an implementation task for a later,
separately authorised phase. It is not started here and it changes no production system.

### 5.3 The 63 Production leads

Production Supabase holds 63 leads (`GS-PROD-003-R1`). Before Privacy §8 states R1, the owner should:

1. identify which of the 63 became projects (they move to R5 and the rows are deleted under R4);
2. delete those whose last contact was more than 12 months ago (R1) and any spam (R2); and
3. keep the rest and let the monthly routine take them as they pass 12 months;
4. delete or replace the 2 October 2026 `pg_dump` (R17) once steps 1–2 are done, and record it; and
5. identify which rows are test or probe data and what notice was shown when they were collected
   (open question C D2(d)).

**Nothing was read from or written to Production in this phase.** The count is the recorded figure,
not a fresh reading.

### 5.4 Privacy §8 wording once the schedule is adopted (proposal)

> We keep enquiries that do not lead to a project, including the internal email that tells us about
> them and any messages about them, for 12 months after we receive them or after our last contact with
> you, and spam for 30 days. If your enquiry leads to a project, we keep the project and contract
> records for six years after the end of the financial year in which the project ends, because of tax
> law and the time within which legal claims can be brought. Documents that prove who owns work we
> created, such as signed transfers and waivers, are kept for as long as those rights are relied on and
> for six years after that. Complaints are kept with the project record or, if there is none, for two
> years after they are closed. We return or delete project files within 90 days after a project ends
> unless we agree otherwise with you. Our hosting, email-delivery and database providers keep technical
> logs and backups for their own periods: [R12–R14 from O-2]. We check monthly for enquiries that have
> reached the end of their period and delete them.

It **replaces §8 ¶2 in full**, including "We do not currently delete general enquiries automatically…"
and the marker. §8 ¶1 (criteria) and ¶3 (accounting records) are kept. The last sentence must stay
true: adopt it only once the routine in §5.2 is running (P-1) and R17 is handled, and fill in R12–R14
first. **R8 note:** deleting Gridsmith's own copy of the final delivered set could weaken its defence of
a claim within R5's six years. The owner may prefer "keep the final delivered set with R5; delete
client-supplied material and personal data within 90 days". Any future Technical work may warrant a
longer period because of the 15-year latent-damage longstop.

## 6. Liability-cap options (for D-2)

**The law.** Between businesses a cap must satisfy the UCTA 1977 reasonableness test (ss. 2(2), 3,
11(1)), assessed when the contract is made; the burden is on Gridsmith (s. 11(5)). For a cap of a
specified sum, the court has regard in particular to the resources Gridsmith could expect to have to
meet the liability and **how far it was open to Gridsmith to cover itself by insurance** (s. 11(4)).
*Recorded at High confidence in `B-business-terms.md` §1/§3 (read at source 6 Oct 2026); not re-read
in this phase.* Consumers get no cap, by design. A recommends against one, and any cap would face CRA
s. 57(3) and the s. 62 fairness test. Consumer §17 limits recovery to foreseeable loss, which is the
general law, and keeps every non-excludable liability (CRA ss. 47, 57, 65).

**Facts that bear on reasonableness.** Gridsmith carries no PI cover and does not make it a launch
prerequisite (`GS-O005` closed by owner; `GS-O024` deferred). Under s. 11(4)(b) the absence of
insurance can support a lower cap only where insurance was not reasonably available. If cover was
available at reasonable cost and was not bought, B records that its absence **may weigh against** a low
cap. Under s. 11(4)(a), the limited resources of a small company support a modest cap. Technical drawing work is limited
by Business §12 and stays unpublished until `GS-X002` closes.

**What the draft says now (Business §16).** Per Scope: total fees paid and payable under that Scope;
for a retainer or periodic Scope, fees paid and payable in the 12 months before the event; a different
limit stated prominently in a Scope replaces it; no self-referential saver; indirect/consequential loss
and loss of profit excluded; the cap does not reduce the client's payment obligation.

| Option | Shape | For the client | For Gridsmith | Reasonableness view (UCTA s. 11) |
|---|---|---|---|---|
| **A — as drafted** | 100% of Scope fees (12 months' fees for retainers) | Familiar; the cap is never below what the client paid | Exposure never exceeds revenue from the job | **Recommended default.** Tied to the value of the contract, a mutual exclusion of indirect loss, no saver, clear wording, and a route to negotiate a different figure in the Scope. Strongest where the work is creative/digital and the loss a client could plausibly suffer is near the fee |
| **B — fees with a floor** | Greater of Scope fees and a fixed sum the owner chooses | Better protection on small jobs | Exposure on small jobs rises to the floor | More robust on very small Scopes, where a cap of the fee alone could look nominal. The floor is an owner figure; this pack proposes none |
| **C — multiple of fees** | e.g. a stated multiple of Scope fees | More headroom | Exposure above revenue with no insurance behind it | Easier to defend as reasonable; harder to fund. Only sensible once insurance is in place |
| **D — Scope-specific cap** (already possible under A) | A figure written prominently in a particular Scope | Negotiated | Used for high-value, Technical or data-heavy work | Individually negotiated caps carry more weight; keep the "prominently" requirement |
| **E — retainer start-up fix** | For retainers, sentence below | Avoids a near-zero cap in the first months | Raises the cap in the first year only | Small drafting improvement to A; worth adopting with A |

**Option E text (proposal):** in Business §16 ¶2, replace "the fees paid and payable in the 12 months
before the event giving rise to the claim" with "the greater of (i) the fees paid and payable in the
12 months before the event giving rise to the claim and (ii) the fees payable for the first 12 months
of that Scope (or for its whole term, if shorter)".

**Points the owner should know whichever option is chosen:**

1. **Data-protection claims sit inside the cap.** Clause 23 (Art. 28 schedule) has no separate limit.
   Business clients that hand over personal data sometimes ask for a higher "super-cap" for data
   breaches. Recommendation: keep one cap; consider a higher Scope-specific figure (option D) only where
   a Scope involves substantial personal data.
2. **No IP indemnity is offered** (Business §9.5 is a warranty, not an indemnity). Keep it that way
   unless a client insists, and then only per Scope (D-27 is the Press-content version of this choice).
3. **Late-payment interest and the client's payment obligation are outside the cap** (as drafted).
4. **Marketplace projects** (D-18): where the platform's terms cannot be varied, the platform's
   liability terms may govern instead.

**Recommendation:** adopt **A + E**, use **D** case by case, revisit **B/C** if PI cover is ever bought
(`GS-O024`). Adopting E is a one-sentence change to Business §16 and would move the draft to 3.1.

## 7. Consumer contracting workflow (for D-9, D-10, D-26)

These templates implement **Client Terms for Consumers v3.0** exactly. They are operational documents
sent by email. They are not served on the website and they change no draft. The CCR wording rests on
the A report's reading of regs 13, 14, 16, 30–38 and Schs 2–3 on 6 October 2026 (`A-consumer-law.md`
§6–§7) and on G-01 for reg. 14; it was not re-read at source in this phase.

Square brackets are fields filled per project. **No price, percentage, period or figure in this section
is a policy value.** The owner sets each one in each quotation.

### 7.1 The sequence

| Step | What happens | Terms clause | Legal hook | Never |
|---|---|---|---|---|
| 0 | **Classify.** Ask "Is this for a business, or for you personally?" and record the answer. A business buyer confirms in writing (Cons 1) and goes to the business terms | Cons 1; Bus 1 | CRA s. 2(3)–(4) (burden on Gridsmith) | Assume business status from a company-sounding email |
| 1 | **Quotation by email** (PDF + body), with the terms PDF and the cancellation form attached | Cons 3 | CCR reg. 13, Sch. 2; DMCCA s. 230; E-Commerce reg. 9(3) | Send a price only in a chat or call |
| 2 | **Acceptance in writing** using the acceptance sentence; the start option chosen in the same reply | Cons 3, 6.4 | CCR reg. 14(2)–(5); reg. 36(1) | Treat payment, silence, "sounds good" or "go ahead" as acceptance |
| 3 | **Confirmation email** before any work and before asking for payment | Cons 3 | CCR reg. 16 | Start work first |
| 4 | **Payment request** on the agreed schedule (refundable during the 14 days) | Cons 3, 4 | CCR reg. 34; RAO art. 60F(2) | Ask for payment before acceptance; call anything non-refundable |
| 5 | **Start** on the day after the 14 days end (standard) or after a valid early-start request | Cons 6.4 | CCR reg. 36 | Start early on a verbal request |
| 6 | **Keep the record** (R5 in §5) | Cons 6.5 | CCR reg. 17 (burden of proof) | Delete the acceptance or the statements |

**Template rules.** These close the §2 gaps without a redraft:

1. **Deferred payments.** This applies to a consumer, or to a business client who is an individual,
   partnership or other unincorporated body. No payment for work already supplied may **fall due**
   later than 12 months after the contract date, and there may be no more than twelve such payments.
   Plan the schedule so that:
   - any stage whose payment would fall due after that date (allowing for the 14-day invoice terms)
     is invoiced in advance; and
   - a balancing payment under Cons 7/8 or Bus 3, 6.2, 7 or 18 either falls due before that date or is
     covered by a payment in advance.

   Whether a contingent termination payment counts under art. 60F(2) is **UNVERIFIED**, which is why
   the schedule is planned to avoid the question. Never add interest or a fee for paying later (RAO
   art. 60F(2)). Whether statutory late-payment interest (Bus 5) on a deferred payment by an individual
   or small partnership affects the exemption is also **UNVERIFIED**. It is a reason to keep such
   clients on advance or on-delivery payments.
2. **Printing.** Gridsmith never buys printed copies and recharges them to a consumer. The consumer
   contracts with and pays the printer directly (Cons 6.1). The same rule applies to business clients
   unless a later decision adds a goods clause (D-11, G-23).
3. **Supplier costs in the 14 days.** Commit no consumer to a supplier cost that cannot be cancelled or
   refunded during the cancellation period (Cons 4).

**Contract channel.** Make every consumer contract by email or e-signature, never at or immediately
after an in-person meeting (A §7.1; CCR reg. 5). If a consumer insists on agreeing in person, stop and
treat it as a separate decision: off-premises contracts need the information on paper unless the
consumer agrees otherwise (reg. 10) and omitting the cancellation information is an offence (reg. 19).

**Working out the 14 days.** The period ends 14 days after the day the contract is made (Cons 6.1;
CCR reg. 30). Contract made on [day 0] → the period ends at the end of [day 0 + 14]. Write the date in
the confirmation. This assumes the quotation carried the cancellation information. If it did not, the
period runs up to 12 months longer (reg. 31), and the template exists to prevent that.

### 7.2 Quotation template

```
Gridsmith Ltd — Quotation [reference]                         Date: [date]
Gridsmith Ltd, a private limited company registered in [C-3 wording], company number 17050842
Registered office: 30 Briarfield Road, Farnworth, Bolton, BL4 0HD
contact@gridsmith.uk · WhatsApp or text +44 7405 448534 · Studio: Gridsmith [Design/Digital/Press]

For: [client name], [postal address]  — buying as an individual, wholly or mainly for purposes
outside your trade, business, craft or profession

This quotation is open for you to accept until [date].
Your contract will be on our Client Terms for Consumers, version [3.0], attached as a PDF.

1. WHAT YOU GET
   Services and deliverables: [list]
   Formats, platforms and devices (digital work): [list, or "not applicable"]
   Revision rounds: [number] per deliverable  (a revision round is one set of your comments on a draft)
   Not included: [list]
   Assumptions: [list]
   [Technical drawing only] We prepare drawings and documentation to your brief. We do not provide
   engineering design or calculations, certification, approval, stamping or sign-off, or drawings for
   construction or building work.
   [If generative AI tools will be used] We will use generative AI tools for: [what].
   [If any deliverable is licensed rather than transferred] Licensed, not transferred: [item and licence].
   Third-party material included, used under its own licence (fonts, stock, software): [list or "none"]
   Working/source files supplied: [list or "none"]
   [Press] ISBN holder: [you / other]. Named publisher: [you / other]. Accounts opened in: [your name].
   [Ghostwriting] Authorship and credit will be stated as: [ ]. Writers' waivers: [obtained by us /
   not required because …].
   [Digital] Domains, hosting and accounts registered in: [your name].
   [Support/maintenance] Fixed period [dates], paid in one payment of £[ ] before it starts,
   no automatic renewal.

2. TOTAL PRICE
   Total price: £[ ]   [or, where it cannot reasonably be calculated in advance, how it will be
   calculated]   [VAT statement — wording depends on confirmation C-1]
   Costs payable to other suppliers (not in the total unless stated):
     [item] — paid by [you directly / us with your written agreement] — £[ ] [or how it is calculated]
   Printed copies are not part of this contract; you buy them directly from the printer, on the
   printer's terms.

3. PAYMENT
   [Schedule, e.g. on acceptance / at each stage / instalments: amount and due date of each payment]
   No payment is asked for until you accept. Any advance payment is refundable as set out in the terms.
   [If any payment falls due after the work it pays for: no more than twelve such payments, all due
   within 12 months of the contract date, with no interest or fee — plan per §7.1 rule 1.]

4. TIMETABLE
   [Start date or how it is fixed — see section 7 — and the delivery date for each stage]

5. STAGE TABLE  (used only if you cancel or end the project early — terms sections 6 and 7)
   Stage | What the stage covers | Share of total price | How progress within the stage is measured
   1     | [ ]                   | [ ]% (£[ ])          | [e.g. drafts delivered / chapters completed /
                                                           hours recorded against an estimate of [ ] hours]
   2     | [ ]                   | [ ]% (£[ ])          | [ ]
   ...                            total 100% (£[total])

6. YOUR RIGHT TO CANCEL
   You can cancel this contract within 14 days without giving any reason. The 14 days end 14 days
   after the day the contract is made. To cancel, tell us clearly by email to contact@gridsmith.uk or
   by post to the address above. You can use the attached cancellation form, but you do not have to.
   You have cancelled in time if you send your message before the 14 days end.
   If you cancel, we refund what you have paid within 14 days of the day you tell us, by the payment
   method you used, without any fee — less, only if you chose an early start, the amount for work
   already carried out (below).
   If you ask us to start work before the 14 days end and then cancel within the 14 days, you pay for
   the work carried out up to the time you tell us you are cancelling, worked out as a share of the
   total price using the stage table. If we complete all the work within the 14 days at your request,
   you lose the right to cancel.

7. WHEN WORK STARTS — choose one when you accept
   Standard start: we start after your 14-day cancellation period ends.
   Early start: we start before it ends. To choose this, include all three statements in section 9.
   Choosing an early start is never a condition of accepting this quotation.

8. AFTER-SALES, COMPLAINTS AND YOUR RIGHTS
   We must provide the services with reasonable care and skill and as described here; if something is
   wrong we will put it right at no cost (terms section 15). Complaints: contact@gridsmith.uk or post;
   we aim to acknowledge within 5 working days (terms section 16). [After-sales support, if any.]
   [Codes of conduct: none. Out-of-court dispute resolution scheme: none.]

— — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —
9. TO ACCEPT
   You are agreeing to: [one-line main characteristics]
   Total price: £[ ]   Additional costs: [list or "none"]   Duration: [from start to final delivery]

   Reply to this email with:
   "I accept this quotation and understand that accepting it means I must pay the total price."

   Then add EITHER
   "Standard start." 
   OR all three of:
   "I ask Gridsmith Ltd to start work now, before my 14-day cancellation period ends."
   "I understand that if I cancel during the 14-day cancellation period after work has started, I will
    pay for the work carried out up to the time I tell Gridsmith Ltd I am cancelling, worked out as a
    share of the total price using the stage table in my quotation."
   "I understand that if Gridsmith Ltd completes all the work before my 14-day cancellation period
    ends, I will lose my right to cancel."

Attachments: Client Terms for Consumers v[3.0] (PDF) · Cancellation form
```

The block in section 9 sits **directly above** the acceptance point and repeats main characteristics,
total price, additional costs and duration (Cons 3; CCR reg. 14(2)). The acceptance sentence and the
three statements are **verbatim** from Cons 3 and 6.4; changing them in the template without changing
the terms breaks the match the terms promise.

**If acceptance is by e-signature or an online form** the button must read **"Accept and agree to pay"**
(Cons 3; CCR reg. 14(3)–(4)), the three early-start statements are three separate **unticked**
checkboxes, and the E-Commerce Regs regs 9(1) and 11 information (technical steps, correcting input
errors, language, whether the contract is filed) is also needed, because the email carve-out in those
regulations no longer applies (D-10).

**When the reply does not match.** If the client writes "go ahead", "agreed" or pays without the
acceptance sentence, reply asking them to send the sentence; do not start and do not request payment.
Without the payment acknowledgement, CCR reg. 14(5) means the consumer is not bound (G-01; its
application to an email acceptance is medium confidence, which is why the wording is used every time).
If an early-start reply is missing any of the three statements, treat it as a standard start and say so
in the confirmation.

### 7.3 Confirmation email (send after acceptance, before any work or payment request)

```
Subject: Contract confirmation — [reference]

Dear [name],

Thank you. This email confirms your contract with Gridsmith Ltd.

Contract made: [date we received your acceptance]
Quotation: [reference] dated [date] (attached again)
Terms: Client Terms for Consumers, version [3.0] (attached)
Total price: £[ ]   Payment schedule: [as quotation]

Start option you chose: [Standard start — we will start on [date], the day after your 14-day
cancellation period ends.]
  OR
[Early start — on [date and time] you sent us these statements:
  "[statement 1 as received]"
  "[statement 2 as received]"
  "[statement 3 as received]"
We will start on [date].]

Your 14-day cancellation period ends at the end of [date]. To cancel, email contact@gridsmith.uk or
write to the address above; you can use the attached form but do not have to.
[Early start only:] If you cancel within that period after work has started, you pay for the work
carried out up to the time you tell us, worked out from the stage table in your quotation, and we
refund the rest within 14 days. If we complete all the work within the period, you lose the right
to cancel.

[First payment: £[ ] due [date], payable by [method]. It is refundable as set out in the terms.]

Gridsmith [studio]
Gridsmith Ltd, a private limited company registered in [C-3 wording], company number 17050842,
registered office 30 Briarfield Road, Farnworth, Bolton, BL4 0HD
Attachments: Quotation [reference] · Client Terms for Consumers v[3.0] · Cancellation form
```

This is designed to meet CCR reg. 16, and it can do so only because the quotation carrying the Sch. 2 information was itself sent on
a durable medium (email/PDF) and is attached again. Never send it as a WhatsApp message alone.

### 7.4 Cancellation form (Cons 22 — attach unchanged)

```
To: Gridsmith Ltd, 30 Briarfield Road, Farnworth, Bolton, BL4 0HD, contact@gridsmith.uk

I/We hereby give notice that I/We cancel my/our contract for the supply of the following service:

Ordered on:
Name of consumer(s):
Address of consumer(s):
Signature of consumer(s) (only if this form is sent on paper):
Date:
```

Header line for the attachment: "Complete and return this form only if you wish to cancel the contract.
You do not have to use it." (Cons 22). Pre-filling the service and the "ordered on" date before sending
is helpful. That it is allowed is a practical reading only (**UNVERIFIED**: no source in the repository
addresses it).

### 7.5 On cancellation within the 14 days — refund statement

```
Subject: Cancellation received — [reference]

We received your cancellation on [date and time]. [We had not started work, so we will refund
everything you paid: £[ ].]
  OR
[You asked us to start early. Up to [date and time] we had carried out:
   Stage [n] [name] — complete — [ ]% of £[total] = £[ ]
   Stage [m] [name] — in progress: [measure, e.g. 2 of 5 chapters] — [ ]% × [2/5] of £[total] = £[ ]
   Amount for work carried out: £[ ]   You paid: £[ ]   Refund: £[ ]]
We will refund £[ ] by [the payment method you used] by [date — within 14 days of the day you told us],
with no fee. Any related contract you made with us or another provider under an arrangement with us
for this project has also ended at no cost to you.

Gridsmith [studio]
Gridsmith Ltd, a private limited company registered in [C-3 wording], company number 17050842,
registered office 30 Briarfield Road, Farnworth, Bolton, BL4 0HD
```

Where a related contract is with another provider under an arrangement with Gridsmith, tell that
provider about the cancellation straight away (CCR reg. 38; *A-15, medium confidence*).

The amount for work carried out is **zero** if the cancellation information was not given before
acceptance, or if the early start was not requested in writing (Cons 6.5; CCR reg. 36(6), Sch. 2(l) and
(n)). Treat a missing stage table the same way. Strictly, the CCR basis is (l)/(n), not the table
itself, so this is a safe operating rule that is more generous than the regulation requires.
It never includes third-party costs inside the 14 days (A §7.5 item 4) — which is why Cons 4 forbids
committing to non-cancellable supplier costs during the period.

### 7.6 Ending after the 14 days (Cons 7) — statement

Same layout and signature block as §7.5, **omitting the related-contracts sentence** (Cons 7 gives no
such right), with:
- a third line for supplier costs the client agreed to in writing and that cannot be cancelled or
  recovered (evidence on request);
- no cancellation fee;
- refund of any overpayment within 14 days, or the balance due if the client paid less; and
- delivery of the paid-for work with the rights in Cons 13.

### 7.7 Business clients (for comparison)

Business clients get a Scope under the business terms. The CCR steps above do not apply to them, but
the same discipline of a written Scope, acceptance by signature or email, and no payment before
acceptance (Bus 1) keeps one sales process for both. Where a business client is an individual, a
partnership or another unincorporated body, the deferred-payment limit in Bus 5 applies to its Scope too.

## 8. Final independent legal check

A third agent, which had not drafted the pack, checked the whole pack as committed at `817b707` against:
- the drafts (Consumer 3.0, Business 3.0, Privacy 2.1);
- the A–G reports, `02-CITATION-LEDGER.md` and `00-LEGAL-BASIS.md`;
- the migrations and `lib/consent/state.ts`;
- the evidence paths cited in §3, of which it spot-checked 12.

It read no primary legislation (blocked); three propositions were also checked against search-result
summaries.

**Result:** no high-severity defect, **9 medium**, **9 low** and **8 notes**. This session confirmed the
material ones before acting on them:
- the Limitation Act appears nowhere in `docs/_legal/` outside this pack;
- `0003_press_path_results.sql:40` has no on-delete action;
- `AI-HANDOFF.md` H4-B says "Production migration plan NOT applied";
- `00-LEGAL-BASIS.md` `L-PECR-22` confines reg. 22 to individual subscribers;
- D report D2 makes the address-line point.

All 18 defects were fixed in this file. The notes were taken as stated below.

| # | Sev. | Defect | Disposition |
|---|---|---|---|
| D1 | M | Limitation Act and s. 388 attributed to readings the repository does not hold | §5 now labels both **UNVERIFIED in this repository** (search-result summaries only) |
| D2 | M | Off-repository `pg_dump` of the 63 leads missing from the schedule | **R17** added; §5.2 step 1 and §5.3 step 4 handle it |
| D3 | M | R1 clock ("last contact") not computable from `public.leads` | R1 now runs from `created_at`, extended by a contact date in `notes`; a `last_contact_at` column is a later task |
| D4 | M | Path Finder `lead_id` FK blocks lead deletion; table has no writer | R11 rewritten; §5.2 order fixed |
| D5 | M | Outbox described as live; it is Preview-only | R1 and R10 corrected |
| D6 | M | Template rule 1 overclaimed; Bus 2 fallback keyed on invoicing, not on the due date | Rule 1 rewritten on due dates, with the UNVERIFIED points stated; Bus 2 proposal now says "fall due" |
| D7 | M | Option E ambiguous; O-5(4) had no text | E sentence given in §6; its exposure corrected |
| D8 | M | Registration particulars missing from §7.3/7.5/7.6 | Shared signature block added; D-22 evidence updated |
| D9 | M | Quotation template missing ghostwriting credit, third-party material and source files (Cons 10.2, 13), plus the "how calculated" alternative | Fields added to §7.2 |
| D10 | M | "Consumers must not get a cap" overstated; wrong CRA section | §6 reworded; CRA ss. 47, 57, 65 |
| D11 | L | PECR reg. 22 overstated; CMA37 overstated; "satisfies reg. 16" | D-8 reclassed IF + SD; "strongly indicated"; "designed to meet" |
| D12 | L | Option A: "recovers at least what it paid"; "mutual exclusions" | Corrected |
| D13 | L | UCTA s. 11(4)(b) softened | B's wording used; s. 11(4)(a) added |
| D14 | L | §5.4 inconsistent with §5.1; replacement scope unstated | §5.4 rewritten (R3, R7 +6 years, R9), with its replacement scope stated; R8 note added |
| D15 | L | D-17 misattributed D's view | Address-line point and D2 cited |
| D16 | L | §7.6 would import the related-contracts right; §7.2 consumer wording narrower than Cons 1 | Both corrected |
| D17 | L | Moral-rights proposition missed employee-works and assignment points | D-15 updated; P-2 extended (below) |
| D18 | L | Framing: "four decisions" vs five; C-5 header; D-13 consumer limb | Reworded; §4.2 header split; D-13 reclassed OA + SD |
| D19 | L | Record drift; readiness gaps (C-3 forces 3.1; Accessibility needs C-4; template hardcoded "England and Wales") | Hygiene line and §9 updated; §4.6 rows corrected; template uses [C-3 wording] |

**Notes taken:**
- **Note 1:** O-2 extended to eight facts.
- **Note 2:** R16–R20 added.
- **Note 3:** R8 caveat in §5.4.
- **Note 4:** §5.3 step 5.
- **Note 5:** reg. 31 in §7.1; reg. 38 provider notice in §7.5.
- **Note 6:** pre-fill marked UNVERIFIED; stage-table basis in §7.5.
- **Note 7:** in rule 1.
- **Note 8:** no action.

**Verdict.** In the checker's words, the pack is "a careful piece of work and is mostly faithful to the
drafts", with no high-severity defect, and "its scope discipline holds: nothing in it adopts,
publishes or edits a draft". With the fixes above, this phase records **no open defect in the pack**.
That is a statement about this pack's internal accuracy against its sources. It is not a statement
that any template or draft is compliant, approved or enforceable. The primary-text re-reads this
session could not make are listed as UNVERIFIED where they occur.

## 9. Not done, by instruction

- No document moved beyond `OWNER_REVIEW_REQUIRED`; `GS-O003-R-REGISTER.json` unchanged; no
  `ownerAdoptedOn`/`ownerAdoptedVersion` set.
- No draft in `docs/_legal/` edited in this phase; proposed wording above is a proposal only.
- Records changed: this pack (new), `docs/_shared/OWNER-ACTIONS.md` (`GS-O003-R` exact action now points at §4),
  `GS-LEGAL-001-RECORD.md` §11 and `CLOUD-CONTINUATION.md` (R2 status), and the `CLAUDE.md` status banner.
- No publication, deployment, Hostinger workflow dispatch, DNS, Vercel, Sanity (development or
  Production), Supabase (Preview or Production) or `main` change. H4-H not started.
- The Hostinger `/contact/*` and `/about/*` HTTP 500 defect was left alone, as the handoff instructs.
