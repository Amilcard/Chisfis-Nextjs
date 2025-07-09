#!/bin/bash

echo "🔄 Redémarrage du serveur..."
pkill -f "node.*app.js" 2>/dev/null || true
sleep 1

echo "🚀 Démarrage du serveur en arrière-plan..."
node src/app.js &
SERVER_PID=$!

echo "⏳ Attente du démarrage (3 secondes)..."
sleep 3

echo ""
echo "🧪 TEST 1: Inscription d'un utilisateur"
curl -X POST http://localhost:3003/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Debug",
    "lastName": "Test", 
    "email": "debug@test.com",
    "password": "password123"
  }' | jq .

echo ""
echo "🧪 TEST 2: Connexion (récupération du token)"
TOKEN=$(curl -s -X POST http://localhost:3003/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "debug@test.com",
    "password": "password123"
  }' | jq -r .token)

echo "Token récupéré: ${TOKEN:0:50}..."

echo ""
echo "🧪 TEST 3: Création d'enfant avec token"
curl -X POST http://localhost:3003/api/children \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Enfant Test",
    "dateOfBirth": "2015-01-01",
    "gender": "M"
  }' | jq .

echo ""
echo "🛑 Arrêt du serveur"
kill $SERVER_PID

echo "✅ Tests terminés"
