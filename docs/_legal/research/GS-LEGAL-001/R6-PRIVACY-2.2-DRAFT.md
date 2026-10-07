# GS-LEGAL-001-R6 — owner evidence applied; Privacy Policy 2.2 draft

**Date:** 7 October 2026. **Branch:** `claude/sweet-mendel-11qvli`, from R5 HEAD
`7c9a9040e2313ff714ea476f2ec8a639e1d949d9`.

**Result: OWNER FACT REQUIRED.**
- **Privacy Policy 2.2** is drafted in `docs/_legal/PRIVACY-POLICY.md` and is
  `OWNER_REVIEW_REQUIRED`. It has no adoption fields and is not seeded anywhere.
- **Two of the three 2.1 markers are resolved.** One `[OWNER DECISION]` marker remains, in §6, on the
  Hostinger account-holder arrangement (§3 below).
- **Adoption is also blocked** until the retention routine operates and the Hostinger processor chain
  is documented. These are new gate conditions: `RETENTION-ROUTINE-OPERATING` and
  `HOSTINGER-PROCESSOR-CHAIN`.
- **Publication** still waits for `H4-B-INTAKE-PROMOTED` and `CUTOVER-AUTHORITY`.
- **Untouched:** no adopted document was edited, and no Production system was touched.

This record adds to R1–R5. It is not legal advice and contains no claim of solicitor review.

## 1. Evidence classes used

| Class | Meaning |
|---|---|
| **OWNER-CONFIRMED FACT** | Reported by the owner from their own accounts or knowledge in the R6 brief |
| **CURRENT OFFICIAL PROVIDER FACT** | From the provider's own published material, read at source (R5 Supabase repository) or verified by the owner outside this environment (R6) |
| **CURRENT UK PRIMARY/OFFICIAL LAW** | Verified by the owner outside this environment against legislation.gov.uk and GOV.UK/HMRC (R6). This environment still cannot reach those hosts |
| **INFERENCE** | Reasoned from the above. Labelled wherever it appears |
| **UNKNOWN / NOT REQUIRED FOR PUBLIC WORDING** | Not established, and the public text does not depend on it |

## 2. Evidence closed

| Check | Result | Class |
|---|---|---|
| **E-1 Hostinger contracting position** | The hosting subscription was bought in 2024 by **another business, not Gridsmith Ltd**, for four years, prepaid to 2028. There is no Gridsmith Ltd invoice. Hostinger's terms indicate that UK customers contracting directly would ordinarily contract with Hostinger UK Limited, and its DPA covers the relevant Hostinger entities. That is **provider-level only and does not make Gridsmith the contracting customer**. The subscription holder's identity is not recorded in the repository and is not needed in public wording. **Closed as a fact; it opens the arrangement question in §3** | OWNER-CONFIRMED; CURRENT OFFICIAL PROVIDER FACT |
| **E-2 Hostinger server and email** | Website server location: **Europe — France**. The mailbox is a free business email service supplied through Hostinger (Manage Email opens a webmail interface). **The product is not identified, and Titan is not claimed.** The public text says "email hosting … through Hostinger". The mailbox storage location is not established | OWNER-CONFIRMED; UNKNOWN (product label; mailbox location) — not required for public wording |
| **E-3 Resend** | Plan **Free** (transactional 3,000 emails, $0; marketing 1,000 contacts, $0; receiving 0). The oldest visible sent email was 12 days old. That shows data of that age is visible; **it is not a retention period**. Provider: **30-day data retention on Free**, covering email and log data (Free, Pro and Scale); **backups persist for 7 days**; after termination, remaining data is deleted within the provider's stated period. **Closed** | OWNER-CONFIRMED; CURRENT OFFICIAL PROVIDER FACT |
| **E-4 Supabase logs** | Organisation on the **Free** plan. In the owner's Logs view, every visible log carried the current date. Supabase documentation (current, checked outside this environment) says Free-plan users can access logs from the **last day**. **Dashboard view window: last day — established. Provider-side retention beyond that: not established** (see §4). No support ticket is needed for Privacy. One remains **optional**, only to learn provider-internal retention | OWNER-CONFIRMED; CURRENT OFFICIAL PROVIDER FACT; UNKNOWN (provider-side) — not required for public wording |
| **E-5 Hostinger log retention** | No reliable official numerical period. **Non-blocking:** Privacy uses criteria ("periods Hostinger determines according to its operational, security and legal requirements") | UNKNOWN — not required for public wording |
| **Resend DPA** | Entity **Plus Five Five, Inc.** The DPA is incorporated into the applicable customer agreement and binds through it, so a separately signed DPA is not needed for the standard DPA to apply. **No separately signed DPA is recorded.** Transfer safeguards are documented in the DPA and security material | CURRENT OFFICIAL PROVIDER FACT |
| **Statutory periods** | See §5 | CURRENT UK PRIMARY/OFFICIAL LAW |

