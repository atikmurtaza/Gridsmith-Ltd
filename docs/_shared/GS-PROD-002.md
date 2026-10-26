# GS-PROD-002 — Controlled production CMS migration (receipt)

## Authority and boundary

1–2 October 2026. Owner authorisation: **one** controlled migration of the 47 documents declared
eligible by `GS-PROD-001` into the Sanity `production` dataset. Nothing else.

**Application SHA migrated against:** `c1dee128297757b0269a695104c18ac340c60131` (HEAD and remote
`staging/gs-press-001-press`; CI `36929217364` success, first attempt). Main
`fbecbe01e7fb594c6163dab57514997cb248fc21`, untouched. No runtime source changed in this phase; this
file and the status notes are the only repository change.

**Not done, by instruction:** no legal migration (`GS-O003`), no Technical Design services
(`GS-O005`), no development write, no Supabase write, no environment change, no deployment, no merge to
`main`, no DNS change, no form submission, no Sanity security/CORS change.

## Preflight

| Check | Result |
|---|---|
| Manifest recomputed from source | 57 entries, **47 eligible** (companyDetails 1, groupPage 2, service 44 = Design 13 / Digital 17 / Press 14), 10 gated (3 Technical `GS-O005/GS-X002`, 7 legal `GS-O003`); the script asserts the committed manifest byte-equals what the source produces |
| Planned ids | no `seed-` prefix, no dot, `isSeed: false` (companyDetails carries no `isSeed`, as in `GS-PROD-001`); 2 Technical references dropped (`technical-illustration`, `3d-modelling`) |
| Dry run (`check:cms:migration`) | PASS — preflight clean, selftest 11 cases |
| `verify:static` | PASS (exit 0) |
| Production before write | 0 public documents (unauthenticated); authenticated read: only the 12 Sanity system documents (`_.groups.*`, `_.retention.*`), which the script's foreign-document check excludes; 0 drafts |
| Development before write | 121 documents, 114 `isSeed` |
| Token | robot token, role `write`, read by name from `.env.local`; never printed |
| Dataset ACL | `production: public`, `development: public` (unchanged after) |

## Backups (outside the repository, `%USERPROFILE%\gridsmith-backups\`; never committed)

`npx sanity dataset export`, 2026-10-01T22:55Z.

| File | Dataset | Size | SHA-256 | Contents verified |
|---|---|---|---|---|
| `sanity-development-20261001T225500Z.tar.gz` | development | 59,499 B | `3138ff41cd31d003af01348caa8545f7c5d57593e6197fa69292dbbd50569daf` | 121 docs (114 seed): companyDetails 1, groupPage 2, service 47, legalDocument 7, faq 45, post 9, teamMember 4, testimonial 6; 0 assets |
| `sanity-production-20261001T225500Z.tar.gz` | production | 208 B | `1d2f55e9882d96ed2e8f92645b0d8b5b3a53ddb638ee15d923cd3cdb696dd125` | 0 docs (the empty-content export is the evidence); the `--backup=` file |

## The write

Pre-write plan printed and checked: dataset `production`; 47 create/replace; legal 0; Technical 0
(3 excluded); development, Supabase and environment writes 0; main and DNS untouched.

```
GS_PRODUCTION_CMS_CONFIRM=write-production SANITY_API_WRITE_TOKEN=<from .env.local> \
  node scripts/migrate-production-cms.mjs --write --dataset=production --backup=<production export>
```

**One attempt**, 2026-10-01T22:57:59Z, exit 0: *"wrote 47 document(s) in "production"; unauthenticated
read-back 47, seed 0."* One atomic `createOrReplace` transaction. The guard was satisfied normally and
not modified. Token value absent from the log.

## Independent read-back (not the script's)

