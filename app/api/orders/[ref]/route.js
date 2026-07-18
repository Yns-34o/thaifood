import { NextResponse } from 'next/server';
import { getOrderByRef } from '../../../../lib/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Suivi de commande par référence (ex: page "où en est ma commande ?").
export async function GET(_req, { params }) {
  const ref = params?.ref;
  if (!ref) {
    return NextResponse.json(
      { ok: false, error: 'Référence manquante.' },
      { status: 400 }
    );
  }
  const order = await getOrderByRef(ref);
  if (!order) {
    return NextResponse.json(
      { ok: false, error: 'Commande introuvable.' },
      { status: 404 }
    );
  }
  return NextResponse.json({ ok: true, order });
}
