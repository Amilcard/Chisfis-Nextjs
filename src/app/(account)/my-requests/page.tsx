'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/shared/Button'
import Link from 'next/link'

interface Request {
  id: string
  activityId: string
  activityTitle: string
  activityDescription: string
  category: string
  price: number
  location: string
  date: string
  time: string
  status: 'pending' | 'approved' | 'rejected'
  requestDate: string
  parentResponse?: string
  rejectionReason?: string
}

export default function MyRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = () => {
    // Simuler des demandes d'inscription
    const mockRequests: Request[] = [
      {
        id: '1',
        activityId: 'act1',
        activityTitle: 'Cours de Tennis',
        activityDescription: 'Initiation au tennis avec un coach professionnel',
        category: 'Sport',
        price: 35,
        location: 'Complexe Sportif Municipal',
        date: '2024-06-15',
        time: '14:00',
        status: 'approved',
        requestDate: '2024-06-10',
        parentResponse: 'Demande approuvée ! N\'oublie pas ta raquette.'
      },
      {
        id: '2',
        activityId: 'act2',
        activityTitle: 'Atelier Poterie',
        activityDescription: 'Découverte de la poterie et création de vos premières œuvres',
        category: 'Art & Culture',
        price: 25,
        location: 'Maison des Arts',
        date: '2024-06-20',
        time: '10:00',
        status: 'pending',
        requestDate: '2024-06-10'
      },
      {
        id: '3',
        activityId: 'act3',
        activityTitle: 'Stage de Danse Hip-Hop',
        activityDescription: 'Stage intensif de danse hip-hop pour tous niveaux',
        category: 'Danse',
        price: 80,
        location: 'Studio de Danse Centrale',
        date: '2024-06-25',
        time: '16:00',
        status: 'rejected',
        requestDate: '2024-06-08',
        rejectionReason: 'Conflit avec les cours de piano le mercredi'
      },
      {
        id: '4',
        activityId: 'act4',
        activityTitle: 'Camp de Football d\'été',
        activityDescription: 'Camp de football avec encadrement professionnel',
        category: 'Sport',
        price: 120,
        location: 'Stade Municipal',
        date: '2024-07-01',
        time: '09:00',
        status: 'pending',
        requestDate: '2024-06-09'
      }
    ]

    setRequests(mockRequests)
  }

  const cancelRequest = (requestId: string) => {
    setRequests(prev => prev.filter(req => req.id !== requestId))
  }

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true
    return request.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      case 'pending':
        return 'text-orange-700 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20'
      case 'rejected':
        return 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/20'
      default:
        return 'text-neutral-600 bg-neutral-100 dark:text-neutral-400 dark:bg-neutral-900/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '✅'
      case 'pending':
        return '⏳'
      case 'rejected':
        return '❌'
      default:
        return '❓'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvée'
      case 'pending':
        return 'En attente'
      case 'rejected':
        return 'Refusée'
      default:
        return status
    }
  }

  const pendingCount = requests.filter(r => r.status === 'pending').length
  const approvedCount = requests.filter(r => r.status === 'approved').length

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Mes Demandes d'Inscription
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Suivez l'état de vos demandes d'inscription aux activités
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full dark:bg-orange-900/20">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {pendingCount}
              </p>
              <p className="text-neutral-600 dark:text-neutral-400">En attente</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full dark:bg-green-900/20">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {approvedCount}
              </p>
              <p className="text-neutral-600 dark:text-neutral-400">Approuvées</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900/20">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {requests.length}
              </p>
              <p className="text-neutral-600 dark:text-neutral-400">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((filterType) => (
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
              {filterType === 'pending' && pendingCount > 0 && (
                <span className="ml-1 rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des demandes */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            {filter === 'all' 
              ? 'Aucune demande d\'inscription'
              : `Aucune demande ${getStatusLabel(filter).toLowerCase()}`
            }
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Découvrez nos activités et faites votre première demande !
          </p>
          <Link href="/search">
            <Button className="bg-brand-green text-white">
              Découvrir les activités
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                      {request.activityTitle}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`
                        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                        ${getStatusColor(request.status)}
                      `}>
                        <span className="mr-1">{getStatusIcon(request.status)}</span>
                        {getStatusLabel(request.status)}
                      </span>
                    </div>
                  </div>

                  <p className="text-neutral-600 dark:text-neutral-400 mb-3">
                    {request.activityDescription}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="mr-2">🎯</span>
                      {request.category}
                    </div>
                    <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="mr-2">📍</span>
                      {request.location}
                    </div>
                    <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="mr-2">💰</span>
                      {request.price}€
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="mr-2">📅</span>
                      {new Date(request.date).toLocaleDateString('fr-FR')} à {request.time}
                    </div>
                    <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="mr-2">📤</span>
                      Demandé le {new Date(request.requestDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  {/* Réponse du parent */}
                  {request.status === 'approved' && request.parentResponse && (
                    <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg dark:bg-green-900/20 dark:border-green-600">
                      <div className="flex items-start">
                        <span className="text-green-400 mr-2">💬</span>
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-300">
                            Message de vos parents :
                          </p>
                          <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                            {request.parentResponse}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {request.status === 'rejected' && request.rejectionReason && (
                    <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg dark:bg-red-900/20 dark:border-red-600">
                      <div className="flex items-start">
                        <span className="text-red-400 mr-2">❌</span>
                        <div>
                          <p className="text-sm font-medium text-red-800 dark:text-red-300">
                            Motif du refus :
                          </p>
                          <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                            {request.rejectionReason}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <Link href={`/activity/${request.activityId}`}>
                  <Button color="light" className="text-sm">
                    Voir l'activité
                  </Button>
                </Link>

                <div className="flex space-x-2">
                  {request.status === 'pending' && (
                    <Button
                      onClick={() => cancelRequest(request.id)}
                      color="light"
                      className="text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Annuler la demande
                    </Button>
                  )}
                  
                  {request.status === 'approved' && (
                    <Button className="text-sm bg-brand-green text-white">
                      🎉 Participer !
                    </Button>
                  )}
                  
                  {request.status === 'rejected' && (
                    <Button color="light" className="text-sm">
                      Faire une nouvelle demande
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conseils */}
      {pendingCount > 0 && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 dark:bg-blue-900/20 dark:border-blue-800">
          <div className="flex items-start">
            <span className="text-blue-500 text-2xl mr-3">💡</span>
            <div>
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-2">
                Conseils pour vos demandes
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                <li>• Vos parents recevront une notification pour chaque demande</li>
                <li>• Vous pouvez annuler une demande en attente à tout moment</li>
                <li>• N'hésitez pas à expliquer pourquoi cette activité vous intéresse</li>
                <li>• Vérifiez vos disponibilités avant de faire une demande</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
