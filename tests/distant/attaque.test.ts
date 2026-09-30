import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const URL_SUPABASE = process.env.VITE_SUPABASE_URL!;
const CLE_PUBLIABLE = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;

function client(): SupabaseClient {
  return createClient(URL_SUPABASE, CLE_PUBLIABLE, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function connecte(): Promise<SupabaseClient> {
  const c = client();
  const { error } = await c.auth.signInAnonymously();
  if (error) throw error;
  return c;
}

describe('attaque : abonnements', () => {
  let a: SupabaseClient;
  beforeAll(async () => {
    a = await connecte();
  });

  it('refuse l’état d’abonnement sans session', async () => {
    const { error } = await client().rpc('etat_abonnement');
    expect(error).not.toBeNull();
  });

  it('n’expose pas le schéma privé', async () => {
    const { error } = await a.schema('prive').from('abonnements').select('*');
    expect(error).not.toBeNull();
  });

  it('refuse un abonnement vers une adresse arbitraire', async () => {
    const { error } = await a.rpc('enregistrer_abonnement', {
      p_endpoint: 'https://attaquant.example.com/x',
      p_p256dh: 'k',
      p_auth: 'a',
      p_user_agent: 'test',
    });
    expect(error?.message).toMatch(/refusée/);
  });
});

describe('attaque : alertes', () => {
  let a: SupabaseClient;
  let b: SupabaseClient;
  let serieA: string;

  beforeAll(async () => {
    a = await connecte();
    b = await connecte();
    const { data, error } = await a.rpc('programmer', { p_type: 'rapide', p_situation: 'test attaque', p_format: 'classique' });
    if (error) throw error;
    serieA = data as string;
  });

  afterAll(async () => {
    await a.rpc('annuler_serie', { p_serie: serieA });
  });

  it('ne montre pas les alertes d’un autre compte', async () => {
    const { data } = await b.from('alertes').select('id').eq('serie_id', serieA);
    expect(data).toEqual([]);
  });

  it('interdit d’écrire directement dans les tables', async () => {
    const maj = await a.from('alertes').update({ etat: 'envoyee' }).eq('serie_id', serieA);
    expect(maj.error).not.toBeNull();
    const ajout = await a.from('series').insert({ type: 'rapide', situation: 'x', format: 'classique' });
    expect(ajout.error).not.toBeNull();
  });

  it('refuse d’annuler la série d’un autre compte', async () => {
    const { error } = await b.rpc('annuler_serie', { p_serie: serieA });
    expect(error?.message).toMatch(/série inconnue/);
  });

  it('n’enregistre pas un accusé avec un faux jeton', async () => {
    const { data: alertes } = await a.from('alertes').select('id').eq('serie_id', serieA);
    const id = alertes![0].id as string;
    const { error } = await client().rpc('accuser_reception', {
      p_alerte: id,
      p_jeton: 'faux',
      p_heure_appareil: new Date().toISOString(),
      p_decalage_ms: 0,
    });
    expect(error).toBeNull();
    const { data } = await a.from('alertes').select('accuse_serveur_a').eq('id', id).single();
    expect(data!.accuse_serveur_a).toBeNull();
  });

  it('refuse l’Edge Function sans secret ou avec un faux secret', async () => {
    for (const entetes of [{}, { 'x-envoi-secret': 'faux' }]) {
      const reponse = await fetch(`${URL_SUPABASE}/functions/v1/envoyer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...entetes },
        body: '{"ids":[]}',
      });
      expect(reponse.status).toBe(403);
    }
  });
});
