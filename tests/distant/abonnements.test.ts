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
