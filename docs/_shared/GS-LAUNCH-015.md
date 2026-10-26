# GS-LAUNCH-015 — Direct-Contact Operational Verification

25 October 2026 (Europe/London). **LOCAL VERIFICATION COMPLETE; DIRECT-CONTACT-VERIFIED UNMET; PUBLICATION HOLD.**

Verified source: `c7f1b9478d4fe3e18ecaabd7a1fabe3011d03ac0` (`codex/gs-launch-014`). Isolated branch: `codex/gs-launch-015`; worktree: `C:\Users\atikm\.codex\worktrees\gs-launch-015\Gridsmith Ltd`. This phase changes documentation/evidence only. Resolve the documentation commit with `git log -1 --format=%H -- docs/_shared/GS-LAUNCH-015.md`; no artifact or CI result is bound to that later commit.

Structured draft, input fingerprints, individual command/exit/timestamp/log-hash receipts and preservation results: [GS-LAUNCH-015-EVIDENCE.json](GS-LAUNCH-015-EVIDENCE.json). Raw logs and offline generated content remain ignored under `build/gs-launch-015/`, with unique filenames for every executed attempt. They are local evidence, not published artifacts.

## 1. Existing owner authority and operational/source evidence

The current supplied GS-LAUNCH-015 instruction repeats the settled owner attestations in [GS-LAUNCH-012 §1](GS-LAUNCH-012.md). Its exact supplied text and SHA-256 are retained inside the evidence JSON, not represented as a signed operational receipt. The existing named operator is Atik Murtaza via Gridsmith administration (register/R9 evidence); owner or sales department accesses enquiries. This records the requester/existing operator basis, not independent identity authentication or newly dated operational execution.

| Subject | Confirmed evidence | Result and limit |
|---|---|---|
| F1 email | Owner attests `contact@gridsmith.uk` active and monitored; exact native destination `mailto:contact@gridsmith.uk` agrees with source and local output | OWNER ATTESTED; independent mailbox access/delivery evidence UNVERIFIED. No enquiry sent. |
| F1 WhatsApp | Owner attests `+447405448534` active and monitored; helper derives `https://wa.me/447405448534` | OWNER ATTESTED; independent messaging account/access/delivery evidence UNVERIFIED. No message/call sent. |
| F2 handling | Owner or sales department accesses enquiries; direct enquiries not currently copied into other systems | OWNER ATTESTED; forwarding/linked-device recipients and retained remote-intake operational disposition UNVERIFIED. No owner-only restriction inferred. |
| F3 historical data | Supabase, Resend, email and developer-created backups may retain earlier data | OWNER ATTESTED uncertainty; categories, purposes, bases, custody, locations, holds and provider expiry/settings not inventoried by this task. No erasure inferred. |
| F4 locations/access | Website hosting France/EU; no current overseas company-personnel access | OWNER ATTESTED; not account-specific website/email/Meta/content/historical-provider location or transfer-setting verification. Existing R11 Hostinger contractual coverage stays on its recorded basis. |
| F5 responsibilities | Owner manages retention, deletion, backups and privacy requests | OWNER ATTESTED; no completed current review, automated deletion, new backup system or restore proof inferred. R9's dated receipt remains historical evidence on its original scope. |
| Both contact pages | `app/(marketing)/contact/page.tsx`, `app/(press)/press/contact/page.tsx`, shared `StaticContactShell` | SOURCE/OFFLINE PASS: native email/address and WhatsApp names; new-tab wording; email present in initial HTML without website JavaScript. Browser/no-JS/keyboard execution NOT RUN. |
| No public SMS/voice | Shared helper, footer, About `Connect`, Organization metadata, all seven current legal instruments | SOURCE/HTTP/OFFLINE PASS for reviewed predicates: no `sms:`/`tel:` action, advertised SMS/voice invitation or Organization telephone. Consumer §6.1 hypothetical phone/video example and historical records remain valid. |
| No forms/intake/Resend | `lib/build/target.ts`, `scripts/build-static.mjs`, `lib/build/production.ts` | Production static profile explicitly selects direct contact, replaces both form graphs, removes API/probe routes and strips endpoint/notification/private configuration. Whole-artifact transport/form checks pass. Existing remote services are not assumed shut down. |
| Truthful confirmation | Press contact thank-you selects direct-contact explanation and email alternative | SOURCE/OFFLINE PASS; no message-received assertion in the direct export. Normal development confirmation remains a separate form-test subject. |
| Cross-site consistency | Master, Design, Digital, Press, About, shared footer and current legal routes | HTTP company gate: ten questions on 21 routes; denied export: all 54 eligible routes carry exact email/WhatsApp links, including both contact pages. |

