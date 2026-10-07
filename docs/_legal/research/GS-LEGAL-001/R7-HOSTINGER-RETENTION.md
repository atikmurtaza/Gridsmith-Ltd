# GS-LEGAL-001-R7 — Hostinger chain correction, retention cleanup, A-1

**Date:** 7 October 2026. **Branch:** `claude/sweet-mendel-11qvli`, from R6 HEAD
`3eb95de97d300c70198dfffe12bb153459b52725`. **Environment:** Claude Desktop, the owner's local machine
(the first trusted-environment phase of GS-LEGAL-001; R1–R6 ran in a cloud session).

**Result: RETENTION CLEANUP RUN — ROUTINE NOT YET OPERATING — OWNER ACTION REMAINS.**
- **Hostinger:** the R6 classification of the subscription holder as Gridsmith's processor is
  **withdrawn** (§2). The Privacy 2.2 marker is removed. A narrower Hostinger contract point remains as
  adoption evidence (§2.4).
- **Retention:** all 63 Production leads were probe records written by the project's own gates. All 63
  were deleted under schedule §4 class (e), after a verified baseline export (§3).
- **Routine:** defined, but **not operating** (§4). **`RETENTION-ROUTINE-OPERATING` is NOT recorded, and
  nothing here may be read as permission to record it.**
- **A-1:** done. The seven legal documents were reseeded into the **development** dataset only, and
  served parity passes against it (§6).
- **Privacy 2.2:** `OWNER_REVIEW_REQUIRED`, no markers, **not ready for adoption** (§5).

This record is not legal advice and claims no solicitor review. **The repository is public:** the
subscription holder is not named here, and the owner holds its identity.

## 1. Desktop handoff

| Item | Value |
|---|---|
| Local start | branch `staging/gs-press-001-press` at `41a54998`; untracked `.codex/`, `AGENTS.md`, `public/brand/design/preview.html` (unrelated; kept) |
| Remote R6 | `origin/claude/sweet-mendel-11qvli` = `3eb95de9…` (verified) |
| Update | `git switch -c claude/sweet-mendel-11qvli --track origin/…`. The lockfile is identical, so `node_modules` is valid. The untracked files do not exist on R6, so there is no conflict |
| R6 state re-verified | `check:legal:adoption` PASS; selftest 103; the six adopted fingerprints equal the register; Privacy sha256 `140ab3aa…`, one marker |

## 2. Hostinger and the subscription holder — fresh analysis

**Owner facts (R7):**
- The Hostinger multi-domain plan was bought in 2024, for four years and prepaid to 2028, by **another
  business, registered in the United States** ("the subscription holder"). Its name is held by the owner.
- Gridsmith uses that plan's capacity for gridsmith.uk. Gridsmith Ltd did not buy the plan.
- **Atik Murtaza personally manages** the Hostinger account and the Gridsmith hosting configuration.
- No fact establishes that the subscription holder's staff receive, inspect or use any Gridsmith
  enquiries, mail, logs, databases or client data.

**Provider fact, read directly (new in R7):** Hostinger's Data Processing Addendum
(hostinger.com/legal/dpa, revised 2026-09-29 11:49:03):
- "Customer" is the party that enters into the agreement with Hostinger (preamble).
- That Customer is "a Controller or Processor, as applicable, of the Customer Data" (§2.1).
- A Customer acting as processor warrants that its instructions, including the appointment of
  Hostinger, "have been authorized by the relevant Controller" (§2.2).
- Transfers outside the EEA: the EU SCCs, Module Two and Module Three (§9.1–9.2), and "The UK
  International Data Transfer Addendum will apply to Customer Data transferred via Covered Services from
  the United Kingdom" (§9.3).
- Sub-processors: general consent, with notice and a termination right (§6).
- Appendix 1 lists "Customer's users authorized by Customer" as data subjects.

This closes R5/R6's open item, the direct reading of the provider's terms.

**Who can rely on them (review M4):** these terms run between Hostinger and its Customer. **Gridsmith
can rely on them only once `HOSTINGER-PROCESSOR-CHAIN` (b) is in place** (§2.4).

### 2.1 Task A–E

