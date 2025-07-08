'use client'

import { useState, useEffect } from 'react'
import { Child, ChildFormData } from '@/types/child'
import ChildForm from '@/components/Profile/ChildForm'
import ChildCard from '@/components/Profile/ChildCard'
import childrenService from '@/lib/children-service'
import ButtonPrimary from '@/shared/ButtonPrimary'

export default function ManageChildrenPage() {
  const [children, setChildren] = useState<Child[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingChild, setEditingChild] = useState<Child | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

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
      setChildren(childrenData)
    } catch (err) {
      setError('Erreur lors du chargement des profils enfants')
      console.error('Erreur loadChildren:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddChild = () => {
    setEditingChild(null)
    setShowForm(true)
    setError('')
    setSuccessMessage('')
  }

  const handleEditChild = (child: Child) => {
    setEditingChild(child)
    setShowForm(true)
    setError('')
    setSuccessMessage('')
  }

  const handleFormSubmit = async (data: ChildFormData) => {
    try {
      setActionLoading(true)
      setError('')

      if (editingChild) {
        // Modification
        await childrenService.updateChild(editingChild.id, data)
        setSuccessMessage(`Profil de ${data.name} mis à jour avec succès`)
      } else {
        // Création
        await childrenService.createChild(currentParentId, data)
        setSuccessMessage(`Profil de ${data.name} créé avec succès`)
      }

      await loadChildren()
      setShowForm(false)
      setEditingChild(null)
    } catch (err) {
      setError('Erreur lors de l\'enregistrement du profil')
      console.error('Erreur handleFormSubmit:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteChild = async (childId: string) => {
    try {
      setActionLoading(true)
      setError('')
      
      const child = children.find(c => c.id === childId)
      await childrenService.deleteChild(childId)
      
      setSuccessMessage(`Profil de ${child?.name} supprimé avec succès`)
      await loadChildren()
    } catch (err) {
      setError('Erreur lors de la suppression du profil')
      console.error('Erreur handleDeleteChild:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleActive = async (childId: string, isActive: boolean) => {
    try {
      setActionLoading(true)
      setError('')
      
      await childrenService.toggleChildActive(childId, isActive)
      await loadChildren()
      
      const child = children.find(c => c.id === childId)
      setSuccessMessage(`Profil de ${child?.name} ${isActive ? 'activé' : 'désactivé'} avec succès`)
    } catch (err) {
      setError('Erreur lors de la modification du statut')
      console.error('Erreur handleToggleActive:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingChild(null)
    setError('')
  }

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600 dark:text-neutral-400">Chargement des profils...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Gestion des profils enfants
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Créez et gérez les profils de vos enfants pour personnaliser leur expérience
          </p>
        </div>
        
        {!showForm && (
          <ButtonPrimary onClick={handleAddChild} disabled={actionLoading}>
            + Ajouter un enfant
          </ButtonPrimary>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-red-500">⚠️</span>
            <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✅</span>
            <p className="text-green-800 dark:text-green-200 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Formulaire d'ajout/édition */}
      {showForm && (
        <div className="mb-8">
          <ChildForm
            child={editingChild || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={actionLoading}
          />
        </div>
      )}

      {/* Liste des enfants */}
      {children.length === 0 && !showForm ? (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">👶</div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Aucun profil enfant
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md mx-auto">
            Commencez par créer le profil de votre premier enfant pour personnaliser son expérience sur la plateforme.
          </p>
          <ButtonPrimary onClick={handleAddChild} disabled={actionLoading}>
            Créer le premier profil
          </ButtonPrimary>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              onEdit={handleEditChild}
              onDelete={handleDeleteChild}
              onToggleActive={handleToggleActive}
              isLoading={actionLoading}
            />
          ))}
        </div>
      )}

      {/* Statistiques rapides */}
      {children.length > 0 && !showForm && (
        <div className="mt-12 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Résumé
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {children.length}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Enfant{children.length > 1 ? 's' : ''} total
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {children.filter(c => c.isActive).length}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Profil{children.filter(c => c.isActive).length > 1 ? 's' : ''} actif{children.filter(c => c.isActive).length > 1 ? 's' : ''}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {children.reduce((sum, c) => sum + c.interests.length, 0)}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Centres d'intérêt
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {children.reduce((sum, c) => sum + c.allergies.length, 0)}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Allergie{children.reduce((sum, c) => sum + c.allergies.length, 0) > 1 ? 's' : ''} déclarée{children.reduce((sum, c) => sum + c.allergies.length, 0) > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
