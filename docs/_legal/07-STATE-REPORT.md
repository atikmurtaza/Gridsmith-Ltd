# 07 — State Report

**Date: 27 August 2026.** Written for the owner, to be handed to a solicitor alongside the drafts.

> **SUPERSEDED IN PART — 29 August 2026, round 12.** Read this report with the amendments in the
> boxes below. **F-1 to F-7 are closed** by a reseed of all seven documents from the drafts, and
> **the class they belong to now has a gate**: `scripts/check-legal-parity.mjs` compares the
> **served** legal pages against `docs/_legal/` on every `verify:served` and every CI run, and
> was proven by nine separate deliberate failures. **F-9 and F-12 are closed.** **UCTA 1977 has
> been read at source** and six ledger entries carry it; `MSA-BUSINESS.md` is at 1.4 and
> `WEBSITE-TERMS.md` at 1.3. `03-REVISION-LOG.md` round 12 is the account. **F-8, F-10 and F-11
> are open**, and every owner figure and every `[DECISION REQUIRED]` in §2 below is still open —
> three more were added.

**Supersedes `06-FINAL-VERIFICATION.md`**, which was written before rounds 9, 10 and 11 and called
four documents ready that were changed after it called them ready.

---

## 0. How this pass was run, and the one thing it changes

Primary sources only. Nothing was verified against `02-CITATION-LEDGER.md`, `03-REVISION-LOG.md`, or
any previous verification report — a clause agreeing with the ledger it was drafted from proves
nothing.

Fetched and read at source in this pass, on 27 August 2026:

| Source | Read for |
|---|---|
| SI 2013/3134 **Part 3, regs. 27–38** | `CONSUMER-TERMS.md` §§5–7, §6A |
| SI 2013/3134 **reg. 5** definitions | the mixed-contract question |
| SI 2003/2426 **reg. 23** | `MSA-BUSINESS.md` 16.1, `CONSUMER-TERMS.md` §15.1 |
| SI 2002/1675 **art. 4** | `00-LEGAL-BASIS.md` late-payment row |

Code re-derived: `lib/consent/state.ts`, `lib/analytics/`, `components/consent/`, `lib/legal/slugs.ts`,
`scripts/check-axe.mjs`, `scripts/seed-legal.mjs`. **The served site was read in a browser** on a running
`gridsmith-dev` — `/legal/privacy`, `/legal/cookies`, `/legal/consumer-client-terms`, and the footer.

**Every legal proposition re-derived in this pass held.** Round 9's reading of the instruments is
correct, including the one finding it rejected. What did not hold is something no round has checked:

> **The drafts and the published site are two different documents, and nobody has been comparing them.**
> Round 11 verified that three removed analytics terms no longer appear on two served pages. That is
> true and it is a narrow claim. The served **consumer terms** are still the pre-round-9 text, and the
> served **privacy policy** states as fact several things the drafts mark `[TK]` precisely because they
> could not be established. A solicitor reviewing `docs/_legal/` would review a document the public
> never sees.

> **[CLOSED — 29 August 2026, round 12.]** All seven documents were reseeded from the drafts, and
> `scripts/check-legal-parity.mjs` now asserts on every CI run that they stay that way: same
> version, no published sentence the draft does not contain, no draft clause the page has dropped,
> and the page still announcing itself as an unreviewed draft. **The finding above was correct and
> it was the most valuable thing this report produced** — it is left in full, because the reason it
> went unnoticed for eleven rounds is more instructive than the fix.

---

## 1. Verdict per document

