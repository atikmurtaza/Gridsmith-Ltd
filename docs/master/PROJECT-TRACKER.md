# Project Tracker — Gridsmith Master Layer

**Status:** `TODO` · `WIP` · `BLOCKED` · `REVIEW` · `DONE` · **Priority:** P0 blocks launch · P1 desirable · P2 post-launch

The master layer owns the shared foundation (Epic A, previously in the Design tracker) plus two additions.

---

## Epic A — Shared foundation *(moved here from Design)*

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| A-01 | Next.js + TS strict + Tailwind v4 scaffold | P0 | 0.5d | — | TODO | Dev | |
| A-02 | Token layer `tokens.css` | P0 | 1d | A-01 | TODO | Dev | |
| A-03 | Four theme files (master + 3 divisions) | P0 | 1.5d | A-02 | TODO | Dev | |
| A-04 | Four route groups + `data-division` | P0 | 1d | A-03 | TODO | Dev | Zero theme flash |
| A-05 | 21 shared primitives | P0 | 4d | A-02 | TODO | Dev | No hardcoded colours |
| A-06 | Sanity project + core schemas | P0 | 2d | — | TODO | Dev | Incl. `isSeed` on all types |
| A-07 | Supabase + `leads` + RLS | P0 | 1d | — | TODO | Dev | |
| A-08 | Lead pipeline end-to-end | P0 | 1.5d | A-07 | TODO | Dev | Notify <60s |
| A-09 | Analytics + AI-referral detection | P0 | 1d | A-01 | TODO | Dev | Gated on consent |
| A-10 | CI gates (TS/lint/LHCI/size/axe) | P0 | 1d | A-01 | TODO | Dev | |
| A-11 | **Consent management + script gating** | P0 | 2d | A-01 | TODO | Dev | No cookie before consent |
| A-12 | **Seed enforcement + production build check** | P0 | 1d | A-06 | TODO | Dev | Seed publish fails prod build |

## Epic M — Master shell

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| M-01 | Master theme; accent = ink | P0 | 0.5d | A-03 | TODO | Dev | Amber 2.0:1 constraint |
| M-02 | Root layout, server-set `data-division` | P0 | 1d | A-04 | TODO | Dev | |
| M-03 | Header with per-division nav | P0 | 1.5d | A-05 | TODO | Dev | Wordmark → `/` |
| M-04 | Footer + division switcher + statutory block | P0 | 1d | M-03 | TODO | Dev | From `companyDetails` |
| M-05 | `companyDetails` singleton | P0 | 0.5d | A-06 | TODO | Dev | Response commitment stored once |
| M-06 | Consent banner UI | P0 | 1.5d | A-11 | TODO | Dev | Accept/Reject identical |
| M-07 | 404 + 500 pages | P0 | 1d | M-03 | TODO | Dev | 500 works without JS |

## Epic N — Master pages

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| N-01 | Homepage, 9 blocks | P0 | 2.5d | M-03 | TODO | Dev | Lighthouse ≥98 |
| N-02 | **Division routing block** | P0 | 1.5d | N-01 | TODO | Dev | Above second viewport |
| N-03 | `groupPage` schema | P0 | 0.5d | A-06 | TODO | Dev | |
| N-04 | `/approach`, 8 blocks | P0 | 2d | N-03 | TODO | Dev | Incl. limits section |
| N-05 | `continuityExample` schema + component | P0 | 1.5d | N-03 | TODO | Dev | `verified` hard-true |
| N-06 | Canonical process component + validator | P0 | 1d | A-06 | TODO | Dev | Six canonical titles only |
| N-07 | `/about` + structure disclosure | P0 | 1.5d | M-05 | TODO | Dev | |
| N-08 | `/work` master grid | P0 | 2d | A-06 | TODO | Dev | Cross-division sorted first |
| N-09 | **Canonical `/work/[slug]`** | P0 | 1.5d | N-08 | TODO | Dev | Divisions link here |
| N-10 | Division work routes → canonical links | P0 | 0.5d | N-09 | TODO | Dev | Removes duplicate-content risk |
| N-11 | `/contact` master flow | P0 | 2d | A-08 | TODO | Dev | "More than one" first-class |
| N-12 | Confirmation screen + commitment | P0 | 0.5d | M-05, N-11 | TODO | Dev | |
| N-13 | `/insights` hub | P1 | 1d | A-06 | TODO | Dev | |

## Epic L — Legal & compliance

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| L-01 | `legalDocument` schema + clause anchors | P0 | 1d | A-06 | TODO | Dev | `solicitorApproved` gate |
| L-02 | Legal page template, TOC, print CSS | P0 | 1d | L-01 | TODO | Dev | Stable `#anchor` per clause |
| L-03 | Load four drafts from `_legal/` | P0 | 0.5d | L-02 | TODO | Content | To staging |
| L-04 | **Solicitor review of all documents** | P0 | — | L-03 | TODO | Atik + solicitor | **HARD GATE — send week 1** |
| L-05 | Statutory disclosure verification | P0 | 0.5d | M-04 | TODO | Dev | Every page |
| L-06 | ICO registration + number recorded | P0 | — | — | TODO | Atik | |
| L-07 | `consent_events` audit table | P0 | 0.5d | A-11 | TODO | Dev | No PII |
| L-08 | PI insurance scope confirmation | P0 | — | — | TODO | Atik + broker | Must cover engineering drawings |

