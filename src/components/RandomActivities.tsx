// src/components/RandomActivities.tsx
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export type Activity = {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
};

const CATEGORIES = ['bicycle', 'pottery', 'theater', 'football'];

async function getRandomActivities(): Promise<Activity[]> {
  // Génère une liste de 3 activités aléatoires
  const list: Activity[] = Array.from({ length: 3 }).map((_, i) => {
    const cat = CATEGORIES[i % CATEGORIES.length];
    return {
      id: i + 1,
      title: (() => {
        switch (cat) {
          case 'bicycle':   return 'Sortie Vélo';
          case 'pottery':   return 'Atelier Poterie';
          case 'theater':   return 'Stage Théâtre';
          case 'football':  return 'Initiation au football';
          default:          return 'Activité Fun';
        }
      })(),
      location: ['Lyon', 'Grenoble', 'Annecy'][i % 3],
      // URL Picsum Photos : format 400×300, plus stable que Unsplash
      imageUrl: `https://picsum.photos/400/300?random=${Date.now() + i}`,
    };
  });

  // On peut mélanger pour l'effet "random"
  return list.sort(() => 0.5 - Math.random());
}

function useRandomActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const newActivities = await getRandomActivities();
      setActivities(newActivities);
    } catch (error) {
      console.error('Erreur lors du chargement des activités:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { activities, refresh, loading };
}

export default function RandomActivities() {
  const { activities, refresh, loading } = useRandomActivities();

  if (loading) {
    return (
      <section className="py-8">
        <h2 className="text-xl font-bold mb-4">Activités aléatoires</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden shadow-sm animate-pulse">
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <h2 className="text-xl font-bold mb-4">Activités aléatoires</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((act) => (
          <div key={act.id} className="border rounded-lg overflow-hidden shadow-sm">
            <div className="relative w-full h-48">
              <Image
                src={act.imageUrl}
                alt={act.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{act.title}</h3>
              <p className="text-sm text-gray-500">{act.location}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={refresh}
        className="mt-6 px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
      >
        Explorer Plus
      </button>
    </section>
  );
}
