# Étape 0 : prototype de notification — plan d'implémentation

> **Pour les agents qui exécutent ce plan :** compétence requise : `superpowers:executing-plans` (recommandé ici) ou `superpowers:subagent-driven-development`. Les étapes utilisent des cases à cocher (`- [ ]`).

**Objectif :** une web app installable « L'Exil » qui programme des alertes, les fait envoyer par Supabase au service de notifications d'Apple et mesure leur retard de réception sur l'iPhone.

**Architecture :** une application monopage statique (Vite, React, TypeScript) hébergée sur Vercel. Supabase porte toute la logique : fonctions Postgres pour les écritures, pg_cron toutes les 10 s pour la distribution, une Edge Function pour l'envoi Web Push. Le service worker affiche la notification et renvoie un accusé de réception horodaté.

**Pile :** Vite 8, React 19, TypeScript, vite-plugin-pwa (stratégie `injectManifest`), workbox-precaching, idb-keyval, @supabase/supabase-js, Vitest 5, fake-indexeddb, pg (tests distants), web-push (Edge Function sous Deno et génération des clés), CLI Supabase via `npx`.

**Spécification :** `docs/superpowers/specs/2026-09-30-etape-0-notifications-design.md`. Réponse du conseiller : `docs/conseiller/2026-09-30-architecture-notifications-reponse.md`.

---

## Règles d'exécution

- **Abdallah ne connaît pas JavaScript.** Au début de chaque tâche, lui donner l'explication indiquée en une ou deux phrases, sans jargon non défini.
- Les étapes marquées **[Abdallah]** touchent à ses comptes ou à ses secrets : les lui décrire pas à pas et attendre qu'il confirme. Ne jamais saisir soi-même un mot de passe, une clé secrète ou un jeton, ni afficher le contenu de `.env.local`, `supabase/.env.secrets` ou `supabase/.vault.sql`.
- Tests d'abord : écrire le test, le voir échouer, écrire le code, le voir passer, faire un commit.
- **Fin de chaque phase (0.a, 0.b, 0.c) :** relecture par un agent `code-reviewer` avec le modèle `sonnet`, mise en ligne, test sur l'iPhone d'Abdallah. On ne passe à la phase suivante qu'après son retour. Jamais plus de deux agents à la fois sans prévenir Abdallah.
- `git push` publie le code sur GitHub et déclenche Vercel : demander l'accord d'Abdallah au premier push.
- Commits conventionnels, terminés par la ligne `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Environnement : Windows, Git Bash, Node 24. Docker n'est pas installé : les tests de base tournent sur le projet Supabase distant, dans une transaction annulée à la fin de chaque test ; les Edge Functions se déploient avec `--use-api`.

## Carte des fichiers

| Fichier | Rôle |
|---|---|
| `package.json`, `tsconfig.json`, `tsconfig.sw.json`, `vite.config.ts`, `vitest.distant.config.ts`, `index.html` | Configuration du projet |
| `.env.example` | Modèle des variables locales ; `.env.local` (ignoré par git) contient les vraies valeurs |
| `scripts/icones.mjs` | Dessine les icônes PNG sans dépendance |
| `scripts/preparer-secrets.mjs` | Génère les clés VAPID et le secret partagé dans des fichiers ignorés par git |
| `scripts/sql.mjs` | Exécute une requête ou un fichier SQL sur la base (diagnostic, coffre) |
| `scripts/db-push.mjs` | Applique les migrations au projet Supabase |
| `src/config.ts` | Lit les variables d'environnement publiques |
| `src/supabase.ts` | Client Supabase et connexion anonyme |
| `src/lib/base64.ts` | Conversion de la clé VAPID publique |
| `src/lib/plateforme.ts` | Installation détectée, description de l'appareil |
| `src/lib/horloge.ts` | Estimation du décalage d'horloge (pur) |
| `src/lib/format.ts` | Mise en forme des dates, durées, proportions |
| `src/lib/types.ts` | Types des alertes lues par le client |
| `src/lib/charge-recue.ts` | Lecture d'une charge de notification dans le service worker (pur) |
| `src/lib/stats.ts` | Retards, issues, statistiques par situation, règle en trois zones (pur) |
| `src/accuses.ts` | Décalage mémorisé et file des accusés dans IndexedDB |
| `src/api-accuse.ts` | Appels sans session : accusé et vue (partagé page et service worker) |
| `src/api.ts` | Appels avec session : programmer, annuler, lire les alertes |
| `src/horloge-serveur.ts` | Mesure du décalage avec `heure_serveur()` |
| `src/notifications.ts` | Permission, abonnement push, état de l'abonnement |
| `src/sw.ts` | Service worker : cache, réception des push, accusé, clic |
| `src/App.tsx`, `src/main.tsx`, `src/style.css` | Application |
| `src/composants/Installation.tsx`, `Etat.tsx`, `Tests.tsx`, `ListeAlertes.tsx`, `Resultats.tsx` | Écrans |
| `supabase/migrations/20260930120000_abonnements.sql` | Schéma privé, abonnements, heure serveur |
| `supabase/migrations/20260930130000_alertes.sql` | Séries, alertes, jetons, distribution, accusés, pg_cron |
| `supabase/functions/envoyer/index.ts` | Edge Function d'envoi (Deno) |
| `supabase/functions/envoyer/outils.ts` | Construction des charges, comparaison en temps constant (pur) |
| `tests/distant/*.ts` | Tests de la base et test d'attaque, sur le projet distant |
| `docs/campagne-notifications.md` | Protocole de la campagne de mesure |

---

# Phase 0.a — l'app en ligne et abonnée

## Tâche 1 : squelette du projet

*Explication pour Abdallah : on crée la structure d'une app web vide qui s'installe sur l'écran d'accueil. Vite assemble le code, React dessine l'écran, TypeScript vérifie le code avant qu'il tourne.*

**Fichiers :** créer `package.json`, `tsconfig.json`, `tsconfig.sw.json`, `vite.config.ts`, `vitest.distant.config.ts`, `index.html`, `.env.example`, `scripts/icones.mjs`, `src/main.tsx`, `src/App.tsx`, `src/style.css`, `src/sw.ts` ; modifier `.gitignore`.

- [ ] **Étape 1 : écrire `package.json`**

```json
{
  "name": "exil",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -p tsconfig.json && tsc -p tsconfig.sw.json && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:distant": "vitest run --config vitest.distant.config.ts",
    "icones": "node scripts/icones.mjs",
    "secrets": "node scripts/preparer-secrets.mjs",
    "sql": "node scripts/sql.mjs",
    "db:push": "node scripts/db-push.mjs"
  }
}
```

- [ ] **Étape 2 : installer les dépendances**

```bash
npm install react react-dom @supabase/supabase-js idb-keyval workbox-precaching
npm install -D typescript vite @vitejs/plugin-react vite-plugin-pwa vitest fake-indexeddb pg @types/pg @types/react @types/react-dom @types/node supabase web-push
```

Attendu : aucune erreur `ERESOLVE`. En cas de conflit de dépendances, lire `npm view vite-plugin-pwa peerDependencies` et aligner la version de `vite`.

- [ ] **Étape 3 : écrire `tsconfig.json`** (tout sauf le service worker)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "allowImportingTsExtensions": true,
    "types": ["vite/client", "node"]
  },
  "include": [
    "src",
    "tests",
    "supabase/functions/envoyer/outils.ts",
    "supabase/functions/envoyer/outils.test.ts",
    "vite.config.ts",
    "vitest.distant.config.ts"
  ],
  "exclude": ["src/sw.ts"]
}
```

- [ ] **Étape 4 : écrire `tsconfig.sw.json`** (le service worker a ses propres types, incompatibles avec ceux de la page)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "WebWorker"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": ["vite/client"]
  },
  "include": ["src/sw.ts"]
}
```

- [ ] **Étape 5 : écrire `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectRegister: 'script',
      manifest: {
        name: "L'Exil",
        short_name: "L'Exil",
        lang: 'fr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#1d1a2b',
        theme_color: '#1d1a2b',
        icons: [
          { src: 'icone-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icone-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      injectManifest: { globPatterns: ['**/*.{js,css,html,png}'] },
    }),
  ],
  test: {
    include: ['src/**/*.test.ts', 'supabase/functions/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Étape 6 : écrire `vitest.distant.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/distant/**/*.test.ts'],
    environment: 'node',
    testTimeout: 30_000,
    fileParallelism: false,
    setupFiles: ['tests/distant/env.ts'],
  },
});
```

- [ ] **Étape 7 : écrire `index.html`**

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#1d1a2b" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="L'Exil" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <title>L'Exil</title>
  </head>
  <body>
    <div id="racine"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Étape 8 : écrire `.env.example` et compléter `.gitignore`**

`.env.example` :

```
# Copier en .env.local et remplir. .env.local n'est jamais envoyé sur GitHub.
VITE_SUPABASE_URL=https://REFERENCE.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_VAPID_PUBLIC_KEY=ajoutée par « npm run secrets »
# Tests distants et scripts seulement, jamais dans Vercel.
# Chaîne « Session pooler » du tableau de bord ; mot de passe encodé pour une URL.
DATABASE_URL=postgresql://postgres.REFERENCE:MOT_DE_PASSE@aws-0-eu-west-3.pooler.supabase.com:5432/postgres
```

Ajouter à la fin de `.gitignore` :

```
supabase/.vault.sql
```

- [ ] **Étape 9 : écrire `scripts/icones.mjs`** (dessine une lune rouge sur fond nuit, sans dépendance)

```js
import { deflateSync } from 'node:zlib';
import { mkdirSync, writeFileSync } from 'node:fs';

