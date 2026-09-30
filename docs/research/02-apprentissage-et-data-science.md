# 02 — Science de l'apprentissage et data science : état des preuves et implications pour l'app

*Rapport de recherche rédigé les 29–30 septembre 2026. Lecteur visé : étudiant en M2 de pharmacométrie (vocabulaire « population » assumé : valeurs typiques, variabilité inter-individuelle, EBE, shrinkage, priors).*

---

## 0. Méthode, niveaux de vérification et limites

**Comment la recherche a été faite.** Recherche web réelle (moteur de recherche, puis ouverture des pages, PDF et notices). Les notices biomédicales et de psychologie ont été vérifiées via PubMed (titre, auteurs, revue, résumé, DOI) ; plusieurs articles ont été lus en texte intégral (PDF ou PubMed Central). Les pages CNIL, RGPD et Supabase ont été ouvertes directement.

**Deux limites techniques à connaître.**
1. Le quota de recherches web de la session a été épuisé après environ 25 requêtes (quota partagé). La suite a été faite avec PubMed et des ouvertures directes d'URL connues. Conséquence : la littérature hors PubMed (learning analytics, informatique, statistique appliquée à l'éducation) est moins bien couverte que la littérature psychologie/santé.
2. L'outil d'ouverture de pages a atteint sa limite d'usage en fin de session. Quelques vérifications prévues n'ont pas pu être faites ; elles sont listées en section 11.

**Niveau de vérification de chaque source** (repris dans la liste de références) :

