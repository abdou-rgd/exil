# 01-formule-xp.R
# Simulation d'une formule d'XP candidate sur 12 semaines, pour sept profils d'étudiants.
# Question : la formule récompense-t-elle la régularité plutôt que le volume brut ?
# Deux jeux de poids sont comparés : A (le temps d'abord) et B (les engagements d'abord).
# Les profils sont tirés n_graines fois ; les tableaux donnent moyenne et écart-type.
# Lancer depuis la racine du projet : Rscript docs/simulations/01-formule-xp.R

suppressPackageStartupMessages({
  library(dplyr); library(tidyr); library(purrr); library(ggplot2)
})
dossier   <- "docs/simulations"
n_graines <- 200

# ---- Paramètres de la formule : tout ce qui est discutable est ici ----
p_a <- list(
  paliers    = c(0, 120, 300, 480, Inf),  # minutes de concentration cumulées dans la journée
  coef       = c(1.5, 1.0, 0.5, 0.2),     # XP par minute dans chaque palier
  bonus_jour = 100,     # objectif du jour tenu (fixé à l'avance) ; plein tarif à partir de 2 h visées
  objectif_plein = 120, # en dessous, le bonus vaut bonus_jour * sqrt(objectif / objectif_plein)
  bonus_sem  = 300,     # semaine tenue (au prorata des jours prévus tenus)
  regul_max  = 0.25,    # bonus maximal apporté par le score de régularité
  alpha      = 0.07,    # vitesse d'adaptation du score de régularité (mémoire d'environ 3 semaines)
  mult_actif = 1.25     # méthodes actives (QCM, fiche de mémoire) contre 1.0 pour la relecture
)
p_b <- modifyList(p_a, list(coef = c(1.0, 0.6, 0.3, 0.1), bonus_jour = 250, bonus_sem = 600))
variantes <- list("A : le temps d'abord" = p_a, "B : les engagements d'abord" = p_b)

xp_minutes <- function(m, p) {
  # XP tirée des minutes du jour : coefficient décroissant par palier
  sum(pmax(0, pmin(m, p$paliers[-1]) - p$paliers[-length(p$paliers)]) * p$coef)
}

niveau <- function(xp) floor((-75 + sqrt(75^2 + 100 * xp)) / 50)  # XP cumulée(n) = 25 n^2 + 75 n

# ---- Profils : ce qui est prévu (jours, objectif) et ce qui est réellement fait ----
n_sem <- 12
jours <- tibble(jour = 1:(7 * n_sem), sem = (jour - 1) %/% 7 + 1, js = (jour - 1) %% 7 + 1)
bruit <- function(n, m, cv = 0.15) pmax(0, round(rnorm(n, m, cv * m)))
reference <- "Régulière (3 h, 5 j/sem)"

generer_profils <- function() list(
  "Régulière (3 h, 5 j/sem)" = jours |> mutate(
    prevu = js <= 5, objectif = 180,
    minutes = ifelse(prevu & runif(n()) < 0.95, bruit(n(), 180), 0)),
  "Bachoteur sur 2 semaines (10 h 50 par jour)" = jours |> mutate(
    prevu = js <= 5, objectif = 180,
    minutes = case_when(sem <= 10 & js == 3 ~ bruit(n(), 120),
                        sem >= 11           ~ bruit(n(), 647),
                        TRUE                ~ 0)),
  "Bachoteur sur 4 semaines (5 h 30 par jour)" = jours |> mutate(
    prevu = js <= 5, objectif = 180,
    minutes = case_when(sem <= 8 & js == 3 ~ bruit(n(), 120),
                        sem >= 9           ~ bruit(n(), 332),
                        TRUE               ~ 0)),
  "Marathonienne (8 h, 6 j/sem)" = jours |> mutate(
    prevu = js <= 6, objectif = 480,
    minutes = ifelse(prevu & runif(n()) < 0.95, bruit(n(), 480), 0)),
  "Petits pas (1 h, 6 j/sem)" = jours |> mutate(
    prevu = js <= 6, objectif = 60,
    minutes = ifelse(prevu & runif(n()) < 0.95, bruit(n(), 60), 0)),
  "Irrégulier (3 h, un jour sur deux au hasard)" = jours |> mutate(
    prevu = js <= 5, objectif = 180,
    minutes = ifelse(runif(n()) < 0.5, bruit(n(), 180), 0)),
  "Week-end seulement (2 × 7 h 30)" = jours |> mutate(
    prevu = js >= 6, objectif = 450,
    minutes = ifelse(prevu & runif(n()) < 0.95, bruit(n(), 450), 0))
)

