'use client'

import { useState } from 'react'
import { createCandidate } from '@/lib/supabase/candidates'
import { toast } from 'sonner'

export function CreateCandidateForm() {
  const [name, setName] = useState('')
  const [party, setParty] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validation des données
      if (!name.trim()) {
        throw new Error('Le nom du candidat est requis')
      }
      if (!party.trim()) {
        throw new Error('Le parti politique est requis')
      }

      // Log des données avant l'appel
      console.log('Tentative de création du candidat:', {
        name: name.trim(),
        party: party.trim(),
        timestamp: new Date().toISOString()
      })

      const candidate = await createCandidate(name.trim(), party.trim())
      
      // Log du succès
      console.log('Candidat créé avec succès:', {
        candidate,
        timestamp: new Date().toISOString()
      })

      toast.success('Candidat créé avec succès')
      setName('')
      setParty('')
    } catch (error) {
      // Log détaillé de l'erreur
      console.error('Erreur lors de la création du candidat:', {
        error,
        name: name.trim(),
        party: party.trim(),
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      })

      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Une erreur est survenue lors de la création du candidat'
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Créer un nouveau candidat</h2>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom du candidat
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="party" className="block text-sm font-medium text-gray-700">
            Parti politique
          </label>
          <input
            type="text"
            id="party"
            value={party}
            onChange={(e) => setParty(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Création en cours...
            </span>
          ) : (
            'Créer le candidat'
          )}
        </button>
      </form>
    </div>
  )
} 