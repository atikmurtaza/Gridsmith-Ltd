# GS-LEGAL-001-R10 — hosting closeout and Privacy adoption package

**Date:** 8 October 2026. **Branch:** `claude/sweet-mendel-11qvli`, from R9 HEAD
`ad8e224b40c56f39919e907c3c89ea2cce602f23` (CI `37690148501`, success).
**Scope:** a finite closeout. It uses R9's verified findings and does no new broad research.

**Result: READY FOR OWNER PRIVACY ADOPTION (version 2.3), with one Art. 28 contractual step remaining
before publication.**

This record is not legal advice and claims no solicitor review. No other business is named, and no
account history is described.

## 1. Statuses, kept separate

| Track | Status |
|---|---|
| **Retention** | **CLOSED.** `RETENTION-ROUTINE-OPERATING` was recorded at R9. It is not reopened |
| **Hosting infrastructure decision** | **CLOSED / OWNER APPROVED.** The existing multi-domain Hostinger Business infrastructure is used for Gridsmith. Gridsmith's admin department manages the existing hosting account |
| **Account migration or ownership change** | **NOT REQUIRED:** excluded by owner decision, and not required by Art. 28 alone (R9 §3.2 q4). No new account, domain, plan, VPS, migration, transfer or ownership change |
| **Art. 28 contractual chain (`HOSTINGER-PROCESSOR-CHAIN`)** | **OPEN: residual contractual documentation.** Not marked satisfied. The gap affects **current** processing on the account (the contact@gridsmith.uk mailbox and anything served from it) until the arrangement is signed. The owner accepts that risk for that period and for continued pre-launch development. **This is not legal compliance and not a waiver of UK GDPR.** Now a **publication prerequisite** (§3) |
| **Privacy wording** | Version **2.3** is accurate on the current facts (§2). **Ready for owner adoption**; not adopted |
| **Publication and cutover** | `CUTOVER-AUTHORITY`, `H4-B-INTAKE-PROMOTED` and `HOSTINGER-PROCESSOR-CHAIN`. None is met |

## 2. Privacy 2.2 → 2.3 (one sentence)

**Finding:** 2.2 §7 ¶3 said "we rely on the safeguards in each provider's data processing terms: … for
Resend and Hostinger, the international transfer safeguards set out in their data processing
agreements". For Hostinger, that asserts a contractual reliance by Gridsmith that is **not currently
established**: Hostinger's terms bind it to the Account owner (R9 §3.2 q5, q7). Everything else in 2.2
is accurate on the current facts. In particular:
- §6 says only that Hostinger's terms "apply to the hosting account through which we receive its
  service";
- §6 states France, the CDN and the email hosting;
- §8 states Hostinger's own periods by criteria.

**Change (2.3), with no other wording changed:**
- **Header:** `Version 2.3`, `Draft date: 8 October 2026`.
- **§7 ¶3:** "we rely on the safeguards in our providers' data processing terms: for Supabase, the UK
  International Data Transfer Addendum to the EU standard contractual clauses; for Resend, the
  international transfer safeguards set out in its data processing agreement. Hostinger's data
  processing terms for the hosting account through which we receive its service set out the
  international transfer safeguards that apply to its processing, including through its content
  delivery network."

**Mandatory disclosures kept:**
- the Art. 13(1)(f) transfer facts (§7 ¶1–2 unchanged);
- a reference to the safeguards, which Hostinger's DPA sets out (SCCs and the UK Addendum, DPA §9);
- how to obtain details (unchanged).

The UK-to-France hosting leg relies on UK adequacy for the EEA.

**Fingerprints:**
- 2.2: `2404a1cfd985ae5a2e248b605075260558b28990d999d6612795ff48050d8c1e` (superseded draft).
- **2.3 draft:** `d388e8441b80a773102ee24d3eaaaec1b228c57fa70ada02b7eafb117c9c59a4`.

