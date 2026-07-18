import { promises as fs } from 'fs';
import path from 'path';
import bundledMenu from '../data/menu.json';

// ============================================================================
//  COUCHE D'ACCÈS AUX DONNÉES — « Firebase-ready »
// ----------------------------------------------------------------------------
//  AUJOURD'HUI : lecture/écriture d'un fichier JSON local (data/menu.json).
//  Le site fonctionne immédiatement, sans aucune configuration externe.
//
//  Sécurité hébergement : data/menu.json est aussi importé (bundlé) pour que
//  l'API reste utilisable même si la lecture du fichier échoue au runtime
//  (ex: fonction serverless où le fichier n'est pas tracé/inclus). En local ou
//  sur VPS, fs.readFile reste prioritaire (et reflète les modifs du dashboard).
//
//  POUR PASSER À FIREBASE plus tard :
//  Remplacez UNIQUEMENT le contenu de ce fichier par des appels Firestore,
//  en conservant exactement les mêmes fonctions exportées
//  (getMenu, getDishes, getCategories, getPromos,
//   saveDish, deleteDish, saveCategory, deleteCategory,
//   savePromo, deletePromo).
//  -> Le reste du site (routes API, dashboard, affichage public) ne demande
//     AUCUNE autre modification.
//
//  Le temps réel côté visiteur est géré par le hook `components/useMenu.js`
//  (polling aujourd'hui, à remplacer par Firestore onSnapshot).
// ============================================================================

const DATA_FILE = path.join(process.cwd(), 'data', 'menu.json');

async function readData() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    // Fichier absent ou illisible (ex: serverless non tracé) : menu embarqué.
    return bundledMenu;
  }
}

async function writeData(data) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function genId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

// --- Lecture (publique) -----------------------------------------------------

export async function getMenu() {
  return readData();
}

export async function getDishes() {
  return (await readData()).dishes || [];
}

export async function getCategories() {
  return (await readData()).categories || [];
}

export async function getPromos() {
  return (await readData()).promos || [];
}

// --- Plats ------------------------------------------------------------------

export async function saveDish(dish) {
  const data = await readData();
  const next = { ...dish };
  if (!next.id) {
    next.id = genId('dish');
    next.order = typeof next.order === 'number' ? next.order : data.dishes.length;
    next.available = next.available !== false;
    data.dishes.push(next);
  } else {
    const i = data.dishes.findIndex((d) => d.id === next.id);
    if (i >= 0) data.dishes[i] = { ...data.dishes[i], ...next };
    else data.dishes.push(next);
  }
  await writeData(data);
  return next;
}

export async function deleteDish(id) {
  const data = await readData();
  data.dishes = data.dishes.filter((d) => d.id !== id);
  // On nettoie aussi les promos qui ciblaient ce plat.
  data.promos = (data.promos || []).filter(
    (p) => !(p.scope === 'dish' && p.targetId === id)
  );
  await writeData(data);
}

// --- Catégories -------------------------------------------------------------

export async function saveCategory(cat) {
  const data = await readData();
  const next = { ...cat };
  if (!next.id) {
    next.id = genId('cat');
    next.order = typeof next.order === 'number' ? next.order : data.categories.length;
    data.categories.push(next);
  } else {
    const i = data.categories.findIndex((c) => c.id === next.id);
    if (i >= 0) data.categories[i] = { ...data.categories[i], ...next };
    else data.categories.push(next);
  }
  await writeData(data);
  return next;
}

export async function deleteCategory(id) {
  const data = await readData();
  data.categories = data.categories.filter((c) => c.id !== id);
  await writeData(data);
}

// --- Promos -----------------------------------------------------------------

export async function savePromo(promo) {
  const data = await readData();
  data.promos = data.promos || [];
  const next = { ...promo };
  if (!next.id) {
    next.id = genId('promo');
    next.active = next.active !== false;
    data.promos.push(next);
  } else {
    const i = data.promos.findIndex((p) => p.id === next.id);
    if (i >= 0) data.promos[i] = { ...data.promos[i], ...next };
    else data.promos.push(next);
  }
  await writeData(data);
  return next;
}

export async function deletePromo(id) {
  const data = await readData();
  data.promos = (data.promos || []).filter((p) => p.id !== id);
  await writeData(data);
}
