import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.test
config({ path: resolve(__dirname, '../../.env.test') })

// Define required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'PINECONE_API_KEY',
  'PINECONE_ENVIRONMENT',
  'PINECONE_INDEX',
  'OPENAI_API_KEY',
]

// Validate required environment variables
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
})

// Étend les matchers de Vitest avec ceux de jest-dom
expect.extend(matchers)

// Configuration des variables d'environnement pour les tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-supabase-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-supabase-service-role-key'
process.env.PINECONE_API_KEY = 'test-pinecone-key'
process.env.PINECONE_ENVIRONMENT = 'test-env'
process.env.PINECONE_INDEX = 'test-index'
process.env.OPENAI_API_KEY = 'test-openai-key'

// Mock global fetch
global.fetch = vi.fn()

// Mock Next.js
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => '/test',
  notFound: vi.fn(),
}))

// Mock canvas pour les tests d'accessibilité
vi.mock('canvas', () => ({
  createCanvas: vi.fn(),
  getContext: vi.fn(),
}))

// Nettoie après chaque test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
}) 