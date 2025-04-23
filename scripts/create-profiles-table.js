const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.test' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createProfilesTable() {
  console.log('🚀 Création de la table profiles...')

  try {
    // Lire le script SQL
    const sqlScript = fs.readFileSync(
      path.join(__dirname, 'create-profiles-table.sql'),
      'utf8'
    )

    // Exécuter le script SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: sqlScript
    })

    if (error) {
      console.error('❌ Erreur lors de la création de la table:', error)
      return false
    }

    console.log('✅ Table profiles créée avec succès!')
    return true
  } catch (error) {
    console.error('❌ Erreur inattendue:', error)
    return false
  }
}

createProfilesTable()
  .then(success => {
    if (success) {
      console.log('✨ Script terminé avec succès!')
      process.exit(0)
    } else {
      console.error('❌ Le script a échoué')
      process.exit(1)
    }
  })
  .catch(error => {
    console.error('❌ Erreur inattendue:', error)
    process.exit(1)
  }) 