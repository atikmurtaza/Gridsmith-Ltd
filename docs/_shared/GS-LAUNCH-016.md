# GS-LAUNCH-016 — Accelerated Hostinger cutover readiness

25 October 2026, Europe/London. **Preparation complete; production release HOLD. Nothing uploaded or deployed.**

**Decision:** static generation works, but a production-ready release has not yet been established. The production builder refuses the current legal/publication inputs. The newly verified export is a protected rehearsal, not an upload candidate. No new application defect requiring a code change was identified by the checks executed here.

## Candidate and package

The primary checkout was actually `codex/gs-launch-001` at `f6cdd6daa2ac52788d029d72170b14011d2f899f`, with unrelated modified/untracked files. It was preserved. The clean supplied candidate was verified in its existing worktree, then checked out independently on `codex/gs-launch-016` at **`373c04b69a2bf9612b0807694f9d0d3262235c3a`**. All execution below binds to that source, before these documentation changes.

- Export: `build/production-rehearsal/`; 54 eligible HTML routes, 199 files, 28,690,907 bytes.
- Identity: `9080c3572986d75b8135c6440b04b247f01f149a2a513728214ccae2bdaf5378`.
- Local archive: `build/gs-launch-016/GS-LAUNCH-016-NONDEPLOYABLE.zip`; 9,631,993 bytes; SHA-256 `3c2a5b1d7f4bfb47373082fed791eff89605f0cdfc545621ad624d364c8974c8`.
- `sourceModified:false`, `profile:production`, `contactMode:direct`, **`rehearsal:true`, `deployable:false`, `Require all denied`**.

The [complete manifest](GS-LAUNCH-016-ARTIFACT-MANIFEST.json) hashes all 199 files, including identity and hidden configuration, and records source/package/lock/legal hashes, routes and CMS revisions. The builder's identity hashes its 198 payload records; it excludes the self-referencing `__deployment.json`. Every archive entry was separately hashed against the export. The archive reconstructs those exact bytes; a new build depends on unchanged CMS revisions and must receive a new identity if content changes.

**Do not upload this rehearsal, remove its denial, edit its flags or promote an earlier rehearsal.** A fresh production build after genuine prerequisite clearance is necessary. The later local documentation commit is not the tested artifact's source SHA.

## Checks actually performed

Exact commands, UTC times, exit codes, log hashes, audit objects and limits: [evidence](GS-LAUNCH-016-EVIDENCE.json). Raw logs remain local under `build/gs-launch-016/`. Windows Node 24.15.0 / npm 11.12.1; own clean lockfile installation, automatic browser download suppressed.

| Check | Result | Scope |
|---|---|---|
| Clean install; TypeScript; lint; full `verify:static` | PASS | Full aggregate, including positive/adverse contact, legal, export, security and dependency-consumer checks |
| Clean normal `verify:build` | PASS | `.next` absent before build; production-mode Next build, secret-marker scan, tokens/themes, all 69 bundle budgets |
| Normal local HTTP contact/company | PASS | Ten questions on 21 routes; exact email/WhatsApp destinations; no SMS/tel actions |
| Normal local legal inclusion/parity | PASS | Seven documents, 109 clauses, 406 paragraphs word-for-word; two consumer routes / 208 links |
| Local legal generation and adoption hashes | PASS | Seven OWNER_ADOPTED; zero PUBLISHABLE; no CMS write |
| Production dependency audit | PASS | `npm audit --omit=dev --json`, zero findings |
| Full dependency audit | FAIL | Nine high affected entries; three residual advisories in development/browser tooling; no risk acceptance inferred |
| Production static build/export | FAIL | Expected protective refusal: missing DIRECT-CONTACT-VERIFIED receipt plus seven not-PUBLISHABLE entries; no `out/` |
| Denied production-profile static export | PASS | 54 routes; route/asset/link integrity and all payload hashes; only expected LEGAL/REHEARSAL contract refusals |
| Whole-export contact/company and archive integrity | PASS | Ten company questions and exact email/WhatsApp links on 54 routes; form/intake/notification transport excluded; all 199 archive entries match |
| Legal-page inclusion in upload candidate | NOT RUN | No upload candidate exists; all seven legal HTML pages are deliberately absent from the denied rehearsal |
| Apache/Hostinger routing and served headers | NOT RUN | Generated rules inspected and their existing adverse selftests passed; actual module/override/CDN behaviour unverified |
| Responsive/browser/no-JS/keyboard/axe/Lighthouse/cookie A-2/Linux/exact-source remote CI | NOT RUN | No supported policy-cleared Linux job supplied; no denied container retry, browser-risk acceptance, push or dispatch; browser account connection timed out |

