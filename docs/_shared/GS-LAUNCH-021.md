> **Integration annotation — GS-LAUNCH-023:** This is the historical phase record, not current action authority. All customer-support recommendations below are superseded by the owner's no-support instruction. No support draft is included in this integration. Raw/private receipts remain in the original local worktrees and preservation archive; the adjacent evidence JSON is a public summary bound to the original file hash. Production robots, PNG CSP and deployed `.htaccess` remain mandatory actual-origin checks.

# GS-LAUNCH-021 — Hostinger delivery diagnosis and acceptance recovery

26 October 2026 (Europe/London). **CONDITIONAL — diagnosis and browser recovery complete; hosted HTTP FAIL; production cutover NO-GO.**

## Source, preservation and release identity

Initial and current HEAD: `13032b1735c320842d7dc25f3de03afa704d3e33`. Isolated working branch:
`codex/gs-launch-021`, worktree `C:\Users\atikm\.codex\worktrees\gs-launch-021\Gridsmith Ltd`.
The source branch `codex/gs-launch-018` and remote artifact branch remain at their supplied commits.
No commit, push, dispatch, rebuild, deployment, provider-setting change or support message is authorised
or performed in this task. The primary checkout and GS-LAUNCH-018 worktree are preserved. Eight local
GS-LAUNCH-019/020/control records were copied into this isolated worktree; their original SHA-256s are
retained in `build/gs-launch-021/preserved-inputs.json`. Their pre-existing differences are prior work.
GS-LAUNCH-021 then prepends a new status notice to the isolated copies of `CLAUDE.md`, `05-HANDOVER.md`,
`AI-HANDOFF.md`, `PROJECT-STATUS.md` and `OWNER-ACTIONS.md`; those five copies intentionally differ from
their preserved original-file hashes. The original files in the GS-LAUNCH-018 worktree remain unchanged.
The new worktree's ignored `node_modules` junction reuses the existing launch tools without changing
dependencies.

Live preview: `https://mediumaquamarine-wallaby-594070.hostingersite.com`.
Accepted source: `13032b1735c320842d7dc25f3de03afa704d3e33`.
Accepted artifact identity: `8028cb984402db08d7ba016ab656c5602dfdfae5bc3a49fda7f70b6b890a65e4`.
Accepted CI: [40332154565](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/40332154565).
Publication CI: [40367278523](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/40367278523).
Both workflows were re-read through GitHub and remain completed SUCCESS on the exact source.
Published artifact commit: `f1e1da1aad6c5f1dbc4df3a432a0063be3eacf86`.
ZIP SHA-256: `9a6291a8809efbb98e95e2e4cd8dd3fd73a577f921dc20b5ff514fec01959e96`.
Every 212 ZIP files, local release files and current remote Git blob identities match. The 211-entry
payload manifest and acceptance-bound deployment identity are unchanged; 210 payload files are public,
one is protected `.htaccess`, and `__deployment.json` is the additional identity file.

## Fresh hosted findings

The complete HTTP sweep ran **2026-10-26 21:14:51–21:15:15 UTC**. Exact status, timestamps, all response
headers, decoded entity lengths/hashes and CDN request IDs are retained in
`build/gs-launch-021/http-responses.jsonl`. The reused GS-LAUNCH-020 verifier retains its adverse header
fixtures and original assertions; its FAIL is preserved. A separate read-only comparison proves that
all 61 extensionless routes match their own accepted HTML bytes, rather than merely returning 200.

