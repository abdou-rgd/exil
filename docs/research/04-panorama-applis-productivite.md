# 04 — Panorama des applications de productivité et d'étude

**Recherche menée les 29 et 30 septembre 2026.**
**Objet :** situer le projet (PWA gratuite qui transforme le temps de révision en progression RPG, coopérative, sans classement entre personnes) dans le paysage des applications de concentration et d'étude, et en tirer des décisions concrètes.

---

## 0. Méthode, niveaux de confiance et limites

### Ce qui a été fait

Recherche web réelle : sites officiels, fiches App Store (boutiques US et France), presse (TechCrunch, Slate, The Globe and Mail, heise), entretiens de fondateurs, média étudiant, sites de tutorat et de prépas santé, documentation technique (WebKit, Supabase, Vercel), littérature scientifique (PubMed et revues d'IHM).

### Légende de confiance utilisée dans tout le rapport

| Marque | Signification |
|---|---|
| **[V]** | Vérifié sur source primaire ouverte pendant la recherche (site officiel, fiche de boutique, documentation, article scientifique) |
| **[S]** | Source secondaire (article de presse, comparatif, extrait de moteur de recherche) |
| **[C]** | Source publiée par un concurrent : utile mais biaisée |
| **[E]** | Estimation ou raisonnement de l'auteur de ce rapport, pas un fait sourcé |
| **[NV]** | Non vérifié : à confirmer avant de s'en servir |

### Limites à connaître avant de lire

1. **Reddit était inaccessible** depuis les outils utilisés (blocage technique). Les avis Reddit ne sont donc cités qu'indirectement, via des articles qui les reprennent. Aucun fil r/etudiants n'a pu être lu.
2. **TikTok et YouTube sont illisibles** par ces outils (pages rendues en JavaScript). Aucune vidéo francophone n'a pu être vérifiée.
3. **Le budget de recherches a été épuisé en cours de route.** La suite du travail a consisté à ouvrir des pages déjà identifiées. Plusieurs vérifications prévues n'ont pas pu être faites (liste en section 13).
4. **Le moteur de recherche est centré sur les États-Unis** : les sources francophones sont sous-représentées.
5. **Les pages ont été lues par un résumeur automatique.** Les chiffres doivent être recontrôlés à la source avant toute publication.
6. **Les notes des boutiques sont propres à chaque pays** et arrondies.
7. Ce rapport ne constitue pas un avis juridique (passages sur le DSA et le RGPD).

---

## 1. Synthèse en dix points

1. **Le marché est saturé de minuteurs « à enjeu affectif »** (arbre, haricot, lapin) et de chronos sociaux à classement. Ce n'est pas là qu'il faut se battre.
2. **Les deux analogues les plus proches du projet sont Focumon et Habitica.** Focumon est une PWA gratuite, multijoueur, avec monstres et boss mensuel ; Habitica a inventé les boss de groupe alimentés par l'effort collectif. Leurs difficultés sont les leçons les plus utiles de ce rapport.
3. **La combinaison « coopératif + aucun classement + récompense de la méthode » n'a été trouvée nulle part.** Chaque brique existe séparément ; l'assemblage est rare.
4. **L'analytique personnelle n'est pas rare, mais elle est payante** : Athenify facture 12,99 $/mois pour la carte de chaleur, le profil horaire et la répartition par matière.
5. **La diffusion de YPT chez les étudiants français en santé n'a pas pu être confirmée par des sources publiques.** Les listes des tutorats citent Forest, Study Bunny et Plantie, pas YPT. C'est le point le plus important à vérifier sur le terrain.
6. **Les effets négatifs des classements d'heures sont documentés, mais hors de France** (Singapour, Corée) et dans la littérature scientifique.
7. **Les espaces sociaux publics coûtent plus qu'ils ne rapportent** : Habitica a supprimé ses guildes et sa taverne en 2023 ; le fondateur de Focumon cite la modération comme frein à la croissance.
8. **Une PWA sur iPhone ne peut pas bloquer d'applications** et son code est suspendu en arrière-plan. Le projet doit reposer sur la confiance, pas sur la contrainte, ce qui est cohérent avec sa philosophie.
9. **Jusqu'à environ 500 utilisateurs, le coût d'hébergement est proche de zéro**, avec un piège : la mise en pause des projets Supabase gratuits après une semaine d'inactivité, probable pendant les vacances d'été.
10. **La rétention est le vrai risque** : les références du secteur situent la rétention à 30 jours autour de 8 à 10 % pour les applis de productivité.

---

## 2. Tableau comparatif

Les prix sont ceux relevés sur les fiches de boutique ou sites officiels fin septembre 2026. « Notes » = nombre d'évaluations sur la boutique indiquée.

### 2.1 Minuteurs à enjeu affectif

| Appli | Mécanique centrale | Social | Analytique | Modèle économique | Échelle | Plateforme | Éloges récurrents | Reproches récurrents |
|---|---|---|---|---|---|---|---|---|
| **Forest** (Seekrtech, 2014) | Un arbre pousse pendant la session et meurt si l'on quitte ; mode de blocage d'applis | Sessions à plusieurs où toute la forêt tombe si une personne abandonne ; amis et classement | Étiquettes, tendances jour/semaine/mois (une partie réservée à l'abonnement) | Gratuit avec pubs hors session + abonnement Forest Plus (France : 6,99 €/mois, 37,49 à 41,99 €/an). Ancien achat unique supprimé pour les nouveaux (déc. 2025) [V] | 60 M+ téléchargements revendiqués, 2,1 M d'arbres réels [V] ; France : 4,8/5, env. 11 000 notes, n° 62 Productivité [V] | Natif iOS/Android + extensions navigateur | Simple, beau, fiable dans la durée, aide en cas de TDAH | L'effet de nouveauté s'use en 1 à 2 mois ; fonctions passées derrière l'abonnement ; contrainte faible sans blocage |
| **Flora** (AppFinca, 2017) | Arbre + pari d'argent optionnel sur la réussite de la session | Sessions de groupe par QR code ou code ; si l'hôte abandonne, tout le monde perd son arbre | Basique | Gratuit sans pub ; options payantes (arbres réels 9,99 $/an, circuits 0,99 à 1,99 €) [V] | France : 4,8/5, env. 1 800 notes [V] ; téléchargements [NV] | Natif iOS/Android | Gratuit, sans pub, motivant entre amis | Statistiques non sauvegardées sur serveur (perdues à la réinstallation) ; mécanique de groupe jugée trop punitive ; arbres réels payants [S] |
| **Focus Friend** (Hank Green / Honey B Games, été 2025) | Un haricot tricote pendant la session ; il est triste et la récompense est perdue si l'on part ; on décore ses pièces | Aucun | Minimale | Gratuit, sans pub ; Pro 3,99 $/mois, 19,99 $/an, 39,99 $ à vie ; apparences 2,99 à 5,99 $ [V] | N° 1 App Store US en août 2025 ; 1 M+ installations Android ; appli de l'année Google Play 2025 [V] ; France : env. 142 notes, anglais uniquement [V] | Natif iOS/Android | Attachement au personnage, ton doux, pas de pub | Contenu épuisé une fois la décoration finie ; conflits entre bloqueurs ; pas de traduction française |
| **Study Bunny** (SuperByte) | Le temps d'étude rapporte des pièces pour personnaliser un lapin ; listes, fiches, « mode honnête » | Non identifié | Historique et graphiques simples | Gratuit avec pubs ; achats de monnaie ; lots « sans pub » à 14,99 à 19,99 $ [V] | 8,6 M téléchargements Android [S] ; US : 4,7/5, 22 000 notes ; France : env. 2 900 notes [V] ; dernière mise à jour iOS : 16 déc. 2024 [V] | Natif iOS/Android | Mignon, motivant, complet | Trop de publicités, y compris après paiement ; bugs de synchronisation ; peu de nouveautés |

### 2.2 Chronos sociaux à classement

| Appli | Mécanique centrale | Social | Analytique | Modèle économique | Échelle | Plateforme | Éloges récurrents | Reproches récurrents |
|---|---|---|---|---|---|---|---|---|
| **YPT / Yeolpumta** (Pallo, Corée) | Chronomètre par matière ; le chrono s'arrête si l'on quitte l'appli | Groupes avec statut en direct ; classement en temps réel par catégorie | Statistiques jour/semaine/mois, durée maximale d'affilée, pauses | Gratuit ; premium (France : 2,99 à 5,99 €/mois, 34,99 €/an) ; monnaie « flammes » [V] | 5 M de personnes revendiquées [V] ; 6,9 à 7,4 M téléchargements Android [S] ; n° 2 Éducation en Corée et à Taïwan [S] ; **France : env. 127 notes** [V] | Natif iOS/Android | Présence en direct des camarades, suivi par matière | Instabilité serveur, régressions d'interface, heures extrêmes, heures falsifiées [S] |
| **Flipd** (Toronto, 2015) | Minuteur de concentration ; ex-verrouillage du téléphone | Salles d'étude en direct, classements mondiaux, défis | Calendrier de progression | Abonnement 5,99 à 9,99 $/mois, 39,99 à 49,99 $/an [V] | 350 000 utilisateurs en juin 2018 [S] ; 1 M revendiqué en 2019 [S] | Natif iOS/Android | Simple, salles communes | Sessions longues passées derrière l'abonnement ; dernière mise à jour iOS en février 2025 [V] |
| **Focus To-Do** | Pomodoro + gestionnaire de tâches | Classement mentionné sur la fiche [NV] | Rapports détaillés, tendances | 1,99 $/mois ou 11,99 $ à vie [V] | US : 4,8/5, 15 000 notes [V] | Natif multi-plateforme | Prix jugé honnête | Synchronisation, support lent |
| **Opal** | Blocage d'applis via l'API Temps d'écran ; score de concentration | Classement entre amis | Score quotidien, temps économisé | 19,99 $/mois, 99,99 $/an, 399 $ à vie ; remise étudiante [V] | US : 4,7/5, env. 89 000 notes [V] | Natif iOS | Blocage efficace | Prix élevé, gamification jugée superflue [S] |

### 2.3 Salles d'étude et présence d'autrui

| Appli | Mécanique centrale | Social | Analytique | Modèle économique | Échelle | Plateforme | Éloges récurrents | Reproches récurrents |
|---|---|---|---|---|---|---|---|---|
| **StudyStream** (Londres, 2020) | Salles vidéo ouvertes 24 h/24, caméra recommandée | Salles publiques, classements, équipe de modération dédiée | Pomodoro, tâches, séries | Basique 1,99 à 3,99 $/mois ; premium 6,99 $/mois, 69,99 $/an [V] | « 270 000+ étudiants » sur la fiche [V] ; revenus estimés 2 M$ en 2024 [S] | Web + natif | Effet « bibliothèque virtuelle » | Pas de petites salles privées sur mobile ; limites d'interface |
| **Study Together** (Discord, 2019) | Salons d'étude caméra ou partage d'écran | Classement du temps d'étude, niveaux | Statistiques d'étude | Gratuit ; **racheté par l'éditeur de StudyStream** [V] | 1,08 M de membres Discord [V] | Discord + web | Disponible à toute heure | Dépend de Discord ; espace public à modérer |
| **Focusmate** | Binôme vidéo de 25, 50 ou 75 min ; on annonce son objectif puis on fait le bilan | Un partenaire à la fois, signalement et blocage | Minimale | 3 sessions gratuites par semaine ; 8 à 12 $/mois [V] | 12 M+ de sessions revendiquées [V] | Web | Engagement réel, apprécié en cas de TDAH | Partenaires absents, caméra obligatoire, réservation nécessaire [S] |
| **Studyverse** | Salles d'étude virtuelles avec jeu de points | Salles, défis | — | — | **Fermé** : signalé en nov. 2024 [S] ; le domaine ne répond plus au 30/09/2026 [V] | Web | — | Raisons de la fermeture non trouvées [NV] |

### 2.4 RPG et compagnons

| Appli | Mécanique centrale | Social | Analytique | Modèle économique | Échelle | Plateforme | Éloges récurrents | Reproches récurrents |
|---|---|---|---|---|---|---|---|---|
| **Habitica** (2013, code ouvert) | Tâches et habitudes donnent expérience et or ; les quotidiennes manquées font perdre des points de vie | Équipes privées et quêtes de boss ; **guildes et taverne supprimées le 8 août 2023** | Faible | Gratuit ; abonnement 4,99 $/mois à 47,99 $/an ; offre groupe 9 $ + 3 $ par membre [V] | Nombre d'inscrits [NV] ; iOS 4,3/5 (3 400 notes), dernière version iOS d'août 2024 [V] | Web + natif | Efficace pour certains profils, très personnalisable | Bugs, complexité, punition, lassitude |
| **Finch** | Oiseau compagnon qui grandit avec les objectifs de soin de soi ; aucune punition | Amis par code, messages d'encouragement prédéfinis, pas de fil public [S] | Tendances d'humeur | Version gratuite généreuse et sans pub ; abonnement env. 9,99 $/mois [V] | Env. 10 M d'utilisateurs actifs mensuels, rétention J1/J7 de 54 %/37 % [S] ; US : 4,9/5, 757 000 notes [V] | Natif | Douceur, absence de honte | Temps passé dans l'appli plutôt qu'à prendre soin de soi ; lassitude après quelques semaines [S] |
| **Focumon** (Milton Ren, 2024) | Monstres à collectionner et faire évoluer par les sessions ; minuteur à pauses proportionnelles | Groupes de 6, sessions en direct, boss mondial mensuel [C][V] | Habitudes, blocs de temps | Gratuit sans pub ni microtransaction ; pass optionnel [V] | Env. 50 000 inscrits, quelques milliers d'actifs (fondateur, sept. 2025) [S] | **Web / PWA** + extension Chrome | Pixel art, profondeur, créateur à l'écoute | Interface complexe pour débuter ; revenus insuffisants ; modération ; expérience mobile décevante [S] |
| **MainQuest** | RPG à points de vie : mourir fait perdre un niveau | Amis, pacte, classement mondial | — | Gratuit + 9,99 $/mois ou 59,99 $/an [C] | [NV] | Natif + web | — | — |
| **Pomodoro RPG** (2026) | Progression de personnage, 7 boss hebdomadaires, 40 classes, boucliers de série | Aucun | — | Apparences 1,99 $, retrait des pubs 2,99 $ [V] | Trop récent pour être noté [V] | Natif iOS | — | — |
| **Age of Pomodoro** (Shikudo, déc. 2024) | Jeu de construction de civilisation alimenté par les sessions | Aucun en jeu ; des joueurs demandent du multijoueur | — | Monnaie premium et passe de combat [V] | 24 notes [V] | Natif | Mignon, gratifiant | Progression peu claire |

### 2.5 Références analytique et méthode

| Appli | Mécanique centrale | Social | Analytique | Modèle économique | Échelle | Plateforme | Éloges récurrents | Reproches récurrents |
|---|---|---|---|---|---|---|---|---|
| **Athenify** (Allemagne, 2020) | Suivi du temps d'étude, médailles, séries, « cours de bourse » personnel | **Aucun** | Carte de chaleur, analyse par heure et jour, répartition par matière, matrice type d'étude × matière, indicateur de rythme [V] | 12,99 $/mois, 29,99 $/trimestre, 199,99 $ à vie ; essai 14 jours [V] | 50 000+ étudiants revendiqués ; env. 270 abonnements actifs, 2 300 $ de revenu mensuel récurrent [S] | Web + natif | Suivi sérieux | Payant, inscription obligatoire |
| **Session** (2020) | Pomodoro avec intention avant et note de réflexion après | Aucun | Tendances de concentration | 4,99 $/mois, 39,99 $/an [V] | Env. 10 000 $/mois de revenus [S] | Apple uniquement | Finesse des réglages | Abonnement, écosystème fermé |
| **Toggl Track** | Suivi du temps professionnel | Équipes | Rapports personnalisables, comparaisons prévu/réalisé | Gratuit pour petit effectif ; 9 à 16 $/utilisateur/mois [V] | [NV] | Web + natif | Rapports puissants | Trop lourd pour un étudiant |
| **Anki** | Répétition espacée, rappel actif | Partage de paquets | Statistiques de révision | Libre et gratuit sauf l'appli iOS (achat unique) [V] | 86,2 % d'usage déclaré dans une enquête auprès d'étudiants en médecine (2024) [S] | Bureau, web, mobile | Efficacité | Prise en main austère |

---

## 3. Question 1 — Cartographie du paysage

### Constats

**a) Cinq familles, toutes occupées.**
Minuteurs à enjeu affectif, chronos sociaux à classement, salles d'étude, RPG et compagnons, trackers analytiques. Aucune n'est vide.

**b) Le secteur se concentre.**
Study Together a été racheté par l'éditeur de StudyStream [V]. Studyverse a disparu [S]. Les espaces d'étude publics demandent une équipe : StudyStream a un responsable de la modération et réserve l'accès aux 16 ans et plus [V].

