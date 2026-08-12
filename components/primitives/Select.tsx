import { useId } from 'react';
import styles from './interactive.module.css';
import { FieldError } from './Field';

export type SelectOption = { value: string; label: string };

/**
 * A native <select>. A custom listbox would be several kilobytes of JavaScript to
 * reimplement behaviour the platform already gets right on touch, with a keyboard and
 * with a screen reader — and Digital's delta budget is 15KB for everything.
 *
 * The DOM id is generated, never derived from `name` — see the note in Field.tsx.
 */
export function Select({
  name,
  label,
  options,
  required = false,
  hint,
  error,
  defaultValue,
  placeholder,
  className,
}: {
  name: string;
  label: string;
  options: SelectOption[];
  required?: boolean;
  hint?: string;
  error?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required ? <span className={styles.required} aria-hidden="true"> *</span> : null}
      </label>

      {hint ? (
        <span className={styles.hint} id={hintId}>
          {hint}
        </span>
      ) : null}

      <select
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ''}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={[styles.control, styles.focusable, error ? styles.controlInvalid : '']
          .filter(Boolean)
          .join(' ')}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {error ? <FieldError id={errorId!}>{error}</FieldError> : null}
    </div>
  );
}
