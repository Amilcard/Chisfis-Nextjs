#!/bin/bash

# Script d'automatisation pour vérifier la santé du repository
# Vérifie avant chaque commit/push que le repo est sain

set -e

REPO_ROOT="/Users/laidhamoudi/Downloads/Chisfis-Nextjs"
cd "$REPO_ROOT"

echo "🔍 Vérification automatique de la santé du repository..."

# Fonction de vérification des fichiers dangereux
check_dangerous_files() {
    echo "📂 Vérification des fichiers/dossiers volumineux..."
    
    # Vérifier si des dossiers générés sont trackés (exclure les scripts)
    dangerous_files=$(git ls-files | grep -E "(^|/)node_modules/|(^|/)\.next/|(^|/)out/|(^|/)dist/|(^|/)build/")
    if [ -n "$dangerous_files" ]; then
        echo "❌ ERREUR: Des dossiers générés sont trackés par Git!"
        echo "Fichiers problématiques:"
        echo "$dangerous_files" | head -10
        echo ""
        echo "🔧 Solution: Exécutez 'git rm -r --cached <fichier>' pour chaque fichier"
        return 1
    fi
    
    echo "✅ Aucun dossier généré détecté dans Git"
}

# Fonction de vérification de la taille du repo
check_repo_size() {
    echo "📊 Vérification de la taille du repository..."
    
    repo_size=$(du -sh .git | cut -f1)
    echo "Taille actuelle du .git: $repo_size"
    
    # Vérifier les gros objets
    large_objects=$(git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | grep '^blob' | sort -k3nr | head -10)
    
    if echo "$large_objects" | awk '{if($3 > 1048576) print}' | grep -q .; then
        echo "⚠️  Objets volumineux détectés (>1MB):"
        echo "$large_objects" | awk '{if($3 > 1048576) printf "  %s: %.1f MB\n", $4, $3/1048576}'
    else
        echo "✅ Aucun objet volumineux détecté"
    fi
}

# Fonction de vérification du .gitignore
check_gitignore() {
    echo "📋 Vérification du .gitignore..."
    
    required_patterns=(
        "node_modules/"
        "**/node_modules/"
        ".next/"
        "**/.next/"
        "out/"
        "**/out/"
        "dist/"
        "**/dist/"
        "build/"
        "**/build/"
    )
    
    missing_patterns=()
    for pattern in "${required_patterns[@]}"; do
        if ! grep -q "^$pattern" .gitignore; then
            missing_patterns+=("$pattern")
        fi
    done
    
    if [ ${#missing_patterns[@]} -gt 0 ]; then
        echo "⚠️  Patterns manquants dans .gitignore:"
        printf "  %s\n" "${missing_patterns[@]}"
        return 1
    else
        echo "✅ .gitignore correctement configuré"
    fi
}

# Fonction de vérification de la structure du projet
check_project_structure() {
    echo "🏗️  Vérification de la structure du projet..."
    
    # Vérifier que frontend/ et backend/ existent
    if [ ! -d "frontend" ]; then
        echo "❌ ERREUR: Dossier frontend/ manquant!"
        return 1
    fi
    
    if [ ! -d "backend" ]; then
        echo "❌ ERREUR: Dossier backend/ manquant!"
        return 1
    fi
    
    # Vérifier la structure frontend
    if [ ! -f "frontend/package.json" ]; then
        echo "⚠️  frontend/package.json manquant"
    fi
    
    if [ ! -f "frontend/.gitignore" ]; then
        echo "⚠️  frontend/.gitignore manquant"
    fi
    
    echo "✅ Structure de projet valide"
}

# Fonction de vérification des variables d'environnement
check_env_security() {
    echo "🔐 Vérification de la sécurité des variables d'environnement..."
    
    # Vérifier qu'aucun fichier .env n'est tracké
    if git ls-files | grep -q "\.env$"; then
        echo "❌ ERREUR: Fichier .env tracké par Git!"
        echo "Fichiers .env trackés:"
        git ls-files | grep "\.env$"
        return 1
    fi
    
    # Vérifier les clés sensibles dans le code
    sensitive_patterns=("password.*=.*['\"][^'\"]+['\"]" "secret.*=.*['\"][^'\"]+['\"]" "key.*=.*['\"][^'\"]+['\"]")
    
    for pattern in "${sensitive_patterns[@]}"; do
        if git grep -i "$pattern" -- '*.js' '*.ts' '*.jsx' '*.tsx' '*.json' 2>/dev/null | grep -v "placeholder\|example\|demo"; then
            echo "⚠️  Données sensibles potentielles détectées dans le code"
        fi
    done
    
    echo "✅ Vérification de sécurité terminée"
}

# Fonction principale
main() {
    echo "===========================================" 
    echo "🚀 AUDIT AUTOMATIQUE DU REPOSITORY"
    echo "Heure: $(date)"
    echo "==========================================="
    echo ""
    
    # Exécuter toutes les vérifications
    check_dangerous_files
    echo ""
    check_repo_size
    echo ""
    check_gitignore
    echo ""
    check_project_structure
    echo ""
    check_env_security
    echo ""
    
    echo "==========================================="
    echo "✅ AUDIT TERMINÉ AVEC SUCCÈS!"
    echo "Le repository est prêt pour commit/push"
    echo "==========================================="
}

# Exécution conditionnelle
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
