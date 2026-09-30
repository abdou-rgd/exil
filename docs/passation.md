# Passation pour la session de développement

*Écrit le 30 septembre 2026 à la fin de la session de cadrage, mis à jour le soir même à la fin de la première session de développement. À lire en entier avant toute action.*

## État au 30 septembre 2026 au soir

**Fait.**
- **Étape 0 terminée et en ligne** : https://exil-theta.vercel.app (Vercel, branche `main`). Prototype de notification installé sur l'iPhone d'Abdallah (iPhone 16e, iOS 27.0). Mesure : 12 alertes sur 12 reçues, retard médian 7,9 s, maximum 10,8 s. Campagne en cours selon `docs/campagne-notifications.md` ; série longue programmée pour le 7 et le 14 octobre (ne pas réinstaller l'app avant, sinon la relancer).
- Spécification et plan de l'étape 0 : `docs/superpowers/specs/2026-09-30-etape-0-notifications-design.md`, `docs/superpowers/plans/2026-09-30-etape-0-notifications.md` (19 tâches faites, trois relectures `sonnet`, 35 tests unitaires et 46 tests distants).
- Économie, saisons, boss, classes, bestiaire, icône, voix : décidés dans l'après-midi (décisions 3, 5, 6, 10, 11 ci-dessous).

**Limite connue.** L'accusé « vue » (toucher la notification) ne s'est jamais enregistré ; Abdallah n'a peut-être pas touché de notification depuis la correction `caab3b6`. À vérifier au prochain test ; il ne compte pas dans la règle de décision.

**Prochaine étape.** Spécifier puis planifier le **prototype jouable et social** (fusion des anciennes étapes 1 et 2), avec `superpowers:brainstorming` puis `superpowers:writing-plans`. Garder le premier livrable petit (feu de camp, minuteur, journal, intention de la semaine, Élan et braises, boss du dimanche, deux ou trois classes, chantier du château) et dévoiler le reste saison après saison. Questions ouvertes : voir « Décisions encore ouvertes ».

**Où sont les choses.**

