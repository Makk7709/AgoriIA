import { createClient } from '@supabase/supabase-js'
import type { Database } from './config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

export async function createCandidate(name: string, party: string) {
  try {
    // Vérification des données d'entrée
    if (!name || !party) {
      throw new Error('Le nom et le parti sont requis')
    }

    // Log des données avant l'insertion
    console.log('Tentative de création du candidat avec les données:', { 
      name, 
      party,
      timestamp: new Date().toISOString(),
      supabaseUrl,
      supabaseAnonKey: supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'missing'
    })

    // Tentative de création du candidat avec logs détaillés
    const response = await supabase
      .from('candidates')
      .insert([
        {
          name,
          party,
          created_at: new Date().toISOString()
        },
      ])
      .select()
      .single()

    // Log complet de la réponse
    console.log('Réponse Supabase complète:', {
      data: response.data,
      error: response.error,
      status: response.status,
      statusText: response.statusText,
      count: response.count,
      timestamp: new Date().toISOString()
    })

    if (response.error) {
      // Log détaillé de l'erreur
      console.error('Erreur détaillée création candidat:', {
        message: response.error.message,
        details: response.error.details,
        hint: response.error.hint,
        code: response.error.code,
        status: response.status,
        statusText: response.statusText,
        timestamp: new Date().toISOString()
      })

      // Vérification des erreurs spécifiques
      if (response.error.code === '23505') {
        throw new Error('Un candidat avec ce nom existe déjà')
      } else if (response.error.code === '23503') {
        throw new Error('Erreur de référence : vérifiez les relations')
      } else if (response.error.code === '42501') {
        throw new Error('Erreur de permission : vous n\'avez pas les droits nécessaires')
      } else {
        throw new Error(`Erreur lors de la création du candidat: ${response.error.message}`)
      }
    }

    // Log de succès
    console.log('Candidat créé avec succès:', response.data)
    return response.data
  } catch (error) {
    // Log de l'erreur complète
    console.error('Erreur lors de la création du candidat:', {
      error,
      message: error instanceof Error ? error.message : 'Erreur inconnue',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    })
    throw error
  }
} 