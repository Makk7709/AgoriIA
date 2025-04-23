import { render, screen, waitFor } from '@testing-library/react'
import { AdminButton } from '../AdminButton'
import { createBrowserClient } from '@supabase/ssr'
import { vi } from 'vitest'
import type { Session } from '@supabase/supabase-js'

// Mock de Supabase
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      }))
    }))
  }))
}))

describe('AdminButton', () => {
  // Test 1: Le bouton ne doit pas être affiché pendant le chargement
  it('ne doit pas afficher le bouton pendant le chargement', () => {
    render(<AdminButton />)
    expect(screen.queryByText('Administration')).not.toBeInTheDocument()
  })

  // Test 2: Le bouton ne doit pas être affiché si l'utilisateur n'est pas connecté
  it('ne doit pas afficher le bouton si l\'utilisateur n\'est pas connecté', async () => {
    const mockSupabase = createBrowserClient()
    ;(mockSupabase.auth.getSession as any).mockResolvedValue({ data: { session: null } })

    render(<AdminButton />)
    await waitFor(() => {
      expect(screen.queryByText('Administration')).not.toBeInTheDocument()
    })
  })

  // Test 3: Le bouton ne doit pas être affiché si l'utilisateur n'est pas admin
  it('ne doit pas afficher le bouton si l\'utilisateur n\'est pas admin', async () => {
    const mockSupabase = createBrowserClient()
    ;(mockSupabase.auth.getSession as any).mockResolvedValue({
      data: {
        session: {
          user: { id: '123' }
        } as Session
      }
    })
    ;(mockSupabase.from().select().eq().single as any).mockResolvedValue({
      data: { role: 'user' },
      error: null
    })

    render(<AdminButton />)
    await waitFor(() => {
      expect(screen.queryByText('Administration')).not.toBeInTheDocument()
    })
  })

  // Test 4: Le bouton doit être affiché si l'utilisateur est admin
  it('doit afficher le bouton si l\'utilisateur est admin', async () => {
    const mockSupabase = createBrowserClient()
    ;(mockSupabase.auth.getSession as any).mockResolvedValue({
      data: {
        session: {
          user: { id: '123' }
        } as Session
      }
    })
    ;(mockSupabase.from().select().eq().single as any).mockResolvedValue({
      data: { role: 'admin' },
      error: null
    })

    render(<AdminButton />)
    await waitFor(() => {
      const button = screen.getByText('Administration')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('href', '/admin')
      expect(button).toHaveClass('text-sm', 'font-medium', 'text-blue-800')
    })
  })

  // Test 5: Le bouton doit avoir le bon style
  it('doit avoir le bon style', async () => {
    const mockSupabase = createBrowserClient()
    ;(mockSupabase.auth.getSession as any).mockResolvedValue({
      data: {
        session: {
          user: { id: '123' }
        } as Session
      }
    })
    ;(mockSupabase.from().select().eq().single as any).mockResolvedValue({
      data: { role: 'admin' },
      error: null
    })

    render(<AdminButton />)
    await waitFor(() => {
      const button = screen.getByText('Administration')
      expect(button).toHaveClass(
        'text-sm',
        'font-medium',
        'text-blue-800',
        'hover:text-blue-900',
        'hover:bg-blue-50',
        'border-blue-200'
      )
    })
  })

  // Test 6: Le bouton doit gérer les erreurs de manière appropriée
  it('doit gérer les erreurs de manière appropriée', async () => {
    const mockSupabase = createBrowserClient()
    ;(mockSupabase.auth.getSession as any).mockRejectedValue(new Error('Erreur de connexion'))

    const consoleSpy = vi.spyOn(console, 'error')
    render(<AdminButton />)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Erreur lors de la vérification du statut admin:',
        expect.any(Error)
      )
      expect(screen.queryByText('Administration')).not.toBeInTheDocument()
    })
    
    consoleSpy.mockRestore()
  })

  // Test 7: Le bouton doit se mettre à jour si le statut admin change
  it('doit se mettre à jour si le statut admin change', async () => {
    const mockSupabase = createBrowserClient()
    let isAdmin = false

    ;(mockSupabase.auth.getSession as any).mockResolvedValue({
      data: {
        session: {
          user: { id: '123' }
        } as Session
      }
    })
    ;(mockSupabase.from().select().eq().single as any).mockImplementation(() => {
      return Promise.resolve({
        data: { role: isAdmin ? 'admin' : 'user' },
        error: null
      })
    })

    const { rerender } = render(<AdminButton />)
    
    // Premier rendu - pas admin
    await waitFor(() => {
      expect(screen.queryByText('Administration')).not.toBeInTheDocument()
    })

    // Changement du statut admin
    isAdmin = true
    rerender(<AdminButton />)

    // Deuxième rendu - admin
    await waitFor(() => {
      expect(screen.getByText('Administration')).toBeInTheDocument()
    })
  })
}) 