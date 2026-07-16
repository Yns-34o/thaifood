'use client';

import useReveal from './useReveal';

// Avis Google traduits et adaptés au restaurant.
const REVIEWS = [
  {
    stars: 5,
    text: "Petit restaurant sympa tout près de chez moi. J'ai pris des rouleaux pour goûter, c'était frais et très bon, j'ai adoré ❤️. La cheffe était accueillante et bienveillante.",
    name: 'Evelina Ganieva',
    initial: 'E',
    meta: 'Guide Local · 103 avis · Il y a 5 mois',
  },
  {
    stars: 5,
    text: "Une cuisine fantastique et des portions généreuses, préparées à la minute par la cheffe. Mon poke bowl au saumon était tout simplement délicieux !",
    name: 'François',
    initial: 'F',
    meta: 'Sur place · Déjeuner · Il y a 1 semaine',
  },
  {
    stars: 5,
    text: "Excellent 👌",
    name: 'Bouzid Bouchemla',
    initial: 'B',
    meta: 'Guide Local · 20 avis · Il y a 11 mois',
  },
];

function Stars({ n, size = 'text-base' }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} sur 5 étoiles`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <iconify-icon
          key={i}
          icon="solar:star-bold"
          className={`${size} ${i <= n ? 'star-filled' : 'star-empty'}`}
        />
      ))}
    </div>
  );
}

export default function Avis() {
  const ref = useReveal();

  return (
    <section
      ref={ref}
      id="avis"
      className="py-24 sm:py-32 relative overflow-hidden"
      style={{ backgroundColor: '#173A17' }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* En-tête + note moyenne */}
        <div className="text-center mb-14">
          <div className="reveal section-label mb-5">Avis Google</div>
          <h2 className="reveal reveal-delay-1 font-serif text-3xl sm:text-4xl md:text-5xl text-cream-50 tracking-tight max-w-3xl mx-auto leading-tight">
            Ce sont nos <span className="italic text-gold-400">clients</span> qui le disent
          </h2>

          <div className="reveal reveal-delay-2 mt-8 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 bg-white/[0.04] border border-white/[0.07] rounded-full pl-2.5 pr-5 py-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.06]">
              <iconify-icon icon="logos:google-icon" className="text-sm" />
            </span>
            <span className="flex items-baseline gap-1">
              <span className="font-serif text-2xl text-gold-400 leading-none">4,7</span>
              <span className="text-xs text-cream-50/40">/ 5</span>
            </span>
            <span aria-hidden className="hidden sm:block w-1 h-1 rounded-full bg-cream-50/20" />
            <Stars n={5} size="text-sm" />
            <span className="text-sm text-cream-50/60">Basé sur 463 avis Google</span>
          </div>
        </div>

        {/* Grille d'avis : 1 col (mobile) → 2 cols (sm) → 3 cols (lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <div
              key={r.name}
              className="reveal bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.06] hover:border-gold-400/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <Stars n={r.stars} />
              <p className="text-sm text-cream-50/70 font-light leading-relaxed my-4 min-h-[5rem]">
                “{r.text}”
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400/30 to-white/10 flex items-center justify-center text-xs font-medium text-gold-400 ring-1 ring-white/10">
                  {r.initial}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-cream-50 truncate">{r.name}</div>
                  <div className="text-[11px] text-cream-50/35 truncate">{r.meta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
