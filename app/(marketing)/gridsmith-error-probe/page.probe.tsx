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
 * **The SSR path was unknown and now is not.** This docstring used to state that a throw
 * during SSR never reaches the boundary and that production serves Next's `__next_error__`
 * shell; the claim was struck at `G5b` as unverified. **At `M-07` it was verified, and it
 * was right.** The subject is the sibling route
 * `app/(marketing)/gridsmith-ssr-throw-probe/page.probe.tsx` — `force-dynamic`, throws
 * during server render — and `check-axe` reads its response every run.
 *
 * The original wording was struck correctly even though it turned out to be true: it was
 * asserted without evidence, and being right by luck is not the same as being verified.
 *
 * **This probe still covers only the client path.** The two are separate subjects because
 * they are separate render paths.
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
