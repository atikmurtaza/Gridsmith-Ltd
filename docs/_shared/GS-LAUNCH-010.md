# GS-LAUNCH-010 — Exact-source Linux acceptance recovery

25 October 2026 (Europe/London). **BLOCKED: no authorised Linux acceptance environment;
publication HOLD.** This is an execution-blocker closeout, not completed Linux acceptance.

Starting source: `c152cbe0fa3b07c2600c228975b3824faa7096e6` (`codex/gs-launch-009`).
Local branch: `codex/gs-launch-010`. Isolated worktree:
`C:\Users\atikm\.codex\worktrees\gs-launch-010\Gridsmith Ltd`.
The documentation commit is identified by `git log -1 --format=%H -- docs/_shared/GS-LAUNCH-010.md`.
Machine-readable results, audit objects, preservation checks and command receipts are in
`GS-LAUNCH-010-EVIDENCE.json`; raw logs remain in ignored `build/gs-launch-010/`.

## 1. Environment decision and exact source

Read-only local inventory found one ordinary WSL distribution: Ubuntu 26.04 LTS, Python 3.14.4,
no Linux Node or Apache; its discoverable npm path is the Windows installation. The other WSL
entry is Docker Desktop infrastructure. The unchanged browser policy accepts Ubuntu 24.04 or
local Debian 12, Linux x64/glibc. Ubuntu 26.04 does not qualify.

Docker inventory found the historical Gridsmith Node containers `gs-sec-001-r2`,
`gridsmith-r12-raster` and `gs-r12-ci-fix`, all exited. They are older task environments, not an
authorised clean GS-LAUNCH-010 environment. Unrelated running database/service containers are not
acceptance environments. None was started, entered, modified or repurposed. No approved remote
verification environment was supplied. This is a bounded local availability/authority conclusion,
not a claim to have searched every possible remote machine.

GS-LAUNCH-008 records automatic approval review rejecting container creation as “blocked by policy”.
That earlier rejection remains in force: no create/run retry, new container, policy change,
OS-policy exception or browser substitution was attempted here. Existing proof subjects also
require a disposable container (`/.dockerenv`) and `/work/repo`; an ordinary WSL/VM would not
execute those unchanged subjects. Execution stops before installation/build/served acceptance.

The new worktree started clean at the exact requested commit, with no `node_modules` or dependency
junction. Windows inspection used Node 24.15.0/npm 11.12.1 and bundled Python 3.12.14 for synthetic
fixtures only. No dependency installation occurred in this worktree or through the primary junction.

Fresh source bindings match GS-LAUNCH-009 exactly:

| Input | SHA-256 |
|---|---|
| `package.json` | `97854c2b19e9ca55d5a793bfb5a768ce28d2856d7c44159ebdccfff2b64dad31` |
| `package-lock.json` | `f45a725650c64e81bc8d580569e012ad07ca3d254e8ffaa63fb22c6cc57a6fa3` |
| Browser manifest | `20ac446b365c2e9f08d83355f66e99f78c4065c93c49099c45ebd4754be0cb54` |
| Effective source inventory, 367 files | `6183608babaa0b274b6d799c1b554cb032992c97ed79e127744b9964cc422b88` |

Inventory means SHA-256 of `JSON.stringify` over sorted non-doc Git-tracked path/SHA-256 objects,
as defined by GS-LAUNCH-009. This phase changes documentation only. Application, verification
controls, workflows, package/lockfile, assets, canonical legal sources and legal register are unchanged.

## 2. Current test matrix

PASS/FAIL below describes only the named question. NOT RUN is not a pass or a website defect.
No historical browser, bundle, artifact or Lighthouse result is credited as a current run.

