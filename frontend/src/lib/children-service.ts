import { Child, ChildFormData, Parent, ChildRequest, Achievement } from 'frontend/src/types/child'

// Simulation de base de données en mémoire
// En production, remplacer par de vrais appels API
class ChildrenService {
  private children: Map<string, Child> = new Map()
  private parents: Map<string, Parent> = new Map()
  private requests: Map<string, ChildRequest> = new Map()
  private achievements: Map<string, Achievement> = new Map()

  constructor() {
    this.initMockData()
  }

  private initMockData() {
    // Données de test
    const mockParent: Parent = {
      id: 'parent-1',
      email: 'parent@example.com',
      name: 'Marie Dupont',
      phone: '06 12 34 56 78',
      address: '123 Rue de la Paix, 42000 Saint-Étienne',
      children: []
    }

    const mockChildren: Child[] = [
      {
        id: 'child-1',
        parentId: 'parent-1',
        name: 'Lucas Dupont',
        age: 8,
        dateOfBirth: '2016-03-15',
        gender: 'male',
        avatar: '👦',
        interests: ['Sport', 'Science', 'Jeux vidéo'],
        allergies: ['Arachides'],
        medicalInfo: 'Léger asthme, inhalateur en cas de besoin',
        emergencyContact: 'Grand-mère Dupont',
        emergencyPhone: '06 98 76 54 32',
        school: 'École Primaire Jean Moulin',
        className: 'CE2',
        favoriteActivities: ['Tennis', 'Atelier Science'],
        restrictions: ['Pas d\'activités trop physiques sans inhalateur'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-12-01T15:30:00Z',
        isActive: true
      },
      {
        id: 'child-2',
        parentId: 'parent-1',
        name: 'Emma Dupont',
        age: 6,
        dateOfBirth: '2018-07-22',
        gender: 'female',
        avatar: '👧',
        interests: ['Art & Créatif', 'Danse', 'Musique'],
        allergies: [],
        medicalInfo: '',
        emergencyContact: 'Grand-mère Dupont',
        emergencyPhone: '06 98 76 54 32',
        school: 'École Primaire Jean Moulin',
        className: 'CP',
        favoriteActivities: ['Atelier Poterie', 'Cours de Danse'],
        restrictions: [],
        createdAt: '2024-01-15T10:05:00Z',
        updatedAt: '2024-11-28T09:15:00Z',
        isActive: true
      }
    ]

    this.parents.set(mockParent.id, { ...mockParent, children: mockChildren })
    mockChildren.forEach(child => this.children.set(child.id, child))

    // Données de requêtes de test
    const mockRequests: ChildRequest[] = [
      {
        id: 'req-1',
        childId: 'child-1',
        activityId: 'activity-1',
        status: 'pending',
        requestDate: '2024-12-06T14:30:00Z',
        message: 'Lucas aimerait essayer le cours de tennis avancé',
        parentApproval: false
      },
      {
        id: 'req-2',
        childId: 'child-2',
        activityId: 'activity-2',
        status: 'approved',
        requestDate: '2024-12-05T11:20:00Z',
        message: 'Emma souhaite participer à l\'atelier poterie',
        parentApproval: true
      }
    ]

    mockRequests.forEach(request => this.requests.set(request.id, request))

    // Données d'achievements de test
    const mockAchievements: Achievement[] = [
      {
        id: 'ach-1',
        childId: 'child-1',
        title: 'Premier Match de Tennis',
        description: 'A participé à son premier match de tennis',
        category: 'Sport',
        date: '2024-11-20T16:00:00Z',
        points: 50,
        badgeIcon: '🎾'
      },
      {
        id: 'ach-2',
        childId: 'child-2',
        title: 'Artiste en Herbe',
        description: 'A créé sa première poterie',
        category: 'Art & Créatif',
        date: '2024-11-25T10:30:00Z',
        points: 30,
        badgeIcon: '🎨'
      }
    ]

    mockAchievements.forEach(achievement => this.achievements.set(achievement.id, achievement))
  }

  // Méthodes pour les enfants
  async getChildrenByParent(parentId: string): Promise<Child[]> {
    await this.delay(300) // Simulation latence réseau
    const parent = this.parents.get(parentId)
    return parent?.children || []
  }

  async getChild(childId: string): Promise<Child | null> {
    await this.delay(200)
    return this.children.get(childId) || null
  }

  async createChild(parentId: string, data: ChildFormData): Promise<Child> {
    await this.delay(500)
    
    const newChild: Child = {
      id: `child-${Date.now()}`,
      parentId,
      ...data,
      favoriteActivities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    }

    this.children.set(newChild.id, newChild)
    
    // Mettre à jour le parent
    const parent = this.parents.get(parentId)
    if (parent) {
      parent.children.push(newChild)
      this.parents.set(parentId, parent)
    }

    return newChild
  }

  async updateChild(childId: string, data: Partial<ChildFormData>): Promise<Child> {
    await this.delay(500)
    
    const existingChild = this.children.get(childId)
    if (!existingChild) {
      throw new Error('Enfant non trouvé')
    }

    const updatedChild: Child = {
      ...existingChild,
      ...data,
      updatedAt: new Date().toISOString()
    }

    this.children.set(childId, updatedChild)

    // Mettre à jour dans le parent
    const parent = this.parents.get(existingChild.parentId)
    if (parent) {
      const childIndex = parent.children.findIndex(c => c.id === childId)
      if (childIndex !== -1) {
        parent.children[childIndex] = updatedChild
        this.parents.set(parent.id, parent)
      }
    }

    return updatedChild
  }

  async deleteChild(childId: string): Promise<void> {
    await this.delay(400)
    
    const child = this.children.get(childId)
    if (!child) {
      throw new Error('Enfant non trouvé')
    }

    // Supprimer l'enfant
    this.children.delete(childId)

    // Mettre à jour le parent
    const parent = this.parents.get(child.parentId)
    if (parent) {
      parent.children = parent.children.filter(c => c.id !== childId)
      this.parents.set(parent.id, parent)
    }

    // Supprimer les requêtes et achievements associés
    for (const [reqId, request] of this.requests.entries()) {
      if (request.childId === childId) {
        this.requests.delete(reqId)
      }
    }

    for (const [achId, achievement] of this.achievements.entries()) {
      if (achievement.childId === childId) {
        this.achievements.delete(achId)
      }
    }
  }

  async toggleChildActive(childId: string, isActive: boolean): Promise<Child> {
    await this.delay(200)
    
    const child = this.children.get(childId)
    if (!child) {
      throw new Error('Enfant non trouvé')
    }

    const updatedChild: Child = {
      ...child,
      isActive,
      updatedAt: new Date().toISOString()
    }

    this.children.set(childId, updatedChild)

    // Mettre à jour dans le parent
    const parent = this.parents.get(child.parentId)
    if (parent) {
      const childIndex = parent.children.findIndex(c => c.id === childId)
      if (childIndex !== -1) {
        parent.children[childIndex] = updatedChild
        this.parents.set(parent.id, parent)
      }
    }

    return updatedChild
  }

  // Méthodes pour les requêtes
  async getChildRequests(childId: string): Promise<ChildRequest[]> {
    await this.delay(200)
    return Array.from(this.requests.values()).filter(req => req.childId === childId)
  }

  async getPendingRequestsByParent(parentId: string): Promise<ChildRequest[]> {
    await this.delay(200)
    const parent = this.parents.get(parentId)
    if (!parent) return []

    const childIds = parent.children.map(c => c.id)
    return Array.from(this.requests.values()).filter(
      req => childIds.includes(req.childId) && req.status === 'pending'
    )
  }

  // Méthodes pour les achievements
  async getChildAchievements(childId: string): Promise<Achievement[]> {
    await this.delay(200)
    return Array.from(this.achievements.values()).filter(ach => ach.childId === childId)
  }

  // Méthodes pour les parents
  async getParent(parentId: string): Promise<Parent | null> {
    await this.delay(200)
    return this.parents.get(parentId) || null
  }

  // Méthode utilitaire pour simuler la latence réseau
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Méthode pour les statistiques
  async getChildStats(childId: string): Promise<{
    totalActivities: number
    completedActivities: number
    achievements: number
    totalPoints: number
  }> {
    await this.delay(200)
    
    const requests = await this.getChildRequests(childId)
    const achievements = await this.getChildAchievements(childId)
    
    return {
      totalActivities: requests.length,
      completedActivities: requests.filter(r => r.status === 'approved').length,
      achievements: achievements.length,
      totalPoints: achievements.reduce((sum, ach) => sum + ach.points, 0)
    }
  }
}

// Instance singleton
export const childrenService = new ChildrenService()
export default childrenService
