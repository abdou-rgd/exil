import { config } from './config';
import { base64UrlVersOctets } from './lib/base64';
import { supabase } from './supabase';

export type EtatAbonnement = { abonne: boolean; cree_a: string | null; vu_a: string | null };

export function notificationsDisponibles(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/** À appeler directement dans un toucher : iOS l'exige pour la demande de permission. */
export async function activerNotifications(): Promise<NotificationPermission> {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') await synchroniserAbonnement();
  return permission;
}

/** Recrée l'abonnement si besoin et le renvoie au serveur : iOS ne prévient pas quand il change. */
export async function synchroniserAbonnement(): Promise<void> {
  const enregistrement = await navigator.serviceWorker.ready;
  const abonnement =
    (await enregistrement.pushManager.getSubscription()) ??
    (await enregistrement.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64UrlVersOctets(config.vapidPublique),
    }));
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