| Document | Draft version | Verdict | Reason |
|---|---|---|---|
| `WEBSITE-TERMS.md` | 1.1 header / 1.2 body | **Needs a pass** | Not touched since round 8. Header and body disagree on the version (F-9). Three open owner decisions (audience, VAT number, and the taken-but-unbuilt VAT display). Clause 1 still recites the fabricated VAT number, which is **live in the footer of every served page** (F-8). |
| `PRIVACY-POLICY.md` | 1.3 | **Needs a pass — and it is the urgent one** | The draft itself is sound and honest. **The published policy is not the draft** and contradicts it in five places (F-2 to F-6), including a retention promise nothing enforces. |
| `COOKIE-POLICY.md` | 1.3 | **Ready for a solicitor, with one caveat** | Verified against the code and against the served page: the analytics removal propagated correctly and completely. Caveat: §4A's eight ICO quotations rest on a single unrepeatable retrieval (`CNV-1`) and have no ledger entry; the served page carries a wrong enforcement citation (F-7). |
| `ACCESSIBILITY-STATEMENT.md` | 1.2 | **Needs a pass** | Not touched since round 7. Its conformance status is `[DECISION REQUIRED]` and cannot be answered until the screen-reader pass happens and the six uncovered legal routes are audited. Publishing any conformance claim today is itself an `L-CRA-50` statement. |
| `MSA-BUSINESS.md` | 1.3 | **Ready for a solicitor** | 16.1's reg. 23 basis re-derived at source in this pass and holds verbatim. Open items are owner figures (cap, PI limit) and two genuine legal judgements (cl. 15 retention; the CDPA over-assignment). UCTA 1977 remains unread — flagged, not hidden. |
| `CONSUMER-TERMS.md` | 1.3 | **Ready for a solicitor as a draft — but do not publish it, because the site publishes an older one** | Round 9's sweep of regs. 27–38 verified clause by clause against the instrument; **every limb held**, including the reg. 5 mixed-contract reading that overturned `06-`. Two minor internal inconsistencies (F-10, F-11). The blocking problem is F-1, which is not a drafting defect. |
| `00-LEGAL-BASIS.md` | 1.0 + round-9 corrections | **Ready for a solicitor** | The late-payment row was re-derived against SI 2002/1675 art. 4 in this pass and is now correct and agrees with the clause it indexes. One citation-hygiene defect (F-12). |

### Verification tally

| | Count |
|---|---|
| CCR 2013 provisions re-derived at source against a clause | **22** — regs. 27(1), 27(3), 30(2)–(5), 31(3), 32(3), 32(4)(b), 32(5), 34(1)(2)(3)(5)(6)(9)(11), 35(5), 35(6), 36(1)(a), 36(1)(b), 36(2), 36(6)(a), 36(6)(b), 37(1), 37(2), 37(4), 38(1), 38(2), 38(3), plus the reg. 5 definitions |
| Of those, **held** | **22** |
| Other instruments re-derived | 2 — PECR reg. 23, SI 2002/1675 art. 4. Both held |
| Ledger entries (headings / distinct ids) | **43 / 45** |
| Ledger entries with no clause citing them | **0** |
| Ids cited inline that are not ledger entries | **1** — `L-07` (F-12b) |
| Findings that did not hold | **12** (F-1 to F-12) |
| `[SEED - SOLICITOR REVIEW REQUIRED]` banner | **7 / 7** intact |

### The twelve findings

