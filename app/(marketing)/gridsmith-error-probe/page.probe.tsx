'use client';
// Client Component because that is the only thing that can reach `app/global-error.tsx`.

import { useEffect, useState } from 'react';

/**
 * **A permanent gate subject. Do not delete this route.**
 *
 * `app/global-error.tsx` carries a Level A fix — `lang`, a `<title>`, one `<main>`, one
 * `<h1>` — made on 13 Aug because Next's built-in error document has none of them. The
 * run-3 audit found that **no gate in the repository referenced the file at all**:
 * `grep -rn "global-error" scripts/ .github/ lighthouse/` returned nothing. The fix had
 * been proven once with a temporary throwing route that was then deleted, so the only
 * surviving evidence of it was a docstring, and a regression was undetectable.
 *
 * CLAUDE.md now requires that a fix have a permanent committed subject for a gate to
 * reach. This route is that subject. `check-axe` requests it and audits whatever renders.
 *
 * **Why it throws in an effect rather than during render.** A throw after hydration is
 * the one path to this boundary that is *verified at runtime* — this route demonstrates it
 * every CI run. So: mount, set state in an effect, throw on the re-render.
 *
 * **The SSR path is unknown and must not be asserted either way.** This docstring used to
 * state that a throw during SSR never reaches the boundary and that production serves
 * Next's `__next_error__` shell. That claim was struck at `G5b` in `app/global-error.tsx`
 * and `_shared/05-HANDOVER.md` §2 — and survived here, in the file the same session
 * created, until A-GATE run 4 (`A-GATE-4-6`). It cannot be induced without editing a file,
 * no gate covers it, and CLAUDE.md does not permit asserting an unverified claim in either
 * direction.
 *
 * **Do not read this probe's success as covering it.** It exercises one of the two ways
 * this boundary can be reached. Establishing the other needs a route that throws during
 * render, `next build && next start`, and a read of the response.
 *
 * **Why the folder has no `_` prefix.** Next treats `_`-prefixed folders as private and
 * drops them from routing, so an `_`-prefixed probe silently serves the 404 instead and
 * you measure the wrong page. That trap is recorded in CLAUDE.md and cost a previous
 * session a round of debugging.
 *
 * This route must be excluded from the production build alongside `/_kitchen-sink` at
 * `A-12` — tracked there, not solved here.
 */
export default function ErrorProbe() {
  const [boom, setBoom] = useState(false);
  useEffect(() => setBoom(true), []);
  if (boom) throw new Error('gridsmith-error-probe: deliberate client-side throw, gate subject for global-error');
  return <p>Error probe. If you are reading this, the boundary did not engage.</p>;
}
