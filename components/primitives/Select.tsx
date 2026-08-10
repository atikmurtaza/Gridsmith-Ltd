import styles from './interactive.module.css';
import { FieldError } from './Field';

export type SelectOption = { value: string; label: string };

/**
 * A native <select>. A custom listbox would be several kilobytes of JavaScript to
 * reimplement behaviour the platform already gets right on touch, with a keyboard and
 * with a screen reader — and Digital's delta budget is 15KB for everything.
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
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

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

      <select
        id={name}
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
