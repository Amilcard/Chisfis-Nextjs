class UserService {
  constructor() {
    // Stockage temporaire en mémoire (remplacer par une vraie DB en production)
    this.users = new Map();
    this.nextId = 1;
  }

  /**
   * Créer un nouvel utilisateur
   * @param {object} userData - Données de l'utilisateur
   * @returns {object} - Utilisateur créé
   */
  async createUser(userData) {
    const user = {
      id: this.nextId++,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: null,
      isActive: true
    };
    
    this.users.set(user.email, user);
    return user;
  }

  /**
   * Récupérer un utilisateur par ID
   * @param {string|number} id - ID de l'utilisateur
   * @returns {object|null} - Utilisateur trouvé ou null
   */
  async getUserById(id) {
    console.log(`🔍 UserService.getUserById() appelé avec ID: ${id}`);
    console.log(`📊 Utilisateurs en mémoire: ${this.users.size}`);
    
    for (const user of this.users.values()) {
      if (user.id == id) {
        console.log(`✅ Utilisateur trouvé: ${user.email}`);
        return user;
      }
    }
    
    console.log(`❌ Utilisateur non trouvé pour ID: ${id}`);
    return null;
  }

  /**
   * Récupérer un utilisateur par email
   * @param {string} email - Email de l'utilisateur
   * @returns {object|null} - Utilisateur trouvé ou null
   */
  async getUserByEmail(email) {
    return this.users.get(email) || null;
  }

  /**
   * Alias pour getUserByEmail (compatibilité)
   */
  async findUserByEmail(email) {
    return this.getUserByEmail(email);
  }

  /**
   * Mettre à jour un utilisateur
   * @param {string|number} id - ID de l'utilisateur
   * @param {object} updateData - Données à mettre à jour
   * @returns {object|null} - Utilisateur mis à jour ou null
   */
  async updateUser(id, updateData) {
    const user = await this.getUserById(id);
    if (!user) return null;
    
    const updatedUser = {
      ...user,
      ...updateData,
      updatedAt: new Date()
    };
    
    // Mettre à jour dans le Map (utiliser l'email comme clé)
    this.users.set(user.email, updatedUser);
    
    return updatedUser;
  }

  /**
   * Mettre à jour le mot de passe d'un utilisateur
   * @param {string|number} userId - ID de l'utilisateur
   * @param {string} hashedPassword - Mot de passe hashé
   * @returns {boolean} - True si mis à jour, false sinon
   */
  async updatePassword(userId, hashedPassword) {
    const user = await this.getUserById(userId);
    if (!user) return false;
    
    await this.updateUser(userId, { password: hashedPassword });
    return true;
  }

  /**
   * Mettre à jour la dernière connexion
   * @param {string|number} userId - ID de l'utilisateur
   * @returns {boolean} - True si mis à jour, false sinon
   */
  async updateLastLogin(userId) {
    const user = await this.getUserById(userId);
    if (!user) return false;
    
    await this.updateUser(userId, { lastLoginAt: new Date() });
    return true;
  }

  /**
   * Activer/désactiver un utilisateur
   * @param {string|number} userId - ID de l'utilisateur
   * @param {boolean} isActive - Statut actif
   * @returns {object|null} - Utilisateur mis à jour ou null
   */
  async toggleUserActive(userId, isActive) {
    return this.updateUser(userId, { isActive });
  }

  /**
   * Supprimer un utilisateur
   * @param {string|number} id - ID de l'utilisateur
   * @returns {boolean} - True si supprimé, false sinon
   */
  async deleteUser(id) {
    const user = await this.getUserById(id);
    if (!user) return false;
    
    this.users.delete(user.email);
    return true;
  }

  /**
   * Récupérer tous les utilisateurs
   * @param {object} filters - Filtres optionnels
   * @returns {array} - Liste des utilisateurs
   */
  async getAllUsers(filters = {}) {
    let users = Array.from(this.users.values());
    
    // Appliquer les filtres
    if (filters.isActive !== undefined) {
      users = users.filter(user => user.isActive === filters.isActive);
    }
    
    if (filters.type) {
      users = users.filter(user => user.type === filters.type);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      users = users.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }
    
    return users;
  }

  /**
   * Compter les utilisateurs
   * @param {object} filters - Filtres optionnels
   * @returns {number} - Nombre d'utilisateurs
   */
  async countUsers(filters = {}) {
    const users = await this.getAllUsers(filters);
    return users.length;
  }

  /**
   * Vérifier si un email existe déjà
   * @param {string} email - Email à vérifier
   * @returns {boolean} - True si existe, false sinon
   */
  async emailExists(email) {
    return this.users.has(email);
  }

  // Méthodes statiques pour la compatibilité avec l'ancien code
  static async register(userData) {
    const instance = new UserService();
    return instance.createUser(userData);
  }

  static async login(email, password) {
    const instance = new UserService();
    const user = await instance.getUserByEmail(email);
    // TODO: Vérifier le mot de passe
    return { user, token: 'fake-token' };
  }

  static async forgotPassword(email) {
    // TODO: Implémenter la logique
    return true;
  }

  static async resetPassword(token, newPassword) {
    // TODO: Implémenter la logique
    return true;
  }

  static async changePassword(id, currentPassword, newPassword) {
    // TODO: Implémenter la logique
    return true;
  }

  static async updateUserRole(id, role) {
    const instance = new UserService();
    return instance.updateUser(id, { role });
  }

  static async deactivateUser(id) {
    const instance = new UserService();
    return instance.toggleUserActive(id, false);
  }

  static async updateUserStatus(id, status) {
    const instance = new UserService();
    return instance.updateUser(id, { status });
  }

  static async getFavorites(userId) {
    // TODO: Implémenter la logique
    return [];
  }

  static async addToFavorites(userId, activityId) {
    // TODO: Implémenter la logique
    return true;
  }

  static async removeFromFavorites(userId, activityId) {
    // TODO: Implémenter la logique
    return true;
  }
}

// Créer une instance singleton
const userServiceInstance = new UserService();

module.exports = userServiceInstance;
