# Retention routine — activation checklist

**R8 (7 October 2026):**
- The first monthly review is done and logged: leads 0, email 0, WhatsApp/SMS 0.
- Cadence:
  - monthly: first working day; next Mon 2 November 2026;
  - quarterly: with the January, April, July and October runs; first Mon 4 January 2027;
  - annual: first working day after the financial year end; first accounts to 28 February 2027, so
    Mon 1 March 2027.
- A2 done.
- **Remaining:** C7. The 2 October dump is in the Recycle Bin; the owner deletes it permanently.

Record: `../research/GS-LEGAL-001/R8-HOSTING-RETENTION-CLOSURE.md` §3.

**Status:** prepared at `GS-LEGAL-001-R4` (7 October 2026). **R7 (same day): Part C has run.** All 63
Production leads were probe records; all 63 were deleted; 0 remain. **The routine is still NOT
operating:**
- the first monthly run is not logged;
- the 2 October 2026 `pg_dump` is not deleted;
- the quarterly and annual steps are not scheduled.

Record: `../research/GS-LEGAL-001/R7-HOSTINGER-RETENTION.md`. ~~No record has been deleted, the 63
Production leads have not been classified, and the 2 October 2026 `pg_dump` has not been replaced or
deleted.~~ **This checklist activates nothing by itself.** Running any step that deletes data needs
its own owner-authorised phase permitting Production writes.

The schedule (R1–R20), the routine and the cleanup plan are in `RETENTION-SCHEDULE.md`. This checklist
turns them into things a named person does and logs. **R6:** Privacy §8 is already drafted in 2.2.
Privacy may not be **adopted** until every box in Part F is ticked; `check:legal:adoption` requires
recorded `prerequisitesMet["RETENTION-ROUTINE-OPERATING"]` evidence.

## A. Operator and authority

| # | Item | Owner input needed | Done |
|---|---|---|---|
| A1 | **Named operator** for the monthly routine; a **deputy** for absence is optional (R7; Part G covers absence without one) | **Operator: Atik Murtaza** (director; named by the owner, R7). **Deputy: NONE CURRENTLY APPOINTED.** A deputy is resilience, not a legal requirement (UK GDPR Art. 5(2) requires accountability, not a deputy); Part G covers absence | [x] |
| A2 | Operator access: Supabase Production (read and delete on `public.leads`, by a route the owner approves), the `contact@gridsmith.uk` mailbox, and the document store holding the log | Confirm access route. **No secret value is recorded here or in the repository** | [x] R8: Supabase through the Gridsmith Org; mailbox and WhatsApp through Gridsmith's admin department; log at `%USERPROFILE%\gridsmith-records` |
| A3 | Owner authority for the **one-off cleanup phase** (Part C), which writes to Production Supabase | A separate phase authorisation | [x] R7 owner instruction |
| A4 | Owner authority for **automation**, if wanted (for example a scheduled database job for R1/R2) | A separate implementation phase; optional | [ ] |

## B. Frequency and procedure

From `RETENTION-SCHEDULE.md` §2.

| When | What | Rows |
|---|---|---|
| **Monthly** (first working day) | 1. Read-only count of leads past R1 (12 months), R2 (spam, 30 days) and R4 (30 days after contract, once moved to R5). 2. Check Part D for exceptions. 3. **Pre-run export** of exactly the rows about to be deleted, held outside the repository until the next monthly run and then deleted (an R17 copy). 4. Delete them in one transaction, asserting the count before commit. 5. Read back the count. 6. Clear the matching notification emails (R3) and other mailbox correspondence (R18), including Sent items and trash, and WhatsApp/text threads past their period (R16). 7. Delete the previous month's pre-run export and any other obsolete `pg_dump` (R17). 8. Write the log line (Part E) | R1, R2, R3, R4, R16, R17, R18 |
| **Quarterly** | Prune `sent` outbox rows older than 30 days (R10; Preview today, Production once H4-B is promoted). Confirm R8 project material for projects ended over 90 days ago has been returned or deleted, and the final delivered set is in R5 | R8, R10, (R11 once a writer exists) |
| **Annually** (after the financial year end) | Delete R5 and R6 records whose 6-year period has ended. Review R7 title documents whose reliance has ended plus 6 years. Review R9 | R5, R6, R7, R9 |

