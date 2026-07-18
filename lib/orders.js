import { promises as fs } from 'fs';
import path from 'path';
import { computeTotals, FREE_DELIVERY_THRESHOLD } from './pricing';

// ============================================================================
//  COUCHE DE COMMANDES — « Firebase-ready » + « Stripe-ready »
// ----------------------------------------------------------------------------
//  AUJOURD'HUI : lecture/écriture de data/orders.json (fichier local).
//  Le site fonctionne immédiatement, sans configuration externe.
//
//  POUR PASSER À FIREBASE plus tard :
//  Remplacez UNIQUEMENT le corps de ce fichier par des appels Firestore
//  (collection 'orders'), en conservant les mêmes fonctions exportées
//  (buildOrder, saveOrder, getOrders, getOrderByRef, updateOrderStatus).
//  -> Les routes API et le tunnel de commande ne changent pas.
//
//  POUR AJOUTER STRIPE :
//  Voir app/api/orders/route.js (création du PaymentIntent à la validation).
//  La structure d'une commande (champ `paymentIntentId`, `status`) est déjà
//  prévue pour accueillir le paiement.
// ============================================================================

const ORDERS_FILE = path.join(process.cwd(), 'data', 'orders.json');

async function readOrders() {
  try {
    const raw = await fs.readFile(ORDERS_FILE, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : data.orders || [];
  } catch {
    // Fichier absent ou illisible (ex: serverless non tracé) : aucune commande.
    return [];
  }
}

async function writeOrders(orders) {
  await fs.mkdir(path.dirname(ORDERS_FILE), { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

function genId(prefix = 'ord') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

// Référence courte lisible par le client, ex : "TF-7K3Q9F".
// Alphabet sans caractères ambigus (0/O, 1/I/L…).
export function genReference() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `TF-${s}`;
}

// Erreur métier (données invalides) — renvoyée en 400 par l'API.
export class OrderError extends Error {}

const REQUIRED_BY_TYPE = {
  pickup: ['firstName', 'lastName', 'phone'],
  delivery: ['firstName', 'lastName', 'phone', 'address', 'postalCode', 'city'],
};

const FIELD_LABELS = {
  firstName: 'prénom',
  lastName: 'nom',
  phone: 'téléphone',
  email: 'e-mail',
  address: 'adresse',
  postalCode: 'code postal',
  city: 'ville',
};

// Construit + valide une commande à partir d'une charge entrante.
// Lève OrderError en cas de données invalides.
export function buildOrder(payload = {}) {
  const items = Array.isArray(payload.items) ? payload.items : [];
  if (items.length === 0) throw new OrderError('Votre panier est vide.');

  const type = payload.type === 'delivery' ? 'delivery' : 'pickup';
  const c = payload.customer || {};

  for (const f of REQUIRED_BY_TYPE[type]) {
    if (!String(c[f] || '').trim()) {
      throw new OrderError(`Champ requis : ${FIELD_LABELS[f] || f}.`);
    }
  }
  if (c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) {
    throw new OrderError('Adresse e-mail invalide.');
  }
  if (!/^[+0-9().\s-]{8,}$/.test(c.phone)) {
    throw new OrderError('Numéro de téléphone invalide.');
  }

  const normItems = items.map((i) => ({
    name: String(i.name || 'Plat').slice(0, 120),
    price: Math.max(0, Number(i.price) || 0),
    qty: Math.max(1, Math.min(99, parseInt(i.qty, 10) || 1)),
    image: i.image || null,
  }));

  const { subtotal, deliveryFee, total } = computeTotals(normItems, type);

  return {
    id: genId('ord'),
    ref: genReference(),
    createdAt: new Date().toISOString(),
    status: 'received', // received | confirmed | preparing | ready | fulfilled | cancelled
    type,
    customer: {
      firstName: String(c.firstName || '').trim(),
      lastName: String(c.lastName || '').trim(),
      phone: String(c.phone || '').trim(),
      email: String(c.email || '').trim(),
      address: String(c.address || '').trim(),
      postalCode: String(c.postalCode || '').trim(),
      city: String(c.city || '').trim(),
      notes: String(c.notes || '').trim().slice(0, 500),
    },
    scheduledFor: payload.scheduledFor || null,
    items: normItems,
    subtotal,
    deliveryFee,
    total,
    channel: 'web',
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
  };
}

export async function saveOrder(order) {
  const orders = await readOrders();
  orders.unshift(order);
  await writeOrders(orders);
  return order;
}

export async function getOrders() {
  return readOrders();
}

export async function getOrderByRef(ref) {
  const orders = await readOrders();
  return orders.find((o) => o.ref === ref || o.id === ref) || null;
}

export async function updateOrderStatus(ref, status) {
  const orders = await readOrders();
  const i = orders.findIndex((o) => o.ref === ref || o.id === ref);
  if (i < 0) return null;
  orders[i] = { ...orders[i], status, updatedAt: new Date().toISOString() };
  await writeOrders(orders);
  return orders[i];
}
