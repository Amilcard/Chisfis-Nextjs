#!/bin/bash

echo "🔒 AUDIT EXPERT DES VARIABLES D'ENVIRONNEMENT - CHISFIS"
echo "====================================================="
echo ""

ENV_FILE="./backend/.env"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Vérifier la présence du fichier .env
if [ ! -f "$ENV_FILE" ]; then
  echo -e "${RED}❌ Fichier .env manquant dans le backend !${NC}"
  exit 1
fi

echo -e "${BLUE}🔍 ANALYSE COMPLÈTE DE: $ENV_FILE${NC}"
echo ""

# Fonction pour analyser une variable
analyze_var() {
    local var_name=$1
    local var_value=$(grep "^$var_name=" "$ENV_FILE" | cut -d'=' -f2-)
    
    case $var_name in
        "JWT_SECRET")
            if [ -z "$var_value" ]; then
                echo -e "${RED}❌ $var_name: MANQUANTE${NC}"
                return 1
            elif [ ${#var_value} -lt 32 ]; then
                echo -e "${YELLOW}⚠️  $var_name: TROP COURTE (${#var_value} caractères)${NC}"
                return 2
            elif [[ "$var_value" =~ ^[a-fA-F0-9]{64}$ ]]; then
                echo -e "${GREEN}✅ $var_name: PARFAIT (hex 64 caractères)${NC}"
                return 0
            else
                echo -e "${GREEN}✅ $var_name: SÉCURISÉ (${#var_value} caractères)${NC}"
                return 0
            fi
            ;;
        "DB_PASSWORD")
            if [ -z "$var_value" ]; then
                echo -e "${RED}❌ $var_name: MANQUANTE${NC}"
                return 1
            elif [[ "$var_value" == "postgres" || "$var_value" == "password" || "$var_value" == "123456" ]]; then
                echo -e "${YELLOW}⚠️  $var_name: VALEUR PAR DÉFAUT DANGEREUSE${NC}"
                return 2
            else
                echo -e "${GREEN}✅ $var_name: CONFIGURÉE${NC}"
                return 0
            fi
            ;;
        "SMTP_HOST"|"SMTP_USER"|"SMTP_PASS")
            if [ -z "$var_value" ]; then
                echo -e "${YELLOW}⚠️  $var_name: NON CONFIGURÉE (email désactivé)${NC}"
                return 2
            elif [[ "$var_name" == "SMTP_PASS" && "$var_value" == "configure_your_smtp_password" ]]; then
                echo -e "${YELLOW}⚠️  $var_name: PLACEHOLDER - À REMPLACER${NC}"
                return 2
            else
                echo -e "${GREEN}✅ $var_name: CONFIGURÉE${NC}"
                return 0
            fi
            ;;
        *)
            if [ -z "$var_value" ]; then
                echo -e "${RED}❌ $var_name: MANQUANTE${NC}"
                return 1
            else
                echo -e "${GREEN}✅ $var_name: OK${NC}"
                return 0
            fi
            ;;
    esac
}

# Variables critiques à analyser
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

# Compteurs
critical_issues=0
warnings=0
secure_vars=0

echo -e "${PURPLE}🔍 ANALYSE VARIABLE PAR VARIABLE:${NC}"
echo ""

for var in "${CRITICAL_VARS[@]}"; do
    analyze_var "$var"
    case $? in
        0) ((secure_vars++)) ;;
        1) ((critical_issues++)) ;;
        2) ((warnings++)) ;;
    esac
done

echo ""
echo -e "${BLUE}📊 RÉSUMÉ DE L'AUDIT:${NC}"
echo "   • Variables sécurisées: $secure_vars/${#CRITICAL_VARS[@]}"
echo "   • Avertissements: $warnings"
echo "   • Problèmes critiques: $critical_issues"

# Vérifications additionnelles
echo ""
echo -e "${PURPLE}🔍 VÉRIFICATIONS ADDITIONNELLES:${NC}"

# Permissions du fichier
perms=$(stat -f "%A" "$ENV_FILE" 2>/dev/null || stat -c "%a" "$ENV_FILE" 2>/dev/null)
if [[ "$perms" == "600" ]]; then
    echo -e "${GREEN}✅ Permissions sécurisées ($perms)${NC}"
else
    echo -e "${YELLOW}⚠️  Permissions à restreindre (actuellement: $perms)${NC}"
    echo "   Commande: chmod 600 $ENV_FILE"
fi

# Vérifier .gitignore
if [ -f ".gitignore" ] && grep -q "\.env" .gitignore; then
    echo -e "${GREEN}✅ .env protégé dans .gitignore${NC}"
else
    echo -e "${YELLOW}⚠️  Ajoutez '.env' dans .gitignore${NC}"
fi

# Logs dangereux
if [ -d "./backend/src" ]; then
    dangerous_logs=$(grep -r "console\.log.*process\.env" ./backend/src/ 2>/dev/null | wc -l | tr -d ' ')
    if [ "$dangerous_logs" -eq 0 ]; then
        echo -e "${GREEN}✅ Aucun log dangereux détecté${NC}"
    else
        echo -e "${YELLOW}⚠️  $dangerous_logs logs de process.env trouvés${NC}"
    fi
fi

# Recommandations finales
echo ""
if [ $critical_issues -eq 0 ] && [ $warnings -le 2 ]; then
    echo -e "${GREEN}🎉 CONFIGURATION SÉCURISÉE !${NC}"
    echo -e "${GREEN}✅ Votre backend est prêt pour le développement${NC}"
    
    if [ $warnings -gt 0 ]; then
        echo ""
        echo -e "${BLUE}💡 AMÉLIORATIONS OPTIONNELLES:${NC}"
        echo "• Finalisez la configuration SMTP si vous voulez envoyer des emails"
        echo "• Testez la connexion à votre base de données"
    fi
else
    echo -e "${RED}🚨 ACTIONS REQUISES !${NC}"
    echo ""
    echo -e "${BLUE}📋 PRIORITÉS:${NC}"
    [ $critical_issues -gt 0 ] && echo "1. Corrigez les variables manquantes (❌)"
    [ $warnings -gt 0 ] && echo "2. Sécurisez les variables avec avertissements (⚠️)"
    echo "3. Appliquez les vérifications additionnelles"
fi

echo ""
echo -e "${BLUE}🔗 OUTILS UTILES:${NC}"
echo "• Générer JWT_SECRET: openssl rand -hex 64"
echo "• Tester la config: node backend/test-jwt.js"
echo "• Voir le fichier: cat $ENV_FILE"
