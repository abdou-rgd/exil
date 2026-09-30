import { formaterPart, formaterSecondes } from '../lib/format';
import { MIN_ALERTES_REGLE, regleTroisZones, statsParSituation, type Zone } from '../lib/stats';
import type { AlerteLue } from '../lib/types';

const ZONES: Record<Zone, string> = {
  insuffisant: 'mesure en cours',
  web_app: 'on reste en web app',
  prolonger: 'on prolonge la mesure',
  natif: "on envisage l'app native",
};

export function Resultats({ alertes }: { alertes: AlerteLue[] }) {
  const maintenant = Date.now();
  const regle = regleTroisZones(alertes, maintenant);
  const lignes = statsParSituation(alertes, maintenant);
  if (lignes.length === 0) return null;
  return (
    <section>
      <h2>Résultats</h2>
      <p className="zone">
        Règle : {regle.echecs} échec(s) sur {regle.n} alerte(s), objectif {MIN_ALERTES_REGLE} → {ZONES[regle.zone]}
      </p>
      <div className="table-defilante">
        <table>
          <thead>
            <tr>
              <th>Situation</th>
              <th>Prévues</th>
              <th>Reçues</th>
              <th>≤ 30 s</th>
              <th>Médiane</th>
              <th>Max</th>
              <th>Échecs</th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((l) => (
              <tr key={l.situation}>
                <td>{l.situation}</td>
                <td>{l.prevues}</td>
                <td>{l.recues}</td>
                <td>{formaterPart(l.partSous30)}</td>
                <td>{formaterSecondes(l.medianeS)}</td>
                <td>{formaterSecondes(l.maxS)}</td>
                <td>{l.echecs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