| # | Where | What did not hold | Severity |
|---|---|---|---|
| **F-1** | served `/legal/consumer-client-terms` | **The published consumer terms are the pre-round-9 instrument.** §5.1 states a flat 14-day right for every consumer (no reg. 27(1) scope), runs the period from the contract date in every case (reg. 30(2) applied to goods), and promises a flat 14-day refund from notification (the reg. 34(6) concession round 9 removed). §5A, §5.0, §5.2–§5.5 and §6A **do not exist on the site**. `scripts/seed-legal.mjs` was updated by round 10 for the analytics sections only; the consumer terms have not been reseeded since before round 8. | **Blocking** |
| **F-2** | served `/legal/privacy` 5.1 | States retention as fact — "kept for 24 months … then deleted", "kept for 6 years". `PRIVACY-POLICY.md` §7 records retention as **NOT IMPLEMENTED**: no purge, no anonymisation, no scheduled delete. The site tells a data subject their data is deleted by a job that does not exist. | **Blocking** |
| **F-3** | served `/legal/privacy` 4.1 | Asserts Vercel functions run in **`iad1` (Washington D.C.)** as an established fact. The draft §6 replaced **every** processor region with `[TK]` because none was established. | High |
| **F-4** | served `/legal/privacy` 4.1 | **Slack is absent from the recipient list.** The draft §6 lists it, and `lib/leads/notify.ts:128` is a live path sending the enquirer's full name the moment `SLACK_LEADS_WEBHOOK` is set. | High |
| **F-5** | served `/legal/privacy` 6.2 | Cites **DPA 2018 s. 165** for complaints. The duty in force since **19 June 2026** is **s. 164A** (`L-DPA-164A`), which the draft §12 was rewritten to. The served page is on the pre-DUAA provision and offers no direct-complaints route. | High |
| **F-6** | served `/legal/privacy` 2.1 | Asserts the form records "the referring page, the page you landed on, and any campaign parameters … together with a flag". Round 7 re-derived that **nothing on the site sends these** and nothing derives them. | Medium |
| **F-7** | served `/legal/cookies` 4.1 | Cites **"Data Protection Act 2018 Sch. 1 Pt. 6"** for PECR enforcement. Sch. 1 to the DPA is special-category conditions. The established route (`L-PECR-PENALTY`) is PECR reg. 31 → **PECR Sch. 1 para. 18** → **DPA 2018 s. 157(2)(a) and (5)**. | Medium |
| **F-8** | footer, every served page | Still renders `VAT number [SEED] GB123456789`. A **false** statutory disclosure, not a missing one — reg. 6(1)(g). Blocked only by `check:launch-content`, which Vercel never invokes. | **Blocking for launch** |
| **F-9** | `WEBSITE-TERMS.md` | Header line 7 says `Version: 1.1`; the round-8 note at line 11 says `Version 1.2`. | Low |
| **F-10** | `CONSUMER-TERMS.md` §5.0 | The digital-content bullet points the reader to §6A for the *period*. §6A states when the right is **lost**, not how long it lasts. reg. 30(2) puts non-tangible digital content on the contract-date clock; the consumer is left without a period. | Low |
| **F-11** | `CONSUMER-TERMS.md` §5 ¶3 | The headline sentence still reads "we will refund all payments received from you within 14 days of being told", with §5.3 deferred to in the next clause. §5.3 then says the goods clock runs from receipt of the returned copies. Under `L-CRA-50` the headline is the one a consumer takes into account. | Low |
| **F-12** | citation hygiene | (a) `MSA-BUSINESS.md`, `CONSUMER-TERMS.md` and `PRIVACY-POLICY.md` cite **`L-CA-82` alone** for the trading disclosure. The ledger heading is `L-CA-82 / L-TDR-24`, and `CNV-7` records that **s. 82's text was never fetched** — the obligation read is SI 2015/17 reg. 24. Citing the half that was not read is the defect round 9 fixed at MSA 16.1, still live one document over. (b) **`L-07`** is cited in the `L-` namespace in three documents; it is a build-tracker id, not a ledger entry. | Low |

### What was verified and explicitly held

- **Round 9's rejection of `06-` §2.2 is correct.** reg. 5 defines *sales contract* to include "any contract that has both goods and services as its object", and *service contract* as "a contract, other than a sales contract". A mixed order is a sales contract **entire**, with **one** period on the goods clock. `06-`'s two-period reading does not survive the instrument.
- **reg. 36(1) is two requirements**, and (b) is limited to off-premises contracts, exactly as §6(a) now states. **reg. 36(6)(b)** gives no cost "in full or in part" where the service was not supplied in response to a paragraph (1) request — §6(e) states it correctly.
- **reg. 37** differs from reg. 36 in all three respects §6A claims: loss on supply **beginning** (37(2)), no durable-medium limb in 37(1), and **nothing** owed under 37(4).
- **PECR reg. 23** carries no individual-subscriber limitation. Re-derived verbatim; MSA 16.1 is soundly based.
- **SI 2002/1675 art. 4** creates 8% **over** the official dealing rate fixed at the preceding 30 June / 31 December. `00-LEGAL-BASIS.md` and `MSA-BUSINESS.md` 6.4 now agree and both are right.
- **The analytics removal is real and complete in code.** `lib/analytics/` holds only the two inert pure modules; `state.ts` reads `gs_consent` for presence only and never rewrites a legacy value. The served cookie policy describes this correctly, including the historical passage.

