import type { Metadata } from 'next';
import { Accordion } from '@/components/primitives/Accordion';
import { Badge } from '@/components/primitives/Badge';
import { Breadcrumb } from '@/components/primitives/Breadcrumb';
import { Button } from '@/components/primitives/Button';
import { Card } from '@/components/primitives/Card';
import { Container } from '@/components/primitives/Container';
import { EmptyState } from '@/components/primitives/EmptyState';
import { ErrorState } from '@/components/primitives/ErrorState';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Field } from '@/components/primitives/Field';
import { Grid } from '@/components/primitives/Grid';
import { ContinuityExample } from '@/components/master/ContinuityExample';
import { Heading } from '@/components/primitives/Heading';
import { Link } from '@/components/primitives/Link';
import { Pagination } from '@/components/primitives/Pagination';
import { Prose } from '@/components/primitives/Prose';
import { RadioGroup } from '@/components/primitives/RadioGroup';
import { RevealOnScroll } from '@/components/primitives/RevealOnScroll';
import { Section } from '@/components/primitives/Section';
import { Select } from '@/components/primitives/Select';
import { Stepper } from '@/components/primitives/Stepper';
import { StickyCta } from '@/components/primitives/StickyCta';
import { Numeric, Table } from '@/components/primitives/Table';
import { Tabs } from '@/components/primitives/Tabs';
import styles from './kitchen-sink.module.css';

/**
 * A-05a. Every primitive, every state, in one place — and rendered four times, once per
 * theme, because a primitive is only correct if it is correct in all four.
 *
 * The four theme frames set `data-division` on a wrapper rather than on <body>. That is
 * the one place in the codebase permitted to do so, and only because comparing themes
 * side by side is the whole point of the route. Nothing here is a pattern to copy: in
 * the application, `data-division` is set once per route group, server-side, on <body>.
 *
 * The directory is named `%5Fkitchen-sink`, not `_kitchen-sink`. Next treats a leading
 * underscore as a private folder and excludes it from routing entirely, so the obvious
 * spelling produces no route at all; `%5F` is the documented escape that yields the
 * `/_kitchen-sink` URL the specs name. The leading underscore is the point — it should
 * not read as a public URL.
 *
 * Carries `noindex` and is linked from nowhere. Excluding it from the production build
 * belongs with the other production gating at A-12.
 *
 * Media is the one primitive not shown: it renders next/image against real assets, and
 * fabricating placeholder imagery here would put invented visual content in the repo
 * (CLAUDE.md non-negotiable #2). It is exercised at D-01 with real seed assets.
 */
export const metadata: Metadata = {
  title: 'Kitchen sink',
  robots: { index: false, follow: false },
};

const DIVISIONS = ['master', 'design', 'digital', 'press'] as const;

/**
 * Rendering the same specimen four times with the same literals produced 20 duplicated
 * ids × 4, one radio group spanning all four frames (choosing in Digital cleared Master,
 * and only the last of four `checked` radios survived), and one exclusive `<details>`
 * group across all four frames, so three of the four themes rendered their accordion
 * closed. axe reported zero violations throughout: axe-core keeps `duplicate-id` behind
 * its `deprecated` tag, so no WCAG tag set can reach it. `check-axe` asserts it directly
 * against the served DOM instead.
 *
 * That was first fixed here, by scoping every id and name to its frame — which left the
 * primitives still generating colliding ids for every other caller. The fix is now in the
 * primitives: `Field`, `Select`, `RadioGroup` and `Accordion` derive their DOM ids from
 * `useId()`, and `Accordion` generates its own exclusive-group name. This page no longer
 * scopes anything, and `check-axe` still reports zero duplicate ids — which is the test
 * of whether the primitive fix is real.
 *
 * `name` on a radio is the one exception and it stays scoped. It is simultaneously the
 * form contract a Server Action reads and the attribute that makes the options one group,
 * so a primitive cannot generate it without breaking submission. Four frames sharing
 * `name="division"` genuinely ARE one radio group; that is a fact about this page
 * rendering the same form four times, not a defect in RadioGroup.
 */
const frameScoped = (division: string, name: string) => `${division}-${name}`;

const FAQS = [
  { key: 'a1', question: 'A question that is open by default', answer: 'The answer, in muted body copy.' },
  { key: 'a2', question: 'A second question', answer: 'Native details/summary — no JavaScript.' },
  { key: 'a3', question: 'A third question', answer: 'Keyboard operable because the browser makes it so.' },
];

const STEPS = [
  { id: 's1', title: 'Consultation' },
  { id: 's2', title: 'Planning & Scope' },
  { id: 's3', title: 'Approval & Start' },
  { id: 's4', title: 'Design, Development & Updates' },
  { id: 's5', title: 'Delivery' },
  { id: 's6', title: 'Support' },
];

