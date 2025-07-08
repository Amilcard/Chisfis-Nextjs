import { NextRequest, NextResponse } from 'next/server';

// Simulation d'une base de données enfants (remplacer par une vraie DB en production)
const children: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const {
      parentId,
      prenom,
      age,
      besoinsSpeciaux = ''
    } = await request.json();

    // Validation des données requises
    if (!parentId || !prenom || !age) {
      return NextResponse.json(
        { message: 'parentId, prenom et age sont obligatoires' },
        { status: 400 }
      );
    }

    // Validation de l'âge
    const ageNumber = parseInt(age);
    if (isNaN(ageNumber) || ageNumber < 3 || ageNumber > 17) {
      return NextResponse.json(
        { message: 'L\'âge doit être compris entre 3 et 17 ans' },
        { status: 400 }
      );
    }

    // Création du profil enfant
    const newChild = {
      id: Date.now().toString(),
      parentId,
      prenom: prenom.trim(),
      age: ageNumber,
      besoinsSpeciaux: besoinsSpeciaux.trim(),
      createdAt: new Date().toISOString(),
      inscriptions: []
    };

    // Ajout à la "base de données"
    children.push(newChild);

    // Log pour le développement
    console.log('Nouveau profil enfant créé:', {
      ...newChild,
      parentId: '[MASKED]'
    });

    // Retour de succès
    return NextResponse.json(
      {
        success: true,
        message: 'Profil enfant créé avec succès',
        child: newChild,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erreur lors de la création du profil enfant:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// API pour récupérer les enfants d'un parent
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');

    if (!parentId) {
      return NextResponse.json(
        { message: 'parentId est requis' },
        { status: 400 }
      );
    }

    const parentChildren = children.filter(child => child.parentId === parentId);

    return NextResponse.json({
      success: true,
      children: parentChildren
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des enfants:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
