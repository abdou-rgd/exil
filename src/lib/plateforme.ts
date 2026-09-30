/** Décrit l'appareil à partir de l'agent utilisateur. Depuis iOS 26, la version d'iOS annoncée peut être figée : Abdallah note la vraie dans Réglages. */
export function decrireAppareil(ua: string): string {
  const safari = /Version\/(\d+(?:\.\d+)*)/.exec(ua);
  const ios = /OS (\d+)_(\d+)(?:_\d+)? like Mac OS X/.exec(ua);
  const morceaux: string[] = [];
  if (safari) morceaux.push(`Safari ${safari[1]}`);
  if (ios) morceaux.push(`iOS annoncé ${ios[1]}.${ios[2]}`);
  return morceaux.length > 0 ? morceaux.join(' · ') : 'appareil non Apple';
}

/** Vrai si l'app est ouverte depuis l'écran d'accueil, et non dans un onglet Safari. */
export function estInstallee(): boolean {
  const navigateur = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || navigateur.standalone === true;
}
