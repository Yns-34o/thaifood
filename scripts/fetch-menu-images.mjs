// ============================================================================
//  Téléchargement des VRAIES photos plats depuis thaifood77340.com
// ----------------------------------------------------------------------------
//  Pour chaque plat de scripts/menu-data.mjs, on télécharge la meilleure
//  résolution disponible et on la stocke localement dans public/uploads/menu/.
//
//  Stratégie (chaque plat) :
//    1. URL 360×240 (taille réellement servie par le site source, vraie photo)
//    2. sinon URL 60×40 (miniature d'origine — dernier recours authentique)
//    3. si les deux échouent / sont cassées -> aucune image locale téléchargée,
//       build-menu.mjs basculera automatiquement sur une photo Unsplash.
//
//  Sécurité de taille : on rejette les réponses trop petites (< 1500 o en 360,
//  < 500 o en 60) qui correspondent à des placeholders/GIF cassés du site.
//
//  Usage :  NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/fetch-menu-images.mjs
//  (le site source utilise un certificat dont la vérification de révocation
//   échoue sur Windows/schannel ; ce flag désactive la vérification TLS.)
// ============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dishes as dishData } from './menu-data.mjs';
import { assignSlugs } from './menu-slug.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'uploads', 'menu');
const CONCURRENCY = 8;
const TIMEOUT_MS = 25000;
const MIN_360 = 1500; // o — en dessous = placeholder/GIF cassé
const MIN_60 = 500;

fs.mkdirSync(OUT_DIR, { recursive: true });

const slugs = assignSlugs(dishData.map((d) => d.n));

// Construit la liste des tâches de téléchargement.
const tasks = dishData.map((d, i) => {
  const url60 = d.i; // ex: https://.../p1-60x40.png
  const ext = path.extname(url60).toLowerCase(); // .png | .jpg | .gif
  const url360 = url60.replace(/-60x40\./i, '-360x240.');
  return {
    slug: slugs[i],
    ext,
    url360,
    url60,
    name: d.n,
    cat: d.c,
    out: path.join(OUT_DIR, `${slugs[i]}${ext}`),
  };
});

// --- Téléchargement d'un plat avec chaîne de fallback -----------------------
async function downloadOne(t) {
  const attempts = [
    { url: t.url360, min: MIN_360, label: '360' },
    { url: t.url60, min: MIN_60, label: '60' },
  ];
  for (const a of attempts) {
    try {
      const res = await fetch(a.url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < a.min) continue; // trop petit = cassé/placeholder
      fs.writeFileSync(t.out, buf);
      return { ok: true, src: a.label, bytes: buf.length };
    } catch {
      /* essaye la fallback suivante */
    }
  }
  return { ok: false };
}

// --- Pool de concurrence ----------------------------------------------------
const results = new Array(tasks.length);
let cursor = 0;
let done = 0;

async function worker() {
  while (cursor < tasks.length) {
    const i = cursor++;
    results[i] = await downloadOne(tasks[i]);
    done++;
    if (done % 25 === 0 || done === tasks.length) {
      process.stdout.write(`\r  … ${done}/${tasks.length} traités`);
    }
  }
}

console.log(`Téléchargement de ${tasks.length} photos vers public/uploads/menu/ …`);
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
process.stdout.write('\n');

// --- Rapport ----------------------------------------------------------------
const ok = results.filter((r) => r.ok);
const missIdx = results
  .map((r, i) => (r.ok ? -1 : i))
  .filter((i) => i >= 0);

const c360 = ok.filter((r) => r.src === '360').length;
const c60 = ok.filter((r) => r.src === '60').length;

console.log(`✓ ${ok.length}/${tasks.length} photos téléchargées`);
console.log(`  → ${c360} en 360×240 (haute qualité source), ${c60} en 60×40 (fallback miniature)`);

if (missIdx.length) {
  console.log(`\n✗ ${missIdx.length} photo(s) indisponible(s) sur le site source — fallback Unsplash automatique :`);
  for (const i of missIdx) {
    console.log(`    [${tasks[i].cat}] ${tasks[i].name}`);
  }
}
