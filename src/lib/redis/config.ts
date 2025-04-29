import { createClient, RedisClientType } from 'redis'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

export const redis: RedisClientType = createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy: (retries: number) => {
      if (retries > 10) {
        console.error('Trop de tentatives de reconnexion Redis')
        return new Error('Trop de tentatives de reconnexion')
      }
      return Math.min(retries * 100, 3000)
    }
  }
})

redis.on('error', (err: Error) => console.error('Erreur Redis:', err))
redis.on('connect', () => console.log('Connecté à Redis'))
redis.on('reconnecting', () => console.log('Tentative de reconnexion à Redis'))

// Connexion initiale
redis.connect().catch(console.error)

// Gestion de la fermeture propre
process.on('SIGINT', async () => {
  await redis.quit()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await redis.quit()
  process.exit(0)
}) 