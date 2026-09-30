function lire(nom: string, valeur: string | undefined): string {
  if (!valeur) throw new Error(`Variable d'environnement manquante : ${nom}`);
  return valeur;
}

export const config = {
  supabaseUrl: lire('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
  clePubliable: lire('VITE_SUPABASE_PUBLISHABLE_KEY', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY),
  vapidPublique: lire('VITE_VAPID_PUBLIC_KEY', import.meta.env.VITE_VAPID_PUBLIC_KEY),
};