| | Question | Answer |
|---|---|---|
| A | Does buying the plan, holding the subscription and sharing an administrator make the holder a processor? | **No.** A processor is a person who *processes personal data* on behalf of the controller (UK GDPR Art. 4(8)). Processing is an *operation on personal data* (Art. 4(2)). Paying for a service and being the contracting customer are commercial acts, not operations on personal data. The facts supplied show no such operation by the holder |
| B | Account ownership versus processing | **Account ownership** is the holder's contract with Hostinger: billing, the right to use the plan, and the contractual standing to instruct, suspend or end it. **Processing** is what is done with the data: Hostinger stores and serves it, and Gridsmith decides why and how. R6 treated the contractual *power* to suspend or delete as processing. That was an inference from the contract structure, not an operation on data, and it is withdrawn |
| C | The shared administrator | The owner states that Atik Murtaza personally manages the account. Gridsmith decides the purposes and means of the gridsmith.uk data, so his work on that hosting is Gridsmith's own processing. It is not evidence that the holder, a separate business, processes Gridsmith data. **The capacity in which he acts is part of the confirmation in §2.4 (a)** (review L5) |
| D | Evidence that the holder's personnel, systems or processes access Gridsmith data | **None.** The repository records no Hostinger user other than the owner, no system of the holder, and no workflow of the holder touching gridsmith.uk data. None is inferred |
| E | Does the account structure technically give the holder's personnel access? | **Not established either way.** Access to a Hostinger account is held by whoever holds its login or delegated access. Hostinger also sends its Customer notices to the account's contact email. Whether **any other person** holds access, or controls that address, is the one fact not yet recorded (§2.4 (a)) |

### 2.2 Classification — Outcome A

**The subscription holder is a commercial subscription holder only. On the facts supplied it does not
process Gridsmith personal data, so it is not Gridsmith's processor and not a recipient.**
- This holds subject to the confirmation in §2.4 (a).
- No Article 28 agreement with the holder is required on account of its role.
- Its US establishment raises no restricted transfer, because no Gridsmith data is shown to go to it.
- The arrangement is recorded internally (`../../operations/PROCESSOR-REGISTER.md`) and is not
  published. Art. 13(1)(e) concerns recipients, and the holder is not one.

### 2.3 Privacy wording

- §6 keeps the operative facts: Hostinger hosts the site in France with its CDN, provides email hosting
  for the mailbox, and processes request data.
- The sentence "We use Hostinger's service through a hosting account held by another business" is
  **removed**. It described a commercial arrangement, not a recipient.
- The marker is **removed**. Privacy 2.2 now carries no marker.
- Kept, because it is true and does not say Gridsmith bought the plan: "Hostinger's data processing terms
  apply to the hosting account through which we receive its service."
- §7's Hostinger limb ("the international transfer safeguards set out in their data processing
  agreements") **describes the provider terms accurately** (SCCs and the UK Addendum, §9). It becomes
  true **as reliance by Gridsmith** only with (b) route 1, which adoption requires.
- The holder is not named.

### 2.4 What remains — a Hostinger point, not a holder point

**Classifying the holder correctly does not remove the gap R6 found; it relocates it.**
- Hostinger *does* process Gridsmith data.
- UK GDPR Art. 28(3) requires that processing to be governed by a contract binding the processor "with
  regard to the controller".
- Hostinger's DPA binds Hostinger to its **Customer**, the holder, not Gridsmith Ltd.
- The DPA has only two customer roles, controller and processor (§2.1). On the facts above, the holder is
  neither for Gridsmith's data.

So Gridsmith's own Art. 28(3) position with Hostinger is not evidenced.

1. **Recommended — Gridsmith Ltd becomes Hostinger's Customer** for the gridsmith.uk hosting and
   mailbox. Either the website and mail move to a Hostinger account in Gridsmith Ltd's name, or the
   subscription is transferred. Hostinger's DPA then binds Hostinger directly to Gridsmith. **The
   Privacy 2.2 text is correct as drafted under this route.**
2. **Interim alternative, only if route 1 must wait:** a written arrangement under which the holder, as
   Hostinger's Customer, holds and operates the account for gridsmith.uk only on Gridsmith Ltd's
   documented instructions (DPA §2.2). **This makes the holder a processor by contract, and so a
   recipient (Art. 4(9)).** Choosing it therefore requires, before adoption:
   - Privacy §6 revised to describe that recipient category;
   - §7 revised for a transfer to a US processor, with its safeguard;
   - a re-hash, a fresh review, and A-1 re-run (review M2).

**The adoption key `HOSTINGER-PROCESSOR-CHAIN` is kept and redefined** (gate unchanged in force). Its
evidence must record:
- **(a)** the owner's confirmation that:
  - **no person other than Atik Murtaza** holds a login, team-member or delegated access to the
    Hostinger account or the contact@gridsmith.uk mailbox;
  - the account's contact and notification email is controlled by him or by Gridsmith;
  - he manages the gridsmith.uk hosting for Gridsmith.

  If any part is untrue, Privacy §6 and §7 must be revised first (review L4, L5).
