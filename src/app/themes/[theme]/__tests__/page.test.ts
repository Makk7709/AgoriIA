import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '@/lib/supabase/config'
import { getThemeWithPositions } from '@/lib/supabase/getThemeWithPositions'

// Mock Supabase client
vi.mock('@/lib/supabase/config', () => ({
  supabase: {
    from: vi.fn()
  }
}))

describe('ThemePage', () => {
  const mockTheme = {
    id: 'theme-1',
    name: 'Economy',
    description: 'Economic policies',
    created_at: '2024-01-01T00:00:00Z'
  }

  const mockPositions = {
    id: 'pos-1',
    theme_id: 'theme-1',
    title: 'Position Title',
    description: 'Position Description',
    source_url: 'http://example.com',
    created_at: '2024-01-01T00:00:00Z',
    candidate_positions: [
      {
        candidate: {
          id: 'cand-1',
          name: 'John Doe',
          party: 'Party A'
        }
      }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch theme and positions correctly', async () => {
    // Mock successful theme fetch
    const mockThemeResponse = {
      data: mockTheme,
      error: null
    }
    
    // Mock successful positions fetch
    const mockPositionsResponse = {
      data: mockPositions,
      error: null
    }

    // Setup Supabase mocks
    let callCount = 0
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => {
        callCount++
        return Promise.resolve(callCount === 1 ? mockThemeResponse : mockPositionsResponse)
      })
    })

    vi.spyOn(supabase, 'from').mockImplementation(mockFrom)

    // Test the function
    const result = await getThemeWithPositions('theme-1')

    // Verify the result
    expect(result).toEqual({
      theme: mockTheme,
      positions: [
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
    })

    // Verify Supabase calls
    expect(mockFrom).toHaveBeenCalledWith('themes')
    expect(mockFrom).toHaveBeenCalledWith('positions')
  })

  it('should handle theme fetch error', async () => {
    // Mock theme fetch error
    const mockThemeError = {
      data: null,
      error: { message: 'Theme not found' }
    }

    // Setup Supabase mock
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue(mockThemeError)
    })

    vi.spyOn(supabase, 'from').mockImplementation(mockFrom)

    // Test the function
    const result = await getThemeWithPositions('invalid-theme')

    // Verify the result
    expect(result).toBeNull()
  })

  it('should handle positions fetch error', async () => {
    // Mock successful theme fetch but failed positions fetch
    const mockThemeResponse = {
      data: mockTheme,
      error: null
    }

    const mockPositionsError = {
      data: null,
      error: { message: 'Positions not found' }
    }

    // Setup Supabase mocks
    let callCount = 0
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => {
        callCount++
        return Promise.resolve(callCount === 1 ? mockThemeResponse : mockPositionsError)
      })
    })

    vi.spyOn(supabase, 'from').mockImplementation(mockFrom)

    // Test the function
    const result = await getThemeWithPositions('theme-1')

    // Verify the result
    expect(result).toBeNull()
  })

  it('should handle empty positions array', async () => {
    // Mock successful theme fetch but empty positions
    const mockThemeResponse = {
      data: mockTheme,
      error: null
    }

    const mockEmptyPositions = {
      data: null,
      error: null
    }

    // Setup Supabase mocks
    let callCount = 0
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => {
        callCount++
        return Promise.resolve(callCount === 1 ? mockThemeResponse : mockEmptyPositions)
      })
    })

    vi.spyOn(supabase, 'from').mockImplementation(mockFrom)

    // Test the function
    const result = await getThemeWithPositions('theme-1')

    // Verify the result
    expect(result).toEqual({
      theme: mockTheme,
      positions: []
    })
  })
}) 