import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

// eslint-config-next 15 ships eslintrc format; FlatCompat is the supported bridge to
// ESLint 9 flat config. It goes away when we move to eslint-config-next 16+.
const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'docs/**', 'next-env.d.ts'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // design/PROJECT-RULES.md §2 — `any` is banned, not discouraged.
      '@typescript-eslint/no-explicit-any': 'error',
      // CLAUDE.md Definition of Done — "zero production console output", with no
      // exceptions listed. `warn` and `error` were allowed here, which is a quieter
      // deviation than it looks: a console.error in a Server Component runs on every
      // request and lands in production logs. Errors belong in ErrorState and the
      // observability layer, not in the console.
      'no-console': 'error',
    },
  },
  {
    // Build and CI scripts run in Node, outside the production bundle.
    files: ['scripts/**'],
    rules: { 'no-console': 'off' },
  },
  {
    // Lighthouse CI reads its config with `require`, so these files are CommonJS by
    // necessity rather than by choice. Scoped to them alone — `require()` stays banned
    // everywhere it is avoidable.
    files: ['*.cjs', 'lighthouse/**/*.cjs'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    // The 404 uses a plain <a>, and the rule that forbids it is measurably wrong here.
    //
    // `no-html-link-for-pages` exists to stop a full document load where client-side
    // navigation would do. But Next puts the ROOT not-found boundary into every route's
    // script list, so importing the Link primitive — which wraps next/link, a Client
    // Component — put 4.3KB gz on every page in the site. Measured on both sides:
    // check-bundle-size read 104.5KB per route with it and exactly 100.2KB, the framework
    // floor, without. That is 29% of Digital's entire 15KB delta budget spent on a page
    // almost nobody reaches, permanently, to save one document load from a dead URL.
    //
    // CLAUDE.md non-negotiable #8: the budget does not move, the feature changes. This is
    // the feature changing. Scoped to the one file, with the numbers, rather than an
    // inline disable someone later reads as noise.
    files: ['app/not-found.tsx'],
    rules: { '@next/next/no-html-link-for-pages': 'off' },
  },
];

export default config;
