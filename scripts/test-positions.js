import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function insertTestPositions() {
  console.log('🚀 Insertion des positions de test...')

  try {
    // 1. Récupérer les candidats existants
    const { data: candidates, error: candidatesError } = await supabase
      .from('candidates')
      .select('*')

    if (candidatesError) {
      console.error('❌ Erreur lors de la récupération des candidats:', candidatesError)
      return
    }

    console.log('📊 Candidats trouvés:', candidates)

    // 2. Créer des positions pour chaque candidat sur le thème "economie"
    const positions = candidates.map(candidate => ({
      theme_id: 'economie',
      candidate_id: candidate.id,
      content: `Position de ${candidate.name} sur l'économie: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      source_url: `https://example.com/position/${candidate.id}`,
      title: `Position économique de ${candidate.name}`,
      description: `Description de la position de ${candidate.name} sur l'économie`
    }))

    // 3. Insérer les positions
    const { data: insertedPositions, error: positionsError } = await supabase
      .from('positions')
      .upsert(positions)
      .select()

    if (positionsError) {
      console.error('❌ Erreur lors de l\'insertion des positions:', positionsError)
      return
    }

    console.log('✅ Positions insérées avec succès:', insertedPositions)
  } catch (error) {
    console.error('❌ Erreur inattendue:', error)
  }
}

insertTestPositions() 