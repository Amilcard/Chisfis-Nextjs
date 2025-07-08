#!/bin/bash

# 🧹 Script de nettoyage des backups avant build/déploiement
# Usage: ./scripts/prebuild-cleanup.sh

echo "🧹 Nettoyage des dossiers backup et fichiers temporaires..."

# Suppression des dossiers backup (si ils existent)
echo "📁 Suppression des dossiers backup..."
rm -rf src/backups src/backup backups backup temp tmp
rm -rf src/temp src/tmp src/old src/*_backup src/*_old

# Suppression des fichiers backup individuels
echo "📄 Suppression des fichiers backup..."
find . -name "*.bak" -type f -delete 2>/dev/null || true
find . -name "*.tmp" -type f -delete 2>/dev/null || true
find . -name "*.old" -type f -delete 2>/dev/null || true
find . -name "*_backup.*" -type f -delete 2>/dev/null || true
find . -name "*_old.*" -type f -delete 2>/dev/null || true

# Suppression des fichiers système indésirables
echo "🗑️ Suppression des fichiers système..."
find . -name ".DS_Store" -type f -delete 2>/dev/null || true
find . -name "Thumbs.db" -type f -delete 2>/dev/null || true

echo "✅ Nettoyage terminé!"

# Audit final pour vérifier
echo "🔍 Audit final..."
BACKUP_DIRS=$(find src/ public/ -type d \( -iname '*backup*' -o -iname '*old*' -o -iname '*temp*' -o -iname '*tmp*' \) 2>/dev/null | wc -l)
BACKUP_FILES=$(find src/ public/ -type f \( -iname '*.bak' -o -iname '*.tmp' -o -iname '*.old' \) 2>/dev/null | wc -l)

if [ "$BACKUP_DIRS" -eq 0 ] && [ "$BACKUP_FILES" -eq 0 ]; then
    echo "✅ Projet propre : 0 dossier backup, 0 fichier backup"
else
    echo "⚠️ Attention : $BACKUP_DIRS dossiers et $BACKUP_FILES fichiers backup restants"
    echo "📋 Liste des fichiers restants :"
    find src/ public/ -type d \( -iname '*backup*' -o -iname '*old*' -o -iname '*temp*' -o -iname '*tmp*' \) 2>/dev/null
    find src/ public/ -type f \( -iname '*.bak' -o -iname '*.tmp' -o -iname '*.old' \) 2>/dev/null
fi

echo "🚀 Prêt pour le build!"
