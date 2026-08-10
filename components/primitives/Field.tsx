import type { ReactNode } from 'react';
import styles from './interactive.module.css';

/**
 * Uncontrolled by design — the forms are Server Actions + Zod, so there is no client
 * state to hold and this stays a Server Component (FOUNDATION §2).
 *
 * The error state carries three cues, not colour: a 2px border, `aria-invalid`, and a
 * visible message wired through `aria-describedby`. Colour changes nothing on its own
 * here, which is what WCAG 1.4.1 requires.
 */
export function Field({
  name,
  label,
  type = 'text',
  required = false,
  hint,
  error,
  defaultValue,
  autoComplete,
  multiline = false,
  className,
}: {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'number';
  required?: boolean;
  hint?: string;
  error?: string;
  defaultValue?: string;
  autoComplete?: string;
  multiline?: boolean;
  className?: string;
}) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const controlClass = [styles.control, styles.focusable, error ? styles.controlInvalid : '', multiline ? styles.textarea : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label className={styles.label} htmlFor={name}>
        {label}
        {required ? <span className={styles.required} aria-hidden="true"> *</span> : null}
      </label>

      {hint ? (
        <span className={styles.hint} id={hintId}>
          {hint}
        </span>
      ) : null}

      {multiline ? (
        <textarea
          id={name}
          name={name}
          required={required}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={controlClass}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          defaultValue={defaultValue}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={controlClass}
        />
      )}

      {error ? <FieldError id={errorId!}>{error}</FieldError> : null}
    </div>
  );
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <span className={styles.error} id={id}>
      <span className={styles.errorMark} aria-hidden="true">
        !
      </span>
      {children}
    </span>
  );
}
