import { EmptyState } from '@/components/primitives/EmptyState';
import { Numeric, Table } from '@/components/primitives/Table';
import styles from './master.module.css';

/**
 * The continuity example — `N-05`, and `DESIGN.md` §5 calls it "the single most important
 * component on `/approach`".
 *
 * Server Component. Zero client JS: it is a table of two columns.
 *
 * **A real `<table>`, not a two-column grid of divs.** Month 1 and Month N are the same rows
 * compared across time, which is what a table is for — and the comparison is the entire point,
 * so a screen reader user needs the row and column association a grid cannot give. The
 * `Table` primitive already carries the focusable scroll container and the required caption.
 *
 * **The later column reads from `relationshipMonths`.** `DESIGN.md` writes the shape as
 * "Month 1 / Month 18"; 18 is an illustration of the layout, not a constant, and hardcoding it
 * would state a duration nobody measured about a client nobody named.
 *
 * **Figures are monospace** — `Numeric` — which is the one convention that runs across all four
 * themes: monospace marks anything verifiable.
 *
 * ## It renders nothing rather than something plausible
 *
 * `verified` is hard-true in the schema, so **no seed continuity example can exist**: a
 * placeholder would have to claim it had been verified against real project records. `Q-M6` is
 * the blocker for a real one. Until then this returns an `EmptyState`, and `/approach` is built
 * to stand without it.
 *
 * `verified` is checked here as well as in the schema, and that is not redundancy. The schema
 * governs what an editor can save; this governs what a page can render. A document written
 * through the API, restored from a backup, or migrated from another dataset bypasses Studio
 * validation entirely — and this component is the last thing between such a document and a
 * commercial claim on the site.
 */
export type ContinuityRow = { label: string; monthOne: string; monthLater: string };

export type ContinuityExampleDoc = {
  clientDisplay: string;
  rows: ContinuityRow[];
  relationshipMonths: number;
  divisionsInvolved: string[];
  verified: boolean;
};

export function ContinuityExample({ example }: { example: ContinuityExampleDoc | null }) {
  if (!example || example.verified !== true || example.rows?.length < 4 || example.divisionsInvolved?.length < 2) {
    return (
      <EmptyState title="No verified continuity example yet">
        <p>
          This section carries a real client relationship, verified against project records. It
          stays empty until there is one to show.
        </p>
      </EmptyState>
    );
  }

  const { clientDisplay, rows, relationshipMonths, divisionsInvolved } = example;

  return (
    <div className={styles.continuity}>
      <p className={styles.continuityMeta}>
        {clientDisplay} · <Numeric>{divisionsInvolved.length}</Numeric> divisions ·{' '}
        <Numeric>{relationshipMonths}</Numeric> months
      </p>

      <Table caption={`How working with ${clientDisplay} changed between month 1 and month ${relationshipMonths}`}>
        <thead>
          <tr>
            {/* The corner cell labels nothing — the row headers below it do — so it is a
                `td`, not an empty `th`. axe reported `empty-table-header` on the first
                version, which is correct: a header with no text is a promise of a label that
                is not kept, and a screen reader announces it as a column with no name. */}
            <td />
            <th scope="col">
              Month <Numeric>1</Numeric>
            </th>
            <th scope="col">
              Month <Numeric>{relationshipMonths}</Numeric>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              {/* `scope="row"` is what makes the comparison readable: without it a screen
                  reader announces two cells with no idea what is being compared. */}
              <th scope="row">{row.label}</th>
              <td>{row.monthOne}</td>
              <td>{row.monthLater}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
