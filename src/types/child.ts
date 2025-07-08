// Types pour la gestion des profils enfants
export interface Child {
  id: string
  parentId: string
  name: string
  age: number
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  avatar: string
  interests: string[]
  allergies: string[]
  medicalInfo: string
  emergencyContact: string
  emergencyPhone: string
  school: string
  className: string
  favoriteActivities: string[]
  restrictions: string[]
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface Parent {
  id: string
  email: string
  name: string
  phone: string
  address: string
  children: Child[]
}

export interface ChildFormData {
  name: string
  age: number
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  avatar: string
  interests: string[]
  allergies: string[]
  medicalInfo: string
  emergencyContact: string
  emergencyPhone: string
  school: string
  className: string
  restrictions: string[]
}

export interface Activity {
  id: string
  title: string
  description: string
  category: string
  ageRange: {
    min: number
    max: number
  }
  duration: number
  price: number
  location: string
  instructor: string
  schedule: {
    dayOfWeek: string
    startTime: string
    endTime: string
  }[]
  maxParticipants: number
  currentParticipants: number
  requirements: string[]
  imageUrl: string
}

export interface ChildRequest {
  id: string
  childId: string
  activityId: string
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  requestDate: string
  message: string
  parentApproval: boolean
}

export interface Achievement {
  id: string
  childId: string
  title: string
  description: string
  category: string
  date: string
  points: number
  badgeIcon: string
}
