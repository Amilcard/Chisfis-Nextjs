# 🔐 Module d'Authentification Chisfis

## Installation des dépendances

Exécutez le script d'installation :

```bash
chmod +x install-auth-deps.sh
./install-auth-deps.sh
```

Ou installez manuellement :

```bash
npm install next-auth @next-auth/prisma-adapter bcryptjs react-hook-form
npm install --save-dev @types/bcryptjs
```

## Configuration

1. **Variables d'environnement** : Le fichier `.env.local` est déjà configuré avec des valeurs par défaut.

2. **Pour utiliser OAuth en production** :
   - Remplacez les valeurs `GOOGLE_ID` et `GOOGLE_SECRET` dans `.env.local`
   - Remplacez les valeurs `FACEBOOK_ID` et `FACEBOOK_SECRET` dans `.env.local`

## Utilisation

### Démarrer le serveur

```bash
npm run dev
```

### Pages disponibles

- **Connexion** : http://localhost:3000/auth/signin
- **Inscription** : http://localhost:3000/auth/signup

### Compte de test

Pour tester la connexion :
- Email : `demo@example.com`
- Mot de passe : `demo123`

## Fonctionnalités

### Page de connexion
- ✅ Formulaire email/mot de passe
- ✅ Boutons OAuth (Google, Facebook)
- ✅ Affichage/masquage du mot de passe
- ✅ Option "Se souvenir de moi"
- ✅ Lien vers inscription
- ✅ Gestion des erreurs

### Page d'inscription (2 étapes)
- ✅ **Étape 1** : Informations de base (prénom, nom, email, mot de passe)
- ✅ **Étape 2** : Informations complémentaires (téléphone, date de naissance, genre)
- ✅ Barre de progression visuelle
- ✅ Validation avancée des mots de passe
- ✅ Confirmation du mot de passe
- ✅ Acceptation des CGU obligatoire
- ✅ Newsletter optionnelle

### Design
- ✅ Responsive mobile/desktop
- ✅ Respecte le design Tailwind existant
- ✅ Animations et transitions fluides
- ✅ États de chargement
- ✅ Messages d'erreur contextuels

## Structure des fichiers

```
src/
├── pages/api/auth/
│   └── [...nextauth].ts              # Configuration NextAuth
├── app/
│   ├── layout.tsx                    # Provider NextAuth ajouté
│   ├── (auth)/
│   │   ├── layout.tsx                # Layout centré pour auth
│   │   └── auth/
│   │       ├── signin/page.tsx       # Page de connexion
│   │       └── signup/page.tsx       # Page d'inscription (2 étapes)
│   └── api/auth/register/route.ts    # API d'inscription
├── components/
│   ├── SocialButton.tsx              # Boutons OAuth
│   ├── ProgressBar.tsx               # Barre de progression
│   └── NextAuthProvider.tsx          # Provider NextAuth
└── .env.local                        # Variables d'environnement
```

## API Routes

### POST /api/auth/register
Crée un nouveau compte utilisateur.

**Body** :
```json
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "0612345678",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "newsletter": true
}
```

## Intégration future

Pour une utilisation en production :

1. **Base de données** : Configurez Prisma avec votre base de données
2. **OAuth** : Configurez les clés réelles Google/Facebook
3. **Email** : Ajoutez la vérification d'email
4. **Sécurité** : Implémentez "Mot de passe oublié"
5. **Monitoring** : Ajoutez des logs et métriques

## Support

Le module est 100% fonctionnel et prêt à être utilisé ! 🎉
