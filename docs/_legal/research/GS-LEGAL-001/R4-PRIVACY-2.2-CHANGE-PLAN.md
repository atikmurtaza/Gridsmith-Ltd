# Privacy Policy 2.2 — change plan (prepared; NOT applied)

> **Superseded for status by `R5-PRIVACY-2.2-READINESS.md` (GS-LEGAL-001-R5).** Kept as history.

**Phase:** `GS-LEGAL-001-R4`, 7 October 2026. **Nothing in this plan has been applied.**
`docs/_legal/PRIVACY-POLICY.md` is still **Version 2.1**, with **Draft date 6 October 2026**, three
`[OWNER DECISION]` markers (§6, §7, §8), and state `OWNER_REVIEW_REQUIRED`. It has no `ownerAdoptedOn`
and no `ownerAdoptedVersion`. No provider fact has been filled in by inference.

**Source.** This plan builds on two earlier documents:
- R3's change list (`R3-OWNER-DECISIONS-APPLIED.md` §5.4), with each item now given a class;
- the owner checks in `../../operations/PRIVACY-EVIDENCE-CHECKLIST.md` (P-01 to P-12).

## Classes

| Class | Meaning |
|---|---|
| **KNOWN FACT** | Established in the repository from code, an account read, or the provider's own terms read at source (not a search summary). It can be written now, though some items are still confirmed by a named check. Where R3 §5.1 marks a fact PARTLY ESTABLISHED, only the part read at source counts; the rest is owner evidence |
| **OWNER ACCOUNT EVIDENCE REQUIRED** | Only the owner's account, or a written provider reply to the owner, can establish it. Search summaries do not count |
| **OPERATIONAL CONDITION NOT YET TRUE** | The sentence would describe something that does not happen yet. It stays out until it is true |
| **PROPOSED WORDING** | Drafting, to be applied once its inputs are known |

## The plan

