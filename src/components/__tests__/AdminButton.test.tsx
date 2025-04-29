import { render, screen, waitFor, act } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AdminButton } from '../AdminButton'
import * as useAuthModule from '@/hooks/useAuth'
import * as checkAdminModule from '@/lib/checkAdmin'

// Mock du router Next.js App Router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

// Mocks habituels
vi.mock('@/hooks/useAuth')
vi.mock('@/lib/checkAdmin')

describe('AdminButton', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('ne doit pas afficher le bouton pendant le chargement', () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({ user: null, loading: true })
    render(<AdminButton />)
    expect(screen.queryByText('Administration')).not.toBeInTheDocument()
  })

  it("ne doit pas afficher le bouton si l'utilisateur n'est pas connecté", async () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({ user: null, loading: false })
    vi.spyOn(checkAdminModule, 'checkAdminStatus').mockResolvedValue(false)
    render(<AdminButton />)
    await waitFor(() => {
      expect(screen.queryByText('Administration')).not.toBeInTheDocument()
    })
  })

  it("ne doit pas afficher le bouton si l'utilisateur n'est pas admin", async () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({ user: { email: 'test@user.com' }, loading: false })
    vi.spyOn(checkAdminModule, 'checkAdminStatus').mockResolvedValue(false)
    render(<AdminButton />)
    await waitFor(() => {
      expect(screen.queryByText('Administration')).not.toBeInTheDocument()
    })
  })

  it("doit afficher le bouton si l'utilisateur est admin", async () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({ user: { email: 'admin@site.com' }, loading: false })
    vi.spyOn(checkAdminModule, 'checkAdminStatus').mockResolvedValue(true)
    render(<AdminButton />)
    await waitFor(() => {
      expect(screen.getByText('Administration')).toBeInTheDocument()
    })
  })

  it('doit avoir le bon style', async () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({ user: { email: 'admin@site.com' }, loading: false })
    vi.spyOn(checkAdminModule, 'checkAdminStatus').mockResolvedValue(true)
    render(<AdminButton />)
    await waitFor(() => {
      const button = screen.getByText('Administration')
      expect(button).toHaveClass('text-gray-600')
    })
  })

  it('doit gérer les erreurs de manière appropriée', async () => {
    vi.spyOn(useAuthModule, 'useAuth').mockReturnValue({ user: { email: 'admin@site.com' }, loading: false })
    vi.spyOn(checkAdminModule, 'checkAdminStatus').mockImplementation(() => {
      throw new Error('Erreur de test')
    })
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<AdminButton />)
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Erreur lors de la vérification du statut admin:',
        expect.any(Error)
      )
    })
  })

  it('doit se mettre à jour si le statut admin change', async () => {
    const mockUseAuth = vi.spyOn(useAuthModule, 'useAuth')
    const mockCheckAdmin = vi.spyOn(checkAdminModule, 'checkAdminStatus')

    // Premier rendu - pas admin
    mockUseAuth.mockReturnValue({ user: { email: 'admin@site.com' }, loading: false })
    mockCheckAdmin.mockResolvedValueOnce(false)

    const { rerender } = render(<AdminButton />)

    await waitFor(() => {
      expect(screen.queryByText('Administration')).not.toBeInTheDocument()
    })

    // Deuxième rendu - admin
    await act(async () => {
      mockUseAuth.mockReturnValue({ user: { email: 'admin@site.com' }, loading: false })
      mockCheckAdmin.mockResolvedValueOnce(true)
      rerender(<AdminButton />)
    })

    await waitFor(() => {
      expect(screen.getByText('Administration')).toBeInTheDocument()
    })
  })
}) 