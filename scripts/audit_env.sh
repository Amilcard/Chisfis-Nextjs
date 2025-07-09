#!/bin/bash

echo "🔒 AUDIT DES VARIABLES D'ENVIRONNEMENT"
echo "====================================="
echo ""

ENV_FILE="./backend/.env"

# Liste des variables critiques à vérifier (ajuste selon ton projet !)
CRITICAL_VARS=(
  "JWT_SECRET"
  "DB_PASSWORD"
  "DB_USER"
  "DB_NAME"
  "DB_HOST"
  "SMTP_HOST"
  "SMTP_USER"
  "SMTP_PASS"
  "CORS_ORIGIN"
)

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Vérifie la présence du fichier .env
if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}❌ Fichier .env manquant dans le backend !${NC}"
  echo -e "${BLUE}💡 Créez un fichier .env à la racine du backend avec le contenu suivant :${NC}"
  cat <<EOF
JWT_SECRET=modifie_toi_meme_une_valeur_infaillible
DB_PASSWORD=remplis_moi
DB_USER=postgres
DB_NAME=chisfis_db
DB_HOST=localhost
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
CORS_ORIGIN=http://localhost:3000
EOF
  exit 1
fi

echo -e "${BLUE}📁 Analyse du fichier: $ENV_FILE${NC}"
echo ""

# Vérifie chaque variable critique
critical_issues=0
warnings=0
secure_vars=0

for var in "${CRITICAL_VARS[@]}"
do
  val=$(grep "^$var=" "$ENV_FILE" | cut -d'=' -f2-)
  if [ -z "$val" ]; then
    echo -e "${RED}❌ $var manquante dans .env${NC}"
    ((critical_issues++))
  elif [[ "$val" == "" || "$val" == "default_secret" || "$val" == "chisfis_super_secret_jwt_key_development_only_2025" || "$val" == "secret" ]]; then
    echo -e "${YELLOW}⚠️  $var a une valeur DANGEREUSE ou vide: $val${NC}"
    ((warnings++))
  elif [[ "$var" == "JWT_SECRET" && ${#val} -lt 32 ]]; then
    echo -e "${YELLOW}⚠️  $var trop courte (${#val} caractères, minimum recommandé: 32)${NC}"
    ((warnings++))
  else
    echo -e "${GREEN}✅ $var sécurisée${NC}"
    ((secure_vars++))
  fi
done

echo ""
echo -e "${BLUE}📊 RÉSUMÉ DE L'AUDIT:${NC}"
echo "   • Variables sécurisées: $secure_vars/${#CRITICAL_VARS[@]}"
echo "   • Avertissements: $warnings"
echo "   • Problèmes critiques: $critical_issues"

if [ $critical_issues -gt 0 ] || [ $warnings -gt 0 ]; then
  echo ""
  echo -e "${RED}🚨 ACTION REQUISE !${NC}"
  echo -e "${BLUE}📋 Corrigez les valeurs dangereuses ci-dessus dans le fichier $ENV_FILE${NC}"
  echo ""
  echo -e "${YELLOW}🔑 CONSEILS DE SÉCURITÉ:${NC}"
  echo "• Choisissez un JWT_SECRET long, unique et secret (ex : généré avec openssl rand -hex 64)"
  echo "• Ne laissez jamais DB_PASSWORD ou SMTP_PASS vide"
  echo "• Ne logguez jamais ces variables dans votre code (enlevez tous les console.log/process.env dans app.js)"
  echo "• Restreignez CORS_ORIGIN à l'URL de votre frontend seulement"
  echo ""
  echo -e "${BLUE}💡 GÉNÉRATION D'UN JWT_SECRET SÉCURISÉ:${NC}"
  echo "   openssl rand -hex 64"
  echo ""
  echo -e "${BLUE}💡 EXEMPLE DE .env SÉCURISÉ:${NC}"
  cat <<EOF
JWT_SECRET=$(openssl rand -hex 64 2>/dev/null || echo "GENERE_TOI_MEME_UNE_CLE_DE_64_CARACTERES_MINIMUM")
DB_PASSWORD=mot_de_passe_fort_unique
DB_USER=postgres
DB_NAME=chisfis_db
DB_HOST=localhost
SMTP_HOST=smtp.example.com
SMTP_USER=noreply@chisfis.com
SMTP_PASS=mot_de_passe_smtp_fort
CORS_ORIGIN=http://localhost:3000
EOF
else
  echo ""
  echo -e "${GREEN}🎉 CONFIGURATION SÉCURISÉE !${NC}"
  echo -e "${GREEN}✅ Toutes les variables d'environnement sont correctement configurées.${NC}"
fi

echo ""
echo -e "${BLUE}🔍 VÉRIFICATIONS ADDITIONNELLES:${NC}"

# Vérifier si des variables sont loggées dans le code
echo "• Recherche de logs dangereux dans le code..."
dangerous_logs=$(grep -r "process.env" ./backend/src/ 2>/dev/null | grep -v "NODE_ENV" | wc -l)
if [ $dangerous_logs -gt 0 ]; then
  echo -e "${YELLOW}⚠️  $dangerous_logs références à process.env trouvées dans le code${NC}"
  echo "  Vérifiez qu'aucune variable sensible n'est loggée"
else
  echo -e "${GREEN}✅ Aucun log dangereux détecté${NC}"
fi

# Vérifier les permissions du fichier .env
env_permissions=$(stat -c "%a" "$ENV_FILE" 2>/dev/null || stat -f "%A" "$ENV_FILE" 2>/dev/null)
if [[ "$env_permissions" == "600" || "$env_permissions" == "0600" ]]; then
  echo -e "${GREEN}✅ Permissions du fichier .env sécurisées ($env_permissions)${NC}"
else
  echo -e "${YELLOW}⚠️  Permissions du fichier .env à restreindre (actuellement: $env_permissions)${NC}"
  echo "  Exécutez: chmod 600 $ENV_FILE"
fi

echo ""
echo -e "${BLUE}📝 PROCHAINES ÉTAPES:${NC}"
echo "1. Corrigez toutes les variables marquées en ❌ ou ⚠️"
echo "2. Vérifiez que .env est dans .gitignore"
echo "3. Ne partagez jamais le contenu de .env"
echo "4. Renouvelez JWT_SECRET en production"
echo "5. Utilisez des outils comme Docker secrets ou vault en production"
