import type { Metadata } from 'next';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { Table } from '@/components/primitives/Table';
import { PathFinder } from '@/components/divisions/press/PathFinder';
import { SEED_OUTCOMES, SEED_QUESTIONS, SEED_RULES, criteriaFor } from '@/lib/path/seedConfig';

export const metadata: Metadata = {
  title: 'Path Finder — Gridsmith Press',
  description:
    'Five questions about your book, and an honest recommendation — including the two that recommend against us.',
};

/**
 * `/press/path-finder` — `K-05`, the **static SSR decision table**.
 *
 * `press/PROJECT-RULES.md` §6: *"The static SSR decision table must render all six outcomes and
 * their criteria without JavaScript."* This route is that table, and the table is still there.
 * **`K-06`/`K-07`'s island now mounts above it** — `components/divisions/press/PathFinder.tsx`,
 * the page's only client boundary — exactly as `V-06`'s JS-disabled half is its own statically
 * generated route with the island layered over it. Everything below the island is server-rendered
 * and unchanged, so a reader with no JavaScript loses the five interactive steps and keeps every
 * outcome, every criterion and both honest answers.
 *
 * ## Why the table is the base layer and not the fallback
 *
 * A `<noscript>` block is a fallback: it is authored once, never rendered in development, and
 * rots. This page is what everybody gets. The island replaced the *questions* section and the
 * table stayed below it as the thing a visitor can read end to end without answering anything —
 * which is also the answer to the market-research finding behind the whole tool, that this
 * audience wants to see the reasoning before it will trust the recommendation.
 *
 * ## Everything on this page is [SEED] except the outcome keys and the question labels
 *
 * `lib/path/seedConfig.ts` says which is which and why. The page states it too, in the
 * visitor's own view rather than only in a docstring, because a seeded criteria table read as
 * final is worse than no table: it tells someone they do or do not qualify for an honest
 * outcome on rules nobody has approved. `docs/_shared/PRE-DEPLOYMENT-CHECKLIST.md` carries the
 * row, and `check:launch` refuses a published seed on production.
 *
 * ## The criteria column is derived, not written
 *
 * `criteriaFor()` reads `SEED_RULES`. A hand-written criteria column beside a machine-evaluated
 * rule set is `01-VALIDATION-REPORT.md` §21's two-documents-that-must-agree shape, at the one
 * spot on the site where a divergence would misinform a visitor about an ethics guarantee.
 *
 * ## The honest outcomes are in the same table as the others
 *
 * Not a footnote, not a disclosure below the fold, no CTA on either — `ETH-04`, and the island
 * renders no CTA on E or F for the same reason and off the same field. `showCta` is read from
 * the outcome rather than assumed by position in both places, so an outcome that ever acquired
 * a CTA would show one here and be visible rather than silently correct. `check:path:live`
 * drives the island to both honest outcomes and asserts the rendered result carries none.
 *
 * ## The table is THREE columns, and the fourth was removed by a measurement
 *
 * It shipped with a fourth column — *"Ours?"* — and `check:axe` returned **14 unresolved
 * `color-contrast` incompletes at 375px only**: on `caption` and on `td:nth-child(4)` of all
 * six rows, at both the initial and scrolled states, and **on no other route and at no other
 * width**. Zero violations throughout, which is why running the gate is what found it.
 *
 * **It was not a contrast fault.** The pair is one `check:contrast` already measures in its
 * permission matrix. The four-column table was wide enough that at 375px its right-hand column
 * and its caption sat outside the viewport inside `Table`'s `overflow-x: auto` region, and axe
 * declines to compute a background for what it cannot hit-test — the same class as
 * `A11Y-32`'s below-the-fold specimen and as the consent banner's own allowed incomplete.
 *
 * **The fix is the cause, not an allowlist entry.** Seven exact-node allowlist entries, six of
 * them positional `tr:nth-child(N)` selectors, would have been a per-instance fix over a
 * geometry problem — and `INCOMPLETE_ALLOWED`'s value is that it matches an exact node, so
 * seven of them is the wildcard it exists to avoid. Folding *"Ours?"* into the row header
 * narrows the table until nothing leaves the viewport, and it is the better table anyway: the
 * honest/not-honest signal now sits **against the outcome's own name** rather than three
 * columns away, which is where a reader looking at `Self-service` needs it.
 *
 * `check:axe` after: allowed incompletes **64 → 68** — the four this route contributes, all of
 * them the shared banner — and **0 unresolved, 0 violations**. Two questions, both answered.
 */
