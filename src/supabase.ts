import { createClient } from '@supabase/supabase-js';
import { config } from './config';

export const supabase = createClient(config.supabaseUrl, config.clePubliable);

let sessionEnCours: Promise<string> | null = null;

/** Renvoie l'identifiant du compte, en créant un compte anonyme au premier lancement. Un seul appel à la fois. */
export function assurerSession(): Promise<string> {
  sessionEnCours ??= (async () => {
    const { data, error: erreurSession } = await supabase.auth.getSession();
    // Une erreur (réseau pas prêt au réveil) ne doit pas créer un nouveau compte : on perdrait l'historique.
    if (erreurSession) throw new Error(`Session illisible, réessaie dans un instant : ${erreurSession.message}`);
    if (data.session) return data.session.user.id;
    const { data: cree, error } = await supabase.auth.signInAnonymously();
    if (error || !cree.user) throw new Error(`Connexion anonyme impossible : ${error?.message ?? 'aucun compte'}`);
    return cree.user.id;
  })().catch((erreur: unknown) => {
    sessionEnCours = null;
    throw erreur;
  });
  return sessionEnCours;
}