**c) Le modèle économique glisse vers l'abonnement, et les utilisateurs le reprochent.**
Forest a abandonné son achat unique en décembre 2025 [V]. Opal est critiqué pour son prix [S]. Flipd a placé les sessions longues derrière l'abonnement [V]. À l'inverse, le tarif à vie de Focus To-Do est salué [V].

**d) La publicité est le reproche numéro un quand elle existe.**
Study Bunny en est l'exemple, y compris dans les avis français [V].

**e) La vague 2024-2026 se divise en deux.**
D'un côté des jeux de concentration en solo (Pomodoro RPG, Age of Pomodoro, Focus Friend). De l'autre des applis qui se positionnent explicitement contre la pression de groupe (Nurrow, avec séries privées) [C]. Personne n'occupe le créneau « groupe sans pression ».

**f) L'état de la science sur Anki est nuancé.**
D'après PubMed : une étude de cohorte trouve des scores plus élevés chez les utilisateurs (de 6,2 à 12,9 %) ([DOI](https://doi.org/10.1007/s40670-023-01826-8)) ; deux autres ne trouvent pas de différence significative ([DOI](https://doi.org/10.1177/23821205231205389), [DOI](https://doi.org/10.1111/tct.13798)) ; une quatrième associe un usage plus précoce et plus volumineux au groupe le mieux noté ([DOI](https://doi.org/10.1007/s40670-023-01839-3)).

