const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');

// Middleware d'authentification JWT
const authMiddleware = async (req, res, next) => {
  try {
    // Récupérer le token depuis l'en-tête Authorization
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant'
      });
    }

    // Vérifier le format Bearer token
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Format de token invalide'
      });
    }

    // Vérifier et décoder le token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET non configuré dans les variables d\'environnement');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Récupérer l'utilisateur depuis la base de données
    console.log('🔍 Auth middleware - Recherche utilisateur ID: [MASQUÉ]');
    const user = await userService.getUserById(decoded.userId);
    console.log('👤 Auth middleware - Utilisateur trouvé:', user ? 'OUI' : 'NON');
    
    if (!user) {
      console.log('❌ Auth middleware - Utilisateur non trouvé pour ID: [MASQUÉ]');
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    console.log('✅ Auth middleware - Utilisateur trouvé:', { id: user.id, isActive: user.isActive });

    if (!user.isActive) {
      console.log('❌ Auth middleware - Compte désactivé');
      return res.status(401).json({
        success: false,
        message: 'Compte utilisateur désactivé'
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      });
    }

    console.error('Erreur middleware auth:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Middleware pour vérifier les rôles spécifiques
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
    const requiredRoles = Array.isArray(roles) ? roles : [roles];

    const hasRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: 'Permissions insuffisantes'
      });
    }

    next();
  };
};

// Middleware pour vérifier si l'utilisateur est admin
const requireAdmin = requireRole(['admin', 'super_admin']);

// Middleware pour vérifier si l'utilisateur est partenaire
const requirePartner = requireRole(['partner', 'admin', 'super_admin']);

// Middleware pour vérifier si l'utilisateur est collectivité
const requireCollectivity = requireRole(['collectivity', 'admin', 'super_admin']);

// Middleware optionnel (ajoute l'utilisateur s'il est connecté, sinon continue)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return next();
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return next();
    }

    if (!process.env.JWT_SECRET) {
      return next(); // En mode optionnel, on continue si pas de JWT_SECRET
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userService.getUserById(decoded.userId);
    
    if (user && user.status === 'active') {
      req.user = user;
    }

    next();
  } catch (error) {
    // En cas d'erreur, on continue sans utilisateur
    next();
  }
};

module.exports = {
  authMiddleware,
  requireRole,
  requireAdmin,
  requirePartner,
  requireCollectivity,
  optionalAuth
};
