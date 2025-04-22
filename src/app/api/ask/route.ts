import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { supabase } from '@/lib/supabase/config'
import { Position } from '@/lib/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

const SYSTEM_PROMPT = `Tu es un assistant citoyen républicain, neutre, factuel, et pédagogue.
Ta mission : aider l'utilisateur à comprendre les positions politiques en comparant les programmes des candidats.

Règles :
- Toujours rester neutre (pas d'opinion)
- Citer les noms des candidats si la base les contient
- Structurer la réponse avec des titres clairs
- Utiliser un ton républicain : "Comprendre pour mieux choisir"
- Répondre en français avec un style digne et chaleureux
- Utiliser les couleurs de la République (bleu #002654, blanc #ffffff, rouge #EF4135) dans les métaphores si pertinent

Format de réponse :
1. Introduction : contexte de la question
2. Analyse : positions des candidats
3. Conclusion : synthèse neutre et pédagogique

Tu peux t'appuyer sur ces données :
{...positions extraites des thèmes, résumés, scores...}`

export async function POST(request: Request) {
  try {
    const { question, theme } = await request.json()

    const { data: positions, error } = await supabase
      .from('positions')
      .select(`
        id,
        theme_id,
        title,
        description,
        created_at,
        candidate_positions (
          candidate (
            id,
            name,
            party
          )
        )
      `)
      .eq('theme_id', theme) as { data: Position[], error: any }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!positions) {
      return NextResponse.json({ error: 'No positions found' }, { status: 404 })
    }

    // Create messages array for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Question: ${question}\n\nPositions disponibles: ${JSON.stringify(positions)}` }
    ]

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 1000
    })

    const response = completion.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer une réponse."

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error in /api/ask:', error)
    return NextResponse.json(
      { error: "Une erreur s'est produite lors du traitement de votre demande." },
      { status: 500 }
    )
  }
} 