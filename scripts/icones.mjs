// Icônes de l'app : la lune de sang en pixel art, fêlure d'or sans décalage (variante D retenue le 30/09/2026).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dessinerLune, enPng } from './lune-pixel.mjs';

const lune = dessinerLune({ felure: 'fine', decalage: 0 });

mkdirSync('public', { recursive: true });
for (const [nom, cote] of [['icone-192.png', 192], ['icone-512.png', 512], ['apple-touch-icon.png', 180]]) {
  writeFileSync(`public/${nom}`, enPng(lune, cote));
}
console.log('Icônes écrites dans public/.');
