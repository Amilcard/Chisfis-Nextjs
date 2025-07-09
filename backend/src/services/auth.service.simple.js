const crypto = require('crypto');

class AuthService {
  constructor() {
    // Stockage temporaire des tokens de réinitialisation
    this.resetTokens = new Map();
  }

  async saveResetToken(userId, token, expiry) {
    this.resetTokens.set(token, {
      userId,
      expiry,
      createdAt: new Date()
    });
    this.cleanupExpiredTokens();
  }

  async validateResetToken(token) {
    const tokenData = this.resetTokens.get(token);
    
    if (!tokenData) {
      return null;
    }

    // Vérifier l'expiration
    if (new Date() > tokenData.expiry) {
      this.resetTokens.delete(token);
      return null;
    }

    return tokenData;
  }

  async deleteResetToken(token) {
    this.resetTokens.delete(token);
  }

  cleanupExpiredTokens() {
    const now = new Date();
    
    for (const [token, data] of this.resetTokens.entries()) {
      if (now > data.expiry) {
        this.resetTokens.delete(token);
      }
    }
  }

  async sendResetPasswordEmail(email, token) {
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    // En mode développement, on affiche l'email dans la console
    console.log(`
      ✉️  EMAIL DE RÉINITIALISATION SIMULÉ ✉️
      À: ${email}
      Lien de réinitialisation: ${resetLink}
      Ce lien expire dans 1 heure.
    `);
    
    return true;
  }

  async sendWelcomeEmail(email, firstName) {
    console.log(`
      ✉️  EMAIL DE BIENVENUE SIMULÉ ✉️
      À: ${email}
      Bienvenue, ${firstName} !
    `);
    
    return true;
  }

  generateToken(payload, expiresIn = '7d') {
    const jwt = require('jsonwebtoken');
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET non configuré dans les variables d\'environnement');
    }
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  }

  verifyToken(token) {
    try {
      const jwt = require('jsonwebtoken');
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET non configuré dans les variables d\'environnement');
      }
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new AuthService();
