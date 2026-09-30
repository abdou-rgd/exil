import { describe, expect, it } from 'vitest';
import { issue, mediane, regleTroisZones, retardSecondes, seriesEnAttente, statsParSituation } from './stats';
import type { AlerteLue, FormatSerie, TypeSerie } from './types';

export function alerte(
  p: Partial<AlerteLue> & { situation?: string; type?: TypeSerie; format?: FormatSerie } = {},
): AlerteLue {
  const { situation = 'verrouillé', type = 'serie', format = 'classique', ...reste } = p;
  return {
    id: crypto.randomUUID(),
    serie_id: 's1',
    prevue_a: '2026-09-30T12:00:00Z',
    etat: 'envoyee',
    code_apple: 201,
    accuse_serveur_a: null,
    accuse_appareil_a: null,
    decalage_ms: null,
    vue_a: null,
    series: { type, situation, format },
    ...reste,
  };
}

const MAINTENANT = Date.parse('2026-09-30T13:00:00Z');

describe('retardSecondes', () => {
  it('utilise l’heure du téléphone corrigée du décalage', () => {
    expect(retardSecondes(alerte({ accuse_appareil_a: '2026-09-30T12:00:04Z', decalage_ms: 1000, accuse_serveur_a: '2026-09-30T12:05:00Z' }))).toBe(5);
  });
  it('se replie sur l’heure du serveur sans décalage connu', () => {
    expect(retardSecondes(alerte({ accuse_appareil_a: '2026-09-30T12:00:04Z', accuse_serveur_a: '2026-09-30T12:00:12Z' }))).toBe(12);
  });
  it('renvoie null sans accusé', () => {
    expect(retardSecondes(alerte())).toBeNull();
  });
});

describe('issue', () => {
  it('distingue réussie et en retard autour de 30 secondes', () => {
    expect(issue(alerte({ accuse_serveur_a: '2026-09-30T12:00:30Z' }), MAINTENANT)).toBe('reussie');
    expect(issue(alerte({ accuse_serveur_a: '2026-09-30T12:00:31Z' }), MAINTENANT)).toBe('en_retard');
  });
  it('reconnaît annulée et échouée', () => {
    expect(issue(alerte({ etat: 'annulee' }), MAINTENANT)).toBe('annulee');
    expect(issue(alerte({ etat: 'echouee' }), MAINTENANT)).toBe('echouee');
  });
  it('déclare perdue une alerte sans accusé 10 minutes après son heure', () => {
    expect(issue(alerte(), MAINTENANT)).toBe('perdue');
    expect(issue(alerte({ prevue_a: '2026-09-30T12:55:00Z' }), MAINTENANT)).toBe('en_attente');
    expect(issue(alerte({ etat: 'prevue', prevue_a: '2026-09-30T14:00:00Z' }), MAINTENANT)).toBe('en_attente');
  });
});

describe('mediane', () => {
  it('prend la valeur centrale ou la moyenne des deux centrales', () => {
    expect(mediane([3, 1, 2])).toBe(2);
    expect(mediane([4, 1, 2, 3])).toBe(2.5);
    expect(mediane([])).toBeNull();
  });
});

describe('statsParSituation', () => {
  it('résume chaque situation', () => {
    const lignes = statsParSituation(
      [
        alerte({ accuse_serveur_a: '2026-09-30T12:00:04Z' }),
        alerte({ accuse_serveur_a: '2026-09-30T12:00:40Z' }),
        alerte(),
        alerte({ situation: 'Wi-Fi seul', accuse_serveur_a: '2026-09-30T12:00:02Z' }),
        alerte({ situation: 'Wi-Fi seul', etat: 'annulee' }),
      ],
      MAINTENANT,
    );
    expect(lignes).toEqual([
      { situation: 'verrouillé', prevues: 3, recues: 2, sous30: 1, partSous30: 1 / 3, medianeS: 22, maxS: 40, echecs: 2 },
      { situation: 'Wi-Fi seul', prevues: 1, recues: 1, sous30: 1, partSous30: 1, medianeS: 2, maxS: 2, echecs: 0 },
    ]);
  });
});

describe('statsParSituation et format', () => {
  it('sépare la série déclarative de la série classique de même situation', () => {
    const lignes = statsParSituation(
      [alerte({ accuse_serveur_a: '2026-09-30T12:00:04Z' }), alerte({ format: 'declaratif' })],
      MAINTENANT,
    );
    expect(lignes.map((l) => [l.situation, l.prevues])).toEqual([
      ['verrouillé', 1],
      ['verrouillé (déclaratif)', 1],
    ]);
  });
});

describe('regleTroisZones', () => {
  const reussies = (n: number) => Array.from({ length: n }, () => alerte({ accuse_serveur_a: '2026-09-30T12:00:03Z' }));
  const perdues = (n: number) => Array.from({ length: n }, () => alerte());

  it('attend 100 alertes avant de conclure', () => {
    expect(regleTroisZones(reussies(50), MAINTENANT)).toEqual({ n: 50, echecs: 0, zone: 'insuffisant' });
  });
  it('reste en web app avec au plus 2 échecs sur 100', () => {
    expect(regleTroisZones([...reussies(98), ...perdues(2)], MAINTENANT).zone).toBe('web_app');
  });
  it('prolonge entre 3 et 7 échecs', () => {
    expect(regleTroisZones([...reussies(97), ...perdues(3)], MAINTENANT).zone).toBe('prolonger');
  });
  it('envisage le natif dès 8 échecs, même avant 100 alertes', () => {
    expect(regleTroisZones([...reussies(12), ...perdues(8)], MAINTENANT).zone).toBe('natif');
  });
  it('ne compte que les séries classiques en situation normale', () => {
    const exclues = [
      alerte({ situation: 'Concentration, app non autorisée' }),
      alerte({ situation: 'autre : redémarrage' }),
      alerte({ type: 'longue' }),
      alerte({ type: 'rapide' }),
      alerte({ format: 'declaratif' }),
      alerte({ etat: 'annulee' }),
      alerte({ prevue_a: '2026-09-30T12:59:00Z' }),
    ];
    expect(regleTroisZones(exclues, MAINTENANT)).toEqual({ n: 0, echecs: 0, zone: 'insuffisant' });
  });
});

describe('seriesEnAttente', () => {
  it('liste les séries qui ont encore des alertes prévues', () => {
    expect(
      seriesEnAttente([
        alerte({ serie_id: 's1', etat: 'prevue' }),
        alerte({ serie_id: 's1', etat: 'prevue' }),
        alerte({ serie_id: 's1' }),
        alerte({ serie_id: 's2' }),
      ]),
    ).toEqual([{ serieId: 's1', situation: 'verrouillé', restantes: 2 }]);
  });
});
