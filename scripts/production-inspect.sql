-- GS-R13-H4B: read-only Production inspection. Counts and metadata only; no lead contents.
-- npx supabase@2.119.0 db query --linked --project-ref dqiutgmxillhsbzgnlsx --file scripts/production-inspect.sql --output json
begin transaction read only;
select json_build_object(
  'database', current_database(), 'version', current_setting('server_version'), 'readOnly', current_setting('transaction_read_only'),
  'leads', (select count(*) from public.leads),
  'leadsCreatedRange', (select json_build_object('min', min(created_at)::date, 'max', max(created_at)::date) from public.leads),
  'otherPublicRows', (select json_object_agg(c.relname, c.reltuples::bigint) from pg_class c where c.relnamespace = 'public'::regnamespace and c.relkind = 'r'),
  'ledger', (select json_agg(json_build_object('name', name, 'sha', sha, 'applied', applied_at::date) order by name) from public._gridsmith_migrations),
  'rls', (select json_object_agg(relname, relrowsecurity) from pg_class where relnamespace = 'public'::regnamespace and relkind = 'r'),
  'publicPolicies', (select count(*) from pg_policies where schemaname = 'public'),
  'anonAuthenticatedTableGrants', (select count(*) from information_schema.role_table_grants where grantee in ('anon', 'authenticated') and table_schema = 'public'),
  'anonAuthenticatedRoutineGrants', (select count(*) from information_schema.role_routine_grants where grantee in ('anon', 'authenticated') and routine_schema = 'public'),
  'leadConstraints', (select count(*) from pg_constraint where conrelid = 'public.leads'::regclass),
  'privateSchema', (select count(*) from pg_namespace where nspname = 'gridsmith_private'),
  'h4bRoutines', (select json_agg(proname order by proname) from pg_proc where pronamespace = 'public'::regnamespace and proname like 'gs\_%'),
  'publicViews', (select json_agg(json_build_object('view', relname, 'options', reloptions)) from pg_class where relnamespace = 'public'::regnamespace and relkind = 'v'),
  'extensions', (select json_agg(extname order by extname) from pg_extension),
  'authUsers', (select count(*) from auth.users),
  'storageBuckets', (select count(*) from storage.buckets),
  'storageObjects', (select count(*) from storage.objects),
  'databaseBytes', pg_database_size(current_database())
) as inspection;
commit;
