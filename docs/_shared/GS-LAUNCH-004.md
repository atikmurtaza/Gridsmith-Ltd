# GS-LAUNCH-004 — SSR error accessibility remediation design

23 October 2026. **DESIGN DECISION: retain static Hostinger delivery; require an independently served,
accessible host error response before static release. Normal Next SSR acceptance remains FAIL.**
This is a design and local proof, not a hosting implementation, launch approval or closure of M-P1-1.
GS-LAUNCH-005 requires separate approval and has not begun.

## 1. Source, scope and preservation

Starting candidate: `00cb2d0e5111a9cccc0d6d74d544b07ce16b9cd7`, `codex/gs-launch-003`.
Dedicated branch: `codex/gs-launch-004`; worktree:
`C:\Users\atikm\.codex\worktrees\gs-launch-004\Gridsmith Ltd`.
The primary checkout and its pre-existing changes are preserved; the final evidence receipt verifies
its HEAD, status, file set and individual hashes against the before snapshot.

Read authority includes GS-LAUNCH-002/003 and their evidence, PROJECT-STATUS, AI-HANDOFF,
05-HANDOVER, OWNER-ACTIONS, AI-DEVELOPMENT-PROTOCOL, GS-HOST-004 and its server matrix,
Hostinger H4 release/acceptance procedures, master PROJECT-RULES/APP-FLOW, normal/static build
configuration, both permanent error probes, global-error/global-not-found, generated host rules,
static artifact/selftest/HTTP/UI checks and existing accessibility evidence. Historical hosted receipts
establish programme decisions, not current provider configuration or acceptance of this SHA.

Changes are confined to this report, supporting **nondeployment** proof fixtures/evidence, and current
control-file checkpoints. Application source, permanent probes, thresholds, package/lockfile,
workflows and production host-rule generation are unchanged. No provider-independent application
correction was demonstrated, so none is invented or committed. The proof HTML is a specimen,
not a replacement public website or an adopted production document.

Local Node is 24.15.0; the existing Windows dependency installation reports Next 15.5.28 and
React/React DOM 19.2.8. Dependencies are reused through a junction in this worktree; no install,
upgrade or dependency-file mutation is needed. Fresh normal and static rehearsal builds use separate
new output directories. No `.env` file or privileged credential is copied into the worktree/container.
The local build reads public Sanity content; browser traffic is GET/navigation, with no live form submit.

## 2. Root cause and exact reproduction

The unchanged permanent `/gridsmith-ssr-throw-probe` is `force-dynamic` and throws at request time.
It is included in the normal production-mode build and structurally excluded from static export.
The raw initial response is retained in `gs-launch-004-proof/evidence/ssr-initial.html`;
status, headers, byte length, SHA-256, browser findings and recovery are in `GS-LAUNCH-004-EVIDENCE.json`.

| Subject | Observed result | Accessibility decision |
|---|---|---|
| Uncaught SSR, initial response | HTTP 500; `<html id="__next_error__">`; no lang, H1 or main; title `Gridsmith Ltd` | **FAIL** |
| Same response, JavaScript disabled before navigation | Empty visible body; missing language, heading and main persist | **FAIL** |
| Same URL, hydrated | HTTP remains 500; `en-GB`, one H1, one main, error title, keyboard-focusable Try again | Focused automated **PASS**, not initial-response repair |
| Retry permanent throw | Keyboard activation leaves the deliberate error boundary visible | No successful retry claim or proof of reset internals |
| Recovery to `/about` | Healthy page renders with one H1, with and without JavaScript | **PASS** |
| Client-only permanent throw | Initial HTTP 200; accessible global boundary after hydration | Separate client path; focused axe **PASS** |
| Ordinary unmatched URL | HTTP 404 with its own language, H1 and main | Separate not-found path, **PASS** |
| Static exported `500.html` fetched as a file | HTTP 200; bytes match artifact; Vercel placeholder text remains visible | Separate file, no host-error acceptance implied |

