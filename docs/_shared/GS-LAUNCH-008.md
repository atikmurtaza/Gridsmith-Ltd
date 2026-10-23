# GS-LAUNCH-008 — Final owner gate and artifact preparation

24 October 2026 (Europe/London). **PUBLICATION HOLD — NONDEPLOYABLE CANDIDATE.**

Examined source: `462da70d29fe9aec79b68f107c37b6611a1306d0`, `codex/gs-launch-007`.
This phase uses `codex/gs-launch-008` in
`C:\Users\atikm\.codex\worktrees\gs-launch-008\Gridsmith Ltd`.
The phase commit is the commit containing this record; obtain its exact SHA with
`git log -1 --format=%H -- docs/_shared/GS-LAUNCH-008.md`. It is a documentation/evidence
commit, not a newly built application source. Machine-readable results: `GS-LAUNCH-008-EVIDENCE.json`.

## 1. Completed work and verification

Read GS-LAUNCH-007 and its complete evidence object, current handover/status/protocol,
four workstream PROJECT-RULES, all seven canonical legal texts, adoption/publication predicates,
legal launch controls, direct-contact sources and both CI workflows. No existing application,
configuration, dependency, canonical legal, adoption-register or CMS correction was justified for
implementation within the verified work completed here. All remain byte-identical to the starting
commit. Owner changes in the primary checkout and the GS-LAUNCH-007 worktree were not edited.

| Check performed in this phase | Result and limit |
|---|---|
| Retained artifact integrity | PASS: every one of 197 files, 28,739,641 bytes, matches predecessor evidence; 196-entry manifest identity recomputed; deployment JSON separately hashed. |
| Release/proof inputs | PASS: all 31 distinct predecessor input/source/predicate hashes match this checkout. |
| Canonical legal/adoption integrity | PASS: seven adopted SHA-256 values match; seven OWNER_ADOPTED, zero PUBLISHABLE. |
| `node scripts/check-legal-adoption.mjs` | PASS: seven drafts and seven generated documents; register coherent. This does not establish legal accuracy for direct-contact launch. |
| `node scripts/check-legal-adoption.selftest.mjs` | PASS: 125 cases. |
| `node scripts/check-legal-parity.selftest.mjs` | PASS: 39 assertions; offline parity predicates, not served-page parity. |
| `node scripts/check-company-facts.selftest.mjs` | PASS: 82 cases. |
| Production prerequisite predicate on actual register/migration inventory | Seven LEGAL refusals; direct contact does not bypass any. Actual production build not rerun. |
| Existing artifact inspector on retained rehearsal | Only expected LEGAL/REHEARSAL findings; no other artifact finding. Deny-all remains present. No supplied secret-value inventory was available; zero known-secret comparisons, not a credentials certification. |
| Contact HTML links | PASS: approved email/WhatsApp/SMS links on both contact pages, no forms; retained thank-you page links email/WhatsApp without asserting receipt. Embedded RSC script strings were excluded from the HTML-anchor reading after an initial diagnostic falsely included their escaped text. |
| Production lockfile audit | **1 high, exit 1**, newly reported Zod advisory. |
| Full lockfile audit | **10 high, exit 1**, four distinct advisory IDs; details below. |
| `node scripts/check-static.selftest.mjs` | INCOMPLETE, exit 1: earlier assertions including all-seven refusal and 23 direct-contact/error cases executed, then missing `typescript` stopped the aggregate. No aggregate PASS credited. This new worktree has no installed dependency tree. |
| Control-character / scoped diff checks | PASS; repeated on the final documentation snapshot. |
| Fresh Linux install/build/browser/Lighthouse | NOT RUN: automatic approval review rejected creation of `gs-launch-008-check` with “blocked by policy”; no retry or container created by that request. |
| Exact-SHA remote CI / hosted acceptance | UNVERIFIED; no push, dispatch or deployment. |

The nonpublishing path used standard-library Node checks and
`npm audit --package-lock-only --omit=dev --json` / `npm audit --package-lock-only --json`.
Audits used Node 24.15.0/npm 11.12.1 and made registry requests against the unchanged exact lockfile; they did not install packages,
run package lifecycle scripts or audit a freshly installed Linux tree. Raw JSON/logs and the local
inspection script remain under ignored `build/gs-launch-008/`; audit findings are also preserved in
the committed evidence JSON. Prior Linux/browser/Lighthouse passes remain **GS-LAUNCH-007 historical
evidence bound to the unchanged retained bytes**, not reruns or final all-seven acceptance.

Static delivery remains Hostinger PHP/HTML with build-time Sanity content. No request-time Next
server is required. Analytics, Freelancer display/fetch/refresh, public Path Finder, the three
unapproved Technical services and public intake/notifications remain disabled in this launch
journey. Supabase/Resend infrastructure may exist independently; source does not prove its current
remote state or that operators never copy a direct message into another system.

