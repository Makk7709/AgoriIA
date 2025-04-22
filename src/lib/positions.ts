import type { Position } from './types'

export function selectRepresentativePositions(positions: Position[]): Position[] {
  // Ensure we have at least 3 positions
  if (positions.length < 3) {
    return positions
  }

  // For now, we'll use a simple selection strategy:
  // Take positions from different candidates, prioritizing longer content
  // as it might be more detailed/representative
  
  // Sort by content length (descending) to get more detailed positions first
  const sortedPositions = [...positions].sort(
    (a, b) => (b.content?.length || 0) - (a.content?.length || 0)
  )

  // Get positions from different candidates
  const selectedPositions: Position[] = []
  const usedCandidates = new Set<string>()

  for (const position of sortedPositions) {
    if (selectedPositions.length >= 3) break

    // Only add position if we haven't used this candidate yet
    const candidateName = position.candidate_positions?.[0]?.candidate[0]?.name
    if (candidateName && !usedCandidates.has(candidateName)) {
      selectedPositions.push(position)
      usedCandidates.add(candidateName)
    }
  }

  // If we still need more positions, add remaining ones
  if (selectedPositions.length < 3) {
    for (const position of sortedPositions) {
      if (selectedPositions.length >= 3) break
      if (!selectedPositions.includes(position)) {
        selectedPositions.push(position)
      }
    }
  }

  return selectedPositions
} 