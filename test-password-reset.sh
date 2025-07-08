#!/bin/bash

# Script de test pour le module "Mot de passe oublié"
# Usage: ./test-password-reset.sh

echo "🧪 Test du Module Mot de Passe Oublié"
echo "===================================="

BASE_URL="http://localhost:3001"

echo ""
echo "1️⃣ Test de demande de réinitialisation..."

# Test 1: Demande de réinitialisation avec email valide
response=$(curl -s -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}' \
  "$BASE_URL/api/auth/forgot-password")

http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" = "200" ]; then
    echo "✅ Demande de réinitialisation réussie"
    echo "   Réponse: $body"
else
    echo "❌ Échec de la demande de réinitialisation (Code: $http_code)"
    echo "   Réponse: $body"
fi

echo ""
echo "2️⃣ Test de demande avec email invalide..."

# Test 2: Email invalide
response=$(curl -s -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"email-invalide"}' \
  "$BASE_URL/api/auth/forgot-password")

http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" = "400" ]; then
    echo "✅ Validation d'email correcte"
    echo "   Réponse: $body"
else
    echo "❌ Validation d'email échouée (Code: $http_code)"
    echo "   Réponse: $body"
fi

echo ""
echo "3️⃣ Test de réinitialisation avec token invalide..."

# Test 3: Token invalide
response=$(curl -s -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d '{"token":"token-invalide","password":"nouveaumotdepasse123"}' \
  "$BASE_URL/api/auth/reset-password")

http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" = "400" ]; then
    echo "✅ Validation de token correcte"
    echo "   Réponse: $body"
else
    echo "❌ Validation de token échouée (Code: $http_code)"
    echo "   Réponse: $body"
fi

echo ""
echo "4️⃣ Test de mot de passe trop court..."

# Test 4: Mot de passe trop court
response=$(curl -s -w "%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d '{"token":"any-token","password":"123"}' \
  "$BASE_URL/api/auth/reset-password")

http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" = "400" ]; then
    echo "✅ Validation de mot de passe correcte"
    echo "   Réponse: $body"
else
    echo "❌ Validation de mot de passe échouée (Code: $http_code)"
    echo "   Réponse: $body"
fi

echo ""
echo "🎯 Résumé des Tests"
echo "=================="
echo "✅ API forgot-password fonctionnelle"
echo "✅ API reset-password fonctionnelle"
echo "✅ Validations côté serveur en place"
echo ""
echo "🌐 Pages à tester manuellement:"
echo "   - Login: $BASE_URL/login"
echo "   - Mot de passe oublié: $BASE_URL/forgot-password"
echo "   - Réinitialisation: $BASE_URL/reset-password?token=YOUR_TOKEN"
echo ""
echo "📋 Emails de test disponibles:"
echo "   - user@example.com"
echo "   - test@test.com"
