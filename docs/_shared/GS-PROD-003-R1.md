# GS-PROD-003-R1 — Owner scope decision (`GS-O005`) and `GS-T004` in Production

**Date:** 2 October 2026 (UTC). **Result: PARTIAL PASS.**
- `GS-T004` is **applied in Production** and verified.
- `GS-O005` is **closed by owner scope/risk decision**.
- `GS-X002` was re-examined and **retained, by owner choice**. The three Technical services are therefore **not migrated**.

Starting point: docs `028bd1d5` (`GS-PROD-003`), runtime `1542f508`.

## 1. Owner decision (recorded as given)

**PI cover today:** Gridsmith Ltd does not currently have professional indemnity insurance covering the Technical/CAD services. It does not intend to obtain that cover as a prerequisite to launch, though it may obtain it later.

**Approved scope:** CAD drafting, engineering drawing/schematic preparation and technical documentation, all to a client's brief. The services exclude:
- engineering design responsibility;
- calculations;
- regulatory approval;
- certification;
- stamping;
- professional sign-off;
- any responsible-designer or responsible-engineer role.

**What this decision is not:** it is not a claim of zero liability. Nothing public says "no liability", "insured" or "uninsured". Contract wording stays with `GS-O003`. No insurer, policy number, limit or coverage was recorded or invented.

## 2. `GS-O005` — CLOSED BY OWNER SCOPE / RISK DECISION

**Previous gate:** the expected resolution was written broker/insurer confirmation (`Q-M4`, `L-08`, `BEFORE-LAUNCH.md` §4, `OWNER-ACTIONS.md`). Since `GS-P03` this was enforced through `professionalScopeConfirmed`, whose description required "professional scope and PI cover … confirmed in writing (GS-O005, GS-X002)".

**Where `GS-O005` acted as a hard production gate.** All of these now name `GS-X002` only:
- `lib/services/architecture.ts`: the Studio rule message and the `professionalReview` doc comment.
- `sanity/schemas/documents.ts`: the `professionalScopeConfirmed` field description.
- `scripts/launch-content-rules.mjs`: the `check:launch` refusal.
- `scripts/check-schemas.mjs`: the rule label and its expected messages.
- `scripts/migrate-production-cms.mjs`: the manifest gate `GS-O005/GS-X002` and the preflight message. The manifest was regenerated: 57 entries, still 47 eligible, and only the three Technical entries changed (gate label and reason).
- Spec text, struck in place:
  - CLAUDE.md non-negotiable 12;
  - `design/PROJECT-TRACKER.md` (Technical publication gate row);
  - `design/PROJECT-RULES.md` rule 2;
  - `SERVICE-ARCHITECTURE.md` §8.

  The struck wording is registered in `check:struck` as `GS-O005-PI-COVER-PUBLICATION-GATE`.

**Other records:** `BEFORE-LAUNCH.md` §4 is marked superseded. `PRE-DEPLOYMENT-CHECKLIST.md` A6 is now deferred under `GS-O024`.

**Not changed (historical):**
- the generator of the GS-P05 owner review (`scripts/owner-content-review.mjs`);
- a development seed brief question (`scripts/seed-content.mjs:578`);
- the `service-content.mjs` docstring (its bytes are hash-bound to the owner copy review, `check:service-content`);
- dated phase records.

## 3. `GS-X002` — RETAINED

**Original purpose.** `GS-P00` (11 Sep 2026, `a5d7773f`) defines it as *"professional review appropriate to engineering/CAD claims and the drawing matrix."*

**Classification: A — professional review of the public Technical claims.** It is not:
- B, competence or authorisation for regulated responsibility (the scope excludes that responsibility);
- C, insurance;
- D, legal review (that is `GS-X001` / `GS-O003`).

**Independent of insurance? Yes.** It protects against misleading Technical claims, so the brief's rule was to retain it, and the owner chose to keep it.

**What is left for it to review:** the drawing-matrix limb has no subject, because the matrix was never built and no standards code is published. What remains is the three records' copy.

**Closure:** a dated written review by a suitably qualified professional (`OWNER-ACTIONS.md`).

## 4. Technical claims re-check (`scripts/service-content.mjs`, unchanged)

`cad-drafting`, `engineering-drawings` and `technical-documentation` are all clean. None claims or implies:
- certified engineering, design responsibility or structural responsibility;
- calculations, regulatory approval or code-compliance certification;
- stamped drawings, professional sign-off or responsible designer/engineer status;
- insured engineering services or PI cover.

Each record carries explicit `false` exclusions for those items, and none mentions insurance. **No copy change**, and no "uninsured" wording was added.

## 5. Legal handoff — `GS-O003` OPEN

A factual note for the solicitor was added to `OWNER-ACTIONS.md` `GS-O003` and to `_legal/LEGAL-LAUNCH-CHECKLIST.md`. No clause was drafted or changed.

**There is no "Client Terms clause 8.1" in the current set.** The live provisions are:
- `MSA-BUSINESS.md` §12. It is written for "engineering, technical, CAD or construction-related drawings or design services", with certification and sign-off included "where expressly stated in the Scope". That is wider than the published scope.
- `MSA-BUSINESS.md` §16 (liability).
- The open PI-limit `[TK]`, which UCTA s. 11(4)(b) ties to the cap (`07-STATE-REPORT.md` §2.2).

