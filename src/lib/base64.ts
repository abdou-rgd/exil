/** Convertit une clé base64url (format VAPID) en octets pour PushManager.subscribe. */
export function base64UrlVersOctets(texte: string): Uint8Array<ArrayBuffer> {
  const complet = (texte + '='.repeat((4 - (texte.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  const binaire = atob(complet);
  const octets = new Uint8Array(binaire.length);
  for (let i = 0; i < binaire.length; i++) octets[i] = binaire.charCodeAt(i);
  return octets;
}