| Required acceptance | Result | Current evidence/limit |
|---|---|---|
| 1. Clean Linux dependency install | NOT RUN | No authorised environment; no install attempted. |
| 2. Production/full installed-tree audits | NOT RUN | Separate fresh Windows lockfile-only observations below. |
| 3. Complete static verification | NOT RUN | No installed tree; no partial aggregate is called complete. |
| 4. Clean normal Next build | NOT RUN | No build or `.next` cleanup attempted. |
| 5. All 69 bundle budgets | NOT RUN | Previous candidate results are not substituted. |
| 6. Production builder refuses seven unpublished documents | NOT RUN | Adoption state freshly checked; builder execution remains pending. |
| 7. Fresh denied static rehearsal | NOT RUN | No new artifact or artifact identity. |
| 8. Apache Hostinger HTTP simulation | NOT RUN | Existing guarded setup/config retained unchanged. Actual Hostinger UNVERIFIED. |
| 9. Browser navigation/responsive layouts | NOT RUN | No actual browser acquired or executed. |
| 10. Keyboard/no-JS/reduced motion | NOT RUN | Served subjects unavailable. |
| 11. Axe accessibility | NOT RUN | No axe analyses; zero observed violations would be meaningless here. |
| 12. Master animation and Design/Digital scenes | NOT RUN | Existing subjects retained, no scene acceptance inferred. |
| 13. Desktop/mobile Lighthouse | NOT RUN | No collection, scores, H2 verification or Windows skip credited. |
| 14. Contrast membership verification | NOT RUN | No fresh axe membership inventory or rendered sampling. |
| 15. Contact/error behaviour | NOT RUN | No served HTTP, browser or keyboard acceptance. |
| 16. Full acceptance adverse specimens | NOT RUN | Existing HTTP/Lighthouse/contrast specimens not executed. Synthetic browser fixtures are separate. |
| Exact starting source, package/lock/source hashes | PASS | Clean starting state, absent dependencies, all 367 source bindings match. |
| Fresh production lockfile audit | PASS | `npm audit --package-lock-only --omit=dev --json`, exit 0, zero findings. |
| Fresh full lockfile audit | FAIL | `npm audit --package-lock-only --json`, exit 1, nine high affected entries / three advisory IDs. |
| Legal adoption source check | PASS | Seven drafts/documents coherent; seven OWNER_ADOPTED, zero PUBLISHABLE. |
| Synthetic browser authentication/control fixtures | PASS after invocation correction | 406 Node cases plus 161 Python cases; no browser/installer execution. |
| First synthetic-fixture invocation | FAIL, retained | Forward-slash Python argument failed the existing canonical absolute-path assertion. Backslash canonical path passes; no source repair. |
| Client-bundle secret gate | FAIL, prerequisite absent | Existing gate correctly refuses missing `.next/static/chunks`; no bundle was swept. No build is run to fill this gap. |
| Documentation/source control characters | PASS | Existing control-character gate; separate from full static verification. |
| Exact-SHA CI, hosted/manual/device acceptance | NOT RUN | No push, dispatch or hosted action; human acceptance remains separate. |

The two lockfile audit outputs are byte-identical to the final GS-LAUNCH-009 audit outputs.
They query current registry advisories against the unchanged lockfile, without installing packages
or running lifecycle scripts. They do not verify platform-specific resolution or an installed Linux tree.
All command receipts retain UTC timestamps, exit codes and raw-log hashes. No genuine website defect
was established or corrected in this phase.

## 3. Remaining security risk and unsigned proposed disposition

The current full audit still reports:

- [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5): nested
  `chromium-bidi@14.0.0` → `zod@3.25.76`. Direct Zod remains patched at 4.6.6; the nested v3 copy
  is not patched. Oversized constrained-collection parsing can exhaust memory.
