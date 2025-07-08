'use client'

import { ApplicationLayout } from '@/app/(app)/application-layout'
import Link from 'next/link'

export default function OnboardingPage() {
  return (
    <ApplicationLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Bienvenue sur Chisfis !</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8">
            Découvrez des activités incroyables pour vos enfants et votre famille à Saint-Étienne.
          </p>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Prêt à commencer ?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/signup"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer un compte
              </Link>
              <Link 
                href="/search"
                className="bg-neutral-200 text-neutral-800 px-6 py-3 rounded-lg hover:bg-neutral-300 transition-colors dark:bg-neutral-700 dark:text-neutral-200"
              >
                Explorer les activités
              </Link>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="font-semibold">Activités ciblées</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Trouvez des activités adaptées à l'âge et aux intérêts de vos enfants
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💰</div>
              <h3 className="font-semibold">Aides financières</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Bénéficiez d'aides selon votre quotient familial
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🌱</div>
              <h3 className="font-semibold">Éco-mobilité</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Déplacements durables et accessibles
              </p>
            </div>
          </div>
        </div>
      </div>
    </ApplicationLayout>
  )
}
