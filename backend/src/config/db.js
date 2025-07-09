// Configuration de base de données simplifiée pour le développement
// En mode développement, on utilise le stockage en mémoire
// En production, on utilisera PostgreSQL

const isDevelopment = process.env.NODE_ENV === 'development';

let dbConnection = null;

// Configuration pour le stockage en mémoire (développement)
const memoryStorage = {
  users: new Map(),
  activities: new Map(),
  resetTokens: new Map()
};

// Configuration PostgreSQL (production)
let pgPool = null;

if (!isDevelopment) {
  const { Pool } = require('pg');
  
  pgPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'chisfis_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pgPool.on('connect', () => {
    console.log('✅ Connexion PostgreSQL établie');
  });

  pgPool.on('error', (err) => {
    console.error('❌ Erreur PostgreSQL:', err);
  });
}

// Fonction pour initialiser la connexion DB
const initDB = async () => {
  try {
    if (isDevelopment) {
      console.log('🧠 Mode développement : Utilisation du stockage en mémoire');
      dbConnection = memoryStorage;
      return true;
    } else {
      console.log('🐘 Mode production : Connexion à PostgreSQL...');
      const client = await pgPool.connect();
      console.log('✅ Test de connexion PostgreSQL réussi');
      client.release();
      dbConnection = pgPool;
      return true;
    }
  } catch (err) {
    console.error('❌ Échec d\'initialisation de la DB:', err.message);
    
    // Fallback vers le stockage en mémoire même en production
    console.log('⚠️  Fallback vers le stockage en mémoire');
    dbConnection = memoryStorage;
    return false;
  }
};

// Fonction pour exécuter des requêtes
const query = async (text, params) => {
  if (isDevelopment || !pgPool) {
    // En développement, on simule les requêtes
    console.log('🧠 Simulation de requête:', { text, params });
    return { rows: [], rowCount: 0 };
  }

  const start = Date.now();
  try {
    const res = await pgPool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Requête PostgreSQL exécutée', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('❌ Erreur lors de l\'execution de la requete:', err);
    throw err;
  }
};

// Fonction pour obtenir le stockage (mémoire ou DB)
const getStorage = () => {
  if (isDevelopment || !pgPool) {
    return memoryStorage;
  }
  return pgPool;
};

// Fonction pour fermer la connexion
const closeDB = async () => {
  if (pgPool) {
    await pgPool.end();
    console.log('🔚 Connexion PostgreSQL fermée');
  }
};

module.exports = {
  initDB,
  query,
  getStorage,
  closeDB,
  isDevelopment
};
