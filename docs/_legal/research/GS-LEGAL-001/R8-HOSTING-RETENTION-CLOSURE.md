# GS-LEGAL-001-R8 — hosting evidence and retention routine closure

**Date:** 7 October 2026. **Branch:** `claude/sweet-mendel-11qvli`, from R7 HEAD
`4e9d591d27bf7ac13654502a23904fd2d9840617` (CI `37646987523`, success on attempt 2).
**Environment:** Claude Desktop, the owner's machine. **Workflow:** all work, the review and its fixes, and verification were
done locally before a single R8 commit and push.

**Result: HOSTING EVIDENCE REQUIRED.**
- **Hosting:** the owner's operational fact closes management. One precise contractual point remains
  (§2.3).
- **Privacy 2.2:** **byte-identical to R7**, `OWNER_REVIEW_REQUIRED`, 0 markers, not ready for adoption.
- **Retention:** the first monthly review is done and logged (database 0, email 0, WhatsApp/SMS 0).
  `RETENTION-ROUTINE-OPERATING` is **not** set: one owner step remains (§3.2).
- **Sanity:** no write; Privacy is unchanged.

This record is not legal advice and claims no solicitor review.

**Owner instruction applied (R8):** programme and legal documentation describe the hosting account by
its current operation only: **"Gridsmith's admin department manages the hosting account."** The
account's purchase history and any other business are not recorded. The earlier R5–R7 passages that
described them are redacted in place, and git history keeps them.

## 1. State re-verified

| Item | Value |
|---|---|
| Local and remote HEAD | `4e9d591d…`, equal |
| Privacy 2.2 | sha256 `2404a1cfd985ae5a2e248b605075260558b28990d999d6612795ff48050d8c1e`, 0 markers, `OWNER_REVIEW_REQUIRED` |
| Six adopted documents | unchanged, equal to `ownerAdoptedSha256` |

## 2. Hosting

### 2.1 Facts

| Fact | Source |
|---|---|
| **Gridsmith's admin department manages the hosting account**, the Gridsmith website hosting and the administrative hosting access | Owner (R8) |
| Hostinger hosts the website on servers in France, with its CDN, and provides email hosting for contact@gridsmith.uk | Owner (R6 E-2) |
| **The Hostinger account's customer details identify a party other than Gridsmith Ltd.** This is the party that accepted Hostinger's Terms of Service, which the DPA calls the "Customer" | Owner, in answer to one question asked in R8. No identity is recorded |

### 2.2 Hostinger's official terms

The DPA at hostinger.com/legal/dpa was read directly on 7 October 2026 (revised 2026-09-29 11:49:03):
- **Incorporation:** the DPA "is annexed to and supplements our Terms of Service" (preamble). No
  separate signature is needed. The SCCs are deemed signed "as of the date of Data Exporter's
  electronic acceptance of Data Importer's Terms of Service" (§9.2).
- **Parties:** "Customer" is the party entering into the agreement (preamble). The Customer is
  "a Controller or Processor, as applicable" (§2.1). A processor-Customer warrants that its controller
  authorised its instructions (§2.2).
- **Covered Services** include "Email Services" (§1.1).
- **Location:** no data-centre choice is stated, and "end user's data may be processed outside of their
  country of origin" (§2.2).
- **Sub-processors (Appendix 3):** Cloudflare (CDN), MailChannels and Proofpoint (email), AWS and
  Google Cloud, and others. The DPA states no location or purpose for any of them.
- **Transfers:** SCCs Module Two and Module Three (§9.1–9.2), plus the UK International Data Transfer
  Addendum (§9.3).

### 2.3 What `HOSTINGER-PROCESSOR-CHAIN` must prove (redefined at R8; gate unchanged in force)

The key verifies the **real processing arrangement**. It no longer asks for an inter-company processor
agreement, an account history, or a transfer of the whole account.

| # | Element | Status |
|---|---|---|
| 1 | Gridsmith manages its website hosting | **Met** (2.1, owner) |
| 2 | Gridsmith's admin department manages the hosting account and its administrative access | **Met** (2.1, owner) |
| 3 | Hostinger supplies the underlying hosting infrastructure | **Met** (2.1; DPA §1.1) |
| 4 | Website hosting is in France | **Met** (E-2) |
| 5 | Email hosting is supplied through Hostinger | **Met** (E-2; "Email Services" §1.1) |
| 6 | Privacy describes the services accurately | **Met** for §6 (§2.4) |
| 7 | Gridsmith Ltd is the Customer bound by Hostinger's terms for the gridsmith.uk website and mailbox. This makes Privacy §7's reliance on Hostinger's safeguards accurate, and sends Hostinger's notices to a Gridsmith-controlled address | **Not met:** the account's customer of record is not Gridsmith Ltd |

