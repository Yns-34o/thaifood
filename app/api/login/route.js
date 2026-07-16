import { NextResponse } from 'next/server';
import { verifyCredentials, createSessionCookie } from '../../../lib/auth';

export async function POST(req) {
  let body = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Requête invalide.' }, { status: 400 });
  }

  const { username, password } = body;
  if (!verifyCredentials(username, password)) {
    return NextResponse.json(
      { ok: false, error: 'Identifiant ou mot de passe incorrect.' },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(createSessionCookie());
  return res;
}
