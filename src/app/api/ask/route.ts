import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { pinecone } from '@/lib/pinecone'
import { getCachedResponse, setCachedResponse, generateCacheKey } from '@/lib/cache/responseCache'

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
  const startTime = Date.now()
  try {
    const { question } = await req.json()
    console.log("🔎 Question posée :", question)

    // Vérifier le cache de la réponse
    const cacheKey = generateCacheKey(question)
    const cachedResponse = await getCachedResponse(cacheKey)
    if (cachedResponse) {
      console.log('Réponse trouvée dans le cache')
      return NextResponse.json({
        content: cachedResponse,
        fromCache: true,
        responseTime: Date.now() - startTime
      })
    }

    // Générer l'embedding de la question
    const embeddingStart = Date.now()
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: question
    })
    const queryVector = embeddingResponse.data[0].embedding
    console.log('Temps de génération embedding:', Date.now() - embeddingStart, 'ms')

    // Interroger Pinecone
    const pineconeStart = Date.now()
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!)
    const pineconeResponse = await index.query({
      vector: queryVector,
      topK: 5,
      includeMetadata: true
    })
    console.log('Temps de requête Pinecone:', Date.now() - pineconeStart, 'ms')

    // Construire le contexte
    const context = pineconeResponse.matches
      .map((m) => m.metadata?.summary || m.metadata?.position || "")
      .join("\n---\n")
    console.log("📚 Contexte vectoriel utilisé :", context)

    // Générer la réponse avec OpenAI
    const openaiStart = Date.now()
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Question: "${question}"\n\nContexte:\n${context}` }
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
    await setCachedResponse(cacheKey, response)

    console.log('Temps total de traitement:', Date.now() - startTime, 'ms')

    const finalResponse = {
      content: response,
      fromCache: false,
      responseTime: Date.now() - startTime
    }
    console.log("✅ Réponse retournée au client :", finalResponse)
    return NextResponse.json(finalResponse)

  } catch (error) {
    console.error('Erreur API:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de votre demande' },
      { status: 500 }
    )
  }
} 