# Retention schedule and deletion routine

**Status:** schedule **adopted by the owner** (`GS-LEGAL-001-R3`, decision O-1 option (a) with the R8
modification, 7 October 2026).

**Routine status (R9, 7 October 2026): OPERATING.**
- The obsolete 2 October dump was permanently deleted by the owner (attestation; read-only absence
  checks).
- `RETENTION-ROUTINE-OPERATING` is recorded in the register.
- Next runs: monthly Mon 2 November 2026; quarterly Mon 4 January 2027; annual Mon 1 March 2027.
- Record: `research/GS-LEGAL-001/R9-RETENTION-HOSTINGER-REASSESSMENT.md` §2.

~~**Routine status (R8, 7 October 2026): NOT YET OPERATING; one owner step remains.**~~
- The first monthly review is done and logged: leads 0, email 0, WhatsApp/SMS 0.
- Cadence: monthly from 2 November 2026; quarterly from 4 January 2027; annual from 1 March 2027.
- The 2 October `pg_dump` is in the Recycle Bin, pending the owner's permanent deletion.
- Record: `research/GS-LEGAL-001/R8-HOSTING-RETENTION-CLOSURE.md` §3.

~~**Routine status: NOT YET OPERATING** (R7, 7 October 2026).~~ ~~No Production record has been deleted under
it. The 63 Production leads have not been classified. The manual `pg_dump` export has not been
replaced.~~
- **Done (R7):** the §4 cleanup ran. All 63 Production leads were probe records written by the project's
  own gates (3–11 September 2026, reserved-domain addresses), class (e). All 63 were deleted after a
  verified baseline export. Production `public.leads` now holds 0 rows.
