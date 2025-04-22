import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import type { UserResponses } from '@/components/Scoreboard/ResponseForm'
import type { AlignmentScore } from '@/lib/scoring'

// Initialiser le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface SaveResponseParams {
  themeId: string
  responses: UserResponses
  alignmentScores: AlignmentScore[]
  userId?: string // Optionnel, pour une future authentification
}

export async function saveResponse({
  themeId,
  responses,
  alignmentScores,
  userId
}: SaveResponseParams): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier qu'il y a au moins une réponse
    if (Object.keys(responses).length === 0) {
      return {
        success: false,
        error: "Au moins une réponse est requise"
      }
    }

    // Préparer les données à sauvegarder
    const data = {
      id: uuidv4(), // Générer un UUID unique
      theme_id: themeId,
      user_id: userId || uuidv4(), // Utiliser l'ID utilisateur ou en générer un
      responses, // Sera automatiquement converti en JSONB
      alignment_scores: alignmentScores,
      created_at: new Date().toISOString()
    }

    // Insérer dans la base de données
    const { error } = await supabase
      .from('user_responses')
      .insert(data)

    if (error) {
      console.error('Erreur Supabase:', error)
      return {
        success: false,
        error: "Erreur lors de la sauvegarde des réponses"
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Erreur:', error)
    return {
      success: false,
      error: "Une erreur inattendue s'est produite"
    }
  }
} 