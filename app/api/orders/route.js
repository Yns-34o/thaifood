import { NextResponse } from 'next/server';
import { buildOrder, saveOrder, OrderError } from '../../../lib/orders';

export const runtime = 'nodejs';
// Toujours dynamique : on écrit dans un fichier, jamais de cache.
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const payload = await req.json().catch(() => ({}));
    const order = buildOrder(payload);

    // ========================================================================
    //  🔌 STRIPE — branchement futur du paiement en ligne
    // ------------------------------------------------------------------------
    //  Quand vous aurez vos clés Stripe (STRIPE_SECRET_KEY), créez ici le
    //  PaymentIntent AVANT la persistance :
    //
    //    import Stripe from 'stripe';
    //    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    //    const intent = await stripe.paymentIntents.create({
    //      amount: Math.round(order.total * 100),   // Stripe compte en centimes
    //      currency: 'eur',
    //      automatic_payment_methods: { enabled: true },
    //      metadata: { ref: order.ref, id: order.id },
    //    });
    //    order.paymentIntentId = intent.id;
    //    order.status = 'awaiting_payment';
    //
    //  Puis renvoyez `intent.client_secret` au client (en plus de l'order)
    //  pour qu'il confirme le paiement avec Stripe.js côté navigateur.
    //  Tant que Stripe n'est pas branché, la commande est enregistrée
    //  « reçue » et réglée sur place / à la livraison.
    // ========================================================================

    await saveOrder(order);

    return NextResponse.json({ ok: true, order }, { status: 201 });
  } catch (e) {
    if (e instanceof OrderError) {
      return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
    }
    console.error('[orders] POST error:', e);
    return NextResponse.json(
      { ok: false, error: 'Une erreur est survenue, réessayez.' },
      { status: 500 }
    );
  }
}
