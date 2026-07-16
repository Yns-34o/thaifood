'use client';

import { useState } from 'react';
import Img from './Img';
import useReveal from './useReveal';
import { useCart } from './CartContext';
import useMenu from './useMenu';
import { applyPromo, getApplicablePromo, promoLabel } from '../lib/pricing';

export default function Commander() {
  const ref = useReveal();
  const { addToCart } = useCart();
  const { categories, dishes, promos, loading } = useMenu();
  const [activeCat, setActiveCat] = useState('all');

  const cats = [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const visibleDishes = dishes
    .filter((d) => d.available !== false)
    .filter((d) => activeCat === 'all' || d.categoryId === activeCat)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <section
      ref={ref}
      id="commander"
      className="py-24 sm:py-32 relative"
      style={{ backgroundColor: '#112B11' }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="reveal section-label mb-5">Nos Signature</div>
          <h2 className="reveal reveal-delay-1 font-serif text-3xl sm:text-4xl md:text-5xl text-cream-50 tracking-tight">
            Commander en ligne
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-cream-50/40 font-light max-w-lg mx-auto">
            Nos plats les plus acclamés, préparés à la commande et prêts à être dégustés.
          </p>
        </div>

        {/* Filtres par catégorie */}
        {cats.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <FilterPill active={activeCat === 'all'} onClick={() => setActiveCat('all')}>
              Tout
            </FilterPill>
            {cats.map((c) => (
              <FilterPill
                key={c.id}
                active={activeCat === c.id}
                onClick={() => setActiveCat(c.id)}
              >
                {c.name}
              </FilterPill>
            ))}
          </div>
        )}

        {loading && visibleDishes.length === 0 ? (
          <p className="text-center text-cream-50/40 font-light">Chargement de la carte…</p>
        ) : visibleDishes.length === 0 ? (
          <p className="text-center text-cream-50/40 font-light">Aucun plat dans cette catégorie pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {visibleDishes.map((d, i) => (
              <DishCard
                key={d.id}
                dish={d}
                promos={promos}
                index={i}
                onAdd={() => {
                  const { finalPrice } = applyPromo(d.price, getApplicablePromo(d, promos));
                  addToCart(d.name, finalPrice, d.img);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
        active
          ? 'bg-gold-400 text-th-950 border-gold-400'
          : 'bg-white/[0.04] text-cream-50/60 border-white/[0.07] hover:text-cream-50 hover:border-gold-400/40'
      }`}
    >
      {children}
    </button>
  );
}

function DishCard({ dish, promos, index, onAdd }) {
  const promo = getApplicablePromo(dish, promos);
  const { finalPrice, hasPromo, originalPrice } = applyPromo(dish.price, promo);

  return (
    <div
      className={`dish-card reveal reveal-delay-${(index % 3) + 1} bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden group`}
    >
      <div className="relative h-52 sm:h-56 overflow-hidden">
        <Img src={dish.img} alt={dish.name} className="w-full h-full object-cover" />
        {hasPromo && (
          <div className="absolute top-3 right-3 bg-red-500/90 px-3 py-1 rounded-full">
            <span className="text-[11px] font-semibold text-white">Promo {promoLabel(promo)}</span>
          </div>
        )}
        {dish.tag && (
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
            <span className={`text-[11px] font-medium ${dish.tagClass || 'text-gold-400'}`}>
              {dish.tag}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-2 gap-3">
          <h3 className="font-serif text-lg text-cream-50">{dish.name}</h3>
          <div className="text-right whitespace-nowrap">
            {hasPromo && (
              <div className="text-xs text-cream-50/40 line-through">{originalPrice}€</div>
            )}
            <span className={`font-medium text-lg ${hasPromo ? 'text-red-300' : 'text-gold-400'}`}>
              {finalPrice}€
            </span>
          </div>
        </div>
        <p className="text-sm text-cream-50/40 font-light leading-relaxed mb-4">{dish.desc}</p>
        <button
          onClick={onAdd}
          className="plus-btn w-10 h-10 rounded-full border border-gold-400/30 text-gold-400 flex items-center justify-center text-xl"
          aria-label={`Ajouter ${dish.name} au panier`}
        >
          <iconify-icon icon="solar:add-circle-linear" />
        </button>
      </div>
    </div>
  );
}
