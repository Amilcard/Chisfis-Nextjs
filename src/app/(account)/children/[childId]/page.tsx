'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Child, Achievement, ChildRequest } from '@/types/child'
import childrenService from '@/lib/children-service'

interface ChildPageProps {
  params: Promise<{
    childId: string
  }>
}

export default function ChildPage({ params }: ChildPageProps) {
  const [child, setChild] = useState<Child | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [requests, setRequests] = useState<ChildRequest[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [childId, setChildId] = useState<string>('')

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setChildId(resolvedParams.childId)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (childId) {
      loadChildData()
    }
  }, [childId])

  const loadChildData = async () => {
    try {
      setLoading(true)
      setError('')

      const [childData, achievementsData, requestsData, statsData] = await Promise.all([
        childrenService.getChild(childId),
        childrenService.getChildAchievements(childId),
        childrenService.getChildRequests(childId),
        childrenService.getChildStats(childId)
      ])

      if (!childData) {
        notFound()
        return
      }

      setChild(childData)
      setAchievements(achievementsData)
      setRequests(requestsData)
      setStats(statsData)
    } catch (err) {
      setError('Erreur lors du chargement des données')
      console.error('Erreur loadChildData:', err)
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
            <p className="text-neutral-600 dark:text-neutral-400">Chargement du profil...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !child) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Erreur de chargement
          </h2>
          <p className="text-red-600 dark:text-red-400 mb-8">
            {error || 'Profil enfant non trouvé'}
          </p>
          <Link
            href="/children/list"
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Retour à la liste
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/children/list"
            className="p-2 text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="text-4xl">{child.avatar}</div>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {child.name}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {child.age} ans • {child.school} {child.className && `(${child.className})`}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link
            href={`/child-dashboard?childId=${child.id}`}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Dashboard enfant
          </Link>
          <Link
            href="/manage-children"
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            Modifier
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-8">
          {/* Informations générales */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
              Informations générales
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-neutral-500">Date de naissance</label>
                <p className="text-neutral-900 dark:text-neutral-100">
                  {new Date(child.dateOfBirth).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-500">Genre</label>
                <p className="text-neutral-900 dark:text-neutral-100">
                  {child.gender === 'male' ? 'Garçon' : child.gender === 'female' ? 'Fille' : 'Autre'}
                </p>
              </div>
              {child.emergencyContact && (
                <>
                  <div>
                    <label className="text-sm font-medium text-neutral-500">Contact d'urgence</label>
                    <p className="text-neutral-900 dark:text-neutral-100">{child.emergencyContact}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-500">Téléphone d'urgence</label>
                    <p className="text-neutral-900 dark:text-neutral-100">{child.emergencyPhone}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Centres d'intérêt */}
          {child.interests.length > 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                Centres d'intérêt
              </h2>
              <div className="flex flex-wrap gap-2">
                {child.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Informations médicales */}
          {(child.allergies.length > 0 || child.medicalInfo) && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                Informations médicales
              </h2>
              
              {child.allergies.length > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-red-500 block mb-2">Allergies</label>
                  <div className="flex flex-wrap gap-2">
                    {child.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-full text-sm font-medium"
                      >
                        ⚠️ {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {child.medicalInfo && (
                <div>
                  <label className="text-sm font-medium text-neutral-500 block mb-2">Informations supplémentaires</label>
                  <p className="text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
                    {child.medicalInfo}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Achievements récents */}
          {achievements.length > 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                Derniers accomplissements
              </h2>
              <div className="space-y-4">
                {achievements.slice(0, 3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                  >
                    <div className="text-2xl">{achievement.badgeIcon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(achievement.date).toLocaleDateString('fr-FR')} • {achievement.points} points
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistiques */}
          {stats && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                Statistiques
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Activités totales</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {stats.totalActivities}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Complétées</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {stats.completedActivities}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Accomplissements</span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400">
                    {stats.achievements}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Points totaux</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {stats.totalPoints}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Demandes récentes */}
          {requests.length > 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                Demandes récentes
              </h3>
              <div className="space-y-3">
                {requests.slice(0, 3).map((request) => (
                  <div
                    key={request.id}
                    className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        Activité #{request.activityId}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                        request.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      }`}>
                        {request.status === 'pending' ? 'En attente' :
                         request.status === 'approved' ? 'Approuvé' : 'Refusé'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {new Date(request.requestDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions rapides */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Actions rapides
            </h3>
            <div className="space-y-3">
              <Link
                href="/search"
                className="block w-full text-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Rechercher activités
              </Link>
              <Link
                href="/favorites"
                className="block w-full text-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Favoris
              </Link>
              <Link
                href="/my-requests"
                className="block w-full text-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Mes demandes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}