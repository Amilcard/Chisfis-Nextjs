'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Interface pour les activités
interface Activity {
  id: string
  title: string
  description: string
  lat: number
  lng: number
  address: string
  price: number
  category: string
  imageUrl?: string
}

interface MapResultsProps {
  activities?: Activity[]
  center?: [number, number]
  zoom?: number
  height?: string
  className?: string
}

// Données mock pour tester
const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Cours de Tennis',
    description: 'Cours de tennis pour enfants de 6 à 12 ans',
    lat: 45.4397,
    lng: 4.3872,
    address: '42 Rue de la République, Saint-Étienne',
    price: 25,
    category: 'Sport',
    imageUrl: '/images/activities/tennis.jpg'
  },
  {
    id: '2',
    title: 'Atelier Poterie',
    description: 'Découverte de la poterie pour les familles',
    lat: 45.4484,
    lng: 4.3917,
    address: '15 Avenue de la Libération, Saint-Étienne',
    price: 30,
    category: 'Art & Créatif',
    imageUrl: '/images/activities/pottery.jpg'
  },
  {
    id: '3',
    title: 'Cours de Natation',
    description: 'Apprentissage de la natation pour enfants',
    lat: 45.4350,
    lng: 4.3950,
    address: '8 Boulevard Thiers, Saint-Étienne',
    price: 20,
    category: 'Sport',
    imageUrl: '/images/activities/swimming.jpg'
  },
  {
    id: '4',
    title: 'Théâtre Enfants',
    description: 'Initiation au théâtre pour les 8-14 ans',
    lat: 45.4420,
    lng: 4.3800,
    address: '25 Rue Gambetta, Saint-Étienne',
    price: 35,
    category: 'Théâtre & Spectacle',
    imageUrl: '/images/activities/theater.jpg'
  },
  {
    id: '5',
    title: 'Escape Game Famille',
    description: 'Escape game adapté aux familles avec enfants',
    lat: 45.4380,
    lng: 4.4000,
    address: '12 Cours Fauriel, Saint-Étienne',
    price: 45,
    category: 'Loisirs & Jeux',
    imageUrl: '/images/activities/escape.jpg'
  }
]

export default function MapResults({
  activities = mockActivities,
  center = [45.4397, 4.3872],
  zoom = 13,
  height = "400px",
  className = ""
}: MapResultsProps) {
  const [isClient, setIsClient] = useState(false)

  const customStyles = `
    .leaflet-container {
      width: 100% !important;
      height: 100% !important;
      border-radius: 16px;
    }
    .leaflet-popup-content-wrapper {
      border-radius: 12px;
      border: 0;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    .leaflet-popup-content {
      padding: 0;
      margin: 0;
    }
    .leaflet-popup-close-button {
      color: #6b7280;
      font-size: 18px;
      font-weight: bold;
      top: 8px !important;
      right: 8px !important;
    }
    .leaflet-popup-close-button:hover {
      color: #374151;
    }
    .leaflet-control-zoom {
      border: 0;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    .leaflet-control-zoom a {
      background-color: white;
      color: #374151;
      border: 0;
    }
    .leaflet-control-zoom a:hover {
      background-color: #f9fafb;
    }
    .leaflet-control-attribution {
      background-color: rgba(255, 255, 255, 0.8);
      font-size: 11px;
    }
  `

  useEffect(() => {
    setIsClient(true)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Sport':
        return '⚽'
      case 'Art & Créatif':
        return '🎨'
      case 'Théâtre & Spectacle':
        return '🎭'
      case 'Loisirs & Jeux':
        return '🎮'
      default:
        return '📍'
    }
  }

  // Éviter le rendu côté serveur pour Leaflet
  if (!isClient) {
    return (
      <div 
        className={`flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-2xl ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-neutral-600 dark:text-neutral-400">Chargement de la carte...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{customStyles}</style>
      <div 
        className={`relative rounded-2xl overflow-hidden ${className}`} 
        style={{ height }}
      >
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          className="rounded-2xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {activities.map((activity) => (
            <Marker
              key={activity.id}
              position={[activity.lat, activity.lng]}
            >
              <Popup maxWidth={300} className="custom-popup">
                <div className="p-2">
                  {activity.imageUrl && (
                    <img 
                      src={activity.imageUrl} 
                      alt={activity.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-activity.jpg'
                      }}
                    />
                  )}
                  <h3 className="font-semibold text-lg text-neutral-900 mb-1">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-neutral-600 mb-2">
                    {activity.description}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                      {getNotificationIcon(activity.category)}
                      {activity.category}
                    </span>
                    <span className="font-bold text-primary-600">
                      {activity.price}€
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mb-3">
                    📍 {activity.address}
                  </p>
                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                    Voir les détails
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Légende */}
        <div className="absolute top-4 right-4 bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-lg z-[1000]">
          <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-2">
            Activités ({activities.length})
          </h4>
          <div className="flex flex-col space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-neutral-700 dark:text-neutral-300">Marqueurs d'activités</span>
            </div>
            <p className="text-neutral-500 text-xs mt-1">
              Cliquez sur un marqueur pour plus d'infos
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
