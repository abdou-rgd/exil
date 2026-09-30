# Question au conseiller : formule d'XP et économie du jeu

*Préparée le 30 septembre 2026. Le conseiller ne voit pas la session de développement : tout le contexte utile est ici.*

---

## Contexte

Web app installable (PWA) pour six amis étudiants de filières différentes, tous sur iPhone. Elle transforme le temps de révision en progression de jeu de rôle « cozy ». Je suis étudiant en M2 de pharmacométrie ; Claude écrit le code. Le prototype de notification est terminé et en cours de mesure. L'étape suivante est un **prototype jouable et social** pour les six amis : minuteur, journal de séance en deux gestes, intention de la semaine avec jours de repos, calendrier de régularité, feu de camp commun, chantier d'un château de guilde.

**Principes fixés** : le jeu se joue avant et après la séance, jamais pendant. On récompense la régularité et les bonnes méthodes plutôt que le volume. Aucun classement, aucune sanction, aucune notification culpabilisante ; on montre qui travaille, jamais combien. Toute XP est calculée côté serveur (fonctions Postgres), jamais par le client. Le minuteur est horodaté par le serveur. La méthode de travail est **déclarée** par l'étudiant (lecture, relecture, fiche cours ouvert, fiche de mémoire, QCM ou annales, exercices, flashcards, explication à quelqu'un), donc non vérifiable.

**Recherche déjà faite** (résumé) : l'effet de la gamification chez les étudiants est faible et l'engagement creuse vers les semaines 4 à 6 ; l'XP à la minute récompense la simple présence (risque motivationnel, Deci 1999) ; les méthodes actives (rappel, test, espacement) ont la base de preuves la plus solide, avec un multiplicateur défendable entre 1,25 et 1,5 ; il faut formuler l'XP comme une information (« tu as tenu 4 de tes 5 jours ») plutôt que comme un contrat ; séries souples (jours prévus tenus, deux jokers par semaine, réparation), jamais de menace.

## La formule retenue : variante B (« les engagements d'abord »)

Choisie par Abdallah sur la base d'une simulation en R (12 semaines, 7 profils, 200 tirages).

| Paramètre | Valeur |
|---|---|
| XP par minute, de 0 à 2 h de concentration cumulée dans la journée | 1,0 |
| de 2 à 5 h | 0,6 |
| de 5 à 8 h | 0,3 |
| au-delà de 8 h | 0,1 |
| Objectif du jour tenu (objectif fixé à l'avance par l'étudiant) | 250 à partir de 2 h visées ; en dessous, 250 × √(objectif / 120 min) |
| Crédit d'un jour prévu | min(1, minutes / objectif) : un jour à moitié fait compte à moitié |
| Semaine tenue | 600, au prorata des jours prévus tenus |
| Méthodes actives | × 1,25 sur l'XP des minutes (la relecture vaut × 1,0) |
| Régularité | jusqu'à + 25 %, selon un score en moyenne glissante exponentielle des crédits des jours prévus (α = 0,07, soit une mémoire d'environ trois semaines ; départ à 0,5) |
| Jour de repos prévu | ne touche pas au score de régularité |

Non encore simulés : bonus d'espacement (revenir sur une matière vue au moins un jour avant), jokers, bonus de groupe.

**Résultats de la simulation, variante B** (XP sur 12 semaines rapportée au profil régulier) :

| Profil | Heures | XP relative | Part des engagements dans l'XP |
|---|---|---|---|
| Marathonienne (8 h, 6 j/sem) | 547 | 1,60 | 37 % |
| Régulière (3 h, 5 j/sem) | 170 | 1 | 53 % |
| Petits pas (1 h, 6 j/sem) | 69 | 0,73 | 70 % |
| Bachoteur sur 4 semaines (5 h 30/j) | 171 | 0,69 | 46 % |
| Week-end seulement (2 × 7 h 30) | 171 | 0,69 | 53 % |
| Irrégulier (3 h, un jour sur deux au hasard) | 126 | 0,61 | 46 % |
| Bachoteur sur 2 semaines (10 h 50/j) | 171 | 0,44 | 41 % |

La courbe de niveau utilisée dans la simulation (XP cumulée pour le niveau n = 25 n² + 75 n) mène la régulière au niveau 30 et la marathonienne au niveau 38 en 12 semaines.

## L'économie décidée (à confirmer avec vous)

- **Deux ressources.** L'**Élan** (temps de travail et méthodes) fait monter le personnage. L'**or** (engagements tenus) se dépense en cosmétiques et en rénovation d'un château de guilde en ruine, rénové par l'effort de tous, sans jamais de dégâts ; un absent ne coûte rien aux autres.
- **Niveaux plafonnés à 10**, remis à 1 à chaque semestre ; la progression passée devient un souvenir permanent (le semestre est une « saison »).
- **Nouvelle idée d'Abdallah, à trancher** : faire de l'Élan la monnaie (le nom lui semble très symbolique), au lieu de l'or.

## Mes questions

1. **Formule.** La variante B vous paraît-elle saine, ou voyez-vous un défaut de structure ? En particulier : l'objectif du jour est fixé par l'étudiant lui-même et vaut jusqu'à 250 XP. Un étudiant peut-il « farmer » des objectifs minuscules ? La racine carrée en dessous de 2 h suffit-elle, ou faut-il un plancher, un plafond d'objectifs, ou un objectif proposé par l'app ?
2. **Répartition entre les deux ressources.** Dans la variante B, les engagements tenus pèsent environ la moitié de l'XP. Si l'Élan vient du temps et des méthodes et l'or des engagements, les deux ressources recoupent-elles proprement la formule, ou faut-il une autre découpe ?
3. **L'Élan comme monnaie.** Si l'Élan fait monter le niveau ET se dépense, dépenser fait-il régresser ? Faut-il séparer un Élan cumulé (niveau) d'un solde d'Élan (dépenses) ? Ou garder l'or comme monnaie et l'Élan comme progression ? Donnez une recommandation tranchée avec sa raison.
4. **Courbe de niveaux.** Proposez une courbe pour 10 niveaux sur un semestre d'environ 15 semaines, qui laisse la régulière atteindre le niveau 10 vers la fin du semestre sans que la marathonienne l'atteigne en quatre semaines, et qui ne donne pas l'impression de stagner vers les semaines 4 à 6. Faut-il que le plafond soit atteignable par les « petits pas » ?
5. **Remise à 1 chaque semestre.** Risque-t-elle de démotiver (perte ressentie) ? Comment la présenter pour qu'elle soit vécue comme une nouvelle saison, et que garder d'un semestre à l'autre ?
6. **Méthodes déclarées.** Le bonus de 25 % repose sur une déclaration invérifiable. Faut-il le garder tel quel, le plafonner, ou le lier à un geste vérifiable (par exemple la « question du lendemain » : au début d'une séance, l'app demande ce qu'on retient de la dernière fois, puis on vérifie et on se note) ?
7. **Groupe.** Quelle forme donner au bonus de groupe (séance commune, chantier du château) sans créer de paresse sociale ni de pression, sachant qu'on ne montre jamais les quantités des autres ?
8. **Données.** Quelles données brutes enregistrer dès maintenant, par séance, pour pouvoir changer la formule plus tard sans rien perdre, et pour une future analyse (modèle à effets mixtes, suggestions tirées au sort) ?
