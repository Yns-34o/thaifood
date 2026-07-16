'use client';

import { useState } from 'react';
import Img from './Img';
import useReveal from './useReveal';

export default function Reserver() {
  const ref = useReveal();
  const [success, setSuccess] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setSummary({
      date: data.get('date'),
      time: data.get('time'),
      guests: data.get('guests'),
      name: data.get('name'),
    });
    setSuccess(true);
  };

  return (
    <section
      ref={ref}
      id="reserver"
      className="py-24 sm:py-32 relative"
      style={{ backgroundColor: '#4ea34e' }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <div className="img-frame rounded-2xl h-[400px] sm:h-[480px] mb-8">
              <Img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
                alt="Intérieur élégant du restaurant"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="flex items-center gap-6 text-sm text-cream-50/50">
              <div className="flex items-center gap-2">
                <iconify-icon icon="solar:clock-circle-linear" className="text-gold-400" />
                <span>Ouvert à 18h30</span>
              </div>
              <div className="flex items-center gap-2">
                <iconify-icon icon="solar:map-point-linear" className="text-gold-400" />
                <span>Pontault-Combault</span>
              </div>
            </div>
          </div>

          <div className="reveal reveal-delay-2">
            <div className="section-label mb-5">Réservation</div>
            <h2 className="font-serif text-3xl sm:text-4xl text-cream-50 tracking-tight mb-3">
              Réserver votre <span className="italic text-gold-400">table</span>
            </h2>
            <p className="text-cream-50/50 font-light mb-8">
              Vivez une soirée d&apos;exception dans notre cadre raffiné.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-cream-50/50 mb-2 uppercase tracking-wider">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    className="form-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-cream-50/50 mb-2 uppercase tracking-wider">
                    Heure
                  </label>
                  <select
                    name="time"
                    required
                    defaultValue=""
                    className="form-input w-full px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Choisir</option>
                    <option value="18:30">18h30</option>
                    <option value="19:00">19h00</option>
                    <option value="19:30">19h30</option>
                    <option value="20:00">20h00</option>
                    <option value="20:30">20h30</option>
                    <option value="21:00">21h00</option>
                    <option value="21:30">21h30</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-cream-50/50 mb-2 uppercase tracking-wider">
                    Convives
                  </label>
                  <select
                    name="guests"
                    required
                    defaultValue=""
                    className="form-input w-full px-4 py-3 rounded-xl text-sm appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Nombre</option>
                    <option value="1">1 personne</option>
                    <option value="2">2 personnes</option>
                    <option value="3">3 personnes</option>
                    <option value="4">4 personnes</option>
                    <option value="5">5 personnes</option>
                    <option value="6">6 personnes</option>
                    <option value="7+">7+ personnes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-cream-50/50 mb-2 uppercase tracking-wider">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="06 12 34 56 78"
                    className="form-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-cream-50/50 mb-2 uppercase tracking-wider">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Votre nom"
                  className="form-input w-full px-4 py-3 rounded-xl text-sm"
                />
              </div>

              <button
                type="submit"
                className="cta-primary w-full py-3.5 rounded-xl text-sm font-medium mt-2 flex items-center justify-center gap-2"
              >
                <iconify-icon icon="solar:calendar-mark-linear" className="text-base" />
                Confirmer ma table
              </button>
            </form>

            {success && (
              <div className="success-pop mt-6 p-5 rounded-xl border border-white/15 bg-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                    <iconify-icon icon="solar:check-circle-bold" className="text-white text-xl" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      Table confirmée{summary?.name ? `, ${summary.name}` : ''} !
                    </div>
                    <div className="text-xs text-cream-50/60 mt-0.5">
                      Un rappel vous sera envoyé par téléphone.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
