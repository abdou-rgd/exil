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
