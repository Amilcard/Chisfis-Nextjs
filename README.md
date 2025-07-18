# 🚀 Chisfis - Plateforme de Réservation d'Activités

Une plateforme moderne et responsive pour la réservation d'activités pour enfants et familles, construite avec Next.js 15, TypeScript et Tailwind CSS.

## 🎯 Fonctionnalités

### ✅ Module d'Authentification Complet
- **Connexion** avec email/mot de passe
- **Inscription** en 2 étapes avec barre de progression
- **Validation** avancée des formulaires
- **Interface responsive** et moderne
- **Gestion des erreurs** en temps réel
- **Affichage/masquage** des mots de passe
- **Support OAuth** (Google, Facebook) - prêt pour configuration

### 🎨 Interface Utilisateur
- Design moderne avec Tailwind CSS
- Composants réutilisables
- Animations fluides avec Framer Motion
- Support multi-thème (clair/sombre)
- Navigation responsive

### 🛠️ Technologies

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4.1.5
- **UI Components**: Headless UI, Heroicons
- **Animations**: Framer Motion
- **Forms**: Validation native React
- **Auth**: API Routes natives Next.js

## 🚀 Installation et Lancement

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone [URL_DU_REPO]
cd chisfis-nextjs

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le projet sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🔐 Module d'Authentification

### Pages disponibles

- **Connexion**: `/auth/signin`
- **Inscription**: `/auth/signup`

### Compte de test

```
Email: demo@example.com
Mot de passe: demo123
```

### API Endpoints

- `POST /api/auth/signin` - Authentification
- `POST /api/auth/register` - Création de compte

### Structure du module

```
src/
├── pages/api/auth/
│   ├── signin.ts                    # API de connexion
│   └── [...nextauth].ts            # Configuration auth (legacy)
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx               # Layout d'authentification
│   │   └── auth/
│   │       ├── signin/page.tsx      # Page de connexion
│   │       └── signup/page.tsx      # Page d'inscription
│   └── api/auth/register/route.ts   # API d'inscription
└── components/
    ├── SocialButton.tsx             # Boutons OAuth
    └── ProgressBar.tsx              # Barre de progression
```

## 📁 Structure du Projet

```
chisfis-nextjs/
├── public/                  # Assets statiques
├── src/
│   ├── app/                # App Router (Next.js 13+)
│   │   ├── (account)/      # Pages compte utilisateur
│   │   ├── (app)/          # Pages principales
│   │   ├── (auth)/         # Module d'authentification
│   │   └── api/            # API Routes
│   ├── components/         # Composants réutilisables
│   ├── shared/            # Composants partagés
│   ├── styles/            # Styles globaux
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utilitaires
│   └── data/              # Données mock
├── .env.local             # Variables d'environnement
├── tailwind.config.js     # Configuration Tailwind
└── next.config.mjs        # Configuration Next.js
```

## 🎨 Thème et Design

- **Palette de couleurs** moderne et accessible
- **Composants** cohérents et réutilisables
- **Responsive design** mobile-first
- **Dark mode** intégré
- **Animations** subtiles et performantes

## 🔧 Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification ESLint
```

## 🌟 Fonctionnalités à venir

- [ ] Intégration base de données (Prisma)
- [ ] Système de réservation
- [ ] Paiements en ligne
- [ ] Dashboard administrateur
- [ ] Notifications en temps réel
- [ ] Multi-langues
- [ ] Tests automatisés

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

Développé avec ❤️ pour Chisfis

---

**⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !**

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
bun dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
#   c h i s f i s - n e x t j s 
 
 
