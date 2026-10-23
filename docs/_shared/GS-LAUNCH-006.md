# GS-LAUNCH-006 — Hostinger capability evidence collection

23 October 2026. **EVIDENCE COLLECTION COMPLETE WITH ACCOUNT GAPS; STATIC RELEASE HOLD.**

Baseline: `b787ef79382ccf3fb904284951f88f3dcb12a86f` (`codex/gs-launch-005`).
Isolated branch: `codex/gs-launch-006`; worktree:
`C:\Users\atikm\.codex\worktrees\gs-launch-006\Gridsmith Ltd`.

The repository establishes the intended product and dated account observations. Public Hostinger
documentation establishes an HTML error-page editor, but **does not establish independent storage,
configuration, malformed-root survival or an accessible outer fallback on this account**. No current
account-specific independent-error capability is CONFIRMED. No explicit provider refusal establishes
UNSUPPORTED either. The correct determination is conditional support with unresolved requirements,
not acceptance or a declaration that Hostinger cannot support it.

## 1. Authority and evidence rules

This phase permits inspection, public documentation research, local documentation and a local commit.
It does not explicitly permit using stored credentials, authenticated browser sessions, hPanel or
account APIs. None was used. No request was made to WordPress, the temporary site, an origin or CDN;
no provider enquiry was sent. No hosted fault, installation, configuration change or test was performed.
Read-only account evidence collection still requires separately named access authority.

Read: GS-LAUNCH-004/005 and their evidence/fixtures; GS-LAUNCH-002/003 release safeguards;
HOSTINGER-STAGING-WORKFLOW; GS-HOST-004 and its server-dependency matrix; H4-B/D/E/G;
05-HANDOVER, PROJECT-STATUS, OWNER-ACTIONS, AI-HANDOFF, AI-DEVELOPMENT-PROTOCOL;
master PROJECT-RULES and the agent verification strategy; the operator package, static builder,
artifact validator, selftests, generated-host-rule source and workflows. There is no existing
`graphify-out/graph.json` in this isolated checkout; inspection used the named source files.

Classifications apply to the exact proposition in each row:

- **CONFIRMED**: account-specific evidence; retain its date, site and limits. A historical observation
  confirms what was recorded then, not the current setting or this candidate's hosted behaviour.
- **DOCUMENTED**: generic official provider documentation only; no account entitlement or runtime proof.
- **UNVERIFIED**: insufficient evidence for the required property on the actual intended site.
- **UNSUPPORTED**: explicit applicable provider evidence rules it out. Silence is insufficient.

Local Apache evidence is a separate evidence class, never Hostinger capability confirmation.
Source documents are pinned to the baseline above unless a different historical commit is stated.
The local receipt is [GS-LAUNCH-006-EVIDENCE.json](GS-LAUNCH-006-EVIDENCE.json).

## 2. Actual hosting configuration: facts and current gaps

