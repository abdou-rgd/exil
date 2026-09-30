# Avis sur le projet

*Rédigé le 30 septembre 2026. Il s'appuie sur cinq recherches documentaires (`docs/research/`), deux simulations en R (`docs/simulations/`) et une planche de direction artistique. Les références entre parenthèses renvoient aux rapports, notés R1 à R5, où se trouvent les sources complètes.*

## Verdict

Le projet est cohérent, et sa philosophie est soutenue par la recherche sur presque tous les points. Aucune fonction prise seule n'est nouvelle. Ce qui est rare, c'est l'assemblage : un petit groupe d'amis, aucun classement, et une progression qui récompense la façon de travailler plutôt que le nombre d'heures. Les applications sociales existantes reposent sur la pression du regard ; les applications bienveillantes existantes sont solitaires (R4).

Trois risques dominent.

1. **Le périmètre.** Classes, talents, équipement, guildes, raids, statistiques et modèle : c'est trop pour une première version faite seul. Focumon et Habitica, les deux applications les plus proches, sont toutes deux jugées compliquées à la prise en main (R4).
2. **L'usure.** Chez les étudiants d'université, l'effet de la gamification est faible : deux méta-analyses sur trois le trouvent proche de zéro, et l'engagement creuse vers les semaines 4 à 6 (R1). Le jeu peut habiller de bonnes pratiques ; il ne créera pas la motivation à lui seul.
3. **L'alerte de fin de séance sur iPhone.** C'est la seule brique technique dont la fiabilité n'est pas établie (R5).

Ma recommandation : commencer petit avec cinq à dix camarades, mesurer pendant six à huit semaines, puis dévoiler la profondeur RPG par étapes.

## Fonctionnalité par fonctionnalité

| Fonctionnalité | Avis | Raison principale |
|---|---|---|
| Récompenser la régularité plutôt que le volume | Garder | Cohérent avec les limites de l'effort quotidien (Ericsson, 1993) et avec l'abandon plus fréquent de ceux qui se surchargent (données Duolingo) |
| Comparer chacun à lui-même | Garder | La comparaison vers le haut dégrade l'évaluation de soi (Gerber, 2018) ; les classements ont des effets négatifs documentés (Hanus et Fox, 2015). Coût à assumer : la compétition est souvent plus engageante (Patel, 2019) |
| Rendements décroissants dans la journée | Garder, présenter autrement | Aucune étude ne fixe de seuil d'heures. À présenter comme un bonus de fraîcheur sur les premières heures, jamais comme un malus. Prévoir un mode « période d'examens » choisi par l'étudiant, sinon l'app paraîtra punitive au moment où il travaille le plus |
| Minuteur pomodoro qui rapporte de l'XP | Ajuster | L'XP à la minute récompense la simple présence, la forme de récompense la plus risquée pour la motivation (Deci, 1999). La supériorité du 25/5 n'est pas établie : durées réglables |
| Séries avec jours de repos planifiés | Garder, compléter | La souplesse protège la série. Ajouter des jokers pour les imprévus : ils font mieux qu'un objectif simplement abaissé (Sharif et Shu, 2021) |
| Classes, équipement, talents | Garder, mais plus tard | Avatar et récit nourrissent le lien social. C'est aussi la partie la plus coûteuse en contenu |
| Guildes avec boss alimentés par l'effort cumulé | Ajuster | Effort mis en commun : risque de paresse sociale. Contribution mesurée en part de son propre objectif, boss qui ne blesse jamais, groupes privés de 3 à 6 |
| Séances de groupe, minuteur commun | Garder | Aide à s'y mettre et à venir. Ne pas promettre un meilleur apprentissage : aucun essai contrôlé ne le montre |
| Raids accessibles uniquement ensemble | Ajuster | Exclut les étudiants isolés. Ouvrir à toute séance commune, réserver au présentiel une récompense décorative |
| Récompense pour qui invite | Ajuster | Récompenser l'invité, ou les deux, fonctionne mieux (Gershon, 2020). Symbolique et plafonnée |
| Plus d'XP pour les méthodes efficaces | Garder, préciser | La base de preuves la plus solide du projet. Ce qui compte : rappel de mémoire, correction, espacement |
| Collecte minimale à chaque séance | Garder | Zéro geste pour ce que le minuteur sait déjà, deux ou trois pour le reste |
| Statistiques personnelles privées | Garder | Athenify vend cet écran 12,99 $ par mois |
| Recommandations ajustées par modèle à effets mixtes | Ajuster | Voir « Data science » : les valeurs de population font l'essentiel du travail |
| Prédire les jours à risque | Plus tard, avec prudence | L'activité récente prédit l'essentiel : commencer par une règle simple. C'est aussi du profilage au sens du RGPD, et les relances ont un effet faible qui s'éteint |
| PWA, Vercel, Supabase | Garder, avec réserves | Suffisant pour quelques centaines d'utilisateurs. Pièges : e-mails, mise en pause, clause non commerciale |
| Minuteur par horodatage | Garder | C'est la bonne approche, et elle est nécessaire |
| Notification de fin de séance | À prototyper en premier | Impossible hors ligne ; fiabilité sur iPhone non mesurée |

