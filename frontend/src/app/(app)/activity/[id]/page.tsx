'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ApplicationLayout } from 'frontend/src/app/(app)/application-layout';
import ActivityCard from 'frontend/src/components/ActivityCard';
import Tabs from 'frontend/src/components/Tabs';
import { ContactForm, InscriptionForm } from 'frontend/src/components';
import QuickInscriptionForm from 'frontend/src/components/QuickInscriptionForm';
import { getActivityById } from 'frontend/src/services/activityService';

export default function ActivityDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [activity, setActivity] = useState<any>(null);
  const [tab, setTab] = useState<'info'|'inscription'>('info');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showQuickInscription, setShowQuickInscription] = useState(false);

  const handleTabChange = (newTab: string) => {
    setTab(newTab as 'info'|'inscription');
  };

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem('auth-token');
    setIsAuthenticated(!!token);
    if (id) {
      getActivityById(id).then(setActivity);
    }
  }, [id]);

  if (!activity) return (
    <ApplicationLayout>
      <div className="text-center py-8">Chargement…</div>
    </ApplicationLayout>
  );

  const tabs = [
    { key: 'info', label: 'Se renseigner' },
    ...(isAuthenticated ? [{ key: 'inscription', label: "S'inscrire" }] : [])
  ];

  return (
    <ApplicationLayout>
      <main className="pt-8 px-4 max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-blue-600 hover:underline">Accueil</Link>
          <span className="mx-2">›</span>
          <Link href="/search" className="text-blue-600 hover:underline">Recherche</Link>
          <span className="mx-2">›</span>
          <span className="text-neutral-600">{activity.title}</span>
        </nav>

        {/* Banner pour non-authentifiés avec inscription rapide */}
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl p-6 mb-8 dark:from-blue-900/20 dark:to-green-900/20 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 dark:text-blue-200 text-lg mb-2">
                  Inscription à {activity.title} 🎯
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                  Créez votre compte rapidement et inscrivez votre enfant en 2 minutes !
                </p>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setShowQuickInscription(true)}
                    className="bg-brand-green hover:bg-brand-green/90 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    ⚡ Inscription rapide
                  </button>
                  <Link 
                    href="/auth/signin"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                  >
                    🔐 Se connecter
                  </Link>
                </div>
              </div>
              <div className="hidden md:block text-6xl opacity-80">
                🚀
              </div>
            </div>
          </div>
        )}

        {/* 1️⃣ Visuel large et résumé */}
        <ActivityCard activity={activity} large />

        {/* 2️⃣ Onglets */}
        <Tabs
          options={tabs}
          activeKey={tab}
          onChange={handleTabChange}
        />

        {/* 3️⃣ Contenu selon onglet */}
        <section className="mt-4">
          {tab === 'info' ? (
            <ContactForm provider={activity.provider} activityId={activity.id} />
          ) : (
            <InscriptionForm activity={activity} />
          )}
        </section>

        {/* Modal d'inscription rapide */}
        {showQuickInscription && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="relative">
              <button 
                onClick={() => setShowQuickInscription(false)}
                className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <QuickInscriptionForm 
                activity={activity} 
                onClose={() => setShowQuickInscription(false)} 
              />
            </div>
          </div>
        )}
      </main>
    </ApplicationLayout>
  );
}
