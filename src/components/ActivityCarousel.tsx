// src/components/ActivityCarousel.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Activity {
  id: number;
  theme: string;
  title: string;
  provider: string;
  location: string;
  date: string;
  schedule: string;
  price: number;
  financialAid: string[];
  installment: boolean;
  disabilityAccess: boolean;
  ecoMobility: string;
  ageRanges: string[];
  imageUrl: string;
}

interface ActivityCarouselProps {
  fetchFn: () => Promise<Activity[]>;
  emptyMessage: string;
}

export default function ActivityCarousel({ fetchFn, emptyMessage }: ActivityCarouselProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        const data = await fetchFn();
        setActivities(data);
      } catch (error) {
        console.error('Erreur lors du chargement des activités:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [fetchFn]);

  if (loading) {
    return (
      <div className="flex space-x-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-64 h-40 bg-gray-200 rounded-lg animate-pulse dark:bg-gray-700" />
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex-shrink-0 w-80 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="relative w-full h-32">
            <Image 
              src={activity.imageUrl} 
              alt={activity.title}
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover rounded-t-lg"
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">{activity.title}</h4>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {activity.theme}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              📍 {activity.location}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              🕒 {activity.schedule}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              👨‍👩‍👧‍👦 {activity.ageRanges.join(', ')}
            </p>
            
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {activity.price === 0 ? 'Gratuit' : `${activity.price}€`}
              </span>
              {activity.financialAid.length > 0 && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  💰 Aide dispo
                </span>
              )}
            </div>
            
            <div className="flex gap-2 mt-2">
              {activity.disabilityAccess && (
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  ♿ Accessible
                </span>
              )}
              {activity.ecoMobility && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  🚌 Éco-transport
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
