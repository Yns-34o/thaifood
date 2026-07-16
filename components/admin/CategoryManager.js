'use client';

import { useState } from 'react';
import { api } from './api';
import { Btn, Card, Field, Input } from './ui';

export default function CategoryManager({ categories, dishes, reload }) {
  const sorted = [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function add(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError('');
    try {
      await api('/api/admin/categories', 'POST', { name: name.trim() });
      setName('');
      await reload();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function update(cat, patch) {
    await api(`/api/admin/categories/${cat.id}`, 'PUT', { ...cat, ...patch });
    await reload();
  }

  async function remove(cat) {
    const count = dishes.filter((d) => d.categoryId === cat.id).length;
    const msg = count
      ? `Supprimer « ${cat.name} » ? ${count} plat(s) s'y trouvent : ils apparaîtront toujours dans « Tout » mais plus sous cette catégorie.`
      : `Supprimer « ${cat.name} » ?`;
    if (!confirm(msg)) return;
    await api(`/api/admin/categories/${cat.id}`, 'DELETE');
    await reload();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div>
        <h2 className="font-serif text-lg text-cream-50 mb-3">Catégories existantes</h2>
        <div className="space-y-2">
          {sorted.map((c) => {
            const count = dishes.filter((d) => d.categoryId === c.id).length;
            return (
              <Card key={c.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    value={c.name}
                    onChange={(e) => update(c, { name: e.target.value })}
                    className="font-medium"
                  />
                  <p className="text-[11px] text-cream-50/40 mt-1">
                    {count} plat(s) · ordre{' '}
                    <input
                      type="number"
                      value={c.order ?? 0}
                      onChange={(e) => update(c, { order: Number(e.target.value) })}
                      className="w-14 bg-transparent border-b border-white/10 text-cream-50/60 focus:outline-none focus:border-gold-400/60"
                    />
                  </p>
                </div>
                <Btn variant="danger" onClick={() => remove(c)}>Suppr.</Btn>
              </Card>
            );
          })}
          {sorted.length === 0 && (
            <p className="text-cream-50/40 text-sm">Aucune catégorie.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-lg text-cream-50 mb-3">Ajouter une catégorie</h2>
        <Card>
          <form onSubmit={add} className="space-y-3">
            <Field label="Nom de la catégorie" hint="ex : Menu midi, Boissons, Desserts…">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nouvelle catégorie" />
            </Field>
            {error && <p className="text-sm text-red-300">{error}</p>}
            <Btn type="submit" disabled={busy || !name.trim()}>{busy ? '…' : 'Ajouter'}</Btn>
          </form>
        </Card>
        <p className="text-[11px] text-cream-50/30 mt-3">
          Astuce : l'« ordre » contrôle l'ordre des filtres et des plats sur le site.
        </p>
      </div>
    </div>
  );
}
