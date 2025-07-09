'use client'

import dynamic from 'next/dynamic'

// Import dynamique pour éviter l'erreur SSR avec Leaflet
const MapResults = dynamic(() => import('frontend/src/components/Map/MapResults'), {
  ssr: false,
  loading: () => <p>Chargement de la carte...</p>
})

export default function TestMapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Test de la Carte des Activités
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Voici un aperçu de la carte interactive des activités avec des données de démonstration.
        </p>
      </div>

      {/* Carte avec hauteur normale */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Carte Standard (400px)</h2>
        <MapResults />
      </div>

      {/* Carte plus grande */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Carte Grande (600px)</h2>
        <MapResults height="600px" />
      </div>

      {/* Carte avec zoom différent */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Carte Zoom éloigné (300px)</h2>
        <MapResults 
          height="300px" 
          zoom={12}
          center={[45.4397, 4.3872]}
        />
      </div>
    </div>
  )
}
