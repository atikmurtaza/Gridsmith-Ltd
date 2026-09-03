import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/primitives/Breadcrumb';
import { Button } from '@/components/primitives/Button';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Numeric } from '@/components/primitives/Numeric';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { Table } from '@/components/primitives/Table';
import { priceParts } from '@/components/content/Price';
import { listServices } from '@/lib/sanity/queries';
import styles from '@/components/divisions/digital/digital.module.css';

/**
 * `/digital/estimate` — the static pricing bands (`V-06`, `APP-FLOW.md` §7 *"Estimator, JS
 * disabled → static bands table"*, `TECH-SPEC.md` line 28's SSR shell).
 *
 * Server Component, zero client JS, statically generated. **This route is the no-JS half of
 * the estimator by definition, not by economy** — `V-07`'s island mounts above this table and
 * this table stays underneath it. So the JS delta this row spends is zero, and Digital's
 * ~80ms of LCP headroom is untouched: the page is one table and no image.
 *
 * ## Every figure here comes from the CMS, and none of it is this row's
 *
 * `Q-DG2` — *confirm base price bands per project type* — is open and assigned to Atik, and
 * `V-01`/`V-04`/`V-05` (the estimator config, ten historical projects, the calibration gate)
 * are all TODO. **There is therefore no measured band on this project.** This page does not
 * invent one: it renders `service.pricingModel`, the same records `U-08`'s service pages
 * already publish and the same records the schema makes `required`. On the seed dataset every
 * amount is `£0,000` with an `INDICATIVE` badge, which is `FOUNDATION` §7.6's convention and
 * `check:launch-content`'s subject — the page is honest today and correct the day real prices
 * land, with no edit here.
 *
 * ## Why a table and not cards
 *
 * `APP-FLOW.md` §7 names a table, and the reason is Marcus: *"the fastest cycle and lowest
 * value — give him a visible price band so he does not need the estimator"*. A buyer
 * comparing bands is comparing numbers across rows, which is what a `<table>` is for and what
 * a grid of cards makes harder for everyone and impossible with a screen reader.
 *
 * ## Services with no price do not render an empty row
 *
 * `pricingModel` is `required` in the schema, so a priceless service is a data fault rather
 * than a state. `U-08` answers it with `notFound()` because the page *is* the service; here
 * the page is the set, so the fault is dropped from the set rather than taking the whole
 * route down — and `bands.length === 0` renders the empty state instead of an empty table.
 */
export const metadata: Metadata = {
  title: 'What it costs — Gridsmith Digital',
  description:
    'Indicative price bands for every Gridsmith Digital service, readable without JavaScript.',
};

export default async function Page() {
  const services = await listServices('digital');
  const bands = services
    .map((s) => ({ service: s, price: priceParts(s.pricingModel) }))
    .filter((b): b is { service: (typeof services)[number]; price: NonNullable<ReturnType<typeof priceParts>> } =>
      b.price !== null,
    );

  return (
    <main id="main" tabIndex={-1}>
      <Section rhythm="loose">
        <Container>
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: '/digital', label: 'Digital' },
              { href: '/digital/estimate', label: 'What it costs' },
            ]}
          />
          <Heading level={1}>What it costs</Heading>
          <Prose>
            <p>
              Every Gridsmith Digital service and the band it starts from. These are indicative
              until a scope is agreed — the column beside each band says what moves it, because
              a price with no stated variables is a quote pretending to be a price.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section>
        <Container>
          {bands.length === 0 ? (
            <Prose>
              <p>
                No priced services are published yet. Tell us what you are building and we will
                scope it.
              </p>
            </Prose>
          ) : (
            <Table caption="Gridsmith Digital services, indicative price bands and what moves them">
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  <th scope="col">Band</th>
                  <th scope="col">What moves it</th>
                </tr>
              </thead>
              <tbody>
                {bands.map(({ service, price }) => (
                  <tr key={service.slug}>
                    <th scope="row">
                      <a href={`/digital/services/${service.slug}`}>{service.title}</a>
                    </th>
                    <td>
                      {price.lead}{' '}
                      {/* Monospace marks anything verifiable — the convention across all four
                          themes, and a price is the most consequential case of it. */}
                      <Numeric>{price.amount}</Numeric>
                      {price.unit ? ` ${price.unit}` : ''}
                    </td>
                    <td>{service.pricingModel?.variables?.join(' · ') ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Container>
      </Section>

      <Section rhythm="loose">
        <Container>
          <Prose>
            <p>
              None of these is a quotation. If your project does not sit inside a band, that is
              the normal case rather than a problem — tell us what you are building and we will
              scope it.
            </p>
          </Prose>
          <div className={styles.serviceCtas}>
            <Button href="/contact">Contact us for a scoped estimate</Button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
