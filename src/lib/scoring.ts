import type { Position } from "./positions"
import type { UserResponses } from "@/components/Scoreboard/ResponseForm"

export interface AlignmentScore {
  candidateName: string
  candidateParty: string
  totalScore: number
  maxPossibleScore: number
  alignmentPercentage: number
}

export function calculateAlignmentScores(
  selectedPositions: Position[],
  allPositions: Position[],
  userResponses: UserResponses
): AlignmentScore[] {
  // Regrouper les positions par candidat
  const positionsByCandidate = new Map<string, Position[]>()
  
  for (const position of allPositions) {
    const key = position.candidate.name
    if (!positionsByCandidate.has(key)) {
      positionsByCandidate.set(key, [])
    }
    positionsByCandidate.get(key)!.push(position)
  }

  // Calculer le score pour chaque candidat
  const scores: AlignmentScore[] = []

  for (const [candidateName, candidatePositions] of positionsByCandidate) {
    let totalScore = 0
    const maxPossibleScore = selectedPositions.length

    // Pour chaque position sélectionnée pour le questionnaire
    for (const selectedPosition of selectedPositions) {
      const userResponse = userResponses[selectedPosition.id]
      if (!userResponse) continue // Ignorer les positions sans réponse

      // Trouver la position correspondante du candidat actuel
      const candidatePosition = candidatePositions.find(p => 
        // Comparer le contenu car les IDs peuvent être différents
        p.content === selectedPosition.content
      )

      if (candidatePosition) {
        // Calculer le score pour cette position
        const score = calculatePositionScore(userResponse, candidatePosition)
        totalScore += score
      }
    }

    // Calculer le pourcentage d'alignement
    const alignmentPercentage = Math.round((totalScore / maxPossibleScore) * 100)

    scores.push({
      candidateName,
      candidateParty: candidatePositions[0].candidate.party,
      totalScore,
      maxPossibleScore,
      alignmentPercentage
    })
  }

  return scores
}

function calculatePositionScore(userResponse: "agree" | "disagree" | "neutral", position: Position): number {
  // Pour l'instant, on considère que la position du candidat est toujours "agree" avec sa propre position
  const candidateResponse = "agree"

  if (userResponse === "neutral") return 0
  if (userResponse === candidateResponse) return 1
  return -1
} 