The **normal** build retains forms/probes for existing development and regression verification. It is not the direct static release and is not evidence of a form-free deployment. The no-form/no-intake conclusion concerns the reviewed production transformation and denied export only.

## 2. Prerequisite verdict and precise remaining evidence

**DIRECT-CONTACT-VERIFIED = UNMET.** The evidence JSON is a **DRAFT / NOT A COMPLETED RECEIPT**, and is not inserted into `prerequisitesMet`. Existing code checks a nonblank reference; that cannot authenticate business facts. No gate, prerequisite wording, canonical legal document or publication state is changed.

Authority: [GS-LAUNCH-011 §3](GS-LAUNCH-011.md), refined to email/WhatsApp only by [GS-LAUNCH-012 §6](GS-LAUNCH-012.md), and the current register's direct-mode prerequisite. All locally executable source/test components are complete. The missing prebuild component is one dated private operator evidence record covering only these gaps:

1. **GS-L015-O1 / F1:** Operator and actual check date, private reference showing current mailbox and WhatsApp access/control and usable email fallback. A redacted access/settings observation or existing genuine check reference can support this; no new test enquiry is prescribed or authorised.
2. **GS-L015-O2 / F2:** Actual forwarding/linked-device recipients and access/custody, plus confirmation that no live website intake journey is in use for this release. Distinguish a separately retained remote endpoint; no deletion or shutdown is required by this task.
3. **GS-L015-O3 / F3:** A minimised holdings inventory for Supabase, Resend, mailbox/sent/trash, exports/devices, restricted review copies and developer backups: present/absent/unknown by system; categories, purposes/bases, custody, location and holds; applicable retention/expiry and provider settings evidence. No customer message contents or credentials in Git.
4. **GS-L015-O4 / F4:** Applicable email/Meta/content/historical-provider entities, processing/access locations and actual contractual/transfer coverage. France website origin does not answer these questions. Preserve R11's documented authorised corporate-use conclusion; no new internal-administrator agreement is requested. Agency execution is required before relevant agency access, not automatically for inactive future work.
5. **GS-L015-O5 / F5:** Apply the existing documented periods to those holdings (enquiries 12 months, spam 30 days, working files 90 days, long-term records by their stated anchors), identify custody and reference genuine review/deletion/rights and backup/restoration-deletion handling evidence. Record absent systems honestly. Future scheduled reviews are not overdue completed runs and must not be fabricated; the first scheduled November review has not yet fallen due.

No reconfirmation of active channels, owner/sales access, no current copying, France hosting, no current overseas company-personnel access or owner responsibility is requested. Provider facts and completed execution cannot be inferred from those attestations. The owner can supply one packet with these five entries; a receipt can then be assessed through the existing controlled-reference mechanism against exact unchanged source. If new facts contradict approved wording, identify that specific inconsistency before any separately authorised revision.

**Separate final-artifact requirement:** after real publication prerequisites/authority permit construction, bind the actual source commit, package/lock/legal hashes, artifact identity, complete manifest/file hashes and all-seven generated/CMS/served parity. Recheck every exported route for forms/API/intake/notification transport, exact two channel destinations, truthful confirmation/errors, HTTP/browser/no-JS/keyboard behaviour, exclusions/security, cookie A-2 on the serving stack and its authorised production-origin repeat. Run required Linux/Apache/axe/Lighthouse/CI checks on the actual candidate. These are later acceptance requirements, not invented missing prebuild delivery receipts. Any source/artifact change requires appropriate revalidation/rebinding.

## 3. Exact hashes and legal integration

| Input | SHA-256 |
|---|---|
| package.json | `97854c2b19e9ca55d5a793bfb5a768ce28d2856d7c44159ebdccfff2b64dad31` |
| package-lock.json | `f45a725650c64e81bc8d580569e012ad07ca3d254e8ffaa63fb22c6cc57a6fa3` |
| Privacy 2.7 | `822dd473c253e7d031e18cf6c439ace13817f270d9fd9e1898d9b8c5fc4549a3` |
| Accessibility 2.4 | `774b1e200e67d146b0375b12c3fd4fadb3aeb0e27b87ea53bd0b419557984708` |
| Consumer Terms 3.4 | `a73f6df89b681721ebd97e841803327e8e91caabd1da0a90edbf204d590a0d5e` |
| Cookies 2.4 | `e853438e4acb65f953ea58575681c94bd0dc0908359b091190891fe3a8a0e960` |
| Website Terms 2.3 | `e63d8cd2d30938481d2219ec632f49d3c9f8df75ec287a28fa9fe079b274482a` |
| Business Terms 3.3 | `89f63c91642267a3ffc31d2f33ba3cbca3d383da434c007739cc1ba9f9c275c6` |
| Applicability 2.3 | `008c05806aad6045272e4438531b9247f8b4d05b4d9b4295196a0282de0c8a87` |
| Active adoption register | `f3b1f3a17e9d183b1cbe012a9e9788e312335c5f8acd6f1b82bc6b6d0909a56d` |

