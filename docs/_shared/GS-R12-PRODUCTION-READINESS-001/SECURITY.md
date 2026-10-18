# B. Security disposition report

Scope: the eight dependency advisories that were PENDING at `e854ad87`, plus the application-side
security fixes made in this phase. **No advisory is accepted here.** Accepting residual risk is the
owner's decision; this report states what was fixed, what was measured and what remains.

## 1. Before and after

| Measure | Baseline `e854ad87` (Linux Docker, 14 Oct, retained) | Candidate `bb2343fd` (Windows, 18 Oct, fresh) |
|---|---|---|
| `npm audit --omit=dev` | 0 | **0** |
| Full `npm audit` | 30 entries, 8 IDs, exit 1 | **21 entries, 4 IDs**, exit 1 |
| Installed packages (`npm ci`) | 1573 | 1568 |
| Lockfile | `0db1f40a…` | `eb854741…` (unchanged by `npm ci`) |
| `package.json` | `9ce5c7a0…` | `e048cd90…` |

Every affected node is `dev: true`. Production dependencies are `@sanity/client`, `next`, `react`,
`react-dom`, `server-only` and `zod`; none reaches a vulnerable leaf. Dev-only is **not** treated as
harmless: these tools run in CI and on developer machines next to credentials and build output.

## 2. Advisory dispositions

| # | Advisory | Leaf | Status | Basis |
|---|---|---|---|---|
| A1 | GHSA-c475-qrg2-pj4r (high) | basic-ftp 5.3.1 → **6.2.3** | **REMEDIATED (local)** | `get-uri` override; public API of 5.3.1 and 6.2.3 identical (`Client.d.ts`, `index.d.ts`); exercised through `get-uri`'s ftp: route |
| A2 | GHSA-vfj7-8cjw-p6xm (high) | braces 3.0.3 | **OWNER DECISION REQUIRED** | No fixed release (latest 3.0.3 affected). No reachable caller found: no `next.rootDir`, no Sanity typegen/watch command |
| A3 | GHSA-jmr9-qjv8-65gv (high) | extract-zip 2.0.1 | **OWNER DECISION REQUIRED** | No fixed release. CI path removed by Option A (`PUPPETEER_SKIP_DOWNLOAD`, verified .deb) — static reading only until Linux runtime/CI. Local `npm ci` without the env var still runs Puppeteer's ZIP download |
| A4 | GHSA-7pqw-9j4j-h8q3 (high) | extract-zip 2.0.1 | **OWNER DECISION REQUIRED** | As A3; distinct mechanism |
| A5 | GHSA-hp3w-g68c-fv3c (moderate) | sprintf-js 1.0.3 | **OWNER DECISION REQUIRED** | No fixed release. Library-only YAML parsing; no YAML CLI or custom argparse template |
| A6 | GHSA-52f5-9888-hmc6 (low) | tmp 0.1.0 / 0.0.33 → **0.2.7** | **REMEDIATED (local)** | `@lhci/cli` override reaches `external-editor` too (single deduped 0.2.7) |
| A7 | GHSA-ph9p-34f9-6g65 (high) | tmp → **0.2.7** | **REMEDIATED (local)** | As A6 |
| A8 | GHSA-w5hq-g745-h8pq (moderate) | uuid 8.3.2 / 10.0.0 → **11.1.1** | **REMEDIATED (local)** | `@lhci/cli` and `typeid-js` overrides; 11.1.1 was already in the tree via `@sanity/uuid` |

"REMEDIATED (local)" means fixed in the lockfile and verified on this Windows host. It becomes CI
evidence only after an authorised exact-SHA run; the LHCI `uuid.v4` call in particular is first
exercised for real by the CI Lighthouse steps (Lighthouse cannot run on Windows).

### Changes (commit `6b441ad3`)

```json
"@lhci/cli": { "tmp": "0.2.7", "uuid": "11.1.1" },
"typeid-js": { "uuid": "11.1.1" },
"get-uri": { "basic-ftp": "6.2.3" }
```

The four existing GS-SEC-001-R3 scoped overrides are kept. The lock diff touches only `tmp`, `uuid`,
`basic-ftp` and three now-unused nested records (`os-tmpdir`, `tmp/node_modules/rimraf`, nested
`uuid` copies). No forced upgrade, no major bump of a direct dependency, no suppression.

### Regression test: `npm run check:deps:overrides` (in `verify:static` and `ci.yml`)

