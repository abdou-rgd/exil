import 'fake-indexeddb/auto';
import { clear } from 'idb-keyval';
import { beforeEach, describe, expect, it } from 'vitest';
import { ecrireDecalage, lireDecalage, mettreEnFile, viderFile, type Accuse } from './accuses';

describe('décalage mémorisé', () => {
  beforeEach(() => clear());

  it('renvoie null tant que rien n’est mesuré', async () => {
    expect(await lireDecalage()).toBeNull();
  });

  it('relit le dernier décalage écrit', async () => {
    await ecrireDecalage(-1234);
    expect(await lireDecalage()).toBe(-1234);
  });
});

function accuse(id: string): Accuse {
  return { alerte_id: id, jeton: `j-${id}`, heure_appareil: '2026-09-30T12:00:04.000Z', decalage_ms: 0 };
}

describe('file des accusés', () => {
  beforeEach(() => clear());

  it('envoie les accusés en attente et vide la file', async () => {
    await mettreEnFile(accuse('a1'));
    await mettreEnFile(accuse('a2'));
    const envoyes: string[] = [];
    const nombre = await viderFile(async (a) => {
      envoyes.push(a.alerte_id);
    });
    expect(nombre).toBe(2);
    expect(envoyes).toEqual(['a1', 'a2']);
    expect(await viderFile(async () => undefined)).toBe(0);
  });

  it('garde en file un accusé dont l’envoi échoue', async () => {
    await mettreEnFile(accuse('a1'));
    await mettreEnFile(accuse('a2'));
    const nombre = await viderFile(async (a) => {
      if (a.alerte_id === 'a2') throw new Error('hors ligne');
    });
    expect(nombre).toBe(1);
    const restants: string[] = [];
    await viderFile(async (a) => {
      restants.push(a.alerte_id);
    });
    expect(restants).toEqual(['a2']);
  });
});
