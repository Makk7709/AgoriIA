import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../route'
import { supabase } from '@/lib/supabase/config'
import { Position } from '@/lib/types'

// Mock OpenAI
vi.mock('openai', () => {
  return {
    default: class {
      constructor() {}
      chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: 'Test response'
                }
              }
            ]
          })
        }
      }
    }
  }
})

// Mock environment variables
vi.mock('process', () => ({
  env: {
    OPENAI_API_KEY: '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'
  }
}))

// Mock Supabase
vi.mock('@/lib/supabase/config', () => ({
  supabase: {
    from: vi.fn()
  }
}))

describe('POST /api/ask', () => {
  const mockPosition: Position = {
    id: '1',
    theme_id: 'theme-1',
    candidate_id: 'candidate-1',
    content: 'Test Position',
    source_url: 'https://example.com',
    created_at: '2024-01-01T00:00:00Z',
    title: 'Test Position',
    description: 'Test Description',
    candidate: {
      id: 'candidate-1',
      name: 'Test Candidate',
      party: 'Test Party'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a response when theme is provided', async () => {
    // Mock Supabase response
    const mockSupabaseResponse = {
      data: [mockPosition],
      error: null
    }

    const mockSupabaseQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue(mockSupabaseResponse)
    }

    vi.mocked(supabase.from).mockReturnValue(mockSupabaseQuery as any)

    // Create request
    const request = new Request('http://localhost:3000/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: 'Test question',
        theme: 'theme-1'
      })
    })

    // Call the API
    const response = await POST(request)
    const data = await response.json()

    // Verify response
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('response')
    expect(data.response).toBe('Test response')

    // Verify Supabase calls
    expect(supabase.from).toHaveBeenCalledWith('positions')
  })

  it('should handle errors gracefully', async () => {
    // Mock Supabase error
    const mockSupabaseError = {
      data: null,
      error: { message: 'Test error' }
    }

    const mockSupabaseQuery = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue(mockSupabaseError)
    }

    vi.mocked(supabase.from).mockReturnValue(mockSupabaseQuery as any)

    // Create request
    const request = new Request('http://localhost:3000/api/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: 'Test question',
        theme: 'theme-1'
      })
    })

    // Call the API
    const response = await POST(request)
    const data = await response.json()

    // Verify error response
    expect(response.status).toBe(500)
    expect(data).toHaveProperty('error')
    expect(data.error).toBe("Une erreur s'est produite lors du traitement de votre demande.")
  })
}) 