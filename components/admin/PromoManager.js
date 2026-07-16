'use client';

import { useState } from 'react';
import { api } from './api';
import { Btn, Card, Field, Input, Select, Toggle } from './ui';
import { promoLabel } from '../../lib/pricing';

function blankPromo() {
  return { label: '', type: 'percent', value: '', scope: 'global', targetId: '', active: true };
}

export default function PromoManager({ promos, dishes, categories, reload }) {
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function describe(p) {
    const where =
      p.scope === 'global' ? 'tous les plats'
        : p.scope === 'category' ? (categories.find((c) => c.id === p.targetId)?.name || 'catégorie')
        : (dishes.find((d) => d.id === p.targetId)?.name || 'plat');
    const how = p.type === 'percent' ? `-${p.value}%` : `${p.value}€`;
    return `${how} · sur ${where}`;
  }

  async function save() {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...editing,
        value: Number(editing.value) || 0,
        targetId: editing.scope === 'global' ? null : editing.targetId || null,
      };
      if (editing.scope !== 'global' && !payload.targetId) {
        throw new Error('Sélectionnez la cible de la promo.');
      }
      delete payload.isNew;
      if (editing.id) {
        await api(`/api/admin/promos/${editing.id}`, 'PUT', payload);
      } else {
        await api('/api/admin/promos', 'POST', payload);
      }
      await reload();
      setEditing(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(p) {
    if (!confirm(`Supprimer la promo « ${p.label || describe(p)} » ?`)) return;
    await api(`/api/admin/promos/${p.id}`, 'DELETE');
    await reload();
  }

  async function toggleActive(p) {
    await api(`/api/admin/promos/${p.id}`, 'PUT', { ...p, active: !p.active });
    await reload();
  }

  if (editing) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg text-cream-50">
            {editing.isNew ? 'Nouvelle promotion' : 'Modifier la promotion'}
          </h2>
          <button onClick={() => setEditing(null)} className="text-cream-50/40 hover:text-cream-50 text-sm">Fermer ✕</button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nom interne (optionnel)" hint="Pour vous repérer dans cette liste.">
            <Input value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} placeholder="ex : Happy hour" />
          </Field>
          <Field label="Type de réduction">
            <Select value={editing.type} onChange={(e) => setEditing({ ...editing, type: e.target.value })}>
              <option value="percent">Pourcentage (%)</option>
              <option value="fixed">Prix promo fixe (€)</option>
            </Select>
          </Field>
          <Field label={editing.type === 'percent' ? 'Valeur (%)' : 'Nouveau prix (€)'}>
            <Input
              type="number"
              step="0.01"
              value={editing.value}
              onChange={(e) => setEditing({ ...editing, value: e.target.value })}
              placeholder={editing.type === 'percent' ? '20' : '12'}
            />
          </Field>
          <Field label="Portée">
            <Select value={editing.scope} onChange={(e) => setEditing({ ...editing, scope: e.target.value, targetId: '' })}>
              <option value="global">Tous les plats</option>
              <option value="category">Une catégorie</option>
              <option value="dish">Un plat précis</option>
            </Select>
          </Field>
          {editing.scope !== 'global' && (
            <Field label={editing.scope === 'category' ? 'Catégorie' : 'Plat'} className="sm:col-span-2">
              <Select value={editing.targetId || ''} onChange={(e) => setEditing({ ...editing, targetId: e.target.value })}>
                <option value="">— Sélectionner —</option>
                {editing.scope === 'category'
                  ? categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)
                  : dishes.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </Select>
            </Field>
          )}
        </div>

        <div className="mt-4">
          <Toggle checked={editing.active !== false} onChange={(v) => setEditing({ ...editing, active: v })} label={editing.active !== false ? 'Active (visible sur le site)' : 'Désactivée'} />
        </div>

        {error && <p className="text-sm text-red-300 mt-4">{error}</p>}

        <div className="flex gap-2 mt-6">
          <Btn onClick={save} disabled={saving || editing.value === ''}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Btn>
          <Btn variant="ghost" onClick={() => setEditing(null)}>Annuler</Btn>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-cream-50/50">
          {promos.length} promo(s). Priorité&nbsp;: par plat &gt; par catégorie &gt; globale.
        </p>
        <Btn onClick={() => setEditing({ ...blankPromo(), isNew: true })}>+ Ajouter une promo</Btn>
      </div>

      <div className="space-y-2">
        {promos.map((p) => (
          <Card key={p.id} className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center bg-red-500/15 text-red-300 px-2 py-0.5 rounded-full text-xs font-semibold">
                  Promo {promoLabel(p)}
                </span>
                {p.label && <span className="text-cream-50/60 text-sm">{p.label}</span>}
              </div>
              <p className="text-xs text-cream-50/40 mt-1">{describe(p)}</p>
            </div>
            <Toggle checked={p.active !== false} onChange={() => toggleActive(p)} label={p.active !== false ? 'Active' : 'Off'} />
            <Btn variant="ghost" onClick={() => setEditing({ ...p })}>Modifier</Btn>
            <Btn variant="danger" onClick={() => remove(p)}>Suppr.</Btn>
          </Card>
        ))}
        {promos.length === 0 && (
          <Card>
            <p className="text-center text-cream-50/40 py-6">
              Aucune promotion.
              <br />
              <span className="text-[12px]">Créez une promo sur tous les plats, une catégorie ou un plat précis.</span>
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
