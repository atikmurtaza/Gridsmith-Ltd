#!/usr/bin/env bash
# GS-O025: one best-effort, read-only database session for a Supabase Free-plan project.
# Supabase pauses Free projects without "sufficient user database activity" over 7 days; this is
# activity, not an uptime guarantee. Inputs: DB_URL (session-pooler URL for the gridsmith_keepalive
# role, from a GitHub secret) and REF (the expected project ref). One attempt, bounded; no retry.
# Prints only status lines; the URL, password and query results other than flags are never echoed.
set -euo pipefail
fail() { echo "::error::GS-O025 ${REF:-unknown}: $1"; [ -n "${GITHUB_STEP_SUMMARY:-}" ] && echo "FAIL ${REF:-unknown}: $1" >> "$GITHUB_STEP_SUMMARY"; exit 1; }
[[ "${REF:-}" =~ ^[a-z0-9]{20}$ ]] || fail 'REF is not a project ref'
[ -n "${DB_URL:-}" ] || fail 'DB_URL secret is not set'
re='^postgres(ql)?://([^:@/]+):([^@]+)@([^:/?]+):([0-9]+)/([^?]+)$'
[[ "$DB_URL" =~ $re ]] || fail 'DB_URL is not a postgres URL with user, password, host, port and database'
decode() { local value="${1//+/ }"; printf '%b' "${value//%/\\x}"; }
user=$(decode "${BASH_REMATCH[2]}"); password=$(decode "${BASH_REMATCH[3]}")
host="${BASH_REMATCH[4]}"; port="${BASH_REMATCH[5]}"; database="${BASH_REMATCH[6]}"
expected="gridsmith_keepalive.$REF"   # the pooler addresses a custom role as role.project_ref
if [ "${GS_O025_SELFTEST:-}" = 1 ]; then
  [[ "$host" =~ ^(127\.0\.0\.1|localhost)$ ]] || fail 'selftest requires a loopback database'
  expected=gridsmith_keepalive; export PGSSLMODE=disable
else
  [[ "$host" =~ ^aws-[0-9]+-eu-west-1\.pooler\.supabase\.com$ ]] || fail 'host is not the eu-west-1 session pooler'
  [ "$port" = 5432 ] || fail 'port is not the session pooler (5432)'
  export PGSSLMODE=require
fi
[ "$user" = "$expected" ] || fail "user is not $expected"
[ "$database" = postgres ] || fail 'database is not postgres'
export PGHOST="$host" PGPORT="$port" PGUSER="$user" PGPASSWORD="$password" PGDATABASE="$database" \
  PGCONNECT_TIMEOUT=15 PGAPPNAME=gridsmith-o025
unset DB_URL
# Three read-only statements in one session: "a few user requests to the database".
if ! result=$(timeout 45 psql -X -q -A -t -v ON_ERROR_STOP=1 -F '|' \
  -c "select current_user, current_setting('transaction_read_only')" \
  -c "select count(*) > 0 from pg_catalog.pg_class" \
  -c "select now() is not null" 2>/dev/null); then
  fail 'database session failed or timed out (project paused, credential rejected or pooler unavailable)'
fi
[ "$(printf '%s\n' "$result" | sed -n 1p)" = 'gridsmith_keepalive|on' ] || fail 'session was not the read-only gridsmith_keepalive role'
[ "$(printf '%s\n' "$result" | sed -n 2,3p | tr '\n' ' ')" = 't t ' ] || fail 'read-only queries returned an unexpected result'
echo "GS-O025 $REF: ok (read-only session as gridsmith_keepalive, 3 statements)"
[ -n "${GITHUB_STEP_SUMMARY:-}" ] && echo "ok $REF $(date -u +%FT%TZ)" >> "$GITHUB_STEP_SUMMARY"
exit 0
