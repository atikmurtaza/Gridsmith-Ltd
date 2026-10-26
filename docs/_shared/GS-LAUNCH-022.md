> **Integration annotation — GS-LAUNCH-023:** This is the historical phase record, not current action authority. All customer-support recommendations below are superseded by the owner's no-support instruction. No support draft is included in this integration. Raw/private receipts remain in the original local worktrees and preservation archive; the adjacent evidence JSON is a public summary bound to the original file hash. Production robots, PNG CSP and deployed `.htaccess` remain mandatory actual-origin checks.

# GS-LAUNCH-022 — confirmed cache flush and provider delivery disposition

26 October 2026 (Europe/London). **CONDITIONAL: obsolete assets resolved; hosted HTTP FAIL; production cutover NO-GO.** Session continued GS-LAUNCH-021.

## 1. Confirmed flush, source and preservation

The owner explicitly answered **“Yes, the temporary-site flush completed”** to the question naming hPanel → Websites → `mediumaquamarine-wallaby-594070.hostingersite.com` → Performance → CDN → Flush cache. Confirmation was recorded at `2026-10-26T21:43:14.378Z`; the actual execution time was not supplied. This is owner confirmation, not a provider audit receipt. The agent did not execute another purge or change any provider setting.

The earlier unconfirmed checkpoint is retained under `build/gs-launch-022/before-confirmation*`; no post-purge measurement was made before confirmation. The complete sweep started `2026-10-26T21:43:29.400Z` and ended `21:43:51.929Z`. The paired probe ran from `21:45:01.197Z`, with one timeout retained and its missing tail completed at `21:47:10.071Z`.

Initial/ending HEAD: `13032b1735c320842d7dc25f3de03afa704d3e33`, branch `codex/gs-launch-021`, worktree `C:\Users\atikm\.codex\worktrees\gs-launch-021\Gridsmith Ltd`. All 12 pre-existing modified/untracked files were inventoried and hashed; their original contents remain preserved beneath additive control notices. The Windows axe fix is unchanged and uncommitted. No executable source/dependency/accepted-artifact change, commit, push, CI dispatch, rebuild, deployment, production, WordPress, DNS, mail or legal-publication action occurred.

The live accepted identity remains `8028cb984402db08d7ba016ab656c5602dfdfae5bc3a49fda7f70b6b890a65e4`, source `13032b1735c320842d7dc25f3de03afa704d3e33`, acceptance run `40332154565`, artifact commit `f1e1da1aad6c5f1dbc4df3a432a0063be3eacf86`. Source/artifact/main remote refs are unchanged. Uncommitted test changes are not attributed to the accepted release SHA.

## 2. Before/after results

| Subject | GS-LAUNCH-021 before | Confirmed-flush GS-LAUNCH-022 | Disposition |
|---|---|---|---|
| Robots | Public 58-byte provider policy; accepted/downloaded file 26 bytes | Canonical and unique-query still return the same 58-byte provider policy | FAIL; unresolved |
| Obsolete payload paths | 5/26 canonical paths returned 200 | All 26 canonical paths return 404 in the complete sweep and paired probe; all 26 query variants also return 404 | PASS for served obsolete-path absence |
| PNG CSP | Missing on all 9 PNGs | Missing on all 9 canonical PNGs and all 9 unique-query PNGs; exact bytes/MIME/nosniff retained | FAIL; unresolved |
| Current payload files | 209/210 match | 209/210 match; robots is the sole byte mismatch | FAIL overall integrity |
| Eligible page routes | 61 exact HTML matches | 61 exact HTML matches, status 200 and preview noindex | PASS |
| Hosted HTTP | FAIL | FAIL with existing assertions unchanged | No waiver |

The 26 obsolete paths consist of **23 JavaScript files, one CSS file and two Path Finder route payloads**; “26 obsolete JavaScript files” in the task is shorthand, not the actual extension count. All 26 are measured. Individual canonical/query statuses, cache indicators, Age, Last-Modified, request IDs and hashes are in [GS-LAUNCH-022-EVIDENCE.json](GS-LAUNCH-022-EVIDENCE.json), with full raw headers in `build/gs-launch-022/`.

