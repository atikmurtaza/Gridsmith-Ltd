# Retention and erasure implementation requirements

22 October 2026. This is an executable design specification, not a claim that the programme is automated. Manual review may meet storage limitation if reliable and proportionate; UK GDPR does not require every record to have an automatic database job. Existing heterogeneous mailbox, project, banking and agency stores cannot safely be purged using only the enquiry creation date. No new Production migration, job, function or permission is authorised here.

## Consent mechanism on the separate source branch

The separate adoption-source branch at `a7b931c10eb2a543bfa43e89954555fdadb7072d` contains migrations `20261021180000_gs_r16_consent_evidence.sql` and `20261021220334_gs_r16_consent_daily_retention.sql` provide the consent table, insert-time pruning and daily 03:17 UTC job. Events older than 18 months expire individually; withdrawal has its own evidence timestamp. The exact job command has lock timeout 5s, statement timeout 60s and UTC arithmetic; its own completed history older than 30 days is pruned without touching other jobs. A08/A09 evidence records Preview deployment and manual rollback-only proof, not Production deployment or genuine daily execution. Preserve that distinction. The evidence table has no IP/UA/analytics-ID columns, but provider request logs remain separate.

Before analytics activation, inspect the correct environment's identity and migration ledger read-only, compare exact deployed command/hash/privileges to approved source, observe a genuine scheduled completion, verify overdue count and failure signalling, and document how expired data and rights requests are removed from processors. Empty-table scheduled success proves scheduling, not expired-record removal; retain the separate synthetic boundary/rollback proof. Production deployment and any test write require separate authority.

## Business-record deletion design

Use the existing monthly/quarterly/annual manual schedule until a replacement is implemented and verified. The named operator is Atik Murtaza through Gridsmith administration; no deputy is evidenced. Record review date, category, counts due/retained/deleted, basis for exceptions, operator and next review; avoid keeping copied message bodies or permanent identifiers in the deletion audit.

A future automated candidate selector needs authoritative lifecycle metadata: record category; last substantive contact; project conversion and completion dates; financial-year end where relevant; applicable contract/rights needs; legal-hold reason, owner and review date; storage references and processor scope. Do not delete all enquiries older than 12 months if a client record, claim or unresolved request still needs relevant evidence. Do not extend expiry indefinitely on irrelevant activity.

Run a dry selection first. Require bounded batches, an eligible-ID/count assertion and transaction/rollback for database actions. Separate tasks for mailbox, project storage, local exports and agencies must be idempotent, with per-store completion states and no false global-success flag. Preserve necessary accounting/title evidence, while removing unrelated manuscripts and working copies. A legal hold protects identified evidence and must be reviewed; it is not a blanket exemption.

## Rights requests and withdrawal

Log and triage requests promptly, verify identity proportionately and determine the controller and applicable exceptions. Normally respond within one month, with an explained lawful extension or pause if applicable. Restrict disputed use while assessing where required. Maintain a system/recipient checklist and processor instructions, record responses and verify removal/return without retaining unnecessary identity documents. Inform recipients as required by Article 19 and explain any lawful refusal. If acting for a client controller, assist and forward requests rather than making unauthorised controller decisions.

For analytics, stopping browser requests and removing cookies are separate from removing provider-held personal events. The separately prepared PostHog model is future work in this primary branch, where analytics remains disabled; before any activation, demonstrate the applicable deletion method against synthetic events for that exact model, not a profile API assumed to exist. Retain a suitably protected way to honour withdrawal/erasure without building an unnecessary permanent identity map. GA4 user/event deletion and any exports require separate tested instructions. A query retention window is not deletion. If the selected provider/model cannot meet the intended retention/erasure duties, keep it disabled or change the model before activation. Do not ship secret deletion credentials to the browser.

## Backups, failure and monitoring

Document each recovery store, provider/controller responsibility and finite expiry or justified criteria. Keep removed information unavailable for ordinary use while awaiting expiry, and reapply deletions after restoration. Local exports, staff devices and agency copies are part of the review; a database delete does not erase them. Do not invent a provider expiry or dashboard log-deletion guarantee.

On failed deletion: roll back atomic database work, retain minimal error/count evidence, mark incomplete stores, alert the operator, retry the bounded task and escalate repeated failure. The daily job's next run is a retry opportunity, not proof of success. Monitor last successful run, overdue count, stuck runs and repeated failures; retaining only a green configuration flag is insufficient. Cron history cleanup must not erase the evidence needed to detect unresolved failures. Set alert routing and a response owner before Production activation.

## Required verification before declaring operation

Disposable synthetic tests must cover exact cutoffs/timezones; expired, current and future records; successful and failed transactions; retry idempotence; legal holds; converted enquiries; accounting/title exceptions; role denials; no public grants; count/ID limits; audit minimisation; processor deletion; backup restoration/redeletion; and alert failure. Confirm the correct Production identity, authorised deployment receipt, exact source SHA, actual scheduled run, overdue state and responsible operator. No local, Preview or configuration check alone closes that gate.