- [GHSA-jmr9-qjv8-65gv](https://github.com/advisories/GHSA-jmr9-qjv8-65gv) and
  [GHSA-7pqw-9j4j-h8q3](https://github.com/advisories/GHSA-7pqw-9j4j-h8q3):
  `extract-zip@2.0.1`, symlink escape/write paths. Both advisory pages still list no patched version.

The nine high entries include affected parent packages; they are not nine distinct advisory IDs.
Official advisory pages were checked during this phase. Their current details and the registry audit
are complementary evidence; the lockfile audit remains the counted result.

Invocation and input boundaries (source analysis, not a new exploit proof):

| Path | What can invoke the affected dependency | Controlled-workflow disposition |
|---|---|---|
| Puppeteer install lifecycle / explicit `@puppeteer/browsers` installer | Browser installer → `unpackArchive(.zip)` → `extract-zip` | Clean install requires `PUPPETEER_SKIP_DOWNLOAD=true`; existing install-controls reject explicit installer calls, skip reactivation and configuration/credential/loader overrides. These are controls, not a sandbox against arbitrary lifecycle code. |
| Browser acquisition for all Puppeteer/Lighthouse checks | Existing `browser-input.mjs provision` → authenticated Google DEB → Python verifier/extractor | Signed index/key, pinned DEB size/hash, inventory, paths, ELF/loader/library and consumer identity checks retained. This does not call the Puppeteer ZIP extractor and does not accept arbitrary archives. |
| Browser tests / Lighthouse through Puppeteer | Chrome defaults to CDP; explicit `protocol: 'webDriverBiDi'` can enter Puppeteer's BiDi-over-CDP mapper → `chromium-bidi` protocol parser → nested Zod `safeParse` | Current test launches do not select BiDi. The shared launcher can forward a future protocol option; no runtime prohibition is claimed. Changing protocol, adding a remote browser or accepting external BiDi input reopens review. Vulnerable constrained-input reachability in a real BiDi session was not proven. |
| LHCI → Lighthouse 12.6.1 → puppeteer-core 24; top-level Puppeteer 24 | Retains the affected browser/mapper dependencies through both chains | Named runtime executable is verified before either consumer. Upgrading only top-level Puppeteer would not establish complete removal of the LHCI chain. |
| Static build and Hostinger artifact | Next build has direct Zod 4; browser tools are development dependencies | No request-time Node/browser tooling is installed by the intended file-only Hostinger release. A clean production lockfile audit is not certification of a future hosted artifact. |

The library call paths above were also read in the retained GS-LAUNCH-009 ordinary dependency tree
without changing or executing it. That inspection is explanatory source evidence, not a fresh
GS-LAUNCH-010 dependency installation. Existing current source guards were re-exercised synthetically.
No override, upgrade, audit suppression or validation weakening was applied.

**DRAFT — OWNER DECISION REQUIRED, NOT ACCEPTED OR SIGNED:**

> Proposed scope: a time-limited exception solely for isolated static build/test work on effective
> source `6183608babaa0b274b6d799c1b554cb032992c97ed79e127744b9964cc422b88`, package/lock hashes
> above, and the three named advisory IDs. Residual availability and filesystem-write risks remain.
> Preconditions: a separately policy-cleared disposable supported Linux container, unprivileged
> test user, no privileged credentials or host mounts/ports, reviewed exact source and inputs,
> bounded resources, suppressed automatic browser download, unchanged authenticated Google DEB
> provisioning/identity controls, local Chrome CDP and loopback acceptance only. Keep full audit red
> and preserve evidence; this exception must not change audit thresholds or claim remediation.
> Excluded: arbitrary ZIPs, unreviewed branches/packages, external browser/BiDi inputs, request-time
> Node hosting, live forms/intake, production credentials, CI publication, upload, legal publication
> and cutover. Maintenance owner: **owner must name and confirm an accountable technical maintainer
> before adoption**. Review before the next build session and immediately on a new/fixed advisory,
> lockfile/source/control/protocol/browser-input change, failed identity check or suspected compromise.
> Expire at the end of the specifically approved acceptance session unless the owner renews it.

No acceptance, maintenance appointment, date of acceptance or owner signature is recorded. The
environment clearance and residual-risk disposition are separate decisions; neither authorises publication.

## 4. One concrete owner setup requirement

**Owner/policy administrator must clear and provision one new disposable Ubuntu 24.04 x64 Docker
acceptance job, with its image identity recorded, then authorise resuming GS-LAUNCH-010.** This route
preserves the existing `/.dockerenv` proof guard and `/work/repo` path. The earlier policy rejection
must be resolved through the permitted approval mechanism before any create/run/build operation.
These commands are a proposed operator runbook, **NOT RUN and not evidence of a working environment**.
An owner message alone does not bypass an enforced policy rejection.

Prerequisites: approved Docker execution and outbound Ubuntu packages / nodejs.org / npm registry /
Google browser provenance endpoints / public build-time Sanity content; reviewed official Ubuntu
24.04 image digest; at least 4 CPU/8 GiB and adequate disk; no production secrets, copied dotfiles,
Docker socket, host ports or host directory mounts. Retain setup outputs and image/package identities.
Run package provisioning as root, then source/install/test operations as UID 10001.

After policy clearance, an operator can create the bounded job using the reviewed digest:

```powershell
$approvedUbuntuImage = 'ubuntu@sha256:<OWNER-REVIEWED-UBUNTU-24.04-AMD64-DIGEST>'
# Replace the explicit prerequisite above; never execute it as a literal placeholder.
docker create --name gs-launch-010-linux --init --platform linux/amd64 --cpus 4 --memory 8g --pids-limit 1024 --shm-size 1g --security-opt no-new-privileges:true $approvedUbuntuImage sleep infinity
docker start gs-launch-010-linux
```

Provision inside that job as root, with `set -eu` and no injected credentials/configuration:

```sh
set -eu
. /etc/os-release
test "$ID:$VERSION_ID:$(uname -m)" = ubuntu:24.04:x86_64
apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
  ca-certificates curl xz-utils git gnupg python3 apache2 mime-support openssl \
  libglib2.0-0t64 libnss3 libnspr4 libatk1.0-0t64 libatk-bridge2.0-0t64 \
  libdbus-1-3 libcups2t64 libexpat1 libxcb1 libxkbcommon0 libasound2t64 \
  libgbm1 libx11-6 libxext6 libcairo2 libpango-1.0-0 libudev1 \
  libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libatspi2.0-0t64 \
  fonts-liberation
cd /tmp
curl --fail --proto '=https' --tlsv1.2 -o node.tar.xz https://nodejs.org/download/release/v24.15.0/node-v24.15.0-linux-x64.tar.xz
printf '%s\n' '472655581fb851559730c48763e0c9d3bc25975c59d518003fc0849d3e4ba0f6  node.tar.xz' | sha256sum -c -
tar -xJf node.tar.xz -C /usr/local --strip-components=1
PUPPETEER_SKIP_DOWNLOAD=true npm install --global npm@11.12.1 --no-audit --no-fund
test "$(node --version)" = v24.15.0
test "$(npm --version)" = 11.12.1
python3 -c 'import sys; assert sys.version_info >= (3, 12)'
useradd --uid 10001 --create-home --shell /bin/bash verifier
install -d -o verifier -g verifier -m 0755 /work
dpkg-query -W > /work/environment-packages.txt
```

The pinned Node tar hash is from the official
[v24.15.0 release checksum file](https://nodejs.org/download/release/v24.15.0/SHASUMS256.txt).
APT/package availability, browser-library ownership and the complete proposed environment are
unverified until executed; any failed prerequisite stops setup, without relaxing the browser gate.
Do not install a browser with APT or Puppeteer's installer.

Transfer source without credentials or a push: after verifying local `codex/gs-launch-009` still
resolves to the starting SHA, create a Git bundle of that ref with its history, copy only that bundle
using `docker cp`, and clone it as `verifier` into `/work/repo` (never copy the dirty primary tree,
`node_modules`, `.env` or existing build artifacts). Exact operator commands, after clearance:

```powershell
if ((git rev-parse codex/gs-launch-009).Trim() -ne 'c152cbe0fa3b07c2600c228975b3824faa7096e6') { throw 'Source ref moved; stop' }
git bundle create build/gs-launch-010/candidate.bundle codex/gs-launch-009
if ($LASTEXITCODE -ne 0) { throw 'Bundle failed; stop' }
docker cp build/gs-launch-010/candidate.bundle gs-launch-010-linux:/work/candidate.bundle
docker exec --user 10001:10001 --workdir /work gs-launch-010-linux git clone /work/candidate.bundle /work/repo
docker exec --user 10001:10001 --workdir /work/repo gs-launch-010-linux git checkout --detach c152cbe0fa3b07c2600c228975b3824faa7096e6
docker exec --user 10001:10001 --workdir /work/repo gs-launch-010-linux git remote remove origin
```

Removing the bundle-path remote satisfies the unchanged install control's public-HTTPS-only remote
policy; it does not remove history. Run every operator step with exit-code checking and stop on the
first failure. Confirm the unprivileged session uses its own `/home/verifier` home/configuration.

Inside `/work/repo`, as `verifier`, first assert exact HEAD, clean `git status --porcelain`, absent
`node_modules`/`.next`, exact Node/npm/Python and the package/lock hashes above. Then execute the
existing GS-LAUNCH-009 §“Next permitted verification procedure” unchanged with its SHA variable
set to `c152cbe0fa3b07c2600c228975b3824faa7096e6`. It already specifies preinstall fixtures,
install-controls, authenticated browser provisioning, clean `npm ci`, installed-control/identity
checks, both audits, complete static verification, normal build and denied rehearsal. Capture the
production builder's expected seven-document refusal separately before rehearsal; it is an expected
exit 1, not a reason to remove the legal gate. Do not stop the workflow merely because the known full
audit returns 1: retain it as FAIL and apply only an actual approved disposition.

Use the unchanged GS-LAUNCH-007 setup/Apache config, HTTP gate, static UI/axe, desktop/mobile LHCI,
contrast and negative-proof sequence printed in GS-LAUNCH-009. Run the guarded subjects sequentially;
one proof owns its subject at a time. Keep fresh raw logs, UTC times, exits, browser/provenance/library
identity, artifact identity/file hashes, and exact restoration proofs. No existing artifact is reused.
Retain setup errors and original failed runs; copy receipts out with `docker cp`. Stop only owned
processes and preserve evidence before any separately authorised cleanup. No pipeline dispatch.

## 5. Remaining publication actions and recommendation

Seven legal documents remain OWNER_ADOPTED, zero PUBLISHABLE. GS-LAUNCH-008's owner fact questions
and proposed direct-contact Privacy/Accessibility corrections remain proposals; canonical texts and
register/prerequisites were not edited. In particular H4-B's live-intake premise cannot be marked
met by a direct-contact launch. Any future accurate direct-contact prerequisite supersession and
all-seven publication need their own explicit authority.

Current Hostinger target/root/publisher safety, dated WordPress/files/database backup and restore
proof, rollback operator/mechanism, exact release artifact/destination and final transaction approval
remain outstanding. This phase creates no release artifact and approves no upload, root switch,
WordPress, DNS/email, provider/Production write or hosted fault test. CI/hosted/manual acceptance
remain separate; Hostinger-only static delivery and disabled forms/intake/analytics/reviews/Technical
services are preserved. No Vercel or request-time Next runtime is introduced.

**One recommended next task:** owner/policy administrator provision and clear the one specified
Ubuntu 24.04 acceptance job, resolve its scoped residual-risk disposition, and resume GS-LAUNCH-010
against the exact candidate. Full Linux acceptance remains incomplete. Do not start GS-LAUNCH-011.
