# 📋 TABLEAU DE SUIVI DES CORRECTIONS UI

**Date de création** : 8 juillet 2025  
**Score initial** : 30/100 ⭐☆☆☆☆  
**Objectif** : 85/100 ⭐⭐⭐⭐☆

---

## 🔥 CORRECTIONS PRIORITAIRES (3 problèmes modérés)

| # | Problème | Fichiers Affectés | Priorité | Statut | Assigné | Date Limite |
|---|----------|-------------------|----------|--------|---------|-------------|
| 1 | **Couleurs hardcodées** (106 occurrences) | `my-requests/page.tsx`, `account-settings/page.tsx`, `ActivityCard.tsx`, etc. | 🔴 URGENT | ⏳ À faire | - | 15/07/2025 |
| 2 | **Balises `<a>` incorrectes** (22 occurrences) | `test-header/page.tsx`, composants divers | 🟠 IMPORTANT | ⏳ À faire | - | 20/07/2025 |
| 3 | **Doublons FilterPopover** (4 variants) | `FilterPopover.tsx`, `FilterPopover2.tsx`, `FilterPopoverNew.tsx` | 🟠 IMPORTANT | ⏳ À faire | - | 25/07/2025 |

---

## ⚠️ CORRECTIONS MINEURES (61 warnings ESLint)

| Catégorie | Nombre | Exemple | Action | Statut |
|-----------|--------|---------|--------|--------|
| **Apostrophes non échappées** | 50+ | `L'activité` → `L&apos;activité` | Script automatisé | ⏳ À faire |
| **useEffect dependencies** | 5 | `useEffect(() => {}, [])` → ajouter deps | Manuel | ⏳ À faire |
| **Autres warnings** | 6 | Divers | À évaluer | ⏳ À faire |

---

## 📊 PLAN DE CORRECTION DÉTAILLÉ

### 🎯 Phase 1 : Couleurs Design System (Priorité 1)

**Objectif** : Remplacer toutes les couleurs hardcodées par le design system

#### Fichiers à corriger :
- [ ] `src/app/(account)/my-requests/page.tsx`
- [ ] `src/app/(account)/account-settings/page.tsx`
- [ ] `src/components/ActivityCard.tsx`
- [ ] `src/components/ActivityCarousel.tsx`
- [ ] `src/app/(app)/search/page.tsx`

#### Mapping des couleurs :
| Actuel | Nouveau | Usage |
|--------|---------|-------|
| `bg-blue-100` | `bg-primary-100` | Badges activités |
| `bg-green-100` | `bg-success-100` | Status positifs |
| `bg-red-100` | `bg-error-100` | Erreurs, suppression |
| `bg-yellow-100` | `bg-warning-100` | Avertissements |

#### Script de remplacement :
```bash
# Remplacement automatisé des couleurs
find src/ -name "*.tsx" -exec sed -i 's/bg-blue-100/bg-primary-100/g' {} \;
find src/ -name "*.tsx" -exec sed -i 's/bg-green-100/bg-success-100/g' {} \;
find src/ -name "*.tsx" -exec sed -i 's/bg-red-100/bg-error-100/g' {} \;
find src/ -name "*.tsx" -exec sed -i 's/bg-yellow-100/bg-warning-100/g' {} \;
```

### 🔗 Phase 2 : Navigation Links (Priorité 2)

**Objectif** : Remplacer toutes les balises `<a>` par `<Link>` Next.js

#### Fichiers à vérifier :
- [ ] `src/app/(app)/test-header/page.tsx`
- [ ] Autres fichiers avec balises `<a href=`

#### Template de correction :
```tsx
// ❌ Avant
<a href="/page">Lien</a>

// ✅ Après
import Link from 'next/link'
<Link href="/page">Lien</Link>
```

### 🔄 Phase 3 : Nettoyage Doublons (Priorité 3)

**Objectif** : Consolider les composants FilterPopover

