# 03 — Game design : idle, cozy, progression RPG et coopération

> Rapport de recherche pour le projet d'application de révision gamifiée (PWA iPhone, développeur solo, sans budget).
> Rédigé le 30 septembre 2026. Recherche web réelle ; chaque affirmation renvoie à une source listée en fin de document par une clé entre crochets, par exemple `[COOK-COZY]`.

---

## 0. À lire d'abord

### 0.1 Résumé en dix lignes

1. Le « carburant » étant le temps d'étude, **le jeu doit se jouer avant et après l'effort, jamais pendant** : c'est exactement la structure d'un jeu idle (on part, on revient, on récolte).
2. Le temps humain est borné : **aucune croissance exponentielle** n'est possible. Il faut des courbes polynomiales, du dévoilement progressif et de la progression horizontale.
3. **Les plafonds doivent être présentés comme des bonus de repos**, pas comme des malus (histoire de l'XP reposée de World of Warcraft).
4. **Les séries (streaks) souples retiennent mieux que les séries rigides** (données publiées par Duolingo), ce qui valide les jours de repos planifiés.
5. **Punir produit des effets contre-productifs** documentés sur Habitica ; faire payer au groupe l'échec d'un membre (Habitica, Forest) est le contre-modèle à éviter.
6. Le cozy repose sur **sécurité, abondance, douceur** ; le danger peut exister dans la fiction à condition de rester « derrière la vitre ».
7. Des **boss qui ne peuvent pas blesser**, des jauges qui n'avancent que vers l'avant et des récompenses partielles existent déjà (Pikmin Bloom, Monster Hunter Now).
8. **Les espaces sociaux publics coûtent cher en modération** (Habitica a fermé guildes et taverne en 2023) : petits groupes privés, interactions fermées.
9. Pour le présentiel, **la carotte marche mieux que le bâton** (Niantic) et le QR code est le mécanisme standard.
10. Pour la direction artistique, **le style et l'ambiance ne sont pas protégés, les illustrations, noms et logos le sont** ; une aquarelle originale est atteignable sans budget (lavis scannés, textures CC0, filtres SVG).

### 0.2 Méthode, conventions et limites

- **Environ 110 pages ont été consultées directement** (sites officiels, blogs de concepteurs, presse, Wikipédia, un mémoire de master, des notices d'articles scientifiques). Six images officielles ou de presse ont été observées à l'écran pour décrire le style visuel de Grimgar.
- **Niveaux de preuve utilisés dans le texte :**
  - *(lu)* : la page a été ouverte et lue ;
  - *(extrait)* : l'information n'a été vue que dans un extrait de résultat de recherche, la page elle-même étant inaccessible ;
  - *(hypothèse)* : proposition de conception de ma part, à tester, qui ne s'appuie sur aucune source directe.
- **Limite importante : le quota de recherches web de la session a été atteint en cours de travail.** La suite a été menée uniquement par lecture directe d'adresses déjà connues. Certaines pistes n'ont donc pas pu être explorées (voir section 12).
- **Pages inaccessibles** (erreurs 402/403 ou contenu tronqué) : wikis Fandom (Habitica, Grimgar), wiki WalkScape, ACM Digital Library, ScienceDirect, ResearchGate, TV Tropes, Bulbapedia, PC Gamer, Codrops, Fast Company, dépôt de l'université de Tilburg.
- **Correction d'attribution par rapport à la demande initiale.** La série *The Math of Idle Games* (parties I à III) est signée **Anthony Pecorella** (Kongregate), et non Alexander King `[PECORELLA-MATH1]`. Alexander King est l'auteur de la série *Numbers Getting Bigger* (Envato Tuts+, 2015-2016) `[KING-MATH]`.
- **Citations.** Les sources sont paraphrasées en français ; aucune citation longue n'est reproduite.
- Ce document ne constitue pas un avis juridique (section 7).

---

## 1. Jeux et applications dont la progression est alimentée par une activité réelle

### 1.1 Tableau de synthèse

| Titre | Carburant réel | Ce qui est apprécié | Ce qui est critiqué | Leçon principale |
|---|---|---|---|---|
| **Habitica** | Tâches cochées | Groupes, quêtes, classes utiles au groupe | Punitions, dégâts infligés au groupe, effets contre-productifs | Ne pas punir ; ne pas faire payer le groupe |
| **WalkScape** | Pas | Tout est lié à la marche, pas perdus mis en banque, peu d'écran | Bêta fermée, liste d'attente | Le modèle le plus proche du projet |
| **Pokémon Sleep** | Sommeil | Rituel du matin, encourage la régularité | Répétitif, dérive vers l'optimisation et la dépense | Garder l'optimum du jeu aligné sur le comportement sain |
| **Pikmin Bloom** | Pas | Défis de groupe sans échec sec, marche « sans objectif » | Peu de « jeu » | Récompenses partielles, contributions célébrées |
| **Monster Hunter Now / Pokémon GO** | Déplacement, présence | Jeu à plusieurs sur place, QR code | Colère quand le jeu à distance est pénalisé | Carotte, pas bâton |
| **Zombies, Run!** | Course | Le récit comme récompense, mains libres | Abonnement cher | L'histoire motive mieux que les points |
| **Finch** | Gestes de soin de soi | Sans punition, doux | Notifications, surcharge, « jouer le bien-être » | Même un jeu doux peut épuiser |
| **Focus Friend** | Temps sans téléphone | Mignon, sans pub, simple | Contenu gratuit vite épuisé | Simplicité et honnêteté commerciale |
| **Forest** | Temps sans téléphone | Métaphore visuelle, vrais arbres plantés | Culpabilité, nouveauté qui s'use, groupe puni | Contre-modèle pour le groupe |
| **Focumon** | Temps de concentration | Web/PWA, sessions de groupe, gratuit | — (peu de critiques trouvées) | Preuve de faisabilité technique |
| **Spirit City: Lofi Sessions** | Temps de travail | Ambiance, esprits à découvrir, générosité | Décoration parfois distrayante | Dévoilement par conditions |
| **Rusty's Retirement** | Aucun (compagnon de bureau) | Jeu en bandeau, mode Focus | Peut distraire | Le jeu doit savoir ralentir |
| **Ring Fit Adventure** | Exercice | RPG complet, propose d'arrêter | RPG simpliste | Types d'actions colorés ; invitation à s'arrêter |
| **Fitness RPG** | Pas | Progression par les pas | Rien au-delà de 10 000 pas ; trop de menus | Plafond sec et corvées = frustration |

### 1.2 Fiches détaillées

#### Habitica

- **Boucle.** Habitudes, tâches quotidiennes et tâches ponctuelles rapportent XP et or ; une quotidienne manquée fait perdre des points de vie `[WIKI-HABITICA]`.
- **Groupes.** Un groupe compte de 1 à 30 membres `[HAB-FAQ]`. En quête de boss, les tâches accomplies blessent le boss ; les quotidiennes manquées déclenchent une attaque du boss **contre le joueur et contre tous les membres du groupe** `[HAB-GUIDE]`.
- **Soupape.** Un réglage « Pause Damage » (l'auberge) suspend les dégâts en cas de vacances ou de maladie `[HAB-FAQ]` `[HAB-GUIDE]`.
- **Fermeture des guildes et de la taverne (8 août 2023).** Raisons officielles `[HAB-FAQ]` :
  - espaces utilisés par une part très faible des joueurs ;
  - nouvelles lois de sécurité en ligne imposant une surveillance active des espaces publics, que Habitica n'assurait pas ;
  - ressources à recentrer sur le cœur du produit.
  Les groupes privés et les messages privés ont été conservés. Un outil de mise en relation (« Look for a Party ») avait été lancé en mai 2023 `[HAB-LFP]`. Wikipédia signale aussi le départ des modérateurs en décembre 2022 `[WIKI-HABITICA]`.
- **Critique scientifique.** Diefenbach et Müssig (2019) identifient sept effets contre-productifs. Dans leur étude de terrain (45 utilisateurs, deux semaines), tous les participants en ont subi. L'un des plus fréquents : être puni pendant les périodes les plus productives, faute d'avoir coché à temps. La fréquence de ces effets prédit la baisse de motivation `[DIEFENBACH]`. *(Seul le résumé a pu être lu.)*
- **Critique de terrain.** Un ticket de 2014 décrit un groupe au bord de l'anéantissement quotidien, dépensant son or en potions, avec un soigneur débordé `[HAB-ISSUE]`.
- **Classes.** Quatre classes (guerrier, mage, soigneur, voleur) `[HAB-FAQ]`. Les joueurs décrivent le voleur par ce qu'il apporte : plus de butin, un bonus donné au groupe en début de journée `[HAB-ROGUE]`.

#### WalkScape

- **Boucle.** On choisit une activité (couper du bois, voyager, fabriquer), puis ce sont les pas réels qui la font avancer. Toutes les mécaniques dépendent de la marche `[WALKSCAPE-CBT]`.
- **Rien n'est perdu.** Les pas « gaspillés » vont dans une banque de pas et comptent double plus tard `[WALKSCAPE-CBT]`.
- **Peu d'écran.** Le studio indique qu'un coup d'œil tous les 1 000 à 10 000 pas suffit ; l'application peut rester fermée `[WALKSCAPE-CBT]`.
- **Modèle économique.** Bêta fermée, accès anticipé pour les soutiens Patreon `[WALKSCAPE-SITE]`.
- **Social asynchrone.** Les carnets de développement de 2026 décrivent une boîte aux lettres d'échange, un tableau de contrats et un défi communautaire `[WALKSCAPE-DEV]`.
- *(extrait)* Absence de GPS et liste des compétences : vues seulement dans un extrait du wiki.

#### Pokémon Sleep

- **Boucle.** Le téléphone mesure le sommeil ; le score de sommeil multiplie la force de Ronflex ; des Pokémon « assistants » récoltent des baies pendant l'absence du joueur `[WIKI-PSLEEP]`.
- **Succès.** Plus de 28 millions de téléchargements en juillet 2025, 30 millions en avril 2026 `[WIKI-PSLEEP]`.
- **Apprécié.** Le réveil avec des Pokémon endormis ; le jeu « juge » gentiment les mauvaises habitudes `[NLIFE-PSLEEP]`.
- **Critiqué.** Répétitivité après une semaine `[NLIFE-PSLEEP]`. Dérive vers l'optimisation : tableaux, listes de niveaux, plannings ; peur de manquer quelque chose qui pousse à l'achat ; tricherie sur l'heure du coucher `[GEORGESCU]`.

#### Pikmin Bloom

- **Boucle.** Les pas font pousser des Pikmin, qui plantent des fleurs et partent en expédition `[WIKI-PIKMIN]`.
- **Défi hebdomadaire.** Groupe de 5 personnes au plus, du lundi au dimanche, objectif de pas ou de fleurs `[PIKMIN-HELP]` `[PIKIPEDIA-WEEKLY]`.
  - Note de 1 à 3 étoiles selon la part atteinte ; prix de participation même en cas d'échec.
  - Les contributions de chacun sont affichées et **célébrées** à l'écran.
- **Party Walk (fin juin 2024).** Marche de groupe sans objectif, sans récompense, sans limite de participants, rejointe par QR code ou lien `[PIKMIN-PARTYWALK]` `[PIKIPEDIA-PARTY]`.

#### Monster Hunter Now et Pokémon GO

- **Monster Hunter Now.**
  - Chasses de 75 secondes ; possibilité de « marquer » un monstre pour plus tard `[WIKI-MHN]` `[MHN-LAUNCH]`.
  - Chasse en groupe jusqu'à 4, **dans un rayon de 200 m**, par invitation ou QR code `[DEXERTO-MHN]`.
  - Lettre des développeurs : les jetons d'amitié ne sont consommés qu'en cas de victoire, et une récompense spéciale est donnée aux groupes de 4 réunis sur place `[MHN-DEVLETTER]`.
- **Pokémon GO.**
  - *Party Play* : 4 dresseurs physiquement proches, code ou QR code, défis de groupe, bonus de dégâts en raid `[POGO-PARTY]`.
  - Leurres profitant à tous les joueurs proches, échanges exigeant la proximité, journées communautaires mensuelles `[WIKI-POGO]`.
  - Avril 2023 : hausse du prix des raids à distance et plafond de 5 par jour, avec un bonus pour les raids sur place `[POGO-REMOTE]`. La presse spécialisée annonçait une forte réaction négative `[POGOHUB]`.
  - Un éditorial de 2022 défendait l'inverse : rendre le présentiel meilleur au lieu de dégrader le distanciel `[THEGAMER-RAIDS]`.

#### Zombies, Run!

- Récit audio épisodique pendant la course ; ramassage automatique d'objets ; base à agrandir entre deux sorties `[WIKI-ZR]`.
- Le site officiel affirme ne pas dire au joueur jusqu'où ni à quelle vitesse aller `[ZR-ABOUT]`.
- Plus de dix millions de téléchargements ; Naomi Alderman a repris la propriété du jeu en novembre 2025 `[ZR-ABOUT]`.

#### Finch

- Un oiseau grandit quand l'utilisateur accomplit des gestes de soin de soi `[FINCH-SITE]`.
- *(extrait)* L'oiseau ne meurt jamais et manquer un jour ne coûte rien.
- **Critique récente.** Une journaliste de Slate (6 septembre 2026) décrit un épuisement en six semaines, l'impression de « jouer » le bien-être et un afflux de notifications `[SLATE-FINCH]`.
- **Critique d'ergonomie.** Pages de quêtes et de réglages surchargées, fatigue décisionnelle `[PRATT-FINCH]`.

#### Focus Friend (Hank Green, 2025)

- Un haricot tricote pendant la session ; les chaussettes s'échangent contre de la décoration `[TC-FF1]`.
- Si l'on interrompt la session, le haricot devient triste `[SCARYMOMMY-FF]`.
- Sans publicité, sans compte obligatoire ; abonnement facultatif `[TC-FF1]` `[BECKSVOICE-FF]`.
- Application de l'année 2025 sur Google Play `[TC-FF2]`.
- **Limite.** La décoration gratuite est épuisée en quelques jours `[BECKSVOICE-FF]`.

#### Forest

- L'arbre meurt si l'on quitte l'application `[WIKI-FOREST]`.
- **En groupe, si une personne abandonne, l'arbre de tout le monde meurt** `[FOREST-SITE]`.
- Plus de 60 millions de téléchargements et plus de 2 millions d'arbres réels plantés `[FOREST-SITE]`.
- **Usure.** Un testeur décrit trois phases : nouveauté forte (semaines 1-2), arbre mort qui ne fait plus rien (semaines 3-4), simple minuteur ensuite `[STI-FOREST]`.
- **Culpabilité.** Un concurrent (source biaisée) affirme que la punition érode l'habitude chez les personnes anxieuses `[ELEVENAPRIL]`.

#### Focumon

- Application web installable en PWA, avec extension de navigateur `[FOCUMON]`.
- Monstres en pixel art à collectionner, sessions de groupe à la demande, **groupe de 6 joueurs** `[FOCUMON]`.
- Gratuit, sans publicité ni microtransaction ; abonnement facultatif `[FOCUMON]`.
- Rappels de pause (boire, manger, s'étirer) ; fondateur concerné par le TDAH `[FOCUMON]`.

#### Spirit City: Lofi Sessions, Chill Pulse

- **Spirit City** (8 avril 2024) : 97 % d'avis positifs sur environ 9 000 `[STEAM-SPIRIT]`.
  - Des esprits apparaissent selon la combinaison activité, ambiance sonore et décor, à partir d'indices `[STEAM-SPIRIT]`.
  - Monnaie donnée très généreusement, ce qui fonctionne `[BW-SPIRIT]`.
  - Après 200 heures, une utilisatrice dit que la décoration a remplacé le défilement des réseaux pendant les pauses `[GAMEGRIN-SPIRIT]`.
- **Chill Pulse** (2 mai 2024) : minuteur, listes, décors ; 92 % d'avis positifs sur 524 `[STEAM-CHILL]`.

#### Rusty's Retirement

- Jeu de ferme idle affiché en bandeau en bas de l'écran (26 avril 2024) ; plus de 550 000 exemplaires en juillet 2025 `[WIKI-RUSTY]`.
- **Mode Focus** : tout ralentit de moitié et les robots consomment moins, pour réduire la fréquence des interventions `[GP-RUSTY]`.

#### Ring Fit Adventure et Fitness RPG

- **Ring Fit Adventure.**
  - RPG au tour par tour où les exercices sont les attaques ; compétences colorées (bras, jambes, abdominaux, yoga) plus efficaces contre les ennemis de la même couleur `[WIKI-RINGFIT]`.
  - Le jeu propose d'arrêter pour la journée après environ trois niveaux, et encadre échauffement et retour au calme `[THEGAMER-RINGFIT]`.
  - Plus de 15 millions d'exemplaires en mars 2023 `[WIKI-RINGFIT]`.
- **Fitness RPG (Shikudo).**
  - Les pas deviennent de l'énergie pour des héros `[APPSTORE-FRPG]`.
  - Critiques d'utilisateurs : aucun bénéfice au-delà de 10 000 pas ; les menus annexes donnent l'impression de jouer à un idle au lieu de bouger `[APPSTORE-FRPG]`.

#### Autres titres utiles

- **Neko Atsume** : on pose de la nourriture, on ferme l'application, on revient voir quels chats sont passés. Aucun échec possible `[WIKI-NEKO]`.
- **Animal Crossing: New Horizons** : horloge réelle, objectifs facultatifs, jeu qui n'est pas conçu pour être joué en continu `[WIKI-ACNH]`.
- **StreetPass (Nintendo 3DS)** : récompense le simple fait de croiser physiquement d'autres joueurs `[WIKI-STREETPASS]`.
- **Titres 2026 signalés par des blogs d'éditeurs** *(sources biaisées)* : MistyWay, Focus Train `[MISTYWAY]` `[ELEVENAPRIL]`.

### 1.3 Rétention : pratiques saines et pratiques manipulatrices

| Pratique saine | Exemple | Pratique manipulatrice | Exemple |
|---|---|---|---|
| Récompenser le repos | XP reposée `[MADIGAN]` | Plafond hors-ligne conçu pour forcer le retour | Conseil d'un studio `[MINDSTUDIOS]` |
| Séries souples | Amulette du week-end `[DUO-2017]` | Série perdue puis rachetable en argent | Décrit par `[UXMAG]` |
| Proposer d'arrêter | Ring Fit `[THEGAMER-RINGFIT]` | Bonus de connexion quotidienne, événements limités | `[MINDSTUDIOS]` |
| Rien ne meurt | Finch, Pikmin Bloom | Créature ou arbre qui souffre | Forest `[FOREST-SITE]` |
| Groupe sans sanction | Party Walk `[PIKMIN-PARTYWALK]` | Dégâts infligés aux coéquipiers | Habitica `[HAB-GUIDE]` |
| Notifications choisies | — | Afflux de notifications | Finch selon `[SLATE-FINCH]` |
| Sans publicité | Focus Friend, Focumon | Culpabilisation à la sortie | Décrit par `[UXMAG]` |

### 1.4 Implication concrète pour l'app

1. **Une seule source de progression.** Aucun mini-jeu ne doit rapporter de l'XP. Tout vient du temps d'étude, comme tout vient des pas dans WalkScape.
2. **Rien ne meurt, rien ne se perd.** Une session interrompue garde ses minutes. Le personnage « attend au bord du chemin ».
3. **Le repos est une action de jeu**, avec sa propre récompense visible.
4. **Proposer d'arrêter.** Après le palier de la journée, l'app suggère de lever le camp, comme Ring Fit.
5. **Prévoir l'usure des semaines 3-4.** Trois parades : dévoilement de nouveaux systèmes, rituel hebdomadaire, lien social.
6. **Surveiller la dérive « tableur ».** La stratégie optimale du jeu doit être : étudier régulièrement, avec de bonnes méthodes, en se reposant.
7. **Pas de corvées d'interface.** Pas de tâches quotidiennes de menu.
8. **Faisabilité.** Focumon montre qu'une PWA avec sessions de groupe et groupes de 6 est réaliste.

---

## 2. Fondamentaux du design idle et incrémental

### 2.1 Ce que disent les sources

- **Définition.** Une monnaie qui augmente seule ou presque, et que l'on dépense pour augmenter sa vitesse de production `[KING-MATH]`.
- **Boucle.** Revenir, dépenser ce qui s'est accumulé, repartir `[PECORELLA-GDC]`.
- **Pourquoi c'est satisfaisant avec peu d'interaction.**
  - Croissance toujours positive, aucune punition, aucun échec `[PECORELLA-GDC]`.
  - Plus l'absence est longue, plus le retour est gratifiant ; les rendez-vous forcés deviennent inutiles `[PECORELLA-GDC]`.
  - Plaisir de la découverte : des systèmes cachés se dévoilent peu à peu `[KING-WHY]` `[KING-MATH]`.
  - Plaisir d'optimiser un système `[KING-EVEN]`.
- **Mathématiques usuelles.**
  - Coût d'un achat = coût de base × taux élevé à la puissance du nombre possédé, avec un taux entre 1,07 et 1,15 `[KING-MATH]` `[PECORELLA-MATH1]`.
  - La production croît moins vite que les coûts ; l'écart crée l'attente `[PECORELLA-MATH1]`.
  - Des multiplicateurs à certains paliers créent des « bosses » de progression rapide. Pecorella insiste : une courbe lisse est ennuyeuse `[PECORELLA-GDC]`.
- **Prestige.** On remet à zéro en échange d'un bonus permanent. Les formules utilisent une racine carrée ou cubique des gains cumulés `[PECORELLA-MATH3]`.
- **Rythme de déblocage.** Des coûts de base espacés d'un demi-ordre de grandeur évitent des déblocages trop rapides ou trop lents `[KING-MATH]`.
- **Progression hors-ligne.** On enregistre un horodatage, on calcule le temps écoulé au retour, on affiche un message de bienvenue avec le gain `[ANTONOVS]`.
- **Usage commercial.** Certains studios recommandent de plafonner le gain hors-ligne pour pousser au retour, avec notifications et bonus quotidiens `[MINDSTUDIOS]`. C'est précisément ce que le projet veut éviter.

### 2.2 Ce qui change dans le cas du projet

| Jeu idle classique | Application de révision |
|---|---|
| La production croît de façon illimitée | La production est le temps d'étude, borné à quelques heures par jour |
| Coûts exponentiels | Coûts polynomiaux, sinon blocage rapide |
| L'absence est du temps vide | L'absence est la session d'étude elle-même |
| Le joueur revient pour dépenser | L'étudiant revient pour clore sa session |
| Prestige décidé par le joueur | Rythme imposé par le calendrier universitaire |

### 2.3 Concevoir le « moment du retour »

Modèles observés : message de bienvenue des jeux idle `[ANTONOVS]`, chats passés pendant l'absence dans Neko Atsume `[WIKI-NEKO]`, réveil de Pokémon Sleep `[NLIFE-PSLEEP]`, célébration des contributions de Pikmin Bloom `[PIKIPEDIA-WEEKLY]`.

Cinq règles proposées *(hypothèse)* :

1. **Court** : moins d'une minute.
2. **Raconté** : deux ou trois lignes sur ce que le personnage a fait « pendant que tu travaillais ».
3. **Un seul temps fort** : montée de niveau, trouvaille ou rencontre.
4. **Une décision au plus**, et elle peut attendre.
5. **Une fin nette** : l'écran se referme sur le camp, sans relance.

### 2.4 Implication concrète pour l'app

- **Boucle en quatre temps** : préparer (20 secondes), partir (zéro interaction), revenir (une minute), veillée hebdomadaire (deux à trois minutes).
- **Pas d'exponentielle.** La courbe de niveau quadratique déjà simulée dans le projet (`docs/simulations/01-formule-xp.R`) va dans le bon sens.
- **Des bosses plutôt qu'une pente lisse** : déblocages aux niveaux 3, 5, 8, 12, etc.
- **Dévoilement sur quatre semaines** *(hypothèse)* : minuteur et journal, puis classe, puis équipement, puis guilde.
- **Prestige = semestre.** À la fin du semestre, la progression devient un souvenir permanent et un nouveau cycle commence.
- **Temps calculé par horodatage**, ce qui résiste à la mise en veille du téléphone.
- **Aucun plafond hors-ligne utilisé comme hameçon**, aucune notification fondée sur la peur de manquer.

---

## 3. Principes du cozy et conciliation avec boss et raids

### 3.1 Le rapport Project Horseshoe « Cozy Games »

Auteurs : Daniel Cook, Tanya X. Short, Anthony Ordon, Dan Hurd, Chelsea Howe, Jake Forbes, Squirrel Eiserloh, Joshua Diaz ; modérateur Ron Meiners. Atelier de l'automne 2017, publication le 24 janvier 2018 `[COOK-COZY]`. Version courte par Tanya X. Short en mars 2018 `[SHORT-COZY]`.

- **Trois piliers.**
  - *Sécurité* : absence de danger et de risque de perte ; tout est volontaire.
  - *Abondance* : les besoins de base sont couverts, rien ne presse.
  - *Douceur* : stimulations légères, rythme lent, périmètre maîtrisable.
- **Ce qui détruit le cozy.** Récompenses extrinsèques pressantes, menace, responsabilité imposée, notifications, stimulations intenses, présence sociale non consentie, tromperie, ostentation.
- **Le contraste renforce le cozy.** La pluie contre la vitre rend le coin lecture plus chaleureux ; la même pluie entrant par une vitre cassée le détruit.
- **Le refuge dans un jeu dur.** Les feux de camp de Dark Souls sont cités comme moments cozy au milieu du danger.
- **Le cozy doit exister dans les systèmes**, pas seulement dans l'habillage. The Sims Online avait une esthétique douce mais des ressources à somme nulle, d'où du racket entre joueurs.
- **Cadeaux.** Un cadeau rare, destiné à une seule personne, crée plus de lien qu'un bonus gratuit envoyé à tous.
- **Mise en garde.** Le cozy peut être instrumentalisé pour faire baisser la garde avant un achat.

### 3.2 Ce que disent les joueurs (mémoire de master, 2024)

Mémoire de Maria Önnberg, université de Skövde, fondé sur un questionnaire et des entretiens. Échantillon réduit, à lire comme indicatif `[ONNBERG]`.

- Une personne apprécie que le tableau de quêtes « ne se fâche pas » si l'on ne fait pas la quête.
- Ce qui met la pression : contraintes de temps, faim et soif à gérer, ennemis, mort, perte d'objets.
- Pour une personne interrogée, les combats de boss imposés sont le moment le moins aimé.
- Le multijoueur peut stresser quand il supprime la pause.
- Pouvoir décider quand on combat maximise le sentiment de sécurité.

### 3.3 Exemples de coopération non punitive

| Mécanisme | Exemple | Source |
|---|---|---|
| Récompense partielle et prix de participation | Défi hebdomadaire de Pikmin Bloom | `[PIKMIN-HELP]` |
| Groupe sans objectif ni récompense | Party Walk | `[PIKMIN-PARTYWALK]` |
| L'échec ne coûte rien | Jetons non consommés en cas d'échec | `[MHN-DEVLETTER]` |
| Impossible de gêner l'autre | Journey : un seul son, aucune collision | `[WIKI-JOURNEY]` |
| Aide asynchrone, approbation uniquement positive | Death Stranding | `[WIKI-DS]` |
| Butin partagé, ennemis à vie commune | Realm of the Mad God | `[COOK-KIND]` |
| Objectif communautaire mondial | Ordres majeurs de Helldivers 2 | `[WIKI-HD2]` |

### 3.4 Implication concrète pour l'app

- **Le camp est sûr, le danger est dehors.** L'écran d'accueil est un feu de camp. Les boss sont des silhouettes lointaines.
- **Un boss ne peut pas blesser.** Sa jauge ne fait que descendre. Aucun dégât, aucune perte d'objet.
- **Pas de défaite, une retraite.** En fin de semaine, le boss « se retire » et la progression est conservée, ou notée en étoiles.
- **Raids facultatifs**, jamais un passage obligé.
- **Vocabulaire de voyage plutôt que de combat** : expédition, traversée, siège patient, chantier *(hypothèse)*.
- **Abondance.** Récompenses généreuses dès le début, pas de boutique fondée sur le manque.
- **Tension à assumer.** Le rapport estime que les récompenses extrinsèques nuisent au cozy. L'app est par nature un système de récompense. Parade proposée : présenter l'XP comme une trace du chemin parcouru, et privilégier de petites surprises non annoncées.

---

## 4. Économie de la progression

### 4.1 L'histoire de l'XP reposée de World of Warcraft

- En bêta, le gain d'XP baissait après quelques heures de jeu d'affilée. Les joueurs ont détesté.
- Blizzard a inversé la présentation : le taux réduit est devenu le taux normal, l'ancien taux normal est devenu un bonus de repos à 200 %. Les chiffres étaient identiques ; les joueurs ont adoré `[MADIGAN]` `[WOWWIKI-REST]`.
- *Réserve* : l'anecdote est rapportée de seconde main (Rob Pardo, cité dans un podcast, repris par Jamie Madigan).
- **Règles actuelles.** Le repos s'accumule hors connexion, plus vite à l'auberge, et plafonne à une fois et demie un niveau `[WOWWIKI-REST]`.

### 4.2 Séries, gels et souplesse : les données de Duolingo

| Résultat publié | Source |
|---|---|
| Amulette du week-end : +4 % de retours une semaine plus tard, −5 % de séries perdues | `[DUO-2017]` |
| Les utilisateurs qui enchaînent les leçons abandonnent davantage que ceux qui se ménagent | `[DUO-2017]` |
| Deux gels de série au lieu d'un : +0,38 % d'apprenants actifs par jour | `[DUO-2022]` |
| Une série de 7 jours est associée à 3,6 fois plus de chances de finir le cours | `[DUO-2022]` |
| Série partagée avec un ami : 22 % de chances en plus de faire la leçon du jour | `[DUO-FRIEND]` |
| Une série simple (une leçon par jour) marche mieux qu'une série liée à l'XP | `[LENNY-DUO]` |

- *Réserves* : données publiées par l'entreprise elle-même ; les deux dernières lignes sont des corrélations.
- *(extrait)* Trois gels ne feraient pas mieux que deux.
- **Séries sans honte** `[UXMAG]` : séparer le maintien de la série des objectifs ambitieux ; permettre de regagner une série par l'effort plutôt que par l'argent ; valoriser la tendance longue.

### 4.3 Courbes d'XP, plafonds doux, rattrapage

- **Courbe de niveau.** La formule candidate du projet (XP cumulée = 25 n² + 75 n) fait croître le coût d'un niveau de façon linéaire : 50 n + 100.
  - D'après le bilan de simulation, un profil régulier gagne environ 143 XP par heure. Le passage du niveau 30 au niveau 31 demande alors environ 11 heures *(calcul de ma part)*.
- **Paliers journaliers.** La formule candidate donne 1,5 XP par minute jusqu'à 2 h, puis 1,0, puis 0,5, puis 0,2 au-delà de 8 h.
  - Recommandation : présenter les deux premières heures comme un **bonus de fraîcheur**, et le reste comme le rythme normal. Ne jamais afficher de malus.
- **Ne pas plafonner sèchement.** Le plafond à 10 000 pas de Fitness RPG est vécu comme une frustration `[APPSTORE-FRPG]`.
- **Rattrapage** *(hypothèse)*.
  - Aucune perte de niveau ni d'objet après une absence.
  - Série « en veille » plutôt que brisée.
  - Au retour, réserve de fraîcheur pleine et petite quête de reprise.
- **Transparence.** Les mécanismes d'ajustement cachés sont jugés injustes ou exploités une fois découverts `[WIKI-DDA]`.

### 4.4 Donner du sens à l'équipement et aux talents sans combat d'adresse

Principes tirés de Daniel Cook `[COOK-VALUE]` :

- Chaque ressource doit mener à un besoin psychologique réel (autonomie, compétence, lien).
- Préférer des **entrées différenciées** : chaque système demande un type d'effort différent.
- Dans un arbre de talents, prévoir **plus de nœuds que de points** : le choix devient une expression de soi.

Propositions *(hypothèse)* :

| Élément | Ce qu'il fait | Ce qu'il ne fait pas |
|---|---|---|
| **Équipement** | Petit bonus ciblé sur une méthode, sur le repos ou sur l'entraide | Pas de bonus lié au volume ni aux heures tardives |
| **Talents** | Débloquent des **verbes** : planifier un jour de repos, offrir un bouclier, ouvrir une route | Pas de simple multiplicateur d'XP |
| **Apprentissage en guilde** | Un mentor enseigne une méthode de travail contre des pièces du jeu | Pas de paiement en argent réel |
| **Souvenirs** | Objets commémorant un cap franchi | Aucune puissance |

L'idée de l'apprentissage payant vient directement de Grimgar, où les guildes enseignent les compétences contre paiement `[WIKI-GRIMGAR-JA]`.

### 4.5 Donner du sens aux classes

- **Précédent Habitica** : une classe se définit par sa boucle propre et par ce qu'elle apporte au groupe `[HAB-ROGUE]`.
- **Précédent Ring Fit** : types d'actions colorés, plus efficaces contre certains obstacles `[WIKI-RINGFIT]`.
- **Interdépendance** : des rôles complémentaires obligent à coopérer `[COOK-KIND]`.
- **Paresse sociale** : elle diminue quand chacun a un rôle distinct qui le rend utile au groupe `[WIKI-LOAFING]`.

Conclusion : une classe doit combiner **une affinité de méthode** (bonus modeste) et **un rôle de groupe** (un verbe que les autres n'ont pas). Voir section 9.

### 4.6 Risques : inflation de puissance et captation de l'attention

- **Inflation de puissance.** Définition : les contenus récents surpassent les anciens et les rendent obsolètes `[WIKT-CREEP]`.
  - Ici, le danger vient de l'empilement de multiplicateurs : méthode, régularité, fraîcheur, classe, équipement, talents, groupe.
  - Parade *(hypothèse)* : additionner les bonus au lieu de les multiplier, et plafonner leur somme.
  - Guild Wars 2 offre un modèle de progression de compte où les points disponibles excèdent les points nécessaires `[GW2-MASTERY]`.
- **Surjustification.** Une récompense attendue et tangible peut réduire la motivation intrinsèque ; les récompenses inattendues et les retours informatifs ont moins cet effet. Le débat scientifique n'est pas clos `[WIKI-OVERJUST]`.
- **Méthode déclarée.** Le bonus pour méthode active repose sur une déclaration. Parade : bonus modeste et absence de classement, donc peu d'intérêt à tricher.

### 4.7 Implication concrète pour l'app

1. Garder la courbe quadratique ; ajouter des paliers de déblocage.
2. Rebaptiser les paliers journaliers en bonus de fraîcheur.
3. Deux boucliers de série gagnés par l'effort ; jours de repos planifiés à la veillée.
4. Aucune perte après une absence.
5. Bonus additifs et plafonnés ; étendre la simulation existante pour le vérifier.
6. Talents qui débloquent des verbes et enseignent des méthodes.
7. Budget de décisions : une avant la session, zéro pendant, une ou deux après.

---

## 5. Guildes coopératives sans culpabilité ni passagers clandestins

### 5.1 Ce que disent les sources

- **Jeux bienveillants** (Cook, Lau, Tan, Burgess, Moriwaki, Kajioka) `[COOK-KIND]` :
  - cinq valeurs : sécurité, interdépendance, but commun, appartenance, résolution saine des conflits ;
  - transformer les ressources à somme nulle en ressources que plusieurs peuvent récolter ;
  - l'abondance totale supprime le besoin des autres, la rareté pousse à thésauriser : viser un entre-deux ;
  - **altruisme toxique** : quand la demande sociale est trop forte, les plus dévoués s'épuisent. Prévoir des sorties et valoriser les périodes de retrait ;
  - **interactions fermées** : moins de moyens d'expression, moins de harcèlement ;
  - rendre le don trop facile le vide de son sens.
- **Amitié** (Cook et al.) `[COOK-FRIENDS]` : proximité, similarité, réciprocité, confidence. Identité persistante, petits groupes stables. Cercles de Dunbar : 5, 15, 50, 150.
- **Paresse sociale** `[WIKI-LOAFING]` : l'effort baisse en groupe, surtout quand la contribution est invisible ou semble inutile. Elle est moindre dans les groupes de 3 à 5.
- **Effet Köhler** `[WIKI-KOHLER]` : dans une tâche où chacun est indispensable, les membres les plus faibles fournissent plus d'effort. L'effet suppose un retour continu et s'observe surtout en présence physique.
- **Doublure de présence (body doubling)** `[WIKI-BODYDOUBLE]` : travailler à côté de quelqu'un aide à se lancer. Les preuves scientifiques restent limitées.

### 5.2 Tailles de groupe observées

| Produit | Taille | Source |
|---|---|---|
| Pokémon GO Party Play | 4 | `[POGO-PARTY]` |
| Monster Hunter Now | 4 | `[DEXERTO-MHN]` |
| Pikmin Bloom, défi hebdomadaire | 5 | `[PIKMIN-HELP]` |
| Duolingo, séries partagées | 5 amis, par paires | `[DUO-FRIEND]` |
| Focumon | 6 | `[FOCUMON]` |
| Habitica | 30 au maximum | `[HAB-FAQ]` |

### 5.3 Précédents de bonus en présentiel

| Mécanisme | Détail | Source |
|---|---|---|
| QR code ou code court affiché par l'hôte | Pokémon GO, Monster Hunter Now, Pikmin Bloom | `[POGO-PARTY]` `[DEXERTO-MHN]` `[PIKMIN-PARTYWALK]` |
| Rayon de proximité | 200 m | `[DEXERTO-MHN]` |
| Bonus réservé au groupe réuni | Récompense de monstre marqué à 4 | `[MHN-DEVLETTER]` |
| Bonus de puissance de groupe | Party Power | `[POGO-PARTY]` |
| Objet profitant à tous les voisins | Leurres | `[WIKI-POGO]` |
| Récompense de simple croisement | StreetPass | `[WIKI-STREETPASS]` |
| Contre-exemple | Pénaliser le jeu à distance | `[POGO-REMOTE]` `[THEGAMER-RAIDS]` |

**Contrainte technique.** L'API Web Bluetooth est expérimentale et absente de navigateurs majeurs `[MDN-BLUETOOTH]`. Le QR code reste donc la voie réaliste pour une PWA sur iPhone. *(Le tableau de compatibilité détaillé n'a pas pu être lu.)*

### 5.4 Implication concrète pour l'app

**Structure sociale** *(hypothèse)*

| Niveau | Taille | Usage |
|---|---|---|
| Binôme | 2 | Engagement mutuel léger |
| Tablée | 3 à 6 | Session en direct, sur place ou à distance |
| Guilde | 6 à 15, 30 au plus | Expédition de la semaine |

**Règles anti-culpabilité**

1. **Groupes privés sur invitation.** Pas d'annuaire public, pas de salon public.
2. **Interactions fermées** : encouragements pré-écrits, gestes, pas de texte libre au départ.
3. **Contribution mesurée par rapport à soi** : part de sa propre intention hebdomadaire tenue, et non minutes brutes.
4. **La jauge du groupe s'ajuste aux membres actifs.** Un membre absent passe « en voyage » sans pénaliser personne.
5. **Célébrer sans classer** : montrer qui a contribué, sans podium.
6. **Récompense partielle et prix de participation**, à la manière de Pikmin Bloom.
7. **Partir tôt ne fait rien perdre aux autres** : l'inverse exact de Forest.
8. **Cadeaux rares et personnels** (un bouclier de série offert), jamais d'envoi de masse.
9. **Droit au retrait** : se mettre en pause de guilde sans justification.

**Sessions en présentiel**

- L'hôte affiche un QR code ; les participants le scannent ; le minuteur et les pauses sont communs.
- **Bonus de présence modeste et surtout symbolique** (tampon sur la bannière de guilde).
- **Recommandation** : ouvrir les raids à toute session synchrone, et réserver au présentiel une récompense cosmétique. Les réserver strictement au présentiel exclurait les étudiants isolés, à distance ou empêchés.
- **Récompense de l'hôte** : symbolique et plafonnée par semaine, pour éviter les invitations de pure forme.

---

## 6. « Grimgar of Fantasy and Ash »

### 6.1 Fiche

| Élément | Information | Source |
|---|---|---|
| Romans | Ao Jūmonji, illustrations d'Eiri Shirai, Overlap Bunko, depuis le 25 juin 2013 | `[WIKI-GRIMGAR-EN]` |
| Volumes | 24 et 2 hors-série selon Wikipédia anglais | `[WIKI-GRIMGAR-EN]` |
| Édition anglaise | J-Novel Club (numérique), Seven Seas (papier) | `[WIKI-GRIMGAR-EN]` |
| Anime | A-1 Pictures, 12 épisodes et 1 OAV, 11 janvier au 28 mars 2016 | `[WIKI-GRIMGAR-EN]` |
| Réalisation et scénario | Ryōsuke Nakamura | `[A1-GRIMGAR]` |
| Création des personnages | Mieko Hosoi | `[A1-GRIMGAR]` |
| **Direction artistique** | **Hidetoshi Kaneko (金子英俊)** | `[A1-GRIMGAR]` |
| Décors | Atelier BWCA, dirigé par Kaneko | `[ANN-KANEKO]` |
| Couleurs | 茂木孝浩 (lecture du nom non vérifiée) | `[A1-GRIMGAR]` |
| Photographie | Shin'ichi Igarashi (五十嵐慎一) | `[A1-GRIMGAR]` |
| Musique | (K)NoW_NAME | `[A1-GRIMGAR]` |

- **La responsabilité de la direction artistique est vérifiée** : la page officielle d'A-1 Pictures crédite Hidetoshi Kaneko ; l'encyclopédie d'Anime News Network précise « direction artistique, conception des décors, décors (Atelier BWCA) ».
- Kaneko a dirigé les décors de Trigun, Black Lagoon, Texhnolyze, et a participé aux décors de Mon voisin Totoro `[ANN-KANEKO]`.
- L'Atelier BWCA, fondé en 1986, a fermé en février 2017 pour raisons de santé de son directeur `[ANN-BWCA]`.
- Le logo officiel porte un sous-titre en français : « Grimgar, le Monde des cendres et de fantaisie » *(observé sur la page d'A-1 Pictures)*.

### 6.2 Ton et thèmes

- **Des gens ordinaires.** Des jeunes se réveillent sans souvenirs, sans statut ni avantage, et chassent des gobelins pour payer leur loyer `[CBR-GRIMGAR]`.
- **Croissance lente.** Les premiers combats sont maladroits ; la petite victoire compte `[CBR-GRIMGAR]` `[NOTE-GRIMGAR]`.
- **Rareté.** Il faut compter pour la guilde, les vêtements, le lit, le repas *(extrait)*. Les compétences s'achètent en rognant sur le quotidien `[NOTE-GRIMGAR]`.
- **Le quotidien.** Cuisiner, nettoyer, chasser, parler à la taverne ou aux bains `[ANN-DEATH]` `[LAETHAS]`.
- **Deuil.** Manato meurt tôt ; la série consacre ensuite plusieurs épisodes au deuil. On n'en sort pas, on apprend à vivre avec `[ANN-DEATH]`.
- **Camaraderie.** Le groupe se reconstruit et accueille Mary malgré les frictions `[WIKI-GRIMGAR-EN]` `[LAETHAS]`.
- **Rythme.** Lent et contemplatif ; l'essentiel se passe entre les quêtes `[OPUS]`.

### 6.3 Systèmes du monde utilisables comme métaphores

| Élément de l'univers | Source | Métaphore possible (sous un nom original) |
|---|---|---|
| Soldats volontaires organisés en groupes | `[WIKI-GRIMGAR-JA]` | Compagnie d'étudiants, tablée |
| Insigne d'apprenti, puis insigne de membre à acheter | *(extrait)* `[FANDOM-GRIMGAR]` | Semaine d'essai, puis sceau de compagnon |
| Guildes enseignant les compétences contre paiement | `[WIKI-GRIMGAR-JA]` | Mentors enseignant des méthodes de travail |
| Sept guildes : guerrier, paladin, chevalier noir, prêtre, mage, voleur, chasseur | `[WIKI-GRIMGAR-JA]` | Six ou sept classes (section 9) |
| Prime d'engagement, frais de guilde, semaine de formation | *(extrait)* `[FANDOM-GRIMGAR]` | Première semaine guidée |
| Ville refuge, ruines peuplées de gobelins, mine | `[WIKI-GRIMGAR-EN]` | Camp, premières destinations |
| Crémation et cendres | `[NOTE-GRIMGAR]` | Clôture douce d'un semestre |

- **Orthographe.** La ville s'écrit « Ortana » dans Wikipédia et « Alterna » dans le wiki de fans ; le chevalier noir est aussi traduit « Dread Knight ».
- **Attention.** Tous ces noms propres appartiennent à l'œuvre (section 7).

### 6.4 Style visuel

**Ce que disent les critiques**

- Décors d'aspect aquarellé, légers, pastel ; personnages dessinés de façon plus classique *(extrait)*.
- Approche picturale, aspect rêveur ; le soleil couchant baigne la scène d'or ; ciels nocturnes remplis d'étoiles avec une lune rouge brisée `[OPUS]`.
- Monde à demi remémoré, doux sur les bords `[CBR-GRIMGAR]`.
- Avis contraires : décors parfois jugés figés ou distrayants *(extrait)*.

**Ce que j'ai observé directement** (visuel officiel sur la page d'A-1 Pictures, cinq images de la série reproduites dans `[OPUS]`)

| Dimension | Observation |
|---|---|
| **Palette de jour** | Murs crème et ocre pâle, toits vert sauge et céladon, feuillages turquoise, ciel outremer franc |
| **Ombres** | Colorées, lavande et violet, jamais noires |
| **Heure dorée** | Lumière jaune d'or au creux de la vallée, collines magenta et prune |
| **Heure bleue** | Dominante outremer et cobalt, herbe vert sarcelle, halo lumineux |
| **Nuit** | Fond vert sarcelle profond, étoiles multicolores en mouchetis, petit croissant rouge |
| **Textures** | Touches larges et visibles, feuillages en taches, blancs laissés en réserve |
| **Lumière** | Halos, contre-jours, perspective atmosphérique |
| **Composition** | Grands paysages, petites silhouettes vues de dos, architecture étagée de type méditerranéen |
| **Visuel officiel** | Lavis clairs, papier visible, bords fondus, points lumineux verts, tons terre et lavande |
| **Logo** | Caractères japonais au pinceau avec éclaboussures, sous-titre en sérif très espacé |

*Réserves.* Je n'ai pas pu vérifier si les décors sont peints à la main ou en numérique. L'auteur du visuel officiel n'est pas vérifié. Je n'ai pas pu observer directement les couvertures des romans ; la description du style d'Eiri Shirai repose donc sur ce seul visuel.

### 6.5 Implication concrète pour l'app

- **Ton des textes** : modeste, chaleureux, jamais épique.
- **La rareté dans la fiction, l'abondance dans l'économie.** Débuts humbles à l'image, récompenses généreuses dans les chiffres.
- **Célébrer le petit.** La première semaine tenue vaut un « premier gobelin ».
- **Accueillir l'absence.** Une semaine manquée devient de la cendre, et la cendre nourrit la suite.
- **Composition réutilisable** : petites silhouettes de dos dans un grand paysage, ce qui réduit fortement le besoin de dessiner des personnages.

---

## 7. Propriété intellectuelle et options de direction artistique sans budget

### 7.1 Ce qui est protégé et ce qui ne l'est pas

| Élément | Statut | Source |
|---|---|---|
| Idées, concepts, règles de jeu | Non protégés | `[JURISEXPERT]` `[KOHEN]` |
| Style général, genre, ambiance | Non protégés en tant que tels | `[ODINLAW]` |
| Illustrations, décors, images de l'anime | Protégés | `[ODINLAW]` `[ANN-LAW]` |
| Personnages dessinés, dialogues, musique | Protégés | `[ODINLAW]` |
| Noms, logos, symboles | Relèvent du droit des marques | `[ODINLAW]` |
| Gratuité du projet | **Ne protège pas** de la contrefaçon | `[ODINLAW]` |

- **Droit français.** Les idées sont de libre parcours ; seule la forme originale est protégée. Textes cités : articles L111-1, L112-1 et L335-2 du Code de la propriété intellectuelle `[JURISEXPERT]`.
- **Jurisprudence française récente sur le jeu vidéo** `[KOHEN]` :
  - le gameplay et les éléments banals ne sont pas protégés ;
  - une copie créant une impression de familiarité a été sanctionnée (40 000 euros) ;
  - concurrence déloyale et parasitisme supposent un risque de confusion ou une valeur économique individualisée.
- **Droit japonais.** Le personnage abstrait est une idée ; ce sont les dessins concrets qui sont protégés `[MONOLITH]`.
- **Œuvres de fans.** Techniquement des œuvres dérivées ; tolérées en pratique, mais le risque augmente quand elles concurrencent les produits officiels `[ANN-LAW]`.
- **Bonne pratique.** Transformer un projet de fan en univers original `[ODINLAW]`.

### 7.2 À faire et à ne pas faire

| À faire | À ne pas faire |
|---|---|
| Créer un univers, des noms et un emblème originaux | Utiliser « Grimgar » dans le nom, la description ou la promotion |
| S'inspirer de l'ambiance : aquarelle, fantasy douce-amère | Reprendre illustrations, captures, logo, musique |
| Utiliser des archétypes génériques (guerrier, mage, soigneur) | Reprendre les noms propres de lieux, de personnages, de divinités |
| Décrire l'inspiration en termes généraux | Reprendre une combinaison distinctive (pièce d'insigne à croissant rouge) |
| Garder la trace datée de ses propres créations | Supposer que la gratuité protège |

**Point à vérifier hors Grimgar.** Le dossier du projet s'appelle « Lexile ». De mémoire, ce mot est aussi une marque liée à une échelle de niveau de lecture dans l'éducation. Je n'ai pas pu le vérifier pendant cette session : à contrôler avant de choisir un nom public.

### 7.3 Techniques web pour un rendu aquarelle

Décrites en prose, sans code.

| Effet | Technique | Source |
|---|---|---|
| Grain de papier | Filtre SVG de bruit procédural | `[MDN-TURBULENCE]` |
| Bords irréguliers | Bruit combiné à une carte de déplacement | `[MDN-DISPLACEMENT]` `[GAMMON]` |
| Lavis superposés | Modes de fusion (multiplication, lumière douce) | `[MDN-BLEND]` |
| Bords fondus vers le blanc | Masque dégradé *(hypothèse)* | — |
| Étoiles, cendres | Points dessinés sur canvas, mouvement très lent *(hypothèse)* | — |

- Les deux filtres SVG et les modes de fusion sont largement disponibles dans les navigateurs `[MDN-TURBULENCE]` `[MDN-DISPLACEMENT]` `[MDN-BLEND]`.
- **À tester** : le coût de ces filtres sur iPhone quand ils couvrent de grandes surfaces animées. Je n'ai pas trouvé de source à ce sujet. Précaution : les appliquer à des éléments fixes.

### 7.4 Sources de ressources libres

| Source | Contenu | Licence | Référence |
|---|---|---|---|
| OpenGameArt, « CC0 Watercolor Textures » | 12 textures d'aquarelle | CC0 | `[OGA-WATERCOLOR]` |
| OpenGameArt, collection « CC0 Textures » | Papier, tissu, pierre, bois | CC0 | `[OGA-COLLECTION]` |
| Kenney | Interfaces, icônes | CC0, usage commercial permis | `[KENNEY]` |
| Polices Alegreya, Cormorant, Inter | Titres et interface | SIL Open Font License | `[FONT-ALEGREYA]` `[FONT-CORMORANT]` `[FONT-INTER]` |

- **Portée de la CC0.** Copie, modification et usage commercial sans autorisation ; mais aucune garantie, et les droits des tiers ne sont pas couverts `[CC0]`.
- **Vérifier chaque ressource** : sur les plateformes de partage, c'est le déposant qui déclare la licence.

### 7.5 Images générées par IA : précautions

- **Droit d'auteur (États-Unis).** Selon le rapport de janvier 2025 du Copyright Office, une œuvre entièrement générée n'est pas protégeable ; rédiger des requêtes ou choisir parmi des résultats ne suffit pas ; seules les parties créées par un humain le sont `[JONESDAY]` `[RIMON]`. *(Situation française et européenne non vérifiée.)*
- **Cohérence.** Les traits dérivent d'une image à l'autre ; les mises à jour de modèles changent le rendu *(extrait)*.
- **Perception.** Les jeux déclarant de l'IA sur Steam sont passés d'environ 1 000 en 2024 à environ 8 000 au premier semestre 2025. Le même article juge le consommateur moyen plutôt tolérant `[GAMERANT-AI]`. Des titres de presse signalent à l'inverse des vagues d'avis négatifs *(extrait)*. **Le signal est donc mitigé.**
- **Éthique et risque.** Ne pas demander une image « dans le style de » l'œuvre ou d'un artiste nommé.
- **Licence de l'outil** : à lire avant tout usage.

### 7.6 Implication concrète pour l'app

Ordre de préférence pour un développeur solo sans budget :

1. **Peindre soi-même des lavis abstraits** sur papier, puis les photographier ou les scanner. Aucune compétence en dessin n'est nécessaire et l'originalité est totale.
2. **Compléter par des textures CC0 et des effets procéduraux.**
3. **Limiter les personnages** à de petites silhouettes de dos.
4. **Dessiner des icônes au trait**, simples, avec un remplissage léger et décalé.
5. **Plus tard, commander quelques illustrations** à un ou une étudiante en art, avec une cession de droits écrite `[JURISEXPERT]`.
6. **IA, en dernier recours**, pour des textures abstraites uniquement, de façon déclarée.

---

## 8. Propositions de boucle de jeu

### 8.1 Boucle A — « Le Feu de camp »

| Moment | Ce qui se passe | Durée |
|---|---|---|
| **Avant** | Écran du camp. Matière, méthode et durée sont pré-remplies. Un bouton : partir. | 20 s |
| **Pendant** | Aucune interaction. Paysage calme ou téléphone verrouillé. Haltes aux pauses. | Session |
| **Après** | Retour au camp : récit en trois lignes, XP, une trouvaille, une question facultative. | 1 min |
| **Fin de semaine** | Veillée : comparaison à ses propres semaines, jours de repos tenus, choix de l'intention suivante. | 2 à 3 min |

- **Avantages** : minimal, fidèle au modèle idle, peu de contenu à produire, faisable seul.
- **Inconvénients** : profondeur RPG limitée ; risque d'usure en semaines 3-4 sans dévoilement.

### 8.2 Boucle B — « L'Expédition »

| Moment | Ce qui se passe |
|---|---|
| **Avant** | Choix d'une destination sur une carte ; chaque trajet demande un nombre de minutes ; équipement choisi. |
| **Pendant** | Les minutes d'étude sont la distance parcourue. |
| **Après** | Arrivée, butin propre au lieu, amélioration légère. |
| **Fin de semaine** | La caravane de la guilde avance ; un boss-ouvrage clôt l'étape. |

- **Avantages** : sentiment de voyage ; équipement et talents prennent du sens ; beaucoup à dévoiler.
- **Inconvénients** : beaucoup de contenu ; davantage de décisions ; risque d'optimisation excessive.

### 8.3 Boucle C — « La Tablée »

| Moment | Ce qui se passe |
|---|---|
| **Avant** | Un hôte ouvre une tablée et affiche un QR code. |
| **Pendant** | Minuteur commun, pauses synchronisées. |
| **Après** | Coffre commun, remerciements pré-écrits. |
| **Fin de semaine** | Chantier de guilde : on restaure ensemble un lieu permanent. |

- **Avantages** : appartenance, présence mutuelle, vraie différenciation.
- **Inconvénients** : démarrage difficile sans amis ; serveur temps réel ; risque de culpabilité et de modération.

### 8.4 Comparaison et recommandation

| Critère | A | B | C |
|---|---|---|---|
| Charge de développement | Faible | Forte | Forte |
| Charge de contenu | Faible | Forte | Moyenne |
| Attention demandée | Très faible | Moyenne | Faible |
| Profondeur RPG | Faible | Forte | Moyenne |
| Lien social | Aucun | Moyen | Fort |
| Risque de culpabilité | Très faible | Faible | Moyen |

**Recommandation : A comme socle, B comme couche dévoilée progressivement, C comme module facultatif.**

1. **Lancement** : boucle A seule.
2. **À partir du niveau 8 environ** : la carte de la boucle B apparaît.
3. **Quand l'utilisateur le souhaite** : tablées et guildes privées, selon les règles de la section 5.4.

---

## 9. Proposition de classes

### 9.1 Principes

- Une classe = **une affinité de méthode** (bonus modeste) + **un rôle de groupe** (un verbe exclusif).
- **Toutes les méthodes restent ouvertes à toutes les classes.**
- **Choix différé** : la classe se choisit après une semaine d'apprentissage.
- **Changement libre** et peu coûteux.
- **Apprentissage croisé** : on peut apprendre une technique auprès d'une autre guilde.
- **Noms originaux**, sans reprise de noms propres de Grimgar.

### 9.2 Les sept classes

| Classe | Archétype | Affinité d'étude | Rôle de groupe | Technique signature | Garde-fou |
|---|---|---|---|---|---|
| **Rempart** | Guerrier | Créneaux planifiés et tenus | Sa régularité donne un socle à l'expédition | Créneau juré | Bonus lié au plan tenu, pas à la durée |
| **Éclaireur** | Voleur | Auto-test, annales, rappel actif | Trouve des indices partagés | Repérage des points faibles | Bonus modeste |
| **Arcaniste** | Mage | Fiches de mémoire, schémas, explication à voix haute | Expliquer à un camarade profite à tous | Explication | — |
| **Veilleur** | Prêtre | Pauses, sommeil, jours de repos | Offre un bouclier de série | Halte | Doit étudier pour pouvoir donner |
| **Pisteur** | Chasseur | Révisions espacées, alternance des matières | Trace l'itinéraire de la guilde | Piste | — |
| **Porte-lanterne** | Paladin | Sessions de groupe | Ouvre et anime les tablées | Lanterne | Récompense symbolique et plafonnée |
| **Attiseur** | Chevalier noir | Se lancer sur la tâche redoutée | Prend les contrats redoutés | Premier pas | Aucun bonus lié aux heures tardives |

### 9.3 Variantes

| Variante | Contenu | Avantage | Inconvénient |
|---|---|---|---|
| **Quatre classes au lancement** | Rempart, Éclaireur, Arcaniste, Veilleur | Simple, couvre les piliers | Moins de variété |
| **Sept classes** | Tableau complet | Fait écho aux sept guildes | Plus de contenu et d'équilibrage |
| **Rôles de groupe seuls** | Pas d'affinité de méthode | N'oriente pas les méthodes | Sans intérêt en solo |

**Recommandation** : quatre classes au lancement, les trois autres dévoilées ensuite.

---

## 10. Direction artistique : brief inspiré de Grimgar

### 10.1 Intention

Une aquarelle claire et calme, où le papier respire. Un monde modeste, vu de loin, à la lumière changeante. Rien d'épique, rien de sombre par défaut.

### 10.2 Palette proposée

Valeurs choisies par moi à partir des observations de la section 6.4. Ce ne sont pas des couleurs officielles. Les contrastes ont été calculés selon la formule WCAG.

**Fonds et texte**

| Nom | Hex | Usage | Contraste |
|---|---|---|---|
| Papier coton | `#F4EFE6` | Fond principal | — |
| Crépi crème | `#EADFC5` | Cartes, panneaux | — |
| Lavis gris perle | `#DAD7D2` | Séparateurs | — |
| Encre sépia | `#3B3632` | Texte principal | 10,4 sur papier ; 9,0 sur crème |
| Cendre | `#6B665F` | Texte secondaire | 5,0 sur papier |

**Ciel, végétation, chaleur, ombres**

| Nom | Hex | Usage | Contraste |
|---|---|---|---|
| Bleu brume | `#A9C4D6` | Ciels, repos | Encre dessus : 6,6 |
| Outremer délavé | `#4F6D9A` | Accent, grands éléments | 4,6 sur papier |
| Outremer profond | `#2F4A73` | Boutons pleins | Papier dessus : 7,8 |
| Sauge | `#9DB08E` | Progression douce | Encre dessus : 5,1 |
| Turquoise feuillage | `#4FA39A` | Jauges | Décor |
| Vert mousse foncé | `#3F5F45` | Texte de réussite | 6,3 sur papier |
| Or du couchant | `#E9B44C` | Récompenses, fraîcheur | Encre dessus : 6,3 |
| Terre cuite | `#B5654A` | Accent chaud, décor | 3,7 : pas pour du petit texte |
| Terre cuite foncée | `#8E4A35` | Texte d'accent chaud | 5,8 sur papier |
| Lavande d'ombre | `#8A7FA8` | Ombres colorées | Décor |
| Prune | `#5B4A6B` | Ombres profondes, texte d'accent | 7,0 sur papier |
| Rouge de lune | `#C8443C` | Très rare : objets d'exception | 4,2 : grands éléments seulement |

**Mode nuit**

| Nom | Hex | Usage | Contraste |
|---|---|---|---|
| Nuit sarcelle | `#16403F` | Fond de nuit | Papier dessus : 10,0 ; or dessus : 6,0 |
| Encre de nuit | `#1E2A33` | Fond sombre alternatif | Papier dessus : 12,8 |

Règles : jamais de noir pur, jamais de blanc pur ; le rouge ne signale jamais une faute.

### 10.3 Textures

- Grain de papier aquarelle, discret.
- Lavis aux bords irréguliers ; auréoles ; pigment qui granule.
- Blancs laissés en réserve pour les lumières.
- Illustrations qui s'estompent vers le papier au lieu de remplir l'écran.
- Mouchetis pour les étoiles et les cendres.

### 10.4 Lumière et composition

- Quatre ambiances selon l'heure réelle : matin clair, heure dorée, heure bleue, nuit sarcelle.
- Ombres colorées, halos doux.
- Grands paysages, horizon haut, petites silhouettes de dos.
- Lointains qui bleuissent et pâlissent.

### 10.5 Typographie

| Usage | Direction | Exemples libres |
|---|---|---|
| Titres | Sérif d'inspiration calligraphique | Alegreya, Cormorant |
| Texte et interface | Sans-sérif très lisible | Inter |
| Chiffres du minuteur | Chiffres à largeur fixe | Inter |
| Notes de journal | Écriture manuscrite, avec parcimonie | À choisir |

À éviter : gothique, faux médiéval, capitales ornées.

### 10.6 Motifs d'interface

| Motif | Usage |
|---|---|
| Feu de camp | Écran d'accueil ; la flamme reflète la fraîcheur |
| Carnet de route | Journal des sessions |
| Tableau de contrats | Quêtes facultatives, qui ne reprochent rien |
| Sceau de cire | Validation d'une semaine |
| Lanterne | Hôte d'une tablée |
| Carte aquarellée | Destinations, itinéraire en pointillés |
| Étiquettes de papier | Boutons |
| Lavis qui se remplit | Jauges |
| Cendres en suspension | Transition de fin de semestre |

**Emblème** : créer un symbole propre (braise, lanterne). Éviter la pièce à croissant rouge.

### 10.7 Mouvement et son

- Mouvements lents, jamais de clignotement ni de compte à rebours anxiogène.
- Respect du réglage système de réduction des animations.
- Son facultatif et coupé par défaut.

---

## 11. Risques de game design

### 11.1 Les trois principaux

| Risque | Signes | Parades |
|---|---|---|
| **1. La couche de jeu capte l'attention ou dévoie la mesure** | Minuteur lancé sans travailler ; optimisation au tableur ; menus consultés pendant l'étude | Zéro interaction en session ; budget de décisions ; aucun classement ; optimum du jeu aligné sur le comportement sain |
| **2. La dimension sociale crée culpabilité et charge de modération** | Membres qui s'excusent ; départs silencieux ; messages à modérer | Groupes privés ; interactions fermées ; contribution relative à soi ; aucune sanction collective |
| **3. Le périmètre dépasse un développeur solo** | Systèmes à moitié finis ; équilibrage impossible ; incohérence graphique | Boucle A d'abord ; quatre classes ; bonus plafonnés ; silhouettes et lavis |

Sources d'appui : `[GEORGESCU]` `[APPSTORE-FRPG]` `[STI-FOREST]` pour le premier ; `[HAB-FAQ]` `[DIEFENBACH]` `[FOREST-SITE]` `[COOK-KIND]` pour le deuxième ; `[PECORELLA-GDC]` `[WIKT-CREEP]` pour le troisième.

### 11.2 Risques secondaires

- **Surjustification** : la récompense peut remplacer le goût d'apprendre `[WIKI-OVERJUST]`.
- **Usure de la nouveauté** en semaines 3-4 `[STI-FOREST]`.
- **Exclusion** si les raids sont réservés au présentiel.
- **Proximité excessive avec Grimgar** (section 7).
- **Bonus de méthode déclaratif**, donc contournable.
- **Épuisement par un jeu « doux »** `[SLATE-FINCH]`.

---

## 12. Ce que je n'ai pas pu vérifier

| Sujet | État |
|---|---|
| Texte complet de Diefenbach et Müssig (liste des sept effets) | Résumé seul |
| Chiffres de rétention de la conférence de Pecorella | Graphiques sans valeurs lisibles |
| Taux de rétention de 42 % au premier jour cité par `[MINDSTUDIOS]` | Non sourcé par l'article |
| Article « If all is cozy, what isn't? » (Tilburg) | Inaccessible |
| Articles « Playing to Wait » et « It Started as a Joke » | Inaccessibles |
| Deuxième partie de *The Math of Idle Games* | Page non servie |
| Wiki WalkScape : équipement, groupes, absence de GPS | Bloqué ; extrait seulement |
| Habitica : classes au niveau 10 ; dégâts pour les non-participants | Extrait seulement ; non vérifié |
| Pokémon Sleep : cycle hebdomadaire, calcul de la régularité | Extrait seulement |
| Date de `[GEORGESCU]` | L'adresse indique 2025 ; date affichée incohérente |
| Date de la lettre `[MHN-DEVLETTER]` | Absente de la page |
| Date de lancement de Party Play (17 octobre 2023) | Extrait seulement |
| Duolingo : trois gels équivalents à deux | Extrait seulement |
| Grimgar : montants en pièces, durée de formation | Wiki de fans, extrait seulement |
| Grimgar : technique des décors (main ou numérique) | Non trouvé |
| Grimgar : entretien de Nakamura ou Kaneko sur le style | Aucun trouvé ; un entretien japonais inaccessible |
| Grimgar : auteur du visuel officiel, couvertures des romans | Non vérifié, non observé |
| Lecture du nom du responsable des couleurs | Non vérifiée |
| Statut de marque de « Grimgar » et de « Lexile » | Non vérifié |
| Articles de PC Gamer sur le rejet de l'IA | Contenu illisible |
| Règle de déclaration d'IA de Valve | Page illisible |
| Droit d'auteur des images générées en France et en Europe | Non recherché |
| Compatibilité Safari de Web Bluetooth | Tableau non lu |
| Performance des filtres SVG sur iPhone | Aucune source |
| Applications d'étude en groupe (Yeolpumta, StudyStream) | Non recherché, quota atteint |
| Forest : études d'efficacité | Aucune trouvée |

---

## 13. Sources

Sauf mention contraire, les pages ont été lues directement les 29 et 30 septembre 2026.

### 13.1 Applications alimentées par une activité réelle

| Clé | Référence | Adresse |
|---|---|---|
| `[HAB-FAQ]` | Habitica, FAQ officielle (fichier source du dépôt) | https://raw.githubusercontent.com/HabitRPG/habitica/develop/website/common/locales/en/faq.json |
| `[HAB-LFP]` | Habitica, « Look for a Party and Find Members », 3 mai 2023 | https://blog.habitrpg.com/post/716313390225702912/new-feature-look-for-a-party-and-find-members |
| `[HAB-GUIDE]` | Habitica, « A Guide for Beginning Adventurers » | https://habitica.wordpress.com/beginning-adventurers-guide/ |
| `[HAB-ROGUE]` | Habitica, « Making the Most of the Rogue Class », 29 août 2019 | https://habitica.wordpress.com/2019/08/29/use-case-spotlight-making-the-most-of-the-rogue-class/ |
| `[HAB-ISSUE]` | GitHub, ticket 3161, 27 mars 2014 | https://github.com/HabitRPG/habitica/issues/3161 |
| `[WIKI-HABITICA]` | Wikipédia (en), « Habitica » | https://en.wikipedia.org/wiki/Habitica |
| `[DIEFENBACH]` | Diefenbach et Müssig, *Int. J. Human-Computer Studies* 127, 2019 (notice) | https://epub.ub.uni-muenchen.de/77668/ |
| `[WALKSCAPE-SITE]` | WalkScape, site officiel | https://walkscape.app/ |
| `[WALKSCAPE-CBT]` | WalkScape, « CBT Deep Dive #1 » | https://portal.walkscape.app/post/216 |
| `[WALKSCAPE-DEV]` | WalkScape, carnets de développement | https://portal.walkscape.app/development |
| `[MISTYWAY]` | MistyWay (blog d'éditeur), 10 mars 2026 | https://mistyway.app/blog/walking-rpg-apps |
| `[WIKI-PSLEEP]` | Wikipédia (en), « Pokémon Sleep » | https://en.wikipedia.org/wiki/Pok%C3%A9mon_Sleep |
| `[NLIFE-PSLEEP]` | Nintendo Life, J. Merrick, 25 juillet 2023 | https://www.nintendolife.com/reviews/mobile/pokemon-sleep |
| `[GEORGESCU]` | M. Georgescu, « Min-Maxing Sleep » | https://www.marygeorgescu.com/blog/2025/7/12/how-far-is-too-far-evaluating-pokmon-sleeps-design-tracking-and-monetization |
| `[WIKI-PIKMIN]` | Wikipédia (en), « Pikmin Bloom » | https://en.wikipedia.org/wiki/Pikmin_Bloom |
| `[PIKMIN-HELP]` | Centre d'aide, « Weekly Challenges » | https://niantic.helpshift.com/hc/en/23-pikmin-bloom/faq/3404-weekly-challenges/ |
| `[PIKIPEDIA-WEEKLY]` | Pikipedia, « Weekly challenge » | https://www.pikminwiki.com/Weekly_challenge |
| `[PIKMIN-PARTYWALK]` | Pikmin Bloom, annonce Party Walk, juin 2024 | https://pikminbloom.com/en/news/june24-partywalk |
| `[PIKIPEDIA-PARTY]` | Pikipedia, « Party Walk » | https://www.pikminwiki.com/Party_Walk |
| `[WIKI-MHN]` | Wikipédia (en), « Monster Hunter Now » | https://en.wikipedia.org/wiki/Monster_Hunter_Now |
| `[MHN-LAUNCH]` | Monster Hunter Now, annonce de lancement | https://monsterhunternow.com/en/news/launch |
| `[MHN-DEVLETTER]` | Monster Hunter Now, « Group Hunt Updates » | https://monsterhunternow.com/news/devletter-050126 |
| `[DEXERTO-MHN]` | Dexerto, 28 septembre 2023 | https://www.dexerto.com/gaming/how-to-play-multiplayer-in-monster-hunter-now-add-friends-2293177/ |
| `[POGO-PARTY]` | Pokémon GO, « Party Play » | https://pokemongo.com/en/partyplay |
| `[POGO-REMOTE]` | Pokémon GO, « Updates to Remote Raids », 2023 | https://pokemongo.com/post/remote-raid-passes-update-2023/ |
| `[POGOHUB]` | Pokémon GO Hub, avril 2023 | https://pokemongohub.net/post/news/remote-raids-nerf/ |
| `[THEGAMER-RAIDS]` | TheGamer, E. Switzer, 2 juin 2022 | https://www.thegamer.com/pokemon-go-remote-raid-pass-nerf-improvements-in-person-raid/ |
| `[WIKI-POGO]` | Wikipédia (en), « Pokémon Go » | https://en.wikipedia.org/wiki/Pok%C3%A9mon_Go |
| `[WIKI-ZR]` | Wikipédia (en), « Zombies, Run! » | https://en.wikipedia.org/wiki/Zombies,_Run! |
| `[ZR-ABOUT]` | Zombies, Run!, page officielle | https://zombiesrungame.com/about |
| `[FINCH-SITE]` | Finch, site officiel | https://finchcare.com/ |
| `[SLATE-FINCH]` | Slate, S. J. Li, 6 septembre 2026 | https://slate.com/technology/2026/09/finch-app-self-care-wellness-review.html |
| `[PRATT-FINCH]` | IXD@Pratt, M. Benyamin, 17 février 2026 | https://ixd.prattsi.org/2026/02/design-critique-finch-self-care-pet-ios-app/ |
| `[TC-FF1]` | TechCrunch, 18 août 2025 | https://techcrunch.com/2025/08/18/hank-greens-focus-friend-app-is-climbing-the-app-store-charts-and-its-extremely-cute |
| `[TC-FF2]` | TechCrunch, 18 novembre 2025 | https://techcrunch.com/2025/11/18/hank-greens-focus-friend-is-google-plays-app-of-the-year |
| `[SCARYMOMMY-FF]` | Scary Mommy, S. Darby, 18 août 2025 | https://www.scarymommy.com/lifestyle/hank-green-focus-friend-best-productivity-app |
| `[BECKSVOICE-FF]` | Becksvoice, R. H. Lee, 21 août 2025 | https://becksvoice.com/i-tried-hank-greens-new-focus-app-here-are-my-thoughts/ |
| `[FOREST-SITE]` | Forest, site officiel | https://www.forestapp.cc/ |
| `[WIKI-FOREST]` | Wikipédia (en), « Forest (application) » | https://en.wikipedia.org/wiki/Forest_(application) |
| `[STI-FOREST]` | Screen Time Index, 18 juillet 2026 | https://screentimeindex.com/posts/forest-app-review/ |
| `[CALMEVO-FOREST]` | Calmevo, 2026 | https://www.calmevo.com/forest-app-review/ |
| `[ELEVENAPRIL]` | ElevenApril (blog d'éditeur), 17 juin 2026 | https://elevenapril.com/blog/focus-train-vs-forest |
| `[FOCUMON]` | Focumon, site officiel | https://www.focumon.com/ |
| `[STEAM-SPIRIT]` | Steam, Spirit City: Lofi Sessions | https://store.steampowered.com/app/2113850/Spirit_City_Lofi_Sessions/ |
| `[BW-SPIRIT]` | Blizzard Watch, A. Bell, 31 octobre 2024 | https://blizzardwatch.com/2024/10/31/spirit-city-lofi/ |
| `[GAMEGRIN-SPIRIT]` | GameGrin, V. Plata, 17 août 2024 | https://www.gamegrin.com/articles/my-experiences-using-spirit-city-lofi-sessions-a-productivity-tool/ |
| `[STEAM-CHILL]` | Steam, Chill Pulse | https://store.steampowered.com/app/2826180/Chill_Pulse/ |
| `[WIKI-RUSTY]` | Wikipédia (en), « Rusty's Retirement » | https://en.wikipedia.org/wiki/Rusty%27s_Retirement |
| `[GP-RUSTY]` | Gamepressure, 29 avril 2024 | https://www.gamepressure.com/newsroom/what-is-focus-mode-in-rustys-retirement-answered/z56ce7 |
| `[WIKI-RINGFIT]` | Wikipédia (en), « Ring Fit Adventure » | https://en.wikipedia.org/wiki/Ring_Fit_Adventure |
| `[THEGAMER-RINGFIT]` | TheGamer, T. Jurkovich, 23 octobre 2019 | https://www.thegamer.com/ring-fit-adventure-wish-knew-before-starting/ |
| `[APPSTORE-FRPG]` | App Store, Fitness RPG (Shikudo) | https://apps.apple.com/us/app/fitness-rpg-hero-health-game/id1252580641 |
| `[WIKI-NEKO]` | Wikipédia (en), « Neko Atsume » | https://en.wikipedia.org/wiki/Neko_Atsume |
| `[WIKI-ACNH]` | Wikipédia (en), « Animal Crossing: New Horizons » | https://en.wikipedia.org/wiki/Animal_Crossing:_New_Horizons |
| `[WIKI-STREETPASS]` | Wikipédia (en), « StreetPass » | https://en.wikipedia.org/wiki/StreetPass |

### 13.2 Idle et incrémental

| Clé | Référence | Adresse |
|---|---|---|
| `[PECORELLA-GDC]` | A. Pecorella, conférence GDC 2015 (texte des diapositives) | https://archive.org/details/GDC2015Pecorella |
| `[PECORELLA-GDC-VAULT]` | Même conférence, GDC Vault | https://www.gdcvault.com/play/1022065/Idle-Games-The-Mechanics-and |
| `[PECORELLA-MATH1]` | A. Pecorella, « The Math of Idle Games, Part I », 13 octobre 2016 | https://www.gamedeveloper.com/design/the-math-of-idle-games-part-i |
| `[PECORELLA-MATH3]` | A. Pecorella, « Part III », 1er février 2017 | https://www.gamedeveloper.com/design/the-math-of-idle-games-part-iii |
| `[KING-WHY]` | A. King, « What Are Incremental Games… », 22 mai 2015 | https://code.tutsplus.com/numbers-getting-bigger-what-are-incremental-games-and-why-are-they-fun--cms-23925a |
| `[KING-MATH]` | A. King, « The Design and Math of Incremental Games », 30 juin 2015 | https://code.tutsplus.com/numbers-getting-bigger-the-design-and-math-of-incremental-games--cms-24023a |
| `[KING-EVEN]` | A. King, « Numbers Getting Even Bigger », 13 septembre 2016 | https://code.tutsplus.com/numbers-getting-even-bigger--cms-26854a |
| `[WIKI-INCREMENTAL]` | Wikipédia (en), « Incremental game » | https://en.wikipedia.org/wiki/Incremental_game |
| `[MINDSTUDIOS]` | Mind Studios Games, 19 avril 2024 | https://games.themindstudios.com/post/idle-clicker-game-design-and-monetization/ |
| `[ANTONOVS]` | E. Antonovs, 2 novembre 2025 | https://edvins.io/rebuilding-the-welcome-back-mechanic-from-idle-games-in-react |
| `[MACHINATIONS]` | Machinations.io, « How to design idle games » | https://machinations.io/articles/idle-games-and-how-to-design-them |

### 13.3 Cozy, bienveillance, social

| Clé | Référence | Adresse |
|---|---|---|
| `[COOK-COZY]` | D. Cook et al., « Cozy Games », 24 janvier 2018 | https://lostgarden.com/2018/01/24/cozy-games/ |
| `[SHORT-COZY]` | T. X. Short et al., « Designing for Coziness », 5 mars 2018 | https://www.gamedeveloper.com/design/designing-for-coziness |
| `[ONNBERG]` | M. Önnberg, mémoire de master, université de Skövde, 2024 | https://www.diva-portal.org/smash/get/diva2:1881616/FULLTEXT01.pdf |
| `[COOK-KIND]` | D. Cook et al., « Kind Games », 2022, republié le 8 juillet 2023 | https://lostgarden.com/2023/07/08/kind-games-designing-for-prosocial-multiplayer/ |
| `[COOK-FRIENDS]` | D. Cook et al., « Game design patterns for building friendships », 27 janvier 2017 | https://lostgarden.com/2017/01/27/game-design-patterns-for-building-friendships/ |
| `[WIKI-JOURNEY]` | Wikipédia (en), « Journey » | https://en.wikipedia.org/wiki/Journey_(2012_video_game) |
| `[WIKI-DS]` | Wikipédia (en), « Death Stranding » | https://en.wikipedia.org/wiki/Death_Stranding |
| `[WIKI-SKY]` | Wikipédia (en), « Sky: Children of the Light » | https://en.wikipedia.org/wiki/Sky:_Children_of_the_Light |
| `[WIKI-HD2]` | Wikipédia (en), « Helldivers 2 » | https://en.wikipedia.org/wiki/Helldivers_2 |
| `[WIKI-LOAFING]` | Wikipédia (en), « Social loafing » | https://en.wikipedia.org/wiki/Social_loafing |
| `[WIKI-KOHLER]` | Wikipédia (en), « Köhler effect » | https://en.wikipedia.org/wiki/Kohler_effect |
| `[WIKI-BODYDOUBLE]` | Wikipédia (en), « Body doubling » | https://en.wikipedia.org/wiki/Body_doubling |
| `[MDN-BLUETOOTH]` | MDN, « Web Bluetooth API » | https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API |

### 13.4 Économie de la progression

| Clé | Référence | Adresse |
|---|---|---|
| `[MADIGAN]` | J. Madigan, « Framing and World of Warcraft's Rest System », 16 mars 2010 | https://www.psychologyofgames.com/2010/03/framing-and-world-of-warcrafts-rest-system/ |
| `[WOWWIKI-REST]` | Warcraft Wiki, « Rest » | https://warcraft.wiki.gg/wiki/Rest |
| `[DUO-2017]` | Duolingo, K. H. Loh, 10 mai 2017 | https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/ |
| `[DUO-2022]` | Duolingo, O. Mansur, 31 janvier 2022 | https://blog.duolingo.com/how-duolingo-streak-builds-habit |
| `[DUO-FRIEND]` | Duolingo, « Friend Streak », 5 août 2024 | https://blog.duolingo.com/friend-streak/ |
| `[LENNY-DUO]` | Lenny's Newsletter, 15 décembre 2024 | https://www.lennysnewsletter.com/p/behind-the-product-duolingo-streaks |
| `[UXMAG]` | UX Magazine, M. Singman, 14 octobre 2025 | https://uxmag.com/articles/the-psychology-of-hot-streak-game-design-how-to-keep-players-coming-back-every-day-without-shame |
| `[COOK-VALUE]` | D. Cook, « Value chains », 12 décembre 2021 | https://lostgarden.com/2021/12/12/value-chains/ |
| `[WIKI-XP]` | Wikipédia (en), « Experience point » | https://en.wikipedia.org/wiki/Experience_point |
| `[WIKT-CREEP]` | Wiktionnaire (en), « power creep » | https://en.wiktionary.org/wiki/power_creep |
| `[GW2-MASTERY]` | Guild Wars 2 Wiki, « Mastery » | https://wiki.guildwars2.com/wiki/Mastery |
| `[WIKI-DDA]` | Wikipédia (en), « Dynamic game difficulty balancing » | https://en.wikipedia.org/wiki/Dynamic_game_difficulty_balancing |
| `[WIKI-OVERJUST]` | Wikipédia (en), « Overjustification effect » | https://en.wikipedia.org/wiki/Overjustification_effect |
| `[WIKI-GAMIFICATION]` | Wikipédia (en), « Gamification » | https://en.wikipedia.org/wiki/Gamification |

### 13.5 Grimgar

| Clé | Référence | Adresse |
|---|---|---|
| `[A1-GRIMGAR]` | A-1 Pictures, page officielle de la série | https://a1p.jp/works/grimgar/ |
| `[WIKI-GRIMGAR-EN]` | Wikipédia (en), « Grimgar of Fantasy and Ash » | https://en.wikipedia.org/wiki/Grimgar_of_Fantasy_and_Ash |
| `[WIKI-GRIMGAR-JA]` | Wikipédia (ja), « 灰と幻想のグリムガル » | https://ja.wikipedia.org/wiki/%E7%81%B0%E3%81%A8%E5%B9%BB%E6%83%B3%E3%81%AE%E3%82%B0%E3%83%AA%E3%83%A0%E3%82%AC%E3%83%AB |
| `[ANN-KANEKO]` | Anime News Network, fiche « Hidetoshi Kaneko » | https://www.animenewsnetwork.com/encyclopedia/people.php?id=2842 |
| `[ANN-BWCA]` | Anime News Network, fermeture de l'Atelier BWCA, 6 février 2017 | https://www.animenewsnetwork.com/news/2017-02-06/art-studio-atelier-bwca-closes-due-to-director-health/.111867 |
| `[ANN-DEATH]` | Anime News Network, R. Silverman, 24 février 2016 | https://www.animenewsnetwork.com/feature/2016-02-24/grimgar-of-fantasy-and-ash-and-the-consequences-of-death/.98975 |
| `[ANN-STAFF]` | Anime News Network, annonce de l'équipe, 4 novembre 2015 | https://www.animenewsnetwork.com/news/2015-11-04/grimgar-of-fantasy-and-ash-anime-reveals-cast-character-designs/.95008 |
| `[OPUS]` | Opus, J. Morehead, 31 janvier 2018 | https://opus.ing/posts/beautiful-world-grimgar-fantasy-ash |
| `[CBR-GRIMGAR]` | CBR, D. Phillips, 10 mars 2026 | https://www.cbr.com/most-underrated-isekai-anime-grimgar-ashes-and-illusions/ |
| `[NOTE-GRIMGAR]` | note, 空想世界研究所, 2 juillet 2026 | https://note.com/fantasyworld_lab/n/ne900563ae70f?hl=en |
| `[LAETHAS]` | Laethas's Anime Blog, 15 février 2017 | https://laethas.wordpress.com/2017/02/15/the-effects-of-grief-and-dealing-with-loss-grimgar-of-fantasy-and-ash-a-full-review/ |
| `[FANDOM-GRIMGAR]` | Wiki de fans, page « Guilds » (**extrait seulement**) | https://grimgar.fandom.com/wiki/Guilds |

### 13.6 Propriété intellectuelle et direction artistique

| Clé | Référence | Adresse |
|---|---|---|
| `[ODINLAW]` | Odin Law and Media, V. Cruz, 3 septembre 2025 | https://odinlaw.com/blog-fan-games-legal-risks/ |
| `[JURISEXPERT]` | Jurisexpert, B. Poidevin, 20 mai 2019 | https://www.jurisexpert.net/quelle-distinction-lidee-libre-parcours-oeuvre-protegee/ |
| `[KOHEN]` | Kohen Avocats, R. Kohen, 14 août 2026 | https://kohenavocats.fr/2026/08/14/jeu-video-protection-originalite-gameplay-interfaces-graphiques-contrefacon-concurrence-deloyale-parasitisme-prescription-jurisprudence-2023-2026/ |
| `[MONOLITH]` | Monolith Law Office, 25 août 2023 | https://monolith.law/en/internet/character-copyright-law |
| `[ANN-LAW]` | Anime News Network, S. Thordsen, 15 février 2013 | https://www.animenewsnetwork.com/feature/the-law-of-anime/2013-02-15/2 |
| `[JONESDAY]` | Jones Day, février 2025 | https://www.jonesday.com/en/insights/2025/02/copyrightability-of-ai-outputs-us-copyright-office-analyzes-human-authorship-requirement |
| `[RIMON]` | Rimon Law, 7 février 2025 | https://www.rimonlaw.com/u-s-copyright-office-will-accept-ai-generated-work-for-registration-when-and-if-it-embodies-meaningful-human-authorship/ |
| `[GAMERANT-AI]` | GameRant, C. Adams, 26 juin 2026 | https://gamerant.com/steam-indie-games-ai-generated-content-discoverability/ |
| `[MDN-TURBULENCE]` | MDN, « feTurbulence » | https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence |
| `[MDN-DISPLACEMENT]` | MDN, « feDisplacementMap » | https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feDisplacementMap |
| `[MDN-BLEND]` | MDN, « mix-blend-mode » | https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode |
| `[GAMMON]` | B. Gammon, 3 mai 2024 | https://bengammon.co.uk/rough-css-borders-with-svg-filters/ |
| `[OGA-WATERCOLOR]` | OpenGameArt, « CC0 Watercolor Textures », 25 mai 2025 | https://opengameart.org/content/cc0-watercolor-textures |
| `[OGA-COLLECTION]` | OpenGameArt, collection « CC0 Textures » | https://opengameart.org/content/cc0-textures-0 |
| `[KENNEY]` | Kenney, page d'assistance (licence) | https://kenney.nl/support |
| `[CC0]` | Creative Commons, CC0 1.0 (résumé en français) | https://creativecommons.org/publicdomain/zero/1.0/deed.fr |
| `[FONT-ALEGREYA]` | Alegreya, dépôt officiel | https://github.com/huertatipografica/Alegreya |
| `[FONT-CORMORANT]` | Cormorant, dépôt officiel | https://github.com/CatharsisFonts/Cormorant |
| `[FONT-INTER]` | Inter, dépôt officiel | https://github.com/rsms/inter |

### 13.7 Contexte interne au projet (hors web)

| Élément | Emplacement |
|---|---|
| Formule d'XP candidate et simulation sur six profils | `docs/simulations/01-formule-xp.R` |
| Bilan de la simulation | `docs/simulations/01-formule-xp-bilan.csv` |
