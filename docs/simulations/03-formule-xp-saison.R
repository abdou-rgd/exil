# 03-formule-xp-saison.R
# Simulation de la formule d'XP finale (validée avec le conseiller) sur une saison entière,
# 13 semaines (une saison climatique) et 15 semaines, pour les sept profils de 01-formule-xp.R.
# Question : les niveaux 1 à 10 se gagnent-ils à un rythme qui garde un cap chaque semaine,
# et l'Élan (= toute l'XP) reste-t-il fidèle à la régularité plutôt qu'au volume ?
# Lancer depuis la racine du projet : Rscript docs/simulations/03-formule-xp-saison.R
#
# Reprend de 01 (variante B) : paliers de minutes, profils, score de régularité R, crédit partiel,
# façon d'appliquer le bonus du jour (tout ou rien : versé seulement si le crédit du jour vaut 1).
# Hypothèses ajoutées (absentes de 01) :
#  - Espacement : une séance revient sur une matière vue au moins un jour avant avec une
#    probabilité de 0,6 par jour travaillé ; 0,3 pour les bachoteurs pendant leur phase intensive.
#  - Séance commune : un jour travaillé par semaine, tiré au hasard, pour tous les profils.
#  - Phase intensive des bachoteurs : les 2 (resp. 4) dernières semaines de la saison, comme en 01.
#  - Bilans de semaine (semaine tenue, braises de semaine) versés le dimanche, fin de la semaine.
#  - Le niveau d'une semaine est celui atteint à la fin de cette semaine.

suppressPackageStartupMessages({
  library(dplyr); library(tidyr); library(purrr); library(ggplot2)
})
dossier   <- "docs/simulations"
n_graines <- 200
durees    <- c(13, 15)    # semaines de la saison

# ---- Paramètres de la formule : tout ce qui est discutable est ici ----
p <- list(
  paliers    = c(0, 120, 300, 480, Inf),  # minutes de concentration cumulées dans la journée
  coef       = c(1.0, 0.6, 0.3, 0.1),     # XP par minute dans chaque palier (variante B)
  bonus_jour_mode = "proportionnel",  # choisi le 30/09/2026 ; "tout_ou_rien" (comme 01 : versé si crédit = 1) ou
                                     # "proportionnel" (bonus × min(1, minutes / objectif))
  objectif_min   = 30,    # plancher de l'objectif du jour (un objectif plus petit est porté à 30)
  bonus_jour     = 250,   # objectif du jour tenu ; plein tarif à partir de objectif_plein
  objectif_plein = 120,   # en dessous, le bonus vaut bonus_jour * sqrt(objectif / objectif_plein)
  xp_jour_tenu   = 150,   # semaine tenue : XP par jour prévu tenu (crédit du jour, donc partiel possible)
  plafond_sem    = 600,   # plafond hebdomadaire de ce bonus
  alpha      = 0.07,      # vitesse d'adaptation du score de régularité R (mémoire d'environ 3 semaines)
  R_depart   = 0.5,       # score de régularité de départ, neutre
  part_active = 0.5,      # part de séances en méthodes actives (comme en 01)
  w_actif = 0.25, w_regul = 0.25, w_espace = 0.10,  # bonus additifs sur l'XP des minutes
  mult_max = 1.5,         # plafond du multiplicateur
  p_espace = 0.6,         # probabilité d'une séance d'espacement, par jour travaillé
  p_espace_intense = 0.3, # idem pour les bachoteurs en phase intensive
  xp_commune = 50,        # séance commune, une fois par jour
  xp_niveau10 = 25000,    # Élan cumulé requis au niveau 10
  niveau_max = 10,
  braise_jour = 1,        # par jour prévu tenu (crédit >= 1)
  braise_sem = 3,         # par semaine avec au moins jours_braise_sem jours prévus tenus
  jours_braise_sem = 4,
  braise_commune = 1      # par séance commune
)

xp_minutes <- function(m, p) {
  # XP tirée des minutes du jour : coefficient décroissant par palier
  sum(pmax(0, pmin(m, p$paliers[-1]) - p$paliers[-length(p$paliers)]) * p$coef)
}

