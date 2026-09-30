import 'fake-indexeddb/auto';
import { clear } from 'idb-keyval';
import { beforeEach, describe, expect, it } from 'vitest';
import { ecrireDecalage, lireDecalage } from './accuses';

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
