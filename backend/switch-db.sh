#!/bin/bash

# Usage : ./switch-db.sh simple  (pour mode simple/mock)
#       : ./switch-db.sh postgres  (pour mode Postgres/production)

set -e

CONFIG_DIR="src/config"

if [ "$1" == "simple" ]; then
  echo "🔄 Basculer la config vers le mode SIMPLE (démo, local, mock)..."
  
  # Vérifier si le fichier db.simple.js existe
  if [ -f "$CONFIG_DIR/db.simple.js" ]; then
    mv "$CONFIG_DIR/db.js" "$CONFIG_DIR/db.postgres.js"
    mv "$CONFIG_DIR/db.simple.js" "$CONFIG_DIR/db.js"
    echo "✅ Config DB : SIMPLE activée."
  else
    echo "ℹ️  Le fichier db.simple.js n'existe pas. La config actuelle est probablement déjà en mode SIMPLE."
    echo "📄 Contenu actuel de db.js:"
    head -5 "$CONFIG_DIR/db.js"
  fi
  
elif [ "$1" == "postgres" ]; then
  echo "🔄 Basculer la config vers le mode POSTGRES (production)..."
  
  # Vérifier si le fichier db.postgres.js existe
  if [ -f "$CONFIG_DIR/db.postgres.js" ]; then
    mv "$CONFIG_DIR/db.js" "$CONFIG_DIR/db.simple.js"
    mv "$CONFIG_DIR/db.postgres.js" "$CONFIG_DIR/db.js"
    echo "✅ Config DB : POSTGRES activée."
  else
    echo "❌ Le fichier db.postgres.js n'existe pas. Impossible de basculer."
    exit 1
  fi
  
elif [ "$1" == "status" ]; then
  echo "📊 STATUT ACTUEL DE LA CONFIGURATION DB:"
  echo "🔍 Fichiers présents dans $CONFIG_DIR:"
  ls -la "$CONFIG_DIR"/db*.js
  echo ""
  echo "📄 Début du fichier db.js actuel:"
  head -10 "$CONFIG_DIR/db.js"
  
else
  echo "Usage : $0 [simple|postgres|status]"
  echo ""
  echo "  simple    - Basculer vers le mode stockage en mémoire (développement)"
  echo "  postgres  - Basculer vers le mode PostgreSQL (production)"
  echo "  status    - Afficher le statut actuel de la configuration"
  echo ""
  exit 1
fi

echo ""
echo "🔄 Redémarrage recommandé du serveur backend pour appliquer les changements."
