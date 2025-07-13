#!/usr/bin/env bash
set -euo pipefail

echo "🚀 1) Copie de SwitchDarkMode2 dans src/shared"
mkdir -p src/shared

# ATTENTION aux guillemets autour du chemin source
cp "/Users/laidhamoudi/Downloads/placewise 2/placewise/src/shared/SwitchDarkMode2.tsx" \
   src/shared/SwitchDarkMode2.tsx

echo "🚀 2) Mise à jour des imports dans src/app"
grep -Rl "frontend/src/shared/SwitchDarkMode2" src/app | \
  xargs sed -i '' -E \
    "s@from 'frontend/src/shared/SwitchDarkMode2'@from '@/shared/SwitchDarkMode2'@g; \
     s@from \"frontend/src/shared/SwitchDarkMode2\"@from \"@/shared/SwitchDarkMode2\"@g"

echo "🚀 3) Lancement du serveur de développement"
npm run dev --prefix frontend
