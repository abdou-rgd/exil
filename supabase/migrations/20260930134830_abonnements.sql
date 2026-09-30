-- Étape 0.a : schéma privé, abonnements aux notifications, heure du serveur.

create schema if not exists prive;
revoke all on schema prive from public;
grant usage on schema prive to anon, authenticated;

create table prive.abonnements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  plateforme text not null default 'webpush' check (plateforme in ('webpush', 'apns')),
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  user_agent text,
  cree_a timestamptz not null default now(),
  vu_a timestamptz not null default now()
);
alter table prive.abonnements enable row level security;
revoke all on prive.abonnements from public, anon, authenticated;

create function prive.enregistrer_abonnement(p_endpoint text, p_p256dh text, p_auth text, p_user_agent text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'non authentifié';
  end if;
  if char_length(p_endpoint) > 1000
     or p_endpoint !~ '^https://([a-z0-9-]+\.)*(push\.apple\.com|fcm\.googleapis\.com|push\.services\.mozilla\.com)/' then
    raise exception 'adresse d''abonnement refusée';
  end if;
  if char_length(p_p256dh) > 200 or char_length(p_auth) > 100 then
    raise exception 'clés d''abonnement invalides';
  end if;
  insert into prive.abonnements as a (user_id, endpoint, p256dh, auth, user_agent)
  values (v_uid, p_endpoint, p_p256dh, p_auth, left(p_user_agent, 300))
  on conflict (user_id) do update set
    cree_a = case when a.endpoint = excluded.endpoint then a.cree_a else now() end,
    endpoint = excluded.endpoint,
    p256dh = excluded.p256dh,
    auth = excluded.auth,
    user_agent = excluded.user_agent,
    vu_a = now();
end;
$$;

create function prive.etat_abonnement()
returns table (abonne boolean, cree_a timestamptz, vu_a timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select b.id is not null, b.cree_a, b.vu_a
  from (select auth.uid() as uid) moi
  left join prive.abonnements b on b.user_id = moi.uid;
$$;

create function public.enregistrer_abonnement(p_endpoint text, p_p256dh text, p_auth text, p_user_agent text)
returns void
language sql
security invoker
set search_path = ''
as $$
  select prive.enregistrer_abonnement(p_endpoint, p_p256dh, p_auth, p_user_agent);
$$;

create function public.etat_abonnement()
returns table (abonne boolean, cree_a timestamptz, vu_a timestamptz)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from prive.etat_abonnement();
$$;

create function public.heure_serveur()
returns timestamptz
language sql
volatile
security invoker
set search_path = ''
as $$
  select clock_timestamp();
$$;

revoke execute on all functions in schema prive from public, anon, authenticated;
revoke execute on function
  public.enregistrer_abonnement(text, text, text, text),
  public.etat_abonnement(),
  public.heure_serveur()
from public, anon;
grant execute on function prive.enregistrer_abonnement(text, text, text, text), prive.etat_abonnement() to authenticated;
grant execute on function
  public.enregistrer_abonnement(text, text, text, text),
  public.etat_abonnement(),
  public.heure_serveur()
to authenticated;
