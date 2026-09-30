# Étape 0 : prototype de la chaîne de notification

*Spécification validée par étapes avec Abdallah le 30 septembre 2026. Elle s'appuie sur `docs/passation.md`, `docs/avis-projet.md`, le rapport R5 (`docs/research/05-faisabilite-technique-pwa-ios.md`) et la réponse du conseiller (`docs/conseiller/2026-09-30-architecture-notifications-reponse.md`).*

## 1. Décisions prises dans cette session

### Décisions ouvertes de la passation, désormais tranchées

| Décision | Choix |
|---|---|
| Poids du temps dans l'XP | **Variante B** (engagements d'abord). Les niveaux et la remise à 1 par semestre restent à confirmer avec le conseiller avant l'étape 1. |
| Nom public de l'app | Plus tard. **Nom provisoire : « L'Exil »**, sous l'icône et dans le dépôt. « Lexile » ne doit jamais apparaître à l'écran. |
| Bâtiments du château | **Principe seul** : 5 à 7 bâtiments, 3 états (ruine, chantier, restauré), chacun débloque une fonction. La liste se décide au début de la partie sociale. |
| Durées du minuteur | **Choix à la première séance** entre 25/5, 50/10 et pauses libres, modifiable ensuite. |

### Décisions propres à l'étape 0

- Mesure d'abord sur l'iPhone d'Abdallah. Les amis installent l'app quand le prototype jouable est prêt, et leurs appareils prolongent alors la mesure.
- **Étape 0 courte** : 2 à 3 jours de développement. La campagne de mesure tourne ensuite en fond pendant la construction du jeu. Cela modifie l'ordre de la passation, qui prévoyait de finir la mesure avant de coder le jeu.
- Mesure par **séries automatiques**.
- Identification par **connexion anonyme Supabase**.
- Règle de décision en **trois zones** (section 8).

### Nouvelles indications d'Abdallah pour la suite

- **Objectif prioritaire : un prototype jouable et social pour les amis**, pas seulement un outil solo. Le découpage des étapes 1 et 2 sera revu dans ce sens lors de leur spécification.
- **Chat en jeu : décision ouverte.** Abdallah veut voir qui est en ligne, lui parler et lui envoyer une demande de séance commune, pour ne plus passer par Instagram ou Snapchat. Ce souhait va contre la décision « aucun texte libre partagé » (passation, décision 1 ; avis, changement 6). Voie intermédiaire proposée : présence, demande de séance en un geste, chat de groupe fermé pendant le minuteur. À trancher lors de la spécification de la partie sociale, en tenant compte du RGPD (messages privés stockés sur le serveur).

## 2. Objectif

Mesurer si une web app installée sur iPhone reçoit ses alertes de fin de minuteur à l'heure, téléphone verrouillé, et si l'abonnement aux notifications survit 14 jours sans ouvrir l'app. C'est la seule brique technique du produit dont la fiabilité n'est pas établie (R5, risque 1).

Les notifications de fin de minuteur sont le seul moyen de prévenir l'étudiant que la séance ou la pause est finie sans qu'il reprenne son téléphone. La même chaîne servira plus tard aux demandes de séance commune.

## 3. Périmètre

**Dans le périmètre** : page installable, abonnement aux notifications, programmation d'alertes par séries, envoi par le serveur, accusés de réception, tableau des résultats, test d'attaque minimal.

**Hors périmètre** : minuteur, comptes avec e-mail, jeu, direction artistique, fonctionnement hors ligne au-delà de la file des accusés.

**Réutilisé à l'étape 1** : le client Supabase, l'abonnement aux notifications, la table des alertes, la tâche planifiée et la fonction d'envoi.

## 4. Ce que voit l'utilisateur

Un seul écran, sobre, intitulé « L'Exil ».