## Les six changements qui comptent le plus

**1. Faire peser les engagements tenus plus que les minutes.** Dans ma première formule (variante A), 56 % de l'XP d'une étudiante régulière vient des minutes elles-mêmes et 25 % des engagements tenus ; le reste vient des bonus de méthode et de régularité. Dans une variante B où le temps rapporte moins, les engagements passent à 53 % et les minutes à 35 %. L'étudiante qui travaille 8 heures par jour gagne alors 1,6 fois l'XP de celle qui en fait 3, au lieu de 1,95 fois. Formuler l'XP comme une information (« tu as tenu 4 de tes 5 jours ») plutôt que comme un contrat (« fais 2 heures pour gagner 200 XP »).

**2. Distinguer la fiche cours ouvert de la fiche de mémoire.** Tu avais déjà écrit « fiches faites de mémoire » : c'est la bonne intuition. Une fiche rédigée cours ouvert est un résumé, d'utilité faible (Dunlosky, 2013). Une fiche écrite cours fermé puis vérifiée est un exercice de rappel, au même rang que les QCM. La lecture de première passe reste un prérequis et ne doit pas être pénalisée. Multiplicateur défendable : entre 1,25 et 1,5, pas davantage (R2).

**3. Un boss qui ne blesse jamais.** Sa jauge ne fait que descendre. Un membre absent passe « en voyage » sans rien coûter aux autres. En fin de semaine le boss se retire, la progression est gardée. Faire payer au groupe l'absence d'un membre est le contre-modèle : dans l'étude de terrain sur Habitica, les 45 participants ont tous subi des effets contre-productifs (Diefenbach et Müssig, 2019).

**4. Des séries qui plient sans casser.** Compter les jours prévus tenus, et non les jours consécutifs. Deux jokers par semaine pour les imprévus. Une fenêtre de réparation après une rupture. Des compteurs impossibles à perdre à côté (« 23 jours tenus sur les 30 derniers »). Aucune notification de menace.

**5. Le jeu avant et après la séance, jamais pendant.** Préparer en 20 secondes, partir sans aucune interaction, revenir en une minute : récit en trois lignes, XP, une trouvaille. C'est la structure d'un jeu idle, et c'est ce qui empêche le jeu de voler le temps qu'il doit protéger (R3).

**6. Aucun espace public, aucun texte libre partagé.** Groupes sur invitation, encouragements pré-écrits. Habitica a supprimé ses guildes publiques en 2023 ; le créateur de Focumon cite la modération comme frein (R4).

## Ce que j'ajouterais

