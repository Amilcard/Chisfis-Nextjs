#!/usr/bin/env bash
set -e

# 1. Crée le dossier scripts et le fichier stub s’ils n’existent pas
if [ ! -f scripts/prebuild-cleanup.sh ]; then
  echo "🧑‍🏭 Création du stub prebuild-cleanup.sh…"
  mkdir -p scripts
  cat > scripts/prebuild-cleanup.sh << 'SCRIPT'
#!/usr/bin/env bash
echo "🧹 Nettoyage pre-build (stub)…"
# rm -rf .next build dist   # décommente si tu veux nettoyer ces dossiers
SCRIPT
  chmod +x scripts/prebuild-cleanup.sh
fi

# 2. Lancer la build complète
npm run build
