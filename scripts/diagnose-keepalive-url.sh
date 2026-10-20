#!/usr/bin/env bash
# GS-O025: local, owner-run diagnosis of one keep-alive connection string. Never run by CI.
# Reads the URL from a hidden prompt (no shell history, no argv), tries one read-only login as
# the keep-alive role through a local Postgres client container, and prints only a failure
# category: never the URL, password, or libpq's raw message. Run from Git Bash:
#   bash scripts/diagnose-keepalive-url.sh
set -uo pipefail
image=public.ecr.aws/supabase/postgres:17.6.1.167
if [ -n "${DB_URL:-}" ]; then url="$DB_URL"; else read -rsp 'Paste the connection string (hidden): ' url; echo; fi
# Pasting adds invisible wrappers: bracketed-paste markers, CR/LF, a byte-order mark,
# zero-width spaces, surrounding spaces or quotes. Remove them before parsing.
url="${url//$'\e[200~'/}"; url="${url//$'\e[201~'/}"; url="${url//$'\r'/}"; url="${url//$'\n'/}"
url="${url//$'\xef\xbb\xbf'/}"; url="${url//$'\xe2\x80\x8b'/}"
url="${url#"${url%%[![:space:]]*}"}"; url="${url%"${url##*[![:space:]]}"}"
[[ "$url" == \"*\" || "$url" == \'*\' ]] && url="${url:1:${#url}-2}"
re='^postgres(ql)?://([^:@/]+):([^@]+)@([^:/?]+):([0-9]+)/([^?]+)$'
[[ "$url" =~ $re ]] || { echo 'RESULT: not a postgres URL of the form user:password@host:port/database'; exit 2; }
decode() { local value="${1//+/ }"; printf '%b' "${value//%/\\x}"; }
user=$(decode "${BASH_REMATCH[2]}"); host="${BASH_REMATCH[4]}"; port="${BASH_REMATCH[5]}"
[[ "$user" == *.* ]] && shown="${user%%.*} (ref ${user#*.})" || shown="$user (NO .ref suffix)"
echo "shape: user=$shown host-cluster=${host%%.*} port=$port database=${BASH_REMATCH[6]}"
password=$(decode "${BASH_REMATCH[3]}"); database="${BASH_REMATCH[6]}"
# Offline checks first: a wrong role or ref can never log in, so no connection is attempted.
ref="${user#*.}"; known='dqiutgmxillhsbzgnlsx (Production) qfgpwumvvtizeamkynes (Preview)'
if [[ "$user" != *.* || "${user%%.*}" != gridsmith_keepalive ]]; then
  echo "RESULT: USERNAME. It must be gridsmith_keepalive.<project ref>; nothing was sent"; exit 1
fi
if [[ "$ref" != dqiutgmxillhsbzgnlsx && "$ref" != qfgpwumvvtizeamkynes ]]; then
  echo "RESULT: REF MISMATCH. '$ref' (${#ref} characters) is not a Gridsmith project ref; expected one of: $known. Nothing was sent"; exit 1
fi
if [[ ! "$host" =~ ^aws-[0-9]+-eu-west-1\.pooler\.supabase\.com$ && -z "${DIAG_NETWORK:-}" ]]; then
  echo 'RESULT: HOST. Not an eu-west-1 session-pooler host; copy it from the project'"'"'s own Dashboard → Connect → Session pooler. Nothing was sent'; exit 1
fi
output=$(PGHOST="$host" PGPORT="$port" PGUSER="$user" PGPASSWORD="$password" PGDATABASE="$database" \
  PGSSLMODE="${PGSSLMODE:-require}" PGCONNECT_TIMEOUT=15 \
  docker run --rm --pull never ${DIAG_NETWORK:+--network "$DIAG_NETWORK"} -e PGHOST -e PGPORT -e PGUSER -e PGPASSWORD -e PGDATABASE -e PGSSLMODE -e PGCONNECT_TIMEOUT \
  "$image" psql -X -q -A -t -c "select current_user || '|' || current_setting('transaction_read_only')" 2>&1)
unset url
# Supavisor's wording varies in case; compare a lower-cased copy for routing.
lower=$(printf '%s' "$output" | tr '[:upper:]' '[:lower:]')
# Older Supavisor: "Tenant or user not found"; newer: "(ENOTFOUND) tenant/user <user> not found".
if [[ "$lower" == *tenant*'not found'* ]]; then
  echo "RESULT: POOLER ROUTING. This pooler cluster (${host%%.*}) does not serve this user and ref: use the cluster shown in the project's own Dashboard → Connect → Session pooler"; exit 1
fi
case "$output" in
  *gridsmith_keepalive*'|on'*) echo 'RESULT: OK. The login works and the session is the read-only keep-alive role' ;;
  *'could not translate host name'*|*'Name or service not known'*) echo 'RESULT: DNS. The host does not resolve; check the pooler hostname' ;;
  *'Tenant or user not found'*) echo 'RESULT: POOLER ROUTING. The pooler does not know this user on this host: wrong pooler cluster (aws-0 vs aws-1) or a wrong user/ref' ;;
  *'password authentication failed'*) echo 'RESULT: PASSWORD. The pooler found the role but rejected the password; set the password again and update the secret' ;;
  *'Connection refused'*|*'timeout expired'*|*'Network is unreachable'*|*'No route to host'*) echo 'RESULT: NETWORK. No connection on that host and port' ;;
  *'too many connections'*|*'remaining connection slots'*|*'connection limit'*) echo 'RESULT: CONNECTION LIMIT. The role already has its 2 sessions open' ;;
  *'SSL'*|*'pg_hba.conf'*) echo 'RESULT: TLS OR ACCESS POLICY. The server refused the connection settings' ;;
  *'permission denied'*) echo 'RESULT: SQL PERMISSION. The login worked, but the role lacks a privilege the check needs' ;;
  *'Unable to find image'*|*'No such image'*) echo "RESULT: TOOLING. The local image $image is missing" ;;
  *)
    # One sanitised line: the password, user, ref and host are replaced before anything is printed.
    line=$(printf '%s\n' "$output" | grep -m1 -iE 'error|fatal|failed|refused|denied|not found|timeout' || printf '%s\n' "$output" | head -1)
    line="${line//"$password"/<password>}"; line="${line//"$user"/<user>}"; line="${line//"$ref"/<ref>}"; line="${line//"$host"/<host>}"
    echo "RESULT: UNCLASSIFIED. Sanitised message: ${line:0:200}" ;;
esac
unset password
