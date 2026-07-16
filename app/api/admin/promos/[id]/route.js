import { NextResponse } from 'next/server';
import { verifySession } from '../../../../../lib/auth';
import { savePromo, deletePromo } from '../../../../../lib/store';

export const dynamic = 'force-dynamic';

export async function PUT(req, { params }) {
  if (!verifySession(req)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  const promo = await req.json();
  promo.id = params.id;
  const saved = await savePromo(promo);
  return NextResponse.json({ ok: true, promo: saved });
}

export async function DELETE(req, { params }) {
  if (!verifySession(req)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  await deletePromo(params.id);
  return NextResponse.json({ ok: true });
}