All seven fingerprints match their current register entries. **Seven OWNER_ADOPTED; zero PUBLISHABLE.** All canonical texts, the register, predecessors, original authority, workflow and earlier evidence are byte-identical to the starting commit. Consumer quotation/confirmation references remain 3.4; historical 3.3 workflow/adoption remain preserved. Privacy `contactMode: direct` and Accessibility disclosures agree. H4-B and form-mode Privacy remain required for any future form activation. Local import through `seed-legal.mjs` generated seven documents, 109 clauses and 406 paragraphs; no CMS write was needed or performed. Normal served parity independently matched those seven instruments word-for-word.

All-seven publication refusal, Privacy co-publication, Hostinger processor controls, Cookie A-2, retention duties and separate PUBLICATION-AUTHORITY/CUTOVER-AUTHORITY remain intact. Adoption is not publication, commencement, operational compliance clearance or authority to alter existing contracts.

## 4. Executed local verification

| Check | Result | Measured scope |
|---|---|---|
| Clean exact-lock install | PASS, exit 0 | Node 24.15.0/npm 11.12.1; Puppeteer download disabled; no privileged credentials supplied; package/lock unchanged |
| Full `verify:static` | PASS, exit 0 | Complete chain, including typecheck/lint/security/schema/migration/consumer dependency checks |
| Company/contact selftest | PASS within full static run | 387 cases; positive and each adverse matcher branch, all seven canonical subjects |
| Legal adoption and parity selftests | PASS within full static run | 171 adoption cases; 39 parity assertions; actual register/adoption gate passed |
| Production/direct static selftests | PASS within full static run | 38 production adverse proofs; 45 direct-contact/error adverse proofs; all-seven and future-form refusals retained |
| Clean normal `verify:build` | PASS, exit 0 | `.next` proven absent before build; secret-marker, tokens/themes and all 69 bundle budgets |
| Normal served company/legal/Consumer | PASS, exit 0 | Ten company questions × 21 routes; seven legal documents/109 clauses/406 paragraphs; 2 Consumer routes/208 links |
| Offline legal generation | PASS, exit 0 | Existing seed import only; seven adopted versions, no CMS write |
| Production dependency audit | PASS, exit 0 | `npm audit --omit=dev --json`: zero vulnerabilities; no development-risk acceptance |
| Production builder | EXPECTED REFUSAL, exit 1 | Exactly eight unmet inputs: direct receipt and seven independent not-PUBLISHABLE refusals; no `out/` |
| Fresh denied rehearsal | PASS, exit 0; 54 routes/199 files/28,690,862 bytes | Production static profile; deny-all protection; not deployable |
| Whole-artifact reinspection | PASS, exit 0; 198 payload hashes verified | Existing checker, manifest hashes, ten company questions, both contact destinations and metadata; only expected LEGAL/REHEARSAL contract refusals |
| Protected source/history | PASS; baseline files rehashed, only four phase control documents changed | No application, gate, package, legal/register or workflow change |
| Independent source reviews | Five bounded independent reviews; no remaining material finding after review | Source/evidence scope only; no rendered/hosted certification |
| Linux/Apache/browser/no-JS/keyboard/AT/axe/Lighthouse/exact-source CI/Hostinger | NOT RUN / UNVERIFIED | Windows/source/selected HTTP/offline results cannot substitute |

The generic HTTP harness prints its Windows Lighthouse skip notice; only the three explicitly selected HTTP gates ran. No Lighthouse collection or browser analysis is claimed. No Docker command or previously denied creation was retried.

Automatic approval review rejected one combined `.next` cleanup/build shell invocation **before execution**, reason “blocked by policy”; it has no process exit code or test result. A separate read-only check established `.next` did not exist. The standalone normal build then ran without deletion and passed. The rejected attempt and executed-command logs are retained separately; no successful result relabels that denial. There were no unexpected executed-test failures.

Denied rehearsal identity: `c7ec034351e9508f0a1ef5b50b66abcad84221044f5b5c8c98c02829f0801465`; sourceSha `c7f1b9478d4fe3e18ecaabd7a1fabe3011d03ac0`; sourceModified=false; rehearsal=true; deployable=false; `Require all denied`. All 198 payload hashes and the manifest identity reverified offline.

The rehearsal is offline evidence only, denied and nondeployable. It must never be uploaded/promoted or made deployable by changing its flags or removing `Require all denied`. It does not contain the gated seven legal pages and cannot establish final-artifact legal parity. A future documentation commit has a different SHA; unchanged source hashes do not turn this into final-commit acceptance.

## 5. Concise release-blocker matrix

