export interface Position {
  id: string
  theme_id: string
  candidate_id: string
  content: string
  source_url: string | null
  created_at: string
  candidate: {
    name: string
    party: string
  }
}

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
    (a, b) => b.content.length - a.content.length
  )

  // Get positions from different candidates
  const selectedPositions: Position[] = []
  const usedCandidates = new Set<string>()

  for (const position of sortedPositions) {
    if (selectedPositions.length >= 3) break

    // Only add position if we haven't used this candidate yet
    if (!usedCandidates.has(position.candidate.name)) {
      selectedPositions.push(position)
      usedCandidates.add(position.candidate.name)
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