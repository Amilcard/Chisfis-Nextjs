'use client'

import { useState } from 'react'
import { Button } from 'frontend/src/shared/Button'
import Link from 'next/link'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'inscription' | 'parent' | 'activites' | 'compte' | 'technique'
}

const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'inscription',
    question: 'Comment inscrire mon enfant à une activité ?',
    answer: 'Pour inscrire votre enfant, connectez-vous à votre compte parent, recherchez l\'activité souhaitée, puis cliquez sur "Inscrire". Vous recevrez une confirmation par email.'
  },
  {
    id: '2',
    category: 'parent',
    question: 'Comment fonctionne la validation parentale ?',
    answer: 'Quand votre enfant demande une inscription, vous recevez une notification. Connectez-vous à votre dashboard pour approuver ou refuser la demande avec un motif.'
  },
  {
    id: '3',
    category: 'activites',
    question: 'Que faire si une activité est complète ?',
    answer: 'Vous pouvez vous inscrire sur liste d\'attente. Nous vous préviendrons en cas de désistement ou si de nouvelles sessions sont ouvertes.'
  },
  {
    id: '4',
    category: 'compte',
    question: 'Comment créer un compte enfant ?',
    answer: 'Lors de l\'inscription, sélectionnez "Compte enfant" et renseignez l\'email de votre parent. Le parent recevra un email pour valider la création du compte.'
  },
  {
    id: '5',
    category: 'technique',
    question: 'J\'ai oublié mon mot de passe, que faire ?',
    answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion, saisissez votre email et suivez les instructions reçues par email.'
  },
  {
    id: '6',
    category: 'activites',
    question: 'Comment annuler une inscription ?',
    answer: 'Connectez-vous à votre compte, allez dans "Mes activités" et cliquez sur "Annuler" à côté de l\'activité concernée. Les conditions d\'annulation dépendent de chaque organisateur.'
  }
]

const categories = [
  { id: 'all', label: 'Toutes les questions', icon: '❓' },
  { id: 'inscription', label: 'Inscription', icon: '📝' },
  { id: 'parent', label: 'Espace Parent', icon: '👨‍👩‍👧‍👦' },
  { id: 'activites', label: 'Activités', icon: '🎯' },
  { id: 'compte', label: 'Mon Compte', icon: '👤' },
  { id: 'technique', label: 'Technique', icon: '⚙️' }
]

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const filteredFAQ = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
          Centre d'aide
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
          Trouvez rapidement les réponses à vos questions
        </p>

        {/* Barre de recherche */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher dans l'aide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 px-4 pl-12 rounded-full border border-neutral-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar catégories */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm sticky top-8">
            <h2 className="text-lg font-semibold mb-4">Catégories</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                    ${selectedCategory === category.id
                      ? 'bg-brand-green text-white'
                      : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
                    }
                  `}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="lg:col-span-3">
          {filteredFAQ.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Aucun résultat trouvé
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Essayez de modifier votre recherche ou contactez notre support
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
                {selectedCategory === 'all' 
                  ? 'Questions fréquentes' 
                  : `Questions sur: ${categories.find(c => c.id === selectedCategory)?.label}`
                }
              </h2>

              {filteredFAQ.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700"
                >
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 pr-4">
                      {item.question}
                    </h3>
                    <svg
                      className={`
                        h-5 w-5 text-neutral-500 transition-transform flex-shrink-0
                        ${expandedItems.includes(item.id) ? 'rotate-180' : ''}
                      `}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expandedItems.includes(item.id) && (
                    <div className="px-6 pb-4">
                      <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contact Support */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-brand-green to-emerald-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Notre équipe support est là pour vous aider
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              color="light" 
              className="bg-white text-brand-green hover:bg-neutral-50"
            >
              📧 Envoyer un email
            </Button>
            <Button 
              color="light" 
              className="bg-white/10 text-white border-white hover:bg-white/20"
            >
              💬 Chat en direct
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/account/dashboard" className="group">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">👨‍👩‍👧‍👦</div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-green transition-colors">
              Espace Parent
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              Gérer les inscriptions de vos enfants
            </p>
          </div>
        </Link>

        <Link href="/account/child-dashboard" className="group">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🧒</div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-green transition-colors">
              Espace Enfant
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              Découvrir et demander des activités
            </p>
          </div>
        </Link>

        <Link href="/search" className="group">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-green transition-colors">
              Rechercher
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              Trouver la parfaite activité
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
