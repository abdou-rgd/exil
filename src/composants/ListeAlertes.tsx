import { formaterDate, formaterSecondes } from '../lib/format';
import { issue, retardSecondes, type Issue } from '../lib/stats';
import type { AlerteLue } from '../lib/types';

const LIBELLES: Record<Issue, string> = {
  reussie: 'reçue',
  en_retard: 'en retard',
  perdue: 'perdue',
  echouee: 'échouée',
  en_attente: 'en attente',
  annulee: 'annulée',
};

export function ListeAlertes({ alertes }: { alertes: AlerteLue[] }) {
  const maintenant = Date.now();
  if (alertes.length === 0) return null;
  return (
    <section>
      <h2>Détail des alertes</h2>
      <ul className="liste">
        {alertes.map((a) => (
          <li key={a.id}>
            {formaterDate(a.prevue_a)} · {a.series.situation}
            {a.series.format === 'declaratif' ? ' (déclaratif)' : ''} · <strong>{LIBELLES[issue(a, maintenant)]}</strong>
            {' · retard '}
            {formaterSecondes(retardSecondes(a))}
            {a.vue_a ? ' · vue' : ''}
            {a.code_apple !== null && a.code_apple >= 300 ? ` · code ${a.code_apple}` : ''}
          </li>
        ))}
      </ul>
    </section>
  );
}
