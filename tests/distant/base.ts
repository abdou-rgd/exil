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
