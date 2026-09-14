import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/primitives/Breadcrumb';
import { Button } from '@/components/primitives/Button';
import { Container } from '@/components/primitives/Container';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Link } from '@/components/primitives/Link';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { Blocks } from '@/components/content/Blocks';
import { DataRows } from '@/components/divisions/digital/DataRow';
import {
  CAPABILITY_GROUPS,
  CONTACT_CTA,
  ENQUIRY_CTA,
  enquiryHref,
} from '@/lib/services/architecture';
import { getService, listServiceSlugs } from '@/lib/sanity/queries';
import styles from '@/components/divisions/digital/digital.module.css';

/**
 * `/digital/services/[slug]` — the Digital service page template (`U-08`, reconciled at `GS-P03`).
 *
 * Server Component, zero client JS, statically generated.
 *
 * ## A service page with no price is a complete page
 *
 * This template used to `notFound()` any record without a price, because non-negotiable #3 said a
 * service page could not be published without one. `GS-D002` superseded that: Gridsmith quotes
 * bespoke work, and the conversion is an enquiry that already knows which service it is about.
 * The page therefore renders from what a service *is* — its summary, description, deliverables,
 * exclusions, process and collaborators — and nothing on it is a figure.
 *
 * ## Excluded deliverables render, they do not disappear
 *
 * `deliverable.included` is a boolean, and a `false` is content rather than an absence. A
 * filtered-out exclusion is indistinguishable from one nobody thought of.
 *
 * ## The CTA carries context and its destination is not editable
 *
 * The label is the division default unless the record overrides it; the href is always the
 * enquiry form with `division` and `service` set (`lib/services/architecture.ts`), and the form
 * records both on the lead. The universal secondary route is plain contact.
 */
export async function generateStaticParams() {
  const slugs = await listServiceSlugs('digital');
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService('digital', slug);
  if (!service) return { title: 'Not found — Gridsmith Ltd' };
  return {
    title: service.metaTitle ?? `${service.title} — Gridsmith Digital`,
    description: service.metaDescription ?? service.problem ?? undefined,
  };
}

const DIVISION_NAMES = { design: 'Gridsmith Design', digital: 'Gridsmith Digital', press: 'Gridsmith Press' };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService('digital', slug);
  if (!service) notFound();

  const group = CAPABILITY_GROUPS.find((g) => g.key === service.capabilityGroup);
  const included = service.deliverables?.filter((d) => d.included) ?? [];
  const excluded = service.deliverables?.filter((d) => !d.included) ?? [];
  const stages = service.process ?? [];
  const collaborators = (service.collaborators ?? []).filter((d) => d !== service.division);
  const related = service.relatedServices ?? [];

  return (
    <main id="main" tabIndex={-1}>
      <Section rhythm="loose">
        <Container>
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: '/digital', label: 'Digital' },
              { href: `/digital/services/${service.slug}`, label: service.title },
            ]}
          />
          {group ? <Eyebrow>{group.label}</Eyebrow> : null}
          <Heading level={1}>{service.title}</Heading>
          {service.problem || service.description ? (
            <Prose>
              {service.problem ? <p>{service.problem}</p> : null}
              <Blocks value={service.description} />
            </Prose>
          ) : null}
        </Container>
      </Section>

      {included.length > 0 ? (
        <Section>
          <Container>
            <Heading level={2} id="included">
              What you get
            </Heading>
            <DataRows
              label="What you get"
              items={included.map((d) => ({
                label: d.label,
                value: 'Included',
                rationale: d.detail ?? undefined,
              }))}
            />
          </Container>
        </Section>
      ) : null}

      {excluded.length > 0 ? (
        <Section>
          <Container>
            <Heading level={2} id="not-included">
              What you do not get
            </Heading>
            <DataRows
              label="What you do not get"
              items={excluded.map((d) => ({
                label: d.label,
                value: 'Not included',
                rationale: d.detail ?? undefined,
              }))}
            />
          </Container>
        </Section>
      ) : null}

      {stages.length > 0 ? (
        <Section>
          <Container>
            <Heading level={2} id="process">
              How it runs, and what it asks of you
            </Heading>
            <Prose>
              <p>
                The six stages are the same on every Gridsmith engagement. Where your own time is
                listed, it is the part of a project that is worth knowing before it starts.
              </p>
            </Prose>
            <DataRows
              label="Process stages, duration and your time"
              items={stages.map((s) => ({
                label: `${s.number}. ${s.title}`,
                value: [s.duration, s.clientTime ? `you: ${s.clientTime}` : null]
                  .filter(Boolean)
                  .join('  ·  '),
                rationale: s.divisionDetail ?? s.description ?? undefined,
              }))}
            />
          </Container>
        </Section>
      ) : null}

      {collaborators.length > 0 || related.length > 0 ? (
        <Section labelledBy="related">
          <Container>
            <Heading level={2} id="related">
              Across Gridsmith
            </Heading>
            {collaborators.length > 0 ? (
              <Prose>
                <p>
                  This service draws on{' '}
                  {collaborators.map((d, i) => (
                    <span key={d}>
                      {i > 0 ? ' and ' : ''}
                      <Link href={`/${d}`}>{DIVISION_NAMES[d]}</Link>
                    </span>
                  ))}
                  . Your engagement stays with {DIVISION_NAMES[service.division]}.
                </p>
              </Prose>
            ) : null}
            {related.length > 0 ? (
              <ul className={styles.relatedList}>
                {related.map((r) => (
                  <li key={`${r.division}-${r.slug}`}>
                    <Link href={r.division === 'digital' ? `/digital/services/${r.slug}` : `/${r.division}`}>
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </Container>
        </Section>
      ) : null}

      <Section rhythm="loose">
        <Container>
          <div className={styles.serviceCtas}>
            <Button href={enquiryHref('digital', service.slug)}>
              {service.ctaLabel ?? ENQUIRY_CTA.digital}
            </Button>
            <Button href={CONTACT_CTA.href} variant="secondary">
              {CONTACT_CTA.label}
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
