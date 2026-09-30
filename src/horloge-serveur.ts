import { ecrireDecalage } from './accuses';
import { estimerDecalage, type Echantillon } from './lib/horloge';
import { supabase } from './supabase';

/** Trois allers-retours vers la base ; le décalage retenu est mémorisé pour le service worker. */
export async function mesurerDecalage(): Promise<number> {
  const echantillons: Echantillon[] = [];
  for (let i = 0; i < 3; i++) {
    const envoiMs = Date.now();
    const { data, error } = await supabase.rpc('heure_serveur');
    const receptionMs = Date.now();
    if (error) throw new Error(error.message);
    echantillons.push({ envoiMs, receptionMs, serveurMs: new Date(data as string).getTime() });
  }
  const decalage = estimerDecalage(echantillons);
  await ecrireDecalage(decalage);
  return decalage;
}
