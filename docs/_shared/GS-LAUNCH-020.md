> **Chronology annotation — GS-LAUNCH-023:** The preparation and intermediate updates below are historical. The final sections record successful publication and owner Redeploy; GS-LAUNCH-022 subsequently closes obsolete served assets. Support recommendations are superseded. Current production prerequisites are in GS-LAUNCH-023.

# GS-LAUNCH-020 — final Hostinger preview deployment approval packet
> **Execution update:** Owner explicitly answered yes. Approval recorded at 2026-10-26T17:16:57Z; approved-record SHA-256 `cfa6eb0646bdd77bd067ea1838ff10077383a5c0ddbb80f93d18baf908e54770`. Repository approval variable installed and exact bytes verified. [Publication run 40367278523](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/40367278523) publisher PASS; artifact commit `f1e1da1aad6c5f1dbc4df3a432a0063be3eacf86` contains all 212 accepted files byte-for-byte. Normal verification remains in progress. No Hostinger Redeploy yet; auto-deployment remains OFF. No rollback authority. The preparation packet below is retained as the pre-approval record.

26 October 2026 (Europe/London). **PREPARATION COMPLETE — AWAITING EXPLICIT OWNER DEPLOYMENT APPROVAL.** Destination configuration and bounded Git transaction isolation, accepted release integrity and retained rollback payload are verified. No approval variable, publication, dispatch, Redeploy, rebuild or production change occurred.

Tested source remains `13032b1735c320842d7dc25f3de03afa704d3e33` on `codex/gs-launch-018`. All GS-LAUNCH-019 completion records are preserved. This phase changes local evidence/documentation only; source and accepted files are unchanged, with no commit or push.

## 1. Destination verification — PASS for this configured transaction

Target: `https://mediumaquamarine-wallaby-594070.hostingersite.com`.

The live dashboard and owner-supplied Git screenshot confirm the selected temporary website, repository **atikmurtaza/Gridsmith-Ltd**, branch **codex/gs-hostinger-artifact**, root **public_html** and **auto-deployment OFF**. Last deployment is Completed, 21 October 2026 13:39, Manual deployment. The owner-supplied production GIT screenshot selects **gridsmith.uk** and shows provider-connect setup, with no existing deployment mapping displayed.

The owner supplied the File Manager image in direct response to the specific request for the temporary website-only root. It shows `.builds`, `public_html` and `DO_NOT_UPLOAD_HERE`; `public_html` is a directory (`drwxr-xr-x`), not a symlink. Its structure matches the retained GS-LAUNCH-018 website-scoped File Manager observation. This image itself has no hostname label; its attribution comes from the owner's requested context, not from a fabricated visual label. Screenshot capture times were not supplied; review times and exact image hashes are recorded.

The bounded transaction writes only the isolated Git artifact branch. The configured Hostinger consumer is the temporary website; production's Git view is unconnected. The accepted payload has no path traversal/symlinks. Only the temporary site's manual Redeploy is included. No FTP, Hostinger API, DNS or WordPress credentials are passed to Actions. Thus this transaction has no configured production write target. Any changed website, mapping, root, auto-deployment state or branch tip invalidates this packet until reviewed.

This establishes configuration/transaction isolation for the existing Git mechanism. It does not claim an independent absolute-filesystem/chroot audit, arbitrary hosted write probe, restore exercise or verification of uninspected third-party systems. Those are not substituted for the named Git transaction.

Retained images: `build/gs-launch-020/temporary-site-git-owner-screenshot.png`, `temporary-site-file-manager-owner-screenshot.png` and `production-git-owner-screenshot.png`. Earlier partial receipts/drafts/hashes remain under `before-git-screenshot-*` and `before-root-screenshots-*`.

## 2. Accepted release recheck — PASS; no rebuild

- Repository/branch: `atikmurtaza/Gridsmith-Ltd`, `codex/gs-launch-018`.
- Exact tested/current source: `13032b1735c320842d7dc25f3de03afa704d3e33`.
- Accepted [CI run 40332154565](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/40332154565): completed SUCCESS on that source; publisher skipped.
- Accepted identity: `8028cb984402db08d7ba016ab656c5602dfdfae5bc3a49fda7f70b6b890a65e4`.
- ZIP: `owner-preview-13032b1735c320842d7dc25f3de03afa704d3e33.zip`.
- ZIP SHA-256: `9a6291a8809efbb98e95e2e4cd8dd3fd73a577f921dc20b5ff514fec01959e96`.
- All 212 archive files match sizes, hashes and separately downloaded release bytes; accepted identity, source/run and six acceptance log hashes agree. Both downloaded audits are zero. Independent review passes. Accepted files were neither rebuilt nor edited.

## 3. Rollback verification — PASS for availability/integrity/procedure

Current remote artifact branch still points to **25d653f5582b78c31329dc5def12898d6a19b531**, with prior Git tree `ccbc893c7b42b7247898d28b77d7807a42bcdf9e`. All 202 retained files match regular Git blobs; all 201 payload manifest hashes agree. The temporary site's served deployment identity matched this commit byte-for-byte during GS-LAUNCH-020 verification.

