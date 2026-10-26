# GS-LAUNCH-012 — Owner-confirmed contact and legal revision

25 October 2026 (Europe/London). **LOCAL CONTACT IMPLEMENTATION; PROPOSED LEGAL TEXTS; PUBLICATION HOLD.**

Base: `4ac921a17c6a1b32b52bc4a510b2f40c3d27f61a` (`codex/gs-launch-011`).
Branch: `codex/gs-launch-012`.
Worktree: `C:\Users\atikm\.codex\worktrees\gs-launch-012\Gridsmith Ltd`.
Phase commit locator: `git log -1 --format=%H -- docs/_shared/GS-LAUNCH-012.md`.
Exact file hashes, command/timestamp/exit/log-hash receipts and preservation checks:
[GS-LAUNCH-012-EVIDENCE.json](GS-LAUNCH-012-EVIDENCE.json).

## 1. Authority and owner-confirmed facts

Authority is the owner's GS-LAUNCH-012 request supplied on 25 October 2026. Its F1–F5 confirmations
supersede the unsigned GS-LAUNCH-011 fact questions only to the extent stated below. They are owner
attestations, not independently executed mailbox, hosted, retention or backup tests.

| Fact | Confirmed operation | Limit retained |
|---|---|---|
| F1 | `contact@gridsmith.uk` and WhatsApp `+447405448534` are active and monitored. Public direct methods are email and WhatsApp only. | SMS/text and voice options withdrawn. No test message, call or delivery receipt created. |
| F2 | Owner or sales department accesses messages; direct enquiries are not currently copied to other systems. | No owner-only restriction, staff location, forwarding/linked-device inventory or exclusive device custody inferred. |
| F3 | Historical personal data may remain in Supabase, Resend, email and developer-created backups. Owner has not established a new backup system. | No data deletion, universal erasure, absent provider backups or verified provider expiry claimed. |
| F4 | Owner confirms France/EU website hosting, no current overseas company-personnel access, authorised company access only. | Provider/subprocessor and agency processing can still occur internationally; hosting is not proof of email/Meta locations or transfer safeguards. |
| F5 | Owner manages retention, deletion, backups and privacy requests. | No automated deletion, completed review cycles or tested backup/restore system established. Existing periods require current applicability confirmation. |

No new receipt ID, owner signature, adoption, hosted acceptance or completed operational check is
created. The request's configuration is not evidence of any external action.

## 2. Email/WhatsApp-only implementation

- `lib/company/companyDetails.ts`: retain derived `https://wa.me/447405448534`; remove `smsHref`.
- Master and Press contact pages: remove SMS actions, channel labels and metadata; keep native
  `mailto:contact@gridsmith.uk`, WhatsApp, the displayed messaging number, existing response copy,
  accessible new-tab labels and the no-JavaScript email route. Master wording no longer says an
  enquiry reaches the founder exclusively.
- Shared `Connect` on About: remove the SMS row/glyph, retain email/WhatsApp and approved social
  account links, and replace its obsolete enquiry-form recommendation with direct-contact wording.
  Social profiles remain platform links, rather than new advertised enquiry channels.
- Shared footer on all four divisions: label WhatsApp only; remove the Organization `telephone`
  property so metadata no longer offers the messaging number as a telephone contact.
- `StaticContactShell` and Press thank-you page: email/WhatsApp only; still no false receipt claim.
- About and company schema helper comments are reconciled with the withdrawn channel.

The existing production static builder still removes both form graphs, API/probe routes and intake
configuration. No enquiry form, remote Supabase intake, Resend notification, analytics or public
review is activated. The normal/development form subjects remain available for their separate
verification; they are excluded from the approved direct-contact production artifact.

Styles, tokens, typography, motion, technical restrictions and service architecture are unchanged.
The exact response source remains `companyDetails.responseCommitment`: “We aim to respond as soon
as practicable.” No call/SMS fallback is added. The phone number remains available for WhatsApp.

## 3. Exact proposed final legal texts — NOT ADOPTED

These complete files, including version/review/effective-date headers, are the exact adoption
review subjects. They contain no copied signature, adoption authority or adopted hash:

