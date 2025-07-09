'use client'

import { ApplicationLayout } from 'frontend/src/app/(app)/application-layout'
import Link from 'next/link'

export default function EcoMobilitePage() {
  const ecoOptions = [
    {
      id: 1,
      title: 'Transport en commun',
      description: 'Bus et tram gratuits avec la carte jeune',
      icon: '🚌',
      advantages: ['Gratuit pour les -18 ans', 'Réseau étendu', 'Écologique'],
      color: 'green'
    },
    {
      id: 2,
      title: 'Vélo en libre-service',
      description: 'Vélos électriques disponibles en centre-ville',
      icon: '🚲',
      advantages: ['Stations nombreuses', 'Vélos électriques', 'Application mobile'],
      color: 'blue'
    },
    {
      id: 3,
      title: 'Covoiturage familial',
      description: 'Partagez les trajets avec d\'autres familles',
      icon: '🚗',
      advantages: ['Économique', 'Social', 'Réduction CO2'],
      color: 'purple'
    },
    {
      id: 4,
      title: 'Marche à pied',
      description: 'Itinéraires sécurisés vers les centres d\'activités',
      icon: '🚶',
      advantages: ['Gratuit', 'Bonne santé', 'Découverte du quartier'],
      color: 'orange'
    }
  ]

  return (
    <ApplicationLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">🚲 Éco-Mobilité</h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              Des solutions de transport durables pour vous rendre aux activités
            </p>
          </div>

          {/* Options de transport */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {ecoOptions.map(option => (
              <div key={option.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{option.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold">{option.title}</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">{option.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {option.advantages.map((advantage, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">{advantage}</span>
                    </div>
                  ))}
                </div>
                
                <Link 
                  href={`/eco-mobilite/${option.id}`}
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  En savoir plus →
                </Link>
              </div>
            ))}
          </div>

          {/* Calculateur d'impact */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">🌱 Calculez votre impact</h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Découvrez combien de CO2 vous économisez en choisissant l'éco-mobilité
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">2.3 kg</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">CO2 économisé/semaine</div>
              </div>
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">45€</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Économisé/mois</div>
              </div>
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">95%</div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Familles satisfaites</div>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center">
            <Link 
              href="/search"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold mr-4"
            >
              Rechercher des activités accessibles
            </Link>
            <Link 
              href="/account/profile"
              className="bg-neutral-200 text-neutral-800 px-8 py-3 rounded-lg hover:bg-neutral-300 transition-colors font-semibold dark:bg-neutral-700 dark:text-neutral-200"
            >
              Configurer mes préférences
            </Link>
          </div>
        </div>
      </div>
    </ApplicationLayout>
  )
}
