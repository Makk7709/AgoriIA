import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateAlignmentScores } from "@/lib/scoring"
import type { Position } from "@/lib/positions"
import type { UserResponses } from "./ResponseForm"

interface ScoreboardProps {
  positions: Position[]
  selectedPositions: Position[]
  userResponses: UserResponses
}

export function Scoreboard({ positions, selectedPositions, userResponses }: ScoreboardProps) {
  const scores = calculateAlignmentScores(selectedPositions, positions, userResponses)
  
  // Trier les scores par pourcentage d'alignement décroissant
  const sortedScores = [...scores].sort((a, b) => b.alignmentPercentage - a.alignmentPercentage)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Alignement avec les candidats</h2>
      
      {sortedScores.map((score) => (
        <Card key={score.candidateName}>
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
            <div className="w-full bg-secondary h-2 rounded-full">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${score.alignmentPercentage}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Score : {score.totalScore} / {score.maxPossibleScore} points
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 