- Reads each fixed version through `createRequire` rooted at the real consumer (`@lhci/cli`,
  `external-editor`, `typeid-js`, `get-uri`), so a nested copy escaping the override is what gets
  measured. Comparator proven to say "no" on 7 known-bad versions in the same run.
- Behaviour through the consumers: LHCI `tmp.fileSync({postfix:'.html'})` + `removeCallback`;
  `external-editor` constructor temp file + `cleanup`; LHCI `uuid.v4()`; `typeid-js` v7 id, round
  trip and ESM import; `get-uri` ftp: against a loopback server on four branches, each recording the
  commands it actually received:

  | Branch | Commands observed |
  |---|---|
  | MDTM | `…,MDTM,EPSV,RETR,QUIT` |
  | MLSD fallback | `…,MDTM,EPSV,MLSD,EPSV,RETR,QUIT` |
  | Unix LIST fallback (the advisory's parser) | `…,MDTM,EPSV,LIST,QUIT` → NotFound (see note) |
  | 550 | `…,MDTM` → NotFound |

  Note: `get-uri` reads `entry.modifiedAt`, which `basic-ftp` sets only from MLSD (5.x and 6.x
  alike), so its Unix-LIST fallback always ends in NotFound. That is pre-existing upstream behaviour,
  not a regression.
- The FTP branches run in a child process (`scripts/check-dependency-overrides-ftp.mjs`); on Windows a
  native node.exe crash (`0xC0000409`, also seen with the original basic-ftp 5.3.1) gets exactly one
  reported re-run; assertion failures never do (`78052aac`).
- Red control: before the override, all five resolutions were reported below the fixed versions
  (and old `tmp` 0.1.0 also failed its own `removeCallback` on Windows).

### Option A coupling

`scripts/browser-input.mjs` pins the bytes of `ci.yml`, `hostinger-staging.yml`, `package.json` and
the lock. The same commit moved those pins (and the selftest base); `browser-input.selftest` passes.
Any future manifest or workflow change must do the same or every CI job fails at `install-controls`.

## 3. Residual owner decisions (proposed, not taken)

For each, the owner records accept / remediate / defer with an expiry.

| Advisory | Exposure today | Proposed owner options |
|---|---|---|
| braces (A2) | Pattern input only from owner-authored config; no typegen/watch, no `rootDir` | Accept with scope "patterns stay owner-authored; re-review on config change or upstream fix" |
| extract-zip (A3, A4) | CI: path skipped by Option A (unproven until first Linux run). Local dev: Puppeteer's ZIP download runs on `npm ci` when the Chrome revision is not cached | (a) accept for CI conditional on the first CI log showing the download skipped and `browser-input check` PASS; (b) for local machines, require `PUPPETEER_SKIP_DOWNLOAD=true` in developer setup docs (a config file would be refused by Option A's `install-controls`), or accept |
| sprintf-js (A5) | Library-only YAML parsing | Accept with scope "no YAML CLI, no custom argparse templates" |

## 4. Application-side security changes in this phase

| ID | Change | Proof |
|---|---|---|
| SEC-F8 | `check-static-artifact` recognises Supabase `sb_secret_…` keys (`0784d7d3`) | Pattern removed → `check-static.selftest` fails "each secret marker: SECRET did not fire"; restored → PASS |
| SEC-F6 | Delivered Hostinger `.htaccess` header policy asserted offline: nosniff, X-Frame-Options DENY, Referrer-Policy, Permissions-Policy, HSTS ≥ 1 year, CSP `default-src`/`base-uri`/`form-action`/`frame-ancestors`/`object-src` (`8c1fd41e`) | 9 mutation proofs, each a returned-value assertion |
| BRW-EOL-01 | `.gitattributes -text -whitespace` for hash-pinned provenance inputs (`59efa2d4`) | Committed manifest blob SHA-256 equals `MANIFEST_SHA256` |
| BRW-02 | Option A `--version` predicate accepts Linux Chrome's channel token (`98672fe2`) | Original predicate rejects both real forms; +5 fixtures; Python selftest 140 PASS |

## 5. What this report does not establish

- No exploit was attempted; "no reachable caller" is bounded source evidence, never proof of
  unexploitability.
- Registry integrity checks are not a publisher-source audit.
- Fresh audit ran on Windows against the public registry advisory endpoint; it is not a Linux
  install trace. The full Linux `npm ci` with Option A has not run (ledger BRW-RT-01).
