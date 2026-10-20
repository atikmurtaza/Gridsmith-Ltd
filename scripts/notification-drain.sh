#!/usr/bin/env bash
# GS-O025: scheduled processing of pending Production notification retries.
# Calls the private worker with the drain-only credential: ANON_KEY passes the gateway's JWT check,
# DRAIN_TOKEN authorises `drain` and nothing else. The worker refuses (409) unless Production is
# `live`. One attempt, bounded; no retry. Secrets reach curl through stdin, never argv or logs.
# Any non-200, a dead or unconfirmed job, or "not live" fails the run, so GitHub notifies the owner.
set -euo pipefail
fail() { echo "::error::GS-O025 drain: $1"; [ -n "${GITHUB_STEP_SUMMARY:-}" ] && echo "FAIL drain: $1" >> "$GITHUB_STEP_SUMMARY"; exit 1; }
url='https://dqiutgmxillhsbzgnlsx.supabase.co/functions/v1/gs-notification-worker'
if [ "${GS_O025_SELFTEST:-}" = 1 ]; then
  [[ "${DRAIN_URL:-}" =~ ^http://127\.0\.0\.1:[0-9]+/ ]] || fail 'selftest requires a loopback DRAIN_URL'
  url="$DRAIN_URL"
fi
[ -n "${ANON_KEY:-}" ] || fail 'ANON_KEY secret is not set'
token="${DRAIN_TOKEN:-}"; [ "${#token}" -ge 32 ] || fail 'DRAIN_TOKEN secret is missing or shorter than 32 characters'
body=$(mktemp); trap 'rm -f "$body"' EXIT
status=$(curl -sS --max-time 60 --retry 0 -o "$body" -w '%{http_code}' -K - 2>/dev/null <<EOF || true
url = "$url"
request = "POST"
header = "Authorization: Bearer $ANON_KEY"
header = "X-Gridsmith-Drain-Token: $token"
header = "Content-Type: application/json"
data = "{\"operation\":\"drain\"}"
EOF
)
unset ANON_KEY DRAIN_TOKEN token
case "$status" in
  200) ;;
  409) fail 'Production is not in live mode; the scheduled drain must not be enabled yet' ;;
  401|403) fail "worker refused the drain credential ($status)" ;;
  503) fail 'worker unavailable or mail not configured (503); pending work is retained' ;;
  000|'') fail 'worker unreachable or timed out (project paused or network failure)' ;;
  *) fail "unexpected worker status $status" ;;
esac
count() { sed -n "s/.*\"$1\":\([0-9][0-9]*\).*/\1/p" "$body"; }
claimed=$(count claimed); sent=$(count sent); retry=$(count retry); dead=$(count dead); unconfirmed=$(count unconfirmed)
for value in "$claimed" "$sent" "$retry" "$dead" "$unconfirmed"; do
  [[ "$value" =~ ^[0-9]+$ ]] || fail 'worker response was not the expected aggregate'
done
line="claimed=$claimed sent=$sent retry=$retry dead=$dead unconfirmed=$unconfirmed"
echo "GS-O025 drain: $line"
[ -n "${GITHUB_STEP_SUMMARY:-}" ] && echo "drain $(date -u +%FT%TZ) $line" >> "$GITHUB_STEP_SUMMARY"
[ "$dead" = 0 ] && [ "$unconfirmed" = 0 ] || fail "operator review needed: $line"
exit 0
