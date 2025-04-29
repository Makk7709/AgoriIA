import { render, screen, fireEvent } from '@testing-library/react'
import { ChatPanel } from '@/components/ChatPanel'
import { act } from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

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

describe('ChatPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    mockMessages = []

    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          response: {
            role: 'assistant',
            content: 'Test response',
            id: 'test-response-id'
          },
          suggestions: ['Quels candidats soutiennent le RIC ?'],
        }),
      })
    )

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

  it('should render initial state correctly', () => {
    render(<ChatPanel />)
    expect(screen.getByText('Bienvenue sur AgorIA')).toBeInTheDocument()
  })

  it('should handle user input and API response', async () => {
    render(<ChatPanel />)
    const input = screen.getByPlaceholderText('Posez votre question sur les programmes...')
    const form = input.closest('form')!

    // Simuler l'ajout du message avant la soumission pour éviter les délais
    mockMessages = [{
      id: 'test-uuid',
      content: 'Test response',
      role: 'assistant',
      timestamp: new Date()
    }]

    // Combiner toutes les opérations en une seule pour réduire les temps d'attente
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Test question' } })
      fireEvent.submit(form)
      // Réduire encore le temps de debounce
      vi.advanceTimersByTime(10)
      await vi.runAllTimersAsync()
    })

    // Vérifier que le message est affiché
    expect(screen.getByText('Test response')).toBeInTheDocument()
  })
}) 