# Élan cumulé requis pour le niveau n : 25000 (n - 1)(n + 2) / 108, donc 25 000 au niveau 10
seuil_niveau <- function(n, p) p$xp_niveau10 * (n - 1) * (n + 2) / ((p$niveau_max - 1) * (p$niveau_max + 2))
niveau <- function(xp, p) 1 + rowSums(outer(xp, seuil_niveau(2:p$niveau_max, p), `>=`))  # plafonné à 10

# ---- Profils : ce qui est prévu (jours, objectif) et ce qui est réellement fait ----
# Identiques à 01, sur n_sem semaines ; la phase intensive des bachoteurs est à la fin de la saison.
bruit <- function(n, m, cv = 0.15) pmax(0, round(rnorm(n, m, cv * m)))
reference <- "Régulière (3 h, 5 j/sem)"

generer_profils <- function(n_sem) {
  jours <- tibble(jour = 1:(7 * n_sem), sem = (jour - 1) %/% 7 + 1, js = (jour - 1) %% 7 + 1)
  list(
    "Régulière (3 h, 5 j/sem)" = jours |> mutate(
      prevu = js <= 5, objectif = 180, intense = FALSE,
      minutes = ifelse(prevu & runif(n()) < 0.95, bruit(n(), 180), 0)),
    "Bachoteur sur 2 semaines (10 h 50 par jour)" = jours |> mutate(
      prevu = js <= 5, objectif = 180, intense = sem > n_sem - 2,
      minutes = case_when(sem <= n_sem - 2 & js == 3 ~ bruit(n(), 120),
                          sem >  n_sem - 2           ~ bruit(n(), 647),
                          TRUE                       ~ 0)),
    "Bachoteur sur 4 semaines (5 h 30 par jour)" = jours |> mutate(
      prevu = js <= 5, objectif = 180, intense = sem > n_sem - 4,
      minutes = case_when(sem <= n_sem - 4 & js == 3 ~ bruit(n(), 120),
                          sem >  n_sem - 4           ~ bruit(n(), 332),
                          TRUE                       ~ 0)),
    "Marathonienne (8 h, 6 j/sem)" = jours |> mutate(
      prevu = js <= 6, objectif = 480, intense = FALSE,
      minutes = ifelse(prevu & runif(n()) < 0.95, bruit(n(), 480), 0)),
    "Petits pas (1 h, 6 j/sem)" = jours |> mutate(
      prevu = js <= 6, objectif = 60, intense = FALSE,
      minutes = ifelse(prevu & runif(n()) < 0.95, bruit(n(), 60), 0)),
    "Irrégulier (3 h, un jour sur deux au hasard)" = jours |> mutate(
      prevu = js <= 5, objectif = 180, intense = FALSE,
      minutes = ifelse(runif(n()) < 0.5, bruit(n(), 180), 0)),
    "Week-end seulement (2 × 7 h 30)" = jours |> mutate(
      prevu = js >= 6, objectif = 450, intense = FALSE,
      minutes = ifelse(prevu & runif(n()) < 0.95, bruit(n(), 450), 0))
  )
}