### Not reached in this pass, and therefore still unverified

reg. 30(6) (regular delivery over a defined period — cited in a §5.0 comment, not in the clause body) ·
reg. 36(5)'s market-value calculation basis, relied on by §6(c) · UCTA 1977 · CDPA formalities for
non-copyright IP · `COOKIE-POLICY.md` §4A's ICO quotations · SI 2002/2013 reg. 7 (PECR reg. 23(c)/(d)).

---

## 2. What remains outstanding, with an owner against each

**Owner** is *business owner* (a fact, a decision, a registration), *solicitor* (a legal judgement), or
*developer* (a build task). Where an item is blocked on another, the blocker is named.

### 2.1 Blocking — do these before anything else

| Item | Owner | Blocked on |
|---|---|---|
| ~~**Reseed the legal CMS content from the current drafts**~~ **DONE — 29 Aug 2026.** All seven, from the drafts, to the `development` dataset. `seed-legal.mjs` is now a transcription and is held to it by the gate above: **every published paragraph is a contiguous word-run of its draft.** 13 paragraphs the old seed had published out of the drafts' HTML comments were removed — a draft does not publish those either | **Developer** | — |
| **Remove the retention periods from the published privacy policy, or build the deletion job** (F-2) | **Owner** decides which; **developer** builds | D-5 |
| **The VAT number** — publish the real one, or publish none (F-8, D-1) | **Owner** | Nothing. `production` is blocked on it (`BEFORE-LAUNCH.md` §16) |
| ~~**A gate that compares the served legal pages against the drafts.**~~ **DONE — 29 Aug 2026.** `scripts/check-legal-parity.mjs`, in `verify:served` and in CI. Four branches — version parity, the draft agreeing with itself, content containment, clause coverage — plus a hollow-subject guard, over six of seven slugs, with the seventh named in every run. Nine deliberate-failure proofs, each in a window where only its own branch fires | **Developer** | — |

### 2.2 Owner — facts, registrations and decisions only the business can supply

