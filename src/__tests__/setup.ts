import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Étend les matchers de Vitest avec ceux de jest-dom
expect.extend(matchers)

// Configuration globale pour les tests
vi.setConfig({
  testTimeout: 10000,
  hookTimeout: 10000,
})

// Nettoie après chaque test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  vi.clearAllTimers()
}) 