| Proposition | Evidence and determination | Current gap / requested evidence |
|---|---|---|
| Intended hosting product and site type | R1: included **Hostinger Business PHP/HTML hosting**, file-only static website, no persistent application Node; separate from managed Node Web Apps and Website Builder. CONFIRMED historical programme/account observation, 4–6 October. | E1: current site/product summary and entitlement; no fresh account inspection. Do not substitute Node-app or Builder documentation. |
| Temporary static destination | R1/R2: `mediumaquamarine-wallaby-594070.hostingersite.com`, a separately provisioned included PHP/HTML site. CONFIRMED historical site identity. | E1/E2: current site identity and isolation. This existing temporary site is **excluded from fault testing**. |
| Website document root | R1/R2: temporary static site's relative root `public_html`. CONFIRMED historical observation. | E2: current canonical absolute path, domain-to-root mapping, parent configuration traversal, symlinks, ownership and shared paths. The WordPress root and an independent fallback path are UNVERIFIED; no account home path is invented. |
| Temporary site versus live WordPress | R1 §Provider configuration evidence and R3: temporary static export was separate from the existing `gridsmith.uk` WordPress site; replacement/cutover was deferred. CONFIRMED historical separation and programme boundary. | E2: current per-site root mapping and shared parent/configuration/CDN scope. Same-account separation alone does not prove fault isolation. No current WordPress status claim is made. |
| Error-page configuration | P1 describes a per-code hPanel HTML editor. P2 includes 500 in an older provider guide. DOCUMENTED only. | E3/E4: actual 500 option, existing mapping/template, storage and control scope. Whether the editor changes root `.htaccess`, a parent/vhost rule or a provider template store is UNVERIFIED. |
| CDN / delivery layers | R1/R2: temporary-site hCDN Active, Development mode off, automatic page caching off in October receipts. Raster header removal and provider robots substitution were observed. CONFIRMED historical observations only. | E5: current per-site edge, origin/server cache, proxies, WAF/error interception, cache/stale settings and supported origin access. None is freshly confirmed. Temporary-domain PNG/robots exceptions do not apply to HTML errors or production. |
| Deployment / replacement boundary | R1/R2: generated-only `codex/gs-hostinger-artifact` → temporary `public_html`; rollback marker disappeared when absent from restored commit. CONFIRMED historical replacement, not a universal deletion specification. R4 confirms source workflows still publish generated files only. | E4/E6: exact current deploy target/deletion scope and whether parent files, provider templates and mappings survive deploy, restore and site operations. No outside-root path is assumed safe merely because it is outside `public_html`. |
| Provider Git / automatic deployment | R1 records artifact publication auto-deploying and **manual Redeploy re-enabling auto-deployment**; it was turned off and reload-confirmed at that time. R4 confirms source pushes trigger CI, and successful manual CI dispatch can publish the artifact branch. | E6: current per-site repository, branch, target root, auto-deploy state and history; repository App permissions/events and all other publishing routes. Current push safety is UNVERIFIED. No repository action is used as a test. |
| Provider-controlled outer errors and backups | No current account template/configuration export or provider confirmation is supplied. UNVERIFIED. | E3/E4/E7: outer fallback ownership, code coverage, supported export/readback/restore and authorised operator permissions. |

R2's earlier “auto-deployment is currently off” sentence must be read with its later Redeploy
side-effect warning and R1's dated observations. It is not current safety proof. R1's earlier
“artifact-branch selection pending” paragraph predates its completed deployment/rollback record.
Current R4 source is the source-workflow authority; historical account settings require a refresh.
No claim is made that provider Git is absent or that source pushes are safe across all services.

## 3. Independent error-response capability matrix

**Zero required account capabilities below are currently CONFIRMED.** DOCUMENTED indicates a partial
generic feature, not satisfaction of the complete hosted requirement. Evidence requests E1–E7 are
specified in §5. Local successful and deliberately failing cases remain local evidence only.

| ID | Required capability | Classification | Evidence / exact unresolved question |
|---|---|---|---|
| C1 | Custom HTTP 500 HTML response | **DOCUMENTED** | P1 provides the HTML editor; historical P2 explicitly lists 500. E3 must prove the current site's 500 control, actual implementation and saved bytes. This does not establish status preservation. |
| C2 | Independent storage outside replaceable release root | **UNVERIFIED** | No applicable account path or provider-owned template store is evidenced. E2/E4 must establish actual storage, read permissions, isolation and deployment exclusions. |
| C3 | Mapping survives malformed release-root `.htaccess` | **UNVERIFIED** | An hPanel editor does not reveal configuration scope. E3/E4 must identify mapping implementation and prove it avoids the failing root traversal. R5's local vhost/Alias model is not a Hostinger entitlement. |
| C4 | Original 500 retained without redirect or soft 200 | **UNVERIFIED** | No Hostinger fault-response GET/HEAD receipt exists for this package. E4 provider confirmation and future origin/edge receipts must show original status, no Location and exact GET bytes. Fetching an error file with 200 is insufficient. |
| C5 | Error-specific security and cache headers | **UNVERIFIED** | P5 documents Cache-Control through `.htaccess`/PHP only. It does not establish an independent header mechanism. E4 must cover headers on the error response even when root configuration is invalid. |
| C6 | Provider-controlled fallback when independent document is missing/unreadable | **UNVERIFIED** | No applicable outer template is supplied. R5 deliberately obtains inaccessible local defaults for these cases: known unacceptable states, not a Hostinger finding. E4 must identify a separately accessible fallback and its status/header owner. |
| C7 | Separate provider-generated 502, 503 and 504 handling | **UNVERIFIED** | P4 distinguishes origin/edge troubleshooting; it does not grant template editing. E4/E5 must identify the generating layer, template control and safe supported acceptance method for each status individually. |
| C8 | CDN delivers required error rather than stale successful content | **UNVERIFIED** | P3 says 5xx is not stored but an older cached response may be served; P6 notes temporary-domain optimisation controls are limited. E5 must establish effective stale policy and exact status/body/header delivery at each layer. “5xx not cached” alone cannot close this row. |
| C9 | Operator backup and restoration of error configuration | **UNVERIFIED** | P1's Reset restores a provider default, not a backed-up custom configuration. R1 website Git rollback is not error-configuration rollback. E3/E7 must establish exact export, readback, configuration/document/permission restore and operator access. |

