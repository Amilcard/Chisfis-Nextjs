'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Divider } from '@/shared/divider'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Select from '@/shared/Select'

export default function AccountSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deactivateReason, setDeactivateReason] = useState('')

  const handleDeactivateAccount = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/account/deactivate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: deactivateReason }),
      })

      if (response.ok) {
        alert('Votre compte a été désactivé. Vous pouvez le réactiver en vous connectant à nouveau.')
        router.push('/login')
      } else {
        throw new Error('Erreur lors de la désactivation')
      }
    } catch (error) {
      alert('Erreur lors de la désactivation du compte')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirmText !== 'SUPPRIMER') {
      alert('Veuillez taper "SUPPRIMER" pour confirmer')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        alert('Votre compte a été supprimé définitivement.')
        router.push('/')
      } else {
        throw new Error('Erreur lors de la suppression')
      }
    } catch (error) {
      alert('Erreur lors de la suppression du compte')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* HEADING */}
      <h1 className="text-3xl font-semibold">Paramètres du compte</h1>
      
      <Divider className="my-8 w-14!" />

      {/* SECTIONS */}
      <div className="space-y-12">
        
        {/* SECTION: Notifications */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
              <div>
                <h3 className="font-medium">Notifications par email</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Recevoir des notifications importantes par email
                </p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
              <div>
                <h3 className="font-medium">Notifications d'activités</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Recevoir des suggestions d'activités
                </p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
              <div>
                <h3 className="font-medium">Rappels d'inscriptions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Recevoir des rappels pour les inscriptions en attente
                </p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
          </div>
        </div>

        {/* SECTION: Confidentialité */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Confidentialité</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
              <div>
                <h3 className="font-medium">Profil public</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Rendre votre profil visible aux autres utilisateurs
                </p>
              </div>
              <input type="checkbox" className="toggle" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
              <div>
                <h3 className="font-medium">Partage de données</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Autoriser le partage de données avec les partenaires
                </p>
              </div>
              <input type="checkbox" className="toggle" />
            </div>
          </div>
        </div>

        {/* SECTION: Gestion du compte */}
        <div>
          <h2 className="text-xl font-semibold mb-6 text-red-600">Gestion du compte</h2>
          
          {/* Désactivation temporaire */}
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
              Désactiver temporairement mon compte
            </h3>
            <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
              Votre compte sera désactivé mais vos données seront conservées. 
              Vous pourrez le réactiver à tout moment en vous reconnectant.
            </p>
            <button 
              onClick={() => setShowDeactivateModal(true)}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm"
            >
              Désactiver mon compte
            </button>
          </div>

          {/* Suppression définitive */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
              Supprimer définitivement mon compte
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              ⚠️ <strong>Attention :</strong> Cette action est irréversible. 
              Toutes vos données seront supprimées définitivement.
            </p>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Supprimer mon compte
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: Désactivation */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Désactiver votre compte</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Pourquoi souhaitez-vous désactiver votre compte ?
            </p>
            
            <Field className="mb-4">
              <Label>Raison (optionnel)</Label>
              <Select 
                value={deactivateReason} 
                onChange={(e) => setDeactivateReason(e.target.value)}
                className="mt-1.5"
              >
                <option value="">Sélectionnez une raison</option>
                <option value="temporary_break">Pause temporaire</option>
                <option value="too_busy">Trop occupé(e)</option>
                <option value="privacy_concerns">Préoccupations de confidentialité</option>
                <option value="other">Autre</option>
              </Select>
            </Field>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                Annuler
              </button>
              <button 
                onClick={handleDeactivateAccount}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Désactivation...' : 'Désactiver'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-red-600">
              Supprimer définitivement votre compte
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Cette action est <strong>irréversible</strong>. Toutes vos données, 
              y compris les profils de vos enfants, seront supprimées définitivement.
            </p>
            
            <Field className="mb-4">
              <Label>Tapez "SUPPRIMER" pour confirmer</Label>
              <Input 
                value={confirmText} 
                onChange={(e) => setConfirmText(e.target.value)}
                className="mt-1.5"
                placeholder="SUPPRIMER"
              />
            </Field>

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowDeleteModal(false)
                  setConfirmText('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-neutral-700"
              >
                Annuler
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={loading || confirmText !== 'SUPPRIMER'}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Suppression...' : 'Supprimer définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