| Item | Where | Note |
|---|---|---|
| VAT registration status, and the number if registered | `WEBSITE-TERMS.md` 1, footer | D-1. Also decides D-2's labelling |
| Company number and registered office — **confirm** the seeded values are verified, not placeholders | `WEBSITE-TERMS.md` 1, OQ-15 | The file does not distinguish verified from `[SEED]` values |
| Contact email, phone, business days and hours; effective dates on all seven documents | all seven | 7 effective dates are `[TK]` |
| ICO registration and fee | `PRIVACY-POLICY.md` §1A | The served page already says "pending" |
| **Does Gridsmith have business premises at which a consumer could sign?** Is any Press engagement concluded in person? | `CONSUMER-TERMS.md` §5A | Decides which of the three CCR regimes applies. The draft infers "distance" from the build and says so |
| Do Press packages include printed copies, and in how many consignments? | `CONSUMER-TERMS.md` §5.0 | Decides whether reg. 30(3) is ever reached |
| Are the §10.5 / §10.7 platform arrangements contracts the **consumer** enters into? | `CONSUMER-TERMS.md` §5.5 | Decides whether reg. 38(2) bites. §10.5's two sentences point opposite ways |
| **Slack** — delete the path, keep it unset and disclose it, or enable it with a DPA | `PRIVACY-POLICY.md` §6 | D-4. One env var from live |
| Enquiry retention period, or the criteria | `PRIVACY-POLICY.md` §7 | D-5. **Already published as fact** — F-2 |
| Processor regions and the transfer mechanism for each | `PRIVACY-POLICY.md` §6, §6C | Four `[TK]`. The served page asserts one of them anyway — F-3 |
| Do affiliated production entities outside the UK exist? | `PRIVACY-POLICY.md` §6 | A notice must not describe a transfer it cannot particularise, nor omit a real one |
| Are the six Freelancer testimonials a complete set, and did the reviewers consent? | `CONSUMER-TERMS.md` 10.8 | `L-DMCC-SCH20-13`, OQ-20. No gate can observe this |
| Liability cap figure and PI limit | `MSA-BUSINESS.md` 11.3, 11.4 | **These are ONE decision, not two — round 12.** UCTA **s. 11(4)(b)** directs the reasonableness enquiry to how far Gridsmith could cover itself by insurance, so the cap is tested against the cover. **The cover has to be known before the cap can be chosen.** They have been carried as two independent `[TK]`s through four revisions. **Owner instruction, 29 Aug 2026: the call is being made this week, and the cap and the s. 11(4)(b) argument are then set together in one pass. Until then 11.3 stays `[TK]` — no placeholder, no default figure.** `MSA-BUSINESS.md` 11.8 carries the prohibition in full |
| Are the A2 standards (BS 8888, BS EN ISO 128, Eurocodes, RIBA stages) confirmed? | `MSA-BUSINESS.md` Sch. A2 | `CLAUDE.md` forbids inventing standards codes |
| **The response / acknowledgement window** — 5 working days, 30 days, or 5-as-target/30-as-guarantee | three documents | D-9. Must be identical in all three, and `companyDetails.responseCommitment` is the single source of truth |
| Consent versus the PECR Sch. A1 para. 5 exception | `COOKIE-POLICY.md` §4A | D-6. **Deferred, correctly** — moot until analytics returns |

### 2.3 Solicitor — legal judgements

| Item | Where | Why it is a judgement, not a fact |
|---|---|---|
| **Is a printed book set from an author's manuscript "made to the consumer's specifications or clearly personalised" under reg. 28(1)(b)?** | `CONSUMER-TERMS.md` §5A | If yes, there is no cancellation right over the copies at all and §5.0's goods bullets fall away. The exposure is asymmetric and the draft takes the safe direction |
| **Is anything Press delivers "digital content" within reg. 5?** | `CONSUMER-TERMS.md` §6A | Decides whether reg. 36 or reg. 37 governs early start. Drafted to be correct if yes and inapplicable if no |
| The **CDPA over-assignment** — do registered designs, trade marks and unregistered design right pass under words relying on ss. 90/91, which govern copyright only? | `MSA-BUSINESS.md` 8.3, `CONSUMER-TERMS.md` 10.3 | Each right has its own assignment formalities, and **no round has read any of them** |
| Is an electronically executed agreement "signed" for s. 91(1)? | `MSA-BUSINESS.md` 8.3 | |
| **Is clause 15 worth keeping at all?** regs. 9(4) and 11(3) already disapply regs. 9 and 11 for contracts concluded exclusively by email | `MSA-BUSINESS.md` 15.2 | Belt-and-braces over a carve-out that already applies |
| Is the §6(c) proportionate-payment calculation defensible? | `CONSUMER-TERMS.md` §6(c) | reg. 36(4)/(5). **Highest-frequency consumer exposure in the business** |
| Is §7.4's "reflects our actual cost and is not a penalty" fair under CRA s. 62 with Sch. 2 Pt. 1 para. 6? | `CONSUMER-TERMS.md` 7.4 | There is **no statutory rate** to anchor a consumer clause to — the 1998 Act is business-to-business only |
| Audience of the website terms — one instrument, or a sixth slug? | `WEBSITE-TERMS.md` head | D-3 |
| Whether the business instrument should keep its now-redundant consumer material at 2.1, 6.1, 10.1, 11.1 | `MSA-BUSINESS.md` | The route split made it redundant there; removing it is a drafting decision |
| The UCTA 1977 reasonableness basis for the B2B liability limbs | `MSA-BUSINESS.md` 11.3 and new 11.6–11.8, `WEBSITE-TERMS.md` 11 | **The statute has now been read** — ss. 1, 2, 3, 11, 13, 26, 27, Sch. 1, Sch. 2, on 29 Aug 2026 — and six ledger entries carry it. **What remains is its application, which is the part that was always yours.** Three specific questions: whether Sch. 2's guidelines apply by analogy to a s. 3 case (authority, not statute); how far Sch. 1 para. 1(c) removes clause 11 from ss. 2 and 3 given that clause 8 assigns IP; and whether Schedule A3 defines a duty or excludes one under s. 13(1). `CNV-8` records that **no authority has been read by anyone here** |
| **Exclusion or cap, for the website terms' business-user limb** | `WEBSITE-TERMS.md` 11 | **NEW, round 12.** s. 11(5) puts the burden of justifying it on Gridsmith, and it is drafted as a **total exclusion** — the hardest form to defend, and an unreasonable one is ineffective in its entirety. s. 2 reaches it whether or not the browsewrap is a contract; s. 3 only if it is |

