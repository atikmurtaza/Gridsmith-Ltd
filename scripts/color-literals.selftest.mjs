#!/usr/bin/env node
import assert from 'node:assert/strict';
import { invalidHexLiterals } from './color-literals.mjs';

for (const literal of ['#abc', '#abcd', '#123456', '#12345678']) {
  assert.deepEqual(invalidHexLiterals(`:root { --accent: ${literal}; }`), []);
}
for (const literal of ['#12345', '#1234567', '#35718AF', '#35718af']) {
  assert.deepEqual(
    invalidHexLiterals(`:root { --accent: ${literal}; }`).map(({ value }) => value),
    [literal],
  );
}
assert.deepEqual(invalidHexLiterals('/* #12345 */ .x { content: "#1234567"; }'), []);
assert.deepEqual(invalidHexLiterals('.x { mask: url(#12345); }'), []);
assert.deepEqual(invalidHexLiterals('.x { color: var(--ink); }'), []);
console.log('color-literals.selftest: valid forms, malformed lengths, and non-colour cases passed');
