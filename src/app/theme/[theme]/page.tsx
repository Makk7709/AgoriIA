'use client'

import { useState } from "react"
import { ComparisonGrid } from "@/components/ComparisonGrid"
import { ResponseForm } from "@/components/Scoreboard/ResponseForm"
import { Scoreboard } from "@/components/Scoreboard"
import { selectRepresentativePositions } from "@/lib/positions"
import { analyzePositions } from "@/lib/openai/summarize"
import { saveResponse } from "@/lib/supabase/saveResponse"
import { calculateAlignmentScores } from "@/lib/scoring"
import type { Position } from "@/lib/positions"
import type { UserResponses } from "@/components/Scoreboard/ResponseForm"
import { toast } from "sonner"

interface PageProps {
  params: {
    theme: string
  }
}

export default function ThemePage({ params }: PageProps) {
  // TODO: Fetch positions from your API/database
  const positions: Position[] = []
  const [userResponses, setUserResponses] = useState<UserResponses>({})
  const [isSaving, setIsSaving] = useState(false)
  
  // Select 3 representative positions for the questionnaire
  const selectedPositions = selectRepresentativePositions(positions)

  const handleResponseChange = async (responses: UserResponses) => {
    setUserResponses(responses)

    // Ne sauvegarder que s'il y a au moins une réponse
    if (Object.keys(responses).length > 0) {
      setIsSaving(true)
      try {
        const alignmentScores = calculateAlignmentScores(
          selectedPositions,
          positions,
          responses
        )

        const result = await saveResponse({
          themeId: params.theme,
          responses,
          alignmentScores
        })

        if (!result.success) {
          throw new Error(result.error)
        }
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error)
        toast.error("Erreur lors de la sauvegarde de vos réponses")
      } finally {
        setIsSaving(false)
      }
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">
        Thème : {decodeURIComponent(params.theme)}
      </h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Votre opinion</h2>
            <ResponseForm
              selectedPositions={selectedPositions}
              onResponsesChange={handleResponseChange}
            />
            {isSaving && (
              <p className="text-sm text-muted-foreground mt-2">
                Sauvegarde en cours...
              </p>
            )}
          </div>

          {Object.keys(userResponses).length > 0 && (
            <Scoreboard
              positions={positions}
              selectedPositions={selectedPositions}
              userResponses={userResponses}
            />
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Positions des candidats</h2>
          <ComparisonGrid
            positions={positions}
            onAnalyze={async (positionsToAnalyze) => {
              const analysis = await analyzePositions(params.theme, positionsToAnalyze)
              // TODO: Handle analysis results
            }}
            analysis={null}
            isAnalyzing={false}
          />
        </div>
      </div>
    </div>
  )
} 