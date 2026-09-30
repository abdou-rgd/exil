import { get, set } from 'idb-keyval';

const CLE_DECALAGE = 'decalage_ms';

export async function lireDecalage(): Promise<number | null> {
  return (await get<number>(CLE_DECALAGE)) ?? null;
}

export async function ecrireDecalage(ms: number): Promise<void> {
  await set(CLE_DECALAGE, ms);
}
