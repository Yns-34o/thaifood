import { NextResponse } from 'next/server';
import { verifySession } from '../../../../../lib/auth';
import { saveDish, deleteDish } from '../../../../../lib/store';

export const dynamic = 'force-dynamic';

export async function PUT(req, { params }) {
  if (!verifySession(req)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  const dish = await req.json();
  dish.id = params.id;
  const saved = await saveDish(dish);
  return NextResponse.json({ ok: true, dish: saved });
}

export async function DELETE(req, { params }) {
  if (!verifySession(req)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  await deleteDish(params.id);
  return NextResponse.json({ ok: true });
}