## 3. Hostinger intermediary analysis

**Facts:**
- Another business holds and paid for the Hostinger subscription.
- Gridsmith uses the hosting (website in France, CDN, mailbox).
- Gridsmith Ltd has no invoice and no direct acceptance of Hostinger's terms on record.

| Question | Answer from evidence |
|---|---|
| 1. Does the subscription-owning business merely pay for and hold the account? | It holds and paid for it (owner-confirmed). **Whether it does anything more is not established** |
| 2. Can it, or its staff, access hosting files, databases, email, logs, account-level support or other personal data? | **Not established.** Holding a subscription does not prove access, and none is inferred. *Inference, not relied on:* an account holder ordinarily has administrative control of the account |
| 3. Is Gridsmith an authorised user or controller operating within that account? | Gridsmith is the **controller** of the personal data processed through its website, logs and mailbox: it decides the purposes and the means. Whether it has delegated or own-login access is not recorded |
| 4. Does the intermediary process personal data on Gridsmith's behalf? | Only if it can access or operate the account on Gridsmith's behalf. **Open** (question 2) |
| 5. Is a processor or data-sharing agreement needed? | **Yes, in either case, to document Gridsmith's processor chain** (UK GDPR Art. 28(3), *inference from the contract structure*). Hostinger's DPA binds Hostinger to its customer, the account holder, not to Gridsmith. Two routes close it: a written processing agreement with the account holder (with Hostinger as sub-processor), or transferring the account to Gridsmith Ltd. Access (question 2) decides whether the account holder must also be described as a recipient |

**Classification (revised after the independent review):** *processor*, with Hostinger as its
*sub-processor*. As account holder it can suspend or delete the account, and so Gridsmith's data,
whatever its day-to-day access. "Infrastructure intermediary" is not a UK GDPR role and is used only
as a description.
- **Not:** a joint controller, nor an independent controller. There is no evidence it uses the data for
  its own purposes.

**Effect on Privacy.** The public text says, truthfully today, that Hostinger provides the hosting
"through a hosting account held by another business". It does not
name that business (Art. 13(1)(e) allows categories). It does **not** say Gridsmith contracts with
Hostinger.

One marker states exactly what the owner must confirm and put in place before adoption. The detailed
record is `../../operations/PROCESSOR-REGISTER.md`.

**The owner question:** *"Can the company that owns the Hostinger subscription, or its staff, access
Gridsmith's hosting files, mailbox, logs or other account data?"* — and where is that company
established? The second part matters if it is outside the UK and EEA, because §7 would then have to
cover it.

**Adoption needs evidence, not just marker removal:** `prerequisitesMet["HOSTINGER-PROCESSOR-CHAIN"]`
must record the signed processing agreement or the account transfer. The Hostinger transfer limb in §7
also needs a direct reading of Hostinger's DPA transfer terms; R5 had only search summaries of them.

## 4. Supabase logs — R6 reconciliation of R5 (addendum; R5 is not rewritten)

| Point | R6 position |
|---|---|
| Dashboard view window, Free plan | **Last day.** Owner dashboard observation (all visible logs dated the current day) and current Supabase documentation. Renamed from "customer-accessible window" after review: R5 retrieved older records through Gridsmith's own account access via the logs API, so "we can view these logs for one day" would not be safe in Privacy |
| R5's observation | R5 queried the logs API through the connected Supabase tool (read-only, counts and field names only). It returned records dated from 18 August 2026 on Production and from 2 October on Preview. **That is not evidence that an ordinary Free-plan dashboard user can see 49 days of logs, and R6 does not describe it so.** It shows only that records older than one day were returned through that API path on 7 October |
| Provider-side retention | **Not established.** R5's observation means one-day deletion cannot be asserted. Nothing establishes a provider-side period either. Privacy therefore claims neither 24-hour deletion nor 49-day retention |
| Content | Request logs carry client-IP header fields, country and user agent (R5, field names only). Unchanged |
| Privacy 2.2 wording | "It keeps technical logs of each request, including IP addresses and browser details, and may keep backup data. Supabase decides how long these logs and backups are kept, and deleting an enquiry does not delete them." No viewing window, deletion period or provider purpose is stated |
| Production Edge Functions | **None** (read-only re-check, R6). The intake runs only on Preview until H4-B is promoted |

