import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { beforeAll, describe, expect, it } from 'vitest';

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
