# 05 — Faisabilité technique : PWA iOS (minuteur d'étude RPG + social)

- **Date de l'étude** : 2026-09-30 (recherche web menée les 29 et 30 septembre 2026).
- **Projet évalué** : PWA installée sur iPhone via Safari, hébergée sur Vercel (Hobby), Supabase pour l'authentification, Postgres, Realtime et les Edge Functions.
- **Versions de référence** : iOS/iPadOS 18.4 (mars 2025), iOS 26 (Safari 26.0, septembre 2025) jusqu'à Safari 26.6 (juillet 2026), et Safari 27.0 (notes de version WebKit du 2026-09-17 ; la page ne précise pas les versions d'OS associées).

## Légende des statuts

| Statut | Signification |
|---|---|
| **VERIFIED** | Lu dans une source primaire (webkit.org, developer.apple.com, MDN, caniuse, documentation officielle Supabase / Vercel / Cloudflare / Upstash / Next.js / Expo / Capacitor). |
| **REPORTED** | Source secondaire, fil de forum ou retour de développeur ; plausible mais non confirmé par une source primaire. |
| **UNVERIFIED** | Non vérifié pendant cette recherche (déduction, souvenir, ou absence de source). À tester. |

## Limites de méthode (à lire avant de décider)

1. **Le quota de recherche web de la session a été épuisé en cours de route.** La suite a été faite par lecture directe d'URL primaires connues. Conséquence : certains points n'ont pas pu être recoupés ; ils sont marqués UNVERIFIED et regroupés en fin de document.
2. Les pages ont été lues à travers un outil d'extraction automatique. Les chiffres de quotas doivent être relus sur la page d'origine avant toute décision engageante ; ils changent souvent.
3. **Les articles secondaires de 2026 sur « les PWA sur iOS » contiennent des erreurs.** Exemple : un guide mis à jour le 2026-03-20 affirme que les PWA ne fonctionnent plus en mode autonome dans l'UE et que le stockage est plafonné à 50 Mo ; les sources primaires disent le contraire (voir fiche 1). Ne pas s'y fier sans recoupement.
4. Aucun test sur appareil réel n'a été fait. Tout ce qui touche à la fiabilité réelle des notifications est REPORTED au mieux : c'est la principale incertitude du projet.
5. Quelques sources secondaires n'ont été vues qu'à travers le résumé des résultats de recherche, sans lecture de la page : le billet shinyaz sur Serwist, les dépôts des modules Live Activities pour Capacitor, l'article Newly sur Family Controls et l'analyse Superblocks de la CVE-2025-48757. Elles sont toutes classées REPORTED.
6. La limite de lecture de pages de la session a été atteinte en toute fin de recherche. Une relecture de contrôle de la page Apple sur le Web Push n'a pas pu être faite : deux détails (en-tête TTL obligatoire, fréquence de renouvellement du jeton VAPID) proviennent d'une seule lecture et sont à relire sur la page.

---

## Synthèse : les affirmations du projet tiennent-elles ?

| Affirmation du projet | Verdict | Réserve principale |
|---|---|---|
| PWA installable sur iPhone via Safari, hébergement gratuit Vercel, backend Supabase | **Oui, avec réserves** | Installation manuelle sans invite ; clause non commerciale de Vercel Hobby ; mise en pause du projet Supabase gratuit ; e-mails d'authentification limités. |
| Minuteur calculé à partir d'horodatages | **Oui** | C'est la bonne approche et elle est nécessaire. Utiliser l'heure serveur comme référence. |
| Notification Web Push à la fin d'une session et des pauses | **Oui, avec réserves fortes** | Exige un planificateur côté serveur, du réseau au moment de l'envoi, l'app installée et la permission. Fiabilité iOS signalée comme inégale. **Impossible hors ligne.** |
| Sessions de groupe synchronisées, présence, bonus collectif | **Oui, avec réserves** | La synchronisation ne vit qu'au premier plan ; la présence « tombe » à chaque verrouillage du téléphone. |
| XP, niveaux, équipement non falsifiables | **Oui** | Faisable avec RLS et fonctions serveur. Mais on ne prouve jamais que l'étudiant a réellement étudié, et les sessions hors ligne reposent sur la confiance. |
| Journal par session et statistiques, de quelques dizaines à des milliers d'utilisateurs | **Oui** | Gratuit pour des dizaines à quelques centaines d'utilisateurs actifs ; prévoir Supabase Pro (25 $/mois) vers 500 à 1 500 actifs quotidiens. |
| Minuteur utilisable sans réseau | **Oui pour le minuteur, non pour l'alerte** | Téléphone verrouillé et hors ligne : aucune alerte de fin possible dans une PWA. |

---

## Fiche 1 — Capacités des web apps iOS/iPadOS en 2026

### Web Push et notifications