## 2. Legal/contact review and proposed corrections

**Proposals only. Nothing below edits, re-adopts or publishes a canonical instrument.**
The owner's request authorises this proposed old/new wording; it does not supply missing operating
facts or adopt the result. Only Privacy and Accessibility require clear processing-mode corrections.
The optional Website Terms clarification is identified separately. Do not re-adopt the other
documents unnecessarily; all seven still need publication authority.

### Exact adopted baseline

| Public slug | Version | Adopted source SHA-256 |
|---|---|---|
| privacy | 2.6 | `4c13c19eda616d2e646f90740f71fa7904da62914af8f48b0e2daabb53ef50a7` |
| cookies | 2.4 | `e853438e4acb65f953ea58575681c94bd0dc0908359b091190891fe3a8a0e960` |
| terms | 2.3 | `e63d8cd2d30938481d2219ec632f49d3c9f8df75ec287a28fa9fe079b274482a` |
| client-terms | 2.3 | `008c05806aad6045272e4438531b9247f8b4d05b4d9b4295196a0282de0c8a87` |
| business-client-terms | 3.3 | `89f63c91642267a3ffc31d2f33ba3cbca3d383da434c007739cc1ba9f9c275c6` |
| consumer-client-terms | 3.3 | `9ac629b3578d09e035b547a6fae705fbe2eb70ec55a3fda8036b4b631eaba01e` |
| accessibility | 2.3 | `daf5b37115391e915384bf16aec81d944e7997154b5b8a9dfdb9fb3bea9056bb` |

### Proposed exact substitutions

P1 — Privacy §2, final collection bullet.

- Old: “technical request information, such as IP address and browser details, processed by our website and form providers, and submission references used to prevent duplicates and maintain security.”
- Proposed: “technical request information, such as IP address and browser details, processed by our hosting and content providers for delivery and security.”
- Effect: removes inactive form-provider and submission-reference collection. Keep relevant request/log disclosure; static hosting does not mean no personal-data processing.

P2 — Privacy §2, database sentence.

- Old: “Our enquiry database does not store your IP address or browser details, but provider logs may do so.”
- Proposed: “The public website has no enquiry form. Contact links let you send an email, WhatsApp message or text message through your chosen service. We do not send those messages to a website enquiry database or use automated website enquiry notifications.”
- Effect: corrects the implied live database journey. The final sentence needs owner confirmation that actual operator handling follows it; if messages are manually copied into a database, describe that actual processing instead.

P3 — Privacy §6, the two Supabase/Resend bullets, replaced together.

- Old: “**Supabase** receives website enquiries and stores them in our database in Ireland. Its service also processes request logs and backups.” and “**Resend** sends internal enquiry notifications to us containing contact details, the service requested and a reference, without the enquiry message or other answers.”
- Proposed: “**Email and messaging services** process the messages you choose to send us. Hostinger handles our email; WhatsApp (Meta) and mobile network providers handle messages sent through their services. The public website does not send enquiries to Supabase or use Resend notifications.”
- Effect: removes two false current recipient assertions while retaining direct-message recipients. Identify any retained historical Supabase/Resend personal data separately before removing their applicable disclosure. Do not imply erasure from source inspection.

P4 — Privacy §7, first paragraph, first two sentences.

- Old: “Our website is hosted in France and enquiries are stored in Ireland. Both countries are covered by UK adequacy arrangements.”
- Proposed, **only if current hosting location is confirmed**: “Our website is hosted in France, which is covered by UK adequacy arrangements. Enquiries sent through our contact links are handled by our email and messaging providers.”
- Effect: removes the inactive Ireland enquiry-store claim. France is a prior statement, not verified current account evidence. If France cannot be confirmed, settle the actual hosting location and matching wording before adoption; do not guess a substitute country.

P5 — Privacy §7, first paragraph, next sentence.

- Old: “Providers and delivery agencies can also process or access information elsewhere: Supabase is based in Singapore and uses international sub-processors, Resend processes notifications in the United States, and hosting and content-delivery networks operate internationally.”
- Proposed: “Our hosting, content and messaging providers and delivery agencies may also process or permit access to personal data in other countries.”
- Effect: removes inactive intake/notification transfers. This general sentence cannot replace disclosure of actual applicable countries/safeguards; the owner must confirm current email, Meta/mobile, content-delivery and authorised overseas access arrangements. The following agency-country sentence remains subject to actual operations.

P6 — Privacy §7, second paragraph, provider-arrangements sentence.