## 6. Launch gate — `professionalScopeConfirmed`

**Before:** the flag stood for two conditions at once: insurance confirmation (`GS-O005`) and the limited-scope review (`GS-X002`).

**After:** the flag is set only when a review confirms the record stays inside the approved limited scope (`GS-X002`). The gate logic is unchanged: production refuses a published, unconfirmed Technical service, and the Studio warns.

**Focused self-test (`check-launch-content.selftest.mjs`).** The TECHNICAL specimen must name `GS-X002` and must match none of `/PI cover/`, `/indemnity/`, `/insur/` or `/GS-O005/`. The new `forbid` limb was proven both ways:
- **forbid limb alone:** the rule message was mutated to keep the `GS-X002` wording and append "and PI cover is confirmed (GS-O005)". Only the forbid lines went red (`/PI cover/i`, `/GS-O005/`), with no missing-expectation line. Restored byte-identical, then green.
- **original insurance-era rule file:** red on the missing `GS-X002` expectation and on both forbid patterns.

**`check:schemas`:** red against the original `architecture.ts` (both unconfirmed-Technical cases), green after.

**`check:struck`:**
- selftest 40 specimens, including the new branch and a "deferral record is not a subject" case;
- corpus run: 1 matched, 1 annotated.

**Defect caught while editing:** the first registration wrote literal U+0008 bytes where `\b` was meant, the exact `check:rls` defect CLAUDE.md records. `check:struck` reported HOLLOW SUBJECT on the corpus run. The bytes were fixed, and `check:control` reports 0 control characters.

## 7. `GS-T004` — applied

**Owner provenance (`GS-O023`, closed).** The Production `SUPABASE_SERVICE_ROLE_KEY` was re-entered (`updatedAt` 1790944740550, about 12:39 UTC). The owner stated in chat that it came from Gridsmith Project `dqiutgmxillhsbzgnlsx`. The value was never read.

**Backup:**
- **Type:** `pg_dump --format=custom --schema=public` (Postgres 17 client in Docker) through the IPv4 session pooler (`aws-1-eu-west-1`). The direct host is IPv6-only and unreachable from Docker.
- **File:** `%USERPROFILE%\gridsmith-backups\supabase-production-<UTC timestamp>.dump`, outside the repository.
- **Size and checksum:** 25,465 B; sha256 begins `96e4885f6da00dc`.
- **TOC entries:** 71.
- **Restore test** into a disposable Postgres 17: 5 tables, 63 leads, ledger 0001–0003, 2 views. There were 2 expected errors: `public` already exists, and the `anon` role is absent outside Supabase.

**Pre-state (fresh, read-only):**
- ledger 0001–0003, hashes equal to the repository;
- ledger RLS off;
- 1 policy;
- 70 `anon`/`authenticated` grants;
- 1 lead constraint;
- 63 leads, row fingerprint `63b499e7…` (md5 of every row; no content emitted);
- events, sample grants and Path Finder results: 0 rows each.

**Run:** `npm run migrate`, one attempt. 0001–0003 were already applied; `20260911203125_gs_p01_security_hardening.sql` was applied. Result: 1 migration applied.

**Post-state (independent read) — equal to Preview:**
- ledger 0001–0004, with `bd761ff9b9e4` for 0004;
- RLS on all 5 tables;
- 0 policies;
- 0 `anon`/`authenticated` grants;
- `service_role` holds all 7 privileges on 5 tables and 2 views, and bypasses RLS;
- `events_id_seq` ACL is `postgres` and `service_role` only;
- both views `security_invoker=true`;
- 18 lead constraints, definition hash `505a265d…`, identical in Production and Preview;
- 5 lead indexes, 13 indexes in `public`;
- the `postgres` default ACL no longer includes the public roles;
- the advisor reports INFO `rls_enabled_no_policy` ×5 only (deny-all by design).

**Lead delta:** 0. The row fingerprint is identical before and after.

**Service-role semantics, proven without a write:**
- Catalog: `has_table_privilege(service_role, leads, INSERT)` is true; `anon`/`authenticated` INSERT and SELECT are false.
- HTTP: anon `HEAD /rest/v1/leads` returns **401**.
- The runtime write through the Production Vercel key is still to be proven at the **cutover smoke test**.

## 8. Technical CMS

**Not eligible:** `GS-X002` is open. There was no Sanity read or write. Production stays at **47** documents:
- Design 13, Digital 17, Press 14 services;
- Technical 0, legal 0, seed 0.

No production-dataset build was needed because no content changed.

## 9. Insurance status

`GS-O024`: PI cover for the Technical/CAD services is **DEFERRED BY OWNER**. It is non-blocking, with no purchase and no deadline. It becomes a requirement only if the `GS-O003` advice says so.

## Safety

No application deployment, alias, DNS or env change by the agent, and no main merge. No Production lead write or form submission. No Sanity write. Preview unchanged. No secret or PII in output or records.