| Code | Signification |
|---|---|
| **[TI]** | Texte intégral ou PDF ouvert et lu (chiffres relevés dans l'article) |
| **[R]** | Résumé officiel lu (notice PubMed ou page éditeur) |
| **[S]** | Source secondaire uniquement (résumé tiers, extrait de moteur de recherche) |
| **[NV]** | Non vérifié : mentionné de mémoire, à ne pas citer sans contrôle |

Les calculs présentés comme « illustration » sont les miens (algèbre standard du modèle linéaire mixte) et ne proviennent pas d'une publication.

---

## 1. Efficacité des techniques de révision

### Ce que dit la littérature

**Classement de référence (Dunlosky et al., 2013).** Dix techniques évaluées sur la généralisabilité de leurs effets. Utilité **élevée** : test d'entraînement (practice testing) et pratique distribuée. Utilité **modérée** : interrogation élaborative, auto-explication, pratique entrelacée. Utilité **faible** : résumé, surlignage, mnémotechnique par mot-clé, imagerie mentale pour les textes, relecture. Les auteurs écrivent que relecture et surlignage, très utilisés, n'améliorent pas la performance de façon constante et qu'il vaut mieux leur substituer d'autres techniques. **[R]**

**Méta-analyse des mêmes dix techniques (Donoghue & Hattie, 2021).** 242 études, 1 619 effets, 169 179 participants, effet moyen d = 0,56. **[TI]**

| Technique | d |
|---|---|
| Pratique distribuée | 0,85 |
| Test d'entraînement | 0,74 |
| Interrogation élaborative | 0,56 |
| Imagerie | 0,56 |
| Auto-explication | 0,54 |
| Mnémotechniques | 0,50 |
| Relecture | 0,47 |
| Pratique entrelacée | 0,47 |
| Surlignage | 0,44 |
| Résumé | 0,44 |

Point souvent oublié : **toutes** les techniques ont un effet positif par rapport à leur contrôle, relecture comprise. Modérateurs : transfert proche 0,61 contre transfert lointain 0,39 ; apprentissage de surface 0,60 contre apprentissage profond 0,26. Limites reconnues par les auteurs : résultats dominés par des critères factuels ; aucune publication postérieure à 2014.

**Effet test, laboratoire (Rowland, 2014).** Test contre ré-étude : g = 0,50 [0,42 ; 0,58], 159 tailles d'effet, 61 études, hétérogénéité forte (I² = 84 %). **[TI]**

| Modérateur | g |
|---|---|
| Avec correction (feedback) | 0,73 |
| Sans correction | 0,39 |
| Délai de rétention ≥ 1 jour | 0,69 |
| Délai < 1 jour | 0,41 |
| Sans correction, réussite initiale ≤ 50 % | 0,03 [−0,21 ; 0,27] |
| Sans correction, réussite 51–75 % | 0,29 |
| Sans correction, réussite > 75 % | 0,56 |
| Études publiées / non publiées | 0,58 / 0,25 |

Format du test initial, en contrôlant l'exposition (sous-ensemble « high exposure ») : rappel indicé 0,72, rappel libre 0,81, reconnaissance 0,36.

**Effet test, en classe (Yang et al., 2021).** 222 études, 573 effets, 48 478 élèves et étudiants : g = 0,499 [0,442 ; 0,557]. Corrections du biais de publication : 0,46 à 0,48. **[TI]**

| Comparaison ou modérateur | g |
|---|---|
| Contre absence d'activité | 0,610 |
| Contre ré-étude | 0,330 [0,256 ; 0,404] |
| Contre stratégies élaboratives (cartes conceptuelles, prise de notes, résumé…) | 0,095 [−0,005 ; 0,194], non significatif |
| QCM | 0,567 |
| Réponse courte | 0,638 |
| Rappel libre | 0,238 |
| Reconnaissance / rappel (tous formats regroupés) | 0,518 / 0,520 |
| Avec / sans correction | 0,537 / 0,374 |
| 1 / 2 / ≥ 3 répétitions du test | 0,444 / 0,601 / 0,642 |
| Université | 0,486 |
| Médecine (k = 39) | 0,481 [0,309 ; 0,653] |
| Soins infirmiers (k = 7) | 0,693 |
| Pharmacie (k = 6) | 0,338 [−0,053 ; 0,728], non significatif |
| Contenu non testé (transfert) | 0,321 |
| Enjeu faible / élevé | 0,477 / 0,441 |

**Adesope, Trevisan & Sundararajan (2017).** 272 tailles d'effet ; test contre ré-étude g = 0,51 ; contre absence d'activité g = 0,93 ; QCM 0,70 contre réponse courte 0,48. **[S]** (page éditeur inaccessible ; chiffres relevés dans des résumés tiers concordants).

**Espacement.**
- Cepeda et al. (2006) : 839 évaluations, 317 expériences. Rappel final : **47,3 %** en espacé contre **36,7 %** en massé (271 comparaisons, 14 811 participants) ; seules 12 comparaisons sur 271 ne montrent pas d'avantage. L'intervalle optimal entre deux séances augmente avec le délai de rétention visé. **[TI]**
- Cepeda et al. (2008) : plus de 1 350 personnes ; l'écart optimal vaut environ 20 à 40 % du délai pour un test à 1 semaine, et 5 à 10 % pour un test à 1 an. **[R]**
- Latimier, Peyre & Ramus (2021) : 29 études ; récupération espacée contre massée g = 0,74 ; calendrier expansif contre uniforme g = 0,034 (pas de différence). **[R]**
- Mawson & Kang (2025), études en classe : 22 rapports, 31 effets, d = 0,54 [0,31 ; 0,77] ; effets plus grands avec des délais longs et dans l'enseignement supérieur. **[R]**

**Entrelacement (Brunmair & Richter, 2019).** 59 études, 238 effets : g = 0,42 en moyenne, mais très dépendant du matériel : peintures 0,67, mathématiques 0,34, textes explicatifs non significatif, mots **−0,39** (le blocage fait mieux). **[TI]** (résumé du manuscrit accepté).

**Étudiants en santé.**
- Green et al. (2018, guide BEME n° 48) : 19 études, 41 critères ; 21 des 23 critères de rétention et les 7 critères de transfert favorisent le test (différences standardisées 0,12 à 2,5). **[R]**
- Trumble et al. (2024) : 56 articles, 63 expériences, 43 avec bénéfice significatif ; le temps passé est rarement rapporté, ce qui est un facteur de confusion majeur. **[R]**
- Sezgin & Bektas (2026) : 9 essais randomisés sur l'apprentissage espacé, rétention g = 0,62 [0,43 ; 0,82], risque de biais jugé élevé. **[R]**
- Larsen et al. (2009), essai randomisé chez des internes : à 6 mois, **39 %** contre **26 %** (tests répétés avec correction contre étude répétée), d = 0,91. **[R]**
- Schmidmaier et al. (2011), 80 étudiants en médecine : le test fait mieux à 1 semaine, **plus aucune différence à 6 mois** ; les auto-prédictions ne corrèlent pas avec la performance. **[R]**
- Kerfoot et al. (2011) : révisions cyclées espacées, taille d'effet 0,95 sur la rétention. **[R]**
- Pharmacie : Terenyi et al. (2018), noms de médicaments, rétention à long terme : calendrier espacé contractant 67 %, égal 59 %, expansif 58 %, massé 50 %, **étude seule 46 %** ; la performance passe de 95 % à l'examen à 55 % six semaines plus tard. Terenyi et al. (2019) : donner des indices (3 premières lettres) diminue la rétention. Palmer et al. (2019), 102 étudiants : revoir le cours enregistré et faire de la récupération donnent le même résultat à 1 semaine, mais la récupération prend moins de temps. **[R]**
- Données observationnelles (donc confondues) : Deng et al. (2015), 445 questions d'entraînement ou 1 700 cartes Anki supplémentaires associées à +1 point à l'USMLE Step 1 ; Gilbert et al. (2023), utilisateurs d'Anki +6 à +13 points de pourcentage ; Levy et al. (2023), pas de différence significative ; Burel et al. (2025, **Rouen, concours de première année de santé**, 523 répondants), répétition espacée associée à la réussite, odds ratio ajusté 2,09 [1,16 ; 3,48]. **[R]**

**Quand la lecture et la relecture sont légitimes.**
- On ne récupère pas ce qu'on n'a pas encodé : sans correction et avec moins de 50 % de réussite, l'effet test est nul (g = 0,03, Rowland). La lecture de première passe est donc un **prérequis**, pas une méthode inférieure.
- La relecture **espacée** aide à long terme : Rawson & Kintsch (2005), repris par Greving & Richter (2019), trouvent un avantage de la relecture distribuée à test différé, et de la relecture massée à test immédiat. **[TI]** pour Greving & Richter ; **[S]** pour Rawson & Kintsch.
- À très court terme, relire fait mieux que se tester : Roediger & Karpicke (2006), à 5 minutes la ré-étude gagne, à 2 jours et 1 semaine le test gagne. **[R]**
- Débat sur les contenus complexes : van Gog & Sweller (2015) soutiennent que l'effet test diminue avec la complexité ; Karpicke & Aue (2015) contestent. Dans Yang et al., l'effet vaut 0,453 pour la résolution de problèmes et 0,644 pour les concepts. **[S]** pour le débat, **[TI]** pour Yang.
- Se tester **avant** d'étudier aide aussi (effet pré-test, Richland et al., 2009). **[R]**

### Solidité des preuves

- **Très solide** : supériorité du test sur la ré-étude à délai ≥ 1 jour, et de l'espacé sur le massé. Centaines d'études, résultats répliqués en classe, biais de publication examiné.
- **Solide** : rôle de la correction et de la répétition des tests.
- **Moyennement solide** : ampleur réelle en conditions d'étude autonome. L'effet en classe contre ré-étude (0,33) est plus petit qu'en laboratoire (0,50), et les quiz faits hors classe font moins bien (0,40 contre 0,51).
- **Fragile** : supériorité du test sur les stratégies élaboratives (0,095, non significatif) ; durabilité à 6 mois chez les étudiants en médecine (un essai nul) ; entrelacement hors catégorisation visuelle et mathématiques.
- **Limite générale** : les critères sont surtout factuels et mesurés à quelques jours ou semaines.

### Implication concrète pour l'app

**1. La « fiche écrite de mémoire » est de la récupération, pas du résumé.** Elle doit être classée avec les QCM. Il faut en revanche la distinguer de la fiche faite **cours ouvert**, qui est un résumé (utilité faible). Le champ « méthode » doit donc porter cette distinction.

**2. Récompenser des propriétés vérifiables plutôt qu'une étiquette.** Les trois modérateurs les mieux établis sont la récupération, la correction et l'espacement. Deux d'entre eux sont observables par l'app sans déclaration : un résultat saisi (nombre d'items, nombre de réussites) et le retour sur une matière après au moins un jour.

**3. Quel multiplicateur est défendable ?** Une taille d'effet standardisée ne se convertit pas en ratio. En revanche, les rapports de **rétention différée** observés donnent un ordre de grandeur :

| Source | Comparaison | Rapport |
|---|---|---|
| Cepeda 2006 | espacé 47,3 % / massé 36,7 % | ×1,29 |
| Larsen 2009 | tests 39 % / étude 26 % | ×1,50 |
| Terenyi 2018 | meilleur calendrier espacé 67 % / étude seule 46 % | ×1,46 |
| Terenyi 2018 | calendriers espacés 58–67 % / massé 50 % | ×1,16 à ×1,34 |

Proposition :

| Activité | Multiplicateur | Justification |
|---|---|---|
| Lecture de première passe | ×1,0 | prérequis, ne pas pénaliser |
| Relecture, surlignage, fiche cours ouvert | ×1,0 | effet positif mais faible |
| Récupération avec correction (QCM, annales, fiche de mémoire puis vérification, flashcards) | ×1,25 à ×1,5 | rapports de rétention ci-dessus |
| Retour sur une matière déjà vue ≥ 1 jour avant | bonus +10 à +25 % | espacement, vérifiable par l'app |

Ce qui serait **arbitraire** : un ×2 ou ×3 ; une hiérarchie entre QCM et rappel libre (0,518 contre 0,520 en classe) ; un bonus d'entrelacement généralisé ; des décimales donnant une illusion de précision. Je recommande d'afficher le multiplicateur comme un « coup de pouce fondé sur la littérature », pas comme une mesure.

**4. Risque de fausse déclaration.** Je n'ai trouvé **aucune étude** mesurant la fausse déclaration de méthode dans une app de révision gamifiée. Preuves indirectes :
- Gerlach et al. (2019, 565 expériences) : quand un gain dépend d'une auto-déclaration, une partie des gens trichent, selon la taille de la récompense et le contexte. **[R]**
- Deci et al. (1999, 128 études) : les récompenses attendues conditionnées à l'engagement, à l'achèvement ou à la performance réduisent la motivation intrinsèque (d = −0,40, −0,36, −0,28) ; le feedback positif l'augmente (d = +0,33). **[R]**
- Blasiman et al. (2017) : l'écart entre intention et comportement réel d'étude est important. **[R]**

Parades : écart de multiplicateur modeste ; bonus conditionné à la saisie d'un résultat ; données privées et comparaison à soi seulement (enjeu social faible) ; dans le modèle, traiter la méthode déclarée comme une **exposition mesurée avec erreur**, et tracer la version de la règle d'XP pour modéliser tout changement d'incitation.

---

## 2. Validité d'une auto-évaluation rapide comme critère de jugement

### Ce que dit la littérature

**Les jugements immédiats sont biaisés par la fluence.**
- Koriat & Bjork (2005) : le jugement d'apprentissage est fait en présence d'informations qui seront absentes au test, d'où une illusion de compétence. **[R]**
- Kornell & Bjork (2008, n = 120) : 78 % des participants réussissent mieux en espacé, mais 78 % jugent le massé aussi bon ou meilleur. **[TI]**
- Roediger & Karpicke (2006) : l'étude répétée augmente la confiance alors que le test donne la meilleure rétention. Karpicke & Roediger (2008) : prédictions non corrélées à la performance. **[R]**
- Deslauriers et al. (2019, essai randomisé, physique à Harvard) : en pédagogie active les étudiants **apprennent plus mais ont le sentiment d'apprendre moins**. **[R]**
- Kirk-Johnson et al. (2019) : plus une stratégie est perçue comme coûteuse en effort, plus elle est jugée inefficace, et moins elle est choisie. **[R]**

**Le jugement différé est bien meilleur.** Nelson & Dunlosky (1991) décrivent l'effet ; la méta-analyse de Rhodes & Tauber (2011, 112 effets, 4 554 participants) chiffre le gain de précision relative du jugement différé à **g = 0,93**. **[R]** (chiffres de l'article de 1991 non relus).

**Précision générale de l'auto-évaluation.**
- Zell & Krizan (2014), 22 méta-analyses : corrélation moyenne auto-évaluation/performance **r = 0,29** (de 0,09 à 0,63), meilleure quand le domaine est précis et la tâche objective et familière. **[R]**
- Blanch-Hartigan (2011), 35 articles : étudiants en médecine « modérément » capables de s'auto-évaluer, meilleurs en fin de cursus, surestimation sur les compétences de communication. **[R]**

**Dunning–Kruger.** Kruger & Dunning (1999) : le quartile inférieur, au 12ᵉ percentile réel, s'estime au 62ᵉ. **[R]** Gignac & Zajenkowski (2020, n = 929) soutiennent que le motif est en grande partie un artefact statistique ; leur analyse a elle-même été critiquée. **[S]**

**Items uniques.** Song et al. (2023) : en évaluation répétée, les items uniques corrèlent de 0,24 à 0,61 avec les échelles multi-items et gardent une validité prédictive dans 27 modèles sur 29. **[R]**

**Outils existants.** Anki propose quatre boutons (À revoir, Difficile, Correct, Facile). Dans FSRS, « À revoir » est un échec et les trois autres sont des réussites ; utiliser « Difficile » pour un oubli fausse le modèle. La FAQ officielle indique que FSRS peut même être plus précis en n'utilisant que deux boutons. **[TI]** Le signal utile est donc **binaire** (rappel réussi ou non), pas une impression graduée.

### Solidité des preuves

- **Très solide** : les jugements immédiats après étude passive sont trop optimistes ; les méthodes efficaces paraissent moins efficaces à celui qui les pratique.
- **Solide** : supériorité du jugement différé.
- **Non trouvé** : comparaison directe, dans une app de révision, entre « concentration perçue », « difficulté perçue », « confiance » et « rappel réussi » comme note unique. La recommandation ci-dessous est une inférence.

### Implication concrète pour l'app

**Piège central.** Si le modèle prend pour critère « j'ai bien appris » noté à chaud, il apprendra que relire rend meilleur que se tester, et recommandera la mauvaise méthode. Le biais est **différentiel selon la méthode**, donc non corrigeable par un simple effet aléatoire individuel.

**Hiérarchie des critères, du meilleur au moins bon :**
1. **Score objectif** : réussites / items tentés.
2. **Rappel auto-corrigé** : « sans regarder, quelle part des points clés retrouves-tu ? » puis vérification. C'est à la fois une mesure et une séance de récupération.
3. **Contrôle différé** : la même question posée au début de la séance suivante sur la matière.
4. Concentration ou difficulté perçue : **covariables** de processus, jamais critère principal.
5. À éviter : « à quel point as-tu appris ? » à chaud.

**Analyse.** Exploiter les notes subjectives en **écart à la moyenne de la personne**. Ne pas utiliser le motif Dunning–Kruger dans les messages.

---

## 3. Charge et observance de la micro-saisie

### Ce que dit la littérature

**Études de recherche (participants souvent rémunérés, 1 à 2 semaines).**

| Source | Population | Observance |
|---|---|---|
| Wrzus & Neubauer 2023 (477 articles, N = 677 536) | toutes | 79 % (6 sollicitations/jour, 7 jours en moyenne) |
| Williams et al. 2021 | adultes | 81,9 % |
| Wen et al. 2017 | jeunes ≤ 18 ans | 78,3 % |
| Drexl et al. 2025 (285 échantillons) | jeunes | 72 % ; acceptation 67 % |
| Rintala et al. 2019 (1 717 personnes) | clinique et témoins | 78 %, baisse à 73 % au 5ᵉ jour |

Tous **[R]**.

**Ce qui pèse.**
- La **longueur** du questionnaire plus que la fréquence : Eisele et al. (2022, 163 étudiants) trouvent plus de charge et moins bonne qualité avec 60 items qu'avec 30, sans effet de la fréquence (3, 6 ou 9 par jour). **[R]**
- Hasselhorn et al. (2022) : plus de fréquence augmente la charge perçue sans réduire l'observance ; un questionnaire long réduit la variabilité intra-individuelle des réponses. **[R]**
- Les incitations financières augmentent l'observance (Wrzus & Neubauer) ; chez les jeunes, l'acceptation baisse quand le nombre d'items augmente (Drexl). **[R]**

**Applications en vie réelle : l'attrition domine.**
- Baumel et al. (2019), 93 apps de santé mentale : rétention médiane **3,9 % à 15 jours et 3,3 % à 30 jours** ; les apps de suivi font un peu mieux (6,1 % à 30 jours). **[R]**
- Pratap et al. (2020), 8 études, plus de 100 000 participants : rétention médiane **5,5 jours** ; les plus âgés restent plus longtemps. **[R]**
- Meyerowitz-Katz et al. (2020) : abandon poolé 43 % [29 ; 57]. **[R]**
- Eysenbach (2005) : l'attrition est une propriété normale de ces outils, à analyser par des méthodes de survie. **[R]**
- Amagai et al. (2022) : favorisent la rétention le retour d'information, des rappels adaptés, le soutien ; la freinent les difficultés techniques et l'utilité perçue faible. **[R]**

### Solidité des preuves

- **Solide** pour l'observance en contexte de recherche et pour l'attrition en vie réelle.
- **Non trouvé** : un seuil empirique du nombre de « taps » tolérables, ou des données sur la saisie déclenchée par l'utilisateur en fin d'activité. La règle « 3 taps, 10 secondes » est une heuristique de conception.

### Implication concrète pour l'app

- **Zéro tap pour tout ce que le minuteur sait déjà** : début, fin, durée active, pauses.
- **Deux à trois taps** pour le reste, avec valeurs par défaut reprises de la dernière séance (matière, méthode).
- **Tout champ subjectif est facultatif** et le « passer » est un état enregistré, distinct d'une valeur manquante technique.
- **Manquants planifiés** : ne poser qu'une seule note subjective par séance, tirée au sort entre concentration et difficulté.
- **La récompense de la saisie est le retour d'information** : montrer immédiatement ce que la donnée apporte.
- **Dimensionner pour l'attrition** : prévoir que la majorité des comptes auront moins de 10 séances.

---

## 4. Personnalisation avec peu de données individuelles

### Ce que dit la littérature

**Cadres généraux.** Intervention adaptative « juste à temps » (Nahum-Shani et al., 2018) ; essai micro-randomisé (Klasnja et al., 2015 ; Qian et al., 2022) ; petit échantillon et unité unique (Hekler et al., 2019). **[R]**

**HeartSteps, l'exemple le plus instructif.**
- Klasnja et al. (2019) : 44 adultes, 6 semaines, 5 décisions par jour. Une suggestion augmente le nombre de pas sur 30 minutes de 14 % en moyenne (p = 0,06). L'effet est de +66 % au début puis **s'éteint**. **[R]**
- Qian, Klasnja & Murphy (2020) : 7 540 points de temps, 37 personnes, soit environ 200 observations par personne. La variance de l'effet aléatoire du traitement est estimée « extrêmement petite », test du rapport de vraisemblance p = 0,72. Conclusion des auteurs : l'hétérogénéité éventuelle n'est pas assez grande pour être détectée avec ces données. **[TI]**
- Même article : avec des covariables **endogènes** (qui dépendent des traitements et réponses passés), les coefficients d'un modèle mixte perdent leur interprétation marginale ; une hypothèse d'indépendance conditionnelle, non testable, est nécessaire. **[TI]**

**Bandits avec mise en commun partielle (Tomkins et al., 2021, IntelligentPooling).** Paramètre individuel = paramètre de population + effet aléatoire ; hyperparamètres par Bayes empirique ; échantillonnage de Thompson. Simulation : regret réduit de 26 %. Étude de faisabilité : **10 participants**, 90 jours ; l'algorithme n'a pu agir que sur environ 23 % des points de décision. Les auteurs présentent ces résultats comme préliminaires. **[TI]**

**Modèles de mémoire.**
- **Duolingo, régression de demi-vie** (Settles & Meeder, 2016) : 12,9 millions d'observations. Erreur absolue moyenne 0,128 contre 0,175 pour une constante ; AUC **0,538** seulement. La personnalisation passe par des **covariables d'historique** (nombre de vues, de réussites, d'échecs) avec des poids communs à tous, pas par des paramètres individuels. Les variables fines par mot sur-ajustaient. **[TI]**
- **FSRS**, banc d'essai public (environ 10 000 utilisateurs d'Anki, 350 millions de révisions, soit environ 35 000 par utilisateur) : **[TI]**

| Modèle | Paramètres ajustés par utilisateur | Log-perte | AUC |
|---|---|---|---|
| Constante individuelle (rétention moyenne de l'utilisateur) | — | 0,3945 | 0,50 |
| FSRS-7, paramètres par défaut (population) | 0 | 0,3620 | 0,703 |
| FSRS-7, optimisé par utilisateur | 34 | 0,3401 | 0,717 |

Lecture : un modèle structurel à paramètres de population, nourri de l'historique de chaque carte, fait déjà mieux qu'une constante individuelle. L'optimisation individuelle ajoute un gain réel mais modeste, avec des dizaines de milliers d'observations par personne.

- **Révision personnalisée en classe** (Lindsey et al., 2014, modèle bayésien hiérarchique) : +16,5 % de rétention contre l'étude massée et +10,0 % contre un espacement identique pour tous. **[R]**

**À très grande échelle, la personnalisation peut ne rien donner.** Kizilcec et al. (2020), 269 169 étudiants, 247 cours : une politique individualisée apprise par apprentissage automatique donne 13,38 % d'achèvement contre 12,81 % sans intervention et 13,08 % avec intervention aléatoire, différences non significatives. **[TI]**

**Réponse individuelle et essais n-de-1.**
- Senn (2016) : la croyance en une forte composante individuelle de la réponse n'est pas fondée sur des preuves statistiques solides ; l'identifier exige des plans répétés intra-sujet. **[R]**
- Zucker et al. (1997) : modèle bayésien hiérarchique combinant 23 essais n-de-1 ; l'estimation individuelle est un compromis entre population et individu. **[R]**
- Daza (2018) : cadre contrefactuel pour données auto-suivies, avec autocorrélation, tendance et effets rémanents. **[R]**

**Petits échantillons en modèles multiniveaux.** McNeish (2014) : surestimation de la variance inter-groupes quand il y a moins de 5 observations par groupe. McNeish & Stapleton (2016) : trop peu de groupes biaise certains paramètres. Hox & McNeish (2020) : revue des remèdes fréquentistes et bayésiens. **[R]** (détail des remèdes non lu).

**Shrinkage.** Savic & Karlsson (2009) : au-delà de 20 à 30 % de shrinkage, les diagnostics fondés sur les EBE deviennent trompeurs (relations covariables masquées, induites ou déformées). **[R]**

### Combien d'utilisateurs et de séances ? (illustration, calcul personnel)

Modèle linéaire mixte, avec ω² la variance inter-individuelle, σ² la variance résiduelle et n_eff l'information individuelle :

- fiabilité λ = ω² / (ω² + σ² / n_eff)
- shrinkage sur l'échelle écart-type = 1 − √λ
- shrinkage ≤ 30 % ⇔ n_eff ≳ 1,0 × σ²/ω² ; shrinkage ≤ 20 % ⇔ n_eff ≳ 1,8 × σ²/ω²

| Paramètre individuel | Hypothèse | n_eff | Séances pour shrinkage ≤ 30 % | ≤ 20 % |
|---|---|---|---|---|
| Niveau de base (ordonnée) | corrélation intra-classe 0,20 | n | ≈ 4 | ≈ 7 |
| Niveau de base | corrélation intra-classe 0,10 | n | ≈ 9 | ≈ 16 |
| Effet individuel d'une méthode | écart-type inter-individuel = 0,2 σ, méthode utilisée 1 séance sur 2 | n × 0,25 | ≈ 100 | ≈ 180 |
| Effet individuel d'une méthode | idem, méthode utilisée 1 séance sur 5 | n × 0,16 | ≈ 150 | ≈ 280 |
| Effet individuel d'une méthode | écart-type inter-individuel = 0,1 σ, 1 séance sur 2 | n × 0,25 | ≈ 380 | ≈ 710 |

Ces ordres de grandeur sont cohérents avec HeartSteps, où 200 observations par personne n'ont pas suffi. À 4 séances par semaine, 100 séances représentent 6 mois, alors que la rétention médiane des apps se compte en jours.

**Recoupement avec la simulation du projet** (`docs/simulations/02-effets-mixtes-bilan.csv` : σ = 0,8, condition présente une séance sur deux, N = 100 utilisateurs, 200 répliques). La formule ci-dessus retrouve le shrinkage simulé :

| Écart-type inter-individuel de l'effet | Séances | Shrinkage simulé | Shrinkage par la formule |
|---|---|---|---|
| 0,15 | 20 | 67 % | 61 % |
| 0,15 | 100 | 32 % | 32 % |
| 0,15 | 200 | 20 % | 20 % |
| 0,35 | 20 | 30 % | 30 % |
| 0,35 | 100 | 9 % | 9 % |
| 0,35 | 200 | 5 % | 5 % |

La même simulation montre ce que vaut réellement la personnalisation (part des utilisateurs recevant un conseil qui va dans le sens de leur effet vrai, N = 100) :

| Écart-type inter-individuel de l'effet | Séances | Conseil individualisé | Même conseil pour tous |
|---|---|---|---|
| 0,15 | 20 | 82,9 % | 83,7 % |
| 0,15 | 200 | 88,3 % | 84,3 % |
| 0,35 | 20 | 78,0 % | 66,3 % |
| 0,35 | 200 | 91,0 % | 67,2 % |

Lecture : si l'hétérogénéité vraie est faible, individualiser n'apporte rien avant une centaine de séances, et fait même légèrement moins bien à 20 séances. L'intérêt de la personnalisation dépend donc d'une quantité inconnue, l'écart-type inter-individuel de l'effet, que les données de la littérature (HeartSteps, Kizilcec) suggèrent plutôt petit.

### Solidité des preuves

- **Solide** : la mise en commun partielle est la bonne architecture ; les valeurs de population font l'essentiel du travail.
- **Solide** : les effets individuels de traitement sont très difficiles à estimer.
- **Fragile** : preuves d'un bénéfice réel de la personnalisation en éducation (un essai positif en classe, un résultat nul à très grande échelle).
- **Non trouvé** : règle validée donnant le nombre minimal d'utilisateurs pour des pentes aléatoires dans ce contexte.

### Implication concrète pour l'app

**Ce qui est faisable à 10–50 utilisateurs :**
1. **Valeurs typiques fixées par la littérature**, non estimées.
2. **Ordonnées aléatoires** par utilisateur et par matière : suffisant pour « se comparer à soi-même ».
3. **Personnaliser par covariables** (historique, jours avant examen, heure) avec des coefficients communs.
4. **Pentes aléatoires sous prior informatif serré**, et règle d'affichage : pas de message individualisé tant que le shrinkage estimé dépasse 30 %.
5. **Auto-expériences n-de-1 volontaires** : alterner deux méthodes par blocs sur une matière, avec un même contrôle différé.
6. **Simulation-estimation avant lancement** pour vérifier l'identifiabilité.
7. **Variabilité inter-occasions** : la variabilité d'une semaine à l'autre chez une même personne sera probablement aussi grande que la variabilité entre personnes ; la modéliser explicitement.

**Formulation honnête dans l'interface** : « conseil fondé sur la recherche, ajusté à tes données quand il y en a assez ».

---

## 5. Pièges causaux des données d'auto-suivi

### Ce que dit la littérature

- **Confusion variable dans le temps affectée par le traitement passé** (Robins, Hernán & Brumback, 2000) : l'ajustement classique est biaisé dans ce cas. **[R]**
- **Biais de sélection** (Hernán et al., 2004) : conditionner sur une conséquence commune de l'exposition et du résultat. **[R]**
- **Intra- contre inter-individuel** (Curran & Bauer, 2011 ; Hamaker et al., 2015) : sans séparation, les traits stables produisent des relations temporelles trompeuses. **[R]**
- **Effet causal d'excursion** et estimateur par moindres carrés pondérés et centrés (Boruvka et al., 2018 ; Qian et al., 2022). **[R]**
- **Taille d'échantillon d'un essai micro-randomisé** (Liao et al., 2016). **[R]**
- Manuel de référence : Hernán & Robins, *Causal Inference: What If* (2020), libre d'accès. **[R]**

### Traduction pour l'app

| Piège | Forme concrète | Parade |
|---|---|---|
| Confusion par indication | on choisit les QCM quand on se sent prêt | noter le statut du contenu (nouveau / révision) et les jours avant examen ; ne pas interpréter causalement |
| Confusion variable dans le temps | la maîtrise influence la méthode et le score, et dépend des méthodes passées | micro-randomisation ; à défaut, pondération inverse, pas simple ajustement |
| Critère différent selon la méthode | score de QCM d'un côté, note subjective de l'autre | critère commun : contrôle différé identique |
| Causalité inverse | une bonne semaine produit plus de séances | décaler dans le temps ; prudence sur « ce qui précède une bonne semaine » |
| Régression vers la moyenne | après une mauvaise semaine, la suivante est meilleure | comparer à un bras sans suggestion |
| Attrition informative | ceux qui ne progressent pas arrêtent de saisir | courbes de survie ; analyses de sensibilité |
| Comparaison entre personnes | les gros utilisateurs de QCM sont aussi les plus motivés | centrer par personne |
| Effet de nouveauté | une suggestion marche au début puis s'éteint | effet dépendant du temps ; varier les messages |

### Micro-randomiser les suggestions

**Principe.** À chaque point de décision, l'app tire au sort, avec une probabilité connue et enregistrée, si elle affiche une suggestion et laquelle. On estime alors sans confusion l'effet **de la suggestion** sur un résultat proche.

**Ce que ça ne donne pas directement.** L'effet de la méthode elle-même : pour y remonter il faut traiter la suggestion comme un instrument, avec des hypothèses supplémentaires (pas d'effet de la suggestion autrement que par la méthode).

**Recoupement avec la simulation du projet** (`docs/simulations/02-confusion-bilan.csv` : effet vrai 0,15, 50 utilisateurs × 60 séances, 200 répliques) :

| Estimateur | Moyenne | Écart-type |
|---|---|---|
| Naïf (méthode choisie librement) | 0,45 | 0,03 |
| Effet de la suggestion tirée au sort | 0,04 | 0,03 |
| Corrigé (effet de la suggestion ÷ différence de suivi) | 0,15 | 0,10 |

Lecture : l'estimateur naïf est **trois fois trop grand** et très précis, donc trompeur. L'estimateur corrigé est sans biais mais son écart-type (0,10) est du même ordre que l'effet (0,15) avec 3 000 séances : le tirage au sort règle le biais, pas le manque de puissance.

**Ordres de grandeur.**
- Bidargaddi et al. (2018) : 1 255 utilisateurs, 89 jours, une notification augmente l'engagement dans les 24 heures de **3,9 %** en relatif (rapport de risques 1,039 [1,01 ; 1,08]). **[R]**
- Yancey & Settles (2020, Duolingo) : +0,5 % d'utilisateurs actifs, +2 % de rétention des nouveaux ; réutiliser le même message réduit la réponse de 0,5 %. **[TI]**

Les effets attendus sont **petits**. À 10–50 utilisateurs, un essai micro-randomisé est un pilote d'apprentissage.

**Recommandations légères.**
1. Journal de décision à quatre champs (modèle Duolingo) : horodatage, utilisateur, probabilité de chaque bras, bras tiré.
2. Toujours garder un bras « aucune suggestion ».
3. Probabilités jamais égales à 0 ou 1.
4. Enregistrer la **disponibilité** (on ne suggère pas pendant une séance).
5. Écrire le plan d'analyse avant de regarder les données.

### Solidité des preuves

**Très solide** sur le plan méthodologique. L'application à la révision étudiante est une transposition : je n'ai trouvé aucun essai micro-randomisé publié dans une app de révision.

---

## 6. Mesurer la régularité

### Ce que dit la littérature

**Indice de régularité du sommeil (Phillips et al., 2017).** Probabilité d'être dans le même état (endormi ou éveillé) à deux instants séparés de 24 heures, moyennée sur la période, puis rééchelonnée : 100 = horaires identiques chaque jour, 0 = aléatoire. 61 étudiants suivis 30 jours : corrélation avec la moyenne académique **r = 0,37**, alors que la durée de sommeil ne diffère pas entre réguliers et irréguliers. **[TI]**

**Comparaison des métriques (Fischer et al., 2021).** **[R]**

| Métrique | Ce qu'elle capte | Remarque |
|---|---|---|
| Écart-type individuel, stabilité inter-journalière | écart au profil moyen de la personne | insensibles à l'ordre des jours ; plus d'une semaine de données nécessaire |
| Indice de régularité, déviation de phase composite | variation d'un jour au suivant | demandent plus de données pour détecter des différences |
| Décalage social | différence semaine / week-end | ne voit que le rythme hebdomadaire |

**Cours en ligne.** Boroujeni et al. (2016) proposent plusieurs mesures de régularité et les valident comme prédicteurs de la performance. **[R]** (liste précise des mesures non relue, article payant).

**Régularité, espacement et performance.**
- Carvalho et al. (2020) : répartir l'étude sur plusieurs séances est associé à de meilleurs scores, **y compris en comparant le même étudiant à lui-même** ; bénéfice plus grand chez les plus faibles. **[R]**
- Folkestad et al. (2026) : le score d'espacement prédit la note d'examen au-delà de la moyenne antérieure et du nombre de tentatives ; mais l'intervention randomisée n'a pas amélioré les notes. **[R]**
- Hartwig & Dunlosky (2012), 324 étudiants : les moins performants étudient plus souvent tard le soir et sous la pression des échéances. **[R]**
- Okano et al. (2019), 88 étudiants : qualité, durée et régularité du sommeil expliquent près de 25 % de la variance des notes ; la nuit précédant l'examen ne compte pas. **[R]**
- Credé & Kuncel (2008), N = 72 431 : habitudes et compétences d'étude prédisent la performance indépendamment des notes antérieures. **[R]**
- Steel (2007) ; Campione et al. (2026, 45 études en santé) : procrastination associée à de moins bonnes notes. **[R]**

**Heure de la journée et chronotype.**
- Tonetti et al. (2015), 31 études, 27 309 participants : vespéralité associée à de moins bonnes notes, effet **petit** (0,14), plus faible à l'université (0,12) et avec des notes objectives (0,09). **[R]**
- Smarr & Schirmer (2018), 14 894 étudiants : le décalage entre rythme propre et horaires imposés est associé à de moins bonnes notes. **[R]**
- Sievertsen et al. (2016) : chaque heure plus tard coûte 0,9 % d'écart-type ; une pause de 20 à 30 minutes rapporte 1,7 %. **[R]**

**Durée des séances et pauses.**
- Biwer et al. (2023), 87 étudiants : pauses systématiques (24 min / 6 min ou 12 / 3) contre pauses libres. Pauses libres : séances plus longues, plus de fatigue, moins de concentration ; même quantité de travail accomplie. **[R]**
- Albulescu et al. (2022), 22 échantillons : micro-pauses bénéfiques pour la vigueur (d = 0,36) et la fatigue (d = 0,35), effet non significatif sur la performance (d = 0,16). **[R]**

### Solidité des preuves

- **Moyenne** : associations cohérentes mais presque toutes observationnelles.
- **Faible** pour l'heure de la journée : effets minuscules.
- **Non trouvé** : un seuil validé d'heures par jour au-delà duquel le rendement décroît.

### Implication concrète pour l'app

**Score de régularité : deux composantes, affichées séparément.**
1. **Régularité hebdomadaire** (prioritaire) : ressemblance du profil « jour de semaine × tranche horaire » d'une semaine à l'autre. Les étudiants ont un emploi du temps hebdomadaire ; un indice à 24 heures pénaliserait injustement un rythme différent le mercredi.
2. **Répartition** : nombre de jours distincts avec séance, par semaine et par matière (c'est l'espacement).

**Règles.**
- Fenêtre glissante de 3 à 4 semaines ; rien d'affiché avant 2 semaines de données.
- Jours de repos **planifiés** non pénalisés.
- Score indépendant du volume total.
- Profil horaire : descriptif seulement, sans prescription.
- Minuteur 25/5 par défaut, durées réglables ; argument affiché : fatigue et concentration, pas performance.
- Plafond d'XP quotidien : le présenter comme un choix de bien-être.

---

## 7. Prédire le désengagement

### Ce que dit la littérature

**Taux de base.** Voir section 3 : 3,3 % de rétention à 30 jours, 5,5 jours de rétention médiane, 43 % d'abandon.

**Ce qui prédit.**
- Linardon et al. (2022), 826 participants : les **variables initiales** prédisent mal l'engagement (AUC 0,48 à 0,52) ; les **variables d'usage** prédisent bien l'abandon (AUC 0,75 à 0,93). **[R]**
- Whitehill et al. (2017), cours en ligne : AUC de 87 à 90 % avec les traces d'activité, mais entraîner et tester sur le même cours surestime la précision. **[R]**
- Gardner & Brooks (2018), revue : filtrages excessifs des populations, variables indisponibles en conditions réelles. **[R]**

**Ce qui aide.**
- Kizilcec et al. (2020) : les interventions de planification augmentent l'activité la première semaine, effet atténué dès la deuxième, **nul sur l'achèvement**. **[TI]**
- Bidargaddi et al. (2018) : +3,9 % d'engagement dans les 24 heures. **[R]**
- Klasnja et al. (2019) : effet des suggestions qui s'éteint. **[R]**
- Yancey & Settles (2020) : varier les messages. **[TI]**
- Mishra et al. (2021) : choisir le moment par un modèle de réceptivité améliore la réceptivité jusqu'à 40 % par rapport à un envoi aléatoire. **[R]**

### Solidité des preuves

- **Solide** : l'activité récente prédit l'activité future. C'est presque une tautologie : une AUC élevée ne prouve pas qu'on sache **quoi faire**.
- **Faible** : efficacité durable des interventions de réengagement.

### Implication concrète pour l'app

- **Variables utiles** : jours depuis la dernière séance, nombre de séances sur 7 et 28 jours, tendance, taux de saisie, jours avant examen.
- **Horizon** : 7 jours.
- **Validation temporelle stricte** : entraîner sur le passé, tester sur le futur.
- **Toujours comparer à une règle naïve** (« inactif depuis 5 jours »).
- **Sans harcèlement** : horaires choisis par l'utilisateur, plafond de fréquence, messages variés, arrêt après inactivité prolongée, micro-randomisation pour savoir si la notification sert à quelque chose.
- **Vocabulaire** : parler de « jours à risque » est un profilage au sens du RGPD (section 8).

---

## 8. Vie privée et RGPD

*Ceci est une synthèse de sources officielles, pas un avis juridique.*

### Ce que disent les textes et la CNIL

**Recommandation CNIL sur les applications mobiles** (24 septembre 2024, modifiée le 8 avril 2025). **[TI]**
- Elle couvre explicitement les **applications web progressives**.
- Contrôles annoncés à partir du printemps 2025.
- **Exemption domestique** : le RGPD ne s'applique pas à l'éditeur si le traitement est lancé par l'utilisateur, pour son seul compte, et dans un environnement cloisonné **sans intervention possible d'un tiers**. Exemple cité : une app qui conserve les données uniquement en local, sans connexion extérieure. La CNIL « encourage, à titre de bonne pratique, ce choix de conception ».
- Dès que les données sont stockées sur les serveurs de l'éditeur ou d'un tiers, l'éditeur est responsable de traitement.
- Obligations de l'éditeur : base légale par finalité ; minimisation ; durée de conservation ; registre ; analyse d'impact si les critères sont remplis ; politique de confidentialité accessible avant installation ; centre de gestion des droits dans l'app ; traitement local « lorsque cela est possible » ; sauvegarde distante facultative.

**Bases légales.** Six bases ; pour une app : consentement, contrat ou intérêt légitime. Le contrat ne couvre que ce qui est objectivement nécessaire au service. **[TI]**

**Mineurs.** Article 8 du RGPD : 16 ans, abaissable à 13. France : **15 ans** (article 45 de la loi Informatique et Libertés). En dessous, pour un service fondé sur le consentement, accord conjoint du mineur et d'un titulaire de l'autorité parentale. **[R]** (texte de l'article cité via la page CNIL, non relu sur Légifrance).

**Donnée de santé.** Trois catégories : par nature ; **par croisement** (exemple CNIL : le poids croisé avec le nombre de pas et les apports caloriques) ; par destination. **[R]** Les données sensibles sont interdites sauf exception, dont le consentement explicite. **[TI]**

**Profilage.** Traitement visant à analyser ou prédire le comportement d'une personne. L'article 22 n'interdit que la décision entièrement automatisée à effet juridique ou significatif. **[R]**

**Analyse d'impact.** Obligatoire si au moins deux critères sur neuf, parmi lesquels : évaluation ou notation (dont profilage), données sensibles, personnes vulnérables, usage innovant, grande échelle. **[R]**

**Hébergement et transferts.**
- Supabase : régions disponibles à **Paris (eu-west-3)**, Francfort, Irlande, Stockholm, Zurich, Londres ; la région choisie détermine le lieu de stockage principal. **[R]**
- Accord de traitement des données Supabase, « Version 1 — 1ᵉʳ août 2026 » : entité contractante **Supabase Pte. Ltd (Singapour)**, rôle de sous-traitant, clauses contractuelles types intégrées. **[R]** (à revérifier au moment de signer).
- Décisions d'adéquation de la Commission : États-Unis uniquement pour les organismes adhérant au cadre de protection des données ; **Singapour absent de la liste**. **[R]**
- CNIL : hors adéquation, clauses types et analyse d'impact du transfert. **[R]**

**Usage « recherche ».**
- Définition large de la recherche scientifique : doctorants et chercheurs indépendants peuvent s'en prévaloir s'ils suivent les standards méthodologiques et éthiques. **[R]**
- Bases légales : consentement, mission d'intérêt public (organismes publics), intérêt légitime (organismes privés, avec mise en balance documentée). **[R]**
- La réutilisation pour la recherche est réputée compatible avec la finalité initiale, sauf si elle sert à prendre des décisions sur les personnes. **[R]**
- Conservation plus longue possible avec garanties ; données **anonymisées** conservables sans limite. **[R]**
- Anonymisation : trois critères (individualisation, corrélation, inférence) ; la pseudonymisation reste dans le RGPD. **[R]**
- Saisine de la CNIL requise seulement si : recherche publique, données sensibles et motif d'intérêt public important. **[R]**
- Code de la santé publique, article R1121-1 : les expérimentations en sciences humaines et sociales dans le domaine de la santé et l'évaluation des pratiques d'enseignement ne sont pas des recherches impliquant la personne humaine. **[R]**

### Solidité

Sources officielles, ouvertes directement. Incertitudes : qualification exacte de données de fatigue ou d'humeur (appréciation au cas par cas) ; obligation d'hébergeur certifié pour les données de santé (**non vérifiée**, page inaccessible).

### Implication concrète pour l'app

**Architecture à deux étages.**

| Étage | Données | Régime |
|---|---|---|
| 1. Local par défaut | séances, statistiques personnelles, calculs sur l'appareil | peut relever de l'exemption domestique si rien ne sort de l'appareil |
| 2. Synchronisation et contribution au modèle | données pseudonymisées envoyées au serveur | RGPD complet : éditeur responsable de traitement |

Le modèle à effets mixtes exige de centraliser : il relève de l'étage 2.

**Finalités et bases légales à séparer.**
- Fournir le service (compte, sauvegarde) : contrat.
- Améliorer les recommandations par un modèle de population : consentement distinct, recommandé.
- Recherche et publication : consentement distinct, retirable.

**Règles de conception.**
- **Âge minimal** : 15 ans déclarés, ou 18 ans pour simplifier.
- **Ne pas collecter d'humeur, de fatigue, de sommeil ni de santé.** Formuler les notes comme des propriétés de la **séance** (« cette séance était-elle difficile ? »), pas de la personne.
- **Pas de champ de texte libre** synchronisé.
- **Horodatages dégradés** côté serveur si la précision n'est pas nécessaire.
- **Région Paris ou Francfort** ; accepter l'accord de traitement ; noter l'entité contractante ; documenter le transfert.
- **Analyse d'impact légère** dès que la prédiction du décrochage est activée.
- **Publication** : agrégats uniquement. Un journal de séances horodaté est difficile à anonymiser.
- Si le projet s'inscrit dans un cadre universitaire, consulter le délégué à la protection des données de l'établissement.

---

## 9. Proposition de schéma de données minimal par séance

### Table `seance`

| Champ | Type | Saisie | Pourquoi il vaut son tap |
|---|---|---|---|
| `id` | uuid | auto | clé |
| `utilisateur_id` | uuid pseudonyme | auto | niveau individuel du modèle |
| `debut`, `fin` | horodatage + décalage horaire | auto | durée, profil horaire, régularité, espacement |
| `duree_active_s` | entier | auto | temps réel hors pauses |
| `duree_prevue_min` | entier | auto | séance tenue ou abandonnée |
| `nb_interruptions` | entier | auto | indicateur objectif de concentration |
| `source` | énumération : minuteur, saisie manuelle | auto | fiabilité différente |
| `matiere_id` | clé étrangère | 1 tap (défaut) | ventilation, espacement par matière |
| `methode` | énumération (ci-dessous) | 1 tap (défaut) | exposition d'intérêt |
| `statut_contenu` | énumération : nouveau, révision | 0 ou 1 tap | facteur de confusion ; légitime la première lecture |
| `nb_items` | entier, facultatif | 1 saisie | dénominateur du critère |
| `nb_reussis` | entier, facultatif | 1 saisie | critère binomial |
| `corrige_consulte` | booléen | défaut vrai | modérateur le plus fort |
| `note_subjective_type` | énumération : concentration, difficulté, aucune | auto (tirage) | manquants planifiés |
| `note_subjective` | entier 1–5, facultatif | 1 tap | covariable de processus |
| `saisie_passee` | booléen | auto | « passer » distinct de « manquant » |
| `xp_attribue`, `version_regle_xp` | entier, texte | auto | modéliser les changements d'incitation |
| `version_app`, `version_schema` | texte | auto | traçabilité |

**Valeurs de `methode`** : lecture de première passe ; relecture ; fiche cours ouvert ; fiche de mémoire (cours fermé) ; QCM ou annales ; flashcards ; exercices ou problèmes ; autre.

### Table `matiere`

| Champ | Type | Pourquoi |
|---|---|---|
| `id`, `utilisateur_id`, `libelle` | — | le libellé peut rester local |
| `date_examen` | date, facultative | « jours avant examen » : facteur de confusion majeur, saisi une fois |

### Table `controle_differe`

| Champ | Type | Pourquoi |
|---|---|---|
| `seance_origine_id` | clé étrangère | relie le contrôle à la séance évaluée |
| `pose_le` | horodatage | délai réel |
| `resultat` | entier 0–3 ou part retrouvée | **critère commun à toutes les méthodes** |

### Table `decision_suggestion`

| Champ | Type | Pourquoi |
|---|---|---|
| `id`, `utilisateur_id`, `decide_le` | — | point de décision |
| `disponible` | booléen | exclusion des moments non éligibles |
| `probabilites` | objet bras → probabilité | indispensable à l'analyse |
| `bras_tire` | énumération, dont « aucune » | traitement |
| `reaction` | énumération : suivie, écartée, ignorée | résultat proche |
| `seance_liee_id` | clé étrangère, facultative | lien avec le comportement |

### Parcours de saisie cible

1. Fin du minuteur : tout l'automatique est enregistré.
2. Écran unique : matière et méthode pré-remplies.
3. Si méthode de récupération : deux nombres.
4. Une note 1–5 facultative.
5. Valider ou passer.

---

## 10. Feuille de route data science réaliste

| | ≈ 10 utilisateurs | ≈ 100 utilisateurs | ≈ 1 000 utilisateurs |
|---|---|---|---|
| **Objectif** | valider la mesure | estimer des effets moyens | hétérogénéité et adaptation |
| **Descriptif** | taux de remplissage, temps de saisie, courbes individuelles | courbes de survie, régularité | segments, saisonnalité |
| **Modèle** | aucun modèle estimé ; valeurs de la littérature ; simulation-estimation | modèle mixte bayésien : ordonnées aléatoires, effets fixes à priors informatifs, pentes très régularisées | pentes aléatoires, effets dépendant du temps, variabilité inter-occasions |
| **Critère** | tester la faisabilité du contrôle différé | binomial réussites/items ; contrôle différé | + résultats d'examen déclarés, si consentis |
| **Causalité** | journal de décision en place, tirage actif | premier essai micro-randomisé à 2 bras | essais multi-bras, bandit hiérarchique |
| **Désengagement** | règle naïve | règle naïve contre régression logistique | modèle de survie à covariables temporelles |
| **Personnalisation affichée** | aucune | niveau de base personnel ; conseil de population | conseil individualisé si shrinkage < 30 % |
| **Diagnostics** | — | shrinkage, vérifications prédictives | + calibration par sous-groupe |
| **Conformité** | local par défaut, politique rédigée | registre, consentements séparés, analyse d'impact légère | analyse d'impact complète, protocole de recherche |
| **À ne pas faire** | conclure quoi que ce soit | promettre du « sur mesure » | publier des données fines |

**Ordre de priorité.** 1) Critère de jugement valide. 2) Journal de randomisation dès la première version. 3) Modèle de population. 4) Personnalisation, en dernier.

