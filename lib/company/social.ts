/**
 * The approved Gridsmith social channels — `GS-O017`, closed 18 September 2026.
 *
 * ## Provenance: one owner-controlled source, not a search
 *
 * Every URL below is transcribed from **`github.com/atikmurtaza/gridsmith-working`**, the
 * owner's earlier Gridsmith implementation, supplied as owner evidence at `GS-R001-R`. They are
 * **explicitly configured links** in `app/src/components/Overlay.jsx`, not accounts inferred
 * from the word "Gridsmith". The repository was read read-only and nothing else was taken from
 * it.
 *
 * **This evidence corrected an earlier conclusion in the same phase, and the correction is the
 * reason this file records its method.** Before it arrived, a generic web search had found
 * `facebook.com/gridsmith` and `linkedin.com/company/gridsmith` and attributed both to
 * *Gridsmith Studio* — an unrelated surface-pattern designer in Seattle whose accounts are at
 * different URLs entirely (`linkedin.com/company/gridsmith-studio`, and a numeric Facebook id).
 * The search was not wrong about Gridsmith Studio existing; it was wrong about who owns these
 * URLs, and no amount of further searching would have settled it. **A name is not an identity**,
 * which is what the brief's instruction not to infer accounts from the name is protecting
 * against.
 *
 * ## Each one was resolved before it was published
 *
 * | Platform | Verified by | Evidence |
 * |---|---|---|
 * | Facebook | rendered page | Page "Gridsmith Ltd", and it publishes **`contact@gridsmith.uk` and `07405 448534`** — the approved company email and number. The strongest identity match of the eight |
 * | Instagram | rendered page | "Gridsmith Ltd (@gridsmith_ltd)", 36 followers, bio names the company |
 * | LinkedIn | HTTP + title | `Gridsmith Ltd \| LinkedIn` |
 * | X | rendered page | "Gridsmith Ltd (@GridsmithLtd)" — bio: *"a professional web development and graphic design company"* |
 * | TikTok | oEmbed | `author_name: "Gridsmith"`, `data-unique-id: gridsmithltd` |
 * | YouTube | HTTP + title | `Gridsmith - YouTube` |
 * | Reddit | HTTP, `old.reddit.com` | account exists; a control handle returns a 8KB stub against this account's 321KB page |
 * | Freelancer | HTTP + title | `GridsmithLTD Profile` — already approved at `GS-O014` as the review-attribution target |
 *
 * **Facebook nearly went unpublished on a transport artefact.** An anonymous `curl` returned
 * **HTTP 400** on three URL forms, which reads exactly like a dead vanity URL — and the rule is
 * to refuse a dead link. A real browser rendered the page normally: the 400 was a bot block.
 * `CLAUDE.md` warns that a probe run over a transport the real client does not use can make a
 * live thing look unreachable; this is that, and it would have removed a real account.
 *
 * ## What is deliberately NOT here
 *
 * **The Gmail compose link.** The old implementation's first social tile pointed at
 * `contact.gridsmith@gmail.com`. That address is on `FORBIDDEN_EMAILS` in
 * `scripts/company-facts-rules.mjs`: `GS-O004` approved `contact@gridsmith.uk` and nothing else,
 * and `check:company` question 2 refuses the legacy one on every route. **Being configured in an
 * older build does not revive a superseded fact**, and the gate would have caught it anyway —
 * which is the gate working rather than a reason not to have thought about it.
 *
 * **The Reddit share link.** The configured URL was
 * `reddit.com/u/Gridsmithltd/s/CsBkRtMNP8` — a share permalink that redirects to the profile
 * carrying five `utm_*` tracking parameters. The canonical profile URL is published instead.
 * That is a **normalisation of the same account**, not a substitution of a different one: same
 * handle, same destination, no tracking.
 *
 * ## Adding or removing one
 *
 * This list is the expectation `check:company` question 9 asserts against the served `/about`:
 * every entry must appear, and **no other external profile link may**. Adding a channel means
 * editing this file, which is a visible act in a diff and is what stops an unverified account
 * being added to a component later.
 */
export type SocialChannel = {
  /** The label the link carries. It is also the accessible name, so it names the platform. */
  platform: string;
  /** The published URL. Canonical form, no tracking parameters. */
  url: string;
  /** The handle, rendered in monospace beside the link — this site's convention for anything verifiable. */
  handle: string;
};

export const SOCIAL_CHANNELS: readonly SocialChannel[] = [
  { platform: 'Facebook', url: 'https://www.facebook.com/gridsmith', handle: '/gridsmith' },
  { platform: 'Instagram', url: 'https://www.instagram.com/gridsmith_ltd', handle: '@gridsmith_ltd' },
  { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/gridsmith', handle: '/company/gridsmith' },
  { platform: 'X', url: 'https://x.com/gridsmithltd', handle: '@GridsmithLtd' },
  { platform: 'TikTok', url: 'https://www.tiktok.com/@gridsmithltd', handle: '@gridsmithltd' },
  { platform: 'YouTube', url: 'https://www.youtube.com/@Gridsmithltd', handle: '@Gridsmithltd' },
  { platform: 'Reddit', url: 'https://www.reddit.com/user/Gridsmithltd', handle: 'u/Gridsmithltd' },
  { platform: 'Freelancer', url: 'https://www.freelancer.com/u/GridsmithLTD', handle: '/u/GridsmithLTD' },
];
