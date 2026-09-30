import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const racine = createRoot(document.getElementById('racine')!);

// Import différé : une variable d'environnement manquante s'affiche à l'écran au lieu d'une page blanche.
import('./App')
  .then(({ App }) =>
    racine.render(
      <StrictMode>
        <App />
      </StrictMode>,
    ),
  )
  .catch((erreur: Error) =>
    racine.render(
      <main>
        <h1>L'Exil</h1>
        <p className="erreur">{erreur.message}</p>
      </main>,
    ),
  );
