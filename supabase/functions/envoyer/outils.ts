// Fonctions pures de l'Edge Function, testées par Vitest.

export type FormatSerie = 'classique' | 'declaratif';

export type LigneEnvoi = {
  alerte_id: string;
  serie_id: string;
  format: FormatSerie;
  prevue_a: string | Date;
  jeton: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

export type ChargeClassique = { titre: string; corps: string; alerte_id: string; jeton: string; url: string };

export type ChargeDeclarative = {
  web_push: 8030;
  mutable: true;
  notification: { title: string; body: string; navigate: string; data: { alerte_id: string; jeton: string } };
};

const HEURE = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

export function construireCharge(
  ligne: Pick<LigneEnvoi, 'alerte_id' | 'format' | 'prevue_a' | 'jeton'>,
  origine: string,
): ChargeClassique | ChargeDeclarative {
  const url = `${origine.replace(/\/$/, '')}/?alerte=${encodeURIComponent(ligne.alerte_id)}&jeton=${encodeURIComponent(ligne.jeton)}`;
  const titre = "L'Exil";
  const corps = `Alerte prévue à ${HEURE.format(new Date(ligne.prevue_a))}`;
  if (ligne.format === 'declaratif') {
    // « mutable: true » est indispensable : sinon iOS affiche sans réveiller le service worker, et aucun accusé ne part.
    return {
      web_push: 8030,
      mutable: true,
      notification: { title: titre, body: corps, navigate: url, data: { alerte_id: ligne.alerte_id, jeton: ligne.jeton } },
    };
  }
  return { titre, corps, alerte_id: ligne.alerte_id, jeton: ligne.jeton, url };
}

/** Comparaison en temps constant, pour ne pas révéler le secret par le temps de réponse. */
export function egaux(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  let difference = ea.length ^ eb.length;
  for (let i = 0; i < Math.max(ea.length, eb.length); i++) {
    difference |= (ea[i] ?? 0) ^ (eb[i] ?? 0);
  }
  return difference === 0;
}
