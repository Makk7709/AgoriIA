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
    console.log('Received request:', { question, theme })

    const { data: positions, error } = await supabase
      .from('positions')
      .select(`
        id,
        theme_id,
        candidate_id,
        content,
        source_url,
        created_at,
        candidate:candidates (
          id,
          name,
          party
        )
      `)
      .eq('theme_id', theme)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!positions) {
      console.log('No positions found for theme:', theme)
      return NextResponse.json({ error: 'No positions found' }, { status: 404 })
    }

    console.log('Found positions:', positions.length)

    // Transform the data to match the Position interface
    const transformedPositions = positions.map(pos => ({
      ...pos,
      candidate: pos.candidate[0]
    })) as Position[]

    // Create messages array for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Question: ${question}\n\nPositions disponibles: ${JSON.stringify(transformedPositions)}` }
    ]

    console.log('Sending request to OpenAI with messages:', messages)

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 1000
    })

    const response = completion.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer une réponse."
    console.log('OpenAI response:', response)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error in /api/ask:', error)
    return NextResponse.json(
      { error: "Une erreur s'est produite lors du traitement de votre demande." },
      { status: 500 }
    )
  }
} 