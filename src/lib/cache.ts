import { LRUCache } from 'lru-cache'

// Cache pour les sessions utilisateurs (TTL: 5 minutes)
export const sessionCache = new LRUCache<string, any>({
  max: 500, // Maximum 500 entrées
  ttl: 1000 * 60 * 5, // 5 minutes
})

// Cache pour les profils utilisateurs (TTL: 15 minutes)
export const profileCache = new LRUCache<string, any>({
  max: 1000, // Maximum 1000 entrées
  ttl: 1000 * 60 * 15, // 15 minutes
})

// Fonction pour nettoyer le cache
export const clearCache = () => {
  sessionCache.clear()
  profileCache.clear()
} 