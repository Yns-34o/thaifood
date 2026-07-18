// ============================================================================
//  Mapping plat → photo Unsplash haute qualité
// ----------------------------------------------------------------------------
//  Pour chaque plat, on choisit une image appétissante basée sur :
//    - la catégorie (categoryId)
//    - le nom (protéine / variante : saumon, crevettes, bœuf, poulet, veg...)
//
//  Les IDs photo ci-dessous sont de VRAIES photos Unsplash, moissonnées sur
//  les pages de recherche unsplash.com (uniquement des IDs `images.unsplash.com`,
//  pas de premium/istock). Le CDN Unsplash sert ces images en haute résolution.
//
//  Le choix est DÉTERMINISTE (hash du nom) : un même plat garde toujours la
//  même image entre deux rendus, et deux plats d'une même catégorie prennent
//  des images différentes quand le pool le permet.
// ============================================================================

// Construit une URL CDN Unsplash à partir d'un id "photo-XXXX".
const U = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// Hash de chaîne simple et stable (pas de Math.random : rendu déterministe).
function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Choisit une URL déterministe dans un pool selon le nom du plat.
const pick = (pool, name) => U(pool[hash(name) % pool.length]);

// --- Pools d'images Unsplash (IDs vérifiés) ---------------------------------
const POOL = {
  // Pad thaï / nouilles sautées / stir-fry / plats du wok
  noodles: [
    '1559314809-0d155014e29e', '1707546944460-dda9069b9c1e',
    '1645500498403-970672caf43e', '1746973645769-c11eb0a81025',
    '1652957705092-b2f8d357c8a2', '1617093727343-374698b1b08d',
    '1626804475297-41608ea09aeb', '1626804475315-9644b37a2fe4',
    '1718964313403-2db158f67844', '1637806930600-37fa8892069d',
  ],
  padSeeEw: [
    '1628430043154-290c67c19550', '1628404451189-42d3d61c79c9',
    '1516684902511-1e07238471ad', '1585417791023-a5a6164b2646',
    '1586128743915-ec7788189715',
  ],
  bowl: [
    '1725210271586-55f97663519a', '1564675454013-6e68e6a8c0c6',
    '1559847844-5315695dadae', '1554054204-b2f70b09d031',
  ],
  shrimp: [
    '1559314809-0d155014e29e', '1652957705092-b2f8d357c8a2',
    '1607247098789-6a43ebeaba4e',
  ],
  salmon: [
    '1519708227418-c8fd9a32b7a2', '1614627293113-e7e68163d958',
    '1559058789-672da06263d8', '1599084993091-1cb5c0721cc6',
    '1499125562588-29fb8a56b5d5',
  ],
  // Sushi / maki / california / rolls / spécialités japonaises
  sushi: [
    '1611143669185-af224c5e3252', '1579584425555-c3ce17fd4351',
    '1607247098731-5bf6416d2e8c', '1562158074-d49fbeffcc91',
    '1568899466260-b6d4e061856f', '1512132411229-c30391241dd8',
  ],
  maki: [
    '1607247098731-5bf6416d2e8c', '1512132411229-c30391241dd8',
    '1562158074-d49fbeffcc91', '1607246749144-7bc0e401623c',
    '1568899466260-b6d4e061856f',
  ],
  sashimi: [
    '1607246749144-7bc0e401623c', '1562158074-d49fbeffcc91',
    '1519708227418-c8fd9a32b7a2',
  ],
  // Entrées frites / beignets / rouleaux
  springRolls: [
    '1515022376298-7333f33e704b', '1623253083987-26681ce4a992',
    '1560162071-da4c4a91077a', '1606525437679-037aca74a3e9',
    '1695712641569-05eee7b37b6d',
  ],
  gyoza: [
    '1589047133481-02b4a5327d89', '1663858636859-8e528b323555',
    '1589047133531-570405874c6a', '1657422779024-fea66fec80cd',
    '1534422298391-e4f8c172dddb',
  ],
  tempura: [
    '1673238104258-38b63f973848', '1673238110633-876516a993c9',
    '1711010344957-9d3e70e3cdad', '1570078362689-c57c33cca104',
  ],
  yakitori: [
    '1727281970324-4bda7bab3073', '1708597525178-6c302364f37c',
    '1727281970228-a5ae69599fd8', '1727281970223-d4895fd0872f',
    '1727281970348-c3c3b253c662',
  ],
  // Riz / viandes sautées
  friedRice: [
    '1603133872878-684f208fb84b', '1609570324378-ec0c4c9b6ba8',
    '1512058564366-18510be2db19', '1551326844-4df70f78d0e9',
    '1578160112054-954a67602b88',
  ],
  beef: [
    '1563379926898-05f4575a45d8', '1707056503922-91c9ebaf0774',
    '1599314250681-8e05113e0e1b', '1583778176607-7af2b4fe1bad',
    '1464500650248-1a4b45debb9f',
  ],
  chicken: [
    '1627662236973-4fd8358fa206', '1549759594-0d842f402b4d',
    '1600555379765-f82335a7b1b0', '1572269875715-391a71e6d188',
    '1670688866261-db6697858df8',
  ],
  // Curry / soupes / légumes
  curryGreen: [
    '1594756202469-9ff9799b2e4e', '1588166524941-3bf61a9c41db',
  ],
  curryRed: [
    '1567529854338-fc097b962123', '1518710339019-eee82fe8d97f',
  ],
  curry: [
    '1455619452474-d2be8b1e70cd', '1548943487-a2e4e43b4853',
    '1564675454013-6e68e6a8c0c6', '1554054204-b2f70b09d031',
    '1585937421612-70a008356fbe',
  ],
  soup: [
    '1675150277436-9c7348972c11', '1675150303909-1bb94e33132f',
    '1478749485505-2a903a729c63', '1628428798909-75a2d42a557e',
    '1707897687558-22bdecb2e1c7',
  ],
  veg: [
    '1588166524941-3bf61a9c41db', '1554054204-b2f70b09d031',
    '1645500498403-970672caf43e',
  ],
  // Salades / bols
  salad: [
    '1562565652-a0d8f0c59eb4', '1526318472351-c75fcf070305',
    '1581242335635-ce8631489ac5', '1562629609-49c10e58c2a6',
    '1546069901-ba9599a7e63c',
  ],
  poke: [
    '1597958792579-bd3517df6399', '1604259597308-5321e8e4789c',
    '1602881917445-0b1ba001addf', '1670816978291-a5cf23d87968',
    '1633862472152-e3873eb1b3ff',
  ],
  // Desserts
  tiramisu: [
    '1571877227200-a0d98ea607e9', '1639744211487-b27e3551b07c',
    '1707269388230-60ceceac3e6b', '1712262582493-01aa9ec5c7f8',
    '1710106519622-8c49d0bcff2f',
  ],
  mochi: [
    '1629984164142-21c2039de926', '1635355347994-b79177b77e5c',
    '1696528431003-ff8d38196652', '1545217431-172646ec8de6',
    '1623133894375-ce20135ee521',
  ],
  mangoStickyRice: [
    '1711161988375-da7eff032e45', '1705234384751-84081009588e',
    '1705056508219-0aa0ceb16820', '1582801205465-c0d029e85a1c',
    '1695720247911-817755ad7d02',
  ],
  // Boissons
  drinks: [
    '1440402162950-9c29781fe736', '1565791929888-a0f817e81913',
    '1523920290228-4f321a939b4c', '1558160074-4d7d8bdf4256',
    '1461174106495-31e4ca6ed98a',
  ],
};

