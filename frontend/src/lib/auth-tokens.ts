// Module partagé pour la gestion des tokens de réinitialisation
// En production, utilisez une base de données

// Simulation d'une base de données pour les tokens de réinitialisation
export const resetTokens = new Map<string, { email: string; expires: Date }>()

// Simulation d'une base de données d'utilisateurs
export const users = new Map([
  ['user@example.com', { id: '1', email: 'user@example.com', password: 'hashedpassword' }],
  ['test@test.com', { id: '2', email: 'test@test.com', password: 'hashedpassword' }],
])

// Nettoyage automatique des tokens expirés
export const cleanupExpiredTokens = () => {
  for (const [tokenKey, data] of resetTokens.entries()) {
    if (data.expires < new Date()) {
      resetTokens.delete(tokenKey)
    }
  }
}

// Fonction utilitaire pour vérifier si un token est valide
export const isTokenValid = (token: string): boolean => {
  const tokenData = resetTokens.get(token)
  if (!tokenData) return false
  
  if (tokenData.expires < new Date()) {
    resetTokens.delete(token) // Nettoyer le token expiré
    return false
  }
  
  return true
}
