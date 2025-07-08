# Module "Mot de Passe Oublié" - Documentation de Test

## 🎯 Fonctionnalités Implémentées

### 1. Page Mot de Passe Oublié (`/forgot-password`)
- ✅ Formulaire de saisie d'email avec validation
- ✅ Appel API vers `/api/auth/forgot-password`
- ✅ Messages de succès/erreur
- ✅ États de chargement
- ✅ Lien de retour vers login/signup

### 2. Page Réinitialisation (`/reset-password`)
- ✅ Formulaire de nouveau mot de passe
- ✅ Confirmation du mot de passe
- ✅ Validation côté client (8 caractères minimum)
- ✅ Récupération du token depuis l'URL
- ✅ Appel API vers `/api/auth/reset-password`
- ✅ Redirection automatique vers login après succès

### 3. API Backend
- ✅ Route `POST /api/auth/forgot-password`
  - Génération de token sécurisé
  - Simulation d'envoi d'email
  - Gestion des tokens avec expiration (1h)
- ✅ Route `POST /api/auth/reset-password`
  - Validation du token
  - Vérification de l'expiration
  - Hashage du nouveau mot de passe
  - Nettoyage du token utilisé
- ✅ Route `GET /api/auth/reset-password` (vérification de token)

## 🧪 Comment Tester

### Test 1 : Demande de Réinitialisation
1. Allez sur `/login`
2. Cliquez sur "Mot de passe oublié"
3. Entrez un email valide : `user@example.com` ou `test@test.com`
4. Cliquez sur "Envoyer le lien de réinitialisation"
5. ✅ Vous devriez voir un message de succès
6. ✅ Vérifiez la console du serveur pour voir l'email simulé avec le lien

### Test 2 : Réinitialisation avec Token Valide
1. Copiez le lien de réinitialisation depuis la console
2. Collez-le dans votre navigateur (format: `/reset-password?token=xxxxx`)
3. Entrez un nouveau mot de passe (min 8 caractères)
4. Confirmez le mot de passe
5. Cliquez sur "Réinitialiser le mot de passe"
6. ✅ Vous devriez voir un message de succès
7. ✅ Redirection automatique vers `/login` après 2 secondes

### Test 3 : Cas d'Erreur
- **Email inexistant** : `inexistant@test.com` → Message de succès (sécurité)
- **Token expiré** : Attendre 1h ou modifier manuellement le code
- **Token invalide** : Aller sur `/reset-password?token=invalid`
- **Mots de passe différents** : Saisir des mots de passe différents
- **Mot de passe trop court** : Moins de 8 caractères

## 🔧 Configuration de Production

### Variables d'Environnement
```bash
# .env.local
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
EMAIL_SERVICE_API_KEY=your_api_key
DATABASE_URL=your_database_url
```

### Services à Intégrer
1. **Base de Données** : Remplacer les Map() par une vraie DB
2. **Service Email** : Intégrer SendGrid, Mailgun, ou Nodemailer
3. **Hashage Sécurisé** : Utiliser bcrypt au lieu de crypto.createHash
4. **Rate Limiting** : Ajouter des limites sur les demandes de réinitialisation

## 📋 Emails de Test Disponibles
- `user@example.com`
- `test@test.com`

Ces emails sont préconfigurés dans la simulation. En production, remplacez par votre système d'authentification.

## 🚀 Prochaines Améliorations
- [ ] Intégration avec une vraie base de données
- [ ] Service d'email réel
- [ ] Rate limiting
- [ ] Logs de sécurité
- [ ] Interface d'administration
- [ ] Tests unitaires
