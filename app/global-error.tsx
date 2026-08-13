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
 *
 * **Verifying this file needs a client-side error, and that is not obvious.** What renders
 * this file is a throw *after* hydration. The permanent subject is
 * `app/(marketing)/gridsmith-error-probe/page.probe.tsx`, which mounts, sets state in an
 * effect and throws on the re-render; `check-axe` visits it every run and asserts the
 * boundary identifies itself. Measured in the served DOM: `document.title` "Something went
 * wrong — Gridsmith Ltd", the `<title>` hoisted into `<head>`, `lang="en-GB"`, one `<h1>`,
 * one `<main>`, and axe zero violations against wcag2a/2aa/21a/21aa/22aa/best-practice.
 *
 * **What is verified is the client-effect path, and only that.** This docstring used to
 * assert that a throw during SSR never reaches this boundary and that production serves
 * Next's static `<html id="__next_error__">` shell instead — with no `lang` and no
 * `<title>`, i.e. a live Level A failure on every server-side crash. **That claim is
 * struck.** It could not be induced without editing a file, no gate covers it, and it was
 * written as settled fact. CLAUDE.md: an asserted claim no gate covers is unverified, and
 * unverifiable in both directions does not get asserted in either.
 *
 * So: the SSR path is **unknown**, not "known bad" and not "known good". Do not read the
 * probe's success as covering it — the probe exercises one of the two ways this boundary
 * can be reached. Establishing the other needs a route that throws during render, a
 * `next build && next start`, and a read of the response; if it turns out the shell is
 * served, that is a Level A failure needing its own fix and its own subject.
 *
 * Note also that the probe must not sit in a `_`-prefixed folder: Next treats those as
 * private and excludes them from routing, so the first attempt silently served the 404
 * instead — the same `_`-prefix trap recorded in CLAUDE.md.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-GB">
      {/* WCAG 2.2 SC 2.4.2 Page Titled. This boundary replaces the root layout, so it
          gets no title from one, and `'use client'` forbids a `metadata` export — the
          two facts together are why this document shipped untitled and axe flagged it
          `document-title`, serious. Without it the tab keeps the crashed route's title,
          which describes the page the user did not get.

          React 19 hoists a `<title>` rendered anywhere in the tree into `<head>`, which
          is what makes this reachable from a Client Component at all. Verified in the
          served DOM, not assumed — see the note below. */}
      <title>Something went wrong — Gridsmith Ltd</title>
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