Exact retained archive: `build/gs-launch-020/rollback-25d653f5582b78c31329dc5def12898d6a19b531-exact.zip`.

Rollback ZIP SHA-256: `3bbfc504af866138bdf39baf7f9ed2a539710a890ecee47444d6fd0c73071b7f`.

The prepared `ROLLBACK-PROCEDURE.md` creates a new dedicated artifact-branch clone with automatic line-ending conversion disabled, verifies the release being rolled back, restores the prior tracked tree, asserts the exact staged tree SHA, commits and pushes normally without force, then manually Redeploys only the temporary site. Commands and independent byte/tree verification are retained. A real restore was not executed.

**Rollback restores the old enquiry forms, old reviews and legal-page 404s.** Backend form processing/delivery is unverified. That restoration requires explicit rollback authority; it is not included implicitly in approval of the new direct-contact release.

The first default Windows archive converted 69 files to CRLF. It remains diagnostic evidence, not the recovery archive. The `-exact.zip` archive uses `core.autocrlf=false` / `core.eol=lf` and passes all original manifest and Git-blob hashes. Neither Git source nor accepted files were changed.

## 4. Final evidence receipts

| Receipt | Result | SHA-256 |
|---|---|---|
| `GS-LAUNCH-020-DESTINATION.json` | PASS for bounded configured Git transaction | `66a80b094aa74e0e669b5976f23fd9384b81dbfefbc3f5aeec7a843e079d4173` |
| `GS-LAUNCH-020-ROLLBACK.json` | PASS for payload/procedure; restore not executed | `cb7b8d12412a7ac4bf8d8ad9fd1f7a7282fa2056f59d09efad157645462d49de` |

Files and exact screenshot hashes are retained privately under `build/gs-launch-020/`. `RECEIPT-HASHES.json` binds their bytes. No approval is inferred from the screenshots.

## 5. Factual approval record — complete and unsigned

The following exact bytes are saved compactly in `build/gs-launch-020/OWNER-PREVIEW-APPROVAL.json`. All factual publisher fields are complete. Status remains `AWAITING_OWNER_APPROVAL`; `approvedAt` is deliberately absent until actual human approval. The publisher must therefore reject this current record with `OWNER_APPROVAL` only. It is not falsely represented as a completed owner signature.

```json
{
  "status": "AWAITING_OWNER_APPROVAL",
  "owner": "atikmurtaza",
  "sourceSha": "13032b1735c320842d7dc25f3de03afa704d3e33",
  "artifactIdentity": "8028cb984402db08d7ba016ab656c5602dfdfae5bc3a49fda7f70b6b890a65e4",
  "acceptanceRunId": "40332154565",
  "siteOrigin": "https://mediumaquamarine-wallaby-594070.hostingersite.com",
  "artifactBranch": "codex/gs-hostinger-artifact",
  "rootSeparationVerified": true,
  "autoDeployment": false,
  "destinationEvidenceSha256": "66a80b094aa74e0e669b5976f23fd9384b81dbfefbc3f5aeec7a843e079d4173",
  "previousArtifactSha": "25d653f5582b78c31329dc5def12898d6a19b531",
  "rollbackEvidenceSha256": "cb7b8d12412a7ac4bf8d8ad9fd1f7a7282fa2056f59d09efad157645462d49de"
}
```

Unsigned record SHA-256: `662974cbf2a9bd5e20f6a948af3cfee599de871b99ea46f42139b8966068f12a`. **This is not the future publication approval hash.** After explicit approval, set `status:OWNER_APPROVED`, record the actual approval time as `approvedAt`, hash those final bytes and install exactly those bytes as `GS_OWNER_PREVIEW_APPROVAL`. No placeholder owner approval/time or final approval hash is invented now.

## 6. Exact publication command — prepared, not executed

Use the full guarded `build/gs-launch-020/PUBLICATION-COMMAND.ps1` only after authorisation and installation of the final approved record. It validates publisher predicates, both receipt/ZIP hashes, unchanged source/previous artifact branch, successful accepted run and equality with the installed variable before dispatch. Syntax is checked; the script is not run. Current unsigned input must stop it.

Its exact final dispatch is:

```powershell
$approvalFile = 'C:\Users\atikm\.codex\worktrees\gs-launch-018\Gridsmith Ltd\build\gs-launch-020\OWNER-PREVIEW-APPROVAL.json'
$approvalSha256 = (Get-FileHash -LiteralPath $approvalFile -Algorithm SHA256).Hash.ToLowerInvariant()
gh workflow run ci.yml --repo atikmurtaza/Gridsmith-Ltd --ref codex/gs-launch-018 -f publish_preview=true -f accepted_run_id=40332154565 -f approved_artifact=8028cb984402db08d7ba016ab656c5602dfdfae5bc3a49fda7f70b6b890a65e4 -f "approval_sha256=$approvalSha256"
```

