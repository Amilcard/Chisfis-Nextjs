# 🚀 GitHub Actions CI/CD

## 📋 Workflows configurés

### 1. 🔨 `ci.yml` - Build & Quality Check
**Déclencheur** : Push sur `main`, `master`, `develop`

**Actions** :
- ✅ Installation des dépendances
- 🧹 Nettoyage pre-build automatique
- 🔍 Vérification ESLint
- 🏗️ Build Next.js
- 📊 Analyse de la taille du build
- 🔍 Audit des fichiers backup

### 2. 🧪 `pr-check.yml` - PR Validation  
**Déclencheur** : Ouverture/mise à jour de Pull Request

**Actions** :
- ✅ Validation complète du code
- 🔍 Détection de fichiers volumineux
- 📊 Analyse du bundle
- 📄 Rapport de qualité automatique
- 🚨 Blocage si problèmes détectés

### 3. 🏥 `daily-health.yml` - Health Check quotidien
**Déclencheur** : Tous les jours ouvrés à 9h UTC + manuel

**Actions** :
- 🔒 Audit de sécurité des dépendances
- 📅 Vérification des packages obsolètes
- 📊 Métriques du projet (LOC, composants, taille)
- 🧹 Vérification de la propreté du projet

## 🎯 **Avantages de cette CI**

### ✅ **Protection automatique**
- **Aucun build cassé** n'atteint la production
- **Détection immédiate** des erreurs de dépendances
- **Validation** avant merge des PR

### 🔍 **Monitoring continu**
- **Alerte email** si le build échoue
- **Métriques quotidiennes** du projet
- **Audit de sécurité** automatique

### 🧹 **Qualité maintenue**
- **Nettoyage automatique** avant build
- **Détection** des fichiers backup oubliés
- **Validation ESLint** systématique

## 🚨 **Notifications**

### Quand recevez-vous des alertes ?
- ❌ **Build failed** → Email immédiat
- ⚠️ **Vulnérabilités** détectées → Rapport quotidien
- 📊 **Métriques** anormales → Health check quotidien

### Comment réagir ?
1. **Build failed** → Vérifiez les logs dans Actions
2. **ESLint errors** → Corrigez avec `npm run lint`
3. **Backup files detected** → Lancez `npm run cleanup`

## 📊 **Dashboard CI**

Accédez aux rapports : `GitHub → Actions → [Workflow]`

### Informations disponibles :
- 📈 **Historique des builds**
- 📊 **Taille du bundle** (évolution)
- 🔒 **Statut sécurité**
- 📝 **Métriques code** (LOC, composants)

## 🔧 **Configuration locale**

### Test avant push :
```bash
# Test complet local (comme la CI)
npm run cleanup
npm run lint  
npm run build

# Audit projet
npm run audit:backup
```

### Simulation CI locale :
```bash
# Exactly comme GitHub Actions
npm ci                 # Installe exactes dépendances
npm run cleanup        # Nettoyage automatique
npm run build         # Build production
```

## 🎯 **Best Practices**

### ✅ **Avant chaque commit** :
- Lancez `npm run build` localement
- Vérifiez qu'aucun warning critique
- Testez les fonctionnalités modifiées

### ✅ **Avant chaque PR** :
- Build local réussi
- ESLint clean
- Pas de fichiers backup oubliés

### ✅ **Monitoring régulier** :
- Consultez le health check hebdomadaire
- Mettez à jour les dépendances si nécessaire
- Surveillez l'évolution de la taille du build

---

**Status** : ✅ **CI Active et fonctionnelle**  
**Maintenance** : Automatique  
**Surveillance** : 24/7 avec alertes email
