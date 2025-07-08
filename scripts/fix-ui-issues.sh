#!/bin/bash

# Script de correction automatique des problèmes UI
# Version: 1.0
# Date: $(date '+%Y-%m-%d')

echo "🔧 CORRECTION AUTOMATIQUE UI - Chisfis-Nextjs"
echo "=============================================="

# Configuration
BACKUP_DIR="backups/$(date '+%Y%m%d_%H%M%S')"
DRY_RUN=false

# Parsing des arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

if [ "$DRY_RUN" = true ]; then
    echo "${YELLOW}🏃 MODE DRY-RUN ACTIVÉ - Aucune modification effectuée${NC}"
    echo ""
fi

echo "${BLUE}📋 1. CRÉATION DES BACKUPS${NC}"
echo "----------------------------"

if [ "$DRY_RUN" = false ]; then
    mkdir -p "$BACKUP_DIR"
    echo "📁 Dossier de backup : $BACKUP_DIR"
    
    # Backup des fichiers critiques
    cp -r src/ "$BACKUP_DIR/src_backup"
    echo "✅ Backup des sources créé"
else
    echo "🏃 [DRY-RUN] Création du backup dans : $BACKUP_DIR"
fi

echo ""
echo "${BLUE}📋 2. CORRECTION DES APOSTROPHES${NC}"
echo "--------------------------------"

APOSTROPHE_FILES=$(grep -r "'" src/ --include="*.tsx" --include="*.ts" -l | head -10)
APOSTROPHE_COUNT=0

for file in $APOSTROPHE_FILES; do
    if [ -f "$file" ]; then
        APOSTROPHE_COUNT=$((APOSTROPHE_COUNT + 1))
        if [ "$DRY_RUN" = false ]; then
            # Correction des apostrophes courantes dans le texte français
            sed -i.bak "s/\([[:space:]]\)'\([[:alpha:]]\)/\1\&apos;\2/g" "$file"
            sed -i.bak "s/\([[:alpha:]]\)'\([[:space:]]\)/\1\&apos;\2/g" "$file"
            echo "✅ Corrigé : $file"
        else
            echo "🏃 [DRY-RUN] Correction : $file"
        fi
    fi
done

echo "📊 Fichiers traités : $APOSTROPHE_COUNT"

echo ""
echo "${BLUE}📋 3. STANDARDISATION DES COULEURS${NC}"
echo "--------------------------------"

# Mapping des couleurs vers le design system
declare -A COLOR_MAPPING=(
    ["bg-blue-100"]="bg-primary-100"
    ["bg-blue-800"]="bg-primary-800"
    ["bg-green-100"]="bg-success-100"
    ["bg-green-800"]="bg-success-800"
    ["bg-red-100"]="bg-error-100"
    ["bg-red-800"]="bg-error-800"
    ["bg-yellow-100"]="bg-warning-100"
    ["bg-yellow-800"]="bg-warning-800"
    ["text-blue-100"]="text-primary-100"
    ["text-blue-800"]="text-primary-800"
    ["text-green-100"]="text-success-100"
    ["text-green-800"]="text-success-800"
    ["text-red-100"]="text-error-100"
    ["text-red-800"]="text-error-800"
    ["text-yellow-100"]="text-warning-100"
    ["text-yellow-800"]="text-warning-800"
)

COLOR_FILES=$(grep -r "bg-\(red\|blue\|green\|yellow\)-[0-9]" src/ --include="*.tsx" --include="*.ts" -l)
COLOR_COUNT=0

for file in $COLOR_FILES; do
    if [ -f "$file" ]; then
        COLOR_COUNT=$((COLOR_COUNT + 1))
        echo "🎨 Traitement : $file"
        
        if [ "$DRY_RUN" = false ]; then
            # Application des remplacements
            for old_color in "${!COLOR_MAPPING[@]}"; do
                new_color="${COLOR_MAPPING[$old_color]}"
                sed -i.bak "s/$old_color/$new_color/g" "$file"
            done
            echo "✅ Couleurs standardisées : $file"
        else
            echo "🏃 [DRY-RUN] Standardisation des couleurs : $file"
        fi
    fi
