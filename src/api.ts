import type { AlerteLue, FormatSerie, TypeSerie } from './lib/types';
import { supabase } from './supabase';

export async function programmer(type: TypeSerie, situation: string, format: FormatSerie): Promise<string> {
  const { data, error } = await supabase.rpc('programmer', { p_type: type, p_situation: situation, p_format: format });
  if (error) throw new Error(error.message);
  return data as string;
}

export async function lireAlertes(): Promise<AlerteLue[]> {
  const { data, error } = await supabase
    .from('alertes')
    .select('id, serie_id, prevue_a, etat, code_apple, accuse_serveur_a, accuse_appareil_a, decalage_ms, vue_a, series(type, situation, format)')
    .order('prevue_a', { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return data as unknown as AlerteLue[];
}

export async function annulerSerie(serieId: string): Promise<{ annulees: number; trop_tard: number }> {
  const { data, error } = await supabase.rpc('annuler_serie', { p_serie: serieId });
  if (error) throw new Error(error.message);
  return (data as { annulees: number; trop_tard: number }[])[0];
}
