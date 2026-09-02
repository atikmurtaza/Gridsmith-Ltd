import { Card } from '@/components/primitives/Card';
import { EmptyState } from '@/components/primitives/EmptyState';
import { Heading } from '@/components/primitives/Heading';
import { Price } from '@/components/content/Price';
import type { ServiceCard } from '@/lib/sanity/queries';
import styles from './content.module.css';

/**
 * The services list on a division landing page.
 *
 * Server Component, zero client JS.
 *
 * **Every card carries its price**, because a service without one cannot be published at all —
 * `service.pricingModel` is `required` in the schema and `check:schemas` proves the rule runs.
 * The list renders the same fact at the summary level so that a visitor never has to open a page
 * to find out whether a number exists.
 *
 * ## `basePath` is opt-in per division, and that is the whole of the linking policy
 *
 * Per-service routes belong to each division's own shell epic (`B-*`, `U-*`, `P-*`), and only
 * Digital has one — `/digital/services/[slug]`, `U-08`. This component is shared by all three
 * landings, so a link hardcoded here would 404 on `/design` and `/press`; `check-axe` resolves
 * every same-origin link on every audited route, so it would fail the build rather than ship
 * quietly, which is the good outcome but still the wrong design. **The caller supplies the base
 * path or supplies nothing**, and a division with no service routes passes nothing and gets the
 * card it had before: the card is the service until then, which is why it carries the problem
 * statement and the price rather than a teaser.
 */
export function ServiceList({
  services,
  headingLevel = 3,
  basePath,
}: {
  services: ServiceCard[];
  headingLevel?: 2 | 3 | 4;
  /** e.g. `/digital/services`. Omit where the division has no per-service routes. */
  basePath?: string;
}) {
  if (services.length === 0) {
    return (
      <EmptyState title="No services listed yet" headingLevel={headingLevel}>
        <p>Tell us what you need and we will say whether it is something we do.</p>
      </EmptyState>
    );
  }

  return (
    <ul className={styles.serviceList}>
      {services.map((service) => (
        <Card as="li" key={service.slug} className={styles.serviceCard}>
          <Heading level={headingLevel} size="d4">
            {basePath ? (
              <a href={`${basePath}/${service.slug}`} className={styles.cardLink}>
                {service.title}
              </a>
            ) : (
              service.title
            )}
          </Heading>
          {service.problem ? <p className={styles.serviceProblem}>{service.problem}</p> : null}
          <Price pricing={service.pricingModel} />
        </Card>
      ))}
    </ul>
  );
}
