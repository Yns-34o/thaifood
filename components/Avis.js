'use client';

import { useRef, useState } from 'react';
import useReveal from './useReveal';

const REVIEWS = [
  {
    stars: 5,
    text: 'Le meilleur restaurant thaï de la région, sans aucune hésitation. Le curry vert est une pure merveille, on sent que tout est fait maison. Le service est impeccable et l’ambiance chaleureuse.',
    name: 'Sophie L.',
    initials: 'SL',
    time: 'Il y a 2 semaines',
  },
  {
    stars: 5,
    text: 'J’ai découvert ce petit bijou grâce aux avis Google et je ne regrette pas. Le Pad Thaï est exactement comme ceux que j’ai mangé à Bangkok. Frais, parfumé, parfait.',
    name: 'Marc K.',
    initials: 'MK',
    time: 'Il y a 1 mois',
  },
  {
    stars: 4,
    text: 'Le Massaman de bœuf est à tomber. La viande fond littéralement en bouche, la sauce est incroyablement riche. Seul petit bémol : parfois un peu d’attente en soirée, mais ça vaut le coup.',
    name: 'Amina D.',
    initials: 'AD',
    time: 'Il y a 3 semaines',
  },
  {
    stars: 5,
    text: 'On y retourne chaque semaine avec ma femme. Le Tom Yum est le meilleur que j’ai goûté en France. Épicé comme il se doit, pas dilué pour les palais occidentaux. Merci Chef !',
    name: 'Philippe B.',
    initials: 'PB',
    time: 'Il y a 1 semaine',
  },
  {
    stars: 5,
    text: 'Le Mango Sticky Rice pour finir est une tuerie absolue. Le riz gluant est parfait, la mangue mûre à point. C’est mon endroit préféré du 77, je recommande à 200%.',
    name: 'Léa C.',
    initials: 'LC',
    time: 'Il y a 5 jours',
  },
  {
    stars: 4,
    text: 'Cadre épuré et moderne, service souriant et attentif. Le Som Tam est un vrai régal de fraîcheur. Rapport qualité-prix imbattable pour cette qualité de produits.',
    name: 'Julien R.',
    initials: 'JR',
    time: 'Il y a 2 mois',
  },
];

function Stars({ n }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <iconify-icon
          key={i}
          icon="solar:star-bold"
          className={`text-sm ${i <= n ? 'star-filled' : 'star-empty'}`}
        />
      ))}
    </div>
  );
}

export default function Avis() {
  const ref = useReveal();
  const trackRef = useRef(null);
  const [offset, setOffset] = useState(0);

  const slide = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild;
    if (!first) return;
    const step = first.getBoundingClientRect().width + 20; // 20 = gap-5
    const containerW = track.parentElement.getBoundingClientRect().width;
    const maxOffset = Math.max(0, track.scrollWidth - containerW);
    setOffset((prev) => Math.max(0, Math.min(prev + dir * step, maxOffset)));
  };

  return (
    <section
      ref={ref}
      id="avis"
      className="py-24 sm:py-32 relative overflow-hidden"
      style={{ backgroundColor: '#173A17' }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14">
          <div>
            <div className="reveal section-label mb-5">Témoignages</div>
            <h2 className="reveal reveal-delay-1 font-serif text-3xl sm:text-4xl md:text-5xl text-cream-50 tracking-tight">
              Ce qu&apos;ils <span className="italic text-gold-400">disent</span>
            </h2>
          </div>
          <div className="reveal reveal-delay-2 flex gap-2 mt-6 sm:mt-0">
            <button
              onClick={() => slide(-1)}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-400/40 hover:text-gold-400 transition-all text-cream-50/40"
              aria-label="Précédent"
            >
              <iconify-icon icon="solar:arrow-left-linear" />
            </button>
            <button
              onClick={() => slide(1)}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold-400/40 hover:text-gold-400 transition-all text-cream-50/40"
              aria-label="Suivant"
            >
              <iconify-icon icon="solar:arrow-right-linear" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="review-track flex gap-5"
            style={{ width: 'max-content', transform: `translateX(-${offset}px)` }}
          >
            {REVIEWS.map((r) => (
              <div
                key={r.name}
                className="w-[320px] sm:w-[380px] flex-shrink-0 bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6"
              >
                <Stars n={r.stars} />
                <p className="text-sm text-cream-50/60 font-light leading-relaxed mb-5">
                  “{r.text}”
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400/30 to-white/10 flex items-center justify-center text-xs font-medium text-gold-400">
                    {r.initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-cream-50">{r.name}</div>
                    <div className="text-[11px] text-cream-50/30">{r.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
