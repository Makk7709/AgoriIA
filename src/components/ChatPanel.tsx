"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Send, Flag } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'assistant' | 'user'
  timestamp: Date
}

const INITIAL_SUGGESTIONS = [
  "Quels candidats soutiennent le RIC ?",
  "Comparez les positions sur la transition écologique",
  "Expliquez-moi les différentes propositions sur le pouvoir d'achat"
]

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      console.log('Sending request to API with:', { question: content, theme: 'general' })
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: content,
          theme: 'general'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        throw new Error(errorData.error || 'Failed to get response')
      }

      const data = await response.json()
      console.log('API Response:', data)
      
      // Add assistant message
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      }
      console.log('Adding assistant message:', assistantMessage)
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      // Add error message
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.",
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[800px] w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-[#002654]/10">
      {/* Header */}
      <div className="flex items-center gap-3 p-6 border-b border-[#002654]/10 bg-gradient-to-r from-[#002654] via-[#002654]/90 to-[#EF4135] text-white rounded-t-xl">
        <Flag className="h-6 w-6" />
        <h2 className="text-2xl font-serif font-bold">Assistant Citoyen</h2>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-serif font-bold text-[#002654]">
                Bienvenue sur AgorIA
              </h2>
              <p className="text-[#002654]/90 max-w-2xl font-serif text-lg leading-relaxed">
                Je suis votre assistant citoyen, au service de la démocratie. Je peux vous aider à comprendre les positions des candidats sur différents sujets.
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full max-w-2xl">
              <p className="text-base font-bold text-[#002654] uppercase tracking-wider text-center mb-4">
                Questions suggérées
              </p>
              <div className="grid gap-4">
                {INITIAL_SUGGESTIONS.map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    className="w-full text-left font-serif text-lg py-6 px-8 bg-white hover:bg-gradient-to-r hover:from-[#002654] hover:to-[#EF4135] text-[#002654] hover:text-white transition-all duration-300 border border-[#002654]/20 hover:border-transparent rounded-xl"
                    onClick={() => handleSubmit(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-xl p-6 font-serif text-lg leading-relaxed transition-all duration-300",
                message.role === 'user'
                  ? 'bg-gradient-to-r from-[#002654] to-[#002654]/90 text-white shadow-lg hover:shadow-xl'
                  : 'bg-white border-2 border-[#002654]/20 text-black shadow hover:shadow-lg'
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border-2 border-[#002654]/20 rounded-xl p-6 shadow">
              <div className="flex space-x-3">
                <div className="w-3 h-3 bg-[#002654] rounded-full animate-bounce" />
                <div className="w-3 h-3 bg-white border-2 border-[#002654] rounded-full animate-bounce delay-100" />
                <div className="w-3 h-3 bg-[#EF4135] rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input container */}
      <div className="border-t border-[#002654]/10 bg-white/95 p-6 rounded-b-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(input)
          }}
          className="flex gap-4"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question sur les programmes..."
            className="min-h-[60px] max-h-[200px] font-serif text-lg text-black bg-white border-2 border-[#002654]/20 focus:border-[#002654] focus:ring-2 focus:ring-[#002654]/20 resize-none rounded-xl px-4 py-3 transition-all duration-300"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(input)
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-[#002654] to-[#EF4135] hover:from-[#001b3b] hover:to-[#d93a2f] text-white px-8 rounded-xl shadow hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            onClick={() => handleSubmit(input)}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
} 