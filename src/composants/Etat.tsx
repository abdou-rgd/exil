import { useCallback, useEffect, useState } from 'react';
import { mesurerDecalage } from '../horloge-serveur';
import { formaterDate } from '../lib/format';
import { decrireAppareil } from '../lib/plateforme';
import {
  activerNotifications,
  lireEtatAbonnement,
  notificationsDisponibles,
  synchroniserAbonnement,
  type EtatAbonnement,
} from '../notifications';

type Permission = NotificationPermission | 'indisponible';

const LIBELLES: Record<Permission, string> = {
  granted: 'autorisées',
  denied: 'refusées',
  default: 'pas encore demandées',
  indisponible: 'indisponibles ici',
};

function permissionActuelle(): Permission {
  return notificationsDisponibles() ? Notification.permission : 'indisponible';
}

export function Etat() {
  const [permission, setPermission] = useState<Permission>(permissionActuelle);
  const [abonnement, setAbonnement] = useState<EtatAbonnement | null>(null);
  const [decalage, setDecalage] = useState<number | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const rafraichir = useCallback(async () => {
    setErreur(null);
    try {
      const actuelle = permissionActuelle();
      setPermission(actuelle);
      if (actuelle === 'granted') await synchroniserAbonnement();
      setAbonnement(await lireEtatAbonnement());
      setDecalage(await mesurerDecalage());
    } catch (e) {
      setErreur((e as Error).message);
    }
  }, []);

  useEffect(() => {
    void rafraichir();
    const auRetour = () => {
      if (document.visibilityState === 'visible') void rafraichir();
    };
    document.addEventListener('visibilitychange', auRetour);
    return () => document.removeEventListener('visibilitychange', auRetour);
  }, [rafraichir]);

  async function activer() {
    try {
      await activerNotifications();
      await rafraichir();
    } catch (e) {
      setErreur((e as Error).message);
    }
  }

  return (
    <section>
      <h2>État</h2>
      <dl>
        <dt>Notifications</dt>
        <dd>{LIBELLES[permission]}</dd>
        <dt>Abonnement</dt>
        <dd>{abonnement?.abonne ? `enregistré depuis le ${formaterDate(abonnement.cree_a)}` : 'aucun'}</dd>
        <dt>Appareil</dt>
        <dd>{decrireAppareil(navigator.userAgent)}</dd>
        <dt>Décalage d'horloge</dt>
        <dd>{decalage === null ? '…' : `${decalage} ms`}</dd>
      </dl>
      {permission === 'default' && <button onClick={activer}>Activer les notifications</button>}
      {permission === 'denied' && <p>Notifications refusées : Réglages › Notifications › L'Exil.</p>}
      {erreur && <p className="erreur">{erreur}</p>}
    </section>
  );
}
