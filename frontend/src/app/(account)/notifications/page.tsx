'use client'

import { useState, useEffect } from 'react'
import { Button } from 'frontend/src/shared/Button'
import Link from 'next/link'

interface Notification {
  id: string
  type: 'parent_validation' | 'child_request' | 'activity_reminder' | 'general'
  title: string
  message: string
  time: string
  date: string
  isRead: boolean
  avatar?: string
  href?: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'parent_validation' | 'child_request' | 'activity_reminder'>('all')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const authData = localStorage.getItem('authData')
    if (authData) {
      const parsed = JSON.parse(authData)
      setUser(parsed.user)
      loadNotifications(parsed.user)
    }
  }, [])

  const loadNotifications = (user: any) => {
    const mockNotifications: Notification[] = []

    if (user?.type === 'parent') {
      mockNotifications.push(
        {
          id: '1',
          type: 'child_request',
          title: 'Nouvelle demande d\'inscription',
          message: 'Emma souhaite s\'inscrire à "Atelier Poterie" le samedi 15 juin à 14h. Coût: 25€',
          time: 'Il y a 5 minutes',
          date: '2024-06-10',
          isRead: false,
          href: '/account/dashboard'
        },
        {
          id: '2',
          type: 'child_request',
          title: 'Demande d\'inscription - Lucas',
          message: 'Lucas demande à participer au "Camp de football d\'été". Période: 1-5 juillet. Coût: 120€',
          time: 'Il y a 2 heures',
          date: '2024-06-10',
          isRead: false,
          href: '/account/dashboard'
        },
        {
          id: '3',
          type: 'parent_validation',
          title: 'Rappel de validation',
          message: 'Vous avez 3 demandes en attente de validation depuis plus de 24h',
          time: 'Il y a 1 jour',
          date: '2024-06-09',
          isRead: true,
          href: '/account/dashboard'
        }
      )
    } else if (user?.type === 'child') {
      mockNotifications.push(
        {
          id: '4',
          type: 'parent_validation',
          title: 'Demande approuvée ! 🎉',
          message: 'Votre demande pour "Cours de Tennis" a été acceptée par vos parents. Rendez-vous mercredi à 16h au complexe sportif.',
          time: 'Il y a 2 heures',
          date: '2024-06-10',
          isRead: false,
          href: '/account/child-dashboard'
        },
        {
          id: '5',
          type: 'parent_validation',
          title: 'Demande refusée',
          message: 'Votre demande pour "Stage de danse hip-hop" a été refusée. Motif: "Conflit avec les cours de piano"',
          time: 'Il y a 1 jour',
          date: '2024-06-09',
          isRead: true,
          href: '/account/child-dashboard'
        },
        {
          id: '6',
          type: 'activity_reminder',
          title: 'Rappel d\'activité',
          message: 'Votre cours de natation commence dans 1 heure. N\'oubliez pas votre maillot et vos lunettes !',
          time: 'Il y a 30 minutes',
          date: '2024-06-10',
          isRead: false,
          href: '/account/child-dashboard'
        }
      )
    }

    // Notifications générales pour tous
    mockNotifications.push(
      {
        id: '7',
        type: 'general',
        title: 'Nouvelles activités d\'été disponibles',
        message: 'Découvrez notre programme d\'activités pour les vacances d\'été ! Plus de 50 nouvelles activités ajoutées.',
        time: 'Il y a 3 heures',
        date: '2024-06-10',
        isRead: true,
        href: '/search'
      },
      {
        id: '8',
        type: 'general',
        title: 'Maintenance programmée',
        message: 'Notre plateforme sera en maintenance dimanche de 2h à 4h du matin pour des améliorations.',
        time: 'Il y a 2 jours',
        date: '2024-06-08',
        isRead: true,
        href: '#'
      }
    )

    setNotifications(mockNotifications)
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.isRead
    return notification.type === filter
  })

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'parent_validation':
        return '👨‍👩‍👧‍👦'
      case 'child_request':
        return '🙋‍♀️'
      case 'activity_reminder':
        return '⏰'
      default:
        return '📢'
    }
  }

  const getFilterLabel = (filterType: string) => {
    switch (filterType) {
      case 'all':
        return 'Toutes'
      case 'unread':
        return 'Non lues'
      case 'parent_validation':
        return 'Validations parent'
      case 'child_request':
        return 'Demandes enfant'
      case 'activity_reminder':
        return 'Rappels d\'activités'
      default:
        return filterType
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Notifications
            </h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Gérez toutes vos notifications en un seul endroit
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} color="light" className="text-sm">
              Marquer tout comme lu ({unreadCount})
            </Button>
          )}
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'unread', ...(user?.type === 'parent' ? ['child_request', 'parent_validation'] : ['parent_validation', 'activity_reminder'])].map((filterType) => (
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
              {getFilterLabel(filterType)}
              {filterType === 'unread' && unreadCount > 0 && (
                <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              Aucune notification
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {filter === 'unread' 
                ? 'Vous avez lu toutes vos notifications !'
                : 'Aucune notification ne correspond à ce filtre.'
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                relative rounded-lg border p-6 transition-all hover:shadow-md
                ${!notification.isRead
                  ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20'
                  : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800'
                }
              `}
            >
              <div className="flex items-start space-x-4">
                {/* Icône */}
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-2xl dark:bg-neutral-700">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        {notification.title}
                      </h3>
                      <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-sm text-neutral-500">
                        {notification.time}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          Marquer comme lu
                        </button>
                      )}
                      {notification.href && notification.href !== '#' && (
                        <Link href={notification.href}>
                          <Button color="light" className="text-sm">
                            Voir
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Indicateur non lu */}
                {!notification.isRead && (
                  <div className="absolute top-6 right-6">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination (pour plus tard) */}
      {filteredNotifications.length > 10 && (
        <div className="mt-8 text-center">
          <Button color="light">
            Charger plus de notifications
          </Button>
        </div>
      )}
    </div>
  )
}
