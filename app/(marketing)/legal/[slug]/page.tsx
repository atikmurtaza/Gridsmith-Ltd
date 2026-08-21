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
import { LEGAL_DOCUMENT_SLUGS } from '@/lib/legal/slugs';
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
 * `solicitorApproved` defaults false and `L-04` is the hard gate that flips it. The query does
 * **not** filter on it — `lib/sanity/queries.ts` explains why in full. A missing privacy notice
 * is a worse outcome than a draft that says, in the first thing on the page, that it is a
 * draft. What must not happen is a draft presented as though it were reviewed, and that is
 * prevented by rendering the state rather than by hiding the document.
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
    // A draft must not be indexed as though it were the company's published position.
    robots: doc.solicitorApproved ? undefined : { index: false, follow: true },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = await getLegalDocument(slug);
  if (!doc) notFound();

  const others = (await listLegalDocuments()).filter((d) => d.slug !== slug);

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
              DRAFT — NOT YET REVIEWED BY A SOLICITOR. This document is published so that its
              shape can be reviewed and so that the site is not missing a notice it is required
              to carry. Do not rely on it. Clauses marked [DECISION] are choices the company has
              not yet made, and each shows a working default rather than a settled position.
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
