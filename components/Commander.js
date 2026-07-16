'use client';

import Img from './Img';
import useReveal from './useReveal';
import { useCart } from './CartContext';

const DISHES = [
  {
    name: 'Pad Thaï Royal',
    price: 16,
    img: 'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=200&q=60',
    tag: 'Best-seller',
    tagClass: 'text-gold-400',
    desc: 'Nouilles de riz sautées au wok, crevettes tigrées, pousses de soja, cacahuètes torréfiées et citron vert.',
  },
  {
    name: 'Curry Vert Authentique',
    price: 18,
    img: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=200&q=60',
    tag: 'Piment 🌶️',
    tagClass: 'text-green-300',
    desc: 'Pâte de curry verte maison, lait de coco onctueux, aubergines thaïes, basilic sacré et poulet fermier.',
  },
  {
    name: 'Tom Yum Kung',
    price: 15,
    img: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=200&q=60',
    desc: 'Broth emblématique au citronnelle et galanga, crevettes géantes, champignons et huile de piment.',
  },
  {
    name: 'Massaman de Bœuf',
    price: 19,
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=60',
    tag: 'Chef’s pick',
    tagClass: 'text-gold-400',
    desc: 'Bœuf mijoté 4h, pomme de terre fondante, cacahuètes et épices massaman dans un lait de coco velouté.',
  },
  {
    name: 'Som Tam',
    price: 12,
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=60',
    tag: 'Frais & Piquant',
    tagClass: 'text-green-300',
    desc: 'Salade de papaye verte pilée au mortier, tomates cerises, haricots verts et piment frais.',
  },
  {
    name: 'Mango Sticky Rice',
    price: 10,
    img: 'https://images.unsplash.com/photo-1576798315244-78c12e91498b?w=600&q=80',
    thumb: 'https://images.unsplash.com/photo-1576798315244-78c12e91498b?w=200&q=60',
    tag: 'Dessert',
    tagClass: 'text-yellow-300',
    desc: 'Riz gluant parfumé à la coco, mangue fraîche de saison et sirop de coco caramélisé.',
  },
];

export default function Commander() {
  const ref = useReveal();
  const { addToCart } = useCart();

  return (
    <section
      ref={ref}
      id="commander"
      className="py-24 sm:py-32 relative"
      style={{ backgroundColor: '#112B11' }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="reveal section-label mb-5">Nos Signature</div>
          <h2 className="reveal reveal-delay-1 font-serif text-3xl sm:text-4xl md:text-5xl text-cream-50 tracking-tight">
            Commander en ligne
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-cream-50/40 font-light max-w-lg mx-auto">
            Nos plats les plus acclamés, préparés à la commande et prêts à être dégustés.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {DISHES.map((d, i) => (
            <div
              key={d.name}
              className={`dish-card reveal reveal-delay-${(i % 3) + 1} bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden group`}
            >
              <div className="relative h-52 sm:h-56 overflow-hidden">
                <Img src={d.img} alt={d.name} className="w-full h-full object-cover" />
                {d.tag && (
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
                    <span className={`text-[11px] font-medium ${d.tagClass}`}>{d.tag}</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif text-lg text-cream-50">{d.name}</h3>
                  <span className="text-gold-400 font-medium text-lg">{d.price}€</span>
                </div>
                <p className="text-sm text-cream-50/40 font-light leading-relaxed mb-4">
                  {d.desc}
                </p>
                <button
                  onClick={() => addToCart(d.name, d.price, d.thumb)}
                  className="plus-btn w-10 h-10 rounded-full border border-gold-400/30 text-gold-400 flex items-center justify-center text-xl"
                  aria-label={`Ajouter ${d.name} au panier`}
                >
                  <iconify-icon icon="solar:add-circle-linear" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