# ---- Application de la formule jour après jour ----
# L'XP du jour est décomposée en quatre parts : minutes seules, bonus sur les minutes
# (méthode + régularité + espacement), engagements (objectif du jour + semaine tenue),
# séance commune. Les braises sont comptées à part.
simuler <- function(d, p) {
  n <- nrow(d)
  R <- p$R_depart
  obj <- pmax(p$objectif_min, d$objectif)                          # plancher de l'objectif
  credit <- ifelse(d$prevu, pmin(1, d$minutes / obj), NA_real_)    # crédit partiel, comme en 01
  espacement <- ifelse(d$minutes > 0,
                       rbinom(n, 1, ifelse(d$intense, p$p_espace_intense, p$p_espace)), 0)
  commune <- rep(FALSE, n)                                          # un jour travaillé par semaine, au hasard
  for (s in unique(d$sem)) {
    j <- which(d$sem == s & d$minutes > 0)
    if (length(j) > 0) commune[j[sample.int(length(j), 1)]] <- TRUE
  }
  minutes_seules <- bonus <- engagements <- seance_commune <- braises <- regul <- numeric(n)
  for (i in seq_len(n)) {
    if (d$prevu[i]) R <- R + p$alpha * (credit[i] - R)              # un jour de repos ne touche pas au score
    base <- xp_minutes(d$minutes[i], p)
    mult <- min(p$mult_max, 1 + p$w_actif * p$part_active + p$w_regul * R + p$w_espace * espacement[i])
    minutes_seules[i] <- base
    bonus[i]          <- base * (mult - 1)
    if (d$prevu[i]) {                                               # bonus de l'objectif du jour
      plein <- p$bonus_jour * min(1, sqrt(obj[i] / p$objectif_plein))
      if (p$bonus_jour_mode == "proportionnel") engagements[i] <- plein * credit[i]
      else if (credit[i] >= 1)                  engagements[i] <- plein   # tout ou rien, comme en 01
      if (credit[i] >= 1) braises[i] <- p$braise_jour
    }
    if (commune[i]) {
      seance_commune[i] <- p$xp_commune
      braises[i] <- braises[i] + p$braise_commune
    }
    if (d$js[i] == 7) {                                             # bilan de semaine
      c_sem <- credit[d$sem == d$sem[i] & d$prevu]
      engagements[i] <- engagements[i] + min(p$plafond_sem, p$xp_jour_tenu * sum(c_sem))
      if (sum(c_sem >= 1) >= p$jours_braise_sem) braises[i] <- braises[i] + p$braise_sem
    }
    regul[i] <- R
  }
  d |> mutate(minutes_seules, bonus, engagements, seance_commune, braises, regul,
              xp = minutes_seules + bonus + engagements + seance_commune)
}

# ---- Tirages répétés (mêmes graines pour les deux durées et pour toutes les variantes) ----
# calculer() enchaîne simulation, totaux par tirage, niveaux par semaine et semaines d'atteinte.
calculer <- function(p, durees) {
  sim <- map_dfr(durees, function(ns) {
    map_dfr(seq_len(n_graines), function(g) {
      set.seed(2026 + g)
      imap_dfr(generer_profils(ns), \(d, profil) simuler(d, p) |>
                 mutate(profil = profil, graine = g, duree = ns))
    })
  }) |> mutate(profil = factor(profil, levels = names(generer_profils(13))))

  # Totaux par tirage
  tot <- sim |>
    group_by(duree, graine, profil) |>
    summarise(heures = sum(minutes) / 60, elan = sum(xp), braises = sum(braises),
              part_minutes = sum(minutes_seules) / elan, part_bonus = sum(bonus) / elan,
              part_engagements = sum(engagements) / elan, part_commune = sum(seance_commune) / elan,
              .groups = "drop") |>
    mutate(niveau_final = niveau(elan, p)) |>
    group_by(duree, graine) |>
    mutate(elan_relatif = elan / elan[profil == reference]) |>
    ungroup()

  # Élan cumulé et niveau à la fin de chaque semaine
  hebdo <- sim |>
    group_by(duree, graine, profil, sem) |>
    summarise(xp_sem = sum(xp), .groups = "drop_last") |>
    mutate(xp_cum = cumsum(xp_sem), niveau = niveau(xp_cum, p)) |>
    ungroup()

  # Semaine d'atteinte de chaque niveau 2 à 10 (NA si non atteint)
  atteinte <- map_dfr(2:p$niveau_max, function(n) {
    hebdo |>
      group_by(duree, graine, profil) |>
      summarise(sem = if (any(xp_cum >= seuil_niveau(n, p))) min(sem[xp_cum >= seuil_niveau(n, p)]) else NA_real_,
                .groups = "drop") |>
      mutate(niv = n)
  })
  atteinte_res <- atteinte |>
    group_by(duree, profil, niv) |>
    summarise(sem_moy = if (all(is.na(sem))) NA_real_ else mean(sem, na.rm = TRUE),
              prop = mean(!is.na(sem)), .groups = "drop")

  list(sim = sim, tot = tot, hebdo = hebdo, atteinte_res = atteinte_res)
}
res <- calculer(p, durees)
sim <- res$sim; tot <- res$tot; hebdo <- res$hebdo; atteinte_res <- res$atteinte_res

