'use client'

import ButtonPrimary from '@/shared/ButtonPrimary'
import { Field, Label } from '@/shared/fieldset'
import Input from '@/shared/Input'
import Logo from '@/shared/Logo'
import T from '@/utils/getT'
import Link from 'next/link'
import { useState } from 'react'

const Page = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Un lien de réinitialisation a été envoyé à votre adresse e-mail.')
        setEmail('')
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
            Mot de passe oublié
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
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
              {T['login']['Email address']}
            </Label>
            <Input 
              type="email" 
              placeholder="exemple@exemple.com" 
              className="mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </Field>

          <ButtonPrimary type="submit" disabled={loading || !email}>
            {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
          </ButtonPrimary>
        </form>

        {/* ==== */}
        <div className="block text-center text-sm text-neutral-700 dark:text-neutral-300">
          Vous vous souvenez de votre mot de passe ? {` `}
          <Link href="/login" className="font-medium underline">
            Se connecter
          </Link>
          {`  ou  `}
          <Link href="/signup" className="font-medium underline">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page
