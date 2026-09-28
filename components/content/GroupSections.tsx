import { Fragment, type ReactNode } from 'react';
import { Prose } from '@/components/primitives/Prose';
import { Blocks } from '@/components/content/Blocks';
import { ProcessRail } from '@/components/shared/ProcessRail';
import styles from '@/components/shared/shared.module.css';
import type { GroupSection } from '@/lib/sanity/queries';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Renders a `groupPage`'s sections — `/approach` (`N-04`) and `/about` (`N-07`), re-laid at
 * `GS-SHARED-001-B2` as numbered editorial rows on the sheet. Server Component, zero client JS.
 *
 * ## `layout` is a closed list, and this switch is why
 *
 * `N-03` closed `groupSection.layout` to five values and `check:schemas` proves the rule runs on
 * write. Every layout an editor can choose is a case below, so a saved section always renders:
 *
 * | layout | renders as |
 * |---|---|
 * | `prose`, `two-column` | a row: number and heading left, body right |
 * | `process` | a Master-frame band carrying the canonical six-stage rail |
 * | `continuity` | a row with the section's own honest copy and **no** empty-state card — B2 removed the visible "No verified continuity example yet" block; `ContinuityExample` still exists for the day `Q-M6` supplies a real one |
 * | `sunken-plain` | a plain row on the sunken surface. Deliberately undesigned (`master/SCHEMA.md` §2): polishing the limits would sell them |
 *
 * `start` numbers the first section (the opening is 01). `insert` places a page-owned band after
 * a section, taking the next number; `pair` sets two consecutive sections side by side, which is
 * the variation that keeps a page from being a stack of identical rows. Keys that are absent
 * simply do nothing, so a content edit cannot break either.
 */
export function GroupSections({
  sections,
  start = 2,
  insert = {},
  pair,
}: {
  sections: GroupSection[] | null;
  start?: number;
  insert?: Record<string, (number: string) => ReactNode>;
  pair?: [string, string];
}) {
  if (!sections || sections.length === 0) return null;

  let n = start;
  const out: ReactNode[] = [];

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const next = sections[i + 1];

    if (pair && section.key === pair[0] && next?.key === pair[1]) {
      const a = pad(n++);
      const b = pad(n++);
      out.push(
        <div key={`pair-${section.key}`} className={`${styles.pair} ${styles.wrap}`}>
          <PairItem section={section} number={a} />
          <PairItem section={next} number={b} />
        </div>,
      );
      i += 1;
      if (insert[next.key]) out.push(<Fragment key={`insert-${next.key}`}>{insert[next.key](pad(n++))}</Fragment>);
      continue;
    }

    const number = pad(n++);
    const headingId = `section-${section.key}`;

    if (section.layout === 'process') {
      out.push(
        <section key={section.key} className={`${styles.frame} ${styles.band}`} aria-labelledby={headingId}>
          <div className={styles.wrap}>
            <div className={styles.bandHead}>
              <div>
                <p className={styles.index}>{number}</p>
                <h2 id={headingId} className={styles.rowTitle}>{section.heading}</h2>
              </div>
              <div className={styles.rowBody}>
                <Prose>
                  <Blocks value={section.body} />
                </Prose>
              </div>
            </div>
            <ProcessRail />
          </div>
        </section>,
      );
    } else {
      const row = (
        <section
          key={section.key}
          className={`${styles.row} ${styles.wrap} ${section.layout === 'sunken-plain' ? styles.plain : ''}`}
          aria-labelledby={headingId}
        >
          <div>
            <p className={styles.index}>{number}</p>
            <h2 id={headingId} className={styles.rowTitle}>{section.heading}</h2>
          </div>
          <div className={styles.rowBody}>
            <Prose>
              <Blocks value={section.body} />
            </Prose>
          </div>
        </section>
      );
      out.push(
        section.layout === 'sunken-plain' ? (
          <div key={section.key} className={styles.sunken}>{row}</div>
        ) : (
          row
        ),
      );
    }

    if (insert[section.key]) out.push(<Fragment key={`insert-${section.key}`}>{insert[section.key](pad(n++))}</Fragment>);
  }

  return <>{out}</>;
}

function PairItem({ section, number }: { section: GroupSection; number: string }) {
  const headingId = `section-${section.key}`;
  return (
    <section aria-labelledby={headingId}>
      <p className={styles.index}>{number}</p>
      <h2 id={headingId} className={styles.rowTitle}>{section.heading}</h2>
      <div className={styles.rowBody}>
        <Prose>
          <Blocks value={section.body} />
        </Prose>
      </div>
    </section>
  );
}