### Implication concrète pour le projet

- **Ne pas concurrencer sur le blocage ni sur le minuteur.** Forest et Focus Friend y sont imbattables et une PWA ne peut pas bloquer.
- **Prendre Athenify comme étalon de l'écran d'analyse** : ce qu'il vend 12,99 $/mois est ce que le projet offre gratuitement.
- **Étudier Focumon de près** avant d'écrire la moindre ligne : même support, même promesse multijoueur, mêmes difficultés à prévoir.
- **Réduire la première version.** Minuteur, journal de session, une guilde, un boss, un calendrier de régularité. Classes, arbre de talents et équipement viennent après validation de l'usage.
- **Présenter les méthodes avec prudence** : dire « méthodes soutenues par la recherche », pas « méthodes qui garantissent la réussite ».

---

## 4. Question 2 — Le contexte étudiant français

### Constats

**a) La popularité de YPT en France n'a pas pu être confirmée.**

| Indice | Résultat |
|---|---|
| Notes sur l'App Store France | YPT env. 127 ; Forest env. 11 000 ; Study Bunny env. 2 900 ; Flora env. 1 800 [V] |
| Liste du Tutorat Lyon Est (avril 2024) | Plantie, Study Bunny, Forest, Anki, Quizlet, Puissance J. **Pas YPT** [V] |
| Diploma Santé (mise à jour mai 2026) | Forest, Anki, Notion. **Pas YPT** [V] |
| Medularis (mise à jour février 2026) | Forest, Flipd. **Pas YPT** [V] |
| Stewdy (octobre 2024) | Forest, Focus To-Do. **Pas YPT** [V] |
| Classements Google Play | YPT n° 2 en Éducation en Corée et à Taïwan, n° 3 à Singapour, n° 4 en Turquie. France non citée [S] |

Interprétation [E] : soit YPT est moins répandu que supposé, soit sa diffusion passe par invitation entre camarades, dans des promotions précises, sans laisser de trace dans les recommandations officielles. Le nombre de notes ne mesure pas le nombre d'utilisateurs. **Seule une enquête de terrain tranchera.**

**b) Les avis français visibles sur YPT sont positifs** et portent sur l'organisation et la motivation. Aucun avis visible ne mentionne la pression [V]. L'échantillon affiché est très petit (quatre avis).

**c) Les effets des classements d'heures sont documentés ailleurs.**
- Un article de média étudiant de Singapour (février 2025) décrit un champion à plus de 321 heures en un mois, des chronos lancés pendant des activités sans rapport, une obsession de l'appli avec baisse d'énergie, et conseille de quitter les groupes toxiques [S].
- Des pages de tendances coréennes portent sur la manière de masquer son temps d'étude dans un groupe [S, signal faible].
- Une synthèse d'avis signale que la possibilité de masquer le classement aurait disparu lors d'une mise à jour, à la déception d'utilisateurs [NV].
- Étude longitudinale de Hanus et Fox (2015) : un cours avec classement et badges produit, sur 16 semaines, moins de motivation et de satisfaction et de moins bonnes notes finales que le même cours sans ces éléments [S].

**d) Le discours des prépas santé valorise déjà la méthode sur le volume.**
Diploma Santé (mars 2026) recommande 6 à 8 heures de travail personnel, affirme que huit heures avec pauses valent mieux que dix sans, et conseille de garder le dimanche après-midi libre [V]. L'Étudiant recommande un jour ou une demi-journée de repos par semaine [V].

**e) Le terrain psychologique est fragile.**
Enquête ANEMF, ISNAR-IMG et ISNI de 2024 (8 307 réponses) : 52 % de symptômes anxieux, 27 % d'épisodes dépressifs, 21 % d'idées suicidaires dans l'année [S]. Aucune donnée équivalente n'a été trouvée pour la pharmacie [NV].

### Implication concrète pour le projet

- **Avant tout développement, interroger 8 à 10 camarades** : quelle appli, quel groupe, classement regardé ou non, heures déjà gonflées ou non, ressenti. Critère de réussite : savoir si le problème « course aux heures » existe dans la promotion visée.
- **Parler le vocabulaire local** : fiches, QCM, annales, colles, ED, méthode des J.
- **S'appuyer sur le discours déjà admis** (méthode, pauses, repos) : le projet l'outille, il ne l'invente pas.
- **Viser les listes des tutorats** comme canal de diffusion crédible.
- **Prévoir une page d'aide** renvoyant vers les dispositifs de soutien étudiants, sans prétendre soigner.

---

## 5. Question 3 — Lacunes et positionnement

### Constats : que valent les différenciateurs revendiqués ?