| Sujet | Fichier |
|---|---|
| Réponses du conseiller Fable | `docs/conseiller/` (architecture des notifications ; formule d'XP et économie) |
| Classes, bestiaire d'automne, décisions de lore | `docs/lore/classes-et-bestiaire-propositions.md` |
| Voix du jeu, règles d'écriture, exemples, lexique | `docs/lore/guide-de-voix.md` (**à suivre pour tout texte du jeu**) |
| Écrits personnels d'Abdallah (source du guide) | `textes/`, hors de git |
| Simulation de l'Élan sur une saison | `docs/simulations/03-formule-xp-saison.R` et ses sorties |
| Direction artistique : prompts pour Claude Design | `docs/direction-artistique/prompt-claude-design.md` (premier) et `message-design-2.md` (mise à jour, envoyée par Abdallah) |
| Icône | `scripts/lune-pixel.mjs`, `scripts/icones.mjs` ; esquisses : https://claude.ai/artifact/Qtag5Lh3UUbaWhLSHfZnsg |

**Faire tourner le projet.** Node 24, Git Bash, pas de Docker. Développer sur la branche `etape-0` (ou une nouvelle), puis avancer `main` en avance rapide et pousser : Vercel publie `main`. Commandes : `npm test`, `npm run test:distant` (sur le projet Supabase réel, dans des transactions annulées), `npm run build`, `npm run db:push` (migrations, créées avec `npx supabase migration new <nom>`), `npm run sql -- "<requête>"`, `npx supabase functions deploy envoyer --no-verify-jwt --use-api`, `npx supabase db advisors --linked`. Secrets : `.env.local` et `supabase/.env.secrets`, jamais affichés ni commités ; Abdallah dépose lui-même les secrets distants. Supabase : projet `hsadmkgaaxcmpebiayky`, pooler `aws-1-eu-west-3`. Commits signés avec l'adresse masquée GitHub d'Abdallah (réglée dans le dépôt), sinon Vercel refuse de déployer.

**Travailler avec Abdallah.** Une question à la fois, avec des options et une recommandation. Signaler toute contradiction avec une décision déjà prise. Quand il écrit « /advisor », lancer un sous-agent sur le modèle Fable avec une question écrite dans `docs/conseiller/`. Il préfère que les fichiers supprimés aillent à la corbeille.

## Le projet en une phrase

Une web app installable sur iPhone et iPad qui transforme le temps de révision de six amis étudiants en progression de RPG, en récompensant la régularité plutôt que le volume, sans aucune comparaison entre eux.

## Qui fait quoi

- **Abdallah** (M2 pharmacométrie, futur data scientist) : décisions de produit et de direction artistique, tests sur son iPhone et ceux de ses amis, création des comptes, tout le volet data science plus tard. **Il ne connaît pas JavaScript** : le code est écrit par Claude, et chaque choix technique lui est expliqué en une ou deux phrases, sans jargon non défini.
- **Claude (Opus, cette session)** : conception détaillée restante, spécification, plan, implémentation, tests.
- **Claude Fable, en conseiller** (lancé comme sous-agent sur le modèle Fable quand Abdallah le demande) : à consulter avant les décisions structurantes (formule d'XP, architecture des notifications, schéma de données, sécurité) et pour une relecture avant chaque test avec les amis. Formuler la question avec le contexte nécessaire, puisque le conseiller ne voit pas cette session.

## Ce qui existe déjà

| Fichier | Contenu | Quand le lire |
|---|---|---|
| `docs/avis-projet.md` | Verdict, fonctionnalité par fonctionnalité, changements prioritaires, périmètre par étapes, data science, DA, technique | **D'abord, en entier** |
| `docs/research/05-faisabilite-technique-pwa-ios.md` | Capacités iOS vérifiées, options de notification, quotas Supabase et Vercel, architecture recommandée, prototypes à faire | Avant toute ligne de code |
| `docs/research/02-apprentissage-et-data-science.md` | Section 9 : schéma de données minimal par séance ; section 8 : RGPD | Avant le schéma de base |
| `docs/research/03-game-design-idle-cozy-rpg.md` | Boucles de jeu, classes, économie, DA | Avant les écrans de jeu |
| `docs/research/01-sciences-du-comportement.md` | Pourquoi chaque mécanique est gardée, ajustée ou évitée | Quand une mécanique est discutée |
| `docs/research/04-panorama-applis-productivite.md` | Applications comparables, erreurs à ne pas reproduire | Pour se situer |
| `docs/simulations/` | Formule d'XP (deux variantes) et faisabilité du modèle à effets mixtes, en R | Avant d'implémenter l'XP |
| `docs/direction-artistique/` | Palettes tirées des références, sprites originaux, aperçus et sources des trois directions | Avant les écrans |
| `docs/entretiens-camarades.md` | Guide d'entretien | Si Abdallah veut interroger les amis |

Planche de direction artistique publiée : https://claude.ai/artifact/Rhkd2EGrizMQgSnSJ1fQ9g

## Décisions prises

1. **Premier public : six amis** de filières différentes, tous sur iPhone ou iPad. Android hors périmètre. Aucune fonction publique, aucun texte libre partagé, une seule guilde sur invitation.
2. **Pas de matières imposées.** Une étiquette personnelle facultative suffit ; elle sert aux statistiques personnelles et à la question du lendemain (plus de bonus d'espacement depuis le 30/09/2026).
3. **Méthodes génériques** : lecture de première passe, relecture, fiche cours ouvert, fiche de mémoire, QCM ou annales, exercices et problèmes, flashcards, explication à quelqu'un. *Depuis le 30/09/2026 : aucune méthode ne rapporte plus qu'une autre.*
4. **Le jeu se joue avant et après la séance, jamais pendant.**
5. **Un chantier permanent plutôt qu'un boss** : le château de guilde en ruine se rénove avec l'effort de tous, n'inflige jamais de dégâts, et un membre absent ne coûte rien aux autres. Le feu de camp du départ est dans la cour du château.
   *Complété le 30/09/2026 :* en plus du chantier, **un boss de guilde hebdomadaire** qui se résout tout seul le dimanche à 14 h. La lune rougit au fil de la semaine à l'approche du combat. Les « coups » sont les journées prévues et tenues par chacun, en part de sa propre intention, jamais en minutes. Présence facultative (on peut regarder ensemble au feu), jamais de dégâts, un absent est « en voyage », un boss non vaincu se retire et les dégâts restent acquis.
6. **Deux ressources** (confirmé avec le conseiller le 30/09/2026, voir `docs/conseiller/2026-09-30-formule-xp-economie-reponse.md`) : l'**Élan** est toute l'XP de la variante B et fait monter le personnage, sans jamais baisser ; les **braises** sont la monnaie (1 par jour prévu tenu, 3 par semaine tenue, 1 par séance commune), dépensées en cosmétiques et en rénovation. Niveaux 1 à 10, Élan cumulé de forme 250 (n − 1)(n + 2) ajustée pour un niveau 10 à 25 000. **Saisons climatiques** (automne, hiver, printemps, été, environ 13 semaines) plutôt que semestres, car les filières n'ont pas le même calendrier : chaque saison a son ambiance visuelle, et seul le compteur d'Élan repart, sans perte (personnage, braises, château, cosmétiques et emblème de saison restent). Semaine tenue : 150 par jour prévu tenu, plafond 600. Objectif du jour d'au moins 30 min, figé au premier lancement du minuteur ; son bonus est **proportionnel** au crédit du jour (un jour presque tenu rapporte presque tout). Simulation : `docs/simulations/03-formule-xp-saison.R` (mode « proportionnel », seuil 25 000). **Aucun bonus de méthode ni d'espacement** (décision d'Abdallah du 30/09/2026 : l'app pousse à travailler, elle ne dit pas comment ; toutes les méthodes rapportent pareil, la méthode reste déclarable en un geste facultatif pour les statistiques, et les conseils fondés sur la recherche vivent à part, comme de simples astuces). Seul reste le bonus de régularité, jusqu'à + 25 % sur l'Élan des minutes. Sur 13 semaines : niveau 10 vers la semaine 10 pour la régulière, 13 pour les petits pas, 7 pour la marathonienne. Séance commune : + 50 Élan et 1 braise par jour.
7. **Séries qui plient sans casser** : jours prévus tenus, jours de repos planifiés, deux jokers par semaine, réparation, aucune notification de menace.
8. **Séance de groupe** : code court affiché par l'hôte, minuteur et pauses communs, présence affichée sans les heures.
9. **Minuteur par horodatages serveur ; toute écriture d'XP passe par des fonctions serveur** (jamais calculée côté client).
10. **La contrée s'appelle l'Exil.** Le nom public de l'app se décide plus tard ; « Lexile » est une marque déposée dans l'éducation.
11. **Direction artistique** : A « Veillée » et B « Carnet de route » comme les deux faces d'un système, avec des sprites en pixels pour les personnages. Direction C écartée pour son coût en dessins. Inspiration : la DA pastel de Grimgar, jamais ses images ni ses noms.
   *Complété le 30/09/2026 :* icône = lune de sang en pixel art, symétrique, fêlée et recollée à l'or (variante D, `scripts/lune-pixel.mjs`). Classes et bestiaire : `docs/lore/classes-et-bestiaire-propositions.md` (six classes fondées sur une loi physique, sans trinité attaque, soin, protection ; choix de la classe à l'inscription ; les classes ne donnent que du récit et des trouvailles ; bestiaire progressif, certaines créatures deviennent voisines du château).
12. **Pile technique** (rapport 05) : Vite, React, TypeScript, vite-plugin-pwa ; Supabase (Postgres, Auth, Realtime, Edge Functions, pg_cron) en région Paris ; Vercel Hobby. Comptes des six amis créés à la main dans Supabase pour éviter le service d'e-mail intégré.

## Décisions encore ouvertes

*Mise à jour du 30 septembre 2026 au soir. Les quatre décisions ouvertes de la session de cadrage sont tranchées : variante B (décision 6), nom provisoire « L'Exil » (décision 10), bâtiments du château en principe seul, durée du minuteur choisie à la première séance (25/5, 50/10 ou pauses libres).*

| Décision | État |
|---|---|
| **Chat en jeu** | Ouverte. Abdallah veut voir qui est en ligne, lui parler et proposer une séance commune, pour quitter Instagram et Snapchat. Va contre la décision 1 (aucun texte libre partagé). Voie intermédiaire proposée : présence, demande de séance en un geste, chat de groupe fermé pendant le minuteur. RGPD à prendre en compte. |
| **Liste des bâtiments du château** | Ouverte : 5 à 7 bâtiments, 3 états, chacun débloque une fonction. |
| **Découpage du prototype jouable** | Ouvert : quelles classes, quels bâtiments, quelles créatures dans le premier livrable. |
| **Changer de classe après l'inscription** | Ouvert (la classe se choisit à l'inscription). |
| **Nuits par saison et lune** | En cours avec la session Claude Design : une nuit par saison climatique, lune de l'emblème qui rougit jusqu'à l'Aurum Rubrum. |
| **Nom public de l'app** | Plus tard, pour une éventuelle sortie publique ; « L'Exile » est à éviter (trop proche de « Lexile »). |

## Ordre de travail

1. *Fait.* **Cadrage restant** : confirmer les décisions ouvertes avec Abdallah, une question à la fois, puis écrire la spécification dans `docs/superpowers/specs/` et le plan dans `docs/superpowers/plans/` (compétences `superpowers:brainstorming` puis `superpowers:writing-plans`). Ne pas coder avant la validation du plan.
2. *Fait* (dépôt privé github.com/abdou-rgd/exil). **Initialiser le dépôt git** et y mettre `docs/` en premier commit.
3. *Construite le 30/09/2026 ; campagne en cours, protocole dans `docs/campagne-notifications.md`, app sur https://exil-theta.vercel.app.* **Étape 0, prototype de notification** : page installable, bouton « me notifier dans N minutes », table de notifications dues, tâche pg_cron toutes les 10 à 15 secondes, Edge Function d'envoi. Test sur deux ou trois iPhone : téléphone verrouillé 25 minutes, mode Concentration, 14 jours sans ouvrir l'app. Critère : 95 % des alertes en moins de 30 secondes. En dessous, en parler au conseiller avant de continuer.
4. **Prochaine étape : le prototype jouable et social**, qui fusionne les étapes 1 et 2 ci-dessous (voir « État au 30 septembre au soir »).
5. **Étape 1, le cœur en solo** : minuteur, journal en deux gestes, intention de la semaine et jours de repos, calendrier de régularité, Élan et niveau, écran de retour de séance.
6. **Étape 2, la tablée** : groupe sur invitation, séance commune par code, chantier du château.
7. **Étape 3, la profondeur** : personnages, cosmétiques, bâtiments dévoilés un par un.
8. **Étape 4, la data science** : statistiques descriptives, journal de tirage des suggestions dès l'étape 1, modèle plus tard. Ce volet revient à Abdallah.

## Règles de travail

- Les règles globales d'Abdallah (`~/.claude/rules/`) s'appliquent : tests d'abord, relecture par agent après chaque bloc de code, pas de secret dans le code, commits conventionnels.
- **Sous-agents en `sonnet` pour les tâches cadrées, `opus` pour la conception ; jamais Fable par défaut.** Prévenir avant de lancer plus de deux agents : les crédits sont limités.
- Petites étapes livrées souvent : chaque étape doit pouvoir être testée par Abdallah sur son iPhone le jour même.
- Toute donnée qui compte est côté serveur ; le stockage local n'est qu'un cache.
- Rien ne meurt, rien ne se perd, aucun classement, aucune sanction, aucune notification culpabilisante. En cas de doute sur une mécanique, relire le tableau de synthèse du rapport 01.
