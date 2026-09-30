import { useState } from 'react';
import { programmer } from '../api';

type Props = { auChangement: () => Promise<void> };

export function Tests({ auChangement }: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [occupe, setOccupe] = useState(false);

  async function testRapide() {
    setOccupe(true);
    setMessage(null);
    try {
      await programmer('rapide', 'test rapide', 'classique');
      setMessage('Alerte programmée dans une minute. Verrouille le téléphone.');
      await auChangement();
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setOccupe(false);
    }
  }

  return (
    <section>
      <h2>Tests</h2>
      <button disabled={occupe} onClick={testRapide}>
        Test rapide (1 min)
      </button>
      {message && <p>{message}</p>}
    </section>
  );
}
