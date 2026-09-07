import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/primitives/Breadcrumb';
import { Button } from '@/components/primitives/Button';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { Price } from '@/components/content/Price';
import { DataRows } from '@/components/divisions/digital/DataRow';
import { getService, listServiceSlugs } from '@/lib/sanity/queries';
import styles from '@/components/divisions/digital/digital.module.css';

/**
 * `/digital/services/[slug]` — the Digital service page template (`U-08`, FR-DG03, FR-DG11).
 *
 * Server Component, zero client JS, statically generated.
 *
 * ## Why this row and not another
 *
 * Every other open Epic U row is blocked on a route that does not exist. `U-05` needs the
 * estimator (`V-06`); `U-04`'s residual header needs four of them; `U-07` needs `U-06`; and
 * `U-06` looks unblocked but is not — five of `APP-FLOW.md` §3's eleven blocks already ship on
 * the shared landing page and all six absent ones belong to other rows. This template needs
 * only what `A-06` already built.
 *
 * ## The price is not optional and this file will not render without one
 *
 * CLAUDE.md non-negotiable #3: *"never publish a service page without pricing"*. The schema
 * makes `pricingModel` `required`, so the rule holds at the point of authoring. This adds the
 * second half — **it holds at the point of serving too**. A record reaching here without a
 * price is a fault in the data, and a page that renders around the gap publishes a service
 * page without pricing while looking, to a reader, entirely finished. `notFound()` is the
 * honest outcome: the route is missing rather than silently incomplete, and a missing route is
 * visible to `check-axe`'s resolve pass the moment anything links to it.
 *
 * ## Client time commitment is a first-class column, not a footnote
 *
 * `_shared/00-PROCESS.md` gives every canonical stage a `clientTime`, and `digital/PRD.md`
 * FR-DG12 is "ramp honesty". A buyer's real question about a fixed price is not what it costs
 * but **what it costs them in their own hours**, and that is the number most vendor sites omit.
 * It renders in the mono column because the convention across all four themes is that
 * monospace marks anything verifiable.
 *
 * ## Excluded deliverables render, they do not disappear
 *
 * `deliverable.included` is a boolean, and a `false` is content rather than an absence.
 * `APP-FLOW.md` §2's hard rule for the estimator — *"NOT INCLUDED is displayed with equal
 * prominence to the price"* — is the anti-vagueness move R6-Digital says buyers screen for, and
 * it applies here for the same reason. A filtered-out exclusion is indistinguishable from one
 * nobody thought of.
 *
 * ## The CTA is the one the record carries
 *
 * `APP-FLOW.md` §7 wants *Estimate this* on a service page, which is `V-06`'s route and does
 * not exist. `check-axe` resolves every same-origin link on every audited route, so shipping it
 * now fails the build. The seeded CTAs point at `/contact` and `/approach`, both real, and
 * `V-06` changes them — a whole template does not wait on the estimator.
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

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getService('digital', slug);
  // Both halves are one judgement: a service page exists only if it has a price.
  if (!service || !service.pricingModel) notFound();

  const included = service.deliverables?.filter((d) => d.included) ?? [];
  const excluded = service.deliverables?.filter((d) => !d.included) ?? [];
  const stages = service.process ?? [];

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
          <Heading level={1}>{service.title}</Heading>
          {service.problem ? (
            <Prose>
              <p>{service.problem}</p>
            </Prose>
          ) : null}
          <Price pricing={service.pricingModel} />
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
              How it runs, and what it costs you in hours
            </Heading>
            <Prose>
              <p>
                The six stages are the same on every Gridsmith engagement. The hours are yours,
                not ours — they are the part of a project a price does not tell you about.
              </p>
            </Prose>
            <DataRows
              label="Process stages, duration and your time"
              items={stages.map((s) => ({
                label: `${s.number}. ${s.title}`,
                // Both figures in the mono column, because both are the verifiable half.
                value: [s.duration, s.clientTime ? `you: ${s.clientTime}` : null]
                  .filter(Boolean)
                  .join('  ·  '),
                rationale: s.divisionDetail ?? s.description ?? undefined,
              }))}
            />
          </Container>
        </Section>
      ) : null}

      {service.ctaPrimary || service.ctaSecondary ? (
        <Section rhythm="loose">
          <Container>
            <div className={styles.serviceCtas}>
              {service.ctaPrimary ? (
                <Button href={service.ctaPrimary.href}>{service.ctaPrimary.label}</Button>
              ) : null}
              {service.ctaSecondary ? (
                <Button href={service.ctaSecondary.href} variant="secondary">
                  {service.ctaSecondary.label}
                </Button>
              ) : null}
            </div>
          </Container>
        </Section>
      ) : null}
    </main>
  );
}
