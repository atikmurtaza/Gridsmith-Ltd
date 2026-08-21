import type { Metadata } from 'next';
import { ContinuityExample } from '@/components/master/ContinuityExample';
import { ProcessStages } from '@/components/master/ProcessStages';
import { Container } from '@/components/primitives/Container';
import { Eyebrow } from '@/components/primitives/Eyebrow';
import { Heading } from '@/components/primitives/Heading';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';

export const metadata: Metadata = { title: 'Master sink — Gridsmith Ltd', robots: { index: false } };

/**
 * **A permanent gate subject, and a separate page from `/_kitchen-sink` on purpose.**
 *
 * `check-bundle-size` derives the primitive layer as `/_kitchen-sink`'s delta minus the shared
 * baseline. Putting master-layer components on that page therefore *counts them as primitives*:
 * `N-05` moved the figure from 5.8KB to 6.0KB and `N-06` would have pushed it past
 * `PRIMITIVES_BUDGET_KB`, failing with a message blaming a primitive layer that had not grown
 * at all. A measurement four workstreams build on would have been quietly wrong first and
 * loudly wrong second.
 *
 * So the primitive census keeps its own page and composed master components get this one. The
 * two are measured separately because they are budgeted separately.
 *
 * Not linked from anywhere, `noindex`, and excluded from production builds by the
 * `pageExtensions` mechanism in `next.config.ts` like every other probe.
 */
export default function MasterSinkPage() {
  return (
    <main id="main" tabIndex={-1}>
      <Container>
        <Section rhythm="tight">
          <Eyebrow>N-05 · N-06</Eyebrow>
          <Heading level={1} size="d2">Master sink</Heading>
          <Prose>
            <p>
              Composed master-layer components, kept off <code>/_kitchen-sink</code> so the
              primitive-layer measurement stays a measurement of primitives.
            </p>
          </Prose>
        </Section>

        <Section rhythm="tight">
          <Heading level={2}>ProcessStages — the canonical six</Heading>
          <ProcessStages
            detail={{
              Consultation: { divisionDetail: '[SEED] What this stage means for this division.', clientTime: '[SEED] 00h' },
              Delivery: { divisionDetail: '[SEED] Issued file set with revision numbering.', duration: '[SEED] 00 days' },
            }}
          />
        </Section>

        <Section rhythm="tight">
          <Heading level={2}>ProcessStages — a non-canonical key is surfaced, not swallowed</Heading>
          <ProcessStages detail={{ Onboarding: { divisionDetail: '[SEED] not a canonical stage' } }} />
        </Section>

        <Section rhythm="tight">
          <Heading level={2}>ContinuityExample — empty</Heading>
          {/* What the site shows today: `verified` is hard-true, so no seed example can exist
              and `Q-M6` blocks a real one. */}
          <ContinuityExample example={null} />
        </Section>

        <Section rhythm="tight">
          <Heading level={2}>ContinuityExample — populated</Heading>
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
        </Section>
      </Container>
    </main>
  );
}
