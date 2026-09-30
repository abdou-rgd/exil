import type { Accuse } from './accuses';
import { config } from './config';

const DELAI_MS = 8000;

/** Réussit aussi sur un refus définitif (4xx hors 408 et 429) : réessayer ne le corrigerait pas. */
async function appeler(fonction: string, corps: unknown): Promise<void> {
  const reponse = await fetch(`${config.supabaseUrl}/rest/v1/rpc/${fonction}`, {
    method: 'POST',
    headers: { apikey: config.clePubliable, 'Content-Type': 'application/json' },
    body: JSON.stringify(corps),
    signal: AbortSignal.timeout(DELAI_MS),
  });
  const refusDefinitif = reponse.status >= 400 && reponse.status < 500 && reponse.status !== 408 && reponse.status !== 429;
  if (!reponse.ok && !refusDefinitif) throw new Error(`${fonction} : ${reponse.status}`);
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
