import { spawnSync } from 'node:child_process';

process.loadEnvFile('.env.local');
const motDePasse = decodeURIComponent(new URL(process.env.DATABASE_URL).password);
const resultat = spawnSync('npx', ['supabase', 'db', 'push', '--linked', '--yes'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: { ...process.env, SUPABASE_DB_PASSWORD: motDePasse },
});
process.exit(resultat.status ?? 1);