### F1 — robots replacement persists

Canonical and query GETs: 200, 58 bytes, SHA-256 `75959e778007bee9d4989a997f47b50ab03332a9de3404ee9e340e7cc5eb6eab`. Actual body:

```text
User-agent: Googlebot
Disallow: /

User-agent: *
Allow: /
```

The accepted file remains 26 bytes, SHA-256 `0f230582d72fef1d9a0eee00314e25c5b163e2406fd87cdba17eefeb578041b5`. Its deployed download matched during GS-LAUNCH-021; no fresh filesystem download was possible here. Post-flush robots responses still lack application security/cache headers and report `Content-Type: text/plain, text/plain`, `server: hcdn`. Canonical request ID `3a2544544d22a6de1c80f5a4b4fb82ac-fast-edge7`; query ID `1273e0751fe7f03b7b0b1b96e27c2a56-fast-edge7`, at 21:45:01 UTC.

**Classification:** the demonstrated provider serving-path override persists after the confirmed flush. Its exact origin/edge generator remains unknown. No source rewrite is supported by this evidence. General crawling is allowed despite the intended crawl refusal; page/meta noindex remains, but is not access control. Production robots must be verified independently; this provider-generated Googlebot refusal would be unsuitable for intended production indexing.

There is a limited custom-domain control already captured in GS-LAUNCH-021: at `21:22:52.231Z`, the existing WordPress `gridsmith.uk/robots.txt` served its normal wp-admin exclusion and WP sitemap through hcdn, rather than the temporary-domain Googlebot policy. This supports a domain-specific robots mechanism instead of an account-wide rule. It is a historical WordPress observation, not proof of the future static origin or PNG-header behaviour; no new production request or change is made here.

### F2 — served obsolete assets resolved

No old path returns 200 in either completed post-flush pass. The known old-header-bearing JS paths now return branded 404s rather than stale JavaScript. The paired requests preserve absent cache/Age fields as null, not invented zeroes. Physical origin-directory absence is not established, but no deletion is needed to meet the measured served-path contract. This result and the owner's confirmation support closure of the stale served-cache finding for these URLs; neither is an all-edge or arbitrary client-cache guarantee.

### F3 — PNG CSP remains absent

All nine canonical PNGs return matching accepted bytes with `image/png` and `nosniff`, and no CSP. All nine unique-query responses also lack CSP; they remain CDN responses, including MISS. HTML, SVG and sitemap controls retain current CSP. Representative PNG canonical request ID `4377ab6b5b40bb4f2eeda52722e2f3db-fast-edge7`; query ID `7c2c9d0ddf8a4c3fd2d1053a907c78bc-fast-edge8`.

The accepted `.htaccess` is 2,711 bytes, SHA-256 `d2a9c8a692fcff5f3cc72eb551cd30f50ad3546e758b1be3a531a28a64654ab3`, with global `Header always set Content-Security-Policy`; prior accepted Apache verification passed. The new read-only browser attempt to inspect the temporary site's files timed out. No Hostinger connector tools are available, and `codex mcp get hostinger` confirms no configured server. Actual current on-disk `.htaccess` bytes remain UNVERIFIED; no private browser authentication was extracted or bypassed.

**Classification:** provider/origin/image response handling remains the working diagnosis. Exact header-removal layer is unknown, and on-disk configuration divergence is not excluded. The unchanged trusted PNG bytes are not an observed executable/corrupted payload, but the response-policy requirement still fails. A query MISS is not origin proof. The issue is not established as temporary-domain-only.

## 3. Verification and retained failures

