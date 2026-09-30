# 02-effets-mixtes-faisabilite.R
# Simulation-estimation (type SSE) : que peut-on apprendre sur chaque utilisateur
# avec N utilisateurs et n séances par utilisateur ?
#
# Modèle : y_ij = b0 + eta0_i + (b1 + eta1_i) * x_ij + eps_ij
#   y  : note de la séance (échelle 1 à 5, traitée comme continue)
#   x  : condition binaire (par exemple séance du matin contre séance du soir)
#   b1 : effet typique ; eta1_i : écart individuel (écart-type om1)
#
# Partie 1 : précision des estimations individuelles et valeur d'un conseil personnalisé.
# Partie 2 : biais de confusion quand l'utilisateur choisit lui-même x, et parade par tirage au sort.
# Lancer depuis la racine du projet : Rscript docs/simulations/02-effets-mixtes-faisabilite.R

suppressPackageStartupMessages({
  library(nlme); library(dplyr); library(tidyr); library(ggplot2); library(parallel)
})
dossier <- "docs/simulations"
K <- 200                                   # répliques par scénario
vrai <- list(b0 = 3.4, b1 = 0.15, om0 = 0.5, sig = 0.8)

# ---------------- Partie 1 ----------------
simuler_jeu <- function(N, n, om1, v) {
  id   <- rep(seq_len(N), each = n)
  eta0 <- rnorm(N, 0, v$om0); eta1 <- rnorm(N, 0, om1)
  x    <- rbinom(N * n, 1, 0.5)
  y    <- v$b0 + eta0[id] + (v$b1 + eta1[id]) * x + rnorm(N * n, 0, v$sig)
  list(d = data.frame(id = factor(id), x = x, y = y), effet_vrai = v$b1 + eta1)
}

une_replique <- function(N, n, om1, v, graine) {
  set.seed(graine)     # une graine par réplique : le résultat ne dépend pas du nombre de cœurs
  s <- simuler_jeu(N, n, om1, v)
  f <- tryCatch(
    lme(y ~ x, random = list(id = pdDiag(~ x)), data = s$d, method = "REML",
        control = lmeControl(opt = "optim", msMaxIter = 200, returnObject = TRUE)),
    error = function(e) NULL)
  if (is.null(f)) return(NULL)
  b1      <- fixef(f)[["x"]]
  om1_est <- as.numeric(VarCorr(f)["x", "StdDev"])
  ebe     <- ranef(f)[["x"]]
  est     <- b1 + ebe
  data.frame(
    b1 = b1, om1_est = om1_est,
    shrinkage  = if (om1_est > 1e-4) 1 - sd(ebe) / om1_est else NA_real_,   # dénominateur estimé
    shrinkage_vrai = 1 - sd(ebe) / om1,                                       # dénominateur vrai
    cor_ebe    = suppressWarnings(cor(ebe, s$effet_vrai - v$b1)),
    bon_conseil_ind = mean((est > 0) == (s$effet_vrai > 0)),   # conseil individualisé
    bon_conseil_pop = mean((b1  > 0) == (s$effet_vrai > 0)),   # même conseil pour tous
    gain_oracle = mean(pmax(0, s$effet_vrai)),
    gain_pop    = mean(s$effet_vrai) * (b1 > 0),
    gain_ind    = mean(s$effet_vrai * (est > 0)))
}

grille <- expand.grid(N = c(10, 30, 100), n = c(20, 50, 100, 200), om1 = c(0.15, 0.35))

cl <- makeCluster(max(1, detectCores() - 1))
invisible(clusterEvalQ(cl, suppressPackageStartupMessages(library(nlme))))
clusterExport(cl, c("simuler_jeu", "une_replique", "vrai", "K"))

t0 <- Sys.time()
res <- do.call(rbind, lapply(seq_len(nrow(grille)), function(g) {
  sc <- grille[g, ]
  r  <- parLapply(cl, seq_len(K), function(k, sc, g) une_replique(sc$N, sc$n, sc$om1, vrai, 1000 * g + k),
                  sc = sc, g = g)
  r  <- do.call(rbind, r)
  cat(sprintf("scénario %2d/%d  N=%3d n=%3d om1=%.2f  répliques réussies : %d\n",
              g, nrow(grille), sc$N, sc$n, sc$om1, nrow(r)))
  cbind(sc, r, row.names = NULL)
}))
cat("Durée partie 1 :", round(difftime(Sys.time(), t0, units = "mins"), 1), "min\n")

bilan <- res |>
  group_by(om1, N, n) |>
  summarise(
    repliques          = n(),
    b1_moyen           = mean(b1),
    b1_et_empirique    = sd(b1),
    om1_mediane        = median(om1_est),
    om1_erreur_rel_pct = 100 * sqrt(mean((om1_est - first(om1))^2)) / first(om1),
    om1_sous_005_pct   = 100 * mean(om1_est < 0.05),      # hétérogénéité estimée quasi nulle
    shrinkage_pct      = 100 * mean(shrinkage, na.rm = TRUE),
    shrinkage_vrai_pct = 100 * mean(shrinkage_vrai),
    cor_ebe            = mean(cor_ebe, na.rm = TRUE),
    bon_conseil_ind    = 100 * mean(bon_conseil_ind),
    bon_conseil_pop    = 100 * mean(bon_conseil_pop),
    gain_oracle        = mean(gain_oracle),
    gain_pop           = mean(gain_pop),
    gain_ind           = mean(gain_ind),
    .groups = "drop")