| # | Where | Change | Class | Input | Status |
|---|---|---|---|---|---|
| 1 | Header | `Version 2.1` → `Version 2.2`; new `Draft date` | PROPOSED WORDING | Applied with items 2–14, in one legal phase | Not applied |
| 2 | §2 ¶3 | Keep "Our enquiry database does not store your IP address or browser details". This is literally true: the intake stores none | KNOWN FACT | Intake code (R3 §5.4) | No change needed |
| 3 | §2 ¶3 | Name the provider logs. Supabase: API and database logs are kept **1 day on the Free plan** | KNOWN FACT (the period and the plan) | Supabase's own pricing source read on GitHub; plan re-verified as `free` read-only in R4 (R3 §5.1 item 7, the logs half) | Ready |
| 3a | §2 ¶3 | That those Supabase logs include IP addresses | OWNER ACCOUNT EVIDENCE REQUIRED | Appears only in R3's proposed wording (§5.4), not in the §5.1 evidence. Confirm from the project's API log fields (P-12) or Supabase's documentation | Open |
| 4 | §2 ¶3 | Supabase Edge Function log period | OWNER ACCOUNT EVIDENCE REQUIRED | P-12 | Open |
| 5 | §2 ¶3, §6 Hostinger | Hostinger site, CDN and mailbox access-log periods; mailbox product (Hostinger Email or Titan); contracting entity | OWNER ACCOUNT EVIDENCE REQUIRED | P-01, P-03, P-04 | Open |
| 6 | §6 Supabase | Keep "stores enquiries in a database located in Ireland". Add that Supabase (Supabase Pte. Ltd., Singapore) keeps platform logs for its own short period and uses sub-processors | KNOWN FACT | eu-west-1 re-verified read-only in R4; entity and sub-processors from Supabase's own terms read on its public repository (R3 §5.1 item 2). P-05 confirms they apply to this organisation | Ready, subject to P-05 |
| 6a | §6 / §7 Supabase | That the sub-processors are in the **United States** | OWNER ACCOUNT EVIDENCE REQUIRED | R3 §5.1 item 4 is PARTLY ESTABLISHED; confirm from the sub-processor list in the DPA or TIA downloaded at P-05 | Open |
| 7 | §6 Supabase (and §7 ¶2) | "Supabase … runs the server functions that receive our enquiry forms" | **OPERATIONAL CONDITION NOT YET TRUE** for Production | The Edge Functions (`gs-lead-intake`, `gs-notification-worker`) are deployed **only to Preview** (`qfgpwumvvtizeamkynes`, H4-B); Production Supabase has none (R3 §5.1 item 8). This becomes true only when H4-B is promoted to Production. Cutover authority alone does not ensure it (a cutover could keep the Next Server Action fallback), so Privacy carries its own prerequisite **`H4-B-INTAKE-PROMOTED`**, which `check:legal:adoption` requires once Privacy is adopted (`REQUIRED_PREREQUISITES.privacy`) | Keep the sentence; Privacy cannot become `PUBLISHABLE` until H4-B is promoted, or the sentence is changed to describe the intake actually used |
| 8 | §6 Resend | Keep the notification contents. Add that Resend keeps delivery records for its stated period | OWNER ACCOUNT EVIDENCE REQUIRED (period) | P-09 | Open |
| 9 | §6 | No Slack entry | KNOWN FACT | No deployed path reads `SLACK_LEADS_WEBHOOK` (R3 §5.1 item 8). P-11 is housekeeping | No change needed |
| 10 | **§6 marker** | Remove the marker and keep: "We use these providers under written terms that require them to protect personal data and to use it only to provide their service to us." | OWNER ACCOUNT EVIDENCE REQUIRED | P-02 (Hostinger), P-05 (Supabase), P-07 (Resend). All three must answer yes | Open |
| 11 | §7 ¶1 | "Data is stored in Ireland. Supabase is a Singapore company with US sub-processors, so access from outside the UK is covered by the UK Addendum in Supabase's data processing agreement." | KNOWN FACT (UK Addendum, Singapore entity); "US" depends on item 6a | Supabase terms read at source (R3 §5.1 item 2); P-05 confirms; item 6a | Ready, subject to P-05 and 6a |
| 12 | §7 ¶2 | "Our email-notification provider, Resend, processes the notification and keeps its delivery records in the United States." Add: Hostinger's content delivery network serves pages from locations outside the UK and Europe | OWNER ACCOUNT EVIDENCE REQUIRED | Resend's US storage is a search summary only: P-07 and P-08. CDN: P-03 | Open |
| 13 | **§7 marker** | Name the safeguard per provider:<br>• Supabase: the UK Addendum (known; item 11).<br>• Resend: the UK Extension to the EU–US Data Privacy Framework (UK–US data bridge) **only if** P-10 shows the listing active with the UK Extension; otherwise the mechanism P-07 finds in its DPA.<br>• Hostinger: the mechanism P-02 confirms.<br>If any provider has no mechanism, the transfer is not described as covered; the owner decides what to do (change provider or configuration) | OWNER ACCOUNT EVIDENCE REQUIRED (Resend, Hostinger); KNOWN FACT (Supabase) | P-02, P-07, P-10 (P-05 for Supabase) | Open |
| 14a | **§8 marker** — operation | The routine has run, and §8 may say "we check monthly … and delete them" | **OPERATIONAL CONDITION NOT YET TRUE** | `../../operations/RETENTION-ACTIVATION-CHECKLIST.md`:<br>• the cleanup phase run once, with its log;<br>• a named operator;<br>• the first monthly log entry;<br>• the R17 `pg_dump` handled | Not true |
| 14b | §8 — provider periods | Fill R12–R14 | OWNER ACCOUNT EVIDENCE REQUIRED | P-04, P-06, P-09, P-12 | Open |
| 14c | §8 — wording | Replace §8 ¶2 in full (including "We do not currently delete general enquiries automatically" and the marker) with the R2 §5.4 paragraph, amended:<br>• **R8 per the owner's modification:** project files are returned or deleted within 90 days; the final delivered set is kept with the contract record;<br>• **periods as achieved:** "deleted at our first monthly check after 12 months", not "for 12 months";<br>• R12–R14 filled in.<br>Keep §8 ¶1 (the criteria) and ¶3 (accounting records) | PROPOSED WORDING | 14a and 14b first. Also re-read FA 1998 Sch. 18 para 21 and Limitation Act 1980 ss. 2, 5, 14A–14B at source before "six years" is stated as fact (`../../operations/RETENTION-SCHEDULE.md` §6; those hosts were blocked in R3 and R4) | Not applied |
| 15 | §2A | No change. "may show" stays accurate whether or not Freelancer reviews are displayed. Freelancer permission (`GS-HOST-H4-C`) is a separate blocker on showing the reviews, not on this policy's wording | KNOWN FACT | — | No change needed |
| 16 | Register | After 2.2 is applied: run `check:legal:adoption` (no markers allowed at `OWNER_ADOPTED`) and draft-mode parity. Privacy stays `OWNER_REVIEW_REQUIRED` until the **owner** adopts 2.2 | PROPOSED WORDING (process) | Owner adoption decision | Not started |

## Order of work

1. The owner answers P-01 to P-12. In parallel, the retention cleanup phase is authorised and run
   (`RETENTION-ACTIVATION-CHECKLIST.md`).
2. A legal phase records the answers and applies items 1–14 as Privacy 2.2. It re-verifies and re-runs
   the gates.
3. The owner reviews 2.2 and, if satisfied, adopts it. That is a register entry the owner authorises.
   This plan does not make it.
4. The six adopted documents carry a `PRIVACY-PUBLISHABLE` publication prerequisite. It can be met only
   once Privacy has itself been adopted **and** is made `PUBLISHABLE` at the same cutover, with item 7
   then true.
