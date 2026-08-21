import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/primitives/Breadcrumb';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Numeric } from '@/components/primitives/Numeric';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { Blocks } from '@/components/content/Blocks';
import { Placeholder } from '@/components/content/Placeholder';
import { TestimonialList } from '@/components/content/TestimonialList';
import { getProject, listProjectSlugs } from '@/lib/sanity/queries';
import styles from '@/components/content/content.module.css';

/**
 * `/work/[slug]` — the **canonical** case study (`N-09`).
 *
 * Every division links here rather than rendering its own copy. `N-10` is the row that makes
 * that true, and the reason is duplicate content: three divisions each publishing the same
 * cross-division project under their own path is three URLs competing for one piece of work,
 * and the search engine picks which one loses.
 *
 * Server Component, zero client JS.
 *
 * ## `generateStaticParams` is what keeps this route static
 *
 * Without it the segment is server-rendered on demand and the LCP budget is measured against a
 * cold function invocation. With it, every project is a file on disk at build time. When real
 * content arrives and the count grows, this stays correct: it is a list of slugs, not a limit.
 *
 * ## The client name cannot leak here
 *
 * `getProject` emits a single resolved `client` string; `clientName` is not in the projection
 * at all when `confidential` is true. See `lib/sanity/queries.ts` — this is enforced at the
 * database rather than in this file, precisely so that this file cannot get it wrong.
 */
export async function generateStaticParams() {
  const slugs = await listProjectSlugs();
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Not found — Gridsmith Ltd' };
  return {
    title: `${project.title} — Gridsmith Ltd`,
    description: project.summary ?? undefined,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <main id="main" tabIndex={-1}>
      <Section rhythm="loose">
        <Container>
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: '/work', label: 'Work' },
              { href: `/work/${project.slug}`, label: project.title },
            ]}
          />
          <div className={styles.caseHeader}>
            <Heading level={1}>
              {project.title}
            </Heading>
            <p className={styles.caseMeta}>
              <Numeric>
                {[
                  project.divisions.join(' · '),
                  project.industry,
                  project.year ? String(project.year) : null,
                ]
                  .filter(Boolean)
                  .join('  |  ')}
              </Numeric>
            </p>
            <p className={styles.projectClient}>
              {project.client}
              {project.confidential
                ? ' — this client is described rather than named, by agreement. Their name is not held on this site.'
                : ''}
            </p>
            {project.summary ? (
              <Prose>
                <p>{project.summary}</p>
              </Prose>
            ) : null}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Placeholder ratio="wide" />
        </Container>
      </Section>

      <Section>
        <Container>
          <div className={styles.caseSections}>
            <section aria-labelledby="challenge">
              <Heading level={2} id="challenge">
                The situation
              </Heading>
              <Prose>
                <Blocks value={project.challenge} />
              </Prose>
            </section>
            <section aria-labelledby="approach">
              <Heading level={2} id="approach">
                What we did
              </Heading>
              <Prose>
                <Blocks value={project.approach} />
              </Prose>
            </section>
            <section aria-labelledby="outcome">
              <Heading level={2} id="outcome">
                Where it landed
              </Heading>
              <Prose>
                <Blocks value={project.outcome} />
              </Prose>
            </section>
          </div>
        </Container>
      </Section>

      {project.metrics && project.metrics.length > 0 ? (
        <Section surface="sunken" labelledBy="metrics">
          <Container>
            <Heading level={2} id="metrics">
              Measured
            </Heading>
            {/* Every seed metric reads `[SEED] 00%`. `metric.value` is a string precisely so
                that a marker can live inside the figure rather than beside it — SCHEMA-CORE §2
                and FOUNDATION §7.6. A reader has no access to `isSeed`; this is what they get
                instead. */}
            <dl className={styles.metrics}>
              {project.metrics.map((metric, i) => (
                <div key={`${metric.label}-${i}`} className={styles.metric}>
                  <dt className={styles.metricLabel}>{metric.label}</dt>
                  <dd className={styles.metricValue}>
                    <Numeric>{metric.value}</Numeric>
                  </dd>
                  {metric.context ? (
                    <dd className={styles.metricContext}>{metric.context}</dd>
                  ) : null}
                </div>
              ))}
            </dl>
          </Container>
        </Section>
      ) : null}

      {project.testimonial ? (
        <Section labelledBy="said">
          <Container>
            <Heading level={2} id="said">
              What the client said
            </Heading>
            <TestimonialList testimonials={[project.testimonial]} columns={2} />
          </Container>
        </Section>
      ) : null}
    </main>
  );
}
