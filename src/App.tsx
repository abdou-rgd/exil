import { useCallback, useEffect, useState } from 'react';
import { viderFile } from './accuses';
import { lireAlertes } from './api';
import { envoyerAccuse, envoyerVue } from './api-accuse';
import { Etat } from './composants/Etat';
import { Installation } from './composants/Installation';
import { ListeAlertes } from './composants/ListeAlertes';
import { Resultats } from './composants/Resultats';
import { Tests } from './composants/Tests';
import { estInstallee } from './lib/plateforme';
import type { AlerteLue } from './lib/types';
import { assurerSession } from './supabase';

const RAFRAICHISSEMENT_MS = 15_000;

/** Le toucher sur une notification ouvre l'app avec ?alerte=…&jeton=… : c'est l'accusé « vue ». */
async function noterVueDepuisAdresse(): Promise<void> {
  const params = new URLSearchParams(location.search);
  const alerte = params.get('alerte');
  const jeton = params.get('jeton');
  if (!alerte || !jeton) return;
  history.replaceState(null, '', '/');
  try {
    await envoyerVue(alerte, jeton);
  } catch {
    // la mesure principale n'en dépend pas
  }
}

export function App() {
  const installee = estInstallee() || new URLSearchParams(location.search).has('bureau');
  const [pret, setPret] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [alertes, setAlertes] = useState<AlerteLue[]>([]);

  const recharger = useCallback(async () => {
    try {
      await viderFile(envoyerAccuse);
      setAlertes(await lireAlertes());
    } catch (e) {
      setErreur((e as Error).message);
    }
  }, []);

  useEffect(() => {
    if (!installee) return;
    assurerSession()
      .then(noterVueDepuisAdresse)
      .then(() => {
        setPret(true);
        return recharger();
      })
      .catch((e: Error) => setErreur(e.message));
  }, [installee, recharger]);

  useEffect(() => {
    if (!pret) return;
    const siVisible = () => {
      if (document.visibilityState === 'visible') void recharger();
    };
    const minuteur = setInterval(siVisible, RAFRAICHISSEMENT_MS);
    document.addEventListener('visibilitychange', siVisible);
    return () => {
      clearInterval(minuteur);
      document.removeEventListener('visibilitychange', siVisible);
    };
  }, [pret, recharger]);

  return (
    <main>
      <h1>L'Exil</h1>
      <p className="sous-titre">Prototype de notification</p>
      {!installee && <Installation />}
      {erreur && <p className="erreur">{erreur}</p>}
      {pret && (
        <>
          <Etat />
          <Tests alertes={alertes} auChangement={recharger} />
          <Resultats alertes={alertes} />
          <ListeAlertes alertes={alertes} />
        </>
      )}
    </main>
  );
}
