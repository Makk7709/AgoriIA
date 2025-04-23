const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.test' })

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testDatabaseStructure() {
  console.log('🧪 Test de la structure de la base de données...')

  try {
    // 1. Test des positions
    const { data: positions, error: positionsError } = await supabase
      .from('positions')
      .select(`
        id,
        theme_id,
        candidate_id,
        content,
        source_url,
        created_at
      `)
      .limit(1)

    if (positionsError) {
      console.error('❌ Erreur lors de la vérification des positions:', positionsError)
      return false
    }

    console.log('✅ Structure des positions vérifiée')

    // 2. Test des candidate_positions
    const { data: candidatePositions, error: cpError } = await supabase
      .from('candidate_positions')
      .select(`
        id,
        position_id,
        candidate_id,
        position,
        explanation,
        created_at
      `)
      .limit(1)

    if (cpError) {
      console.error('❌ Erreur lors de la vérification des candidate_positions:', cpError)
      return false
    }

    console.log('✅ Structure des candidate_positions vérifiée')

    // 3. Test des relations
    const { data: joinedData, error: joinError } = await supabase
      .from('positions')
      .select(`
        id,
        theme_id,
        candidate_id,
        content,
        source_url,
        created_at,
        candidate:candidates(id, name, party),
        theme:themes(id, name)
      `)
      .limit(1)

    if (joinError) {
      console.error('❌ Erreur lors de la vérification des relations:', joinError)
      return false
    }

    console.log('✅ Relations vérifiées')

    return true
  } catch (error) {
    console.error('❌ Erreur inattendue:', error)
    return false
  }
}

async function testMigration() {
  console.log('🚀 Démarrage des tests de migration...')

  try {
    // 1. Vérifier la structure
    const structureValid = await testDatabaseStructure()
    if (!structureValid) {
      console.error('❌ La structure de la base de données n\'est pas valide')
      return false
    }

    // 2. Vérifier les données
    const { data: positions, error: positionsError } = await supabase
      .from('positions')
      .select('*')

    if (positionsError) {
      console.error('❌ Erreur lors de la vérification des données:', positionsError)
      return false
    }

    console.log(`✅ ${positions.length} positions trouvées`)

    const { data: candidatePositions, error: cpError } = await supabase
      .from('candidate_positions')
      .select('*')

    if (cpError) {
      console.error('❌ Erreur lors de la vérification des candidate_positions:', cpError)
      return false
    }

    console.log(`✅ ${candidatePositions.length} candidate_positions trouvées`)

    console.log('✅ Tests terminés avec succès!')
    return true
  } catch (error) {
    console.error('❌ Erreur inattendue:', error)
    return false
  }
}

// Exécuter les tests
testMigration()
  .then(success => {
    if (success) {
      console.log('✨ Tous les tests ont été passés avec succès!')
      process.exit(0)
    } else {
      console.error('❌ Les tests ont échoué')
      process.exit(1)
    }
  })
  .catch(error => {
    console.error('❌ Erreur inattendue:', error)
    process.exit(1)
  }) 