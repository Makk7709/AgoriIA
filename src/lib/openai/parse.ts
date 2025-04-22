import OpenAI from 'openai';
import { config } from './config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface Position {
  theme: string;
  position: string;
  summary: string;
  candidate: string;
  confidence: number;
  source: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export async function extractPositionsFromText(
  text: string,
  candidate: string
): Promise<Position[]> {
  if (!text) {
    throw new Error("Le texte ne peut pas être vide");
  }

  const prompt = `
En tant qu'assistant civic-tech neutre, analysez le texte suivant du programme politique de ${candidate} et extrayez les positions par thème.

Texte à analyser :
${text}

Pour chaque thème identifié, fournissez :
1. Le nom du thème (parmi : Économie, Écologie, Sécurité, Éducation, Santé, Europe, Institutions, Social)
2. La position exprimée
3. Un résumé objectif et factuel
4. Un score de confiance (0-1) sur la clarté de la position
5. La source exacte dans le texte

Format de réponse attendu (JSON) :
[
  {
    "theme": "string",
    "position": "string",
    "summary": "string",
    "confidence": number,
    "source": "string"
  }
]

Style : neutre, factuel, civic-tech. Évitez tout parti pris politique.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "Vous êtes un assistant civic-tech neutre qui aide à analyser les programmes politiques de manière objective."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 2000,
    response_format: { type: "json_object" }
  });

  try {
    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("Pas de réponse d'OpenAI");
    }

    const positions = JSON.parse(response);
    return positions.map((pos: any) => ({
      ...pos,
      candidate,
    }));
  } catch (error) {
    console.error("Erreur lors de l'extraction des positions:", error);
    throw error;
  }
}

export async function validateAndEnrichPositions(
  positions: Position[]
): Promise<Position[]> {
  const prompt = `
En tant qu'assistant civic-tech neutre, validez et enrichissez les positions suivantes :

${JSON.stringify(positions, null, 2)}

Pour chaque position :
1. Vérifiez la cohérence du thème
2. Assurez-vous que la position est claire et non ambiguë
3. Améliorez le résumé si nécessaire
4. Ajustez le score de confiance

Format de réponse attendu (JSON) :
[
  {
    "theme": "string",
    "position": "string",
    "summary": "string",
    "candidate": "string",
    "confidence": number,
    "source": "string"
  }
]
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "Vous êtes un assistant civic-tech neutre qui aide à valider et enrichir l'analyse des positions politiques."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 2000,
    response_format: { type: "json_object" }
  });

  try {
    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("Pas de réponse d'OpenAI");
    }

    return JSON.parse(response);
  } catch (error) {
    console.error("Erreur lors de la validation des positions:", error);
    return positions;
  }
} 