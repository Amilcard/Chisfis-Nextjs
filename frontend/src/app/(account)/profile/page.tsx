'use client'

import { useState, useEffect } from 'react'
import { Button } from 'frontend/src/shared/Button'
import Avatar from 'frontend/src/shared/Avatar'
import avatarImage from '@/images/avatars/Image-1.png'

interface UserProfile {
  id: string
  name: string
  email: string
  type: 'parent' | 'child'
  avatar?: string
  dateOfBirth?: string
  phone?: string
  address?: string
  emergencyContact?: string
  preferences?: {
    categories: string[]
    maxPrice: number
    notifications: {
      email: boolean
      push: boolean
      parentalValidation: boolean
    }
  }
  children?: {
    id: string
    name: string
    age: number
    interests: string[]
  }[]
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({})

  useEffect(() => {
    const authData = localStorage.getItem('authData')
    if (authData) {
      const parsed = JSON.parse(authData)
      const mockProfile: UserProfile = {
        ...parsed.user,
        dateOfBirth: '1985-06-15',
        phone: '06 12 34 56 78',
        address: '15 rue des Lilas, 75015 Paris',
        emergencyContact: 'Marie Dupont - 06 98 76 54 32',
        preferences: {
          categories: ['Sport', 'Art & Culture', 'Nature'],
          maxPrice: 50,
          notifications: {
            email: true,
            push: true,
            parentalValidation: true
          }
        },
        children: parsed.user.type === 'parent' ? [
          { id: '1', name: 'Emma', age: 8, interests: ['Danse', 'Peinture'] },
          { id: '2', name: 'Lucas', age: 12, interests: ['Football', 'Jeux vidéo'] }
        ] : undefined
      }
      setProfile(mockProfile)
      setEditForm(mockProfile)
    }
  }, [])

  const handleSave = () => {
    if (profile && editForm) {
      const updatedProfile = { ...profile, ...editForm }
      setProfile(updatedProfile)
      
      // Mettre à jour localStorage
      const authData = localStorage.getItem('authData')
      if (authData) {
        const parsed = JSON.parse(authData)
        parsed.user = { ...parsed.user, ...editForm }
        localStorage.setItem('authData', JSON.stringify(parsed))
      }
      
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditForm(profile || {})
    setIsEditing(false)
  }

  if (!profile) {
    return <div className="container mx-auto px-4 py-8">Chargement...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Mon Profil
            </h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Gérez vos informations personnelles et préférences
            </p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} color="light">
              Modifier
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button onClick={handleSave} className="bg-brand-green text-white">
                Sauvegarder
              </Button>
              <Button onClick={handleCancel} color="light">
                Annuler
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo et info de base */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
            
            <div className="flex items-center space-x-6 mb-6">
              <Avatar src={profile.avatar || avatarImage.src} className="size-20" />
              <div>
                <h3 className="text-lg font-medium">{profile.name}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {profile.type === 'parent' ? 'Compte Parent' : 'Compte Enfant'}
                </p>
                {!isEditing && (
                  <button className="mt-2 text-sm text-brand-green hover:underline">
                    Changer la photo
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom complet</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600"
                  />
                ) : (
                  <p className="p-3 bg-neutral-50 rounded-lg dark:bg-neutral-700">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600"
                  />
                ) : (
                  <p className="p-3 bg-neutral-50 rounded-lg dark:bg-neutral-700">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600"
                  />
                ) : (
                  <p className="p-3 bg-neutral-50 rounded-lg dark:bg-neutral-700">{profile.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date de naissance</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editForm.dateOfBirth || ''}
                    onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                    className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600"
                  />
                ) : (
                  <p className="p-3 bg-neutral-50 rounded-lg dark:bg-neutral-700">
                    {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('fr-FR') : 'Non renseigné'}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Adresse</label>
              {isEditing ? (
                <textarea
                  value={editForm.address || ''}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  rows={2}
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600"
                />
              ) : (
                <p className="p-3 bg-neutral-50 rounded-lg dark:bg-neutral-700">{profile.address}</p>
              )}
            </div>
          </div>

          {/* Enfants (pour les parents) */}
          {profile.type === 'parent' && profile.children && (
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Mes enfants</h2>
              <div className="space-y-4">
                {profile.children.map((child) => (
                  <div key={child.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg dark:bg-neutral-700">
                    <div>
                      <h3 className="font-medium">{child.name}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {child.age} ans • Intérêts: {child.interests.join(', ')}
                      </p>
                    </div>
                    <Button color="light" className="text-sm">
                      Voir profil
                    </Button>
                  </div>
                ))}
              </div>
              <Button color="light" className="mt-4">
                Ajouter un enfant
              </Button>
            </div>
          )}
        </div>

        {/* Préférences et paramètres */}
        <div className="space-y-6">
          {/* Préférences */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Préférences</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Catégories préférées</label>
                <div className="flex flex-wrap gap-2">
                  {['Sport', 'Art & Culture', 'Nature', 'Science', 'Musique', 'Danse'].map((category) => (
                    <span
                      key={category}
                      className={`
                        px-3 py-1 rounded-full text-sm
                        ${profile.preferences?.categories.includes(category)
                          ? 'bg-brand-green text-white'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'
                        }
                      `}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Budget maximum: {profile.preferences?.maxPrice}€
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={profile.preferences?.maxPrice || 50}
                  className="w-full"
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Notifications email</span>
                <input
                  type="checkbox"
                  checked={profile.preferences?.notifications.email}
                  disabled={!isEditing}
                  className="w-4 h-4 text-brand-green"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Notifications push</span>
                <input
                  type="checkbox"
                  checked={profile.preferences?.notifications.push}
                  disabled={!isEditing}
                  className="w-4 h-4 text-brand-green"
                />
              </div>
              
              {profile.type === 'child' && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Validation parentale</span>
                  <input
                    type="checkbox"
                    checked={profile.preferences?.notifications.parentalValidation}
                    disabled={!isEditing}
                    className="w-4 h-4 text-brand-green"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            
            <div className="space-y-3">
              <Button color="light" className="w-full text-left justify-start">
                Changer le mot de passe
              </Button>
              <Button color="light" className="w-full text-left justify-start">
                Télécharger mes données
              </Button>
              <Button color="light" className="w-full text-left justify-start text-red-600">
                Supprimer mon compte
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