### 2.4 Developer — build tasks the drafts already depend on

| Task | Draft that depends on it | State |
|---|---|---|
| **Reseed the legal CMS content** (F-1 to F-7) | all seven | **NOT DONE — blocking** |
| **The express-request capture** (reg. 36(1)(a)) — a separate unticked box, not bundled with accepting the terms | `CONSUMER-TERMS.md` §6(a) | NOT BUILT |
| **The acknowledgement capture** (reg. 36(2)(b)) — a second unticked control, and **a record of what wording was shown, to whom, and when.** The evidential burden is Gridsmith's | `CONSUMER-TERMS.md` §6(a1) | NOT BUILT |
| **Contract type known before the request is taken** — the request form must match the contract type, and an off-premises request must be on paper or email, not a web control | `CONSUMER-TERMS.md` §6(a) | NOT BUILT. **Blocked on the §5A premises fact (owner)** and on `/contact` serving one form to all three divisions (`press/PRD.md` FR-P24) |
| **The reg. 32(4)(b) acknowledgement** — a durable-medium acknowledgement of receipt, without delay, the day a web cancellation form ships | `CONSUMER-TERMS.md` §5.2 | NOT BUILT. Falls due only when the form ships. **This is the third distinct durable-medium duty**, with reg. 16's order confirmation and reg. 36(1)(b)'s request |
| **`L-07` — the `consent_events` table** | `PRIVACY-POLICY.md` §11A, `COOKIE-POLICY.md` | NOT BUILT. Now a **prerequisite** of re-introducing analytics, not a follow-up |
| **The complaints route** — an electronic complaint form under DPA 2018 s. 164A, in force 19 June 2026 | `PRIVACY-POLICY.md` §12, `MSA-BUSINESS.md` 10.5, `CONSUMER-TERMS.md` §12.1, `WEBSITE-TERMS.md` 12A | NOT BUILT, and the served page still cites s. 165 |
| **VAT price rendering (`M-P2-3`)** — net/gross on `pricingBlock`, inclusive on `/press`, labelled-exclusive on `/design` and `/digital` | `WEBSITE-TERMS.md` 5A, `CONSUMER-TERMS.md` §3, §7.1 | NOT BUILT. Decision taken 26 Aug 2026 (option c). **Blocked on D-1** — no registration means no VAT to state and the label changes again |
| **The retention/deletion job** | `PRIVACY-POLICY.md` §7 | NOT BUILT. **Blocked on D-5 (owner).** Currently published as if built — F-2 |
| **The screen-reader pass, and adding the six uncovered legal routes to `check-axe`** | `ACCESSIBILITY-STATEMENT.md` §2, §4, §6 | NOT DONE. **Blocks D-8** — no conformance status can be published until it is |
| **The `dataLayer` shim defect** — a plain array where Google's contract is an `arguments` object | `BEFORE-LAUNCH.md` item 22 | Gone with the categories. Must be **settled by measurement**, not reading, before any tag is initialised |
| A gate over `PRIVACY-POLICY.md` §6's recipient table | `PRIVACY-POLICY.md` §6 | NOT BUILT — see §4 |

