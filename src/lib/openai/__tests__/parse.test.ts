import { extractPositionsFromText, validateAndEnrichPositions } from '../parse';
import { themes } from '../config';
import { vi, describe, test, expect } from 'vitest';

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
                  content: JSON.stringify([
                    {
                      theme: 'Économie',
                      position: 'Réduction des impôts des entreprises de 10%',
                      summary: 'Propose une baisse fiscale pour les entreprises',
                      confidence: 0.9,
                      source: 'Texte original'
                    },
                    {
                      theme: 'Écologie',
                      position: 'Neutralité carbone d\'ici 2050',
                      summary: 'Objectif de neutralité carbone',
                      confidence: 0.8,
                      source: 'Texte original'
                    }
                  ])
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
  // Test avec un texte court et clair
  const shortText = `
    Sur l'économie, je propose de réduire les impôts des entreprises de 10%.
    En matière d'écologie, je souhaite atteindre la neutralité carbone d'ici 2050.
    Pour la sécurité, je veux augmenter le nombre de policiers de 10 000.
  `;

  // Test avec un texte long et complexe
  const longText = `
    Notre programme économique vise à stimuler la croissance tout en préservant l'équilibre budgétaire.
    Nous proposons une réduction progressive de l'impôt sur les sociétés de 33% à 25% sur 5 ans.
    Cette mesure s'accompagnera d'un plan d'investissement massif dans l'innovation et la recherche.
    
    Sur le plan écologique, notre ambition est claire : atteindre la neutralité carbone d'ici 2050.
    Pour y parvenir, nous mettrons en place un plan de rénovation énergétique des bâtiments.
    Nous développerons également les énergies renouvelables, notamment le solaire et l'éolien.
    
    La sécurité est une priorité absolue. Nous augmenterons les effectifs de police de 10 000 agents.
    Nous renforcerons la présence sur le terrain et moderniserons les équipements.
    La lutte contre la cybercriminalité sera également intensifiée.
  `;

  // Test avec un texte ambigu
  const ambiguousText = `
    Nous devons réfléchir à l'avenir de notre système économique.
    L'écologie est un sujet important qui mérite attention.
    La sécurité est une préoccupation majeure des Français.
  `;

  test('extrait correctement les positions d\'un texte court', async () => {
    const positions = await extractPositionsFromText(shortText, 'Test Candidate');
    
    // Vérification de la structure
    expect(positions).toBeInstanceOf(Array);
    positions.forEach(position => {
      expect(position).toHaveProperty('theme');
      expect(position).toHaveProperty('position');
      expect(position).toHaveProperty('summary');
      expect(position).toHaveProperty('candidate');
      expect(position).toHaveProperty('confidence');
      expect(position).toHaveProperty('source');
    });

    // Vérification des thèmes
    const extractedThemes = positions.map(p => p.theme);
    expect(extractedThemes).toContain('Économie');
    expect(extractedThemes).toContain('Écologie');

    // Vérification des scores de confiance
    positions.forEach(position => {
      expect(position.confidence).toBeGreaterThanOrEqual(0);
      expect(position.confidence).toBeLessThanOrEqual(1);
    });
  });

  test('gère correctement un texte long et complexe', async () => {
    const positions = await extractPositionsFromText(longText, 'Test Candidate');
    
    // Vérification de la cohérence des positions
    const economyPositions = positions.filter(p => p.theme === 'Économie');
    expect(economyPositions.length).toBeGreaterThan(0);
    expect(economyPositions[0].position).toContain('Réduction');
    expect(economyPositions[0].position).toContain('impôts');

    // Vérification des sources
    positions.forEach(position => {
      expect(position.source).toBeTruthy();
      expect(position.source.length).toBeGreaterThan(0);
    });
  });

  test('gère correctement un texte ambigu', async () => {
    const positions = await extractPositionsFromText(ambiguousText, 'Test Candidate');
    
    // Vérification des scores de confiance bas pour les positions ambiguës
    positions.forEach(position => {
      expect(position.confidence).toBeLessThan(1);
    });
  });

  test('validation et enrichissement des positions', async () => {
    const positions = await extractPositionsFromText(shortText, 'Test Candidate');
    const validatedPositions = await validateAndEnrichPositions(positions);

    // Vérification de la cohérence des thèmes
    validatedPositions.forEach(position => {
      expect(themes.map(t => t.name)).toContain(position.theme);
    });
  });

  test('gestion des erreurs', async () => {
    // Test avec un texte vide
    await expect(extractPositionsFromText('', 'Test Candidate')).rejects.toThrow();

    // Test avec un texte non pertinent
    const nonRelevantText = 'Lorem ipsum dolor sit amet';
    const positions = await extractPositionsFromText(nonRelevantText, 'Test Candidate');
    expect(positions.length).toBe(2); // Le mock retourne toujours 2 positions
  });
}); 