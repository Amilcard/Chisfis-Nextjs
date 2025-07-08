

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ChildDashboardPage() {
  const [child, setChild] = useState<any>(null)
  const [activities, setActivities] = useState<any[]>([])
  const [achievements, setAchievements] = useState<any[]>([])
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<any[]>([])

  useEffect(() => {
    // Simuler les données enfant
    setChild({
      name: 'Lucas',
      age: 8,
      avatar: '👦',
      points: 150,
      level: 'Explorateur'
    })

    setActivities([
      { id: 1, title: 'Tennis', nextSession: '2025-07-15', progress: 75, emoji: '🎾', status: 'confirmed' },
      { id: 2, title: 'Natation', nextSession: '2025-07-18', progress: 60, emoji: '🏊', status: 'confirmed' },
      { id: 3, title: 'Arts plastiques', nextSession: '2025-07-20', progress: 90, emoji: '🎨', status: 'confirmed' }
    ])

    // Demandes en attente de validation parentale
    setPendingRequests([
      { 
        id: 4, 
        title: 'Cours de Piano', 
        emoji: '🎹', 
        status: 'pending_parent',
        requestDate: '2025-07-10',
        provider: 'École de Musique'
      }
    ])

    // Liste de souhaits
    setWishlist([
      { id: 5, title: 'Escalade', emoji: '🧗', reason: 'Ça a l\'air trop cool !' },
      { id: 6, title: 'Cuisine', emoji: '👨‍🍳', reason: 'Pour faire des gâteaux' }
    ])

    setAchievements([
      { id: 1, title: 'Premier service au tennis', emoji: '🏆', date: '2025-07-10' },
      { id: 2, title: '10 longueurs de piscine', emoji: '🥇', date: '2025-07-08' },
      { id: 3, title: 'Œuvre exposée', emoji: '⭐', date: '2025-07-05' }
    ])
  }, [])

  const handleRequestActivity = (activityId: number) => {
    const activity = wishlist.find(a => a.id === activityId)
    if (activity) {
      // Ajouter à la liste des demandes en attente
      setPendingRequests(prev => [...prev, {
        ...activity,
        status: 'pending_parent',
        requestDate: new Date().toISOString().split('T')[0],
        provider: 'Centre d\'activités'
      }])
      
      // Retirer de la wishlist
      setWishlist(prev => prev.filter(a => a.id !== activityId))
      
      alert(`🚀 Demande envoyée à tes parents pour : ${activity.title}!`)
    }
  }

  if (!child) return <div>Chargement...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header ludique */}
        <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg p-6 text-white mb-8">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{child.avatar}</div>
            <div>
              <h1 className="text-3xl font-bold">Salut {child.name} !</h1>
              <p className="text-lg opacity-90">Niveau : {child.level}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl">⭐</span>
                <span className="text-xl font-bold">{child.points} points</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mes activités */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                🎯 Mes activités
              </h2>
              
              {/* Activités confirmées */}
              <div className="space-y-4 mb-6">
                {activities.map(activity => (
                  <div key={activity.id} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{activity.emoji}</span>
                        <div>
                          <h3 className="font-semibold">{activity.title}</h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Prochain cours : {activity.nextSession}
                          </p>
                        </div>
                      </div>
                      <Link 
                        href={`/activity/${activity.id}`}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors dark:bg-blue-900 dark:text-blue-200"
                      >
                        Voir
                      </Link>
                    </div>
                    
                    {/* Barre de progression */}
                    <div className="w-full bg-neutral-200 rounded-full h-2 dark:bg-neutral-700">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${activity.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                      Progression : {activity.progress}%
                    </p>
                  </div>
                ))}
              </div>

              {/* Demandes en attente */}
              {pendingRequests.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 text-orange-600 flex items-center gap-2">
                    ⏳ En attente de l'accord de mes parents
                  </h3>
                  <div className="space-y-3">
                    {pendingRequests.map(request => (
                      <div key={request.id} className="border border-orange-200 rounded-lg p-4 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{request.emoji}</span>
                          <div>
                            <h4 className="font-semibold">{request.title}</h4>
                            <p className="text-sm text-orange-600 dark:text-orange-300">
                              Demande envoyée le {request.requestDate}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Liste de souhaits */}
              {wishlist.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-purple-600 flex items-center gap-2">
                    💫 Mes activités de rêve
                  </h3>
                  <div className="space-y-3">
                    {wishlist.map(item => (
                      <div key={item.id} className="border border-purple-200 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.emoji}</span>
                            <div>
                              <h4 className="font-semibold">{item.title}</h4>
                              <p className="text-sm text-purple-600 dark:text-purple-300">
                                {item.reason}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRequestActivity(item.id)}
                            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
                          >
                            🙏 Demander
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mes récompenses */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                🏆 Mes récompenses
              </h3>
              <div className="space-y-3">
                {achievements.slice(0, 3).map(achievement => (
                  <div key={achievement.id} className="flex items-center gap-3 p-2 rounded hover:bg-neutral-50 dark:hover:bg-neutral-700">
                    <span className="text-xl">{achievement.emoji}</span>
                    <div>
                      <p className="font-medium text-sm">{achievement.title}</p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                href="/account/achievements"
                className="text-blue-600 hover:underline text-sm mt-3 inline-block"
              >
                Voir toutes mes récompenses →
              </Link>
            </div>

            {/* Actions rapides */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                ⚡ Actions rapides
              </h3>
              <div className="space-y-2">
                <Link 
                  href="/search"
                  className="block w-full text-left bg-purple-50 text-purple-800 p-3 rounded hover:bg-purple-100 transition-colors dark:bg-purple-900/20 dark:text-purple-200"
                >
                  🔍 Découvrir de nouvelles activités
                </Link>
                <Link 
                  href="/account/profile"
                  className="block w-full text-left bg-blue-50 text-blue-800 p-3 rounded hover:bg-blue-100 transition-colors dark:bg-blue-900/20 dark:text-blue-200"
                >
                  👤 Mon profil
                </Link>
              </div>
            </div>

            {/* Objectifs */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                🎯 Mes objectifs
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded dark:bg-yellow-900/20">
                  <p className="font-medium text-sm">Terminer 5 cours de tennis</p>
                  <div className="w-full bg-yellow-200 rounded-full h-1.5 mt-2 dark:bg-yellow-800">
                    <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">4/5 terminés</p>
                </div>
                <div className="p-3 bg-green-50 rounded dark:bg-green-900/20">
                  <p className="font-medium text-sm">Nager 100 longueurs</p>
                  <div className="w-full bg-green-200 rounded-full h-1.5 mt-2 dark:bg-green-800">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">60/100 longueurs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
