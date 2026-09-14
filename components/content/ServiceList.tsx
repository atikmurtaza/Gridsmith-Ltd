import { Card } from '@/components/primitives/Card';
import { EmptyState } from '@/components/primitives/EmptyState';
import { Heading } from '@/components/primitives/Heading';
import { CAPABILITY_GROUPS } from '@/lib/services/architecture';
import type { ServiceCard } from '@/lib/sanity/queries';
import styles from './content.module.css';

/**
 * The services list on a division landing page, grouped by capability group (`GS-P03`).
 *
 * Server Component, zero client JS.
 *
 * ## Grouped by the architecture, never by the record
 *
 * Group names and their order come from `lib/services/architecture.ts`, not from the CMS, so a
 * division always presents its groups in the approved order and an editor cannot invent a
 * heading. A record with no recognised group is not dropped — content silently vanishing is the
 * worst CMS failure — it renders under "Other services", and if no record has a group at all the
 * list renders flat, which is what a dataset seeded before `GS-P03` looks like.
 *
 * **No price and no proof on the card.** `GS-D002` and `GS-D001`: the card is what the service
 * is, and the conversion is a contextual enquiry on the page or the landing's CTA.
 *
 * ## `basePath` is opt-in per division
 *
 * Only Digital has per-service routes (`U-08`). A link hardcoded here would 404 on `/design` and
 * `/press`, and `check-axe` resolves every same-origin link, so the caller supplies the base path
 * or nothing.
 */
export function ServiceList({
  services,
  headingLevel = 3,
  basePath,
}: {
  services: ServiceCard[];
  /** The level of the group headings. Cards sit one level below them. */
  headingLevel?: 2 | 3;
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

  const groups = CAPABILITY_GROUPS.map((group) => ({
    key: group.key,
    label: group.label,
    items: services.filter((s) => s.capabilityGroup === group.key),
  })).filter((group) => group.items.length > 0);
  const grouped = new Set(groups.flatMap((group) => group.items));
  const other = services.filter((s) => !grouped.has(s));

  if (groups.length === 0) {
    return <Cards services={other} headingLevel={headingLevel} basePath={basePath} />;
  }
  if (other.length > 0) groups.push({ key: 'other', label: 'Other services', items: other });

  return (
    <div className={styles.serviceGroups}>
      {groups.map((group) => (
        <div key={group.key} className={styles.serviceGroup}>
          <Heading level={headingLevel} size="d3">
            {group.label}
          </Heading>
          <Cards
            services={group.items}
            headingLevel={headingLevel === 2 ? 3 : 4}
            basePath={basePath}
          />
        </div>
      ))}
    </div>
  );
}

function Cards({
  services,
  headingLevel,
  basePath,
}: {
  services: ServiceCard[];
  headingLevel: 2 | 3 | 4;
  basePath?: string;
}) {
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
        </Card>
      ))}
    </ul>
  );
}