- **(b)** route 1 in place with a date, or route 2 with the Privacy revisions above.

**The single remaining owner fact is (a).** (b) is an owner action, not a fact.

## 3. Retention cleanup — Production `public.leads`

**Authority:** the R7 owner instruction (Tasks 5–7), which authorises a narrowly scoped cleanup of
unambiguous candidates that the adopted schedule requires deleting.

**Columns read beyond the procedure (review L6):**
- `email` and the reserved-domain test were read **under this instruction**, because the procedure's
  minimum columns (`id`, `created_at`, `status`, `division`, `notes`) cannot identify class (e).
- Only aggregates and the six addresses were output. The addresses are at reserved domains and identify
  no one. No name, message or other content was output.

**Identity, proven two ways:**
- The Supabase connector lists `dqiutgmxillhsbzgnlsx` "Gridsmith Project" (Gridsmith Org
  `dxqntaccfhwaneknyage`, eu-west-1, created 18 August 2026). `qfgpwumvvtizeamkynes` is
  `gridsmith-preview`.
- The local `DIRECT_CONNECTION_STRING` host is `db.dqiutgmxillhsbzgnlsx.supabase.co`.
- Both paths returned the same row fingerprint, `dbf57e8d35a6024cb60d851c5cff7ea5` (md5 over each row's
  md5, ordered by id).

**Classification:**
- All 63 rows were created **3–11 September 2026**, `status = new`, with no notes, no `source`, no phone
  and no company. Messages are empty, except one of 34 characters.
- **Every row uses one of six addresses at reserved, non-deliverable domains** (`.invalid`, RFC 6761;
  `example.com`, RFC 2606).
- `notified_at` is null on all 63. **That is not evidence that no notification was sent**: the Vercel
  insert path never writes it (`lib/leads/submit.ts`) (review M1).

| Address (reserved domain) | Rows | Origin |
|---|---|---|
| `pipeline@gridsmith.invalid` | 29 | The A-08 pipeline probe (`scripts/check-axe.mjs`, commit `15c83038`); `@gridsmith.invalid` is the documented probe marker (`master/PROJECT-TRACKER.md` M-P1-3) |
| `rls-live-probe@example.invalid` | 29 | The `check-rls-live.mjs` written and deleted at the K-10 premise check on 4 September 2026 (`05-HANDOVER.md`; `master/PROJECT-TRACKER.md` M-P1-3 residual) |
| `k10-probe@example.invalid` | 2 | K-10 premise check (live-database probes, 3–4 September) |
| `d@example.invalid`, `d2@example.invalid` | 1 + 1 | Inside the same K-10 session: 00:44:59 and 00:45:25 on 4 September, between `rls-live-probe` rows 00:43:32–00:52:50; Press `sample_request` |
| `k13-probe-1788555457130@example.com` | 1 | K-13; the epoch in the address is 2026-09-04T20:57:37Z, and the row was created 14 s later |

| Class (task 6) | Count |
|---|---|
| KEEP — active/recent enquiry | 0 |
| KEEP — client/contract record | 0 |
| KEEP — legal/accounting/IP preservation | 0 |
| DELETE — expired unsuccessful enquiry (R1) | 0 (none older than 12 months) |
| DELETE — spam (R2) | 0 (no `spam` status) |
| **DELETE — test/probe (§4 class (e))** | **63** |
| REVIEW REQUIRED | 0 |

**Part D exceptions:** none. No complaint, rights request or hold can relate to a probe address. There is
no live conversation (no notes), and no conversion (status `new` on all 63).

**Dependencies:**
- `sample_grants.lead_id` is ON DELETE CASCADE, with 0 rows.
- `press_path_results.lead_id` has no action, with 0 rows.
- No trigger on `leads`.
- No outbox exists in Production.

**C1 baseline:** `%USERPROFILE%\gridsmith-backups\supabase-production-leads-pre-cleanup-20261007T140306Z.json`
- 40,877 B, sha256 `ba5143fd9e44014ff6ebeb6c3c992e3e1c6d4171b23071cf6f323ab47ca69a51`;
- 63 rows written and 63 read back; dependent tables 0;
- taken in a read-only transaction, outside the repository, and never committed.

**Delete:**
- One `DO` block (a single transaction).
- Precondition: total = 63, and candidates = 63 by address, the 3–11 September window, `status = new`
  and null notes.
- Dependent tables must be 0; otherwise it raises.
- Postcondition: deleted = 63 and remaining = 0; otherwise it raises.
- **Committed: 63 deleted.**

