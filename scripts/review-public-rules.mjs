import { createHash } from 'node:crypto';
import { REVIEW_SOURCE_LABEL, REVIEW_SOURCE_URL } from '../lib/reviews/public-model.ts';

export const reviewTextHash = (text) => createHash('sha256').update(text).digest('hex');
export function publicReviewProblems(reviews, baseline) {
  const problems = [];
  if (reviews.length !== 11 || baseline.records.length !== 11) problems.push('COUNT');
  const keys = new Set();
  for (const review of reviews) {
    const expected = baseline.records.find((row) => row.key === review.key);
    if (!expected || keys.has(review.key)) problems.push('KEY');
    keys.add(review.key);
    if (Object.keys(review).some((key) => !['key', 'reviewText', 'rating', 'country', 'sourceLabel', 'sourceUrl'].includes(key))) problems.push('IDENTITY');
    if (review.sourceLabel !== REVIEW_SOURCE_LABEL || review.sourceUrl !== REVIEW_SOURCE_URL) problems.push('PROVENANCE');
    if (expected && review.rating !== expected.rating) problems.push('RATING');
    if (expected && reviewTextHash(review.reviewText) !== expected.textSha256) problems.push('TEXT');
    if (review.country && baseline.approvedCountryFields === 0) problems.push('COUNTRY');
  }
  return [...new Set(problems)];
}

const decode = (value) => value.replace(/&(?:amp|lt|gt|quot|apos|#x27|#39|#32|#9);/g,
  (entity) => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&#x27;': "'", '&#39;': "'", '&#32;': ' ', '&#9;': '\t' })[entity]);
export function artifactReviewProblems(files, baseline) {
  const problems = [];
  const html = files.get('index.html')?.toString('utf8') ?? '';
  const cards = [...html.matchAll(/<li\b([^>]*data-review-key="([^"]+)"[^>]*)>([\s\S]*?)<\/li>/g)];
  const reviews = cards.map(([, , key, card]) => {
    const quote = card.match(/<blockquote\b[^>]*><p>([\s\S]*?)<\/p><\/blockquote>/)?.[1] ?? '';
    const caption = card.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/)?.[1] ?? '';
    const a = caption.match(/<a\b([^>]*)>([\s\S]*?)<\/a>/);
    const attributes = a?.[1] ?? '';
    if (!/target="_blank"/.test(attributes) || !/rel="noopener noreferrer"/.test(attributes)) problems.push('LINK');
    const sourceUrl = decode(attributes.match(/href="([^"]+)"/)?.[1] ?? '');
    const sourceLabel = decode((a?.[2] ?? '').replace(/<span class="sr-only">[\s\S]*?<\/span>/g, '').replace(/<[^>]*>/g, ''));
    if (caption.replace(/<[^>]*>/g, '') !== 'Verified Freelancer review (opens in a new tab)') problems.push('CAPTION_IDENTITY');
    const rating = Number(card.match(/aria-label="([\d.]+) out of 5 stars"/)?.[1]);
    return { key, reviewText: decode(quote), rating, sourceUrl, sourceLabel };
  });
  problems.push(...publicReviewProblems(reviews, baseline));
  for (const [name, bytes] of files) {
    const content = bytes.toString('utf8');
    if (/(?<!\d)(?:22179079|22156296|22148254|22148334|22140811|22134775|22131409|22111228|22100757|22061591|22055287)(?!\d)|from_user_id|authorName|public_name|paid_amount|Freelancer-OAuth-V1|freelancer\.com\/api\//i.test(content)) problems.push(`PROVIDER_DATA:${name}`);
    if (/\.map$/.test(name)) problems.push(`SOURCE_MAP:${name}`);
  }
  return [...new Set(problems)];
}
