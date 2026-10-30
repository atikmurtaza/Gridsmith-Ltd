# GS-LAUNCH-030 — legal adoption and production build unblocking

Source record, 30 October 2026, Europe/London. **CONDITIONAL — exact local adoption completed, Consumer 3.6 routing correction integrated, production held.** Seven documents are OWNER_ADOPTED; zero are PUBLISHABLE. No production/preview/CMS/provider mutation, analytics activation or merge occurred.

## Source and actual CI

Started from codex/gs-launch-029 at d0c792c89a4ecc991765e731b925135e0156602f. Work is isolated on codex/gs-launch-030; [draft PR #7](https://github.com/atikmurtaza/Gridsmith-Ltd/pull/7) targets 029. The coherent source contains main/023/026/027/029; unrelated dirty worktrees remain untouched. No dependency or lockfile change. Initial integration was ea28dfbdfe4e6c475916d884abcca5f97155e90c; the separately approved Consumer 3.6 correction is implementation commit 0ac38004e8ea5fe2e4c81f98a283e313bcacf42e. This source record is committed before fresh acceptance; the exact final run/SHA/verdict are bound by GitHub and retained in the private GS-LAUNCH-030 completion packet, rather than invented in advance.

[GS029 run 41100071266](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/41100071266): FAILURE. Normal verify SUCCESS; packaging failed after a non-2xx Jobs API response while waiting for normal CI; publisher SKIPPED. The discarded HTTP status cannot establish 502/rate limiting/authentication. It was not a normal-verification failure or the 120-minute deadline.

The focused repair adds a 30-second request timeout, at most5 consecutive transient/network/rate-limit failures, and the existing 120-minute deadline. Recognised primary/secondary rate limits honour timing headers or wait at least 60 seconds without usable guidance. Ordinary permission failures, malformed/missing jobs, failed normal verification, exhausted retries and deadlines still refuse packaging. Status/request-ID diagnostics are sanitised; permissions and publication gates are unchanged. Actual asynchronous polling has 80 permanent positive/adverse proofs.

[Fresh run 41127867903](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/41127867903) on ea28dfb: FAILURE. Candidate Apache/browser/accessibility/Lighthouse acceptance passed all 7 checks, all retained log hashes verify, and both dependency audits reported0 vulnerabilities. Normal verify's served group failed exactly check-consumer-terms: the approved Consumer 3.5 applicability paragraph linked directly to /legal/business-client-terms, while the existing consumer-routing assertion requires zero such links. Served legal parity correctly passed7 documents,110 clauses,430 paragraphs and29 cross-references. The repaired poller kept waiting and then correctly refused packaging on the failed normal result; publisher SKIPPED. This is not an accepted release baseline. No blind rerun or assertion exception was introduced.

That control conflict was corrected through a new exact owner-approved Consumer 3.6 replacement, rather than by changing the gate or rendering approved text differently. This is a repository-control conflict, not a claim that the clearly conditional paragraph itself breached consumer law. Fresh local development-dataset build, actual HTTP consumer routing and all-seven legal parity now pass together. Fresh exact-source Linux CI is still required for the corrected committed source.

The deployed preview remains source 629accd00e30b09394e6d3ef419999b2c8af0ec5, artifact bc7142541f7f6be325f615737025e0d494bbfb97c7a6058a5c92849b5020f517, artifact commit adbe957c9b3cd9cf3dd90a16af3d5ef56097a823. Main remains dbde73d30536543c54c7822b7cec092a25e13525. Existing auto-deployment-OFF evidence is reused; no redeploy, branch-history rewrite or artifact-branch write.

## Exact legal adoption and replacement

The owner first selected **Adopt that exact set for local integration**, identifying the exact seven GS029 versions/hashes. All seven were copied byte-for-byte, with prior sources/register/workflow preserved in GS-LAUNCH-030-superseded. The existing consumer workflow's copied proposal-status header was corrected as integration metadata, preserving all operative template wording. Historical proposals and the initial packet remain immutable evidence.

After the actual routing failure, a one-document Consumer 3.6 replacement was prepared: only version/review metadata and one hyperlink destination change to /legal/client-terms; visible clause wording is unchanged. An initial workflow proposal's two stale attachment identifiers were corrected before integration. The owner answered the superseding exact question: **Adopt the corrected exact Consumer 3.6 set**. The corrected question governs, including these exact hashes:

- Consumer 3.6: ac380cb266e05ab500988c0dd0cd47446348b1c3a4a63378377d5f8df04cc8f5.
- Coordinated workflow:7a5901e0030f940831d24e64f22534745fc1129ec11e571c256a3e8e0650545a.

Canonical Consumer/workflow equal those approved bytes. Consumer 3.5, full register and maintained workflow are preserved in GS-LAUNCH-030-consumer-3.5-superseded. Other six adoptions and all publication prerequisite lists/evidence are unchanged. Current versions: Privacy 2.9, Cookie 2.6, Website 2.4, Applicability 2.4, Business 3.4, Consumer 3.6, Accessibility 2.5. **Seven OWNER_ADOPTED; zero PUBLISHABLE.** Exact provenance is GS-LAUNCH-030-ADOPTION.md and GS-LAUNCH-030-CONSUMER-REPLACEMENT.json. No first-publication commencement condition changed. Obsolete GS026 proposal-mode selection is retired; generated summaries/manifest/fixtures are reconciled. The existing installation guard's workflow hash changed only for the reviewed proposal-environment removal.

## Direct contact and actual analytics preparation

The dated owner custody reply (1 September 2026) and no-copy statement are preserved privately without an invented age cutoff. Read-only webmail/hPanel inspection verifies mailbox access, no incoming Hostinger forwarders and a configured automatic outgoing Bcc destination. The owner confirms that destination is the authorised company Gmail account. This qualifies the internal-company-copy scope; it is not evidence of completed provider/retention/erasure operations. No customer messages were opened, records created or enquiries sent. Actual WhatsApp linked devices were not inspected. Existing O3–O5 holdings/provider/procedure/backup exceptions remain partial; no completed DIRECT-CONTACT-VERIFIED receipt is issued. No repeated custody confirmation or owner inventory file is requested.

The owner expressly authorises production preparation with existing PostHog EU project 315488 and existing GA4 property 550714475 / stream 15461354614, subject to readiness; no public collection/activation authority. The actual GA4 account is Gridsmith Ltd, property Gridsmith Dev, stream Localhost Development targeting http://localhost.local; the owner chose reuse of these exact existing objects. Current identifiers are verified and retained privately. No new property/project, rename, deployment variable or provider configuration was created.

Actual GA4 controls: Enhanced measurement off; user/event retention 2 months; reset, signals, user-provided collection, granular location/device collection and ads personalisation off; all four account sharing choices off. Account UI records Data Processing Terms accepted 18 August 2026. That Analytics DPA is not reused as Gmail/mailbox coverage.

Authenticated PostHog controls: EU project 315488, IP discard on; autocapture/web vitals/dead clicks/replay/heatmaps/surveys off; event window 12 months. Organisation Gridsmith Staging has **third-party AI services enabled**; internal AI training and Desktop beta terms are off. The screen states administrator/owner access is needed to change organisation settings. No toggle was changed. Legal documents shows no generated agreements. The actual menu is Legal documents → New → Data Processing Agreement (DPA); [provider instructions](https://posthog.com/dpa) require a valid company-specific countersigned agreement rather than treating the public example as binding. A valid existing agreement elsewhere may be referenced privately. No agreement was generated or signed. Applicable terms/transfer/rights/erasure evidence remains incomplete. [Retention documentation](https://posthog.com/docs/data/events-retention) and current project cleanup wording differ; no automatic physical-erasure guarantee is inferred. No support contact is needed.

The private inactive actual-identifier configuration passes the existing format and adopted disclosure checks; ANALYTICS-READY still refuses. The pure checks make zero collection requests. Both providers remain the chosen plan; no notice-only fallback is inferred. Cookie Stage A: **NOT RUN**; canonical adoption is confirmed, but sharing/terms/direct-contact readiness remains incomplete. Stage B: **NOT RUN** until the replacement actually serves at gridsmith.uk.

## New CMS export, complete payload comparison and recovery preparation

An authenticated, read-only [Sanity export](https://www.sanity.io/docs/http-reference/export) was captured privately, parsed completely and checked for duplicate IDs/error records. An independent authenticated `*[]` query matched the export by full canonical JSON content. Export SHA-256:

`1a53eea10014f6d181fe54e58b0fb7dc6263bba2be7cc334c3c46bd979fb9938`

It contains **59 total documents: 47 public application documents and 12 protected Sanity system records; zero drafts, legal documents or asset documents**. The earlier unauthenticated count of 47 is consistent with this wider authenticated export. The 12 system records are outside the migration and recovery scope; they are not additional customer holdings. No asset binaries need backing up for this snapshot.

The existing migration dry-run remains 47 eligible records and 10 withheld entries. Three withheld services are Technical; seven are legal. All affected IDs, field differences and full pre-write bodies are retained privately, with no customer/provider data placed in Git. Comparing source payload against the current public dataset after excluding server revision/timestamps found:

| Intended effect | Count | Detail |
|---|---|---|
| Same business content | 45 | Still replaced by the current createOrReplace loop, so they remain in the transaction's scope. |
| Changed content | 2 | companyDetails: placeOfRegistration and responseCommitment; service-design-technical-illustration: description. |
| Legal creations now | 0 | Withheld despite local adoption until publication authority and prerequisites. |
| Future legal creations | 7 | Only after eligibility: legal-privacy, legal-cookies, legal-terms, legal-client-terms, legal-business-client-terms, legal-consumer-client-terms, legal-accessibility. |

The company payload replaces the live “England” with the approved “England and Wales” and the old 48-hour response wording with “We aim to respond as soon as practicable.” Technical Illustration removes the live pointer to withheld Technical/CAD pages. These are already in accepted source; no new business wording was authored. A later CMS approval must explicitly cover these two records and the full 54-record eligible write, rather than describing it as seven legal inserts only.

Private recovery preparation contains 47 baseline createOrReplace bodies and a separately listed prospective deletion of only the seven transaction-created legal IDs, all currently absent from the export. An assert-based offline model proved that applying the current payload twice gives identical business content, and that restoring the baseline plus removing only those seven new IDs returns all original content while preserving the 12 system records. **Actual dataset restoration is NOT RUN.** Server revisions/timestamps regenerate; this is content recovery, not revision-history restoration.

At the actual write boundary: take a fresh export and verify its archive/content hash, complete ID set, asset coverage and revision snapshot; pause competing CMS writers; review all intended changes; obtain exact CMS authority; use the existing production safeguards; read back all affected content plus all-seven legal parity and Technical absence. Re-read revisions immediately before the transaction and stop on drift. The current createOrReplace loop is not a compare-and-swap lock.

Recovery must restore saved baseline content with a reviewed createOrReplace transaction or [import with --replace](https://www.sanity.io/docs/content-lake/importing-data), then remove only newly created IDs from this exact failed transaction after verifying their scope and current revisions. Import --replace does not remove extra documents ([Sanity backup restore semantics](https://www.sanity.io/docs/content-lake/backups)). Never use the migration's `--rollback` deletion of all eligible IDs as a dataset restore. No delete/import/write was executed. The current export is preparation evidence and must not be mistaken for a fresh pre-write export at some later date.

## Coherent source and authorised integration order

Fresh ancestry checks prove main, 023, 026, 027 and 029 are all contained in this candidate. There is no missing merge to invent in order to obtain one coherent source. PR #4's work is already incorporated through #5; #6 contains only subsequent preparation corrections against 027. Do not independently merge #4 again.

Remote refs remain: main dbde73d3; 023 a78166ef; 027 629accd0; 029 d0c792c8. The existing PRs remain drafts. No merge, retarget, rebase, force push or artifact-branch write is performed. The later authorised commands are:

```text
# Only after acceptance and explicit integration authority:
gh pr merge 5 --merge
gh pr edit 6 --base codex/gs-launch-023
gh pr diff 6
# Review the resulting focused diff and exact-source CI before:
gh pr merge 6 --merge
# Review and integrate the GS-LAUNCH-030 candidate after exact-source acceptance and authority.
# Refresh PR #3; merging it into main requires distinct explicit authority.
```

These are dependency-ordered future operations, not instructions to run now. No accepted branch needs rebasing. Source pushes cannot invoke the preview publisher without its manual exact-artifact approval; no production publisher is configured. Preserve the separate artifact branches and frozen preview.

## Production build and transaction boundary

The production-builder refusal was rerun with no analytics/intake/proposal override. It exits 1 before generation for exactly **eight predicates**: missing DIRECT-CONTACT-VERIFIED and the seven legal documents not PUBLISHABLE/eligible. Separate analytics disclosure/readiness predicates would also refuse real identifiers. No production profile or rehearsal was generated. Build-only authority is not supplied and the prerequisites remain unmet.

Continue the exact GS-LAUNCH-029 sequence: completed exact adoption and recorded custody → complete direct-contact evidence → real analytics readiness/authority or explicitly chosen fallback → pre-cutover cookie evidence → distinct all-seven publication eligibility → reviewed and separately authorised CMS transaction/read-back → accepted committed production build for https://gridsmith.uk → exact artifact/run/archive approval → scoped file upload into the existing verified website root → actual-origin Stage B and mail test → conditional recovery if critical checks fail. Do not repoint the preview archive or change the domain association. The downloaded disposable WordPress backup is reused, not turned into another restore project. Root preparation/replacement, mail tests and cutover need their own exact authority.

The original strict temporary robots.txt and nine-PNG CSP failures remain retained; no repeated debugging or exception is introduced. Production HTTPS/www, canonical/indexing, routes/legal content, CSP including PNGs, assets, consent, email delivery and recovery behaviour remain future actual-origin checks. Freelancer stays disabled; no review-source cleanup or history rewrite is authorised or performed.

## Verification and next action

PASS locally: full initial verify:static; corrected adoption 198 cases; consent 71; release 80; installation/extraction guards with the actual Windows Python interpreter; new clean development-dataset Next test build; actual served consumer routing and all-seven legal parity; migration dry-run 47 eligible / 10 gated; authenticated 59-document export/query parity; offline content idempotency/recovery; unchanged production refusal predicates. The corrected-source verify:static also passes; full Linux acceptance is rerun on the final commit; do not substitute local evidence or candidate-only acceptance for full CI.

The initial bundle sweep refused because no built chunks existed; it was never a secret finding or PASS. The later fresh normal test build now passes the client-secret bundle sweep as well as routing/parity. No production-profile artifact was built. Manual device/screen-reader and actual-origin acceptance remain unperformed.

**One next owner action:** finish the existing PostHog minimum-data handoff. At organisation General, an admin/owner must turn off **Enable PostHog features that use third-party AI services**, leaving internal AI training off. At Legal documents, review and complete the DPA flow if no valid company-specific DPA already exists. Expected result: sharing is off and a signed agreement/reference exists. Reply with completion or the actual exception only; no credentials, customer contents or new internal inventory. Do not enable public collection, alter mail routing, upgrade plans or deploy. The agent handles evidence assessment, existing rights/procedure exceptions and configured consent validation after those genuine prerequisites.

Legal adoption, existing GA4/PostHog destination selection, company Bcc custody and re-authentication are received; do not ask for them again. Publication/CMS/build/cutover remain separately scoped decisions after actual eligibility and review.