- **Un plan « si… alors… » à l'inscription** : « après mon cours de 14 h, je lance une séance à la BU ». C'est l'idée la mieux étayée et la moins coûteuse de toute la recherche (d = 0,65 sur l'atteinte des objectifs, Gollwitzer et Sheeran, 2006).
- **La question du lendemain.** Au début d'une séance sur une matière, l'app demande : « sans regarder, que retiens-tu de la dernière fois ? », puis l'étudiant vérifie et se note. C'est un exercice de rappel espacé, et c'est le seul critère de jugement commun à toutes les méthodes (R2). Je la mettrais au cœur du produit.
- **Un bonus d'espacement** : revenir sur une matière vue au moins un jour avant. L'app peut le vérifier sans déclaration, et il aligne la régularité sur ce qui fait apprendre.
- **Une veillée hebdomadaire** : objectif, réalisé, écart, intention pour la semaine suivante, jours de repos choisis.
- **Montrer qui travaille, jamais combien.**
- **Un mode pause** (stage, maladie, vacances) qui gèle tout sans rien faire perdre, et un mode sans chiffres pendant la séance.
- **Le semestre comme saison.** À la fin du semestre, la progression devient un souvenir permanent et un nouveau cycle commence.
- **Une page d'aide** vers les dispositifs de soutien étudiants, sans prétendre soigner. Dans l'enquête de 2024 auprès des étudiants en médecine, 52 % déclaraient des symptômes anxieux (R4).

## Ce que j'éviterais

- Classements, sanctions, perte d'équipement, notifications culpabilisantes.
- Mécaniques de hasard payantes, réparation de série payante.
- Demander « à quel point as-tu appris ? » à chaud. Les méthodes efficaces paraissent moins efficaces à celui qui les pratique (Kornell et Bjork, 2008 ; Deslauriers, 2019). Un modèle nourri de cette note apprendrait que relire vaut mieux que se tester.
- Collecter humeur, fatigue ou sommeil : croisées avec le reste, ces données peuvent devenir des données de santé (R2).
- **Le nom « Lexile »**, si c'est le nom prévu : c'est une marque déposée de MetaMetrics dans l'éducation, aux États-Unis et à l'étranger. Vérifié sur leurs documents de marque.
- Les illustrations, noms et logo de Grimgar dans l'app publiée. Le style et l'ambiance ne sont pas protégés ; les images et les noms le sont, et la gratuité du projet ne protège pas (R3).

## Par où commencer

| Étape | Contenu | Ce qu'on apprend |
|---|---|---|
| 0. Avant de coder | Interroger 8 à 10 camarades ; prototype de la chaîne de notification sur deux ou trois iPhone | Le problème existe-t-il dans ta promo ? L'alerte arrive-t-elle ? |
| 1. Le cœur, seul | Minuteur, journal en deux gestes, intention de la semaine et jours de repos, calendrier de régularité, XP et niveau simples, écran de retour | L'outil te sert-il à toi ? |
| 2. La tablée | Groupe privé de 3 à 6 sur invitation, séance commune par code, chantier de la semaine | Le groupe tient-il six semaines ? |
| 3. La profondeur RPG | Quatre classes, équipement, talents, dévoilés un par un | Le dévoilement comble-t-il le creux des semaines 4 à 6 ? |
| 4. La data science | Statistiques descriptives, puis suggestions tirées au sort, puis modèle | Voir ci-dessous |

Pour les entretiens, un guide de treize questions est prêt dans `docs/entretiens-camarades.md`. Ils comptent : la popularité de YPT chez les étudiants français en santé n'a pas pu être confirmée par des sources publiques. Les listes des tutorats citent Forest, Study Bunny et Anki, jamais YPT (R4).

## Data science : ce qui est réaliste

Deux simulations, dont les hypothèses sont en tête de chaque script.

**Formule d'XP** (`01-formule-xp.R`), XP sur 12 semaines rapportée à celle du profil régulier, moyenne et écart-type sur 200 tirages des profils :