The normal Next build retains development forms/probes. It is neither the direct-contact export nor a deployable alternative. Selected HTTP checks are not browser acceptance; the harness's Windows Lighthouse notice is a skip, never a pass.

At 16:34:44–16:34:48 UTC a read-only GET found the existing WordPress homepage HTTP 200. Public apex/www/MX/TXT/DMARC DNS samples were saved locally. This does not establish the private root/database, a complete DNS zone, mailbox delivery or a restore receipt. Browser inventory succeeded, but opening a new hPanel tab timed out after 30 seconds; no account settings were inspected or changed.

## Prioritised findings and ownership

**L016-1 — CUTOVER BLOCKER: no admissible final artifact (owner + release operator).** The actual builder exits 1 with eight unmet inputs. `lib/build/production.ts`, `scripts/build-static.mjs`, the active adoption register and `GS-PROD-001-CMS-MANIFEST.json` enforce them. Clear the existing direct-contact receipt using genuine source/artifact and operational evidence; separately authorise all-seven publication, record the required prerequisites (including cookie A-2 and Privacy co-publication), then rebuild and check all seven final legal routes. No re-adoption of unchanged text is needed. If the owner wishes to change a prior evidence requirement, that requires an explicit recorded policy decision and corresponding reviewed controls, not an invented receipt or a nonblank placeholder reference.

**L016-2 — CUTOVER BLOCKER: replacement/recovery transaction unverified (Hostinger operator + owner).** Wrong-root replacement or an unmatched backup could destroy the existing site or prevent recovery. The live absolute root/database, separation from temporary sites, competing writers, matched recoverable backup and supported inverse switch are not established. Supply the eight short operational entries in the [owner sheet](GS-LAUNCH-016-OWNER-DECISION.md); credentials and database contents stay private. No support correspondence is requested. Backup creation, restore testing, writer freezes and root changes remain separately authorised execution.

**L016-3 — CUTOVER BLOCKER: mandatory acceptance remains incomplete (release operator; owner/policy administrator for access).** GS-LAUNCH-007's release matrix and GS-LAUNCH-010/015 retain supported Linux, Apache, responsive/accessibility/browser, Lighthouse and exact-source CI requirements. Supply one permitted supported job and publisher-safe execution authority; collect actual results against the eventual final artifact. The earlier automatic container-creation rejection is recorded in GS-LAUNCH-010; no retry occurred here. A local pass cannot waive these requirements. Any change to that policy needs an explicit owner decision where permitted, and environment-policy clearance from the responsible administrator.

**L016-4 — RELEASE QUALITY ISSUE, with an existing security release hold (technical maintainer + owner).** Full audit remains FAIL for GHSA-mrhx-c7xc-m3w5 and GHSA-jmr9-qjv8-65gv / GHSA-7pqw-9j4j-h8q3. These concern retained nested Zod/browser archive tooling, not a Node server on Hostinger. Before use/release under the existing GS-LAUNCH-009/010 policy, remediate or explicitly disposition the exact advisory/input/job scope, controls, accountable maintainer and expiry/review trigger. Do not run `npm audit fix --force` or substitute an implicit risk acceptance. Production audit zero does not clear this separate decision.

**POST-LAUNCH FOLLOW-UP:** optional analytics/reviews/forms, additional optimisation and administrative documentation. Retention/privacy administration continues on its existing schedule; the first scheduled November review is not overdue. This phase accepts the owner's new/test-only mailbox and France/EU hosting facts and does not repeat historical-data/provider investigations without a concrete contradiction; none was identified here. This does not erase existing duties or manufacture a completed operational receipt.

Normal Next request-time SSR M-P1-1 remains historically FAIL but **not applicable to this static launch**, as already decided in GS-LAUNCH-007. Independent outer-error hosting, exhaustive provider-failure research, new hosting, unrelated provider letters and inactive future agency work are not additional launch blockers.

## Shortest safe route to launch

Complete the owner sheet and the existing security/environment decisions in parallel. Record genuine publication prerequisites and explicit authority for local publication preparation; build a fresh clean, non-rehearsal artifact with all seven exact legal pages. Run the retained acceptance gates and bind its manifest to the verified private target, backup and inverse switch. Present that concrete transaction for separate owner upload/cutover approval. Only then perform the approved operation, production smoke/cookie repeat and bounded rollback if needed, following the [runbook](GS-LAUNCH-016-HOSTINGER-RUNBOOK.md).

No application, dependency, workflow, canonical legal text, register, CMS, provider or production change was needed. Local documentation is committed only on `codex/gs-launch-016`; no push, CI dispatch, upload, deployment, messages, historical deletion, WordPress, database, DNS or email change. **STOP after this preparation report.**
