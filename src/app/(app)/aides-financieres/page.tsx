'use client'

import { ApplicationLayout } from '@/app/(app)/application-layout'
import Link from 'next/link'
import { useState } from 'react'

export default function AidesFinancieresPage() {
  const [selectedQF, setSelectedQF] = useState<string>('')

  const aidesDisponibles = [
    {
      id: 1,
      title: 'Quotient familial inférieur à 500€',
      description: 'Réduction de 80% sur toutes les activités',
      eligibility: 'QF < 500€',
      reduction: '80%',
      example: 'Activité à 50€ → 10€',
      color: 'green'
    },
    {
      id: 2,
      title: 'Quotient familial 500€ - 800€',
      description: 'Réduction de 60% sur toutes les activités',
      eligibility: 'QF 500€ - 800€',
      reduction: '60%',
      example: 'Activité à 50€ → 20€',
      color: 'blue'
    },
    {
      id: 3,
      title: 'Quotient familial 800€ - 1200€',
      description: 'Réduction de 40% sur toutes les activités',
      eligibility: 'QF 800€ - 1200€',
      reduction: '40%',
      example: 'Activité à 50€ → 30€',
      color: 'yellow'
    },
    {
      id: 4,
      title: 'Paiement en plusieurs fois',
      description: 'Échelonnement possible pour tous',
      eligibility: 'Tous les quotients',
      reduction: 'Facilités de paiement',
      example: '3x sans frais',
      color: 'purple'
    }
  ]

  return (
    <ApplicationLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">💰 Aides Financières</h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              Des activités accessibles à tous grâce aux aides de la ville de Saint-Étienne
            </p>
          </div>

          {/* Simulateur rapide */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">🧮 Calculez votre aide</h2>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Votre quotient familial (€)</label>
                <input
                  type="number"
                  value={selectedQF}
                  onChange={(e) => setSelectedQF(e.target.value)}
                  placeholder="Ex: 650"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-800 dark:border-neutral-600"
                />
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Calculer mon aide
              </button>
            </div>
            {selectedQF && (
              <div className="mt-4 p-4 bg-white dark:bg-neutral-800 rounded-lg">
                <p className="font-semibold text-green-600">
                  💡 Avec un QF de {selectedQF}€, vous bénéficiez d'une réduction de{' '}
                  {parseInt(selectedQF) < 500 ? '80%' : 
                   parseInt(selectedQF) < 800 ? '60%' : 
                   parseInt(selectedQF) < 1200 ? '40%' : '0%'}
                </p>
              </div>
            )}
          </div>

          {/* Grille des aides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {aidesDisponibles.map(aide => (
              <div key={aide.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                  aide.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                  aide.color === 'blue' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' :
                  aide.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
                  'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200'
                }`}>
                  {aide.reduction}
                </div>
                <h3 className="text-xl font-semibold mb-2">{aide.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">{aide.description}</p>
                <div className="space-y-2">
                  <p className="text-sm"><strong>Éligibilité:</strong> {aide.eligibility}</p>
                  <p className="text-sm"><strong>Exemple:</strong> {aide.example}</p>
                </div>
                <Link 
                  href={`/aides-financieres/${aide.id}`}
                  className="inline-block mt-4 text-blue-600 hover:underline font-medium"
                >
                  En savoir plus →
                </Link>
              </div>
            ))}
          </div>

          {/* Comment postuler */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">📋 Comment bénéficier des aides ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">1️⃣</span>
                </div>
                <h3 className="font-semibold mb-2">Créez votre compte</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Inscrivez-vous sur la plateforme avec vos informations
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">2️⃣</span>
                </div>
                <h3 className="font-semibold mb-2">Renseignez votre QF</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Indiquez votre quotient familial dans votre profil
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">3️⃣</span>
                </div>
                <h3 className="font-semibold mb-2">Réduction automatique</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Les tarifs réduits s'appliquent automatiquement
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="text-center">
            <Link 
              href="/auth/signup"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold mr-4"
            >
              Créer mon compte
            </Link>
            <Link 
              href="/account/profile"
              className="bg-neutral-200 text-neutral-800 px-8 py-3 rounded-lg hover:bg-neutral-300 transition-colors font-semibold dark:bg-neutral-700 dark:text-neutral-200"
            >
              Mettre à jour mon profil
            </Link>
          </div>
        </div>
      </div>
    </ApplicationLayout>
  )
}