---

## 11. Ce que je n'ai pas pu vérifier

| Élément | Statut |
|---|---|
| Maas & Hox (2005), tailles d'échantillon en multiniveau | page inaccessible ; **non cité comme preuve** |
| Nelson & Dunlosky (1991), chiffres originaux | référence confirmée, chiffres non relus |
| Adesope et al. (2017) | sources secondaires seulement |
| Rawson & Kintsch (2005) ; Callender & McDaniel (2009) | connus via Greving & Richter (2019) |
| van Gog & Sweller (2015) ; Karpicke & Aue (2015) | extraits de recherche seulement |
| Gignac & Zajenkowski (2020) | extrait de recherche seulement |
| Boroujeni et al. (2016) | résumé lu ; liste des mesures non relue |
| Carpenter, Pan & Butler (2022), revue de synthèse | non ouvert ; **non cité** |
| Méta-analyse procrastination et notes (Kim & Seo, 2015) | non ouvert ; **non cité** |
| McNeish & Stapleton (2016) ; Hox & McNeish (2020) | résumés seulement |
| Article 45 de la loi Informatique et Libertés | cité via la CNIL |
| Hébergeur certifié pour données de santé | page inaccessible |
| Notifications d'une app web installée sur iPhone | non vérifié ici (voir rapport 05) |
| Entité contractante Supabase | lue sur la page officielle, à revérifier à la signature |
| Seuil d'heures par jour à rendement décroissant | **aucune preuve trouvée** |
| Nombre de taps tolérable | **aucune preuve trouvée** |
| Fausse déclaration de méthode dans une app gamifiée | **aucune étude trouvée** |
| Essai micro-randomisé dans une app de révision | **aucun trouvé** |
| Plan d'encouragement / variable instrumentale | concept standard, source primaire non ouverte |

