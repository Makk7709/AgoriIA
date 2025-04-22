import OpenAI from 'openai';
import { config } from './config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ScoreAnalysis {
  closestCandidate: string;
  agreementAreas: string[];
  disagreementAreas: string[];
  explorationAdvice: string;
}

export async function generateScoreFeedback(
  userResponses: Record<string, string>,
  candidateScores: Record<string, number>,
  candidatePositions: Record<string, Record<string, string>>
): Promise<ScoreAnalysis> {
  const prompt = `
En tant qu'assistant civic-tech neutre, analysez les résultats suivants et fournissez un résumé concis :

Réponses de l'utilisateur :
${JSON.stringify(userResponses, null, 2)}

Scores d'alignement avec les candidats :
${JSON.stringify(candidateScores, null, 2)}

Positions des candidats :
${JSON.stringify(candidatePositions, null, 2)}

Générez un résumé qui inclut :
1. Le candidat avec lequel l'utilisateur s'aligne le plus
2. Les domaines principaux d'accord
3. Les domaines principaux de désaccord
4. Des conseils neutres pour explorer d'autres profils politiques

Style : neutre, factuel, civic-tech. Évitez tout parti pris politique.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "Vous êtes un assistant civic-tech neutre qui aide les citoyens à comprendre leurs alignements politiques."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  const response = completion.choices[0].message.content;
  
  // Parse the response into structured data
  const analysis: ScoreAnalysis = {
    closestCandidate: "",
    agreementAreas: [],
    disagreementAreas: [],
    explorationAdvice: ""
  };

  if (response) {
    const lines = response.split('\n');
    for (const line of lines) {
      if (line.includes("candidat")) {
        analysis.closestCandidate = line.split(":")[1]?.trim() || "";
      } else if (line.includes("accord")) {
        analysis.agreementAreas.push(line.split(":")[1]?.trim() || "");
      } else if (line.includes("désaccord")) {
        analysis.disagreementAreas.push(line.split(":")[1]?.trim() || "");
      } else if (line.includes("conseil")) {
        analysis.explorationAdvice = line.split(":")[1]?.trim() || "";
      }
    }
  }

  return analysis;
} 