-- La ligne « alter default privileges in schema prive … » de la migration précédente est sans effet :
-- un réglage par schéma ne peut qu'ajouter des droits au réglage global, jamais en retirer.
-- On retire donc le droit d'exécution de PUBLIC au niveau global, pour les fonctions créées par postgres.
-- Le schéma public n'est pas affecté : Supabase y accorde explicitement anon, authenticated et service_role,
-- et nos migrations fixent de toute façon les droits de chaque fonction.
alter default privileges revoke execute on functions from public;
