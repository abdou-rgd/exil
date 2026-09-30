# Question au conseiller : architecture des notifications (étape 0)

*Préparée le 30 septembre 2026. À copier en entier dans la conversation avec le conseiller, qui ne voit pas la session de développement.*

---

## Contexte

Je construis, avec Claude Code, une web app installable (PWA) pour six amis étudiants, tous sur iPhone ou iPad. Elle transforme le temps de révision en progression de jeu de rôle, sans classement. Je suis étudiant en M2 de pharmacométrie et je ne connais pas JavaScript : Claude écrit le code.

Pile décidée : Vite, React, TypeScript, vite-plugin-pwa, hébergement statique sur Vercel Hobby ; Supabase gratuit en région Paris (Postgres, Auth, Edge Functions, pg_cron, pg_net).

L'alerte de fin de séance, téléphone verrouillé, est la seule brique dont la fiabilité n'est pas établie. Sur iOS, elle ne peut venir que d'une Web Push envoyée par un serveur : pas de notification locale planifiée en web, JavaScript gelé en arrière-plan, pas de `pushsubscriptionchange`, pas de push silencieuse (la permission est révoquée si une push n'affiche rien). Avant tout le reste, on construit donc un prototype qui mesure cette chaîne.

## Conception retenue pour le prototype

**Côté iPhone.** Un seul écran. Dans Safari : instructions d'installation seulement. Installée : état (permission, abonnement enregistré, version d'iOS, décalage d'horloge avec le serveur), bouton d'activation des notifications (geste requis), puis quatre boutons :
- test rapide : une alerte dans 1 minute ;
- série : l'utilisateur choisit une situation (verrouillé, Concentration autorisée ou non, économie d'énergie, Wi-Fi seul, réseau mobile seul, app au premier plan), puis 10 alertes sont programmées à intervalles tirés au hasard entre 3 et 25 minutes ;
- série longue : une alerte à J+7 et une à J+14, pour vérifier que l'abonnement survit sans ouvrir l'app ;
- annuler la série en cours.

Un tableau montre, par situation : alertes prévues, reçues, part reçue en moins de 30 s, retard médian et maximal.

**Identité.** Connexion anonyme Supabase à la première ouverture. RLS sur toutes les tables : le client lit ses propres lignes et n'écrit jamais directement. Toute écriture passe par des fonctions Postgres. Plafond de 30 alertes en attente par compte.

**Trajet d'une alerte.**
1. Une fonction Postgres calcule les heures d'envoi avec l'horloge de la base et insère les lignes `alertes` (état « prévue »). Le client ne fournit aucune heure.
2. pg_cron toutes les 10 s : sélection des alertes dues (`FOR UPDATE SKIP LOCKED`), passage à « en cours d'envoi », puis, seulement s'il y en a, appel de l'Edge Function par pg_net avec le lot d'identifiants et un secret partagé.
3. L'Edge Function revérifie que chaque alerte n'a pas été annulée, chiffre et signe (VAPID, bibliothèque `web-push` sous Deno), puis envoie au service push d'Apple avec un TTL de 120 s, l'urgence `high` et un `Topic` par série. Sur réponse 404 ou 410, l'abonnement est supprimé.
4. Charge utile au format Declarative Web Push (`web_push: 8030`, iOS 18.4 et plus), contenant aussi l'identifiant de l'alerte et un jeton de réception aléatoire. Le service worker a un gestionnaire `push` qui affiche la notification (pour les iOS plus anciens) et envoie par `fetch` un accusé de réception à une fonction Postgres, authentifié par ce jeton, parce que le service worker n'a pas accès à la session Supabase. Sans réseau, l'accusé est mis dans IndexedDB et envoyé à la prochaine ouverture.

**Mesure.** Retard = heure serveur de réception de l'accusé − heure prévue. C'est une borne haute. On mesure la réception, pas l'affichage : en mode Concentration, l'utilisateur vérifie l'affichage lui-même.

**Campagne.** Un seul iPhone pour l'instant. Cinq séries de 10 alertes (verrouillé, Concentration autorisée, Concentration non autorisée, économie d'énergie, réseau mobile seul), la série longue, un redémarrage en cours de route.

**Critère de réussite.** Au moins 95 % des alertes reçues en moins de 30 s dans les situations normales, et l'abonnement encore valide après 14 jours. En dessous, on reconsidère une enveloppe native (Capacitor, qui exige un Mac et 99 $ par an).

## Mes questions

1. **Architecture.** Voyez-vous une faille dans ce trajet : course entre annulation et envoi, double envoi, alerte bloquée à « en cours d'envoi » si l'Edge Function échoue, latence de pg_cron plus pg_net plus démarrage de la fonction ? Faut-il un délai de reprise pour les alertes bloquées ?
2. **Declarative Web Push et service worker.** Si un service worker avec gestionnaire `push` est enregistré, iOS lui transmet-il un message déclaratif ? Risque-t-on une double notification si le gestionnaire appelle `showNotification`, ou une révocation si l'accusé part mais que rien ne s'affiche ? Faut-il plutôt envoyer une charge utile classique pour ce prototype ?
3. **Accusé depuis le service worker.** Un `fetch` lancé dans le gestionnaire `push` (dans `event.waitUntil`) aboutit-il de façon fiable, téléphone verrouillé ? Sinon, quelle autre mesure proposez-vous ?
4. **Validité statistique du critère.** Avec 50 alertes sur un seul appareil, observer 48 réussites sur 50 donne un intervalle de confiance à 95 % d'environ 86 à 99 %. Le critère « 95 % en moins de 30 s » est-il tenable avec cet effectif ? Faut-il plutôt fixer un seuil sur la borne basse, augmenter le nombre d'essais, ou raisonner autrement ?
5. **Sécurité.** Connexion anonyme, plafond de 30 alertes, jeton de réception par alerte, secret partagé entre pg_cron et l'Edge Function stocké dans le coffre de Supabase : est-ce suffisant pour un prototype en ligne à une adresse publique ?
6. **Angles morts.** Qu'est-ce qui manque à la campagne pour décider, à la fin, entre rester en PWA et passer en natif ?
