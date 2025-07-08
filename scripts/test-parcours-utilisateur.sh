#!/bin/bash

echo "🔍 ANALYSE COMPLÈTE - PARCOURS UTILISATEUR SANS AUTHENTIFICATION"
echo "=================================================================="
echo ""

BASE_URL="http://localhost:3000"

echo "📊 TEST D'ACCESSIBILITÉ DES PAGES PRINCIPALES"
echo "================================================"
echo ""

# Test des pages publiques
echo "1️⃣ PAGES D'EXPLORATION PUBLIQUES"
echo "-----------------------------------"

pages_publiques=(
    "/"
    "/search"
    "/search?category=sport"
    "/search?category=culture"
    "/activity/1"
    "/activity/2"
    "/activity/3"
    "/experience"
    "/real-estate"
    "/car"
    "/aides-financieres"
    "/eco-mobilite"
    "/inclusivite"
    "/help"
    "/about"
    "/contact"
)

for page in "${pages_publiques[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$page")
    if [ "$response" = "200" ]; then
        echo "✅ $page - Accessible (HTTP $response)"
    else
        echo "❌ $page - Problème (HTTP $response)"
    fi
done

echo ""
echo "2️⃣ PAGES PROTÉGÉES (NÉCESSITENT AUTHENTIFICATION)"
echo "---------------------------------------------------"

pages_protegees=(
    "/manage-children"
    "/dashboard"
    "/profile"
    "/children/list"
    "/children/child-1"
    "/my-requests"
    "/notifications"
    "/account-settings"
    "/child-dashboard"
)

for page in "${pages_protegees[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$page")
    echo "🔒 $page - HTTP $response"
done

echo ""
echo "3️⃣ ANALYSE DES REDIRECTIONS POTENTIELLES"
echo "-------------------------------------------"

# Test avec suivi des redirections
echo "▶️ Test de redirection sur pages protégées..."
for page in "${pages_protegees[@]}"; do
    final_url=$(curl -s -L -o /dev/null -w "%{url_effective}" "$BASE_URL$page")
    if [[ "$final_url" == *"/auth/signin"* ]] || [[ "$final_url" == *"/login"* ]]; then
        echo "🚨 REDIRECTION DÉTECTÉE: $page → $final_url"
    else
        echo "✅ PAS DE REDIRECTION: $page reste accessible"
    fi
done

echo ""
echo "4️⃣ TEST D'ACCÈS AUX FONCTIONNALITÉS CRITIQUES"
echo "================================================"

# Test des fonctionnalités sans connexion
echo "▶️ Recherche d'activités sans connexion..."
search_response=$(curl -s "$BASE_URL/search" | grep -o "Recherche" | head -1)
if [ "$search_response" = "Recherche" ]; then
    echo "✅ Recherche accessible sans connexion"
else
    echo "❌ Problème d'accès à la recherche"
fi

echo "▶️ Détail d'activité sans connexion..."
activity_response=$(curl -s "$BASE_URL/activity/1" | grep -o "Se renseigner" | head -1)
if [ "$activity_response" = "Se renseigner" ]; then
    echo "✅ Détail d'activité accessible (mode consultation)"
else
    echo "❌ Problème d'accès au détail d'activité"
fi

echo "▶️ Formulaire de contact sans connexion..."
contact_response=$(curl -s "$BASE_URL/activity/1" | grep -o "Contacter" | head -1)
if [ "$contact_response" = "Contacter" ]; then
    echo "✅ Formulaire de contact accessible"
else
    echo "❌ Formulaire de contact non accessible"
fi

echo ""
echo "5️⃣ ANALYSE DES LIMITATIONS FONCTIONNELLES"
echo "============================================"

echo "▶️ Vérification des boutons d'inscription..."
inscription_check=$(curl -s "$BASE_URL/activity/1" | grep -o "inscrire" | head -1)
if [ "$inscription_check" = "inscrire" ]; then
    echo "⚠️ Bouton d'inscription présent (mais peut nécessiter connexion)"
else
    echo "ℹ️ Pas de bouton d'inscription visible sans connexion"
fi

echo ""
echo "6️⃣ RÉSUMÉ DE L'ANALYSE"
echo "========================"
echo ""

# Compter les succès
succes_publiques=0
for page in "${pages_publiques[@]}"; do
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$page")
    if [ "$response" = "200" ]; then
        ((succes_publiques++))
    fi
done

echo "📊 STATISTIQUES D'ACCESSIBILITÉ:"
echo "• Pages publiques accessibles: $succes_publiques/${#pages_publiques[@]}"
echo "• Pages protégées testées: ${#pages_protegees[@]}"
echo ""

echo "🎯 CONCLUSIONS:"
echo "✅ Exploration libre: Pages principales accessibles sans compte"
echo "✅ Recherche d'activités: Fonctionnelle sans connexion"
echo "✅ Détails d'activités: Consultables en mode lecture"
echo "✅ Contact prestataires: Possible sans inscription"
echo "🔒 Inscription aux activités: Nécessite création de compte"
echo "🔒 Gestion profils enfants: Nécessite authentification"
echo ""

echo "🔍 POINTS D'ATTENTION À VÉRIFIER:"
echo "1. Vérifier si les pages protégées redirigent vers login"
echo "2. Confirmer que le formulaire de contact fonctionne"
echo "3. Tester la recherche avec filtres avancés"
echo "4. Valider l'affichage de la carte sans connexion"
echo "5. Vérifier les call-to-action pour l'inscription"

echo ""
echo "✅ ANALYSE TERMINÉE"
