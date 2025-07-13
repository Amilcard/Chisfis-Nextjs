'use client'

import avatarImage from '@/images/avatars/Image-1.png'
import Avatar from '@/shared/Avatar'
import { Divider } from '@/shared/divider'
import { Link } from '@/shared/link'
import SwitchDarkMode2 from '@/shared/SwitchDarkMode2'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import {
  BulbChargingIcon,
  FavouriteIcon,
  Idea01Icon,
  Logout01Icon,
  Task01Icon,
  UserIcon,
  Home01Icon,
  ChildIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Props {
  className?: string
}

interface User {
  id: string
  name: string
  email: string
  type: 'parent' | 'child'
  avatar?: string
}

export default function AvatarDropdown({ className }: Props) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Vérifier l'authentification
    const authData = localStorage.getItem('authData')
    if (authData) {
      const parsed = JSON.parse(authData)
      setUser(parsed.user)
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authData')
    setUser(null)
    setIsAuthenticated(false)
    router.push('/auth/signin')
  }

  const getAvatarSrc = () => {
    if (user?.avatar) {
      return user.avatar
    }
    // Avatar par défaut selon le type d'utilisateur
    if (user?.type === 'child') {
      return avatarImage.src // ou une image spécifique enfant
    }
    return avatarImage.src // avatar par défaut parent
  }

  const getDefaultAvatarIcon = () => {
    if (!isAuthenticated) {
      return (
        <div className="size-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
          <HugeiconsIcon icon={UserIcon} size={20} strokeWidth={1.5} className="text-neutral-500 dark:text-neutral-400" />
        </div>
      )
    }
    return <Avatar src={getAvatarSrc()} className="size-8" />
  }

  if (!isAuthenticated) {
    return (
      <div className={className}>
        <Link
          href="/auth/signin"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-green rounded-full hover:bg-brand-green/90 transition-colors"
        >
          Se connecter
        </Link>
      </div>
    )
  }
  return (
    <div className={className}>
      <Popover>
        <PopoverButton className="-m-1.5 flex cursor-pointer items-center justify-center rounded-full p-1.5 hover:bg-neutral-100 focus-visible:outline-hidden dark:hover:bg-neutral-800">
          {getDefaultAvatarIcon()}
        </PopoverButton>

        <PopoverPanel
          transition
          anchor={{
            to: 'bottom end',
            gap: 16,
          }}
          className="z-40 w-80 rounded-3xl shadow-lg ring-1 ring-black/5 transition duration-200 ease-in-out data-closed:translate-y-1 data-closed:opacity-0"
        >
          <div className="relative grid grid-cols-1 gap-6 bg-white px-6 py-7 dark:bg-neutral-800">
            <div className="flex items-center space-x-3">
              <Avatar src={getAvatarSrc()} className="size-12" />

              <div className="grow">
                <h4 className="font-semibold">{user?.name || 'Utilisateur'}</h4>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {user?.type === 'parent' ? 'Compte Parent' : 'Compte Enfant'}
                </p>
                <p className="text-xs text-neutral-400">{user?.email}</p>
              </div>
            </div>

            <Divider />

            {/* Dashboard selon le type d'utilisateur */}
            {user?.type === 'parent' ? (
              <Link
                href="/account/dashboard"
                className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-brand-green/50 dark:hover:bg-neutral-700"
              >
                <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                  <HugeiconsIcon icon={Home01Icon} size={24} strokeWidth={1.5} />
                </div>
                <p className="ms-4 text-sm font-medium">Dashboard Parent</p>
              </Link>
            ) : (
              <Link
                href="/account/child-dashboard"
                className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-brand-green/50 dark:hover:bg-neutral-700"
              >
                <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                  <HugeiconsIcon icon={ChildIcon} size={24} strokeWidth={1.5} />
                </div>
                <p className="ms-4 text-sm font-medium">Mon Espace</p>
              </Link>
            )}

            {/* Profil */}
            <Link
              href="/account/profile"
              className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-brand-green/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={UserIcon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">Mon Profil</p>
            </Link>

            {/* Mes activités / Wishlist */}
            <Link
              href="/account/saved-activities"
              className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-brand-green/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={FavouriteIcon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">
                {user?.type === 'parent' ? 'Activités Sauvegardées' : 'Ma Wishlist'}
              </p>
            </Link>

            {/* Mes demandes (pour les enfants) */}
            {user?.type === 'child' && (
              <Link
                href="/account/my-requests"
                className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-brand-green/50 dark:hover:bg-neutral-700"
              >
                <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                  <HugeiconsIcon icon={Task01Icon} size={24} strokeWidth={1.5} />
                </div>
                <p className="ms-4 text-sm font-medium">Mes Demandes</p>
              </Link>
            )}

            <Divider />

            {/* Mode sombre */}
            <div className="focus-visible:ring-opacity-50 -m-3 flex items-center justify-between rounded-lg p-2 hover:bg-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-brand-green dark:hover:bg-neutral-700">
              <div className="flex items-center">
                <div className="flex flex-shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                  <HugeiconsIcon icon={Idea01Icon} size={24} strokeWidth={1.5} />
                </div>
                <p className="ms-4 text-sm font-medium">Mode sombre</p>
              </div>
              <SwitchDarkMode2 />
            </div>

            {/* Aide */}
            <Link
              href="/help"
              className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-brand-green/50 dark:hover:bg-neutral-700"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={BulbChargingIcon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">Aide</p>
            </Link>

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-neutral-100 focus:outline-hidden focus-visible:ring-3 focus-visible:ring-brand-green/50 dark:hover:bg-neutral-700 w-full text-left"
            >
              <div className="flex shrink-0 items-center justify-center text-neutral-500 dark:text-neutral-300">
                <HugeiconsIcon icon={Logout01Icon} size={24} strokeWidth={1.5} />
              </div>
              <p className="ms-4 text-sm font-medium">Se déconnecter</p>
            </button>
          </div>
        </PopoverPanel>
      </Popover>
    </div>
  )
}
