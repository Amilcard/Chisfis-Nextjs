'use client'

import avatar4 from '@/images/avatars/Image-4.png'
import avatar5 from '@/images/avatars/Image-5.png'
import avatar6 from '@/images/avatars/Image-6.png'
import Avatar from 'frontend/src/shared/Avatar'
import { CloseButton, Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { FC, useState, useEffect } from 'react'

interface Notification {
  id: string
  type: 'parent_validation' | 'child_request' | 'activity_reminder' | 'general'
  title: string
  message: string
  time: string
  isRead: boolean
  avatar?: string
  href?: string
}

interface Props {
  className?: string
}

const NotifyDropdown: FC<Props> = ({ className = '' }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Charger les données utilisateur et notifications
    const authData = localStorage.getItem('authData')
    if (authData) {
      const parsed = JSON.parse(authData)
      setUser(parsed.user)
      loadNotifications(parsed.user)
    }
  }, [])

  const loadNotifications = (user: any) => {
    // Simuler des notifications selon le type d'utilisateur
    const mockNotifications: Notification[] = []

    if (user?.type === 'parent') {
      mockNotifications.push({
        id: '1',
        type: 'child_request',
        title: 'Nouvelle demande d\'inscription',
        message: 'Emma souhaite s\'inscrire à "Atelier Poterie"',
        time: 'Il y a 5 minutes',
        isRead: false,
        avatar: avatar4.src,
        href: '/account/dashboard'
      })
      mockNotifications.push({
        id: '2',
        type: 'parent_validation',
        title: 'Validation en attente',
        message: '2 demandes d\'activités en attente de validation',
        time: 'Il y a 1 heure',
        isRead: false,
        avatar: avatar5.src,
        href: '/account/dashboard'
      })
    } else if (user?.type === 'child') {
      mockNotifications.push({
        id: '3',
        type: 'parent_validation',
        title: 'Demande approuvée !',
        message: 'Votre demande pour "Cours de Tennis" a été acceptée',
        time: 'Il y a 2 heures',
        isRead: false,
        avatar: avatar6.src,
        href: '/account/child-dashboard'
      })
      mockNotifications.push({
        id: '4',
        type: 'activity_reminder',
        title: 'Rappel d\'activité',
        message: 'Votre cours de natation commence dans 1 heure',
        time: 'Il y a 30 minutes',
        isRead: false,
        href: '/account/child-dashboard'
      })
    }

    // Notifications générales
    mockNotifications.push({
      id: '5',
      type: 'general',
      title: 'Nouvelles activités disponibles',
      message: 'Découvrez les activités de la semaine prochaine',
      time: 'Il y a 3 heures',
      isRead: true,
      href: '/search'
    })

    setNotifications(mockNotifications)
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

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

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    )
  }
  return (
    <Popover className={className}>
      <>
        <PopoverButton
          className={
            'relative -m-2.5 flex cursor-pointer items-center justify-center rounded-full p-2.5 hover:bg-neutral-100 focus-visible:outline-hidden dark:hover:bg-neutral-800'
          }
        >
          {unreadCount > 0 && (
            <span className="absolute -end-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <BellIcon className="h-6 w-6" />
        </PopoverButton>

        <PopoverPanel
          transition
          anchor={{
            to: 'bottom end',
            gap: 16,
          }}
          className="z-40 w-96 rounded-3xl shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out data-closed:translate-y-1 data-closed:opacity-0"
        >
          <div className="relative bg-white dark:bg-neutral-800">
            {/* Header */}
            <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                    {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Notifications list */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <div className="text-4xl mb-2">🔔</div>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Aucune notification pour le moment
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <CloseButton
                    as={Link}
                    key={notification.id}
                    href={notification.href || '#'}
                    onClick={() => markAsRead(notification.id)}
                    className={`
                      relative block w-full border-b border-neutral-100 px-6 py-4 text-left transition duration-150 ease-in-out hover:bg-neutral-50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-brand-green/50 dark:border-neutral-700 dark:hover:bg-neutral-700
                      ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-950/20' : ''}
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icône ou Avatar */}
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <Avatar src={notification.avatar} className="size-10" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-lg dark:bg-neutral-700">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {notification.title}
                        </p>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-500">
                          {notification.time}
                        </p>
                      </div>

                      {/* Indicateur non lu */}
                      {!notification.isRead && (
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        </div>
                      )}
                    </div>
                  </CloseButton>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-neutral-200 px-6 py-3 dark:border-neutral-700">
                <Link
                  href="/account/notifications"
                  className="block w-full rounded-lg bg-neutral-50 py-2 text-center text-sm font-medium text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                >
                  Voir toutes les notifications
                </Link>
              </div>
            )}
          </div>
        </PopoverPanel>
      </>
    </Popover>
  )
}

export default NotifyDropdown
