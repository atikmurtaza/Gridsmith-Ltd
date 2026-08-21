import { useId } from 'react';
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
 *
 * Every DOM id is generated — see the note in Field.tsx. `name` is deliberately NOT:
 * on a radio it is both the form contract the Server Action reads *and* the thing that
 * makes the options one group, so generating it would silently break both. Two
 * RadioGroups sharing a `name` really are one group; that is a page-level decision, and
 * `check-axe` asserts no radio group spans more than one theme frame.
 *
 * `id` overrides the generated base — see the note in Field.tsx for why the override
 * exists. A radio group has no single control to link to, so an error summary targets the
 * first option, whose id is `${id}-${options[0].value}` and is only predictable to the
 * caller once the base is. That is the whole reason this prop is the base rather than an
 * id applied to the fieldset.
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
  id: idOverride,
}: {
  name: string;
  legend: string;
  options: RadioOption[];
  required?: boolean;
  hint?: string;
  error?: string;
  defaultValue?: string;
  className?: string;
  /** Stable id base; the first option becomes `${id}-${options[0].value}`. Generated when omitted. */
  id?: string;
}) {
  const generatedId = useId();
  const uid = idOverride ?? generatedId;
  const hintId = hint ? `${uid}-hint` : undefined;
  const errorId = error ? `${uid}-error` : undefined;
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
          const id = `${uid}-${o.value}`;
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
