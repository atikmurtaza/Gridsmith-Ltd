'use client';
// Next requires global-error to be a Client Component, and requires it to render its own
// <html> and <body> — it replaces the root layout, which by definition has just failed.

/**
 * The uncaught-error boundary, in the master theme.
 *
 * **This is the second half of the `/_not-found` fix, and it was missed the first time.**
 * The defect there was not "the 404 page is wrong". It was: *with no `app/layout.tsx`, any
 * render path that falls outside the four route groups gets Next's built-in document,
 * which has no `lang` attribute* — WCAG 3.1.1, Level A. `not-found` was one instance.
 * `global-error` is the other, and fixing only the first is exactly the per-instance fix
 * CLAUDE.md warns leaves the same defect live elsewhere.
 *
 * Next's built-in renders `<html id="__next_error__">` with no `lang`, no `<main>`, no
 * `data-division` and no theme stylesheet, and `<h2>` as its first heading. Verified
 * present in this build before this file existed.
 *
 * **Deliberately raw elements, not primitives, and no stylesheet.** Every import here
 * lands in the client boundary for every route in the site — that is how the 404 quietly
 * cost 4.3KB gz everywhere by importing one `Link`. A crash page has one job and must not
 * tax the requests that never see it.
 *
 * **It is also deliberately unthemed, and that is the interesting part.** Rendering
 * `data-division="master"` here put the literal string `data-division` into a client
 * chunk, and `check-theme-flash` failed — correctly. Its third assertion is that *no
 * client chunk references the attribute at all*, so that no code path exists which could
 * set the theme after hydration; its own comment calls that "the load-bearing one".
 *
 * This boundary genuinely cannot set it server-side: Next requires a Client Component,
 * and the server layout that would normally supply the theme is the thing that just
 * crashed. So the choice was a narrow exception in the strongest assertion in that gate,
 * or an unstyled crash page. **The unstyled page is worth more than the brand colours.**
 * An exception is a precedent, and this one would have to be phrased as "except in files
 * that are allowed to set the theme on the client" — which is the assertion inverted.
 *
 * `reset()` re-renders the tree; it is the only recovery Next offers here.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-GB">
      <body>
        <main>
          <h1>Something went wrong</h1>
          <p>
            An unexpected error stopped this page loading. Nothing you were doing has been
            sent anywhere.
          </p>
          <button type="button" onClick={() => reset()}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
