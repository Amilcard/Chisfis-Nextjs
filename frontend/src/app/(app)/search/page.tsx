// src/app/(app)/search/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import InklusifSearchForm from '@/components/HeroSearchForm/InklusifSearchForm'
import dynamic from 'next/dynamic'
import { fetchActivities } from '@/services/activityService'

// Import dynamique pour éviter l'erreur SSR avec Leaflet
const MapResults = dynamic(() => import('frontend/src/components/Map/MapResults'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
    <p className="text-gray-500">Chargement de la carte...</p>
  </div>
})

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

// Interface pour la carte (transformation des données)
interface MapActivity {
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  address: string;
  price: number;
  category: string;
  imageUrl: string;
}

// Fonction pour transformer les activités vers le format carte
const transformToMapActivities = (activities: Activity[]): MapActivity[] => {
  return activities.map(activity => ({
    id: activity.id.toString(),
    title: activity.title,
    description: `${activity.schedule} - ${activity.ageRanges.join(', ')}`,
    // Coordonnées simulées autour de Saint-Étienne
    lat: 45.4397 + (Math.random() - 0.5) * 0.02,
    lng: 4.3872 + (Math.random() - 0.5) * 0.02,
    address: activity.location,
    price: activity.price,
    category: activity.theme,
    imageUrl: activity.imageUrl
  }))
}

// Composant pour la logique de recherche
function SearchContent() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'distance'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [currentFilters, setCurrentFilters] = useState<any>({})

  const searchParams = useSearchParams()

  useEffect(() => {
    // Charger les activités initiales
    loadActivities({})
  }, [])

  const loadActivities = async (filters: any) => {
    setLoading(true)
    try {
      const results = await fetchActivities(filters)
      setActivities(sortActivities(results, sortBy, sortOrder))
      setCurrentFilters(filters)
    } catch (error) {
      console.error('Erreur lors du chargement des activités:', error)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  const sortActivities = (activities: Activity[], sortBy: string, order: string) => {
    return [...activities].sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price
          break
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'distance':
          // Simulation de distance basée sur l'ID
          comparison = a.id - b.id
          break
        default:
          comparison = 0
      }
      
      return order === 'desc' ? -comparison : comparison
    })
  }

  const handleFilterChange = (filters: any) => {
    loadActivities(filters)
  }

  const handleSortChange = (newSortBy: 'date' | 'price' | 'distance', newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
    setActivities(sortActivities(activities, newSortBy, newSortOrder))
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header de recherche */}
      <div className="bg-white dark:bg-neutral-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              Rechercher des activités
            </h1>
            <InklusifSearchForm onSearch={handleFilterChange} />
          </div>
        </div>
      </div>

      {/* Contrôles d'affichage */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {loading ? 'Chargement...' : `${activities.length} activités trouvées`}
            </p>
            <div className="flex items-center space-x-4">
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as ['date' | 'price' | 'distance', 'asc' | 'desc']
                  handleSortChange(newSortBy, newSortOrder)
                }}
                className="px-3 py-1 border border-gray-300 rounded-md dark:bg-neutral-800 dark:border-neutral-600"
              >
                <option value="date-asc">Date (croissant)</option>
                <option value="date-desc">Date (décroissant)</option>
                <option value="price-asc">Prix (croissant)</option>
                <option value="price-desc">Prix (décroissant)</option>
              </select>
              <div className="flex rounded-md border border-gray-300 dark:border-neutral-600">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300'}`}
                >
                  Liste
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1 ${viewMode === 'map' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300'}`}
                >
                  Carte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-8">
              {activities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activities.map((activity) => (
                    <div key={activity.id} className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-neutral-700">
                      {/* Image de l'activité */}
                      <div className="mb-4">
                        <div className="w-full h-48 bg-gray-100 dark:bg-neutral-700 rounded-lg mb-3 flex items-center justify-center">
                          <span className="text-4xl">🎯</span>
                        </div>
                      </div>
                      
                      {/* Informations principales */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          📍 {activity.location}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          🏢 {activity.provider}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          📅 {activity.schedule} • 👥 {activity.ageRanges.join(', ')}
                        </p>
                      </div>

                      {/* Tags et badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                          {activity.theme}
                        </span>
                        {activity.disabilityAccess && (
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                            ♿ Accessible
                          </span>
                        )}
                        {activity.ecoMobility && (
                          <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded">
                            🌱 Éco-mobilité
                          </span>
                        )}
                      </div>

                      {/* Prix et actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-primary-600">
                            {activity.price}€
                          </span>
                          {activity.financialAid.length > 0 && (
                            <span className="text-xs text-green-600 dark:text-green-400">
                              🎟️ Aides disponibles
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-neutral-600">
                            ❤️
                          </button>
                          <button className="px-4 py-2 bg-primary-600 text-white rounded text-sm hover:bg-primary-700">
                            Voir détails
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Aucune activité trouvée avec ces critères.
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Essayez de modifier vos filtres de recherche.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <MapResults 
              activities={transformToMapActivities(activities)}
              height="600px"
              className="rounded-2xl shadow-lg"
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Wrapper avec Suspense pour éviter l'erreur useSearchParams
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
