'use client'

import { useState } from 'react'
import { Child, ChildFormData } from '@/types/child'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'

interface ChildFormProps {
  child?: Child
  onSubmit: (data: ChildFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const AVATAR_OPTIONS = ['👦', '👧', '🧒', '👶', '🦸‍♂️', '🦸‍♀️', '🎨', '⚽', '📚', '🎭']

const INTEREST_OPTIONS = [
  'Sport', 'Art & Créatif', 'Musique', 'Danse', 'Théâtre', 'Science',
  'Cuisine', 'Lecture', 'Jeux vidéo', 'Nature', 'Animaux', 'Technologie'
]

export default function ChildForm({ child, onSubmit, onCancel, isLoading = false }: ChildFormProps) {
  const [formData, setFormData] = useState<ChildFormData>({
    name: child?.name || '',
    age: child?.age || 5,
    dateOfBirth: child?.dateOfBirth || '',
    gender: child?.gender || 'other',
    avatar: child?.avatar || '🧒',
    interests: child?.interests || [],
    allergies: child?.allergies || [],
    medicalInfo: child?.medicalInfo || '',
    emergencyContact: child?.emergencyContact || '',
    emergencyPhone: child?.emergencyPhone || '',
    school: child?.school || '',
    className: child?.className || '',
    restrictions: child?.restrictions || []
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ChildFormData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ChildFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères'
    }

    if (formData.age < 3 || formData.age > 18) {
      newErrors.age = 'L\'âge doit être entre 3 et 18 ans'
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'La date de naissance est requise'
    } else {
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      const ageFromDate = today.getFullYear() - birthDate.getFullYear()
      if (Math.abs(ageFromDate - formData.age) > 1) {
        newErrors.dateOfBirth = 'La date de naissance ne correspond pas à l\'âge'
      }
    }

    if (formData.emergencyContact && !formData.emergencyPhone) {
      newErrors.emergencyPhone = 'Le téléphone d\'urgence est requis si un contact est spécifié'
    }

    if (formData.emergencyPhone && !/^[\d\s\-\+\(\)]{10,}$/.test(formData.emergencyPhone)) {
      newErrors.emergencyPhone = 'Format de téléphone invalide'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
    }
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleAllergyAdd = (allergy: string) => {
    if (allergy.trim() && !formData.allergies.includes(allergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, allergy.trim()]
      }))
    }
  }

  const handleAllergyRemove = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }))
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
        {child ? 'Modifier le profil' : 'Ajouter un enfant'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <Label>Nom complet *</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </Field>

          <Field>
            <Label>Âge *</Label>
            <Input
              type="number"
              min="3"
              max="18"
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
              className={errors.age ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
          </Field>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field>
            <Label>Date de naissance *</Label>
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              className={errors.dateOfBirth ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
          </Field>

          <Field>
            <Label>Genre</Label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-800"
              disabled={isLoading}
            >
              <option value="male">Garçon</option>
              <option value="female">Fille</option>
              <option value="other">Autre</option>
            </select>
          </Field>
        </div>

        {/* Avatar */}
        <Field>
          <Label>Avatar</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {AVATAR_OPTIONS.map((avatar) => (
              <button
                key={avatar}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                className={`text-2xl p-2 rounded-lg border-2 transition-colors ${
                  formData.avatar === avatar
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                }`}
                disabled={isLoading}
              >
                {avatar}
              </button>
            ))}
          </div>
        </Field>

        {/* Centres d'intérêt */}
        <Field>
          <Label>Centres d'intérêt</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  formData.interests.includes(interest)
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-primary-100 dark:hover:bg-primary-900/20'
                }`}
                disabled={isLoading}
              >
                {interest}
              </button>
            ))}
          </div>
        </Field>

        {/* Informations médicales */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Informations médicales
          </h3>
          
          <Field>
            <Label>Allergies</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-full text-sm"
                  >
                    {allergy}
                    <button
                      type="button"
                      onClick={() => handleAllergyRemove(allergy)}
                      className="hover:text-red-600"
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <Input
                type="text"
                placeholder="Ajouter une allergie (appuyez sur Entrée)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAllergyAdd(e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
                disabled={isLoading}
              />
            </div>
          </Field>

          <Field>
            <Label>Informations médicales supplémentaires</Label>
            <textarea
              value={formData.medicalInfo}
              onChange={(e) => setFormData(prev => ({ ...prev, medicalInfo: e.target.value }))}
              placeholder="Traitements, conditions médicales, instructions spéciales..."
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-neutral-800 resize-none"
              rows={3}
              disabled={isLoading}
            />
          </Field>
        </div>

        {/* Contact d'urgence */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Contact d'urgence
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <Label>Nom du contact</Label>
              <Input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                placeholder="Nom complet"
                disabled={isLoading}
              />
            </Field>

            <Field>
              <Label>Téléphone d'urgence</Label>
              <Input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                placeholder="06 12 34 56 78"
                className={errors.emergencyPhone ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.emergencyPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>}
            </Field>
          </div>
        </div>

        {/* École */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Informations scolaires
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field>
              <Label>École</Label>
              <Input
                type="text"
                value={formData.school}
                onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                placeholder="Nom de l'école"
                disabled={isLoading}
              />
            </Field>

            <Field>
              <Label>Classe</Label>
              <Input
                type="text"
                value={formData.className}
                onChange={(e) => setFormData(prev => ({ ...prev, className: e.target.value }))}
                placeholder="CP, CE1, CM2..."
                disabled={isLoading}
              />
            </Field>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <ButtonPrimary
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Enregistrement...' : child ? 'Mettre à jour' : 'Ajouter l\'enfant'}
          </ButtonPrimary>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