**Read-back,** independent, over the direct connection:
- leads 0, `sample_grants` 0, `press_path_results` 0, `events` 0;
- RLS on 5/5 tables, 0 policies;
- 18 lead constraints;
- ledger 0001–0004 unchanged.

No other table, schema, function, grant or Edge Function was touched.

**C6 (notification emails):**
- Not applicable as a personal-data deletion: any notification sent for these rows carried only probe
  values at reserved domains.
- Some A-08 `pipeline@gridsmith.invalid` runs may have sent one to the configured inbox while Resend
  was configured (review M1). The original reasoning ("`notified_at` null, so none was sent") was wrong
  and is withdrawn.
- The owner clears any such probe mail from the inbox and Resend at the first monthly run.

**Accountability log (Part E):**
- Written outside the repository at `%USERPROFILE%\gridsmith-records\RETENTION-LOG.txt`, with ids and
  counts only.
- The C6 correction is appended as a second line.
- The sha256 of the sorted deleted-id list is
  `ffdef05eca454ac1d7a25908c19285077cba1a53301df5e3a82085c4e2ec9736`, so the log entry can be matched to
  this record without committing ids.

## 4. `pg_dump` (R17) and the routine

| Copy | Contents | Status |
|---|---|---|
| `supabase-production-20261002T125412Z.dump` (25,465 B, GS-PROD-003-R1 §7) | The public schema as of 2 October (pre-0004) and 63 lead rows | **Superseded.** Its leads are the same 63 rows by count and `created_at` range: none was created after 11 September, and the count was 63 at GS-PROD-003-R1 (2 October) and again at R7. The two fingerprint methods differ, so they were not compared (review L7). The schema is reproducible from migrations 0001–0004 and the recorded post-state. **Not deleted by Claude:** deleting a file outside the repository is the owner's act. **Owner: delete it** |
| C1 baseline JSON (R7) | The 63 probe rows: the means of reversing this cleanup | **Keep until the first monthly run**, then delete (checklist B step 7) |
| Restore-test database (GS-PROD-003-R1) | A disposable Postgres 17 container | **Unverified:** the Docker daemon was not running. **Owner:** with Docker running, `docker ps -a`; remove any GS-PROD-003-R1 restore container and volume |

**Clean replacement:** Production holds **0 leads**. A post-cleanup `pg_dump` would contain only the
schema, which the repository already holds as migrations. A replacement is therefore **not needed for
recovery**, and none was taken. Docker, the earlier dump route, was unavailable. The recovery position
is:
- schema: migrations 0001–0004;
- data: none legitimately held;
- reversal of this cleanup: the C1 baseline, until the hold ends.

**Routine:**
- Operator: **Atik Murtaza**.
- Deputy: **NONE CURRENTLY APPOINTED.** UK GDPR requires accountability (Art. 5(2)), not a deputy; a
  deputy is resilience. Part G is amended for absence.
- Absence also bears on the one-month time limit for rights requests (Privacy §10), which a deputy
  would otherwise cover. Part G records this (review N3).
- Steps: as `RETENTION-ACTIVATION-CHECKLIST.md` Part B, with a read-only count query added.
- No automation: one manual monthly session is enough at today's volume (0 rows).

**`RETENTION-ROUTINE-OPERATING`: NOT SET.** These items are open, identically in the checklist (Part F)
and in `docs/_shared/OWNER-ACTIONS.md`:
1. **A2:** the operator confirms his access route (the Supabase dashboard, the mailbox, and the log
   location). No secret is recorded.
2. **The first monthly review, logged.** Its mailbox and WhatsApp steps (R3, R16, R18), including any
   C6 probe mail, can be done only by the owner. Claude has neither the mailbox nor the phone, and does
   not log a review it did not perform.
3. **C7 / R17:** the 2 October dump deleted; the restore-test container checked.
4. **The quarterly and annual review dates recorded** (Part F asks for them).

## 5. Privacy 2.2 readiness

| Requirement | State |
|---|---|
| No open marker | **Met** (0) |
| Hostinger provider terms | Read directly. Gridsmith can rely on them only with (b) |
| `HOSTINGER-PROCESSOR-CHAIN` | **Not met:** (a) the confirmation; (b) route 1 (or route 2 with the Privacy revisions) |
| `RETENTION-ROUTINE-OPERATING` | **Not met** (§4, items 1–4) |
| E-3, E-4, E-5, statute | Unchanged from R6; not reopened |

**Owner adoption: NOT READY.** No adoption field is set.
**Publication:** additionally needs `H4-B-INTAKE-PROMOTED` and `CUTOVER-AUTHORITY`.

## 6. Development Sanity A-1

