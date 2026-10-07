# Retention routine — activation checklist

**Status:** prepared at `GS-LEGAL-001-R4` (7 October 2026). **The routine is NOT operating.** No record has
been deleted, the 63 Production leads have not been classified, and the 2 October 2026 `pg_dump` has not
been replaced or deleted. **This checklist activates nothing.** Running any step that deletes data needs
its own owner-authorised phase permitting Production writes.

The schedule (R1–R20), the routine and the cleanup plan are in `RETENTION-SCHEDULE.md`. This checklist
turns them into things a named person does and logs. Privacy §8 changes only when every box in Part F is
ticked (`../research/GS-LEGAL-001/R4-PRIVACY-2.2-CHANGE-PLAN.md` items 14a–14c).

## A. Operator and authority

| # | Item | Owner input needed | Done |
|---|---|---|---|
| A1 | **Named operator** for the monthly routine, and a named **deputy** for absence | Name(s) and role | [ ] |
| A2 | Operator access: Supabase Production (read and delete on `public.leads`, by a route the owner approves), the `contact@gridsmith.uk` mailbox, and the document store holding the log | Confirm access route. **No secret value is recorded here or in the repository** | [ ] |
| A3 | Owner authority for the **one-off cleanup phase** (Part C), which writes to Production Supabase | A separate phase authorisation | [ ] |
| A4 | Owner authority for **automation**, if wanted (for example a scheduled database job for R1/R2) | A separate implementation phase; optional | [ ] |

## B. Frequency and procedure

From `RETENTION-SCHEDULE.md` §2.

| When | What | Rows |
|---|---|---|
| **Monthly** (first working day) | 1. Read-only count of leads past R1 (12 months), R2 (spam, 30 days) and R4 (30 days after contract, once moved to R5). 2. Check Part D for exceptions. 3. **Pre-run export** of exactly the rows about to be deleted, held outside the repository until the next monthly run and then deleted (an R17 copy). 4. Delete them in one transaction, asserting the count before commit. 5. Read back the count. 6. Clear the matching notification emails (R3) and other mailbox correspondence (R18), including Sent items and trash, and WhatsApp/text threads past their period (R16). 7. Delete the previous month's pre-run export and any other obsolete `pg_dump` (R17). 8. Write the log line (Part E) | R1, R2, R3, R4, R16, R17, R18 |
| **Quarterly** | Prune `sent` outbox rows older than 30 days (R10; Preview today, Production once H4-B is promoted). Confirm R8 project material for projects ended over 90 days ago has been returned or deleted, and the final delivered set is in R5 | R8, R10, (R11 once a writer exists) |
| **Annually** (after the financial year end) | Delete R5 and R6 records whose 6-year period has ended. Review R7 title documents whose reliance has ended plus 6 years. Review R9 | R5, R6, R7, R9 |

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
| C1 | Fresh verified export, held outside the repository, marked "pre-cleanup baseline" | [ ] |
| C2 | Classify each of the 63 rows as one of:<br>(a) became a project;<br>(b) live, under 12 months;<br>(c) expired;<br>(d) spam;<br>(e) synthetic or probe.<br>**The owner confirms (a)** | [ ] |
| C3 | For (a), move what R5 needs into the client record first | [ ] |
| C4 | Delete only (c), (d) and (e), in one transaction, with a count assertion | [ ] |
| C5 | **Read back**: the remaining count, and no (a) or (b) row removed | [ ] |
| C6 | Delete the matching notification emails (R3) for deleted rows | [ ] |
| C7 | **Only after C5 passes:** replace **the 2 October 2026 `pg_dump`** (R17; `docs/_shared/GS-PROD-003-R1.md` §7) with a post-cleanup export, or delete it, and record which. Do the same for the C1 baseline once any agreed hold period has ended. Delete **any restore-test database** left from GS-PROD-003-R1's restore test (R17), if one still exists | [ ] |
| C8 | Write the accountability log entry (Part E) | [ ] |

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

- [ ] A1 and A2 done.
- [ ] Part C run once, with its log entry (C8).
- [ ] The first monthly run (Part B) logged.
- [ ] R17 handled: the 2 October 2026 `pg_dump` replaced or deleted, and any restore-test database deleted (C7).
- [ ] R12–R14 set from owner checks P-04, P-06, P-09 and P-12 (`PRIVACY-EVIDENCE-CHECKLIST.md`).
- [ ] The statutory periods re-read at source (`RETENTION-SCHEDULE.md` §6).

Only then is the Privacy 2.2 §8 wording applied. **This checklist must not be marked complete to satisfy
a gate.** `check:legal:adoption` refuses Privacy at `OWNER_ADOPTED` while its §8 marker is open, and the
marker comes out only when this part is true.

## G. Failure and escalation

| Situation | Action |
|---|---|
| Count assertion fails before commit | **Roll back** the transaction; nothing is deleted. Log it and tell the owner the same day |
| Read-back count differs after commit | **Stop.** Compare with the run's pre-run export (monthly step 3, or C1 for the cleanup), log the discrepancy, and tell the owner the same day |
| A row deleted that should have been kept (Part D) | Restore it from the run's pre-run export (monthly step 3, or C1), which exists for exactly this purpose; the provider backup is a secondary source only if P-06 shows one exists. Log it, and tell the owner. If the row was deleted in breach of a hold, treat it as a possible personal-data incident and assess it under Privacy §9 |
| Operator unavailable on the first working day | The deputy runs it within 5 working days. If neither can, log "missed" and run it the next month. Two missed months in a row go to the owner |
| A provider period changes (Hostinger, Supabase, Resend) | Update R12–R14 and Privacy §8 in the next legal phase |
| An erasure request arrives | Handle it under Privacy §10 within the statutory time, not on the monthly cycle |
| Uncertain whether an exception applies | Do not delete; ask the owner |