| Différenciateur du projet | Existe ailleurs ? | Verdict |
|---|---|---|
| Aucune comparaison avec les autres | Oui chez les applis solo (Athenify, Session, Focus Friend, Finch, Nurrow). Presque jamais chez les applis sociales, qui ajoutent toutes un classement | **Rare dans une appli sociale** |
| Récompenser la régularité plutôt que le volume | Partiel : séries chez presque tous ; Duolingo a découplé série et objectif quotidien [V] | Courant pour la série, **rare pour les rendements décroissants** |
| Plus d'expérience pour les méthodes efficaces | Non trouvé. Athenify enregistre le type d'étude mais ne le récompense pas davantage [V] | **Très rare** parmi les applis examinées |
| Jours de repos planifiés | Approchant : gels de série (Duolingo), boucliers (Pomodoro RPG), pause des dégâts (Habitica), absence de punition (Finch) | **Peu courant sous forme planifiée à l'avance** |
| Boss coopératifs alimentés par le groupe | Oui : Habitica depuis 2013, Focumon (boss mondial mensuel) | **Pas rare.** La version sans punition collective l'est |
| Sessions de groupe en présentiel | Approchant : Flora (QR code), Forest (salle commune) | **Rare avec bonus collectif et pauses synchronisées** |
| Analyse personnelle des données | Oui : Athenify, Session, Forest Plus, Toggl | **Pas rare, mais payante ailleurs** |
| Suggestions personnalisées fondées sur la recherche | Non trouvé. Les fonctions d'IA du secteur portent sur le contenu des cours | **Apparemment rare** [NV exhaustif] |
| Statistiques privées par défaut | Finch oui ; YPT expose les heures au groupe | Rare dans les applis de groupe |
| PWA gratuite sans pub | Focumon | Rare, et économiquement fragile |

### Où est le vrai espace libre

Le créneau libre n'est aucune fonction isolée. C'est **l'intersection** : petit groupe d'amis, coopération sans classement, récompense de la manière de travailler. Les applis sociales existantes reposent sur la pression du regard ; les applis bienveillantes existantes sont solitaires.

### Implication concrète pour le projet

- **Ne pas revendiquer comme nouveautés** les boss coopératifs, les séries ou l'analytique : ce serait faux et vérifiable.
- **Revendiquer l'assemblage** et les deux éléments réellement rares : expérience pondérée par la méthode, rendements décroissants.
- **Attention au revers** : le succès de YPT suggère que beaucoup d'étudiants recherchent la pression. Le positionnement bienveillant peut ne parler qu'à une partie de la promotion [E].

---

## 6. Question 4 — Leçons des échecs, pivots et retraits

### Constats

**a) Habitica : suppression des guildes et de la taverne (8 août 2023).**
Trois raisons données par l'éditeur [V] : ces espaces n'étaient utilisés que par une petite fraction des joueurs ; leur entretien coûtait trop au regard de cet usage ; de nouvelles lois sur la sécurité en ligne exigeaient une surveillance active des espaces publics. Les équipes privées, elles, prospéraient et ont été conservées. Contexte : les modérateurs bénévoles étaient partis en décembre 2022 après un désaccord [S].

**b) Focumon : les freins cités par le fondateur (septembre 2025)** [S].
Revenus insuffisants, selon ses mots « not enough cash flow coming from Focumon ». Modération : commentaires racistes et violents saisis dans les champs de session et d'objectifs. Expérience mobile : l'emballage du site en appli n'était pas satisfaisant, une réécriture native est envisagée. Écart d'usage : environ 50 000 inscrits pour quelques milliers d'actifs.

**c) Flipd : pas de fermeture, mais une suite de pivots.**
Contrôle parental, puis étudiants, puis salles de classe, puis bien-être numérique [S]. Le verrouillage reposait sur un profil de gestion d'appareil devenu incompatible avec iOS 16 ; il a fallu le reconstruire sur l'API Temps d'écran [V]. Dernière mise à jour iOS relevée : février 2025 [V]. **Aucune annonce de fermeture trouvée.**

**d) Studyverse : fermé, raisons non trouvées** [S][NV].

**e) Punition collective et effets contre-productifs.**
- Dans Habitica, les quotidiennes manquées d'un membre blessent toute l'équipe pendant un boss, même si l'on a activé la pause [V].
- Dans Flora, l'abandon de l'hôte fait perdre l'arbre de tous ; la mécanique est jugée trop punitive par certains [S].
- Diefenbach et Müssig (2019) : les 45 participants ont tous subi des effets contre-productifs, par exemple être puni en période très productive faute d'avoir coché à temps ; certains contournent le système en requalifiant leurs tâches [S].

**f) Courbes de rétention connues.**

| Source | Jour 1 | Jour 7 | Jour 30 |
|---|---|---|---|
| Toutes applis (OneSignal 2024, cité par GetStream) [S] | 28,3 % | 17,9 % | 7,9 % |
| Productivité (même source) [S] | 32,9 % | 24,2 % | 9,6 % |
| Éducation (même source) [S] | 27,5 % | 17,8 % | 8,0 % |
| Productivité, médiane / bons élèves (UXCam 2026) [S] | 30 % / 40-50 % | 15 % / 22-28 % | 8 % / 12-18 % |
| Applis de santé mentale, médiane (Baumel et al., 2019, PubMed, [DOI](https://doi.org/10.2196/14567)) [V] | — | 3,9 % à 15 jours | 3,3 % |
| Finch (Sensor Tower via Deconstructor of Fun) [S] | 54 % | 37 % | — |

**g) Usure de la nouveauté.**
Un test de Forest décrit une nouveauté forte les deux premières semaines, puis un simple minuteur au bout de deux mois [S]. Les avis sur Focus Friend décrivent la même chute une fois la décoration terminée [V].

**h) La souplesse des séries améliore la rétention.**
Duolingo [V] : découpler la série de l'objectif quotidien a augmenté la rétention à 14 jours de 3,3 % ; autoriser deux gels de série a augmenté les apprenants actifs quotidiens de 0,38 % ; atteindre 7 jours de série multiplie par 3,6 la probabilité de finir le cours.

**i) Charge de modération et parades observées.**
- Groupes privés sur invitation (équipes d'Habitica, codes d'amis de Finch).
- Messages prédéfinis plutôt que texte libre (encouragements de Finch) [S].
- Limite d'âge et outils masquer / bloquer / signaler (StudyStream) [V].
- Cadre européen : le mécanisme de notification et d'action (article 16 du DSA) s'applique à tout hébergeur ; les micro et petites entreprises sont dispensées de la section propre aux plateformes en ligne (article 19) [S]. À faire valider par un juriste.

### Implication concrète pour le projet

- **Guildes sur invitation uniquement**, taille plafonnée, aucun annuaire public, aucune recherche de guilde.
- **Aucun texte libre visible par autrui** en première version : noms de guilde tirés d'un générateur, réactions prédéfinies. Le champ « ce que j'ai fait » reste privé.
- **Un boss ne blesse jamais.** L'effort du groupe ajoute, l'absence d'un membre ne retire rien à personne.
- **Séries souples dès le départ** : jours de repos planifiés, reprise sans perte après une coupure.
- **Mesurer la rétention par cohorte dès le premier jour** (J1, J7, J30). Repère : dépasser 10 % à 30 jours serait déjà au-dessus de la moyenne du secteur. Pour une cohorte d'amis, viser nettement plus haut [E].
- **Accepter un usage saisonnier** (périodes d'examens) et soigner le retour plutôt que de le punir.
- **Ne dépendre d'aucune interface système fragile.**

---

## 7. Question 5 — Anti-triche et confiance

### Constats

**a) Comment les applis existantes vérifient la concentration.**

| Méthode | Exemples | Limite |
|---|---|---|
| Sanction si l'on quitte l'appli | Forest, Flora, YPT | Contournable ; pénalise aussi des usages légitimes |
| Blocage via l'API Temps d'écran | Forest, Focus Friend, Opal, Flipd | Réservé aux applis natives avec autorisation spéciale d'Apple [S] ; l'utilisateur peut révoquer l'accès dans les réglages sans code ; bugs documentés par un développeur du secteur [V] |
| Caméra allumée | StudyStream, Focusmate, Study Together | Intrusif, exige modération |
| Responsabilité envers le groupe | Forest, Flora | Pression sociale |
| Déclaration sur l'honneur | Habitica, Finch, « mode honnête » de Study Bunny | Aucune vérification |

