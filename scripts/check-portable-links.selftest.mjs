/**
 * `check:portable-links:selftest` — `GS-SEO-001`. Asserts the return values of
 * `lib/content/portableLinks.ts`, the only place that decides which Portable Text annotations
 * become links. A value assertion cannot be satisfied by an inert probe: each case below names the
 * exact result it expects, so a branch that stops firing turns a case red rather than silent.
 *
 * Every branch of `safeHref` and `spanLink` has its own case — internal, external, mailto, and
 * each refusal (non-string, blank, protocol-relative, backslash-relative, `javascript:`, `data:`,
 * relative without a slash), plus an unknown annotation type and a mark with no definition.
 */
import { safeHref, spanLink } from '../lib/content/portableLinks.ts';

const cases = [
  ['internal path', safeHref('/approach'), { href: '/approach', external: false }],
  ['internal path with fragment, trimmed', safeHref(' /design/services/x#y '), { href: '/design/services/x#y', external: false }],
  ['https is external', safeHref('https://www.freelancer.com/u/GridsmithLTD'), { href: 'https://www.freelancer.com/u/GridsmithLTD', external: true }],
  ['http is external', safeHref('http://example.com/'), { href: 'http://example.com/', external: true }],
  ['mailto opens in place', safeHref('mailto:contact@gridsmith.uk'), { href: 'mailto:contact@gridsmith.uk', external: false }],
  ['non-string refused', safeHref(42), null],
  ['blank refused', safeHref('   '), null],
  ['protocol-relative refused', safeHref('//evil.example/x'), null],
  ['backslash-relative refused', safeHref('/\\evil.example'), null],
  ['javascript: refused', safeHref('javascript:alert(1)'), null],
  ['data: refused', safeHref('data:text/html,x'), null],
  ['relative without slash refused', safeHref('approach'), null],
  ['span with link mark', spanLink({ _type: 'span', text: 'x', marks: ['a'] }, [{ _type: 'link', _key: 'a', href: '/about' }]), { href: '/about', external: false }],
  ['decorator mark only stays text', spanLink({ _type: 'span', text: 'x', marks: ['strong'] }, []), null],
  ['unknown annotation type stays text', spanLink({ _type: 'span', text: 'x', marks: ['a'] }, [{ _type: 'internalRef', _key: 'a', href: '/about' }]), null],
  ['mark with no definition stays text', spanLink({ _type: 'span', text: 'x', marks: ['missing'] }, undefined), null],
  ['unsafe link falls through to a later safe one', spanLink({ _type: 'span', text: 'x', marks: ['a', 'b'] }, [{ _type: 'link', _key: 'a', href: 'javascript:x' }, { _type: 'link', _key: 'b', href: '/press' }]), { href: '/press', external: false }],
];

let failed = 0;
for (const [name, got, want] of cases) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) {
    failed++;
    console.error(`  FAIL ${name}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
  }
}
if (failed) {
  console.error(`\ncheck-portable-links: ${failed} of ${cases.length} case(s) failed\n`);
  process.exit(1);
}
console.log(`check-portable-links: ${cases.length}/${cases.length} cases — link annotations render only for a safe href`);
