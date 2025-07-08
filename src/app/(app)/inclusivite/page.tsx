'use client'

import { ApplicationLayout } from '@/app/(app)/application-layout'
import Link from 'next/link'

export default function InclusivitePage() {
  const inclusionFeatures = [
    {
      id: 1,
      title: 'Accessibilité physique',
      description: 'Toutes nos activités sont accessibles aux personnes à mobilité réduite',
      icon: '♿',
      details: ['Rampes d\'accès', 'Ascenseurs', 'Toilettes adaptées', 'Matériel spécialisé'],
      color: 'blue'
    },
    {
      id: 2,
      title: 'Accompagnement personnalisé',
      description: 'Encadrants formés pour l\'accueil des enfants à besoins spécifiques',
      icon: '🤝',
      details: ['Formation TSA', 'Encadrement renforcé', 'Adaptation des activités', 'Communication adaptée'],
      color: 'green'
    },
    {
      id: 3,
      title: 'Tarifs solidaires',
      description: 'Aides spécifiques pour les familles en situation de handicap',
      icon: '💝',
      details: ['Réduction handicap', 'MDPH acceptée', 'Paiement facilité', 'Transport gratuit'],
      color: 'purple'
    },
    {
      id: 4,
      title: 'Matériel adapté',
      description: 'Équipements spécialisés pour tous les types de handicap',
      icon: '🛠️',
      details: ['Matériel sportif adapté', 'Outils sensoriels', 'Supports visuels', 'Technologies d\'aide'],
      color: 'orange'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah, maman de Tom (autisme)',
      message: 'Tom s\'épanouit enfin dans ses activités. L\'équipe est formidable !',
      avatar: '👩'
    },
    {
      name: 'Marc, papa d\'Emma (fauteuil)',
      message: 'Emma peut pratiquer la danse comme les autres enfants. C\'est magique !',
      avatar: '👨'
    }
  ]

  return (
    <ApplicationLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">🤝 Inclusion & Accessibilité</h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              Des activités accessibles à tous les enfants, quels que soient leurs besoins
            </p>
          </div>

          {/* Nos engagements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {inclusionFeatures.map(feature => (
              <div key={feature.id} className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-neutral-600 dark:text-neutral-400">{feature.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {feature.details.map((detail, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm">{detail}</span>
                    </div>
                  ))}
                </div>
                
                <Link 
                  href={`/inclusivite/${feature.id}`}
                  className={`inline-block text-white px-4 py-2 rounded hover:opacity-90 transition-opacity ${
                    feature.color === 'blue' ? 'bg-blue-600' :
                    feature.color === 'green' ? 'bg-green-600' :
                    feature.color === 'purple' ? 'bg-purple-600' :
                    'bg-orange-600'
                  }`}
                >
                  En savoir plus →
                </Link>
              </div>
            ))}
          </div>

          {/* Témoignages */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-center mb-8">💬 Témoignages de familles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl">{testimonial.avatar}</span>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 italic">
                    "{testimonial.message}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Processus d'inscription */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">📋 Comment s'inscrire ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">1️⃣</span>
                </div>
                <h3 className="font-semibold mb-2">Prise de contact</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Appelez-nous pour discuter des besoins
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">2️⃣</span>
                </div>
                <h3 className="font-semibold mb-2">Évaluation</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Rencontre pour adapter l'activité
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">3️⃣</span>
                </div>
                <h3 className="font-semibold mb-2">Période d'essai</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Test gratuit de l'activité
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">4️⃣</span>
                </div>
                <h3 className="font-semibold mb-2">Inscription</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Démarrage de l'activité adaptée
                </p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">📞 Besoin d'aide ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Référente Inclusion</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-2">Marie Dubois</p>
                <p className="text-sm">📧 inclusion@chisfis-saint-etienne.fr</p>
                <p className="text-sm">📞 04 77 XX XX XX</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Horaires d'accueil</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Lundi au vendredi : 9h-17h<br/>
                  Permanence weekend : 10h-12h
                </p>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="text-center">
            <Link 
              href="/search?accessible=true"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold mr-4"
            >
              Voir les activités accessibles
            </Link>
            <Link 
              href="/contact"
              className="bg-neutral-200 text-neutral-800 px-8 py-3 rounded-lg hover:bg-neutral-300 transition-colors font-semibold dark:bg-neutral-700 dark:text-neutral-200"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </ApplicationLayout>
  )
}
