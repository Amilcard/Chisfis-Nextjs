// src/services/activityService.ts

interface ActivityFilters {
  nearMe?: boolean;
  maxPrice?: number;
  featured?: boolean;
  theme?: string;
  // Nouveaux filtres InKlusif
  query?: string;
  location?: string;
  ageGroups?: string[];
  category?: string;
  priceRange?: [number, number];
  accessibility?: boolean;
  ecoMobility?: boolean;
  carpooling?: boolean;
  financialAid?: string[];
  installmentPayment?: boolean;
}

interface Activity {
  id: number;
  theme: string;
  title: string;
  provider: string;
  location: string;
  date: string;
  schedule: string;
  price: number;
  financialAid: string[];
  installment: boolean;
  disabilityAccess: boolean;
  ecoMobility: string;
  ageRanges: string[];
  imageUrl: string;
}

// Données réelles des activités avec dates et structure enrichie
const mockActivities: Activity[] = [
  // — Sport (année civile) —
  {
    "id": 101,
    "theme": "sport",
    "title": "Initiation Football",
    "provider": "Stade Stéphanois",
    "location": "Saint-Étienne Centre",
    "date": "2026-01-14",            // Hors vacances
    "schedule": "mercredi 14:00-16:00",
    "price": 20,
    "financialAid": ["Pass Sport"],
    "installment": false,
    "disabilityAccess": true,
    "ecoMobility": "Bus C7 à 200 m",
    "ageRanges": ["3-6 ans"],
    "imageUrl": "https://picsum.photos/400/300?random=101"
  },
  {
    "id": 102,
    "theme": "sport",
    "title": "Stage Basket Jeunes",
    "provider": "Club Stéph Basket",
    "location": "Saint-Étienne Bellevue",
    "date": "2026-02-18",            // Pendant vacances d'hiver A (12-28/02)
    "schedule": "mercredi 10:00-12:00",
    "price": 35,
    "financialAid": ["Pass Sport"],
    "installment": true,
    "disabilityAccess": false,
    "ecoMobility": "Tram T3 arrêt Bellevue",
    "ageRanges": ["7-10 ans"],
    "imageUrl": "https://picsum.photos/400/300?random=102"
  },
  {
    "id": 103,
    "theme": "sport",
    "title": "Atelier Escalade Famille",
    "provider": "Club Vertige 42",
    "location": "Saint-Jean-Bonnefonds",
    "date": "2026-04-15",            // Pendant vacances de printemps A (09-25/04)
    "schedule": "jeudi 09:00-11:00",
    "price": 50,
    "financialAid": ["Pass Sport","Bons Vacances"],
    "installment": true,
    "disabilityAccess": false,
    "ecoMobility": "Bus D1 arrêt Mur",
    "ageRanges": ["11-14 ans","15-17 ans"],
    "imageUrl": "https://picsum.photos/400/300?random=103"
  },
  {
    "id": 104,
    "theme": "sport",
    "title": "Randonnée Famille",
    "provider": "Randos Stéphanoises",
    "location": "Pilat, sentier des Crêtes",
    "date": "2026-07-15",            // Pendant grandes vacances (06/07-01/09)
    "schedule": "jeudi 09:00-13:00",
    "price": 25,
    "financialAid": [],
    "installment": false,
    "disabilityAccess": true,
    "ecoMobility": "Navette gare",
    "ageRanges": ["7-10 ans","11-14 ans"],
    "imageUrl": "https://picsum.photos/400/300?random=104"
  },

  // — Culture (année civile) —
  {
    "id": 201,
    "theme": "culture",
    "title": "Atelier Théâtre",
    "provider": "Théâtre de l'Olivier",
    "location": "Saint-Étienne Crêt-de-Roide",
    "date": "2026-10-21",            // Pendant vacances de la Toussaint A (17/10-02/11)
    "schedule": "jeudi 17:00-18:30",
    "price": 30,
    "financialAid": ["Pass Culture"],
    "installment": false,
    "disabilityAccess": true,
    "ecoMobility": "Bus C1",
    "ageRanges": ["7-10 ans"],
    "imageUrl": "https://picsum.photos/400/300?random=201"
  },
  {
    "id": 202,
    "theme": "culture",
    "title": "Visite Musée d'Art Moderne",
    "provider": "MAM St-Étienne",
    "location": "Boulevard du 11 Novembre",
    "date": "2025-12-29",            // Pendant vacances de Noël (19/12/25-04/01/26)
    "schedule": "mardi 14:00-15:30",
    "price": 15,
    "financialAid": ["Pass Culture"],
    "installment": false,
    "disabilityAccess": true,
    "ecoMobility": "Tram T1",
    "ageRanges": ["15-17 ans"],
    "imageUrl": "https://picsum.photos/400/300?random=202"
  },
  {
    "id": 203,
    "theme": "culture",
    "title": "Atelier Peinture",
    "provider": "École Beaux-Arts Stéphanoise",
    "location": "Rue Michelet",
    "date": "2026-08-20",            // Grandes vacances
    "schedule": "vendredi 14:00-17:00",
    "price": 45,
    "financialAid": ["Pass Culture"],
    "installment": false,
    "disabilityAccess": false,
    "ecoMobility": "Bus C3",
    "ageRanges": ["3-6 ans","7-10 ans"],
    "imageUrl": "https://picsum.photos/400/300?random=203"
  },
  {
    "id": 204,
    "theme": "culture",
    "title": "Concert Jeune Public",
    "provider": "Salle Debussy",
    "location": "Saint-Étienne Centre",
    "date": "2026-02-14",            // École ouverte, hors vacances
    "schedule": "vendredi 16:00-17:30",
    "price": 18,
    "financialAid": ["Pass Culture"],
    "installment": false,
    "disabilityAccess": true,
    "ecoMobility": "Tram T2",
    "ageRanges": ["11-14 ans","15-17 ans"],
    "imageUrl": "https://picsum.photos/400/300?random=204"
  },

  // — Loisirs —
  {
    "id": 301,
    "theme": "loisirs",
    "title": "Atelier Jeux de Société",
    "provider": "Ludothèque Municipale",
    "location": "Saint-Étienne Solaure",
    "date": "2026-03-18",
    "schedule": "mercredi 14:00-17:00",
    "price": 12,
    "financialAid": ["Quotient Familial"],
    "installment": false,
    "disabilityAccess": true,
    "ecoMobility": "Bus M6 Solaure",
    "ageRanges": ["7-10 ans","11-14 ans"],
    "imageUrl": "https://picsum.photos/400/300?random=301"
  },
  {
    "id": 302,
    "theme": "loisirs",
    "title": "Stage Robotique",
    "provider": "Fab Lab Loire",
    "location": "Saint-Étienne Technopôle",
    "date": "2026-04-22",
    "schedule": "samedi 10:00-12:00",
    "price": 20,
    "financialAid": ["Bons Vacances"],
    "installment": true,
    "disabilityAccess": false,
    "ecoMobility": "Bus M1 Technopôle",
    "ageRanges": ["11-14 ans","15-17 ans"],
    "imageUrl": "https://picsum.photos/400/300?random=302"
  },

  // — Vacances —
  {
    "id": 401,
    "theme": "vacances",
    "title": "Centre Aéré Nature",
    "provider": "Mairie Saint-Étienne",
    "location": "Base de loisirs du Barrage",
    "date": "2026-07-08",
    "schedule": "lundi 08:00-17:00",
    "price": 12,
    "financialAid": ["Quotient Familial", "Bons CAF"],
    "installment": true,
    "disabilityAccess": true,
    "ecoMobility": "Navette gratuite",
    "ageRanges": ["3-6 ans","7-10 ans"],
    "imageUrl": "https://picsum.photos/400/300?random=401"
  },
  {
    "id": 402,
    "theme": "vacances",
    "title": "Stage Multi-Sports",
    "provider": "ASPTT Saint-Étienne",
    "location": "Complexe Sportif Geoffroy",
    "date": "2026-08-25",
    "schedule": "mardi 09:00-16:00",
    "price": 18,
    "financialAid": ["Pass Sport", "Bons Vacances"],
    "installment": true,
    "disabilityAccess": false,
    "ecoMobility": "Bus M2",
    "ageRanges": ["7-10 ans","11-14 ans"],
    "imageUrl": "https://picsum.photos/400/300?random=402"
  }
];