- Old: “Provider arrangements include the UK Addendum to EU standard contractual clauses for Supabase and the transfer provisions in Resend's and Hostinger's data-processing terms.”
- Proposed: “The applicable transfer provisions in Hostinger's data-processing terms cover its services. Transfers involving other recipients require the applicable adequacy coverage or appropriate safeguards before the transfer or overseas access begins.”
- Effect: removes reliance on inactive providers' terms. Existing R11 hosting contractual closeout is retained; this is not a demand for a new Hostinger account or agreement. Actual messaging and other provider roles/transfer routes still require confirmation; a general promise does not prove execution.

P7 — Privacy §8, enquiry-row label and final provider paragraph.

- Old row label: “Enquiries that do not become projects, including internal notification emails”. Proposed label: “Enquiries that do not become projects, including email and messaging correspondence”. Retain “12 months from receipt or last contact, whichever is later” only on confirmation of the actual routine.
- Old sentence: “Resend keeps notification and delivery records for 30 days, with backups for up to seven days.” Proposed: **delete this sentence if no retained Resend personal data remains relevant**; keep the surrounding general provider-log/backup and restoration/deletion wording. If such records remain, replace it with verified historical-data handling and actual expiry facts before adoption.
- Effect: aligns the records in scope and avoids an inapplicable provider-retention promise. Do not delete remaining evidence or change retention duties here.

P8 — Accessibility §4, enquiry-form paragraph.

- Old: “Our enquiry forms need JavaScript to send an enquiry. If you cannot use them, email contact@gridsmith.uk instead and we will treat your email in the same way.”
- Proposed: “Contact us by email at contact@gridsmith.uk, or through the WhatsApp and text-message links on our contact pages. The website does not use enquiry forms. Email remains available if a messaging service is unavailable or inaccessible.”
- Effect: describes the actual native-link alternative; does not claim email-client or WhatsApp accessibility has been certified. Preserve the statement's honest limits on assistive-technology testing and all reasonable-adjustment commitments.

P9 — Optional clarity only, Website Terms §6 and Privacy §2 sensitive-data paragraph.

- Old fragment in both: “through website enquiries or linked files”. Proposed: “in enquiries sent to us or in linked files”.
- Effect: broadens the same caution clearly to email/messages; the old phrase can already include an enquiry originating from a contact link. No change to contract formation or lawful-condition safeguards is needed. If omitted, do not reopen Website Terms adoption solely for this phrase.

### Statements reviewed and retained / factual conditions

| Instrument and provisions | Assessment for this launch |
|---|---|
| Privacy §§1–4 | Controller/enquiry/project purposes and lawful bases remain relevant to direct messages. §2A restricted Freelancer copy and §4 review-copy basis depend on continued private holdings; owner must confirm holdings, not infer deletion from hidden UI. P1–P3 remove live-intake implications. |
| Privacy §§4–5, 10–11 | Analytics and consent-evidence bases are expressly conditional; GA4/PostHog/AI analytics explicitly inactive/future. Marketing explicitly inactive; no solely automated significant decisions claimed. Retain unless actual operations differ. Planned future processing is not activation authority. |
| Privacy §6 | Hostinger website/email and Sanity content roles remain relevant. Sanity fetches at build time; external content/image requests, if present, remain covered conditionally. Payment providers, HSBC, accountant and agencies describe wider business operations, not an embedded checkout. Prior owner facts are recorded in OWNER-FACTS.md; actual recipients/access still need operational confirmation. Retain Meta/mobile disclosure. |
| Privacy §§7–9, 13 | Remaining international safeguards, review cadences, access/security measures and complaints handling are operating duties, not functions proved by a static artifact. Verify actual retention/rights operator and overseas access; do not claim production automation from Preview tests. |
| Cookie §§1–3 | One `gs_consent` acknowledgement cookie, set on Got it, up to 365 days; notice reopening, browser deletion/blocking, no tracking storage/sign-in/checkout. Source matches `lib/consent/state.ts`; exact-stack A-2 and production-origin repeat remain required, including provider/CDN cookies and any surviving WordPress cookies. |
| Cookie §§4–5 | Future consent/withdrawal is explicitly future; no current preference centre or analytics asserted. External social/Freelancer links are links, no feeds; public reviews hidden; Sanity disclosure conditional. No correction established. |
| Website Terms 2.3 | §6 enquiry/no-contract and sensitive-data safeguards work for direct messages; §7 external links and §11 notice cross-references remain valid only with all-seven co-publication. No other processing-mode correction. |
| Client Terms Applicability 2.3 | Email enquiry and saveable terms; no live-form/provider dependency. No correction. |
| Business Terms 3.3 | §§1/20 written email acceptance/notices, §§7/10/11 retention/confidentiality/processor duties and §§21/23 agency/sub-processor/transfer controls are contract-operating obligations. No Supabase/Resend/cookie/analytics dependency. Do not remove safeguards because intake is absent. |
| Consumer Terms 3.3 | §§3/6 email quotation/confirmation/cancellation, §§2/9/13/14 agency/confidentiality/AI rights, §19 privacy/no-marketing and §§21–22 contact/cancellation form remain applicable. No form endpoint or analytics dependency. No correction. |
| Accessibility 2.3 | P8 needed; other measures/limits/adjustment commitments remain. No universal WCAG-conformance claim added. |

