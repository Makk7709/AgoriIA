import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

// Configuration des variables d'environnement pour les tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test'
process.env.PINECONE_API_KEY = 'test-pinecone-key'
process.env.PINECONE_ENVIRONMENT = 'test-env'
process.env.PINECONE_INDEX = 'test-index'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.config.{ts,js}',
      ],
    },
    testTimeout: 60000,
    hookTimeout: 60000,
    teardownTimeout: 60000,
    maxConcurrency: 1,
    environmentOptions: {
      jsdom: {
        resources: 'usable',
        features: {
          canvas: true,
          fetch: true,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}) 