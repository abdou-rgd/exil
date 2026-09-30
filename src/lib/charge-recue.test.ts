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