No applicable explicit refusal was found, so none is labelled UNSUPPORTED. A generic Apache directive
or an existing hPanel menu cannot upgrade any row to account-specific CONFIRMED. A future written
account confirmation still leaves empirical isolated hosted acceptance as a separate gate.

## 4. Source and redacted evidence inventory

Repository sources, inspected at the baseline:

- **R1** — [GS-HOST-H4-D.md](GS-HOST-H4-D.md), especially “Provider configuration evidence”,
  “Auto-deployment” and “Rollback transaction”. Account observations from 4–6 October 2026;
  last report/workflow change `042b610ded7daede9db1dfa46779a33f8604e49c`. Retained historical
  narrative, not a fresh provider export or current site inspection.
- **R2** — [HOSTINGER-STAGING-WORKFLOW.md](HOSTINGER-STAGING-WORKFLOW.md), Delivery and rollback.
- **R3** — [GS-LAUNCH-004.md](GS-LAUNCH-004.md), [GS-LAUNCH-005.md](GS-LAUNCH-005.md),
  [GS-HOST-004.md](GS-HOST-004.md), its server-dependency matrix and H4-B/E/G; release scope,
  static architecture and remaining provider/intake/publication gates.
- **R4** — `.github/workflows/ci.yml`, `.github/workflows/hostinger-staging.yml`,
  `scripts/build-static.mjs`, `lib/build/hostinger.ts`: source triggers, artifact replacement and
  host rules, not proof of remote installations, account permissions or current provider settings.
- **R5** — [GS-LAUNCH-005-EVIDENCE.json](GS-LAUNCH-005-EVIDENCE.json),
  [local proof README](gs-launch-005-proof/README.md), Apache configuration, setup/verifier and 45
  portable evidence entries; GS-LAUNCH-004's earlier permanent subjects. Recorded local evidence,
  rechecked for integrity here, not rerun as hosted faults.
- **R6** — [operator guidance](../../ops/HOSTINGER-ERROR.md), `ops/hostinger-error/error.html`,
  `identity.json`, `scripts/check-static-artifact.mjs`, `scripts/check-static.selftest.mjs`,
  `scripts/source-files.mjs`; current package integrity and artifact boundary.

Public official documentation consulted 23 October 2026; relative “updated” labels are not treated
as dated account evidence. These are short findings, not copies of provider articles:

