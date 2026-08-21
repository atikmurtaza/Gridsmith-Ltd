import type { Metadata } from 'next';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { ProjectGrid } from '@/components/content/ProjectGrid';
import { listProjects } from '@/lib/sanity/queries';

export const metadata: Metadata = {
  title: 'Work — Gridsmith Ltd',
  description: 'Projects across Gridsmith Design, Gridsmith Digital and Gridsmith Press.',
};

/**
 * `/work` — the master work grid (`N-08`).
 *
 * Server Component, zero client JS. Statically generated: every read goes through
 * `lib/sanity/queries.ts`, which passes no cache directive, so the route stays `○` rather than
 * becoming `ƒ` — `TECH-SPEC.md` §1 and every LCP budget depend on that.
 *
 * **Cross-division work sorts first**, in the GROQ order clause rather than here. That is
 * `N-08`'s "cross-division sorted first" and it is the argument the master layer exists to
 * make: work that spans two studios is the only evidence that the group structure does
 * anything. Sorting in the query rather than in the component means the same order applies
 * wherever the projection is reused.
 *
 * **There is no filter UI yet, and that is a scoping decision rather than an omission.**
 * `FOUNDATION` §"Scaling to real content" requires filters to derive their options from the
 * data and to carry URL state; with 24 seed records and no real facets to derive from, a filter
 * built now would be built against invented taxonomy. It arrives with real work.
 */
export default async function Page() {
  const projects = await listProjects();

  return (
    <main id="main" tabIndex={-1}>
      <Section rhythm="loose">
        <Container>
          <Heading level={1}>
            Work
          </Heading>
          <Prose>
            <p>
              Projects across all three studios. Work that spans more than one is listed first —
              it is the clearest evidence that the divisions are one company rather than three
              names.
            </p>
            <p>
              Some clients are named by agreement only. Where a project is confidential the
              client is described rather than named, and the description is all this site ever
              holds.
            </p>
          </Prose>
        </Container>
      </Section>
      <Section>
        <Container>
          <ProjectGrid projects={projects} headingLevel={2} />
        </Container>
      </Section>
    </main>
  );
}