## Epic G — Migration & SEO

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| G-01 | Crawl existing site, export URLs | P0 | 0.5d | — | TODO | Dev | |
| G-02 | Build `redirects/legacy.json` | P0 | 1d | G-01 | TODO | Dev | Zero unmapped |
| G-03 | Implement + test redirects | P0 | 0.5d | G-02 | TODO | Dev | None to `/` or 404 |
| G-04 | Sitemap, robots, `llms.txt` | P0 | 1d | N-* | TODO | Dev | All four groups |
| G-05 | Structured data pass | P0 | 1d | N-* | TODO | Dev | `department`, not four orgs |
| G-06 | **Bulk import script** | P0 | 1.5d | A-06 | TODO | Dev | 100 records in one pass |
| G-07 | **Image ingest pipeline** | P0 | 1d | G-06 | TODO | Dev | Watermark, resize, AVIF |

## Epic S — Seed content

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| S-01 | Seed script, all volumes | P0 | 2d | A-12 | TODO | Dev | Per FOUNDATION §7 |
| S-02 | 24 seed projects incl. 3 cross-division, 3 confidential | P0 | 1d | S-01 | TODO | Content | |
| S-03 | Seed pricing with `INDICATIVE` badges | P0 | 0.5d | S-01 | TODO | Dev | No unbadged figure |
| S-04 | Abstract placeholder imagery | P0 | 1d | S-01 | TODO | Design | **No fabricated drawings/covers/screenshots** |
| S-05 | `?seed=hide` + env flag | P1 | 0.5d | S-01 | TODO | Dev | Demo mode |
| S-06 | Production seed check verified | P0 | 0.5d | A-12 | TODO | Dev | Deliberate failure test |
| S-07 | 3 seed cross-division case studies | P0 | 1d | S-02 | TODO | Content | Evidence for `/approach` |

## Epic H — Hardening & launch

| ID | Task | P | Est | Depends | Status | Owner | Notes |
|---|---|---|---|---|---|---|---|
| H-01 | Homepage performance ≥98 | P0 | 1.5d | N-01 | TODO | Dev | Banner in budget |
| H-02 | Accessibility pass incl. consent banner | P0 | 2d | M-06 | TODO | Dev | |
| H-03 | All states | P0 | 1d | N-* | TODO | Dev | Incl. seed-hidden |
| H-04 | Cross-browser + device | P0 | 1d | H-01 | TODO | Dev | |
| H-05 | **Division routing user test, 10 users** | P0 | — | N-02 | TODO | External | **GATE — ≥70% one click** |
| H-06 | Notification drill | P0 | — | A-08 | TODO | Ops | <60s |
| H-07 | **Confirmation copy audit, all four groups** | P0 | 0.5d | N-12 | TODO | Dev | Nothing faster than next business day |
| H-08 | PostHog funnels | P0 | 0.5d | A-09 | TODO | Dev | 3 master funnels |
| H-09 | Launch | P0 | — | H-* | TODO | Ops | |

## Blocked / decisions needed

| ID | Item | Needed from | Blocks |
|---|---|---|---|
| Q-M1 | Company number and registered office | Atik | M-05, L-05 |
| Q-M2 | Solicitor engaged and drafts sent | Atik | L-04 |
| Q-M3 | ICO registration | Atik | L-06 |
| Q-M4 | PI insurance scope — engineering drawings covered? | Atik + broker | L-08 |
| Q-M5 | Business hours and phone number for the confirmation screen | Atik | N-12 |
| Q-M6 | A real continuity example — a client served across divisions or over time | Atik | N-05 |
| Q-M7 | The honest limits — when should someone use a specialist instead? | Atik | N-04 |
| Q-M8 | Existing site URL inventory / access to crawl | Atik | G-01 |
| Q-M9 | Public-facing team members | Atik | N-07 |

## Metrics dashboard

| Metric | Target | Current |
|---|---|---|
| Root sessions reaching a division ≤2 pageviews | ≥70% | — |
| `/approach` scroll depth ≥75% | ≥40% of sessions | — |
| Generalist / multi-need leads share | ≥15% | — |
| `/work` sessions viewing a cross-division case | ≥30% | — |
| Homepage bounce | ≤40% | — |
| Homepage Lighthouse performance | ≥98 | — |
| Consent accept rate | tracked, not targeted | — |
| Unmapped legacy URLs | 0 | — |
| Seed records in production | 0 | — |
