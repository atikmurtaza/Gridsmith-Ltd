# GS-LAUNCH-007 — Hostinger-first static release

23 October 2026. **Local preparation authorised; publication and cutover remain held.**
Baseline: `ff29969c8d0a3087f95736e1e2d1c6535dc64193` (`codex/gs-launch-006`).
Isolated branch/worktree: `codex/gs-launch-007`,
`C:\Users\atikm\.codex\worktrees\gs-launch-007\Gridsmith Ltd`.
Final verification and artifact bindings are in `GS-LAUNCH-007-EVIDENCE.json`.

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
| WordPress root, target, current backups/restoration and publisher safety | A/D | Read-only WordPress homepage returned HTTP 200 at 17:33 UTC on 23 October; private operational preflight and approved backup/cutover remain necessary. |
| Current public DNS/mail baseline | A | Read-only public records captured locally; complete zone/DKIM/config export remains an operator preflight. No DNS or email change is proposed. |
| Production dependency audit | A | Exact unchanged lockfile: zero findings. |
| Build-tool vulnerabilities | D | Seven high affected entries across two active extract-zip advisories; unresolved/unaccepted. Explicit controlled-build residual-risk decision required. |
| Exact-SHA remote CI | A/D | Still UNVERIFIED under existing CI authority. No push/dispatch is authorised. Local Linux results are separate; final approval must name verification/publishing scope and preserve this gate. |
| Hosted release acceptance | A/D | Existing design approvals are retained. Local proofs do not establish hosted/device/assistive-technology/confidentiality acceptance. Execute scoped smoke checks at cutover and record owner release acceptance separately. |
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
Artifact scans found no forbidden runtime transport, Preview intake endpoint, privileged-key/JWT
marker, source map or private legal-register material. The isolated build loaded no privileged
credentials, so `knownSecretValuesChecked:0` is reported accurately; marker/source checks are not
represented as comparison against an unavailable production-secret inventory.
Automatic approval review rejected removal of the ignored local `node_modules` junction with
"blocked by policy". It remains untouched and points to the primary checkout's dependencies; all
credited release verification used the fresh exact-lock Linux install. Do not run a Windows install
through that junction or treat its older Next package as this release's verified dependency set.

The verified application/source SHA is `7d8f820b68fa64eb6a3d6aec13182debf3e15ef7`.
The later closeout commit changes documentation, local proof specimens and Lighthouse's per-route
indexing-policy check only. It does not change the application, exporter, runtime assets, legal files,
lockfile or Lighthouse budgets. The verification-source hashes are separately bound in the evidence.

| Check | Exact local result |
|---|---|
| Clean Linux install | PASS; 1,572 packages, exact unchanged lockfile, Node 24.15.0/npm 11.12.1. |
| `npm run verify:static` | PASS on the final source; includes existing source/selftest/security/contrast controls and 23 direct/error adverse artifact cases. |
| Clean normal `NEXT_BUILD_CPUS=1 npm run verify:build` | PASS; `.next` removed first; all 69 route bundle budgets. This is not an SSR-crash pass. |
| Guarded production build | Correctly REFUSED; seven non-PUBLISHABLE documents plus the all-seven requirement. |
| Denied static rehearsal | PASS for permitted rehearsal; 54 routes, 197 files, 28,739,641 bytes; seven legal and three Technical routes excluded. |
| Static browser | PASS; 13 page proofs, 13 no-JS proofs with reflow at 390/768/1440/1920, 12 direct-contact keyboard cases at 375/768/1440 in both JS modes; division interactions, navigation and reduced-motion checks retained. No intake requests. |
| Focused axe | 16 analyses, zero violations; 404, standalone 500 and actual induced HTTP 500 included. Contrast incompletes are accounted separately below. |
| Rendered contrast supplement | PASS for the 250 recorded desktop memberships: 231 measured, 19 structurally decorative, zero hidden/unvisited/unresolved. All five low-contrast predicate specimens rejected, captured DOM styles restored and positive checks repeated. |
| Local Apache HTTP | PASS; exact identity, 195 public file hashes, all 54 routes, headers/MIME/cache/compression, gated 404, redirects and exact GET/HEAD 500 behavior. |
| Permanent adverse HTTP/Lighthouse proof | PASS; seven cases rejected at their intended assertions, captured simulation bytes restored and positive HTTP rerun. |
| Static desktop/mobile Lighthouse | PASS; ten routes × three runs per axis; all existing assertions. Performance/accessibility/best-practice medians 1.00 throughout; indexable SEO 1.00, intentional-noindex Insights 0.66 with individual SEO checks passing. Desktop median LCP 578–681 ms; mobile 878–1,035 ms. Omitted legal route confined to this identity-bound denied rehearsal. |
| Exact-SHA CI and hosted smoke | UNVERIFIED; no push, dispatch or deployment. |

