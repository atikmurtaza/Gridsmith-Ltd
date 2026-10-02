# GS-PROD-004A — Owner-gate reduction and the `GS-X002` review pack

**Date:** 2 October 2026 (UTC). **Result: OWNER ACTION REQUIRED.** No production write of any kind.
Start `7f6472b2` (CI `37010155414` success 48/48); `028bd1d5` CI `37006558824` success 48/48; runtime
`1542f508`; main `fbecbe01`.

## `GS-O021` — TikTok mark

- **Requirement** (`OWNER-ACTIONS.md`, raised at `GS-SHARED-001-RC`): TikTok's Brand and Use
  Guidelines require prior written permission for any logo use; none has been received. The record
  itself names the fallback: remove the mark or replace it with a text link before cutover.
- **Current asset:** a simple-icons 16.33.0 path (not an official TikTok download), monochrome, in
  `components/chrome/platformMarks.ts`; rendered in the footer social row (every page) and the
  `/about` Platforms list.
- **Prepared (path B), local and uncommitted:** delete the `TikTok` entry. Footer: plain word
  "TikTok" (existing fallback), 16px, 57×44, 13.26:1 effective; `/about`: label and handle kept, icon
  slot empty. Same URL, same accessible name ("Gridsmith on TikTok (opens in a new tab)"); the seven
  other marks unchanged; 375px: 4×2 grid, no horizontal overflow. Verified on a local dev server of
  this checkout (port 3200); screenshots supplied to the owner, not committed.
- **Status:** awaiting owner visual approval (frozen, owner-approved footer).

## `GS-X002` — review pack

`docs/_shared/GS-X002-REVIEW-PACK.md`. Copy generated from the publication payload
(`seed-content.mjs` → `service-content.mjs`) and checked: 76 public strings, 0 missing. It includes the
shared process stages and the `/design` Technical chapter text, because both are public claims about
these services. Excludes insurance, contract terms, competence, pricing and other pages. `GS-X002`
stays OPEN.

## Finding — `/design` scope note

`components/divisions/design/DesignHome.tsx:202-205` (GS-R002, owner-approved): *"Technical services
remain subject to professional-scope and insurance confirmation."* Since `GS-O005` closed, the
insurance limb is untrue and is a public insurance statement. **Proposed (not applied):** delete "and
insurance". Owner copy approval needed; then re-run `check:design:scene` (it measures `.ds-gate`).

## `GS-O003` handoff

Checked against the six required facts. Three were implicit and are now explicit in
`OWNER-ACTIONS.md` `GS-O003` and `_legal/LEGAL-LAUNCH-CHECKLIST.md`: insurance is not an owner-imposed
launch prerequisite; not a claim of zero liability; `MSA-BUSINESS.md` §12 is broader than the
intended public scope. The `/design` sentence is flagged to the solicitor. No clause drafted.

## Register

Reconciled in `PROJECT-STATUS.md` → *Active blockers* → *Current register*.
