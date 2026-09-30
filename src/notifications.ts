import { config } from './config';
import { base64UrlVersOctets } from './lib/base64';
import { supabase } from './supabase';

export type EtatAbonnement = { abonne: boolean; cree_a: string | null; vu_a: string | null };

const DELAI_SERVICE_WORKER_MS = 10_000;

export function notificationsDisponibles(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/** À appeler directement dans un toucher : iOS l'exige pour la demande de permission. */
export async function activerNotifications(): Promise<NotificationPermission> {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') await synchroniserAbonnement();
  return permission;
}

/** navigator.serviceWorker.ready ne se résout jamais sans service worker : on borne l'attente. */
function serviceWorkerPret(): Promise<ServiceWorkerRegistration> {
  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<never>((_, rejeter) =>
      setTimeout(() => rejeter(new Error('Service worker absent : recharge l’app')), DELAI_SERVICE_WORKER_MS),
    ),
  ]);
}

function memesOctets(a: ArrayBuffer | null, b: Uint8Array): boolean {
  if (!a || a.byteLength !== b.length) return false;
  const vue = new Uint8Array(a);
  return vue.every((octet, i) => octet === b[i]);
}

/** Recrée l'abonnement si besoin et le renvoie au serveur : iOS ne prévient pas quand il change. */
export async function synchroniserAbonnement(): Promise<void> {
  const enregistrement = await serviceWorkerPret();
  const cle = base64UrlVersOctets(config.vapidPublique);
  let abonnement = await enregistrement.pushManager.getSubscription();
  // Un abonnement lié à une ancienne clé VAPID ne recevrait plus rien : on le remplace.
  if (abonnement && !memesOctets(abonnement.options.applicationServerKey, cle)) {
    await abonnement.unsubscribe();
    abonnement = null;
  }
  abonnement ??= await enregistrement.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: cle });
  const json = abonnement.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) throw new Error('Abonnement incomplet');
  const { error } = await supabase.rpc('enregistrer_abonnement', {
    p_endpoint: json.endpoint,
    p_p256dh: json.keys.p256dh,
    p_auth: json.keys.auth,
    p_user_agent: navigator.userAgent,
  });
  if (error) throw new Error(`Enregistrement refusé : ${error.message}`);
}

export async function lireEtatAbonnement(): Promise<EtatAbonnement> {
  const { data, error } = await supabase.rpc('etat_abonnement');
  if (error) throw new Error(error.message);
  return (data as EtatAbonnement[])[0] ?? { abonne: false, cree_a: null, vu_a: null };
}
