# GS-LAUNCH-030 — legal adoption and production build unblocking

30 October 2026, Europe/London. **CONDITIONAL — exact legal adoption integrated; production held.** The owner has expressly approved the corrected seven-document set for local integration. Seven documents are OWNER_ADOPTED; zero are PUBLISHABLE. No deployment, CMS/provider mutation, analytics activation or merge is authorised by that adoption.

## Source and exact-source CI

Starting preparation: codex/gs-launch-029 at d0c792c89a4ecc991765e731b925135e0156602f, draft PR #6. Work is isolated on codex/gs-launch-030 and contains that entire source, accepted 027, 026, 023 and main. Unrelated dirty checkouts remain untouched. No dependency/lockfile change.

[Run 41100071266](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/41100071266) completed **FAILURE**: verify SUCCESS, hostinger-staging/build FAILURE, publish SKIPPED. Packaging successfully polled normal CI fifteen times, then immediately aborted on a non-2xx Jobs API response at preview-release.mjs. The discarded status/body cannot establish whether that response was 502, rate limiting or another HTTP failure. It was not a normal-verification failure or the 120-minute deadline. Private failing-job logs and current job metadata are retained.

The focused repair retains the successful-normal-CI prerequisite and adds a 30-second request timeout, at most five consecutive transient failures, and the existing 120-minute overall deadline. Network/408/5xx errors retry; 429 and recognised primary/secondary 403 rate limits honour timing headers, or wait at least 60 seconds without guidance. Ordinary permission errors, missing/malformed jobs, exhausted retries, deadlines and every completed non-success conclusion still refuse packaging. HTTP status and a sanitised GitHub request ID are logged without credentials. No workflow permissions or publication bypass were added. The actual polling path has permanent injected-time/network adverse tests in the existing release selftest.

**Fresh acceptance is required for this changed source.** The repaired/adopted source must pass the full exact-SHA Linux CI; this pre-CI source record does not claim a result from a run that has not finished. The accepted deployed preview below remains the release reference until separately approved publication. Final run identity and result are retained in the private GS-LAUNCH-030 completion evidence.

The accepted preview remains source `629accd00e30b09394e6d3ef419999b2c8af0ec5`, artifact `bc7142541f7f6be325f615737025e0d494bbfb97c7a6058a5c92849b5020f517`, artifact commit `adbe957c9b3cd9cf3dd90a16af3d5ef56097a823`. Auto-deployment OFF evidence from GS-LAUNCH-028 is reused without asking for another historical operation. Main remains `dbde73d30536543c54c7822b7cec092a25e13525`. No source acceptance is transferred from a different SHA.

## Exact legal transition boundary

All seven files in `GS-LAUNCH-029-ADOPTION.json` were rehashed against the owner's GS-LAUNCH-030 request. Every fingerprint matches:

- Privacy 2.9 — `449db68c0c452b214e78f68a33f4123d7b6c09bfdba1b9d54055db1392227764`.
- Cookie 2.6 — `66023b43f37a3a8c42fedb31b8229cdb0970420d5bed965911ae276a108e7da3`.
- Website Terms 2.4 — `5a89cec4ea564a64bbcc55f692cccb94f421011f86233b7e62916d2a0d977571`.
- Client Terms Applicability 2.4 — `1aae31572444d6c543fddbab71b66138ffb06ba516d4d10d836835a474cdfa6a`.
- Business Client Terms 3.4 — `e7f1a7c1a1b64d66349aa4f3c806d4953ed739e5f36ceb6bd26724948168c0de`.
- Consumer Client Terms 3.5 — `aeed75437292bd352ba86951061e4519fab44503881985249d56093d6b88488c`.
- Accessibility Statement 2.5 — `e7b7f71e34c44db2202c9f41c1a09073c46ef25e05f34127c1263750d7da211f`.

The owner explicitly selected **Adopt that exact set for local integration** in response to the question identifying these exact versions/hashes and exclusions. The canonical copies now equal those exact proposal bytes. The prior seven texts, register and consumer workflow are preserved byte-for-byte in docs/_legal/evidence/GS-LAUNCH-030-superseded. Provenance is recorded in GS-LAUNCH-030-ADOPTION.md and the current register, dated 30 October 2026 without an invented time.

