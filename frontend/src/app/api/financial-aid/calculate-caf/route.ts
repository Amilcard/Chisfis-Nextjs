import { NextRequest, NextResponse } from 'next/server';

interface CAFCalculationRequest {
  annualIncome: number;
  familyMembers: number;
  childrenCount: number;
  familySituation: 'single' | 'couple' | 'other';
  specialSituations?: string[]; // handicap, chomage, etc.
}

export async function POST(request: NextRequest) {
  try {
    const data: CAFCalculationRequest = await request.json();
    
    // Validation des données
    if (!data.annualIncome || !data.familyMembers) {
      return NextResponse.json(
        { message: 'Revenus annuels et nombre de personnes dans le foyer requis' },
        { status: 400 }
      );
    }

    // Calcul du quotient familial CAF
    const quotientFamilial = calculateCAFQuotient(data);
    
    // Détermination des aides potentielles
    const eligibleAids = determineEligibleAids(quotientFamilial, data);
    
    // Conseils personnalisés
    const advice = generatePersonalizedAdvice(quotientFamilial, data);

    return NextResponse.json({
      success: true,
      data: {
        quotientFamilial: Math.round(quotientFamilial),
        category: getQFCategory(quotientFamilial),
        eligibleAids,
        advice,
        breakdown: {
          monthlyIncome: Math.round(data.annualIncome / 12),
          familyMembers: data.familyMembers,
          childrenCount: data.childrenCount
        },
        nextSteps: [
          'Vérifiez votre QF sur votre attestation CAF',
          'Contactez votre mairie pour connaître les tarifs',
          'Préparez vos justificatifs de revenus'
        ]
      }
    });

  } catch (error) {
    console.error('Erreur lors du calcul CAF:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors du calcul du quotient familial' },
      { status: 500 }
    );
  }
}

function calculateCAFQuotient(data: CAFCalculationRequest): number {
  // Formule simplifiée du quotient familial CAF
  // QF = (Revenus nets annuels) / (12 mois) / (nombre de parts)
  
  let parts = 1; // Adulte principal
  
  // Ajouter les parts selon la situation familiale
  if (data.familySituation === 'couple') {
    parts += 1; // Conjoint
  }
  
  // Ajouter les parts pour les enfants
  if (data.childrenCount >= 1) parts += 0.5; // Premier enfant
  if (data.childrenCount >= 2) parts += 0.5; // Deuxième enfant
  if (data.childrenCount >= 3) {
    parts += (data.childrenCount - 2) * 1; // 3ème enfant et suivants
  }
  
  // Bonus famille nombreuse (3 enfants et +)
  if (data.childrenCount >= 3) {
    parts += 0.5;
  }
  
  // Bonus parent isolé
  if (data.familySituation === 'single' && data.childrenCount > 0) {
    parts += 0.5;
  }
  
  const monthlyIncome = data.annualIncome / 12;
  return monthlyIncome / parts;
}

function getQFCategory(qf: number): { name: string; color: string; description: string } {
  if (qf < 500) {
    return {
      name: 'QF Très Avantageux',
      color: 'green',
      description: 'Accès aux réductions maximales (jusqu\'à 80%)'
    };
  } else if (qf < 800) {
    return {
      name: 'QF Avantageux',
      color: 'blue',
      description: 'Accès à des réductions importantes (jusqu\'à 60%)'
    };
  } else if (qf < 1200) {
    return {
      name: 'QF Modéré',
      color: 'yellow',
      description: 'Accès à des réductions modérées (jusqu\'à 40%)'
    };
  } else if (qf < 1500) {
    return {
      name: 'QF Standard',
      color: 'orange',
      description: 'Accès à des réductions légères (jusqu\'à 20%)'
    };
  } else {
    return {
      name: 'QF Élevé',
      color: 'red',
      description: 'Peu d\'aides tarifaires, tarifs pleins'
    };
  }
}

function determineEligibleAids(qf: number, data: CAFCalculationRequest): string[] {
  const aids: string[] = [];
  
  // Aides selon quotient familial
  if (qf < 600) {
    aids.push('Bons Vacances CAF');
    aids.push('Tarification solidaire municipale');
  }
  
  if (qf < 800) {
    aids.push('Réductions activités périscolaires');
    aids.push('Aide aux projets vacances');
  }
  
  if (qf < 1200) {
    aids.push('Tarifs préférentiels activités municipales');
  }
  
  // Aides selon situation familiale
  if (data.familySituation === 'single') {
    aids.push('Aide parent isolé');
    aids.push('Dispositif famille monoparentale');
  }
  
  if (data.childrenCount >= 3) {
    aids.push('Tarif famille nombreuse');
    aids.push('Pass+ famille nombreuse');
  }
  
  // Aides universelles
  aids.push('Paiement échelonné');
  aids.push('Chèques Vacances (si employeur partenaire)');
  
  return aids;
}

function generatePersonalizedAdvice(qf: number, data: CAFCalculationRequest): string[] {
  const advice: string[] = [];
  
  // Conseils selon le QF
  if (qf < 500) {
    advice.push('🎯 Excellent ! Vous bénéficiez des tarifs les plus avantageux');
    advice.push('💡 Pensez à demander systématiquement la tarification au QF');
  } else if (qf < 800) {
    advice.push('👍 Vous avez accès à de bonnes réductions');
    advice.push('💡 Vérifiez toutes les aides CAF disponibles');
  } else if (qf < 1200) {
    advice.push('📊 Des aides sont disponibles selon les activités');
    advice.push('💡 Comparez les tarifs entre public et privé');
  } else {
    advice.push('📈 Peu d\'aides tarifaires, mais d\'autres solutions existent');
    advice.push('💡 Privilégiez les activités avec paiement échelonné');
  }
  
  // Conseils selon la situation familiale
  if (data.familySituation === 'single') {
    advice.push('👨‍👧‍👦 En tant que parent seul, des aides spécifiques vous sont dédiées');
  }
  
  if (data.childrenCount >= 3) {
    advice.push('👨‍👩‍👧‍👦 Famille nombreuse : tarifs dégressifs souvent disponibles');
  }
  
  // Conseils pratiques
  advice.push('📋 Conservez tous vos justificatifs de revenus');
  advice.push('📅 Faites vos demandes au moins 1 mois à l\'avance');
  
  return advice;
}

// API GET pour récupérer les seuils et grilles tarifaires
export async function GET() {
  try {
    const tariffGrid = {
      municipal: [
        { qfMin: 0, qfMax: 500, reduction: 80, description: 'QF < 500€' },
        { qfMin: 500, qfMax: 800, reduction: 60, description: 'QF 500-800€' },
        { qfMin: 800, qfMax: 1200, reduction: 40, description: 'QF 800-1200€' },
        { qfMin: 1200, qfMax: 1500, reduction: 20, description: 'QF 1200-1500€' },
        { qfMin: 1500, qfMax: 99999, reduction: 0, description: 'QF > 1500€' }
      ],
      caf: [
        { qfMin: 0, qfMax: 600, aid: 'Bons Vacances', amount: 200 },
        { qfMin: 0, qfMax: 800, aid: 'Aide aux projets', amount: 150 },
        { qfMin: 0, qfMax: 1000, aid: 'Séjours ados', amount: 300 }
      ],
      info: {
        lastUpdate: '2025-01-01',
        source: 'Ville de Saint-Étienne + CAF Loire',
        note: 'Grilles tarifaires indicatives, vérifiez auprès des organismes'
      }
    };

    return NextResponse.json({
      success: true,
      data: tariffGrid
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des grilles:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}
