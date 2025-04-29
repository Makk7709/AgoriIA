import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { middleware } from '@/middleware'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Mock Next.js
vi.mock('next/server', () => ({
  NextResponse: {
    redirect: vi.fn((url) => new Response(null, { 
      status: 307,
      headers: { location: url }
    })),
    next: vi.fn(() => new Response()),
  },
}))

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({
        data: [{ role: 'user' }],
        error: null,
      }),
    })),
  })),
}))

describe('Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should allow access to non-protected routes', async () => {
    const req = new NextRequest(new URL('http://localhost:3000'))
    const res = await middleware(req)
    expect(res).toBeUndefined()
  })

  it('should redirect to login for protected routes without session', async () => {
    const req = new NextRequest(new URL('http://localhost:3000/admin'))
    const res = await middleware(req)
    
    expect(res?.status).toBe(307)
    expect(res?.headers.get('location')).toContain('/login')
  })

  it('should use cached session when available', async () => {
    const mockSupabase = createClient('test', 'test')
    const mockGetUser = vi.fn().mockResolvedValue({
      data: { user: { id: 'test-user' } },
      error: null,
    })
    mockSupabase.auth.getUser = mockGetUser

    const req = new NextRequest(new URL('http://localhost:3000/admin'))
    const res = await middleware(req)

    expect(mockGetUser).toHaveBeenCalled()
  })

  it('should use cached profile when available', async () => {
    const mockSupabase = createClient('test', 'test')
    const mockSelect = vi.fn().mockResolvedValue({
      data: [{ role: 'admin' }],
      error: null,
    })
    mockSupabase.from = vi.fn().mockReturnValue({
      select: mockSelect,
    })

    const req = new NextRequest(new URL('http://localhost:3000/admin'))
    const res = await middleware(req)

    expect(mockSelect).toHaveBeenCalled()
  })
}) 