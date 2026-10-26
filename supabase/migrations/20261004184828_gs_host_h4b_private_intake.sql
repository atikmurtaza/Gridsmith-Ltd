-- H4-B additive private admission/outbox. Preview first; Production application prohibited.
create schema gridsmith_private;
revoke all on schema gridsmith_private from public, anon, authenticated;
grant usage on schema gridsmith_private to service_role;

create table gridsmith_private.intake_state (
  singleton boolean primary key default true check (singleton),
  window_started timestamptz not null default now(),
  window_count integer not null default 0 check (window_count >= 0),
  day_started date not null default (now() at time zone 'UTC')::date,
  day_count integer not null default 0 check (day_count >= 0),
  window_seconds integer not null default 900 check (window_seconds between 60 and 86400),
  window_limit integer not null default 5 check (window_limit between 1 and 20),
  day_limit integer not null default 40 check (day_limit between 1 and 80),
  queue_limit integer not null default 50 check (queue_limit between 1 and 100)
);
insert into gridsmith_private.intake_state(singleton) values (true);

create table gridsmith_private.notification_outbox (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  request_digest text not null check (request_digest ~ '^[0-9a-f]{64}$'),
  form_type text not null check (form_type in ('contact','press')),
  lead_id uuid not null unique references public.leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  state text not null default 'pending' check (state in ('pending','processing','retry','sent','dead')),
  attempts integer not null default 0 check (attempts between 0 and 5),
  first_attempt timestamptz,
  last_attempt timestamptz,
  next_attempt timestamptz not null default now(),
  lease_token uuid,
  lease_until timestamptz,
  sent_at timestamptz,
  failure_category text check (failure_category in ('temporary','permanent','ambiguous','expired')),
  check ((state = 'processing' and lease_token is not null and lease_until is not null) or
    (state <> 'processing' and lease_token is null and lease_until is null)),
  check ((state = 'sent') = (sent_at is not null))
);
create index notification_outbox_due on gridsmith_private.notification_outbox(next_attempt)
  where state in ('pending','retry','processing');
alter table gridsmith_private.intake_state enable row level security;
alter table gridsmith_private.notification_outbox enable row level security;
revoke all on gridsmith_private.intake_state, gridsmith_private.notification_outbox from public, anon, authenticated;
grant select, insert, update on gridsmith_private.intake_state, gridsmith_private.notification_outbox to service_role;

create function public.gs_intake_admit(p_request_id uuid, p_form text, p_lead jsonb)
returns jsonb language plpgsql security invoker set search_path = pg_catalog as $$
declare
  limits gridsmith_private.intake_state%rowtype;
  previous gridsmith_private.notification_outbox%rowtype;
  submitted public.leads%rowtype;
  fingerprint text;
  new_lead uuid;
begin
  if p_request_id is null or p_form not in ('contact','press') or p_form is null or
     p_lead is null or jsonb_typeof(p_lead) <> 'object' or octet_length(p_lead::text) > 65536 or
     exists(select 1 from jsonb_object_keys(p_lead) k where k not in
       ('division','lead_type','service_slug','full_name','email','company','role','phone','message',
        'budget_band','timeline','payload','source','medium','campaign','referrer','landing_page','is_ai_referral')) or
     p_lead->>'lead_type' is distinct from 'enquiry' or
     (p_form = 'press' and p_lead->>'division' is distinct from 'press') then
    raise exception using errcode='22023', message='Invalid admission input';
  end if;
  -- Serialize all admissions before checking capacity, duplicate identity and counters.
  select * into strict limits from gridsmith_private.intake_state where singleton for update;
  fingerprint := encode(sha256(convert_to(p_form || p_lead::text,'UTF8')),'hex');
  select * into previous from gridsmith_private.notification_outbox where request_id=p_request_id;
  if found then
    if previous.request_digest <> fingerprint then return jsonb_build_object('outcome','conflict'); end if;
    return jsonb_build_object('outcome','accepted','id',previous.lead_id);
  end if;
  if now() >= limits.window_started + make_interval(secs => limits.window_seconds) then
    limits.window_started := now(); limits.window_count := 0;
  end if;
  if limits.day_started <> (now() at time zone 'UTC')::date then
    limits.day_started := (now() at time zone 'UTC')::date; limits.day_count := 0;
  end if;
  if limits.window_count >= limits.window_limit or limits.day_count >= limits.day_limit or
    (select count(*) from gridsmith_private.notification_outbox where state in ('pending','processing','retry')) >= limits.queue_limit then
    return jsonb_build_object('outcome','capacity');
  end if;
  submitted := jsonb_populate_record(null::public.leads,p_lead);
  new_lead := gen_random_uuid();
  insert into public.leads(id,division,lead_type,service_slug,full_name,email,company,role,phone,message,
    budget_band,timeline,payload,source,medium,campaign,referrer,landing_page,is_ai_referral)
  values(new_lead,submitted.division,submitted.lead_type,submitted.service_slug,submitted.full_name,submitted.email,
    submitted.company,submitted.role,submitted.phone,submitted.message,submitted.budget_band,submitted.timeline,
    coalesce(submitted.payload,'{}'::jsonb),submitted.source,submitted.medium,submitted.campaign,submitted.referrer,
    submitted.landing_page,coalesce(submitted.is_ai_referral,false));
  insert into gridsmith_private.notification_outbox(request_id,request_digest,form_type,lead_id)
    values(p_request_id,fingerprint,p_form,new_lead);
  update gridsmith_private.intake_state set window_started=limits.window_started,
    window_count=limits.window_count+1,day_started=limits.day_started,day_count=limits.day_count+1 where singleton;
  return jsonb_build_object('outcome','accepted','id',new_lead);
