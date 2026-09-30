import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import webpush from 'web-push';

const SECRETS = 'supabase/.env.secrets';
const COFFRE = 'supabase/.vault.sql';
const courriel = process.argv[2];

// Toutes les vérifications avant la moindre écriture.
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
if (!existsSync('.env.local')) {
  console.error('.env.local introuvable : copie .env.example en .env.local et remplis-le d’abord.');
  process.exit(1);
}

const reference = readFileSync('supabase/.temp/project-ref', 'utf8').trim();
const vapid = webpush.generateVAPIDKeys();
const secret = randomBytes(32).toString('hex');

const envLocal = readFileSync('.env.local', 'utf8').replace(/^VITE_VAPID_PUBLIC_KEY=.*\r?\n?/m, '');
writeFileSync('.env.local', `${envLocal.endsWith('\n') ? envLocal : `${envLocal}\n`}VITE_VAPID_PUBLIC_KEY=${vapid.publicKey}\n`);

writeFileSync(
  SECRETS,
  [`VAPID_PUBLIQUE=${vapid.publicKey}`, `VAPID_PRIVEE=${vapid.privateKey}`, `VAPID_SUJET=mailto:${courriel}`, `ENVOI_SECRET=${secret}`, ''].join('\n'),
);
// Remplace les secrets du coffre s'ils existent déjà : une régénération doit vraiment changer le secret.
writeFileSync(
  COFFRE,
  [
    `delete from vault.secrets where name in ('envoi_secret', 'envoi_url');`,
    `select vault.create_secret('${secret}', 'envoi_secret');`,
    `select vault.create_secret('https://${reference}.supabase.co/functions/v1/envoyer', 'envoi_url');`,
    '',
  ].join('\n'),
);

console.log(`Écrits : ${SECRETS}, ${COFFRE} et la clé publique dans .env.local (tous ignorés par git).`);
console.log(`Après l'avoir appliqué (tâche 12), supprime ${COFFRE} : le secret y est en clair.`);
console.log(`Clé publique, à copier dans Vercel sous VITE_VAPID_PUBLIC_KEY :\n${vapid.publicKey}`);
