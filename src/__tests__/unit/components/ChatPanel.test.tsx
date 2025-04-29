import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ChatPanel } from '../../../components/ChatPanel'
import { act } from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { config } from '../../../lib/config'
import { mockSupabaseClient } from '../../mocks/supabase'
import { PostgrestResponse } from '@supabase/supabase-js'
import type { ReactNode } from 'react'

// Mock des dépendances
vi.mock('../../../components/ClientOnly', () => ({
  ClientOnly: ({ children }: { children: ReactNode }) => children,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: ReactNode; [key: string]: any }) => (
      <div {...props}>{children}</div>
    ),
  },
}))

// Mock de useVirtualizer avec un message
vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: vi.fn(() => ({
    getVirtualItems: vi.fn().mockReturnValue([
      { index: 0, start: 0, end: 100, size: 100, measureElement: () => {} },
    ]),
    getScrollElement: () => null,
    measureElement: () => {},
    count: 0,
    estimateSize: () => 100,
    overscan: 5,
    scrollToIndex: () => {},
  })),
}))

describe('ChatPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()

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

    mockSupabaseClient.clearMockData()
    mockSupabaseClient.setMockData('ma_table', [
      { id: 1, nom: 'Test' }
    ])
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('should render initial state correctly', async () => {
    render(<ChatPanel />)
    await act(async () => {
      await vi.runAllTimersAsync()
    })
    expect(screen.getByText('Bienvenue sur AgorIA')).toBeInTheDocument()
  })

  it('should handle user input and API response', async () => {
    render(<ChatPanel />)

    const input = screen.getByPlaceholderText('Posez votre question sur les programmes...')
    const form = input.closest('form')!
    expect(input).toBeEnabled()

    // Remplissage et envoi
    await act(() => Promise.resolve(fireEvent.change(input, { target: { value: 'Test question' } })))
    await act(() => Promise.resolve(fireEvent.submit(form)))

    // Timers : simulate delay / debounce
    await act(async () => {
      vi.advanceTimersByTime(1000)
      await vi.runAllTimersAsync()
    })

    // 🔍 Affiche l'état réel du DOM pour diagnostic
    screen.debug()

    // Recherche avec timeout allongé pour observation
    const response = await screen.findByText(
      (content) => content.includes('Test response'),
      {},
      { timeout: 5000 }
    )

    expect(response).toBeInTheDocument()
  })

  it('devrait récupérer les données', async () => {
    const result = await mockSupabaseClient
      .from('ma_table')
      .select()
      .then((data: PostgrestResponse<any>) => data)
    
    expect(result.data).toHaveLength(1)
  })
})

// Example usage:
const url = config.supabase.url
const openaiApiKey = config.openai.apiKey; 