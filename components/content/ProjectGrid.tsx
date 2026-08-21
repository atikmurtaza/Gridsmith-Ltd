import { Card } from '@/components/primitives/Card';
import { EmptyState } from '@/components/primitives/EmptyState';
import { Heading } from '@/components/primitives/Heading';
import { Numeric } from '@/components/primitives/Numeric';
import { Placeholder } from '@/components/content/Placeholder';
import type { ProjectCard } from '@/lib/sanity/queries';
import styles from './content.module.css';

/**
 * The work grid — used by `/work` (`N-08`), the homepage's selected-work block, and each
 * division landing page.
 *
 * Server Component, zero client JS. Filtering is not here: `FOUNDATION` §"Scaling to real
 * content" requires filters to derive their options from the data and to carry URL state, which
 * is a routing concern, and every division's grid has different facets. This renders what it is
 * given.
 *
 * ## `client` is already resolved, and there is no `clientName` to get wrong
 *
 * The GROQ projection resolves `confidential` at the database — `lib/sanity/queries.ts` explains
 * why that is a security property rather than a convenience. This component could not leak a
 * confidential client name if it tried, because it is never sent one.
 *
 * ## Cross-division is derived, and it is the badge that matters most
 *
 * `isCrossDivision` is `count(divisions) > 1`, computed in the projection and never stored
 * (`master/SCHEMA.md` §1). It is the single best evidence the group structure is real, which is
 * why it sorts first on `/work` and why it is the one badge given accent treatment.
 *
 * `headingLevel` is a prop because the same grid appears under an `h1` on `/work` and under an
 * `h2` on the homepage. A component that hardcodes its level breaks the document outline on the
 * second page that uses it, which `check:headings` catches and a reader does not.
 */
export function ProjectGrid({
  projects,
  headingLevel = 3,
  emptyTitle = 'No work to show here yet',
  emptyBody = 'Nothing matches this view. The rest of the portfolio is on the work page.',
}: {
  projects: ProjectCard[];
  headingLevel?: 2 | 3 | 4;
  emptyTitle?: string;
  emptyBody?: string;
}) {
  if (projects.length === 0) {
    return (
      <EmptyState title={emptyTitle} headingLevel={headingLevel}>
        <p>{emptyBody}</p>
      </EmptyState>
    );
  }

  return (
    <ul className={styles.projectGrid}>
      {projects.map((project) => (
        <Card as="li" key={project.slug} linked className={styles.projectCard}>
          <Placeholder ratio="card" />
          <div className={styles.projectBody}>
            <Heading level={headingLevel} size="d4">
              <a href={`/work/${project.slug}`} className={styles.cardLink}>
                {project.title}
              </a>
            </Heading>
            <p className={styles.projectMeta}>
              <Numeric>{project.divisions.join(' · ')}</Numeric>
              {project.isCrossDivision ? (
                <span className={styles.crossDivision}>Cross-division</span>
              ) : null}
            </p>
            {project.summary ? <p className={styles.projectSummary}>{project.summary}</p> : null}
            <p className={styles.projectClient}>
              {project.client}
              {project.confidential ? ' — named by agreement only' : ''}
            </p>
          </div>
        </Card>
      ))}
    </ul>
  );
}
