# GS-LAUNCH-023 — release source consolidation and production integration

26 October 2026 (Europe/London). **CONDITIONAL — source consolidated; verification/review closeout pending; production HOLD.** This phase integrates source and prepares review only. It does not authorise merging, deployment, legal publication, WordPress changes or provider operations. Earlier support-request recommendations are superseded; customer support is not a release prerequisite.

## 1. Starting state and preserved work

- Primary checkout: `codex/gs-launch-001`, `f6cdd6daa2ac52788d029d72170b14011d2f899f`, with existing modified/untracked work.
- Accepted application: `codex/gs-launch-018`, `13032b1735c320842d7dc25f3de03afa704d3e33`; local and freshly fetched remote agree.
- Investigation: local-only `codex/gs-launch-021`, same HEAD, with GS-LAUNCH-019–022 records and an uncommitted Windows axe correction.
- Remote main: `dbde73d30536543c54c7822b7cec092a25e13525`. Reverified divergence: main-only 1 commit, accepted-source-only 140 commits.
- Artifact branch: `codex/gs-hostinger-artifact`, `f1e1da1aad6c5f1dbc4df3a432a0063be3eacf86`.

Before integration, 37 modified/untracked files across the primary, launch-018 and launch-021 checkouts were copied byte-for-byte and SHA-256 checked. The private inventory, copies, branch list and worktree list are under `C:\Users\atikm\.codex\task-evidence\gs-launch-023\`. Original worktrees, branches, ignored build receipts and private evidence are retained. No reset, clean, rebase, force-push or historical worktree deletion is part of this phase.

The isolated integration checkout is `C:\Users\atikm\.codex\worktrees\gs-launch-023\Gridsmith Ltd`, branch `codex/gs-launch-023`. Its ignored `node_modules` junction reuses launch-018's installed tools; no dependency install or lockfile change was made locally. CI must install independently at the new source SHA.

## 2. Main reconciliation and change boundary

Merge commit `0201301e07f64ae3673a1ec9889f81ad340daa36` preserves both histories: accepted source first parent, fetched main second parent. There were no conflicts. The four additions are byte-identical in Git to main:

- `.github/workflows/supabase-availability.yml`
- `.github/workflows/notification-drain.yml`
- `scripts/supabase-availability.sh`
- `scripts/notification-drain.sh`

Availability remains the existing default-branch schedule. Its enable variable is already `true`; this phase does not change or dispatch it. `GS_PRODUCTION_DRAIN_ENABLED` is absent from the current repository variable list, so notification drain is disabled. Both workflows have only schedule/manual triggers. A feature push or PR cannot activate either job. No backend deployment or database mutation is introduced.

Application files, routes, styles, CMS schemas, dependencies, legal texts/register, existing CI and Hostinger workflows, and `vercel.json` match the accepted source. The only changed existing executable is `scripts/check-static-ui.mjs`.

## 3. Consolidated launch records and exact identities

GS-LAUNCH-019's final local report/evidence and GS-LAUNCH-020's preparation/execution history are incorporated. GS-LAUNCH-021/022 reports retain chronology with explicit current-authority annotations. Their public evidence summaries bind the original complete local JSON by SHA-256 and size. Raw headers, browser receipts, screenshots, private operational evidence and historical unsent support drafts remain outside public Git history. Historical links to excluded support drafts are identified as privately retained, superseded records.

Latest established hosted result, from GS-LAUNCH-022:

| Subject | Recorded result |
|---|---|
| Accepted source | `13032b1735c320842d7dc25f3de03afa704d3e33` |
| Accepted preview payload | `8028cb984402db08d7ba016ab656c5602dfdfae5bc3a49fda7f70b6b890a65e4` |
| Accepted CI | [40332154565](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/40332154565), SUCCESS |
| Publication CI | [40367278523](https://github.com/atikmurtaza/Gridsmith-Ltd/actions/runs/40367278523), SUCCESS |
| Published artifact commit | `f1e1da1aad6c5f1dbc4df3a432a0063be3eacf86` |
| Routes / legal parity | 61 exact route HTML matches; all 7 documents, 109 clauses, 406 paragraphs |
| Obsolete served assets | All 26 paths return 404 after owner-confirmed temporary-site flush; closed for the measured URLs |
| Public file parity | 209/210 match; robots is the remaining mismatch |
| robots.txt | FAIL: provider response replaces the accepted on-disk file |
| PNG response CSP | FAIL: missing on all 9 PNGs, including fresh-query responses |
| Actual deployed `.htaccess` | UNVERIFIED; previous independent download did not complete |

These are historical measurements of the accepted preview, not acceptance of this integration commit or the future production origin. The corrected Windows harness belongs to GS-LAUNCH-023 source integration; it is not retroactively part of the accepted source SHA.

## 4. Windows axe correction

The exact launch-021 correction resolves `axe-core/axe.min.js` once with `createRequire(fileURLToPath(import.meta.url))` and passes its text to the error-document `AxePuppeteer` constructor. The other four constructors already supplied this text. This avoids the adapter's encoded Windows path with spaces. No route list, WCAG tag, assertion, threshold or dependency changes.

Callers inspected: `check:static:ui`, `scripts/with-preview-apache.mjs`, the static acceptance workflow and all five constructors in this file. Existing permanent unknown-route/500-document subjects and visible adverse contrast replay remain. Fresh Windows execution and exact-SHA Linux CI are separate evidence; installed Windows Chrome is not the authenticated Linux browser.

## 5. Deployment trigger review

| Event/control | Finding |
|---|---|
| Feature push | Runs ordinary CI and owner-preview acceptance; publisher input is false |
| Draft PR opened/reopened | Runs the same acceptance workflow against the PR merge ref; no publication input |
| Hostinger publication | Requires explicit workflow dispatch, `publish_preview=true`, successful accepted run, exact source/payload/destination/approval hash and expected previous artifact tip; all controls retained |
| Artifact-branch push | Only the separately approved publisher writes it; this phase never pushes that branch |
| Hostinger consumer | Latest retained hPanel/owner evidence maps only the temporary site to the artifact branch, manual Redeploy, auto-deployment OFF; production Git showed provider-connect setup. No fresh provider-setting audit is claimed |
| Vercel Git integration | Accepted `vercel.json` retains `git.deploymentEnabled:false`; no Vercel deploy command in the integrated workflows |
| Main's older Vercel configuration | Its Next build/cron configuration is not restored; main's only unique commit touches the four operations files |
| Other repository triggers | No repository webhooks listed; main workflows have no `workflow_run`/`repository_dispatch` deploy chain. Legacy registered Smoke workflow has no file on current main or integration |
| Production CMS/backend | No migration/seed/deployment commands introduced; CI uses existing read-only production CMS export and isolated Preview probes, not production intake |

Vercel's [documented Git control](https://vercel.com/docs/project-configuration/git-configuration) confirms boolean false disables automatic deployments. Authenticated project lookup identifies `gridsmith-ltd`; the connector's reduced response does not expose Git-link settings, so it is not claimed as an independent audit of those settings. The committed config, absence of deploy steps and scoped manual Hostinger writer establish the source-push boundary. No provider configuration is changed. Future mapping/control changes require a fresh review.

The existing accepted preview approval is tied to the old exact identity. It does not approve publishing this source or any production release. Ordinary code review cannot replace WordPress through these workflows. Main is not merged in this phase.

## 6. Verification

Local detailed logs are in `build/gs-launch-023/`; public summary and hashes are in `GS-LAUNCH-023-EVIDENCE.json`.

| Check | Result |
|---|---|
| Fetched identities, main ancestry, conflict/whitespace checks | PASS; conflict-free history-preserving merge |
| `npm run verify:static` | PASS, including TypeScript, ESLint, source/content/security/legal/schema and static/edge selftests |
| `npm audit --omit=dev --json` / `npm audit --json` | PASS; zero vulnerabilities in each |
| `node scripts/preview-release.selftest.mjs` | PASS; 52 positive/adverse release proofs |
| Browser installer/extractor selftests | PASS with `--python C:\Python314\python.exe`; default Windows `python3` alias attempt failed with 9009 and is retained |
| Four workflow YAML parses / imported shell `bash -n` | PASS; triggers/jobs inspected, shell syntax valid |
| `node --check scripts/check-static-ui.mjs` | PASS |
| Production builder refusal | PASS as a negative proof: exit 1 names DIRECT-CONTACT-VERIFIED and all seven non-PUBLISHABLE documents before CMS/build/cleanup |
| `npm run verify:build` | FAIL: shared baseline 2.93 KB exceeds 2.9 KB; compilation, secret scan, tokens and theme checks PASS. Clean accepted-source comparison underway; threshold unchanged |
| Fresh Windows hosted UI/axe | PASS: 20 pages, 20 no-JS pages, 70 legal combinations, 41 focused plus 2 error analyses, zero violations; 23 incomplete-rule occurrences retained. Existing adverse contrast specimen rejects. This measures the unchanged preview, not a new payload |
| New exact-SHA Linux CI / Apache / Lighthouse | NOT RUN at this checkpoint; historical accepted run is not substituted |
| Production deployment / real fault injection / WordPress recovery | NOT RUN; outside this phase |
| App visual redesign / new feature validation | NOT APPLICABLE; no application change |

## 7. Commits and review

The main reconciliation commit is listed above. Consolidation/source and final documentation commits, draft PR URL, exact tested SHA and CI disposition will be added at closeout. The PR targets `main` and must remain a draft/unmerged. Final branch tip is available through `git rev-parse codex/gs-launch-023`; the enclosing documentation commit cannot embed its own hash.

## 8. Release eligibility and owner actions

**Production remains NO-GO.** Seven documents remain OWNER_ADOPTED and zero PUBLISHABLE. Dated private O1–O5 direct-contact operational evidence remains required; no form/intake or notification activation is needed for the direct-contact launch. Publication authority, all-seven legal eligibility/parity, Privacy co-publication, Cookie production-origin retest, applicable operational prerequisites and exact artifact-bound cutover approval remain separate gates. Approved content, excluded Technical services, disabled analytics/reviews and contact wording are unchanged.

No owner interaction is required to perform this source integration. Do not send support messages, repeat the cache investigation or change hosting to complete this phase. Any later production action requires its own explicit authority.

## 9. Single recommended next task

**WordPress backup, restoration verification and production destination preparation**, under a separately issued task. Begin from this integrated source and the retained GS-LAUNCH-020 destination screenshots, not by restarting preview-cache diagnosis.

Collect dated, privately retained evidence for:

1. The actual `gridsmith.uk` WordPress document root and its owning website; distinguish it from the temporary static site's root.
2. The database mapping from that site's configuration, without printing credentials or copying them into Git.
3. Matched file/database backups from one consistent recovery point, their sizes, hashes, storage location and access controls.
4. A successful restoration into an isolated destination, including representative pages, media, administration and database integrity; never rehearse by overwriting production.
5. The intended production static destination and its isolation from WordPress, with an available reversible switch method and exact rollback steps/authority.
6. All writers/triggers: Hostinger Git root/branch/manual controls, repository workflows, Vercel disablement and any other discovered publication path.
7. Acceptance/rollback criteria at the actual custom origin: final production identity and every file/route, intended robots/indexing, CSP on documents and PNGs, actual deployed `.htaccess`, stale assets, cache/MIME/compression/redirect/HEAD/error behaviour, direct contact and all-seven legal parity. Temporary-domain defects are neither waived nor presumed to recur; investigate a supported correction or delivery alternative if they occur on the production origin.

None of these recovery/destination operations was performed by GS-LAUNCH-023. Do not merge or cut over as an implicit continuation. The release coordinator selects the next prompt.