The first rehearsal failed with EAGAIN under concurrent browser load. An earlier full normal scene
aggregate was interrupted rather than completed. Static Lighthouse collections in the original
container reached its 512-task limit and were stopped (exit 137); their partial reports are not
credited. The original container lacked an init reaper. Verification continued in a task-owned
snapshot with `--init`, no host mounts/ports, the same limits and a bounded eight-thread Apache child.
These logs remain retained. The reruns are separate;
no assertion threshold, browser authenticity control or release refusal was relaxed.
The first completed desktop collection passed the performance/accessibility/best-practice budgets,
but failed SEO on empty `/insights` (0.66). Its existing GS-R16-001 policy intentionally sets noindex
until the owner publishes an article. The static verifier had incorrectly assumed all production
routes were indexable. It now reads each route's sitemap/indexing policy from the validated manifest;
indexable routes retain the 0.9 SEO floor, and intentional noindex routes retain all existing named
SEO assertions at 1 except `is-crawlable`. Fixtures cover both indexing states. The failed reports
are retained separately; public Insights content and indexing policy were not changed.

Axe left 250 contrast memberships incomplete across 13 analyses. The guarded supplement binds the
same denied artifact and imports/extracts the existing Master, Design, Digital, Press and glyph-mask
predicates with unchanged thresholds. It checks each recorded target after scrolling into view;
Digital's existing collected boxes are restricted to that target's overlapping text ranges before
the unchanged pixel calculation. Master keeps its bitmap/DOM capture-invariant checks. Consent
checks include composed opacity, opaque background and actual hit testing. Decorative memberships
are explicitly noninteractive, aria-hidden subtrees; they are not called contrast passes.

The first supplement is retained as FAIL: its consent adverse specimen used an inline-important
text-fill that prevented the black/white mask from measuring glyphs; its Digital call measured
unrelated viewport copy and could confuse repeated labels such as 03/04. The corrected color-only
specimen permits the existing glyph mask, and target-range filtering removes those unrelated
subjects while still rejecting missing/zero-box targets and requiring every recorded range. The
corrected run measured all 250 memberships and its five adverse/restored proofs passed. No product
style, text, animation, contrast threshold or axe violation was suppressed to obtain this result.

This supplement covers the recorded 1440×900 memberships, not the full scene/lifecycle/mobile
matrices. Frozen scene/style source is unchanged from the predecessor; historical GS-LAUNCH-003
full-scene results remain historical. Current static browser reflow, keyboard, reduced-motion and
both Lighthouse axes are separate current results. Physical-GPU, human assistive-technology and
hosted acceptance remain UNVERIFIED; no universal WCAG-conformance claim is inferred from scores.

### Retained artifact

Artifact identity: `e8ca42a47d95e8c22727712d03aeb923a349ef5bc66b6bc7c5a87722ad3342d4`.
Source: `7d8f820b68fa64eb6a3d6aec13182debf3e15ef7`, `sourceModified:false`.
Origin: `https://gridsmith.uk`; production dataset; `contactMode:direct`; `intakeOrigin:null`.
The original artifact is retained locally at `build/gs-launch-007/final/artifact/`, with private
receipt, CMS route revisions, deployment identity and per-file hashes alongside it.
The builder checks CMS revisions before and after generation. This binds the retained bytes and
the reproduction procedure; it does not claim that a later mutable-CMS/Next build is byte-identical.
It is **nondeployable**, `rehearsal:true`, `deployable:false`, and access-denied by `.htaccess`.
Only a separate local simulation copy removes the deny rule and adapts host/TLS routing to loopback.
Never upload this rehearsal or edit its flags to promote it. A final deployable all-seven artifact
cannot be produced before genuine legal/privacy prerequisites and publication authority exist.

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
   For 500, inspect the approved mapping and request `/500.html`; no artificial production fault or
   exhaustive outer-CDN error test is required. Actual provider-generated error behavior stays limited
   to what was observed, separately from the local induced-500 proof.
   Any cache purge must be confined to the approved site. No DNS/mail changes are planned.
6. On wrong identity, missing/broken routes/assets/contact, legal mismatch, critical accessibility or
   security failure, stop and restore the recorded old root/configuration. Restore database only if
   necessary under the agreed write window. Recheck the previous WordPress site and mailbox; retain
   both private recovery copies for the approved retention period. Preserve MX/SPF/DKIM/DMARC.

At 17:33 UTC on 23 October, the WordPress homepage was read-only verified HTTP 200 with WordPress markers; public DNS
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

> Continue GS-LAUNCH-007 from the final local closeout commit reported to the owner on
> codex/gs-launch-007. Preserve that clean worktree; the retained artifact's earlier source SHA is
> a separate binding, not an instruction to reset the branch. Read
> GS-LAUNCH-007.md and its evidence JSON. Use only the owner's completed release checklist and named
> private target/backup receipt. Confirm actual privacy/contact applicability and all-seven authority;
> do not manufacture evidence or amend adopted clauses. Build and verify the exact final artifact,
> obtain approval binding its identity if it differs from the approved transaction, then perform only
> that controlled Hostinger upload/switch and specified smoke checks/rollback. Preserve the temporary
> site and mail/DNS. No Vercel, support contact, source push, publishing dispatch, live intake or new phase
> unless that exact action is explicitly authorised. Stop on any identity, prerequisite or target mismatch.
