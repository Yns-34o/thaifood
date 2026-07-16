// ============================================================================
//  LOGIQUE DE PRIX / PROMOS — partagée entre site public et dashboard
// ----------------------------------------------------------------------------
//  Une promo peut s'appliquer :
//    - globalement (scope = 'global')            -> à tous les plats
//    - par catégorie (scope = 'category')        -> à tous les plats d'une catégorie
//    - par plat (scope = 'dish')                 -> à un plat précis
//  Type : 'percent' (ex value=20 => -20%) ou 'fixed' (value = nouveau prix €).
//
//  Priorité quand plusieurs promos s'appliquent au même plat :
//    par plat  >  par catégorie  >  globale   (la plus spécifique gagne).
// ============================================================================

export function getApplicablePromo(dish, promos) {
  const active = (promos || []).filter((p) => p.active !== false);
  return (
    active.find((p) => p.scope === 'dish' && p.targetId === dish.id) ||
    active.find((p) => p.scope === 'category' && p.targetId === dish.categoryId) ||
    active.find((p) => p.scope === 'global') ||
    null
  );
}

// Applique une promo à un prix. Renvoie le prix final + infos d'affichage.
export function applyPromo(price, promo) {
  const originalPrice = Number(price) || 0;
  if (!promo) return { finalPrice: originalPrice, hasPromo: false, originalPrice };

  let finalPrice = originalPrice;
  if (promo.type === 'percent') {
    const pct = Math.max(0, Math.min(100, Number(promo.value) || 0));
    finalPrice = Math.round((originalPrice * (1 - pct / 100)) * 100) / 100;
  } else if (promo.type === 'fixed') {
    finalPrice = Math.max(0, Number(promo.value) || 0);
  }
  return {
    finalPrice,
    hasPromo: finalPrice < originalPrice,
    originalPrice,
  };
}

// Raccourci : prix final d'un plat étant donné la liste des promos.
export function getEffectivePrice(dish, promos) {
  return applyPromo(dish.price, getApplicablePromo(dish, promos)).finalPrice;
}

// Texte d'affichage d'une promo (ex : "-20%" ou "12€").
export function promoLabel(promo) {
  if (!promo) return '';
  return promo.type === 'percent' ? `-${promo.value}%` : `${promo.value}€`;
}
