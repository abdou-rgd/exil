import { describe, expect, it } from 'vitest';
import { issue, retardSecondes } from './stats';
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
