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
