import { NextRequest, NextResponse } from 'next/server';

interface EstimateRequest {
  address?: string;
  city?: string;
  postalCode?: string;
  familySituation?: 'single' | 'couple' | 'other';
  quotientFamilial?: string;
  cafNumber?: string;
  aidTypes?: string[];
  calculationMethod?: 'known' | 'calculate';
  activityPrice?: number;
}

interface AidEstimate {
  id: string;
  name: string;
  type: 'municipal' | 'caf' | 'ancv' | 'pass_colo' | 'other';
  reduction: number; // Pourcentage de réduction
  maxAmount?: number; // Montant maximum en euros
  description: string;
  conditions: string[];
  eligible: boolean;
  estimatedSaving: number; // Économie estimée en euros
}

export async function POST(request: NextRequest) {
  try {
    const data: EstimateRequest = await request.json();
    
    // Validation des données
    if (!data.postalCode && !data.city) {
      return NextResponse.json(
        { message: 'La ville ou le code postal est requis pour l\'estimation' },
        { status: 400 }
      );
    }

    // Simulation d'estimation basée sur les données fournies
    const estimates = calculateAidEstimates(data);
    
    // Calcul du total des économies
    const totalSavings = estimates
      .filter(aid => aid.eligible)
      .reduce((sum, aid) => sum + aid.estimatedSaving, 0);

    // Log pour le développement
    console.log('Estimation d\'aides calculée:', {
      postalCode: data.postalCode,
      quotientFamilial: data.quotientFamilial,
      totalAids: estimates.length,
      eligibleAids: estimates.filter(aid => aid.eligible).length,
      totalSavings
    });

    return NextResponse.json({
      success: true,
      data: {
        estimates,
        totalSavings,
        eligibleCount: estimates.filter(aid => aid.eligible).length,
        recommendations: generateRecommendations(estimates, data),
        nextSteps: [
          'Contactez votre mairie pour confirmer votre quotient familial',
          'Rassemblez vos justificatifs de revenus',
          'Déposez votre demande avant le début de l\'activité'
        ]
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'estimation des aides:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors du calcul de l\'estimation' },
      { status: 500 }
    );
  }
}

function calculateAidEstimates(data: EstimateRequest): AidEstimate[] {
  const qf = parseInt(data.quotientFamilial || '1000');
  const activityPrice = data.activityPrice || 50; // Prix par défaut
  const city = data.city?.toLowerCase() || '';
  const isStEtienne = city.includes('saint-étienne') || data.postalCode?.startsWith('42');

  const aids: AidEstimate[] = [];

  // Aides municipales (Saint-Étienne)
  if (isStEtienne && data.aidTypes?.includes('municipal')) {
    let reduction = 0;
    let eligible = true;

    if (qf < 500) {
      reduction = 80;
    } else if (qf < 800) {
      reduction = 60;
    } else if (qf < 1200) {
      reduction = 40;
    } else if (qf < 1500) {
      reduction = 20;
    } else {
      eligible = false;
    }

    if (eligible) {
      aids.push({
        id: 'municipal-qf',
        name: 'Tarif selon quotient familial',
        type: 'municipal',
        reduction,
        description: `Réduction de ${reduction}% sur les activités municipales`,
        conditions: [
          'Résider à Saint-Étienne',
          `Quotient familial inférieur à ${qf < 500 ? 500 : qf < 800 ? 800 : qf < 1200 ? 1200 : 1500}€`,
          'Justificatifs de revenus requis'
        ],
        eligible: true,
        estimatedSaving: Math.round(activityPrice * reduction / 100)
      });
    }
  }

  // Aides CAF
  if (data.aidTypes?.includes('caf')) {
    if (qf < 600) {
      aids.push({
        id: 'caf-bons-vacances',
        name: 'Bons Vacances CAF',
        type: 'caf',
        reduction: 0,
        maxAmount: 200,
        description: 'Aide forfaitaire pour les activités de loisirs',
        conditions: [
          'Quotient familial inférieur à 600€',
          'Enfant âgé de 3 à 17 ans',
          'Demande avant le 31 mars'
        ],
        eligible: true,
        estimatedSaving: Math.min(activityPrice, 200)
      });
    }

    if (data.familySituation === 'single') {
      aids.push({
        id: 'caf-parent-isole',
        name: 'Aide parent isolé',
        type: 'caf',
        reduction: 50,
        description: 'Réduction spéciale pour les familles monoparentales',
        conditions: [
          'Parent seul avec enfant(s) à charge',
          'Allocataire CAF',
          'Revenus modestes'
        ],
        eligible: true,
        estimatedSaving: Math.round(activityPrice * 0.5)
      });
    }
  }

  // Chèques ANCV
  if (data.aidTypes?.includes('ancv') && qf < 1000) {
    aids.push({
      id: 'ancv-cheques-vacances',
      name: 'Chèques Vacances ANCV',
      type: 'ancv',
      reduction: 0,
      maxAmount: 100,
      description: 'Chèques vacances acceptés pour les activités',
      conditions: [
        'Salarié du secteur privé ou public',
        'Quotient familial modeste',
        'Entreprise partenaire ANCV'
      ],
      eligible: true,
      estimatedSaving: Math.min(activityPrice * 0.8, 100)
    });
  }

  // Pass Colo
  if (data.aidTypes?.includes('pass_colo') && activityPrice >= 100) {
    aids.push({
      id: 'pass-colo',
      name: 'Pass Colo',
      type: 'pass_colo',
      reduction: 0,
      maxAmount: 150,
      description: 'Aide pour les séjours et activités longues',
      conditions: [
        'Séjour de plus de 3 jours ou activité intensive',
        'Famille éligible aux prestations CAF',
        'Prestataire agréé'
      ],
      eligible: true,
      estimatedSaving: Math.min(activityPrice, 150)
    });
  }

  // Autres aides
  if (data.aidTypes?.includes('other')) {
    aids.push({
      id: 'region-sport',
      name: 'Pass+ Sport Région',
      type: 'other',
      reduction: 0,
      maxAmount: 80,
      description: 'Aide régionale pour la pratique sportive',
      conditions: [
        'Résider en région Auvergne-Rhône-Alpes',
        'Première inscription dans un club',
        'Âge entre 6 et 16 ans'
      ],
      eligible: true,
      estimatedSaving: Math.min(activityPrice, 80)
    });
  }

  return aids;
}

function generateRecommendations(estimates: AidEstimate[], data: EstimateRequest): string[] {
  const recommendations: string[] = [];
  const eligibleAids = estimates.filter(aid => aid.eligible);
  
  if (eligibleAids.length === 0) {
    recommendations.push('Aucune aide spécifique trouvée, mais vérifiez directement auprès de votre mairie');
    recommendations.push('Considérez le paiement en plusieurs fois si disponible');
  } else {
    recommendations.push(`Vous êtes éligible à ${eligibleAids.length} aide(s) financière(s)`);
    
    if (eligibleAids.some(aid => aid.type === 'municipal')) {
      recommendations.push('Priorité : Demandez votre tarification au quotient familial en mairie');
    }
    
    if (eligibleAids.some(aid => aid.type === 'caf')) {
      recommendations.push('Contactez votre CAF pour les bons vacances et aides spécifiques');
    }
    
    recommendations.push('Commencez les démarches au moins 1 mois avant l\'activité');
  }
  
  return recommendations;
}

// API pour calculer le quotient familial (simulation)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const income = searchParams.get('income');
    const familyMembers = searchParams.get('familyMembers');
    
    if (!income || !familyMembers) {
      return NextResponse.json(
        { message: 'Revenus et nombre de personnes requis' },
        { status: 400 }
      );
    }

    // Calcul simplifié du quotient familial
    const monthlyIncome = parseInt(income) / 12;
    const members = parseInt(familyMembers);
    const quotientFamilial = Math.round(monthlyIncome / members);

    return NextResponse.json({
      success: true,
      quotientFamilial,
      category: getCategoryFromQF(quotientFamilial),
      advice: getAdviceFromQF(quotientFamilial)
    });

  } catch (error) {
    console.error('Erreur lors du calcul du QF:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors du calcul' },
      { status: 500 }
    );
  }
}

function getCategoryFromQF(qf: number): string {
  if (qf < 500) return 'Très avantageux';
  if (qf < 800) return 'Avantageux';
  if (qf < 1200) return 'Modéré';
  if (qf < 1500) return 'Standard';
  return 'Élevé';
}

function getAdviceFromQF(qf: number): string {
  if (qf < 500) return 'Vous bénéficiez des réductions maximales (jusqu\'à 80%)';
  if (qf < 800) return 'Vous bénéficiez de réductions importantes (jusqu\'à 60%)';
  if (qf < 1200) return 'Vous bénéficiez de réductions modérées (jusqu\'à 40%)';
  if (qf < 1500) return 'Vous bénéficiez de réductions légères (jusqu\'à 20%)';
  return 'Peu d\'aides disponibles, mais vérifiez les dispositifs spécifiques';
}
