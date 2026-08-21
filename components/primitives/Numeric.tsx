import type { ReactNode } from 'react';
import styles from './content.module.css';

/**
 * Wrap any verifiable figure — price, date, dimension, revision, standard, ISBN — in
 * monospace. `CLAUDE.md`: *"monospace marks anything verifiable"*, the one convention that
 * runs across all four themes.
 *
 * **It lives in its own file because of what that co-location cost, measured.** It used to
 * sit in `Table.tsx`, which also imports `interactive.module.css` for the scroll region's
 * focus ring. Importing `Numeric` therefore imported that file too, and Next emits CSS per
 * module file. `N-01` block 5 uses `Numeric` for the stage numbers and no table at all: the
 * measured cost of the two-declaration `.numeric` rule was **+5,591 B of render-blocking
 * CSS** on `/`, the route with the least LCP headroom in the programme (`Q-M16`).
 *
 * This is the same mechanism block 3 identified — *the step is per CSS module file, not per
 * primitive* — arriving from the other direction. Block 3 found that reusing an already-open
 * file is free. This is what it costs when a trivial component is the reason a closed one
 * opens, and the fix is not to stop using `Numeric`: it is to stop it carrying luggage.
 * `Table` keeps both imports because it genuinely uses both.
 */
export function Numeric({ children }: { children: ReactNode }) {
  return <span className={styles.numeric}>{children}</span>;
}
