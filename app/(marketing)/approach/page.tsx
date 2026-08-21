import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { GroupSections } from '@/components/content/GroupSections';
import { ProjectGrid } from '@/components/content/ProjectGrid';
import { getGroupPage, listProjects } from '@/lib/sanity/queries';

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
 * The cross-division work below them is the evidence that *is* available, so it is used.
 */
export default async function Page() {
  const page = await getGroupPage('approach');
  if (!page) notFound();

  const crossDivision = (await listProjects()).filter((p) => p.isCrossDivision);

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

      <Section labelledBy="cross-division">
        <Container>
          <Heading level={2} id="cross-division">
            Work that spanned more than one studio
          </Heading>
          <Prose>
            <p>
              The argument above is only worth making if it produces work. These are the
              projects where more than one studio was involved.
            </p>
          </Prose>
          <ProjectGrid
            projects={crossDivision}
            emptyTitle="No cross-division work published yet"
            emptyBody="Work that spans two studios appears here as it is published."
          />
        </Container>
      </Section>
    </main>
  );
}
