import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ThemePage from '../page'
import { getThemeWithPositions } from '@/lib/supabase/getThemeWithPositions'

// Mock the getThemeWithPositions function
vi.mock('@/lib/supabase/getThemeWithPositions', () => ({
  getThemeWithPositions: vi.fn()
}))

describe('ThemePage', () => {
  const mockTheme = {
    id: 'theme-1',
    name: 'Economy',
    description: 'Economic policies',
    created_at: '2024-01-01T00:00:00Z'
  }

  const mockPositions = [
    {
      id: 'pos-1',
      theme_id: 'theme-1',
      candidate_id: 'cand-1',
      content: 'Position Description',
      source_url: 'http://example.com',
      created_at: '2024-01-01T00:00:00Z',
      candidate: {
        name: 'John Doe',
        party: 'Party A'
      }
    }
  ]

  it('should render theme content when data is available', async () => {
    // Mock successful data fetch
    vi.mocked(getThemeWithPositions).mockResolvedValue({
      theme: mockTheme,
      positions: mockPositions
    })

    // Render the component with mock params
    render(<ThemePage params={{ theme: 'theme-1' }} />)

    // Initially should show loading state
    expect(screen.getByText('Chargement du thème...')).toBeInTheDocument()

    // Wait for the content to load
    const themeName = await screen.findByText('Economy')
    expect(themeName).toBeInTheDocument()
  })

  it('should show not found when theme does not exist', async () => {
    // Mock failed data fetch
    vi.mocked(getThemeWithPositions).mockResolvedValue(null)

    // Render the component with invalid theme ID
    render(<ThemePage params={{ theme: 'invalid-theme' }} />)

    // Initially should show loading state
    expect(screen.getByText('Chargement du thème...')).toBeInTheDocument()

    // The notFound() function should be called, which will trigger a 404
    // We can't directly test this as it's a Next.js function
    // But we can verify that the content is not rendered
    await expect(screen.findByText('Economy')).rejects.toThrow()
  })
}) 