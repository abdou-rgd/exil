# Réponse du conseiller : architecture des notifications (étape 0)

*Reçue le 30 septembre 2026, par un sous-agent sur le modèle Fable qui a lu la question et le rapport R5. Résumé fidèle ; les sources citées par le conseiller sont en fin de fichier.*

## 1. Architecture

Le trajet tient, mais il lui faut un cycle d'états explicite.
- Annulation : `UPDATE … SET etat='annulée' WHERE id=$1 AND etat='prévue'`. Une alerte déjà « en cours d'envoi » ne s'annule plus (« trop tard »).
- Double envoi : le risque est une Edge Function qui plante après la réponse 201 d'Apple et avant d'écrire « envoyée ». Écrire « envoyée » alerte par alerte, juste après chaque 201, et mettre `tag = id_alerte` dans la notification pour qu'un doublon remplace l'affichage. Le `Topic` ne dédoublonne que les messages pas encore livrés (RFC 8030 §5.4).
- Alertes bloquées « en cours » : la tâche cron reprend celles de plus de 60 s avec `tentatives < 3`, puis les passe à « échouée ».
- Latence : `net.http_post` a un délai par défaut de 2 s. Le fixer à 15 000 ms. L'Edge Function répond 202 tout de suite et continue avec `EdgeRuntime.waitUntil`. L'état n'est écrit que par l'Edge Function.
- Horodater chaque étape côté serveur (prise par le cron, réception par l'Edge Function, réponse d'Apple avec code et `apns-id`, accusé) pour savoir d'où vient un retard.

## 2. Declarative Web Push

Une notification déclarative est immuable par défaut : iOS l'affiche sans réveiller le service worker, donc sans accusé ni mesure. Avec `"mutable": true`, un événement `push` est déclenché avec `event.notification` ; `showNotification` remplace la notification proposée, sans double affichage ni révocation. Point non tranché entre le billet WebKit et l'explicatif : mettre `mutable: true` explicitement.

Recommandation : charge classique pour les séries principales, et une série déclarative mutable en comparaison. Dans le gestionnaire : `showNotification` puis `fetch`, dans `waitUntil(Promise.all)`, avec le `fetch` dans un `try/catch`.

## 3. Accusé depuis le service worker

Garder le `fetch` dans `waitUntil` (non vérifié sur iOS 26 : à tester en premier). Ajouter l'heure de l'appareil corrigée du décalage dans l'accusé ; conserver cette heure dans la file IndexedDB ; mettre l'identifiant et le jeton dans l'URL `navigate` pour que le toucher sur la notification serve de second accusé (« vue »).

## 4. Statistique

48/50 donne [86,5 ; 98,9] (Wilson). Il faut 60 réussites sur 60 pour affirmer « au moins 95 % » avec une confiance de 95 %. En bayésien avec a priori uniforme : 50/50 donne P(p > 0,95) = 0,93 ; 48/50 donne 0,38.

Recommandation : règle en trois zones sur au moins 100 alertes en situations normales : au plus 2 échecs, on reste en PWA ; au moins 8, on passe en natif ; entre les deux, on prolonge. Les alertes d'un même téléphone ne sont pas indépendantes : étaler les séries sur plusieurs jours. Le risque d'abonnement mort en silence se compte par appareil et par semaine, et seul le nombre d'appareils l'estime.

## 5. Sécurité

Suffisante pour un prototype, avec cinq ajouts :
1. plafond global (par exemple 300 alertes en attente) et interrupteur `envoi_actif` en base ;
2. `p256dh` et `auth` jamais lisibles par le client ;
3. jeton d'accusé d'au moins 128 bits, à usage unique, fonction `SECURITY DEFINER` qui renvoie `void` sans distinguer jeton inconnu et jeton déjà utilisé ;
4. Edge Function déployée avec `--no-verify-jwt`, secret comparé en temps constant et changé après la campagne ;
5. test d'attaque minimal avec la clé publiable avant la mise en ligne.

## 6. Angles morts

- Un seul iPhone est le principal angle mort : installer le prototype chez les amis, sur plusieurs versions d'iOS.
- Mise en pause de Supabase après 7 jours pendant la série longue : garder un appareil actif chaque jour.
- Situations manquantes : hors ligne à l'échéance puis retour du réseau (30 s, 5 min, au-delà du TTL) ; notifications désactivées dans Réglages ; suppression puis réinstallation ; Apple Watch ; alertes de nuit.
- Décider par mode d'échec : un échec dû au mode Concentration ne serait pas réglé par Capacitor sans le droit *Time Sensitive* ; un abonnement mort le serait.

## Sources citées

[Explicatif WebKit](https://github.com/WebKit/explainers/blob/main/DeclarativeWebPush/README.md) · [WWDC25 session 235](https://developer.apple.com/videos/play/wwdc2025/235/) · [Billet WebKit 16535](https://webkit.org/blog/16535/meet-declarative-web-push/) · [Supabase pg_net](https://supabase.com/docs/guides/database/extensions/pg_net) · [citusdata/pg_cron](https://github.com/citusdata/pg_cron)