**The precise residual (UK GDPR Art. 28(3)):**
- Processing by a processor must be governed by a contract that binds the processor "with regard to the
  controller".
- Hostinger's Terms and DPA bind Hostinger to its Customer, and the owner confirms the account's Customer
  is not Gridsmith Ltd. So no contract on record binds Hostinger with regard to Gridsmith Ltd.
- **Consequences (review M3, M4):**
  - The SCCs and UK Addendum (DPA §9) run to the Customer, not to Gridsmith. That affects the onward
    transfers to sub-processors outside the EEA, such as Cloudflare, MailChannels and Proofpoint. The
    UK-to-EEA leg (France, Cyprus) is covered by UK adequacy regulations.
  - Hostinger's notices go to its Customer's contact address, including sub-processor changes (DPA §6)
    and breach notices. That bears on Gridsmith's Art. 33 timing.
  - The customer of record keeps the contractual power to suspend or end the account (Art. 32(1)(b)–(c)
    availability).
  - Art. 28(3) is a controller obligation. This is a compliance point, not only a disclosure point, and
    operational management does not change the contracting party.

**Ways to close it (owner's choice; (a) recommended, (b) not recommended):**
- **(a) Gridsmith Ltd becomes the Customer for the gridsmith.uk website and mailbox.**
  - **The minimum:** they sit under a Hostinger account whose Customer is Gridsmith Ltd, for example by
    moving them into a Gridsmith Ltd account. Changing the existing account as a whole is not required.
    Which mechanisms Hostinger offers is not verified here.
  - **After the change:**
    - re-confirm that hosting is in France and that the mailbox is still email hosting through
      Hostinger (elements 4 and 5);
    - confirm that the account's contact address is Gridsmith-controlled.
  - Elements 6 and 7 are then met with Privacy unchanged.
- **(b) An explicit, recorded owner risk decision** for a stated period, in the pattern of `GS-O005`.
  - The evidence would record **an accepted Art. 28(3) non-compliance (Art. 83(4)(a) tier), not
    satisfaction of element 7**.
  - Privacy §7's Hostinger reliance limb, and §6's last sentence, would have to be narrowed. That means a
    re-hash, a fresh review and an A-1 reseed.
  - Recorded only as an option; not applied.

R7's interim "route 2" (a processing arrangement with the account's customer) is **withdrawn** under the
R8 instruction.

### 2.4 Privacy 2.2 Hostinger wording: unchanged

- **§6:** Hostinger hosts the website in France with its CDN, provides email hosting, and processes
  request data. "Hostinger's data processing terms apply to the hosting account through which we
  receive its service." This is accurate (2.1, 2.2). No history, internal structure or other company is
  mentioned.
- **§7:** the CDN "may serve the website from locations outside the UK and Europe", which is accurate
  (DPA §2.2, Cloudflare). The Hostinger limb of the safeguards sentence is the element 7 residual.