**Credentials:** the existing local `.env.local` holds `SANITY_API_WRITE_TOKEN`. Its value was never
printed.

**Identity, read-only:**
- project `spzu6y31` (`sanity/project.ts`);
- datasets `production` and `development`, target `development`, fixed in the script and never read
  from the environment;
- before: the seven `seed-legal-*` documents at version 2.0, `adoptionState` null; 121 documents in
  total.

**Write:** one transaction of `createOrReplace` on exactly the seven `LEGAL_DOCUMENTS` ids
(`scripts/seed-legal.mjs`, generated from the drafts, including the R7 Privacy text). Nothing else was
written.

**After:**

| Document | Version | State |
|---|---|---|
| accessibility | 2.1 | `OWNER_ADOPTED` |
| business-client-terms | 3.1 | `OWNER_ADOPTED` |
| client-terms | 2.1 | `OWNER_ADOPTED` |
| consumer-client-terms | 3.1 | `OWNER_ADOPTED` |
| cookies | 2.1 | `OWNER_ADOPTED` |
| privacy | 2.2 | `OWNER_REVIEW_REQUIRED` |
| terms | 2.1 | `OWNER_ADOPTED` |

121 documents in total (unchanged). **The Production dataset was not addressed.**

**Served parity** (clean `next build` against `development`, `next start` on port 3217):
- `check:legal:parity` **PASS**: 6 documents, 107 clauses, 437 paragraphs word for word; banners match
  the register;
- `check:consumer-terms` PASS; `check:launch` PASS (reports `development`); `check:vat` PASS.

The R7 review changed no Privacy text, so the dataset still matches the committed draft. **Any later
Privacy edit needs A-1 re-run**, or CI parity goes red again.

## 7. Independent review

One fresh read-only reviewer covered the Hostinger classification, the Privacy wording, deletion safety,
activation truthfulness, the `pg_dump`, adoption readiness and Sanity parity.

**Result:** 0 HIGH, 4 MEDIUM, 7 LOW, 5 NOTE. **No finding required a change to an adopted document.**

### 7a. Findings and fixes

**MEDIUM:**
1. **M1:** C6 relied on `notified_at`, which the insert path never writes. Corrected here, in the
   checklist, the status files and the external log.
2. **M2:** route 2 makes the holder a recipient. It now requires Privacy §6/§7 revision, and "text
   independent of route" is limited to route 1.
3. **M3:** the headline read "activated". It is now "cleanup run — routine not yet operating".
4. **M4:** §7's Hostinger safeguard is relied on only once (b) is in place. Stated in §2 and in the
   register.

**LOW:**
1. **L1:** checklist A1 wording now matches the deputy decision.
2. **L2:** the open-item lists are aligned (A2, the first monthly run, C7, the review dates).
3. **L3:** the R6 register rule is annotated as redefined.
4. **L4:** (a) now also covers the account's contact email, and "§6 and §7".
5. **L5:** the capacity is no longer asserted; it is part of (a).
6. **L6:** the `email` read is recorded.
7. **L7:** this section is filled; the fingerprints and A-1 versions are labelled; "subset" is replaced.

**NOTE:**
1. **N1:** the classification is correct and the key is proportionate.
2. **N2:** the deletion was safe.
3. **N3:** the SQL matches the schedule; rights-request deadlines added to Part G.
4. **N4:** parity is consistent; re-run A-1 after any Privacy edit.
5. **N5:** the selftest change is a fix, not a weakening. **The repository is PUBLIC**
   (`gh repo view`), so the subscription holder's name was removed from every committed file.

**Selftest note:**
- Removing the marker hollowed two specimens in `check-legal-adoption.selftest.mjs`, which used the
  real Privacy draft as "a document carrying a marker". The selftest went **red** (2 of 103).
- The specimen now injects its marker and asserts it is present.
- **Mutant:** with `/\[OWNER DECISION/` removed from `MARKERS`, both cases go red with their own
  messages. The file was restored byte-identical; result 103/103.
- **Real gate with Privacy falsely adopted** (working copy, restored byte-identical): refused with 6
  problems, including both evidence keys, `CUTOVER-AUTHORITY`, `H4-B-INTAKE-PROMOTED`, the draft date
  and no effective date.

## 8. Fingerprints

| Document | sha256 | Change |
|---|---|---|
| Six adopted documents | unchanged; equal to `ownerAdoptedSha256` | none |
| `PRIVACY-POLICY.md` (2.2, unadopted) | R6 `140ab3aa…` → R7 `2404a1cfd985ae5a2e248b605075260558b28990d999d6612795ff48050d8c1e` | marker and one sentence removed |
