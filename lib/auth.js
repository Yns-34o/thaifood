import crypto from 'crypto';

// ============================================================================
//  AUTHENTIFICATION ADMIN
// ----------------------------------------------------------------------------
//  Identifiants (modifiables via un fichier .env.local — voir README) :
//    ADMIN_USERNAME, ADMIN_PASSWORD
//  La session est un cookie httpOnly signé (HMAC SHA-256).
//  NOTE : pour un site strictement local, ce niveau suffit. Pour une mise en
//  ligne, passez plutôt l'auth à Firebase Auth en même temps que les données.
// ============================================================================

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'adminthaifood';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'meilleurthai77';
const SESSION_SECRET =
  process.env.SESSION_SECRET || 'thai-food-77-local-session-secret-change-me';
export const COOKIE_NAME = 'tf_admin_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 jours

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export function verifyCredentials(username, password) {
  return (
    safeEqual(username, ADMIN_USERNAME) && safeEqual(password, ADMIN_PASSWORD)
  );
}

function sign(payload) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
}

export function createSessionCookie() {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url');
  const token = `${payload}.${sign(payload)}`;
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  };
}

// `req` = NextRequest (Route Handler). Renvoie true si la session est valide.
export function verifySession(req) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) return false;
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return false;
    if (sign(payload) !== sig) return false;
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    return typeof exp === 'number' && exp > Date.now();
  } catch {
    return false;
  }
}

export function clearSessionCookie() {
  return { name: COOKIE_NAME, value: '', httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 };
}