**A-1:** only `seed-legal-privacy` was reseeded in `development` (`spzu6y31`, identity proven): version
2.3, `OWNER_REVIEW_REQUIRED`, 121 documents before and after. Production Sanity was not addressed.

## 3. Gate change (separating adoption from the contract)

- `HOSTINGER-PROCESSOR-CHAIN` **moves** from `REQUIRED_ADOPTION_EVIDENCE.privacy` to
  `REQUIRED_PREREQUISITES.privacy`.
- **Reason:** the R6 rule asks for adoption evidence where the adopted text describes something as
  already true. 2.3 no longer states reliance on Hostinger's safeguards, so the text does not depend on
  the chain.
- **Still enforced:** an adopted Privacy entry must list it as a publication prerequisite, and
  `PUBLISHABLE` is refused without recorded evidence. **Publication is not loosened.**
- **Selftest 103 → 105.**
  - Cases: listing required; `PUBLISHABLE` refused without chain evidence; `PUBLISHABLE` clean with all
    four.
  - Mutants: removing the chain from the prerequisites turns "listing required" red; re-adding it as
    adoption evidence turns the clean adoption case red. The file was restored byte-identical.

## 4. The one remaining Art. 28 step

**Prepared:** `../../operations/HOSTING-PROCESSING-ARRANGEMENT-DRAFT.md`. It is one role-accurate draft
agreement, unexecuted.
- The Account owner is Hostinger's Customer. Under the arrangement it acts as Gridsmith's processor for
  gridsmith.uk data only, appointing Hostinger as sub-processor. This is the structure DPA §2.2 states:
  "If Customer is a Processor … the appointment of Hostinger as another Processor … authorized by the
  relevant Controller".
- It also covers:
  - Art. 28(3)(a)–(h), including the transfer limb of (a);
  - Art. 28(2) and (4), including the Account Holder's full liability for Hostinger;
  - continuity;
  - forwarding Hostinger's sub-processor and incident notices (DPA §6, §7.4).
- A Hostinger support enquiry was **not** prepared. ToS §4 already settles who Hostinger treats as owner,
  so an enquiry could not complete the chain.

**Exact real-world step:**
1. Gridsmith Ltd and the Account owner sign the arrangement, with the counterparty's details completed
   only in the executed copy, kept outside this repository.
2. **If the Account owner is established outside the UK,** also complete a UK transfer mechanism (the
   ICO IDTA, or the UK Addendum to the EU SCCs).
3. Before publication, a short legal phase:
   - records `HOSTINGER-PROCESSOR-CHAIN` evidence (the date and the fact of execution);
   - reviews Privacy §6 (recipient category) and §7 (transfer coverage) for the executed arrangement.

That review could require a further minor version. It is not part of the adoption decision now.

The same review should also consider adding "or where they are available" to §7's "You can ask us for
details of these safeguards" (Art. 13(1)(f) "means by which to obtain a copy"). This wording is unchanged
since 2.2 and does not block adoption.

## 5. Owner adoption package — Privacy Policy 2.3

| | |
|---|---|
| Document | `docs/_legal/PRIVACY-POLICY.md` |
| Version | **2.3** |
| Draft sha256 (as reviewed) | `d388e8441b80a773102ee24d3eaaaec1b228c57fa70ada02b7eafb117c9c59a4` |
| Adoption edit | One line: `**Draft date: 8 October 2026**` → `**Effective date: 8 October 2026**`. No other byte changes |
| **Adopted sha256 (if the effective date is 8 October 2026)** | `80e67b5256449e2c7fc1562ead2da8ec538b217c8735cba3679f985af50a620b` |
| Adoption evidence | `RETENTION-ROUTINE-OPERATING`: recorded |
| Publication prerequisites to be listed | `CUTOVER-AUTHORITY`, `H4-B-INTAKE-PROMOTED`, and `HOSTINGER-PROCESSOR-CHAIN`, whose requirement reads: "hosting processing arrangement executed; UK transfer mechanism if the account owner is outside the UK; Privacy §6 and §7 reviewed against it". None is met |
| Markers / placeholders | 0 |
| Not claimed | Solicitor review; Art. 28 completion for Hostinger; publishability |