# ---- Bilan : une ligne par profil × durée ----
bilan_base <- tot |>
  group_by(duree, profil) |>
  summarise(heures = round(mean(heures)),
            elan_moyen = round(mean(elan)), elan_ecart_type = round(sd(elan)),
            elan = sprintf("%.0f ± %.0f", mean(elan), sd(elan)),
            elan_relatif_moy = round(mean(elan_relatif), 2), elan_relatif_et = round(sd(elan_relatif), 2),
            niveau_final_moy = round(mean(niveau_final), 2),
            braises_moy = round(mean(braises), 1), braises_et = round(sd(braises), 1),
            part_minutes_pct = round(100 * mean(part_minutes), 1),
            part_bonus_pct = round(100 * mean(part_bonus), 1),
            part_engagements_pct = round(100 * mean(part_engagements), 1),
            part_commune_pct = round(100 * mean(part_commune), 1),
            .groups = "drop")
bilan_sem <- atteinte_res |>
  mutate(sem_moy = round(sem_moy, 1), prop = round(prop, 2)) |>
  pivot_wider(names_from = niv, values_from = c(sem_moy, prop), names_glue = "{.value}_n{niv}")
bilan_sem <- bilan_sem[, c("duree", "profil", paste0("sem_moy_n", 2:10), paste0("prop_n", 2:10))]
bilan <- left_join(bilan_base, bilan_sem, by = c("duree", "profil")) |>
  rename(duree_semaines = duree) |>
  arrange(duree_semaines, desc(elan_relatif_moy))

write.csv(bilan, file.path(dossier, "03-formule-xp-saison-bilan.csv"), row.names = FALSE, na = "NA")

# ---- Sorties console ----
cat(sprintf("Saison, %d tirages ; Élan relatif : 1 = profil régulier\n", n_graines))
for (ns in durees) {
  cat(sprintf("\n=== %d semaines ===\n", ns))
  print(as.data.frame(bilan |> filter(duree_semaines == ns) |>
          select(profil, elan, elan_relatif_moy, niveau_final_moy, braises_moy,
                 part_minutes_pct, part_bonus_pct, part_engagements_pct, part_commune_pct)),
        row.names = FALSE)
  cat("\nSemaine moyenne d'atteinte (proportion de tirages qui l'atteignent entre parenthèses) :\n")
  print(as.data.frame(atteinte_res |> filter(duree == ns) |>
          mutate(txt = ifelse(is.na(sem_moy), sprintf("NA (%.0f%%)", 100 * prop),
                              sprintf("%.1f (%.0f%%)", sem_moy, 100 * prop))) |>
          select(profil, niv, txt) |> pivot_wider(names_from = niv, values_from = txt)),
        row.names = FALSE)
}

# ---- Points de contrôle ----
cat("\n--- (1) Semaine d'atteinte du niveau 10 ---\n")
print(as.data.frame(atteinte_res |>
        filter(niv == 10, profil %in% c(reference, "Marathonienne (8 h, 6 j/sem)", "Petits pas (1 h, 6 j/sem)")) |>
        transmute(duree, profil, sem_moy = round(sem_moy, 1), prop = round(prop, 2))), row.names = FALSE)

cat("\n--- (2) Régulière, semaines 4 à 6 : tirages avec une montée de niveau dans la semaine ---\n")
chg <- hebdo |> filter(profil == reference) |>
  group_by(duree, graine) |> mutate(monte = niveau > lag(niveau, default = 1)) |> ungroup() |>
  filter(sem %in% 3:7) |>
  group_by(duree, sem) |>
  summarise(prop_montee = round(mean(monte), 2), niveau_moy = round(mean(niveau), 2),
            niveau_du_xp_moyen = niveau(mean(xp_cum), p), .groups = "drop")
print(as.data.frame(chg), row.names = FALSE)

cat("\n--- (3) Élan marathonienne / régulière (variante B de 01 : 1,60) ---\n")
print(as.data.frame(bilan |> filter(grepl("Marathonienne", profil)) |>
        select(duree_semaines, elan_relatif_moy, elan_relatif_et)), row.names = FALSE)