**b) Ce qui est faisable pour une PWA sur iOS.**

| Capacité | Faisable ? | Source |
|---|---|---|
| Bloquer d'autres applis | **Non** | API réservée au natif [S] |
| Détecter que l'appli passe à l'arrière-plan | Oui, par l'API de visibilité de page | [S] |
| Distinguer « téléphone verrouillé » de « autre appli ouverte » | Probablement non | [NV, à tester] |
| Faire tourner un minuteur en arrière-plan | **Non** : le code est suspendu | [S] |
| Garder l'écran allumé | Oui depuis iOS 18.4 pour les applis web installées | [V] |
| Afficher le minuteur sur l'écran verrouillé | Non | [E] |
| Notifications | Oui depuis iOS 16.4, seulement si installée, sur geste de l'utilisateur | [V] |

Conséquence directe : **la mécanique « tu quittes, l'arbre meurt » n'est pas transposable.** Verrouiller son téléphone et le poser retourné, comportement souhaité, serait vu comme un départ.

**c) La triche est-elle un problème sans classement ?**
- Le cas YPT montre que la falsification naît de la volonté de gagner [S].
- L'étude sur Habitica montre que les utilisateurs contournent surtout pour éviter une punition [S].
- Les applis sur l'honneur sans classement (Finch, Habitica en équipe privée) fonctionnent à grande échelle sans que la triche ressorte comme reproche dans les sources consultées [E].
- Aucune étude mesurant directement la triche avec et sans classement n'a été trouvée [NV].

Raisonnement [E] : sans classement ni punition, les deux principaux mobiles disparaissent. Il en reste deux : laisser tourner le minuteur pour accumuler de l'expérience, et gonfler sa contribution pour faire bonne figure dans la guilde.

### Implication concrète pour le projet

- **Minuteur fondé sur des horodatages** (début et fin enregistrés côté serveur), jamais sur un compteur qui tourne.
- **Plafonds de plausibilité** : durée maximale d'une session, et rendements décroissants par jour, déjà prévus par la philosophie du projet.
- **Bilan de fin de session** (méthode, résultat) : il sert l'analyse et rend l'abandon du minuteur moins rentable.
- **Validation par les pairs pour les sessions communes** : code ou QR code affiché par l'hôte, présence confirmée sur place.
- **Ne pas afficher la contribution individuelle au boss** sous forme comparable : montrer le total du groupe.
- **Mode « horloge de bureau »** facultatif avec écran maintenu allumé, en prévenant de la consommation de batterie.
- **Assumer le choix** : l'appli fait confiance, tricher ne trompe que soi.

---

## 8. Question 6 — Onboarding et distribution d'une PWA sur iPhone

### Constats

**a) Le parcours d'installation reste manuel.**
Ouvrir dans Safari, bouton Partager, « Sur l'écran d'accueil », confirmer. Aucune invite automatique n'existe sur iOS ; il faut afficher ses propres instructions, et seulement quand l'appli n'est pas encore installée [V].

**b) Améliorations récentes.**
- iOS 17 : ajout à l'écran d'accueil possible depuis le navigateur intégré standard des applis [V].
- iOS 18.4 : maintien de l'écran allumé corrigé, notifications déclaratives [V].
- iOS 26 : tout site ajouté à l'écran d'accueil s'ouvre par défaut comme appli web, sans condition technique [S].

**c) Pièges documentés.**

| Piège | Détail | Source |
|---|---|---|
| Navigateurs intégrés des réseaux sociaux | Un lien ouvert depuis certaines applis ne permet pas l'installation | [S, 2023] |
| Sessions isolées | La connexion faite dans Safari n'est pas reprise par l'appli installée | [S] |
| Rechargement | L'appli peut se recharger quand on y revient | [S, 2023] |
| Stockage local | Une source affirme que le cache disparaît après une semaine sans ouverture ; WebKit indique que les applis installées ont leur propre compteur et ne devraient pas perdre leurs données | Contradictoire [S] |
| Restrictions de contenu | Écran blanc signalé quand les restrictions web de Temps d'écran sont actives ; non résolu en octobre 2023 | [V] ; état actuel [NV] |
| Union européenne | Apple avait annoncé la fin des applis web installées dans l'UE, puis a fait marche arrière le 1er mars 2024. **Des guides de 2026 répètent encore l'information périmée** | [V] |

**d) Retours d'expérience.**
- Focumon, seule PWA d'étude gamifiée identifiée, juge son expérience mobile insuffisante et envisage le natif [S].
- Les produits d'étude qui réussissent sur le web (Focusmate, StudyStream, Pomofocus) sont surtout utilisés sur ordinateur [E].
- **Aucun chiffre de taux d'installation ou d'abandon propre à iOS n'a été trouvé** [NV]. Les statistiques disponibles sont anciennes et concernent le commerce sur Android.

### Implication concrète pour le projet

- **Installer d'abord, créer le compte ensuite**, dans l'appli installée.
- **Connexion par code à saisir** plutôt que par lien magique : un lien reçu par courriel s'ouvrirait dans Safari, pas dans l'appli [E].
- **Écran d'installation illustré en trois étapes**, affiché seulement en mode navigateur, avec la consigne « ouvrir dans Safari ».
- **Diffuser par QR code en présentiel** : l'appareil photo ouvre le navigateur par défaut. Pour les premiers utilisateurs, une installation collective de cinq minutes contourne presque toute la friction [E].
- **Tout conserver côté serveur** ; le stockage local n'est qu'un cache.
- **Ne demander les notifications qu'après un geste explicite**, et rester utilisable sans elles.
- **Critère de réussite mesurable** : part des invités qui terminent une première session dans l'appli installée. Instrumenter chaque étape.

---

## 9. Question 7 — Soutenabilité

### Constats : quotas officiels

| Service | Offre gratuite | Offre payante |
|---|---|---|
| **Supabase** [V] | 500 Mo de base, 50 000 utilisateurs actifs mensuels, 5 Go de sortie, 200 connexions temps réel simultanées, 2 M de messages, **pause après 1 semaine d'inactivité**, pas de sauvegarde, 2 projets | À partir de 25 $/mois : 8 Go, 500 connexions simultanées puis 10 $ par millier, sauvegardes 7 jours, jamais de pause |
| **Vercel** [V] | 100 Go de transfert, 1 M d'appels de fonctions ; **usage non commercial uniquement**. Demander des dons n'est pas considéré comme commercial | 20 $/mois |
| **Courriels Supabase par défaut** [V] | 2 messages par heure, réservés à l'équipe : inutilisable en production | Service tiers requis |
| **Resend** [V] | 3 000 courriels par mois, 100 par jour | 20 $/mois pour 50 000 |

### Estimation des coûts [E]

Hypothèses : 40 % des inscrits actifs chaque semaine, 4 sessions par jour et par actif, 0,5 ko par session, pic de connexions simultanées de 10 à 15 % des inscrits.

| Échelle | Base de données | Pic temps réel | Coût mensuel estimé | Remarque |
|---|---|---|---|---|
| **50** | env. 1 à 2 Mo/mois | 5 à 10 | **0 €** + nom de domaine | Offres gratuites très suffisantes |
| **500** | env. 12 Mo/mois | 50 à 75 | **0 à 25 €** | Gratuit techniquement possible ; l'offre payante se justifie par les sauvegardes et l'absence de pause |
| **5 000** | env. 120 Mo/mois | 500 à 750 | **45 à 100 €** | Supabase payant obligatoire ; Vercel payant si vente ; courriels payants selon volume |

**Piège propre à une appli étudiante** [E] : pendant les vacances d'été, l'inactivité peut déclencher la pause du projet gratuit, à rétablir manuellement.

### Constats : monétisation observée

