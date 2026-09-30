/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', () => {
  void self.skipWaiting();
});
self.addEventListener('activate', (evenement) => {
  evenement.waitUntil(self.clients.claim());
});

// Toute push doit afficher une notification, sinon iOS retire la permission.
self.addEventListener('push', (evenement) => {
  evenement.waitUntil(self.registration.showNotification("L'Exil", { body: 'Notification de test' }));
});
