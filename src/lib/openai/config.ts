import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('Missing OpenAI API key')
}

export const openai = new OpenAI({
  apiKey,
  organization: process.env.OPENAI_ORG_ID,
})

export interface AIAnalysisResult {
  summary: string
  keyPoints: string[]
  alignment: number
  confidence: number
}

export async function analyzePosition(
  content: string,
  userPreferences?: string
): Promise<AIAnalysisResult> {
  const prompt = `Analyze the following political position:
  
${content}

${userPreferences ? `Consider these user preferences: ${userPreferences}` : ''}

Provide:
1. A neutral summary
2. Key points
3. Alignment score (0-100) ${userPreferences ? 'with user preferences' : 'with general progressive values'}
4. Confidence score (0-100) in the analysis

Format: JSON with fields summary, keyPoints (array), alignment (number), confidence (number)`

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a neutral political analyst. Provide objective analysis without bias.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
  })

  const result = JSON.parse(response.choices[0].message.content || '{}')
  return result as AIAnalysisResult
}

export const config = {
  model: "gpt-4-turbo-preview",
  temperature: 0.3,
  maxTokens: 2000,
  systemPrompt: "Vous êtes un assistant civic-tech neutre qui aide à analyser les programmes politiques de manière objective.",
} as const;

export const themes = [
  {
    id: "economy",
    name: "Économie",
    description: "Politiques économiques, emploi, croissance, fiscalité",
    icon: "Scale",
  },
  {
    id: "ecology",
    name: "Écologie",
    description: "Transition écologique, énergie, biodiversité, climat",
    icon: "Leaf",
  },
  {
    id: "security",
    name: "Sécurité",
    description: "Sécurité intérieure, justice, police, défense",
    icon: "Shield",
  },
  {
    id: "education",
    name: "Éducation",
    description: "École, formation, recherche, jeunesse",
    icon: "GraduationCap",
  },
  {
    id: "health",
    name: "Santé",
    description: "Santé publique, hôpital, prévention, dépendance",
    icon: "Heart",
  },
  {
    id: "europe",
    name: "Europe",
    description: "Union européenne, relations internationales, diplomatie",
    icon: "Globe",
  },
  {
    id: "institutions",
    name: "Institutions",
    description: "Démocratie, institutions, décentralisation, réformes",
    icon: "Building",
  },
  {
    id: "social",
    name: "Social",
    description: "Protection sociale, solidarité, logement, culture",
    icon: "Users",
  },
] as const; 