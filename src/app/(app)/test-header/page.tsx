'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/shared/Button'

export default function HeaderTestPage() {
  const [testUser, setTestUser] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Vérifier l'état actuel
    const authData = localStorage.getItem('authData')
    if (authData) {
      setTestUser(JSON.parse(authData).user)
      setIsLoggedIn(true)
    }
  }, [])

  const loginAsParent = () => {
    const parentUser = {
      user: {
        id: '1',
        name: 'Marie Dupont',
        email: 'marie.dupont@email.com',
        type: 'parent',
        avatar: undefined // Pas d'avatar pour tester l'icône par défaut
      }
    }
    localStorage.setItem('authData', JSON.stringify(parentUser))
    setTestUser(parentUser.user)
    setIsLoggedIn(true)
    window.location.reload()
  }

  const loginAsChild = () => {
    const childUser = {
      user: {
        id: '2',
        name: 'Lucas Dupont',
        email: 'lucas.dupont@email.com',
        type: 'child',
        avatar: undefined // Pas d'avatar pour tester l'icône par défaut
      }
    }
    localStorage.setItem('authData', JSON.stringify(childUser))
    setTestUser(childUser.user)
    setIsLoggedIn(true)
    window.location.reload()
  }

  const loginWithAvatar = () => {
    const userWithAvatar = {
      user: {
        id: '3',
        name: 'Sophie Martin',
        email: 'sophie.martin@email.com',
        type: 'parent',
        avatar: '/images/avatars/Image-1.png' // Avec avatar
      }
    }
    localStorage.setItem('authData', JSON.stringify(userWithAvatar))
    setTestUser(userWithAvatar.user)
    setIsLoggedIn(true)
    window.location.reload()
  }

  const logout = () => {
    localStorage.removeItem('authData')
    setTestUser(null)
    setIsLoggedIn(false)
    window.location.reload()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Test du Header - Avatar & Notifications
        </h1>

        {/* État actuel */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">État actuel</h2>
          {isLoggedIn ? (
            <div className="space-y-2">
              <p><strong>Connecté en tant que :</strong> {testUser?.name}</p>
              <p><strong>Type :</strong> {testUser?.type === 'parent' ? 'Parent' : 'Enfant'}</p>
              <p><strong>Email :</strong> {testUser?.email}</p>
              <p><strong>Avatar :</strong> {testUser?.avatar ? 'Oui' : 'Non (icône par défaut)'}</p>
            </div>
          ) : (
            <p className="text-neutral-600 dark:text-neutral-400">
              Non connecté - Bouton "Se connecter" visible
            </p>
          )}
        </div>

        {/* Tests */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Tests de connexion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={loginAsParent} color="light" className="w-full">
              👨‍👩‍👧‍👦 Se connecter comme Parent
            </Button>
            <Button onClick={loginAsChild} color="light" className="w-full">
              👶 Se connecter comme Enfant
            </Button>
            <Button onClick={loginWithAvatar} color="light" className="w-full">
              🖼️ Connecter avec Avatar
            </Button>
            <Button onClick={logout} color="light" className="w-full text-red-600">
              🚪 Se déconnecter
            </Button>
          </div>
        </div>

        {/* Instructions de test */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-300">
            📋 Instructions de test
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-400">1. Test Avatar</h3>
              <ul className="ml-4 space-y-1 text-blue-700 dark:text-blue-300">
                <li>• Non connecté → Bouton "Se connecter"</li>
                <li>• Connecté sans avatar → Icône utilisateur par défaut</li>
                <li>• Connecté avec avatar → Photo de profil</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-400">2. Test Dropdown Menu</h3>
              <ul className="ml-4 space-y-1 text-blue-700 dark:text-blue-300">
                <li>• Cliquer sur l'avatar pour ouvrir le menu</li>
                <li>• Vérifier les liens selon le type (parent/enfant)</li>
                <li>• Tester la déconnexion</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-400">3. Test Notifications</h3>
              <ul className="ml-4 space-y-1 text-blue-700 dark:text-blue-300">
                <li>• Cliquer sur l'icône de cloche</li>
                <li>• Vérifier les notifications contextuelles</li>
                <li>• Tester les liens vers les pages</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-400">4. Test Responsivité</h3>
              <ul className="ml-4 space-y-1 text-blue-700 dark:text-blue-300">
                <li>• Réduire la taille de l'écran (mobile)</li>
                <li>• Vérifier que les dropdowns s'affichent correctement</li>
                <li>• Tester les interactions tactiles</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation vers les autres pages */}
        <div className="mt-8 text-center">
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Tester sur différentes pages :
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link href="/" className="text-blue-600 hover:underline">Accueil</Link>
            <span>•</span>
            <Link href="/search" className="text-blue-600 hover:underline">Recherche</Link>
            <span>•</span>
            <Link href="/account/dashboard" className="text-blue-600 hover:underline">Dashboard Parent</Link>
            <span>•</span>
            <Link href="/account/child-dashboard" className="text-blue-600 hover:underline">Dashboard Enfant</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