| Finding | Evidence and classification | Disposition |
|---|---|---|
| GS-L021-F1: robots.txt replacement | Public response is 58 bytes, SHA-256 `75959e778007bee9d4989a997f47b50ab03332a9de3404ee9e340e7cc5eb6eab`: Googlebot is disallowed; other agents are allowed. Canonical and unique-query requests agree and omit application security/cache headers. Website-scoped File Manager shows 26 bytes and `User-Agent: *` / `Disallow: /`; its downloaded bytes exactly match accepted hash `0f230582d72fef1d9a0eee00314e25c5b163e2406fd87cdba17eefeb578041b5`. **D/E: provider serving-path override established; exact origin-versus-edge component unknown.** Application/export and a changed on-disk robots file are excluded for this observation. | HTTP acceptance FAIL. No repository rewrite would fix the demonstrated interception. Request supported provider control or a documented domain-specific explanation. |
| GS-L021-F2: obsolete JavaScript and old headers | Complete sweep: 5 of 26 obsolete files return 200; 21 return 404. Canonical responses contain HIT or MISS with old Age/Last-Modified. Later paired requests vary by edge: 3 old JS paths still return 200 while every unique-query old JS request returns 404. One old response has Age `462897` and the prior intake-bearing CSP; current accepted assets use direct-contact CSP. **E: stale caching is demonstrated; MISS does not prove every upstream cache was bypassed. F: untracked origin leftovers are not fully excluded without origin inventory.** | Fail obsolete-file acceptance. Use the observed temporary-site-only CDN Flush cache, then re-run canonical checks. Do not delete files or rebuild on this evidence. |
| GS-L021-F3: PNG CSP absent | All 9 accepted PNG files have matching bytes but no CSP. Fresh-query `/apple-touch-icon.png` is MISS and still lacks CSP; paired SVG and sitemap responses carry current CSP. `.htaccess` source applies `Header always set Content-Security-Policy` globally, including images, and accepted Linux Apache acceptance passed. **D/E: provider delivery/configuration is the supported working diagnosis; exact stripping layer is UNKNOWN (G).** The actual hosted `.htaccess` was listed but not downloaded, so a C-class on-disk configuration divergence is not fully excluded. A query MISS is still a CDN response, not direct-origin proof. | HTTP header acceptance FAIL. Provider must inspect the actual origin rule/header chain and preserve the policy. No CSP removal, narrower assertion or image exemption is introduced. |
| GS-L021-F4: hosted browser harness blocked on Windows | Initial default launch cannot find pinned Chrome `155.0.8059.79`. Existing system Chrome `155.0.8059.85` is available. Its first run reaches the error-document axe pass and fails because the axe adapter resolves a literal `Gridsmith%20Ltd` filesystem path. Every other axe invocation already supplies explicit source. **A: test-harness integration, not website code.** | FIXED locally; complete hosted rerun PASS with unchanged assertions. |

The full public sweep matches **209/210** payload files; robots.txt is the sole byte mismatch.
All 61 routes have noindex HTML and response directives. The empty sitemap matches accepted bytes.
Canonical current payload security headers pass except the 9 PNGs and robots.txt; old CSP is still
observable on obsolete cached JavaScript. Correct response headers on HTML are not supplied by PNG CSP.
These observations do not establish that a fresh visitor can activate the old intake: current HTML is
the accepted direct-contact release. Cached old scripts remain an acceptance and stale-client risk.

Functional/security implications and production scope:

- The robots override permits non-Google crawling despite the intended all-agent crawl refusal.
  HTML/HTTP noindex remains present, but neither directive is access control. An equivalent Googlebot
  refusal on the production domain would also harm intended indexing. Production robots must be tested.
- Old cached scripts can prolong an older client's release and security policy; fresh HTML and the
  hosted browser run use the accepted direct-contact release without failed requests. Contact scenarios
  explicitly observe zero intake requests.
  The same class could affect a custom-domain cutover. A site-specific purge and canonical retest matter.
- PNG bytes/MIME/nosniff pass, so no corrupted or executable payload was observed. Missing CSP still
  violates the agreed response policy; application document CSP remains enforced on the tested HTML.
  Shared origin/image/CDN handling could affect a custom domain. No production exemption is justified.

## Small correction and validation boundary

Only `scripts/check-static-ui.mjs` changes executable repository source. Resolve the existing axe source
once before first use and pass it to error-document `AxePuppeteer`, matching every other call in this
gate and the surrounding repository pattern. This avoids the dependency's URL-encoded Windows path.
No dependency, application file, legal text, hosting rule, route list, assertion, tag or threshold changes.
The gate retains actual 404/500-document checks and its visible low-contrast adverse replay specimen.

