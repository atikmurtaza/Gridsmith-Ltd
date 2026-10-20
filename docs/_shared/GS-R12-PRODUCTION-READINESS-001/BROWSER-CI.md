# C. Browser provisioning (Option A) and CI validation report

> **20 Oct 2026 update:** Option A ran end to end on Linux in exact-SHA CI 39378746236 (`17080169`).
> Provision took about 25 s, `check` about 10 s, and every consumer reported Chrome 155.0.8059.79.
> BRW-RT-01 is PASS. Fixes found before the run: `493e3cad`, `e4dfe8f8`, `d9cb6c15`
> ([LEDGER.md](LEDGER.md) §6–§8). The text below is the 18 Oct state.

## 1. What is in the candidate

The independently reviewed Option A source (17 paths) was imported byte-for-byte from the isolated
Option A worktree (`fe72bdbc`; hashes compared file by file; the source worktree was not modified).
It changes CI so that every browser consumer uses one authenticated, fixed Chrome:

- `config/browser-input.json`: `google-chrome-stable` **155.0.8059.79-1** amd64 `.deb`,
  143,638,568 bytes, SHA-256 `b7726070…badc`, from `https://dl.google.com` with redirects
  rejected; signed `InRelease`/`Packages` snapshot and signing key committed under
  `config/browser-provenance/`.
- `scripts/browser-input.mjs` (`install-controls`, `provision`, `check`) and
  `scripts/extract-verified-browser.py`: signature and digest verification before extraction;
  traversal/symlink/hardlink/mode/member-inventory checks; ELF and loader-closure checks; exact
  version check; fail closed.
- `ci.yml`/`hostinger-staging.yml`: `permissions: contents: read`, `persist-credentials: false`,
  `PUPPETEER_SKIP_DOWNLOAD: 'true'`, `ubuntu-24.04` for `verify`, the Option A steps before and
  after `npm ci`; unused `actions: read` removed.
- `scripts/browser-launch.mjs` and `scripts/check-lhci.mjs`: on Linux/CI, Puppeteer and Lighthouse
  must use the verified executable; discoverable Puppeteer config and LHCI overrides are refused.
  All 16 launching scripts go through `browser-launch.mjs` (static grep).

## 2. Defects found and fixed in this phase

| ID | Defect | Effect if unfixed | Fix | Evidence |
|---|---|---|---|---|
| BRW-EOL-01 | The manifest was pinned by the SHA-256 of its **CRLF** bytes; `.gitattributes` `* text=auto eol=lf` would store and check it out as LF (`d4e9cc89…` ≠ `20ac446b…`) | `CONFIG_FROZEN_IDENTITY` on every CI checkout, before `npm ci` | `config/browser-input.json` and `config/browser-provenance/**` marked `-text -whitespace` (`59efa2d4`) | `git show HEAD:config/browser-input.json \| sha256sum` = pin; 229,589 bytes |
| BRW-02 | `--version` predicate required exactly `Google Chrome 155.0.8059.79`. Branded Linux Chrome prints `<product> <version> <channel>`; run directly in the verifier's clean environment the channel is `unknown` (only the package wrapper exports `CHROME_VERSION_EXTRA`) | `BROWSER_VERSION_IDENTITY` at `provision` on the first real run | Accept only `''`, `' '`, `' unknown'` after the exact product/version; canonical identity in the receipt (`98672fe2`) | HEAD predicate rejects both real forms; +5 fixtures; Python selftest 140 PASS. **Not yet observed against the real binary.** |
| SEC-PIN-07 | Dependency remediation changed `package.json`, the lock and `ci.yml` | `PACKAGE_OR_LOCK_CHANGED` / workflow pin failure in every job | Pins moved in the same commit (`6b441ad3`) | `browser-input.selftest` PASS; reviewer recomputes blob hashes |

## 3. Evidence by type

| Type | What ran | Result |
|---|---|---|
| Synthetic (Windows) | `node scripts/browser-input.selftest.mjs` (needs `python3`; a shim to CPython 3.14 was used) | PASS, 406 cases, on `fe72bdbc` and again after the pin move |
| Synthetic (Windows) | `extract-verified-browser.selftest.py` | PASS 135 → 140 cases; Linux `dir_fd`/`O_NOFOLLOW` fixtures report NOT RUN on win32 |
| Local runtime (Windows) | Protected `check-master-scene.mjs` with **system Chrome 155.0.8059.80** (not via Option A) | **All 14 questions PASS**, 12 viewports, 17 min — forward signal for the 148→155 switch; Windows, not Linux |
| Linux runtime | gpg/gpgv, `.deb` extraction, loader closure, `chrome --version`, Puppeteer/CDP, axe, SwiftShader, Lighthouse via Option A | **NOT RUN** — owner-gated (phase-006 Docker approval not granted; WSL Ubuntu exists on this host but substituting it also needs approval) |
| GitHub CI | Any run of this candidate | **NOT RUN** — push not authorised; provider push safety UNVERIFIED |

The phase-006 APT-source diagnostic remains **PREPARATION CLEARED — OWNER DOCKER APPROVAL
REQUIRED** (manifest `d3bec167…`). It was not executed or modified.

## 4. Open items

| ID | Class | Item | Needed |
|---|---|---|---|
| BRW-RT-01 | 1 | First Linux execution of the controlled path (and of the Python selftest's Linux fixtures). Ubuntu 24.04 has GnuPG 2.4 / dpkg 1.22; history qualified Debian 12 only | Owner picks: phase-006 Docker sequence then runtime phase, **or** one authorised exact-SHA CI run as the first runtime observation |
| BRW-03 | 2 | CI downloads the pinned `.deb` and key from Google's live pool on every run; Google keeps only the current stable per channel, so 155.0.8059.79 will disappear and CI will fail closed | Owner chooses a durable authenticated source (e.g. SHA-keyed release asset or Actions cache fed via `GS_BROWSER_RAW_PATH`/`GS_BROWSER_CURRENT_KEY_PATH`) and a pin-refresh procedure |
| BRW-155-01 | 3 | All R12 a11y/visual/Lighthouse evidence is Chrome 148/154; candidate CI measures on 155 with Puppeteer 24.43.1 (paired with 148) | Treat the first CI results as a new baseline; Windows 155 Master scene already passes |
| BRW-04 | 3 | Full verifier re-run on every consumer launch (~20 per job, 143 MB rehash + extraction each) under a 120 s wall limit | Measure on first real runner; memoise provider lookups if needed |
| BRW-08 | 3 | `--installed` suppression proof not wired; lifecycle code shares the uid | Optional `browser-input.selftest --installed` step after `npm ci` (moves the workflow pin) |

## 5. Credential isolation (static review)

`verify` has `contents: read`, no secrets mapping (only `vars.GS_H4B_PREVIEW_PUBLISHABLE_KEY`, a
publishable key), `persist-credentials: false`. The Hostinger build job is read-only and needs no
browser. The publish job keeps `contents: write` but runs no npm lifecycle code. GitHub's runtime
token for artifact upload remains an acknowledged residual. Live GETs (18 Oct): 0 repository and 0
environment secrets.
