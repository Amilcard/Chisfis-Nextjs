#!/bin/bash

set -e
echo "==== [CHISFIS AUDIT & SETUP GLOBAL] ===="

## 1. README.md (crée si absent)
if [ ! -f README.md ]; then
  echo "📄 Création de README.md à la racine..."
  cat > README.md << 'EOF'
# 🚀 Chisfis-Nextjs – Architecture et Guide de Démarrage

## Structure
- backend/ (Express.js API)
- frontend/ (Next.js App)
- scripts/ (Outils, audits, CI)
EOF
else
  echo "✅ README.md déjà présent."
fi

## 2. .gitignore backend/frontend (base pro)
if [ ! -s backend/.gitignore ]; then
  echo "node_modules\n.env\n.DS_Store\n" > backend/.gitignore
  echo "✅ .gitignore backend créé."
else
  echo "✅ .gitignore backend déjà présent."
fi

if [ ! -s frontend/.gitignore ]; then
  echo "node_modules\n.next\ndist\n.env\n.DS_Store\n" > frontend/.gitignore
  echo "✅ .gitignore frontend créé."
else
  echo "✅ .gitignore frontend déjà présent."
fi

## 3. package.json racine (scripts de start monorepo)
if [ ! -f package.json ]; then
  cat > package.json << 'EOF'
{
  "name": "chisfis-monorepo",
  "private": true,
  "scripts": {
    "start": "echo 'Lance chaque service manuellement'",
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\""
  },
  "devDependencies": {
    "concurrently": "^8.0.1"
  }
}
EOF
  npm install
  echo "✅ package.json racine ajouté."
else
  echo "✅ package.json racine déjà présent."
fi

## 4. CI/CD - GitHub Actions
mkdir -p .github/workflows
CIFILE=".github/workflows/ci.yml"
if [ ! -f $CIFILE ]; then
  cat > $CIFILE << 'EOF'
name: CI Build & Test
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - name: Install backend deps
        working-directory: backend
        run: npm install
      - name: Install frontend deps
        working-directory: frontend
        run: npm install
      - name: Build frontend
        working-directory: frontend
        run: npm run build
EOF
  echo "✅ CI GitHub Actions ajouté."
else
  echo "✅ CI/CD déjà en place."
fi

## 5. Rappels sécurité
echo "------------------------------------------------"
echo "🛡️  Pense à vérifier que tes .env (et variables secrètes) ne sont JAMAIS commitées."
echo "🛡️  Lance régulièrement : ./scripts/auto_check_repo_health.sh"
echo "------------------------------------------------"
echo "🎉 SETUP GLOBAL TERMINÉ. Tout est prêt pour le dev et la CI/CD."
