const express = require('express');

// Import des routes
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const collectivityRoutes = require('./collectivity.routes');
const partnerRoutes = require('./partner.routes');
const activityRoutes = require('./activity.routes');

// Fonction pour configurer toutes les routes
const configureRoutes = (app) => {
  // Routes d'authentification
  app.use('/api/auth', authRoutes);
  
  // Routes API
  app.use('/api/users', userRoutes);
  app.use('/api/collectivities', collectivityRoutes);
  app.use('/api/partners', partnerRoutes);
  app.use('/api/activities', activityRoutes);

  // Route de documentation API
  app.get('/api', (req, res) => {
    res.json({
      message: 'Chisfis API v1.0',
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
        collectivities: '/api/collectivities',
        partners: '/api/partners',
        activities: '/api/activities'
      },
      documentation: '/api/docs' // Future documentation Swagger
    });
  });
};

module.exports = configureRoutes;