1. **Ouverte dans Safari** (non installée) : uniquement les instructions d'installation, « … › Partager › Sur l'écran d'accueil ». Le mode installé se détecte par `display-mode: standalone`.
2. **Installée** : un bloc d'état indique la permission de notification, l'abonnement enregistré sur le serveur, la version d'iOS, et le décalage entre l'horloge du téléphone et celle du serveur. Le bouton « Activer les notifications » n'apparaît que si nécessaire, et la demande suit toujours un toucher.
3. **Boutons de test**
   - **Test rapide** : 1 alerte dans 60 secondes.
   - **Série** : l'utilisateur choisit d'abord une situation (liste ci-dessous) et un format (classique par défaut, déclaratif en comparaison). La base programme alors 10 alertes, séparées par des intervalles tirés uniformément entre 3 et 25 minutes.
   - **Série longue** : 1 alerte à J+7 et 1 à J+14.
   - **Annuler la série en cours** : annule les alertes encore « prévues » et indique combien étaient déjà trop avancées pour l'être.
4. **Tableau des résultats**
   - Par situation : alertes prévues, reçues, part reçue en moins de 30 s, retard médian, retard maximal, échecs.
   - En tête : le compteur de la règle de décision (échecs sur le nombre d'alertes en situations normales).
   - En dessous : la liste détaillée de chaque alerte.

**Situations** : verrouillé ; Concentration, app autorisée ; Concentration, app non autorisée ; économie d'énergie ; Wi-Fi seul ; réseau mobile seul ; app ouverte à l'écran ; autre (texte court, pour les cas imprévus comme un redémarrage).

L'app mesure la **réception** par le téléphone, pas l'**affichage**. En mode Concentration, Abdallah vérifie l'affichage lui-même dans le centre de notifications.

## 5. Architecture

Pile de la passation : Vite, React, TypeScript, vite-plugin-pwa en stratégie `injectManifest`, ce qui permet d'écrire soi-même le service worker ; hébergement statique sur Vercel Hobby ; Supabase gratuit, région Paris. Nouvelles clés Supabase (`sb_publishable_…`, `sb_secret_…`) dès le départ.

### Trajet d'une alerte

1. **Programmation.** L'app appelle une fonction de la base. Celle-ci calcule les heures avec `now()`, crée la série et ses alertes à l'état `prevue`, et crée pour chaque alerte un jeton aléatoire de 128 bits. Le client ne fournit jamais d'heure.
2. **Distribution**, par pg_cron toutes les 10 secondes, dans la fonction privée `distribuer()` :
   - elle ne fait rien si l'interrupteur `envoi_actif` est éteint ;
   - **reprise** : les alertes `en_cours` depuis plus de 60 s repassent dans le lot si `tentatives < 3`, sinon elles passent à `echouee` ;
   - **péremption** : une alerte `prevue` en retard de plus de 10 minutes, par exemple après une panne ou une mise en pause du projet, passe à `echouee` au lieu d'être envoyée à contretemps ;
   - **sélection** : les alertes `prevue` dont l'heure est passée (au plus 50, `FOR UPDATE SKIP LOCKED`) passent à `en_cours`, avec `prise_a = now()` et `tentatives + 1` ;
   - **appel**, seulement si le lot n'est pas vide : `net.http_post` vers l'Edge Function avec la liste des identifiants, le secret partagé en en-tête et un délai de 15 000 ms.
3. **Envoi**, par l'Edge Function `envoyer`, déployée avec `--no-verify-jwt` :
   - elle compare le secret partagé en temps constant, répond `202` tout de suite et poursuit le travail avec `EdgeRuntime.waitUntil` ;
   - pour chaque alerte, elle note `recue_ef_a`, relit la ligne et ne continue que si l'état est encore `en_cours` ; c'est la revérification contre l'annulation ;
   - elle chiffre et signe (VAPID, paquet `web-push`), puis envoie avec un TTL de 120 s, l'urgence `high` et un `Topic` égal à l'identifiant de la série sans tirets (32 caractères) ;
   - **juste après chaque réponse**, elle écrit `reponse_apple_a`, le code HTTP et l'`apns-id`. En cas de 201, l'alerte passe à `envoyee`. En cas de 404 ou 410, l'abonnement est supprimé et l'alerte passe à `echouee`. Pour toute autre erreur, l'alerte reste `en_cours` et sera reprise.
   - L'état n'est jamais déduit de la réponse de pg_net : seule l'Edge Function l'écrit.
4. **Réception**, par le service worker, dans son gestionnaire `push` :
   - dans `event.waitUntil(Promise.all([...]))`, il appelle `showNotification`, avec `tag` égal à l'identifiant de l'alerte pour qu'un doublon remplace l'affichage au lieu de s'ajouter ;
   - en parallèle, il envoie par `fetch` l'accusé à la fonction `accuser_reception` : identifiant, jeton, heure brute de l'appareil et dernier décalage connu, que la page a rangé dans IndexedDB. Ce `fetch` est entouré d'un `try/catch` ;
   - si l'envoi échoue, l'accusé part dans une file IndexedDB, vidée à la prochaine ouverture de l'app.
5. **Toucher sur la notification.** L'URL d'ouverture contient l'identifiant et le jeton. Au chargement, l'app appelle `marquer_vue`, ce qui donne un second accusé.

### Annulation

`UPDATE … SET etat = 'annulee' WHERE serie_id = $1 AND etat = 'prevue'`. Une alerte déjà `en_cours` ou `envoyee` n'est plus annulable, et l'app affiche « trop tard » pour elle.

### États d'une alerte

`prevue` → `en_cours` → `envoyee`, avec deux sorties : `annulee` (depuis `prevue`) et `echouee` (après 3 tentatives, ou abonnement expiré). La réception n'est pas un état : c'est la présence d'un accusé. Une alerte `envoyee` sans accusé 10 minutes après son heure prévue compte comme **perdue**.

### Formats de notification

- **Classique**, pour les séries principales et le test rapide : charge chiffrée en JSON `{ titre, corps, alerte_id, jeton, url }`, affichée par le service worker. Fonctionne sur tous les iOS depuis 16.4.
- **Déclaratif modifiable**, pour la série de comparaison : `{ "web_push": 8030, "notification": { "title", "body", "navigate", … }, "mutable": true }`. `mutable: true` est indispensable, sinon iOS affiche la notification sans réveiller le service worker et aucun accusé ne part. Le détail des champs, et notamment l'endroit où placer l'identifiant et le jeton, est à vérifier sur l'explicatif WebKit au moment de coder la série de comparaison.

## 6. Données

Toutes les tables ont RLS activé. Les tables du schéma `public` ne sont lisibles que par leur propriétaire. Aucune table n'est modifiable directement par le client : toute écriture passe par des fonctions fines du schéma `public`, qui appellent des fonctions `SECURITY DEFINER` du schéma privé `prive`, avec un chemin de recherche vide et des droits d'exécution révoqués puis accordés explicitement.

**`public.series`** : `id`, `user_id`, `type` (`rapide`, `serie`, `longue`), `situation`, `format` (`classique`, `declaratif`), `creee_a`, `annulee_a`.

**`public.alertes`** : `id`, `serie_id`, `user_id`, `prevue_a`, `etat`, `tentatives`, `prise_a`, `recue_ef_a`, `reponse_apple_a`, `code_apple`, `apns_id`, `accuse_serveur_a`, `accuse_appareil_a`, `decalage_ms`, `vue_a`.

**`prive.abonnements`** : `id`, `user_id`, `plateforme` (`webpush` pour l'instant, `apns` plus tard), `endpoint`, `p256dh`, `auth`, `user_agent`, `cree_a`, `vu_a`. Le client n'y accède pas du tout. Il connaît son état par la fonction `etat_abonnement()`, qui ne renvoie aucune clé.

**`prive.jetons`** : `alerte_id`, `jeton`, `utilise_a`.

**`prive.config`** : `envoi_actif` (booléen), `plafond_global` (300).

**Fonctions exposées au client**

| Fonction | Rôle | Qui peut l'appeler |
|---|---|---|
| `enregistrer_abonnement(endpoint, p256dh, auth, user_agent)` | Crée ou remplace l'abonnement de l'appareil. Appelée à chaque ouverture, puisque iOS ne prévient pas d'un changement d'abonnement. | authentifié |
| `etat_abonnement()` | Indique si un abonnement existe et depuis quand. | authentifié |
| `programmer(type, situation, format)` | Crée une série et ses alertes, dans la limite de 30 alertes en attente par compte et de 300 au total. | authentifié |
| `annuler_serie(serie_id)` | Annule les alertes `prevue` et renvoie le nombre d'alertes annulées et trop tardives. | authentifié, propriétaire |
| `heure_serveur()` | Sert à estimer le décalage d'horloge : trois appels, on garde celui dont l'aller-retour est le plus court. | authentifié |
| `accuser_reception(alerte_id, jeton, heure_appareil, decalage_ms)` | Enregistre l'accusé. Le jeton ne sert qu'une fois. Renvoie `void` dans tous les cas, sans distinguer un jeton inconnu d'un jeton déjà utilisé. | rôle `anon`, sans session (le service worker n'a pas accès à celle de la page) |
| `marquer_vue(alerte_id, jeton)` | Enregistre le toucher sur la notification. Mêmes règles. | rôle `anon` |

**Tâches planifiées** : `distribuer()` toutes les 10 secondes, et une purge quotidienne de l'historique `cron.job_run_details` de plus de 7 jours.

## 7. Sécurité

- La clé secrète Supabase, la clé VAPID privée et le secret partagé ne figurent jamais dans le code ni dans git. La clé VAPID privée et le secret partagé sont dans les secrets de l'Edge Function ; le secret partagé est aussi dans le coffre (Vault) de Supabase, où `distribuer()` le lit. Abdallah les dépose lui-même avec les commandes fournies dans le plan. Le secret partagé est changé à la fin de la campagne, car il transite par la file de pg_net.
- Seule la clé publiable est dans l'app. La clé VAPID publique l'est aussi, ce qui est normal.
- Plafonds : 30 alertes en attente par compte, 300 au total, et l'interrupteur `envoi_actif` pour tout arrêter.
- `enregistrer_abonnement` n'accepte que les adresses des services de notification connus (`*.push.apple.com`, `fcm.googleapis.com`, `*.push.services.mozilla.com`). Sans cette limite, un attaquant pourrait faire envoyer par l'Edge Function des requêtes vers n'importe quelle adresse.
- Le **test d'attaque** est passé avant la mise en ligne (section 9).
- Le Security Advisor de Supabase est consulté avant chaque mise en ligne.

## 8. Campagne de mesure et règle de décision

**Déroulé.** Il commence sur l'iPhone d'Abdallah et se poursuit en fond pendant la construction du jeu. Les séries sont étalées sur des jours différents, parce que des alertes d'un même appareil prises le même jour ne sont pas indépendantes. Le programme prévu :
- une série par situation ;
- une série au format déclaratif ;
- la série longue ;
- un redémarrage du téléphone ;
- une échéance hors ligne suivie d'un retour du réseau.

Les amis prolongent la mesure quand ils installent le prototype jouable. Le conseiller relit ce test avant qu'il ait lieu.

**Retard** : heure de réception notée par le téléphone, corrigée du décalage d'horloge, moins l'heure prévue. Si le décalage est inconnu, on prend l'heure d'arrivée de l'accusé sur le serveur, ce qui donne une borne haute. L'heure du téléphone passe en premier parce qu'un accusé mis en file hors ligne n'arrive au serveur qu'à la prochaine ouverture de l'app.

**Échec** : alerte perdue, alerte échouée, ou reçue avec un retard de plus de 30 s.

**Alertes comptées dans la règle** : séries de 10 au format classique uniquement. Le test rapide, la série longue et la série déclarative sont suivis à part.

**Situations normales** : toutes, sauf « Concentration, app non autorisée » et « autre ».

**Règle en trois zones**, sur au moins 100 alertes en situations normales :

| Échecs | Décision |
|---|---|
| 2 ou moins | On reste en web app. |
| 8 ou plus | On envisage sérieusement l'app native (Capacitor, qui demande un Mac et 99 $ par an). |
| Entre 3 et 7 | On prolonge la mesure. |

La décision se nuance selon le type d'échec. Un abonnement mort serait réglé par une app native. Une alerte cachée par le mode Concentration ne le serait pas sans le droit *Time Sensitive*. La survie de l'abonnement se juge par appareil, avec la série longue.

**Mise en pause de Supabase** : le projet gratuit se met en pause après 7 jours de faible activité. Pendant la série longue, Abdallah ouvre l'app ou le tableau de bord Supabase au moins une fois par semaine.

## 9. Tests

Écrits avant le code, conformément aux règles d'Abdallah.

- **Logique pure (Vitest)** : statistiques du tableau (médiane, part sous 30 s, alertes perdues, compteur de la règle en trois zones), calcul du décalage d'horloge, lecture et construction des charges de notification, file des accusés.
- **Base de données** : le tirage des intervalles (10 alertes, écarts entre 3 et 25 min), qui se fait dans la base ; `distribuer()` ne sélectionne jamais une alerte annulée ou déjà envoyée ; une alerte bloquée est reprise puis passe à `echouee` à la troisième tentative ; les plafonds de 30 et de 300 sont respectés ; un jeton ne sert qu'une fois. Ces tests tournent sur une base locale si Docker est disponible, sinon sur le projet Supabase de développement ; le plan tranche.
- **Test d'attaque**, avec la seule clé publiable et un compte anonyme. Doivent échouer : lire les alertes ou séries d'un autre compte, lire `prive.abonnements` ou `prive.jetons`, écrire directement dans une table, accuser réception avec un faux jeton ou un jeton déjà utilisé, dépasser les plafonds, appeler l'Edge Function sans le secret.
- **Relecture** par un agent `sonnet` après chaque bloc de code.

## 10. Livraison

Chaque étape se teste sur l'iPhone le jour même.

| Étape | Livré | Vérification sur l'iPhone |
|---|---|---|
| 0.a | App en ligne sur Vercel, instructions d'installation, permission, abonnement enregistré, décalage d'horloge | Installer, autoriser : le bloc d'état indique « abonnement enregistré » |
| 0.b | Test rapide de bout en bout : programmation, distribution, envoi, accusé, liste détaillée | Une alerte arrive environ 1 minute plus tard, écran verrouillé, et apparaît avec son retard |
| 0.c | Séries, situations, format déclaratif, série longue, annulation, tableau par situation, règle en trois zones, file des accusés hors ligne, test d'attaque passé | Lancer la première série ; annuler une série et vérifier qu'aucune alerte annulée n'arrive |

## 11. Ce qu'Abdallah fait lui-même

Ces actions touchent à ses comptes ou à ses secrets. Le plan les détaille pas à pas.

- Créer le projet Supabase (région Paris) et activer la connexion anonyme dans les réglages d'authentification.
- Créer le dépôt GitHub privé et le relier à un projet Vercel.
- Déposer les secrets (clé VAPID privée, secret partagé) avec les commandes fournies.
- Installer l'app sur son iPhone et mener la campagne.

## 12. Points à vérifier en premier

1. Le `fetch` de l'accusé part-il bien depuis le service worker, téléphone verrouillé, sous iOS 26 ? Non vérifié (réponse du conseiller, question 3). C'est l'objet du test de l'étape 0.b.
2. Le format déclaratif modifiable réveille-t-il le service worker ? Ce sera vérifié avec la série de comparaison.
3. Le toucher sur une notification ouvre-t-il l'URL exacte ? C'est signalé comme peu fiable (R5, ligne 1.14). Si ce n'est pas le cas, l'accusé « vue » manquera, ce qui n'empêche pas la mesure principale.
