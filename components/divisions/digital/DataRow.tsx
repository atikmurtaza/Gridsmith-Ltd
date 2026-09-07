import styles from './digital.module.css';

/**
 * `U-03` — the data row, Digital's dominant content pattern.
 *
 * `digital/DESIGN.md` §4: *"Mono label · mono value · body rationale"*, and §"Layout" —
 * *"frequent use of two-column definition layouts: mono label left, prose right. This is the
 * dominant content pattern and should feel like reading good documentation."*
 *
 * ## It lives here rather than in `components/primitives/`
 *
 * The spec names four consumers — the stack page (`T-02`), pricing tables, the estimator
 * breakdown (`V-09`) and the ownership guarantee (`T-03`) — and every one of them is Digital.
 * No other division's `DESIGN.md` asks for this pattern. Putting it in `primitives/` today
 * would claim a generality nothing has demonstrated, and `primitives/` is the directory whose
 * every change needs review because it reaches all four route groups. Promoting it later, if a
 * second division genuinely wants it, is a small refactor made at the point where sharing is a
 * fact rather than a guess.
 *
 * ## It is a `<dl>`, not a table
 *
 * Label-to-value is a description list, and the spec's own words are "should feel like reading
 * good documentation". A `<div>` grouping wrapper inside `<dl>` is valid HTML5 and is what lets
 * one row own its three cells for the grid. A `<table>` would assert a two-dimensional
 * relationship that does not exist here — there is no column heading a value belongs under.
 *
 * ## No selected state, deliberately
 *
 * `DESIGN.md` §5 gives a selected state to the **estimator option** (`V-08`), not to the data
 * row, so there is none here to build. The three-cue rule that state must satisfy is now
 * enforced repository-wide by `scripts/check-state-cues.mjs` rather than left to whoever
 * writes it.
 *
 * Server Component. No client JavaScript — Digital carries the tightest budget in the
 * programme and a static list has no reason to cost any.
 */
export type DataRowItem = {
  /** The mono label, left. Short — it is a name, not a sentence. */
  label: string;
  /** The mono value, middle. The verifiable thing: a version, a price, a stack name. */
  value: string;
  /** Optional body prose, right. Why the value is what it is. */
  rationale?: string;
};

export function DataRows({ items, label }: { items: DataRowItem[]; label?: string }) {
  if (items.length === 0) return null;

  return (
    <dl className={styles.dataRows} aria-label={label}>
      {items.map((item) => (
        <div key={item.label} className={styles.dataRow}>
          <dt className={styles.dataLabel}>{item.label}</dt>
          <dd className={styles.dataValue}>{item.value}</dd>
          {item.rationale ? <dd className={styles.dataRationale}>{item.rationale}</dd> : null}
        </div>
      ))}
    </dl>
  );
}
