#!/bin/bash

# 🔧 DIAGNOSTIC COMPLET PROJET CHISFIS
# ====================================
# Script de diagnostic automatisé pour vérifier l'état du projet

set -e  # Arrêter en cas d'erreur

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage
print_step() {
    echo -e "\n${BLUE}$1${NC}"
    echo "======================================"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Variables de suivi
ERRORS=0
WARNINGS=0

print_step "🔧 DIAGNOSTIC COMPLET PROJET CHISFIS"
echo "Début du diagnostic : $(date)"

# 1. Vérification de l'environnement
print_step "1️⃣ Vérification de l'environnement"

if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    print_success "Node.js détecté : $NODE_VERSION"
else
    print_error "Node.js non trouvé"
    ERRORS=$((ERRORS + 1))
fi

if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    print_success "npm détecté : $NPM_VERSION"
else
    print_error "npm non trouvé"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "package.json" ]; then
    print_success "package.json trouvé"
else
    print_error "package.json non trouvé"
    ERRORS=$((ERRORS + 1))
    exit 1
fi

# 2. Vérification des dépendances
print_step "2️⃣ Vérification des dépendances"

if [ -d "node_modules" ]; then
    print_success "node_modules présent"
else
    print_warning "node_modules absent - installation nécessaire"
    echo "Exécutez : npm install"
    WARNINGS=$((WARNINGS + 1))
fi

# 3. Build standard
print_step "3️⃣ Test du build standard"

echo "Exécution de : npm run build"
if npm run build >/dev/null 2>&1; then
    print_success "Build standard : SUCCÈS"
else
    print_error "Build standard : ÉCHEC"
    echo "Relancez avec : npm run build (pour voir les erreurs)"
    ERRORS=$((ERRORS + 1))
fi

# 4. Script de nettoyage
print_step "4️⃣ Test du script de nettoyage"

if [ -f "scripts/prebuild-cleanup.sh" ]; then
    print_success "Script de nettoyage trouvé"
    echo "Test du nettoyage..."
    if npm run cleanup >/dev/null 2>&1; then
        print_success "Script de nettoyage : SUCCÈS"
    else
        print_warning "Script de nettoyage : problème mineur"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    print_warning "Script de nettoyage non trouvé"
    WARNINGS=$((WARNINGS + 1))
fi

# 5. Build Next.js pur
print_step "5️⃣ Test du build Next.js pur"

echo "Exécution de : npx next build"
if npx next build >/dev/null 2>&1; then
    print_success "Build pur : SUCCÈS"
else
    print_error "Build pur : ÉCHEC"
    ERRORS=$((ERRORS + 1))
fi

# 6. Audit des fichiers suspects
print_step "6️⃣ Audit des fichiers suspects"

if [ -f "scripts/audit-backup-files.sh" ]; then
    print_success "Script d'audit trouvé"
    echo "Exécution de l'audit..."
    ./scripts/audit-backup-files.sh
else
    print_warning "Script d'audit non trouvé - audit manuel"
    WARNINGS=$((WARNINGS + 1))
    
    # Audit manuel basique
    echo "Recherche de fichiers suspects..."
    SUSPECTS=$(find . -name "*.bak" -o -name "*.old" -o -name "*.tmp" -o -name ".DS_Store" 2>/dev/null | head -10)
    if [ -z "$SUSPECTS" ]; then
        print_success "Aucun fichier suspect trouvé"
    else
        print_warning "Fichiers suspects détectés :"
        echo "$SUSPECTS"
        WARNINGS=$((WARNINGS + 1))
    fi
fi

# 7. Vérification de la structure du projet
print_step "7️⃣ Vérification de la structure du projet"

# Vérifier les dossiers essentiels
ESSENTIAL_DIRS=("src" "src/app" "src/components" "public")
for dir in "${ESSENTIAL_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        print_success "Dossier $dir : OK"
    else
        print_error "Dossier $dir : MANQUANT"
        ERRORS=$((ERRORS + 1))
    fi
done

# Vérifier les fichiers essentiels
ESSENTIAL_FILES=("next.config.mjs" "tsconfig.json" "package.json")
for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        print_success "Fichier $file : OK"
    else
        print_error "Fichier $file : MANQUANT"
        ERRORS=$((ERRORS + 1))
    fi
done

# 8. Vérification des pages principales
print_step "8️⃣ Vérification des pages principales"

# Pour Next.js avec routes groupées, chercher la page principale dans (app)/(home-pages)
if [ -f "src/app/(app)/(home-pages)/page.tsx" ]; then
    print_success "Page principale : OK (src/app/(app)/(home-pages)/page.tsx)"
