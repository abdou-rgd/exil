/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { lireDecalage, mettreEnFile, viderFile, type Accuse } from './accuses';
import { envoyerAccuse } from './api-accuse';
import { lireCharge } from './lib/charge-recue';

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', () => {
  void self.skipWaiting();
});
self.addEventListener('activate', (evenement) => {
  evenement.waitUntil(self.clients.claim());
});

self.addEventListener('push', (evenement) => {
  const heureAppareil = new Date().toISOString();
  let brut: unknown = null;
  try {
    brut = evenement.data?.json();
  } catch {
    brut = null;
  }
  const contenu = lireCharge(brut);
  // Toujours afficher : iOS retire la permission après des push qui n'affichent rien.
  // Le tag remplace un éventuel doublon au lieu de l'empiler.
  const affichage = self.registration.showNotification(contenu.titre, {
    body: contenu.corps,
    tag: contenu.alerteId ?? undefined,
    data: { url: contenu.url },
  });
  evenement.waitUntil(Promise.all([affichage, accuser(contenu.alerteId, contenu.jeton, heureAppareil)]));
});

/** L'accusé est rangé d'abord : si iOS arrête le service worker pendant l'envoi, il partira à la prochaine ouverture. */
async function accuser(alerteId: string | null, jeton: string | null, heureAppareil: string): Promise<void> {
  if (!alerteId || !jeton) return;
  try {
    const accuse: Accuse = { alerte_id: alerteId, jeton, heure_appareil: heureAppareil, decalage_ms: await lireDecalage() };
    await mettreEnFile(accuse);
    await viderFile(envoyerAccuse);
  } catch {
    // ne jamais faire échouer l'affichage
  }
}

self.addEventListener('notificationclick', (evenement) => {
  evenement.notification.close();
  const url = (evenement.notification.data as { url?: string } | null)?.url ?? '/';
  evenement.waitUntil(ouvrir(url));
});

/** Réutilise la fenêtre de l'app si elle est déjà ouverte, plutôt que d'en ouvrir une seconde. */
async function ouvrir(url: string): Promise<void> {
  const fenetres = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  const existante = fenetres[0];
  if (existante) {
    await existante.focus();
    await existante.navigate(url);
    return;
  }
  await self.clients.openWindow(url);
}