The deployed artifact is not rebuilt or edited. Its source/identity remain the accepted release above.
Working test-source changes are uncommitted and are not retrospectively attributed to that release SHA.
Linux regression CI for this harness correction is NOT RUN; hosted Windows execution cannot replace it.
The hosted PASS uses installed Chrome `155.0.8059.85` with Puppeteer `25.14.0`, not the accepted Linux
Chrome `155.0.8059.79`. No downloader, dependency change or claim of exact browser parity is made.

## Provider controls actually inspected

Read-only hPanel inspection selected the exact temporary hostname. Dashboard: Completed manual
deployment **2026-10-26 18:51**, artifact branch `codex/gs-hostinger-artifact`, root `public_html`,
Auto-deployment unchecked. Performance → CDN: domain Active, Development mode off, **Flush cache
available**, **Manage disabled**. The account-wide automatic-CDN opt-out surface was not expanded or
changed. No claim is made that this temporary domain has a supported Disable control, or that the
displayed Development mode toggle would work; it was not touched.

The Hostinger MCP server is not connected (`codex mcp get hostinger`: no such server); no connector
installation or configuration change was made. hPanel supplied the read-only account evidence.
Website-only File Manager showed `.builds`, regular-directory `public_html` and `DO_NOT_UPLOAD_HERE`.
No all-websites File Manager or WordPress file was opened. Browser control later timed out while
returning the robots download and on one subsequent read; the file nevertheless downloaded and was
verified. No further hPanel operations were attempted after those two timeouts.

