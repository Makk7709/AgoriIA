import { describe, it, expect } from 'vitest'
import { calculateAlignmentScores } from './scoring'
import type { Position } from './types'
import type { UserResponses } from '@/components/Scoreboard/ResponseForm'

describe('calculateAlignmentScores', () => {
  // Données de test
  const testPositions: Position[] = [
    {
      id: '1',
      theme_id: 'economie',
      candidate_id: 'd317ba86-0298-4bd1-805d-9efbb1b17921',
      content: 'Interdiction des licenciements et augmentation générale des salaires de 300 euros.',
      created_at: '2024-03-21T00:00:00Z',
      candidate: {
        id: 'd317ba86-0298-4bd1-805d-9efbb1b17921',
        name: 'Nathalie Arthaud',
        party: 'Lutte Ouvrière',
        position: 'agree'
      }
    },
    {
      id: '2',
      theme_id: 'economie',
      candidate_id: '8877c59e-a769-453d-9a03-48aa70b7167f',
      content: 'Le programme promet d\'augmenter la prime annuelle défiscalisée et de réduire les impôts sur les successions.',
      created_at: '2024-03-21T00:00:00Z',
      candidate: {
        id: '8877c59e-a769-453d-9a03-48aa70b7167f',
        name: 'Emmanuel Macron',
        party: 'La République En Marche',
        position: 'agree'
      }
    },
    {
      id: '3',
      theme_id: 'ecologie',
      candidate_id: 'd317ba86-0298-4bd1-805d-9efbb1b17921',
      content: 'Planification écologique sous contrôle des travailleurs.',
      created_at: '2024-03-21T00:00:00Z',
      candidate: {
        id: 'd317ba86-0298-4bd1-805d-9efbb1b17921',
        name: 'Nathalie Arthaud',
        party: 'Lutte Ouvrière',
        position: 'agree'
      }
    }
  ]

  const testUserResponses: UserResponses = {
    '1': 'agree',
    '2': 'disagree',
    '3': 'agree'
  }

  it('should calculate correct alignment scores', () => {
    const scores = calculateAlignmentScores(testPositions, testPositions, testUserResponses)
    
    // Vérifier que nous avons des scores pour chaque candidat
    expect(scores.length).toBe(2)
    
    // Vérifier les scores de Nathalie Arthaud
    const arthaudScore = scores.find(s => s.candidateName === 'Nathalie Arthaud')
    expect(arthaudScore).toBeDefined()
    expect(arthaudScore?.alignmentPercentage).toBe(100) // 2 positions sur 2 en accord
    
    // Vérifier les scores d'Emmanuel Macron
    const macronScore = scores.find(s => s.candidateName === 'Emmanuel Macron')
    expect(macronScore).toBeDefined()
    expect(macronScore?.alignmentPercentage).toBe(0) // 1 position en désaccord
  })

  it('should handle neutral responses correctly', () => {
    const neutralResponses: UserResponses = {
      '1': 'neutral',
      '2': 'neutral',
      '3': 'neutral'
    }

    const scores = calculateAlignmentScores(testPositions, testPositions, neutralResponses)
    
    // Vérifier que tous les scores sont à 50% pour des réponses neutres
    scores.forEach(score => {
      expect(score.alignmentPercentage).toBe(50)
    })
  })

  it('should handle mixed responses correctly', () => {
    const mixedResponses: UserResponses = {
      '1': 'agree',
      '2': 'disagree',
      '3': 'neutral'
    }

    const scores = calculateAlignmentScores(testPositions, testPositions, mixedResponses)
    
    // Vérifier les scores de Nathalie Arthaud (1 accord, 1 neutre)
    const arthaudScore = scores.find(s => s.candidateName === 'Nathalie Arthaud')
    expect(arthaudScore?.alignmentPercentage).toBe(75) // (1 + 0.5) / 2 * 100
    
    // Vérifier les scores d'Emmanuel Macron (1 désaccord)
    const macronScore = scores.find(s => s.candidateName === 'Emmanuel Macron')
    expect(macronScore?.alignmentPercentage).toBe(0)
  })

  it('should handle missing responses', () => {
    const incompleteResponses: UserResponses = {
      '1': 'agree',
      // '2' manquant
      '3': 'agree'
    }

    const scores = calculateAlignmentScores(testPositions, testPositions, incompleteResponses)
    
    // Vérifier que les scores sont calculés uniquement sur les réponses fournies
    const arthaudScore = scores.find(s => s.candidateName === 'Nathalie Arthaud')
    expect(arthaudScore?.alignmentPercentage).toBe(100) // 2 positions sur 2 en accord
  })

  it('should ensure scores are bounded between 0 and 100', () => {
    const extremeResponses: UserResponses = {
      '1': 'agree',
      '2': 'agree',
      '3': 'agree'
    }

    const scores = calculateAlignmentScores(testPositions, testPositions, extremeResponses)
    
    scores.forEach(score => {
      expect(score.alignmentPercentage).toBeGreaterThanOrEqual(0)
      expect(score.alignmentPercentage).toBeLessThanOrEqual(100)
    })
  })
}) 