| Profil | Heures | Temps seul | Variante A | Variante B |
|---|---|---|---|---|
| Marathonienne (8 h, 6 jours par semaine) | 547 | 3,22 | 1,95 ± 0,11 | 1,60 ± 0,11 |
| Régulière (3 h, 5 jours par semaine) | 170 | 1 | 1 | 1 |
| Bachoteur sur 4 semaines (5 h 30 par jour) | 171 | 1,00 | 0,76 ± 0,03 | 0,69 ± 0,04 |
| Week-end seulement (2 fois 7 h 30) | 171 | 1,01 | 0,71 ± 0,05 | 0,69 ± 0,06 |
| Irrégulier (3 h, un jour sur deux au hasard) | 126 | 0,74 | 0,65 ± 0,09 | 0,61 ± 0,09 |
| Petits pas (1 h, 6 jours par semaine) | 69 | 0,40 | 0,58 ± 0,03 | 0,73 ± 0,05 |
| Bachoteur sur 2 semaines (10 h 50 par jour) | 171 | 1,00 | 0,51 ± 0,02 | 0,44 ± 0,02 |

À heures égales, l'étudiante régulière gagne environ deux fois l'XP du bachoteur qui concentre tout sur deux semaines, et 1,3 à 1,45 fois celle du bachoteur qui étale le même travail sur quatre semaines. La variante B est celle où les engagements pèsent plus que le temps.

Les deux variantes ont la même structure et des poids différents :

