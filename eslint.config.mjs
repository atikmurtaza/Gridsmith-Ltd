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
      // CLAUDE.md Definition of Done — zero production console output.
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Build and CI scripts run in Node, outside the production bundle.
    files: ['scripts/**'],
    rules: { 'no-console': 'off' },
  },
];

export default config;
