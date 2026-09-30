import { useEffect, useState } from 'react';
import { Etat } from './composants/Etat';
import { Installation } from './composants/Installation';
import { estInstallee } from './lib/plateforme';
import { assurerSession } from './supabase';

export function App() {
  // « ?bureau » permet de tester dans Chrome sur l'ordinateur sans installer l'app.
  const installee = estInstallee() || new URLSearchParams(location.search).has('bureau');
  const [pret, setPret] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!installee) return;
    assurerSession()
      .then(() => setPret(true))
      .catch((e: Error) => setErreur(e.message));
  }, [installee]);

  return (
    <main>
      <h1>L'Exil</h1>
      <p className="sous-titre">Prototype de notification</p>
      {!installee && <Installation />}
      {erreur && <p className="erreur">{erreur}</p>}
      {pret && <Etat />}
    </main>
  );
}
