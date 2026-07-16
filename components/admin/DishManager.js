'use client';

import { useState } from 'react';
import { api } from './api';
import { Btn, Card, Field, ImagePicker, Input, Select, TextArea, Toggle } from './ui';

const TAG_COLORS = [
  { value: 'text-gold-400', label: 'Or' },
  { value: 'text-green-300', label: 'Vert' },
  { value: 'text-yellow-300', label: 'Jaune' },
  { value: 'text-red-300', label: 'Rouge' },
  { value: 'text-cream-50', label: 'Crème' },
];

function blankDish(categoryId) {
  return {
    name: '',
    price: '',
    img: '',
    desc: '',
    tag: '',
    tagClass: 'text-gold-400',
    categoryId: categoryId || '',
    available: true,
    order: '',
  };
}

export default function DishManager({ dishes, categories, reload }) {
  const [editing, setEditing] = useState(null); // { isNew, ...dish }
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const catName = (id) => categories.find((c) => c.id === id)?.name || '—';

  async function save() {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...editing,
        price: Number(editing.price) || 0,
        order: editing.order === '' ? undefined : Number(editing.order),
      };
      delete payload.isNew;
      if (editing.id) {
        await api(`/api/admin/dishes/${editing.id}`, 'PUT', payload);
      } else {
        await api('/api/admin/dishes', 'POST', payload);
      }
      await reload();
      setEditing(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(d) {
    if (!confirm(`Supprimer « ${d.name} » ?`)) return;
    try {
      await api(`/api/admin/dishes/${d.id}`, 'DELETE');
      await reload();
    } catch (e) {
      alert(e.message);
    }
  }

  if (editing) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg text-cream-50">
            {editing.isNew ? 'Nouveau plat' : `Modifier — ${editing.name || 'sans nom'}`}
          </h2>
          <button onClick={() => setEditing(null)} className="text-cream-50/40 hover:text-cream-50 text-sm">
            Fermer ✕
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nom du plat">
            <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          </Field>
          <Field label="Prix (€)">
            <Input
              type="number"
              step="0.01"
              value={editing.price}
              onChange={(e) => setEditing({ ...editing, price: e.target.value })}
            />
          </Field>
          <Field label="Catégorie">
            <Select value={editing.categoryId} onChange={(e) => setEditing({ ...editing, categoryId: e.target.value })}>
              <option value="">— Aucune —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Badge (tag)" hint="Affiché en haut à gauche de la photo.">
            <div className="flex gap-2">
              <Input value={editing.tag} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} placeholder="ex : Best-seller" />
              <Select value={editing.tagClass} onChange={(e) => setEditing({ ...editing, tagClass: e.target.value })} className="w-32">
                {TAG_COLORS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </Select>
            </div>
          </Field>
          <Field label="Ordre d'affichage" hint="Plus petit = apparaît en premier.">
            <Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: e.target.value })} placeholder="auto" />
          </Field>
          <Field label="Disponibilité">
            <div className="pt-1">
              <Toggle checked={editing.available !== false} onChange={(v) => setEditing({ ...editing, available: v })} label={editing.available !== false ? 'Visible sur le site' : 'Masqué'} />
            </div>
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Description">
            <TextArea rows={2} value={editing.desc} onChange={(e) => setEditing({ ...editing, desc: e.target.value })} />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Image" hint="Collez une URL OU uploadez un fichier.">
            <ImagePicker value={editing.img} onChange={(url) => setEditing({ ...editing, img: url })} />
          </Field>
        </div>

        {error && <p className="text-sm text-red-300 mt-4">{error}</p>}

        <div className="flex gap-2 mt-6">
          <Btn onClick={save} disabled={saving || !editing.name}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Btn>
          <Btn variant="ghost" onClick={() => setEditing(null)}>Annuler</Btn>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-cream-50/50">{dishes.length} plat(s)</p>
        <Btn onClick={() => setEditing({ ...blankDish(categories[0]?.id), isNew: true })}>+ Ajouter un plat</Btn>
      </div>

      <div className="space-y-2">
        {dishes.map((d) => (
          <Card key={d.id} className="flex items-center gap-4">
            <img src={d.img} alt="" className="w-14 h-14 rounded-lg object-cover bg-th-950 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-cream-50 truncate">{d.name}</h3>
                {d.available === false && (
                  <span className="text-[10px] uppercase tracking-wide bg-white/10 text-cream-50/50 px-2 py-0.5 rounded-full">masqué</span>
                )}
              </div>
              <p className="text-xs text-cream-50/40">
                {catName(d.categoryId)} · {d.price}€ {d.tag ? `· ${d.tag}` : ''}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Btn variant="ghost" onClick={() => setEditing({ ...d })}>Modifier</Btn>
              <Btn variant="danger" onClick={() => remove(d)}>Suppr.</Btn>
            </div>
          </Card>
        ))}
        {dishes.length === 0 && (
          <p className="text-center text-cream-50/40 py-12">Aucun plat. Cliquez sur « Ajouter un plat ».</p>
        )}
      </div>
    </div>
  );
}
