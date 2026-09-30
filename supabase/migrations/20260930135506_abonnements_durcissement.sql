-- Durcissement après relecture de la phase 0.a.

-- Toute future fonction du schéma privé naît fermée : le droit d'exécution s'accorde explicitement.
alter default privileges in schema prive revoke execute on functions from public;

-- Un même téléphone (même endpoint) ne reste abonné que sous un seul compte,
-- sinon un nouveau compte anonyme sur le même appareil recevrait chaque alerte en double.
create or replace function prive.enregistrer_abonnement(p_endpoint text, p_p256dh text, p_auth text, p_user_agent text)
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
  delete from prive.abonnements b where b.endpoint = p_endpoint and b.user_id <> v_uid;
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
