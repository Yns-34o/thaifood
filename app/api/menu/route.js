import { NextResponse } from 'next/server';
import { getMenu } from '../../../lib/store';

export const dynamic = 'force-dynamic';

// Menu public (plats + catégories + promos). Lu par le hook useMenu côté client.
export async function GET() {
  const menu = await getMenu();
  return NextResponse.json(menu, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
