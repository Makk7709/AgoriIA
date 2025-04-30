import { vi, describe, it, expect, beforeEach } from 'vitest'
import { middleware } from '@/middleware'
import { createClient } from '@supabase/supabase-js'

vi.mock('next/server', () => {
  const NextResponse = {
    redirect: vi.fn((url) => ({
      status: 307,
      headers: new Headers({ Location: url.toString() }),
    })),
    next: vi.fn(),
  }

  class NextRequest {
    constructor(input: string | URL) {
      this.nextUrl = new URL(input)
    }
    nextUrl: URL
    cookies = {
      get: vi.fn(),
      getAll: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    }
    geo = {
      city: '',
      country: '',
      region: '',
      latitude: '',
      longitude: '',
    }
    ip = ''
    ua = ''
  }

  return { NextRequest, NextResponse }
})

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
      getSession: vi.fn(),
    },
  })),
}))

describe('Middleware', () => {
  let mockSupabase: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabase = {
      auth: {
        getUser: vi.fn(),
        getSession: vi.fn(),
      },
    }
    ;(createClient as any).mockReturnValue(mockSupabase)
  })

  it('should allow access to non-protected routes', async () => {
    const req = new (await import('next/server')).NextRequest('http://localhost:3000')
    const res = await middleware(req)
    expect(res).toBeUndefined()
  })

  it('should redirect to login for protected routes without session', async () => {
    const req = new (await import('next/server')).NextRequest('http://localhost:3000/admin')
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    
    const res = await middleware(req)
    expect(res).toBeDefined()
    expect(res?.status).toBe(307)
    expect(res?.headers.get('Location')).toBe('/login')
  })

  it('should use cached session when available', async () => {
    const mockGetUser = vi.fn().mockResolvedValue({
      data: { user: { id: 'test-user' } },
      error: null,
    })
    mockSupabase.auth.getUser = mockGetUser

    const req = new (await import('next/server')).NextRequest('http://localhost:3000/admin')
    const res = await middleware(req)
    
    expect(mockGetUser).toHaveBeenCalled()
  })

  it('should use cached profile when available', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: { id: 'test-user' },
          access_token: 'test-token',
        },
      },
      error: null,
    })

    const req = new (await import('next/server')).NextRequest('http://localhost:3000/admin')
    const res = await middleware(req)
    
    expect(mockSupabase.auth.getSession).toHaveBeenCalled()
  })
}) 