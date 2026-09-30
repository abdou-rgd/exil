import { describe, expect, it } from 'vitest';
import { estimerDecalage } from './horloge';

describe('estimerDecalage', () => {
  it('garde l’échantillon au plus court aller-retour', () => {
    const decalage = estimerDecalage([
      { envoiMs: 1000, receptionMs: 1400, serveurMs: 5300 },
      { envoiMs: 2000, receptionMs: 2100, serveurMs: 6100 },
    ]);
    expect(decalage).toBe(4050);
  });
  it('refuse une liste vide', () => {
    expect(() => estimerDecalage([])).toThrow('aucun échantillon');
  });
});