| Modèle | Exemple | Réception |
|---|---|---|
| Publicité | Study Bunny | Reproche principal |
| Abonnement cher | Opal | Critiqué |
| Verrouillage après coup | Flipd, Forest | Mal vécu |
| Gratuit généreux + abonnement | Finch | Bien reçu, avec critiques sur la sollicitation |
| Cosmétiques + achat à vie | Focus Friend, Focus To-Do | Bien reçu |
| Gratuit + pass optionnel | Focumon | Apprécié mais revenus insuffisants |
| Appli iOS payante finançant le reste | Anki | Accepté de longue date |

Ordre de grandeur de conversion : Athenify compte environ 270 abonnements pour 50 000 étudiants revendiqués, soit environ 0,5 % [E, calculé à partir de chiffres S].

### Implication concrète pour le projet

- **Jusqu'à 500 utilisateurs, financer de sa poche** (moins de 300 € par an) et ne rien vendre.
- **Dons** : compatibles avec l'offre gratuite de Vercel. Attendre très peu [E].
- **Cosmétiques ou déblocage unique** : cohérents avec la philosophie, mais ils rendent l'usage commercial et imposent l'offre payante de Vercel.
- **Partenariats** (tutorats, associations étudiantes, bibliothèques universitaires) : prise en charge de l'hébergement contre visibilité [E].
- **Ne jamais vendre** : réparation de série, avantage de progression, levée d'une limite créée exprès.
- **Sauvegardes dès que les données comptent pour quelqu'un.**
- **Statut associatif pour recevoir des dons** : piste à explorer [NV].

---

## 10. Carte de positionnement

### Carte 1 — Seul ou en groupe, pression ou bienveillance

```
                     COOPÉRATION / BIENVEILLANCE
                                ^
                                |
        Finch                   |            >>> PROJET <<<
        Focus Friend            |        (petit groupe, sans classement)
        Session                 |
        Athenify                |        Focumon
                                |        Habitica (équipes)
   SEUL <-----------------------+-----------------------> GROUPE
                                |
        Study Bunny             |        Forest / Flora (groupe punitif)
        Pomodoro RPG            |        Focusmate
        MainQuest               |        StudyStream / Study Together
                                |        Flipd, Opal
                                |        YPT
                                v
                     COMPÉTITION / PRESSION
```

Le quadrant en haut à droite contient Focumon et les équipes d'Habitica, mais Habitica y punit collectivement et Focumon garde des espaces ouverts à modérer.

### Carte 2 — Ce qui est récompensé, et comment on garantit l'honnêteté

```
                      MÉTHODE ET RÉGULARITÉ
                                ^
                                |
        Anki                    |            >>> PROJET <<<
        Duolingo (série souple) |
        Finch                   |
                                |
 CONTRAINTE <-------------------+-------------------> CONFIANCE
 (blocage, caméra)              |                  (honneur)
                                |
        Opal                    |        Habitica
        Forest, Focus Friend    |        Study Bunny
        StudyStream, Focusmate  |        Athenify
        YPT                     |
                                v
                      VOLUME (heures, tâches)
```

### Énoncé de positionnement recommandé

> **Pour les étudiants en santé qui révisent entre amis, le projet est le compagnon de révision coopératif qui transforme la régularité et les bonnes méthodes, et non le nombre d'heures, en progression de groupe. Contrairement aux chronos à classement, personne n'y est comparé à personne : on ne peut que s'entraider.**

Version courte : **« On ne se classe pas, on avance ensemble. »**

---

## 11. Fonctionnalités à emprunter

| # | Fonction | Source d'inspiration | Adaptation au projet |
|---|---|---|---|
| 1 | Salle commune rejointe par code ou QR code | Flora, Forest | Garder le rituel, retirer la punition collective |
| 2 | Boss alimenté par l'effort cumulé | Habitica, Focumon | L'effort ajoute, rien ne blesse |
| 3 | Petits groupes plafonnés | Focumon (6) | Guildes sur invitation |
| 4 | Codes d'amis et encouragements prédéfinis | Finch | Aucun texte libre partagé |
| 5 | Série découplée du volume | Duolingo | Une session courte suffit à maintenir la série |
| 6 | Gels et boucliers de série | Duolingo, Pomodoro RPG | Jours de repos planifiés à l'avance |
| 7 | Accueil sans reproche au retour | Finch | Message de reprise après coupure |
| 8 | Carte de chaleur, profil horaire, répartition par matière | Athenify | Écran d'analyse gratuit |
| 9 | Matrice type d'étude × matière | Athenify | Base de l'expérience pondérée par la méthode |
| 10 | Intention avant, réflexion après | Session, Focusmate | Rituel en trois temps |
| 11 | Chronomètre par matière | YPT | Conserver |
| 12 | Présence en direct des camarades | YPT | Montrer qui travaille, jamais combien |
| 13 | Pauses proportionnelles au temps travaillé | Focumon | Option à côté du pomodoro |
| 14 | Déclaration de distraction | Study Bunny | Donnée privée pour l'analyse |
| 15 | Gratuit, sans pub, cosmétiques seulement | Focus Friend | Modèle cible si monétisation |
| 16 | Tarif à vie modeste | Focus To-Do | Option de soutien unique |
| 17 | Masquer / bloquer / signaler | StudyStream | À prévoir même en groupes privés |

---

## 12. Erreurs à ne pas reproduire

