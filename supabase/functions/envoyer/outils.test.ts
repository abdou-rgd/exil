import { describe, expect, it } from 'vitest';
import { construireCharge, egaux } from './outils.ts';

const LIGNE = { alerte_id: 'a1', format: 'classique' as const, prevue_a: '2026-09-30T12:00:05Z', jeton: 'j1' };

describe('construireCharge', () => {
  it('construit une charge classique', () => {
    expect(construireCharge(LIGNE, 'https://exil.vercel.app/')).toEqual({
      titre: "L'Exil",
      corps: 'Alerte prévue à 14:00:05',
      alerte_id: 'a1',
      jeton: 'j1',
      url: 'https://exil.vercel.app/?alerte=a1&jeton=j1',
    });
  });

  it('construit une charge déclarative modifiable', () => {
    expect(construireCharge({ ...LIGNE, format: 'declaratif' }, 'https://exil.vercel.app')).toEqual({
      web_push: 8030,
      mutable: true,
      notification: {
        title: "L'Exil",
        body: 'Alerte prévue à 14:00:05',
        navigate: 'https://exil.vercel.app/?alerte=a1&jeton=j1',
        data: { alerte_id: 'a1', jeton: 'j1' },
      },
    });
  });

  it('accepte une date renvoyée par Postgres', () => {
    const charge = construireCharge({ ...LIGNE, prevue_a: new Date('2026-09-30T12:00:05Z') }, 'https://exil.vercel.app');
    expect(charge).toMatchObject({ corps: 'Alerte prévue à 14:00:05' });
  });
});

describe('egaux', () => {
  it('compare deux textes', () => {
    expect(egaux('abc', 'abc')).toBe(true);
    expect(egaux('abc', 'abd')).toBe(false);
    expect(egaux('abc', 'abcd')).toBe(false);
    expect(egaux('', '')).toBe(true);
  });
});
