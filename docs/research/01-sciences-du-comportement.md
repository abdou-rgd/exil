# 01 — Sciences du comportement : que dit la recherche sur les mécaniques du projet ?

> Rapport de recherche documentaire — rédigé fin septembre 2026.
> Objet : évaluer, à la lumière de la littérature scientifique (motivation, formation des habitudes, gamification), les mécaniques de jeu prévues pour l'application de révision « RPG » destinée à des étudiant·e·s d'université.
> Ce document ne contient aucun code. Il sert à décider quoi **garder / ajuster / éviter / ajouter**.

---

## 0. Méthode, niveaux de vérification et limites de cette recherche

### Comment la recherche a été menée

- Recherche web réelle (moteur de recherche, pages d'éditeurs, PubMed / Europe PMC, PubMed Central, ERIC, OpenAlex, Crossref, blogs officiels d'entreprises, PDF d'articles quand ils étaient accessibles).
- Priorité aux méta-analyses et aux études primaires de référence ; les données d'entreprise (Duolingo) sont signalées comme telles.
- Plusieurs résumés ont été obtenus **via PubMed** ; tous les articles concernés sont cités avec leur DOI dans la liste de références.

### Niveau de vérification de chaque source

Chaque référence de la bibliographie porte une étiquette :

| Étiquette | Signification |
|---|---|
| **[A]** | Texte intégral, PDF ou résumé officiel consulté directement (éditeur, PubMed/Europe PMC, PMC, PDF de l'article). |
| **[B]** | Résumé et métadonnées obtenus par une base bibliographique (OpenAlex, Crossref, ERIC, dépôt institutionnel). Texte intégral non lu. |
| **[C]** | Connu uniquement par le résumé affiché dans les résultats de recherche ou par une source secondaire (communiqué d'université, synthèse). À manier avec plus de prudence. |
| **[E]** | Donnée d'entreprise non évaluée par les pairs (blog, newsletter, podcast). |

### Limites à connaître avant de lire

1. **Quota de recherche atteint en cours de route.** L'outil de recherche web a atteint son plafond de session après une quarantaine de requêtes, puis l'outil de lecture de pages a lui aussi atteint sa limite en fin de travail. Les thèmes 5 à 8 ont donc été documentés surtout par accès direct à des bases bibliographiques, pas par exploration libre du web. Il est possible que des études pertinentes récentes m'aient échappé.
2. **Éditeurs inaccessibles.** ScienceDirect (captcha), Wiley, SAGE, ACM et INFORMS ont bloqué la lecture automatique. Je n'ai contourné aucun de ces blocages. Conséquence : plusieurs articles ne sont connus que par leur résumé ([B] ou [C]).
3. **Les chiffres de conception que je propose** (nombre de jokers, seuil d'heures, taille des guildes, multiplicateurs d'XP) sont des **propositions raisonnées**, pas des valeurs établies par une étude. Ils sont toujours signalés par la mention « proposition de conception ».
4. Une liste explicite de **ce que je n'ai pas pu vérifier** figure en section 10.

### Rappel : comment lire une taille d'effet

- *d* de Cohen / *g* de Hedges : différence entre deux groupes exprimée en écarts-types. Repères usuels : 0,2 = petit, 0,5 = moyen, 0,8 = grand.
- Une méta-analyse avec une forte hétérogénéité (I² élevé) signifie que l'effet moyen cache des résultats très différents selon les contextes : la moyenne ne prédit pas ce qui se passera dans *votre* application.

---

## 1. La gamification fonctionne-t-elle pour apprendre et pour le travail personnel ?

### Ce que dit la littérature

**Effet moyen : positif, petit à moyen, très variable.**

| Méta-analyse | Résultat principal | Points notables |
|---|---|---|
| Sailer & Homner 2020 [1] | Apprentissages cognitifs *g* = 0,49 (IC 95 % 0,30–0,69 ; k = 19) ; motivationnels *g* = 0,36 (0,18–0,54 ; k = 16) ; comportementaux *g* = 0,25 (0,04–0,46 ; k = 9) | En ne gardant que les études rigoureuses : l'effet cognitif tient (*g* = 0,42), mais les effets motivationnel (*g* = 0,22, *p* = 0,20) et comportemental (*g* = 0,27, *p* = 0,22) **ne sont plus significatifs**. |
| Bai, Hew & Huang 2020 [2] | *g* = 0,504 (0,284–0,723) ; 30 interventions | Effet plus fort pour des durées de 1 à 3 mois. Volet qualitatif : les étudiants apprécient le retour sur leur performance et la fixation d'objectifs ; ils reprochent l'absence d'utilité réelle et **l'anxiété ou la jalousie**. |
| Huang et al. 2020 [3] | *g* = 0,464 (0,244–0,684) ; 30 études, N = 3 083 | 14 éléments de jeu examinés, aux effets différents (détail non accessible, voir section 10). |
| Kim & Castelli 2021 [4] | *d* = 0,48 (0,33–0,62) ; 18 études | Durée : quelques jours *d* = 1,57 ; 2 à 16 semaines *d* = 0,39 ; 1 à 2 ans *d* = **−0,20** (IC −0,47 à 0,09). **Étudiants d'université : *d* = 0,15 (IC −0,04 à 0,35), non significatif.** |
| Li, Ma & Shi 2023 [5] | *g* = 0,822 (0,567–1,078) ; 49 échantillons | **Enseignement supérieur : *g* = 0,014** (contre 1,293 au primaire). Moins d'une semaine : *g* = 1,874 ; 1 à 3 mois : 0,519 ; 3 mois à un semestre : 0,480. |
| Zeng et al. 2024 [6] | *g* = 0,782 ; 22 études | — |
| Dai, Xu & Xing 2025 [7] | *d* = 0,566 ; 37 essais, 182 tailles d'effet | Meilleure combinaison : règles/objectifs + défi + mystère. La durée et le domaine modèrent l'effet. |
| Gyedu et al. 2026 [8] (supérieur uniquement) | *d* = 1,12 (0,42–1,83) ; 22 études | Hétérogénéité extrême (I² = 98,84 %) : moyenne peu interprétable. |
| **Kanadli & Sancar-Tokmak 2026 [9]** (méta-analyse de 10 méta-analyses) | Après correction du biais de publication : performance ***g* = 0,316**, motivation/engagement ***g* = 0,183** | **Les intervalles de prédiction incluent des valeurs négatives** : dans certains contextes, la gamification n'aide pas, voire nuit. |

**Motivation intrinsèque et besoins psychologiques.** Li, Hew & Du 2024 [10] (35 interventions, 2 500 participants) : effet faible sur la motivation intrinsèque (*g* = 0,257), plus net sur l'autonomie perçue (*g* = 0,638) et le lien social (*g* = 1,776), minime sur le sentiment de compétence (*g* = 0,277).

**Effet de nouveauté.**
- Rodrigues et al. 2022 [12] (environ 750 étudiants brésiliens, 14 semaines, quasi-expérimental) : effet fort les premières semaines, **creux vers les semaines 4 à 6**, puis remontée partielle jusqu'à la semaine 14 (« effet de familiarisation »). Courbe en U.
- Sanchez, Langer & Kaur 2020 [14] (473 étudiants) : l'avantage des quiz gamifiés ne se maintient pas dans le temps ; **les meilleurs étudiants en profitent davantage que les plus faibles**.
- Tsay et al. 2020 [13] : sur deux ans, l'engagement se maintient mieux la deuxième année, après révision du dispositif.
- Kim & Castelli 2021 [4] concluent que la nouveauté explique probablement une bonne part des effets.

**Quels éléments de jeu font quoi ?**
- Sailer et al. 2017 [17] (essai randomisé) : badges, classements et graphiques de performance nourrissent le sentiment de compétence ; **avatars, histoire porteuse de sens et coéquipiers nourrissent le lien social**. Aucun élément testé n'a augmenté la liberté de décision perçue.
- Mekler et al. 2017 [16] : points, niveaux et classements augmentent la **quantité** produite, sans effet sur la motivation intrinsèque ni sur la compétence perçue. Ils fonctionnent comme des incitations extrinsèques.
- Koivisto & Hamari 2019 [11] (819 études recensées) : résultats globalement positifs, mais la proportion de résultats mitigés est « remarquable ».

**Applications d'auto-organisation (le cas le plus proche du projet).** Les preuves sont minces :
- Diefenbach & Müssig 2019 [18], sur Habitica (45 utilisateurs, 2 semaines) : **tous** les participants ont subi des effets contre-productifs, par exemple être puni par l'application pendant une période très productive, ou reformuler ses tâches pour éviter les sanctions.
- Zhang 2022 [19] (70 étudiants, Habitica) : pas de gain d'apprentissage significatif, motivation extrinsèque plus basse.
- En formation en santé, les méta-analyses sont favorables (par exemple Chen et al. 2026 [20] : connaissances SMD = 0,81, dont 0,55 pour les dispositifs web et mobiles), mais il s'agit de jeux **intégrés au contenu d'un cours**, pas d'un suivi de temps de travail.

### Solidité des preuves

**Modérée pour un effet positif à court terme ; faible pour le long terme ; faible pour des étudiants d'université en travail autonome.**

- Beaucoup d'études quasi-expérimentales, courtes, avec des mesures hétérogènes.
- L'effet diminue quand on corrige le biais de publication [9] et quand on ne garde que les études rigoureuses [1].
- Deux méta-analyses sur trois qui isolent le supérieur trouvent un effet proche de zéro [4, 5] ; la troisième [8] est très hétérogène.
- Presque toutes les études portent sur une gamification **pilotée par un enseignant dans un cours**. Une application libre, choisie par l'étudiant, est un contexte peu étudié.

### Implication concrète pour l'app

| Verdict | Recommandation |
|---|---|
| **GARDER** | L'habillage RPG : avatar, histoire, coéquipiers. Ce sont les éléments associés au lien social [17], le besoin le mieux servi par la gamification [10]. |
| **GARDER** | Les graphiques de progression personnelle : ils soutiennent le sentiment de compétence [17]. |
| **AJUSTER** | Ne pas compter sur les points et niveaux pour créer de la motivation durable : ils poussent la quantité, pas la qualité [16]. Le jeu est un **emballage** autour de pratiques qui marchent (sections 4 et 6), pas le moteur. |
| **AJOUTER** | Prévoir le creux des semaines 4 à 6 [12] : contenu débloqué progressivement, bilan à un mois, nouveauté modérée. Juger le succès sur la rétention à 6–8 semaines, pas à 7 jours. |
| **AJOUTER** | Un protocole d'auto-évaluation avec le groupe d'amis : puisque la littérature ne garantit rien pour ce public, mesurer soi-même (régularité, stress ressenti, utilité perçue) à 1, 2 et 3 mois. |
| **ÉVITER** | Toute promesse du type « la gamification améliore les résultats ». L'effet attendu chez des étudiants d'université est faible et incertain. |

---

## 2. Les récompenses extrinsèques sapent-elles la motivation intrinsèque ?

### Ce que dit la littérature

**La méta-analyse de référence : Deci, Koestner & Ryan 1999 [21]** (128 expériences). Chiffres relevés dans l'article lui-même, mesure comportementale « temps libre passé sur l'activité » :

| Type de récompense | Effet sur la motivation intrinsèque |
|---|---|
| Retour verbal positif | **+0,33** (étudiants d'université : +0,43 ; enfants : +0,11, non significatif) |
| Récompense tangible **inattendue** | **+0,01** (IC −0,20 à 0,22) : aucun effet |
| Récompense indépendante de la tâche | −0,14 (IC −0,39 à 0,11) : non significatif |
| Récompense conditionnée à la performance | −0,28 |
| Récompense conditionnée à l'achèvement | −0,36 |
| Récompense conditionnée à la simple **participation** | **−0,40** (étudiants d'université : −0,21) |
| Toutes récompenses tangibles attendues | −0,36 |

Trois précisions essentielles pour ne pas sur-interpréter :
1. Il s'agit de récompenses **tangibles** (argent, prix) pour des tâches **déjà intéressantes**, en laboratoire.
2. Le débat n'est pas clos. Cameron, Banko & Pierce 2001 [23] concluent que les récompenses ne nuisent pas en général et qu'elles **augmentent** la motivation pour les tâches peu intéressantes. Lepper et al. 1999 [22] jugent l'analyse de Deci et al. plus fidèle à la littérature.
3. Cerasoli, Nicklin & Ford 2014 [24] (183 études, N = 212 468) : motivation intrinsèque et incitations ne sont pas forcément antagonistes. La motivation intrinsèque prédit surtout la **qualité**, les incitations surtout la **quantité**. Plus l'incitation est directement liée à la performance, moins la motivation intrinsèque pèse.

**Dans les applications gamifiées.**
- Hanus & Fox 2015 [15] (environ 80 étudiants, 16 semaines, classement + badges) : motivation, satisfaction et sentiment de maîtrise **en baisse** dans le cours gamifié, notes finales plus basses, effet passant par la motivation intrinsèque.
- Mekler et al. 2017 [16] : les points ne détruisent pas la motivation intrinsèque, mais ne la créent pas non plus.
- Etkin 2016 [26] (6 expériences) : le simple fait de **mesurer** une activité agréable augmente la quantité réalisée mais réduit le plaisir, puis l'engagement futur. La mesure transforme le loisir en travail.
- Li, Hew & Du 2024 [10] : les deux difficultés récurrentes des dispositifs gamifiés sont le manque de compétence perçue et le manque d'autonomie perçue.

**Théorie de l'autodétermination.** Dans les jeux vidéo, la satisfaction des besoins d'autonomie, de compétence et de lien social prédit le plaisir et l'envie de rejouer [25]. Une récompense nuit quand elle est vécue comme un **contrôle** ; elle aide quand elle est vécue comme une **information** sur sa compétence [21].

### Solidité des preuves

**Forte** pour l'existence d'un effet de sape avec des récompenses tangibles attendues sur des tâches intéressantes (grande méta-analyse, mais en laboratoire et contestée sur sa généralité). **Faible à modérée** pour la transposition aux points virtuels d'une application : peu d'études, résultats contradictoires.

### Implication concrète pour l'app

Point d'attention majeur : **des XP accordés à la minute passée avec le minuteur sont une récompense « conditionnée à la participation »**, la catégorie au plus fort effet de sape dans [21]. Le risque est atténué par deux faits : les XP sont symboliques, et réviser est rarement une activité intrinsèquement plaisante [23]. Mais il reste réel pour les matières qu'un étudiant aime déjà [26].

| Verdict | Recommandation |
|---|---|
| **AJUSTER** | Formuler les XP comme une **information**, pas comme un contrat. Préférer « Tu as tenu 4 de tes 5 engagements cette semaine » à « Fais 2 heures pour gagner 200 XP ». |
| **AJUSTER** | Faire dépendre les XP surtout des **engagements tenus** et de la **méthode**, et peu du temps brut (voir section 6). |
| **GARDER** | Les suggestions facultatives et bienveillantes : elles protègent l'autonomie. Toujours donner la raison d'une suggestion (voir section 7). |
| **AJOUTER** | De petits bonus **inattendus** après coup (effet nul sur la motivation intrinsèque [21]), plutôt que des récompenses annoncées. Les garder modestes, gratuits et cosmétiques (voir section 8 sur les mécaniques de hasard). |
| **AJOUTER** | Des retours verbaux précis sur la progression (effet +0,43 chez les étudiants [21]). |
| **AJOUTER** | Un mode « sans chiffres » : masquer XP et compteurs pendant la séance, pour celles et ceux chez qui la mesure gâche le plaisir [26]. |
| **ÉVITER** | Les sanctions (perte de points de vie, d'équipement) : c'est la source principale des effets contre-productifs observés sur Habitica [18]. |

---

## 3. Les séries de jours (streaks)

### Ce que dit la littérature

**Les séries motivent, et c'est leur représentation qui compte.** Silverman & Barasch 2023 [27] (7 études) : afficher une série intacte augmente l'engagement ultérieur par rapport à une série brisée, **indépendamment du comportement réel passé**. Maintenir la série devient un but en soi. Mehr et al. 2025 [30] (6 études préenregistrées, N = 4 493) : des incitations « en série » augmentent la persévérance plus que des récompenses stables plus élevées.

**Les séries brisées démotivent.** Toujours selon [27] : l'effet négatif est **plus fort quand la personne s'attribue la rupture** et **atténué quand la série peut être réparée**. D'après les communiqués des universités des auteures [28, 29] (sources secondaires) : après une rupture, les utilisateurs d'une application de langues tendaient à changer de langue plutôt qu'à reconstruire leur série ; les auteures déconseillent de notifier l'échec et recommandent d'offrir d'autres façons de prolonger la série.

**L'effet « tant pis, foutu pour foutu ».** Sharif & Shu 2021 [33] résument cette littérature (Cochran & Tesser 1996 [42] ; Polivy ; Soman & Cheema 2004) : après un petit écart, certaines personnes abandonnent complètement leur objectif.

**Les objectifs avec marge intégrée : les « réserves d'urgence ».** Sharif & Shu 2021 [33], étude de terrain lue en texte intégral : 273 étudiants et personnels randomisés, objectif de pas quotidien, 4 semaines.

| Condition | Jours d'objectif atteint par semaine | Probabilité de réussir le lendemain d'un échec |
|---|---|---|
| Difficile : 7 jours sur 7 | 2,83 | 0,37 |
| Facile : 5 jours sur 7 | 3,11 | 0,44 |
| **7 jours + 2 « jokers d'urgence » par semaine** | **4,00** | **0,55** |
| 7 jours + 8 jokers par mois | 3,82 | 0,48 |

Les conditions « facile » et « jokers » sont **objectivement équivalentes**, mais la formulation avec jokers fait mieux. Mécanisme proposé : le joker transforme un sentiment d'échec en sentiment de progression continue ; et comme il a un coût psychologique, on hésite à le dépenser [32, 33, 34].

**Routine rigide ou flexible ?** Beshears et al. 2021 [35] (2 508 salariés, essai de terrain lu en texte intégral) : payer les gens pour aller à la salle dans un créneau fixe de 2 heures produit **moins** de visites que les payer quel que soit l'horaire (−0,19 visite par semaine pendant l'intervention), et l'habitude retombe plus vite ensuite.

**Données Duolingo** (entreprise, non évaluées par les pairs) :
- Amulette de week-end (protection achetée à l'avance) : +4 % de retour une semaine plus tard, −5 % de séries perdues [36].
- Passage de 1 à 2 « gels de série » : +0,38 % d'utilisateurs actifs quotidiens [37].
- Les utilisateurs qui enchaînent beaucoup de leçons d'un coup abandonnent plus que ceux qui se dosent [36].
- Simplifier la règle (une leçon par jour suffit) a rendu la série plus efficace, selon le responsable produit (sans chiffre publié) [39].
- Duolingo revendique explicitement l'usage de **l'aversion à la perte** [37].

**Les pauses sont normales.** Lau, Mitchell & Faulkner 2022 [40] (41 207 utilisateurs d'une application d'activité physique, 12 mois) : faire des pauses puis revenir est le schéma habituel. Délai médian avant la première pause : 18 semaines.

### Solidité des preuves

**Modérée à forte** sur le pouvoir motivant des séries et sur l'effet démotivant des ruptures (expériences répétées, échantillons importants). **Modérée** sur les réserves d'urgence (une étude de terrain et des études en laboratoire, une seule équipe, domaine de l'activité physique). **Anecdotique** pour les chiffres Duolingo. **Aucune étude trouvée** sur les séries appliquées spécifiquement aux révisions universitaires.

### Implication concrète pour l'app

**Les jours de repos planifiés qui ne cassent pas la série sont-ils soutenus par la recherche ? Oui dans l'esprit, avec deux compléments nécessaires.**

Le repos planifié correspond à la flexibilité qui protège la série [35, 36]. Mais il ne couvre pas le cas le plus dangereux : **l'échec imprévu, que l'on s'attribue à soi-même** [27]. Et la recherche suggère qu'une marge présentée comme un joker motive plus qu'un objectif simplement abaissé [33].

| Verdict | Recommandation |
|---|---|
| **GARDER** | Les jours de repos planifiés. Les compter comme un **engagement tenu** (« repos respecté »), cohérent avec la philosophie anti-surmenage. |
| **AJOUTER** | Des **jokers** pour les imprévus, utilisables après coup. Proposition de conception : 2 par semaine, non cumulables, puisque la version hebdomadaire a fait au moins aussi bien que la version mensuelle [33]. |
| **AJOUTER** | Une **réparation de série** : fenêtre de rattrapage après une rupture [27]. |
| **AJUSTER** | Compter la série sur les **jours prévus tenus**, pas sur les jours calendaires consécutifs. L'objectif hebdomadaire est choisi par l'étudiant (par exemple 5 jours de travail, 2 de repos). |
| **AJUSTER** | Seuil quotidien bas (proposition : un pomodoro suffit), à l'image de la simplification rapportée par Duolingo [39]. |
| **AJOUTER** | Des compteurs **impossibles à perdre** à côté de la série : total de jours travaillés, « 23 jours tenus sur les 30 derniers ». |
| **ÉVITER** | Toute notification d'échec ou de menace (« ta série va disparaître »). Déconseillé par les auteures de [27] et contraire à la philosophie du projet. |
| **ÉVITER** | Un créneau horaire imposé pour valider la journée [35]. |
| **AJOUTER** | Un parcours de **retour après pause** accueillant, sans reproche : les pauses sont la norme [40]. |

Alternative « 4 jours sur 7 » : acceptable, mais dans [33] l'objectif simplement réduit (3,11 jours) fait moins bien que l'objectif complet avec jokers (4,00 jours). La formule recommandée est donc **objectif personnel + repos planifiés + jokers + réparation**.

---

## 4. Formation des habitudes

### Ce que dit la littérature

**Combien de temps ?**
- Lally et al. 2010 [43, 44] : 96 volontaires, 84 jours. Le temps pour atteindre le plateau d'automaticité va de **18 à 254 jours**, valeur centrale 66 jours. Environ la moitié des participants n'avaient pas atteint le plateau à la fin de l'étude.
- Singh et al. 2024 [45] (revue systématique, 20 études, 2 601 participants) : médianes de 59 à 66 jours, moyennes de 106 à 154 jours, variabilité individuelle de **4 à 335 jours**. Les auteurs recommandent de s'attendre à 2 à 5 mois. Gain moyen d'automaticité après intervention : SMD = 0,69.
- Buyalskaya et al. 2023 [46] (12 millions d'observations en salle de sport) : il faut des mois pour l'exercice, des semaines pour le lavage des mains. **Attention** : l'article a fait l'objet d'un correctif ; l'estimation pour la salle de sport est passée de 4–7 mois à **68–78 jours**.

**Qu'est-ce qui aide ?**
- Un **contexte stable** : une habitude est une association entre un signal (lieu, moment, action précédente) et une réponse, acquise par répétition dans des circonstances stables [47, 48]. Singh et al. [45] retrouvent ce facteur, ainsi que : la fréquence, la pratique le matin, **le fait d'avoir choisi soi-même l'habitude**, le plaisir ressenti, la planification.
- Les **plans « si… alors… »** (intentions de mise en œuvre) : Gollwitzer & Sheeran 2006 [49], 94 études, *d* = 0,65 sur l'atteinte des objectifs ; *d* = 0,61 pour réussir à démarrer, *d* = 0,77 pour ne pas dérailler. Sheeran, Listrom & Gollwitzer 2024 [50], 642 tests : effets de *d* = 0,27 à 0,66, plus grands quand le plan a la forme si-alors, quand la personne est motivée et quand le plan est répété.
- Le **suivi de ses progrès** : Harkin et al. 2016 [51], 138 études, N = 19 951 : *d* = 0,40 sur l'atteinte des objectifs, davantage quand le suivi est noté physiquement et rendu public.

**Que se passe-t-il quand on rate un jour ?** Dans Lally et al. [43, 44], **manquer une occasion isolée n'a pas affecté de façon notable** la formation de l'habitude. Ce sont les manques répétés qui pèsent.

**Nuance importante.** Contexte stable ne veut pas dire horaire rigide : imposer un créneau fixe par des incitations a produit des habitudes **plus fragiles** [35].

### Solidité des preuves

**Forte** pour les plans si-alors (grandes méta-analyses) et pour le suivi des progrès. **Modérée** pour les durées (peu d'études, risque de biais élevé selon [45], comportements de santé et non de révision). **Modérée** pour le rôle du contexte (théorie solide, données surtout corrélationnelles).

### Implication concrète pour l'app

| Verdict | Recommandation |
|---|---|
| **AJOUTER** | À l'inscription, faire rédiger un **plan si-alors** : « Après mon cours de 14 h, je lance un pomodoro à la BU ». C'est l'idée la mieux étayée et la moins coûteuse de tout ce rapport. |
| **AJOUTER** | Un **plan de secours** : « Si je rate mon créneau, alors je fais un pomodoro avant le dîner ». |
| **AJOUTER** | Encourager un **signal stable** (même lieu, même enchaînement) sans imposer d'heure [35]. |
| **GARDER** | Laisser l'étudiant choisir ses objectifs : les habitudes choisies soi-même sont plus fortes [45]. |
| **AJUSTER** | Concevoir pour **un semestre**, pas pour 21 jours. Les jalons de progression doivent s'étaler sur 2 à 5 mois. |
| **AJOUTER** | Après un jour manqué, afficher un message vrai et rassurant : un jour raté isolé ne compromet pas l'habitude [43]. |
| **GARDER** | Le journal de séances : le suivi des progrès est efficace en lui-même [51]. |

---

## 5. Mécaniques sociales

### Ce que dit la littérature

**Coopération ou compétition ?**
- Morschheuser, Hamari & Maedche 2019 [52] (expérience de terrain) : la **compétition entre équipes** produit le plus de plaisir, de participation et d'envie de recommander. La coopération favorise la recommandation.
- Sailer & Homner 2020 [1] : pour les apprentissages comportementaux, combiner compétition et collaboration fait mieux que la compétition seule ou l'absence d'interaction.
- **Résultat qui contredit l'intuition du projet** : essai randomisé STEP UP, Patel et al. 2019 [53] (602 adultes, 24 semaines + 12 de suivi). Gain en pas quotidiens par rapport au groupe témoin : compétition +920, soutien +689, collaboration +637. **Au suivi, seule la compétition garde un effet** (+569).
- Chen et al. 2020 [54] (analyse secondaire de STEP UP) : tout dépend du profil. Les personnes « peu actives et peu sociables » répondent aux trois formes ; les « extraverties et motivées » seulement à la compétition ; les « peu motivées et à risque » à **aucune**.
- Murayama & Elliot 2012 [55] : en moyenne, **pas de lien notable** entre compétition et performance. La compétition active à la fois l'envie de réussir (qui aide) et la peur d'échouer (qui nuit) ; les deux s'annulent.

**Classements.**
- Défavorable : Hanus & Fox 2015 [15] (voir section 2). Toda et al. 2018 [56] : le classement est l'élément le plus souvent associé à des effets négatifs, le plus fréquent étant la baisse de performance. Almeida et al. 2023 [57] (87 articles) : badges, classements, compétitions et points sont les éléments les plus souvent mis en cause. Michinov & Michinov 2026 [59] : le classement réduit les échanges entre étudiantes.
- Favorable : Li et al. 2024 [58] (revue systématique, 22 études) : effets positifs possibles, mais **très dépendants de la conception**, et la moitié des études durent moins d'une heure.
- Donnée d'entreprise : chez Duolingo, les ligues ont augmenté le temps d'apprentissage de 17 % [38].

**Effet Köhler : le groupe peut tirer les plus faibles vers le haut.**
- Weber & Hertel 2007 [60] (17 études, N = 2 240) : gain de motivation des membres les moins performants, *g* = 0,60.
- Mécanismes : comparaison avec un partenaire un peu meilleur, et sentiment d'être **indispensable** au groupe [61].
- Irwin et al. 2012 [63] : sur vélo, 21,9 minutes quand l'arrêt du plus faible arrête le groupe, 19,8 minutes côte à côte sans enjeu commun, 10,6 minutes seul. Même avec un partenaire virtuel [62].

**Paresse sociale : le risque des efforts mis en commun.**
- Karau & Williams 1993 [64] (78 études) : on fournit moins d'effort quand sa contribution est fondue dans celle du groupe. L'effet est robuste.
- Modérateurs principaux : la possibilité d'être évalué, les attentes envers les autres, le sens de la tâche, la culture. D'après une source tertiaire [65], l'effet diminue entre personnes qui se connaissent et disparaît dans les groupes auxquels on tient.

**Travailler en présence d'autres (coworking, *body doubling*, salles d'étude virtuelles).**
- Bond & Titus 1983 [66] (241 études, près de 24 000 participants) : la présence d'autrui a de **petits** effets (0,3 à 3 % de la variance). Elle accélère les tâches simples et **dégrade la performance sur les tâches complexes**.
- Eagle et al. 2024 [67] : enquête auprès de 220 personnes neurodivergentes. Le *body doubling* sert à démarrer et à rester sur la tâche. Données déclaratives.
- Lee et al. 2021 [68] : 12 entretiens sur les vidéos « study with me ». Les utilisateurs y cherchent une ambiance, une **pression des pairs contrôlable** et un soutien émotionnel.
- Kim & Ryoo 2025 [69] (519 apprenants) : les utilisateurs de « study with me » structurent davantage leur environnement. Étude corrélationnelle.
- **Je n'ai trouvé aucun essai contrôlé** montrant que ces pratiques améliorent l'apprentissage.

**Engagement public.** Epton et al. 2017 [70] (141 articles, N = 16 523) : se fixer un objectif a un effet *d* = 0,34, plus grand quand l'objectif est difficile, **annoncé publiquement** ou **fixé en groupe**. Même constat pour le suivi rendu public [51].

**Pression sociale et culpabilité.** Je n'ai trouvé **aucune étude contrôlée** sur les mécaniques du type « ton absence pénalise l'équipe ». Indices indirects : les sanctions de Habitica sont mal vécues [18] ; des jeunes utilisateurs d'une application de sevrage sont partagés sur les fonctions sociales, certains préférant avancer en privé [74].

**Récompenses de parrainage.**
- Gershon, Cryder & John 2020 [71] (2 expériences de terrain et plusieurs en laboratoire) : récompenser **la personne invitée** est aussi efficace pour susciter l'invitation et **plus efficace** pour obtenir l'inscription que récompenser celui qui invite.
- Ryu & Feick 2007 [72] : entre proches, donner au moins une partie de la récompense à l'invité fonctionne mieux.
- Duolingo [38] : un programme de parrainage n'a rapporté que +3 % de nouveaux utilisateurs.
- L'étude souvent citée de Heyman & Ariely 2004 sur « normes sociales contre normes marchandes » fait l'objet d'un **avis de préoccupation de l'éditeur (2021)** [73]. Je ne m'appuie pas dessus.

### Solidité des preuves

**Forte** pour la paresse sociale et l'effet Köhler (méta-analyses), mais issues du laboratoire et de tâches physiques ou simples. **Modérée** pour coopération contre compétition (résultats contradictoires selon les contextes et les profils). **Faible** pour le coworking et le *body doubling* (déclaratif, qualitatif). **Absente** pour la culpabilité liée aux mécaniques d'équipe.

### Implication concrète pour l'app

**Tension centrale à connaître.** Pour éviter la paresse sociale, il faut que la contribution de chacun soit **visible** [64]. Mais rendre visibles les heures de chacun crée la comparaison sociale que le projet veut éviter. La sortie proposée : rendre visible non pas le volume, mais **le respect de son propre objectif**.

| Fonction | Verdict | Recommandation |
|---|---|---|
| Entraide plutôt que compétition | **GARDER, en connaissance de cause** | Choix défendable pour le bien-être (section 7), mais il fait renoncer à un levier d'engagement réel [53, 38]. Compenser par un adversaire commun : la guilde contre le boss (inférence de conception, non testée). |
| Boss de guilde alimentés par l'effort cumulé | **AJUSTER** | Calculer la contribution en **pourcentage de l'objectif personnel atteint**, pas en heures. Un étudiant qui vise 1 h et la fait pèse autant que celui qui vise 4 h et les fait. Chacun devient indispensable [61], personne n'est comparé en volume. |
| Taille des guildes | **AJUSTER** | Petits groupes de personnes qui se connaissent (proposition : 3 à 6) : c'est là que la paresse sociale est la plus faible [64, 65]. |
| Sanction collective quand un membre manque | **ÉVITER** | Pas de dégâts infligés au groupe. Préférer un bonus quand tout le monde a tenu, de faible valeur, affiché sans nommer personne (« 4 membres sur 5 »). À tester avec le groupe d'amis. |
| Séances de groupe, minuteur partagé, pauses synchronisées | **GARDER** | Utile pour **se mettre au travail et venir** [67, 68, 70]. Ne pas promettre un meilleur apprentissage : la présence d'autrui gêne plutôt les tâches complexes [66]. |
| Bonus d'XP collectif | **AJUSTER** | Le garder petit. Sinon il devient la raison de la séance (section 8). |
| Raids accessibles uniquement à plusieurs | **AJUSTER** | Risque d'exclure les étudiants isolés, et certains profils ne répondent à aucune mécanique sociale [54]. Prévoir une voie solo ou asynchrone vers le même contenu. |
| Récompense pour qui lance une séance ou invite | **AJUSTER** | Récompense **partagée** ou donnée à l'invité [71, 72], symbolique et plafonnée. Ne pas en attendre une forte croissance [38]. |
| Fonctions sociales en général | **AJOUTER** | Tout rendre facultatif, avec contrôle de ce que les autres voient [74]. |

---

## 6. Surmenage et rendements décroissants

### Ce que dit la littérature

**Quantité ou qualité du temps de travail ?**
- Plant, Ericsson, Hill & Asberg 2005 [75] : le temps d'étude ne prédit la moyenne que si l'on tient compte de la **qualité** de l'étude (notamment l'environnement) et du niveau antérieur.
- Macnamara, Hambrick & Oswald 2014 [77] : la pratique délibérée explique seulement **4 %** de la variance de la performance dans le domaine de l'éducation (26 % pour les jeux, 21 % pour la musique). Ericsson conteste ce chiffre en invoquant la définition de la pratique délibérée [79].
- Contrepoids : Stinebrickner & Stinebrickner 2008 [76] montrent, par une expérience naturelle, que le temps d'étude a un **effet causal réel** sur les notes. Le temps compte ; il ne suffit pas.

**Limites quotidiennes de l'effort intense.** Ericsson, Krampe & Tesch-Römer 1993 [78], lu dans le texte :
- La pratique délibérée « ne peut être soutenue que pendant un temps limité chaque jour » sans mener à l'épuisement.
- Les études d'entraînement comparant 1 à 8 heures par jour ne montrent « essentiellement aucun bénéfice au-delà de 4 heures par jour et des bénéfices réduits au-delà de 2 heures ».
- Des séances de moins d'une heure, entrecoupées de repos, sont recommandées.
- Ignorer cette contrainte mène à l'épuisement et à l'abandon.
- Réserve : ces données viennent de la musique, du sport et d'études anciennes, pas de révisions universitaires.

**Fatigue cognitive.**
- Sievertsen, Gino & Piovesan 2016 [80] (tous les élèves des écoles publiques danoises) : chaque heure plus tard dans la journée fait baisser le score de 0,9 % d'écart-type ; une pause de 20 à 30 minutes le remonte de 1,7 %.
- Wiehler et al. 2022 [81] : une journée de travail cognitif exigeant s'accompagne d'une accumulation de glutamate dans le cortex préfrontal et de choix plus impulsifs.
- Albulescu et al. 2022 [82] (22 échantillons, N = 2 335) : les micro-pauses augmentent la vigueur (*d* = 0,36) et réduisent la fatigue (*d* = 0,35), mais **l'effet sur la performance n'est pas significatif** (*d* = 0,16). Pour récupérer d'une tâche très exigeante, il faut probablement plus de 10 minutes.
- Pencavel 2015 [88] : au-delà d'un seuil d'heures, la production augmente de moins en moins.
- Okano et al. 2019 [87] (88 étudiants) : durée, qualité et régularité du sommeil sur le mois précédent expliquent près de 25 % de la variance des résultats. La nuit qui précède l'examen, seule, ne prédit rien.

**Pomodoro : résultats contradictoires.**

| Étude | Résultat |
|---|---|
| Biwer et al. 2023 [83] (87 étudiants, 1 jour) | Pauses systématiques (24/6 ou 12/3 minutes) : meilleure concentration, moins de fatigue, même quantité de travail en moins de temps qu'avec des pauses libres. |
| Smits, Wenzel & de Bruin 2025 [84] (94 étudiants, 2 heures) | Pomodoro : fatigue qui monte **plus vite** et motivation qui baisse plus vite qu'avec des pauses libres. Aucune différence de productivité. Les auteurs ne recommandent aucune technique plus qu'une autre. |
| Göksu, Wiradhany & de Bruin 2026 [85] (176 étudiants) | Aucune différence de performance. Les pauses **libres** donnent une meilleure humeur. |
| Ogut 2025 [86] (revue exploratoire, 32 études) | Bilan favorable, mais seulement 3 essais randomisés (87 participants au total). |

**Quelles méthodes récompenser ?**
- Dunlosky et al. 2013 [89] : utilité **élevée** pour le test d'entraînement et la pratique espacée ; **moyenne** pour l'auto-explication et l'entrelacement ; **faible** pour la relecture, le surlignage **et le résumé**.
- Rowland 2014 [90] : se tester bat la relecture, et les tests de **rappel** font mieux que les tests de reconnaissance.
- Yang et al. 2021 [91] (222 études, 48 478 élèves) : en classe, le test d'entraînement améliore les résultats de *g* = 0,499, davantage quand il y a une **correction**.
- Cepeda et al. 2006 [92] (317 expériences) : espacer les révisions améliore la rétention ; l'espacement optimal grandit avec le délai avant l'examen.

### Solidité des preuves

**Forte** pour les méthodes d'apprentissage (c'est la base la plus solide de tout ce rapport). **Modérée** pour les rendements décroissants (convergence de sources indirectes). **Faible et contradictoire** pour la supériorité du Pomodoro. **Aucune étude** ne fixe un nombre d'heures optimal pour des révisions universitaires.

### Implication concrète pour l'app

**Un plafond souple d'XP quotidien est-il défendable ? Oui.** Il est cohérent avec la contrainte d'effort [78], la fatigue cognitive [80, 81] et l'observation de Duolingo sur les utilisateurs qui se surchargent [36].

**À combien d'heures ?** La littérature ne donne pas de chiffre pour ce public. Le repère le plus proche est « bénéfices réduits au-delà de 2 heures, quasi nuls au-delà de 4 heures » d'effort **intense** [78].

| Verdict | Recommandation |
|---|---|
| **GARDER** | Le principe des XP dégressifs. |
| **AJUSTER** | Proposition de conception : XP pleins jusqu'à environ 3–4 heures de minuteur par jour, puis dégressivité progressive, **jamais zéro et jamais de malus**. Seuil réglable par l'utilisateur dans une fourchette, avec un mode « période d'examens ». |
| **AJOUTER** | **Expliquer la raison** du plafond à l'utilisateur. Un objectif imposé fonctionne aussi bien qu'un objectif choisi, à condition d'être justifié (section 7). |
| **AJUSTER** | Durées de minuteur **réglables** et mode « pauses libres ». Rien ne justifie d'imposer le 25/5 [84, 85]. |
| **AJOUTER** | Proposer une pause longue (plus de 10 minutes) après plusieurs cycles [82]. |
| **GARDER** | Plus d'XP pour les méthodes efficaces : c'est l'idée la mieux étayée du projet. |
| **AJUSTER** | Préciser ce qui est récompensé. Une fiche de synthèse faite **cours ouvert** est un résumé : utilité faible [89]. Une fiche écrite **de mémoire puis corrigée** est un exercice de rappel : utilité élevée [90, 91]. C'est le « de mémoire » et la correction qui comptent. |
| **AJUSTER** | Le rappel libre (restituer sans indice) mérite au moins autant que le QCM [90]. |
| **AJOUTER** | Récompenser **l'espacement** : revenir sur un chapitre plusieurs jours après [89, 92]. Cela s'accorde parfaitement avec la philosophie de régularité. |
| **AJOUTER** | Option facultative : pas d'XP la nuit, pour ne pas encourager à rogner le sommeil [87]. |

---

## 7. Se comparer à soi-même ou aux autres

### Ce que dit la littérature

**La comparaison aux autres fait surtout baisser l'estime de soi.** Gerber, Wheeler & Suls 2018 [94] (méta-analyse sur plus de 60 ans de recherche) : les gens choisissent spontanément de se comparer vers le haut, et la réaction dominante est le **contraste** : on s'évalue plus négativement (effets de −0,65 à −0,75 sur l'évaluation de ses capacités). Petrak, Möller & Wolff 2025 [99] (prépublication, journaux de bord de 130 étudiants et 226 lycéens) : les comparaisons vers le haut font le plus souvent baisser le concept de soi scolaire.

**La compétition n'améliore pas la performance en moyenne** [55], et les classements ont des effets négatifs documentés [15, 56, 57].

**Objectifs de « record personnel ».**
- Burns, Martin & Collie 2018 [96] (368 élèves suivis 3 ans) : se fixer des objectifs de record personnel est associé à un engagement plus élevé, avec un effet qui grandit dans le temps.
- Une étude sur 432 étudiants de master [98] : ces objectifs sont associés à moins d'intentions d'abandon et amortissent l'effet des difficultés liées au cursus.
- Ginns et al. 2018 [97] : la seule **expérience** trouvée (68 élèves de primaire) : le groupe avec objectif de record personnel résout mieux les problèmes d'arithmétique.
- Les auteurs de [97] soulignent eux-mêmes que l'essentiel de cette littérature repose sur des questionnaires.

**Théorie de la fixation d'objectifs.** Locke & Latham 2002 [93], lu dans le texte :
- Des objectifs **précis et difficiles** font mieux que « fais de ton mieux » (*d* de 0,42 à 0,80).
- Un objectif **assigné** est aussi efficace qu'un objectif choisi, **à condition que sa raison soit expliquée**. Assigné sèchement, il fait moins bien.
- Le **retour d'information** est nécessaire : objectif + retour fait mieux qu'objectif seul.
- Pour une tâche **complexe et nouvelle**, un objectif de performance peut nuire (anxiété, stratégies désordonnées). Il vaut mieux un **objectif d'apprentissage**.
- Des objectifs **proches** dans le temps aident sur les tâches complexes.
- Récompenser uniquement l'atteinte d'un objectif très difficile peut faire chuter la performance de ceux qui voient qu'ils ne l'atteindront pas.

**Nuance honnête.** Van Yperen et al. 2014 [95] : les objectifs d'**approche**, qu'ils visent la maîtrise ou la performance, sont associés positivement à la performance ; ce sont les objectifs d'**évitement** qui nuisent. Et la compétition a fonctionné dans un grand essai randomisé [53].

### Solidité des preuves

**Forte** pour la théorie de la fixation d'objectifs. **Forte** pour l'effet de contraste de la comparaison sociale. **Modérée à faible** pour les records personnels (surtout corrélationnel). **Je n'ai trouvé aucune méta-analyse comparant directement** un retour fondé sur sa propre progression et un retour fondé sur la comparaison aux autres dans une application d'apprentissage.

### Implication concrète pour l'app

| Verdict | Recommandation |
|---|---|
| **GARDER** | Ne comparer chaque utilisateur qu'à lui-même. Choix justifié pour le bien-être [94, 15]. À présenter comme un choix de valeurs, pas comme la solution la plus engageante. |
| **AJOUTER** | Un cadrage « record personnel » : « ta meilleure semaine », « toi il y a 4 semaines ». |
| **AJOUTER** | Des objectifs hebdomadaires **précis**, fixés par l'étudiant. Éviter le vague « travailler plus ». |
| **GARDER** | Les suggestions facultatives, **avec leur justification** [93]. |
| **AJUSTER** | Privilégier les objectifs de **processus** (séances tenues, méthodes utilisées) plutôt que de résultat, surtout pour les matières nouvelles et difficiles. |
| **AJOUTER** | Un **bilan hebdomadaire** : objectif, réalisé, écart, ajustement pour la semaine suivante. |
| **ÉVITER** | Les récompenses « tout ou rien » liées à des objectifs très ambitieux. |

---

## 8. Éthique et *dark patterns*

### Ce que dit la littérature

**Cadres d'analyse.** Kim & Werbach 2016 [100] : quatre questions à se poser devant toute gamification. Exploite-t-elle les gens ? Les manipule-t-elle (atteinte à l'autonomie) ? Leur nuit-elle ? Dégrade-t-elle leur caractère ? Gray et al. 2018 [101] : un *dark pattern* est un choix de conception où la valeur pour l'utilisateur est sacrifiée à celle de l'éditeur.

**Effets négatifs documentés.**
- Toda et al. 2018 [56] : perte de performance, indifférence, comportements indésirables, déclin des effets.
- Almeida et al. 2023 [57] : absence d'effet, baisse de performance, problèmes de motivation, et **tricherie avec le système**. Les développeurs interrogés connaissaient mal ces risques.
- Diefenbach & Müssig 2019 [18] : punition en période productive, contournement des règles.
- Bai et al. 2020 [2] : anxiété, jalousie.
- Etkin 2016 [26] : la mesure réduit le plaisir.
- Silverman & Barasch 2023 [27] : la série devient un but en soi, détaché de l'objectif réel.

**Vérification compulsive.** Occhino-Moede et al. 2026 [103] (24 entretiens avec des adultes déclarant un trouble obsessionnel compulsif) : séries, barres de progression et compteurs **renforcent des comportements compulsifs** ; les notifications déclenchent un besoin de vérifier. Population spécifique, étude qualitative. Dans un tout autre contexte (livreurs de plateformes), Dzero 2026 [106] décrit un engagement vécu comme compulsif et honteux.

**Optimiser les points plutôt que l'apprentissage.**
- Loi de Goodhart, dans la formulation de Strathern : « quand une mesure devient une cible, elle cesse d'être une bonne mesure » [105].
- Baker et al. 2004 [102] : parmi les comportements hors tâche observés avec un tuteur logiciel, « jouer avec le système » est de loin le plus fortement associé à un **moindre apprentissage**.
- Points et niveaux augmentent la quantité, pas la qualité [16, 24].

**Mécaniques de hasard.** Zendle & Cairns 2018 [104] (7 422 joueurs) : les dépenses en coffres à butin **payants** sont liées à la sévérité du jeu problématique. Lien corrélationnel.

### Solidité des preuves

**Modérée** pour l'existence des effets négatifs (revues convergentes), **faible** pour leur fréquence et leur gravité. Presque rien sur les applications d'étude en particulier.

### Implication concrète pour l'app

**Risques de type Goodhart propres au projet** (analyse de conception) :

| Risque | Parade |
|---|---|
| Laisser tourner le minuteur sans travailler | Faire peser peu le temps brut dans les XP ; bilan de fin de séance en une ligne (« qu'ai-je fait ? »). |
| Déclarer « test d'entraînement » après une simple relecture | Multiplicateurs **modestes** ; demander une trace utile en soi (nombre de questions tentées, point resté flou). |
| Lancer des séances de groupe ou inviter pour le bonus | Bonus symbolique et plafonné. |
| Tenir la série avec une séance symbolique | Acceptable : cela entretient l'habitude. Ne pas le sanctionner. |

Le meilleur garde-fou est structurel : **pas de classement, pas de récompense matérielle, donc peu de raisons de tricher**.

**Garde-fous recommandés :**

1. **Aucune notification fondée sur la perte ou la culpabilité.** Notifications rares, réglables, désactivables.
2. **Aucune sanction** : ni perte de niveau, ni perte d'équipement, ni dégâts au groupe.
3. **Hasard gratuit et cosmétique uniquement.** Aucun achat.
4. **Mode pause** (maladie, vacances, stage) qui gèle tout sans rien faire perdre.
5. **Possibilité de masquer** série, barres de progression et compteurs [103, 26].
6. **Règles de calcul des XP visibles** et expliquées.
7. **Fonctions sociales facultatives**, avec contrôle de la visibilité.
8. **Sortie facile** : export et suppression des données.
9. **Question périodique** : « L'application t'aide-t-elle ? Te stresse-t-elle ? », avec proposition de désactiver ce qui pèse.
10. **Test des quatre questions** de Kim & Werbach [100] avant chaque nouvelle fonction.

---

## 9. Tableau de synthèse : fonctionnalité → verdict → pourquoi

| Fonctionnalité du projet | Verdict | Pourquoi |
|---|---|---|
| Récompenser la discipline plutôt que le volume | **GARDER** | Cohérent avec les limites de l'effort quotidien [78], l'abandon des utilisateurs qui se surchargent [36] et le fait que les points poussent la quantité, pas la qualité [16, 24]. |
| Se comparer uniquement à soi-même | **GARDER** | La comparaison vers le haut dégrade l'évaluation de soi [94] ; classements associés à des effets négatifs [15, 56, 57]. Coût assumé : on renonce à un levier d'engagement [53, 38]. |
| XP dégressifs au-delà d'un certain nombre d'heures | **GARDER, ajuster** | Rendements décroissants documentés [78, 80, 88]. Seuil non fixé par la recherche : dégressivité douce, réglable, expliquée. |
| Entraide plutôt que compétition | **GARDER** | Lien social = besoin le mieux servi par la gamification [10, 17]. Mais la compétition entre équipes est souvent plus engageante [52, 1, 53]. |
| Minuteur Pomodoro qui rapporte des XP | **AJUSTER** | XP à la minute = récompense « conditionnée à la participation », la plus risquée [21]. Supériorité du Pomodoro non établie [83, 84, 85]. Durées réglables ; XP liés aux engagements et à la méthode. |
| Niveaux, équipement, arbre de talents, classes | **GARDER** | Avatar et récit soutiennent le lien social, les indicateurs de progression la compétence [17]. Prévoir le creux des semaines 4–6 [12]. Pas de perte d'équipement. |
| Séries avec jours de repos planifiés | **GARDER, compléter** | La flexibilité protège la série [35, 36]. Ajouter jokers [33], réparation [27], compteurs impossibles à perdre. |
| Guildes avec boss nourris par l'effort cumulé | **AJUSTER** | Effort mis en commun = risque de paresse sociale [64]. Contribution en % de l'objectif personnel ; petits groupes d'amis ; pas de sanction collective. |
| Séances de groupe, minuteur partagé, pauses synchronisées | **GARDER** | Aide à démarrer et à venir [67, 68, 70]. Preuves faibles ; la présence d'autrui n'améliore pas les tâches complexes [66]. |
| Bonus d'XP collectif | **AJUSTER** | Le garder petit pour qu'il ne devienne pas le but. |
| Raids accessibles uniquement ensemble | **AJUSTER** | Risque d'exclusion ; certains profils ne répondent à aucune mécanique sociale [54]. Prévoir une voie solo. |
| Récompense pour qui lance une séance ou invite | **AJUSTER** | Mieux vaut récompenser l'invité ou les deux [71, 72] ; gain de croissance faible [38] ; plafonner. |
| Plus d'XP pour les méthodes efficaces | **GARDER, préciser** | Base de preuves la plus solide [89, 90, 91, 92]. Récompenser le rappel de mémoire suivi d'une correction, et l'espacement. Le résumé cours ouvert a une utilité faible [89]. |
| Suggestions facultatives et bienveillantes | **GARDER** | Protègent l'autonomie [10, 25]. Donner la raison de chaque suggestion [93]. |
| Plan « si… alors… » à l'inscription | **AJOUTER** | *d* = 0,65 sur l'atteinte des objectifs [49, 50]. |
| Bilan hebdomadaire et record personnel | **AJOUTER** | Objectifs précis + retour d'information [93] ; suivi des progrès *d* = 0,40 [51]. |
| Mode sans chiffres, mode pause | **AJOUTER** | La mesure peut gâcher le plaisir [26] ; compteurs et compulsions [103]. |
| Sanctions, pertes, notifications culpabilisantes | **ÉVITER** | Effets contre-productifs [18] ; ruptures de série auto-attribuées démotivantes [27]. |
| Classements individuels | **ÉVITER** | Voir plus haut [15, 56, 57, 59]. |

---

## 10. Ce que je n'ai pas pu vérifier

**Articles connus seulement par un résumé de moteur de recherche ou une source secondaire ([C]) :** Bai, Hew & Huang 2020 [2] ; Tsay et al. 2020 [13] ; Sanchez et al. 2020 [14] ; Hanus & Fox 2015 [15] ; Cameron, Banko & Pierce 2001 [23] ; Ryan, Rigby & Przybylski 2006 [25] ; Silverman, Barasch & Small 2023 [31] ; Sharif & Shu 2017 [32] ; Cochran & Tesser 1996 [42] ; Lally et al. 2010 [43] ; Wood & Neal 2007 [47] ; Wood & Rünger 2016 [48]. Les chiffres rapportés concordent entre sources, mais je n'ai pas lu les textes.

**Détails précis non vérifiés :**
- Les résultats élément par élément de Huang et al. 2020 [3] (texte intégral inaccessible).
- L'effet *g* = 3,304 pour les interventions de plus d'un semestre dans [5] : valeur extrême, probablement fondée sur très peu d'études ; je n'ai pas vérifié ce nombre.
- Les effectifs exacts des groupes dans Rodrigues et al. 2022 [12] : les chiffres extraits ne s'additionnent pas ; je donne un ordre de grandeur.
- La taille de l'effet causal du temps d'étude dans [76].
- La durée exacte de la « journée de travail » dans [81].
- Le détail du fonctionnement des bras « collaboration » et « soutien » de l'essai STEP UP [53].
- La liste complète des modérateurs de la paresse sociale : je n'ai que le résumé de [64] et une source tertiaire [65].
- Les auteurs de l'étude [98] : je n'ai vérifié que le titre, la revue, l'année et le DOI.

**Affirmations trouvées en ligne que je n'ai pas retenues, faute de source primaire :**
- « Le gel de série a réduit le désabonnement de 21 % » et « le gel de série a fait deux fois mieux que les bonus de gemmes » (blogs tiers sur Duolingo).
- Le mécanisme « Earn Back » de Duolingo (décrit par des tiers seulement).
- La statistique « 65 % de chances d'atteindre un objectif avec un partenaire, 95 % avec un rendez-vous de suivi », très répandue : je ne l'ai pas vérifiée et je ne l'utilise pas.

**Questions sans réponse dans ce que j'ai trouvé :**
- Aucun essai contrôlé sur l'effet du *body doubling* ou des salles d'étude virtuelles sur l'apprentissage.
- Aucune étude contrôlée sur la culpabilité liée aux mécaniques « ne pas laisser tomber l'équipe ».
- Aucune méta-analyse comparant retour auto-référencé et retour par comparaison sociale dans une application d'apprentissage.
- Aucune évaluation publiée d'applications de minuteur gamifié de type Forest (recherche limitée par le quota).
- Aucun nombre d'heures optimal établi pour des révisions universitaires.
- Aucune étude sur les séries appliquées aux révisions.

**Article écarté :** Heyman & Ariely 2004 [73], sous avis de préoccupation de l'éditeur.

**Articles que je voulais consulter et n'ai pas pu lire :** Bai et al. 2021 (position dans le classement et motivation), Koivisto & Hamari 2014 (effet de nouveauté), Hamari 2017 (badges), Landers et al. 2017 (classements et fixation d'objectifs), van Roy & Zaman 2018, Kyewski & Krämer 2018. Ils ne sont pas utilisés dans ce rapport.

---

## 11. Références

### Thème 1 — Gamification et apprentissage

1. **[A]** Sailer, M., & Homner, L. (2020). The gamification of learning: a meta-analysis. *Educational Psychology Review*, 32, 77–112. https://doi.org/10.1007/s10648-019-09498-w
2. **[C]** Bai, S., Hew, K. F., & Huang, B. (2020). Does gamification improve student learning outcome? Evidence from a meta-analysis and synthesis of qualitative data in educational contexts. *Educational Research Review*, 100322. https://doi.org/10.1016/j.edurev.2020.100322
3. **[B]** Huang, R., Ritzhaupt, A. D., Sommer, M., Zhu, J., Stephen, A., Valle, N., Hampton, J., & Li, J. (2020). The impact of gamification in educational settings on student learning outcomes: a meta-analysis. *Educational Technology Research and Development*, 68(4), 1875–1901. https://doi.org/10.1007/s11423-020-09807-z
4. **[A]** Kim, J., & Castelli, D. M. (2021). Effects of gamification on behavioral change in education: a meta-analysis. *International Journal of Environmental Research and Public Health*, 18(7), 3550. https://doi.org/10.3390/ijerph18073550 — texte : https://pmc.ncbi.nlm.nih.gov/articles/PMC8037535/
5. **[A]** Li, Ma & Shi (2023). Examining the effectiveness of gamification as a tool promoting teaching and learning in educational settings: a meta-analysis. *Frontiers in Psychology*, 14, 1253549. https://doi.org/10.3389/fpsyg.2023.1253549 — texte : https://pmc.ncbi.nlm.nih.gov/articles/PMC10591086/
6. **[B]** Zeng, J., Sun, D., Looi, C.-K., & Fan, A. C. W. (2024). Exploring the impact of gamification on students' academic performance: a comprehensive meta-analysis of studies from the year 2008 to 2023. *British Journal of Educational Technology*, 55(6), 2478–2502. https://doi.org/10.1111/bjet.13471
7. **[A]** Dai, W.-A., Xu, W., & Xing, Q.-W. (2025). Gamified learning impact: a meta-analysis of game element combinations on students' learning outcomes. *Educational Technology Research and Development*. https://doi.org/10.1007/s11423-025-10493-y
8. **[B]** Gyedu, F. O., Partey, P. A., Boafo, F. A., & Agbo, D. D. (2026). Gamification effect: enhancing student learning outcomes in higher education: a meta-analysis and policy implications. *SAGE Open*. https://doi.org/10.1177/21582440261421375
9. **[B]** Kanadli & Sancar-Tokmak (2026). A meta-analysis of existing meta-analyses on gamification practices in education: it does not fit all. *Review of Education*, 14, e70223. https://doi.org/10.1002/rev3.70223
10. **[A]** Li, L., Hew, K. F., & Du, J. (2024). Gamification enhances student intrinsic motivation, perceptions of autonomy and relatedness, but minimal impact on competency: a meta-analysis and systematic review. *Educational Technology Research and Development*, 72, 765–796. https://doi.org/10.1007/s11423-023-10337-7
11. **[B]** Koivisto, J., & Hamari, J. (2019). The rise of motivational information systems: a review of gamification research. *International Journal of Information Management*, 45, 191–210. https://doi.org/10.1016/j.ijinfomgt.2018.10.013
12. **[A]** Rodrigues, L., Pereira, F. D., Toda, A. M., Palomino, P. T., Pessoa, M., Carvalho, L. S. G., Fernandes, D., Oliveira, E. H. T., Cristea, A. I., & Isotani, S. (2022). Gamification suffers from the novelty effect but benefits from the familiarization effect: findings from a longitudinal study. *International Journal of Educational Technology in Higher Education*, 19, 13. https://doi.org/10.1186/s41239-021-00314-6
13. **[C]** Tsay, C. H.-H., Kofinas, A. K., Trivedi, S. K., & Yang, Y. (2020). Overcoming the novelty effect in online gamified learning systems: an empirical evaluation of student engagement and performance. *Journal of Computer Assisted Learning*, 36(2), 128–146. https://doi.org/10.1111/jcal.12385
14. **[C]** Sanchez, D. R., Langer, M., & Kaur, R. (2020). Gamification in the classroom: examining the impact of gamified quizzes on student learning. *Computers & Education*. https://www.sciencedirect.com/science/article/pii/S0360131519302192
15. **[C]** Hanus, M. D., & Fox, J. (2015). Assessing the effects of gamification in the classroom: a longitudinal study on intrinsic motivation, social comparison, satisfaction, effort, and academic performance. *Computers & Education*, 80, 152–161. https://doi.org/10.1016/j.compedu.2014.08.019
16. **[B]** Mekler, E. D., Brühlmann, F., Tuch, A. N., & Opwis, K. (2017). Towards understanding the effects of individual gamification elements on intrinsic motivation and performance. *Computers in Human Behavior*, 71, 525–534. https://doi.org/10.1016/j.chb.2015.08.048
17. **[B]** Sailer, M., Hense, J. U., Mayr, S. K., & Mandl, H. (2017). How gamification motivates: an experimental study of the effects of specific game design elements on psychological need satisfaction. *Computers in Human Behavior*, 69, 371–380. https://doi.org/10.1016/j.chb.2016.12.033
18. **[B]** Diefenbach, S., & Müssig, A. (2019). Counterproductive effects of gamification: an analysis on the example of the gamified task manager Habitica. *International Journal of Human-Computer Studies*, 127, 190–210. https://doi.org/10.1016/j.ijhcs.2018.09.004
19. **[B]** Zhang, Q. (2022). The potentially counterproductive effects on learning achievement, intrinsic motivation, and extrinsic motivation for ludicization employing Habitica. *Education and Information Technologies*. https://doi.org/10.1007/s10639-022-11130-4
20. **[A]** Chen, W.-L., Winitchayothin, S., Cheng, C.-H., Tonapa, S. I., Chou, F.-H., & Zimmerman, P.-A. (2026). A systematic review and meta-analysis of the effect of gamified clinical skill learning on learning outcomes in undergraduate nursing education. *The Journal of Nursing Research*, 34(5), e484. https://doi.org/10.1097/jnr.0000000000000772

### Thème 2 — Récompenses et motivation intrinsèque

21. **[A]** Deci, E. L., Koestner, R., & Ryan, R. M. (1999). A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. *Psychological Bulletin*, 125(6), 627–668. https://doi.org/10.1037/0033-2909.125.6.627
22. **[A]** Lepper, M. R., Henderlong, J., & Gingras, I. (1999). Understanding the effects of extrinsic rewards on intrinsic motivation — uses and abuses of meta-analysis. *Psychological Bulletin*, 125(6), 669–676. https://doi.org/10.1037/0033-2909.125.6.669
23. **[C]** Cameron, J., Banko, K. M., & Pierce, W. D. (2001). Pervasive negative effects of rewards on intrinsic motivation: the myth continues. *The Behavior Analyst*, 24(1), 1–44. https://pubmed.ncbi.nlm.nih.gov/22478353/
24. **[A]** Cerasoli, C. P., Nicklin, J. M., & Ford, M. T. (2014). Intrinsic motivation and extrinsic incentives jointly predict performance: a 40-year meta-analysis. *Psychological Bulletin*, 140(4), 980–1008. https://doi.org/10.1037/a0035661
25. **[C]** Ryan, R. M., Rigby, C. S., & Przybylski, A. (2006). The motivational pull of video games: a self-determination theory approach. *Motivation and Emotion*, 30(4), 347–363. https://doi.org/10.1007/s11031-006-9051-8
26. **[A]** Etkin, J. (2016). The hidden cost of personal quantification. *Journal of Consumer Research*, 42(6), 967–984. https://doi.org/10.1093/jcr/ucv095

### Thème 3 — Séries

27. **[A]** Silverman, J., & Barasch, A. (2023). On or off track: how (broken) streaks affect consumer decisions. *Journal of Consumer Research*, 49(6), 1095–1117. https://doi.org/10.1093/jcr/ucac029
28. **[C]** University of Colorado Boulder, Leeds School of Business (2023). Article de presse sur les travaux d'A. Barasch. https://www.colorado.edu/business/news/2023/04/20/research-streaks-marketing-tech-barasch
29. **[C]** University of Delaware, UDaily (2024). How streaks motivate us. https://www.udel.edu/udaily/2024/march/power-of-streaks-motivation-jackie-silverman/
30. **[B]** Mehr, K. S., Silverman, J., Sharif, M. A., Barasch, A., & Milkman, K. L. (2025). The motivating power of streaks: increasing persistence is as easy as 1, 2, 3. *Organizational Behavior and Human Decision Processes*, 187, 104391. https://doi.org/10.1016/j.obhdp.2025.104391
31. **[C]** Silverman, J., Barasch, A., & Small, D. A. (2023). Hot streak! Inferences and predictions about goal adherence. *Organizational Behavior and Human Decision Processes*, 179, 104281. https://doi.org/10.1016/j.obhdp.2023.104281
32. **[C]** Sharif, M. A., & Shu, S. B. (2017). The benefits of emergency reserves: greater preference and persistence for goals that have slack with a cost. *Journal of Marketing Research*, 54(3), 495–509. https://doi.org/10.1509/jmr.15.0231
33. **[A]** Sharif, M. A., & Shu, S. B. (2021). Nudging persistence after failure through emergency reserves. *Organizational Behavior and Human Decision Processes*, 163, 17–29. https://doi.org/10.1016/j.obhdp.2019.01.004
34. **[C]** UCLA Anderson Review. The case for building wiggle room into goals. https://anderson-review.ucla.edu/emergency-reserves/
35. **[A]** Beshears, J., Lee, H. N., Milkman, K. L., Mislavsky, R., & Wisdom, J. (2021). Creating exercise habits using incentives: the trade-off between flexibility and routinization. *Management Science*, 67(7), 4139–4171. https://doi.org/10.1287/mnsc.2020.3706
36. **[E]** Loh, K. H. (2017). How streaks keep Duolingo learners committed to their language goals. Blog Duolingo. https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/
37. **[E]** Mansur, O. (2022). Blog Duolingo. https://blog.duolingo.com/how-duolingo-streak-builds-habit/
38. **[E]** Mazal, J. (2023). How Duolingo reignited user growth. *Lenny's Newsletter*. https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth
39. **[E]** Shuttleworth, J. (2024). Behind the product: Duolingo streaks. *Lenny's Podcast*. https://www.lennysnewsletter.com/p/behind-the-product-duolingo-streaks
40. **[A]** Lau, E. Y., Mitchell, M. S., & Faulkner, G. (2022). Long-term usage of a commercial mHealth app: a « multiple-lives » perspective. *Frontiers in Public Health*, 10, 914433. https://doi.org/10.3389/fpubh.2022.914433
41. **[B]** Levari, D. E., & Norton, M. I. (2026). Collective streaks motivate prosocial behavior. *Journal of Experimental Social Psychology*. https://doi.org/10.1016/j.jesp.2026.104941 (consulté, non utilisé dans les recommandations)
42. **[C]** Cochran, W., & Tesser, A. (1996). The « what the hell » effect: some effects of goal proximity and goal framing on performance. Chapitre d'ouvrage. https://psycnet.apa.org/record/1996-97873-004 (cité d'après [33])

### Thème 4 — Habitudes

43. **[C]** Lally, P., van Jaarsveld, C. H. M., Potts, H. W. W., & Wardle, J. (2010). How are habits formed: modelling habit formation in the real world. *European Journal of Social Psychology*, 40(6), 998–1009. https://doi.org/10.1002/ejsp.674
44. **[C]** British Psychological Society, Research Digest. How to form a habit. https://www.bps.org.uk/research-digest/how-form-habit
45. **[A]** Singh, B., Murphy, A., Maher, C., & Smith, A. E. (2024). Time to form a habit: a systematic review and meta-analysis of health behaviour habit formation and its determinants. *Healthcare*, 12(23), 2488. https://doi.org/10.3390/healthcare12232488
46. **[A]** Buyalskaya, A., Ho, H., Milkman, K. L., Li, X., Duckworth, A. L., & Camerer, C. (2023). What can machine learning teach us about habit formation? Evidence from exercise and hygiene. *PNAS*, 120(17), e2216115120. https://doi.org/10.1073/pnas.2216115120 — **Correctif** : https://doi.org/10.1073/pnas.2312763120
47. **[C]** Wood, W., & Neal, D. T. (2007). A new look at habits and the habit–goal interface. *Psychological Review*, 114(4), 843–863. https://dornsife.usc.edu/wendy-wood/wp-content/uploads/sites/183/2023/10/wood.neal_.2007psychrev_a_new_look_at_habits_and_the_interface_between_habits_and_goals.pdf
48. **[C]** Wood, W., & Rünger, D. (2016). Psychology of habit. *Annual Review of Psychology*, 67, 289–314. https://doi.org/10.1146/annurev-psych-122414-033417
49. **[A]** Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal achievement: a meta-analysis of effects and processes. *Advances in Experimental Social Psychology*, 38, 69–119. https://doi.org/10.1016/S0065-2601(06)38002-1 — chiffres lus dans la synthèse rédigée par les auteurs : https://cancercontrol.cancer.gov/sites/default/files/2020-06/goal_intent_attain.pdf
50. **[B]** Sheeran, P., Listrom, O., & Gollwitzer, P. M. (2024). The when and how of planning: meta-analysis of the scope and components of implementation intentions in 642 tests. *European Review of Social Psychology*, 36(1). https://doi.org/10.1080/10463283.2024.2334563
51. **[A]** Harkin, B., Webb, T. L., Chang, B. P. I., Prestwich, A., Conner, M., Kellar, I., Benn, Y., & Sheeran, P. (2016). Does monitoring goal progress promote goal attainment? A meta-analysis of the experimental evidence. *Psychological Bulletin*, 142(2), 198–229. https://doi.org/10.1037/bul0000025

### Thème 5 — Mécaniques sociales

52. **[B]** Morschheuser, B., Hamari, J., & Maedche, A. (2019). Cooperation or competition — when do people contribute more? A field experiment on gamification of crowdsourcing. *International Journal of Human-Computer Studies*, 127, 7–24. https://doi.org/10.1016/j.ijhcs.2018.10.001
53. **[A]** Patel, M. S., Small, D. S., Harrison, J. D., et al. (2019). Effectiveness of behaviorally designed gamification interventions with social incentives for increasing physical activity among overweight and obese adults across the United States: the STEP UP randomized clinical trial. *JAMA Internal Medicine*, 179(12), 1624–1632. https://doi.org/10.1001/jamainternmed.2019.3505
54. **[A]** Chen, X. S., Changolkar, S., Navathe, A. S., et al. (2020). Association between behavioral phenotypes and response to a physical activity intervention using gamification and social incentives: secondary analysis of the STEP UP randomized clinical trial. *PLoS One*, 15(10), e0239288. https://doi.org/10.1371/journal.pone.0239288
55. **[A]** Murayama, K., & Elliot, A. J. (2012). The competition–performance relation: a meta-analytic review and test of the opposing processes model of competition and performance. *Psychological Bulletin*. https://doi.org/10.1037/a0028324
56. **[A]** Toda, A. M., Valle, P. H. D., & Isotani, S. (2018). The dark side of gamification: an overview of negative effects of gamification in education. *Communications in Computer and Information Science*. https://doi.org/10.1007/978-3-319-97934-2_9
57. **[A]** Almeida, C., Kalinowski, M., Uchôa, A., & Feijó, B. (2023). Negative effects of gamification in education software: systematic mapping and practitioner perceptions. *Information and Software Technology*, 156. https://arxiv.org/abs/2305.08346
58. **[B]** Li, C., Liang, L., Fryer, L. K., & Shum, A. (2024). The use of leaderboards in education: a systematic review of empirical evidence in higher education. *Journal of Computer Assisted Learning*. https://doi.org/10.1111/jcal.13077
59. **[B]** Michinov, N., & Michinov, E. (2026). More competition, less interaction: gamifying lectures using a leaderboard reduces female students' social engagement. *Journal of Computing in Higher Education*. https://doi.org/10.1007/s12528-025-09438-4
60. **[A]** Weber, B., & Hertel, G. (2007). Motivation gains of inferior group members: a meta-analytical review. *Journal of Personality and Social Psychology*, 93(6), 973–993. https://doi.org/10.1037/0022-3514.93.6.973
61. **[B]** Kerr, N. L., & Hertel, G. (2011). The Köhler group motivation gain: how to motivate the « weak links » in a group. *Social and Personality Psychology Compass*, 5(1), 43–55. https://doi.org/10.1111/j.1751-9004.2010.00333.x
62. **[A]** Feltz, D. L., Kerr, N. L., & Irwin, B. C. (2011). Buddy up: the Köhler effect applied to health games. *Journal of Sport & Exercise Psychology*, 33(4), 506–526. https://doi.org/10.1123/jsep.33.4.506
63. **[A]** Irwin, B. C., Scorniaenchi, J., Kerr, N. L., Eisenmann, J. C., & Feltz, D. L. (2012). Aerobic exercise is promoted when individual performance affects the group: a test of the Köhler motivation gain effect. *Annals of Behavioral Medicine*, 44(2), 151–159. https://doi.org/10.1007/s12160-012-9367-4
64. **[B]** Karau, S. J., & Williams, K. D. (1993). Social loafing: a meta-analytic review and theoretical integration. *Journal of Personality and Social Psychology*, 65(4), 681–706. https://doi.org/10.1037/0022-3514.65.4.681
65. **[C]** Wikipédia (en). Social loafing. https://en.wikipedia.org/wiki/Social_loafing (source tertiaire, utilisée seulement pour des détails de [64])
66. **[B]** Bond, C. F., & Titus, L. J. (1983). Social facilitation: a meta-analysis of 241 studies. *Psychological Bulletin*, 94(2), 265–292. https://doi.org/10.1037/0033-2909.94.2.265
67. **[B]** Eagle, T., Baltaxe-Admony, L. B., & Ringland, K. E. (2024). « It was something I naturally found worked and heard about later »: an investigation of body doubling with neurodivergent participants. *ACM Transactions on Accessible Computing*, 17(3). https://doi.org/10.1145/3689648
68. **[B]** Lee, Y., et al. (2021). Personalizing ambience and illusionary presence: how people use « study with me » videos to create effective studying environments. *CHI '21*. https://doi.org/10.1145/3411764.3445222 (liste d'auteurs non vérifiée)
69. **[B]** Kim, D., & Ryoo, D. (2025). Exploring self-regulated learning and achievement goal orientation in Generation Z through « Study with Me ». *Interactive Learning Environments*. https://doi.org/10.1080/10494820.2024.2437543
70. **[A]** Epton, T., Currie, S., & Armitage, C. J. (2017). Unique effects of setting goals on behavior change: systematic review and meta-analysis. *Journal of Consulting and Clinical Psychology*. https://doi.org/10.1037/ccp0000260
71. **[B]** Gershon, R., Cryder, C., & John, L. K. (2020). Why prosocial referral incentives work: the interplay of reputational benefits and action costs. *Journal of Marketing Research*, 57(1). https://doi.org/10.1177/0022243719888440
72. **[B]** Ryu, G., & Feick, L. (2007). A penny for your thoughts: referral reward programs and referral likelihood. *Journal of Marketing*, 71(1), 84–94. https://doi.org/10.1509/jmkg.71.1.84
73. **[A]** Heyman, J., & Ariely, D. (2004). Effort for payment: a tale of two markets. *Psychological Science*. https://doi.org/10.1111/j.0956-7976.2004.00757.x — **Avis de préoccupation** (2021) : https://doi.org/10.1177/09567976211035782. Non utilisé.
74. **[B]** Fonteyne, K., Taylor, M., Nawara, R., et al. (2026). Exploring vaping cessation app use among youth: qualitative descriptive study. *Journal of Medical Internet Research*. https://doi.org/10.2196/85778

### Thème 6 — Surmenage, pauses, méthodes

75. **[B]** Plant, E. A., Ericsson, K. A., Hill, L., & Asberg, K. (2005). Why study time does not predict grade point average across college students: implications of deliberate practice for academic performance. *Contemporary Educational Psychology*, 30(1), 96–116. https://doi.org/10.1016/j.cedpsych.2004.06.001
76. **[A]** Stinebrickner, R., & Stinebrickner, T. R. (2008). The causal effect of studying on academic performance. *The B.E. Journal of Economic Analysis & Policy*, 8(1). Document de travail NBER 13341 : https://www.nber.org/papers/w13341
77. **[A]** Macnamara, B. N., Hambrick, D. Z., & Oswald, F. L. (2014). Deliberate practice and performance in music, games, sports, education, and professions: a meta-analysis. *Psychological Science*. https://doi.org/10.1177/0956797614535810 (rectificatif 2018 : https://doi.org/10.1177/0956797618769891)
78. **[A]** Ericsson, K. A., Krampe, R. T., & Tesch-Römer, C. (1993). The role of deliberate practice in the acquisition of expert performance. *Psychological Review*, 100(3), 363–406. https://doi.org/10.1037/0033-295X.100.3.363
79. **[A]** Ericsson, K. A., & Harwell, K. W. (2019). Deliberate practice and proposed limits on the effects of practice on the acquisition of expert performance. *Frontiers in Psychology*, 10, 2396. https://doi.org/10.3389/fpsyg.2019.02396
80. **[A]** Sievertsen, H. H., Gino, F., & Piovesan, M. (2016). Cognitive fatigue influences students' performance on standardized tests. *PNAS*, 113(10), 2621–2624. https://doi.org/10.1073/pnas.1516947113
81. **[A]** Wiehler, A., Branzoli, F., Adanyeguh, I., Mochel, F., & Pessiglione, M. (2022). A neuro-metabolic account of why daylong cognitive work alters the control of economic decisions. *Current Biology*, 32(16), 3564–3575. https://doi.org/10.1016/j.cub.2022.07.010
82. **[A]** Albulescu, P., Macsinga, I., Rusu, A., Sulea, C., Bodnaru, A., & Tulbure, B. T. (2022). « Give me a break! » A systematic review and meta-analysis on the efficacy of micro-breaks for increasing well-being and performance. *PLoS One*, 17(8), e0272460. https://doi.org/10.1371/journal.pone.0272460
83. **[A]** Biwer, F., Wiradhany, W., Oude Egbrink, M. G. A., & de Bruin, A. B. H. (2023). Understanding effort regulation: comparing « Pomodoro » breaks and self-regulated breaks. *British Journal of Educational Psychology*, 93(S2), 353–367. https://doi.org/10.1111/bjep.12593
84. **[A]** Smits, E. J. C., Wenzel, N., & de Bruin, A. (2025). Investigating the effectiveness of self-regulated, Pomodoro, and Flowtime break-taking techniques among students. *Behavioral Sciences*, 15(7), 861. https://doi.org/10.3390/bs15070861
85. **[A]** Göksu, A., Wiradhany, W., & de Bruin, A. B. H. (2026). When to take a break: comparing effects of systematic short (Pomodoro) and self-regulated breaks on subjective experience and actual learning. *Behavioral Sciences*. https://doi.org/10.3390/bs16071158
86. **[A]** Ogut, E. (2025). Assessing the efficacy of the Pomodoro technique in enhancing anatomy lesson retention during study sessions: a scoping review. *BMC Medical Education*. https://doi.org/10.1186/s12909-025-08001-0
87. **[A]** Okano, K., Kaczmarzyk, J. R., Dave, N., Gabrieli, J. D. E., & Grossman, J. C. (2019). Sleep quality, duration, and consistency are associated with better academic performance in college students. *npj Science of Learning*. https://doi.org/10.1038/s41539-019-0055-z
88. **[B]** Pencavel, J. (2015). The productivity of working hours. *The Economic Journal*. https://doi.org/10.1111/ecoj.12166
89. **[A]** Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students' learning with effective learning techniques. *Psychological Science in the Public Interest*, 14(1), 4–58. https://doi.org/10.1177/1529100612453266
90. **[A]** Rowland, C. A. (2014). The effect of testing versus restudy on retention: a meta-analytic review of the testing effect. *Psychological Bulletin*. https://doi.org/10.1037/a0037559
91. **[A]** Yang, C., Luo, L., Vadillo, M. A., Yu, R., & Shanks, D. R. (2021). Testing (quizzing) boosts classroom learning: a systematic and meta-analytic review. *Psychological Bulletin*. https://doi.org/10.1037/bul0000309
92. **[A]** Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: a review and quantitative synthesis. *Psychological Bulletin*, 132(3), 354–380. https://doi.org/10.1037/0033-2909.132.3.354

### Thème 7 — Comparaison à soi, objectifs

93. **[A]** Locke, E. A., & Latham, G. P. (2002). Building a practically useful theory of goal setting and task motivation: a 35-year odyssey. *American Psychologist*, 57(9), 705–717. https://doi.org/10.1037/0003-066X.57.9.705
94. **[A]** Gerber, J. P., Wheeler, L., & Suls, J. (2018). A social comparison theory meta-analysis 60+ years on. *Psychological Bulletin*. https://doi.org/10.1037/bul0000127
95. **[A]** Van Yperen, N. W., Blaga, M., & Postmes, T. (2014). A meta-analysis of self-reported achievement goals and nonself-report performance across three achievement domains. *PLoS One*. https://doi.org/10.1371/journal.pone.0093594
96. **[B]** Burns, E. C., Martin, A. J., & Collie, R. J. (2018). Understanding the role of personal best (PB) goal setting in students' declining engagement: a latent growth model. *Journal of Educational Psychology*. https://doi.org/10.1037/edu0000291
97. **[A]** Ginns, P., Martin, A. J., Durksen, T. L., Burns, E. C., & Pope, A. (2018). Personal best (PB) goal-setting enhances arithmetical problem-solving. *The Australian Educational Researcher*, 45, 533–551. https://doi.org/10.1007/s13384-018-0268-9
98. **[B]** (Auteurs non vérifiés.) Context-related problems and university students' dropout intentions — the buffering effect of personal best goals (2019). *European Journal of Psychology of Education*. https://doi.org/10.1007/s10212-019-00433-9
99. **[B]** Petrak, A., Möller, J., & Wolff, F. (2025). Comparisons in everyday life: academic self-concepts. Prépublication PsyArXiv. https://doi.org/10.31234/osf.io/9824f_v1

### Thème 8 — Éthique

100. **[A]** Kim, T. W., & Werbach, K. (2016). More than just a game: ethical issues in gamification. *Ethics and Information Technology*, 18, 157–173. https://doi.org/10.1007/s10676-016-9401-5
101. **[B]** Gray, C. M., Kou, Y., Battles, B., Hoggatt, J., & Toombs, A. L. (2018). The dark (patterns) side of UX design. *CHI '18*. https://doi.org/10.1145/3173574.3174108
102. **[B]** Baker, R. S., Corbett, A. T., Koedinger, K. R., & Wagner, A. Z. (2004). Off-task behavior in the cognitive tutor classroom: when students « game the system ». *CHI '04*. https://doi.org/10.1145/985692.985741
103. **[A]** Occhino-Moede, L., Sulivan-Pascual, K., Phelan, K., et al. (2026). Interactions of technology and obsessive-compulsive disorder symptomatology in adults: qualitative interview study. *Journal of Medical Internet Research*. https://doi.org/10.2196/85033
104. **[B]** Zendle, D., & Cairns, P. (2018). Video game loot boxes are linked to problem gambling: results of a large-scale survey. *PLoS One*, 13(11), e0206767. https://doi.org/10.1371/journal.pone.0206767
105. **[C]** Wikipédia (en). Goodhart's law. https://en.wikipedia.org/wiki/Goodhart%27s_law (source tertiaire ; formulations de Goodhart 1975 et Strathern 1997)
106. **[B]** Dzero, I. (2026). Angry and « productive »: engagement in gamified precarious work. *Frontiers in Psychology*. https://doi.org/10.3389/fpsyg.2026.1833833
