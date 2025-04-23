export interface Position {
  id: string
  theme_id: string
  candidate_id: string
  content: string
  source_url: string | null
  created_at: string
  candidate: {
    id: string
    name: string
    party: string
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
  party: string
  bio: string | null
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