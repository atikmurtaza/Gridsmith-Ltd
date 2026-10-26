import { HONEYPOT_FIELD } from '@/lib/leads/guard';

/**
 * The bot trap both lead forms carry (`lib/leads/guard.ts`). `hidden` takes the whole container
 * out of rendering, the tab order and the accessibility tree, and its input still submits — the
 * same property the Press flow's hidden steps rely on. No state, no effect, no client code.
 */
export function Honeypot() {
  return (
    <div hidden>
      <label>
        Leave this field empty
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
