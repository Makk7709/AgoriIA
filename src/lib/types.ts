export interface Position {
  id: string
  theme_id: string
  candidate_id: string
  content: string
  source_url: string | null
  title: string | null
  description: string | null
  created_at: string
  candidate: Candidate
  candidate_positions?: {
    position: 'agree' | 'disagree' | 'neutral'
    explanation: string | null
  }
}

export interface PositionWithCandidate extends Omit<Position, 'candidate'> {
  candidate: {
    id: string
    name: string
    party: string
  }
}

export interface Theme {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Candidate {
  id: string
  name: string
  party: string | null
  created_at: string
}

export interface CandidatePosition {
  id: string
  position_id: string
  candidate_id: string
  position: 'agree' | 'disagree' | 'neutral'
  explanation: string | null
  created_at: string
}

export interface UserResponses {
  [positionId: string]: 'agree' | 'disagree' | 'neutral'
}

export interface AnsweredPosition {
  position: Position
  userResponse: 'agree' | 'disagree' | 'neutral'
}

export interface AIAnalysis {
  closestCandidate: string
  agreementAreas: string[]
  disagreementAreas: string[]
  explorationAdvice: string
} 