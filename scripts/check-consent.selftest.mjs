#!/usr/bin/env node
/**
 * check-consent.selftest — `GS-LAUNCH-026`. Committed specimens for the decisions `check:consent`
 * cannot make without a browser: how a stored value is read, when a decision covers the build's
 * providers, which identifiers are refused, which CSP hosts each provider adds, and when a build's
 * policies fail to describe the analytics it offers. Every case asserts a return value, so a branch
 * that stops firing turns a case red rather than silent. Runs in `verify:static`.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readChoice, encodeChoice, choiceCovers, remaining, CHOICE_MAX_AGE } from '../lib/consent/decision.ts';
import { readAnalyticsConfig, analyticsConfigProblems, analyticsCsp, POSTHOG_HOST } from '../lib/analytics/config.ts';
import { productionHostingerRules } from '../lib/build/hostinger.ts';
import { analyticsDisclosureProblems, analyticsReadinessProblems } from './legal-adoption-rules.mjs';

let cases = 0;
const eq = (name, actual, expected) => { cases += 1; assert.deepEqual(actual, expected, name); };
const GA = 'G-GS026TEST0';
const PH = 'phc_GS026TestIdentifierNotARealProjectKey00';
const both = { ga4: GA, posthog: PH };

// Stored values: only a well-formed v2 record is a decision.
eq('v2 grant', readChoice('v2:g1:p0:1761600000'), { ga4: true, posthog: false, at: 1761600000 });
eq('v2 not offered', readChoice('v2:g-:p1:1761600000'), { ga4: null, posthog: true, at: 1761600000 });
for (const value of [null, undefined, '', '1', '0', 'analytics_storage%2Cad_storage', 'v2:g1:p1', 'v2:gx:p1:1761600000', 'v2:g1:p1:17616000000000', ' v2:g1:p1:1761600000']) {
  eq(`no decision: ${JSON.stringify(value)}`, readChoice(value), null);
}
eq('round trip', readChoice(encodeChoice({ ga4: false, posthog: null, at: 1761600001 })), { ga4: false, posthog: null, at: 1761600001 });

// A decision must be current and answer for every offered provider.
const T = 1761600000;
eq('covers both', choiceCovers({ ga4: true, posthog: false, at: T }, both, T + 60), true);
eq('misses a new provider', choiceCovers({ ga4: true, posthog: null, at: T }, both, T + 60), false);
eq('only GA4 offered', choiceCovers({ ga4: false, posthog: null, at: T }, { ga4: GA, posthog: null }, T + 60), true);
eq('no record', choiceCovers(null, both, T), false);
eq('choice lasts 180 days', CHOICE_MAX_AGE, 180 * 24 * 60 * 60);
eq('last second still covers', choiceCovers({ ga4: true, posthog: true, at: T }, both, T + CHOICE_MAX_AGE - 1), true);
eq('lapsed after 180 days', choiceCovers({ ga4: true, posthog: true, at: T }, both, T + CHOICE_MAX_AGE), false);
eq('remaining counts down', remaining({ ga4: true, posthog: true, at: T }, T + 100), CHOICE_MAX_AGE - 100);
eq('remaining never negative', remaining({ ga4: true, posthog: true, at: T }, T + CHOICE_MAX_AGE * 2), 0);

// Identifiers: unset is off, malformed is refused rather than treated as off.
eq('config both', readAnalyticsConfig(GA, PH), both);
eq('config malformed is absent', readAnalyticsConfig('UA-1234-1', 'key'), { ga4: null, posthog: null });
eq('config unset', readAnalyticsConfig(undefined, undefined), { ga4: null, posthog: null });
eq('problems none', analyticsConfigProblems(undefined, undefined, undefined), []);
eq('problems valid', analyticsConfigProblems(GA, PH, POSTHOG_HOST), []);
eq('problem ga4', analyticsConfigProblems('UA-1234-1').length, 1);
eq('problem posthog', analyticsConfigProblems(undefined, 'not-a-key').length, 1);
eq('problem US host', analyticsConfigProblems(undefined, PH, 'https://us.i.posthog.com').length, 1);

// CSP: each provider adds only its own hosts; none adds nothing.
eq('csp none', analyticsCsp({ ga4: null, posthog: null }), { script: '', connect: '', img: '' });
const ga = analyticsCsp({ ga4: GA, posthog: null });
eq('csp ga4 has no posthog', /posthog/.test(JSON.stringify(ga)), false);
eq('csp ga4 script', ga.script, 'https://www.googletagmanager.com');
const ph = analyticsCsp({ ga4: null, posthog: PH });
eq('csp posthog has no google', /google/.test(JSON.stringify(ph)), false);
eq('csp posthog connect', ph.connect, 'https://eu.i.posthog.com https://eu-assets.i.posthog.com');

// The unconfigured owner-preview policy is byte-identical to the pre-analytics policy.
const PRE_ANALYTICS_CSP = 'Header always set Content-Security-Policy "default-src \'self\'; base-uri \'self\'; form-action \'self\'; frame-ancestors \'none\'; object-src \'none\'; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: blob: https://cdn.sanity.io; font-src \'self\'; connect-src \'self\' ; media-src \'self\' https://cdn.sanity.io; worker-src \'self\' blob:; manifest-src \'self\'"';
const line = (rules) => rules.split('\n').find((l) => l.startsWith('Header always set Content-Security-Policy'));
eq('owner preview CSP unchanged when unconfigured', line(productionHostingerRules(null, 'production', { ownerPreview: true })), PRE_ANALYTICS_CSP);
eq('production CSP unchanged when unconfigured', line(productionHostingerRules(null, 'production')), PRE_ANALYTICS_CSP);
eq('configured CSP names both providers', /googletagmanager[\s\S]*eu-assets\.i\.posthog\.com/.test(line(productionHostingerRules(null, 'production', { ownerPreview: true, analytics: both }))), true);

// Disclosure: a build offering analytics needs policies that describe it.
const adoptedCookies = readFileSync('docs/_legal/current/cookie-policy.md', 'utf8');
const adoptedPrivacy = readFileSync('docs/_legal/current/privacy-policy.md', 'utf8');
eq('unconfigured needs nothing', analyticsDisclosureProblems(adoptedCookies, adoptedPrivacy, { ga4: null, posthog: null }), []);
eq('adopted policies cannot carry GA4', analyticsDisclosureProblems(adoptedCookies, adoptedPrivacy, { ga4: GA, posthog: null }).length > 0, true);
const DESCRIBED_COOKIES = 'Google Analytics 4 sets _ga and _ga_<id>. PostHog sets ph_<key>_posthog.';
const DESCRIBED_PRIVACY = 'With consent we use Google Analytics 4 and PostHog.';
eq('described both', analyticsDisclosureProblems(DESCRIBED_COOKIES, DESCRIBED_PRIVACY, both), []);
eq('cookie names missing', analyticsDisclosureProblems('Google Analytics 4 and PostHog.', DESCRIBED_PRIVACY, both).length, 2);
eq('privacy silent', analyticsDisclosureProblems(DESCRIBED_COOKIES, 'Nothing here.', both).length, 2);
eq('still planned', analyticsDisclosureProblems(`${DESCRIBED_COOKIES} GA4 and PostHog are planned future processing.`, DESCRIBED_PRIVACY, both).length, 1);
eq('choice lifetime unstated', analyticsDisclosureProblems(DESCRIBED_COOKIES, DESCRIBED_PRIVACY, both, { choiceDays: 180 }).length, 1);
eq('choice lifetime stated', analyticsDisclosureProblems(`${DESCRIBED_COOKIES} A choice lasts 180 days.`, DESCRIBED_PRIVACY, both, { choiceDays: 180 }), []);
const proposedCookies = readFileSync('docs/_legal/proposed/GS-LAUNCH-026/cookie-policy-2.5.md', 'utf8');
const proposedPrivacy = readFileSync('docs/_legal/proposed/GS-LAUNCH-026/privacy-policy-2.8.md', 'utf8');
eq('proposed policies carry both, with the source lifetime', analyticsDisclosureProblems(proposedCookies, proposedPrivacy, both, { choiceDays: CHOICE_MAX_AGE / 86400 }), []);

// Readiness: identifiers need the register's recorded ANALYTICS-READY evidence.
const register = JSON.parse(readFileSync('docs/_legal/evidence/GS-O003-R-REGISTER.json', 'utf8'));
eq('unconfigured needs no readiness', analyticsReadinessProblems(register, { ga4: null, posthog: null }), []);
eq('live register refuses identifiers', analyticsReadinessProblems(register, both).length, 1);
eq('recorded readiness allows them', analyticsReadinessProblems({ documents: { privacy: { prerequisitesMet: { 'ANALYTICS-READY': 'evidence' } } } }, { ga4: GA, posthog: null }), []);

if (cases < 50) throw new Error(`check-consent.selftest: only ${cases} case(s) ran — specimens have been removed`);
console.log(`check-consent.selftest: ${cases} case(s) — stored decisions, coverage, identifier refusal, per-provider CSP and policy disclosure each decided by its own branch`);
