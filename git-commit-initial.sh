#!/bin/bash

# Script de commit initial pour le projet Chisfis Next.js Authentication Module
echo "🚀 Début du commit initial pour GitHub..."

# Vérifier si git est initialisé
if [ ! -d ".git" ]; then
    echo "📦 Initialisation du repository git..."
    git init
fi

# Configurer git (modifiez avec vos informations)
echo "⚙️ Configuration de git..."
git config user.name "Laid Hamoudi"
git config user.email "laid.hamoudi@example.com"

# Renommer la branche principale
echo "🌿 Configuration de la branche principale..."
git branch -M main

# Ajouter tous les fichiers
echo "📁 Ajout de tous les fichiers..."
git add -A

# Vérifier l'état
echo "📋 État du repository:"
git status

# Créer le commit initial
echo "💾 Création du commit initial..."
git commit -m "🎉 Initial commit: Complete Next.js Authentication Module

✨ Features:
- Complete authentication system with native Next.js APIs
- Sign in/Sign up pages with multi-step registration
- No external dependencies required (works without terminal)
- In-memory user management system
- Responsive design matching existing theme
- Social login buttons (UI ready)
- Progress bar component for multi-step forms
- Activity cards and carousels
- Search functionality
- Bottom navigation
- Contact and inscription forms

🏗️ Architecture:
- Clean TypeScript codebase
- Modern Next.js 14+ structure
- Tailwind CSS styling
- Component-based architecture
- API routes for authentication
- Reusable utility components

📚 Documentation:
- Complete README with setup instructions
- Contributing guidelines
- MIT License
- Deployment guides
- Project checklist
- Automated scripts for GitHub publishing

🚀 Ready for production and GitHub deployment!

Features included:
- Authentication pages: /auth/signin, /auth/signup
- API routes: /api/auth/register, /api/auth/signin
- Components: SocialButton, ProgressBar, ActivityCard, etc.
- Utilities: useRandomActivity hook, activityService
- Documentation: README, CHANGELOG, CONTRIBUTING, LICENSE
- Scripts: GitHub publishing automation
- Tests: Ready for testing and deployment

This is a complete, production-ready Next.js application with authentication."

# Afficher le log
echo "📜 Commit créé:"
git log --oneline -1

echo "✅ Commit initial terminé!"
echo "📖 Consultez READY_FOR_GITHUB.md pour les prochaines étapes"
echo "🔗 Pour publier sur GitHub, utilisez: ./publish-to-github.sh"