### 2.5 Accepted residuals

| Residual | Accepted by | Standing |
|---|---|---|
| **Vercel production is unreachable.** Every production-target deployment since 19 Aug 2026 is `ERROR`; previews are behind SSO | Owner, round 11 | The build fails at `getCompanyDetails()` because `production` is empty. **The seed gate is a CI guard only — Vercel runs `next build` and nothing else.** A `production` dataset seeded with placeholder content would satisfy the throw and never meet the gate |
| **No reading has ever been taken from the environment the notices will be published from** | Round 7 | All measurements are from a local production build |
| **`COOKIE-POLICY.md` §4A's ICO quotations rest on one unrepeatable retrieval** | `CNV-1` | `ico.org.uk` returned 403 to Pass 5. No ledger entry backs them. Must be re-checked before publication |
| **Legacy `gs_consent` cookies are not rewritten** | Round 10 | Deliberate and correct — the cookie is the visitor's own record. Expires within 12 months |
| `CNV-4` to `CNV-7` — four secondary citations never fetched | Passes 2–9 | Price Marking Order 2004; VAT Regs 1995 reg. 14; DMCCA ss. 226–227; CA 2006 s. 82 |

---

## 3. What to tell a solicitor to look at first, and what to send them

### Read in this order

1. **`CONSUMER-TERMS.md` §§5, 5A, 5.0–5.5, 6, 6A** — the highest-frequency consumer exposure in the
   business, rewritten wholesale five days ago against regs. 27–38, and **verified by nobody who did
   not draft it until this pass.** Three questions are marked for you inside it: the reg. 28(1)(b)
   personalised-goods point, the reg. 37 digital-content classification, and the reg. 36(4)/(5)
   calculation.
2. **`MSA-BUSINESS.md` 8.3 with `CONSUMER-TERMS.md` 10.3** — the copyright assignment. Digital's and
   Press's whole ownership proposition rests on it, and the non-copyright IP question has never been
   researched by anyone here.
3. **`MSA-BUSINESS.md` 11.3 and `WEBSITE-TERMS.md` 11** — the B2B liability limbs. **UCTA 1977 has
   never been read in this project.** The consumer side is fully cited and the business side is not
   cited at all.
4. **`PRIVACY-POLICY.md` §6, §6C and §7** — processors, transfers and retention. Four regions are
   unestablished, Chapter V was restructured on 5 Feb 2026 (Arts. 44 and 45 **omitted**; the test is
   now Art. 45B), and the site currently publishes retention periods nothing enforces.
5. **`00-LEGAL-BASIS.md` §6** — sixteen questions already framed for you, each tied to a ledger id.
6. **`WEBSITE-TERMS.md` head and `MSA-BUSINESS.md` head** — the audience question, and whether the
   business instrument should shed its now-redundant consumer material.

### Send them

| Send | Why |
|---|---|
| All seven drafts, banners intact | The `[SEED - SOLICITOR REVIEW REQUIRED]` banner is on 7/7 |
| `02-CITATION-LEDGER.md` | 43 entries, each with instrument, provision, in-force version, verbatim text, primary-source URL and status. **Including the `COULD NOT VERIFY` section** — that is where the honest gaps are |
| `01-FACTUAL-INVENTORY.md` | What the build actually does, as against what the drafts describe |
| **This report** | Sections 1 and 2 are the agenda |
| **`03-REVISION-LOG.md` round 9** | The only account of why §§5–7 look the way they do |

### Tell them explicitly

- **The drafts are not what the site publishes.** Do not infer the live position from the drafts, or
  the reverse. F-1 to F-7.
- **No clause in this set was drafted or interpreted by anyone unqualified.** Every clause carries an
  inline ledger id or an explicit `NO LEDGER ENTRY` flag saying why it has none. Nothing was deleted
  for lacking a citation — deleting it would have hidden the question.
