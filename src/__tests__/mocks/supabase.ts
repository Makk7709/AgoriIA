import { vi } from 'vitest'

// Type pour les données de test
type MockData = Record<string, any>

// Stockage en mémoire pour simuler la base de données
const mockDatabase: Record<string, MockData[]> = {}

// Fonction utilitaire pour créer une réponse Supabase
const createSupabaseResponse = <T>(data: T, error: any = null) => ({
  data,
  error,
  count: null,
  status: error ? 400 : 200,
  statusText: error ? 'ERROR' : 'OK',
})

// Client mock Supabase avec des fonctionnalités avancées
export const mockSupabaseClient = {
  from: vi.fn((table: string) => {
    if (!mockDatabase[table]) {
      mockDatabase[table] = []
    }
    return mockSupabaseClient
  }),

  select: vi.fn((columns = '*') => {
    return mockSupabaseClient
  }),

  insert: vi.fn((data: MockData | MockData[]) => {
    const table = mockSupabaseClient.from.mock.calls[mockSupabaseClient.from.mock.calls.length - 1][0]
    const records = Array.isArray(data) ? data : [data]
    mockDatabase[table].push(...records)
    return Promise.resolve(createSupabaseResponse(records))
  }),

  update: vi.fn((data: MockData) => {
    const table = mockSupabaseClient.from.mock.calls[mockSupabaseClient.from.mock.calls.length - 1][0]
    const records = mockDatabase[table]
    const updatedRecords = records.map(record => ({
      ...record,
      ...data,
    }))
    mockDatabase[table] = updatedRecords
    return Promise.resolve(createSupabaseResponse(updatedRecords))
  }),

  delete: vi.fn(() => {
    const table = mockSupabaseClient.from.mock.calls[mockSupabaseClient.from.mock.calls.length - 1][0]
    mockDatabase[table] = []
    return Promise.resolve(createSupabaseResponse([]))
  }),

  eq: vi.fn((column: string, value: any) => {
    return mockSupabaseClient
  }),

  order: vi.fn((column: string, { ascending = true } = {}) => {
    return mockSupabaseClient
  }),

  single: vi.fn(() => {
    const table = mockSupabaseClient.from.mock.calls[mockSupabaseClient.from.mock.calls.length - 1][0]
    const records = mockDatabase[table]
    return Promise.resolve(createSupabaseResponse(records[0] || null))
  }),

  then: vi.fn((callback) => {
    const table = mockSupabaseClient.from.mock.calls[mockSupabaseClient.from.mock.calls.length - 1][0]
    const records = mockDatabase[table]
    return Promise.resolve(createSupabaseResponse(records)).then(callback)
  }),

  // Méthodes supplémentaires utiles pour les tests
  clearMockData: () => {
    Object.keys(mockDatabase).forEach(key => {
      mockDatabase[key] = []
    })
  },

  setMockData: (table: string, data: MockData[]) => {
    mockDatabase[table] = data
  },

  getMockData: (table: string) => {
    return mockDatabase[table] || []
  },
}

// Mock de createClient
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => mockSupabaseClient,
}))

// Export des types pour TypeScript
export type MockSupabaseClient = typeof mockSupabaseClient 