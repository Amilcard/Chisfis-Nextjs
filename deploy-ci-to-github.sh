#!/bin/bash

# 🚀 Script de déploiement CI/CD vers GitHub
# Usage: ./deploy-ci-to-github.sh

echo "🚀 DÉPLOIEMENT CI/CD VERS GITHUB"
echo "================================="

# Vérification de l'état du projet
echo "🔍 Vérification de l'état du projet..."

# Test final du build
echo "🏗️ Test final du build..."
if npm run build:clean > /dev/null 2>&1; then
    echo "✅ Build réussi"
else
    echo "❌ Build échoué - Corrigez les erreurs avant de continuer"
    echo "💡 Lancez: npm run build:clean"
    exit 1
fi

# Audit final
echo "🔍 Audit final..."
if npm run audit:backup > /dev/null 2>&1; then
    echo "✅ Projet propre"
else
    echo "⚠️ Quelques warnings détectés (non bloquants)"
fi

# Vérification Git
echo "📋 Vérification Git..."
if ! git status > /dev/null 2>&1; then
    echo "❌ Pas de repository Git détecté"
    echo "💡 Initialisez d'abord: git init"
    exit 1
fi

# Ajout des fichiers
echo "📁 Ajout des fichiers CI/CD..."
git add .github/
git add scripts/
git add .gitignore
git add .vercelignore
git add .dockerignore
git add package.json
git add *_COMPLETE.md
git add BUILD_BEST_PRACTICES.md
git add CLEANUP_DOCUMENTATION.md

# Vérification des changements
CHANGES=$(git diff --cached --name-only | wc -l)
if [ "$CHANGES" -eq 0 ]; then
    echo "⚠️ Aucun changement détecté à committer"
    echo "💡 Tous les fichiers sont déjà synchronisés"
else
    echo "📊 $CHANGES fichiers à committer:"
    git diff --cached --name-only | sed 's/^/  - /'
fi

# Commit
echo ""
echo "💾 Création du commit..."
COMMIT_MSG="🚀 Add GitHub Actions CI/CD + Project Cleanup

✅ Features added:
- GitHub Actions workflows (ci.yml, pr-check.yml, daily-health.yml)
- Automated build process with cleanup
- Backup files detection and removal
- ESLint validation on every build
- Daily project health monitoring
- Security audit automation

🧹 Project cleanup:
- Removed duplicate components and pages
- Fixed &apos; encoding issues
- Cleaned backup files and system files
- Updated .gitignore, .vercelignore, .dockerignore

🛡️ Protection added:
- No broken builds can reach production
- Automatic cleanup before each build
- Email alerts on build failures
- Continuous quality monitoring

🚀 Status: Production Ready with CI/CD"

git commit -m "$COMMIT_MSG"

if [ $? -eq 0 ]; then
    echo "✅ Commit créé avec succès"
else
    echo "❌ Erreur lors du commit"
    exit 1
fi

# Push
echo ""
echo "🌐 Push vers GitHub..."
echo "💡 Assurez-vous d'avoir configuré votre remote GitHub"

# Détection de la branche actuelle
BRANCH=$(git branch --show-current)
echo "📍 Branche actuelle: $BRANCH"

echo ""
echo "🚀 Prêt à pusher. Choisissez votre action:"
echo "1) Push maintenant"
echo "2) Voir les changements d'abord"
echo "3) Annuler"

read -p "Votre choix (1-3): " choice

case $choice in
    1)
        echo "🚀 Push en cours..."
        git push origin $BRANCH
        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 SUCCÈS ! CI/CD déployée sur GitHub"
            echo ""
            echo "🔗 Prochaines étapes:"
            echo "1. Allez sur GitHub.com → Votre repo → Actions"
            echo "2. Vous devriez voir le workflow '🚀 Next.js CI' se lancer"
            echo "3. Premier build attendu: ✅ SUCCESS"
            echo ""
            echo "📧 Vous recevrez un email si un build échoue"
            echo "📊 Health check quotidien à 9h UTC"
            echo ""
            echo "✅ Votre projet est maintenant PRODUCTION READY avec CI/CD !"
        else
            echo "❌ Erreur lors du push"
            echo "💡 Vérifiez votre remote: git remote -v"
        fi
        ;;
    2)
        echo "📋 Changements à pusher:"
        git show --stat
        echo ""
        echo "💡 Relancez le script pour pusher"
        ;;
    3)
        echo "❌ Annulé. Changements committés mais pas pushés"
        echo "💡 Lancez 'git push origin $BRANCH' quand vous êtes prêt"
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac
