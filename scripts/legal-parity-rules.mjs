/**
 * The legal-parity predicates, as pure functions — the subject `check-legal-parity.mjs` cannot
 * give its own self-test.
 *
 * Same split, and the same reason, as `launch-content-rules.mjs`: the gate is a
 * top-level-`await` script that fetches before it asserts, so **the only subject its rules
 * would ever have is whatever a running server happened to serve.** A predicate that has never
 * been observed to fire is not a predicate anyone should trust. Everything here decides on its
 * arguments; nothing reads the network, the filesystem, the environment or the clock, which is
 * what lets `check-legal-parity.selftest.mjs` exercise the same functions the real run does
 * rather than a copy of them.
 *
 * ## The comparison unit is a word sequence, not a string
 *
 * `normaliseWords` reduces text to lowercase alphanumeric words. Punctuation, markdown
 * emphasis, table pipes, typographic quotes and dashes all disappear, and what is left is the
 * sequence of words a reader would actually read.
 *
 * That is not a convenience. It is what makes the assertion **exact rather than fuzzy while
 * still surviving transcription.** A draft renders a processor as a markdown table row and the
 * seeded page renders it as a sentence; the two differ in every character of punctuation and in
 * none of their words. Under this normalisation the table row and the sentence are the same
 * sequence, so containment can be required **exactly** — every word, in order, no gaps.
 *
 * The discipline it imposes on `seed-legal.mjs` is the point: a transcription may drop
 * punctuation and may re-wrap, and **may not introduce a word the draft does not have, and may
 * not reorder.** Inventing so much as a connective — "Region:" in front of a table cell — moves
 * the served text off the draft's word sequence and fails the gate. That is the correct
 * outcome, because the class of defect being prevented (`07-STATE-REPORT.md` F-2, F-3) is
 * exactly "the published copy says something the reviewed draft does not".
 *
 * ### The two normalisations that are not identity, and why each is safe
 *
 * **`§` becomes the word `section`.** The drafts write `§6A`; prose that reads well on a public
 * page writes "section 6A". Both are the same reference and a reader of either is reading the
 * same thing. Without this rule every cross-reference in the set would be a false failure, and
 * a gate with dozens of false failures is a gate someone silences.
 *
 * **A digit run is one word.** `6(1)(b)` becomes `6 1 b`, `£1,000` becomes `1 000`. This is a
 * consequence of stripping punctuation rather than a rule of its own, and it is recorded
 * because it means the gate **cannot tell `£1,000` from `£1000`.** Nothing in this set turns on
 * that, and `check:content` is the gate that watches figures.
 */

/**
 * Text → the sequence of words in it.
 *
 * @param {string} text
 * @returns {string[]}
 */
export function normaliseWords(text) {
  return (
    String(text)
      // Draft-only apparatus. The served page has no HTML comments; a draft is mostly them.
      .replace(/<!--[\s\S]*?-->/g, ' ')
      // `§6A` and "section 6A" are the same reference. See the docstring.
      .replace(/§/g, ' section ')
      // The drafts' revision markers, which sit INSIDE operative sentences rather than beside
      // them: `**5.2 NEW — how you tell us…**`, `**(a) REVISED — you must ask us expressly…**`.
      // They are apparatus — they say what changed at which revision — and a published page
      // must not carry them, so the transcription drops them and this drops them from the
      // draft to match. Matched case-sensitively in upper case, which is the only form the
      // drafts use; the ordinary word "new" is untouched. Applied to BOTH sides, so a served
      // page that grew a stray "REVISED" would also lose it — a small, stated blind spot, and
      // the alternative is dozens of false failures on markers nobody publishes.
      .replace(/\b(?:NEW|REVISED|CORRECTED|REWRITTEN)\b/g, ' ')
      // Typographic forms the CMS and the drafts spell differently.
      .replace(/[‘’“”]/g, "'")
      .replace(/[–—‒―]/g, ' ')
      .replace(/ /g, ' ')
      .toLowerCase()
      // Everything that is not a letter or a digit is a separator. Markdown emphasis, table
      // pipes, bullets, brackets and every mark of punctuation go here.
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
  );
}

/**
 * Is `needle` a contiguous run inside `haystack`?
 *
 * Naive scan. The longest draft is ~800 lines and the longest served paragraph ~120 words, so
 * the worst case is small and a smarter algorithm would be complexity nobody needs.
 *
 * @param {string[]} haystack
 * @param {string[]} needle
 * @returns {boolean}
 */
export function containsRun(haystack, needle) {
  if (needle.length === 0) return true;
  if (needle.length > haystack.length) return false;
  const first = needle[0];
  for (let i = 0; i <= haystack.length - needle.length; i += 1) {
    if (haystack[i] !== first) continue;
    let j = 1;
    while (j < needle.length && haystack[i + j] === needle[j]) j += 1;
    if (j === needle.length) return true;
  }
  return false;
}

/**
 * Every version number a draft declares about itself, in file order.
 *
 * Two shapes are in use across the seven files and both are matched:
 * `**Version:** 1.3 · **Effective from:** …` (the header form, used by four drafts) and
 * `**Version 1.4 — revised 29 August 2026, round 12.` (the revision-note form, used by the two
 * client-terms instruments, which stack one note per round).
 *
 * @param {string} markdown
 * @returns {{header: string|null, all: string[]}}
 */
export function declaredVersions(markdown) {
  const all = [...markdown.matchAll(/\*\*Version:?\*?\*?\s*([0-9]+\.[0-9]+)/g)].map((m) => m[1]);
  const header = markdown.match(/^\*\*Version:\*\*\s*([0-9]+\.[0-9]+)/m)?.[1] ?? null;
  return { header, all };
}

/** Numeric compare on a `major.minor` string. */
const versionValue = (v) => {
  const [major, minor] = v.split('.').map(Number);
  return major * 1000 + minor;
};

/**
 * The version a draft is currently at: the highest it declares anywhere.
 *
 * **Highest, not first, and not last.** The revision-note form stacks — `MSA-BUSINESS.md`
 * carries `**Version 1.1 …**` through `**Version 1.4 …**` in file order — so first is the
 * oldest and last is only the newest by convention. Highest is the only one of the three that
 * is a fact about the file rather than about its layout.
 *
 * @param {string} markdown
 * @returns {string|null}
 */
export function currentVersion(markdown) {
  const { all } = declaredVersions(markdown);
  if (all.length === 0) return null;
  return all.reduce((best, v) => (versionValue(v) > versionValue(best) ? v : best));
}

/**
 * The clause tokens a draft declares — the numbered things a reader can be sent to.
 *
 * Two sources, and the second is the one that matters:
 *
 * **`## N.` headings** give the top-level sections. On their own they would have caught only
 * one of `07-STATE-REPORT.md` F-1's seven missing pieces, because `§6A` is a heading and
 * `§5A`, `§5.0` and `§5.2`–`§5.5` are not — they are bold lead-ins inside `## 5.`
 *
 * **Line-initial numbered clause markers** give the rest: `**5A NEW — …`, `**5.0 NEW — …`,
 * `10.3 **REVISED** …`, `16.1 **REVISED.**`, `7.4 If a payment is late …`.
 *
 * ## Why a bare integer is not a token
 *
 * The pattern requires a sub-part or a letter suffix — `5A`, `5.0`, `10.3` — and deliberately
 * **does not match a bare `1.` or `2.`** at the start of a line. Those are ordinary numbered
 * list items: `CONSUMER-TERMS.md` §12's complaints procedure is four of them, and
 * `PRIVACY-POLICY.md` §12 is four more. Matching them would demand a served clause numbered
 * "1" on documents that have none and produce a permanent false failure, which is the shape of
 * gate that gets deleted rather than fixed.
 *
 * The cost is stated rather than hidden: **a section whose heading is a bare integer is
 * covered only through its own sub-clauses.** `## 8. Security` in the privacy policy has no
 * sub-numbering at all, so it contributes no token and its disappearance would be caught by
 * the content assertion rather than by this one. That is a real limit of this branch and the
 * reason it is not the only branch.
 *
 * ## A heading token must be matched exactly; an inline one may be covered by its parent
 *
 * The two sources are not interchangeable and collapsing them makes branch C unable to see the
 * omission it exists for. `§5A` is a bold lead-in **inside** `## 5.`, so a served clause 5
 * genuinely covers it. `§6A` is a `##` heading of its own, a whole regime — reg. 37 rather than
 * reg. 36 — and if the page dropped it, a served clause 6 would "cover" `6A` under a plain
 * prefix rule and the gate would report clean over exactly `07-STATE-REPORT.md` F-1.
 *
 * So each token carries where it came from. `exact: true` means the draft gives it a heading of
 * its own and the page must serve it as a clause of its own.
 *
 * @param {string} markdown
 * @returns {Array<{token: string, exact: boolean}>} unique tokens, in first-seen order
 */
export function draftClauseTokens(markdown) {
  const body = markdown.replace(/<!--[\s\S]*?-->/g, ' ');
  const tokens = [];
  const add = (token, exact) => {
    if (token && !tokens.some((t) => t.token === token)) tokens.push({ token, exact });
  };

  // `## 5. Your right to cancel`, `## 6A. If we supply you a file …` — a section of its own.
  for (const m of body.matchAll(/^##+\s+([0-9]+[A-Z]?(?:\.[0-9]+)*)[.\s]/gm)) add(m[1], true);

  // `**5A NEW — …`, `**5.0 NEW — …`, `10.3 **REVISED** …`, `7.4 If a payment …` — inside a
  // section. Requires a dotted sub-part or a letter suffix; see the docstring.
  for (const m of body.matchAll(/^(?:\*\*|>\s*)?([0-9]+(?:[A-Z]|\.[0-9]+)(?:\.[0-9]+)*)\s/gm)) {
    add(m[1], false);
  }

  return tokens;
}

/**
 * Is a draft clause token reachable given the clause numbers a page actually serves?
 *
 * A served clause numbered `5` covers the draft's `5.0`, `5.1` and `5A`, because the page
 * renders section 5 whole rather than one anchor per sub-clause. A served `6A` covers `6A`
 * and nothing else. So a token is reached if some served number is a prefix of it at a
 * component boundary, or equals it.
 *
 * **The boundary is `.` or a capital letter, never a digit.** With a digit allowed, a served
 * clause `1` would swallow the draft's `11`, `12` and `16` — every document in the set has a
 * clause 1, so the branch would report every token reached on a page that served one clause,
 * which is a gate that cannot fail.
 *
 * @param {{token: string, exact: boolean}} entry
 * @param {string[]} servedNumbers
 * @returns {boolean}
 */
export function tokenReached(entry, servedNumbers) {
  const { token, exact } = entry;
  if (exact) return servedNumbers.includes(token);
  return servedNumbers.some(
    (n) => n === token || (token.startsWith(n) && /^[.A-Z]/.test(token.slice(n.length))),
  );
}
