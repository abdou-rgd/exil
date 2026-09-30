import { describe, expect, it } from 'vitest';
import { decrireAppareil } from './plateforme';

describe('decrireAppareil', () => {
  it('lit Safari et la version annoncée d’iOS', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1';
    expect(decrireAppareil(ua)).toBe('Safari 26.0 · iOS annoncé 18.6');
  });
  it('se contente de la version d’iOS en mode installé', () => {
    const ua = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
    expect(decrireAppareil(ua)).toBe('iOS annoncé 17.4');
  });
  it('signale un appareil qui n’est pas d’Apple', () => {
    expect(decrireAppareil('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/140.0')).toBe('appareil non Apple');
  });
});
