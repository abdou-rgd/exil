-- Durcissement après relecture de la phase 0.b.

-- Une seule exécution de l'Edge Function peut prendre une tentative donnée :
-- recue_ef_a est posé une fois par tentative (prise_a change à chaque reprise).
create or replace function prive.preparer_envoi(p_alerte uuid)
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
  update public.alertes a set recue_ef_a = now()
  where a.id = p_alerte
    and a.etat = 'en_cours'
    and (a.recue_ef_a is null or a.recue_ef_a < a.prise_a);
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

-- Le code 0 signifie « pas de réponse » (erreur réseau, délai dépassé) : on n'horodate pas de réponse d'Apple.
create or replace function prive.noter_reponse(p_alerte uuid, p_code int, p_apns_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.alertes a
  set reponse_apple_a = case when p_code > 0 then now() end,
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

-- Un secret manquant dans le coffre fait échouer la tâche visiblement (cron.job_run_details) :
-- la transaction est annulée et les alertes restent « prevue ».
create or replace function prive.distribuer()
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
  if v_url is null or v_secret is null then
    raise exception 'secret envoi_url ou envoi_secret absent du coffre';
  end if;
  perform net.http_post(
    url := v_url,
    body := jsonb_build_object('ids', to_jsonb(v_ids)),
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-envoi-secret', v_secret),
    timeout_milliseconds := 15000
  );
end;
$$;
