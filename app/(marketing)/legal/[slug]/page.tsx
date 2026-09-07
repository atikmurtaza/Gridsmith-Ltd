import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/primitives/Breadcrumb';
import { Container } from '@/components/primitives/Container';
import { Heading } from '@/components/primitives/Heading';
import { Numeric } from '@/components/primitives/Numeric';
import { Prose } from '@/components/primitives/Prose';
import { Section } from '@/components/primitives/Section';
import { Blocks } from '@/components/content/Blocks';
import { getLegalDocument, listLegalDocuments } from '@/lib/sanity/queries';
import {
  CLIENT_TERMS_COUNTERPART,
  LEGAL_DOCUMENT_SLUGS,
  type LegalSlug,
} from '@/lib/legal/slugs';
import styles from '@/components/content/content.module.css';

/**
 * `/legal/[slug]` — the legal document template (`L-02`).
 *
 * Server Component, zero client JS, statically generated.
 *
 * ## Stable anchors, because contracts cite them
 *
 * Each clause renders with `id={clause.anchorId}` and a link to itself. `master/SCHEMA.md`:
 * *"Contracts and the site both cite `anchorId`, so clause numbering must not drift —
 * renumbering requires a version bump and a redirect for the old anchor."* The anchor comes
 * from the CMS field rather than being derived from the clause number here, so renumbering a
 * clause does not silently move its anchor: the two are separate fields and moving one is a
 * visible edit.
 *
 * `scroll-margin-block-start` on the clause is what stops a followed anchor landing under the
 * sticky header — a fragment that scrolls the target out of view is a WCAG 2.4.7-adjacent
 * failure that no automated check catches, because the element is technically focused.
 *
 * ## An unapproved document is announced, never hidden
 *
 * `solicitorApproved` defaults false. The query does **not** filter on it —
 * `lib/sanity/queries.ts` explains why in full. A missing privacy notice is a worse outcome
 * than a draft that says, in the first thing on the page, that it is a draft. What must not
 * happen is a draft presented as though it were reviewed, and that is prevented by rendering
 * the state rather than by hiding the document.
 *
 * **As of 2 September 2026 the flag gates nothing — it describes.** It filters no query,
 * blocks no route, fails no build, and no longer suppresses indexing. The owner's decision is
 * that external legal review is booked separately and the programme does not wait on it, so a
 * flag that withheld the published instruments until the review landed was withholding them
 * indefinitely. `check-legal-parity.mjs` branch D still requires the banner to render, which
 * is an assertion that the state is *shown* — the opposite of a gate.
 *
 * ## Print
 *
 * `content.module.css` carries the print rules: the table of contents goes, clauses do not
 * break across pages. A legal page is a document someone keeps, which is the whole difference
 * between it and every other page on this site.
 */
export function generateStaticParams() {
  return LEGAL_DOCUMENT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getLegalDocument(slug);
  if (!doc) return { title: 'Not found — Gridsmith Ltd' };
  return {
    title: `${doc.title} — Gridsmith Ltd`,
    description: doc.summary ?? undefined,
    // **No `robots` gate on `solicitorApproved`, as of 2 September 2026.** It used to `noindex`
    // every legal page until the flag flipped, which made the flag a publication gate: the
    // instruments were served but withheld from search, so the company's published legal
    // position was unfindable pending a review that had not been booked. The owner's decision
    // is that the review does not gate the programme. The draft state is *described* — the
    // banner below, `reviewedBy`, and the version — and describing a state is not the same as
    // suppressing the document. A visitor who searches for Gridsmith's privacy notice should
    // find the notice Gridsmith actually publishes.
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = await getLegalDocument(slug);
  if (!doc) notFound();

  // The counterpart client-terms instrument is excluded, not merely ordered last. Listing the
  // business MSA at the foot of the consumer terms is the s. 57 defect the split removed,
  // rebuilt as a hyperlink — see `CLIENT_TERMS_COUNTERPART`. `/legal/client-terms` stays in
  // the list, and it is the page that explains which of the two a reader wants.
  const counterpart = CLIENT_TERMS_COUNTERPART[slug as LegalSlug];
  const others = (await listLegalDocuments()).filter(
    (d) => d.slug !== slug && d.slug !== counterpart,
  );

  return (
    <main id="main" tabIndex={-1}>
      <Section rhythm="loose">
        <Container width="narrow">
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: `/legal/${slug}`, label: doc.title },
            ]}
          />
          <Heading level={1}>
            {doc.title}
          </Heading>

          {!doc.solicitorApproved ? (
            <p className={styles.legalStatus}>
              DRAFT — NOT YET REVIEWED BY A SOLICITOR. This is the document Gridsmith Ltd
              currently publishes and works to. It has been through internal revision but not
              external legal review, and it will be updated when that review happens.
            </p>
          ) : null}

          <p className={styles.legalMeta}>
            <Numeric>
              {[
                doc.version ? `Version ${doc.version}` : null,
                doc.effectiveFrom ? `Effective ${doc.effectiveFrom}` : null,
                doc.lastReviewed ? `Reviewed ${doc.lastReviewed}` : null,
                doc.reviewedBy,
              ]
                .filter(Boolean)
                .join('  |  ')}
            </Numeric>
          </p>

          {doc.summary ? (
            <Prose>
              <p>{doc.summary}</p>
            </Prose>
          ) : null}
        </Container>
      </Section>

      {doc.clauses && doc.clauses.length > 0 ? (
        <Section labelledBy="contents">
          <Container width="narrow">
            <Heading level={2} id="contents">
              Contents
            </Heading>
            <ol className={styles.legalToc}>
              {doc.clauses.map((clause) => (
                <li key={clause.anchorId}>
                  <a href={`#${clause.anchorId}`}>
                    <span className={styles.legalTocNumber}>{clause.number}</span> {clause.heading}
                  </a>
                </li>
              ))}
            </ol>
          </Container>
        </Section>
      ) : null}

      <Section>
        <Container width="narrow">
          <div className={styles.legalClauses}>
            {(doc.clauses ?? []).map((clause) => (
              <section key={clause.anchorId} id={clause.anchorId} className={styles.legalClause}>
                <Heading level={2}>
                  <span className={styles.legalClauseNumber}>{clause.number}</span> {clause.heading}
                </Heading>
                <Prose>
                  <Blocks value={clause.body} />
                </Prose>
                {clause.basis ? (
                  <p className={styles.legalBasis}>Basis: {clause.basis}</p>
                ) : null}
              </section>
            ))}
          </div>
        </Container>
      </Section>

      {others.length > 0 ? (
        <Section surface="sunken" labelledBy="other-documents">
          <Container width="narrow">
            <Heading level={2} id="other-documents">
              The other documents
            </Heading>
            <ul className={styles.legalToc}>
              {others.map((other) => (
                <li key={other.slug}>
                  <a href={`/legal/${other.slug}`}>{other.title}</a>
                  {!other.solicitorApproved ? (
                    <span className={styles.legalTocNumber}> — draft</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}
    </main>
  );
}