R5's statements that the published "1 day" is "not a deletion period" and "what it governs is
unconfirmed" are refined: it governs the **dashboard view window**, and provider-side retention
stays unknown.

## 5. Retention law (CURRENT UK PRIMARY/OFFICIAL LAW, owner-verified outside this environment)

| Rule | Period | What it governs |
|---|---|---|
| Companies Act 2006 s.388 (private company) | **3 years** from the date the accounting records required by s.386 are made | The statutory minimum for company accounting records. It does **not** permit destroying tax records at 3 years |
| HMRC / Corporation Tax (GOV.UK guidance) | **6 years from the end of the relevant accounting period**, longer in stated circumstances | Company and Corporation Tax records |
| Limitation Act 1980 s.5 | **6 years** from accrual, for actions on a simple contract | The evidence rationale for keeping contract and project records |

**These periods are cumulative, not contradictory.** Where a record falls into more than one category,
the longest applicable period governs, and existing exceptions requiring longer retention are kept.

**Effect on R1–R20:** none of the periods changes.
- R5 (project records, 6 years after the end of the financial year the project ended) satisfies
  HMRC's 6 years and the s.5 rationale.
- R6 (accounting records, 6 years from the end of the financial year, longer where HMRC requires)
  satisfies HMRC and exceeds s.388.
- R7 (title documents, reliance plus 6 years) rests on the s.5 rationale.

The UNVERIFIED markers in `RETENTION-SCHEDULE.md` §6 are replaced by this verification. ss. 14A/14B
(latent damage) remain unverified and are used only as a consideration for future Technical work.

## 6. Privacy Policy 2.2 — what changed from 2.1

| § | Change | Evidence |
|---|---|---|
| Header | Version 2.2, Draft date 7 October 2026 | — |
| §2 ¶3 | Providers' logs record IP, country and browser details; Supabase receives the form | R5 §3.3; `lib/leads/edge-client.ts:23` |
| §6 Hostinger | Servers in France; CDN; email hosting through Hostinger (no product named); used through another business's account; **marker** | E-1, E-2 |
| §6 Supabase | Supabase Pte. Ltd., Singapore; US sub-processors; request logs with IP; Supabase decides retention; lead deletion does not reach logs | R5 §3.1; E-4 |
| §6 Resend | Plus Five Five, Inc., US; 30 days; backups, which may contain them, kept for up to 7 days | E-3; Resend DPA |
| §6 processor terms | Supabase and Resend under their incorporated DPAs; Hostinger's terms apply to the account. **The 2.1 marker is removed** | R5 §3.1; R6 §2 |
| §7 ¶1 | Ireland (enquiries) and France (website), both UK-adequate; Supabase Singapore with US sub-processors | E-2; R5 §3.1 |
| §7 ¶2 | Resend processes and keeps records in the US; CDN may serve from outside the UK and Europe | E-3; R5 P-03 |
| §7 ¶3 | For transfers outside the UK and EEA: Supabase's UK Addendum; Resend's and Hostinger's DPA transfer safeguards. **The 2.1 marker is removed.** The Hostinger limb stays under the §6 marker until its DPA is read directly | R5 §3.1; R6 §2; R5 P-02 (search summary) |
| §8 ¶2 | Adopted R1–R9 periods; enquiries deleted at monthly reviews, other records at annual reviews, working files checked quarterly (matching the routine in `RETENTION-SCHEDULE.md` §2); providers' own periods; accounting 6 years. **The 2.1 marker is removed** | `RETENTION-SCHEDULE.md`; §5 |

