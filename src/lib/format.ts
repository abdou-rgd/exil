const DATE = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

export function formaterDate(iso: string | null): string {
  return iso ? DATE.format(new Date(iso)) : '—';
}

export function formaterSecondes(secondes: number | null): string {
  return secondes === null ? '—' : `${secondes.toFixed(1)} s`;
}

export function formaterPart(part: number | null): string {
  return part === null ? '—' : `${Math.round(part * 100)} %`;
}
