'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [children, setChildren] = useState<any[]>([])
  const [upcomingActivities, setUpcomingActivities] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [pendingRequests, setPendingRequests] = useState<any[]>([])

  useEffect(() => {
    // Simuler les données utilisateur
    setUser({
      name: 'Marie Dupont',
      email: 'marie.dupont@example.com',
      quotientFamilial: 650
    })

    setChildren([
      { id: 1, name: 'Lucas', age: 8, activities: 3, avatar: '👦' },
      { id: 2, name: 'Emma', age: 12, activities: 2, avatar: '👧' }
    ])

    // Demandes d'inscription en attente de validation parentale
    setPendingRequests([
      {
        id: 1,
        childName: 'Lucas',
        childId: 1,
        activityTitle: 'Cours de Tennis Junior',
        provider: 'Club Tennis Saint-Étienne',
        date: '2025-07-15',
        price: 25,
        priceAfterAid: 10, // Avec aide QF
        requestDate: '2025-07-10',
        urgent: true
      },
      {
        id: 2,
        childName: 'Emma',
        childId: 2,
        activityTitle: 'Atelier Théâtre',
        provider: 'Théâtre Municipal',
        date: '2025-07-20',
        price: 35,
        priceAfterAid: 14,
        requestDate: '2025-07-11',
        urgent: false
      }
    ])

    setUpcomingActivities([
      { id: 1, title: 'Tennis - Lucas', date: '2025-07-15', time: '14h00' },
      { id: 2, title: 'Danse - Emma', date: '2025-07-16', time: '16h30' },
      { id: 3, title: 'Natation - Lucas', date: '2025-07-18', time: '15h00' }
    ])

    setNotifications([
      { id: 1, type: 'validation', message: `${pendingRequests.length} demandes d'inscription en attente de validation`, urgent: true },
      { id: 2, type: 'reminder', message: 'N\'oubliez pas le cours de danse d\'Emma demain', urgent: false }
    ])
  }, [])

  const handleValidateRequest = (requestId: number, approved: boolean) => {
    const request = pendingRequests.find(r => r.id === requestId)
    if (request) {
      if (approved) {
        // Ajouter à la liste des activités confirmées
        setUpcomingActivities(prev => [...prev, {
          id: Date.now(),
          title: `${request.activityTitle} - ${request.childName}`,
          date: request.date,
          time: '14h00',
          status: 'confirmed'
        }])
        alert(`✅ Inscription de ${request.childName} validée !`)
      } else {
        alert(`❌ Inscription de ${request.childName} refusée.`)
      }
      
      // Retirer de la liste des demandes en attente
      setPendingRequests(prev => prev.filter(r => r.id !== requestId))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord parent</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Bienvenue, {user?.name}
          </p>
        </div>

        {/* Notifications urgentes */}
        {notifications.filter(n => n.urgent).length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 dark:bg-orange-900/20 dark:border-orange-800">
            <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">🔔 Notifications importantes</h3>
            {notifications.filter(n => n.urgent).map(notification => (
              <p key={notification.id} className="text-orange-700 dark:text-orange-300">
                {notification.message}
              </p>
            ))}
          </div>
        )}

        {/* Demandes d'inscription en attente de validation */}
        {pendingRequests.length > 0 && (
          <div className="mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 dark:bg-red-900/20 dark:border-red-800">
              <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                ⚠️ Demandes d'inscription à valider ({pendingRequests.length})
              </h2>
              <div className="space-y-4">
                {pendingRequests.map(request => (
                  <div key={request.id} className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-red-200 dark:border-red-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{children.find(c => c.id === request.childId)?.avatar}</span>
                          <h3 className="font-semibold text-lg">{request.childName} souhaite s'inscrire</h3>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                          <strong>Activité:</strong> {request.activityTitle}
                        </p>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                          <strong>Organisateur:</strong> {request.provider}
                        </p>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-2">
                          <strong>Date:</strong> {request.date}
                        </p>
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-lg line-through text-neutral-500">{request.price}€</span>
                          <span className="text-xl font-bold text-green-600">{request.priceAfterAid}€</span>
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded dark:bg-green-900/20 dark:text-green-200">
                            Aide appliquée
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500">
                          Demande faite le {request.requestDate}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => handleValidateRequest(request.id, true)}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          ✅ Valider
                        </button>
                        <button
                          onClick={() => handleValidateRequest(request.id, false)}
                          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          ❌ Refuser
                        </button>
                        <Link 
                          href={`/activity/${request.id}`}
                          className="bg-neutral-200 text-neutral-800 px-4 py-2 rounded hover:bg-neutral-300 transition-colors text-sm font-medium text-center dark:bg-neutral-700 dark:text-neutral-200"
                        >
                          👁️ Détails
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mes enfants */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Mes enfants</h2>
                <Link 
                  href="/account/children/list"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Gérer →
                </Link>
              </div>
              <div className="space-y-4">
                {children.map(child => (
                  <div key={child.id} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{child.avatar}</span>
                        <div>
                          <h3 className="font-semibold">{child.name}</h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {child.age} ans • {child.activities} activités
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link 
                          href={`/account/child-dashboard?childId=${child.id}`}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm hover:bg-purple-200 transition-colors dark:bg-purple-900 dark:text-purple-200"
                        >
                          👦 Espace enfant
                        </Link>
                        <Link 
                          href={`/account/children/${child.id}`}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors dark:bg-blue-900 dark:text-blue-200"
                        >
                          👤 Profil
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Raccourcis */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Raccourcis</h3>
              <div className="space-y-2">
                <Link 
                  href="/search"
                  className="block w-full text-left bg-blue-50 text-blue-800 p-3 rounded hover:bg-blue-100 transition-colors dark:bg-blue-900/20 dark:text-blue-200"
                >
                  🔍 Rechercher des activités
                </Link>
                <Link 
                  href="/account/profile"
                  className="block w-full text-left bg-neutral-50 text-neutral-800 p-3 rounded hover:bg-neutral-100 transition-colors dark:bg-neutral-700 dark:text-neutral-200"
                >
                  👤 Mon profil
                </Link>
                <Link 
                  href="/aides-financieres"
                  className="block w-full text-left bg-green-50 text-green-800 p-3 rounded hover:bg-green-100 transition-colors dark:bg-green-900/20 dark:text-green-200"
                >
                  💰 Aides financières
                </Link>
              </div>
            </div>

            {/* Informations */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Mes informations</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Quotient familial:</strong> {user?.quotientFamilial}€</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <Link 
                  href="/account/profile"
                  className="text-blue-600 hover:underline"
                >
                  Modifier mes informations
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Prochaines activités */}
        <div className="mt-8">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Prochaines activités</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingActivities.map(activity => (
                <div key={activity.id} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                  <h3 className="font-semibold">{activity.title}</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {activity.date} à {activity.time}
                  </p>
                  <Link 
                    href={`/activity/${activity.id}`}
                    className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                  >
                    Voir détails →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