| Actual check | Result and measured scope |
|---|---|
| Existing hosted release verifier, phase-specific output paths | FAIL, exit 1; exact identity, 210 public files, 61 routes, header/cache/MIME/redirect/compression/GET/HEAD/404/hidden/gated measurements and 26 obsolete paths completed; robots byte assertion fails first and PNG header failures are independently retained |
| Route-byte comparator | PASS; all 61 extensionless routes equal their own accepted HTML |
| Paired delivery probe | Completed 78 responses; robots, HTML/SVG/sitemap, all 9 PNGs and all 26 obsolete paths |
| `AXE_BASE_URL=<temporary origin> node scripts/check-legal-parity.mjs` | PASS, exit 0; 7 documents, 109 clauses, 406 paragraphs, all clauses reachable and adoption banners checked |
| Existing email/phone predicates on three actual contact routes | PASS, exit 0; exact email/WhatsApp links, no form/input/textarea or tel/sms, truthful confirmation; no enquiry sent |
| `node --check scripts/check-static-ui.mjs` | PASS, exit 0 |
| Targeted ESLint for `scripts/check-static-ui.mjs` | PASS, exit 0; existing harness fix remains byte-identical |
| `git diff --check` | PASS, exit 0 |
| Prior full hosted UI/axe | REUSED PASS with precise limits: same accepted identity, all current page/asset bytes and nine browser-critical header values agree with GS-LAUNCH-021 across 273 successful GET subjects; only obsolete paths changed. 20 pages, 20 no-JS pages, 70 legal combinations, 43 axe analyses, zero violations and 23 retained incomplete-rule occurrences. No new full AA claim |
| New Linux CI / Lighthouse / full browser rerun / hosted induced 500 | NOT RUN; unchanged subject does not justify them for this investigation |
| Current `.htaccess` download | NOT RUN to completion; browser timeout, no connector |

Retained non-passing attempts are not disguised as passes: the first copied verifier runner lacked its local original-script fixture and stopped before any HTTP request; that fixture was copied and the complete run above executed. One paired-probe canonical obsolete-CSS request timed out at 30 seconds; the initial partial receipt is preserved and the ten missing requests completed in one bounded retry, all obsolete responses 404. The generic `check-company-facts.mjs` run exits 1 because it requires two routes intentionally excluded by this release (`technical-documentation`, `gridsmith-path-probe`); its 19/21 coverage is not called a full PASS and its route list is not relaxed. The focused contact check and prior full browser contact coverage answer this phase's actual contact question.

## 4. Changes, provider request and production disposition

Only phase documentation/evidence and additive status notices change here. All GS-LAUNCH-021 raw receipts and source/test fixes are preserved. The previous blocked checkpoint is superseded by genuine owner confirmation and actual measurements, not silently erased.

The updated Hostinger request (historical file retained privately; superseded) is **UNSENT**. It removes obsolete cached assets as an active defect and supplies post-flush robots/PNG request IDs. The observed site-specific Flush cache has now been performed by the owner; repeating it is not the recommended remedy for persistent robots/PNG behaviour. No additional supported owner control is established: Manage was disabled at the prior inspection, and CDN disablement/development toggles are not assumed available or effective. Provider support must identify the supported site-scoped mechanism, compare actual `.htaccess`/origin headers and establish custom-domain scope. No changes or message sending are authorised by the draft itself.

**Owner action:** review and send the updated support request, or explicitly authorise its submission. No further purge, source rebuild or provider-setting experiment is required by this phase. Existing direct-contact operational, legal-publication, WordPress backup/recovery and exact cutover-authority gates remain separate and unmet where previously recorded.

**Verdict:** the bounded post-flush investigation is complete with a CONDITIONAL provider disposition; hosted HTTP is still FAIL. Close the repeated cache-debugging loop. Continue independent production preparation under its own authority while provider questions are pending. Do not deploy or waive the defects: eventual custom-origin verification must check production identity, all files/routes, intended robots/indexing, CSP on documents and images, cache/MIME/redirect/compression/HEAD/error behaviour, direct contact and all-seven legal parity, with an approved rollback path.

**Next recommended task: GS-LAUNCH-023 — reconcile launch source with remote main while preserving all uncommitted operational handovers.** That major workstream should sequence verified WordPress backup/restoration and actual production-destination preparation before a separately approved cutover. None of those major operations is executed in GS-LAUNCH-022.
