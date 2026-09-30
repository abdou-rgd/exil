import { describe, expect, it } from 'vitest';
import { formaterPart, formaterSecondes } from './format';

describe('mise en forme', () => {
  it('écrit des secondes avec une décimale', () => {
    expect(formaterSecondes(4.26)).toBe('4.3 s');
    expect(formaterSecondes(null)).toBe('—');
  });
  it('écrit une proportion en pourcentage', () => {
    expect(formaterPart(0.957)).toBe('96 %');
    expect(formaterPart(null)).toBe('—');
  });
});
