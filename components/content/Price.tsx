import { Badge } from '@/components/primitives/Badge';
import { Numeric } from '@/components/primitives/Numeric';
import type { PricingModel } from '@/lib/sanity/queries';
import styles from './content.module.css';

/**
 * A price line — CLAUDE.md non-negotiable #3 (*"never publish a service page without
 * pricing"*) rendered, and `FOUNDATION` §7.5 (*"every figure rendered with a visible
 * INDICATIVE badge and a footnote — no seed price may appear without it"*) enforced.
 *
 * ## The badge is not conditional on `isSeed`, and that is deliberate
 *
 * A reader has no access to `isSeed`. `FOUNDATION` §7.6 makes the point in full: the flag and
 * the visible marker do two different jobs and neither substitutes for the other. Every price
 * on this site is indicative until a scope is agreed — that is what §2.1 of the Terms of Use
 * says — so the badge is correct for real prices too, and a badge that appears only on seed
 * prices would teach a reader that an unbadged price is a quotation.
 *
 * ## Zero renders as `£0,000`
 *
 * `pricingBlock.fromAmount` is a **number**, so unlike `metric.value` it cannot carry a `[SEED]`
 * marker — the type is what it is because a price is arithmetic. `PROJECT-RULES.md` §5's
 * convention for a figure that asserts nothing is zeroed digits, and `£0,000` is both the
 * convention and unmistakable. `check:content` permits it for exactly this reason: a match whose
 * digits are all zero is the permitted placeholder form.
 *
 * Monospace, because the convention across all four themes is that **monospace marks anything
 * verifiable** — and a price is the most consequential verifiable thing on a service page.
 */
const money = (amount: number | null) => {
  if (amount === null || amount === undefined) return null;
  // Zeroed digits are the placeholder convention, not a formatting accident.
  if (amount === 0) return '£0,000';
  return `£${amount.toLocaleString('en-GB')}`;
};

const LEAD: Record<PricingModel['model'], string> = {
  fixed: 'Fixed price',
  from: 'From',
  range: 'Typically',
  retainer: 'Retainer from',
  'per-unit': 'From',
  'day-rate': 'Day rate from',
};

export function Price({ pricing }: { pricing: PricingModel | null }) {
  if (!pricing) return null;
  const from = money(pricing.fromAmount);
  const to = money(pricing.toAmount);
  if (!from) return null;

  return (
    <div className={styles.price}>
      <p className={styles.priceLine}>
        <span className={styles.priceLead}>{LEAD[pricing.model]}</span>{' '}
        <Numeric>
          {from}
          {pricing.model === 'range' && to ? ` – ${to}` : ''}
        </Numeric>
        {pricing.unit ? <span className={styles.priceUnit}> {pricing.unit}</span> : null}{' '}
        <Badge>INDICATIVE</Badge>
      </p>
      {pricing.variables && pricing.variables.length > 0 ? (
        <p className={styles.priceVariables}>
          What moves it: {pricing.variables.join(' · ')}
        </p>
      ) : null}
      {pricing.note ? <p className={styles.priceNote}>{pricing.note}</p> : null}
    </div>
  );
}
