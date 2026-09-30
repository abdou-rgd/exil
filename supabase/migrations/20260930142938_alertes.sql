-- Étape 0.b : séries, alertes, jetons d'accusé, distribution par pg_cron.

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

-- Réglages globaux : une seule ligne.
create table prive.config (
  id boolean primary key default true check (id),
  envoi_actif boolean not null default true,
  plafond_compte int not null default 30,
  plafond_global int not null default 300
);
insert into prive.config default values;
alter table prive.config enable row level security;
revoke all on prive.config from public, anon, authenticated;

create table public.series (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('rapide', 'serie', 'longue')),
  situation text not null check (char_length(situation) between 1 and 60),
  format text not null check (format in ('classique', 'declaratif')),
  creee_a timestamptz not null default now(),
  annulee_a timestamptz
);

create table public.alertes (
  id uuid primary key default gen_random_uuid(),
  serie_id uuid not null references public.series (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  prevue_a timestamptz not null,
  etat text not null default 'prevue' check (etat in ('prevue', 'en_cours', 'envoyee', 'annulee', 'echouee')),
  tentatives int not null default 0,
  prise_a timestamptz,
  recue_ef_a timestamptz,
  reponse_apple_a timestamptz,
  code_apple int,
  apns_id text,
  accuse_serveur_a timestamptz,
  accuse_appareil_a timestamptz,
  decalage_ms int,
  vue_a timestamptz
);
create index alertes_dues on public.alertes (prevue_a) where etat = 'prevue';
create index alertes_en_cours on public.alertes (prise_a) where etat = 'en_cours';
create index alertes_par_compte on public.alertes (user_id, prevue_a desc);
create index alertes_par_serie on public.alertes (serie_id);
create index series_par_compte on public.series (user_id);

alter table public.series enable row level security;
alter table public.alertes enable row level security;
revoke all on public.series, public.alertes from public, anon, authenticated;
grant select on public.series, public.alertes to authenticated;
create policy series_lecture on public.series for select to authenticated using (user_id = (select auth.uid()));
create policy alertes_lecture on public.alertes for select to authenticated using (user_id = (select auth.uid()));

create table prive.jetons (
  alerte_id uuid primary key references public.alertes (id) on delete cascade,
  jeton text not null,
  accuse_utilise_a timestamptz,
  vue_utilise_a timestamptz
);
alter table prive.jetons enable row level security;
revoke all on prive.jetons from public, anon, authenticated;

-- Intervalles tirés uniformément entre 180 et 1500 secondes.
create function prive.tirer_intervalles(p_n int)
returns interval[]
language sql
volatile
set search_path = ''
as $$
  select array_agg(make_interval(secs => 180 + floor(random() * 1321)::int) order by i)
  from generate_series(1, p_n) as i;
$$;

create function prive.programmer(p_type text, p_situation text, p_format text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_config prive.config;
  v_delais interval[];
  v_delai interval;
  v_heure timestamptz := now();
  v_en_attente int;
  v_serie uuid;
begin
  if v_uid is null then
    raise exception 'non authentifié';
  end if;
  if p_type = 'rapide' then
    v_delais := array[interval '60 seconds'];
  elsif p_type = 'serie' then
    v_delais := prive.tirer_intervalles(10);
  elsif p_type = 'longue' then
    v_delais := array[interval '7 days', interval '7 days'];
  else
    raise exception 'type inconnu';
  end if;

  -- Un seul programmeur à la fois : les plafonds restent exacts.
  perform pg_advisory_xact_lock(424242);
  select * into v_config from prive.config;
  select count(*) into v_en_attente from public.alertes a where a.user_id = v_uid and a.etat in ('prevue', 'en_cours');
  if v_en_attente + cardinality(v_delais) > v_config.plafond_compte then
    raise exception 'plafond du compte atteint : annule une série en cours';
  end if;
  select count(*) into v_en_attente from public.alertes a where a.etat in ('prevue', 'en_cours');
  if v_en_attente + cardinality(v_delais) > v_config.plafond_global then
    raise exception 'plafond global atteint';
  end if;

  insert into public.series (user_id, type, situation, format)
  values (v_uid, p_type, p_situation, p_format)
  returning id into v_serie;

  foreach v_delai in array v_delais loop
    v_heure := v_heure + v_delai;
    with nouvelle as (
      insert into public.alertes (serie_id, user_id, prevue_a)
      values (v_serie, v_uid, v_heure)
      returning id
    )
    insert into prive.jetons (alerte_id, jeton)
    select nouvelle.id, encode(extensions.gen_random_bytes(16), 'hex') from nouvelle;
  end loop;

  return v_serie;
end;
$$;

create function prive.annuler_serie(p_serie uuid)
returns table (annulees int, trop_tard int)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_annulees int;
  v_trop_tard int;
begin
  if not exists (select 1 from public.series s where s.id = p_serie and s.user_id = auth.uid()) then
    raise exception 'série inconnue';
  end if;
  with maj as (
    update public.alertes a set etat = 'annulee'
    where a.serie_id = p_serie and a.etat = 'prevue'
    returning 1
  )
  select count(*) into v_annulees from maj;
  select count(*) into v_trop_tard from public.alertes a where a.serie_id = p_serie and a.etat = 'en_cours';
  update public.series s set annulee_a = now() where s.id = p_serie;
  return query select v_annulees, v_trop_tard;
end;
$$;

-- Appelée par pg_cron : péremption, reprise, puis sélection d'au plus 50 alertes dues.
create function prive.prendre_lot()
returns uuid[]
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_ids uuid[];
begin
  if not (select c.envoi_actif from prive.config c) then
    return '{}';
  end if;

  update public.alertes a set etat = 'echouee'
  where (a.etat = 'en_cours' and a.prise_a < now() - interval '60 seconds' and a.tentatives >= 3)
     or (a.etat = 'prevue' and a.prevue_a < now() - interval '10 minutes');

  with lot as (
    select a.id from public.alertes a
    where (a.etat = 'prevue' and a.prevue_a <= now())
       or (a.etat = 'en_cours' and a.prise_a < now() - interval '60 seconds' and a.tentatives < 3)
    order by a.prevue_a
    limit 50
    for update skip locked
  ), maj as (
    update public.alertes a
    set etat = 'en_cours', prise_a = now(), tentatives = a.tentatives + 1
    from lot
    where a.id = lot.id
    returning a.id
  )
  select coalesce(array_agg(maj.id), '{}') into v_ids from maj;
  return v_ids;
end;
$$;

create function prive.distribuer()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_ids uuid[] := prive.prendre_lot();
  v_url text;
  v_secret text;
begin
  if cardinality(v_ids) = 0 then
    return;
  end if;
  select s.decrypted_secret into v_url from vault.decrypted_secrets s where s.name = 'envoi_url';
  select s.decrypted_secret into v_secret from vault.decrypted_secrets s where s.name = 'envoi_secret';
  perform net.http_post(
    url := v_url,
    body := jsonb_build_object('ids', to_jsonb(v_ids)),
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-envoi-secret', v_secret),
    timeout_milliseconds := 15000
  );
end;
$$;

-- Appelée par l'Edge Function : revérifie l'état et renvoie de quoi envoyer.
create function prive.preparer_envoi(p_alerte uuid)
returns table (
  alerte_id uuid,
  serie_id uuid,
  format text,
  prevue_a timestamptz,
  jeton text,
  endpoint text,
  p256dh text,
  auth text
)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
begin
  update public.alertes a set recue_ef_a = now() where a.id = p_alerte and a.etat = 'en_cours';
  if not found then
    return;
  end if;
  if not exists (
    select 1 from prive.abonnements b join public.alertes a on a.user_id = b.user_id where a.id = p_alerte
  ) then
    update public.alertes a set etat = 'echouee' where a.id = p_alerte;
    return;
  end if;
  return query
    select a.id, a.serie_id, s.format, a.prevue_a, j.jeton, b.endpoint, b.p256dh, b.auth
    from public.alertes a
    join public.series s on s.id = a.serie_id
    join prive.jetons j on j.alerte_id = a.id
    join prive.abonnements b on b.user_id = a.user_id
    where a.id = p_alerte;
end;
$$;

-- Appelée par l'Edge Function juste après chaque réponse du service push.
create function prive.noter_reponse(p_alerte uuid, p_code int, p_apns_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.alertes a
  set reponse_apple_a = now(),
      code_apple = p_code,
      apns_id = p_apns_id,
      etat = case
        when p_code between 200 and 299 then 'envoyee'
        when p_code in (404, 410) then 'echouee'
        else a.etat
      end
  where a.id = p_alerte and a.etat = 'en_cours';
  if p_code in (404, 410) then
    delete from prive.abonnements b using public.alertes a where a.id = p_alerte and b.user_id = a.user_id;
  end if;
end;
$$;

-- Appelées par le service worker, sans session : le jeton fait foi, une seule fois.
create function prive.accuser_reception(p_alerte uuid, p_jeton text, p_heure_appareil timestamptz, p_decalage_ms int)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update prive.jetons j set accuse_utilise_a = now()
  where j.alerte_id = p_alerte and j.jeton = p_jeton and j.accuse_utilise_a is null;
  if found then
    update public.alertes a
    set accuse_serveur_a = now(),
        accuse_appareil_a = p_heure_appareil,
        decalage_ms = case when abs(p_decalage_ms) < 86400000 then p_decalage_ms end
    where a.id = p_alerte;
  end if;
end;
$$;

create function prive.marquer_vue(p_alerte uuid, p_jeton text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update prive.jetons j set vue_utilise_a = now()
  where j.alerte_id = p_alerte and j.jeton = p_jeton and j.vue_utilise_a is null;
  if found then
    update public.alertes a set vue_a = now() where a.id = p_alerte;
  end if;
end;
$$;

-- Fonctions fines exposées au client.
create function public.programmer(p_type text, p_situation text, p_format text)
returns uuid
language sql
security invoker
set search_path = ''
as $$
  select prive.programmer(p_type, p_situation, p_format);
$$;

create function public.annuler_serie(p_serie uuid)
returns table (annulees int, trop_tard int)
language sql
security invoker
set search_path = ''
as $$
  select * from prive.annuler_serie(p_serie);
$$;

create function public.accuser_reception(p_alerte uuid, p_jeton text, p_heure_appareil timestamptz, p_decalage_ms int)
returns void
language sql
security invoker
set search_path = ''
as $$
  select prive.accuser_reception(p_alerte, p_jeton, p_heure_appareil, p_decalage_ms);
$$;

create function public.marquer_vue(p_alerte uuid, p_jeton text)
returns void
language sql
security invoker
set search_path = ''
as $$
  select prive.marquer_vue(p_alerte, p_jeton);
$$;

-- Droits : rien par défaut, puis le strict nécessaire.
revoke execute on all functions in schema prive from public, anon, authenticated;
revoke execute on function
  public.programmer(text, text, text),
  public.annuler_serie(uuid),
  public.accuser_reception(uuid, text, timestamptz, int),
  public.marquer_vue(uuid, text)
from public, anon, authenticated;

grant execute on function
  prive.enregistrer_abonnement(text, text, text, text),
  prive.etat_abonnement(),
  prive.programmer(text, text, text),
  prive.annuler_serie(uuid),
  public.programmer(text, text, text),
  public.annuler_serie(uuid)
to authenticated;

grant execute on function
  prive.accuser_reception(uuid, text, timestamptz, int),
  prive.marquer_vue(uuid, text),
  public.accuser_reception(uuid, text, timestamptz, int),
  public.marquer_vue(uuid, text)
to anon, authenticated;

-- Tâches planifiées.
select cron.schedule('distribuer-alertes', '10 seconds', $$select prive.distribuer()$$);
select cron.schedule(
  'purger-historique-cron',
  '17 3 * * *',
  $$delete from cron.job_run_details where end_time < now() - interval '7 days'$$
);
