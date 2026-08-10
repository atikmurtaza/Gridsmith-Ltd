import styles from './interactive.module.css';
import { FieldError } from './Field';

export type RadioOption = { value: string; label: string; hint?: string };

/**
 * A real <fieldset> with a <legend> — grouping radios any other way leaves a screen
 * reader user hearing four unrelated options with no question attached.
 *
 * Selection state comes from the native control, so it carries the platform's own
 * non-colour cue (the filled dot) rather than a colour swap we would have to justify.
 * `accent-color` tints it to the theme without replacing it.
 */
export function RadioGroup({
  name,
  legend,
  options,
  required = false,
  hint,
  error,
  defaultValue,
  className,
}: {
  name: string;
  legend: string;
  options: RadioOption[];
  required?: boolean;
  hint?: string;
  error?: string;
  defaultValue?: string;
  className?: string;
}) {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset
      className={[styles.fieldset, className].filter(Boolean).join(' ')}
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
    >
      <legend className={styles.legend}>
        {legend}
        {required ? <span className={styles.required} aria-hidden="true"> *</span> : null}
      </legend>

      {hint ? (
        <span className={styles.hint} id={hintId}>
          {hint}
        </span>
      ) : null}

      <div className={styles.options}>
        {options.map((o) => {
          const id = `${name}-${o.value}`;
          return (
            <div className={styles.option} key={o.value}>
              <input
                type="radio"
                id={id}
                name={name}
                value={o.value}
                required={required}
                defaultChecked={defaultValue === o.value}
                aria-describedby={o.hint ? `${id}-hint` : undefined}
                className={styles.focusable}
              />
              <label htmlFor={id} className={styles.optionLabel}>
                {o.label}
                {o.hint ? (
                  <span className={styles.optionHint} id={`${id}-hint`}>
                    {o.hint}
                  </span>
                ) : null}
              </label>
            </div>
          );
        })}
      </div>

      {error ? <FieldError id={errorId!}>{error}</FieldError> : null}
    </fieldset>
  );
}