done

echo "📊 Fichiers traités : $COLOR_COUNT"

echo ""
echo "${BLUE}📋 4. CORRECTION DES LIENS DE NAVIGATION${NC}"
echo "-------------------------------------------"

# Recherche et correction des balises <a href= internes
LINK_FILES=$(grep -r '<a href="/' src/ --include="*.tsx" --include="*.ts" -l)
LINK_COUNT=0

for file in $LINK_FILES; do
    if [ -f "$file" ]; then
        LINK_COUNT=$((LINK_COUNT + 1))
        echo "🔗 Traitement : $file"
        
        if [ "$DRY_RUN" = false ]; then
            # Vérifier si Link est déjà importé
            if ! grep -q "import.*Link.*from.*next/link" "$file"; then
                # Ajouter l'import Link en haut du fichier
                sed -i.bak "1i\\
import Link from 'next/link'" "$file"
            fi
            
            # Remplacer <a href="/... par <Link href="/...
            sed -i.bak 's/<a href="\([^"]*\)"/<Link href="\1"/g' "$file"
            sed -i.bak 's/<\/a>/<\/Link>/g' "$file"
            echo "✅ Liens corrigés : $file"
        else
            echo "🏃 [DRY-RUN] Correction des liens : $file"
        fi
    fi
done

echo "📊 Fichiers traités : $LINK_COUNT"

echo ""
echo "${BLUE}📋 5. VÉRIFICATION POST-CORRECTION${NC}"
echo "------------------------------------"

if [ "$DRY_RUN" = false ]; then
    echo "🔍 Test de compilation..."
    if npm run build >/dev/null 2>&1; then
        echo "✅ Build réussi après corrections"
    else
        echo "❌ Échec du build - Restauration des backups recommandée"
        echo "📁 Backups disponibles dans : $BACKUP_DIR"
    fi
    
    echo ""
    echo "🔍 Vérification ESLint..."
    LINT_WARNINGS_AFTER=$(npm run lint 2>&1 | grep -c "Warning:" || echo "0")
    echo "⚠️  Warnings ESLint restants : $LINT_WARNINGS_AFTER"
    
else
    echo "🏃 [DRY-RUN] Tests de compilation et ESLint non effectués"
fi

echo ""
echo "${BLUE}📋 6. NETTOYAGE DES FICHIERS TEMPORAIRES${NC}"
echo "-------------------------------------------"

if [ "$DRY_RUN" = false ]; then
    # Suppression des fichiers .bak créés par sed
    find src/ -name "*.bak" -delete
    echo "🗑️  Fichiers temporaires supprimés"
else
    echo "🏃 [DRY-RUN] Nettoyage des fichiers temporaires"
fi

echo ""
echo "${GREEN}🎯 RÉSUMÉ DES CORRECTIONS${NC}"
echo "============================"
echo ""
echo "📊 STATISTIQUES :"
echo "   📝 Fichiers avec apostrophes  : $APOSTROPHE_COUNT"
echo "   🎨 Fichiers avec couleurs     : $COLOR_COUNT"
echo "   🔗 Fichiers avec liens        : $LINK_COUNT"
echo ""

if [ "$DRY_RUN" = false ]; then
    echo "✅ CORRECTIONS APPLIQUÉES"
    echo "📁 Backups sauvegardés : $BACKUP_DIR"
    echo ""
    echo "${YELLOW}⚠️  ACTIONS RECOMMANDÉES :${NC}"
    echo "1. Tester manuellement les pages critiques"
    echo "2. Vérifier le mode sombre/clair"
    echo "3. Valider la navigation"
    echo "4. Lancer : ./scripts/audit-ui.sh"
else
    echo "🏃 MODE DRY-RUN - Aucune modification effectuée"
    echo ""
    echo "${GREEN}👉 Pour appliquer les corrections :${NC}"
    echo "   ./scripts/fix-ui-issues.sh"
fi

echo ""
echo "📅 Correction terminée : $(date)"
echo "🔧 Script version : 1.0"