# ---- Application de la formule jour après jour ----
# L'XP du jour est décomposée en quatre parts : minutes seules, bonus de méthode,
# bonus de régularité, engagements tenus (objectif du jour et semaine).
simuler <- function(d, p, part_active = 0.5) {
  R <- 0.5                                   # score de régularité de départ, neutre
  mult_methode <- 1 + part_active * (p$mult_actif - 1)
  n <- nrow(d)
  minutes_seules <- methode <- regularite <- engagements <- regul <- numeric(n)
  credit <- ifelse(d$prevu, pmin(1, d$minutes / d$objectif), NA_real_)   # crédit partiel
  for (i in seq_len(n)) {
    if (d$prevu[i]) R <- R + p$alpha * (credit[i] - R)   # un jour de repos ne touche pas au score
    base <- xp_minutes(d$minutes[i], p)
    minutes_seules[i] <- base
    methode[i]        <- base * (mult_methode - 1)
    regularite[i]     <- base * mult_methode * p$regul_max * R
    if (d$prevu[i] && credit[i] >= 1)
      engagements[i] <- p$bonus_jour * min(1, sqrt(d$objectif[i] / p$objectif_plein))
    if (d$js[i] == 7)                                    # bilan de semaine
      engagements[i] <- engagements[i] + p$bonus_sem * mean(credit[d$sem == d$sem[i] & d$prevu])
    regul[i] <- R
  }
  d |> mutate(minutes_seules, methode, regularite, engagements, regul,
              xp = minutes_seules + methode + regularite + engagements,
              xp_cum = cumsum(xp), xp_naif_cum = cumsum(minutes))
}

resumer <- function(res) {
  res |>
    group_by(profil) |>
    summarise(heures = sum(minutes) / 60,
              xp = last(xp_cum),
              part_minutes = sum(minutes_seules) / xp,
              part_methode = sum(methode) / xp,
              part_regularite = sum(regularite) / xp,
              part_engagements = sum(engagements) / xp,
              regularite_moyenne = mean(regul),
              .groups = "drop")
}

# ---- Tirages répétés ----
tirages <- map_dfr(seq_len(n_graines), function(g) {
  set.seed(2026 + g)
  profils <- generer_profils()
  imap_dfr(variantes, function(p, nom) {
    imap_dfr(profils, \(d, profil) simuler(d, p) |> mutate(profil = profil)) |>
      resumer() |>
      mutate(variante = nom, graine = g,
             xp_relatif = xp / xp[profil == reference],
             heures_relatives = heures / heures[profil == reference])
  })
})

moy_et <- function(x, chiffres = 2) sprintf("%.*f ± %.*f", chiffres, mean(x), chiffres, sd(x))
bilan <- tirages |>
  group_by(variante, profil) |>
  summarise(heures = round(mean(heures)),
            temps_seul_relatif = round(mean(heures_relatives), 2),
            xp_relatif_moy = mean(xp_relatif), xp_relatif_et = sd(xp_relatif),
            xp_moyenne = round(mean(xp)), niveau = niveau(mean(xp)),
            part_minutes_pct = round(100 * mean(part_minutes)),
            part_methode_pct = round(100 * mean(part_methode)),
            part_regularite_pct = round(100 * mean(part_regularite)),
            part_engagements_pct = round(100 * mean(part_engagements)),
            regularite_moyenne = round(mean(regularite_moyenne), 2),
            .groups = "drop") |>
  arrange(variante, desc(xp_relatif_moy))

cat(sprintf("XP sur 12 semaines, %d tirages des profils ; xp_relatif : 1 = profil régulier\n\n", n_graines))
print(as.data.frame(bilan |> mutate(across(c(xp_relatif_moy, xp_relatif_et), \(z) round(z, 2)))),
      row.names = FALSE)