const TABLE_CRC = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(octets) {
  let c = 0xffffffff;
  for (const o of octets) c = TABLE_CRC[(c ^ o) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function bloc(type, donnees) {
  const longueur = Buffer.alloc(4);
  longueur.writeUInt32BE(donnees.length);
  const corps = Buffer.concat([Buffer.from(type, 'ascii'), donnees]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(corps));
  return Buffer.concat([longueur, corps, crc]);
}

function png(taille) {
  const centre = taille / 2;
  const rayon = taille * 0.28;
  const lignes = [];
  for (let y = 0; y < taille; y++) {
    const ligne = Buffer.alloc(1 + taille * 3);
    for (let x = 0; x < taille; x++) {
      const dansLaLune = (x - centre) ** 2 + (y - centre * 0.9) ** 2 < rayon ** 2;
      ligne.set(dansLaLune ? [200, 85, 61] : [29, 26, 43], 1 + x * 3);
    }
    lignes.push(ligne);
  }
  const entete = Buffer.alloc(13);
  entete.writeUInt32BE(taille, 0);
  entete.writeUInt32BE(taille, 4);
  entete[8] = 8;
  entete[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    bloc('IHDR', entete),
    bloc('IDAT', deflateSync(Buffer.concat(lignes))),
    bloc('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync('public', { recursive: true });
for (const [nom, taille] of [['icone-192.png', 192], ['icone-512.png', 512], ['apple-touch-icon.png', 180]]) {
  writeFileSync(`public/${nom}`, png(taille));
}
console.log('Icônes écrites dans public/.');
```

Lancer : `npm run icones`. Attendu : `Icônes écrites dans public/.` et trois fichiers PNG.

- [ ] **Étape 10 : écrire `src/style.css`**

```css
:root {
  color-scheme: dark;
  --fond: #1d1a2b;
  --carte: #2a2640;
  --texte: #efe6d8;
  --doux: #b3a99a;
  --accent: #c8553d;
  --trait: #3a3552;
  font-family: system-ui, -apple-system, sans-serif;
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--fond); color: var(--texte); }
main {
  max-width: 40rem;
  margin: 0 auto;
  padding: max(1rem, env(safe-area-inset-top)) 1rem max(2rem, env(safe-area-inset-bottom));
}
h1 { margin: 0.5rem 0 0; }
h2 { font-size: 1.1rem; margin: 0 0 0.75rem; }
h3 { font-size: 1rem; margin: 1rem 0 0.5rem; }
.sous-titre { color: var(--doux); margin-top: 0.25rem; }
section { background: var(--carte); border-radius: 12px; padding: 1rem; margin: 1rem 0; }
dl { display: grid; grid-template-columns: auto 1fr; gap: 0.4rem 1rem; margin: 0; }
dt { color: var(--doux); }
dd { margin: 0; }
button, select, input {
  font: inherit;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #4a4466;
  background: #36314f;
  color: var(--texte);
  margin: 0.25rem 0.5rem 0.25rem 0;
}
button { background: var(--accent); border: none; font-weight: 600; }
button:disabled { opacity: 0.5; }
label { display: block; margin: 0.25rem 0; }
.erreur { color: #ff9b85; }
.zone { font-weight: 600; }
.table-defilante { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
th, td { text-align: left; padding: 0.3rem; border-bottom: 1px solid var(--trait); }
.liste { list-style: none; padding: 0; margin: 0; font-size: 0.9rem; }
.liste li { padding: 0.4rem 0; border-bottom: 1px solid var(--trait); }
ol li { margin: 0.4rem 0; }
```

- [ ] **Étape 11 : écrire `src/main.tsx`, un `src/App.tsx` provisoire et un `src/sw.ts` minimal**

`src/main.tsx` :

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './style.css';

createRoot(document.getElementById('racine')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`src/App.tsx` (remplacé à la tâche 6) :

```tsx
export function App() {
  return (
    <main>
      <h1>L'Exil</h1>
      <p className="sous-titre">Prototype de notification</p>
    </main>
  );
}
```

`src/sw.ts` (remplacé à la tâche 13) :

```ts
/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', () => {
  void self.skipWaiting();
});
self.addEventListener('activate', (evenement) => {
  evenement.waitUntil(self.clients.claim());
});

// Toute push doit afficher une notification, sinon iOS retire la permission.
self.addEventListener('push', (evenement) => {
  evenement.waitUntil(self.registration.showNotification("L'Exil", { body: 'Notification de test' }));
});
```

- [ ] **Étape 12 : vérifier la construction**

Lancer : `npm run build`
Attendu : fin sans erreur, et `dist/` contient `index.html`, `sw.js`, `manifest.webmanifest` et les icônes.

- [ ] **Étape 13 : commit**

```bash
git add package.json package-lock.json tsconfig.json tsconfig.sw.json vite.config.ts vitest.distant.config.ts index.html .env.example .gitignore scripts/icones.mjs public src
git commit -m "chore: squelette de l'app installable L'Exil"
```

## Tâche 2 : utilitaires purs (base64, appareil, horloge)

*Explication pour Abdallah : trois petites fonctions sans effet de bord, testées seules. Elles convertissent la clé de notification, décrivent le téléphone et estiment l'écart entre l'horloge du téléphone et celle du serveur, en gardant la mesure la plus rapide, comme on garde la mesure la moins bruitée.*

**Fichiers :** créer `src/lib/base64.ts`, `src/lib/base64.test.ts`, `src/lib/plateforme.ts`, `src/lib/plateforme.test.ts`, `src/lib/horloge.ts`, `src/lib/horloge.test.ts`.

- [ ] **Étape 1 : écrire les tests qui échouent**

`src/lib/base64.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { base64UrlVersOctets } from './base64';

describe('base64UrlVersOctets', () => {
  it('décode du base64url sans remplissage', () => {
    expect(Array.from(base64UrlVersOctets('AQID_-8'))).toEqual([1, 2, 3, 255, 239]);
  });
});
```

`src/lib/plateforme.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { decrireAppareil } from './plateforme';

describe('decrireAppareil', () => {
  it('lit Safari et la version annoncée d’iOS', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1';
    expect(decrireAppareil(ua)).toBe('Safari 26.0 · iOS annoncé 18.6');
  });
  it('se contente de la version d’iOS en mode installé', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
    expect(decrireAppareil(ua)).toBe('iOS annoncé 17.4');
  });
  it('signale un appareil qui n’est pas d’Apple', () => {
    expect(decrireAppareil('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/140.0')).toBe('appareil non Apple');
  });
});
```

`src/lib/horloge.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { estimerDecalage } from './horloge';

describe('estimerDecalage', () => {
  it('garde l’échantillon au plus court aller-retour', () => {
    const decalage = estimerDecalage([
      { envoiMs: 1000, receptionMs: 1400, serveurMs: 5300 },
      { envoiMs: 2000, receptionMs: 2100, serveurMs: 6100 },
    ]);
    expect(decalage).toBe(4050);
  });
  it('refuse une liste vide', () => {
    expect(() => estimerDecalage([])).toThrow('aucun échantillon');
  });
});
```

- [ ] **Étape 2 : vérifier qu'ils échouent**

Lancer : `npm test`
Attendu : ÉCHEC, modules `./base64`, `./plateforme` et `./horloge` introuvables.

- [ ] **Étape 3 : écrire le code**

`src/lib/base64.ts` :

```ts
/** Convertit une clé base64url (format VAPID) en octets pour PushManager.subscribe. */
export function base64UrlVersOctets(texte: string): Uint8Array<ArrayBuffer> {
  const complet = (texte + '='.repeat((4 - (texte.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  const binaire = atob(complet);
  const octets = new Uint8Array(binaire.length);
  for (let i = 0; i < binaire.length; i++) octets[i] = binaire.charCodeAt(i);
  return octets;
}
```

`src/lib/plateforme.ts` :

```ts
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
```

`src/lib/horloge.ts` :

```ts
export type Echantillon = { envoiMs: number; receptionMs: number; serveurMs: number };

/** Décalage à ajouter à l'heure du téléphone pour obtenir celle du serveur, estimé sur l'aller-retour le plus court. */
export function estimerDecalage(echantillons: Echantillon[]): number {
  if (echantillons.length === 0) throw new Error('aucun échantillon');
  const meilleur = echantillons.reduce((a, b) =>
    b.receptionMs - b.envoiMs < a.receptionMs - a.envoiMs ? b : a,
  );
  const milieu = (meilleur.envoiMs + meilleur.receptionMs) / 2;
  return Math.round(meilleur.serveurMs - milieu);
}
```

- [ ] **Étape 4 : vérifier qu'ils passent**

Lancer : `npm test`
Attendu : 6 tests réussis.

- [ ] **Étape 5 : commit**

```bash
git add src/lib
git commit -m "feat: utilitaires de clé, d'appareil et d'horloge"
```

## Tâche 3 : projet Supabase

*Explication pour Abdallah : on crée la base de données en ligne. Tu crées le projet toi-même parce qu'il est lié à ton compte, et tu gardes le mot de passe de la base dans ton gestionnaire de mots de passe.*

**Fichiers :** `supabase/config.toml` (créé par la CLI), `.env.local` (créé par Abdallah, ignoré par git).

- [ ] **Étape 1 [Abdallah] : créer le projet** sur supabase.com › New project : nom `exil`, région **West EU (Paris)**, mot de passe de base généré et rangé dans ton gestionnaire.
- [ ] **Étape 2 [Abdallah] : activer la connexion anonyme** : Authentication › Sign In / Providers › « Allow anonymous sign-ins » › Save.
- [ ] **Étape 3 [Abdallah] : remplir `.env.local`** à partir de `.env.example` :
  - `VITE_SUPABASE_URL` : Project Settings › API › Project URL ;
  - `VITE_SUPABASE_PUBLISHABLE_KEY` : Project Settings › API Keys › clé `sb_publishable_…` ;
  - `DATABASE_URL` : bouton « Connect » › Session pooler, en remplaçant `[YOUR-PASSWORD]` par le mot de passe. S'il contient des caractères spéciaux, les encoder (par exemple `@` devient `%40`).
  - Laisser `VITE_VAPID_PUBLIC_KEY` tel quel : la tâche 5 la remplit.
- [ ] **Étape 4 : initialiser la configuration locale de Supabase**

Lancer : `npx supabase init`
Attendu : `supabase/config.toml` créé. Répondre non aux questions sur les réglages d'éditeur.

- [ ] **Étape 5 [Abdallah] : relier le dossier au projet**, dans le terminal du projet :

```bash
npx supabase login
```

```bash
npx supabase link --project-ref REFERENCE
```

`REFERENCE` est la partie entre `https://` et `.supabase.co` de l'URL du projet. La commande demande le mot de passe de la base.

- [ ] **Étape 6 : vérifier**

Lancer : `cat supabase/.temp/project-ref && grep -c '^VITE_SUPABASE_URL=https' .env.local`
Attendu : la référence du projet, puis `1`.

- [ ] **Étape 7 : écrire `scripts/db-push.mjs` et `scripts/sql.mjs`**

`scripts/db-push.mjs` (passe le mot de passe par une variable d'environnement, jamais sur la ligne de commande) :

```js
import { spawnSync } from 'node:child_process';

process.loadEnvFile('.env.local');
const motDePasse = decodeURIComponent(new URL(process.env.DATABASE_URL).password);
const resultat = spawnSync('npx', ['supabase', 'db', 'push', '--linked', '--yes'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env, SUPABASE_DB_PASSWORD: motDePasse },
});
process.exit(resultat.status ?? 1);
```

`scripts/sql.mjs` :

```js
import { readFileSync } from 'node:fs';
import pg from 'pg';

process.loadEnvFile('.env.local');
const args = process.argv.slice(2);
const requete = args[0] === '-f' ? readFileSync(args[1], 'utf8') : args.join(' ');
if (!requete) {
  console.error('Usage : npm run sql -- "select ..."  ou  npm run sql -- -f fichier.sql');
  process.exit(1);
}
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const resultat = await client.query(requete);
  const dernier = Array.isArray(resultat) ? resultat.at(-1) : resultat;
  console.table(dernier.rows);
} finally {
  await client.end();
}
```

Lancer : `npm run sql -- "select now()"`
Attendu : un tableau avec l'heure du serveur.

- [ ] **Étape 8 : commit**

```bash
git add supabase/config.toml supabase/.gitignore scripts/db-push.mjs scripts/sql.mjs
git commit -m "chore: liaison au projet Supabase et scripts de base"
```

## Tâche 4 : migration des abonnements

*Explication pour Abdallah : on crée la table des abonnements aux notifications dans un compartiment privé de la base, que ton téléphone ne peut pas lire. Il ne peut qu'appeler deux fonctions : « enregistre mon abonnement » et « suis-je abonné ? ».*

**Fichiers :** créer `tests/distant/env.ts`, `tests/distant/base.ts`, `tests/distant/abonnements.test.ts`, `supabase/migrations/20260930120000_abonnements.sql`.

- [ ] **Étape 1 : écrire les outils de test distants**

`tests/distant/env.ts` :

```ts
process.loadEnvFile('.env.local');
```

`tests/distant/base.ts` :

```ts
import { randomUUID } from 'node:crypto';
import pg from 'pg';

/** Exécute un test dans une transaction toujours annulée : la base distante reste propre. */
export async function avecTransaction<T>(travail: (c: pg.Client) => Promise<T>): Promise<T> {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query('begin');
    return await travail(client);
  } finally {
    await client.query('rollback').catch(() => undefined);
    await client.end();
  }
}

export async function creerUtilisateur(c: pg.Client): Promise<string> {
  const { rows } = await c.query(
    `insert into auth.users (id, instance_id, aud, role, is_anonymous, created_at, updated_at)
     values (gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', true, now(), now())
     returning id`,
  );
  return rows[0].id;
}

/** Joue le rôle d'un client : un compte (uid) ou un appel sans session (null). */
export async function agirEnTantQue(c: pg.Client, uid: string | null): Promise<void> {
  const claims = uid ? { sub: uid, role: 'authenticated' } : { role: 'anon' };
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify(claims)]);
  await c.query(uid ? 'set local role authenticated' : 'set local role anon');
}

export async function redevenirAdmin(c: pg.Client): Promise<void> {
  await c.query('reset role');
}

export async function creerAbonnement(c: pg.Client, uid: string): Promise<void> {
  await c.query(
    `insert into prive.abonnements (user_id, endpoint, p256dh, auth)
     values ($1, 'https://web.push.apple.com/test', 'p', 'a')`,
    [uid],
  );
}

export function nouveauJeton(): string {
  return randomUUID().replaceAll('-', '');
}
```

- [ ] **Étape 2 : écrire les tests qui échouent**

`tests/distant/abonnements.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { agirEnTantQue, avecTransaction, creerUtilisateur, redevenirAdmin } from './base';

const ENDPOINT = 'https://web.push.apple.com/QGx-test';

describe('abonnements', () => {
  it('enregistre puis remplace l’abonnement du compte', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      await agirEnTantQue(c, uid);
      await c.query(`select public.enregistrer_abonnement($1, 'p1', 'a1', 'ua')`, [ENDPOINT]);
      await c.query(`select public.enregistrer_abonnement($1, 'p2', 'a2', 'ua')`, [`${ENDPOINT}2`]);
      const { rows } = await c.query('select * from public.etat_abonnement()');
      expect(rows).toEqual([expect.objectContaining({ abonne: true })]);
      await redevenirAdmin(c);
      const { rows: abonnements } = await c.query('select endpoint from prive.abonnements where user_id = $1', [uid]);
      expect(abonnements).toEqual([{ endpoint: `${ENDPOINT}2` }]);
    }));

  it('indique « non abonné » pour un compte sans abonnement', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      await agirEnTantQue(c, uid);
      const { rows } = await c.query('select * from public.etat_abonnement()');
      expect(rows).toEqual([{ abonne: false, cree_a: null, vu_a: null }]);
    }));

  it('refuse une adresse qui n’est pas un service de notification', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      await agirEnTantQue(c, uid);
      await expect(
        c.query(`select public.enregistrer_abonnement('https://attaquant.example.com/x', 'p', 'a', 'ua')`),
      ).rejects.toThrow(/refusée/);
    }));

  it('interdit au client de lire la table des abonnements', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      await agirEnTantQue(c, uid);
      await expect(c.query('select * from prive.abonnements')).rejects.toThrow(/permission denied/);
    }));

  it('interdit l’abonnement sans session', () =>
    avecTransaction(async (c) => {
      await agirEnTantQue(c, null);
      await expect(
        c.query(`select public.enregistrer_abonnement($1, 'p', 'a', 'ua')`, [ENDPOINT]),
      ).rejects.toThrow(/permission denied/);
    }));

  it('donne l’heure du serveur à un compte', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      await agirEnTantQue(c, uid);
      const { rows } = await c.query('select public.heure_serveur() as h');
      expect(rows[0].h).toBeInstanceOf(Date);
    }));
});
```

- [ ] **Étape 3 : vérifier qu'ils échouent**

Lancer : `npm run test:distant`
Attendu : ÉCHEC, `function public.enregistrer_abonnement(...) does not exist`.

- [ ] **Étape 4 : écrire la migration**

`supabase/migrations/20260930120000_abonnements.sql` :

```sql
-- Étape 0.a : schéma privé, abonnements aux notifications, heure du serveur.

create schema if not exists prive;
revoke all on schema prive from public;
grant usage on schema prive to anon, authenticated;

create table prive.abonnements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  plateforme text not null default 'webpush' check (plateforme in ('webpush', 'apns')),
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  user_agent text,
  cree_a timestamptz not null default now(),
  vu_a timestamptz not null default now()
);
alter table prive.abonnements enable row level security;
revoke all on prive.abonnements from public, anon, authenticated;

create function prive.enregistrer_abonnement(p_endpoint text, p_p256dh text, p_auth text, p_user_agent text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'non authentifié';
  end if;
  if char_length(p_endpoint) > 1000
     or p_endpoint !~ '^https://([a-z0-9-]+\.)*(push\.apple\.com|fcm\.googleapis\.com|push\.services\.mozilla\.com)/' then
    raise exception 'adresse d''abonnement refusée';
  end if;
  if char_length(p_p256dh) > 200 or char_length(p_auth) > 100 then
    raise exception 'clés d''abonnement invalides';
  end if;
  insert into prive.abonnements as a (user_id, endpoint, p256dh, auth, user_agent)
  values (v_uid, p_endpoint, p_p256dh, p_auth, left(p_user_agent, 300))
  on conflict (user_id) do update set
    cree_a = case when a.endpoint = excluded.endpoint then a.cree_a else now() end,
    endpoint = excluded.endpoint,
    p256dh = excluded.p256dh,
    auth = excluded.auth,
    user_agent = excluded.user_agent,
    vu_a = now();
end;
$$;

create function prive.etat_abonnement()
returns table (abonne boolean, cree_a timestamptz, vu_a timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select b.id is not null, b.cree_a, b.vu_a
  from (select auth.uid() as uid) moi
  left join prive.abonnements b on b.user_id = moi.uid;
$$;

create function public.enregistrer_abonnement(p_endpoint text, p_p256dh text, p_auth text, p_user_agent text)
returns void
language sql
security invoker
set search_path = ''
as $$
  select prive.enregistrer_abonnement(p_endpoint, p_p256dh, p_auth, p_user_agent);
$$;

create function public.etat_abonnement()
returns table (abonne boolean, cree_a timestamptz, vu_a timestamptz)
language sql
stable
security invoker
set search_path = ''
as $$
  select * from prive.etat_abonnement();
$$;

create function public.heure_serveur()
returns timestamptz
language sql
volatile
security invoker
set search_path = ''
as $$
  select clock_timestamp();
$$;

revoke execute on all functions in schema prive from public, anon, authenticated;
revoke execute on function
  public.enregistrer_abonnement(text, text, text, text),
  public.etat_abonnement(),
  public.heure_serveur()
from public, anon;
grant execute on function prive.enregistrer_abonnement(text, text, text, text), prive.etat_abonnement() to authenticated;
grant execute on function
  public.enregistrer_abonnement(text, text, text, text),
  public.etat_abonnement(),
  public.heure_serveur()
to authenticated;
```

- [ ] **Étape 5 : appliquer la migration**

Lancer : `npm run db:push`
Attendu : `Applying migration 20260930120000_abonnements.sql...` puis `Finished supabase db push.` Si l'option `--yes` est refusée par la CLI, la retirer de `scripts/db-push.mjs` et répondre `Y`.

- [ ] **Étape 6 : vérifier que les tests passent**

Lancer : `npm run test:distant`
Attendu : 6 tests réussis.

- [ ] **Étape 7 : commit**

```bash
git add tests/distant supabase/migrations/20260930120000_abonnements.sql
git commit -m "feat: abonnements aux notifications dans un schéma privé"
```

## Tâche 5 : clés VAPID et secret partagé

*Explication pour Abdallah : les clés VAPID sont une paire de clés. La publique va dans l'app, la privée reste sur le serveur et prouve à Apple que l'envoi vient bien de nous. Le script les écrit dans des fichiers qui ne partent jamais sur GitHub, et c'est toi qui le lances.*

**Fichiers :** créer `scripts/preparer-secrets.mjs`.

- [ ] **Étape 1 : écrire le script**

`scripts/preparer-secrets.mjs` :

```js
import { randomBytes } from 'node:crypto';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import webpush from 'web-push';

const SECRETS = 'supabase/.env.secrets';
const COFFRE = 'supabase/.vault.sql';
const courriel = process.argv[2];

if (!courriel) {
  console.error('Usage : npm run secrets -- ton-courriel@exemple.fr');
  process.exit(1);
}
if (existsSync(SECRETS)) {
  console.error(`${SECRETS} existe déjà. Supprime-le d'abord si tu veux de nouvelles clés.`);
  process.exit(1);
}
if (!existsSync('supabase/.temp/project-ref')) {
  console.error('Projet Supabase non relié : lance d’abord « npx supabase link ».');
  process.exit(1);
}

const reference = readFileSync('supabase/.temp/project-ref', 'utf8').trim();
const vapid = webpush.generateVAPIDKeys();
const secret = randomBytes(32).toString('hex');

writeFileSync(
  SECRETS,
  [`VAPID_PUBLIQUE=${vapid.publicKey}`, `VAPID_PRIVEE=${vapid.privateKey}`, `VAPID_SUJET=mailto:${courriel}`, `ENVOI_SECRET=${secret}`, ''].join('\n'),
);
writeFileSync(
  COFFRE,
  [
    `select vault.create_secret('${secret}', 'envoi_secret') where not exists (select 1 from vault.secrets where name = 'envoi_secret');`,
    `select vault.create_secret('https://${reference}.supabase.co/functions/v1/envoyer', 'envoi_url') where not exists (select 1 from vault.secrets where name = 'envoi_url');`,
    '',
  ].join('\n'),
);

const envLocal = readFileSync('.env.local', 'utf8').replace(/^VITE_VAPID_PUBLIC_KEY=.*\n?/m, '');
writeFileSync('.env.local', envLocal.endsWith('\n') ? envLocal : `${envLocal}\n`);
appendFileSync('.env.local', `VITE_VAPID_PUBLIC_KEY=${vapid.publicKey}\n`);

console.log(`Écrits : ${SECRETS}, ${COFFRE} et la clé publique dans .env.local (tous ignorés par git).`);
console.log(`Clé publique, à copier dans Vercel sous VITE_VAPID_PUBLIC_KEY :\n${vapid.publicKey}`);
```

- [ ] **Étape 2 : vérifier que les fichiers de secrets sont ignorés**

Lancer : `git check-ignore supabase/.env.secrets supabase/.vault.sql .env.local`
Attendu : les trois chemins sont affichés.

- [ ] **Étape 3 [Abdallah] : générer les clés**

```bash
npm run secrets -- ton-courriel@exemple.fr
```

Attendu : le message « Écrits : … » et la clé publique. Garder la clé publique pour Vercel (tâche 8).

- [ ] **Étape 4 : vérifier sans afficher les secrets**

Lancer : `grep -c '^VITE_VAPID_PUBLIC_KEY=.\{80,\}' .env.local && grep -c '=' supabase/.env.secrets`
Attendu : `1` puis `4`.

- [ ] **Étape 5 : commit**

```bash
git add scripts/preparer-secrets.mjs
git commit -m "chore: génération des clés VAPID et du secret partagé"
```

## Tâche 6 : session anonyme, abonnement et écran d'état

*Explication pour Abdallah : au premier lancement, l'app crée ton compte invisible, demande la permission quand tu touches le bouton, enregistre l'abonnement sur le serveur et mesure l'écart d'horloge. L'écran d'état te montre le résultat.*

**Fichiers :** créer `src/config.ts`, `src/supabase.ts`, `src/accuses.ts`, `src/accuses.test.ts`, `src/horloge-serveur.ts`, `src/notifications.ts`, `src/lib/format.ts`, `src/lib/format.test.ts`, `src/composants/Installation.tsx`, `src/composants/Etat.tsx` ; remplacer `src/App.tsx`.

- [ ] **Étape 1 : écrire les tests qui échouent**

`src/accuses.test.ts` :

```ts
import 'fake-indexeddb/auto';
import { clear } from 'idb-keyval';
import { beforeEach, describe, expect, it } from 'vitest';
import { ecrireDecalage, lireDecalage } from './accuses';

describe('décalage mémorisé', () => {
  beforeEach(() => clear());

  it('renvoie null tant que rien n’est mesuré', async () => {
    expect(await lireDecalage()).toBeNull();
  });

  it('relit le dernier décalage écrit', async () => {
    await ecrireDecalage(-1234);
    expect(await lireDecalage()).toBe(-1234);
  });
});
```

`src/lib/format.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { formaterPart, formaterSecondes } from './format';

describe('mise en forme', () => {
  it('écrit des secondes avec une décimale', () => {
    expect(formaterSecondes(4.26)).toBe('4.3 s');
    expect(formaterSecondes(null)).toBe('—');
  });
  it('écrit une proportion en pourcentage', () => {
    expect(formaterPart(0.957)).toBe('96 %');
    expect(formaterPart(null)).toBe('—');
  });
});
```

- [ ] **Étape 2 : vérifier qu'ils échouent**

Lancer : `npm test`
Attendu : ÉCHEC, modules `./accuses` et `./format` introuvables.

- [ ] **Étape 3 : écrire `src/accuses.ts` et `src/lib/format.ts`**

`src/accuses.ts` (complété à la tâche 10) :

```ts
import { get, set } from 'idb-keyval';

const CLE_DECALAGE = 'decalage_ms';

export async function lireDecalage(): Promise<number | null> {
  return (await get<number>(CLE_DECALAGE)) ?? null;
}

export async function ecrireDecalage(ms: number): Promise<void> {
  await set(CLE_DECALAGE, ms);
}
```

`src/lib/format.ts` :

```ts
const DATE = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

export function formaterDate(iso: string | null): string {
  return iso ? DATE.format(new Date(iso)) : '—';
}

export function formaterSecondes(secondes: number | null): string {
  return secondes === null ? '—' : `${secondes.toFixed(1)} s`;
}

export function formaterPart(part: number | null): string {
  return part === null ? '—' : `${Math.round(part * 100)} %`;
}
```

- [ ] **Étape 4 : vérifier qu'ils passent**

Lancer : `npm test`
Attendu : 10 tests réussis.

- [ ] **Étape 5 : écrire `src/config.ts`, `src/supabase.ts`, `src/horloge-serveur.ts`, `src/notifications.ts`**

`src/config.ts` :

```ts
function lire(nom: string, valeur: string | undefined): string {
  if (!valeur) throw new Error(`Variable d'environnement manquante : ${nom}`);
  return valeur;
}

export const config = {
  supabaseUrl: lire('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
  clePubliable: lire('VITE_SUPABASE_PUBLISHABLE_KEY', import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY),
  vapidPublique: lire('VITE_VAPID_PUBLIC_KEY', import.meta.env.VITE_VAPID_PUBLIC_KEY),
};
```

`src/supabase.ts` :

```ts
import { createClient } from '@supabase/supabase-js';
import { config } from './config';

export const supabase = createClient(config.supabaseUrl, config.clePubliable);

let sessionEnCours: Promise<string> | null = null;

/** Renvoie l'identifiant du compte, en créant un compte anonyme au premier lancement. Un seul appel à la fois. */
export function assurerSession(): Promise<string> {
  sessionEnCours ??= (async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) return data.session.user.id;
    const { data: cree, error } = await supabase.auth.signInAnonymously();
    if (error || !cree.user) throw new Error(`Connexion anonyme impossible : ${error?.message ?? 'aucun compte'}`);
    return cree.user.id;
  })().catch((erreur: unknown) => {
    sessionEnCours = null;
    throw erreur;
  });
  return sessionEnCours;
}
```

`src/horloge-serveur.ts` :

```ts
import { ecrireDecalage } from './accuses';
import { estimerDecalage, type Echantillon } from './lib/horloge';
import { supabase } from './supabase';

/** Trois allers-retours vers la base ; le décalage retenu est mémorisé pour le service worker. */
export async function mesurerDecalage(): Promise<number> {
  const echantillons: Echantillon[] = [];
  for (let i = 0; i < 3; i++) {
    const envoiMs = Date.now();
    const { data, error } = await supabase.rpc('heure_serveur');
    const receptionMs = Date.now();
    if (error) throw new Error(error.message);
    echantillons.push({ envoiMs, receptionMs, serveurMs: new Date(data as string).getTime() });
  }
  const decalage = estimerDecalage(echantillons);
  await ecrireDecalage(decalage);
  return decalage;
}
```

`src/notifications.ts` :

```ts
import { config } from './config';
import { base64UrlVersOctets } from './lib/base64';
import { supabase } from './supabase';

export type EtatAbonnement = { abonne: boolean; cree_a: string | null; vu_a: string | null };

export function notificationsDisponibles(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

/** À appeler directement dans un toucher : iOS l'exige pour la demande de permission. */
export async function activerNotifications(): Promise<NotificationPermission> {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') await synchroniserAbonnement();
  return permission;
}

/** Recrée l'abonnement si besoin et le renvoie au serveur : iOS ne prévient pas quand il change. */
export async function synchroniserAbonnement(): Promise<void> {
  const enregistrement = await navigator.serviceWorker.ready;
  const abonnement =
    (await enregistrement.pushManager.getSubscription()) ??
    (await enregistrement.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64UrlVersOctets(config.vapidPublique),
    }));
  const json = abonnement.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) throw new Error('Abonnement incomplet');
  const { error } = await supabase.rpc('enregistrer_abonnement', {
    p_endpoint: json.endpoint,
    p_p256dh: json.keys.p256dh,
    p_auth: json.keys.auth,
    p_user_agent: navigator.userAgent,
  });
  if (error) throw new Error(`Enregistrement refusé : ${error.message}`);
}

export async function lireEtatAbonnement(): Promise<EtatAbonnement> {
  const { data, error } = await supabase.rpc('etat_abonnement');
  if (error) throw new Error(error.message);
  return (data as EtatAbonnement[])[0] ?? { abonne: false, cree_a: null, vu_a: null };
}
```

- [ ] **Étape 6 : écrire les écrans**

`src/composants/Installation.tsx` :

```tsx
export function Installation() {
  return (
    <section>
      <h2>Installer l'app</h2>
      <p>Les notifications ne fonctionnent que depuis l'app installée sur l'écran d'accueil.</p>
      <ol>
        <li>Dans Safari, touche le bouton « … » à droite de la barre d'adresse, ou le bouton Partager.</li>
        <li>Choisis « Partager », puis « Sur l'écran d'accueil ».</li>
        <li>Vérifie que « Ouvrir comme app web » est activé, puis touche « Ajouter ».</li>
        <li>Ouvre L'Exil depuis son icône.</li>
      </ol>
    </section>
  );
}
```

`src/composants/Etat.tsx` :

```tsx
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
```

`src/App.tsx` (remplacé à la tâche 13) :

```tsx
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
```

- [ ] **Étape 7 : vérifier sur l'ordinateur**

Lancer : `npm test && npm run build && npm run preview`
Puis ouvrir `http://localhost:4173/?bureau` dans le navigateur intégré et toucher « Activer les notifications ».
Attendu : tests réussis, construction sans erreur, et dans l'état « Notifications : autorisées », « Abonnement : enregistré depuis le … », un décalage en millisecondes. Si le navigateur intégré refuse les notifications, noter la limite et passer à la tâche 7 : la vérification décisive se fait sur l'iPhone.

- [ ] **Étape 8 : commit**

```bash
git add src
git commit -m "feat: session anonyme, abonnement push et écran d'état"
```

## Tâche 7 : test d'attaque, première partie

*Explication pour Abdallah : on joue l'attaquant avec la seule clé publique de l'app, celle que n'importe qui peut lire dans le code de la page. Tout doit échouer.*

**Fichiers :** créer `tests/distant/attaque.test.ts`.

- [ ] **Étape 1 : écrire le test**

`tests/distant/attaque.test.ts` :

```ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { beforeAll, describe, expect, it } from 'vitest';

const URL_SUPABASE = process.env.VITE_SUPABASE_URL!;
const CLE_PUBLIABLE = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;

function client(): SupabaseClient {
  return createClient(URL_SUPABASE, CLE_PUBLIABLE, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function connecte(): Promise<SupabaseClient> {
  const c = client();
  const { error } = await c.auth.signInAnonymously();
  if (error) throw error;
  return c;
}

describe('attaque : abonnements', () => {
  let a: SupabaseClient;
  beforeAll(async () => {
    a = await connecte();
  });

  it('refuse l’état d’abonnement sans session', async () => {
    const { error } = await client().rpc('etat_abonnement');
    expect(error).not.toBeNull();
  });

  it('n’expose pas le schéma privé', async () => {
    const { error } = await a.schema('prive').from('abonnements').select('*');
    expect(error).not.toBeNull();
  });

  it('refuse un abonnement vers une adresse arbitraire', async () => {
    const { error } = await a.rpc('enregistrer_abonnement', {
      p_endpoint: 'https://attaquant.example.com/x',
      p_p256dh: 'k',
      p_auth: 'a',
      p_user_agent: 'test',
    });
    expect(error?.message).toMatch(/refusée/);
  });
});
```

- [ ] **Étape 2 : lancer**

Lancer : `npm run test:distant`
Attendu : 9 tests réussis. Si un test d'attaque réussit à lire ou à écrire, **arrêter** : corriger la migration avant la mise en ligne.

- [ ] **Étape 3 : commit**

```bash
git add tests/distant/attaque.test.ts
git commit -m "test: attaque avec la clé publiable sur les abonnements"
```

## Tâche 8 : mise en ligne et test 0.a sur l'iPhone

*Explication pour Abdallah : GitHub garde le code, et Vercel le publie à une adresse https. À chaque envoi du code sur GitHub, Vercel republie l'app tout seul.*

- [ ] **Étape 1 : relecture** par un agent `code-reviewer` (modèle `sonnet`) sur `git diff 71b82b3..HEAD`, en lui donnant la spécification. Corriger ce qui est bloquant, puis faire un commit.
- [ ] **Étape 2 [Abdallah] : créer le dépôt GitHub privé et y envoyer le code**, après accord :

```bash
gh repo create exil --private --source . --remote origin --push
```

- [ ] **Étape 3 [Abdallah] : créer le projet Vercel** : vercel.com › Add New › Project › importer `exil`. Framework : Vite (détecté). Dans Environment Variables, ajouter `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` et `VITE_VAPID_PUBLIC_KEY`, avec les valeurs de `.env.local`. **Ne jamais y mettre `DATABASE_URL`.** Deploy, puis noter l'adresse, par exemple `https://exil-xxxx.vercel.app`.
- [ ] **Étape 4 [Abdallah] : test sur l'iPhone.** Ouvrir l'adresse dans Safari : l'écran « Installer l'app » s'affiche. Installer, ouvrir depuis l'icône, toucher « Activer les notifications », accepter.
  Attendu : « Notifications : autorisées », « Abonnement : enregistré depuis le … », un décalage de quelques centaines de millisecondes au plus.
- [ ] **Étape 5 : confirmer côté serveur**

Lancer : `npm run sql -- "select plateforme, left(endpoint, 40) as endpoint, cree_a from prive.abonnements"`
Attendu : une ligne `webpush` avec un endpoint `https://web.push.apple.com/…`.

- [ ] **Étape 6 : noter la version d'iOS** qu'Abdallah lit dans Réglages › Général › Informations, pour la campagne.

**Point d'arrêt : phase 0.a terminée. Attendre le retour d'Abdallah avant la phase 0.b.**

---

# Phase 0.b — le test rapide de bout en bout

## Tâche 9 : charges de notification

*Explication pour Abdallah : on fixe le contenu exact d'une notification, dans ses deux formats, et la façon dont le téléphone le relit. Un test vérifie que ce que le serveur écrit, le téléphone sait le lire.*

**Fichiers :** créer `supabase/functions/envoyer/outils.ts`, `supabase/functions/envoyer/outils.test.ts`, `src/lib/charge-recue.ts`, `src/lib/charge-recue.test.ts`.

- [ ] **Étape 1 : écrire les tests qui échouent**

`supabase/functions/envoyer/outils.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { construireCharge, egaux } from './outils.ts';

const LIGNE = { alerte_id: 'a1', format: 'classique' as const, prevue_a: '2026-09-30T12:00:05Z', jeton: 'j1' };

describe('construireCharge', () => {
  it('construit une charge classique', () => {
    expect(construireCharge(LIGNE, 'https://exil.vercel.app/')).toEqual({
      titre: "L'Exil",
      corps: 'Alerte prévue à 14:00:05',
      alerte_id: 'a1',
      jeton: 'j1',
      url: 'https://exil.vercel.app/?alerte=a1&jeton=j1',
    });
  });

  it('construit une charge déclarative modifiable', () => {
    expect(construireCharge({ ...LIGNE, format: 'declaratif' }, 'https://exil.vercel.app')).toEqual({
      web_push: 8030,
      mutable: true,
      notification: {
        title: "L'Exil",
        body: 'Alerte prévue à 14:00:05',
        navigate: 'https://exil.vercel.app/?alerte=a1&jeton=j1',
        data: { alerte_id: 'a1', jeton: 'j1' },
      },
    });
  });

  it('accepte une date renvoyée par Postgres', () => {
    const charge = construireCharge({ ...LIGNE, prevue_a: new Date('2026-09-30T12:00:05Z') }, 'https://exil.vercel.app');
    expect(charge).toMatchObject({ corps: 'Alerte prévue à 14:00:05' });
  });
});

describe('egaux', () => {
  it('compare deux textes', () => {
    expect(egaux('abc', 'abc')).toBe(true);
    expect(egaux('abc', 'abd')).toBe(false);
    expect(egaux('abc', 'abcd')).toBe(false);
    expect(egaux('', '')).toBe(true);
  });
});
```

`src/lib/charge-recue.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { construireCharge } from '../../supabase/functions/envoyer/outils.ts';
import { lireCharge } from './charge-recue';

const REPLI = { titre: "L'Exil", corps: 'Alerte reçue', alerteId: null, jeton: null, url: '/' };
const ATTENDU = {
  titre: "L'Exil",
  corps: 'Alerte prévue à 14:00:05',
  alerteId: 'a1',
  jeton: 'j1',
  url: 'https://exil.vercel.app/?alerte=a1&jeton=j1',
};

describe('lireCharge', () => {
  it('lit une charge classique construite par le serveur', () => {
    const charge = construireCharge({ alerte_id: 'a1', format: 'classique', prevue_a: '2026-09-30T12:00:05Z', jeton: 'j1' }, 'https://exil.vercel.app');
    expect(lireCharge(charge)).toEqual(ATTENDU);
  });

  it('lit une charge déclarative construite par le serveur', () => {
    const charge = construireCharge({ alerte_id: 'a1', format: 'declaratif', prevue_a: '2026-09-30T12:00:05Z', jeton: 'j1' }, 'https://exil.vercel.app');
    expect(lireCharge(charge)).toEqual(ATTENDU);
  });

  it('retrouve l’alerte dans l’adresse si le champ data manque', () => {
    expect(lireCharge({ web_push: 8030, notification: { title: 'T', navigate: 'https://x.fr/?alerte=a2&jeton=j2' } })).toEqual({
      titre: 'T',
      corps: '',
      alerteId: 'a2',
      jeton: 'j2',
      url: 'https://x.fr/?alerte=a2&jeton=j2',
    });
  });

  it('renvoie un contenu de repli pour une charge illisible', () => {
    expect(lireCharge(null)).toEqual(REPLI);
    expect(lireCharge({ bidule: 1 })).toEqual(REPLI);
  });
});
```

- [ ] **Étape 2 : vérifier qu'ils échouent**

Lancer : `npm test`
Attendu : ÉCHEC, modules `./outils.ts` et `./charge-recue` introuvables.

- [ ] **Étape 3 : écrire le code**

`supabase/functions/envoyer/outils.ts` :

```ts
// Fonctions pures de l'Edge Function, testées par Vitest.

export type FormatSerie = 'classique' | 'declaratif';

export type LigneEnvoi = {
  alerte_id: string;
  serie_id: string;
  format: FormatSerie;
  prevue_a: string | Date;
  jeton: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

export type ChargeClassique = { titre: string; corps: string; alerte_id: string; jeton: string; url: string };

export type ChargeDeclarative = {
  web_push: 8030;
  mutable: true;
  notification: { title: string; body: string; navigate: string; data: { alerte_id: string; jeton: string } };
};

const HEURE = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

export function construireCharge(
  ligne: Pick<LigneEnvoi, 'alerte_id' | 'format' | 'prevue_a' | 'jeton'>,
  origine: string,
): ChargeClassique | ChargeDeclarative {
  const url = `${origine.replace(/\/$/, '')}/?alerte=${encodeURIComponent(ligne.alerte_id)}&jeton=${encodeURIComponent(ligne.jeton)}`;
  const titre = "L'Exil";
  const corps = `Alerte prévue à ${HEURE.format(new Date(ligne.prevue_a))}`;
  if (ligne.format === 'declaratif') {
    // « mutable: true » est indispensable : sinon iOS affiche sans réveiller le service worker, et aucun accusé ne part.
    return {
      web_push: 8030,
      mutable: true,
      notification: { title: titre, body: corps, navigate: url, data: { alerte_id: ligne.alerte_id, jeton: ligne.jeton } },
    };
  }
  return { titre, corps, alerte_id: ligne.alerte_id, jeton: ligne.jeton, url };
}

/** Comparaison en temps constant, pour ne pas révéler le secret par le temps de réponse. */
export function egaux(a: string, b: string): boolean {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  let difference = ea.length ^ eb.length;
  for (let i = 0; i < Math.max(ea.length, eb.length); i++) {
    difference |= (ea[i] ?? 0) ^ (eb[i] ?? 0);
  }
  return difference === 0;
}
```

`src/lib/charge-recue.ts` :

```ts
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
```

- [ ] **Étape 4 : vérifier qu'ils passent**

Lancer : `npm test`
Attendu : 18 tests réussis.

- [ ] **Étape 5 : commit**

```bash
git add supabase/functions/envoyer/outils.ts supabase/functions/envoyer/outils.test.ts src/lib/charge-recue.ts src/lib/charge-recue.test.ts
git commit -m "feat: charges de notification classique et déclarative"
```

## Tâche 10 : file des accusés hors ligne

*Explication pour Abdallah : si le téléphone reçoit une alerte sans pouvoir prévenir le serveur, il garde l'accusé dans sa mémoire et l'envoie à la prochaine ouverture de l'app. Aucune mesure ne se perd.*

**Fichiers :** modifier `src/accuses.ts` et `src/accuses.test.ts`.

- [ ] **Étape 1 : ajouter les tests qui échouent** à la fin de `src/accuses.test.ts`, et compléter son import :

```ts
import { ecrireDecalage, lireDecalage, mettreEnFile, viderFile, type Accuse } from './accuses';
```

```ts
function accuse(id: string): Accuse {
  return { alerte_id: id, jeton: `j-${id}`, heure_appareil: '2026-09-30T12:00:04.000Z', decalage_ms: 0 };
}

describe('file des accusés', () => {
  beforeEach(() => clear());

  it('envoie les accusés en attente et vide la file', async () => {
    await mettreEnFile(accuse('a1'));
    await mettreEnFile(accuse('a2'));
    const envoyes: string[] = [];
    const nombre = await viderFile(async (a) => {
      envoyes.push(a.alerte_id);
    });
    expect(nombre).toBe(2);
    expect(envoyes).toEqual(['a1', 'a2']);
    expect(await viderFile(async () => undefined)).toBe(0);
  });

  it('garde en file un accusé dont l’envoi échoue', async () => {
    await mettreEnFile(accuse('a1'));
    await mettreEnFile(accuse('a2'));
    const nombre = await viderFile(async (a) => {
      if (a.alerte_id === 'a2') throw new Error('hors ligne');
    });
    expect(nombre).toBe(1);
    const restants: string[] = [];
    await viderFile(async (a) => {
      restants.push(a.alerte_id);
    });
    expect(restants).toEqual(['a2']);
  });
});
```

- [ ] **Étape 2 : vérifier qu'ils échouent**

Lancer : `npm test`
Attendu : ÉCHEC, `mettreEnFile` et `viderFile` non exportés.

- [ ] **Étape 3 : remplacer `src/accuses.ts`**

```ts
import { get, set, update } from 'idb-keyval';

const CLE_DECALAGE = 'decalage_ms';
const CLE_FILE = 'file_accuses';

export type Accuse = {
  alerte_id: string;
  jeton: string;
  heure_appareil: string;
  decalage_ms: number | null;
};

export async function lireDecalage(): Promise<number | null> {
  return (await get<number>(CLE_DECALAGE)) ?? null;
}

export async function ecrireDecalage(ms: number): Promise<void> {
  await set(CLE_DECALAGE, ms);
}

export async function mettreEnFile(accuse: Accuse): Promise<void> {
  await update<Accuse[]>(CLE_FILE, (file) => [...(file ?? []), accuse]);
}

/** Tente d'envoyer chaque accusé en attente ; ne retire de la file que ceux qui sont partis. */
export async function viderFile(envoyer: (accuse: Accuse) => Promise<void>): Promise<number> {
  const file = (await get<Accuse[]>(CLE_FILE)) ?? [];
  const envoyes = new Set<string>();
  for (const accuse of file) {
    try {
      await envoyer(accuse);
      envoyes.add(accuse.alerte_id);
    } catch {
      // reste en file pour la prochaine ouverture
    }
  }
  if (envoyes.size > 0) {
    await update<Accuse[]>(CLE_FILE, (actuelle) => (actuelle ?? []).filter((a) => !envoyes.has(a.alerte_id)));
  }
  return envoyes.size;
}
```

- [ ] **Étape 4 : vérifier qu'ils passent**

Lancer : `npm test`
Attendu : 20 tests réussis.

- [ ] **Étape 5 : commit**

```bash
git add src/accuses.ts src/accuses.test.ts
git commit -m "feat: file des accusés de réception hors ligne"
```

## Tâche 11 : migration des alertes et de la distribution

*Explication pour Abdallah : c'est le cœur du serveur. La base programme les alertes avec sa propre horloge, une tâche se réveille toutes les 10 secondes pour prendre celles qui sont dues, et chaque alerte porte un jeton qui authentifie son accusé. Les tests vérifient notamment qu'une alerte annulée n'est jamais envoyée.*

**Fichiers :** modifier `tests/distant/base.ts` ; créer `tests/distant/alertes.test.ts`, `supabase/migrations/20260930130000_alertes.sql`.

- [ ] **Étape 1 : ajouter les outils de test** à la fin de `tests/distant/base.ts`

```ts
export async function creerSerie(c: pg.Client, uid: string, format = 'classique'): Promise<string> {
  const { rows } = await c.query(
    `insert into public.series (user_id, type, situation, format) values ($1, 'serie', 'verrouillé', $2) returning id`,
    [uid, format],
  );
  return rows[0].id;
}

export type OptionsAlerte = { decalage?: string; etat?: string; tentatives?: number; priseIlYa?: string | null };

/** Crée une alerte à « maintenant + décalage » (en SQL : '-1 minute', '+5 minutes'…) avec son jeton. */
export async function creerAlerte(
  c: pg.Client,
  serieId: string,
  uid: string,
  o: OptionsAlerte = {},
): Promise<{ id: string; jeton: string }> {
  const { rows } = await c.query(
    `insert into public.alertes (serie_id, user_id, prevue_a, etat, tentatives, prise_a)
     values ($1, $2, now() + $3::interval, $4, $5, now() - $6::interval)
     returning id`,
    [serieId, uid, o.decalage ?? '-1 minute', o.etat ?? 'prevue', o.tentatives ?? 0, o.priseIlYa ?? null],
  );
  const jeton = nouveauJeton();
  await c.query('insert into prive.jetons (alerte_id, jeton) values ($1, $2)', [rows[0].id, jeton]);
  return { id: rows[0].id, jeton };
}

export async function lireAlerte(c: pg.Client, id: string): Promise<Record<string, unknown>> {
  const { rows } = await c.query('select * from public.alertes where id = $1', [id]);
  return rows[0];
}

export async function prendreLot(c: pg.Client): Promise<string[]> {
  const { rows } = await c.query('select unnest(prive.prendre_lot()) as id');
  return rows.map((r) => r.id as string);
}
```

- [ ] **Étape 2 : écrire les tests qui échouent**

`tests/distant/alertes.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import {
  agirEnTantQue,
  avecTransaction,
  creerAbonnement,
  creerAlerte,
  creerSerie,
  creerUtilisateur,
  lireAlerte,
  prendreLot,
  redevenirAdmin,
} from './base';

describe('programmer', () => {
  it('programme un test rapide dans 60 secondes', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      await agirEnTantQue(c, uid);
      await c.query(`select public.programmer('rapide', 'test rapide', 'classique')`);
      const { rows } = await c.query('select extract(epoch from prevue_a - now()) as ecart from public.alertes');
      expect(rows.map((r) => Number(r.ecart))).toEqual([60]);
    }));

  it('programme une série de 10 alertes espacées de 3 à 25 minutes', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      await agirEnTantQue(c, uid);
      await c.query(`select public.programmer('serie', 'verrouillé', 'classique')`);
      const { rows } = await c.query(
        `select extract(epoch from prevue_a - coalesce(lag(prevue_a) over (order by prevue_a), now())) as ecart
         from public.alertes order by prevue_a`,
      );
      expect(rows).toHaveLength(10);
      for (const r of rows) {
        expect(Number(r.ecart)).toBeGreaterThanOrEqual(180);
        expect(Number(r.ecart)).toBeLessThanOrEqual(1500);
      }
    }));

  it('programme la série longue à J+7 et J+14', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      await agirEnTantQue(c, uid);
      await c.query(`select public.programmer('longue', 'série longue', 'classique')`);
      const { rows } = await c.query(
        'select extract(epoch from prevue_a - now()) / 86400 as jours from public.alertes order by prevue_a',
      );
      expect(rows.map((r) => Number(r.jours))).toEqual([7, 14]);
    }));

  it('crée un jeton de 32 caractères par alerte', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      await agirEnTantQue(c, uid);
      await c.query(`select public.programmer('serie', 'verrouillé', 'classique')`);
      await redevenirAdmin(c);
      const { rows } = await c.query(
        `select count(*)::int as n from prive.jetons j join public.alertes a on a.id = j.alerte_id
         where a.user_id = $1 and length(j.jeton) = 32`,
        [uid],
      );
      expect(rows[0].n).toBe(10);
    }));

  it('refuse une 31e alerte en attente pour un même compte', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      await agirEnTantQue(c, uid);
      for (let i = 0; i < 3; i++) await c.query(`select public.programmer('serie', 'verrouillé', 'classique')`);
      await expect(c.query(`select public.programmer('rapide', 'test rapide', 'classique')`)).rejects.toThrow(
        /plafond du compte/,
      );
    }));

  it('refuse au-delà du plafond global', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      await c.query(
        `update prive.config set plafond_global =
           (select count(*) from public.alertes where etat in ('prevue', 'en_cours')) + 5`,
      );
      await agirEnTantQue(c, uid);
      await expect(c.query(`select public.programmer('serie', 'verrouillé', 'classique')`)).rejects.toThrow(
        /plafond global/,
      );
    }));

  it('refuse un type inconnu', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      await agirEnTantQue(c, uid);
      await expect(c.query(`select public.programmer('infini', 'x', 'classique')`)).rejects.toThrow(/type inconnu/);
    }));
});

describe('annuler_serie', () => {
  it('annule les alertes prévues et compte celles déjà en cours', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      const serie = await creerSerie(c, uid);
      const prevue = await creerAlerte(c, serie, uid, { decalage: '+5 minutes' });
      await creerAlerte(c, serie, uid, { etat: 'en_cours', tentatives: 1, priseIlYa: '5 seconds' });
      await agirEnTantQue(c, uid);
      const { rows } = await c.query('select * from public.annuler_serie($1)', [serie]);
      expect(rows).toEqual([{ annulees: 1, trop_tard: 1 }]);
      await redevenirAdmin(c);
      expect((await lireAlerte(c, prevue.id)).etat).toBe('annulee');
    }));

  it('refuse d’annuler la série d’un autre compte', () =>
    avecTransaction(async (c) => {
      const proprietaire = await creerUtilisateur(c);
      const intrus = await creerUtilisateur(c);
      const serie = await creerSerie(c, proprietaire);
      await agirEnTantQue(c, intrus);
      await expect(c.query('select * from public.annuler_serie($1)', [serie])).rejects.toThrow(/série inconnue/);
    }));
});

describe('prendre_lot', () => {
  it('prend une alerte échue et la passe en cours', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      const a = await creerAlerte(c, await creerSerie(c, uid), uid);
      expect(await prendreLot(c)).toContain(a.id);
      const ligne = await lireAlerte(c, a.id);
      expect(ligne.etat).toBe('en_cours');
      expect(ligne.tentatives).toBe(1);
      expect(ligne.prise_a).not.toBeNull();
    }));

  it('ignore les alertes futures, annulées ou déjà envoyées', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      const serie = await creerSerie(c, uid);
      const future = await creerAlerte(c, serie, uid, { decalage: '+5 minutes' });
      const annulee = await creerAlerte(c, serie, uid, { etat: 'annulee' });
      const envoyee = await creerAlerte(c, serie, uid, { etat: 'envoyee' });
      const lot = await prendreLot(c);
      expect(lot).not.toContain(future.id);
      expect(lot).not.toContain(annulee.id);
      expect(lot).not.toContain(envoyee.id);
      expect((await lireAlerte(c, annulee.id)).etat).toBe('annulee');
    }));

  it('reprend une alerte bloquée en cours depuis plus de 60 secondes', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      const a = await creerAlerte(c, await creerSerie(c, uid), uid, { etat: 'en_cours', tentatives: 1, priseIlYa: '2 minutes' });
      expect(await prendreLot(c)).toContain(a.id);
      expect((await lireAlerte(c, a.id)).tentatives).toBe(2);
    }));

  it('laisse tranquille une alerte en cours depuis peu', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      const a = await creerAlerte(c, await creerSerie(c, uid), uid, { etat: 'en_cours', tentatives: 1, priseIlYa: '10 seconds' });
      expect(await prendreLot(c)).not.toContain(a.id);
      expect((await lireAlerte(c, a.id)).etat).toBe('en_cours');
    }));

  it('abandonne une alerte bloquée après trois tentatives', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      const a = await creerAlerte(c, await creerSerie(c, uid), uid, { etat: 'en_cours', tentatives: 3, priseIlYa: '2 minutes' });
      expect(await prendreLot(c)).not.toContain(a.id);
      expect((await lireAlerte(c, a.id)).etat).toBe('echouee');
    }));

  it('abandonne une alerte prévue en retard de plus de 10 minutes', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      const a = await creerAlerte(c, await creerSerie(c, uid), uid, { decalage: '-11 minutes' });
      expect(await prendreLot(c)).not.toContain(a.id);
      expect((await lireAlerte(c, a.id)).etat).toBe('echouee');
    }));

  it('ne prend rien quand l’envoi est coupé', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      await creerAlerte(c, await creerSerie(c, uid), uid);
      await c.query('update prive.config set envoi_actif = false');
      expect(await prendreLot(c)).toEqual([]);
    }));

  it('reste interdite au client', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      await agirEnTantQue(c, uid);
      await expect(c.query('select prive.prendre_lot()')).rejects.toThrow(/permission denied/);
    }));
});

describe('preparer_envoi et noter_reponse', () => {
  it('renvoie les données d’envoi et note l’arrivée dans la fonction', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      await creerAbonnement(c, uid);
      const a = await creerAlerte(c, await creerSerie(c, uid), uid, { etat: 'en_cours', tentatives: 1, priseIlYa: '1 second' });
      const { rows } = await c.query('select * from prive.preparer_envoi($1)', [a.id]);
      expect(rows).toEqual([
        expect.objectContaining({ alerte_id: a.id, jeton: a.jeton, format: 'classique', endpoint: 'https://web.push.apple.com/test' }),
      ]);
      expect((await lireAlerte(c, a.id)).recue_ef_a).not.toBeNull();
    }));

  it('ne renvoie rien pour une alerte annulée entre-temps', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      await creerAbonnement(c, uid);
      const a = await creerAlerte(c, await creerSerie(c, uid), uid, { etat: 'annulee' });
      const { rows } = await c.query('select * from prive.preparer_envoi($1)', [a.id]);
      expect(rows).toEqual([]);
    }));

  it('passe à échouée une alerte dont le compte n’a pas d’abonnement', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      const a = await creerAlerte(c, await creerSerie(c, uid), uid, { etat: 'en_cours', tentatives: 1, priseIlYa: '1 second' });
      const { rows } = await c.query('select * from prive.preparer_envoi($1)', [a.id]);
      expect(rows).toEqual([]);
      expect((await lireAlerte(c, a.id)).etat).toBe('echouee');
    }));

  it('note une réponse 201 comme envoyée', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      const a = await creerAlerte(c, await creerSerie(c, uid), uid, { etat: 'en_cours', tentatives: 1, priseIlYa: '1 second' });
      await c.query(`select prive.noter_reponse($1, 201, 'apns-1')`, [a.id]);
      expect(await lireAlerte(c, a.id)).toMatchObject({ etat: 'envoyee', code_apple: 201, apns_id: 'apns-1' });
    }));

  it('supprime l’abonnement sur une réponse 410', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      await creerAbonnement(c, uid);
      const a = await creerAlerte(c, await creerSerie(c, uid), uid, { etat: 'en_cours', tentatives: 1, priseIlYa: '1 second' });
      await c.query('select prive.noter_reponse($1, 410, null)', [a.id]);
      expect((await lireAlerte(c, a.id)).etat).toBe('echouee');
      const { rows } = await c.query('select count(*)::int as n from prive.abonnements where user_id = $1', [uid]);
      expect(rows[0].n).toBe(0);
    }));

  it('laisse en cours après une erreur 500, pour une nouvelle tentative', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      const a = await creerAlerte(c, await creerSerie(c, uid), uid, { etat: 'en_cours', tentatives: 1, priseIlYa: '1 second' });
      await c.query('select prive.noter_reponse($1, 500, null)', [a.id]);
      expect(await lireAlerte(c, a.id)).toMatchObject({ etat: 'en_cours', code_apple: 500 });
    }));
});

describe('accusés', () => {
  it('enregistre un accusé sans session avec le bon jeton', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      const a = await creerAlerte(c, await creerSerie(c, uid), uid, { etat: 'envoyee' });
      await agirEnTantQue(c, null);
      await c.query('select public.accuser_reception($1, $2, $3, $4)', [a.id, a.jeton, '2026-09-30T12:00:04Z', 1500]);
      await redevenirAdmin(c);
      const ligne = await lireAlerte(c, a.id);
      expect(ligne.accuse_serveur_a).not.toBeNull();
      expect((ligne.accuse_appareil_a as Date).toISOString()).toBe('2026-09-30T12:00:04.000Z');
      expect(ligne.decalage_ms).toBe(1500);
    }));

  it('ignore un second accusé pour la même alerte', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      const a = await creerAlerte(c, await creerSerie(c, uid), uid, { etat: 'envoyee' });
      await agirEnTantQue(c, null);
      await c.query('select public.accuser_reception($1, $2, $3, $4)', [a.id, a.jeton, '2026-09-30T12:00:04Z', 0]);
      await c.query('select public.accuser_reception($1, $2, $3, $4)', [a.id, a.jeton, '2026-09-30T12:09:00Z', 0]);
      await redevenirAdmin(c);
      expect(((await lireAlerte(c, a.id)).accuse_appareil_a as Date).toISOString()).toBe('2026-09-30T12:00:04.000Z');
    }));

  it('ignore un faux jeton sans signaler d’erreur', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      const a = await creerAlerte(c, await creerSerie(c, uid), uid, { etat: 'envoyee' });
      await agirEnTantQue(c, null);
      await c.query('select public.accuser_reception($1, $2, $3, $4)', [a.id, 'faux', '2026-09-30T12:00:04Z', 0]);
      await redevenirAdmin(c);
      expect((await lireAlerte(c, a.id)).accuse_serveur_a).toBeNull();
    }));

  it('enregistre la vue avec le bon jeton', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      const a = await creerAlerte(c, await creerSerie(c, uid), uid, { etat: 'envoyee' });
      await agirEnTantQue(c, null);
      await c.query('select public.marquer_vue($1, $2)', [a.id, a.jeton]);
      await redevenirAdmin(c);
      expect((await lireAlerte(c, a.id)).vue_a).not.toBeNull();
    }));
});
```

- [ ] **Étape 3 : vérifier qu'ils échouent**

Lancer : `npm run test:distant`
Attendu : les 27 nouveaux tests échouent (`relation "public.series" does not exist` ou fonction absente), et les 9 anciens passent.

- [ ] **Étape 4 : écrire la migration**

`supabase/migrations/20260930130000_alertes.sql` :

```sql
-- Étape 0.b : séries, alertes, jetons d'accusé, distribution par pg_cron.

create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

-- Réglages globaux : une seule ligne.
create table prive.config (
  id boolean primary key default true check (id),
  envoi_actif boolean not null default true,
  plafond_compte int not null default 30,
  plafond_global int not null default 300
);
insert into prive.config default values;
alter table prive.config enable row level security;
revoke all on prive.config from public, anon, authenticated;

create table public.series (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type text not null check (type in ('rapide', 'serie', 'longue')),
  situation text not null check (char_length(situation) between 1 and 60),
  format text not null check (format in ('classique', 'declaratif')),
  creee_a timestamptz not null default now(),
  annulee_a timestamptz
);

create table public.alertes (
  id uuid primary key default gen_random_uuid(),
  serie_id uuid not null references public.series (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  prevue_a timestamptz not null,
  etat text not null default 'prevue' check (etat in ('prevue', 'en_cours', 'envoyee', 'annulee', 'echouee')),
  tentatives int not null default 0,
  prise_a timestamptz,
  recue_ef_a timestamptz,
  reponse_apple_a timestamptz,
  code_apple int,
  apns_id text,
  accuse_serveur_a timestamptz,
  accuse_appareil_a timestamptz,
  decalage_ms int,
  vue_a timestamptz
);
create index alertes_dues on public.alertes (prevue_a) where etat = 'prevue';
create index alertes_en_cours on public.alertes (prise_a) where etat = 'en_cours';
create index alertes_par_compte on public.alertes (user_id, prevue_a desc);
create index alertes_par_serie on public.alertes (serie_id);

alter table public.series enable row level security;
alter table public.alertes enable row level security;
revoke all on public.series, public.alertes from public, anon, authenticated;
grant select on public.series, public.alertes to authenticated;
create policy series_lecture on public.series for select to authenticated using (user_id = (select auth.uid()));
create policy alertes_lecture on public.alertes for select to authenticated using (user_id = (select auth.uid()));

create table prive.jetons (
  alerte_id uuid primary key references public.alertes (id) on delete cascade,
  jeton text not null,
  accuse_utilise_a timestamptz,
  vue_utilise_a timestamptz
);
alter table prive.jetons enable row level security;
revoke all on prive.jetons from public, anon, authenticated;

-- Intervalles tirés uniformément entre 180 et 1500 secondes.
create function prive.tirer_intervalles(p_n int)
returns interval[]
language sql
volatile
set search_path = ''
as $$
  select array_agg(make_interval(secs => 180 + floor(random() * 1321)::int) order by i)
  from generate_series(1, p_n) as i;
$$;

create function prive.programmer(p_type text, p_situation text, p_format text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_config prive.config;
  v_delais interval[];
  v_delai interval;
  v_heure timestamptz := now();
  v_en_attente int;
  v_serie uuid;
begin
  if v_uid is null then
    raise exception 'non authentifié';
  end if;
  if p_type = 'rapide' then
    v_delais := array[interval '60 seconds'];
  elsif p_type = 'serie' then
    v_delais := prive.tirer_intervalles(10);
  elsif p_type = 'longue' then
    v_delais := array[interval '7 days', interval '7 days'];
  else
    raise exception 'type inconnu';
  end if;

  -- Un seul programmeur à la fois : les plafonds restent exacts.
  perform pg_advisory_xact_lock(424242);
  select * into v_config from prive.config;
  select count(*) into v_en_attente from public.alertes a where a.user_id = v_uid and a.etat in ('prevue', 'en_cours');
  if v_en_attente + cardinality(v_delais) > v_config.plafond_compte then
    raise exception 'plafond du compte atteint : annule une série en cours';
  end if;
  select count(*) into v_en_attente from public.alertes a where a.etat in ('prevue', 'en_cours');
  if v_en_attente + cardinality(v_delais) > v_config.plafond_global then
    raise exception 'plafond global atteint';
  end if;

  insert into public.series (user_id, type, situation, format)
  values (v_uid, p_type, p_situation, p_format)
  returning id into v_serie;

  foreach v_delai in array v_delais loop
    v_heure := v_heure + v_delai;
    with nouvelle as (
      insert into public.alertes (serie_id, user_id, prevue_a)
      values (v_serie, v_uid, v_heure)
      returning id
    )
    insert into prive.jetons (alerte_id, jeton)
    select nouvelle.id, encode(extensions.gen_random_bytes(16), 'hex') from nouvelle;
  end loop;

  return v_serie;
end;
$$;

create function prive.annuler_serie(p_serie uuid)
returns table (annulees int, trop_tard int)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_annulees int;
  v_trop_tard int;
begin
  if not exists (select 1 from public.series s where s.id = p_serie and s.user_id = auth.uid()) then
    raise exception 'série inconnue';
  end if;
  with maj as (
    update public.alertes a set etat = 'annulee'
    where a.serie_id = p_serie and a.etat = 'prevue'
    returning 1
  )
  select count(*) into v_annulees from maj;
  select count(*) into v_trop_tard from public.alertes a where a.serie_id = p_serie and a.etat = 'en_cours';
  update public.series s set annulee_a = now() where s.id = p_serie;
  return query select v_annulees, v_trop_tard;
end;
$$;

-- Appelée par pg_cron : péremption, reprise, puis sélection d'au plus 50 alertes dues.
create function prive.prendre_lot()
returns uuid[]
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_ids uuid[];
begin
  if not (select c.envoi_actif from prive.config c) then
    return '{}';
  end if;

  update public.alertes a set etat = 'echouee'
  where (a.etat = 'en_cours' and a.prise_a < now() - interval '60 seconds' and a.tentatives >= 3)
     or (a.etat = 'prevue' and a.prevue_a < now() - interval '10 minutes');

  with lot as (
    select a.id from public.alertes a
    where (a.etat = 'prevue' and a.prevue_a <= now())
       or (a.etat = 'en_cours' and a.prise_a < now() - interval '60 seconds' and a.tentatives < 3)
    order by a.prevue_a
    limit 50
    for update skip locked
  ), maj as (
    update public.alertes a
    set etat = 'en_cours', prise_a = now(), tentatives = a.tentatives + 1
    from lot
    where a.id = lot.id
    returning a.id
  )
  select coalesce(array_agg(maj.id), '{}') into v_ids from maj;
  return v_ids;
end;
$$;

create function prive.distribuer()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_ids uuid[] := prive.prendre_lot();
  v_url text;
  v_secret text;
begin
  if cardinality(v_ids) = 0 then
    return;
  end if;
  select s.decrypted_secret into v_url from vault.decrypted_secrets s where s.name = 'envoi_url';
  select s.decrypted_secret into v_secret from vault.decrypted_secrets s where s.name = 'envoi_secret';
  perform net.http_post(
    url := v_url,
    body := jsonb_build_object('ids', to_jsonb(v_ids)),
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-envoi-secret', v_secret),
    timeout_milliseconds := 15000
  );
end;
$$;

-- Appelée par l'Edge Function : revérifie l'état et renvoie de quoi envoyer.
create function prive.preparer_envoi(p_alerte uuid)
returns table (
  alerte_id uuid,
  serie_id uuid,
  format text,
  prevue_a timestamptz,
  jeton text,
  endpoint text,
  p256dh text,
  auth text
)
language plpgsql
security definer
set search_path = ''
as $$
#variable_conflict use_column
begin
  update public.alertes a set recue_ef_a = now() where a.id = p_alerte and a.etat = 'en_cours';
  if not found then
    return;
  end if;
  if not exists (
    select 1 from prive.abonnements b join public.alertes a on a.user_id = b.user_id where a.id = p_alerte
  ) then
    update public.alertes a set etat = 'echouee' where a.id = p_alerte;
    return;
  end if;
  return query
    select a.id, a.serie_id, s.format, a.prevue_a, j.jeton, b.endpoint, b.p256dh, b.auth
    from public.alertes a
    join public.series s on s.id = a.serie_id
    join prive.jetons j on j.alerte_id = a.id
    join prive.abonnements b on b.user_id = a.user_id
    where a.id = p_alerte;
end;
$$;

-- Appelée par l'Edge Function juste après chaque réponse du service push.
create function prive.noter_reponse(p_alerte uuid, p_code int, p_apns_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.alertes a
  set reponse_apple_a = now(),
      code_apple = p_code,
      apns_id = p_apns_id,
      etat = case
        when p_code between 200 and 299 then 'envoyee'
        when p_code in (404, 410) then 'echouee'
        else a.etat
      end
  where a.id = p_alerte and a.etat = 'en_cours';
  if p_code in (404, 410) then
    delete from prive.abonnements b using public.alertes a where a.id = p_alerte and b.user_id = a.user_id;
  end if;
end;
$$;

-- Appelées par le service worker, sans session : le jeton fait foi, une seule fois.
create function prive.accuser_reception(p_alerte uuid, p_jeton text, p_heure_appareil timestamptz, p_decalage_ms int)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update prive.jetons j set accuse_utilise_a = now()
  where j.alerte_id = p_alerte and j.jeton = p_jeton and j.accuse_utilise_a is null;
  if found then
    update public.alertes a
    set accuse_serveur_a = now(),
        accuse_appareil_a = p_heure_appareil,
        decalage_ms = case when abs(p_decalage_ms) < 86400000 then p_decalage_ms end
    where a.id = p_alerte;
  end if;
end;
$$;

create function prive.marquer_vue(p_alerte uuid, p_jeton text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update prive.jetons j set vue_utilise_a = now()
  where j.alerte_id = p_alerte and j.jeton = p_jeton and j.vue_utilise_a is null;
  if found then
    update public.alertes a set vue_a = now() where a.id = p_alerte;
  end if;
end;
$$;

-- Fonctions fines exposées au client.
create function public.programmer(p_type text, p_situation text, p_format text)
returns uuid
language sql
security invoker
set search_path = ''
as $$
  select prive.programmer(p_type, p_situation, p_format);
$$;

create function public.annuler_serie(p_serie uuid)
returns table (annulees int, trop_tard int)
language sql
security invoker
set search_path = ''
as $$
  select * from prive.annuler_serie(p_serie);
$$;

create function public.accuser_reception(p_alerte uuid, p_jeton text, p_heure_appareil timestamptz, p_decalage_ms int)
returns void
language sql
security invoker
set search_path = ''
as $$
  select prive.accuser_reception(p_alerte, p_jeton, p_heure_appareil, p_decalage_ms);
$$;

create function public.marquer_vue(p_alerte uuid, p_jeton text)
returns void
language sql
security invoker
set search_path = ''
as $$
  select prive.marquer_vue(p_alerte, p_jeton);
$$;

-- Droits : rien par défaut, puis le strict nécessaire.
revoke execute on all functions in schema prive from public, anon, authenticated;
revoke execute on function
  public.programmer(text, text, text),
  public.annuler_serie(uuid),
  public.accuser_reception(uuid, text, timestamptz, int),
  public.marquer_vue(uuid, text)
from public, anon, authenticated;

grant execute on function
  prive.enregistrer_abonnement(text, text, text, text),
  prive.etat_abonnement(),
  prive.programmer(text, text, text),
  prive.annuler_serie(uuid),
  public.programmer(text, text, text),
  public.annuler_serie(uuid)
to authenticated;

grant execute on function
  prive.accuser_reception(uuid, text, timestamptz, int),
  prive.marquer_vue(uuid, text),
  public.accuser_reception(uuid, text, timestamptz, int),
  public.marquer_vue(uuid, text)
to anon, authenticated;

-- Tâches planifiées.
select cron.schedule('distribuer-alertes', '10 seconds', $$select prive.distribuer()$$);
select cron.schedule(
  'purger-historique-cron',
  '17 3 * * *',
  $$delete from cron.job_run_details where end_time < now() - interval '7 days'$$
);
```

- [ ] **Étape 5 : appliquer la migration**

Lancer : `npm run db:push`
Attendu : `Applying migration 20260930130000_alertes.sql...` puis `Finished supabase db push.`

- [ ] **Étape 6 : vérifier que les tests passent**

Lancer : `npm run test:distant`
Attendu : 36 tests réussis.

- [ ] **Étape 7 : vérifier que la tâche planifiée tourne**

Lancer : `npm run sql -- "select j.jobname, d.status, d.start_time from cron.job_run_details d join cron.job j using (jobid) order by d.start_time desc limit 3"`
Attendu : des lignes `distribuer-alertes` au statut `succeeded`, espacées d'environ 10 secondes.

- [ ] **Étape 8 : commit**

```bash
git add tests/distant supabase/migrations/20260930130000_alertes.sql
git commit -m "feat: programmation, distribution et accusés des alertes"
```

## Tâche 12 : Edge Function d'envoi

*Explication pour Abdallah : c'est le petit programme qui tourne chez Supabase et parle au service de notifications d'Apple. Il refuse tout appel qui ne porte pas le secret partagé, puis note la réponse d'Apple alerte par alerte.*

**Fichiers :** créer `supabase/functions/envoyer/index.ts` ; modifier `supabase/config.toml`.

- [ ] **Étape 1 : écrire la fonction**

`supabase/functions/envoyer/index.ts` :

```ts
// Edge Function « envoyer » : reçoit de pg_cron un lot d'identifiants d'alertes et les envoie au service push.
import postgres from 'npm:postgres@3.4.9';
import webpush from 'npm:web-push@3.6.7';
import { construireCharge, egaux, type LigneEnvoi } from './outils.ts';

declare const EdgeRuntime: { waitUntil(promesse: Promise<unknown>): void };

const sql = postgres(Deno.env.get('SUPABASE_DB_URL')!, { prepare: false, max: 2 });
const SECRET = Deno.env.get('ENVOI_SECRET') ?? '';
const APP_URL = Deno.env.get('APP_URL') ?? '';

webpush.setVapidDetails(
  Deno.env.get('VAPID_SUJET')!,
  Deno.env.get('VAPID_PUBLIQUE')!,
  Deno.env.get('VAPID_PRIVEE')!,
);

Deno.serve(async (requete) => {
  if (requete.method !== 'POST') return new Response('méthode refusée', { status: 405 });
  if (!SECRET || !egaux(requete.headers.get('x-envoi-secret') ?? '', SECRET)) {
    return new Response('interdit', { status: 403 });
  }
  let ids: unknown;
  try {
    ids = (await requete.json()).ids;
  } catch {
    return new Response('corps invalide', { status: 400 });
  }
  if (!Array.isArray(ids) || !ids.every((id) => typeof id === 'string')) {
    return new Response('corps invalide', { status: 400 });
  }
  // Répondre tout de suite : pg_net n'attend pas la fin des envois.
  EdgeRuntime.waitUntil(traiterLot(ids as string[]));
  return new Response(null, { status: 202 });
});

async function traiterLot(ids: string[]): Promise<void> {
  for (const id of ids) {
    try {
      await traiter(id);
    } catch (erreur) {
      console.error(`alerte ${id}`, erreur);
    }
  }
}

async function traiter(id: string): Promise<void> {
  const [ligne] = await sql<LigneEnvoi[]>`select * from prive.preparer_envoi(${id}::uuid)`;
  if (!ligne) return; // annulée entre-temps, ou abonnement absent
  let code = 0;
  let apnsId: string | null = null;
  try {
    const reponse = await webpush.sendNotification(
      { endpoint: ligne.endpoint, keys: { p256dh: ligne.p256dh, auth: ligne.auth } },
      JSON.stringify(construireCharge(ligne, APP_URL)),
      { TTL: 120, urgency: 'high', topic: ligne.serie_id.replaceAll('-', '') },
    );
    code = reponse.statusCode;
    apnsId = reponse.headers['apns-id'] ?? null;
  } catch (erreur) {
    code = (erreur as { statusCode?: number }).statusCode ?? 0;
    console.error(`envoi ${id}`, erreur);
  }
  // Écrit juste après chaque réponse : un plantage plus loin ne provoque pas de double envoi.
  await sql`select prive.noter_reponse(${id}::uuid, ${code}, ${apnsId})`;
}
```

- [ ] **Étape 2 : désactiver la vérification de jeton pour cette fonction** en ajoutant à la fin de `supabase/config.toml` :

```toml
[functions.envoyer]
verify_jwt = false
```

- [ ] **Étape 3 [Abdallah] : déposer les secrets**, dans le terminal du projet :

```bash
npx supabase secrets set --env-file supabase/.env.secrets
```

```bash
npx supabase secrets set APP_URL=https://ADRESSE-VERCEL
```

```bash
npm run sql -- -f supabase/.vault.sql
```

`ADRESSE-VERCEL` est l'adresse notée à la tâche 8, sans barre finale.

- [ ] **Étape 4 : vérifier les secrets sans les afficher**

Lancer : `npx supabase secrets list`
Attendu : `VAPID_PUBLIQUE`, `VAPID_PRIVEE`, `VAPID_SUJET`, `ENVOI_SECRET`, `APP_URL` (seules leurs empreintes s'affichent).

Lancer : `npm run sql -- "select name from vault.secrets order by name"`
Attendu : `envoi_secret` et `envoi_url`.

- [ ] **Étape 5 : déployer**

Lancer : `npx supabase functions deploy envoyer --no-verify-jwt --use-api`
Attendu : `Deployed Functions on project … envoyer`. Si le paquet `web-push` échoue sous Deno (erreur sur `createECDH` ou `crypto`), remplacer l'import par `jsr:@negrel/webpush` en suivant sa documentation, et le signaler à Abdallah.

- [ ] **Étape 6 : vérifier le refus sans secret**

Lancer : `curl -s -o /dev/null -w "%{http_code}\n" -X POST "$(grep ^VITE_SUPABASE_URL= .env.local | cut -d= -f2-)/functions/v1/envoyer" -H "Content-Type: application/json" -d '{"ids":[]}'`
Attendu : `403`.

- [ ] **Étape 7 : commit**

```bash
git add supabase/functions/envoyer/index.ts supabase/config.toml
git commit -m "feat: Edge Function d'envoi Web Push"
```

## Tâche 13 : service worker complet, test rapide et liste des alertes

*Explication pour Abdallah : on branche tout. Le téléphone reçoit l'alerte, l'affiche, renvoie l'accusé avec son heure, et l'app affiche la liste des alertes avec leur retard.*

**Fichiers :** créer `src/api-accuse.ts`, `src/api.ts`, `src/lib/types.ts`, `src/lib/stats.ts`, `src/lib/stats.test.ts`, `src/composants/Tests.tsx`, `src/composants/ListeAlertes.tsx` ; remplacer `src/sw.ts` et `src/App.tsx`.

- [ ] **Étape 1 : écrire les tests qui échouent**

`src/lib/stats.test.ts` :

```ts
import { describe, expect, it } from 'vitest';
import { issue, retardSecondes } from './stats';
import type { AlerteLue, FormatSerie, TypeSerie } from './types';

export function alerte(
  p: Partial<AlerteLue> & { situation?: string; type?: TypeSerie; format?: FormatSerie } = {},
): AlerteLue {
  const { situation = 'verrouillé', type = 'serie', format = 'classique', ...reste } = p;
  return {
    id: crypto.randomUUID(),
    serie_id: 's1',
    prevue_a: '2026-09-30T12:00:00Z',
    etat: 'envoyee',
    code_apple: 201,
    accuse_serveur_a: null,
    accuse_appareil_a: null,
    decalage_ms: null,
    vue_a: null,
    series: { type, situation, format },
    ...reste,
  };
}

const MAINTENANT = Date.parse('2026-09-30T13:00:00Z');

describe('retardSecondes', () => {
  it('utilise l’heure du téléphone corrigée du décalage', () => {
    expect(retardSecondes(alerte({ accuse_appareil_a: '2026-09-30T12:00:04Z', decalage_ms: 1000, accuse_serveur_a: '2026-09-30T12:05:00Z' }))).toBe(5);
  });
  it('se replie sur l’heure du serveur sans décalage connu', () => {
    expect(retardSecondes(alerte({ accuse_appareil_a: '2026-09-30T12:00:04Z', accuse_serveur_a: '2026-09-30T12:00:12Z' }))).toBe(12);
  });
  it('renvoie null sans accusé', () => {
    expect(retardSecondes(alerte())).toBeNull();
  });
});

describe('issue', () => {
  it('distingue réussie et en retard autour de 30 secondes', () => {
    expect(issue(alerte({ accuse_serveur_a: '2026-09-30T12:00:30Z' }), MAINTENANT)).toBe('reussie');
    expect(issue(alerte({ accuse_serveur_a: '2026-09-30T12:00:31Z' }), MAINTENANT)).toBe('en_retard');
  });
  it('reconnaît annulée et échouée', () => {
    expect(issue(alerte({ etat: 'annulee' }), MAINTENANT)).toBe('annulee');
    expect(issue(alerte({ etat: 'echouee' }), MAINTENANT)).toBe('echouee');
  });
  it('déclare perdue une alerte sans accusé 10 minutes après son heure', () => {
    expect(issue(alerte(), MAINTENANT)).toBe('perdue');
    expect(issue(alerte({ prevue_a: '2026-09-30T12:55:00Z' }), MAINTENANT)).toBe('en_attente');
    expect(issue(alerte({ etat: 'prevue', prevue_a: '2026-09-30T14:00:00Z' }), MAINTENANT)).toBe('en_attente');
  });
});
```

- [ ] **Étape 2 : vérifier qu'ils échouent**

Lancer : `npm test`
Attendu : ÉCHEC, modules `./stats` et `./types` introuvables.

- [ ] **Étape 3 : écrire `src/lib/types.ts` et `src/lib/stats.ts`**

`src/lib/types.ts` :

```ts
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
```

`src/lib/stats.ts` (complété à la tâche 15) :

```ts
import type { AlerteLue } from './types';

export const SEUIL_RETARD_S = 30;
export const DELAI_PERTE_MS = 10 * 60 * 1000;

export type Issue = 'reussie' | 'en_retard' | 'perdue' | 'echouee' | 'en_attente' | 'annulee';

/** Heure du téléphone corrigée du décalage si possible, sinon heure d'arrivée de l'accusé sur le serveur. */
export function retardSecondes(a: AlerteLue): number | null {
  const prevue = Date.parse(a.prevue_a);
  if (a.accuse_appareil_a && a.decalage_ms !== null) {
    return (Date.parse(a.accuse_appareil_a) + a.decalage_ms - prevue) / 1000;
  }
  if (a.accuse_serveur_a) return (Date.parse(a.accuse_serveur_a) - prevue) / 1000;
  return null;
}

export function issue(a: AlerteLue, maintenantMs: number): Issue {
  if (a.etat === 'annulee') return 'annulee';
  const retard = retardSecondes(a);
  if (retard !== null) return retard <= SEUIL_RETARD_S ? 'reussie' : 'en_retard';
  if (a.etat === 'echouee') return 'echouee';
  if (maintenantMs - Date.parse(a.prevue_a) > DELAI_PERTE_MS) return 'perdue';
  return 'en_attente';
}

export function estEchec(i: Issue): boolean {
  return i === 'en_retard' || i === 'perdue' || i === 'echouee';
}
```

- [ ] **Étape 4 : vérifier qu'ils passent**

Lancer : `npm test`
Attendu : 26 tests réussis.

- [ ] **Étape 5 : écrire `src/api-accuse.ts` et `src/api.ts`**

`src/api-accuse.ts` (sans session, utilisable depuis le service worker) :

```ts
import type { Accuse } from './accuses';
import { config } from './config';

async function appeler(fonction: string, corps: unknown): Promise<void> {
  const reponse = await fetch(`${config.supabaseUrl}/rest/v1/rpc/${fonction}`, {
    method: 'POST',
    headers: { apikey: config.clePubliable, 'Content-Type': 'application/json' },
    body: JSON.stringify(corps),
  });
  if (!reponse.ok) throw new Error(`${fonction} : ${reponse.status}`);
}

export function envoyerAccuse(a: Accuse): Promise<void> {
  return appeler('accuser_reception', {
    p_alerte: a.alerte_id,
    p_jeton: a.jeton,
    p_heure_appareil: a.heure_appareil,
    p_decalage_ms: a.decalage_ms,
  });
}

export function envoyerVue(alerteId: string, jeton: string): Promise<void> {
  return appeler('marquer_vue', { p_alerte: alerteId, p_jeton: jeton });
}
```

`src/api.ts` (complété à la tâche 16) :

```ts
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
```

- [ ] **Étape 6 : remplacer `src/sw.ts`**

```ts
/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { lireDecalage, mettreEnFile, type Accuse } from './accuses';
import { envoyerAccuse } from './api-accuse';
import { lireCharge } from './lib/charge-recue';

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', () => {
  void self.skipWaiting();
});
self.addEventListener('activate', (evenement) => {
  evenement.waitUntil(self.clients.claim());
});

self.addEventListener('push', (evenement) => {
  const heureAppareil = new Date().toISOString();
  let brut: unknown = null;
  try {
    brut = evenement.data?.json();
  } catch {
    brut = null;
  }
  const contenu = lireCharge(brut);
  // Toujours afficher : iOS retire la permission après des push qui n'affichent rien.
  // Le tag remplace un éventuel doublon au lieu de l'empiler.
  const affichage = self.registration.showNotification(contenu.titre, {
    body: contenu.corps,
    tag: contenu.alerteId ?? undefined,
    data: { url: contenu.url },
  });
  evenement.waitUntil(Promise.all([affichage, accuser(contenu.alerteId, contenu.jeton, heureAppareil)]));
});

async function accuser(alerteId: string | null, jeton: string | null, heureAppareil: string): Promise<void> {
  if (!alerteId || !jeton) return;
  try {
    const accuse: Accuse = { alerte_id: alerteId, jeton, heure_appareil: heureAppareil, decalage_ms: await lireDecalage() };
    try {
      await envoyerAccuse(accuse);
    } catch {
      await mettreEnFile(accuse);
    }
  } catch {
    // ne jamais faire échouer l'affichage
  }
}

self.addEventListener('notificationclick', (evenement) => {
  evenement.notification.close();
  const url = (evenement.notification.data as { url?: string } | null)?.url ?? '/';
  evenement.waitUntil(self.clients.openWindow(url));
});
```

- [ ] **Étape 7 : écrire les écrans**

`src/composants/Tests.tsx` (remplacé à la tâche 16) :

```tsx
import { useState } from 'react';
import { programmer } from '../api';

type Props = { auChangement: () => Promise<void> };

export function Tests({ auChangement }: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [occupe, setOccupe] = useState(false);

  async function testRapide() {
    setOccupe(true);
    setMessage(null);
    try {
      await programmer('rapide', 'test rapide', 'classique');
      setMessage('Alerte programmée dans une minute. Verrouille le téléphone.');
      await auChangement();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setOccupe(false);
    }
  }

  return (
    <section>
      <h2>Tests</h2>
      <button disabled={occupe} onClick={testRapide}>
        Test rapide (1 min)
      </button>
      {message && <p>{message}</p>}
    </section>
  );
}
```

`src/composants/ListeAlertes.tsx` :

```tsx
import { formaterDate, formaterSecondes } from '../lib/format';
import { issue, retardSecondes, type Issue } from '../lib/stats';
import type { AlerteLue } from '../lib/types';

const LIBELLES: Record<Issue, string> = {
  reussie: 'reçue',
  en_retard: 'en retard',
  perdue: 'perdue',
  echouee: 'échouée',
  en_attente: 'en attente',
  annulee: 'annulée',
};

export function ListeAlertes({ alertes }: { alertes: AlerteLue[] }) {
  const maintenant = Date.now();
  if (alertes.length === 0) return null;
  return (
    <section>
      <h2>Détail des alertes</h2>
      <ul className="liste">
        {alertes.map((a) => (
          <li key={a.id}>
            {formaterDate(a.prevue_a)} · {a.series.situation}
            {a.series.format === 'declaratif' ? ' (déclaratif)' : ''} · <strong>{LIBELLES[issue(a, maintenant)]}</strong>
            {' · retard '}
            {formaterSecondes(retardSecondes(a))}
            {a.vue_a ? ' · vue' : ''}
            {a.code_apple !== null && a.code_apple >= 300 ? ` · code ${a.code_apple}` : ''}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

`src/App.tsx` (remplacé à la tâche 16) :

```tsx
import { useCallback, useEffect, useState } from 'react';
import { viderFile } from './accuses';
import { lireAlertes } from './api';
import { envoyerAccuse, envoyerVue } from './api-accuse';
import { Etat } from './composants/Etat';
import { Installation } from './composants/Installation';
import { ListeAlertes } from './composants/ListeAlertes';
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
          <Tests auChangement={recharger} />
          <ListeAlertes alertes={alertes} />
        </>
      )}
    </main>
  );
}
```

- [ ] **Étape 8 : vérifier**

Lancer : `npm test && npm run build`
Attendu : 26 tests réussis, construction sans erreur.

- [ ] **Étape 9 : commit**

```bash
git add src
git commit -m "feat: accusé depuis le service worker, test rapide et liste des alertes"
```

## Tâche 14 : attaque sur les alertes, mise en ligne et test 0.b

*Explication pour Abdallah : on rejoue l'attaquant sur les nouvelles fonctions, puis tu fais le premier vrai test : une alerte, téléphone verrouillé.*

**Fichiers :** modifier `tests/distant/attaque.test.ts`.

- [ ] **Étape 1 : ajouter les tests** à la fin de `tests/distant/attaque.test.ts`, et ajouter `afterAll` à l'import de `vitest` :

```ts
describe('attaque : alertes', () => {
  let a: SupabaseClient;
  let b: SupabaseClient;
  let serieA: string;

  beforeAll(async () => {
    a = await connecte();
    b = await connecte();
    const { data, error } = await a.rpc('programmer', { p_type: 'rapide', p_situation: 'test attaque', p_format: 'classique' });
    if (error) throw error;
    serieA = data as string;
  });

  afterAll(async () => {
    await a.rpc('annuler_serie', { p_serie: serieA });
  });

  it('ne montre pas les alertes d’un autre compte', async () => {
    const { data } = await b.from('alertes').select('id').eq('serie_id', serieA);
    expect(data).toEqual([]);
  });

  it('interdit d’écrire directement dans les tables', async () => {
    const maj = await a.from('alertes').update({ etat: 'envoyee' }).eq('serie_id', serieA);
    expect(maj.error).not.toBeNull();
    const ajout = await a.from('series').insert({ type: 'rapide', situation: 'x', format: 'classique' });
    expect(ajout.error).not.toBeNull();
  });

  it('refuse d’annuler la série d’un autre compte', async () => {
    const { error } = await b.rpc('annuler_serie', { p_serie: serieA });
    expect(error?.message).toMatch(/série inconnue/);
  });

  it('n’enregistre pas un accusé avec un faux jeton', async () => {
    const { data: alertes } = await a.from('alertes').select('id').eq('serie_id', serieA);
    const id = alertes![0].id as string;
    const { error } = await client().rpc('accuser_reception', {
      p_alerte: id,
      p_jeton: 'faux',
      p_heure_appareil: new Date().toISOString(),
      p_decalage_ms: 0,
    });
    expect(error).toBeNull();
    const { data } = await a.from('alertes').select('accuse_serveur_a').eq('id', id).single();
    expect(data!.accuse_serveur_a).toBeNull();
  });

  it('refuse l’Edge Function sans secret ou avec un faux secret', async () => {
    for (const entetes of [{}, { 'x-envoi-secret': 'faux' }]) {
      const reponse = await fetch(`${URL_SUPABASE}/functions/v1/envoyer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...entetes },
        body: '{"ids":[]}',
      });
      expect(reponse.status).toBe(403);
    }
  });
});
```

- [ ] **Étape 2 : lancer**

Lancer : `npm run test:distant`
Attendu : 41 tests réussis.

- [ ] **Étape 3 : commit**

```bash
git add tests/distant/attaque.test.ts
git commit -m "test: attaque avec la clé publiable sur les alertes"
```

- [ ] **Étape 4 : relecture** par un agent `code-reviewer` (modèle `sonnet`) sur le diff de la phase 0.b, avec la spécification et la réponse du conseiller. Corriger ce qui est bloquant, puis faire un commit.
- [ ] **Étape 5 : mise en ligne.** `git push` ; attendre que Vercel ait fini de publier (une à deux minutes).
- [ ] **Étape 6 [Abdallah] : test 0.b sur l'iPhone.** Fermer puis rouvrir L'Exil depuis l'icône, pour charger la nouvelle version. Toucher « Test rapide », verrouiller le téléphone, attendre.
  Attendu : une notification « L'Exil — Alerte prévue à HH:MM:SS » environ une minute plus tard. En rouvrant l'app, la liste indique « reçue » avec un retard de quelques secondes. Toucher la notification ajoute « vue ».
- [ ] **Étape 7 : en cas d'échec, diagnostiquer dans cet ordre**

```bash
npm run sql -- "select id, etat, tentatives, code_apple, prevue_a, recue_ef_a, accuse_serveur_a from public.alertes order by prevue_a desc limit 5"
```

```bash
npm run sql -- "select id, status_code, left(content::text, 200) as contenu, created from net._http_response order by created desc limit 5"
```

```bash
npm run sql -- "select status, return_message, start_time from cron.job_run_details order by start_time desc limit 5"
```

Journaux de la fonction : tableau de bord Supabase › Edge Functions › envoyer › Logs.
Lecture : alerte restée `prevue`, la tâche planifiée ne tourne pas ; `en_cours` sans `recue_ef_a`, l'appel à l'Edge Function échoue (secret, adresse du coffre) ; `envoyee` sans accusé, le téléphone reçoit mais l'accusé ne part pas. Dans ce dernier cas, **c'est le point 1 de la spécification (section 12)** : le signaler à Abdallah avant de continuer.

**Point d'arrêt : phase 0.b terminée. Attendre le retour d'Abdallah avant la phase 0.c.**

---

# Phase 0.c — séries, tableau et campagne

## Tâche 15 : statistiques et règle en trois zones

*Explication pour Abdallah : le calcul du tableau, testé à part. Par situation : combien d'alertes sont reçues, la part reçue en moins de 30 secondes, le retard médian et maximal. Puis la règle que tu as choisie : au moins 100 alertes, au plus 2 échecs pour rester en web app, 8 ou plus pour envisager le natif.*

**Fichiers :** modifier `src/lib/stats.ts` et `src/lib/stats.test.ts`.

- [ ] **Étape 1 : ajouter les tests qui échouent** à la fin de `src/lib/stats.test.ts`, et compléter l'import :

```ts
import { issue, mediane, regleTroisZones, retardSecondes, seriesEnAttente, statsParSituation } from './stats';
```

```ts
describe('mediane', () => {
  it('prend la valeur centrale ou la moyenne des deux centrales', () => {
    expect(mediane([3, 1, 2])).toBe(2);
    expect(mediane([4, 1, 2, 3])).toBe(2.5);
    expect(mediane([])).toBeNull();
  });
});

describe('statsParSituation', () => {
  it('résume chaque situation', () => {
    const lignes = statsParSituation(
      [
        alerte({ accuse_serveur_a: '2026-09-30T12:00:04Z' }),
        alerte({ accuse_serveur_a: '2026-09-30T12:00:40Z' }),
        alerte(),
        alerte({ situation: 'Wi-Fi seul', accuse_serveur_a: '2026-09-30T12:00:02Z' }),
        alerte({ situation: 'Wi-Fi seul', etat: 'annulee' }),
      ],
      MAINTENANT,
    );
    expect(lignes).toEqual([
      { situation: 'verrouillé', prevues: 3, recues: 2, sous30: 1, partSous30: 1 / 3, medianeS: 22, maxS: 40, echecs: 2 },
      { situation: 'Wi-Fi seul', prevues: 1, recues: 1, sous30: 1, partSous30: 1, medianeS: 2, maxS: 2, echecs: 0 },
    ]);
  });
});

describe('regleTroisZones', () => {
  const reussies = (n: number) => Array.from({ length: n }, () => alerte({ accuse_serveur_a: '2026-09-30T12:00:03Z' }));
  const perdues = (n: number) => Array.from({ length: n }, () => alerte());

  it('attend 100 alertes avant de conclure', () => {
    expect(regleTroisZones(reussies(50), MAINTENANT)).toEqual({ n: 50, echecs: 0, zone: 'insuffisant' });
  });
  it('reste en web app avec au plus 2 échecs sur 100', () => {
    expect(regleTroisZones([...reussies(98), ...perdues(2)], MAINTENANT).zone).toBe('web_app');
  });
  it('prolonge entre 3 et 7 échecs', () => {
    expect(regleTroisZones([...reussies(97), ...perdues(3)], MAINTENANT).zone).toBe('prolonger');
  });
  it('envisage le natif dès 8 échecs, même avant 100 alertes', () => {
    expect(regleTroisZones([...reussies(12), ...perdues(8)], MAINTENANT).zone).toBe('natif');
  });
  it('ne compte que les séries classiques en situation normale', () => {
    const exclues = [
      alerte({ situation: 'Concentration, app non autorisée' }),
      alerte({ situation: 'autre : redémarrage' }),
      alerte({ type: 'longue' }),
      alerte({ type: 'rapide' }),
      alerte({ format: 'declaratif' }),
      alerte({ etat: 'annulee' }),
      alerte({ prevue_a: '2026-09-30T12:59:00Z' }),
    ];
    expect(regleTroisZones(exclues, MAINTENANT)).toEqual({ n: 0, echecs: 0, zone: 'insuffisant' });
  });
});

describe('seriesEnAttente', () => {
  it('liste les séries qui ont encore des alertes prévues', () => {
    expect(
      seriesEnAttente([
        alerte({ serie_id: 's1', etat: 'prevue' }),
        alerte({ serie_id: 's1', etat: 'prevue' }),
        alerte({ serie_id: 's1' }),
        alerte({ serie_id: 's2' }),
      ]),
    ).toEqual([{ serieId: 's1', situation: 'verrouillé', restantes: 2 }]);
  });
});
```

- [ ] **Étape 2 : vérifier qu'ils échouent**

Lancer : `npm test`
Attendu : ÉCHEC, `mediane`, `regleTroisZones`, `seriesEnAttente` et `statsParSituation` non exportés.

- [ ] **Étape 3 : ajouter le code** à la fin de `src/lib/stats.ts`

```ts
export const SITUATIONS = [
  'verrouillé',
  'Concentration, app autorisée',
  'Concentration, app non autorisée',
  "économie d'énergie",
  'Wi-Fi seul',
  'réseau mobile seul',
  "app ouverte à l'écran",
  'autre',
] as const;

export const MIN_ALERTES_REGLE = 100;

export function estHorsRegle(situation: string): boolean {
  return situation === 'Concentration, app non autorisée' || situation.startsWith('autre');
}

export function mediane(valeurs: number[]): number | null {
  if (valeurs.length === 0) return null;
  const triees = [...valeurs].sort((x, y) => x - y);
  const milieu = Math.floor(triees.length / 2);
  return triees.length % 2 === 1 ? triees[milieu] : (triees[milieu - 1] + triees[milieu]) / 2;
}

export type LigneStats = {
  situation: string;
  prevues: number;
  recues: number;
  sous30: number;
  partSous30: number | null;
  medianeS: number | null;
  maxS: number | null;
  echecs: number;
};

export function statsParSituation(alertes: AlerteLue[], maintenantMs: number): LigneStats[] {
  const groupes = new Map<string, AlerteLue[]>();
  for (const a of alertes) {
    if (a.etat === 'annulee') continue;
    groupes.set(a.series.situation, [...(groupes.get(a.series.situation) ?? []), a]);
  }
  return [...groupes.entries()]
    .map(([situation, liste]) => {
      const retards = liste.map(retardSecondes).filter((r): r is number => r !== null);
      const issues = liste.map((a) => issue(a, maintenantMs));
      const sous30 = issues.filter((i) => i === 'reussie').length;
      const terminees = issues.filter((i) => i !== 'en_attente').length;
      return {
        situation,
        prevues: liste.length,
        recues: retards.length,
        sous30,
        partSous30: terminees > 0 ? sous30 / terminees : null,
        medianeS: mediane(retards),
        maxS: retards.length > 0 ? Math.max(...retards) : null,
        echecs: issues.filter(estEchec).length,
      };
    })
    .sort((x, y) => x.situation.localeCompare(y.situation, 'fr'));
}

export type Zone = 'insuffisant' | 'web_app' | 'prolonger' | 'natif';

/** Règle de la spécification, section 8 : séries classiques, situations normales, alertes terminées. */
export function regleTroisZones(alertes: AlerteLue[], maintenantMs: number): { n: number; echecs: number; zone: Zone } {
  const issues = alertes
    .filter((a) => a.series.type === 'serie' && a.series.format === 'classique' && !estHorsRegle(a.series.situation))
    .map((a) => issue(a, maintenantMs))
    .filter((i) => i !== 'en_attente' && i !== 'annulee');
  const echecs = issues.filter(estEchec).length;
  const n = issues.length;
  const zone: Zone =
    echecs >= 8 ? 'natif' : n < MIN_ALERTES_REGLE ? 'insuffisant' : echecs <= 2 ? 'web_app' : 'prolonger';
  return { n, echecs, zone };
}

export type SerieEnAttente = { serieId: string; situation: string; restantes: number };

export function seriesEnAttente(alertes: AlerteLue[]): SerieEnAttente[] {
  const parSerie = new Map<string, SerieEnAttente>();
  for (const a of alertes) {
    if (a.etat !== 'prevue') continue;
    const serie = parSerie.get(a.serie_id) ?? { serieId: a.serie_id, situation: a.series.situation, restantes: 0 };
    serie.restantes += 1;
    parSerie.set(a.serie_id, serie);
  }
  return [...parSerie.values()];
}
```

- [ ] **Étape 4 : vérifier qu'ils passent**

Lancer : `npm test`
Attendu : 34 tests réussis.

- [ ] **Étape 5 : commit**

```bash
git add src/lib/stats.ts src/lib/stats.test.ts
git commit -m "feat: statistiques par situation et règle en trois zones"
```

## Tâche 16 : séries, annulation et tableau des résultats

*Explication pour Abdallah : les boutons de la campagne (série, série longue, annulation) et le tableau des résultats, avec en tête le compteur de la règle de décision.*

**Fichiers :** modifier `src/api.ts` ; créer `src/composants/Resultats.tsx` ; remplacer `src/composants/Tests.tsx` et `src/App.tsx`.

- [ ] **Étape 1 : ajouter `annulerSerie`** à la fin de `src/api.ts`

```ts
export async function annulerSerie(serieId: string): Promise<{ annulees: number; trop_tard: number }> {
  const { data, error } = await supabase.rpc('annuler_serie', { p_serie: serieId });
  if (error) throw new Error(error.message);
  return (data as { annulees: number; trop_tard: number }[])[0];
}
```

- [ ] **Étape 2 : remplacer `src/composants/Tests.tsx`**

```tsx
import { useState } from 'react';
import { annulerSerie, programmer } from '../api';
import { SITUATIONS, seriesEnAttente } from '../lib/stats';
import type { AlerteLue, FormatSerie, TypeSerie } from '../lib/types';

type Props = { alertes: AlerteLue[]; auChangement: () => Promise<void> };

export function Tests({ alertes, auChangement }: Props) {
  const [situation, setSituation] = useState<string>(SITUATIONS[0]);
  const [precision, setPrecision] = useState('');
  const [format, setFormat] = useState<FormatSerie>('classique');
  const [message, setMessage] = useState<string | null>(null);
  const [occupe, setOccupe] = useState(false);

  async function agir(action: () => Promise<string>) {
    setOccupe(true);
    setMessage(null);
    try {
      setMessage(await action());
      await auChangement();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setOccupe(false);
    }
  }

  const lancer = (type: TypeSerie, situationChoisie: string, formatChoisi: FormatSerie) =>
    agir(async () => {
      await programmer(type, situationChoisie, formatChoisi);
      return 'Programmé. Mets le téléphone dans la situation choisie.';
    });

  const annuler = (serieId: string) =>
    agir(async () => {
      const r = await annulerSerie(serieId);
      return `${r.annulees} alerte(s) annulée(s), ${r.trop_tard} déjà en cours d'envoi.`;
    });

  const situationFinale =
    situation === 'autre' ? `autre : ${precision.trim().slice(0, 40) || 'sans précision'}` : situation;
  const enAttente = seriesEnAttente(alertes);

  return (
    <section>
      <h2>Tests</h2>
      <button disabled={occupe} onClick={() => lancer('rapide', 'test rapide', 'classique')}>
        Test rapide (1 min)
      </button>

      <h3>Série de 10 alertes (3 à 25 min d'écart)</h3>
      <label>
        Situation{' '}
        <select value={situation} onChange={(e) => setSituation(e.target.value)}>
          {SITUATIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      {situation === 'autre' && (
        <input
          placeholder="Précise, en 40 caractères"
          value={precision}
          maxLength={40}
          onChange={(e) => setPrecision(e.target.value)}
        />
      )}
      <label>
        Format{' '}
        <select value={format} onChange={(e) => setFormat(e.target.value as FormatSerie)}>
          <option value="classique">classique</option>
          <option value="declaratif">déclaratif (comparaison)</option>
        </select>
      </label>
      <div>
        <button disabled={occupe} onClick={() => lancer('serie', situationFinale, format)}>
          Lancer la série
        </button>
        <button disabled={occupe} onClick={() => lancer('longue', 'série longue', 'classique')}>
          Série longue (J+7, J+14)
        </button>
      </div>

      {enAttente.length > 0 && (
        <>
          <h3>En attente</h3>
          <ul className="liste">
            {enAttente.map((s) => (
              <li key={s.serieId}>
                {s.situation} · {s.restantes} alerte(s) à venir{' '}
                <button disabled={occupe} onClick={() => annuler(s.serieId)}>
                  Annuler
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      {message && <p>{message}</p>}
    </section>
  );
}
```

- [ ] **Étape 3 : écrire `src/composants/Resultats.tsx`**

```tsx
import { formaterPart, formaterSecondes } from '../lib/format';
import { MIN_ALERTES_REGLE, regleTroisZones, statsParSituation, type Zone } from '../lib/stats';
import type { AlerteLue } from '../lib/types';

const ZONES: Record<Zone, string> = {
  insuffisant: 'mesure en cours',
  web_app: 'on reste en web app',
  prolonger: 'on prolonge la mesure',
  natif: "on envisage l'app native",
};

export function Resultats({ alertes }: { alertes: AlerteLue[] }) {
  const maintenant = Date.now();
  const regle = regleTroisZones(alertes, maintenant);
  const lignes = statsParSituation(alertes, maintenant);
  if (lignes.length === 0) return null;
  return (
    <section>
      <h2>Résultats</h2>
      <p className="zone">
        Règle : {regle.echecs} échec(s) sur {regle.n} alerte(s), objectif {MIN_ALERTES_REGLE} → {ZONES[regle.zone]}
      </p>
      <div className="table-defilante">
        <table>
          <thead>
            <tr>
              <th>Situation</th>
              <th>Prévues</th>
              <th>Reçues</th>
              <th>≤ 30 s</th>
              <th>Médiane</th>
              <th>Max</th>
              <th>Échecs</th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((l) => (
              <tr key={l.situation}>
                <td>{l.situation}</td>
                <td>{l.prevues}</td>
                <td>{l.recues}</td>
                <td>{formaterPart(l.partSous30)}</td>
                <td>{formaterSecondes(l.medianeS)}</td>
                <td>{formaterSecondes(l.maxS)}</td>
                <td>{l.echecs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
```

- [ ] **Étape 4 : dans `src/App.tsx`**, remplacer le bloc affiché quand `pret` est vrai par :

```tsx
      {pret && (
        <>
          <Etat />
          <Tests alertes={alertes} auChangement={recharger} />
          <Resultats alertes={alertes} />
          <ListeAlertes alertes={alertes} />
        </>
      )}
```

et ajouter l'import :

```tsx
import { Resultats } from './composants/Resultats';
```

- [ ] **Étape 5 : vérifier**

Lancer : `npm test && npm run build`
Attendu : 34 tests réussis, construction sans erreur.

- [ ] **Étape 6 : commit**

```bash
git add src
git commit -m "feat: séries, annulation et tableau des résultats"
```

## Tâche 17 : vérifier le format déclaratif

*Explication pour Abdallah : le format déclaratif est récent et mal documenté. On relit sa définition officielle pour s'assurer que nos champs sont acceptés, avant de lancer la série de comparaison.*

**Fichiers :** éventuellement `supabase/functions/envoyer/outils.ts` et `outils.test.ts`.

- [ ] **Étape 1 : lire l'explicatif** https://github.com/WebKit/explainers/blob/main/DeclarativeWebPush/README.md avec le navigateur intégré, et relever la liste exacte des champs admis dans `notification`, ainsi que l'emplacement de `mutable`.
- [ ] **Étape 2 : comparer avec `construireCharge`.** Si `data` n'est pas admis dans `notification`, le retirer (le service worker retrouve alors l'alerte dans l'adresse `navigate`, déjà testé) et mettre à jour le test « construit une charge déclarative modifiable ». Si `mutable` doit être placé ailleurs, le déplacer.
- [ ] **Étape 3 : si un changement a été fait**, lancer `npm test`, puis redéployer avec `npx supabase functions deploy envoyer --no-verify-jwt --use-api`, et faire un commit :

```bash
git add supabase/functions/envoyer
git commit -m "fix: charge déclarative conforme à l'explicatif WebKit"
```

Sinon, noter « conforme » dans le compte rendu à Abdallah.

## Tâche 18 : attaque sur les plafonds et contrôle de sécurité

*Explication pour Abdallah : on vérifie qu'un compte ne peut pas programmer plus de 30 alertes, puis tu regardes le rapport de sécurité automatique de Supabase.*

**Fichiers :** modifier `tests/distant/attaque.test.ts`.

- [ ] **Étape 1 : ajouter le test** à la fin de `tests/distant/attaque.test.ts`

```ts
describe('attaque : plafonds', () => {
  it('limite à 30 alertes en attente par compte', async () => {
    const c = await connecte();
    const series: string[] = [];
    try {
      for (let i = 0; i < 3; i++) {
        const { data, error } = await c.rpc('programmer', { p_type: 'serie', p_situation: 'test attaque', p_format: 'classique' });
        if (error) throw error;
        series.push(data as string);
      }
      const { error } = await c.rpc('programmer', { p_type: 'rapide', p_situation: 'test attaque', p_format: 'classique' });
      expect(error?.message).toMatch(/plafond du compte/);
    } finally {
      for (const s of series) await c.rpc('annuler_serie', { p_serie: s });
    }
  });
});
```

- [ ] **Étape 2 : lancer**

Lancer : `npm run test:distant`
Attendu : 42 tests réussis.

- [ ] **Étape 3 [Abdallah] : Security Advisor.** Tableau de bord Supabase › Advisors › Security Advisor. Me recopier les alertes affichées. Une alerte « RLS enabled, no policy » sur les tables du schéma `prive` est attendue et voulue : ces tables ne doivent être lues par personne côté client. Toute autre alerte se corrige avant de continuer.
- [ ] **Étape 4 : commit**

```bash
git add tests/distant/attaque.test.ts
git commit -m "test: attaque sur le plafond d'alertes par compte"
```

## Tâche 19 : protocole de campagne, mise en ligne et test 0.c

*Explication pour Abdallah : une page de protocole pour mener la mesure sans y penser, puis le premier lancement réel d'une série.*

**Fichiers :** créer `docs/campagne-notifications.md` ; modifier `docs/passation.md`.

- [ ] **Étape 1 : écrire `docs/campagne-notifications.md`**

```markdown
# Campagne de mesure des notifications

*Protocole de l'étape 0. Règle de décision : spécification, section 8.*

## Principe

Chaque série programme 10 alertes, séparées par 3 à 25 minutes. On choisit la situation avant de lancer la série, on met le téléphone dans cette situation, et on n'y touche plus pendant environ deux heures. Le tableau se remplit tout seul.

Pour que les mesures soient indépendantes, **une série par jour au plus**, à des heures variées.

## Programme

| Jour | Série | Préparation du téléphone |
|---|---|---|
| 1 | verrouillé | Écran verrouillé, posé, Wi-Fi et réseau mobile actifs |
| 2 | Concentration, app autorisée | Réglages › Concentration › choisir un mode › Apps › ajouter L'Exil, puis activer ce mode |
| 3 | économie d'énergie | Centre de contrôle › mode économie d'énergie |
| 4 | Wi-Fi seul | Données cellulaires coupées |
| 5 | réseau mobile seul | Wi-Fi coupé |
| 6 | Concentration, app non autorisée | Mode Concentration sans L'Exil ; après la série, noter combien d'alertes sont visibles dans le centre de notifications |
| 7 | déclaratif | Situation « verrouillé », format « déclaratif » |
| 8 | app ouverte à l'écran | L'Exil ouverte, écran allumé |
| Une fois | série longue | Lancer au jour 1 ; ouvrir l'app ou le tableau de bord Supabase au moins une fois par semaine, sinon le projet gratuit se met en pause |
| Une fois | autre : redémarrage | Lancer une série, puis redémarrer le téléphone après la première alerte |
| Une fois | autre : hors ligne | Lancer un test rapide, passer en mode avion aussitôt, le couper 5 minutes plus tard |

Ensuite, relancer les situations normales jusqu'à atteindre 100 alertes comptées dans la règle. Les amis prolongeront la mesure quand ils installeront le prototype jouable.

## Lire le tableau

- **Reçues** : le téléphone a accusé réception. En mode Concentration, reçue ne veut pas dire affichée.
- **≤ 30 s** : part des alertes terminées reçues en moins de 30 secondes.
- **Échecs** : alertes perdues, échouées ou reçues avec plus de 30 s de retard.
- **Règle** : compte uniquement les séries classiques en situations normales.

## Exporter les données pour R

Tableau de bord Supabase › Table Editor › `alertes` › Export › CSV. Ou, depuis le projet :

    npm run sql -- "select a.*, s.situation, s.format, s.type from public.alertes a join public.series s on s.id = a.serie_id order by a.prevue_a"

## À la fin de la campagne

Changer le secret partagé, qui a transité par la file de pg_net :

1. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` → nouveau secret ;
2. `npx supabase secrets set ENVOI_SECRET=<nouveau secret>` ;
3. `npm run sql -- "select vault.update_secret((select id from vault.secrets where name = 'envoi_secret'), '<nouveau secret>')"`.

Pour tout arrêter d'un coup : `npm run sql -- "update prive.config set envoi_actif = false"`.
```

- [ ] **Étape 2 : mettre à jour `docs/passation.md`.** Dans « Ordre de travail », à la fin du point 3 (étape 0), ajouter : « *Construite le JJ/MM/2026 ; campagne en cours, protocole dans `docs/campagne-notifications.md`.* », avec la date du jour.
- [ ] **Étape 3 : relecture finale** par un agent `code-reviewer` (modèle `sonnet`) sur le diff de la phase 0.c. Corriger ce qui est bloquant.
- [ ] **Étape 4 : commit et mise en ligne**

```bash
git add docs/campagne-notifications.md docs/passation.md
git commit -m "docs: protocole de la campagne de mesure des notifications"
git push
```

- [ ] **Étape 5 [Abdallah] : test 0.c sur l'iPhone.** Rouvrir L'Exil. Lancer la série « verrouillé » (jour 1) et la série longue. Lancer aussi un test rapide puis l'annuler aussitôt.
  Attendu : le test rapide annulé n'arrive jamais et apparaît « annulée » ; les alertes de la série arrivent une à une ; le tableau et le compteur de la règle se remplissent.

**Point d'arrêt : étape 0 terminée. La campagne tourne en fond ; l'étape suivante est la spécification du prototype jouable et social.**
