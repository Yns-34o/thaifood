import { NextResponse } from 'next/server';
import { verifySession } from '../../../../lib/auth';
import { getCategories, saveCategory } from '../../../../lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  if (!verifySession(req)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  return NextResponse.json({ categories: await getCategories() });
}

export async function POST(req) {
  if (!verifySession(req)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }
  const category = await req.json();
  const saved = await saveCategory(category);
  return NextResponse.json({ ok: true, category: saved });
}