write.csv(bilan, file.path(dossier, "01-formule-xp-bilan.csv"), row.names = FALSE)

# Effet de la méthode seule, à profil identique (premier tirage, variante A)
set.seed(2026 + 1)
profils_1 <- generer_profils()
cat("\nEffet de la méthode (profil régulier, variante A) :\n")
for (a in c(0, 0.5, 1)) cat(sprintf("  part de méthodes actives %3.0f %% -> %5.0f XP\n",
                                     100 * a, last(simuler(profils_1[[reference]], p_a, a)$xp_cum)))

# ---- Figures ----
couleurs <- c("#16877b", "#0c3f41", "#be72b4", "#ee4159", "#836f64", "#494558", "#d9a441")
theme_set(theme_minimal(base_size = 12) +
            theme(plot.background = element_rect(fill = "#f8f7e9", colour = NA),
                  panel.grid.minor = element_blank(), legend.position = "bottom",
                  legend.title = element_blank(), plot.title.position = "plot"))

res_1 <- imap_dfr(profils_1, \(d, profil) simuler(d, p_a) |> mutate(profil = profil))
long <- res_1 |>
  select(profil, jour, `XP proportionnelle au temps` = xp_naif_cum, `Formule, variante A` = xp_cum) |>
  pivot_longer(-c(profil, jour), names_to = "formule", values_to = "xp") |>
  mutate(formule = factor(formule, levels = c("XP proportionnelle au temps", "Formule, variante A")))

g1 <- ggplot(long, aes(jour / 7, xp, colour = profil)) +
  geom_line(linewidth = 0.9) +
  facet_wrap(~formule, scales = "free_y") +
  scale_colour_manual(values = couleurs) +
  guides(colour = guide_legend(ncol = 2)) +
  labs(title = "Même trimestre, deux façons de compter",
       subtitle = "XP cumulée sur 12 semaines pour sept profils (un tirage)",
       x = "Semaine", y = "XP cumulée")
ggsave(file.path(dossier, "01-formule-xp-cumul.png"), g1, width = 10, height = 6.6, dpi = 130)

courbe <- tibble(minutes = 0:720) |>
  mutate(xp = map_dbl(minutes, xp_minutes, p = p_a), naif = minutes)
g2 <- ggplot(courbe, aes(minutes / 60)) +
  geom_line(aes(y = naif), linetype = "dashed", colour = "#836f64") +
  geom_line(aes(y = xp), colour = "#16877b", linewidth = 1.1) +
  geom_vline(xintercept = p_a$paliers[2:4] / 60, colour = "#be72b4", alpha = 0.5) +
  labs(title = "Rendements décroissants dans la journée",
       subtitle = "XP tirée du temps de concentration, variante A (trait plein), contre XP proportionnelle (pointillés)",
       x = "Heures de concentration dans la journée", y = "XP du jour (hors bonus)")
ggsave(file.path(dossier, "01-formule-xp-journee.png"), g2, width = 8, height = 5, dpi = 130)

g3 <- ggplot(bilan, aes(xp_relatif_moy, reorder(profil, xp_relatif_moy), fill = variante)) +
  geom_col(position = position_dodge(width = 0.75), width = 0.7) +
  geom_errorbar(aes(xmin = xp_relatif_moy - xp_relatif_et, xmax = xp_relatif_moy + xp_relatif_et),
                position = position_dodge(width = 0.75), width = 0.25, colour = "#2f2a2c",
                orientation = "y") +
  geom_vline(xintercept = 1, colour = "#494558", linetype = "dashed") +
  scale_fill_manual(values = c("#16877b", "#be72b4")) +
  labs(title = "Ce que change le poids donné au temps",
       subtitle = sprintf("XP sur 12 semaines rapportée à celle du profil régulier ; moyenne et écart-type sur %d tirages",
                          n_graines),
       x = "XP relative", y = NULL)
ggsave(file.path(dossier, "01-formule-xp-variantes.png"), g3, width = 9.5, height = 5.4, dpi = 130)

cat("\nFigures et bilan écrits dans", dossier, "\n")