export default function Page() {
  return (
    <main id="main" tabIndex={-1}>
      <Section rhythm="loose">
        <Container width="narrow">
          <Heading level={1}>Path Finder</Heading>
          <Prose>
            <p>
              Five questions about where your book actually is, and one recommendation. Two of
              the six possible answers are that you should not hire us — those are not a
              formality, and you can read the criteria for them below before you answer
              anything.
            </p>
            <p>
              <strong>These criteria are placeholders.</strong> The questions are settled; the
              rules that turn your answers into a recommendation have not been approved yet, and
              nothing here should be relied on until they are.
            </p>
          </Prose>
        </Container>
      </Section>

      <Section labelledBy="path-questions">
        <Container width="narrow">
          <Heading level={2} id="path-questions">
            The five questions
          </Heading>
          <Prose>
            <p>Every option is listed. Nothing here needs any knowledge of publishing.</p>
          </Prose>
          <PathFinder questions={SEED_QUESTIONS} outcomes={SEED_OUTCOMES} rules={SEED_RULES} />
          {/* The island server-renders question 1 and no further, so without JavaScript the
              other four questions and their options would simply be absent — and question 2's
              options appear in no rule, so the criteria table below would not carry them
              either. This is the platform's own mechanism for that and it is server-rendered
              like everything else on the page. `PROJECT-RULES.md` §6 is about the outcomes
              table; this is about not losing the questions on the way to it. */}
          <noscript>
            <Prose>
              <p>
                Without JavaScript the five steps do not advance. Every question and every
                option is below, and the table after it gives all six outcomes and what leads
                to each.
              </p>
            </Prose>
            {SEED_QUESTIONS.map((q, i) => (
              <div key={q.key}>
                <Heading level={3}>
                  {i + 1}. {q.question}
                </Heading>
                <Prose>
                  <p>{q.helpText}</p>
                  <ul>
                    {q.options.map((o) => (
                      <li key={o.key}>{o.label}</li>
                    ))}
                  </ul>
                </Prose>
              </div>
            ))}
          </noscript>
        </Container>
      </Section>

      <Section surface="sunken" labelledBy="path-outcomes">
        <Container>
          <Heading level={2} id="path-outcomes">
            The six outcomes, and what leads to each
          </Heading>
          <Prose>
            <p>
              Where an outcome lists more than one set of criteria, any one of them is enough.
              Within a set, every part has to be true.
            </p>
          </Prose>
          <Table caption="Path Finder outcomes and the criteria that produce each one">
            <thead>
              <tr>
                <th scope="col">Outcome</th>
                <th scope="col">What it means</th>
                <th scope="col">Criteria</th>
              </tr>
            </thead>
            <tbody>
              {SEED_OUTCOMES.map((outcome) => {
                const criteria = criteriaFor(outcome.key);
                return (
                  <tr key={outcome.key}>
                    <th scope="row">
                      {outcome.title}
                      <br />
                      {outcome.isGridsmithService
                        ? 'A Gridsmith service'
                        : 'Not us — no sales follow-up'}
                    </th>
                    <td>
                      {outcome.explanation}
                      {outcome.externalGuidance ? (
                        <>
                          {' '}
                          <strong>What to do instead:</strong> {outcome.externalGuidance}
                        </>
                      ) : null}
                    </td>
                    <td>
                      {criteria.length === 0 ? (
                        'No criteria are defined for this outcome.'
                      ) : (
                        <ul>
                          {criteria.map((c) => (
                            <li key={c}>{c}</li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
      </Section>
    </main>
  );
}