The [regulator's privacy-information guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-privacy-information-should-we-provide/)
requires applicable purposes, recipients, retention and transfers to be explained. It does not
validate the supplied business facts or these proposed clauses; its page also notes ongoing guidance
review. The implications above concern alignment with actual processing, not a new legal certification.

### Publication control that must follow genuine approval

Current `REQUIRED_PREREQUISITES.privacy` still requires `H4-B-INTAKE-PROMOTED`, with a register
description of live form collection. It is unmet and **must not be marked met** for direct contact.
After owner-approved accurate replacement text and factual confirmation, explicitly supersede that
premise with a direct-contact processing prerequisite, retaining the historical H4-B requirement for
any later form activation. The future change must reach `legal-adoption-rules.mjs`, each affected
selftest/fixture, the register, legal launch checklist and relevant production migration inventory;
locate all callers before editing. Keep independent all-seven, PRIVACY-PUBLISHABLE,
HOSTINGER-PROCESSOR-CHAIN, A-2 and separate cutover authority checks. This phase changes none of them.

Any changed canonical text needs a new version and text-bound adoption; then record genuine
publication evidence and authorised CMS migration/parity, not merely new register flags. No live
Supabase promotion is required to make direct contact work, and activating it to satisfy old prose
would contradict this launch scope. The shortest path is the approved legal/control correction.

### Verified contact values and unverified owner facts

Source authority: `scripts/company-facts-rules.mjs`, company seed, legal OWNER-FACTS, and the
shared link helpers. Retained rendered contact HTML agrees:

- Email: `contact@gridsmith.uk`, `mailto:contact@gridsmith.uk`.
- Display number: `+44 7405 448534`; WhatsApp `https://wa.me/447405448534`;
  SMS `sms:+447405448534`. No voice-call invitation.
- Response wording: “We aim to respond as soon as practicable.”

Owner confirmation still needed: who currently monitors the mailbox/number, continuing control and
WhatsApp/SMS access, forwarding/linked devices and any overseas operator access, actual handling of
messages and attachments, retained test/legacy/provider data, recipients and transfers, log/backup
periods, and who performs the stated monthly/quarterly/annual deletion reviews and rights handling.
Source proves neither delivery nor monitoring. No message, test enquiry or mailbox read was sent.

## 3. Hostinger operational evidence and one private operator receipt

Current authenticated read-only observation: hPanel Websites lists Business, `gridsmith.uk` with
WP Admin, and the distinct `mediumaquamarine-wallaby-594070.hostingersite.com` temporary site.
The attempted `gridsmith.uk` Dashboard navigation timed out before dispatch. No host setting,
backup, WordPress content, root or publisher was changed. An older session's tab was unavailable;
a separate tab was used for the listing. No credentials were requested or read.

**Not established currently:** absolute WordPress/database/temporary roots; applicable backup IDs,
download custody and restoration; Git/automatic deployment state; external publishers/schedulers;
SSH/SFTP capability/host key; document-root remapping or directory-rename permissions. The 23 October
public HTTP 200/WordPress observation and earlier root/auto-deploy observations remain historical.
Neither a site listing nor official capability documentation closes these gaps.

The owner/operator's next action is one **private gridsmith.uk receipt** from the dashboard:

1. Record the selected site/domain, canonical current document root and matching database identity,
   distinct temporary-site root, and current files/database backup dates/IDs. Inspect `wp-config.php`
   privately only as needed to identify its database; do not paste credentials or unrelated account data.
2. Record Git repository/branch, auto-deployment setting, scheduled jobs and relevant external
   upload/API/SSH publishers for these two destinations. State how competing writers will be frozen
   within approved cutover authority. Do not press Redeploy or toggle anything in this read-only step.
3. Confirm one upload/root-replacement mechanism, exact paths and permissions: preferably existing
   SFTP/SSH with a verified host key and same-filesystem sibling-directory replacement, **only if
   available**. Otherwise name the actual supported hPanel upload/switch operation and its inverse.
   Do not call a two-rename operation atomic or infer a document-root selector exists.
4. Record backup custody, a proposed isolated restore target/test, rollback window, post-snapshot
   WordPress-write treatment and proposed site-only cache purge. Include config and full DNS/mail
   baseline custody; no DNS/email modification is planned.

Do not send a support ticket, revisit SSR or inspect Vercel. If this dashboard cannot be reached,
the owner supplies this single receipt; no further provider research programme is needed.

## 4. Security and CI disposition

Lockfile SHA-256 remains `2849a09efab03621d8547e1564794b9bd0deaab139028796ffdae0d51a9eaa8c`.
Current registry answers supersede the earlier production-zero/full-seven assessment **for today's
audit**, without retroactively invalidating its dated receipt. Four distinct advisories are reported:

| Advisory | Exact locked subjects / boundary |
|---|---|
| [GHSA-jmr9-qjv8-65gv](https://github.com/advisories/GHSA-jmr9-qjv8-65gv) | `extract-zip@2.0.1`; outward symlink/path traversal; Puppeteer and LHCI/Lighthouse browser tooling. Upstream lists no patched extract-zip version. |
| [GHSA-7pqw-9j4j-h8q3](https://github.com/advisories/GHSA-7pqw-9j4j-h8q3) | Same extractor; arbitrary writes through symlink archive entries. Upstream lists no patched extract-zip version. |
| [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) | Production `zod@4.4.3`; nested toolchain `zod@3.25.76`; constrained-collection memory exhaustion. Advisory lists 4.6.6 fixed; current direct range permits a compatible update, while the nested v3 caller requires separate compatibility assessment. No fix tested/applied. |
| [GHSA-27r3-jxmh-p828](https://github.com/advisories/GHSA-27r3-jxmh-p828) | Development `body-parser@1.20.8`; compressed-body denial of service. Advisory lists 1.20.9/2.4.0 fixed. No fix tested/applied. |

Production audit: Zod only, one high. Full audit: ten high **affected package entries**, not ten
independent vulnerabilities: `@lhci/cli`, `@lhci/utils`, `@puppeteer/browsers`, `body-parser`,
`chromium-bidi`, `extract-zip`, `lighthouse`, `puppeteer`, `puppeteer-core`, `zod`.
The reported major Puppeteer upgrade/LHCI downgrade is not an approved remedy; no audit-fix,
suppression, blanket override or dependency change was made. The withdrawn braces finding remains
historical, not fixed here. The newly returned findings need an explicit disposition too.

Hostinger receives generated static files, not `node_modules` or a Node API. There is no deployed
ZIP extractor, body-parser server or public form validation endpoint in this candidate. This limits
the server exposure; it is not a claim of universal nonreachability of all JavaScript dependencies.
The artifact inspector found no unexpected runtime transport; Zod handling in any later runtime,
Edge intake, tool or changed client input path requires reassessment before use. Do not transfer a
static-only acceptance to live intake or SSR.

Retained controls: pinned source/lock, `PUPPETEER_SKIP_DOWNLOAD=true` before relevant installs,
independently signed/index/hash-verified Google DEB and bounded extraction, explicit identity-checked
Puppeteer executable and independent Lighthouse `CHROME_PATH`, no privileged build credentials,
reviewed inputs and unprivileged bounded Linux build. Explicit browser-install APIs can still invoke
the vulnerable ZIP path; arbitrary archives and unreviewed package scripts remain outside approval.
That controlled environment was proved in GS-LAUNCH-007, not re-executed here.

**Proposed residual decision, PENDING:** “I accept the two named extract-zip advisories only for
the reviewed, isolated static build/test path with the above controls. I also explicitly [accept
for this static-only release / require compatible remediation and re-verification of] the named
Zod and body-parser findings. No acceptance covers public intake, SSR, arbitrary archives or
privileged builds. Maintenance owner: ___; review date: ___; reassess immediately on an upstream
fix or changed archive, dependency, build, input or hosting path.” A decision selecting remediation
must be implemented and tested before release; no waiver is recorded by this draft.

CI source inspection confirms `ci.yml` verifies pushes on all branches; opened/reopened PRs also
verify. Manual `workflow_dispatch` can invoke `hostinger-staging.yml` after verification. Its build
uploads an Actions artifact, then its write-enabled publish job commits/pushes generated files to
`codex/gs-hostinger-artifact`, targeting the temporary origin and its Production intake configuration.
That staging profile is not the direct-contact gridsmith.uk production profile. Do not use it as
the production uploader. `persist-credentials:false` and read-only verify permissions constrain CI;
they do not prove GitHub App or Hostinger trigger safety. Historical Redeploy behavior re-enabled
auto-deployment. Current provider coupling remains UNVERIFIED.

The local commands above have no publisher invocation. They do not satisfy exact-SHA Linux CI.
Keep that gate open: supply a verified nonpublishing exact-source verification disposition before
any later push/dispatch. No bypass, silent substitution of local checks or new remote workflow is
authorised here. No Vercel access was used.

## 5. Candidate identity and final build boundary

**No deployable artifact exists for GS-LAUNCH-008.** Final source/artifact approval slots below
must remain empty until genuine legal prerequisites and verification complete.

Retained **nondeployable** candidate, rehashed in this phase:

- Artifact/196-file manifest identity: `e8ca42a47d95e8c22727712d03aeb923a349ef5bc66b6bc7c5a87722ad3342d4`.
- Original build source: `7d8f820b68fa64eb6a3d6aec13182debf3e15ef7`, `sourceModified:false`.
- `__deployment.json` SHA-256: `2ca6ef70407628ec8349ebe6d58fe713f539b0fb52a877d1068239190f1a06f7`.
- Production origin `https://gridsmith.uk`; production dataset; `contactMode:direct`; `intakeOrigin:null`.
- `rehearsal:true`, **`deployable:false`**, original `.htaccess` contains `Require all denied`.
- 54 eligible routes; **zero public legal pages**; 197 total files, 28,739,641 bytes.
- Location: `C:\Users\atikm\.codex\worktrees\gs-launch-007\Gridsmith Ltd\build\gs-launch-007\final\artifact`.

Never upload or promote this directory, remove its deny rule, edit its identity flags, or reuse
its local serving simulation as a production artifact. No replacement ZIP/archive was created.

After approved factual/legal corrections, their adoption and genuine publication prerequisites,
authorised register/CMS/migration parity, security disposition and verification access:

1. Commit the exact final source; require a clean worktree/index and current approved CMS revisions.
   Use the existing controlled Linux build/browser path, not the primary checkout's older dependencies.
2. Set `GRIDSMITH_STATIC_PROFILE=production`; leave `GRIDSMITH_PRODUCTION_REHEARSAL`,
   `NEXT_PUBLIC_LEAD_INTAKE_URL`, staging-origin and legal-preview overrides **unset**.
   Run `npm run verify:static`, a clean normal `npm run verify:build`, then `npm run build:static`.
   The existing builder must produce `out/` without waived findings. Do not edit output afterward.
3. Require `deployable:true`, `rehearsal:false`, `sourceModified:false`, exact source SHA/origin,
   direct contact/no intake, all seven approved legal pages and sidecars, no private material,
   endpoints or credentials, exact CMS/source parity and unchanged exclusions/budgets.
4. Validate this exact bundle with existing artifact, Apache HTTP, browser, keyboard/no-JS/reduced
   motion/axe/contrast and desktop/mobile Lighthouse gates, including legal routes. The predecessor's
   rehearsal-only legal omission is not available. Repeat A-2 on this exact serving stack.
   Keep any simulation adaptation private and separately recorded; production bytes remain untouched.
5. Recompute every public file hash and identity; record complete manifest hash and a full upload
   package SHA-256 if packaging is used. Bind the successful verification and exact-source CI
   disposition to those bytes. CMS drift or any changed byte requires re-identification/reapproval.
6. Fill and sign the single final release record below. Only then may upload/cutover execute.

## 6. Controlled backup, deployment and rollback procedure — NOT EXECUTED

This is an executable operator procedure **once its real paths, capabilities and authority are
filled from the private receipt**. No currently verified absolute destination exists, so no remote
command can be responsibly pre-addressed today. If SSH/sibling renames are unavailable, stop and
replace this mechanism in the release record with the verified hPanel operation and inverse before
approval; do not improvise in production.

Hostinger currently documents [files/database backup downloads](https://www.hostinger.com/support/5981435-how-to-download-backups-at-hostinger/)
and [WordPress files/database restoration](https://support.hostinger.com/en/articles/4283700-how-to-restore-backups-at-hostinger).
These explain available procedures, not this account's actual backups. Preserve complete WordPress
files, hidden files, uploads, matching database and configuration; confirm backup contents rather
than assuming a provider archive includes all core files. Keep backups outside every public root,
encrypted with restricted custody; never commit them or include them in the static upload.

**Before backup:** obtain separate explicit authority to create/download backups and perform an
isolated restore test. The current task grants neither. Record IDs, snapshot time, file/database
hashes, custody and successful restore evidence. If restoration remains untested, record
`UNVERIFIED_NOT_RESTORE_PROVEN` and an explicit owner residual decision; do not invent a PASS.
Agree a WordPress write freeze or reconciliation window before the matching snapshot.

Example commands for the confirmed existing SSH route; set each GS variable privately from the
approved receipt. `GS_DB_CNF` is an existing mode-600 client option file outside public roots;
never put database passwords on the command line. Commands are not executed by this record.

```sh
set -eu
umask 077
: "${GS_LIVE:?verified absolute current WordPress root}"
: "${GS_PRIVATE:?verified private backup directory outside public roots}"
: "${GS_DB_CNF:?private database client option file}"
: "${GS_DB_NAME:?matching WordPress database}"
test -d "$GS_LIVE" && test ! -L "$GS_LIVE"
test -f "$GS_LIVE/wp-config.php" && test -f "$GS_LIVE/index.php"
test -d "$GS_PRIVATE" && test -f "$GS_DB_CNF"
test "$(stat -c %a "$GS_PRIVATE")" = 700
test "$(realpath "$GS_LIVE")" = "$GS_LIVE"
test "$(realpath "$GS_PRIVATE")" = "$GS_PRIVATE"
case "$GS_PRIVATE/" in "$GS_LIVE/"*) exit 1;; esac
test "$(stat -c %a "$GS_DB_CNF")" = 600
test ! -e "$GS_PRIVATE/wordpress-files.tar"
test ! -e "$GS_PRIVATE/wordpress-database.sql"
tar -C "$GS_LIVE" -cpf "$GS_PRIVATE/wordpress-files.tar" .
mysqldump --defaults-extra-file="$GS_DB_CNF" --single-transaction \
  --routines --triggers --events --hex-blob "$GS_DB_NAME" \
  > "$GS_PRIVATE/wordpress-database.sql"
test -s "$GS_PRIVATE/wordpress-files.tar"
test -s "$GS_PRIVATE/wordpress-database.sql"
sha256sum "$GS_PRIVATE/wordpress-files.tar" "$GS_PRIVATE/wordpress-database.sql" \
  > "$GS_PRIVATE/backup.sha256"
sha256sum -c "$GS_PRIVATE/backup.sha256"
```

First confirm table engines/snapshot consistency, sufficient disk space and actual dump privileges;
if those options are unavailable, select the provider's matched files/database backup procedure
before approval, not a partial dump. A failed export is not a usable backup. Encrypt/download under
the approved custody procedure. Restore into an isolated, nonpublic target with outgoing mail,
webhooks and scheduled jobs disabled; verify core files/database/uploads and expected pages without
customer-data disclosure, then record target/receipt and authorised test cleanup. Never rehearse a
restore on the live WordPress root or database.

**Upload, after final transaction approval only:** use existing SFTP/SSH with verified host key to
transfer only the exact generated public files to `GS_NEW`, a new private/unserved sibling directory.
Do not upload an archive/source tree to a public root. Compare exact path set and per-file SHA-256,
including hidden `.htaccess` and `__deployment.json`, against the approved local manifest using a
private SHA256SUMS file. Do not omit dotfiles or merge with old WordPress. Require no extra PHP,
environment/source/backup/credential files. Preserve the temporary site. No DNS/email change.

**Switch:** the approved record names `GS_LIVE`, `GS_NEW` and absent `GS_OLD`, confirms common
parent/filesystem, non-symlink directories, publisher/write freeze and the short two-rename
maintenance gap. Recheck exact paths immediately before execution. Example core operation:

```sh
set -eu
: "${GS_LIVE:?approved live root}" "${GS_NEW:?verified candidate root}" "${GS_OLD:?approved rollback root}"
test -d "$GS_LIVE" && test -d "$GS_NEW" && test ! -e "$GS_OLD" && test ! -L "$GS_OLD"
test ! -L "$GS_LIVE" && test ! -L "$GS_NEW"
test "$(realpath "$GS_LIVE")" = "$GS_LIVE"
test "$(realpath "$GS_NEW")" = "$GS_NEW"
test "$(dirname "$GS_LIVE")" = "$(dirname "$GS_NEW")"
test "$(dirname "$GS_LIVE")" = "$(dirname "$GS_OLD")"
test "$(stat -c %d "$GS_LIVE")" = "$(stat -c %d "$GS_NEW")"
mv -T -- "$GS_LIVE" "$GS_OLD"
if ! mv -T -- "$GS_NEW" "$GS_LIVE"; then
  mv -T -- "$GS_OLD" "$GS_LIVE"
  exit 1
fi
```

No delete, recursive cleanup, DNS or database write occurs in this switch. The site must be
confirmed to use this directory mapping; filesystem success alone is not release success.
If the first rename succeeds and a session is lost, restore `GS_OLD` to the verified live name
under the approved rollback authority; retain the candidate separately. Record each operation.

**Smoke/acceptance:** inspect served identity and hashes, all public routes and all seven exact
legal pages/versions, correct canonicals/sitemap/robots and legacy redirects, fonts/assets/cache,
security headers, direct contact, selected phone/desktop keyboard/no-JS/axe and cookie state before
and after acknowledgement. Retest with a browser carrying former WordPress cookies as well as a
clean profile; do not clear visitors' data or change scope silently. Check ordinary 404 and the
approved 500 mapping plus `/500.html`; do not induce production faults or submit enquiries.
Purge only this site's cache if approved. Record hosted/device/assistive-technology limits honestly.
The prior temporary-domain header/robots exceptions do not transfer to gridsmith.uk.

**Rollback:** wrong identity/hash/origin, missing/broken routes/assets/contact/legal pages,
unapproved processing or a critical accessibility/security failure triggers immediate rollback
under the bounded authority. Move the failed static root to a separately approved absent sibling,
then move `GS_OLD` back to `GS_LIVE`; use the same guarded path/filesystem checks and recover the
first move if the second fails. Keep the matching WordPress database untouched when restoring its
intact root. If database restoration is actually required, obtain/execute the named matched backup
restore under the agreed write-loss/reconciliation authority; provider restore replaces current
state and must not erase unaccounted post-snapshot writes. Verify old WordPress pages/assets and
mail configuration/access, record hashes/status and retain both copies for the approved window.
MX/SPF/DKIM/DMARC and email service remain unchanged.

## 7. One short owner checklist and final release record

Use one record, completed in sequence. Initial factual/correction approval permits preparation
only. **Final signature comes after the identified all-seven artifact and verification exist.**
It cannot approve today's rehearsal or an unidentified future build.

- [ ] **Contact and legal:** confirm current mailbox/WhatsApp/SMS operation, recipients/transfers,
  retention operator and legacy data; resolve P1–P8 (P9 optional); authorise the exact resulting
  text/version/hash adoption and evidence-based direct-contact prerequisite correction. Then record
  all-seven publication approval, with no form/analytics/review/Technical activation implied.
- [ ] **Hostinger receipt:** supply the private exact target/root/database/publisher/upload/switch
  receipt; separately authorise matched backup and isolated restore preparation. Record real backup
  IDs/hashes/custody, restoration result or explicit residual decision, rollback window/write policy.
- [ ] **Security and verification:** decide the two extract-zip risks **and** current Zod/body-parser
  findings; name maintenance owner/review. Resolve exact-source CI and publisher safety without a
  publishing dispatch/push until safe and separately authorised. Local checks alone do not close CI.
- [ ] **Final transaction:** after all prerequisites and final bundle checks, approve the complete
  exact tuple below, including bounded post-cutover checks and rollback. No automatic next phase.

### Release record — NOT APPROVED / NOT EXECUTABLE

| Required field | Current value / completion requirement |
|---|---|
| Final clean build source commit | **PENDING**; examined source is 462da70d29fe9aec79b68f107c37b6611a1306d0, not approval of a later build. |
| Deployable artifact identity + manifest + upload-package hash | **NONE**; fill exact successful nonrehearsal build values. The e8ca42a… rehearsal is ineligible. |
| Destination and transfer | `https://gridsmith.uk`; private site ID/canonical root/SSH or hPanel method, host-key identity and exact switch/inverse **PENDING**. |
| Seven publication approvals | Privacy, Cookies, Website Terms, Client Terms Applicability, Business Terms, Consumer Terms, Accessibility: **all PENDING**. Attach each final version/full source SHA-256 and served-parity receipt; separately identify any re-adoption. |
| Contact-processing confirmation | **PENDING**, factual items above; direct email/WhatsApp/SMS only, forms/intake/notifications inactive. |
| Backup/restoration | **NO VERIFIED IDs**; files/database IDs/hashes/time/custody and restore result/residual decision **PENDING**. |
| Residual security | **NOT ACCEPTED**; name all four current advisory IDs, scope, controls, decision, maintenance owner and review trigger/date. |
| Exact-source CI / publisher safety | **UNVERIFIED**; bind the actual verification result and safe publisher disposition; no implicit waiver. |
| Rollback | §6, confirmed exact paths/inverse, approved window, triggers and WordPress-write treatment **PENDING**. |
| Explicit cutover authority | **ABSENT**. Final owner/date: ___; “I authorise upload of only the exact artifact identified above to only the verified destination, the named WordPress root replacement, scoped checks and bounded rollback. No DNS/email/intake/analytics/review/Technical activation.” |

Remaining blockers are the concrete empty fields in this record: truthful approved legal/contact
processing, current private operational/backup evidence, current security disposition, exact-source
verification/publisher safety, and approval binding the final deployable bytes. No Hostinger support,
Vercel, new infrastructure or further SSR investigation is proposed. Stop here; no publication,
upload, WordPress/DNS/email change, push, workflow dispatch or next phase is authorised.
