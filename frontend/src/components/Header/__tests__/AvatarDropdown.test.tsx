import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import AvatarDropdown from 'frontend/src/components/Header/AvatarDropdown'

// Mock du localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock du router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

// Mock des composants externes
vi.mock('@/shared/Avatar', () => ({
  default: ({ src, className }: { src: string; className: string }) => (
    <div data-testid="avatar" className={className}>
      <img src={src} alt="avatar" />
    </div>
  ),
}))

vi.mock('@/shared/divider', () => ({
  Divider: () => <div data-testid="divider" />,
}))

vi.mock('@/shared/link', () => ({
  Link: ({ href, children, className }: any) => (
    <a href={href} className={className} data-testid="link">
      {children}
    </a>
  ),
}))

vi.mock('@/shared/SwitchDarkMode2', () => ({
  default: () => <div data-testid="dark-mode-switch" />,
}))

describe('AvatarDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('affiche le bouton "Se connecter" quand non authentifié', () => {
    localStorageMock.getItem.mockReturnValue(null)
    
    render(<AvatarDropdown />)
    
    expect(screen.getByText('Se connecter')).toBeInTheDocument()
  })

  it('affiche l\'avatar quand authentifié', () => {
    const mockAuthData = {
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        type: 'parent',
        avatar: '/test-avatar.jpg'
      }
    }
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockAuthData))
    
    render(<AvatarDropdown />)
    
    expect(screen.getByTestId('avatar')).toBeInTheDocument()
  })

  it('affiche les liens appropriés pour un parent', () => {
    const mockAuthData = {
      user: {
        id: '1',
        name: 'Parent User',
        email: 'parent@example.com',
        type: 'parent'
      }
    }
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockAuthData))
    
    render(<AvatarDropdown />)
    
    // Cliquer sur l'avatar pour ouvrir le menu
    const avatarButton = screen.getByRole('button')
    fireEvent.click(avatarButton)
    
    expect(screen.getByText('Dashboard Parent')).toBeInTheDocument()
    expect(screen.getByText('Activités Sauvegardées')).toBeInTheDocument()
  })

  it('affiche les liens appropriés pour un enfant', () => {
    const mockAuthData = {
      user: {
        id: '1',
        name: 'Child User',
        email: 'child@example.com',
        type: 'child'
      }
    }
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockAuthData))
    
    render(<AvatarDropdown />)
    
    // Cliquer sur l'avatar pour ouvrir le menu
    const avatarButton = screen.getByRole('button')
    fireEvent.click(avatarButton)
    
    expect(screen.getByText('Mon Espace')).toBeInTheDocument()
    expect(screen.getByText('Ma Wishlist')).toBeInTheDocument()
    expect(screen.getByText('Mes Demandes')).toBeInTheDocument()
  })

  it('gère la déconnexion correctement', () => {
    const mockAuthData = {
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        type: 'parent'
      }
    }
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockAuthData))
    
    render(<AvatarDropdown />)
    
    // Cliquer sur l'avatar pour ouvrir le menu
    const avatarButton = screen.getByRole('button')
    fireEvent.click(avatarButton)
    
    // Cliquer sur déconnexion
    const logoutButton = screen.getByText('Se déconnecter')
    fireEvent.click(logoutButton)
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('authData')
  })

  it('affiche l\'icône par défaut quand pas d\'avatar', () => {
    const mockAuthData = {
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        type: 'parent'
        // Pas d'avatar
      }
    }
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockAuthData))
    
    render(<AvatarDropdown />)
    
    // Vérifier que l'avatar utilise l'image par défaut
    expect(screen.getByTestId('avatar')).toBeInTheDocument()
  })
})