Hostinger's [CDN availability documentation](https://www.hostinger.com/support/which-plans-include-hostinger-cdn/)
states that temporary domains receive automatic optimization and their CDN settings cannot be modified.
The observed Flush cache and disabled Manage controls are recorded separately from that broader prose.
Its [request-ID and cache-status documentation](https://www.hostinger.com/support/hostinger-cdn-troubleshooting-website-errors/)
defines edge indicators and recommends request IDs for support. Neither document identifies the
component generating this robots file or dropping this PNG header. No origin bypass was achieved.

## Verification receipt

| Check | Result | Scope |
|---|---|---|
| Current remote refs; both Actions runs | PASS | Exact source, artifact commit and successful prior acceptance/publication; no dispatch |
| Accepted ZIP / all local files / remote Git tree | PASS | 212 file names, bytes, lengths, manifest digests and Git blob identities; no extra ZIP files or symlinks |
| Hosted identity | PASS | Exact accepted JSON bytes/source/identity/run |
| Every eligible extensionless route | PASS | 61 status/noindex checks and 61 matching own-page HTML hashes |
| Public payload integrity | FAIL | 209/210; robots mismatch |
| Security headers | FAIL | Nine PNG CSP omissions and provider robots path; current remaining payload/routes pass existing predicates |
| Cache / MIME | FAIL overall | Required asset predicates pass except robots cache/type; obsolete cached responses persist |
| Redirects, compression, HEAD, 404, gated/hidden paths | PASS | Three 308 destinations; Brotli response; GET/HEAD 200 and branded 404; three Technical routes and API 404; hidden paths 403 |
| Hosted legal parity | PASS | Seven documents, 109 clauses and 406 paragraphs; all draft clauses reachable; adoption banners checked |
| Hosted UI / keyboard / no-JS / legal combinations / axe | PASS, focused gate | 20 pages, 20 no-JS pages, 12 contact combinations, 70 legal combinations, 98 legal links; hydration/scenes/navigation/menu/skip/reduced-motion checks; 41 focused axe analyses plus 2 error-document analyses; zero violations, page errors, failed requests or bad responses |
| Axe incomplete accounting | RETAINED; not full AA certification | 22 color-contrast incomplete rule occurrences in the focused analyses, 23 including errors; comparable accepted Linux baseline had 26 across 43 analyses; only 3 prior incomplete occurrences disappear, with no new incomplete rule occurrences. Manual disposition is not claimed |
| Adverse accessibility probe | PASS | Existing visible low-contrast specimen rejected in the actual no-JS replay, then removed before its clean analysis |
| JS syntax / focused ESLint / diff whitespace | PASS | Changed gate parses; targeted ESLint exits 0; `git diff --check` |
| Prior Linux Apache / browser / Lighthouse / audits | REUSED PASS | Accepted source/payload unchanged; both downloaded audit JSON reports have zero findings; no new dependency upgrade |
| New Linux CI / new Lighthouse / real devices / AT / hosted induced 500 | NOT RUN | No new release candidate or fault authority; plain `/500.html` is an error-document browser subject, not an actual hosted 500 |
| Production baseline | PASS, read-only limit | `https://gridsmith.uk/` returns 200 with WordPress markers; production candidate behaviour remains untested |

## Owner actions and shortest route forward

1. **Temporary-site cache operation:** hPanel → Websites → the exact temporary hostname → Dashboard
   → Performance → CDN. Verify the row hostname and click **Flush cache** once. Do not change
   Development mode, automatic-CDN opt-outs, domains, branch/root, auto-deployment or any other site.
   This is the supported control actually observed. This task does not infer approval to execute it.
   Then repeat canonical identity/file/obsolete-path checks and retain the before/after request IDs.
   A cache-busting query is a diagnostic, not a passing substitute for a canonical URL.
2. If robots/PNG failures persist, send the prepared, **unsent**
   technical support request (historical file retained privately; superseded). Ask which provider layer overrides
   the on-disk file and strips headers, what supported site-scoped remedy exists, and whether those
   behaviours apply to a custom domain. Do not authorise provider changes through the enquiry.
3. Production-specific owner inputs remain separate: the dated private O1–O5 operational evidence
   from GS-LAUNCH-015; exact legal publication disposition for all seven OWNER_ADOPTED documents;
   matched WordPress files/database backups and rollback proof; and exact artifact-bound cutover
   approval. No settled contact-channel attestation is reopened and no intake delivery is required.

## Production disposition and next task

The current evidence establishes defects on the temporary serving path. It **does not establish that
robots/PNG defects are temporary-domain-only** or absent on `gridsmith.uk`. They cannot be waived as
proven temporary-only limitations. Production preparation may continue using the accepted, unchanged
release; deployment stays NO-GO until owner/legal/backup/cutover gates and custom-origin delivery
verification are satisfied. Existing WordPress headers are not a test of the future static stack.

Any approved custom-domain transaction must verify the new production identity; every route/file;
intended production robots and non-noindex directives; CSP including images and fresh/existing asset
URLs; cache/MIME/compression/redirect/HEAD/404 behaviour; all-seven served legal parity and direct contact;
then apply the approved rollback if a required check fails. No production canary, DNS mapping or root
switch is performed by this phase. The final production payload has its own profile/identity and cannot
be obtained by relabelling this owner-preview artifact.

**Next recommended task: GS-LAUNCH-022 — temporary-site cache purge and provider delivery disposition.**
Use one approved purge and the evidence-backed support questions; retain mandatory custom-domain
verification and prepare the production transaction without another speculative source rebuild.

Ending HEAD remains `13032b1735c320842d7dc25f3de03afa704d3e33`; working test/docs changes are local and
uncommitted. Final recheck preserves all eight original launch-worktree input hashes; primary/launch
worktree dirty-file inventories are unchanged. Application, packages, legal/register and workflows have
no diff in this task's worktree. Remote source/artifact/main refs are unchanged. Concise machine evidence,
selected exact headers and raw-log digests: [GS-LAUNCH-021-EVIDENCE.json](GS-LAUNCH-021-EVIDENCE.json).
Full read-only receipts and raw axe results remain ignored under `build/gs-launch-021/` and `build/`.

Independent fresh-context read-only review found no material issue after clarifying that the five
isolated control copies intentionally carry new notices. It checked the axe API/diff, same 43 baseline
subjects, incomplete counts, raw evidence digests, original 8/8 file preservation and release-versus-test
identity separation. It did not rerun hosted tests, inspect hPanel/origin, run Linux CI or certify AA.

**Verdict: CONDITIONAL for continuing production preparation; NO-GO for production deployment.**
Hosted browser acceptance is recovered. Hosted HTTP acceptance remains FAIL until the existing
robots/header/obsolete-file assertions pass or the owner records an evidence-supported provider/domain
disposition with mandatory custom-origin verification. No failure is converted to PASS by this handover.
