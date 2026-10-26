# GS-LAUNCH-017 — Temporary-site upload guide

**Preparation only. No accepted release ZIP exists and no upload is authorised. Do not upload `build/owner-preview-candidate/` while it says ACCEPTANCE_PENDING, or any GS-LAUNCH-016 rehearsal.**

## Reproduce the local validation candidate

Use `codex/gs-launch-017` in its isolated worktree, Node 24.15.0 and its unchanged lockfile. No privileged secrets, CMS writes or live enquiries are needed. From a clean checkout with dependencies installed:

```powershell
$env:PUPPETEER_SKIP_DOWNLOAD = 'true'
$env:GRIDSMITH_STATIC_PROFILE = 'owner-preview'
$env:GRIDSMITH_STAGING_ORIGIN = 'https://mediumaquamarine-wallaby-594070.hostingersite.com'
$env:NEXT_BUILD_CPUS = '1' # local Windows build resource limit
Remove-Item Env:NEXT_PUBLIC_LEAD_INTAKE_URL -ErrorAction SilentlyContinue
Remove-Item Env:GRIDSMITH_LEGAL_PREVIEW -ErrorAction SilentlyContinue
Remove-Item Env:GRIDSMITH_PRODUCTION_REHEARSAL -ErrorAction SilentlyContinue
node scripts/build-static.mjs
if ($LASTEXITCODE -ne 0) { throw 'Preview build failed' }
node scripts/check-static-artifact.mjs
if ($LASTEXITCODE -ne 0) { throw 'Artifact contract failed' }
node scripts/check-legal-parity.mjs --artifact-dir=build/owner-preview-candidate
if ($LASTEXITCODE -ne 0) { throw 'Legal parity failed' }
```

The exporter creates a new disposable source tree and removes it after building. It writes `build/owner-preview-candidate/`, `build/static-receipt.json` and `build/static-route-manifest.json`. These commands do not complete browser/Apache/Lighthouse or release acceptance. Keep the candidate local; do not alter its pending identity.

## Later upload, only after acceptance and explicit authorisation

1. Select **Websites → mediumaquamarine-wallaby-594070.hostingersite.com → Dashboard**. Confirm the temporary hostname in the selected site context. Do not enter `gridsmith.uk`, WP Admin, WordPress files or a database.
2. Read the site's actual absolute root in its hosting/FTP-account details, then verify File Manager belongs to that same website. `public_html` is a conventional folder name, not proof of the target. Record the site identity/root privately and verify no competing Git/automatic publisher will replace the upload. Stop on mismatch or unexpected site content; do not delete anything.
3. Once the retained acceptance checks pass, prepare a fresh acceptance-bound release package from the exact reviewed source. Record source SHA, full file manifest, output path/count, actual ZIP filename, ZIP bytes and SHA-256; verify each archive entry against the accepted files, including `.htaccess`. The candidate's pending flags cannot be changed by hand to create acceptance.
4. Present that concrete archive, temporary-site destination, existing temporary-files recovery method and bounded rollback for explicit owner upload approval. No production or email/DNS action belongs to it.
5. Upload only the accepted export's **contents** to the verified temporary-site root so `index.html`, `.htaccess`, `_next/`, `brand/` and the other generated files sit directly under the root. Do not add an enclosing `out/` or archive-name directory. Never upload `.env`, source, `.next`, `node_modules`, CMS caches, reports, private receipts or operator-error packages. Keep any recovery archive outside public roots.
6. If using File Manager extraction, inspect the extraction destination before confirming it and ensure hidden `.htaccess` is included. Never overlay a different website or remove existing files without the specifically approved temporary-site transaction. Match the uploaded files to the accepted manifest and retain the receipt.
7. Verify HTTPS root and every manifest route, all seven legal pages, direct email/WhatsApp, mobile/desktop navigation, fonts/images/CSS/JS, no browser errors, no forms/intake/analytics/reviews, genuine unknown-route 404, redirects, noindex/canonicals/empty sitemap, MIME/security/cache headers and cookie/storage behaviour. Hostinger must actually honour the generated rules. Missing modules/overrides or wrong headers are failures; do not delete directives to obtain a 200. Owner visual/device/assistive-technology acceptance is separate.

Hostinger documents [finding the actual root](https://www.hostinger.com/support/1583494-what-is-the-path-to-your-website-s-root-home-directory-and-how-to-change-it-in-hostinger/) and [File Manager upload/extraction](https://www.hostinger.com/support/1869114-how-to-upload-backups-with-file-manager-in-hostinger/). Checked 25 October 2026. These are public instructions, not evidence of this account's root or permissions. No upload occurred in GS-LAUNCH-017.

## Connecting gridsmith.uk after owner staging approval

1. Record the owner's staging acceptance and complete the separate production publication prerequisites, including DIRECT-CONTACT-VERIFIED, all-seven PUBLISHABLE/co-publication and applicable cookie/security/CI acceptance. No new adoption is needed for unchanged legal text.
2. Verify the supported Hostinger domain-assignment method for this separate static website and record the current/new mapping plus its reversible inverse. Because `gridsmith.uk` already belongs to another website, verify reassignment can preserve that installation. Do not inspect, modify, migrate or delete WordPress. Any action needing that would require separate authority.
3. Build and verify a **new production** export with `GRIDSMITH_STATIC_PROFILE=production`, no staging origin, no rehearsal/intake flags and `https://gridsmith.uk` canonicals/host rules/indexing/sitemap. The temporary export is host-locked and noindex; connecting a domain to it is not a production release.
4. Bind the accepted production source/artifact/ZIP hashes, actual target, reversible mapping/switch, rollback and smoke checks in a separate explicit production connection approval. Preserve the recorded email configuration and MX/SPF/DKIM/DMARC. Assess whether existing web routing already suffices; make no DNS change unless that exact web-routing change is separately approved.
5. Only within that later approval, install the production files and perform the supported domain assignment. Then verify apex/www/HTTPS, all routes/legal/contact/assets, production metadata/headers, cookie A-2 origin repeat and unchanged mail records. Roll back only through the approved inverse on failure. No WordPress migration is part of this plan.

Hostinger describes [temporary-to-custom domain assignment](https://www.hostinger.com/support/1583214-how-to-add-a-website-in-hostinger/). This is not a verified account-specific reassignment or permission to connect `gridsmith.uk` now.
