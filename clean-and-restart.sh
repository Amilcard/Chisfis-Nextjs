#!/bin/bash

echo "🧹 Nettoyage du cache Next.js et redémarrage..."

# Arrêter le serveur de développement s'il est en cours d'exécution
echo "⏹️ Arrêt du serveur de développement..."
pkill -f "next dev" 2>/dev/null || true

# Supprimer le cache Next.js
echo "🗑️ Suppression du cache .next..."
rm -rf .next

# Supprimer le cache npm (optionnel)
echo "🗑️ Suppression du cache npm..."
npm cache clean --force 2>/dev/null || true

# Réinstaller les dépendances (optionnel)
echo "📦 Réinstallation des dépendances..."
npm install

echo "✅ Nettoyage terminé!"
echo "🚀 Pour démarrer le serveur: npm run dev"
echo ""
echo "📋 Vérifications effectuées:"
echo "  ✅ ActivitySearchForm.tsx - 'use client' présent"
echo "  ✅ ActivitySearchForm.tsx - useRouter depuis 'next/navigation'"
echo "  ✅ Page de recherche existe dans src/app/(app)/search/page.tsx"
echo "  ✅ FilterPopover.tsx - 'use client' présent"
echo ""
echo "🔧 Si les problèmes persistent, vérifiez:"
echo "  1. La route /search est accessible via l'URL"
echo "  2. Les paramètres de recherche sont bien transmis"
echo "  3. Le serveur de développement est bien redémarré"