**Monthly count (read-only; Supabase SQL editor on Production `dqiutgmxillhsbzgnlsx`).** It returns counts
only:

```sql
select
  count(*) filter (where status <> 'spam' and status <> 'won' and created_at < now() - interval '12 months') as r1_candidates,
  count(*) filter (where status = 'spam' and created_at < now() - interval '30 days') as r2_candidates,
  count(*) filter (where status = 'won') as r4_review,  -- delete only once moved to R5 and 30 days after contract
  count(*) filter (where notes is not null) as notes_to_check_for_later_contact
from public.leads;
```

R2 counts from `created_at` because there is no "marked spam" column. That is conservative only if a
row is marked spam soon after it arrives, so check `notes` for the date it was marked. Before deleting
any R1 candidate, read its `notes` for a later contact date (Part D item 5).

**Procedure rules:**
- Count, then delete, then read back. If the read-back count is not the expected count, stop (Part G).
- Use the minimum columns to classify a lead (`id`, `created_at`, `status`, `division`, `notes`). Read the
  message content only where the owner authorises it for a specific row.
- One transaction per run, with the expected count asserted before commit.

## C. The one-off cleanup of the 63 Production leads

Run once, before the routine starts, under its own authority (A3). The full steps are in
`RETENTION-SCHEDULE.md` §4, summarised here:

| # | Step | Done |
|---|---|---|
| C1 | Fresh verified export, held outside the repository, marked "pre-cleanup baseline" | [x] R7: `supabase-production-leads-pre-cleanup-20261007T140306Z.json`, 63 rows, read back |
| C2 | Classify each of the 63 rows as one of:<br>(a) became a project;<br>(b) live, under 12 months;<br>(c) expired;<br>(d) spam;<br>(e) synthetic or probe.<br>**The owner confirms (a)** | [x] R7: 63 × (e), 0 × (a)–(d); no (a) to confirm |
| C3 | For (a), move what R5 needs into the client record first | [x] n/a (0 × (a)) |
| C4 | Delete only (c), (d) and (e), in one transaction, with a count assertion | [x] R7: 63 deleted, asserted before commit |
| C5 | **Read back**: the remaining count, and no (a) or (b) row removed | [x] R7: 0 remaining; structure unchanged |
| C6 | Delete the matching notification emails (R3) for deleted rows | [x] R7: not a personal-data deletion, because any notification for these rows carried only probe values at reserved domains. ~~`notified_at` null on all 63, so none was sent~~ (wrong: the insert path never writes `notified_at`). Any A-08 probe mail in the inbox or Resend is cleared at the first monthly run |
| C7 | **Only after C5 passes:** replace **the 2 October 2026 `pg_dump`** (R17; `docs/_shared/GS-PROD-003-R1.md` §7) with a post-cleanup export, or delete it, and record which. Do the same for the C1 baseline once any agreed hold period has ended. Delete **any restore-test database** left from GS-PROD-003-R1's restore test (R17), if one still exists | [ ] **R8:** the dump was verified (sha256 `96e4885f…`, 63 probe rows, 0 genuine; schema = migrations 0001–0004) and moved to the Recycle Bin on 7 October 2026. **Owner:** delete it permanently. The R7 baseline is kept until 2 November 2026. The restore container is unverified (Docker down; probe data only; non-blocking) |
| C8 | Write the accountability log entry (Part E) | [x] R7: `%USERPROFILE%\gridsmith-records\RETENTION-LOG.txt` |

## D. Preservation exceptions — do not delete while any applies

A record past its period is **kept** if any of these applies. The log records the exception (id and
reason only).

1. **An open complaint, dispute or claim**, threatened or actual, to which the record may be relevant.
   Keep until it is closed and any limitation period that matters has run.
2. **A pending data-subject request** about the record (access, erasure, objection), until it is
   answered. An erasure request is handled under that request, not the routine.
3. **A legal requirement or a request from a regulator, court or law enforcement** to keep it.
4. **An enquiry that became a project** (R4) whose R5 transfer is not yet done.
5. **A live conversation**: `notes` records contact within the last 12 months, so R1's clock has moved.
6. **Title evidence** (R7) is never deleted by the monthly routine. It is reviewed annually.

