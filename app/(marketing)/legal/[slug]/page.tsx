import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/primitives/Breadcrumb';
import { Numeric } from '@/components/primitives/Numeric';
import { Prose } from '@/components/primitives/Prose';
import { Blocks } from '@/components/content/Blocks';
import { Opening } from '@/components/shared/Opening';
import { getLegalDocument, listLegalDocuments } from '@/lib/sanity/queries';
import { isAdoptedNotPublished, isPublishable } from '@/lib/legal/adoption';
import { STATIC_BUILD } from '@/lib/build/target';
import { staticParams } from '@/lib/build/static-routes';
import {
  CLIENT_TERMS_COUNTERPART,
  LEGAL_DOCUMENT_SLUGS,
  type LegalSlug,
} from '@/lib/legal/slugs';
import styles from '@/components/shared/shared.module.css';
import opening from '@/components/shared/opening.module.css';
import { absolute } from '@/lib/seo/site';

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
 * ## R12: private review and production publication are separate
 *
 * OWNER_ADOPTED documents show the adopted/not-published notice and cannot be indexed.
 * The explicit adopted-development export validates exact content and fingerprints before
 * and after generation. Production queries require PUBLISHABLE in both CMS and the committed
 * register; migration and the default export retain their publication prerequisite gates.
 *
 * ## Print
 *
 * `shared.module.css` carries the print rules since `GS-SHARED-001-B2`: white paper, black text,
 * no navigation or contents, clauses kept whole where they fit. A legal page is a document
 * someone keeps, which is the whole difference between it and every other page on this site.
 *
 * ## `GS-SHARED-001-B2` — presentation only; the wording is frozen
 *
 * Compact Master-frame opening (breadcrumb, title, the draft notice, metadata, summary), then the
 * document on the light sheet at ~68ch, 17px, 1.7 leading, with sticky contents at 1024px+ and a
 * native `<details>` below it — no script, no scroll spy. **Nothing the CMS serves is altered.**
 * The markup `check:legal:parity` reads is deliberately unchanged in shape: each clause is a
 * `<section>` whose FIRST attribute is its `id`, with no nested `<section>`; its `<h2>`'s first
 * `<span>` is the clause number; clause prose is `<p>`; the banner still contains the exact
 * string the gate looks for. Some list-like clause content is stored as separate paragraphs —
 * a known data defect, recorded for a controlled later fix and not touched here.
 */
export function generateStaticParams() {
  if (STATIC_BUILD) return staticParams('legalDocument');
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
    alternates: { canonical: absolute(`/legal/${slug}`) },
    // R12: a review document remains unindexable regardless of deployment configuration.
    ...(!isPublishable(doc.adoptionState) ? { robots: { index: false, follow: false } } : {}),
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

  const clauses = doc.clauses ?? [];
  const contents = (
    <ol className={styles.contentsList}>
      {clauses.map((clause) => (
        <li key={clause.anchorId}>
          <a href={`#${clause.anchorId}`}>
            <span className={styles.contentsNo}>{clause.number}</span>
            <span>{clause.heading}</span>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <main id="main" tabIndex={-1}>
      <Opening
        place="Legal"
        title={doc.title}
        lead={doc.summary ?? undefined}
        before={
          <Breadcrumb
            items={[
              { href: '/', label: 'Home' },
              { href: `/legal/${slug}`, label: doc.title },
            ]}
          />
        }
      >
        {isAdoptedNotPublished(doc.adoptionState) ? (
          <p className={opening.status}>
            <span className={opening.statusLabel}>ADOPTED, NOT YET PUBLISHED.</span>{' '}
            Gridsmith Ltd has adopted this version, but it has not yet been published as the live
            version of this document. It is shown here for review before publication.
          </p>
        ) : !isPublishable(doc.adoptionState) ? (
          <p className={opening.status}>
            <span className={opening.statusLabel}>NOT YET ADOPTED.</span>{' '}
            This version is under review and has not been adopted by Gridsmith Ltd. It is shown here
            for review only and is not the version Gridsmith Ltd contracts on.
          </p>
        ) : null}
        <p className={opening.meta}>
          <Numeric>
            {[
              doc.version ? `Version ${doc.version}` : null,
              // An unadopted version has no effective date, only the date it was drafted. An adopted
              // one carries its effective date from adoption, before and after publication.
              doc.effectiveFrom
                ? `${isPublishable(doc.adoptionState) || isAdoptedNotPublished(doc.adoptionState) ? 'Effective' : 'Draft dated'} ${doc.effectiveFrom}`
                : null,
              isPublishable(doc.adoptionState) && doc.lastReviewed ? `Reviewed ${doc.lastReviewed}` : null,
              doc.reviewedBy,
            ]
              .filter(Boolean)
              .join('  |  ')}
          </Numeric>
        </p>
      </Opening>

      <div className={styles.sheet}>
        <div className={`${styles.wrap} ${styles.legalGrid}`}>
          {clauses.length > 0 ? (
            <nav aria-labelledby="contents" className={styles.contents}>
              <p id="contents" className={styles.connectHeading}>Contents</p>
              {contents}
            </nav>
          ) : <div />}

          <div className={styles.document}>
            {clauses.length > 0 ? (
              <details className={styles.contentsDetails}>
                <summary>Contents</summary>
                <nav aria-label="Contents">{contents}</nav>
              </details>
            ) : null}
            {clauses.map((clause) => (
              <section key={clause.anchorId} id={clause.anchorId} className={styles.clause} tabIndex={-1}>
                <h2 className={styles.clauseTitle}>
                  <span className={styles.clauseNo}>{clause.number}</span> {clause.heading}
                </h2>
                <Prose>
                  <Blocks value={clause.body} />
                </Prose>
              </section>
            ))}
          </div>
        </div>
      </div>

      {others.length > 0 ? (
        <section className={`${styles.sunken} ${styles.otherDocs}`} aria-labelledby="other-documents">
          <div className={styles.wrap}>
            <h2 id="other-documents" className={styles.connectHeading}>The other documents</h2>
            <ul className={styles.others}>
              {others.map((other) => (
                <li key={other.slug}>
                  <a href={`/legal/${other.slug}`}>{other.title}</a>
                  {isAdoptedNotPublished(other.adoptionState) ? (
                    <span className={styles.othersNote}> — adopted, not yet published</span>
                  ) : !isPublishable(other.adoptionState) ? (
                    <span className={styles.othersNote}> — not yet adopted</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </main>
  );
}
