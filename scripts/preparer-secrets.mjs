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
