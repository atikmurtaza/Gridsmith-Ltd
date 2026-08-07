# Setup

Unzip this folder. Its contents are already in the correct layout — copy them into the
root of your project repository as-is.

```
your-repo/
├── CLAUDE.md          ← Claude Code reads this automatically, every session
├── README.md
├── .claude/
│   ├── README.md
│   └── agents/        ← 5 read-only verification subagents
└── docs/
    ├── _shared/       ← read these first
    ├── _legal/        ← solicitor-ready drafts
    ├── master/        ← 8 files
    ├── design/        ← 8 files
    ├── digital/       ← 8 files
    └── press/         ← 8 files
```

Do not rename `CLAUDE.md`, `.claude/` or `docs/`. Every internal cross-reference uses
these exact paths, and `CLAUDE.md` points at `docs/...` throughout.

`.claude` starts with a dot, so it is hidden by default. On macOS press `Cmd+Shift+.`
in Finder; on Windows enable "Hidden items" in File Explorer's View tab. It matters —
the five verification agents live in there.

## First three steps

1. Copy these files into your repo and commit them **before writing any code**. The
   specs are version-controlled alongside the code they describe, and they get updated
   in the same commit as any deviation.
2. Open `docs/_shared/02-BUILD-SEQUENCE.md` and work through **Stage 0**. It is nine
   phone calls and emails, all with external lead times, all blocking later stages.
   The solicitor review is the longest.
3. Start Claude Code in the repo and paste the bootstrap prompt from
   `docs/_shared/03-CLAUDE-CODE-KICKOFF.md` §1.

## Reading order, first time

| Order | File | Why |
|---|---|---|
| 1 | `README.md` | Map of everything |
| 2 | `CLAUDE.md` | Architecture, feel, non-negotiables |
| 3 | `docs/_shared/01-VALIDATION-REPORT.md` | Known gaps, recorded decisions and their costs |
| 4 | `docs/_shared/02-BUILD-SEQUENCE.md` | What to build when, and the Stage 0 list |
| 5 | `docs/_shared/00-FOUNDATION.md` | The technical foundation everything inherits |
| 6 | `docs/_legal/00-LEGAL-BASIS.md` | What UK law requires, and the questions for your solicitor |

Everything else is read on demand, per workstream, when you reach it.
