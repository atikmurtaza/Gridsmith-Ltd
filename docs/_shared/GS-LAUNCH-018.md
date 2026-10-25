# GS-LAUNCH-018 — Restore the existing Hostinger preview workflow

25 October 2026 (Europe/London). Implementation and exact-source CI acceptance in progress. Publication remains blocked pending accepted release bytes and exact owner approval. Work is isolated on `codex/gs-launch-018`, based on `a0b6ffb7`; the dirty primary checkout is preserved.

## Recovered deployment

The original functioning path is `CI` (`.github/workflows/ci.yml`) → reusable `.github/workflows/hostinger-staging.yml` → generated-files branch `codex/gs-hostinger-artifact` → Hostinger's GitHub integration → manual Hostinger Redeploy while auto-deployment is OFF. No FTP/SSH password or Hostinger API credential is used by Actions. The publisher uses its job-scoped GitHub token with `contents:write`. Hostinger holds its own GitHub connection; its credential was neither read nor logged.

The successful original [manual CI run 39590710731](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/39590710731), 21 October 2026, used branch `claude/gs-r12-production-readiness-001`, source `e545c1a2b5afd1431bef581044cec2bec4da252a`. Its verify/build/publish jobs succeeded. Artifact commit `25d653f5582b78c31329dc5def12898d6a19b531` says `build(hostinger): stage e545c1a2b5afd1431bef581044cec2bec4da252a`. The served temporary-domain identity matches source and payload identity `59ec5ae74f7074cc16c2eecb6c6008c705179fd2e7f1be50ba960c04aa4cfbe9`.

**The old website is not generally returning 404.** Current GETs to `/`, `/about`, `/design`, `/digital` and `/press` return 200. `/legal/privacy` returns the branded 404. The old artifact has `legalPreview:false`, zero legal files and explicit legacy-legal 404 rules. Legal publication restrictions explain that legal URL, not a broken deployment of every route. Read-only receipts: `GS-LAUNCH-018-RECOVERY.json`.

No `environment:` gate was referenced by the old publisher. Current GitHub `Preview` and `Production` environments have no protection rules; repository workflow default is read-only, with publisher write permission explicitly granted in YAML. No repository webhooks were listed. This does not establish every installed App's behaviour.

## Destination evidence and boundary

The live temporary-site dashboard showed: the exact hostname, Connected with GitHub, repository Gridsmith-Ltd, source branch `codex/gs-hostinger-artifact`, root directory `public_html`, completed manual deployment on 21 October 13:39, and **Auto-deployment OFF**. The absolute-root detail interaction and recovery both timed out; absolute root and separation from the production root are **UNVERIFIED**. Logical site selection is not physical isolation proof. No provider setting was changed, no Redeploy clicked, no production website requested, and no credential accessed.

The isolated source branch is not the Hostinger artifact branch. The prepared push path runs acceptance only, with publisher inputs false. The artifact branch remains unchanged. Source `vercel.json` disables Git deployment. No claim is made that YAML or absent webhooks proves the state of every third-party publisher.

## Implementation

The existing two workflow files are adapted, retaining the original artifact-branch publishing mechanism. Ordinary source pushes and default dispatches perform acceptance only. The reusable build uses `owner-preview`, production CMS reads, seven unchanged repository legal texts, direct email/WhatsApp, no intake, noindex and the exact temporary origin. The original authenticated Chrome provisioning, installation controls, pinned package/lock identities and nonpersistent installation checkout remain enforced; workflow identity hashes are updated for these reviewed changes.

`with-preview-apache.mjs` starts disposable Apache on loopback using the unchanged candidate `.htaccess` and files. It uses a private local TLS certificate and a byte-preserving loopback proxy to retain the real Host header and HTTPS rules. It does not edit the candidate or contact Hostinger. Existing HTTP acceptance now supports the owner-preview simulation, including all payload hashes/routes, MIME/cache/security/compression, redirects, hidden-file denial, genuine 404 and induced GET/HEAD 500. Existing static UI checks cover hydration, navigation, keyboard, responsive/no-JS, legal text/link checks, axe and motion. Existing desktop/mobile Lighthouse checks run against this same identity, with the retained HTTP/2 mobile harness and unchanged budgets. This is Apache simulation, not hosted acceptance or proof of provider-independent error fallback.

`preview-release.mjs` refuses incomplete/foreign-source acceptance and either nonzero or unavailable dependency audit. Only after the exact Linux commands and audits pass does it copy to `build/owner-preview-release/`, bind acceptance into the new identity, generate the release ZIP and full checksums. The pending candidate is never altered. The release predicates have permanent positive/adverse specimens, including zero checks and every failed command. Accepted identity is recognised only with matching source/payload/evidence/run fields; arbitrary flag changes remain invalid.

