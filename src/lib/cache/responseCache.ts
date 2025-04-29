import { redis } from '../redis/config'

const CACHE_TTL = 3600 // 1 heure en secondes

export async function getCachedResponse(key: string): Promise<string | null> {
  try {
    const cachedResponse = await redis.get(key)
    return cachedResponse
  } catch (error) {
    console.error('Erreur lors de la récupération du cache:', error)
    return null
  }
}

export async function setCachedResponse(key: string, value: string): Promise<void> {
  try {
    await redis.setEx(key, CACHE_TTL, value)
  } catch (error) {
    console.error('Erreur lors de la mise en cache:', error)
  }
}

export function generateCacheKey(question: string): string {
  return `response:${question.toLowerCase().trim()}`
} 