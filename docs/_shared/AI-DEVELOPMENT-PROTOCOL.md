# AI development protocol

These rules apply to every future Gridsmith coding or documentation phase.

## Scope

- Work only on the assigned `GS-P###` phase.
- Record new findings under stable IDs; do not silently expand implementation scope.
- A recommended next task is a recommendation only. Stop after the assigned phase.

## Evidence

- Current repository/source evidence outranks stale documentation.
- Reconcile contradictions explicitly and preserve historical traceability.
- Match claims to evidence: local checks do not prove deployment, remote configuration or human
  acceptance.

## Owner facts

Never invent company facts, service offerings, prices, client evidence, testimonials, legal
commitments, insurance, qualifications, permissions or credentials. Missing owner facts are a stop
condition or an `OWNER-ACTIONS.md` item.

## Commercial policy

- `GS-D001`: do not require or fabricate public client projects, client names, identifiable work,
  client assets, engineering drawings, book covers/titles, retailer links or unapproved testimonials.
  Capability, methodology, process, disciplines, quality and division structure may be explained.
  Privately shareable examples may be offered conditionally, without promising disclosure.
- `GS-D002`: do not require or invent public fixed, starting, indicative, package, band or
  estimator-generated prices. Lead visitors toward bespoke quotation or consultation actions.

## UX

Preserve approved UX unless the assigned phase explicitly changes it. Accessibility is a launch
gate, not a polish pass.

## Security

- Never weaken security, validation, RLS, rate limits or deployment gates to obtain a pass.
- Privileged credentials remain server-only. Treat all public inputs and remote data as untrusted.

## Database

- Production Supabase schema/data mutations require explicit phase authorisation.
- Never reset a development, staging or production-like database to make a test pass.
- Use migrations and disposable verification environments where authorised; never expose privileged
  keys client-side.

## Secrets

Never commit, print, copy into chat or place secrets in client-visible variables. Report unavailable
credentials as blocked verification.

## Git

- Inspect branch, HEAD and working tree before changes.
- Preserve unrelated owner work and stage only phase-approved files.
- Commit/push only when the phase explicitly permits it. Inspect the staged snapshot, run
  `git diff --cached --check`, and perform the repository's secret checks before push.

## Deployment

- Vercel preview/staging actions require phase authorisation.
- Never deploy production or promote a deployment implicitly.
- `gridsmith.uk` production cutover requires a dedicated explicitly authorised release phase.

## DNS

Never alter Hostinger or DNS unless the assigned phase explicitly authorises it. During eventual
cutover, preserve existing mail-related DNS records unless an approved mail change requires otherwise.

## Testing

Run relevant existing verification and targeted regression tests. Do not modify unrelated checks or
lower thresholds merely to make results green. Record PASS, FAIL or BLOCKED per check.

## Documentation and handoff

- Update affected trackers and control files in the same phase.
- Every phase updates `AI-HANDOFF.md` and `PROJECT-STATUS.md`.
- Every owner dependency appears in `OWNER-ACTIONS.md` with evidence required for closure.
- Use `GS-P###`, `GS-O###`, `GS-T###`, `GS-X###`, `GS-R###` and `GS-D###`; preserve existing IDs
  such as `Q-DG1` and map rather than renumber them.

## Stop conditions

Stop and report rather than improvising when destructive production action is necessary, owner facts
or credentials are missing, a major architecture decision is required, repository state materially
conflicts with the task, security would need to be weakened, or production data could be endangered.
