// Lune de sang en pixel art, fêlée et recollée à l'or. Dessin original, procédural.
// Utilisation : import { dessinerLune } pour obtenir une grille de couleurs, puis enPng() pour l'agrandir.
import { deflateSync } from 'node:zlib';

export const FOND = '#1d1a2b';

const PALETTE = {
  contour: '#140c10',
  halo1: '#3a1c26',
  halo2: '#2a1a28',
  tons: ['#4e1210', '#6f1b14', '#93281a', '#b53a1f', '#d25426', '#e8742e'],
  reflet: '#f5a441',
  or: '#d9b36c',
  orClair: '#f4dc98',
};

// Cratères : centre (x, y) et rayon, en pixels de la grille 32 × 32.
const CRATERES = [
  [12, 11, 2.6],
  [19, 9, 1.6],
  [21, 15, 2.2],
  [10, 18, 1.8],
  [16, 21, 2.4],
  [22, 21, 1.4],
  [14, 15, 1.2],
];

/** Hauteur de la fêlure (en y) à l'abscisse x : un zigzag à peu près horizontal, comme la barre d'un thêta. */
const FELURE = [
  [2, 16], [5, 15], [8, 17], [11, 16], [14, 17], [17, 15], [20, 16], [23, 17], [26, 15], [29, 16],
];

function hauteurFelure(x) {
  for (let i = 0; i < FELURE.length - 1; i++) {
    const [x0, y0] = FELURE[i];
    const [x1, y1] = FELURE[i + 1];
    if (x >= x0 && x <= x1) return Math.round(y0 + ((y1 - y0) * (x - x0)) / (x1 - x0));
  }
  return 16;
}

/**
 * options.felure : 'aucune' | 'fine' | 'epaisse'
 * options.decalage : décalage en pixels de la moitié basse (0 ou 1)
 */
export function dessinerLune({ felure = 'fine', decalage = 1, taille = 32 } = {}) {
  const c = (taille - 1) / 2;
  const R = taille * 0.36;
  const lumiere = [0.45, 0.55, 0.7];
  const norme = Math.hypot(...lumiere);
  const L = lumiere.map((v) => v / norme);

  const pixelLune = (x, y) => {
    const dx = x - c;
    const dy = y - c;
    const d = Math.hypot(dx, dy);
    if (d > R + 2.2) return null;
    if (d > R + 1.1) return PALETTE.halo2;
    if (d > R) return PALETTE.halo1;
    if (d > R - 1) return PALETTE.contour;
    const nz = Math.sqrt(Math.max(0, 1 - (d / R) ** 2));
    let intensite = (dx / R) * L[0] + (dy / R) * L[1] + nz * L[2];
    for (const [cx, cy, r] of CRATERES) {
      const dc = Math.hypot(x - cx, y - cy);
      if (dc <= r) intensite -= 0.22;
      else if (dc <= r + 0.9 && x - cx + (y - cy) > 0) intensite += 0.12;
    }
    if (d > R - 2.4 && dx + dy > R * 0.9) return PALETTE.reflet;
    const bande = Math.max(0, Math.min(PALETTE.tons.length - 1, Math.floor((intensite + 0.15) * 4.2)));
    return PALETTE.tons[bande];
  };

  const grille = [];
  for (let y = 0; y < taille; y++) {
    const ligne = [];
    for (let x = 0; x < taille; x++) {
      const sousFelure = felure !== 'aucune' && y > hauteurFelure(x);
      ligne.push(pixelLune(sousFelure ? x - decalage : x, y) ?? FOND);
    }
    grille.push(ligne);
  }

  if (felure !== 'aucune') {
    // Seulement à l'intérieur du contour : la fêlure ne déborde pas de la lune.
    const interieur = new Set(PALETTE.tons.concat(PALETTE.reflet));
    const peindre = (x, y, couleur) => {
      if (interieur.has(grille[y]?.[x])) grille[y][x] = couleur;
    };
    let precedent = hauteurFelure(0);
    for (let x = 0; x < taille; x++) {
      const y = hauteurFelure(x);
      peindre(x, y, PALETTE.or);
      if (y < precedent) peindre(x, y, PALETTE.orClair);
      if (felure === 'epaisse') peindre(x, y + 1, PALETTE.or);
      precedent = y;
    }
  }
  return grille;
}

const TABLE_CRC = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(octets) {
  let c = 0xffffffff;
  for (const o of octets) c = TABLE_CRC[(c ^ o) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function bloc(type, donnees) {
  const longueur = Buffer.alloc(4);
  longueur.writeUInt32BE(donnees.length);
  const corps = Buffer.concat([Buffer.from(type, 'ascii'), donnees]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(corps));
  return Buffer.concat([longueur, corps, crc]);
}
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** Agrandit la grille sans lissage (chaque pixel devient un carré) et la centre dans une image de `cote` pixels. */
export function enPng(grille, cote) {
  const n = grille.length;
  const echelle = Math.floor(cote / n);
  const marge = Math.floor((cote - echelle * n) / 2);
  const fond = rgb(FOND);
  const lignes = [];
  for (let y = 0; y < cote; y++) {
    const ligne = Buffer.alloc(1 + cote * 3);
    for (let x = 0; x < cote; x++) {
      const gx = Math.floor((x - marge) / echelle);
      const gy = Math.floor((y - marge) / echelle);
      const couleur = gx >= 0 && gy >= 0 && gx < n && gy < n ? rgb(grille[gy][gx]) : fond;
      ligne.set(couleur, 1 + x * 3);
    }
    lignes.push(ligne);
  }
  const entete = Buffer.alloc(13);
  entete.writeUInt32BE(cote, 0);
  entete.writeUInt32BE(cote, 4);
  entete[8] = 8;
  entete[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    bloc('IHDR', entete),
    bloc('IDAT', deflateSync(Buffer.concat(lignes))),
    bloc('IEND', Buffer.alloc(0)),
  ]);
}
