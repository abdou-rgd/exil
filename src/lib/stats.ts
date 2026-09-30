import type { AlerteLue } from './types';

export const SEUIL_RETARD_S = 30;
export const DELAI_PERTE_MS = 10 * 60 * 1000;

export type Issue = 'reussie' | 'en_retard' | 'perdue' | 'echouee' | 'en_attente' | 'annulee';

/** Heure du téléphone corrigée du décalage si possible, sinon heure d'arrivée de l'accusé sur le serveur. */
export function retardSecondes(a: AlerteLue): number | null {
  const prevue = Date.parse(a.prevue_a);
  if (a.accuse_appareil_a && a.decalage_ms !== null) {
    return (Date.parse(a.accuse_appareil_a) + a.decalage_ms - prevue) / 1000;
  }
  if (a.accuse_serveur_a) return (Date.parse(a.accuse_serveur_a) - prevue) / 1000;
  return null;
}

export function issue(a: AlerteLue, maintenantMs: number): Issue {
  if (a.etat === 'annulee') return 'annulee';
  const retard = retardSecondes(a);
  if (retard !== null) return retard <= SEUIL_RETARD_S ? 'reussie' : 'en_retard';
  if (a.etat === 'echouee') return 'echouee';
  if (maintenantMs - Date.parse(a.prevue_a) > DELAI_PERTE_MS) return 'perdue';
  return 'en_attente';
}

export function estEchec(i: Issue): boolean {
  return i === 'en_retard' || i === 'perdue' || i === 'echouee';
}
