'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Logo from '@/shared/Logo'
import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

// Le vrai composant "inner"
const ResetPasswordPageInner = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [token, setToken] = useState('')
  
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const tokenFromUrl = searchParams?.get('token')
    if (tokenFromUrl) {
      setToken(tokenFromUrl)
    } else {
      setError('Token de réinitialisation manquant ou invalide')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    // Validation côté client
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Votre mot de passe a été réinitialisé avec succès.')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError(data.message || 'Une erreur est survenue')
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="my-16 flex justify-center">
        <Logo className="w-32" />
      </div>

      <div className="mx-auto max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Réinitialiser le mot de passe
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Entrez votre nouveau mot de passe ci-dessous.
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {message}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FORM */}
        <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">
              Nouveau mot de passe
            </Label>
            <Input 
              type="password" 
              placeholder="Entrez votre nouveau mot de passe" 
              className="mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={8}
            />
            <p className="mt-1 text-xs text-neutral-500">
              Le mot de passe doit contenir au moins 8 caractères
            </p>
          </Field>

          <Field className="block">
            <Label className="text-neutral-800 dark:text-neutral-200">
              Confirmer le mot de passe
            </Label>
            <Input 
              type="password" 
              placeholder="Confirmez votre nouveau mot de passe" 
              className="mt-1"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              minLength={8}
            />
          </Field>

          <ButtonPrimary 
            type="submit" 
            disabled={loading || !password || !confirmPassword || !token}
          >
            {loading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
          </ButtonPrimary>
        </form>

        {/* ==== */}
        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          Vous vous souvenez de votre mot de passe ? {` `}
          <Link href="/login" className="font-medium underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  )
}

// Composant principal wrappé dans Suspense pour Next.js 14+
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="container">
        <div className="my-16 flex justify-center">
          <Logo className="w-32" />
        </div>
        <div className="mx-auto max-w-md text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    }>
      <ResetPasswordPageInner />
    </Suspense>
  )
}
