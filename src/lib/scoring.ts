import type { Position } from "./types"
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
  try {
    // Vérifier les entrées
    if (!selectedPositions?.length || !allPositions?.length || !userResponses) {
      console.warn("Données manquantes pour le calcul des scores")
      return []
    }

    // Regrouper les positions par candidat
    const positionsByCandidate = new Map<string, Position[]>()
    
    for (const position of allPositions) {
      if (!position.candidate?.id) {
        console.warn(`Position sans ID candidat: ${position.id}`)
        continue
      }

      const key = position.candidate.id
      if (!positionsByCandidate.has(key)) {
        positionsByCandidate.set(key, [])
      }
      positionsByCandidate.get(key)!.push(position)
    }

    // Calculer le score pour chaque candidat
    const scores: AlignmentScore[] = []

    for (const [candidateId, candidatePositions] of positionsByCandidate) {
      let totalScore = 0
      let answeredPositions = 0

      // Pour chaque position sélectionnée pour le questionnaire
      for (const selectedPosition of selectedPositions) {
        const userResponse = userResponses[selectedPosition.id]
        if (!userResponse) {
          console.warn(`Réponse manquante pour la position: ${selectedPosition.id}`)
          continue
        }

        // Trouver la position correspondante du candidat actuel
        const candidatePosition = candidatePositions.find(p => 
          p.content === selectedPosition.content
        )

        if (candidatePosition) {
          // Calculer le score pour cette position
          const score = calculatePositionScore(userResponse, candidatePosition)
          totalScore += score
          answeredPositions++
        }
      }

      // Calculer le pourcentage d'alignement
      const alignmentPercentage = answeredPositions > 0 
        ? Math.min(100, Math.max(0, Math.round((totalScore / answeredPositions) * 100)))
        : 0

      // Log pour le debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('🧮 Score calculé pour', candidatePositions[0].candidate.name, ':', {
          totalScore,
          answeredPositions,
          alignmentPercentage
        })
      }

      scores.push({
        candidateName: candidatePositions[0].candidate.name,
        candidateParty: candidatePositions[0].candidate.party,
        totalScore,
        maxPossibleScore: answeredPositions,
        alignmentPercentage
      })
    }

    return scores
  } catch (error) {
    console.error("Erreur lors du calcul des scores:", error)
    return []
  }
}

function calculatePositionScore(userResponse: "agree" | "disagree" | "neutral", position: Position): number {
  // Récupérer la position du candidat depuis la table candidate_positions
  const candidateResponse = position.candidate?.position || "agree"

  // Cas neutre : retourne 0.5 point
  if (userResponse === "neutral") return 0.5
  
  // Cas d'accord : retourne 1 point
  if (userResponse === candidateResponse) return 1
  
  // Cas de désaccord : retourne 0 point
  return 0
} 