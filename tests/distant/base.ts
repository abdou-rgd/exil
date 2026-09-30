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
