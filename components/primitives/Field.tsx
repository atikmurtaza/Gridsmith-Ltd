import { useId, type ReactNode } from 'react';
import styles from './interactive.module.css';

/**
 * Uncontrolled by design — the forms are Server Actions + Zod, so there is no client
 * state to hold and this stays a Server Component (FOUNDATION §2).
 *
 * The error state carries three cues, not colour: a 2px border, `aria-invalid`, and a
 * visible message wired through `aria-describedby`. Colour changes nothing on its own
 * here, which is what WCAG 1.4.1 requires.
 *
 * **The DOM id is generated, never derived from `name`.** `id={name}` looks harmless and
 * is not: `name` is the form contract the Server Action reads, so two forms on one page
 * that both collect `email` — a contact form and a newsletter signup — are *required* to
 * share it, and sharing it produced two controls with the same id and a `<label for>`
 * bound to the wrong one. The only escape was mangling `name`, which changes what the
 * action receives. This was the root cause of the 80 duplicate ids on `/_kitchen-sink`;
 * that was fixed at the call site and left live here, which is the "fix the instance, not
 * the class" failure CLAUDE.md names. `useId()` is supported in Server Components
 * (React 19 Flight dispatcher) so this costs no client JavaScript.
 *
 * **`id` overrides the generated one, and that is deliberate.** Generating it internally
 * with no way out meant the id existed only inside this component: an error summary could
 * not render `<a href="#…">` to the field it names, and nothing could call `.focus()` on
 * the first invalid control (WCAG 3.3.1, and 2.4.3 for the focus move). `FieldError` was
 * already exported and already took an `id`, so the summary half of the pattern shipped
 * without the half it points at. The generated id remains the default — passing one is
 * for the case that needs a stable target, not the common case.
 *
 * Passing `id={name}` reintroduces exactly the collision described above. `check-axe`
 * asserts no duplicate ids on every audited route, which is what catches it.
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
  id: idOverride,
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
  /** Stable DOM id, so an error summary can link to this field. Generated when omitted. */
  id?: string;
}) {
  const generatedId = useId();
  const id = idOverride ?? generatedId;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const controlClass = [styles.control, styles.focusable, error ? styles.controlInvalid : '', multiline ? styles.textarea : '']
    .filter(Boolean)
    .join(' ');

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

      {multiline ? (
        <textarea
          id={id}
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
          id={id}
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
