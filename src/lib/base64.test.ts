import { describe, expect, it } from 'vitest';
import { base64UrlVersOctets } from './base64';

describe('base64UrlVersOctets', () => {
  it('décode du base64url sans remplissage', () => {
    expect(Array.from(base64UrlVersOctets('AQID_-8'))).toEqual([1, 2, 3, 255, 239]);
  });
});
