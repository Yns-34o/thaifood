'use client';

import { useCallback, useEffect, useState } from 'react';

// ============================================================================
//  Hook centralisé de récupération du menu — « Firebase-ready »
// ----------------------------------------------------------------------------
//  AUJOURD'HUI : fetch de /api/menu + polling léger (toutes les 15 s) pour
//  que les modifications du dashboard apparaissent sur le site sans recharger
//  la page manuellement.
//
//  POUR PASSER À FIREBASE : remplacez le corps de ce hook par un
//  `onSnapshot(collection(db, 'menu'), ...)` Firestore qui appelle setMenu.
//  Le composant Commander.js ne change pas (même interface de retour).
// ============================================================================

const POLL_MS = 15000;

export default function useMenu() {
  const [menu, setMenu] = useState({ categories: [], dishes: [], promos: [] });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/menu', { cache: 'no-store' });
      if (res.ok) setMenu(await res.json());
    } catch {
      /* réseau indisponible : on garde l'état précédent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refresh]);

  return {
    categories: menu.categories || [],
    dishes: menu.dishes || [],
    promos: menu.promos || [],
    loading,
    refresh,
  };
}