#### Analyse des variants :
| Fichier | Usage | Action |
|---------|-------|--------|
| `FilterPopover.tsx` | ✅ Principal | Conserver |
| `FilterPopover2.tsx` | ❓ Usage limité | Évaluer suppression |
| `FilterPopoverNew.tsx` | ❓ Version test | Évaluer suppression |
| `Common/Header/FilterPopover.tsx` | ❓ Doublon | Évaluer suppression |

#### Plan d'action :
1. [ ] Analyser l'usage de chaque variant
2. [ ] Migrer les fonctionnalités vers le composant principal
3. [ ] Supprimer les doublons
4. [ ] Tester les pages affectées

### 📝 Phase 4 : Warnings ESLint (Priorité 4)

#### 4.1 Apostrophes (Script automatisé)
```bash
# Remplacement automatique
find src/ -name "*.tsx" -exec sed -i "s/'/\&apos;/g" {} \;
```

#### 4.2 useEffect Dependencies (Manuel)
Fichiers à corriger :
- [ ] `src/app/(app)/(home-pages)/page.tsx:16`
- [ ] `src/app/(account)/children/[childId]/page.tsx:36`
- [ ] `src/app/(account)/dashboard/page.tsx:64`
- [ ] `src/app/(app)/search/page.tsx:78`

---

## 🎯 MÉTRIQUES DE PROGRESSION

### Score Actuel par Catégorie
| Catégorie | Score | Cible | Progression |
|-----------|-------|-------|-------------|
| **Build & Compilation** | 100/100 | 100/100 | ✅ |
| **Design System** | 20/100 | 90/100 | ░░░░░░░░░░ 0% |
| **Navigation** | 60/100 | 95/100 | ░░░░░░░░░░ 0% |
| **Code Quality** | 80/100 | 95/100 | ░░░░░░░░░░ 0% |
| **Architecture** | 85/100 | 90/100 | ░░░░░░░░░░ 0% |

### Timeline Prévisionnel
- **Semaine 1** (8-15 juillet) : Phase 1 - Couleurs
- **Semaine 2** (15-22 juillet) : Phase 2 - Navigation
- **Semaine 3** (22-29 juillet) : Phase 3 - Doublons
- **Semaine 4** (29 juillet-5 août) : Phase 4 - Warnings + Tests

---

## ✅ CHECKLIST DE VALIDATION

### Avant chaque correction :
- [ ] Backup du fichier original
- [ ] Test en local après modification
- [ ] Vérification visual avec `npm run dev`
- [ ] Test du build avec `npm run build`

### Après chaque phase :
- [ ] Lancer `./scripts/audit-ui.sh`
- [ ] Vérifier l'amélioration du score
- [ ] Tests manuels des pages critiques
- [ ] Commit avec message descriptif

### Tests critiques :
- [ ] Page d'accueil responsive
- [ ] Recherche fonctionnelle
- [ ] Dashboard utilisateur
- [ ] Mode sombre/clair
- [ ] Navigation mobile

---

## 📈 TEMPLATE DE RAPPORT HEBDOMADAIRE

```markdown
## Rapport Semaine du [DATE]

### Corrections Effectuées :
- [X] Correction 1 - [Description]
- [X] Correction 2 - [Description]

### Score Évolution :
- Score précédent : XX/100
- Score actuel : YY/100
- Progression : +ZZ points

### Problèmes Rencontrés :
- [Description du problème]
- [Solution appliquée]

### Planning Semaine Suivante :
- [ ] Tâche 1
- [ ] Tâche 2
```

---

## 🚀 OBJECTIFS FINAUX

### Score Cible : 85/100 ⭐⭐⭐⭐☆

#### Répartition :
- **Design System Compliance** : 90/100
- **Code Quality** : 95/100  
- **Performance** : 95/100
- **User Experience** : 90/100
- **Maintainability** : 85/100

### Livraison Finale : 5 août 2025

---

*Template créé le 8 juillet 2025 - À mettre à jour à chaque correction*