- **`[TK]` means a fact nobody in the project has.** `[DECISION REQUIRED]` means a choice. Neither is
  a place where a judgement was quietly made.
- Nothing in this set is legal advice, and no round has treated it as such.

---

## 4. What is NOT covered by any gate

Carried forward, plus what this pass found. Everything here is green-by-absence: no check fails if it
is wrong.

| Not covered | Consequence |
|---|---|
| ~~**The served legal pages versus the drafts**~~ — **COVERED, 29 Aug 2026.** `check:legal:parity`. What it still cannot see is stated rather than implied: **it asserts that the page matches the draft, never that the draft is right.** F-11 — §5's headline refund promise being more generous than the §5.3 it defers to — is an over-promise **inside** the draft, and the gate is silent on it by construction | Reduced to: a defect the drafts and the site share is invisible to it |
| **`/legal/client-terms` is outside `check:legal:parity`** — **NEW.** It has no draft, because it is not an instrument. The gate names it in every run rather than skipping it silently | `check-consumer-terms.mjs` guards its routing; nothing guards its wording |
| **`PRIVACY-POLICY.md` §6's recipient table** | Adding a field to `internalEmail()` or the Slack line silently falsifies the table. Nothing in `verify:static` notices. Same class as `M-P1-3` |
| **Six of seven legal routes are outside the axe route list.** `check-axe.mjs` `ROUTES` contains `/legal/privacy` and no other legal path | The two documents most likely to be read by someone deciding whether to buy — the two client-terms instruments — are both unaudited |
| **The screen-reader pass has never been performed.** No AT testing of any kind | No conformance status can be published. Blocks D-8 |
| **Lighthouse has never been run locally** | Every LCP budget is provisional; an empty page already measures ~1520ms against Digital's 1600ms |
| **A live-clean production build has never run.** Every production-target deployment since 19 Aug 2026 is `ERROR` | The seed gate is a **CI guard only**. Vercel runs `next build`, which never invokes `check:launch`. Whoever populates `production` must run it deliberately |
| **`[TK]` and `[DECISION REQUIRED]` markers have no gate** — **NEW.** **109** `[TK]` markers, **28** `[DECISION REQUIRED]` and **2** `[DECISION TAKEN]` occurrences across the seven documents, counted mechanically in this pass (13/37/6/10/12/29/2 `[TK]` respectively) | A marker can be silently deleted, or a document can be published carrying them. Nothing counts them, and no count in any previous report has been reproducible |
| ~~**Document version headers have no gate**~~ — **COVERED, 29 Aug 2026.** `check:legal:parity` branch A2 asserts that a draft's `**Version:**` header is the highest version the file declares, and branch A that it equals the version the page serves. F-9 is fixed and reproduced as a committed specimen in `check-legal-parity.selftest.mjs` |
| **Ledger citation hygiene has no gate.** F-12 found a clause citing the half of a compound entry that `CNV-7` records as never fetched. **F-12 itself is fixed and was swept as a class — the report named three files and there were four — but nothing stops the next one** | `check:claims` verifies that fix claims are *well-formed*, not that citations *discharge* what they are cited for |
| **No UCTA authority has been read, by anyone** — **NEW, `CNV-8`.** The six `L-UCTA-*` entries rest on the statute alone. That states the test, the burden, and which provision reaches which clause; it does **not** answer whether any cap is reasonable, which is decided on case law | The largest remaining gap on the business side, and only a solicitor can close it |
| **INP cannot be asserted in CI** | A field metric. TBT is the lab proxy at the same ceiling |
| **Testimonial selection** (`L-DMCC-SCH20-13`) | Whether negative reviews were omitted is not observable from the repository and no clause can cure it |
| **`COOKIE-POLICY.md` §4A's ICO quotations** | One retrieval, unrepeatable, no ledger entry, load-bearing for D-6 |

---

*End of state report. Nothing was edited in the drafts and nothing was committed.*