---

## 12. Références

*D'après PubMed pour toutes les notices marquées [R] ou [TI] relevant de la psychologie, de la santé et des statistiques biomédicales. Les DOI sont donnés sous forme de liens.*

### Techniques de révision

- Adesope OO, Trevisan DA, Sundararajan N. Rethinking the use of tests: a meta-analysis of practice testing. *Review of Educational Research*, 2017. [DOI](https://doi.org/10.3102/0034654316689306) **[S]**
- Blasiman RN, Dunlosky J, Rawson KA. The what, how much, and when of study strategies. *Memory*, 2017;25(6):784-792. [DOI](https://doi.org/10.1080/09658211.2016.1221974) **[R]**
- Brunmair M, Richter T. Similarity matters: a meta-analysis of interleaved learning and its moderators. *Psychological Bulletin*, 2019. [DOI](https://doi.org/10.1037/bul0000209) **[TI]**
- Burel J, et al. Spaced repetition and other key factors influencing medical school entrance exam success: insights from a French survey. *BMC Medical Education*, 2025;25:1036. [DOI](https://doi.org/10.1186/s12909-025-07605-w) **[R]**
- Cepeda NJ, Pashler H, Vul E, Wixted JT, Rohrer D. Distributed practice in verbal recall tasks. *Psychological Bulletin*, 2006;132(3):354-380. [DOI](https://doi.org/10.1037/0033-2909.132.3.354) **[TI]**
- Cepeda NJ, Vul E, Rohrer D, Wixted JT, Pashler H. Spacing effects in learning: a temporal ridgeline of optimal retention. *Psychological Science*, 2008;19(11):1095-1102. [DOI](https://doi.org/10.1111/j.1467-9280.2008.02209.x) **[R]**
- Deci EL, Koestner R, Ryan RM. A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation. *Psychological Bulletin*, 1999;125(6):627-668. [DOI](https://doi.org/10.1037/0033-2909.125.6.627) **[R]**
- Deng F, Gluckstein JA, Larsen DP. Student-directed retrieval practice is a predictor of medical licensing examination performance. *Perspectives on Medical Education*, 2015;4(6):308-313. [DOI](https://doi.org/10.1007/s40037-015-0220-x) **[R]**
- Donoghue GM, Hattie JAC. A meta-analysis of ten learning techniques. *Frontiers in Education*, 2021;6:581216. [DOI](https://doi.org/10.3389/feduc.2021.581216) **[TI]**
- Dunlosky J, Rawson KA, Marsh EJ, Nathan MJ, Willingham DT. Improving students' learning with effective learning techniques. *Psychological Science in the Public Interest*, 2013;14(1):4-58. [DOI](https://doi.org/10.1177/1529100612453266) **[R]**
- Gerlach P, Teodorescu K, Hertwig R. The truth about lies: a meta-analysis on dishonest behavior. *Psychological Bulletin*, 2019;145(1):1-44. [DOI](https://doi.org/10.1037/bul0000174) **[R]**
- Gilbert MM, et al. A cohort study assessing the impact of Anki as a spaced repetition tool on academic performance in medical school. *Medical Science Educator*, 2023;33(4):955-962. [DOI](https://doi.org/10.1007/s40670-023-01826-8) **[R]**
- Green ML, Moeller JJ, Spak JM. Test-enhanced learning in health professions education: BEME Guide No. 48. *Medical Teacher*, 2018;40(4):337-350. [DOI](https://doi.org/10.1080/0142159X.2018.1430354) **[R]**
- Greving CE, Richter T. Distributed learning in the classroom: effects of rereading schedules depend on time of test. *Frontiers in Psychology*, 2019;9:2517. [DOI](https://doi.org/10.3389/fpsyg.2018.02517) **[TI]**
- Hartwig MK, Dunlosky J. Study strategies of college students: are self-testing and scheduling related to achievement? *Psychonomic Bulletin & Review*, 2012;19(1):126-134. [DOI](https://doi.org/10.3758/s13423-011-0181-y) **[R]**
- Karpicke JD, Blunt JR. Retrieval practice produces more learning than elaborative studying with concept mapping. *Science*, 2011;331:772-775. [DOI](https://doi.org/10.1126/science.1199327) **[R]**
- Karpicke JD, Roediger HL. The critical importance of retrieval for learning. *Science*, 2008;319:966-968. [DOI](https://doi.org/10.1126/science.1152408) **[R]**
- Kerfoot BP, et al. Online "spaced education progress-testing" of students. *Academic Medicine*, 2011;86(3):300-306. [DOI](https://doi.org/10.1097/ACM.0b013e3182087bef) **[R]**
- Larsen DP, Butler AC, Roediger HL. Repeated testing improves long-term retention relative to repeated study: a randomised controlled trial. *Medical Education*, 2009;43(12):1174-1181. [DOI](https://doi.org/10.1111/j.1365-2923.2009.03518.x) **[R]**
- Latimier A, Peyre H, Ramus F. A meta-analytic review of the benefit of spacing out retrieval practice episodes on retention. *Educational Psychology Review*, 2021;33:959-987. [DOI](https://doi.org/10.1007/s10648-020-09572-8) **[R]**
- Levy J, et al. Exploring Anki usage among first-year medical students. *Journal of Medical Education and Curricular Development*, 2023;10. [DOI](https://doi.org/10.1177/23821205231205389) **[R]**
- Mawson RD, Kang SHK. The distributed practice effect on classroom learning. *Behavioral Sciences*, 2025;15(6):771. [DOI](https://doi.org/10.3390/bs15060771) **[R]**
- Palmer S, Chu Y, Persky AM. Comparison of rewatching class recordings versus retrieval practice. *American Journal of Pharmaceutical Education*, 2019;83(9):7217. [DOI](https://doi.org/10.5688/ajpe7217) **[R]**
- Richland LE, Kornell N, Kao LS. The pretesting effect. *Journal of Experimental Psychology: Applied*, 2009;15(3):243-257. [DOI](https://doi.org/10.1037/a0016496) **[R]**
- Roediger HL, Karpicke JD. Test-enhanced learning. *Psychological Science*, 2006;17(3):249-255. [DOI](https://doi.org/10.1111/j.1467-9280.2006.01693.x) **[R]**
- Rowland CA. The effect of testing versus restudy on retention. *Psychological Bulletin*, 2014;140(6):1432-1463. [DOI](https://doi.org/10.1037/a0037559) **[TI]**
- Schmidmaier R, et al. Using electronic flashcards to promote learning in medical students: retesting versus restudying. *Medical Education*, 2011;45(11):1101-1110. [DOI](https://doi.org/10.1111/j.1365-2923.2011.04043.x) **[R]**
- Sezgin MG, Bektas H. Effects of spaced learning in health professions education: systematic review and meta-analysis. *Nurse Education Today*, 2026;166:107285. [DOI](https://doi.org/10.1016/j.nedt.2026.107285) **[R]**
- Terenyi J, Anksorus H, Persky AM. Impact of spacing of practice on learning brand name and generic drugs. *American Journal of Pharmaceutical Education*, 2018;82(1):6179. [DOI](https://doi.org/10.5688/ajpe6179) **[R]**
- Terenyi J, Anksorus H, Persky AM. Optimizing the spacing of retrieval practice to improve pharmacy students' learning of drug names. *American Journal of Pharmaceutical Education*, 2019;83(6):7029. [DOI](https://doi.org/10.5688/ajpe7029) **[R]**
- Trumble E, Lodge J, Mandrusiak A, Forbes R. Systematic review of distributed practice and retrieval practice in health professions education. *Advances in Health Sciences Education*, 2024;29(2):689-714. [DOI](https://doi.org/10.1007/s10459-023-10274-3) **[R]**
- Yang C, Luo L, Vadillo MA, Yu R, Shanks DR. Testing (quizzing) boosts classroom learning. *Psychological Bulletin*, 2021;147(4):399-435. [DOI](https://doi.org/10.1037/bul0000309) **[TI]**

### Métacognition et auto-évaluation

- Blanch-Hartigan D. Medical students' self-assessment of performance: results from three meta-analyses. *Patient Education and Counseling*, 2011;84(1):3-9. [DOI](https://doi.org/10.1016/j.pec.2010.06.037) **[R]**
- Deslauriers L, McCarty LS, Miller K, Callaghan K, Kestin G. Measuring actual learning versus feeling of learning. *PNAS*, 2019;116(39):19251-19257. [DOI](https://doi.org/10.1073/pnas.1821936116) **[R]**
- Gignac GE, Zajenkowski M. The Dunning-Kruger effect is (mostly) a statistical artefact. *Intelligence*, 2020. [Page éditeur](https://www.sciencedirect.com/science/article/abs/pii/S0160289620300271) **[S]**
- Kirk-Johnson A, Galla BM, Fraundorf SH. Perceiving effort as poor learning: the misinterpreted-effort hypothesis. *Cognitive Psychology*, 2019;115:101237. [DOI](https://doi.org/10.1016/j.cogpsych.2019.101237) **[R]**
- Koriat A, Bjork RA. Illusions of competence in monitoring one's knowledge during study. *Journal of Experimental Psychology: Learning, Memory, and Cognition*, 2005;31(2):187-194. [DOI](https://doi.org/10.1037/0278-7393.31.2.187) **[R]**
- Kornell N, Bjork RA. Learning concepts and categories: is spacing the "enemy of induction"? *Psychological Science*, 2008;19(6):585-592. [DOI](https://doi.org/10.1111/j.1467-9280.2008.02127.x) **[TI]**
- Kruger J, Dunning D. Unskilled and unaware of it. *Journal of Personality and Social Psychology*, 1999;77(6):1121-1134. [DOI](https://doi.org/10.1037/0022-3514.77.6.1121) **[R]**
- Nelson TO, Dunlosky J. When people's judgments of learning are extremely accurate at predicting subsequent recall: the "delayed-JOL effect". *Psychological Science*, 1991;2(4):267-270. [DOI](https://doi.org/10.1111/j.1467-9280.1991.tb00147.x) **[S]**
- Rhodes MG, Tauber SK. The influence of delaying judgments of learning on metacognitive accuracy: a meta-analytic review. *Psychological Bulletin*, 2011;137(1):131-148. [DOI](https://doi.org/10.1037/a0021705) **[R]**
- Song J, Howe E, Oltmanns JR, Fisher AJ. Examining the concurrent and predictive validity of single items in ecological momentary assessments. *Assessment*, 2023;30(5):1662-1671. [DOI](https://doi.org/10.1177/10731911221113563) **[R]**
- Zell E, Krizan Z. Do people have insight into their abilities? A metasynthesis. *Perspectives on Psychological Science*, 2014;9(2):111-125. [DOI](https://doi.org/10.1177/1745691613518075) **[R]**

### Modèles de mémoire et outils

- Anki, foire aux questions : algorithme de répétition espacée. [Lien](https://faqs.ankiweb.net/what-spaced-repetition-algorithm) ; questions fréquentes sur FSRS. [Lien](https://faqs.ankiweb.net/frequently-asked-questions-about-fsrs.html) **[TI]**
- Expertium. A technical explanation of FSRS. [Lien](https://expertium.github.io/Algorithm.html) **[TI]**
- Open Spaced Repetition. SRS Benchmark. [Lien](https://github.com/open-spaced-repetition/srs-benchmark) **[TI]** (chiffres relevés le 29 septembre 2026)
- Lindsey RV, Shroyer JD, Pashler H, Mozer MC. Improving students' long-term knowledge retention through personalized review. *Psychological Science*, 2014;25(3):639-647. [DOI](https://doi.org/10.1177/0956797613504302) **[R]**
- Settles B, Meeder B. A trainable spaced repetition model for language learning. *Proceedings of ACL*, 2016:1848-1858. [DOI](https://doi.org/10.18653/v1/P16-1174) **[TI]**
- Ye J, Su J, Cao Y. A stochastic shortest path algorithm for optimizing spaced repetition scheduling. *KDD*, 2022. [DOI](https://doi.org/10.1145/3534678.3539081) **[S]**

### Micro-saisie, observance, attrition

- Amagai S, et al. Challenges in participant engagement and retention using mobile health apps. *Journal of Medical Internet Research*, 2022;24(4):e35120. [DOI](https://doi.org/10.2196/35120) **[R]**
- Baumel A, Muench F, Edan S, Kane JM. Objective user engagement with mental health apps. *Journal of Medical Internet Research*, 2019;21(9):e14567. [DOI](https://doi.org/10.2196/14567) **[R]**
- Drexl K, et al. Readdressing the ongoing challenge of missing data in youth ecological momentary assessment studies. *Journal of Medical Internet Research*, 2025;27:e65710. [DOI](https://doi.org/10.2196/65710) **[R]**
- Eisele G, et al. The effects of sampling frequency and questionnaire length on perceived burden, compliance, and careless responding. *Assessment*, 2022;29(2):136-151. [DOI](https://doi.org/10.1177/1073191120957102) **[R]**
- Eysenbach G. The law of attrition. *Journal of Medical Internet Research*, 2005;7(1):e11. [DOI](https://doi.org/10.2196/jmir.7.1.e11) **[R]**
- Hasselhorn K, Ottenstein C, Lischetzke T. The effects of assessment intensity on participant burden, compliance, within-person variance. *Behavior Research Methods*, 2022;54(4):1541-1558. [DOI](https://doi.org/10.3758/s13428-021-01683-6) **[R]**
- Meyerowitz-Katz G, et al. Rates of attrition and dropout in app-based interventions for chronic disease. *Journal of Medical Internet Research*, 2020;22(9):e20283. [DOI](https://doi.org/10.2196/20283) **[R]**
- Pratap A, et al. Indicators of retention in remote digital health studies. *NPJ Digital Medicine*, 2020;3:21. [DOI](https://doi.org/10.1038/s41746-020-0224-8) **[R]**
- Rintala A, Wampers M, Myin-Germeys I, Viechtbauer W. Response compliance and predictors thereof in studies using the experience sampling method. *Psychological Assessment*, 2019;31(2):226-235. [DOI](https://doi.org/10.1037/pas0000662) **[R]**
- Wen CKF, Schneider S, Stone AA, Spruijt-Metz D. Compliance with mobile ecological momentary assessment protocols in children and adolescents. *Journal of Medical Internet Research*, 2017;19(4):e132. [DOI](https://doi.org/10.2196/jmir.6641) **[R]**
- Williams MT, et al. Compliance with mobile ecological momentary assessment in adults. *Journal of Medical Internet Research*, 2021;23(3):e17023. [DOI](https://doi.org/10.2196/17023) **[R]**
- Wrzus C, Neubauer AB. Ecological momentary assessment: a meta-analysis on designs, samples, and compliance. *Assessment*, 2023;30(3):825-846. [DOI](https://doi.org/10.1177/10731911211067538) **[R]**

### Personnalisation, essais micro-randomisés, causalité

- Bidargaddi N, et al. To prompt or not to prompt? A microrandomized trial of time-varying push notifications. *JMIR mHealth and uHealth*, 2018;6(11):e10123. [DOI](https://doi.org/10.2196/10123) **[R]**
- Boruvka A, Almirall D, Witkiewitz K, Murphy SA. Assessing time-varying causal effect moderation in mobile health. *Journal of the American Statistical Association*, 2018;113(523):1112-1121. [DOI](https://doi.org/10.1080/01621459.2017.1305274) **[R]**
- Curran PJ, Bauer DJ. The disaggregation of within-person and between-person effects in longitudinal models of change. *Annual Review of Psychology*, 2011;62:583-619. [DOI](https://doi.org/10.1146/annurev.psych.093008.100356) **[R]**
- Daza EJ. Causal analysis of self-tracked time series data using a counterfactual framework for N-of-1 trials. *Methods of Information in Medicine*, 2018;57(1):e10-e21. [DOI](https://doi.org/10.3414/ME16-02-0044) **[R]**
- Hamaker EL, Kuiper RM, Grasman RPPP. A critique of the cross-lagged panel model. *Psychological Methods*, 2015;20(1):102-116. [DOI](https://doi.org/10.1037/a0038889) **[R]**
- Hekler EB, et al. Why we need a small data paradigm. *BMC Medicine*, 2019;17:133. [DOI](https://doi.org/10.1186/s12916-019-1366-x) **[R]**
- Hernán MA, Hernández-Díaz S, Robins JM. A structural approach to selection bias. *Epidemiology*, 2004;15(5):615-625. [DOI](https://doi.org/10.1097/01.ede.0000135174.63482.43) **[R]**
- Hernán MA, Robins JM. *Causal Inference: What If*. Chapman & Hall/CRC, 2020. [Lien](https://miguelhernan.org/whatifbook) **[R]**
- Hox J, McNeish D. Small samples in multilevel modeling. In : *Small Sample Size Solutions*, Routledge, 2020. [Lien](https://www.taylorfrancis.com/chapters/oa-edit/10.4324/9780429273872-18/small-samples-multilevel-modeling-joop-hox-daniel-mcneish) **[R]**
- Kizilcec RF, et al. Scaling up behavioral science interventions in online education. *PNAS*, 2020;117(26):14900-14905. [DOI](https://doi.org/10.1073/pnas.1921417117) **[TI]**
- Klasnja P, et al. Microrandomized trials: an experimental design for developing just-in-time adaptive interventions. *Health Psychology*, 2015;34S:1220-1228. [DOI](https://doi.org/10.1037/hea0000305) **[R]**
- Klasnja P, et al. Efficacy of contextually tailored suggestions for physical activity: a micro-randomized optimization trial of HeartSteps. *Annals of Behavioral Medicine*, 2019;53(6):573-582. [DOI](https://doi.org/10.1093/abm/kay067) **[R]**
- Liao P, Klasnja P, Tewari A, Murphy SA. Sample size calculations for micro-randomized trials in mHealth. *Statistics in Medicine*, 2016;35(12):1944-1971. [DOI](https://doi.org/10.1002/sim.6847) **[R]**
- Liao P, Greenewald K, Klasnja P, Murphy S. Personalized HeartSteps: a reinforcement learning algorithm for optimizing physical activity. *Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies*, 2020;4(1). [DOI](https://doi.org/10.1145/3381007) **[R]**
- McNeish DM. Modeling sparsely clustered data. *Psychological Methods*, 2014;19(4):552-563. [DOI](https://doi.org/10.1037/met0000024) **[R]**
- McNeish DM, Stapleton LM. The effect of small sample size on two-level model estimates. *Educational Psychology Review*, 2016;28:295-314. [DOI](https://doi.org/10.1007/s10648-014-9287-x) **[R]**
- Nahum-Shani I, et al. Just-in-time adaptive interventions (JITAIs) in mobile health. *Annals of Behavioral Medicine*, 2018;52(6):446-462. [DOI](https://doi.org/10.1007/s12160-016-9830-8) **[R]**
- Qian T, Klasnja P, Murphy SA. Linear mixed models with endogenous covariates. *Statistical Science*, 2020;35(3):375-390. [DOI](https://doi.org/10.1214/19-sts720) **[TI]**
- Qian T, et al. The microrandomized trial for developing digital interventions. *Psychological Methods*, 2022;27(5):874-894. [DOI](https://doi.org/10.1037/met0000283) **[R]**
- Robins JM, Hernán MA, Brumback B. Marginal structural models and causal inference in epidemiology. *Epidemiology*, 2000;11(5):550-560. [DOI](https://doi.org/10.1097/00001648-200009000-00011) **[R]**
- Savic RM, Karlsson MO. Importance of shrinkage in empirical Bayes estimates for diagnostics. *The AAPS Journal*, 2009;11(3):558-569. [DOI](https://doi.org/10.1208/s12248-009-9133-0) **[R]**
- Senn S. Mastering variation: variance components and personalised medicine. *Statistics in Medicine*, 2016;35(7):966-977. [DOI](https://doi.org/10.1002/sim.6739) **[R]**
- Tomkins S, Liao P, Klasnja P, Murphy S. IntelligentPooling: practical Thompson sampling for mHealth. *Machine Learning*, 2021;110(9):2685-2727. [DOI](https://doi.org/10.1007/s10994-021-05995-8) **[TI]**
- Yancey KP, Settles B. A sleeping, recovering bandit algorithm for optimizing recurring notifications. *KDD*, 2020. [DOI](https://doi.org/10.1145/3394486.3403351) **[TI]**
- Zucker DR, et al. Combining single patient (N-of-1) trials to estimate population treatment effects. *Journal of Clinical Epidemiology*, 1997;50(4):401-410. [DOI](https://doi.org/10.1016/s0895-4356(96)00429-5) **[R]**

### Régularité, chronotype, pauses

- Albulescu P, et al. "Give me a break!" A systematic review and meta-analysis on the efficacy of micro-breaks. *PLoS One*, 2022;17(8):e0272460. [DOI](https://doi.org/10.1371/journal.pone.0272460) **[R]**
- Biwer F, Wiradhany W, Oude Egbrink MGA, de Bruin ABH. Understanding effort regulation: comparing "Pomodoro" breaks and self-regulated breaks. *British Journal of Educational Psychology*, 2023;93 Suppl 2:353-367. [DOI](https://doi.org/10.1111/bjep.12593) **[R]**
- Boroujeni MS, Sharma K, Kidziński Ł, Lucignano L, Dillenbourg P. How to quantify student's regularity? *EC-TEL 2016*. [DOI](https://doi.org/10.1007/978-3-319-45153-4_21) **[R]**
- Campione E, et al. Self-regulated learning and academic success in health professions students: a systematic review. *Medical Teacher*, 2026. [DOI](https://doi.org/10.1080/0142159X.2026.2691075) **[R]**
- Carvalho PF, Sana F, Yan VX. Self-regulated spacing in a massive open online course is related to better learning. *NPJ Science of Learning*, 2020;5:2. [DOI](https://doi.org/10.1038/s41539-020-0061-1) **[R]**
- Credé M, Kuncel NR. Study habits, skills, and attitudes: the third pillar supporting collegiate academic performance. *Perspectives on Psychological Science*, 2008;3(6):425-453. [DOI](https://doi.org/10.1111/j.1745-6924.2008.00089.x) **[R]**
- Fischer D, Klerman EB, Phillips AJK. Measuring sleep regularity: theoretical properties and practical usage of existing metrics. *Sleep*, 2021;44(10):zsab103. [DOI](https://doi.org/10.1093/sleep/zsab103) **[R]**
- Folkestad JE, et al. U-Behavior: a method to promote spaced and interleaved retrieval practice. *Access Microbiology*, 2026;8(8). [DOI](https://doi.org/10.1099/acmi.0.001226.v3) **[R]**
- Okano K, et al. Sleep quality, duration, and consistency are associated with better academic performance in college students. *NPJ Science of Learning*, 2019;4:16. [DOI](https://doi.org/10.1038/s41539-019-0055-z) **[R]**
- Phillips AJK, et al. Irregular sleep/wake patterns are associated with poorer academic performance. *Scientific Reports*, 2017;7:3216. [DOI](https://doi.org/10.1038/s41598-017-03171-4) **[TI]**
- Sievertsen HH, Gino F, Piovesan M. Cognitive fatigue influences students' performance on standardized tests. *PNAS*, 2016;113(10):2621-2624. [DOI](https://doi.org/10.1073/pnas.1516947113) **[R]**
- Smarr BL, Schirmer AE. 3.4 million real-world learning management system logins reveal the majority of students experience social jet lag. *Scientific Reports*, 2018;8:4793. [DOI](https://doi.org/10.1038/s41598-018-23044-8) **[R]**
- Steel P. The nature of procrastination. *Psychological Bulletin*, 2007;133(1):65-94. [DOI](https://doi.org/10.1037/0033-2909.133.1.65) **[R]**
- Tonetti L, Natale V, Randler C. Association between circadian preference and academic achievement. *Chronobiology International*, 2015;32(6):792-801. [DOI](https://doi.org/10.3109/07420528.2015.1049271) **[R]**

### Désengagement

- Gardner J, Brooks C. Student success prediction in MOOCs. *User Modeling and User-Adapted Interaction*, 2018. [DOI](https://doi.org/10.1007/s11257-018-9203-z) ; [arXiv](https://arxiv.org/abs/1711.06349) **[R]**
- Linardon J, et al. An exploratory application of machine learning methods to optimize prediction of responsiveness to digital interventions for eating disorder symptoms. *International Journal of Eating Disorders*, 2022;55(6):845-850. [DOI](https://doi.org/10.1002/eat.23733) **[R]**
- Mishra V, et al. Detecting receptivity for mHealth interventions in the natural environment. *Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies*, 2021;5(2). [DOI](https://doi.org/10.1145/3463492) **[R]**
- Whitehill J, et al. Delving deeper into MOOC student dropout prediction. 2017. [arXiv](https://arxiv.org/abs/1702.06404) **[R]**

### Vie privée, RGPD, hébergement

- CNIL. Recommandation relative aux applications mobiles (publiée le 8 avril 2025). [PDF](https://www.cnil.fr/sites/cnil/files/2025-04/recommandation-applications-mobiles-modifiee.pdf) ; [page de présentation](https://www.cnil.fr/fr/applications-mobiles-la-cnil-publie-ses-recommandations-pour-mieux-proteger-la-vie-privee) **[TI]**
- CNIL. Les bases légales. [Lien](https://www.cnil.fr/fr/les-bases-legales/liceite-essentiel-sur-les-bases-legales) **[R]**
- CNIL. Huit recommandations pour la protection des mineurs en ligne. [Lien](https://www.cnil.fr/fr/la-cnil-publie-8-recommandations-pour-renforcer-la-protection-des-mineurs-en-ligne) ; [recommandation 4, moins de 15 ans](https://www.cnil.fr/fr/recommandation-4-rechercher-le-consentement-dun-parent-pour-les-mineurs-de-moins-de-15-ans) ; [recommandation 1](https://www.cnil.fr/fr/recommandation-1-encadrer-la-capacite-dagir-des-mineurs-en-ligne) **[R]**
- CNIL. Qu'est-ce qu'une donnée de santé ? [Lien](https://www.cnil.fr/fr/quest-ce-ce-quune-donnee-de-sante) **[R]**
- CNIL. Profilage et décision entièrement automatisée. [Lien](https://www.cnil.fr/fr/profilage-et-decision-entierement-automatisee) **[R]**
- CNIL. Ce qu'il faut savoir sur l'analyse d'impact. [Lien](https://www.cnil.fr/fr/ce-quil-faut-savoir-sur-lanalyse-dimpact-relative-la-protection-des-donnees-aipd) **[R]**
- CNIL. L'anonymisation de données personnelles. [Lien](https://www.cnil.fr/fr/technologies/lanonymisation-de-donnees-personnelles) **[R]**
- CNIL. Transférer des données hors de l'Union européenne. [Lien](https://www.cnil.fr/fr/transferer-des-donnees-hors-de-lue) **[R]**
- CNIL. Cookies et autres traceurs : que dit la loi ? [Lien](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/que-dit-la-loi) **[R]**
- CNIL. Guide RGPD du développeur. [Lien](https://www.cnil.fr/fr/guide-rgpd-du-developpeur) **[R]**
- CNIL. Recherche scientifique (hors santé) : [dossier](https://www.cnil.fr/fr/recherche-scientifique-hors-sante) ; [bases légales](https://www.cnil.fr/fr/recherche-scientifique-hors-sante/base-legale) ; [droits des personnes](https://www.cnil.fr/fr/recherche-scientifique-hors-sante/respect-des-droits-des-personnes) ; [durées de conservation](https://www.cnil.fr/fr/recherche-scientifique-hors-sante/durees-conservations-donnees) ; [anonymisation et pseudonymisation](https://www.cnil.fr/fr/recherche-scientifique-hors-sante/enjeux-avantages-anonymisation-pseudonymisation) ; [données sensibles](https://www.cnil.fr/fr/recherche-scientifique-hors-sante/focus-certaines-categories-donnees-personnelles) ; [questions-réponses](https://www.cnil.fr/fr/recherche-scientifique-hors-sante/questions-reponses-de-la-cnil) ; [quand saisir la CNIL](https://www.cnil.fr/fr/traitements-de-donnees-des-fins-de-recherche-scientifique-hors-sante-quand-saisir-la-cnil) **[R]**
- Code de la santé publique, article R1121-1. [Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000034696952) **[R]**
- Commission européenne. Décisions d'adéquation. [Lien](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/adequacy-decisions_en) **[R]**
- RGPD : [article 2](https://gdpr-info.eu/art-2-gdpr/), [article 5](https://gdpr-info.eu/art-5-gdpr/), [article 8](https://gdpr-info.eu/art-8-gdpr/), [article 9](https://gdpr-info.eu/art-9-gdpr/), [article 89](https://gdpr-info.eu/art-89-gdpr/) **[R]**
- Supabase. Régions disponibles. [Lien](https://supabase.com/docs/guides/platform/regions) ; accord de traitement des données. [Lien](https://supabase.com/legal/dpa) ; liste des sous-traitants ultérieurs. [Lien](https://supabase.com/legal/customer-resources/subprocessor-list) **[R]**
