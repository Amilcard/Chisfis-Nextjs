// src/app/(app)/(home-pages)/page.tsx
'use client';

import React, { useEffect } from 'react';
import FeatureCard from '@/components/FeatureCard';
import CategoryExplorer from '@/components/CategoryExplorer';
import ActivityCarousel from '@/components/ActivityCarousel';
import { fetchActivities } from '@/services/activityService';
import useRandomActivity from '@/hooks/useRandomActivity';

export default function HomePage() {
  const { activity, fetchRandomActivity } = useRandomActivity();

  useEffect(() => {
    fetchRandomActivity();
  }, []);

  return (
    <main className="pt-8 px-6">
      {/* Feature Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon="💰"
            title="Aides financières"
            description="Découvrez les aides disponibles selon votre situation"
            href="/aides-financieres"
          />
          <FeatureCard
            icon="🚲"
            title="Éco-mobilité"
            description="Proposez des trajets responsables et réduisez votre empreinte"
            href="/eco-mobilite"
          />
          <FeatureCard
            icon="🤝"
            title="Inclusion"
            description="Activités accessibles à tous et accompagnement dédié"
            href="/inclusivite"
          />
        </section>

        {/* Explorer par catégorie */}
        <section className="mb-12 bg-brand-grey/5 py-8 px-6 rounded-xl">
          <h2 className="text-h2 font-bold mb-6 text-brand-dark">
            Explorez par catégorie
          </h2>
          <CategoryExplorer
            categories={[
              { icon: '⚽️', label: 'Sport', href: '/search?category=sport' },
              { icon: '🎨', label: 'Culture', href: '/search?category=culture' },
              { icon: '🎲', label: 'Ludique', href: '/search?category=game' },
              { icon: '🌳', label: 'Nature', href: '/search?category=nature' },
            ]}
          />
        </section>

        {/* Activités près de chez vous */}
        <section className="mb-12 bg-brand-grey/5 py-8 px-6 rounded-xl">
          <h2 className="text-h2 font-bold mb-6 text-brand-dark">
            Activités près de chez vous
          </h2>
          <ActivityCarousel
            fetchFn={() => fetchActivities({ nearMe: true })}
            emptyMessage="Aucune activité à proximité."
          />
        </section>

        {/* Activités à petits prix */}
        <section className="mb-12 bg-brand-grey/5 py-8 px-6 rounded-xl">
          <h2 className="text-h2 font-bold mb-6 text-brand-dark">
            Activités à petits prix
          </h2>
          <ActivityCarousel
            fetchFn={() => fetchActivities({ maxPrice: 20 })}
            emptyMessage="Pas d'offres à ce tarif."
          />
        </section>

        {/* Activités en vedette */}
        <section className="mb-12 bg-brand-grey/5 py-8 px-6 rounded-xl">
          <h2 className="text-h2 font-bold mb-6 text-brand-dark">
            Activités en vedette
          </h2>
          <ActivityCarousel
            fetchFn={() => fetchActivities({ featured: true })}
            emptyMessage="Aucune activité en vedette."
          />
        </section>
      </main>
  );
}
