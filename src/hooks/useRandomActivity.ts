// src/hooks/useRandomActivity.ts
"use client";

import { useState, useCallback } from 'react';

interface Activity {
  id: number;
  theme: string;
  title: string;
  provider: string;
  location: string;
  schedule: string;
  price: number;
  financialAid: string[];
  installment: boolean;
  disabilityAccess: boolean;
  ecoMobility: string;
  ageRanges: string[];
  imageUrl: string;
}

// Activités d'exemple pour la fonctionnalité aléatoire
const randomActivities: Activity[] = [
  {
    "id": 101,
    "theme": "découverte",
    "title": "Découverte urbaine",
    "provider": "Office de Tourisme",
    "location": "Saint-Étienne Centre",
    "schedule": "samedi 14:00-16:00",
    "price": 12,
    "financialAid": [],
    "installment": false,
    "disabilityAccess": true,
    "ecoMobility": "Tram T1 Place du Peuple",
    "ageRanges": ["11-14 ans", "15-17 ans"],
    "imageUrl": "https://source.unsplash.com/400x300/?city,discovery"
  },
  {
    "id": 102,
    "theme": "créatif",
    "title": "Atelier créatif",
    "provider": "Maison des Arts",
    "location": "Saint-Étienne Centre",
    "schedule": "mercredi 15:00-17:00",
    "price": 20,
    "financialAid": ["Bons Vacances"],
    "installment": true,
    "disabilityAccess": true,
    "ecoMobility": "Bus C7 à 200 m",
    "ageRanges": ["7-10 ans", "11-14 ans"],
    "imageUrl": "https://source.unsplash.com/400x300/?art,creative"
  },
  {
    "id": 103,
    "theme": "sport",
    "title": "Activité sportive surprise",
    "provider": "Centre Sportif Municipal",
    "location": "Saint-Étienne Bellevue",
    "schedule": "samedi 10:00-12:00",
    "price": 8,
    "financialAid": ["Pass Sport"],
    "installment": false,
    "disabilityAccess": false,
    "ecoMobility": "Tram T3 arrêt Bellevue",
    "ageRanges": ["11-14 ans", "15-17 ans"],
    "imageUrl": "https://source.unsplash.com/400x300/?sport,activity"
  },
  {
    "id": 104,
    "theme": "culture",
    "title": "Expérience culturelle",
    "provider": "Musée de Saint-Étienne",
    "location": "Saint-Étienne Centre",
    "schedule": "dimanche 14:00-16:00",
    "price": 16,
    "financialAid": ["Pass Culture"],
    "installment": false,
    "disabilityAccess": true,
    "ecoMobility": "Tram T2 Châteaucreux",
    "ageRanges": ["7-10 ans", "11-14 ans"],
    "imageUrl": "https://source.unsplash.com/400x300/?museum,culture"
  }
];

export default function useRandomActivity() {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomActivity = useCallback(async () => {
    setLoading(true);
    
    // Simulation d'un délai d'API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const randomIndex = Math.floor(Math.random() * randomActivities.length);
    const randomActivity = randomActivities[randomIndex];
    
    setActivity(randomActivity);
    setLoading(false);
  }, []);

  return {
    activity,
    loading,
    fetchRandomActivity
  };
}
