import type { Metadata } from 'next';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Prose } from '@/components/primitives/Prose';
import { Link } from '@/components/primitives/Link';
import { Section } from '@/components/primitives/Section';
import { DivisionLanding, type DivisionCopy } from '@/components/divisions/DivisionLanding';

export const metadata: Metadata = {
  title: 'Gridsmith Press — publishing, ghostwriting and content',
  description:
    'Book publishing, ghostwriting, editing and content programmes. You keep your copyright and your own ISBN. A trading division of Gridsmith Ltd.',
};

/**
 * `/press` — the Press landing page.
 *
 * Warm paper canvas, deep green accent, **Source Serif** as the display face — `DESIGN.md` §1's
 * *the well-made book*. Set by `(press)/layout.tsx`; nothing here names them.
 *
 * **This is the landing page, not the full hub.** The Path Finder is Epic `K` — twenty-two rows
 * — and the books shelf and rights module are Epic `P`. What ships here is the shell plus the
 * one thing Press cannot honestly launch without, below.
 *
 * ## The rights statement is on the page, not behind a link
 *
 * Non-negotiable #6: *"Never claim more than the contract gives. Press's rights module cites
 * real clauses in `_legal/`."* The three sentences in the rights block correspond to clause 10.1
 * of the **Client Terms for Consumers** — copyright stays with the author, no royalty interest, and help obtaining
 * **your own** ISBN rather than one registered to us. They are on the landing page because they
 * are the reason an author would choose Press over a company that takes the ISBN, and a
 * differentiator a visitor has to go looking for is not one.
 *
 * The block links to the clause rather than restating it as a promise, so the page and the
 * contract cannot drift: `anchorId` is stable across versions precisely so a link like this one
 * keeps pointing at the same clause.
 *
 * **`Q-M6`/`Q-M7`-style honesty applies here too:** nothing on this page claims a title, an
 * author, an ISBN or a sales figure. `CLAUDE.md` #2 names ISBNs explicitly, and the seeded book
 * content carries none.
 */
const COPY: DivisionCopy = {
  name: 'Gridsmith Press',
  positioning: 'Your book, published properly, and still yours.',
  intro: [
    'Publishing, ghostwriting, editing and content programmes — from a manuscript that is nearly there to a finished book with a cover, an interior and a route to readers.',
    'We are not your publisher. We are the people who make the book, and the rights stay where they started.',
  ],
  servicesHeading: 'What we do',
  servicesLede:
    'Every price here is a starting point, not a quotation — what moves it is listed against each one.',
  workHeading: 'Selected work',
  ctaHeading: 'Tell us about the book.',
  ctaLede:
    'Finished manuscript, half a draft, or an idea you have been carrying for three years — all three are a reasonable place to start, and we will tell you honestly which one you are at.',
  ctaLabel: 'Start a publishing project',
};

export default function Page() {
  return <DivisionLanding division="press" copy={COPY} afterHero={<RightsStatement />} />;
}

/**
 * The rights statement — non-negotiable #6, rendered through `DivisionLanding`'s `afterHero`
 * slot so that it sits inside the page's `<main>` directly under the hero.
 *
 * `h2`, never `h1`: `DivisionLanding` owns the only `h1` on the route, and two would fail axe on
 * the page with the strongest honesty requirement on the site.
 *
 * **Each sentence corresponds to a clause and links to it rather than restating it as a
 * promise.** `anchorId` is stable across versions precisely so that a link like this keeps
 * pointing at the same clause when the document is revised — `master/SCHEMA.md` requires a
 * version bump and a redirect to renumber one. That is what stops the page and the contract
 * drifting apart, which is the failure non-negotiable #6 describes: claiming more than the
 * contract gives.
 *
 * The Client Terms are a **draft pending solicitor review** (`L-04`), and the linked page says
 * so in the first thing on it. That is the correct state to be in before launch and the wrong
 * state to be in at launch; `BEFORE-LAUNCH.md` carries the row.
 */
function RightsStatement() {
  return (
    <Section surface="sunken" labelledBy="rights">
      <Container width="narrow">
        <Heading level={2} id="rights">
          You keep the rights. You keep the ISBN.
        </Heading>
        <Prose>
          <p>
            Copyright in your book stays yours. We do not acquire a share of it, we do not take a
            royalty interest, and we do not become your publisher of record.
          </p>
          <p>
            Where an ISBN is needed, we help you obtain <strong>your own</strong>. An ISBN
            registered to us would make us the publisher on every retail listing for the life of
            the title, and that is not what you are buying.
          </p>
          <p>
            On ghostwritten work, the finished manuscript is yours and we waive our moral rights
            in your favour so that you can be named as the author — recorded in the engagement
            scope rather than assumed.
          </p>
          <p>
            {/* The `Link` primitive rather than a bare anchor: it carries the layer's underline and
                focus ring, and since Epic N it renders a plain `<a>` with no `next/link` runtime, so
                the correctness costs nothing. */}
            {/* **Consumer terms, not the MSA, and that is the point of the split.** This link
                pointed at `/legal/client-terms` when that one slug served both instruments, so a
                Press author following it from the rights statement landed on a B2B liability cap
                that CRA 2015 s. 57 makes void against them, with nothing on the page saying so.
                `scripts/check-consumer-terms.mjs` asserts against the SERVED page that no
                consumer-facing route links to the business terms, and that this route links to
                the consumer terms — so this cannot silently drift back. */}
            <Link href="/legal/consumer-client-terms#clause-10-1">
              Read clause 10.1 of the Client Terms for Consumers, which is where these come from
            </Link>
            .
          </p>
        </Prose>
      </Container>
    </Section>
  );
}
