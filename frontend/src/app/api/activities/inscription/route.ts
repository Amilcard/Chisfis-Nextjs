import { NextRequest, NextResponse } from 'next/server';

// Simulation d'une base de données d'inscriptions (remplacer par une vraie DB en production)
const inscriptions: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const {
      childId,
      activityId,
      message = '',
      besoinsSpeciaux = ''
    } = await request.json();

    // Validation des données requises
    if (!childId || !activityId) {
      return NextResponse.json(
        { message: 'childId et activityId sont obligatoires' },
        { status: 400 }
      );
    }

    // Vérifier si l'enfant n'est pas déjà inscrit à cette activité
    const existingInscription = inscriptions.find(
      inscription => inscription.childId === childId && inscription.activityId === activityId
    );

    if (existingInscription) {
      return NextResponse.json(
        { message: 'Cet enfant est déjà inscrit à cette activité' },
        { status: 400 }
      );
    }

    // Création de l'inscription
    const newInscription = {
      id: Date.now().toString(),
      childId,
      activityId,
      message: message.trim(),
      besoinsSpeciaux: besoinsSpeciaux.trim(),
      status: 'en_attente', // en_attente, confirmee, annulee
      createdAt: new Date().toISOString(),
      confirmedAt: null,
      priority: 'normal' // normal, urgent
    };

    // Ajout à la "base de données"
    inscriptions.push(newInscription);

    // Log pour le développement
    console.log('Nouvelle inscription créée:', {
      ...newInscription,
      childId: '[MASKED]',
      activityId: activityId
    });

    // Simulation d'envoi d'email de confirmation
    console.log(`[EMAIL SIMULATION] Inscription créée:
      - Enfant ID: ${childId}
      - Activité ID: ${activityId}
      - Message: ${message}
      - Statut: en_attente
    `);

    // Retour de succès
    return NextResponse.json(
      {
        success: true,
        message: 'Inscription créée avec succès',
        inscription: newInscription,
        nextSteps: [
          'Vous recevrez un email de confirmation',
          'Le prestataire vous contactera sous 48h',
          'Vous pourrez finaliser les modalités pratiques'
        ]
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// API pour récupérer les inscriptions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');
    const activityId = searchParams.get('activityId');
    const status = searchParams.get('status');

    let filteredInscriptions = [...inscriptions];

    if (childId) {
      filteredInscriptions = filteredInscriptions.filter(
        inscription => inscription.childId === childId
      );
    }

    if (activityId) {
      filteredInscriptions = filteredInscriptions.filter(
        inscription => inscription.activityId === activityId
      );
    }

    if (status) {
      filteredInscriptions = filteredInscriptions.filter(
        inscription => inscription.status === status
      );
    }

    return NextResponse.json({
      success: true,
      inscriptions: filteredInscriptions,
      total: filteredInscriptions.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des inscriptions:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// API pour mettre à jour le statut d'une inscription
export async function PUT(request: NextRequest) {
  try {
    const {
      inscriptionId,
      status,
      providerMessage = ''
    } = await request.json();

    if (!inscriptionId || !status) {
      return NextResponse.json(
        { message: 'inscriptionId et status sont obligatoires' },
        { status: 400 }
      );
    }

    const validStatuses = ['en_attente', 'confirmee', 'annulee'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Statut invalide' },
        { status: 400 }
      );
    }

    const inscriptionIndex = inscriptions.findIndex(
      inscription => inscription.id === inscriptionId
    );

    if (inscriptionIndex === -1) {
      return NextResponse.json(
        { message: 'Inscription non trouvée' },
        { status: 404 }
      );
    }

    // Mise à jour de l'inscription
    inscriptions[inscriptionIndex] = {
      ...inscriptions[inscriptionIndex],
      status,
      providerMessage: providerMessage.trim(),
      updatedAt: new Date().toISOString(),
      ...(status === 'confirmee' && { confirmedAt: new Date().toISOString() })
    };

    console.log(`Inscription ${inscriptionId} mise à jour: ${status}`);

    return NextResponse.json({
      success: true,
      message: 'Inscription mise à jour avec succès',
      inscription: inscriptions[inscriptionIndex]
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'inscription:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
