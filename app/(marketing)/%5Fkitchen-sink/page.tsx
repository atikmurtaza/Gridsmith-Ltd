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
 * Every id, form `name` and exclusive-accordion `name` on this page is scoped to its
 * theme frame. Rendering the same specimen four times with the same literals produced 20
 * duplicated ids × 4, one radio group spanning all four frames (choosing in Digital
 * cleared Master, and only the last of four `checked` radios survived), and one exclusive
 * `<details>` group across all four frames, so three of the four themes rendered their
 * accordion closed.
 *
 * axe reported zero violations throughout: axe-core keeps `duplicate-id` behind its
 * `deprecated` tag, so no WCAG tag set can reach it. `check-axe` now asserts this
 * directly against the served DOM rather than hoping a rule exists for it.
 */
const scope = (division: string, key: string) => `${division}-${key}`;

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

function Specimen({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className={styles.specimen}>
      <p className={styles.specimenName}>{name}</p>
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
            <code>REV-04</code>. An <a href="#ks">inline link</a> sits in the accent.
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
          <Button href="#ks" variant="secondary">Link button</Button>
        </div>
      </Specimen>

      <Specimen name="Link — accent, quiet, external">
        <div className={styles.row}>
          <Link href="#ks">Accent link</Link>
          <Link href="#ks" tone="quiet">Quiet link</Link>
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
              <Heading level={4}><Link href="#ks" tone="quiet">Linked card</Link></Heading>
              <p>Whole card is the target; focus lands on the link.</p>
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
            <tr><th scope="row">First row</th><td><Numeric>REV-02</Numeric></td><td><Numeric>£1,250</Numeric></td></tr>
            <tr><th scope="row">Second row</th><td><Numeric>REV-11</Numeric></td><td><Numeric>£980</Numeric></td></tr>
          </tbody>
        </Table>
      </Specimen>

      <Specimen name="Breadcrumb · Pagination">
        <Breadcrumb label={`Breadcrumb (${division})`} items={[{ label: 'Home', href: '/' }, { label: 'Work', href: '/work' }, { label: 'Current page' }]} />
        <Pagination label={`Pagination (${division})`} current={3} total={9} hrefFor={(p) => `?page=${p}`} />
      </Specimen>

      <Specimen name="Field — default, hint, error, textarea">
        <Field name={scope(division, 'name')} label="Full name" required autoComplete="name" />
        <Field name={scope(division, 'email')} label="Email" type="email" hint="We reply by the end of the next business day." />
        <Field name={scope(division, 'broken')} label="Field with an error" error="Enter a valid email address." />
        <Field name={scope(division, 'message')} label="Message" multiline />
      </Specimen>

      <Specimen name="Select — placeholder, error">
        <Select
          name={scope(division, 'budget')}
          label="Budget band"
          placeholder="Select a band"
          options={[{ value: 'a', label: 'Under £5,000' }, { value: 'b', label: '£5,000 – £15,000' }]}
        />
        <Select
          name={scope(division, 'broken-select')}
          label="Select with an error"
          error="Choose one option."
          options={[{ value: 'a', label: 'Option A' }]}
        />
      </Specimen>

      <Specimen name="RadioGroup — with hints, and an error">
        <RadioGroup
          name={scope(division, 'division')}
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
          name={scope(division, 'radio-error')}
          legend="Group with an error"
          error="Select one option."
          options={[{ value: 'y', label: 'Yes' }, { value: 'n', label: 'No' }]}
        />
      </Specimen>

      <Specimen name="Accordion — native details, one open">
        <Accordion items={FAQS.map((f) => ({ ...f, id: scope(division, f.key) }))} exclusiveName={scope(division, 'faq')} defaultOpenId={scope(division, 'a1')} />
      </Specimen>

      <Specimen name="Tabs — arrow keys, roving tabindex">
        <Tabs
          label={`Specimen tabs (${division})`}
          tabs={[
            { id: scope(division, 't1'), label: 'First', panel: <p>First panel.</p> },
            { id: scope(division, 't2'), label: 'Second', panel: <p>Second panel.</p> },
            { id: scope(division, 't3'), label: 'Third', panel: <p>Third panel.</p> },
          ]}
        />
      </Specimen>

      <Specimen name="Stepper — canonical six, step 3 current">
        <Stepper steps={STEPS} current={3} label={`Specimen process (${division})`} />
      </Specimen>

      <Specimen name="EmptyState">
        <EmptyState title="No results for these filters" actions={<Button variant="secondary" href="#ks">Clear filters</Button>}>
          <p>Nothing matched. Widening the discipline filter usually helps.</p>
        </EmptyState>
      </Specimen>

      <Specimen name="ErrorState">
        <ErrorState
          title="That did not send"
          reference="KS-0000"
          announce={false}
          actions={<Button href="#ks">Try again</Button>}
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
          <Button href="#ks">Primary action</Button>
          <Button href="#ks" variant="secondary">Secondary</Button>
        </StickyCta>
      </Specimen>
    </>
  );
}

export default function KitchenSinkPage() {
  return (
    <main id="ks">
      <Container>
        <Section rhythm="tight">
          <Eyebrow>A-05a</Eyebrow>
          <Heading level={1} size="d2">Kitchen sink</Heading>
          <Prose>
            <p>
              All 24 primitives, rendered once per theme. Not linked from anywhere and
              <code> noindex</code>.
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

      <StickyCta label="Specimen sticky call to action">
        <Button href="#ks">Primary action</Button>
        <Button href="#ks" variant="secondary">Secondary</Button>
      </StickyCta>
    </main>
  );
}