# ---- Figure : niveau atteint selon la semaine ----
couleurs <- c("#16877b", "#0c3f41", "#be72b4", "#ee4159", "#836f64", "#494558", "#d9a441")
theme_set(theme_minimal(base_size = 12) +
            theme(plot.background = element_rect(fill = "#f8f7e9", colour = NA),
                  panel.grid.minor = element_blank(), legend.position = "bottom",
                  legend.title = element_blank(), plot.title.position = "plot"))

courbe <- hebdo |>
  group_by(duree, profil, sem) |>
  summarise(niveau = mean(niveau), .groups = "drop") |>
  bind_rows(expand_grid(duree = durees, profil = factor(levels(sim$profil), levels = levels(sim$profil)),
                        sem = 0, niveau = 1)) |>
  mutate(duree_lib = factor(paste(duree, "semaines"), levels = paste(durees, "semaines")))

g <- ggplot(courbe, aes(sem, niveau, colour = profil)) +
  annotate("rect", xmin = 3, xmax = 6, ymin = -Inf, ymax = Inf, fill = "grey70", alpha = 0.35) +
  geom_hline(yintercept = p$niveau_max, colour = "#494558", linetype = "dashed") +
  geom_line(linewidth = 0.9) +
  facet_wrap(~duree_lib) +
  scale_colour_manual(values = couleurs) +
  scale_x_continuous(breaks = seq(0, 15, 3)) +
  scale_y_continuous(breaks = 1:10) +
  guides(colour = guide_legend(ncol = 2)) +
  labs(title = "Niveau atteint au fil de la saison",
       subtitle = sprintf("Niveau moyen sur %d tirages, fin de chaque semaine ; zone grisée = semaines 4 à 6, pointillés = niveau 10",
                          n_graines),
       x = "Semaine", y = "Niveau")
ggsave(file.path(dossier, "03-formule-xp-saison-niveaux.png"), g, width = 10, height = 6.4, dpi = 130)

cat("\nBilan et figure écrits dans", dossier, "\n")

# ---- Comparaison des seuils du niveau 10 (bonus du jour proportionnel, 13 semaines) ----
# La courbe reste 250 (n - 1)(n + 2), ramenée au seuil testé au niveau 10.
seuils_test <- c(25000, 27000, 30000)
profils_seuils <- c("Régulière" = reference, "Marathonienne" = "Marathonienne (8 h, 6 j/sem)",
                    "Petits pas" = "Petits pas (1 h, 6 j/sem)",
                    "Irrégulier" = "Irrégulier (3 h, un jour sur deux au hasard)")
comparaison <- map_dfr(seuils_test, function(s) {
  r <- calculer(modifyList(p, list(bonus_jour_mode = "proportionnel", xp_niveau10 = s)), 13)
  n10 <- r$atteinte_res |> filter(niv == 10, profil %in% profils_seuils)
  ligne <- tibble(seuil_niveau10 = s, bonus_jour_mode = "proportionnel", duree_semaines = 13)
  for (k in names(profils_seuils)) {
    z <- n10 |> filter(profil == profils_seuils[[k]])
    ligne[[paste0("sem_n10_", k)]]  <- round(z$sem_moy, 1)
    ligne[[paste0("prop_n10_", k)]] <- round(z$prop, 2)
  }
  niv_reg <- r$hebdo |> filter(profil == reference, sem %in% 4:6) |>
    group_by(sem) |> summarise(niv = round(mean(niveau), 2))
  for (w in 4:6) ligne[[paste0("niveau_reg_fin_sem", w)]] <- niv_reg$niv[niv_reg$sem == w]
  ligne$ratio_marathonienne_reguliere <- round(mean(r$tot$elan_relatif[grepl("Marathonienne", r$tot$profil)]), 2)
  ligne
})
write.csv(comparaison, file.path(dossier, "03-formule-xp-saison-seuils.csv"), row.names = FALSE, na = "NA")
cat("\n--- Comparaison des seuils du niveau 10 (proportionnel, 13 semaines) ---\n")
print(as.data.frame(comparaison), row.names = FALSE)
