# GS-LAUNCH-005 — Hostinger error boundary capability and local implementation

23 October 2026. **LOCAL CONDITIONAL PACKAGE; HOSTINGER ACCEPTANCE UNVERIFIED; RELEASE HOLD.**
Starting source `6cce73bfd0f1a6fc42a449bbb7306fe2fd5848a5` (GS-LAUNCH-004).
Branch `codex/gs-launch-005`; isolated worktree
`C:\Users\atikm\.codex\worktrees\gs-launch-005\Gridsmith Ltd`.
This phase authorises local work and a local commit only. Nothing is pushed, installed or published.

## 1. Authority, product and evidence limits

Read GS-LAUNCH-004 and its proof fixtures, GS-LAUNCH-002/003 controls, 05-HANDOVER,
PROJECT-STATUS, AI-HANDOFF, OWNER-ACTIONS, AI-DEVELOPMENT-PROTOCOL, agent strategy,
master PROJECT-RULES/DESIGN, GS-HOST-004/server dependency matrix, H4-B/D/E/G and
HOSTINGER-STAGING-WORKFLOW, current build/artifact/HTTP/UI/selftest mechanisms and host rules.

The recorded product is **existing Hostinger Business PHP/HTML web hosting**, with static files
under `public_html`, separately from managed Node Web Apps and Website Builder. This is documented
programme/product evidence, not a fresh account entitlement inspection. No hosting account settings
were accessed. No live WordPress or temporary-site request, fault or mutation was needed. Provider
connectors for other services do not establish Hostinger permissions. Public official documentation
was consulted on 23 October 2026; machine-readable source URLs and classifications are retained.

### What public Hostinger evidence establishes

