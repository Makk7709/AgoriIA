import { extractPositionsFromText, validateAndEnrichPositions, Position } from '../parse';
import { themes } from '../config';
import { vi, describe, test, it, expect } from 'vitest';

// Mock OpenAI
vi.mock('openai', () => {
  return {
    default: class {
      constructor() {}
      chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    positions: [
                      {
                        title: 'Réduction des impôts des entreprises',
                        description: 'Propose une baisse fiscale pour les entreprises',
                        content: 'Réduction des impôts des entreprises de 10%'
                      },
                      {
                        title: 'Neutralité carbone',
                        description: 'Objectif de neutralité carbone',
                        content: 'Neutralité carbone d\'ici 2050'
                      }
                    ]
                  })
                }
              }
            ]
          })
        }
      }
    }
  }
})

describe('extractPositionsFromText', () => {
  const mockCandidate = { id: 'test-id', name: 'Test Candidate' };

  it('should extract positions from a short text', async () => {
    const text = "Je veux augmenter les impôts de 2%.";
    const positions = await extractPositionsFromText(text, mockCandidate);
    
    expect(positions).toBeInstanceOf(Array);
    expect(positions.length).toBeGreaterThan(0);
    
    positions.forEach((position: Position) => {
      expect(position).toHaveProperty('title');
      expect(position).toHaveProperty('description');
      expect(position).toHaveProperty('content');
      expect(position).toHaveProperty('candidate_id');
      expect(position).toHaveProperty('candidate');
      expect(position.candidate).toEqual(mockCandidate);
    });
  });

  it('should extract positions from a longer text', async () => {
    const text = `
      Je propose plusieurs mesures :
      1. Augmenter les impôts de 2%
      2. Réduire les dépenses publiques
      3. Investir dans l'éducation
    `;
    
    const positions = await extractPositionsFromText(text, mockCandidate);
    
    expect(positions).toBeInstanceOf(Array);
    expect(positions.length).toBeGreaterThan(1);
    
    positions.forEach((position: Position) => {
      expect(position).toHaveProperty('title');
      expect(position).toHaveProperty('description');
      expect(position).toHaveProperty('content');
      expect(position).toHaveProperty('candidate_id');
      expect(position).toHaveProperty('candidate');
      expect(position.candidate).toEqual(mockCandidate);
    });
  });

  it('should handle empty text', async () => {
    const positions = await extractPositionsFromText('', mockCandidate);
    expect(positions).toEqual([]);
  });

  it('should handle text without clear positions', async () => {
    const text = "Bonjour, comment allez-vous aujourd'hui?";
    const positions = await extractPositionsFromText(text, mockCandidate);
    expect(positions).toBeInstanceOf(Array);
  });
});

describe('validateAndEnrichPositions', () => {
  const mockPositions: Position[] = [
    {
      title: "Augmentation des impôts",
      description: "Proposition d'augmenter les impôts de 2%",
      content: "Je veux augmenter les impôts de 2%",
      candidate_id: "test-id",
      candidate: {
        id: "test-id",
        name: "Test Candidate"
      }
    }
  ];

  it('should validate and enrich positions', async () => {
    const enrichedPositions = await validateAndEnrichPositions(mockPositions);
    
    expect(enrichedPositions).toBeInstanceOf(Array);
    expect(enrichedPositions.length).toBe(mockPositions.length);
    
    enrichedPositions.forEach((position: Position) => {
      expect(position).toHaveProperty('title');
      expect(position).toHaveProperty('description');
      expect(position).toHaveProperty('content');
      expect(position).toHaveProperty('candidate_id');
      expect(position).toHaveProperty('candidate');
    });
  });

  it('should handle empty positions array', async () => {
    const enrichedPositions = await validateAndEnrichPositions([]);
    expect(enrichedPositions).toEqual([]);
  });
}); 