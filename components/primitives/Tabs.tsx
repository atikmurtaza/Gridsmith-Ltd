'use client';
// The only client component in this tier. A conformant tab widget needs roving tabindex
// and arrow-key selection (WAI-ARIA Tabs pattern) — there is no server-only or CSS-only
// construction that provides them. Everything else in tier 3 is a Server Component;
// where the platform had a native equivalent it was used instead (Accordion is
// <details>, Select is <select>, RadioGroup is a <fieldset> of radios).

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import styles from './interactive.module.css';

export type Tab = { id: string; label: string; panel: ReactNode };

export function Tabs({
  tabs,
  label,
  className,
}: {
  tabs: Tab[];
  /** Names the tablist for screen readers — a tablist with no name is an unlabelled group. */
  label: string;
  className?: string;
}) {
  const base = useId();
  const [selected, setSelected] = useState(0);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  /**
   * APG makes a tabpanel focusable only when it holds nothing else focusable. Setting
   * tabIndex unconditionally adds a tab stop in front of every panel's own controls.
   *
   * When it *is* focusable it carries `.focusable` too. `.tabpanel` sets padding and
   * nothing else, so this was a tab stop with no visible focus indicator (WCAG 2.4.7) —
   * the same defect Table's docstring claimed to have been the last of. The class is
   * applied unconditionally because `:focus-visible` cannot match on the renders where
   * tabIndex is undefined, which leaves no branch to keep in sync.
   */
  const [panelFocusable, setPanelFocusable] = useState(false);
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    setPanelFocusable(
      el.querySelector('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])') === null,
    );
  }, [selected]);

  const move = (to: number) => {
    const next = (to + tabs.length) % tabs.length;
    setSelected(next);
    refs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const keys: Record<string, () => void> = {
      ArrowRight: () => move(i + 1),
      ArrowLeft: () => move(i - 1),
      Home: () => move(0),
      End: () => move(tabs.length - 1),
    };
    const handler = keys[e.key];
    if (handler) {
      e.preventDefault();
      handler();
    }
  };

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className={styles.tablist}>
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${tab.id}`}
            aria-selected={i === selected}
            aria-controls={`${base}-panel-${tab.id}`}
            tabIndex={i === selected ? 0 : -1}
            onClick={() => setSelected(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={[styles.tab, i === selected ? styles.tabSelected : '', styles.focusable]
              .filter(Boolean)
              .join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          ref={i === selected ? panelRef : undefined}
          role="tabpanel"
          id={`${base}-panel-${tab.id}`}
          aria-labelledby={`${base}-tab-${tab.id}`}
          hidden={i !== selected}
          tabIndex={i === selected && panelFocusable ? 0 : undefined}
          className={`${styles.tabpanel} ${styles.focusable}`}
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
