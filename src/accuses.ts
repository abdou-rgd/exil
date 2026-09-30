import { get, set, update } from 'idb-keyval';

const CLE_DECALAGE = 'decalage_ms';
const CLE_FILE = 'file_accuses';

export type Accuse = {
  alerte_id: string;
  jeton: string;
  heure_appareil: string;
  decalage_ms: number | null;
};

export async function lireDecalage(): Promise<number | null> {
  return (await get<number>(CLE_DECALAGE)) ?? null;
}

export async function ecrireDecalage(ms: number): Promise<void> {
  await set(CLE_DECALAGE, ms);
}

export async function mettreEnFile(accuse: Accuse): Promise<void> {
  await update<Accuse[]>(CLE_FILE, (file) => [...(file ?? []), accuse]);
}

/** Tente d'envoyer chaque accusé en attente ; ne retire de la file que ceux qui sont partis. */
export async function viderFile(envoyer: (accuse: Accuse) => Promise<void>): Promise<number> {
  const file = (await get<Accuse[]>(CLE_FILE)) ?? [];
  const envoyes = new Set<string>();
  for (const accuse of file) {
    try {
      await envoyer(accuse);
      envoyes.add(accuse.alerte_id);
    } catch {
      // reste en file pour la prochaine ouverture
    }
  }
  if (envoyes.size > 0) {
    await update<Accuse[]>(CLE_FILE, (actuelle) => (actuelle ?? []).filter((a) => !envoyes.has(a.alerte_id)));
  }
  return envoyes.size;
}
