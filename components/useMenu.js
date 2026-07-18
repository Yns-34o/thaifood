'use client';

import { useCallback, useEffect, useState } from 'react';
import staticMenu from '../data/menu.json';

// ============================================================================
//  Hook centralisé de récupération du menu — « Firebase-ready »
// ----------------------------------------------------------------------------
//  Le menu est EMBARQUÉ dans le bundle client (import de data/menu.json) :
//  les plats s'affichent IMMÉDIATEMENT, sans attendre /api/menu. Indispensable
//  sur les hébergements où l'API n'est pas disponible au runtime (statiques)
//  ou où la lecture du fichier JSON échoue (serverless non tracé).
//
//  En complément, on interroge /api/menu (polling léger toutes les 15 s) pour
//  récupérer les modifications live du dashboard QUAND l'API est disponible
//  (ex: VPS en `next start`). Si elle échoue, on conserve le menu embarqué.
//
//  POUR PASSER À FIREBASE : remplacez le corps de ce hook par un
//  `onSnapshot(collection(db, 'menu'), ...)` Firestore qui appelle setMenu.
//  Le composant Commander.js ne change pas (même interface de retour).
// ============================================================================

const POLL_MS = 15000;

export default function useMenu() {
  const [menu, setMenu] = useState(staticMenu);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/menu', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        // On ne remplace QUE si l'API renvoie réellement des données :
        // évite d'écraser le menu embarqué par une réponse vide (fs serverless).
        if (data && ((data.dishes && data.dishes.length) || (data.categories && data.categories.length))) {
          setMenu(data);
        }
      }
    } catch {
      /* API indisponible : on conserve le menu embarqué */
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
