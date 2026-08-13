import type { Metadata } from 'next';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { RootShell } from '@/components/chrome/RootShell';
import { inter } from '@/styles/fonts/inter';
import { jetbrainsMono } from '@/styles/fonts/jetbrains-mono';
import '@/styles/globals.css';

export const metadata: Metadata = { title: 'Page not found — Gridsmith Ltd' };

/**
 * The 404, in the master theme.
 *
 * **This exists because `/_not-found` was the one route in the build that no gate
 * measured.** It appeared in exactly one place in the entire repository — an exemption in
 * check-bundle-size — and was absent from check-axe, check-responsive and
 * lighthouse/routes.cjs. Putting it into those route lists immediately produced four axe
 * violations on it, one of them Level A: Next's built-in 404 renders a bare document with
 * **no `lang` attribute** (WCAG 3.1.1) and no `main` landmark. That had been shipping
 * since A-04, with every gate green.
 *
 * **It renders the document shell itself, which is unusual and deliberate.** There is no
 * `app/layout.tsx` — the four route groups each own a root layout (A-04) — so an
 * unmatched URL falls outside all four and Next has no layout to give it. Next's answer
 * for a multi-root-layout app is that the root 404 supplies its own `<html>` and
 * `<body>`, which is why this imports RootShell, the fonts and globals.css directly
 * instead of inheriting them.
 *
 * **Importing them was not sufficient, and that is why this file is `global-not-found`
 * rather than `not-found`.** As `not-found.tsx` the imports were written exactly as they
 * are below and the build dropped both: `/not-found` was emitted with the CSS-modules
 * chunk and nothing else, no tokens, no themes, no Inter. Global CSS is attached to a
 * route through its layout, and this route has none — CSS *modules* still rode in on the
 * component graph, which is why the page looked styled and only the token layer was
 * missing. Every custom property resolved to the empty string, so
 * `outline: 2px solid var(--ink)` was invalid at computed-value time and took the UA
 * focus ring down with it: `outlineStyle: "none"` here against `"solid 2px"` on `/`.
 *
 * `app/global-not-found.tsx` (`experimental.globalNotFound`, see `next.config.ts`) is the
 * convention for precisely this — a 404 that owns its document because there is no root
 * layout to inherit. Next drops the layout for the route deliberately
 * (`next-app-loader/index.js:341`) and collects this file's CSS as a page's. Verified on
 * the served route, not the prerendered file: `/_gridsmith-404-probe` and `/` now link
 * the same three stylesheets.
 *
 * The prerendered file therefore contains Next's streaming shell as well as this one, and
 * a raw grep of it finds two `<html>` tags. The parsed DOM has one: the HTML parser
 * merges the attributes of a second `<html>`/`<body>` start tag onto the element already
 * open. Verified in a real browser — `document.querySelectorAll('html').length === 1`,
 * `documentElement.lang === 'en-GB'`, `body.dataset.division === 'master'`, one `<main>`,
 * status 404. That is *why* the theme assertion for this route lives in `check-axe`,
 * which reads the parsed DOM, and not in `check-theme-flash`, which reads the file.
 *
 * That assertion was `body.dataset.division` being present, and it was green throughout
 * the period described above — the attribute was written server-side exactly as intended
 * while the stylesheet giving it meaning was absent. It now asserts the computed value.
 *
 * Two alternatives were built and measured before this one. A `(marketing)/not-found.tsx`
 * reached through a catch-all route rendered inside `<html id="__next_error__">` with no
 * `lang` and no theme — `notFound()` does not re-enter a root layout — and made the 404
 * dynamic, so check-bundle-size could no longer measure it. Moving that boundary down a
 * segment changed nothing. Neither is worth reviving.
 *
 * `M-07` replaces this copy with the real thing and `M-04`/`L-05` add the statutory
 * company disclosure every page carries. Both now land on a route that is inside every
 * gate, which was the point of putting it there.
 */
export default function NotFound() {
  return (
    <RootShell division="master" fontVariables={`${inter.variable} ${jetbrainsMono.variable}`}>
      <main>
        <Container>
          <Section>
            <Heading level={1}>Page not found</Heading>
            <Prose>
              <p>
                That address does not exist. It may have moved, or the link that brought
                you here may be out of date.
              </p>
              {/* A plain <a>, not the Link primitive. Link wraps next/link, which is a
                  Client Component, and Next puts the root not-found boundary in EVERY
                  route's script list — so one convenience import here cost 4.3KB gz on
                  every page in the site, 29% of Digital's entire 15KB delta budget, for a
                  page almost nobody reaches. Measured, not guessed: check-bundle-size
                  moved every route from 100.2KB to 104.5KB the moment this file landed.
                  Client-side routing off a 404 is worth nothing; a document load is the
                  honest thing to do from a dead URL anyway. Prose styles the anchor.

                  The disable below is that measurement, not a preference. The rule did
                  not fire while this file was `not-found.tsx`; it fires on
                  `global-not-found.tsx` because that convention is a page. Nothing about
                  the trade-off changed with the filename. */}
              <p>
                <a href="/">Return to the home page</a>
              </p>
            </Prose>
          </Section>
        </Container>
      </main>
    </RootShell>
  );
}