| # | Affirmation | Statut | Source + date |
|---|---|---|---|
| 1.1 | Web Push est disponible pour les web apps ajoutées à l'écran d'accueil depuis iOS/iPadOS 16.4. Sur iOS, un simple onglet Safari n'y a pas accès. | VERIFIED | [WebKit — Web Push for Web Apps on iOS and iPadOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/) — 2023-02-16 ; [Apple — Sending web push notifications](https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers) — consultée 2026-09-30 |
| 1.2 | La demande de permission doit répondre à un geste direct de l'utilisateur (bouton), depuis la web app installée. | VERIFIED | [WebKit 13878](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/) — 2023-02-16 ; [WebKit — Meet Web Push](https://webkit.org/blog/12945/meet-web-push/) — 2022-06-07 |
| 1.3 | Aucune adhésion au programme développeur Apple n'est requise pour envoyer du Web Push ; le mécanisme est standard (Push API, Notifications API, VAPID). | VERIFIED | [WebKit 12945](https://webkit.org/blog/12945/meet-web-push/) — 2022-06-07 ; [Apple — web push](https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers) — consultée 2026-09-30 |
| 1.4 | Pas de push silencieux. Apple : « Safari doesn't support invisible push notifications » ; si la notification n'est pas affichée, la permission est révoquée. | VERIFIED | [Apple — web push](https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers) — consultée 2026-09-30 |
| 1.5 | Le seuil serait de 3 push silencieux, avec une fenêtre d'environ 30 s, un compteur jamais remis à zéro, et aucune exemption quand l'app est visible. | REPORTED | [PR conveniat #2039](https://github.com/cevi/conveniat-webpage/pull/2039) (lecture du code WebKit, non testé sur iPhone) — 2026-09-29 ; [Progressier sur dev.to](https://dev.to/progressier/how-to-fix-ios-push-subscriptions-being-terminated-after-3-notifications-39a7) — 2023-06-30 |
| 1.6 | Declarative Web Push existe depuis iOS/iPadOS 18.4 pour les web apps de l'écran d'accueil : message JSON contenant la clé `web_push: 8030`, un titre et une URL `navigate` ; aucun service worker requis ; pas de pénalité si le service worker échoue ; rétrocompatible avec les anciens navigateurs. | VERIFIED | [WebKit — Meet Declarative Web Push](https://webkit.org/blog/16535/meet-declarative-web-push/) — 2025-03-27 ; [WebKit — Safari 18.4](https://webkit.org/blog/16574/webkit-features-in-safari-18-4/) — 2025-03-31 |
| 1.7 | Côté service push Apple : en-tête TTL obligatoire, `Urgency` (`high` = tentative de livraison immédiate), `Topic` (32 caractères max), charge utile de 4 Ko max, code 410 = abonnement expiré, 429 = trop de requêtes, hôte `*.push.apple.com`. | VERIFIED | [Apple — web push](https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers) — consultée 2026-09-30 |
| 1.8 | Les notifications des web apps s'intègrent aux modes Concentration (Focus) et se règlent par web app dans Réglages, comme une app native. Elles apparaissent sur l'écran verrouillé et l'Apple Watch. | VERIFIED | [WebKit 13878](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/) — 2023-02-16 |
| 1.9 | Cas réel : push acceptée par le serveur (code 201) mais jamais affichée, parce que le téléphone était en « Ne pas déranger ». | REPORTED | [Apple Developer Forums 770749](https://developer.apple.com/forums/thread/770749) — 2024-12 |
| 1.10 | L'événement `pushsubscriptionchange` n'est pas supporté par Safari sur iOS. L'app ne sera donc pas prévenue d'un changement d'abonnement. | VERIFIED | [caniuse — pushsubscriptionchange](https://caniuse.com/mdn-api_serviceworkerglobalscope_pushsubscriptionchange_event) — consulté 2026-09-30 |
| 1.11 | Abonnements qui disparaissent après une à deux semaines, notifications qui cessent après quelques envois, nécessité de réinstaller. Fil actif d'avril 2023 à février 2025 (iOS 16.4 à 18.3), sans réponse d'Apple. | REPORTED | [Apple Developer Forums 728796](https://developer.apple.com/forums/thread/728796) — 2023-04 à 2025-02 ; [Forums 786360](https://developer.apple.com/forums/thread/786360) — 2025-06 ; [OneSignal — iOS web push](https://documentation.onesignal.com/docs/en/web-push-for-ios) — consulté 2026-09-30 |
| 1.12 | Taux de délivrance d'environ 70 à 85 % sur iOS contre 90 à 95 % sur Android. Chiffre sans mesure publiée vérifiable. | REPORTED | [webscraft](https://webscraft.org/blog/pwa-pushspovischennya-na-ios-u-2026-scho-realno-pratsyuye?lang=en) — 2026-03-12, mis à jour 2026-09-10 |
| 1.13 | Retards de 9 à 10 minutes observés sur iOS 26.4.1. Cas isolé, résolu par une réinstallation, cause inconnue. | REPORTED | [Discussion Frigate 22949](https://github.com/blakeblackshear/frigate/discussions/22949) — 2026-04 |
| 1.14 | Le clic sur une notification ne navigue pas de façon fiable vers une URL précise avec `clients.openWindow` (iOS 17.1 à 18.1). | REPORTED | [Apple Developer Forums 733604](https://developer.apple.com/forums/thread/733604) — 2023-07 à 2024-11 |
| 1.15 | Une push web peut-elle être marquée « Time Sensitive » pour traverser un mode Concentration, ou porter un son personnalisé ? | UNVERIFIED | Aucune mention trouvée dans les sources primaires lues. |

### Badge, écran allumé, arrière-plan, audio, vibration

| # | Affirmation | Statut | Source + date |
|---|---|---|---|
| 1.16 | Badging API (`setAppBadge`, `clearAppBadge`) supportée depuis iOS 16.4. | VERIFIED | [WebKit 13878](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/) — 2023-02-16 ; [caniuse — setAppBadge](https://caniuse.com/mdn-api_navigator_setappbadge) — consulté 2026-09-30 |
| 1.17 | Screen Wake Lock : supportée dans Safari depuis 16.4, mais **fonctionnelle dans les web apps de l'écran d'accueil seulement depuis iOS 18.4**. Bogue ouvert le 2023-03-27, corrigé deux ans plus tard. | VERIFIED | [WebKit — Safari 18.4](https://webkit.org/blog/16574/webkit-features-in-safari-18-4/) — 2025-03-31 ; [Bogue WebKit 254545](https://bugs.webkit.org/show_bug.cgi?id=254545) — 2023-03-27, corrigé 2025-03-31 |
| 1.18 | Les navigateurs ralentissent ou arrêtent les minuteurs et `requestAnimationFrame` des pages cachées. | VERIFIED | [MDN — Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) — modifiée 2025-12-30 |
| 1.19 | Sur iOS, une web app mise en arrière-plan ou un téléphone verrouillé gèle complètement le JavaScript après quelques secondes. | REPORTED | [firt.dev — JS in the background](https://firt.dev/understanding-js-background/) — 2023-05-19 ; [OJapp](https://tips.ojapp.app/en/pwa-ios-2026-complete-guide/) — 2026-06-13 |
| 1.20 | Délai exact avant le gel (souvent cité : environ 5 secondes). | UNVERIFIED | Aucune source primaire trouvée. À mesurer. |
| 1.21 | Quand les minuteurs sont ralentis, le client Realtime n'envoie plus ses battements de cœur et la connexion WebSocket tombe sans erreur visible. | VERIFIED | [Supabase — silent disconnections](https://supabase.com/docs/guides/troubleshooting/realtime-handling-silent-disconnections-in-backgrounded-applications-592794) — consultée 2026-09-30 |
| 1.22 | Régression iPadOS 26.2 : une connexion `ws://` vers un serveur local est fermée après une seconde en mode PWA. **Ne concerne pas** les connexions `wss://` publiques ; enquête WebKit ouverte. | REPORTED | [Apple Developer Forums 811063](https://developer.apple.com/forums/thread/811063) — 2025-12 à 2026-01 |
| 1.23 | L'audio d'une web app autonome continue en arrière-plan depuis iOS 15.4. | VERIFIED | [Bogue WebKit 198277](https://bugs.webkit.org/show_bug.cgi?id=198277) — ouvert 2019-05-27, corrigé iOS 15.4 |
| 1.24 | Régression iOS 26 : dans une web app installée, `audio.play()` réussit sans produire de son après réouverture. Correctif annoncé dans Safari 26.2 ; le ticket public reste au statut NEW. | VERIFIED | [WebKit — Safari 26.2](https://webkit.org/blog/17640/webkit-features-for-safari-26-2/) — 2025-12-12 ; [Bogue WebKit 295518](https://bugs.webkit.org/show_bug.cgi?id=295518) — 2025-07-07 |
| 1.25 | D'autres défauts audio persistent en PWA : enchaînement de pistes et commandes de l'écran verrouillé. | REPORTED | [Issue home-music 327](https://github.com/felipe-urgal/home-music/issues/327) — 2026-09-06 ; [Forums 762582](https://developer.apple.com/forums/thread/762582) — 2024-08 |
| 1.26 | Faire sonner une alarme à T+25 min depuis une app suspendue est impossible, puisque le JavaScript est gelé. | UNVERIFIED | Déduction logique des lignes 1.19 et 1.23 ; à tester. |
| 1.27 | Vibration API non supportée par Safari ni Safari iOS, jusqu'aux versions 27.x. | VERIFIED | [caniuse — vibration](https://caniuse.com/vibration) — consulté 2026-09-30 ; [MDN — Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API) — modifiée 2024-04-11 |
| 1.28 | Un rapport affirme que `navigator.vibrate` fonctionne sur iPhone ; il n'a été ni trié ni confirmé. | REPORTED | [Issue browser-compat-data 29166](https://github.com/mdn/browser-compat-data/issues/29166) — 2026-03-03 |
| 1.29 | Background Sync et Periodic Background Sync non supportés par Safari iOS, jusqu'aux versions 27.x. | VERIFIED | [caniuse — background-sync](https://caniuse.com/background-sync) et [periodic background sync](https://caniuse.com/wf-periodic-background-sync) — consultés 2026-09-30 |
| 1.30 | Notification Triggers (notifications locales planifiées) : développement arrêté par Chrome, jamais livré en version stable. Aucun navigateur ne le propose. | VERIFIED | [Chrome for Developers — Notification Triggers](https://developer.chrome.com/docs/web-platform/notification-triggers) — consultée 2026-09-30 |
| 1.31 | Live Activities, Dynamic Island et minuteur sur l'écran verrouillé exigent ActivityKit, une extension de widget et SwiftUI. Ce sont des API natives ; aucune API web n'existe. | VERIFIED | [Apple — ActivityKit](https://developer.apple.com/documentation/activitykit/displaying-live-data-with-live-activities) — consultée 2026-09-30 ; absence confirmée dans les notes WebKit 26.0 à 27.0 |

### Stockage, installation, UE, capteurs

| # | Affirmation | Statut | Source + date |
|---|---|---|---|
| 1.32 | Quotas de stockage : jusqu'à 60 % du disque par origine et 80 % au total, identiques pour Safari et pour une web app de l'écran d'accueil. Éviction selon l'ancienneté d'usage, sauf pour les origines actives ou en mode persistant. | VERIFIED | [WebKit — Updates to Storage Policy](https://webkit.org/blog/14403/updates-to-storage-policy/) — 2023-08-10 |
| 1.33 | `navigator.storage.persist()` est accordé par heuristique, notamment si le site est ouvert comme web app de l'écran d'accueil. | VERIFIED | [WebKit 14403](https://webkit.org/blog/14403/updates-to-storage-policy/) — 2023-08-10 |
| 1.34 | Le plafond de 7 jours sur le stockage inscriptible par script ne s'applique pas aux web apps de l'écran d'accueil ; WebKit considère une suppression comme un bogue grave. | VERIFIED | [WebKit — Full Third-Party Cookie Blocking](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/) — 2020-03-24 |
| 1.35 | Le stockage est isolé entre Safari et la web app installée : une session ouverte dans Safari n'existe pas dans la web app. | REPORTED | [firt.dev — notes PWA iOS](https://firt.dev/notes/pwa-ios/) — 2023-06-06 |
| 1.36 | Pas d'événement `beforeinstallprompt` sur Safari iOS ; il faut afficher ses propres instructions d'installation. | VERIFIED | [Next.js — guide PWA](https://nextjs.org/docs/app/guides/progressive-web-apps) — 2026-07-30 |
| 1.37 | iOS 26 : tout site ajouté à l'écran d'accueil s'ouvre par défaut comme web app ; l'utilisateur peut désactiver « Open as Web App ». WebKit : « zero requirements for installability », le manifeste n'est plus exigé. | VERIFIED | [WebKit — Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/) — 2025-09-15 |
| 1.38 | Chemin d'installation sous iOS 26 : menu « … » à droite de la barre d'adresse, puis Partager, puis Ajouter à l'écran d'accueil. | REPORTED | [MacRumors](https://www.macrumors.com/how-to/save-safari-bookmark-web-app-iphone-home-screen/) — 2025-08-20 |
| 1.39 | Web Push fonctionne-t-il pour un site sans manifeste sous iOS 26 ? | UNVERIFIED | Conserver un manifeste complet par prudence. |
| 1.40 | Les navigateurs tiers peuvent proposer l'ajout à l'écran d'accueil depuis iOS 16.4. | VERIFIED | [WebKit 13878](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/) — 2023-02-16 |
| 1.41 | Pas de capture de liens : un lien ou un QR code ouvert hors de l'app s'ouvre dans Safari, pas dans la web app installée. | REPORTED | [firt.dev — notes PWA iOS](https://firt.dev/notes/pwa-ios/) — 2023-06-06 ; non revérifié pour iOS 26 et 27 |
| 1.42 | UE : Apple a annoncé le retrait des web apps de l'écran d'accueil pour iOS 17.4, puis a fait marche arrière le 2024-03-01. Elles restent construites sur WebKit. | REPORTED | [TechCrunch](https://techcrunch.com/2024/03/01/apple-reverses-decision-about-blocking-web-apps-on-iphones-in-the-eu/) — 2024-03-01 ; [Open Web Advocacy — bilan 2025](https://open-web-advocacy.org/blog/owa-2025-review/) — 2026-01-05 |
| 1.43 | État actuel dans l'UE : aucune restriction mentionnée sur la page DMA d'Apple, ni dans les notes WebKit de Safari 26.0 à 27.0. Aucun moteur tiers n'a été porté sur iOS dans l'UE. | VERIFIED (par absence) / REPORTED | [Apple — DMA and apps in the EU](https://developer.apple.com/support/dma-and-apps-in-the-eu/) — consultée 2026-09-30 ; [Open Web Advocacy](https://open-web-advocacy.org/blog/the-digital-markets-act-is-delivering-real-wins-but-not-yet-for-browser-engines/) — 2026-05-15 |
| 1.44 | Safari 26.2, 26.4, 26.6 et 27.0 n'ajoutent aucune capacité de push ou d'arrière-plan. Ajouts notables : WebTransport (26.4), Service Worker static routing API (27.0). | VERIFIED | [Safari 26.2](https://webkit.org/blog/17640/webkit-features-for-safari-26-2/) — 2025-12-12 ; [26.4](https://webkit.org/blog/17862/webkit-features-for-safari-26-4/) — 2026-03-24 ; [26.6](https://webkit.org/blog/18178/webkit-features-for-safari-26-6/) — 2026-07-27 ; [27.0](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/) — 2026-09-17 |
| 1.45 | Web Bluetooth et Web NFC non supportés par Safari iOS. | VERIFIED | [caniuse — web-bluetooth](https://caniuse.com/web-bluetooth) et [webnfc](https://caniuse.com/webnfc) — consultés 2026-09-30 |
| 1.46 | `BarcodeDetector` est désactivé par défaut dans Safari ; il faut une bibliothèque JavaScript pour lire un QR code. `getUserMedia` (caméra) fonctionne en mode autonome depuis iOS 13.4. | VERIFIED | [caniuse — BarcodeDetector](https://caniuse.com/mdn-api_barcodedetector) et [stream](https://caniuse.com/stream) — consultés 2026-09-30 |

### Ce que cela implique

- Le minuteur ne « tourne » pas en arrière-plan. Il est recalculé à chaque retour au premier plan à partir des horodatages. C'est correct et suffisant pour l'affichage.
- L'alerte de fin, téléphone verrouillé, ne peut venir **que** d'une push envoyée par un serveur. Il n'existe aucun équivalent web des notifications locales planifiées.
- Un étudiant qui active un mode Concentration pour travailler risque de masquer précisément la notification que l'app veut lui envoyer. C'est un problème de conception du produit, pas seulement de technique.
- L'app doit vérifier son abonnement push à chaque lancement et le recréer si besoin, puisque `pushsubscriptionchange` n'existe pas sur iOS.
- Le mode « écran allumé » via Wake Lock n'est fiable qu'à partir d'iOS 18.4.

---

## Fiche 2 — Notifier la fin de session à une heure précise avec une pile gratuite

### Comparatif des options

| Option | Granularité minimale | Annulation / replanification | Limites de l'offre gratuite | Statut | Source + date |
|---|---|---|---|---|---|
| **Supabase Cron (pg_cron) + pg_net + Edge Function**, en interrogeant une table de notifications dues | 1 à 59 secondes (syntaxe « N seconds », Postgres 15.1.1.61 ou plus) | Mettre à jour ou supprimer la ligne | Recommandation : 8 tâches simultanées au plus, 10 minutes par tâche. L'historique des exécutions n'est pas nettoyé automatiquement. pg_net : 200 requêtes/s, délai par défaut de 2 s, pas de reprise automatique. | VERIFIED | [Supabase Cron](https://supabase.com/docs/guides/cron) ; [Quickstart](https://supabase.com/docs/guides/cron/quickstart) ; [pg_net](https://supabase.com/docs/guides/database/extensions/pg_net) ; [Planifier des fonctions](https://supabase.com/docs/guides/functions/schedule-functions) — consultées 2026-09-30 |
| **Supabase Queues (pgmq)** | Délai en secondes à l'envoi | Suppression par identifiant de message | Sans coût additionnel. Il faut tout de même un consommateur qui interroge la file : la précision reste celle du consommateur. | VERIFIED | [API pgmq](https://supabase.com/docs/guides/queues/pgmq) — consultée 2026-09-30 ; [Annonce](https://supabase.com/blog/supabase-queues) — 2024-12-05 |
| **Tâches de fond des Edge Functions** (`EdgeRuntime.waitUntil`) | Sans objet | Sans objet | **Inutilisable pour attendre 25 minutes** : durée maximale de 150 s (gratuit) ou 400 s (payant), 2 s de CPU par requête. | VERIFIED | [Limites](https://supabase.com/docs/guides/functions/limits) ; [Tâches de fond](https://supabase.com/docs/guides/functions/background-tasks) — consultées 2026-09-30 |
| **Upstash QStash**, messages différés | La seconde (délai relatif, ou horodatage Unix absolu) | Requête DELETE sur l'identifiant du message | 1 000 messages par jour, chaque tentative de livraison comptant pour un message ; délai maximal de 7 jours ; 1 Mo par message. Au-delà : 1 $ pour 100 000 messages. | VERIFIED | [Tarifs](https://upstash.com/pricing/qstash) ; [Délai](https://upstash.com/docs/qstash/features/delay) ; [Annulation](https://upstash.com/docs/qstash/api-reference/messages/cancel-a-message.md) — consultées 2026-09-30 |
| **Cloudflare Durable Objects, alarmes** | La milliseconde en entrée ; précision réelle non documentée | `deleteAlarm()` puis `setAlarm()` | Une seule alarme par objet. Exécution garantie au moins une fois, jusqu'à 6 reprises. Gratuit : 100 000 requêtes par jour, 13 000 Go-s par jour, stockage SQLite uniquement. Les opérations échouent au-delà. | VERIFIED | [Alarmes](https://developers.cloudflare.com/durable-objects/api/alarms/) — 2026-04-21 ; [Tarifs DO](https://developers.cloudflare.com/durable-objects/platform/pricing/) — 2026-08-25 |
| **Cloudflare Workers** (hôte des alarmes) | — | — | 100 000 requêtes par jour, **10 ms de CPU par invocation**, 5 déclencheurs cron par compte. Offre payante à partir de 5 $/mois. | VERIFIED | [Tarifs Workers](https://developers.cloudflare.com/workers/platform/pricing/) — 2026-08-28 ; [Limites](https://developers.cloudflare.com/workers/platform/limits/) — 2026-09-05 |
| **Cloudflare Queues** | La seconde, délai maximal de 24 heures | Aucune annulation documentée | 10 000 opérations par jour, rétention de 24 heures. | VERIFIED | [Queues](https://developers.cloudflare.com/queues/configuration/batching-retries/) — 2026-04-21 |
| **Vercel Cron (Hobby)** | **Une fois par jour, à ± 59 minutes** | — | **Inutilisable pour un minuteur.** Une expression plus fréquente fait échouer le déploiement. | VERIFIED | [Vercel — Cron](https://vercel.com/docs/cron-jobs/usage-and-pricing) — 2026-07-15 |
| **Vercel Queues et Workflows (Hobby)** | Délai jusqu'à 7 jours (Queues) ; `sleep` sans limite (Workflows) | Non vérifié | 1 000 000 d'opérations de file ; 50 000 événements de workflow par mois. Lie le backend à Vercel. | VERIFIED pour les quotas, UNVERIFIED pour l'annulation | [Queues](https://vercel.com/docs/queues/pricing) — 2026-08-12 ; [Workflows](https://vercel.com/docs/workflows/pricing) — 2026-09-16 |

### Envoyer du Web Push depuis un environnement edge

| # | Affirmation | Statut | Source + date |
|---|---|---|---|
| 2.1 | Les Edge Functions Supabase importent des paquets npm (`npm:`), JSR (`jsr:`) et les modules Node intégrés (`node:`). | VERIFIED | [Supabase — dépendances](https://supabase.com/docs/guides/functions/dependencies) — consultée 2026-09-30 |
| 2.2 | Le paquet `web-push` fonctionne dans le runtime Deno de Supabase ; une équipe l'a préféré parce qu'il accepte directement les clés VAPID au format base64url. | REPORTED | [PR rackem-leagues #255](https://github.com/jacked-apps/rackem-leagues/pull/255) — 2026-09-04 |
| 2.3 | `@negrel/webpush` cible Deno et les runtimes compatibles web, avec les seules primitives WebCrypto. Avertissement de l'auteur : la bibliothèque n'a pas été relue par des experts en cryptographie. | VERIFIED | [negrel/webpush](https://github.com/negrel/webpush) — consulté 2026-09-30 |
| 2.4 | `@block65/webcrypto-web-push` cible Node, Cloudflare Workers, Bun et Deno. | VERIFIED | [block65/webcrypto-web-push](https://github.com/block65/webcrypto-web-push) — consulté 2026-09-30 |
| 2.5 | `web-push` expose les options TTL, urgence, sujet et encodage, ainsi qu'une fonction qui prépare la requête sans l'envoyer. | VERIFIED | [web-push-libs/web-push](https://github.com/web-push-libs/web-push) — consulté 2026-09-30 |
| 2.6 | Apple demande de ne pas régénérer le jeton VAPID plus d'une fois par heure. Lu une seule fois, à relire sur la page. | VERIFIED | [Apple — web push](https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers) — consultée 2026-09-30 |
| 2.7 | Modèle répandu : table d'envois en attente, tâche cron qui n'appelle la fonction que s'il y a des envois dus, suppression des abonnements sur réponse 404 ou 410. | REPORTED | [Issue osubb-app #703](https://github.com/Alex-Bancila/osubb-app/issues/703) — 2026-09-23 ; [PR rackem-leagues #255](https://github.com/jacked-apps/rackem-leagues/pull/255) — 2026-09-04 |
| 2.8 | Le chiffrement et la signature d'une push tiennent-ils dans les 10 ms de CPU d'un Worker Cloudflare gratuit ? | UNVERIFIED | À mesurer si cette option est retenue. |
| 2.9 | Format exact à l'envoi d'une push déclarative (en-tête Content-Type, chiffrement identique au Web Push classique). | UNVERIFIED | L'article WebKit n'aborde pas ces détails. |

### Architecture recommandée pour la notification

**Étape 1, tout dans Supabase (suffisant pour démarrer).**

1. Au démarrage d'une session, une fonction serveur écrit la session et une ligne « notification due à telle heure » dans la même transaction.
2. Une tâche pg_cron, toutes les 10 à 15 secondes, cherche les lignes dues. Elle n'appelle l'Edge Function que s'il y en a, et les lui transmet par lot.
3. L'Edge Function **revérifie l'état de la session** avant d'envoyer. Si la session a été mise en pause ou arrêtée entre-temps, elle n'envoie rien. Cette revérification protège contre les courses entre annulation et envoi.
4. Envoi avec un TTL court (une à deux minutes) pour qu'une notification en retard soit abandonnée plutôt qu'affichée trop tard, l'urgence `high`, et un sujet par session pour qu'une nouvelle notification remplace l'ancienne.
5. Charge utile au format déclaratif, plus un gestionnaire de service worker qui affiche toujours une notification, pour les iOS antérieurs à 18.4.
6. Sur réponse 404 ou 410, suppression de l'abonnement.
7. Purge régulière de l'historique pg_cron et des lignes envoyées.

**Pause et arrêt anticipé.** La fonction serveur qui met en pause annule la ligne de notification dans la même transaction. La reprise en crée une nouvelle avec la nouvelle heure de fin.

**Précision attendue.** Intervalle de la tâche cron, plus le démarrage de la fonction, plus la livraison par Apple. Ordre de grandeur estimé : 10 à 30 secondes. **Cette estimation n'est pas mesurée** ; c'est l'objet du premier prototype.

**Étape 2, seulement si la précision est insuffisante.** Remplacer l'interrogation par QStash (heure absolue, annulation par identifiant). C'est le changement le plus simple. Les alarmes Durable Objects sont l'alternative si l'on veut rester sur du gratuit à plus grande échelle, au prix d'une seconde plateforme à apprendre.

**Au premier plan.** Si l'app est visible à la fin de la session, elle affiche elle-même l'alerte. La push est envoyée quand même ; ne jamais la supprimer dans le service worker, à cause de la règle des push silencieux.

---

## Fiche 3 — Limites des offres gratuites en 2026

### Supabase Free

| # | Affirmation | Statut | Source + date |
|---|---|---|---|
| 3.1 | 2 projets actifs ; les projets en pause ne comptent pas. | VERIFIED | [Tarifs Supabase](https://supabase.com/pricing) ; [Facturation](https://supabase.com/docs/guides/platform/billing-on-supabase) — consultées 2026-09-30 |
| 3.2 | Base de données : 500 Mo, CPU partagé, 500 Mo de RAM. Au-delà, le projet passe en lecture seule. | VERIFIED | [Tarifs](https://supabase.com/pricing) ; [Taille de la base](https://supabase.com/docs/guides/platform/database-size) — consultées 2026-09-30 |
| 3.3 | Trafic sortant : 5 Go, plus 5 Go en cache. Couvre base, authentification, stockage, fonctions et Realtime. | VERIFIED | [Trafic sortant](https://supabase.com/docs/guides/platform/manage-your-usage/egress) — consultée 2026-09-30 |
| 3.4 | 50 000 utilisateurs actifs mensuels ; un utilisateur est compté une fois par cycle. | VERIFIED | [MAU](https://supabase.com/docs/guides/platform/manage-your-usage/monthly-active-users) — consultée 2026-09-30 |
| 3.5 | Edge Functions : 500 000 invocations par mois, quel que soit le code de réponse ; 100 fonctions par projet. | VERIFIED | [Invocations](https://supabase.com/docs/guides/platform/manage-your-usage/edge-function-invocations) ; [Limites](https://supabase.com/docs/guides/functions/limits) — consultées 2026-09-30 |
| 3.6 | Realtime : 200 connexions simultanées en pointe, 2 millions de messages par mois, 100 messages/s, 100 canaux par connexion, 20 messages de présence/s, 10 clés de présence par objet, 256 Ko par message. | VERIFIED | [Limites Realtime](https://supabase.com/docs/guides/realtime/limits) ; [Tarifs Realtime](https://supabase.com/docs/guides/realtime/pricing) — consultées 2026-09-30 |
| 3.7 | Comptage des messages : un message diffusé à 4 clients compte pour 5 ; un changement de base écouté par 5 clients compte pour 5. | VERIFIED | [Messages Realtime](https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages) — consultée 2026-09-30 |
| 3.8 | Mise en pause après 7 jours de faible activité. Un e-mail d'avertissement est envoyé environ une semaine avant. Quelques requêtes par jour suffisent à l'éviter. | VERIFIED | [Mise en pause](https://supabase.com/docs/guides/platform/free-project-pausing) — consultée 2026-09-30 |
| 3.9 | Fenêtre de restauration d'un projet en pause : 1 an selon la documentation actuelle. Un changelog de 2024 indiquait 90 jours ; les références se contredisent. | VERIFIED (doc actuelle) | [Mise en pause](https://supabase.com/docs/guides/platform/free-project-pausing) — consultée 2026-09-30 ; [Changelog](https://supabase.com/changelog/27497-paused-free-plan-projects-are-restorable-for-90-days) — 2024 |
| 3.10 | Pas de sauvegardes automatiques ; journaux conservés 1 jour. | VERIFIED | [Tarifs](https://supabase.com/pricing) — consultée 2026-09-30 |
| 3.11 | **Piège :** le service d'e-mail intégré n'envoie qu'aux adresses des membres de l'équipe du projet, et 2 messages par heure au plus. Sans SMTP personnalisé, les camarades de classe ne peuvent pas recevoir d'e-mail d'inscription. | VERIFIED | [SMTP](https://supabase.com/docs/guides/auth/auth-smtp) ; [Limites Auth](https://supabase.com/docs/guides/auth/rate-limits) — consultées 2026-09-30 |
| 3.12 | Dépassement de quota : notification, période de grâce accordée une seule fois, puis restrictions possibles (pause, lecture seule, code 402 sur toutes les requêtes). | VERIFIED | [FAQ facturation](https://supabase.com/docs/guides/platform/billing-faq) — consultée 2026-09-30 |
| 3.13 | Les anciennes clés `anon` et `service_role` seront dépréciées d'ici fin 2026 au profit des clés `sb_publishable_` et `sb_secret_`. | VERIFIED | [Clés d'API](https://supabase.com/docs/guides/api/api-keys) — consultée 2026-09-30 |
| 3.14 | Pro : à partir de 25 $/mois, avec 10 $ de crédit de calcul, 8 Go de disque, 250 Go de trafic sortant, 100 000 MAU, 500 connexions Realtime, 5 millions de messages, 2 millions d'invocations, sauvegardes 7 jours, pas de mise en pause. Chaque projet supplémentaire ajoute un coût de calcul. | VERIFIED | [Tarifs](https://supabase.com/pricing) ; [Facturation](https://supabase.com/docs/guides/platform/billing-on-supabase) — consultées 2026-09-30 |
| 3.15 | Une tâche pg_cron compte-t-elle comme « activité » empêchant la mise en pause ? | UNVERIFIED | La documentation parle d'activité « utilisateur ». |
| 3.16 | Les connexions anonymes comptent-elles dans les MAU ? | UNVERIFIED | Non précisé dans les pages lues. |

### Vercel Hobby

| # | Affirmation | Statut | Source + date |
|---|---|---|---|
| 3.17 | Usage **non commercial et personnel uniquement**. Est commercial tout déploiement servant au gain financier de quiconque : paiement, publicité, vente, affiliation. Les dons ne sont pas considérés comme commerciaux. | VERIFIED | [Vercel — Fair Use](https://vercel.com/docs/limits/fair-use-guidelines) — 2026-09-14 |
| 3.18 | Inclus par mois : 100 Go de transfert, 10 Go de transfert d'origine, **1 000 000 de requêtes CDN**, 1 000 000 d'invocations de fonctions, 4 heures de CPU actif, 360 Go-heures de mémoire. | VERIFIED | [Vercel — Hobby](https://vercel.com/docs/plans/hobby) — 2026-09-14 |
| 3.19 | En cas de dépassement, la fonctionnalité est en général suspendue jusqu'à ce que 30 jours soient écoulés. | VERIFIED | [Vercel — Hobby](https://vercel.com/docs/plans/hobby) — 2026-09-14 |
| 3.20 | Fonctions : 300 s de durée maximale, 2 Go de mémoire, 4,5 Mo par requête ou réponse. | VERIFIED | [Vercel — limites des fonctions](https://vercel.com/docs/functions/limitations) — 2026-08-24 |
| 3.21 | Cron : 100 tâches par projet, mais une exécution par jour au plus, à ± 59 minutes. | VERIFIED | [Vercel — Cron](https://vercel.com/docs/cron-jobs/usage-and-pricing) — 2026-07-15 |
| 3.22 | 100 déploiements par jour, 200 projets, journaux d'exécution conservés 1 heure. | VERIFIED | [Vercel — Limites](https://vercel.com/docs/limits) — 2026-09-16 |
| 3.23 | Pro : 20 $ par siège développeur et par mois. | VERIFIED | [Vercel — Hobby](https://vercel.com/docs/plans/hobby) — 2026-09-14 |

### À quel nombre d'utilisateurs les limites sont-elles atteintes ?

**Ce qui suit est une estimation de ma part, pas un fait sourcé.** Hypothèses : 6 sessions et 6 pauses par utilisateur actif et par jour ; environ 150 Ko de données ajoutées par utilisateur et par mois ; environ 200 Ko de trafic sortant par utilisateur et par jour ; 15 requêtes CDN par jour avec un bon cache.

| Ressource | Limite gratuite | Seuil estimé | Commentaire |
|---|---|---|---|
| Projet Supabase en pause | 7 jours de faible activité | **Dès le début** | Risque pendant les vacances. L'app tombe jusqu'à restauration manuelle. |
| E-mails d'authentification | 2 par heure, équipe seulement | **Dès le premier camarade** | À régler avant tout test avec des tiers. |
| Connexions Realtime | 200 simultanées | 700 à 1 000 actifs quotidiens si chaque session ouvre une connexion | Les révisions se concentrent aux mêmes heures en période d'examens. Beaucoup plus haut si Realtime est réservé aux sessions de groupe. |
| Trafic sortant Supabase | 5 Go | 500 à 1 500 actifs quotidiens | Dépend de la sobriété des requêtes. |
| Taille de base | 500 Mo | 1 000 actifs quotidiens pendant 3 mois, ou 100 pendant près de 3 ans | Agréger les anciennes sessions repousse le seuil. |
| Invocations Edge Functions | 500 000 | Environ 1 400 actifs quotidiens si une invocation par notification | Avec envoi par lot, le plafond n'est jamais atteint. |
| Messages Realtime | 2 millions | Non limitant si l'on ne diffuse que les changements d'état | **Diffuser un « tic » par seconde coûterait environ 21 600 messages par heure pour un groupe de 5, soit tout le quota mensuel en moins de 100 heures de groupe.** Dix groupes actifs deux heures par jour l'épuiseraient en cinq jours. |
| Requêtes CDN Vercel | 1 million | 200 actifs quotidiens sans cache, environ 2 000 avec pré-cache | Le service worker est déterminant. |
| MAU Supabase | 50 000 | Non limitant | — |

**Conclusion.** Pour quelques dizaines de camarades, aucune limite de volume n'est proche. Les vrais pièges du début sont qualitatifs : mise en pause, e-mails, absence de sauvegarde, clause non commerciale. Les limites de volume apparaissent entre quelques centaines et 1 500 utilisateurs actifs quotidiens.

### Étape suivante la moins chère

1. **Supabase Pro à 25 $/mois** quand le projet compte de vrais utilisateurs. Il supprime la mise en pause et ajoute les sauvegardes. Garder le projet de développement dans une organisation gratuite distincte pour éviter un second coût de calcul.
2. **Rester sur Vercel Hobby** tant que l'usage est non commercial. En cas de monétisation, comparer Vercel Pro (20 $/mois) avec un hébergement statique gratuit. Cloudflare indique que les requêtes vers les fichiers statiques sont gratuites et illimitées (VERIFIED, [Cloudflare — static assets](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/), 2026-04-23). L'autorisation d'usage commercial sur l'offre gratuite de Cloudflare est UNVERIFIED.
3. **E-mails :** un SMTP tiers. Resend propose 3 000 e-mails par mois et 100 par jour gratuitement (VERIFIED, [Resend](https://resend.com/pricing), consultée 2026-09-30). Il faut un nom de domaine. Supabase applique ensuite 30 messages par heure par défaut, modifiable.
4. **Notifications à plus grande échelle :** QStash à l'usage, 1 $ pour 100 000 messages.

---

## Fiche 4 — Minuteur de groupe synchronisé avec Supabase Realtime

| # | Affirmation | Statut | Source + date |
|---|---|---|---|
| 4.1 | Pour suivre des changements de base, Supabase recommande Broadcast : « the recommended method for scalability and security ». Postgres Changes est plus simple mais passe moins bien à l'échelle. | VERIFIED | [Supabase — changements de base](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes) — consultée 2026-09-30 |
| 4.2 | Postgres Changes vérifie l'autorisation de chaque événement pour chaque abonné et traite les changements sur un seul fil. | VERIFIED | [Supabase — Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes) — consultée 2026-09-30 |
| 4.3 | Broadcast peut être émis depuis la base par déclencheur. Cela exige des canaux privés et des politiques RLS sur la table des messages Realtime. | VERIFIED | [Broadcast](https://supabase.com/docs/guides/realtime/broadcast) ; [Autorisation](https://supabase.com/docs/guides/realtime/authorization) — consultées 2026-09-30 |
| 4.4 | Les politiques d'accès sont mises en cache pour la durée de la connexion ; un accès révoqué ne prend effet qu'à la reconnexion ou à l'expiration du jeton. | VERIFIED | [Autorisation](https://supabase.com/docs/guides/realtime/authorization) — consultée 2026-09-30 |
| 4.5 | Presence convient aux états qui changent lentement. Pendant une resynchronisation, des événements d'arrivée et de départ peuvent survenir sans mouvement réel. | VERIFIED | [Presence](https://supabase.com/docs/guides/realtime/presence) — consultée 2026-09-30 |
| 4.6 | Battement de cœur toutes les 25 s par défaut ; reconnexion automatique avec délais croissants (1, 2, 5, 10 s). Options utiles : battement dans un Web Worker, et fonction de rappel sur l'état du battement. | VERIFIED | [Battements](https://supabase.com/docs/guides/troubleshooting/realtime-heartbeat-messages) ; [Déconnexions silencieuses](https://supabase.com/docs/guides/troubleshooting/realtime-handling-silent-disconnections-in-backgrounded-applications-592794) — consultées 2026-09-30 |
| 4.7 | Broadcast Replay (bêta) : canaux privés, messages émis depuis la base uniquement, 25 messages au plus, conservation d'environ 72 heures. | VERIFIED | [Broadcast](https://supabase.com/docs/guides/realtime/broadcast) — consultée 2026-09-30 |
| 4.8 | La documentation ne promet pas la livraison de chaque message. Les changements survenus pendant une déconnexion sont perdus. | REPORTED | [Issue realtime-js #121](https://github.com/supabase/realtime-js/issues/121) — ouverte 2021-12-08 |
| 4.9 | Sur iOS, la connexion tombe dès que l'app est suspendue. | REPORTED | Voir lignes 1.19 et 1.21. |

### Conception recommandée

**État faisant autorité, dans Postgres.** Une ligne par session de groupe : phase en cours, heure de début de phase, durée prévue, état de pause, temps restant au moment de la pause, numéro de version. Toute modification passe par une fonction serveur qui utilise l'horloge de la base. **Aucun client n'écrit d'heure.**

**Diffusion.** Un déclencheur diffuse chaque changement d'état sur un canal privé propre à la session. On diffuse des événements, jamais des « tics ».

**Calcul côté client.** Temps restant = heure de début + durée − (heure locale + décalage estimé). Le décalage s'estime en demandant l'heure au serveur plusieurs fois et en retenant l'échantillon au temps d'aller-retour le plus court.

**Resynchronisation.** Au retour au premier plan et à chaque reconnexion, dans cet ordre :

1. relire la ligne de session par requête classique, car c'est la vérité ;
2. vérifier la connexion Realtime et se réabonner si besoin ;
3. redéclarer sa présence ;
4. réestimer le décalage d'horloge.

Le canal temps réel n'est qu'une optimisation. L'app doit rester correcte sans lui.

**Présence et bonus collectif.** Ne pas fonder le bonus sur Presence. Un participant qui verrouille son téléphone pour travailler, ce qui est le comportement souhaité, apparaît comme parti. Fonder le bonus sur des pointages enregistrés en base : a rejoint avant le début, a pointé à la fin dans un délai donné. Presence sert seulement à l'affichage.

### Vérifier la co-localisation à bas coût

| Méthode | Faisable en PWA iOS ? | Commentaire | Statut |
|---|---|---|---|
| **Code court tournant affiché par l'hôte** (6 chiffres, renouvelé toutes les 30 à 60 s, validé par le serveur) | **Oui** | Le plus simple et le plus robuste. À saisir dans l'app. | Conception |
| **QR code tournant** | **Oui, avec un lecteur intégré à l'app** | Exige la caméra et une bibliothèque JavaScript de décodage. **Ne pas compter sur l'appareil photo natif** : le lien s'ouvrirait dans Safari, où l'utilisateur n'est pas connecté. | VERIFIED pour la caméra, REPORTED pour l'ouverture dans Safari |
| **Géolocalisation** | Oui techniquement | Imprécise en intérieur, fournie par le client donc falsifiable, demande de permission, donnée personnelle sensible. À éviter comme preuve. | UNVERIFIED |
| **Bluetooth** | **Non** | Web Bluetooth n'est pas supporté sur iOS. | VERIFIED |

Limite assumée : un code tournant peut être transmis par message à un ami absent. La rotation rapide réduit l'abus sans l'éliminer. C'est acceptable pour un bonus de jeu à faible enjeu.

---

## Fiche 5 — Intégrité : XP et butin sous autorité du serveur

| # | Affirmation | Statut | Source + date |
|---|---|---|---|
| 5.1 | Une table d'un schéma exposé sans RLS est lisible et modifiable par tout rôle qui a un droit dessus. Activer RLS sur chaque table exposée. | VERIFIED | [Supabase — RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) — consultée 2026-09-30 |
| 5.2 | Les politiques ne retirent pas les droits existants. Procédure : activer RLS, révoquer les droits des rôles clients, ne redonner que le nécessaire. | VERIFIED | [Supabase — RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) — consultée 2026-09-30 |
| 5.3 | La clé secrète contourne RLS. Elle ne doit jamais se trouver dans le navigateur. Seule la clé publiable peut être exposée. | VERIFIED | [Supabase — clés d'API](https://supabase.com/docs/guides/api/api-keys) — consultée 2026-09-30 |
| 5.4 | Ne pas fonder une politique sur les métadonnées utilisateur, que l'utilisateur peut modifier lui-même. | VERIFIED | [Supabase — RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) — consultée 2026-09-30 |
| 5.5 | Une fonction `security definer` placée dans un schéma exposé est appelable par l'API avec les privilèges de son créateur. La placer dans un schéma privé, avec un chemin de recherche vide. | VERIFIED | [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) ; [Fonctions](https://supabase.com/docs/guides/database/functions) — consultées 2026-09-30 |
| 5.6 | Par défaut, une fonction est exécutable par tous les rôles. Il faut révoquer ce droit puis l'accorder explicitement. | VERIFIED | [Supabase — fonctions](https://supabase.com/docs/guides/database/functions) — consultée 2026-09-30 |
| 5.7 | Les vues contournent RLS par défaut. | VERIFIED | [Supabase — RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) — consultée 2026-09-30 |
| 5.8 | Le Security Advisor détecte notamment : RLS désactivé, politique trop permissive, fonction privilégiée appelable, politique fondée sur les métadonnées utilisateur. | VERIFIED | [Supabase — advisors](https://supabase.com/docs/guides/database/database-advisors) — consultée 2026-09-30 |
| 5.9 | Les privilèges par colonne existent, mais Supabase ne les recommande pas à la plupart des utilisateurs. | VERIFIED | [Supabase — sécurité par colonne](https://supabase.com/docs/guides/database/postgres/column-level-security) — consultée 2026-09-30 |
| 5.10 | Dans une Edge Function, la vérification du jeton est activée par défaut. La désactiver rend la fonction entièrement responsable de l'authentification. | VERIFIED | [Supabase — auth des fonctions](https://supabase.com/docs/guides/functions/auth) — consultée 2026-09-30 |
| 5.11 | CVE-2025-48757 : plus de 170 applications exposées faute de RLS, sur 1 645 analysées. | REPORTED | Analyses secondaires, par exemple [Superblocks](https://www.superblocks.com/blog/lovable-vulnerabilities) — 2025 |

### Modèle recommandé

- **Le client lit, il n'écrit pas.** Sur les tables de progression (XP, niveau, inventaire, dégâts au boss), le rôle authentifié n'a qu'un droit de lecture, limité par RLS à ses propres lignes ou à sa guilde.
- **Toute écriture passe par des fonctions serveur** : démarrer, mettre en pause, reprendre, terminer une session, réclamer une récompense. Une fonction fine dans le schéma exposé appelle l'implémentation privilégiée placée dans un schéma privé.
- **Le serveur horodate.** Le début et la fin d'une session en ligne sont fixés par l'horloge de la base.
- **Le serveur calcule.** XP et tirages de butin sont faits côté serveur, dans la transaction qui clôt la session. Le client n'envoie jamais un montant.
- **Journal en ajout seul.** Chaque gain est une ligne ; les totaux s'en déduisent. Cela permet d'auditer et de corriger.

### Règles de validation des sessions

| Règle | But |
|---|---|
| Durée maximale par session (par exemple 120 minutes) | Bloquer les sessions géantes. |
| Durée créditée plafonnée à la durée prévue, pauses déduites | Empêcher de gonfler une session. |
| Pas de chevauchement entre sessions d'un même utilisateur, imposé par une contrainte de base | Empêcher les sessions parallèles. |
| Plafond quotidien (par exemple 12 à 16 heures) | Borner l'abus. |
| Une fin ne peut pas être dans le futur | Cohérence. |
| Limitation du débit d'appels | Freiner les scripts. |
| Identifiant unique généré par le client, accepté une seule fois | Rejouer sans dupliquer. |

### Limites honnêtes

- **On ne prouve pas l'étude.** Un utilisateur peut lancer le minuteur et faire autre chose. L'objectif réaliste est d'empêcher la falsification triviale, pas de garantir l'effort.
- **Les sessions hors ligne reposent sur l'horloge du téléphone.** Voir fiche 6 pour les garde-fous.

### Erreurs courantes à éviter

1. Clé secrète dans le code client ou dans une variable d'environnement exposée au navigateur.
2. Table créée sans activer RLS.
3. Politique qui autorise tout, ou politique de lecture sans politique d'écriture correspondante.
4. Politique fondée sur des métadonnées modifiables par l'utilisateur.
5. Fonction privilégiée dans le schéma exposé, ou sans chemin de recherche fixé.
6. Droit d'exécution laissé au rôle public.
7. Vue créée sans respecter les politiques des tables sous-jacentes.
8. Canal Realtime public pour des données de groupe.
9. Démarrer avec les anciennes clés, dépréciées fin 2026.

---

## Fiche 6 — Hors ligne d'abord

| # | Affirmation | Statut | Source + date |
|---|---|---|---|
| 6.1 | Pas de Background Sync sur iOS : la synchronisation n'a lieu que lorsque l'app est ouverte. | VERIFIED | [caniuse — background-sync](https://caniuse.com/background-sync) — consulté 2026-09-30 |
| 6.2 | Le stockage d'une web app installée n'est pas soumis au plafond de 7 jours et peut être rendu persistant. | VERIFIED | Voir lignes 1.32 à 1.34. |
| 6.3 | Le guide PWA officiel de Next.js cite Serwist comme option pour le cache hors ligne, avec des exemples pour Turbopack et pour webpack. Il mentionne aussi un hook expérimental `useOffline`. | VERIFIED | [Next.js — guide PWA](https://nextjs.org/docs/app/guides/progressive-web-apps) — v16.3.7, 2026-07-30 |
| 6.4 | Serwist documente un guide webpack et un guide Turbopack distincts. | VERIFIED | [Serwist](https://serwist.pages.dev/docs/next/getting-started) — consultée 2026-09-30 |
| 6.5 | Des projets ont dû migrer vers la variante Turbopack de Serwist en passant à Next.js 16, parce que le service worker ne s'enregistrait plus. | REPORTED | [shinyaz](https://shinyaz.com/en/blog/2026/02/24/serwist-turbopack-migration) — 2026-02-24 |
| 6.6 | vite-plugin-pwa (v1.2.0) génère le manifeste et le service worker, avec deux stratégies. Il supporte React, Vue, Svelte, SvelteKit et d'autres. | VERIFIED | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/guide/) — consultée 2026-09-30 |
| 6.7 | L'export statique de Next.js ne supporte ni les Server Actions, ni les cookies, ni les redirections, réécritures et en-têtes, ni le proxy. | VERIFIED | [Next.js — export statique](https://nextjs.org/docs/app/guides/static-exports) — v16.3.7, 2026-08-25 |
| 6.8 | Capacitor exige un dossier de fichiers web construits avec un `index.html`. | VERIFIED | [Capacitor](https://capacitorjs.com/docs/getting-started) — consultée 2026-09-30 |
| 6.9 | Dexie est une surcouche d'IndexedDB. RxDB propose un module de réplication pour Supabase. | VERIFIED | [Dexie](https://dexie.org/) ; [RxDB](https://rxdb.info/replication-supabase.html) — consultées 2026-09-30 |
| 6.10 | PowerSync gratuit : 2 Go synchronisés par mois, 500 Mo hébergés, **50 clients simultanés**, désactivation après une semaine d'inactivité. Offre suivante à partir de 49 $/mois. | VERIFIED | [PowerSync](https://www.powersync.com/pricing) — consultée 2026-09-30 |
| 6.11 | Fiabilité actuelle d'IndexedDB sur iOS 26 et 27. | UNVERIFIED | Aucune régression relevée dans les notes WebKit lues ; non testé. |

### Approche recommandée

**Persistance locale.** IndexedDB, avec une surcouche légère. Trois ensembles : les sessions locales, une file d'envoi, et un cache en lecture du profil. Demander le stockage persistant.

**Synchronisation.** File d'envoi vidée à l'ouverture de l'app, au retour au premier plan et au retour du réseau. Chaque élément porte un identifiant unique généré par le client ; le serveur l'accepte une seule fois. Rejouer un envoi est donc sans danger.

**Conflits.** Le problème est réduit par construction :

- les sessions sont des faits ajoutés, jamais modifiés, donc sans conflit ;
- XP, niveau et inventaire sont calculés par le serveur ; le client affiche une valeur provisoire puis adopte celle du serveur ;
- pour les réglages, la dernière écriture gagne.

**Sessions hors ligne et intégrité.** Le serveur ne peut pas vérifier l'horloge du téléphone. Garde-fous :

- la session doit commencer après le dernier contact du client avec le serveur ;
- elle doit finir avant l'heure de réception ;
- pas de chevauchement, plafond quotidien ;
- marquer la session comme « hors ligne » et éventuellement plafonner l'XP gagnée ainsi par jour ;
- tirer le butin au moment de la synchronisation, côté serveur.

**Éviter un moteur de synchronisation générique au départ.** Les données du projet s'y prêtent mal (elles sont surtout en ajout seul) et l'offre gratuite de PowerSync est limitée à 50 clients simultanés. Une file d'envoi écrite à la main est plus simple à comprendre et à déboguer pour un développeur seul.

**Limite à assumer.** Au sous-sol d'une bibliothèque, téléphone verrouillé : aucune alerte de fin. La push ne peut pas arriver et le JavaScript est gelé. La seule parade en PWA est le mode « écran allumé » avec alerte visuelle et sonore au premier plan. C'est le principal argument en faveur d'une enveloppe native à terme.

### Choix du framework

| Option | Pour | Contre | Avis |
|---|---|---|---|
| **Vite + React + TypeScript + vite-plugin-pwa** (application monopage statique) | Sortie statique hébergeable partout ; s'intègre directement à Capacitor ; peu de concepts ; le service worker est géré par un module mature ; React facilite une réutilisation partielle avec Expo. | Pas de rendu serveur, sans importance ici. | **Risque le plus faible. Recommandé.** |
| SvelteKit en mode statique | Léger, agréable. | Écosystème plus petit ; pas de passerelle vers React Native. | Bon choix si Svelte est déjà connu. |
| Next.js + Serwist | Documentation abondante ; intégration Vercel. | Les fonctions serveur sont incompatibles avec l'export statique, donc avec Capacitor ; intégration du service worker dépendante du bundler ; plus de concepts à maîtriser. | À éviter, sauf export statique strict dès le départ. |

Le backend étant entièrement dans Supabase, le rendu serveur n'apporte rien à ce projet.

---

## Fiche 7 — Stratégie de sortie : Capacitor ou Expo

| # | Affirmation | Statut | Source + date |
|---|---|---|---|
| 7.1 | Programme développeur Apple : 99 USD par an. Une exemption existe pour les organismes à but non lucratif, les établissements d'enseignement accrédités et les entités gouvernementales. Elle vise des organisations ; rien n'indique qu'elle couvre un étudiant à titre individuel. | VERIFIED | [Apple — programme](https://developer.apple.com/programs/whats-included/) — consultée 2026-09-30 |
| 7.2 | Sans adhésion payante : test sur appareil via Xcode, profils expirant après 7 jours, 3 apps par appareil ; pas de TestFlight ni d'App Store. | VERIFIED | [Apple — comparatif](https://developer.apple.com/support/compare-memberships/) — consultée 2026-09-30 |
| 7.3 | Capacitor (version 8) enveloppe une application web existante. Un même code peut servir la PWA et l'app native ; beaucoup de modules ont une implémentation web. | VERIFIED | [Capacitor](https://capacitorjs.com/docs/getting-started) ; [PWA](https://capacitorjs.com/docs/web/progressive-web-apps) — consultées 2026-09-30 |
| 7.4 | **Construire pour iOS avec Capacitor exige macOS** et Xcode 26 au minimum. | VERIFIED | [Capacitor — environnement](https://capacitorjs.com/docs/getting-started/environment-setup) — consultée 2026-09-30 |
| 7.5 | Le module de notifications locales de Capacitor planifie et annule des notifications sans serveur. | VERIFIED | [Capacitor — notifications locales](https://capacitorjs.com/docs/apis/local-notifications) — consultée 2026-09-30 |
| 7.6 | Les push natives iOS avec Capacitor exigent un compte développeur payant et une clé APNs. | VERIFIED | [Capacitor — push](https://capacitorjs.com/docs/guides/push-notifications-firebase) — consultée 2026-09-30 |
| 7.7 | Des modules communautaires Capacitor gèrent les Live Activities (iOS 16.2 ou plus). Ils exigent une extension de widget écrite en Swift dans le projet Xcode. | REPORTED | [kisimediaDE](https://github.com/kisimediaDE/capacitor-live-activity) ; [Cap-go](https://github.com/Cap-go/capacitor-live-activities/) — consultés 2026-09-29 |
| 7.8 | Live Activities : actives 8 heures au plus, visibles jusqu'à 4 heures de plus sur l'écran verrouillé ; 4 Ko de données. Démarrage en principe depuis l'app au premier plan. | VERIFIED | [Apple — ActivityKit](https://developer.apple.com/documentation/activitykit/displaying-live-data-with-live-activities) — consultée 2026-09-30 |
| 7.9 | API Temps d'écran (blocage d'apps) : l'entitlement Family Controls doit être demandé à Apple par le titulaire du compte avant toute distribution, pour l'app et pour chaque extension. | VERIFIED | [Apple — Family Controls](https://developer.apple.com/documentation/familycontrols/requesting-the-family-controls-entitlement) — consultée 2026-09-30 |
| 7.10 | Délai d'approbation de Family Controls : de quelques jours à quelques semaines. | REPORTED | [Newly](https://newly.app/how-to/family-controls-entitlement) — consulté 2026-09-29 |
| 7.11 | Règles de l'App Store : une app doit dépasser le simple site reconditionné (4.2) ; la suppression de compte doit être offerte dans l'app (5.1.1) ; une connexion par un tiers impose une alternative respectueuse de la vie privée (4.8). | VERIFIED | [Apple — App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) — consultée 2026-09-30 |
| 7.12 | Expo (SDK 57) : notifications locales planifiables et annulables ; module de widgets et de Live Activities, iOS seulement, qui exige une version de développement. | VERIFIED | [Expo — notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) ; [Expo — widgets](https://docs.expo.dev/versions/latest/sdk/widgets.md) — consultées 2026-09-30 |
| 7.13 | EAS gratuit : 15 constructions iOS et 15 Android par mois, file d'attente basse priorité. Offre suivante : 19 $/mois. L'adhésion Apple reste requise pour l'App Store. | VERIFIED | [Expo — tarifs](https://expo.dev/pricing) ; [EAS Build](https://docs.expo.dev/build/setup.md) — consultées 2026-09-30 |
| 7.14 | Les composants DOM d'Expo permettent de réutiliser du code web React dans une app native, à travers une vue web, avec des limites. | VERIFIED | [Expo — composants DOM](https://docs.expo.dev/guides/dom-components.md) — consultée 2026-09-30 |
| 7.15 | EAS permet-il de construire pour iOS sans posséder de Mac ? | UNVERIFIED | La documentation parle de constructions dans le cloud sans l'affirmer explicitement. |
| 7.16 | Un abonnement Web Push ne se transfère pas vers l'app native ; il faut un jeton APNs. | UNVERIFIED | Déduction ; prévoir les deux types en base. |

### Ce que chaque voie apporte

| Besoin | PWA | Capacitor | Expo / React Native |
|---|---|---|---|
| Alerte de fin hors ligne, téléphone verrouillé | Non | **Oui** | **Oui** |
| Minuteur sur l'écran verrouillé, Dynamic Island | Non | Oui, avec du Swift | Oui, via le module de widgets |
| Blocage d'apps | Non | Oui, avec du Swift et l'accord d'Apple | Oui, avec un module natif et l'accord d'Apple |
| Vibration | Non | Oui | Oui |
| Présence sur l'App Store | Non | Oui | Oui |
| Réutilisation du code web | — | **Presque totale** | Partielle : logique réutilisée, interface à réécrire |
| Coût | Gratuit | 99 $/an, plus l'accès à un Mac | 99 $/an |
| Délai de mise à jour | Immédiat | Revue Apple | Revue Apple |

**Point d'attention.** Le poste de développement est sous Windows. Capacitor exige macOS pour construire. Il faudra un Mac, un service de construction dans le cloud, ou choisir Expo avec EAS. C'est un coût caché de la sortie par Capacitor.

**Recommandation.** Capacitor est la sortie la moins chère en effort, puisque le code web est conservé. Expo n'a d'intérêt que si l'on veut une interface vraiment native, ce qui revient à réécrire l'interface.

### À faire maintenant pour garder la porte ouverte

1. **Application monopage statique**, sans dépendance à un serveur de rendu. C'est la condition d'entrée de Capacitor.
2. **Toute la logique métier dans Supabase.** Le client natif appellera exactement les mêmes fonctions.
3. **Isoler les services de plateforme derrière des interfaces** : planification de notification, maintien de l'écran allumé, retour haptique, stockage local, lecture de code. Une implémentation web aujourd'hui, une native demain.
4. **Table des abonnements avec une colonne « plateforme »** et un type de jeton, pour accueillir APNs plus tard.
5. **Moteur de minuteur et moteur de synchronisation en TypeScript pur**, sans accès au DOM.
6. **Authentification par code à saisir**, pas par lien magique. Un lien s'ouvre dans Safari, où la session n'est pas partagée avec la web app. Supabase permet d'envoyer un code à 6 chiffres en modifiant le modèle d'e-mail (VERIFIED, [Supabase — sans mot de passe](https://supabase.com/docs/guides/auth/auth-email-passwordless), consultée 2026-09-30).
7. **Ne pas faire dépendre le cœur de l'app du service worker.** Il sert au cache et au push web.
8. **Prévoir la suppression de compte** dès le départ : l'App Store l'exige et c'est une bonne pratique.

---

## Architecture recommandée

```
┌───────────────────── iPhone : PWA installée (WebKit) ─────────────────────┐
│                                                                            │
│  Interface (application monopage statique : Vite + React + TypeScript)     │
│                                                                            │
│  Moteur de minuteur (TypeScript pur)                                       │
│    état = début, durée, pauses cumulées                                    │
│    restant = début + durée − (heure locale + décalage serveur)             │
│    recalcul à chaque affichage et à chaque retour au premier plan          │
│                                                                            │
│  Stockage local IndexedDB                                                  │
│    sessions locales · file d'envoi (identifiants uniques) · cache profil   │
│                                                                            │
│  Service worker                                                            │
│    pré-cache de l'application · réception des push                         │
│                                                                            │
│  Services de plateforme (derrière des interfaces)                          │
│    notification · écran allumé (iOS ≥ 18.4) · lecture de code              │
│                                                                            │
└──────┬──────────────────────────┬──────────────────────────┬──────────────┘
       │ HTTPS                    │ WSS                      │ HTTPS
       │ fichiers statiques       │ sessions de groupe       │ fonctions serveur
       │                          │ uniquement               │ et lectures
┌──────▼─────────┐      ┌─────────▼──────────┐     ┌─────────▼──────────────────────┐
│ Vercel Hobby   │      │ Supabase Realtime  │     │ Supabase Postgres              │
│ CDN statique   │      │ canal privé par    │◄────┤                                │
│ aucune fonction│      │ session de groupe  │     │ Schéma exposé                  │
└────────────────┘      │ Broadcast (états)  │     │   tables en lecture seule, RLS │
                        │ Presence (affichage)│    │   fonctions fines d'entrée     │
                        └────────────────────┘     │                                │
                          diffusion par            │ Schéma privé                   │
                          déclencheur              │   démarrer / pause / reprise / │
                                                   │   terminer / récompenser       │
                                                   │   validation et calcul d'XP    │
                                                   │   journal en ajout seul        │
                                                   │                                │
                                                   │ Notifications dues             │
                                                   │   (session, heure, statut)     │
                                                   │                                │
                                                   │ pg_cron toutes les 10–15 s     │
                                                   └─────────┬──────────────────────┘
                                                             │ pg_net, seulement
                                                             │ s'il y a des envois dus
                                                   ┌─────────▼──────────────────────┐
                                                   │ Edge Function d'envoi          │
                                                   │   revérifie l'état de session  │
                                                   │   chiffre et signe (VAPID)     │
                                                   │   TTL court, urgence haute     │
                                                   │   supprime sur 404 / 410       │
                                                   └─────────┬──────────────────────┘
                                                             │ HTTPS
                                                   ┌─────────▼──────────────────────┐
                                                   │ Service push Apple             │
                                                   │   → notification sur l'iPhone  │
                                                   └────────────────────────────────┘

Évolutions possibles, sans refonte :
  précision  : pg_cron  →  QStash (heure absolue)  ou  alarmes Durable Objects
  natif      : même build web dans Capacitor ; notifications locales à la place du push
  échelle    : Supabase Pro ; hébergement statique déplacé si usage commercial
```

**Principes.**

1. La base est la seule source de vérité. Le temps réel et le cache local sont des optimisations.
2. Le client ne fournit jamais une heure ni un montant qui fasse autorité, sauf pour les sessions hors ligne, qui sont bornées.
3. Toute opération peut être rejouée sans effet de bord.
4. Chaque service propre à la plateforme est remplaçable.

---

## Risques techniques classés par gravité, avec parades

| Rang | Gravité | Risque | Parade |
|---|---|---|---|
| 1 | **Critique** | **La notification de fin n'arrive pas, ou trop tard.** Causes : pas de réseau, mode Concentration, abonnement expiré en silence, retard de livraison. C'est la fonction centrale du produit. | Prototyper et mesurer avant tout le reste. Vérifier l'abonnement à chaque lancement. TTL court. Expliquer à l'utilisateur comment autoriser l'app dans son mode Concentration. Proposer le mode « écran allumé ». Afficher dans l'app l'état réel des notifications. |
| 2 | **Critique** | **Aucun minuteur visible téléphone verrouillé, aucune alerte hors ligne.** Limite de la plateforme, sans contournement web. | L'assumer dans la promesse du produit. Concevoir le retour dans l'app comme un moment agréable (récapitulatif, récompense). Préparer la sortie Capacitor. |
| 3 | **Élevé** | **Falsification de la progression**, en particulier par les sessions hors ligne. | Écritures par fonctions serveur seulement. Règles de validation. Plafond d'XP hors ligne. Journal auditable. Accepter qu'on ne prouve pas l'étude. |
| 4 | **Élevé** | **Erreur de configuration Supabase** : RLS oublié, fonction privilégiée exposée, clé secrète divulguée. | Liste de contrôle de la fiche 5. Security Advisor avant chaque mise en production. Test d'attaque avec la clé publiable. Nouvelles clés dès le départ. |
| 5 | **Élevé** | **Présence de groupe faussée** par la suspension d'iOS. | Bonus fondé sur des pointages en base, pas sur Presence. Resynchronisation complète au retour au premier plan. |
| 6 | **Moyen** | **Projet Supabase mis en pause**, sans sauvegarde. | Surveiller l'e-mail d'avertissement. Exporter la base régulièrement. Passer à Pro dès qu'il y a de vrais utilisateurs. |
| 7 | **Moyen** | **Inscription impossible** : e-mails limités à l'équipe et à 2 par heure. | SMTP tiers avec un nom de domaine, ou connexion anonyme convertie plus tard. |
| 8 | **Moyen** | **Friction d'installation.** Pas d'invite ; chemin caché dans le menu de partage ; permission de notification à demander après coup. | Écran d'accueil qui guide pas à pas, avec captures. Détecter le mode autonome. Ne demander la permission qu'au moment où elle a un sens. |
| 9 | **Moyen** | **Authentification cassée par l'isolation du stockage** : un lien magique ouvre Safari. | Code à saisir dans l'app. Tester tout le parcours dans la web app installée. |
| 10 | **Moyen** | **Clause non commerciale de Vercel Hobby.** | Rester gratuit et sans publicité, ou prévoir le changement d'hébergement. L'export statique rend ce changement trivial. |
| 11 | **Moyen** | **Sortie native coûteuse** : 99 $/an, besoin d'un Mac, revue Apple. | Architecture prête pour Capacitor. Décider sur la base des mesures du prototype. |
| 12 | **Faible à moyen** | **Régressions WebKit** d'une version à l'autre (audio sous iOS 26, Wake Lock avant 18.4). | Tester sur plusieurs versions d'iOS. Détecter les capacités au lieu de les supposer. Dégrader proprement. |
| 13 | **Faible** | **Dépassement de quotas.** | Ne jamais diffuser de « tics ». Envoyer les notifications par lot. Purger les historiques. Agréger les anciennes sessions. |

---

## Ce qu'il faut prototyper en premier pour lever les incertitudes

### Prototype 1 — La chaîne de notification (priorité absolue)

**Pourquoi.** C'est la seule brique dont dépend tout le produit et dont la fiabilité réelle est inconnue.

**Contenu minimal.** Une page installable avec un bouton d'abonnement et un bouton « me notifier dans N minutes » ; une table de notifications dues ; la tâche cron ; la fonction d'envoi. Rien d'autre.

**Mesures**, sur deux ou trois iPhone réels, idéalement sous des versions d'iOS différentes (18.x, 26.x, 27) :

| Situation | Ce qu'on mesure |
|---|---|
| Téléphone verrouillé, 25 minutes | Retard entre l'heure prévue et l'affichage. |
| Mode économie d'énergie | Idem. |
| Mode Concentration, app autorisée ou non | La notification s'affiche-t-elle ? |
| Wi-Fi seul, puis réseau mobile seul | Idem. |
| Après redémarrage du téléphone | L'abonnement est-il toujours valide ? |
| Après 7 puis 14 jours sans ouvrir l'app | L'abonnement est-il toujours valide ? |
| Pause puis reprise juste avant l'échéance | Aucune notification fantôme. |
| App au premier plan à l'échéance | Comportement de la bannière. |

**Critère de réussite proposé.** Au moins 95 % des notifications affichées dans les 30 secondes, sur 50 essais par appareil, et un abonnement encore valide après 14 jours. En dessous, l'argument en faveur d'une enveloppe native devient décisif.

### Prototype 2 — Cycle de vie du minuteur

Verrouiller, déverrouiller, changer d'app, fermer et rouvrir. Vérifier que le temps affiché est exact à chaque retour. Tester le maintien de l'écran allumé et l'alerte sonore au premier plan.

### Prototype 3 — Authentification dans la web app installée

Inscription par code, avec le SMTP tiers, **depuis la web app installée**. Vérifier que la session survit à une fermeture et à deux semaines d'inactivité.

### Prototype 4 — Test d'attaque

Avec la seule clé publiable et un compte ordinaire, essayer d'écrire de l'XP, de créer une session de 10 heures, de lire les données d'un autre utilisateur. Tout doit échouer.

### Prototype 5 — Synchronisation de groupe

Trois téléphones. Mesurer l'écart d'affichage entre eux (objectif : moins de 300 ms). Verrouiller l'un d'eux cinq minutes puis vérifier la resynchronisation. Observer ce que montre Presence.

### Prototype 6 — Hors ligne

Mode avion, session complète, retour du réseau. Vérifier l'envoi, la validation par le serveur, l'absence de doublon en cas de double envoi.

---

## Ce qui n'a pas pu être vérifié

| Sujet | Pourquoi c'est important | Comment le lever |
|---|---|---|
| Fiabilité et latence réelles du Web Push sur iOS 26 et 27 | Cœur du produit | Prototype 1 |
| Délai exact avant le gel du JavaScript en arrière-plan | Dimensionne la resynchronisation | Prototype 2 |
| Possibilité de marquer une push web comme « Time Sensitive », son personnalisé | Traverser un mode Concentration | Test, documentation Apple |
| Web Push pour un site sans manifeste sous iOS 26 | Robustesse de l'installation | Garder le manifeste |
| Format exact d'envoi d'une push déclarative | Mise en œuvre | Test |
| Capture de liens et isolation du stockage sous iOS 26 et 27 | Parcours d'authentification et de QR code | Prototype 3 |
| Parcours OAuth (Google, Apple) dans une web app installée | Choix de la méthode de connexion | Prototype 3 |
| Coût CPU du chiffrement Web Push dans un Worker gratuit | Option Cloudflare | Mesure |
| Annulation d'une exécution Vercel Workflows | Option Vercel | Documentation |
| Une tâche pg_cron empêche-t-elle la mise en pause du projet ? | Disponibilité en gratuit | Support ou observation |
| Connexions anonymes et MAU | Quotas | Documentation |
| Usage commercial autorisé sur l'offre gratuite de Cloudflare | Hébergement de repli | Conditions d'utilisation |
| Construction iOS sans Mac via EAS | Poste de développement sous Windows | Documentation Expo |
| Débogage d'une web app iOS depuis Windows | Productivité ; l'inspecteur web de Safari passe normalement par un Mac | À vérifier |
| Précision de la géolocalisation en intérieur | Co-localisation | Test, mais méthode déconseillée |
| Fiabilité de `performance.now()` à travers une suspension | Choix de l'horloge côté client | Test ; utiliser l'heure murale corrigée du décalage serveur |
| État exact de l'UE au-delà de l'absence de mention | Marché cible | La page de déclaration d'Apple de mars 2024 n'a pas pu être relue directement |

---

## Sources

### WebKit (primaires)

| Source | Date |
|---|---|
| [Web Push for Web Apps on iOS and iPadOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/) | 2023-02-16 |
| [Meet Web Push](https://webkit.org/blog/12945/meet-web-push/) | 2022-06-07 |
| [Meet Declarative Web Push](https://webkit.org/blog/16535/meet-declarative-web-push/) | 2025-03-27 |
| [Updates to Storage Policy](https://webkit.org/blog/14403/updates-to-storage-policy/) | 2023-08-10 |
| [Full Third-Party Cookie Blocking and More](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/) | 2020-03-24 |
| [WebKit Features in Safari 18.0](https://webkit.org/blog/15865/webkit-features-in-safari-18-0/) | 2024-09-16 |
| [WebKit Features in Safari 18.4](https://webkit.org/blog/16574/webkit-features-in-safari-18-4/) | 2025-03-31 |
| [WebKit Features in Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/) | 2025-09-15 |
| [WebKit Features for Safari 26.2](https://webkit.org/blog/17640/webkit-features-for-safari-26-2/) | 2025-12-12 |
| [WebKit Features for Safari 26.4](https://webkit.org/blog/17862/webkit-features-for-safari-26-4/) | 2026-03-24 |
| [WebKit Features for Safari 26.6](https://webkit.org/blog/18178/webkit-features-for-safari-26-6/) | 2026-07-27 |
| [News from WWDC26: WebKit in Safari 27 beta](https://webkit.org/blog/17967/news-from-wwdc26-webkit-in-safari-27-beta/) | 2026-06-08 |
| [WebKit Features for Safari 27.0](https://webkit.org/blog/18325/webkit-features-for-safari-27-0/) | 2026-09-17 |
| [Bogue 254545 — Wake Lock dans les web apps](https://bugs.webkit.org/show_bug.cgi?id=254545) | 2023-03-27, corrigé 2025-03-31 |
| [Bogue 198277 — audio en arrière-plan](https://bugs.webkit.org/show_bug.cgi?id=198277) | 2019-05-27, corrigé iOS 15.4 |
| [Bogue 295518 — régression audio iOS 26](https://bugs.webkit.org/show_bug.cgi?id=295518) | 2025-07-07 |

### Apple (primaires)

| Source | Date |
|---|---|
| [Sending web push notifications in web apps and browsers](https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers) | Non datée, consultée 2026-09-30 |
| [Displaying live data with Live Activities](https://developer.apple.com/documentation/activitykit/displaying-live-data-with-live-activities) | Non datée, consultée 2026-09-30 |
| [Requesting the Family Controls entitlement](https://developer.apple.com/documentation/familycontrols/requesting-the-family-controls-entitlement) | Non datée, consultée 2026-09-30 |
| [Apple Developer Program — What's included](https://developer.apple.com/programs/whats-included/) | Consultée 2026-09-30 |
| [Compare memberships](https://developer.apple.com/support/compare-memberships/) | Consultée 2026-09-30 |
| [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) | Consultée 2026-09-30 |
| [DMA and apps in the EU](https://developer.apple.com/support/dma-and-apps-in-the-eu/) | Consultée 2026-09-30 |

### MDN, caniuse, Chrome (primaires)

| Source | Date |
|---|---|
| [MDN — Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API) | 2024-04-11 |
| [MDN — Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API) | 2025-12-30 |
| [caniuse — vibration](https://caniuse.com/vibration) | Consulté 2026-09-30 |
| [caniuse — background-sync](https://caniuse.com/background-sync) | Consulté 2026-09-30 |
| [caniuse — periodic background sync](https://caniuse.com/wf-periodic-background-sync) | Consulté 2026-09-30 |
| [caniuse — web-bluetooth](https://caniuse.com/web-bluetooth) | Consulté 2026-09-30 |
| [caniuse — webnfc](https://caniuse.com/webnfc) | Consulté 2026-09-30 |
| [caniuse — BarcodeDetector](https://caniuse.com/mdn-api_barcodedetector) | Consulté 2026-09-30 |
| [caniuse — setAppBadge](https://caniuse.com/mdn-api_navigator_setappbadge) | Consulté 2026-09-30 |
| [caniuse — pushsubscriptionchange](https://caniuse.com/mdn-api_serviceworkerglobalscope_pushsubscriptionchange_event) | Consulté 2026-09-30 |
| [caniuse — stream](https://caniuse.com/stream) | Consulté 2026-09-30 |
| [Chrome for Developers — Notification Triggers](https://developer.chrome.com/docs/web-platform/notification-triggers) | Consultée 2026-09-30 |

### Supabase (primaires, consultées le 2026-09-30 sauf mention)

| Source |
|---|
| [Tarifs](https://supabase.com/pricing) |
| [Facturation](https://supabase.com/docs/guides/platform/billing-on-supabase) · [FAQ facturation](https://supabase.com/docs/guides/platform/billing-faq) |
| [Mise en pause des projets](https://supabase.com/docs/guides/platform/free-project-pausing) |
| [Taille de la base](https://supabase.com/docs/guides/platform/database-size) |
| [MAU](https://supabase.com/docs/guides/platform/manage-your-usage/monthly-active-users) · [Trafic sortant](https://supabase.com/docs/guides/platform/manage-your-usage/egress) · [Invocations](https://supabase.com/docs/guides/platform/manage-your-usage/edge-function-invocations) |
| [Messages Realtime](https://supabase.com/docs/guides/platform/manage-your-usage/realtime-messages) · [Connexions en pointe](https://supabase.com/docs/guides/platform/manage-your-usage/realtime-peak-connections) |
| [Limites Realtime](https://supabase.com/docs/guides/realtime/limits) · [Tarifs Realtime](https://supabase.com/docs/guides/realtime/pricing) |
| [Broadcast](https://supabase.com/docs/guides/realtime/broadcast) · [Presence](https://supabase.com/docs/guides/realtime/presence) · [Postgres Changes](https://supabase.com/docs/guides/realtime/postgres-changes) |
| [Autorisation Realtime](https://supabase.com/docs/guides/realtime/authorization) · [Changements de base](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes) |
| [Déconnexions silencieuses](https://supabase.com/docs/guides/troubleshooting/realtime-handling-silent-disconnections-in-backgrounded-applications-592794) · [Battements de cœur](https://supabase.com/docs/guides/troubleshooting/realtime-heartbeat-messages) |
| [Cron](https://supabase.com/docs/guides/cron) · [Quickstart Cron](https://supabase.com/docs/guides/cron/quickstart) · [Annonce Cron](https://supabase.com/blog/supabase-cron) (2024-12-04) |
| [Queues](https://supabase.com/docs/guides/queues) · [API pgmq](https://supabase.com/docs/guides/queues/pgmq) · [Annonce Queues](https://supabase.com/blog/supabase-queues) (2024-12-05) |
| [pg_net](https://supabase.com/docs/guides/database/extensions/pg_net) · [Planifier des fonctions](https://supabase.com/docs/guides/functions/schedule-functions) |
| [Limites des Edge Functions](https://supabase.com/docs/guides/functions/limits) · [Tâches de fond](https://supabase.com/docs/guides/functions/background-tasks) · [Dépendances](https://supabase.com/docs/guides/functions/dependencies) · [Authentification](https://supabase.com/docs/guides/functions/auth) |
| [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) · [Fonctions](https://supabase.com/docs/guides/database/functions) · [Sécurité par colonne](https://supabase.com/docs/guides/database/postgres/column-level-security) |
| [Clés d'API](https://supabase.com/docs/guides/api/api-keys) · [Sécuriser l'API](https://supabase.com/docs/guides/api/securing-your-api) · [Advisors](https://supabase.com/docs/guides/database/database-advisors) |
| [Limites Auth](https://supabase.com/docs/guides/auth/rate-limits) · [SMTP](https://supabase.com/docs/guides/auth/auth-smtp) · [Sans mot de passe](https://supabase.com/docs/guides/auth/auth-email-passwordless) · [Connexion anonyme](https://supabase.com/docs/guides/auth/auth-anonymous) |

### Vercel (primaires)

| Source | Date |
|---|---|
| [Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines) | 2026-09-14 |
| [Hobby Plan](https://vercel.com/docs/plans/hobby) | 2026-09-14 |
| [Limits](https://vercel.com/docs/limits) | 2026-09-16 |
| [Cron Jobs — usage and pricing](https://vercel.com/docs/cron-jobs/usage-and-pricing) | 2026-07-15 |
| [Functions — limits](https://vercel.com/docs/functions/limitations) | 2026-08-24 |
| [Workflows](https://vercel.com/docs/workflows) · [Tarifs Workflows](https://vercel.com/docs/workflows/pricing) | 2026-09-04 · 2026-09-16 |
| [Queues — pricing](https://vercel.com/docs/queues/pricing) | 2026-08-12 |

### Cloudflare et Upstash (primaires)

| Source | Date |
|---|---|
| [Workers — pricing](https://developers.cloudflare.com/workers/platform/pricing/) | 2026-08-28 |
| [Workers — limits](https://developers.cloudflare.com/workers/platform/limits/) | 2026-09-05 |
| [Durable Objects — alarms](https://developers.cloudflare.com/durable-objects/api/alarms/) | 2026-04-21 |
| [Durable Objects — pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/) | 2026-08-25 |
| [Queues — batching and retries](https://developers.cloudflare.com/queues/configuration/batching-retries/) | 2026-04-21 |
| [Pages — limits](https://developers.cloudflare.com/pages/platform/limits/) | 2026-09-05 |
| [Workers — static assets billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) | 2026-04-23 |
| [QStash — tarifs](https://upstash.com/pricing/qstash) · [doc tarifs](https://upstash.com/docs/qstash/overall/pricing.md) | Consultées 2026-09-30 |
| [QStash — délai](https://upstash.com/docs/qstash/features/delay) · [annulation](https://upstash.com/docs/qstash/api-reference/messages/cancel-a-message.md) | Consultées 2026-09-30 |

### Frameworks, bibliothèques, outils (primaires)

| Source | Date |
|---|---|
| [Next.js — guide PWA](https://nextjs.org/docs/app/guides/progressive-web-apps) | v16.3.7, 2026-07-30 |
| [Next.js — export statique](https://nextjs.org/docs/app/guides/static-exports) | v16.3.7, 2026-08-25 |
| [Serwist — Next.js](https://serwist.pages.dev/docs/next/getting-started) | Consultée 2026-09-30 |
| [vite-plugin-pwa](https://vite-pwa-org.netlify.app/guide/) | v1.2.0, consultée 2026-09-30 |
| [Dexie](https://dexie.org/) · [RxDB — Supabase](https://rxdb.info/replication-supabase.html) · [PowerSync — tarifs](https://www.powersync.com/pricing) | Consultées 2026-09-30 |
| [web-push](https://github.com/web-push-libs/web-push) · [negrel/webpush](https://github.com/negrel/webpush) · [block65/webcrypto-web-push](https://github.com/block65/webcrypto-web-push) | Consultés 2026-09-30 |
| [Capacitor — démarrage](https://capacitorjs.com/docs/getting-started) · [environnement](https://capacitorjs.com/docs/getting-started/environment-setup) · [notifications locales](https://capacitorjs.com/docs/apis/local-notifications) · [PWA](https://capacitorjs.com/docs/web/progressive-web-apps) · [push](https://capacitorjs.com/docs/guides/push-notifications-firebase) | v8, consultées 2026-09-30 |
| [Expo — notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) · [widgets](https://docs.expo.dev/versions/latest/sdk/widgets.md) · [composants DOM](https://docs.expo.dev/guides/dom-components.md) · [EAS Build](https://docs.expo.dev/build/setup.md) · [tarifs](https://expo.dev/pricing) | SDK 57, consultées 2026-09-30 |
| [Resend — tarifs](https://resend.com/pricing) | Consultée 2026-09-30 |

### Sources secondaires et retours de développeurs

| Source | Date | Remarque |
|---|---|---|
| [Apple Developer Forums 728796](https://developer.apple.com/forums/thread/728796) | 2023-04 à 2025-02 | Push PWA instables, sans réponse d'Apple |
| [Apple Developer Forums 786360](https://developer.apple.com/forums/thread/786360) | 2025-06 | Expiration des jetons, sans réponse |
| [Apple Developer Forums 770749](https://developer.apple.com/forums/thread/770749) | 2024-12 | Cause : Ne pas déranger |
| [Apple Developer Forums 733604](https://developer.apple.com/forums/thread/733604) | 2023-07 à 2024-11 | Navigation au clic |
| [Apple Developer Forums 811063](https://developer.apple.com/forums/thread/811063) | 2025-12 à 2026-01 | WebSocket local, iPadOS 26 |
| [Apple Developer Forums 762582](https://developer.apple.com/forums/thread/762582) | 2024-08 | Audio, écran verrouillé |
| [Apple Developer Forums 802239](https://developer.apple.com/forums/thread/802239) | 2025-09 | Concerne les push natives, pas le web |
| [PR conveniat #2039](https://github.com/cevi/conveniat-webpage/pull/2039) | 2026-09-29 | Compteur de push silencieux ; non testé sur iPhone |
| [PR rackem-leagues #255](https://github.com/jacked-apps/rackem-leagues/pull/255) | 2026-09-04 | Web Push depuis une Edge Function |
| [Issue osubb-app #703](https://github.com/Alex-Bancila/osubb-app/issues/703) | 2026-09-23 | Table d'envois, cron, fonction |
| [Discussion Frigate 22949](https://github.com/blakeblackshear/frigate/discussions/22949) | 2026-04 | Retard de 9 à 10 minutes |
| [Issue realtime-js #121](https://github.com/supabase/realtime-js/issues/121) | 2021-12-08 | Déconnexions en arrière-plan |
| [Issue browser-compat-data 29166](https://github.com/mdn/browser-compat-data/issues/29166) | 2026-03-03 | Vibration, non trié |
| [Issue home-music 327](https://github.com/felipe-urgal/home-music/issues/327) | 2026-09-06 | Audio en PWA |
| [Issue sadiss 134](https://github.com/fischnall3r/sadiss/issues/134) | 2026-09-20 | Audio en arrière-plan ; non testé |
| [Progressier sur dev.to](https://dev.to/progressier/how-to-fix-ios-push-subscriptions-being-terminated-after-3-notifications-39a7) | 2023-06-30 | Règle des trois push |
| [firt.dev — notes PWA iOS](https://firt.dev/notes/pwa-ios/) | 2023-06-06 | Ancien mais précis |
| [firt.dev — JS in the background](https://firt.dev/understanding-js-background/) | 2023-05-19 | — |
| [TechCrunch](https://techcrunch.com/2024/03/01/apple-reverses-decision-about-blocking-web-apps-on-iphones-in-the-eu/) | 2024-03-01 | Revirement d'Apple dans l'UE |
| [Open Web Advocacy — bilan 2025](https://open-web-advocacy.org/blog/owa-2025-review/) | 2026-01-05 | — |
| [Open Web Advocacy — DMA](https://open-web-advocacy.org/blog/the-digital-markets-act-is-delivering-real-wins-but-not-yet-for-browser-engines/) | 2026-05-15 | — |
| [MacRumors](https://www.macrumors.com/how-to/save-safari-bookmark-web-app-iphone-home-screen/) | 2025-08-20 | Parcours d'installation iOS 26 |
| [OneSignal — iOS web push](https://documentation.onesignal.com/docs/en/web-push-for-ios) | Consulté 2026-09-30 | Reconnaît une fiabilité inégale |
| [webscraft](https://webscraft.org/blog/pwa-pushspovischennya-na-ios-u-2026-scho-realno-pratsyuye?lang=en) | 2026-03-12, maj 2026-09-10 | Chiffres non sourcés |
| [Edana](https://edana.ch/en/2026/03/19/push-notifications-on-web-applications-pwa-is-it-really-reliable-on-ios-and-android/) | 2026-03-19 | Étude de cas d'agence |
| [OJapp](https://tips.ojapp.app/en/pwa-ios-2026-complete-guide/) | 2026-06-13 | Tests de l'auteur, sans sources |
| [brainhub](https://brainhub.eu/library/pwa-on-ios) | 2025-06-05 | Général |
| [shinyaz](https://shinyaz.com/en/blog/2026/02/24/serwist-turbopack-migration) | 2026-02-24 | Migration Serwist |
| [MagicBell](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide) | 2026-03-20 | **Contient des affirmations contredites par les sources primaires** (UE, plafond de 50 Mo) |
| [Superblocks](https://www.superblocks.com/blog/lovable-vulnerabilities) | 2025 | CVE-2025-48757 |
