#!/bin/bash

# Script d'audit UI automatisé
# Version: 1.0
# Date: $(date '+%Y-%m-%d')

echo "🔍 AUDIT UI AUTOMATISÉ - Chisfis-Nextjs"
echo "========================================"

# Configuration des couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Compteurs
CRITICAL_ERRORS=0
MODERATE_ISSUES=0
MINOR_WARNINGS=0

echo ""
echo "${BLUE}📋 1. ANALYSE DES ERREURS DE BUILD${NC}"
echo "-----------------------------------"

# Test de build
echo "🔨 Test de build Next.js..."
BUILD_OUTPUT=$(npm run build 2>&1)
BUILD_STATUS=$?

if [ $BUILD_STATUS -eq 0 ]; then
    echo "✅ Build réussi"
    PAGES_COUNT=$(echo "$BUILD_OUTPUT" | grep -o "([0-9]*/[0-9]*)" | tail -1)
    echo "📄 Pages générées : $PAGES_COUNT"
else
    echo "❌ Échec du build"
    CRITICAL_ERRORS=$((CRITICAL_ERRORS + 1))
    echo "$BUILD_OUTPUT" | tail -20
fi

echo ""
echo "${BLUE}📋 2. ANALYSE ESLINT${NC}"
echo "--------------------"

# Analyse ESLint
LINT_OUTPUT=$(npm run lint 2>&1)
LINT_WARNINGS=$(echo "$LINT_OUTPUT" | grep -c "Warning:")
LINT_ERRORS=$(echo "$LINT_OUTPUT" | grep -c "Error:")

echo "⚠️  Warnings ESLint : $LINT_WARNINGS"
echo "❌ Erreurs ESLint : $LINT_ERRORS"

if [ $LINT_ERRORS -gt 0 ]; then
    CRITICAL_ERRORS=$((CRITICAL_ERRORS + LINT_ERRORS))
fi
MINOR_WARNINGS=$((MINOR_WARNINGS + LINT_WARNINGS))

echo ""
echo "${BLUE}📋 3. DÉTECTION DES VIOLATIONS DU DESIGN SYSTEM${NC}"
echo "-----------------------------------------------"

# Recherche de couleurs hardcodées
echo "🎨 Analyse des couleurs hardcodées..."
HARDCODED_COLORS=$(grep -r "bg-\(red\|blue\|green\|yellow\)-[0-9]" src/ --include="*.tsx" --include="*.ts" | wc -l)
echo "⚠️  Couleurs hardcodées trouvées : $HARDCODED_COLORS"

if [ $HARDCODED_COLORS -gt 0 ]; then
    MODERATE_ISSUES=$((MODERATE_ISSUES + 1))
    echo "📁 Fichiers concernés :"
    grep -r "bg-\(red\|blue\|green\|yellow\)-[0-9]" src/ --include="*.tsx" --include="*.ts" -l | head -5
fi

echo ""
echo "${BLUE}📋 4. DÉTECTION DES IMPORTS INUTILISÉS${NC}"
echo "----------------------------------------"

# Recherche d'imports inutilisés (approximation)
echo "📦 Analyse des imports..."
UNUSED_IMPORTS=$(grep -r "^import.*from" src/ --include="*.tsx" --include="*.ts" | wc -l)
echo "📋 Total d'imports analysés : $UNUSED_IMPORTS"

echo ""
echo "${BLUE}📋 5. DÉTECTION DES DOUBLONS DE COMPOSANTS${NC}"
echo "--------------------------------------------"

# Recherche de composants similaires
echo "🔍 Recherche de doublons potentiels..."

# FilterPopover doublons
FILTER_POPOVERS=$(find src/ -name "*FilterPopover*" -type f | wc -l)
echo "🔄 FilterPopover variants : $FILTER_POPOVERS"
if [ $FILTER_POPOVERS -gt 1 ]; then
    echo "📁 Variants trouvés :"
    find src/ -name "*FilterPopover*" -type f
    MODERATE_ISSUES=$((MODERATE_ISSUES + 1))
fi

# Header doublons
HEADER_COMPONENTS=$(find src/ -name "*Header*" -type f | grep -v node_modules | wc -l)
echo "🔄 Header components : $HEADER_COMPONENTS"

echo ""
echo "${BLUE}📋 6. ANALYSE DES HOOKS REACT${NC}"
echo "------------------------------"

# Recherche de problèmes useEffect
echo "⚛️  Analyse des hooks React..."
USEEFFECT_ISSUES=$(grep -r "useEffect.*\[\]" src/ --include="*.tsx" --include="*.ts" | wc -l)
echo "⚠️  useEffect avec dépendances vides : $USEEFFECT_ISSUES"

if [ $USEEFFECT_ISSUES -gt 0 ]; then
    MODERATE_ISSUES=$((MODERATE_ISSUES + 1))
fi

echo ""
echo "${BLUE}📋 7. ANALYSE DE LA NAVIGATION${NC}"
echo "-------------------------------"

