import { openai } from './config'

export interface AIAnalysis {
  summary: string
  convergences: string[]
  divergences: string[]
  confidence: number
}

export async function analyzePositions(
  themeName: string,
  positions: Array<{ content: string; candidate: { name: string; party: string } }>
): Promise<AIAnalysis> {
  const prompt = `Analyse les positions politiques suivantes sur le thème "${themeName}" :

${positions
  .map(
    (p) => `Position de ${p.candidate.name} (${p.candidate.party}) :
${p.content}
---`
  )
  .join('\n')}

Fournis une analyse structurée avec :
1. Un résumé objectif des différentes positions
2. Les points de convergence entre les candidats
3. Les points de divergence majeurs
4. Un score de confiance (0-100) sur la qualité de l'analyse

Format : JSON avec les champs summary (string), convergences (array), divergences (array), confidence (number)`

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'Tu es un analyste politique neutre et objectif. Ton rôle est de comparer les positions des candidats sans parti pris.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')
  return result as AIAnalysis
} 