- [Privacy Policy 2.7](../_legal/proposed/GS-LAUNCH-012/privacy-policy-2.7.md).
- [Accessibility Statement 2.4](../_legal/proposed/GS-LAUNCH-012/accessibility-statement-2.4.md).
- [Exact old/new unified comparison](../_legal/proposed/GS-LAUNCH-012/comparison.diff).

SHA-256 values are in section 8 and the evidence JSON. Their review date is 25 October 2026;
commencement remains first publication with the replacement website at gridsmith.uk. That future
event wording does not authorise publication. The canonical `current/` sources, generated legal
content, register and old adoption evidence remain unchanged. All seven remain OWNER_ADOPTED,
zero PUBLISHABLE. The proposals are not imported by the public legal renderer or seed.

| GS-LAUNCH-011 baseline | Old canonical text | Proposed final disposition |
|---|---|---|
| P1 Privacy §2 | Form-provider request data and duplicate-submission references | Hosting/content delivery/security request information; no active form assertion. |
| P2 Privacy §2 | Enquiry-database storage assertion | No website form/database submission/automated notification; email or WhatsApp; owner/sales access; no current copying. |
| P3 Privacy §6 | Live Supabase collection and Resend notifications | Direct providers; separate qualified historical Supabase/Resend/email/developer-backup disclosure; no erasure claim. |
| P4 Privacy §7 | France website and active Ireland enquiry storage | Owner-confirmed France/EU website; direct providers; no current overseas company-personnel access. No active Ireland intake claim. |
| P5 Privacy §7 | Named active Supabase/Resend transfers | External-provider/agency international processing and unresolved historical-provider locations remain explicit. Existing owner-supplied agency countries preserved. |
| P6 Privacy §7 | Transfer provisions tied to active intake | Existing Hostinger processor basis retained; appropriate safeguards/adequacy for other processing, including historical records; specific coverage requires verification. Agency instruments, UK Addendum, data protection test, US certification limitation and access to copies remain. |
| P7 Privacy §8 | Form-notification enquiry label; performed review wording; asserted 30-day/7-day Resend periods | Email/messaging/retained notification label; documented periods and review duties distinguished from execution; unverifiable provider periods replaced with candid uncertainty; backup protection/restoration-deletion duties preserved. |
| P8 Accessibility §4 | JavaScript form limitation | Native email/WhatsApp alternatives; website JavaScript unnecessary; email alternative when WhatsApp fails; no external-service conformance claim. |

P9 is still omitted: sensitive-data safeguards remain identical to Website Terms. Existing privacy
rights, lawful bases, complaints handling, confidentiality, security, client processing duties and
reasonable-adjustment commitments remain. No full WCAG conformance is claimed.

## 4. Known inconsistency in an otherwise preserved document

**GS-LAUNCH-012-C1 — Consumer Client Terms 3.3, lines 10 and 314:** “WhatsApp or text” conflicts
with F1. Reported before any modification; the document is unchanged. Proposed narrowly scoped
future correction: replace these two labels with “WhatsApp” while retaining the number. That is
not an approved amendment, new version or adoption. Its version/review treatment and fresh exact
fingerprint require separate owner authority. Do not carry the 3.3 adoption onto changed text.
The cancellation-clause example “phone or video call” describes distance-contract situations,
not an offered public telephone action; no unrelated contractual change is proposed.

The other five canonical documents were inspected for contact/legal references and are byte-identical.
C1 means the all-seven legal set is not ready for publication. The normal served company gate
correctly detects the current canonical contradiction; this is retained as a failure, not exempted.
The approved denied direct artifact excludes all legal routes, so it can pass its contact contract
without disguising this separate legal blocker. Internal records and historical adoption documents
are not subjects of the public-artifact withdrawal scan.

## 5. Historical holdings, retention and provider evidence still required

The proposal keeps possible holdings visible without treating “may remain” as an inventory:

1. Identify actual categories/purposes, systems, exports, devices and developer-created backups;
   relevant processor/controller roles, access/custody, current locations, holds and safeguards.
   Do not inspect customer contents unnecessarily or delete anything under this task.
2. Verify current Supabase/Resend/email/Meta/provider-log and backup retention/expiry terms and
   account-specific settings. The old Resend 30-day delivery/7-day backup sentence is not retained
   as a verified period. Provider-managed backups are neither denied nor treated as a tested restore.
