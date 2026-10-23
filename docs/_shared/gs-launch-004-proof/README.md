# Disposable GS-LAUNCH-004 proof

These files support the design report. They are not production configuration, application routes,
or a replacement release gate. Run only in an isolated checkout with the repository's already
verified dependencies and an owned disposable container; never point them at a hosted origin.

The recorded run uses Node 24.15.0 and the existing Windows Puppeteer browser installation,
plus Debian Apache 2.4.68 installed in the task-owned Node container from signed Debian repositories.
It does not repeat the GS-LAUNCH-003 authenticated Linux-browser acceptance. Windows Lighthouse
does not run; a wrapper reminder about that skip is not a failed or successful Lighthouse measurement.

## Layout and order

1. Build the unchanged normal Next candidate, with no privileged environment or env files.
   `NEXT_BUILD_CPUS=1` is the existing Windows-only build option; it changes no application policy.
2. Run `verify.mjs ssr` through the existing `scripts/with-server.mjs`, with `VERIFY_PORT=3349`
   and the public development dataset. The wrapper refuses an occupied port and owns server cleanup.
3. Run the existing guarded production static rehearsal, using **only the Preview intake**. Preserve
   its original `.htaccess`, deployment identity and `deployable:false`. The build does no form submit.
4. In an owned disposable Apache container, create `/proof/site`, `/proof/fallback`, `/proof/co-located`.
   Copy the rehearsal output to `/proof/site`, preserve its `.htaccess` elsewhere, and replace **only
   the simulation copy** with `static.htaccess`. Copy `error.html` to `/proof/fallback/error.html`
   and `/proof/co-located/500.html`. Copy `co-located.htaccess` to that directory's `.htaccess`;
   it induces the fault in the same per-directory phase that installs the error mapping.
   Give the unprivileged runtime user ownership of `/proof`.
5. Use `apache.conf`, with `apache2 -t -f /proof/apache.conf` before starting it as the unprivileged
   user. Publish container 8080–8084 to **loopback only**, host 3344–3348 respectively. The synthetic
   upstream 8085 stays internal. Next runs on 3349 so Apache reaches it using host.docker.internal.
   No TLS or hCDN is simulated. The recorded base image digest is in the phase evidence.
6. Run `node docs/_shared/gs-launch-004-proof/adverse.mjs` alone. It is deliberately bound to the
   owned container name `gs-launch004-proof`; no other reader/writer may use its subjects. It restores
   captured bytes in `finally` and asserts exact equality. Its successful result means the failure
   cases were characterized, not that missing recovery storage is acceptable.
7. After that process exits, use the existing server wrapper to run `verify.mjs boundary`, then
   `verify.mjs ssr`. Do not overlap Apache fault injection with a boundary/browser proof. Ordinary
   API paths are excluded from substitution; the API-path specimen is a remapping to the permanent
   SSR throw route, not a real API, enquiry, database or email operation. RSC status is compared with
   the actual direct upstream rather than assumed to be 500.
8. Stop/remove only the owned task container and servers after retaining results. Never stop or
   modify other projects' containers, global Docker configuration, browser settings or dependencies.

Example final wrapper invocation in PowerShell, after the above setup:

```powershell
$env:VERIFY_PORT = '3349'
$env:NEXT_PUBLIC_SANITY_DATASET = 'development'
node scripts/with-server.mjs 'node docs/_shared/gs-launch-004-proof/verify.mjs boundary' 'node docs/_shared/gs-launch-004-proof/verify.mjs ssr'
```

Both scripts write receipts under ignored `build/gs-launch-004/`; the phase's committed evidence
contains their portable results, raw initial SSR HTML, selected error responses and hashes. The
four negative semantic self-checks in verify.mjs separately reject missing language, H1, main and
the framework shell. Each no-JS audit replay additionally proves its missing-language branch can
fire in that same replay before checking the restored document. The receipt contains axe finding
summaries; the full axe result objects are retained in the compressed `evidence/axe-full.json.gz`
archive, including the deliberate missing-language results.
Apache-generated negative response documents are stored losslessly as `.html.gz` files to preserve
their original trailing spaces without introducing whitespace defects into the staged text. Their
decoded and archive hashes are recorded separately; initial SSR HTML remains directly readable.

The configuration intentionally omits the real release host locks, TLS/CDN and its broader header
policy. DirectorySlash Off is an explicit simulator prerequisite for physical directory collisions.
This is not evidence that Hostinger permits that setting or independent fallback storage. Read
GS-LAUNCH-004.md before proposing an implementation or hosted change.
