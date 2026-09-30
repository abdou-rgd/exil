export type EtatAlerte = 'prevue' | 'en_cours' | 'envoyee' | 'annulee' | 'echouee';
export type TypeSerie = 'rapide' | 'serie' | 'longue';
export type FormatSerie = 'classique' | 'declaratif';

export type AlerteLue = {
  id: string;
  serie_id: string;
  prevue_a: string;
  etat: EtatAlerte;
  code_apple: number | null;
  accuse_serveur_a: string | null;
  accuse_appareil_a: string | null;
  decalage_ms: number | null;
  vue_a: string | null;
  series: { type: TypeSerie; situation: string; format: FormatSerie };
};
