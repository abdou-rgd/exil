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

export const SITUATIONS = [
  'verrouillé',
  'Concentration, app autorisée',
  'Concentration, app non autorisée',
  "économie d'énergie",
  'Wi-Fi seul',
  'réseau mobile seul',
  "app ouverte à l'écran",
  'autre',
] as const;

export const MIN_ALERTES_REGLE = 100;

export function estHorsRegle(situation: string): boolean {
  return situation === 'Concentration, app non autorisée' || situation.startsWith('autre');
}

export function mediane(valeurs: number[]): number | null {
  if (valeurs.length === 0) return null;
  const triees = [...valeurs].sort((x, y) => x - y);
  const milieu = Math.floor(triees.length / 2);
  return triees.length % 2 === 1 ? triees[milieu] : (triees[milieu - 1] + triees[milieu]) / 2;
}

export type LigneStats = {
  situation: string;
  prevues: number;
  recues: number;
  sous30: number;
  partSous30: number | null;
  medianeS: number | null;
  maxS: number | null;
  echecs: number;
};

export function statsParSituation(alertes: AlerteLue[], maintenantMs: number): LigneStats[] {
  const groupes = new Map<string, AlerteLue[]>();
  for (const a of alertes) {
    if (a.etat === 'annulee') continue;
    // Le format déclaratif a sa propre ligne : il n'entre pas dans la règle et ne doit pas s'y mêler.
    const cle = a.series.format === 'declaratif' ? `${a.series.situation} (déclaratif)` : a.series.situation;
    groupes.set(cle, [...(groupes.get(cle) ?? []), a]);
  }
  return [...groupes.entries()]
    .map(([situation, liste]) => {
      const retards = liste.map(retardSecondes).filter((r): r is number => r !== null);
      const issues = liste.map((a) => issue(a, maintenantMs));
      const sous30 = issues.filter((i) => i === 'reussie').length;
      const terminees = issues.filter((i) => i !== 'en_attente').length;
      return {
        situation,
        prevues: liste.length,
        recues: retards.length,
        sous30,
        partSous30: terminees > 0 ? sous30 / terminees : null,
        medianeS: mediane(retards),
        maxS: retards.length > 0 ? Math.max(...retards) : null,
        echecs: issues.filter(estEchec).length,
      };
    })
    .sort((x, y) => x.situation.localeCompare(y.situation, 'fr'));
}

export type Zone = 'insuffisant' | 'web_app' | 'prolonger' | 'natif';

/** Règle de la spécification, section 8 : séries classiques, situations normales, alertes terminées. */
export function regleTroisZones(alertes: AlerteLue[], maintenantMs: number): { n: number; echecs: number; zone: Zone } {
  const issues = alertes
    .filter((a) => a.series.type === 'serie' && a.series.format === 'classique' && !estHorsRegle(a.series.situation))
    .map((a) => issue(a, maintenantMs))
    .filter((i) => i !== 'en_attente' && i !== 'annulee');
  const echecs = issues.filter(estEchec).length;
  const n = issues.length;
  const zone: Zone =
    echecs >= 8 ? 'natif' : n < MIN_ALERTES_REGLE ? 'insuffisant' : echecs <= 2 ? 'web_app' : 'prolonger';
  return { n, echecs, zone };
}

export type SerieEnAttente = { serieId: string; situation: string; restantes: number };

export function seriesEnAttente(alertes: AlerteLue[]): SerieEnAttente[] {
  const parSerie = new Map<string, SerieEnAttente>();
  for (const a of alertes) {
    if (a.etat !== 'prevue') continue;
    const serie = parSerie.get(a.serie_id) ?? { serieId: a.serie_id, situation: a.series.situation, restantes: 0 };
    parSerie.set(a.serie_id, { ...serie, restantes: serie.restantes + 1 });
  }
  return [...parSerie.values()];
}
