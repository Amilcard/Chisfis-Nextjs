# Guide de Contribution

Merci de votre intérêt pour contribuer à Chisfis ! Ce guide vous aidera à démarrer.

## 🚀 Démarrage rapide

1. **Fork** le repository
2. **Clone** votre fork localement
3. **Installez** les dépendances : `npm install`
4. **Créez** une branche pour votre feature : `git checkout -b feature/nom-feature`
5. **Développez** votre fonctionnalité
6. **Testez** vos changements : `npm run dev`
7. **Commitez** vos changements : `git commit -m "feat: description"`
8. **Pushez** vers votre fork : `git push origin feature/nom-feature`
9. **Créez** une Pull Request

## 📋 Standards de code

### Structure des commits

Utilisez la convention [Conventional Commits](https://www.conventionalcommits.org/) :

```
type(scope): description

feat: ajouter page de profil utilisateur
fix: corriger bug de validation email
docs: mettre à jour README
style: reformater code avec prettier
refactor: optimiser composant ProgressBar
test: ajouter tests pour module auth
```

### Types de commits
- `feat`: nouvelle fonctionnalité
- `fix`: correction de bug
- `docs`: documentation
- `style`: formatage, point-virgules manquants, etc.
- `refactor`: refactoring de code
- `test`: ajout ou modification de tests
- `chore`: maintenance, mise à jour dépendances

### Standards TypeScript
- Toujours typer les paramètres et retours de fonction
- Utiliser des interfaces pour les objets complexes
- Préférer `const` à `let` quand possible
- Utiliser des noms descriptifs pour les variables

### Standards React
- Utiliser des hooks plutôt que des class components
- Extraire la logique complexe dans des custom hooks
- Préférer la composition à l'héritage
- Utiliser `React.memo()` pour les composants lourds

## 🎨 Standards de design

### Tailwind CSS
- Utiliser les classes utilitaires Tailwind
- Créer des composants réutilisables pour les patterns récurrents
- Respecter la palette de couleurs existante
- Assurer la responsivité mobile-first

### Accessibilité
- Utiliser des labels appropriés
- Respecter les contrastes de couleurs
- Implémenter la navigation au clavier
- Ajouter les attributs ARIA nécessaires

## 🧪 Tests

### Tests unitaires
```bash
npm run test              # Lancer tous les tests
npm run test:watch        # Mode watch
npm run test:coverage     # Coverage
```

### Tests E2E
```bash
npm run test:e2e          # Tests Cypress
```

## 📝 Documentation

- Documenter les nouvelles fonctionnalités dans le README
- Ajouter des commentaires JSDoc pour les fonctions complexes
- Mettre à jour le CHANGELOG.md
- Créer des exemples d'utilisation

## 🐛 Rapporter des bugs

Utilisez le template d'issue GitHub avec :
- Description claire du problème
- Étapes pour reproduire
- Comportement attendu vs observé
- Environnement (OS, navigateur, version Node)
- Screenshots si pertinent

## 💡 Proposer des fonctionnalités

1. Vérifiez que la fonctionnalité n'existe pas déjà
2. Ouvrez une issue pour discussion
3. Décrivez le problème résolu
4. Proposez une solution
5. Attendez les retours avant de développer

## 🔄 Process de review

Toutes les Pull Requests doivent :
- Passer les tests automatisés
- Respecter les standards de code
- Être reviewées par au moins un mainteneur
- Inclure de la documentation si nécessaire
- Avoir un titre et description clairs

## 📞 Support

- **Issues GitHub** pour bugs et features
- **Discussions** pour questions générales
- **Email** : dev@chisfis.com

Merci de contribuer à Chisfis ! 🙏
