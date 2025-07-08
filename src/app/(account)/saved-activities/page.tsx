'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/shared/Button'
import Link from 'next/link'

interface SavedActivity {
  id: string
  title: string
  description: string
  category: string
  price: number
  location: string
  image: string
  dateAdded: string
  status: 'active' | 'full' | 'cancelled'
}

export default function SavedActivitiesPage() {
  const [savedActivities, setSavedActivities] = useState<SavedActivity[]>([])
  const [user, setUser] = useState<any>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'full' | 'cancelled'>('all')

  useEffect(() => {
    const authData = localStorage.getItem('authData')
    if (authData) {
      const parsed = JSON.parse(authData)
      setUser(parsed.user)
      loadSavedActivities()
    }
  }, [])

  const loadSavedActivities = () => {
    // Simuler des activités sauvegardées
    const mockActivities: SavedActivity[] = [
      {
        id: '1',
        title: 'Cours de Tennis',
        description: 'Initiation au tennis pour débutants avec un coach professionnel',
        category: 'Sport',
        price: 35,
        location: 'Complexe Sportif Municipal',
        image: '/api/placeholder/300/200',
        dateAdded: '2024-06-08',
        status: 'active'
      },
      {
        id: '2',
        title: 'Atelier Poterie',
        description: 'Découverte de la poterie et création de vos premières œuvres',
        category: 'Art & Culture',
        price: 25,
        location: 'Maison des Arts',
        image: '/api/placeholder/300/200',
        dateAdded: '2024-06-07',
        status: 'active'
      },
      {
        id: '3',
        title: 'Stage de Danse Hip-Hop',
        description: 'Stage intensif de danse hip-hop pour tous niveaux',
        category: 'Danse',
        price: 80,
        location: 'Studio de Danse Centrale',
        image: '/api/placeholder/300/200',
        dateAdded: '2024-06-05',
        status: 'full'
      },
      {
        id: '4',
        title: 'Camp de Football',
        description: 'Camp d\'été de football avec encadrement professionnel',
        category: 'Sport',
        price: 120,
        location: 'Stade Municipal',
        image: '/api/placeholder/300/200',
        dateAdded: '2024-06-03',
        status: 'cancelled'
      }
    ]

    setSavedActivities(mockActivities)
  }

  const removeSavedActivity = (activityId: string) => {
    setSavedActivities(prev => prev.filter(activity => activity.id !== activityId))
  }

  const filteredActivities = savedActivities.filter(activity => {
    if (filter === 'all') return true
    return activity.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      case 'full':
        return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20'
      case 'cancelled':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      default:
        return 'text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-900/20'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Disponible'
      case 'full':
        return 'Complet'
      case 'cancelled':
        return 'Annulé'
      default:
        return status
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          {user?.type === 'parent' ? 'Activités Sauvegardées' : 'Ma Wishlist'}
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          {user?.type === 'parent' 
            ? 'Les activités que vous avez sauvegardées pour vos enfants'
            : 'Les activités qui vous intéressent'
          }
        </p>
      </div>

      {/* Filtres */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'active', 'full', 'cancelled'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType as any)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${filter === filterType
                  ? 'bg-brand-green text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
                }
              `}
            >
              {filterType === 'all' ? 'Toutes' : getStatusLabel(filterType)}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des activités */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💖</div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            {filter === 'all' 
              ? 'Aucune activité sauvegardée'
              : `Aucune activité ${getStatusLabel(filter).toLowerCase()}`
            }
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Découvrez nos activités et ajoutez-les à votre wishlist !
          </p>
          <Link href="/search">
            <Button color="light">
              Découvrir les activités
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow dark:bg-neutral-800"
            >
              {/* Image */}
              <div className="relative h-48 bg-neutral-200 dark:bg-neutral-700">
                <div className="absolute inset-0 flex items-center justify-center text-neutral-500">
                  🎨 {activity.category}
                </div>
                
                {/* Status badge */}
                <div className="absolute top-3 right-3">
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${getStatusColor(activity.status)}
                  `}>
                    {getStatusLabel(activity.status)}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeSavedActivity(activity.id)}
                  className="absolute top-3 left-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors dark:bg-neutral-800/90 dark:hover:bg-neutral-800"
                  title="Retirer de la wishlist"
                >
                  <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Contenu */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {activity.title}
                  </h3>
                  <span className="text-lg font-bold text-brand-green">
                    {activity.price}€
                  </span>
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                  {activity.description}
                </p>

                <div className="flex items-center text-sm text-neutral-500 mb-4">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {activity.location}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-400">
                    Ajouté le {new Date(activity.dateAdded).toLocaleDateString('fr-FR')}
                  </span>
                  
                  {activity.status === 'active' && (
                    <Link href={`/activity/${activity.id}`}>
                      <Button color="light" className="text-sm">
                        {user?.type === 'parent' ? 'Inscrire enfant' : 'Demander inscription'}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {savedActivities.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-sm text-neutral-500">
            {savedActivities.length} activité{savedActivities.length > 1 ? 's' : ''} sauvegardée{savedActivities.length > 1 ? 's' : ''} 
            • {savedActivities.filter(a => a.status === 'active').length} disponible{savedActivities.filter(a => a.status === 'active').length > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  )
}
