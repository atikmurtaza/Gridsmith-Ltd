import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { GroupSections } from '@/components/content/GroupSections';
import { getGroupPage } from '@/lib/sanity/queries';

export const metadata: Metadata = {
  title: 'How we work — Gridsmith Ltd',
  description:
    'One company, three studios, one process — and an honest account of when to use a specialist instead.',
};

/**
 * `/approach` — `N-04`, and `M-J2`'s destination.
 *
 * **This is the page the master layer exists for.** `APP-FLOW.md` §1: a visitor whose need
 * spans two divisions does not click a division card; they read the one-company argument on the
 * homepage and come here. The continuity example is named there as *the decisive content* and
 * the limits section as *the credibility move*.
 *
 * Server Component, zero client JS. Content comes from the `approach` `groupPage` — `N-03`'s
 * closed slug set is why this route can assume the document exists in exactly one form.
 *
 * ## Two blocks are deliberately empty and neither is an oversight
 *
 * The continuity example renders its empty state (`N-05`: no seed example can exist, because
 * `verified` is hard-true and a placeholder would have to claim someone confirmed a story that
 * did not happen — `Q-M6`). The limits section carries placeholder prose pending `Q-M7`. Both
 * are content questions with the owner, and inventing either would be the exact failure
 * non-negotiable #2 describes: a plausible claim nobody can check.
 *
 * ## No cross-division work grid — `GS-P03`
 *
 * This page used to close on a grid of cross-division projects. `GS-D001` removed it: Gridsmith
 * does not hold permission to publish client work, so the grid could only ever be empty or
 * fabricated. The page argues from the process and the structure instead, which it can do
 * truthfully.
 */
export default async function Page() {
  const page = await getGroupPage('approach');
  if (!page) notFound();

  return (
    <main id="main" tabIndex={-1}>
      <Section rhythm="loose">
        <Container width="narrow">
          <Heading level={1}>
            {page.title}
          </Heading>
          {page.intro ? (
            <Prose>
              <p>{page.intro}</p>
            </Prose>
          ) : null}
        </Container>
      </Section>

      <GroupSections sections={page.sections} />
    </main>
  );
}
