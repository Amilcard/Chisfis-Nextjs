'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Child } from '@/types/child'

interface ChildCardProps {
  child: Child
  onEdit: (child: Child) => void
  onDelete: (childId: string) => void
  onToggleActive: (childId: string, isActive: boolean) => void
  isLoading?: boolean
}

export default function ChildCard({ 
  child, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  isLoading = false 
}: ChildCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleDelete = () => {
    onDelete(child.id)
    setShowDeleteConfirm(false)
  }

  const getAgeDisplay = () => {
    const today = new Date()
    const birthDate = new Date(child.dateOfBirth)
    const ageFromDate = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return ageFromDate - 1
    }
    return ageFromDate
  }

  return (
    <div className={`bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border-2 transition-all ${
      child.isActive 
        ? 'border-transparent hover:border-primary-200 dark:hover:border-primary-800' 
        : 'border-neutral-200 dark:border-neutral-700 opacity-60'
    }`}>
      {/* Header avec avatar et statut */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{child.avatar}</div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {child.name}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {getAgeDisplay()} ans
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Toggle actif/inactif */}
          <button
            onClick={() => onToggleActive(child.id, !child.isActive)}
            disabled={isLoading}
            className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
              child.isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
            }`}
          >
            {child.isActive ? 'Actif' : 'Inactif'}
          </button>
        </div>
      </div>

      {/* Informations principales */}
      <div className="space-y-3 mb-4">
        {child.school && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">🏫</span>
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              {child.school} {child.className && `(${child.className})`}
            </span>
          </div>
        )}

        {child.interests.length > 0 && (
          <div>
            <p className="text-xs text-neutral-500 mb-1">Centres d'intérêt</p>
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

        {child.allergies.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-500">⚠️</span>
            <span className="text-sm text-red-600 dark:text-red-400">
              {child.allergies.length} allergie(s)
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex gap-2">
          <Link
            href={`/children/${child.id}`}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            Voir profil
          </Link>
          <span className="text-neutral-300 dark:text-neutral-600">•</span>
          <Link
            href={`/child-dashboard?childId=${child.id}`}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            Dashboard
          </Link>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(child)}
            disabled={isLoading}
            className="p-2 text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
            title="Modifier"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isLoading}
            className="p-2 text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 transition-colors"
            title="Supprimer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Supprimer le profil
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Êtes-vous sûr de vouloir supprimer le profil de <strong>{child.name}</strong> ? 
              Cette action est irréversible et supprimera toutes les données associées.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Suppression...' : 'Supprimer'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
                className="flex-1 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
