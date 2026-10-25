# GS-LAUNCH-014 — exact-text owner adoption

25 October 2026 (Europe/London). **Local canonical integration only. Seven OWNER_ADOPTED; zero PUBLISHABLE.**

## Authority and source

The owner's GS-LAUNCH-014 instruction expressly approves the three versions and complete-file hashes below and authorises local canonical adoption integration, verification and a local commit. The exact supplied instruction is preserved in [GS-LAUNCH-014-OWNER-AUTHORITY.md](GS-LAUNCH-014-OWNER-AUTHORITY.md). This is the new adoption authority; earlier signatures or fingerprints do not adopt changed text.

The clean integration baseline is `f8702928dea7cb644ce44339eaaa0ea05a7d449e`, branch `codex/gs-launch-013`. The approved proposals and their exact diffs remain unchanged under `docs/_legal/proposed/GS-LAUNCH-013/`. Integration is on isolated branch `codex/gs-launch-014` on 25 October 2026. Locate its commit with `git log -1 --format=%H -- docs/_legal/evidence/GS-LAUNCH-014-ADOPTION.md`.

| Slug | Superseded version / SHA-256 | Newly adopted version / SHA-256 |
|---|---|---|
| privacy | 2.6 / `4c13c19eda616d2e646f90740f71fa7904da62914af8f48b0e2daabb53ef50a7` | 2.7 / `822dd473c253e7d031e18cf6c439ace13817f270d9fd9e1898d9b8c5fc4549a3` |
| accessibility | 2.3 / `daf5b37115391e915384bf16aec81d944e7997154b5b8a9dfdb9fb3bea9056bb` | 2.4 / `774b1e200e67d146b0375b12c3fd4fadb3aeb0e27b87ea53bd0b419557984708` |
| consumer-client-terms | 3.3 / `9ac629b3578d09e035b547a6fae705fbe2eb70ec55a3fda8036b4b631eaba01e` | 3.4 / `a73f6df89b681721ebd97e841803327e8e91caabd1da0a90edbf204d590a0d5e` |

Each replacement is a byte copy of the approved complete proposal, including wording, headers, dates and whitespace. The canonical sources are respectively `current/privacy-policy.md`, `current/accessibility-statement.md` and `current/client-terms-consumers.md` under `docs/_legal/`.

## Preserved adoption chain

The existing register remains [GS-O003-R-REGISTER.json](GS-O003-R-REGISTER.json). Its `previousAdoptionRegister` now points to the byte-identical predecessor [register snapshot](GS-LAUNCH-014-superseded/GS-O003-R-REGISTER.json), SHA-256 `4663ca333058dd5ee47dcf018571386be05737d7e53fa18c22956d114cee282e`. That snapshot retains its own earlier-register reference, original entries, owner approval and evidence references. It is historical evidence, not a second active register.

The three superseded complete texts and original Consumer workflow are retained alongside that snapshot. Their original 22 October authority remains [GS-LEGAL-FINAL-001-PHASE-2-ADOPTION.md](GS-LEGAL-FINAL-001-PHASE-2-ADOPTION.md), unchanged. Earlier archived paths in that evidence are recoverable at `a7b931c10eb2a543bfa43e89954555fdadb7072d`, as documented in the legal README. No historical evidence is overwritten or fabricated.

The other four texts and their entire register entries are unchanged: Cookies 2.4 (`e853438e4acb65f953ea58575681c94bd0dc0908359b091190891fe3a8a0e960`), Website Terms 2.3 (`e63d8cd2d30938481d2219ec632f49d3c9f8df75ec287a28fa9fe079b274482a`), Business Client Terms 3.3 (`89f63c91642267a3ffc31d2f33ba3cbca3d383da434c007739cc1ba9f9c275c6`) and Applicability 2.3 (`008c05806aad6045272e4438531b9247f8b4d05b4d9b4295196a0282de0c8a87`).

## Scope and independent controls

The approval excludes publication, PUBLISHABLE status, Production CMS/provider writes, Git push, CI dispatch, deployment, WordPress replacement, DNS/email configuration changes, final cutover, historical-data deletion and security risk acceptance. No such authority is inferred. Existing customer contracts retain the terms originally agreed. Commencement remains first authorised publication with the replacement website at gridsmith.uk, not this adoption date.

Privacy now explicitly uses `contactMode: direct`. Its publication prerequisite is DIRECT-CONTACT-VERIFIED, replacing H4-B-INTAKE-PROMOTED for this direct-contact version only. **DIRECT-CONTACT-VERIFIED has no completed receipt.** Its operational/source requirements remain independent of this approval. H4-B and form-mode Privacy remain mandatory before any future form journey. Original retention and Hostinger evidence is retained on its dated basis; no new execution, provider inspection or operational clearance is asserted.

All-seven publication refusal, Privacy co-publication, Hostinger processor coverage, Cookie A-2 on the serving stack, historical retention duties, separate PUBLICATION-AUTHORITY and separate artifact-bound CUTOVER-AUTHORITY remain. Comprehensive assistive-technology testing, historical holdings/custody/provider retention and transfers, actual retention execution, agency/rights arrangements, security disposition and Hostinger backup/restore/acceptance remain limited as recorded in GS-LAUNCH-013. Adoption does not settle those facts or certify legal compliance.

## Workflow and generation

The maintained quotation and confirmation identify Consumer 3.4. Header/attachment labels agree, and outbound contact labels use email/WhatsApp only. The acceptance sentence, early-service statements, cancellation form, deadlines, payment sequence and existing-contract treatment are unchanged. The historical 3.3 template remains available for provenance; it is not the current outbound template.

The existing `seed-legal.mjs` generates all seven instruments at import time from canonical bytes, checking their adopted fingerprints. Local/offline generation and verification require no CMS seed/write. Full command receipts, source preservation and served/artifact results are recorded in `docs/_shared/GS-LAUNCH-014.md` and `GS-LAUNCH-014-EVIDENCE.json`.
