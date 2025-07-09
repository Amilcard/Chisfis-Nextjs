const express = require('express');
const cors = require('cors');
const path = require('path');

// Chargement du fichier .env depuis le répertoire parent
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Debug : vérifier les variables d'environnement
console.log('🔧 Variables d\'environnement chargées:');
console.log(`   PORT: ${process.env.PORT}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Défini' : '❌ Non défini'}`);
console.log(`   DB_HOST: ${process.env.DB_HOST}`);
console.log('');

// Import de la configuration de base de données
const { initDB } = require('./config/db');

// Import des routes
const configureRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes de base
app.get('/', (req, res) => {
  res.json({
    message: 'Chisfis Backend API - Serveur opérationnel ✅',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Route ping pour tester la connectivité
app.get('/ping', (req, res) => {
  res.json({
    message: 'pong',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Route de santé pour vérifier la DB
app.get('/health', async (req, res) => {
  try {
    const dbStatus = await initDB();
    res.json({
      status: 'healthy',
      database: dbStatus ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Configuration des routes API
configureRoutes(app);

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err.stack);
  
  // Erreur de validation JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Format JSON invalide',
      error: 'Syntax error in JSON'
    });
  }

  // Erreur de taille de payload
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'Fichier trop volumineux',
      error: 'File size limit exceeded'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Middleware pour les routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: {
      api: '/api',
      health: '/health',
      ping: '/ping',
      collectivities: '/api/collectivities',
      partners: '/api/partners',
      users: '/api/users',
      activities: '/api/activities'
    }
  });
});

// Démarrage du serveur
const startServer = async () => {
  try {
    // Tester la connexion à la base de données au démarrage
    console.log('🔍 Test de la connexion à la base de données...');
    const dbConnected = await initDB();
    
    if (!dbConnected) {
      console.warn('⚠️  Base de données non disponible - Le serveur démarre quand même');
    }

    app.listen(PORT, () => {
      console.log('🚀 ================================');
      console.log(`🚀 Serveur Chisfis backend démarré !`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💾 Base de données: ${dbConnected ? '✅ Connectée' : '❌ Déconnectée'}`);
      console.log(`⏰ Démarré le: ${new Date().toLocaleString('fr-FR')}`);
      console.log('🚀 ================================');
      
      console.log('\n📚 Routes disponibles:');
      console.log('   GET  /              - Informations API');
      console.log('   GET  /ping          - Test connectivité');
      console.log('   GET  /health        - État de santé');
      console.log('   GET  /api           - Documentation API');
      console.log('   *    /api/*         - Routes métier');
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Gestion des arrêts gracieux
process.on('SIGTERM', () => {
  console.log('🛑 Signal SIGTERM reçu - Arrêt gracieux du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Signal SIGINT reçu - Arrêt gracieux du serveur...');
  process.exit(0);
});

// Démarrer le serveur
startServer();

module.exports = app;