| Paramètre | Variante A | Variante B |
|---|---|---|
| XP par minute, de 0 à 2 h dans la journée | 1,5 | 1,0 |
| XP par minute, de 2 à 5 h | 1,0 | 0,6 |
| XP par minute, de 5 à 8 h | 0,5 | 0,3 |
| XP par minute, au-delà de 8 h | 0,2 | 0,1 |
| Objectif du jour tenu (fixé à l'avance) | 100 | 250 |
| Semaine tenue, au prorata des jours prévus tenus | 300 | 600 |
| Méthodes actives | + 25 % | + 25 % |
| Régularité : moyenne glissante des jours prévus tenus, mémoire d'environ trois semaines | jusqu'à + 25 % | jusqu'à + 25 % |

Un jour de repos prévu ne touche pas au score de régularité, et un jour travaillé à moitié compte pour moitié. Le bonus d'espacement, les jokers et le bonus de groupe ne sont pas encore simulés.

**Modèle à effets mixtes** (`02-effets-mixtes-faisabilite.R`, 200 répliques par scénario, note de séance sur 5, effet typique de 0,15 point) :

| Séances par personne | Shrinkage, hétérogénéité faible | Conseil individualisé juste, hétérogénéité faible | Shrinkage, hétérogénéité forte | Conseil individualisé juste, hétérogénéité forte |
|---|---|---|---|---|
| 20 | 66 à 69 % | 77 à 84 % | 30 à 39 % | 76 à 78 % |
| 50 | 47 à 56 % | 81 à 84 % | 16 à 21 % | 83 à 84 % |
| 100 | 32 à 41 % | 85 à 86 % | 9 à 12 % | 87 à 88 % |
| 200 | 21 à 30 % | 88 % | 5 à 6 % | 90 à 92 % |

Les fourchettes couvrent 10, 30 et 100 utilisateurs. Hétérogénéité faible : écart-type inter-individuel de l'effet de 0,15 point ; forte : 0,35 point. « Juste » veut dire que le conseil va dans le sens de l'effet réel de la personne. Point de comparaison : à partir de 30 utilisateurs, donner le même conseil à tout le monde est juste pour environ 84 % des personnes en hétérogénéité faible et 67 % en hétérogénéité forte, quel que soit le nombre de séances.

Trois leçons.

1. **C'est le nombre de séances par personne qui fait la précision individuelle**, pas le nombre d'utilisateurs. Le nombre d'utilisateurs sert aux paramètres de population : avec 10 personnes, l'erreur relative sur la variabilité inter-individuelle dépasse 40 % en hétérogénéité faible.
2. **Personnaliser ne rapporte que si les gens diffèrent beaucoup.** En hétérogénéité faible, individualiser n'apporte presque rien, même avec 200 séances (moins de 0,01 point sur 5), et avec 20 séances le conseil commun fait aussi bien ou mieux. En hétérogénéité forte, le conseil individualisé gagne au mieux 0,07 point. La littérature va dans le même sens : dans HeartSteps, environ 200 observations par personne n'ont pas suffi à détecter une hétérogénéité d'effet (Qian, 2020) ; l'optimiseur d'Anki, avec des dizaines de milliers de révisions par utilisateur, ne gagne que peu sur les paramètres de population (R2).
3. **Le vrai danger est la confusion, pas la taille d'échantillon.** Quand la forme du jour influence à la fois le choix et la note, l'estimation naïve donne 0,45 pour un effet réel de 0,15, avec un écart-type de 0,03 : fausse et sûre d'elle. Tirer au sort les suggestions ramène l'estimation à 0,17 en moyenne, au prix d'une forte imprécision (écart-type 0,11 avec 3 000 séances). Son erreur totale reste près de trois fois plus faible que celle de l'estimation naïve. C'est le même problème qu'une relation exposition-réponse confondue par la sévérité de la maladie.

Ce que j'en tire :

- **Méthodes : s'en tenir à la littérature.** L'effet du test et de l'espacement est très solide ; rien n'indique qu'il s'inverse chez certains.
- **Personnaliser le quand plutôt que le quoi** : horaires, durée des séances, rythme des pauses. Une différence entre personnes y est plausible (chronotype), mais les effets mesurés sont petits : le profil horaire doit rester descriptif.
- **Tenir un journal de tirage dès la première version** : quelle suggestion a été tirée, avec quelle probabilité. Sans lui, aucune conclusion causale ne sera possible plus tard.
- **Règle d'affichage** : pas de message individualisé tant que le shrinkage dépasse 30 %. C'est une condition nécessaire, pas suffisante : à 200 séances en hétérogénéité faible, le shrinkage passe sous 30 % et individualiser n'apporte pourtant presque rien. Exiger aussi que l'effet de la personne s'écarte nettement de l'effet typique.
- **Avec dix utilisateurs, ne rien conclure.** Valider la mesure, c'est tout.

## Direction artistique

La planche propose trois directions pour le même écran : [Planche DA](https://claude.ai/artifact/Rhkd2EGrizMQgSnSJ1fQ9g). Les aperçus sont aussi dans `docs/direction-artistique/`.

| Direction | Ce qu'elle apporte | Ce qu'elle coûte |
|---|---|---|
| A · Veillée | Calme, lisible la nuit ; la lune rouge sert de jauge de séance | Peu de contenu à produire : tout est procédural |
| B · Carnet de route | Le papier respire ; idéale pour le journal et les statistiques | Moins « jeu » |
| C · Pixel et aquarelle | La plus proche d'un JRPG | Chaque pièce d'équipement à dessiner pour chaque classe ; police à pixels moins lisible pour les chiffres |

Ma recommandation : A et B comme les deux faces d'un même système, B le jour et A le soir, avec de petits sprites en pixels pour les personnages autour du feu. L'équipement se montre d'abord en icônes dans l'inventaire, pas sur le sprite. Les quatre sprites de la planche sont des dessins originaux ; ceux que tu as téléchargés représentent des personnages protégés.

Les fonds de la planche sont générés par des filtres SVG. Leur coût sur iPhone n'a pas été testé ; on peut aussi les exporter en images fixes.

Le rapport R3 propose une piste sans budget : peindre soi-même des lavis abstraits sur papier, les scanner, et limiter les personnages à de petites silhouettes.

## Technique

- **Premier prototype** : la chaîne de notification seule. Critère proposé : 95 % des alertes affichées en moins de 30 secondes, et un abonnement encore valide après 14 jours sans ouvrir l'app.
- **À régler avant le premier test avec un camarade** : l'e-mail intégré de Supabase n'envoie qu'aux membres de l'équipe du projet. Il faut un service d'envoi tiers et un nom de domaine.
- **Mise en pause** : le projet Supabase gratuit s'arrête après 7 jours de faible activité, ce qui arrivera l'été.
- **Clause non commerciale** de l'offre gratuite de Vercel : les dons sont admis, la vente ne l'est pas.
- **Connexion par code à saisir** plutôt que par lien : un lien reçu par e-mail s'ouvre dans Safari, pas dans l'app installée.
- **Sortie native possible** avec Capacitor, qui garde presque tout le code. Il faut un Mac pour construire l'app, et 99 $ par an.
- **RGPD** : dès que les données sont sur un serveur, tu es responsable de traitement. Région Paris ou Francfort, âge minimal de 18 ans pour simplifier, consentement séparé pour l'usage des données dans un modèle.

## Ce qui reste incertain

- La fiabilité réelle des notifications web sur iPhone : aucun test sur appareil n'a été fait.
- L'usage de YPT dans ta promo : à demander directement.
- Aucune étude ne porte sur les séries appliquées aux révisions, ni sur un nombre d'heures optimal, ni sur la fausse déclaration de méthode dans une app de ce type.
- Les recherches ont épuisé leur quota en cours de route : une partie des articles n'est connue que par son résumé. Chaque rapport liste ce qui n'a pas pu être vérifié.
- J'ai recoupé cinq points sur le web, tous confirmés : [l'étude de Smits sur le pomodoro](https://cris.maastrichtuniversity.nl/en/publications/investigating-the-effectiveness-of-self-regulated-pomodoro-and-fl/), [la méta-analyse de Kanadli](https://bera-journals.onlinelibrary.wiley.com/doi/10.1002/rev3.70223), [l'étude de Sharif et Shu](https://ideas.repec.org/a/eee/jobhdp/v163y2021icp17-29.html), [les fonctions de Focumon](https://www.focumon.com/landing) et [la marque Lexile](https://www.metametrics.com/branding-guidelines/).
- Les chiffres des simulations dépendent d'hypothèses que j'ai choisies. Les deux scripts ont été relus par un agent indépendant : aucun bug, résultats reproduits à l'identique. Ses trois réserves sont intégrées : un bachoteur moins extrême a été ajouté, les profils sont tirés 200 fois au lieu d'une, et chaque réplique a sa propre graine.

## Décisions à prendre

1. **Le premier public** : ta promo de M2 seulement, ou plus large dès le départ ?
2. **Le poids du temps dans l'XP** : variante A ou B ?
3. **La direction artistique** : A et B ensemble, ou C ?
4. **Le nom.**
5. **Ton temps disponible et ton expérience du développement web** : ils fixent la taille de l'étape 1.

## Où trouver le détail

| Fichier | Contenu |
|---|---|
| `docs/research/01-sciences-du-comportement.md` | R1 : gamification, récompenses, séries, habitudes, mécaniques sociales |
| `docs/research/02-apprentissage-et-data-science.md` | R2 : méthodes de révision, auto-évaluation, personnalisation, RGPD, schéma de données |
| `docs/research/03-game-design-idle-cozy-rpg.md` | R3 : boucles de jeu, classes, économie d'XP, Grimgar, droits |
| `docs/research/04-panorama-applis-productivite.md` | R4 : 22 applications comparées, positionnement, coûts |
| `docs/research/05-faisabilite-technique-pwa-ios.md` | R5 : capacités iOS, notifications, quotas, architecture |
| `docs/entretiens-camarades.md` | Guide d'entretien pour l'étape 0 |
| `docs/simulations/` | Scripts R, figures et tableaux |
| `docs/direction-artistique/` | Aperçus de la planche, palettes, sprites |
