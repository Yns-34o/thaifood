import { NextResponse } from 'next/server';
import { verifySession } from '../../../../lib/auth';
import { getPromos, savePromo } from '../../../../lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  if (!verifySession(req)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  return NextResponse.json({ promos: await getPromos() });
}

export async function POST(req) {
  if (!verifySession(req)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  const promo = await req.json();
  const saved = await savePromo(promo);
  return NextResponse.json({ ok: true, promo: saved });
}
