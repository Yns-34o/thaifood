import { NextResponse } from 'next/server';
import { verifySession } from '../../../../lib/auth';
import { getDishes, saveDish } from '../../../../lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  if (!verifySession(req)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  return NextResponse.json({ dishes: await getDishes() });
}

export async function POST(req) {
  if (!verifySession(req)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  const dish = await req.json();
  const saved = await saveDish(dish);
  return NextResponse.json({ ok: true, dish: saved });
}