elif [ -f "src/app/page.tsx" ]; then
    print_success "Page principale : OK (src/app/page.tsx)"
else
    print_warning "Page principale : MANQUANTE ou structure non standard"
    WARNINGS=$((WARNINGS + 1))
fi

MAIN_PAGES=("src/app/layout.tsx" "src/app/not-found.tsx")
for page in "${MAIN_PAGES[@]}"; do
    if [ -f "$page" ]; then
        print_success "Page $page : OK"
    else
        print_warning "Page $page : MANQUANTE"
        WARNINGS=$((WARNINGS + 1))
    fi
done

# 9. Recherche de doublons potentiels
print_step "9️⃣ Recherche de doublons potentiels"

echo "Recherche de fichiers avec suffixes suspects..."
DUPLICATES=$(find src/ -name "*_new*" -o -name "*_old*" -o -name "*_backup*" -o -name "*_copy*" 2>/dev/null)
if [ -z "$DUPLICATES" ]; then
    print_success "Aucun doublon détecté"
else
    print_warning "Doublons potentiels détectés :"
    echo "$DUPLICATES"
    WARNINGS=$((WARNINGS + 1))
fi

# 10. Vérification des imports cassés
print_step "🔟 Vérification des imports"

echo "Recherche d'imports avec chemins suspects..."
BROKEN_IMPORTS=$(grep -r "import.*from.*\.\./\.\./\.\./\.\." src/ 2>/dev/null || true)
if [ -z "$BROKEN_IMPORTS" ]; then
    print_success "Aucun import suspect trouvé"
else
    print_warning "Imports suspects détectés :"
    echo "$BROKEN_IMPORTS"
    WARNINGS=$((WARNINGS + 1))
fi

# 11. Vérification de la CI/CD
print_step "1️⃣1️⃣ Vérification de la CI/CD"

if [ -d ".github/workflows" ]; then
    WORKFLOW_COUNT=$(find .github/workflows -name "*.yml" -o -name "*.yaml" | wc -l)
    print_success "CI/CD configurée ($WORKFLOW_COUNT workflows)"
else
    print_warning "CI/CD non configurée"
    WARNINGS=$((WARNINGS + 1))
fi

# Résumé final
print_step "📊 RÉSUMÉ DU DIAGNOSTIC"

echo "Fin du diagnostic : $(date)"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    print_success "🎉 DIAGNOSTIC PARFAIT - Aucun problème détecté"
elif [ $ERRORS -eq 0 ]; then
    print_warning "✅ DIAGNOSTIC OK - $WARNINGS avertissement(s) mineur(s)"
else
    print_error "❌ DIAGNOSTIC PROBLÉMATIQUE - $ERRORS erreur(s) et $WARNINGS avertissement(s)"
fi

echo ""
echo "📋 RECOMMANDATIONS :"

if [ $ERRORS -gt 0 ]; then
    echo "🔧 ACTIONS PRIORITAIRES :"
    echo "  - Corriger les erreurs bloquantes avant tout commit"
    echo "  - Vérifier les logs détaillés avec : npm run build"
    echo "  - Réinstaller les dépendances si nécessaire : rm -rf node_modules && npm install"
fi

if [ $WARNINGS -gt 0 ]; then
    echo "🔍 ACTIONS RECOMMANDÉES :"
    echo "  - Nettoyer les fichiers suspects avec : npm run cleanup"
    echo "  - Exécuter l'audit complet avec : npm run audit:backup"
    echo "  - Corriger les avertissements pour optimiser la qualité"
fi

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "🚀 ACTIONS SUGGÉRÉES :"
    echo "  - Le projet est stable, vous pouvez continuer le développement"
    echo "  - Penser à pousser sur GitHub pour activer la CI/CD"
    echo "  - Exécuter ce diagnostic régulièrement"
fi

echo ""
echo "📖 Pour plus d'informations, consultez :"
echo "  - CLEANUP_DOCUMENTATION.md"
echo "  - BUILD_BEST_PRACTICES.md"
echo "  - CI_SETUP_COMPLETE.md"

echo ""
echo "🔧 Scripts utiles :"
echo "  - npm run build:clean    # Build avec nettoyage"
echo "  - npm run cleanup        # Nettoyage seul"
echo "  - npm run audit:backup   # Audit des fichiers"
echo "  - ./scripts/complete-diagnostic.sh  # Ce diagnostic"

# Code de sortie
if [ $ERRORS -gt 0 ]; then
    exit 1
else
    exit 0
fi
