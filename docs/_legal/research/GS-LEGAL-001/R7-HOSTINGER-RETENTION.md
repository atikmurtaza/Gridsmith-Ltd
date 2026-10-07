# GS-LEGAL-001-R7 — Hostinger chain correction, retention cleanup, A-1

**Date:** 7 October 2026. **Branch:** `claude/sweet-mendel-11qvli`, from R6 HEAD
`3eb95de97d300c70198dfffe12bb153459b52725`. **Environment:** Claude Desktop, the owner's local machine
(the first trusted-environment phase of GS-LEGAL-001; R1–R6 ran in a cloud session).

**Result: RETENTION CLEANUP RUN — ROUTINE NOT YET OPERATING — OWNER ACTION REMAINS.**
- **Hostinger:** the R6 processor classification is **withdrawn** (§2; superseded by R8). The Privacy 2.2 marker is removed. A Hostinger contract point remains (R8 §2.3).
- **Retention:** all 63 Production leads were probe records written by the project's own gates. All 63
  were deleted under schedule §4 class (e), after a verified baseline export (§3).
- **Routine:** defined, but **not operating** (§4). **`RETENTION-ROUTINE-OPERATING` is NOT recorded, and
  nothing here may be read as permission to record it.**
- **A-1:** done. The seven legal documents were reseeded into the **development** dataset only, and
  served parity passes against it (§6).
- **Privacy 2.2:** `OWNER_REVIEW_REQUIRED`, no markers, **not ready for adoption** (§5).

This record is not legal advice and claims no solicitor review. **The repository is public.** R8 redacted the hosting-account history from this record on owner
instruction.

## 1. Desktop handoff

| Item | Value |
|---|---|
| Local start | branch `staging/gs-press-001-press` at `41a54998`; untracked `.codex/`, `AGENTS.md`, `public/brand/design/preview.html` (unrelated; kept) |
| Remote R6 | `origin/claude/sweet-mendel-11qvli` = `3eb95de9…` (verified) |
| Update | `git switch -c claude/sweet-mendel-11qvli --track origin/…`. The lockfile is identical, so `node_modules` is valid. The untracked files do not exist on R6, so there is no conflict |
| R6 state re-verified | `check:legal:adoption` PASS; selftest 103; the six adopted fingerprints equal the register; Privacy sha256 `140ab3aa…`, one marker |

## 2. Hostinger

**Redacted and superseded at R8** (owner instruction; git history keeps the R7 text).

What R7 established, and R8 keeps:
- Hostinger's DPA was read directly: controller or processor customer (§2.2), SCCs and the UK Addendum
  (§9). (R9 correction: the DPA's "Customer" is "you", defined by Hostinger's Terms §1/§3. §4 makes the
  Account-information entity the owner of the Account's data and Services.)
- No inter-company processor relationship is created from the account's history.
- Privacy 2.2 §6 lost its marker and the sentence describing the account.

The current analysis, the redefined `HOSTINGER-PROCESSOR-CHAIN` and the remaining contractual point are
in `R8-HOSTING-RETENTION-CLOSURE.md` §2.

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
| Hostinger provider terms | Read directly. Reliance: see R8 §2.3 element 7 (the R7 key elements are superseded and redacted) |
| `HOSTINGER-PROCESSOR-CHAIN` | **Not met** (redefined at R8; R8 §2.3) |
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
2. **M2:** the interim route was limited (R8: withdrawn; see R8 §2).
3. **M3:** the headline read "activated". It is now "cleanup run — routine not yet operating".
4. **M4:** §7's Hostinger reliance limb depends on the contracting point (now R8 §2.3 element 7).

**LOW:**
1. **L1:** checklist A1 wording now matches the deputy decision.
2. **L2:** the open-item lists are aligned (A2, the first monthly run, C7, the review dates).
3. **L3:** the R6 register rule is annotated as redefined.
4. **L4:** the access confirmation was extended (R7 key elements; superseded and redacted, see R8 §2.3).
5. **L5:** the capacity is no longer asserted (superseded by R8 §2.1).
6. **L6:** the `email` read is recorded.
7. **L7:** this section is filled; the fingerprints and A-1 versions are labelled; "subset" is replaced.

**NOTE:**
1. **N1:** the classification is correct and the key is proportionate.
2. **N2:** the deletion was safe.
3. **N3:** the SQL matches the schedule; rights-request deadlines added to Part G.
4. **N4:** parity is consistent; re-run A-1 after any Privacy edit.
5. **N5:** the selftest change is a fix, not a weakening. **The repository is PUBLIC**
   (`gh repo view`), so no other business is named in any committed file.

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

## 9. CI

**Run `37636172385`, exact SHA `b196a238`: failure, 1 of 18 served commands.**
- `check:legal:parity` **PASS in CI** (6 documents, 107 clauses, 437 paragraphs). The development-dataset
  drift recorded since R5 is cleared by A-1.
- `check:press:scene` PASS. R6's `pr-au-voice contrast` failure did not recur, and it passes locally:
  runner variance, not a defect.
- **New: `check:company` red, exposed by A-1.** The development dataset now serves the adopted Consumer
  Terms 3.1:
  - clause 21 ends with the contact number;
  - clause 22's heading begins "22.";
  - the gate flattened the page into one line, so it read the number as "+44 7405 448534 22".

  **The adopted text is correct and unchanged.** The defect is in the gate.

**Fix (gate only):**
- `phoneTextOf` (`scripts/company-facts-rules.mjs`) puts a non-digit sentinel at block ends.
- Question 3 reads that text; the other questions are unchanged.
- Selftest 77 → 80:
  - the boundary specimen is clean;
  - digits appended inside one block still fire;
  - a premise case shows the unseparated flattening fires on the boundary specimen.
- **Mutant:** with the sentinel removed, exactly the boundary case goes red. The file was restored
  byte-identical.
- **Served:** red reproduced locally on the A-1 build (port 3217) before the fix; PASS after (10
  questions, 18 routes).

The follow-up commit's CI run is the exact-SHA receipt.
