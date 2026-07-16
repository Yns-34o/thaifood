// Petit helper pour appeler les routes API admin depuis le dashboard.
export async function api(path, method = 'GET', body) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  if (res.status === 401) {
    // Session expirée -> on recharge pour revenir à l'écran de connexion.
    if (typeof window !== 'undefined') window.location.reload();
    throw new Error('Session expirée');
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Une erreur est survenue');
  return json;
}

// Upload d'une image. Renvoie l'URL utilisable comme image de plat.
export async function uploadImage(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Échec de l'envoi de l'image");
  return json.url;
}