| ID | Source | Finding and limit |
|---|---|---|
| P1 | [How to customize your website’s error pages in Hostinger](https://www.hostinger.com/support/1583295-how-to-customize-your-website-s-error-pages-in-hostinger/) | Per-code HTML editing and Reset; AI Builder excluded. No independent-path/configuration guarantee. |
| P2 | [Guide to Using Hostinger](https://assets.hostinger.com/content/tutorials/pdf/Guide-To-Using-Hostinger.pdf), PDF page 14, printed page 13 | Error Pages includes 500. Historical guide, not current entitlement. |
| P3 | [How Hostinger CDN caching works](https://www.hostinger.com/support/how-hostinger-cdn-caching-works/) | 5xx is not stored; stale successful content remains possible. Cache headers and request cache state need observation. |
| P4 | [Hostinger CDN: Troubleshooting website errors](https://www.hostinger.com/support/hostinger-cdn-troubleshooting-website-errors/) | Distinct origin/edge diagnosis; request/cache identifiers and multiple cache layers. No template-control guarantee. |
| P5 | [Advanced CDN header management at Hostinger](https://www.hostinger.com/support/8052370-advanced-cdn-header-management-at-hostinger/) | Cache-Control can be set through `.htaccess` or PHP. Broken-root independence is not documented. |
| P6 | [Hostinger CDN: How to optimize your website](https://www.hostinger.com/support/7935917-hostinger-cdn-website-optimization/) | Temporary-domain optimisation is automatic with restricted controls. Resolve applicability to the recorded add-on site with Hostinger. |
| P7 | [How to deploy a Git repository in Hostinger](https://www.hostinger.com/support/1583302-how-to-deploy-a-git-repository-in-hostinger/) | PHP/HTML Git branch/root selection, automatic deployment control and manual Redeploy. Does not establish this account's current state. |
| P8 | [Hostinger CDN and your DNS records](https://www.hostinger.com/support/hostinger-cdn-and-your-dns-records/) | CDN enable/disable can change routing DNS. It is excluded from this plan's default test authority. |

## 5. Precise owner evidence-request checklist

**No fresh account screenshots, redacted exports or account-specific support confirmations were
provided in this phase.** E1–E7 are requests, not collected evidence. Owner may supply the records
without granting agent account access. Include capture time/timezone, site identity and the relevant
setting labels. Keep original private records outside Git; use redacted copies or references/hashes.

- **E1 — Product and permissions:** site summary and plan/site-type card showing Business PHP/HTML,
  exact relevant hostname, available Error Pages feature, operator role and allowed view/export
  scope. Exclude billing, account contacts, login/session material and unrelated sites.
- **E2 — Roots and separation:** site-scoped domain-to-root mapping for the static site, WordPress
  and proposed isolated host; provider-confirmed canonical paths and parent/shared configuration
  scope. Keep sensitive absolute account paths private; commit stable aliases and independence
  conclusions. Identify whether a root error or configuration change could affect another site.
- **E3 — Current error configuration:** Error Pages code list and current 500 editor/view **without
  Save/Edit submission or Reset**; supported redacted export/readback of the existing template and
  mapping, with original hashes retained privately. If the UI cannot expose it read-only, request
  provider confirmation instead. Identify whether hPanel writes `.htaccess` or a different scope.
- **E4 — Provider confirmation:** account/site-specific written answers to C2–C7, underlying
  implementation boundary, independent storage/configuration/header owner, deploy overwrite scope,
  missing/unreadable outer fallback and safe fault method. Retain dated ticket reference and
  redacted answer; no account IDs, filesystem usernames or secret URLs in Git.
- **E5 — Delivery:** per-site CDN Active/Development/cache/optimisation settings, origin/server cache
  and any other proxy/WAF; effective stale-success behaviour; supported authenticated origin-test
  method that preserves Host/SNI/TLS. Redact origin IPs/private routes and bypass credentials.
  DNS export, if needed later, stays private and is not authority to change DNS.
- **E6 — Trigger safety:** each relevant Hostinger site's Git repository/branch/root, auto-deploy
  state after reload and deployment timestamps; Hostinger GitHub App repository access and event
  permissions, plus other relevant Apps/publishers, Pages, Vercel coupling, hooks, API/CLI, SFTP/SSH
  and scheduler routes. Record absence only where actually inspected. Never capture hook secrets,
  access tokens, deploy keys or credential-bearing clone URLs. Do not click Redeploy or push to test.
- **E7 — Backup/restore and isolation:** provider-supported template/configuration export and restore
  scope, permissions required, independent-file readability/ownership, operator/backup custody and
  proposed exact isolated hostname. Supply evidence that restoration does not change WordPress,
  mail, another site, parent CDN or DNS. A provider Reset is not a custom-config backup.

Supply “not available” with the exact missing view/export and request a provider answer. Do not
alter settings merely to obtain a screenshot. The R11 contractual hosting closeout stays closed;
this checklist does not request a new hosting account, agreement, subscription or hosting purchase.

## 6. Hostinger support enquiry draft — NOT SENT

**Subject:** Business PHP/HTML site: independent accessible 500 response — capability confirmation only

We are preparing a static website on our existing Business PHP/HTML hosting. Please confirm the
following for the exact site we identify privately in this ticket. This is an information request:
**please do not change settings, deploy files or run fault tests**.

1. How does hPanel Error Pages implement a custom 500: release-root `.htaccess`, parent/server
   configuration or a provider template store? Can both HTML storage and mapping/header policy
   reside outside the replaceable website root and avoid traversing a malformed root `.htaccess`?
   What persists after Git deployment, restoration and site reconfiguration, and who can manage it?
2. Can this preserve the original HTTP 500 on GET/HEAD without redirect/soft 200, with exact reviewed
   HTML, `Cache-Control: no-store, max-age=0`, restrictive CSP and the security headers listed in our
   acceptance requirements? Will that policy still apply when root configuration cannot be parsed?
3. If the independent document is missing/unreadable, which outer fallback runs, and can it provide
   accessible initial HTML with the original status? Separately, which layers generate 502/503/504,
   and can each layer's template/status/headers be controlled on this product?
4. What origin/server-cache/CDN layers apply to this site? Can an earlier cached success mask an
   origin 500, and what supported policy prevents that? Which temporary-domain controls are fixed?
   Please identify a supported TLS/Host-preserving origin comparison method without DNS changes.
5. Which account permissions and independent test-site configuration are required for safe,
   site-scoped tests of these cases, including provider-generated errors without service overload?
   How can the exact current templates, mappings, headers and permissions be exported/read back
   and restored? Please identify any unsupported requirement explicitly, with its applicable scope.

We will obtain separate owner approval for any installation, tests or configuration changes after
reviewing your answers. Please provide documentation and account-specific confirmation only.

Owner must approve the exact message and recipient/channel before an agent sends it. Approval of
this document or phase is not sending authority. Private site/account identifiers are added only by
the authorised operator through the legitimate support channel.

## 7. Proposed isolated hosted acceptance — DESIGN ONLY, NOT AUTHORISED

### 7.1 Permission and host prerequisites

**Exact permitted test host: UNASSIGNED. No hostname is authorised by this plan.** A later approval
must name one literal HTTPS hostname, its canonical independent root/configuration scope and the
operator. Never substitute a placeholder or discover-and-use another host. `gridsmith.uk`,
`www.gridsmith.uk`, the existing temporary static destination and all unrelated sites are excluded
from fault tests. An unproven shared parent/vhost/cache scope is an abort condition.

The future approval must enumerate: account view/export; independent template/configuration writes;
one isolated synthetic fault endpoint; malformed-root and missing/unreadable fallback tests;
origin and CDN GET/HEAD/browser access; any site-only cache flush/Development-mode actions;
provider-assisted error tests; backup/restore and operator emergency recovery. No DNS/CDN
enable/disable, new site/subdomain creation, Git push, remote CI, WordPress, live intake, database,
CMS or mail action is included. Site provisioning, if needed, requires a separately explicit grant.

Proposed maximum, subject to explicit owner agreement: **one isolated host, one temporary fault
endpoint, one serial fault at a time; at most 120 scripted HTTP requests plus eight bounded browser
cases; at most two minutes per adverse state and 30 minutes for the fault window**. Browser cases
must have no external/intake requests. This is a proposed limit, not elapsed-time or test evidence.
If those bounds cannot cover a supported provider test, stop for a revised approved plan; no retries
or resource exhaustion, concurrency/load testing, process killing or deliberate upstream outage.

### 7.2 Baseline, backup and installation order

1. Close E1–E7 sufficiently to identify a supported configuration and isolated host. Obtain the
   exact signed-off host/method/path/time/operator/rollback authority. Freeze competing publishers;
   document that no other operator or harness may read/write the fault subjects during a proof.
2. Capture HTTPS healthy homepage, representative division/service/asset and true 404 baselines.
   Inventory exact website identity, all configuration/template/document bytes and SHA-256,
   canonical paths, ownership, permissions, mapping/header scope, relevant Git state and CDN/cache
   settings. Store unredacted backups securely outside Git with tested read access and a manifest.
3. Identify the previous complete configuration/document pair and **prove its supported restore
   method on the isolated scope before faulting**. Keep an operator recovery channel available
   even if the website root fails. hPanel Reset, deployment history or a website file backup alone
   does not prove restoration of provider-managed error configuration.
4. Freeze provider-approved configuration syntax and hashes. No installation command or deployable
   configuration is supplied here. Install/read back the independent fallback document first,
   verify its reviewed hash and permissions, then apply the independently scoped mapping and
   error-header policy through the supported mechanism. Verify syntax/scope before enabling it.
   Abort if independence from root traversal/deployment deletion cannot be established.
5. If C6 needs a provider outer template, install and verify that separately approved outer safety
   layer **before** testing missing/unreadable independent storage. Do not start those tests while
   the only demonstrated outer response is inaccessible. Keep website release replacement separate.

### 7.3 Controlled faults and response evidence

- Use only a provider-approved synthetic HTTP 500 mechanism on the named isolated endpoint. It must
  generate an actual 500 through the boundary being tested, not directly serve the error HTML.
  Freeze method/path and mechanism before approval. Do not use live enquiries, the Next SSR probe,
  an application crash, resource exhaustion or an invented `.htaccess`/PHP command. GET and HEAD
  are the default methods; any synthetic POST requires separate explicit approval and must be
  proven unable to reach intake, workers, database or notifications.
- For every origin/edge case, retain UTC timestamp, exact allowed host/path/method, request ID,
  raw status/headers, decoded body bytes/SHA-256, encoding and elapsed time. Refuse redirects;
  assert HTTP 500, no Location, exact selected GET body hash, empty HEAD body and consistent
  status/security/cache headers. Capture headers before browser recovery. No Set-Cookie, analytics,
  external dependencies, stack paths, provider/request substitutions or enquiry-delivery claims.
- Required independent error headers: identity policy's exact CSP and no-store, plus nosniff,
  frame denial, no-referrer, noindex, Permissions-Policy and HSTS under the reviewed local contract.
  Establish exact values from the approved package/configuration pair, not from a received response.
  Check duplicate/conflicting headers as well as presence. TLS must validate; a local HSTS string
  does not prove TLS. Origin access must use Hostinger's approved method with correct Host/SNI,
  without `-k`, guessed IPs, security-control bypass or DNS changes.
- At 320/375/768/1440px, with JavaScript enabled and disabled before navigation, check initial
  `en-GB`, error title, one H1/main, complete text/no overflow, visible native focus, keyboard Tab
  then Enter recovery by a single GET to the same isolated homepage. Confirm no auto-refresh/replay.
  Include reduced motion. Run the existing WCAG 2/2.1/2.2 AA/best-practice axe coverage on the actual
  response; for script-disabled cases use the established script-free DOM replay with asserted
  equality and in-memory missing-language adverse control. Require zero violations/unresolved
  incompletes for this focused subject; preserve full results. Human screen-reader acceptance stays
  a separate recorded manual check, not an inferred axe result.
- Malformed-root case: save exact root config bytes/permissions, verify a normal release-root page
  is 200 first, then use the separately approved malformed-root fault and request **that same page**.
  This must traverse the broken root; an earlier synthetic-error rewrite could mask the question.
  Require the independent accessible 500/hash/headers. Restore captured bytes immediately and
  prove hashes, permissions and healthy response before another fault.
- Missing/unreadable case: separately remove access to only the test fallback as explicitly
  approved, once per condition, after proving readability beforehand. Require the **provider's
  approved outer accessible document**, separately reviewed hash/status/headers, bounded response
  and no recursion. Never expect the missing file's hash. Restore exact bytes/permissions after
  each case. An inaccessible provider default is FAIL; do not relabel it successful recovery.
- 502/503/504: for each supported provider-assisted method, record generating layer, distinct
  original status, reviewed outer-template hash/headers and accessibility. A synthetic origin
  status does not test an edge-generated failure. If Hostinger supplies no safe method, mark that
  case UNVERIFIED and retain HOLD; do not induce overload/timeouts on shared infrastructure.

### 7.4 CDN cold / warm / stale acceptance

Compare the approved direct-origin path with every actual delivery layer. For the same test URL,
observe cold and repeated warm requests, then a separately prewarmed successful response followed
by the approved origin fault, then restored success. Record `Age`, cache status, request identifiers,
Vary/encoding and GET/HEAD status/body/header parity. A new query parameter alone does not prove a
cold or uncached response. Use only explicitly approved **site-scoped** cache actions; do not toggle
CDN enablement or the parent-domain policy. If no safe cold-state method exists, record the gap.

If an edge serves a stale 200 while origin returns 500, C8 fails even if the 500 document says
no-store. Record the stale successful bytes and cache history; do not accept a screenshot of the
error file as delivery proof. A flush is not evidence of permanent stale-policy correctness.

### 7.5 Restoration, abort and final gate

Abort on wrong host/shared scope, unexpected publisher, unavailable backup/recovery, unsupported
configuration, any production/intake/network side effect, redirect/soft 200, wrong bytes/headers,
inaccessible fallback, stale-success substitution, recursion or exceeded bounds. Stop faults and
new publication immediately; do not broaden grants or improvise provider commands.

Restore the approved previous mapping/header/template pair and exact document bytes/permissions
through the recorded provider mechanism. Remove only the named synthetic fault endpoint and
restore root bytes. Restore only approved site-scoped cache/Development settings. Read back/hash
everything, reload relevant settings including auto-deployment, and repeat healthy/404/security/
asset identity and origin/edge checks. Use a restored controlled 500 only if still inside the
explicit approval/bounds, then remove it and prove healthy recovery. Retain timestamps, hashes,
configuration exports and operator sign-off. A restored but inaccessible original provider default
counts as restoration only, not accessibility acceptance. Escalate an unsuccessful restore to the
named operator; no unrelated cleanup or live-site workaround.

Hosted PASS requires all applicable cases and restoration evidence, reviewed by the owner. Unknown
edge classes or an unsupported independent boundary retain HOLD for a separately scoped owner
decision; this phase grants no exception, architecture change, release readiness or cutover.

## 8. Existing operator package review and local verification

The package remains **nonpublic source and nondeployable by contract**, hash-protected and separate
from the generated website. This is verified locally, not by inspecting current hosted files.
`providerAcceptance: UNVERIFIED`, `deployable: false` and `installed: false` in the private builder
receipt remain requirements/evidence markers; they do not report an account installation.

- Selected HTML SHA-256: `3b8c26ad3ecba475f70a82d710e844229ffb00a313b72cefd154f682582c6ffc`.
- Configuration-policy SHA-256: `e34b8851ddbbee2e04b194f2becf33c89bde4ed472e95140b2ef34a2373ed8a2`.
  This hashes the policy requirements, **not an actual Hostinger configuration**.
- `inspectOperatorError` requires exactly two files and exact policy/document identity. Static
  builder validates the pair before generation and binds it only to its private receipt. Neither
  public `__deployment.json` nor generated `.htaccess` receives an independent-error installation.
- Artifact admission rejects `ops/`, `hostinger-error/`, reserved error URI and distinctive document
  title, including a renamed copy. Existing positive/adverse selftests exercise these questions.
  `public/500.html` remains a different unsuitable legacy file, not this fallback or a 500 proof.
- Permanent local fixtures explicitly require owned loopback containers and retain malformed-root,
  co-located-mapping, missing/unreadable and outer-status adverse cases. No proof harness or Docker
  test was executed here. Historical 288 HTTP/eight browser cases are not fresh hosted results.

Current local verification, recorded in the receipt:

| Check | Result and limit |
|---|---|
| Existing static selftest | **PASS**, Node 24.15.0; two operator files and 13 named adverse proofs, plus existing release/artifact controls. First run stopped at missing TypeScript; reused prior worktree dependencies via an ignored local junction and reran successfully. No install/upgrade. |
| GS-LAUNCH-005 source/protected bindings | **PASS at pre-edit baseline**, all 23 recorded SHA-256 bindings matched before documentation updates. Five are control documents intentionally updated here; final hashes are separate in the receipt. The other 18 remain unchanged. Seven adopted legal bytes and their register are independently unchanged; current register is seven OWNER_ADOPTED, zero PUBLISHABLE. |
| Portable prior proof evidence | **PASS integrity only**, all 45 entries: stored bytes/hash and compressed entries' decoded bytes/hash. Does not rerun the recorded tests. |
| Retained prior rehearsal | **PASS local inspection**, 201 files and file-manifest hashes; deny-all and `deployable:false`; operator paths/title absent. Artifact identity `15f3ac8766adb3c8e5bfd53d2f290bdd144b5161b0fcc696a0cdfe6d5cf9e421`. Original receipt names GS-LAUNCH-004 source with `sourceModified:true`; this is the prior local rehearsal, not a new exact-GS-LAUNCH-006 artifact. |
| Documentation scope / primary preservation | Final staged path/whitespace/confidentiality review, protected-tree comparison and before/after primary HEAD/status/dirty-and-untracked file hashes are recorded at closeout. Documentation and control checkpoints only. |
| Account / hosted / CI / release acceptance | **UNVERIFIED / NOT RUN**. No authenticated access, provider contact, hosted requests, builds, faults, deployment, remote CI, push or new vulnerability audit. |

An initial one-off inventory assertion incorrectly treated the prior boolean preservation flag as a
file-count object; it stopped before receipt creation. The corrected check uses the independently
recorded 201-file expectation. Only the successful final inventory is acceptance evidence.

Five read-only stage reviews (specification, content integrity, rules, accessibility and design)
completed without remaining actionable findings. Baseline-versus-final hash wording was clarified
after review. Their scope is local source/documentation; public-source consultation belongs to this
phase's collection record, and no review supplies account, browser or hosted acceptance.

## 9. Owner permissions, blockers and next single task

**Immediate dependency:** owner supplies E1–E7, or explicitly authorises read-only access naming the
Hostinger account/site, operator, views/exports and redaction limits. Separately approve the exact
§6 support draft and recipient/channel if an agent is to submit it. Neither grant permits settings
changes, Redeploy, fault tests, DNS, publishing or support-led changes.

**Later dependency:** only after evidence review, separately approve a concrete isolated acceptance
plan with one literal host, independent scope, provider-supported configuration/fault mechanism,
backup/restore proof and the bounded permissions in §7. No host is selected or reserved here.
GS-LAUNCH-007 is **not started** and requires separate approval even if evidence arrives.

Remaining blockers: C2–C9 account support and actual hosted acceptance (including C1's runtime
behaviour); provider trigger safety; exact-SHA Linux CI/Lighthouse and hosted/manual/confidentiality
acceptance; production intake/H4-B, sender/worker/notification and restore evidence; legal
co-publication/cutover and WordPress/DNS/mail recovery authority. Seven adopted legal texts remain
unchanged and unpublished, zero PUBLISHABLE. Analytics/Freelancer reviews stay disabled, public
Path Finder and GS-X002 Technical publication stay excluded, no live enquiries/notifications or
Production Supabase/CMS writes. The inherited **17 high toolchain entries across three advisories
remain unresolved and unaccepted**; no waiver or fresh-audit claim. Normal Next SSR M-P1-1 remains
separately blocked; this task concerns the static Hostinger release only.

**Next single recommended execution task: owner-led collection of E1–E7 and submission of the
approved Hostinger capability enquiry, returning a redacted evidence packet for classification.**
This is a recommendation, not sending/account access authority or commencement of GS-LAUNCH-007.
If evidence remains unavailable, retain HOLD. No push, dispatch, deployment, hosting/DNS/WordPress
change, fault injection, publication or Production provider action is authorised by this report.

Local documentation commit SHA and clean isolated-worktree status are reported at closeout;
the primary checkout and prior candidate remain separate and preserved.