Where an exception is unclear, the operator does not delete. The question goes to the owner (Part G).

## E. Logging

One line per run, kept in the document store (not in the repository), for as long as the routine runs
plus 6 years (`RETENTION-SCHEDULE.md` §2.4):

```
date | operator | run type (monthly/quarterly/annual/cleanup) | counted R1/R2/R4 | deleted | kept under exception (ids + reason code) | read-back count | mailbox cleared (y/n) | pg_dump replaced/deleted/none | notes
```

The log holds ids and counts, **never names, email addresses or message content**.

## F. Activation — when Privacy §8 may change

All must be true:

- [x] A1 and A2 done (R7, R8).
- [x] Part C run once, with its log entry (C8) (R7; C7 below).
- [x] The first monthly run (Part B) logged (R8, 7 October 2026).
- [ ] R17 handled: the 2 October 2026 `pg_dump` replaced or deleted (C7). **R8:** it is in the Recycle Bin, pending the owner's permanent deletion. ~~and any restore-test database deleted~~ **R8 (owner instruction, Task 6):** the restore-test container is non-blocking housekeeping while Docker is unavailable and it holds no genuine personal data (it held only the 63 probe rows).
- [x] R12–R14 set (R6). R12: by criteria. R13: Resend 30 days, backups 7 days. R14: Supabase one-day
  customer window, provider-side retention not asserted.
- [x] Privacy 2.2 §8 says that deleting an enquiry does not shorten providers' own logs and backups (R6
  draft).
- [x] The statutory periods verified (R6, owner-verified outside this environment; `RETENTION-SCHEDULE.md` §6).

~~**Still open (R6):** A1 and A2; Part C; the first monthly run; R17.~~

**Still open (R8):** C7 only (the owner's permanent deletion of the dump from the Recycle Bin). A2, the
first monthly run and the review dates are done. ~~**Still open (R7):**~~
- A2 (the operator's access route; the operator already holds it);
- the first monthly run, logged;
- R17 (the dump deleted, and the restore container checked);
- the quarterly and annual dates recorded.

Part C is done except C7. A1 is done. When the R17 box above is ticked, record the
evidence in the register as `prerequisitesMet["RETENTION-ROUTINE-OPERATING"]` (log reference and date).
`check:legal:adoption` refuses Privacy at `OWNER_ADOPTED` without it.

The Privacy 2.2 §8 wording is drafted (R6) but may not be adopted until then. **This checklist must not be marked complete to satisfy
a gate.** `check:legal:adoption` refuses Privacy at `OWNER_ADOPTED` without recorded evidence for
`RETENTION-ROUTINE-OPERATING`. That evidence must show the cleanup log, the first monthly log, the named
operator, and the quarterly and annual steps scheduled, because Privacy §8 also promises those.

## G. Failure and escalation

| Situation | Action |
|---|---|
| Count assertion fails before commit | **Roll back** the transaction; nothing is deleted. Log it and tell the owner the same day |
| Read-back count differs after commit | **Stop.** Compare with the run's pre-run export (monthly step 3, or C1 for the cleanup), log the discrepancy, and tell the owner the same day |
| A row deleted that should have been kept (Part D) | Restore it from the run's pre-run export (monthly step 3, or C1), which exists for exactly this purpose; the provider backup is a secondary source only if P-06 shows one exists. Log it, and tell the owner. If the row was deleted in breach of a hold, treat it as a possible personal-data incident and assess it under Privacy §9 |
| Operator unavailable on the first working day | ~~The deputy runs it within 5 working days. If neither can, log "missed" and run it the next month. Two missed months in a row go to the owner~~ **R7 (no deputy appointed):** the operator runs it within the same month. If that is not possible, log "missed" and run it the next month, covering both periods. Two missed months in a row: appoint a deputy or automate step 1 |
| A provider period changes (Hostinger, Supabase, Resend) | Update R12–R14 and Privacy §8 in the next legal phase |
| An erasure request arrives | Handle it under Privacy §10 within the statutory time, not on the monthly cycle. **R7 (no deputy):** the one-month time limit for rights requests runs during the operator's absence too. Before any planned absence of more than two weeks, arrange cover for the mailbox or appoint a deputy |
| Uncertain whether an exception applies | Do not delete; ask the owner |
