import { NextRequest, NextResponse } from 'next/server';

interface MobilityRequest {
  from: string;
  to: string;
  activityId?: string;
  preferences?: {
    maxDuration?: number;
    maxCost?: number;
    ecoFriendlyOnly?: boolean;
    accessibilityNeeded?: boolean;
  };
}

interface MobilityOption {
  id: string;
  type: 'public' | 'bike' | 'carpool' | 'walk' | 'scooter';
  name: string;
  duration: number; // en minutes
  cost: number; // en euros (0 si gratuit)
  ecological: boolean;
  accessibility: boolean;
  description: string;
  route: {
    steps: string[];
    distance: number; // en km
    carbonFootprint: number; // en g CO2
  };
  schedule?: {
    departure: string;
    arrival: string;
    frequency: string;
  };
  subsidies?: {
    available: boolean;
    description: string;
    savingAmount: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const data: MobilityRequest = await request.json();
    
    // Validation des données
    if (!data.from || !data.to) {
      return NextResponse.json(
        { message: 'Adresse de départ et d\'arrivée requises' },
        { status: 400 }
      );
    }

    // Géolocalisation simulée
    const fromCoords = await simulateGeolocation(data.from);
    const toCoords = await simulateGeolocation(data.to);
    
    if (!fromCoords || !toCoords) {
      return NextResponse.json(
        { message: 'Impossible de localiser une des adresses' },
        { status: 400 }
      );
    }

    // Calcul des options de mobilité
    const options = await calculateMobilityOptions(fromCoords, toCoords, data.preferences);
    
    // Recommandations personnalisées
    const recommendations = generateRecommendations(options, data.preferences);

    // Log pour le développement
    console.log('Calcul d\'options de mobilité:', {
      from: data.from,
      to: data.to,
      optionsCount: options.length,
      ecoOptions: options.filter(opt => opt.ecological).length
    });

    return NextResponse.json({
      success: true,
      data: {
        options,
        recommendations,
        summary: {
          totalOptions: options.length,
          freeOptions: options.filter(opt => opt.cost === 0).length,
          ecoOptions: options.filter(opt => opt.ecological).length,
          fastestOption: options.reduce((prev, curr) => 
            curr.duration < prev.duration ? curr : prev
          ),
          cheapestOption: options.reduce((prev, curr) => 
            curr.cost < prev.cost ? curr : prev
          ),
          mostEcoOption: options
            .filter(opt => opt.ecological)
            .reduce((prev, curr) => 
              curr.route.carbonFootprint < prev.route.carbonFootprint ? curr : prev
            )
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors du calcul des options de mobilité:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors du calcul des itinéraires' },
      { status: 500 }
    );
  }
}

async function simulateGeolocation(address: string): Promise<{ lat: number; lng: number } | null> {
  // Simulation de géolocalisation pour Saint-Étienne
  const stEtienneCenter = { lat: 45.4397, lng: 4.3872 };
  
  // Simulation basée sur les adresses communes
  if (address.toLowerCase().includes('châteaucreux')) {
    return { lat: 45.4420, lng: 4.3970 };
  } else if (address.toLowerCase().includes('bellevue')) {
    return { lat: 45.4580, lng: 4.3920 };
  } else if (address.toLowerCase().includes('centre')) {
    return stEtienneCenter;
  } else {
    // Adresse générique dans Saint-Étienne avec légère variation
    return {
      lat: stEtienneCenter.lat + (Math.random() - 0.5) * 0.02,
      lng: stEtienneCenter.lng + (Math.random() - 0.5) * 0.02
    };
  }
}

async function calculateMobilityOptions(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  preferences?: MobilityRequest['preferences']
): Promise<MobilityOption[]> {
  
  const distance = calculateDistance(from, to);
  const options: MobilityOption[] = [];

  // Transport en commun - Tram T2
  options.push({
    id: 'tram-t2',
    type: 'public',
    name: 'Tram T2',
    duration: Math.max(15, Math.round(distance * 8)), // ~8 min/km en transport
    cost: 0, // Gratuit pour les -18 ans
    ecological: true,
    accessibility: true,
    description: 'Tram avec correspondance possible',
    route: {
      steps: [
        'Marche jusqu\'à l\'arrêt (3 min)',
        'Tram T2 direction Terrasse',
        'Descente arrêt proche destination',
        'Marche finale (2 min)'
      ],
      distance: distance + 0.5, // Distance + marche
      carbonFootprint: Math.round(distance * 40) // 40g CO2/km
    },
    schedule: {
      departure: '08:45',
      arrival: '09:10',
      frequency: 'Toutes les 10 minutes'
    },
    subsidies: {
      available: true,
      description: 'Gratuit avec la carte jeune -18 ans',
      savingAmount: 1.60
    }
  });

  // Bus
  options.push({
    id: 'bus-c1',
    type: 'public',
    name: 'Bus C1',
    duration: Math.max(12, Math.round(distance * 6)),
    cost: 0,
    ecological: true,
    accessibility: true,
    description: 'Bus direct, ligne urbaine',
    route: {
      steps: [
        'Marche jusqu\'à l\'arrêt (2 min)',
        'Bus C1 ligne directe',
        'Descente à destination'
      ],
      distance: distance + 0.3,
      carbonFootprint: Math.round(distance * 60) // 60g CO2/km
    },
    schedule: {
      departure: '08:40',
      arrival: '08:58',
      frequency: 'Toutes les 15 minutes'
    },
    subsidies: {
      available: true,
      description: 'Gratuit avec la carte jeune -18 ans',
      savingAmount: 1.60
    }
  });

  // Vélo en libre-service
  if (distance <= 5) {
    options.push({
      id: 'bike-share',
      type: 'bike',
      name: 'Vélo en libre-service',
      duration: Math.max(8, Math.round(distance * 4)), // ~4 min/km à vélo
      cost: 1, // 1€ les 30 premières minutes
      ecological: true,
      accessibility: false,
      description: 'Vélos électriques VéliVert',
      route: {
        steps: [
          'Station vélo départ (1 min)',
          'Trajet vélo sécurisé',
          'Restitution station arrivée'
        ],
        distance: distance,
        carbonFootprint: 0 // Vélo = 0 émission
      },
      subsidies: {
        available: true,
        description: 'Réduction famille nombreuse -50%',
        savingAmount: 0.50
      }
    });
  }

  // Covoiturage
  if (distance >= 2) {
    options.push({
      id: 'carpool-family',
      type: 'carpool',
      name: 'Covoiturage familial',
      duration: Math.max(5, Math.round(distance * 3)), // ~3 min/km en voiture
      cost: Math.round(distance * 0.3), // 30c/km partagé
      ecological: true,
      accessibility: true,
      description: 'Partage avec d\'autres familles',
      route: {
        steps: [
          'Rendez-vous point de rencontre',
          'Trajet partagé en voiture',
          'Arrivée groupée'
        ],
        distance: distance,
        carbonFootprint: Math.round(distance * 45) // Émissions partagées
      },
      subsidies: {
        available: false,
        description: 'Pas d\'aide spécifique',
        savingAmount: 0
      }
    });
  }

  // Marche à pied
  if (distance <= 3) {
    options.push({
      id: 'walk',
      type: 'walk',
      name: 'À pied',
      duration: Math.round(distance * 12), // ~12 min/km à pied
      cost: 0,
      ecological: true,
      accessibility: true, // Selon le parcours
      description: 'Parcours piéton sécurisé',
      route: {
        steps: [
          'Sortie domicile',
          'Parcours par les rues piétonnes',
          'Arrivée directe'
        ],
        distance: distance,
        carbonFootprint: 0
      },
      subsidies: {
        available: false,
        description: 'Gratuit et bénéfique pour la santé',
        savingAmount: 0
      }
    });
  }

  // Filtrage selon les préférences
  let filteredOptions = options;
  
  if (preferences?.maxDuration) {
    filteredOptions = filteredOptions.filter(opt => opt.duration <= preferences.maxDuration!);
  }
  
  if (preferences?.maxCost !== undefined) {
    filteredOptions = filteredOptions.filter(opt => opt.cost <= preferences.maxCost!);
  }
  
  if (preferences?.ecoFriendlyOnly) {
    filteredOptions = filteredOptions.filter(opt => opt.ecological);
  }
  
  if (preferences?.accessibilityNeeded) {
    filteredOptions = filteredOptions.filter(opt => opt.accessibility);
  }

  return filteredOptions;
}

function calculateDistance(from: { lat: number; lng: number }, to: { lat: number; lng: number }): number {
  // Formule de Haversine simplifiée pour calculer la distance
  const R = 6371; // Rayon de la Terre en km
  const dLat = (to.lat - from.lat) * Math.PI / 180;
  const dLng = (to.lng - from.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
           Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
           Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 100) / 100; // Distance en km avec 2 décimales
}

function generateRecommendations(
  options: MobilityOption[],
  preferences?: MobilityRequest['preferences']
): string[] {
  const recommendations: string[] = [];
  
  if (options.length === 0) {
    recommendations.push('Aucune option trouvée avec vos critères');
    return recommendations;
  }

  const freeOptions = options.filter(opt => opt.cost === 0);
  const ecoOptions = options.filter(opt => opt.ecological);
  const fastOption = options.reduce((prev, curr) => curr.duration < prev.duration ? curr : prev);

  if (freeOptions.length > 0) {
    recommendations.push(`💰 ${freeOptions.length} option(s) gratuite(s) disponible(s)`);
  }

  if (ecoOptions.length > 0) {
    recommendations.push(`🌱 ${ecoOptions.length} option(s) écologique(s) recommandée(s)`);
  }

  recommendations.push(`⚡ Option la plus rapide : ${fastOption.name} (${fastOption.duration} min)`);

  const subsidyOptions = options.filter(opt => opt.subsidies?.available);
  if (subsidyOptions.length > 0) {
    recommendations.push(`🎫 Aides disponibles pour ${subsidyOptions.length} option(s)`);
  }

  recommendations.push('🕐 Prévoyez 5-10 minutes de marge pour les transports');

  return recommendations;
}