Statuses describe the whole row. COMPLETE is not inferred from a partial component. Private evidence stays outside Git/public roots; commit redacted references/status only.

| Item | Status | Evidence source | Specific owner/operator action | Independent? |
|---|---|---|---|---|
| 1. Direct-contact operations | PARTIAL | This report §§1–2; GS-LAUNCH-011 §3; GS-LAUNCH-012 §1 | Supply one dated private O1–O5 packet; then assess genuine prebuild receipt against the pinned source | Yes, collection can proceed now |
| 2. Historical/provider obligations affecting publication | PARTIAL | Adopted Privacy §§6–10; GS-LAUNCH-013 U1–U3; existing R9/R11 evidence | Complete O3–O5 for actual retained processing and record disposition of any disclosure/operating inconsistency before publication. Obtain agency instruments before relevant access | Yes; overlaps O3–O5. Inactive future agency/analytics/review work is not automatically a launch blocker while withheld |
| 3. Live WordPress root/database mapping | BLOCKED | GS-LAUNCH-011 §5; earlier listing is not mapping evidence | Provide redacted site ID, privately matched absolute root/wp-config database ID, and distinct temporary-site root/database mapping | Yes, read-only collection |
| 4. Current auto-publisher configuration | BLOCKED | GS-LAUNCH-011 §5; workflow inspection is insufficient | Supply current hPanel Git repository/branch/destination/auto-deploy state, scheduled/external writers and proposed window freeze | Yes, read-only collection; changing/freeze execution needs authority |
| 5. Matched backups and restore proof | BLOCKED | GS-LAUNCH-008 §6; GS-LAUNCH-011 §5 | Identify matched complete WordPress files/database snapshots, IDs/times/hashes/custody and isolated restore receipt. Separately authorise missing backup/download/restore operations | Existing-receipt collection yes; execution depends on mapping and separate authority |
| 6. Actual upload/root-switch/rollback | BLOCKED | GS-LAUNCH-008 §6 guarded procedure; GS-LAUNCH-011 §5 | Verify supported SFTP/SSH or named hPanel operation, permissions/capacity/live-new-old-failed paths, exact inverse, post-snapshot-write handling and rollback window. Two renames have a gap, not atomicity | Capability collection yes; execution depends on rows 3–5 and 10 |
| 7. Authorised Ubuntu 24.04/Debian 12 environment | BLOCKED | GS-LAUNCH-010 §1; prior policy denial; zero retries here | Policy administrator provisions/clears a supported disposable container job compatible with existing `/.dockerenv` and `/work/repo` proof premises, then explicitly authorises its use | Provision/clear independently; browser/tool execution also needs row 8 disposition |
| 8. Development-toolchain risk decision | BLOCKED | GS-LAUNCH-009/010; GS-LAUNCH-011 §6; fresh install still reports 9 high | Owner selects remediation or an explicit scoped/time-bounded disposition for nested Zod 3 and two extract-zip advisories, with accountable operator and job binding. Reaudit actual environment; no acceptance inferred | Decision preparation yes; environment-specific exception requires row 7 identity |
| 9. Browser/Apache/axe/Lighthouse and exact-source CI | NOT RUN | Current local receipts; GS-LAUNCH-010 acceptance list | After rows 7–8, authorise exact-source Linux/browser/Apache/axe/Lighthouse execution and separately publisher-safe CI/push/dispatch where needed; retain failures and final-artifact repeats | Local preparation yes; execution depends on 7–8, final artifact after legal clearance |
| 10. Legal publication and artifact-bound cutover authority | BLOCKED | Current register; GS-LAUNCH-011 §7; GS-LAUNCH-008 §7 | Separately approve all seven exact versions only after real prerequisites, then approve the exact final artifact/destination/backup/security/publisher/upload/switch/rollback transaction after acceptance | Publication decision preparation can proceed; final cutover authority requires resolved preceding rows |

Existing Hostinger processor-chain and retention entries remain recorded on their historical scope; this phase neither reopens them nor claims they verify current provider settings or all historical holdings. The blocker analysis applies existing project controls; it is not new legal advice or a fresh provider contract assessment.

## 6. One next actionable task and STOP

**Owner/operator: supply one dated private operational evidence packet keyed O1–O5 above, with redacted references and no customer contents/credentials.** The next separately authorised verification can then bind those genuine facts to the unchanged source and decide whether to record DIRECT-CONTACT-VERIFIED through the existing mechanism. No open-ended source investigation, settled-fact reconfirmation or unsolicited message is needed.

Scoped local documentation commit only. No push, CI dispatch, CMS/provider/Production write, legal publication/PUBLISHABLE promotion, deployment, WordPress/DNS/email change, historical-data deletion, security-risk acceptance or test enquiry. **Do not start GS-LAUNCH-016 automatically. STOP.**
