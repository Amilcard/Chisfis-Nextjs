'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from 'frontend/src/shared/Button';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import PostInscriptionFlow from './PostInscriptionFlow';

interface Props {
  activity: any;
  onClose?: () => void;
}

interface QuickSignupData {
  email: string;
  password: string;
  prenomParent?: string;
  prenomEnfant: string;
  ageEnfant: number;
}

export default function QuickInscriptionForm({ activity, onClose }: Props) {
  const [formData, setFormData] = useState<QuickSignupData>({
    email: '',
    password: '',
    prenomParent: '',
    prenomEnfant: '',
    ageEnfant: 8
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'success' | 'flow'>('form');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ageEnfant' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Créer le compte parent
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          prenomParent: formData.prenomParent,
          isQuickSignup: true
        })
      });

      if (!registerResponse.ok) {
        throw new Error('Erreur lors de la création du compte');
      }

      const { user } = await registerResponse.json();

      // 2. Créer le profil enfant
      const childResponse = await fetch('/api/children/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentId: user.id,
          prenom: formData.prenomEnfant,
          age: formData.ageEnfant
        })
      });

      if (!childResponse.ok) {
        throw new Error('Erreur lors de la création du profil enfant');
      }

      const { child } = await childResponse.json();

      // 3. Inscrire à l'activité
      const inscriptionResponse = await fetch('/api/activities/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: child.id,
          activityId: activity.id
        })
      });

      if (!inscriptionResponse.ok) {
        throw new Error('Erreur lors de l\'inscription à l\'activité');
      }

      // Sauvegarder l'auth
      localStorage.setItem('authData', JSON.stringify({ user, token: 'quick-signup' }));
      
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartFlow = () => {
    setStep('flow');
  };

  const handleSkipFlow = () => {
    router.push('/dashboard');
    if (onClose) onClose();
  };

  const handleCompleteFlow = () => {
    router.push('/dashboard');
    if (onClose) onClose();
  };

  if (step === 'flow') {
    return (
      <div className="bg-white rounded-xl max-w-4xl mx-auto border border-gray-200 overflow-hidden">
        {onClose && (
          <div className="flex justify-end p-4 border-b border-gray-200">
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <PostInscriptionFlow 
          activityTitle={activity.title}
          activityLocation={activity.address || activity.location}
          onComplete={handleCompleteFlow}
        />
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="bg-white p-8 rounded-xl max-w-md mx-auto border border-gray-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎉</span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Bravo, votre inscription est enregistrée !
          </h3>
          
          <p className="text-gray-600 mb-4">
            <strong>{formData.prenomEnfant}</strong> est maintenant inscrit(e) à <strong>{activity.title}</strong>.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm mb-3">
              💡 <strong>Le saviez-vous ?</strong> En France, de nombreuses familles peuvent bénéficier d'aides pour financer les activités de leurs enfants.
            </p>
            <p className="text-blue-700 text-sm font-medium">
              Voulez-vous estimer vos droits en moins de 2 minutes ?
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleStartFlow}
              className="w-full bg-brand-green hover:bg-brand-green/90 text-white py-3 rounded-lg font-medium"
            >
              👉 Oui, je vérifie mes aides
            </Button>
            
            <Button 
              onClick={handleSkipFlow}
              color="light"
              className="w-full py-3 rounded-lg font-medium"
            >
              👉 Non merci, je continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl max-w-md mx-auto border border-gray-200">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenue ! 👋
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          En quelques secondes, créez votre compte pour inscrire votre enfant à <strong>{activity.title}</strong>.
        </p>
      </div>

      {/* Message rassurant */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <p className="text-green-800 text-sm">
          ✨ <strong>Aucun document ni info inutile</strong> à ce stade. Une fois inscrit, nous vous proposerons de vérifier si vous avez droit à des aides financières ou à un accompagnement éco-mobilité.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="votre@email.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green"
            required
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Choisissez un mot de passe"
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green"
              required
              minLength={6}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Prénom parent (optionnel) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Votre prénom <span className="text-gray-400">(recommandé)</span>
          </label>
          <input
            type="text"
            name="prenomParent"
            value={formData.prenomParent}
            onChange={handleChange}
            placeholder="Votre prénom"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 text-sm">Votre enfant</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Prénom enfant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prénom de l'enfant *
          </label>
          <input
            type="text"
            name="prenomEnfant"
            value={formData.prenomEnfant}
            onChange={handleChange}
            placeholder="Prénom de votre enfant"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green"
            required
          />
        </div>

        {/* Âge enfant */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Âge de l'enfant *
          </label>
          <select
            name="ageEnfant"
            value={formData.ageEnfant}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green"
            required
          >
            {Array.from({ length: 15 }, (_, i) => i + 3).map(age => (
              <option key={age} value={age}>{age} ans</option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-green hover:bg-brand-green/90 text-white py-3 rounded-lg font-medium disabled:opacity-50"
          >
            {isLoading ? 'Création en cours...' : '🚀 Créer mon compte et inscrire mon enfant'}
          </Button>

          <div className="text-center">
            <Link 
              href="/"
              className="text-sm text-gray-600 hover:text-brand-green transition-colors"
            >
              Je veux juste explorer pour l'instant
            </Link>
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="text-center mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Déjà un compte ? <Link href="/auth/signin" className="text-brand-green hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
