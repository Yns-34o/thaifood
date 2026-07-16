import { NextResponse } from 'next/server';
import { verifySession } from '../../../lib/auth';

export const dynamic = 'force-dynamic';

// Indique au dashboard si l'admin est actuellement connecté.
export async function GET(req) {
  return NextResponse.json({ authed: verifySession(req) });
}
