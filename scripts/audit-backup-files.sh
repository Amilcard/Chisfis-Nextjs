#!/bin/bash

# 🔍 Script d'audit pour détecter les fichiers suspects
# Usage: ./scripts/audit-backup-files.sh

echo "🔍 AUDIT - Détection de fichiers backup et temporaires"
echo "=================================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Audit des dossiers suspects
echo "📁 Recherche de dossiers backup/temp dans src/ et public/..."
BACKUP_DIRS=$(find src/ public/ -type d \( -iname '*backup*' -o -iname '*old*' -o -iname '*temp*' -o -iname '*tmp*' \) 2>/dev/null)

if [ -z "$BACKUP_DIRS" ]; then
    echo -e "${GREEN}✅ Aucun dossier suspect trouvé${NC}"
else
    echo -e "${RED}⚠️ Dossiers suspects détectés :${NC}"
    echo "$BACKUP_DIRS"
fi

# Audit des fichiers suspects
echo ""
echo "📄 Recherche de fichiers backup dans src/ et public/..."
BACKUP_FILES=$(find src/ public/ -type f \( -iname '*.bak' -o -iname '*.tmp' -o -iname '*.old' -o -iname '*_backup.*' -o -iname '*_old.*' \) 2>/dev/null)

if [ -z "$BACKUP_FILES" ]; then
    echo -e "${GREEN}✅ Aucun fichier backup trouvé${NC}"
else
    echo -e "${RED}⚠️ Fichiers backup détectés :${NC}"
    echo "$BACKUP_FILES"
fi

# Audit des fichiers système indésirables
echo ""
echo "🗑️ Recherche de fichiers système indésirables..."
SYSTEM_FILES=$(find . -name ".DS_Store" -o -name "Thumbs.db" -o -name "desktop.ini" 2>/dev/null)

if [ -z "$SYSTEM_FILES" ]; then
    echo -e "${GREEN}✅ Aucun fichier système indésirable${NC}"
else
    echo -e "${YELLOW}⚠️ Fichiers système détectés :${NC}"
    echo "$SYSTEM_FILES"
fi

# Calcul de la taille des fichiers suspects
echo ""
echo "📊 Analyse de la taille..."
TOTAL_SIZE=0

if [ -n "$BACKUP_DIRS" ]; then
    DIR_SIZE=$(du -sh $BACKUP_DIRS 2>/dev/null | awk '{print $1}' | head -1)
    echo "📁 Taille des dossiers suspects : ${DIR_SIZE:-0}"
fi

if [ -n "$BACKUP_FILES" ]; then
    FILE_SIZE=$(du -sh $BACKUP_FILES 2>/dev/null | awk '{total += $1} END {print total "K"}')
    echo "📄 Taille des fichiers backup : ${FILE_SIZE:-0}"
fi

# Résumé final
echo ""
echo "📋 RÉSUMÉ DE L'AUDIT"
echo "==================="

DIR_COUNT=$(echo "$BACKUP_DIRS" | grep -v '^$' | wc -l 2>/dev/null || echo 0)
FILE_COUNT=$(echo "$BACKUP_FILES" | grep -v '^$' | wc -l 2>/dev/null || echo 0)
SYS_COUNT=$(echo "$SYSTEM_FILES" | grep -v '^$' | wc -l 2>/dev/null || echo 0)

echo "📁 Dossiers suspects : $DIR_COUNT"
echo "📄 Fichiers backup : $FILE_COUNT"  
echo "🗑️ Fichiers système : $SYS_COUNT"

if [ "$DIR_COUNT" -eq 0 ] && [ "$FILE_COUNT" -eq 0 ] && [ "$SYS_COUNT" -eq 0 ]; then
    echo -e "${GREEN}🎉 PROJET PROPRE - Prêt pour le build !${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️ NETTOYAGE RECOMMANDÉ${NC}"
    echo "💡 Lancez: ./scripts/prebuild-cleanup.sh"
    exit 1
fi
