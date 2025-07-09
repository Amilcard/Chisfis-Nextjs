// src/app/(account)/PageNavigation.tsx
import Link from 'next/link';
import React from 'react';

export default function PageNavigation() {
  return (
    <nav className="flex space-x-4 p-4 border-b">
      <Link href="/account/profile">Profil</Link>
      <Link href="/account/children/list">Enfants</Link>
      <Link href="/account/notifications">Notifications</Link>
      <Link href="/account/password">Mot de passe</Link>
      <Link href="/account/favorites">Favoris</Link>
      <Link href="/account/request">Demandes</Link>
    </nav>
  );
}
