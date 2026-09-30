export type Echantillon = { envoiMs: number; receptionMs: number; serveurMs: number };

/** Décalage à ajouter à l'heure du téléphone pour obtenir celle du serveur, estimé sur l'aller-retour le plus court. */
export function estimerDecalage(echantillons: Echantillon[]): number {
  if (echantillons.length === 0) throw new Error('aucun échantillon');
  const meilleur = echantillons.reduce((a, b) =>
    b.receptionMs - b.envoiMs < a.receptionMs - a.envoiMs ? b : a,
  );
  const milieu = (meilleur.envoiMs + meilleur.receptionMs) / 2;
  return Math.round(meilleur.serveurMs - milieu);
}