**Owner adoption statement to use:**

> "I adopt Gridsmith Ltd's Privacy Policy version 2.3 (draft sha256 d388e8441b80a773102ee24d3eaaaec1b228c57fa70ada02b7eafb117c9c59a4), effective 8 October 2026, with its header changed to 'Effective date: 8 October 2026' (adopted sha256 80e67b5256449e2c7fc1562ead2da8ec538b217c8735cba3679f985af50a620b). Publication remains subject to CUTOVER-AUTHORITY, H4-B-INTAKE-PROMOTED and HOSTINGER-PROCESSOR-CHAIN."

If a different effective date is wanted, the adopted sha256 changes with it and is recomputed at
adoption.

## 6. Closeout

R10 closes the hosting and Privacy-wording work. **No R11 repeats the Hostinger analysis.**

After the owner adopts, the next substantive work is:
- legal site integration;
- the planned production-readiness work, subject to its own gates.

These stay as they are:
- H4-B Production intake: not promoted;
- H4-H cutover: not authorised;
- Freelancer permission: a production blocker;
- `GS-X002`: gates the Technical services;
- Path Finder: withheld;
- no public legal publication without its approvals.

## 7. Verification and review

### 7a. Results

**Local verification** (all before the single R10 commit):
- **A-1:** development identity proven (`spzu6y31`; datasets `production`/`development`; target
  `development`). Only `seed-legal-privacy` was replaced: 2.2 → 2.3, `OWNER_REVIEW_REQUIRED`, 121
  documents before and after.
- **Clean `next build` against `development`:** EXIT 0. Served on port 3217:
  - `check:legal:parity` PASS: 6 documents, 107 clauses, 437 paragraphs; Privacy 2.3 served word for word;
  - `check:consumer-terms` PASS;
  - `check:company` PASS;
  - `check:launch` PASS;
  - `check:vat` PASS.
- **`verify:static` EXIT 0.** It includes:
  - `check:legal:adoption` PASS;
  - adoption selftest **105**;
  - legal-parity selftest 39;
  - company selftest 80;
  - migration dry run: 47 eligible, 10 gated;
  - `check:struck`.
- **Gate mutants** (file restored byte-identical):
  - the chain removed from the publication prerequisites: red on "listing required";
  - the chain re-added as adoption evidence: red on "adopted clean".
- **Byte checks:**
  - the six adopted drafts and `scripts/seed-legal.mjs` are unchanged, and their fingerprints match;
  - Privacy 2.3 draft `d388e844…`; adoption hash `80e67b52…`, computed in memory.
- `git diff --check` clean. No credentials, personal data or counterparty identity.

**Independent review** (one reviewer):

**Result:** 0 HIGH, 4 MEDIUM, 6 LOW, plus NOTEs.

**MEDIUM:**
1. **M1:** the draft lacked the Art. 28(4) full-liability clause.
2. **M2:** the draft lacked the transfer limb of Art. 28(3)(a).
3. **M3:** the risk acceptance was scoped to pre-launch development. It now covers current processing
   until signature, and still says it is not compliance.
4. **M4:** this section was missing.

**LOW:**
1. **L5:** "immediately".
2. **L6:** objection timing, and the shared-account response.
3. **L7:** the processor register's duplicate heading; route A marked excluded.
4. **L8:** "hosting closed" was ambiguous.
5. **L9:** the chain prerequisite's requirement wording is recorded.
6. **L10:** the §7 "where they are available" point is queued for the post-signing review.

**Narrow re-check:** all fixed. One new LOW (a sentence order in draft §3, introduced by the M2 fix) is
fixed.

**The reviewer confirmed:**
- the §7 change is the minimum truthful correction;
- the gate move is a legitimate separation, not a weakening;
- the draft is role-accurate under DPA §2.2;
- nothing marks the chain satisfied or claims compliance.
