import type { Accuse } from './accuses';
import { config } from './config';

async function appeler(fonction: string, corps: unknown): Promise<void> {
  const reponse = await fetch(`${config.supabaseUrl}/rest/v1/rpc/${fonction}`, {
    method: 'POST',
    headers: { apikey: config.clePubliable, 'Content-Type': 'application/json' },
    body: JSON.stringify(corps),
  });
  if (!reponse.ok) throw new Error(`${fonction} : ${reponse.status}`);
}

export function envoyerAccuse(a: Accuse): Promise<void> {
  return appeler('accuser_reception', {
    p_alerte: a.alerte_id,
    p_jeton: a.jeton,
    p_heure_appareil: a.heure_appareil,
    p_decalage_ms: a.decalage_ms,
  });
}

export function envoyerVue(alerteId: string, jeton: string): Promise<void> {
  return appeler('marquer_vue', { p_alerte: alerteId, p_jeton: jeton });
}