3. Confirm application of each retained documented period: enquiries 12 months from receipt/last
   contact; spam 30 days; project/contract and accounting records six years by their stated financial-
   year anchors; rights while relied on plus six years; complaints with project or two years after
   closure; working files within 90 days unless agreed. These periods are a documented schedule,
   not new evidence of deletion or a blanket provider expiry. Historical holdings and provider copies
   require case-specific confirmation. Confirm monthly/quarterly/annual duties and future records
   of execution without turning historical dated receipts into current universal completion.
4. Resolve applicable provider/agency transfer coverage before relevant processing/access. F4
   establishes the website-hosting owner fact only, not all provider countries or legal instruments.
5. Owner-led rights/complaints handling and confidentiality/security duties continue across all
   retained records. No overseas staff location or backup maintenance system has been invented.

The exact proposal is candid about these outstanding facts. Further factual corrections change its
hash and require another exact-text review; current uncertainties are not silently marked settled.
Current public legal context was checked against the
[ICO privacy-information requirements](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-privacy-information-should-we-provide/),
[ICO international-transfer guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/a-guide-to-international-transfers/what-is-an-international-transfer-of-personal-information/)
and [Hostinger DPA](https://www.hostinger.com/legal/dpa). Public guidance does not verify account facts
or certify these texts. Existing R11 contractual coverage is preserved, not reopened.

## 6. Prerequisite logic and permanent tests

`DIRECT-CONTACT-VERIFIED` now uses exactly email and WhatsApp. Both contact HTML files require
the two approved hrefs and the no-form shell. Every direct-artifact HTML file, including errors,
is checked for withdrawn `sms:`/`tel:` actions, SMS/text-message and voice invitations, and relevant
metadata. The company gate shares the same phone/copy predicates. Permanent fixtures reject
correct and wrong SMS numbers, telephone links, mixed-case/single-quoted attributes, SMS metadata,
common text/call invitations and Phone/Telephone-number labels. Missing/wrong approved recipients,
forms anywhere, obsolete intake transport and misleading thank-you/error copy still fail.

Exact full proposal files are committed subjects of the existing legal selftest; it checks direct
parity, legal draft/instrument rules and preserved operational/audit limitations. Mutating each
required direct disclosure or adding the withdrawn channel fails a named assertion. Synthetic
publication receipts remain labelled synthetic and grant no authority.

The unchanged register still defaults to form/legacy mode; no direct receipt has been inserted.
On a separately authorised adoption change, Privacy must explicitly choose `contactMode: direct`,
replace its H4-B publication prerequisite with DIRECT-CONTACT-VERIFIED, and bind the genuinely
obtained owner/operator evidence to exact source and freshly adopted legal bytes. F1–F5 are inputs,
not the completed receipt. Prebuild evidence must cover actual operations and source controls;
final artifact/HTTP/browser/no-JS acceptance is a separate subsequent receipt. Revalidate changed
bytes. Do not fabricate IDs, signatures or final-artifact results before they exist.

H4-B remains mandatory for a future form journey. All-seven publication refusal, Privacy
co-publication, retention evidence, Hostinger processor controls, Cookie A-2 and separate all-seven
PUBLICATION-AUTHORITY and artifact-bound CUTOVER-AUTHORITY remain. Neither current facts nor
future adoption is publication, upload or cutover authority.

## 7. Executed verification matrix

| Executed check | Result | Evidence and practical limit |
|---|---|---|
| Fresh `PUPPETEER_SKIP_DOWNLOAD=true npm ci --no-audit --no-fund` | PASS, exit 0 | Exact unchanged lock; 1,568 packages; Node v24.15.0/npm 11.12.1; no browser download. Install log retained; precise process timestamps were not instrumented. |
| Initial contact/company/legal predicate diagnostics | Company fixture FAIL then fixed; legal/static PASS | A company fixture matched two call rules; separated fixtures, 84 company cases now pass. Initial legal tests were 153, then 165 after full proposal/adverse coverage. Diagnostic output retained where available; exit codes not individually instrumented. |
| `npm run verify:static`, first attempt | FAIL, native exit 3221226505 (`0xC0000409`) | Reached unchanged dependency behaviour test after the other gates; no successful completion. Raw log overwritten by retry; original timestamp/exit/hash receipt retained. Cause not established. |
| `node scripts/check-dependency-overrides.mjs` | PASS, exit 0 | Separate rerun: 19 resolutions plus dependency behaviour tests. Earlier native failure is not reclassified. No dependency source/lock changes. |
| `npm run verify:static`, second and final third attempts | PASS, exit 0 | Full static gate chain; final run includes final contact predicate/fixtures. Unique raw logs and exact command timestamps/hashes retained. |
| Company-fact selftest | PASS, exit 0 | 84 cases, including withdrawn channels and unchanged approved facts. |
| Legal adoption/selftests | PASS, exit 0 | 165 cases including full proposed texts; actual canonical/register check: seven OWNER_ADOPTED, zero PUBLISHABLE. |
| Legal parity selftest | PASS, exit 0 | 39 permanent assertions; no served proposal/adoption claim. |
| Contact/static adverse fixtures | PASS, exit 0 | 45 named direct-contact/error adverse proofs; additional style/data-only negative control passes; existing all-seven, H4-B, cookie/Hostinger, intake, exclusion and error specimens remain. |
| `npm audit --omit=dev --json` | PASS, exit 0 | Zero vulnerabilities in production dependencies; unchanged full-toolchain risk is not accepted by this result. |
| Clean normal `npm run verify:build` | PASS, exit 0 | Started without `.next`; normal build, secret-value/marker checks, token/theme checks and all 69 bundle budgets pass. No A/B measurement. |
| Served normal legal parity | PASS (inside combined command) | Seven canonical documents, 109 clauses and 406 paragraphs match word-for-word. Existing texts only; development CMS read, no write. |
| Served normal company gate | FAIL (combined command exit 1) | One reported issue: unchanged Consumer 3.3 “WhatsApp or text”; C1 deliberately remains unresolved. Other nine questions produce no problem. |
| Production builder without rehearsal | EXPECTED REFUSAL, exit 1 | Nine unmet source/operation/publication inputs: two direct-mode/receipt requirements plus seven legal refusals. No production artifact created. |
| Denied direct static rehearsal | PASS as nondeployable rehearsal, exit 0 | 54 routes, 199 files, 28,690,903 bytes; `sourceModified:true`, `rehearsal:true`, `deployable:false`, `Require all denied`. Not an exact-clean-SHA release or deployment approval. |
| Denied artifact reinspection and company functions | PASS offline, exit 0 | All 198 manifest payload hashes verified; 199 files including identity; 10 company questions across 54 routes; 54 email and 54 WhatsApp link-bearing routes; no telephone metadata. Normal artifact inspector returns exactly LEGAL/all-seven and REHEARSAL refusal, with no contact/other defect. |
| Initial extra offline inspection orchestration | FAIL, exit 1, corrected | Temporary orchestration mistakenly read inline CSS as public text (“placeholder”); corrected to use the existing company gate’s script/style exclusion. No application/gate threshold changed to hide content. Final offline inspection passes. |
| Five independent stage reviews | Complete, source only | Spec voice-copy fixture gap and unrelated Footer-comment deletion corrected/reviewed; content report log-retention wording corrected; accessibility/design found no source issue. Consumer C1 retained. |
| Linux/browser/axe/Lighthouse/hosted acceptance | NOT RUN / PENDING | Previous Docker policy denial not retried. No remote CI, no hosted acceptance, no test enquiry. |

All results are local Windows evidence unless specifically stated. Normal served parity covers the
existing canonical texts, not adoption/hosting of the proposals. No Linux/browser, keyboard,
assistive-technology, axe, Lighthouse, remote CI or Hostinger acceptance is substituted by a source
review, HTTP test or a successful Windows build. Failed/interrupted attempts remain in the receipts.
Surviving raw logs remain in ignored `build/gs-launch-012/` under separate attempt paths.
The first native-exit static-verification raw log was overwritten by the temporary runner retry;
only its original command/exit/timestamp/SHA-256 receipt remains. It cannot reconstruct the lost
output or establish the native failure cause. Earlier same-label contact logs were also overwritten;
this is marked per receipt. The runner now uses unique attempt paths. The original failed status
is retained, and later success does not relabel it.

## 8. Hashes, isolation and local commit

- `docs/_legal/proposed/GS-LAUNCH-012/accessibility-statement-2.4.md` — SHA-256 `774b1e200e67d146b0375b12c3fd4fadb3aeb0e27b87ea53bd0b419557984708`.
- `docs/_legal/proposed/GS-LAUNCH-012/comparison.diff` — SHA-256 `1162b90a98abe18a80f45beb9146deeffb1c089daaa58a87b94bf21be70e0ebf`.
- `docs/_legal/proposed/GS-LAUNCH-012/privacy-policy-2.7.md` — SHA-256 `822dd473c253e7d031e18cf6c439ace13817f270d9fd9e1898d9b8c5fc4549a3`.
- Effective non-document inventory: 367 files; SHA-256 `c671e39e53f91cd289353805d5ca5e01f4018892bca395620886778e33a1135f` (same sorted path/hash definition as GS-LAUNCH-010; changed input rows recorded in evidence).
- All seven canonical files, adoption register, package/lock, browser controls and both workflows are byte-identical to the starting commit; exact hashes in the evidence JSON.
- Denied rehearsal identity: `7ab5a9fb4f703440015e8185e1e89aa41e1e24f87fdfce7c810f9c2d06dfd07a`; `sourceSha:4ac921a17c6a1b32b52bc4a510b2f40c3d27f61a`, `sourceModified:true`. Offline reinspection uses the final contact checker; no mutable working-tree build is presented as exact-SHA acceptance.

The evidence JSON records all seven canonical fingerprints, the unchanged register, package/lock,
workflow/browser controls, changed-file hashes and effective-source aggregate. Preservation uses
exact byte comparisons against the GS-LAUNCH-011 commit. The dirty primary checkout and predecessor
worktree are independently rechecked at closeout; no reset/stash/clean/switch there is authorised.

No self-referential commit hash is invented in this committed report. Resolve the phase commit with
the locator above. Post-commit full SHA and clean porcelain status are recorded in ignored
`build/gs-launch-012/closeout.json` and the final response. Generated output and raw logs are untracked
and never deployment authority.

## 9. Short owner adoption decision package

- Review the complete Privacy 2.7 and Accessibility 2.4 files and exact diff at the hashes above.
  Confirm retained-period applicability and outstanding disclosures; any correction needs new hashes.
- Decide fresh exact-text adoption of those two versions separately. No approval/signature is
  recorded here, and the old canonical adoption covers only the old unchanged texts.
- Separately authorise the two Consumer Terms contact-label corrections and their version/adoption
  treatment. No Consumer text is changed by this phase.
- After authorised canonical replacement, preserve prior versions/adoption evidence, clear superseded
  adoption fields, compute final saved-byte hashes and require fresh exact-text authority. Do not copy
  old signatures/hashes. Regenerate through the existing seed and re-run adoption/parity checks.
- Obtain genuine DIRECT-CONTACT-VERIFIED operational/source evidence, then separate publication and
  final artifact acceptance/cutover authority. Nothing in this package accepts historical-data,
  provider-backup, Linux or hosting evidence that is still missing.

## 10. Remaining release gates and stop

Hostinger's private exact WordPress root/database mapping, temporary-site separation, current writer/
publisher configuration, matched usable file/database backup pair, custody, isolated restore evidence,
upload paths/capacity/root-switch and inverse rollback operation remain UNVERIFIED. Follow
GS-LAUNCH-011 section 5 and GS-LAUNCH-008 section 6 using real private values. A newly confirmed
privacy administrator does not close those backup/restore requirements.

Linux acceptance needs the separately policy-cleared supported environment and authorisation;
the previous Docker rejection was not retried or bypassed. Browser/HTTP/no-JS/keyboard/axe/Lighthouse,
exact-SHA CI, serving-stack A-2 and production-origin repeat remain gates for the changed candidate.
Residual development-toolchain advisories retain their prior unresolved/unsigned disposition;
production audit success does not accept them. Normal SSR M-P1-1 remains its historical failure,
N/A to the authorised file-only launch architecture; no new SSR investigation is started.

No push, workflow dispatch, publication, deployable promotion, upload, production CMS/Supabase/Resend
write, WordPress replacement, DNS/mail setting change or provider action was performed. No historical
data was deleted. **STOP at this local GS-LAUNCH-012 commit. GS-LAUNCH-013 is not started.**