The coordinated Consumer3.5 workflow is copied unchanged. Generated summaries, the non-writing migration manifest and permanent fixtures are reconciled. ACTIVE_LEGAL_PROPOSAL is null and the staging workflow no longer selects GS-LAUNCH-026; its existing installation-guard hash was updated for that reviewed environment-only change. Older proposals/packet and the GS014 historical regression specimens remain available. Independent fixed expected hashes assert all seven adopted texts and archive integrity; publication prerequisite lists and evidence are unchanged. All seven remain OWNER_ADOPTED, **zero PUBLISHABLE**. The preview still shows the older 2.8/2.5 proposals; it was not redeployed. No effective-on-first-publication wording changed.

## Direct contact, analytics and Cookie Stage A

Reuse GS-LAUNCH-029's private direct-contact preparation and existing channel/retention evidence. The owner answered the dated custody question: **date: september 1 2026. no direct enquiries are copied into other systems**. That is recorded privately as the owner's dated custody attestation and present no-copy statement. There is no invented age cutoff. It does not, by itself, resolve the existing O3 holdings/retention application, O4 account-specific provider/transfer coverage and O5 procedure/backup-expiry/deletion handling gaps. The preparation remains partial; no DIRECT-CONTACT-VERIFIED receipt is fabricated. No customer records or inventory files were requested or created. Provider-log/backup unknowns remain explicit.

The preference remains **GA4 plus PostHog before launch**; notice-only fallback is not assumed. Reuse EU PostHog project 315488 and its privately verified current public identifier only after actual destination approval. Do not reuse the mismatched older local key. GA4 property inventory 550714475 does not establish its web stream, Measurement ID or settings. The current browser retry again reports local browser use disabled. No account creation, duplicate banner, settings change or provider collection occurs. Existing terms/DPA/transfer, retention/rights and minimisation requirements still need genuine evidence before ANALYTICS-READY can be recorded.

**Cookie Stage A: NOT RUN.** The final canonical policy set is now adopted; the intended actual analytics configuration and complete direct-contact evidence remain unconfirmed. Prior test-ID consent acceptance is engineering evidence, not this final Stage A receipt. The existing explicitly non-deployable production rehearsal remains available after those preconditions, using `check-consent --production-rehearsal` on loopback and the supported Hostinger-equivalent stack. A release-artifact repeat follows eligibility/build. **Stage B: NOT RUN** until the approved replacement actually serves at gridsmith.uk. No cookie gate is bypassed.

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

## Verification and remaining owner action

Local PASS: verify:static (TypeScript, lint and the complete static gate chain), legal adoption and 196 regression cases, consent71 cases, release80 positive/adverse proofs, reviewed browser installation/extraction guards (explicit Windows Python interpreter), exact seven approved hashes and preserved predecessors/workflow, migration manifest/dry-run, authenticated59-document export/query parity, offline idempotent content recovery, source ancestry, and the post-adoption production refusal with exactly eight expected reasons. The initial default browser selftest hit the Windows python3 application alias (exit9009); passing the actual C:/Python314/python.exe resolved the invocation without changing the guard.

The earlier standalone bundle sweep refused because no built chunks exist in this local worktree; that is an unperformed sweep, not a secret finding or PASS. Linux CI owns fresh built-artifact, served legal parity, browser/accessibility, performance and dependency-audit acceptance of the committed source. No local production artifact or broad visual redesign was made.

Owner adoption and the dated no-copy/custody response are received; do not ask for them again. Remaining account facts must be read from the actual existing accounts. GA4 property550714475 still needs its Gridsmith web stream/public G-… ID verified, Enhanced measurement OFF, 2-month user/event retention with reset OFF and signals/user-provided collection OFF. PostHog EU315488 is the verified Gridsmith Staging Project; its production destination and the real retention/DPA/transfer/erasure evidence are not approved. No stale project key is reused, no replacement account is created, and both providers remain the owner's preference; no notice-only fallback is inferred. Current browser access is disabled in this chat, so unobserved account settings remain unknown.

**One next owner action after engineering acceptance:** enable read-only access to the existing GA4/provider accounts so the remaining actual settings and operational exceptions can be verified. Give any required access/settings confirmation only for the controls actually shown; no credentials, customer messages or owner-authored inventory are needed. Any later publication/CMS/build/cutover decision must identify its exact reviewed target separately.
