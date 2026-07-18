// ============================================================================
//  Slug + dédoublonnage partagés
// ----------------------------------------------------------------------------
//  Utilisé À LA FOIS par build-menu.mjs (pour l'id de chaque plat) et par
//  fetch-menu-images.mjs (pour le nom du fichier image local). Centraliser ici
//  garantit que l'id du plat et le nom du fichier image restent toujours
//  alignés (sinon les images locales ne correspondraient plus aux plats).
// ============================================================================

// Slug stable à partir d'un nom (ex: "M3 · Avocat Saumon" -> "m3-avocat-saumon").
export function slug(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // retire les diacritiques (accents décomposés)
    .replace(/œ/g, 'oe')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Renvoie un slug unique par nom, dans l'ordre du tableau d'entrée.
// Les doublons reçoivent un suffixe -2, -3… (ex: deux "Jus De Fruit Asiatique"
// -> "jus-de-fruit-asiatique" puis "jus-de-fruit-asiatique-2").
export function assignSlugs(names) {
  const used = new Set();
  return names.map((name) => {
    const base = slug(name);
    let id = base;
    let n = 2;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id);
    return id;
  });
}
