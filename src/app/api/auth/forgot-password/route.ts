import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { resetTokens, users, cleanupExpiredTokens } from '@/lib/auth-tokens'

// Fonction pour simuler l'envoi d'email
const sendResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/reset-password?token=${token}`
  
  // En production, remplacez par un vrai service d'email (SendGrid, Nodemailer, etc.)
  console.log(`
    ✉️  EMAIL DE RÉINITIALISATION SIMULÉ ✉️
    À: ${email}
    Sujet: Réinitialisation de votre mot de passe
    
    Cliquez sur le lien suivant pour réinitialiser votre mot de passe :
    ${resetLink}
    
    Ce lien expire dans 1 heure.
    
    Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
  `)
  
  return true
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validation de l'email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { message: 'Adresse email invalide' },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur existe
    if (!users.has(email)) {
      // Pour des raisons de sécurité, on renvoie toujours un message de succès
      // même si l'email n'existe pas
      return NextResponse.json(
        { message: 'Si cette adresse email existe, vous recevrez un lien de réinitialisation' },
        { status: 200 }
      )
    }

    // Générer un token de réinitialisation sécurisé
    const token = crypto.randomBytes(32).toString('hex')
    
    // Stocker le token avec une date d'expiration (1 heure)
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 heure
    resetTokens.set(token, { email, expires })

    // Nettoyer les tokens expirés (optionnel, pour éviter l'accumulation)
    cleanupExpiredTokens()

    // Envoyer l'email de réinitialisation
    await sendResetEmail(email, token)

    return NextResponse.json(
      { message: 'Un lien de réinitialisation a été envoyé à votre adresse email' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
