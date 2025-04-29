import OpenAI from 'openai';
import { config } from './config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface Position {
  title: string;
  description: string;
  content: string;
  candidate_id: string;
  candidate: {
    id: string;
    name: string;
  };
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export async function extractPositionsFromText(
  text: string,
  candidate: { id: string; name: string }
): Promise<Position[]> {
  if (!text) {
    console.warn("Texte vide fourni à extractPositionsFromText");
    return [];
  }

  if (!candidate?.id || !candidate?.name) {
    console.error("Candidat invalide fourni à extractPositionsFromText:", candidate);
    throw new Error("Candidat invalide");
  }

  const prompt = `Analyse le texte suivant et extrait les positions politiques. Pour chaque position, fournis :
1. Un titre concis
2. Une description détaillée
3. Le contenu exact de la position

Texte à analyser :
${text}

Format de réponse attendu (JSON) :
{
  "positions": [
    {
      "title": "Titre de la position",
      "description": "Description détaillée",
      "content": "Contenu exact de la position"
    }
  ]
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Tu es un expert en analyse de programmes politiques. Ton rôle est d'extraire les positions politiques de manière neutre et objective."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("Pas de réponse d'OpenAI");
    }

    const parsedResponse = JSON.parse(response);
    if (!parsedResponse.positions || !Array.isArray(parsedResponse.positions)) {
      console.error("Format de réponse invalide:", parsedResponse);
      throw new Error("Format de réponse invalide");
    }

    return parsedResponse.positions.map((pos: any) => ({
      ...pos,
      candidate_id: candidate.id,
      candidate: {
        id: candidate.id,
        name: candidate.name
      }
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
{
  "positions": [
    {
      "title": "string",
      "description": "string",
      "content": "string",
      "candidate_id": "string",
      "candidate": {
        "id": "string",
        "name": "string"
      }
    }
  ]
}
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

    const parsedResponse = JSON.parse(response);
    if (!parsedResponse.positions || !Array.isArray(parsedResponse.positions)) {
      console.error("Format de réponse invalide:", parsedResponse);
      throw new Error("Format de réponse invalide");
    }

    return parsedResponse.positions;
  } catch (error) {
    console.error("Erreur lors de la validation des positions:", error);
    return positions;
  }
} 