// --- Détection de la protéine / variante dans le nom du plat ---------------
const probe = (name, ...keys) => keys.some((k) => name.includes(k));

function proteinPool(name) {
  const n = name.toLowerCase();
  if (probe(n, 'saumon', 'thon')) return POOL.salmon;
  if (probe(n, 'crevette')) return POOL.shrimp;
  if (probe(n, 'boeuf', 'bœuf', 'filet', 'tigre')) return POOL.beef;
  if (probe(n, 'poulet', 'chicken', 'boulette')) return POOL.chicken;
  if (probe(n, 'veg', 'tofu', 'legume', 'légume', 'brocoli', 'choux')) return POOL.veg;
  return null;
}

// ============================================================================
//  API : unsplashFor(categoryId, name) -> URL Unsplash
// ============================================================================
export function unsplashFor(categoryId, name = '') {
  const n = name.toLowerCase();
  const prot = proteinPool(name); // variante protéine si détectée

  switch (categoryId) {
    // ---------------- Entrées ----------------
    case 'entrees': {
      if (probe(n, 'gyoza', 'ravioli')) return pick(POOL.gyoza, name);
      if (probe(n, 'tempura')) return pick(POOL.tempura, name);
      if (probe(n, 'yakitori', 'brochette')) return pick(POOL.yakitori, name);
      if (probe(n, 'samoussa', 'nem', 'nêm', 'rouleau', 'printemps', 'beignet', 'bouchée'))
        return pick(POOL.springRolls, name);
      if (probe(n, 'tartare')) return pick(POOL.sashimi, name);
      return pick(POOL.springRolls, name);
    }

    // ---------------- Salades ----------------
    // La base (salade) prime sur la protéine (simple garniture).
    case 'salades':
      return pick(POOL.salad, name);

    // ---------------- Soupes ----------------
    case 'soupes': {
      if (probe(n, 'miso')) return pick(POOL.soup, name);
      return pick(POOL.soup, name);
    }

    // ---------------- Menus (formules) ----------------
    case 'menus': {
      if (probe(n, 'yakitori', 'brochette')) return pick(POOL.yakitori, name);
      if (probe(n, 'enfant')) return pick(POOL.chicken, name);
      return pick(POOL.noodles, name);
    }

    // ---------------- Bowls / bobun ----------------
    case 'bobun':
      return pick(prot ? [...prot, ...POOL.poke] : POOL.poke, name);

    // ---------------- Nouilles ----------------
    // La base (nouilles) prime sur la protéine : on montre un plat de nouilles.
    case 'pad-thai':
      return pick(POOL.noodles, name);
    case 'pad-see-yui':
      return pick(POOL.padSeeEw, name);
    case 'nouilles-sautees':
      return pick(POOL.noodles, name);

    // ---------------- Riz ----------------
    case 'khao-prat':
      return pick(POOL.friedRice, name);
    case 'riz':
      return pick(POOL.friedRice, name);

    // ---------------- Loc lac (bœuf/viande sautée) ----------------
    case 'loc-lac':
      return pick(POOL.beef, name);

    // ---------------- Crevettes ----------------
    case 'crevettes': {
      if (probe(n, 'curry-vert', 'vert')) return pick(POOL.curryGreen, name);
      if (probe(n, 'rouge')) return pick(POOL.curryRed, name);
      return pick([...POOL.shrimp, ...POOL.curry], name);
    }

    // ---------------- Spécialités bœuf ----------------
    case 'specialites-boeuf': {
      if (probe(n, 'curry-vert', 'vert')) return pick(POOL.curryGreen, name);
      if (probe(n, 'curry-rouge', 'rouge')) return pick(POOL.curryRed, name);
      if (probe(n, 'oignon', 'basilic', 'champignon', 'satée', 'filet', 'tigre'))
        return pick(POOL.beef, name);
      return pick(POOL.beef, name);
    }

    // ---------------- Spécialités poulet ----------------
    case 'specialites-poulet': {
      if (probe(n, 'curry-vert', 'vert')) return pick(POOL.curryGreen, name);
      if (probe(n, 'curry-rouge', 'rouge')) return pick(POOL.curryRed, name);
      if (probe(n, 'croustillant', 'pané', 'crispy')) return pick(POOL.chicken, name);
      return pick(POOL.chicken, name);
    }

    // ---------------- Spécialités thaï (saumon, dorade) ----------------
    case 'specialites-thai':
      return pick(POOL.salmon, name);

    // ---------------- Japonais : maki & rolls ----------------
    case 'maki':
    case 'saumon-roll':
    case 'eggs-roll':
    case 'crispy-roll':
    case 'california-frits':
    case 'ice-rolls':
    case 'maki-printemps':
    case 'california':
    case 'avocats-roll':
      return pick(POOL.maki, name);

    case 'sushi':
      return pick(POOL.sushi, name);
    case 'sashimi':
      return pick(POOL.sashimi, name);
    case 'chirashi':
    case 'poke':
      return pick(POOL.poke, name);
    case 'specialite-japonaise':
    case 'menu-japonais':
      return pick([...POOL.sushi, ...POOL.maki], name);

    // ---------------- Desserts ----------------
    case 'desserts': {
      if (probe(n, 'tiramisu')) return pick(POOL.tiramisu, name);
      if (probe(n, 'mochi')) return pick(POOL.mochi, name);
      if (probe(n, 'mangue', 'riz gluant', 'tapioca', 'perles', 'coco'))
        return pick(POOL.mangoStickyRice, name);
      if (probe(n, 'chocolat', 'fondant', 'gateau', 'gâteau', 'flan'))
        return pick(POOL.mochi, name);
      return pick([...POOL.mochi, ...POOL.mangoStickyRice], name);
    }

    // ---------------- Boissons ----------------
    case 'boissons':
      return pick(POOL.drinks, name);

    default:
      return pick(POOL.noodles, name);
  }
}

// Exporté pour les éventuels tests / réutilisations.
export { POOL, U };
