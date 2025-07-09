const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const router = express.Router();
const authService = require('../services/auth.service');
const userService = require('../services/user.service');
const { validateEmail, validatePassword } = require('../utils/validation');

/**
 * @route POST /api/auth/register
 * @desc Inscription d'un nouvel utilisateur
 * @access Public
 */
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Début de l\'inscription:', req.body);
    
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
    } = req.body;

    console.log('✅ Données extraites:', { firstName, lastName, email, isQuickSignup });

    // Validation pour inscription rapide (plus souple)
    if (isQuickSignup) {
      if (!email || !password || !prenomParent) {
        return res.status(400).json({
          message: 'Email, mot de passe et prénom du parent sont obligatoires pour l\'inscription rapide'
        });
      }
    } else {
      // Validation standard
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          message: 'Tous les champs obligatoires doivent être remplis'
        });
      }
    }

    console.log('✅ Validation des champs OK');

    // Validation du format email
    if (!validateEmail(email)) {
      return res.status(400).json({
        message: 'Format d\'email invalide'
      });
    }

    console.log('✅ Validation email OK');

    // Validation du mot de passe
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: passwordValidation.message
      });
    }

    console.log('✅ Validation mot de passe OK');

    // Vérification si l'email existe déjà
    console.log('🔍 Vérification email existant...');
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: 'Un compte avec cet email existe déjà'
      });
    }

    console.log('✅ Email disponible');

    // Hasher le mot de passe
    console.log('🔐 Hashage du mot de passe...');
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log('✅ Mot de passe hashé');

    // Création du nouvel utilisateur
    const userData = {
      firstName: firstName || prenomParent || '',
      lastName: lastName || '',
      email,
      password: hashedPassword,
      phone: phone || null,
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      newsletter: newsletter || false,
      emailVerified: false,
      isQuickSignup: isQuickSignup || false,
      type: 'parent', // Par défaut, tous les nouveaux comptes sont des parents
      isActive: true
    };

    console.log('👤 Création utilisateur...');
    const newUser = await userService.createUser(userData);

    console.log('✅ Utilisateur créé:', newUser.id);

    // Log pour le développement
    console.log('Nouvel utilisateur créé:', {
      ...newUser,
      password: '[MASQUÉ]'
    });

    // Générer un JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email,
        type: newUser.type 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retour de succès (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Connexion d'un utilisateur
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email et mot de passe requis'
      });
    }

    // Rechercher l'utilisateur
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        message: 'Identifiants invalides'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Identifiants invalides'
      });
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(401).json({
        message: 'Compte désactivé'
      });
    }

    // Générer un JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        type: user.type 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Mettre à jour la dernière connexion
    await userService.updateLastLogin(user.id);

    // Retour de succès (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Connexion réussie',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

/**
 * @route POST /api/auth/forgot-password
 * @desc Demande de réinitialisation de mot de passe
 * @access Public
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Validation de l'email
    if (!email || !validateEmail(email)) {
      return res.status(400).json({
        message: 'Adresse email invalide'
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await userService.findUserByEmail(email);
    if (!user) {
      // Pour des raisons de sécurité, on renvoie toujours un message de succès
      return res.json({
        message: 'Si cette adresse email existe, vous recevrez un lien de réinitialisation'
      });
    }

    // Générer un token de réinitialisation sécurisé
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    // Sauvegarder le token
    await authService.saveResetToken(user.id, resetToken, resetTokenExpiry);

    // Envoyer l'email de réinitialisation
    await authService.sendResetPasswordEmail(email, resetToken);

    res.json({
      message: 'Un lien de réinitialisation a été envoyé à votre adresse email'
    });

  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
});

/**
 * @route POST /api/auth/reset-password
 * @desc Réinitialisation du mot de passe
 * @access Public
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    // Validation des données
    if (!token || !password) {
      return res.status(400).json({
        message: 'Token et mot de passe requis'
      });
    }

    // Validation du mot de passe
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: passwordValidation.message
      });
    }

    // Vérifier le token
    const tokenData = await authService.validateResetToken(token);
    if (!tokenData) {
      return res.status(400).json({
        message: 'Token de réinitialisation invalide ou expiré'
      });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Mettre à jour le mot de passe de l'utilisateur
    await userService.updatePassword(tokenData.userId, hashedPassword);

    // Supprimer le token utilisé
    await authService.deleteResetToken(token);

    console.log('Mot de passe réinitialisé pour l\'utilisateur: [MASQUÉ]');

    res.json({
      message: 'Mot de passe réinitialisé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
});

/**
 * @route GET /api/auth/verify-reset-token
 * @desc Vérifier la validité d'un token de réinitialisation
 * @access Public
 */
router.get('/verify-reset-token', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        message: 'Token manquant'
      });
    }

    const tokenData = await authService.validateResetToken(token);
    if (!tokenData) {
      return res.status(400).json({
        valid: false,
        message: 'Token invalide ou expiré'
      });
    }

    res.json({
      valid: true,
      message: 'Token valide'
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur'
    });
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Déconnexion d'un utilisateur
 * @access Private
 */
router.post('/logout', async (req, res) => {
  try {
    // En JWT, la déconnexion côté serveur peut être gérée en blacklistant le token
    // Pour simplifier, on retourne juste un succès
    // Le client devra supprimer le token de son stockage local
    
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });

  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
});

module.exports = router;