end $$;

create function public.gs_notification_claim(p_batch integer default 5)
returns jsonb language plpgsql security invoker set search_path = pg_catalog as $$
declare claimed jsonb;
begin
  if p_batch is null or p_batch not between 1 and 5 then raise exception 'Invalid batch'; end if;
  update gridsmith_private.notification_outbox set state='dead',failure_category='expired',lease_token=null,lease_until=null
    where state in ('pending','retry','processing') and
      (state <> 'processing' or lease_until < now()) and
      (attempts >= 5 or first_attempt < now()-interval '23 hours');
  with subjects as (
    select id from gridsmith_private.notification_outbox where
      ((state in ('pending','retry') and next_attempt <= now()) or (state='processing' and lease_until < now()))
      and attempts < 5 and (first_attempt is null or first_attempt >= now()-interval '23 hours')
      order by next_attempt,id limit p_batch for update skip locked
  ), leased as (
    update gridsmith_private.notification_outbox o set state='processing',attempts=o.attempts+1,
      first_attempt=coalesce(o.first_attempt,now()),last_attempt=now(),lease_token=gen_random_uuid(),
      lease_until=now()+interval '120 seconds' from subjects s where o.id=s.id returning o.*
  ) select coalesce(jsonb_agg(jsonb_build_object('id',o.id,'lead_id',o.lead_id,'lease_token',o.lease_token,
      'attempts',o.attempts,'form_type',o.form_type,'lead',jsonb_build_object('division',l.division,
      'lead_type',l.lead_type,'service_slug',l.service_slug,'full_name',l.full_name,'email',l.email,
      'company',l.company,'phone',l.phone))), '[]'::jsonb) into claimed
    from leased o join public.leads l on l.id=o.lead_id;
  return claimed;
end $$;

create function public.gs_notification_finish(p_id uuid,p_lease uuid,p_outcome text)
returns text language plpgsql security invoker set search_path = pg_catalog as $$
declare work gridsmith_private.notification_outbox%rowtype; completed text;
begin
  if p_outcome not in ('sent','temporary','permanent','ambiguous') or p_outcome is null then raise exception 'Invalid outcome'; end if;
  select * into work from gridsmith_private.notification_outbox where id=p_id for update;
  if not found or work.state <> 'processing' or work.lease_token is distinct from p_lease or work.lease_until <= now() then return null; end if;
  if p_outcome='sent' then
    completed := 'sent';
    update gridsmith_private.notification_outbox set state='sent',sent_at=now(),lease_token=null,lease_until=null,
      failure_category=null where id=p_id;
    update public.leads set notified_at=now() where id=work.lead_id;
  else
    completed := case when p_outcome='permanent' or work.attempts>=5 or work.first_attempt<now()-interval '23 hours' then 'dead' else 'retry' end;
    update gridsmith_private.notification_outbox set
      state=completed,
      failure_category=p_outcome,lease_token=null,lease_until=null,
      next_attempt=now()+make_interval(secs => (array[60,300,900,3600,7200])[work.attempts]) where id=p_id;
  end if;
  return completed;
end $$;

create function public.gs_notification_health()
returns jsonb language sql security invoker set search_path = pg_catalog as $$
  select jsonb_build_object('pending',count(*) filter(where state='pending'),
    'processing',count(*) filter(where state='processing'),'retry',count(*) filter(where state='retry'),
    'dead',count(*) filter(where state='dead'),'sent',count(*) filter(where state='sent'),
    'oldest_pending_seconds',coalesce(extract(epoch from now()-min(created_at) filter(where state in ('pending','retry','processing'))),0))
  from gridsmith_private.notification_outbox;
$$;

revoke all on function public.gs_intake_admit(uuid,text,jsonb),public.gs_notification_claim(integer),
  public.gs_notification_finish(uuid,uuid,text),public.gs_notification_health() from public,anon,authenticated;
grant execute on function public.gs_intake_admit(uuid,text,jsonb),public.gs_notification_claim(integer),
  public.gs_notification_finish(uuid,uuid,text),public.gs_notification_health() to service_role;