Publishing downloads accepted bytes from the named successful Actions run, verifies its source and workflow, checks every file and refuses extras/symlinks, verifies the owner's approval hash and previous artifact-branch SHA, then uses the original Git branch publisher. It never rebuilds an approved artifact during publication. Source SHA, payload identity, acceptance run, exact destination-evidence digest, root separation, auto-deployment OFF and rollback digest must match the owner's approval. Missing evidence or a pending candidate fails closed. No approval record has been manufactured.

## Security disposition

Fresh unchanged-lock audit: **production 0; full 9 high affected packages**, representing three underlying advisories. Packages: `@lhci/cli`, `@lhci/utils`, `lighthouse`, `puppeteer`, `puppeteer-core`, `@puppeteer/browsers`, `chromium-bidi`, `extract-zip`, nested `zod`. Production Zod is already 4.6.6; chromium-bidi still uses 3.25.76.

- [extract-zip symlink traversal](https://github.com/advisories/GHSA-jmr9-qjv8-65gv) and [symlink overwrite](https://github.com/advisories/GHSA-7pqw-9j4j-h8q3): upstream lists no patched extract-zip release. Registry latest remains 2.0.1. Retained browser controls suppress Puppeteer's downloader and use the authenticated .deb acquisition/extractor instead; install/check and both browser consumers remain explicitly guarded. Static deployment contains neither Node nor these tools.
- [Zod resource exhaustion](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5): patched at 4.6.6; nested Chromium BiDi's Zod 3 cannot safely be replaced with Zod 4 without compatibility work. Existing production constrained-collection and consumer tests remain intact.
- Registry offers Puppeteer 25.16.0, whose browser helper 3.2.6 removes extract-zip and whose BiDi consumer is newer. This is a major upgrade from the pinned 24.x line. LHCI latest remains 0.15.1 using Lighthouse 12.6.1; npm's advertised remediation is a downgrade to LHCI 0.13.0. Lighthouse latest 13.5.0 is a different measurement engine. Neither a cross-major override nor a measurement-changing downgrade is classified as a safe drop-in fix. No force audit fix, dependency change, risk acceptance or suppression was made.

The existing controls support the bounded CI investigation requested here; they do not turn the full audit green. Release packaging and publication remain blocked while findings are unresolved. A subsequent owner decision must choose a separately reviewed tooling migration or an explicitly scoped security disposition; this phase does not silently accept the risks.

## Execution and owner approval contract

The CI run and exact final source will be recorded below after execution. No accepted ZIP/manifest identity is claimed before acceptance. The GS-LAUNCH-017 artifact remains unchanged and nondeployable.

After all acceptance/security gates pass, download `hostinger-release-archive` and `owner-preview-evidence` from the successful run. Review `release.json` for the actual source, archive checksum and file list. Retain a private destination/rollback receipt identifying the absolute temporary root, confirming it cannot modify `gridsmith.uk`, identifying the exact Git mapping and auto-deployment OFF, and specifying restoration of the current temporary-site artifact. Only after the owner approves that exact transaction, set the repository variable `GS_OWNER_PREVIEW_APPROVAL` to the exact approved JSON text (no secrets):

```json
{
  "status": "OWNER_APPROVED",
  "owner": "<actual owner>",
  "approvedAt": "<actual approval time>",
  "sourceSha": "<tested source>",
  "artifactIdentity": "<accepted payload identity>",
  "acceptanceRunId": "<successful run>",
  "siteOrigin": "https://mediumaquamarine-wallaby-594070.hostingersite.com",
  "artifactBranch": "codex/gs-hostinger-artifact",
  "rootSeparationVerified": true,
  "autoDeployment": false,
  "destinationEvidenceSha256": "<private reviewed receipt hash>",
  "previousArtifactSha": "<verified current rollback artifact commit>",
  "rollbackEvidenceSha256": "<private rollback receipt hash>"
}
```

This is a schema example, not approval. Hash the exact variable bytes; do not include a newline unless it is in the variable. After verifying the current destination, permission and owner approval, dispatch the existing registered workflow on the exact accepted source branch:

```text
gh workflow run ci.yml --repo atikmurtaza/Gridsmith-Ltd --ref codex/gs-launch-018 -f publish_preview=true -f accepted_run_id=<run> -f approved_artifact=<identity> -f approval_sha256=<approval hash>
```

**Do not execute that command now.** It can write the artifact branch. Hostinger auto-deployment stays OFF; a later explicitly approved manual Redeploy is still required to put those files on the temporary website. After that deployment, verify served identity, every route/file, legal pages and noindex/contact/headers, then obtain owner visual/device acceptance. Production, DNS, mail, legal text/adoption/CMS state and `main` remain outside this transaction.
