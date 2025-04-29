import { vi } from 'vitest'
import { mockSupabaseClient } from '@/test/mocks/supabase'

// 👇 MOCK AVANT TOUT
vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabaseClient,
}))

// 👇 MAINTENANT import du composant
import { ChatPanel } from '@/components/ChatPanel'

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { config } from '@/lib/config'
import '@testing-library/jest-dom'

// Mock des dépendances
vi.mock('@/components/ClientOnly', () => ({
  ClientOnly: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
      <div {...props}>{children}</div>
    ),
  },
}))

// Mock de useVirtualizer avec un message
let mockMessages: any[] = []
vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: () => ({
    getVirtualItems: () => mockMessages.map((_, index) => ({
      index,
      key: index,
      size: 25,
      start: index * 25,
      end: (index + 1) * 25,
      measureElement: () => {},
    })),
    measureElement: () => {},
    scrollToIndex: () => {},
    getScrollElement: () => document.createElement('div'),
    options: {
      count: mockMessages.length,
      estimateSize: () => 25,
      getScrollElement: () => document.createElement('div'),
      overscan: 0,
    }
  }),
}))

// Mock de fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ data: 'ok' }),
    headers: new Headers(),
    redirected: false,
    statusText: 'OK',
    type: 'basic',
    url: '',
    clone: () => new Response(),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    formData: () => Promise.resolve(new FormData()),
  } as Response)
)

describe('ChatPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    mockMessages = []

    // Mock des messages Supabase
    mockSupabaseClient.clearMockData()
    mockSupabaseClient.setMockData('messages', [
      { 
        id: '1',
        role: 'assistant',
        content: 'Bienvenue sur AgorIA',
        timestamp: new Date().toISOString()
      }
    ])

    const mockUUID = vi.fn(() => 'test-uuid')
    vi.stubGlobal('crypto', { randomUUID: mockUUID })
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    mockMessages = []
  })

  it('should render initial state correctly', async () => {
    render(<ChatPanel />)
    
    const welcomeMessage = await screen.findByText('Bienvenue sur AgorIA')
    expect(welcomeMessage).toBeInTheDocument()
  })

  it('should handle user input and API response', async () => {
    render(<ChatPanel />)

    const input = screen.getByPlaceholderText('Posez votre question sur les programmes...')
    const form = input.closest('form')!

    // Simuler l'ajout du message avant la soumission
    mockMessages = [{
      id: 'test-uuid',
      content: 'Test response',
      role: 'assistant',
      timestamp: new Date()
    }]

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Test question' } })
      fireEvent.submit(form)
    })

    const responseMessage = await screen.findByText('Test response')
    expect(responseMessage).toBeInTheDocument()
  })

  it('should fetch and display messages from Supabase', async () => {
    render(<ChatPanel />)

    const welcomeMessage = await screen.findByText('Bienvenue sur AgorIA')
    expect(welcomeMessage).toBeInTheDocument()

    // Vérifier que le composant affiche le message mocké
    expect(welcomeMessage).toBeInTheDocument()
  })
}) 