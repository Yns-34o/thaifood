'use client';

import { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import { formatPrice } from '../lib/pricing';

export default function Cart() {
  const { items, open, setOpen, updateQty, removeItem, count, total, checkout, lastOrder } =
    useCart();

  // Bloque le scroll du body quand le panier est ouvert.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Ferme avec la touche Echap.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={`cart-overlay fixed inset-0 z-[70] bg-black/60 ${open ? 'open' : ''}`}
      />

      <aside
        className={`cart-panel fixed top-0 right-0 z-[80] h-full w-full max-w-md bg-th-950 border-l border-white/10 flex flex-col ${
          open ? 'open' : ''
        }`}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <iconify-icon icon="solar:bag-3-linear" className="text-xl text-gold-400" />
            <h3 className="font-serif text-xl text-cream-50">Votre panier</h3>
            {count > 0 && (
              <span className="text-xs text-cream-50/40">({count})</span>
            )}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-cream-50/50 hover:text-gold-400 transition-colors"
            aria-label="Fermer le panier"
          >
            <iconify-icon icon="solar:close-circle-linear" className="text-2xl" />
          </button>
        </div>

        {/* Articles */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-20">
              <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <iconify-icon icon="solar:bag-3-linear" className="text-2xl text-cream-50/30" />
              </div>
              <p className="text-cream-50/40 font-light">Votre panier est vide.</p>
              <button
                onClick={() => setOpen(false)}
                className="cta-ghost px-5 py-2.5 rounded-full text-sm font-medium"
              >
                Découvrir la carte
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.name}
                  className="flex gap-4 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-cream-50 truncate">{item.name}</h4>
                      <button
                        onClick={() => removeItem(item.name)}
                        className="text-cream-50/30 hover:text-red-400 transition-colors"
                        aria-label="Retirer"
                      >
                        <iconify-icon icon="solar:trash-bin-trash-linear" />
                      </button>
                    </div>
                    <div className="text-xs text-gold-400 mt-0.5">{formatPrice(item.price)} l’unité</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.name, -1)}
                          className="w-7 h-7 rounded-full border border-white/10 text-cream-50/60 hover:border-gold-400/40 hover:text-gold-400 transition-all flex items-center justify-center"
                          aria-label="Diminuer"
                        >
                          <iconify-icon icon="solar:minus-linear" />
                        </button>
                        <span className="text-sm text-cream-50 w-5 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.name, 1)}
                          className="w-7 h-7 rounded-full border border-white/10 text-cream-50/60 hover:border-gold-400/40 hover:text-gold-400 transition-all flex items-center justify-center"
                          aria-label="Augmenter"
                        >
                          <iconify-icon icon="solar:add-linear" />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-cream-50">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pied : total + commande */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-white/[0.06] bg-th-900">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-cream-50/50">Total</span>
              <span className="font-serif text-2xl text-gold-400">{formatPrice(total)}</span>
            </div>
            <button
              onClick={checkout}
              className="cta-primary w-full py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
            >
              <iconify-icon icon="solar:cart-large-2-linear" className="text-base" />
              Commander
            </button>
            <p className="text-[11px] text-cream-50/30 text-center mt-3">
              Retrait sur place ou livraison dans le 77.
            </p>
          </div>
        )}
      </aside>

      {/* Confirmation de commande */}
      {lastOrder && (
        <div className="success-pop fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] max-w-sm w-[calc(100%-2rem)]">
          <div className="bg-th-900 border border-gold-400/30 rounded-2xl p-4 shadow-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-400/15 flex items-center justify-center flex-shrink-0">
              <iconify-icon icon="solar:check-circle-bold" className="text-gold-400 text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-cream-50">Commande confirmée !</div>
              <div className="text-xs text-cream-50/50 mt-0.5">
                Total {formatPrice(lastOrder.total)} · {lastOrder.date}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
