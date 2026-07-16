'use client';

import dynamic from 'next/dynamic';

// Chargé côté client uniquement (le dashboard gère sa propre session).
const AdminApp = dynamic(() => import('../../components/admin/AdminApp'), { ssr: false });

export default function AdminPage() {
  return <AdminApp />;
}
