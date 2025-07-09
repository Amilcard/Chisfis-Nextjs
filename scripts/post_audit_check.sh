#!/bin/bash

echo ""
echo "==== [CHISFIS POST-AUDIT AUTOMATION] ===="
echo "📍 Dossier courant : $(pwd)"
set -e  # Arrête le script en cas d'erreur (sécurité)

#### 2. Vérif des package.json FRONT/BACK ####
echo "------------------------------------------------"
echo "==> Vérification des fichiers package.json"
for pkg in backend/package.json frontend/package.json; do
  if [ ! -f "$pkg" ]; then
    echo "❌ Manquant : $pkg"
    echo "➡️  ⚠️ À faire dans VSCode : Crée ce fichier via l'UI ou `npm init -y` dans le dossier concerné."
    exit 1
  else
    echo "✅ $pkg OK"
  fi
done

#### 3. Vérif .env backend (existe, pas vide inutilement) ####
echo "------------------------------------------------"
echo "==> Vérification backend/.env"
if [ ! -f backend/.env ]; then
  echo "❌ backend/.env absent !"
  echo "➡️  ⚠️ À faire dans VSCode : Crée backend/.env (même vide, pour le dev local)."
  exit 1
elif [ ! -s backend/.env ]; then
  echo "⚠️  backend/.env est vide. Si tu es en dev, c'est OK, mais pense à ajouter tes variables !"
else
  echo "✅ backend/.env OK"
fi

#### 4. Vérif .gitignore racine, backend, frontend ####
echo "------------------------------------------------"
echo "==> Vérification .gitignore"
if ! grep -q "node_modules" .gitignore; then
  echo "❌ ATTENTION : .gitignore racine n'ignore pas node_modules !"
  echo "➡️  ⚠️ Corrige dans VSCode ou ajoute '/node_modules' dans le .gitignore racine."
  exit 1
else
  echo "✅ .gitignore racine : OK"
fi
[ -f backend/.gitignore ] && echo "✅ backend/.gitignore OK" || { echo "⚠️ (Pas de .gitignore dans backend)"; }
[ -f frontend/.gitignore ] && echo "✅ frontend/.gitignore OK" || { echo "⚠️ (Pas de .gitignore dans frontend)"; }

#### 5. Audit GIT : fichiers volumineux/sensibles encore trackés ? ####
echo "------------------------------------------------"
echo "==> Audit des fichiers GIT à ignorer"
tracked=$(git ls-files | grep -E 'node_modules|.next|dist|\.env$' || true)
if [ -n "$tracked" ]; then
  echo "❌ ATTENTION : Certains fichiers volumineux ou sensibles sont trackés par Git :"
  echo "$tracked"
  echo "➡️  ⚠️  Solution : Ouvre VSCode > Terminal et lance :"
  echo "      git rm --cached <fichier_ou_dossier>"
  echo "   puis recommence ton commit."
  exit 2
else
  echo "✅ Aucun fichier problématique suivi par Git."
fi

#### 6. Installation des dépendances ####
echo "------------------------------------------------"
echo "==> Installation des dépendances backend..."
cd backend && npm install && cd ..
echo "==> Installation des dépendances frontend..."
cd frontend && npm install && cd ..

#### 7. Audit sécurité npm (optionnel mais pro) ####
echo "------------------------------------------------"
echo "==> Audit sécurité backend..."
cd backend && npm audit || true
echo "==> Audit sécurité frontend..."
cd ../frontend && npm audit || true
cd ..

#### 8. Résumé final ####
echo "------------------------------------------------"
echo "🎉 STRUCTURE ET SECURITÉ PROJET CHISFIS : OK"
echo "🟢 Prêt pour le dev, le push, et la CI."
echo "------------------------------------------------"

exit 0