export async function fetchActivities(filters: ActivityFilters = {}): Promise<Activity[]> {
  // Simulation d'un appel API avec délai
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredActivities = [...mockActivities];

  // Recherche textuelle
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filteredActivities = filteredActivities.filter(activity => 
      activity.title.toLowerCase().includes(query) ||
      activity.provider.toLowerCase().includes(query) ||
      activity.location.toLowerCase().includes(query)
    );
  }

  // Filtrage par lieu
  if (filters.location) {
    const location = filters.location.toLowerCase();
    filteredActivities = filteredActivities.filter(activity => 
      activity.location.toLowerCase().includes(location)
    );
  }

  // Filtrage par tranches d'âge
  if (filters.ageGroups && filters.ageGroups.length > 0) {
    filteredActivities = filteredActivities.filter(activity => 
      filters.ageGroups!.some(ageGroup => 
        activity.ageRanges.some(range => range.includes(ageGroup.replace('-', '-')))
      )
    );
  }

  // Filtrage par catégorie
  if (filters.category) {
    filteredActivities = filteredActivities.filter(activity => 
      activity.theme === filters.category
    );
  }

  // Filtrage par fourchette de prix
  if (filters.priceRange) {
    const [minPrice, maxPrice] = filters.priceRange;
    filteredActivities = filteredActivities.filter(activity => 
      activity.price >= minPrice && activity.price <= maxPrice
    );
  }

  // Filtrage par accessibilité
  if (filters.accessibility) {
    filteredActivities = filteredActivities.filter(activity => 
      activity.disabilityAccess
    );
  }

  // Filtrage par éco-mobilité
  if (filters.ecoMobility) {
    filteredActivities = filteredActivities.filter(activity => 
      activity.ecoMobility && activity.ecoMobility.length > 0
    );
  }

  // Filtrage par aides financières
  if (filters.financialAid && filters.financialAid.length > 0) {
    filteredActivities = filteredActivities.filter(activity => 
      filters.financialAid!.some(aid => activity.financialAid.includes(aid))
    );
  }

  // Filtrage par paiement échelonné
  if (filters.installmentPayment) {
    filteredActivities = filteredActivities.filter(activity => 
      activity.installment
    );
  }

  // Anciens filtres pour compatibilité
  if (filters.maxPrice !== undefined) {
    filteredActivities = filteredActivities.filter(activity => activity.price <= filters.maxPrice!);
  }

  if (filters.theme) {
    filteredActivities = filteredActivities.filter(activity => activity.theme === filters.theme);
  }

  if (filters.featured) {
    // Les activités avec aides financières ou petits prix (≤ 25€) sont considérées comme "en vedette"
    filteredActivities = filteredActivities.filter(activity => 
      activity.financialAid.length > 0 || activity.price <= 25
    );
  }

  if (filters.nearMe) {
    // Activités dans le centre de Saint-Étienne
    filteredActivities = filteredActivities.filter(activity => 
      activity.location.includes('Saint-Étienne Centre') || 
      activity.location.includes('Saint-Étienne')
    );
  }

  return filteredActivities;
}

// Fonction pour récupérer une activité par son ID
export async function getActivityById(id: string): Promise<Activity | undefined> {
  const activityId = parseInt(id, 10);
  if (isNaN(activityId)) {
    return undefined;
  }
  
  return mockActivities.find(activity => activity.id === activityId);
}
