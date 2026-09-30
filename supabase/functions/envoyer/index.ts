// Edge Function « envoyer » : reçoit de pg_cron un lot d'identifiants d'alertes et les envoie au service push.
import postgres from 'npm:postgres@3.4.9';
import webpush from 'npm:web-push@3.6.7';
import { construireCharge, egaux, type LigneEnvoi } from './outils.ts';

declare const EdgeRuntime: { waitUntil(promesse: Promise<unknown>): void };

const sql = postgres(Deno.env.get('SUPABASE_DB_URL')!, { prepare: false, max: 2, connect_timeout: 10, idle_timeout: 20 });
const DELAI_ENVOI_MS = 8000;
const SECRET = Deno.env.get('ENVOI_SECRET') ?? '';
const APP_URL = Deno.env.get('APP_URL') ?? '';

webpush.setVapidDetails(
  Deno.env.get('VAPID_SUJET')!,
  Deno.env.get('VAPID_PUBLIQUE')!,
  Deno.env.get('VAPID_PRIVEE')!,
);

Deno.serve(async (requete) => {
  if (requete.method !== 'POST') return new Response('méthode refusée', { status: 405 });
  if (!SECRET || !egaux(requete.headers.get('x-envoi-secret') ?? '', SECRET)) {
    return new Response('interdit', { status: 403 });
  }
  let ids: unknown;
  try {
    ids = (await requete.json()).ids;
  } catch {
    return new Response('corps invalide', { status: 400 });
  }
  if (!Array.isArray(ids) || !ids.every((id) => typeof id === 'string')) {
    return new Response('corps invalide', { status: 400 });
  }
  // Répondre tout de suite : pg_net n'attend pas la fin des envois.
  EdgeRuntime.waitUntil(traiterLot(ids as string[]));
  return new Response(null, { status: 202 });
});

async function traiterLot(ids: string[]): Promise<void> {
  for (const id of ids) {
    try {
      await traiter(id);
    } catch (erreur) {
      console.error(`alerte ${id} : ${(erreur as Error).message}`);
    }
  }
}

async function traiter(id: string): Promise<void> {
  const [ligne] = await sql<LigneEnvoi[]>`select * from prive.preparer_envoi(${id}::uuid)`;
  if (!ligne) return; // annulée entre-temps, ou abonnement absent
  let code = 0; // 0 = pas de réponse (réseau, délai dépassé)
  let apnsId: string | null = null;
  try {
    const reponse = await webpush.sendNotification(
      { endpoint: ligne.endpoint, keys: { p256dh: ligne.p256dh, auth: ligne.auth } },
      JSON.stringify(construireCharge(ligne, APP_URL)),
      { TTL: 120, urgency: 'high', topic: ligne.serie_id.replaceAll('-', ''), timeout: DELAI_ENVOI_MS },
    );
    code = reponse.statusCode;
    apnsId = reponse.headers['apns-id'] ?? null;
  } catch (erreur) {
    const e = erreur as { statusCode?: number; message?: string };
    code = e.statusCode ?? 0;
    // Pas d'objet d'erreur complet dans les journaux : il contient l'adresse de l'appareil.
    console.error(`envoi ${id} : code ${code} ${e.message ?? ''}`);
  }
  // Écrit juste après chaque réponse : un plantage plus loin ne provoque pas de double envoi.
  await noterReponse(id, code, apnsId);
}

/** Une seconde tentative évite qu'un accroc de la base fasse renvoyer une alerte déjà livrée. */
async function noterReponse(id: string, code: number, apnsId: string | null): Promise<void> {
  try {
    await sql`select prive.noter_reponse(${id}::uuid, ${code}, ${apnsId})`;
  } catch {
    await new Promise((r) => setTimeout(r, 500));
    await sql`select prive.noter_reponse(${id}::uuid, ${code}, ${apnsId})`;
  }
}