# Recherche d'utilisation incorrecte de <a>
echo "🔗 Analyse des liens de navigation..."
INCORRECT_LINKS=$(grep -r "<a href=" src/ --include="*.tsx" --include="*.ts" | wc -l)
echo "⚠️  Balises <a> détectées (devrait être <Link>) : $INCORRECT_LINKS"

if [ $INCORRECT_LINKS -gt 0 ]; then
    MODERATE_ISSUES=$((MODERATE_ISSUES + 1))
fi

echo ""
echo "${BLUE}📋 8. ANALYSE DES PAGES PRINCIPALES${NC}"
echo "-----------------------------------"

# Vérification de l'existence des pages critiques
CRITICAL_PAGES=(
    "src/app/(app)/(home-pages)/page.tsx"
    "src/app/(app)/search/page.tsx"
    "src/app/(account)/dashboard/page.tsx"
    "src/app/(auth)/auth/signin/page.tsx"
)

echo "📄 Vérification des pages critiques..."
for page in "${CRITICAL_PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "✅ $page"
    else
        echo "❌ $page - MANQUANTE"
        CRITICAL_ERRORS=$((CRITICAL_ERRORS + 1))
    fi
done

echo ""
echo "${BLUE}📋 9. ANALYSE DES COMPOSANTS CLÉS${NC}"
echo "----------------------------------"

# Vérification des composants essentiels
KEY_COMPONENTS=(
    "src/components/HeroSearchForm/InklusifSearchForm.tsx"
    "src/components/Map/MapResults.tsx"
    "src/components/Header/"
    "src/services/activityService.ts"
)

echo "🧩 Vérification des composants clés..."
for component in "${KEY_COMPONENTS[@]}"; do
    if [ -e "$component" ]; then
        echo "✅ $component"
    else
        echo "❌ $component - MANQUANT"
        CRITICAL_ERRORS=$((CRITICAL_ERRORS + 1))
    fi
done

echo ""
echo "${BLUE}📋 10. GÉNÉRATION DU SCORE QUALITÉ${NC}"
echo "-----------------------------------"

# Calcul du score
TOTAL_ISSUES=$((CRITICAL_ERRORS * 10 + MODERATE_ISSUES * 3 + MINOR_WARNINGS))
MAX_SCORE=100
QUALITY_SCORE=$((MAX_SCORE - TOTAL_ISSUES))

if [ $QUALITY_SCORE -lt 0 ]; then
    QUALITY_SCORE=0
fi

echo ""
echo "${GREEN}🎯 RÉSULTATS FINAUX${NC}"
echo "==================="
echo ""
echo "📊 COMPTAGE DES PROBLÈMES :"
echo "   🔴 Critiques  : $CRITICAL_ERRORS"
echo "   🟠 Modérés    : $MODERATE_ISSUES"  
echo "   🟡 Mineurs    : $MINOR_WARNINGS"
echo ""
echo "🏆 SCORE QUALITÉ : $QUALITY_SCORE/100"

# Détermination du niveau
if [ $QUALITY_SCORE -ge 90 ]; then
    LEVEL="${GREEN}EXCELLENT ⭐⭐⭐⭐⭐${NC}"
elif [ $QUALITY_SCORE -ge 80 ]; then
    LEVEL="${GREEN}TRÈS BON ⭐⭐⭐⭐☆${NC}"
elif [ $QUALITY_SCORE -ge 70 ]; then
    LEVEL="${YELLOW}BON ⭐⭐⭐☆☆${NC}"
elif [ $QUALITY_SCORE -ge 60 ]; then
    LEVEL="${YELLOW}MOYEN ⭐⭐☆☆☆${NC}"
else
    LEVEL="${RED}FAIBLE ⭐☆☆☆☆${NC}"
fi

echo "📈 NIVEAU : $LEVEL"

echo ""
echo "${BLUE}📋 11. RECOMMANDATIONS PRIORITAIRES${NC}"
echo "------------------------------------"

if [ $CRITICAL_ERRORS -gt 0 ]; then
    echo "🔥 URGENT - Corriger les erreurs critiques avant production"
fi

if [ $MODERATE_ISSUES -gt 0 ]; then
    echo "⚠️  IMPORTANT - Traiter les problèmes modérés :"
    if [ $HARDCODED_COLORS -gt 0 ]; then
        echo "   • Standardiser les couleurs du design system"
    fi
    if [ $USEEFFECT_ISSUES -gt 0 ]; then
        echo "   • Corriger les dépendances useEffect"
    fi
    if [ $INCORRECT_LINKS -gt 0 ]; then
        echo "   • Remplacer <a> par <Link> Next.js"
    fi
fi

if [ $MINOR_WARNINGS -gt 30 ]; then
    echo "📝 AMÉLIORATION - Nettoyer les warnings ESLint"
fi

echo ""
echo "📅 Audit terminé : $(date)"
echo "🔧 Script version : 1.0"
echo ""

# Code de sortie basé sur les erreurs critiques
exit $CRITICAL_ERRORS