write.csv(bilan, file.path(dossier, "02-effets-mixtes-bilan.csv"), row.names = FALSE)
print(as.data.frame(bilan |> mutate(across(where(is.double), \(z) round(z, 3)))), row.names = FALSE)

theme_set(theme_minimal(base_size = 12) +
            theme(plot.background = element_rect(fill = "#f8f7e9", colour = NA),
                  panel.grid.minor = element_blank(), legend.position = "bottom",
                  plot.title.position = "plot"))
etiq <- as_labeller(c(`0.15` = "Faible hétérogénéité (om1 = 0,15)",
                      `0.35` = "Forte hétérogénéité (om1 = 0,35)"))

g1 <- bilan |>
  select(om1, N, n, `Conseil individualisé` = bon_conseil_ind, `Même conseil pour tous` = bon_conseil_pop) |>
  pivot_longer(-c(om1, N, n), names_to = "strategie", values_to = "pct") |>
  ggplot(aes(n, pct, colour = factor(N), linetype = strategie)) +
  geom_line(linewidth = 0.9) + geom_point() +
  facet_wrap(~om1, labeller = etiq) +
  scale_x_continuous(breaks = c(20, 50, 100, 200)) +
  scale_colour_manual(values = c("#be72b4", "#16877b", "#494558"), name = "Utilisateurs") +
  labs(title = "À qui donne-t-on le bon conseil ?",
       subtitle = "Part des utilisateurs pour qui le conseil va dans le sens de leur effet réel",
       x = "Séances par utilisateur", y = "Conseils corrects (%)", linetype = NULL)
ggsave(file.path(dossier, "02-effets-mixtes-bon-conseil.png"), g1, width = 10, height = 5.8, dpi = 130)

g2 <- bilan |>
  ggplot(aes(n, shrinkage_pct, colour = factor(N))) +
  geom_hline(yintercept = 30, linetype = "dashed", colour = "#836f64") +
  geom_line(linewidth = 0.9) + geom_point() +
  facet_wrap(~om1, labeller = etiq) +
  scale_x_continuous(breaks = c(20, 50, 100, 200)) +
  scale_colour_manual(values = c("#be72b4", "#16877b", "#494558"), name = "Utilisateurs") +
  labs(title = "Shrinkage des effets individuels",
       subtitle = "En pointillés, le repère habituel de 30 % au-delà duquel les estimations individuelles sont peu fiables",
       x = "Séances par utilisateur", y = "Shrinkage de eta1 (%)")
ggsave(file.path(dossier, "02-effets-mixtes-shrinkage.png"), g2, width = 10, height = 5.2, dpi = 130)

# ---------------- Partie 2 : confusion ----------------
# u : forme du jour, non mesurée. Elle pousse à choisir x = 1 ET améliore la note.
# z : suggestion tirée au sort par l'application (pile ou face), qui pousse aussi vers x = 1.
une_replique_conf <- function(k, N = 50, n = 60, b1 = 0.15, delta = 0.4) {
  set.seed(900000 + k)
  id   <- rep(seq_len(N), each = n)
  eta0 <- rnorm(N, 0, 0.5)
  u    <- rnorm(N * n)
  z    <- rbinom(N * n, 1, 0.5)
  x    <- rbinom(N * n, 1, plogis(-0.75 + u + 1.5 * z))
  y    <- 3.4 + eta0[id] + b1 * x + delta * u + rnorm(N * n, 0, 0.8)
  d    <- data.frame(id = factor(id), x, z, y)
  naif <- fixef(lme(y ~ x, random = ~ 1 | id, data = d))[["x"]]
  itt  <- fixef(lme(y ~ z, random = ~ 1 | id, data = d))[["z"]]
  suivi <- mean(d$x[d$z == 1]) - mean(d$x[d$z == 0])
  data.frame(naif = naif, effet_suggestion = itt, suivi = suivi, corrige = itt / suivi)
}
clusterExport(cl, "une_replique_conf")
conf <- do.call(rbind, parLapply(cl, seq_len(K), une_replique_conf))
stopCluster(cl)

cat("\nPartie 2 : effet réel de x = 0,15 ; 50 utilisateurs x 60 séances ; ", K, " répliques\n", sep = "")
eqm <- function(x, vrai) sqrt(mean((x - vrai)^2))       # erreur quadratique moyenne
bilan_conf <- data.frame(
  estimateur = c("Naïf (x choisi librement)", "Effet de la suggestion tirée au sort",
                 "Corrigé (effet suggestion / différence de suivi)"),
  moyenne    = c(mean(conf$naif), mean(conf$effet_suggestion), mean(conf$corrige)),
  ecart_type = c(sd(conf$naif), sd(conf$effet_suggestion), sd(conf$corrige)),
  erreur_quadratique = c(eqm(conf$naif, 0.15), NA, eqm(conf$corrige, 0.15)))
print(bilan_conf |> mutate(across(where(is.double), \(z) round(z, 3))), row.names = FALSE)
cat("Différence de suivi moyenne entre suggestion et absence de suggestion :", round(mean(conf$suivi), 2), "\n")
write.csv(bilan_conf, file.path(dossier, "02-confusion-bilan.csv"), row.names = FALSE)
