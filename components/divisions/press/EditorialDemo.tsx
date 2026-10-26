import type { ReactNode } from 'react';
import { Accepted, Del, EXAMPLE_LABEL, Ins, Interlinear, Query, S1_TAIL, S2, S2_LINE, S3 } from './passage';

/**
 * "Decided in the Margin" — the Editing chapter's signature interaction (C, refined in R1).
 *
 * Six genuinely different operations over one passage. Native radios switched by CSS `:has()`:
 * keyboard (arrow keys) and touch come from the platform and nothing needs JavaScript. Without
 * `:has()` every pass is shown in order as a static sequence.
 */
const PASSES = [
  { id: 'assess', verb: 'Assess', service: 'Manuscript critique' },
  { id: 'structure', verb: 'Structure', service: 'Developmental & structural' },
  { id: 'line', verb: 'Line', service: 'Line editing' },
  { id: 'copy', verb: 'Copy', service: 'Copyediting & mechanical' },
  { id: 'proof', verb: 'Proof', service: 'Proofreading' },
  { id: 'accept', verb: 'Accept', service: 'Recorded choice' },
] as const;

type PassId = (typeof PASSES)[number]['id'];

function Note({ term, children, gold }: { term: string; children: ReactNode; gold?: true }) {
  return (
    <div className={gold ? 'pr-note pr-note-gold' : 'pr-note'}>
      <dt>{term}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Pane({ id, title, rule, notes, children }: { id: PassId; title: string; rule: string; notes: ReactNode; children: ReactNode }) {
  const index = PASSES.findIndex((p) => p.id === id);
  return (
    <section className={`pr-pane pr-pane-${id}`} aria-labelledby={`pr-pane-${id}-title`}>
      <div className="pr-sheet">
        <p className="pr-sheet-head" aria-hidden="true">
          <span>Chapter 2 · Bring it in</span>
          <span>{PASSES[index].verb} pass</span>
        </p>
        {children}
      </div>
      <div className="pr-pane-margin">
        <h3 id={`pr-pane-${id}-title`} className="pr-pane-title">
          <span className="pr-pane-count">Pass {index + 1} of 6 · {PASSES[index].service}</span>
          {title}
        </h3>
        <p className="pr-pane-rule">{rule}</p>
        <dl className="pr-notes">{notes}</dl>
      </div>
    </section>
  );
}

export function EditorialDemo() {
  return (
    <div className="pr-demo">
      <fieldset className="pr-passes">
        <legend className="pr-passes-legend">Choose an editorial pass</legend>
        <div className="pr-passes-list">
          {PASSES.map((pass, index) => (
            <div className={`pr-pass pr-pass-${pass.id}`} key={pass.id}>
              <input type="radio" name="pr-pass" id={`pr-pass-${pass.id}`} value={pass.id} defaultChecked={index === 0} />
              <label htmlFor={`pr-pass-${pass.id}`}>
                <span className="pr-pass-n" aria-hidden="true">{index + 1}</span>
                <span className="pr-pass-verb">{pass.verb}</span>
                <span className="pr-pass-service">{pass.service}</span>
              </label>
            </div>
          ))}
        </div>
      </fieldset>

      <p className="pr-demo-label">{EXAMPLE_LABEL} Not every manuscript needs every pass.</p>

      <div className="pr-panes">
        <Pane
          id="assess"
          title="Assess the draft"
          rule="Identify its audience, purpose and main editorial questions. This is a diagnosis and recommendation, not a silent rewrite."
          notes={
            <>
              <Note term="What changed">Nothing in the text.</Note>
              <Note term="Query 1">Does “the item” speak to the person holding it?</Note>
              <Note term="Query 2">Is the reassurance lost inside the request?</Note>
              <Note term="Query 3">Should the reason come first? That depends on where it will be read.</Note>
            </>
          }
        >
          <p className="pr-passage">
            Bring the item<Query n={1} />
            {S1_TAIL} {S2}
            <Query n={2} /> {S3}
            <Query n={3} />
          </p>
        </Pane>

        <Pane
          id="structure"
          title="Decide the order"
          rule="The same facts, ordered for a practical page or for a reflective chapter. Each order helps the reader do something different."
          notes={
            <>
              <Note term="What changed">The order of the sentences. The words stay the same.</Note>
              <Note term="Practical">The request comes first, for a reader looking for what to do.</Note>
              <Note term="Reflective">The reason comes first, for a reader following the account.</Note>
              <Note term="Still a choice">Neither is right everywhere. This example continues with the practical order.</Note>
            </>
          }
        >
          <div className="pr-orders">
            <ol className="pr-order" aria-label="Practical order">
              <li><span className="pr-tag">A</span>Bring the item{S1_TAIL}</li>
              <li><span className="pr-tag">B</span>{S2}</li>
              <li><span className="pr-tag">C</span>{S3}</li>
            </ol>
            <ol className="pr-order pr-order-moved" aria-label="Reflective order">
              <li><span className="pr-tag">B</span>{S2}</li>
              <li><span className="pr-tag">C</span>{S3}</li>
              <li><span className="pr-tag">A</span>Bring the item{S1_TAIL}</li>
            </ol>
          </div>
        </Pane>

        <Pane
          id="line"
          title="Edit the expression"
          rule="Line editing changes how a sentence reads — its rhythm, tone and clarity — with the reason beside it. The original stays available."
          notes={
            <>
              <Note term="What changed">“the item” became “your item”; one long sentence became two.</Note>
              <Note term="Why">Speaking directly, and separating the reassurance from the request, makes each easier to take in.</Note>
            </>
          }
        >
          <p className="pr-passage pr-passage-marked">
            Bring <Interlinear from="the" to="your" /> item{S1_TAIL} <Del>{S2}</Del> <Ins>{S2_LINE}</Ins> {S3}
          </p>
        </Pane>

        <Pane
          id="copy"
          title="Check grammar, usage and consistency"
          rule="Copyediting applies an agreed style sheet. Mechanical points — spelling, hyphenation, punctuation — are corrected consistently. The meaning does not change."
          notes={
            <>
              <Note term="What changed">“work-shop” follows the style sheet as “workshop”; an unnecessary comma is removed.</Note>
              <Note term="Why">The same word should look the same on every page; the comma split one action in two.</Note>
            </>
          }
        >
          <p className="pr-passage pr-passage-marked">
            Bring your item to the <span className="pr-mark">work<Del label="deleted hyphen">-</Del>shop</span> and tell us what happened when it
            stopped working. {S2_LINE} We will look at it with you<span className="pr-mark"><Del label="deleted comma">,</Del></span> and explain what we
            can check next.
          </p>
        </Pane>

        <Pane
          id="proof"
          title="Check the final pages"
          rule="Proofreading catches genuine errors in the set pages. A preference in style or structure is not a proofreading mistake."
          notes={
            <>
              <Note term="What changed">A repeated word, “the the”, is removed.</Note>
              <Note term="Why">It is an error in any version, so correcting it does not reopen a choice.</Note>
            </>
          }
        >
          <p className="pr-passage pr-passage-set">
            Bring your item{S1_TAIL} Even a short description helps us prepare. You do not need to know what caused the{' '}
            <span className="pr-proof"><Del label="repeated word removed">the</Del></span> fault. {S3}
          </p>
        </Pane>

        <Pane
          id="accept"
          title="Record the chosen version"
          rule="This example shows a recorded editorial choice. In a real project, review and approval happen at the points agreed in the written scope."
          notes={
            <>
              <Note term="Recorded choice" gold>Practical order, the line edit, the style corrections and the proof correction.</Note>
              <Note term="Alternative kept">The reflective order remains a defensible choice for a chapter.</Note>
            </>
          }
        >
          <p className="pr-passage">
            Bring <Accepted>your item</Accepted>
            {S1_TAIL} <Accepted>{S2_LINE}</Accepted> {S3}
          </p>
        </Pane>
      </div>
    </div>
  );
}
