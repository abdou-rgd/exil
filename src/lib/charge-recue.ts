export type ContenuAlerte = {
  titre: string;
  corps: string;
  alerteId: string | null;
  jeton: string | null;
  url: string;
};

const REPLI: ContenuAlerte = { titre: "L'Exil", corps: 'Alerte reçue', alerteId: null, jeton: null, url: '/' };

function parametres(url: string): { alerte: string | null; jeton: string | null } {
  try {
    const p = new URL(url, 'https://exil.invalid').searchParams;
    return { alerte: p.get('alerte'), jeton: p.get('jeton') };
  } catch {
    return { alerte: null, jeton: null };
  }
}

/** Lit une charge classique ou déclarative ; renvoie toujours de quoi afficher une notification. */
export function lireCharge(brut: unknown): ContenuAlerte {
  if (typeof brut !== 'object' || brut === null) return REPLI;
  const o = brut as Record<string, unknown>;

  if (o.web_push === 8030 && typeof o.notification === 'object' && o.notification !== null) {
    const n = o.notification as {
      title?: string;
      body?: string;
      navigate?: string;
      data?: { alerte_id?: string; jeton?: string };
    };
    const url = typeof n.navigate === 'string' ? n.navigate : '/';
    const p = parametres(url);
    return {
      titre: n.title ?? REPLI.titre,
      corps: n.body ?? '',
      alerteId: n.data?.alerte_id ?? p.alerte,
      jeton: n.data?.jeton ?? p.jeton,
      url,
    };
  }

  if (typeof o.alerte_id === 'string' && typeof o.jeton === 'string') {
    return {
      titre: typeof o.titre === 'string' ? o.titre : REPLI.titre,
      corps: typeof o.corps === 'string' ? o.corps : '',
      alerteId: o.alerte_id,
      jeton: o.jeton,
      url: typeof o.url === 'string' ? o.url : '/',
    };
  }

  return REPLI;
}
