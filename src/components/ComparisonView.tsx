'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn, sanitizePositionContent, logContentDebug } from '@/lib/utils'
import type { Position, Theme, Candidate } from '@/lib/types'

interface ComparisonViewProps {
  theme: Theme
  positions: Position[]
  candidates: Candidate[]
  className?: string
}

export function ComparisonView({ theme, positions, candidates, className }: ComparisonViewProps) {
  // Regrouper les positions par candidat
  const positionsByCandidate = positions.reduce((acc, position) => {
    const candidate = candidates.find(c => c.id === position.candidate_id)
    if (candidate) {
      if (!acc[candidate.id]) {
        acc[candidate.id] = {
          candidate,
          positions: []
        }
      }
      acc[candidate.id].positions.push(position)
    }
    return acc
  }, {} as Record<string, { candidate: Candidate, positions: Position[] }>)

  return (
    <div className={cn('space-y-8', className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h1 className="text-4xl font-bold font-serif tracking-tight text-[#002654] sm:text-5xl mb-4">
          {theme.name}
        </h1>
        {theme.description && (
          <p className="mt-2 text-xl text-[#002654]/80 font-serif">
            {theme.description}
          </p>
        )}
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.values(positionsByCandidate).map(({ candidate, positions }) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="h-full bg-white/80 backdrop-blur-sm border-2 border-[#002654]/10 hover:border-[#002654]/30 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-6">
                    <Avatar className="h-16 w-16 border-2 border-[#002654]/10">
                      <AvatarFallback className="bg-gradient-to-br from-[#002654] to-[#EF4135] text-white text-xl">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-semibold text-[#002654]">
                        {candidate.name}
                      </h2>
                      <Badge variant="outline" className="mt-1 bg-[#002654]/5 text-[#002654]">
                        {candidate.party}
                      </Badge>
                    </div>
                  </div>

                  <Tabs defaultValue="positions" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="positions" className="flex-1">Positions</TabsTrigger>
                      <TabsTrigger value="analysis" className="flex-1">Résumé</TabsTrigger>
                    </TabsList>
                    <TabsContent value="positions" className="mt-4 space-y-4">
                      {positions.map((position) => {
                        // Nettoyer le contenu avant l'affichage
                        const cleanContent = sanitizePositionContent(position.content);
                        logContentDebug(cleanContent, `ComparisonView-${position.id}`);

                        return (
                          <div key={position.id} className="prose max-w-none">
                            {position.title && (
                              <h3 className="text-lg font-semibold text-[#002654] mb-2">
                                {position.title}
                              </h3>
                            )}
                            <p className="text-[#002654]/80 whitespace-pre-wrap">
                              {cleanContent}
                            </p>
                            {position.source_url && (
                              <a
                                href={position.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-flex items-center text-sm text-[#002654]/60 hover:text-[#002654] transition-colors"
                              >
                                Source
                                <svg
                                  className="ml-1 h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </TabsContent>
                    <TabsContent value="analysis" className="mt-4">
                      <div className="prose max-w-none">
                        <h3 className="text-lg font-semibold text-[#002654] mb-4">Points clés</h3>
                        <ul className="space-y-4">
                          {positions.map(position => {
                            const cleanContent = sanitizePositionContent(position.description || position.content);
                            logContentDebug(cleanContent, `ComparisonView-Analysis-${position.id}`);
                            return (
                              <li key={position.id} className="text-[#002654]/80">
                                {cleanContent}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
} 