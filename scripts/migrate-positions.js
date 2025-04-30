const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migratePositions() {
  console.log('🚀 Début de la migration des positions...')

  try {
    // 1. Vérifier la structure de la base de données
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables')

    if (tablesError) {
      console.error('❌ Erreur lors de la vérification des tables:', tablesError)
      return
    }

    console.log('📊 Tables existantes:', tables)

    // 2. Récupérer toutes les positions existantes avec leurs candidats
    const { data: positions, error: positionsError } = await supabase
      .from('positions')
      .select(`
        *,
        candidate:candidates (
          id,
          name,
          party,
          created_at
        )
      `)

    if (positionsError) {
      console.error('❌ Erreur lors de la récupération des positions:', positionsError)
      return
    }

    console.log(`📊 ${positions.length} positions trouvées`)

    // 3. Pour chaque position, créer une entrée dans candidate_positions
    for (const position of positions) {
      // Vérifier si l'entrée existe déjà
      const { data: existingCP, error: checkError } = await supabase
        .from('candidate_positions')
        .select('id')
        .eq('position_id', position.id)
        .eq('candidate_id', position.candidate_id)
        .single()

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = not found
        console.error(`❌ Erreur lors de la vérification de candidate_positions pour la position ${position.id}:`, checkError)
        continue
      }

      if (existingCP) {
        console.log(`ℹ️ Position ${position.id} déjà migrée`)
        continue
      }

      // Créer l'entrée dans candidate_positions
      const { error: cpError } = await supabase
        .from('candidate_positions')
        .insert({
          position_id: position.id,
          candidate_id: position.candidate_id,
          position: 'agree', // Valeur par défaut
          explanation: null
        })

      if (cpError) {
        console.error(`❌ Erreur lors de la création de candidate_positions pour la position ${position.id}:`, cpError)
        continue
      }

      console.log(`✅ Position ${position.id} migrée avec succès`)
    }

    // 4. Vérifier les données migrées
    const { data: migratedData, error: verifyError } = await supabase
      .from('positions')
      .select(`
        id,
        candidate_positions (
          id,
          position,
          explanation
        )
      `)
      .limit(5)

    if (verifyError) {
      console.error('❌ Erreur lors de la vérification des données migrées:', verifyError)
    } else {
      console.log('📊 Exemple de données migrées:', migratedData)
    }

    console.log('✨ Migration terminée avec succès !')
  } catch (error) {
    console.error('❌ Erreur inattendue:', error)
  }
}

migratePositions() 