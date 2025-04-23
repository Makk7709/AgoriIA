import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabase } from '@/lib/supabase/config'

interface DatabasePosition {
  content: string;
  source_url: string;
  candidates: Array<{
    name: string;
    party: string;
  }>;
  themes: Array<{
    name: string;
  }>;
}

interface FormattedPosition {
  candidat: string | undefined;
  parti: string | undefined;
  theme: string | undefined;
  position: string;
  source: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const SYSTEM_PROMPT = `Tu es un assistant citoyen républicain, neutre, factuel, et pédagogue.
Ta mission : aider l'utilisateur à comprendre les positions politiques en comparant les programmes des candidats.

Règles :
- Toujours rester neutre et objectif
- Citer les sources quand disponibles
- Structurer la réponse en 3 parties
- Utiliser un ton républicain et pédagogue
- Répondre en français avec un style digne et chaleureux

Format de réponse OBLIGATOIRE :
1. Introduction
[Contexte de la question et présentation du sujet]

2. Analyse détaillée
[Points clés et analyse factuelle]
- Point 1
- Point 2
- Point 3

3. Conclusion
[Synthèse neutre et pédagogique]`

export async function POST(req: Request) {
  try {
    const { question } = await req.json()
    console.log('Question reçue:', question)

    // Récupérer les données pertinentes de Supabase
    const { data: positions, error: positionsError } = await supabase
      .from('positions')
      .select(`
        content,
        source_url,
        candidates (
          name,
          party
        ),
        themes (
          name
        )
      `)
      .limit(10)

    if (positionsError) {
      console.error('Erreur Supabase:', positionsError)
      throw new Error('Erreur lors de la récupération des données')
    }

    // Préparer le contexte pour l'IA
    const context: FormattedPosition[] = (positions as DatabasePosition[])?.map(pos => ({
      candidat: pos.candidates[0]?.name,
      parti: pos.candidates[0]?.party,
      theme: pos.themes[0]?.name,
      position: pos.content,
      source: pos.source_url
    })) || []

    // Générer la réponse avec OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Question: "${question}"\n\nContexte disponible: ${JSON.stringify(context)}` }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('Pas de réponse générée')
    }

    console.log('Réponse générée:', response)

    return NextResponse.json({
      content: response
    })

  } catch (error) {
    console.error('Erreur API:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de votre demande' },
      { status: 500 }
    )
  }
} 