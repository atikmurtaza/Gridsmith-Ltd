# GS-LAUNCH-007 — Hostinger-first static release

23 October 2026. **Local preparation authorised; publication and cutover remain held.**
Baseline: `ff29969c8d0a3087f95736e1e2d1c6535dc64193` (`codex/gs-launch-006`).
Isolated branch/worktree: `codex/gs-launch-007`,
`C:\Users\atikm\.codex\worktrees\gs-launch-007\Gridsmith Ltd`.
Final verification and artifact bindings are in `GS-LAUNCH-007-EVIDENCE.json` at closeout.

## Architecture and current authority

Next.js 15 generates static HTML, CSS, JavaScript and assets. Sanity is queried at build time.
Hostinger Business PHP/HTML hosting serves the generated files. GitHub retains source; controlled
file upload is the selected production method. No persistent Node process, request-time Next SSR,
Server Actions, image optimiser, Vercel hosting or new hosting service is required by the artifact.
Supabase Edge intake remains separately controlled and inactive in this launch journey.

The owner's GS-LAUNCH-007 directive supersedes the GS-LAUNCH-004–006 requirement for support-led
independent error storage and exhaustive outer-error proofs. Those historical reports, fixtures
and results remain retained. Normal Next SSR M-P1-1 remains **FAIL** for future SSR deployments;
it is **not applicable** to this static deployment. No failed result is relabelled PASS.

## Release-gate matrix

Classification: A required before launch; B may follow launch; C not applicable to static hosting;
D owner decision. A/D means required evidence plus the owner transaction authority.

| Item | Class | Disposition |
|---|---|---|
| Static routes, assets, navigation, SEO, headers, redirects, accessible 404/error | A | Existing exporter and gates retained; local verification below. Actual Hostinger smoke checks belong to the approved transaction. |
| Approved visuals, keyboard, no-JS, reduced motion, responsive and Lighthouse budgets | A | Existing thresholds retained. Static Lighthouse measures files rather than starting Next. Human assistive-technology/physical GPU acceptance is not inferred from automation. |
| Seven legal pages, exact versions and accurate processing notice | A/D | Seven OWNER_ADOPTED; zero PUBLISHABLE. All-seven production refusal retained. See checklist below. |
| Contact | D | Prepared direct email/WhatsApp/SMS launch; no website form, intake endpoint, POST or delivery-success assertion. Privacy accuracy still needs owner disposition. |
| WordPress root, target, current backups/restoration and publisher safety | A/D | Live WordPress is still HTTP 200; private operational preflight and approved backup/cutover remain necessary. |
| Current public DNS/mail baseline | A | Read-only public records captured locally; complete zone/DKIM/config export remains an operator preflight. No DNS or email change is proposed. |
| Production dependency audit | A | Exact unchanged lockfile: zero findings. |
| Build-tool vulnerabilities | D | Seven high affected entries across two active extract-zip advisories; unresolved/unaccepted. Explicit controlled-build residual-risk decision required. |
| Exact-SHA remote CI | A/D | Still UNVERIFIED under existing CI authority. No push/dispatch is authorised. Local Linux results are separate; final approval must name verification/publishing scope and preserve this gate. |
| Hosted/owner visual, accessibility and confidentiality acceptance | A/D | Local proofs do not establish these. Execute scoped smoke checks at cutover; owner acceptance remains recorded separately. |
| Normal Next SSR crash | C | Retain FAIL and test. No Next runtime in Hostinger artifact. |
| Node application entitlement / Vercel configuration | C | Neither belongs to the selected architecture. |
| Independent error store, malformed-root survival, provider 502/503/504 templates | B | Documented limitation, absent evidence of a critical release defect. No support ticket or exhaustive fault programme is required. |
| Live Edge intake, notifications, workers and H4-B activation | B/D | Deferred with forms absent. Do not assert promotion, send test enquiries or activate services. |
| GA4/PostHog, Freelancer reviews, public Path Finder, portfolio proof | B | Disabled/withheld; no optional-feature launch dependency. |
| Three GS-X002 Technical records | B/D | cad-drafting, engineering-drawings, technical-documentation remain excluded; professional scope/PI authorisation still required before publication. |
| Agency access, international transfers, creator rights execution | B/D | Required before the relevant access/work/disclosure, not before a static launch that grants none. Existing agreements/operating duties remain. |

## Implemented changes

The production static profile now selects direct contact in source. Both contact pages keep the
existing email, WhatsApp and SMS helpers, shared layout, response wording and native links. Their
metadata and surrounding copy match the journey. Press's retained thank-you URL explains contact
options rather than claiming receipt. The disposable export excludes the form client graph, all
intake configuration and its CSP permission. Staging's separate Edge-form profile and mocked tests
remain available; supplying any intake URL to the direct production profile is refused.