No approval hash placeholder is needed: the command reads the final approved file. The reusable publisher skips its static build and downloads `hostinger-static` from run 40332154565. It copies those accepted bytes into the artifact branch. The caller's normal `verify` job is unconditional and also runs its ordinary tests/build; that output never replaces the accepted release. No such build ran during preparation, and the workflow is not changed to bypass it.

## 7. Exact Hostinger manual Redeploy steps — future approved action

1. Require the full publication workflow to succeed, including the publisher. Record its new artifact commit and independently verify its tracked payload/identity against the accepted release. If the workflow fails, stop even if the artifact branch was updated.
2. Open hPanel → Websites → **mediumaquamarine-wallaby-594070.hostingersite.com** → **Dashboard**. Confirm the exact hostname in the selector.
3. Reconfirm repository **atikmurtaza/Gridsmith-Ltd**, branch **codex/gs-hostinger-artifact**, root **public_html** and **Auto-deployment OFF**. Any difference is a stop.
4. Click this temporary dashboard's **Redeploy** control for its connected Git deployment. If confirmation appears, check the temporary target before confirming. Do not change domain, root, branch, auto-deployment or production settings.
5. Wait for **Completed** and retain deployment time/commit. Read the temporary `/__deployment.json`: require source `13032b1735c320842d7dc25f3de03afa704d3e33`, identity `8028cb984402db08d7ba016ab656c5602dfdfae5bc3a49fda7f70b6b890a65e4`, acceptance run `40332154565` and `ACCEPTANCE_PASSED`. Then perform the existing hosted read-only route/file/HTTP/legal/contact/noindex checks and owner visual/device review. Do not submit enquiries or activate intake.

Redeploy was observed but never clicked. No unseen submenu or confirmation dialogue is asserted.

## 8. Proposed transaction and approval request

On explicit approval: finalise/install only the exact non-secret approval record; dispatch the existing workflow with the inputs above; append one accepted generated-files commit to `codex/gs-hostinger-artifact`; then manually redeploy only the named temporary website and verify it read-only. The accepted 212 files are reused. Auto-deployment stays OFF.

Source branch/commit, `main`, WordPress, `gridsmith.uk`, DNS, mail, provider settings and legal sources/adoption receive no writes. Rollback is prepared but is not automatically authorised because it restores old enquiry forms/reviews.

**Approval requested:** approve finalising/installing this record, publishing this exact accepted release through the existing artifact branch, and manually redeploying only `mediumaquamarine-wallaby-594070.hostingersite.com`, followed by read-only hosted verification. No authority is inferred until the owner explicitly answers.

## Publication completion and Redeploy access blocker

Whole [publication workflow 40367278523](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/40367278523) completed SUCCESS on exact approved source. Both normal verify and publisher pass; static rebuild skipped. Artifact branch remains `f1e1da1aad6c5f1dbc4df3a432a0063be3eacf86`; all 212 published files match accepted bytes. Final pre-Redeploy browser read was refused because local browser use is disabled in Work settings. No Redeploy click occurred. Owner asked to re-enable browser access or manually Redeploy only the approved temporary site; no new deployment approval is required. Hosted acceptance remains pending.

## Owner Redeploy and hosted acceptance result

Owner replied `redeployed`. Read-only hosted verification confirms exact accepted identity/source/run. Publication workflow40367278523 remains SUCCESS; artifact commitf1e1da1a is exact. The HTTP sweep covers210publicpayloadfiles and61routes. All61routes return200/noindex;209files match accepted bytes; all7legal documents/109clauses/406paragraphs match word-for-word. Redirects, hiddenpathdenial, branded404,HEAD and compression checks pass.

**Hosted acceptance FAIL:** Hostinger serves a different58byte robots file permitting general crawling instead of accepted26byte Disallow:/; canonical immutable cache stillserves3removedJSfiles and oldsecurityheaders; PNGresponses lackCSP even on fresh-queryMISS. Fresh-query deletedJS404/currentsharedchunkCSP proves a cache contribution, but PNG/robots failures are not established as cache-only. All raw receipts retained in build/gs-launch-020/; no thresholdwaiver or deployable acceptance inferred. No cachepurge/providerconfiguration/sourcechange/rollback was performed. BrowserUI/axe remains unrun while browseraccessdisabled; no enquiries were submitted. Production/DNS/mail unchanged.

Next bounded action requires authority: purge onlytemporarysitecache and inspect temporaryrobots/PNGresponse controls read-only. Any specific configuration fix must be presented for approval before provider changes. No rebuild is recommended.

Official Hostinger documentation reviewed: [temporary domains are automatically optimized and CDN settings cannot be modified](https://www.hostinger.com/support/which-plans-include-hostinger-cdn/); [CDN status/request-ID interpretation](https://www.hostinger.com/support/hostinger-cdn-troubleshooting-website-errors/). These support interpreting observed HIT/MISS and scope the provider enquiry; they do not establish the cause of generated robots or missing PNG CSP. Exact unsent support draft and request IDs: build/gs-launch-020/HOSTINGER-SUPPORT-UNSENT.txt. No message sent.