/**
 * The specimen name is an `<h3>`, not a `<p>` — WCAG 1.3.1, F2.
 *
 * It was a `<p>`, and it is the heading of every one of the 23 specimen blocks in each of
 * the four theme frames: the only way to reach a named specimen by heading navigation.
 * The document went h1 -> 4x h2 -> nothing. Third instance of the A11Y-2 class, on the
 * page built to exercise the primitives, found by the run-3 audit.
 *
 * h3 because the page h1 is the title and each theme frame owns an h2. Specimen contents
 * render their own h3/h4 demos, which sit as siblings or below — axe `heading-order` is
 * satisfied and stays asserted across all 24 analyses.
 *
 * `check:headings` does NOT catch this one, and that is worth knowing rather than
 * assuming: it identifies a pseudo-heading by the display face, and `.specimenName` is
 * mono uppercase — visually identical to `Eyebrow`, which is correctly not a heading.
 * No static rule separates those two; only the structural judgement does. See the gate's
 * docstring.
 */
function Specimen({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className={styles.specimen}>
      <h3 className={styles.specimenName}>{name}</h3>
      <div className={styles.specimenBody}>{children}</div>
    </div>
  );
}

function AllPrimitives({ division }: { division: string }) {
  return (
    <>
      {/* All four sizes at one level. The page already has its h1 and each frame its h2,
          so the specimen sits at h3 — Heading separates level from size precisely so a
          large heading does not have to be a high one, and this is that demonstration.
          Four <h1>s inside four frames under an <h2> was the previous shape. */}
      <Specimen name="Heading × 4 sizes at one level · Eyebrow">
        <Eyebrow>Eyebrow — mono, uppercase</Eyebrow>
        <Heading level={3} size="display">Display size</Heading>
        <Heading level={3} size="d2">d2 size</Heading>
        <Heading level={3} size="d3">d3 size</Heading>
        <Heading level={3} size="d4">d4 size</Heading>
      </Specimen>

      <Specimen name="Prose">
        <Prose>
          <p>
            Body copy at the default measure. Monospace marks anything verifiable, like{' '}
            <code>REV-00</code>. An <a href="#main">inline link</a> sits in the accent.
          </p>
          <ul>
            <li>First item</li>
            <li>Second item</li>
          </ul>
          <blockquote>A quotation, set against a hairline rule.</blockquote>
        </Prose>
      </Specimen>

      <Specimen name="Container · Grid · Section">
        <Grid>
          <div style={{ gridColumn: 'span 2' }}><Badge>2 cols</Badge></div>
          <div style={{ gridColumn: 'span 2' }}><Badge>2 cols</Badge></div>
        </Grid>
      </Specimen>

      <Specimen name="Button — primary, secondary, disabled, as link">
        <div className={styles.row}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button disabled>Disabled</Button>
          <Button href="#main" variant="secondary">Link button</Button>
        </div>
      </Specimen>

      <Specimen name="Link — accent, quiet, external">
        <div className={styles.row}>
          <Link href="#main">Accent link</Link>
          <Link href="#main" tone="quiet">Quiet link</Link>
          <Link href="https://example.com" external>External link</Link>
        </div>
      </Specimen>

      <Specimen name="Badge — default, accent">
        <div className={styles.row}>
          <Badge>Default</Badge>
          <Badge tone="accent">Accent border</Badge>
        </div>
      </Specimen>

      <Specimen name="Card — canvas, raised, linked">
        <Grid>
          <div style={{ gridColumn: 'span 4' }}>
            <Card><Heading level={4}>Card</Heading><p>On canvas.</p></Card>
          </div>
          <div style={{ gridColumn: 'span 4' }}>
            <Card surface="raised"><Heading level={4}>Raised</Heading><p>On canvas-raised.</p></Card>
          </div>
          <div style={{ gridColumn: 'span 4' }}>
            <Card linked>
              <Heading level={4}><Link href="#main" tone="quiet">Linked card</Link></Heading>
              <p>Whole card is the target; focus lands on the link.</p>
            </Card>
          </div>
        </Grid>
      </Specimen>

      {/* **This specimen is a gate subject, not a demonstration. Do not delete it.**
          A11Y-4: the title link's `::after` overlay is `position: absolute; inset: 0`, so
          it paints over every non-positioned interactive sibling in the card. The fix
          lifts those siblings to `z-index: 1`. That fix was proven by injecting a sibling
          link at runtime — and the injection was thrown away, leaving the working half of
          the selector matching nothing on the only page CI renders. Deleting the rule
          outright would have left every gate green (A11Y-26).
          CLAUDE.md now requires a permanent committed subject for a gate to reach. This
          is it: a title link plus a second link, a button, and a checkbox, which is the
          shape press/DESIGN.md §5:100 describes for a book card with retailer links.
          If you remove this, A11Y-4 stops being gated. */}
      <Specimen name="Card linked — second link, button and input under the title overlay">
        <Grid>
          <div style={{ gridColumn: 'span 6' }}>
            <Card linked>
              <Heading level={4}><Link href="#main" tone="quiet">Book title as the card link</Link></Heading>
              <p>The overlay covers the card. Everything below must stay clickable.</p>
              <div className={styles.row}>
                <Link href="#main">Retailer link</Link>
                <Button variant="secondary">Sample chapter</Button>
                <label>
                  <input type="checkbox" name="ks-compare" /> Compare
                </label>
              </div>
            </Card>
          </div>
        </Grid>
      </Specimen>

      <Specimen name="Table — sticky header, numeric cells">
        <Table caption={`Specimen table (${division})`}>
          <thead>
            <tr><th scope="col">Item</th><th scope="col">Revision</th><th scope="col">Price</th></tr>
          </thead>
          <tbody>
            {/* Zeroed digits, not plausible figures. `£1,250` / `£980` / `REV-02` were
                fabricated prices and revision numbers rendered into prerendered HTML —
                CLAUDE.md non-negotiable #2 bans invented prices outright, and
                master/PROJECT-RULES.md §5 says "never a plausible figure". This file
                already applied that rule correctly to imagery (Media is excluded) and to
                the error reference (`KS-0000`), then broke it two specimens above. Zeroed
                digits demonstrate the monospace treatment and tabular alignment without
                asserting anything. */}
            <tr><th scope="row">First row</th><td><Numeric>REV-00</Numeric></td><td><Numeric>£0,000</Numeric></td></tr>
            <tr><th scope="row">Second row</th><td><Numeric>REV-00</Numeric></td><td><Numeric>£000</Numeric></td></tr>
          </tbody>
        </Table>
      </Specimen>

      <Specimen name="Breadcrumb · Pagination">
        <Breadcrumb label={`Breadcrumb (${division})`} items={[{ label: 'Home', href: '/' }, { label: 'Design', href: '/design' }, { label: 'Current page' }]} />
        <Pagination label={`Pagination (${division})`} current={3} total={9} hrefFor={(p) => `?page=${p}`} />
      </Specimen>

      <Specimen name="Field — default, hint, error, textarea">
        <Field name="name" label="Full name" required autoComplete="name" />
        {/* Not the response commitment. This read "We reply by the end of the next business
            day." — a hardcoded paraphrase of it, and master/PROJECT-RULES.md §1.8 says that
            string renders from `companyDetails.responseCommitment`, "never hardcoded, never
            paraphrased". `lib/company/` does not exist yet (A-07), so the specimen needs a
            hint that is not a promise at all rather than a copy someone will paste into the
            first real contact form. */}
        <Field name="email" label="Email" type="email" hint="Used only to reply to this enquiry." />
        <Field name="broken" label="Field with an error" error="Enter a valid email address." />
        <Field name="message" label="Message" multiline />
      </Specimen>

      <Specimen name="Select — placeholder, error">
        {/* Zeroed, like every other figure on this page. These read as real budget bands
            and asserted a price structure nobody has agreed — non-negotiable #2 — and
            they contradicted the only bands defined anywhere in the repo
            (press/APP-FLOW.md §128). A Select specimen needs option shapes, not
            commercial claims. Third instance of this class in this one file; the gate
            that now catches it is scripts/check-invented-content.mjs. */}
        <Select
          name="budget"
          label="Budget band"
          placeholder="Select a band"
          options={[{ value: 'a', label: 'Under £0,000' }, { value: 'b', label: '£0,000 – £00,000' }]}
        />
        <Select
          name="broken-select"
          label="Select with an error"
          error="Choose one option."
          options={[{ value: 'a', label: 'Option A' }]}
        />
      </Specimen>

      <Specimen name="RadioGroup — with hints, and an error">
        <RadioGroup
          name={frameScoped(division, 'division')}
          legend="Which division do you need?"
          hint="More than one is a first-class answer."
          defaultValue="unsure"
          options={[
            { value: 'design', label: 'Design', hint: 'Brand, visual, CAD, drawings' },
            { value: 'more', label: 'More than one' },
            { value: 'unsure', label: 'Not sure yet' },
          ]}
        />
        <RadioGroup
          name={frameScoped(division, 'radio-error')}
          legend="Group with an error"
          error="Select one option."
          options={[{ value: 'y', label: 'Yes' }, { value: 'n', label: 'No' }]}
        />
      </Specimen>

      <Specimen name="Accordion — native details, one open">
        <Accordion items={FAQS.map((f) => ({ ...f, id: f.key }))} exclusive defaultOpenId="a1" />
      </Specimen>

      <Specimen name="Tabs — arrow keys, roving tabindex">
        <Tabs
          label={`Specimen tabs (${division})`}
          tabs={[
            { id: 't1', label: 'First', panel: <p>First panel.</p> },
            { id: 't2', label: 'Second', panel: <p>Second panel.</p> },
            { id: 't3', label: 'Third', panel: <p>Third panel.</p> },
          ]}
        />
      </Specimen>

      <Specimen name="Stepper — canonical six, step 3 current">
        <Stepper steps={STEPS} current={3} label={`Specimen process (${division})`} />
      </Specimen>

      <Specimen name="EmptyState">
        <EmptyState title="No results for these filters" actions={<Button variant="secondary" href="#main">Clear filters</Button>}>
          <p>Nothing matched. Widening the discipline filter usually helps.</p>
        </EmptyState>
      </Specimen>

      <Specimen name="ErrorState">
        <ErrorState
          title="That did not send"
          reference="KS-0000"
          announce={false}
          actions={<Button href="#main">Try again</Button>}
        >
          <p>Something failed on our side. Nothing you entered has been lost.</p>
        </ErrorState>
      </Specimen>

      <Specimen name="RevealOnScroll">
        <RevealOnScroll>
          <Card><p>Fades and lifts once, on first intersection.</p></Card>
        </RevealOnScroll>
      </Specimen>

      {/* StickyCta was rendered once, outside the theme frames, so it only ever appeared
          in master — its colours were unverified on Design's near-black canvas and axe
          never evaluated it in three of four themes. Four `position: fixed` bars would
          stack on top of each other, so the specimen is pinned in flow; the live fixed
          instance at the foot of the page still demonstrates the real behaviour. */}
      <Specimen name="StickyCta — in flow here; the live fixed bar is at the foot of the page">
        <StickyCta label={`Specimen sticky call to action (${division})`} className={styles.stickyStatic}>
          <Button href="#main">Primary action</Button>
          <Button href="#main" variant="secondary">Secondary</Button>
        </StickyCta>
      </Specimen>
    </>
  );
}