Axe finds `html-has-lang` (serious), `landmark-one-main` and `page-has-heading-one` (moderate)
on the no-JS SSR document; the latter two include best-practice checks. Hydrated SSR and client
boundary analyses have zero violations and unresolved incompletes. No-JS DOMs are captured with
scripting disabled. Axe runs on a script-free replay with asserted identical visible text, language,
title, headings, landmarks and overflow state; removing language in that same replay must produce the
named violation. This avoids claiming that axe can run as page script while scripting is disabled.
Coverage matches the existing suite's WCAG 2 A/AA, 2.1 A/AA, 2.2 AA and best-practice tags. Full
axe result objects, including the deliberate missing-language runs, are retained in the compressed
`gs-launch-004-proof/evidence/axe-full.json.gz` archive; the portable receipt gives finding summaries.
Screenshots of the blank no-JS response and accessible host specimen were also visually inspected.
These automated checks are not human screen-reader or full WCAG certification.

The [15.5.28 tagged renderer](https://raw.githubusercontent.com/vercel/next.js/v15.5.28/packages/next/src/server/app-render/app-render.tsx)
constructs the empty document in `getErrorRSCPayload` and supplies GlobalError separately to the router.
The installed renderer and the actual response agree. `app/global-error.tsx` already declares language,
title, H1 and main; its hydration cannot retroactively make initial HTML accessible. Supported
[Next 15 error conventions](https://nextjs.org/docs/15/app/api-reference/file-conventions/error)
require a Client Component and independent html/body. A new root layout, effect setting lang,
segment error boundary or public file alone does not prove repair of this path.

This concerns an **uncaught render exception**. An application-handled expected failure may render
ordinary accessible markup; a form's field/network errors, exported 404, missing static file and
provider-generated 500/502/503/504 are different subjects and must keep separate gates.

## 3. Supported options, investigated in order

### A. Framework correction — no demonstrated remedy

Live npm registry metadata lists `15.5.28` as the highest stable 15.x release and `16.4.2` as latest.
The latter's [tagged renderer](https://raw.githubusercontent.com/vercel/next.js/v16.4.2/packages/next/src/server/app-render/app-render.tsx)
still constructs `html` with only `id: '__next_error__'`, an empty head and body, then supplies GlobalError
separately. This is source evidence, **not a 16.4.2 runtime compatibility test or an exhaustive claim
about every version/configuration**. No documented configuration fixing the initial document was found.
Canary/pre-release changes are not an accepted production remedy. Registry metadata and source hashes
are retained in the machine receipt; no alternate Next installation or lockfile change was performed.

Both inspected versions accept React 19 and the local Node version in declared peer/engine ranges.
That alone does not prove static export, four root layouts, experimental globalNotFound/inlineCss,
custom pageExtensions, bundle floor, scene or release-safeguard compatibility. A future evidenced fix
must first be demonstrated in a disposable copy using the permanent SSR/client/no-JS subjects,
then normal/static builds, probe exclusions, security, bundles and relevant browser gates. No major
upgrade is justified by the present evidence or authorised here.

The current [support-policy table](https://nextjs.org/support-policy) labels 15.x Maintenance LTS and
16.x Active LTS, while its stated two-year maintenance duration from 21 October 2024 has just elapsed
on the task date. **Lifecycle status at release requires clarification**; the table is not a guarantee
of future patches. This does not supply an accessibility fix or authorise an upgrade.

### B. Independent serving-boundary response — preferred, conditional on actual host support

[Apache ErrorDocument](https://httpd.apache.org/docs/2.4/custom-error.html) supports a local error
resource; an external URL would redirect and must not substitute for the original error status.
[ProxyErrorOverride](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html#proxyerroroverride)
can replace selected upstream error statuses (the explicit status list requires Apache 2.4.47+).
Neither feature requires patching Next internals.

The local specimen uses a plain complete HTML document: `en-GB`, a meaningful title, one H1/main,
one native homepage link, no scripts, stylesheets, fonts, provider substitutions or runtime dependencies.
It makes no claim that a failed enquiry was saved or lost. Its only recovery navigation is a GET;
it never automatically replays a POST. The existing `public/500.html` has Vercel request/error
placeholders and an unqualified no-loss assertion; it is **unchanged and unsuitable to reuse verbatim**.
The existing global client error's no-send assertion is also not a general transactional guarantee;
no content change to that boundary is made in this design phase.

The Apache specimen's fallback is outside the simulated release document root and does not read its
`.htaccess`. `AllowOverride None` protects that fallback directory. Error responses retain the original
500/502/503/504 status. An exact error location supplies CSP `default-src 'none'; base-uri 'none';
frame-ancestors 'none'; form-action 'none'`, no-store/max-age=0, nosniff, frame denial, no-referrer,
noindex, Permissions-Policy and HSTS. `Header always` is necessary on error responses and the normal
header table's Cache-Control is cleared. No cookies or subordinate page-resource requests are needed.
Actual HTTPS/HSTS enforcement and CDN retention are **UNVERIFIED** by this HTTP-only local test.

For a hypothetical SSR host, document GET/HEAD requests advertising text/html are eligible for selected
5xx replacement; RSC requests, APIs and mutation methods must retain their own protocol. The fixture
tests an actual Next document crash through Apache, an RSC failure compared with the direct upstream,
and a synthetic `/api/` path remapped only to the permanent throw specimen. That API-prefix case
retains the upstream 500/type/bare shell even when Accept is text/html. It calls no real application
API. General API namespaces beyond the fixture's `/api/` exclusion remain unverified.
2xx pages and the application's 404 pass through. It is **not** an approved new SSR hosting topology.
Provider control of proxy/server configuration, streaming and direct-origin access remain prerequisites.

Failure tests are decisive:

- A same-root `.htaccess` ErrorDocument can serve the specimen in the ordinary case, but a malformed
  `.htaccess` makes the fallback inaccessible too. **Rejected as sufficient on its own.**
- A separately configured fallback remains accessible when the release root's `.htaccess` is malformed.
  This demonstrates the required isolation property locally.
- Removing that independent fallback file still produces Apache's inaccessible default response.
  No infinite redirect or successful recovery is claimed. The file must be operator-controlled,
  protected from release replacement/deletion, present before switch, monitored and rollback-proven.
- A server/CDN outage, rejected server configuration, inaccessible independent storage, or failure
  after response headers have already streamed cannot be repaired by that same failed boundary.
  A provider-owned outer error template or further independent boundary must cover the applicable
  fault class, or acceptance remains open. Replacing a body after HTTP 200 has begun cannot restore 500.

[Hostinger documents HTML custom error pages through hPanel](https://www.hostinger.com/support/1583295-how-to-customize-your-website-s-error-pages-in-hostinger/).
That establishes a supported product feature, **not** this account's storage isolation, `.htaccess`
failure coverage, reverse-proxy permissions, error-status/header preservation or hCDN behaviour.
No account/panel setting was inspected or changed. Do not assume the actual Hostinger service is
Apache merely because the release uses Apache-compatible rules, or purchase/change hosting to match
the simulator. Apache 2.4.68 on disposable Debian is the measured local engine only.

### C. Other supported approaches

Explicitly handle known service failures at the application boundary to preserve useful state; this
reduces expected failures but leaves generic uncaught SSR errors unresolved. Provider-managed error
templates or a maintained external reverse proxy are viable only with actual topology/support evidence
and the same initial-HTML/status/security/recovery tests. A custom application server that buffers and
rewrites HTML would add runtime ownership, streaming/protocol complexity and maintenance without
solving the intended static release; it is not selected. The prior Vercel public/500 experiment did
not intercept SSR/platform errors; file placement alone is not retried as a remedy.

## 4. Actual deployment applicability and gates

The current programme's GS-HOST-004 architecture and `lib/build/target.ts`, `build-static.mjs`,
`lib/build/hostinger.ts` and production safeguards agree: **Hostinger serves exported files; there is
no persistent Next server in that intended path.** Sanity reads happen at build time, scenes run in
the browser and form integration uses the separately controlled external intake. The Next build
default `normal` is a distinct profile; NODE_ENV=production does not select static delivery.

A fresh guarded production rehearsal from the exact starting commit emits 54 eligible routes,
201 files including the deployment identity (200 entries in that identity's file list),
`profile: production`, `rehearsal: true`, `deployable: false`, Preview intake and
`Require all denied`. Both permanent error routes and dynamic route handlers are absent from the
export. Seven legal documents, the three GS-X002 Technical records and the public Path Finder remain
excluded. The receipt binds artifact identity and hashes. The original rehearsal artifact is unchanged.
Only a disposable **copy** is served with explicitly different simulation routing; this bypasses neither
the release refusal nor the original deny-all policy. It cannot establish full Hostinger rule parity.

| Deployment profile | M-P1-1 applicability | Required release question and current status |
|---|---|---|
| Intended static Hostinger artifact | The Next request-time render crash cannot execute when serving files. Mechanism **NOT APPLICABLE**; not a fix or waiver | Initial accessible origin/CDN 500, independent fallback and 404/status/headers/recovery must be proven. **UNVERIFIED / HOLD** |
| Separately running live Next SSR profile | The reproduced failure applies; no framework repair | Initial document/no-JS SSR **FAIL**. HOLD until supported upstream fix or verified, nonbypassable document-serving boundary; keep RSC/client/streamed-error gates separate |
| External intake/worker APIs | Not a Next document render | Existing API JSON/CORS/error/input-retention/notification gates remain independent and unchanged |

Therefore **M-P1-1 itself need not block a strictly static release**, once file-only delivery and its
own independently accessible error handling are established. It currently cannot be dismissed as
"static, therefore launch-ready": host error acceptance is missing and current generated rules only
configure `ErrorDocument 404`. A static SSR build failure is a pipeline failure: leave the last good
release live and abort publication, rather than publish an error artifact.

## 5. Local proof and evidence qualification

Retained fixtures: `gs-launch-004-proof/error.html`, `apache.conf`, `static.htaccess`, `co-located.htaccess`, `verify.mjs`,
`adverse.mjs`. They are not invoked by CI, exported, copied to public/, or a new release gate.
The existing static and normal accessibility gates remain authoritative for their existing questions.
`GS-LAUNCH-004-EVIDENCE.json` records final individual outcomes and unsuccessful attempts separately.

| Check | Result |
|---|---|
| Fresh normal Next 15.5.28 build | PASS |
| Exact SSR initial/no-JS failure | Confirmed FAIL; successful characterization does not close it |
| Hydrated SSR and client-only boundary semantics/axe/recovery | Focused PASS; permanent throw does not recover by retry |
| Fresh nondeployable static rehearsal, exclusions and integrity | PASS for named local profile questions |
| File-host 500 and proxied real SSR 500 | Local prototype PASS: original status, independent accessible HTML |
| Connection refusal / synthetic upstream errors | Local response/status results recorded separately; refusal is 503 in this Apache test, not assumed 502 |
| No-JS/JS, 375/768/1440, axe, keyboard link/recovery | PASS: 36 boundary browser analyses, zero violations/incompletes; 62 total boundary cases. Full archive: 58 axe results including SSR and adverse subjects. No hosted/manual acceptance implied |
| Missing fallback / malformed same-root config / isolated config failure | Adverse results retained; missing fallback and same-root config deliberately FAIL accessibility |
| Normal files/routes/404 and RSC protocol | Final receipt compares static HTML to original artifact bytes and proxied HTML to direct Next bytes |
| Existing full check:axe and security-header regression | PASS: 76 analyses over 19 routes, zero violations; security headers on three routes. Its SSR characterization remains a known FAIL |
| Existing static selftests, legal adoption and secret scan | PASS; no threshold or legal state change |
| Hosted origin/CDN, TLS, screen reader, physical devices, remote exact-SHA CI/Lighthouse | UNVERIFIED; not run |

An initial server launch was refused because its chosen port belonged to this task's own container
mapping; it measured no application and was moved to a separately checked free port. Initial axe
execution with scripting disabled failed; the established validated DOM-replay method supersedes it.
An early upstream-refusal assertion incorrectly expected 502; actual Apache response is 503. An early
simulation lacked DirectorySlash Off and failed the real Design directory collision; the simulator
was corrected, without changing generated production rules. A later aggregate overlapped an Apache
fault injection and is **INVALID for boundary acceptance**, even if other independently owned Next
regression commands pass. It is retained; final adverse and boundary runs are sequential, with subject
bytes restored before acceptance. A whole-rehearsal configuration import also hit an absent simulator
option/module premise; it is not credited as hosted/profile refusal evidence. No failed receipt is
relabelled PASS.

The same-root positive specimen initially induced its 500 during server rewrite, before per-directory
ErrorDocument configuration had been loaded. That was an invalid ordinary-success premise for the
`.htaccess` mapping. Moving the synthetic throw into the same per-directory rewrite phase establishes
the ordinary mapped response before separately breaking that configuration; the final run uses the
committed `co-located.htaccess` specimen. This does not repair the broken-configuration failure mode.

The RSC comparison also rejected two incorrect proof assumptions: the actual upstream streams an
error record with HTTP 200, and separate requests carry random metadata keys. The final proof compares
actual direct/proxied status and content type plus a nonempty identical set of error records; it does
not manufacture a 500 or claim raw payload byte equality. Normal static/proxied HTML byte comparisons
remain separate. This is direct evidence of the limitation of status-only error substitution.

## 6. Required approval, implementation scope and rollback

No hosted action is necessary to finish this design. **Hostinger/provider verification and any hosted
configuration change require a separately authorised phase.** The concrete proposed change is:

1. Install a neutral complete error document/template at a provider-controlled boundary outside the
   versioned release root and its `.htaccess` failure path; map HTTP 500 to it without a 302/200.
   Preserve existing 404/redirect/host-lock/PHP-denial and security policies. For proxy errors, preserve
   each original 502/503/504, scope HTML substitution to document GET/HEAD and keep RSC/APIs intact.
2. Apply and measure error-specific no-store, CSP and security headers at that boundary, through the
   actual CDN as well as the origin. No customer input, stack, digest, path or provider identifier in HTML.
3. Establish supported Hostinger storage/configuration isolation and the relevant fallback failure
   behaviour. Use scoped, reversible synthetic faults on an explicitly approved isolated host only;
   do not corrupt live WordPress or a production `.htaccess` to prove the design.
4. In a later implementation commit, update the existing host-rule/artifact/HTTP/selftest mechanisms
   and their subject/dependent lists where required; preserve permanent adverse specimens and all
   thresholds. Replacing `public/500.html` alone is not sufficient. Keep release-generated files and
   operator-owned recovery configuration distinct and include both in acceptance/rollback receipts.

Before hosted modification, capture the exact old error mappings, template/configuration bytes,
headers/CDN behaviour, configuration owner, last good artifact and restore procedure. Install/test the
independent fallback before switching the release. Roll back only the approved mappings/configuration
and exact prior artifact; verify normal routes, true 404, true 500 and cache behaviour after restoration.
If provider independence is unsupported, stop for an architecture decision; no VPS, new paid service
or SSR deployment is authorised. Existing WordPress/DNS/mail restore readiness remains separate.

## 7. Independent blockers and next single task

Seven canonical legal texts and their register remain unchanged: **seven OWNER_ADOPTED, zero
PUBLISHABLE**. Freelancer reviews and analytics remain disabled, Technical/public Path Finder
exclusions and intake restrictions remain, and approved company facts are unchanged.
The GS-LAUNCH-003 audit's **17 high toolchain entries across three advisories remain unresolved and
unaccepted**; that is inherited exact-lockfile evidence, not a fresh audit in this phase.

Other independent launch gates remain: exact-SHA remote Linux CI/performance acceptance; current
provider Git/App/webhook/publication safety; Hostinger origin/CDN/cookie/security/redirect acceptance;
current production intake/sender/drain evidence; restore-proven WordPress and DNS/mail recovery;
all-seven publication/channel/cutover authority; human confidentiality, visual/device/assistive-technology
acceptance; applicable agency/access/transfer/rights execution. Nothing here closes those gates.

**Next single recommended task, only after separate approval: GS-LAUNCH-005 — static Hostinger
independent error-response implementation and isolated hosted acceptance.** First establish actual
provider support/placement and precise permitted host/configuration/fault/rollback scope, then implement
and verify the selected boundary using this design. If isolation is unavailable, return the provider
evidence for an owner architecture decision. Do not proceed with a normal SSR release in parallel.

Five read-only stage audit roles completed. Their replay/retry/API/tag/raw-evidence and count findings
were addressed; final accessibility/content rechecks confirm the named results. The task-owned Apache
container was stopped and removed after collecting evidence; the existing wrapper terminated its
owned Next processes. Other containers were untouched. Generated evidence remains under this isolated
worktree, with portable responses/results archived in the committed proof directory.

No push, remote dispatch, deployment, hosted configuration change, Production provider write, DNS,
WordPress/email change, legal publication or analytics/review activation occurred. Local design commit
and final clean worktree status are reported at closeout. STOP before GS-LAUNCH-005.
