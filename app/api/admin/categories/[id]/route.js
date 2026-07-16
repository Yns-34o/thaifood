import { NextResponse } from 'next/server';
import { verifySession } from '../../../../../lib/auth';
import { saveCategory, deleteCategory } from '../../../../../lib/store';

export const dynamic = 'force-dynamic';

export async function PUT(req, { params }) {
  if (!verifySession(req)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  const category = await req.json();
  category.id = params.id;
  const saved = await saveCategory(category);
  return NextResponse.json({ ok: true, category: saved });
}

export async function DELETE(req, { params }) {
  if (!verifySession(req)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  await deleteCategory(params.id);
  return NextResponse.json({ ok: true });
}
