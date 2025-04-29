import { formatDate } from '@/lib/utils'
import { AIAnalysis } from '@/components/AIAnalysis'
import { type AIAnalysis as AIAnalysisType } from '@/lib/openai/summarize'
import { Button } from '@/components/ui/button'
import { BarChart2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Position } from '@/lib/types'

interface ComparisonGridProps {
  positions: Position[]
  onAnalyze: (positions: Position[]) => void
  analysis: AIAnalysisType | null
  isAnalyzing: boolean
}

export function ComparisonGrid({ 
  positions, 
  onAnalyze, 
  analysis, 
  isAnalyzing 
}: ComparisonGridProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button 
          onClick={() => onAnalyze(positions)}
          disabled={isAnalyzing}
          className={cn(
            "transition-all duration-200 ease-in-out",
            "hover:scale-105",
            "flex items-center gap-2"
          )}
          aria-label="Analyser les positions des candidats"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyse en cours...
            </>
          ) : (
            <>
              <BarChart2 className="h-4 w-4" />
              Analyser les positions
            </>
          )}
        </Button>
      </div>

      <AIAnalysis analysis={analysis} isLoading={isAnalyzing} />

      <div className="grid gap-6">
        {positions.map((position) => (
          <div
            key={position.id}
            className="bg-white shadow overflow-hidden sm:rounded-lg"
          >
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {position.candidate.name}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {position.candidate.party}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <div className="prose max-w-none">
                  <div className="text-sm text-gray-900 space-y-4">
                    <p className="whitespace-pre-wrap">{position.content}</p>
                    
                    {position.source_url && (
                      <p className="text-sm text-gray-500">
                        Source :{' '}
                        <a
                          href={position.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-500"
                        >
                          Lien vers la source
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Dernière mise à jour : {formatDate(position.created_at)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 