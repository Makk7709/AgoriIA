import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Set environment variables for tests
process.env.OPENAI_API_KEY = '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'
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://exbzpsrzfknmcdrhjwrs.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4Ynpwc3J6ZmtubWNkcmhqd3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNDkyNzQsImV4cCI6MjA2MDkyNTI3NH0.VX9TmgdJIZeeoFY0cE5XZeMjxTga1Rvx5bMd4dl-5DM'

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
}) 