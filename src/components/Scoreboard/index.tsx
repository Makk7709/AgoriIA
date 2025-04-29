import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { calculateAlignmentScores } from "@/lib/scoring"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Feedback } from "./Feedback"
import type { Position } from "@/lib/types"
import type { UserResponses } from "./ResponseForm"
import type { AnsweredPosition } from "@/lib/types"

interface ScoreboardProps {
  positions: Position[]
  selectedPositions: Position[]
  userResponses: UserResponses
}

export function Scoreboard({ positions, selectedPositions, userResponses }: ScoreboardProps) {
  const [scores, setScores] = useState<ReturnType<typeof calculateAlignmentScores>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [answeredPositions, setAnsweredPositions] = useState<AnsweredPosition[]>([])

  // Nettoyer les scores et réponses lors du démontage
  useEffect(() => {
    return () => {
      setScores([])
      setAnsweredPositions([])
      setShowConfirmation(false)
    }
  }, [])

  useEffect(() => {
    // Créer le tableau d'AnsweredPositions
    const newAnsweredPositions = selectedPositions.map(position => ({
      position,
      userResponse: userResponses[position.id] || 'neutral'
    }))
    setAnsweredPositions(newAnsweredPositions)
    
    // Log pour le debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('🧠 Réponses mises à jour:', {
        selectedPositions: selectedPositions.map(p => p.id),
        userResponses,
        answeredPositions: newAnsweredPositions
      })
    }
  }, [selectedPositions, userResponses])

  useEffect(() => {
    async function calculateScores() {
      setLoading(true)
      setError(null)
      try {
        const calculatedScores = calculateAlignmentScores(selectedPositions, positions, userResponses)
        setScores(calculatedScores)
        setShowConfirmation(true)
        setTimeout(() => setShowConfirmation(false), 3000)
      } catch (error) {
        console.error("Erreur lors du calcul des scores:", error)
        setError("Une erreur est survenue lors de l'analyse. Veuillez réessayer plus tard.")
      } finally {
        setLoading(false)
      }
    }

    calculateScores()
  }, [selectedPositions, positions, userResponses])

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Calcul de l'alignement...</h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground">Calcul des scores en cours...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Trier les scores par pourcentage d'alignement décroissant
  const sortedScores = [...scores].sort((a, b) => b.alignmentPercentage - a.alignmentPercentage)

  // Préparer les données pour le composant Feedback
  const candidateScores = Object.fromEntries(
    sortedScores.map(score => [score.candidateName, score.alignmentPercentage])
  )

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Alignement avec les candidats</h2>

      {showConfirmation && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-600">
            🎯 Alignement généré — Vous pouvez consulter vos résultats
          </AlertDescription>
        </Alert>
      )}
      
      {sortedScores.map((score) => (
        <Card key={score.candidateName} className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">
                {score.candidateName}
                <span className="text-sm text-muted-foreground ml-2">
                  {score.candidateParty}
                </span>
              </CardTitle>
              <span className="text-2xl font-bold">
                {score.alignmentPercentage}%
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${score.alignmentPercentage}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Score : {score.totalScore} / {score.maxPossibleScore} points
            </div>
          </CardContent>
        </Card>
      ))}

      <Feedback
        answeredPositions={answeredPositions}
        candidateScores={candidateScores}
      />
    </div>
  )
} 