# GS-LAUNCH-016 — Hostinger upload, cutover and rollback

**PROPOSED ONLY. Nothing in this runbook authorises upload, production writes or a root switch.** Keep WordPress running until separate owner approval binds the final artifact and the complete transaction. No DNS or business-email change is planned.

## Local reproduction and package identification

Use a separate clean checkout of `373c04b69a2bf9612b0807694f9d0d3262235c3a`, Node 24.15.0 / npm 11.12.1 and its exact lockfile. Supply no privileged credentials. In PowerShell:

```powershell
$env:PUPPETEER_SKIP_DOWNLOAD = 'true'
npm ci --ignore-scripts=false
$env:GRIDSMITH_STATIC_PROFILE = 'production'
Remove-Item Env:NEXT_PUBLIC_LEAD_INTAKE_URL -ErrorAction SilentlyContinue
Remove-Item Env:GRIDSMITH_STAGING_ORIGIN -ErrorAction SilentlyContinue
Remove-Item Env:GRIDSMITH_LEGAL_PREVIEW -ErrorAction SilentlyContinue
Remove-Item Env:GRIDSMITH_PRODUCTION_REHEARSAL -ErrorAction SilentlyContinue
node scripts/build-static.mjs
```

**Expected at this source: exit 1, eight unmet legal/receipt inputs; no deployable `out/`.** Do not edit the register or inventory just to make it run. To reproduce only the protected local rehearsal using the existing explicit rehearsal mechanism:

```powershell
$env:GRIDSMITH_PRODUCTION_REHEARSAL = '1'
node scripts/build-static.mjs
Remove-Item Env:GRIDSMITH_PRODUCTION_REHEARSAL
```

Output is `build/production-rehearsal/`, with `Require all denied`. The [manifest](GS-LAUNCH-016-ARTIFACT-MANIFEST.json) records this phase's source, CMS revisions, identities and every file hash. The retained local NONDEPLOYABLE ZIP restores the exact measured bytes. New CMS revisions/build outputs require a new manifest and checks; this is not a promise of offline deterministic CMS rebuilding. Raw source, caches, logs and private receipts are not deployment files.

## Before any production operation

1. **Identify and protect:** complete the eight entries in the [owner sheet](GS-LAUNCH-016-OWNER-DECISION.md). Resolve the live root from the actual site mapping and match its database privately. Preserve temporary sites. Verify the chosen upload/root-switch method, permissions and free capacity; do not guess paths or assume file-manager renames are atomic. A two-rename replacement has a maintenance gap and must include an immediate inverse if the second rename fails.
2. **Recovery:** under separate backup/restore authority, obtain or verify the matched WordPress files and database backup. Include hidden files, uploads, plugins/themes and private `wp-config.php`; hash/store outside every public root. Prove restoration in an isolated destination, or explicitly record unverified restore capability and obtain a precise owner risk decision under existing policy. Identify snapshots and subsequent-write handling. Do not restore an old database over newer records by default.
3. **Final artifact:** after genuine direct-contact/cookie/publication prerequisites and explicit authority for the needed local/register/CMS preparation, create a fresh production export with no rehearsal flag or intake URL. Require clean source, `sourceModified:false`, `deployable:true`, correct production origin, exact final manifest and zero artifact findings. Confirm all seven adopted legal routes/versions and generated/CMS/served parity together; direct email/WhatsApp only, no forms/API/intake/Resend transport, reviews/analytics/Technical exclusions intact. Run retained Linux/Apache/browser/accessibility/responsive/Lighthouse/cookie and publisher-safe exact-source CI gates. No source push or manual dispatch is implied: current CI can call a write-enabled staging publisher.
4. **Approval last:** present the actual clean source SHA, artifact/ZIP/file-manifest hashes, verified destination and old/new/failed paths, all-seven publication authority, security disposition, acceptance receipts, writer freeze, backup/recovery references, maintenance gap/window, switch/abort/inverse actions and bounded rollback authority. Obtain separate explicit owner approval of this exact transaction. Never approve or upload an unidentified future artifact or this phase's rehearsal.

## Execute only within that later approval

5. Freeze the approved writers and WordPress editing/jobs for the agreed window; take/verify the final matched snapshot. Capture the actual DNS/mail baseline without editing it. Upload **only the verified final public export**, including `.htaccess`, to the agreed nonpublic inactive sibling target; verify all remote file hashes before switching. Do not overlay static files onto an active WordPress root, leave public backup archives or expose an unapproved legal copy on a temporary domain. Never upload source, `.env`, `.next`, `node_modules`, adoption records, `ops/hostinger-error/` or private receipts.
6. Apply the approved root switch/inverse-capable directory operation. Required static routing from `lib/build/hostinger.ts`: extensionless `.html` resolution, legacy single-hop redirects, slash handling, apex/www/HTTPS policy, PHP/script refusal, `Options -Indexes -MultiViews`, `DirectorySlash Off`, `DirectoryIndex index.html`, `ErrorDocument 404 /404.html`, `ErrorDocument 500 /500.html`, and security/cache/MIME policies. Verify actual `mod_rewrite`, `mod_headers` and permitted overrides; syntax compatibility alone is not hosted acceptance. No persistent Node/PHP application or Next image server is needed by the export. Do not remove fail-closed directives to cure a server error.
7. Confine any approved cache purge to gridsmith.uk. Check served identity/hashes, homepage/all eligible and seven legal routes, direct contact, mobile/desktop navigation and keyboard, JS/no-JS, assets/fonts, genuine unknown-route 404, legacy redirects, canonicals/sitemap/robots, headers and cookie A-2 production-origin repeat. Check `/500.html` plus its approved mapping; a direct HTTP 200 is not an induced HTTP 500 proof. No artificial production fault or exhaustive CDN outer-error programme is required. No test enquiry/email/WhatsApp message without explicit separate authority. Recompare DNS/mail records; do not change them.

## Abort and rollback

Abort for wrong identity, incomplete upload/switch, legal 404/mismatch, broken contact/assets/navigation, critical accessibility/security failure or unexpected DNS/mail change. Stop writes/cache changes; retain the failed static tree privately. Reverse the exact approved root/configuration operation to the retained WordPress root. If the first of two renames succeeded and the second failed, immediately restore the old root to its original path. Restore a database only if needed and authorised, using the matching snapshot and agreed treatment of newer writes. Recheck WordPress routes/admin availability and existing email configuration; do not send test mail implicitly. Record times, status and evidence, then hold the release. Retain recovery copies for the agreed window; deletion is a separate action.

## Public documentation checked, not account proof

Hostinger documents [downloading file/database backups](https://www.hostinger.com/support/5981435-how-to-download-backups-at-hostinger/) and [restoring WordPress files and database together or separately](https://www.hostinger.com/support/3989447-how-to-restore-a-wordpress-website-from-backups-in-hostinger/). Its [custom error-page guidance](https://www.hostinger.com/support/1583295-how-to-customize-your-website-s-error-pages-in-hostinger/) describes HTML error pages. Checked 25 October 2026. These references do not prove this account's backup availability, paths, permissions, modules or rollback operation. Independent outer-error infrastructure remains a documented limitation under GS-LAUNCH-007, not a new prerequisite.
