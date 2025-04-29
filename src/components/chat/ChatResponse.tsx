'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { type ChatResponseContent } from '@/utils/messageUtils'

interface ChatResponseProps {
  response: ChatResponseContent
}

export function ChatResponse({ response }: ChatResponseProps) {
  // Vérification de la structure de la réponse
  if (!response || !response.introduction || !response.analysis || !response.conclusion) {
    console.error('Invalid response structure:', response)
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
        Erreur: La réponse n'est pas dans le bon format
      </div>
    )
  }

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const renderSection = (
    title: string,
    content: string,
    delay: number = 0,
    isItalic: boolean = false
  ) => (
    <motion.div {...fadeIn} transition={{ delay }}>
      <Card className="border-2 border-[#002654]/10 hover:border-[#002654]/20 transition-all bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-serif text-[#002654] flex items-center gap-3">
            <div className="w-1.5 h-8 bg-gradient-to-b from-[#002654] to-[#EF4135] rounded-full" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap">
            <p className={`text-lg text-black leading-relaxed font-serif ${isItalic ? 'italic' : ''}`}>
              {content || 'Aucun contenu disponible'}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      {/* Introduction */}
      {renderSection(response.introduction.title, response.introduction.content)}

      {/* Analyse */}
      <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
        <Card className="border-2 border-[#002654]/10 hover:border-[#002654]/20 transition-all bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-serif text-[#002654] flex items-center gap-3">
              <div className="w-1.5 h-8 bg-gradient-to-b from-[#002654] to-[#EF4135] rounded-full" />
              {response.analysis.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {response.analysis.points.map((point, index) => (
                <div key={index} className="flex gap-4 items-start group">
                  <div className="w-2 h-2 rounded-full bg-[#002654] mt-3 group-hover:bg-[#EF4135] transition-colors" />
                  <div className="flex-1">
                    {point.candidate && (
                      <h4 className="text-xl font-serif font-medium text-[#002654] mb-2">
                        {point.candidate}
                      </h4>
                    )}
                    <div className="whitespace-pre-wrap">
                      <p className="text-lg text-black leading-relaxed font-serif">
                        {point.content || 'Aucun contenu disponible'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Conclusion */}
      {renderSection(response.conclusion.title, response.conclusion.content, 0.4, true)}
    </div>
  )
} 