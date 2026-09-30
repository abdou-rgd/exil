# Campagne de mesure des notifications

*Protocole de l'étape 0. Règle de décision : spécification, section 8. App : https://exil-theta.vercel.app, iPhone 16e sous iOS 27.0.*

## Principe

Chaque série programme 10 alertes, séparées par 3 à 25 minutes, soit environ deux heures et demie en tout. Tu choisis la situation avant de lancer la série, tu mets le téléphone dans cette situation, et tu n'y touches plus. Le tableau se remplit tout seul.

Pour que les mesures soient indépendantes, fais **une série par jour au plus**, à des heures variées.

## Programme

| Jour | Série | Préparation du téléphone |
|---|---|---|
| 1 | verrouillé | Écran verrouillé, posé, Wi-Fi et réseau mobile actifs |
| 2 | Concentration, app autorisée | Réglages › Concentration › choisir un mode › Apps › ajouter L'Exil, puis activer ce mode |
| 3 | économie d'énergie | Centre de contrôle › mode économie d'énergie |
| 4 | Wi-Fi seul | Données cellulaires coupées |
| 5 | réseau mobile seul | Wi-Fi coupé |
| 6 | Concentration, app non autorisée | Mode Concentration sans L'Exil ; après la série, compte les alertes visibles dans le centre de notifications |
| 7 | déclaratif | Situation « verrouillé », format « déclaratif » |
| 8 | app ouverte à l'écran | L'Exil ouverte, écran allumé |
| Une fois | série longue | À lancer dès le jour 1. Ouvre l'app ou le tableau de bord Supabase au moins une fois par semaine, sinon le projet gratuit se met en pause |
| Une fois | autre : redémarrage | Lance une série, puis redémarre le téléphone après la première alerte |
| Une fois | hors ligne (test rapide) | Lance un test rapide, passe aussitôt en mode avion, et coupe-le **environ 1 min 30 plus tard**, soit 30 s après l'heure prévue. Apple ne garde une alerte que 2 minutes : au-delà, elle expire et c'est attendu. L'alerte apparaît sous « test rapide » ; note l'heure de l'essai |

Ensuite, relance les situations normales jusqu'à atteindre 100 alertes comptées dans la règle. Les amis prolongeront la mesure quand ils installeront le prototype jouable.

## Lire le tableau

- **Reçues** : le téléphone a accusé réception. En mode Concentration, reçue ne veut pas dire affichée.
- **≤ 30 s** : part des alertes terminées reçues en moins de 30 secondes.
- **Échecs** : alertes perdues, échouées, ou reçues avec plus de 30 s de retard.
- **Règle** : ne compte que les séries classiques en situations normales. Au plus 2 échecs sur au moins 100 alertes : on reste en web app. 8 échecs ou plus : on envisage l'app native, et cela peut s'afficher avant 100 alertes, puisque le compte d'échecs ne peut plus redescendre. Entre les deux : on prolonge.
- **Série déclarative** : elle a sa propre ligne, « … (déclaratif) », et n'entre pas dans la règle.
- **Vue** : tu as touché la notification. Cette information est utile, mais elle ne compte pas dans la règle.

## Ce qu'on sait déjà (30 septembre 2026)

- **Premier test rapide** : reçu en 8,7 s, dont 6,0 s d'attente du prochain réveil de la tâche planifiée, 0,5 s de transmission à la fonction d'envoi, 0,6 s de réponse d'Apple et 1,6 s de livraison jusqu'au téléphone. L'accusé part bien du téléphone verrouillé.
- **Format déclaratif** : conforme au billet WebKit (`web_push: 8030`, bloc `notification` avec `title` et `navigate`). La place de `mutable` au premier niveau vient de l'explicatif et de la WWDC ; le billet n'en parle pas. La série « déclaratif » dira si iOS réveille bien le service worker.

## Exporter les données pour R

Tableau de bord Supabase › Table Editor › `alertes` › Export › CSV. Ou, depuis le projet :

    npm run sql -- "select a.*, s.situation, s.format, s.type from public.alertes a join public.series s on s.id = a.serie_id order by a.prevue_a"

Pour décomposer le retard étape par étape :

    npm run sql -- "select s.situation, extract(epoch from a.prise_a - a.prevue_a) as attente_cron, extract(epoch from a.recue_ef_a - a.prise_a) as transmission, extract(epoch from a.reponse_apple_a - a.recue_ef_a) as reponse_apple, extract(epoch from (a.accuse_appareil_a + make_interval(secs => a.decalage_ms / 1000.0)) - a.reponse_apple_a) as livraison from public.alertes a join public.series s on s.id = a.serie_id where a.accuse_appareil_a is not null order by a.prevue_a"

## À la fin de la campagne

Change le secret partagé, qui a transité par la file de pg_net. Fais-le quand aucune série n'est en cours : entre les étapes 2 et 3, les envois seraient refusés.

1. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` affiche un nouveau secret ;
2. `npx supabase secrets set ENVOI_SECRET=<nouveau secret>` ;
3. `npm run sql -- "select vault.update_secret((select id from vault.secrets where name = 'envoi_secret'), '<nouveau secret>')"`.

Pour tout arrêter d'un coup : `npm run sql -- "update prive.config set envoi_actif = false"`.
