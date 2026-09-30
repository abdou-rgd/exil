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

  it('ne livre une même tentative qu’à une seule exécution de la fonction', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      await creerAbonnement(c, uid);
      const a = await creerAlerte(c, await creerSerie(c, uid), uid, { etat: 'en_cours', tentatives: 1, priseIlYa: '1 second' });
      const premiere = await c.query('select * from prive.preparer_envoi($1)', [a.id]);
      const seconde = await c.query('select * from prive.preparer_envoi($1)', [a.id]);
      expect(premiere.rows).toHaveLength(1);
      expect(seconde.rows).toEqual([]);
    }));

  it('n’horodate pas de réponse d’Apple quand il n’y en a pas eu', () =>
    avecTransaction(async (c) => {
      const uid = await creerUtilisateur(c);
      const a = await creerAlerte(c, await creerSerie(c, uid), uid, { etat: 'en_cours', tentatives: 1, priseIlYa: '1 second' });
      await c.query('select prive.noter_reponse($1, 0, null)', [a.id]);
      expect(await lireAlerte(c, a.id)).toMatchObject({ etat: 'en_cours', code_apple: 0, reponse_apple_a: null });
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