export default function KitchenSinkPage() {
  return (
    <main id="main" tabIndex={-1}>
      <Container>
        <Section rhythm="tight">
          <Eyebrow>A-05a</Eyebrow>
          <Heading level={1} size="d2">Kitchen sink</Heading>
          <Prose>
            <p>
              23 of the 24 primitives, rendered once per theme. <code>Media</code> is not
              shown: it renders real assets, and fabricating placeholder imagery here would
              put invented visual content in the repository. It is exercised at D-01. Not
              linked from anywhere and <code>noindex</code>.
            </p>
          </Prose>
        </Section>
      </Container>

      {DIVISIONS.map((division) => (
        <div key={division} data-division={division} className={styles.frame}>
          <Container>
            <Section rhythm="tight">
              <h2 className={styles.frameTitle}>{division}</h2>
              <div className={styles.stack}>
                <AllPrimitives division={division} />
              </div>
            </Section>
          </Container>
        </div>
      ))}

      <Container>
        <Section rhythm="tight">
          {/* `N-05`. Not a primitive — a master-layer composed component — and it is here
              because this is the only page a gate can measure it on until `/approach` exists
              at `N-04`. Both states are rendered: the empty one is what the site shows today,
              since `verified` is hard-true and no real example exists (`Q-M6`). */}
          <Specimen name="ContinuityExample — empty (no verified example)">
            <ContinuityExample example={null} />
          </Specimen>
          <Specimen name="ContinuityExample — populated">
            <ContinuityExample
              example={{
                clientDisplay: '[SEED] A UK M&E contractor',
                relationshipMonths: 0,
                divisionsInvolved: ['design', 'digital'],
                verified: true,
                rows: [
                  { label: 'Drawings issued', monthOne: '[SEED] 00', monthLater: '[SEED] 00' },
                  { label: 'Revision turnaround', monthOne: '[SEED] 00 days', monthLater: '[SEED] 00 days' },
                  { label: 'Systems integrated', monthOne: '[SEED] 00', monthLater: '[SEED] 00' },
                  { label: 'Named contact', monthOne: '[SEED]', monthLater: '[SEED]' },
                ],
              }}
            />
          </Specimen>
        </Section>
      </Container>

      <StickyCta label="Specimen sticky call to action">
        <Button href="#main">Primary action</Button>
        <Button href="#main" variant="secondary">Secondary</Button>
      </StickyCta>
    </main>
  );
}
