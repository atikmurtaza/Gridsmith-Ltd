-- GS-O025: least-privilege login for the scheduled Supabase availability check.
-- Operator SQL, applied once per project at activation (not a migration, so the H4-B migration
-- step stays exactly one file). Idempotent. Creates the role NOLOGIN; the owner enables login with
-- a generated password in the SQL editor, so no password ever enters this public repository:
--   alter role gridsmith_keepalive login password '<generated, 32+ characters>';
-- The role has no table, schema or function privileges beyond what every role has, every
-- transaction is read-only, and statements stop after 5 seconds.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'gridsmith_keepalive') then
    create role gridsmith_keepalive nologin noinherit nosuperuser nocreatedb nocreaterole noreplication nobypassrls connection limit 2;
  end if;
end $$;
alter role gridsmith_keepalive set default_transaction_read_only = on;
alter role gridsmith_keepalive set statement_timeout = '5s';
alter role gridsmith_keepalive set idle_in_transaction_session_timeout = '10s';
revoke all on schema public from gridsmith_keepalive;
-- Verification (read-only): expect exactly one row, all flags false except the settings shown.
select rolname, rolcanlogin, rolsuper, rolcreaterole, rolcreatedb, rolbypassrls, rolconnlimit,
  (select array_agg(setting order by setting) from pg_db_role_setting s, unnest(s.setconfig) setting where s.setrole = r.oid) as settings,
  (select count(*) from information_schema.role_table_grants where grantee = 'gridsmith_keepalive') as table_grants
from pg_roles r where rolname = 'gridsmith_keepalive';
