import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { verifySession } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'];
const MAX_BYTES = 5 * 1024 * 1024; // 5 Mo

// Upload d'une image depuis le dashboard. Le fichier est stocké dans
// /public/uploads et renvoie une URL utilisable directement comme image de plat.
export async function POST(req) {
  if (!verifySession(req)) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'Aucun fichier reçu.' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  if (bytes.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: 'Fichier trop volumineux (max 5 Mo).' }, { status: 400 });
  }

  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (!ALLOWED_EXT.includes(ext)) {
    return NextResponse.json({ error: 'Format non supporté.' }, { status: 400 });
  }

  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 7);
  const filename = `up_${stamp}_${rand}.${ext}`;

  const dir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), Buffer.from(bytes));

  return NextResponse.json({ ok: true, url: `/uploads/${filename}` });
}
