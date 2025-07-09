import { NextRequest, NextResponse } from 'next/server';

// Simulation d'une base de données (remplacer par une vraie DB en production)
const users: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      gender,
      newsletter,
      // Support pour l'inscription rapide
      prenomParent,
      isQuickSignup = false
    } = await request.json();

    // Validation pour inscription rapide (plus souple)
    if (isQuickSignup) {
      if (!email || !password || !prenomParent) {
        return NextResponse.json(
          { message: 'Email, mot de passe et prénom du parent sont obligatoires pour l\'inscription rapide' },
          { status: 400 }
        );
      }
    } else {
      // Validation standard
      if (!firstName || !lastName || !email || !password) {
        return NextResponse.json(
          { message: 'Tous les champs obligatoires doivent être remplis' },
          { status: 400 }
        );
      }
    }

    // Validation du format email
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Validation du mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Vérification si l'email existe déjà
    const existingUser = users.find(user => user.email === email);
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'Un compte avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Création du nouvel utilisateur
    const newUser = {
      id: Date.now().toString(),
      firstName: firstName || prenomParent || '',
      lastName: lastName || '',
      email,
      password, // En production, hasher le mot de passe
      phone: phone || null,
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      newsletter: newsletter || false,
      createdAt: new Date().toISOString(),
      emailVerified: false,
      // Métadonnées d'inscription rapide
      isQuickSignup: isQuickSignup || false,
      type: 'parent' // Par défaut, tous les nouveaux comptes sont des parents
    };

    // Ajout à la "base de données"
    users.push(newUser);

    // Log pour le développement
    console.log('Nouvel utilisateur créé:', {
      ...newUser,
      password: '[MASQUÉ]'
    });

    // Retour de succès (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json(
      {
        success: true,
        message: 'Compte créé avec succès',
        user: userWithoutPassword,
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
