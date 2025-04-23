const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.test' })

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkDatabaseStructure() {
  console.log('🔍 Vérification de la structure de la base de données...')

  try {
    // 1. Vérifier la table themes
    const { data: themes, error: themesError } = await supabase
      .from('themes')
      .select('*')
      .limit(1)

    if (themesError) {
      console.error('❌ Erreur lors de la vérification de themes:', themesError)
    } else {
      console.log('✅ Structure de themes:', Object.keys(themes[0] || {}))
    }

    // 2. Vérifier la table candidates
    const { data: candidates, error: candidatesError } = await supabase
      .from('candidates')
      .select('*')
      .limit(1)

    if (candidatesError) {
      console.error('❌ Erreur lors de la vérification de candidates:', candidatesError)
    } else {
      console.log('✅ Structure de candidates:', Object.keys(candidates[0] || {}))
    }

    // 3. Vérifier la table positions
    const { data: positions, error: positionsError } = await supabase
      .from('positions')
      .select('*')
      .limit(1)

    if (positionsError) {
      console.error('❌ Erreur lors de la vérification de positions:', positionsError)
    } else {
      console.log('✅ Structure de positions:', Object.keys(positions[0] || {}))
    }

    // 4. Vérifier les relations
    const { data: relations, error: relationsError } = await supabase
      .from('positions')
      .select(`
        *,
        theme:themes (*),
        candidate:candidates (*)
      `)
      .limit(1)

    if (relationsError) {
      console.error('❌ Erreur lors de la vérification des relations:', relationsError)
    } else {
      console.log('✅ Relations vérifiées avec succès')
    }

    // 5. Vérifier les contraintes
    const { data: constraints, error: constraintsError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT
          tc.table_name,
          tc.constraint_name,
          tc.constraint_type,
          kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_name IN ('themes', 'candidates', 'positions', 'candidate_positions')
        ORDER BY tc.table_name, tc.constraint_type;
      `
    })

    if (constraintsError) {
      console.error('❌ Erreur lors de la vérification des contraintes:', constraintsError)
    } else {
      console.log('✅ Contraintes vérifiées avec succès')
    }

    return true
  } catch (error) {
    console.error('❌ Erreur inattendue:', error)
    return false
  }
}

// Exécuter la vérification
checkDatabaseStructure()
  .then(success => {
    if (success) {
      console.log('✨ Vérification terminée avec succès!')
      process.exit(0)
    } else {
      console.error('❌ La vérification a échoué')
      process.exit(1)
    }
  })
  .catch(error => {
    console.error('❌ Erreur inattendue:', error)
    process.exit(1)
  }) 