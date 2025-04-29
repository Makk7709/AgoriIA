'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ChatResponse } from '@/components/chat/ChatResponse'
import { formatChatResponse } from '@/lib/utils/formatChatResponse'
import { type ChatResponseContent } from '@/utils/messageUtils'
import { StructuredData } from '@/components/StructuredData'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

export default function Home() {
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState<ChatResponseContent | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return

    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() })
      })

      if (!res.ok) throw new Error('Failed to get response')

      const data = await res.json()
      const formattedResponse = formatChatResponse(data)
      setResponse(formattedResponse)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Une erreur est survenue')
      setResponse(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <StructuredData
        type="WebPage"
        name="AgorIA - Votre assistant citoyen"
        description="Comparez les programmes politiques et analysez les positions des candidats avec l'aide de l'IA."
        url="https://agoria.app"
      />
      <main className="min-h-screen bg-gradient-to-br from-white to-[#002654]/5">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          {/* En-tête */}
          <div className="text-center space-y-4">
            <h1 className="text-8xl md:text-[12rem] font-bold tracking-tight font-serif relative group mx-auto mb-8">
              <span className="bg-gradient-to-r from-[#002654] via-[#003366] to-[#EF4135] bg-clip-text text-transparent drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] relative z-10">
                AgorIA
              </span>
              <div className="absolute -bottom-2 left-1/2 w-1/3 h-0.5 bg-gradient-to-r from-[#002654] via-[#003366] to-[#EF4135] transform -translate-x-1/2 scale-x-100 group-hover:scale-x-75 transition-transform duration-300 opacity-50 z-0"></div>
            </h1>
            <div className="space-y-2">
              <p className="text-2xl md:text-3xl text-[#002654] font-serif italic">
                Votre assistant citoyen intelligent
              </p>
              <p className="text-xl md:text-2xl text-[#002654] font-serif tracking-wider">
                Liberté • Égalité • Fraternité
              </p>
            </div>
          </div>

          {/* Zone de chat */}
          <div className="w-full max-w-4xl mx-auto backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Posez votre question sur les programmes et les candidats..."
                  className="w-full p-6 pr-32 rounded-xl border-2 border-[#002654]/20 focus:border-[#002654] focus:ring-2 focus:ring-[#002654]/20 outline-none transition-all text-xl font-serif text-[#002654] bg-white placeholder:text-[#002654]/60 placeholder:font-serif placeholder:italic"
                  autoComplete="off"
                  spellCheck="false"
                />
                <button
                  type="submit"
                  disabled={isLoading || !question.trim()}
                  className="absolute right-3 top-3 p-4 rounded-lg bg-gradient-to-r from-[#002654] via-white to-[#EF4135] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 group shadow-md hover:shadow-lg"
                  aria-label={isLoading ? 'Analyse en cours...' : 'Envoyer la question'}
                >
                  <PaperAirplaneIcon 
                    className={`h-7 w-7 text-[#002654] drop-shadow-sm transform -rotate-45 transition-transform duration-200 ${isLoading ? 'animate-pulse' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`}
                  />
                </button>
              </div>
            </form>

            {/* Message d'erreur */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                {error}
              </div>
            )}

            {/* Réponses */}
            {response && (
              <div className="mt-8">
                <ChatResponse response={response} />
              </div>
            )}
          </div>

          {/* Valeurs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="group rounded-xl border border-[#002654]/10 px-6 py-5 transition-all hover:border-[#002654] hover:shadow-lg hover:bg-white/50 backdrop-blur-sm">
              <h2 className="mb-3 text-2xl font-semibold font-serif text-[#002654]">
                Objectif
              </h2>
              <p className="text-black">
                Faciliter la compréhension des enjeux politiques pour tous les citoyens.
              </p>
            </div>

            <div className="group rounded-xl border border-[#002654]/10 px-6 py-5 transition-all hover:border-[#002654] hover:shadow-lg hover:bg-white/50 backdrop-blur-sm">
              <h2 className="mb-3 text-2xl font-semibold font-serif text-[#002654]">
                Neutralité
              </h2>
              <p className="text-black">
                Une analyse objective et impartiale des programmes politiques.
              </p>
            </div>

            <div className="group rounded-xl border border-[#002654]/10 px-6 py-5 transition-all hover:border-[#002654] hover:shadow-lg hover:bg-white/50 backdrop-blur-sm">
              <h2 className="mb-3 text-2xl font-semibold font-serif text-[#002654]">
                Innovation
              </h2>
              <p className="text-black">
                L'IA au service de la démocratie et de la participation citoyenne.
              </p>
            </div>

            <div className="group rounded-xl border border-[#002654]/10 px-6 py-5 transition-all hover:border-[#002654] hover:shadow-lg hover:bg-white/50 backdrop-blur-sm">
              <h2 className="mb-3 text-2xl font-semibold font-serif text-[#002654]">
                Accessibilité
              </h2>
              <p className="text-black">
                Une interface simple et intuitive pour tous les utilisateurs.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
