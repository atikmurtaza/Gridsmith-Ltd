/**
 * The canonical six — `_shared/00-PROCESS.md` (`N-06`).
 *
 * **Premise check: this row carries no measured or projected figure.** The six stages are a
 * fixed business fact — that file's own header says *"FIXED — not a draft… not open for
 * revision, rewording or 'improvement' by a later session"* — and `R6` is cited there without
 * a number attached to it. The only quantity is *six*, which is a count of a thing, not a
 * measurement of one.
 *
 * ## One constant, and the stage names never travel through the CMS
 *
 * Rule 1 of that file is *"Stage names are fixed. Do not reword them per division."* The
 * strongest way to hold that is not to validate the names an editor typed — it is to **not
 * accept names from an editor at all.** The stages are a public statement of how the company
 * works; they are not content.
 *
 * So this constant is what renders, and the CMS supplies only what rule 3 says it should:
 * `divisionDetail`, `duration` and `clientTime`, keyed by stage. An editor cannot reword
 * "Consultation" because the word never comes from them. `processStep.title` keeps its
 * validator for the same reason `continuityExample.verified` is re-checked in its component —
 * the schema governs what can be saved, and a document can arrive through the API.
 *
 * Rule 2 — *"Stage 6 always carries the '(if applicable)' qualifier"* — is `optional: true`
 * here rather than a string appended at render time, so a caller cannot drop it by formatting
 * the title differently.
 */
export type CanonicalStage = {
  number: number;
  title: string;
  description: string;
  clientInvolvement: string;
  /** Stage 6 only. Presenting it as automatic would misrepresent the offer. */
  optional?: true;
};

export const CANONICAL_PROCESS: readonly CanonicalStage[] = [
  {
    number: 1,
    title: 'Consultation',
    description:
      'Understanding the business, project goals, target audience, and current digital presence',
    clientInvolvement: 'High — this is a conversation',
  },
  {
    number: 2,
    title: 'Planning & Scope',
    description:
      'Clear project scope, timeline, pricing structure and required deliverables prepared before work begins',
    clientInvolvement: 'Review and questions',
  },
  {
    number: 3,
    title: 'Approval & Start',
    description:
      'Work begins once scope is confirmed and the agreed initial payment is received',
    clientInvolvement: 'Approval + payment',
  },
  {
    number: 4,
    title: 'Design, Development & Updates',
    description:
      'The project is developed with regular updates, feedback opportunities and clear communication throughout',
    clientInvolvement: 'Ongoing — feedback at agreed points',
  },
  {
    number: 5,
    title: 'Delivery',
    description:
      'Final deliverables reviewed, completed and provided according to the agreed scope',
    clientInvolvement: 'Review and acceptance',
  },
  {
    number: 6,
    title: 'Support',
    description:
      'Ongoing support, maintenance, SEO improvements and digital assistance where required',
    clientInvolvement: 'Optional, ongoing',
    optional: true,
  },
];

export const CANONICAL_TITLES = CANONICAL_PROCESS.map((s) => s.title);

/** What a division may add per stage — rule 3. Never the name. */
export type StageDetail = {
  divisionDetail?: string;
  duration?: string;
  clientTime?: string;
};

/**
 * **The validator** (`N-06`).
 *
 * CMS detail arrives keyed by stage title. A key that is not one of the canonical six is a
 * division trying to add or rename a stage, and the honest response is to say so rather than
 * to drop it quietly — a silently ignored key looks to the editor like content that saved and
 * did not render, which is the hardest kind of bug to report.
 *
 * Rule 5 says client time is named at stages 1, 4 and 5 *where the division has that data*.
 * "Where available" is the operative clause, so a missing `clientTime` is not an error at any
 * stage; the component simply omits the line.
 */
export function validateStageDetail(detail: Record<string, StageDetail>): string[] {
  return Object.keys(detail)
    .filter((key) => !CANONICAL_TITLES.includes(key))
    .map(
      (key) =>
        `"${key}" is not one of the canonical six (see _shared/00-PROCESS.md). ` +
        'Divisions add divisionDetail per stage, never a stage.',
    );
}
