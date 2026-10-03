# GS-PROD-004B — TikTok mark retained by owner decision; `/design` scope note corrected

**Date:** 2 October 2026 (UTC). Start `e6f5691e`; runtime `1542f508`; main `fbecbe01`.

## Baseline CI

`e6f5691e` CI `37045218030` failed on one assertion: mobile TBT on `/press`, median 207.7ms against
200ms (runs 194, 221, 208). The commit changed documentation only (7 files under `docs/` and
`CLAUDE.md`); runtime is identical to `7f6472b2`, which passed. Comparing the two runs' raw
Lighthouse reports shows **every** route slower by a similar amount (`/` 94→159ms, `/digital` 59→133,
`/press/contact` 89→138, `/press` 142→208): runner variance, not a regression. The failed job was
re-run; the result is recorded in the receipt below. No gate was altered.

## `GS-O021` — CLOSED BY OWNER DECISION (owner-accepted brand-use risk)

The owner reviewed the recorded concern and explicitly chose to keep the TikTok mark. **No written
TikTok permission is recorded or claimed.** The `GS-PROD-004A` text-link prototype was rejected and
discarded (`git checkout` of `components/chrome/platformMarks.ts` only; no unrelated work touched).
Net TikTok runtime change: none — `platformMarks.ts`, `Footer.tsx`, `Connect.tsx` equal `HEAD`, and all
runtime source except the one copy line below equals `7f6472b2`. Served build: footer link "Gridsmith
on TikTok (opens in a new tab)" with the mark; `/about` row with the mark, visible label and
`@gridsmithltd`; no text fallback, no empty slot; URL unchanged.

Not changed, recorded: the `platformMarks.ts` provenance comment still describes `GS-O021` as a pending
cutover gate. It was left byte-identical on the owner's instruction (no net change to the TikTok
implementation) and is superseded by `OWNER-ACTIONS.md`.

## `/design` Technical note

`components/divisions/design/DesignHome.tsx`, owner-approved deletion of "and insurance":

- before: *"Technical services remain subject to professional-scope and insurance confirmation."*
- after: *"Technical services remain subject to professional-scope confirmation."*

Surrounding copy unchanged. `check:design:scene` (clean build, served on 3300): PASS, G2 scope-note
minimum 6.69:1 at every sampled size (unchanged). `GS-X002-REVIEW-PACK.md` §4 now quotes the new
wording; the `GS-O003` solicitor note records the removal. Runtime source no longer makes insurance a
Technical prerequisite anywhere (remaining mentions say the opposite).

`GS-X002` OPEN; `GS-O024` deferred; `GS-O003` OPEN. No production write of any kind.

## Final CI receipt — independently reconciled at GS-PROD-005, 3 October 2026

The original failed attempt above remains historical evidence. The final rerun of
`37045218030` on `e6f5691e852fff12aecf94efa213329c8221e21d` completed **SUCCESS, 48/48 steps**
at 20:44:04 UTC on 2 October 2026. This phase's `9508412e1cc2396e4deafea30d08e3ab9d606b19`
completed CI `37056516953` **SUCCESS, 48/48 steps** at 21:07:13 UTC on 2 October 2026.
Both were read independently from GitHub, not inferred from a commit message. The stale source
comment described above was reconciled in the legitimate GS-PROD-005 documentation commit;
the TikTok mark, link and accessible name remain unchanged.