- **Still open:**
  - the first monthly run is not yet logged (its mailbox and WhatsApp steps are the owner's);
  - the 2 October `pg_dump` is not yet deleted;
  - the quarterly and annual steps are not yet scheduled.

Record: `research/GS-LEGAL-001/R7-HOSTINGER-RETENTION.md` §3–§4.

~~**Privacy §8 is therefore unchanged and keeps its `[OWNER DECISION]` marker.**~~ **R6:** Privacy §8 is
drafted in version 2.2, but Privacy may not be adopted until §4 has run once and §2 is active (P-1).
`check:legal:adoption` requires `prerequisitesMet["RETENTION-ROUTINE-OPERATING"]`.

This is not legal advice. Where a period depends on a statute, §6 says what was read at source and what
was not.

## 1. The schedule

| # | Data | Where it lives | Period | Clock starts | Action at end |
|---|---|---|---|---|---|
| R1 | **Enquiry that did not become a project**: name, email, phone, company, message, budget band, timeline, Press answers, manuscript link | Supabase `public.leads` (Ireland) | **12 months**, deleted at the first monthly check after that | `created_at`, extended only where `notes` records a later contact date (no last-contact column exists; adding `last_contact_at` is a later, separately authorised task) | Delete the row; where the outbox exists, its row cascades (R10) |
| R2 | **Enquiry marked spam or abusive** | `public.leads`, `status = 'spam'` | **30 days**, deleted at the first monthly check after that | Date marked | Delete |
| R3 | **Internal notification email** (name, email, company, phone, studio, enquiry type, reference) | `contact@gridsmith.uk` mailbox (Hostinger) | **As the lead it announces** (R1, R2 or R4) | As the lead | Delete from inbox, Sent and trash |
| R4 | **Enquiry that became a project** | `public.leads` | Move into the client record (R5), then **delete the lead row at the first monthly check at least 30 days after contract** | Contract date | Delete the lead row |
| R5 | **Client contract record**: quotation, acceptance, early-start statements and timestamps, confirmation email, change quotations, cancellation notices and calculations, delivery records, and **the final delivered version or set of the deliverables** | Mailbox and document store | **6 years after the end of the financial year in which the project ended** | Project end (final delivery, cancellation or termination) | Delete, except R7 items. For any future Technical drawing work, consider a longer period: latent-damage negligence has a 15-year longstop (Limitation Act s. 14B, externally unverified) |
| R6 | **Accounting records**: invoices, receipts, payment records | Accounting system, bank | **6 years from the end of the last financial year they relate to**, or longer where HMRC requires (a transaction spanning accounting periods, an open enquiry, a late return) | Financial year end | Delete |
| R7 | **Title and consent documents**: client rights-assignment instruments, owner, employee and subcontractor assignments, moral-rights waivers, portfolio consents (`RIGHTS-CHAIN.md` §3) | Document store (title register) | **For as long as the rights or the consent are relied on, plus 6 years.** For transferred copyright, "relied on" lasts while the rights subsist and Gridsmith or its clients may need to prove title: each infringing act is a fresh cause of action | End of reliance | Delete |
| R8 | **Project working material** (owner modification) | Working storage | **Return or delete within 90 days of project end**: unnecessary client-supplied source material, unnecessary personal data, ordinary working files, superseded drafts and temporary project material. Exception: the quotation or Scope says otherwise, or the client asks for an agreed longer period. **The final delivered version or set is not deleted here**; it is kept with R5. Title evidence is kept under R7 | Project end | Return or delete; keep only what R5 and R7 require |
| R9 | **Complaints and rights requests**, including DPA 2018 s. 164A data complaints | Mailbox | **With the R5 record** if there is one; otherwise **2 years after closure** (owner choice; no statutory period) | Closure | Delete |
| R10 | **Duplicate-detection fingerprint and outbox state** | `gridsmith_private.notification_outbox`: **Supabase Preview only today**; Production only once H4-B is promoted. The 63 Production leads have no outbox row | Deleted with the lead (cascade); `sent` rows may be pruned after 30 days | Lead deletion or send | Cascade or prune. Preview holds only synthetic or probe rows; delete them under R2's routine |
| R11 | **Press Path Finder results** | `public.press_path_results` (`expires_at` = 90 days) | **90 days** | Creation | **No write path exists today** (0 rows on 2 Oct). Before one is built: the 90-day job must exist, and `lead_id references leads(id)` has no on-delete action, so linked results must be deleted or nulled before their lead (or the foreign key migrated to `on delete set null`) |
| R12 | **Hosting, CDN and mailbox logs** (IP address, browser details) | Hostinger. The website is hosted in France (owner-confirmed, R6). The mailbox is email hosting supplied through Hostinger; its product and location are not established | **Provider's period, set by Hostinger according to its operational, security and legal requirements; no reliable official figure** (R6: E-5 non-blocking) | — | Described by criteria in Privacy 2.2 §8 |
| R13 | **Email-delivery logs and metadata** of the notification | Resend (Plus Five Five, Inc.; stored in the United States) | **30 days on the Free plan** for email and log data; **backups kept for 7 days** (R6: plan owner-confirmed as Free; provider periods verified outside this environment). The owner's 12-day oldest-visible email is an observation, not the period | — | Stated in Privacy 2.2 §6 and §8 |
| R14 | **Database backups and platform logs** | Supabase | **Logs: the dashboard view window on Free is the last day** (owner dashboard observation and Supabase documentation, R6). Supabase decides how long logs are actually kept. **Provider-side retention is not established:** R5 saw older records returned through the logs API, so one-day deletion cannot be asserted. Request logs carry client-IP header fields, country and user agent. Deleting a lead does not delete them. **Backups:** Free has no automatic backups or PITR; Supabase may keep copies for a period it sets | — | Described in Privacy 2.2 §6 and §8 without a deletion claim |
| R15 | `gs_consent` cookie | Visitor's browser | **365 days** (`lib/consent/state.ts`) | Set on *Got it* | Expires in the browser |
| R16 | **WhatsApp and text messages**, including WhatsApp cloud chat backups | Owner's phone; backup provider | As R1 for an enquiry; as R5 where part of a project record | As R1/R5 | Delete the chat; it leaves the backup when the backup rotates |
| R17 | **Manual database exports (`pg_dump`)** and any restore-test database | Owner's machine, outside the repository (`GS-PROD-003-R1.md` §7, holding all 63 leads) | **Replace or delete obsolete exports after each authorised deletion run**, so deleted records do not survive indefinitely in manual copies. Delete any restore-test database when the test ends | Each deletion run | Replace or delete. **Not before the §4 cleanup phase** (owner instruction, R3). **R7:** the cleanup has run. The 2 October dump is superseded (its rows are a subset of the R7 baseline; the schema is in migrations 0001–0004), so the owner deletes it. The R7 baseline is kept until the 2 November 2026 monthly run (B step 7), then deleted (R8: the first monthly run was 7 October 2026) |
| R18 | **Other mailbox correspondence** (direct email enquiries, Sent items) | `contact@gridsmith.uk` | As R1 for an enquiry; as R5 for a project | As R1/R5 | Delete, including Sent and trash |
| R19 | **Freelancer review text** shown on the site | Sanity CMS | While displayed, and until removal on request (Privacy §2A) | — | Delete the document |
| R20 | `public.events`, `public.sample_grants` | Supabase | **No data held** (0 rows on 2 Oct; no writer since analytics were removed) | — | If a writer is ever added, schedule it first |

## 2. The routine (defined; not yet operating)

1. **Monthly, first working day.** Run a read-only count of leads past R1, R2 and R4. Record the count,
   delete them, and record the number deleted. In the same session:
   - clear R3 and R18 mail past its period from the inbox, Sent items and trash;
   - delete R16 WhatsApp and text threads past their period;
   - replace or delete any obsolete R17 export.
2. **Quarterly.**
   - Prune R10 outbox rows, and R11 rows once a writer exists; R11 rows go before their lead.
   - Confirm that R8 material for projects ended more than 90 days ago has been returned or deleted, and
     that the final delivered set has moved to R5.
3. **Annually, after the financial year end.** Delete R5 and R6 records whose 6-year period has ended, R7
   title documents whose reliance ended more than 6 years ago, and R9 complaints with no project record
   closed more than 2 years ago. (R6: R7 and R9 had no cadence before; this is a cadence only, and no
   period changes.)
4. **Log every run** in one line (date, counts, who ran it). The log holds no personal data beyond ids
   and is kept for as long as the routine runs plus 6 years. It is the evidence UK GDPR Art. 5(2)
   accountability asks for.

Automating step 1, for example with a scheduled database job, is a separately authorised implementation
task. It is not started.

## 3. Activation: what must be true before Privacy §8 can change

The operational checklist for this (operator, procedure, logging, exceptions, escalation) is
`RETENTION-ACTIVATION-CHECKLIST.md` (`GS-LEGAL-001-R4`).

1. The §4 cleanup phase has run once, with its accountability log.
2. The monthly routine has a named operator and a first log entry.
3. R12–R14 are established from the owner account checks (§5).
4. ~~Only then is Privacy §8 ¶2 replaced~~ (R6: §8 is drafted in 2.2; adoption, not drafting, now waits
   on items 1–3, through `RETENTION-ROUTINE-OPERATING`), using the wording in
   `research/GS-LEGAL-001/R2-OWNER-DECISION-PACK.md` §5.4, with:
   - R8 corrected to the owner's modification (project files are returned or deleted within 90 days;
     the final delivered set is kept with the contract record);
   - every period stated as the routine actually achieves it (for example "deleted at our first monthly
     check after 30 days", not "for 30 days");
   - R12–R14 filled in.

   ~~The Privacy version then moves to 2.2.~~ (R6: done as a draft.)

## 4. The later controlled retention-cleanup phase (prepared R3; **run R7**, 7 October 2026: 63 class (e), 0 of every other class)

**Authority needed:** an owner-authorised phase that permits a Production Supabase write. R3 authorises
none.

1. **Back up first.** Take a fresh verified export, held outside the repository and marked as the
   pre-cleanup baseline.
2. **Classify each of the 63 rows**, using the minimum columns needed (`id`, `created_at`, `status`,
   `division`, `notes`) and never the message content unless the owner authorises it for a specific row:
   - (a) became a project (R4 → R5);
   - (b) live enquiry inside 12 months (keep);
   - (c) expired enquiry (R1, delete);
   - (d) spam (R2);
   - (e) synthetic or probe record (delete).

   The owner confirms (a), which needs knowledge of who became a client.
3. **Preserve.** For (a), move what R5 needs into the client record before the row is deleted.
4. **Delete only (c), (d) and (e)**, in one transaction, with a count assertion before commit.
5. **Replace the 2 October 2026 `pg_dump`** (R17) with a post-cleanup export, or delete it. Record which.
6. **Write an accountability log:** date, operator, counts per class, the ids deleted (ids only), and the
   export replaced or deleted.
7. **Read back** to confirm the remaining count and that no (a) or (b) row was removed.

## 5. Owner account checks that set R12–R14

These come from the R3 provider evidence (`research/GS-LEGAL-001/R3-OWNER-DECISIONS-APPLIED.md` §5.2).
Items 1–4, 6 and 9 there are the ones that bear on retention:
- Hostinger access-log, CDN and mailbox backup retention;
- Supabase backups on the Free plan;
- Resend plan and log retention.

**R5 (7 October 2026):** R12–R14 have been re-evidenced and the rows above corrected; the periods are
unchanged.
- **Supabase backups:** no Free-plan backups or PITR; provider-held copies only partially verified (E-4).
- **Supabase logs:** the published 1-day figure does not match what was observed and is not a deletion
  period. Logs carrying client-IP header fields are held at least 49 days.
- **Remaining owner checks:** E-2, E-3 and E-4, plus E-5 optional (`PRIVACY-EVIDENCE-CHECKLIST.md`).

## 6. Statutory basis and what was read

**R6 (7 October 2026): the HMRC, Companies Act s.388 and Limitation Act s.5 rows are now VERIFIED.** The owner checked them outside this environment against current legislation.gov.uk and GOV.UK/HMRC material (`research/GS-LEGAL-001/R6-PRIVACY-2.2-DRAFT.md` §5). The periods are cumulative: where a record falls into more than one category, the longest applies. ss. 2, 8, 14A–14B and 32 remain as recorded below.

**PRIMARY SOURCE ACCESS BLOCKED** in R3: legislation.gov.uk, gov.uk and HMRC were refused by the
environment's egress proxy for both direct fetches and the fetch tool.

| Proposition | Source | Access | Confidence |
|---|---|---|---|
| UK GDPR Art. 5(1)(e): kept no longer than necessary; Art. 13(2)(a): state the period or the criteria | Recorded by C | A–G recorded reading | High |
| HMRC: company tax records kept 6 years from the end of the accounting period, longer in stated cases (FA 1998 Sch. 18 paras 21–22; HMRC CH14600; GOV.UK "company and accounting records") | Search summaries | **Externally unverified** | Medium-high |
| Companies Act 2006 s. 388(4)(a): a private company preserves accounting records for 3 years from the date made (the 6-year public-company limb is (4)(b)). The HMRC period governs | Search summary | **Externally unverified** (R2's "(4)(b)" was the wrong limb) | Medium |
| Limitation Act 1980: s. 5 contract 6 years; s. 2 tort 6 years; s. 8 deed 12 years; s. 14A latent damage, the later of 6 years or 3 from knowledge; s. 14B 15-year longstop; s. 32 postponement | Search summaries; never read in the repository | **Externally unverified** | High (ss. 2, 5, 8); medium-high (ss. 14A, 14B, 32) |

**Consequence for the periods.** None of the readings above shows a proposed period to be legally wrong,
so the owner's adopted periods stand. ~~Before Privacy §8 states "six years" as fact (§3), re-read FA
1998 Sch. 18 para 21 and Limitation Act ss. 2, 5 and 14A–14B at source.~~ **R6:** the HMRC 6-year
period, CA 2006 s.388 and LA 1980 s.5, on which Privacy §8's "six years" rests, are verified (see the
note above the table). ss. 2, 14A and 14B remain unverified and are used only for the possible
longer period for future Technical work (R5).