- [Custom error pages](https://www.hostinger.com/support/1583295-how-to-customize-your-website-s-error-pages-in-hostinger/)
  describes entering HTML for individual error codes via hPanel Error Pages, and resetting the default.
  Its AI Builder exclusion is another reason to distinguish products. It does not establish this
  account's storage path, mapping implementation, independent headers or malformed-root survival.
- [Hostinger's control-panel guide](https://assets.hostinger.com/content/tutorials/pdf/Guide-To-Using-Hostinger.pdf)
  lists editing 400/401/403/404/**500** error pages. This is historical product documentation;
  it is not evidence that 502/503/504 edge templates are editable on this account.
- [CDN caching](https://www.hostinger.com/support/how-hostinger-cdn-caching-works/)
  says 5xx responses are not stored, **but an earlier cached copy may be served during origin errors**.
  It identifies STALE and UPDATING responses, and says private/no-store/no-cache keeps HTML out of
  cache. Therefore a no-store error document alone does not prove the visitor receives that document
  instead of an older successful page. This needs origin/edge fault acceptance and cache history.
- [CDN error troubleshooting](https://www.hostinger.com/support/hostinger-cdn-troubleshooting-website-errors/)
  distinguishes origin and edge causes, including edge timeouts; `x-hcdn-request-id` and
  `x-hcdn-cache-status` identify delivery/cache observations. It describes separate cache layers.
- [CDN header management](https://www.hostinger.com/support/8052370-advanced-cdn-header-management-at-hostinger/)
  permits Cache-Control through `.htaccess` or PHP. This proves neither error-specific header control
  outside a broken `.htaccess` nor account authority to change provider configuration.

Existing H4-D records already observed hCDN stripping headers from raster responses and substituting
temporary-domain robots.txt. Those dated exceptions were limited to that site and do not waive any
HTML error requirement here. No current CDN state is inferred from those receipts.

### Provider-dependent capability decisions

| Requirement | Determination | Precise evidence still needed |
|---|---|---|
| Product/site/permissions | Recorded Business HTML hosting; current entitlement UNVERIFIED | Owner-authorised redacted site/product and Error Pages permission record, exact intended root/site, operator identity |
| Custom 500 HTML | Public product support established; account implementation UNVERIFIED | Actual 500 option, saved mapping/template bytes and source of status generation |
| Independent storage | UNVERIFIED | Provider-supported path/template store outside replaceable `public_html`, ownership/permissions, deployment deletion exclusions |
| Independent mapping | UNVERIFIED | Configuration scope and parent traversal proving the mapping does not depend on release-root `.htaccess`; provider statement plus authorised isolated fault receipt |
| Original 500 retained | UNVERIFIED on Hostinger | Raw origin/edge GET and HEAD status, headers and exact body hash; no 3xx or soft 200 |
| Error headers | UNVERIFIED outside broken root | Supported mechanism for CSP/no-store/security headers at the independent boundary, measured with healthy and malformed release config |
| CDN/other proxy | UNVERIFIED for actual site | Current layers/settings, cache precedence/stale behaviour, direct-origin method approved by provider, edge/origin receipts and cache-history tests |
| Provider 500/502/503/504 | UNVERIFIED | Which layer generates each class, editable templates/permissions, original statuses and accessible bytes for controlled authorised fault cases |
| Missing/unreadable independent resource | Known local failure mode; Hostinger UNVERIFIED | Outer accessible fallback or explicit unresolved acceptance; ownership, monitor and rollback evidence |

Generic [Apache ErrorDocument](https://httpd.apache.org/docs/2.4/custom-error.html),
[Alias](https://httpd.apache.org/docs/2.4/mod/mod_alias.html#alias) and
[Header always](https://httpd.apache.org/docs/2.4/mod/mod_headers.html) support the disposable local
model. They establish **no Hostinger server identity, vhost access, Alias permission or configuration
entitlement**. A filesystem path outside `public_html` alone is insufficient if its mapping still
depends on the broken root. Critical independence remains unproved, so no deployable Hostinger
configuration is generated. If unavailable, return evidence for an owner decision; no hosting
purchase, architecture change, extra proxy or managed SSR migration is authorised.

## 2. Selected package and conditional implementation boundary

Selected source: `ops/hostinger-error/error.html`, with `identity.json` and operator guidance at
`ops/HOSTINGER-ERROR.md`. It follows the GS-LAUNCH-004 neutral specimen, with an added robots meta.
It does not reuse `public/500.html`, whose placeholders and no-loss assertion remain unsuitable.
That public file is unchanged and is **not** the selected host fallback; a direct file request has
ordinary file status and is never a proof of HTTP error handling.

The document has `en-GB`, an error-specific title, exactly one H1 and main, one native homepage
link, no CSS/JavaScript/fonts/images/external dependencies, no form or auto-refresh, and no provider
or stack details. Enquiry delivery is explicitly unconfirmed; nothing claims it was saved/lost.
Recovery is an explicit GET, never an automatic retry/replay of POST. Native layout/focus and no
animation support keyboard, no-JS and reduced motion without dependency on the failing release.

The identity locks exact HTML bytes and configuration **requirements**, including original 500,
operator ownership, storage outside the release root, error URI `/__gs_error.html`, no-store and
restrictive CSP. It carries `providerAcceptance: UNVERIFIED` and `deployable: false`.
It is not an installable configuration. Actual mapping/header syntax waits for provider evidence.
Other status codes retain their original status and need separate outer-template acceptance; no
local synthetic 502/503/504 result is passed off as an accepted provider template.

The builder validates the two operator files before generation and records their identity and
`installed:false` only in its private receipt. It emits no operator files, mappings or promises in
the website or deployment identity. The artifact validator rejects the named operator directories,
reserved error URI and the selected document's distinctive title, including a copy under a legal
path. Existing public/legal route lists and host rules are unchanged. Hash checks protect reviewed
bytes; they do not independently certify newly edited/rehashed HTML. Such edits need served review.

## 3. Files and verification reach

- `ops/hostinger-error/{error.html,identity.json}` and `ops/HOSTINGER-ERROR.md`: nonpublic operator package.
- `scripts/check-static-artifact.mjs`: operator identity validator and public-artifact exclusion.
- `scripts/check-static.selftest.mjs`: positive pair plus 13 named adverse proofs; in-memory only.
- `scripts/build-static.mjs`: preflight validation and private receipt binding; no `.htaccess` change.
- `scripts/source-files.mjs`: explicitly classifies the nonpublic operator directory and names its
  dedicated byte validator/public-artifact exclusion; it contains no application code.
- `gs-launch-005-proof/{apache.conf,setup.mjs,verify.mjs,README.md}`: permanent disposable subjects,
  isolated simulation and repeatable acceptance/adverse checks; not CI or hosted installation tools.
- This report, `GS-LAUNCH-005-EVIDENCE.json`, compressed raw proof evidence and current handoff,
  status, owner-action and master-tracker checkpoints.

Existing callers were traced before edits: builder, artifact CLI and static selftest. No package,
lockfile, workflow, application component, CMS/database function, legal source or host-rule generator
changes. No new dependency or parallel replacement gate. The existing static selftest remains in
verify:static; public artifact generation remains subject to its existing release refusals.

## 4. Local acceptance and adverse evidence

Results are bound to files and hashes in `GS-LAUNCH-005-EVIDENCE.json`; full raw error/axe evidence is
retained under `gs-launch-005-proof/evidence/`. Apache is **Debian 2.4.68**, running unprivileged in
the labelled task container from the pinned local Node image. Loopback only; no TLS or CDN.

The simulation copies the generated rehearsal, preserving the original. Only its disposable `.htaccess`
copy removes deny-all, translates host/origin to loopback and removes HTTPS redirection. Its exact
adaptations/configuration identity are recorded. Production PHP/dotfile denial, normal security/cache
rules, legacy and slash redirects, file/route handling and branded 404 remain exercised. The unchanged
rehearsal is also served separately and must still refuse with 403. This is not full hosted parity.

The final machine receipt records these questions separately:

1. Induced HTTP 500 GET/HEAD: original status, exact operator bytes (empty HEAD), no redirect/cookie,
   no-store, CSP, nosniff, frame denial, referrer/noindex/permissions/HSTS header declarations.
2. Initial browser HTML at 320/375/768/1440px, JavaScript on/off and reduced motion: language,
   title, one H1/main, no overflow, no subordinate error-page request; Tab reaches a visible outlined
   link and Enter recovers to the homepage by GET. Human screen-reader acceptance remains open.
3. Axe on semantically identical script-free DOM replays: WCAG 2/2.1 A/AA, 2.2 AA and best-practice
   tags; zero violations/incompletes required. Each replay must detect its own missing-language
   adverse subject before its positive result is trusted. Full objects retained.
4. Local synthetic POST: exact HTTP 500 document, no redirect or automatic replay. No live enquiry,
   application intake, outbox or email is called.
5. Every generated file except forbidden `.htaccess` is served byte-identically; eligible routes,
   branded unmatched/gated 404s, assets/MIME/cache/security policy, host/PHP/dotfile denials and
   slash/legacy redirects are asserted. `__deployment.json` remains identical and nondeployable.
6. Broken release `.htaccess`: the independent fallback retains accessible 500 bytes. Same-root
   mapping works first, then its malformed-root case returns the inaccessible default: rejected.
   The independent broken-root request is `/about` (200 before injection), so the malformed root
   must actually be traversed; the server-level induced-error rewrite cannot mask that predicate.
7. Missing and chmod-000 independent fallback: original 500, bounded response/no redirect, inaccessible
   default body: **deliberate accessibility FAIL**, not a recovered state. Synthetic unmapped
   502/503/504 likewise retain their statuses and expose uncovered outer-template requirements.
8. Captured-byte/permission restoration precedes browser acceptance; restored 500 and homepage pass.
   All original rehearsal bytes remain identical after the run. Seven adopted legal texts and
   register stay identical to the starting Git commit; seven OWNER_ADOPTED, zero PUBLISHABLE.
9. Existing static/selftests and artifact checks cover exclusions and review suppression; the phase
   receipt records explicit analytics/review source preservation and browser network observations.

Final focused boundary result: **288 HTTP cases and 8 browser cases PASS locally**; 8 positive
axe analyses have zero violations/incompletes, with 8 named missing-language adverse detections.
The fresh rehearsal emits **54 eligible routes, 201 files, 29,015,778 bytes**. The 375px no-JS
focused-link screenshot was visually inspected: complete text, visible focus and no clipping.
The existing `verify:static` suite passes (typecheck, lint, source/security/content/legal and
consumer selftests included). The existing static UI gate passes 13 pages, 13 focused axe analyses
and 13 no-JS pages, including scenes/navigation/skip-link/404 checks. The changed static selftest
also passes after separating each path-exclusion probe from the content-title probe. No full-site
WCAG certification or new remote performance measurement is implied.

An initial build used the primary checkout's Next 15.5.27 dependency installation and is retained as
**NOT ACCEPTANCE**. It was replaced by a clean build using the matching existing isolated Next
15.5.28 installation; no dependencies were installed/upgraded or lockfiles changed. Initial Apache
runs failed because the simulator did not explicitly permit MultiViews; adding mod_negotiation alone
did not resolve that permission. Explicit simulator override permissions corrected it. A wrong-host
probe using fetch was invalid because its requested Host override was not transmitted; the final
probe uses Node's HTTP request transport. These failed runs are retained, not counted as passes.
The first broad static suite also correctly refused the newly introduced, unclassified `ops/`
directory. Its explicit source-discovery classification now names the dedicated validator and
artifact exclusion; no source-scan threshold was relaxed.

All five required read-only stage audits completed without actionable source/design/accessibility
findings. Final content/rules evidence review caught incorrect decoded sizes/hashes on 20 already
compressed archives; the archive bytes were intact. The receipt now derives decoded metadata by
gunzip and every encoded/decoded archive hash, source hash and protected-input hash is asserted.
The final raw Apache fault log is retained and the labelled task container has been removed.

Remote exact-SHA CI/Linux Lighthouse, actual Hostinger origin/edge/status/headers/TLS, screen readers,
physical devices and owner acceptance are **UNVERIFIED / NOT RUN**. The separate normal Next SSR
M-P1-1 initial-document failure remains open; this static package does not repair or waive it.

## 5. Future operator installation procedure — not authorised for execution

The exact Hostinger UI/path/directives cannot honestly be specified until the table in §1 is answered.
This is the required ordered procedure and receipt contract; the installation step is deliberately
conditional rather than a guessed provider command. No stage here authorises the next one.

1. Obtain explicit permission naming the site, operator, read/configuration access, isolated fault
   host, fault paths/methods/duration, rollback, CDN actions and prohibited live WordPress/mail/DNS
   changes. Keep real traffic and enquiry processing outside the experiment. Provider questions are
   prepared here; no message is sent to Hostinger or another person.
2. With that authority, capture current error-code mappings/templates and configuration scope,
   exact bytes/hashes, storage/ownership/permissions, document root and deployment exclusions,
   enabled origin/edge layers, rules/cache state and existing security headers/statuses. Export
   redacted records; keep private account details/credentials outside Git. Capture the known-good
   website artifact identity and independent template separately. Prove restore capability before
   any fault or write; an hPanel Reset is not a substitute for restoring a known custom template.
3. Confirm supported independent placement/mapping/header mechanism in writing and in the authorised
   isolated host. Freeze the exact provider-approved configuration and its hash alongside the
   reviewed operator document hash. Confirm normal website deployment cannot delete/replace it.
   **STOP if that independence or permission cannot be proved.**
4. Preserve the previous template/configuration as a versioned operator backup, with tested readable
   bytes and permissions. Install the independent file/template **before** any website cutover.
   Read back/hash the installed bytes; validate provider syntax and mapping at the correct boundary.
   Only then apply the provider-approved mapping and error-specific header policy. No WordPress
   root edits, source-branch sync or cutover is implied by template installation.
5. On the explicitly authorised isolated host only, measure origin GET/HEAD/POST fault responses,
   direct-template access, invalid-root/missing/unreadable fallback, recursion/redirect limits,
   restoration and normal/404/security/asset regressions. Preserve status/header/body hashes and
   no-JS/keyboard/axe evidence. Test provider-generated 500/502/503/504 separately; an origin-file
   rewrite cannot stand in for a provider timeout or edge failure.
6. Verify through each actual CDN/proxy as well as a provider-approved direct-origin path. Compare
   bytes/status/headers on cold and warm requests, prewarmed-success then origin failure, request IDs,
   Age/cache status and repeated restored responses. Establish stale-success and outer error-template
   behaviour explicitly. Any CDN Development/flush/disable action needs named approval; disabling
   CDN can affect DNS and is **not authorised here**. Query-string changes alone do not prove cache
   bypass. HSTS declaration over local HTTP does not establish HTTPS acceptance.
7. Retain separate signed/owner acceptance of provider capability, independent-fallback installation,
   exact website artifact, hosted checks, legal publication and cutover. Preserve H4-B and all other
   launch blockers. Website publication remains a later explicitly authorised execution phase.

## 6. Rollback procedure and acceptance

Before starting, identify the previous independent-template/configuration pair and known-good website
identity, backup location, exact provider restore actions, responsible operator and stop/abort criteria.
If syntax, status, bytes, headers, isolation or cache acceptance fails, stop new publication and faults.
Restore the previous approved mapping/configuration using the captured provider mechanism; restore
the matching known-good independent document and permissions. If a website cutover was separately
authorised and occurred, restore its exact prior artifact independently. Do not delete the only working
fallback or reset provider defaults as an improvised rollback. Keep faults removed and record read-back
hashes/statuses for both restored configuration and document.

Then verify healthy homepage/division/service and asset bytes; true branded 404; controlled true 500
with original status and accessible initial/no-JS HTML; intended headers/cache behaviour; keyboard
recovery; no redirect/error recursion; and origin/CDN cold/warm parity. Compare deployment identity
and all required security/redirect restrictions. Restore only approved CDN settings/cache state and
confirm after reload; preserve request IDs/times and fault-restoration evidence. If the prior provider
fallback is inaccessible, record rollback restoration separately from accessibility acceptance: restoring
an old defect is not a pass. WordPress files/database, DNS and mail recovery remain separately gated.

## 7. Blockers and next single task

Static release remains **HOLD** for independent Hostinger mapping/storage/headers, actual origin/CDN
and provider error-class acceptance. Exact-SHA remote CI/performance/provider push safety and hosted/
human acceptance are pending. The seven exact OWNER_ADOPTED legal documents remain zero PUBLISHABLE;
publication/cutover/channel and WordPress/DNS/mail restore proof remain owner-held. No legal wording
changed. H4-B production intake/current sender/notification/drain evidence is separate. Analytics and
Freelancer reviews remain disabled; the three GS-X002 Technical records and public Path Finder stay
excluded. No agency agreement, client authorisation, transfer clearance or rights execution is presumed.
The inherited exact-lockfile **17 high toolchain findings across three advisories remain unresolved
and unaccepted**; no fresh audit or waiver is claimed. Normal live Next SSR remains blocked by M-P1-1.

**Next single recommended task: GS-LAUNCH-006 — owner-authorised Hostinger capability evidence collection.**
Obtain redacted account/site evidence and provider confirmation for the precise §1 checklist; name any
permitted read-only account scope explicitly. Return a supported configuration/isolated-fault proposal
for separate approval. No hosting write, deployment or fault is authorised by that recommendation.
If support is not established, retain HOLD and return the provider evidence for an owner decision.

Local commit SHA and clean worktree status are reported at closeout. The portable receipt records
source/input/legal/proof hashes and primary-checkout preservation. The task container is removed
after evidence capture. No push, remote dispatch, deployment, hosted configuration mutation, DNS,
WordPress/email change, Production Supabase/CMS write, legal publication or activation occurred.