The seven legal refusals are outside the contact-mode condition. Rehearsals still write only to
`build/production-rehearsal`, include `deployable:false` and `Require all denied`, and waive only
recorded LEGAL/REHEARSAL findings. No environment setting makes this rehearsal deployable.

The existing `public/500.html` is now a self-contained, accessible, truthful static fallback,
without obsolete Vercel placeholders or the false assurance that a message was not lost. Production
rules use ordinary `ErrorDocument 500 /500.html` alongside the existing branded 404. The independent
operator document/package is retained unchanged outside the public artifact. Hostinger also
[documents per-code HTML error pages](https://www.hostinger.com/support/1583295-how-to-customize-your-website-s-error-pages-in-hostinger/).

This same-root fallback covers ordinary origin errors while root configuration remains usable.
The initial local HTTP run also found that `/design` shares a name with a real asset directory:
Apache's default slash redirect returned 301 instead of the exported page. Production now sets
the [standard DirectorySlash directive](https://httpd.apache.org/docs/2.4/mod/mod_dir.html#directoryslash)
to Off while preserving `Options -Indexes -MultiViews`. The HTTP route gate and adverse specimen
cover this correction; directory listings remain disabled. Hosted acceptance is still separate.
The first new browser-error assertion returned a DOM element across Puppeteer's serialization
boundary instead of a boolean; it is corrected to return a boolean. The permanent browser proof
also visits the actual local induced HTTP 500 response, not just its document URL. The initial
failed check is retained separately and is not counted as a pass.
No-JS contact checks use separate browser pages. Chromium's disabled-script preload notifications
are recorded separately from network failures; actual JavaScript-enabled failures and non-script
failures still fail the gate. A direct diagnostic established the script type and absent network
error, and the HTTP gate independently requires the matching public script bytes. The induced
500 subject is required only in the denied rehearsal simulation, not on an ordinary ready artifact.
The new keyboard proof exposed a Next link prefetch of the withheld client-terms sidecar. The
contact page now reuses the existing plain-anchor Link primitive; legal routes remain withheld
and unexpected HTTP errors still fail. This avoids background requests without inventing a legal
page, weakening the artifact refusal or suppressing a browser error.
It cannot rescue a malformed root `.htaccess`, a missing error file, account/server outage or a
provider/CDN-generated 502/503/504. Hostinger outer templates and their accessibility remain
UNVERIFIED. They are limitations, not claimed fixes or automatic static-launch blockers.

Existing artifact/UI/selftests now cover direct contact, leaked endpoints/forms, honest confirmation,
500 semantics/mapping and the unchanged legal refusal. The existing Hostinger HTTP gate gained a
strict loopback production-simulation mode; no second HTTP gate was added. Lighthouse retains its
browser verification and budgets, validates the served static subject, and uses the existing H2
proxy with a file-server upstream for mobile. A local-only Apache specimen is committed under
`gs-launch-007-proof/`; its adaptations never enter the original rehearsal.

## Verification and security

All release checks run in a new labelled, bounded Linux container, without host ports, credentials
or environment files. Fresh `npm ci` uses the unchanged exact lockfile and suppresses Puppeteer's
ordinary ZIP download. Existing independently authenticated Google DEB provisioning supplies Chrome
155; browser identity is enforced separately for Puppeteer and Lighthouse. Tests run as `node`.
Raw commands, UTC times, exits, logs and hashes are retained under ignored `build/gs-launch-007/`.

Initial verified results: clean install, full `verify:static`, normal clean `verify:build`, all 69
route bundle budgets, browser provisioning/check and deliberate production refusal pass their named
questions. The first rehearsal failed with EAGAIN under concurrent browser load; it is retained,
and the bounded-worker rerun is separate. Final static/browser/HTTP/Lighthouse results and exact
artifact identity are added at closeout; no pending check is called PASS here.

Fresh production audit: **0 findings**. Full audit: **7 high**, no critical/moderate/low, from
[GHSA-jmr9-qjv8-65gv](https://github.com/advisories/GHSA-jmr9-qjv8-65gv) and
[GHSA-7pqw-9j4j-h8q3](https://github.com/advisories/GHSA-7pqw-9j4j-h8q3).
These affect extract-zip through Puppeteer/browser tooling and LHCI/Lighthouse; they are build/test
machine archive-extraction risks, not installed server packages on file-only Hostinger. No browser
upload/extraction feature or deployed extract-zip dependency is present. Package absence is assessed
with the artifact/runtime boundaries, not inferred solely from npm's development classification.

The earlier 17-high/three-advisory count is historical. GitHub
[withdrew the braces advisory on 23 October](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
as not practically exploitable. The lockfile was not changed and the package was not fixed here.
The two remaining advisories have no patched version in the checked records. Controlled provisioning,
download suppression, no privileged build credentials, isolated unprivileged execution and reviewed
inputs constrain exposure; arbitrary archive extraction remains outside that controlled path.
No waiver is recorded. Owner risk acceptance must name both active advisories, remaining installer
invocations, these controls, a maintenance owner and review on a fixed upstream release or changed
build/provisioning path. Do not run audit-fix/major upgrades or suppress findings for launch.

## Exact all-seven publication checklist

All current adopted file hashes and the entire legal register remain byte-identical to baseline.
The initial candidate intentionally contains **no public legal page**, including RSC sidecars.
Publication is exclusively all-seven together at gridsmith.uk with the authorised WordPress cutover.

| Slug | Adopted version | Required publication evidence |
|---|---|---|
| privacy | 2.6 | PUBLICATION-AUTHORITY; truthful applicable H4-B-INTAKE-PROMOTED disposition; HOSTINGER-PROCESSOR-CHAIN (existing R11 contractual closeout retained). |
| cookies | 2.4 | PUBLICATION-AUTHORITY; PRIVACY-PUBLISHABLE; A-2-COOKIE-RETEST on exact local serving stack, then production-origin repeat during authorised cutover. |
| terms | 2.3 | PUBLICATION-AUTHORITY and simultaneous PRIVACY-PUBLISHABLE. |
| client-terms | 2.3 | PUBLICATION-AUTHORITY and simultaneous PRIVACY-PUBLISHABLE. |
| business-client-terms | 3.3 | PUBLICATION-AUTHORITY and simultaneous PRIVACY-PUBLISHABLE. |
| consumer-client-terms | 3.3 | PUBLICATION-AUTHORITY and simultaneous PRIVACY-PUBLISHABLE. |
| accessibility | 2.3 | PUBLICATION-AUTHORITY and simultaneous PRIVACY-PUBLISHABLE. |

The current Privacy Policy §§6–7 states Supabase receives website enquiries and Resend sends internal
notifications. Selecting direct contact does not make those statements operationally true. The
owner must confirm the actual email/WhatsApp processing, retention, recipient/transfer arrangements
and whether an authorised legal correction/re-adoption is needed. This task does not draft clauses,
mark H4-B met, alter adopted files or certify legal applicability. Do not solve this by changing
register states or flags. A genuine applicable prerequisite disposition and publication authority
must precede the controlled register/CMS/migration change and final all-seven build.

Existing monthly enquiry/mail/WhatsApp reviews, quarterly working-file/agency reviews and annual
long-term reviews remain operating duties. Do not recertify unverified production automation.
Contractual hosting coverage is already closed; no new Hostinger support response, account,
administrator agreement, ICO payment, PI purchase or new public portfolio proof is requested.

## Deployment and rollback runbook — not executed

Use controlled upload of the approved generated public files, with a private prepared directory
and an explicitly approved root/directory switch. Do not incrementally overwrite live WordPress.
The exact safe switch method depends on the actual account mapping, which is not invented here.
Do not repurpose the temporary-site Git workflow: it targets
`mediumaquamarine-wallaby-594070.hostingersite.com` / relative `public_html`.
Manual CI dispatch calls the publishing workflow; artifact pushes can auto-deploy; historical hPanel
Redeploy re-enabled auto-deployment. A source push is not a harmless test.

1. In a private operator receipt, record the exact gridsmith.uk site identity, canonical WordPress
   root, temporary-site root, current Git/publisher state, chosen upload/switch method and rollback
   window. Confirm distinct destinations and freeze competing publishers only within final authority.
2. Before cutover, preserve current WordPress files (including uploads, hidden files, `.htaccess`
   and `wp-config.php` privately), its matching database, site/CDN configuration and complete zone/mail
   baseline. Store backups outside public roots, hash them and confirm custody/download access.
   Hostinger documents [backup download](https://www.hostinger.com/support/5981435-how-to-download-backups-at-hostinger/)
   and [files+database restoration](https://www.hostinger.com/support/3989447-how-to-restore-a-wordpress-website-from-backups-in-hostinger/).
   Feature documentation is not proof this account has a usable backup. Record an isolated restore
   check if performed; otherwise explicitly record backup available/restoration UNVERIFIED and require
   owner disposition. Do not claim restore-proven. Agree treatment of writes after the snapshot.
3. Resolve the legal/contact decisions, record real prerequisite evidence, authorise all-seven
   publication and the exact resulting CMS changes. Build from a clean approved source with
   `GRIDSMITH_STATIC_PROFILE=production`, **no intake URL**, and no rehearsal flag. Require
   `sourceModified:false`, `deployable:true`, production origin, direct contact, zero artifact
   findings, seven legal pages and all per-file hashes. Validate the exact final bundle before approval
   for upload; the current rehearsal is never a substitute.
4. Upload only generated public files and the reviewed `.htaccess`; verify remote file hashes.
   Never upload source, environment files, ZIP/backups, `node_modules`, `.next`, private receipts,
   adoption register or operator package. Preserve the existing temporary site. Prefer a verified
   root switch; otherwise explicitly authorise same-filesystem directory replacement and its short
   maintenance gap. Do not assume provider file-manager renames are atomic across filesystems.
5. After the authorised switch, check served identity, all public/legal routes, contact links,
   assets/fonts, 404/500 mapping, legacy redirects, sitemap/canonicals/robots, headers and selected
   mobile/desktop keyboard/axe/cookie behavior. Do not inject faults into WordPress or run live forms.
   Any cache purge must be confined to the approved site. No DNS/mail changes are planned.
6. On wrong identity, missing/broken routes/assets/contact, legal mismatch, critical accessibility or
   security failure, stop and restore the recorded old root/configuration. Restore database only if
   necessary under the agreed write window. Recheck the previous WordPress site and mailbox; retain
   both private recovery copies for the approved retention period. Preserve MX/SPF/DKIM/DMARC.

The current WordPress homepage was read-only verified HTTP 200 with WordPress markers; public DNS
records were captured locally. hPanel's signed-in list showed Business and separate WordPress and
temporary sites. Dashboard navigation then timed out, so current absolute roots, backups, upload/root
switch capability and full provider trigger state remain **UNVERIFIED**. No setting was changed.
The historical H4-G temporary artifact `bd8dd825`, identity
`28b841dd974216e42629bbb54c03fe74352156218ca7ee7fb3a35033f996bb89`, is not a production rollback
baseline: it targets the temporary origin and includes then-approved reviews. The production rollback
baseline must be the actual pre-cutover WordPress snapshot, not a deny-all rehearsal or that staging export.

## One consolidated owner approval boundary

No upload approval is being inferred from local completion. The single release transaction must name:

- Exact clean source SHA, final deployable artifact identity/file-manifest hash, destination
  `https://gridsmith.uk`, verified private target/root and controlled upload/switch method.
- All seven exact legal versions, accurate privacy/contact disposition, prerequisite evidence,
  authorised register/CMS publication changes, all-seven co-publication and separate CUTOVER-AUTHORITY.
- Direct email/WhatsApp/SMS contact mode with website forms/intake/notifications still inactive;
  confirmation of the monitored mailbox and messaging number. No test customer enquiry is implied.
- Current WordPress files+database backup IDs/hashes/custody, restoration evidence or explicit residual
  decision, rollback trigger/window and treatment of subsequent writes. Preserve DNS/mail routing.
- Explicit residual decision for the two active extract-zip advisories and the controlled build path.
- Exact-SHA CI scope and publisher safety. Existing CI/publication requirements are not silently waived;
  if a nonpublishing check is required, authorise a concrete safely isolated verification transaction.
- Actual WordPress replacement, scoped post-cutover checks and bounded rollback authority.

**Exact next action:** the owner resolves the privacy/contact applicability and supplies the private
root/backup/switch receipt as part of this one checklist. After genuine legal prerequisites and
publication authority exist, prepare and verify the final all-seven artifact, bind its exact identity
to the release transaction, and request final upload/cutover approval. Approval of today's rehearsal
cannot authorise an unidentified later artifact. No GS-LAUNCH-008 is started automatically.

If a later execution session is used, give it this bounded prompt:

> Continue GS-LAUNCH-007 from its reported implementation SHA and clean worktree. Read
> GS-LAUNCH-007.md and its evidence JSON. Use only the owner's completed release checklist and named
> private target/backup receipt. Confirm actual privacy/contact applicability and all-seven authority;
> do not manufacture evidence or amend adopted clauses. Build and verify the exact final artifact,
> obtain approval binding its identity if it differs from the approved transaction, then perform only
> that controlled Hostinger upload/switch and specified smoke checks/rollback. Preserve the temporary
> site and mail/DNS. No Vercel, support contact, source push, publishing dispatch, live intake or new phase
> unless that exact action is explicitly authorised. Stop on any identity, prerequisite or target mismatch.
