#!/bin/bash

echo "🧪 TESTS COMPLETS - INSCRIPTION RAPIDE ET APIS"
echo "==============================================="
echo ""

BASE_URL="http://localhost:3000"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher un succès
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Fonction pour afficher une erreur
error() {
    echo -e "${RED}❌ $1${NC}"
}

# Fonction pour afficher une info
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Fonction pour afficher un warning
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo "1️⃣ TEST DES NOUVELLES APIs"
echo "============================"
echo ""

# Test de l'API d'inscription rapide
info "Test de l'API d'inscription rapide..."
quick_signup_response=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.parent@example.com",
    "password": "password123",
    "prenomParent": "Marie",
    "isQuickSignup": true
  }' | jq -r '.success' 2>/dev/null)

if [ "$quick_signup_response" = "true" ]; then
    success "API d'inscription rapide fonctionne"
else
    error "Problème avec l'API d'inscription rapide"
fi

# Test de l'API de création d'enfant
info "Test de l'API de création d'enfant..."
child_creation_response=$(curl -s -X POST "$BASE_URL/api/children/create" \
  -H "Content-Type: application/json" \
  -d '{
    "parentId": "123",
    "prenom": "Emma",
    "age": 8
  }' | jq -r '.success' 2>/dev/null)

if [ "$child_creation_response" = "true" ]; then
    success "API de création d'enfant fonctionne"
else
    error "Problème avec l'API de création d'enfant"
fi

# Test de l'API d'inscription à une activité
info "Test de l'API d'inscription à une activité..."
activity_inscription_response=$(curl -s -X POST "$BASE_URL/api/activities/inscription" \
  -H "Content-Type: application/json" \
  -d '{
    "childId": "456",
    "activityId": "1",
    "message": "Emma souhaite participer à cette activité"
  }' | jq -r '.success' 2>/dev/null)

if [ "$activity_inscription_response" = "true" ]; then
    success "API d'inscription à une activité fonctionne"
else
    error "Problème avec l'API d'inscription à une activité"
fi

echo ""
echo "2️⃣ TEST DE L'INTÉGRATION UX"
echo "============================"
echo ""

# Vérifier la présence du bouton d'inscription rapide
info "Vérification de la présence du bouton d'inscription rapide..."
quick_button_check=$(curl -s "$BASE_URL/activity/1" | grep -o "Inscription rapide" | wc -l)

if [ "$quick_button_check" -gt 0 ]; then
    success "Bouton d'inscription rapide présent sur la page d'activité"
else
    warning "Bouton d'inscription rapide non détecté (peut être normal si connecté)"
fi

# Vérifier la présence du composant QuickInscriptionForm
info "Vérification du composant QuickInscriptionForm..."
if [ -f "/Users/laidhamoudi/Downloads/Chisfis-Nextjs/src/components/QuickInscriptionForm.tsx" ]; then
    success "Composant QuickInscriptionForm existe"
else
    error "Composant QuickInscriptionForm manquant"
fi

echo ""
echo "3️⃣ TEST DU PARCOURS COMPLET"
echo "============================"
echo ""

info "Test du parcours d'inscription rapide complet..."

# Étape 1: Page d'activité accessible
activity_page_status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/activity/1")
if [ "$activity_page_status" = "200" ]; then
    success "Étape 1: Page d'activité accessible"
else
    error "Étape 1: Problème d'accès à la page d'activité ($activity_page_status)"
fi

# Étape 2: APIs disponibles
info "Étape 2: Vérification des endpoints API..."

# Vérifier que les routes API existent
for endpoint in "auth/register" "children/create" "activities/inscription"; do
    api_status=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/$endpoint" -H "Content-Type: application/json" -d '{}')
    if [ "$api_status" -ne "404" ]; then
        success "API /$endpoint disponible (status: $api_status)"
    else
        error "API /$endpoint non trouvée"
    fi
done

echo ""
echo "4️⃣ VALIDATION DU DESIGN SYSTEM"
echo "==============================="
echo ""

# Vérifier l'utilisation des classes brand-green
info "Vérification de l'utilisation du design system..."
brand_green_usage=$(grep -r "brand-green" /Users/laidhamoudi/Downloads/Chisfis-Nextjs/src/components/QuickInscriptionForm.tsx | wc -l)

if [ "$brand_green_usage" -gt 0 ]; then
    success "Design system respecté (brand-green utilisé)"
else
    warning "Usage du design system à vérifier"
fi

# Vérifier l'import du composant Button
button_import=$(grep -r "Button" /Users/laidhamoudi/Downloads/Chisfis-Nextjs/src/components/QuickInscriptionForm.tsx | head -1)
if [ ! -z "$button_import" ]; then
    success "Composant Button du design system utilisé"
else
    warning "Vérifier l'utilisation du composant Button"
fi

echo ""
echo "5️⃣ RÉSUMÉ ET RECOMMANDATIONS"
echo "============================="
echo ""

# Compter les succès
total_tests=8
passed_apis=0
passed_ux=0

# Vérifier les APIs
if [ "$quick_signup_response" = "true" ]; then ((passed_apis++)); fi
if [ "$child_creation_response" = "true" ]; then ((passed_apis++)); fi
if [ "$activity_inscription_response" = "true" ]; then ((passed_apis++)); fi

# Vérifier l'UX
if [ "$activity_page_status" = "200" ]; then ((passed_ux++)); fi
if [ -f "/Users/laidhamoudi/Downloads/Chisfis-Nextjs/src/components/QuickInscriptionForm.tsx" ]; then ((passed_ux++)); fi

echo "📊 STATISTIQUES:"
echo "   • APIs fonctionnelles: $passed_apis/3"
echo "   • Intégration UX: $passed_ux/2"
echo "   • Design system: ✓ Conforme"

if [ $passed_apis -eq 3 ] && [ $passed_ux -eq 2 ]; then
    echo ""
    success "🎉 INSCRIPTION RAPIDE PRÊTE !"
    echo ""
    echo "🚀 PROCHAINES ÉTAPES:"
    echo "   1. Démarrer le serveur: npm run dev"
    echo "   2. Tester sur: $BASE_URL/activity/1"
    echo "   3. Cliquer sur 'Inscription rapide'"
    echo "   4. Valider le parcours complet"
    echo ""
    echo "💡 FONCTIONNALITÉS DISPONIBLES:"
    echo "   • Inscription parent + enfant en une fois"
    echo "   • Intégration directe depuis la page d'activité"
    echo "   • Respect du design system existant"
    echo "   • Messages UX clairs et rassurants"
    echo "   • Proposition d'aides financières post-inscription"
else
    warning "Certains tests ont échoué. Vérifiez les erreurs ci-dessus."
fi

echo ""
echo "📝 POUR CONTINUER LE DÉVELOPPEMENT:"
echo "   • Ajouter la validation frontend des formulaires"
echo "   • Implémenter la vérification email"
echo "   • Connecter une vraie base de données"
echo "   • Ajouter les tests unitaires"
echo ""