| # | Erreur | Qui l'a commise | Conséquence observée |
|---|---|---|---|
| 1 | Espaces sociaux publics | Habitica | Suppression en 2023 |
| 2 | Texte libre visible par des inconnus | Focumon | Contenus racistes et violents à modérer |
| 3 | Classement des heures | YPT | Heures extrêmes, falsification, groupes toxiques |
| 4 | Punition collective | Flora, Habitica | Ressentie comme trop dure ; culpabilité |
| 5 | Punir les périodes productives | Habitica | Effets contre-productifs chez tous les participants étudiés |
| 6 | Série qui retombe à zéro | Nombreux trackers | Abandon vers la deuxième semaine |
| 7 | Publicité pendant l'usage | Study Bunny | Premier motif de plainte |
| 8 | Verrouiller après coup des fonctions gratuites | Flipd, Forest | Avis négatifs |
| 9 | Dépendre d'une interface système fragile | Flipd | Fonction centrale cassée par iOS 16 |
| 10 | Trop de fonctions dès l'arrivée | Focumon, Habitica | Prise en main jugée complexe |
| 11 | Contenu qui s'épuise | Focus Friend | Motivation qui retombe |
| 12 | Statistiques stockées seulement sur l'appareil | Flora | Perte à la réinstallation |
| 13 | Récompenser la quantité | Todoist | Découpage artificiel des tâches |
| 14 | Appli qui absorbe le temps qu'elle devait libérer | Finch (critique de Slate) | Lassitude en six semaines |
| 15 | Compter sur les notifications | — | Sur PWA, elles exigent installation et accord |
| 16 | Se fier à des guides PWA périmés | Plusieurs guides de 2026 | Décisions prises sur une information fausse (cas de l'UE) |

---

## 13. Ce qui n'a pas pu être vérifié

| Sujet | État |
|---|---|
| Diffusion réelle de YPT chez les étudiants français en PASS, LAS, médecine, pharmacie, prépa | **Non confirmée.** Aucune source publique francophone trouvée |
| Usage français des classements de groupe et témoignages sur la course aux heures | Non trouvé en français. Preuves disponibles : Singapour, Corée, Inde |
| Fils Reddit (r/etudiants et autres) | Inaccessibles |
| Vidéos TikTok et YouTube francophones | Illisibles par les outils |
| Données de santé mentale propres aux étudiants en pharmacie | Non trouvées |
| Téléchargements de Focus Friend en août 2025 (740 000 évoqués) | Chiffre vu dans un extrait de recherche ; article d'origine inaccessible |
| Nombre d'inscrits de Habitica | Non trouvé de façon fiable |
| Téléchargements de Flora, MainQuest, Toggl Track | Non trouvés |
| Raisons de la fermeture de Studyverse | Non trouvées |
| Retrait de l'option « masquer le classement » dans YPT | Issu d'une synthèse automatique d'avis |
| Existence d'un classement dans Focus To-Do | À confirmer |
| Fonctionnement exact des applis autorisées de YPT sur iOS | Sources contradictoires |
| Pages d'aide officielles de Forest et de Finch, wiki de Habitica | Pages non lisibles ; informations obtenues par extraits |
| Taux d'installation et d'abandon d'une PWA sur iOS | **Aucun chiffre trouvé** |
| Distinction verrouillage / changement d'appli dans une PWA | À tester sur appareil |
| État actuel du bug d'écran blanc avec les restrictions de contenu | Dernier état connu : octobre 2023 |
| Persistance du stockage local d'une PWA installée | Sources contradictoires |
| Étude comparant la triche avec et sans classement | Non trouvée |
| Prix d'un nom de domaine, fonctionnement de HelloAsso | Non vérifiés |
| Limite d'utilisateurs de l'offre gratuite de Toggl | À relire sur la page tarifaire |
| Exhaustivité de la recherche d'applis récompensant la méthode | Limitée aux applis listées ici |

---

## 14. Sources

Toutes consultées les 29 et 30 septembre 2026. La date entre parenthèses est celle de publication ou de mise à jour quand elle est connue.

### Applications — sites officiels et fiches de boutique

- Forest, site officiel : https://www.forestapp.cc/
- Forest, App Store US : https://apps.apple.com/us/app/forest-focus-for-productivity/id866450515
- Forest, App Store France : https://apps.apple.com/fr/app/forest-restez-concentr%C3%A9/id866450515
- Forest, Wikipédia : https://en.wikipedia.org/wiki/Forest_(application)
- Forest, aide Seekrtech (non lisible, extrait seulement) : https://faq.seekrtech.com/Forest/articles/468
- Flora, App Store France : https://apps.apple.com/fr/app/flora-green-focus/id1225155794
- Focus Friend, App Store US : https://apps.apple.com/us/app/focus-friend-by-hank-green/id6742278016
- Focus Friend, App Store France : https://apps.apple.com/fr/app/focus-friend-by-hank-green/id6742278016
- Focus Friend, site : https://focusfriend.me/
- Study Bunny, App Store US : https://apps.apple.com/us/app/study-bunny-focus-timer/id1478345385
- Study Bunny, App Store France : https://apps.apple.com/fr/app/study-bunny-focus-timer/id1478345385
- YPT, App Store US : https://apps.apple.com/us/app/ypt-study-group/id1441909643
- YPT, App Store France : https://apps.apple.com/fr/app/ypt-groupe-d%C3%A9tude/id1441909643
- YPT, Google Play : https://play.google.com/store/apps/details?id=com.pallo.passiontimerscoped
- YPT, Similarweb : https://www.similarweb.com/app/google-play/com.pallo.passiontimerscoped/statistics/
- YPT, MWM : https://mwm.ai/apps/ypt-study-group/1441909643
- YPT, AlternativeTo : https://alternativeto.net/software/yeolpumta--ypt/about
- StudyStream, règles : https://www.studystream.live/rules
- StudyStream, App Store : https://apps.apple.com/us/app/studystream/id6461722416
- StudyStream, GetLatka : https://getlatka.com/companies/studystream.live
- Study Together, site : https://www.studytogether.com/
- Study Together, Discord : https://discord.com/servers/study-together-595999872222756885
- Focusmate, site : https://www.focusmate.com/
- Focusmate, tarifs : https://www.focusmate.com/pricing/
- Habitica, FAQ (fichier source) : https://raw.githubusercontent.com/HabitRPG/habitica/develop/website/common/locales/en/faq.json
- Habitica, textes d'accueil : https://raw.githubusercontent.com/HabitRPG/habitica/develop/website/common/locales/en/front.json
- Habitica, page FAQ officielle (non lisible) : https://habitica.com/static/faq/tavern-and-guilds
- Habitica, Wikipédia : https://en.wikipedia.org/wiki/Habitica
- Habitica, App Store : https://apps.apple.com/us/app/habitica-gamified-taskmanager/id994882113
- Finch, App Store : https://apps.apple.com/us/app/finch-self-care-pet/id1528595748
- Flipd, App Store : https://apps.apple.com/us/app/flipd-focus-study-timer/id1071708905
- Flipd, aide : https://intercom.help/flipdapp/en/articles/7065786-why-did-focus-lock-version-1-0-stop-working (9 mars 2023)
- Focus To-Do, App Store : https://apps.apple.com/us/app/focus-to-do-focus-timer-tasks/id966057213
- Session, site : https://www.stayinsession.com/
- Session, App Store : https://apps.apple.com/us/app/session-pomodoro-focus-timer/id1521432881
- Session, MicroFounder : https://microfounder.com/startups/session
- Opal, App Store : https://apps.apple.com/us/app/opal-screen-time-control/id1497465230
- Athenify, tarifs : https://athenify.io/pricing
- Athenify, fonctions : https://athenify.io/features
- Athenify, TrustMRR : https://trustmrr.com/startup/athenify
- Focumon, présentation : https://www.focumon.com/landing
- Focumon, comparaison avec Forest : https://www.focumon.com/on/forest
- Focumon, Product Hunt : https://www.producthunt.com/products/focumon
- Focumon, Grokipedia : https://grokipedia.com/page/focumon
- Toggl Track, tarifs : https://toggl.com/track/pricing/
- Anki, Wikipédia : https://en.wikipedia.org/wiki/Anki
- Pomodoro RPG, App Store : https://apps.apple.com/us/app/pomodoro-rpg-focus-timer/id6770516108
- Age of Pomodoro, App Store : https://apps.apple.com/ph/app/age-of-pomodoro-focus-timer/id6450676637
- Pomofocus : https://pomofocus.io/

### Presse, entretiens, comparatifs

- TechCrunch, Focus Friend (18 août 2025) : https://techcrunch.com/2025/08/18/hank-greens-focus-friend-app-is-climbing-the-app-store-charts-and-its-extremely-cute
- TechCrunch, Focus Friend appli de l'année (18 nov. 2025) : https://techcrunch.com/2025/11/18/hank-greens-focus-friend-is-google-plays-app-of-the-year
- Fast Company, Focus Friend (non accessible) : https://www.fastcompany.com/91388304/focus-friend-app-store-hank-green-bria-sullivan
- Scary Mommy (18 août 2025) : https://www.scarymommy.com/lifestyle/hank-green-focus-friend-best-productivity-app
- Headway, test de Focus Friend : https://makeheadway.com/blog/focus-friend-app-review/
- Headway, test d'Opal : https://makeheadway.com/blog/opal-app-review/
- Nerds Chalk (20 août 2025) : https://nerdschalk.com/focus-friend-deep-focus-mode-explained-use-allow-list-to-exclude-apps/
- Screen Time Index, test de Forest : https://screentimeindex.com/posts/forest-app-review/
- Nerdynav, Forest contre Flora (1er août 2026) : https://nerdynav.com/forest-vs-flora-pomodoro/
- The Business of Business, Flora (21 sept. 2020) : https://www.businessofbusiness.com/articles/flora-focus-productivity-app-review/
- Raffles Press, sur YPT (13 févr. 2025) : https://rafflespress.com/2025/02/13/yawns-pains-and-tears-on-ypt/
- Type It Out, YPT (9 mars 2026) : https://www.typeitout.com/article/yeolpumta-study-tracker-for-neet-ss-preparation/
- Korean Apps, YPT (1er nov. 2025) : https://korean-apps.com/?p=164
- Flat.social, test de Focusmate : https://flat.social/guides/focusmate-review
- Choosing Therapy, test de Habitica : https://www.choosingtherapy.com/habitica-app-review/
- Deconstructor of Fun, Finch : https://www.deconstructoroffun.com/blog/x0hd2ssr80y5n7gv0w967pg7hwd7tl
- Sparrow, Finch (1er avril 2026) : https://blog.sparrowapps.io/p/finch-how-a-self-care-app-hit-30m-arr-without-vc-money
- Slate, test de Finch (6 sept. 2026) : https://slate.com/technology/2026/09/finch-app-self-care-wellness-review.html
- The Globe and Mail, Flipd (juin 2018) : https://www.theglobeandmail.com/business/technology/article-torontos-flipd-helps-students-deal-with-smartphone-distraction/
- Braavo, entretien Flipd (12 août 2019) : https://www.getbraavo.com/blog/why-your-app-needs-purpose/
- André Almo, entretien avec le créateur de Focumon (22 sept. 2025) : https://andrealmo.substack.com/p/focus-collect-repeat
- Gridfiti, alternatives à Studyverse (5 nov. 2024) : https://gridfiti.com/studyverse-alternatives/
- Yu-kai Chou, applis gamifiées (29 sept. 2026) : https://yukaichou.com/lifestyle-gamification/best-gamified-productivity-apps/
- Trophy, exemples de gamification (27 août 2026) : https://trophy.so/blog/productivity-gamification-examples
- Goals and Progress, comparatif pomodoro : https://goalsandprogress.com/pomodoro-apps-comparison/
- Together with Kai (14 août 2026) : https://togetherwithkai.com/blog/best-habit-tracker-apps
- DEV Community, CompStudy : https://dev.to/helloimabid/i-built-a-study-timer-competitor-that-converted-my-procrastination-into-a-game-420i

### Pages de concurrents (biaisées)

- Nurrow : https://nurrow.app/apps-like-ypt
- Study-Track (août 2026) : https://study-track.app/alternatives/ypt/
- MainQuest : https://www.mainquest.net/on/focumon
- CSW : https://csw.live/study-verse/
- Cozy Study (21 mai 2026) : https://cozystudytimer.app/blog/best-aesthetic-study-timer

### Contexte français

- Tutorat Lyon Est (11 avril 2024) : http://tutoratlyonest.univ-lyon1.fr/2024/04/11/les-applis-utiles-en-pass/
- Diploma Santé, applis (5 mai 2026) : https://diploma-sante.fr/les-meilleures-applis-pour-reviser-en-pass-las/
- Diploma Santé, heures de travail (23 mars 2026) : https://diploma-sante.fr/combien-dheures-travailler-par-jour-en-pass/
- Medularis (25 févr. 2026) : https://medularis.fr/blog/meilleures-applications-etudiants-medecine/
- Stewdy (3 oct. 2024) : https://stewdy.com/actualites/apps-revisions-lycee/
- Capitaine Study (17 avril 2023) : https://www.capitainestudy.fr/articles/10-applications-pour-faciliter-la-vie-des-lyceens-etudiants/
- Hippocast (19 août 2026) : https://www.hippocast.fr/blog/temoignages-detudiants-les-astuces-pour-reussir-en-pass-et-las
- L'Étudiant, santé mentale (28 nov. 2024) : https://www.letudiant.fr/etudes/medecine-sante/sante-mentale-un-etudiant-en-medecine-sur-deux-presente-des-symptomes-anxieux.html
- L'Étudiant, première année de santé (28 mai 2019) : https://www.letudiant.fr/etudes/medecine-sante/pass-et-las-comment-survivre-a-la-premiere-annee-d-etudes-de-sante.html

### Rétention et séries

- GetStream (22 janv. 2026) : https://getstream.io/blog/app-retention-guide/
- UXCam (21 avril 2026) : https://uxcam.com/blog/mobile-app-retention-benchmarks/
- Appcues (19 mai 2026) : https://www.appcues.com/blog/app-retention-is-hard-heres-how-to-improve-it
- Duolingo (19 nov. 2020) : https://blog.duolingo.com/improving-the-streak
- Duolingo (31 janv. 2022) : https://blog.duolingo.com/how-duolingo-streak-builds-habit

### Littérature scientifique

Articles issus de PubMed :
- Baumel A. et al., 2019, J Med Internet Res : https://doi.org/10.2196/14567
- Gilbert M. M. et al., 2023, Med Sci Educ : https://doi.org/10.1007/s40670-023-01826-8
- Levy J. et al., 2023, J Med Educ Curric Dev : https://doi.org/10.1177/23821205231205389
- Magro J. et al., 2024, Clin Teach : https://doi.org/10.1111/tct.13798
- Mehta A. et al., 2023, Med Sci Educ : https://doi.org/10.1007/s40670-023-01839-3

Hors PubMed :
- Diefenbach S., Müssig A., 2019, Int J Hum-Comput Stud : https://epub.ub.uni-muenchen.de/77668/ (DOI 10.1016/j.ijhcs.2018.09.004)
- Hanus M. D., Fox J., 2015, Computers & Education (résumé lu via extrait) : https://www.semanticscholar.org/paper/Assessing-the-effects-of-gamification-in-the-A-on-Hanus-Fox/dff76a9862467d426113ec530f83942016ae3a97 (DOI 10.1016/j.compedu.2014.08.019)

### PWA sur iOS et blocage d'applis

- WebKit, notifications (16 févr. 2023) : https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/
- WebKit, Safari 17.0 (18 sept. 2023) : https://webkit.org/blog/14445/webkit-features-in-safari-17-0/
- WebKit, Safari 18.4 (31 mars 2025) : https://webkit.org/blog/16574/webkit-features-in-safari-18-4/
- WebKit, politique de stockage (extrait) : https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
- TechCrunch, revirement d'Apple dans l'UE (1er mars 2024) : https://techcrunch.com/2024/03/01/apple-reverses-decision-about-blocking-web-apps-on-iphones-in-the-eu/
- heise, iOS 26 (10 oct. 2025) : https://www.heise.de/en/news/iOS-26-and-iPadOS-26-Changed-web-app-behaviour-on-the-home-screen-10749652.html
- Firtman, notes PWA iOS (6 juin 2023) : https://firt.dev/notes/pwa-ios/
- web.dev, invite d'installation (9 mars 2022) : https://web.dev/learn/pwa/installation-prompt
- web.dev, promouvoir l'installation (4 juin 2019) : https://web.dev/articles/promote-install
- MagicBell (20 mars 2026, contient une information périmée sur l'UE) : https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide
- CoderCops (22 mai 2026) : https://blog.codercops.com/blog/progressive-web-apps-2026
- OJapp (16 juill. 2026) : https://tips.ojapp.app/en/pwa-ios-2026-complete-guide/
- Monterail : https://www.monterail.com/blog/pwa-for-apple-ios
- Brainhub (5 juin 2025) : https://brainhub.eu/library/pwa-on-ios
- Forum développeurs Apple, écran blanc : https://developer.apple.com/forums/thread/728426
- Progressier, statistiques PWA : https://progressier.com/pwa-stats
- Riedel, état de l'API Temps d'écran (14 sept. 2024) : https://riedel.wtf/state-of-the-screen-time-api-2024/
- Apple, autorisation Family Controls (extrait) : https://developer.apple.com/documentation/familycontrols/requesting-the-family-controls-entitlement

### Coûts et cadre légal

- Supabase, tarifs : https://supabase.com/pricing
- Supabase, quotas temps réel : https://supabase.com/docs/guides/realtime/quotas
- Supabase, courriels : https://supabase.com/docs/guides/auth/auth-smtp
- Vercel, tarifs : https://vercel.com/pricing
- Vercel, usage raisonnable (14 sept. 2026) : https://vercel.com/docs/limits/fair-use-guidelines
- Resend, tarifs : https://resend.com/pricing
- DSA, article 16 : https://www.eu-digital-services-act.com/Digital_Services_Act_Article_16.html
- DSA, article 19 : https://www.eu-digital-services-act.com/Digital_Services_Act_Article_19.html
- Commission européenne, questions-réponses DSA : https://digital-strategy.ec.europa.eu/en/faqs/digital-services-act-questions-and-answers
