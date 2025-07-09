'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Child } from 'frontend/src/types/child'
import childrenService from 'frontend/src/lib/children-service'

export default function ChildrenListPage() {
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Simulation de l'ID parent (en production, récupérer depuis l'auth/session)
  const currentParentId = 'parent-1'

  useEffect(() => {
    loadChildren()
  }, [])

  const loadChildren = async () => {
    try {
      setLoading(true)
      setError('')
      const childrenData = await childrenService.getChildrenByParent(currentParentId)
      setChildren(childrenData.filter(c => c.isActive))
    } catch (err) {
      setError('Erreur lors du chargement des enfants')
      console.error('Erreur loadChildren:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Chargement...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Erreur de chargement
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-8">{error}</p>
          <button
            onClick={loadChildren}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Vos enfants
        </h1>
        <Link
          href="/manage-children"
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          Gérer les profils
        </Link>
      </div>

      {children.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">👶</div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Aucun enfant enregistré
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            Créez le profil de votre premier enfant pour commencer.
          </p>
          <Link
            href="/manage-children"
            className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Ajouter un enfant
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {children.map((child) => (
            <div
              key={child.id}
              className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{child.avatar}</div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {child.name}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {child.age} ans
                  </p>
                </div>
              </div>

              {child.interests.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-neutral-500 mb-2">Centres d'intérêt</p>
                  <div className="flex flex-wrap gap-1">
                    {child.interests.slice(0, 3).map((interest, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 rounded-full text-xs"
                      >
                        {interest}
                      </span>
                    ))}
                    {child.interests.length > 3 && (
                      <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full text-xs">
                        +{child.interests.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <Link
                  href={`/children/${child.id}`}
                  className="flex-1 text-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                >
                  Voir profil
                </Link>
                <Link
                  href={`/child-dashboard?childId=${child.id}`}
                  className="flex-1 text-center px-4 py-2 border border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}