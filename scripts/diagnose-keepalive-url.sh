#!/usr/bin/env bash
# GS-O025: local, owner-run diagnosis of one keep-alive connection string. Never run by CI.
# Reads the URL from a hidden prompt (no shell history, no argv), tries one read-only login as
# the keep-alive role through a local Postgres client container, and prints only a failure
# category: never the URL, password, or libpq's raw message. Run from Git Bash:
#   bash scripts/diagnose-keepalive-url.sh
set -uo pipefail
image=public.ecr.aws/supabase/postgres:17.6.1.167
if [ -n "${DB_URL:-}" ]; then url="$DB_URL"; else read -rsp 'Paste the connection string (hidden): ' url; echo; fi
re='^postgres(ql)?://([^:@/]+):([^@]+)@([^:/?]+):([0-9]+)/([^?]+)$'
[[ "$url" =~ $re ]] || { echo 'RESULT: not a postgres URL of the form user:password@host:port/database'; exit 2; }
decode() { local value="${1//+/ }"; printf '%b' "${value//%/\\x}"; }
user=$(decode "${BASH_REMATCH[2]}"); host="${BASH_REMATCH[4]}"; port="${BASH_REMATCH[5]}"
[[ "$user" == *.* ]] && shown="${user%%.*} (ref ${user#*.})" || shown="$user (NO .ref suffix)"
echo "shape: user=$shown host-cluster=${host%%.*} port=$port database=${BASH_REMATCH[6]}"
output=$(PGHOST="$host" PGPORT="$port" PGUSER="$user" PGPASSWORD="$(decode "${BASH_REMATCH[3]}")" PGDATABASE="${BASH_REMATCH[6]}" \
  PGSSLMODE="${PGSSLMODE:-require}" PGCONNECT_TIMEOUT=15 \
  docker run --rm --pull never ${DIAG_NETWORK:+--network "$DIAG_NETWORK"} -e PGHOST -e PGPORT -e PGUSER -e PGPASSWORD -e PGDATABASE -e PGSSLMODE -e PGCONNECT_TIMEOUT \
  "$image" psql -X -q -A -t -c "select current_user || '|' || current_setting('transaction_read_only')" 2>&1)
unset url
case "$output" in
  *'gridsmith_keepalive|on'*) echo 'RESULT: OK. The login works and the session is the read-only keep-alive role' ;;
  *'could not translate host name'*|*'Name or service not known'*) echo 'RESULT: DNS. The host does not resolve; check the pooler hostname' ;;
  *'Tenant or user not found'*) echo 'RESULT: POOLER ROUTING. The pooler does not know this user on this host: wrong pooler cluster (aws-0 vs aws-1) or a wrong user/ref' ;;
  *'password authentication failed'*) echo 'RESULT: PASSWORD. The pooler found the role but rejected the password; set the password again and update the secret' ;;
  *'Connection refused'*|*'timeout expired'*|*'Network is unreachable'*|*'No route to host'*) echo 'RESULT: NETWORK. No connection on that host and port' ;;
  *'too many connections'*|*'remaining connection slots'*|*'connection limit'*) echo 'RESULT: CONNECTION LIMIT. The role already has its 2 sessions open' ;;
  *'SSL'*|*'pg_hba.conf'*) echo 'RESULT: TLS OR ACCESS POLICY. The server refused the connection settings' ;;
  *'permission denied'*) echo 'RESULT: SQL PERMISSION. The login worked, but the role lacks a privilege the check needs' ;;
  *'Unable to find image'*|*'No such image'*) echo "RESULT: TOOLING. The local image $image is missing" ;;
  *) echo 'RESULT: UNCLASSIFIED. The login failed for another reason; no detail is printed, to protect the credential' ;;
esac
