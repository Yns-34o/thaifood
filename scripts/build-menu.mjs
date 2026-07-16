// ============================================================================
//  Générateur de data/menu.json à partir de scripts/menu-data.mjs
// ----------------------------------------------------------------------------
//  Convertit les données compactes (catégories + plats) vers le schéma attendu
//  par le site : { categories: [{id,name,order}], dishes: [{id,name,price,
//  img,desc,tag,tagClass,categoryId,available,order}], promos: [] }
//
//  Usage :  node scripts/build-menu.mjs
// ============================================================================

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { categories as catData, dishes as dishData } from './menu-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'data', 'menu.json');

// Slug stable à partir d'un nom (ex: "M3 · Avocat Saumon" -> "m3-avocat-saumon").
function slug(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const categories = catData.map(([id, name], i) => ({
  id,
  name,
  order: i + 1,
}));

// S'assure de l'unicité des ids de plats (suffixe -2, -3… si nécessaire).
const usedIds = new Set();
const dishes = dishData.map((d, i) => {
  let base = slug(d.n);
  let id = base;
  let n = 2;
  while (usedIds.has(id)) {
    id = `${base}-${n++}`;
  }
  usedIds.add(id);

  return {
    id,
    name: d.n,
    price: d.p,
    img: d.i,
    desc: d.d || '',
    tag: '',
    tagClass: 'text-gold-400',
    categoryId: d.c,
    available: true,
    order: i + 1,
  };
});

const menu = { categories, dishes, promos: [] };

writeFileSync(OUT, JSON.stringify(menu, null, 2), 'utf-8');

// --- Rapport ---------------------------------------------------------------
const byCat = {};
for (const d of dishes) byCat[d.categoryId] = (byCat[d.categoryId] || 0) + 1;

console.log(`✓ menu.json généré : ${categories.length} catégories, ${dishes.length} plats`);
console.log('  Répartition :');
for (const c of categories) {
  console.log(`    ${c.name.padEnd(28)} ${byCat[c.id] || 0}`);
}