**Retention: policy versus operation.** §8 states the adopted periods and when records are deleted:
enquiries at the first monthly review, other records at the first annual review, and working files
checked quarterly. That describes the routine as operating, and **the routine
is not operating** (no cleanup run, no first monthly log, the `pg_dump` not handled). So:
- the draft does not say "we currently perform" anything;
- `check:legal:adoption` now refuses Privacy at `OWNER_ADOPTED` without recorded evidence for
  `RETENTION-ROUTINE-OPERATING` (`REQUIRED_ADOPTION_EVIDENCE`);
- no operational history is fabricated.

**H4-B.** §2 ¶3 and §6 describe the Supabase Edge Function intake. That intake is the production form
architecture once H4-B is promoted; until then Production has no Edge Functions. `H4-B-INTAKE-PROMOTED`
stays a publication prerequisite. Cutover has not begun, so gridsmith.uk is not yet served by this application. The draft describes the
site it will be published with, and publication waits for that.

## 7. Gate change

`scripts/legal-adoption-rules.mjs`: `REQUIRED_ADOPTION_EVIDENCE = { privacy: ['RETENTION-ROUTINE-OPERATING', 'HOSTINGER-PROCESSOR-CHAIN'] }`.
An adopted Privacy entry needs a non-empty `prerequisitesMet` entry for each.

- **Selftest:** 103 cases. The four new ones cover missing retention evidence, empty retention
  evidence, missing Hostinger chain evidence, and other documents being unaffected; the control is
  updated.
- **Mutants,** each red on its named cases: the loop removed; the empty-string branch removed; the
  privacy list emptied; `HOSTINGER-PROCESSOR-CHAIN` removed from the list.
- **Real gate, Privacy falsely adopted** (re-run after the review fixes): 9 problems, namely no text
  hash, no authority, no retention evidence, no Hostinger chain evidence, no CUTOVER-AUTHORITY, no
  H4-B-INTAKE-PROMOTED, an open marker, a Draft date and no Effective date. Restored byte-identical.

## 8. Unchanged

- Owner IP position (R5): template 01 required, no employment relationship relied on, template 02
  only under an actual written employment contract with suitable IP terms, nothing signed.
- A-1: deferred to a trusted environment with existing development credentials. No token requested.
- CI `check:legal:parity` against the development dataset: expected to fail until the development
  legal documents are reseeded. That is dataset drift, not a source regression. The gate is unchanged.

## 9. Independent review

One fresh read-only reviewer covered the Hostinger relationship, the controller and processor wording,
Supabase logs, Resend, transfers, statute, policy versus operation, H4-B and cross-document
consistency.

**Result:** 0 HIGH, 5 MEDIUM, 6 LOW, 3 NOTE; all fixed.

**MEDIUM:**
1. §8's "monthly reviews" was wider than the routine. Now: enquiries monthly, other records annually,
   working files checked quarterly. "Or made anonymous" is dropped. Schedule §2 gives R7 and R9 an
   annual cadence.
2. "We can view these logs for one day" was unsafe. Now Supabase decides how long logs and backups are
   kept, and no provider purpose is stated.
3. The Hostinger marker did not reach the dependent sentences, and removing it was self-attested. The
   marker now names them and requires the direct DPA reading, and `HOSTINGER-PROCESSOR-CHAIN` is added
   to the adoption evidence.
4. The §7 safeguard sentence could exclude the US. Now "for transfers outside the UK and the European
   Economic Area".
5. The retention documents described the old marker control. Now restated.

**LOW:** "arranged the service for us" removed; backup phrasing clarified; the 2028 transfer made the
interim route under option 1; the establishment question added; owner action 3 spelled out; the
schedule's stale re-read paragraph superseded.

**NOTE:** the account holder is now treated as a processor; confirming that the Supabase and Resend
accounts were opened for Gridsmith Ltd is recorded as recommended and non-blocking; this §9 replaces the
dangling §9a.

### 9a. Narrow re-check

A second read-only pass confirmed all 14 findings fixed, with no new public-text, gate or state
problem. It found five LOW leftovers in internal records, all fixed:
- this record quoted the old Hostinger sentence;
- this record described §8 as monthly-only;
- the false-adoption proof count was out of date (now 9);
- "customer-accessible window" survived in three places (now "dashboard view window");
- the register `stateRecord` did not name the second evidence key.
