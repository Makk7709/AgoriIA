import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabase } from '@/lib/supabase/config'
import { getCachedResponse, setCachedResponse, generateCacheKey } from '@/lib/cache/responseCache'
import { redis } from '@/lib/redis/config'

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

const CACHE_TTL = 3600 // 1 heure en secondes

async function getPositionsFromCache(): Promise<DatabasePosition[] | null> {
  try {
    const cached = await redis.get('positions:all')
    return cached ? JSON.parse(cached) : null
  } catch (error) {
    console.error('Erreur lors de la récupération du cache des positions:', error)
    return null
  }
}

async function setPositionsInCache(positions: DatabasePosition[]): Promise<void> {
  try {
    await redis.setEx('positions:all', CACHE_TTL, JSON.stringify(positions))
  } catch (error) {
    console.error('Erreur lors de la mise en cache des positions:', error)
  }
}

export async function POST(req: Request) {
  const startTime = Date.now()
  try {
    const { question } = await req.json()
    console.log('Question reçue:', question)

    // Vérifier le cache de la réponse
    const cacheStart = Date.now()
    const cacheKey = generateCacheKey(question)
    const cachedResponse = await getCachedResponse(cacheKey)
    console.log('Temps de vérification du cache:', Date.now() - cacheStart, 'ms')
    
    if (cachedResponse) {
      console.log('Réponse trouvée dans le cache')
      return NextResponse.json({
        content: cachedResponse,
        fromCache: true,
        responseTime: Date.now() - startTime
      })
    }

    // Récupérer les données de Supabase (avec cache)
    const dbStart = Date.now()
    let positions: DatabasePosition[] | null = await getPositionsFromCache()
    
    if (!positions) {
      const { data, error: positionsError } = await supabase
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
        .order('created_at', { ascending: false })

      if (positionsError) {
        console.error('Erreur Supabase:', positionsError)
        throw new Error('Erreur lors de la récupération des données')
      }

      positions = data as DatabasePosition[]
      await setPositionsInCache(positions)
    }
    console.log('Temps de requête Supabase:', Date.now() - dbStart, 'ms')

    // Préparer le contexte pour l'IA
    const contextStart = Date.now()
    const context: FormattedPosition[] = positions?.map(pos => ({
      candidat: pos.candidates[0]?.name,
      parti: pos.candidates[0]?.party,
      theme: pos.themes[0]?.name,
      position: pos.content,
      source: pos.source_url
    })) || []
    console.log('Temps de préparation du contexte:', Date.now() - contextStart, 'ms')

    // Générer la réponse avec OpenAI
    const openaiStart = Date.now()
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Utilisation d'un modèle plus léger
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Question: "${question}"\n\nContexte disponible: ${JSON.stringify(context)}` }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
    console.log('Temps de génération OpenAI:', Date.now() - openaiStart, 'ms')

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('Pas de réponse générée')
    }

    // Mettre en cache la réponse
    const cacheWriteStart = Date.now()
    await setCachedResponse(cacheKey, response)
    console.log('Temps de mise en cache:', Date.now() - cacheWriteStart, 'ms')

    console.log('Réponse générée et mise en cache')
    console.log('Temps total de traitement:', Date.now() - startTime, 'ms')

    return NextResponse.json({
      content: response,
      fromCache: false,
      responseTime: Date.now() - startTime
    })

  } catch (error) {
    console.error('Erreur API:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de votre demande' },
      { status: 500 }
    )
  }
} 