- **Email-side transfers (review L1):** DPA §2.2 says data may be processed outside its country of
  origin. MailChannels and Proofpoint are listed with no location. Privacy §7 ¶2 names only the CDN, so the
  email side is covered by §7 ¶3 (Hostinger's transfer safeguards) alone. Not materially inaccurate; queued
  as "and its email service" in ¶2 for the next Privacy edit.
- **Decision:** materially accurate apart from element 7. Element 7 resolves without a text change under
  (a). So Privacy is **left byte-identical**, as the brief prefers.

## 3. Retention

### 3.1 The 2 October `pg_dump`

| Check | Result |
|---|---|
| Exists | `%USERPROFILE%\gridsmith-backups\supabase-production-20261002T125412Z.dump`, 25,465 B, header `PGDMP` |
| Identity | sha256 `96e4885f6da00dc0f50d1c3d45d3957740554c3d8af631af08f81ba2c1cdef6a`, equal to the GS-PROD-003-R1 §7 record (`96e4885f6da00dc…`) |
| Contents | Every zlib data stream was inflated read-only. COPY targets: `_gridsmith_migrations`, `events`, `leads`, `press_path_results`, `sample_grants`. Only `leads` holds rows with addresses: **63 rows, all at the six R7 probe addresses** (29/29/2/1/1/1), **0 non-probe rows**. No genuine client lead |
| Schema recoverable | The Production ledger SHAs (0001 `39647b54ac55`, 0002 `97012e3e15c4`, 0003 `375b08ff1cab`, 0004 `bd761ff9b9e4`) equal the runner's sha256 prefix of each repository file |
| Recovery dependence | No runbook or script on any branch references this dump. GS-PROD-005's database row says "owner restore/upgrade" generically |
| **Action** | Moved from `gridsmith-backups` to the Windows **Recycle Bin**, after a hash re-check, on 7 October 2026. The original path no longer exists. The other three backups were untouched |
| **Permanent deletion** | **Pending, owner.** Claude's operating rules forbid permanently deleting files or emptying the trash, even on instruction. The owner asked twice and the limit was stated each time. The owner removes that single item from the Recycle Bin |

### 3.2 First monthly retention review — 7 October 2026

| Component | Result |
|---|---|
| Production identity | `dqiutgmxillhsbzgnlsx` "Gridsmith Project" (the R7 identity) |
| Database (read-only, 2026-10-07T18:49:59Z) | **leads 0**; `sample_grants` 0; `press_path_results` 0; `events` 0; RLS 5/5, 0 policies, 18 lead constraints. **0 records requiring classification or deletion** |
| Email (contact@gridsmith.uk; Inbox, Sent, Trash) | **0 deletion candidates** (owner check, aggregate only) |
| WhatsApp/SMS | **0 deletion candidates** (owner check, aggregate only) |
| R17 | The 2 October dump moved to the Recycle Bin; **permanent deletion pending (owner)**. The R7 baseline JSON is kept until the next monthly run (checklist B step 7) |
| Restore-test container | Docker not running, so not verified. **Non-blocking**: the restore database held only the 63 probe rows, not genuine personal data |
| Resend copies of the A-08 probe notifications (R7 C6) | Probe values only. They lapse under Resend's 30-day Free retention, about 11 October 2026 for the last one (11 September). No action needed |
| Quarterly items in this October run | Not run. The first quarterly review is January 2027 by choice (§3.3); there is no Production outbox (R10) |
| Logged | `%USERPROFILE%\gridsmith-records\RETENTION-LOG.txt` (counts only) |

### 3.3 Routine

| | |
|---|---|
| Primary operator | Atik Murtaza |
| Operational department | Gridsmith's admin department |
| Deputy | **None currently appointed.** Recommended for resilience; not a legal requirement |
| A2 (access route) | **Met:** Supabase through the Gridsmith Org; the mailbox and WhatsApp through the admin department (shown by today's checks); the log at `%USERPROFILE%\gridsmith-records` |
| **Monthly** | First working day. Next: **Mon 2 November 2026**, then Tue 1 December 2026 |
| **Quarterly** | With the January, April, July and October monthly runs. First: **Mon 4 January 2027** (1 January is a bank holiday) |
| **Annual** | First working day after the financial year end. Companies House: incorporated 24 February 2026; first accounts made up to **28 February 2027**. First annual: **Mon 1 March 2027** |
| R7 baseline JSON | Kept and controlled: on the owner's machine, outside the repository, probe data only. Delete at the 2 November 2026 monthly run (B step 7) |

**`RETENTION-ROUTINE-OPERATING`: NOT SET.**

| # | Condition (R8 brief, Task 10) | State |
|---|---|---|
| 1 | Initial Production classification | Met (R7) |
| 2 | Authorised cleanup | Met (R7) |
| 3 | Obsolete dump safely handled | **Not met:** it is in the Recycle Bin, pending the owner's permanent deletion (the R8 brief, Task 4, asks for the file to be verified gone) |
| 4–6 | Database, email, WhatsApp/SMS reviews | Met (§3.2) |
| 7 | First review logged | Met |
| 8 | Cadence recorded | Met (§3.3) |
| 9 | Retained cleanup evidence controlled | Met |

**When condition 3 is met:** once the owner confirms the item is gone, and Claude verifies the Recycle
Bin read-only, the evidence can be recorded in the register as `prerequisitesMet["RETENTION-ROUTINE-OPERATING"]`.
**Restore-test container (review M2):**
- It is **non-blocking by the owner's R8 instruction** (Task 6): with Docker unavailable it is
  housekeeping unless it holds a genuine personal-data copy. It held only the 63 probe rows.
- The dump is treated differently because the brief makes its verified deletion a condition (Tasks 4 and
  10), and its existence is known, whereas the container's is not.
- Checklist Part F is amended to match.

With the dump deleted, nothing else is outstanding for the routine.

## 4. Privacy adoption readiness

| Requirement | State |
|---|---|
| Markers | 0 |
| `HOSTINGER-PROCESSOR-CHAIN` | **Not met:** element 7 (§2.3) |
| `RETENTION-ROUTINE-OPERATING` | **Not met:** condition 3 (§3.3) |
| Local legal gates | Pass (§7) |

**Owner adoption: NOT READY.**
**Publication:** additionally needs `H4-B-INTAKE-PROMOTED` and `CUTOVER-AUTHORITY`. Neither was begun.

## 5. Sanity

Privacy is byte-identical to the text reseeded at R7, so **no Sanity write was made**. Served parity was
re-run read-only against `development` (§7). Production Sanity was not addressed.

## 6. Git history (note)

The redactions are in the working tree only. Earlier public commits (for example `d2f2326a` and
`b196a238`) still hold the account-history narrative. Rewriting public history, or changing the
repository's visibility, would be a separate owner decision. Neither was done.

## 7. Verification and review

See §7a.

### 7a. Results

**Local verification** (all before the single R8 commit):
- Clean `next build` against `development`: EXIT 0. Served on port 3217:
  - `check:legal:parity` PASS: 6 documents, 107 clauses, 437 paragraphs word for word; banners match the
    register;
  - `check:consumer-terms` PASS (0 links to the business terms; `/press` → `#clause-10-1`);
  - `check:company` PASS (10 questions, 18 routes);
  - `check:launch` PASS (reports `development`);
  - `check:vat` PASS.
- `verify:static` EXIT 0. It includes:
  - `check:legal:adoption` PASS;
  - adoption selftest 103;
  - legal-parity selftest 39;
  - company selftest 80;
  - migration dry run: 47 eligible, 10 gated, manifest in agreement;
  - `check:struck`.
- `git diff --check`: clean.
- **Byte checks:**
  - Privacy sha256 `2404a1cf…`, unchanged;
  - the six adopted drafts and `scripts/seed-legal.mjs` are byte-identical to `4e9d591d`;
  - the adopted fingerprints match the register;
  - Privacy markers: 0.
- **Scans:** no new VAT-status, forbidden-approval or solicitor wording; no credentials; no personal
  data. The only addresses are the reserved-domain probe addresses already in R7.
- **Production, read-only:** leads 0; structure unchanged (RLS 5/5, 0 policies, 18 constraints, ledger
  0001–0004).
- **No Sanity write.**

**Independent review:** one fresh read-only reviewer covered the evidence key, the Privacy wording, the
dump, the first review, the routine and adoption readiness.

**Result:** 1 HIGH, 5 MEDIUM, 7 LOW, 3 NOTE. All fixed or recorded.

**HIGH:**
- **H1:** R6-era passages still described the other business and an inter-company agreement, in six
  files. All are stubbed, and the grep is clean.

**MEDIUM:**
1. **M1:** this section was missing; the workflow line was in the past tense.
2. **M2:** the restore-container handling was inconsistent. Part F is amended, and §3.3 gives the reason.
3. **M3:** element 7 now covers Hostinger's notice channel.
4. **M4:** option (b) is now stated as an accepted Art. 28(3) non-compliance, with its consequences.
5. **M5:** option (a) is the minimum: no whole-account change, and re-confirmation after a move.

**LOW:**
1. **L1:** the email-side transfer note is in §2.4.
2. **L2:** dangling references are fixed in R5, R7 and the evidence checklist.
3. **L3:** the R17 baseline date is set.
4. **L4:** the Part F boxes are ticked.
5. **L5:** the quarterly timing is recorded.
6. **L6:** the recommendation wording is unified.
7. **L7:** element 1 now says "manages".

**NOTE:**
1. The git-history note is in §6.
2. The UK-to-EEA adequacy point is in §2.3.
3. The Resend probe copies are in §3.2.

**Narrow re-check:** every finding was fixed. Two LOW leftovers in `OWNER-ACTIONS.md` (a superseded
"subscription transfer" parenthesis, and a broken numbered list) are fixed. The re-check's NOTE (the
container's non-blocking basis) is confirmed against the R8 brief, Task 6.