| Check | Result |
|---|---|
| Public documents | **47**; authenticated non-system ids 47; drafts 0 |
| By type | companyDetails 1; groupPage 2 (`grouppage-about`/`about`, `grouppage-approach`/`approach`); service Design **13**, Digital **17**, Press **14** |
| Absent | legalDocument 0, faq 0, teamMember 0, post 0, testimonial 0; no `technical` capability group, no `cad-drafting`/`engineering-drawings`/`technical-documentation` |
| Seed | `isSeed: true` 0; `[SEED]` markers 0; `seed-` ids 0; dotted ids 0 |
| Ids / slugs | exactly the manifest's 47 eligible ids (none unexpected, none missing); every slug equals the manifest |
| Content parity | **47 / 47 deep-equal** to the repository payload (system fields `_rev`/`_createdAt`/`_updatedAt` stripped) |
| References | 87 checked; dangling 0 (also GROQ deref: 0 services with an unresolved `relatedServices`); seed 0; Technical 0; legal 0 |
| Brand | "division(s)/department(s)" outside the statutory clause: 0; statutory sentences kept: 2 (About §structure, Approach §one-company); stale About intro: absent — About intro reads *"One company, three specialist studios. …"* |
| Company | Gridsmith Ltd, 17050842, England, `contact@gridsmith.uk`, `+44 7405 448534`, *"We typically respond within 48 hours."*, no business-hours field; registered office present for the statutory footer only (`check:company` Q4 governs where it renders) |
| Service coverage (the gate's own `coverageProblems`, applied read-only) | production 44 services, **6 problems — all six are the `technical` group's capabilities** carried by the 3 gated services; development control 47 services, 0 problems |
| Development after | 121 ids, every `_rev` identical to the backup — not written |

## Production-dataset build — `BEFORE-LAUNCH.md` §16

Clean detached worktree at `c1dee128`, **no `.env.local`**, `npm ci`, `.next` removed,
`NEXT_PUBLIC_SANITY_DATASET=production npm run build`, output to a file, exit read from the process.

1. **Clean `.next`, no redirect** — `PRODUCTION_DATASET` at its real value. ✔
2. **Live tier applying** — *"this build's NEXT_PUBLIC_SANITY_DATASET reports dataset "production" — 5
   statutory field(s) present, contactEmail supplied, no [SEED] markers"*; seed and Technical rules
   printed as *"must be 0 on a live dataset, and is"*. ✔
3. **Seed count 0 and non-zero content in the same run** — *"0 published seed document(s) counted"*;
   the same run's route table enumerates the production documents it built: Design 13, Digital 17,
   Press 14 service paths (no Technical). ✔ — *qualified:* `check:launch` itself prints no total
   document count; the non-zero reading is the build's own route table, and the seed query's
   reach is the one already proven failing against development's 121 (VALIDATION §19.5).
4. **Real statutory values, no `[SEED]`** — gate: 5 statutory fields present, no `[SEED]` markers;
   the values are not printed by the gate, and were read as real (17050842 / England / Gridsmith Ltd /
   `contact@gridsmith.uk`) in the independent read-back and in the served footer of every smoke
   route. ✔ (qualified as for 3)
5. **`Compiled successfully`, EXIT=0** — *"✓ Compiled successfully in 18.2s"*, 70/70 static pages,
   EXIT=0. ✔

VALIDATION §19.10 item 1 / §19.11: the passing direction over the network against a dataset named
`production` has now run (1, 2, 5 literal). Items 3 and 4 rest partly on evidence outside the
gate's own lines, as stated; a gate line printing the total and the values would make them literal
(not added — no source change in this phase).

## Served candidate (local `next start`, port 3230; not deployed)

**Gates.** `check:launch` (served) **PASS** — the served site reports `production`, seed 0, Technical
0. `check:security-headers` **PASS**. Red, and red only on content this phase is forbidden to
migrate — no gate has a pre-legal/pre-Technical mode, and none was altered:

| Gate | Result on production content | Cause |
|---|---|---|
| `check:company` | 6 problems — 13 of 18 routes measured | its route list includes `/design/services/technical-documentation` and four `/legal/*`, all 404 |
| `check:axe` | stopped at its 5th route | `/design/services/technical-documentation` 404; `/`, `/design`, `/digital`, `/press` at 375/1280 × initial/scrolled analysed **clean** before it |
| `check:responsive` | stopped at the same route | same |
| `check:redirects` | 6 problems | `/privacy-policy`, `/terms-and-conditions` destinations `/legal/*` 404 |
| `check:legal:parity` | 6 problems | every `/legal/*` 404 — legal not migrated (`GS-O003`) |
| `check:service-content:dataset` | refuses `production` by design | the coverage rule applied read-only instead (above) |

**Smoke** (temporary script in the disposable worktree, deleted after): `/`, `/about`, `/approach`,
`/design`, `/digital`, `/press`, `/design/services/campaign-and-social-creative`,
`/digital/services/technical-seo`, `/press/services/content-seo`, `/contact`, `/insights` — all 200,
correct `data-division`, footer 17050842 / Gridsmith Ltd / `contact@gridsmith.uk`, response wording,
no `tel:` link, no `[SEED]`, no "specialist divisions". **Production-only strings render** (About
"three specialist studios", Approach "whichever studio", "cross-studio", "both studios", "two studios"
— development still carries the old wording), so the CMS-backed copy is production's. 63 internal links:
the only non-200 targets are `/legal/terms`, `/legal/privacy`, `/legal/cookies`,
`/legal/accessibility` (footer, every route) and `/legal/consumer-client-terms` (`/press`) — **404 until
`GS-O003`; cutover cannot precede legal migration.** No page links a Technical service.

**Accessibility smoke** — axe (WCAG 2.0–2.2 A/AA + best-practice) on `/about`, `/approach`, one service
per studio and `/contact` at 375 and 1280: **0 violations in 12 analyses**. Keyboard: first Tab is
*"Skip to content"* on each; 12 further Tabs reach 8–11 distinct stops and never fall to `<body>`.

**Performance:** not run — §16 prescribes none, the source SHA is unchanged, and Lighthouse runs on
CI's Linux runner only. No budget touched.

## Security

Token value: 0 occurrences in the write log, every scratch log, the verification worktree (incl.
`.next`), the repository tree and both backups. `lint:secrets` with the token set: clean — 48 client
chunks and 19 public assets, token checked by value. Backups outside the repository; none tracked. Dataset
ACL unchanged (`public`); no CORS, token or project-security change.

## Rollback readiness (proved read-only; not executed)

Backup present and verified (above). `--rollback` deletes `buildPayload().docs` ids — **47, equal to
the manifest's eligible ids and to production's non-system ids**; production holds 0 documents outside
that set and the 12 system documents are never targeted; production held 0 documents before the write,
so no pre-existing document can be deleted. The guard refuses without the confirmation and token
(shown: 2 refusals, *"Nothing was read or written"*).

## Idempotency

Post-migration dry run: same summary, *"Manifest in agreement"*; manifest and `scripts/` byte-identical
to `HEAD`. No second production write.

## State after this phase

| | |
|---|---|
| Production CMS | **partial migration completed** — 47 eligible documents |
| Legal | not migrated — `GS-O003` open |
| Technical Design | 3 not migrated — `GS-O005` open |
| Insights | empty, intentionally |
| Production deployment / alias / DNS | not performed |
| Supabase / environment | untouched; `GS-O010` open (next infrastructure gate) |
| `GS-O021` | open (cutover) · `GS-O022` optional · Vercel Firewall rule at cutover |
| Valid forms / indexing | none / not enabled |

**Next phase (not executed):** `GS-O010` Preview/Supabase isolation (owner actions per
`GS-PROD-001.md` §`GS-O010`), then legal migration after `GS-O003` through a reviewed manifest
extension; cutover only after `GS-O003`, `GS-O010` and `GS-O021` close.
