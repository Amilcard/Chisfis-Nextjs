import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { resetTokens, users, isTokenValid } from '@/lib/auth-tokens'

// Fonction pour hasher le mot de passe (en production, utilisez bcrypt)
const hashPassword = async (password: string): Promise<string> => {
  // En production, utilisez bcrypt :
  // const bcrypt = require('bcrypt')
  // return await bcrypt.hash(password, 12)
  
  // Simulation simple pour la démo
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    // Validation des données
    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token et mot de passe requis' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      )
    }

    // Vérifier le token
    if (!isTokenValid(token)) {
      return NextResponse.json(
        { message: 'Token de réinitialisation invalide ou expiré' },
        { status: 400 }
      )
    }
    
    const tokenData = resetTokens.get(token)!

    // Vérifier si l'utilisateur existe toujours
    const user = users.get(tokenData.email)
    if (!user) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await hashPassword(password)

    // Mettre à jour le mot de passe de l'utilisateur
    users.set(tokenData.email, {
      ...user,
      password: hashedPassword
    })

    // Supprimer le token utilisé pour éviter les réutilisations
    resetTokens.delete(token)

    console.log(`
      ✅ MOT DE PASSE RÉINITIALISÉ AVEC SUCCÈS
      Email: ${tokenData.email}
      Nouveau mot de passe hashé: ${hashedPassword}
    `)

    return NextResponse.json(
      { message: 'Mot de passe réinitialisé avec succès' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// Fonction utilitaire pour vérifier la validité d'un token (optionnel)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { message: 'Token manquant' },
        { status: 400 }
      )
    }

    if (!isTokenValid(token)) {
      return NextResponse.json(
        { valid: false, message: 'Token invalide ou expiré' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { valid: true, message: 'Token valide' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
