'use client';

import { useState } from 'react';
import { useCart } from './CartContext';
import { formatPrice } from '../lib/pricing';

// ============================================================================
//  Étape « Confirmation » : récap de la commande validée + référence.
// ============================================================================

export default function OrderSuccess() {
  const { lastOrder, resetCheckout } = useCart();
  const [copied, setCopied] = useState(false);

  if (!lastOrder) return null;

  const o = lastOrder;
  const customer = o.customer || {};
  const name = `${customer.firstName || ''} ${customer.lastName || ''}`.trim();

  async function copyRef() {
    try {
      await navigator.clipboard.writeText(o.ref);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papier indisponible */
    }
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      <div className="flex-1 px-6 py-8 flex flex-col items-center text-center">
        {/* Cochage animé */}
        <div className="relative mb-6">
          <span className="absolute inset-0 rounded-full bg-gold-400/20 animate-ping-slow" />
          <div className="relative w-20 h-20 rounded-full bg-gold-400/15 border border-gold-400/40 flex items-center justify-center">
            <iconify-icon icon="solar:check-circle-bold" className="text-5xl text-gold-400" />
          </div>
        </div>

        <h3 className="font-serif text-2xl text-cream-50">Merci{name ? `, ${customer.firstName}` : ''} !</h3>
        <p className="text-sm text-cream-50/50 font-light mt-2 max-w-xs">
          Votre commande a bien été enregistrée. Nous vous recontactons rapidement pour confirmer.
        </p>

        {/* Référence */}
        <button
          onClick={copyRef}
          className="success-pop mt-6 group inline-flex items-center gap-3 bg-white/[0.03] border border-gold-400/25 rounded-full pl-5 pr-3 py-2.5 hover:border-gold-400/50 transition-colors"
          title="Copier la référence"
        >
          <span className="text-[10px] uppercase tracking-[0.18em] text-cream-50/40">
            Référence
          </span>
          <span className="font-serif text-lg text-gold-400 tracking-wide">{o.ref}</span>
          <span className="w-7 h-7 rounded-full bg-gold-400/10 flex items-center justify-center text-gold-400">
            <iconify-icon icon={copied ? 'solar:check-bold' : 'solar:copy-linear'} className="text-sm" />
          </span>
        </button>
        {copied && <p className="text-[11px] text-gold-400/80 mt-1.5">Référence copiée</p>}
      </div>

      {/* Récap */}
      <div className="px-6 pb-2 space-y-4">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] divide-y divide-white/[0.05]">
          <RecapRow
            icon={o.type === 'delivery' ? 'solar:scooter-linear' : 'solar:hand-bag-linear'}
            label="Mode"
            value={o.type === 'delivery' ? 'Livraison' : 'Retrait sur place'}
          />
          {o.scheduledFor && (
            <RecapRow
              icon="solar:clock-circle-linear"
              label="Créneau"
              value={formatDateTime(o.scheduledFor)}
            />
          )}
          {o.type === 'delivery' && customer.address && (
            <RecapRow
              icon="solar:map-point-linear"
              label="Adresse"
              value={`${customer.address}, ${customer.postalCode} ${customer.city}`}
            />
          )}
          <RecapRow
            icon="solar:phone-linear"
            label="Contact"
            value={customer.phone}
          />
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-xs uppercase tracking-[0.14em] text-cream-50/40">
              {o.items.length} article{o.items.length > 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-cream-50/40">
                {o.items.map((i) => i.qty).reduce((a, b) => a + b, 0)} plat(s)
              </span>
              <span className="font-serif text-xl text-gold-400">{formatPrice(o.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[12px] text-cream-50/45 bg-th-900/50 border border-white/[0.05] rounded-xl px-3.5 py-3">
          <iconify-icon icon="solar:info-circle-linear" className="text-base text-gold-400/70 mt-0.5" />
          <p>
            Conservez votre référence <strong className="text-cream-50/70">{o.ref}</strong> pour
            toute question. {o.type === 'delivery' ? 'Règlement à la livraison.' : 'Règlement sur place (CB ou espèces).'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-5 border-t border-white/[0.06] bg-th-900/60 space-y-2.5">
        <button
          onClick={resetCheckout}
          className="cta-primary w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
        >
          <iconify-icon icon="solar:add-circle-linear" className="text-base" />
          Passer une nouvelle commande
        </button>
        <button
          onClick={resetCheckout}
          className="w-full py-2 text-sm text-cream-50/50 hover:text-cream-50 transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

function RecapRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <iconify-icon icon={icon} className="text-lg text-gold-400/70" />
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-[0.14em] text-cream-50/35">{label}</div>
        <div className="text-sm text-cream-50/85 truncate">{value}</div>
      </div>
    </div>
  );
}

function formatDateTime(value) {
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}
